import { NextResponse } from 'next/server';
import { supabase, genAI, octokit } from '@/lib/clients';

export async function POST(req: Request) {
  try {
    // taskDescription: Nội dung thẻ Jira hoặc tiêu đề PR mới
    // touchedFiles: Mảng các file Dev vừa sửa (VD: ['src/api/payment.ts'])
    // githubPrInfo: (Tùy chọn) Nếu muốn Bot tự động comment thẳng lên GitHub PR
    const { taskDescription, touchedFiles = [], githubPrInfo } = await req.json();

    // 1. Tạo Vector (768 chiều) từ mô tả công việc của Dev mới
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embeddingResult = await embeddingModel.embedContent({
      content: { role: 'user', parts: [{ text: taskDescription }] },
      outputDimensionality: 768,
    } as Parameters<typeof embeddingModel.embedContent>[0]);
    const queryEmbedding = embeddingResult.embedding.values;

    // 2. Gọi hàm RPC 'match_knowledge' đã tạo ở Bước 1 trong Supabase
    const { data: warnings, error } = await supabase.rpc('match_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.70, // Ngưỡng giống nhau 70% trở lên là báo động
      match_count: 3,
      check_files: touchedFiles
    });

    if (error) throw error;

    // 3. Nếu tìm thấy rủi ro VÀ có thông tin GitHub PR -> Cho Bot tự động Comment lên GitHub!
    if (warnings && warnings.length > 0 && githubPrInfo) {
      const topWarning = warnings[0];
      const commentBody = `### ⚠️ CẢNH BÁO RỦI RO TỪ REPOMIND AI\n` +
        `Hệ thống phát hiện tác vụ hoặc file bạn đang chạm vào (\`${topWarning.hot_files.join(', ')}\`) từng gây sự cố nghiêm trọng trong quá khứ!\n\n` +
        `- **Sự cố cũ:** ${topWarning.title}\n` +
        `- **Nguyên nhân gốc:** ${topWarning.root_cause}\n` +
        `- **Cách khắc phục từ người đi trước:** ${topWarning.solution}\n` +
        `- 🔗 [Xem chi tiết PR/Tài liệu gốc tại đây](${topWarning.source_url})`;

      await octokit.rest.issues.createComment({
        owner: githubPrInfo.owner,
        repo: githubPrInfo.repo,
        issue_number: githubPrInfo.pull_number,
        body: commentBody
      });
    }

    return NextResponse.json({ 
      hasWarning: warnings.length > 0, 
      warnings 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
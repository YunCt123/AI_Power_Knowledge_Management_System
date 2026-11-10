import { NextRequest, NextResponse } from 'next/server';
import { supabase, genAI, octokit, generateContentWithFallback } from '@/lib/clients';
import { SchemaType } from '@google/generative-ai';

/**
 * Interface cho GitHub Pull Request Webhook Payload
 */
interface GitHubPullRequestPayload {
  action: string;
  number?: number;
  pull_request?: {
    number: number;
    title: string;
    body?: string | null;
    diff_url?: string;
    html_url: string;
    merged?: boolean;
    user?: {
      login: string;
    };
  };
  repository?: {
    full_name?: string;
    name: string;
    owner: {
      login: string;
    };
  };
  /**
   * Hỗ trợ truyền mockFiles khi giả lập Webhook trên giao diện Demo mà không cần gọi sang GitHub API thật
   */
  mockFiles?: Array<{
    filename: string;
    patch?: string;
  }>;
}

/**
 * Tạo Vector 768 chiều bằng gemini-embedding-001
 */
async function createVector768(text: string): Promise<number[]> {
  const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const embeddingResult = await embeddingModel.embedContent({
    content: { role: 'user', parts: [{ text }] },
    outputDimensionality: 768,
  } as Parameters<typeof embeddingModel.embedContent>[0]);

  return embeddingResult.embedding.values;
}

/**
 * Lấy danh sách file thay đổi từ GitHub PR (hoặc dùng mockFiles nếu đang chạy chế độ Demo giả lập)
 */
async function getChangedFiles(
  owner: string,
  repo: string,
  pull_number: number,
  mockFiles?: Array<{ filename: string; patch?: string }>
): Promise<Array<{ filename: string; patch?: string }>> {
  if (mockFiles && mockFiles.length > 0) {
    return mockFiles;
  }

  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number,
  });

  return files.map((f: { filename: string; patch?: string }) => ({
    filename: f.filename,
    patch: f.patch,
  }));
}

/**
 * POST /api/webhook/github
 * Cổng Webhook GitHub 2-trong-1:
 *  1. Khi PR được Merge (action === 'closed' && pr.merged === true) -> Tự động đúc kết SOP & lưu Vector vào Supabase
 *  2. Khi PR mới mở/cập nhật (action === 'opened' | 'reopened' | 'synchronize') -> Quét rủi ro Vector DB & Comment cảnh báo lên GitHub PR
 */
export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get('x-github-event') || 'pull_request';
    const payload: GitHubPullRequestPayload = await req.json();

    if (event !== 'pull_request' || !payload.pull_request || !payload.repository) {
      return NextResponse.json(
        {
          success: true,
          message: `Bỏ qua sự kiện không phải Pull Request (event="${event}")`,
        },
        { status: 200 }
      );
    }

    const action = payload.action;
    const pr = payload.pull_request;
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const pull_number = pr.number;
    const isSimulated = Boolean(payload.mockFiles && payload.mockFiles.length > 0);

    // ==============================================================
    // TRƯỜNG HỢP 1: THU THẬP TRI THỨC TỰ ĐỘNG (Khi PR được Merge)
    // ==============================================================
    if (action === 'closed' && pr.merged === true) {
      const files = await getChangedFiles(owner, repo, pull_number, payload.mockFiles);
      const hotFiles = files.map((f) => f.filename);
      const codeDiffSummary = files
        .map((f) => `File: ${f.filename}\nChanges:\n${f.patch ?? ''}`)
        .join('\n\n');

      const prompt = `Đóng vai Principal Engineer. Đọc tiêu đề PR, mô tả và đoạn Code Diff dưới đây để đúc kết thành tài liệu xử lý sự cố (SOP) ngắn gọn, súc tích bằng tiếng Việt:
PR Title: ${pr.title}
PR Description: ${pr.body || 'Không có mô tả'}
Code Diff:
${codeDiffSummary.substring(0, 12000)}`;

      const sopJsonText = await generateContentWithFallback(prompt, {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            context: { type: SchemaType.STRING },
            root_cause: { type: SchemaType.STRING },
            solution: { type: SchemaType.STRING },
          },
          required: ['title', 'context', 'root_cause', 'solution'],
        },
      });

      const sop = JSON.parse(sopJsonText);

      // Tạo Vector 768 chiều và lưu vào bảng knowledge_records
      const textToEmbed = `${sop.title}. ${sop.context}. Nguyên nhân: ${sop.root_cause}. Giải pháp: ${sop.solution}`;
      const embeddingVector = await createVector768(textToEmbed);

      const { data: savedRecord, error } = await supabase
        .from('knowledge_records')
        .insert({
          title: sop.title,
          context: sop.context,
          root_cause: sop.root_cause,
          solution: sop.solution,
          hot_files: hotFiles,
          source_type: 'GITHUB_PR',
          source_url: pr.html_url,
          embedding: embeddingVector,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        mode: 'INGESTED_ON_MERGE',
        message: 'Đã tự động học xong kinh nghiệm từ PR vừa Merge và lưu vào Vector DB!',
        data: savedRecord,
      });
    }

    // ==============================================================
    // TRƯỜNG HỢP 2: CẢNH BÁO "ĐIỂM NÓNG" (Khi PR mới mở / cập nhật)
    // ==============================================================
    if (action === 'opened' || action === 'reopened' || action === 'synchronize') {
      const files = await getChangedFiles(owner, repo, pull_number, payload.mockFiles);
      const touchedFiles = files.map((f) => f.filename);

      // Tạo Vector 768 chiều từ tiêu đề + mô tả PR để tìm kiếm ngữ nghĩa
      const queryText = `${pr.title} ${pr.body || ''}`.trim();
      const queryEmbedding = await createVector768(queryText);

      // Quét Supabase bằng hàm RPC match_knowledge
      const { data: warnings, error } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.70,
        match_count: 2,
        check_files: touchedFiles,
      });

      if (error) throw error;

      let commentBody = '';
      let commentedOnGitHub = false;

      if (warnings && warnings.length > 0) {
        const warning = warnings[0];
        commentBody =
          `### 🚨 REPOMIND AI — CẢNH BÁO RỦI RO TỪ LỊCH SỬ HỆ THỐNG\n` +
          `Hệ thống phát hiện PR này chạm vào file nhạy cảm (\`${warning.hot_files.join(', ')}\`) từng gây sự cố nghiêm trọng!\n\n` +
          `- **🔥 Sự cố từng xảy ra:** ${warning.title} (${warning.context})\n` +
          `- **🧠 Nguyên nhân gốc:** ${warning.root_cause}\n` +
          `- **💡 Bài học / SOP bắt buộc:** ${warning.solution}\n` +
          `- 🔗 [Xem PR/Tài liệu gốc tại đây](${warning.source_url})`;

        // Nếu là Webhook từ GitHub thật và có cấu hình token thì tự động comment thẳng lên GitHub PR
        const hasGitHubToken = Boolean(process.env.GITHUB_TOKEN || process.env.GITHUB_PAT);
        if (!isSimulated && hasGitHubToken) {
          try {
            await octokit.rest.issues.createComment({
              owner,
              repo,
              issue_number: pull_number,
              body: commentBody,
            });
            commentedOnGitHub = true;
          } catch (ghErr) {
            console.warn('[GitHub Webhook] Không thể đăng comment lên GitHub thật:', ghErr);
          }
        }
      }

      return NextResponse.json({
        success: true,
        mode: 'CHECKED_ON_OPEN',
        hasWarning: Boolean(warnings && warnings.length > 0),
        warnings: warnings || [],
        commentPreview: commentBody || null,
        commentedOnGitHub,
        message:
          warnings && warnings.length > 0
            ? 'Phát hiện rủi ro nghiêm trọng từ lịch sử hệ thống!'
            : 'PR an toàn, không phát hiện rủi ro lịch sử.',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Đã nhận sự kiện PR (action="${action}") nhưng không thuộc diện xử lý.`,
    });
  } catch (error: unknown) {
    console.error('[GitHub Webhook Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: 'API GitHub Webhook (Ingest on Merge + Warn on Open) đã sẵn sàng!' },
    { status: 200 }
  );
}

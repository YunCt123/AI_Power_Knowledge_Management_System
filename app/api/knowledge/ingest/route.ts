import { NextResponse } from 'next/server';
import { supabase, genAI, octokit, generateContentWithFallback } from '@/lib/clients';
import { SchemaType } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    // Đầu vào: owner (tên tk github), repo (tên repo), pull_number (số PR)
    const { owner, repo, pull_number, authorId } = await req.json();

    // 1. Lấy thông tin PR và danh sách các file bị thay đổi từ GitHub
    const { data: prData } = await octokit.rest.pulls.get({ owner, repo, pull_number });
    const { data: files } = await octokit.rest.pulls.listFiles({ owner, repo, pull_number });

    const hotFiles = files.map((f: { filename: string; patch?: string }) => f.filename);
    const codeDiffSummary = files.map((f: { filename: string; patch?: string }) => `File: ${f.filename}\nChanges:\n${f.patch ?? ''}`).join('\n\n');

    // 2. Dùng Gemini đọc Code Diff và đúc kết bài học (SOP) kèm cơ chế Fallback
    const prompt = `Đóng vai Principal Engineer. Đọc tiêu đề PR, mô tả và đoạn Code Diff dưới đây để đúc kết thành tài liệu xử lý sự cố (SOP) ngắn gọn, súc tích bằng tiếng Việt:
    PR Title: ${prData.title}
    PR Description: ${prData.body}
    Code Diff: ${codeDiffSummary.substring(0, 15000)}`; // Giới hạn ký tự an toàn

    const responseText = await generateContentWithFallback(prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          context: { type: SchemaType.STRING },
          root_cause: { type: SchemaType.STRING },
          solution: { type: SchemaType.STRING }
        },
        required: ["title", "context", "root_cause", "solution"]
      }
    });
    const sop = JSON.parse(responseText);

    // 3. Biến bài học vừa đúc kết thành Vector (Embedding 768 chiều)
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const textToEmbed = `${sop.title}. ${sop.context}. Nguyên nhân: ${sop.root_cause}. Giải pháp: ${sop.solution}`;
    const embeddingResult = await embeddingModel.embedContent({
      content: { role: 'user', parts: [{ text: textToEmbed }] },
      outputDimensionality: 768,
    } as Parameters<typeof embeddingModel.embedContent>[0]);
    const embeddingVector = embeddingResult.embedding.values;

    // 4. Lưu vào bảng knowledge_records trên Supabase
    const { data, error } = await supabase
      .from('knowledge_records')
      .insert({
        title: sop.title,
        context: sop.context,
        root_cause: sop.root_cause,
        solution: sop.solution,
        hot_files: hotFiles,
        source_type: 'GITHUB_PR',
        source_url: prData.html_url,
        author_id: authorId || null,
        embedding: embeddingVector
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { supabase, genAI } from '@/lib/clients';

export async function POST(req: Request) {
  try {
    const { title, context, rootCause, solution, hotFiles } = await req.json();

    // 1. Gộp nội dung để tạo Vector (Embedding)
    const textToEmbed = `${title}. ${context}. Nguyên nhân: ${rootCause}. Giải pháp: ${solution}`;

    // 2. Gọi Gemini để sinh Vector (768 chiều khớp với Supabase pgvector)
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embeddingResult = await embeddingModel.embedContent({
      content: { role: 'user', parts: [{ text: textToEmbed }] },
      outputDimensionality: 768,
    } as Parameters<typeof embeddingModel.embedContent>[0]);
    const embeddingVector = embeddingResult.embedding.values;

    // 3. Lưu thẳng vào Supabase
    const { data, error } = await supabase
      .from('knowledge_records')
      .insert({
        title,
        context,
        root_cause: rootCause,
        solution,
        hot_files: hotFiles,
        source_type: 'JIRA',
        source_url: 'https://jira.mock.com/ticket/123',
        embedding: embeddingVector
      })
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

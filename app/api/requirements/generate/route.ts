import { NextResponse } from 'next/server';
import { supabase, generateContentWithFallback } from '@/lib/clients';
import { SchemaType } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { rawPrompt, authorId } = await req.json();

    const prompt = `Bạn là một System Architect & BA cấp cao. Hãy phân tích yêu cầu lộn xộn sau đây từ khách hàng/Sếp và chuyển nó thành PRD chi tiết cùng sơ đồ luồng Mermaid.js trực quan:\n\n"${rawPrompt}"`;

    // Sử dụng Structured Outputs của Gemini kèm cơ chế tự động Fallback khi quá tải (503)
    const responseText = await generateContentWithFallback(prompt, {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          structured_prd: { type: SchemaType.STRING, description: "Tài liệu PRD chuẩn chỉnh định dạng Markdown (User Story, Business Rules, Edge Cases)" },
          mermaid_code: { type: SchemaType.STRING, description: "Chỉ chứa mã code Mermaid.js (graph TD...) để vẽ flowchart, không bọc trong thẻ markdown ```mermaid" }
        },
        required: ["structured_prd", "mermaid_code"]
      }
    });

    const aiResponse = JSON.parse(responseText);

    // Lưu vào Supabase
    const { data, error } = await supabase
      .from('requirements')
      .insert({
        author_id: authorId || null,
        raw_prompt: rawPrompt,
        structured_prd: aiResponse.structured_prd,
        mermaid_code: aiResponse.mermaid_code,
        status: 'DRAFT'
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
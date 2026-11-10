import { NextResponse } from 'next/server';
import { supabase, genAI } from '@/lib/clients';

/**
 * Trích xuất văn bản thuần từ trường description của Jira (hỗ trợ cả chuỗi thường và Atlassian Document Format - ADF)
 */
function extractJiraDescription(desc: unknown): string {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (typeof desc === 'object') {
    try {
      return JSON.stringify(desc);
    } catch {
      return '';
    }
  }
  return '';
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Chỉ kích hoạt khi có Ticket mới được tạo hoặc cập nhật
    if (
      payload.webhookEvent &&
      payload.webhookEvent !== 'jira:issue_created' &&
      payload.webhookEvent !== 'jira:issue_updated'
    ) {
      return NextResponse.json({ success: true, message: 'Ignored event' });
    }

    const issueKey = payload.issue?.key || 'JIRA-889';
    const summary = payload.issue?.fields?.summary || '';
    const description = extractJiraDescription(payload.issue?.fields?.description);

    if (!summary) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin issue.fields.summary trong Jira payload' },
        { status: 400 }
      );
    }

    // 1. Tạo Vector 768 chiều từ tiêu đề & mô tả Ticket
    const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embeddingResult = await embeddingModel.embedContent({
      content: { role: 'user', parts: [{ text: `${summary} ${description}`.trim() }] },
      outputDimensionality: 768,
    } as Parameters<typeof embeddingModel.embedContent>[0]);
    const queryEmbedding = embeddingResult.embedding.values;

    // 2. Tìm kiếm trong Supabase Vector DB
    const { data: warnings, error } = await supabase.rpc('match_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.70,
      match_count: 1,
      check_files: [],
    });

    if (error) throw error;

    let jiraCommentPosted = false;
    let jiraCommentText = '';

    if (warnings && warnings.length > 0) {
      const warning = warnings[0];
      jiraCommentText = `⚠️ REPOMIND AI (Lớp Phòng Ngự 1 - Jira): Task "${summary}" (${issueKey}) có ngữ nghĩa trùng khớp ${Math.round((warning.similarity || 0.85) * 100)}% với sự cố nghiêm trọng trong quá khứ: "${warning.title}".\n- Các file nhạy cảm cần lưu ý: ${warning.hot_files.join(', ')}\n- Nguyên nhân từng gặp: ${warning.root_cause}\n- Hướng dẫn phòng tránh (SOP): ${warning.solution}`;

      // 3. Nếu đã cấu hình biến môi trường Jira thật thì bắn Comment thẳng lên Jira Cloud
      const jiraDomain = process.env.JIRA_DOMAIN;
      const jiraEmail = process.env.JIRA_EMAIL;
      const jiraApiToken = process.env.JIRA_API_TOKEN;

      if (jiraDomain && jiraEmail && jiraApiToken) {
        const commentBody = {
          body: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: jiraCommentText }],
              },
            ],
          },
        };

        try {
          const jiraRes = await fetch(
            `https://${jiraDomain}/rest/api/3/issue/${issueKey}/comment`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64')}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(commentBody),
            }
          );
          jiraCommentPosted = jiraRes.ok;
        } catch (jiraErr) {
          console.warn('[Jira Webhook] Không thể gửi comment lên Jira Cloud:', jiraErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      issueKey,
      hasWarning: Boolean(warnings && warnings.length > 0),
      warnings: warnings || [],
      jiraCommentPreview: jiraCommentText || null,
      jiraCommentPosted,
      message:
        warnings && warnings.length > 0
          ? `Đã phát hiện rủi ro cho Ticket ${issueKey}!`
          : `Ticket ${issueKey} an toàn.`,
    });
  } catch (error: unknown) {
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
    { status: 'API Jira Webhook (Lớp phòng ngự 1) đã sẵn sàng!' },
    { status: 200 }
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Interface cho GitHub Pull Request Webhook Payload
 */
interface GitHubPullRequestPayload {
  action: string;
  number?: number;
  pull_request?: {
    number: number;
    title: string;
    diff_url: string;
    html_url: string;
    user?: {
      login: string;
    };
  };
  repository?: {
    full_name: string;
    name: string;
    owner?: {
      login: string;
    };
  };
}

/**
 * Bước 1: Lấy nội dung git diff của Pull Request từ GitHub
 * @param diffUrl Đường dẫn diff_url từ payload của GitHub PR
 * @param token GitHub Personal Access Token (PAT)
 */
async function fetchPrDiff(diffUrl: string, token: string): Promise<string> {
  const response = await fetch(diffUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.diff',
      'User-Agent': 'AI-Power-Knowledge-Management-System',
    },
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Không thể lấy git diff từ GitHub (Status: ${response.status}): ${errorDetails}`
    );
  }

  return response.text();
}

/**
 * Bước 2: Gọi Google Gemini 1.5 Flash để tóm tắt và đánh giá Pull Request
 * @param diffText Nội dung git diff
 * @param prTitle Tiêu đề của Pull Request
 * @param apiKey Google Gemini API Key
 */
async function generatePrSummary(
  diffText: string,
  prTitle: string,
  apiKey: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  // Giới hạn độ dài diff tối đa 15,000 ký tự để tối ưu token
  const MAX_DIFF_CHARS = 15000;
  const isTruncated = diffText.length > MAX_DIFF_CHARS;
  const truncatedDiff = isTruncated
    ? `${diffText.slice(0, MAX_DIFF_CHARS)}\n\n... [Lưu ý: Nội dung Git diff đã được cắt gọn do vượt quá 15,000 ký tự]`
    : diffText;

  const prompt = `Bạn là một Senior Tech Lead giàu kinh nghiệm. Hãy đọc nội dung git diff của Pull Request dưới đây và viết một bản tóm tắt phân tích kỹ thuật (PR Summary) bằng định dạng Markdown bằng Tiếng Việt.

Tiêu đề PR: "${prTitle}"

Yêu cầu định dạng cấu trúc kết quả:
## 🤖 AI Pull Request Summary

### 🎯 1. Mục đích chính
(Tóm lược ngắn gọn và súc tích về mục tiêu tính năng, sửa lỗi hoặc cải tiến kỹ thuật mà PR này giải quyết)

### 🔍 2. Những thay đổi quan trọng
(Liệt kê các file/module được chỉnh sửa, tính năng hoặc logic chính được bổ sung/thay đổi dưới dạng bullet points)

### ⚠️ 3. Rủi ro tiềm ẩn & Khuyến nghị (Risks & Recommendations)
(Đánh giá các khía cạnh: bug tiềm ẩn, hiệu năng, an toàn bảo mật, breaking changes và khuyến nghị kiểm thử cần thiết trước khi merge)

---
*Bản tóm tắt được phân tích và tạo tự động bởi Google Gemini 1.5 Flash.*

---
Dưới đây là toàn bộ mã git diff:
\`\`\`diff
${truncatedDiff}
\`\`\`
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  if (!responseText) {
    throw new Error('Gemini API không trả về nội dung tóm tắt hợp lệ.');
  }

  return responseText;
}

/**
 * Bước 3: Đăng nội dung tóm tắt dưới dạng bình luận (comment) vào Pull Request trên GitHub
 * @param repoFullName Tên repo dạng {owner}/{repo} (ví dụ: YunCt123/AI_Power_Knowledge_Management_System)
 * @param prNumber Số thứ tự của Pull Request
 * @param commentBody Nội dung comment markdown
 * @param token GitHub Personal Access Token (PAT)
 */
async function postCommentToGitHub(
  repoFullName: string,
  prNumber: number,
  commentBody: string,
  token: string
): Promise<void> {
  const url = `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'AI-Power-Knowledge-Management-System',
    },
    body: JSON.stringify({ body: commentBody }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Không thể đăng comment lên GitHub PR #${prNumber} (Status: ${response.status}): ${errorDetails}`
    );
  }
}

/**
 * POST /api/webhook/github
 * Xử lý Webhook gửi từ GitHub khi có sự kiện Pull Request
 */
export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get('x-github-event');

    // Parse JSON payload từ request body
    const payload: GitHubPullRequestPayload = await req.json();

    // CHỈ xử lý khi event là 'pull_request' và action là 'opened' hoặc 'synchronize'
    const isTargetEvent = event === 'pull_request';
    const isTargetAction =
      payload.action === 'opened' || payload.action === 'synchronize';

    if (!isTargetEvent || !isTargetAction) {
      return NextResponse.json(
        {
          success: true,
          message: `Bỏ qua sự kiện không thuộc phạm vi xử lý: event="${event}", action="${payload.action || 'unknown'}"`,
        },
        { status: 200 }
      );
    }

    const prNumber = payload.pull_request?.number || payload.number;
    const diffUrl = payload.pull_request?.diff_url;
    const repoFullName = payload.repository?.full_name;
    const prTitle = payload.pull_request?.title || `PR #${prNumber}`;

    if (!prNumber || !diffUrl || !repoFullName) {
      console.error(
        '[GitHub Webhook] Thiếu thông tin bắt buộc trong payload:',
        { prNumber, diffUrl, repoFullName }
      );
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc trong payload PR' },
        { status: 400 }
      );
    }

    // Kiểm tra các biến môi trường
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const githubToken = process.env.GITHUB_PAT;

    if (!geminiApiKey || !githubToken) {
      console.error(
        '[GitHub Webhook] Lỗi cấu hình: Thiếu biến môi trường GEMINI_API_KEY hoặc GITHUB_PAT'
      );
      return NextResponse.json(
        {
          error:
            'Server cấu hình thiếu GEMINI_API_KEY hoặc GITHUB_PAT trong environment variables',
        },
        { status: 500 }
      );
    }

    console.log(
      `[GitHub Webhook] Đang xử lý PR #${prNumber}: "${prTitle}" thuộc repo "${repoFullName}"...`
    );

    // Bước 1: Lấy diff code
    const diffText = await fetchPrDiff(diffUrl, githubToken);

    // Bước 2: Dùng Gemini 1.5 Flash tóm tắt PR
    const summary = await generatePrSummary(diffText, prTitle, geminiApiKey);

    // Bước 3: Đăng comment kết quả lên Pull Request
    await postCommentToGitHub(repoFullName, prNumber, summary, githubToken);

    console.log(
      `[GitHub Webhook] Đã đăng thành công AI summary lên PR #${prNumber} (${repoFullName})!`
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Tạo và gửi bản tóm tắt Pull Request thành công',
        prNumber,
        repository: repoFullName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GitHub Webhook Error]:', error);
    return NextResponse.json(
      {
        error: 'Lỗi máy chủ trong quá trình xử lý Webhook',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "API Webhook đã online và sẵn sàng nhận request!" }, { status: 200 });
}

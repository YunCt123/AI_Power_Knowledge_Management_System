import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import { Octokit } from 'octokit';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder-key');

export const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN || process.env.GITHUB_PAT 
});

/**
 * Danh sách các model Gemini theo thứ tự ưu tiên.
 * Khi model đầu tiên bị quá tải (503/429) hoặc không khả dụng, hệ thống tự động chuyển sang model kế tiếp.
 */
const FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
];

/**
 * Gọi Gemini generateContent kèm cơ chế tự động Fallback qua nhiều model khi gặp lỗi 503/429.
 */
export async function generateContentWithFallback(
  prompt: string,
  generationConfig?: GenerationConfig
): Promise<string> {
  let lastError: unknown;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        ...(generationConfig ? { generationConfig } : {}),
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: unknown) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Gemini Fallback] Model "${modelName}" gặp lỗi, đang thử model dự phòng... Chi tiết: ${message}`);
    }
  }

  throw lastError;
}

/**
 * Tạo Vector Embedding 768 chiều (tương thích với cột vector(768) trên Supabase pgvector).
 */
export async function generateEmbedding768(text: string): Promise<number[]> {
  const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const embeddingResult = await embeddingModel.embedContent({
    content: { role: 'user', parts: [{ text }] },
    outputDimensionality: 768,
  } as Parameters<typeof embeddingModel.embedContent>[0]);

  return embeddingResult.embedding.values;
}
/**
 * Dịch vụ API và truy xuất dữ liệu hệ thống quản trị tri thức.
 * Tích hợp Supabase Client và Vector Search (RAG) sau này.
 */

import type { KnowledgeEntry, StatsCard } from '@/src/types';

export const knowledgeService = {
  /**
   * Lấy danh sách thống kê tổng quan
   */
  async getDashboardStats(): Promise<StatsCard[]> {
    return [
      {
        title: 'SOPs đã Vector hóa',
        value: '1,247',
        change: 14.8,
        changeType: 'increase',
        icon: 'Database',
      },
      {
        title: 'PRs quét tự động',
        value: '342',
        change: 22.4,
        changeType: 'increase',
        icon: 'GitPullRequest',
      },
      {
        title: 'Cảnh báo Just-in-Time',
        value: '89',
        change: 35.1,
        changeType: 'increase',
        icon: 'ShieldCheck',
      },
      {
        title: 'Thời gian Onboarding',
        value: '2 ngày',
        change: 85.0,
        changeType: 'increase',
        icon: 'Clock',
      },
    ];
  },

  /**
   * Truy vấn tìm kiếm ngữ nghĩa RAG (Vector similarity search)
   */
  async searchKnowledge(query: string): Promise<KnowledgeEntry[]> {
    console.log(`[RAG Search] Query: ${query}`);
    return [];
  },
};

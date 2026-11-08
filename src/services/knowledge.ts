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
        title: 'Tổng tri thức',
        value: '1,247',
        change: 12.5,
        changeType: 'increase',
        icon: 'Database',
      },
      {
        title: 'Đóng góp tuần này',
        value: '89',
        change: 8.3,
        changeType: 'increase',
        icon: 'GitPullRequest',
      },
      {
        title: 'Người dùng hoạt động',
        value: '156',
        change: 3.2,
        changeType: 'increase',
        icon: 'Users',
      },
      {
        title: 'Truy vấn RAG',
        value: '432',
        change: 2.1,
        changeType: 'decrease',
        icon: 'Search',
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

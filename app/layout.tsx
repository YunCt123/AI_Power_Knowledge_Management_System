import type { Metadata } from 'next';
import { ThemeProvider } from '@/src/components/providers/ThemeProvider';
import { ToastContainer } from '@/src/components/common/ToastContainer';
import './globals.css';

export const metadata: Metadata = {
  title: 'RepoMind – Hệ thống AI Quản trị Tri thức Ngầm & Cảnh báo Rủi ro Just-in-Time',
  description:
    'Nền tảng AI đúc kết SOP từ Code Diff, chuyển hóa yêu cầu thành PRD & Flowchart và cảnh báo rủi ro Just-in-Time trên GitHub & Jira',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}

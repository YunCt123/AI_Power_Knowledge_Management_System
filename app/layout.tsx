import type { Metadata } from 'next';
import { ThemeProvider } from '@/src/components/providers/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AIKMS - Hệ thống Quản trị Tri thức AI & Tối ưu Vận hành',
  description:
    'Hệ thống thu thập tri thức ngầm, tự động hóa quy trình & hỏi đáp RAG Chatbot thông minh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

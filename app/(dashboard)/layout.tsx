import { MainLayout } from '@/src/layouts/MainLayout';

/**
 * Dashboard Layout
 * Wraps dashboard routes with MainLayout.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}

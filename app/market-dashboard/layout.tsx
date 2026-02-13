import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Dashboard | Finance Quest',
  description: 'Interactive market dashboard with charts, analysis tools, and portfolio tracking for informed investing.',
};

export default function MarketDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

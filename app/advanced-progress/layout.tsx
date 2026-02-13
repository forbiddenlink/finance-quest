import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced Progress Tracking | Finance Quest',
  description: 'Deep dive into your financial learning journey with advanced metrics and personalized insights.',
};

export default function AdvancedProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

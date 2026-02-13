import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Analytics | Finance Quest',
  description: 'Detailed analytics on your learning progress, quiz performance, and skill development over time.',
};

export default function LearningAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

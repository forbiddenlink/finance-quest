import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Learning Progress | Finance Quest',
  description: 'Track your financial literacy journey with achievements, streaks, and personalized learning analytics.',
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

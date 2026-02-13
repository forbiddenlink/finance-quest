import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 7: Investing Fundamentals | Finance Quest',
  description: 'Start investing with confidence by understanding stocks, bonds, mutual funds, and market basics.',
};

export default function Chapter7Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

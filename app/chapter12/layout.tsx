import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 12: Advanced Investing | Finance Quest',
  description: 'Master advanced investment strategies including options, ETFs, and portfolio optimization.',
};

export default function Chapter12Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

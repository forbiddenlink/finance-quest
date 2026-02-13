import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 14: Financial Independence | Finance Quest',
  description: 'Achieve financial independence with FIRE strategies, passive income, and wealth building.',
};

export default function Chapter14Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

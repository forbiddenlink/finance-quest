import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 9: Tax Strategies | Finance Quest',
  description: 'Understand tax fundamentals and legal strategies to minimize your tax burden and maximize savings.',
};

export default function Chapter9Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

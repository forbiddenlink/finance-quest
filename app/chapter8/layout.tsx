import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 8: Retirement Planning | Finance Quest',
  description: 'Plan for retirement with 401(k)s, IRAs, and strategies to build wealth for your golden years.',
};

export default function Chapter8Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

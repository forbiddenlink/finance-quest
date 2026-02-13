import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 2: Budgeting Basics | Finance Quest',
  description: 'Learn essential budgeting techniques to track spending, save money, and achieve your financial goals.',
};

export default function Chapter2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 17: Cryptocurrency & Digital Assets | Finance Quest',
  description: 'Understand cryptocurrency, blockchain technology, and digital asset investment strategies.',
};

export default function Chapter17Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

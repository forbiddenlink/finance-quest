import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 13: Business Finance | Finance Quest',
  description: 'Learn business finance fundamentals including entrepreneurship, cash flow, and business credit.',
};

export default function Chapter13Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

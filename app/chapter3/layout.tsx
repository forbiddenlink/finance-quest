import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 3: Banking & Accounts | Finance Quest',
  description: 'Master banking fundamentals including account types, fees, and choosing the right financial institutions.',
};

export default function Chapter3Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

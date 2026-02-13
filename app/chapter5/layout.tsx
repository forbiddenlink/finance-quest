import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 5: Emergency Funds | Finance Quest',
  description: 'Build a financial safety net with emergency fund strategies to protect against unexpected expenses.',
};

export default function Chapter5Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

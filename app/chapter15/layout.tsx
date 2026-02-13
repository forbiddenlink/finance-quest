import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 15: Behavioral Finance | Finance Quest',
  description: 'Understand cognitive biases and behavioral patterns that affect financial decision-making.',
};

export default function Chapter15Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

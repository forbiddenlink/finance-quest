import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 1: Money Psychology | Finance Quest',
  description: 'Understand your relationship with money and develop a healthy financial mindset for long-term success.',
};

export default function Chapter1Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

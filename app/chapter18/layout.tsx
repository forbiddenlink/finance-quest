import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 18: Financial Mastery | Finance Quest',
  description: 'Integrate all financial concepts and develop your personalized wealth-building strategy.',
};

export default function Chapter18Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impact & Social Responsibility | Finance Quest',
  description: 'Explore socially responsible investing and how to make a positive financial impact.',
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

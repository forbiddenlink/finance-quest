import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 4: Credit & Debt | Finance Quest',
  description: 'Understand credit scores, manage debt strategically, and use credit responsibly to build wealth.',
};

export default function Chapter4Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

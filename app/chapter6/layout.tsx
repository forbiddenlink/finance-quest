import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 6: Insurance Essentials | Finance Quest',
  description: 'Learn about health, auto, life, and property insurance to protect yourself and your assets.',
};

export default function Chapter6Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

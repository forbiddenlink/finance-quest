import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 16: Global Markets | Finance Quest',
  description: 'Explore international investing, currency markets, and global economic factors.',
};

export default function Chapter16Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 10: Real Estate | Finance Quest',
  description: 'Navigate real estate investing, home buying, and property ownership for wealth building.',
};

export default function Chapter10Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

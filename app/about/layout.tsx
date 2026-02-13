import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Finance Quest | Our Mission & Expertise',
  description: 'Learn about Finance Quest, our mission to democratize financial literacy, and the expertise behind our educational platform.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

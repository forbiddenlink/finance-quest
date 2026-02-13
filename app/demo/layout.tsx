import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Platform Demo | Finance Quest',
  description: 'Experience Finance Quest with a live demo of our financial literacy platform features.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

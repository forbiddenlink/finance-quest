import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Assessment | Finance Quest',
  description: 'Take a personalized financial assessment to discover your knowledge level and get tailored learning recommendations.',
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

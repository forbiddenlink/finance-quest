import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Literacy Curriculum | Finance Quest',
  description: 'Complete financial education curriculum with 18 chapters covering budgeting, investing, taxes, and wealth building.',
};

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

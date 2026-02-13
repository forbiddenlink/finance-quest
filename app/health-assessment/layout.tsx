import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Health Assessment | Finance Quest',
  description: 'Evaluate your financial health across key areas including savings, debt, investments, and emergency preparedness.',
};

export default function HealthAssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Calculators | Finance Quest',
  description: 'Professional financial calculators for budgeting, debt payoff, retirement planning, investment analysis, and more.',
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

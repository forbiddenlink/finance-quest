import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Crisis Simulation | Finance Quest',
  description: 'Practice handling financial emergencies through interactive crisis simulation scenarios.',
};

export default function CrisisSimulationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Overview | Finance Quest',
  description: 'View real-time market data, stock indices, and financial news to stay informed about market trends.',
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

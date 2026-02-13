import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Finance Quest',
  description: 'Terms of service for Finance Quest - usage guidelines and legal agreements.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

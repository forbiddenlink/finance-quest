import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Finance Quest',
  description: 'Privacy policy for Finance Quest - how we collect, use, and protect your personal information.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

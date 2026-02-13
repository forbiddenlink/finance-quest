import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 11: Estate Planning | Finance Quest',
  description: 'Protect your legacy with wills, trusts, and estate planning strategies for wealth transfer.',
};

export default function Chapter11Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared/ui/ToastProvider";
import ProgressNavigation from "@/components/shared/ui/ProgressNavigation";
import ErrorBoundary from "@/components/shared/ui/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Quest - Master Your Money, Master Your Future",
  description: "Transform from financial novice to money master through AI-powered coaching, 17 interactive chapters, 13+ professional calculators, and real-world financial scenarios. Built for the 64% of Americans struggling with financial literacy.",
  keywords: "financial literacy, personal finance education, money management, investment calculator, budgeting, debt payoff, retirement planning, AI financial coaching",
  authors: [{ name: "Finance Quest Team" }],
  creator: "Finance Quest",
  publisher: "Finance Quest",
  openGraph: {
    title: "Finance Quest - AI-Powered Financial Literacy Platform",
    description: "Master personal finance through interactive learning, professional calculators, and genuine AI coaching. 17 chapters covering everything from money psychology to advanced investments.",
    url: "https://finance-quest.vercel.app",
    siteName: "Finance Quest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Quest - Master Your Financial Future",
    description: "Learn financial literacy through AI-powered education and professional-grade tools.",
    creator: "@financequest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification",
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ToastProvider>
            <ProgressNavigation />
            <main>
              {children}
            </main>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

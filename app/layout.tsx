import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared/ui/ToastProvider";
import EnhancedProgressNavigation from "@/components/shared/ui/EnhancedProgressNavigation";
import ErrorBoundary from "@/components/shared/ui/ErrorBoundary";
import { theme } from '@/lib/theme';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Add Inter for enhanced typography
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Add JetBrains Mono for financial data
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: "Finance Quest - Master Your Money, Master Your Future",
  description: "Transform from financial novice to money master through AI-powered coaching, 17 interactive chapters, 13+ professional calculators, and real-world financial scenarios. Built for the 64% of Americans struggling with financial literacy.",
  keywords: "financial literacy, personal finance education, money management, investment calculator, budgeting, debt payoff, retirement planning, AI financial coaching",
  authors: [{ name: "Finance Quest Team" }],
  creator: "Finance Quest",
  publisher: "Finance Quest",
  manifest: "/manifest.json",
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
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Apple touch icon for legacy validation tools */}
        <link rel="apple-touch-icon" href="/favicon.svg" />

        {/* Theme and viewport - Progressive enhancement for supported browsers */}
        {/* Note: theme-color not supported in Firefox/Opera but provides enhanced UX in Chrome/Safari */}
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="dark light" />

        {/* PWA support */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Finance Quest" />
      </head>
      <body className={`font-sans antialiased ${theme.utils.pageBackground()}`}>
        <ErrorBoundary>
          <ToastProvider>
            {/* Enhanced Navigation System */}
            <EnhancedProgressNavigation />

            {/* Main Content Area with Professional Styling */}
            <main className="relative">
              {/* Background Effects */}
              <div className="fixed inset-0 -z-10">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 opacity-90" />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.02] bg-grid-pattern" />

                {/* Ambient glow effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl" />
              </div>

              {/* Content wrapper */}
              <div className="relative z-10 min-h-screen">
                {children}
              </div>
            </main>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

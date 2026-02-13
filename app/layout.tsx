import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import { viewport } from './viewport';
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

export { viewport };

export const metadata: Metadata = {
  title: "Finance Quest - Master Your Money, Master Your Future",
  description: "Master personal finance with AI coaching, 17 chapters, and professional calculators. Learn budgeting, investing, and debt management.",
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
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon-167x167.png', sizes: '167x167', type: 'image/png' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' }
    ],
    other: [
      { rel: 'apple-touch-icon', url: '/icons/apple-touch-icon.png' }
    ]
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Finance Quest'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} overflow-y-auto`}>
      <body className={`font-sans antialiased relative ${theme.utils.pageBackground()}`}>
        <ErrorBoundary>
          <ToastProvider>
            {/* Background Effects */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 opacity-90" />
              <div className="absolute inset-0 opacity-[0.02] bg-grid-pattern" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl" />
            </div>

            {/* Enhanced Navigation System */}
            <EnhancedProgressNavigation />

            {/* Main Content */}
            <main className="relative z-10 min-h-screen">
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 mt-auto">
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Finance Quest. For educational purposes only.
                  </p>
                  <nav className="flex items-center gap-6">
                    <a href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                      About
                    </a>
                    <a href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                    <a href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </nav>
                </div>
              </div>
            </footer>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

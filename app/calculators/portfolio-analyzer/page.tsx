'use client';

import PortfolioAnalyzerCalculator from '@/components/shared/calculators/PortfolioAnalyzerCalculator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { theme } from '@/lib/theme';

export default function PortfolioAnalyzerPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className={`${theme.backgrounds.glass}/80 backdrop-blur-xl border-b ${theme.borderColors.primary}/50 sticky top-0 z-10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/calculators"
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Calculators
                            </Link>
                            <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>Portfolio Analyzer</h1>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Investment Track
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PortfolioAnalyzerCalculator />
            </main>
        </div>
    );
}

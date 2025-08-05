'use client';

import EnhancedCompoundInterestCalculator from '@/components/shared/calculators/EnhancedCompoundInterestCalculator';

export default function EnhancedCompoundInterestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        AI-Enhanced Compound Interest Calculator
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Professional-grade calculator with advanced visualizations and AI learning insights
                    </p>
                </div>
                <EnhancedCompoundInterestCalculator />
            </div>
        </div>
    );
}

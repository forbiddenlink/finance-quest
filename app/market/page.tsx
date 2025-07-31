'use client';

import React from 'react';
import MarketDashboard from '@/components/shared/ui/MarketDashboard';
import { useProgressStore } from '@/lib/store/progressStore';

export default function MarketDashboardPage() {
  const recordCalculatorUsage = useProgressStore(state => state.recordCalculatorUsage);

  // Track tool usage when component mounts
  React.useEffect(() => {
    recordCalculatorUsage('market-dashboard');
  }, [recordCalculatorUsage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <MarketDashboard />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import MarketDashboard from '@/components/shared/ui/MarketDashboard';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

export default function MarketDashboardPage() {
  const recordCalculatorUsage = useProgressStore(state => state.recordCalculatorUsage);

  // Track tool usage when component mounts
  React.useEffect(() => {
    recordCalculatorUsage('market-dashboard');
  }, [recordCalculatorUsage]);

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary} py-8`}>
      <div className="container mx-auto px-4">
        <MarketDashboard />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import MarketDashboard from '@/components/shared/ui/MarketDashboard';
import { useProgressActions } from '@/lib/context/ProgressContext';

export default function MarketDashboardPage() {
  const progressActions = useProgressActions();

  // Track tool usage when component mounts
  React.useEffect(() => {
    progressActions.useCalculator('market-dashboard');
  }, [progressActions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <MarketDashboard />
      </div>
    </div>
  );
}

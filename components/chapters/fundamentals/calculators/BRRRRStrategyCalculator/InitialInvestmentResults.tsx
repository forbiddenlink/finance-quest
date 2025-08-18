import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/financial';
import { BRRRRResult } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface InitialInvestmentResultsProps {
  analysis: BRRRRResult['initialInvestment'];
}

export function InitialInvestmentResults({ analysis }: InitialInvestmentResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Initial Investment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Total Costs</div>
            <div className="text-2xl font-bold">{formatCurrency(analysis.totalCosts)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Cash Required</div>
            <div className="text-2xl font-bold">{formatCurrency(analysis.cashRequired)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Loan Amount</div>
            <div className="text-2xl font-bold">{formatCurrency(analysis.loanAmount)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Initial Equity</div>
            <div className="text-2xl font-bold">{formatCurrency(analysis.initialEquity)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


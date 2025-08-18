import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { BRRRRResult } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface RefinanceAnalysisResultsProps {
  analysis: BRRRRResult['refinanceAnalysis'];
}

export function RefinanceAnalysisResults({ analysis }: RefinanceAnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Refinance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Loan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">New Loan Amount</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.newLoanAmount)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">New Monthly Payment</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.newMonthlyPayment)}</div>
            </div>
          </div>

          {/* Cash Out and Equity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Cash Out Amount</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.cashOutAmount)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Equity After Refinance</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.equityAfterRefinance)}</div>
            </div>
          </div>

          {/* Breakeven Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Months to Break Even</div>
              <div className="text-2xl font-bold">{analysis.breakEvenAnalysis.monthsToBreakEven} months</div>
            </div>
            <div>
              <div className="text-sm font-medium">Return on Investment</div>
              <div className="text-2xl font-bold">
                {formatPercentage(analysis.breakEvenAnalysis.returnOnInvestment)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


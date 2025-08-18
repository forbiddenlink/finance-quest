import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { BRRRRResult } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface RentalAnalysisResultsProps {
  analysis: BRRRRResult['rentalAnalysis'];
}

export function RentalAnalysisResults({ analysis }: RentalAnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rental Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Income and Expenses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium">Gross Annual Rent</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.grossRent)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Operating Expenses</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.operatingExpenses)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Net Operating Income</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.netOperatingIncome)}</div>
            </div>
          </div>

          {/* Cash Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Monthly Cash Flow</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.cashFlow.monthly)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Annual Cash Flow</div>
              <div className="text-2xl font-bold">{formatCurrency(analysis.cashFlow.annual)}</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium">Cap Rate</div>
              <div className="text-2xl font-bold">{formatPercentage(analysis.metrics.capRate)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Cash on Cash Return</div>
              <div className="text-2xl font-bold">{formatPercentage(analysis.metrics.cashOnCashReturn)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Rent to Value</div>
              <div className="text-2xl font-bold">{formatPercentage(analysis.metrics.rentToValue)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Operating Expense Ratio</div>
              <div className="text-2xl font-bold">{formatPercentage(analysis.metrics.operatingExpenseRatio)}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Debt Service Coverage Ratio</div>
              <div className="text-2xl font-bold">{analysis.metrics.debtServiceCoverageRatio.toFixed(2)}x</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


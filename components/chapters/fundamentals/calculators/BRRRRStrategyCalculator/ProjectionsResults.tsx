import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { BRRRRResult } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface ProjectionsResultsProps {
  projections: BRRRRResult['projections'];
  initialInvestment: BRRRRResult['initialInvestment'];
}

export function ProjectionsResults({ projections, initialInvestment }: ProjectionsResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">10-Year Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Year</th>
                <th className="text-right p-2">Property Value</th>
                <th className="text-right p-2">Equity</th>
                <th className="text-right p-2">NOI</th>
                <th className="text-right p-2">Cash Flow</th>
                <th className="text-right p-2">Total Return</th>
              </tr>
            </thead>
            <tbody>
              {/* Initial Year */}
              <tr className="border-b bg-muted/50">
                <td className="p-2">0</td>
                <td className="text-right p-2">{formatCurrency(initialInvestment.totalCosts)}</td>
                <td className="text-right p-2">{formatCurrency(initialInvestment.initialEquity)}</td>
                <td className="text-right p-2">-</td>
                <td className="text-right p-2">-</td>
                <td className="text-right p-2">-</td>
              </tr>
              {/* Projected Years */}
              {projections.map((year) => (
                <tr key={year.year} className="border-b hover:bg-muted/50">
                  <td className="p-2">{year.year}</td>
                  <td className="text-right p-2">{formatCurrency(year.propertyValue)}</td>
                  <td className="text-right p-2">{formatCurrency(year.equity)}</td>
                  <td className="text-right p-2">{formatCurrency(year.netOperatingIncome)}</td>
                  <td className="text-right p-2">{formatCurrency(year.cashFlow)}</td>
                  <td className="text-right p-2">{formatPercentage(year.totalReturn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium">Total Appreciation</div>
            <div className="text-xl font-bold">
              {formatCurrency(
                projections[projections.length - 1].propertyValue - initialInvestment.totalCosts
              )}
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium">Total Cash Flow</div>
            <div className="text-xl font-bold">
              {formatCurrency(
                projections.reduce((sum, year) => sum + year.cashFlow, 0)
              )}
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium">Final ROI</div>
            <div className="text-xl font-bold">
              {formatPercentage(projections[projections.length - 1].totalReturn)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


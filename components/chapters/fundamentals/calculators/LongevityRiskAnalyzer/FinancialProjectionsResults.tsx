import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/financial';
import { LongevityRiskResult } from '@/lib/hooks/calculators/useLongevityRisk';

interface FinancialProjectionsResultsProps {
  projections: LongevityRiskResult['financialProjections'];
  currentAge: number;
}

export function FinancialProjectionsResults({ projections, currentAge }: FinancialProjectionsResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Financial Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Age</th>
                <th className="text-right p-2">Savings</th>
                <th className="text-right p-2">Income</th>
                <th className="text-right p-2">Expenses</th>
                <th className="text-right p-2">Net Worth</th>
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((year) => (
                <tr
                  key={year.age}
                  className={`border-b hover:bg-muted/50 ${
                    year.fundingStatus === 'critical'
                      ? 'bg-red-50'
                      : year.fundingStatus === 'warning'
                      ? 'bg-yellow-50'
                      : ''
                  }`}
                >
                  <td className="p-2">{year.age}</td>
                  <td className="text-right p-2">{formatCurrency(year.savings)}</td>
                  <td className="text-right p-2">{formatCurrency(year.income)}</td>
                  <td className="text-right p-2">{formatCurrency(year.expenses)}</td>
                  <td className="text-right p-2">{formatCurrency(year.netWorth)}</td>
                  <td className="text-center p-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        year.fundingStatus === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : year.fundingStatus === 'warning'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {year.fundingStatus.charAt(0).toUpperCase() + year.fundingStatus.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium">Final Net Worth</div>
            <div className="text-xl font-bold">
              {formatCurrency(projections[projections.length - 1].netWorth)}
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium">Years Projected</div>
            <div className="text-xl font-bold">
              {projections[projections.length - 1].age - currentAge}
            </div>
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium">Critical Years</div>
            <div className="text-xl font-bold">
              {projections.filter(p => p.fundingStatus === 'critical').length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


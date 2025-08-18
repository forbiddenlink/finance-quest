import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/financial';
import { LongevityRiskResult } from '@/lib/hooks/calculators/useLongevityRisk';

interface HealthcareProjectionsResultsProps {
  projections: LongevityRiskResult['healthcareProjections'];
  currentAge: number;
}

export function HealthcareProjectionsResults({ projections, currentAge }: HealthcareProjectionsResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Healthcare Cost Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Annual Costs Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Age</th>
                  <th className="text-right p-2">Basic Care</th>
                  <th className="text-right p-2">Chronic Care</th>
                  <th className="text-right p-2">Long-Term Care</th>
                  <th className="text-right p-2">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {projections.annualCosts.map((year) => (
                  <tr key={year.age} className="border-b hover:bg-muted/50">
                    <td className="p-2">{year.age}</td>
                    <td className="text-right p-2">{formatCurrency(year.basicCare)}</td>
                    <td className="text-right p-2">{formatCurrency(year.chronicCare)}</td>
                    <td className="text-right p-2">{formatCurrency(year.longTermCare)}</td>
                    <td className="text-right p-2">{formatCurrency(year.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lifetime Costs Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expected Lifetime Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Expected Total</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(projections.lifetimeCosts.expectedTotal)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Worst Case Scenario</div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(projections.lifetimeCosts.worstCase)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Coverage Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Insurance Coverage</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(projections.lifetimeCosts.insuranceCoverage)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Out of Pocket</div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(projections.lifetimeCosts.outOfPocket)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm font-medium">Average Annual Cost</div>
              <div className="text-xl font-bold">
                {formatCurrency(
                  projections.lifetimeCosts.expectedTotal /
                  (projections.annualCosts.length || 1)
                )}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm font-medium">Years Projected</div>
              <div className="text-xl font-bold">
                {projections.annualCosts.length}
              </div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-sm font-medium">Coverage Ratio</div>
              <div className="text-xl font-bold">
                {((projections.lifetimeCosts.insuranceCoverage /
                  projections.lifetimeCosts.expectedTotal) *
                  100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


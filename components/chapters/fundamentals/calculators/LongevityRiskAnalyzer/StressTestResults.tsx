import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { AlertTriangle, TrendingDown, Clock, Activity } from 'lucide-react';
import { LongevityRiskResult } from '@/lib/hooks/calculators/useLongevityRisk';

interface StressTestResultsProps {
  stressTests: LongevityRiskResult['stressTests'];
  currentSavings: number;
}

export function StressTestResults({ stressTests, currentSavings }: StressTestResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Stress Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Early Retirement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Early Retirement Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Feasibility</div>
                  <div className={`text-xl font-bold ${
                    stressTests.earlyRetirement.feasible
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {stressTests.earlyRetirement.feasible ? 'Feasible' : 'Not Recommended'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Financial Impact</div>
                  <div className="text-xl font-bold text-yellow-600">
                    {formatCurrency(stressTests.earlyRetirement.impact)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Downturn */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Market Downturn Resilience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Recovery Period</div>
                  <div className="text-xl font-bold">
                    {stressTests.marketDownturn.recoveryPeriod} years
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Minimum Portfolio Value</div>
                  <div className="text-xl font-bold text-yellow-600">
                    {formatCurrency(stressTests.marketDownturn.minimumSavings)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPercentage(
                      (stressTests.marketDownturn.minimumSavings / currentSavings - 1) * 100
                    )} change
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Inflation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                High Inflation Scenario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Additional Savings Needed</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(stressTests.highInflation.additionalSavingsNeeded)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Impact on Expenses</div>
                  <div className="text-xl font-bold">
                    +{formatPercentage(stressTests.highInflation.impactOnExpenses * 100)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Event */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Major Health Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Cost Impact</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(stressTests.healthEvent.costImpact)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Recovery Time</div>
                  <div className="text-xl font-bold">
                    {stressTests.healthEvent.recoveryTime} months
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}


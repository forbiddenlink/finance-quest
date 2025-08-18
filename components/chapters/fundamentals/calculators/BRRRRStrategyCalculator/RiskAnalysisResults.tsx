import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/financial';
import { AlertTriangle } from 'lucide-react';
import { BRRRRResult } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface RiskAnalysisResultsProps {
  analysis: BRRRRResult['riskAnalysis'];
}

export function RiskAnalysisResults({ analysis }: RiskAnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Risk Score */}
          <div>
            <div className="text-sm font-medium">Risk Score</div>
            <div className="text-2xl font-bold">{analysis.score}</div>
          </div>

          {/* Risk Factors */}
          <div>
            <div className="text-sm font-medium mb-2">Risk Factors</div>
            <div className="space-y-2">
              {analysis.factors.map((factor, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    factor.risk === 'high'
                      ? 'bg-red-50'
                      : factor.risk === 'moderate'
                      ? 'bg-yellow-50'
                      : 'bg-green-50'
                  }`}
                >
                  <AlertTriangle className={`h-5 w-5 shrink-0 ${
                    factor.risk === 'high'
                      ? 'text-red-500'
                      : factor.risk === 'moderate'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{factor.factor}</div>
                    <div className="text-sm text-muted-foreground">{factor.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stress Tests */}
          <div>
            <div className="text-sm font-medium mb-2">Stress Test Results</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">20% Higher Vacancy</div>
                <div className="font-medium">{formatCurrency(analysis.stressTests.vacancyIncrease)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">10% Lower Rent</div>
                <div className="font-medium">{formatCurrency(analysis.stressTests.rentDecrease)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">15% Higher Expenses</div>
                <div className="font-medium">{formatCurrency(analysis.stressTests.expenseIncrease)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">10% Lower Property Value</div>
                <div className="font-medium">{formatCurrency(analysis.stressTests.valueDecrease)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


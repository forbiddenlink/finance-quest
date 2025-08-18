import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/financial';
import { BRRRRResult } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface RehabAnalysisResultsProps {
  analysis: BRRRRResult['rehabAnalysis'];
}

export function RehabAnalysisResults({ analysis }: RehabAnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rehab Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium">Total Rehab Costs</div>
            <div className="text-2xl font-bold">{formatCurrency(analysis.totalRehabCosts)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Contingency Amount</div>
            <div className="text-2xl font-bold">{formatCurrency(analysis.contingencyAmount)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Total Holding Costs</div>
            <div className="text-2xl font-bold">{formatCurrency(analysis.totalHoldingCosts)}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Timeline Impact</div>
            <div className="text-2xl font-bold">{analysis.projectedTimelineImpact} months</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


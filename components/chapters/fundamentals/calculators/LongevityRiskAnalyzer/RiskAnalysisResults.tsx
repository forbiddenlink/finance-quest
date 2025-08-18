import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { LongevityRiskResult } from '@/lib/hooks/calculators/useLongevityRisk';

interface RiskAnalysisResultsProps {
  analysis: LongevityRiskResult['riskAnalysis'];
}

export function RiskAnalysisResults({ analysis }: RiskAnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Levels */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Longevity Risk</div>
              <div className={`text-lg font-bold capitalize ${
                analysis.longevityRisk === 'high'
                  ? 'text-red-600'
                  : analysis.longevityRisk === 'moderate'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {analysis.longevityRisk}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Shortfall Risk</div>
              <div className={`text-lg font-bold capitalize ${
                analysis.shortfallRisk === 'high'
                  ? 'text-red-600'
                  : analysis.shortfallRisk === 'moderate'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {analysis.shortfallRisk}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Healthcare Risk</div>
              <div className={`text-lg font-bold capitalize ${
                analysis.healthcareRisk === 'high'
                  ? 'text-red-600'
                  : analysis.healthcareRisk === 'moderate'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {analysis.healthcareRisk}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Inflation Risk</div>
              <div className={`text-lg font-bold capitalize ${
                analysis.inflationRisk === 'high'
                  ? 'text-red-600'
                  : analysis.inflationRisk === 'moderate'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {analysis.inflationRisk}
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <div className="text-sm font-medium mb-2">Risk Factors</div>
            <div className="space-y-2">
              {analysis.riskFactors.map((factor, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    factor.severity === 'high'
                      ? 'bg-red-50'
                      : factor.severity === 'moderate'
                      ? 'bg-yellow-50'
                      : 'bg-green-50'
                  }`}
                >
                  <AlertTriangle className={`h-5 w-5 ${
                    factor.severity === 'high'
                      ? 'text-red-500'
                      : factor.severity === 'moderate'
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
        </div>
      </CardContent>
    </Card>
  );
}


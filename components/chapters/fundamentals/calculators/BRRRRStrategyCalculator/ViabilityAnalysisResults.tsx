import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { BRRRRResult } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface ViabilityAnalysisResultsProps {
  analysis: BRRRRResult['viabilityAnalysis'];
}

export function ViabilityAnalysisResults({ analysis }: ViabilityAnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Strategy Viability Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {/* Viability Score */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm font-medium">Viability Score</div>
              <div className="text-2xl font-bold">{analysis.score}</div>
            </div>
            {analysis.viable ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Strategy is Viable</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Strategy Needs Review</span>
              </div>
            )}
          </div>

          {/* Strengths */}
          <div>
            <div className="text-sm font-medium mb-2">Strengths</div>
            <div className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <div className="text-sm font-medium mb-2">Weaknesses</div>
            <div className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <span>{weakness}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="text-sm font-medium mb-2">Recommendations</div>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center gap-2 bg-yellow-50 p-3 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


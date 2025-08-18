import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { LongevityRiskResult } from '@/lib/hooks/calculators/useLongevityRisk';

interface LifeExpectancyResultsProps {
  analysis: LongevityRiskResult['lifeExpectancy'];
}

export function LifeExpectancyResults({ analysis }: LifeExpectancyResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Life Expectancy Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Life Expectancy Projections */}
          <div>
            <div className="text-sm font-medium">Median Life Expectancy</div>
            <div className="text-2xl font-bold">{analysis.median} years</div>
          </div>
          <div>
            <div className="text-sm font-medium">90th Percentile</div>
            <div className="text-2xl font-bold">{analysis.percentile90} years</div>
          </div>
          <div>
            <div className="text-sm font-medium">95th Percentile</div>
            <div className="text-2xl font-bold">{analysis.percentile95} years</div>
          </div>

          {/* Impact Factors */}
          <div className="col-span-full">
            <div className="text-sm font-medium mb-4">Contributing Factors</div>
            <div className="space-y-3">
              {analysis.factors.map((factor, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 rounded-lg ${
                    factor.impact > 0
                      ? 'bg-green-50'
                      : factor.impact < 0
                      ? 'bg-red-50'
                      : 'bg-gray-50'
                  }`}
                >
                  {factor.impact > 0 ? (
                    <ArrowUp className="h-5 w-5 text-green-500" />
                  ) : factor.impact < 0 ? (
                    <ArrowDown className="h-5 w-5 text-red-500" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <div className="font-medium">{factor.factor}</div>
                    <div className="text-sm text-muted-foreground">
                      {factor.description}
                    </div>
                  </div>
                  <div className="ml-auto font-medium">
                    {factor.impact > 0 ? '+' : ''}{factor.impact} years
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


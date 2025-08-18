import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/financial';
import { CheckCircle2, AlertTriangle, TrendingUp, Heart, Shield } from 'lucide-react';
import { LongevityRiskResult } from '@/lib/hooks/calculators/useLongevityRisk';

interface RecommendationsResultsProps {
  recommendations: LongevityRiskResult['recommendations'];
  monthlyIncome: number;
}

export function RecommendationsResults({ recommendations, monthlyIncome }: RecommendationsResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Adjustments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Financial Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.savingsAdjustment > 0 && (
                  <div>
                    <div className="text-sm font-medium">Increase Annual Savings</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(recommendations.savingsAdjustment)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((recommendations.savingsAdjustment / (monthlyIncome * 12)) * 100).toFixed(1)}% of annual income
                    </div>
                  </div>
                )}
                {recommendations.expenseReduction > 0 && (
                  <div>
                    <div className="text-sm font-medium">Reduce Monthly Expenses</div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(recommendations.expenseReduction)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((recommendations.expenseReduction / monthlyIncome) * 100).toFixed(1)}% of monthly income
                    </div>
                  </div>
                )}
                {recommendations.retirementAgeAdjustment > 0 && (
                  <div>
                    <div className="text-sm font-medium">Delay Retirement</div>
                    <div className="text-2xl font-bold">
                      {recommendations.retirementAgeAdjustment} years
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insurance Needs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Insurance Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.insuranceNeeds.map((need, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-blue-50">
                    <AlertTriangle className="h-5 w-5 text-blue-500" />
                    <span>{need}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Lifestyle Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.lifestyleChanges.map((change, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>{change}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Investment Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Investment Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.investmentStrategy.map((strategy, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-purple-50">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <span>{strategy}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}


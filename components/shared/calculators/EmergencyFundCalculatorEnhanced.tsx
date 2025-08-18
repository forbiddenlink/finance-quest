'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmergencyFund } from '@/lib/hooks/calculators/useEmergencyFund';
import { Shield, BarChart3, Calendar, Calculator as CalcIcon, RefreshCw, AlertTriangle, CheckCircle2, Info, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export default function EmergencyFundCalculatorEnhanced() {
  const [state, actions] = useEmergencyFund();
  const { values, errors, result, isValid } = state;
  const { updateField, reset } = actions;

  const handleInputChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const getRiskLevelColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Emergency Fund Calculator
          </CardTitle>
          <CardDescription>
            Calculate and plan your ideal emergency fund based on your personal situation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="basics">Basic Info</TabsTrigger>
              <TabsTrigger value="risk">Risk Factors</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={values.monthlyExpenses}
                    onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                    error={getFieldError('monthlyExpenses')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={values.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    error={getFieldError('monthlyIncome')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSavings">Current Savings</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    value={values.currentSavings}
                    onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                    error={getFieldError('currentSavings')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlySavingsTarget">Monthly Savings Target</Label>
                  <Input
                    id="monthlySavingsTarget"
                    type="number"
                    value={values.monthlySavingsTarget}
                    onChange={(e) => handleInputChange('monthlySavingsTarget', e.target.value)}
                    error={getFieldError('monthlySavingsTarget')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobStability">Job Stability</Label>
                  <Select
                    value={values.jobStability}
                    onValueChange={(value) => handleInputChange('jobStability', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job stability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="variable">Variable</SelectItem>
                      <SelectItem value="unstable">Unstable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeType">Income Type</Label>
                  <Select
                    value={values.incomeType}
                    onValueChange={(value) => handleInputChange('incomeType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthStatus">Health Status</Label>
                  <Select
                    value={values.healthStatus}
                    onValueChange={(value) => handleInputChange('healthStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={values.dependents}
                    onChange={(e) => handleInputChange('dependents', e.target.value)}
                    error={getFieldError('dependents')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="housingType">Housing Type</Label>
                  <Select
                    value={values.housingType}
                    onValueChange={(value) => handleInputChange('housingType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select housing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own">Own</SelectItem>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debtLevel">Debt Level</Label>
                  <Select
                    value={values.debtLevel}
                    onValueChange={(value) => handleInputChange('debtLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select debt level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceCoverage">Insurance Coverage</Label>
                  <Select
                    value={values.insuranceCoverage}
                    onValueChange={(value) => handleInputChange('insuranceCoverage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industryStability">Industry Stability</Label>
                  <Select
                    value={values.industryStability}
                    onValueChange={(value) => handleInputChange('industryStability', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry stability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="growing">Growing</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="declining">Declining</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="strategy" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="savingsStrategy">Savings Strategy</Label>
                  <Select
                    value={values.savingsStrategy}
                    onValueChange={(value) => handleInputChange('savingsStrategy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select savings strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useHighYieldSavings">Use High-Yield Savings</Label>
                  <Select
                    value={values.useHighYieldSavings.toString()}
                    onValueChange={(value) => handleInputChange('useHighYieldSavings', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select high-yield savings option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="includeInflation">Include Inflation</Label>
                  <Select
                    value={values.includeInflation.toString()}
                    onValueChange={(value) => handleInputChange('includeInflation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inflation option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-x-2">
            <Button
              onClick={reset}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Fund Size Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Fund Size Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Minimum Fund (3 months)</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.minimumFund)}
                  </div>
                </div>
                <div>
                  <Label>Recommended Fund ({result.recommendedMonths} months)</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.recommendedFund)}
                  </div>
                </div>
                <div>
                  <Label>Optimal Fund</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.optimalFund)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Risk Score</Label>
                  <div className="text-2xl font-bold">
                    {result.riskScore.toFixed(1)} / 19
                  </div>
                </div>
                <div>
                  <Label>Recommended Coverage</Label>
                  <div className="text-2xl font-bold">
                    {result.recommendedMonths} months
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Factors</Label>
                <div className="space-y-2">
                  {result.riskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{factor.factor}</div>
                        <div className="text-sm text-gray-500">{factor.recommendation}</div>
                      </div>
                      <div className={`font-medium ${getRiskLevelColor(factor.level)}`}>
                        {factor.level.charAt(0).toUpperCase() + factor.level.slice(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Building Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Building Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Months to Minimum</Label>
                  <div className="text-2xl font-bold">
                    {result.monthsToMinimum}
                  </div>
                </div>
                <div>
                  <Label>Months to Recommended</Label>
                  <div className="text-2xl font-bold">
                    {result.monthsToRecommended}
                  </div>
                </div>
                <div>
                  <Label>Months to Optimal</Label>
                  <div className="text-2xl font-bold">
                    {result.monthsToOptimal}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Savings Projections</Label>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-right py-2">Balance</th>
                        <th className="text-right py-2">Milestone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.projectedSavings.map((projection) => (
                        <tr key={projection.month} className="border-b">
                          <td className="py-2">{projection.month}</td>
                          <td className="text-right">{formatCurrency(projection.balance)}</td>
                          <td className="text-right">{projection.milestone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Building Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Building Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.buildingPhases.map((phase, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Phase {phase.phase}: {phase.name}</div>
                    <div className="font-medium">
                      {formatCurrency(phase.targetAmount)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{phase.description}</div>
                  <div className="space-y-1">
                    {phase.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="text-sm flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-400 mt-2" />
                        <div>{tip}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.insights.map((insight, index) => (
                <Alert
                  key={index}
                  variant={insight.type === 'warning' ? 'destructive' : 'default'}
                >
                  {insight.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : insight.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                  <AlertDescription>{insight.message}</AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
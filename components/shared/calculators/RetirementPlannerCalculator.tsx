'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRetirementCalculator } from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { PiggyBank, TrendingUp, Target, DollarSign, AlertTriangle, CheckCircle2, RefreshCw, Clock, Calculator } from 'lucide-react';

export default function RetirementPlannerCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  const {
    values,
    result,
    errors,
    updateValue,
    reset
  } = useRetirementCalculator();

  // Record usage when component mounts
  React.useEffect(() => {
    recordCalculatorUsage('retirement-planner');
  }, [recordCalculatorUsage]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 100) return 'text-green-600';
    if (readiness >= 75) return 'text-blue-600';
    if (readiness >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessLevel = (readiness: number) => {
    if (readiness >= 100) return 'On Track';
    if (readiness >= 75) return 'Good Progress';
    if (readiness >= 50) return 'Needs Improvement';
    return 'Critical Action Required';
  };

  // Generate projection data for charts
  const projectionData = React.useMemo(() => {
    if (!result) return [];

    const currentAge = parseInt(values.currentAge) || 30;
    const retirementAge = parseInt(values.retirementAge) || 65;
    const currentSavings = parseFloat(values.currentSavings) || 0;
    const monthlyContribution = parseFloat(values.monthlyContribution) || 0;
    const expectedReturn = parseFloat(values.expectedReturn) / 100 || 0.07;

    const data = [];
    let balance = currentSavings;

    for (let age = currentAge; age <= retirementAge; age++) {
      if (age > currentAge) {
        // Add monthly contributions for the year
        const yearlyContribution = monthlyContribution * 12;
        balance = (balance + yearlyContribution) * (1 + expectedReturn);
      }

      data.push({
        age,
        balance: Math.round(balance),
        contributions: (age - currentAge) * monthlyContribution * 12,
        growth: Math.round(balance - currentSavings - ((age - currentAge) * monthlyContribution * 12))
      });
    }

    return data;
  }, [values, result]);

  // Create allocation breakdown data
  const allocationData = result ? [
    { name: 'Current Savings Growth', value: result.totalRetirementSavings - (parseFloat(values.currentSavings) || 0), color: '#3B82F6' },
    { name: 'Current Savings', value: parseFloat(values.currentSavings) || 0, color: '#10B981' },
    { name: 'Future Contributions', value: (parseInt(values.retirementAge) - parseInt(values.currentAge)) * parseFloat(values.monthlyContribution) * 12, color: '#8B5CF6' }
  ].filter(item => item.value > 0) : [];

  const readinessPercentage = result ? Math.min(100, (result.totalRetirementSavings / result.requiredSavings) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Retirement Planning Calculator
          </CardTitle>
          <CardDescription>
            Plan your retirement with comprehensive projections, savings analysis, and actionable recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={values.currentAge}
                    onChange={(e) => updateValue('currentAge', e.target.value)}
                    placeholder="30"
                  />
                  {errors?.currentAge && (
                    <p className="text-sm text-red-600 mt-1">{errors.currentAge}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={values.retirementAge}
                    onChange={(e) => updateValue('retirementAge', e.target.value)}
                    placeholder="65"
                  />
                  {errors?.retirementAge && (
                    <p className="text-sm text-red-600 mt-1">{errors.retirementAge}</p>
                  )}
                </div>
              </div>

              {result && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">
                    <Clock className="h-4 w-4 inline mr-1" />
                    You have <span className="font-semibold">
                      {parseInt(values.retirementAge) - parseInt(values.currentAge)} years
                    </span> until retirement
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Financial Situation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentSavings">Current Retirement Savings ($)</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={values.currentSavings}
                  onChange={(e) => updateValue('currentSavings', e.target.value)}
                  placeholder="50000"
                />
                {errors?.currentSavings && (
                  <p className="text-sm text-red-600 mt-1">{errors.currentSavings}</p>
                )}
              </div>

              <div>
                <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={values.monthlyContribution}
                  onChange={(e) => updateValue('monthlyContribution', e.target.value)}
                  placeholder="1000"
                />
                {errors?.monthlyContribution && (
                  <p className="text-sm text-red-600 mt-1">{errors.monthlyContribution}</p>
                )}
                {result && (
                  <p className="text-sm text-gray-600 mt-1">
                    Annual contribution: {formatCurrency(parseFloat(values.monthlyContribution) * 12 || 0)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="desiredIncome">Desired Annual Retirement Income ($)</Label>
                <Input
                  id="desiredIncome"
                  type="number"
                  value={values.desiredIncome}
                  onChange={(e) => updateValue('desiredIncome', e.target.value)}
                  placeholder="80000"
                />
                {errors?.desiredIncome && (
                  <p className="text-sm text-red-600 mt-1">{errors.desiredIncome}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    step="0.1"
                    value={values.expectedReturn}
                    onChange={(e) => updateValue('expectedReturn', e.target.value)}
                    placeholder="7"
                  />
                  {errors?.expectedReturn && (
                    <p className="text-sm text-red-600 mt-1">{errors.expectedReturn}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                  <Input
                    id="inflationRate"
                    type="number"
                    step="0.1"
                    value={values.inflationRate}
                    onChange={(e) => updateValue('inflationRate', e.target.value)}
                    placeholder="3"
                  />
                  {errors?.inflationRate && (
                    <p className="text-sm text-red-600 mt-1">{errors.inflationRate}</p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-700">
                  <strong>Note:</strong> Higher returns come with higher risk. Consider a diversified portfolio.
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={reset} variant="outline" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>

        {/* result Section */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Retirement Readiness */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Retirement Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getReadinessColor(readinessPercentage)}`}>
                        {readinessPercentage.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Retirement Readiness</div>
                      <Badge className={`mt-2 ${readinessPercentage >= 75 ? 'bg-green-100 text-green-800' : readinessPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {getReadinessLevel(readinessPercentage)}
                      </Badge>
                    </div>

                    <Progress value={readinessPercentage} className="h-3" />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(result.totalRetirementSavings)}
                        </div>
                        <div className="text-sm text-green-700">Projected Savings</div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(result.requiredSavings)}
                        </div>
                        <div className="text-sm text-blue-700">Required Savings</div>
                      </div>
                    </div>

                    {result.shortfall > 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Shortfall:</strong> {formatCurrency(result.shortfall)}
                          <br />Consider increasing contributions or extending retirement age.
                        </AlertDescription>
                      </Alert>
                    )}

                    {result.surplus > 0 && (
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Surplus:</strong> {formatCurrency(result.surplus)}
                          <br />                          You&apos;re on track! Consider early retirement or lifestyle upgrades.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              <Tabs defaultValue="projection" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="projection">Projection</TabsTrigger>
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                </TabsList>

                <TabsContent value="projection" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Savings Growth Projection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Growth Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="age" />
                              <YAxis tickFormatter={(value) => formatCurrency(value)} />
                              <Tooltip
                                formatter={(value: unknown, name: string) => [formatCurrency(Number(value)), name === 'balance' ? 'Total Balance' : name]}
                                labelFormatter={(age) => `Age ${age}`}
                              />
                              <Area type="monotone" dataKey="balance" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Key Milestones */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-semibold text-purple-900">At Age 50</h4>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatCurrency(projectionData.find(d => d.age === 50)?.balance || 0)}
                            </p>
                            <p className="text-sm text-purple-700">Projected Balance</p>
                          </div>

                          <div className="p-4 bg-orange-50 rounded-lg">
                            <h4 className="font-semibold text-orange-900">At Retirement</h4>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatCurrency(result.totalRetirementSavings)}
                            </p>
                            <p className="text-sm text-orange-700">Final Balance</p>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-3">Inflation-Adjusted Income</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Desired income today:</span>
                              <span className="font-medium">{formatCurrency(parseFloat(values.desiredIncome) || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Equivalent at retirement:</span>
                              <span className="font-medium">{formatCurrency(result.inflationAdjustedIncome || 0)}</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              *Adjusted for {formatPercentage(parseFloat(values.inflationRate) || 0)} annual inflation
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="breakdown" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Savings Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Allocation Pie Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={allocationData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${formatCurrency(value || 0)}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {allocationData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: unknown) => [formatCurrency(Number(value)), 'Amount']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Breakdown Details */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-3">Contribution Analysis</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Current savings:</span>
                                <span className="font-medium">{formatCurrency(parseFloat(values.currentSavings) || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total future contributions:</span>
                                <span className="font-medium">{formatCurrency((parseInt(values.retirementAge) - parseInt(values.currentAge)) * parseFloat(values.monthlyContribution) * 12)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Investment growth:</span>
                                <span className="font-medium text-green-600">
                                  {formatCurrency(result.totalRetirementSavings - parseFloat(values.currentSavings) - ((parseInt(values.retirementAge) - parseInt(values.currentAge)) * parseFloat(values.monthlyContribution) * 12))}
                                </span>
                              </div>
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold">
                                  <span>Total at retirement:</span>
                                  <span>{formatCurrency(result.totalRetirementSavings)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold mb-3">Monthly Impact</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Current monthly contribution:</span>
                                <span className="font-medium">{formatCurrency(parseFloat(values.monthlyContribution) || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Years until retirement:</span>
                                <span className="font-medium">{parseInt(values.retirementAge) - parseInt(values.currentAge)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total months contributing:</span>
                                <span className="font-medium">{(parseInt(values.retirementAge) - parseInt(values.currentAge)) * 12}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="scenarios" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        What-If Scenarios
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Scenario Analysis */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-3">Increase Monthly Contribution</h4>
                            <div className="space-y-2 text-sm text-blue-700">
                              <div>
                                +$200/month → Additional {formatCurrency((parseInt(values.retirementAge) - parseInt(values.currentAge)) * 200 * 12 * Math.pow(1 + (parseFloat(values.expectedReturn) / 100), (parseInt(values.retirementAge) - parseInt(values.currentAge)) / 2))} at retirement
                              </div>
                              <div>
                                +$500/month → Additional {formatCurrency((parseInt(values.retirementAge) - parseInt(values.currentAge)) * 500 * 12 * Math.pow(1 + (parseFloat(values.expectedReturn) / 100), (parseInt(values.retirementAge) - parseInt(values.currentAge)) / 2))} at retirement
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-3">Delay Retirement</h4>
                            <div className="space-y-2 text-sm text-green-700">
                              <div>
                                Work 2 more years → Additional {formatCurrency(parseFloat(values.monthlyContribution) * 24 * Math.pow(1 + (parseFloat(values.expectedReturn) / 100), 2))} from contributions + growth
                              </div>
                              <div>
                                Work 5 more years → Additional {formatCurrency(parseFloat(values.monthlyContribution) * 60 * Math.pow(1 + (parseFloat(values.expectedReturn) / 100), 5))} from contributions + growth
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-3">Investment Return Impact</h4>
                            <div className="space-y-2 text-sm text-purple-700">
                              <div>
                                6% return → {formatCurrency(result.totalRetirementSavings * 0.85)} (vs current projection)
                              </div>
                              <div>
                                8% return → {formatCurrency(result.totalRetirementSavings * 1.2)} (vs current projection)
                              </div>
                              <div className="text-xs mt-2">*Rough estimates for comparison</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Items */}
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-semibold text-yellow-900 mb-3">Recommended Actions</h4>
                          <div className="space-y-2 text-sm text-yellow-700">
                            {result.shortfall > 0 && (
                              <>
                                <div>• Increase monthly contributions by {formatCurrency(result.shortfall / ((parseInt(values.retirementAge) - parseInt(values.currentAge)) * 12))} to close the gap</div>
                                <div>• Consider working {Math.ceil(result.shortfall / (parseFloat(values.monthlyContribution) * 12))} additional years</div>
                                <div>• Review investment allocation to potentially increase returns</div>
                              </>
                            )}
                            {result.surplus > 0 && (
                              <>
                                <div>• You&apos;re ahead of schedule! Consider early retirement</div>
                                <div>• Increase lifestyle goals or leave a larger legacy</div>
                                <div>• Consider reducing investment risk as you approach retirement</div>
                              </>
                            )}
                            <div>• Review and adjust plan annually</div>
                            <div>• Consider tax-advantaged accounts (401k, IRA, Roth IRA)</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          {errors && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please correct the input errors to see your retirement analysis.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

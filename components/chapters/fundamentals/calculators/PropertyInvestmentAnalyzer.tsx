'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePropertyInvestment } from '@/lib/hooks/calculators/usePropertyInvestment';
import { Home, DollarSign, TrendingUp, Percent, Calendar, Info, BarChart3, PiggyBank, Target, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export default function PropertyInvestmentAnalyzer() {
  const [state, actions] = usePropertyInvestment();
  const { values, errors, result, isValid } = state;
  const { updateField, reset } = actions;

  const handleInputChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const getGradeColor = (value: number, thresholds: { good: number; fair: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.fair) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            Property Investment Analyzer
          </CardTitle>
          <CardDescription>
            Analyze real estate investments and calculate key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="property" className="space-y-4">
            <TabsList>
              <TabsTrigger value="property">Property Details</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
            </TabsList>

            <TabsContent value="property" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={values.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    error={getFieldError('purchasePrice')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
                  <Input
                    id="downPaymentPercent"
                    type="number"
                    value={values.downPaymentPercent}
                    onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                    error={getFieldError('downPaymentPercent')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={values.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    error={getFieldError('interestRate')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Loan Term (years)</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={values.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    error={getFieldError('loanTerm')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingCosts">Closing Costs</Label>
                  <Input
                    id="closingCosts"
                    type="number"
                    value={values.closingCosts}
                    onChange={(e) => handleInputChange('closingCosts', e.target.value)}
                    error={getFieldError('closingCosts')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rehabCosts">Rehab Costs</Label>
                  <Input
                    id="rehabCosts"
                    type="number"
                    value={values.rehabCosts}
                    onChange={(e) => handleInputChange('rehabCosts', e.target.value)}
                    error={getFieldError('rehabCosts')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={values.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    error={getFieldError('monthlyRent')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
                  <Input
                    id="vacancyRate"
                    type="number"
                    value={values.vacancyRate}
                    onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
                    error={getFieldError('vacancyRate')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherIncome">Other Monthly Income</Label>
                  <Input
                    id="otherIncome"
                    type="number"
                    value={values.otherIncome}
                    onChange={(e) => handleInputChange('otherIncome', e.target.value)}
                    error={getFieldError('otherIncome')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="propertyTaxes">Annual Property Taxes</Label>
                  <Input
                    id="propertyTaxes"
                    type="number"
                    value={values.propertyTaxes}
                    onChange={(e) => handleInputChange('propertyTaxes', e.target.value)}
                    error={getFieldError('propertyTaxes')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Annual Insurance</Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={values.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    error={getFieldError('insurance')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance">Annual Maintenance</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={values.maintenance}
                    onChange={(e) => handleInputChange('maintenance', e.target.value)}
                    error={getFieldError('maintenance')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyManagement">Annual Property Management</Label>
                  <Input
                    id="propertyManagement"
                    type="number"
                    value={values.propertyManagement}
                    onChange={(e) => handleInputChange('propertyManagement', e.target.value)}
                    error={getFieldError('propertyManagement')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilities">Annual Utilities</Label>
                  <Input
                    id="utilities"
                    type="number"
                    value={values.utilities}
                    onChange={(e) => handleInputChange('utilities', e.target.value)}
                    error={getFieldError('utilities')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoaFees">Annual HOA Fees</Label>
                  <Input
                    id="hoaFees"
                    type="number"
                    value={values.hoaFees}
                    onChange={(e) => handleInputChange('hoaFees', e.target.value)}
                    error={getFieldError('hoaFees')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherExpenses">Annual Other Expenses</Label>
                  <Input
                    id="otherExpenses"
                    type="number"
                    value={values.otherExpenses}
                    onChange={(e) => handleInputChange('otherExpenses', e.target.value)}
                    error={getFieldError('otherExpenses')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="market" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="rentGrowthRate">Annual Rent Growth (%)</Label>
                  <Input
                    id="rentGrowthRate"
                    type="number"
                    value={values.rentGrowthRate}
                    onChange={(e) => handleInputChange('rentGrowthRate', e.target.value)}
                    error={getFieldError('rentGrowthRate')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyAppreciationRate">Annual Property Appreciation (%)</Label>
                  <Input
                    id="propertyAppreciationRate"
                    type="number"
                    value={values.propertyAppreciationRate}
                    onChange={(e) => handleInputChange('propertyAppreciationRate', e.target.value)}
                    error={getFieldError('propertyAppreciationRate')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseGrowthRate">Annual Expense Growth (%)</Label>
                  <Input
                    id="expenseGrowthRate"
                    type="number"
                    value={values.expenseGrowthRate}
                    onChange={(e) => handleInputChange('expenseGrowthRate', e.target.value)}
                    error={getFieldError('expenseGrowthRate')}
                  />
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
          {/* Loan Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Loan Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label>Loan Amount</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.loanAmount)}
                  </div>
                </div>
                <div>
                  <Label>Down Payment</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.downPayment)}
                  </div>
                </div>
                <div>
                  <Label>Total Investment</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.totalInvestment)}
                  </div>
                </div>
                <div>
                  <Label>Monthly Mortgage</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.monthlyMortgage)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-6 w-6" />
                Income Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label>Effective Gross Income</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.effectiveGrossIncome)}
                  </div>
                </div>
                <div>
                  <Label>Operating Expenses</Label>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(result.totalOperatingExpenses)}
                  </div>
                </div>
                <div>
                  <Label>Net Operating Income</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.netOperatingIncome)}
                  </div>
                </div>
                <div>
                  <Label>Monthly Cash Flow</Label>
                  <div className={`text-2xl font-bold ${result.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(result.cashFlow)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Investment Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label>Cap Rate</Label>
                  <div className={`text-2xl font-bold ${getGradeColor(result.capRate, { good: 8, fair: 6 })}`}>
                    {formatPercentage(result.capRate)}
                  </div>
                </div>
                <div>
                  <Label>Cash on Cash Return</Label>
                  <div className={`text-2xl font-bold ${getGradeColor(result.cashOnCashReturn, { good: 10, fair: 7 })}`}>
                    {formatPercentage(result.cashOnCashReturn)}
                  </div>
                </div>
                <div>
                  <Label>Total Return</Label>
                  <div className={`text-2xl font-bold ${getGradeColor(result.returnOnInvestment, { good: 15, fair: 10 })}`}>
                    {formatPercentage(result.returnOnInvestment)}
                  </div>
                </div>
                <div>
                  <Label>Break Even (Years)</Label>
                  <div className={`text-2xl font-bold ${getGradeColor(10 - result.breakEvenPoint, { good: 5, fair: 3 })}`}>
                    {result.breakEvenPoint.toFixed(1)}
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
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Debt Service Coverage</Label>
                  <div className={`text-2xl font-bold ${getGradeColor(result.debtServiceCoverageRatio, { good: 1.5, fair: 1.25 })}`}>
                    {result.debtServiceCoverageRatio.toFixed(2)}x
                  </div>
                </div>
                <div>
                  <Label>Operating Expense Ratio</Label>
                  <div className={`text-2xl font-bold ${getGradeColor(100 - result.operatingExpenseRatio, { good: 60, fair: 50 })}`}>
                    {formatPercentage(result.operatingExpenseRatio)}
                  </div>
                </div>
                <div>
                  <Label>Price to Rent Ratio</Label>
                  <div className={`text-2xl font-bold ${getGradeColor(20 - result.priceToRentRatio, { good: 10, fair: 5 })}`}>
                    {result.priceToRentRatio.toFixed(1)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Year Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                5-Year Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Year</th>
                      <th className="text-right py-2">Property Value</th>
                      <th className="text-right py-2">Net Income</th>
                      <th className="text-right py-2">Equity</th>
                      <th className="text-right py-2">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.fiveYearProjections.map((year) => (
                      <tr key={year.year} className="border-b">
                        <td className="py-2">{year.year}</td>
                        <td className="text-right">{formatCurrency(year.propertyValue)}</td>
                        <td className="text-right">{formatCurrency(year.netIncome)}</td>
                        <td className="text-right">{formatCurrency(year.equity)}</td>
                        <td className="text-right">{formatPercentage(year.roi)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {(result.recommendations.length > 0 || result.insights.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-6 w-6" />
                  Analysis Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.recommendations.map((recommendation, index) => (
                  <Alert key={index}>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{recommendation}</AlertDescription>
                  </Alert>
                ))}
                {result.insights.map((insight, index) => (
                  <Alert
                    key={index}
                    variant={insight.type === 'warning' ? 'destructive' : 'default'}
                  >
                    {insight.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <AlertDescription>{insight.message}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
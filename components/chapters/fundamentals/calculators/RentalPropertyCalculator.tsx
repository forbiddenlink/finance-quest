'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRentalProperty } from '@/lib/hooks/calculators/useRentalProperty';
import { Home, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, BarChart3, Calculator } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export default function RentalPropertyCalculator() {
  const [state, actions] = useRentalProperty();
  const { values, errors, result, isValid } = state;
  const { updateField, reset } = actions;

  const handleInputChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            Rental Property Calculator
          </CardTitle>
          <CardDescription>
            Analyze rental property investments and calculate key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="property" className="space-y-4">
            <TabsList>
              <TabsTrigger value="property">Property Info</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
            </TabsList>

            <TabsContent value="property" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Property Value</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    value={values.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                    error={getFieldError('propertyValue')}
                  />
                </div>
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
              </div>
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="parkingFees">Parking Fees</Label>
                  <Input
                    id="parkingFees"
                    type="number"
                    value={values.parkingFees}
                    onChange={(e) => handleInputChange('parkingFees', e.target.value)}
                    error={getFieldError('parkingFees')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageFees">Storage Fees</Label>
                  <Input
                    id="storageFees"
                    type="number"
                    value={values.storageFees}
                    onChange={(e) => handleInputChange('storageFees', e.target.value)}
                    error={getFieldError('storageFees')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laundryIncome">Laundry Income</Label>
                  <Input
                    id="laundryIncome"
                    type="number"
                    value={values.laundryIncome}
                    onChange={(e) => handleInputChange('laundryIncome', e.target.value)}
                    error={getFieldError('laundryIncome')}
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
                  <Label htmlFor="turnoverRate">Turnover Rate (%)</Label>
                  <Input
                    id="turnoverRate"
                    type="number"
                    value={values.turnoverRate}
                    onChange={(e) => handleInputChange('turnoverRate', e.target.value)}
                    error={getFieldError('turnoverRate')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="mortgage">Mortgage</Label>
                  <Input
                    id="mortgage"
                    type="number"
                    value={values.mortgage}
                    onChange={(e) => handleInputChange('mortgage', e.target.value)}
                    error={getFieldError('mortgage')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyTaxes">Property Taxes</Label>
                  <Input
                    id="propertyTaxes"
                    type="number"
                    value={values.propertyTaxes}
                    onChange={(e) => handleInputChange('propertyTaxes', e.target.value)}
                    error={getFieldError('propertyTaxes')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance</Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={values.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    error={getFieldError('insurance')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance">Maintenance</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={values.maintenance}
                    onChange={(e) => handleInputChange('maintenance', e.target.value)}
                    error={getFieldError('maintenance')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilities">Utilities</Label>
                  <Input
                    id="utilities"
                    type="number"
                    value={values.utilities}
                    onChange={(e) => handleInputChange('utilities', e.target.value)}
                    error={getFieldError('utilities')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyManagement">Property Management</Label>
                  <Input
                    id="propertyManagement"
                    type="number"
                    value={values.propertyManagement}
                    onChange={(e) => handleInputChange('propertyManagement', e.target.value)}
                    error={getFieldError('propertyManagement')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advertising">Advertising</Label>
                  <Input
                    id="advertising"
                    type="number"
                    value={values.advertising}
                    onChange={(e) => handleInputChange('advertising', e.target.value)}
                    error={getFieldError('advertising')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal">Legal</Label>
                  <Input
                    id="legal"
                    type="number"
                    value={values.legal}
                    onChange={(e) => handleInputChange('legal', e.target.value)}
                    error={getFieldError('legal')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accounting">Accounting</Label>
                  <Input
                    id="accounting"
                    type="number"
                    value={values.accounting}
                    onChange={(e) => handleInputChange('accounting', e.target.value)}
                    error={getFieldError('accounting')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoaFees">HOA Fees</Label>
                  <Input
                    id="hoaFees"
                    type="number"
                    value={values.hoaFees}
                    onChange={(e) => handleInputChange('hoaFees', e.target.value)}
                    error={getFieldError('hoaFees')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capitalExpenditures">Capital Expenditures</Label>
                  <Input
                    id="capitalExpenditures"
                    type="number"
                    value={values.capitalExpenditures}
                    onChange={(e) => handleInputChange('capitalExpenditures', e.target.value)}
                    error={getFieldError('capitalExpenditures')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherExpenses">Other Expenses</Label>
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

            <TabsContent value="investment" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="downPayment">Down Payment</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={values.downPayment}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    error={getFieldError('downPayment')}
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
                  <Label htmlFor="initialRepairs">Initial Repairs</Label>
                  <Input
                    id="initialRepairs"
                    type="number"
                    value={values.initialRepairs}
                    onChange={(e) => handleInputChange('initialRepairs', e.target.value)}
                    error={getFieldError('initialRepairs')}
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
          {/* Income Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Income Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Gross Rental Income</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.grossRentalIncome)}
                  </div>
                </div>
                <div>
                  <Label>Effective Gross Income</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.effectiveGrossIncome)}
                  </div>
                </div>
                <div>
                  <Label>Total Operating Expenses</Label>
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
                <Calculator className="h-6 w-6" />
                Investment Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Cap Rate</Label>
                  <div className="text-2xl font-bold">
                    {formatPercentage(result.capRate)}
                  </div>
                </div>
                <div>
                  <Label>Cash on Cash Return</Label>
                  <div className="text-2xl font-bold">
                    {formatPercentage(result.cashOnCashReturn)}
                  </div>
                </div>
                <div>
                  <Label>Total Investment</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.totalInvestment)}
                  </div>
                </div>
                <div>
                  <Label>Break Even (Months)</Label>
                  <div className="text-2xl font-bold">
                    {result.breakEvenMonths}
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
                  <Label>Debt Service Coverage Ratio</Label>
                  <div className="text-2xl font-bold">
                    {result.debtServiceCoverageRatio.toFixed(2)}x
                  </div>
                </div>
                <div>
                  <Label>Operating Expense Ratio</Label>
                  <div className="text-2xl font-bold">
                    {formatPercentage(result.operatingExpenseRatio)}
                  </div>
                </div>
                <div>
                  <Label>Vacancy Loss</Label>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(result.vacancyLoss)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Financial Projections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Annual Cash Flow</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.annualCashFlow)}
                  </div>
                </div>
                <div>
                  <Label>5-Year Equity Build</Label>
                  <div className="text-2xl font-bold">
                    {formatCurrency(result.fiveYearEquityBuild)}
                  </div>
                </div>
                <div>
                  <Label>Total Return</Label>
                  <div className="text-2xl font-bold">
                    {formatPercentage(result.totalReturn)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights and Warnings */}
          {(result.warnings.length > 0 || result.insights.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Analysis Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.warnings.map((warning, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{warning}</AlertDescription>
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
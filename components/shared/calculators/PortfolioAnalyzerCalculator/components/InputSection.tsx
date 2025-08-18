'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioValues } from '../types';
import { TABS } from '../utils';

interface InputSectionProps {
  values: PortfolioValues;
  errors: Array<{ field: string; message: string }>;
  onInputChange: (field: keyof PortfolioValues, value: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  values,
  errors,
  onInputChange
}) => {
  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <Tabs defaultValue="allocation" className="space-y-4">
      <TabsList>
        {TABS.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="allocation" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="totalValue">Total Portfolio Value</Label>
            <Input
              id="totalValue"
              type="number"
              value={values.totalValue}
              onChange={(e) => onInputChange('totalValue', e.target.value)}
              error={getFieldError('totalValue')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cashAllocation">Cash Allocation (%)</Label>
            <Input
              id="cashAllocation"
              type="number"
              value={values.cashAllocation}
              onChange={(e) => onInputChange('cashAllocation', e.target.value)}
              error={getFieldError('cashAllocation')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bondAllocation">Bond Allocation (%)</Label>
            <Input
              id="bondAllocation"
              type="number"
              value={values.bondAllocation}
              onChange={(e) => onInputChange('bondAllocation', e.target.value)}
              error={getFieldError('bondAllocation')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockAllocation">Stock Allocation (%)</Label>
            <Input
              id="stockAllocation"
              type="number"
              value={values.stockAllocation}
              onChange={(e) => onInputChange('stockAllocation', e.target.value)}
              error={getFieldError('stockAllocation')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="realEstateAllocation">Real Estate Allocation (%)</Label>
            <Input
              id="realEstateAllocation"
              type="number"
              value={values.realEstateAllocation}
              onChange={(e) => onInputChange('realEstateAllocation', e.target.value)}
              error={getFieldError('realEstateAllocation')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alternativeAllocation">Alternative Allocation (%)</Label>
            <Input
              id="alternativeAllocation"
              type="number"
              value={values.alternativeAllocation}
              onChange={(e) => onInputChange('alternativeAllocation', e.target.value)}
              error={getFieldError('alternativeAllocation')}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="risk-profile" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="riskTolerance">Risk Tolerance</Label>
            <Select
              value={values.riskTolerance}
              onValueChange={(value) => onInputChange('riskTolerance', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk tolerance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="investmentTimeframe">Investment Timeframe (years)</Label>
            <Input
              id="investmentTimeframe"
              type="number"
              value={values.investmentTimeframe}
              onChange={(e) => onInputChange('investmentTimeframe', e.target.value)}
              error={getFieldError('investmentTimeframe')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="incomeRequirement">Income Requirement (%)</Label>
            <Input
              id="incomeRequirement"
              type="number"
              value={values.incomeRequirement}
              onChange={(e) => onInputChange('incomeRequirement', e.target.value)}
              error={getFieldError('incomeRequirement')}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="averageExpenseRatio">Average Expense Ratio (%)</Label>
            <Input
              id="averageExpenseRatio"
              type="number"
              value={values.averageExpenseRatio}
              onChange={(e) => onInputChange('averageExpenseRatio', e.target.value)}
              error={getFieldError('averageExpenseRatio')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rebalanceFrequency">Rebalance Frequency</Label>
            <Select
              value={values.rebalanceFrequency}
              onValueChange={(value) => onInputChange('rebalanceFrequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxBracket">Tax Bracket (%)</Label>
            <Input
              id="taxBracket"
              type="number"
              value={values.taxBracket}
              onChange={(e) => onInputChange('taxBracket', e.target.value)}
              error={getFieldError('taxBracket')}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="assumptions" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="expectedInflation">Expected Inflation (%)</Label>
            <Input
              id="expectedInflation"
              type="number"
              value={values.expectedInflation}
              onChange={(e) => onInputChange('expectedInflation', e.target.value)}
              error={getFieldError('expectedInflation')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedVolatility">Expected Volatility (%)</Label>
            <Input
              id="expectedVolatility"
              type="number"
              value={values.expectedVolatility}
              onChange={(e) => onInputChange('expectedVolatility', e.target.value)}
              error={getFieldError('expectedVolatility')}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};


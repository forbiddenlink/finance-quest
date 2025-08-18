'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Target } from 'lucide-react';
import { theme } from '@/lib/theme';
import { ROIInputs, InvestmentTab } from '../types';

interface InputSectionProps {
  inputs: ROIInputs;
  activeTab: InvestmentTab;
  onInputChange: (field: keyof ROIInputs, value: number) => void;
  onTabChange: (tab: InvestmentTab) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  inputs,
  activeTab,
  onInputChange,
  onTabChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <Briefcase className="w-5 h-5" />
            Core Investment Details
          </CardTitle>
          <CardDescription className={theme.textColors.secondary}>
            Fundamental investment parameters for ROI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Initial Investment
              </label>
              <input
                type="number"
                value={inputs.initialInvestment}
                onChange={(e) => onInputChange('initialInvestment', Number(e.target.value))}
                className={theme.utils.input()}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Additional Investments
              </label>
              <input
                type="number"
                value={inputs.additionalInvestments}
                onChange={(e) => onInputChange('additionalInvestments', Number(e.target.value))}
                className={theme.utils.input()}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Time Horizon (years)
              </label>
              <input
                type="number"
                value={inputs.timeHorizon}
                onChange={(e) => onInputChange('timeHorizon', Number(e.target.value))}
                className={theme.utils.input()}
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Risk Adjustment (%)
              </label>
              <input
                type="number"
                value={inputs.riskAdjustment}
                onChange={(e) => onInputChange('riskAdjustment', Number(e.target.value))}
                className={theme.utils.input()}
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Discount Rate (%)
              </label>
              <input
                type="number"
                value={inputs.discountRate}
                onChange={(e) => onInputChange('discountRate', Number(e.target.value))}
                className={theme.utils.input()}
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Inflation Rate (%)
              </label>
              <input
                type="number"
                value={inputs.inflationRate}
                onChange={(e) => onInputChange('inflationRate', Number(e.target.value))}
                className={theme.utils.input()}
                min="0"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Investment Categories
          </CardTitle>
          <CardDescription className={theme.textColors.secondary}>
            Detailed inputs for each investment category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="tech">Technology</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="human">Human Capital</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="marketing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Marketing Budget
                  </label>
                  <input
                    type="number"
                    value={inputs.marketingBudget}
                    onChange={(e) => onInputChange('marketingBudget', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Customer Acquisition Cost
                  </label>
                  <input
                    type="number"
                    value={inputs.customerAcquisitionCost}
                    onChange={(e) => onInputChange('customerAcquisitionCost', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Customer Lifetime Value
                  </label>
                  <input
                    type="number"
                    value={inputs.customerLifetimeValue}
                    onChange={(e) => onInputChange('customerLifetimeValue', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Conversion Rate (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.conversionRate}
                    onChange={(e) => onInputChange('conversionRate', Number(e.target.value))}
                    className={theme.utils.input()}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Technology Costs
                  </label>
                  <input
                    type="number"
                    value={inputs.technologyCosts}
                    onChange={(e) => onInputChange('technologyCosts', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Efficiency Gains (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.efficiencyGains}
                    onChange={(e) => onInputChange('efficiencyGains', Number(e.target.value))}
                    className={theme.utils.input()}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Annual Cost Savings
                  </label>
                  <input
                    type="number"
                    value={inputs.costSavings}
                    onChange={(e) => onInputChange('costSavings', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Revenue Increase
                  </label>
                  <input
                    type="number"
                    value={inputs.revenueIncrease}
                    onChange={(e) => onInputChange('revenueIncrease', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="human" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Hiring Costs
                  </label>
                  <input
                    type="number"
                    value={inputs.hiringCosts}
                    onChange={(e) => onInputChange('hiringCosts', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Training Costs
                  </label>
                  <input
                    type="number"
                    value={inputs.trainingCosts}
                    onChange={(e) => onInputChange('trainingCosts', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Annual Salary Increase
                  </label>
                  <input
                    type="number"
                    value={inputs.salaryIncrease}
                    onChange={(e) => onInputChange('salaryIncrease', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Productivity Gain (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.productivityGain}
                    onChange={(e) => onInputChange('productivityGain', Number(e.target.value))}
                    className={theme.utils.input()}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Operational Expenses
                  </label>
                  <input
                    type="number"
                    value={inputs.operationalExpenses}
                    onChange={(e) => onInputChange('operationalExpenses', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Revenue Generated
                  </label>
                  <input
                    type="number"
                    value={inputs.revenueGenerated}
                    onChange={(e) => onInputChange('revenueGenerated', Number(e.target.value))}
                    className={theme.utils.input()}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Margin Improvement (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.marginImprovement}
                    onChange={(e) => onInputChange('marginImprovement', Number(e.target.value))}
                    className={theme.utils.input()}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};


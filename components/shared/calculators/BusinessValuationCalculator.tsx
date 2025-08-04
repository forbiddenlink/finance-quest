'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, NumberInput, PercentageInput } from './FormFields';
import { theme } from '@/lib/theme';
import { useBusinessValuationCalculator } from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
import { formatCurrency } from '@/lib/utils/financial';
import { Building2, TrendingUp, BarChart3, PieChart as PieChartIcon, Target } from 'lucide-react';

export default function BusinessValuationCalculator() {
  const { recordCalculatorUsage } = useProgressStore();

  React.useEffect(() => {
    recordCalculatorUsage('business-valuation-calculator');
  }, [recordCalculatorUsage]);

  const metadata: CalculatorMetadata = {
    id: 'business-valuation-calculator',
    title: 'Business Valuation Calculator',
    description: 'Value your business using multiple proven methodologies including DCF, comparable multiples, and asset-based approaches.',
    category: 'advanced',
    icon: Building2,
    tags: ['Business Valuation', 'DCF Analysis', 'Enterprise Value', 'Investment Analysis', 'Financial Modeling'],
    educationalNotes: [
      {
        title: 'Valuation Methods Overview',
        content: 'Different valuation methods provide various perspectives on business worth. Using multiple approaches gives a more complete picture and helps validate your estimates.',
        tips: [
          'DCF (Discounted Cash Flow) focuses on future cash generation potential',
          'Multiple-based valuation compares to similar businesses in the market',
          'Asset-based valuation considers the underlying value of business assets',
          'Consider all three methods and look for convergence in valuations'
        ]
      },
      {
        title: 'Key Valuation Drivers',
        content: 'Business value is driven by profitability, growth potential, risk profile, and market conditions. Small changes in assumptions can significantly impact valuation.',
        tips: [
          'Higher growth rates increase valuation but consider sustainability',
          'Lower discount rates increase value but should reflect actual risk',
          'Consistent profit margins are more valuable than volatile ones',
          'Industry multiples vary significantly - research comparable companies'
        ]
      }
    ]
  };

  const calculatorHook = useBusinessValuationCalculator();
  const { values, results, updateField, reset } = calculatorHook;

  const handleReset = () => {
    reset();
  };

  // Generate results for CalculatorWrapper
  const calculatorResults = React.useMemo(() => {
    if (!results) return undefined;

    const { dcfValuation, multipleValuation, assetValuation, averageValuation } = results;

    return {
      primary: {
        label: 'Average Business Valuation',
        value: averageValuation,
        format: 'currency' as const,
        variant: 'success' as const,
        description: 'Weighted average of all three valuation methods'
      },
      secondary: [
        {
          label: 'DCF Valuation',
          value: dcfValuation,
          format: 'currency' as const,
          variant: 'info' as const,
          description: 'Based on projected cash flows'
        },
        {
          label: 'Multiple-Based Valuation',
          value: multipleValuation,
          format: 'currency' as const,
          variant: 'info' as const,
          description: 'Based on industry comparables'
        },
        {
          label: 'Asset-Based Valuation',
          value: assetValuation,
          format: 'currency' as const,
          variant: 'info' as const,
          description: 'Based on net asset value'
        }
      ]
    };
  }, [results]);

  // Generate insights
  const insights = React.useMemo(() => {
    if (!results) return [];

    const { dcfValuation, multipleValuation, assetValuation, averageValuation } = results;
    const insights = [];

    // Check for valuation convergence
    const valuations = [dcfValuation, multipleValuation, assetValuation];
    const maxVal = Math.max(...valuations);
    const minVal = Math.min(...valuations);
    const variance = ((maxVal - minVal) / averageValuation) * 100;

    if (variance < 20) {
      insights.push({
        type: 'success' as const,
        title: 'Consistent Valuation',
        message: `All three methods show similar values (within ${variance.toFixed(1)}%), indicating a reliable valuation range.`
      });
    } else {
      insights.push({
        type: 'warning' as const,
        title: 'High Valuation Variance',
        message: `Methods show significant differences (${variance.toFixed(1)}% variance). Review assumptions and consider market conditions.`
      });
    }

    // Growth rate analysis
    const growthRate = parseFloat(values.growthRate);
    if (growthRate > 25) {
      insights.push({
        type: 'info' as const,
        title: 'High Growth Assumptions',
        message: 'Growth rates above 25% are ambitious. Ensure these projections are sustainable and well-supported.'
      });
    }

    // Discount rate analysis
    const discountRate = parseFloat(values.discountRate);
    if (discountRate < 8) {
      insights.push({
        type: 'warning' as const,
        title: 'Low Discount Rate',
        message: 'Discount rates below 8% may be too optimistic. Consider market risk and business-specific factors.'
      });
    }

    return insights;
  }, [results, values]);

  // Generate chart data for cash flow projections
  const cashFlowData = React.useMemo(() => {
    if (!results) return [];

    const data = [];
    const projectionYears = parseInt(values.projectionYears);
    let currentRevenue = parseFloat(values.annualRevenue);
    const growthRate = parseFloat(values.growthRate) / 100;
    const netMargin = parseFloat(values.netMargin) / 100;

    for (let year = 1; year <= projectionYears; year++) {
      currentRevenue *= (1 + growthRate);
      const netIncome = currentRevenue * netMargin;
      const freeCashFlow = netIncome * 0.85; // Typical FCF conversion

      data.push({
        year: `Year ${year}`,
        revenue: Math.round(currentRevenue),
        freeCashFlow: Math.round(freeCashFlow)
      });
    }

    return data;
  }, [results, values]);

  // Generate valuation method comparison data
  const valuationComparisonData = React.useMemo(() => {
    if (!results) return [];

    const { dcfValuation, multipleValuation, assetValuation } = results;

    return [
      { name: 'DCF Method', value: dcfValuation, color: theme.colors.blue[500] },
      { name: 'Multiple Method', value: multipleValuation, color: theme.colors.emerald[500] },
      { name: 'Asset Method', value: assetValuation, color: theme.colors.amber[500] }
    ];
  }, [results]);

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={insights}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* DCF Method Inputs */}
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
            <TrendingUp className="mr-2 w-5 h-5" />
            DCF Analysis Inputs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CurrencyInput
              id="annual-revenue"
              label="Annual Revenue"
              value={values.annualRevenue}
              onChange={(value) => updateField('annualRevenue', value)}
              placeholder="1,000,000"
              helpText="Current annual revenue"
            />
            <PercentageInput
              id="growth-rate"
              label="Revenue Growth Rate"
              value={values.growthRate}
              onChange={(value) => updateField('growthRate', value)}
              placeholder="15"
              helpText="Expected annual growth rate"
            />
            <PercentageInput
              id="net-margin"
              label="Net Profit Margin"
              value={values.netMargin}
              onChange={(value) => updateField('netMargin', value)}
              placeholder="20"
              helpText="Net income as % of revenue"
            />
            <PercentageInput
              id="discount-rate"
              label="Discount Rate (WACC)"
              value={values.discountRate}
              onChange={(value) => updateField('discountRate', value)}
              placeholder="12"
              helpText="Weighted average cost of capital"
            />
            <PercentageInput
              id="terminal-growth"
              label="Terminal Growth Rate"
              value={values.terminalGrowthRate}
              onChange={(value) => updateField('terminalGrowthRate', value)}
              placeholder="3"
              helpText="Long-term growth assumption"
            />
            <NumberInput
              id="projection-years"
              label="Projection Years"
              value={values.projectionYears}
              onChange={(value) => updateField('projectionYears', value)}
              min={3}
              max={10}
              helpText="Years to project cash flows"
            />
          </div>
        </div>

        {/* Multiple-Based Valuation Inputs */}
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
            <BarChart3 className="mr-2 w-5 h-5" />
            Multiple-Based Valuation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              id="ebitda"
              label="EBITDA"
              value={values.ebitda}
              onChange={(value) => updateField('ebitda', value)}
              placeholder="200,000"
              helpText="Earnings before interest, taxes, depreciation, amortization"
            />
            <NumberInput
              id="ebitda-multiple"
              label="Industry EBITDA Multiple"
              value={values.ebitdaMultiple}
              onChange={(value) => updateField('ebitdaMultiple', value)}
              step={0.1}
              helpText="Typical multiple for your industry"
            />
          </div>
        </div>

        {/* Asset-Based Valuation Inputs */}
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
            <Building2 className="mr-2 w-5 h-5" />
            Asset-Based Valuation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencyInput
              id="total-assets"
              label="Total Assets"
              value={values.totalAssets}
              onChange={(value) => updateField('totalAssets', value)}
              placeholder="500,000"
              helpText="Total book value of assets"
            />
            <CurrencyInput
              id="total-liabilities"
              label="Total Liabilities"
              value={values.totalLiabilities}
              onChange={(value) => updateField('totalLiabilities', value)}
              placeholder="200,000"
              helpText="Total liabilities and debt"
            />
          </div>
        </div>

        {/* Cash Flow Projections Chart */}
        {cashFlowData.length > 0 && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <BarChart3 className="mr-2 w-5 h-5" />
              Projected Cash Flows
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[600]} opacity={0.3} />
                  <XAxis 
                    dataKey="year" 
                    stroke={theme.colors.slate[400]} 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={theme.colors.slate[400]} 
                    fontSize={12} 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.colors.slate[800],
                      border: `1px solid ${theme.colors.slate[600]}`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                      color: theme.colors.white
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name === 'revenue' ? 'Revenue' : 'Free Cash Flow'
                    ]}
                  />
                  <Bar dataKey="revenue" fill={theme.colors.blue[500]} />
                  <Bar dataKey="freeCashFlow" fill={theme.colors.emerald[500]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Valuation Methods Comparison */}
        {valuationComparisonData.length > 0 && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <PieChartIcon className="mr-2 w-5 h-5" />
              Valuation Methods Comparison
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={valuationComparisonData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {valuationComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.colors.slate[800],
                        border: `1px solid ${theme.colors.slate[600]}`,
                        borderRadius: '8px',
                        color: theme.colors.white
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {valuationComparisonData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className={`font-medium ${theme.textColors.primary}`}>{item.name}</span>
                    </div>
                    <span className={`font-bold ${theme.textColors.primary}`}>
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Valuation Summary */}
        {results && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <Target className="mr-2 w-5 h-5" />
              Valuation Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                  {formatCurrency(results.dcfValuation)}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>DCF Method</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                  {formatCurrency(results.multipleValuation)}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Multiple Method</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                  {formatCurrency(results.assetValuation)}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Asset Method</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-lg border border-blue-500/30">
                <div className={`text-xl font-bold ${theme.textColors.success} mb-1`}>
                  {formatCurrency(results.averageValuation)}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Average Valuation</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorWrapper>
  );
}

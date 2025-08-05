'use client';

import React, { useState } from 'react';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, NumberInput, PercentageInput } from './FormFields';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { useLearningAnalytics } from '@/lib/algorithms/learningAnalytics';
import { formatCurrency } from '@/lib/utils/financial';
import {
  MultiLineChart,
  DonutChart
} from '@/components/shared/charts/ProfessionalCharts';
import { Building2, TrendingUp, BarChart3, Target, Brain, Lightbulb } from 'lucide-react';

interface BusinessValuationValues {
  annualRevenue: string;
  growthRate: string;
  netMargin: string;
  discountRate: string;
  terminalGrowthRate: string;
  projectionYears: string;
  ebitda: string;
  ebitdaMultiple: string;
  totalAssets: string;
  totalLiabilities: string;
}

interface BusinessValuationResult {
  dcfValuation: number;
  multipleValuation: number;
  assetValuation: number;
  averageValuation: number;
}

export default function BusinessValuationCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  const learningAnalytics = useLearningAnalytics();

  const [values, setValues] = useState<BusinessValuationValues>({
    annualRevenue: '1000000',
    growthRate: '15',
    netMargin: '20',
    discountRate: '10',
    terminalGrowthRate: '3',
    projectionYears: '5',
    ebitda: '200000',
    ebitdaMultiple: '8',
    totalAssets: '800000',
    totalLiabilities: '300000'
  });

  const updateField = (field: keyof BusinessValuationValues, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  React.useEffect(() => {
    recordCalculatorUsage('business-valuation-calculator');
  }, [recordCalculatorUsage]);

  // Calculate business valuation
  const result = React.useMemo((): BusinessValuationResult => {
    const revenue = parseFloat(values.annualRevenue) || 0;
    const growth = parseFloat(values.growthRate) / 100 || 0;
    const margin = parseFloat(values.netMargin) / 100 || 0;
    const discount = parseFloat(values.discountRate) / 100 || 0;
    const terminalGrowth = parseFloat(values.terminalGrowthRate) / 100 || 0;
    const years = parseInt(values.projectionYears) || 5;
    const ebitda = parseFloat(values.ebitda) || 0;
    const multiple = parseFloat(values.ebitdaMultiple) || 0;
    const assets = parseFloat(values.totalAssets) || 0;
    const liabilities = parseFloat(values.totalLiabilities) || 0;

    // DCF Calculation
    let dcfValue = 0;
    let currentRevenue = revenue;

    for (let year = 1; year <= years; year++) {
      currentRevenue *= (1 + growth);
      const netIncome = currentRevenue * margin;
      const presentValue = netIncome / Math.pow(1 + discount, year);
      dcfValue += presentValue;
    }

    // Terminal value
    const terminalCashFlow = currentRevenue * margin * (1 + terminalGrowth);
    const terminalValue = terminalCashFlow / (discount - terminalGrowth);
    const presentTerminalValue = terminalValue / Math.pow(1 + discount, years);
    dcfValue += presentTerminalValue;

    // Multiple valuation
    const multipleValue = ebitda * multiple;

    // Asset valuation
    const assetValue = assets - liabilities;

    // Average valuation
    const average = (dcfValue + multipleValue + assetValue) / 3;

    return {
      dcfValuation: dcfValue,
      multipleValuation: multipleValue,
      assetValuation: assetValue,
      averageValuation: average
    };
  }, [values]);

  const reset = () => {
    setValues({
      annualRevenue: '1000000',
      growthRate: '15',
      netMargin: '20',
      discountRate: '10',
      terminalGrowthRate: '3',
      projectionYears: '5',
      ebitda: '200000',
      ebitdaMultiple: '8',
      totalAssets: '800000',
      totalLiabilities: '300000'
    });
  };

  const metadata: CalculatorMetadata = {
    id: 'business-valuation-calculator',
    title: 'Business Valuation Calculator',
    description: 'Calculate business value using DCF, multiples, and asset-based approaches',
    category: 'advanced',
    tags: ['valuation', 'dcf', 'business', 'investment']
  };

  // Generate insights
  const insights = React.useMemo(() => {
    if (!result) return [];

    const { dcfValuation, multipleValuation, assetValuation, averageValuation } = result;
    const insights = [];

    // Check for valuation convergence
    const valuations = [dcfValuation, multipleValuation, assetValuation];
    const maxVal = Math.max(...valuations);
    const minVal = Math.min(...valuations);
    const variance = ((maxVal - minVal) / averageValuation) * 100;

    if (variance < 20) {
      insights.push({
        type: 'success' as const,
        title: 'Valuation Convergence',
        message: `All valuation methods are within 20%, suggesting a reliable estimate of ${formatCurrency(averageValuation)}.`
      });
    } else {
      insights.push({
        type: 'warning' as const,
        title: 'Valuation Divergence',
        message: `Significant variance between methods (${variance.toFixed(1)}%). Consider reviewing assumptions.`
      });
    }

    const growthRate = parseFloat(values.growthRate) || 0;
    const discountRate = parseFloat(values.discountRate) || 0;

    if (growthRate > 25) {
      insights.push({
        type: 'warning' as const,
        title: 'High Growth Assumption',
        message: 'Growth rates above 25% are difficult to sustain long-term. Consider more conservative projections.'
      });
    }

    if (discountRate < 8) {
      insights.push({
        type: 'info' as const,
        title: 'Low Discount Rate',
        message: 'Your discount rate seems optimistic. Most businesses carry higher risk profiles.'
      });
    }

    return insights;
  }, [result, values]);

  // Generate chart data for cash flow projections
  const cashFlowData = React.useMemo(() => {
    if (!result) return [];

    const data = [];
    const projectionYears = parseInt(values.projectionYears);
    let currentRevenue = parseFloat(values.annualRevenue);
    const growthRate = parseFloat(values.growthRate) / 100;
    const netMargin = parseFloat(values.netMargin) / 100;

    for (let year = 1; year <= projectionYears; year++) {
      currentRevenue *= (1 + growthRate);
      const cashFlow = currentRevenue * netMargin;
      data.push({
        year,
        revenue: currentRevenue,
        cashFlow,
        name: `Year ${year}`
      });
    }

    return data;
  }, [result, values]);

  // Generate valuation method comparison data
  const valuationComparisonData = React.useMemo(() => {
    if (!result) return [];

    const { dcfValuation, multipleValuation, assetValuation } = result;

    return [
      { label: 'DCF Method', value: dcfValuation, color: theme.colors.blue[500] },
      { label: 'Multiple Method', value: multipleValuation, color: theme.colors.emerald[500] },
      { label: 'Asset Method', value: assetValuation, color: theme.colors.amber[500] }
    ];
  }, [result]);

  const calculatorResults = result ? {
    primary: {
      label: 'Average Valuation',
      value: formatCurrency(result.averageValuation),
      helpText: 'Average of all three valuation methods'
    },
    secondary: [
      {
        label: 'DCF Valuation',
        value: formatCurrency(result.dcfValuation)
      },
      {
        label: 'Multiple Valuation',
        value: formatCurrency(result.multipleValuation)
      },
      {
        label: 'Asset Valuation',
        value: formatCurrency(result.assetValuation)
      }
    ]
  } : undefined;

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={insights}
      onReset={reset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          {/* DCF Inputs */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <TrendingUp className="mr-2 w-5 h-5" />
              DCF Analysis
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <CurrencyInput
                id="annualRevenue"
                label="Annual Revenue"
                value={values.annualRevenue}
                onChange={(value) => updateField('annualRevenue', value)}
                helpText="Current annual revenue"
              />
              <PercentageInput
                id="growthRate"
                label="Growth Rate"
                value={values.growthRate}
                onChange={(value) => updateField('growthRate', value)}
                helpText="Expected annual revenue growth"
              />
              <PercentageInput
                id="netMargin"
                label="Net Margin"
                value={values.netMargin}
                onChange={(value) => updateField('netMargin', value)}
                helpText="Net profit margin percentage"
              />
              <PercentageInput
                id="discountRate"
                label="Discount Rate"
                value={values.discountRate}
                onChange={(value) => updateField('discountRate', value)}
                helpText="Required rate of return (WACC)"
              />
              <PercentageInput
                id="terminalGrowthRate"
                label="Terminal Growth Rate"
                value={values.terminalGrowthRate}
                onChange={(value) => updateField('terminalGrowthRate', value)}
                helpText="Long-term growth rate"
              />
              <NumberInput
                id="projectionYears"
                label="Projection Years"
                value={values.projectionYears}
                onChange={(value) => updateField('projectionYears', value)}
                min={3}
                max={10}
                helpText="Number of years to project"
              />
            </div>
          </div>

          {/* Multiple Valuation Inputs */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <BarChart3 className="mr-2 w-5 h-5" />
              Multiple Analysis
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <CurrencyInput
                id="ebitda"
                label="EBITDA"
                value={values.ebitda}
                onChange={(value) => updateField('ebitda', value)}
                helpText="Earnings before interest, taxes, depreciation, and amortization"
              />
              <NumberInput
                id="ebitdaMultiple"
                label="EBITDA Multiple"
                value={values.ebitdaMultiple}
                onChange={(value) => updateField('ebitdaMultiple', value)}
                step={0.1}
                helpText="Industry EBITDA multiple"
              />
            </div>
          </div>

          {/* Asset Valuation Inputs */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <Building2 className="mr-2 w-5 h-5" />
              Asset Analysis
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <CurrencyInput
                id="totalAssets"
                label="Total Assets"
                value={values.totalAssets}
                onChange={(value) => updateField('totalAssets', value)}
                helpText="Book value of all assets"
              />
              <CurrencyInput
                id="totalLiabilities"
                label="Total Liabilities"
                value={values.totalLiabilities}
                onChange={(value) => updateField('totalLiabilities', value)}
                helpText="Book value of all liabilities"
              />
            </div>
          </div>
        </div>

        {/* Results and Charts */}
        <div className="space-y-6">
          {/* Valuation Summary */}
          {result && (
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
                <Target className="mr-2 w-5 h-5" />
                Valuation Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                    {formatCurrency(result.dcfValuation)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>DCF Method</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                    {formatCurrency(result.multipleValuation)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Multiple Method</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                    {formatCurrency(result.assetValuation)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Asset Method</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                    {formatCurrency(result.averageValuation)}
                  </div>
                  <div className={`text-sm ${theme.textColors.primary}`}>Average</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Valuation Method Comparison Chart */}
          {valuationComparisonData.length > 0 && (
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h4 className={`text-lg font-semibold mb-4 ${theme.textColors.primary}`}>Valuation Comparison</h4>
              <DonutChart
                data={valuationComparisonData}
                title="Valuation Methods"
                height={300}
                showLegend={true}
              />
            </div>
          )}

          {/* Enhanced Cash Flow Projections Chart */}
          {cashFlowData.length > 0 && (
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h4 className={`text-lg font-semibold mb-4 ${theme.textColors.primary}`}>Cash Flow Projections</h4>
              <MultiLineChart
                series={[
                  {
                    name: 'Revenue',
                    data: cashFlowData.map(item => ({ x: new Date(2024, item.year - 1, 1), y: item.revenue })),
                    color: theme.colors.blue[500]
                  },
                  {
                    name: 'Cash Flow',
                    data: cashFlowData.map(item => ({ x: new Date(2024, item.year - 1, 1), y: item.cashFlow })),
                    color: theme.colors.emerald[500]
                  }
                ]}
                title="Financial Projections"
                yAxisFormatter={formatCurrency}
                height={350}
              />
            </div>
          )}

          {/* AI-Powered Learning Insights */}
          {learningAnalytics && (
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.accent} rounded-lg p-6`}>
              <h4 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
                <Brain className="mr-2 w-5 h-5 text-amber-400" />
                AI Learning Insights
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-500/15 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-blue-400 text-sm font-medium mb-1">Mastery Level</div>
                    <div className="text-white text-2xl font-bold">
                      {(learningAnalytics.predictedMastery * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg p-4">
                    <div className="text-emerald-400 text-sm font-medium mb-1">Learning Velocity</div>
                    <div className="text-white text-2xl font-bold">
                      {learningAnalytics.learningVelocity.toFixed(1)} concepts/hr
                    </div>
                  </div>
                </div>

                {learningAnalytics.strugglingConcepts.length > 0 && (
                  <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg p-4">
                    <div className="text-amber-400 text-sm font-medium mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-1" />
                      Recommended Review Topics
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {learningAnalytics.strugglingConcepts.slice(0, 3).map((concept, index) => (
                        <span key={index} className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorWrapper>
  );
}

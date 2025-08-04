'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, NumberInput, PercentageInput, SelectField } from './FormFields';
import { theme } from '@/lib/theme';
import { useBondCalculator } from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
import { formatCurrency } from '@/lib/utils/financial';
import { TrendingUp, DollarSign, Percent, Target, BarChart3 } from 'lucide-react';

export default function BondCalculator() {
  const { recordCalculatorUsage } = useProgressStore();

  React.useEffect(() => {
    recordCalculatorUsage('bond-calculator');
  }, [recordCalculatorUsage]);

  const metadata: CalculatorMetadata = {
    id: 'bond-calculator',
    title: 'Bond Calculator',
    description: 'Calculate bond yields, prices, and investment returns. Analyze current yield, yield to maturity, and interest rate sensitivity.',
    category: 'intermediate',
    icon: TrendingUp,
    tags: ['Bonds', 'Fixed Income', 'Yield Calculation', 'Investment Analysis', 'Duration'],
    educationalNotes: [
      {
        title: 'Understanding Bond Yields',
        content: 'Different yield measures provide various perspectives on bond performance and help you make informed investment decisions.',
        tips: [
          'Current yield shows annual income relative to current price',
          'Yield to maturity considers total return if held to maturity',
          'Higher yields generally indicate higher risk',
          'Bond prices move inversely to interest rates'
        ]
      },
      {
        title: 'Interest Rate Risk',
        content: 'Bond prices are sensitive to interest rate changes. Duration measures this sensitivity and helps assess price volatility risk.',
        tips: [
          'Longer maturity bonds are more sensitive to rate changes',
          'Duration approximates price change for 1% rate movement',
          'Consider laddering maturities to reduce interest rate risk',
          'Rising rates decrease bond prices, falling rates increase them'
        ]
      }
    ]
  };

  const calculatorHook = useBondCalculator();
  const { values, results, updateField, reset } = calculatorHook;

  const handleReset = () => {
    reset();
  };

  // Generate results for CalculatorWrapper
  const calculatorResults = React.useMemo(() => {
    if (!results) return undefined;

    const { currentYield, yieldToMaturity, totalReturn, annualIncome } = results;

    return {
      primary: {
        label: 'Yield to Maturity',
        value: yieldToMaturity,
        format: 'percentage' as const,
        variant: 'success' as const,
        description: 'Annualized return if held to maturity'
      },
      secondary: [
        {
          label: 'Current Yield',
          value: currentYield,
          format: 'percentage' as const,
          variant: 'info' as const,
          description: 'Annual income divided by current price'
        },
        {
          label: 'Annual Income',
          value: annualIncome,
          format: 'currency' as const,
          variant: 'success' as const,
          description: 'Annual coupon payments'
        },
        {
          label: 'Total Return',
          value: totalReturn,
          format: 'currency' as const,
          variant: 'info' as const,
          description: 'Total income + capital gain if held to maturity'
        }
      ]
    };
  }, [results]);

  // Generate insights
  const insights = React.useMemo(() => {
    if (!results) return [];

    const { currentYield, yieldToMaturity, interestRateSensitivity } = results;
    const currentPrice = parseFloat(values.currentPrice);
    const faceValue = parseFloat(values.faceValue);
    const insights = [];

    // Price vs. Par analysis
    if (currentPrice < faceValue * 0.95) {
      insights.push({
        type: 'success' as const,
        title: 'Trading at Discount',
        message: `Bond is trading ${((1 - currentPrice / faceValue) * 100).toFixed(1)}% below par value, offering potential capital appreciation.`
      });
    } else if (currentPrice > faceValue * 1.05) {
      insights.push({
        type: 'warning' as const,
        title: 'Trading at Premium',
        message: `Bond is trading ${((currentPrice / faceValue - 1) * 100).toFixed(1)}% above par value, expect capital loss at maturity.`
      });
    }

    // Yield comparison
    if (yieldToMaturity > currentYield * 1.1) {
      insights.push({
        type: 'success' as const,
        title: 'Attractive Total Return',
        message: `Yield to maturity (${yieldToMaturity.toFixed(2)}%) significantly exceeds current yield, indicating good total return potential.`
      });
    }

    // Duration risk assessment
    if (interestRateSensitivity > 8) {
      insights.push({
        type: 'warning' as const,
        title: 'High Interest Rate Risk',
        message: `High duration (${interestRateSensitivity.toFixed(1)} years) means significant price sensitivity to rate changes.`
      });
    } else if (interestRateSensitivity < 3) {
      insights.push({
        type: 'info' as const,
        title: 'Low Interest Rate Risk',
        message: `Low duration (${interestRateSensitivity.toFixed(1)} years) provides relative stability against rate changes.`
      });
    }

    return insights;
  }, [results, values]);

  // Generate interest rate scenario data
  const scenarioData = React.useMemo(() => {
    if (!results) return [];

    const data: Array<{
      rateChange: string;
      newPrice: number;
      priceChange: number;
      changeAmount: number;
    }> = [];
    
    const rateChanges = [-2, -1, -0.5, 0, 0.5, 1, 2];
    const currentPrice = parseFloat(values.currentPrice);
    const { interestRateSensitivity } = results;

    rateChanges.forEach(change => {
      const priceChange = -interestRateSensitivity * change;
      const newPrice = currentPrice * (1 + priceChange / 100);
      
      data.push({
        rateChange: `${change > 0 ? '+' : ''}${change}%`,
        newPrice: Math.round(newPrice * 100) / 100,
        priceChange: Math.round(priceChange * 100) / 100,
        changeAmount: newPrice - currentPrice
      });
    });

    return data;
  }, [results, values]);

  // Payment frequency options
  const frequencyOptions = [
    { value: '1', label: 'Annual' },
    { value: '2', label: 'Semi-Annual' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' }
  ];

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={insights}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* Bond Details Section */}
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
            <DollarSign className="mr-2 w-5 h-5" />
            Bond Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CurrencyInput
              id="face-value"
              label="Face Value (Par)"
              value={values.faceValue}
              onChange={(value) => updateField('faceValue', value)}
              placeholder="1,000"
              helpText="Par value of the bond"
            />
            <CurrencyInput
              id="current-price"
              label="Current Market Price"
              value={values.currentPrice}
              onChange={(value) => updateField('currentPrice', value)}
              placeholder="950"
              helpText="Current trading price"
            />
            <PercentageInput
              id="coupon-rate"
              label="Annual Coupon Rate"
              value={values.couponRate}
              onChange={(value) => updateField('couponRate', value)}
              placeholder="5.0"
              helpText="Annual interest rate"
            />
            <NumberInput
              id="years-to-maturity"
              label="Years to Maturity"
              value={values.yearsToMaturity}
              onChange={(value) => updateField('yearsToMaturity', value)}
              min={0.1}
              max={50}
              step={0.1}
              helpText="Time remaining until maturity"
            />
            <SelectField
              id="payment-frequency"
              label="Payment Frequency"
              value={values.paymentFrequency}
              onChange={(value: string) => updateField('paymentFrequency', value)}
              options={frequencyOptions}
              helpText="How often coupons are paid"
            />
          </div>
        </div>

        {/* Bond Metrics Summary */}
        {results && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <Target className="mr-2 w-5 h-5" />
              Bond Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                  {results.currentYield.toFixed(2)}%
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Current Yield</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className={`text-xl font-bold ${theme.textColors.success} mb-1`}>
                  {results.yieldToMaturity.toFixed(2)}%
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Yield to Maturity</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                  {results.interestRateSensitivity.toFixed(1)}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Duration (Years)</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                  {formatCurrency(results.annualIncome)}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Annual Income</div>
              </div>
            </div>
          </div>
        )}

        {/* Interest Rate Sensitivity Analysis */}
        {scenarioData.length > 0 && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <BarChart3 className="mr-2 w-5 h-5" />
              Interest Rate Sensitivity Analysis
            </h3>
            <div className="h-80 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[600]} opacity={0.3} />
                  <XAxis 
                    dataKey="rateChange" 
                    stroke={theme.colors.slate[400]} 
                    fontSize={12}
                    label={{ value: 'Interest Rate Change', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: theme.colors.slate[400] } }}
                  />
                  <YAxis 
                    stroke={theme.colors.slate[400]} 
                    fontSize={12} 
                    tickFormatter={(value) => `$${value}`}
                    label={{ value: 'Bond Price', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: theme.colors.slate[400] } }}
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
                      name === 'newPrice' ? formatCurrency(value) : `${value.toFixed(2)}%`,
                      name === 'newPrice' ? 'New Price' : 'Price Change'
                    ]}
                  />
                  <Bar dataKey="newPrice" fill={theme.colors.blue[500]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Scenario table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${theme.borderColors.primary}`}>
                    <th className={`text-left py-2 px-3 ${theme.textColors.primary}`}>Rate Change</th>
                    <th className={`text-right py-2 px-3 ${theme.textColors.primary}`}>New Price</th>
                    <th className={`text-right py-2 px-3 ${theme.textColors.primary}`}>Price Change</th>
                    <th className={`text-right py-2 px-3 ${theme.textColors.primary}`}>Dollar Change</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioData.map((scenario, index) => (
                    <tr key={index} className={`border-b ${theme.borderColors.primary} ${index % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
                      <td className={`py-2 px-3 ${theme.textColors.secondary}`}>{scenario.rateChange}</td>
                      <td className={`py-2 px-3 text-right ${theme.textColors.primary}`}>{formatCurrency(scenario.newPrice)}</td>
                      <td className={`py-2 px-3 text-right ${scenario.priceChange >= 0 ? theme.textColors.success : theme.textColors.error}`}>
                        {scenario.priceChange >= 0 ? '+' : ''}{scenario.priceChange.toFixed(2)}%
                      </td>
                      <td className={`py-2 px-3 text-right ${scenario.changeAmount >= 0 ? theme.textColors.success : theme.textColors.error}`}>
                        {scenario.changeAmount >= 0 ? '+' : ''}{formatCurrency(scenario.changeAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Purchase vs. Par Analysis */}
        {results && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
              <Percent className="mr-2 w-5 h-5" />
              Investment Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className={`font-medium ${theme.textColors.secondary}`}>Purchase Price</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{formatCurrency(parseFloat(values.currentPrice))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className={`font-medium ${theme.textColors.secondary}`}>Face Value</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>{formatCurrency(parseFloat(values.faceValue))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className={`font-medium ${theme.textColors.secondary}`}>Premium/Discount</span>
                  <span className={`font-bold ${
                    parseFloat(values.currentPrice) > parseFloat(values.faceValue) 
                      ? theme.textColors.warning 
                      : theme.textColors.success
                  }`}>
                    {((parseFloat(values.currentPrice) / parseFloat(values.faceValue) - 1) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className={`font-medium ${theme.textColors.secondary}`}>Total Coupons</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>
                    {formatCurrency(results.annualIncome * parseFloat(values.yearsToMaturity))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                  <span className={`font-medium ${theme.textColors.secondary}`}>Capital Gain/Loss</span>
                  <span className={`font-bold ${
                    parseFloat(values.faceValue) >= parseFloat(values.currentPrice) 
                      ? theme.textColors.success 
                      : theme.textColors.error
                  }`}>
                    {formatCurrency(parseFloat(values.faceValue) - parseFloat(values.currentPrice))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-lg border border-blue-500/30">
                  <span className={`font-medium ${theme.textColors.secondary}`}>Total Return</span>
                  <span className={`font-bold ${theme.textColors.success}`}>{formatCurrency(results.totalReturn)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorWrapper>
  );
}

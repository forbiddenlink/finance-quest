'use client';

import React from 'react';
import CalculatorWrapper from './CalculatorWrapper';
import { CurrencyInput, PercentageInput, NumberInput, SelectField } from './FormFields';
import { InputGroup } from './FormFields';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Home, TrendingUp, Calendar, DollarSign, Percent, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/financial';
import { theme } from '@/lib/theme';
import { useMortgageCalculator } from '@/lib/utils/calculatorHooks';

interface PaymentBreakdown {
  year: number;
  month: number;
  monthNumber: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

interface CostBreakdown {
  name: string;
  value: number;
  color: string;
}

export default function MortgageCalculator() {
  const {
    values,
    results,
    validation,
    updateField,
    reset,
    errors
  } = useMortgageCalculator();

  // Additional state for advanced scenarios
  const [downPaymentType, setDownPaymentType] = React.useState<'percentage' | 'amount'>('percentage');
  const [includeExtras, setIncludeExtras] = React.useState(false);
  const [propertyTax, setPropertyTax] = React.useState('3600');
  const [homeInsurance, setHomeInsurance] = React.useState('1200');
  const [pmi, setPmi] = React.useState('150');
  const [hoaFees, setHoaFees] = React.useState('0');

  // Calculate comprehensive payment breakdown
  const generatePaymentSchedule = React.useMemo((): PaymentBreakdown[] => {
    if (!results) return [];

    const schedule: PaymentBreakdown[] = [];
    let balance = results.loanAmount;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;

    const monthlyRate = results.monthlyInterestRate / 100;
    const totalPayments = parseInt(values.termYears) * 12;

    for (let month = 1; month <= totalPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = results.monthlyPayment - interestPayment;

      balance -= principalPayment;
      cumulativeInterest += interestPayment;
      cumulativePrincipal += principalPayment;

      schedule.push({
        year: Math.ceil(month / 12),
        month: ((month - 1) % 12) + 1,
        monthNumber: month,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        cumulativeInterest,
        cumulativePrincipal
      });
    }

    return schedule;
  }, [results, values.termYears]);

  // Generate yearly summary for chart
  const yearlyData = React.useMemo(() => {
    if (!generatePaymentSchedule.length) return [];

    const yearsMap = new Map<number, { principal: number; interest: number; balance: number }>();

    generatePaymentSchedule.forEach(payment => {
      if (!yearsMap.has(payment.year)) {
        yearsMap.set(payment.year, { principal: 0, interest: 0, balance: payment.balance });
      }
      const yearData = yearsMap.get(payment.year)!;
      yearData.principal += payment.principal;
      yearData.interest += payment.interest;
      yearData.balance = payment.balance;
    });

    return Array.from(yearsMap.entries()).map(([year, data]) => ({
      year,
      principal: data.principal,
      interest: data.interest,
      balance: data.balance,
      totalPayment: data.principal + data.interest
    }));
  }, [generatePaymentSchedule]);

  // Calculate total housing payment including extras
  const totalHousingPayment = React.useMemo(() => {
    if (!results || !includeExtras) return results?.monthlyPayment || 0;

    const monthlyPropertyTax = (parseFloat(propertyTax) || 0) / 12;
    const monthlyInsurance = (parseFloat(homeInsurance) || 0) / 12;
    const monthlyPMI = parseFloat(pmi) || 0;
    const monthlyHOA = parseFloat(hoaFees) || 0;

    return results.monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
  }, [results, includeExtras, propertyTax, homeInsurance, pmi, hoaFees]);

  // Cost breakdown for pie chart
  const costBreakdown: CostBreakdown[] = React.useMemo(() => {
    if (!results) return [];

    const breakdown: CostBreakdown[] = [
      { name: 'Principal & Interest', value: results.monthlyPayment, color: '#3B82F6' }
    ];

    if (includeExtras) {
      const monthlyPropertyTax = (parseFloat(propertyTax) || 0) / 12;
      const monthlyInsurance = (parseFloat(homeInsurance) || 0) / 12;
      const monthlyPMI = parseFloat(pmi) || 0;
      const monthlyHOA = parseFloat(hoaFees) || 0;

      if (monthlyPropertyTax > 0) breakdown.push({ name: 'Property Tax', value: monthlyPropertyTax, color: '#EF4444' });
      if (monthlyInsurance > 0) breakdown.push({ name: 'Home Insurance', value: monthlyInsurance, color: '#F59E0B' });
      if (monthlyPMI > 0) breakdown.push({ name: 'PMI', value: monthlyPMI, color: '#8B5CF6' });
      if (monthlyHOA > 0) breakdown.push({ name: 'HOA Fees', value: monthlyHOA, color: '#10B981' });
    }

    return breakdown;
  }, [results, includeExtras, propertyTax, homeInsurance, pmi, hoaFees]);

  // Generate insights
  const generateInsights = () => {
    if (!results) return [];

    const insights = [];
    const loanToValue = (results.loanAmount / parseFloat(values.homePrice)) * 100;
    const debtToIncomeRatio = 28; // Assume 28% as target ratio

    // LTV insight
    if (loanToValue >= 80) {
      insights.push({
        type: 'warning' as const,
        title: 'High Loan-to-Value Ratio',
        message: `Your LTV is ${loanToValue.toFixed(1)}%. Consider a larger down payment to avoid PMI and reduce monthly costs.`
      });
    } else {
      insights.push({
        type: 'success' as const,
        title: 'Good Loan-to-Value Ratio',
        message: `Your LTV of ${loanToValue.toFixed(1)}% is excellent! You'll likely avoid PMI and get better rates.`
      });
    }

    // Interest vs Principal insight
    if (results.totalInterest > results.loanAmount) {
      insights.push({
        type: 'info' as const,
        title: 'Interest Exceeds Principal',
        message: `You'll pay ${formatCurrency(results.totalInterest)} in interest over the loan term. Consider making extra payments to reduce this cost.`
      });
    }

    // Payment timing insight
    const totalPayments = parseInt(values.termYears) * 12;
    if (totalPayments >= 360) {
      insights.push({
        type: 'info' as const,
        title: 'Long-Term Loan',
        message: `A 30-year mortgage means lower monthly payments but more total interest. Consider a 15-year loan if you can afford higher payments.`
      });
    }

    // Rate insight
    const currentRate = parseFloat(values.interestRate);
    if (currentRate > 7) {
      insights.push({
        type: 'warning' as const,
        title: 'High Interest Rate',
        message: `Your ${currentRate}% rate is above average. Consider shopping around or improving your credit score for better rates.`
      });
    } else if (currentRate < 4) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent Interest Rate',
        message: `Your ${currentRate}% rate is fantastic! This will save you significant money over the loan term.`
      });
    }

    return insights;
  };

  const handleReset = () => {
    reset();
    setDownPaymentType('percentage');
    setIncludeExtras(false);
    setPropertyTax('3600');
    setHomeInsurance('1200');
    setPmi('150');
    setHoaFees('0');
  };

  // Calculator metadata
  const metadata = {
    id: 'mortgage-calculator',
    title: 'Mortgage Calculator',
    description: 'Calculate monthly payments, total costs, and payment schedules for home loans.',
    category: 'basic' as const,
    icon: Home,
    tags: ['mortgage', 'home loan', 'real estate', 'monthly payment'],
    educationalNotes: [
      {
        title: 'Understanding Mortgage Payments',
        content: 'Your monthly mortgage payment consists of four main components: Principal, Interest, Taxes, and Insurance (PITI). The principal pays down your loan balance, while interest is the cost of borrowing.',
        tips: [
          'Aim for a total housing payment under 28% of gross income',
          'Consider all costs: PMI, taxes, insurance, HOA fees',
          'A 20% down payment typically eliminates PMI requirements',
          'Even small rate differences have huge long-term impacts'
        ]
      },
      {
        title: 'Mortgage Strategy Tips',
        content: 'The type of mortgage you choose affects your long-term financial health. Consider both monthly affordability and total cost over time.',
        tips: [
          '15-year loans have higher payments but save massive interest',
          'Extra principal payments can cut years off your loan',
          'Consider bi-weekly payments to pay off faster',
          'Factor in opportunity cost of large down payments'
        ]
      }
    ]
  };

  // Results formatting for the wrapper
  const calculatorResults = results ? {
    primary: {
      label: 'Monthly Payment (P&I)',
      value: results.monthlyPayment,
      format: 'currency' as const,
      variant: 'success' as const,
      description: includeExtras ? `Total with extras: ${formatCurrency(totalHousingPayment)}` : 'Principal and interest only'
    },
    secondary: [
      {
        label: 'Loan Amount',
        value: results.loanAmount,
        format: 'currency' as const,
        description: `${((results.loanAmount / parseFloat(values.homePrice)) * 100).toFixed(1)}% LTV`
      },
      {
        label: 'Total Interest',
        value: results.totalInterest,
        format: 'currency' as const,
        variant: results.totalInterest > results.loanAmount ? 'warning' as const : 'info' as const,
        description: `Over ${values.termYears} years`
      },
      {
        label: 'Total Cost',
        value: results.totalCost,
        format: 'currency' as const,
        description: 'Principal + total interest'
      }
    ]
  } : undefined;

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={generateInsights()}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* Basic Loan Information */}
        <InputGroup title="Loan Details" description="Enter the basic mortgage information">
          <div className={theme.utils.calculatorFieldGrid(2)}>
            <CurrencyInput
              id="home-price"
              label="Home Price"
              value={values.homePrice}
              onChange={(value) => updateField('homePrice', value)}
              placeholder="400,000"
              helpText="Total purchase price of the home"
              error={errors.homePrice}
              required
            />
            <div className="space-y-2">
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setDownPaymentType('percentage')}
                  className={`px-3 py-1 text-xs rounded ${downPaymentType === 'percentage'
                      ? theme.buttons.primary
                      : theme.buttons.secondary
                    }`}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setDownPaymentType('amount')}
                  className={`px-3 py-1 text-xs rounded ${downPaymentType === 'amount'
                      ? theme.buttons.primary
                      : theme.buttons.secondary
                    }`}
                >
                  Amount
                </button>
              </div>
              {downPaymentType === 'percentage' ? (
                <PercentageInput
                  id="down-payment"
                  label="Down Payment"
                  value={values.downPayment}
                  onChange={(value) => updateField('downPayment', value)}
                  placeholder="20"
                  helpText={`${formatCurrency((parseFloat(values.homePrice) || 0) * (parseFloat(values.downPayment) || 0) / 100)}`}
                  error={errors.downPayment}
                />
              ) : (
                <CurrencyInput
                  id="down-payment-amount"
                  label="Down Payment Amount"
                  value={((parseFloat(values.homePrice) || 0) * (parseFloat(values.downPayment) || 0) / 100).toString()}
                  onChange={(value) => {
                    const percentage = (parseFloat(value) / (parseFloat(values.homePrice) || 1)) * 100;
                    updateField('downPayment', percentage.toString());
                  }}
                  placeholder="80,000"
                  helpText={`${values.downPayment}% of home price`}
                />
              )}
            </div>
          </div>

          <div className={theme.utils.calculatorFieldGrid(2)}>
            <PercentageInput
              id="interest-rate"
              label="Interest Rate"
              value={values.interestRate}
              onChange={(value) => updateField('interestRate', value)}
              placeholder="6.5"
              helpText="Annual percentage rate (APR)"
              error={errors.interestRate}
              required
            />
            <SelectField
              id="loan-term"
              label="Loan Term"
              value={values.termYears}
              onChange={(value) => updateField('termYears', value)}
              options={[
                { value: '15', label: '15 years' },
                { value: '20', label: '20 years' },
                { value: '25', label: '25 years' },
                { value: '30', label: '30 years' }
              ]}
              helpText="Length of the mortgage"
              error={errors.termYears}
            />
          </div>
        </InputGroup>

        {/* Additional Costs */}
        <InputGroup title="Additional Housing Costs" description="Include property tax, insurance, and other fees for total monthly payment">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="include-extras"
              checked={includeExtras}
              onChange={(e) => setIncludeExtras(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="include-extras" className={`text-sm font-medium ${theme.textColors.primary}`}>
              Include additional housing costs in calculations
            </label>
          </div>

          {includeExtras && (
            <div className={theme.utils.calculatorFieldGrid(2)}>
              <CurrencyInput
                id="property-tax"
                label="Annual Property Tax"
                value={propertyTax}
                onChange={setPropertyTax}
                placeholder="3,600"
                helpText="Yearly property tax amount"
              />
              <CurrencyInput
                id="home-insurance"
                label="Annual Home Insurance"
                value={homeInsurance}
                onChange={setHomeInsurance}
                placeholder="1,200"
                helpText="Yearly homeowner's insurance"
              />
              <CurrencyInput
                id="pmi"
                label="Monthly PMI"
                value={pmi}
                onChange={setPmi}
                placeholder="150"
                helpText="Private mortgage insurance"
              />
              <CurrencyInput
                id="hoa-fees"
                label="Monthly HOA Fees"
                value={hoaFees}
                onChange={setHoaFees}
                placeholder="0"
                helpText="Homeowner association fees"
              />
            </div>
          )}
        </InputGroup>

        {/* Key Metrics */}
        {results && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={theme.utils.calculatorMetric()}>
              <DollarSign className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {formatCurrency(results.loanAmount)}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Loan Amount</div>
            </div>

            <div className={theme.utils.calculatorMetric()}>
              <Percent className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {((results.loanAmount / parseFloat(values.homePrice)) * 100).toFixed(1)}%
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Loan-to-Value</div>
            </div>

            <div className={theme.utils.calculatorMetric()}>
              <Calendar className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {parseInt(values.termYears) * 12}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Total Payments</div>
            </div>

            <div className={theme.utils.calculatorMetric()}>
              <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${theme.textColors.accent}`} />
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {(results.monthlyInterestRate).toFixed(3)}%
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Monthly Rate</div>
            </div>
          </div>
        )}

        {/* Charts and Visualizations */}
        {results && yearlyData.length > 0 && (
          <div className="space-y-8 mt-8">
            {/* Payment Breakdown Chart */}
            <div className={theme.utils.calculatorChart()}>
              <h3 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
                {includeExtras ? 'Total Monthly Housing Payment' : 'Principal & Interest Breakdown'}
              </h3>

              {includeExtras && costBreakdown.length > 1 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className={`w-12 h-12 mx-auto mb-4 ${theme.textColors.muted}`} />
                  <p className={theme.textColors.secondary}>Enable "Include additional housing costs" to see payment breakdown</p>
                </div>
              )}

              {/* Legend for pie chart */}
              {includeExtras && costBreakdown.length > 1 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {costBreakdown.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                      <span className={`text-sm ${theme.textColors.secondary}`}>
                        {entry.name}: {formatCurrency(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Loan Balance Over Time */}
            <div className={theme.utils.calculatorChart()}>
              <h3 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Loan Balance Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      className={theme.textColors.muted}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      axisLine={false}
                      tickLine={false}
                      className={theme.textColors.muted}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Year ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={false}
                      name="Remaining Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Composition Over Time */}
            <div className={theme.utils.calculatorChart()}>
              <h3 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Annual Payment Composition</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      className={theme.textColors.muted}
                    />
                    <YAxis
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      axisLine={false}
                      tickLine={false}
                      className={theme.textColors.muted}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Year ${label}`}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="principal"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Principal"
                    />
                    <Line
                      type="monotone"
                      dataKey="interest"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="Interest"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorWrapper>
  );
}

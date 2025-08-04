'use client';

import React, { useState, useMemo } from 'react';
import CalculatorWrapper, { CalculatorMetadata, CalculatorInsight } from './CalculatorWrapper';
import { CurrencyInput, NumberInput, PercentageInput } from './FormFields';
import { Home } from 'lucide-react';

interface MortgageInputs {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  downPayment: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
}

export default function MortgageCalculator() {
  const metadata: CalculatorMetadata = {
    id: 'mortgage-calculator',
    title: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments including principal, interest, taxes, and insurance (PITI)',
    category: 'intermediate',
    icon: Home,
    tags: ['Real Estate', 'Mortgage', 'Home Buying', 'PITI', 'Monthly Payment'],
    educationalNotes: [
      {
        title: 'Understanding Mortgage Payments',
        content: 'Your monthly mortgage payment typically includes four components: Principal (loan amount), Interest (cost of borrowing), Taxes (property taxes), and Insurance (homeowners insurance and possibly PMI).',
        tips: [
          'A larger down payment reduces your loan amount and may eliminate PMI',
          'Even small changes in interest rates significantly impact total cost',
          'Consider property taxes and insurance when budgeting for homeownership',
          'PMI is typically required when down payment is less than 20%'
        ]
      },
      {
        title: 'Mortgage Shopping Tips',
        content: 'Shop around with multiple lenders to find the best rates and terms. Consider the total cost of the loan, not just the monthly payment.',
        tips: [
          'Get pre-approved to understand your buying power',
          'Compare Annual Percentage Rate (APR), not just interest rate',
          'Consider 15-year vs 30-year mortgages for different scenarios',
          'Factor in closing costs when calculating total home purchase cost'
        ]
      }
    ]
  };

  const [inputs, setInputs] = useState<MortgageInputs>({
    loanAmount: 400000,
    interestRate: 6.5,
    loanTermYears: 30,
    downPayment: 80000,
    propertyTax: 8000,
    homeInsurance: 1200,
    pmi: 200
  });

  const updateInput = (field: keyof MortgageInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({
      loanAmount: 400000,
      interestRate: 6.5,
      loanTermYears: 30,
      downPayment: 80000,
      propertyTax: 8000,
      homeInsurance: 1200,
      pmi: 200
    });
  };

  // Calculate mortgage details
  const calculations = useMemo(() => {
    const principal = inputs.loanAmount;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTermYears * 12;
    
    // Monthly principal and interest payment
    const monthlyPI = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Monthly property tax and insurance
    const monthlyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyPMI = inputs.pmi;
    
    // Total monthly payment (PITI + PMI)
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
    
    // Total cost calculations
    const totalInterest = (monthlyPI * numPayments) - principal;
    const totalPaid = totalMonthly * numPayments;
    
    // Home value and loan-to-value ratio
    const homeValue = inputs.loanAmount + inputs.downPayment;
    const loanToValue = (inputs.loanAmount / homeValue) * 100;
    
    return {
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      totalMonthly,
      totalInterest,
      totalPaid,
      homeValue,
      loanToValue,
      principal: inputs.loanAmount
    };
  }, [inputs]);

  // Generate results
  const results = useMemo(() => {
    if (!inputs.loanAmount) return undefined;

    return {
      primary: {
        label: 'Total Monthly Payment (PITI + PMI)',
        value: calculations.totalMonthly,
        format: 'currency' as const,
        variant: 'primary' as const,
        description: 'Principal, Interest, Taxes, Insurance, and PMI'
      },
      secondary: [
        {
          label: 'Principal & Interest',
          value: calculations.monthlyPI,
          format: 'currency' as const,
          description: 'Main loan payment'
        },
        {
          label: 'Property Tax (Monthly)',
          value: calculations.monthlyTax,
          format: 'currency' as const,
          description: 'Estimated monthly property tax'
        },
        {
          label: 'Home Insurance (Monthly)',
          value: calculations.monthlyInsurance,
          format: 'currency' as const,
          description: 'Monthly insurance premium'
        },
        {
          label: 'PMI (Monthly)',
          value: calculations.monthlyPMI,
          format: 'currency' as const,
          description: 'Private Mortgage Insurance'
        },
        {
          label: 'Total Interest Paid',
          value: calculations.totalInterest,
          format: 'currency' as const,
          variant: 'warning' as const,
          description: 'Total interest over life of loan'
        },
        {
          label: 'Loan-to-Value Ratio',
          value: calculations.loanToValue,
          format: 'percentage' as const,
          variant: calculations.loanToValue > 80 ? 'warning' as const : 'success' as const,
          description: 'Loan amount as % of home value'
        }
      ]
    };
  }, [calculations]);

  // Generate insights
  const insights = useMemo((): CalculatorInsight[] => {
    const insights: CalculatorInsight[] = [];

    if (calculations.loanToValue > 80) {
      insights.push({
        type: 'warning',
        title: 'PMI Required',
        message: `Your loan-to-value ratio is ${calculations.loanToValue.toFixed(1)}%. You'll likely need PMI since your down payment is less than 20%.`
      });
    }

    if (calculations.loanToValue <= 80) {
      insights.push({
        type: 'success',
        title: 'No PMI Required',
        message: `Great! Your ${calculations.loanToValue.toFixed(1)}% loan-to-value ratio means you likely won't need PMI, saving you money monthly.`
      });
    }

    if (calculations.totalInterest > calculations.principal) {
      insights.push({
        type: 'info',
        title: 'Interest vs Principal',
        message: `You'll pay $${calculations.totalInterest.toLocaleString()} in interest over the life of the loan - more than the principal amount. Consider a shorter term to save on interest.`
      });
    }

    const debtToIncomeEstimate = (calculations.totalMonthly / 6000) * 100; // Assuming $6k monthly income
    if (debtToIncomeEstimate > 28) {
      insights.push({
        type: 'warning',
        title: 'Consider Your Budget',
        message: `Make sure this payment fits your budget. Housing costs should typically be no more than 28% of gross monthly income.`
      });
    }

    return insights;
  }, [calculations, inputs.loanAmount]);

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={results}
      insights={insights}
      onReset={handleReset}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput
            id="home-value"
            label="Home Purchase Price"
            value={(inputs.loanAmount + inputs.downPayment).toString()}
            onChange={(value) => {
              const homeValue = parseFloat(value) || 0;
              const newLoanAmount = homeValue - inputs.downPayment;
              updateInput('loanAmount', Math.max(0, newLoanAmount));
            }}
            helpText="Total price of the home you're purchasing"
          />

          <CurrencyInput
            id="down-payment"
            label="Down Payment"
            value={inputs.downPayment.toString()}
            onChange={(value) => {
              const downPayment = parseFloat(value) || 0;
              updateInput('downPayment', downPayment);
              const homeValue = inputs.loanAmount + inputs.downPayment;
              const newLoanAmount = homeValue - downPayment;
              updateInput('loanAmount', Math.max(0, newLoanAmount));
            }}
            helpText="Amount you'll pay upfront"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PercentageInput
            id="interest-rate"
            label="Annual Interest Rate"
            value={inputs.interestRate.toString()}
            onChange={(value) => updateInput('interestRate', parseFloat(value) || 0)}
            helpText="Current mortgage interest rate"
          />

          <NumberInput
            id="loan-term"
            label="Loan Term (Years)"
            value={inputs.loanTermYears.toString()}
            onChange={(value) => updateInput('loanTermYears', parseInt(value) || 30)}
            helpText="Length of mortgage in years"
          />
        </div>

        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Additional Monthly Costs</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput
              id="property-tax"
              label="Annual Property Tax"
              value={inputs.propertyTax.toString()}
              onChange={(value) => updateInput('propertyTax', parseFloat(value) || 0)}
              helpText="Yearly property tax amount"
            />

            <CurrencyInput
              id="home-insurance"
              label="Annual Home Insurance"
              value={inputs.homeInsurance.toString()}
              onChange={(value) => updateInput('homeInsurance', parseFloat(value) || 0)}
              helpText="Yearly homeowners insurance premium"
            />

            <CurrencyInput
              id="pmi"
              label="Monthly PMI"
              value={inputs.pmi.toString()}
              onChange={(value) => updateInput('pmi', parseFloat(value) || 0)}
              helpText="Private Mortgage Insurance (if applicable)"
            />
          </div>
        </div>
      </div>
    </CalculatorWrapper>
  );
}

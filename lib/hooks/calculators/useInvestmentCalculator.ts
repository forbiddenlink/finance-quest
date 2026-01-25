'use client';

import { useCalculatorBase, commonValidations } from '../useCalculatorBase';
import {
  calculateFutureValue,
  calculateIRR,
  formatCurrency,
  formatPercentage,
  financialRatios
} from '@/lib/utils/financialCalculations';
import { Decimal } from 'decimal.js';

interface InvestmentCalculatorValues {
  initialInvestment: number;
  monthlyContribution: number;
  expectedReturn: number;
  years: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  inflationRate: number;
  fees: number;
  taxRate: number;
  reinvestDividends: boolean;
  dividendYield: number;
}

interface InvestmentCalculatorResult {
  futureValue: number;
  totalContributions: number;
  totalReturns: number;
  inflationAdjustedValue: number;
  effectiveAnnualReturn: number;
  totalFees: number;
  afterTaxValue: number;
  dividendIncome: number;
  riskScore: number;
  projectedReturns: Array<{
    year: number;
    contributions: number;
    returns: number;
    dividends: number;
    fees: number;
    taxes: number;
    balance: number;
    realBalance: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function useInvestmentCalculator() {
  return useCalculatorBase<InvestmentCalculatorValues, InvestmentCalculatorResult>({
    id: 'investment-calculator',
    initialValues: {
      initialInvestment: 10000,
      monthlyContribution: 500,
      expectedReturn: 7,
      years: 10,
      riskTolerance: 'moderate',
      inflationRate: 2.5,
      fees: 0.5,
      taxRate: 25,
      reinvestDividends: true,
      dividendYield: 2
    },
    validation: {
      initialInvestment: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      monthlyContribution: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      expectedReturn: [
        commonValidations.required(),
        commonValidations.percentage(),
        {
          validate: (value, allValues) => {
            const maxReturn = allValues?.riskTolerance === 'conservative'
              ? financialRatios.conservativeReturn
              : allValues?.riskTolerance === 'moderate'
                ? financialRatios.moderateReturn
                : financialRatios.aggressiveReturn;
            return value <= maxReturn;
          },
          message: 'Return expectation too high for selected risk tolerance'
        }
      ],
      years: [
        commonValidations.required(),
        commonValidations.min(1),
        commonValidations.max(50)
      ],
      inflationRate: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(10)
      ],
      fees: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(financialRatios.maxExpenseRatio)
      ],
      taxRate: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(50)
      ],
      dividendYield: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(10)
      ]
    },
    compute: (values): InvestmentCalculatorResult => {
      // Calculate risk score (0-100)
      const riskScore = values.riskTolerance === 'conservative' ? 25
        : values.riskTolerance === 'moderate' ? 50
        : 75;

      // Calculate real (inflation-adjusted) return
      const realReturn = new Decimal(values.expectedReturn)
        .minus(values.inflationRate)
        .minus(values.fees)
        .toNumber();

      // Project returns year by year
      const projectedReturns = [];
      let balance = new Decimal(values.initialInvestment);
      let totalContributions = new Decimal(values.initialInvestment);
      let totalReturns = new Decimal(0);
      let totalFees = new Decimal(0);
      let totalDividends = new Decimal(0);
      let totalTaxes = new Decimal(0);

      for (let year = 1; year <= values.years; year++) {
        const yearlyContribution = new Decimal(values.monthlyContribution).times(12);
        totalContributions = totalContributions.plus(yearlyContribution);

        // Calculate investment returns
        const investmentReturn = balance.plus(yearlyContribution.div(2))
          .times(values.expectedReturn / 100);
        totalReturns = totalReturns.plus(investmentReturn);

        // Calculate dividends
        const dividends = balance.times(values.dividendYield / 100);
        totalDividends = totalDividends.plus(dividends);

        // Calculate fees
        const yearlyFees = balance.times(values.fees / 100);
        totalFees = totalFees.plus(yearlyFees);

        // Calculate taxes
        const taxableDividends = values.reinvestDividends ? new Decimal(0) : dividends;
        const yearlyTaxes = taxableDividends.times(values.taxRate / 100);
        totalTaxes = totalTaxes.plus(yearlyTaxes);

        // Update balance
        balance = balance
          .plus(yearlyContribution)
          .plus(investmentReturn)
          .plus(values.reinvestDividends ? dividends : new Decimal(0))
          .minus(yearlyFees)
          .minus(yearlyTaxes);

        // Calculate real (inflation-adjusted) balance
        const realBalance = balance.div(
          Decimal.pow(1 + values.inflationRate / 100, year)
        );

        projectedReturns.push({
          year,
          contributions: yearlyContribution.toNumber(),
          returns: investmentReturn.toNumber(),
          dividends: dividends.toNumber(),
          fees: yearlyFees.toNumber(),
          taxes: yearlyTaxes.toNumber(),
          balance: balance.toNumber(),
          realBalance: realBalance.toNumber()
        });
      }

      // Calculate effective annual return using IRR
      const cashflows = [-values.initialInvestment];
      for (let i = 0; i < values.years * 12; i++) {
        cashflows.push(-values.monthlyContribution);
      }
      cashflows.push(balance.toNumber());
      const effectiveAnnualReturn = calculateIRR(cashflows);

      // Generate insights
      const insights = [];

      if (values.fees > 1) {
        insights.push({
          type: 'warning',
          message: 'High fees may significantly impact returns. Consider lower-cost options.'
        });
      }

      if (!values.reinvestDividends) {
        insights.push({
          type: 'info',
          message: 'Reinvesting dividends could significantly increase long-term returns.'
        });
      }

      if (values.riskTolerance === 'conservative' && values.years > 15) {
        insights.push({
          type: 'info',
          message: 'Consider a more aggressive allocation for this long time horizon.'
        });
      }

      if (realReturn <= 0) {
        insights.push({
          type: 'warning',
          message: 'Returns may not keep pace with inflation after fees.'
        });
      }

      const monthlyIncome = values.monthlyContribution;
      const savingsRate = (monthlyIncome * 12) / totalContributions.toNumber() * 100;
      if (savingsRate < financialRatios.minSavingsRate) {
        insights.push({
          type: 'info',
          message: `Consider increasing savings to at least ${financialRatios.minSavingsRate}% of income.`
        });
      }

      return {
        futureValue: balance.toNumber(),
        totalContributions: totalContributions.toNumber(),
        totalReturns: totalReturns.toNumber(),
        inflationAdjustedValue: projectedReturns[projectedReturns.length - 1].realBalance,
        effectiveAnnualReturn,
        totalFees: totalFees.toNumber(),
        afterTaxValue: balance.minus(totalTaxes).toNumber(),
        dividendIncome: totalDividends.div(values.years).toNumber(),
        riskScore,
        projectedReturns,
        insights
      };
    },
    formatters: {
      initialInvestment: formatCurrency,
      monthlyContribution: formatCurrency,
      expectedReturn: (value) => formatPercentage(value, 1),
      inflationRate: (value) => formatPercentage(value, 1),
      fees: (value) => formatPercentage(value, 2),
      taxRate: (value) => formatPercentage(value, 0),
      dividendYield: (value) => formatPercentage(value, 1)
    }
  });
}

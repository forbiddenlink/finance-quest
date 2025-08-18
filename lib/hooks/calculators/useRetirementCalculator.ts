import { useCalculatorBase, commonValidations } from '../useCalculatorBase';
import {
  calculateFutureValue,
  calculateRequiredMonthlySavings,
  formatCurrency,
  formatPercentage,
  financialRatios
} from '@/lib/utils/financialCalculations';
import { Decimal } from 'decimal.js';

interface RetirementCalculatorValues {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredIncome: number;
  socialSecurityIncome: number;
  otherIncome: number;
}

interface RetirementCalculatorResult {
  totalSavingsNeeded: number;
  monthlyIncomeNeeded: number;
  projectedSavings: number;
  savingsGap: number;
  requiredMonthlyContribution: number;
  yearsToRetirement: number;
  retirementDuration: number;
  inflationAdjustedIncome: number;
  savingsRate: number;
  replacementRate: number;
  projectedPortfolio: Array<{
    age: number;
    savings: number;
    contributions: number;
    returns: number;
    total: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}

export function useRetirementCalculator() {
  return useCalculatorBase<RetirementCalculatorValues, RetirementCalculatorResult>({
    id: 'retirement-calculator',
    initialValues: {
      currentAge: 30,
      retirementAge: 65,
      lifeExpectancy: 90,
      currentSavings: 50000,
      monthlyContribution: 1000,
      expectedReturn: 7,
      inflationRate: 2.5,
      desiredIncome: 80000,
      socialSecurityIncome: 24000,
      otherIncome: 0
    },
    validation: {
      currentAge: [
        commonValidations.required(),
        commonValidations.min(18, 'Current age must be at least 18'),
        commonValidations.max(100, 'Current age cannot exceed 100')
      ],
      retirementAge: [
        commonValidations.required(),
        commonValidations.min(40, 'Retirement age must be at least 40'),
        commonValidations.max(100, 'Retirement age cannot exceed 100'),
        {
          validate: (value, allValues) => value > (allValues?.currentAge || 0),
          message: 'Retirement age must be greater than current age'
        }
      ],
      lifeExpectancy: [
        commonValidations.required(),
        commonValidations.min(50, 'Life expectancy must be at least 50'),
        commonValidations.max(120, 'Life expectancy cannot exceed 120'),
        {
          validate: (value, allValues) => value > (allValues?.retirementAge || 0),
          message: 'Life expectancy must be greater than retirement age'
        }
      ],
      currentSavings: [
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
        commonValidations.min(1, 'Expected return must be at least 1%'),
        commonValidations.max(15, 'Expected return cannot exceed 15%')
      ],
      inflationRate: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(10, 'Inflation rate cannot exceed 10%')
      ],
      desiredIncome: [
        commonValidations.required(),
        commonValidations.min(12000, 'Desired annual income must be at least $12,000')
      ],
      socialSecurityIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      otherIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ]
    },
    dependencies: {
      retirementAge: ['currentAge'],
      lifeExpectancy: ['retirementAge']
    },
    compute: (values): RetirementCalculatorResult => {
      // Calculate key metrics
      const yearsToRetirement = values.retirementAge - values.currentAge;
      const retirementDuration = values.lifeExpectancy - values.retirementAge;

      // Calculate inflation-adjusted income needed
      const inflationAdjustedIncome = calculateFutureValue(
        values.desiredIncome,
        values.inflationRate,
        yearsToRetirement,
        0,
        1 // Annual compounding for inflation
      );

      // Calculate monthly income needed in retirement
      const monthlyIncomeNeeded = inflationAdjustedIncome / 12;
      const monthlyPassiveIncome = (values.socialSecurityIncome + values.otherIncome) / 12;
      const monthlyIncomeFromSavings = monthlyIncomeNeeded - monthlyPassiveIncome;

      // Calculate total savings needed using the safe withdrawal rate
      const totalSavingsNeeded = monthlyIncomeFromSavings * 12 / (financialRatios.safeWithdrawalRate / 100);

      // Project portfolio growth
      const projectedPortfolio = [];
      let currentTotal = values.currentSavings;
      let totalContributions = 0;
      let totalReturns = 0;

      for (let year = 0; year <= yearsToRetirement; year++) {
        const age = values.currentAge + year;
        const yearlyContribution = values.monthlyContribution * 12;
        
        // Calculate year-end total using compound interest formula
        const newTotal = calculateFutureValue(
          currentTotal,
          values.expectedReturn,
          1,
          values.monthlyContribution
        );

        const yearlyReturn = newTotal - currentTotal - yearlyContribution;
        
        totalContributions += yearlyContribution;
        totalReturns += yearlyReturn;
        currentTotal = newTotal;

        projectedPortfolio.push({
          age,
          savings: values.currentSavings,
          contributions: totalContributions,
          returns: totalReturns,
          total: currentTotal
        });
      }

      const projectedSavings = currentTotal;
      const savingsGap = Math.max(0, totalSavingsNeeded - projectedSavings);

      // Calculate required monthly contribution to meet goal
      const requiredMonthlyContribution = savingsGap > 0
        ? calculateRequiredMonthlySavings(
            totalSavingsNeeded,
            values.expectedReturn,
            yearsToRetirement,
            values.currentSavings
          )
        : 0;

      // Calculate savings and replacement rates
      const annualIncome = values.desiredIncome;
      const savingsRate = (values.monthlyContribution * 12 / annualIncome) * 100;
      const replacementRate = (inflationAdjustedIncome / annualIncome) * 100;

      // Generate insights
      const insights = [];

      if (savingsRate < financialRatios.minSavingsRate) {
        insights.push({
          type: 'warning',
          message: `Consider increasing your savings rate to at least ${financialRatios.minSavingsRate}% of income`
        });
      }

      if (values.expectedReturn > financialRatios.moderateReturn) {
        insights.push({
          type: 'warning',
          message: 'Your expected return may be optimistic. Consider using a more conservative estimate.'
        });
      }

      if (retirementDuration > 30) {
        insights.push({
          type: 'info',
          message: 'Planning for a long retirement. Consider increasing savings to account for longevity.'
        });
      }

      if (savingsGap > 0) {
        insights.push({
          type: 'warning',
          message: `You need to save an additional ${formatCurrency(requiredMonthlyContribution)} monthly to reach your goal`
        });
      } else {
        insights.push({
          type: 'success',
          message: 'You are on track to meet your retirement savings goal'
        });
      }

      if (replacementRate < financialRatios.replacementRatio) {
        insights.push({
          type: 'info',
          message: `Consider increasing your retirement income target to at least ${financialRatios.replacementRatio}% of current income`
        });
      }

      return {
        totalSavingsNeeded,
        monthlyIncomeNeeded,
        projectedSavings,
        savingsGap,
        requiredMonthlyContribution,
        yearsToRetirement,
        retirementDuration,
        inflationAdjustedIncome,
        savingsRate,
        replacementRate,
        projectedPortfolio,
        insights
      };
    },
    formatters: {
      currentSavings: formatCurrency,
      monthlyContribution: formatCurrency,
      desiredIncome: formatCurrency,
      socialSecurityIncome: formatCurrency,
      otherIncome: formatCurrency,
      expectedReturn: (value) => formatPercentage(value, 1),
      inflationRate: (value) => formatPercentage(value, 1)
    }
  });
}
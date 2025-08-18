import { useCalculatorBase, commonValidations } from '../useCalculatorBase';
import {
  formatCurrency,
  formatPercentage,
  financialRatios
} from '@/lib/utils/financialCalculations';
import { Decimal } from 'decimal.js';

interface BudgetCategory {
  name: string;
  amount: number;
  type: 'essential' | 'discretionary' | 'savings';
  frequency: 'monthly' | 'annual';
}

interface BudgetCalculatorValues {
  monthlyIncome: number;
  additionalIncome: number;
  categories: BudgetCategory[];
  savingsGoal: number;
  emergencyFundTarget: number;
  debtPayments: number;
  includeInvestments: boolean;
  includeTaxes: boolean;
  taxRate: number;
}

interface CategorySummary {
  total: number;
  percentage: number;
  monthlyAmount: number;
  annualAmount: number;
}

interface BudgetCalculatorResult {
  totalIncome: {
    monthly: number;
    annual: number;
    afterTax: number;
  };
  expenses: {
    essential: CategorySummary;
    discretionary: CategorySummary;
    savings: CategorySummary;
    total: CategorySummary;
  };
  metrics: {
    savingsRate: number;
    debtToIncome: number;
    essentialExpenseRatio: number;
    discretionaryRatio: number;
    emergencyFundMonths: number;
  };
  cashFlow: {
    monthly: number;
    annual: number;
  };
  projections: Array<{
    month: number;
    savings: number;
    emergencyFund: number;
    discretionarySpending: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
    category?: string;
  }>;
}

export function useBudgetCalculator() {
  return useCalculatorBase<BudgetCalculatorValues, BudgetCalculatorResult>({
    id: 'budget-calculator',
    initialValues: {
      monthlyIncome: 5000,
      additionalIncome: 0,
      categories: [
        { name: 'Housing', amount: 1500, type: 'essential', frequency: 'monthly' },
        { name: 'Utilities', amount: 200, type: 'essential', frequency: 'monthly' },
        { name: 'Groceries', amount: 400, type: 'essential', frequency: 'monthly' },
        { name: 'Transportation', amount: 300, type: 'essential', frequency: 'monthly' },
        { name: 'Insurance', amount: 200, type: 'essential', frequency: 'monthly' },
        { name: 'Entertainment', amount: 200, type: 'discretionary', frequency: 'monthly' },
        { name: 'Dining Out', amount: 300, type: 'discretionary', frequency: 'monthly' },
        { name: 'Shopping', amount: 200, type: 'discretionary', frequency: 'monthly' },
        { name: 'Emergency Fund', amount: 300, type: 'savings', frequency: 'monthly' },
        { name: 'Retirement', amount: 500, type: 'savings', frequency: 'monthly' }
      ],
      savingsGoal: 20000,
      emergencyFundTarget: 15000,
      debtPayments: 500,
      includeInvestments: true,
      includeTaxes: true,
      taxRate: 25
    },
    validation: {
      monthlyIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      additionalIncome: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      savingsGoal: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      emergencyFundTarget: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      debtPayments: [
        commonValidations.required(),
        commonValidations.min(0)
      ],
      taxRate: [
        commonValidations.required(),
        commonValidations.percentage(),
        commonValidations.min(0),
        commonValidations.max(50)
      ]
    },
    compute: (values): BudgetCalculatorResult => {
      // Calculate total income
      const monthlyIncome = new Decimal(values.monthlyIncome)
        .plus(values.additionalIncome);
      const annualIncome = monthlyIncome.times(12);
      
      // Calculate after-tax income
      const afterTaxIncome = values.includeTaxes
        ? monthlyIncome.times(1 - values.taxRate / 100)
        : monthlyIncome;

      // Calculate category totals
      const categorySums = values.categories.reduce((sums, category) => {
        const monthlyAmount = category.frequency === 'annual'
          ? new Decimal(category.amount).dividedBy(12)
          : new Decimal(category.amount);

        sums[category.type].monthly = sums[category.type].monthly.plus(monthlyAmount);
        sums[category.type].annual = sums[category.type].annual.plus(
          category.frequency === 'annual'
            ? category.amount
            : monthlyAmount.times(12)
        );
        return sums;
      }, {
        essential: { monthly: new Decimal(0), annual: new Decimal(0) },
        discretionary: { monthly: new Decimal(0), annual: new Decimal(0) },
        savings: { monthly: new Decimal(0), annual: new Decimal(0) }
      });

      // Calculate total expenses
      const totalMonthlyExpenses = Object.values(categorySums).reduce(
        (sum, { monthly }) => sum.plus(monthly),
        new Decimal(0)
      );
      const totalAnnualExpenses = Object.values(categorySums).reduce(
        (sum, { annual }) => sum.plus(annual),
        new Decimal(0)
      );

      // Calculate category summaries
      const createCategorySummary = (type: keyof typeof categorySums): CategorySummary => ({
        total: categorySums[type].annual.toNumber(),
        percentage: categorySums[type].monthly
          .dividedBy(afterTaxIncome)
          .times(100)
          .toNumber(),
        monthlyAmount: categorySums[type].monthly.toNumber(),
        annualAmount: categorySums[type].annual.toNumber()
      });

      // Calculate financial metrics
      const savingsRate = categorySums.savings.monthly
        .dividedBy(afterTaxIncome)
        .times(100)
        .toNumber();

      const debtToIncome = new Decimal(values.debtPayments)
        .dividedBy(afterTaxIncome)
        .times(100)
        .toNumber();

      const essentialExpenseRatio = categorySums.essential.monthly
        .dividedBy(afterTaxIncome)
        .times(100)
        .toNumber();

      const discretionaryRatio = categorySums.discretionary.monthly
        .dividedBy(afterTaxIncome)
        .times(100)
        .toNumber();

      const monthlyEssentials = categorySums.essential.monthly.toNumber();
      const emergencyFundMonths = new Decimal(values.emergencyFundTarget)
        .dividedBy(monthlyEssentials)
        .toNumber();

      // Calculate cash flow
      const monthlyCashFlow = afterTaxIncome.minus(totalMonthlyExpenses);
      const annualCashFlow = monthlyCashFlow.times(12);

      // Generate 12-month projections
      const projections = [];
      let currentSavings = new Decimal(0);
      let currentEmergencyFund = new Decimal(0);
      let monthlyDiscretionary = categorySums.discretionary.monthly;

      for (let month = 1; month <= 12; month++) {
        // Update savings
        currentSavings = currentSavings.plus(categorySums.savings.monthly);
        
        // Update emergency fund (prioritize this over discretionary)
        if (currentEmergencyFund.lessThan(values.emergencyFundTarget)) {
          const remainingEmergencyFund = new Decimal(values.emergencyFundTarget)
            .minus(currentEmergencyFund);
          const emergencyContribution = Decimal.min(
            monthlyCashFlow,
            remainingEmergencyFund
          );
          currentEmergencyFund = currentEmergencyFund.plus(emergencyContribution);
        }

        projections.push({
          month,
          savings: currentSavings.toNumber(),
          emergencyFund: currentEmergencyFund.toNumber(),
          discretionarySpending: monthlyDiscretionary.toNumber()
        });
      }

      // Generate insights
      const insights = [];

      // Savings rate insights
      if (savingsRate < financialRatios.minSavingsRate) {
        insights.push({
          type: 'warning',
          message: `Savings rate (${savingsRate.toFixed(1)}%) is below the recommended ${financialRatios.minSavingsRate}%`,
          category: 'savings'
        });
      }

      // Emergency fund insights
      if (emergencyFundMonths < 3) {
        insights.push({
          type: 'warning',
          message: 'Emergency fund covers less than 3 months of expenses',
          category: 'emergency-fund'
        });
      } else if (emergencyFundMonths < 6) {
        insights.push({
          type: 'info',
          message: 'Consider building emergency fund to 6 months of expenses',
          category: 'emergency-fund'
        });
      }

      // Debt-to-income insights
      if (debtToIncome > financialRatios.maxDTI) {
        insights.push({
          type: 'warning',
          message: `Debt-to-income ratio (${debtToIncome.toFixed(1)}%) exceeds recommended maximum`,
          category: 'debt'
        });
      }

      // Essential expenses insights
      if (essentialExpenseRatio > 50) {
        insights.push({
          type: 'warning',
          message: 'Essential expenses exceed 50% of income',
          category: 'expenses'
        });
      }

      // Cash flow insights
      if (monthlyCashFlow.lessThan(0)) {
        insights.push({
          type: 'warning',
          message: 'Negative monthly cash flow - review expenses',
          category: 'cash-flow'
        });
      } else if (monthlyCashFlow.lessThan(monthlyIncome.times(0.1))) {
        insights.push({
          type: 'info',
          message: 'Limited cash flow buffer - consider reducing discretionary spending',
          category: 'cash-flow'
        });
      }

      // Category-specific insights
      values.categories.forEach(category => {
        const categoryAmount = new Decimal(category.amount);
        if (category.type === 'essential') {
          const categoryPercentage = categoryAmount
            .dividedBy(afterTaxIncome)
            .times(100)
            .toNumber();

          if (category.name === 'Housing' && categoryPercentage > 30) {
            insights.push({
              type: 'warning',
              message: 'Housing costs exceed 30% of income',
              category: 'housing'
            });
          }
        }
      });

      return {
        totalIncome: {
          monthly: monthlyIncome.toNumber(),
          annual: annualIncome.toNumber(),
          afterTax: afterTaxIncome.toNumber()
        },
        expenses: {
          essential: createCategorySummary('essential'),
          discretionary: createCategorySummary('discretionary'),
          savings: createCategorySummary('savings'),
          total: {
            total: totalAnnualExpenses.toNumber(),
            percentage: totalMonthlyExpenses
              .dividedBy(afterTaxIncome)
              .times(100)
              .toNumber(),
            monthlyAmount: totalMonthlyExpenses.toNumber(),
            annualAmount: totalAnnualExpenses.toNumber()
          }
        },
        metrics: {
          savingsRate,
          debtToIncome,
          essentialExpenseRatio,
          discretionaryRatio,
          emergencyFundMonths
        },
        cashFlow: {
          monthly: monthlyCashFlow.toNumber(),
          annual: annualCashFlow.toNumber()
        },
        projections,
        insights
      };
    },
    formatters: {
      monthlyIncome: formatCurrency,
      additionalIncome: formatCurrency,
      savingsGoal: formatCurrency,
      emergencyFundTarget: formatCurrency,
      debtPayments: formatCurrency,
      taxRate: (value) => formatPercentage(value, 1)
    }
  });
}

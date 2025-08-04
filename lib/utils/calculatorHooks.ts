/**
 * Calculator Hooks - Reusable calculation logic
 * Implements DRY principles for common financial calculations
 */

import { useState, useCallback, useMemo } from 'react';
import { validateFields, FieldValidation, ValidationResult, CalculatorValidations } from './calculatorValidation';

export interface UseCalculatorOptions<T> {
  initialValues: T;
  validationSchema?: FieldValidation;
  calculate: (values: T) => any;
  debounceMs?: number;
}

export interface CalculatorState<T> {
  values: T;
  results: any;
  validation: ValidationResult;
  isCalculating: boolean;
  hasCalculated: boolean;
}

/**
 * Generic calculator hook with validation and state management
 */
export function useCalculator<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  calculate,
  debounceMs = 300
}: UseCalculatorOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Validation
  const validation = useMemo(() => {
    if (!validationSchema) {
      return { isValid: true, errors: {} };
    }
    return validateFields(values, validationSchema);
  }, [values, validationSchema]);

  // Calculate results
  const results = useMemo(() => {
    if (!validation.isValid) return null;
    
    try {
      setIsCalculating(true);
      const result = calculate(values);
      setHasCalculated(true);
      return result;
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [values, validation.isValid, calculate]);

  // Update a single field
  const updateField = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update multiple fields
  const updateFields = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Reset to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setHasCalculated(false);
  }, [initialValues]);

  return {
    values,
    results,
    validation,
    isCalculating,
    hasCalculated,
    updateField,
    updateFields,
    reset
  };
}

/**
 * Compound Interest Calculator Hook
 */
export interface CompoundInterestInputs {
  principal: string;
  rate: string;
  time: string;
  monthlyContribution: string;
  compoundingFrequency: string;
}

export function useCompoundInterestCalculator() {
  return useCalculator({
    initialValues: {
      principal: '10000',
      rate: '7',
      time: '30',
      monthlyContribution: '500',
      compoundingFrequency: '12'
    } as CompoundInterestInputs,
    validationSchema: {
      principal: {
        required: true,
        type: 'currency' as const,
        min: 1,
        max: 10000000
      },
      rate: {
        required: true,
        type: 'percentage' as const,
        min: 0,
        max: 50
      },
      time: {
        required: true,
        type: 'integer' as const,
        min: 1,
        max: 50
      },
      monthlyContribution: {
        required: false,
        type: 'currency' as const,
        min: 0,
        max: 100000
      }
    },
    calculate: (values) => {
      const P = parseFloat(values.principal) || 0;
      const r = parseFloat(values.rate) / 100 || 0;
      const t = parseInt(values.time) || 0;
      const monthlyAdd = parseFloat(values.monthlyContribution) || 0;
      const n = parseInt(values.compoundingFrequency) || 12;

      // Future value with regular contributions
      const monthlyRate = r / 12;
      const totalMonths = t * 12;
      
      // Future value of initial principal
      const futureValuePrincipal = P * Math.pow(1 + monthlyRate, totalMonths);
      
      // Future value of monthly contributions (annuity)
      const futureValueContributions = monthlyAdd * 
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      
      const finalAmount = futureValuePrincipal + futureValueContributions;
      const totalContributed = P + (monthlyAdd * totalMonths);
      const totalInterest = finalAmount - totalContributed;

      return {
        finalAmount,
        totalContributed,
        totalInterest,
        effectiveReturn: totalContributed > 0 ? ((finalAmount / totalContributed - 1) * 100) : 0,
        yearsToDouble: r > 0 ? Math.round(72 / (r * 100)) : 0
      };
    }
  });
}

/**
 * Mortgage Calculator Hook
 */
export interface MortgageInputs {
  homeValue: string;
  downPayment: string;
  interestRate: string;
  loanTermYears: string;
  propertyTax: string;
  homeInsurance: string;
  pmi: string;
}

export function useMortgageCalculator() {
  return useCalculator({
    initialValues: {
      homeValue: '500000',
      downPayment: '100000',
      interestRate: '6.5',
      loanTermYears: '30',
      propertyTax: '8000',
      homeInsurance: '1200',
      pmi: '200'
    } as MortgageInputs,
    calculate: (values) => {
      const homeValue = parseFloat(values.homeValue) || 0;
      const downPayment = parseFloat(values.downPayment) || 0;
      const loanAmount = homeValue - downPayment;
      const monthlyRate = (parseFloat(values.interestRate) || 0) / 100 / 12;
      const numPayments = (parseInt(values.loanTermYears) || 30) * 12;
      
      // Monthly principal and interest
      const monthlyPI = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      const monthlyTax = (parseFloat(values.propertyTax) || 0) / 12;
      const monthlyInsurance = (parseFloat(values.homeInsurance) || 0) / 12;
      const monthlyPMI = parseFloat(values.pmi) || 0;
      
      const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
      const totalInterest = (monthlyPI * numPayments) - loanAmount;
      const loanToValue = homeValue > 0 ? (loanAmount / homeValue) * 100 : 0;

      return {
        loanAmount,
        monthlyPI,
        monthlyTax,
        monthlyInsurance,
        monthlyPMI,
        totalMonthly,
        totalInterest,
        loanToValue,
        totalPaid: totalMonthly * numPayments
      };
    }
  });
}

/**
 * Emergency Fund Calculator Hook
 */
export interface EmergencyFundInputs {
  monthlyIncome: string;
  monthlyExpenses: string;
  targetMonths: string;
  currentSavings: string;
  monthlySavings: string;
}

export function useEmergencyFundCalculator() {
  return useCalculator({
    initialValues: {
      monthlyIncome: '6000',
      monthlyExpenses: '4000',
      targetMonths: '6',
      currentSavings: '1000',
      monthlySavings: '500'
    } as EmergencyFundInputs,
    calculate: (values) => {
      const monthlyExpenses = parseFloat(values.monthlyExpenses) || 0;
      const targetMonths = parseFloat(values.targetMonths) || 6;
      const currentSavings = parseFloat(values.currentSavings) || 0;
      const monthlySavings = parseFloat(values.monthlySavings) || 0;
      const monthlyIncome = parseFloat(values.monthlyIncome) || 0;

      const targetAmount = monthlyExpenses * targetMonths;
      const remaining = Math.max(0, targetAmount - currentSavings);
      const timeToGoal = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0;
      const currentProgress = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
      const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

      return {
        targetAmount,
        remaining,
        timeToGoal,
        currentProgress,
        savingsRate,
        monthlyExpenses,
        isComplete: currentProgress >= 100
      };
    }
  });
}

/**
 * Debt Payoff Calculator Hook
 */
export interface DebtPayoffInputs {
  debts: Array<{
    name: string;
    balance: number;
    minimumPayment: number;
    interestRate: number;
  }>;
  extraPayment: string;
  strategy: 'avalanche' | 'snowball';
}

export function useDebtPayoffCalculator() {
  return useCalculator({
    initialValues: {
      debts: [
        { name: 'Credit Card', balance: 5000, minimumPayment: 125, interestRate: 18.99 },
        { name: 'Student Loan', balance: 25000, minimumPayment: 300, interestRate: 5.5 }
      ],
      extraPayment: '200',
      strategy: 'avalanche' as const
    } as DebtPayoffInputs,
    calculate: (values) => {
      const extraPayment = parseFloat(values.extraPayment) || 0;
      let debts = [...values.debts];
      
      // Sort debts based on strategy
      if (values.strategy === 'avalanche') {
        debts.sort((a, b) => b.interestRate - a.interestRate);
      } else {
        debts.sort((a, b) => a.balance - b.balance);
      }

      const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
      const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
      
      // Simplified payoff calculation
      let remainingDebts = debts.map(d => ({ ...d }));
      let month = 0;
      let totalInterest = 0;

      while (remainingDebts.length > 0 && month < 360) {
        month++;
        
        // Apply interest and minimum payments
        remainingDebts.forEach(debt => {
          const monthlyInterest = (debt.balance * debt.interestRate / 100) / 12;
          totalInterest += monthlyInterest;
          debt.balance += monthlyInterest;
          debt.balance -= Math.min(debt.minimumPayment, debt.balance);
        });

        // Apply extra payment to first debt
        if (remainingDebts.length > 0 && extraPayment > 0) {
          const targetDebt = remainingDebts[0];
          const payment = Math.min(extraPayment, targetDebt.balance);
          targetDebt.balance -= payment;
        }

        // Remove paid off debts
        remainingDebts = remainingDebts.filter(debt => debt.balance > 0.01);
      }

      return {
        totalBalance,
        totalMinimumPayment,
        totalMonthlyPayment: totalMinimumPayment + extraPayment,
        payoffMonths: month,
        totalInterest,
        strategy: values.strategy
      };
    }
  });
}

/**
 * Stock Analysis Calculator Hook
 */
export interface StockAnalysisInputs {
  currentPrice: string;
  targetPrice: string;
  dividendYield: string;
  peRatio: string;
  eps: string;
  growthRate: string;
  timeHorizon: string;
}

export function useStockAnalysisCalculator() {
  return useCalculator({
    initialValues: {
      currentPrice: '100',
      targetPrice: '120',
      dividendYield: '2.5',
      peRatio: '15',
      eps: '6.67',
      growthRate: '8',
      timeHorizon: '1'
    } as StockAnalysisInputs,
    calculate: (values) => {
      const currentPrice = parseFloat(values.currentPrice) || 0;
      const targetPrice = parseFloat(values.targetPrice) || 0;
      const dividendYield = parseFloat(values.dividendYield) || 0;
      const peRatio = parseFloat(values.peRatio) || 0;
      const eps = parseFloat(values.eps) || 0;
      const growthRate = parseFloat(values.growthRate) || 0;
      const timeHorizon = parseFloat(values.timeHorizon) || 1;

      const priceAppreciation = currentPrice > 0 ? ((targetPrice - currentPrice) / currentPrice) * 100 : 0;
      const annualDividendReturn = dividendYield;
      const totalReturn = priceAppreciation + (annualDividendReturn * timeHorizon);
      const annualizedReturn = timeHorizon > 0 ? totalReturn / timeHorizon : 0;
      
      // Fair value based on P/E and growth
      const fairValue = eps * (peRatio + growthRate);
      const valueGap = currentPrice > 0 ? ((fairValue - currentPrice) / currentPrice) * 100 : 0;

      return {
        priceAppreciation,
        dividendReturn: annualDividendReturn,
        totalReturn,
        annualizedReturn,
        fairValue,
        valueGap,
        recommendation: valueGap > 10 ? 'BUY' : valueGap < -10 ? 'SELL' : 'HOLD'
      };
    }
  });
}

/**
 * Retirement Planning Calculator Hook
 */
export interface RetirementInputs {
  currentAge: string;
  retirementAge: string;
  currentSavings: string;
  monthlyContribution: string;
  expectedReturn: string;
  inflationRate: string;
  desiredIncome: string;
}

export function useRetirementCalculator() {
  return useCalculator({
    initialValues: {
      currentAge: '30',
      retirementAge: '65',
      currentSavings: '50000',
      monthlyContribution: '1000',
      expectedReturn: '7',
      inflationRate: '3',
      desiredIncome: '80000'
    } as RetirementInputs,
    calculate: (values) => {
      const currentAge = parseInt(values.currentAge) || 30;
      const retirementAge = parseInt(values.retirementAge) || 65;
      const currentSavings = parseFloat(values.currentSavings) || 0;
      const monthlyContribution = parseFloat(values.monthlyContribution) || 0;
      const expectedReturn = parseFloat(values.expectedReturn) / 100 || 0.07;
      const inflationRate = parseFloat(values.inflationRate) / 100 || 0.03;
      const desiredIncome = parseFloat(values.desiredIncome) || 0;

      const yearsToRetirement = retirementAge - currentAge;
      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyReturn = expectedReturn / 12;

      // Future value of current savings
      const futureValueCurrent = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
      
      // Future value of monthly contributions
      const futureValueContributions = monthlyContribution * 
        ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

      const totalRetirementSavings = futureValueCurrent + futureValueContributions;
      
      // Adjusted for inflation
      const inflationAdjustedDesiredIncome = desiredIncome * Math.pow(1 + inflationRate, yearsToRetirement);
      const requiredSavings = inflationAdjustedDesiredIncome * 25; // 4% rule
      
      const shortfall = Math.max(0, requiredSavings - totalRetirementSavings);
      const surplus = Math.max(0, totalRetirementSavings - requiredSavings);

      return {
        totalRetirementSavings,
        requiredSavings,
        shortfall,
        surplus,
        inflationAdjustedIncome: inflationAdjustedDesiredIncome,
        isOnTrack: totalRetirementSavings >= requiredSavings,
        yearsToRetirement,
        totalContributions: currentSavings + (monthlyContribution * monthsToRetirement)
      };
    }
  });
}

// Budget Builder Calculator Hook
export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
  color: string;
  type: 'need' | 'want' | 'savings';
  icon: any; // LucideIcon type
}

export interface BudgetSummary {
  totalIncome: number;
  totalBudgeted: number;
  totalActual: number;
  needs: number;
  wants: number;
  savings: number;
  remaining: number;
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
}

export interface UseBudgetBuilderParams {
  monthlyIncome: number;
  categories: BudgetCategory[];
}

export interface UseBudgetBuilderResult {
  summary: BudgetSummary;
  pieData: Array<{ name: string; value: number; color: string }>;
  comparisonData: Array<{ category: string; budgeted: number; actual: number }>;
  insights: Array<{ type: 'success' | 'warning' | 'error' | 'info'; title: string; message: string }>;
  isValid: boolean;
  errors: Record<string, string>;
}

export const useBudgetBuilderCalculator = ({
  monthlyIncome,
  categories
}: UseBudgetBuilderParams): UseBudgetBuilderResult => {
  return useMemo(() => {
    // Validation
    const validationResult = validateFields({
      monthlyIncome
    }, {
      monthlyIncome: { required: true, type: 'currency', min: 500, max: 1000000 }
    });

    const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
    const needs = categories.filter(cat => cat.type === 'need').reduce((sum, cat) => sum + cat.actual, 0);
    const wants = categories.filter(cat => cat.type === 'want').reduce((sum, cat) => sum + cat.actual, 0);
    const savings = categories.filter(cat => cat.type === 'savings').reduce((sum, cat) => sum + cat.actual, 0);
    const remaining = monthlyIncome - totalActual;

    const needsPercentage = monthlyIncome > 0 ? Math.round((needs / monthlyIncome) * 100) : 0;
    const wantsPercentage = monthlyIncome > 0 ? Math.round((wants / monthlyIncome) * 100) : 0;
    const savingsPercentage = monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0;

    const summary: BudgetSummary = {
      totalIncome: monthlyIncome,
      totalBudgeted,
      totalActual,
      needs,
      wants,
      savings,
      remaining,
      needsPercentage,
      wantsPercentage,
      savingsPercentage
    };

    // Chart data
    const pieData = [
      { name: 'Needs', value: needs, color: '#ef4444' },
      { name: 'Wants', value: wants, color: '#8b5cf6' },
      { name: 'Savings', value: savings, color: '#10b981' },
      { name: 'Remaining', value: Math.max(remaining, 0), color: '#6b7280' }
    ];

    const comparisonData = [
      { 
        category: 'Needs', 
        budgeted: categories.filter(c => c.type === 'need').reduce((s, c) => s + c.budgeted, 0), 
        actual: needs 
      },
      { 
        category: 'Wants', 
        budgeted: categories.filter(c => c.type === 'want').reduce((s, c) => s + c.budgeted, 0), 
        actual: wants 
      },
      { 
        category: 'Savings', 
        budgeted: categories.filter(c => c.type === 'savings').reduce((s, c) => s + c.budgeted, 0), 
        actual: savings 
      }
    ];

    // Generate insights
    const insights = [];

    if (remaining < 0) {
      insights.push({
        type: 'error' as const,
        title: 'Over Budget',
        message: `You're spending $${Math.abs(remaining).toLocaleString()} more than your income. Consider reducing expenses or finding additional income sources.`
      });
    }

    if (savingsPercentage < 20) {
      insights.push({
        type: 'warning' as const,
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsPercentage}%, below the recommended 20%. Try to reduce wants or optimize needs to increase savings.`
      });
    }

    if (needsPercentage > 50) {
      insights.push({
        type: 'warning' as const,
        title: 'High Essential Expenses',
        message: `Your needs account for ${needsPercentage}% of income (target: 50%). Look for ways to reduce housing, transportation, or other essential costs.`
      });
    }

    if (wantsPercentage > 30) {
      insights.push({
        type: 'info' as const,
        title: 'Lifestyle Spending Alert',
        message: `Your wants consume ${wantsPercentage}% of income (target: 30%). Consider which discretionary expenses provide the most value.`
      });
    }

    if (needsPercentage <= 50 && wantsPercentage <= 30 && savingsPercentage >= 20) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent Budget Balance!',
        message: 'Your budget follows the 50/30/20 rule perfectly. You have a sustainable financial plan that balances current needs with future security.'
      });
    }

    return {
      summary,
      pieData,
      comparisonData,
      insights,
      isValid: validationResult.isValid,
      errors: validationResult.errors
    };
  }, [monthlyIncome, categories]);
};

// Business Valuation Calculator Hook
export interface BusinessValuationInputs {
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

export interface BusinessValuationResults {
  dcfValuation: number;
  multipleValuation: number;
  assetValuation: number;
  averageValuation: number;
  terminalValue: number;
  enterpriseValue: number;
  projectedCashFlows: number[];
}

export const useBusinessValuationCalculator = () => {
  return useCalculator<BusinessValuationInputs>({
    initialValues: {
      annualRevenue: '1000000',
      growthRate: '15',
      netMargin: '20',
      discountRate: '12',
      terminalGrowthRate: '3',
      projectionYears: '5',
      ebitda: '200000',
      ebitdaMultiple: '8',
      totalAssets: '500000',
      totalLiabilities: '200000'
    },
    validationSchema: {
      annualRevenue: CalculatorValidations.businessValuation.annualRevenue,
      growthRate: CalculatorValidations.businessValuation.growthRate,
      netMargin: CalculatorValidations.businessValuation.netMargin,
      discountRate: CalculatorValidations.businessValuation.discountRate,
      terminalGrowthRate: CalculatorValidations.businessValuation.terminalGrowthRate,
      projectionYears: CalculatorValidations.businessValuation.projectionYears,
      ebitda: CalculatorValidations.businessValuation.ebitda,
      ebitdaMultiple: CalculatorValidations.businessValuation.ebitdaMultiple,
      totalAssets: CalculatorValidations.businessValuation.totalAssets,
      totalLiabilities: CalculatorValidations.businessValuation.totalLiabilities
    },
    calculate: (values: BusinessValuationInputs): BusinessValuationResults => {
      const annualRevenue = parseFloat(values.annualRevenue) || 0;
      const growthRate = parseFloat(values.growthRate) / 100 || 0;
      const netMargin = parseFloat(values.netMargin) / 100 || 0;
      const discountRate = parseFloat(values.discountRate) / 100 || 0;
      const terminalGrowthRate = parseFloat(values.terminalGrowthRate) / 100 || 0;
      const projectionYears = parseInt(values.projectionYears) || 5;
      const ebitda = parseFloat(values.ebitda) || 0;
      const ebitdaMultiple = parseFloat(values.ebitdaMultiple) || 0;
      const totalAssets = parseFloat(values.totalAssets) || 0;
      const totalLiabilities = parseFloat(values.totalLiabilities) || 0;

      // DCF Calculation
      const projectedCashFlows: number[] = [];
      let currentRevenue = annualRevenue;
      let totalPresentValue = 0;

      for (let year = 1; year <= projectionYears; year++) {
        currentRevenue *= (1 + growthRate);
        const netIncome = currentRevenue * netMargin;
        const freeCashFlow = netIncome * 0.85; // Typical FCF conversion
        const presentValue = freeCashFlow / Math.pow(1 + discountRate, year);
        
        projectedCashFlows.push(freeCashFlow);
        totalPresentValue += presentValue;
      }

      // Terminal value calculation
      const finalYearCashFlow = projectedCashFlows[projectedCashFlows.length - 1];
      const terminalCashFlow = finalYearCashFlow * (1 + terminalGrowthRate);
      const terminalValue = terminalCashFlow / (discountRate - terminalGrowthRate);
      const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);

      const dcfValuation = totalPresentValue + presentTerminalValue;

      // Multiple-based valuation
      const multipleValuation = ebitda * ebitdaMultiple;

      // Asset-based valuation
      const netAssets = totalAssets - totalLiabilities;
      const assetValuation = Math.max(netAssets, 0);

      // Average valuation (weighted)
      const averageValuation = (dcfValuation * 0.4) + (multipleValuation * 0.4) + (assetValuation * 0.2);

      return {
        dcfValuation,
        multipleValuation,
        assetValuation,
        averageValuation,
        terminalValue,
        enterpriseValue: dcfValuation,
        projectedCashFlows
      };
    }
  });
};

// Bond Calculator Hook
export interface BondInputs {
  faceValue: string;
  currentPrice: string;
  couponRate: string;
  yearsToMaturity: string;
  paymentFrequency: string;
}

export interface BondResults {
  currentYield: number;
  yieldToMaturity: number;
  totalReturn: number;
  annualIncome: number;
  interestRateSensitivity: number;
}

export const useBondCalculator = () => {
  return useCalculator<BondInputs>({
    initialValues: {
      faceValue: '1000',
      currentPrice: '950',
      couponRate: '5.0',
      yearsToMaturity: '10',
      paymentFrequency: '2'
    },
    validationSchema: {
      faceValue: CalculatorValidations.bond.faceValue,
      currentPrice: CalculatorValidations.bond.currentPrice,
      couponRate: CalculatorValidations.bond.couponRate,
      yearsToMaturity: CalculatorValidations.bond.yearsToMaturity,
      paymentFrequency: CalculatorValidations.bond.paymentFrequency
    },
    calculate: (values: BondInputs): BondResults => {
      const faceValue = parseFloat(values.faceValue) || 1000;
      const currentPrice = parseFloat(values.currentPrice) || 950;
      const couponRate = parseFloat(values.couponRate) / 100 || 0.05;
      const yearsToMaturity = parseFloat(values.yearsToMaturity) || 10;
      const frequency = parseInt(values.paymentFrequency) || 2;

      // Annual coupon payment
      const annualIncome = couponRate * faceValue;

      // Current Yield = Annual Coupon / Current Price
      const currentYield = (annualIncome / currentPrice) * 100;

      // Approximate Yield to Maturity using simplified formula
      const yieldToMaturity = ((annualIncome + (faceValue - currentPrice) / yearsToMaturity) / ((faceValue + currentPrice) / 2)) * 100;

      // Total return if held to maturity
      const totalCoupons = annualIncome * yearsToMaturity;
      const capitalGain = faceValue - currentPrice;
      const totalReturn = totalCoupons + capitalGain;

      // Interest rate sensitivity (modified duration approximation)
      const modifiedDuration = yearsToMaturity / (1 + yieldToMaturity / 100 / frequency);

      return {
        currentYield,
        yieldToMaturity,
        totalReturn,
        annualIncome,
        interestRateSensitivity: modifiedDuration
      };
    }
  });
};

/**
 * Credit Score Simulator Hook
 */
export interface CreditProfile {
  paymentHistory: number;
  creditUtilization: number;
  creditAge: number;
  creditMix: number;
  newCredit: number;
}

export interface CreditScoreResult {
  currentScore: number;
  projectedScore: number;
  increase: number;
  factorAnalysis: CreditFactorAnalysis[];
  timelineProjections: ScoreProjection[];
  scoreGrade: string;
  projectedGrade: string;
}

export interface CreditFactorAnalysis {
  name: string;
  current: number;
  target: number;
  weight: number;
  impact: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ScoreProjection {
  month: number;
  score: number;
  description: string;
}

export interface UseCreditScoreCalculatorResult {
  values: {
    current: CreditProfile;
    target: CreditProfile;
  };
  errors: Record<string, string>;
  result: CreditScoreResult | null;
  isValid: boolean;
  updateCurrentProfile: (field: keyof CreditProfile, value: string) => void;
  updateTargetProfile: (field: keyof CreditProfile, value: string) => void;
  reset: () => void;
}

export function useCreditScoreCalculator(): UseCreditScoreCalculatorResult {
  const [currentProfile, setCurrentProfile] = useState({
    paymentHistory: 95,
    creditUtilization: 30,
    creditAge: 3,
    creditMix: 3,
    newCredit: 2
  });

  const [targetProfile, setTargetProfile] = useState({
    paymentHistory: 100,
    creditUtilization: 10,
    creditAge: 5,
    creditMix: 4,
    newCredit: 0
  });

  // Validation
  const currentValidation = validateFields(currentProfile, CalculatorValidations.creditScore);
  const targetValidation = validateFields(targetProfile, CalculatorValidations.creditScore);
  
  const errors = {
    ...Object.fromEntries(
      Object.entries(currentValidation.errors).map(([key, error]) => [`current_${key}`, error])
    ),
    ...Object.fromEntries(
      Object.entries(targetValidation.errors).map(([key, error]) => [`target_${key}`, error])
    )
  };

  const isValid = currentValidation.isValid && targetValidation.isValid;

  // Credit score calculation algorithm
  const calculateCreditScore = useCallback((profile: CreditProfile): number => {
    const { paymentHistory, creditUtilization, creditAge, creditMix, newCredit } = profile;
    
    // FICO-like scoring algorithm
    const paymentScore = Math.min(100, paymentHistory) * 0.35;
    const utilizationScore = Math.max(0, 100 - creditUtilization * 2) * 0.30;
    const ageScore = Math.min(100, creditAge * 15) * 0.15;
    const mixScore = Math.min(100, creditMix * 20) * 0.10;
    const inquiryScore = Math.max(0, 100 - newCredit * 15) * 0.10;

    const totalScore = paymentScore + utilizationScore + ageScore + mixScore + inquiryScore;
    const scaledScore = 300 + (totalScore / 100) * 550;

    return Math.round(Math.min(850, Math.max(300, scaledScore)));
  }, []);

  const getScoreGrade = useCallback((score: number): string => {
    if (score >= 800) return 'Exceptional';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  }, []);

  // Calculate results
  const result = useMemo((): CreditScoreResult | null => {
    if (!isValid) return null;

    const currentScore = calculateCreditScore(currentProfile);
    const projectedScore = calculateCreditScore(targetProfile);
    const increase = projectedScore - currentScore;

    // Factor analysis
    const factors = [
      {
        name: 'Payment History',
        current: currentProfile.paymentHistory,
        target: targetProfile.paymentHistory,
        weight: 35,
        impact: (targetProfile.paymentHistory - currentProfile.paymentHistory) * 2.45
      },
      {
        name: 'Credit Utilization',
        current: currentProfile.creditUtilization,
        target: targetProfile.creditUtilization,
        weight: 30,
        impact: (currentProfile.creditUtilization - targetProfile.creditUtilization) * 2.1
      },
      {
        name: 'Credit Age',
        current: currentProfile.creditAge,
        target: targetProfile.creditAge,
        weight: 15,
        impact: (targetProfile.creditAge - currentProfile.creditAge) * 10.5
      },
      {
        name: 'Credit Mix',
        current: currentProfile.creditMix,
        target: targetProfile.creditMix,
        weight: 10,
        impact: (targetProfile.creditMix - currentProfile.creditMix) * 14
      },
      {
        name: 'New Credit Inquiries',
        current: currentProfile.newCredit,
        target: targetProfile.newCredit,
        weight: 10,
        impact: (currentProfile.newCredit - targetProfile.newCredit) * 11.67
      }
    ];

    const factorAnalysis: CreditFactorAnalysis[] = factors.map(factor => ({
      ...factor,
      priority: Math.abs(factor.impact) > 15 ? 'high' : Math.abs(factor.impact) > 5 ? 'medium' : 'low'
    }));

    // Timeline projections
    const scoreDiff = increase;
    const timeToTarget = Math.max(1, Math.ceil(Math.abs(scoreDiff) / 10)); // ~10 points per month

    const timelineProjections: ScoreProjection[] = [];
    for (let month = 0; month <= timeToTarget; month++) {
      const progress = month / timeToTarget;
      const monthScore = currentScore + (scoreDiff * progress);

      let description = 'Starting point';
      if (month === Math.round(timeToTarget * 0.25)) description = 'Pay down high balances';
      if (month === Math.round(timeToTarget * 0.5)) description = 'Optimize utilization';
      if (month === Math.round(timeToTarget * 0.75)) description = 'Diversify credit mix';
      if (month === timeToTarget) description = 'Target achieved!';

      timelineProjections.push({
        month,
        score: Math.round(monthScore),
        description
      });
    }

    return {
      currentScore,
      projectedScore,
      increase,
      factorAnalysis,
      timelineProjections,
      scoreGrade: getScoreGrade(currentScore),
      projectedGrade: getScoreGrade(projectedScore)
    };
  }, [currentProfile, targetProfile, isValid, calculateCreditScore, getScoreGrade]);

  // Update functions
  const updateCurrentProfile = useCallback((field: keyof CreditProfile, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCurrentProfile(prev => ({ ...prev, [field]: numValue }));
  }, []);

  const updateTargetProfile = useCallback((field: keyof CreditProfile, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTargetProfile(prev => ({ ...prev, [field]: numValue }));
  }, []);

  const reset = useCallback(() => {
    setCurrentProfile({
      paymentHistory: 95,
      creditUtilization: 30,
      creditAge: 3,
      creditMix: 3,
      newCredit: 2
    });
    setTargetProfile({
      paymentHistory: 100,
      creditUtilization: 10,
      creditAge: 5,
      creditMix: 4,
      newCredit: 0
    });
  }, []);

  return {
    values: {
      current: currentProfile,
      target: targetProfile
    },
    errors,
    result,
    isValid,
    updateCurrentProfile,
    updateTargetProfile,
    reset
  };
}

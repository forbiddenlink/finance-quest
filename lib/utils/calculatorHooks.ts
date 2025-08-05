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

/**
 * Tax Optimizer Calculator Hook
 */
export interface TaxOptimizerInputs {
  income: number;
  filingStatus: string;
  currentDeductions: number;
  retirement401k: number;
  retirementIra: number;
  hsaContribution: number;
  charitableDonations: number;
  mortgageInterest: number;
  stateLocalTaxes: number;
  businessExpenses: number;
  childTaxCredit: number;
  educationCredits: number;
}

export interface TaxStrategy {
  name: string;
  description: string;
  potentialSavings: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  category: string;
}

export interface TaxOptimizerResult {
  currentTaxes: number;
  optimizedTaxes: number;
  taxSavings: number;
  effectiveRate: number;
  optimizedRate: number;
  marginalRate: number;
  standardDeduction: number;
  itemizedDeductions: number;
  takeHomeIncome: number;
  optimizedTakeHome: number;
  recommendations: string[];
  strategies: TaxStrategy[];
  taxBracketAnalysis: Array<{
    bracket: string;
    rate: number;
    taxableIncome: number;
    taxes: number;
  }>;
}

export interface UseTaxOptimizerCalculatorResult {
  values: TaxOptimizerInputs;
  errors: Record<string, string>;
  result: TaxOptimizerResult | null;
  isValid: boolean;
  updateValue: (field: keyof TaxOptimizerInputs, value: string) => void;
  updateFilingStatus: (status: string) => void;
  reset: () => void;
}

const TAX_BRACKETS_2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 }
];

const STANDARD_DEDUCTIONS_2024 = {
  single: 13850,
  marriedJointly: 27700,
  marriedSeparately: 13850,
  headOfHousehold: 20800
};

export function useTaxOptimizerCalculator(): UseTaxOptimizerCalculatorResult {
  const [values, setValues] = useState<TaxOptimizerInputs>({
    income: 75000,
    filingStatus: 'single',
    currentDeductions: 13850,
    retirement401k: 6000,
    retirementIra: 3000,
    hsaContribution: 2000,
    charitableDonations: 2500,
    mortgageInterest: 8000,
    stateLocalTaxes: 5000,
    businessExpenses: 1000,
    childTaxCredit: 0,
    educationCredits: 0
  });

  // Validation
  const validation = validateFields(values, CalculatorValidations.taxOptimizer);
  const errors = validation.errors;
  const isValid = validation.isValid;

  // Tax calculation functions
  const calculateFederalTax = useCallback((taxableIncome: number): number => {
    let totalTax = 0;
    let remainingIncome = Math.max(0, taxableIncome);

    for (const bracket of TAX_BRACKETS_2024) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      totalTax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }

    return totalTax;
  }, []);

  const getMarginalTaxRate = useCallback((taxableIncome: number): number => {
    for (const bracket of TAX_BRACKETS_2024) {
      if (taxableIncome <= bracket.max) {
        return bracket.rate;
      }
    }
    return TAX_BRACKETS_2024[TAX_BRACKETS_2024.length - 1].rate;
  }, []);

  const getStandardDeduction = useCallback((filingStatus: string): number => {
    return STANDARD_DEDUCTIONS_2024[filingStatus as keyof typeof STANDARD_DEDUCTIONS_2024] || STANDARD_DEDUCTIONS_2024.single;
  }, []);

  // Calculate results
  const result = useMemo((): TaxOptimizerResult | null => {
    if (!isValid) return null;

    const {
      income, filingStatus, currentDeductions, retirement401k, retirementIra,
      hsaContribution, charitableDonations, mortgageInterest, stateLocalTaxes,
      businessExpenses, childTaxCredit, educationCredits
    } = values;

    const standardDeduction = getStandardDeduction(filingStatus);
    
    // Calculate itemized deductions
    const itemizedTotal = charitableDonations + mortgageInterest + Math.min(stateLocalTaxes, 10000) + businessExpenses;
    const itemizedDeductions = itemizedTotal;
    
    // Use higher of standard or itemized deductions
    const bestDeduction = Math.max(standardDeduction, itemizedDeductions);
    
    // Current scenario
    const currentAdjustedIncome = income - retirement401k - retirementIra - hsaContribution;
    const currentTaxableIncome = Math.max(0, currentAdjustedIncome - currentDeductions);
    const currentFederalTax = calculateFederalTax(currentTaxableIncome);
    const currentTotalTax = Math.max(0, currentFederalTax - childTaxCredit - educationCredits);
    
    // Optimized scenario
    const optimizedTaxableIncome = Math.max(0, currentAdjustedIncome - bestDeduction);
    const optimizedFederalTax = calculateFederalTax(optimizedTaxableIncome);
    const optimizedTotalTax = Math.max(0, optimizedFederalTax - childTaxCredit - educationCredits);
    
    const taxSavings = currentTotalTax - optimizedTotalTax;
    const effectiveRate = income > 0 ? (currentTotalTax / income) * 100 : 0;
    const optimizedRate = income > 0 ? (optimizedTotalTax / income) * 100 : 0;
    const marginalRate = getMarginalTaxRate(currentTaxableIncome) * 100;
    
    const takeHomeIncome = income - currentTotalTax;
    const optimizedTakeHome = income - optimizedTotalTax;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (itemizedDeductions > standardDeduction) {
      recommendations.push('Itemize deductions to save on taxes');
    } else {
      recommendations.push('Use standard deduction for simplicity');
    }
    
    if (retirement401k < 23000) {
      recommendations.push('Maximize 401(k) contributions for tax savings');
    }
    
    if (hsaContribution < 4300) {
      recommendations.push('Increase HSA contributions for triple tax advantage');
    }
    
    if (charitableDonations < income * 0.02) {
      recommendations.push('Consider charitable giving for tax deductions');
    }

    // Generate strategies
    const strategies: TaxStrategy[] = [
      {
        name: 'Maximize 401(k) Contributions',
        description: 'Contribute the maximum allowed to your 401(k) plan',
        potentialSavings: (23000 - retirement401k) * marginalRate / 100,
        difficulty: 'Easy' as const,
        category: 'Retirement'
      },
      {
        name: 'HSA Optimization',
        description: 'Maximize Health Savings Account contributions',
        potentialSavings: (4300 - hsaContribution) * marginalRate / 100,
        difficulty: 'Easy' as const,
        category: 'Healthcare'
      },
      {
        name: 'Tax-Loss Harvesting',
        description: 'Realize investment losses to offset gains',
        potentialSavings: income * 0.01,
        difficulty: 'Medium' as const,
        category: 'Investments'
      },
      {
        name: 'Charitable Bunching',
        description: 'Bunch charitable donations in alternating years',
        potentialSavings: income * 0.005,
        difficulty: 'Advanced' as const,
        category: 'Charitable'
      }
    ].filter(strategy => strategy.potentialSavings > 0);

    // Tax bracket analysis
    const taxBracketAnalysis = TAX_BRACKETS_2024.map(bracket => {
      const bracketIncome = Math.min(
        Math.max(0, currentTaxableIncome - bracket.min),
        bracket.max - bracket.min
      );
      return {
        bracket: `${(bracket.rate * 100).toFixed(0)}%`,
        rate: bracket.rate * 100,
        taxableIncome: bracketIncome,
        taxes: bracketIncome * bracket.rate
      };
    }).filter(item => item.taxableIncome > 0);

    return {
      currentTaxes: currentTotalTax,
      optimizedTaxes: optimizedTotalTax,
      taxSavings,
      effectiveRate,
      optimizedRate,
      marginalRate,
      standardDeduction,
      itemizedDeductions,
      takeHomeIncome,
      optimizedTakeHome,
      recommendations,
      strategies,
      taxBracketAnalysis
    };
  }, [values, isValid, calculateFederalTax, getMarginalTaxRate, getStandardDeduction]);

  // Update functions
  const updateValue = useCallback((field: keyof TaxOptimizerInputs, value: string) => {
    if (field === 'filingStatus') {
      setValues(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setValues(prev => ({ ...prev, [field]: numValue }));
    }
  }, []);

  const updateFilingStatus = useCallback((status: string) => {
    const standardDeduction = getStandardDeduction(status);
    setValues(prev => ({ 
      ...prev, 
      filingStatus: status,
      currentDeductions: standardDeduction
    }));
  }, [getStandardDeduction]);

  const reset = useCallback(() => {
    setValues({
      income: 75000,
      filingStatus: 'single',
      currentDeductions: 13850,
      retirement401k: 6000,
      retirementIra: 3000,
      hsaContribution: 2000,
      charitableDonations: 2500,
      mortgageInterest: 8000,
      stateLocalTaxes: 5000,
      businessExpenses: 1000,
      childTaxCredit: 0,
      educationCredits: 0
    });
  }, []);

  return {
    values,
    errors,
    result,
    isValid,
    updateValue,
    updateFilingStatus,
    reset
  };
}

/**
 * Portfolio Analyzer Calculator Hook
 */
export interface PortfolioAnalyzerInputs {
  totalInvestment: number;
  usStocks: number;
  intlStocks: number;
  bonds: number;
  realEstate: number;
  commodities: number;
  cash: number;
  crypto: number;
  age: number;
  riskTolerance: string;
  investmentHorizon: number;
}

export interface AssetAllocation {
  category: string;
  allocation: number;
  value: number;
  target: number;
  deviation: number;
  color: string;
}

export interface PortfolioRecommendation {
  type: 'rebalance' | 'diversify' | 'risk-adjust' | 'fee-optimize';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
}

export interface PortfolioAnalyzerResult {
  totalValue: number;
  riskScore: number;
  riskLevel: string;
  diversificationScore: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  allocationHealthScore: number;
  allocations: AssetAllocation[];
  recommendations: PortfolioRecommendation[];
  ageBasedTarget: Record<string, number>;
  rebalanceNeeded: boolean;
  totalAllocation: number;
}

export interface UsePortfolioAnalyzerCalculatorResult {
  values: PortfolioAnalyzerInputs;
  errors: Record<string, string>;
  result: PortfolioAnalyzerResult | null;
  isValid: boolean;
  updateValue: (field: keyof PortfolioAnalyzerInputs, value: string) => void;
  updateRiskTolerance: (tolerance: string) => void;
  autoRebalance: () => void;
  reset: () => void;
}

// Asset class expected returns and volatilities (annual)
const ASSET_METRICS = {
  usStocks: { expectedReturn: 0.10, volatility: 0.16, correlation: 1.0 },
  intlStocks: { expectedReturn: 0.08, volatility: 0.18, correlation: 0.7 },
  bonds: { expectedReturn: 0.04, volatility: 0.06, correlation: -0.2 },
  realEstate: { expectedReturn: 0.07, volatility: 0.14, correlation: 0.3 },
  commodities: { expectedReturn: 0.06, volatility: 0.20, correlation: 0.1 },
  cash: { expectedReturn: 0.02, volatility: 0.01, correlation: 0.0 },
  crypto: { expectedReturn: 0.15, volatility: 0.60, correlation: 0.2 }
};

// Age-based target allocations
const getAgeBasedTargets = (age: number, riskTolerance: string) => {
  const bondPercent = Math.min(Math.max(age - 20, 10), 60);
  const stockPercent = 100 - bondPercent;
  
  const riskMultiplier = riskTolerance === 'conservative' ? 0.7 : 
                        riskTolerance === 'aggressive' ? 1.3 : 1.0;
  
  return {
    usStocks: Math.round(stockPercent * 0.6 * riskMultiplier),
    intlStocks: Math.round(stockPercent * 0.3 * riskMultiplier),
    bonds: Math.round(bondPercent),
    realEstate: Math.round(10 * riskMultiplier),
    commodities: Math.round(5 * riskMultiplier),
    cash: Math.round(5),
    crypto: riskTolerance === 'aggressive' ? 5 : 0
  };
};

export function usePortfolioAnalyzerCalculator(): UsePortfolioAnalyzerCalculatorResult {
  const [values, setValues] = useState<PortfolioAnalyzerInputs>({
    totalInvestment: 100000,
    usStocks: 50,
    intlStocks: 20,
    bonds: 20,
    realEstate: 5,
    commodities: 3,
    cash: 2,
    crypto: 0,
    age: 35,
    riskTolerance: 'moderate',
    investmentHorizon: 25
  });

  // Validation
  const validation = validateFields(values, CalculatorValidations.portfolioAnalyzer);
  const errors = validation.errors;
  const isValid = validation.isValid;

  // Portfolio calculation functions
  const calculatePortfolioMetrics = useCallback((allocations: Record<string, number>) => {
    let expectedReturn = 0;
    let portfolioVariance = 0;
    
    // Calculate expected return
    Object.entries(allocations).forEach(([asset, allocation]) => {
      const weight = allocation / 100;
      const assetKey = asset as keyof typeof ASSET_METRICS;
      if (ASSET_METRICS[assetKey]) {
        expectedReturn += weight * ASSET_METRICS[assetKey].expectedReturn;
      }
    });

    // Calculate portfolio variance (simplified - assumes correlations)
    Object.entries(allocations).forEach(([asset, allocation]) => {
      const weight = allocation / 100;
      const assetKey = asset as keyof typeof ASSET_METRICS;
      if (ASSET_METRICS[assetKey]) {
        portfolioVariance += Math.pow(weight * ASSET_METRICS[assetKey].volatility, 2);
      }
    });

    const volatility = Math.sqrt(portfolioVariance);
    const sharpeRatio = volatility > 0 ? (expectedReturn - 0.02) / volatility : 0;

    return {
      expectedReturn,
      volatility,
      sharpeRatio
    };
  }, []);

  const calculateDiversificationScore = useCallback((allocations: Record<string, number>) => {
    const nonZeroAllocations = Object.values(allocations).filter(val => val > 0).length;
    const maxAllocations = Object.keys(allocations).length;
    
    // Calculate Herfindahl-Hirschman Index (lower is better for diversification)
    const hhi = Object.values(allocations).reduce((sum, allocation) => {
      return sum + Math.pow(allocation / 100, 2);
    }, 0);
    
    // Convert to diversification score (0-100, higher is better)
    const diversificationScore = Math.max(0, Math.min(100, 100 * (1 - hhi) * 2));
    
    return Math.round(diversificationScore);
  }, []);

  const getRiskScore = useCallback((allocations: Record<string, number>) => {
    let riskScore = 0;
    
    Object.entries(allocations).forEach(([asset, allocation]) => {
      const weight = allocation / 100;
      const assetKey = asset as keyof typeof ASSET_METRICS;
      if (ASSET_METRICS[assetKey]) {
        riskScore += weight * ASSET_METRICS[assetKey].volatility * 100;
      }
    });
    
    return Math.round(riskScore);
  }, []);

  // Calculate results
  const result = useMemo((): PortfolioAnalyzerResult | null => {
    if (!isValid) return null;

    const {
      totalInvestment, usStocks, intlStocks, bonds, realEstate,
      commodities, cash, crypto, age, riskTolerance, investmentHorizon
    } = values;

    const totalAllocation = usStocks + intlStocks + bonds + realEstate + commodities + cash + crypto;
    
    const allocations: AssetAllocation[] = [
      {
        category: 'US Stocks',
        allocation: usStocks,
        value: (usStocks / 100) * totalInvestment,
        target: 0,
        deviation: 0,
        color: '#3B82F6'
      },
      {
        category: 'International Stocks',
        allocation: intlStocks,
        value: (intlStocks / 100) * totalInvestment,
        target: 0,
        deviation: 0,
        color: '#10B981'
      },
      {
        category: 'Bonds',
        allocation: bonds,
        value: (bonds / 100) * totalInvestment,
        target: 0,
        deviation: 0,
        color: '#F59E0B'
      },
      {
        category: 'Real Estate',
        allocation: realEstate,
        value: (realEstate / 100) * totalInvestment,
        target: 0,
        deviation: 0,
        color: '#EF4444'
      },
      {
        category: 'Commodities',
        allocation: commodities,
        value: (commodities / 100) * totalInvestment,
        target: 0,
        deviation: 0,
        color: '#8B5CF6'
      },
      {
        category: 'Cash',
        allocation: cash,
        value: (cash / 100) * totalInvestment,
        target: 0,
        deviation: 0,
        color: '#06B6D4'
      },
      {
        category: 'Cryptocurrency',
        allocation: crypto,
        value: (crypto / 100) * totalInvestment,
        target: 0,
        deviation: 0,
        color: '#F97316'
      }
    ];

    // Get age-based targets
    const ageBasedTarget = getAgeBasedTargets(age, riskTolerance);
    
    // Update targets and deviations
    allocations.forEach(allocation => {
      const key = allocation.category.toLowerCase().replace(/\s+/g, '').replace('stocks', 'Stocks').replace('estate', 'Estate');
      let targetKey = '';
      
      switch (allocation.category) {
        case 'US Stocks':
          targetKey = 'usStocks';
          break;
        case 'International Stocks':
          targetKey = 'intlStocks';
          break;
        case 'Bonds':
          targetKey = 'bonds';
          break;
        case 'Real Estate':
          targetKey = 'realEstate';
          break;
        case 'Commodities':
          targetKey = 'commodities';
          break;
        case 'Cash':
          targetKey = 'cash';
          break;
        case 'Cryptocurrency':
          targetKey = 'crypto';
          break;
      }
      
      if (targetKey && ageBasedTarget[targetKey as keyof typeof ageBasedTarget] !== undefined) {
        allocation.target = ageBasedTarget[targetKey as keyof typeof ageBasedTarget];
        allocation.deviation = allocation.allocation - allocation.target;
      }
    });

    const portfolioAllocations = {
      usStocks, intlStocks, bonds, realEstate, commodities, cash, crypto
    };

    const portfolioMetrics = calculatePortfolioMetrics(portfolioAllocations);
    const diversificationScore = calculateDiversificationScore(portfolioAllocations);
    const riskScore = getRiskScore(portfolioAllocations);

    // Calculate risk level
    const riskLevel = riskScore < 8 ? 'Conservative' : 
                     riskScore < 15 ? 'Moderate' : 'Aggressive';

    // Calculate allocation health score
    const maxDeviation = Math.max(...allocations.map(a => Math.abs(a.deviation)));
    const allocationHealthScore = Math.max(0, Math.round(100 - (maxDeviation * 2)));

    // Generate recommendations
    const recommendations: PortfolioRecommendation[] = [];

    if (Math.abs(totalAllocation - 100) > 1) {
      recommendations.push({
        type: 'rebalance',
        title: 'Portfolio Allocation Issue',
        description: `Your total allocation is ${totalAllocation.toFixed(1)}%. Adjust allocations to total 100%.`,
        priority: 'High',
        impact: 'Critical for accurate analysis'
      });
    }

    if (diversificationScore < 50) {
      recommendations.push({
        type: 'diversify',
        title: 'Improve Diversification',
        description: 'Consider spreading investments across more asset classes to reduce risk.',
        priority: 'High',
        impact: 'Reduces portfolio volatility'
      });
    }

    allocations.forEach(allocation => {
      if (Math.abs(allocation.deviation) > 10) {
        recommendations.push({
          type: 'rebalance',
          title: `${allocation.category} Allocation`,
          description: `Consider ${allocation.deviation > 0 ? 'reducing' : 'increasing'} ${allocation.category} allocation by ${Math.abs(allocation.deviation).toFixed(1)}%`,
          priority: Math.abs(allocation.deviation) > 20 ? 'High' : 'Medium',
          impact: 'Aligns with age-appropriate targets'
        });
      }
    });

    if (crypto > 10 && riskTolerance !== 'aggressive') {
      recommendations.push({
        type: 'risk-adjust',
        title: 'High Cryptocurrency Allocation',
        description: 'Consider reducing crypto allocation to 5% or less for better risk management.',
        priority: 'Medium',
        impact: 'Reduces portfolio volatility'
      });
    }

    if (cash > 10) {
      recommendations.push({
        type: 'fee-optimize',
        title: 'High Cash Allocation',
        description: 'Consider investing excess cash for better long-term returns.',
        priority: 'Low',
        impact: 'Improves long-term growth potential'
      });
    }

    return {
      totalValue: totalInvestment,
      riskScore,
      riskLevel,
      diversificationScore,
      expectedReturn: portfolioMetrics.expectedReturn,
      volatility: portfolioMetrics.volatility,
      sharpeRatio: portfolioMetrics.sharpeRatio,
      allocationHealthScore,
      allocations,
      recommendations,
      ageBasedTarget,
      rebalanceNeeded: recommendations.some(r => r.type === 'rebalance'),
      totalAllocation
    };
  }, [values, isValid, calculatePortfolioMetrics, calculateDiversificationScore, getRiskScore]);

  // Update functions
  const updateValue = useCallback((field: keyof PortfolioAnalyzerInputs, value: string) => {
    if (field === 'riskTolerance') {
      setValues(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setValues(prev => ({ ...prev, [field]: numValue }));
    }
  }, []);

  const updateRiskTolerance = useCallback((tolerance: string) => {
    setValues(prev => ({ ...prev, riskTolerance: tolerance }));
  }, []);

  const autoRebalance = useCallback(() => {
    if (!result) return;
    
    const targets = getAgeBasedTargets(values.age, values.riskTolerance);
    setValues(prev => ({
      ...prev,
      usStocks: targets.usStocks,
      intlStocks: targets.intlStocks,
      bonds: targets.bonds,
      realEstate: targets.realEstate,
      commodities: targets.commodities,
      cash: targets.cash,
      crypto: targets.crypto
    }));
  }, [result, values.age, values.riskTolerance]);

  const reset = useCallback(() => {
    setValues({
      totalInvestment: 100000,
      usStocks: 50,
      intlStocks: 20,
      bonds: 20,
      realEstate: 5,
      commodities: 3,
      cash: 2,
      crypto: 0,
      age: 35,
      riskTolerance: 'moderate',
      investmentHorizon: 25
    });
  }, []);

  return {
    values,
    errors,
    result,
    isValid,
    updateValue,
    updateRiskTolerance,
    autoRebalance,
    reset
  };
}

/**
 * Cryptocurrency Allocation Calculator Hook
 */
export interface CryptocurrencyAllocationInputs {
  totalPortfolio: number;
  cryptoPercentage: number;
  bitcoin: number;
  ethereum: number;
  altcoins: number;
  defi: number;
  stablecoins: number;
  riskTolerance: string;
  investmentHorizon: number;
  rebalanceFrequency: string;
}

export interface CryptoAsset {
  name: string;
  allocation: number;
  value: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  category: string;
  color: string;
  expectedReturn: number;
  volatility: number;
  correlation: number;
}

export interface CryptoRecommendation {
  type: 'allocation' | 'diversification' | 'risk' | 'rebalancing';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string;
}

export interface CryptocurrencyAllocationResult {
  totalCryptoValue: number;
  cryptoAssets: CryptoAsset[];
  riskScore: number;
  riskLevel: string;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  diversificationScore: number;
  correlationScore: number;
  maxDrawdown: number;
  recommendations: CryptoRecommendation[];
  allocationValid: boolean;
  totalAllocation: number;
}

export interface UseCryptocurrencyAllocationCalculatorResult {
  values: CryptocurrencyAllocationInputs;
  errors: Record<string, string>;
  result: CryptocurrencyAllocationResult | null;
  isValid: boolean;
  updateValue: (field: keyof CryptocurrencyAllocationInputs, value: string) => void;
  updateRiskTolerance: (tolerance: string) => void;
  updateRebalanceFrequency: (frequency: string) => void;
  autoBalance: () => void;
  reset: () => void;
}

// Crypto asset metrics (expected returns and volatilities are estimated)
const CRYPTO_METRICS = {
  bitcoin: { expectedReturn: 0.40, volatility: 0.80, correlation: 1.0, riskLevel: 'High' as const },
  ethereum: { expectedReturn: 0.50, volatility: 0.90, correlation: 0.8, riskLevel: 'High' as const },
  altcoins: { expectedReturn: 0.70, volatility: 1.20, correlation: 0.7, riskLevel: 'Very High' as const },
  defi: { expectedReturn: 0.60, volatility: 1.10, correlation: 0.6, riskLevel: 'Very High' as const },
  stablecoins: { expectedReturn: 0.05, volatility: 0.05, correlation: 0.1, riskLevel: 'Low' as const }
};

// Risk tolerance based allocation suggestions
const getRiskBasedAllocation = (riskTolerance: string, cryptoPercentage: number) => {
  const baseAllocations = {
    conservative: {
      bitcoin: 60,
      ethereum: 25,
      altcoins: 0,
      defi: 0,
      stablecoins: 15
    },
    moderate: {
      bitcoin: 50,
      ethereum: 30,
      altcoins: 10,
      defi: 5,
      stablecoins: 5
    },
    aggressive: {
      bitcoin: 40,
      ethereum: 30,
      altcoins: 20,
      defi: 10,
      stablecoins: 0
    }
  };

  return baseAllocations[riskTolerance as keyof typeof baseAllocations] || baseAllocations.moderate;
};

export function useCryptocurrencyAllocationCalculator(): UseCryptocurrencyAllocationCalculatorResult {
  const [values, setValues] = useState<CryptocurrencyAllocationInputs>({
    totalPortfolio: 100000,
    cryptoPercentage: 10,
    bitcoin: 50,
    ethereum: 30,
    altcoins: 15,
    defi: 5,
    stablecoins: 0,
    riskTolerance: 'moderate',
    investmentHorizon: 5,
    rebalanceFrequency: 'quarterly'
  });

  // Validation
  const validation = validateFields(values, CalculatorValidations.cryptoAllocation);
  const errors = validation.errors;
  const isValid = validation.isValid;

  // Crypto calculation functions
  const calculateCryptoMetrics = useCallback((allocations: Record<string, number>, totalValue: number) => {
    let expectedReturn = 0;
    let portfolioVariance = 0;
    let weightedCorrelation = 0;
    let totalWeight = 0;

    // Calculate portfolio metrics
    Object.entries(allocations).forEach(([asset, allocation]) => {
      const weight = allocation / 100;
      const assetKey = asset as keyof typeof CRYPTO_METRICS;
      
      if (CRYPTO_METRICS[assetKey] && weight > 0) {
        expectedReturn += weight * CRYPTO_METRICS[assetKey].expectedReturn;
        portfolioVariance += Math.pow(weight * CRYPTO_METRICS[assetKey].volatility, 2);
        weightedCorrelation += weight * CRYPTO_METRICS[assetKey].correlation;
        totalWeight += weight;
      }
    });

    const volatility = Math.sqrt(portfolioVariance);
    const sharpeRatio = volatility > 0 ? (expectedReturn - 0.02) / volatility : 0;
    const correlationScore = totalWeight > 0 ? weightedCorrelation / totalWeight : 0;
    
    // Calculate diversification score (lower correlation = better diversification)
    const diversificationScore = Math.max(0, Math.min(100, (1 - correlationScore) * 100));
    
    // Calculate max drawdown estimate (simplified)
    const maxDrawdown = volatility * 2; // Rough estimate

    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      diversificationScore,
      correlationScore,
      maxDrawdown
    };
  }, []);

  const calculateRiskScore = useCallback((allocations: Record<string, number>) => {
    let riskScore = 0;
    
    Object.entries(allocations).forEach(([asset, allocation]) => {
      const weight = allocation / 100;
      const assetKey = asset as keyof typeof CRYPTO_METRICS;
      
      if (CRYPTO_METRICS[assetKey]) {
        const assetRisk = CRYPTO_METRICS[assetKey].volatility * 10; // Scale to 0-10
        riskScore += weight * assetRisk;
      }
    });
    
    return Math.round(riskScore);
  }, []);

  // Calculate results
  const result = useMemo((): CryptocurrencyAllocationResult | null => {
    if (!isValid) return null;

    const {
      totalPortfolio, cryptoPercentage, bitcoin, ethereum,
      altcoins, defi, stablecoins, riskTolerance, investmentHorizon
    } = values;

    const totalCryptoValue = (cryptoPercentage / 100) * totalPortfolio;
    const totalAllocation = bitcoin + ethereum + altcoins + defi + stablecoins;
    const allocationValid = Math.abs(totalAllocation - 100) <= 1;

    const cryptoAssets: CryptoAsset[] = [
      {
        name: 'Bitcoin',
        allocation: bitcoin,
        value: (bitcoin / 100) * totalCryptoValue,
        riskLevel: CRYPTO_METRICS.bitcoin.riskLevel,
        category: 'Store of Value',
        color: '#F7931A',
        expectedReturn: CRYPTO_METRICS.bitcoin.expectedReturn,
        volatility: CRYPTO_METRICS.bitcoin.volatility,
        correlation: CRYPTO_METRICS.bitcoin.correlation
      },
      {
        name: 'Ethereum',
        allocation: ethereum,
        value: (ethereum / 100) * totalCryptoValue,
        riskLevel: CRYPTO_METRICS.ethereum.riskLevel,
        category: 'Smart Contract Platform',
        color: '#627EEA',
        expectedReturn: CRYPTO_METRICS.ethereum.expectedReturn,
        volatility: CRYPTO_METRICS.ethereum.volatility,
        correlation: CRYPTO_METRICS.ethereum.correlation
      },
      {
        name: 'Altcoins',
        allocation: altcoins,
        value: (altcoins / 100) * totalCryptoValue,
        riskLevel: CRYPTO_METRICS.altcoins.riskLevel,
        category: 'Alternative Cryptocurrencies',
        color: '#8B5CF6',
        expectedReturn: CRYPTO_METRICS.altcoins.expectedReturn,
        volatility: CRYPTO_METRICS.altcoins.volatility,
        correlation: CRYPTO_METRICS.altcoins.correlation
      },
      {
        name: 'DeFi Tokens',
        allocation: defi,
        value: (defi / 100) * totalCryptoValue,
        riskLevel: CRYPTO_METRICS.defi.riskLevel,
        category: 'Decentralized Finance',
        color: '#10B981',
        expectedReturn: CRYPTO_METRICS.defi.expectedReturn,
        volatility: CRYPTO_METRICS.defi.volatility,
        correlation: CRYPTO_METRICS.defi.correlation
      },
      {
        name: 'Stablecoins',
        allocation: stablecoins,
        value: (stablecoins / 100) * totalCryptoValue,
        riskLevel: CRYPTO_METRICS.stablecoins.riskLevel,
        category: 'Stable Value',
        color: '#06B6D4',
        expectedReturn: CRYPTO_METRICS.stablecoins.expectedReturn,
        volatility: CRYPTO_METRICS.stablecoins.volatility,
        correlation: CRYPTO_METRICS.stablecoins.correlation
      }
    ].filter(asset => asset.allocation > 0);

    const allocations = { bitcoin, ethereum, altcoins, defi, stablecoins };
    const cryptoMetrics = calculateCryptoMetrics(allocations, totalCryptoValue);
    const riskScore = calculateRiskScore(allocations);

    // Calculate risk level
    const riskLevel = riskScore < 3 ? 'Conservative' : 
                     riskScore < 6 ? 'Moderate' : 
                     riskScore < 8 ? 'Aggressive' : 'Very High Risk';

    // Generate recommendations
    const recommendations: CryptoRecommendation[] = [];

    // Check if crypto allocation is appropriate
    if (cryptoPercentage > 20 && riskTolerance === 'conservative') {
      recommendations.push({
        type: 'allocation',
        title: 'High Crypto Allocation for Conservative Profile',
        description: 'Consider reducing cryptocurrency allocation to 5-10% for conservative risk tolerance.',
        priority: 'High',
        impact: 'Reduces portfolio volatility'
      });
    }

    if (cryptoPercentage < 5 && riskTolerance === 'aggressive' && investmentHorizon > 5) {
      recommendations.push({
        type: 'allocation',
        title: 'Low Crypto Allocation for Aggressive Profile',
        description: 'Consider increasing cryptocurrency allocation to 15-25% for aggressive growth.',
        priority: 'Medium',
        impact: 'Increases growth potential'
      });
    }

    // Check allocation balance
    if (!allocationValid) {
      recommendations.push({
        type: 'allocation',
        title: 'Allocation Imbalance',
        description: `Total allocation is ${totalAllocation.toFixed(1)}%. Adjust to equal 100%.`,
        priority: 'High',
        impact: 'Ensures accurate analysis'
      });
    }

    // Diversification recommendations
    if (bitcoin > 70) {
      recommendations.push({
        type: 'diversification',
        title: 'Heavy Bitcoin Concentration',
        description: 'Consider diversifying into Ethereum and other assets to reduce concentration risk.',
        priority: 'Medium',
        impact: 'Improves risk-adjusted returns'
      });
    }

    if (altcoins + defi > 40 && riskTolerance !== 'aggressive') {
      recommendations.push({
        type: 'risk',
        title: 'High Alternative Asset Allocation',
        description: 'Consider reducing exposure to altcoins and DeFi tokens for better risk management.',
        priority: 'Medium',
        impact: 'Reduces portfolio volatility'
      });
    }

    if (stablecoins > 25) {
      recommendations.push({
        type: 'allocation',
        title: 'High Stablecoin Allocation',
        description: 'Consider reducing stablecoin allocation for better growth potential.',
        priority: 'Low',
        impact: 'Increases expected returns'
      });
    }

    // Rebalancing recommendations
    if (values.rebalanceFrequency === 'never') {
      recommendations.push({
        type: 'rebalancing',
        title: 'No Rebalancing Strategy',
        description: 'Consider quarterly or semi-annual rebalancing for optimal performance.',
        priority: 'Medium',
        impact: 'Maintains target allocation'
      });
    }

    return {
      totalCryptoValue,
      cryptoAssets,
      riskScore,
      riskLevel,
      expectedReturn: cryptoMetrics.expectedReturn,
      volatility: cryptoMetrics.volatility,
      sharpeRatio: cryptoMetrics.sharpeRatio,
      diversificationScore: cryptoMetrics.diversificationScore,
      correlationScore: cryptoMetrics.correlationScore,
      maxDrawdown: cryptoMetrics.maxDrawdown,
      recommendations,
      allocationValid,
      totalAllocation
    };
  }, [values, isValid, calculateCryptoMetrics, calculateRiskScore]);

  // Update functions
  const updateValue = useCallback((field: keyof CryptocurrencyAllocationInputs, value: string) => {
    if (['riskTolerance', 'rebalanceFrequency'].includes(field)) {
      setValues(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setValues(prev => ({ ...prev, [field]: numValue }));
    }
  }, []);

  const updateRiskTolerance = useCallback((tolerance: string) => {
    setValues(prev => ({ ...prev, riskTolerance: tolerance }));
  }, []);

  const updateRebalanceFrequency = useCallback((frequency: string) => {
    setValues(prev => ({ ...prev, rebalanceFrequency: frequency }));
  }, []);

  const autoBalance = useCallback(() => {
    const suggested = getRiskBasedAllocation(values.riskTolerance, values.cryptoPercentage);
    setValues(prev => ({
      ...prev,
      bitcoin: suggested.bitcoin,
      ethereum: suggested.ethereum,
      altcoins: suggested.altcoins,
      defi: suggested.defi,
      stablecoins: suggested.stablecoins
    }));
  }, [values.riskTolerance, values.cryptoPercentage]);

  const reset = useCallback(() => {
    setValues({
      totalPortfolio: 100000,
      cryptoPercentage: 10,
      bitcoin: 50,
      ethereum: 30,
      altcoins: 15,
      defi: 5,
      stablecoins: 0,
      riskTolerance: 'moderate',
      investmentHorizon: 5,
      rebalanceFrequency: 'quarterly'
    });
  }, []);

  return {
    values,
    errors,
    result,
    isValid,
    updateValue,
    updateRiskTolerance,
    updateRebalanceFrequency,
    autoBalance,
    reset
  };
}

// Options Strategy Calculator Hook
export interface OptionsStrategyInputs {
  stockPrice: number;
  strikePrice: number;
  strikePrice2: number;
  premium: number;
  premium2: number;
  daysToExpiration: number;
  impliedVolatility: number;
  riskFreeRate: number;
  dividendYield: number;
  numberOfContracts: number;
  strategyType: string;
}

export interface OptionsStrategyResults {
  currentValue: number;
  maxProfit: number;
  maxLoss: number;
  breakEvenPoints: number[];
  profitLoss: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  probabilityOfProfit: number;
  payoffDiagram: { price: number; pnl: number }[];
  riskMetrics: {
    metric: string;
    value: string;
    interpretation: string;
    color: string;
  }[];
  strategyAnalysis: {
    marketOutlook: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
    timeHorizon: 'Short-term' | 'Medium-term' | 'Long-term';
    bestScenario: string;
    worstScenario: string;
  };
}

export function useOptionsCalculator() {
  const [values, setValues] = useState<OptionsStrategyInputs>({
    stockPrice: 100,
    strikePrice: 100,
    strikePrice2: 110,
    premium: 3,
    premium2: 1,
    daysToExpiration: 30,
    impliedVolatility: 25,
    riskFreeRate: 5,
    dividendYield: 2,
    numberOfContracts: 1,
    strategyType: 'long-call'
  });

  const errors = useMemo(() => {
    return validateFields(values, CalculatorValidations.optionsStrategy);
  }, [values]);

  const isValid = useMemo(() => errors.isValid, [errors]);

  // Black-Scholes formula implementation
  const calculateBlackScholes = useCallback((
    S: number, K: number, T: number, r: number, sigma: number, q: number = 0, isCall: boolean = true
  ) => {
    const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    
    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const NminusD1 = normalCDF(-d1);
    const NminusD2 = normalCDF(-d2);
    
    if (isCall) {
      const price = S * Math.exp(-q * T) * Nd1 - K * Math.exp(-r * T) * Nd2;
      const delta = Math.exp(-q * T) * Nd1;
      const gamma = Math.exp(-q * T) * normalPDF(d1) / (S * sigma * Math.sqrt(T));
      const theta = (-S * Math.exp(-q * T) * normalPDF(d1) * sigma / (2 * Math.sqrt(T)) 
                    - r * K * Math.exp(-r * T) * Nd2 
                    + q * S * Math.exp(-q * T) * Nd1) / 365;
      const vega = S * Math.exp(-q * T) * normalPDF(d1) * Math.sqrt(T) / 100;
      const rho = K * T * Math.exp(-r * T) * Nd2 / 100;
      
      return { price, delta, gamma, theta, vega, rho };
    } else {
      const price = K * Math.exp(-r * T) * NminusD2 - S * Math.exp(-q * T) * NminusD1;
      const delta = -Math.exp(-q * T) * NminusD1;
      const gamma = Math.exp(-q * T) * normalPDF(d1) / (S * sigma * Math.sqrt(T));
      const theta = (-S * Math.exp(-q * T) * normalPDF(d1) * sigma / (2 * Math.sqrt(T)) 
                    + r * K * Math.exp(-r * T) * NminusD2 
                    - q * S * Math.exp(-q * T) * NminusD1) / 365;
      const vega = S * Math.exp(-q * T) * normalPDF(d1) * Math.sqrt(T) / 100;
      const rho = -K * T * Math.exp(-r * T) * NminusD2 / 100;
      
      return { price, delta, gamma, theta, vega, rho };
    }
  }, []);

  // Normal distribution functions
  const normalCDF = (x: number): number => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  const normalPDF = (x: number): number => {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  };

  const erf = (x: number): number => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  const result = useMemo<OptionsStrategyResults | null>(() => {
    if (!isValid) return null;

    const T = values.daysToExpiration / 365;
    const r = values.riskFreeRate / 100;
    const sigma = values.impliedVolatility / 100;
    const q = values.dividendYield / 100;

    let currentValue = 0;
    let maxProfit = 0;
    let maxLoss = 0;
    let breakEvenPoints: number[] = [];
    let delta = 0;
    let gamma = 0;
    let theta = 0;
    let vega = 0;
    let rho = 0;

    // Calculate based on strategy type
    switch (values.strategyType) {
      case 'long-call': {
        const option = calculateBlackScholes(values.stockPrice, values.strikePrice, T, r, sigma, q, true);
        currentValue = option.price * values.numberOfContracts * 100;
        maxProfit = Infinity;
        maxLoss = values.premium * values.numberOfContracts * 100;
        breakEvenPoints = [values.strikePrice + values.premium];
        delta = option.delta * values.numberOfContracts * 100;
        gamma = option.gamma * values.numberOfContracts * 100;
        theta = option.theta * values.numberOfContracts * 100;
        vega = option.vega * values.numberOfContracts * 100;
        rho = option.rho * values.numberOfContracts * 100;
        break;
      }
      case 'long-put': {
        const option = calculateBlackScholes(values.stockPrice, values.strikePrice, T, r, sigma, q, false);
        currentValue = option.price * values.numberOfContracts * 100;
        maxProfit = (values.strikePrice - values.premium) * values.numberOfContracts * 100;
        maxLoss = values.premium * values.numberOfContracts * 100;
        breakEvenPoints = [values.strikePrice - values.premium];
        delta = option.delta * values.numberOfContracts * 100;
        gamma = option.gamma * values.numberOfContracts * 100;
        theta = option.theta * values.numberOfContracts * 100;
        vega = option.vega * values.numberOfContracts * 100;
        rho = option.rho * values.numberOfContracts * 100;
        break;
      }
      case 'bull-call-spread': {
        const longCall = calculateBlackScholes(values.stockPrice, values.strikePrice, T, r, sigma, q, true);
        const shortCall = calculateBlackScholes(values.stockPrice, values.strikePrice2, T, r, sigma, q, true);
        const netPremium = values.premium - values.premium2;
        
        currentValue = (longCall.price - shortCall.price) * values.numberOfContracts * 100;
        maxProfit = (values.strikePrice2 - values.strikePrice - netPremium) * values.numberOfContracts * 100;
        maxLoss = netPremium * values.numberOfContracts * 100;
        breakEvenPoints = [values.strikePrice + netPremium];
        delta = (longCall.delta - shortCall.delta) * values.numberOfContracts * 100;
        gamma = (longCall.gamma - shortCall.gamma) * values.numberOfContracts * 100;
        theta = (longCall.theta - shortCall.theta) * values.numberOfContracts * 100;
        vega = (longCall.vega - shortCall.vega) * values.numberOfContracts * 100;
        rho = (longCall.rho - shortCall.rho) * values.numberOfContracts * 100;
        break;
      }
    }

    // Generate payoff diagram
    const payoffDiagram = [];
    const priceRange = values.stockPrice * 0.5;
    for (let price = values.stockPrice - priceRange; price <= values.stockPrice + priceRange; price += 1) {
      let pnl = 0;
      
      switch (values.strategyType) {
        case 'long-call':
          pnl = Math.max(price - values.strikePrice, 0) - values.premium;
          break;
        case 'long-put':
          pnl = Math.max(values.strikePrice - price, 0) - values.premium;
          break;
        case 'bull-call-spread':
          const longCallPnl = Math.max(price - values.strikePrice, 0);
          const shortCallPnl = Math.max(price - values.strikePrice2, 0);
          pnl = longCallPnl - shortCallPnl - (values.premium - values.premium2);
          break;
      }
      
      payoffDiagram.push({ price, pnl: pnl * values.numberOfContracts * 100 });
    }

    // Calculate probability of profit (simplified)
    const volatilityAdjustment = sigma * Math.sqrt(T);
    const probabilityOfProfit = values.strategyType === 'long-call' 
      ? Math.max(0, Math.min(100, 50 + (values.stockPrice - breakEvenPoints[0]) / volatilityAdjustment * 10))
      : Math.max(0, Math.min(100, 50 + (breakEvenPoints[0] - values.stockPrice) / volatilityAdjustment * 10));

    // Risk metrics
    const riskMetrics = [
      {
        metric: 'Delta',
        value: delta.toFixed(2),
        interpretation: delta > 0 ? 'Positive exposure to price moves' : 'Negative exposure to price moves',
        color: delta > 0 ? 'text-green-400' : 'text-red-400'
      },
      {
        metric: 'Gamma',
        value: gamma.toFixed(4),
        interpretation: 'Rate of change of delta',
        color: 'text-blue-400'
      },
      {
        metric: 'Theta',
        value: theta.toFixed(2),
        interpretation: theta < 0 ? 'Losing value daily due to time decay' : 'Gaining value from time decay',
        color: theta < 0 ? 'text-red-400' : 'text-green-400'
      },
      {
        metric: 'Vega',
        value: vega.toFixed(2),
        interpretation: 'Sensitivity to volatility changes',
        color: 'text-purple-400'
      }
    ];

    // Strategy analysis
    const strategyAnalysis = {
      marketOutlook: values.strategyType.includes('call') ? 'Bullish' : values.strategyType.includes('put') ? 'Bearish' : 'Neutral',
      riskLevel: (values.strategyType.includes('spread') ? 'Medium' : values.strategyType.includes('long') ? 'Low' : 'High') as 'Low' | 'Medium' | 'High',
      complexity: (values.strategyType.includes('spread') ? 'Intermediate' : 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
      timeHorizon: (values.daysToExpiration < 30 ? 'Short-term' : values.daysToExpiration < 90 ? 'Medium-term' : 'Long-term') as 'Short-term' | 'Medium-term' | 'Long-term',
      bestScenario: values.strategyType === 'long-call' ? 'Stock price rises significantly' : 
                   values.strategyType === 'long-put' ? 'Stock price falls significantly' : 
                   'Stock price moves in predicted direction',
      worstScenario: 'Option expires worthless'
    };

    return {
      currentValue,
      maxProfit: maxProfit === Infinity ? maxProfit : maxProfit,
      maxLoss,
      breakEvenPoints,
      profitLoss: currentValue - (values.premium * values.numberOfContracts * 100),
      delta,
      gamma,
      theta,
      vega,
      rho,
      probabilityOfProfit,
      payoffDiagram,
      riskMetrics,
      strategyAnalysis
    };
  }, [values, isValid, calculateBlackScholes]);

  const updateField = useCallback((field: keyof OptionsStrategyInputs, value: string) => {
    if (field === 'strategyType') {
      setValues(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseFloat(value) || 0;
      setValues(prev => ({ ...prev, [field]: numValue }));
    }
  }, []);

  const reset = useCallback(() => {
    setValues({
      stockPrice: 100,
      strikePrice: 100,
      strikePrice2: 110,
      premium: 3,
      premium2: 1,
      daysToExpiration: 30,
      impliedVolatility: 25,
      riskFreeRate: 5,
      dividendYield: 2,
      numberOfContracts: 1,
      strategyType: 'long-call'
    });
  }, []);

  return {
    values,
    result,
    validation: errors,
    isValid,
    updateField,
    reset,
    errors: errors.errors
  };
}

// Business Calculator Hook
export interface BusinessCalculatorInputs {
  // Break-even Analysis
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
  
  // Financial Ratios
  currentAssets: number;
  currentLiabilities: number;
  totalDebt: number;
  totalEquity: number;
  revenue: number;
  grossProfit: number;
  netIncome: number;
  
  // Cash Flow
  monthlyRevenue: number;
  monthlyExpenses: number;
  initialCash: number;
  
  // Growth
  revenueGrowthRate: number;
  expenseGrowthRate: number;
}

export interface BusinessCalculatorResults {
  // Break-even Analysis
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  marginOfSafety: number;
  
  // Financial Ratios
  currentRatio: number;
  workingCapital: number;
  debtToEquityRatio: number;
  grossProfitMargin: number;
  netProfitMargin: number;
  roa: number;
  roe: number;
  
  // Cash Flow Projection (12 months)
  cashFlowProjection: {
    month: number;
    revenue: number;
    expenses: number;
    netCashFlow: number;
    cumulativeCash: number;
  }[];
  
  // Business Health Metrics
  burnRate: number;
  runwayMonths: number;
  businessHealthScore: number;
  recommendations: string[];
  
  // Risk Assessment
  riskLevel: 'Low' | 'Medium' | 'High';
  profitabilityTimeline: number;
}

export function useBusinessCalculator() {
  const [values, setValues] = useState<BusinessCalculatorInputs>({
    // Break-even Analysis
    fixedCosts: 10000,
    variableCostPerUnit: 15,
    pricePerUnit: 25,
    
    // Financial Ratios
    currentAssets: 50000,
    currentLiabilities: 30000,
    totalDebt: 40000,
    totalEquity: 60000,
    revenue: 120000,
    grossProfit: 80000,
    netIncome: 25000,
    
    // Cash Flow
    monthlyRevenue: 10000,
    monthlyExpenses: 8000,
    initialCash: 15000,
    
    // Growth
    revenueGrowthRate: 10,
    expenseGrowthRate: 5
  });

  const errors = useMemo(() => {
    return validateFields(values, CalculatorValidations.businessCalculator);
  }, [values]);

  const isValid = useMemo(() => errors.isValid, [errors]);

  const result = useMemo<BusinessCalculatorResults | null>(() => {
    if (!isValid) return null;

    // Break-even Analysis
    const contributionMargin = values.pricePerUnit - values.variableCostPerUnit;
    const contributionMarginRatio = values.pricePerUnit > 0 ? (contributionMargin / values.pricePerUnit) * 100 : 0;
    const breakEvenUnits = contributionMargin > 0 ? values.fixedCosts / contributionMargin : 0;
    const breakEvenRevenue = breakEvenUnits * values.pricePerUnit;
    const currentUnits = values.revenue / values.pricePerUnit;
    const marginOfSafety = currentUnits > breakEvenUnits ? ((currentUnits - breakEvenUnits) / currentUnits) * 100 : 0;

    // Financial Ratios
    const currentRatio = values.currentLiabilities > 0 ? values.currentAssets / values.currentLiabilities : 0;
    const workingCapital = values.currentAssets - values.currentLiabilities;
    const debtToEquityRatio = values.totalEquity > 0 ? values.totalDebt / values.totalEquity : 0;
    const grossProfitMargin = values.revenue > 0 ? (values.grossProfit / values.revenue) * 100 : 0;
    const netProfitMargin = values.revenue > 0 ? (values.netIncome / values.revenue) * 100 : 0;
    const totalAssets = values.currentAssets + values.totalDebt + values.totalEquity;
    const roa = totalAssets > 0 ? (values.netIncome / totalAssets) * 100 : 0;
    const roe = values.totalEquity > 0 ? (values.netIncome / values.totalEquity) * 100 : 0;

    // Cash Flow Projection
    const cashFlowProjection = [];
    let cumulativeCash = values.initialCash;
    
    for (let month = 1; month <= 12; month++) {
      const monthlyRevenueGrowth = Math.pow(1 + values.revenueGrowthRate / 100, month - 1);
      const monthlyExpenseGrowth = Math.pow(1 + values.expenseGrowthRate / 100, month - 1);
      
      const revenue = values.monthlyRevenue * monthlyRevenueGrowth;
      const expenses = values.monthlyExpenses * monthlyExpenseGrowth;
      const netCashFlow = revenue - expenses;
      
      cumulativeCash += netCashFlow;
      
      cashFlowProjection.push({
        month,
        revenue,
        expenses,
        netCashFlow,
        cumulativeCash
      });
    }

    // Business Health Metrics
    const burnRate = values.monthlyExpenses - values.monthlyRevenue;
    const runwayMonths = burnRate > 0 ? values.initialCash / burnRate : Infinity;
    
    // Calculate business health score (0-100)
    let healthScore = 50; // Base score
    
    // Profitability factors
    if (values.netIncome > 0) healthScore += 20;
    if (netProfitMargin > 10) healthScore += 10;
    if (grossProfitMargin > 40) healthScore += 10;
    
    // Liquidity factors
    if (currentRatio > 1.5) healthScore += 10;
    if (workingCapital > 0) healthScore += 5;
    
    // Growth factors
    if (values.revenueGrowthRate > 0) healthScore += 5;
    if (values.revenueGrowthRate > 15) healthScore += 10;
    
    // Risk factors
    if (debtToEquityRatio > 2) healthScore -= 15;
    if (runwayMonths < 6) healthScore -= 20;
    if (contributionMarginRatio < 30) healthScore -= 10;

    healthScore = Math.max(0, Math.min(100, healthScore));

    // Generate recommendations
    const recommendations = [];
    
    if (contributionMarginRatio < 30) {
      recommendations.push("Consider increasing prices or reducing variable costs to improve contribution margin");
    }
    if (currentRatio < 1) {
      recommendations.push("Improve liquidity by increasing current assets or reducing current liabilities");
    }
    if (runwayMonths < 12) {
      recommendations.push("Focus on improving cash flow or raising additional funding");
    }
    if (debtToEquityRatio > 2) {
      recommendations.push("Consider reducing debt levels to improve financial stability");
    }
    if (netProfitMargin < 5) {
      recommendations.push("Work on improving operational efficiency to increase profitability");
    }
    if (values.revenueGrowthRate < 0) {
      recommendations.push("Develop strategies to increase revenue and market share");
    }

    // Risk Assessment
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    if (healthScore >= 75) riskLevel = 'Low';
    else if (healthScore <= 40) riskLevel = 'High';

    // Profitability Timeline
    const profitabilityTimeline = values.netIncome <= 0 ? 
      Math.ceil(Math.abs(values.netIncome) / Math.max(1, values.monthlyRevenue - values.monthlyExpenses)) : 0;

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
      marginOfSafety,
      currentRatio,
      workingCapital,
      debtToEquityRatio,
      grossProfitMargin,
      netProfitMargin,
      roa,
      roe,
      cashFlowProjection,
      burnRate,
      runwayMonths,
      businessHealthScore: healthScore,
      recommendations,
      riskLevel,
      profitabilityTimeline
    };
  }, [values, isValid]);

  const updateField = useCallback((field: keyof BusinessCalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setValues(prev => ({ ...prev, [field]: numValue }));
  }, []);

  const reset = useCallback(() => {
    setValues({
      fixedCosts: 10000,
      variableCostPerUnit: 15,
      pricePerUnit: 25,
      currentAssets: 50000,
      currentLiabilities: 30000,
      totalDebt: 40000,
      totalEquity: 60000,
      revenue: 120000,
      grossProfit: 80000,
      netIncome: 25000,
      monthlyRevenue: 10000,
      monthlyExpenses: 8000,
      initialCash: 15000,
      revenueGrowthRate: 10,
      expenseGrowthRate: 5
    });
  }, []);

  return {
    values,
    result,
    validation: errors,
    isValid,
    updateField,
    reset,
    errors: errors.errors
  };
}

 
 / /   P a y c h e c k   C a l c u l a t o r   H o o k 
 e x p o r t   i n t e r f a c e   P a y c h e c k V a l u e s   { 
     g r o s s P a y :   s t r i n g ; 
     f i l i n g S t a t u s :   ' s i n g l e '   |   ' m a r r i e d J o i n t '   |   ' m a r r i e d S e p a r a t e '   |   ' h e a d O f H o u s e h o l d ' ; 
     s t a t e :   s t r i n g ; 
     h e a l t h I n s u r a n c e :   s t r i n g ; 
     r e t i r e m e n t 4 0 1 k :   s t r i n g ; 
     a d d i t i o n a l W i t h h o l d i n g :   s t r i n g ; 
     d e p e n d e n t s :   s t r i n g ; 
 } 
 
 e x p o r t   i n t e r f a c e   P a y c h e c k R e s u l t   { 
     g r o s s P a y :   n u m b e r ; 
     f e d e r a l T a x :   n u m b e r ; 
     s t a t e T a x :   n u m b e r ; 
     s o c i a l S e c u r i t y :   n u m b e r ; 
     m e d i c a r e :   n u m b e r ; 
     s t a t e D i s a b i l i t y :   n u m b e r ; 
     h e a l t h I n s u r a n c e :   n u m b e r ; 
     r e t i r e m e n t 4 0 1 k :   n u m b e r ; 
     a d d i t i o n a l W i t h h o l d i n g :   n u m b e r ; 
     t o t a l D e d u c t i o n s :   n u m b e r ; 
     n e t P a y :   n u m b e r ; 
     e f f e c t i v e T a x R a t e :   n u m b e r ; 
     m a r g i n a l T a x R a t e :   n u m b e r ; 
     t a k e H o m e P e r c e n t :   n u m b e r ; 
     m o n t h l y N e t :   n u m b e r ; 
     b i w e e k l y N e t :   n u m b e r ; 
     r e c o m m e n d a t i o n s :   s t r i n g [ ] ; 
 } 
 
 e x p o r t   f u n c t i o n   u s e P a y c h e c k C a l c u l a t o r ( )   { 
     c o n s t   [ v a l u e s ,   s e t V a l u e s ]   =   u s e S t a t e < P a y c h e c k V a l u e s > ( { 
         g r o s s P a y :   ' 5 0 0 0 ' , 
         f i l i n g S t a t u s :   ' s i n g l e ' , 
         s t a t e :   ' C A ' , 
         h e a l t h I n s u r a n c e :   ' 2 0 0 ' , 
         r e t i r e m e n t 4 0 1 k :   ' 6 ' , 
         a d d i t i o n a l W i t h h o l d i n g :   ' 0 ' , 
         d e p e n d e n t s :   ' 0 ' 
     } ) ; 
 
     c o n s t   v a l i d a t i o n   =   u s e M e m o ( ( )   = >   
         v a l i d a t e F i e l d s ( v a l u e s ,   C a l c u l a t o r V a l i d a t i o n s . p a y c h e c k ) , 
         [ v a l u e s ] 
     ) ; 
 
     c o n s t   u p d a t e F i e l d   =   u s e C a l l b a c k ( ( f i e l d :   k e y o f   P a y c h e c k V a l u e s ,   v a l u e :   s t r i n g )   = >   { 
         s e t V a l u e s ( p r e v   = >   ( {   . . . p r e v ,   [ f i e l d ] :   v a l u e   } ) ) ; 
     } ,   [ ] ) ; 
 
     c o n s t   r e s e t   =   u s e C a l l b a c k ( ( )   = >   { 
         s e t V a l u e s ( { 
             g r o s s P a y :   ' 5 0 0 0 ' , 
             f i l i n g S t a t u s :   ' s i n g l e ' , 
             s t a t e :   ' C A ' , 
             h e a l t h I n s u r a n c e :   ' 2 0 0 ' , 
             r e t i r e m e n t 4 0 1 k :   ' 6 ' , 
             a d d i t i o n a l W i t h h o l d i n g :   ' 0 ' , 
             d e p e n d e n t s :   ' 0 ' 
         } ) ; 
     } ,   [ ] ) ; 
 
     c o n s t   f e d e r a l B r a c k e t s   =   u s e M e m o ( ( )   = >   ( { 
         s i n g l e :   [ 
             {   m i n :   0 ,   m a x :   1 1 6 0 0 ,   r a t e :   0 . 1 0   } , 
             {   m i n :   1 1 6 0 0 ,   m a x :   4 7 1 5 0 ,   r a t e :   0 . 1 2   } , 
             {   m i n :   4 7 1 5 0 ,   m a x :   1 0 0 5 2 5 ,   r a t e :   0 . 2 2   } , 
             {   m i n :   1 0 0 5 2 5 ,   m a x :   1 9 1 9 5 0 ,   r a t e :   0 . 2 4   } , 
             {   m i n :   1 9 1 9 5 0 ,   m a x :   2 4 3 7 2 5 ,   r a t e :   0 . 3 2   } , 
             {   m i n :   2 4 3 7 2 5 ,   m a x :   6 0 9 3 5 0 ,   r a t e :   0 . 3 5   } , 
             {   m i n :   6 0 9 3 5 0 ,   m a x :   I n f i n i t y ,   r a t e :   0 . 3 7   } 
         ] , 
         m a r r i e d J o i n t :   [ 
             {   m i n :   0 ,   m a x :   2 3 2 0 0 ,   r a t e :   0 . 1 0   } , 
             {   m i n :   2 3 2 0 0 ,   m a x :   9 4 3 0 0 ,   r a t e :   0 . 1 2   } , 
             {   m i n :   9 4 3 0 0 ,   m a x :   2 0 1 0 5 0 ,   r a t e :   0 . 2 2   } , 
             {   m i n :   2 0 1 0 5 0 ,   m a x :   3 8 3 9 0 0 ,   r a t e :   0 . 2 4   } , 
             {   m i n :   3 8 3 9 0 0 ,   m a x :   4 8 7 4 5 0 ,   r a t e :   0 . 3 2   } , 
             {   m i n :   4 8 7 4 5 0 ,   m a x :   7 3 1 2 0 0 ,   r a t e :   0 . 3 5   } , 
             {   m i n :   7 3 1 2 0 0 ,   m a x :   I n f i n i t y ,   r a t e :   0 . 3 7   } 
         ] , 
         m a r r i e d S e p a r a t e :   [ 
             {   m i n :   0 ,   m a x :   1 1 6 0 0 ,   r a t e :   0 . 1 0   } , 
             {   m i n :   1 1 6 0 0 ,   m a x :   4 7 1 5 0 ,   r a t e :   0 . 1 2   } , 
             {   m i n :   4 7 1 5 0 ,   m a x :   1 0 0 5 2 5 ,   r a t e :   0 . 2 2   } , 
             {   m i n :   1 0 0 5 2 5 ,   m a x :   1 9 1 9 5 0 ,   r a t e :   0 . 2 4   } , 
             {   m i n :   1 9 1 9 5 0 ,   m a x :   2 4 3 7 2 5 ,   r a t e :   0 . 3 2   } , 
             {   m i n :   2 4 3 7 2 5 ,   m a x :   3 6 5 6 0 0 ,   r a t e :   0 . 3 5   } , 
             {   m i n :   3 6 5 6 0 0 ,   m a x :   I n f i n i t y ,   r a t e :   0 . 3 7   } 
         ] , 
         h e a d O f H o u s e h o l d :   [ 
             {   m i n :   0 ,   m a x :   1 6 5 5 0 ,   r a t e :   0 . 1 0   } , 
             {   m i n :   1 6 5 5 0 ,   m a x :   6 3 1 0 0 ,   r a t e :   0 . 1 2   } , 
             {   m i n :   6 3 1 0 0 ,   m a x :   1 0 0 5 0 0 ,   r a t e :   0 . 2 2   } , 
             {   m i n :   1 0 0 5 0 0 ,   m a x :   1 9 1 9 5 0 ,   r a t e :   0 . 2 4   } , 
             {   m i n :   1 9 1 9 5 0 ,   m a x :   2 4 3 7 0 0 ,   r a t e :   0 . 3 2   } , 
             {   m i n :   2 4 3 7 0 0 ,   m a x :   6 0 9 3 5 0 ,   r a t e :   0 . 3 5   } , 
             {   m i n :   6 0 9 3 5 0 ,   m a x :   I n f i n i t y ,   r a t e :   0 . 3 7   } 
         ] 
     } ) ,   [ ] ) ; 
 
     c o n s t   s t a t e T a x R a t e s   =   u s e M e m o ( ( )   = >   ( { 
         ' C A ' :   0 . 0 7 2 5 ,   ' N Y ' :   0 . 0 6 8 5 ,   ' T X ' :   0 ,   ' F L ' :   0 ,   ' W A ' :   0 ,   ' N V ' :   0 ,   ' T N ' :   0 , 
         ' N H ' :   0 ,   ' A K ' :   0 ,   ' S D ' :   0 ,   ' W Y ' :   0 ,   ' I L ' :   0 . 0 4 9 5 ,   ' M I ' :   0 . 0 4 2 5 ,   ' P A ' :   0 . 0 3 0 7 , 
         ' I N ' :   0 . 0 3 2 3 ,   ' O H ' :   0 . 0 4 ,   ' G A ' :   0 . 0 5 7 5 ,   ' N C ' :   0 . 0 5 ,   ' V A ' :   0 . 0 5 7 5 ,   ' C O ' :   0 . 0 4 4 , 
         ' A Z ' :   0 . 0 2 5 ,   ' O R ' :   0 . 0 8 7 5 ,   ' W I ' :   0 . 0 6 2 7 ,   ' M N ' :   0 . 0 7 9 5 ,   ' O t h e r ' :   0 . 0 5 
     } ) ,   [ ] ) ; 
 
     c o n s t   c a l c u l a t e d R e s u l t   =   u s e M e m o ( ( ) :   P a y c h e c k R e s u l t   |   n u l l   = >   { 
         i f   ( ! v a l i d a t i o n . i s V a l i d )   r e t u r n   n u l l ; 
 
         c o n s t   g r o s s M o n t h l y   =   p a r s e F l o a t ( v a l u e s . g r o s s P a y ) ; 
         c o n s t   d e p e n d e n t s C o u n t   =   p a r s e I n t ( v a l u e s . d e p e n d e n t s )   | |   0 ; 
         c o n s t   h e a l t h I n s u r a n c e M o n t h l y   =   p a r s e F l o a t ( v a l u e s . h e a l t h I n s u r a n c e )   | |   0 ; 
         c o n s t   r e t i r e m e n t 4 0 1 k P e r c e n t   =   p a r s e F l o a t ( v a l u e s . r e t i r e m e n t 4 0 1 k )   | |   0 ; 
         c o n s t   a d d i t i o n a l W i t h h o l d i n g   =   p a r s e F l o a t ( v a l u e s . a d d i t i o n a l W i t h h o l d i n g )   | |   0 ; 
 
         c o n s t   r e t i r e m e n t 4 0 1 k M o n t h l y   =   ( g r o s s M o n t h l y   *   r e t i r e m e n t 4 0 1 k P e r c e n t )   /   1 0 0 ; 
         c o n s t   t a x a b l e I n c o m e   =   g r o s s M o n t h l y   -   r e t i r e m e n t 4 0 1 k M o n t h l y   -   h e a l t h I n s u r a n c e M o n t h l y ; 
 
         c o n s t   b r a c k e t s   =   f e d e r a l B r a c k e t s [ v a l u e s . f i l i n g S t a t u s ] ; 
         l e t   f e d e r a l T a x A n n u a l   =   0 ; 
         l e t   r e m a i n i n g I n c o m e   =   t a x a b l e I n c o m e   *   1 2 ; 
 
         f o r   ( c o n s t   b r a c k e t   o f   b r a c k e t s )   { 
             i f   ( r e m a i n i n g I n c o m e   < =   0 )   b r e a k ; 
             c o n s t   t a x a b l e A t B r a c k e t   =   M a t h . m i n ( r e m a i n i n g I n c o m e ,   b r a c k e t . m a x   -   b r a c k e t . m i n ) ; 
             f e d e r a l T a x A n n u a l   + =   t a x a b l e A t B r a c k e t   *   b r a c k e t . r a t e ; 
             r e m a i n i n g I n c o m e   - =   t a x a b l e A t B r a c k e t ; 
         } 
 
         c o n s t   s t a n d a r d D e d u c t i o n   =   v a l u e s . f i l i n g S t a t u s   = = =   ' m a r r i e d J o i n t '   ?   2 9 2 0 0   :   
                                                           v a l u e s . f i l i n g S t a t u s   = = =   ' h e a d O f H o u s e h o l d '   ?   2 1 9 0 0   :   1 4 6 0 0 ; 
         
         c o n s t   a d j u s t e d F e d e r a l T a x   =   M a t h . m a x ( 0 ,   f e d e r a l T a x A n n u a l   -   ( s t a n d a r d D e d u c t i o n   *   0 . 1 2 )   -   ( d e p e n d e n t s C o u n t   *   2 0 0 0   *   0 . 1 2 ) ) ; 
         c o n s t   f e d e r a l T a x M o n t h l y   =   a d j u s t e d F e d e r a l T a x   /   1 2 ; 
 
         c o n s t   s t a t e R a t e   =   s t a t e T a x R a t e s [ v a l u e s . s t a t e   a s   k e y o f   t y p e o f   s t a t e T a x R a t e s ]   | |   s t a t e T a x R a t e s [ ' O t h e r ' ] ; 
         c o n s t   s t a t e T a x M o n t h l y   =   t a x a b l e I n c o m e   *   s t a t e R a t e ; 
 
         c o n s t   s o c i a l S e c u r i t y M o n t h l y   =   M a t h . m i n ( g r o s s M o n t h l y   *   0 . 0 6 2 ,   1 1 7 4 . 8 0 ) ; 
         c o n s t   m e d i c a r e M o n t h l y   =   g r o s s M o n t h l y   *   0 . 0 1 4 5 ; 
         c o n s t   s t a t e D i s a b i l i t y M o n t h l y   =   v a l u e s . s t a t e   = = =   ' C A '   ?   M a t h . m i n ( g r o s s M o n t h l y   *   0 . 0 0 9 ,   1 5 3 . 4 6 )   :   0 ; 
 
         c o n s t   t o t a l D e d u c t i o n s   =   f e d e r a l T a x M o n t h l y   +   s t a t e T a x M o n t h l y   +   s o c i a l S e c u r i t y M o n t h l y   +   
                                                       m e d i c a r e M o n t h l y   +   s t a t e D i s a b i l i t y M o n t h l y   +   h e a l t h I n s u r a n c e M o n t h l y   +   
                                                       r e t i r e m e n t 4 0 1 k M o n t h l y   +   a d d i t i o n a l W i t h h o l d i n g ; 
 
         c o n s t   n e t P a y   =   g r o s s M o n t h l y   -   t o t a l D e d u c t i o n s ; 
         c o n s t   e f f e c t i v e T a x R a t e   =   ( ( f e d e r a l T a x M o n t h l y   +   s t a t e T a x M o n t h l y )   /   g r o s s M o n t h l y )   *   1 0 0 ; 
         c o n s t   t a k e H o m e P e r c e n t   =   ( n e t P a y   /   g r o s s M o n t h l y )   *   1 0 0 ; 
 
         c o n s t   m a r g i n a l F e d e r a l   =   b r a c k e t s . f i n d ( b   = >   ( g r o s s M o n t h l y   *   1 2 )   > =   b . m i n   & &   ( g r o s s M o n t h l y   *   1 2 )   < =   b . m a x ) ? . r a t e   | |   0 ; 
         c o n s t   m a r g i n a l T a x R a t e   =   ( m a r g i n a l F e d e r a l   +   s t a t e R a t e )   *   1 0 0 ; 
 
         c o n s t   r e c o m m e n d a t i o n s :   s t r i n g [ ]   =   [ ] ; 
         
         i f   ( r e t i r e m e n t 4 0 1 k P e r c e n t   <   6 )   { 
             r e c o m m e n d a t i o n s . p u s h ( C o n s i d e r   i n c r e a s i n g   4 0 1 ( k )   t o   a t   l e a s t   6 %   t o   m a x i m i z e   e m p l o y e r   m a t c h ) ; 
         } 
         i f   ( r e t i r e m e n t 4 0 1 k P e r c e n t   >   1 5 )   { 
             r e c o m m e n d a t i o n s . p u s h ( Y o u ' r e   s a v i n g   %   f o r   r e t i r e m e n t   -   e x c e l l e n t ! ) ; 
         } 
         i f   ( e f f e c t i v e T a x R a t e   >   2 5 )   { 
             r e c o m m e n d a t i o n s . p u s h ( H i g h   e f f e c t i v e   t a x   r a t e   -   c o n s i d e r   t a x - a d v a n t a g e d   a c c o u n t s ) ; 
         } 
 
         r e t u r n   { 
             g r o s s P a y :   g r o s s M o n t h l y , 
             f e d e r a l T a x :   f e d e r a l T a x M o n t h l y , 
             s t a t e T a x :   s t a t e T a x M o n t h l y , 
             s o c i a l S e c u r i t y :   s o c i a l S e c u r i t y M o n t h l y , 
             m e d i c a r e :   m e d i c a r e M o n t h l y , 
             s t a t e D i s a b i l i t y :   s t a t e D i s a b i l i t y M o n t h l y , 
             h e a l t h I n s u r a n c e :   h e a l t h I n s u r a n c e M o n t h l y , 
             r e t i r e m e n t 4 0 1 k :   r e t i r e m e n t 4 0 1 k M o n t h l y , 
             a d d i t i o n a l W i t h h o l d i n g , 
             t o t a l D e d u c t i o n s , 
             n e t P a y , 
             e f f e c t i v e T a x R a t e , 
             m a r g i n a l T a x R a t e , 
             t a k e H o m e P e r c e n t , 
             m o n t h l y N e t :   n e t P a y , 
             b i w e e k l y N e t :   n e t P a y   /   2 . 1 6 7 , 
             r e c o m m e n d a t i o n s 
         } ; 
     } ,   [ v a l u e s ,   v a l i d a t i o n . i s V a l i d ,   f e d e r a l B r a c k e t s ,   s t a t e T a x R a t e s ] ) ; 
 
     r e t u r n   { 
         v a l u e s , 
         r e s u l t :   c a l c u l a t e d R e s u l t , 
         v a l i d a t i o n , 
         i s V a l i d :   v a l i d a t i o n . i s V a l i d , 
         u p d a t e F i e l d , 
         r e s e t , 
         e r r o r s :   v a l i d a t i o n . e r r o r s 
     } ; 
 }  
 
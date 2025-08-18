import { useMemo, useCallback, useRef, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import debounce from 'lodash/debounce';
import memoize from 'lodash/memoize';

// Optimization types
interface CacheConfig {
  maxSize?: number;
  ttl?: number;
}

interface MemoConfig {
  maxArgs?: number;
  resolver?: (...args: any[]) => string;
}

// LRU Cache implementation for calculation results
class CalculationCache {
  private cache: Map<string, { value: any; timestamp: number }>;
  private maxSize: number;
  private ttl: number;

  constructor(config: CacheConfig = {}) {
    this.cache = new Map();
    this.maxSize = config.maxSize || 100;
    this.ttl = config.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  get(key: string): any {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Optimized calculation functions
const optimizedCalculations = {
  // Memoized future value calculation
  calculateFutureValue: memoize(
    (principal: number, rate: number, years: number, monthlyContribution = 0) => {
      const monthlyRate = new Decimal(rate).dividedBy(100).dividedBy(12);
      const months = years * 12;
      
      let futureValue = new Decimal(principal);
      if (monthlyRate.equals(0)) {
        return futureValue.plus(new Decimal(monthlyContribution).times(months));
      }

      // Compound interest with monthly contributions
      futureValue = futureValue.times(
        Decimal.pow(monthlyRate.plus(1), months)
      );
      
      if (monthlyContribution > 0) {
        const contributionFactor = Decimal.pow(monthlyRate.plus(1), months)
          .minus(1)
          .dividedBy(monthlyRate);
        futureValue = futureValue.plus(
          new Decimal(monthlyContribution).times(contributionFactor)
        );
      }

      return futureValue.toNumber();
    },
    (...args) => args.join('|')
  ),

  // Memoized loan payment calculation
  calculateLoanPayment: memoize(
    (principal: number, rate: number, years: number) => {
      const monthlyRate = new Decimal(rate).dividedBy(100).dividedBy(12);
      const months = years * 12;

      if (monthlyRate.equals(0)) {
        return new Decimal(principal).dividedBy(months).toNumber();
      }

      const payment = new Decimal(principal)
        .times(monthlyRate)
        .times(Decimal.pow(monthlyRate.plus(1), months))
        .dividedBy(Decimal.pow(monthlyRate.plus(1), months).minus(1));

      return payment.toNumber();
    },
    (...args) => args.join('|')
  ),

  // Optimized array operations for large datasets
  processLargeDataset: (data: any[], operation: (item: any) => any) => {
    const CHUNK_SIZE = 1000;
    const results = [];
    
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      results.push(...chunk.map(operation));
    }

    return results;
  }
};

// Hook for calculator optimizations
export function useCalculatorOptimizations(config: CacheConfig & MemoConfig = {}) {
  const cache = useRef(new CalculationCache(config));
  const calculationQueue = useRef<(() => void)[]>([]);
  const isCalculating = useRef(false);

  // Optimized calculation wrapper
  const optimizeCalculation = useCallback(
    (key: string, calculation: () => any) => {
      const cached = cache.current.get(key);
      if (cached !== undefined) return cached;

      const result = calculation();
      cache.current.set(key, result);
      return result;
    },
    []
  );

  // Debounced calculation processor
  const processCalculationQueue = useCallback(
    debounce(() => {
      if (isCalculating.current || calculationQueue.current.length === 0) return;

      isCalculating.current = true;
      const calculation = calculationQueue.current.shift();
      if (calculation) {
        calculation();
      }
      isCalculating.current = false;

      if (calculationQueue.current.length > 0) {
        processCalculationQueue();
      }
    }, 16),
    []
  );

  // Queue calculation for processing
  const queueCalculation = useCallback((calculation: () => void) => {
    calculationQueue.current.push(calculation);
    processCalculationQueue();
  }, [processCalculationQueue]);

  // Memoized calculation helpers
  const calculationHelpers = useMemo(() => ({
    // Optimized future value calculation
    calculateFutureValue: (
      principal: number,
      rate: number,
      years: number,
      monthlyContribution = 0
    ) => {
      const key = `fv|${principal}|${rate}|${years}|${monthlyContribution}`;
      return optimizeCalculation(key, () =>
        optimizedCalculations.calculateFutureValue(
          principal,
          rate,
          years,
          monthlyContribution
        )
      );
    },

    // Optimized loan payment calculation
    calculateLoanPayment: (
      principal: number,
      rate: number,
      years: number
    ) => {
      const key = `pmt|${principal}|${rate}|${years}`;
      return optimizeCalculation(key, () =>
        optimizedCalculations.calculateLoanPayment(
          principal,
          rate,
          years
        )
      );
    },

    // Optimized batch processing
    processBatch: <T, R>(
      items: T[],
      processor: (item: T) => R,
      batchSize = 1000
    ) => {
      return optimizedCalculations.processLargeDataset(items, processor);
    }
  }), [optimizeCalculation]);

  // Clear cache on unmount
  useEffect(() => {
    return () => {
      cache.current.clear();
      calculationQueue.current = [];
    };
  }, []);

  return {
    ...calculationHelpers,
    queueCalculation,
    clearCache: () => cache.current.clear()
  };
}

// Optimized hooks for specific calculators
export function useInvestmentCalculatorOptimizations() {
  const { calculateFutureValue, processBatch } = useCalculatorOptimizations();

  return useMemo(() => ({
    // Optimized portfolio projection
    calculatePortfolioProjection: (
      initialInvestment: number,
      monthlyContribution: number,
      expectedReturn: number,
      years: number,
      options = { includeMonthly: false }
    ) => {
      const periods = options.includeMonthly ? years * 12 : years;
      const periodRate = options.includeMonthly
        ? expectedReturn / 12 / 100
        : expectedReturn / 100;

      return processBatch(
        Array.from({ length: periods }, (_, i) => i + 1),
        (period) =>
          calculateFutureValue(
            initialInvestment,
            expectedReturn,
            period / (options.includeMonthly ? 12 : 1),
            monthlyContribution
          )
      );
    }
  }), [calculateFutureValue, processBatch]);
}

export function useDebtCalculatorOptimizations() {
  const { calculateLoanPayment, processBatch } = useCalculatorOptimizations();

  return useMemo(() => ({
    // Optimized debt payoff strategy calculation
    calculatePayoffStrategy: (
      debts: Array<{
        balance: number;
        rate: number;
        minimumPayment: number;
      }>,
      extraPayment: number,
      strategy: 'avalanche' | 'snowball'
    ) => {
      // Sort debts based on strategy
      const sortedDebts = [...debts].sort((a, b) =>
        strategy === 'avalanche'
          ? b.rate - a.rate
          : a.balance - b.balance
      );

      return processBatch(sortedDebts, (debt) => {
        const payment = debt === sortedDebts[0]
          ? debt.minimumPayment + extraPayment
          : debt.minimumPayment;

        const months = Math.ceil(
          Math.log(
            payment /
            (payment - debt.balance * (debt.rate / 100 / 12))
          ) / Math.log(1 + debt.rate / 100 / 12)
        );

        return {
          ...debt,
          monthsToPayoff: months,
          totalInterest: payment * months - debt.balance
        };
      });
    }
  }), [calculateLoanPayment, processBatch]);
}

export function useBudgetCalculatorOptimizations() {
  const optimizations = useCalculatorOptimizations();

  return useMemo(() => ({
    // Optimized category aggregation
    calculateCategoryTotals: (
      categories: Array<{
        amount: number;
        type: string;
        frequency: 'monthly' | 'annual';
      }>
    ) => {
      const groupedCategories = categories.reduce((acc, category) => {
        const monthlyAmount = category.frequency === 'annual'
          ? category.amount / 12
          : category.amount;

        acc[category.type] = (acc[category.type] || 0) + monthlyAmount;
        return acc;
      }, {} as Record<string, number>);

      return {
        monthly: groupedCategories,
        annual: Object.entries(groupedCategories).reduce(
          (acc, [type, amount]) => ({
            ...acc,
            [type]: amount * 12
          }),
          {}
        )
      };
    }
  }), [optimizations]);
}

export function useTaxCalculatorOptimizations() {
  const optimizations = useCalculatorOptimizations();

  return useMemo(() => ({
    // Optimized tax bracket calculation
    calculateTaxByBrackets: (
      income: number,
      brackets: Array<{
        rate: number;
        min: number;
        max: number;
      }>
    ) => {
      return optimizations.processBatch(brackets, bracket => {
        const taxableInBracket = Math.min(
          Math.max(0, income - bracket.min),
          bracket.max - bracket.min
        );
        return (taxableInBracket * bracket.rate) / 100;
      }).reduce((sum, tax) => sum + tax, 0);
    }
  }), [optimizations]);
}

export function useRetirementCalculatorOptimizations() {
  const { calculateFutureValue, processBatch } = useCalculatorOptimizations();

  return useMemo(() => ({
    // Optimized retirement projection
    calculateRetirementProjection: (
      currentAge: number,
      retirementAge: number,
      lifeExpectancy: number,
      currentSavings: number,
      monthlyContribution: number,
      expectedReturn: number,
      inflationRate: number
    ) => {
      const yearsToRetirement = retirementAge - currentAge;
      const yearsInRetirement = lifeExpectancy - retirementAge;

      // Calculate accumulation phase
      const accumulationPhase = processBatch(
        Array.from({ length: yearsToRetirement }, (_, i) => i + 1),
        (year) => ({
          age: currentAge + year,
          balance: calculateFutureValue(
            currentSavings,
            expectedReturn,
            year,
            monthlyContribution
          ),
          phase: 'accumulation' as const
        })
      );

      // Calculate distribution phase
      const retirementBalance = accumulationPhase[accumulationPhase.length - 1].balance;
      const distributionPhase = processBatch(
        Array.from({ length: yearsInRetirement }, (_, i) => i + 1),
        (year) => ({
          age: retirementAge + year,
          balance: calculateFutureValue(
            retirementBalance,
            expectedReturn - inflationRate,
            year,
            -monthlyContribution * 12
          ),
          phase: 'distribution' as const
        })
      );

      return [...accumulationPhase, ...distributionPhase];
    }
  }), [calculateFutureValue, processBatch]);
}

export function useMortgageCalculatorOptimizations() {
  const { calculateLoanPayment, processBatch } = useCalculatorOptimizations();

  return useMemo(() => ({
    // Optimized amortization schedule calculation
    calculateAmortizationSchedule: (
      principal: number,
      rate: number,
      years: number,
      extraPayment = 0
    ) => {
      const monthlyPayment = calculateLoanPayment(principal, rate, years);
      const monthlyRate = rate / 100 / 12;
      const totalMonths = years * 12;

      return processBatch(
        Array.from({ length: totalMonths }, (_, i) => i + 1),
        (month) => {
          const totalPayment = monthlyPayment + extraPayment;
          const interestPayment = principal * monthlyRate;
          const principalPayment = Math.min(
            totalPayment - interestPayment,
            principal
          );

          principal -= principalPayment;

          return {
            month,
            payment: totalPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: principal,
            totalInterest: interestPayment
          };
        }
      );
    }
  }), [calculateLoanPayment, processBatch]);
}


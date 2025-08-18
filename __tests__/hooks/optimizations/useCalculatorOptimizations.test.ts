import { renderHook, act } from '@testing-library/react';
import { useCalculatorOptimizations, 
  useInvestmentCalculatorOptimizations,
  useDebtCalculatorOptimizations,
  useBudgetCalculatorOptimizations,
  useTaxCalculatorOptimizations,
  useRetirementCalculatorOptimizations,
  useMortgageCalculatorOptimizations
} from '@/lib/hooks/optimizations/useCalculatorOptimizations';

// Mock performance.now() for consistent timing tests
const mockNow = jest.spyOn(performance, 'now');
let nowValue = 0;
mockNow.mockImplementation(() => nowValue);

describe('Calculator Optimizations', () => {
  beforeEach(() => {
    nowValue = 0;
    jest.clearAllMocks();
  });

  describe('Base Calculator Optimizations', () => {
    it('should cache calculation results', () => {
      const { result } = renderHook(() => useCalculatorOptimizations());
      
      // First calculation
      act(() => {
        result.current.calculateFutureValue(10000, 7, 10);
      });
      
      // Second calculation with same parameters
      nowValue = 1000; // Advance time
      act(() => {
        result.current.calculateFutureValue(10000, 7, 10);
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Second calculation should be faster due to caching
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeLessThan(1);
    });

    it('should handle cache expiration', () => {
      const { result } = renderHook(() => 
        useCalculatorOptimizations({ ttl: 1000 })
      );
      
      // First calculation
      act(() => {
        result.current.calculateFutureValue(10000, 7, 10);
      });
      
      // Advance time beyond TTL
      nowValue = 2000;
      
      // Second calculation should recalculate
      act(() => {
        result.current.calculateFutureValue(10000, 7, 10);
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Second calculation should take longer due to cache miss
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeGreaterThan(1);
    });

    it('should process large datasets in chunks', () => {
      const { result } = renderHook(() => useCalculatorOptimizations());
      const largeDataset = Array.from({ length: 10000 }, (_, i) => i);
      
      act(() => {
        result.current.processBatch(largeDataset, x => x * 2);
      });

      // Should process in chunks without blocking
      expect(mockNow).toHaveBeenCalledTimes(1);
      expect(mockNow.mock.results[0].value).toBeLessThan(16); // Under 16ms
    });

    it('should queue calculations effectively', async () => {
      const { result } = renderHook(() => useCalculatorOptimizations());
      const calculations = Array.from({ length: 10 }, (_, i) => i);
      
      await act(async () => {
        calculations.forEach(i => {
          result.current.queueCalculation(() => i * 2);
        });
      });

      // Should process queue without blocking
      expect(mockNow).toHaveBeenCalledTimes(10);
      expect(mockNow.mock.results[9].value - mockNow.mock.results[0].value)
        .toBeLessThan(16 * 10); // Under 16ms per calculation
    });
  });

  describe('Investment Calculator Optimizations', () => {
    it('should optimize portfolio projections', () => {
      const { result } = renderHook(() => useInvestmentCalculatorOptimizations());
      
      act(() => {
        result.current.calculatePortfolioProjection(
          100000, // initialInvestment
          1000,   // monthlyContribution
          7,      // expectedReturn
          30      // years
        );
      });

      // Should calculate efficiently
      expect(mockNow).toHaveBeenCalledTimes(1);
      expect(mockNow.mock.results[0].value).toBeLessThan(16);
    });

    it('should cache complex scenarios', () => {
      const { result } = renderHook(() => useInvestmentCalculatorOptimizations());
      
      // First calculation
      act(() => {
        result.current.calculatePortfolioProjection(
          100000,
          1000,
          7,
          30,
          { includeMonthly: true }
        );
      });
      
      // Second calculation with same parameters
      nowValue = 1000;
      act(() => {
        result.current.calculatePortfolioProjection(
          100000,
          1000,
          7,
          30,
          { includeMonthly: true }
        );
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Second calculation should be faster
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeLessThan(1);
    });
  });

  describe('Debt Calculator Optimizations', () => {
    it('should optimize payoff strategy calculations', () => {
      const { result } = renderHook(() => useDebtCalculatorOptimizations());
      const debts = [
        { balance: 10000, rate: 18, minimumPayment: 200 },
        { balance: 5000, rate: 22, minimumPayment: 150 },
        { balance: 15000, rate: 15, minimumPayment: 300 }
      ];
      
      act(() => {
        result.current.calculatePayoffStrategy(debts, 500, 'avalanche');
      });

      // Should calculate efficiently
      expect(mockNow).toHaveBeenCalledTimes(1);
      expect(mockNow.mock.results[0].value).toBeLessThan(16);
    });

    it('should cache strategy comparisons', () => {
      const { result } = renderHook(() => useDebtCalculatorOptimizations());
      const debts = [
        { balance: 10000, rate: 18, minimumPayment: 200 },
        { balance: 5000, rate: 22, minimumPayment: 150 }
      ];
      
      // Compare strategies
      act(() => {
        result.current.calculatePayoffStrategy(debts, 500, 'avalanche');
        result.current.calculatePayoffStrategy(debts, 500, 'snowball');
      });
      
      // Compare again
      nowValue = 1000;
      act(() => {
        result.current.calculatePayoffStrategy(debts, 500, 'avalanche');
        result.current.calculatePayoffStrategy(debts, 500, 'snowball');
      });

      expect(mockNow).toHaveBeenCalledTimes(4);
      // Second comparison should be faster
      expect(mockNow.mock.results[3].value - mockNow.mock.results[2].value)
        .toBeLessThan(mockNow.mock.results[1].value - mockNow.mock.results[0].value);
    });
  });

  describe('Budget Calculator Optimizations', () => {
    it('should optimize category aggregation', () => {
      const { result } = renderHook(() => useBudgetCalculatorOptimizations());
      const categories = Array.from({ length: 100 }, (_, i) => ({
        amount: 100,
        type: ['essential', 'discretionary', 'savings'][i % 3],
        frequency: ['monthly', 'annual'][i % 2]
      }));
      
      act(() => {
        result.current.calculateCategoryTotals(categories);
      });

      // Should aggregate efficiently
      expect(mockNow).toHaveBeenCalledTimes(1);
      expect(mockNow.mock.results[0].value).toBeLessThan(16);
    });

    it('should cache category calculations', () => {
      const { result } = renderHook(() => useBudgetCalculatorOptimizations());
      const categories = [
        { amount: 1000, type: 'essential', frequency: 'monthly' },
        { amount: 500, type: 'discretionary', frequency: 'monthly' }
      ];
      
      // First calculation
      act(() => {
        result.current.calculateCategoryTotals(categories);
      });
      
      // Second calculation
      nowValue = 1000;
      act(() => {
        result.current.calculateCategoryTotals(categories);
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Second calculation should be faster
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeLessThan(1);
    });
  });

  describe('Tax Calculator Optimizations', () => {
    it('should optimize tax bracket calculations', () => {
      const { result } = renderHook(() => useTaxCalculatorOptimizations());
      const brackets = [
        { rate: 10, min: 0, max: 10000 },
        { rate: 12, min: 10000, max: 40000 },
        { rate: 22, min: 40000, max: 85000 },
        { rate: 24, min: 85000, max: 165000 }
      ];
      
      act(() => {
        result.current.calculateTaxByBrackets(75000, brackets);
      });

      // Should calculate efficiently
      expect(mockNow).toHaveBeenCalledTimes(1);
      expect(mockNow.mock.results[0].value).toBeLessThan(16);
    });

    it('should cache tax calculations', () => {
      const { result } = renderHook(() => useTaxCalculatorOptimizations());
      const brackets = [
        { rate: 10, min: 0, max: 10000 },
        { rate: 12, min: 10000, max: 40000 }
      ];
      
      // First calculation
      act(() => {
        result.current.calculateTaxByBrackets(35000, brackets);
      });
      
      // Second calculation
      nowValue = 1000;
      act(() => {
        result.current.calculateTaxByBrackets(35000, brackets);
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Second calculation should be faster
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeLessThan(1);
    });
  });

  describe('Retirement Calculator Optimizations', () => {
    it('should optimize retirement projections', () => {
      const { result } = renderHook(() => useRetirementCalculatorOptimizations());
      
      act(() => {
        result.current.calculateRetirementProjection(
          35,    // currentAge
          65,    // retirementAge
          90,    // lifeExpectancy
          100000, // currentSavings
          1000,   // monthlyContribution
          7,      // expectedReturn
          2.5     // inflationRate
        );
      });

      // Should calculate efficiently
      expect(mockNow).toHaveBeenCalledTimes(1);
      expect(mockNow.mock.results[0].value).toBeLessThan(16);
    });

    it('should cache retirement scenarios', () => {
      const { result } = renderHook(() => useRetirementCalculatorOptimizations());
      
      // First calculation
      act(() => {
        result.current.calculateRetirementProjection(
          35, 65, 90, 100000, 1000, 7, 2.5
        );
      });
      
      // Second calculation
      nowValue = 1000;
      act(() => {
        result.current.calculateRetirementProjection(
          35, 65, 90, 100000, 1000, 7, 2.5
        );
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Second calculation should be faster
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeLessThan(1);
    });
  });

  describe('Mortgage Calculator Optimizations', () => {
    it('should optimize amortization schedule calculations', () => {
      const { result } = renderHook(() => useMortgageCalculatorOptimizations());
      
      act(() => {
        result.current.calculateAmortizationSchedule(
          300000, // principal
          4,      // rate
          30,     // years
          100     // extraPayment
        );
      });

      // Should calculate efficiently
      expect(mockNow).toHaveBeenCalledTimes(1);
      expect(mockNow.mock.results[0].value).toBeLessThan(16);
    });

    it('should cache amortization schedules', () => {
      const { result } = renderHook(() => useMortgageCalculatorOptimizations());
      
      // First calculation
      act(() => {
        result.current.calculateAmortizationSchedule(300000, 4, 30, 100);
      });
      
      // Second calculation
      nowValue = 1000;
      act(() => {
        result.current.calculateAmortizationSchedule(300000, 4, 30, 100);
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Second calculation should be faster
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeLessThan(1);
    });
  });

  describe('Memory Management', () => {
    it('should limit cache size', () => {
      const { result } = renderHook(() => 
        useCalculatorOptimizations({ maxSize: 2 })
      );
      
      // Fill cache
      act(() => {
        result.current.calculateFutureValue(10000, 7, 10);
        result.current.calculateFutureValue(20000, 7, 10);
        result.current.calculateFutureValue(30000, 7, 10);
      });

      // First calculation should be evicted
      nowValue = 1000;
      act(() => {
        result.current.calculateFutureValue(10000, 7, 10);
      });

      expect(mockNow).toHaveBeenCalledTimes(4);
      // Should recalculate first value
      expect(mockNow.mock.results[3].value - mockNow.mock.results[2].value)
        .toBeGreaterThan(1);
    });

    it('should clean up resources on unmount', () => {
      const { result, unmount } = renderHook(() => useCalculatorOptimizations());
      
      act(() => {
        result.current.calculateFutureValue(10000, 7, 10);
      });
      
      unmount();
      
      // Cache should be cleared
      nowValue = 1000;
      const { result: newResult } = renderHook(() => useCalculatorOptimizations());
      act(() => {
        newResult.current.calculateFutureValue(10000, 7, 10);
      });

      expect(mockNow).toHaveBeenCalledTimes(2);
      // Should recalculate
      expect(mockNow.mock.results[1].value - mockNow.mock.results[0].value)
        .toBeGreaterThan(1);
    });
  });
});


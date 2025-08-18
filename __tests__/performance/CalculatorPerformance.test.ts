import { renderHook, act } from '@testing-library/react';
import { useBudgetCalculator } from '@/lib/hooks/calculators/useBudgetCalculator';
import { useDebtCalculator } from '@/lib/hooks/calculators/useDebtCalculator';
import { useInvestmentCalculator } from '@/lib/hooks/calculators/useInvestmentCalculator';
import { useTaxCalculator } from '@/lib/hooks/calculators/useTaxCalculator';
import { useRetirementCalculator } from '@/lib/hooks/calculators/useRetirementCalculator';
import { useMortgageCalculator } from '@/lib/hooks/calculators/useMortgageCalculator';

// Performance thresholds
const THRESHOLDS = {
  CALCULATION_TIME: 100, // ms
  MEMORY_INCREASE: 1024 * 1024, // 1MB
  RENDER_TIME: 50, // ms
  UPDATE_TIME: 16, // ms (targeting 60fps)
  BATCH_UPDATE_TIME: 100 // ms
};

// Test data generators
function generateLargeDataset(size: number) {
  return Array.from({ length: size }, (_, i) => ({
    name: `Item ${i}`,
    amount: Math.random() * 10000,
    type: ['essential', 'discretionary', 'savings'][i % 3],
    frequency: ['monthly', 'annual'][i % 2]
  }));
}

function generateRapidUpdates(count: number) {
  return Array.from({ length: count }, () => ({
    field: ['amount', 'rate', 'term'][Math.floor(Math.random() * 3)],
    value: Math.random() * 1000
  }));
}

describe('Calculator Performance', () => {
  describe('Calculation Performance', () => {
    it('should perform complex calculations within time threshold', () => {
      const { result } = renderHook(() => useInvestmentCalculator());
      
      const start = performance.now();
      act(() => {
        result.current.updateField('initialInvestment', 100000);
        result.current.updateField('monthlyContribution', 1000);
        result.current.updateField('expectedReturn', 7);
        result.current.updateField('years', 30);
        result.current.updateField('inflationRate', 2.5);
        result.current.updateField('fees', 0.5);
        result.current.updateField('taxRate', 25);
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(THRESHOLDS.CALCULATION_TIME);
    });

    it('should handle large datasets efficiently', () => {
      const { result } = renderHook(() => useBudgetCalculator());
      const largeDataset = generateLargeDataset(100);

      const start = performance.now();
      act(() => {
        result.current.updateField('categories', largeDataset);
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(THRESHOLDS.CALCULATION_TIME);
    });

    it('should maintain performance with compound calculations', () => {
      const { result: debtResult } = renderHook(() => useDebtCalculator());
      const { result: taxResult } = renderHook(() => useTaxCalculator());

      const start = performance.now();
      act(() => {
        // Update debt calculator
        debtResult.current.updateField('debts', [
          {
            name: 'Mortgage',
            balance: 300000,
            interestRate: 4,
            minimumPayment: 1500,
            type: 'mortgage',
            isDeductible: true
          },
          {
            name: 'Car Loan',
            balance: 25000,
            interestRate: 5,
            minimumPayment: 400,
            type: 'auto_loan',
            isDeductible: false
          }
        ]);

        // Update tax calculator with debt info
        const debtInfo = debtResult.current.result;
        taxResult.current.updateField('itemizedDeductions', 
          debtInfo?.summary.taxDeductibleInterest || 0
        );
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(THRESHOLDS.CALCULATION_TIME);
    });
  });

  describe('Memory Usage', () => {
    it('should maintain stable memory usage during calculations', () => {
      const { result } = renderHook(() => useRetirementCalculator());
      
      const before = process.memoryUsage();
      act(() => {
        // Perform multiple calculations
        for (let i = 0; i < 100; i++) {
          result.current.updateField('currentAge', 30 + i);
          result.current.updateField('retirementAge', 65 + i);
          result.current.updateField('currentSavings', 100000 + i * 1000);
        }
      });
      const after = process.memoryUsage();

      expect(after.heapUsed - before.heapUsed)
        .toBeLessThan(THRESHOLDS.MEMORY_INCREASE);
    });

    it('should clean up resources after large operations', () => {
      const { result, unmount } = renderHook(() => useMortgageCalculator());
      
      const before = process.memoryUsage();
      act(() => {
        // Generate and process large amortization schedule
        result.current.updateField('loanAmount', 1000000);
        result.current.updateField('interestRate', 4);
        result.current.updateField('loanTerm', 30);
      });
      unmount();
      const after = process.memoryUsage();

      expect(after.heapUsed - before.heapUsed)
        .toBeLessThan(THRESHOLDS.MEMORY_INCREASE);
    });
  });

  describe('Update Performance', () => {
    it('should handle rapid updates efficiently', () => {
      const { result } = renderHook(() => useInvestmentCalculator());
      const updates = generateRapidUpdates(50);
      
      const start = performance.now();
      act(() => {
        updates.forEach(update => {
          result.current.updateField(update.field as any, update.value);
        });
      });
      const end = performance.now();

      const averageUpdateTime = (end - start) / updates.length;
      expect(averageUpdateTime).toBeLessThan(THRESHOLDS.UPDATE_TIME);
    });

    it('should batch updates effectively', () => {
      const { result } = renderHook(() => useBudgetCalculator());
      const categories = generateLargeDataset(20);
      
      const start = performance.now();
      act(() => {
        result.current.updateField('monthlyIncome', 10000);
        result.current.updateField('categories', categories);
        result.current.updateField('savingsGoal', 50000);
        result.current.updateField('emergencyFundTarget', 30000);
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(THRESHOLDS.BATCH_UPDATE_TIME);
    });
  });

  describe('Chart Performance', () => {
    it('should generate large datasets for charts efficiently', () => {
      const { result } = renderHook(() => useInvestmentCalculator());
      
      const start = performance.now();
      act(() => {
        result.current.updateField('initialInvestment', 100000);
        result.current.updateField('monthlyContribution', 1000);
        result.current.updateField('expectedReturn', 7);
        result.current.updateField('years', 40); // Long projection
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(THRESHOLDS.CALCULATION_TIME);
      expect(result.current.result?.projectedReturns.length).toBe(40 * 12); // Monthly data points
    });

    it('should handle multiple chart updates efficiently', () => {
      const { result } = renderHook(() => useDebtCalculator());
      const updates = generateRapidUpdates(20);
      
      const start = performance.now();
      act(() => {
        updates.forEach(update => {
          result.current.updateField(update.field as any, update.value);
        });
      });
      const end = performance.now();

      const averageUpdateTime = (end - start) / updates.length;
      expect(averageUpdateTime).toBeLessThan(THRESHOLDS.UPDATE_TIME);
    });
  });

  describe('Cross-Calculator Performance', () => {
    it('should maintain performance with multiple active calculators', () => {
      const hooks = [
        useInvestmentCalculator,
        useRetirementCalculator,
        useTaxCalculator,
        useBudgetCalculator,
        useDebtCalculator,
        useMortgageCalculator
      ];

      const instances = hooks.map(hook => renderHook(hook));
      const updates = generateRapidUpdates(10);
      
      const start = performance.now();
      instances.forEach(({ result }) => {
        act(() => {
          updates.forEach(update => {
            result.current.updateField(update.field as any, update.value);
          });
        });
      });
      const end = performance.now();

      const averageTime = (end - start) / (instances.length * updates.length);
      expect(averageTime).toBeLessThan(THRESHOLDS.UPDATE_TIME);
    });

    it('should handle concurrent calculator updates efficiently', async () => {
      const { result: budget } = renderHook(() => useBudgetCalculator());
      const { result: investment } = renderHook(() => useInvestmentCalculator());
      const { result: retirement } = renderHook(() => useRetirementCalculator());

      const start = performance.now();
      await act(async () => {
        // Simulate concurrent updates
        await Promise.all([
          budget.current.updateField('monthlyIncome', 10000),
          investment.current.updateField('monthlyContribution', 2000),
          retirement.current.updateField('currentSavings', 100000)
        ]);
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(THRESHOLDS.BATCH_UPDATE_TIME);
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle extreme input values efficiently', () => {
      const { result } = renderHook(() => useInvestmentCalculator());
      
      const start = performance.now();
      act(() => {
        result.current.updateField('initialInvestment', Number.MAX_SAFE_INTEGER);
        result.current.updateField('monthlyContribution', Number.MAX_SAFE_INTEGER);
        result.current.updateField('expectedReturn', 100);
        result.current.updateField('years', 100);
      });
      const end = performance.now();

      expect(end - start).toBeLessThan(THRESHOLDS.CALCULATION_TIME);
    });

    it('should maintain performance with rapid validation errors', () => {
      const { result } = renderHook(() => useMortgageCalculator());
      const invalidUpdates = Array.from({ length: 50 }, () => ({
        field: ['loanAmount', 'interestRate', 'loanTerm'][
          Math.floor(Math.random() * 3)
        ],
        value: -Math.random() * 1000 // Invalid negative values
      }));
      
      const start = performance.now();
      act(() => {
        invalidUpdates.forEach(update => {
          result.current.updateField(update.field as any, update.value);
        });
      });
      const end = performance.now();

      const averageTime = (end - start) / invalidUpdates.length;
      expect(averageTime).toBeLessThan(THRESHOLDS.UPDATE_TIME);
    });
  });
});


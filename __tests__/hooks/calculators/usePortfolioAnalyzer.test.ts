import { renderHook, act } from '@testing-library/react';
import { usePortfolioAnalyzer } from '@/lib/hooks/calculators/usePortfolioAnalyzer';
import { runCommonCalculatorTests } from '@/lib/utils/calculatorTestUtils';

// Mock progressStore
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('usePortfolioAnalyzer', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: usePortfolioAnalyzer,
    validInputs: {
      totalValue: 100000,
      cashAllocation: 5,
      bondAllocation: 30,
      stockAllocation: 50,
      realEstateAllocation: 10,
      alternativeAllocation: 5,
      riskTolerance: 'moderate',
      investmentTimeframe: 10,
      incomeRequirement: 4,
      averageExpenseRatio: 0.25,
      rebalanceFrequency: 'annually',
      taxBracket: 25,
      expectedInflation: 2.5,
      expectedVolatility: 15
    },
    invalidInputs: {
      totalValue: -1000,
      cashAllocation: -5,
      bondAllocation: 150,
      stockAllocation: -10,
      realEstateAllocation: 101,
      alternativeAllocation: -1,
      investmentTimeframe: 0,
      incomeRequirement: -1,
      averageExpenseRatio: -0.1,
      taxBracket: -5,
      expectedInflation: -1,
      expectedVolatility: -5
    },
    expectedResults: {
      totalAllocation: 100,
      effectiveExpenseRatio: 0.2125,
      diversificationScore: 85
    },
    fieldValidations: {
      totalValue: [
        { value: 100000, error: null },
        { value: 500, error: 'Value must be at least 1000' },
        { value: 2000000000, error: 'Value must be no more than 1000000000' }
      ],
      stockAllocation: [
        { value: 50, error: null },
        { value: -10, error: 'Value must be between 0 and 100' },
        { value: 150, error: 'Value must be between 0 and 100' }
      ],
      averageExpenseRatio: [
        { value: 0.25, error: null },
        { value: -0.1, error: 'Value must be at least 0' },
        { value: 5, error: 'Value must be no more than 3' }
      ]
    }
  });

  describe('Portfolio Analysis', () => {
    it('should calculate projected returns based on risk tolerance', () => {
      const { result } = renderHook(() => usePortfolioAnalyzer());
      const testCases = [
        { riskTolerance: 'conservative', expectedMultiplier: 0.8 },
        { riskTolerance: 'moderate', expectedMultiplier: 1.0 },
        { riskTolerance: 'aggressive', expectedMultiplier: 1.2 }
      ];

      for (const { riskTolerance, expectedMultiplier } of testCases) {
        act(() => {
          result.current[1].updateField('riskTolerance', riskTolerance);
        });

        const baseReturn = result.current[0].result?.projectedReturns.expected;
        const conservativeReturn = result.current[0].result?.projectedReturns.conservative;
        const optimisticReturn = result.current[0].result?.projectedReturns.optimistic;

        expect(baseReturn).toBeDefined();
        expect(conservativeReturn).toBeDefined();
        expect(optimisticReturn).toBeDefined();

        if (baseReturn && conservativeReturn && optimisticReturn) {
          expect(conservativeReturn).toBeLessThan(baseReturn);
          expect(optimisticReturn).toBeGreaterThan(baseReturn);
          expect(baseReturn).toBeCloseTo(6 * expectedMultiplier, 1);
        }
      }
    });

    it('should calculate risk metrics correctly', () => {
      const { result } = renderHook(() => usePortfolioAnalyzer());
      
      act(() => {
        result.current[1].updateField('stockAllocation', 60);
        result.current[1].updateField('alternativeAllocation', 10);
        result.current[1].updateField('expectedVolatility', 20);
      });

      const riskMetrics = result.current[0].result?.riskMetrics;
      expect(riskMetrics).toBeDefined();

      if (riskMetrics) {
        // Volatility should be weighted by stock and alternative allocations
        expect(riskMetrics.volatility).toBeCloseTo(14, 1); // (60 + 10) * 20 / 100

        // Sharpe ratio should be positive for expected return > risk-free rate
        expect(riskMetrics.sharpeRatio).toBeGreaterThan(0);

        // Max drawdown should be related to volatility
        expect(riskMetrics.maxDrawdown).toBeCloseTo(riskMetrics.volatility * 1.5, 1);
      }
    });

    it('should identify rebalancing needs correctly', () => {
      const { result } = renderHook(() => usePortfolioAnalyzer());
      
      // Test with allocations significantly different from targets
      act(() => {
        result.current[1].updateField('stockAllocation', 70); // 20% over moderate target
        result.current[1].updateField('bondAllocation', 10); // 20% under moderate target
      });

      const analysis = result.current[0].result;
      expect(analysis?.rebalancingNeeded).toBe(true);
      expect(analysis?.suggestedChanges).toContainEqual(
        expect.objectContaining({
          assetClass: 'Stocks',
          action: 'decrease'
        })
      );
      expect(analysis?.suggestedChanges).toContainEqual(
        expect.objectContaining({
          assetClass: 'Bonds',
          action: 'increase'
        })
      );
    });

    it('should generate appropriate insights', () => {
      const { result } = renderHook(() => usePortfolioAnalyzer());
      
      // Test high expense ratio warning
      act(() => {
        result.current[1].updateField('averageExpenseRatio', 0.75);
      });
      expect(result.current[0].result?.insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('expense')
        })
      );

      // Test time horizon mismatch warning
      act(() => {
        result.current[1].updateField('riskTolerance', 'aggressive');
        result.current[1].updateField('investmentTimeframe', 3);
      });
      expect(result.current[0].result?.insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('time horizon')
        })
      );
    });

    it('should calculate diversification score correctly', () => {
      const { result } = renderHook(() => usePortfolioAnalyzer());
      
      // Test well-diversified portfolio
      act(() => {
        result.current[1].setValues({
          cashAllocation: 5,
          bondAllocation: 30,
          stockAllocation: 40,
          realEstateAllocation: 15,
          alternativeAllocation: 10
        });
      });
      expect(result.current[0].result?.diversificationScore).toBeGreaterThan(80);

      // Test poorly diversified portfolio
      act(() => {
        result.current[1].setValues({
          cashAllocation: 0,
          bondAllocation: 0,
          stockAllocation: 90,
          realEstateAllocation: 10,
          alternativeAllocation: 0
        });
      });
      expect(result.current[0].result?.diversificationScore).toBeLessThan(50);
    });
  });
});


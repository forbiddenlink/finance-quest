import { renderHook, act } from '@testing-library/react';
import { performance } from 'perf_hooks';
import {
  CalculatorProvider,
  useCalculatorActions,
  useCalculatorState
} from '@/lib/context/CalculatorContext';
import { useInvestmentCalculator } from '@/lib/hooks/calculators/useInvestmentCalculator';
import { useRetirementCalculator } from '@/lib/hooks/calculators/useRetirementCalculator';
import { useMortgageCalculator } from '@/lib/hooks/calculators/useMortgageCalculator';
import { usePortfolioAnalyzer } from '@/lib/hooks/calculators/usePortfolioAnalyzer';
import { useRealEstateComparisonTool } from '@/lib/hooks/calculators/useRealEstateComparisonTool';

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorProvider>
      {children}
    </CalculatorProvider>
  );
}

// Benchmark utilities
interface BenchmarkResult {
  mean: number;
  min: number;
  max: number;
  stdDev: number;
  samples: number[];
}

function calculateStats(samples: number[]): BenchmarkResult {
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const squaredDiffs = samples.map(x => Math.pow(x - mean, 2));
  const stdDev = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / samples.length);

  return {
    mean,
    min: Math.min(...samples),
    max: Math.max(...samples),
    stdDev,
    samples
  };
}

async function measureExecutionTime(fn: () => Promise<void>, iterations: number = 10): Promise<BenchmarkResult> {
  const samples: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    samples.push(end - start);
  }

  return calculateStats(samples);
}

// Memory usage measurement
function getMemoryUsage(): number {
  if (global.gc) {
    global.gc(); // Force garbage collection if available
  }
  const usage = process.memoryUsage();
  return usage.heapUsed / 1024 / 1024; // Convert to MB
}

describe('Calculator Performance Benchmarks', () => {
  const PERFORMANCE_THRESHOLDS = {
    CALCULATION_TIME: 100, // ms
    MEMORY_INCREASE: 5, // MB
    STATE_UPDATE_TIME: 50, // ms
    RENDER_TIME: 16.67, // ms (60fps)
  };

  describe('Calculation Performance', () => {
    it('investment calculator handles large portfolios efficiently', async () => {
      const { result } = renderHook(() => useInvestmentCalculator(), {
        wrapper: TestWrapper
      });

      const benchmarkResult = await measureExecutionTime(async () => {
        act(() => {
          result.current.setValues({
            initialInvestment: 1000000,
            monthlyContribution: 5000,
            annualReturn: 8,
            investmentPeriod: 30,
            rebalanceFrequency: 'quarterly',
            includeDividends: true,
            reinvestDividends: true,
            includeInflation: true,
            includeTaxes: true
          });
        });

        await act(async () => {
          await result.current.calculate();
        });
      });

      expect(benchmarkResult.mean).toBeLessThan(PERFORMANCE_THRESHOLDS.CALCULATION_TIME);
      expect(benchmarkResult.stdDev).toBeLessThan(PERFORMANCE_THRESHOLDS.CALCULATION_TIME * 0.1);
    });

    it('retirement calculator handles complex scenarios efficiently', async () => {
      const { result } = renderHook(() => useRetirementCalculator(), {
        wrapper: TestWrapper
      });

      const benchmarkResult = await measureExecutionTime(async () => {
        act(() => {
          result.current.setValues({
            currentAge: 30,
            retirementAge: 65,
            lifeExpectancy: 90,
            currentSavings: 100000,
            monthlyContribution: 2000,
            expectedReturnPreRetirement: 8,
            expectedReturnPostRetirement: 4,
            desiredRetirementIncome: 80000,
            socialSecurityIncome: 2000,
            includePension: true,
            pensionAmount: 1500,
            includeInflation: true,
            inflationRate: 2.5
          });
        });

        await act(async () => {
          await result.current.calculate();
        });
      });

      expect(benchmarkResult.mean).toBeLessThan(PERFORMANCE_THRESHOLDS.CALCULATION_TIME);
      expect(benchmarkResult.stdDev).toBeLessThan(PERFORMANCE_THRESHOLDS.CALCULATION_TIME * 0.1);
    });

    it('portfolio analyzer handles diverse asset allocation efficiently', async () => {
      const { result } = renderHook(() => usePortfolioAnalyzer(), {
        wrapper: TestWrapper
      });

      const benchmarkResult = await measureExecutionTime(async () => {
        act(() => {
          result.current.setValues({
            portfolioValue: 1000000,
            assets: [
              { type: 'stock', allocation: 40, expectedReturn: 8, risk: 'high' },
              { type: 'bond', allocation: 30, expectedReturn: 4, risk: 'medium' },
              { type: 'realestate', allocation: 20, expectedReturn: 6, risk: 'medium' },
              { type: 'commodity', allocation: 10, expectedReturn: 5, risk: 'high' }
            ],
            rebalanceFrequency: 'quarterly',
            riskTolerance: 'moderate',
            investmentTimeframe: 20
          });
        });

        await act(async () => {
          await result.current.calculate();
        });
      });

      expect(benchmarkResult.mean).toBeLessThan(PERFORMANCE_THRESHOLDS.CALCULATION_TIME);
      expect(benchmarkResult.stdDev).toBeLessThan(PERFORMANCE_THRESHOLDS.CALCULATION_TIME * 0.1);
    });
  });

  describe('Memory Usage', () => {
    it('maintains stable memory usage during intensive calculations', async () => {
      const { result: mortgageResult } = renderHook(() => useMortgageCalculator(), {
        wrapper: TestWrapper
      });

      const { result: realEstateResult } = renderHook(() => useRealEstateComparisonTool(), {
        wrapper: TestWrapper
      });

      const initialMemory = getMemoryUsage();

      // Perform intensive calculations
      for (let i = 0; i < 100; i++) {
        await act(async () => {
          mortgageResult.current.setValues({
            homePrice: 300000 + (i * 1000),
            downPayment: 60000,
            interestRate: 4.5,
            loanTerm: 30,
            propertyTax: 3000,
            homeInsurance: 1200,
            pmi: true,
            includeEscrow: true
          });

          await mortgageResult.current.calculate();

          realEstateResult.current.setValues({
            properties: [
              {
                price: 300000 + (i * 1000),
                rentPotential: 2000,
                expenses: 500,
                appreciationRate: 3
              },
              {
                price: 250000 + (i * 1000),
                rentPotential: 1800,
                expenses: 400,
                appreciationRate: 3.5
              }
            ],
            holdingPeriod: 10,
            propertyTaxRate: 1.2,
            maintenancePercent: 1,
            vacancyRate: 5,
            managementFee: 8
          });

          await realEstateResult.current.calculate();
        });
      }

      const finalMemory = getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_INCREASE);
    });
  });

  describe('State Management Performance', () => {
    it('handles rapid state updates efficiently', async () => {
      const { result: actionsResult } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      const benchmarkResult = await measureExecutionTime(async () => {
        for (let i = 0; i < 50; i++) {
          act(() => {
            actionsResult.current.updateCommonInput('inflationRate', 2 + (i * 0.1));
            actionsResult.current.updateCommonInput('taxRate', 20 + (i * 0.5));
            actionsResult.current.updateCommonInput('riskTolerance', i % 2 === 0 ? 'moderate' : 'aggressive');
          });
        }
      });

      expect(benchmarkResult.mean / 50).toBeLessThan(PERFORMANCE_THRESHOLDS.STATE_UPDATE_TIME);
    });

    it('maintains performance with cached calculator states', async () => {
      const { result: actionsResult } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      const initialMemory = getMemoryUsage();

      const benchmarkResult = await measureExecutionTime(async () => {
        for (let i = 0; i < 50; i++) {
          act(() => {
            actionsResult.current.cacheCalculatorState(
              \`calculator-\${i}\`,
              { value: i * 1000 },
              { result: i * 1100 }
            );
          });
        }
      });

      const finalMemory = getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;

      expect(benchmarkResult.mean / 50).toBeLessThan(PERFORMANCE_THRESHOLDS.STATE_UPDATE_TIME);
      expect(memoryIncrease).toBeLessThan(PERFORMANCE_THRESHOLDS.MEMORY_INCREASE);
    });
  });

  describe('Concurrent Calculations', () => {
    it('handles multiple simultaneous calculations efficiently', async () => {
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator(), {
        wrapper: TestWrapper
      });
      const { result: retirementResult } = renderHook(() => useRetirementCalculator(), {
        wrapper: TestWrapper
      });
      const { result: mortgageResult } = renderHook(() => useMortgageCalculator(), {
        wrapper: TestWrapper
      });

      const benchmarkResult = await measureExecutionTime(async () => {
        await Promise.all([
          act(async () => {
            investmentResult.current.setValues({
              initialInvestment: 50000,
              monthlyContribution: 1000,
              annualReturn: 7,
              investmentPeriod: 20
            });
            await investmentResult.current.calculate();
          }),
          act(async () => {
            retirementResult.current.setValues({
              currentAge: 35,
              retirementAge: 65,
              currentSavings: 100000,
              monthlyContribution: 2000,
              desiredRetirementIncome: 80000
            });
            await retirementResult.current.calculate();
          }),
          act(async () => {
            mortgageResult.current.setValues({
              homePrice: 400000,
              downPayment: 80000,
              interestRate: 4.5,
              loanTerm: 30
            });
            await mortgageResult.current.calculate();
          })
        ]);
      });

      expect(benchmarkResult.mean).toBeLessThan(PERFORMANCE_THRESHOLDS.CALCULATION_TIME * 2);
    });
  });
});


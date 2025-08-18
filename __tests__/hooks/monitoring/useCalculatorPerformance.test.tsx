import { renderHook, act } from '@testing-library/react';
import { useCalculatorPerformance } from '@/lib/hooks/monitoring/useCalculatorPerformance';
import { CalculatorPerformanceAnalyzer } from '@/lib/monitoring/performance/CalculatorPerformanceAnalyzer';

describe('useCalculatorPerformance', () => {
  const mockOnPerformanceIssue = jest.fn();
  const calculatorId = 'test-calculator';

  beforeEach(() => {
    jest.clearAllMocks();
    CalculatorPerformanceAnalyzer.getInstance().clearMetrics();
  });

  it('should measure calculation time', async () => {
    const { result } = renderHook(() =>
      useCalculatorPerformance({
        calculatorId,
        enableLogging: false,
        onPerformanceIssue: mockOnPerformanceIssue
      })
    );

    const testCalculation = async () => {
      // Simulate some work
      for (let i = 0; i < 1000000; i++) {}
      return 42;
    };

    const calculationResult = await act(() =>
      result.current.measureCalculation('test', testCalculation)
    );

    expect(calculationResult).toBe(42);

    const metrics = CalculatorPerformanceAnalyzer.getInstance().getLatestMetrics(calculatorId);
    expect(metrics?.calculationTime).toBeGreaterThan(0);
  });

  it('should record recomputes', () => {
    const { result } = renderHook(() =>
      useCalculatorPerformance({
        calculatorId,
        enableLogging: false
      })
    );

    act(() => {
      result.current.recordRecompute();
      result.current.recordRecompute();
    });

    const metrics = CalculatorPerformanceAnalyzer.getInstance().getLatestMetrics(calculatorId);
    expect(metrics?.recomputeCount).toBe(2);
  });

  it('should record cache hits and misses', () => {
    const { result } = renderHook(() =>
      useCalculatorPerformance({
        calculatorId,
        enableLogging: false
      })
    );

    act(() => {
      result.current.recordCacheHit();
      result.current.recordCacheMiss();
      result.current.recordCacheHit();
    });

    const metrics = CalculatorPerformanceAnalyzer.getInstance().getLatestMetrics(calculatorId);
    expect(metrics?.cacheHits).toBe(2);
    expect(metrics?.cacheMisses).toBe(1);
  });

  it('should call onPerformanceIssue when issues are detected', () => {
    const { result } = renderHook(() =>
      useCalculatorPerformance({
        calculatorId,
        enableLogging: false,
        onPerformanceIssue: mockOnPerformanceIssue,
        customThresholds: {
          maxCalculationTime: 1 // Set very low threshold to trigger issue
        }
      })
    );

    act(() => {
      // Simulate slow calculation
      result.current.measureCalculation('test', () => {
        for (let i = 0; i < 1000000; i++) {}
        return 42;
      });
    });

    expect(mockOnPerformanceIssue).toHaveBeenCalled();
  });

  it('should respect custom thresholds', () => {
    const { result } = renderHook(() =>
      useCalculatorPerformance({
        calculatorId,
        enableLogging: false,
        customThresholds: {
          maxRecomputeCount: 1
        }
      })
    );

    act(() => {
      result.current.recordRecompute();
      result.current.recordRecompute(); // Should trigger issue
    });

    const report = result.current.getPerformanceReport();
    expect(report).toContain('High recompute count');
  });

  it('should generate performance report', () => {
    const { result } = renderHook(() =>
      useCalculatorPerformance({
        calculatorId,
        enableLogging: false
      })
    );

    act(() => {
      result.current.recordRecompute();
      result.current.recordCacheHit();
      result.current.recordCacheMiss();
    });

    const report = result.current.getPerformanceReport();
    expect(report).toContain('Performance Report');
    expect(report).toContain('Metrics:');
  });

  it('should handle errors during calculation', async () => {
    const { result } = renderHook(() =>
      useCalculatorPerformance({
        calculatorId,
        enableLogging: false
      })
    );

    const errorCalculation = async () => {
      throw new Error('Test error');
    };

    await expect(
      act(() => result.current.measureCalculation('test', errorCalculation))
    ).rejects.toThrow('Test error');

    // Should still record metrics even if calculation fails
    const metrics = CalculatorPerformanceAnalyzer.getInstance().getLatestMetrics(calculatorId);
    expect(metrics?.calculationTime).toBeGreaterThan(0);
  });
});


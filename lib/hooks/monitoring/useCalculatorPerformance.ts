import { useEffect, useRef } from 'react';
import { CalculatorPerformanceAnalyzer } from '@/lib/monitoring/performance/CalculatorPerformanceAnalyzer';

interface UseCalculatorPerformanceOptions {
  calculatorId: string;
  enableLogging?: boolean;
  onPerformanceIssue?: (issues: string[]) => void;
  customThresholds?: {
    maxCalculationTime?: number;
    maxMemoryUsage?: number;
    maxRenderTime?: number;
    maxRecomputeCount?: number;
    minCacheHitRate?: number;
  };
}

export function useCalculatorPerformance({
  calculatorId,
  enableLogging = false,
  onPerformanceIssue,
  customThresholds
}: UseCalculatorPerformanceOptions) {
  const analyzer = CalculatorPerformanceAnalyzer.getInstance();
  const renderStartTime = useRef<number>(0);

  // Update custom thresholds if provided
  useEffect(() => {
    if (customThresholds) {
      analyzer.updateThresholds(calculatorId, customThresholds);
    }
  }, [calculatorId, customThresholds]);

  // Start measuring render time
  useEffect(() => {
    renderStartTime.current = performance.now();
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      analyzer.recordMetric(calculatorId, 'renderTime', renderTime);

      // Analyze performance after render
      const { issues, recommendations } = analyzer.analyzePerformance(calculatorId);
      
      if (issues.length > 0) {
        if (onPerformanceIssue) {
          onPerformanceIssue(issues);
        }
        if (enableLogging) {
          console.warn(\`Performance issues detected for \${calculatorId}:\`);
          issues.forEach(issue => console.warn(\`- \${issue}\`));
          console.info('Recommendations:');
          recommendations.forEach(rec => console.info(\`- \${rec}\`));
        }
      }
    };
  });

  const measureCalculation = async <T>(
    operation: string,
    callback: () => Promise<T> | T
  ): Promise<T> => {
    analyzer.startMeasurement(calculatorId, operation);
    const startMemory = process.memoryUsage().heapUsed;

    try {
      const result = await callback();
      
      analyzer.endMeasurement(calculatorId, operation);
      analyzer.recordMetric(calculatorId, 'memoryUsage', process.memoryUsage().heapUsed - startMemory);
      
      return result;
    } catch (error) {
      analyzer.endMeasurement(calculatorId, operation);
      throw error;
    }
  };

  const recordRecompute = () => {
    const metrics = analyzer.getLatestMetrics(calculatorId);
    const currentCount = metrics?.recomputeCount || 0;
    analyzer.recordMetric(calculatorId, 'recomputeCount', currentCount + 1);
  };

  const recordCacheHit = () => {
    const metrics = analyzer.getLatestMetrics(calculatorId);
    const currentHits = metrics?.cacheHits || 0;
    analyzer.recordMetric(calculatorId, 'cacheHits', currentHits + 1);
  };

  const recordCacheMiss = () => {
    const metrics = analyzer.getLatestMetrics(calculatorId);
    const currentMisses = metrics?.cacheMisses || 0;
    analyzer.recordMetric(calculatorId, 'cacheMisses', currentMisses + 1);
  };

  const getPerformanceReport = () => {
    return analyzer.generatePerformanceReport(calculatorId);
  };

  return {
    measureCalculation,
    recordRecompute,
    recordCacheHit,
    recordCacheMiss,
    getPerformanceReport
  };
}


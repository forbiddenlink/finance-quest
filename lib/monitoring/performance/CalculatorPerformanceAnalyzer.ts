import { performance, PerformanceObserver } from 'perf_hooks';

interface PerformanceMetrics {
  calculationTime: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  };
  renderTime?: number;
  recomputeCount: number;
  cacheHits: number;
  cacheMisses: number;
}

interface PerformanceThresholds {
  maxCalculationTime: number; // milliseconds
  maxMemoryUsage: number; // bytes
  maxRenderTime?: number; // milliseconds
  maxRecomputeCount: number;
  minCacheHitRate: number; // percentage (0-100)
}

export class CalculatorPerformanceAnalyzer {
  private static instance: CalculatorPerformanceAnalyzer;
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  private thresholds: Map<string, PerformanceThresholds> = new Map();
  private observer: PerformanceObserver;

  private constructor() {
    // Initialize performance observer
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.recordMetric(entry.name, 'calculationTime', entry.duration);
      });
    });

    this.observer.observe({ entryTypes: ['measure'] });

    // Set default thresholds
    this.setDefaultThresholds();
  }

  public static getInstance(): CalculatorPerformanceAnalyzer {
    if (!CalculatorPerformanceAnalyzer.instance) {
      CalculatorPerformanceAnalyzer.instance = new CalculatorPerformanceAnalyzer();
    }
    return CalculatorPerformanceAnalyzer.instance;
  }

  private setDefaultThresholds() {
    const defaultThresholds: PerformanceThresholds = {
      maxCalculationTime: 100, // 100ms
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      maxRenderTime: 16.67, // 60fps target
      maxRecomputeCount: 2,
      minCacheHitRate: 80 // 80%
    };

    // Calculator-specific thresholds
    const calculatorThresholds: Record<string, PerformanceThresholds> = {
      'longevity-risk': {
        ...defaultThresholds,
        maxCalculationTime: 200, // More complex calculations allowed
        maxMemoryUsage: 100 * 1024 * 1024 // 100MB
      },
      'portfolio-analyzer': {
        ...defaultThresholds,
        maxCalculationTime: 150,
        maxMemoryUsage: 75 * 1024 * 1024
      },
      'real-estate-investment': {
        ...defaultThresholds,
        maxCalculationTime: 180,
        maxMemoryUsage: 80 * 1024 * 1024
      }
    };

    // Set thresholds for each calculator
    Object.entries(calculatorThresholds).forEach(([calculator, thresholds]) => {
      this.thresholds.set(calculator, thresholds);
    });
  }

  public startMeasurement(calculatorId: string, operation: string) {
    performance.mark(\`\${calculatorId}-\${operation}-start\`);
  }

  public endMeasurement(calculatorId: string, operation: string) {
    performance.mark(\`\${calculatorId}-\${operation}-end\`);
    performance.measure(
      \`\${calculatorId}-\${operation}\`,
      \`\${calculatorId}-\${operation}-start\`,
      \`\${calculatorId}-\${operation}-end\`
    );
  }

  public recordMetric(
    calculatorId: string,
    metricName: keyof PerformanceMetrics,
    value: number
  ) {
    if (!this.metrics.has(calculatorId)) {
      this.metrics.set(calculatorId, []);
    }

    const calculatorMetrics = this.metrics.get(calculatorId)!;
    const currentMetrics = calculatorMetrics[calculatorMetrics.length - 1] || {
      calculationTime: 0,
      memoryUsage: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        arrayBuffers: 0
      },
      recomputeCount: 0,
      cacheHits: 0,
      cacheMisses: 0
    };

    if (metricName === 'memoryUsage') {
      currentMetrics.memoryUsage = {
        heapUsed: value,
        heapTotal: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external,
        arrayBuffers: process.memoryUsage().arrayBuffers
      };
    } else {
      (currentMetrics[metricName] as number) = value;
    }

    calculatorMetrics[calculatorMetrics.length - 1] = currentMetrics;
  }

  public getMetrics(calculatorId: string): PerformanceMetrics[] {
    return this.metrics.get(calculatorId) || [];
  }

  public getLatestMetrics(calculatorId: string): PerformanceMetrics | null {
    const metrics = this.metrics.get(calculatorId);
    return metrics ? metrics[metrics.length - 1] : null;
  }

  public analyzePerformance(calculatorId: string): {
    issues: string[];
    recommendations: string[];
    metrics: PerformanceMetrics | null;
  } {
    const metrics = this.getLatestMetrics(calculatorId);
    const thresholds = this.thresholds.get(calculatorId);
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!metrics || !thresholds) {
      return { issues: ['No metrics available'], recommendations: [], metrics: null };
    }

    // Analyze calculation time
    if (metrics.calculationTime > thresholds.maxCalculationTime) {
      issues.push(\`High calculation time: \${metrics.calculationTime}ms (max: \${thresholds.maxCalculationTime}ms)\`);
      recommendations.push(
        'Consider implementing memoization or breaking down complex calculations'
      );
    }

    // Analyze memory usage
    if (metrics.memoryUsage.heapUsed > thresholds.maxMemoryUsage) {
      issues.push(
        \`High memory usage: \${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB (max: \${
          Math.round(thresholds.maxMemoryUsage / 1024 / 1024)
        }MB)\`
      );
      recommendations.push(
        'Consider implementing cleanup of unused data and reducing state size'
      );
    }

    // Analyze render time
    if (metrics.renderTime && metrics.renderTime > (thresholds.maxRenderTime || 16.67)) {
      issues.push(\`Slow render time: \${metrics.renderTime}ms (max: \${thresholds.maxRenderTime}ms)\`);
      recommendations.push(
        'Consider implementing React.memo or useMemo for expensive components'
      );
    }

    // Analyze recompute count
    if (metrics.recomputeCount > thresholds.maxRecomputeCount) {
      issues.push(\`High recompute count: \${metrics.recomputeCount} (max: \${thresholds.maxRecomputeCount})\`);
      recommendations.push(
        'Consider implementing useCallback for handlers and reviewing dependency arrays'
      );
    }

    // Analyze cache efficiency
    const totalCacheAttempts = metrics.cacheHits + metrics.cacheMisses;
    const cacheHitRate = totalCacheAttempts > 0
      ? (metrics.cacheHits / totalCacheAttempts) * 100
      : 0;

    if (cacheHitRate < thresholds.minCacheHitRate) {
      issues.push(\`Low cache hit rate: \${Math.round(cacheHitRate)}% (min: \${thresholds.minCacheHitRate}%)\`);
      recommendations.push(
        'Consider reviewing cache key generation and cache invalidation strategy'
      );
    }

    return { issues, recommendations, metrics };
  }

  public generatePerformanceReport(calculatorId: string): string {
    const { issues, recommendations, metrics } = this.analyzePerformance(calculatorId);
    
    if (!metrics) {
      return 'No performance data available';
    }

    const report = [
      \`Performance Report for \${calculatorId}\`,
      '===================================',
      '',
      'Metrics:',
      \`- Calculation Time: \${metrics.calculationTime}ms\`,
      \`- Memory Usage: \${Math.round(metrics.memoryUsage.heapUsed / 1024 / 1024)}MB\`,
      metrics.renderTime ? \`- Render Time: \${metrics.renderTime}ms\` : null,
      \`- Recompute Count: \${metrics.recomputeCount}\`,
      \`- Cache Hit Rate: \${
        Math.round((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100)
      }%\`,
      '',
      issues.length ? 'Issues:' : 'No issues detected',
      ...issues.map(issue => \`- \${issue}\`),
      '',
      recommendations.length ? 'Recommendations:' : 'No recommendations',
      ...recommendations.map(rec => \`- \${rec}\`),
    ].filter(Boolean).join('\\n');

    return report;
  }

  public clearMetrics(calculatorId?: string) {
    if (calculatorId) {
      this.metrics.delete(calculatorId);
    } else {
      this.metrics.clear();
    }
  }

  public updateThresholds(calculatorId: string, thresholds: Partial<PerformanceThresholds>) {
    const currentThresholds = this.thresholds.get(calculatorId) || {
      maxCalculationTime: 100,
      maxMemoryUsage: 50 * 1024 * 1024,
      maxRenderTime: 16.67,
      maxRecomputeCount: 2,
      minCacheHitRate: 80
    };

    this.thresholds.set(calculatorId, {
      ...currentThresholds,
      ...thresholds
    });
  }
}


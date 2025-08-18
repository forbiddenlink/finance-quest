import { performance } from 'perf_hooks';
import Benchmark from 'benchmark';

// Benchmark configuration
export interface BenchmarkConfig {
  name: string;
  iterations?: number;
  async?: boolean;
  setup?: () => void;
  teardown?: () => void;
  maxTime?: number;
  minSamples?: number;
}

// Benchmark result
export interface BenchmarkResult {
  name: string;
  hz: number; // operations per second
  stats: {
    mean: number;
    deviation: number;
    moe: number;
    rme: number;
    sem: number;
    variance: number;
  };
  times: {
    cycle: number;
    elapsed: number;
    period: number;
    timeStamp: number;
  };
  samples: number[];
  memory?: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  };
}

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  CALCULATION_TIME: 100, // ms
  MEMORY_INCREASE: 5, // MB
  STATE_UPDATE_TIME: 50, // ms
  RENDER_TIME: 16.67, // ms (60fps)
  OPERATIONS_PER_SECOND: {
    CALCULATION: 1000,
    STATE_UPDATE: 2000,
    RENDER: 60
  }
};

// Memory measurement
export function measureMemory(): Promise<NodeJS.MemoryUsage> {
  if (global.gc) {
    global.gc(); // Force garbage collection if available
  }
  return Promise.resolve(process.memoryUsage());
}

// Benchmark runner
export async function runBenchmark(
  fn: () => void | Promise<void>,
  config: BenchmarkConfig
): Promise<BenchmarkResult> {
  const suite = new Benchmark.Suite();

  return new Promise((resolve, reject) => {
    suite.add(config.name, {
      fn: config.async ? async (deferred: Benchmark.Deferred) => {
        try {
          await fn();
          deferred.resolve();
        } catch (error) {
          deferred.reject(error);
        }
      } : fn,
      async: config.async,
      setup: config.setup,
      teardown: config.teardown,
      maxTime: config.maxTime,
      minSamples: config.minSamples,
      onComplete: async (event: Benchmark) => {
        const memory = await measureMemory();
        resolve({
          name: config.name,
          hz: event.target.hz,
          stats: event.target.stats,
          times: event.target.times,
          samples: event.target.stats.sample,
          memory: {
            heapUsed: memory.heapUsed / 1024 / 1024, // MB
            heapTotal: memory.heapTotal / 1024 / 1024, // MB
            external: memory.external / 1024 / 1024, // MB
            arrayBuffers: memory.arrayBuffers / 1024 / 1024 // MB
          }
        });
      }
    })
    .on('error', (error: Error) => {
      reject(error);
    })
    .run({ async: true });
  });
}

// Benchmark suite runner
export async function runBenchmarkSuite(
  benchmarks: Array<{
    fn: () => void | Promise<void>;
    config: BenchmarkConfig;
  }>
): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];

  for (const benchmark of benchmarks) {
    const result = await runBenchmark(benchmark.fn, benchmark.config);
    results.push(result);
  }

  return results;
}

// Result analysis
export function analyzeBenchmarkResults(results: BenchmarkResult[]): {
  summary: string;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Analyze each result
  results.forEach(result => {
    const opsPerSecond = result.hz;
    const meanTime = 1000 / opsPerSecond; // ms
    const memoryUsed = result.memory?.heapUsed || 0;

    // Check against thresholds
    if (result.name.includes('calculation')) {
      if (meanTime > PERFORMANCE_THRESHOLDS.CALCULATION_TIME) {
        warnings.push(
          \`Slow calculation in \${result.name}: \${meanTime.toFixed(2)}ms (threshold: \${PERFORMANCE_THRESHOLDS.CALCULATION_TIME}ms)\`
        );
        recommendations.push(
          \`Consider optimizing \${result.name} by implementing memoization or reducing complexity\`
        );
      }
      if (opsPerSecond < PERFORMANCE_THRESHOLDS.OPERATIONS_PER_SECOND.CALCULATION) {
        warnings.push(
          \`Low throughput in \${result.name}: \${opsPerSecond.toFixed(2)} ops/sec\`
        );
      }
    }

    if (result.name.includes('state')) {
      if (meanTime > PERFORMANCE_THRESHOLDS.STATE_UPDATE_TIME) {
        warnings.push(
          \`Slow state update in \${result.name}: \${meanTime.toFixed(2)}ms\`
        );
        recommendations.push(
          \`Consider using batch updates or reducing state complexity in \${result.name}\`
        );
      }
      if (opsPerSecond < PERFORMANCE_THRESHOLDS.OPERATIONS_PER_SECOND.STATE_UPDATE) {
        warnings.push(
          \`Low state update throughput in \${result.name}: \${opsPerSecond.toFixed(2)} ops/sec\`
        );
      }
    }

    if (result.name.includes('render')) {
      if (meanTime > PERFORMANCE_THRESHOLDS.RENDER_TIME) {
        warnings.push(
          \`Slow rendering in \${result.name}: \${meanTime.toFixed(2)}ms\`
        );
        recommendations.push(
          \`Consider implementing React.memo or useMemo in \${result.name}\`
        );
      }
      if (opsPerSecond < PERFORMANCE_THRESHOLDS.OPERATIONS_PER_SECOND.RENDER) {
        warnings.push(
          \`Low render throughput in \${result.name}: \${opsPerSecond.toFixed(2)} ops/sec\`
        );
      }
    }

    if (memoryUsed > PERFORMANCE_THRESHOLDS.MEMORY_INCREASE) {
      warnings.push(
        \`High memory usage in \${result.name}: \${memoryUsed.toFixed(2)}MB\`
      );
      recommendations.push(
        \`Consider implementing cleanup or reducing memory allocation in \${result.name}\`
      );
    }

    // Check statistical significance
    if (result.stats.rme > 5) {
      warnings.push(
        \`High variance in \${result.name}: ±\${result.stats.rme.toFixed(2)}%\`
      );
      recommendations.push(
        \`Consider increasing sample size or stabilizing conditions for \${result.name}\`
      );
    }
  });

  // Generate summary
  const summary = results
    .map(result => {
      return \`
\${result.name}:
  - Ops/sec: \${result.hz.toFixed(2)}
  - Mean time: \${(1000 / result.hz).toFixed(2)}ms
  - Memory: \${result.memory?.heapUsed.toFixed(2)}MB
  - Variance: ±\${result.stats.rme.toFixed(2)}%
\`;
    })
    .join('\\n');

  return {
    summary: summary.trim(),
    warnings,
    recommendations
  };
}

// Export benchmark utilities
export const benchmarkUtils = {
  runBenchmark,
  runBenchmarkSuite,
  analyzeBenchmarkResults,
  measureMemory,
  PERFORMANCE_THRESHOLDS
};
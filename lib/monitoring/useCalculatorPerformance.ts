import { useRef, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface PerformanceMetrics {
  calculationTime: number;
  renderTime: number;
  memoryUsage: number;
  fps: number;
  interactionDelay: number;
}

interface PerformanceThresholds {
  maxCalculationTime?: number;
  maxRenderTime?: number;
  maxMemoryUsage?: number;
  minFps?: number;
  maxInteractionDelay?: number;
}

interface PerformanceConfig {
  enableLogging?: boolean;
  sampleRate?: number;
  reportingEndpoint?: string;
  thresholds?: PerformanceThresholds;
}

const DEFAULT_THRESHOLDS: Required<PerformanceThresholds> = {
  maxCalculationTime: 100, // ms
  maxRenderTime: 16,      // ms (targeting 60fps)
  maxMemoryUsage: 50,     // MB
  minFps: 30,             // frames per second
  maxInteractionDelay: 100 // ms
};

export function useCalculatorPerformance(config: PerformanceConfig = {}) {
  const metricsRef = useRef<PerformanceMetrics>({
    calculationTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    interactionDelay: 0
  });

  const thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds };
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const calculationStartTimeRef = useRef(0);
  const interactionStartTimeRef = useRef(0);

  // Track FPS
  const trackFps = useCallback(() => {
    const now = performance.now();
    const elapsed = now - lastFrameTimeRef.current;
    frameCountRef.current++;

    if (elapsed >= 1000) { // Update FPS every second
      metricsRef.current.fps = (frameCountRef.current * 1000) / elapsed;
      frameCountRef.current = 0;
      lastFrameTimeRef.current = now;

      if (metricsRef.current.fps < thresholds.minFps) {
        console.warn(`Low FPS detected: ${metricsRef.current.fps.toFixed(1)}`);
      }
    }

    requestAnimationFrame(trackFps);
  }, [thresholds.minFps]);

  // Monitor memory usage
  const monitorMemory = useCallback(async () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usageInMB = memory.usedJSHeapSize / (1024 * 1024);
      metricsRef.current.memoryUsage = usageInMB;

      if (usageInMB > thresholds.maxMemoryUsage) {
        console.warn(`High memory usage: ${usageInMB.toFixed(1)}MB`);
      }
    }
  }, [thresholds.maxMemoryUsage]);

  // Track calculation time
  const startCalculation = useCallback(() => {
    calculationStartTimeRef.current = performance.now();
  }, []);

  const endCalculation = useCallback(() => {
    const calculationTime = performance.now() - calculationStartTimeRef.current;
    metricsRef.current.calculationTime = calculationTime;

    if (calculationTime > thresholds.maxCalculationTime) {
      console.warn(`Slow calculation detected: ${calculationTime.toFixed(1)}ms`);
    }

    return calculationTime;
  }, [thresholds.maxCalculationTime]);

  // Track interaction delay
  const startInteraction = useCallback(() => {
    interactionStartTimeRef.current = performance.now();
  }, []);

  const endInteraction = useCallback(() => {
    const interactionDelay = performance.now() - interactionStartTimeRef.current;
    metricsRef.current.interactionDelay = interactionDelay;

    if (interactionDelay > thresholds.maxInteractionDelay) {
      console.warn(`High interaction delay: ${interactionDelay.toFixed(1)}ms`);
    }

    return interactionDelay;
  }, [thresholds.maxInteractionDelay]);

  // Report metrics
  const reportMetrics = useCallback(
    debounce(async (metrics: PerformanceMetrics) => {
      if (config.reportingEndpoint) {
        try {
          await fetch(config.reportingEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: Date.now(),
              metrics,
              userAgent: navigator.userAgent,
              url: window.location.href
            })
          });
        } catch (error) {
          console.error('Failed to report metrics:', error);
        }
      }

      if (config.enableLogging) {
        console.log('Performance metrics:', metrics);
      }
    }, 1000),
    [config.reportingEndpoint, config.enableLogging]
  );

  // Initialize monitoring
  useEffect(() => {
    // Start FPS tracking
    const frameId = requestAnimationFrame(trackFps);

    // Start memory monitoring
    const memoryInterval = setInterval(monitorMemory, 5000);

    // Monitor long tasks
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > thresholds.maxRenderTime) {
          console.warn(`Long task detected: ${entry.duration.toFixed(1)}ms`);
          metricsRef.current.renderTime = entry.duration;
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });

    // Monitor resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > thresholds.maxRenderTime) {
          console.warn(`Slow resource load: ${entry.name} (${entry.duration.toFixed(1)}ms)`);
        }
      }
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

    // Monitor first input delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > thresholds.maxInteractionDelay) {
          console.warn(`High FID: ${entry.duration.toFixed(1)}ms`);
        }
      }
    });

    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(memoryInterval);
      observer.disconnect();
      resourceObserver.disconnect();
      fidObserver.disconnect();
      reportMetrics.cancel();
    };
  }, [
    trackFps,
    monitorMemory,
    reportMetrics,
    thresholds.maxRenderTime,
    thresholds.maxInteractionDelay
  ]);

  // Return monitoring utilities
  return {
    startCalculation,
    endCalculation,
    startInteraction,
    endInteraction,
    getMetrics: () => ({ ...metricsRef.current }),
    reportMetrics: () => reportMetrics(metricsRef.current)
  };
}

// Calculator-specific performance monitoring
export function useBudgetCalculatorPerformance() {
  const performance = useCalculatorPerformance({
    thresholds: {
      maxCalculationTime: 50, // Stricter for budget calculations
      maxMemoryUsage: 30     // Lower memory threshold
    }
  });

  return {
    ...performance,
    // Add budget-specific monitoring
    trackCategoryUpdate: () => {
      performance.startCalculation();
      return () => performance.endCalculation();
    }
  };
}

export function useInvestmentCalculatorPerformance() {
  const performance = useCalculatorPerformance({
    thresholds: {
      maxCalculationTime: 200, // Allow more time for complex projections
      maxMemoryUsage: 40      // Higher memory threshold for large datasets
    }
  });

  return {
    ...performance,
    // Add investment-specific monitoring
    trackProjectionCalculation: () => {
      performance.startCalculation();
      return () => performance.endCalculation();
    }
  };
}

export function useDebtCalculatorPerformance() {
  const performance = useCalculatorPerformance({
    thresholds: {
      maxCalculationTime: 150, // Allow time for strategy comparisons
      maxMemoryUsage: 35      // Moderate memory threshold
    }
  });

  return {
    ...performance,
    // Add debt-specific monitoring
    trackStrategyComparison: () => {
      performance.startCalculation();
      return () => performance.endCalculation();
    }
  };
}

export function useTaxCalculatorPerformance() {
  const performance = useCalculatorPerformance({
    thresholds: {
      maxCalculationTime: 100, // Standard threshold for tax calculations
      maxMemoryUsage: 30      // Lower memory threshold
    }
  });

  return {
    ...performance,
    // Add tax-specific monitoring
    trackTaxBreakdown: () => {
      performance.startCalculation();
      return () => performance.endCalculation();
    }
  };
}

export function useRetirementCalculatorPerformance() {
  const performance = useCalculatorPerformance({
    thresholds: {
      maxCalculationTime: 250, // Allow more time for long-term projections
      maxMemoryUsage: 45      // Higher memory threshold for complex scenarios
    }
  });

  return {
    ...performance,
    // Add retirement-specific monitoring
    trackRetirementProjection: () => {
      performance.startCalculation();
      return () => performance.endCalculation();
    }
  };
}

export function useMortgageCalculatorPerformance() {
  const performance = useCalculatorPerformance({
    thresholds: {
      maxCalculationTime: 150, // Allow time for amortization schedules
      maxMemoryUsage: 35      // Moderate memory threshold
    }
  });

  return {
    ...performance,
    // Add mortgage-specific monitoring
    trackAmortizationCalculation: () => {
      performance.startCalculation();
      return () => performance.endCalculation();
    }
  };
}


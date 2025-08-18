import { CalculatorPerformanceAnalyzer } from '@/lib/monitoring/performance/CalculatorPerformanceAnalyzer';

describe('CalculatorPerformanceAnalyzer', () => {
  let analyzer: CalculatorPerformanceAnalyzer;

  beforeEach(() => {
    analyzer = CalculatorPerformanceAnalyzer.getInstance();
    analyzer.clearMetrics();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = CalculatorPerformanceAnalyzer.getInstance();
      const instance2 = CalculatorPerformanceAnalyzer.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Metrics Recording', () => {
    it('should record calculation time', () => {
      const calculatorId = 'test-calculator';
      analyzer.startMeasurement(calculatorId, 'calculation');
      // Simulate some work
      for (let i = 0; i < 1000000; i++) {}
      analyzer.endMeasurement(calculatorId, 'calculation');

      const metrics = analyzer.getLatestMetrics(calculatorId);
      expect(metrics?.calculationTime).toBeGreaterThan(0);
    });

    it('should record memory usage', () => {
      const calculatorId = 'test-calculator';
      analyzer.recordMetric(calculatorId, 'memoryUsage', 1024 * 1024); // 1MB

      const metrics = analyzer.getLatestMetrics(calculatorId);
      expect(metrics?.memoryUsage.heapUsed).toBe(1024 * 1024);
    });

    it('should record recompute count', () => {
      const calculatorId = 'test-calculator';
      analyzer.recordMetric(calculatorId, 'recomputeCount', 1);
      analyzer.recordMetric(calculatorId, 'recomputeCount', 2);

      const metrics = analyzer.getLatestMetrics(calculatorId);
      expect(metrics?.recomputeCount).toBe(2);
    });

    it('should record cache hits and misses', () => {
      const calculatorId = 'test-calculator';
      analyzer.recordMetric(calculatorId, 'cacheHits', 1);
      analyzer.recordMetric(calculatorId, 'cacheMisses', 1);

      const metrics = analyzer.getLatestMetrics(calculatorId);
      expect(metrics?.cacheHits).toBe(1);
      expect(metrics?.cacheMisses).toBe(1);
    });
  });

  describe('Performance Analysis', () => {
    it('should detect high calculation time', () => {
      const calculatorId = 'test-calculator';
      analyzer.recordMetric(calculatorId, 'calculationTime', 200); // Above default threshold

      const { issues } = analyzer.analyzePerformance(calculatorId);
      expect(issues).toContain(expect.stringContaining('High calculation time'));
    });

    it('should detect high memory usage', () => {
      const calculatorId = 'test-calculator';
      analyzer.recordMetric(calculatorId, 'memoryUsage', 100 * 1024 * 1024); // 100MB

      const { issues } = analyzer.analyzePerformance(calculatorId);
      expect(issues).toContain(expect.stringContaining('High memory usage'));
    });

    it('should detect high recompute count', () => {
      const calculatorId = 'test-calculator';
      analyzer.recordMetric(calculatorId, 'recomputeCount', 5); // Above default threshold

      const { issues } = analyzer.analyzePerformance(calculatorId);
      expect(issues).toContain(expect.stringContaining('High recompute count'));
    });

    it('should detect low cache hit rate', () => {
      const calculatorId = 'test-calculator';
      analyzer.recordMetric(calculatorId, 'cacheHits', 2);
      analyzer.recordMetric(calculatorId, 'cacheMisses', 8);

      const { issues } = analyzer.analyzePerformance(calculatorId);
      expect(issues).toContain(expect.stringContaining('Low cache hit rate'));
    });
  });

  describe('Custom Thresholds', () => {
    it('should respect custom thresholds', () => {
      const calculatorId = 'test-calculator';
      analyzer.updateThresholds(calculatorId, {
        maxCalculationTime: 50, // Lower threshold
      });

      analyzer.recordMetric(calculatorId, 'calculationTime', 75); // Above custom threshold

      const { issues } = analyzer.analyzePerformance(calculatorId);
      expect(issues).toContain(expect.stringContaining('High calculation time'));
    });
  });

  describe('Performance Report', () => {
    it('should generate a comprehensive report', () => {
      const calculatorId = 'test-calculator';
      
      // Record various metrics
      analyzer.recordMetric(calculatorId, 'calculationTime', 150);
      analyzer.recordMetric(calculatorId, 'memoryUsage', 75 * 1024 * 1024);
      analyzer.recordMetric(calculatorId, 'recomputeCount', 3);
      analyzer.recordMetric(calculatorId, 'cacheHits', 8);
      analyzer.recordMetric(calculatorId, 'cacheMisses', 2);

      const report = analyzer.generatePerformanceReport(calculatorId);
      
      expect(report).toContain('Performance Report');
      expect(report).toContain('Metrics:');
      expect(report).toContain('Issues:');
      expect(report).toContain('Recommendations:');
    });
  });
});


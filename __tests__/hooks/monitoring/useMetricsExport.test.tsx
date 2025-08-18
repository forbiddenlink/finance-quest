import { renderHook, act } from '@testing-library/react';
import { useMetricsExport } from '@/lib/monitoring/useMetricsExport';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

// Mock dependencies
jest.mock('file-saver');
jest.mock('papaparse');
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn()
  },
  writeFile: jest.fn()
}));

describe('useMetricsExport', () => {
  // Sample test data
  const sampleMetrics = [
    {
      timestamp: 1234567890000,
      metric: 'calculationTime',
      value: 150,
      category: 'performance',
      calculator: 'investment'
    },
    {
      timestamp: 1234567890000,
      metric: 'memoryUsage',
      value: 45,
      category: 'performance',
      calculator: 'budget'
    }
  ];

  const sampleAlerts = [
    {
      timestamp: 1234567890000,
      severity: 'critical',
      message: 'High calculation time',
      category: 'performance',
      metric: 'calculationTime',
      value: 150,
      threshold: 100
    }
  ];

  const sampleViolations = [
    {
      timestamp: 1234567890000,
      type: 'error',
      message: 'Missing ARIA label',
      element: 'button',
      impact: 'serious',
      wcag: 'WCAG 1.1.1'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Export Formats', () => {
    it('should export to CSV format', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportMetrics(sampleMetrics, [], [], {
          format: 'csv',
          timeRange: 'day'
        });
      });

      expect(Papa.unparse).toHaveBeenCalledWith({
        fields: expect.any(Array),
        data: expect.arrayContaining([
          expect.objectContaining({
            metric: 'calculationTime',
            value: 150
          })
        ])
      });
      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/metrics-export.*\.csv/)
      );
    });

    it('should export to JSON format', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportMetrics(sampleMetrics, [], [], {
          format: 'json',
          timeRange: 'day'
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/metrics-export.*\.json/)
      );
    });

    it('should export to Excel format', async () => {
      const XLSX = await import('xlsx');
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportMetrics(sampleMetrics, [], [], {
          format: 'excel',
          timeRange: 'day'
        });
      });

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalledWith(
        expect.any(Object),
        expect.stringMatching(/metrics-export.*\.xlsx/)
      );
    });
  });

  describe('Time Range Filtering', () => {
    it('should filter last hour data', async () => {
      const { result } = renderHook(() => useMetricsExport());
      const now = Date.now();
      const hourOldData = [
        { timestamp: now - 30 * 60 * 1000, value: 1 }, // 30 mins ago
        { timestamp: now - 90 * 60 * 1000, value: 2 }  // 90 mins ago
      ];

      await act(async () => {
        await result.current.exportMetrics(hourOldData, [], [], {
          format: 'json',
          timeRange: 'hour'
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"value":1')], expect.any(Object)),
        expect.any(String)
      );
      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.not.stringContaining('"value":2')], expect.any(Object)),
        expect.any(String)
      );
    });

    it('should filter custom date range', async () => {
      const { result } = renderHook(() => useMetricsExport());
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');
      const testData = [
        { timestamp: new Date('2024-01-01T12:00:00').getTime(), value: 1 },
        { timestamp: new Date('2024-01-03T12:00:00').getTime(), value: 2 }
      ];

      await act(async () => {
        await result.current.exportMetrics(testData, [], [], {
          format: 'json',
          timeRange: 'custom',
          customStartDate: startDate,
          customEndDate: endDate
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"value":1')], expect.any(Object)),
        expect.any(String)
      );
      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.not.stringContaining('"value":2')], expect.any(Object)),
        expect.any(String)
      );
    });
  });

  describe('Data Aggregation', () => {
    it('should aggregate data by minute', async () => {
      const { result } = renderHook(() => useMetricsExport());
      const testData = [
        { timestamp: Date.now(), metric: 'test', value: 1 },
        { timestamp: Date.now() + 100, metric: 'test', value: 2 }
      ];

      await act(async () => {
        await result.current.exportMetrics(testData, [], [], {
          format: 'json',
          timeRange: 'hour',
          aggregation: 'minute'
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"value":1.5')], expect.any(Object)),
        expect.any(String)
      );
    });

    it('should aggregate data by hour', async () => {
      const { result } = renderHook(() => useMetricsExport());
      const now = Date.now();
      const testData = [
        { timestamp: now, metric: 'test', value: 1 },
        { timestamp: now + 30 * 60 * 1000, metric: 'test', value: 3 }
      ];

      await act(async () => {
        await result.current.exportMetrics(testData, [], [], {
          format: 'json',
          timeRange: 'day',
          aggregation: 'hour'
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"value":2')], expect.any(Object)),
        expect.any(String)
      );
    });
  });

  describe('Data Selection', () => {
    it('should include selected metrics only', async () => {
      const { result } = renderHook(() => useMetricsExport());
      const mixedData = [
        { timestamp: Date.now(), metric: 'metric1', value: 1 },
        { timestamp: Date.now(), metric: 'metric2', value: 2 }
      ];

      await act(async () => {
        await result.current.exportMetrics(mixedData, [], [], {
          format: 'json',
          timeRange: 'day',
          metrics: ['metric1']
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"metric":"metric1"')], expect.any(Object)),
        expect.any(String)
      );
      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.not.stringContaining('"metric":"metric2"')], expect.any(Object)),
        expect.any(String)
      );
    });

    it('should include alerts when requested', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportMetrics(sampleMetrics, sampleAlerts, [], {
          format: 'json',
          timeRange: 'day',
          includeAlerts: true
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"type":"alert"')], expect.any(Object)),
        expect.any(String)
      );
    });

    it('should include violations when requested', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportMetrics(sampleMetrics, [], sampleViolations, {
          format: 'json',
          timeRange: 'day',
          includeViolations: true
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"type":"violation"')], expect.any(Object)),
        expect.any(String)
      );
    });
  });

  describe('Specific Export Functions', () => {
    it('should export metric history', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportMetricHistory('calculationTime', sampleMetrics, {
          format: 'json',
          timeRange: 'day'
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"metric":"calculationTime"')], expect.any(Object)),
        expect.any(String)
      );
    });

    it('should export alert history', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportAlertHistory(sampleAlerts, {
          format: 'json',
          timeRange: 'day'
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"severity":"critical"')], expect.any(Object)),
        expect.any(String)
      );
    });

    it('should export violation history', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        await result.current.exportViolationHistory(sampleViolations, {
          format: 'json',
          timeRange: 'day'
        });
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([expect.stringContaining('"impact":"serious"')], expect.any(Object)),
        expect.any(String)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid date ranges', async () => {
      const { result } = renderHook(() => useMetricsExport());
      const startDate = new Date('2024-01-02');
      const endDate = new Date('2024-01-01'); // End before start

      await act(async () => {
        const exportResult = await result.current.exportMetrics(sampleMetrics, [], [], {
          format: 'json',
          timeRange: 'custom',
          customStartDate: startDate,
          customEndDate: endDate
        });
        expect(exportResult.success).toBe(false);
      });
    });

    it('should handle export failures', async () => {
      const { result } = renderHook(() => useMetricsExport());
      (saveAs as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Export failed');
      });

      await act(async () => {
        const exportResult = await result.current.exportMetrics(sampleMetrics, [], [], {
          format: 'json',
          timeRange: 'day'
        });
        expect(exportResult.success).toBe(false);
      });
    });

    it('should handle invalid aggregation periods', async () => {
      const { result } = renderHook(() => useMetricsExport());

      await act(async () => {
        const exportResult = await result.current.exportMetrics(sampleMetrics, [], [], {
          format: 'json',
          timeRange: 'hour',
          aggregation: 'day' // Invalid for hour range
        });
        expect(exportResult.success).toBe(false);
      });
    });
  });
});


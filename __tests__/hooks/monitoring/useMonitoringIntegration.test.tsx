import { renderHook, act } from '@testing-library/react';
import { useMonitoringIntegration } from '@/lib/monitoring/hooks/useMonitoringIntegration';

// Mock fetch
global.fetch = jest.fn();

describe('useMonitoringIntegration', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  const mockConfig = {
    service: 'datadog' as const,
    config: {
      endpoint: 'https://api.datadoghq.com',
      apiKey: 'test-api-key',
      environment: 'test',
    },
    batchSize: 2,
    batchInterval: 1000,
  };

  const mockMetrics = {
    calculationTime: 100,
    renderTime: 16,
    memoryUsage: 50,
    fps: 60,
    interactionDelay: 50,
  };

  const mockAlert = {
    severity: 'critical',
    threshold: 100,
    message: 'Test alert',
    category: 'test',
  };

  const mockViolation = {
    type: 'aria',
    message: 'Missing aria-label',
    element: 'button',
  };

  it('should batch and send metrics', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useMonitoringIntegration(mockConfig));

    // Send metrics
    await act(async () => {
      result.current.sendMetrics(mockMetrics);
      result.current.sendMetrics(mockMetrics);
    });

    // Wait for batch to be sent
    await act(async () => {
      await result.current.flushMetrics();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.datadoghq.com/v1/metrics',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'DD-API-KEY': 'test-api-key',
        }),
      })
    );
  });

  it('should send alerts immediately', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useMonitoringIntegration(mockConfig));

    await act(async () => {
      await result.current.sendAlert(mockAlert);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.datadoghq.com/v1/events',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'DD-API-KEY': 'test-api-key',
        }),
      })
    );
  });

  it('should send accessibility violations immediately', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useMonitoringIntegration(mockConfig));

    await act(async () => {
      await result.current.sendAccessibilityViolation(mockViolation);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.datadoghq.com/v1/events',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'DD-API-KEY': 'test-api-key',
        }),
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useMonitoringIntegration(mockConfig));

    await act(async () => {
      await result.current.sendAlert(mockAlert);
    });

    expect(consoleError).toHaveBeenCalledWith(
      'Failed to send alert:',
      expect.any(Error)
    );

    consoleError.mockRestore();
  });

  it('should retry failed metric batches', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useMonitoringIntegration(mockConfig));

    // Send metrics that will fail
    await act(async () => {
      result.current.sendMetrics(mockMetrics);
      result.current.sendMetrics(mockMetrics);
      await result.current.flushMetrics();
    });

    // Retry should succeed
    await act(async () => {
      await result.current.flushMetrics();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should clean up interval on unmount', () => {
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useMonitoringIntegration(mockConfig));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    jest.useRealTimers();
    clearIntervalSpy.mockRestore();
  });
});


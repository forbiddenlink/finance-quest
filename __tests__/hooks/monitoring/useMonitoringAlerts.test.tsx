import { renderHook, act } from '@testing-library/react';
import { useMonitoringAlerts } from '@/lib/monitoring/useMonitoringAlerts';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock Notification API
const mockNotification = jest.fn();
global.Notification = mockNotification as any;
global.Notification.requestPermission = jest.fn().mockResolvedValue('granted');

describe('useMonitoringAlerts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Performance Alerts', () => {
    it('should trigger alert when calculation time exceeds threshold', () => {
      const { result } = renderHook(() => useMonitoringAlerts({
        performance: {
          calculationTime: {
            severity: 'critical',
            threshold: 100,
            message: 'High calculation time',
            category: 'performance'
          }
        }
      }));

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150,
          memoryUsage: 30,
          fps: 60
        });
      });

      const alerts = result.current.getActiveAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toMatchObject({
        severity: 'critical',
        message: 'High calculation time',
        metric: 'calculationTime',
        value: 150
      });
    });

    it('should respect alert cooldown periods', () => {
      const { result } = renderHook(() => useMonitoringAlerts({
        performance: {
          calculationTime: {
            severity: 'critical',
            threshold: 100,
            message: 'High calculation time',
            category: 'performance',
            cooldown: 60000 // 1 minute
          }
        }
      }));

      // First alert
      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      // Second alert within cooldown
      act(() => {
        jest.advanceTimersByTime(30000); // 30 seconds
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      // Third alert after cooldown
      act(() => {
        jest.advanceTimersByTime(30000); // Another 30 seconds
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      const alerts = result.current.getActiveAlerts();
      expect(alerts).toHaveLength(2); // Only first and third alerts
    });

    it('should handle multiple performance metrics', () => {
      const { result } = renderHook(() => useMonitoringAlerts({
        performance: {
          calculationTime: {
            severity: 'critical',
            threshold: 100,
            message: 'High calculation time',
            category: 'performance'
          },
          memoryUsage: {
            severity: 'warning',
            threshold: 50,
            message: 'High memory usage',
            category: 'performance'
          },
          fps: {
            severity: 'critical',
            threshold: 30,
            message: 'Low FPS',
            category: 'performance'
          }
        }
      }));

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150,
          memoryUsage: 60,
          fps: 25
        });
      });

      const alerts = result.current.getActiveAlerts();
      expect(alerts).toHaveLength(3);
      expect(alerts.map(a => a.metric)).toEqual([
        'calculationTime',
        'memoryUsage',
        'fps'
      ]);
    });
  });

  describe('Accessibility Alerts', () => {
    it('should trigger alert when violations exceed threshold', () => {
      const { result } = renderHook(() => useMonitoringAlerts({
        accessibility: {
          violations: {
            severity: 'critical',
            threshold: 0,
            message: 'Accessibility violations detected',
            category: 'accessibility'
          }
        }
      }));

      act(() => {
        result.current.checkAccessibilityMetrics({
          violations: 5,
          missingLabels: 2,
          keyboardTraps: 1
        });
      });

      const alerts = result.current.getActiveAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0]).toMatchObject({
        severity: 'critical',
        message: 'Accessibility violations detected',
        metric: 'violations',
        value: 5
      });
    });

    it('should handle multiple accessibility metrics', () => {
      const { result } = renderHook(() => useMonitoringAlerts({
        accessibility: {
          violations: {
            severity: 'critical',
            threshold: 0,
            message: 'Accessibility violations detected',
            category: 'accessibility'
          },
          missingLabels: {
            severity: 'warning',
            threshold: 0,
            message: 'Missing labels detected',
            category: 'accessibility'
          },
          keyboardTraps: {
            severity: 'critical',
            threshold: 0,
            message: 'Keyboard traps detected',
            category: 'accessibility'
          }
        }
      }));

      act(() => {
        result.current.checkAccessibilityMetrics({
          violations: 5,
          missingLabels: 3,
          keyboardTraps: 1
        });
      });

      const alerts = result.current.getActiveAlerts();
      expect(alerts).toHaveLength(3);
      expect(alerts.map(a => a.metric)).toEqual([
        'violations',
        'missingLabels',
        'keyboardTraps'
      ]);
    });
  });

  describe('Alert Management', () => {
    it('should acknowledge alerts', () => {
      const { result } = renderHook(() => useMonitoringAlerts());

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      const alerts = result.current.getActiveAlerts();
      expect(alerts).toHaveLength(1);

      act(() => {
        result.current.acknowledgeAlert(alerts[0].id);
      });

      expect(result.current.getActiveAlerts()).toHaveLength(0);
    });

    it('should clear alerts by category', () => {
      const { result } = renderHook(() => useMonitoringAlerts());

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150,
          memoryUsage: 60
        });
        result.current.checkAccessibilityMetrics({
          violations: 5
        });
      });

      expect(result.current.getActiveAlerts()).toHaveLength(3);

      act(() => {
        result.current.clearAlerts('performance');
      });

      const remainingAlerts = result.current.getActiveAlerts();
      expect(remainingAlerts).toHaveLength(1);
      expect(remainingAlerts[0].category).toBe('accessibility');
    });

    it('should filter alerts by severity', () => {
      const { result } = renderHook(() => useMonitoringAlerts({
        performance: {
          calculationTime: {
            severity: 'critical',
            threshold: 100,
            message: 'High calculation time',
            category: 'performance'
          },
          memoryUsage: {
            severity: 'warning',
            threshold: 50,
            message: 'High memory usage',
            category: 'performance'
          }
        }
      }));

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150,
          memoryUsage: 60
        });
      });

      const criticalAlerts = result.current.getAlertsBySeverity('critical');
      expect(criticalAlerts).toHaveLength(1);
      expect(criticalAlerts[0].metric).toBe('calculationTime');

      const warningAlerts = result.current.getAlertsBySeverity('warning');
      expect(warningAlerts).toHaveLength(1);
      expect(warningAlerts[0].metric).toBe('memoryUsage');
    });
  });

  describe('Notifications', () => {
    it('should send desktop notifications when enabled', () => {
      const { result } = renderHook(() => useMonitoringAlerts({
        enableDesktopNotifications: true
      }));

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      expect(mockNotification).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL'),
        expect.objectContaining({
          body: expect.stringContaining('calculationTime: 150')
        })
      );
    });

    it('should send server notifications', async () => {
      const notificationEndpoint = '/api/monitoring/alerts';
      const { result } = renderHook(() => useMonitoringAlerts({
        notificationEndpoint
      }));

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      expect(mockFetch).toHaveBeenCalledWith(
        notificationEndpoint,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should handle notification failures gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useMonitoringAlerts({
        notificationEndpoint: '/api/monitoring/alerts'
      }));

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      // Should not throw
      expect(console.error).toHaveBeenCalledWith(
        'Failed to send alert notification:',
        expect.any(Error)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined metrics', () => {
      const { result } = renderHook(() => useMonitoringAlerts());

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: undefined,
          memoryUsage: undefined,
          fps: undefined
        });
      });

      expect(result.current.getActiveAlerts()).toHaveLength(0);
    });

    it('should handle rapid metric updates', () => {
      const { result } = renderHook(() => useMonitoringAlerts());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.checkPerformanceMetrics({
            calculationTime: 150 + i
          });
        }
      });

      // Should debounce alerts
      expect(result.current.getActiveAlerts().length).toBeLessThan(100);
    });

    it('should handle alert cleanup', () => {
      const { result, unmount } = renderHook(() => useMonitoringAlerts());

      act(() => {
        result.current.checkPerformanceMetrics({
          calculationTime: 150
        });
      });

      unmount();

      // Should not cause memory leaks
      expect(result.current.getActiveAlerts()).toHaveLength(0);
    });
  });
});


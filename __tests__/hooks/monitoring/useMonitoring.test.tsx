import { renderHook, act } from '@testing-library/react';
import { useCalculatorPerformance } from '@/lib/monitoring/useCalculatorPerformance';
import { useAccessibilityMonitoring } from '@/lib/monitoring/useAccessibilityMonitoring';

// Mock performance.now() for consistent timing tests
const mockNow = jest.spyOn(performance, 'now');
let nowValue = 0;
mockNow.mockImplementation(() => nowValue);

// Mock fetch for reporting endpoints
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock MutationObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
global.MutationObserver = jest.fn().mockImplementation((callback) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  callback
}));

describe('Monitoring Hooks', () => {
  beforeEach(() => {
    nowValue = 0;
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('Performance Monitoring', () => {
    it('should track calculation time', () => {
      const { result } = renderHook(() => useCalculatorPerformance());

      act(() => {
        result.current.startCalculation();
        nowValue = 50; // Simulate 50ms passing
        result.current.endCalculation();
      });

      expect(result.current.getMetrics().calculationTime).toBe(50);
    });

    it('should track FPS', () => {
      const { result } = renderHook(() => useCalculatorPerformance());

      // Simulate multiple frames
      act(() => {
        for (let i = 0; i < 60; i++) {
          nowValue += 16.67; // ~60fps
          requestAnimationFrame(() => {});
        }
      });

      expect(result.current.getMetrics().fps).toBeCloseTo(60, 0);
    });

    it('should monitor memory usage', () => {
      const mockMemory = {
        usedJSHeapSize: 50 * 1024 * 1024 // 50MB
      };
      Object.defineProperty(performance, 'memory', {
        get: () => mockMemory
      });

      const { result } = renderHook(() => useCalculatorPerformance());

      act(() => {
        // Trigger memory check
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.getMetrics().memoryUsage).toBeCloseTo(50, 0);
    });

    it('should report metrics when thresholds exceeded', async () => {
      const reportingEndpoint = 'https://metrics.example.com';
      const { result } = renderHook(() => useCalculatorPerformance({
        reportingEndpoint,
        thresholds: {
          maxCalculationTime: 50
        }
      }));

      act(() => {
        result.current.startCalculation();
        nowValue = 100; // Exceed threshold
        result.current.endCalculation();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        reportingEndpoint,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should handle batch updates efficiently', () => {
      const { result } = renderHook(() => useCalculatorPerformance());
      const updates = Array.from({ length: 100 }, (_, i) => i);

      act(() => {
        result.current.startCalculation();
        updates.forEach(() => {
          nowValue += 1;
        });
        result.current.endCalculation();
      });

      expect(result.current.getMetrics().calculationTime).toBeLessThan(16);
    });
  });

  describe('Accessibility Monitoring', () => {
    it('should detect ARIA violations', () => {
      const { result } = renderHook(() => useAccessibilityMonitoring());

      act(() => {
        const button = document.createElement('button');
        button.setAttribute('aria-invalid', 'invalid-value');
        document.body.appendChild(button);

        // Trigger mutation observer
        const observer = new MutationObserver(() => {});
        observer.callback([{
          type: 'childList',
          addedNodes: [button],
          removedNodes: [],
          target: document.body
        }]);
      });

      expect(result.current.getMetrics().violations).toContainEqual(
        expect.objectContaining({
          type: 'error',
          message: expect.stringContaining('Invalid ARIA attribute')
        })
      );
    });

    it('should monitor heading hierarchy', () => {
      const { result } = renderHook(() => useAccessibilityMonitoring());

      act(() => {
        const h1 = document.createElement('h1');
        const h3 = document.createElement('h3');
        document.body.appendChild(h1);
        document.body.appendChild(h3);

        // Trigger mutation observer
        const observer = new MutationObserver(() => {});
        observer.callback([{
          type: 'childList',
          addedNodes: [h1, h3],
          removedNodes: [],
          target: document.body
        }]);
      });

      expect(result.current.getMetrics().violations).toContainEqual(
        expect.objectContaining({
          type: 'error',
          message: expect.stringContaining('Skipped heading level')
        })
      );
    });

    it('should check form control labels', () => {
      const { result } = renderHook(() => useAccessibilityMonitoring());

      act(() => {
        const input = document.createElement('input');
        document.body.appendChild(input);

        // Trigger mutation observer
        const observer = new MutationObserver(() => {});
        observer.callback([{
          type: 'childList',
          addedNodes: [input],
          removedNodes: [],
          target: document.body
        }]);
      });

      expect(result.current.getMetrics().missingLabels).toBeGreaterThan(0);
    });

    it('should monitor keyboard accessibility', () => {
      const { result } = renderHook(() => useAccessibilityMonitoring());

      act(() => {
        const div = document.createElement('div');
        div.setAttribute('onclick', 'void(0)');
        document.body.appendChild(div);

        // Trigger mutation observer
        const observer = new MutationObserver(() => {});
        observer.callback([{
          type: 'childList',
          addedNodes: [div],
          removedNodes: [],
          target: document.body
        }]);
      });

      expect(result.current.getMetrics().keyboardTraps).toBeGreaterThan(0);
    });

    it('should check color contrast', () => {
      const { result } = renderHook(() => useAccessibilityMonitoring());

      act(() => {
        const text = document.createElement('p');
        text.style.color = '#777';
        text.style.backgroundColor = '#666';
        text.textContent = 'Low contrast text';
        document.body.appendChild(text);

        // Trigger mutation observer
        const observer = new MutationObserver(() => {});
        observer.callback([{
          type: 'childList',
          addedNodes: [text],
          removedNodes: [],
          target: document.body
        }]);
      });

      expect(result.current.getMetrics().colorContrastIssues).toBeGreaterThan(0);
    });
  });

  describe('Calculator-Specific Monitoring', () => {
    describe('Budget Calculator', () => {
      it('should monitor category inputs', () => {
        const { result } = renderHook(() => useAccessibilityMonitoring());

        act(() => {
          const input = document.createElement('input');
          input.setAttribute('data-category-input', 'true');
          document.body.appendChild(input);

          // Trigger mutation observer
          const observer = new MutationObserver(() => {});
          observer.callback([{
            type: 'childList',
            addedNodes: [input],
            removedNodes: [],
            target: document.body
          }]);
        });

        expect(result.current.getMetrics().violations).toContainEqual(
          expect.objectContaining({
            message: expect.stringContaining('Category input')
          })
        );
      });
    });

    describe('Investment Calculator', () => {
      it('should monitor chart accessibility', () => {
        const { result } = renderHook(() => useAccessibilityMonitoring());

        act(() => {
          const chart = document.createElement('div');
          chart.setAttribute('data-chart', 'true');
          document.body.appendChild(chart);

          // Trigger mutation observer
          const observer = new MutationObserver(() => {});
          observer.callback([{
            type: 'childList',
            addedNodes: [chart],
            removedNodes: [],
            target: document.body
          }]);
        });

        expect(result.current.getMetrics().violations).toContainEqual(
          expect.objectContaining({
            message: expect.stringContaining('Chart')
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle reporting failures gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAccessibilityMonitoring({
        reportingEndpoint: 'https://metrics.example.com'
      }));

      act(() => {
        result.current.reportMetrics();
      });

      // Should not throw
      expect(console.error).toHaveBeenCalledWith(
        'Failed to report accessibility metrics:',
        expect.any(Error)
      );
    });

    it('should recover from observer errors', () => {
      const { result } = renderHook(() => useAccessibilityMonitoring());

      act(() => {
        // Simulate observer error
        const observer = new MutationObserver(() => {});
        observer.callback([{
          type: 'childList',
          addedNodes: [null], // Invalid node
          removedNodes: [],
          target: document.body
        }]);
      });

      // Should continue monitoring
      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('Resource Management', () => {
    it('should clean up resources on unmount', () => {
      const { unmount } = renderHook(() => useAccessibilityMonitoring());

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle rapid mount/unmount cycles', () => {
      const { rerender, unmount } = renderHook(() => useAccessibilityMonitoring());

      // Multiple render cycles
      for (let i = 0; i < 10; i++) {
        rerender();
      }
      unmount();

      // Should only create one observer
      expect(MutationObserver).toHaveBeenCalledTimes(1);
    });
  });
});


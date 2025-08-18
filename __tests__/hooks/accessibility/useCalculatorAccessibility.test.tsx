import { renderHook, act } from '@testing-library/react';
import { useCalculatorAccessibility,
  useBudgetCalculatorAccessibility,
  useInvestmentCalculatorAccessibility,
  useDebtCalculatorAccessibility,
  useTaxCalculatorAccessibility,
  useRetirementCalculatorAccessibility,
  useMortgageCalculatorAccessibility
} from '@/lib/hooks/accessibility/useCalculatorAccessibility';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    events: {
      on: jest.fn(),
      off: jest.fn()
    }
  })
}));

describe('Calculator Accessibility', () => {
  // Helper to create a mock element
  const createMockElement = () => {
    const element = document.createElement('div');
    element.setAttribute = jest.fn();
    element.style = {};
    return element;
  };

  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Base Accessibility Hook', () => {
    it('should create and manage announcer element', () => {
      const { result, unmount } = renderHook(() => useCalculatorAccessibility());
      
      expect(document.querySelector('[role="status"]')).toBeTruthy();
      
      unmount();
      expect(document.querySelector('[role="status"]')).toBeFalsy();
    });

    it('should announce messages with correct politeness', () => {
      const { result } = renderHook(() => useCalculatorAccessibility());
      const message = 'Test announcement';

      act(() => {
        result.current.announce(message, { politeness: 'assertive' });
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer).toHaveAttribute('aria-live', 'assertive');
      expect(announcer?.textContent).toBe(message);
    });

    it('should manage focus history', () => {
      const { result } = renderHook(() => useCalculatorAccessibility());
      const element1 = createMockElement();
      const element2 = createMockElement();

      act(() => {
        result.current.trackFocus(element1);
        result.current.trackFocus(element2);
        result.current.restoreFocus();
      });

      expect(element1.focus).not.toHaveBeenCalled();
      expect(element2.focus).toHaveBeenCalled();
    });

    it('should handle error focus', () => {
      const { result } = renderHook(() => 
        useCalculatorAccessibility({ focusOnError: true })
      );
      const errorElement = createMockElement();
      const errorMessage = 'Invalid input';

      act(() => {
        result.current.handleError(errorElement, errorMessage);
      });

      expect(errorElement.focus).toHaveBeenCalled();
      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toBe(errorMessage);
    });

    it('should format numbers for screen readers', () => {
      const { result } = renderHook(() => useCalculatorAccessibility());
      
      const currencyResult = result.current.formatNumberForScreenReader(1234.56, 'currency');
      expect(currencyResult).toMatch(/1,234.56.*dollars/);

      const percentResult = result.current.formatNumberForScreenReader(12.34, 'percent');
      expect(percentResult).toMatch(/12.3.*percent/);

      const numberResult = result.current.formatNumberForScreenReader(1234567);
      expect(numberResult).toBe('1,234,567');
    });
  });

  describe('Budget Calculator Accessibility', () => {
    it('should announce budget updates', () => {
      const { result } = renderHook(() => useBudgetCalculatorAccessibility());
      const categories = [
        { name: 'Housing', amount: 1500, type: 'essential' },
        { name: 'Food', amount: 500, type: 'essential' }
      ];

      act(() => {
        result.current.announceBudgetUpdate(categories, 2000);
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toContain('Budget updated');
      expect(announcer?.textContent).toContain('2,000 dollars');
      expect(announcer?.textContent).toContain('Housing');
      expect(announcer?.textContent).toContain('Food');
    });
  });

  describe('Investment Calculator Accessibility', () => {
    it('should announce investment projections', () => {
      const { result } = renderHook(() => useInvestmentCalculatorAccessibility());

      act(() => {
        result.current.announceProjection(500000, 30, 7);
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toContain('500,000 dollars');
      expect(announcer?.textContent).toContain('30 years');
      expect(announcer?.textContent).toContain('7 percent');
    });
  });

  describe('Debt Calculator Accessibility', () => {
    it('should announce payoff plan', () => {
      const { result } = renderHook(() => useDebtCalculatorAccessibility());

      act(() => {
        result.current.announcePayoffPlan(25000, 36, 'avalanche');
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toContain('25,000 dollars');
      expect(announcer?.textContent).toContain('36 months');
      expect(announcer?.textContent).toContain('avalanche strategy');
    });
  });

  describe('Tax Calculator Accessibility', () => {
    it('should announce tax breakdown', () => {
      const { result } = renderHook(() => useTaxCalculatorAccessibility());
      const brackets = [
        { rate: 10, tax: 1000 },
        { rate: 12, tax: 2000 }
      ];

      act(() => {
        result.current.announceTaxBreakdown(3000, 15, brackets);
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toContain('3,000 dollars');
      expect(announcer?.textContent).toContain('15 percent');
      expect(announcer?.textContent).toContain('10 percent bracket');
      expect(announcer?.textContent).toContain('12 percent bracket');
    });
  });

  describe('Retirement Calculator Accessibility', () => {
    it('should announce retirement projection', () => {
      const { result } = renderHook(() => useRetirementCalculatorAccessibility());

      act(() => {
        result.current.announceRetirementProjection(2000000, 8000, 25);
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toContain('2,000,000 dollars');
      expect(announcer?.textContent).toContain('8,000 dollars');
      expect(announcer?.textContent).toContain('25 years');
    });
  });

  describe('Mortgage Calculator Accessibility', () => {
    it('should announce mortgage details', () => {
      const { result } = renderHook(() => useMortgageCalculatorAccessibility());

      act(() => {
        result.current.announceMortgageDetails(2500, 180000, 30);
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toContain('2,500 dollars');
      expect(announcer?.textContent).toContain('180,000 dollars');
      expect(announcer?.textContent).toContain('30 years');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle keyboard shortcuts', () => {
      const { result } = renderHook(() => useCalculatorAccessibility());
      const announcer = document.querySelector('[role="status"]');

      // Simulate keyboard shortcuts
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'c',
          altKey: true
        }));
      });
      expect(announcer?.textContent).toContain('Calculator cleared');

      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'r',
          altKey: true
        }));
      });
      expect(announcer?.textContent).toContain('Recalculating');
    });

    it('should handle escape key for focus management', () => {
      const { result } = renderHook(() => useCalculatorAccessibility());
      const element1 = createMockElement();
      const element2 = createMockElement();

      act(() => {
        result.current.trackFocus(element1);
        result.current.trackFocus(element2);
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Escape'
        }));
      });

      expect(element1.focus).toHaveBeenCalled();
    });
  });

  describe('Route Changes', () => {
    it('should announce page changes', () => {
      const { result } = renderHook(() => useCalculatorAccessibility());
      document.title = 'New Calculator Page';

      // Simulate route change
      act(() => {
        const routeChangeHandler = result.current;
        if (routeChangeHandler) {
          routeChangeHandler.announce('Navigated to New Calculator Page', {
            priority: 'high',
            politeness: 'assertive'
          });
        }
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toContain('Navigated to New Calculator Page');
    });
  });

  describe('Memory Management', () => {
    it('should clean up on unmount', () => {
      const { result, unmount } = renderHook(() => useCalculatorAccessibility());
      const element = createMockElement();

      act(() => {
        result.current.trackFocus(element);
      });

      unmount();

      // Focus history should be cleared
      act(() => {
        result.current.restoreFocus();
      });
      expect(element.focus).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle multiple errors appropriately', () => {
      const { result } = renderHook(() => 
        useCalculatorAccessibility({ focusOnError: true })
      );
      const error1 = createMockElement();
      const error2 = createMockElement();

      act(() => {
        result.current.handleError(error1, 'First error');
        result.current.handleError(error2, 'Second error');
      });

      expect(error1.focus).toHaveBeenCalledTimes(1);
      expect(error2.focus).toHaveBeenCalledTimes(1);
      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toBe('Second error');
    });
  });

  describe('Announcement Priority', () => {
    it('should respect announcement priorities', () => {
      const { result } = renderHook(() => useCalculatorAccessibility());

      act(() => {
        result.current.announce('Low priority', { priority: 'low' });
        result.current.announce('High priority', { priority: 'high' });
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toBe('High priority');
    });

    it('should clear announcements after specified delay', async () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useCalculatorAccessibility());

      act(() => {
        result.current.announce('Test message', { clearAfter: 1000 });
      });

      const announcer = document.querySelector('[role="status"]');
      expect(announcer?.textContent).toBe('Test message');

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(announcer?.textContent).toBe('');
      jest.useRealTimers();
    });
  });
});


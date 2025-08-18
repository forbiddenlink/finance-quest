import { useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

interface AccessibilityConfig {
  announceResults?: boolean;
  autoFocus?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
  focusOnError?: boolean;
}

interface AnnouncementOptions {
  priority?: 'high' | 'medium' | 'low';
  politeness?: 'assertive' | 'polite';
  clearAfter?: number;
}

export function useCalculatorAccessibility(config: AccessibilityConfig = {}) {
  const router = useRouter();
  const announcerRef = useRef<HTMLDivElement | null>(null);
  const previousAnnouncementRef = useRef<string>('');
  const focusHistoryRef = useRef<HTMLElement[]>([]);
  const errorRef = useRef<HTMLElement | null>(null);

  // Create or get announcer element
  useEffect(() => {
    if (!announcerRef.current) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', config.ariaLive || 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.padding = '0';
      announcer.style.margin = '-1px';
      announcer.style.overflow = 'hidden';
      announcer.style.clip = 'rect(0, 0, 0, 0)';
      announcer.style.whiteSpace = 'nowrap';
      announcer.style.border = '0';
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, [config.ariaLive]);

  // Announce messages to screen readers
  const announce = useCallback((
    message: string,
    options: AnnouncementOptions = {}
  ) => {
    if (!announcerRef.current || message === previousAnnouncementRef.current) {
      return;
    }

    // Clear previous announcement if it's low priority
    if (previousAnnouncementRef.current && options.priority === 'low') {
      announcerRef.current.textContent = '';
      // Small delay to ensure screen readers recognize the change
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message;
        }
      }, 50);
    } else {
      announcerRef.current.textContent = message;
    }

    previousAnnouncementRef.current = message;

    // Clear announcement after delay if specified
    if (options.clearAfter) {
      setTimeout(() => {
        if (announcerRef.current && 
            announcerRef.current.textContent === message) {
          announcerRef.current.textContent = '';
          previousAnnouncementRef.current = '';
        }
      }, options.clearAfter);
    }
  }, []);

  // Announce calculation results
  const announceResults = useCallback((results: any) => {
    if (!config.announceResults) return;

    const formatMessage = (value: number, label: string) => {
      if (label.toLowerCase().includes('percent') || 
          label.toLowerCase().includes('rate')) {
        return `${value.toFixed(1)}%`;
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    };

    const messages = Object.entries(results)
      .filter(([key, value]) => 
        typeof value === 'number' && !key.toLowerCase().includes('raw'))
      .map(([key, value]) => {
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .toLowerCase()
          .trim();
        return `${label}: ${formatMessage(value as number, label)}`;
      });

    announce(messages.join('. '), {
      priority: 'medium',
      politeness: 'polite',
      clearAfter: 5000
    });
  }, [config.announceResults, announce]);

  // Manage focus history
  const trackFocus = useCallback((element: HTMLElement) => {
    focusHistoryRef.current.push(element);
    if (focusHistoryRef.current.length > 10) {
      focusHistoryRef.current.shift();
    }
  }, []);

  // Restore focus to previous element
  const restoreFocus = useCallback(() => {
    const previousElement = focusHistoryRef.current.pop();
    if (previousElement && document.body.contains(previousElement)) {
      previousElement.focus();
    }
  }, []);

  // Handle error focus
  const handleError = useCallback((
    element: HTMLElement,
    message: string
  ) => {
    if (config.focusOnError) {
      errorRef.current = element;
      element.focus();
      announce(message, {
        priority: 'high',
        politeness: 'assertive'
      });
    }
  }, [config.focusOnError, announce]);

  // Format numbers for screen readers
  const formatNumberForScreenReader = useCallback((
    value: number,
    type: 'currency' | 'percent' | 'number' = 'number'
  ) => {
    switch (type) {
      case 'currency':
        return `${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)} dollars`;
      case 'percent':
        return `${value.toFixed(1)} percent`;
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      // Handle Escape key
      if (event.key === 'Escape') {
        restoreFocus();
      }

      // Handle calculator-specific shortcuts
      if (event.altKey) {
        switch (event.key) {
          case 'c':
            // Clear calculator
            announce('Calculator cleared', {
              priority: 'low',
              politeness: 'polite'
            });
            break;
          case 'r':
            // Recalculate
            announce('Recalculating...', {
              priority: 'low',
              politeness: 'polite'
            });
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [announce, restoreFocus]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      // Clear focus history on route change
      focusHistoryRef.current = [];
      // Clear error reference
      errorRef.current = null;
      // Announce page change
      announce(`Navigated to ${document.title}`, {
        priority: 'high',
        politeness: 'assertive'
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router, announce]);

  return {
    announce,
    announceResults,
    trackFocus,
    restoreFocus,
    handleError,
    formatNumberForScreenReader,
    // Refs for component access
    announcerRef,
    errorRef
  };
}

// Calculator-specific accessibility hooks
export function useBudgetCalculatorAccessibility() {
  const accessibility = useCalculatorAccessibility({
    announceResults: true,
    focusOnError: true
  });

  const announceBudgetUpdate = useCallback((
    categories: Array<{ name: string; amount: number; type: string }>,
    total: number
  ) => {
    const message = `Budget updated. Total expenses: ${
      accessibility.formatNumberForScreenReader(total, 'currency')
    }. Categories: ${
      categories
        .map(c => `${c.name}: ${
          accessibility.formatNumberForScreenReader(c.amount, 'currency')
        }`)
        .join(', ')
    }`;

    accessibility.announce(message, {
      priority: 'medium',
      politeness: 'polite'
    });
  }, [accessibility]);

  return {
    ...accessibility,
    announceBudgetUpdate
  };
}

export function useInvestmentCalculatorAccessibility() {
  const accessibility = useCalculatorAccessibility({
    announceResults: true,
    focusOnError: true
  });

  const announceProjection = useCallback((
    futureValue: number,
    years: number,
    returnRate: number
  ) => {
    const message = `Investment projection: ${
      accessibility.formatNumberForScreenReader(futureValue, 'currency')
    } after ${years} years at ${
      accessibility.formatNumberForScreenReader(returnRate, 'percent')
    } return rate`;

    accessibility.announce(message, {
      priority: 'medium',
      politeness: 'polite'
    });
  }, [accessibility]);

  return {
    ...accessibility,
    announceProjection
  };
}

export function useDebtCalculatorAccessibility() {
  const accessibility = useCalculatorAccessibility({
    announceResults: true,
    focusOnError: true
  });

  const announcePayoffPlan = useCallback((
    totalDebt: number,
    monthsToPayoff: number,
    strategy: string
  ) => {
    const message = `Using ${strategy} strategy, ${
      accessibility.formatNumberForScreenReader(totalDebt, 'currency')
    } will be paid off in ${monthsToPayoff} months`;

    accessibility.announce(message, {
      priority: 'medium',
      politeness: 'polite'
    });
  }, [accessibility]);

  return {
    ...accessibility,
    announcePayoffPlan
  };
}

export function useTaxCalculatorAccessibility() {
  const accessibility = useCalculatorAccessibility({
    announceResults: true,
    focusOnError: true
  });

  const announceTaxBreakdown = useCallback((
    totalTax: number,
    effectiveRate: number,
    brackets: Array<{ rate: number; tax: number }>
  ) => {
    const message = `Total tax: ${
      accessibility.formatNumberForScreenReader(totalTax, 'currency')
    }. Effective tax rate: ${
      accessibility.formatNumberForScreenReader(effectiveRate, 'percent')
    }. Breakdown by bracket: ${
      brackets
        .map(b => `${
          accessibility.formatNumberForScreenReader(b.rate, 'percent')
        } bracket: ${
          accessibility.formatNumberForScreenReader(b.tax, 'currency')
        }`)
        .join(', ')
    }`;

    accessibility.announce(message, {
      priority: 'medium',
      politeness: 'polite'
    });
  }, [accessibility]);

  return {
    ...accessibility,
    announceTaxBreakdown
  };
}

export function useRetirementCalculatorAccessibility() {
  const accessibility = useCalculatorAccessibility({
    announceResults: true,
    focusOnError: true
  });

  const announceRetirementProjection = useCallback((
    projectedSavings: number,
    monthlyIncome: number,
    yearsToRetirement: number
  ) => {
    const message = `Retirement projection: ${
      accessibility.formatNumberForScreenReader(projectedSavings, 'currency')
    } providing monthly income of ${
      accessibility.formatNumberForScreenReader(monthlyIncome, 'currency')
    } in ${yearsToRetirement} years`;

    accessibility.announce(message, {
      priority: 'medium',
      politeness: 'polite'
    });
  }, [accessibility]);

  return {
    ...accessibility,
    announceRetirementProjection
  };
}

export function useMortgageCalculatorAccessibility() {
  const accessibility = useCalculatorAccessibility({
    announceResults: true,
    focusOnError: true
  });

  const announceMortgageDetails = useCallback((
    monthlyPayment: number,
    totalInterest: number,
    term: number
  ) => {
    const message = `Monthly payment: ${
      accessibility.formatNumberForScreenReader(monthlyPayment, 'currency')
    }. Total interest: ${
      accessibility.formatNumberForScreenReader(totalInterest, 'currency')
    } over ${term} years`;

    accessibility.announce(message, {
      priority: 'medium',
      politeness: 'polite'
    });
  }, [accessibility]);

  return {
    ...accessibility,
    announceMortgageDetails
  };
}


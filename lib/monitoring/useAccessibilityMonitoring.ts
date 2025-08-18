import { useRef, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface AccessibilityViolation {
  type: 'error' | 'warning';
  message: string;
  element: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcag?: string;
  timestamp: number;
}

interface AccessibilityMetrics {
  violations: AccessibilityViolation[];
  ariaAttributes: number;
  focusableElements: number;
  headingLevels: number[];
  missingLabels: number;
  keyboardTraps: number;
  colorContrastIssues: number;
}

interface AccessibilityThresholds {
  maxViolations?: number;
  maxMissingLabels?: number;
  maxKeyboardTraps?: number;
  maxContrastIssues?: number;
}

interface MonitoringConfig {
  enableLogging?: boolean;
  reportingEndpoint?: string;
  sampleRate?: number;
  thresholds?: AccessibilityThresholds;
}

const DEFAULT_THRESHOLDS: Required<AccessibilityThresholds> = {
  maxViolations: 0,
  maxMissingLabels: 0,
  maxKeyboardTraps: 0,
  maxContrastIssues: 0
};

export function useAccessibilityMonitoring(config: MonitoringConfig = {}) {
  const metricsRef = useRef<AccessibilityMetrics>({
    violations: [],
    ariaAttributes: 0,
    focusableElements: 0,
    headingLevels: [],
    missingLabels: 0,
    keyboardTraps: 0,
    colorContrastIssues: 0
  });

  const thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds };
  const observerRef = useRef<MutationObserver | null>(null);

  // Report metrics
  const reportMetrics = useCallback(
    debounce(async (metrics: AccessibilityMetrics) => {
      if (config.reportingEndpoint) {
        try {
          await fetch(config.reportingEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: Date.now(),
              metrics,
              url: window.location.href,
              userAgent: navigator.userAgent
            })
          });
        } catch (error) {
          console.error('Failed to report accessibility metrics:', error);
        }
      }

      if (config.enableLogging) {
        console.log('Accessibility metrics:', metrics);
      }
    }, 1000),
    [config.reportingEndpoint, config.enableLogging]
  );

  // Check ARIA attributes
  const checkAriaAttributes = useCallback((element: Element) => {
    const ariaAttrs = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('aria-'));

    // Check for invalid ARIA attributes
    ariaAttrs.forEach(attr => {
      if (!isValidAriaAttribute(attr.name, attr.value)) {
        metricsRef.current.violations.push({
          type: 'error',
          message: `Invalid ARIA attribute: ${attr.name}`,
          element: getElementIdentifier(element),
          impact: 'serious',
          wcag: 'WCAG 4.1.2',
          timestamp: Date.now()
        });
      }
    });

    metricsRef.current.ariaAttributes += ariaAttrs.length;
  }, []);

  // Check heading hierarchy
  const checkHeadingHierarchy = useCallback((element: Element) => {
    if (element.tagName.match(/^H[1-6]$/)) {
      const level = parseInt(element.tagName[1]);
      metricsRef.current.headingLevels.push(level);

      // Check for skipped heading levels
      const lastLevel = metricsRef.current.headingLevels[
        metricsRef.current.headingLevels.length - 2
      ];
      if (lastLevel && level - lastLevel > 1) {
        metricsRef.current.violations.push({
          type: 'error',
          message: `Skipped heading level: from H${lastLevel} to H${level}`,
          element: getElementIdentifier(element),
          impact: 'serious',
          wcag: 'WCAG 1.3.1',
          timestamp: Date.now()
        });
      }
    }
  }, []);

  // Check form controls
  const checkFormControls = useCallback((element: Element) => {
    if (isFormControl(element)) {
      const hasLabel = hasValidLabel(element);
      if (!hasLabel) {
        metricsRef.current.missingLabels++;
        metricsRef.current.violations.push({
          type: 'error',
          message: 'Form control missing label',
          element: getElementIdentifier(element),
          impact: 'critical',
          wcag: 'WCAG 1.3.1',
          timestamp: Date.now()
        });
      }
    }
  }, []);

  // Check keyboard accessibility
  const checkKeyboardAccessibility = useCallback((element: Element) => {
    if (isInteractive(element)) {
      if (!isKeyboardAccessible(element)) {
        metricsRef.current.keyboardTraps++;
        metricsRef.current.violations.push({
          type: 'error',
          message: 'Element not keyboard accessible',
          element: getElementIdentifier(element),
          impact: 'critical',
          wcag: 'WCAG 2.1.1',
          timestamp: Date.now()
        });
      }
    }
  }, []);

  // Check color contrast
  const checkColorContrast = useCallback((element: Element) => {
    if (hasTextContent(element)) {
      const contrast = getColorContrast(element);
      if (!meetsContrastRequirements(contrast)) {
        metricsRef.current.colorContrastIssues++;
        metricsRef.current.violations.push({
          type: 'error',
          message: 'Insufficient color contrast',
          element: getElementIdentifier(element),
          impact: 'serious',
          wcag: 'WCAG 1.4.3',
          timestamp: Date.now()
        });
      }
    }
  }, []);

  // Monitor DOM changes
  const startMonitoring = useCallback(() => {
    if (observerRef.current) return;

    observerRef.current = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof Element) {
              checkAriaAttributes(node);
              checkHeadingHierarchy(node);
              checkFormControls(node);
              checkKeyboardAccessibility(node);
              checkColorContrast(node);
            }
          });
        } else if (mutation.type === 'attributes') {
          const element = mutation.target as Element;
          checkAriaAttributes(element);
          checkFormControls(element);
          checkKeyboardAccessibility(element);
          checkColorContrast(element);
        }
      });

      // Check thresholds
      if (metricsRef.current.violations.length > thresholds.maxViolations) {
        console.error(`Accessibility violations exceed threshold: ${
          metricsRef.current.violations.length
        }`);
      }
      if (metricsRef.current.missingLabels > thresholds.maxMissingLabels) {
        console.error(`Missing labels exceed threshold: ${
          metricsRef.current.missingLabels
        }`);
      }
      if (metricsRef.current.keyboardTraps > thresholds.maxKeyboardTraps) {
        console.error(`Keyboard traps exceed threshold: ${
          metricsRef.current.keyboardTraps
        }`);
      }
      if (metricsRef.current.colorContrastIssues > thresholds.maxContrastIssues) {
        console.error(`Color contrast issues exceed threshold: ${
          metricsRef.current.colorContrastIssues
        }`);
      }

      reportMetrics(metricsRef.current);
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-*', 'role', 'tabindex', 'style']
    });
  }, [
    checkAriaAttributes,
    checkHeadingHierarchy,
    checkFormControls,
    checkKeyboardAccessibility,
    checkColorContrast,
    reportMetrics,
    thresholds
  ]);

  // Initialize monitoring
  useEffect(() => {
    startMonitoring();
    return () => {
      observerRef.current?.disconnect();
      reportMetrics.cancel();
    };
  }, [startMonitoring, reportMetrics]);

  return {
    getMetrics: () => ({ ...metricsRef.current }),
    reportMetrics: () => reportMetrics(metricsRef.current),
    clearViolations: () => {
      metricsRef.current.violations = [];
      metricsRef.current.missingLabels = 0;
      metricsRef.current.keyboardTraps = 0;
      metricsRef.current.colorContrastIssues = 0;
    }
  };
}

// Calculator-specific accessibility monitoring
export function useBudgetCalculatorAccessibilityMonitoring() {
  const monitoring = useAccessibilityMonitoring({
    thresholds: {
      maxViolations: 0,
      maxMissingLabels: 0
    }
  });

  return {
    ...monitoring,
    // Add budget-specific monitoring
    trackCategoryUpdate: () => {
      // Monitor category form controls
      const categoryInputs = document.querySelectorAll('[data-category-input]');
      categoryInputs.forEach(input => {
        if (!hasValidLabel(input)) {
          monitoring.getMetrics().violations.push({
            type: 'error',
            message: 'Category input missing label',
            element: getElementIdentifier(input),
            impact: 'critical',
            wcag: 'WCAG 1.3.1',
            timestamp: Date.now()
          });
        }
      });
    }
  };
}

export function useInvestmentCalculatorAccessibilityMonitoring() {
  const monitoring = useAccessibilityMonitoring({
    thresholds: {
      maxViolations: 0,
      maxContrastIssues: 0
    }
  });

  return {
    ...monitoring,
    // Add investment-specific monitoring
    trackChartAccessibility: () => {
      // Monitor chart elements
      const charts = document.querySelectorAll('[data-chart]');
      charts.forEach(chart => {
        if (!chart.hasAttribute('role') || !chart.hasAttribute('aria-label')) {
          monitoring.getMetrics().violations.push({
            type: 'error',
            message: 'Chart missing accessibility attributes',
            element: getElementIdentifier(chart),
            impact: 'serious',
            wcag: 'WCAG 1.1.1',
            timestamp: Date.now()
          });
        }
      });
    }
  };
}

// Helper functions
function isValidAriaAttribute(name: string, value: string): boolean {
  // Implement ARIA validation logic
  return true; // Placeholder
}

function getElementIdentifier(element: Element): string {
  return element.id || element.tagName.toLowerCase();
}

function isFormControl(element: Element): boolean {
  const formControls = ['input', 'select', 'textarea', 'button'];
  return formControls.includes(element.tagName.toLowerCase());
}

function hasValidLabel(element: Element): boolean {
  // Implement label validation logic
  return true; // Placeholder
}

function isInteractive(element: Element): boolean {
  const interactive = ['button', 'a', 'input', 'select', 'textarea'];
  return interactive.includes(element.tagName.toLowerCase()) ||
    element.hasAttribute('tabindex');
}

function isKeyboardAccessible(element: Element): boolean {
  // Implement keyboard accessibility check
  return true; // Placeholder
}

function hasTextContent(element: Element): boolean {
  return element.textContent !== null && element.textContent.trim().length > 0;
}

function getColorContrast(element: Element): number {
  // Implement color contrast calculation
  return 4.5; // Placeholder
}

function meetsContrastRequirements(contrast: number): boolean {
  return contrast >= 4.5;
}


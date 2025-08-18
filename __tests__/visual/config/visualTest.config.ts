export const DEFAULT_VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  smallDesktop: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 }
};

export const COMMON_WAIT_OPTIONS = {
  timeout: 5000,
  state: 'visible' as const
};

export const CALCULATOR_STATES = {
  initial: {
    name: 'initial-state',
    waitFor: {
      selector: '[data-testid="calculator-form"]',
      ...COMMON_WAIT_OPTIONS
    }
  },
  loading: {
    name: 'loading-state',
    waitFor: {
      selector: '[data-testid="loading-spinner"]',
      ...COMMON_WAIT_OPTIONS
    }
  },
  results: {
    name: 'results-state',
    waitFor: {
      selector: '[data-testid="analysis-results"]',
      ...COMMON_WAIT_OPTIONS
    }
  },
  error: {
    name: 'error-state',
    waitFor: {
      selector: '[data-testid="error-message"]',
      ...COMMON_WAIT_OPTIONS
    }
  }
};

export const THEME_MODES = {
  light: {
    name: 'light-mode',
    setup: async (page: any) => {
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
      });
    }
  },
  dark: {
    name: 'dark-mode',
    setup: async (page: any) => {
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
    }
  }
};

export const ANIMATION_STATES = {
  stable: {
    waitFor: {
      state: 'stable' as const,
      timeout: 5000
    }
  }
};

export const CHART_INTERACTIONS = {
  tooltip: {
    action: 'hover' as const,
    target: '[data-testid="chart"] path'
  }
};

export const ACCESSIBILITY_STATES = {
  focus: {
    name: 'focus-state',
    interactions: [
      { action: 'click' as const, target: 'input' },
      { action: 'type' as const, target: 'input', value: 'test' }
    ]
  },
  keyboard: {
    name: 'keyboard-navigation',
    interactions: [
      { action: 'click' as const, target: 'body' },
      { action: 'keyboard' as const, target: 'Tab' }
    ]
  }
};

export const RESPONSIVE_TEST_CONFIG = {
  name: 'responsive-layout',
  viewports: [
    DEFAULT_VIEWPORTS.desktop,
    DEFAULT_VIEWPORTS.smallDesktop,
    DEFAULT_VIEWPORTS.tablet,
    DEFAULT_VIEWPORTS.mobile
  ]
};

export const THEME_TEST_CONFIG = {
  viewports: [
    DEFAULT_VIEWPORTS.desktop,
    DEFAULT_VIEWPORTS.mobile
  ]
};

export const ERROR_STATES = {
  validation: {
    name: 'validation-error',
    setup: async (page: any) => {
      await page.fill('input', '-1');
      await page.click('button[type="submit"]');
    }
  },
  network: {
    name: 'network-error',
    setup: async (page: any) => {
      await page.route('**/api/**', route => route.abort());
      await page.click('button[type="submit"]');
    }
  }
};

export const CALCULATOR_TEST_SUITE = {
  basic: [
    CALCULATOR_STATES.initial,
    CALCULATOR_STATES.loading,
    CALCULATOR_STATES.results,
    CALCULATOR_STATES.error
  ],
  comprehensive: [
    ...CALCULATOR_TEST_SUITE.basic,
    THEME_MODES.light,
    THEME_MODES.dark,
    RESPONSIVE_TEST_CONFIG,
    ACCESSIBILITY_STATES.focus,
    ACCESSIBILITY_STATES.keyboard,
    ERROR_STATES.validation,
    ERROR_STATES.network
  ]
};

export const generateTestConfig = (
  component: string,
  state: keyof typeof CALCULATOR_STATES,
  options?: {
    viewports?: Array<{ width: number; height: number }>;
    interactions?: Array<{ action: string; target: string; value?: string }>;
    waitFor?: { selector?: string; timeout?: number; state?: string };
  }
) => ({
  name: CALCULATOR_STATES[state].name,
  component,
  viewports: options?.viewports || [DEFAULT_VIEWPORTS.desktop],
  interactions: options?.interactions,
  waitFor: options?.waitFor || CALCULATOR_STATES[state].waitFor
});


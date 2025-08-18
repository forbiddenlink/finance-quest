import { test, expect } from '@playwright/test';
import { VisualRegressionTester } from '@/lib/testing/visual/VisualRegressionTester';
import {
  DEFAULT_VIEWPORTS,
  CALCULATOR_STATES,
  THEME_MODES,
  ANIMATION_STATES,
  CHART_INTERACTIONS,
  ACCESSIBILITY_STATES,
  RESPONSIVE_TEST_CONFIG,
  generateTestConfig
} from '../config/visualTest.config';

test.describe('Cryptocurrency Allocation Calculator Visual Tests', () => {
  let tester: VisualRegressionTester;

  test.beforeEach(({ page }) => {
    tester = VisualRegressionTester.getInstance();
  });

  test('initial state', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    const config = generateTestConfig('CryptoCalculator', 'initial', {
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ]
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('portfolio input form', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Fill portfolio details
    await page.fill('[data-testid="total-portfolio-input"]', '100000');
    await page.fill('[data-testid="risk-tolerance-input"]', '7');
    await page.fill('[data-testid="investment-horizon-input"]', '5');

    const config = generateTestConfig('CryptoCalculator', 'input', {
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile],
      waitFor: {
        selector: '[data-testid="portfolio-form"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('cryptocurrency selection grid', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Select multiple cryptocurrencies
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="crypto-select-ethereum"]');
    await page.click('[data-testid="crypto-select-cardano"]');

    const config = generateTestConfig('CryptoCalculator', 'selection', {
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ],
      waitFor: {
        selector: '[data-testid="crypto-grid"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('allocation results', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Set up portfolio and calculate
    await page.fill('[data-testid="total-portfolio-input"]', '100000');
    await page.fill('[data-testid="risk-tolerance-input"]', '7');
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="crypto-select-ethereum"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CryptoCalculator', 'results', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="allocation-results"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('portfolio visualization', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Set up portfolio data
    await page.fill('[data-testid="total-portfolio-input"]', '100000');
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="crypto-select-ethereum"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CryptoCalculator', 'visualization', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="portfolio-chart"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('risk analysis view', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Set up portfolio and analyze risk
    await page.fill('[data-testid="total-portfolio-input"]', '100000');
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="analyze-risk-button"]');

    const config = generateTestConfig('CryptoCalculator', 'risk', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="risk-analysis"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('historical performance comparison', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Set up comparison
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="crypto-select-ethereum"]');
    await page.click('[data-testid="compare-performance-button"]');

    const config = generateTestConfig('CryptoCalculator', 'comparison', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="performance-chart"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('error validation display', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Trigger validation errors
    await page.fill('[data-testid="total-portfolio-input"]', '-50000');
    await page.fill('[data-testid="risk-tolerance-input"]', '12');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CryptoCalculator', 'error', {
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile]
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('responsive crypto cards', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Select cryptocurrencies
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="crypto-select-ethereum"]');

    const config = {
      name: 'responsive-crypto-cards',
      component: 'CryptoCalculator',
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.smallDesktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ],
      waitFor: {
        selector: '[data-testid="crypto-card"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('chart interactions', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Set up data and generate chart
    await page.fill('[data-testid="total-portfolio-input"]', '100000');
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = {
      name: 'chart-tooltip',
      component: 'CryptoCalculator',
      viewports: [DEFAULT_VIEWPORTS.desktop],
      interactions: [CHART_INTERACTIONS.tooltip],
      waitFor: {
        selector: '[data-testid="chart-tooltip"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('dark mode', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Set up portfolio and generate analysis
    await page.fill('[data-testid="total-portfolio-input"]', '100000');
    await page.click('[data-testid="crypto-select-bitcoin"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    // Enable dark mode
    await THEME_MODES.dark.setup(page);

    const config = {
      name: 'dark-mode-analysis',
      component: 'CryptoCalculator',
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile],
      waitFor: {
        selector: '[data-testid="allocation-results"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('loading states', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Set up data
    await page.fill('[data-testid="total-portfolio-input"]', '100000');
    await page.click('[data-testid="crypto-select-bitcoin"]');

    // Capture during calculation
    const calculatePromise = page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CryptoCalculator', 'loading');

    const results = await tester.captureComponent(page, config);
    await calculatePromise;
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('accessibility focus indicators', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    const config = {
      name: 'focus-indicators',
      component: 'CryptoCalculator',
      viewports: [DEFAULT_VIEWPORTS.desktop],
      interactions: ACCESSIBILITY_STATES.focus.interactions
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('crypto selection animations', async ({ page }) => {
    await page.goto('/calculators/crypto-allocation');

    // Select crypto to trigger animation
    await page.click('[data-testid="crypto-select-bitcoin"]');

    const config = {
      name: 'selection-animation',
      component: 'CryptoCalculator',
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="crypto-selection-animation"]',
        ...ANIMATION_STATES.stable.waitFor
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });
});


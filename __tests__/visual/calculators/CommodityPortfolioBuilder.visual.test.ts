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

test.describe('Commodity Portfolio Builder Visual Tests', () => {
  let tester: VisualRegressionTester;

  test.beforeEach(({ page }) => {
    tester = VisualRegressionTester.getInstance();
  });

  test('initial state', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    const config = generateTestConfig('CommodityBuilder', 'initial', {
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ]
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('portfolio setup form', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Fill portfolio details
    await page.fill('[data-testid="total-investment-input"]', '250000');
    await page.fill('[data-testid="investment-horizon-input"]', '10');
    await page.fill('[data-testid="inflation-expectation-input"]', '3.5');

    const config = generateTestConfig('CommodityBuilder', 'input', {
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile],
      waitFor: {
        selector: '[data-testid="portfolio-form"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('commodity selection interface', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Select multiple commodities
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="commodity-select-silver"]');
    await page.click('[data-testid="commodity-select-oil"]');

    const config = generateTestConfig('CommodityBuilder', 'selection', {
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ],
      waitFor: {
        selector: '[data-testid="commodity-grid"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('allocation recommendations', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Set up portfolio and calculate
    await page.fill('[data-testid="total-investment-input"]', '250000');
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="commodity-select-silver"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CommodityBuilder', 'recommendations', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="allocation-recommendations"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('portfolio diversification chart', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Set up portfolio data
    await page.fill('[data-testid="total-investment-input"]', '250000');
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="commodity-select-oil"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CommodityBuilder', 'diversification', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="diversification-chart"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('correlation analysis view', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Set up portfolio and analyze correlations
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="commodity-select-silver"]');
    await page.click('[data-testid="analyze-correlations-button"]');

    const config = generateTestConfig('CommodityBuilder', 'correlation', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="correlation-matrix"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('inflation protection analysis', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Set up analysis
    await page.fill('[data-testid="inflation-expectation-input"]', '4.5');
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="analyze-inflation-protection-button"]');

    const config = generateTestConfig('CommodityBuilder', 'inflation', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="inflation-analysis"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('error validation display', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Trigger validation errors
    await page.fill('[data-testid="total-investment-input"]', '-50000');
    await page.fill('[data-testid="inflation-expectation-input"]', '25');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CommodityBuilder', 'error', {
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile]
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('responsive commodity cards', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Select commodities
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="commodity-select-silver"]');

    const config = {
      name: 'responsive-commodity-cards',
      component: 'CommodityBuilder',
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.smallDesktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ],
      waitFor: {
        selector: '[data-testid="commodity-card"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('chart interactions', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Set up data and generate chart
    await page.fill('[data-testid="total-investment-input"]', '250000');
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    const config = {
      name: 'chart-tooltip',
      component: 'CommodityBuilder',
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
    await page.goto('/calculators/commodity-portfolio');

    // Set up portfolio and generate analysis
    await page.fill('[data-testid="total-investment-input"]', '250000');
    await page.click('[data-testid="commodity-select-gold"]');
    await page.click('[data-testid="calculate-allocation-button"]');

    // Enable dark mode
    await THEME_MODES.dark.setup(page);

    const config = {
      name: 'dark-mode-analysis',
      component: 'CommodityBuilder',
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile],
      waitFor: {
        selector: '[data-testid="allocation-recommendations"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('loading states', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Set up data
    await page.fill('[data-testid="total-investment-input"]', '250000');
    await page.click('[data-testid="commodity-select-gold"]');

    // Capture during calculation
    const calculatePromise = page.click('[data-testid="calculate-allocation-button"]');

    const config = generateTestConfig('CommodityBuilder', 'loading');

    const results = await tester.captureComponent(page, config);
    await calculatePromise;
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('accessibility focus indicators', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    const config = {
      name: 'focus-indicators',
      component: 'CommodityBuilder',
      viewports: [DEFAULT_VIEWPORTS.desktop],
      interactions: ACCESSIBILITY_STATES.focus.interactions
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('commodity selection animations', async ({ page }) => {
    await page.goto('/calculators/commodity-portfolio');

    // Select commodity to trigger animation
    await page.click('[data-testid="commodity-select-gold"]');

    const config = {
      name: 'selection-animation',
      component: 'CommodityBuilder',
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="commodity-selection-animation"]',
        ...ANIMATION_STATES.stable.waitFor
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });
});


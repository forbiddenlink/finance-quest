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

test.describe('REIT Investment Analyzer Visual Tests', () => {
  let tester: VisualRegressionTester;

  test.beforeEach(({ page }) => {
    tester = VisualRegressionTester.getInstance();
  });

  test('initial state', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    const config = generateTestConfig('REITAnalyzer', 'initial', {
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ]
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('property input form', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Fill REIT details
    await page.fill('[data-testid="share-price-input"]', '100');
    await page.fill('[data-testid="annual-dividend-input"]', '5');
    await page.fill('[data-testid="ffo-per-share-input"]', '8');
    await page.fill('[data-testid="occupancy-rate-input"]', '95');

    const config = generateTestConfig('REITAnalyzer', 'results', {
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile],
      waitFor: {
        selector: '[data-testid="property-form"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('property card grid', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Add multiple properties
    await page.click('[data-testid="add-property-button"]');
    await page.click('[data-testid="add-property-button"]');

    // Fill property details
    const properties = [
      {
        'Property Name': 'Office Building A',
        'Square Footage': '50000',
        'Annual Revenue': '1000000',
        'Operating Expenses': '400000',
        'Occupancy Rate': '95',
      },
      {
        'Property Name': 'Retail Center B',
        'Square Footage': '75000',
        'Annual Revenue': '1500000',
        'Operating Expenses': '600000',
        'Occupancy Rate': '92',
      }
    ];

    for (const [index, property] of properties.entries()) {
      for (const [label, value] of Object.entries(property)) {
        const inputs = await page.$$(`[aria-label="${label}"]`);
        await inputs[index].type(value);
      }
    }

    const config = generateTestConfig('REITAnalyzer', 'results', {
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ],
      waitFor: {
        selector: '[data-testid="property-grid"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('property analysis results', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Add and analyze property
    await page.click('[data-testid="add-property-button"]');
    await page.fill('[data-testid="property-name-input"]', 'Test Property');
    await page.fill('[data-testid="square-footage-input"]', '50000');
    await page.fill('[data-testid="annual-revenue-input"]', '1000000');
    await page.fill('[data-testid="operating-expenses-input"]', '400000');
    await page.click('[data-testid="analyze-property-button"]');

    const config = generateTestConfig('REITAnalyzer', 'results', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="analysis-results"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('performance metrics visualization', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Set up REIT data
    await page.fill('[data-testid="share-price-input"]', '100');
    await page.fill('[data-testid="annual-dividend-input"]', '5');
    await page.fill('[data-testid="ffo-per-share-input"]', '8');
    await page.click('[data-testid="calculate-metrics-button"]');

    const config = generateTestConfig('REITAnalyzer', 'results', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="metrics-chart"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('property comparison view', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Add multiple properties
    await page.click('[data-testid="add-property-button"]');
    await page.click('[data-testid="add-property-button"]');

    // Fill property details
    const properties = [
      {
        name: 'Property A',
        revenue: '1000000',
        expenses: '400000',
      },
      {
        name: 'Property B',
        revenue: '1500000',
        expenses: '600000',
      }
    ];

    for (const [index, property] of properties.entries()) {
      await page.fill(`[data-testid="property-name-input-\${index}"]`, property.name);
      await page.fill(`[data-testid="revenue-input-\${index}"]`, property.revenue);
      await page.fill(`[data-testid="expenses-input-\${index}"]`, property.expenses);
    }

    await page.click('[data-testid="compare-properties-button"]');

    const config = generateTestConfig('REITAnalyzer', 'results', {
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="comparison-chart"]',
        state: 'visible'
      }
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('error validation display', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Trigger validation errors
    await page.fill('[data-testid="share-price-input"]', '-100');
    await page.fill('[data-testid="occupancy-rate-input"]', '150');
    await page.click('[data-testid="calculate-metrics-button"]');

    const config = generateTestConfig('REITAnalyzer', 'error', {
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile]
    });

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('responsive property cards', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Add property
    await page.click('[data-testid="add-property-button"]');
    await page.fill('[data-testid="property-name-input"]', 'Test Property');
    await page.fill('[data-testid="square-footage-input"]', '50000');
    await page.fill('[data-testid="annual-revenue-input"]', '1000000');

    const config = {
      name: 'responsive-property-cards',
      component: 'REITAnalyzer',
      viewports: [
        DEFAULT_VIEWPORTS.desktop,
        DEFAULT_VIEWPORTS.smallDesktop,
        DEFAULT_VIEWPORTS.tablet,
        DEFAULT_VIEWPORTS.mobile
      ],
      waitFor: {
        selector: '[data-testid="property-card"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('chart interactions', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Set up data and generate chart
    await page.fill('[data-testid="share-price-input"]', '100');
    await page.fill('[data-testid="annual-dividend-input"]', '5');
    await page.click('[data-testid="calculate-metrics-button"]');

    const config = {
      name: 'chart-tooltip',
      component: 'REITAnalyzer',
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
    await page.goto('/calculators/reit-analyzer');

    // Add property and generate analysis
    await page.click('[data-testid="add-property-button"]');
    await page.fill('[data-testid="property-name-input"]', 'Test Property');
    await page.fill('[data-testid="annual-revenue-input"]', '1000000');
    await page.click('[data-testid="analyze-property-button"]');

    // Enable dark mode
    await THEME_MODES.dark.setup(page);

    const config = {
      name: 'dark-mode-analysis',
      component: 'REITAnalyzer',
      viewports: [DEFAULT_VIEWPORTS.desktop, DEFAULT_VIEWPORTS.mobile],
      waitFor: {
        selector: '[data-testid="analysis-results"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('loading states', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Set up data
    await page.fill('[data-testid="share-price-input"]', '100');
    await page.fill('[data-testid="annual-dividend-input"]', '5');

    // Capture during calculation
    const calculatePromise = page.click('[data-testid="calculate-metrics-button"]');

    const config = generateTestConfig('REITAnalyzer', 'loading');

    const results = await tester.captureComponent(page, config);
    await calculatePromise;
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('accessibility focus indicators', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    const config = {
      name: 'focus-indicators',
      component: 'REITAnalyzer',
      viewports: [DEFAULT_VIEWPORTS.desktop],
      interactions: ACCESSIBILITY_STATES.focus.interactions
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('property card animations', async ({ page }) => {
    await page.goto('/calculators/reit-analyzer');

    // Add property to trigger animation
    await page.click('[data-testid="add-property-button"]');
    await page.fill('[data-testid="property-name-input"]', 'Test Property');

    const config = {
      name: 'card-animation',
      component: 'REITAnalyzer',
      viewports: [DEFAULT_VIEWPORTS.desktop],
      waitFor: {
        selector: '[data-testid="property-card-animation"]',
        ...ANIMATION_STATES.stable.waitFor
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });
});


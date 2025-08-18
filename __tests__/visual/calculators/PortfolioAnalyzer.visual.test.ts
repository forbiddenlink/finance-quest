import { test, expect } from '@playwright/test';
import { VisualRegressionTester } from '@/lib/testing/visual/VisualRegressionTester';

test.describe('Portfolio Analyzer Visual Tests', () => {
  let tester: VisualRegressionTester;

  test.beforeEach(({ page }) => {
    tester = VisualRegressionTester.getInstance();
  });

  test('initial state', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    const config = {
      name: 'initial-state',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 812 }    // Mobile
      ]
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('with portfolio data', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Fill portfolio data
    await page.fill('[data-testid="total-value-input"]', '1000000');
    await page.fill('[data-testid="risk-tolerance-input"]', 'Moderate');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input"]', 'Stock Fund');
    await page.fill('[data-testid="allocation-input"]', '60');
    await page.fill('[data-testid="expected-return-input"]', '8');
    await page.fill('[data-testid="risk-input"]', '15');

    const config = {
      name: 'with-portfolio-data',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 }
      ],
      waitFor: {
        selector: '[data-testid="analysis-results"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('analysis results view', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Set up portfolio and trigger analysis
    await page.fill('[data-testid="total-value-input"]', '1000000');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input"]', 'Stock Fund');
    await page.fill('[data-testid="allocation-input"]', '60');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input-2"]', 'Bond Fund');
    await page.fill('[data-testid="allocation-input-2"]', '40');
    await page.click('[data-testid="analyze-button"]');

    const config = {
      name: 'analysis-results',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 }
      ],
      waitFor: {
        selector: '[data-testid="portfolio-metrics"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('error state', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Trigger validation error
    await page.fill('[data-testid="total-value-input"]', '-1000');
    await page.click('[data-testid="analyze-button"]');

    const config = {
      name: 'error-state',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 }
      ],
      waitFor: {
        selector: '[data-testid="error-message"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('loading state', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Set up portfolio
    await page.fill('[data-testid="total-value-input"]', '1000000');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input"]', 'Stock Fund');
    await page.fill('[data-testid="allocation-input"]', '100');

    // Trigger analysis (capture during loading)
    const analyzePromise = page.click('[data-testid="analyze-button"]');

    const config = {
      name: 'loading-state',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 }
      ],
      waitFor: {
        selector: '[data-testid="loading-spinner"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    await analyzePromise;
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('chart interactions', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Set up portfolio and generate charts
    await page.fill('[data-testid="total-value-input"]', '1000000');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input"]', 'Stock Fund');
    await page.fill('[data-testid="allocation-input"]', '60');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input-2"]', 'Bond Fund');
    await page.fill('[data-testid="allocation-input-2"]', '40');
    await page.click('[data-testid="analyze-button"]');

    // Test chart tooltip
    const config = {
      name: 'chart-tooltip',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 }
      ],
      interactions: [
        { action: 'hover', target: '[data-testid="allocation-chart"] path' }
      ],
      waitFor: {
        selector: '[data-testid="chart-tooltip"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('responsive layout', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Add some data to make the layout interesting
    await page.fill('[data-testid="total-value-input"]', '1000000');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input"]', 'Stock Fund');
    await page.fill('[data-testid="allocation-input"]', '100');
    await page.click('[data-testid="analyze-button"]');

    const config = {
      name: 'responsive-layout',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 }, // Desktop
        { width: 1280, height: 720 },  // Small Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 812 }    // Mobile
      ],
      waitFor: {
        selector: '[data-testid="analysis-results"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('dark mode', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Add some data
    await page.fill('[data-testid="total-value-input"]', '1000000');
    await page.click('[data-testid="analyze-button"]');

    const config = {
      name: 'dark-mode',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 },
        { width: 375, height: 812 }
      ],
      waitFor: {
        selector: '[data-testid="analysis-results"]',
        state: 'visible'
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('accessibility focus indicators', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    const config = {
      name: 'focus-indicators',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 }
      ],
      interactions: [
        { action: 'click', target: '[data-testid="total-value-input"]' },
        { action: 'type', target: '[data-testid="total-value-input"]', value: '1000000' },
        { action: 'click', target: '[data-testid="analyze-button"]' }
      ]
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });

  test('animation states', async ({ page }) => {
    await page.goto('/calculators/portfolio-analyzer');

    // Set up portfolio to trigger animations
    await page.fill('[data-testid="total-value-input"]', '1000000');
    await page.click('[data-testid="add-asset-button"]');
    await page.fill('[data-testid="asset-name-input"]', 'Stock Fund');
    await page.fill('[data-testid="allocation-input"]', '100');
    await page.click('[data-testid="analyze-button"]');

    const config = {
      name: 'animation-states',
      component: 'PortfolioAnalyzer',
      viewports: [
        { width: 1920, height: 1080 }
      ],
      waitFor: {
        selector: '[data-testid="chart-animation"]',
        state: 'stable',
        timeout: 5000
      }
    };

    const results = await tester.captureComponent(page, config);
    expect(results.every(r => r.passed)).toBe(true);
  });
});


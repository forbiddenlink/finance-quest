import { test, expect } from '@playwright/test';
import { VisualRegressionTester } from '@/lib/testing/visual/VisualRegressionTester';

const tester = new VisualRegressionTester('EstateValueCalculator');

test.describe('Estate Value Calculator Visual Tests', () => {
  test('initial state', async ({ page }) => {
    await tester.captureInitialState(page);
  });

  test('asset input form', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');
    await tester.captureState(page, 'asset-input-form');
  });

  test('liability input form', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Add Liability")');
    await page.fill('input[placeholder="Description"]', 'Mortgage');
    await page.fill('input[placeholder="Amount"]', '400000');
    await tester.captureState(page, 'liability-input-form');
  });

  test('personal information form', async ({ page }) => {
    await tester.setup(page);
    await page.selectOption('select[name="state"]', 'WA');
    await page.selectOption('select[name="maritalStatus"]', 'married');
    await page.click('input[name="hasChildren"]');
    await tester.captureState(page, 'personal-info-form');
  });

  test('calculation results', async ({ page }) => {
    await tester.setup(page);
    
    // Add asset
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');

    // Add liability
    await page.click('button:has-text("Add Liability")');
    await page.fill('input[placeholder="Description"]', 'Mortgage');
    await page.fill('input[placeholder="Amount"]', '400000');

    // Fill personal info
    await page.selectOption('select[name="state"]', 'WA');
    await page.selectOption('select[name="maritalStatus"]', 'married');

    // Calculate
    await page.click('button:has-text("Calculate Estate Value")');
    await page.waitForSelector('text=Estate Analysis Results');
    await tester.captureState(page, 'calculation-results');
  });

  test('validation errors', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Calculate Estate Value")');
    await tester.captureState(page, 'validation-errors');
  });

  test('responsive layout - mobile', async ({ page }) => {
    await tester.setupMobile(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');
    await tester.captureState(page, 'mobile-layout');
  });

  test('responsive layout - tablet', async ({ page }) => {
    await tester.setupTablet(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');
    await tester.captureState(page, 'tablet-layout');
  });

  test('dark mode', async ({ page }) => {
    await tester.setupDarkMode(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');
    await tester.captureState(page, 'dark-mode');
  });

  test('loading state', async ({ page }) => {
    await tester.setup(page);
    
    // Add required inputs
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');
    await page.selectOption('select[name="state"]', 'WA');

    // Trigger calculation and capture loading state
    const calculatePromise = page.click('button:has-text("Calculate Estate Value")');
    await tester.captureState(page, 'loading-state');
    await calculatePromise;
  });

  test('error state', async ({ page }) => {
    await tester.setup(page);
    
    // Add invalid inputs
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '-750000');

    await page.click('button:has-text("Calculate Estate Value")');
    await tester.captureState(page, 'error-state');
  });

  test('chart interactions', async ({ page }) => {
    await tester.setup(page);
    
    // Add data and calculate
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');
    await page.selectOption('select[name="state"]', 'WA');
    await page.click('button:has-text("Calculate Estate Value")');

    // Interact with chart
    await page.hover('.recharts-pie-sector');
    await tester.captureState(page, 'chart-tooltip');
  });

  test('accessibility states', async ({ page }) => {
    await tester.setup(page);
    
    // Focus states
    await page.focus('input[placeholder="Description"]');
    await tester.captureState(page, 'focus-state');

    // Error states with screen reader content
    await page.click('button:has-text("Calculate Estate Value")');
    await tester.captureState(page, 'error-state-a11y');

    // Loading states with aria-busy
    const calculatePromise = page.click('button:has-text("Calculate Estate Value")');
    await tester.captureState(page, 'loading-state-a11y');
    await calculatePromise;
  });

  test('animations', async ({ page }) => {
    await tester.setup(page);
    
    // Capture add/remove asset animations
    await page.click('button:has-text("Add Asset")');
    await tester.captureState(page, 'add-animation');

    await page.click('button:has-text("Remove")');
    await tester.captureState(page, 'remove-animation');

    // Capture results animation
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Primary Residence');
    await page.fill('input[placeholder="Value"]', '750000');
    await page.selectOption('select[name="state"]', 'WA');
    await page.click('button:has-text("Calculate Estate Value")');
    await tester.captureState(page, 'results-animation');
  });
});

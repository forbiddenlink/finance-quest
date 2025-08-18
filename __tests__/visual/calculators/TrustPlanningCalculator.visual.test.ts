import { test, expect } from '@playwright/test';
import { VisualRegressionTester } from '@/lib/testing/visual/VisualRegressionTester';

const tester = new VisualRegressionTester('TrustPlanningCalculator');

test.describe('Trust Planning Calculator Visual Tests', () => {
  test('initial state', async ({ page }) => {
    await tester.captureInitialState(page);
  });

  test('trust type selection', async ({ page }) => {
    await tester.setup(page);
    await page.selectOption('select[name="trustType"]', 'revocable');
    await page.fill('input[name="trustDuration"]', '30');
    await tester.captureState(page, 'trust-type-selection');
  });

  test('asset input form', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');
    await page.fill('input[placeholder="Growth Rate"]', '7');
    await tester.captureState(page, 'asset-input-form');
  });

  test('beneficiary input form', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Add Asset")');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.selectOption('select[name="relationship"]', 'child');
    await tester.captureState(page, 'beneficiary-input-form');
  });

  test('distribution strategy selection', async ({ page }) => {
    await tester.setup(page);
    await page.selectOption('select[name="distributionStrategy"]', 'staged');
    await page.click('input[name="retainControl"]');
    await page.click('input[name="charitableIntent"]');
    await tester.captureState(page, 'distribution-strategy');
  });

  test('calculation results', async ({ page }) => {
    await tester.setup(page);
    
    // Add asset
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');

    // Add beneficiary
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');

    // Select trust type and options
    await page.selectOption('select[name="trustType"]', 'revocable');
    await page.selectOption('select[name="distributionStrategy"]', 'staged');

    // Calculate
    await page.click('button:has-text("Calculate Trust Plan")');
    await page.waitForSelector('text=Trust Analysis Results');
    await tester.captureState(page, 'calculation-results');
  });

  test('validation errors', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Calculate Trust Plan")');
    await tester.captureState(page, 'validation-errors');
  });

  test('responsive layout - mobile', async ({ page }) => {
    await tester.setupMobile(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');
    await tester.captureState(page, 'mobile-layout');
  });

  test('responsive layout - tablet', async ({ page }) => {
    await tester.setupTablet(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');
    await tester.captureState(page, 'tablet-layout');
  });

  test('dark mode', async ({ page }) => {
    await tester.setupDarkMode(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');
    await tester.captureState(page, 'dark-mode');
  });

  test('loading state', async ({ page }) => {
    await tester.setup(page);
    
    // Add required inputs
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');

    // Trigger calculation and capture loading state
    const calculatePromise = page.click('button:has-text("Calculate Trust Plan")');
    await tester.captureState(page, 'loading-state');
    await calculatePromise;
  });

  test('error state', async ({ page }) => {
    await tester.setup(page);
    
    // Add invalid inputs
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '-1000000');

    await page.click('button:has-text("Calculate Trust Plan")');
    await tester.captureState(page, 'error-state');
  });

  test('chart interactions', async ({ page }) => {
    await tester.setup(page);
    
    // Add data and calculate
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.click('button:has-text("Calculate Trust Plan")');

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
    await page.click('button:has-text("Calculate Trust Plan")');
    await tester.captureState(page, 'error-state-a11y');

    // Loading states with aria-busy
    const calculatePromise = page.click('button:has-text("Calculate Trust Plan")');
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
    await page.fill('input[placeholder="Description"]', 'Investment Portfolio');
    await page.fill('input[placeholder="Value"]', '1000000');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.click('button:has-text("Calculate Trust Plan")');
    await tester.captureState(page, 'results-animation');
  });

  test('special needs trust features', async ({ page }) => {
    await tester.setup(page);
    
    // Setup special needs trust
    await page.selectOption('select[name="trustType"]', 'special_needs');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.click('input[name="specialNeeds"]');

    await tester.captureState(page, 'special-needs-trust');
  });

  test('charitable trust features', async ({ page }) => {
    await tester.setup(page);
    
    // Setup charitable trust
    await page.selectOption('select[name="trustType"]', 'charitable');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'Charity Foundation');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.selectOption('select[name="relationship"]', 'charity');
    await page.fill('input[name="charityTaxId"]', '12-3456789');

    await tester.captureState(page, 'charitable-trust');
  });
});

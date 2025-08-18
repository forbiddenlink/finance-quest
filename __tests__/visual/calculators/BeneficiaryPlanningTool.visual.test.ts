import { test, expect } from '@playwright/test';
import { VisualRegressionTester } from '@/lib/testing/visual/VisualRegressionTester';

const tester = new VisualRegressionTester('BeneficiaryPlanningTool');

test.describe('Beneficiary Planning Tool Visual Tests', () => {
  test('initial state', async ({ page }) => {
    await tester.captureInitialState(page);
  });

  test('review settings form', async ({ page }) => {
    await tester.setup(page);
    await page.selectOption('select[name="reviewFrequency"]', 'quarterly');
    await page.fill('input[name="lastFullReview"]', '2024-01-01');
    await tester.captureState(page, 'review-settings-form');
  });

  test('account input form', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.selectOption('select[name="type"]', 'retirement');
    await page.click('input[name="transferOnDeath"]');
    await page.click('input[name="requiresDesignation"]');
    await tester.captureState(page, 'account-input-form');
  });

  test('beneficiary input form', async ({ page }) => {
    await tester.setup(page);
    // Add account first
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    
    // Add beneficiary
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.selectOption('select[name="relationship"]', 'child');
    await page.selectOption('select[name="type"]', 'primary');
    await page.click('input[name="specialNeeds"]');
    await page.click('input[name="trustBeneficiary"]');
    await tester.captureState(page, 'beneficiary-input-form');
  });

  test('life events form', async ({ page }) => {
    await tester.setup(page);
    // Add account first
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    
    // Add life event
    await page.click('button:has-text("Add Life Event")');
    await page.fill('input[placeholder="Event Description"]', 'Retirement');
    await page.fill('input[name="date"]', '2025-01-01');
    await page.selectOption('select[name="impactedAccounts"]', ['401(k) Account']);
    await tester.captureState(page, 'life-events-form');
  });

  test('calculation results', async ({ page }) => {
    await tester.setup(page);
    
    // Add account
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.selectOption('select[name="type"]', 'retirement');
    await page.click('input[name="requiresDesignation"]');

    // Add beneficiary
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.selectOption('select[name="relationship"]', 'child');

    // Add life event
    await page.click('button:has-text("Add Life Event")');
    await page.fill('input[placeholder="Event Description"]', 'Retirement');
    await page.fill('input[name="date"]', '2025-01-01');

    // Calculate
    await page.click('button:has-text("Analyze Beneficiary Plan")');
    await page.waitForSelector('text=Beneficiary Analysis Results');
    await tester.captureState(page, 'calculation-results');
  });

  test('validation errors', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Analyze Beneficiary Plan")');
    await tester.captureState(page, 'validation-errors');
  });

  test('responsive layout - mobile', async ({ page }) => {
    await tester.setupMobile(page);
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await tester.captureState(page, 'mobile-layout');
  });

  test('responsive layout - tablet', async ({ page }) => {
    await tester.setupTablet(page);
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await tester.captureState(page, 'tablet-layout');
  });

  test('dark mode', async ({ page }) => {
    await tester.setupDarkMode(page);
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await tester.captureState(page, 'dark-mode');
  });

  test('loading state', async ({ page }) => {
    await tester.setup(page);
    
    // Add required inputs
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');

    // Trigger calculation and capture loading state
    const calculatePromise = page.click('button:has-text("Analyze Beneficiary Plan")');
    await tester.captureState(page, 'loading-state');
    await calculatePromise;
  });

  test('error state', async ({ page }) => {
    await tester.setup(page);
    
    // Add invalid inputs
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '-500000');

    await page.click('button:has-text("Analyze Beneficiary Plan")');
    await tester.captureState(page, 'error-state');
  });

  test('special needs beneficiary handling', async ({ page }) => {
    await tester.setup(page);
    
    // Add account
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', 'Trust Account');
    await page.fill('input[placeholder="Value"]', '1000000');

    // Add special needs beneficiary
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'Jane Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.click('input[name="specialNeeds"]');

    // Calculate and capture special needs warnings
    await page.click('button:has-text("Analyze Beneficiary Plan")');
    await page.waitForSelector('text=Special Needs Planning');
    await tester.captureState(page, 'special-needs-handling');
  });

  test('review schedule display', async ({ page }) => {
    await tester.setup(page);
    
    // Add account with review date
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[name="lastReviewed"]', '2023-01-01');

    // Set quarterly review frequency
    await page.selectOption('select[name="reviewFrequency"]', 'quarterly');

    // Calculate and capture review schedule
    await page.click('button:has-text("Analyze Beneficiary Plan")');
    await page.waitForSelector('text=Review Schedule');
    await tester.captureState(page, 'review-schedule');
  });

  test('accessibility states', async ({ page }) => {
    await tester.setup(page);
    
    // Focus states
    await page.focus('input[placeholder="Description"]');
    await tester.captureState(page, 'focus-state');

    // Error states with screen reader content
    await page.click('button:has-text("Analyze Beneficiary Plan")');
    await tester.captureState(page, 'error-state-a11y');

    // Loading states with aria-busy
    const calculatePromise = page.click('button:has-text("Analyze Beneficiary Plan")');
    await tester.captureState(page, 'loading-state-a11y');
    await calculatePromise;
  });

  test('animations', async ({ page }) => {
    await tester.setup(page);
    
    // Capture add/remove account animations
    await page.click('button:has-text("Add Account")');
    await tester.captureState(page, 'add-animation');

    await page.click('button:has-text("Remove")');
    await tester.captureState(page, 'remove-animation');

    // Capture add/remove beneficiary animations
    await page.click('button:has-text("Add Account")');
    await page.click('button:has-text("Add Beneficiary")');
    await tester.captureState(page, 'add-beneficiary-animation');

    await page.click('button:has-text("Remove Beneficiary")');
    await tester.captureState(page, 'remove-beneficiary-animation');

    // Capture results animation
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.click('button:has-text("Analyze Beneficiary Plan")');
    await tester.captureState(page, 'results-animation');
  });

  test('chart interactions', async ({ page }) => {
    await tester.setup(page);
    
    // Add data and calculate
    await page.click('button:has-text("Add Account")');
    await page.fill('input[placeholder="Description"]', '401(k) Account');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.click('button:has-text("Add Beneficiary")');
    await page.fill('input[placeholder="Name"]', 'John Doe');
    await page.fill('input[placeholder="Percentage"]', '100');
    await page.click('button:has-text("Analyze Beneficiary Plan")');

    // Interact with distribution chart
    await page.hover('.recharts-pie-sector');
    await tester.captureState(page, 'chart-tooltip');
  });
});

import { test, expect } from '@playwright/test';
import { VisualRegressionTester } from '@/lib/testing/visual/VisualRegressionTester';

const tester = new VisualRegressionTester('InheritanceTaxCalculator');

test.describe('Inheritance Tax Calculator Visual Tests', () => {
  test('initial state', async ({ page }) => {
    await tester.captureInitialState(page);
  });

  test('decedent information form', async ({ page }) => {
    await tester.setup(page);
    await page.selectOption('select[name="decedent.state"]', 'WA');
    await page.fill('input[name="decedent.dateOfDeath"]', '2024-01-01');
    await page.selectOption('select[name="decedent.maritalStatus"]', 'married');
    await tester.captureState(page, 'decedent-info-form');
  });

  test('heir information form', async ({ page }) => {
    await tester.setup(page);
    await page.selectOption('select[name="heir.state"]', 'PA');
    await page.selectOption('select[name="heir.relationship"]', 'child');
    await page.fill('input[name="heir.adjustedGrossIncome"]', '75000');
    await tester.captureState(page, 'heir-info-form');
  });

  test('asset input form', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.fill('input[placeholder="Cost Basis"]', '200000');
    await tester.captureState(page, 'asset-input-form');
  });

  test('deduction input form', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Add Deduction")');
    await page.fill('input[placeholder="Description"]', 'Funeral Expenses');
    await page.fill('input[placeholder="Amount"]', '15000');
    await tester.captureState(page, 'deduction-input-form');
  });

  test('calculation results', async ({ page }) => {
    await tester.setup(page);
    
    // Add decedent info
    await page.selectOption('select[name="decedent.state"]', 'WA');
    await page.fill('input[name="decedent.dateOfDeath"]', '2024-01-01');
    await page.selectOption('select[name="decedent.maritalStatus"]', 'married');

    // Add heir info
    await page.selectOption('select[name="heir.state"]', 'PA');
    await page.selectOption('select[name="heir.relationship"]', 'child');
    await page.fill('input[name="heir.adjustedGrossIncome"]', '75000');

    // Add asset
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.fill('input[placeholder="Cost Basis"]', '200000');

    // Calculate
    await page.click('button:has-text("Calculate Inheritance Tax")');
    await page.waitForSelector('text=Tax Analysis Results');
    await tester.captureState(page, 'calculation-results');
  });

  test('validation errors', async ({ page }) => {
    await tester.setup(page);
    await page.click('button:has-text("Calculate Inheritance Tax")');
    await tester.captureState(page, 'validation-errors');
  });

  test('responsive layout - mobile', async ({ page }) => {
    await tester.setupMobile(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');
    await tester.captureState(page, 'mobile-layout');
  });

  test('responsive layout - tablet', async ({ page }) => {
    await tester.setupTablet(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');
    await tester.captureState(page, 'tablet-layout');
  });

  test('dark mode', async ({ page }) => {
    await tester.setupDarkMode(page);
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');
    await tester.captureState(page, 'dark-mode');
  });

  test('loading state', async ({ page }) => {
    await tester.setup(page);
    
    // Add required inputs
    await page.selectOption('select[name="decedent.state"]', 'WA');
    await page.fill('input[name="decedent.dateOfDeath"]', '2024-01-01');
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');

    // Trigger calculation and capture loading state
    const calculatePromise = page.click('button:has-text("Calculate Inheritance Tax")');
    await tester.captureState(page, 'loading-state');
    await calculatePromise;
  });

  test('error state', async ({ page }) => {
    await tester.setup(page);
    
    // Add invalid inputs
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '-500000');

    await page.click('button:has-text("Calculate Inheritance Tax")');
    await tester.captureState(page, 'error-state');
  });

  test('step-up basis results', async ({ page }) => {
    await tester.setup(page);
    
    // Add asset with basis
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.fill('input[placeholder="Cost Basis"]', '200000');

    // Add required info
    await page.selectOption('select[name="decedent.state"]', 'WA');
    await page.fill('input[name="decedent.dateOfDeath"]', '2024-01-01');

    // Calculate and wait for step-up basis section
    await page.click('button:has-text("Calculate Inheritance Tax")');
    await page.waitForSelector('text=Step-Up in Basis Benefits');
    await tester.captureState(page, 'step-up-basis-results');
  });

  test('state inheritance tax results', async ({ page }) => {
    await tester.setup(page);
    
    // Setup for state with inheritance tax
    await page.selectOption('select[name="heir.state"]', 'PA');
    await page.selectOption('select[name="heir.relationship"]', 'other');
    
    // Add asset
    await page.click('button:has-text("Add Asset")');
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');

    // Add required info
    await page.selectOption('select[name="decedent.state"]', 'WA');
    await page.fill('input[name="decedent.dateOfDeath"]', '2024-01-01');

    // Calculate and wait for inheritance tax section
    await page.click('button:has-text("Calculate Inheritance Tax")');
    await page.waitForSelector('text=State Inheritance Tax');
    await tester.captureState(page, 'state-inheritance-tax');
  });

  test('accessibility states', async ({ page }) => {
    await tester.setup(page);
    
    // Focus states
    await page.focus('input[placeholder="Description"]');
    await tester.captureState(page, 'focus-state');

    // Error states with screen reader content
    await page.click('button:has-text("Calculate Inheritance Tax")');
    await tester.captureState(page, 'error-state-a11y');

    // Loading states with aria-busy
    const calculatePromise = page.click('button:has-text("Calculate Inheritance Tax")');
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
    await page.fill('input[placeholder="Description"]', 'Stock Portfolio');
    await page.fill('input[placeholder="Value"]', '500000');
    await page.selectOption('select[name="decedent.state"]', 'WA');
    await page.fill('input[name="decedent.dateOfDeath"]', '2024-01-01');
    await page.click('button:has-text("Calculate Inheritance Tax")');
    await tester.captureState(page, 'results-animation');
  });
});

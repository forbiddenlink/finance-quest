import { Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';

interface VisualTestConfig {
  name: string;
  component: string;
  viewports: {
    width: number;
    height: number;
  }[];
  interactions?: {
    action: 'click' | 'type' | 'select' | 'hover';
    target: string;
    value?: string;
  }[];
  waitFor?: {
    selector?: string;
    timeout?: number;
    state?: 'visible' | 'hidden' | 'stable';
  };
  threshold?: number;
}

interface VisualTestResult {
  name: string;
  component: string;
  viewport: {
    width: number;
    height: number;
  };
  diffPercentage: number;
  passed: boolean;
  diffPath?: string;
}

export class VisualRegressionTester {
  private static instance: VisualRegressionTester;
  private baselinePath: string;
  private currentPath: string;
  private diffPath: string;
  private threshold: number;

  private constructor() {
    this.baselinePath = path.join(process.cwd(), '__visual_baselines__');
    this.currentPath = path.join(process.cwd(), '__visual_current__');
    this.diffPath = path.join(process.cwd(), '__visual_diffs__');
    this.threshold = 0.1; // Default 0.1% threshold

    // Ensure directories exist
    [this.baselinePath, this.currentPath, this.diffPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  public static getInstance(): VisualRegressionTester {
    if (!VisualRegressionTester.instance) {
      VisualRegressionTester.instance = new VisualRegressionTester();
    }
    return VisualRegressionTester.instance;
  }

  public async captureComponent(
    page: Page,
    config: VisualTestConfig
  ): Promise<VisualTestResult[]> {
    const results: VisualTestResult[] = [];

    for (const viewport of config.viewports) {
      // Set viewport
      await page.setViewportSize(viewport);

      // Perform interactions if specified
      if (config.interactions) {
        for (const interaction of config.interactions) {
          switch (interaction.action) {
            case 'click':
              await page.click(interaction.target);
              break;
            case 'type':
              await page.fill(interaction.target, interaction.value || '');
              break;
            case 'select':
              await page.selectOption(interaction.target, interaction.value || '');
              break;
            case 'hover':
              await page.hover(interaction.target);
              break;
          }
        }
      }

      // Wait for specified conditions
      if (config.waitFor) {
        if (config.waitFor.selector) {
          await page.waitForSelector(config.waitFor.selector, {
            state: config.waitFor.state || 'visible',
            timeout: config.waitFor.timeout || 5000
          });
        }
      }

      // Generate unique filename
      const filename = this.generateFilename(config.name, config.component, viewport);
      const currentFile = path.join(this.currentPath, filename);
      const baselineFile = path.join(this.baselinePath, filename);
      const diffFile = path.join(this.diffPath, filename);

      // Capture screenshot
      await page.screenshot({
        path: currentFile,
        fullPage: true
      });

      // Compare with baseline if exists
      if (fs.existsSync(baselineFile)) {
        const result = await this.compareScreenshots(
          baselineFile,
          currentFile,
          diffFile,
          config.threshold || this.threshold
        );

        results.push({
          name: config.name,
          component: config.component,
          viewport,
          diffPercentage: result.diffPercentage,
          passed: result.passed,
          diffPath: result.passed ? undefined : diffFile
        });
      } else {
        // Create baseline if it doesn't exist
        fs.copyFileSync(currentFile, baselineFile);
        results.push({
          name: config.name,
          component: config.component,
          viewport,
          diffPercentage: 0,
          passed: true
        });
      }
    }

    return results;
  }

  private generateFilename(name: string, component: string, viewport: { width: number; height: number }): string {
    return `${component}-${name}-${viewport.width}x${viewport.height}.png`.toLowerCase().replace(/\\s+/g, '-');
  }

  private async compareScreenshots(
    baselinePath: string,
    currentPath: string,
    diffPath: string,
    threshold: number
  ): Promise<{ diffPercentage: number; passed: boolean }> {
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));
    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    const diffPercentage = (numDiffPixels / (width * height)) * 100;
    const passed = diffPercentage <= threshold;

    if (!passed) {
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }

    return { diffPercentage, passed };
  }

  public async generateReport(results: VisualTestResult[]): Promise<string> {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    const report = [
      '# Visual Regression Test Report',
      '',
      '## Summary',
      '',
      `Total Tests: ${totalTests}`,
      `Passed: ${passedTests}`,
      `Failed: ${failedTests}`,
      '',
      '## Test Results',
      '',
      ...results.map(result => [
        `### ${result.component} - ${result.name}`,
        '',
        `- Viewport: ${result.viewport.width}x${result.viewport.height}`,
        `- Status: ${result.passed ? '✅ Passed' : '❌ Failed'}`,
        `- Diff Percentage: ${result.diffPercentage.toFixed(2)}%`,
        result.diffPath ? `- Diff Image: ${result.diffPath}` : '',
        ''
      ].join('\\n')),
      '',
      '## Recommendations',
      '',
      failedTests > 0 ? [
        '1. Review failed tests and their diff images',
        '2. Update baselines if changes are intentional',
        '3. Fix UI regressions if changes are unintentional',
        ''
      ].join('\\n') : 'No visual regressions detected.',
      ''
    ].join('\\n');

    return report;
  }

  public async saveReport(report: string, outputPath: string): Promise<void> {
    await fs.promises.writeFile(outputPath, report, 'utf-8');
  }

  public clearBaselines(): void {
    if (fs.existsSync(this.baselinePath)) {
      fs.rmSync(this.baselinePath, { recursive: true });
      fs.mkdirSync(this.baselinePath);
    }
  }

  public clearCurrents(): void {
    if (fs.existsSync(this.currentPath)) {
      fs.rmSync(this.currentPath, { recursive: true });
      fs.mkdirSync(this.currentPath);
    }
  }

  public clearDiffs(): void {
    if (fs.existsSync(this.diffPath)) {
      fs.rmSync(this.diffPath, { recursive: true });
      fs.mkdirSync(this.diffPath);
    }
  }

  public setThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }
    this.threshold = threshold;
  }
}


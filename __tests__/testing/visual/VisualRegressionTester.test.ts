import { VisualRegressionTester } from '@/lib/testing/visual/VisualRegressionTester';
import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

// Mock fs and PNG modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  copyFileSync: jest.fn(),
  rmSync: jest.fn(),
  promises: {
    writeFile: jest.fn()
  }
}));

jest.mock('pngjs', () => ({
  PNG: {
    sync: {
      read: jest.fn(),
      write: jest.fn()
    }
  }
}));

// Mock Playwright Page
const mockPage = {
  setViewportSize: jest.fn(),
  click: jest.fn(),
  fill: jest.fn(),
  selectOption: jest.fn(),
  hover: jest.fn(),
  waitForSelector: jest.fn(),
  screenshot: jest.fn()
} as unknown as Page;

describe('VisualRegressionTester', () => {
  let tester: VisualRegressionTester;

  beforeEach(() => {
    jest.clearAllMocks();
    tester = VisualRegressionTester.getInstance();

    // Mock directory existence checks
    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = VisualRegressionTester.getInstance();
      const instance2 = VisualRegressionTester.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Component Capture', () => {
    it('should capture component screenshots', async () => {
      const config = {
        name: 'initial-state',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }]
      };

      await tester.captureComponent(mockPage, config);

      expect(mockPage.setViewportSize).toHaveBeenCalledWith({
        width: 1920,
        height: 1080
      });
      expect(mockPage.screenshot).toHaveBeenCalled();
    });

    it('should handle interactions', async () => {
      const config = {
        name: 'with-input',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }],
        interactions: [
          { action: 'type', target: 'input', value: '100' },
          { action: 'click', target: 'button' }
        ]
      };

      await tester.captureComponent(mockPage, config);

      expect(mockPage.fill).toHaveBeenCalledWith('input', '100');
      expect(mockPage.click).toHaveBeenCalledWith('button');
    });

    it('should respect wait conditions', async () => {
      const config = {
        name: 'loading-state',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }],
        waitFor: {
          selector: '.loading',
          state: 'hidden',
          timeout: 1000
        }
      };

      await tester.captureComponent(mockPage, config);

      expect(mockPage.waitForSelector).toHaveBeenCalledWith(
        '.loading',
        {
          state: 'hidden',
          timeout: 1000
        }
      );
    });
  });

  describe('Screenshot Comparison', () => {
    beforeEach(() => {
      // Mock PNG read/write
      (PNG.sync.read as jest.Mock).mockReturnValue({
        width: 100,
        height: 100,
        data: Buffer.alloc(40000) // 100x100x4 (RGBA)
      });
      (PNG.sync.write as jest.Mock).mockReturnValue(Buffer.alloc(0));
    });

    it('should create baseline if none exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

      const config = {
        name: 'initial-state',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }]
      };

      const results = await tester.captureComponent(mockPage, config);

      expect(fs.copyFileSync).toHaveBeenCalled();
      expect(results[0].passed).toBe(true);
      expect(results[0].diffPercentage).toBe(0);
    });

    it('should detect visual differences', async () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      // Mock different images
      const baselineData = Buffer.alloc(40000, 0);
      const currentData = Buffer.alloc(40000, 255);

      (PNG.sync.read as jest.Mock)
        .mockReturnValueOnce({ width: 100, height: 100, data: baselineData })
        .mockReturnValueOnce({ width: 100, height: 100, data: currentData });

      const config = {
        name: 'changed-state',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }],
        threshold: 0.1
      };

      const results = await tester.captureComponent(mockPage, config);

      expect(results[0].passed).toBe(false);
      expect(results[0].diffPercentage).toBeGreaterThan(0);
      expect(fs.writeFileSync).toHaveBeenCalled(); // Diff image saved
    });

    it('should respect custom threshold', async () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      const config = {
        name: 'minor-changes',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }],
        threshold: 5 // 5% threshold
      };

      const results = await tester.captureComponent(mockPage, config);
      expect(results[0].passed).toBe(true); // Should pass with higher threshold
    });
  });

  describe('Report Generation', () => {
    it('should generate comprehensive report', async () => {
      const results = [
        {
          name: 'initial-state',
          component: 'Calculator',
          viewport: { width: 1920, height: 1080 },
          diffPercentage: 0,
          passed: true
        },
        {
          name: 'error-state',
          component: 'Calculator',
          viewport: { width: 1920, height: 1080 },
          diffPercentage: 2.5,
          passed: false,
          diffPath: 'path/to/diff.png'
        }
      ];

      const report = await tester.generateReport(results);

      expect(report).toContain('Visual Regression Test Report');
      expect(report).toContain('Total Tests: 2');
      expect(report).toContain('Passed: 1');
      expect(report).toContain('Failed: 1');
      expect(report).toContain('❌ Failed');
      expect(report).toContain('✅ Passed');
    });

    it('should save report to file', async () => {
      const report = '# Test Report';
      await tester.saveReport(report, 'report.md');

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'report.md',
        report,
        'utf-8'
      );
    });
  });

  describe('Directory Management', () => {
    it('should clear baseline directory', () => {
      tester.clearBaselines();

      expect(fs.rmSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should clear current screenshots directory', () => {
      tester.clearCurrents();

      expect(fs.rmSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('should clear diff images directory', () => {
      tester.clearDiffs();

      expect(fs.rmSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should validate threshold values', () => {
      expect(() => tester.setThreshold(-1)).toThrow();
      expect(() => tester.setThreshold(101)).toThrow();
      expect(() => tester.setThreshold(0.5)).not.toThrow();
    });

    it('should handle screenshot capture errors', async () => {
      (mockPage.screenshot as jest.Mock).mockRejectedValue(new Error('Screenshot error'));

      const config = {
        name: 'error-state',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }]
      };

      await expect(tester.captureComponent(mockPage, config)).rejects.toThrow('Screenshot error');
    });

    it('should handle PNG read errors', async () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
      (PNG.sync.read as jest.Mock).mockImplementation(() => {
        throw new Error('PNG read error');
      });

      const config = {
        name: 'error-state',
        component: 'Calculator',
        viewports: [{ width: 1920, height: 1080 }]
      };

      await expect(tester.captureComponent(mockPage, config)).rejects.toThrow('PNG read error');
    });
  });
});


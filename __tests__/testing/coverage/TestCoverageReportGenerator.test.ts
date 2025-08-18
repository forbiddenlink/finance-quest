import { TestCoverageReportGenerator } from '@/lib/testing/coverage/TestCoverageReportGenerator';
import { TestCoverageAnalyzer } from '@/lib/testing/coverage/TestCoverageAnalyzer';
import fs from 'fs';
import path from 'path';

// Mock fs and TestCoverageAnalyzer
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

jest.mock('@/lib/testing/coverage/TestCoverageAnalyzer', () => ({
  getInstance: jest.fn().mockReturnValue({
    analyzeChapter: jest.fn()
  })
}));

describe('TestCoverageReportGenerator', () => {
  let generator: TestCoverageReportGenerator;
  let mockAnalyzer: jest.Mocked<TestCoverageAnalyzer>;

  beforeEach(() => {
    jest.clearAllMocks();
    generator = TestCoverageReportGenerator.getInstance();
    mockAnalyzer = TestCoverageAnalyzer.getInstance() as jest.Mocked<TestCoverageAnalyzer>;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = TestCoverageReportGenerator.getInstance();
      const instance2 = TestCoverageReportGenerator.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Report Generation', () => {
    beforeEach(() => {
      // Mock analyzer response
      mockAnalyzer.analyzeChapter.mockResolvedValue({
        chapterNumber: 10,
        components: [
          {
            path: 'component1.tsx',
            metrics: {
              statements: 80,
              branches: 75,
              functions: 85,
              lines: 82
            },
            uncoveredLines: [],
            uncoveredFunctions: [],
            uncoveredBranches: [],
            complexity: 5
          },
          {
            path: 'component2.tsx',
            metrics: {
              statements: 90,
              branches: 85,
              functions: 95,
              lines: 92
            },
            uncoveredLines: [],
            uncoveredFunctions: [],
            uncoveredBranches: [],
            complexity: 3
          }
        ],
        aggregateMetrics: {
          statements: 85,
          branches: 80,
          functions: 90,
          lines: 87
        },
        criticalPaths: ['component1.tsx:uncovered_function'],
        recommendations: ['Add tests for uncovered function']
      });

      // Mock test file content
      (fs.promises.readFile as jest.Mock).mockResolvedValue(\`
        describe('Component Tests', () => {
          it('renders component', () => {});
          it('handles accessibility', () => {});
          it('integrates with other components', () => {});
          it('calculates values', () => {});
        });
      \`);
    });

    it('should generate report for chapter range', async () => {
      const report = await generator.generateReport(10, 11);

      expect(report.overallCoverage).toBeDefined();
      expect(report.chapterSummaries).toHaveLength(2);
      expect(report.criticalGaps).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.testQualityMetrics).toBeDefined();
    });

    it('should calculate correct test quality metrics', async () => {
      const report = await generator.generateReport(10, 10);

      expect(report.testQualityMetrics).toEqual({
        totalTests: 4,
        accessibilityTests: 1,
        integrationTests: 1,
        unitTests: 1,
        componentTests: 1
      });
    });

    it('should identify critical gaps', async () => {
      const report = await generator.generateReport(10, 10);

      expect(report.criticalGaps).toContain(expect.stringContaining('uncovered_function'));
    });

    it('should provide recommendations', async () => {
      const report = await generator.generateReport(10, 10);

      expect(report.recommendations).toContain(expect.stringContaining('Add tests'));
    });
  });

  describe('Markdown Generation', () => {
    it('should generate valid markdown', async () => {
      const report = await generator.generateReport(10, 10);
      const markdown = generator.generateMarkdownReport(report);

      expect(markdown).toContain('# Test Coverage Report');
      expect(markdown).toContain('## Overall Coverage');
      expect(markdown).toContain('## Test Quality Metrics');
      expect(markdown).toContain('## Chapter Summaries');
      expect(markdown).toContain('## Critical Gaps');
      expect(markdown).toContain('## Recommendations');
      expect(markdown).toContain('## Next Steps');
    });

    it('should include coverage tables', async () => {
      const report = await generator.generateReport(10, 10);
      const markdown = generator.generateMarkdownReport(report);

      expect(markdown).toContain('| Metric | Coverage |');
      expect(markdown).toContain('| Statements |');
      expect(markdown).toContain('| Branches |');
      expect(markdown).toContain('| Functions |');
      expect(markdown).toContain('| Lines |');
    });

    it('should format numbers correctly', async () => {
      const report = await generator.generateReport(10, 10);
      const markdown = generator.generateMarkdownReport(report);

      const coverageValues = markdown.match(/\d+\.\d+%/g);
      coverageValues?.forEach(value => {
        expect(value).toMatch(/^\d+\.\d%$/);
      });
    });
  });

  describe('File Operations', () => {
    it('should save report to file', async () => {
      const report = await generator.generateReport(10, 10);
      await generator.saveReport(report, 'coverage-report.md');

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'coverage-report.md',
        expect.any(String),
        'utf-8'
      );
    });

    it('should handle file system errors', async () => {
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

      const report = await generator.generateReport(10, 10);
      await expect(
        generator.saveReport(report, 'invalid/path/report.md')
      ).rejects.toThrow('Write error');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing test files', async () => {
      (fs.promises.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const report = await generator.generateReport(10, 10);
      expect(report.testQualityMetrics.totalTests).toBe(0);
    });

    it('should handle analyzer errors', async () => {
      mockAnalyzer.analyzeChapter.mockRejectedValue(new Error('Analysis error'));

      await expect(generator.generateReport(10, 10)).rejects.toThrow('Analysis error');
    });
  });
});


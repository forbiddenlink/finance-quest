import { TestCoverageAnalyzer } from '@/lib/testing/coverage/TestCoverageAnalyzer';
import fs from 'fs';
import path from 'path';

// Mock fs and path modules
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn()
  }
}));

describe('TestCoverageAnalyzer', () => {
  let analyzer: TestCoverageAnalyzer;

  beforeEach(() => {
    analyzer = TestCoverageAnalyzer.getInstance();
    analyzer.clearCoverageData();
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = TestCoverageAnalyzer.getInstance();
      const instance2 = TestCoverageAnalyzer.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Chapter Analysis', () => {
    beforeEach(() => {
      // Mock file system
      (fs.promises.readdir as jest.Mock).mockResolvedValue([
        { name: 'Component1.tsx', isFile: () => true, isDirectory: () => false },
        { name: 'Component2.tsx', isFile: () => true, isDirectory: () => false },
        { name: 'Component1.test.tsx', isFile: () => true, isDirectory: () => false }
      ]);

      // Mock file content
      const mockContent = `
        function Component1() {
          if (condition) {
            return <div>True</div>;
          } else {
            return <div>False</div>;
          }
        }

        function handleClick() {
          switch(value) {
            case 'a':
              return 1;
            case 'b':
              return 2;
            default:
              return 0;
          }
        }
      `;
      (fs.promises.readFile as jest.Mock).mockResolvedValue(mockContent);
    });

    it('should analyze chapter components', async () => {
      const coverage = await analyzer.analyzeChapter(10);
      expect(coverage.chapterNumber).toBe(10);
      expect(coverage.components.length).toBe(2); // Excludes test files
    });

    it('should calculate component complexity', async () => {
      const coverage = await analyzer.analyzeChapter(10);
      const component = coverage.components[0];
      expect(component.complexity).toBeGreaterThan(1); // Has if/else and switch statements
    });

    it('should identify critical paths', async () => {
      // Mock low coverage metrics
      (fs.promises.readFile as jest.Mock).mockResolvedValue(`
        function UncoveredComponent() {
          if (a) {
            if (b) {
              if (c) {
                return x;
              }
            }
          }
          return y;
        }
      `);

      const coverage = await analyzer.analyzeChapter(10);
      expect(coverage.criticalPaths.length).toBeGreaterThan(0);
    });

    it('should generate recommendations', async () => {
      const coverage = await analyzer.analyzeChapter(10);
      expect(coverage.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Coverage Report', () => {
    it('should generate a comprehensive report', async () => {
      await analyzer.analyzeChapter(10);
      const report = analyzer.generateCoverageReport(10);

      expect(report).toContain('Test Coverage Report for Chapter 10');
      expect(report).toContain('Aggregate Metrics');
      expect(report).toContain('Critical Paths');
      expect(report).toContain('Recommendations');
      expect(report).toContain('Component Details');
    });

    it('should handle missing coverage data', () => {
      const report = analyzer.generateCoverageReport(999);
      expect(report).toContain('No coverage data available');
    });
  });

  describe('Thresholds', () => {
    it('should respect custom thresholds', async () => {
      analyzer.setThresholds({
        statements: 90, // Higher threshold
        branches: 85,
        functions: 95,
        lines: 90
      });

      await analyzer.analyzeChapter(10);
      const coverage = analyzer.getChapterCoverage(10);
      
      expect(coverage?.recommendations).toContain(
        expect.stringMatching(/Increase .* coverage .* to meet .*% threshold/)
      );
    });
  });

  describe('Complex Code Analysis', () => {
    it('should identify complex components', async () => {
      // Mock a complex component
      (fs.promises.readFile as jest.Mock).mockResolvedValue(`
        function ComplexComponent() {
          if (a) {
            if (b) {
              if (c) {
                if (d) {
                  if (e) {
                    return x;
                  }
                }
              }
            }
          }
          switch(value) {
            case 'a': return 1;
            case 'b': return 2;
            case 'c': return 3;
            case 'd': return 4;
            default: return 0;
          }
        }
      `);

      const coverage = await analyzer.analyzeChapter(10);
      expect(coverage.recommendations).toContain(
        expect.stringMatching(/Reduce complexity/)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle file system errors gracefully', async () => {
      (fs.promises.readdir as jest.Mock).mockRejectedValue(new Error('File system error'));

      await expect(analyzer.analyzeChapter(10)).rejects.toThrow('File system error');
    });

    it('should handle invalid file content', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValue('Invalid {{ content');

      const coverage = await analyzer.analyzeChapter(10);
      expect(coverage.components[0].complexity).toBe(1); // Base complexity
    });
  });
});


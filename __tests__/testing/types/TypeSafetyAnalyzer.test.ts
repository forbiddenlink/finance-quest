import { TypeSafetyAnalyzer, TypeIssue } from '@/lib/testing/types/TypeSafetyAnalyzer';
import { Project } from 'ts-morph';
import path from 'path';

jest.mock('ts-morph', () => {
  return {
    Project: jest.fn().mockImplementation(() => ({
      getSourceFiles: jest.fn().mockReturnValue([]),
      getTypeChecker: jest.fn(),
    })),
  };
});

describe('TypeSafetyAnalyzer', () => {
  let analyzer: TypeSafetyAnalyzer;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Get fresh instance
    analyzer = TypeSafetyAnalyzer.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = TypeSafetyAnalyzer.getInstance();
      const instance2 = TypeSafetyAnalyzer.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('analyzeFiles', () => {
    it('should analyze files and return results', async () => {
      const mockSourceFile = {
        getFilePath: () => '/test/file.ts',
        forEachDescendant: jest.fn(),
        getLineAndColumnAtPos: () => ({ line: 1, column: 1 }),
      };

      (Project as jest.Mock).mockImplementation(() => ({
        getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
        getTypeChecker: jest.fn(),
      }));

      const results = await analyzer.analyzeFiles(['**/*.ts']);

      expect(results).toHaveProperty('issues');
      expect(results).toHaveProperty('stats');
      expect(results).toHaveProperty('summary');
      expect(results.stats).toHaveProperty('totalFiles');
      expect(results.stats).toHaveProperty('filesWithIssues');
      expect(results.stats).toHaveProperty('totalIssues');
      expect(results.stats).toHaveProperty('issuesBySeverity');
      expect(results.stats).toHaveProperty('commonIssues');
    });

    it('should handle files with no issues', async () => {
      const mockSourceFile = {
        getFilePath: () => '/test/file.ts',
        forEachDescendant: jest.fn(),
        getLineAndColumnAtPos: () => ({ line: 1, column: 1 }),
      };

      (Project as jest.Mock).mockImplementation(() => ({
        getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
        getTypeChecker: jest.fn(),
      }));

      const results = await analyzer.analyzeFiles(['**/*.ts']);

      expect(results.stats.totalIssues).toBe(0);
      expect(results.stats.filesWithIssues).toBe(0);
    });

    it('should detect implicit any types', async () => {
      const mockNode = {
        getType: () => ({ isAny: () => true }),
        getTypeNode: () => null,
        getStart: () => 0,
      };

      const mockSourceFile = {
        getFilePath: () => '/test/file.ts',
        forEachDescendant: (callback: (node: any) => void) => callback(mockNode),
        getLineAndColumnAtPos: () => ({ line: 1, column: 1 }),
      };

      (Project as jest.Mock).mockImplementation(() => ({
        getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
        getTypeChecker: jest.fn(),
      }));

      const results = await analyzer.analyzeFiles(['**/*.ts']);

      expect(results.issues.some(issue => 
        issue.code === 'TS7006' && 
        issue.message.includes('Implicit any')
      )).toBe(true);
    });

    it('should detect missing parameter types', async () => {
      const mockParam = {
        getTypeNode: () => null,
        getStart: () => 0,
      };

      const mockNode = {
        compilerNode: { kind: 'FunctionDeclaration' },
        getParameters: () => [mockParam],
        getStart: () => 0,
      };

      const mockSourceFile = {
        getFilePath: () => '/test/file.ts',
        forEachDescendant: (callback: (node: any) => void) => callback(mockNode),
        getLineAndColumnAtPos: () => ({ line: 1, column: 1 }),
      };

      (Project as jest.Mock).mockImplementation(() => ({
        getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
        getTypeChecker: jest.fn(),
      }));

      const results = await analyzer.analyzeFiles(['**/*.ts']);

      expect(results.issues.some(issue => 
        issue.code === 'TS7006' && 
        issue.message.includes('Missing parameter type')
      )).toBe(true);
    });

    it('should detect missing return types', async () => {
      const mockNode = {
        compilerNode: { kind: 'FunctionDeclaration' },
        getReturnTypeNode: () => null,
        getStart: () => 0,
      };

      const mockSourceFile = {
        getFilePath: () => '/test/file.ts',
        forEachDescendant: (callback: (node: any) => void) => callback(mockNode),
        getLineAndColumnAtPos: () => ({ line: 1, column: 1 }),
      };

      (Project as jest.Mock).mockImplementation(() => ({
        getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
        getTypeChecker: jest.fn(),
      }));

      const results = await analyzer.analyzeFiles(['**/*.ts']);

      expect(results.issues.some(issue => 
        issue.code === 'TS7006' && 
        issue.message.includes('Missing return type')
      )).toBe(true);
    });

    it('should generate correct summary statistics', async () => {
      const mockIssues: TypeIssue[] = [
        {
          filePath: '/test/file1.ts',
          line: 1,
          column: 1,
          message: 'Issue 1',
          severity: 'error',
          code: 'TS001',
        },
        {
          filePath: '/test/file1.ts',
          line: 2,
          column: 1,
          message: 'Issue 2',
          severity: 'warning',
          code: 'TS002',
        },
        {
          filePath: '/test/file2.ts',
          line: 1,
          column: 1,
          message: 'Issue 3',
          severity: 'info',
          code: 'TS001',
        },
      ];

      const mockSourceFiles = [
        {
          getFilePath: () => '/test/file1.ts',
          forEachDescendant: jest.fn(),
          getLineAndColumnAtPos: () => ({ line: 1, column: 1 }),
        },
        {
          getFilePath: () => '/test/file2.ts',
          forEachDescendant: jest.fn(),
          getLineAndColumnAtPos: () => ({ line: 1, column: 1 }),
        },
      ];

      (Project as jest.Mock).mockImplementation(() => ({
        getSourceFiles: jest.fn().mockReturnValue(mockSourceFiles),
        getTypeChecker: jest.fn(),
      }));

      // Mock the analyzeFile method to return our mock issues
      const analyzeFileSpy = jest.spyOn(analyzer as any, 'analyzeFile')
        .mockImplementation((sourceFile: any) => {
          return sourceFile.getFilePath() === '/test/file1.ts'
            ? mockIssues.slice(0, 2)
            : [mockIssues[2]];
        });

      const results = await analyzer.analyzeFiles(['**/*.ts']);

      expect(results.stats.totalFiles).toBe(2);
      expect(results.stats.filesWithIssues).toBe(2);
      expect(results.stats.totalIssues).toBe(3);
      expect(results.stats.issuesBySeverity).toEqual({
        error: 1,
        warning: 1,
        info: 1,
      });
      expect(results.stats.commonIssues).toContainEqual({
        pattern: 'TS001',
        count: 2,
      });

      analyzeFileSpy.mockRestore();
    });
  });
});


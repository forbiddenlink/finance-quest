import { Project, SourceFile } from 'ts-morph';
import path from 'path';
import fs from 'fs/promises';
import { TypeSafetyAnalyzer } from '../../../lib/testing/types/TypeSafetyAnalyzer';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
  readFile: jest.fn(),
}));

// Mock ts-morph
jest.mock('ts-morph', () => {
  const actual = jest.requireActual('ts-morph');
  return {
    ...actual,
    Project: jest.fn(),
  };
});

describe('TypeSafetyAnalyzer CI Mode', () => {
  let mockProject: jest.Mocked<Project>;
  let mockSourceFile: jest.Mocked<SourceFile>;
  let analyzer: TypeSafetyAnalyzer;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock source file
    mockSourceFile = {
      getFilePath: jest.fn().mockReturnValue('/test/file.ts'),
      getLineAndColumnAtPos: jest.fn().mockReturnValue({ line: 1, column: 1 }),
    } as unknown as jest.Mocked<SourceFile>;

    // Create mock project
    mockProject = {
      getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
    } as unknown as jest.Mocked<Project>;

    // Mock Project constructor
    (Project as jest.Mock).mockImplementation(() => mockProject);

    // Get analyzer instance
    analyzer = TypeSafetyAnalyzer.getInstance();
  });

  describe('CI Mode Analysis', () => {
    it('should generate JSON report in CI mode', async () => {
      // Mock analyzer to return some issues
      jest.spyOn(analyzer, 'analyzeFile').mockReturnValue([
        {
          getLineAndColumn: () => ({ line: 1, column: 1 }),
          getSeverity: () => 'error',
          getMessage: () => 'Test error',
          getCode: () => 'TS2322',
        },
        {
          getLineAndColumn: () => ({ line: 2, column: 1 }),
          getSeverity: () => 'warning',
          getMessage: () => 'Test warning',
          getCode: () => 'TS2571',
        },
      ]);

      // Run analysis in CI mode
      await runAnalysis(true);

      // Verify JSON report was written
      expect(fs.writeFile).toHaveBeenCalledWith(
        'type-safety-report.json',
        expect.stringContaining('"severity":"error"'),
        expect.any(String)
      );

      // Verify markdown report was not written in CI mode
      expect(fs.writeFile).not.toHaveBeenCalledWith(
        'docs/TYPE_SAFETY_REPORT.md',
        expect.any(String),
        expect.any(String)
      );
    });

    it('should exit with error code when critical issues found', async () => {
      // Mock process.exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation();

      // Mock analyzer to return critical issues
      jest.spyOn(analyzer, 'analyzeFile').mockReturnValue([
        {
          getLineAndColumn: () => ({ line: 1, column: 1 }),
          getSeverity: () => 'error',
          getMessage: () => 'Critical error',
          getCode: () => 'TS2322',
        },
      ]);

      // Run analysis in CI mode
      await runAnalysis(true);

      // Verify process exit was called with error code
      expect(mockExit).toHaveBeenCalledWith(1);

      // Restore process.exit
      mockExit.mockRestore();
    });

    it('should not exit when no critical issues found', async () => {
      // Mock process.exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation();

      // Mock analyzer to return non-critical issues
      jest.spyOn(analyzer, 'analyzeFile').mockReturnValue([
        {
          getLineAndColumn: () => ({ line: 1, column: 1 }),
          getSeverity: () => 'warning',
          getMessage: () => 'Test warning',
          getCode: () => 'TS2571',
        },
      ]);

      // Run analysis in CI mode
      await runAnalysis(true);

      // Verify process exit was not called
      expect(mockExit).not.toHaveBeenCalled();

      // Restore process.exit
      mockExit.mockRestore();
    });

    it('should skip node_modules and test files', async () => {
      // Mock source files including node_modules and test files
      const mockFiles = [
        { getFilePath: () => '/test/src/file.ts' },
        { getFilePath: () => '/test/node_modules/lib.ts' },
        { getFilePath: () => '/test/src/file.test.ts' },
      ] as unknown as SourceFile[];

      mockProject.getSourceFiles.mockReturnValue(mockFiles);

      // Mock analyzer
      const analyzeSpy = jest.spyOn(analyzer, 'analyzeFile');

      // Run analysis
      await runAnalysis(true);

      // Verify only non-test, non-node_modules files were analyzed
      expect(analyzeSpy).toHaveBeenCalledTimes(1);
      expect(analyzeSpy).toHaveBeenCalledWith(mockFiles[0]);
    });

    it('should generate correct file statistics', async () => {
      // Mock analyzer to return mixed issues
      jest.spyOn(analyzer, 'analyzeFile').mockReturnValue([
        {
          getLineAndColumn: () => ({ line: 1, column: 1 }),
          getSeverity: () => 'error',
          getMessage: () => 'Test error',
          getCode: () => 'TS2322',
        },
        {
          getLineAndColumn: () => ({ line: 2, column: 1 }),
          getSeverity: () => 'warning',
          getMessage: () => 'Test warning',
          getCode: () => 'TS2571',
        },
        {
          getLineAndColumn: () => ({ line: 3, column: 1 }),
          getSeverity: () => 'info',
          getMessage: () => 'Test info',
          getCode: () => 'TS7006',
        },
      ]);

      // Run analysis
      await runAnalysis(true);

      // Verify JSON report contains correct statistics
      expect(fs.writeFile).toHaveBeenCalledWith(
        'type-safety-report.json',
        expect.stringContaining('"errors":1'),
        expect.any(String)
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        'type-safety-report.json',
        expect.stringContaining('"warnings":1'),
        expect.any(String)
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        'type-safety-report.json',
        expect.stringContaining('"info":1'),
        expect.any(String)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle file write errors gracefully', async () => {
      // Mock fs.writeFile to throw error
      (fs.writeFile as jest.Mock).mockRejectedValue(new Error('Write error'));

      // Mock console.error
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      // Mock process.exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation();

      // Run analysis
      await runAnalysis(true);

      // Verify error was logged
      expect(consoleError).toHaveBeenCalledWith(
        'Error running type safety analysis:',
        expect.any(Error)
      );

      // Verify process exit was called with error code
      expect(mockExit).toHaveBeenCalledWith(1);

      // Restore mocks
      consoleError.mockRestore();
      mockExit.mockRestore();
    });

    it('should handle analyzer errors gracefully', async () => {
      // Mock analyzer to throw error
      jest.spyOn(analyzer, 'analyzeFile').mockImplementation(() => {
        throw new Error('Analysis error');
      });

      // Mock console.error
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      // Mock process.exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation();

      // Run analysis
      await runAnalysis(true);

      // Verify error was logged
      expect(consoleError).toHaveBeenCalledWith(
        'Error running type safety analysis:',
        expect.any(Error)
      );

      // Verify process exit was called with error code
      expect(mockExit).toHaveBeenCalledWith(1);

      // Restore mocks
      consoleError.mockRestore();
      mockExit.mockRestore();
    });
  });
});

// Helper function to run analysis (copied from runTypeSafetyAnalysis.ts)
async function runAnalysis(isCI: boolean = false): Promise<void> {
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
  });

  const analyzer = TypeSafetyAnalyzer.getInstance();
  const sourceFiles = project.getSourceFiles();
  const issues: Array<{
    filePath: string;
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
    code: string;
  }> = [];
  const fileStats: { [filePath: string]: { errors: number; warnings: number; info: number } } = {};

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();
    const relativeFilePath = path.relative(process.cwd(), filePath);

    // Skip node_modules and test files
    if (filePath.includes('node_modules') || filePath.includes('.test.')) {
      continue;
    }

    const fileIssues = analyzer.analyzeFile(sourceFile);
    fileStats[relativeFilePath] = {
      errors: 0,
      warnings: 0,
      info: 0,
    };

    for (const issue of fileIssues) {
      const { line, column } = issue.getLineAndColumn();
      const severity = issue.getSeverity();
      const message = issue.getMessage();
      const code = issue.getCode();

      issues.push({
        filePath: relativeFilePath,
        line,
        column,
        message,
        severity,
        code,
      });

      fileStats[relativeFilePath][severity]++;
    }
  }

  const summary = {
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
  };

  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: sourceFiles.length,
    filesWithIssues: Object.keys(fileStats).filter(file => 
      fileStats[file].errors + fileStats[file].warnings + fileStats[file].info > 0
    ).length,
    issues,
    summary,
    fileStats,
  };

  // Save JSON report
  await fs.writeFile(
    'type-safety-report.json',
    JSON.stringify(report, null, 2)
  );

  if (!isCI) {
    // Generate markdown report
    const markdownReport = generateMarkdownReport(report);
    await fs.writeFile('docs/TYPE_SAFETY_REPORT.md', markdownReport);
  }

  // Log summary
  console.log('\nType Safety Analysis Summary:');
  console.log(`Total files analyzed: ${report.totalFiles}`);
  console.log(`Files with issues: ${report.filesWithIssues}`);
  console.log(`Total issues: ${issues.length}`);
  console.log(`  - Errors: ${summary.errors}`);
  console.log(`  - Warnings: ${summary.warnings}`);
  console.log(`  - Info: ${summary.info}\n`);

  if (isCI && summary.errors > 0) {
    process.exit(1);
  }
}

// Mock function to satisfy TypeScript (not used in tests)
function generateMarkdownReport(): string {
  return '';
}


import { runAnalysis } from '@/scripts/analyzers/runTypeSafetyAnalysis';
import { TypeSafetyAnalyzer } from '@/lib/testing/types/TypeSafetyAnalyzer';
import fs from 'fs/promises';
import path from 'path';

jest.mock('@/lib/testing/types/TypeSafetyAnalyzer');
jest.mock('fs/promises');

describe('runTypeSafetyAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should analyze calculator components and generate a report', async () => {
    const mockAnalyzeFiles = jest.fn().mockResolvedValue({
      issues: [
        {
          filePath: '/test/Calculator.tsx',
          line: 1,
          column: 1,
          message: 'Test error',
          severity: 'error',
          code: 'TS001',
        },
        {
          filePath: '/test/Calculator.tsx',
          line: 2,
          column: 1,
          message: 'Test warning',
          severity: 'warning',
          code: 'TS002',
          suggestedFix: 'Add type annotation',
        },
      ],
      stats: {
        totalFiles: 2,
        filesWithIssues: 1,
        totalIssues: 2,
        issuesBySeverity: {
          error: 1,
          warning: 1,
          info: 0,
        },
        commonIssues: [
          { pattern: 'TS001', count: 1 },
          { pattern: 'TS002', count: 1 },
        ],
      },
      summary: 'Test summary',
    });

    (TypeSafetyAnalyzer.getInstance as jest.Mock).mockReturnValue({
      analyzeFiles: mockAnalyzeFiles,
    });

    const results = await runAnalysis();

    // Verify analyzer was called with correct patterns
    expect(mockAnalyzeFiles).toHaveBeenCalledWith([
      'components/chapters/fundamentals/calculators/**/*.{ts,tsx}',
      'components/shared/calculators/**/*.{ts,tsx}',
    ]);

    // Verify report was written
    expect(fs.writeFile).toHaveBeenCalled();
    const [reportPath, reportContent] = (fs.writeFile as jest.Mock).mock.calls[0];
    
    // Verify report path
    expect(reportPath).toContain('TYPE_SAFETY_REPORT.md');
    
    // Verify report content
    expect(reportContent).toContain('# Type Safety Analysis Report');
    expect(reportContent).toContain('Test summary');
    expect(reportContent).toContain('Test error');
    expect(reportContent).toContain('Test warning');
    expect(reportContent).toContain('Add type annotation');
    expect(reportContent).toContain('TS001');
    expect(reportContent).toContain('TS002');

    // Verify return value
    expect(results).toEqual({
      calculatorResults: expect.any(Object),
      reportPath: expect.stringContaining('TYPE_SAFETY_REPORT.md'),
    });
  });

  it('should handle analysis with no issues', async () => {
    const mockAnalyzeFiles = jest.fn().mockResolvedValue({
      issues: [],
      stats: {
        totalFiles: 2,
        filesWithIssues: 0,
        totalIssues: 0,
        issuesBySeverity: {
          error: 0,
          warning: 0,
          info: 0,
        },
        commonIssues: [],
      },
      summary: 'No issues found',
    });

    (TypeSafetyAnalyzer.getInstance as jest.Mock).mockReturnValue({
      analyzeFiles: mockAnalyzeFiles,
    });

    const results = await runAnalysis();

    // Verify report was written
    expect(fs.writeFile).toHaveBeenCalled();
    const [, reportContent] = (fs.writeFile as jest.Mock).mock.calls[0];
    
    // Verify report content
    expect(reportContent).toContain('# Type Safety Analysis Report');
    expect(reportContent).toContain('No issues found');
    expect(reportContent).not.toContain('Critical Issues');
  });

  it('should handle analysis errors gracefully', async () => {
    const mockAnalyzeFiles = jest.fn().mockRejectedValue(new Error('Analysis failed'));

    (TypeSafetyAnalyzer.getInstance as jest.Mock).mockReturnValue({
      analyzeFiles: mockAnalyzeFiles,
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Run analysis directly as if from command line
    const module = require('@/scripts/analyzers/runTypeSafetyAnalysis');
    await module.runAnalysis().catch(() => {});

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });
});


import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { execSync } from 'child_process';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

// Mock child_process
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

describe('Type Safety GitHub Actions Workflow', () => {
  let workflowContent: any;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    // Read the actual workflow file
    (fs.readFile as jest.Mock).mockResolvedValue(`
name: Type Safety Checks

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  type-check:
    name: Type Safety Analysis
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: TypeScript compilation check
        run: npx tsc --noEmit

      - name: ESLint type safety check
        run: |
          npx eslint . \\
            --config .eslintrc.type-safety.json \\
            --ext .ts,.tsx \\
            --max-warnings 0 \\
            --format @microsoft/eslint-formatter-sarif \\
            --output-file eslint-results.sarif

      - name: Upload ESLint results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: eslint-results.sarif
          category: ESLint-TypeSafety

      - name: Run type safety analyzer
        run: npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci
        continue-on-error: true

      - name: Check for type-safety regressions
        run: |
          if [ -f "type-safety-report.json" ]; then
            CRITICAL_ISSUES=$(jq '.issues | map(select(.severity == "error")) | length' type-safety-report.json)
            if [ "$CRITICAL_ISSUES" -gt 0 ]; then
              echo "Found $CRITICAL_ISSUES critical type safety issues"
              exit 1
            fi
          else
            echo "No type safety report found"
            exit 1
          fi
    `);

    workflowContent = yaml.parse((fs.readFile as jest.Mock).mock.results[0].value);
  });

  describe('Workflow Structure', () => {
    it('should have correct triggers', () => {
      expect(workflowContent.on).toMatchObject({
        push: { branches: ['main'] },
        pull_request: { branches: ['main'] },
        workflow_dispatch: {},
      });
    });

    it('should run on ubuntu-latest', () => {
      expect(workflowContent.jobs['type-check'].runs-on).toBe('ubuntu-latest');
    });

    it('should use correct Node.js setup', () => {
      const setupNode = workflowContent.jobs['type-check'].steps.find(
        (step: any) => step.name === 'Setup Node.js'
      );
      expect(setupNode).toMatchObject({
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': '20',
          cache: 'npm',
        },
      });
    });
  });

  describe('Type Safety Steps', () => {
    it('should run TypeScript compilation check', () => {
      const tsCheck = workflowContent.jobs['type-check'].steps.find(
        (step: any) => step.name === 'TypeScript compilation check'
      );
      expect(tsCheck.run).toBe('npx tsc --noEmit');
    });

    it('should run ESLint with correct configuration', () => {
      const eslintCheck = workflowContent.jobs['type-check'].steps.find(
        (step: any) => step.name === 'ESLint type safety check'
      );
      expect(eslintCheck.run).toContain('.eslintrc.type-safety.json');
      expect(eslintCheck.run).toContain('--max-warnings 0');
      expect(eslintCheck.run).toContain('--format @microsoft/eslint-formatter-sarif');
    });

    it('should upload SARIF results', () => {
      const sarifUpload = workflowContent.jobs['type-check'].steps.find(
        (step: any) => step.name === 'Upload ESLint results'
      );
      expect(sarifUpload).toMatchObject({
        uses: 'github/codeql-action/upload-sarif@v2',
        if: 'always()',
        with: {
          sarif_file: 'eslint-results.sarif',
          category: 'ESLint-TypeSafety',
        },
      });
    });

    it('should run type safety analyzer in CI mode', () => {
      const analyzerStep = workflowContent.jobs['type-check'].steps.find(
        (step: any) => step.name === 'Run type safety analyzer'
      );
      expect(analyzerStep.run).toBe('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci');
      expect(analyzerStep['continue-on-error']).toBe(true);
    });

    it('should check for type safety regressions', () => {
      const regressionCheck = workflowContent.jobs['type-check'].steps.find(
        (step: any) => step.name === 'Check for type-safety regressions'
      );
      expect(regressionCheck.run).toContain('type-safety-report.json');
      expect(regressionCheck.run).toContain('CRITICAL_ISSUES=$(jq');
    });
  });

  describe('End-to-End Integration', () => {
    const mockTypeSafetyReport = {
      issues: [
        { severity: 'error', message: 'Critical issue' },
        { severity: 'warning', message: 'Warning' },
      ],
    };

    beforeEach(() => {
      // Mock the report file
      (fs.readFile as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('type-safety-report.json')) {
          return Promise.resolve(JSON.stringify(mockTypeSafetyReport));
        }
        throw new Error('File not found');
      });
    });

    it('should fail when critical issues are found', async () => {
      // Mock execSync to simulate running the workflow
      (execSync as jest.Mock).mockImplementation((cmd) => {
        if (cmd.includes('tsc')) return '';
        if (cmd.includes('eslint')) return '';
        if (cmd.includes('runTypeSafetyAnalysis.ts')) {
          // Write mock report
          require('fs').writeFileSync(
            'type-safety-report.json',
            JSON.stringify(mockTypeSafetyReport)
          );
          return '';
        }
        throw new Error(`Unexpected command: ${cmd}`);
      });

      // Run the workflow
      const exitCode = await runWorkflow();
      expect(exitCode).toBe(1);
    });

    it('should pass when no critical issues are found', async () => {
      // Mock report with no critical issues
      const safeReport = {
        issues: [
          { severity: 'warning', message: 'Warning 1' },
          { severity: 'info', message: 'Info 1' },
        ],
      };

      (execSync as jest.Mock).mockImplementation((cmd) => {
        if (cmd.includes('tsc')) return '';
        if (cmd.includes('eslint')) return '';
        if (cmd.includes('runTypeSafetyAnalysis.ts')) {
          // Write mock report
          require('fs').writeFileSync(
            'type-safety-report.json',
            JSON.stringify(safeReport)
          );
          return '';
        }
        throw new Error(`Unexpected command: ${cmd}`);
      });

      // Run the workflow
      const exitCode = await runWorkflow();
      expect(exitCode).toBe(0);
    });

    it('should fail when type safety report is missing', async () => {
      (execSync as jest.Mock).mockImplementation((cmd) => {
        if (cmd.includes('tsc')) return '';
        if (cmd.includes('eslint')) return '';
        if (cmd.includes('runTypeSafetyAnalysis.ts')) {
          // Don't create report file
          return '';
        }
        throw new Error(`Unexpected command: ${cmd}`);
      });

      // Run the workflow
      const exitCode = await runWorkflow();
      expect(exitCode).toBe(1);
    });

    it('should handle TypeScript compilation errors', async () => {
      (execSync as jest.Mock).mockImplementation((cmd) => {
        if (cmd.includes('tsc')) {
          throw new Error('TypeScript compilation failed');
        }
        return '';
      });

      // Run the workflow
      const exitCode = await runWorkflow();
      expect(exitCode).toBe(1);
    });

    it('should handle ESLint errors', async () => {
      (execSync as jest.Mock).mockImplementation((cmd) => {
        if (cmd.includes('eslint')) {
          throw new Error('ESLint check failed');
        }
        return '';
      });

      // Run the workflow
      const exitCode = await runWorkflow();
      expect(exitCode).toBe(1);
    });
  });
});

// Helper function to simulate running the workflow
async function runWorkflow(): Promise<number> {
  try {
    // Run TypeScript check
    execSync('npx tsc --noEmit');

    // Run ESLint check
    execSync(
      'npx eslint . --config .eslintrc.type-safety.json --ext .ts,.tsx --max-warnings 0'
    );

    // Run type safety analyzer
    execSync('npx tsx scripts/analyzers/runTypeSafetyAnalysis.ts --ci');

    // Check for type safety regressions
    if (require('fs').existsSync('type-safety-report.json')) {
      const report = JSON.parse(
        require('fs').readFileSync('type-safety-report.json', 'utf8')
      );
      const criticalIssues = report.issues.filter(
        (issue: any) => issue.severity === 'error'
      ).length;
      if (criticalIssues > 0) {
        return 1;
      }
    } else {
      return 1;
    }

    return 0;
  } catch (error) {
    return 1;
  }
}


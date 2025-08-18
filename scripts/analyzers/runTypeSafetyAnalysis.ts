import { Project } from 'ts-morph';
import path from 'path';
import fs from 'fs/promises';
import { TypeSafetyAnalyzer } from '../../lib/testing/types/TypeSafetyAnalyzer';

interface TypeSafetyIssue {
  filePath: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
}

interface TypeSafetyReport {
  timestamp: string;
  totalFiles: number;
  filesWithIssues: number;
  issues: TypeSafetyIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
  fileStats: {
    [filePath: string]: {
      errors: number;
      warnings: number;
      info: number;
    };
  };
}

async function runAnalysis(isCI: boolean = false): Promise<void> {
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
  });

  const analyzer = TypeSafetyAnalyzer.getInstance();
  const sourceFiles = project.getSourceFiles();
  const issues: TypeSafetyIssue[] = [];
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

  const report: TypeSafetyReport = {
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

function generateMarkdownReport(report: TypeSafetyReport): string {
  const { totalFiles, filesWithIssues, issues, summary, fileStats } = report;

  // Sort files by total issues
  const sortedFiles = Object.entries(fileStats)
    .sort(([, a], [, b]) => 
      (b.errors + b.warnings + b.info) - (a.errors + a.warnings + a.info)
    );

  let markdown = `# Type Safety Analysis Report\n\n`;
  markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;

  markdown += `## Overview\n\n`;
  markdown += `- Total files analyzed: ${totalFiles}\n`;
  markdown += `- Files with issues: ${filesWithIssues}\n`;
  markdown += `- Total issues: ${issues.length}\n`;
  markdown += `  - Errors: ${summary.errors}\n`;
  markdown += `  - Warnings: ${summary.warnings}\n`;
  markdown += `  - Info: ${summary.info}\n\n`;

  markdown += `## Critical Issues\n\n`;
  const criticalIssues = issues.filter(i => i.severity === 'error');
  if (criticalIssues.length > 0) {
    markdown += `| File | Line | Issue |\n`;
    markdown += `|------|------|--------|\n`;
    criticalIssues.forEach(issue => {
      markdown += `| ${issue.filePath} | ${issue.line} | ${issue.message} |\n`;
    });
  } else {
    markdown += `No critical issues found.\n`;
  }

  markdown += `\n## Common Issue Patterns\n\n`;
  const issueTypes = issues.reduce((acc, issue) => {
    acc[issue.code] = (acc[issue.code] || 0) + 1;
    return acc;
  }, {} as { [code: string]: number });

  const sortedIssueTypes = Object.entries(issueTypes)
    .sort(([, a], [, b]) => b - a);

  markdown += `| Issue Type | Count |\n`;
  markdown += `|------------|-------|\n`;
  sortedIssueTypes.forEach(([code, count]) => {
    markdown += `| ${code} | ${count} |\n`;
  });

  markdown += `\n## Files with Most Issues\n\n`;
  markdown += `| File | Errors | Warnings | Info |\n`;
  markdown += `|------|---------|-----------|------|\n`;
  sortedFiles.slice(0, 10).forEach(([file, stats]) => {
    markdown += `| ${file} | ${stats.errors} | ${stats.warnings} | ${stats.info} |\n`;
  });

  markdown += `\n## Recommendations\n\n`;
  markdown += `1. Add explicit types to function parameters and return values\n`;
  markdown += `2. Use type guards to handle unknown data\n`;
  markdown += `3. Replace unsafe type assertions with proper type checks\n`;
  markdown += `4. Add null/undefined checks where appropriate\n`;
  markdown += `5. Use strict TypeScript configuration\n`;

  return markdown;
}

// Parse command line arguments
const args = process.argv.slice(2);
const isCI = args.includes('--ci');

runAnalysis(isCI).catch(error => {
  console.error('Error running type safety analysis:', error);
  process.exit(1);
});
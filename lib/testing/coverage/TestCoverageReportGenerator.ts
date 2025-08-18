import { TestCoverageAnalyzer } from './TestCoverageAnalyzer';
import fs from 'fs';
import path from 'path';

interface ChapterSummary {
  chapterNumber: number;
  totalComponents: number;
  testedComponents: number;
  coverageMetrics: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  criticalPaths: string[];
  recommendations: string[];
}

interface TestCoverageReport {
  overallCoverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  chapterSummaries: ChapterSummary[];
  criticalGaps: string[];
  recommendations: string[];
  testQualityMetrics: {
    totalTests: number;
    accessibilityTests: number;
    integrationTests: number;
    unitTests: number;
    componentTests: number;
  };
}

export class TestCoverageReportGenerator {
  private static instance: TestCoverageReportGenerator;
  private analyzer: TestCoverageAnalyzer;

  private constructor() {
    this.analyzer = TestCoverageAnalyzer.getInstance();
  }

  public static getInstance(): TestCoverageReportGenerator {
    if (!TestCoverageReportGenerator.instance) {
      TestCoverageReportGenerator.instance = new TestCoverageReportGenerator();
    }
    return TestCoverageReportGenerator.instance;
  }

  public async generateReport(startChapter: number, endChapter: number): Promise<TestCoverageReport> {
    const chapterSummaries: ChapterSummary[] = [];
    const criticalGaps: string[] = [];
    const recommendations: string[] = [];
    let totalStatements = 0;
    let totalBranches = 0;
    let totalFunctions = 0;
    let totalLines = 0;
    let totalComponents = 0;
    let totalTestedComponents = 0;

    // Analyze each chapter
    for (let chapter = startChapter; chapter <= endChapter; chapter++) {
      const coverage = await this.analyzer.analyzeChapter(chapter);
      
      const summary: ChapterSummary = {
        chapterNumber: chapter,
        totalComponents: coverage.components.length,
        testedComponents: coverage.components.filter(comp => 
          comp.metrics.statements > 0 || 
          comp.metrics.branches > 0 || 
          comp.metrics.functions > 0
        ).length,
        coverageMetrics: coverage.aggregateMetrics,
        criticalPaths: coverage.criticalPaths,
        recommendations: coverage.recommendations
      };

      chapterSummaries.push(summary);

      // Aggregate metrics
      totalStatements += coverage.aggregateMetrics.statements * coverage.components.length;
      totalBranches += coverage.aggregateMetrics.branches * coverage.components.length;
      totalFunctions += coverage.aggregateMetrics.functions * coverage.components.length;
      totalLines += coverage.aggregateMetrics.lines * coverage.components.length;
      totalComponents += coverage.components.length;
      totalTestedComponents += summary.testedComponents;

      // Collect critical gaps
      if (coverage.criticalPaths.length > 0) {
        criticalGaps.push(
          \`Chapter \${chapter} critical paths:\\n\${coverage.criticalPaths.join('\\n')}\`
        );
      }

      // Collect recommendations
      if (coverage.recommendations.length > 0) {
        recommendations.push(
          \`Chapter \${chapter} recommendations:\\n\${coverage.recommendations.join('\\n')}\`
        );
      }
    }

    // Calculate overall coverage
    const componentCount = Math.max(1, totalComponents);
    const overallCoverage = {
      statements: totalStatements / componentCount,
      branches: totalBranches / componentCount,
      functions: totalFunctions / componentCount,
      lines: totalLines / componentCount
    };

    // Calculate test quality metrics
    const testQualityMetrics = await this.analyzeTestQuality(startChapter, endChapter);

    return {
      overallCoverage,
      chapterSummaries,
      criticalGaps,
      recommendations,
      testQualityMetrics
    };
  }

  private async analyzeTestQuality(
    startChapter: number,
    endChapter: number
  ): Promise<TestCoverageReport['testQualityMetrics']> {
    let totalTests = 0;
    let accessibilityTests = 0;
    let integrationTests = 0;
    let unitTests = 0;
    let componentTests = 0;

    for (let chapter = startChapter; chapter <= endChapter; chapter++) {
      const testFile = path.join('__tests__', 'chapters', \`Chapter\${chapter}.test.tsx\`);
      
      try {
        const content = await fs.promises.readFile(testFile, 'utf-8');
        const lines = content.split('\\n');

        // Count test types
        for (const line of lines) {
          if (line.includes('it(')) totalTests++;
          if (line.toLowerCase().includes('accessibility')) accessibilityTests++;
          if (line.toLowerCase().includes('integration')) integrationTests++;
          if (
            line.toLowerCase().includes('renders') ||
            line.toLowerCase().includes('component')
          ) {
            componentTests++;
          }
        }

        // Unit tests are those that aren't component, integration, or accessibility tests
        unitTests = totalTests - (componentTests + integrationTests + accessibilityTests);
      } catch (error) {
        console.warn(\`Could not analyze test file for Chapter \${chapter}\`);
      }
    }

    return {
      totalTests,
      accessibilityTests,
      integrationTests,
      unitTests,
      componentTests
    };
  }

  public generateMarkdownReport(report: TestCoverageReport): string {
    const markdown = [
      '# Test Coverage Report',
      '',
      '## Overall Coverage',
      '',
      '| Metric | Coverage |',
      '|--------|----------|',
      \`| Statements | \${report.overallCoverage.statements.toFixed(1)}% |\\n\`,
      \`| Branches | \${report.overallCoverage.branches.toFixed(1)}% |\\n\`,
      \`| Functions | \${report.overallCoverage.functions.toFixed(1)}% |\\n\`,
      \`| Lines | \${report.overallCoverage.lines.toFixed(1)}% |\\n\`,
      '',
      '## Test Quality Metrics',
      '',
      '| Metric | Count |',
      '|--------|--------|',
      \`| Total Tests | \${report.testQualityMetrics.totalTests} |\\n\`,
      \`| Accessibility Tests | \${report.testQualityMetrics.accessibilityTests} |\\n\`,
      \`| Integration Tests | \${report.testQualityMetrics.integrationTests} |\\n\`,
      \`| Unit Tests | \${report.testQualityMetrics.unitTests} |\\n\`,
      \`| Component Tests | \${report.testQualityMetrics.componentTests} |\\n\`,
      '',
      '## Chapter Summaries',
      '',
      ...report.chapterSummaries.map(chapter => [
        \`### Chapter \${chapter.chapterNumber}\`,
        '',
        \`- Components: \${chapter.testedComponents}/\${chapter.totalComponents} tested\`,
        \`- Statement Coverage: \${chapter.coverageMetrics.statements.toFixed(1)}%\`,
        \`- Branch Coverage: \${chapter.coverageMetrics.branches.toFixed(1)}%\`,
        \`- Function Coverage: \${chapter.coverageMetrics.functions.toFixed(1)}%\`,
        \`- Line Coverage: \${chapter.coverageMetrics.lines.toFixed(1)}%\`,
        '',
        chapter.criticalPaths.length > 0 ? [
          'Critical Paths:',
          ...chapter.criticalPaths.map(path => \`- \${path}\`),
          ''
        ].join('\\n') : '',
        chapter.recommendations.length > 0 ? [
          'Recommendations:',
          ...chapter.recommendations.map(rec => \`- \${rec}\`),
          ''
        ].join('\\n') : ''
      ].join('\\n')),
      '',
      '## Critical Gaps',
      '',
      ...report.criticalGaps.map(gap => \`- \${gap}\\n\`),
      '',
      '## Recommendations',
      '',
      ...report.recommendations.map(rec => \`- \${rec}\\n\`),
      '',
      '## Next Steps',
      '',
      '1. Address critical gaps in coverage',
      '2. Implement recommended improvements',
      '3. Add missing test types where identified',
      '4. Enhance test quality in low-coverage areas',
      '5. Regular monitoring and maintenance of test suite'
    ].join('\\n');

    return markdown;
  }

  public async saveReport(report: TestCoverageReport, outputPath: string): Promise<void> {
    const markdown = this.generateMarkdownReport(report);
    await fs.promises.writeFile(outputPath, markdown, 'utf-8');
  }
}


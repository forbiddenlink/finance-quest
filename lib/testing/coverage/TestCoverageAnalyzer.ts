import fs from 'fs';
import path from 'path';

interface CoverageMetrics {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

interface ComponentCoverage {
  path: string;
  metrics: CoverageMetrics;
  uncoveredLines: number[];
  uncoveredFunctions: string[];
  uncoveredBranches: string[];
  complexity: number;
}

interface ChapterCoverage {
  chapterNumber: number;
  components: ComponentCoverage[];
  aggregateMetrics: CoverageMetrics;
  criticalPaths: string[];
  recommendations: string[];
}

interface CoverageThresholds {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

export class TestCoverageAnalyzer {
  private static instance: TestCoverageAnalyzer;
  private coverageData: Map<number, ChapterCoverage> = new Map();
  private thresholds: CoverageThresholds = {
    statements: 80,
    branches: 75,
    functions: 85,
    lines: 80
  };

  private constructor() {}

  public static getInstance(): TestCoverageAnalyzer {
    if (!TestCoverageAnalyzer.instance) {
      TestCoverageAnalyzer.instance = new TestCoverageAnalyzer();
    }
    return TestCoverageAnalyzer.instance;
  }

  public setThresholds(thresholds: Partial<CoverageThresholds>) {
    this.thresholds = {
      ...this.thresholds,
      ...thresholds
    };
  }

  public async analyzeChapter(chapterNumber: number): Promise<ChapterCoverage> {
    const chapterPath = path.join('app', \`chapter\${chapterNumber}\`);
    const components = await this.findComponents(chapterPath);
    const componentCoverage = await Promise.all(
      components.map(comp => this.analyzeComponent(comp))
    );

    const aggregateMetrics = this.calculateAggregateMetrics(componentCoverage);
    const criticalPaths = this.identifyCriticalPaths(componentCoverage);
    const recommendations = this.generateRecommendations(
      componentCoverage,
      aggregateMetrics
    );

    const coverage: ChapterCoverage = {
      chapterNumber,
      components: componentCoverage,
      aggregateMetrics,
      criticalPaths,
      recommendations
    };

    this.coverageData.set(chapterNumber, coverage);
    return coverage;
  }

  private async findComponents(chapterPath: string): Promise<string[]> {
    const components: string[] = [];
    
    const scanDirectory = async (dirPath: string) => {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (
          entry.isFile() &&
          /\.(tsx?|jsx?)$/.test(entry.name) &&
          !entry.name.includes('.test.') &&
          !entry.name.includes('.spec.')
        ) {
          components.push(fullPath);
        }
      }
    };

    await scanDirectory(chapterPath);
    return components;
  }

  private async analyzeComponent(componentPath: string): Promise<ComponentCoverage> {
    // This would integrate with Jest's coverage collector in a real implementation
    // For now, we'll simulate coverage analysis
    const content = await fs.promises.readFile(componentPath, 'utf-8');
    const lines = content.split('\\n');

    const metrics = this.calculateComponentMetrics(content);
    const uncoveredLines = this.findUncoveredLines(content);
    const uncoveredFunctions = this.findUncoveredFunctions(content);
    const uncoveredBranches = this.findUncoveredBranches(content);
    const complexity = this.calculateComplexity(content);

    return {
      path: componentPath,
      metrics,
      uncoveredLines,
      uncoveredFunctions,
      uncoveredBranches,
      complexity
    };
  }

  private calculateComponentMetrics(content: string): CoverageMetrics {
    // In a real implementation, this would use Jest's coverage data
    // For now, we'll use a simple heuristic
    const lines = content.split('\\n');
    const functionCount = (content.match(/function|=>/g) || []).length;
    const branchCount = (content.match(/if|else|switch|\\?|\\:|\\|\\||&&/g) || []).length;

    return {
      statements: 0, // Would be calculated from Jest coverage data
      branches: 0,   // Would be calculated from Jest coverage data
      functions: 0,  // Would be calculated from Jest coverage data
      lines: 0       // Would be calculated from Jest coverage data
    };
  }

  private findUncoveredLines(content: string): number[] {
    // In a real implementation, this would use Jest's coverage data
    // For now, return an empty array
    return [];
  }

  private findUncoveredFunctions(content: string): string[] {
    // In a real implementation, this would use Jest's coverage data
    // For now, return an empty array
    return [];
  }

  private findUncoveredBranches(content: string): string[] {
    // In a real implementation, this would use Jest's coverage data
    // For now, return an empty array
    return [];
  }

  private calculateComplexity(content: string): number {
    // Calculate cyclomatic complexity
    const branchingPatterns = [
      /if\s*\(/g,
      /else\s+if\s*\(/g,
      /else\s*{/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /do\s*{/g,
      /switch\s*\(/g,
      /case\s+/g,
      /catch\s*\(/g,
      /\|\|/g,
      /&&/g,
      /\?/g
    ];

    return branchingPatterns.reduce((complexity, pattern) => {
      const matches = content.match(pattern) || [];
      return complexity + matches.length;
    }, 1); // Base complexity of 1
  }

  private calculateAggregateMetrics(
    components: ComponentCoverage[]
  ): CoverageMetrics {
    const total = components.reduce(
      (acc, comp) => ({
        statements: acc.statements + comp.metrics.statements,
        branches: acc.branches + comp.metrics.branches,
        functions: acc.functions + comp.metrics.functions,
        lines: acc.lines + comp.metrics.lines
      }),
      { statements: 0, branches: 0, functions: 0, lines: 0 }
    );

    const count = components.length;
    return {
      statements: total.statements / count,
      branches: total.branches / count,
      functions: total.functions / count,
      lines: total.lines / count
    };
  }

  private identifyCriticalPaths(components: ComponentCoverage[]): string[] {
    return components
      .filter(comp => {
        const { metrics } = comp;
        return (
          metrics.statements < this.thresholds.statements ||
          metrics.branches < this.thresholds.branches ||
          metrics.functions < this.thresholds.functions ||
          metrics.lines < this.thresholds.lines ||
          comp.complexity > 10 // High complexity threshold
        );
      })
      .map(comp => comp.path);
  }

  private generateRecommendations(
    components: ComponentCoverage[],
    aggregateMetrics: CoverageMetrics
  ): string[] {
    const recommendations: string[] = [];

    // Check overall coverage
    if (aggregateMetrics.statements < this.thresholds.statements) {
      recommendations.push(
        \`Increase statement coverage from \${aggregateMetrics.statements.toFixed(1)}% to meet \${this.thresholds.statements}% threshold\`
      );
    }
    if (aggregateMetrics.branches < this.thresholds.branches) {
      recommendations.push(
        \`Increase branch coverage from \${aggregateMetrics.branches.toFixed(1)}% to meet \${this.thresholds.branches}% threshold\`
      );
    }
    if (aggregateMetrics.functions < this.thresholds.functions) {
      recommendations.push(
        \`Increase function coverage from \${aggregateMetrics.functions.toFixed(1)}% to meet \${this.thresholds.functions}% threshold\`
      );
    }

    // Check complex components
    const complexComponents = components.filter(comp => comp.complexity > 10);
    if (complexComponents.length > 0) {
      recommendations.push(
        \`Reduce complexity in \${complexComponents.length} component(s): \${
          complexComponents.map(comp => path.basename(comp.path)).join(', ')
        }\`
      );
    }

    // Check untested functions
    const componentsWithUncoveredFunctions = components.filter(
      comp => comp.uncoveredFunctions.length > 0
    );
    if (componentsWithUncoveredFunctions.length > 0) {
      recommendations.push(
        \`Add tests for uncovered functions in \${componentsWithUncoveredFunctions.length} component(s)\`
      );
    }

    // Check untested branches
    const componentsWithUncoveredBranches = components.filter(
      comp => comp.uncoveredBranches.length > 0
    );
    if (componentsWithUncoveredBranches.length > 0) {
      recommendations.push(
        \`Add tests for uncovered branches in \${componentsWithUncoveredBranches.length} component(s)\`
      );
    }

    return recommendations;
  }

  public generateCoverageReport(chapterNumber: number): string {
    const coverage = this.coverageData.get(chapterNumber);
    if (!coverage) {
      return \`No coverage data available for Chapter \${chapterNumber}\`;
    }

    const report = [
      \`Test Coverage Report for Chapter \${chapterNumber}\`,
      '==========================================',
      '',
      'Aggregate Metrics:',
      \`- Statements: \${coverage.aggregateMetrics.statements.toFixed(1)}%\`,
      \`- Branches: \${coverage.aggregateMetrics.branches.toFixed(1)}%\`,
      \`- Functions: \${coverage.aggregateMetrics.functions.toFixed(1)}%\`,
      \`- Lines: \${coverage.aggregateMetrics.lines.toFixed(1)}%\`,
      '',
      'Critical Paths:',
      ...coverage.criticalPaths.map(path => \`- \${path}\`),
      '',
      'Recommendations:',
      ...coverage.recommendations.map(rec => \`- \${rec}\`),
      '',
      'Component Details:',
      ...coverage.components.map(comp => [
        \`\${comp.path}:`,
        \`  Complexity: \${comp.complexity}\`,
        \`  Statements: \${comp.metrics.statements.toFixed(1)}%\`,
        \`  Branches: \${comp.metrics.branches.toFixed(1)}%\`,
        \`  Functions: \${comp.metrics.functions.toFixed(1)}%\`,
        \`  Lines: \${comp.metrics.lines.toFixed(1)}%\`,
        comp.uncoveredFunctions.length > 0
          ? \`  Uncovered Functions: \${comp.uncoveredFunctions.join(', ')}\`
          : null,
        comp.uncoveredBranches.length > 0
          ? \`  Uncovered Branches: \${comp.uncoveredBranches.join(', ')}\`
          : null,
        ''
      ].filter(Boolean).join('\\n'))
    ].join('\\n');

    return report;
  }

  public getChapterCoverage(chapterNumber: number): ChapterCoverage | undefined {
    return this.coverageData.get(chapterNumber);
  }

  public clearCoverageData() {
    this.coverageData.clear();
  }
}


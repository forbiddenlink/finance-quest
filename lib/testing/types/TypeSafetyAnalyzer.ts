import { Project, TypeChecker, Node, ts } from 'ts-morph';
import path from 'path';

export interface TypeIssue {
  filePath: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  suggestedFix?: string;
}

export interface TypeAnalysisResult {
  issues: TypeIssue[];
  stats: {
    totalFiles: number;
    filesWithIssues: number;
    totalIssues: number;
    issuesBySeverity: Record<string, number>;
    commonIssues: Array<{ pattern: string; count: number }>;
  };
  summary: string;
}

export class TypeSafetyAnalyzer {
  private static instance: TypeSafetyAnalyzer;
  private project: Project;
  private typeChecker: TypeChecker;

  private constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    });
    this.typeChecker = this.project.getTypeChecker();
  }

  public static getInstance(): TypeSafetyAnalyzer {
    if (!TypeSafetyAnalyzer.instance) {
      TypeSafetyAnalyzer.instance = new TypeSafetyAnalyzer();
    }
    return TypeSafetyAnalyzer.instance;
  }

  public async analyzeFiles(patterns: string[]): Promise<TypeAnalysisResult> {
    const sourceFiles = this.project.getSourceFiles(patterns);
    const issues: TypeIssue[] = [];
    const stats = {
      totalFiles: sourceFiles.length,
      filesWithIssues: 0,
      totalIssues: 0,
      issuesBySeverity: { error: 0, warning: 0, info: 0 },
      commonIssues: [] as Array<{ pattern: string; count: number }>,
    };

    const issuePatterns = new Map<string, number>();

    for (const sourceFile of sourceFiles) {
      const fileIssues = await this.analyzeFile(sourceFile);
      
      if (fileIssues.length > 0) {
        stats.filesWithIssues++;
        issues.push(...fileIssues);
        
        // Track issue patterns
        fileIssues.forEach(issue => {
          stats.issuesBySeverity[issue.severity]++;
          const count = issuePatterns.get(issue.code) || 0;
          issuePatterns.set(issue.code, count + 1);
        });
      }
    }

    stats.totalIssues = issues.length;
    stats.commonIssues = Array.from(issuePatterns.entries())
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const summary = this.generateSummary(stats);

    return { issues, stats, summary };
  }

  private async analyzeFile(sourceFile: any): Promise<TypeIssue[]> {
    const issues: TypeIssue[] = [];

    sourceFile.forEachDescendant((node: Node) => {
      // Check for any/unknown types
      if (ts.isParameter(node.compilerNode) || ts.isPropertyDeclaration(node.compilerNode)) {
        const type = node.getType();
        if (type.isAny() && !this.isExplicitAny(node)) {
          issues.push(this.createIssue(
            sourceFile,
            node,
            'Implicit any type detected',
            'warning',
            'TS7006',
            'Consider adding explicit type annotation'
          ));
        }
      }

      // Check for type assertions
      if (ts.isAsExpression(node.compilerNode)) {
        issues.push(this.createIssue(
          sourceFile,
          node,
          'Type assertion detected',
          'info',
          'TS2352',
          'Consider using type guard or type narrowing'
        ));
      }

      // Check for non-null assertions
      if (ts.isNonNullExpression(node.compilerNode)) {
        issues.push(this.createIssue(
          sourceFile,
          node,
          'Non-null assertion detected',
          'warning',
          'TS2531',
          'Consider handling null/undefined case explicitly'
        ));
      }

      // Check for unsafe type coercion
      if (this.isUnsafeTypeCoercion(node)) {
        issues.push(this.createIssue(
          sourceFile,
          node,
          'Unsafe type coercion detected',
          'error',
          'TS2352',
          'Use proper type guards or validation'
        ));
      }

      // Check for missing parameter types
      if (ts.isFunctionDeclaration(node.compilerNode) || ts.isMethodDeclaration(node.compilerNode)) {
        const params = node.getChildrenOfKind(ts.SyntaxKind.Parameter);
        params.forEach(param => {
          if (!param.getChildrenOfKind(ts.SyntaxKind.TypeReference).length) {
            issues.push(this.createIssue(
              sourceFile,
              param,
              'Missing parameter type annotation',
              'warning',
              'TS7006',
              'Add explicit type annotation'
            ));
          }
        });
      }

      // Check for missing return types
      if ((ts.isFunctionDeclaration(node.compilerNode) || ts.isMethodDeclaration(node.compilerNode))) {
        const returnType = node.getChildrenOfKind(ts.SyntaxKind.TypeReference);
        if (!returnType.length) {
          issues.push(this.createIssue(
            sourceFile,
            node,
            'Missing return type annotation',
            'warning',
            'TS7006',
            'Add explicit return type'
          ));
        }
      }

      // Check for unsafe indexing
      if (ts.isElementAccessExpression(node.compilerNode)) {
        issues.push(this.createIssue(
          sourceFile,
          node,
          'Potentially unsafe array/object access',
          'info',
          'TS7053',
          'Consider adding bounds/existence check'
        ));
      }
    });

    return issues;
  }

  private isExplicitAny(node: Node): boolean {
    if (ts.isTypeReferenceNode(node.compilerNode)) {
      return node.getText() === 'any';
    }
    return false;
  }

  private isUnsafeTypeCoercion(node: Node): boolean {
    if (!ts.isCallExpression(node.compilerNode)) return false;
    const expression = node.getExpression();
    const text = expression.getText();
    return ['Number', 'String', 'Boolean'].includes(text);
  }

  private createIssue(
    sourceFile: any,
    node: Node,
    message: string,
    severity: 'error' | 'warning' | 'info',
    code: string,
    suggestedFix?: string
  ): TypeIssue {
    const { line, column } = sourceFile.getLineAndColumnAtPos(node.getStart());
    return {
      filePath: sourceFile.getFilePath(),
      line,
      column,
      message,
      severity,
      code,
      suggestedFix,
    };
  }

  private generateSummary(stats: TypeAnalysisResult['stats']): string {
    const issueRate = ((stats.filesWithIssues / stats.totalFiles) * 100).toFixed(1);
    const severityBreakdown = Object.entries(stats.issuesBySeverity)
      .map(([severity, count]) => `${severity}: ${count}`)
      .join(', ');

    return [
      `Type Safety Analysis Summary:`,
      `- Analyzed ${stats.totalFiles} files`,
      `- Found issues in ${stats.filesWithIssues} files (${issueRate}%)`,
      `- Total issues: ${stats.totalIssues}`,
      `- Issues by severity: ${severityBreakdown}`,
      `- Top issue patterns:`,
      ...stats.commonIssues.map(({ pattern, count }) => 
        `  • ${pattern}: ${count} occurrences`
      ),
    ].join('\n');
  }
}

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { CalculatorError, ErrorContext, prepareErrorReport } from '@/lib/errors/types';
import { getErrorMessage } from '@/lib/errors/utils';

interface ErrorBoundaryProps {
  calculatorId: string;
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class CalculatorErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Create error context
    const context: ErrorContext = {
      calculatorId: this.props.calculatorId,
      operation: 'render',
      timestamp: Date.now(),
      stack: errorInfo.componentStack
    };

    // Prepare error report
    const report = prepareErrorReport(error, context, {
      includeStack: true,
      includeTiming: true,
      tags: {
        component: 'CalculatorErrorBoundary',
        calculator: this.props.calculatorId
      }
    });

    // Call error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error report
    console.error('Calculator Error:', report);
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    if (this.state.error) {
      const error = this.state.error;
      const isCalculatorError = error instanceof CalculatorError;
      const errorMessage = getErrorMessage(error);

      return (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Calculator Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {isCalculatorError ? (
                  <>
                    <div className="font-medium">{error.code}</div>
                    <div>{errorMessage}</div>
                    {error.field && (
                      <div className="text-sm">Field: {error.field}</div>
                    )}
                  </>
                ) : (
                  errorMessage
                )}
              </AlertDescription>
            </Alert>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <div className="mt-4">
                <details className="text-sm">
                  <summary className="cursor-pointer text-red-600">
                    Stack trace
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}


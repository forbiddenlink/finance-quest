'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { theme } from '@/lib/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Future: Error reporting service integration (Sentry, LogRocket, etc.)
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={`min-h-screen flex items-center justify-center ${theme.backgrounds.primary} p-4`}>
          <div className={`max-w-md w-full ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-8 text-center`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.error.bg} rounded-full mb-6`}>
              <AlertTriangle className={`w-8 h-8 ${theme.status.error.text}`} />
            </div>
            
            <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-4`}>
              Oops! Something went wrong
            </h2>
            
            <p className={`${theme.textColors.secondary} mb-6`}>
              We encountered an unexpected error. Don&apos;t worry, your progress is saved!
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={`${theme.backgrounds.cardDisabled} border ${theme.borderColors.muted} rounded p-4 mb-6 text-left`}>
                <summary className={`cursor-pointer font-medium ${theme.textColors.primary}`}>
                  Error Details (Development)
                </summary>
                <pre className={`mt-2 text-xs ${theme.textColors.muted} overflow-auto`}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleReset}
              className={`inline-flex items-center gap-2 px-6 py-3 ${theme.buttons.primary} rounded-lg font-medium transition-all hover:scale-105`}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <div className={`mt-6 text-sm ${theme.textColors.muted}`}>
              <p>If this problem persists, try:</p>
              <ul className="mt-2 space-y-1">
                <li>• Refreshing the page</li>
                <li>• Clearing your browser cache</li>
                <li>• Using an incognito/private window</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

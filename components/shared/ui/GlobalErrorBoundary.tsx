'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Finance Quest Error:', error, errorInfo);
    
    // Future: Error reporting service integration
    // if (process.env.NODE_ENV === 'production') {
    //   reportError(error, errorInfo);
    // }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`min-h-screen ${theme.backgrounds.primary} flex items-center justify-center p-4`}>
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-8 max-w-md w-full text-center`}>
            <AlertTriangle className={`w-12 h-12 mx-auto mb-4 ${theme.status.error.text}`} />
            <h2 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>
              Something went wrong
            </h2>
            <p className={`${theme.textColors.secondary} mb-6`}>
              We&apos;re sorry, but something unexpected happened. Your progress is saved.
            </p>
            <button
              onClick={() => window.location.reload()}
              className={`${theme.buttons.primary} px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;

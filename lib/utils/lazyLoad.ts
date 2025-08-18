import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component interface
interface LoadingComponentProps {
  isLoading?: boolean;
  error?: Error | null;
}

// Default loading component
const DefaultLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Default error component
const DefaultError = ({ error }: { error: Error }) => (
  <div className="p-4 text-red-500">
    <h3 className="font-semibold">Error loading component</h3>
    <p className="text-sm">{error.message}</p>
  </div>
);

// Options for lazy loading
interface LazyLoadOptions {
  loading?: ComponentType<LoadingComponentProps>;
  ssr?: boolean;
  suspense?: boolean;
}

/**
 * Lazy loads a component with standardized loading and error states
 * @param importFn Function that returns the component import promise
 * @param options Configuration options for lazy loading
 */
export function lazyLoad<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyLoadOptions = {}
) {
  const {
    loading = DefaultLoading,
    ssr = false,
    suspense = true
  } = options;

  return dynamic(importFn, {
    loading,
    ssr,
    suspense
  });
}

/**
 * Lazy loads a calculator component with standardized configuration
 * @param calculatorPath Path to the calculator component
 */
export function lazyLoadCalculator(calculatorPath: string) {
  return lazyLoad(() => import(`@/components/${calculatorPath}`), {
    ssr: false,
    suspense: true
  });
}

/**
 * Lazy loads a chapter component with standardized configuration
 * @param chapterPath Path to the chapter component
 */
export function lazyLoadChapter(chapterPath: string) {
  return lazyLoad(() => import(`@/components/${chapterPath}`), {
    ssr: true,
    suspense: true
  });
}


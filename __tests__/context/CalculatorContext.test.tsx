import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import {
  CalculatorProvider,
  useCalculatorContext,
  useCalculatorActions,
  useCalculatorState,
  useActiveCalculator,
  useCommonInputs,
  useCalculatorCache,
  useCalculatorErrors,
  useCalculatorLoading,
  useCalculatorUI
} from '@/lib/context/CalculatorContext';
import { CalculatorError } from '@/lib/errors/types';

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <CalculatorProvider>{children}</CalculatorProvider>;
}

describe('Calculator Context', () => {
  describe('Context Provider', () => {
    it('provides calculator state and dispatch', () => {
      const { result } = renderHook(() => useCalculatorContext(), {
        wrapper: TestWrapper
      });

      expect(result.current.state).toBeDefined();
      expect(result.current.dispatch).toBeDefined();
    });

    it('throws error when used outside provider', () => {
      const { result } = renderHook(() => useCalculatorContext());
      expect(result.error).toEqual(
        Error('useCalculatorContext must be used within a CalculatorProvider')
      );
    });
  });

  describe('Action Creators', () => {
    it('sets active calculator', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      act(() => {
        result.current.setActiveCalculator('test-calculator');
      });

      const state = renderHook(() => useCalculatorState(), {
        wrapper: TestWrapper
      }).result.current;

      expect(state.activeCalculator).toBe('test-calculator');
      expect(state.calculatorHistory).toContain('test-calculator');
      expect(state.lastUsedCalculators[0]).toBe('test-calculator');
    });

    it('updates common inputs', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      act(() => {
        result.current.updateCommonInput('inflationRate', 3.5);
      });

      const inputs = renderHook(() => useCommonInputs(), {
        wrapper: TestWrapper
      }).result.current;

      expect(inputs.inflationRate).toBe(3.5);
    });

    it('caches calculator state', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      const testState = {
        values: { amount: 1000 },
        results: { total: 1100 }
      };

      act(() => {
        result.current.cacheCalculatorState(
          'test-calculator',
          testState.values,
          testState.results
        );
      });

      const cache = renderHook(() => useCalculatorCache('test-calculator'), {
        wrapper: TestWrapper
      }).result.current;

      expect(cache.values).toEqual(testState.values);
      expect(cache.results).toEqual(testState.results);
    });

    it('manages errors', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      const testError = new CalculatorError(
        'Test error',
        'TEST_ERROR',
        'error'
      );

      act(() => {
        result.current.addError(testError);
      });

      const errors = renderHook(() => useCalculatorErrors(), {
        wrapper: TestWrapper
      }).result.current;

      expect(errors.errors).toHaveLength(1);
      expect(errors.lastError).toBe(testError);

      act(() => {
        result.current.clearErrors();
      });

      expect(errors.errors).toHaveLength(0);
      expect(errors.lastError).toBeNull();
    });

    it('manages loading state', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      act(() => {
        result.current.setLoading(true, 'Loading...');
      });

      const loading = renderHook(() => useCalculatorLoading(), {
        wrapper: TestWrapper
      }).result.current;

      expect(loading.loading).toBe(true);
      expect(loading.loadingMessage).toBe('Loading...');
    });

    it('manages UI state', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      act(() => {
        result.current.setActiveTab('results');
        result.current.toggleSection('section1');
        result.current.markFieldDirty('amount');
      });

      const ui = renderHook(() => useCalculatorUI(), {
        wrapper: TestWrapper
      }).result.current;

      expect(ui.activeTab).toBe('results');
      expect(ui.expandedSections).toContain('section1');
      expect(ui.dirtyFields).toContain('amount');

      act(() => {
        result.current.clearDirtyFields();
      });

      expect(ui.dirtyFields).toHaveLength(0);
    });

    it('resets state', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      // Set some state
      act(() => {
        result.current.setActiveCalculator('test-calculator');
        result.current.updateCommonInput('inflationRate', 3.5);
        result.current.setActiveTab('results');
      });

      // Reset state
      act(() => {
        result.current.resetState();
      });

      const state = renderHook(() => useCalculatorState(), {
        wrapper: TestWrapper
      }).result.current;

      expect(state.activeCalculator).toBeNull();
      expect(state.activeTab).toBe('inputs');
      // Common inputs should be preserved
      expect(state.commonInputs.inflationRate).toBe(3.5);
    });
  });

  describe('Selector Hooks', () => {
    it('selects active calculator', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      act(() => {
        result.current.setActiveCalculator('test-calculator');
      });

      const activeCalculator = renderHook(() => useActiveCalculator(), {
        wrapper: TestWrapper
      }).result.current;

      expect(activeCalculator).toBe('test-calculator');
    });

    it('selects common inputs', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      act(() => {
        result.current.updateCommonInput('taxRate', 25);
      });

      const inputs = renderHook(() => useCommonInputs(), {
        wrapper: TestWrapper
      }).result.current;

      expect(inputs.taxRate).toBe(25);
    });

    it('selects calculator cache', () => {
      const { result } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      const testState = {
        values: { amount: 1000 },
        results: { total: 1100 }
      };

      act(() => {
        result.current.cacheCalculatorState(
          'test-calculator',
          testState.values,
          testState.results
        );
      });

      const cache = renderHook(
        () => useCalculatorCache('test-calculator'),
        { wrapper: TestWrapper }
      ).result.current;

      expect(cache.values).toEqual(testState.values);
      expect(cache.results).toEqual(testState.results);
    });
  });
});


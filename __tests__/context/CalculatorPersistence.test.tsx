import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import {
  CalculatorProvider,
  useCalculatorActions,
  useCalculatorState
} from '@/lib/context/CalculatorContext';
import {
  CalculatorPersistenceProvider,
  useCalculatorPersistence
} from '@/lib/context/CalculatorPersistence';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorProvider>
      <CalculatorPersistenceProvider>
        {children}
      </CalculatorPersistenceProvider>
    </CalculatorProvider>
  );
}

describe('Calculator Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('State Loading', () => {
    it('loads persisted state on mount', () => {
      const persistedState = {
        timestamp: Date.now(),
        commonInputs: {
          inflationRate: 3.5,
          taxRate: 25
        },
        calculatorCache: {
          'test-calculator': {
            values: { amount: 1000 },
            results: { total: 1100 },
            timestamp: Date.now()
          }
        },
        lastUsedCalculators: ['test-calculator']
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(persistedState));

      const { result } = renderHook(() => useCalculatorState(), {
        wrapper: TestWrapper
      });

      expect(result.current.commonInputs.inflationRate).toBe(3.5);
      expect(result.current.commonInputs.taxRate).toBe(25);
      expect(result.current.calculatorCache['test-calculator']).toBeDefined();
    });

    it('handles expired state', () => {
      const expiredState = {
        timestamp: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        commonInputs: {
          inflationRate: 3.5
        }
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredState));

      const { result } = renderHook(() => useCalculatorState(), {
        wrapper: TestWrapper
      });

      expect(result.current.commonInputs.inflationRate).not.toBe(3.5);
      expect(mockLocalStorage.removeItem).toHaveBeenCalled();
    });

    it('handles invalid stored data', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const { result } = renderHook(() => useCalculatorState(), {
        wrapper: TestWrapper
      });

      expect(result.current).toBeDefined();
      // Should use initial state
      expect(result.current.commonInputs.inflationRate).toBe(2.5);
    });
  });

  describe('State Persistence', () => {
    it('persists state changes', () => {
      const { result: actionsResult } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      act(() => {
        actionsResult.current.updateCommonInput('inflationRate', 4.0);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedState = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedState.commonInputs.inflationRate).toBe(4.0);
    });

    it('persists calculator cache', () => {
      const { result: actionsResult } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      const testState = {
        values: { amount: 1000 },
        results: { total: 1100 }
      };

      act(() => {
        actionsResult.current.cacheCalculatorState(
          'test-calculator',
          testState.values,
          testState.results
        );
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedState = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedState.calculatorCache['test-calculator'].values).toEqual(testState.values);
    });

    it('cleans up expired cache entries', () => {
      const persistedState = {
        timestamp: Date.now(),
        calculatorCache: {
          'fresh-calculator': {
            values: { amount: 1000 },
            results: { total: 1100 },
            timestamp: Date.now()
          },
          'stale-calculator': {
            values: { amount: 2000 },
            results: { total: 2200 },
            timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
          }
        }
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(persistedState));

      const { result } = renderHook(() => useCalculatorState(), {
        wrapper: TestWrapper
      });

      expect(result.current.calculatorCache['fresh-calculator']).toBeDefined();
      expect(result.current.calculatorCache['stale-calculator']).toBeUndefined();
    });
  });

  describe('Manual Persistence Operations', () => {
    it('manually saves state', () => {
      const { result: persistenceResult } = renderHook(
        () => useCalculatorPersistence(),
        { wrapper: TestWrapper }
      );

      act(() => {
        persistenceResult.current.saveState();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('manually clears state', () => {
      const { result: persistenceResult } = renderHook(
        () => useCalculatorPersistence(),
        { wrapper: TestWrapper }
      );

      act(() => {
        persistenceResult.current.clearState();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalled();
    });
  });
});


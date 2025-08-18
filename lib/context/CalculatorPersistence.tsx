import React, { useEffect } from 'react';
import { useCalculatorContext, CalculatorState } from './CalculatorContext';

// Storage key for calculator state
const STORAGE_KEY = 'calculator_state';

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Fields to persist
const PERSISTED_FIELDS: (keyof CalculatorState)[] = [
  'commonInputs',
  'calculatorCache',
  'lastUsedCalculators'
];

// Type for persisted state
type PersistedState = Pick<CalculatorState, typeof PERSISTED_FIELDS[number]> & {
  timestamp: number;
};

/**
 * Loads persisted calculator state from storage
 */
function loadPersistedState(): Partial<CalculatorState> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as PersistedState;
    
    // Check if data is expired
    if (Date.now() - data.timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Clean up expired calculator cache entries
    const cleanCache = Object.entries(data.calculatorCache).reduce(
      (acc, [id, entry]) => {
        if (Date.now() - entry.timestamp <= CACHE_EXPIRATION) {
          acc[id] = entry;
        }
        return acc;
      },
      {} as CalculatorState['calculatorCache']
    );

    return {
      ...data,
      calculatorCache: cleanCache
    };
  } catch (error) {
    console.error('Error loading calculator state:', error);
    return null;
  }
}

/**
 * Saves calculator state to storage
 */
function persistState(state: CalculatorState) {
  try {
    const dataToStore: PersistedState = {
      timestamp: Date.now(),
      commonInputs: state.commonInputs,
      calculatorCache: state.calculatorCache,
      lastUsedCalculators: state.lastUsedCalculators
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Error persisting calculator state:', error);
  }
}

/**
 * Provider component that handles calculator state persistence
 */
export function CalculatorPersistenceProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { state, dispatch } = useCalculatorContext();

  // Load persisted state on mount
  useEffect(() => {
    const persisted = loadPersistedState();
    if (persisted) {
      // Update each persisted field
      Object.entries(persisted).forEach(([field, value]) => {
        if (field === 'commonInputs') {
          Object.entries(value as CalculatorState['commonInputs']).forEach(
            ([inputField, inputValue]) => {
              dispatch({
                type: 'UPDATE_COMMON_INPUT',
                payload: { field: inputField, value: inputValue }
              });
            }
          );
        } else if (field === 'calculatorCache') {
          Object.entries(value as CalculatorState['calculatorCache']).forEach(
            ([id, cache]) => {
              dispatch({
                type: 'CACHE_CALCULATOR_STATE',
                payload: {
                  id,
                  values: cache.values,
                  results: cache.results
                }
              });
            }
          );
        }
      });
    }
  }, [dispatch]);

  // Persist state changes
  useEffect(() => {
    persistState(state);
  }, [state.commonInputs, state.calculatorCache, state.lastUsedCalculators]);

  return <>{children}</>;
}

/**
 * Hook for manual persistence operations
 */
export function useCalculatorPersistence() {
  const { state } = useCalculatorContext();

  const saveState = () => {
    persistState(state);
  };

  const clearState = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    saveState,
    clearState
  };
}


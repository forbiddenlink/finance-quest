import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { CalculatorError } from '../errors/types';

// State Types
export interface CalculatorState {
  // Calculator Metadata
  activeCalculator: string | null;
  calculatorHistory: string[];
  lastUsedCalculators: string[];

  // Shared Values
  commonInputs: {
    inflationRate?: number;
    taxRate?: number;
    riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
    investmentTimeframe?: number;
  };

  // Calculator Cache
  calculatorCache: Record<string, {
    values: Record<string, unknown>;
    results: Record<string, unknown>;
    timestamp: number;
  }>;

  // Error State
  errors: CalculatorError[];
  lastError: CalculatorError | null;

  // Loading State
  loading: boolean;
  loadingMessage?: string;

  // UI State
  activeTab: string;
  expandedSections: string[];
  dirtyFields: string[];
}

// Action Types
export type CalculatorAction =
  | { type: 'SET_ACTIVE_CALCULATOR'; payload: string }
  | { type: 'UPDATE_COMMON_INPUT'; payload: { field: string; value: unknown } }
  | { type: 'CACHE_CALCULATOR_STATE'; payload: { id: string; values: Record<string, unknown>; results: Record<string, unknown> } }
  | { type: 'ADD_ERROR'; payload: CalculatorError }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; payload: { loading: boolean; message?: string } }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'TOGGLE_SECTION'; payload: string }
  | { type: 'MARK_FIELD_DIRTY'; payload: string }
  | { type: 'CLEAR_DIRTY_FIELDS' }
  | { type: 'RESET_STATE' };

// Initial State
const initialState: CalculatorState = {
  activeCalculator: null,
  calculatorHistory: [],
  lastUsedCalculators: [],
  commonInputs: {
    inflationRate: 2.5,
    taxRate: 25,
    riskTolerance: 'moderate',
    investmentTimeframe: 10
  },
  calculatorCache: {},
  errors: [],
  lastError: null,
  loading: false,
  activeTab: 'inputs',
  expandedSections: [],
  dirtyFields: []
};

// Reducer
function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_ACTIVE_CALCULATOR':
      return {
        ...state,
        activeCalculator: action.payload,
        calculatorHistory: [...state.calculatorHistory, action.payload],
        lastUsedCalculators: [
          action.payload,
          ...state.lastUsedCalculators.filter(id => id !== action.payload)
        ].slice(0, 5)
      };

    case 'UPDATE_COMMON_INPUT':
      return {
        ...state,
        commonInputs: {
          ...state.commonInputs,
          [action.payload.field]: action.payload.value
        }
      };

    case 'CACHE_CALCULATOR_STATE':
      return {
        ...state,
        calculatorCache: {
          ...state.calculatorCache,
          [action.payload.id]: {
            values: action.payload.values,
            results: action.payload.results,
            timestamp: Date.now()
          }
        }
      };

    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
        lastError: action.payload
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
        lastError: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
        loadingMessage: action.payload.message
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload
      };

    case 'TOGGLE_SECTION':
      return {
        ...state,
        expandedSections: state.expandedSections.includes(action.payload)
          ? state.expandedSections.filter(id => id !== action.payload)
          : [...state.expandedSections, action.payload]
      };

    case 'MARK_FIELD_DIRTY':
      return {
        ...state,
        dirtyFields: [...state.dirtyFields, action.payload]
      };

    case 'CLEAR_DIRTY_FIELDS':
      return {
        ...state,
        dirtyFields: []
      };

    case 'RESET_STATE':
      return {
        ...initialState,
        commonInputs: state.commonInputs // Preserve common inputs
      };

    default:
      return state;
  }
}

// Context
const CalculatorContext = createContext<{
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
} | null>(null);

// Provider Component
export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

// Hook for using the calculator context
export function useCalculatorContext() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculatorContext must be used within a CalculatorProvider');
  }
  return context;
}

// Action Creators
export function useCalculatorActions() {
  const { dispatch } = useCalculatorContext();

  const setActiveCalculator = useCallback((id: string) => {
    dispatch({ type: 'SET_ACTIVE_CALCULATOR', payload: id });
  }, [dispatch]);

  const updateCommonInput = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'UPDATE_COMMON_INPUT', payload: { field, value } });
  }, [dispatch]);

  const cacheCalculatorState = useCallback((
    id: string,
    values: Record<string, unknown>,
    results: Record<string, unknown>
  ) => {
    dispatch({
      type: 'CACHE_CALCULATOR_STATE',
      payload: { id, values, results }
    });
  }, [dispatch]);

  const addError = useCallback((error: CalculatorError) => {
    dispatch({ type: 'ADD_ERROR', payload: error });
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean, message?: string) => {
    dispatch({ type: 'SET_LOADING', payload: { loading, message } });
  }, [dispatch]);

  const setActiveTab = useCallback((tab: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, [dispatch]);

  const toggleSection = useCallback((sectionId: string) => {
    dispatch({ type: 'TOGGLE_SECTION', payload: sectionId });
  }, [dispatch]);

  const markFieldDirty = useCallback((field: string) => {
    dispatch({ type: 'MARK_FIELD_DIRTY', payload: field });
  }, [dispatch]);

  const clearDirtyFields = useCallback(() => {
    dispatch({ type: 'CLEAR_DIRTY_FIELDS' });
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  return {
    setActiveCalculator,
    updateCommonInput,
    cacheCalculatorState,
    addError,
    clearErrors,
    setLoading,
    setActiveTab,
    toggleSection,
    markFieldDirty,
    clearDirtyFields,
    resetState
  };
}

// Selector Hooks
export function useCalculatorState() {
  const { state } = useCalculatorContext();
  return state;
}

export function useActiveCalculator() {
  const { state } = useCalculatorContext();
  return state.activeCalculator;
}

export function useCommonInputs() {
  const { state } = useCalculatorContext();
  return state.commonInputs;
}

export function useCalculatorCache(calculatorId: string) {
  const { state } = useCalculatorContext();
  return state.calculatorCache[calculatorId];
}

export function useCalculatorErrors() {
  const { state } = useCalculatorContext();
  return {
    errors: state.errors,
    lastError: state.lastError
  };
}

export function useCalculatorLoading() {
  const { state } = useCalculatorContext();
  return {
    loading: state.loading,
    loadingMessage: state.loadingMessage
  };
}

export function useCalculatorUI() {
  const { state } = useCalculatorContext();
  return {
    activeTab: state.activeTab,
    expandedSections: state.expandedSections,
    dirtyFields: state.dirtyFields
  };
}


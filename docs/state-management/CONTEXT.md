# Calculator Context

## Context Structure

The calculator context provides the foundation for state management across the application.

### Context Definition

\`\`\`typescript
interface CalculatorContextValue {
state: CalculatorState;
dispatch: React.Dispatch<CalculatorAction>;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);
\`\`\`

### Provider Component

\`\`\`typescript
export function CalculatorProvider({ children }: { children: React.ReactNode }) {
const [state, dispatch] = useReducer(calculatorReducer, initialState);
const value = useMemo(() => ({ state, dispatch }), [state]);

return (
<CalculatorContext.Provider value={value}>
{children}
</CalculatorContext.Provider>
);
}
\`\`\`

### Context Hook

\`\`\`typescript
export function useCalculatorContext() {
const context = useContext(CalculatorContext);
if (!context) {
throw new Error('useCalculatorContext must be used within a CalculatorProvider');
}
return context;
}
\`\`\`

## Usage

### Basic Usage

\`\`\`tsx
function Calculator() {
const { state, dispatch } = useCalculatorContext();
// Component implementation
}
\`\`\`

### With Action Creators

\`\`\`tsx
function Calculator() {
const { setActiveCalculator, updateCommonInput } = useCalculatorActions();
// Component implementation
}
\`\`\`

### With Selectors

\`\`\`tsx
function Calculator() {
const commonInputs = useCommonInputs();
const cache = useCalculatorCache('calculator-id');
// Component implementation
}
\`\`\`

## Best Practices

1. **Provider Placement**

   - Place providers at the highest necessary level
   - Avoid nesting multiple calculator contexts
   - Consider code splitting boundaries

2. **Context Access**

   - Use hooks instead of direct context access
   - Handle missing context gracefully
   - Provide meaningful error messages

3. **Performance**

   - Memoize context value
   - Split context if different parts update at different frequencies
   - Use selectors to minimize rerenders

4. **Error Handling**
   - Wrap context usage in try-catch blocks
   - Provide fallback UI for context errors
   - Log context-related errors

## Examples

### Complete Setup

\`\`\`tsx
// App.tsx
export function App() {
return (
<CalculatorProvider>
<CalculatorPersistenceProvider>
<ErrorBoundary fallback={<ContextErrorFallback />}>
<CalculatorApp />
</ErrorBoundary>
</CalculatorPersistenceProvider>
</CalculatorProvider>
);
}

// CalculatorApp.tsx
function CalculatorApp() {
const { state } = useCalculatorContext();
const { setActiveCalculator } = useCalculatorActions();

return (
<div>
<CalculatorSelector
        activeCalculator={state.activeCalculator}
        onSelect={setActiveCalculator}
      />
<CalculatorWorkspace />
</div>
);
}
\`\`\`

### Error Handling

\`\`\`tsx
function ContextErrorFallback({ error }: { error: Error }) {
return (
<div role="alert">
<h2>Calculator Context Error</h2>
<p>{error.message}</p>
<button onClick={() => window.location.reload()}>
Reload Application
</button>
</div>
);
}
\`\`\`

### Performance Optimization

\`\`\`tsx
function OptimizedCalculator() {
// Use specific selectors instead of full state
const activeCalculator = useActiveCalculator();
const { loading } = useCalculatorLoading();
const { activeTab } = useCalculatorUI();

// Memoize expensive computations
const derivedValue = useMemo(() => {
// Complex computation
}, [activeCalculator]);

return (
<div>
{loading ? (
<LoadingSpinner />
) : (
<CalculatorContent
          calculatorId={activeCalculator}
          activeTab={activeTab}
          derivedValue={derivedValue}
        />
)}
</div>
);
}
\`\`\`


# State Management System Documentation

## Overview

The state management system provides a centralized way to manage calculator state using React Context and reducers. It includes shared state, actions, selectors, and persistence mechanisms to ensure consistent state management across calculator components.

## Table of Contents

1. [Architecture](./ARCHITECTURE.md)
2. [Calculator Context](./CONTEXT.md)
3. [State Types](./STATE_TYPES.md)
4. [Actions](./ACTIONS.md)
5. [Selectors](./SELECTORS.md)
6. [Persistence](./PERSISTENCE.md)
7. [Integration with Calculators](./INTEGRATION.md)
8. [Best Practices](./BEST_PRACTICES.md)
9. [Examples](./EXAMPLES.md)

## Quick Start

1. **Setup Providers**
   \`\`\`tsx
   function App() {
   return (
   <CalculatorProvider>
   <CalculatorPersistenceProvider>
   <YourApp />
   </CalculatorPersistenceProvider>
   </CalculatorProvider>
   );
   }
   \`\`\`

2. **Use State Management in Components**
   \`\`\`tsx
   function CalculatorComponent() {
   const { updateCommonInput } = useCalculatorActions();
   const commonInputs = useCommonInputs();
   const cache = useCalculatorCache('calculator-id');

// Component implementation
}
\`\`\`

3. **Handle State Updates**
   \`\`\`tsx
   function handleCalculate(values: CalculatorValues) {
   const results = calculateResults(values);
   cacheCalculatorState('calculator-id', values, results);
   }
   \`\`\`

See individual sections for detailed documentation and examples.


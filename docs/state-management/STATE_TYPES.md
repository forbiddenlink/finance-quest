# State Types

## Calculator State

The calculator state is structured to handle all aspects of calculator management, from metadata to UI state.

### Core State Interface

\`\`\`typescript
interface CalculatorState {
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
\`\`\`

## State Sections

### Calculator Metadata

- **activeCalculator**: Currently selected calculator
- **calculatorHistory**: History of used calculators
- **lastUsedCalculators**: Recently used calculators (limited to 5)

### Shared Values

Common inputs shared across calculators:

- **inflationRate**: Global inflation rate assumption
- **taxRate**: Default tax rate for calculations
- **riskTolerance**: User's risk tolerance level
- **investmentTimeframe**: Default investment period

### Calculator Cache

Cache structure for calculator state:

- **values**: Input values for the calculator
- **results**: Calculation results
- **timestamp**: Last update timestamp

### Error State

Error tracking:

- **errors**: Array of current errors
- **lastError**: Most recent error

### Loading State

Loading indicators:

- **loading**: Global loading state
- **loadingMessage**: Optional loading message

### UI State

UI-related state:

- **activeTab**: Current active tab
- **expandedSections**: Array of expanded section IDs
- **dirtyFields**: Array of modified field names

## Type Guards

### Calculator Cache Type Guard

\`\`\`typescript
function isCalculatorCache(cache: unknown): cache is CalculatorCache {
if (!cache || typeof cache !== 'object') return false;

return (
'values' in cache &&
'results' in cache &&
'timestamp' in cache &&
typeof cache.timestamp === 'number'
);
}
\`\`\`

### Common Inputs Type Guard

\`\`\`typescript
function isCommonInputs(inputs: unknown): inputs is CommonInputs {
if (!inputs || typeof inputs !== 'object') return false;

const validTypes = {
inflationRate: 'number',
taxRate: 'number',
riskTolerance: ['conservative', 'moderate', 'aggressive'],
investmentTimeframe: 'number'
};

return Object.entries(validTypes).every(([key, type]) => {
if (!(key in inputs)) return true; // Optional field
const value = inputs[key as keyof typeof inputs];

    if (Array.isArray(type)) {
      return type.includes(value as string);
    }
    return typeof value === type;

});
}
\`\`\`

## State Updates

### Immutable Updates

\`\`\`typescript
// Update common inputs
const newState = {
...state,
commonInputs: {
...state.commonInputs,
inflationRate: 2.5
}
};

// Update calculator cache
const newState = {
...state,
calculatorCache: {
...state.calculatorCache,
[calculatorId]: {
values,
results,
timestamp: Date.now()
}
}
};
\`\`\`

### State Validation

\`\`\`typescript
function validateState(state: unknown): state is CalculatorState {
if (!state || typeof state !== 'object') return false;

const requiredKeys = [
'activeCalculator',
'calculatorHistory',
'lastUsedCalculators',
'commonInputs',
'calculatorCache',
'errors',
'loading',
'activeTab',
'expandedSections',
'dirtyFields'
];

return requiredKeys.every(key => key in state);
}
\`\`\`

## Best Practices

1. **Type Safety**

   - Use TypeScript strict mode
   - Define explicit interfaces
   - Implement type guards
   - Validate state shape

2. **State Structure**

   - Keep state normalized
   - Avoid deep nesting
   - Use flat structures
   - Include timestamps

3. **State Updates**

   - Use immutable updates
   - Batch related changes
   - Validate new state
   - Handle edge cases

4. **Performance**
   - Minimize state size
   - Use appropriate types
   - Cache derived data
   - Clean up stale data

## Examples

### Complete State Example

\`\`\`typescript
const exampleState: CalculatorState = {
activeCalculator: 'investment',
calculatorHistory: ['mortgage', 'investment'],
lastUsedCalculators: ['investment', 'mortgage', 'retirement'],
commonInputs: {
inflationRate: 2.5,
taxRate: 25,
riskTolerance: 'moderate',
investmentTimeframe: 10
},
calculatorCache: {
investment: {
values: {
principal: 10000,
rate: 7,
years: 10
},
results: {
futureValue: 19671.51,
totalInterest: 9671.51
},
timestamp: Date.now()
}
},
errors: [],
lastError: null,
loading: false,
activeTab: 'inputs',
expandedSections: ['basic', 'advanced'],
dirtyFields: ['principal', 'rate']
};
\`\`\`

### State Initialization

\`\`\`typescript
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
\`\`\`


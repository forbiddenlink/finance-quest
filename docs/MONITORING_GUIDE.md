# Calculator Monitoring Guide

## Overview

This guide explains our real-time monitoring system for calculator performance and accessibility. The monitoring system helps ensure optimal user experience by tracking performance metrics and accessibility compliance in production.

## Table of Contents

- [Performance Monitoring](#performance-monitoring)
- [Accessibility Monitoring](#accessibility-monitoring)
- [Calculator-Specific Monitoring](#calculator-specific-monitoring)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Performance Monitoring

### Basic Usage

```typescript
import { useCalculatorPerformance } from "@/lib/monitoring/useCalculatorPerformance";

function MyCalculator() {
  const performance = useCalculatorPerformance({
    enableLogging: true,
    reportingEndpoint: "/api/metrics",
  });

  const handleCalculate = () => {
    performance.startCalculation();
    // Perform calculations
    performance.endCalculation();
  };

  return <div>...</div>;
}
```

### Metrics Tracked

- **Calculation Time**: Duration of complex calculations
- **Render Time**: Component render duration
- **Memory Usage**: JS heap size monitoring
- **FPS**: Frame rate monitoring
- **Interaction Delay**: User input responsiveness

### Performance Thresholds

```typescript
const thresholds = {
  maxCalculationTime: 100, // ms
  maxRenderTime: 16, // ms (60fps)
  maxMemoryUsage: 50, // MB
  minFps: 30, // frames per second
  maxInteractionDelay: 100, // ms
};
```

### Metric Reporting

```typescript
// Automatic reporting when thresholds exceeded
performance.reportMetrics();

// Get current metrics
const metrics = performance.getMetrics();
console.log("Current performance:", metrics);
```

## Accessibility Monitoring

### Basic Usage

```typescript
import { useAccessibilityMonitoring } from "@/lib/monitoring/useAccessibilityMonitoring";

function MyCalculator() {
  const accessibility = useAccessibilityMonitoring({
    enableLogging: true,
    reportingEndpoint: "/api/a11y",
  });

  return <div>...</div>;
}
```

### Features Monitored

1. **ARIA Attributes**

   ```typescript
   // Monitored automatically
   <button aria-label="Calculate" />  // Valid
   <button aria-invalid="wrong" />    // Violation reported
   ```

2. **Heading Hierarchy**

   ```typescript
   // Monitored automatically
   <h1>Main Title</h1>
   <h2>Subtitle</h2>     // Valid
   <h4>Sub-subtitle</h4> // Violation reported (skipped h3)
   ```

3. **Form Controls**

   ```typescript
   // Monitored automatically
   <label>
     Amount:
     <input type="number" />
   </label>  // Valid

   <input type="text" /> // Violation reported (no label)
   ```

4. **Keyboard Navigation**

   ```typescript
   // Monitored automatically
   <button onClick={handler}>Click</button>  // Valid
   <div onClick={handler}>Click</div>        // Violation reported
   ```

5. **Color Contrast**

   ```typescript
   // Monitored automatically
   <p style={{ color: '#000', background: '#fff' }}>
     High contrast
   </p>  // Valid

   <p style={{ color: '#777', background: '#666' }}>
     Low contrast
   </p>  // Violation reported
   ```

### Accessibility Thresholds

```typescript
const thresholds = {
  maxViolations: 0,
  maxMissingLabels: 0,
  maxKeyboardTraps: 0,
  maxContrastIssues: 0,
};
```

## Calculator-Specific Monitoring

### Budget Calculator

```typescript
import { useBudgetCalculatorAccessibilityMonitoring } from "@/lib/monitoring/useAccessibilityMonitoring";

function BudgetCalculator() {
  const monitoring = useBudgetCalculatorAccessibilityMonitoring();

  const handleCategoryUpdate = () => {
    monitoring.trackCategoryUpdate();
    // Update categories
  };

  return <div>...</div>;
}
```

### Investment Calculator

```typescript
import { useInvestmentCalculatorPerformance } from "@/lib/monitoring/useCalculatorPerformance";

function InvestmentCalculator() {
  const performance = useInvestmentCalculatorPerformance();

  const handleProjection = () => {
    const end = performance.trackProjectionCalculation();
    // Calculate projections
    end(); // Record calculation time
  };

  return <div>...</div>;
}
```

## Configuration

### Performance Configuration

```typescript
interface PerformanceConfig {
  enableLogging?: boolean;
  sampleRate?: number;
  reportingEndpoint?: string;
  thresholds?: {
    maxCalculationTime?: number;
    maxRenderTime?: number;
    maxMemoryUsage?: number;
    minFps?: number;
    maxInteractionDelay?: number;
  };
}
```

### Accessibility Configuration

```typescript
interface AccessibilityConfig {
  enableLogging?: boolean;
  reportingEndpoint?: string;
  thresholds?: {
    maxViolations?: number;
    maxMissingLabels?: number;
    maxKeyboardTraps?: number;
    maxContrastIssues?: number;
  };
}
```

## Best Practices

### 1. Performance Monitoring

```typescript
// DO: Track long calculations
performance.startCalculation();
const result = complexCalculation();
performance.endCalculation();

// DON'T: Track trivial operations
performance.startCalculation();
const sum = a + b; // Too simple
performance.endCalculation();
```

### 2. Memory Management

```typescript
// DO: Clean up resources
useEffect(() => {
  return () => {
    performance.clearMetrics();
  };
}, []);

// DON'T: Let metrics accumulate
// Missing cleanup
```

### 3. Accessibility Checks

```typescript
// DO: Monitor dynamic content
const addContent = () => {
  accessibility.trackDOMChanges(() => {
    // Add new content
  });
};

// DON'T: Ignore dynamic updates
const addContent = () => {
  // Unmonitored content changes
};
```

### 4. Error Handling

```typescript
// DO: Handle reporting failures gracefully
try {
  await performance.reportMetrics();
} catch (error) {
  console.error("Metric reporting failed:", error);
  // Fallback behavior
}

// DON'T: Ignore errors
performance.reportMetrics().catch(() => {});
```

## Troubleshooting

### Common Issues

1. **High Calculation Times**

   ```typescript
   // Problem
   performance.startCalculation();
   heavyCalculation(); // Takes > 100ms
   performance.endCalculation();

   // Solution
   performance.startCalculation();
   requestAnimationFrame(() => {
     heavyCalculation();
     performance.endCalculation();
   });
   ```

2. **Memory Leaks**

   ```typescript
   // Problem
   setInterval(() => {
     performance.trackMemory();
   }, 1000);

   // Solution
   useEffect(() => {
     const interval = setInterval(() => {
       performance.trackMemory();
     }, 1000);
     return () => clearInterval(interval);
   }, []);
   ```

3. **Accessibility Violations**

   ```typescript
   // Problem
   <div onClick={handler} role="button">Click me</div>

   // Solution
   <button onClick={handler}>Click me</button>
   ```

### Debugging

1. Enable detailed logging:

   ```typescript
   const performance = useCalculatorPerformance({
     enableLogging: true,
     sampleRate: 1, // Log everything
   });
   ```

2. Monitor specific metrics:

   ```typescript
   const metrics = performance.getMetrics();
   console.table({
     calculation: metrics.calculationTime,
     memory: metrics.memoryUsage,
     fps: metrics.fps,
   });
   ```

3. Track accessibility issues:
   ```typescript
   const accessibility = useAccessibilityMonitoring({
     enableLogging: true,
   });
   console.table(accessibility.getMetrics().violations);
   ```

For more examples and specific use cases, see the calculator implementations in the `components/calculators/` directory.


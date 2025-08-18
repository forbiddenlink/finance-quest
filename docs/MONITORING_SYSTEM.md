# Calculator Monitoring System

## Overview

Our comprehensive monitoring system provides real-time tracking of calculator performance, accessibility compliance, and system health. This guide explains how to use and extend the monitoring system.

## Table of Contents

- [Dashboard](#dashboard)
- [Performance Monitoring](#performance-monitoring)
- [Accessibility Monitoring](#accessibility-monitoring)
- [Alerts System](#alerts-system)
- [Metrics Export](#metrics-export)
- [Integration Points](#integration-points)
- [Best Practices](#best-practices)

## Dashboard

### Accessing the Dashboard

```typescript
import { MonitoringDashboard } from "@/components/monitoring/MonitoringDashboard";

function App() {
  return (
    <main>
      <MonitoringDashboard />
    </main>
  );
}
```

### Dashboard Features

1. **Real-time Metrics**

   - Performance metrics (calculation time, memory usage, FPS)
   - Accessibility compliance
   - Active alerts
   - System health

2. **Interactive Charts**

   - Trend visualization
   - Metric correlations
   - Historical data

3. **Alert Management**

   - Active alerts view
   - Alert acknowledgment
   - Alert history

4. **Export Capabilities**
   - Multiple formats (CSV, JSON, Excel)
   - Custom date ranges
   - Data aggregation

## Performance Monitoring

### Basic Usage

```typescript
import { useCalculatorPerformance } from "@/lib/monitoring/useCalculatorPerformance";

function Calculator() {
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

1. **Calculation Performance**

   ```typescript
   interface PerformanceMetrics {
     calculationTime: number; // ms
     renderTime: number; // ms
     memoryUsage: number; // MB
     fps: number; // frames/second
     interactionDelay: number; // ms
   }
   ```

2. **Thresholds**
   ```typescript
   const thresholds = {
     maxCalculationTime: 100, // ms
     maxRenderTime: 16, // ms (60fps)
     maxMemoryUsage: 50, // MB
     minFps: 30, // frames/second
     maxInteractionDelay: 100, // ms
   };
   ```

## Accessibility Monitoring

### Basic Usage

```typescript
import { useAccessibilityMonitoring } from "@/lib/monitoring/useAccessibilityMonitoring";

function Calculator() {
  const accessibility = useAccessibilityMonitoring({
    enableLogging: true,
    reportingEndpoint: "/api/a11y",
  });

  return <div>...</div>;
}
```

### Features Monitored

1. **ARIA Compliance**

   ```typescript
   // Automatic monitoring
   <button aria-label="Calculate" />  // Valid
   <button aria-invalid="wrong" />    // Violation reported
   ```

2. **Heading Structure**

   ```typescript
   // Automatic monitoring
   <h1>Main Title</h1>
   <h2>Subtitle</h2>     // Valid
   <h4>Sub-subtitle</h4> // Violation (skipped h3)
   ```

3. **Form Controls**

   ```typescript
   // Automatic monitoring
   <label>
     Amount: <input type="number" />
   </label>  // Valid

   <input type="text" /> // Violation (no label)
   ```

## Alerts System

### Configuration

```typescript
interface AlertConfig {
  severity: "critical" | "warning" | "info";
  threshold: number;
  message: string;
  category: string;
  cooldown?: number;
}

const config = {
  performance: {
    calculationTime: {
      severity: "critical",
      threshold: 100,
      message: "High calculation time",
      category: "performance",
      cooldown: 60000, // 1 minute
    },
  },
  accessibility: {
    violations: {
      severity: "critical",
      threshold: 0,
      message: "Accessibility violations detected",
      category: "accessibility",
    },
  },
};
```

### Notification Channels

1. **Desktop Notifications**

   ```typescript
   const alerts = useMonitoringAlerts({
     enableDesktopNotifications: true,
   });
   ```

2. **Server Notifications**

   ```typescript
   const alerts = useMonitoringAlerts({
     notificationEndpoint: "/api/alerts",
   });
   ```

3. **Email Alerts**
   ```typescript
   const alerts = useMonitoringAlerts({
     enableEmailAlerts: true,
     emailRecipients: ["team@example.com"],
   });
   ```

## Metrics Export

### Basic Export

```typescript
import { useMetricsExport } from "@/lib/monitoring/useMetricsExport";

function ExportButton() {
  const { exportMetrics } = useMetricsExport();

  const handleExport = async () => {
    await exportMetrics(metrics, alerts, violations, {
      format: "csv",
      timeRange: "day",
    });
  };

  return <button onClick={handleExport}>Export</button>;
}
```

### Export Options

1. **Formats**

   ```typescript
   type ExportFormat = "csv" | "json" | "excel";
   ```

2. **Time Ranges**

   ```typescript
   type TimeRange = "hour" | "day" | "week" | "month" | "custom";
   ```

3. **Aggregation**
   ```typescript
   type Aggregation = "none" | "minute" | "hour" | "day";
   ```

### Custom Exports

1. **Metric History**

   ```typescript
   const { exportMetricHistory } = useMetricsExport();
   await exportMetricHistory("calculationTime", metrics, {
     format: "csv",
     timeRange: "week",
   });
   ```

2. **Alert History**
   ```typescript
   const { exportAlertHistory } = useMetricsExport();
   await exportAlertHistory(alerts, {
     format: "json",
     timeRange: "month",
   });
   ```

## Integration Points

### External Services

1. **Monitoring Services**

   ```typescript
   // DataDog integration
   const monitoring = useCalculatorPerformance({
     reportingEndpoint: "https://api.datadog.com/v1/metrics",
     headers: {
       "DD-API-KEY": process.env.DATADOG_API_KEY,
     },
   });
   ```

2. **Error Tracking**
   ```typescript
   // Sentry integration
   const alerts = useMonitoringAlerts({
     onAlert: (alert) => {
       Sentry.captureMessage(alert.message, {
         level: alert.severity,
         tags: {
           category: alert.category,
           metric: alert.metric,
         },
       });
     },
   });
   ```

### Custom Metrics

```typescript
// Add custom metrics
const monitoring = useCalculatorPerformance({
  customMetrics: {
    userInteractions: {
      measure: () => getUserInteractionCount(),
      threshold: 100,
      category: "engagement",
    },
  },
});
```

## Best Practices

### 1. Performance Monitoring

```typescript
// DO: Track significant operations
performance.startCalculation();
const result = complexCalculation();
performance.endCalculation();

// DON'T: Track trivial operations
performance.startCalculation();
const sum = a + b;
performance.endCalculation();
```

### 2. Alert Configuration

```typescript
// DO: Configure meaningful thresholds
const config = {
  maxCalculationTime: 100, // Based on UX requirements
  maxMemoryUsage: 50, // Based on device capabilities
};

// DON'T: Use arbitrary values
const config = {
  maxCalculationTime: 1000, // Too high
  maxMemoryUsage: 500, // Unrealistic
};
```

### 3. Data Export

```typescript
// DO: Export relevant time ranges
await exportMetrics(metrics, [], [], {
  timeRange: "day",
  aggregation: "hour", // Meaningful intervals
});

// DON'T: Export raw data
await exportMetrics(metrics, [], [], {
  timeRange: "month",
  aggregation: "none", // Too granular
});
```

### 4. Resource Management

```typescript
// DO: Clean up resources
useEffect(() => {
  return () => {
    performance.clearMetrics();
    alerts.clearAlerts();
  };
}, []);

// DON'T: Leave resources hanging
// Missing cleanup
```

For more detailed examples and implementations, see:

- Calculator implementations in `components/calculators/`
- Test implementations in `__tests__/hooks/monitoring/`
- API implementations in `app/api/monitoring/`


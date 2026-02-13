export interface PerformanceMetrics {
  calculationTime: number;
  renderTime: number;
  memoryUsage: number;
  componentName: string;
  timestamp: number;
  [key: string]: number | string;
}

export interface AlertConfig {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  category: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  message: string;
  type: string;
  helpUrl?: string;
  element?: string;
  timestamp: number;
}

export interface TimeSeriesData {
  timestamp: number;
  value: number;
}

export interface PieData {
  name: string;
  value: number;
  color?: string;
}

export interface ViolationSummary {
  category: string;
  count: number;
  severity?: string;
}

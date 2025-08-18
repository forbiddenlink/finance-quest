import { PerformanceMetrics, AlertConfig, AccessibilityViolation } from '../types';

export interface MonitoringServiceConfig {
  endpoint: string;
  apiKey: string;
  projectId?: string;
  environment?: string;
  tags?: Record<string, string>;
}

export interface MetricPayload {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface AlertPayload {
  title: string;
  message: string;
  severity: string;
  timestamp: number;
  tags?: Record<string, string>;
}

// Base class for monitoring service integrations
export abstract class MonitoringServiceBase {
  protected config: MonitoringServiceConfig;

  constructor(config: MonitoringServiceConfig) {
    this.config = config;
  }

  abstract sendMetrics(metrics: PerformanceMetrics): Promise<void>;
  abstract sendAlert(alert: AlertConfig): Promise<void>;
  abstract sendAccessibilityViolation(violation: AccessibilityViolation): Promise<void>;
}

// DataDog integration
export class DataDogService extends MonitoringServiceBase {
  async sendMetrics(metrics: PerformanceMetrics): Promise<void> {
    const payload = this.formatMetricsPayload(metrics);
    await this.sendToDataDog('/v1/metrics', payload);
  }

  async sendAlert(alert: AlertConfig): Promise<void> {
    const payload = this.formatAlertPayload(alert);
    await this.sendToDataDog('/v1/events', payload);
  }

  async sendAccessibilityViolation(violation: AccessibilityViolation): Promise<void> {
    const payload = this.formatViolationPayload(violation);
    await this.sendToDataDog('/v1/events', payload);
  }

  private async sendToDataDog(path: string, data: unknown): Promise<void> {
    const response = await fetch(`https://api.datadoghq.com${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': this.config.apiKey,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`DataDog API error: ${response.statusText}`);
    }
  }

  private formatMetricsPayload(metrics: PerformanceMetrics): MetricPayload[] {
    return Object.entries(metrics).map(([key, value]) => ({
      name: `calculator.${key}`,
      value: value as number,
      timestamp: Date.now(),
      tags: {
        ...this.config.tags,
        env: this.config.environment || 'production',
      },
    }));
  }

  private formatAlertPayload(alert: AlertConfig): AlertPayload {
    return {
      title: `Calculator Alert: ${alert.category}`,
      message: alert.message,
      severity: alert.severity,
      timestamp: Date.now(),
      tags: {
        ...this.config.tags,
        category: alert.category,
        env: this.config.environment || 'production',
      },
    };
  }

  private formatViolationPayload(violation: AccessibilityViolation): AlertPayload {
    return {
      title: 'Accessibility Violation',
      message: violation.message,
      severity: 'warning',
      timestamp: Date.now(),
      tags: {
        ...this.config.tags,
        type: violation.type,
        env: this.config.environment || 'production',
      },
    };
  }
}

// Sentry integration
export class SentryService extends MonitoringServiceBase {
  async sendMetrics(metrics: PerformanceMetrics): Promise<void> {
    const payload = this.formatMetricsPayload(metrics);
    await this.sendToSentry('/api/metrics', payload);
  }

  async sendAlert(alert: AlertConfig): Promise<void> {
    const payload = this.formatAlertPayload(alert);
    await this.sendToSentry('/api/events', payload);
  }

  async sendAccessibilityViolation(violation: AccessibilityViolation): Promise<void> {
    const payload = this.formatViolationPayload(violation);
    await this.sendToSentry('/api/events', payload);
  }

  private async sendToSentry(path: string, data: unknown): Promise<void> {
    const response = await fetch(`https://sentry.io${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Sentry-Project': this.config.projectId || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.statusText}`);
    }
  }

  private formatMetricsPayload(metrics: PerformanceMetrics): MetricPayload[] {
    return Object.entries(metrics).map(([key, value]) => ({
      name: `calculator.${key}`,
      value: value as number,
      timestamp: Date.now(),
      tags: {
        ...this.config.tags,
        environment: this.config.environment || 'production',
      },
    }));
  }

  private formatAlertPayload(alert: AlertConfig): AlertPayload {
    return {
      title: `Calculator Alert: ${alert.category}`,
      message: alert.message,
      severity: alert.severity,
      timestamp: Date.now(),
      tags: {
        ...this.config.tags,
        category: alert.category,
        environment: this.config.environment || 'production',
      },
    };
  }

  private formatViolationPayload(violation: AccessibilityViolation): AlertPayload {
    return {
      title: 'Accessibility Violation',
      message: violation.message,
      severity: 'warning',
      timestamp: Date.now(),
      tags: {
        ...this.config.tags,
        type: violation.type,
        environment: this.config.environment || 'production',
      },
    };
  }
}

// Factory function to create monitoring service instances
export function createMonitoringService(
  type: 'datadog' | 'sentry',
  config: MonitoringServiceConfig
): MonitoringServiceBase {
  switch (type) {
    case 'datadog':
      return new DataDogService(config);
    case 'sentry':
      return new SentryService(config);
    default:
      throw new Error(`Unsupported monitoring service: ${type}`);
  }
}


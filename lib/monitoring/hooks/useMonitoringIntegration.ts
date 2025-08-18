import { useEffect, useCallback } from 'react';
import { createMonitoringService, MonitoringServiceConfig } from '../integrations';
import { PerformanceMetrics, AlertConfig, AccessibilityViolation } from '../types';

interface MonitoringIntegrationConfig {
  service: 'datadog' | 'sentry';
  config: MonitoringServiceConfig;
  batchSize?: number;
  batchInterval?: number;
}

export function useMonitoringIntegration(integrationConfig: MonitoringIntegrationConfig) {
  const { service, config, batchSize = 10, batchInterval = 5000 } = integrationConfig;
  
  // Create monitoring service instance
  const monitoringService = createMonitoringService(service, config);

  // Batch metrics for efficient sending
  const metricsBatch: PerformanceMetrics[] = [];
  
  // Send metrics in batches
  const flushMetrics = useCallback(async () => {
    if (metricsBatch.length === 0) return;

    // Aggregate metrics
    const aggregatedMetrics = metricsBatch.reduce((acc, metrics) => {
      Object.entries(metrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          acc[key] = (acc[key] || 0) + value;
        }
      });
      return acc;
    }, {} as Record<string, number>);

    // Calculate averages
    Object.keys(aggregatedMetrics).forEach(key => {
      aggregatedMetrics[key] /= metricsBatch.length;
    });

    try {
      await monitoringService.sendMetrics(aggregatedMetrics as PerformanceMetrics);
      metricsBatch.length = 0; // Clear batch after successful send
    } catch (error) {
      console.error('Failed to send metrics batch:', error);
      // Keep metrics in batch to retry on next flush
    }
  }, [monitoringService]);

  // Set up batch interval
  useEffect(() => {
    const intervalId = setInterval(flushMetrics, batchInterval);
    return () => {
      clearInterval(intervalId);
      flushMetrics(); // Flush any remaining metrics on cleanup
    };
  }, [flushMetrics, batchInterval]);

  // Add metrics to batch
  const sendMetrics = useCallback((metrics: PerformanceMetrics) => {
    metricsBatch.push(metrics);
    if (metricsBatch.length >= batchSize) {
      flushMetrics();
    }
  }, [batchSize, flushMetrics]);

  // Send alerts immediately
  const sendAlert = useCallback(async (alert: AlertConfig) => {
    try {
      await monitoringService.sendAlert(alert);
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }, [monitoringService]);

  // Send accessibility violations immediately
  const sendAccessibilityViolation = useCallback(async (violation: AccessibilityViolation) => {
    try {
      await monitoringService.sendAccessibilityViolation(violation);
    } catch (error) {
      console.error('Failed to send accessibility violation:', error);
    }
  }, [monitoringService]);

  return {
    sendMetrics,
    sendAlert,
    sendAccessibilityViolation,
    flushMetrics, // Exposed for manual flushing if needed
  };
}


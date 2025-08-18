import { useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

interface AlertConfig {
  severity: 'critical' | 'warning' | 'info';
  threshold: number;
  message: string;
  category: string;
  cooldown?: number; // Time in ms before same alert can trigger again
}

interface Alert {
  id: string;
  timestamp: number;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  category: string;
  metric: string;
  value: number;
  threshold: number;
  acknowledged: boolean;
}

interface AlertsConfig {
  performance?: {
    calculationTime?: AlertConfig;
    memoryUsage?: AlertConfig;
    fps?: AlertConfig;
    interactionDelay?: AlertConfig;
  };
  accessibility?: {
    violations?: AlertConfig;
    missingLabels?: AlertConfig;
    keyboardTraps?: AlertConfig;
    contrastIssues?: AlertConfig;
  };
  notificationEndpoint?: string;
  enableDesktopNotifications?: boolean;
  enableEmailAlerts?: boolean;
  emailRecipients?: string[];
}

const DEFAULT_ALERT_CONFIGS: Required<AlertsConfig> = {
  performance: {
    calculationTime: {
      severity: 'critical',
      threshold: 100,
      message: 'High calculation time detected',
      category: 'performance',
      cooldown: 60000
    },
    memoryUsage: {
      severity: 'warning',
      threshold: 50,
      message: 'High memory usage detected',
      category: 'performance',
      cooldown: 300000
    },
    fps: {
      severity: 'critical',
      threshold: 30,
      message: 'Low FPS detected',
      category: 'performance',
      cooldown: 60000
    },
    interactionDelay: {
      severity: 'warning',
      threshold: 100,
      message: 'High interaction delay detected',
      category: 'performance',
      cooldown: 60000
    }
  },
  accessibility: {
    violations: {
      severity: 'critical',
      threshold: 0,
      message: 'Accessibility violations detected',
      category: 'accessibility',
      cooldown: 300000
    },
    missingLabels: {
      severity: 'warning',
      threshold: 0,
      message: 'Form controls missing labels',
      category: 'accessibility',
      cooldown: 300000
    },
    keyboardTraps: {
      severity: 'critical',
      threshold: 0,
      message: 'Keyboard traps detected',
      category: 'accessibility',
      cooldown: 60000
    },
    contrastIssues: {
      severity: 'warning',
      threshold: 0,
      message: 'Color contrast issues detected',
      category: 'accessibility',
      cooldown: 300000
    }
  },
  notificationEndpoint: '/api/monitoring/alerts',
  enableDesktopNotifications: true,
  enableEmailAlerts: false,
  emailRecipients: []
};

export function useMonitoringAlerts(config: AlertsConfig = {}) {
  const alertsRef = useRef<Alert[]>([]);
  const lastAlertTimesRef = useRef<Record<string, number>>({});
  const notificationPermissionRef = useRef<NotificationPermission>('default');

  // Initialize desktop notifications
  useEffect(() => {
    if (config.enableDesktopNotifications && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        notificationPermissionRef.current = permission;
      });
    }
  }, [config.enableDesktopNotifications]);

  // Send notification
  const sendNotification = useCallback(async (alert: Alert) => {
    // Desktop notification
    if (
      config.enableDesktopNotifications &&
      notificationPermissionRef.current === 'granted'
    ) {
      new Notification(`${alert.severity.toUpperCase()}: ${alert.message}`, {
        body: `${alert.metric}: ${alert.value} (threshold: ${alert.threshold})`,
        icon: '/icons/alert.png',
        tag: `${alert.category}-${alert.metric}`
      });
    }

    // Server notification
    if (config.notificationEndpoint) {
      try {
        await fetch(config.notificationEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            alert,
            timestamp: Date.now(),
            url: window.location.href
          })
        });
      } catch (error) {
        console.error('Failed to send alert notification:', error);
      }
    }

    // Email notification
    if (config.enableEmailAlerts && config.emailRecipients?.length) {
      try {
        await fetch('/api/monitoring/email-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            alert,
            recipients: config.emailRecipients
          })
        });
      } catch (error) {
        console.error('Failed to send email alert:', error);
      }
    }
  }, [config]);

  // Check if alert should be triggered
  const shouldTriggerAlert = useCallback((
    metric: string,
    config: AlertConfig
  ): boolean => {
    const lastAlertTime = lastAlertTimesRef.current[metric] || 0;
    const timeSinceLastAlert = Date.now() - lastAlertTime;
    return timeSinceLastAlert > (config.cooldown || 0);
  }, []);

  // Create alert
  const createAlert = useCallback((
    metric: string,
    value: number,
    config: AlertConfig
  ): Alert => ({
    id: `${metric}-${Date.now()}`,
    timestamp: Date.now(),
    severity: config.severity,
    message: config.message,
    category: config.category,
    metric,
    value,
    threshold: config.threshold,
    acknowledged: false
  }), []);

  // Check performance metrics
  const checkPerformanceMetrics = useCallback(debounce((metrics: any) => {
    const configs = { ...DEFAULT_ALERT_CONFIGS.performance, ...config.performance };

    Object.entries(configs).forEach(([metric, alertConfig]) => {
      const value = metrics[metric];
      if (
        value !== undefined &&
        ((metric === 'fps' && value < alertConfig.threshold) ||
         (metric !== 'fps' && value > alertConfig.threshold)) &&
        shouldTriggerAlert(metric, alertConfig)
      ) {
        const alert = createAlert(metric, value, alertConfig);
        alertsRef.current.push(alert);
        lastAlertTimesRef.current[metric] = Date.now();
        sendNotification(alert);
      }
    });
  }, 1000), [config.performance, shouldTriggerAlert, createAlert, sendNotification]);

  // Check accessibility metrics
  const checkAccessibilityMetrics = useCallback(debounce((metrics: any) => {
    const configs = { ...DEFAULT_ALERT_CONFIGS.accessibility, ...config.accessibility };

    Object.entries(configs).forEach(([metric, alertConfig]) => {
      const value = metrics[metric];
      if (
        value !== undefined &&
        value > alertConfig.threshold &&
        shouldTriggerAlert(metric, alertConfig)
      ) {
        const alert = createAlert(metric, value, alertConfig);
        alertsRef.current.push(alert);
        lastAlertTimesRef.current[metric] = Date.now();
        sendNotification(alert);
      }
    });
  }, 1000), [config.accessibility, shouldTriggerAlert, createAlert, sendNotification]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback((alertId: string) => {
    const alert = alertsRef.current.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }, []);

  // Clear alerts
  const clearAlerts = useCallback((category?: string) => {
    if (category) {
      alertsRef.current = alertsRef.current.filter(a => a.category !== category);
    } else {
      alertsRef.current = [];
    }
  }, []);

  // Get active alerts
  const getActiveAlerts = useCallback(() => {
    return alertsRef.current.filter(alert => !alert.acknowledged);
  }, []);

  // Get alerts by category
  const getAlertsByCategory = useCallback((category: string) => {
    return alertsRef.current.filter(alert => alert.category === category);
  }, []);

  // Get alerts by severity
  const getAlertsBySeverity = useCallback((severity: 'critical' | 'warning' | 'info') => {
    return alertsRef.current.filter(alert => alert.severity === severity);
  }, []);

  return {
    checkPerformanceMetrics,
    checkAccessibilityMetrics,
    acknowledgeAlert,
    clearAlerts,
    getActiveAlerts,
    getAlertsByCategory,
    getAlertsBySeverity
  };
}


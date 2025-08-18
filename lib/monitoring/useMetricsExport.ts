import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

interface ExportConfig {
  format: 'csv' | 'json' | 'excel';
  timeRange: 'hour' | 'day' | 'week' | 'month' | 'custom';
  customStartDate?: Date;
  customEndDate?: Date;
  metrics?: string[];
  includeAlerts?: boolean;
  includeViolations?: boolean;
  aggregation?: 'none' | 'minute' | 'hour' | 'day';
}

interface MetricDataPoint {
  timestamp: number;
  metric: string;
  value: number;
  category: string;
  calculator?: string;
}

interface AlertDataPoint {
  timestamp: number;
  severity: string;
  message: string;
  category: string;
  metric: string;
  value: number;
  threshold: number;
}

interface ViolationDataPoint {
  timestamp: number;
  type: string;
  message: string;
  element: string;
  impact: string;
  wcag?: string;
}

export function useMetricsExport() {
  // Format timestamp
  const formatTimestamp = useCallback((timestamp: number, format: string = 'ISO') => {
    const date = new Date(timestamp);
    switch (format) {
      case 'ISO':
        return date.toISOString();
      case 'local':
        return date.toLocaleString();
      case 'date':
        return date.toLocaleDateString();
      case 'time':
        return date.toLocaleTimeString();
      default:
        return date.toISOString();
    }
  }, []);

  // Aggregate metrics
  const aggregateMetrics = useCallback((
    metrics: MetricDataPoint[],
    aggregation: 'none' | 'minute' | 'hour' | 'day'
  ) => {
    if (aggregation === 'none') return metrics;

    const aggregated: MetricDataPoint[] = [];
    const groups = new Map<string, MetricDataPoint[]>();

    metrics.forEach(metric => {
      const date = new Date(metric.timestamp);
      let key: string;

      switch (aggregation) {
        case 'minute':
          date.setSeconds(0, 0);
          key = date.toISOString();
          break;
        case 'hour':
          date.setMinutes(0, 0, 0);
          key = date.toISOString();
          break;
        case 'day':
          date.setHours(0, 0, 0, 0);
          key = date.toISOString();
          break;
        default:
          key = date.toISOString();
      }

      const group = groups.get(key) || [];
      group.push(metric);
      groups.set(key, group);
    });

    groups.forEach((group, key) => {
      const avgValue = group.reduce((sum, m) => sum + m.value, 0) / group.length;
      aggregated.push({
        timestamp: new Date(key).getTime(),
        metric: group[0].metric,
        value: avgValue,
        category: group[0].category,
        calculator: group[0].calculator
      });
    });

    return aggregated.sort((a, b) => a.timestamp - b.timestamp);
  }, []);

  // Export to CSV
  const exportToCsv = useCallback((
    data: any[],
    filename: string,
    headers?: string[]
  ) => {
    const csv = Papa.unparse({
      fields: headers,
      data: data
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  }, []);

  // Export to JSON
  const exportToJson = useCallback((data: any[], filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
  }, []);

  // Export to Excel
  const exportToExcel = useCallback(async (
    data: any[],
    filename: string,
    headers?: string[]
  ) => {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Metrics');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }, []);

  // Filter metrics by time range
  const filterByTimeRange = useCallback((
    data: any[],
    timeRange: ExportConfig['timeRange'],
    customStartDate?: Date,
    customEndDate?: Date
  ) => {
    const now = Date.now();
    let startTime: number;

    switch (timeRange) {
      case 'hour':
        startTime = now - 60 * 60 * 1000;
        break;
      case 'day':
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'custom':
        startTime = customStartDate?.getTime() || now;
        const endTime = customEndDate?.getTime() || now;
        return data.filter(d => 
          d.timestamp >= startTime && d.timestamp <= endTime
        );
      default:
        return data;
    }

    return data.filter(d => d.timestamp >= startTime);
  }, []);

  // Export metrics
  const exportMetrics = useCallback(async (
    metrics: MetricDataPoint[],
    alerts: AlertDataPoint[],
    violations: ViolationDataPoint[],
    config: ExportConfig
  ) => {
    const timestamp = formatTimestamp(Date.now(), 'ISO')
      .replace(/[:.]/g, '-')
      .slice(0, 19);

    // Filter by time range
    const filteredMetrics = filterByTimeRange(
      metrics,
      config.timeRange,
      config.customStartDate,
      config.customEndDate
    );

    // Aggregate if needed
    const aggregatedMetrics = aggregateMetrics(
      filteredMetrics,
      config.aggregation || 'none'
    );

    // Filter metrics if specific ones requested
    const selectedMetrics = config.metrics?.length
      ? aggregatedMetrics.filter(m => config.metrics?.includes(m.metric))
      : aggregatedMetrics;

    // Prepare data for export
    const exportData = [
      ...selectedMetrics.map(m => ({
        timestamp: formatTimestamp(m.timestamp),
        type: 'metric',
        ...m
      }))
    ];

    // Add alerts if requested
    if (config.includeAlerts) {
      const filteredAlerts = filterByTimeRange(
        alerts,
        config.timeRange,
        config.customStartDate,
        config.customEndDate
      );
      exportData.push(
        ...filteredAlerts.map(a => ({
          timestamp: formatTimestamp(a.timestamp),
          type: 'alert',
          ...a
        }))
      );
    }

    // Add violations if requested
    if (config.includeViolations) {
      const filteredViolations = filterByTimeRange(
        violations,
        config.timeRange,
        config.customStartDate,
        config.customEndDate
      );
      exportData.push(
        ...filteredViolations.map(v => ({
          timestamp: formatTimestamp(v.timestamp),
          type: 'violation',
          ...v
        }))
      );
    }

    // Sort by timestamp
    exportData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Export in requested format
    const filename = `metrics-export-${timestamp}`;
    switch (config.format) {
      case 'csv':
        exportToCsv(exportData, filename);
        break;
      case 'json':
        exportToJson(exportData, filename);
        break;
      case 'excel':
        await exportToExcel(exportData, filename);
        break;
    }

    return {
      success: true,
      filename,
      format: config.format,
      recordCount: exportData.length
    };
  }, [
    formatTimestamp,
    filterByTimeRange,
    aggregateMetrics,
    exportToCsv,
    exportToJson,
    exportToExcel
  ]);

  // Export specific metric history
  const exportMetricHistory = useCallback(async (
    metric: string,
    data: MetricDataPoint[],
    config: Omit<ExportConfig, 'metrics'>
  ) => {
    return exportMetrics(
      data.filter(d => d.metric === metric),
      [],
      [],
      { ...config, metrics: [metric] }
    );
  }, [exportMetrics]);

  // Export alerts history
  const exportAlertHistory = useCallback(async (
    alerts: AlertDataPoint[],
    config: Omit<ExportConfig, 'includeAlerts'>
  ) => {
    return exportMetrics(
      [],
      alerts,
      [],
      { ...config, includeAlerts: true }
    );
  }, [exportMetrics]);

  // Export violations history
  const exportViolationHistory = useCallback(async (
    violations: ViolationDataPoint[],
    config: Omit<ExportConfig, 'includeViolations'>
  ) => {
    return exportMetrics(
      [],
      [],
      violations,
      { ...config, includeViolations: true }
    );
  }, [exportMetrics]);

  return {
    exportMetrics,
    exportMetricHistory,
    exportAlertHistory,
    exportViolationHistory
  };
}


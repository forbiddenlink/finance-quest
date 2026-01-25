'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, BarChart, PieChart } from '@/components/shared/charts/ProfessionalCharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { useCalculatorPerformance } from '@/lib/monitoring/useCalculatorPerformance';
import { useAccessibilityMonitoring } from '@/lib/monitoring/useAccessibilityMonitoring';

interface MetricCard {
  title: string;
  value: number;
  threshold: number;
  unit: string;
  status: 'success' | 'warning' | 'error';
}

interface ViolationSummary {
  type: string;
  count: number;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

export function MonitoringDashboard() {
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [accessibilityHistory, setAccessibilityHistory] = useState<any[]>([]);
  const [activeCalculators, setActiveCalculators] = useState<string[]>([]);

  const performance = useCalculatorPerformance({
    enableLogging: true,
    sampleRate: 1
  });

  const accessibility = useAccessibilityMonitoring({
    enableLogging: true
  });

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const perfMetrics = performance.getMetrics();
      const a11yMetrics = accessibility.getMetrics();

      setPerformanceHistory(prev => [...prev.slice(-50), {
        timestamp: Date.now(),
        ...perfMetrics
      }]);

      setAccessibilityHistory(prev => [...prev.slice(-50), {
        timestamp: Date.now(),
        ...a11yMetrics
      }]);
    }, 1000);

    return () => clearInterval(interval);
  }, [performance, accessibility]);

  // Performance metric cards
  const performanceMetrics: MetricCard[] = [
    {
      title: 'Calculation Time',
      value: performance.getMetrics().calculationTime,
      threshold: 100,
      unit: 'ms',
      status: performance.getMetrics().calculationTime > 100 ? 'error' : 'success'
    },
    {
      title: 'Memory Usage',
      value: performance.getMetrics().memoryUsage,
      threshold: 50,
      unit: 'MB',
      status: performance.getMetrics().memoryUsage > 50 ? 'warning' : 'success'
    },
    {
      title: 'FPS',
      value: performance.getMetrics().fps,
      threshold: 30,
      unit: 'fps',
      status: performance.getMetrics().fps < 30 ? 'error' : 'success'
    },
    {
      title: 'Interaction Delay',
      value: performance.getMetrics().interactionDelay,
      threshold: 100,
      unit: 'ms',
      status: performance.getMetrics().interactionDelay > 100 ? 'warning' : 'success'
    }
  ];

  // Accessibility summary
  const accessibilitySummary = {
    totalViolations: accessibility.getMetrics().violations.length,
    missingLabels: accessibility.getMetrics().missingLabels,
    keyboardTraps: accessibility.getMetrics().keyboardTraps,
    contrastIssues: accessibility.getMetrics().colorContrastIssues
  };

  // Group violations by type and impact
  const violationsByType: ViolationSummary[] = accessibility.getMetrics().violations
    .reduce((acc, violation) => {
      const existing = acc.find(v => v.type === violation.type);
      if (existing) {
        existing.count++;
      } else {
        acc.push({
          type: violation.type,
          count: 1,
          impact: violation.impact
        });
      }
      return acc;
    }, [] as ViolationSummary[]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calculator Monitoring Dashboard</h1>
        <div className="flex gap-2">
          {activeCalculators.map(calc => (
            <Badge key={calc} variant="outline">{calc} Active</Badge>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <section aria-labelledby="performance-heading">
        <h2 id="performance-heading" className="text-xl font-semibold mb-4">
          Performance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map(metric => (
            <Card key={metric.title} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{metric.title}</h3>
                  <p className="text-2xl font-bold">
                    {metric.value.toFixed(1)} {metric.unit}
                  </p>
                </div>
                <Badge variant={metric.status}>
                  {metric.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Threshold: {metric.threshold} {metric.unit}
              </p>
            </Card>
          ))}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Calculation Time Trend</h3>
            <LineChart
              data={performanceHistory}
              xKey="timestamp"
              yKey="calculationTime"
              height={200}
              aria-label="Calculation time trend chart"
            />
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-4">Memory Usage Trend</h3>
            <LineChart
              data={performanceHistory}
              xKey="timestamp"
              yKey="memoryUsage"
              height={200}
              aria-label="Memory usage trend chart"
            />
          </Card>
        </div>
      </section>

      {/* Accessibility Metrics */}
      <section aria-labelledby="accessibility-heading">
        <h2 id="accessibility-heading" className="text-xl font-semibold mb-4">
          Accessibility Compliance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="font-medium">Total Violations</h3>
            <p className="text-2xl font-bold">{accessibilitySummary.totalViolations}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium">Missing Labels</h3>
            <p className="text-2xl font-bold">{accessibilitySummary.missingLabels}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium">Keyboard Traps</h3>
            <p className="text-2xl font-bold">{accessibilitySummary.keyboardTraps}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-medium">Contrast Issues</h3>
            <p className="text-2xl font-bold">{accessibilitySummary.contrastIssues}</p>
          </Card>
        </div>

        {/* Accessibility Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Violations by Type</h3>
            <PieChart
              data={violationsByType}
              nameKey="type"
              valueKey="count"
              height={200}
              aria-label="Violations by type chart"
            />
          </Card>
          <Card className="p-4">
            <h3 className="font-medium mb-4">Violations by Impact</h3>
            <BarChart
              data={violationsByType}
              xKey="type"
              yKey="count"
              categoryKey="impact"
              height={200}
              aria-label="Violations by impact chart"
            />
          </Card>
        </div>
      </section>

      {/* Active Alerts */}
      <section aria-labelledby="alerts-heading">
        <h2 id="alerts-heading" className="text-xl font-semibold mb-4">
          Active Alerts
        </h2>
        <div className="space-y-4">
          {performanceMetrics
            .filter(metric => metric.status === 'error')
            .map(metric => (
              <Alert key={metric.title} variant="destructive">
                <p>
                  {metric.title} exceeds threshold:
                  {' '}{metric.value.toFixed(1)} {metric.unit}
                  {' '}(threshold: {metric.threshold} {metric.unit})
                </p>
              </Alert>
            ))}
          {accessibilitySummary.totalViolations > 0 && (
            <Alert variant="warning">
              <p>
                {accessibilitySummary.totalViolations} accessibility violations detected.
                Please review and fix.
              </p>
            </Alert>
          )}
        </div>
      </section>

      {/* Real-time Log */}
      <section aria-labelledby="log-heading">
        <h2 id="log-heading" className="text-xl font-semibold mb-4">
          Real-time Log
        </h2>
        <Card className="p-4">
          <div className="h-40 overflow-y-auto space-y-2">
            {[...performanceHistory].reverse().map((entry, i) => (
              <div key={i} className="text-sm">
                <span className="text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                {' - '}
                <span>
                  Calc: {entry.calculationTime.toFixed(1)}ms,
                  Mem: {entry.memoryUsage.toFixed(1)}MB,
                  FPS: {entry.fps.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}


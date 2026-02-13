import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { useMetricsExport } from '@/lib/monitoring/useMetricsExport';

interface ExportMetricsButtonProps {
  metrics: any[];
  alerts: any[];
  violations: any[];
  className?: string;
}

export function ExportMetricsButton({
  metrics,
  alerts,
  violations,
  className
}: ExportMetricsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState<'csv' | 'json' | 'excel'>('csv');
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month' | 'custom'>('day');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeViolations, setIncludeViolations] = useState(true);
  const [aggregation, setAggregation] = useState<'none' | 'minute' | 'hour' | 'day'>('none');
  const [isExporting, setIsExporting] = useState(false);

  const { exportMetrics } = useMetricsExport();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportMetrics(metrics, alerts, violations, {
        format,
        timeRange,
        customStartDate: startDate || undefined,
        customEndDate: endDate || undefined,
        includeAlerts,
        includeViolations,
        aggregation
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={className}
        variant="outline"
      >
        Export Metrics
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Metrics</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Export Format
              </label>
              <Select
                value={format}
                onValueChange={(value: any) => setFormat(value)}
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="excel">Excel</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Time Range
              </label>
              <Select
                value={timeRange}
                onValueChange={(value: any) => setTimeRange(value)}
              >
                <option value="hour">Last Hour</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="custom">Custom Range</option>
              </Select>
            </div>

            {timeRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    date={startDate || undefined}
                    onDateChange={(date) => setStartDate(date || null)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <DatePicker
                    date={endDate || undefined}
                    onDateChange={(date) => setEndDate(date || null)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Aggregation
              </label>
              <Select
                value={aggregation}
                onValueChange={(value: any) => setAggregation(value)}
              >
                <option value="none">None</option>
                <option value="minute">By Minute</option>
                <option value="hour">By Hour</option>
                <option value="day">By Day</option>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="includeAlerts"
                  checked={includeAlerts}
                  onCheckedChange={(checked: boolean) => setIncludeAlerts(!!checked)}
                />
                <label htmlFor="includeAlerts" className="ml-2">
                  Include Alerts
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="includeViolations"
                  checked={includeViolations}
                  onCheckedChange={(checked: boolean) => setIncludeViolations(!!checked)}
                />
                <label htmlFor="includeViolations" className="ml-2">
                  Include Accessibility Violations
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


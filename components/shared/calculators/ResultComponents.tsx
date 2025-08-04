/**
 * Reusable result display components for calculators
 * Implements consistent formatting and visual presentation
 */

import React from 'react';
import { theme } from '@/lib/theme';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calculator, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ResultCardProps {
  label: string;
  value: number;
  format: 'currency' | 'percentage' | 'number' | 'months' | 'years';
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  icon?: React.ComponentType<{ className?: string }>;
  showTrend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
}

export function ResultCard({
  label,
  value,
  format,
  variant = 'primary',
  icon: Icon,
  showTrend,
  description,
  className = ''
}: ResultCardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val / 100);
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      case 'months':
        return val === 1 ? '1 month' : `${Math.round(val)} months`;
      case 'years':
        const years = Math.floor(val);
        const months = Math.round((val - years) * 12);
        if (years === 0) return months === 1 ? '1 month' : `${months} months`;
        if (months === 0) return years === 1 ? '1 year' : `${years} years`;
        return `${years}y ${months}m`;
      default:
        return val.toString();
    }
  };

  const variantStyles = {
    primary: `${theme.backgrounds.glass} border ${theme.borderColors.primary}`,
    success: `${theme.status.success.bg} border ${theme.status.success.border}`,
    warning: `${theme.status.warning.bg} border ${theme.status.warning.border}`,
    error: `${theme.status.error.bg} border ${theme.status.error.border}`,
    info: `${theme.status.info.bg} border ${theme.status.info.border}`
  };

  const textStyles = {
    primary: theme.textColors.primary,
    success: theme.status.success.text,
    warning: theme.status.warning.text,
    error: theme.status.error.text,
    info: theme.status.info.text
  };

  const TrendIcon = showTrend === 'up' ? TrendingUp : showTrend === 'down' ? TrendingDown : null;
  const DefaultIcon = format === 'currency' ? DollarSign : format === 'percentage' ? Percent : Calculator;

  return (
    <div className={`${variantStyles[variant]} rounded-xl p-6 text-center ${className}`}>
      <div className="flex items-center justify-center mb-3 gap-2">
        {Icon ? (
          <Icon className={`w-6 h-6 ${textStyles[variant]}`} />
        ) : (
          <DefaultIcon className={`w-6 h-6 ${textStyles[variant]}`} />
        )}
        {TrendIcon && (
          <TrendIcon className={`w-4 h-4 ${showTrend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
        )}
      </div>
      
      <h3 className={`text-sm font-medium ${theme.textColors.secondary} mb-2`}>
        {label}
      </h3>
      
      <p className={`text-2xl font-bold ${textStyles[variant]} mb-1`}>
        {formatValue(value, format)}
      </p>
      
      {description && (
        <p className={`text-xs ${theme.textColors.muted}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export interface ResultSummaryProps {
  title: string;
  primaryResult: {
    label: string;
    value: number;
    format: 'currency' | 'percentage' | 'number' | 'months' | 'years';
  };
  secondaryResults?: Array<{
    label: string;
    value: number;
    format: 'currency' | 'percentage' | 'number' | 'months' | 'years';
    variant?: 'success' | 'warning' | 'error' | 'info';
  }>;
  insights?: Array<{
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
  }>;
  className?: string;
}

export function ResultSummary({
  title,
  primaryResult,
  secondaryResults = [],
  insights = [],
  className = ''
}: ResultSummaryProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val / 100);
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      case 'months':
        return val === 1 ? '1 month' : `${Math.round(val)} months`;
      case 'years':
        const years = Math.floor(val);
        const months = Math.round((val - years) * 12);
        if (years === 0) return months === 1 ? '1 month' : `${months} months`;
        if (months === 0) return years === 1 ? '1 year' : `${years} years`;
        return `${years}y ${months}m`;
      default:
        return val.toString();
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Title */}
      <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>
        {title}
      </h3>

      {/* Primary Result */}
      <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-xl p-6`}>
        <div className={`text-sm font-medium ${theme.status.success.text} mb-2`}>
          {primaryResult.label}
        </div>
        <div className={`text-3xl font-bold ${theme.textColors.primary}`}>
          {formatValue(primaryResult.value, primaryResult.format)}
        </div>
      </div>

      {/* Secondary Results */}
      {secondaryResults.length > 0 && (
        <div className="space-y-3">
          {secondaryResults.map((result, index) => {
            const variantStyles = {
              success: `${theme.status.success.bg} border ${theme.status.success.border}`,
              warning: `${theme.status.warning.bg} border ${theme.status.warning.border}`,
              error: `${theme.status.error.bg} border ${theme.status.error.border}`,
              info: `${theme.backgrounds.cardHover} border ${theme.borderColors.primary}`
            };

            return (
              <div
                key={index}
                className={`${variantStyles[result.variant || 'info']} rounded-lg p-4`}
              >
                <div className="flex justify-between items-center">
                  <span className={`${theme.textColors.secondary} font-medium`}>
                    {result.label}
                  </span>
                  <span className={`${theme.textColors.primary} font-semibold`}>
                    {formatValue(result.value, result.format)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const InsightIcon = getInsightIcon(insight.type);
            const variantStyles = {
              success: `${theme.status.success.bg} border ${theme.status.success.border}`,
              warning: `${theme.status.warning.bg} border ${theme.status.warning.border}`,
              error: `${theme.status.error.bg} border ${theme.status.error.border}`,
              info: `${theme.status.info.bg} border ${theme.status.info.border}`
            };

            const iconStyles = {
              success: theme.status.success.text,
              warning: theme.status.warning.text,
              error: theme.status.error.text,
              info: theme.status.info.text
            };

            return (
              <div
                key={index}
                className={`${variantStyles[insight.type]} rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <InsightIcon className={`w-5 h-5 ${iconStyles[insight.type]} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-1`}>
                      {insight.title}
                    </h4>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export interface ComparisonTableProps {
  title: string;
  scenarios: Array<{
    name: string;
    results: Array<{
      label: string;
      value: number;
      format: 'currency' | 'percentage' | 'number' | 'months' | 'years';
    }>;
  }>;
  className?: string;
}

export function ComparisonTable({
  title,
  scenarios,
  className = ''
}: ComparisonTableProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val / 100);
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      case 'months':
        return val === 1 ? '1 month' : `${Math.round(val)} months`;
      case 'years':
        const years = Math.floor(val);
        const months = Math.round((val - years) * 12);
        if (years === 0) return months === 1 ? '1 month' : `${months} months`;
        if (months === 0) return years === 1 ? '1 year' : `${years} years`;
        return `${years}y ${months}m`;
      default:
        return val.toString();
    }
  };

  if (scenarios.length === 0) return null;

  const allLabels = [...new Set(scenarios.flatMap(s => s.results.map(r => r.label)))];

  return (
    <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6 ${className}`}>
      <h3 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
        {title}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${theme.borderColors.primary}`}>
              <th className={`text-left py-3 px-2 ${theme.textColors.secondary} font-medium`}>
                Metric
              </th>
              {scenarios.map((scenario, index) => (
                <th 
                  key={index}
                  className={`text-right py-3 px-2 ${theme.textColors.primary} font-medium`}
                >
                  {scenario.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allLabels.map((label, labelIndex) => (
              <tr key={labelIndex} className={`border-b ${theme.borderColors.muted} last:border-b-0`}>
                <td className={`py-3 px-2 ${theme.textColors.secondary} font-medium`}>
                  {label}
                </td>
                {scenarios.map((scenario, scenarioIndex) => {
                  const result = scenario.results.find(r => r.label === label);
                  return (
                    <td 
                      key={scenarioIndex}
                      className={`text-right py-3 px-2 ${theme.textColors.primary} font-semibold`}
                    >
                      {result ? formatValue(result.value, result.format) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  format?: 'currency' | 'percentage' | 'number';
  showValues?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

export function ProgressBar({
  label,
  current,
  target,
  format = 'currency',
  showValues = true,
  color = 'blue',
  className = ''
}: ProgressBarProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val / 100);
      case 'number':
        return new Intl.NumberFormat('en-US').format(val);
      default:
        return val.toString();
    }
  };

  const colorStyles = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600'
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className={`font-medium ${theme.textColors.primary}`}>
          {label}
        </h4>
        {showValues && (
          <span className={`text-sm ${theme.textColors.muted}`}>
            {formatValue(current)} / {formatValue(target)}
          </span>
        )}
      </div>
      
      <div className="relative">
        <div className={`w-full bg-slate-700 rounded-full h-4`}>
          <div
            className={`${colorStyles[color]} h-4 rounded-full transition-all duration-500 flex items-center justify-center`}
            style={{ width: `${percentage}%` }}
          >
            <span className={`text-xs font-semibold text-white ${percentage < 20 ? 'opacity-0' : ''}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        {percentage < 20 && (
          <div className="absolute right-2 top-0 text-xs font-semibold text-white bg-slate-800 px-2 py-1 rounded">
            {percentage.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

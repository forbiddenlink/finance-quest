'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { Calculator, AlertCircle, CheckCircle, AlertTriangle, XCircle, Info as InfoIcon, RotateCcw, Share2, Download, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export interface CalculatorMetadata {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'intermediate' | 'advanced';
  icon?: React.ComponentType<{ className?: string }>;
  tags?: string[];
  educationalNotes?: {
    title: string;
    content: string;
    tips?: string[];
  }[];
}

export interface CalculatorResult {
  label: string;
  value: string | number;
  format?: 'currency' | 'percentage' | 'number' | 'months' | 'years';
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  description?: string;
}

export interface CalculatorInsight {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export interface CalculatorValidation {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

interface CalculatorWrapperProps {
  metadata: CalculatorMetadata;
  children: ReactNode;
  results?: {
    primary: CalculatorResult;
    secondary?: CalculatorResult[];
  };
  insights?: CalculatorInsight[];
  validation?: CalculatorValidation;
  onReset?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function CalculatorWrapper({
  metadata,
  children,
  results,
  insights = [],
  validation,
  onReset,
  onShare,
  onExport,
  isLoading = false,
  className = ''
}: CalculatorWrapperProps) {
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    recordCalculatorUsage(metadata.id);
  }, [recordCalculatorUsage, metadata.id]);

  const formatValue = (value: string | number, format?: 'currency' | 'percentage' | 'number' | 'months' | 'years') => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return value;

    switch (format) {
      case 'currency':
        return formatCurrency(numValue);
      case 'percentage':
        return formatPercentage(numValue);
      case 'number':
        return new Intl.NumberFormat('en-US').format(numValue);
      case 'months':
        return numValue === 1 ? '1 month' : `${Math.round(numValue)} months`;
      case 'years':
        const years = Math.floor(numValue);
        const months = Math.round((numValue - years) * 12);
        if (years === 0) return months === 1 ? '1 month' : `${months} months`;
        if (months === 0) return years === 1 ? '1 year' : `${years} years`;
        return `${years}y ${months}m`;
      default:
        return value;
    }
  };

  // Utility functions for styling variants
  const getResultVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return {
          bg: theme.status.success.bg,
          border: theme.status.success.border,
          text: theme.status.success.text
        };
      case 'warning':
        return {
          bg: theme.status.warning.bg,
          border: theme.status.warning.border,
          text: theme.status.warning.text
        };
      case 'danger':
        return {
          bg: theme.status.error.bg,
          border: theme.status.error.border,
          text: theme.status.error.text
        };
      case 'info':
      default:
        return {
          bg: theme.backgrounds.cardHover,
          border: theme.borderColors.primary,
          text: theme.textColors.primary
        };
    }
  };

  const getInsightVariantStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: theme.status.success.bg,
          border: theme.status.success.border,
          text: theme.status.success.text
        };
      case 'warning':
        return {
          bg: theme.status.warning.bg,
          border: theme.status.warning.border,
          text: theme.status.warning.text
        };
      case 'danger':
        return {
          bg: theme.status.error.bg,
          border: theme.status.error.border,
          text: theme.status.error.text
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-950/20',
          border: 'border-blue-500/20',
          text: 'text-blue-400'
        };
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'danger':
        return XCircle;
      case 'info':
      default:
        return InfoIcon;
    }
  };

  const IconComponent = metadata.icon || Calculator;

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className={`${theme.backgrounds.cardHover} border-b ${theme.borderColors.primary} p-4 sm:p-6 rounded-t-lg`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${theme.status.info.bg} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.status.info.text}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} text-lg sm:text-xl md:text-2xl truncate`}>{metadata.title}</h2>
                <p className={`${theme.textColors.secondary} ${theme.typography.caption} text-xs sm:text-sm line-clamp-2`}>{metadata.description}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Badge */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                metadata.category === 'basic' ? theme.status.success.bg + ' ' + theme.status.success.text :
                metadata.category === 'intermediate' ? theme.status.warning.bg + ' ' + theme.status.warning.text :
                theme.status.error.bg + ' ' + theme.status.error.text
              }`}>
                {metadata.category.toUpperCase()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1.5 sm:gap-2">
                {onReset && (
                  <Button
                    onClick={onReset}
                    variant="outline"
                    size="sm"
                    className={`${theme.buttons.ghost} p-1.5 sm:p-2`}
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                )}
                {onShare && (
                  <Button
                    onClick={onShare}
                    variant="outline"
                    size="sm"
                    className={`${theme.buttons.ghost} p-1.5 sm:p-2`}
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                )}
                {onExport && (
                  <Button
                    onClick={onExport}
                    variant="outline"
                    size="sm"
                    className={`${theme.buttons.ghost} p-1.5 sm:p-2`}
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

        {/* Tags */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 ${theme.backgrounds.cardDisabled} ${theme.textColors.muted} text-xs rounded-full`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {/* Validation Errors */}
        {validation && !validation.isValid && (
          <div className={`mb-6 ${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className={`w-5 h-5 ${theme.status.error.text}`} />
              <h4 className={`font-semibold ${theme.status.error.text}`}>Please correct the following errors:</h4>
            </div>
            <ul className="space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className={`text-sm ${theme.status.error.text}`}>
                  • {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={`grid grid-cols-1 ${results ? 'lg:grid-cols-2' : ''} gap-6 lg:gap-8`}>
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-3`}>Calculator Inputs</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-4">
              <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-3`}>Results</h3>
              
              {/* Primary Result */}
              <div className={`${getResultVariantStyles(results.primary.variant || 'primary').bg} border ${getResultVariantStyles(results.primary.variant || 'primary').border} rounded-xl p-4 md:p-6`}>
                <div className={`text-xs md:text-sm font-medium ${getResultVariantStyles(results.primary.variant || 'primary').text} mb-1 md:mb-2`}>
                  {results.primary.label}
                </div>
                <div className={`text-2xl md:text-3xl font-bold ${theme.textColors.primary}`}>
                  {formatValue(results.primary.value, results.primary.format)}
                </div>
                {results.primary.description && (
                  <div className={`text-xs md:text-sm ${theme.textColors.muted} mt-1 md:mt-2`}>
                    {results.primary.description}
                  </div>
                )}
              </div>

              {/* Secondary Results */}
              {results.secondary && results.secondary.length > 0 && (
                <div className="space-y-2 md:space-y-3">
                  {results.secondary.map((result, index) => {
                    const variantStyles = getResultVariantStyles(result.variant || 'info');
                    return (
                      <div
                        key={index}
                        className={`${variantStyles.bg} border ${variantStyles.border} rounded-lg p-3 md:p-4`}
                      >
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-1 md:gap-2">
                          <span className={`${theme.textColors.secondary} text-xs md:text-sm font-medium`}>
                            {result.label}
                          </span>
                          <span className={`${theme.textColors.primary} text-sm md:text-base font-semibold`}>
                            {formatValue(result.value, result.format)}
                          </span>
                        </div>
                        {result.description && (
                          <div className={`text-xs ${theme.textColors.muted} mt-1 md:mt-2`}>
                            {result.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Insights Section */}
        {insights && insights.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>Insights & Recommendations</h3>
            {insights.map((insight, index) => {
              const InsightIcon = getInsightIcon(insight.type);
              const variantStyles = getInsightVariantStyles(insight.type);
              
              return (
                <div
                  key={index}
                  className={`${variantStyles.bg} border ${variantStyles.border} rounded-lg p-3 sm:p-4`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <InsightIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${variantStyles.text} mt-0.5 flex-shrink-0`} />
                    <div className="min-w-0">
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-1 text-sm sm:text-base line-clamp-1`}>
                        {insight.title}
                      </h4>
                      <p className={`text-xs sm:text-sm ${theme.textColors.secondary}`}>
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

      {/* Educational Notes Section */}
      {metadata.educationalNotes && metadata.educationalNotes.length > 0 && (
        <div className={`border-t ${theme.borderColors.primary} p-4 sm:p-6`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 ${theme.textColors.primary} hover:${theme.textColors.secondary} transition-colors w-full`}
          >
            <div className="flex items-center gap-2 flex-1">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className={`${theme.typography.heading4} text-base sm:text-lg`}>Learn More</span>
            </div>
            <span className={`text-xs sm:text-sm ${theme.textColors.muted}`}>
              {isExpanded ? '(Hide)' : '(Show insights)'}
            </span>
          </button>

          {isExpanded && (
            <div className="space-y-4 sm:space-y-6 mt-4">
              {metadata.educationalNotes.map((note, index) => (
                <div
                  key={index}
                  className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 sm:p-6`}
                >
                  <h4 className={`${theme.typography.heading5} ${theme.status.info.text} mb-2 text-base sm:text-lg`}>
                    {note.title}
                  </h4>
                  <p className={`${theme.textColors.secondary} mb-3 leading-relaxed text-sm`}>
                    {note.content}
                  </p>
                  
                  {note.tips && note.tips.length > 0 && (
                    <div>
                      <h5 className={`font-semibold ${theme.textColors.primary} mb-2 text-sm`}>Pro Tips:</h5>
                      <ul className="space-y-2">
                        {note.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className={`${theme.textColors.secondary} text-xs sm:text-sm flex items-start gap-2`}
                          >
                            <span className={`${theme.textColors.primary} font-bold flex-shrink-0`}>•</span>
                            <span className="flex-1">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

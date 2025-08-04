'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { Calculator, Lightbulb, Share2, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface CalculatorWrapperProps {
  metadata: CalculatorMetadata;
  children: ReactNode;
  results?: {
    primary: { label: string; value: string | number; format?: 'currency' | 'percentage' | 'number' };
    secondary?: Array<{ label: string; value: string | number; format?: 'currency' | 'percentage' | 'number' }>;
  };
  onReset?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  className?: string;
}

export default function CalculatorWrapper({
  metadata,
  children,
  results,
  onReset,
  onShare,
  onExport,
  className = ''
}: CalculatorWrapperProps) {
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    recordCalculatorUsage(metadata.id);
  }, [recordCalculatorUsage, metadata.id]);

  const formatValue = (value: string | number, format?: 'currency' | 'percentage' | 'number') => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return value;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numValue);
      case 'percentage':
        return `${(numValue * 100).toFixed(1)}%`;
      case 'number':
        return new Intl.NumberFormat('en-US').format(numValue);
      default:
        return value;
    }
  };

  const IconComponent = metadata.icon || Calculator;

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className={`${theme.backgrounds.cardHover} border-b ${theme.borderColors.primary} p-6 rounded-t-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${theme.status.info.bg} rounded-xl flex items-center justify-center shadow-lg`}>
              <IconComponent className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h2 className={`${theme.typography.heading2} ${theme.textColors.primary}`}>{metadata.title}</h2>
              <p className={`${theme.textColors.secondary} ${theme.typography.caption}`}>{metadata.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Category Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              metadata.category === 'basic' ? theme.status.success.bg + ' ' + theme.status.success.text :
              metadata.category === 'intermediate' ? theme.status.warning.bg + ' ' + theme.status.warning.text :
              theme.status.error.bg + ' ' + theme.status.error.text
            }`}>
              {metadata.category.toUpperCase()}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onReset && (
                <Button
                  onClick={onReset}
                  variant="outline"
                  size="sm"
                  className={`${theme.buttons.ghost}`}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
              {onShare && (
                <Button
                  onClick={onShare}
                  variant="outline"
                  size="sm"
                  className={`${theme.buttons.ghost}`}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              {onExport && (
                <Button
                  onClick={onExport}
                  variant="outline"
                  size="sm"
                  className={`${theme.buttons.ghost}`}
                >
                  <Download className="w-4 h-4" />
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
        <div className={`grid grid-cols-1 ${results ? 'lg:grid-cols-2' : ''} gap-8`}>
          {/* Input Section */}
          <div className="space-y-6">
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Calculator Inputs</h3>
            {children}
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Results</h3>
              
              {/* Primary Result */}
              <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-xl p-6`}>
                <div className={`text-sm font-medium ${theme.status.success.text} mb-2`}>
                  {results.primary.label}
                </div>
                <div className={`text-3xl font-bold ${theme.textColors.primary}`}>
                  {formatValue(results.primary.value, results.primary.format)}
                </div>
              </div>

              {/* Secondary Results */}
              {results.secondary && results.secondary.length > 0 && (
                <div className="space-y-3">
                  {results.secondary.map((result, index) => (
                    <div
                      key={index}
                      className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4`}
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
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Educational Notes Section */}
      {metadata.educationalNotes && metadata.educationalNotes.length > 0 && (
        <div className={`border-t ${theme.borderColors.primary} p-6`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 ${theme.textColors.primary} hover:${theme.textColors.secondary} transition-colors mb-4`}
          >
            <Lightbulb className="w-5 h-5" />
            <span className={`${theme.typography.heading4}`}>Learn More</span>
            <span className={`text-sm ${theme.textColors.muted}`}>
              {isExpanded ? '(Hide)' : '(Show educational insights)'}
            </span>
          </button>

          {isExpanded && (
            <div className="space-y-6">
              {metadata.educationalNotes.map((note, index) => (
                <div
                  key={index}
                  className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6`}
                >
                  <h4 className={`${theme.typography.heading5} ${theme.status.info.text} mb-3`}>
                    {note.title}
                  </h4>
                  <p className={`${theme.textColors.secondary} mb-4 leading-relaxed`}>
                    {note.content}
                  </p>
                  
                  {note.tips && note.tips.length > 0 && (
                    <div>
                      <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>Pro Tips:</h5>
                      <ul className="space-y-1">
                        {note.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className={`${theme.textColors.secondary} text-sm flex items-start gap-2`}
                          >
                            <span className={`${theme.textColors.primary} font-bold`}>•</span>
                            {tip}
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

/**
 * Reusable form input components for calculators
 * Implements DRY principles with consistent validation and theming
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { theme } from '@/lib/theme';
import { AlertCircle } from 'lucide-react';

export interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  min = 0,
  max,
  step = 100,
  helpText,
  error,
  required = false,
  disabled = false,
  className = ''
}: Omit<InputFieldProps, 'prefix'>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className={`${theme.textColors.primary} ${required ? 'required' : ''}`}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <div className="relative">
        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} pointer-events-none`}>
          $
        </span>
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-full pl-8 pr-4 py-3 
            border ${error ? 'border-red-500' : theme.borderColors.primary} 
            rounded-lg 
            focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            bg-slate-800/50
            ${theme.textColors.primary}
            transition-all duration-200
          `}
        />
      </div>
      {helpText && !error && (
        <p className={`text-xs ${theme.textColors.muted}`}>{helpText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

export function PercentageInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  min = 0,
  max = 100,
  step = 0.1,
  helpText,
  error,
  required = false,
  disabled = false,
  className = ''
}: Omit<InputFieldProps, 'suffix'>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className={`${theme.textColors.primary} ${required ? 'required' : ''}`}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            w-full pl-4 pr-8 py-3 
            border ${error ? 'border-red-500' : theme.borderColors.primary} 
            rounded-lg 
            focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            bg-slate-800/50
            ${theme.textColors.primary}
            transition-all duration-200
          `}
        />
        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} pointer-events-none`}>
          %
        </span>
      </div>
      {helpText && !error && (
        <p className={`text-xs ${theme.textColors.muted}`}>{helpText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  helpText,
  error,
  required = false,
  disabled = false,
  className = ''
}: InputFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className={`${theme.textColors.primary} ${required ? 'required' : ''}`}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`
          w-full px-4 py-3 
          border ${error ? 'border-red-500' : theme.borderColors.primary} 
          rounded-lg 
          focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          bg-slate-800/50
          ${theme.textColors.primary}
          transition-all duration-200
        `}
      />
      {helpText && !error && (
        <p className={`text-xs ${theme.textColors.muted}`}>{helpText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  helpText,
  error,
  required = false,
  disabled = false,
  className = ''
}: SelectFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className={`${theme.textColors.primary} ${required ? 'required' : ''}`}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 
          border ${error ? 'border-red-500' : theme.borderColors.primary} 
          rounded-lg 
          focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          bg-slate-800/50
          ${theme.textColors.primary}
          transition-all duration-200
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {helpText && !error && (
        <p className={`text-xs ${theme.textColors.muted}`}>{helpText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

export interface ToggleFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helpText?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleField({
  id,
  label,
  checked,
  onChange,
  helpText,
  disabled = false,
  className = ''
}: ToggleFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={`
            w-4 h-4 text-yellow-500 
            border ${theme.borderColors.primary} 
            rounded focus:ring-2 focus:ring-yellow-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        />
        <Label 
          htmlFor={id} 
          className={`${theme.textColors.primary} ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        >
          {label}
        </Label>
      </div>
      {helpText && (
        <p className={`text-xs ${theme.textColors.muted} ml-7`}>{helpText}</p>
      )}
    </div>
  );
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  helpText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  name,
  label,
  value,
  onChange,
  options,
  helpText,
  error,
  required = false,
  disabled = false,
  className = ''
}: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Label className={`${theme.textColors.primary} ${required ? 'required' : ''}`}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || option.disabled}
              className={`
                w-4 h-4 mt-1 text-yellow-500 
                border ${theme.borderColors.primary} 
                focus:ring-2 focus:ring-yellow-500
                ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            />
            <div className="flex-1">
              <Label 
                htmlFor={`${name}-${option.value}`}
                className={`${theme.textColors.primary} ${disabled || option.disabled ? 'opacity-50' : 'cursor-pointer'}`}
              >
                {option.label}
              </Label>
              {option.description && (
                <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {helpText && !error && (
        <p className={`text-xs ${theme.textColors.muted}`}>{helpText}</p>
      )}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Input group for organizing related fields
 */
export interface InputGroupProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function InputGroup({
  title,
  children,
  description,
  className = '',
  variant = 'default'
}: InputGroupProps) {
  const variantStyles = {
    default: `${theme.backgrounds.cardHover} border ${theme.borderColors.primary}`,
    success: `${theme.status.success.bg} border ${theme.status.success.border}`,
    warning: `${theme.status.warning.bg} border ${theme.status.warning.border}`,
    error: `${theme.status.error.bg} border ${theme.status.error.border}`,
    info: `${theme.status.info.bg} border ${theme.status.info.border}`
  };

  const titleStyles = {
    default: theme.textColors.primary,
    success: theme.status.success.text,
    warning: theme.status.warning.text,
    error: theme.status.error.text,
    info: theme.status.info.text
  };

  return (
    <div className={`${variantStyles[variant]} rounded-lg p-6 ${className}`}>
      <h3 className={`${theme.typography.heading5} ${titleStyles[variant]} mb-4`}>
        {title}
      </h3>
      {description && (
        <p className={`${theme.textColors.secondary} mb-6 text-sm`}>
          {description}
        </p>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

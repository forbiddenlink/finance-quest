'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BaseInputGroupProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
}

interface NumberInputGroupProps extends BaseInputGroupProps {
  type: 'number';
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

interface SelectInputGroupProps extends BaseInputGroupProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
}

type InputGroupProps = NumberInputGroupProps | SelectInputGroupProps;

export function InputGroup(props: InputGroupProps) {
  const { id, label, error, className = '' } = props;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {props.type === 'number' ? (
        <div className="relative">
          {props.prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {props.prefix}
            </div>
          )}
          <Input
            id={id}
            type="number"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            min={props.min}
            max={props.max}
            step={props.step}
            className={`${props.prefix ? 'pl-8' : ''} ${props.suffix ? 'pr-8' : ''}`}
            error={error}
          />
          {props.suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {props.suffix}
            </div>
          )}
        </div>
      ) : (
        <Select
          value={props.value}
          onValueChange={props.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
    </div>
  );
}


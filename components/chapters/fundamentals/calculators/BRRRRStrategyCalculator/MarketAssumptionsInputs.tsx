import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BRRRRValues } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface MarketAssumptionsInputsProps {
  values: BRRRRValues;
  onChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string | undefined;
}

export function MarketAssumptionsInputs({ values, onChange, getFieldError }: MarketAssumptionsInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Annual Appreciation */}
      <div className="space-y-2">
        <Label htmlFor="annualAppreciation">Annual Property Appreciation (%)</Label>
        <Input
          id="annualAppreciation"
          type="number"
          value={values.annualAppreciation}
          onChange={(e) => onChange('annualAppreciation', e.target.value)}
        />
        {getFieldError('annualAppreciation') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('annualAppreciation')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Annual Rent Increase */}
      <div className="space-y-2">
        <Label htmlFor="annualRentIncrease">Annual Rent Increase (%)</Label>
        <Input
          id="annualRentIncrease"
          type="number"
          value={values.annualRentIncrease}
          onChange={(e) => onChange('annualRentIncrease', e.target.value)}
        />
        {getFieldError('annualRentIncrease') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('annualRentIncrease')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Inflation Rate */}
      <div className="space-y-2">
        <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
        <Input
          id="inflationRate"
          type="number"
          value={values.inflationRate}
          onChange={(e) => onChange('inflationRate', e.target.value)}
        />
        {getFieldError('inflationRate') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('inflationRate')}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}


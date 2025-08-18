import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign } from 'lucide-react';
import { BRRRRValues } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface RefinancePhaseInputsProps {
  values: BRRRRValues;
  onChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string | undefined;
}

export function RefinancePhaseInputs({ values, onChange, getFieldError }: RefinancePhaseInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* After Repair Value */}
      <div className="space-y-2">
        <Label htmlFor="afterRepairValue">After Repair Value (ARV)</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="afterRepairValue"
            type="number"
            className="pl-8"
            value={values.afterRepairValue}
            onChange={(e) => onChange('afterRepairValue', e.target.value)}
          />
        </div>
        {getFieldError('afterRepairValue') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('afterRepairValue')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Refinance LTV */}
      <div className="space-y-2">
        <Label htmlFor="refinanceLTV">Refinance LTV (%)</Label>
        <Input
          id="refinanceLTV"
          type="number"
          value={values.refinanceLTV}
          onChange={(e) => onChange('refinanceLTV', e.target.value)}
        />
        {getFieldError('refinanceLTV') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('refinanceLTV')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Refinance Rate */}
      <div className="space-y-2">
        <Label htmlFor="refinanceRate">Refinance Rate (%)</Label>
        <Input
          id="refinanceRate"
          type="number"
          value={values.refinanceRate}
          onChange={(e) => onChange('refinanceRate', e.target.value)}
        />
        {getFieldError('refinanceRate') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('refinanceRate')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Refinance Term */}
      <div className="space-y-2">
        <Label htmlFor="refinanceTerm">Refinance Term (Years)</Label>
        <Input
          id="refinanceTerm"
          type="number"
          value={values.refinanceTerm}
          onChange={(e) => onChange('refinanceTerm', e.target.value)}
        />
        {getFieldError('refinanceTerm') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('refinanceTerm')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Refinance Costs */}
      <div className="space-y-2">
        <Label htmlFor="refinanceCosts">Refinance Costs</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="refinanceCosts"
            type="number"
            className="pl-8"
            value={values.refinanceCosts}
            onChange={(e) => onChange('refinanceCosts', e.target.value)}
          />
        </div>
        {getFieldError('refinanceCosts') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('refinanceCosts')}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}


import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign } from 'lucide-react';
import { BRRRRValues } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface RehabPhaseInputsProps {
  values: BRRRRValues;
  onChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string | undefined;
}

export function RehabPhaseInputs({ values, onChange, getFieldError }: RehabPhaseInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Rehab Costs */}
      <div className="space-y-2">
        <Label htmlFor="rehabCosts">Rehab Costs</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="rehabCosts"
            type="number"
            className="pl-8"
            value={values.rehabCosts}
            onChange={(e) => onChange('rehabCosts', e.target.value)}
          />
        </div>
        {getFieldError('rehabCosts') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('rehabCosts')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Rehab Timeframe */}
      <div className="space-y-2">
        <Label htmlFor="rehabTimeframe">Rehab Timeframe (Months)</Label>
        <Input
          id="rehabTimeframe"
          type="number"
          value={values.rehabTimeframe}
          onChange={(e) => onChange('rehabTimeframe', e.target.value)}
        />
        {getFieldError('rehabTimeframe') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('rehabTimeframe')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Contingency Percentage */}
      <div className="space-y-2">
        <Label htmlFor="contingencyPercentage">Contingency Percentage (%)</Label>
        <Input
          id="contingencyPercentage"
          type="number"
          value={values.contingencyPercentage}
          onChange={(e) => onChange('contingencyPercentage', e.target.value)}
        />
        {getFieldError('contingencyPercentage') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('contingencyPercentage')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Holding Costs */}
      <div className="space-y-4 col-span-2">
        <Label>Monthly Holding Costs</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="holdingCosts.insurance">Insurance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="holdingCosts.insurance"
                type="number"
                className="pl-8"
                value={values.holdingCosts.insurance}
                onChange={(e) => onChange('holdingCosts.insurance', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holdingCosts.taxes">Property Taxes</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="holdingCosts.taxes"
                type="number"
                className="pl-8"
                value={values.holdingCosts.taxes}
                onChange={(e) => onChange('holdingCosts.taxes', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holdingCosts.utilities">Utilities</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="holdingCosts.utilities"
                type="number"
                className="pl-8"
                value={values.holdingCosts.utilities}
                onChange={(e) => onChange('holdingCosts.utilities', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holdingCosts.loanPayments">Loan Payments</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="holdingCosts.loanPayments"
                type="number"
                className="pl-8"
                value={values.holdingCosts.loanPayments}
                onChange={(e) => onChange('holdingCosts.loanPayments', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign } from 'lucide-react';
import { BRRRRValues } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface BuyPhaseInputsProps {
  values: BRRRRValues;
  onChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string | undefined;
}

export function BuyPhaseInputs({ values, onChange, getFieldError }: BuyPhaseInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Purchase Price */}
      <div className="space-y-2">
        <Label htmlFor="purchasePrice">Purchase Price</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="purchasePrice"
            type="number"
            className="pl-8"
            value={values.purchasePrice}
            onChange={(e) => onChange('purchasePrice', e.target.value)}
          />
        </div>
        {getFieldError('purchasePrice') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('purchasePrice')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Down Payment */}
      <div className="space-y-2">
        <Label htmlFor="downPayment">Down Payment</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="downPayment"
            type="number"
            className="pl-8"
            value={values.downPayment}
            onChange={(e) => onChange('downPayment', e.target.value)}
          />
        </div>
        {getFieldError('downPayment') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('downPayment')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Closing Costs */}
      <div className="space-y-2">
        <Label htmlFor="closingCosts">Closing Costs</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="closingCosts"
            type="number"
            className="pl-8"
            value={values.closingCosts}
            onChange={(e) => onChange('closingCosts', e.target.value)}
          />
        </div>
        {getFieldError('closingCosts') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('closingCosts')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Initial Loan Rate */}
      <div className="space-y-2">
        <Label htmlFor="initialLoanRate">Initial Loan Rate (%)</Label>
        <Input
          id="initialLoanRate"
          type="number"
          value={values.initialLoanRate}
          onChange={(e) => onChange('initialLoanRate', e.target.value)}
        />
        {getFieldError('initialLoanRate') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('initialLoanRate')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Initial Loan Term */}
      <div className="space-y-2">
        <Label htmlFor="initialLoanTerm">Initial Loan Term (Years)</Label>
        <Input
          id="initialLoanTerm"
          type="number"
          value={values.initialLoanTerm}
          onChange={(e) => onChange('initialLoanTerm', e.target.value)}
        />
        {getFieldError('initialLoanTerm') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('initialLoanTerm')}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}


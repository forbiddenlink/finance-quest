import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign } from 'lucide-react';
import { BRRRRValues } from '@/lib/hooks/calculators/useBRRRRStrategy';

interface RentPhaseInputsProps {
  values: BRRRRValues;
  onChange: (field: string, value: string) => void;
  getFieldError: (field: string) => string | undefined;
}

export function RentPhaseInputs({ values, onChange, getFieldError }: RentPhaseInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Expected Rent */}
      <div className="space-y-2">
        <Label htmlFor="expectedRent">Expected Monthly Rent</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="expectedRent"
            type="number"
            className="pl-8"
            value={values.expectedRent}
            onChange={(e) => onChange('expectedRent', e.target.value)}
          />
        </div>
        {getFieldError('expectedRent') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('expectedRent')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Vacancy Rate */}
      <div className="space-y-2">
        <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
        <Input
          id="vacancyRate"
          type="number"
          value={values.vacancyRate}
          onChange={(e) => onChange('vacancyRate', e.target.value)}
        />
        {getFieldError('vacancyRate') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('vacancyRate')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Property Management Fee */}
      <div className="space-y-2">
        <Label htmlFor="propertyManagementFee">Property Management Fee (%)</Label>
        <Input
          id="propertyManagementFee"
          type="number"
          value={values.propertyManagementFee}
          onChange={(e) => onChange('propertyManagementFee', e.target.value)}
        />
        {getFieldError('propertyManagementFee') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('propertyManagementFee')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Maintenance Percentage */}
      <div className="space-y-2">
        <Label htmlFor="maintenancePercentage">Maintenance (% of Rent)</Label>
        <Input
          id="maintenancePercentage"
          type="number"
          value={values.maintenancePercentage}
          onChange={(e) => onChange('maintenancePercentage', e.target.value)}
        />
        {getFieldError('maintenancePercentage') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('maintenancePercentage')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Annual Expenses */}
      <div className="space-y-4 col-span-2">
        <Label>Annual Expenses</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualExpenses.insurance">Insurance</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="annualExpenses.insurance"
                type="number"
                className="pl-8"
                value={values.annualExpenses.insurance}
                onChange={(e) => onChange('annualExpenses.insurance', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualExpenses.taxes">Property Taxes</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="annualExpenses.taxes"
                type="number"
                className="pl-8"
                value={values.annualExpenses.taxes}
                onChange={(e) => onChange('annualExpenses.taxes', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualExpenses.utilities">Utilities</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="annualExpenses.utilities"
                type="number"
                className="pl-8"
                value={values.annualExpenses.utilities}
                onChange={(e) => onChange('annualExpenses.utilities', e.target.value)}
              />
            </div>
          </div>

          {values.annualExpenses.hoa !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="annualExpenses.hoa">HOA Fees</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="annualExpenses.hoa"
                  type="number"
                  className="pl-8"
                  value={values.annualExpenses.hoa}
                  onChange={(e) => onChange('annualExpenses.hoa', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


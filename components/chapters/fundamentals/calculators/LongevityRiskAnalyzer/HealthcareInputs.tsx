import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LongevityRiskValues } from '@/lib/hooks/calculators/useLongevityRisk';

interface HealthcareInputsProps {
  values: LongevityRiskValues;
  onChange: (field: string, value: boolean) => void;
  getFieldError: (field: string) => string | undefined;
}

export function HealthcareInputs({ values, onChange, getFieldError }: HealthcareInputsProps) {
  return (
    <div className="space-y-6">
      {/* Chronic Conditions */}
      <div className="space-y-2">
        <Label htmlFor="chronicConditions">Chronic Health Conditions</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="chronicConditions"
            checked={values.chronicConditions}
            onCheckedChange={(checked) => onChange('chronicConditions', checked)}
          />
          <Label htmlFor="chronicConditions">
            {values.chronicConditions ? 'Yes' : 'No'}
          </Label>
        </div>
      </div>

      {/* Family Health History */}
      <div className="space-y-4">
        <Label>Family Health History</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="familyHealthHistory.heartDisease">Heart Disease</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="familyHealthHistory.heartDisease"
                checked={values.familyHealthHistory.heartDisease}
                onCheckedChange={(checked) => onChange('familyHealthHistory.heartDisease', checked)}
              />
              <Label htmlFor="familyHealthHistory.heartDisease">
                {values.familyHealthHistory.heartDisease ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyHealthHistory.cancer">Cancer</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="familyHealthHistory.cancer"
                checked={values.familyHealthHistory.cancer}
                onCheckedChange={(checked) => onChange('familyHealthHistory.cancer', checked)}
              />
              <Label htmlFor="familyHealthHistory.cancer">
                {values.familyHealthHistory.cancer ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyHealthHistory.diabetes">Diabetes</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="familyHealthHistory.diabetes"
                checked={values.familyHealthHistory.diabetes}
                onCheckedChange={(checked) => onChange('familyHealthHistory.diabetes', checked)}
              />
              <Label htmlFor="familyHealthHistory.diabetes">
                {values.familyHealthHistory.diabetes ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyHealthHistory.alzheimers">Alzheimer's</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="familyHealthHistory.alzheimers"
                checked={values.familyHealthHistory.alzheimers}
                onCheckedChange={(checked) => onChange('familyHealthHistory.alzheimers', checked)}
              />
              <Label htmlFor="familyHealthHistory.alzheimers">
                {values.familyHealthHistory.alzheimers ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Coverage */}
      <div className="space-y-4">
        <Label>Insurance Coverage</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="longTermCareInsurance">Long-Term Care Insurance</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="longTermCareInsurance"
                checked={values.longTermCareInsurance}
                onCheckedChange={(checked) => onChange('longTermCareInsurance', checked)}
              />
              <Label htmlFor="longTermCareInsurance">
                {values.longTermCareInsurance ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicareSupplement">Medicare Supplement</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="medicareSupplement"
                checked={values.medicareSupplement}
                onCheckedChange={(checked) => onChange('medicareSupplement', checked)}
              />
              <Label htmlFor="medicareSupplement">
                {values.medicareSupplement ? 'Yes' : 'No'}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';
import { LongevityRiskValues } from '@/lib/hooks/calculators/useLongevityRisk';

interface FinancialInfoInputsProps {
  values: LongevityRiskValues;
  onChange: (field: string, value: string | number) => void;
  getFieldError: (field: string) => string | undefined;
}

export function FinancialInfoInputs({ values, onChange, getFieldError }: FinancialInfoInputsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Savings */}
      <div className="space-y-2">
        <Label htmlFor="currentSavings">Current Savings</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="currentSavings"
            type="number"
            className="pl-8"
            value={values.currentSavings}
            onChange={(e) => onChange('currentSavings', e.target.value)}
          />
        </div>
        {getFieldError('currentSavings') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('currentSavings')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Monthly Income */}
      <div className="space-y-2">
        <Label htmlFor="monthlyIncome">Monthly Income</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="monthlyIncome"
            type="number"
            className="pl-8"
            value={values.monthlyIncome}
            onChange={(e) => onChange('monthlyIncome', e.target.value)}
          />
        </div>
        {getFieldError('monthlyIncome') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('monthlyIncome')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Monthly Expenses */}
      <div className="space-y-2">
        <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="monthlyExpenses"
            type="number"
            className="pl-8"
            value={values.monthlyExpenses}
            onChange={(e) => onChange('monthlyExpenses', e.target.value)}
          />
        </div>
        {getFieldError('monthlyExpenses') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('monthlyExpenses')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Retirement Age */}
      <div className="space-y-2">
        <Label htmlFor="retirementAge">Planned Retirement Age</Label>
        <Input
          id="retirementAge"
          type="number"
          value={values.retirementAge}
          onChange={(e) => onChange('retirementAge', e.target.value)}
        />
        {getFieldError('retirementAge') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('retirementAge')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Social Security Benefit */}
      <div className="space-y-2">
        <Label htmlFor="socialSecurityBenefit">Monthly Social Security Benefit</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="socialSecurityBenefit"
            type="number"
            className="pl-8"
            value={values.socialSecurityBenefit}
            onChange={(e) => onChange('socialSecurityBenefit', e.target.value)}
          />
        </div>
        {getFieldError('socialSecurityBenefit') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('socialSecurityBenefit')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Pension Income */}
      <div className="space-y-2">
        <Label htmlFor="pensionIncome">Monthly Pension Income (Optional)</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="pensionIncome"
            type="number"
            className="pl-8"
            value={values.pensionIncome ?? ''}
            onChange={(e) => onChange('pensionIncome', e.target.value)}
          />
        </div>
        {getFieldError('pensionIncome') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('pensionIncome')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Other Income */}
      <div className="space-y-2">
        <Label htmlFor="otherIncome">Other Monthly Income (Optional)</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="otherIncome"
            type="number"
            className="pl-8"
            value={values.otherIncome ?? ''}
            onChange={(e) => onChange('otherIncome', e.target.value)}
          />
        </div>
        {getFieldError('otherIncome') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('otherIncome')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Inflation Assumption */}
      <div className="space-y-2">
        <Label htmlFor="inflationAssumption">Inflation Rate (%)</Label>
        <Input
          id="inflationAssumption"
          type="number"
          value={values.inflationAssumption}
          onChange={(e) => onChange('inflationAssumption', e.target.value)}
        />
        {getFieldError('inflationAssumption') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('inflationAssumption')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Investment Return */}
      <div className="space-y-2">
        <Label htmlFor="investmentReturn">Expected Investment Return (%)</Label>
        <Input
          id="investmentReturn"
          type="number"
          value={values.investmentReturn}
          onChange={(e) => onChange('investmentReturn', e.target.value)}
        />
        {getFieldError('investmentReturn') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('investmentReturn')}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Risk Tolerance */}
      <div className="space-y-2">
        <Label htmlFor="riskTolerance">Risk Tolerance</Label>
        <Select
          value={values.riskTolerance}
          onValueChange={(value) => onChange('riskTolerance', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select risk tolerance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conservative">Conservative</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="aggressive">Aggressive</SelectItem>
          </SelectContent>
        </Select>
        {getFieldError('riskTolerance') && (
          <Alert variant="destructive">
            <AlertDescription>{getFieldError('riskTolerance')}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}


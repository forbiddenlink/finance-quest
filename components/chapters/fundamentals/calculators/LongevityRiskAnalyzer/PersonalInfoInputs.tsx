import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { LongevityRiskValues } from '@/lib/hooks/calculators/useLongevityRisk';

interface PersonalInfoInputsProps {
  values: LongevityRiskValues;
  onChange: (field: string, value: string | number | boolean) => void;
  getFieldError: (field: string) => string | undefined;
}

export function PersonalInfoInputs({ values, onChange, getFieldError }: PersonalInfoInputsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="currentAge">Current Age</Label>
          <Input
            id="currentAge"
            type="number"
            value={values.currentAge}
            onChange={(e) => onChange('currentAge', e.target.value)}
          />
          {getFieldError('currentAge') && (
            <Alert variant="destructive">
              <AlertDescription>{getFieldError('currentAge')}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={values.gender}
            onValueChange={(value) => onChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          {getFieldError('gender') && (
            <Alert variant="destructive">
              <AlertDescription>{getFieldError('gender')}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="healthStatus">Health Status</Label>
          <Select
            value={values.healthStatus}
            onValueChange={(value) => onChange('healthStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select health status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {getFieldError('healthStatus') && (
            <Alert variant="destructive">
              <AlertDescription>{getFieldError('healthStatus')}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Family Longevity */}
      <div className="space-y-4">
        <Label>Family Longevity</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="familyLongevity.parents">Average Parents Age</Label>
            <Input
              id="familyLongevity.parents"
              type="number"
              value={values.familyLongevity.parents}
              onChange={(e) => onChange('familyLongevity.parents', e.target.value)}
            />
            {getFieldError('familyLongevity.parents') && (
              <Alert variant="destructive">
                <AlertDescription>{getFieldError('familyLongevity.parents')}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyLongevity.grandparents">Average Grandparents Age</Label>
            <Input
              id="familyLongevity.grandparents"
              type="number"
              value={values.familyLongevity.grandparents}
              onChange={(e) => onChange('familyLongevity.grandparents', e.target.value)}
            />
            {getFieldError('familyLongevity.grandparents') && (
              <Alert variant="destructive">
                <AlertDescription>{getFieldError('familyLongevity.grandparents')}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Lifestyle Factors */}
      <div className="space-y-4">
        <Label>Lifestyle Factors</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lifestyle.smoking">Smoking</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="lifestyle.smoking"
                checked={values.lifestyle.smoking}
                onCheckedChange={(checked) => onChange('lifestyle.smoking', checked)}
              />
              <Label htmlFor="lifestyle.smoking">{values.lifestyle.smoking ? 'Yes' : 'No'}</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifestyle.exercise">Exercise Level</Label>
            <Select
              value={values.lifestyle.exercise}
              onValueChange={(value) => onChange('lifestyle.exercise', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exercise level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('lifestyle.exercise') && (
              <Alert variant="destructive">
                <AlertDescription>{getFieldError('lifestyle.exercise')}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifestyle.diet">Diet Quality</Label>
            <Select
              value={values.lifestyle.diet}
              onValueChange={(value) => onChange('lifestyle.diet', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diet quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('lifestyle.diet') && (
              <Alert variant="destructive">
                <AlertDescription>{getFieldError('lifestyle.diet')}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lifestyle.stress">Stress Level</Label>
            <Select
              value={values.lifestyle.stress}
              onValueChange={(value) => onChange('lifestyle.stress', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stress level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('lifestyle.stress') && (
              <Alert variant="destructive">
                <AlertDescription>{getFieldError('lifestyle.stress')}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


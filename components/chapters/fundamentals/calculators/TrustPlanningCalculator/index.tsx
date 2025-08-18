'use client';

import React from 'react';
import { useTrustPlanningCalculator } from './useTrustPlanningCalculator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TrustAsset, TrustBeneficiary } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MinusCircle, Calculator, Shield } from 'lucide-react';

const TRUST_TYPES = [
  { value: 'revocable', label: 'Revocable Living Trust' },
  { value: 'irrevocable', label: 'Irrevocable Trust' },
  { value: 'charitable', label: 'Charitable Trust' },
  { value: 'special_needs', label: 'Special Needs Trust' },
  { value: 'life_insurance', label: 'Life Insurance Trust' },
  { value: 'generation_skipping', label: 'Generation-Skipping Trust' }
];

const ASSET_TYPES = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'investment', label: 'Investments' },
  { value: 'business', label: 'Business Interests' },
  { value: 'life_insurance', label: 'Life Insurance' },
  { value: 'personal', label: 'Personal Property' },
  { value: 'other', label: 'Other' }
];

const BENEFICIARY_TYPES = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'charity', label: 'Charity' },
  { value: 'other', label: 'Other' }
];

const US_STATES = [
  { value: 'WA', label: 'Washington' },
  { value: 'OR', label: 'Oregon' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'IL', label: 'Illinois' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'NY', label: 'New York' },
  // Add more states as needed
];

const DISTRIBUTION_STRATEGIES = [
  { value: 'immediate', label: 'Immediate Distribution' },
  { value: 'staged', label: 'Staged Distribution' },
  { value: 'discretionary', label: 'Discretionary Distribution' }
];

export default function TrustPlanningCalculator() {
  const {
    inputs,
    results,
    errors,
    isCalculating,
    summaryStats,
    addAsset,
    updateAsset,
    removeAsset,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
    updateTrustType,
    updateGrantorInfo,
    updateTrustDuration,
    updateDistributionStrategy,
    updateRetainControl,
    updateCharitableIntent,
    calculate,
    reset
  } = useTrustPlanningCalculator();

  const handleAddAsset = () => {
    addAsset({
      type: 'other',
      description: '',
      value: 0
    });
  };

  const handleAddBeneficiary = () => {
    addBeneficiary({
      type: 'other',
      name: '',
      distributionPercentage: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Trust Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trust Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Select Trust Type</Label>
            <Select
              value={inputs.trustType}
              onValueChange={updateTrustType}
            >
              {TRUST_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Trust Duration (Years)</Label>
            <Input
              type="number"
              value={inputs.trustDuration}
              onChange={(e) => updateTrustDuration(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
        </div>
      </Card>

      {/* Grantor Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Grantor Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              value={inputs.grantor.age}
              onChange={(e) => updateGrantorInfo('age', parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>
          <div>
            <Label>State</Label>
            <Select
              value={inputs.grantor.state}
              onValueChange={(value) => updateGrantorInfo('state', value)}
            >
              <option value="">Select State</option>
              {US_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Marital Status</Label>
            <Select
              value={inputs.grantor.maritalStatus}
              onValueChange={(value) => updateGrantorInfo('maritalStatus', value)}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="divorced">Divorced</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Assets Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Trust Assets</h3>
          <Button onClick={handleAddAsset} size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Growth Rate (%)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.assets.map((asset, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={asset.type}
                    onValueChange={(value: TrustAsset['type']) => 
                      updateAsset(index, { ...asset, type: value })}
                  >
                    {ASSET_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={asset.description}
                    onChange={(e) => 
                      updateAsset(index, { ...asset, description: e.target.value })}
                    placeholder="Description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={asset.value}
                    onChange={(e) => 
                      updateAsset(index, { ...asset, value: parseFloat(e.target.value) || 0 })}
                    placeholder="Value"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={asset.appreciationRate ? asset.appreciationRate * 100 : ''}
                    onChange={(e) => 
                      updateAsset(index, { ...asset, appreciationRate: (parseFloat(e.target.value) || 0) / 100 })}
                    placeholder="Growth Rate"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAsset(index)}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Beneficiaries Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Beneficiaries</h3>
          <Button onClick={handleAddBeneficiary} size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Beneficiary
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Distribution %</TableHead>
              <TableHead>Special Needs</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.beneficiaries.map((beneficiary, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={beneficiary.type}
                    onValueChange={(value: TrustBeneficiary['type']) => 
                      updateBeneficiary(index, { ...beneficiary, type: value })}
                  >
                    {BENEFICIARY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={beneficiary.name}
                    onChange={(e) => 
                      updateBeneficiary(index, { ...beneficiary, name: e.target.value })}
                    placeholder="Name"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={beneficiary.age || ''}
                    onChange={(e) => 
                      updateBeneficiary(index, { ...beneficiary, age: parseInt(e.target.value) || undefined })}
                    placeholder="Age"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={beneficiary.distributionPercentage}
                    onChange={(e) => 
                      updateBeneficiary(index, { ...beneficiary, distributionPercentage: parseFloat(e.target.value) || 0 })}
                    placeholder="Distribution %"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={beneficiary.specialNeeds}
                    onCheckedChange={(checked) =>
                      updateBeneficiary(index, { ...beneficiary, specialNeeds: checked })}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBeneficiary(index)}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Distribution Strategy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribution Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Distribution Method</Label>
            <Select
              value={inputs.distributionStrategy}
              onValueChange={updateDistributionStrategy}
            >
              {DISTRIBUTION_STRATEGIES.map(strategy => (
                <option key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={inputs.retainControl}
                onCheckedChange={updateRetainControl}
              />
              <Label>Retain Control</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={inputs.charitableIntent}
                onCheckedChange={updateCharitableIntent}
              />
              <Label>Charitable Intent</Label>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
        <Button onClick={calculate} disabled={isCalculating}>
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Trust Plan
        </Button>
      </div>

      {/* Results */}
      {results && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trust Analysis Results</h3>
          
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Total Asset Value</Label>
              <div className="text-2xl font-bold">
                ${results.totalAssetValue.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Projected Growth</Label>
              <div className="text-2xl font-bold text-green-600">
                ${results.projectedGrowth.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Estate Tax Savings</Label>
              <div className="text-2xl font-bold text-blue-600">
                ${results.estateTaxSavings.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Annual Cost</Label>
              <div className="text-2xl font-bold text-red-600">
                ${results.annualMaintenanceCost.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Trust Features */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Trust Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Asset Protection</Label>
                <div className={`text-lg font-medium ${
                  results.assetProtectionLevel === 'high'
                    ? 'text-green-600'
                    : results.assetProtectionLevel === 'medium'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {results.assetProtectionLevel.toUpperCase()}
                </div>
              </div>
              <div>
                <Label>Flexibility</Label>
                <div className={`text-lg font-medium ${
                  results.flexibilityLevel === 'high'
                    ? 'text-green-600'
                    : results.flexibilityLevel === 'medium'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {results.flexibilityLevel.toUpperCase()}
                </div>
              </div>
              <div>
                <Label>Control Retained</Label>
                <div className="text-lg font-medium">
                  {results.controlRetained ? 'YES' : 'NO'}
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary Distributions */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Distribution Plan</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Timing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.beneficiaryDistributions.map((dist, index) => (
                  <TableRow key={index}>
                    <TableCell>{dist.beneficiaryName}</TableCell>
                    <TableCell>${dist.amount.toLocaleString()}</TableCell>
                    <TableCell>{dist.timing}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Recommended Features */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Recommended Features</h4>
            <ul className="list-disc list-inside space-y-1">
              {results.recommendedFeatures.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          {results.warnings.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 className="font-semibold mb-2">Important Considerations</h4>
              <ul className="list-disc list-inside space-y-1">
                {results.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-700">{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

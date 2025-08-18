'use client';

import React from 'react';
import { useInheritanceTaxCalculator } from './useInheritanceTaxCalculator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { InheritedAsset, Deduction } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MinusCircle, Calculator, Scale } from 'lucide-react';

const ASSET_TYPES = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'investment', label: 'Investments' },
  { value: 'retirement', label: 'Retirement Accounts' },
  { value: 'business', label: 'Business Interests' },
  { value: 'life_insurance', label: 'Life Insurance' },
  { value: 'personal', label: 'Personal Property' },
  { value: 'other', label: 'Other' }
];

const DEDUCTION_TYPES = [
  { value: 'funeral', label: 'Funeral Expenses' },
  { value: 'debts', label: 'Debts & Mortgages' },
  { value: 'administration', label: 'Administration Expenses' },
  { value: 'charitable', label: 'Charitable Contributions' },
  { value: 'marital', label: 'Marital Deduction' },
  { value: 'other', label: 'Other' }
];

const HEIR_RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'parent', label: 'Parent' },
  { value: 'other', label: 'Other' }
];

const US_STATES = [
  { value: 'WA', label: 'Washington' },
  { value: 'OR', label: 'Oregon' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'IL', label: 'Illinois' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'NY', label: 'New York' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'PA', label: 'Pennsylvania' }
  // Add more states as needed
];

export default function InheritanceTaxCalculator() {
  const {
    inputs,
    results,
    errors,
    isCalculating,
    summaryStats,
    addAsset,
    updateAsset,
    removeAsset,
    addDeduction,
    updateDeduction,
    removeDeduction,
    updateDecedentInfo,
    updateHeirInfo,
    updatePriorGifts,
    updatePortabilityElection,
    updateDeceasedSpouseExemption,
    calculate,
    reset
  } = useInheritanceTaxCalculator();

  const handleAddAsset = () => {
    addAsset({
      type: 'other',
      description: '',
      value: 0
    });
  };

  const handleAddDeduction = () => {
    addDeduction({
      type: 'other',
      description: '',
      amount: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Decedent Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Decedent Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>State of Residence</Label>
            <Select
              value={inputs.decedent.state}
              onValueChange={(value) => updateDecedentInfo('state', value)}
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
            <Label>Date of Death</Label>
            <Input
              type="date"
              value={inputs.decedent.dateOfDeath}
              onChange={(e) => updateDecedentInfo('dateOfDeath', e.target.value)}
            />
          </div>
          <div>
            <Label>Marital Status</Label>
            <Select
              value={inputs.decedent.maritalStatus}
              onValueChange={(value) => updateDecedentInfo('maritalStatus', value)}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="divorced">Divorced</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Heir Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Heir Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Relationship to Decedent</Label>
            <Select
              value={inputs.heir.relationship}
              onValueChange={(value) => updateHeirInfo('relationship', value)}
            >
              {HEIR_RELATIONSHIPS.map(rel => (
                <option key={rel.value} value={rel.value}>
                  {rel.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>State of Residence</Label>
            <Select
              value={inputs.heir.state}
              onValueChange={(value) => updateHeirInfo('state', value)}
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
            <Label>Adjusted Gross Income</Label>
            <Input
              type="number"
              value={inputs.heir.adjustedGrossIncome}
              onChange={(e) => updateHeirInfo('adjustedGrossIncome', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </Card>

      {/* Assets Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Inherited Assets</h3>
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
              <TableHead>Cost Basis</TableHead>
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
                    onValueChange={(value: InheritedAsset['type']) => 
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
                    value={asset.basis}
                    onChange={(e) => 
                      updateAsset(index, { ...asset, basis: parseFloat(e.target.value) })}
                    placeholder="Cost Basis"
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

      {/* Deductions Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Deductions</h3>
          <Button onClick={handleAddDeduction} size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Deduction
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.deductions.map((deduction, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={deduction.type}
                    onValueChange={(value: Deduction['type']) => 
                      updateDeduction(index, { ...deduction, type: value })}
                  >
                    {DEDUCTION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={deduction.description}
                    onChange={(e) => 
                      updateDeduction(index, { ...deduction, description: e.target.value })}
                    placeholder="Description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={deduction.amount}
                    onChange={(e) => 
                      updateDeduction(index, { ...deduction, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="Amount"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDeduction(index)}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Additional Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Prior Taxable Gifts</Label>
            <Input
              type="number"
              value={inputs.priorGifts}
              onChange={(e) => updatePriorGifts(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={inputs.portabilityElection}
                onCheckedChange={updatePortabilityElection}
              />
              <Label>Elect Portability</Label>
            </div>
            {inputs.portabilityElection && (
              <div>
                <Label>Deceased Spouse's Unused Exemption</Label>
                <Input
                  type="number"
                  value={inputs.deceasedSpouseExemption}
                  onChange={(e) => updateDeceasedSpouseExemption(parseFloat(e.target.value) || 0)}
                />
              </div>
            )}
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
          Calculate Inheritance Tax
        </Button>
      </div>

      {/* Results */}
      {results && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Analysis Results</h3>
          
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Gross Estate</Label>
              <div className="text-2xl font-bold">
                ${results.grossEstate.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Total Tax Liability</Label>
              <div className="text-2xl font-bold text-red-600">
                ${results.totalTaxLiability.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Net Inheritance</Label>
              <div className="text-2xl font-bold text-green-600">
                ${results.netInheritance.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Effective Tax Rate</Label>
              <div className="text-2xl font-bold">
                {(results.effectiveTaxRate * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Tax Breakdown</h4>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Federal Estate Tax</TableCell>
                  <TableCell className="text-right">${results.federalEstateTax.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>State Estate Tax</TableCell>
                  <TableCell className="text-right">${results.stateEstateTax.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>State Inheritance Tax</TableCell>
                  <TableCell className="text-right">${results.stateInheritanceTax.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Step-Up in Basis Benefits */}
          {results.stepUpBasis.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Step-Up in Basis Benefits</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Old Basis</TableHead>
                    <TableHead>New Basis</TableHead>
                    <TableHead>Tax Savings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.stepUpBasis.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.asset}</TableCell>
                      <TableCell>${item.oldBasis.toLocaleString()}</TableCell>
                      <TableCell>${item.newBasis.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">
                        ${item.taxSavings.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Tax Saving Opportunities */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Tax Saving Opportunities</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Potential Savings</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.taxSavingOpportunities.map((opportunity, index) => (
                  <TableRow key={index}>
                    <TableCell>{opportunity.strategy}</TableCell>
                    <TableCell className="text-green-600">
                      ${opportunity.potentialSavings.toLocaleString()}
                    </TableCell>
                    <TableCell>{opportunity.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

import React from 'react';
import { useEstateValueCalculator } from './useEstateValueCalculator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Asset, Liability } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MinusCircle, Calculator } from 'lucide-react';

const ASSET_TYPES = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'investment', label: 'Investments' },
  { value: 'retirement', label: 'Retirement Accounts' },
  { value: 'business', label: 'Business Interests' },
  { value: 'life_insurance', label: 'Life Insurance' },
  { value: 'personal', label: 'Personal Property' },
  { value: 'other', label: 'Other' }
];

const LIABILITY_TYPES = [
  { value: 'mortgage', label: 'Mortgages' },
  { value: 'loan', label: 'Loans' },
  { value: 'credit', label: 'Credit Cards' },
  { value: 'tax', label: 'Tax Obligations' },
  { value: 'other', label: 'Other' }
];

const US_STATES = [
  { value: 'WA', label: 'Washington' },
  { value: 'OR', label: 'Oregon' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'IL', label: 'Illinois' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'NY', label: 'New York' },
  // Add more states as needed
];

export default function EstateValueCalculator() {
  const {
    inputs,
    results,
    errors,
    isCalculating,
    summaryStats,
    addAsset,
    updateAsset,
    removeAsset,
    addLiability,
    updateLiability,
    removeLiability,
    updateState,
    updateMaritalStatus,
    updateHasChildren,
    updateHasTrust,
    calculate,
    reset
  } = useEstateValueCalculator();

  const handleAddAsset = () => {
    addAsset({
      type: 'other',
      description: '',
      value: 0
    });
  };

  const handleAddLiability = () => {
    addLiability({
      type: 'other',
      description: '',
      amount: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Assets Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assets</h3>
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.assets.map((asset, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={asset.type}
                    onValueChange={(value: Asset['type']) => 
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

      {/* Liabilities Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Liabilities</h3>
          <Button onClick={handleAddLiability} size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Liability
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
            {inputs.liabilities.map((liability, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={liability.type}
                    onValueChange={(value: Liability['type']) => 
                      updateLiability(index, { ...liability, type: value })}
                  >
                    {LIABILITY_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={liability.description}
                    onChange={(e) => 
                      updateLiability(index, { ...liability, description: e.target.value })}
                    placeholder="Description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={liability.amount}
                    onChange={(e) => 
                      updateLiability(index, { ...liability, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="Amount"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLiability(index)}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>State of Residence</Label>
            <Select
              value={inputs.state}
              onValueChange={updateState}
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
              value={inputs.maritalStatus}
              onValueChange={updateMaritalStatus}
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="divorced">Divorced</option>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={inputs.hasChildren}
              onCheckedChange={updateHasChildren}
            />
            <Label>Have Children</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={inputs.hasTrust}
              onCheckedChange={updateHasTrust}
            />
            <Label>Have Existing Trust</Label>
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
          Calculate Estate Value
        </Button>
      </div>

      {/* Results */}
      {results && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Estate Analysis Results</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Gross Estate Value</Label>
              <div className="text-2xl font-bold">
                ${results.grossEstateValue.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Total Liabilities</Label>
              <div className="text-2xl font-bold text-red-600">
                ${results.totalLiabilities.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Net Estate Value</Label>
              <div className="text-2xl font-bold text-green-600">
                ${results.netEstateValue.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Total Tax Liability</Label>
              <div className="text-2xl font-bold text-red-600">
                ${results.totalTaxLiability.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Net to Heirs</Label>
              <div className="text-2xl font-bold text-green-600">
                ${results.netToHeirs.toLocaleString()}
              </div>
            </div>
            <div>
              <Label>Potential Tax Savings</Label>
              <div className="text-2xl font-bold text-blue-600">
                ${results.potentialTaxSavings.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Recommended Strategies */}
          <div>
            <h4 className="font-semibold mb-2">Recommended Strategies</h4>
            <ul className="list-disc list-inside space-y-1">
              {results.recommendedStrategies.map((strategy: string, index: number) => (
                <li key={index} className="text-gray-700">{strategy}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}

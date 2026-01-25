'use client';

import React from 'react';
import { useBeneficiaryPlanningTool } from './useBeneficiaryPlanningTool';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Account, Beneficiary } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MinusCircle, Calculator, Users } from 'lucide-react';

const ACCOUNT_TYPES = [
  { value: 'retirement', label: 'Retirement Accounts' },
  { value: 'life_insurance', label: 'Life Insurance' },
  { value: 'bank', label: 'Bank Accounts' },
  { value: 'investment', label: 'Investment Accounts' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'business', label: 'Business Interests' },
  { value: 'other', label: 'Other' }
];

const BENEFICIARY_RELATIONSHIPS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'parent', label: 'Parent' },
  { value: 'charity', label: 'Charity' },
  { value: 'trust', label: 'Trust' },
  { value: 'other', label: 'Other' }
];

const REVIEW_FREQUENCIES = [
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'biannual', label: 'Bi-Annual' },
  { value: 'annual', label: 'Annual' }
];

export default function BeneficiaryPlanningTool() {
  const {
    inputs,
    results,
    errors,
    isCalculating,
    summaryStats,
    addAccount,
    updateAccount,
    removeAccount,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
    updateDefaultContingent,
    updateReviewFrequency,
    updateLastFullReview,
    addLifeEvent,
    updateLifeEvent,
    removeLifeEvent,
    calculate,
    reset
  } = useBeneficiaryPlanningTool();

  const handleAddAccount = () => {
    addAccount({
      type: 'other',
      description: '',
      value: 0,
      beneficiaries: [],
      transferOnDeath: false,
      requiresDesignation: false
    });
  };

  const handleAddBeneficiary = (accountIndex: number) => {
    addBeneficiary(accountIndex, {
      name: '',
      relationship: 'other',
      type: 'primary',
      percentage: 0
    });
  };

  const handleAddLifeEvent = () => {
    addLifeEvent({
      event: '',
      date: '',
      impactedAccounts: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Review Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Review Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Review Frequency</Label>
            <Select
              value={inputs.reviewFrequency}
              onValueChange={updateReviewFrequency}
            >
              {REVIEW_FREQUENCIES.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Last Full Review</Label>
            <Input
              type="date"
              value={inputs.lastFullReview}
              onChange={(e) => updateLastFullReview(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Accounts Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Accounts</h3>
          <Button onClick={handleAddAccount} size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Transfer on Death</TableHead>
              <TableHead>Requires Designation</TableHead>
              <TableHead>Last Reviewed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.accounts.map((account, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <Select
                      value={account.type}
                      onValueChange={(value: Account['type']) => 
                        updateAccount(index, { ...account, type: value })}
                    >
                      {ACCOUNT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={account.description}
                      onChange={(e) => 
                        updateAccount(index, { ...account, description: e.target.value })}
                      placeholder="Description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={account.value}
                      onChange={(e) => 
                        updateAccount(index, { ...account, value: parseFloat(e.target.value) || 0 })}
                      placeholder="Value"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={account.transferOnDeath}
                      onCheckedChange={(checked) =>
                        updateAccount(index, { ...account, transferOnDeath: checked })}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={account.requiresDesignation}
                      onCheckedChange={(checked) =>
                        updateAccount(index, { ...account, requiresDesignation: checked })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={account.lastReviewed}
                      onChange={(e) =>
                        updateAccount(index, { ...account, lastReviewed: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddBeneficiary(index)}
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAccount(index)}
                      >
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {/* Beneficiaries Sub-Table */}
                {account.beneficiaries.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Relationship</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Special Needs</TableHead>
                            <TableHead>Trust Beneficiary</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {account.beneficiaries.map((beneficiary, bIndex) => (
                            <TableRow key={bIndex}>
                              <TableCell>
                                <Input
                                  value={beneficiary.name}
                                  onChange={(e) =>
                                    updateBeneficiary(index, bIndex, {
                                      ...beneficiary,
                                      name: e.target.value
                                    })}
                                  placeholder="Name"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={beneficiary.relationship}
                                  onValueChange={(value: Beneficiary['relationship']) =>
                                    updateBeneficiary(index, bIndex, {
                                      ...beneficiary,
                                      relationship: value
                                    })}
                                >
                                  {BENEFICIARY_RELATIONSHIPS.map(rel => (
                                    <option key={rel.value} value={rel.value}>
                                      {rel.label}
                                    </option>
                                  ))}
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={beneficiary.type}
                                  onValueChange={(value: 'primary' | 'contingent') =>
                                    updateBeneficiary(index, bIndex, {
                                      ...beneficiary,
                                      type: value
                                    })}
                                >
                                  <option value="primary">Primary</option>
                                  <option value="contingent">Contingent</option>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={beneficiary.percentage}
                                  onChange={(e) =>
                                    updateBeneficiary(index, bIndex, {
                                      ...beneficiary,
                                      percentage: parseFloat(e.target.value) || 0
                                    })}
                                  placeholder="Percentage"
                                />
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={beneficiary.specialNeeds}
                                  onCheckedChange={(checked) =>
                                    updateBeneficiary(index, bIndex, {
                                      ...beneficiary,
                                      specialNeeds: checked
                                    })}
                                />
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={beneficiary.trustBeneficiary}
                                  onCheckedChange={(checked) =>
                                    updateBeneficiary(index, bIndex, {
                                      ...beneficiary,
                                      trustBeneficiary: checked
                                    })}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeBeneficiary(index, bIndex)}
                                >
                                  <MinusCircle className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Life Events Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upcoming Life Events</h3>
          <Button onClick={handleAddLifeEvent} size="sm">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Life Event
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Impacted Accounts</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inputs.upcomingLifeEvents.map((event, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={event.event}
                    onChange={(e) =>
                      updateLifeEvent(index, { ...event, event: e.target.value })}
                    placeholder="Event Description"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="date"
                    value={event.date}
                    onChange={(e) =>
                      updateLifeEvent(index, { ...event, date: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <select
                    multiple
                    value={event.impactedAccounts}
                    onChange={(e) =>
                      updateLifeEvent(index, {
                        ...event,
                        impactedAccounts: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    {inputs.accounts.map((account, i) => (
                      <option key={i} value={account.description}>
                        {account.description}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLifeEvent(index)}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium mb-2">Please fix the following issues:</h4>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className={`text-${error.type === 'error' ? 'red' : 'yellow'}-700`}>
                {error.message}
              </li>
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
          Analyze Beneficiary Plan
        </Button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Total Assets</Label>
                <div className="text-2xl font-bold">
                  ${results.totalAssets.toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Total Beneficiaries</Label>
                <div className="text-2xl font-bold">
                  {results.beneficiarySummary.length}
                </div>
              </div>
              <div>
                <Label>Incomplete Designations</Label>
                <div className="text-2xl font-bold text-red-600">
                  {results.designationStatus.filter(s => s.status === 'incomplete').length}
                </div>
              </div>
              <div>
                <Label>High Priority Reviews</Label>
                <div className="text-2xl font-bold text-yellow-600">
                  {results.reviewSchedule.filter(r => r.priority === 'high').length}
                </div>
              </div>
            </div>
          </Card>

          {/* Beneficiary Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Beneficiary Summary</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>% of Estate</TableHead>
                  <TableHead>Account Types</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.beneficiarySummary.map((summary, index) => (
                  <TableRow key={index}>
                    <TableCell>{summary.beneficiaryName}</TableCell>
                    <TableCell>${summary.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{summary.percentageOfEstate.toFixed(1)}%</TableCell>
                    <TableCell>{summary.accountTypes.join(', ')}</TableCell>
                    <TableCell>{summary.isContingent ? 'Contingent' : 'Primary'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Designation Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Designation Status</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.designationStatus.map((status, index) => (
                  <TableRow key={index}>
                    <TableCell>{status.accountDescription}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        status.status === 'complete'
                          ? 'text-green-600'
                          : status.status === 'incomplete'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                        {status.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc list-inside">
                        {status.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Distribution Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribution Analysis</h3>
            {results.distributionAnalysis.map((analysis, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h4 className="font-semibold mb-2">{analysis.category}</h4>
                <p className="text-gray-700 mb-2">{analysis.analysis}</p>
                <ul className="list-disc list-inside space-y-1">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Card>

          {/* Review Schedule */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Review Schedule</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Last Review</TableHead>
                  <TableHead>Next Review</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.reviewSchedule.map((review, index) => (
                  <TableRow key={index}>
                    <TableCell>{review.accountDescription}</TableCell>
                    <TableCell>{review.lastReview}</TableCell>
                    <TableCell>{review.nextReview}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        review.priority === 'high'
                          ? 'text-red-600'
                          : review.priority === 'medium'
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>
                        {review.priority.toUpperCase()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Warnings */}
          {results.warnings.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Important Considerations</h3>
              {results.warnings.map((warning, index) => (
                <div
                  key={index}
                  className={`mb-4 last:mb-0 p-4 rounded-md ${
                    warning.severity === 'high'
                      ? 'bg-red-50 border-l-4 border-red-400'
                      : warning.severity === 'medium'
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : 'bg-blue-50 border-l-4 border-blue-400'
                  }`}
                >
                  <p className={`font-medium ${
                    warning.severity === 'high'
                      ? 'text-red-800'
                      : warning.severity === 'medium'
                      ? 'text-yellow-800'
                      : 'text-blue-800'
                  }`}>
                    {warning.message}
                  </p>
                  {warning.accountsAffected.length > 0 && (
                    <p className="mt-1 text-sm text-gray-600">
                      Affected accounts: {warning.accountsAffected.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

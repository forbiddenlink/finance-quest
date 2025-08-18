'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, DollarSign, Percent } from 'lucide-react';
import { ExistingDebt } from '../types';
import {
  CREDITOR_SUGGESTIONS,
  STYLE_CONFIG,
  INTEREST_RATE_THRESHOLDS
} from '../constants';
import { formatCurrency, getInterestRateCategory } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DebtInputProps {
  debts: ExistingDebt[];
  onAddDebt: (debt: ExistingDebt) => void;
  onRemoveDebt: (debtId: string) => void;
  onUpdateDebt: (debtId: string, updates: Partial<ExistingDebt>) => void;
  errors?: { field: string; message: string }[];
}

export default function DebtInput({
  debts,
  onAddDebt,
  onRemoveDebt,
  onUpdateDebt,
  errors
}: DebtInputProps) {
  const handleAddDebt = () => {
    onAddDebt({
      id: `debt-${Date.now()}`,
      creditor: '',
      balance: 0,
      interestRate: 0,
      minimumPayment: 0
    });
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const averageRate = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Current Debts</span>
          <Button
            onClick={handleAddDebt}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Debt</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Enter the details of each credit card debt you want to transfer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Debt List */}
          <div className="space-y-4">
            {debts.map((debt, index) => {
              const rateCategory = getInterestRateCategory(debt.interestRate);
              
              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={STYLE_CONFIG.debt[rateCategory]}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Creditor */}
                        <div className="space-y-2">
                          <Label htmlFor={`${debt.id}-creditor`}>Creditor</Label>
                          <Select
                            value={debt.creditor}
                            onValueChange={(value) => onUpdateDebt(debt.id, { creditor: value })}
                          >
                            <SelectTrigger id={`${debt.id}-creditor`}>
                              <SelectValue placeholder="Select creditor" />
                            </SelectTrigger>
                            <SelectContent>
                              {CREDITOR_SUGGESTIONS.map((creditor) => (
                                <SelectItem key={creditor} value={creditor}>
                                  {creditor}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors?.map((error, i) => 
                            error.field === `${debt.id}_creditor` && (
                              <p key={i} className="text-sm text-red-600">
                                {error.message}
                              </p>
                            )
                          )}
                        </div>

                        {/* Balance */}
                        <div className="space-y-2">
                          <Label htmlFor={`${debt.id}-balance`}>Current Balance</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input
                              id={`${debt.id}-balance`}
                              type="number"
                              value={debt.balance || ''}
                              onChange={(e) => onUpdateDebt(debt.id, {
                                balance: parseFloat(e.target.value) || 0
                              })}
                              className="pl-8"
                              min="0"
                            />
                          </div>
                          {errors?.map((error, i) => 
                            error.field === `${debt.id}_balance` && (
                              <p key={i} className="text-sm text-red-600">
                                {error.message}
                              </p>
                            )
                          )}
                        </div>

                        {/* Interest Rate */}
                        <div className="space-y-2">
                          <Label htmlFor={`${debt.id}-rate`}>Interest Rate (APR)</Label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input
                              id={`${debt.id}-rate`}
                              type="number"
                              value={debt.interestRate || ''}
                              onChange={(e) => onUpdateDebt(debt.id, {
                                interestRate: parseFloat(e.target.value) || 0
                              })}
                              className="pl-8"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          {errors?.map((error, i) => 
                            error.field === `${debt.id}_rate` && (
                              <p key={i} className="text-sm text-red-600">
                                {error.message}
                              </p>
                            )
                          )}
                        </div>

                        {/* Minimum Payment */}
                        <div className="space-y-2">
                          <Label htmlFor={`${debt.id}-minimum`}>Minimum Payment</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input
                              id={`${debt.id}-minimum`}
                              type="number"
                              value={debt.minimumPayment || ''}
                              onChange={(e) => onUpdateDebt(debt.id, {
                                minimumPayment: parseFloat(e.target.value) || 0
                              })}
                              className="pl-8"
                              min="0"
                            />
                          </div>
                          {errors?.map((error, i) => 
                            error.field === `${debt.id}_minimum` && (
                              <p key={i} className="text-sm text-red-600">
                                {error.message}
                              </p>
                            )
                          )}
                        </div>

                        {/* Current Monthly Payment */}
                        <div className="space-y-2">
                          <Label htmlFor={`${debt.id}-payment`}>
                            Current Monthly Payment (Optional)
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <Input
                              id={`${debt.id}-payment`}
                              type="number"
                              value={debt.monthlyPayment || ''}
                              onChange={(e) => onUpdateDebt(debt.id, {
                                monthlyPayment: parseFloat(e.target.value) || undefined
                              })}
                              className="pl-8"
                              min="0"
                              placeholder="Same as minimum"
                            />
                          </div>
                          {errors?.map((error, i) => 
                            error.field === `${debt.id}_payment` && (
                              <p key={i} className="text-sm text-red-600">
                                {error.message}
                              </p>
                            )
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveDebt(debt.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Debt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          {debts.length > 0 && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total Debt</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(totalDebt)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Average Interest Rate</div>
                  <div className="text-lg font-bold">
                    {averageRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

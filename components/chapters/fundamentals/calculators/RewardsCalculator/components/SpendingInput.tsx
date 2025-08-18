'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { MonthlySpending } from '../types';
import { SPENDING_CATEGORIES, CATEGORY_ICONS } from '../constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SpendingInputProps {
  spending: MonthlySpending[];
  onUpdateSpending: (spending: MonthlySpending[]) => void;
  errors?: { field: string; message: string }[];
}

export default function SpendingInput({
  spending,
  onUpdateSpending,
  errors
}: SpendingInputProps) {
  const handleSpendingChange = (category: string, value: string) => {
    const amount = value === '' ? 0 : Math.max(0, parseInt(value) || 0);
    const newSpending = spending.map(spend =>
      spend.category === category ? { ...spend, amount } : spend
    );
    onUpdateSpending(newSpending);
  };

  const totalSpending = spending.reduce((sum, spend) => sum + spend.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Monthly Spending</span>
        </CardTitle>
        <CardDescription>
          Enter your average monthly spending in each category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Spending Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spending.map((spend, index) => (
              <motion.div
                key={spend.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={spend.category}
                    className="flex items-center space-x-2"
                  >
                    <span>{CATEGORY_ICONS[spend.category]}</span>
                    <span>{SPENDING_CATEGORIES[spend.category]}</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      id={spend.category}
                      type="number"
                      value={spend.amount || ''}
                      onChange={(e) => handleSpendingChange(spend.category, e.target.value)}
                      className="pl-8"
                      min="0"
                    />
                  </div>
                  {errors?.map((error, i) => 
                    error.field === spend.category && (
                      <p key={i} className="text-sm text-red-600">
                        {error.message}
                      </p>
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total Spending */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Monthly Spending:</span>
              <span className="text-lg font-bold">
                ${totalSpending.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

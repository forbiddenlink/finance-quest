'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import { DebtPaydownPlan } from '../types';
import { PAYDOWN_STRATEGIES } from '../constants';
import { formatCurrency } from '../utils';
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

interface PaydownSectionProps {
  plan: DebtPaydownPlan;
  onUpdateBudget: (amount: number) => void;
  onSelectStrategy: (name: string) => void;
}

export default function PaydownSection({
  plan,
  onUpdateBudget,
  onSelectStrategy
}: PaydownSectionProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Debt Paydown Plan</h3>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Total Debt</div>
                <div className="text-2xl font-bold">{formatCurrency(plan.totalDebt)}</div>
              </div>
              <div>
                <Label>Monthly Budget</Label>
                <Input
                  type="number"
                  value={plan.monthlyBudget}
                  onChange={(e) => onUpdateBudget(parseFloat(e.target.value))}
                />
              </div>
              {plan.selectedStrategy && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Selected Strategy</div>
                  <div className="text-xl font-medium">
                    {PAYDOWN_STRATEGIES[plan.selectedStrategy as keyof typeof PAYDOWN_STRATEGIES].name}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Strategies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plan.strategies.map((strategy, index) => (
            <motion.div
              key={strategy.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={
                plan.selectedStrategy === strategy.name
                  ? 'border-blue-500 shadow-lg'
                  : ''
              }>
                <CardHeader>
                  <CardTitle>{strategy.name}</CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Timeline */}
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-500">Timeline</div>
                        <div className="font-medium">{strategy.timeline} months</div>
                      </div>
                    </div>

                    {/* Savings */}
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-sm text-gray-500">Interest Saved</div>
                        <div className="font-medium text-green-600">
                          {formatCurrency(strategy.interestSaved)}
                        </div>
                      </div>
                    </div>

                    {/* Score Impact */}
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-sm text-gray-500">Score Impact</div>
                        <div className="font-medium text-purple-600">
                          +{strategy.scoreImprovement} points
                        </div>
                      </div>
                    </div>

                    {/* Strategy Info */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Benefits:</div>
                      <ul className="text-sm space-y-1">
                        {PAYDOWN_STRATEGIES[strategy.name as keyof typeof PAYDOWN_STRATEGIES].benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <ArrowRight className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Drawbacks:</div>
                      <ul className="text-sm space-y-1">
                        {PAYDOWN_STRATEGIES[strategy.name as keyof typeof PAYDOWN_STRATEGIES].drawbacks.map((drawback, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{drawback}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      variant={plan.selectedStrategy === strategy.name ? 'default' : 'outline'}
                      onClick={() => onSelectStrategy(strategy.name)}
                    >
                      {plan.selectedStrategy === strategy.name ? 'Selected' : 'Select Strategy'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Payment Schedule */}
        {plan.selectedStrategy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>Monthly payment allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plan.strategies
                    .find(s => s.name === plan.selectedStrategy)
                    ?.monthlyPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="text-sm">Account ending in {payment.accountId.slice(-4)}</div>
                        <div className="font-medium">{formatCurrency(payment.amount)}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}

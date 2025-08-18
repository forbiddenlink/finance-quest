'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingDown, DollarSign } from 'lucide-react';
import { UtilizationStrategy } from '../types';
import { formatCurrency, formatPercentage } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface UtilizationSectionProps {
  strategies: UtilizationStrategy[];
}

export default function UtilizationSection({
  strategies
}: UtilizationSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Utilization Optimization</h3>

      <div className="space-y-4">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.accountId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <span>Account Optimization Plan</span>
                </CardTitle>
                <CardDescription>
                  Reduce utilization and save on interest
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current vs Target */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Current Balance</div>
                      <div className="text-2xl font-bold">{formatCurrency(strategy.currentBalance)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Target Balance</div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(strategy.targetBalance)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Plan */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Payment Plan</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Monthly Payment</div>
                        <div className="font-medium">{formatCurrency(strategy.paymentAmount)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Time to Target</div>
                        <div className="font-medium">{strategy.monthsToTarget} months</div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Benefits</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Interest Saved</div>
                        <div className="font-medium text-green-600">
                          {formatCurrency(strategy.interestSaved)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Score Improvement</div>
                        <div className="font-medium text-blue-600">
                          +{strategy.scoreImprovement} points
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress to Target</span>
                      <span>{formatPercentage(
                        (1 - (strategy.currentBalance / strategy.targetBalance)) * 100
                      )}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(1 - (strategy.currentBalance / strategy.targetBalance)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {strategies.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                No utilization optimization strategies needed at this time
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Trophy,
  CreditCard,
  TrendingUp,
  DollarSign,
  Gift,
  Star
} from 'lucide-react';
import { RewardsAnalysis as RewardsAnalysisType, CardRewards } from '../types';
import { SPENDING_CATEGORIES, CATEGORY_ICONS, REWARD_TYPE_INFO } from '../constants';
import { formatCurrency, formatPoints } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface RewardsAnalysisProps {
  analysis: RewardsAnalysisType;
}

export default function RewardsAnalysis({
  analysis
}: RewardsAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Best Cards Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Best Cards for Your Spending</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recommended Combination */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Recommended Combination</span>
                </div>
                <p className="text-sm mb-2">{analysis.recommendedCombination.explanation}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-white">
                    Total Value: {formatCurrency(analysis.recommendedCombination.totalValue)}
                  </Badge>
                </div>
              </div>

              {/* Best Overall Card */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium">Best Overall Card</span>
                </div>
                <div className="text-sm">
                  {analysis.annualRewards.find(r => r.cardId === analysis.bestOverallCard)?.cardName}
                </div>
              </div>

              {/* Best No-Fee Card */}
              {analysis.bestNoFeeCard && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Best No Annual Fee Card</span>
                  </div>
                  <div className="text-sm">
                    {analysis.annualRewards.find(r => r.cardId === analysis.bestNoFeeCard)?.cardName}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5" />
              <span>Detailed Rewards Analysis</span>
            </CardTitle>
            <CardDescription>
              Annual rewards breakdown for each card
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {analysis.annualRewards.map((reward, index) => (
                <AccordionItem key={reward.cardId} value={reward.cardId}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>{reward.cardName}</span>
                      </div>
                      <Badge variant="outline">
                        Net Value: {formatCurrency(reward.netValue)}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {/* Base Rewards */}
                      <div>
                        <div className="font-medium mb-2">Base Rewards</div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            {formatPoints(reward.baseRewards.points)} points
                          </div>
                          <Badge variant="outline">
                            Value: {formatCurrency(reward.baseRewards.cashValue)}
                          </Badge>
                        </div>
                      </div>

                      {/* Category Rewards */}
                      {reward.categoryRewards.length > 0 && (
                        <div>
                          <div className="font-medium mb-2">Category Bonuses</div>
                          <div className="space-y-2">
                            {reward.categoryRewards.map((category, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span>{CATEGORY_ICONS[category.category]}</span>
                                  <span className="text-sm">
                                    {SPENDING_CATEGORIES[category.category]}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-sm">
                                    {formatPoints(category.rewards.points)} points
                                  </div>
                                  <Badge variant="outline">
                                    {formatCurrency(category.rewards.cashValue)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sign-up Bonus */}
                      {reward.signupBonus && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Gift className="w-4 h-4" />
                            <span className="font-medium">Sign-up Bonus</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm">
                              {formatPoints(reward.signupBonus.points)} points
                            </div>
                            <Badge variant="outline">
                              Value: {formatCurrency(reward.signupBonus.cashValue)}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Benefits Value */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4" />
                          <span className="font-medium">Card Benefits</span>
                        </div>
                        <Badge variant="outline">
                          Annual Value: {formatCurrency(reward.benefitsValue)}
                        </Badge>
                      </div>

                      {/* Total Value Breakdown */}
                      <div className="pt-4 border-t">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Total Rewards Value</span>
                            <span>{formatCurrency(reward.totalRewards.cashValue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Benefits Value</span>
                            <span>{formatCurrency(reward.benefitsValue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Annual Fee</span>
                            <span className="text-red-600">
                              -{formatCurrency(reward.annualFee)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-bold pt-2 border-t">
                            <span>Net Value</span>
                            <span>{formatCurrency(reward.netValue)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

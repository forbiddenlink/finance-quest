'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Gift, Clock, DollarSign, Star } from 'lucide-react';
import { BalanceTransferCard } from '../types';
import { STYLE_CONFIG } from '../constants';
import { formatPercent } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CardSelectorProps {
  availableCards: BalanceTransferCard[];
  selectedCard: BalanceTransferCard | null;
  onSelectCard: (cardId: string) => void;
}

export default function CardSelector({
  availableCards,
  selectedCard,
  onSelectCard
}: CardSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Balance Transfer Card</CardTitle>
        <CardDescription>
          Compare available balance transfer offers and select the best one for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onSelectCard(card.id)}
              className="cursor-pointer"
            >
              <Card
                className={`transition-colors ${
                  selectedCard?.id === card.id
                    ? STYLE_CONFIG.card.selected
                    : STYLE_CONFIG.card.unselected
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>{card.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>Annual Fee: ${card.annualFee}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Intro APR */}
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-medium">
                          {formatPercent(card.introAPR)}
                        </span>
                        <span> intro APR for </span>
                        <span className="font-medium">
                          {card.introPeriod} months
                        </span>
                      </div>
                    </div>

                    {/* Regular APR */}
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>
                        {formatPercent(card.regularAPR)} regular APR
                      </span>
                    </div>

                    {/* Transfer Fee */}
                    <div>
                      <div className="font-medium mb-2">Balance Transfer Fee:</div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {formatPercent(card.transferFeeRate)}
                        </Badge>
                        <span>
                          (minimum ${card.transferFeeMin})
                        </span>
                      </div>
                    </div>

                    {/* Benefits */}
                    {card.additionalBenefits.length > 0 && (
                      <div>
                        <div className="font-medium mb-2">Additional Benefits:</div>
                        <ul className="space-y-2">
                          {card.additionalBenefits.map((benefit, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <Gift className="w-4 h-4 mt-1 text-green-500" />
                              <div>
                                <div className="font-medium">{benefit.name}</div>
                                <div className="text-sm text-gray-600">
                                  {benefit.description}
                                </div>
                                <Badge variant="outline" className="mt-1">
                                  ${benefit.value} value
                                </Badge>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Credit Limit */}
                    {card.creditLimit && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>
                          Up to ${card.creditLimit.toLocaleString()} credit limit
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

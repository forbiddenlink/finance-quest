'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard as CreditCardIcon, Gift, Star, X } from 'lucide-react';
import { CreditCard } from '../types';
import { REWARD_TYPE_INFO, STYLE_CONFIG } from '../constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CardSelectorProps {
  availableCards: CreditCard[];
  selectedCards: CreditCard[];
  onSelectCard: (card: CreditCard) => void;
  onRemoveCard: (cardId: string) => void;
}

export default function CardSelector({
  availableCards,
  selectedCards,
  onSelectCard,
  onRemoveCard
}: CardSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Credit Cards</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableCards.map((card, index) => {
          const isSelected = selectedCards.some(c => c.id === card.id);

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`relative cursor-pointer transition-colors ${
                  isSelected ? STYLE_CONFIG.card.selected : STYLE_CONFIG.card.unselected
                }`}
                onClick={() => isSelected ? onRemoveCard(card.id) : onSelectCard(card)}
              >
                {isSelected && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCard(card.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCardIcon className="w-5 h-5" />
                    <span>{card.name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>Annual Fee: ${card.annualFee}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      {REWARD_TYPE_INFO[card.rewardType].icon}
                      <span>{REWARD_TYPE_INFO[card.rewardType].name}</span>
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Base Rate */}
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{card.baseRate}x on all purchases</span>
                    </div>

                    {/* Bonus Categories */}
                    {card.bonusCategories.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium">Bonus Categories:</div>
                        <div className="flex flex-wrap gap-2">
                          {card.bonusCategories.map((bonus, i) => (
                            <Badge
                              key={i}
                              className={STYLE_CONFIG.category[bonus.category]}
                            >
                              {bonus.rate}x {bonus.category}
                              {bonus.cap && ` (up to $${bonus.cap})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sign-up Bonus */}
                    {card.signupBonus && (
                      <div className="flex items-start space-x-2">
                        <Gift className="w-4 h-4 mt-1 text-green-500" />
                        <div>
                          <div className="font-medium">Sign-up Bonus:</div>
                          <div className="text-sm">
                            {card.signupBonus.amount.toLocaleString()} {card.rewardType} after spending
                            ${card.signupBonus.spendRequirement.toLocaleString()} in {card.signupBonus.timeframe} months
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Benefits */}
                    {card.benefits.length > 0 && (
                      <div className="space-y-2">
                        <div className="font-medium">Card Benefits:</div>
                        <ul className="space-y-1">
                          {card.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm flex items-center space-x-2">
                              <span>•</span>
                              <span>{benefit.description}</span>
                              <Badge variant="outline">
                                ${benefit.value} value
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

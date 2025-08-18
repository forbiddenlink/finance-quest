'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calculator } from 'lucide-react';
import { useRewardsCalculator } from './useRewardsCalculator';
import { POPULAR_CARDS } from './constants';
import CardSelector from './components/CardSelector';
import SpendingInput from './components/SpendingInput';
import RewardsAnalysis from './components/RewardsAnalysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RewardsCalculator() {
  const [state, actions] = useRewardsCalculator();

  return (
    <div className="space-y-8">
      {/* Card Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardSelector
          availableCards={POPULAR_CARDS}
          selectedCards={state.selectedCards}
          onSelectCard={actions.addCard}
          onRemoveCard={actions.removeCard}
        />
      </motion.div>

      {/* Monthly Spending */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SpendingInput
          spending={state.monthlySpending}
          onUpdateSpending={actions.updateSpending}
          errors={state.errors}
        />
      </motion.div>

      {/* Validation Errors */}
      {state.errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Please Fix the Following Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {state.errors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    • {error.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Calculate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={actions.calculateRewards}
          disabled={state.errors.length > 0 || state.selectedCards.length === 0}
          className="w-full md:w-auto"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Rewards
        </Button>
      </div>

      {/* Results */}
      {state.analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RewardsAnalysis analysis={state.analysis} />
        </motion.div>
      )}
    </div>
  );
}

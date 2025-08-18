'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calculator } from 'lucide-react';
import { useBalanceTransferCalculator } from './useBalanceTransferCalculator';
import DebtInput from './components/DebtInput';
import CardSelector from './components/CardSelector';
import TransferAnalysis from './components/TransferAnalysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BalanceTransferCalculator() {
  const [state, actions] = useBalanceTransferCalculator();

  return (
    <div className="space-y-8">
      {/* Debt Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DebtInput
          debts={state.existingDebts}
          onAddDebt={actions.addDebt}
          onRemoveDebt={actions.removeDebt}
          onUpdateDebt={actions.updateDebt}
          errors={state.errors}
        />
      </motion.div>

      {/* Card Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CardSelector
          availableCards={state.availableCards}
          selectedCard={state.selectedCard}
          onSelectCard={actions.selectCard}
        />
      </motion.div>

      {/* Monthly Payment Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payment</CardTitle>
            <CardDescription>
              How much can you pay each month towards your transferred balance?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-payment">
                  Desired Monthly Payment (Optional)
                </Label>
                <Input
                  id="monthly-payment"
                  type="number"
                  value={state.monthlyPayment || ''}
                  onChange={(e) => actions.setMonthlyPayment(parseFloat(e.target.value) || 0)}
                  placeholder="We'll calculate the optimal payment if not specified"
                />
                {state.errors.map((error, index) => 
                  error.field === 'monthlyPayment' && (
                    <p key={index} className="text-sm text-red-600">
                      {error.message}
                    </p>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
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
          onClick={actions.calculateTransfer}
          disabled={
            state.errors.length > 0 ||
            state.existingDebts.length === 0 ||
            !state.selectedCard
          }
          className="w-full md:w-auto"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Analyze Balance Transfer
        </Button>
      </div>

      {/* Results */}
      {state.analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TransferAnalysis analysis={state.analysis} />
        </motion.div>
      )}
    </div>
  );
}

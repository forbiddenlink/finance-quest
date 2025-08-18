'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useCreditScoreOptimizer } from './useCreditScoreOptimizer';
import AccountsSection from './components/AccountsSection';
import GoalsSection from './components/GoalsSection';
import AnalysisSection from './components/AnalysisSection';
import UtilizationSection from './components/UtilizationSection';
import PaydownSection from './components/PaydownSection';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CreditScoreOptimizer() {
  const [state, actions] = useCreditScoreOptimizer();

  return (
    <div className="space-y-8">
      {/* Credit Accounts */}
      <AccountsSection
        accounts={state.accounts}
        onAddAccount={actions.addAccount}
        onRemoveAccount={actions.removeAccount}
        onUpdateAccount={actions.updateAccount}
      />

      {/* Credit Score Goals */}
      <GoalsSection
        goals={state.goals}
        onAddGoal={actions.addGoal}
        onRemoveGoal={actions.removeGoal}
        onUpdateGoal={actions.updateGoal}
      />

      {/* Analysis Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={actions.analyze}
          disabled={state.accounts.length === 0 || state.goals.length === 0}
        >
          Analyze & Generate Plan
        </Button>
      </div>

      {/* Analysis Results */}
      {state.factorAnalysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <AnalysisSection
            factorAnalysis={state.factorAnalysis}
            optimizationActions={state.optimizationActions}
            onCompleteAction={actions.completeAction}
          />

          <UtilizationSection
            strategies={state.utilizationStrategies}
          />

          {state.debtPaydownPlan && (
            <PaydownSection
              plan={state.debtPaydownPlan}
              onUpdateBudget={actions.updateMonthlyBudget}
              onSelectStrategy={actions.setSelectedPaydownStrategy}
            />
          )}
        </motion.div>
      )}

      {/* Validation Errors */}
      {state.errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Validation Errors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
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

      {/* Advanced Options */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => actions.setShowAdvancedOptions(!state.showAdvancedOptions)}
        >
          {state.showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
        </Button>
      </div>
    </div>
  );
}

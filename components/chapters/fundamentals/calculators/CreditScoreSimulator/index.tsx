'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, CreditCard, AlertTriangle, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { useCreditScoreSimulator } from './useCreditScoreSimulator';
import { getScoreRange, formatCurrency, formatPercentage, formatDate } from './utils';
import { SCORE_RANGES, STYLE_CONFIG, SIMULATION_PRESETS } from './constants';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreditScoreSimulator() {
  const [state, actions] = useCreditScoreSimulator();
  const scoreRange = getScoreRange(state.currentScore);
  const styles = STYLE_CONFIG[scoreRange];

  return (
    <div className="space-y-8">
      {/* Current Score */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-lg ${styles.background} ${styles.border} border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Your Credit Score</h2>
              <p className={`text-4xl font-bold mt-2 ${styles.text}`}>
                {state.currentScore}
              </p>
              <p className={`text-lg mt-1 ${styles.text}`}>
                {SCORE_RANGES[scoreRange].label}
              </p>
            </div>
            <LineChart className={`w-16 h-16 ${styles.text}`} />
          </div>
        </motion.div>
      </section>

      {/* Score Factors */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Score Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.scoreFactors.map((factor, index) => (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span>{factor.factor.replace('_', ' ').toUpperCase()}</span>
                  </CardTitle>
                  <CardDescription>
                    Potential improvement: {factor.potentialImprovement} points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Time to improve: {factor.timeToImprove}
                    </p>
                    <ul className="text-sm space-y-1">
                      {factor.suggestedActions.map((action, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-blue-500">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Credit Accounts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Credit Accounts</h3>
          <Button
            onClick={() => {
              actions.addAccount({
                id: '',
                type: 'credit_card',
                balance: 0,
                creditLimit: 0,
                openDate: new Date(),
                paymentStatus: 'current',
                status: 'open',
                monthlyPayment: 0,
                paymentHistory: []
              });
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </Button>
        </div>
        <div className="space-y-4">
          {state.profile.accounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      <span>{account.type.replace('_', ' ').toUpperCase()}</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => actions.removeAccount(account.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Opened {formatDate(account.openDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Balance</Label>
                      <Input
                        type="number"
                        value={account.balance}
                        onChange={(e) => actions.updateAccount(account.id, {
                          ...account,
                          balance: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Credit Limit</Label>
                      <Input
                        type="number"
                        value={account.creditLimit}
                        onChange={(e) => actions.updateAccount(account.id, {
                          ...account,
                          creditLimit: parseFloat(e.target.value)
                        })}
                      />
                    </div>
                    <div>
                      <Label>Payment Status</Label>
                      <Select
                        value={account.paymentStatus}
                        onValueChange={(value: any) => actions.updateAccount(account.id, {
                          ...account,
                          paymentStatus: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="late_30">30 Days Late</SelectItem>
                          <SelectItem value="late_60">60 Days Late</SelectItem>
                          <SelectItem value="late_90">90 Days Late</SelectItem>
                          <SelectItem value="collection">In Collections</SelectItem>
                          <SelectItem value="charge_off">Charged Off</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Account Status</Label>
                      <Select
                        value={account.status}
                        onValueChange={(value: any) => actions.updateAccount(account.id, {
                          ...account,
                          status: value
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="delinquent">Delinquent</SelectItem>
                          <SelectItem value="collection">In Collections</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simulations */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Score Simulations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(SIMULATION_PRESETS).map(([key, preset], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => actions.simulateAction({
                  type: key as any,
                  details: {}
                })}
              >
                <CardHeader>
                  <CardTitle>{preset.name}</CardTitle>
                  <CardDescription>{preset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Affected Factors:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {preset.factors.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Timeframe:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {preset.timeframe}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simulation Results */}
      {state.simulations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Simulation Results</h3>
            <Button
              variant="outline"
              onClick={actions.resetSimulation}
            >
              Reset Simulations
            </Button>
          </div>
          <div className="space-y-4">
            {state.simulations.map((simulation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Score Impact</span>
                      <span className={simulation.simulatedScore > simulation.baseScore
                        ? 'text-green-600'
                        : 'text-red-600'
                      }>
                        {simulation.simulatedScore - simulation.baseScore > 0 ? '+' : ''}
                        {simulation.simulatedScore - simulation.baseScore} points
                      </span>
                    </CardTitle>
                    <CardDescription>
                      New Score: {simulation.simulatedScore}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Changes</h4>
                        <ul className="mt-2 space-y-2">
                          {simulation.changes.map((change, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className={change.impact > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                              }>
                                {change.impact > 0 ? '+' : ''}{change.impact}
                              </span>
                              <span>{change.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Recovery Time</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {simulation.timeToRecover}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Validation Errors */}
      {state.errors.length > 0 && (
        <section className="space-y-4">
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
        </section>
      )}
    </div>
  );
}

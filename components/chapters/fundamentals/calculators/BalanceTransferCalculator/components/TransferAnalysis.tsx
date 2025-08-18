'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  TrendingDown,
  Clock,
  DollarSign,
  CreditCard,
  AlertTriangle,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { DebtAnalysis } from '../types';
import { formatCurrency, formatMonths, formatPercent } from '../utils';
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

interface TransferAnalysisProps {
  analysis: DebtAnalysis;
}

export default function TransferAnalysis({
  analysis
}: TransferAnalysisProps) {
  const {
    originalTotalDebt,
    originalMonthlyPayment,
    originalPayoffTime,
    originalTotalInterest,
    originalTotalCost,
    bestScenario,
    alternativeScenarios,
    paymentSchedule,
    recommendations
  } = analysis;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5" />
              <span>Balance Transfer Analysis</span>
            </CardTitle>
            <CardDescription>
              Compare your current situation with the balance transfer option
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Situation */}
              <div className="space-y-4">
                <div className="font-medium">Current Situation</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Debt:</span>
                    <span>{formatCurrency(originalTotalDebt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Payment:</span>
                    <span>{formatCurrency(originalMonthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payoff Time:</span>
                    <span>{formatMonths(originalPayoffTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest:</span>
                    <span className="text-red-600">
                      {formatCurrency(originalTotalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total Cost:</span>
                    <span>{formatCurrency(originalTotalCost)}</span>
                  </div>
                </div>
              </div>

              {/* With Balance Transfer */}
              <div className="space-y-4">
                <div className="font-medium">With Balance Transfer</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Transfer Amount:</span>
                    <span>{formatCurrency(bestScenario.totalTransferred)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer Fee:</span>
                    <span className="text-red-600">
                      {formatCurrency(bestScenario.transferFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Payment:</span>
                    <span>{formatCurrency(bestScenario.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payoff Time:</span>
                    <span>{formatMonths(bestScenario.payoffPeriod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Interest:</span>
                    <span className="text-red-600">
                      {formatCurrency(bestScenario.totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total Cost:</span>
                    <span>{formatCurrency(bestScenario.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-medium">Potential Savings:</div>
                <div className={`text-xl font-bold ${
                  bestScenario.savings > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {bestScenario.savings > 0 ? (
                    <div className="flex items-center">
                      <TrendingDown className="w-5 h-5 mr-2" />
                      Save {formatCurrency(bestScenario.savings)}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Costs {formatCurrency(Math.abs(bestScenario.savings))} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    rec.impact > 0 ? 'bg-green-50' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <ChevronRight className={`w-5 h-5 ${
                      rec.impact > 0 ? 'text-green-600' : 'text-blue-600'
                    }`} />
                    <span className="font-medium">{rec.title}</span>
                  </div>
                  <p className="text-sm">{rec.description}</p>
                  {rec.impact > 0 && (
                    <Badge
                      variant="outline"
                      className="mt-2 bg-white"
                    >
                      Impact: {formatCurrency(rec.impact)}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Payment Schedule</span>
            </CardTitle>
            <CardDescription>
              Month-by-month breakdown of your balance transfer payoff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {paymentSchedule.map((month, index) => (
                <AccordionItem key={index} value={`month-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <span>Month {month.month}</span>
                        {month.isIntroPeriod && (
                          <Badge variant="outline" className="bg-blue-50">
                            Intro APR
                          </Badge>
                        )}
                      </div>
                      <span className="text-right">
                        Balance: {formatCurrency(month.remainingBalance)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between">
                        <span>Payment:</span>
                        <span>{formatCurrency(month.payment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Principal:</span>
                        <span>{formatCurrency(month.principal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest:</span>
                        <span className="text-red-600">
                          {formatCurrency(month.interest)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>{formatPercent(month.interestRate)}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alternative Scenarios */}
      {alternativeScenarios.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Alternative Scenarios</span>
              </CardTitle>
              <CardDescription>
                Compare different payment strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alternativeScenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        Monthly Payment: {formatCurrency(scenario.monthlyPayment)}
                      </div>
                      <Badge variant="outline">
                        {formatMonths(scenario.payoffPeriod)} payoff
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Total Interest</div>
                        <div className="text-red-600">
                          {formatCurrency(scenario.totalInterest)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                        <div>{formatCurrency(scenario.totalCost)}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span>Savings vs Current:</span>
                        <span className={
                          scenario.savings > 0 ? 'text-green-600' : 'text-red-600'
                        }>
                          {scenario.savings > 0 ? 'Save ' : 'Costs '}
                          {formatCurrency(Math.abs(scenario.savings))}
                          {scenario.savings <= 0 ? ' more' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

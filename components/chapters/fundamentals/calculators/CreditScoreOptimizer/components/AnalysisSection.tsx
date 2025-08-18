'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { FactorAnalysis, OptimizationAction } from '../types';
import { FACTOR_WEIGHTS } from '../constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalysisSectionProps {
  factorAnalysis: FactorAnalysis[];
  optimizationActions: OptimizationAction[];
  onCompleteAction: (id: string) => void;
}

export default function AnalysisSection({
  factorAnalysis,
  optimizationActions,
  onCompleteAction
}: AnalysisSectionProps) {
  return (
    <section className="space-y-8">
      {/* Factor Analysis */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Credit Factor Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factorAnalysis.map((factor, index) => (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <LineChart className="w-5 h-5 text-blue-500" />
                      <span>{factor.factor.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round(FACTOR_WEIGHTS[factor.factor] * 100)}%
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Current Score: {Math.round(factor.currentScore)} / {Math.round(factor.maxScore)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(factor.currentScore / factor.maxScore) * 100}%`
                        }}
                      />
                    </div>

                    {/* Impact Level */}
                    {factor.impact !== 'none' && (
                      <div className={`flex items-center space-x-2 text-sm ${
                        factor.impact === 'high' ? 'text-red-600' :
                        factor.impact === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                        <span>{factor.impact.toUpperCase()} Impact</span>
                      </div>
                    )}

                    {/* Issues */}
                    {factor.issues.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Issues</h4>
                        <ul className="space-y-1">
                          {factor.issues.map((issue, i) => (
                            <li key={i} className="text-sm text-gray-600">
                              • {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optimization Actions */}
      {optimizationActions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recommended Actions</h3>
          <div className="space-y-4">
            {optimizationActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {action.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <LineChart className="w-5 h-5 text-blue-500" />
                          )}
                          <h4 className="font-medium">{action.description}</h4>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-500">
                            Impact: +{action.impact.points} points
                          </span>
                          <span className="text-gray-500">
                            Timeline: {action.impact.timeFrame.replace('_', ' ')}
                          </span>
                        </div>
                        {action.requirements.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Requirements:
                            <ul className="mt-1 space-y-1">
                              {action.requirements.map((req, i) => (
                                <li key={i}>• {req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {action.risks.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Risks:
                            <ul className="mt-1 space-y-1">
                              {action.risks.map((risk, i) => (
                                <li key={i}>• {risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {!action.completed && (
                        <Button
                          variant="outline"
                          onClick={() => onCompleteAction(action.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

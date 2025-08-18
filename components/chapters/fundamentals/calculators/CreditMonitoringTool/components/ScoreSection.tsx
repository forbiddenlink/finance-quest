'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CreditScore } from '../types';
import { BUREAU_INFO, SCORE_RANGES, STYLE_CONFIG } from '../constants';
import { getScoreRange, formatDate } from '../utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScoreSectionProps {
  scores: CreditScore[];
  onUpdateScore: (bureau: CreditScore['bureau'], score: number) => void;
}

export default function ScoreSection({
  scores,
  onUpdateScore
}: ScoreSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Credit Scores</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(BUREAU_INFO).map(([bureau, info], index) => {
          const score = scores.find(s => s.bureau === bureau);
          const scoreRange = score ? getScoreRange(score.score) : undefined;
          const changeType = score?.changeType;

          return (
            <motion.div
              key={bureau}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{info.name}</span>
                    {score && (
                      <div className={`flex items-center space-x-1 ${
                        changeType === 'increase' ? 'text-green-600' :
                        changeType === 'decrease' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {changeType === 'increase' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : changeType === 'decrease' ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                        {score.changeAmount && (
                          <span>{changeType === 'increase' ? '+' : ''}{score.changeAmount}</span>
                        )}
                      </div>
                    )}
                  </CardTitle>
                  {score && (
                    <CardDescription>
                      Last updated: {formatDate(score.date)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Current Score</Label>
                      <Input
                        type="number"
                        value={score?.score || ''}
                        onChange={(e) => onUpdateScore(bureau as any, parseInt(e.target.value))}
                        min={info.scoreRange.min}
                        max={info.scoreRange.max}
                      />
                    </div>

                    {score && (
                      <>
                        {/* Score Range */}
                        <div className={`p-2 rounded ${scoreRange ? STYLE_CONFIG[scoreRange].background : ''}`}>
                          <div className="text-sm font-medium">
                            {scoreRange ? SCORE_RANGES[scoreRange].label : 'N/A'}
                          </div>
                          <div className="text-sm">
                            Range: {info.scoreRange.min} - {info.scoreRange.max}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{
                                width: `${((score.score - info.scoreRange.min) / (info.scoreRange.max - info.scoreRange.min)) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Score Factors */}
                        {score.factors && score.factors.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Key Factors</div>
                            <ul className="space-y-1">
                              {score.factors.map((factor, i) => (
                                <li
                                  key={i}
                                  className={`text-sm flex items-center space-x-1 ${
                                    factor.impact === 'positive' ? 'text-green-600' : 'text-red-600'
                                  }`}
                                >
                                  {factor.impact === 'positive' ? (
                                    <TrendingUp className="w-4 h-4" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4" />
                                  )}
                                  <span>{factor.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, AlertTriangle, Lightbulb } from 'lucide-react';
import { ScoreInsight } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface InsightsSectionProps {
  insights: ScoreInsight[];
}

export default function InsightsSection({
  insights
}: InsightsSectionProps) {
  const getInsightIcon = (type: ScoreInsight['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  const getInsightStyle = (type: ScoreInsight['type']) => {
    switch (type) {
      case 'achievement':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-red-50 border-red-200';
      case 'tip':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold">Score Insights</h3>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={getInsightStyle(insight.type)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <span>{insight.title}</span>
                </CardTitle>
                <CardDescription>
                  Time Frame: {insight.timeFrame}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>{insight.description}</p>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Impact:</span>
                    <span className={`text-sm ${
                      insight.impact > 0 ? 'text-green-600' :
                      insight.impact < 0 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {insight.impact > 0 ? '+' : ''}{insight.impact} points
                    </span>
                  </div>

                  {insight.actions && insight.actions.length > 0 && (
                    <div>
                      <div className="text-sm font-medium">Recommended Actions:</div>
                      <ul className="mt-1 space-y-1">
                        {insight.actions.map((action, i) => (
                          <li key={i} className="text-sm">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {insights.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                No insights available at this time
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

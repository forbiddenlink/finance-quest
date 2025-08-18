'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Target,
  Clock,
  BarChart3,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { QuizAnalytics } from '../types';
import { CATEGORY_INFO, DIFFICULTY_INFO, QUIZ_CONFIG } from '../constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResultsCardProps {
  analytics: QuizAnalytics;
  score: number;
  onRestart: () => void;
}

export default function ResultsCard({
  analytics,
  score,
  onRestart
}: ResultsCardProps) {
  const isPassing = score >= QUIZ_CONFIG.passingScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <Card className={isPassing ? 'bg-green-50' : 'bg-red-50'}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className={`w-6 h-6 ${isPassing ? 'text-green-600' : 'text-red-600'}`} />
            <span>Quiz Results</span>
          </CardTitle>
          <CardDescription>
            {isPassing ? 'Congratulations!' : 'Keep practicing!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            {score}%
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-600" />
              <span>Passing Score: {QUIZ_CONFIG.passingScore}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span>Average Time per Question: {Math.round(analytics.averageTimePerQuestion)} seconds</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <span>Accuracy: {Math.round(analytics.accuracy)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Performance by Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.categoryBreakdown).map(([category, stats]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{CATEGORY_INFO[category as keyof typeof CATEGORY_INFO].name}</div>
                  <div>{Math.round(stats.accuracy)}%</div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.accuracy}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      {analytics.weakestCategories.length > 0 && (
        <Card className="bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.weakestCategories.map(category => (
                <div key={category}>
                  <div className="font-medium mb-2">
                    {CATEGORY_INFO[category as keyof typeof CATEGORY_INFO].name}
                  </div>
                  <div className="text-sm text-yellow-800">
                    {CATEGORY_INFO[category as keyof typeof CATEGORY_INFO].description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Topics */}
      {analytics.recommendedTopics.length > 0 && (
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>Recommended Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analytics.recommendedTopics.map((topic, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={onRestart}
          className="w-full md:w-auto"
        >
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}

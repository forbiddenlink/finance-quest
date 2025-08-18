'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { QuizProgress, QuizQuestion } from '../types';
import { formatTime, getQuestionStatus } from '../utils';

interface ProgressBarProps {
  questions: QuizQuestion[];
  progress: QuizProgress;
  timeRemaining?: number;
  onQuestionSelect?: (index: number) => void;
}

export default function ProgressBar({
  questions,
  progress,
  timeRemaining,
  onQuestionSelect
}: ProgressBarProps) {
  const completedQuestions = progress.answers.length;
  const totalQuestions = questions.length;
  const percentComplete = (completedQuestions / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Stats */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          Question {progress.currentQuestionIndex + 1} of {totalQuestions}
        </div>
        {timeRemaining !== undefined && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span className={timeRemaining <= 60 ? 'text-red-600 font-bold' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentComplete}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2">
        {questions.map((_, index) => {
          const status = getQuestionStatus(
            index,
            progress.currentQuestionIndex,
            progress.answers,
            questions
          );
          const answer = progress.answers.find(
            a => a.questionId === questions[index].id
          );

          return (
            <button
              key={index}
              onClick={() => onQuestionSelect?.(index)}
              disabled={!onQuestionSelect}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${status === 'current'
                  ? 'bg-blue-500 text-white'
                  : status === 'completed'
                    ? answer?.isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

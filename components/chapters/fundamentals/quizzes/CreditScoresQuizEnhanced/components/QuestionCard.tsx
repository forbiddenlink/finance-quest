'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { QuizQuestion } from '../types';
import { DIFFICULTY_INFO } from '../constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedAnswer?: number;
  showExplanation: boolean;
  showHint: boolean;
  onSelectAnswer: (answer: number) => void;
  onShowHint: () => void;
  onHideHint: () => void;
  onShowExplanation: () => void;
  onHideExplanation: () => void;
  isAnswered: boolean;
  isCorrect?: boolean;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  showExplanation,
  showHint,
  onSelectAnswer,
  onShowHint,
  onHideHint,
  onShowExplanation,
  onHideExplanation,
  isAnswered,
  isCorrect
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{question.question}</CardTitle>
            <Badge className={DIFFICULTY_INFO[question.difficulty].color}>
              {DIFFICULTY_INFO[question.difficulty].name}
            </Badge>
          </div>
          <CardDescription>
            Points: {question.points}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Options */}
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? 'default' : 'outline'}
                  className={`w-full justify-start ${
                    isAnswered && index === question.correctAnswer
                      ? 'bg-green-100 hover:bg-green-200'
                      : isAnswered && index === selectedAnswer && !isCorrect
                      ? 'bg-red-100 hover:bg-red-200'
                      : ''
                  }`}
                  onClick={() => !isAnswered && onSelectAnswer(index)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center space-x-2">
                    {isAnswered && index === question.correctAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    {isAnswered && index === selectedAnswer && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>

            {/* Hint */}
            {!isAnswered && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showHint ? onHideHint : onShowHint}
                  className="text-blue-600"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 p-3 bg-blue-50 rounded-md"
                  >
                    <div className="flex items-start space-x-2">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-600">Hint:</div>
                        <div className="text-sm text-blue-800">
                          Think about the key concepts covered in the lesson about {question.category.replace('_', ' ')}.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Explanation */}
            {isAnswered && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showExplanation ? onHideExplanation : onShowExplanation}
                  className={isCorrect ? 'text-green-600' : 'text-red-600'}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </Button>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className={`mt-2 p-3 rounded-md ${
                      isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <div className={`font-medium ${
                          isCorrect ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </div>
                        <div className={`text-sm ${
                          isCorrect ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {question.explanation}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

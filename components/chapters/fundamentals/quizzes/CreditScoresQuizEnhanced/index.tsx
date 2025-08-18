'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useQuizEnhanced } from './useQuizEnhanced';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import ResultsCard from './components/ResultsCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CreditScoresQuizEnhanced() {
  const [state, actions] = useQuizEnhanced();
  const currentQuestion = state.questions[state.progress.currentQuestionIndex];
  const currentAnswer = state.progress.answers.find(
    a => a.questionId === currentQuestion?.id
  );

  if (!state.progress.startTime || state.progress.answers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Credit Scores & Reports Quiz</CardTitle>
            <CardDescription>
              Test your knowledge about credit scores, credit reports, monitoring, and improvement strategies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="font-medium">Quiz Details:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>{state.questions.length} questions</li>
                  <li>20 minutes time limit</li>
                  <li>70% passing score required</li>
                  <li>Hints and explanations available</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-medium">Topics Covered:</div>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Credit Score Basics</li>
                  <li>Credit Report Components</li>
                  <li>Credit Monitoring</li>
                  <li>Credit Score Improvement</li>
                </ul>
              </div>

              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={actions.startQuiz}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (state.isComplete) {
    return (
      <ResultsCard
        analytics={state.analytics}
        score={state.progress.score}
        onRestart={actions.restartQuiz}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ProgressBar
        questions={state.questions}
        progress={state.progress}
        timeRemaining={state.timeRemaining}
      />

      <QuestionCard
        question={currentQuestion}
        selectedAnswer={currentAnswer?.selectedAnswer}
        showExplanation={state.showExplanation}
        showHint={state.showHint}
        onSelectAnswer={actions.submitAnswer}
        onShowHint={actions.showHint}
        onHideHint={actions.hideHint}
        onShowExplanation={actions.showExplanation}
        onHideExplanation={actions.hideExplanation}
        isAnswered={!!currentAnswer}
        isCorrect={currentAnswer?.isCorrect}
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={actions.previousQuestion}
          disabled={state.progress.currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={actions.nextQuestion}
          disabled={
            state.progress.currentQuestionIndex === state.questions.length - 1 ||
            !currentAnswer
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

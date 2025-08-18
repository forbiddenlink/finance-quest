export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'credit_basics' | 'credit_reports' | 'credit_monitoring' | 'credit_improvement';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  points: number;
}

export interface QuizProgress {
  currentQuestionIndex: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  score: number;
  maxScore: number;
  startTime: Date;
  endTime?: Date;
}

export interface QuizAnalytics {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number;
  categoryBreakdown: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    };
  };
  difficultyBreakdown: {
    [key: string]: {
      total: number;
      correct: number;
      accuracy: number;
    };
  };
  weakestCategories: string[];
  recommendedTopics: string[];
}

export interface QuizState {
  questions: QuizQuestion[];
  progress: QuizProgress;
  analytics: QuizAnalytics;
  isComplete: boolean;
  showExplanation: boolean;
  showHint: boolean;
  timeRemaining?: number;
}

export interface QuizActions {
  startQuiz: () => void;
  submitAnswer: (answer: number) => void;
  showExplanation: () => void;
  hideExplanation: () => void;
  showHint: () => void;
  hideHint: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  restartQuiz: () => void;
  generateAnalytics: () => void;
}

export type UseQuizEnhanced = () => [QuizState, QuizActions];

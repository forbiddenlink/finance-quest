import { QuizQuestion, QuizProgress, QuizAnalytics } from './types';
import { ANALYTICS_CONFIG } from './constants';

export function calculateScore(progress: QuizProgress): number {
  if (progress.answers.length === 0) return 0;

  const totalPoints = progress.answers.reduce((sum, answer) => {
    const question = progress.questions?.find(q => q.id === answer.questionId);
    return sum + (answer.isCorrect ? (question?.points || 0) : 0);
  }, 0);

  return Math.round((totalPoints / progress.maxScore) * 100);
}

export function generateAnalytics(questions: QuizQuestion[], progress: QuizProgress): QuizAnalytics {
  const totalQuestions = questions.length;
  const answers = progress.answers;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = answers.length - correctAnswers;
  const accuracy = answers.length > 0 ? (correctAnswers / answers.length) * 100 : 0;
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
  const averageTimePerQuestion = answers.length > 0 ? totalTime / answers.length : 0;

  // Initialize category and difficulty breakdowns
  const categoryBreakdown: QuizAnalytics['categoryBreakdown'] = {};
  const difficultyBreakdown: QuizAnalytics['difficultyBreakdown'] = {};

  // Process each answered question
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    // Update category breakdown
    if (!categoryBreakdown[question.category]) {
      categoryBreakdown[question.category] = { total: 0, correct: 0, accuracy: 0 };
    }
    categoryBreakdown[question.category].total++;
    if (answer.isCorrect) {
      categoryBreakdown[question.category].correct++;
    }

    // Update difficulty breakdown
    if (!difficultyBreakdown[question.difficulty]) {
      difficultyBreakdown[question.difficulty] = { total: 0, correct: 0, accuracy: 0 };
    }
    difficultyBreakdown[question.difficulty].total++;
    if (answer.isCorrect) {
      difficultyBreakdown[question.difficulty].correct++;
    }
  });

  // Calculate accuracies
  Object.values(categoryBreakdown).forEach(category => {
    category.accuracy = (category.correct / category.total) * 100;
  });
  Object.values(difficultyBreakdown).forEach(difficulty => {
    difficulty.accuracy = (difficulty.correct / difficulty.total) * 100;
  });

  // Identify weak categories
  const weakestCategories = Object.entries(categoryBreakdown)
    .filter(([_, stats]) => stats.total >= ANALYTICS_CONFIG.recommendationThreshold &&
                           stats.accuracy < ANALYTICS_CONFIG.weakCategoryThreshold)
    .map(([category, _]) => category)
    .sort((a, b) => categoryBreakdown[a].accuracy - categoryBreakdown[b].accuracy);

  // Generate recommendations
  const recommendedTopics = generateRecommendations(weakestCategories, categoryBreakdown);

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    accuracy,
    averageTimePerQuestion,
    categoryBreakdown,
    difficultyBreakdown,
    weakestCategories,
    recommendedTopics
  };
}

function generateRecommendations(
  weakCategories: string[],
  categoryBreakdown: QuizAnalytics['categoryBreakdown']
): string[] {
  const recommendations: string[] = [];

  weakCategories.forEach(category => {
    const stats = categoryBreakdown[category];
    if (!stats) return;

    switch (category) {
      case 'credit_basics':
        recommendations.push(
          'Review fundamental credit score components',
          'Study how credit scores are calculated',
          'Learn about different types of credit'
        );
        break;
      case 'credit_reports':
        recommendations.push(
          'Practice reading credit reports',
          'Learn about different sections of a credit report',
          'Study how to dispute credit report errors'
        );
        break;
      case 'credit_monitoring':
        recommendations.push(
          'Explore credit monitoring services',
          'Learn about identity theft protection',
          'Study credit freeze and fraud alerts'
        );
        break;
      case 'credit_improvement':
        recommendations.push(
          'Review credit score improvement strategies',
          'Learn about credit utilization optimization',
          'Study debt management techniques'
        );
        break;
    }
  });

  return recommendations;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateTimeSpent(startTime: Date, endTime: Date = new Date()): number {
  return Math.round((endTime.getTime() - startTime.getTime()) / 1000);
}

export function getQuestionStatus(
  questionIndex: number,
  currentIndex: number,
  answers: QuizProgress['answers'],
  questions: QuizQuestion[]
): 'current' | 'completed' | 'pending' {
  if (questionIndex === currentIndex) return 'current';
  if (answers.some(a => a.questionId === questions[questionIndex].id)) return 'completed';
  return 'pending';
}

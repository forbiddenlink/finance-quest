/**
 * Advanced Learning Analytics for Finance Quest
 * Extends the existing progress tracking with AI-powered insights
 */

import { useProgressStore } from '../store/progressStore';

export interface LearningPattern {
  userId: string;
  sessionDuration: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  conceptsLearned: string[];
  strugglingAreas: string[];
  learningVelocity: number; // lessons per hour
  retentionRate: number; // percentage
}

export interface PersonalizedRecommendation {
  type: 'lesson' | 'calculator' | 'quiz' | 'break';
  content: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // minutes
}

export const useAdvancedAnalytics = () => {
  const userProgress = useProgressStore(state => state.userProgress);

  const generateLearningInsights = (): PersonalizedRecommendation[] => {
    const insights: PersonalizedRecommendation[] = [];

    // Analyze learning patterns
    const { learningAnalytics, calculatorUsage } = userProgress;

    // Time-based recommendations
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 11) {
      insights.push({
        type: 'lesson',
        content: 'Peak learning hours detected - perfect time for complex topics!',
        reason: 'Studies show morning hours are optimal for learning new concepts',
        priority: 'high',
        estimatedTime: 15
      });
    }

    // Performance-based recommendations
    if (learningAnalytics.averageQuizScore < 70) {
      insights.push({
        type: 'calculator',
        content: 'Practice with interactive calculators to reinforce concepts',
        reason: 'Hands-on practice improves understanding and retention',
        priority: 'high',
        estimatedTime: 10
      });
    }

    // Engagement recommendations
    const calculatorUsageCount = Object.keys(calculatorUsage).length;
    if (calculatorUsageCount < 3) {
      insights.push({
        type: 'calculator',
        content: 'Explore our Compound Interest Calculator',
        reason: 'Visual learning aids help cement financial concepts',
        priority: 'medium',
        estimatedTime: 8
      });
    }

    return insights;
  };

  const predictNextBestAction = (): PersonalizedRecommendation => {
    const insights = generateLearningInsights();
    const highPriority = insights.filter(i => i.priority === 'high');
    
    return highPriority.length > 0 
      ? highPriority[0]
      : insights[0] || {
          type: 'lesson',
          content: 'Continue with your next chapter',
          reason: 'Steady progress builds financial literacy',
          priority: 'medium',
          estimatedTime: 12
        };
  };

  return {
    generateLearningInsights,
    predictNextBestAction,
    learningVelocity: userProgress.learningAnalytics.lessonCompletionRate,
    strongestAreas: userProgress.learningAnalytics.conceptsMastered,
    improvementAreas: userProgress.learningAnalytics.areasNeedingWork
  };
};

export default useAdvancedAnalytics;

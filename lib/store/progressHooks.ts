/**
 * Migration utility for transitioning from React Context to Zustand
 * This provides backwards compatibility while we migrate components
 */

import { useProgressStore } from './progressStore';

// Legacy hook for components still using the old context pattern
export const useProgress = () => {
  const store = useProgressStore();
  
  return {
    userProgress: store.userProgress,
    completeLesson: store.completeLesson,
    recordQuizScore: store.recordQuizScore,
    canTakeQuiz: store.canTakeQuiz,
    updateTimeSpent: store.updateTimeSpent,
    isChapterUnlocked: store.isChapterUnlocked,
    getChapterProgress: store.getChapterProgress,
    recordCalculatorUsage: store.recordCalculatorUsage,
    resetProgress: store.resetProgress
  };
};

// Enhanced hooks for new features
export const useEnhancedProgress = () => {
  const store = useProgressStore();
  
  return {
    ...store,
    // Computed values for convenience
    totalQuizzesTaken: Object.keys(store.userProgress.quizScores).length,
    totalLessonsCompleted: store.userProgress.completedLessons.length,
    averageQuizScore: store.userProgress.learningAnalytics.averageQuizScore,
    currentStreak: store.userProgress.streakDays,
    longestStreak: store.userProgress.longestStreak,
    totalTimeSpentHours: Math.round(store.userProgress.totalTimeSpent / 3600 * 10) / 10,
    currentLevel: store.userProgress.userLevel,
    totalXP: store.userProgress.totalXP,
    
    // Streak helpers
    streakStatus: store.getStreakMotivation().streakStatus,
    streakMessage: store.getStreakMotivation().message,
    canUseStreakFreeze: store.userProgress.streakFreezesUsed < 3,
    
    // Goal tracking
    weeklyGoalProgress: (store.userProgress.weeklyProgress / store.userProgress.weeklyGoal) * 100,
    isWeeklyGoalMet: store.userProgress.weeklyProgress >= store.userProgress.weeklyGoal,
    
    // Helper methods
    hasPassedChapter: (chapterId: number) => {
      const quizId = `chapter${chapterId}-quiz`;
      const score = store.userProgress.quizScores[quizId];
      return score && score >= 80;
    },
    
    getStrugglingAreas: () => store.userProgress.strugglingTopics,
    
    getMasteredConcepts: () => store.userProgress.learningAnalytics.conceptsMastered,
    
    getUserRank: () => {
      const totalXP = store.userProgress.totalXP;
      if (totalXP >= 25000) return { rank: 'Financial Guru', color: 'text-purple-400' };
      if (totalXP >= 15000) return { rank: 'Wealth Strategist', color: 'text-pink-400' };
      if (totalXP >= 10000) return { rank: 'Investment Advisor', color: 'text-purple-400' };
      if (totalXP >= 6000) return { rank: 'Financial Analyst', color: 'text-green-400' };
      if (totalXP >= 3000) return { rank: 'Money Manager', color: 'text-blue-400' };
      if (totalXP >= 1000) return { rank: 'Budget Builder', color: 'text-amber-400' };
      return { rank: 'Finance Novice', color: 'text-slate-400' };
    },
    
    getXPToNextLevel: () => {
      const currentLevel = store.userProgress.userLevel;
      const xpForNextLevel = currentLevel * 1000;
      return xpForNextLevel - store.userProgress.currentXP;
    },
    
    getLevelProgress: () => {
      const currentLevel = store.userProgress.userLevel;
      const xpForCurrentLevel = (currentLevel - 1) * 1000;
      const xpForNextLevel = currentLevel * 1000;
      const currentLevelXP = store.userProgress.totalXP - xpForCurrentLevel;
      const totalLevelXP = xpForNextLevel - xpForCurrentLevel;
      return Math.min(100, Math.max(0, (currentLevelXP / totalLevelXP) * 100));
    },
    
    getRecommendedNextAction: () => {
      return store.getStudyRecommendation();
    },
    
    getPersonalizedMessage: () => {
      return store.getPersonalizedEncouragement();
    },
    
    // Advanced analytics
    getLearningVelocity: () => store.userProgress.learningAnalytics.learningVelocity,
    getRetentionRate: () => store.userProgress.learningAnalytics.retentionRate,
    getFocusScore: () => store.userProgress.learningAnalytics.focusScore,
    
    // Engagement metrics
    getEngagementScore: () => {
      const metrics = store.userProgress.engagementMetrics;
      const streakBonus = Math.min(50, store.userProgress.streakDays * 2);
      const sessionBonus = Math.min(30, metrics.sessionsThisWeek * 5);
      const baseScore = 20; // Everyone starts with some engagement
      return Math.min(100, baseScore + streakBonus + sessionBonus);
    },
    
    isHighlyEngaged: () => {
      const engagementScore = store.userProgress.engagementMetrics.sessionsThisWeek >= 3 &&
                             store.userProgress.streakDays >= 3 &&
                             store.userProgress.learningAnalytics.averageQuizScore >= 75;
      return engagementScore;
    }
  };
};

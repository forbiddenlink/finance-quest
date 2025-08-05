'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { Badge, Trophy, Star, Target, Calculator, TrendingUp, DollarSign, Award } from 'lucide-react';
import { theme } from '@/lib/theme';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'financial' | 'learning' | 'engagement' | 'mastery';
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  userProgress: Record<string, unknown>; // From Zustand store
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export default function AchievementSystem({ userProgress, onAchievementUnlocked }: AchievementSystemProps) {
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Define all available achievements
  const allAchievements: Achievement[] = useMemo(() => [
    {
      id: 'first-calculation',
      title: 'Number Cruncher',
      description: 'Complete your first financial calculation',
      icon: <Calculator className="w-6 h-6" />,
      category: 'engagement',
      points: 50,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'paycheck-optimizer',
      title: 'Paycheck Optimizer',
      description: 'Use the paycheck calculator with 401k contribution > 10%',
      icon: <DollarSign className="w-6 h-6" />,
      category: 'financial',
      points: 100,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'tax-saver',
      title: 'Tax Saving Expert',
      description: 'Optimize your tax rate below 20% using pre-tax deductions',
      icon: <TrendingUp className="w-6 h-6" />,
      category: 'financial',
      points: 150,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'quiz-streak-5',
      title: 'Learning Streak',
      description: 'Score 80%+ on 5 consecutive quizzes',
      icon: <Target className="w-6 h-6" />,
      category: 'learning',
      points: 200,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'calculator-explorer',
      title: 'Calculator Explorer',
      description: 'Use 5 different financial calculators',
      icon: <Star className="w-6 h-6" />,
      category: 'engagement',
      points: 100,
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'financial-guru',
      title: 'Financial Guru',
      description: 'Complete all 14 chapters with 90%+ average quiz score',
      icon: <Trophy className="w-6 h-6" />,
      category: 'mastery',
      points: 500,
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: 'precision-master',
      title: 'Precision Master',
      description: 'Experience the new decimal.js accuracy improvements',
      icon: <Award className="w-6 h-6" />,
      category: 'engagement',
      points: 75,
      unlocked: false,
      rarity: 'rare'
    }
  ], []);

  // Check for new achievements based on user progress
  useEffect(() => {
    const checkAchievements = () => {
      const newUnlocked: Achievement[] = [];

      // Check each achievement
      allAchievements.forEach(achievement => {
        const wasUnlocked = localStorage.getItem(`achievement-${achievement.id}`) === 'true';
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first-calculation':
            shouldUnlock = Boolean(userProgress?.calculatorUsage && Object.keys(userProgress.calculatorUsage).length > 0);
            break;

          case 'paycheck-optimizer':
            // This would be set when user uses paycheck calculator with >10% 401k
            shouldUnlock = localStorage.getItem('paycheck-401k-optimized') === 'true';
            break;

          case 'calculator-explorer':
            shouldUnlock = Boolean(userProgress?.calculatorUsage && Object.keys(userProgress.calculatorUsage).length >= 5);
            break;

          case 'quiz-streak-5':
            // This would need streak tracking in the progress store
            shouldUnlock = Boolean(userProgress?.quizStreak && (userProgress.quizStreak as number) >= 5);
            break;

          case 'precision-master':
            // Auto-unlock when user sees the new decimal.js implementation
            shouldUnlock = localStorage.getItem('used-decimal-calculator') === 'true';
            break;

          case 'financial-guru':
            const completedChapters = userProgress?.completedChapters || [];
            const avgQuizScore = (userProgress?.averageQuizScore as number) || 0;
            shouldUnlock = Array.isArray(completedChapters) && completedChapters.length >= 14 && avgQuizScore >= 90;
            break;
        }

        if (shouldUnlock && !wasUnlocked) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
          newUnlocked.push(unlockedAchievement);
          localStorage.setItem(`achievement-${achievement.id}`, 'true');
          localStorage.setItem(`achievement-${achievement.id}-date`, new Date().toISOString());
        }
      });

      if (newUnlocked.length > 0) {
        setNewlyUnlocked(newUnlocked);
        setShowConfetti(true);

        // Call callback for each new achievement
        newUnlocked.forEach(achievement => {
          onAchievementUnlocked?.(achievement);
        });

        // Hide notification after 5 seconds
        setTimeout(() => {
          setNewlyUnlocked([]);
          setShowConfetti(false);
        }, 5000);
      }
    };

    checkAchievements();
  }, [userProgress, onAchievementUnlocked, allAchievements]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityBg = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10';
      case 'rare': return 'bg-blue-500/10';
      case 'epic': return 'bg-purple-500/10';
      case 'legendary': return 'bg-yellow-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  if (newlyUnlocked.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {showConfetti && <ConfettiExplosion />}

      {newlyUnlocked.map((achievement, index) => (
        <div
          key={achievement.id}
          className={`
            ${theme.backgrounds.card} border-2 ${getRarityColor(achievement.rarity)} 
            ${getRarityBg(achievement.rarity)} rounded-lg p-4 shadow-lg 
            animate-in slide-in-from-right duration-500 max-w-sm
          `}
          style={{ animationDelay: `${index * 200}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className={`
              p-2 rounded-full ${getRarityBg(achievement.rarity)} 
              ${getRarityColor(achievement.rarity)} border
            `}>
              {achievement.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="w-4 h-4 text-yellow-400" />
                <h3 className={`font-bold ${theme.textColors.primary} text-sm`}>
                  Achievement Unlocked!
                </h3>
              </div>

              <h4 className={`font-semibold ${getRarityColor(achievement.rarity)} text-sm mb-1`}>
                {achievement.title}
              </h4>

              <p className={`text-xs ${theme.textColors.secondary} mb-2`}>
                {achievement.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)} uppercase`}>
                  {achievement.rarity}
                </span>
                <span className={`text-xs ${theme.textColors.secondary}`}>
                  +{achievement.points} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions for triggering achievements
export const triggerCalculatorUsage = (calculatorId: string) => {
  // Mark that decimal.js precision was experienced
  if (calculatorId === 'paycheck-calculator') {
    localStorage.setItem('used-decimal-calculator', 'true');
  }
};

export const triggerPaycheckOptimization = (retirement401kPercent: number) => {
  if (retirement401kPercent >= 10) {
    localStorage.setItem('paycheck-401k-optimized', 'true');
  }
};

export const triggerTaxOptimization = (effectiveTaxRate: number) => {
  if (effectiveTaxRate < 20) {
    localStorage.setItem('tax-optimized', 'true');
  }
};

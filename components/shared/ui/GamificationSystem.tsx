'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  Star,
  Zap,
  Target,
  Crown,
  Flame,
  Calendar,
  BookOpen,
  Calculator,
  TrendingUp,
  Award,
  Sparkles,
  Lock,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { theme } from '@/lib/theme';
import InteractiveButton from './InteractiveButton';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'consistency' | 'mastery' | 'social' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  requirement: {
    type: 'lessons_completed' | 'quiz_score' | 'streak_days' | 'calculator_uses' | 'perfect_scores' | 'total_score' | 'time_spent';
    value: number;
    description: string;
  };
  unlocked: boolean;
  unlockedDate?: Date;
  progress: number;
  xpReward: number;
  rarity: number; // Percentage of users who have this achievement
}

interface UserStats {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  rank: string;
  streakDays: number;
  longestStreak: number;
  totalStudyTime: number;
  averageQuizScore: number;
  perfectScores: number;
  calculatorUses: number;
}

interface GamificationSystemProps {
  className?: string;
}

export default function GamificationSystem({ className = '' }: GamificationSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAchievementDetails, setShowAchievementDetails] = useState<string | null>(null);
  
  const userStats: UserStats = {
    level: 12,
    currentXP: 2840,
    xpToNextLevel: 3200,
    totalXP: 15840,
    rank: 'Financial Analyst',
    streakDays: 15,
    longestStreak: 28,
    totalStudyTime: 42.5,
    averageQuizScore: 87,
    perfectScores: 8,
    calculatorUses: 156,
  };

  const tierColors = {
    bronze: { bg: 'bg-amber-600/20', border: 'border-amber-600/40', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    silver: { bg: 'bg-slate-400/20', border: 'border-slate-400/40', text: 'text-slate-300', glow: 'shadow-slate-400/20' },
    gold: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    platinum: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    legendary: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  };

  const rankTiers = [
    { name: 'Finance Novice', minXP: 0, icon: BookOpen, color: 'text-slate-400' },
    { name: 'Budget Builder', minXP: 1000, icon: Calculator, color: 'text-amber-400' },
    { name: 'Money Manager', minXP: 3000, icon: TrendingUp, color: 'text-blue-400' },
    { name: 'Financial Analyst', minXP: 6000, icon: BarChart3, color: 'text-green-400' },
    { name: 'Investment Advisor', minXP: 10000, icon: Target, color: 'text-purple-400' },
    { name: 'Wealth Strategist', minXP: 15000, icon: Crown, color: 'text-pink-400' },
    { name: 'Financial Guru', minXP: 25000, icon: Sparkles, color: 'text-gradient-primary' },
  ];

  const categories = [
    { id: 'all', label: 'All Achievements' },
    { id: 'learning', label: 'Learning' },
    { id: 'consistency', label: 'Consistency' },
    { id: 'mastery', label: 'Mastery' },
    { id: 'social', label: 'Social' },
    { id: 'special', label: 'Special' },
  ];

  // Sample achievements
  const achievements: Achievement[] = [
    {
      id: 'first_lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      category: 'learning',
      tier: 'bronze',
      icon: BookOpen,
      requirement: { type: 'lessons_completed', value: 1, description: 'Complete 1 lesson' },
      unlocked: true,
      unlockedDate: new Date('2024-01-15'),
      progress: 100,
      xpReward: 100,
      rarity: 95,
    },
    {
      id: 'perfect_quiz',
      title: 'Perfect Score',
      description: 'Score 100% on a quiz',
      category: 'mastery',
      tier: 'silver',
      icon: Star,
      requirement: { type: 'perfect_scores', value: 1, description: 'Score 100% on any quiz' },
      unlocked: true,
      unlockedDate: new Date('2024-02-01'),
      progress: 100,
      xpReward: 250,
      rarity: 78,
    },
    {
      id: 'week_streak',
      title: 'Consistent Learner',
      description: 'Study for 7 consecutive days',
      category: 'consistency',
      tier: 'silver',
      icon: Calendar,
      requirement: { type: 'streak_days', value: 7, description: 'Study for 7 consecutive days' },
      unlocked: true,
      unlockedDate: new Date('2024-03-10'),
      progress: 100,
      xpReward: 300,
      rarity: 65,
    },
    {
      id: 'calculator_master',
      title: 'Calculator Master',
      description: 'Use calculators 100 times',
      category: 'learning',
      tier: 'gold',
      icon: Calculator,
      requirement: { type: 'calculator_uses', value: 100, description: 'Use calculators 100 times' },
      unlocked: true,
      unlockedDate: new Date('2024-07-15'),
      progress: 100,
      xpReward: 500,
      rarity: 42,
    },
    {
      id: 'quiz_champion',
      title: 'Quiz Champion',
      description: 'Achieve 90% average quiz score',
      category: 'mastery',
      tier: 'gold',
      icon: Trophy,
      requirement: { type: 'quiz_score', value: 90, description: 'Maintain 90% average quiz score' },
      unlocked: false,
      progress: 87,
      xpReward: 750,
      rarity: 28,
    },
    {
      id: 'month_streak',
      title: 'Dedication',
      description: 'Study for 30 consecutive days',
      category: 'consistency',
      tier: 'platinum',
      icon: Flame,
      requirement: { type: 'streak_days', value: 30, description: 'Study for 30 consecutive days' },
      unlocked: false,
      progress: 50,
      xpReward: 1000,
      rarity: 15,
    },
    {
      id: 'financial_guru',
      title: 'Financial Guru',
      description: 'Complete all lessons with perfect scores',
      category: 'mastery',
      tier: 'legendary',
      icon: Crown,
      requirement: { type: 'perfect_scores', value: 17, description: 'Score 100% on all 17 chapter quizzes' },
      unlocked: false,
      progress: 47,
      xpReward: 2500,
      rarity: 3,
    },
    {
      id: 'speed_learner',
      title: 'Speed Learner',
      description: 'Complete 5 lessons in one day',
      category: 'special',
      tier: 'platinum',
      icon: Zap,
      requirement: { type: 'lessons_completed', value: 5, description: 'Complete 5 lessons in a single day' },
      unlocked: false,
      progress: 60,
      xpReward: 800,
      rarity: 12,
    },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const getCurrentRank = () => {
    return rankTiers.reduce((prev, current) => 
      userStats.totalXP >= current.minXP ? current : prev
    );
  };

  const getNextRank = () => {
    return rankTiers.find(rank => rank.minXP > userStats.totalXP);
  };

  const calculateLevelProgress = () => {
    return (userStats.currentXP / userStats.xpToNextLevel) * 100;
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const Icon = achievement.icon;
    const tierStyle = tierColors[achievement.tier];
    
    return (
      <motion.div
        className={`relative ${theme.utils.glass()} p-4 sm:p-6 cursor-pointer group overflow-hidden ${
          achievement.unlocked ? '' : 'opacity-75'
        }`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowAchievementDetails(achievement.id)}
        layout
      >
        {/* Background glow for unlocked achievements */}
        {achievement.unlocked && (
          <motion.div
            className={`absolute inset-0 ${tierStyle.bg} opacity-10 rounded-xl`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Lock overlay for locked achievements */}
        {!achievement.unlocked && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <Lock className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.textColors.muted}`} />
          </div>
        )}

        {/* Achievement icon */}
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${tierStyle.bg} ${tierStyle.border} border-2 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${tierStyle.text}`} />
        </div>

        {/* Achievement details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`${theme.typography.heading6} ${theme.textColors.primary} text-sm sm:text-base`}>
              {achievement.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs ${tierStyle.bg} ${tierStyle.text} border ${tierStyle.border}`}>
              {achievement.tier.toUpperCase()}
            </span>
          </div>
          
          <p className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
            {achievement.description}
          </p>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className={`${theme.typography.caption} ${theme.textColors.muted} text-xs`}>
                Progress
              </span>
              <span className={`${theme.typography.caption} ${achievement.unlocked ? theme.status.success.text : theme.textColors.primary} text-xs`}>
                {achievement.unlocked ? 'Unlocked!' : `${Math.round(achievement.progress)}%`}
              </span>
            </div>
            
                          {!achievement.unlocked && (
              <div className={`w-full h-1 sm:h-1.5 ${theme.backgrounds.card} rounded-full overflow-hidden`}>
                <motion.div
                  className={`h-full ${tierStyle.bg} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 sm:pt-2">
            <div className="flex items-center gap-1">
              <Sparkles className={`w-3 h-3 sm:w-4 sm:h-4 ${theme.textColors.accent}`} />
              <span className={`${theme.typography.caption} ${theme.textColors.accent} text-xs`}>
                +{achievement.xpReward} XP
              </span>
            </div>
            <span className={`${theme.typography.caption} ${theme.textColors.muted} text-xs`}>
              {achievement.rarity}% have this
            </span>
          </div>
        </div>

        {/* Unlocked date badge */}
        {achievement.unlocked && achievement.unlockedDate && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.status.success.text}`} />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center px-4 sm:px-0">
        <h2 className={`${theme.textColors.primary} ${theme.typography.heading2} mb-2 flex items-center justify-center text-xl sm:text-2xl md:text-3xl`}>
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-amber-400" />
          Achievement System
        </h2>
        <p className={`${theme.textColors.tertiary} text-sm sm:text-base`}>
          Unlock achievements and level up your financial knowledge
        </p>
      </div>

      {/* User Level & Rank */}
      <motion.div
        className={`${theme.utils.glass('strong')} p-4 sm:p-6 mx-4 sm:mx-0`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Level Progress */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} text-lg sm:text-xl`}>
                Level {userStats.level}
              </h3>
              <span className={`${theme.typography.bodySmall} ${theme.textColors.secondary} text-xs sm:text-sm`}>
                {userStats.currentXP.toLocaleString()} / {userStats.xpToNextLevel.toLocaleString()} XP
              </span>
            </div>
            
            <div className="relative">
              <div className={`w-full h-3 sm:h-4 ${theme.backgrounds.card} rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-blue-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateLevelProgress()}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
              <span className={`absolute inset-0 flex items-center justify-center ${theme.typography.caption} font-bold text-white text-xs sm:text-sm`}>
                {Math.round(calculateLevelProgress())}%
              </span>
            </div>
          </div>

          {/* Current Rank */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {React.createElement(getCurrentRank().icon, {
                className: `w-6 h-6 sm:w-8 sm:h-8 ${getCurrentRank().color}`
              })}
              <div>
                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} text-lg sm:text-xl`}>
                  {getCurrentRank().name}
                </h3>
                {getNextRank() && (
                  <p className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
                    {(getNextRank()!.minXP - userStats.totalXP).toLocaleString()} XP to {getNextRank()!.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-0">
        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Flame className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.status.warning.text} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-lg sm:text-xl md:text-2xl`}>
            {userStats.streakDays}
          </div>
          <div className={`${theme.typography.caption} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
            Day Streak
          </div>
        </motion.div>

        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Star className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.status.success.text} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-lg sm:text-xl md:text-2xl`}>
            {userStats.averageQuizScore}%
          </div>
          <div className={`${theme.typography.caption} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
            Avg Quiz Score
          </div>
        </motion.div>

        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Clock className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.status.info.text} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-lg sm:text-xl md:text-2xl`}>
            {userStats.totalStudyTime}h
          </div>
          <div className={`${theme.typography.caption} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
            Study Time
          </div>
        </motion.div>

        <motion.div
          className={`${theme.utils.glass()} p-3 sm:p-4 text-center`}
          whileHover={{ scale: 1.02 }}
        >
          <Award className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.textColors.accent} mx-auto mb-1 sm:mb-2`} />
          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-lg sm:text-xl md:text-2xl`}>
            {achievements.filter(a => a.unlocked).length}
          </div>
          <div className={`${theme.typography.caption} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
            Achievements
          </div>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="px-4 sm:px-0 -mx-4 sm:mx-0">
        <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 px-4 sm:px-0 hide-scrollbar">
          {categories.map(category => {
            const isActive = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? theme.buttons.accent
                    : theme.buttons.ghost
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {category.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Achievements Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0"
        layout
      >
        <AnimatePresence>
          {filteredAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Achievement Details Modal */}
      <AnimatePresence>
        {showAchievementDetails && (
          <motion.div
            className={`fixed inset-0 ${theme.backgrounds.overlay} flex items-center justify-center p-4 z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAchievementDetails(null)}
          >
            <motion.div
              className={`${theme.backgrounds.modal} rounded-xl max-w-md w-full p-6`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const achievement = achievements.find(a => a.id === showAchievementDetails);
                if (!achievement) return null;

                const Icon = achievement.icon;
                const tierStyle = tierColors[achievement.tier];

                return (
                  <>
                    <div className="text-center mb-6">
                      <div className={`w-20 h-20 rounded-3xl ${tierStyle.bg} ${tierStyle.border} border-2 flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-10 h-10 ${tierStyle.text}`} />
                      </div>
                      <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-2`}>
                        {achievement.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${tierStyle.bg} ${tierStyle.text} border ${tierStyle.border}`}>
                        {achievement.tier.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <p className={`${theme.typography.body} ${theme.textColors.secondary} text-center text-sm sm:text-base`}>
                        {achievement.description}
                      </p>

                      <div className={`${theme.status.info.bg} rounded-lg p-3 sm:p-4`}>
                        <h4 className={`${theme.typography.label} ${theme.status.info.text} mb-1.5 sm:mb-2 text-sm sm:text-base`}>
                          Requirement
                        </h4>
                        <p className={`${theme.typography.bodySmall} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
                          {achievement.requirement.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="text-center">
                          <div className={`${theme.typography.heading4} ${theme.textColors.accent} text-lg sm:text-xl`}>
                            +{achievement.xpReward}
                          </div>
                          <div className={`${theme.typography.caption} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
                            XP Reward
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`${theme.typography.heading4} ${theme.textColors.primary} text-lg sm:text-xl`}>
                            {achievement.rarity}%
                          </div>
                          <div className={`${theme.typography.caption} ${theme.textColors.tertiary} text-xs sm:text-sm`}>
                            Rarity
                          </div>
                        </div>
                      </div>

                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className={`${theme.status.success.bg} rounded-lg p-3 sm:p-4 text-center`}>
                          <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.status.success.text} mx-auto mb-1.5 sm:mb-2`} />
                          <p className={`${theme.typography.bodySmall} ${theme.status.success.text} text-xs sm:text-sm`}>
                            Unlocked on {achievement.unlockedDate.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <InteractiveButton
                        variant="primary"
                        onClick={() => setShowAchievementDetails(null)}
                        fullWidth
                      >
                        Close
                      </InteractiveButton>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

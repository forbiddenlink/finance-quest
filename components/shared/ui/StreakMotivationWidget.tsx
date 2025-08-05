'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { Button } from '@/components/ui/button';
import {
  Flame,
  Zap,
  Star,
  Target,
  Calendar,
  Trophy,
  Shield,
  AlertTriangle,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  X
} from 'lucide-react';

interface StreakMotivationWidgetProps {
  size?: 'compact' | 'default' | 'expanded';
  showMotivation?: boolean;
  className?: string;
}

export default function StreakMotivationWidget({ 
  size = 'default', 
  showMotivation = true,
  className = '' 
}: StreakMotivationWidgetProps) {
  const {
    userProgress,
    getStreakMotivation,
    getPersonalizedEncouragement,
    getStudyRecommendation,
    useStreakFreeze
  } = useProgressStore();

  const [showDetails, setShowDetails] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [justUsedFreeze, setJustUsedFreeze] = useState(false);

  const streakMotivation = getStreakMotivation();
  const encouragement = getPersonalizedEncouragement();
  const recommendation = getStudyRecommendation();

  // Determine streak status colors and icons
  const getStreakDisplay = () => {
    const { streakDays } = userProgress;
    const { streakStatus } = streakMotivation;

    switch (streakStatus) {
      case 'building':
        return {
          icon: streakDays >= 30 ? Trophy : streakDays >= 14 ? Star : Flame,
          color: streakDays >= 30 ? 'text-amber-400' : streakDays >= 14 ? 'text-blue-400' : 'text-orange-400',
          bgColor: streakDays >= 30 ? 'bg-amber-500/20' : streakDays >= 14 ? 'bg-blue-500/20' : 'bg-orange-500/20',
          borderColor: streakDays >= 30 ? 'border-amber-500/40' : streakDays >= 14 ? 'border-blue-500/40' : 'border-orange-500/40',
          pulseColor: streakDays >= 30 ? 'shadow-amber-500/25' : streakDays >= 14 ? 'shadow-blue-500/25' : 'shadow-orange-500/25'
        };
      case 'maintaining':
        return {
          icon: Flame,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/40',
          pulseColor: 'shadow-green-500/25'
        };
      case 'at_risk':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/40',
          pulseColor: 'shadow-red-500/25'
        };
      case 'broken':
        return {
          icon: Target,
          color: 'text-slate-400',
          bgColor: 'bg-slate-500/20',
          borderColor: 'border-slate-500/40',
          pulseColor: 'shadow-slate-500/25'
        };
      default:
        return {
          icon: Flame,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/40',
          pulseColor: 'shadow-orange-500/25'
        };
    }
  };

  const streakDisplay = getStreakDisplay();
  const Icon = streakDisplay.icon;

  const handleStreakFreeze = () => {
    if (useStreakFreeze()) {
      setJustUsedFreeze(true);
      setTimeout(() => setJustUsedFreeze(false), 3000);
    }
  };

  if (size === 'compact') {
    return (
      <motion.div
        className={`flex items-center space-x-2 ${className}`}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setShowDetails(true)}
        onHoverEnd={() => setShowDetails(false)}
      >
        <div className={`relative w-8 h-8 ${streakDisplay.bgColor} ${streakDisplay.borderColor} border rounded-full flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${streakDisplay.color}`} />
          {streakMotivation.streakStatus === 'building' && userProgress.streakDays >= 7 && (
            <motion.div
              className={`absolute inset-0 rounded-full ${streakDisplay.bgColor}`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-bold ${theme.textColors.primary}`}>
            {userProgress.streakDays}
          </span>
          <span className={`text-xs ${theme.textColors.muted}`}>
            day{userProgress.streakDays !== 1 ? 's' : ''}
          </span>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              className={`absolute z-50 top-full left-0 mt-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-3 shadow-xl min-w-[200px]`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <p className={`text-xs ${theme.textColors.secondary} mb-2`}>
                {streakMotivation.message}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${theme.textColors.muted}`}>
                  Best: {userProgress.longestStreak} days
                </span>
                {streakMotivation.streakStatus === 'at_risk' && userProgress.streakFreezesUsed < 3 && (
                  <Button
                    size="sm"
                    onClick={handleStreakFreeze}
                    className="text-xs px-2 py-1"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Freeze
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border ${theme.borderColors.primary} rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`relative w-12 h-12 ${streakDisplay.bgColor} ${streakDisplay.borderColor} border-2 rounded-xl flex items-center justify-center ${streakDisplay.pulseColor} shadow-lg`}
            animate={streakMotivation.streakStatus === 'building' ? {
              scale: [1, 1.05, 1],
              boxShadow: [`0 0 0 0 ${streakDisplay.pulseColor}`, `0 0 0 10px transparent`]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className={`w-6 h-6 ${streakDisplay.color}`} />
            {userProgress.streakDays >= 7 && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-2 h-2 text-white" />
              </motion.div>
            )}
          </motion.div>

          <div>
            <motion.h3
              className={`text-xl font-bold ${theme.textColors.primary}`}
              key={userProgress.streakDays}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {userProgress.streakDays} Day{userProgress.streakDays !== 1 ? 's' : ''}
            </motion.h3>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Learning Streak {userProgress.longestStreak > userProgress.streakDays && (
                <span className={`${theme.textColors.muted} ml-1`}>
                  (Best: {userProgress.longestStreak})
                </span>
              )}
            </p>
          </div>
        </div>

        {size === 'expanded' && (
          <div className="flex items-center space-x-2">
            {streakMotivation.streakStatus === 'at_risk' && userProgress.streakFreezesUsed < 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <Button
                  onClick={handleStreakFreeze}
                  className={`${theme.status.warning.bg} ${theme.status.warning.text} hover:${theme.status.warning.bg}/80 text-sm`}
                  disabled={justUsedFreeze}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {justUsedFreeze ? 'Freeze Used!' : 'Use Streak Freeze'}
                </Button>
                <span className={`absolute -top-2 -right-2 ${theme.status.info.bg} text-xs px-1 rounded`}>
                  {3 - userProgress.streakFreezesUsed} left
                </span>
              </motion.div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEncouragement(!showEncouragement)}
              className={theme.buttons.ghost}
            >
              <Star className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Motivation Message */}
      {showMotivation && (
        <motion.div
          className={`${streakDisplay.bgColor} border ${streakDisplay.borderColor} rounded-lg p-4 mb-4`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
        >
          <p className={`text-sm ${theme.textColors.primary} font-medium mb-2`}>
            {streakMotivation.message}
          </p>
          
          {streakMotivation.suggestions.length > 0 && (
            <div className="space-y-1">
              {streakMotivation.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className={`w-1 h-1 ${streakDisplay.color} rounded-full`} />
                  <span className={`text-xs ${theme.textColors.secondary}`}>
                    {suggestion}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Study Recommendation */}
      {recommendation.priority !== 'low' && (
        <motion.div
          className={`${
            recommendation.priority === 'high' 
              ? theme.status.error.bg 
              : theme.status.warning.bg
          } border ${
            recommendation.priority === 'high'
              ? theme.status.error.border
              : theme.status.warning.border
          } rounded-lg p-3 mb-4`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start space-x-3">
            <Target className={`w-4 h-4 mt-0.5 ${
              recommendation.priority === 'high' 
                ? theme.status.error.text 
                : theme.status.warning.text
            }`} />
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                recommendation.priority === 'high' 
                  ? theme.status.error.text 
                  : theme.status.warning.text
              }`}>
                {recommendation.message}
              </p>
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                {recommendation.action}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Encouragement Panel */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <Sparkles className={`w-5 h-5 ${theme.status.success.text} flex-shrink-0 mt-0.5`} />
                <p className={`text-sm ${theme.status.success.text} font-medium`}>
                  {encouragement}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEncouragement(false)}
                className="p-1 hover:bg-white/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Milestones */}
      {size === 'expanded' && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className={`text-lg font-bold ${theme.textColors.primary}`}>
              {userProgress.weeklyProgress}
            </div>
            <div className={`text-xs ${theme.textColors.muted}`}>
              Weekly Goal
            </div>
            <div className={`w-full h-1 ${theme.backgrounds.card} rounded mt-1`}>
              <div 
                className={`h-full ${streakDisplay.color.replace('text-', 'bg-')} rounded transition-all duration-500`}
                style={{ width: `${Math.min(100, (userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className={`text-lg font-bold ${theme.textColors.primary}`}>
              {Math.round(userProgress.learningAnalytics.averageQuizScore)}%
            </div>
            <div className={`text-xs ${theme.textColors.muted}`}>
              Quiz Average
            </div>
            <div className="flex justify-center mt-1">
              {userProgress.learningAnalytics.averageQuizScore >= 90 ? (
                <Trophy className="w-3 h-3 text-amber-400" />
              ) : userProgress.learningAnalytics.averageQuizScore >= 80 ? (
                <Star className="w-3 h-3 text-blue-400" />
              ) : (
                <Target className="w-3 h-3 text-slate-400" />
              )}
            </div>
          </div>

          <div className="text-center">
            <div className={`text-lg font-bold ${theme.textColors.primary}`}>
              {userProgress.userLevel}
            </div>
            <div className={`text-xs ${theme.textColors.muted}`}>
              Level
            </div>
            <div className="flex justify-center mt-1">
              <Award className={`w-3 h-3 ${streakDisplay.color}`} />
            </div>
          </div>
        </div>
      )}

      {/* Freeze Status */}
      {userProgress.streakFreezesUsed > 0 && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Shield className={`w-4 h-4 ${theme.textColors.muted}`} />
          <span className={`text-xs ${theme.textColors.muted}`}>
            {userProgress.streakFreezesUsed}/3 freezes used this month
          </span>
        </div>
      )}
    </motion.div>
  );
}

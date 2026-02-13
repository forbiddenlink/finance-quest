'use client';

import { motion } from 'framer-motion';
import { useEnhancedProgress } from '@/lib/store/progressHooks';
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  Calculator,
  BarChart3,
  Brain,
  CheckCircle,
  AlertTriangle,
  Zap,
  Star
} from 'lucide-react';
import React from 'react';
import AnimatedCounter from '@/components/shared/ui/AnimatedCounter';
import StreakFreezeCard from '@/components/shared/ui/StreakFreezeCard';

export default function ProgressPage() {
  const progress = useEnhancedProgress();

  // Calculate learning velocity (lessons per week)
  const learningVelocity = progress.totalLessonsCompleted > 0
    ? Math.round((progress.totalLessonsCompleted / Math.max(progress.currentStreak, 1)) * 7 * 10) / 10
    : 0;

  // Progress breakdown data for charts
  const chapterProgressData = [
    { chapter: 'Ch 1', progress: progress.getChapterProgress(1), name: 'Money Fundamentals' },
    { chapter: 'Ch 2', progress: progress.getChapterProgress(2), name: 'Banking Basics' },
    { chapter: 'Ch 3', progress: progress.getChapterProgress(3), name: 'Income & Career' },
    { chapter: 'Ch 4', progress: progress.getChapterProgress(4), name: 'Credit & Debt' },
    { chapter: 'Ch 5', progress: progress.getChapterProgress(5), name: 'Emergency Funds' }
  ];

  const achievements = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Completed your first lesson',
      unlocked: progress.totalLessonsCompleted >= 1,
      icon: BookOpen,
      color: theme.textColors.primary
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Passed 3 quizzes with 80%+',
      unlocked: progress.totalQuizzesTaken >= 3 && progress.averageQuizScore >= 80,
      icon: Brain,
      color: theme.textColors.primary
    },
    {
      id: 'calculator-pro',
      title: 'Calculator Pro',
      description: 'Used all 6 financial calculators',
      unlocked: Object.keys(progress.userProgress.calculatorUsage).length >= 6,
      icon: Calculator,
      color: theme.status.success.text
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: '7-day learning streak',
      unlocked: progress.currentStreak >= 7,
      icon: Zap,
      color: theme.status.warning.text
    },
    {
      id: 'financial-literacy',
      title: 'Financially Literate',
      description: 'Financial Literacy Score over 500',
      unlocked: progress.userProgress.financialLiteracyScore >= 500,
      icon: Star,
      color: theme.textColors.primary
    }
  ];

  const nextAction = progress.getRecommendedNextAction();

  return (
    <div className={`${theme.backgrounds.primary} p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-2`}>Your Financial Learning Journey</h1>
          <p className={`text-xl ${theme.textColors.secondary}`}>Track your progress toward financial mastery</p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Financial Literacy Score</p>
                <p className={`text-3xl font-bold ${theme.textColors.primary}`}>
                  <AnimatedCounter end={progress.userProgress.financialLiteracyScore} />
                </p>
                <p className={`text-xs ${theme.textColors.muted}`}>out of 1000</p>
              </div>
              <div className={`p-3 ${theme.status.warning.bg} rounded-lg`}>
                <BarChart3 className={`w-8 h-8 ${theme.status.warning.text}`} />
              </div>
            </div>
          </div>

          <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Lessons Completed</p>
                <p className={`text-3xl font-bold ${theme.textColors.primary}`}>
                  <AnimatedCounter end={progress.totalLessonsCompleted} />
                </p>
                <p className={`text-xs ${theme.textColors.muted}`}>out of 20 available</p>
              </div>
              <div className={`p-3 ${theme.status.warning.bg} rounded-lg`}>
                <BookOpen className={`w-8 h-8 ${theme.textColors.primary}`} />
              </div>
            </div>
          </div>

          <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Average Quiz Score</p>
                <p className={`text-3xl font-bold ${theme.textColors.secondary}`}>
                  <AnimatedCounter end={Math.round(progress.averageQuizScore)} />%
                </p>
                <p className={`text-xs ${theme.textColors.muted}`}>{progress.totalQuizzesTaken} quizzes taken</p>
              </div>
              <div className={`p-3 ${theme.backgrounds.cardDisabled} rounded-lg`}>
                <Brain className={`w-8 h-8 ${theme.textColors.secondary}`} />
              </div>
            </div>
          </div>

          <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Current Streak</p>
                <p className={`text-3xl font-bold ${theme.textColors.primary}`}>
                  <AnimatedCounter end={progress.currentStreak} />
                </p>
                <p className={`text-xs ${theme.textColors.muted}`}>days active</p>
              </div>
              <div className={`p-3 ${theme.status.warning.bg} rounded-lg`}>
                <Zap className={`w-8 h-8 ${theme.textColors.primary}`} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chapter Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}
            >
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-6`}>Chapter Progress</h3>
              <div className="space-y-4">
                {chapterProgressData.map((chapter, index) => (
                  <div key={chapter.chapter} className="flex items-center gap-4">
                    <div className={`w-16 text-sm font-medium ${theme.textColors.secondary}`}>
                      {chapter.chapter}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${theme.textColors.primary}`}>{chapter.name}</span>
                        <span className={`text-sm ${theme.textColors.secondary}`}>{chapter.progress}%</span>
                      </div>
                      <div className={`w-full ${theme.backgrounds.cardDisabled} rounded-full h-2`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${chapter.progress}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                          className="bg-gradient-to-r from-amber-500 to-blue-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Learning Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}
            >
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-6`}>Learning Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Clock className={`w-8 h-8 mx-auto mb-2 ${theme.status.info.text}`} />
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>{progress.totalTimeSpentHours}h</div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Total Time</div>
                </div>
                <div className="text-center">
                  <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>{learningVelocity}</div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Lessons/Week</div>
                </div>
                <div className="text-center">
                  <Calculator className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.secondary}`} />
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                    {Object.keys(progress.userProgress.calculatorUsage).length}/6
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Tools Used</div>
                </div>
                <div className="text-center">
                  <Award className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                    {achievements.filter(a => a.unlocked).length}/{achievements.length}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Achievements</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Streak Freeze */}
            <StreakFreezeCard />

            {/* Next Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`bg-gradient-to-r ${theme.status.warning.bg} ${theme.status.info.bg} border ${theme.status.warning.border} backdrop-blur-xl rounded-xl shadow-lg p-6 ${theme.textColors.primary}`}
            >
              <h3 className="text-lg font-bold mb-4">Next Recommended Action</h3>
              <div className="flex items-start gap-3">
                <Target className={`w-6 h-6 mt-1 flex-shrink-0 ${theme.textColors.primary}`} />
                <div>
                  <p className={`font-medium mb-1 ${theme.textColors.primary}`}>{nextAction.message}</p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>{nextAction.action}</p>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}
            >
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-6`}>Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${achievement.unlocked
                        ? `${theme.status.warning.bg} border ${theme.status.warning.border}`
                        : `${theme.backgrounds.cardDisabled} border ${theme.borderColors.primary}`
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${achievement.unlocked ? theme.status.warning.bg : theme.backgrounds.cardDisabled
                        }`}>
                        <Icon className={`w-5 h-5 ${achievement.unlocked ? theme.textColors.primary : theme.textColors.muted}
                          }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${achievement.unlocked ? theme.textColors.primary : theme.textColors.muted}
                          }`}>
                          {achievement.title}
                        </p>
                        <p className={`text-xs ${achievement.unlocked ? theme.textColors.secondary : theme.textColors.muted
                          }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle className={`w-5 h-5 ${theme.textColors.primary}`} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Areas for Improvement */}
            {progress.userProgress.strugglingTopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`${theme.status.warning.bg} border ${theme.status.warning.border} backdrop-blur-xl rounded-xl shadow-lg p-6`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text}`} />
                  <h3 className={`text-lg font-bold ${theme.status.warning.text}`}>Focus Areas</h3>
                </div>
                <div className="space-y-2">
                  {progress.userProgress.strugglingTopics.map((topic, index) => (
                    <div key={index} className={`text-sm ${theme.status.warning.text} ${theme.status.warning.bg} rounded-lg px-3 py-2`}>
                      Review: {topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

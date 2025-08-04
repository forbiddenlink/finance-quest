import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  Clock, 
  Brain, 
  Calculator, 
  BookOpen,
  BarChart3,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme, getGradientClass, getConsistentCardClasses } from '@/lib/theme';

interface AnalyticsDashboardProps {
  className?: string;
}

export const AdvancedProgressDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const { userProgress } = useProgressStore();

  // Calculate advanced metrics based on existing progress data
  const analytics = useMemo(() => {
    const quizScores = Object.values(userProgress.quizScores);
    const avgQuizScore = quizScores.length > 0 ? 
      quizScores.reduce((sum: number, score: number) => sum + score, 0) / quizScores.length : 0;
    
    const calculatorUsage = userProgress.calculatorUsage || {};
    const mostUsedCalculator = Object.entries(calculatorUsage)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    
    const totalCalculatorSessions = Object.values(calculatorUsage)
      .reduce((sum: number, count: number) => sum + count, 0);
    
    // Calculate mastery based on quiz scores and completed lessons
    const masteredTopics = userProgress.learningAnalytics.conceptsMastered?.length || 0;
    const strugglingTopics = userProgress.strugglingTopics?.length || 0;
    
    // Estimate learning velocity (lessons per hour)
    const learningVelocity = userProgress.totalTimeSpent > 0 ? 
      userProgress.completedLessons.length / (userProgress.totalTimeSpent / 3600) : 0;
    
    return {
      avgQuizScore: Math.round(avgQuizScore),
      mostUsedCalculator,
      totalCalculatorSessions,
      masteredTopics,
      strugglingTopics,
      learningVelocity: Math.round(learningVelocity * 10) / 10, // round to 1 decimal
      totalStudyHours: Math.round(userProgress.totalTimeSpent / 3600),
      completionRate: userProgress.learningAnalytics.lessonCompletionRate || 0,
      currentStreak: userProgress.streakDays || 0,
      achievements: userProgress.achievements?.length || 0
    };
  }, [userProgress]);

  // Calculate performance trend based on recent quiz scores
  const performanceTrend = useMemo(() => {
    const quizEntries = Object.entries(userProgress.quizScores);
    if (quizEntries.length < 3) return 'stable';
    
    // Get recent vs older quiz scores (simplified)
    const sortedQuizzes = quizEntries.sort(([a], [b]) => a.localeCompare(b));
    const recent = sortedQuizzes.slice(-3);
    const older = sortedQuizzes.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, [, score]) => sum + score, 0) / recent.length;
    const olderAvg = older.reduce((sum, [, score]) => sum + score, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }, [userProgress.quizScores]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`space-y-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={cardVariants}>
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>
          Advanced Learning Analytics
        </h2>
        <p className={`${theme.textColors.secondary} ${theme.typography.body}`}>
          Deep insights into your financial education journey
        </p>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={cardVariants}
      >
        {/* Financial Literacy Score */}
        <div className={`${getConsistentCardClasses()} p-6 text-center`}>
          <div className={`w-16 h-16 mx-auto mb-4 ${getGradientClass('primaryBlue', 'to-br')} rounded-full flex items-center justify-center`}>
            <Star className="w-8 h-8 text-white" />
          </div>
          <div className={`${theme.typography.heading3} ${theme.textColors.primary}`}>
            {userProgress.financialLiteracyScore}
          </div>
          <p className={`${theme.textColors.secondary} text-sm`}>Literacy Score</p>
          <div className="mt-2 flex items-center justify-center">
            {performanceTrend === 'improving' && (
              <>
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-xs">Improving</span>
              </>
            )}
            {performanceTrend === 'declining' && (
              <>
                <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                <span className="text-red-400 text-xs">Needs Focus</span>
              </>
            )}
            {performanceTrend === 'stable' && (
              <span className="text-slate-400 text-xs">Stable Progress</span>
            )}
          </div>
        </div>

        {/* Current Streak */}
        <div className={`${getConsistentCardClasses()} p-6 text-center`}>
          <div className={`w-16 h-16 mx-auto mb-4 ${getGradientClass('primarySuccess', 'to-br')} rounded-full flex items-center justify-center`}>
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className={`${theme.typography.heading3} ${theme.textColors.primary}`}>
            {analytics.currentStreak}
          </div>
          <p className={`${theme.textColors.secondary} text-sm`}>Day Streak</p>
          <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
            {analytics.achievements} achievements
          </p>
        </div>

        {/* Mastered Topics */}
        <div className={`${getConsistentCardClasses()} p-6 text-center`}>
          <div className={`w-16 h-16 mx-auto mb-4 ${getGradientClass('primaryWarning', 'to-br')} rounded-full flex items-center justify-center`}>
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className={`${theme.typography.heading3} ${theme.textColors.primary}`}>
            {analytics.masteredTopics}
          </div>
          <p className={`${theme.textColors.secondary} text-sm`}>Mastered Topics</p>
          <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
            {analytics.strugglingTopics} need work
          </p>
        </div>

        {/* Study Time */}
        <div className={`${getConsistentCardClasses()} p-6 text-center`}>
          <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center`}>
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className={`${theme.typography.heading3} ${theme.textColors.primary}`}>
            {analytics.totalStudyHours}h
          </div>
          <p className={`${theme.textColors.secondary} text-sm`}>Total Study Time</p>
          <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
            {analytics.learningVelocity} lessons/hr
          </p>
        </div>
      </motion.div>

      {/* Detailed Analytics Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={cardVariants}
      >
        {/* Learning Progress Chart */}
        <div className={`${getConsistentCardClasses()} p-6`}>
          <div className="flex items-center mb-4">
            <BarChart3 className={`w-5 h-5 ${theme.textColors.primary} mr-2`} />
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>
              Learning Progress
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Chapter Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`${theme.textColors.secondary} text-sm`}>Chapters Completed</span>
                <span className={`${theme.textColors.primary} font-semibold`}>
                  {userProgress.currentChapter - 1}/17
                </span>
              </div>
              <div className={`w-full ${theme.backgrounds.card} rounded-full h-2`}>
                <motion.div 
                  className={`${getGradientClass('primaryBlue')} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((userProgress.currentChapter - 1) / 17) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Quiz Average */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`${theme.textColors.secondary} text-sm`}>Quiz Average</span>
                <span className={`${theme.textColors.primary} font-semibold`}>
                  {analytics.avgQuizScore}%
                </span>
              </div>
              <div className={`w-full ${theme.backgrounds.card} rounded-full h-2`}>
                <motion.div 
                  className={`${getGradientClass('primarySuccess')} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${analytics.avgQuizScore}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>

            {/* Lesson Completion Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className={`${theme.textColors.secondary} text-sm`}>Completion Rate</span>
                <span className={`${theme.textColors.primary} font-semibold`}>
                  {Math.round(analytics.completionRate)}%
                </span>
              </div>
              <div className={`w-full ${theme.backgrounds.card} rounded-full h-2`}>
                <motion.div 
                  className={`${getGradientClass('primaryWarning')} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${analytics.completionRate}%` }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tools & Engagement */}
        <div className={`${getConsistentCardClasses()} p-6`}>
          <div className="flex items-center mb-4">
            <Brain className={`w-5 h-5 ${theme.textColors.primary} mr-2`} />
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>
              Tools & Engagement
            </h3>
          </div>

          <div className="space-y-4">
            {/* Calculator Usage */}
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Calculator className={`w-4 h-4 ${theme.textColors.primary} mr-2`} />
                  <span className={`${theme.textColors.primary} font-medium text-sm`}>
                    Calculator Usage
                  </span>
                </div>
                <span className={`${theme.textColors.secondary} text-xs`}>
                  {analytics.totalCalculatorSessions} sessions
                </span>
              </div>
              <p className={`text-xs ${theme.textColors.secondary}`}>
                Most used: {analytics.mostUsedCalculator}
              </p>
            </div>

            {/* Recent Lessons */}
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <BookOpen className={`w-4 h-4 ${theme.textColors.primary} mr-2`} />
                  <span className={`${theme.textColors.primary} font-medium text-sm`}>
                    Lessons Completed
                  </span>
                </div>
                <span className={`${theme.textColors.secondary} text-xs`}>
                  {userProgress.completedLessons.length} total
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {userProgress.completedLessons.slice(-5).map((lesson: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                  >
                    {lesson.split('-').slice(-1)[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Quiz Performance */}
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Target className={`w-4 h-4 ${theme.textColors.primary} mr-2`} />
                  <span className={`${theme.textColors.primary} font-medium text-sm`}>
                    Quiz Performance
                  </span>
                </div>
                <span className={`${theme.textColors.secondary} text-xs`}>
                  {Object.keys(userProgress.quizScores).length} completed
                </span>
              </div>
              <div className="text-xs">
                <span className={`${theme.textColors.secondary}`}>Average: </span>
                <span className={`${analytics.avgQuizScore >= 80 ? 'text-green-400' : analytics.avgQuizScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {analytics.avgQuizScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Struggling Topics & Recommendations */}
      {(userProgress.strugglingTopics.length > 0 || userProgress.learningAnalytics.areasNeedingWork.length > 0) && (
        <motion.div variants={cardVariants} className={`${getConsistentCardClasses()} p-6`}>
          <div className="flex items-center mb-4">
            <Users className={`w-5 h-5 ${theme.textColors.primary} mr-2`} />
            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>
              Areas for Improvement
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Struggling Topics */}
            {userProgress.strugglingTopics.slice(0, 4).map((topic: string, index: number) => (
              <div key={index} className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h4 className={`${theme.textColors.primary} font-medium text-sm mb-1`}>
                      Review {topic}
                    </h4>
                    <p className={`${theme.textColors.secondary} text-xs`}>
                      Focus on strengthening your understanding of this concept
                    </p>
                    <div className="mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-300">
                        needs work
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Areas Needing Work */}
            {userProgress.learningAnalytics.areasNeedingWork?.slice(0, 2).map((area: string, index: number) => (
              <div key={`area-${index}`} className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">?</span>
                  </div>
                  <div>
                    <h4 className={`${theme.textColors.primary} font-medium text-sm mb-1`}>
                      Improve {area}
                    </h4>
                    <p className={`${theme.textColors.secondary} text-xs`}>
                      Practice exercises and review materials for this topic
                    </p>
                    <div className="mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300">
                        practice needed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

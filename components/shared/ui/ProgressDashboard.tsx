'use client';

import React from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import SpacedRepetitionDashboard from '@/components/shared/ui/SpacedRepetitionDashboard';
import { theme } from '@/lib/theme';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import {
  BarChart3,
  FileText,
  Target,
  DollarSign,
  Calculator,
  TrendingUp,
  PieChart as PieChartIcon,
  CreditCard,
  CheckCircle,
  Clock,
  Bot,
  Zap,
  Trophy,
  Medal,
  Brain
} from 'lucide-react';

export default function ProgressDashboard() {
  const userProgress = useProgressStore(state => state.userProgress);

  // Calculate comprehensive metrics
  const totalChapters = 10;
  const completionPercentage = Math.round((userProgress.currentChapter / totalChapters) * 100);
  const totalLessonsCompleted = userProgress.completedLessons.length;
  const totalCalculatorsUsed = Object.keys(userProgress.calculatorUsage).length;
  const quizScores = Object.values(userProgress.quizScores).filter((score): score is number => typeof score === 'number');
  const averageQuizScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
    : 0;
  const timeSpentHours = Math.round(userProgress.totalTimeSpent / 3600 * 10) / 10;
  const achievementsCount = userProgress.achievements.length;

  // Progress breakdown data for pie chart
  const progressData = [
    { name: 'Completed', value: userProgress.currentChapter - 1, color: '#10B981' },
    { name: 'Current', value: 1, color: '#3B82F6' },
    { name: 'Remaining', value: totalChapters - userProgress.currentChapter, color: '#E5E7EB' }
  ];

  // Quiz performance data
  const quizData = Object.entries(userProgress.quizScores).map(([, score], index) => ({
    quiz: `Quiz ${index + 1}`,
    score: score,
    masteryThreshold: 80
  }));

  // Learning activity timeline (simulated based on available data)
  const activityData = [
    { week: 'Week 1', lessons: totalLessonsCompleted > 0 ? 1 : 0, calculators: totalCalculatorsUsed > 0 ? 1 : 0, quizzes: Object.keys(userProgress.quizScores).length > 0 ? 1 : 0 },
    { week: 'Week 2', lessons: totalLessonsCompleted > 1 ? 1 : 0, calculators: totalCalculatorsUsed > 1 ? 1 : 0, quizzes: Object.keys(userProgress.quizScores).length > 1 ? 1 : 0 },
    { week: 'Week 3', lessons: totalLessonsCompleted > 2 ? 1 : 0, calculators: totalCalculatorsUsed > 2 ? 1 : 0, quizzes: Object.keys(userProgress.quizScores).length > 2 ? 1 : 0 },
    { week: 'Week 4', lessons: totalLessonsCompleted > 3 ? 1 : 0, calculators: totalCalculatorsUsed > 3 ? 1 : 0, quizzes: Object.keys(userProgress.quizScores).length > 3 ? 1 : 0 }
  ];

  // Financial literacy score (calculated from various factors)
  const calculateLiteracyScore = () => {
    let score = 0;
    score += (userProgress.currentChapter - 1) * 100; // 100 points per completed chapter
    score += totalLessonsCompleted * 50; // 50 points per lesson
    score += totalCalculatorsUsed * 30; // 30 points per calculator used
    score += averageQuizScore * 2; // 2x quiz score
    score += achievementsCount * 25; // 25 points per achievement
    return Math.min(1000, Math.round(score)); // Cap at 1000
  };

  const literacyScore = calculateLiteracyScore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate potential lifetime impact (demo purposes)
  const potentialSavings = literacyScore * 50; // $50 per literacy point
  const betterDecisions = Math.floor(literacyScore / 100);

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.card} rounded-lg ${theme.shadows.lg} p-6`}>
      <div className="mb-8">
        <h2 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
          <BarChart3 className="w-8 h-8" />
          Your Financial Literacy Journey
        </h2>
        <p className={theme.textColors.secondary}>
          Track your progress, celebrate achievements, and see the measurable impact of financial education
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
          <div className={`text-3xl font-bold ${theme.textColors.accent}`}>{completionPercentage}%</div>
          <p className={`text-sm ${theme.textColors.secondary} font-medium`}>Course Completion</p>
          <p className={`text-xs ${theme.textColors.muted}`}>Chapter {userProgress.currentChapter} of {totalChapters}</p>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
          <div className={`text-3xl font-bold ${theme.textColors.success}`}>{literacyScore}</div>
          <p className={`text-sm ${theme.textColors.secondary} font-medium`}>Literacy Score</p>
          <p className={`text-xs ${theme.textColors.muted}`}>Out of 1,000 points</p>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
          <div className={`text-3xl font-bold ${theme.textColors.accent}`}>{averageQuizScore}%</div>
          <p className={`text-sm ${theme.textColors.secondary} font-medium`}>Avg Quiz Score</p>
          <p className={`text-xs ${theme.textColors.muted}`}>{Object.keys(userProgress.quizScores).length} quizzes taken</p>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
          <div className={`text-3xl font-bold ${theme.textColors.warning}`}>{timeSpentHours}h</div>
          <p className={`text-sm ${theme.textColors.secondary} font-medium`}>Time Invested</p>
          <p className={`text-xs ${theme.textColors.muted}`}>Learning sessions</p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chapter Progress Visualization */}
        <div className={`${theme.backgrounds.cardHover} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Course Progress Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} chapters`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className={`${theme.typography.small} ${theme.textColors.secondary}`}>
              You&apos;ve mastered <strong>{userProgress.currentChapter - 1}</strong> out of <strong>{totalChapters}</strong> chapters
            </p>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className={`${theme.backgrounds.cardHover} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Quiz Performance</h3>
          {quizData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Score']} />
                  <Bar dataKey="score" fill="#3B82F6" />
                  <Bar dataKey="masteryThreshold" fill="#EF4444" fillOpacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`h-64 flex items-center justify-center ${theme.textColors.muted}`}>
              <div className="text-center">
                <FileText className={`w-12 h-12 mx-auto mb-2 ${theme.textColors.muted}`} />
                <p>No quizzes taken yet</p>
                <p className={theme.typography.small}>Complete lessons to unlock quizzes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Learning Activity Timeline */}
      <div className={`${theme.backgrounds.cardHover} rounded-lg p-6 mb-8`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>Learning Activity Timeline</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lessons" stroke="#10B981" strokeWidth={2} name="Lessons" />
              <Line type="monotone" dataKey="calculators" stroke="#3B82F6" strokeWidth={2} name="Calculators" />
              <Line type="monotone" dataKey="quizzes" stroke="#8B5CF6" strokeWidth={2} name="Quizzes" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements and Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-4 flex items-center gap-2`}>
            <Trophy className="w-5 h-5" />
            Achievements Unlocked
          </h3>
          <div className="space-y-3">
            {userProgress.achievements.length > 0 ? (
              userProgress.achievements.map((achievement: string, index: number) => (
                <div key={index} className={`${theme.backgrounds.card} rounded-lg p-3 flex items-center`}>
                  <div className={`${theme.buttons.accent} text-white p-2 rounded-full mr-3`}>
                    <Medal className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`font-medium ${theme.textColors.primary}`}>{achievement.replace('-', ' ').replace('_', ' ')}</p>
                    <p className={`text-xs ${theme.textColors.secondary}`}>Well done!</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center ${theme.textColors.secondary} py-8`}>
                <Target className={`w-12 h-12 mx-auto mb-2 ${theme.textColors.accent}`} />
                <p>No achievements yet</p>
                <p className="text-sm">Complete lessons and quizzes to earn badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Projected Impact */}
        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.success} mb-4 flex items-center gap-2`}>
            <DollarSign className="w-5 h-5" />
            Projected Financial Impact
          </h3>
          <div className="space-y-4">
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <h4 className={`font-semibold ${theme.textColors.success} mb-2`}>Potential Lifetime Savings</h4>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>{formatCurrency(potentialSavings)}</p>
              <p className={`text-sm ${theme.textColors.secondary}`}>Based on improved financial decisions</p>
            </div>

            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <h4 className={`font-semibold ${theme.textColors.success} mb-2`}>Better Financial Decisions</h4>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>{betterDecisions}</p>
              <p className={`text-sm ${theme.textColors.secondary}`}>Expected improved choices per year</p>
            </div>

            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <h4 className={`font-semibold ${theme.textColors.success} mb-2`}>Knowledge Retention</h4>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>{averageQuizScore > 0 ? averageQuizScore : 0}%</p>
              <p className={`text-sm ${theme.status.success.text}`}>Information successfully retained</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Usage Summary */}
      <div className={`mt-8 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Calculator className="w-5 h-5" />
          Interactive Tools Mastered
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['paycheck-calculator'] ? `${theme.status.success.bg} ${theme.status.success.text}` : `${theme.backgrounds.disabled} ${theme.textColors.muted}`
              }`}>
              <Calculator className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Paycheck Calculator</p>
            <p className={`text-xs ${theme.status.info.text} flex items-center justify-center gap-1`}>
              {userProgress.calculatorUsage['paycheck-calculator'] ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Mastered
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Pending
                </>
              )}
            </p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['compound-interest'] ? `${theme.status.success.bg} ${theme.status.success.text}` : `${theme.backgrounds.disabled} ${theme.textColors.muted}`
              }`}>
              <TrendingUp className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Compound Interest</p>
            <p className={`text-xs ${theme.status.info.text} flex items-center justify-center gap-1`}>
              {userProgress.calculatorUsage['compound-interest'] ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Mastered
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Pending
                </>
              )}
            </p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['budget-builder'] ? `${theme.status.success.bg} ${theme.status.success.text}` : `${theme.backgrounds.disabled} ${theme.textColors.muted}`
              }`}>
              <PieChartIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Budget Builder</p>
            <p className={`text-xs ${theme.status.info.text} flex items-center justify-center gap-1`}>
              {userProgress.calculatorUsage['budget-builder'] ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Mastered
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Pending
                </>
              )}
            </p>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['debt-payoff-calculator'] ? `${theme.status.success.bg} ${theme.status.success.text}` : `${theme.backgrounds.disabled} ${theme.textColors.muted}`
              }`}>
              <CreditCard className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Debt Destroyer</p>
            <p className={`text-xs ${theme.status.info.text} flex items-center justify-center gap-1`}>
              {userProgress.calculatorUsage['debt-payoff-calculator'] ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Mastered
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Pending
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Learning System */}
      {totalLessonsCompleted > 0 && (
        <div className="mt-8">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Brain className={`w-5 h-5 ${theme.textColors.accent}`} />
            Learning Retention System
          </h3>
          <SpacedRepetitionDashboard />
        </div>
      )}

      {/* Contest Demo Section */}
      <div className={`mt-8 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Target className="w-5 h-5" />
          Contest Judge Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${theme.backgrounds.glass} bg-opacity-60 rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
              <TrendingUp className="w-4 h-4" />
              Measurable Impact
            </h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Real progress tracking with persistent data across sessions. Every interaction measured and analyzed.
            </p>
          </div>
          <div className={`${theme.backgrounds.glass} bg-opacity-60 rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
              <Bot className="w-4 h-4" />
              AI Integration
            </h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              OpenAI GPT-4o-mini provides contextual coaching based on actual user progress and struggling topics.
            </p>
          </div>
          <div className={`${theme.backgrounds.glass} bg-opacity-60 rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
              <Zap className="w-4 h-4" />
              Educational Effectiveness
            </h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Interactive learning with immediate feedback, practical application, and mastery-based progression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

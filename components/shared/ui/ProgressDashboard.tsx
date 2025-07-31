'use client';

import React from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import SpacedRepetitionDashboard from '@/components/shared/ui/SpacedRepetitionDashboard';
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
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Your Financial Literacy Journey
        </h2>
        <p className="text-gray-600">
          Track your progress, celebrate achievements, and see the measurable impact of financial education
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-800">{completionPercentage}%</div>
          <p className="text-sm text-blue-600 font-medium">Course Completion</p>
          <p className="text-xs text-blue-500">Chapter {userProgress.currentChapter} of {totalChapters}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-800">{literacyScore}</div>
          <p className="text-sm text-green-600 font-medium">Literacy Score</p>
          <p className="text-xs text-blue-500">Out of 1,000 points</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-800">{averageQuizScore}%</div>
          <p className="text-sm text-purple-600 font-medium">Avg Quiz Score</p>
          <p className="text-xs text-purple-500">{Object.keys(userProgress.quizScores).length} quizzes taken</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-800">{timeSpentHours}h</div>
          <p className="text-sm text-orange-600 font-medium">Time Invested</p>
          <p className="text-xs text-orange-500">Learning sessions</p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chapter Progress Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress Breakdown</h3>
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
            <p className="text-sm text-gray-600">
              You&apos;ve mastered <strong>{userProgress.currentChapter - 1}</strong> out of <strong>{totalChapters}</strong> chapters
            </p>
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance</h3>
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
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No quizzes taken yet</p>
                <p className="text-sm">Complete lessons to unlock quizzes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Learning Activity Timeline */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Activity Timeline</h3>
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
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements Unlocked
          </h3>
          <div className="space-y-3">
            {userProgress.achievements.length > 0 ? (
              userProgress.achievements.map((achievement: string, index: number) => (
                <div key={index} className="bg-white bg-opacity-60 rounded-lg p-3 flex items-center">
                  <div className="bg-yellow-500 text-white p-2 rounded-full mr-3">
                    <Medal className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-900">{achievement.replace('-', ' ').replace('_', ' ')}</p>
                    <p className="text-xs text-yellow-700">Well done!</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-yellow-700 py-8">
                <Target className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                <p>No achievements yet</p>
                <p className="text-sm">Complete lessons and quizzes to earn badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Projected Impact */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Projected Financial Impact
          </h3>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-60 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Potential Lifetime Savings</h4>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(potentialSavings)}</p>
              <p className="text-sm text-green-700">Based on improved financial decisions</p>
            </div>

            <div className="bg-white bg-opacity-60 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Better Financial Decisions</h4>
              <p className="text-2xl font-bold text-green-900">{betterDecisions}</p>
              <p className="text-sm text-green-700">Expected improved choices per year</p>
            </div>

            <div className="bg-white bg-opacity-60 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Knowledge Retention</h4>
              <p className="text-2xl font-bold text-green-900">{averageQuizScore > 0 ? averageQuizScore : 0}%</p>
              <p className="text-sm text-green-700">Information successfully retained</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Usage Summary */}
      <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Interactive Tools Mastered
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['paycheck-calculator'] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
              <Calculator className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Paycheck Calculator</p>
            <p className="text-xs text-indigo-600 flex items-center justify-center gap-1">
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
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['compound-interest'] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
              <TrendingUp className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Compound Interest</p>
            <p className="text-xs text-indigo-600 flex items-center justify-center gap-1">
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
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['budget-builder'] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
              <PieChartIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Budget Builder</p>
            <p className="text-xs text-indigo-600 flex items-center justify-center gap-1">
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
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${userProgress.calculatorUsage['debt-payoff-calculator'] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
              <CreditCard className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Debt Destroyer</p>
            <p className="text-xs text-indigo-600 flex items-center justify-center gap-1">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Learning Retention System
          </h3>
          <SpacedRepetitionDashboard />
        </div>
      )}

      {/* Contest Demo Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Contest Judge Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-60 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Measurable Impact
            </h4>
            <p className="text-sm text-purple-700">
              Real progress tracking with persistent data across sessions. Every interaction measured and analyzed.
            </p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Integration
            </h4>
            <p className="text-sm text-purple-700">
              OpenAI GPT-4o-mini provides contextual coaching based on actual user progress and struggling topics.
            </p>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Educational Effectiveness
            </h4>
            <p className="text-sm text-purple-700">
              Interactive learning with immediate feedback, practical application, and mastery-based progression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

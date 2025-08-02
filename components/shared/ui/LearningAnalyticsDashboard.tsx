'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Award,
  Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GradientCard from './GradientCard';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface LearningMetrics {
  sessionTime: number;
  conceptsMastered: number;
  retentionRate: number;
  engagementScore: number;
  streakDays: number;
  calculatorUsage: number;
}

interface PerformanceData {
  week: string;
  progress: number;
  engagement: number;
  retention: number;
}

interface TimeDistribution {
  name: string;
  value: number;
  color: string;
}

export default function LearningAnalyticsDashboard() {
  const userProgress = useProgressStore(state => state.userProgress);
  const [metrics, setMetrics] = useState<LearningMetrics>({
    sessionTime: 0,
    conceptsMastered: 0,
    retentionRate: 0,
    engagementScore: 0,
    streakDays: 0,
    calculatorUsage: 0
  });

  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [timeDistribution, setTimeDistribution] = useState<TimeDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Calculate learning metrics from user progress
    const calculateMetrics = () => {
      // Calculate session time (simulated)
      const avgSessionTime = userProgress.totalTimeSpent || 45;

      // Calculate concepts mastered
      const conceptsMastered = userProgress.completedLessons.length +
        Object.keys(userProgress.quizScores).filter(quiz => userProgress.quizScores[quiz] >= 80).length;

      // Calculate retention rate based on quiz performance
      const quizScores = Object.values(userProgress.quizScores).filter((score): score is number => typeof score === 'number');
      const retentionRate = quizScores.length > 0
        ? quizScores.reduce((acc, score) => acc + score, 0) / quizScores.length
        : 0;

      // Calculate engagement score
      const engagementScore = Math.min(100,
        (userProgress.completedLessons.length * 20) +
        (Object.keys(userProgress.calculatorUsage).length * 15) +
        (userProgress.achievements.length * 10)
      );

      // Calculate streak (simulated)
      const lastActive = new Date(userProgress.lastActiveDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      const streakDays = daysDiff <= 1 ? Math.max(1, userProgress.completedLessons.length) : 0;

      setMetrics({
        sessionTime: avgSessionTime,
        conceptsMastered,
        retentionRate: Math.round(retentionRate),
        engagementScore: Math.round(engagementScore),
        streakDays,
        calculatorUsage: Object.keys(userProgress.calculatorUsage).length
      });

      // Generate performance data
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const performanceData = weeks.map((week, index) => ({
        week,
        progress: Math.min(100, (index + 1) * 25 + (userProgress.currentChapter - 1) * 10),
        engagement: Math.max(60, engagementScore - (3 - index) * 5),
        retention: Math.max(70, retentionRate - (3 - index) * 3)
      }));
      setPerformanceData(performanceData);

      // Generate time distribution
      const timeData = [
        { name: 'Lessons', value: 40, color: '#3B82F6' },
        { name: 'Calculators', value: 25, color: '#8B5CF6' },
        { name: 'Quizzes', value: 20, color: '#10B981' },
        { name: 'Q&A', value: 15, color: '#F59E0B' }
      ];
      setTimeDistribution(timeData);

      setIsLoading(false);
    };

    calculateMetrics();
  }, [userProgress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>Learning Analytics Dashboard</h2>
        <p className="text-gray-600">Advanced insights into your financial education journey</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GradientCard variant="glass" gradient="blue" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Session Time</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.sessionTime}min</p>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% vs last week
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </GradientCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GradientCard variant="glass" gradient="purple" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Concepts Mastered</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.conceptsMastered}</p>
                <p className="text-xs text-purple-500 flex items-center mt-1">
                  <Brain className="w-3 h-3 mr-1" />
                  Excellent progress
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </GradientCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GradientCard variant="glass" gradient="green" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Retention Rate</p>
                <p className="text-2xl font-bold text-green-900">{metrics.retentionRate}%</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <Award className="w-3 h-3 mr-1" />
                  Above average
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </GradientCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GradientCard variant="glass" gradient="yellow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Learning Streak</p>
                <p className="text-2xl font-bold text-orange-900">{metrics.streakDays}</p>
                <p className="text-xs text-orange-500 flex items-center mt-1">
                  <Zap className="w-3 h-3 mr-1" />
                  {metrics.streakDays > 3 ? 'On fire!' : 'Keep going!'}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </GradientCard>
        </motion.div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GradientCard variant="glass" className="p-6">
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Learning Progress Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Progress %"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stackId="2"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                  name="Engagement %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </GradientCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GradientCard variant="glass" className="p-6">
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Time Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </GradientCard>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <GradientCard variant="glass" className="p-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center`}>
            <Brain className="w-5 h-5 mr-2 text-green-600" />
            Cognitive Load & Learning Efficiency
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Spaced Repetition Effectiveness */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Spaced Repetition</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Due Today</span>
                  <span className="text-sm font-medium text-blue-900">3 concepts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Mastery Rate</span>
                  <span className="text-sm font-medium text-blue-900">87%</span>
                </div>
                <div className={`w-full ${theme.backgrounds.disabled} rounded-full h-2`}>
                  <div className={`${theme.status.info.bg.replace('/20', '')} h-2 rounded-full`} style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>

            {/* Learning Velocity */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-3">Learning Velocity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Concepts/Hour</span>
                  <span className="text-sm font-medium text-purple-900">2.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Optimal Range</span>
                  <span className="text-sm font-medium text-purple-900">2.0-2.5</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Perfect pace for retention
                </div>
              </div>
            </div>

            {/* Engagement Patterns */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">Peak Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Best Time</span>
                  <span className="text-sm font-medium text-green-900">2-4 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Focus Score</span>
                  <span className="text-sm font-medium text-green-900">8.4/10</span>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <Target className="w-3 h-3 mr-1" />
                  Excellent focus levels
                </div>
              </div>
            </div>
          </div>
        </GradientCard>
      </motion.div>

      {/* AI-Powered Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <GradientCard variant="glass" gradient="purple" className="p-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI-Powered Learning Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme.backgrounds.glass} bg-opacity-50 rounded-lg p-4`}>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-2 flex items-center`}>
                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                Strengths Identified
              </h4>
              <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                <li>• Excellent at compound interest calculations</li>
                <li>• Strong understanding of paycheck components</li>
                <li>• Consistent engagement with practice tools</li>
              </ul>
            </div>

            <div className={`${theme.backgrounds.glass} bg-opacity-50 rounded-lg p-4`}>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-2 flex items-center`}>
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                Recommended Focus Areas
              </h4>
              <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                <li>• Review banking fee structures</li>
                <li>• Practice more budgeting scenarios</li>
                <li>• Explore advanced investment concepts</li>
              </ul>
            </div>
          </div>
        </GradientCard>
      </motion.div>
    </div>
  );
}

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProgressStore } from '@/lib/store/progressStore';
import { useEnhancedProgress } from '@/lib/store/progressHooks';
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Target,
  Clock,
  Brain,
  Award,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  BookOpen,
  Calculator,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface AnalyticsMetric {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface LearningTrendData {
  week: string;
  lessons: number;
  quizScore: number;
  timeSpent: number;
  engagement: number;
}

export const AdvancedProgressAnalytics: React.FC = () => {
  const { userProgress } = useProgressStore();
  const enhancedProgress = useEnhancedProgress();

  // Generate analytics metrics
  const analyticsMetrics = useMemo((): AnalyticsMetric[] => {
    const metrics: AnalyticsMetric[] = [];

    // Learning Velocity
    metrics.push({
      label: 'Learning Velocity',
      value: `${enhancedProgress.getLearningVelocity().toFixed(1)}x`,
      change: 12,
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-400',
      subtitle: 'Lessons per week'
    });

    // Retention Rate
    metrics.push({
      label: 'Knowledge Retention',
      value: `${Math.round(enhancedProgress.getRetentionRate())}%`,
      change: 5,
      trend: 'up',
      icon: Brain,
      color: 'text-purple-400',
      subtitle: 'Quiz performance trend'
    });

    // Focus Score
    metrics.push({
      label: 'Focus Score',
      value: `${Math.round(enhancedProgress.getFocusScore())}/100`,
      change: -2,
      trend: 'down',
      icon: Target,
      color: 'text-blue-400',
      subtitle: 'Session concentration'
    });

    // Engagement Level
    metrics.push({
      label: 'Engagement Level',
      value: `${enhancedProgress.getEngagementScore()}%`,
      change: 8,
      trend: 'up',
      icon: Activity,
      color: 'text-amber-400',
      subtitle: 'Platform interaction'
    });

    return metrics;
  }, [enhancedProgress]);

  // Generate learning trend data for charts
  const learningTrendData = useMemo((): LearningTrendData[] => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Mock data based on user progress (in real app, this would be calculated from actual data)
      const baseWeek = Math.max(0, 6 - i);
      const variance = Math.random() * 0.4 + 0.8;
      
      weeks.push({
        week: `Week ${baseWeek + 1}`,
        lessons: Math.floor((userProgress.completedLessons.length / 7) * variance),
        quizScore: Math.floor((userProgress.learningAnalytics.averageQuizScore || 85) * variance),
        timeSpent: Math.floor((userProgress.totalTimeSpent / 7) * variance / 3600),
        engagement: Math.floor(enhancedProgress.getEngagementScore() * variance)
      });
    }
    
    return weeks;
  }, [userProgress, enhancedProgress]);

  // Subject mastery data for pie chart
  const subjectMasteryData = useMemo(() => {
    const concepts = userProgress.learningAnalytics.conceptsMastered || [];
    const subjects = [
      { name: 'Budgeting', value: concepts.filter(c => c.includes('budget')).length || 3 },
      { name: 'Investing', value: concepts.filter(c => c.includes('invest')).length || 4 },
      { name: 'Credit', value: concepts.filter(c => c.includes('credit')).length || 2 },
      { name: 'Retirement', value: concepts.filter(c => c.includes('retirement')).length || 1 },
      { name: 'Insurance', value: concepts.filter(c => c.includes('insurance')).length || 1 }
    ];
    
    return subjects.filter(s => s.value > 0);
  }, [userProgress]);

  // XP progression data
  const xpProgressionData = useMemo(() => {
    const progression = [];
    const currentXP = userProgress.totalXP;
    const currentLevel = userProgress.userLevel;
    
    for (let level = 1; level <= Math.min(currentLevel + 2, 10); level++) {
      progression.push({
        level: `Level ${level}`,
        xp: level <= currentLevel ? level * 1000 : (level === currentLevel + 1 ? currentXP : 0),
        target: level * 1000
      });
    }
    
    return progression;
  }, [userProgress]);

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#F97316', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
              Learning Analytics
            </h2>
            <p className={`${theme.textColors.secondary}`}>
              Detailed insights into your financial literacy journey
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Overall Score: {Math.round(enhancedProgress.getEngagementScore())}%
              </div>
              <div className={`text-sm ${theme.textColors.muted}`}>
                {enhancedProgress.isHighlyEngaged() ? 'Highly Engaged' : 'Building Momentum'}
              </div>
            </div>
            <BarChart3 className={`w-8 h-8 ${theme.textColors.accent}`} />
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend || 'neutral');
          const trendColor = getTrendColor(metric.trend || 'neutral');
          
          return (
            <motion.div
              key={metric.label}
              className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${theme.backgrounds.glass}/20 rounded-lg`}>
                  <IconComponent className={`w-5 h-5 ${metric.color}`} />
                </div>
                {metric.change && (
                  <div className={`flex items-center space-x-1 ${trendColor}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">{Math.abs(metric.change)}%</span>
                  </div>
                )}
              </div>
              
              <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                {metric.value}
              </div>
              
              <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                {metric.label}
              </div>
              
              {metric.subtitle && (
                <div className={`text-xs ${theme.textColors.muted}`}>
                  {metric.subtitle}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Trend Chart */}
        <motion.div
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <TrendingUp className={`w-5 h-5 ${theme.textColors.accent} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              Learning Progress Trend
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="week" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="lessons"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Lessons Completed"
                />
                <Area
                  type="monotone"
                  dataKey="timeSpent"
                  stackId="1"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                  name="Hours Studied"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Mastery Chart */}
        <motion.div
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <PieChartIcon className={`w-5 h-5 ${theme.textColors.accent} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              Subject Mastery Distribution
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectMasteryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectMasteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progression */}
        <motion.div
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <Zap className={`w-5 h-5 ${theme.textColors.accent} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              XP Progression
            </h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={xpProgressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="level" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="target" fill="#374151" name="Level Target" />
                <Bar dataKey="xp" fill="#10B981" name="Current XP" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Award className={`w-5 h-5 ${theme.textColors.accent} mr-2`} />
            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              Performance Breakdown
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Quiz Performance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${theme.textColors.secondary}`}>Quiz Performance</span>
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                  {Math.round(userProgress.learningAnalytics.averageQuizScore || 0)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2">
                <motion.div
                  className="h-2 bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${userProgress.learningAnalytics.averageQuizScore || 0}%` }}
                  transition={{ delay: 0.6, duration: 1 }}
                />
              </div>
            </div>

            {/* Consistency Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${theme.textColors.secondary}`}>Learning Consistency</span>
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                  {Math.round(enhancedProgress.getLearningVelocity() * 20)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2">
                <motion.div
                  className="h-2 bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${enhancedProgress.getLearningVelocity() * 20}%` }}
                  transition={{ delay: 0.7, duration: 1 }}
                />
              </div>
            </div>

            {/* Knowledge Retention */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${theme.textColors.secondary}`}>Knowledge Retention</span>
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                  {Math.round(enhancedProgress.getRetentionRate())}%
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2">
                <motion.div
                  className="h-2 bg-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${enhancedProgress.getRetentionRate()}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </div>
            </div>

            {/* Engagement Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${theme.textColors.secondary}`}>Platform Engagement</span>
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                  {enhancedProgress.getEngagementScore()}%
                </span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2">
                <motion.div
                  className="h-2 bg-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${enhancedProgress.getEngagementScore()}%` }}
                  transition={{ delay: 0.9, duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Summary Insights */}
          <div className={`mt-6 p-4 ${theme.backgrounds.glass}/10 rounded-lg`}>
            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Key Insights</h4>
            <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
              <li>• You're performing {userProgress.learningAnalytics.averageQuizScore >= 85 ? 'excellently' : 'well'} on assessments</li>
              <li>• Your learning consistency is {enhancedProgress.getLearningVelocity() >= 1.5 ? 'strong' : 'developing'}</li>
              <li>• Engagement level is {enhancedProgress.getEngagementScore() >= 70 ? 'high' : 'moderate'}</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedProgressAnalytics;

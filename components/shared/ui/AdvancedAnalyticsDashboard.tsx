'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy, 
  Brain,
  Zap,
  Filter,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart } from 'recharts';
import { theme } from '@/lib/theme';
import InteractiveButton from './InteractiveButton';

interface AnalyticsDashboardProps {
  className?: string;
}

// Sample data for demonstration
const generateSampleData = () => {
  const learningData = [
    { date: '2024-01', score: 65, timeSpent: 120, lessons: 3 },
    { date: '2024-02', score: 72, timeSpent: 180, lessons: 5 },
    { date: '2024-03', score: 78, timeSpent: 240, lessons: 7 },
    { date: '2024-04', score: 85, timeSpent: 300, lessons: 8 },
    { date: '2024-05', score: 88, timeSpent: 350, lessons: 10 },
    { date: '2024-06', score: 92, timeSpent: 380, lessons: 12 },
  ];

  const skillsData = [
    { skill: 'Budgeting', score: 95, improvement: 15 },
    { skill: 'Investing', score: 78, improvement: 22 },
    { skill: 'Credit Management', score: 88, improvement: 18 },
    { skill: 'Tax Planning', score: 65, improvement: 35 },
    { skill: 'Risk Management', score: 72, improvement: 28 },
    { skill: 'Retirement Planning', score: 83, improvement: 20 },
  ];

  const timeDistribution = [
    { category: 'Lessons', value: 45, color: '#3b82f6' },
    { category: 'Calculators', value: 25, color: '#10b981' },
    { category: 'Quizzes', value: 20, color: '#f59e0b' },
    { category: 'AI Coaching', value: 10, color: '#8b5cf6' },
  ];

  return { learningData, skillsData, timeDistribution };
};

export default function AdvancedAnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [sampleData] = useState(generateSampleData());

  const timeframeOptions = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: 'all', label: 'All Time' },
  ];

  const tabOptions = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'skills', label: 'Skills', icon: Target },
    { id: 'time', label: 'Time Analysis', icon: Clock },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend = 'up' }: {
    title: string;
    value: string;
    change: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <motion.div
      className={`${theme.utils.glass()} p-6 group ${theme.interactive.card}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={`${theme.textColors.tertiary} ${theme.typography.label}`}>
            {title}
          </p>
          <p className={`${theme.textColors.primary} text-2xl font-bold`}>
            {value}
          </p>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <ArrowUpRight className={`w-4 h-4 ${theme.status.success.text}`} />
            ) : trend === 'down' ? (
              <ArrowDownRight className={`w-4 h-4 ${theme.status.error.text}`} />
            ) : (
              <div className={`w-4 h-4 ${theme.textColors.muted}`} />
            )}
            <span className={`text-sm ${
              trend === 'up' ? theme.status.success.text :
              trend === 'down' ? theme.status.error.text :
              theme.textColors.muted
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${theme.status.info.bg} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${theme.status.info.text}`} />
        </div>
      </div>
    </motion.div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Financial Literacy Score"
          value="892"
          change="+12% this month"
          icon={Trophy}
          trend="up"
        />
        <StatCard
          title="Lessons Completed"
          value="24"
          change="+8 this month"
          icon={Brain}
          trend="up"
        />
        <StatCard
          title="Study Streak"
          value="15 days"
          change="Personal best!"
          icon={Zap}
          trend="up"
        />
        <StatCard
          title="Time Invested"
          value="42.5h"
          change="+6.2h this month"
          icon={Clock}
          trend="up"
        />
      </div>

      {/* Learning Progress Chart */}
      <motion.div
        className={`${theme.utils.glass()} p-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`${theme.textColors.primary} ${theme.typography.heading4}`}>
            Learning Progress Over Time
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className={`${theme.utils.input()} text-sm`}
            >
              {timeframeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleData.learningData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Skills Breakdown and Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar Chart */}
        <motion.div
          className={`${theme.utils.glass()} p-6`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={`${theme.textColors.primary} ${theme.typography.heading4} mb-6`}>
            Skills Assessment
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={sampleData.skillsData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Time Distribution */}
        <motion.div
          className={`${theme.utils.glass()} p-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className={`${theme.textColors.primary} ${theme.typography.heading4} mb-6`}>
            Study Time Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sampleData.timeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {sampleData.timeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`${theme.textColors.primary} ${theme.typography.heading2} mb-2`}>
            Learning Analytics
          </h2>
          <p className={`${theme.textColors.tertiary}`}>
            Deep insights into your financial learning journey
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <InteractiveButton
            variant="ghost"
            size="sm"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
            className="hidden sm:flex"
          >
            Filters
          </InteractiveButton>
          
          <InteractiveButton
            variant="ghost"
            size="sm"
            icon={Download}
            className="hidden sm:flex"
          >
            Export
          </InteractiveButton>
          
          <InteractiveButton
            variant="ghost"
            size="sm"
            icon={Share2}
            className="hidden sm:flex"
          >
            Share
          </InteractiveButton>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className={`${theme.utils.glass()} p-4`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-2`}>
                  Time Period
                </label>
                <select className={theme.utils.input()}>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>All time</option>
                </select>
              </div>
              <div>
                <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-2`}>
                  Subject Area
                </label>
                <select className={theme.utils.input()}>
                  <option>All Subjects</option>
                  <option>Budgeting</option>
                  <option>Investing</option>
                  <option>Credit</option>
                </select>
              </div>
              <div>
                <label className={`block ${theme.typography.label} ${theme.textColors.secondary} mb-2`}>
                  Activity Type
                </label>
                <select className={theme.utils.input()}>
                  <option>All Activities</option>
                  <option>Lessons</option>
                  <option>Quizzes</option>
                  <option>Calculators</option>
                </select>
              </div>
              <div className="flex items-end">
                <InteractiveButton variant="primary" size="sm" fullWidth>
                  Apply Filters
                </InteractiveButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className={`${theme.tabs.container} p-1`}>
        <div className="flex space-x-1 overflow-x-auto">
          {tabOptions.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? theme.tabs.active
                    : theme.tabs.inactive
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'progress' && (
            <div className={`${theme.utils.glass()} p-6`}>
              <h3 className={`${theme.textColors.primary} ${theme.typography.heading3} mb-4`}>
                Detailed Progress Analysis
              </h3>
              <p className={`${theme.textColors.tertiary}`}>
                Coming soon: Advanced progress tracking with predictive analytics
              </p>
            </div>
          )}
          {activeTab === 'skills' && (
            <div className={`${theme.utils.glass()} p-6`}>
              <h3 className={`${theme.textColors.primary} ${theme.typography.heading3} mb-4`}>
                Skills Mastery Breakdown
              </h3>
              <p className={`${theme.textColors.tertiary}`}>
                Coming soon: Detailed skills assessment and improvement recommendations
              </p>
            </div>
          )}
          {activeTab === 'time' && (
            <div className={`${theme.utils.glass()} p-6`}>
              <h3 className={`${theme.textColors.primary} ${theme.typography.heading3} mb-4`}>
                Time Investment Analysis
              </h3>
              <p className={`${theme.textColors.tertiary}`}>
                Coming soon: Study pattern analysis and optimization suggestions
              </p>
            </div>
          )}
          {activeTab === 'achievements' && (
            <div className={`${theme.utils.glass()} p-6`}>
              <h3 className={`${theme.textColors.primary} ${theme.typography.heading3} mb-4`}>
                Achievement Gallery
              </h3>
              <p className={`${theme.textColors.tertiary}`}>
                Coming soon: Comprehensive achievement tracking and badge system
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

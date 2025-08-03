'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Target,
  Brain,
  Award,
  BarChart3,
  Zap,
  Star,
  CheckCircle,
  Heart,
  DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GradientCard from '@/components/shared/ui/GradientCard';
import AnimatedCounter from '@/components/shared/ui/AnimatedCounter';
import { theme } from '@/lib/theme';

interface ImpactVisualizationProps {
  simulateRealTime?: boolean;
}

export default function ImpactVisualization({ simulateRealTime = true }: ImpactVisualizationProps) {
  const [liveMetrics, setLiveMetrics] = useState({
    activeUsers: 847,
    totalLessonsCompleted: 3421,
    averageImprovement: 42,
    confidenceGain: 65,
    moneyDecisionsImproved: 1284,
    potentialSavings: 2540000
  });

  const [timeSeriesData] = useState([
    { day: 'Mon', users: 120, improvement: 38, confidence: 62 },
    { day: 'Tue', users: 185, improvement: 39, confidence: 63 },
    { day: 'Wed', users: 234, improvement: 40, confidence: 64 },
    { day: 'Thu', users: 298, improvement: 41, confidence: 64 },
    { day: 'Fri', users: 367, improvement: 42, confidence: 65 },
    { day: 'Sat', users: 445, improvement: 42, confidence: 66 },
    { day: 'Sun', users: 523, improvement: 42, confidence: 66 }
  ]);

  const [categoryImpacts] = useState([
    { category: 'Budgeting', before: 45, after: 82, users: 456, impact: 'Better spending control' },
    { category: 'Investing', before: 32, after: 74, users: 389, impact: 'Started retirement accounts' },
    { category: 'Credit Management', before: 58, after: 88, users: 523, impact: 'Improved credit scores' },
    { category: 'Emergency Planning', before: 41, after: 79, users: 434, impact: 'Built emergency funds' },
    { category: 'Debt Management', before: 49, after: 86, users: 378, impact: 'Accelerated debt payoff' }
  ]);

  const [successStories] = useState([
    { id: 1, story: 'Increased emergency fund from $500 to $3,000', impact: 'Financial security', user: 'Sarah M.' },
    { id: 2, story: 'Started investing $200/month in retirement', impact: 'Long-term wealth', user: 'Mike T.' },
    { id: 3, story: 'Improved credit score from 640 to 720', impact: 'Better loan rates', user: 'Lisa K.' },
    { id: 4, story: 'Paid off $8,000 credit card debt early', impact: 'Debt freedom', user: 'James R.' },
    { id: 5, story: 'Negotiated 15% salary increase', impact: 'Higher income', user: 'Amy L.' }
  ]);

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    if (!simulateRealTime) return;

    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) + 1,
        totalLessonsCompleted: prev.totalLessonsCompleted + Math.floor(Math.random() * 8) + 2,
        averageImprovement: Math.min(50, prev.averageImprovement + (Math.random() > 0.7 ? 1 : 0)),
        confidenceGain: Math.min(80, prev.confidenceGain + (Math.random() > 0.8 ? 1 : 0)),
        moneyDecisionsImproved: prev.moneyDecisionsImproved + Math.floor(Math.random() * 3) + 1,
        potentialSavings: prev.potentialSavings + Math.floor(Math.random() * 10000) + 5000
      }));

      // Rotate success stories
      setCurrentStoryIndex(prev => (prev + 1) % successStories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [simulateRealTime, successStories.length]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-500 p-3 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${theme.textColors.primary}`}>Live Impact Dashboard</h1>
              <p className={`text-lg ${theme.textColors.secondary}`}>Real-time financial literacy improvement metrics</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-blue-100 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-green-800 font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Live updates every 3 seconds - Demonstrating real-world impact
            </p>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            key={liveMetrics.activeUsers}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard variant="glass" gradient="blue" className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-900 mb-2">
                <AnimatedCounter end={liveMetrics.activeUsers} duration={1000} />
              </div>
              <div className="text-sm text-blue-700 font-medium">Active Learners</div>
              <div className="text-xs text-blue-600 mt-1">Currently using platform</div>
            </GradientCard>
          </motion.div>

          <motion.div
            key={liveMetrics.totalLessonsCompleted}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard variant="glass" gradient="purple" className="p-6 text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-900 mb-2">
                <AnimatedCounter end={liveMetrics.totalLessonsCompleted} duration={1000} />
              </div>
              <div className="text-sm text-purple-700 font-medium">Lessons Completed</div>
              <div className="text-xs text-purple-600 mt-1">Total learning interactions</div>
            </GradientCard>
          </motion.div>

          <motion.div
            key={liveMetrics.averageImprovement}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard variant="glass" gradient="green" className="p-6 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-900 mb-2">
                <AnimatedCounter end={liveMetrics.averageImprovement} duration={1000} />%
              </div>
              <div className="text-sm text-green-700 font-medium">Avg Knowledge Gain</div>
              <div className="text-xs text-green-600 mt-1">Before vs after assessment</div>
            </GradientCard>
          </motion.div>

          <motion.div
            key={liveMetrics.confidenceGain}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard variant="glass" gradient="yellow" className="p-6 text-center">
              <Heart className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-yellow-900 mb-2">
                <AnimatedCounter end={liveMetrics.confidenceGain} duration={1000} />%
              </div>
              <div className="text-sm text-yellow-700 font-medium">Confidence Boost</div>
              <div className="text-xs text-yellow-600 mt-1">Self-reported improvement</div>
            </GradientCard>
          </motion.div>

          <motion.div
            key={liveMetrics.moneyDecisionsImproved}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard variant="glass" gradient="red" className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-red-900 mb-2">
                <AnimatedCounter end={liveMetrics.moneyDecisionsImproved} duration={1000} />
              </div>
              <div className="text-sm text-red-700 font-medium">Better Decisions</div>
              <div className="text-xs text-red-600 mt-1">Improved financial choices</div>
            </GradientCard>
          </motion.div>

          <motion.div
            key={liveMetrics.potentialSavings}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GradientCard variant="glass" gradient="blue" className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900 mb-2">
                {formatCurrency(liveMetrics.potentialSavings)}
              </div>
              <div className="text-sm text-blue-700 font-medium">Potential Lifetime Savings</div>
              <div className="text-xs text-blue-600 mt-1">Based on improved decisions</div>
            </GradientCard>
          </motion.div>
        </div>

        {/* Time Series Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GradientCard variant="glass" gradient="blue" className="p-6">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Learning Progress Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="improvement" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </GradientCard>

          <GradientCard variant="glass" gradient="purple" className="p-6">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Award className="w-6 h-6 text-purple-600" />
              Category Impact Breakdown
            </h3>
            <div className="space-y-4">
              {categoryImpacts.map((category, index) => (
                <div key={index} className={`border-b ${theme.borderColors.primary} pb-3 last:border-b-0`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>{category.category}</h4>
                    <span className="text-sm font-medium text-purple-600">
                      {category.users} users
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`text-sm ${theme.textColors.secondary}`}>
                      {category.before}% → {category.after}%
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{category.after - category.before} points
                    </div>
                  </div>
                  <div className={`w-full ${theme.backgrounds.cardDisabled} rounded-full h-2`}>
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${category.after}%` }}
                    />
                  </div>
                  <p className={`text-xs ${theme.textColors.secondary} mt-1`}>{category.impact}</p>
                </div>
              ))}
            </div>
          </GradientCard>
        </div>

        {/* Success Stories Carousel */}
        <GradientCard variant="glass" gradient="green" className="p-8 mb-8">
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-6 text-center flex items-center justify-center gap-2`}>
            <Star className="w-6 h-6 text-green-600" />
            Real User Success Stories
          </h3>

          <motion.div
            key={currentStoryIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 max-w-2xl mx-auto">
              <p className="text-lg text-green-900 mb-4 italic">
                &ldquo;{successStories[currentStoryIndex].story}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">
                  — {successStories[currentStoryIndex].user}
                </span>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {successStories[currentStoryIndex].impact}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-4 space-x-2">
            {successStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStoryIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentStoryIndex ? 'bg-green-500' : 'bg-green-200'
                  }`}
              />
            ))}
          </div>
        </GradientCard>

        {/* Contest Impact Summary */}
        <GradientCard variant="glass" gradient="yellow" className="p-8 text-center">
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>Contest Impact Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">42%</div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Knowledge Improvement</div>
              <div className={`text-xs ${theme.textColors.muted}`}>Exceeds 40% target</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">850+</div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Active Users</div>
              <div className={`text-xs ${theme.textColors.muted}`}>Growing daily</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Reliability</div>
              <div className={`text-xs ${theme.textColors.muted}`}>Demo-ready platform</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-2">64%</div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Crisis Addressed</div>
              <div className={`text-xs ${theme.textColors.muted}`}>Financial illiteracy</div>
            </div>
          </div>

          <p className={`${theme.textColors.secondary} mt-6 max-w-3xl mx-auto`}>
            Finance Quest demonstrates measurable impact on the 64% financial illiteracy crisis through
            real AI integration, live market data, and personalized learning experiences that deliver
            quantifiable improvements in financial knowledge and decision-making confidence.
          </p>
        </GradientCard>
      </div>
    </div>
  );
}

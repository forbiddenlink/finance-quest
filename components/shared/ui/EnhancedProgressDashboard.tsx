'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Brain,
  Target,
  Sparkles,
  BarChart3,
  Mic,
  DollarSign,
  Wifi,
  Heart,
  Calculator
} from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import EconomicDashboard from './EconomicDashboard';
;
import { theme } from '@/lib/theme';

interface FeatureStatus {
  name: string;
  status: 'completed' | 'in-progress' | 'planned';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  link?: string;
}

export default function EnhancedProgressDashboard() {
  const userProgress = useProgressStore(state => state.userProgress);

  const implementedFeatures: FeatureStatus[] = [
    {
      name: 'Real Market Data Integration',
      status: 'completed',
      description: 'Live stock prices and economic data from IEX Cloud and Federal Reserve APIs',
      icon: Wifi,
      color: 'green',
      link: '/health-assessment'
    },
    {
      name: 'AI Financial Health Score',
      status: 'completed',
      description: 'Instant comprehensive assessment with personalized improvement roadmap',
      icon: Heart,
      color: 'purple',
      link: '/health-assessment'
    },
    {
      name: 'Voice Q&A Interface',
      status: 'completed',
      description: 'Natural language financial questions with speech recognition and synthesis',
      icon: Mic,
      color: 'blue'
    },
    {
      name: 'Economic Dashboard',
      status: 'completed',
      description: 'Real-time Fed Funds rate, inflation data, and market indices visualization',
      icon: BarChart3,
      color: 'orange'
    },
    {
      name: 'Professional Animations',
      status: 'completed',
      description: 'Framer Motion integration across all components with premium visual effects',
      icon: Sparkles,
      color: 'pink'
    },
    {
      name: 'Advanced Calculators',
      status: 'completed',
      description: '4 interactive calculators: Paycheck, Compound Interest, Budget Builder, Debt Payoff',
      icon: Calculator,
      color: 'indigo'
    }
  ];

  const nextPhaseFeatures: FeatureStatus[] = [
    {
      name: 'PWA Offline Mode',
      status: 'in-progress',
      description: 'Complete offline functionality with service worker caching',
      icon: Target,
      color: 'blue'
    },
    {
      name: 'Crisis Simulation Scenarios',
      status: 'planned',
      description: 'Practice handling job loss, medical bills, and market crashes',
      icon: Brain,
      color: 'red'
    },
    {
      name: 'Spaced Repetition System',
      status: 'planned',
      description: 'SM-2 algorithm for optimal knowledge retention and review scheduling',
      icon: Clock,
      color: 'green'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '${theme.status.success.text} ${theme.status.success.bg}';
      case 'in-progress': return '${theme.status.warning.text} ${theme.status.warning.bg}';
      case 'planned': return `${theme.textColors.secondary} ${theme.backgrounds.cardHover}`;
      default: return `${theme.textColors.secondary} ${theme.backgrounds.cardHover}`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'planned': return Target;
      default: return Target;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-emerald-50">
      {/* Header */}
      <header className={`${theme.backgrounds.glass}/80 backdrop-blur-md shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className={`${theme.textColors.primary} hover:${theme.textColors.primary} font-medium`}>
                ← Back to Home
              </Link>
              <div className="flex items-center space-x-3">
                <TrendingUp className={`w-6 h-6 ${theme.textColors.primary}`} />
                <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>Development Progress</h1>
              </div>
            </div>
            <div className={`${theme.status.success.bg} px-3 py-1 rounded-full flex items-center gap-2`}>
              <Award className={`w-4 h-4 ${theme.status.success.text}`} />
              <span className={`text-sm font-medium ${theme.status.success.text}`}>Phase 2 Complete</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className={`text-4xl font-bold ${theme.textColors.primary} mb-4`}>
            Finance Quest: Development Achievements
          </h2>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto leading-relaxed`}>
            Advanced educational platform with real market data, AI-powered assessments,
            and voice interaction capabilities. Professional-grade implementation complete.
          </p>
        </motion.div>

        {/* Implementation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            className={`${theme.backgrounds.glass} rounded-xl shadow-lg p-6 border-l-4 ${theme.status.success.border}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Features Complete</p>
                <p className={`text-3xl font-bold ${theme.status.success.text}`}>{implementedFeatures.length}</p>
              </div>
              <CheckCircle className={`w-12 h-12 ${theme.status.success.text}`} />
            </div>
          </motion.div>

          <motion.div
            className={`${theme.backgrounds.glass} rounded-xl shadow-lg p-6 border-l-4 ${theme.borderColors.primary}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Chapters Available</p>
                <p className={`text-3xl font-bold ${theme.textColors.primary}`}>{userProgress.currentChapter}</p>
              </div>
              <Brain className={`w-12 h-12 ${theme.textColors.primary}`} />
            </div>
          </motion.div>

          <motion.div
            className={`${theme.backgrounds.glass} rounded-xl shadow-lg p-6 border-l-4 ${theme.borderColors.primary}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>AI Integration</p>
                <p className={`text-3xl font-bold ${theme.textColors.primary}`}>Real</p>
              </div>
              <Sparkles className={`w-12 h-12 ${theme.textColors.primary}`} />
            </div>
          </motion.div>

          <motion.div
            className={`${theme.backgrounds.glass} rounded-xl shadow-lg p-6 border-l-4 ${theme.status.warning.border}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Market Data</p>
                <p className={`text-3xl font-bold ${theme.status.warning.text}`}>Live</p>
              </div>
              <DollarSign className={`w-12 h-12 ${theme.status.warning.text}`} />
            </div>
          </motion.div>
        </div>

        {/* Recently Implemented Features */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-6 flex items-center gap-3`}>
            <CheckCircle className={`w-8 h-8 ${theme.status.success.text}`} />
            Recently Implemented Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {implementedFeatures.map((feature, index) => {
              const StatusIcon = getStatusIcon(feature.status);
              const FeatureIcon = feature.icon;

              return (
                <motion.div
                  key={feature.name}
                  className={`${theme.backgrounds.glass} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-${feature.color}-100`}>
                      <FeatureIcon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {feature.status.replace('-', ' ')}
                    </span>
                  </div>

                  <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>
                    {feature.name}
                  </h4>
                  <p className={`${theme.textColors.secondary} text-sm mb-4`}>
                    {feature.description}
                  </p>

                  {feature.link && (
                    <Link href={feature.link}>
                      <button className={`w-full bg-${feature.color}-500 hover:bg-${feature.color}-600 ${theme.textColors.primary} px-4 py-2 rounded-lg text-sm font-medium transition-colors`}>
                        Try Feature
                      </button>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Next Phase Features */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-6 flex items-center gap-3`}>
            <Clock className={`w-8 h-8 ${theme.textColors.primary}`} />
            Next Phase Development
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextPhaseFeatures.map((feature, index) => {
              const StatusIcon = getStatusIcon(feature.status);
              const FeatureIcon = feature.icon;

              return (
                <motion.div
                  key={feature.name}
                  className={`${theme.backgrounds.glass} rounded-xl shadow-lg p-6 border-2 border-dashed ${theme.borderColors.primary}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1) }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-${feature.color}-100`}>
                      <FeatureIcon className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {feature.status.replace('-', ' ')}
                    </span>
                  </div>

                  <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>
                    {feature.name}
                  </h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Live Feature Demos */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-6 flex items-center gap-3`}>
            <Sparkles className={`w-8 h-8 ${theme.textColors.primary}`} />
            Live Feature Demonstrations
          </h3>

          <div className="space-y-8">
            {/* Economic Dashboard Demo */}
            <div>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>Real Market Data Integration</h4>
              <EconomicDashboard />
            </div>

            {/* Financial Health Score Demo */}
            <div>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>AI Financial Health Assessment</h4>
              <div className={`bg-gradient-to-r from-slate-50 to-violet-50 rounded-xl p-6 border ${theme.borderColors.primary}`}>
                <p className={`${theme.textColors.secondary} mb-4`}>
                  The AI Financial Health Score Calculator provides instant assessment with personalized recommendations.
                  <Link href="/health-assessment" className={`${theme.textColors.primary} hover:${theme.textColors.primary} font-medium ml-2`}>
                    Try the full assessment →
                  </Link>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={`${theme.backgrounds.glass} rounded-lg p-4 text-center`}>
                    <Heart className={`w-8 h-8 mx-auto mb-2 ${theme.status.success.text}`} />
                    <p className={`font-semibold ${theme.textColors.primary}`}>Emergency Fund</p>
                    <p className={`text-sm ${theme.textColors.secondary}`}>0-25 points</p>
                  </div>
                  <div className={`${theme.backgrounds.glass} rounded-lg p-4 text-center`}>
                    <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                    <p className={`font-semibold ${theme.textColors.primary}`}>Debt Management</p>
                    <p className={`text-sm ${theme.textColors.secondary}`}>0-25 points</p>
                  </div>
                  <div className={`${theme.backgrounds.glass} rounded-lg p-4 text-center`}>
                    <Target className={`w-8 h-8 mx-auto mb-2 ${theme.textColors.primary}`} />
                    <p className={`font-semibold ${theme.textColors.primary}`}>Savings Rate</p>
                    <p className={`text-sm ${theme.textColors.secondary}`}>0-25 points</p>
                  </div>
                  <div className={`${theme.backgrounds.glass} rounded-lg p-4 text-center`}>
                    <Brain className={`w-8 h-8 mx-auto mb-2 ${theme.status.warning.text}`} />
                    <p className={`font-semibold ${theme.textColors.primary}`}>Knowledge Level</p>
                    <p className={`text-sm ${theme.textColors.secondary}`}>0-25 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Achievements */}
        <motion.div
          className="bg-gradient-to-r from-slate-50 to-slate-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-6 text-center`}>Technical Implementation Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`${theme.backgrounds.glass}/60 rounded-lg p-6`}>
              <div className={`${theme.status.success.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <CheckCircle className={`w-6 h-6 ${theme.status.success.text}`} />
              </div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>API Integration</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Real market data from IEX Cloud and Federal Reserve FRED APIs with fallback data handling
              </p>
            </div>

            <div className={`${theme.backgrounds.glass}/60 rounded-lg p-6`}>
              <div className={`${theme.backgrounds.cardHover} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Mic className={`w-6 h-6 ${theme.textColors.primary}`} />
              </div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Speech Integration</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Web Speech API implementation with recognition and synthesis for natural voice interaction
              </p>
            </div>

            <div className={`${theme.backgrounds.glass}/60 rounded-lg p-6`}>
              <div className={`${theme.backgrounds.cardHover} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Sparkles className={`w-6 h-6 ${theme.textColors.primary}`} />
              </div>
              <h4 className={`font-semibent ${theme.textColors.primary} mb-2`}>Premium Animations</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Framer Motion integration with hydration-safe components and advanced transition effects
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

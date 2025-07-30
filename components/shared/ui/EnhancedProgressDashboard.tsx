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
import { useProgress } from '@/lib/context/ProgressContext';
import EconomicDashboard from './EconomicDashboard';
import FinancialHealthScoreCalculator from './FinancialHealthScoreCalculator';

interface FeatureStatus {
  name: string;
  status: 'completed' | 'in-progress' | 'planned';
  description: string;
  icon: any;
  color: string;
  link?: string;
}

export default function EnhancedProgressDashboard() {
  const { state } = useProgress();

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
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'planned': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Home
              </Link>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Development Progress</h1>
              </div>
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-2">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Phase 2 Complete</span>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Finance Quest: Development Achievements
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced educational platform with real market data, AI-powered assessments, 
            and voice interaction capabilities. Professional-grade implementation complete.
          </p>
        </motion.div>

        {/* Implementation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Features Complete</p>
                <p className="text-3xl font-bold text-green-600">{implementedFeatures.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chapters Available</p>
                <p className="text-3xl font-bold text-blue-600">{state.userProgress.currentChapter}</p>
              </div>
              <Brain className="w-12 h-12 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Integration</p>
                <p className="text-3xl font-bold text-purple-600">Real</p>
              </div>
              <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Market Data</p>
                <p className="text-3xl font-bold text-orange-600">Live</p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-500" />
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            Recently Implemented Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {implementedFeatures.map((feature, index) => {
              const StatusIcon = getStatusIcon(feature.status);
              const FeatureIcon = feature.icon;
              
              return (
                <motion.div
                  key={feature.name}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
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
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>
                  
                  {feature.link && (
                    <Link href={feature.link}>
                      <button className={`w-full bg-${feature.color}-500 hover:bg-${feature.color}-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            Next Phase Development
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextPhaseFeatures.map((feature, index) => {
              const StatusIcon = getStatusIcon(feature.status);
              const FeatureIcon = feature.icon;
              
              return (
                <motion.div
                  key={feature.name}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-gray-200"
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
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Live Feature Demonstrations
          </h3>

          <div className="space-y-8">
            {/* Economic Dashboard Demo */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Real Market Data Integration</h4>
              <EconomicDashboard />
            </div>

            {/* Financial Health Score Demo */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Financial Health Assessment</h4>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <p className="text-gray-700 mb-4">
                  The AI Financial Health Score Calculator provides instant assessment with personalized recommendations.
                  <Link href="/health-assessment" className="text-blue-600 hover:text-blue-700 font-medium ml-2">
                    Try the full assessment →
                  </Link>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-gray-900">Emergency Fund</p>
                    <p className="text-sm text-gray-600">0-25 points</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-gray-900">Debt Management</p>
                    <p className="text-sm text-gray-600">0-25 points</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-gray-900">Savings Rate</p>
                    <p className="text-sm text-gray-600">0-25 points</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <p className="font-semibold text-gray-900">Knowledge Level</p>
                    <p className="text-sm text-gray-600">0-25 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Achievements */}
        <motion.div
          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Technical Implementation Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/60 rounded-lg p-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">API Integration</h4>
              <p className="text-sm text-gray-700">
                Real market data from IEX Cloud and Federal Reserve FRED APIs with fallback data handling
              </p>
            </div>

            <div className="bg-white/60 rounded-lg p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Speech Integration</h4>
              <p className="text-sm text-gray-700">
                Web Speech API implementation with recognition and synthesis for natural voice interaction
              </p>
            </div>

            <div className="bg-white/60 rounded-lg p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibent text-gray-900 mb-2">Premium Animations</h4>
              <p className="text-sm text-gray-700">
                Framer Motion integration with hydration-safe components and advanced transition effects
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

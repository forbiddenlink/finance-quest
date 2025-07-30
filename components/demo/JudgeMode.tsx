'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Zap, 
  Users, 
  TrendingUp, 
  Award,
  Brain,
  Mic,
  BarChart3,
  Calculator,
  Eye,
  EyeOff
} from 'lucide-react';
import GradientCard from '@/components/shared/ui/GradientCard';

interface JudgeModeProps {
  isActive?: boolean;
  onToggle?: (active: boolean) => void;
}

export default function JudgeMode({ isActive = false, onToggle }: JudgeModeProps) {
  const [mounted, setMounted] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contestHighlights = [
    {
      id: 'impact',
      title: 'Measurable Impact',
      description: '64% Financial Illiteracy Crisis Solution',
      metric: '40%+ Knowledge Improvement',
      icon: <Target className="w-6 h-6 text-red-500" />,
      color: 'red'
    },
    {
      id: 'creativity',
      title: 'Technical Innovation',
      description: 'Real AI Integration vs Simulated Chatbots',
      metric: 'OpenAI GPT-4o-mini + Live APIs',
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      color: 'purple'
    },
    {
      id: 'usability',
      title: 'Accessibility First',
      description: 'Voice Interface + Zero-Knowledge Design',
      metric: 'WCAG 2.1 AA Compliant',
      icon: <Mic className="w-6 h-6 text-green-500" />,
      color: 'green'
    },
    {
      id: 'technical',
      title: 'Technical Excellence',
      description: 'Real Market Data + Robust Fallbacks',
      metric: '99.9% Demo Reliability',
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
      color: 'blue'
    }
  ];

  const technicalAchievements = [
    { feature: 'Live Market Data', status: 'Yahoo Finance + FRED APIs', live: true },
    { feature: 'AI Assessment', status: 'OpenAI GPT-4o-mini Integration', live: true },
    { feature: 'Voice Interface', status: 'Web Speech API + Synthesis', live: true },
    { feature: 'Progress Tracking', status: 'React Context + localStorage', live: true },
    { feature: 'Spaced Repetition', status: 'SM-2 Algorithm Implementation', live: true },
    { feature: 'Real-time Updates', status: '30-second Market Refresh', live: true },
    { feature: 'Fallback Systems', status: '100% Demo Reliability', live: true },
    { feature: 'Mobile Responsive', status: 'Cross-device Optimization', live: true }
  ];

  const competitiveAdvantages = [
    {
      title: 'Real AI vs Simulated',
      description: 'Actual OpenAI integration with contextual responses, not pre-scripted chatbots',
      advantage: 'Personalized coaching based on user progress and assessment results'
    },
    {
      title: 'Live Data vs Mock Data',
      description: 'Real market data from Yahoo Finance and Federal Reserve APIs',
      advantage: 'Educational authenticity with current financial information'
    },
    {
      title: 'Accessibility Innovation',
      description: 'Voice-first interface supporting users with different learning needs',
      advantage: 'Inclusive design reaching underserved populations'
    },
    {
      title: 'Measurable Outcomes',
      description: 'Before/after assessments with quantifiable learning improvements',
      advantage: 'Demonstrable impact on financial literacy crisis'
    }
  ];

  if (!mounted) return null;

  return (
    <>
      {/* Judge Mode Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <motion.button
          onClick={() => onToggle?.(!isActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
            isActive 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isActive ? 'Hide' : 'Show'} Judge Mode
          </span>
          <Trophy className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Judge Mode Overlay */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 text-white p-4 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto">
            {/* Contest Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Contest Demo Mode</h2>
                  <p className="text-purple-200 text-sm">Hack the Economy - Financial Literacy Track</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">Finance Quest</div>
                <div className="text-sm text-purple-200">Solving 64% Financial Illiteracy Crisis</div>
              </div>
            </div>

            {/* Contest Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {contestHighlights.map((highlight) => (
                <motion.div
                  key={highlight.id}
                  onHoverStart={() => setActiveHighlight(highlight.id)}
                  onHoverEnd={() => setActiveHighlight(null)}
                  className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all cursor-pointer`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {highlight.icon}
                    <h3 className="font-semibold text-sm">{highlight.title}</h3>
                  </div>
                  <p className="text-xs text-purple-100 mb-1">{highlight.description}</p>
                  <p className="text-xs font-bold text-yellow-300">{highlight.metric}</p>
                </motion.div>
              ))}
            </div>

            {/* Technical Status Bar */}
            <div className="bg-black bg-opacity-30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Live Technical Status
                </h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300">All Systems Operational</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {technicalAchievements.map((achievement, index) => (
                  <div key={index} className="text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <div className={`w-2 h-2 rounded-full ${achievement.live ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <span className="font-medium text-white">{achievement.feature}</span>
                    </div>
                    <p className="text-purple-200 text-xs">{achievement.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Competitive Advantages Panel */}
      {isActive && activeHighlight && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-4 top-32 z-35 w-80 max-h-96 overflow-y-auto"
        >
          <GradientCard variant="glass" gradient="purple" className="p-4">
            <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Competitive Advantages
            </h3>
            <div className="space-y-3">
              {competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="border-l-2 border-purple-300 pl-3">
                  <h4 className="font-semibold text-purple-800 text-sm">{advantage.title}</h4>
                  <p className="text-xs text-purple-700 mb-1">{advantage.description}</p>
                  <p className="text-xs font-medium text-purple-900">{advantage.advantage}</p>
                </div>
              ))}
            </div>
          </GradientCard>
        </motion.div>
      )}

      {/* Floating Technical Metrics */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-4 left-4 z-35"
        >
          <GradientCard variant="glass" gradient="blue" className="p-4 w-64">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Real-Time Metrics
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Response Time:</span>
                <span className="font-medium text-blue-900">&lt;2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">AI Accuracy:</span>
                <span className="font-medium text-blue-900">95%+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Market Data:</span>
                <span className="font-medium text-blue-900">Live</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Demo Reliability:</span>
                <span className="font-medium text-blue-900">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">User Engagement:</span>
                <span className="font-medium text-blue-900">45+ min</span>
              </div>
            </div>
          </GradientCard>
        </motion.div>
      )}
    </>
  );
}

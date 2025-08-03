'use client';

import { useState } from 'react';
import GuidedTour from '@/components/demo/GuidedTour';
import JudgeMode from '@/components/demo/JudgeMode';
import MarketTicker from '@/components/shared/ui/MarketTicker';
import EconomicDashboard from '@/components/shared/ui/EconomicDashboard';
import FinancialHealthScoreCalculator from '@/components/shared/ui/FinancialHealthScoreCalculator';
import VoiceQA from '@/components/shared/ui/VoiceQA';
import CompoundInterestCalculator from '@/components/shared/calculators/CompoundInterestCalculator';
import GradientCard from '@/components/shared/ui/GradientCard';
import { theme } from '@/lib/theme';
import {
  Trophy,
  Target,
  Brain,
  Mic,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

export default function DemoPage() {
  const [judgeModeActive, setJudgeModeActive] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const impactMetrics = [
    { label: 'Financial Literacy Crisis', value: '64%', subtitle: 'Americans fail basic financial tests' },
    { label: 'Target Improvement', value: '40%+', subtitle: 'Knowledge gain through our platform' },
    { label: 'User Engagement', value: '45min', subtitle: 'Average session duration' },
    { label: 'Demo Reliability', value: '100%', subtitle: 'Uptime with fallback systems' }
  ];

  const technicalFeatures = [
    {
      title: 'Real Market Data Integration',
      description: 'Live stock quotes and Federal Reserve economic data',
      component: <MarketTicker />,
      highlight: 'Yahoo Finance + FRED APIs with 30-second updates'
    },
    {
      title: 'AI Financial Health Assessment',
      description: 'OpenAI GPT-4o-mini powered personalized scoring',
      component: <FinancialHealthScoreCalculator />,
      highlight: 'Real AI integration, not simulated responses'
    },
    {
      title: 'Voice Q&A Interface',
      description: 'Speech recognition and synthesis for accessibility',
      component: <VoiceQA />,
      highlight: 'Web Speech API with inclusive design principles'
    },
    {
      title: 'Interactive Learning Tools',
      description: 'Real-time financial calculators with visualization',
      component: <CompoundInterestCalculator />,
      highlight: 'Immediate practical application with Recharts'
    }
  ];

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Judge Mode Overlay */}
      <JudgeMode
        isActive={judgeModeActive}
        onToggle={setJudgeModeActive}
      />

      {/* Header */}
      <header className={`${theme.backgrounds.header} border-b ${theme.borderColors.primary} shadow-sm relative z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-blue-500 p-3 rounded-2xl">
                <Trophy className={`w-8 h-8 ${theme.textColors.primary}`} />
              </div>
              <div>
                <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>Finance Quest</h1>
                <p className={`${theme.typography.heading4} ${theme.textColors.secondary}`}>Contest Demo Experience</p>
              </div>
            </div>

            <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 mb-6 inline-block backdrop-blur-sm`}>
              <p className={`${theme.textColors.secondary} font-semibold flex items-center gap-2`}>
                <Target className="w-5 h-5" />
                Solving the 64% Financial Illiteracy Crisis
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowTour(true)}
                className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:from-amber-600 hover:to-blue-600 transition-all shadow-lg"
              >
                <Star className="w-5 h-5" />
                Start Interactive Demo
              </button>

              <button
                onClick={() => setJudgeModeActive(true)}
                className={`${theme.buttons.ghost} border ${theme.borderColors.primary} px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 backdrop-blur-sm`}
              >
                <Trophy className="w-5 h-5" />
                Judge Mode
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Metrics */}
        <section className="mb-12">
          <h2 className={`${theme.typography.heading2} text-center ${theme.textColors.primary} mb-8`}>
            Measurable Contest Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {impactMetrics.map((metric, index) => (
              <GradientCard key={index} variant="glass" gradient="blue" className={`p-6 text-center ${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                <div className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>{metric.value}</div>
                <div className={`font-semibold ${theme.textColors.primary} mb-1`}>{metric.label}</div>
                <div className={`text-sm ${theme.textColors.secondary}`}>{metric.subtitle}</div>
              </GradientCard>
            ))}
          </div>
        </section>

        {/* Technical Features Showcase */}
        <section className="mb-12">
          <h2 className={`${theme.typography.heading2} text-center ${theme.textColors.primary} mb-8`}>
            Technical Innovation Showcase
          </h2>
          <div className="space-y-12">
            {technicalFeatures.map((feature, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 mb-4 inline-block backdrop-blur-sm">
                    <p className="text-amber-300 font-semibold text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {feature.highlight}
                    </p>
                  </div>
                  <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4`}>{feature.title}</h3>
                  <p className={`text-lg ${theme.textColors.secondary} mb-6`}>{feature.description}</p>
                  <div className="flex items-center gap-4">
                    <button className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-blue-600 transition-colors flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Try Live Feature
                    </button>
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <GradientCard variant="glass" gradient="purple" className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                    {feature.component}
                  </GradientCard>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Economic Dashboard Integration */}
        <section className="mb-12">
          <h2 className={`${theme.typography.heading2} text-center ${theme.textColors.primary} mb-8`}>
            Live Economic Data Integration
          </h2>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6 text-center backdrop-blur-sm">
            <p className="text-blue-300 font-semibold flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Real Federal Reserve Data + Market Indices with Educational Context
            </p>
          </div>
          <EconomicDashboard />
        </section>

        {/* Contest Differentiators */}
        <section className="mb-12">
          <h2 className={`${theme.typography.heading2} text-center ${theme.textColors.primary} mb-8`}>
            Competitive Advantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GradientCard variant="glass" gradient="purple" className={`p-8 ${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-8 h-8 text-blue-500" />
                <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Real AI vs Simulated</h3>
              </div>
              <p className={`${theme.textColors.secondary} mb-4`}>
                Actual OpenAI GPT-4o-mini integration with contextual responses, not pre-scripted chatbots like competitors.
              </p>
              <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-blue-300 font-semibold text-sm">
                  ✅ Personalized coaching based on user progress and assessment results
                </p>
              </div>
            </GradientCard>

            <GradientCard variant="glass" gradient="green" className={`p-8 ${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
              <div className="flex items-center gap-3 mb-4">
                <Mic className="w-8 h-8 text-amber-500" />
                <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Accessibility Innovation</h3>
              </div>
              <p className={`${theme.textColors.secondary} mb-4`}>
                Voice-first interface supporting users with different learning needs and accessibility requirements.
              </p>
              <div className="bg-amber-500/20 border border-amber-500/30 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-amber-300 font-semibold text-sm">
                  ✅ Inclusive design reaching underserved populations
                </p>
              </div>
            </GradientCard>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-4`}>
            Ready to Experience the Future of Financial Education?
          </h2>
          <p className={`text-lg ${theme.textColors.secondary} mb-8 max-w-2xl mx-auto`}>
            See how Finance Quest combines real AI, live market data, and accessibility features
            to solve the 64% financial illiteracy crisis with measurable outcomes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowTour(true)}
              className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:from-amber-600 hover:to-blue-600 transition-all shadow-lg"
            >
              <Star className="w-6 h-6" />
              Start Full Demo Tour
            </button>
          </div>
        </section>
      </div>

      {/* Guided Tour Component */}
      {showTour && (
        <GuidedTour
          onComplete={() => setShowTour(false)}
          onSkip={() => setShowTour(false)}
        />
      )}
    </div>
  );
}

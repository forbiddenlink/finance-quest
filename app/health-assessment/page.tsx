'use client';

import FinancialHealthScoreCalculator from '@/components/shared/ui/FinancialHealthScoreCalculator';
import EconomicDashboard from '@/components/shared/ui/EconomicDashboard';
import SpacedRepetitionDashboard from '@/components/shared/ui/SpacedRepetitionDashboard';
import { useProgressStore } from '@/lib/store/progressStore';
import { ArrowLeft, Heart, Brain, Target, TrendingUp, Award, BarChart3 } from 'lucide-react';

export default function HealthAssessmentPage() {
  const userProgress = useProgressStore(state => state.userProgress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-amber-400" />
                <h1 className="text-2xl font-bold text-white">Financial Health Center</h1>
              </div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-sm">
              <Heart className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Complete Assessment</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Assess Your Financial Wellness
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get your personalized Financial Health Score and discover exactly which areas
            to focus on for maximum financial improvement. <span className="text-amber-400 font-medium">Takes just 2 minutes!</span>
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:border-amber-500/30 transition-all transform hover:scale-105">
            <Target className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant Scoring</h3>
            <p className="text-sm text-gray-300">Get your grade (A-F) and detailed breakdown immediately</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:border-blue-500/30 transition-all transform hover:scale-105">
            <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Smart Analysis</h3>
            <p className="text-sm text-gray-300">AI-powered insights based on your learning progress</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:border-slate-500/30 transition-all transform hover:scale-105">
            <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Action Plan</h3>
            <p className="text-sm text-gray-300">Prioritized recommendations for maximum impact</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6 text-center hover:shadow-xl hover:border-amber-500/30 transition-all transform hover:scale-105">
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-sm text-gray-300">Monitor improvements over time with retakes</p>
          </div>
        </div>

        {/* Main Assessment */}
        <div className="mb-12">
          <FinancialHealthScoreCalculator />
        </div>

        {/* Economic Dashboard - Real Market Data Integration */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              Real Economic Context
            </h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Understand how current economic conditions affect your financial decisions.
              <span className="text-amber-400 font-medium"> Real data from Federal Reserve and financial markets.</span>
            </p>
          </div>
          <EconomicDashboard />
        </div>

        {/* Spaced Repetition Dashboard - Show if user has completed lessons */}
        {userProgress.completedLessons.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Brain className="w-8 h-8 text-slate-400" />
                Learning Retention Center
              </h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Strengthen your financial knowledge with our scientifically-designed spaced repetition system.
                <span className="text-blue-400 font-medium"> Review key concepts at optimal intervals to maximize long-term retention.</span>
              </p>
            </div>
            <SpacedRepetitionDashboard />
          </div>
        )}

        {/* Educational Context */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Why Financial Health Assessment Matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
              <Target className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-3">Targeted Learning</h4>
              <p className="text-gray-300 text-sm">
                Focus your learning efforts on the areas that will have the biggest impact
                on your financial well-being and future success.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-3">Measurable Progress</h4>
              <p className="text-gray-300 text-sm">
                Track real improvements in your financial health as you complete
                Finance Quest modules and implement proven strategies.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
              <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-3">Personalized Insights</h4>
              <p className="text-gray-300 text-sm">
                Get recommendations tailored to your specific financial situation
                and learning progress through the platform.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

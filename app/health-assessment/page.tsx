'use client';

import FinancialHealthScoreCalculator from '@/components/shared/ui/FinancialHealthScoreCalculator';
import EconomicDashboard from '@/components/shared/ui/EconomicDashboard';
import SpacedRepetitionDashboard from '@/components/shared/ui/SpacedRepetitionDashboard';
import { useProgressStore } from '@/lib/store/progressStore';
import { ArrowLeft, Heart, Brain, Target, TrendingUp, Award, BarChart3 } from 'lucide-react';

export default function HealthAssessmentPage() {
  const userProgress = useProgressStore(state => state.userProgress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-green-600 hover:text-green-800 font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Financial Health Center</h1>
              </div>
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-2">
              <Heart className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Complete Assessment</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Assess Your Financial Wellness
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get your personalized Financial Health Score and discover exactly which areas
            to focus on for maximum financial improvement. Takes just 2 minutes!
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Scoring</h3>
            <p className="text-sm text-gray-600">Get your grade (A-F) and detailed breakdown immediately</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Analysis</h3>
            <p className="text-sm text-gray-600">AI-powered insights based on your learning progress</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Action Plan</h3>
            <p className="text-sm text-gray-600">Prioritized recommendations for maximum impact</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor improvements over time with retakes</p>
          </div>
        </div>

        {/* Main Assessment */}
        <div className="mb-12">
          <FinancialHealthScoreCalculator />
        </div>

        {/* Economic Dashboard - Real Market Data Integration */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Real Economic Context
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understand how current economic conditions affect your financial decisions.
              Real data from Federal Reserve and financial markets.
            </p>
          </div>
          <EconomicDashboard />
        </div>

        {/* Spaced Repetition Dashboard - Show if user has completed lessons */}
        {userProgress.completedLessons.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                Learning Retention Center
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Strengthen your financial knowledge with our scientifically-designed spaced repetition system.
                Review key concepts at optimal intervals to maximize long-term retention.
              </p>
            </div>
            <SpacedRepetitionDashboard />
          </div>
        )}

        {/* Educational Context */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Financial Health Assessment Matters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 rounded-lg p-6 text-center">
              <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-3">Targeted Learning</h4>
              <p className="text-gray-700 text-sm">
                Focus your learning efforts on the areas that will have the biggest impact
                on your financial well-being and future success.
              </p>
            </div>

            <div className="bg-white/60 rounded-lg p-6 text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-3">Measurable Progress</h4>
              <p className="text-gray-700 text-sm">
                Track real improvements in your financial health as you complete
                Finance Quest modules and implement proven strategies.
              </p>
            </div>

            <div className="bg-white/60 rounded-lg p-6 text-center">
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-3">Personalized Insights</h4>
              <p className="text-gray-700 text-sm">
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

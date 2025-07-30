'use client';

import { useState } from 'react';
import { useProgress } from '@/lib/context/ProgressContext';
import ProgressDashboard from '@/components/shared/ui/ProgressDashboard';
import EnhancedProgressDashboard from '@/components/shared/ui/EnhancedProgressDashboard';
import SpacedRepetitionDashboard from '@/components/shared/ui/SpacedRepetitionDashboard';
import LearningAnalyticsDashboard from '@/components/shared/ui/LearningAnalyticsDashboard';
import GradientCard from '@/components/shared/ui/GradientCard';
import { Brain, TrendingUp, Target, Clock, BookOpen, Calculator, Award, ArrowLeft, BarChart3, Code, User } from 'lucide-react';

export default function ProgressPage() {
  const { state } = useProgress();
  const [viewMode, setViewMode] = useState<'user' | 'dev' | 'analytics'>('user');

  const completionStats = {
    lessonsCompleted: state.userProgress.completedLessons.length,
    quizzesPassed: Object.values(state.userProgress.quizScores).filter(score => score >= 80).length,
    calculatorsUsed: Object.keys(state.userProgress.calculatorUsage).length,
    totalTimeSpent: Math.round(state.userProgress.totalTimeSpent / 60), // Convert to minutes
    averageQuizScore: Object.values(state.userProgress.quizScores).length > 0 
      ? Math.round(Object.values(state.userProgress.quizScores).reduce((a, b) => a + b, 0) / Object.values(state.userProgress.quizScores).length)
      : 0
  };

  if (viewMode === 'dev') {
    return <EnhancedProgressDashboard />;
  }

  if (viewMode === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode('user')}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Progress
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Learning Analytics</h1>
              </div>
              <div className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-800">Advanced Analytics</span>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LearningAnalyticsDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Progress Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('user')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'user'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <User className="w-4 h-4" />
                  User View
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'analytics'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => setViewMode('dev')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'dev'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  Dev Progress
                </button>
              </div>
              <div className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-800">AI-Powered Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-space">
            Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-inter">
            Track your progress, review key concepts, and optimize your financial education with AI-powered insights
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GradientCard variant="glass" gradient="blue" className="p-6 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{completionStats.lessonsCompleted}</div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
          </GradientCard>

          <GradientCard variant="glass" gradient="green" className="p-6 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{completionStats.quizzesPassed}</div>
            <div className="text-sm text-gray-600">Quizzes Passed</div>
          </GradientCard>

          <GradientCard variant="glass" gradient="purple" className="p-6 text-center">
            <Calculator className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{completionStats.calculatorsUsed}</div>
            <div className="text-sm text-gray-600">Tools Mastered</div>
          </GradientCard>

          <GradientCard variant="glass" gradient="yellow" className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900 mb-1">{completionStats.totalTimeSpent}</div>
            <div className="text-sm text-gray-600">Minutes Learned</div>
          </GradientCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traditional Progress Dashboard */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Learning Progress
            </h3>
            <ProgressDashboard />
          </div>

          {/* Spaced Repetition Dashboard */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Memory & Retention
            </h3>
            <SpacedRepetitionDashboard />
          </div>
        </div>

        {/* Achievement Section */}
        {completionStats.lessonsCompleted > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-600" />
              Your Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completionStats.lessonsCompleted >= 1 && (
                <GradientCard variant="glass" gradient="green" className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">First Steps</h4>
                      <p className="text-sm text-gray-600">Completed your first lesson!</p>
                    </div>
                  </div>
                </GradientCard>
              )}

              {completionStats.averageQuizScore >= 80 && (
                <GradientCard variant="glass" gradient="blue" className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quiz Master</h4>
                      <p className="text-sm text-gray-600">Maintaining 80%+ quiz scores!</p>
                    </div>
                  </div>
                </GradientCard>
              )}

              {completionStats.calculatorsUsed >= 2 && (
                <GradientCard variant="glass" gradient="purple" className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibent text-gray-900">Tool Expert</h4>
                      <p className="text-sm text-gray-600">Used multiple financial calculators!</p>
                    </div>
                  </div>
                </GradientCard>
              )}
            </div>
          </div>
        )}

        {/* Demo Highlights for Judges */}
        <GradientCard variant="glass" gradient="blue" className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Contest Demo Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">🧠 Spaced Repetition Innovation</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• <strong>SM-2 Algorithm:</strong> Science-based memory optimization for financial concepts</li>
                <li>• <strong>Importance Weighting:</strong> Critical concepts (budgeting, credit) reviewed more frequently</li>
                <li>• <strong>Confidence Integration:</strong> Self-reported confidence affects review scheduling</li>
                <li>• <strong>Retention Analytics:</strong> Real-time mastery and struggling concept identification</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">📊 Enhanced Progress Tracking</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• <strong>30-Chapter Curriculum:</strong> Comprehensive financial education from psychology to planning</li>
                <li>• <strong>Multi-Modal Learning:</strong> Visual, auditory, kinesthetic, and reading/writing styles</li>
                <li>• <strong>Achievement System:</strong> Milestone tracking with personalized recommendations</li>
                <li>• <strong>AI Integration:</strong> Contextual coaching based on learning patterns</li>
              </ul>
            </div>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useProgress } from '@/lib/context/ProgressContext';
import ProgressDashboard from '@/components/shared/ui/ProgressDashboard';
import EnhancedProgressDashboard from '@/components/shared/ui/EnhancedProgressDashboard';
import SpacedRepetitionDashboard from '@/components/shared/ui/SpacedRepetitionDashboard';
import LearningAnalyticsDashboard from '@/components/shared/ui/LearningAnalyticsDashboard';
import GradientCard from '@/components/shared/ui/GradientCard';
import { Brain, Target, Clock, BookOpen, Calculator, Award, ArrowLeft, BarChart3, Code, User } from 'lucide-react';

type ViewMode = 'user' | 'dev' | 'analytics';

export default function ProgressPage() {
  const { state } = useProgress();
  const [viewMode, setViewMode] = useState<ViewMode>('user');

  // Helper function to get button className
  const getButtonClassName = (mode: ViewMode) => {
    const baseClasses = 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors';
    const activeClasses = 'bg-white text-green-600 shadow-sm';
    const inactiveClasses = 'text-gray-600 hover:text-green-600';
    
    return `${baseClasses} ${viewMode === mode ? activeClasses : inactiveClasses}`;
  };

  const completionStats = {
    lessonsCompleted: state.userProgress.completedLessons.length,
    quizzesPassed: Object.values(state.userProgress.quizScores).filter(score => score >= 80).length,
    calculatorsUsed: Object.keys(state.userProgress.calculatorUsage).length,
    totalTimeSpent: Math.round(state.userProgress.totalTimeSpent / 60), // Convert to minutes
    averageQuizScore: Object.values(state.userProgress.quizScores).length > 0 
      ? Math.round(Object.values(state.userProgress.quizScores).reduce((a, b) => a + b, 0) / Object.values(state.userProgress.quizScores).length)
      : 0
  };

  // Handle different view modes with switch statement
  switch (viewMode) {
    case 'dev':
      return <EnhancedProgressDashboard />;
    
    case 'analytics':
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
    
    default:
      // Default user view
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Progress</h1>
          
          {/* View Mode Selector */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">View Mode</h2>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('user')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'user'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <User className="w-4 h-4" />
                  User View
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={getButtonClassName('analytics')}
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => setViewMode('dev')}
                  className={getButtonClassName('dev')}
                >
                  <Code className="w-4 h-4" />
                  Developer
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GradientCard variant="glass" gradient="green" className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-900 mb-2">{completionStats.lessonsCompleted}</div>
              <div className="text-sm text-green-700 font-medium">Lessons Completed</div>
            </GradientCard>

            <GradientCard variant="glass" gradient="blue" className="p-6 text-center">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900 mb-2">{completionStats.quizzesPassed}</div>
              <div className="text-sm text-blue-700 font-medium">Quizzes Passed</div>
            </GradientCard>

            <GradientCard variant="glass" gradient="purple" className="p-6 text-center">
              <Calculator className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-900 mb-2">{completionStats.calculatorsUsed}</div>
              <div className="text-sm text-purple-700 font-medium">Tools Used</div>
            </GradientCard>

            <GradientCard variant="glass" gradient="red" className="p-6 text-center">
              <Clock className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-red-900 mb-2">{completionStats.totalTimeSpent}m</div>
              <div className="text-sm text-red-700 font-medium">Time Spent</div>
            </GradientCard>
          </div>
        </div>

        {/* Main Progress Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ProgressDashboard />
          </div>
          <div>
            <SpacedRepetitionDashboard />
          </div>
        </div>

        {/* Enhanced Features Info */}
        <GradientCard variant="glass" gradient="yellow" className="p-8 mt-8">
          <div className="text-center">
            <Target className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-yellow-900 mb-4">Contest-Ready Learning Analytics</h3>
            <p className="text-lg text-yellow-800 mb-6">
              Finance Quest provides comprehensive progress tracking with advanced analytics 
              to demonstrate measurable learning outcomes for contest evaluation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-yellow-900 mb-3">📊 Analytics Features:</h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• <strong>Spaced Repetition:</strong> SM-2 algorithm implementation</li>
                  <li>• <strong>Learning Analytics:</strong> Detailed progress visualization</li>
                  <li>• <strong>Performance Tracking:</strong> Quiz scores and improvement metrics</li>
                  <li>• <strong>Time Management:</strong> Study session tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-3">🎯 Contest Impact:</h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>• <strong>Measurable Outcomes:</strong> Quantifiable learning progress</li>
                  <li>• <strong>Data-Driven Insights:</strong> Evidence-based improvement</li>
                  <li>• <strong>User Engagement:</strong> Active learning participation metrics</li>
                  <li>• <strong>AI Integration:</strong> Contextual coaching based on learning patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </GradientCard>
      </div>
    </div>
  );
  } // Close switch statement default case
}

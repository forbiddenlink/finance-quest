'use client';

import ProgressDashboard from '@/components/shared/ui/ProgressDashboard';
import { BarChart3, ArrowLeft, Target, TrendingUp, Trophy, CheckCircle } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
            <div className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">Analytics</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Your Financial Education Journey
          </h2>
          <p className="text-indigo-800 mb-4">
            Track your progress, celebrate achievements, and see the measurable impact of your financial education
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Goal-Oriented Learning
              </h3>
              <p className="text-indigo-700">Clear progression through mastery-based chapters</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Measurable Impact
              </h3>
              <p className="text-indigo-700">Real data showing your knowledge growth over time</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Achievement System
              </h3>
              <p className="text-indigo-700">Unlock badges and milestones as you advance</p>
            </div>
          </div>
        </div>

        <ProgressDashboard />

        {/* Additional Context for Demo */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Demo Highlights for Judges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Technical Excellence
              </h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• <strong>Persistent Data:</strong> All progress saved in localStorage across browser sessions</li>
                <li>• <strong>Real AI Integration:</strong> OpenAI GPT-4o-mini provides contextual responses based on user data</li>
                <li>• <strong>Interactive Visualizations:</strong> Recharts library for dynamic progress charts</li>
                <li>• <strong>Global State Management:</strong> React Context handles all user interactions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Educational Impact
              </h4>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• <strong>Mastery-Based:</strong> 80% quiz scores required to advance chapters</li>
                <li>• <strong>Practical Application:</strong> Interactive calculators for hands-on learning</li>
                <li>• <strong>Progress Tracking:</strong> Visual metrics show knowledge retention and growth</li>
                <li>• <strong>Measurable Outcomes:</strong> Clear before/after assessment capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import FinancialHealthAssessment from '@/components/shared/ui/FinancialHealthAssessment';
import { ArrowLeft, Heart } from 'lucide-react';

export default function HealthAssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
              <h1 className="text-2xl font-bold text-gray-900">Financial Health Assessment</h1>
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-2">
              <Heart className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Instant Results</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FinancialHealthAssessment />
      </div>
    </div>
  );
}

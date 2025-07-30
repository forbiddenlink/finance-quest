'use client';

import { useState } from 'react';
import MoneyFundamentalsLesson from '@/components/chapters/fundamentals/lessons/MoneyFundamentalsLesson';
import PaycheckCalculator from '@/components/chapters/fundamentals/calculators/PaycheckCalculator';
import MoneyFundamentalsQuiz from '@/components/chapters/fundamentals/assessments/MoneyFundamentalsQuiz';
import AITeachingAssistant from '@/components/shared/ai-assistant/AITeachingAssistant';
import QASystem from '@/components/shared/QASystem';
import { BookOpen, Calculator, FileText, Bot, Lightbulb, Target } from 'lucide-react';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'assistant';

export default function Chapter1Page() {
  const [activeTab, setActiveTab] = useState<TabType>('lesson');

  const tabs = [
    { id: 'lesson' as TabType, label: 'Lessons', icon: BookOpen },
    { id: 'calculator' as TabType, label: 'Calculator', icon: Calculator },
    { id: 'quiz' as TabType, label: 'Quiz', icon: FileText },
    { id: 'assistant' as TabType, label: 'AI Coach', icon: Bot }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Chapter 1: Money Fundamentals</h1>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-800">Progress: 25%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'lesson' && (
            <div>
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Learning Path
                </h3>
                <p className="text-blue-800">
                  Complete all lessons, try the calculator, then take the quiz to unlock Chapter 2!
                </p>
              </div>
              <MoneyFundamentalsLesson />
              
              {/* Q&A System for Lesson Tab */}
              <QASystem 
                className="mt-6"
                isQuizMode={false}
              />
            </div>
          )}

          {activeTab === 'calculator' && (
            <div>
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Practice Tool
                </h3>
                <p className="text-green-800">
                  Use this calculator to understand how taxes affect your paycheck. Try different amounts!
                </p>
              </div>
              <PaycheckCalculator />
              
              {/* Q&A System for Calculator Tab */}
              <QASystem 
                className="mt-6"
                isQuizMode={false}
              />
            </div>
          )}

          {activeTab === 'quiz' && (
            <div>
              <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Knowledge Check
                </h3>
                <p className="text-purple-800">
                  Test your understanding! You need 80% to unlock the next chapter.
                </p>
              </div>
              <MoneyFundamentalsQuiz />
              
              {/* Q&A System DISABLED during quiz */}
              <QASystem 
                className="mt-6"
                isQuizMode={true}
              />
            </div>
          )}

          {activeTab === 'assistant' && (
            <div>
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Financial Coach
                </h3>
                <p className="text-blue-800">
                  Ask questions, get personalized help, and receive encouragement on your learning journey!
                </p>
              </div>
              <AITeachingAssistant />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

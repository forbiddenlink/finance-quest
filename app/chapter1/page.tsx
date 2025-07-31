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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold text-white">Chapter 1: Money Psychology & Mindset</h1>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="text-sm font-medium text-amber-300">Progress: 25%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-1 mb-6">
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-amber-600 text-slate-900 shadow-lg shadow-amber-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
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
              <div className="mb-6 bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Learning Path
                </h3>
                <p className="text-amber-200">
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
              <div className="mb-6 bg-amber-900/20 border border-amber-700/30 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Practice Tool
                </h3>
                <p className="text-amber-200">
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
              <div className="mb-6 bg-slate-800/30 border border-slate-600/30 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Knowledge Check
                </h3>
                <p className="text-slate-400">
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
              <div className="mb-6 bg-gradient-to-r from-blue-900/20 to-slate-800/20 border border-blue-700/30 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Financial Coach
                </h3>
                <p className="text-blue-200">
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

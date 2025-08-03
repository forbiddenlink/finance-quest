'use client';

import { useState } from 'react';
import MoneyFundamentalsLessonEnhanced from '@/components/chapters/fundamentals/lessons/MoneyFundamentalsLessonEnhanced';
import PaycheckCalculator from '@/components/chapters/fundamentals/calculators/PaycheckCalculator';
import MoneyFundamentalsQuizEnhanced from '@/components/chapters/fundamentals/assessments/MoneyFundamentalsQuizEnhanced';
import AITeachingAssistant from '@/components/shared/ai-assistant/AITeachingAssistant';
import QASystem from '@/components/shared/QASystem';
import { theme } from '@/lib/theme';
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
    <div className={theme.backgrounds.primary}>
      {/* Header */}
      <header className={`${theme.backgrounds.header} ${theme.borderColors.primary} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className={`${theme.textColors.primary} hover:${theme.textColors.secondary} font-medium transition-colors`}
              >
                ← Back to Home
              </button>
              <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>Chapter 1: Money Psychology & Mindset</h1>
            </div>
            <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} px-3 py-1 rounded-full backdrop-blur-sm`}>
              <span className={`text-sm font-medium ${theme.textColors.secondary}`}>Progress: 25%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`${theme.tabs.container} rounded-lg p-1 mb-6`}>
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${activeTab === tab.id
                  ? theme.tabs.active + ' shadow-lg shadow-amber-600/25'
                  : theme.tabs.inactive
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
              <div className={`mb-6 ${theme.status.info.bg} border ${theme.status.info.border} backdrop-blur-sm rounded-lg p-4`}>
                <h3 className={`font-semibold ${theme.textColors.secondary} mb-2 flex items-center gap-2`}>
                  <Lightbulb className="w-4 h-4" />
                  Learning Path
                </h3>
                <p className={theme.textColors.secondary}>
                  Complete all lessons, try the calculator, then take the quiz to unlock Chapter 2!
                </p>
              </div>
              <MoneyFundamentalsLessonEnhanced />

              {/* Q&A System for Lesson Tab */}
              <QASystem
                className="mt-6"
                isQuizMode={false}
              />
            </div>
          )}

          {activeTab === 'calculator' && (
            <div>
              <div className={`mb-6 ${theme.status.warning.bg} border ${theme.status.warning.border} backdrop-blur-sm rounded-lg p-4`}>
                <h3 className={`font-semibold ${theme.status.warning.text} mb-2 flex items-center gap-2`}>
                  <Calculator className="w-4 h-4" />
                  Practice Tool
                </h3>
                <p className={theme.textColors.secondary}>
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
              <div className={`mb-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
                <h3 className={`font-semibold ${theme.textColors.secondary} mb-2 flex items-center gap-2`}>
                  <Target className="w-4 h-4" />
                  Knowledge Check
                </h3>
                <p className={theme.textColors.muted}>
                  Test your understanding! You need 80% to unlock the next chapter.
                </p>
              </div>
              <MoneyFundamentalsQuizEnhanced />

              {/* Q&A System DISABLED during quiz */}
              <QASystem
                className="mt-6"
                isQuizMode={true}
              />
            </div>
          )}

          {activeTab === 'assistant' && (
            <div>
              <div className={`mb-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
                <h3 className={`font-semibold ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                  <Bot className="w-4 h-4" />
                  AI Financial Coach
                </h3>
                <p className={theme.textColors.secondary}>
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

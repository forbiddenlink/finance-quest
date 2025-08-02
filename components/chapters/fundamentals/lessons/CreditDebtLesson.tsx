'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  CreditCard,
  AlertTriangle,
  Calculator,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Brain,
  Target,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CreditDebtLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "Understanding Credit Scores: Your Financial Report Card",
    content: "Your credit score is a three-digit number (300-850) that determines your financial opportunities and costs. Think of it as your financial reputation - it affects everything from loan approvals to interest rates, apartment rentals, and even job opportunities. A strong credit score can save you tens of thousands in interest over your lifetime.",
    keyPoints: [
      "Payment history (35%) - Never miss a payment, even if only the minimum",
      "Credit utilization (30%) - Keep balances below 30% of limits, ideally under 10%",
      "Length of credit history (15%) - Keep old accounts open to maintain history",
      "Credit mix (10%) - Mix of credit cards, loans shows responsible management",
      "New credit (10%) - Limit hard inquiries to preserve your score"
    ]
  },
  {
    title: "Good Debt vs Bad Debt: Strategic Borrowing",
    content: "Not all debt is created equal. Good debt helps you build wealth or increase income over time, while bad debt drains your resources on depreciating assets. Understanding this difference is crucial for making smart financial decisions and building long-term wealth instead of financial stress.",
    keyPoints: [
      "Good debt: Mortgages (3-7%), student loans (3-8%), business loans (4-10%)",
      "Bad debt: Credit cards (15-25%), car loans (4-12%), payday loans (300-400%)",
      "Interest rate rule: 0-8% acceptable, 8-15% pay quickly, 15%+ eliminate immediately",
      "Good debt appreciates or generates income; bad debt depreciates rapidly",
      "Refinance opportunities can turn bad debt into more manageable payments"
    ]
  },
  {
    title: "Debt Elimination Strategies: Your Path to Freedom",
    content: "Two proven methods exist for eliminating debt: the psychological snowball method and the mathematical avalanche method. The snowball focuses on smallest balances first for quick wins and motivation, while avalanche targets highest interest rates for maximum savings. Choose based on your personality and financial situation.",
    keyPoints: [
      "Debt Snowball: Pay minimums + attack smallest balance (better for motivation)",
      "Debt Avalanche: Pay minimums + attack highest interest rate (saves more money)",
      "Both methods work - consistency matters more than perfection",
      "Track progress visually to maintain motivation throughout the journey",
      "Roll payments from eliminated debts into the next target for acceleration"
    ]
  },
  {
    title: "Building Excellent Credit: Your Long-Term Strategy",
    content: "Building excellent credit (740+ score) is a marathon, not a sprint. It requires consistent good habits over 2+ years, but the rewards are substantial: better interest rates, easier approvals, lower insurance premiums, and more financial opportunities. The key is automating good habits and avoiding common mistakes.",
    keyPoints: [
      "Timeline: 3 months foundation, 6-12 months building, 2+ years optimization",
      "Start with secured card if needed, maintain perfect payment history",
      "Request credit limit increases every 6 months to improve utilization ratio",
      "Monitor credit reports quarterly and dispute errors immediately",
      "Avoid credit killers: late payments, maxed cards, closing old accounts"
    ]
  }
];

export default function CreditDebtLesson({ onComplete }: CreditDebtLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`credit-debt-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `credit-debt-${currentLesson}`;
    completeLesson(lessonId, 18);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    // Show success toast
    toast.success(`"${lesson.title}" completed!`, {
      duration: 3000,
      position: 'top-center',
    });

    // Call parent completion callback when all lessons are done
    if (currentLesson === lessons.length - 1) {
      onComplete?.();
    }
  };

  const nextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const lesson = lessons[currentLesson];
  const progress = ((currentLesson + 1) / lessons.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Enhanced Progress Ring */}
      <div className="flex justify-center mb-6">
        <ProgressRing
          progress={progress}
          size={100}
          color="#EF4444"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="red" className="p-8">
        {/* Header with Icons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.error.bg} p-2 rounded-lg animate-float`}>
                <CreditCard className={`w-6 h-6 ${theme.status.error.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.error.text} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 4: Credit & Debt Management
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 animate-fade-in-up stagger-2 gradient-text-red`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6 animate-fade-in-up stagger-3`}>
            {lesson.content}
          </p>

          {/* Enhanced Key Points */}
          <GradientCard variant="glass" gradient="purple" className="p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.warning.bg} p-2 rounded-lg mr-3 animate-wiggle`}>
                <Star className={`w-5 h-5 ${theme.status.warning.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className={`flex items-start animate-slide-in-right stagger-${(index % 4) + 1}`}>
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.warning.bg} rounded-full flex items-center justify-center mt-1 mr-3 animate-glow-pulse`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>
        </div>

        {/* Interactive Exercises for Better Retention */}
        {currentLesson === 0 && (
          <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.accent} mb-3 flex items-center gap-2`}>
              <Shield className="w-5 h-5" />
              Credit Score Assessment
            </h3>
            <div className={`${theme.textColors.secondary} space-y-3`}>
              <p className={`font-medium ${theme.textColors.primary}`}>Evaluate your current credit health:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.status.error.text} mb-2`}>Poor (300-579)</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Focus on payment history and reducing utilization</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.status.warning.text} mb-2`}>Fair (580-739)</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Optimize utilization and build credit mix</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.status.success.text} mb-2`}>Excellent (740+)</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Maintain good habits and monitor regularly</p>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.textColors.accent}`}>
                💡 <strong>Free Credit Check:</strong> Check your score monthly through Credit Karma, your bank app, or annualcreditreport.com
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <AlertTriangle className="w-5 h-5" />
              Debt Categorization Exercise
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`font-medium ${theme.textColors.primary} mb-2`}>Rate Your Current Debts:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`font-medium ${theme.status.success.text} mb-2`}>✅ Good Debt (Keep/Strategic):</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Mortgage: Builds equity, tax benefits</li>
                      <li>Student loans: Increases earning potential</li>
                      <li>Business loans: Generates income</li>
                      <li>Investment property loans</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`font-medium ${theme.status.error.text} mb-2`}>❌ Bad Debt (Eliminate ASAP):</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Credit cards: High interest, depreciating purchases</li>
                      <li>Car loans: Vehicle depreciates rapidly</li>
                      <li>Payday loans: Predatory interest rates</li>
                      <li>Personal loans for consumption</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.warning.text}`}>
                💡 <strong>Action Step:</strong> List your debts with interest rates and categorize each one!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <Brain className="w-5 h-5" />
              Choose Your Debt Strategy
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Brain className="w-4 h-4 text-purple-400" />
                    Debt Snowball
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>Pay smallest balances first</p>
                  <p className={`text-xs ${theme.status.success.text}`}>✅ Best for: Need motivation and quick wins</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Calculator className="w-4 h-4 text-blue-400" />
                    Debt Avalanche
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>Pay highest interest rates first</p>
                  <p className={`text-xs ${theme.status.success.text}`}>✅ Best for: Want to save maximum money</p>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.info.text}`}>
                💡 <strong>Both work!</strong> Choose the method you&apos;ll stick with consistently.
              </p>
            </div>
          </div>
        )}

        {currentLesson === 3 && (
          <div className={`mb-8 p-6 ${theme.status.success.bg} rounded-lg border-l-4 ${theme.status.success.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Credit Building Action Plan
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    Months 1-3
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Foundation: Open first credit account, perfect payment history</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    Months 6-12
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Building: Add accounts, request limit increases</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Target className="w-4 h-4 text-purple-400" />
                    Year 2+
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Optimization: 700+ score, premium cards, diverse mix</p>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.success.text}`}>
                💡 <strong>Remember:</strong> Excellent credit takes time but pays dividends for life!
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Navigation */}
        <div className="flex items-center justify-between animate-fade-in-up stagger-4">
          <div className="flex space-x-3">
            <button
              onClick={prevLesson}
              disabled={currentLesson === 0}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.accent} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === lessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.accent} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {!completedLessons[currentLesson] && (
              <button
                onClick={markComplete}
                className={`group flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift morph-button animate-glow-pulse`}
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Mark Complete
              </button>
            )}
            {completedLessons[currentLesson] && (
              <div className={`flex items-center px-6 py-3 ${theme.status.success.bg} ${theme.status.success.text} rounded-xl font-medium animate-bounce-in`}>
                <CheckCircle className="w-5 h-5 mr-2 animate-wiggle" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Completion Status */}
        <div className={`mt-6 pt-6 border-t ${theme.borderColors.primary}`}>
          <div className={`flex items-center justify-between text-sm ${theme.textColors.secondary}`}>
            <span>Progress: {completedLessons.filter(Boolean).length} of {lessons.length} lessons completed</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  PieChart,
  TrendingUp,
  DollarSign,
  Calculator,
  Target,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Star,
  Wallet,
  CreditCard,
  Home,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BudgetingMasteryLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "The 50/30/20 Rule: Your Financial Foundation",
    content: "The 50/30/20 budgeting rule is the most effective framework for building wealth while maintaining quality of life. This system automatically balances your immediate needs, personal enjoyment, and long-term financial security. Warren Buffett calls it &apos;the simplest path to financial freedom.&apos;",
    keyPoints: [
      "50% Needs: Housing, utilities, groceries, minimum debt payments, insurance",
      "30% Wants: Dining out, entertainment, hobbies, non-essential shopping",
      "20% Savings & Debt: Emergency fund, retirement, extra debt payments",
      "Automate transfers to make budgeting effortless and consistent",
      "Adjust percentages based on income level and life circumstances"
    ]
  },
  {
    title: "Zero-Based Budgeting: Every Dollar Has a Purpose",
    content: "Zero-based budgeting assigns every dollar a specific job before you spend it. This method eliminates money &apos;leaks&apos; and increases savings rates by 15-25% on average. When every dollar has a purpose, you gain complete control over your financial destiny.",
    keyPoints: [
      "Income minus all planned expenses and savings equals zero",
      "Prevents lifestyle inflation by giving structure to extra income",
      "Identifies spending patterns and eliminates unconscious money waste",
      "Build categories: Fixed expenses → Variable needs → Savings goals → Fun money",
      "Review and adjust monthly based on actual spending vs planned"
    ]
  },
  {
    title: "Emergency Fund Integration: Budget-First Approach",
    content: "Your emergency fund shouldn&apos;t be an afterthought—it&apos;s the foundation that makes every other budget category possible. A properly funded emergency account prevents budget destruction during life&apos;s inevitable challenges and gives you confidence to stick to your plan.",
    keyPoints: [
      "Start with $1,000 minimum emergency fund before optimizing other categories",
      "Build 3-6 months of expenses for complete budget security",
      "High-yield savings account keeps funds accessible but growing at 4-5% APY",
      "Stable income = 3 months, Variable income = 6+ months buffer needed",
      "Automate emergency fund contributions as a non-negotiable budget line item"
    ]
  },
  {
    title: "Advanced Budgeting: Envelope Method & Sinking Funds",
    content: "Advanced budgeting techniques prevent financial surprises and create systematic wealth building. Envelope budgeting ensures you never overspend categories, while sinking funds prepare for irregular expenses. These methods turn budgeting from restriction into empowerment.",
    keyPoints: [
      "Digital envelopes: Separate accounts or apps for each spending category",
      "Sinking funds: Save monthly for annual expenses (insurance, gifts, vacation)",
      "Irregular income budgeting: Base budget on lowest month, extra goes to priorities",
      "Percentage-based budgeting scales automatically with income changes",
      "Track weekly to stay on course, adjust monthly to optimize system"
    ]
  }
];

export default function BudgetingMasteryLesson({ onComplete }: BudgetingMasteryLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`budgeting-mastery-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `budgeting-mastery-${currentLesson}`;
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
          color="#8B5CF6"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="purple" className="p-8">
        {/* Header with Icons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.success.bg} p-2 rounded-lg animate-float`}>
                <PieChart className={`w-6 h-6 ${theme.status.success.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.success.text} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 6: Budgeting Mastery
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 animate-fade-in-up stagger-2 gradient-text-purple`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6 animate-fade-in-up stagger-3`}>
            {lesson.content}
          </p>

          {/* Enhanced Key Points */}
          <GradientCard variant="glass" gradient="blue" className="p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.info.bg} p-2 rounded-lg mr-3 animate-wiggle`}>
                <Star className={`w-5 h-5 ${theme.status.info.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className={`flex items-start animate-slide-in-right stagger-${(index % 4) + 1}`}>
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.info.bg} rounded-full flex items-center justify-center mt-1 mr-3 animate-glow-pulse`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.info.text}`} />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>
        </div>

        {/* Interactive Exercises for Better Retention */}
        {currentLesson === 0 && (
          <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              50/30/20 Budget Calculator
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <p className={`font-medium ${theme.textColors.primary}`}>Calculate your ideal budget breakdown:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <Wallet className={`w-8 h-8 mx-auto mb-3 ${theme.status.success.text}`} />
                  <div className={`text-2xl font-bold ${theme.status.success.text}`}>50%</div>
                  <div className={`text-sm ${theme.textColors.secondary} mb-2`}>Needs</div>
                  <div className={`text-xs ${theme.textColors.muted}`}>Housing, utilities, groceries, insurance</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <CreditCard className={`w-8 h-8 mx-auto mb-3 ${theme.status.info.text}`} />
                  <div className={`text-2xl font-bold ${theme.status.info.text}`}>30%</div>
                  <div className={`text-sm ${theme.textColors.secondary} mb-2`}>Wants</div>
                  <div className={`text-xs ${theme.textColors.muted}`}>Entertainment, dining out, hobbies</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <TrendingUp className={`w-8 h-8 mx-auto mb-3 ${theme.textColors.primary}`} />
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>20%</div>
                  <div className={`text-sm ${theme.textColors.secondary} mb-2`}>Savings & Debt</div>
                  <div className={`text-xs ${theme.textColors.muted}`}>Emergency fund, retirement, extra payments</div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.textColors.primary}`}>
                💡 <strong>Monthly Income:</strong> $______ | <strong>Needs:</strong> $______ | <strong>Wants:</strong> $______ | <strong>Savings:</strong> $______
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Zero-Based Budget Template
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`font-medium ${theme.textColors.primary} mb-3`}>Monthly Budget Allocation:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`font-medium ${theme.status.success.text} mb-2`}>📋 Fixed Expenses:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Rent/Mortgage: $______</li>
                      <li>Insurance: $______</li>
                      <li>Debt minimums: $______</li>
                      <li>Utilities: $______</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`font-medium ${theme.status.info.text} mb-2`}>🛒 Variable Expenses:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Groceries: $______</li>
                      <li>Transportation: $______</li>
                      <li>Entertainment: $______</li>
                      <li>Personal care: $______</li>
                    </ul>
                  </div>
                </div>
                <div className={`mt-4 p-3 ${theme.textColors.primary}/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <p className={`font-medium ${theme.textColors.primary} text-center`}>
                    <span className={theme.textColors.primary}>Income - Expenses - Savings = $0</span>
                    <br />
                    <span className={`text-sm ${theme.textColors.secondary}`}>Every dollar assigned before spending!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.success.bg} rounded-lg border-l-4 ${theme.status.success.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <Home className="w-5 h-5" />
              Emergency Fund Budget Integration
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <p className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <AlertTriangle className={`w-4 h-4 ${theme.status.warning.text}`} />
                    Emergency Fund Priority
                  </p>
                  <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                    <li>$1,000 starter emergency fund first</li>
                    <li>Then focus on debt elimination</li>
                    <li>Build full 3-6 month fund last</li>
                    <li>High-yield savings account (4-5% APY)</li>
                  </ul>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <p className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <DollarSign className={`w-4 h-4 ${theme.status.success.text}`} />
                    Monthly Calculation
                  </p>
                  <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                    <li>Monthly expenses: $______</li>
                    <li>Target fund (3-6x): $______</li>
                    <li>Monthly contribution: $______</li>
                    <li>Months to goal: ______</li>
                  </ul>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.success.text}`}>
                💡 <strong>Budget Rule:</strong> Emergency fund = Peace of mind + Budget protection!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 3 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              Advanced Budgeting Strategies
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Wallet className={`w-4 h-4 ${theme.status.info.text}`} />
                    Envelope Method
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                    <li>Separate account/card for each category</li>
                    <li>When envelope is empty, spending stops</li>
                    <li>Prevents overspending automatically</li>
                    <li>Digital apps make this effortless</li>
                  </ul>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Target className={`w-4 h-4 ${theme.textColors.primary}`} />
                    Sinking Funds
                  </h4>
                  <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                    <li>Car insurance: $1,200 ÷ 12 = $100/month</li>
                    <li>Vacation: $2,400 ÷ 12 = $200/month</li>
                    <li>Holiday gifts: $600 ÷ 12 = $50/month</li>
                    <li>Home maintenance: $1,800 ÷ 12 = $150/month</li>
                  </ul>
                </div>
              </div>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`font-medium ${theme.textColors.primary} mb-2`}>Irregular Income Strategy:</p>
                <p className={`${theme.textColors.secondary} text-sm`}>
                  Base your budget on your lowest earning month from the past year. Any income above that amount goes to:
                  1) Extra debt payments, 2) Boosting emergency fund, 3) Investing for the future.
                </p>
              </div>
              <p className={`mt-4 font-medium ${theme.status.info.text}`}>
                💡 <strong>Pro Tip:</strong> Advanced budgeting turns surprises into planned events!
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
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === lessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
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

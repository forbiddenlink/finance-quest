'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Building2,
  CreditCard,
  PiggyBank,
  DollarSign,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BankingFundamentalsLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "Banking Account Types: Your Financial Foundation",
    content: "Understanding different account types is like knowing the different tools in a toolbox - each one serves a specific purpose in your financial life. Choosing the right accounts can save you hundreds in fees while maximizing your earning potential.",
    keyPoints: [
      "Checking accounts for daily transactions - focus on low fees and convenience",
      "Savings accounts for emergency funds - prioritize high interest rates and FDIC insurance", 
      "Money market accounts offer higher rates with more flexibility but require higher balances",
      "Online banks typically offer 10-100x higher interest rates than traditional banks"
    ]
  },
  {
    title: "Banking Fees: The Silent Wealth Killer",
    content: "Banking fees cost the average American $329 per year - that&apos;s money stolen from your future. Learning to avoid these fees is like giving yourself an instant pay raise. Most fees are completely avoidable with the right knowledge and banking setup.",
    keyPoints: [
      "Monthly maintenance fees can cost $120-180/year - avoid with minimum balance or direct deposit",
      "Overdraft fees average $35 per incident - set up alerts and overdraft protection to avoid",
      "ATM fees can cost $50-100/year - use in-network ATMs or banks with fee reimbursement",
      "Smart bank selection can save you $300+ annually in fees alone"
    ]
  },
  {
    title: "Optimizing Your Banking Strategy",
    content: "The right banking setup works harder for you, earning more while costing less. Most successful savers use a 'banking trifecta' combining local convenience with online bank rates for maximum benefit.",
    keyPoints: [
      "Primary checking at local credit union for daily needs and ATM access",
      "High-yield savings online earning 4-5% APY vs 0.01% at traditional banks",
      "Automate transfers: 70% checking, 20% savings, 10% investments from direct deposit",
      "A $10,000 emergency fund earns $449 more per year in high-yield vs traditional savings"
    ]
  }
];

export default function BankingFundamentalsLesson({ onComplete }: BankingFundamentalsLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`banking-fundamentals-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `banking-fundamentals-${currentLesson}`;
    completeLesson(lessonId, 12);

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
          color="#3B82F6"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="blue" className="p-8">
        {/* Header with Icons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.info.bg} p-2 rounded-lg animate-float`}>
                <Building2 className={`w-6 h-6 ${theme.status.info.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.info.text} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 2: Banking Fundamentals
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 animate-fade-in-up stagger-2 gradient-text-blue`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6 animate-fade-in-up stagger-3`}>
            {lesson.content}
          </p>

          {/* Enhanced Key Points */}
          <GradientCard variant="glass" gradient="green" className="p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.success.bg} p-2 rounded-lg mr-3 animate-wiggle`}>
                <Star className={`w-5 h-5 ${theme.status.success.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className={`flex items-start animate-slide-in-right stagger-${(index % 4) + 1}`}>
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.success.bg} rounded-full flex items-center justify-center mt-1 mr-3 animate-glow-pulse`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text}`} />
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
              <Lightbulb className="w-5 h-5" />
              Banking Account Assessment
            </h3>
            <div className={`${theme.textColors.secondary} space-y-3`}>
              <p className={`font-medium ${theme.textColors.primary}`}>Think about your current banking setup:</p>
              <ul className={`list-disc list-inside space-y-2 ml-4 ${theme.textColors.secondary}`}>
                <li>What type of accounts do you currently have?</li>
                <li>How much are you paying in monthly fees?</li>
                <li>What interest rate are you earning on savings?</li>
                <li>How convenient is your current bank for daily needs?</li>
              </ul>
              <p className={`mt-4 font-medium ${theme.textColors.primary}`}>
                💡 <strong>Key Insight:</strong> The average person uses only 1-2 account types but could benefit from 3-4 specialized accounts for different purposes!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <AlertCircle className="w-5 h-5" />
              Fee Calculator Challenge
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`font-medium ${theme.textColors.primary} mb-2`}>Scenario: Traditional Bank vs Smart Banking</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`font-medium ${theme.status.error.text} mb-2`}>❌ Traditional Bank:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Monthly maintenance: $15/month</li>
                      <li>Overdraft fees: $35 × 3/year</li>
                      <li>ATM fees: $3 × 20/year</li>
                      <li>Savings interest: 0.01% APY</li>
                      <li><strong>Total annual cost: $345</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className={`font-medium ${theme.status.success.text} mb-2`}>✅ Smart Banking:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Free checking with direct deposit</li>
                      <li>Overdraft protection (free alerts)</li>
                      <li>Fee-free ATM network</li>
                      <li>High-yield savings: 4.5% APY</li>
                      <li><strong>Annual savings: $795</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.warning.text}`}>
                💡 <strong>Total Impact:</strong> Smart banking saves you $1,140+ per year - that&apos;s a week&apos;s vacation!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5" />
              Banking Optimization Plan
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <CreditCard className={`w-4 h-4 ${theme.status.info.text}`} />
                    Step 1: Daily Banking
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Local credit union or bank with free checking, good ATM network, and excellent customer service.</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <PiggyBank className={`w-4 h-4 ${theme.status.success.text}`} />
                    Step 2: High-Yield Savings
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Online bank offering 4-5% APY for emergency fund and short-term goals.</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <DollarSign className={`w-4 h-4 ${theme.textColors.primary}`} />
                    Step 3: Goal Accounts
                  </h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Separate savings for vacation, car, home down payment - makes goals visual and achievable.</p>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.info.text}`}>
                💡 <strong>Pro Tip:</strong> Set up automatic transfers on payday - pay yourself first before you can spend it!
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

'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Building2,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Shield,
  Target,
  Calculator
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BankingFundamentalsLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
  practicalAction: string;
  moneyExample: string;
  warningTip?: string;
}

const enhancedLessons: LessonContent[] = [
  {
    title: "Banking Account Types: Your Financial Foundation",
    content: "Understanding different account types is like knowing the tools in a toolbox - each serves a specific purpose. The right account setup can save you hundreds in fees while maximizing your earning potential. Most people use the wrong accounts and lose money unnecessarily.",
    keyPoints: [
      "Checking accounts: Daily transactions, bill payments, debit card access",
      "Savings accounts: Emergency funds, short-term goals, FDIC protection up to $250,000",
      "High-yield savings: 4-5% APY vs 0.01% at traditional banks (50x-500x more earnings)",
      "Money market accounts: Higher rates with check-writing, but require higher balances ($2,500+)"
    ],
    practicalAction: "Open a high-yield savings account this week and transfer at least $100 to start earning real interest",
    moneyExample: "A $5,000 emergency fund earns $2.50/year at big banks vs $250/year at online banks - that's $247 in free money!",
    warningTip: "Avoid savings accounts with less than 2% APY - you're losing money to inflation"
  },
  {
    title: "Banking Fees: The $300+ Annual Wealth Leak",
    content: "Banking fees cost the average American $329 per year - that's $6,580 over 20 years that could have grown to $13,000+ if invested. Most fees are completely avoidable with smart banking choices. Every fee you pay is money stolen from your future wealth.",
    keyPoints: [
      "Monthly maintenance fees: $12-15/month = $144-180/year (avoid with direct deposit/minimum balance)",
      "Overdraft fees: $35 per incident, average person pays 4x/year = $140 (set up alerts instead)",
      "ATM fees: $3-5 per transaction, adds up to $100+/year (use in-network ATMs)",
      "Total avoidable fees: $300-400/year = $60,000+ over lifetime if invested at 7% return"
    ],
    practicalAction: "Calculate your banking fees from last year and switch to a no-fee bank if you paid more than $50",
    moneyExample: "Sarah paid $25/month in various banking fees ($300/year). She switched to a credit union and online bank combo - now pays $0 in fees, saving $300 annually.",
    warningTip: "Banks make billions in fee revenue - they count on customer laziness and lack of awareness"
  },
  {
    title: "The Optimal Banking Setup Strategy",
    content: "Successful savers use a strategic 'banking trifecta' combining local convenience with online rates. This setup maximizes interest earnings while maintaining easy access to cash. The goal is to make your money work harder while simplifying your financial life.",
    keyPoints: [
      "Primary checking: Local credit union/community bank (lower fees, better service)",
      "High-yield savings: Online bank (4-5% APY, no fees, easy transfers)",
      "Emergency fund: Keep 3-6 months expenses in high-yield savings, easily accessible",
      "Automation: Set up direct deposit splits - checking for bills, savings for goals"
    ],
    practicalAction: "Set up automatic transfers: $200/month to high-yield savings for emergency fund, starting this week",
    moneyExample: "The 'banking trifecta' on a $60,000 salary: $3,000 checking (local bank), $15,000 emergency fund earning $750/year (online bank), $5,000 short-term savings earning $250/year",
    warningTip: "Don't keep large amounts in low-interest checking accounts - you're missing out on hundreds in earnings"
  },
  {
    title: "FDIC Protection: Your Money's Safety Net",
    content: "FDIC insurance protects your deposits up to $250,000 per depositor, per bank. This government backing means your money is safer in FDIC banks than hiding it under your mattress. Understanding FDIC limits helps you protect larger amounts and sleep better at night.",
    keyPoints: [
      "FDIC covers up to $250,000 per depositor, per insured bank, per ownership category",
      "If your bank fails, FDIC typically provides access to funds within 1-2 business days",
      "Credit unions have similar protection through NCUA (National Credit Union Administration)",
      "For amounts over $250,000, spread across multiple banks to maintain full protection"
    ],
    practicalAction: "Verify your banks are FDIC insured using the FDIC website tool, and calculate your coverage limits",
    moneyExample: "John has $400,000 to protect: $250,000 at Bank A (fully covered), $150,000 at Bank B (fully covered) = $400,000 total protection vs $250,000 at one bank",
    warningTip: "Investment accounts, crypto, and some online-only banks may not have FDIC protection - always verify"
  },
  {
    title: "Digital Banking: Security and Efficiency",
    content: "Digital banking tools can save you time and money while improving your financial awareness. Mobile apps, alerts, and automation help you avoid fees and track progress toward goals. The key is using technology to strengthen your financial discipline, not weaken it.",
    keyPoints: [
      "Mobile banking alerts prevent overdrafts and track spending in real-time",
      "Automatic transfers build savings without relying on willpower",
      "Online bill pay saves time and reduces late fees (average $30-35 per incident)",
      "Digital statements reduce clutter and provide searchable transaction history"
    ],
    practicalAction: "Set up 3 alerts this week: low balance warning ($100), large transaction alert ($500), and monthly transfer confirmation",
    moneyExample: "Balance alerts saved Maria from 6 overdraft fees last year = $210 savings. Bill pay automation prevented 3 late fees = $90 savings. Total digital banking benefit: $300",
    warningTip: "Use strong, unique passwords and enable two-factor authentication - financial accounts are prime targets for hackers"
  }
];

export default function BankingFundamentalsLessonEnhanced({ onComplete }: BankingFundamentalsLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`banking-fundamentals-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `banking-fundamentals-enhanced-${currentLesson}`;
    completeLesson(lessonId, 15);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`"${lesson.title}" completed! 🏦`, {
      duration: 3000,
      position: 'top-center',
    });

    // Call parent completion callback when all lessons are done
    if (currentLesson === enhancedLessons.length - 1) {
      onComplete?.();
    }
  };

  const nextLesson = () => {
    if (currentLesson < enhancedLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const lesson = enhancedLessons[currentLesson];
  const progress = ((currentLesson + 1) / enhancedLessons.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Ring */}
      <div className="flex justify-center mb-6">
        <ProgressRing
          progress={progress}
          size={120}
          color="#059669"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="green" className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.success.bg} p-2 rounded-lg animate-float`}>
                <Building2 className={`w-6 h-6 ${theme.status.success.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.success.text}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Chapter 2: Banking Fundamentals & Optimization
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 gradient-text-green`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6`}>
            {lesson.content}
          </p>

          {/* Key Points */}
          <GradientCard variant="glass" gradient="blue" className="p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.info.bg} p-2 rounded-lg mr-3`}>
                <Star className={`w-5 h-5 ${theme.status.info.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.info.bg} rounded-full flex items-center justify-center mt-1 mr-3`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.info.text}`} />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>

          {/* Warning Tip */}
          {lesson.warningTip && (
            <div className={`mb-6 p-4 ${theme.status.error.bg} border-l-4 ${theme.status.error.border} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.status.error.text} mb-2 flex items-center gap-2`}>
                <AlertCircle className="w-5 h-5" />
                Important Warning
              </h3>
              <p className={`${theme.textColors.secondary} font-medium`}>
                {lesson.warningTip}
              </p>
            </div>
          )}

          {/* Practical Action */}
          <div className={`mb-6 p-6 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Take Action This Week
            </h3>
            <p className={`${theme.textColors.secondary} font-medium mb-3`}>
              {lesson.practicalAction}
            </p>
          </div>

          {/* Money Example */}
          <div className={`mb-6 p-6 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Real Money Impact
            </h3>
            <p className={`${theme.textColors.secondary} font-medium italic`}>
              {lesson.moneyExample}
            </p>
          </div>

          {/* Interactive Content */}
          {currentLesson === 1 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Fee Impact Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>Monthly Fees</h4>
                  <p className={`text-2xl font-bold ${theme.status.error.text}`}>$25</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Typical big bank fees</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Annual Cost</h4>
                  <p className={`text-2xl font-bold ${theme.status.warning.text}`}>$300</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>$25 × 12 months</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>20-Year Cost</h4>
                  <p className={`text-2xl font-bold ${theme.status.success.text}`}>$6,000</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Could be $12,000 if invested!</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                💡 Smart banking saves you thousands over your lifetime!
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={prevLesson}
              disabled={currentLesson === 0}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === enhancedLessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {!completedLessons[currentLesson] && (
              <button
                onClick={markComplete}
                className={`group flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift`}
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Mark Complete
              </button>
            )}
            {completedLessons[currentLesson] && (
              <div className={`flex items-center px-6 py-3 ${theme.status.success.bg} ${theme.status.success.text} rounded-xl font-medium`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className={`mt-6 pt-6 border-t ${theme.borderColors.primary}`}>
          <div className={`flex items-center justify-between text-sm ${theme.textColors.secondary}`}>
            <span>Progress: {completedLessons.filter(Boolean).length} of {enhancedLessons.length} lessons completed</span>
            <span>{progress.toFixed(0)}% Complete</span>
          </div>
          
          {completedLessons.filter(Boolean).length === enhancedLessons.length && (
            <div className={`mt-4 p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <p className={`font-bold ${theme.status.success.text} flex items-center justify-center gap-2`}>
                <Shield className="w-5 h-5" />
                Banking Fundamentals Complete! Ready for the calculator and quiz.
              </p>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

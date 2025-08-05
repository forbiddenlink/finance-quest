'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import { CheckCircle, Star, ChevronRight, ChevronLeft, Brain, DollarSign, TrendingUp, Shield, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import MoneyPersonalityAssessment from './MoneyPersonalityAssessment';
import InteractiveCompoundVisualization from './InteractiveCompoundVisualization';
import InteractiveBudgetAllocation from './InteractiveBudgetAllocation';

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
  practicalAction: string;
  moneyExample: string;
}

const enhancedLessons: LessonContent[] = [
  {
    title: "Your Money Story: From Past to Empowered Future",
    content: "Your relationship with money was shaped before you earned your first dollar. These childhood messages become unconscious rules that drive your financial decisions. By identifying and rewriting these patterns, you can take control of your financial destiny.",
    keyPoints: [
      "Money messages from childhood create limiting beliefs that sabotage success",
      "Common patterns: 'Money doesn't grow on trees' → Scarcity thinking",
      "Fear of success often stems from family beliefs about wealthy people",
      "Rewriting your money story is the foundation of financial transformation"
    ],
    practicalAction: "Write down 3 money messages you heard growing up, then rewrite each as an empowering belief",
    moneyExample: "Instead of 'Rich people are greedy' → 'Wealthy people create value and can help others more effectively'"
  },
  {
    title: "Scarcity vs Abundance: The Wealth Mindset Shift",
    content: "Your brain defaults to scarcity thinking for survival, but this sabotages modern wealth building. Abundance thinking isn't about being reckless—it's about seeing opportunities where others see problems and making strategic decisions from possibility rather than fear.",
    keyPoints: [
      "Scarcity: 'There's not enough money' → Hoarding, fear-based decisions",
      "Abundance: 'Money flows through opportunities I create' → Strategic investing",
      "Growth mindset: Income and wealth can be developed through learning and action",
      "Question shift: From 'I can't afford it' to 'How can I afford it?'"
    ],
    practicalAction: "For 7 days, catch yourself saying 'I can't afford that' and reframe to 'How could I afford this if it's important?'",
    moneyExample: "Scarcity: Skip $50 course to save money. Abundance: How can I earn extra $50 to invest in skills that could increase my income by $500/month?"
  },
  {
    title: "Understanding Your Financial Personality Type",
    content: "Everyone has a unique money personality that influences spending, saving, and investing decisions. Understanding your type helps you work WITH your natural tendencies rather than fighting them, leading to better financial outcomes.",
    keyPoints: [
      "Spender: Enjoys purchases, values experiences → Need automatic savings systems",
      "Saver: Prioritizes security, avoids risk → May miss growth opportunities",
      "Investor: Seeks growth, comfortable with risk → May neglect emergency funds",
      "Avoider: Stressed by money decisions → Benefits from simplified, automated systems"
    ],
    practicalAction: "Identify your money personality and set up one system that works WITH your natural tendencies",
    moneyExample: "Spenders: Set up automatic transfers to savings before you see the money. Savers: Allocate a small 'fun money' budget for guilt-free spending."
  },
  {
    title: "The Compound Effect: Small Actions, Massive Results",
    content: "The most powerful force in personal finance isn't complex investing—it's the compound effect of consistent small actions over time. Understanding this principle transforms how you view daily financial decisions.",
    keyPoints: [
      "Saving $5/day ($150/month) becomes $100,000+ in 20 years with compound growth",
      "Daily $6 coffee habit costs $43,800 over 20 years (opportunity cost)",
      "1% improvement daily = 37x better in a year (compound learning)",
      "Time is more powerful than amount—starting early beats saving more later"
    ],
    practicalAction: "Choose one small daily expense to redirect toward savings/investing for 30 days",
    moneyExample: "Skip one $6 coffee per day, invest that $180/month at 7% return = $87,000 in 20 years"
  },
  {
    title: "Financial Goal Setting: SMART vs PACT Framework",
    content: "Most financial goals fail because they're set incorrectly. The PACT framework (Purposeful, Actionable, Continuous, Trackable) creates lasting behavioral change better than traditional SMART goals by focusing on process over outcomes.",
    keyPoints: [
      "SMART weakness: Outcome-focused, can feel overwhelming or out of control",
      "PACT strength: Process-focused, builds sustainable habits that compound",
      "Purpose: Connect goals to deeper values and life vision",
      "Continuous: Small, consistent actions beat sporadic large efforts"
    ],
    practicalAction: "Convert one financial goal from SMART to PACT format and implement the first action",
    moneyExample: "SMART: 'Save $10,000 by December' → PACT: 'Transfer $200 to savings every Friday after payday because financial security lets me sleep better and take career risks'"
  },
  {
    title: "Cognitive Biases: The Hidden Wealth Killers",
    content: "Your brain uses mental shortcuts that can sabotage financial success. Learning to recognize these biases helps you make more rational money decisions and avoid costly mistakes that can derail your financial progress.",
    keyPoints: [
      "Loss aversion: Feel losses 2x stronger than gains → Avoid good investments",
      "Anchoring: First number influences all decisions → Overpay based on 'original price'",
      "Present bias: Overvalue immediate rewards → Makes saving and investing difficult",
      "Confirmation bias: Seek confirming info → Miss opportunities and risks"
    ],
    practicalAction: "Before any purchase over $100, identify which cognitive biases might be influencing your decision",
    moneyExample: "Seeing a $200 jacket 'marked down from $400'? Ask: 'Would I buy this at $200 if it was never marked higher?' (Anchoring bias check)"
  }
];

export default function MoneyFundamentalsLessonEnhanced() {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`money-fundamentals-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `money-fundamentals-enhanced-${currentLesson}`;
    completeLesson(lessonId, 12);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    const completedCount = newCompleted.filter(Boolean).length;
    const isLastLesson = currentLesson === enhancedLessons.length - 1;

    if (isLastLesson && completedCount === enhancedLessons.length) {
      toast.success(`🎉 All lessons completed! You've mastered the fundamentals of money psychology and mindset. Ready for the calculator and quiz!`, {
        duration: 6000,
        position: 'top-center',
      });
    } else if (completedCount === Math.floor(enhancedLessons.length / 2)) {
      toast.success(`🚀 Halfway there! "${lesson.title}" completed. You're building strong financial foundations!`, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.success(`✅ "${lesson.title}" completed! ${enhancedLessons.length - completedCount} lessons remaining.`, {
        duration: 3000,
        position: 'top-center',
      });
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
      {/* Enhanced Progress Ring */}
      <div className="flex justify-center mb-6">
        <ProgressRing
          progress={progress}
          size={120}
          color="#3B82F6"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="blue" className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.info.bg} p-2 rounded-lg animate-float`}>
                <Brain className={`w-6 h-6 ${theme.status.info.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.info.text}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Chapter 1: Money Psychology & Practical Foundations
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 gradient-text-purple`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6`}>
            {lesson.content}
          </p>

          {/* Key Points */}
          <GradientCard variant="glass" gradient="green" className="p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.success.bg} p-2 rounded-lg mr-3`}>
                <Star className={`w-5 h-5 ${theme.status.success.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.success.bg} rounded-full flex items-center justify-center mt-1 mr-3`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text}`} />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>

          {/* Practical Action */}
          <div className={`mb-6 p-6 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Take Action Now
            </h3>
            <p className={`${theme.textColors.secondary} font-medium mb-3`}>
              {lesson.practicalAction}
            </p>
          </div>

          {/* Money Example */}
          <div className={`mb-6 p-6 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Real Money Example
            </h3>
            <p className={`${theme.textColors.secondary} font-medium italic`}>
              {lesson.moneyExample}
            </p>
          </div>

          {/* Additional Interactive Content Based on Lesson */}
          {currentLesson === 2 && (
            <div className={`mb-8 p-6 ${theme.utils.glass('normal')} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Brain className="w-5 h-5" />
                Discover Your Financial Personality
              </h3>
              <p className={`${theme.textColors.secondary} mb-6`}>
                Take our interactive assessment to understand your unique financial personality type and get personalized advice.
              </p>
              <MoneyPersonalityAssessment />
            </div>
          )}

          {currentLesson === 3 && (
            <div className={`mb-8 p-6 ${theme.utils.glass('normal')} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                Interactive Compound Growth Visualization
              </h3>
              <p className={`${theme.textColors.secondary} mb-6`}>
                See the magical power of compound interest in action with our interactive calculator below.
              </p>
              <InteractiveCompoundVisualization 
                initialAmount={180}
                initialYears={20}
                initialRate={7}
              />
            </div>
          )}

          {currentLesson === 4 && (
            <div className={`mb-8 p-6 ${theme.utils.glass('normal')} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Target className="w-5 h-5" />
                Interactive Budget Allocation Game
              </h3>
              <p className={`${theme.textColors.secondary} mb-6`}>
                Practice the PACT framework by allocating a budget. Drag money amounts to different categories and see how close you get to financial best practices!
              </p>
              <InteractiveBudgetAllocation />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={prevLesson}
              disabled={currentLesson === 0}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.primary} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === enhancedLessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.primary} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
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
                Foundation Complete! You&apos;re ready for the paycheck calculator and quiz.
              </p>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

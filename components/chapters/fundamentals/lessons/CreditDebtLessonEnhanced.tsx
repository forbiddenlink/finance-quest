'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  CreditCard,
  Shield,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Zap,
  Brain,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CreditDebtLessonProps {
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
    title: "Credit Scores: Your Financial Reputation That Determines Your Wealth",
    content: "Your credit score isn't just a number—it's your financial reputation that costs or saves you hundreds of thousands over your lifetime. A 760+ score saves $250,000+ on mortgages, gets you premium rewards cards, lower insurance, and even better job opportunities. Bad credit traps you in a cycle of high interest and limited options.",
    keyPoints: [
      "Credit score factors: 35% payment history, 30% utilization, 15% length, 10% mix, 10% inquiries",
      "Score ranges: 300-579 poor, 580-669 fair, 670-739 good, 740-799 very good, 800+ excellent",
      "Real cost difference: 620 vs 760 score = $250,000+ more in mortgage interest over 30 years",
      "Hidden impacts: Employment screening, insurance rates, apartment rentals, utility deposits",
      "Monitoring essentials: Check free monthly, dispute errors immediately, track improvement trends"
    ],
    practicalAction: "Check your credit score for free through your bank app, Credit Karma, or annualcreditreport.com this week",
    moneyExample: "Sarah (620 score): $400k mortgage at 7.2% = $382k interest. Tom (760 score): Same mortgage at 5.8% = $296k interest. Tom saves $86,000 with better credit!",
    warningTip: "Never pay for credit scores—free options from banks and Credit Karma provide the same information credit score companies sell"
  },
  {
    title: "Credit Building Blueprint: From Zero to Excellent in 24 Months",
    content: "Building excellent credit is a systematic process with predictable timelines and specific milestones. Most people make expensive mistakes that delay progress by years. The right strategy builds 740+ credit scores in 18-24 months, unlocking premium financial products and massive savings.",
    keyPoints: [
      "Timeline reality: 3-6 months foundation, 12-18 months building, 24+ months optimization",
      "Starting strategy: Secured card if no credit, authorized user on family account, credit-builder loan",
      "Growth tactics: Request limit increases every 6 months, add new account yearly, maintain low utilization",
      "Utilization optimization: Under 30% total, under 10% ideal, 1-9% for maximum scores",
      "Length protection: Never close old accounts, keep oldest card active with small recurring purchase"
    ],
    practicalAction: "If you have no credit, apply for a secured credit card or become authorized user on family member's account this week",
    moneyExample: "Starting secured card ($200 limit) → 6 months perfect payments → unsecured card ($1,500) → 12 months → limit increase ($3,000) → 18 months → premium rewards card",
    warningTip: "Avoid credit repair companies charging $100+/month—you can dispute errors yourself for free using annual credit reports"
  },
  {
    title: "The Credit Utilization Optimization System: 30% Rule vs Advanced Strategies",
    content: "Most people know the 30% rule but miss advanced utilization strategies that boost scores by 50-100 points. Perfect utilization management involves timing, multiple cards, and understanding how credit bureaus calculate ratios. This knowledge separates good credit from excellent credit.",
    keyPoints: [
      "Basic rule: Never exceed 30% utilization on any card, keep total utilization under 30%",
      "Advanced strategy: 1-9% total utilization for maximum scores, 0% on some cards acceptable",
      "Timing matters: Pay balances before statement dates to report lower utilization",
      "Multiple card strategy: Spread utilization across cards, keep individual cards under 10%",
      "Emergency utilization: If you must exceed 30%, pay down before statement closes"
    ],
    practicalAction: "Calculate your current utilization rate and set up calendar reminders to pay cards before statement dates",
    moneyExample: "Cards: $2,000 limit with $800 balance = 40% utilization (score damage). Pay $500 before statement = 15% utilization (score boost). Same spending, better score!",
    warningTip: "Paying your full balance doesn't help your score if you pay after the statement date—timing is everything for utilization"
  },
  {
    title: "Debt Elimination Warfare: Snowball vs Avalanche vs Hybrid Strategies",
    content: "Debt elimination requires both mathematical optimization and psychological momentum. The 'best' method depends on your personality, debt structure, and financial situation. Understanding all strategies lets you choose the optimal path and potentially save years of payments.",
    keyPoints: [
      "Debt Snowball: Pay minimums + attack smallest balance first (psychological wins, motivation)",
      "Debt Avalanche: Pay minimums + attack highest interest rate (mathematical optimization, saves most money)",
      "Hybrid approach: Quick wins on small debts, then switch to highest interest rates",
      "Debt consolidation: Consider 0% balance transfers, personal loans at lower rates",
      "Acceleration tactics: Apply windfalls, raises, side income directly to debt elimination"
    ],
    practicalAction: "List all debts with balances and interest rates, then choose your elimination strategy this week",
    moneyExample: "3 debts: $500 at 24%, $2,000 at 18%, $5,000 at 12%. Snowball saves 8 months motivation. Avalanche saves $1,200 interest. Both beat minimum payments!",
    warningTip: "Don't get analysis paralysis—any systematic debt elimination plan beats making minimum payments indefinitely"
  },
  {
    title: "Good Debt vs Bad Debt: The Wealth-Building vs Wealth-Destroying Framework",
    content: "Understanding debt categories determines whether borrowing builds or destroys your wealth. Good debt appreciates, generates income, or increases earning potential. Bad debt finances depreciating assets or consumption. This framework guides every borrowing decision throughout your life.",
    keyPoints: [
      "Good debt criteria: Appreciates in value, generates income, tax deductible, builds net worth",
      "Examples of good debt: Mortgages (3-7%), student loans for high-ROI degrees, business loans",
      "Bad debt markers: High interest (15%+), depreciating assets, consumption purchases",
      "Examples of bad debt: Credit cards for consumption, car loans, payday loans, personal loans for vacations",
      "Transformation strategies: Refinance bad debt to lower rates, pay off bad debt before investing"
    ],
    practicalAction: "Categorize each of your current debts as 'good' or 'bad' and prioritize bad debt elimination",
    moneyExample: "Good debt: $300k mortgage at 4% builds $300k+ equity over 30 years. Bad debt: $20k credit cards at 22% costs $35k+ over same period with minimum payments",
    warningTip: "Even 'good debt' becomes bad if payments strain your budget—never borrow more than you can comfortably afford"
  },
  {
    title: "Credit Optimization Mastery: Advanced Strategies for 800+ Scores",
    content: "Achieving 800+ credit scores requires advanced optimization beyond basic good habits. This elite tier unlocks the best financial products: 0% balance transfers, premium rewards cards, lowest mortgage rates, and exclusive lending opportunities that compound wealth over decades.",
    keyPoints: [
      "Perfect payment automation: Set up autopay for full balances, never miss payments",
      "Credit mix optimization: Mix of cards, installment loans, mortgage shows lending sophistication",
      "Account aging strategy: Keep oldest accounts open forever, add new accounts strategically",
      "Inquiry management: Space applications 45+ days apart, shop rates within 14-day windows",
      "Monitoring and optimization: Monthly score checks, quarterly report reviews, annual strategy adjustment"
    ],
    practicalAction: "Set up automatic payments for all credit accounts and schedule quarterly credit report reviews",
    moneyExample: "800+ score benefits: Prime mortgage rates save $100k+, premium cards earn $1,000+ annually, instant approvals for emergency credit, insurance discounts",
    warningTip: "Don't obsess over score fluctuations—focus on long-term trends and maintaining excellent habits consistently"
  }
];

export default function CreditDebtLessonEnhanced({ onComplete }: CreditDebtLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`credit-debt-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `credit-debt-enhanced-${currentLesson}`;
    completeLesson(lessonId, 18);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`"${lesson.title}" completed! 💳`, {
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
                <CreditCard className={`w-6 h-6 ${theme.status.info.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.info.text}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Chapter 6: Credit & Debt Fundamentals
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 gradient-text-blue`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6`}>
            {lesson.content}
          </p>

          {/* Key Points */}
          <GradientCard variant="glass" gradient="purple" className="p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.warning.bg} p-2 rounded-lg mr-3`}>
                <Star className={`w-5 h-5 ${theme.status.warning.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Strategies</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.warning.bg} rounded-full flex items-center justify-center mt-1 mr-3`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.warning.text}`} />
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
                Critical Insight
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
              Action Step This Week
            </h3>
            <p className={`${theme.textColors.secondary} font-medium mb-3`}>
              {lesson.practicalAction}
            </p>
          </div>

          {/* Money Example */}
          <div className={`mb-6 p-6 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Real Money Example
            </h3>
            <p className={`${theme.textColors.secondary} font-medium italic`}>
              {lesson.moneyExample}
            </p>
          </div>

          {/* Interactive Content */}
          {currentLesson === 0 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Shield className="w-5 h-5" />
                Credit Score Impact Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>Poor (300-579)</h4>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>Limited options, high rates</p>
                  <p className={`text-xs ${theme.status.error.text} font-bold`}>Mortgage: 8-12% rates</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Good (670-739)</h4>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>Moderate rates, some options</p>
                  <p className={`text-xs ${theme.status.warning.text} font-bold`}>Mortgage: 6-8% rates</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Excellent (740+)</h4>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>Best rates, premium products</p>
                  <p className={`text-xs ${theme.status.success.text} font-bold`}>Mortgage: 5-6% rates</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                💡 Difference on $400k mortgage: Poor credit costs $200k+ more in interest!
              </p>
              <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
                <p className={`text-sm ${theme.status.info.text} font-medium`}>
                  📊 Use our <strong>Credit Score Improvement Calculator</strong> in the Calculator tab to track your progress!
                </p>
              </div>
            </div>
          )}

          {currentLesson === 1 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                Credit Building Timeline
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-2`}>Months 1-6: Foundation</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Secured card or authorized user, perfect payment history, low utilization</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Months 6-18: Building</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Add second card, request limit increases, maintain under 30% utilization</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>18+ Months: Optimization</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>740+ score, premium cards, 1-9% utilization for maximum scores</p>
                </div>
              </div>
            </div>
          )}

          {currentLesson === 2 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Utilization Optimization Examples
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.status.error.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>❌ Poor Utilization (40%)</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>$1,000 limit, $400 balance reported = Score damage, harder approvals</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>⚠️ Acceptable (20%)</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>$1,000 limit, $200 balance = Decent score, room for improvement</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>✅ Optimal (5%)</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>$1,000 limit, $50 balance = Maximum score benefit, excellent standing</p>
                </div>
              </div>
              <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
                <p className={`text-sm ${theme.status.info.text} font-medium`}>
                  🔧 Try our <strong>Credit Utilization Calculator</strong> in the Calculator tab to optimize your card payments!
                </p>
              </div>
            </div>
          )}

          {currentLesson === 3 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Brain className="w-5 h-5" />
                Debt Elimination Strategy Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-2`}>🧠 Debt Snowball</h4>
                  <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                    <li>✅ Quick psychological wins</li>
                    <li>✅ Builds momentum and motivation</li>
                    <li>❌ May cost more in interest</li>
                    <li>🎯 Best for: Need motivation</li>
                  </ul>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>📊 Debt Avalanche</h4>
                  <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                    <li>✅ Saves maximum money</li>
                    <li>✅ Mathematically optimal</li>
                    <li>❌ Slower initial progress</li>
                    <li>🎯 Best for: Disciplined savers</li>
                  </ul>
                </div>
              </div>
              <div className={`mt-4 p-3 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg text-center`}>
                <p className={`text-sm ${theme.status.warning.text} font-medium`}>
                  💰 Use our <strong>Debt Payoff Calculator</strong> to compare strategies and see your debt-free date!
                </p>
              </div>
            </div>
          )}

          {currentLesson === 4 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Zap className="w-5 h-5" />
                Good Debt vs Bad Debt Framework
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>✅ Good Debt</h4>
                  <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                    <li>• Mortgages (builds equity)</li>
                    <li>• Student loans (increases income)</li>
                    <li>• Business loans (generates profit)</li>
                    <li>• Low interest rates (0-8%)</li>
                  </ul>
                </div>
                <div className={`p-4 ${theme.status.error.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>❌ Bad Debt</h4>
                  <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                    <li>• Credit cards (consumption)</li>
                    <li>• Car loans (rapid depreciation)</li>
                    <li>• Payday loans (predatory rates)</li>
                    <li>• High interest rates (15%+)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentLesson === 5 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Lock className="w-5 h-5" />
                Elite Credit Benefits (800+ Score)
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>🏆 Premium Financial Products</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Access to 0% balance transfers, premium rewards cards earning 2-5% cashback</p>
                </div>
                <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-2`}>💰 Maximum Savings</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Lowest mortgage rates save $100k+, better insurance rates, instant approvals</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>🚀 Wealth Building Tools</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Business credit lines, investment property financing, exclusive lending opportunities</p>
                </div>
              </div>
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
                <Award className="w-5 h-5" />
                Credit & Debt Mastery Complete! Ready for the calculator and quiz.
              </p>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

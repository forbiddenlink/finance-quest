'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import RiskToleranceAssessment from './RiskToleranceAssessment';
import AssetAllocationOptimizer from './AssetAllocationOptimizer';
import CompoundGrowthVisualizer from './CompoundGrowthVisualizer';
import {
  TrendingUp,
  PieChart,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Zap,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InvestmentFundamentalsLessonProps {
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
    title: "Investment Fundamentals: From Saver to Wealth Builder",
    content: "Investing transforms you from a saver who preserves money to a wealth builder who multiplies it. While savings accounts earn 4-5%, the stock market averages 10% annually over decades. This difference compounds into millions over a lifetime. Understanding risk, return, and time gives you the tools to build generational wealth.",
    keyPoints: [
      "Historical reality: $10,000 invested in S&P 500 in 1980 = $1.2 million today (inflation-adjusted)",
      "Compound interest formula: Small amounts + time + returns = extraordinary wealth",
      "Risk vs return relationship: Higher returns require accepting short-term volatility",
      "Time arbitrage advantage: Young investors can take more risk for higher long-term returns",
      "Dollar-cost averaging: Systematic investing reduces timing risk and builds discipline"
    ],
    practicalAction: "Open an investment account (Fidelity, Vanguard, or Schwab) and set up automatic transfers this week",
    moneyExample: "Sarah invests $500/month starting at 25. At 10% returns: $3.16 million by 65. Tom waits until 35: same contribution = $1.13 million. Sarah's 10-year head start = $2.03 million difference!",
    warningTip: "Never invest money you need within 5 years—market volatility can devastate short-term goals"
  },
  {
    title: "Asset Classes: Building Your Investment Portfolio Foundation",
    content: "Different asset classes perform differently under various economic conditions. Stocks grow with company profits, bonds provide steady income, real estate hedges inflation, and commodities protect against economic uncertainty. Smart allocation across asset classes creates resilient portfolios that weather all market seasons.",
    keyPoints: [
      "Stocks (equities): Ownership stakes in companies, highest long-term returns (~10%), most volatile",
      "Bonds (fixed income): Loans to governments/corporations, steady income (~4-6%), lower volatility",
      "Real Estate Investment Trusts (REITs): Property exposure without direct ownership (~8-12%)",
      "International stocks: Geographic diversification, currency exposure, different economic cycles",
      "Commodities: Inflation hedge through gold, oil, agriculture, typically 5-15% of portfolio"
    ],
    practicalAction: "Research and choose 3-4 low-cost index funds covering US stocks, international stocks, and bonds",
    moneyExample: "2008 Financial Crisis: US stocks fell 37%, but international stocks fell less. Bonds gained 5%. A diversified portfolio lost only 15% vs 37% for stock-only investors.",
    warningTip: "Don&apos;t chase last year&apos;s best performing asset class—diversification means always having something disappointing you"
  },
  {
    title: "Portfolio Construction: The Science of Asset Allocation",
    content: "Asset allocation determines 90% of portfolio performance—more than individual stock picking or market timing. The right mix balances growth potential with risk tolerance based on your age, goals, and temperament. Modern Portfolio Theory shows how diversification reduces risk without sacrificing returns.",
    keyPoints: [
      "Age-based allocation: Subtract age from 120 for stock percentage (30-year-old = 90% stocks)",
      "Risk tolerance assessment: Conservative (60/40), Moderate (70/30), Aggressive (80/20) stock/bond splits",
      "Rebalancing discipline: Sell high-performing assets to buy underperforming ones annually",
      "Geographic diversification: 60-70% US stocks, 20-30% international, 10-20% emerging markets",
      "Sector diversification: Technology, healthcare, finance, consumer goods across economic cycles"
    ],
    practicalAction: "Calculate your target allocation based on age and risk tolerance, then map it to specific index funds",
    moneyExample: "Target allocation: 70% stocks, 30% bonds. After stocks surge: 80% stocks, 20% bonds. Rebalancing: sell stocks, buy bonds. Forces 'buy low, sell high' discipline.",
    warningTip: "Perfect allocation doesn't exist—good allocation consistently applied beats perfect allocation never implemented"
  },
  {
    title: "Investment Accounts: Maximizing Tax-Advantaged Growth",
    content: "Where you invest matters as much as what you invest in. Tax-advantaged accounts like 401(k)s and IRAs can double your retirement wealth through tax savings. Understanding contribution limits, employer matching, and tax implications optimizes your investment strategy for maximum after-tax returns.",
    keyPoints: [
      "401(k) priority: Contribute to employer match first—it's free money (50-100% instant return)",
      "Roth vs Traditional IRAs: Pay taxes now (Roth) vs later (Traditional) based on current vs future tax rates",
      "Contribution limits 2024: 401(k) $23,000, IRA $7,000, catch-up contributions after 50",
      "Tax-loss harvesting: Sell losing investments to offset capital gains in taxable accounts",
      "Asset location strategy: Hold tax-inefficient investments in tax-advantaged accounts"
    ],
    practicalAction: "Maximize employer 401(k) match, then open and fund a Roth IRA with target-date fund",
    moneyExample: "401(k) with match: Contribute $6,000, employer adds $3,000 = $9,000 invested. That's a 50% instant return before any market gains! No other investment guarantees this.",
    warningTip: "Don't leave employer matching on the table—it's the only guaranteed investment return you'll ever get"
  },
  {
    title: "Index Fund Investing: Passive Strategy That Beats Most Professionals",
    content: "Index funds consistently outperform 80-90% of actively managed funds over long periods while charging significantly lower fees. They provide instant diversification, professional management, and market returns without requiring stock-picking expertise. This passive approach builds wealth systematically.",
    keyPoints: [
      "Low fees matter: 0.03% index fund vs 1.5% active fund = $1.68 million more over 30 years on $500k",
      "Diversification benefits: S&P 500 index owns 500 companies across all sectors automatically",
      "Consistent outperformance: 90% of active funds underperform index funds over 15+ years",
      "Total Stock Market index: Own every public US company in proportion to market value",
      "International diversification: Total World index provides global exposure in one fund"
    ],
    practicalAction: "Set up automatic investments into a Total Stock Market index fund and Total Bond Market index fund",
    moneyExample: "Vanguard Total Stock Market Index (VTI): 0.03% fee, owns 4,000+ US companies. Fidelity equivalent (FZROX): 0% fees. Both consistently beat expensive actively managed funds.",
    warningTip: "Resist the urge to 'beat the market'—even professional money managers with teams of analysts fail 90% of the time"
  },
  {
    title: "Investment Psychology: Mastering Your Mind for Market Success",
    content: "Investment success is 90% psychology and 10% strategy. Emotions drive poor decisions: panic selling during crashes, greed buying at peaks, and impatience abandoning long-term plans. Understanding behavioral biases and creating systematic approaches protects you from your own worst enemy—yourself.",
    keyPoints: [
      "Buy and hold discipline: Time in market beats timing the market—staying invested through volatility",
      "Dollar-cost averaging: Invest fixed amounts regularly regardless of market conditions",
      "Avoid market timing: Missing the 10 best days over 20 years cuts returns in half",
      "Rebalancing removes emotion: Systematic buying/selling based on target allocation, not feelings",
      "Long-term perspective: Think decades, not months—temporary volatility vs permanent wealth building"
    ],
    practicalAction: "Write your investment plan and policy statement—refer to it during market panics and euphoria",
    moneyExample: "2020 COVID crash: Market fell 35% in 5 weeks. Emotional investors sold at the bottom. Disciplined investors bought more. Market recovered in 5 months and hit new highs.",
    warningTip: "Your biggest investment risk isn't market crashes—it's your emotional reactions to market crashes"
  }
];

export default function InvestmentFundamentalsLessonEnhanced({ onComplete }: InvestmentFundamentalsLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`investment-fundamentals-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `investment-fundamentals-enhanced-${currentLesson}`;
    completeLesson(lessonId, 20);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`"${lesson.title}" completed! 📈`, {
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
          color="#10B981"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="green" className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.success.bg} p-2 rounded-lg animate-float`}>
                <TrendingUp className={`w-6 h-6 ${theme.status.success.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.success.text}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Chapter 7: Investment Fundamentals
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
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Investment Strategies</h3>
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
                Critical Investment Insight
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
              Real Investment Example
            </h3>
            <p className={`${theme.textColors.secondary} font-medium italic`}>
              {lesson.moneyExample}
            </p>
          </div>

          {/* Interactive Content */}
          {currentLesson === 0 && (
            <div className={`mb-8`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Interactive: Compound Growth Power
              </h3>
              <CompoundGrowthVisualizer />
            </div>
          )}

          {currentLesson === 1 && (
            <div className={`mb-8`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <PieChart className="w-5 h-5" />
                Asset Class Performance (20-Year Averages)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-1`}>US Stocks</h4>
                  <p className={`text-2xl font-bold ${theme.status.success.text}`}>10.0%</p>
                  <p className={`text-xs ${theme.textColors.secondary}`}>High volatility</p>
                </div>
                <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-1`}>REITs</h4>
                  <p className={`text-2xl font-bold ${theme.status.info.text}`}>8.5%</p>
                  <p className={`text-xs ${theme.textColors.secondary}`}>Inflation hedge</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-1`}>Intl Stocks</h4>
                  <p className={`text-2xl font-bold ${theme.status.warning.text}`}>7.5%</p>
                  <p className={`text-xs ${theme.textColors.secondary}`}>Diversification</p>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} border rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.textColors.primary} mb-1`}>Bonds</h4>
                  <p className={`text-2xl font-bold ${theme.textColors.primary}`}>4.5%</p>
                  <p className={`text-xs ${theme.textColors.secondary}`}>Low volatility</p>
                </div>
              </div>
              <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
                <p className={`text-sm ${theme.status.info.text} font-medium`}>
                  🎯 Use our <strong>Risk Tolerance Assessment</strong> in the Calculator tab to discover your optimal asset mix!
                </p>
              </div>
            </div>
          )}

          {currentLesson === 2 && (
            <div className={`mb-8`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Target className="w-5 h-5" />
                Interactive: Build Your Portfolio
              </h3>
              <AssetAllocationOptimizer />
            </div>
          )}

          {currentLesson === 3 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Shield className="w-5 h-5" />
                Investment Account Priority Ladder
              </h3>
              <div className="space-y-3">
                <div className={`p-4 ${theme.status.success.bg} rounded-lg flex items-center`}>
                  <div className={`w-8 h-8 ${theme.status.success.bg} rounded-full flex items-center justify-center font-bold mr-4 ${theme.status.success.text}`}>1</div>
                  <div>
                    <h4 className={`font-bold ${theme.status.success.text}`}>401(k) Match</h4>
                    <p className={`text-sm ${theme.textColors.secondary}`}>Free money - contribute enough for full match</p>
                  </div>
                </div>
                <div className={`p-4 ${theme.status.info.bg} rounded-lg flex items-center`}>
                  <div className={`w-8 h-8 ${theme.status.info.bg} rounded-full flex items-center justify-center font-bold mr-4 ${theme.status.info.text}`}>2</div>
                  <div>
                    <h4 className={`font-bold ${theme.status.info.text}`}>Emergency Fund</h4>
                    <p className={`text-sm ${theme.textColors.secondary}`}>3-6 months expenses in high-yield savings</p>
                  </div>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg flex items-center`}>
                  <div className={`w-8 h-8 ${theme.status.warning.bg} rounded-full flex items-center justify-center font-bold mr-4 ${theme.status.warning.text}`}>3</div>
                  <div>
                    <h4 className={`font-bold ${theme.status.warning.text}`}>Roth IRA</h4>
                    <p className={`text-sm ${theme.textColors.secondary}`}>$7,000/year - tax-free growth and withdrawals</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentLesson === 4 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Zap className="w-5 h-5" />
                Index Fund Fee Impact Over 30 Years
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Low-Cost Index Fund (0.03%)</h4>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>$500,000 portfolio</p>
                  <p className={`text-lg font-bold ${theme.status.success.text}`}>Fees paid: $45,000</p>
                  <p className={`text-2xl font-bold ${theme.status.success.text} mt-2`}>Final value: $1.45M</p>
                </div>
                <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>Active Fund (1.5%)</h4>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>$500,000 portfolio</p>
                  <p className={`text-lg font-bold ${theme.status.error.text}`}>Fees paid: $350,000</p>
                  <p className={`text-2xl font-bold ${theme.status.error.text} mt-2`}>Final value: $1.15M</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                💡 Low fees save you $300,000 over 30 years!
              </p>
            </div>
          )}

          {currentLesson === 5 && (
            <div className={`mb-8`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Star className="w-5 h-5" />
                Interactive: Discover Your Risk Profile
              </h3>
              <RiskToleranceAssessment />
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
                Investment Fundamentals Mastery Complete! Ready for calculator and quiz.
              </p>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

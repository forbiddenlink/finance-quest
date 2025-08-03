'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  TrendingUp,
  PieChart,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  Calculator,
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
}

const lessons: LessonContent[] = [
  {
    title: "Investment Basics: Making Your Money Work for You",
    content: "Investing isn&apos;t gambling—it&apos;s the systematic process of putting money to work to generate more money over time. While savings accounts protect your money, investments grow your wealth. The key is understanding risk vs. return and starting early to harness the incredible power of compound growth.",
    keyPoints: [
      "Compound interest is the 8th wonder of the world - time is your greatest asset",
      "Risk and return are directly related: higher potential returns require accepting more risk",
      "Diversification reduces risk without necessarily reducing returns",
      "Dollar-cost averaging smooths out market volatility through consistent investing",
      "Starting early matters more than investing large amounts - $100/month at 25 beats $500/month at 35"
    ]
  },
  {
    title: "Asset Classes: Building Your Investment Foundation",
    content: "Different asset classes behave differently under various economic conditions. Understanding stocks, bonds, real estate, and commodities helps you build a resilient portfolio that can weather market storms while capturing long-term growth opportunities.",
    keyPoints: [
      "Stocks (equities): Ownership in companies, highest long-term returns (10% annually), most volatile",
      "Bonds (fixed income): Loans to governments/corporations, steady income (3-6% annually), lower risk",
      "Real Estate: Physical property or REITs, inflation hedge (8-12% annually), requires capital",
      "Commodities: Raw materials like gold/oil, inflation protection, portfolio diversification",
      "Cash equivalents: Money markets/CDs, capital preservation (2-5% annually), lowest risk"
    ]
  },
  {
    title: "Portfolio Construction: The Art of Asset Allocation",
    content: "Asset allocation—how you divide investments among different asset classes—determines 90% of your portfolio&apos;s performance. The right mix depends on your age, risk tolerance, and financial goals. A well-constructed portfolio balances growth potential with risk management.",
    keyPoints: [
      "Age-based rule: 120 minus your age = stock percentage (30-year-old = 90% stocks, 10% bonds)",
      "Diversification across asset classes, sectors, and geographic regions reduces risk",
      "Rebalancing annually maintains your target allocation and forces buy-low, sell-high discipline",
      "Emergency fund first: Never invest money you might need within 5 years",
      "Target-date funds automatically adjust allocation as you age - perfect for beginners"
    ]
  },
  {
    title: "Investment Accounts: Maximizing Tax Efficiency",
    content: "Where you invest is as important as what you invest in. Tax-advantaged accounts like 401(k)s and IRAs can significantly boost your returns through tax savings. Understanding account types and contribution limits helps you optimize your investment strategy.",
    keyPoints: [
      "401(k): Employer-sponsored, $23,000 limit (2024), often includes company matching",
      "Traditional IRA: Tax deduction now, pay taxes in retirement, $7,000 limit (2024)",
      "Roth IRA: Pay taxes now, tax-free growth and withdrawals, $7,000 limit (2024)",
      "Taxable accounts: No contribution limits, pay taxes on gains, most flexible access",
      "Priority order: 401(k) match → High-yield savings → IRA → Additional 401(k) → Taxable"
    ]
  }
];

export default function InvestmentFundamentalsLesson({ onComplete }: InvestmentFundamentalsLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`investment-fundamentals-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `investment-fundamentals-${currentLesson}`;
    completeLesson(lessonId, 20);

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
                <TrendingUp className={`w-6 h-6 ${theme.status.info.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.info.text} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 7: Investment Fundamentals
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
          <GradientCard variant="glass" gradient="blue" className="p-6 animate-fade-in-up stagger-4">
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
          <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.accent} mb-3 flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              Compound Interest Power Demo
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <p className={`font-medium ${theme.textColors.primary}`}>See the magic of compound growth:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <DollarSign className={`w-8 h-8 mx-auto mb-3 ${theme.textColors.accent}`} />
                  <div className={`text-xl font-bold ${theme.status.success.text}`}>Starting at 25</div>
                  <div className={`text-sm ${theme.textColors.muted} mb-2`}>$200/month for 10 years</div>
                  <div className={`text-xs ${theme.textColors.muted}`}>Total invested: $24,000</div>
                  <div className={`text-lg font-bold ${theme.status.success.text} mt-2`}>Result at 65: $525,000</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <AlertTriangle className={`w-8 h-8 mx-auto mb-3 ${theme.status.warning.text}`} />
                  <div className={`text-xl font-bold ${theme.status.warning.text}`}>Starting at 35</div>
                  <div className={`text-sm ${theme.textColors.muted} mb-2`}>$200/month for 30 years</div>
                  <div className={`text-xs ${theme.textColors.muted}`}>Total invested: $72,000</div>
                  <div className={`text-lg font-bold ${theme.status.warning.text} mt-2`}>Result at 65: $394,000</div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.textColors.accent} text-center`}>
                💡 <strong>Time beats timing:</strong> Starting early with less money wins!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <PieChart className="w-5 h-5" />
              Asset Class Risk & Return Profile
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <TrendingUp className={`w-4 h-4 ${theme.status.success.text}`} />
                    Higher Risk, Higher Return
                  </h4>
                  <ul className={`space-y-2 ${theme.textColors.secondary} text-sm`}>
                    <li className="flex justify-between">
                      <span>Stocks (S&P 500)</span>
                      <span className={`${theme.status.success.text} font-medium`}>~10% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Real Estate (REITs)</span>
                      <span className={`${theme.status.success.text} font-medium`}>~8% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>International Stocks</span>
                      <span className={`${theme.status.success.text} font-medium`}>~7% annually</span>
                    </li>
                  </ul>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <Shield className={`w-4 h-4 ${theme.status.info.text}`} />
                    Lower Risk, Lower Return
                  </h4>
                  <ul className={`space-y-2 ${theme.textColors.secondary} text-sm`}>
                    <li className="flex justify-between">
                      <span>Government Bonds</span>
                      <span className={`${theme.status.info.text} font-medium`}>~4% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Corporate Bonds</span>
                      <span className={`${theme.status.info.text} font-medium`}>~5% annually</span>
                    </li>
                    <li className="flex justify-between">
                      <span>High-Yield Savings</span>
                      <span className={`${theme.status.info.text} font-medium`}>~4% annually</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.warning.text}`}>
                💡 <strong>Balance is key:</strong> Mix asset classes to optimize risk-adjusted returns!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Sample Portfolio Allocations by Age
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Age 25-35</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>US Stocks</span>
                      <span className={`${theme.status.success.text} font-medium`}>60%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>International Stocks</span>
                      <span className={`${theme.status.success.text} font-medium`}>25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bonds</span>
                      <span className={`${theme.status.info.text} font-medium`}>10%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>REITs</span>
                      <span className={`${theme.textColors.accent} font-medium`}>5%</span>
                    </div>
                  </div>
                  <div className={`mt-3 text-xs ${theme.textColors.muted}`}>Aggressive Growth</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Age 40-50</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>US Stocks</span>
                      <span className={`${theme.status.success.text} font-medium`}>50%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>International Stocks</span>
                      <span className={`${theme.status.success.text} font-medium`}>20%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bonds</span>
                      <span className={`${theme.status.info.text} font-medium`}>25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>REITs</span>
                      <span className={`${theme.textColors.accent} font-medium`}>5%</span>
                    </div>
                  </div>
                  <div className={`mt-3 text-xs ${theme.textColors.muted}`}>Balanced Growth</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Age 55-65</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>US Stocks</span>
                      <span className={`${theme.status.success.text} font-medium`}>35%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>International Stocks</span>
                      <span className={`${theme.status.success.text} font-medium`}>15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bonds</span>
                      <span className={`${theme.status.info.text} font-medium`}>45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>REITs</span>
                      <span className={`${theme.textColors.accent} font-medium`}>5%</span>
                    </div>
                  </div>
                  <div className={`mt-3 text-xs ${theme.textColors.muted}`}>Conservative Growth</div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.info.text}`}>
                💡 <strong>Gradual shift:</strong> Move from growth to preservation as you approach retirement!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 3 && (
          <div className={`mb-8 p-6 ${theme.status.success.bg} rounded-lg border-l-4 ${theme.status.success.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              Investment Account Priority Strategy
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="space-y-3">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${theme.textColors.primary} flex items-center gap-2`}>
                      <span className={`${theme.status.success.bg} ${theme.status.success.text} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold`}>1</span>
                      401(k) Company Match
                    </h4>
                    <span className={`${theme.status.success.text} font-medium`}>Free Money!</span>
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Contribute enough to get full employer match. This is an instant 100% return on investment.
                  </p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${theme.textColors.primary} flex items-center gap-2`}>
                      <span className={`${theme.status.info.bg} ${theme.status.info.text} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold`}>2</span>
                      Emergency Fund
                    </h4>
                    <span className={`${theme.status.info.text} font-medium`}>Security First</span>
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Build 3-6 months of expenses in high-yield savings before investing more.
                  </p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${theme.textColors.primary} flex items-center gap-2`}>
                      <span className={`${theme.textColors.accent} ${theme.backgrounds.card} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold`}>3</span>
                      Roth IRA
                    </h4>
                    <span className={`${theme.textColors.accent} font-medium`}>Tax-Free Growth</span>
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    $7,000/year limit. Tax-free growth and withdrawals in retirement.
                  </p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${theme.textColors.primary} flex items-center gap-2`}>
                      <span className={`${theme.status.warning.bg} ${theme.status.warning.text} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold`}>4</span>
                      Additional 401(k)
                    </h4>
                    <span className={`${theme.status.warning.text} font-medium`}>Max Tax Benefits</span>
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Contribute up to $23,000 limit for maximum tax-deferred growth.
                  </p>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.success.text}`}>
                💡 <strong>Follow the ladder:</strong> Each step builds on the previous for optimal tax efficiency!
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

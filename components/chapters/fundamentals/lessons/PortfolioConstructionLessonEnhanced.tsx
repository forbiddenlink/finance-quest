'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import PortfolioDiversificationAnalyzer from './PortfolioDiversificationAnalyzer';
import RebalancingOptimizer from './RebalancingOptimizer';
// import ModernPortfolioTheoryVisualizer from './ModernPortfolioTheoryVisualizer';
import MonteCarloSimulation from './MonteCarloSimulation';
import {
  PieChart,
  Target,
  Shield,
  CheckCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  DollarSign,
  Zap,
  Award,
  AlertTriangle,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PortfolioConstructionLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  practicalAction: string;
  realMoneyExample: string;
  warningTip: string;
  icon: React.ComponentType<{ className?: string }>;
}

const enhancedLessons: LessonContent[] = [
  {
    title: 'Modern Portfolio Theory & Diversification',
    icon: PieChart,
    content: 'Modern Portfolio Theory, developed by Nobel Prize winner Harry Markowitz, demonstrates that you can reduce risk without sacrificing returns through proper diversification. The key insight: correlation matters more than individual asset performance. A portfolio of uncorrelated assets will have lower volatility than any individual holding while maintaining similar returns.',
    practicalAction: 'Build a core portfolio using broad market index funds: 60% US Total Stock Market (VTI), 20% International Developed Markets (VTIAX), 10% Emerging Markets (VTISX), 10% Bonds (VBTLX). This provides instant diversification across 10,000+ companies worldwide.',
    realMoneyExample: 'During 2008 financial crisis: US stocks fell 37%, but a diversified portfolio with international exposure and bonds only dropped 22%. A $100,000 diversified portfolio lost $22,000 vs $37,000 in US-only stocks. Recovery time: 3 years vs 5 years.',
    warningTip: 'Diversification means always owning something that disappoints you. If everything in your portfolio is doing well simultaneously, you&apos;re not properly diversified—you&apos;re taking concentrated risk.'
  },
  {
    title: 'Asset Allocation: The 90% Solution',
    icon: BarChart3,
    content: 'Asset allocation determines 90% of your investment returns over time—more than stock picking, market timing, or fund selection. Your age, goals, and risk tolerance should drive your stock/bond split. The foundational rule: 120 minus your age in stocks, with adjustments for personal circumstances.',
    practicalAction: 'Calculate your target allocation: Age 25 = 95% stocks/5% bonds, Age 35 = 85% stocks/15% bonds, Age 45 = 75% stocks/25% bonds. Use a target-date fund (like VTTSX) that automatically adjusts this mix as you age, or manually rebalance annually.',
    realMoneyExample: 'Conservative 30-year-old (60% stocks) vs Aggressive 30-year-old (90% stocks) over 35 years: $500/month invested. Conservative: $1.15M final value. Aggressive: $1.67M final value. Extra risk generated $523,000 more wealth by retirement.',
    warningTip: 'The biggest allocation mistake: becoming more conservative after market crashes when you should be more aggressive. Young investors who shifted to bonds after 2008 missed the 2009-2020 bull market.'
  },
  {
    title: 'Geographic & Sector Diversification',
    icon: Globe,
    content: 'Home country bias is expensive. US investors often hold 90%+ domestic stocks, missing global opportunities. International markets don\'t move in lockstep with US markets, providing valuable diversification. Emerging markets add growth potential but higher volatility. Sector diversification prevents technology bubble scenarios.',
    practicalAction: 'Target allocation: 60% US stocks, 25% International Developed (Europe, Japan, Australia), 15% Emerging Markets (China, India, Brazil). Within sectors, avoid overweighting your employer\'s industry. If you work in tech, don\'t overload on tech stocks.',
    realMoneyExample: 'From 2000-2010: US stocks returned 0% (lost decade), but international developed markets returned 30% and emerging markets returned 150%. A $10,000 US-only portfolio stayed at $10,000, while globally diversified portfolio grew to $18,000.',
    warningTip: 'Don\'t chase last year\'s best-performing region. International stocks underperformed US for 2010-2020, leading many to abandon global diversification right before international stocks began outperforming again in 2021.'
  },
  {
    title: 'Bond Allocation & Fixed Income Strategy',
    icon: Shield,
    content: 'Bonds provide portfolio ballast and reduce volatility, not high returns. Their job is stability and income, especially near retirement. Bond duration (sensitivity to interest rates) and credit quality matter more than yield chasing. Longer duration = higher interest rate risk. Lower credit quality = higher default risk.',
    practicalAction: 'For young investors: 10-20% in total bond market index (VBTLX) provides adequate diversification. Near retirement: 30-40% bonds with mix of intermediate-term government and high-grade corporate bonds. Avoid long-term bonds unless you understand duration risk.',
    realMoneyExample: 'During 2022 interest rate spike: Long-term bonds lost 25-30%, while intermediate-term bonds lost 10-15%. A portfolio with 30% long-term bonds lost $7,500 on $100,000 vs $4,500 loss with intermediate bonds. Lesson: duration matters.',
    warningTip: 'Bond funds can lose money when interest rates rise. This isn\'t failure—it\'s how bonds work. Don\'t panic sell bonds during rate increases; hold for yield and wait for maturity/reinvestment at higher rates.'
  },
  {
    title: 'Rebalancing: Your Profit-Taking Mechanism',
    icon: Target,
    content: 'Rebalancing forces disciplined "buy low, sell high" behavior by trimming winners and adding to losers. This contrarian action feels wrong but drives long-term returns. Rebalance when allocations drift 5+ percentage points from targets, or annually—whichever comes first.',
    practicalAction: 'Set calendar reminder for annual rebalancing (suggest December). Check each asset class against target allocation. If US stocks are 70% but target is 60%, sell 10% and buy underweight assets. Use new contributions to buy underweight assets before selling.',
    realMoneyExample: 'From 1970-2020: Annual rebalancing added 0.5% per year to returns. On $500,000 portfolio over 30 years, this "rebalancing bonus" generated an extra $748,000 through disciplined profit-taking and contrarian investing.',
    warningTip: 'The hardest rebalancing decision: selling your best performers to buy assets that have disappointed. This feels like selling winners to buy losers, but it\'s actually selling high to buy low—the essence of successful investing.'
  },
  {
    title: 'Tax-Efficient Portfolio Construction',
    icon: Zap,
    content: 'Asset location (which assets go in which accounts) matters as much as asset allocation. Tax-inefficient investments belong in tax-advantaged accounts, while tax-efficient index funds work well in taxable accounts. This tax alpha can add 0.5-1% annually to after-tax returns.',
    practicalAction: 'Priority order: 401k/IRA = Bonds and REITs (tax-inefficient), Taxable = US/International index funds (tax-efficient), Roth IRA = Highest growth potential assets (benefit from tax-free growth). Never hold tax-exempt bonds in tax-advantaged accounts.',
    realMoneyExample: 'REIT in taxable account (30% tax rate) vs tax-advantaged account over 20 years: $10,000 REIT yielding 4% annually. Taxable account: $19,200 after taxes. Tax-advantaged: $21,900. Tax-efficient placement saved $2,700 on single holding.',
    warningTip: 'Don\'t let tax tail wag investment dog. Asset allocation comes first, tax optimization second. Never sacrifice proper diversification just to minimize current year taxes—the long-term growth cost exceeds tax savings.'
  }
];

export default function PortfolioConstructionLessonEnhanced({ onComplete }: PortfolioConstructionLessonProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));
  const [startTime, setStartTime] = useState<Date>();
  const [lessonStartTime, setLessonStartTime] = useState<Date>(new Date());
  const { completeLesson } = useProgressStore();

  useEffect(() => {
    setStartTime(new Date());
    setLessonStartTime(new Date());
  }, []);

  useEffect(() => {
    setLessonStartTime(new Date());
  }, [currentLesson]);

  const handleLessonComplete = () => {
    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    // Record time spent on this lesson
    if (lessonStartTime) {
      // Track study time for analytics (implementation pending)
    }

    toast.success(`Lesson ${currentLesson + 1} completed! 🎯`, {
      duration: 2000,
      position: 'top-center',
    });

    // Check if all lessons are completed
    if (newCompleted.every(completed => completed)) {
      handleAllLessonsComplete();
    }
  };

  const handleAllLessonsComplete = () => {
    if (startTime) {
      const totalTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
      completeLesson('portfolio-construction-enhanced-lesson', totalTime);
    }
    
    onComplete?.();
    toast.success('Portfolio Construction mastery achieved! Time for advanced practice! 🏆', {
      duration: 4000,
      position: 'top-center',
    });
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

  const currentLessonContent = enhancedLessons[currentLesson];
  const Icon = currentLessonContent.icon;
  const progress = ((currentLesson + 1) / enhancedLessons.length) * 100;
  const completedCount = completedLessons.filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 ${theme.status.success.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${theme.status.success.text}`} />
        </div>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Portfolio Construction & Asset Allocation
        </h1>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Master the science of building optimal portfolios that maximize returns while managing risk through strategic diversification.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GradientCard variant="glass" gradient="blue" className="p-4 text-center">
          <ProgressRing progress={progress} size={60} strokeWidth={4} />
          <p className={`text-sm ${theme.textColors.primary} font-medium mt-2`}>Overall Progress</p>
        </GradientCard>
        
        <GradientCard variant="glass" gradient="green" className="p-4 text-center">
          <div className={`text-2xl font-bold ${theme.textColors.primary}`}>{completedCount}/{enhancedLessons.length}</div>
          <p className={`text-sm ${theme.textColors.secondary}`}>Lessons Complete</p>
        </GradientCard>
        
        <GradientCard variant="glass" gradient="purple" className="p-4 text-center">
          <div className={`text-2xl font-bold ${theme.textColors.primary}`}>{currentLesson + 1}</div>
          <p className={`text-sm ${theme.textColors.secondary}`}>Current Lesson</p>
        </GradientCard>
        
        <GradientCard variant="glass" gradient="yellow" className="p-4 text-center">
          <Award className={`w-8 h-8 ${theme.textColors.primary} mx-auto`} />
          <p className={`text-sm ${theme.textColors.secondary}`}>Portfolio Builder</p>
        </GradientCard>
      </div>

      {/* Main Lesson Content */}
      <GradientCard variant="glass" gradient="blue" className="p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${theme.status.info.bg} rounded-xl flex items-center justify-center mr-4`}>
              <Icon className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {currentLessonContent.title}
              </h2>
              <p className={`text-sm ${theme.textColors.muted}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </p>
            </div>
          </div>
          
          {completedLessons[currentLesson] && (
            <div className={`w-8 h-8 ${theme.status.success.bg} rounded-full flex items-center justify-center`}>
              <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
            </div>
          )}
        </div>

          {/* Progress Bar */}
          <div className={`w-full bg-slate-800/50 rounded-full h-2 mb-8`}>
            <div
              className={`h-2 ${theme.status.success.bg} rounded-full transition-all duration-500`}
              style={{ width: `${((currentLesson + 1) / enhancedLessons.length) * 100}%` }}
              aria-hidden="true"
            />
          </div>        {/* Lesson Content */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <Lightbulb className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Core Concept
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.content}
            </p>
          </div>

          <div className={`p-6 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center`}>
              <Target className="w-5 h-5 mr-2" />
              Practical Action Step
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.practicalAction}
            </p>
          </div>

          <div className={`p-6 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center`}>
              <DollarSign className="w-5 h-5 mr-2" />
              Real Money Example
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.realMoneyExample}
            </p>
          </div>

          <div className={`p-6 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center`}>
              <AlertTriangle className="w-5 h-5 mr-2" />
              Critical Warning
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonContent.warningTip}
            </p>
          </div>

          {/* Interactive Calculator References */}
          {currentLesson === 0 && (
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                📊 Try It Now: Portfolio Construction Tools
              </h4>
              <p className={`text-sm ${theme.status.info.text}`}>
                Use our <strong>Portfolio Overview Calculator</strong> in the Calculator tab to analyze your current portfolio allocation and see how Modern Portfolio Theory applies to your investments.
              </p>
            </div>
          )}

          {currentLesson === 1 && (
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                🎯 Try It Now: Asset Allocation Calculator
              </h4>
              <p className={`text-sm ${theme.status.info.text}`}>
                Use our <strong>Portfolio Overview Calculator</strong> in the Calculator tab to find your optimal asset allocation based on your age and risk tolerance.
              </p>
            </div>
          )}

          {currentLesson === 2 && (
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                🌍 Try It Now: Diversification Analyzer
              </h4>
              <p className={`text-sm ${theme.status.info.text}`}>
                Use our <strong>Diversification Calculator</strong> in the Calculator tab to measure your portfolio&apos;s diversification score across asset classes and geographic regions.
              </p>
            </div>
          )}

          {currentLesson === 3 && (
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                ⚖️ Try It Now: Rebalancing Calculator
              </h4>
              <p className={`text-sm ${theme.status.info.text}`}>
                Use our <strong>Rebalancing Calculator</strong> in the Calculator tab to determine exactly when and how to rebalance your portfolio to maintain optimal allocation.
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {!completedLessons[currentLesson] && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLessonComplete}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center mx-auto`}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Mark Lesson Complete
            </button>
          </div>
        )}
      </GradientCard>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={prevLesson}
          disabled={currentLesson === 0}
          className={`flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous Lesson
        </button>

        <div className="flex space-x-2">
          {enhancedLessons.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentLesson(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentLesson
                  ? theme.status.info.bg
                  : completedLessons[index]
                  ? theme.status.success.bg
                  : `bg-slate-800/50 opacity-50`
              }`}
              title={`Go to lesson ${index + 1}`}
              aria-label={`Lesson ${index + 1} navigation dot`}
            />
          ))}
        </div>

        <button
          onClick={nextLesson}
          disabled={currentLesson === enhancedLessons.length - 1}
          className={`flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          title="Go to next lesson"
          aria-label="Next lesson navigation"
        >
          Next Lesson
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Interactive Portfolio Construction Tools */}
      <div className="space-y-8 mb-8">
        <GradientCard className="text-center">
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            🛠️ Interactive Portfolio Construction Suite
          </h2>
          <p className={`text-lg ${theme.textColors.secondary} mb-8 max-w-4xl mx-auto`}>
            Master portfolio construction with these advanced tools. Analyze diversification, 
            optimize rebalancing strategies, and explore Modern Portfolio Theory principles with real-time calculations.
          </p>
        </GradientCard>

        {/* Portfolio Diversification Analyzer */}
        <GradientCard>
          <PortfolioDiversificationAnalyzer />
        </GradientCard>

        {/* Rebalancing Optimizer */}
        <GradientCard>
          <RebalancingOptimizer />
        </GradientCard>

        {/* Modern Portfolio Theory Visualizer */}
        {/*<GradientCard>
          <ModernPortfolioTheoryVisualizer />
        </GradientCard>*/}

        {/* Monte Carlo Portfolio Simulation */}
        <GradientCard>
          <MonteCarloSimulation />
        </GradientCard>
      </div>

      {/* Completion Status */}
      {completedCount === enhancedLessons.length && (
        <GradientCard variant="glass" gradient="green" className="p-6 text-center">
          <Award className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-4`} />
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>
            Portfolio Construction Mastery Achieved!
          </h3>
          <p className={`${theme.textColors.secondary} mb-4`}>
            You&apos;ve completed all lessons on building optimal investment portfolios. Ready to test your knowledge?
          </p>
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-2xl font-bold ${theme.status.success.text}`}>
              {completedCount}/{enhancedLessons.length} Complete
            </span>
            <Star className={`w-6 h-6 ${theme.status.success.text}`} />
          </div>
        </GradientCard>
      )}
    </div>
  );
}

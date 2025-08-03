'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Home,
  TrendingUp,
  Target,
  Shield,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  DollarSign,
  Award,
  AlertTriangle,
  Building,
  Coins
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RealEstateAlternativesLessonProps {
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
    title: 'Real Estate Investment Fundamentals: The Wealth-Building Asset Class',
    icon: Home,
    content: 'Real estate offers unique advantages: leverage through mortgages, cash flow through rent, appreciation potential, tax benefits including depreciation, and inflation hedge properties. Unlike stocks, real estate provides tangible assets you can improve and control. However, it requires significant capital, active management, and carries liquidity, location, and tenant risks.',
    practicalAction: 'Start by analyzing your local rental market: Research average rent-to-price ratios, vacancy rates, and neighborhood growth trends. Use the 1% rule as initial screening (monthly rent ≥ 1% of purchase price). Consider house hacking: buy a duplex, live in one unit, rent the other to reduce living expenses while building equity.',
    realMoneyExample: 'Investor buys $300,000 duplex with 20% down ($60,000). Lives in one unit, rents other for $1,800/month. Mortgage payment: $1,400. Net housing cost: $0 (rent covers mortgage). After 5 years: $200,000 in equity appreciation + $108,000 rent collected - $15,000 maintenance = $293,000 total return on $60,000 investment (489% ROI).',
    warningTip: 'Real estate is NOT passive income initially. Budget 1-2% annually for maintenance, 5-10% for vacancy, and 8-12% for property management if you don&apos;t self-manage. Always inspect properties professionally and never buy in declining neighborhoods regardless of price.'
  },
  {
    title: 'REITs vs Direct Real Estate: The Accessibility Alternative',
    icon: Building,
    content: 'Real Estate Investment Trusts (REITs) offer real estate exposure without direct ownership challenges. REITs trade like stocks, provide instant diversification across property types/locations, offer professional management, and typically pay 3-5% dividends. However, they lack control, leverage benefits, and tax advantages of direct ownership.',
    practicalAction: 'Allocate 5-15% of portfolio to REITs for diversification. Focus on broad-market REIT index funds (VNQ, FREL) rather than individual REITs. For direct real estate, start with house hacking or small multifamily properties in growing suburbs with good schools, job growth, and infrastructure development.',
    realMoneyExample: '$100,000 REIT investment yields 4% annually ($4,000 dividend) plus 3% appreciation ($3,000) = $7,000 total return (7%). Same $100,000 as down payment on $500,000 rental property: $24,000 annual rent - $18,000 expenses = $6,000 cash flow + $15,000 appreciation = $21,000 return (21% leveraged return).',
    warningTip: 'REITs are more correlated with stock market than direct real estate. During 2008-2009, REITs fell 60%+ while quality rental properties fell only 20-30%. Never use REITs as your only real estate exposure if you have the capital and skills for direct investment.'
  },
  {
    title: 'Cryptocurrency & Digital Assets: The Emerging Asset Class',
    icon: Coins,
    content: 'Cryptocurrency represents a new asset class with potential for outsized returns but extreme volatility. Bitcoin has generated 160%+ annual returns over 10+ years but with 80%+ drawdowns. Crypto offers portfolio diversification, inflation hedge potential, and 24/7 global markets. However, regulatory uncertainty, technological risks, and speculative nature make it high-risk.',
    practicalAction: 'Limit crypto to 5-10% of total portfolio maximum. Focus on established cryptocurrencies (Bitcoin, Ethereum) rather than altcoins. Use dollar-cost averaging monthly purchases rather than lump sums. Store crypto in secure hardware wallets, never on exchanges long-term. Understand tax implications: every trade is taxable event.',
    realMoneyExample: 'Investor allocates 5% of $200,000 portfolio ($10,000) to Bitcoin via monthly $500 purchases over 20 months. Average purchase price: $35,000. Bitcoin rises to $70,000: investment doubles to $20,000. Portfolio impact: +5% total return. If Bitcoin crashed to $17,500 (50% loss), portfolio impact: only -2.5% loss.',
    warningTip: 'Crypto is extremely volatile and speculative. Only invest money you can afford to lose completely. Beware of crypto lending platforms, DeFi protocols, and new altcoins - many are scams or will fail. Never take on debt to buy crypto or exceed 10% portfolio allocation.'
  },
  {
    title: 'Commodities & Precious Metals: The Inflation Hedge Portfolio',
    icon: Shield,
    content: 'Commodities (gold, oil, agricultural products) provide inflation protection and portfolio diversification. Gold historically maintains purchasing power over centuries and performs well during currency debasement. However, commodities produce no income, can be volatile, and may underperform stocks/bonds over long periods.',
    practicalAction: 'Allocate 5-10% to commodities for inflation protection. Use broad commodity ETFs (DJP, PDBC) rather than individual commodities. For gold exposure, use gold ETFs (GLD, IAU) rather than physical gold to avoid storage/insurance costs. Consider I-Bonds for inflation protection with government backing.',
    realMoneyExample: 'During 1970s inflation crisis: Stocks returned 6.8% annually, bonds 6.1%, but gold returned 31% annually. $10,000 in gold became $76,000 vs $19,000 in stocks. However, from 1980-2000: Gold returned 0% while S&P 500 returned 17% annually. Timing and allocation matter significantly.',
    warningTip: 'Commodities can go decades without positive returns. Gold peaked in 1980 and didn&apos;t recover until 2008 (28 years). Never use commodities as primary investment - they&apos;re portfolio insurance, not wealth builders. Avoid commodity individual stocks - they&apos;re business risks, not commodity exposure.'
  },
  {
    title: 'Private Equity & Hedge Funds: The Accredited Investor Advantage',
    icon: TrendingUp,
    content: 'Private equity and hedge funds offer institutional-quality strategies unavailable to retail investors. Private equity targets 15-20% annual returns through business improvements and leverage. Hedge funds provide market-neutral strategies and downside protection. However, they require $1M+ minimums, charge high fees (2% + 20%), and have long lock-up periods.',
    practicalAction: 'For accredited investors: Allocate 10-20% to alternatives through diversified fund-of-funds or interval funds. For non-accredited: Use liquid alternative mutual funds (RPHYX, ABRYX) or private REIT platforms (Fundrise, YieldStreet) for alternative exposure. Focus on established managers with 10+ year track records.',
    realMoneyExample: 'High-net-worth investor allocates $500,000 to private equity fund targeting 18% returns over 7 years. After 2.5% management fees and 20% performance fees: Net return 13% annually. $500,000 becomes $1.25M over 7 years vs $900,000 in S&P 500 at 8% returns. Extra $350,000 return justifies higher fees and illiquidity.',
    warningTip: 'Alternative investments are illiquid and risky. Many funds fail to beat market after fees. Never invest more than you can afford to lock up for 5-10 years. Beware of marketing materials - most alternative investments underperform simple index fund portfolios after fees.'
  },
  {
    title: 'Alternative Investment Portfolio Construction & Risk Management',
    icon: Target,
    content: 'Alternative investments should complement, not replace, traditional stock/bond portfolios. Optimal allocation: 70-80% traditional assets (stocks/bonds), 15-25% alternatives (real estate, commodities, crypto), 5-10% speculative/emerging assets. Rebalance annually, but understand liquidity constraints of alternatives.',
    practicalAction: 'Build alternatives gradually over 3-5 years to average into markets. Start with liquid alternatives (REITs, commodity ETFs) before illiquid investments (direct real estate, private equity). Maintain 6-12 months emergency fund separate from investment portfolio. Review alternative allocations annually during tax-loss harvesting season.',
    realMoneyExample: 'Balanced portfolio: $500K stocks (50%), $200K bonds (20%), $150K REITs (15%), $100K alternatives (10%), $50K cash (5%). During 2008 crisis: Stocks -37%, bonds +5%, REITs -17%, alternatives -10%, cash +2%. Portfolio loss: -21% vs -37% stock-only portfolio. Faster recovery due to diversification.',
    warningTip: 'Over-diversification into alternatives can hurt returns. Warren Buffett won a famous bet that S&P 500 would outperform hedge funds over 10 years. Keep alternatives as portfolio stabilizers and inflation hedges, not primary return drivers. Simple beats complex for most investors.'
  }
];

export default function RealEstateAlternativesLessonEnhanced({ onComplete }: RealEstateAlternativesLessonProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));
  const [startTime, setStartTime] = useState<Date>();
  const { completeLesson } = useProgressStore();

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const handleLessonComplete = () => {
    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`Lesson ${currentLesson + 1} completed! 🏠`, {
      duration: 2000,
      position: 'top-center',
    });

    if (newCompleted.every(completed => completed)) {
      handleAllLessonsComplete();
    }
  };

  const handleAllLessonsComplete = () => {
    if (startTime) {
      const totalTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
      completeLesson('real-estate-alternatives-enhanced-lesson', totalTime);
    }
    
    onComplete?.();
    toast.success('Real Estate & Alternative Investments mastery achieved! 🏆', {
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
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Real Estate & Alternative Investments
        </h1>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Master advanced investment strategies beyond traditional stocks and bonds to build a diversified wealth portfolio.
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
          <Home className={`w-8 h-8 ${theme.textColors.primary} mx-auto`} />
          <p className={`text-sm ${theme.textColors.secondary}`}>Alt Investor</p>
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
          />
        </div>

        {/* Lesson Content */}
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
            />
          ))}
        </div>

        <button
          onClick={nextLesson}
          disabled={currentLesson === enhancedLessons.length - 1}
          className={`flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        >
          Next Lesson
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Completion Status */}
      {completedCount === enhancedLessons.length && (
        <GradientCard variant="glass" gradient="green" className="p-6 text-center">
          <Award className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-4`} />
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>
            Alternative Investment Mastery Achieved!
          </h3>
          <p className={`${theme.textColors.secondary} mb-4`}>
            You&apos;ve completed all lessons on real estate and alternative investments. Ready to test your knowledge?
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

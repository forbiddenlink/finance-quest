'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  PieChart,
  Building,
  Package,
  Coins,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  DollarSign,
  Award,
  AlertTriangle,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AlternativeInvestmentsLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  icon: React.ElementType;
  content: {
    concept: string;
    explanation: string;
    realWorldExample: string;
    practicalAction: string;
    warning: string;
  };
}

const enhancedLessons: LessonContent[] = [
  {
    title: "Introduction to Alternative Investments",
    icon: PieChart,
    content: {
      concept: "Expanding Beyond Traditional Stocks and Bonds",
      explanation: "Alternative investments include assets outside traditional stocks, bonds, and cash. These include real estate (REITs), commodities (gold, oil), cryptocurrency, private equity, hedge funds, collectibles, and peer-to-peer lending. They often have low correlation with stock markets, providing diversification benefits, but typically require higher minimums, have less liquidity, and carry unique risks that require specialized knowledge.",
      realWorldExample: "During the 2008 financial crisis, while the S&P 500 fell 37%, gold gained 5.8% and many REITs paid steady dividends. However, in 2022, as inflation soared and interest rates rose, REITs fell 25% while traditional bonds lost 13%. This shows how alternatives can provide protection in some scenarios but not others. A Yale endowment model with 30% alternatives has historically reduced volatility while maintaining strong returns.",
      practicalAction: "Start small with liquid alternatives: Allocate 5-15% of your portfolio to REITs through VNQ (Vanguard Real Estate ETF), add commodity exposure with DJP (commodities ETF), or consider 1-3% in Bitcoin through a reputable exchange like Coinbase. Focus on understanding each asset class before investing, and never exceed your risk tolerance with speculative alternatives.",
      warning: "Alternative investments often have higher fees (REITs: 0.12%, private equity: 2-20%, crypto exchanges: 0.5-4%) and less regulation than traditional investments. Many alternatives are illiquid - you may not be able to sell quickly. Don't chase performance or put more than 20% of your portfolio in alternatives until you have a solid foundation in stocks and bonds."
    }
  },
  {
    title: "Real Estate Investment Trusts (REITs)",
    icon: Building,
    content: {
      concept: "Investing in Real Estate Without Direct Property Ownership",
      explanation: "REITs are companies that own and operate income-producing real estate. They must distribute 90% of taxable income as dividends, making them attractive for income-focused investors. REITs provide exposure to commercial real estate (office buildings, shopping malls, warehouses) and residential properties without the hassles of direct ownership. They trade on stock exchanges like regular stocks but often behave differently than the broader market.",
      realWorldExample: "Realty Income (O) is known as 'The Monthly Dividend Company,' paying monthly dividends for over 25 years with a current yield of 5.5%. They own 11,000+ properties leased to Walgreens, FedEx, and other tenants on long-term contracts. During COVID, while retail REITs struggled (Simon Property Group fell 60%), data center REITs like Digital Realty Trust gained 15% as cloud computing demand surged. This shows how different REIT sectors perform differently based on economic trends.",
      practicalAction: "Start with broad REIT diversification through VNQ (Vanguard Real Estate ETF) or SCHH (Schwab US REIT ETF) for instant exposure to 150+ REITs. For individual REITs, focus on those with strong management, diversified tenant bases, and growth markets. Consider allocation by sector: 40% residential apartments, 30% commercial office/retail, 20% industrial/logistics, 10% specialty (data centers, cell towers).",
      warning: "REITs are sensitive to interest rates - when rates rise, REIT prices often fall as their borrowing costs increase and their dividend yields become less attractive relative to bonds. They also have tax disadvantages - REIT dividends are taxed as ordinary income (up to 37%) rather than qualified dividend rates (15-20%). Consider holding REITs in tax-advantaged accounts like IRAs."
    }
  },
  {
    title: "Commodities & Natural Resources",
    icon: Package,
    content: {
      concept: "Investing in Physical Goods and Raw Materials",
      explanation: "Commodities include agricultural products (wheat, corn, soybeans), energy (oil, natural gas), industrial metals (copper, aluminum), and precious metals (gold, silver). They often perform well during inflationary periods when the prices of goods rise, but can be volatile due to weather, geopolitical events, and supply/demand imbalances. Commodity investing provides portfolio diversification and inflation protection but typically doesn't generate income like stocks or bonds.",
      realWorldExample: "During the 1970s inflation crisis, when stocks and bonds struggled, gold rose from $35 to $850 per ounce (a 2,400% gain). More recently, as inflation surged in 2021-2022, oil prices doubled from $40 to $120 per barrel, while agricultural commodities rose 30%+. However, from 2011-2020, the DJP commodities index fell 60% while stocks gained 250%, showing commodities can underperform for extended periods.",
      practicalAction: "Gain commodity exposure through ETFs rather than direct ownership: DJP (diversified commodities), GLD (gold), USO (oil), or DBA (agriculture). Consider a 5-10% allocation during high inflation periods, but remember commodities don't compound like stocks - they're primarily portfolio diversifiers. Focus on broad commodity indexes rather than individual commodities unless you have specialized knowledge.",
      warning: "Commodities are extremely volatile - oil has ranged from -$37 to $147 per barrel in the past 15 years. They also don't produce income and have storage/contango costs that can erode returns over time. Many commodity ETFs use futures contracts rather than physical commodities, which can behave differently than spot prices. Avoid leveraged commodity funds unless you understand the risks."
    }
  },
  {
    title: "Cryptocurrency & Digital Assets",
    icon: Coins,
    content: {
      concept: "Digital Currencies and Blockchain-Based Investments",
      explanation: "Cryptocurrency represents a new asset class based on blockchain technology. Bitcoin, the first and largest cryptocurrency, functions as digital gold - a store of value with limited supply (21 million coins). Other cryptocurrencies like Ethereum enable smart contracts and decentralized applications. Crypto offers potential for high returns but comes with extreme volatility, regulatory uncertainty, and technology risks that make it suitable only for small portfolio allocations.",
      realWorldExample: "Bitcoin rose from $0.01 in 2010 to over $69,000 in 2021 (a 6.9 million% gain), making early adopters incredibly wealthy. However, it also fell 85% multiple times (2018: $20k to $3k, 2022: $69k to $15k), demonstrating extreme volatility. Ethereum enabled the DeFi (decentralized finance) revolution, with its ecosystem growing from $1 billion to $100+ billion in total value locked, but it also crashed 90%+ during bear markets.",
      practicalAction: "If interested in crypto, limit allocation to 1-5% of your portfolio - money you can afford to lose completely. Start with Bitcoin and Ethereum through reputable exchanges like Coinbase, Kraken, or Gemini. Use dollar-cost averaging to reduce timing risk, and consider cold storage (hardware wallets) for security. Never invest based on social media hype or get-rich-quick promises.",
      warning: "Cryptocurrency is extremely speculative and volatile - 50%+ daily moves are common. Regulatory crackdowns could significantly impact values, and technological risks (exchange hacks, lost keys, protocol failures) can result in total loss. Many altcoins go to zero, and the space is filled with scams and fraud. Only invest what you can afford to lose, and beware of emotional FOMO (fear of missing out) investing."
    }
  },
  {
    title: "Alternative Investment Strategies & Platforms",
    icon: TrendingUp,
    content: {
      concept: "Accessing Private Markets and Specialized Investments",
      explanation: "Alternative investment platforms now allow retail investors to access previously exclusive investments like private real estate, venture capital, private equity, and hedge funds. Platforms like Fundrise (real estate), YieldStreet (various alternatives), and Republic (startups) have democratized access to these investments. However, they often require higher minimums, longer lock-up periods, and carry additional risks compared to public market investments.",
      realWorldExample: "Fundrise has delivered 8-13% annual returns since 2014 by investing in commercial real estate projects across the US, with a minimum investment of just $500. YieldStreet offers access to art, legal settlements, and marine finance deals with target returns of 8-15%. However, these investments are illiquid - you typically can't withdraw for 1-5 years, and returns aren't guaranteed. Some peer-to-peer lending platforms like LendingClub have seen default rates spike during economic downturns.",
      practicalAction: "Before exploring alternative platforms, ensure you have a solid foundation in traditional investments (emergency fund, 401k contributions, diversified stock/bond portfolio). If interested, start with small amounts ($500-2,000) to learn how these platforms work. Research the platform's track record, fee structure, and liquidity terms carefully. Diversify across multiple platforms rather than concentrating in one.",
      warning: "Alternative investment platforms often charge high fees (1-3% annually plus performance fees), have limited liquidity, and may not provide the promised diversification during market stress. Many are newer companies without long track records, and regulatory oversight is often limited. Some platforms have failed or reduced investor access during downturns. Never invest more than 10-15% of your portfolio in illiquid alternatives."
    }
  },
  {
    title: "Portfolio Integration & Risk Management",
    icon: Shield,
    content: {
      concept: "Incorporating Alternatives into a Balanced Investment Strategy",
      explanation: "Alternative investments should complement, not replace, a core portfolio of stocks and bonds. The optimal allocation depends on your risk tolerance, time horizon, and investment goals. Academic research suggests 5-25% in alternatives can improve risk-adjusted returns, but the benefits diminish beyond 25%. The key is choosing alternatives that are truly non-correlated with your core holdings and rebalancing regularly to maintain target allocations.",
      realWorldExample: "The Yale Endowment allocates about 30% to alternatives (private equity, hedge funds, real estate) and has achieved superior long-term returns with lower volatility than traditional 60/40 portfolios. However, during the 2008 crisis, their illiquid alternatives couldn't be easily sold, forcing them to sell liquid holdings at poor prices. This demonstrates the importance of maintaining adequate liquidity even with alternative investments.",
      practicalAction: "Use a tiered approach: Tier 1 (70-80%): Traditional stocks and bonds through low-cost index funds. Tier 2 (15-25%): Liquid alternatives like REITs, commodities, and international stocks. Tier 3 (5-10%): Speculative alternatives like crypto, individual rental properties, or alternative platforms. Rebalance annually and never chase performance by increasing allocations to recent winners.",
      warning: "Don't let alternatives become too large a portion of your portfolio - they should reduce overall risk, not increase it. Many alternatives have hidden correlations that only appear during market stress - real estate and stocks both fell in 2008. Also, resist the temptation to constantly add new alternative investments - complexity doesn't necessarily improve returns and can make portfolio management difficult."
    }
  }
];

export default function AlternativeInvestmentsLessonEnhanced({ onComplete }: AlternativeInvestmentsLessonProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonStartTime, setLessonStartTime] = useState(Date.now());
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));
  const [showingSummary, setShowingSummary] = useState(false);
  
  const { completeLesson, userProgress } = useProgressStore();

  useEffect(() => {
    setLessonStartTime(Date.now());
  }, [currentLesson]);

  const completedCount = completedLessons.filter(Boolean).length;
  const progressPercentage = (completedCount / enhancedLessons.length) * 100;

  const handleNextLesson = () => {
    if (currentLesson < enhancedLessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
    } else {
      setShowingSummary(true);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(prev => prev - 1);
    }
  };

  const handleCompleteLesson = () => {
    const timeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
    const lessonId = `alternative-investments-enhanced-${currentLesson}`;
    
    completeLesson(lessonId, timeSpent);
    
    setCompletedLessons(prev => {
      const updated = [...prev];
      updated[currentLesson] = true;
      return updated;
    });

    toast.success('Lesson completed! 🎉');
    
    // Auto-advance to next lesson
    setTimeout(() => {
      handleNextLesson();
    }, 1000);
  };

  const handleFinishChapter = () => {
    const totalTimeSpent = Math.floor((Date.now() - lessonStartTime) / 1000);
    completeLesson('alternative-investments-chapter-complete', totalTimeSpent);
    toast.success('Chapter 15 completed! Ready for the quiz! 🚀');
    onComplete?.();
  };

  if (showingSummary) {
    return (
      <div className="max-w-4xl mx-auto">
        <GradientCard className="p-8 text-center">
          <div className={`w-20 h-20 ${theme.status.success.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <Award className={`w-10 h-10 ${theme.status.success.text}`} />
          </div>
          
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            Alternative Investments Mastery Complete! 🎉
          </h2>
          
          <p className={`text-lg ${theme.textColors.secondary} mb-8 max-w-2xl mx-auto`}>
            You've mastered the fundamentals of alternative investments including REITs, commodities, 
            cryptocurrency, and portfolio integration strategies. You now understand how to diversify 
            beyond traditional stocks and bonds while managing the unique risks of alternative assets.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-3xl mx-auto mb-8">
            {enhancedLessons.map((lesson, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 ${theme.status.success.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <lesson.icon className={`w-6 h-6 ${theme.status.success.text}`} />
                </div>
                <p className={`text-xs ${theme.textColors.muted}`}>
                  {lesson.title.split(' ')[0]} {lesson.title.split(' ')[1]}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowingSummary(false)}
              className={`px-6 py-3 ${theme.buttons.secondary} rounded-xl transition-all hover-lift flex items-center justify-center`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Review Lessons
            </button>
            
            <button
              onClick={handleFinishChapter}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center justify-center`}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Take Chapter Quiz
            </button>
          </div>
        </GradientCard>
      </div>
    );
  }

  const currentLessonData = enhancedLessons[currentLesson];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-2`}>
          Chapter 15: Alternative Investments
        </h1>
        <p className={`text-xl ${theme.textColors.secondary} mb-6`}>
          Diversifying Beyond Traditional Assets
        </p>
        
        <div className="flex items-center justify-center gap-8 mb-6">
          <ProgressRing 
            progress={progressPercentage}
            size={80}
            strokeWidth={8}
            className="text-purple-400"
          />
          <div className={`text-left ${theme.textColors.secondary}`}>
            <p>Lesson {currentLesson + 1} of {enhancedLessons.length}</p>
            <p className="text-sm">Progress: {completedCount} of {enhancedLessons.length} lessons</p>
            <p className="text-sm">Completion: {Math.round(progressPercentage)}%</p>
          </div>
        </div>
      </div>

      {/* Current Lesson */}
      <GradientCard className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 ${theme.backgrounds.glass} rounded-xl flex items-center justify-center border ${theme.borderColors.primary}`}>
            <currentLessonData.icon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
              {currentLessonData.title}
            </h2>
            <p className={`${theme.textColors.muted}`}>
              Lesson {currentLesson + 1} of {enhancedLessons.length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Core Concept */}
          <div className={`p-6 ${theme.backgrounds.glass} rounded-xl border ${theme.borderColors.primary}`}>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Core Concept</h3>
            </div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>
              {currentLessonData.content.concept}
            </h4>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.explanation}
            </p>
          </div>

          {/* Real Money Example */}
          <div className={`p-6 ${theme.status.success.bg} rounded-xl border border-green-500/20`}>
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Real Money Example</h3>
            </div>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.realWorldExample}
            </p>
          </div>

          {/* Take Action Now */}
          <div className={`p-6 ${theme.status.info.bg} rounded-xl border border-blue-500/20`}>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Take Action Now</h3>
            </div>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.practicalAction}
            </p>
          </div>

          {/* Warning */}
          <div className={`p-6 ${theme.status.warning.bg} rounded-xl border border-yellow-500/20`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Important Warning</h3>
            </div>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentLessonData.content.warning}
            </p>
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={handlePreviousLesson}
            disabled={currentLesson === 0}
            className={`flex items-center px-6 py-3 rounded-xl transition-all ${
              currentLesson === 0 
                ? 'opacity-50 cursor-not-allowed bg-slate-700' 
                : `${theme.buttons.secondary} hover-lift`
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          <div className="flex gap-4">
            {!completedLessons[currentLesson] && (
              <button
                onClick={handleCompleteLesson}
                className={`px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Lesson
              </button>
            )}

            <button
              onClick={handleNextLesson}
              className={`flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift`}
            >
              {currentLesson === enhancedLessons.length - 1 ? (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  Chapter Summary
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </GradientCard>

      {/* Progress Summary */}
      <GradientCard className="p-6">
        <h3 className={`text-lg font-bold ${theme.textColors.primary} mb-4`}>Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {enhancedLessons.map((lesson, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                index === currentLesson
                  ? `${theme.status.info.bg} border-blue-500/50`
                  : completedLessons[index]
                  ? `${theme.status.success.bg} border-green-500/50`
                  : `${theme.backgrounds.glass} border-slate-600 opacity-60`
              }`}
              onClick={() => setCurrentLesson(index)}
            >
              <lesson.icon className={`w-6 h-6 mx-auto mb-2 ${
                index === currentLesson
                  ? 'text-blue-400'
                  : completedLessons[index]
                  ? 'text-green-400'
                  : 'text-slate-400'
              }`} />
              <p className={`text-xs ${theme.textColors.muted} leading-tight`}>
                {lesson.title.split(' ').slice(0, 2).join(' ')}
              </p>
              {completedLessons[index] && (
                <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>
      </GradientCard>
    </div>
  );
}

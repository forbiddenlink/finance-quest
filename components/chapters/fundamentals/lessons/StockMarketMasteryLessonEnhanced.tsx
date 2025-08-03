'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
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
  BarChart3,
  Coins,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StockMarketMasteryLessonProps {
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
    title: "Stock Market Fundamentals",
    icon: TrendingUp,
    content: {
      concept: "Understanding Stock Ownership & Market Mechanics",
      explanation: "When you buy a stock, you're purchasing partial ownership in a company. This ownership entitles you to a share of the company's profits (dividends) and gives you voting rights on major company decisions. The stock market is where these ownership shares are bought and sold, with prices determined by supply and demand based on investor expectations of the company's future performance.",
      realWorldExample: "Apple (AAPL) has about 15.7 billion shares outstanding. If you own 100 shares, you own approximately 0.0000006% of Apple. When Apple pays a quarterly dividend of $0.24 per share, you receive $24. If Apple's earnings grow 15% and the stock price rises from $180 to $207, your 100 shares gain $2,700 in value. This demonstrates how stock ownership provides both income (dividends) and capital appreciation potential.",
      practicalAction: "Start by opening a brokerage account with low fees (like Fidelity, Schwab, or Vanguard). Begin with broad market ETFs like VTI (Total Stock Market) or VOO (S&P 500) to get instant diversification across hundreds of companies. Set up automatic monthly investments of $100-500 to start building your position regardless of market timing.",
      warning: "Never invest money you need within 5 years, as stocks can lose 20-50% of their value in bear markets. The 2008 financial crisis saw the S&P 500 drop 57% from peak to trough. However, investors who held on recovered completely within 4 years and went on to new highs."
    }
  },
  {
    title: "Fundamental Analysis & Company Valuation",
    icon: BarChart3,
    content: {
      concept: "Evaluating Company Value Through Financial Metrics",
      explanation: "Fundamental analysis involves examining a company's financial health, competitive position, and growth prospects to determine if its stock is fairly valued. Key metrics include P/E ratio (price-to-earnings), revenue growth, profit margins, debt levels, and return on equity. This analysis helps investors identify undervalued companies with strong fundamentals that may outperform the market over time.",
      realWorldExample: "Microsoft (MSFT) trades at a P/E ratio of 28, meaning investors pay $28 for every $1 of annual earnings. With 25% annual earnings growth, its PEG ratio (P/E divided by growth rate) is 1.1, suggesting fair value. Compare this to Tesla (TSLA) at P/E of 60 with 20% growth (PEG of 3.0), indicating Tesla is more expensive relative to its growth rate. Microsoft's consistent 20%+ profit margins and $60 billion cash reserves also suggest financial stability.",
      practicalAction: "Use free tools like Yahoo Finance, Morningstar, or SEC EDGAR database to research companies. Focus on businesses you understand first - if you use Apple products daily, start by analyzing Apple's financials. Look for companies with consistent earnings growth (10%+ annually), reasonable debt levels (debt-to-equity under 50%), and competitive advantages (strong brand, network effects, or high switching costs).",
      warning: "Avoid 'analysis paralysis' - even professional analysts are wrong 40-50% of the time. Don't wait for the 'perfect' stock. A good company at a fair price often beats a great company at an expensive price. Also, past performance doesn't guarantee future results - Kodak was once a blue-chip stock."
    }
  },
  {
    title: "Growth vs Value Investing Strategies",
    icon: Target,
    content: {
      concept: "Contrasting Investment Philosophies for Different Market Conditions",
      explanation: "Value investing seeks undervalued companies trading below their intrinsic worth, often established businesses with low P/E ratios and strong dividends. Growth investing targets companies with rapid earnings expansion, typically paying higher multiples for future potential. Both strategies can be successful, and many investors blend them based on market conditions and personal goals.",
      realWorldExample: "Value example: Berkshire Hathaway buys companies like Coca-Cola (bought in 1988, now worth 20x) that generate consistent cash flows at reasonable prices. Growth example: Amazon's stock gained 1,800% from 2009-2019 despite never paying dividends, as investors bet on its expanding e-commerce and cloud computing dominance. During the 2000 tech crash, value stocks outperformed, but growth stocks dominated the 2010s bull market.",
      practicalAction: "Build a balanced approach: Allocate 70% to broad market index funds (automatically includes both growth and value), 20% to specific value opportunities (dividend-paying stocks in established industries), and 10% to growth picks (innovative companies with 20%+ revenue growth). Rebalance annually and adjust allocation based on market valuations and your age.",
      warning: "Avoid style rotation timing - trying to switch between growth and value based on recent performance often leads to buying high and selling low. Growth stocks can experience violent corrections (Nasdaq fell 78% in 2000-2002), while value stocks can underperform for decades. Diversification across styles reduces this risk."
    }
  },
  {
    title: "Portfolio Diversification & Risk Management",
    icon: Shield,
    content: {
      concept: "Spreading Risk Across Assets to Optimize Returns",
      explanation: "Diversification reduces portfolio risk by spreading investments across different companies, sectors, geographies, and asset classes. Modern Portfolio Theory shows that combining non-correlated assets can maintain similar returns while reducing volatility. Proper diversification includes domestic and international stocks, different market capitalizations (large, mid, small-cap), and various sectors (technology, healthcare, financials, etc.).",
      realWorldExample: "A portfolio holding only tech stocks lost 60%+ during the 2000 dot-com crash, but a diversified portfolio including utilities, consumer staples, and international stocks lost only 25%. Similarly, during 2008, a 60% stock/40% bond portfolio lost 20%, while a 100% stock portfolio lost 37%. However, over 20 years, the stock-heavy portfolio significantly outperformed due to higher long-term returns.",
      practicalAction: "Use the 'core-satellite' approach: 80% in low-cost broad market index funds (VTI for US total market, VTIAX for international), 20% in satellite holdings (individual stocks, sector ETFs, or REITs). Maintain at least 10-15 different holdings to avoid concentration risk. Set position limits - no single stock should exceed 5-10% of your portfolio.",
      warning: "Over-diversification can reduce returns - owning 100+ individual stocks doesn't improve diversification much beyond 20-30 holdings. Also, during market crashes, correlations often approach 1.0 (everything falls together), limiting diversification benefits. Don't confuse diversification with safety - all stocks carry market risk."
    }
  },
  {
    title: "Market Psychology & Behavioral Finance",
    icon: Building2,
    content: {
      concept: "Understanding Emotional Decision-Making in Markets",
      explanation: "Market prices are driven by human emotions - fear and greed - often causing significant deviations from fundamental values. Behavioral biases include loss aversion (feeling losses twice as strongly as gains), recency bias (overweighting recent events), and herd mentality (following the crowd). Understanding these patterns helps investors avoid costly emotional mistakes and potentially profit from others' irrational behavior.",
      realWorldExample: "During March 2020 COVID panic, the S&P 500 fell 34% in 5 weeks as investors sold everything. Companies like Amazon and Netflix, which actually benefited from lockdowns, fell 25%+ before recovering to new highs within months. Conversely, during the 1999 dot-com bubble, investors paid 100x revenue for companies with no profits, convinced 'this time is different.' Both extremes created opportunities for disciplined investors.",
      practicalAction: "Develop systematic investing rules to override emotions: Set up automatic investments regardless of market conditions, use dollar-cost averaging to reduce timing risk, and create a written investment plan with target allocations. When markets crash 20%+, increase your contributions if possible - buying during fear often produces the best long-term returns. Keep 3-6 months of expenses in cash so you never need to sell investments during downturns.",
      warning: "Don't try to completely eliminate emotions - some fear and greed are normal and healthy. The goal is to not let emotions drive major investment decisions. Also, being contrarian doesn't mean being reckless - sometimes the crowd is right. Focus on long-term fundamentals rather than short-term market movements."
    }
  },
  {
    title: "Building Long-Term Wealth Through Stocks",
    icon: Coins,
    content: {
      concept: "Systematic Wealth Accumulation Through Equity Ownership",
      explanation: "Stock market investing is one of the most powerful wealth-building tools available, with the S&P 500 averaging 10%+ annual returns over the long term. The key is starting early, investing consistently, and letting compound growth work over decades. A 25-year-old investing $500/month in stocks could accumulate over $1.3 million by age 65, with most growth coming from compounding rather than contributions.",
      realWorldExample: "Warren Buffett's wealth demonstrates long-term stock investing power: 99% of his $100+ billion fortune was earned after age 50, showing the exponential nature of compound growth. A more realistic example: Investing $300/month from age 25-65 at 10% annual returns equals $1.06 million. Starting at age 35 with the same monthly amount yields only $361,000 - showing the massive cost of waiting 10 years to start.",
      practicalAction: "Implement the 'pay yourself first' principle: automatically invest 15-20% of gross income in stock-based retirement accounts (401k, IRA). Increase contributions by 1% annually or whenever you get a raise. Use target-date funds if you prefer hands-off investing, or build a three-fund portfolio (total stock market, international stocks, bonds) for more control. Track net worth quarterly, not daily account balances.",
      warning: "Wealth building through stocks requires patience - there will be multiple 20%+ declines over your investing lifetime. The average bear market lasts 14 months and declines 32%. However, trying to avoid these declines by timing the market typically reduces long-term returns. Stay invested through volatility to capture the full power of compound growth."
    }
  }
];

export default function StockMarketMasteryLessonEnhanced({ onComplete }: StockMarketMasteryLessonProps) {
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

    if (currentLesson < enhancedLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      // All lessons completed
      const timeSpent = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 60000) : 0;
      completeLesson('stock-market-mastery-enhanced-lesson', timeSpent);
      
      if (onComplete) {
        onComplete();
      }
      
      toast.success('Stock Market Mastery lesson completed! 📈', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const allLessonsCompleted = completedLessons.every(completed => completed);
  const completionPercentage = Math.round((completedLessons.filter(completed => completed).length / enhancedLessons.length) * 100);

  const lesson = enhancedLessons[currentLesson];
  const LessonIcon = lesson.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-3xl font-bold ${theme.textColors.primary}`}>
            📈 Stock Market Mastery Lessons
          </h2>
          <div className="flex items-center space-x-4">
            <ProgressRing 
              progress={completionPercentage} 
              size={60} 
              strokeWidth={6}
              className="text-blue-400"
            />
            <div className="text-right">
              <div className={`text-sm ${theme.textColors.muted}`}>Progress</div>
              <div className={`font-bold ${theme.textColors.primary}`}>{completionPercentage}%</div>
            </div>
          </div>
        </div>
        
        {/* Lesson Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className={`text-sm ${theme.textColors.secondary}`}>
            Lesson {currentLesson + 1} of {enhancedLessons.length}
          </div>
          <div className="flex space-x-2">
            {enhancedLessons.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentLesson(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentLesson
                    ? 'bg-blue-400 scale-125'
                    : completedLessons[index]
                    ? 'bg-green-400'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Lesson Content */}
      <GradientCard variant="glass" gradient="blue" className="mb-8">
        <div className="p-8">
          {/* Lesson Header */}
          <div className="flex items-center mb-6">
            <div className={`w-16 h-16 ${theme.backgrounds.card} rounded-2xl flex items-center justify-center mr-4`}>
              <LessonIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${theme.textColors.primary}`}>{lesson.title}</h3>
              <p className={`${theme.textColors.secondary}`}>Master {lesson.title.toLowerCase()} for stock market success</p>
            </div>
          </div>

          {/* Concept Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <h4 className={`text-xl font-semibold ${theme.textColors.primary}`}>Core Concept</h4>
            </div>
            <div className={`${theme.backgrounds.card} rounded-xl p-6 border-l-4 border-blue-400`}>
              <h5 className={`font-semibold ${theme.textColors.primary} mb-3`}>{lesson.content.concept}</h5>
              <p className={`${theme.textColors.secondary} leading-relaxed`}>
                {lesson.content.explanation}
              </p>
            </div>
          </div>

          {/* Real-World Example */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-green-400 mr-2" />
              <h4 className={`text-xl font-semibold ${theme.textColors.primary}`}>Real Money Example</h4>
            </div>
            <div className={`bg-green-500/10 border border-green-500/20 rounded-xl p-6`}>
              <p className={`${theme.textColors.secondary} leading-relaxed`}>
                {lesson.content.realWorldExample}
              </p>
            </div>
          </div>

          {/* Practical Action */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
              <h4 className={`text-xl font-semibold ${theme.textColors.primary}`}>Take Action Today</h4>
            </div>
            <div className={`bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6`}>
              <p className={`${theme.textColors.secondary} leading-relaxed`}>
                {lesson.content.practicalAction}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <h4 className={`text-xl font-semibold ${theme.textColors.primary}`}>Important Warning</h4>
            </div>
            <div className={`bg-red-500/10 border border-red-500/20 rounded-xl p-6`}>
              <p className={`${theme.textColors.secondary} leading-relaxed`}>
                {lesson.content.warning}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
              disabled={currentLesson === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                currentLesson === 0
                  ? `${theme.textColors.muted} cursor-not-allowed opacity-50`
                  : `${theme.buttons.secondary} hover:opacity-90`
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentLesson < enhancedLessons.length - 1 ? (
              <button
                onClick={handleLessonComplete}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${theme.buttons.primary} hover:opacity-90`}
              >
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleLessonComplete}
                disabled={allLessonsCompleted}
                className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${
                  allLessonsCompleted
                    ? `${theme.status.success.bg} ${theme.status.success.text} cursor-default`
                    : `${theme.buttons.primary} hover:opacity-90`
                }`}
              >
                {allLessonsCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Completed!
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5 mr-2" />
                    Complete Lesson
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </GradientCard>

      {/* Lesson Summary */}
      {allLessonsCompleted && (
        <GradientCard variant="glass" gradient="green" className="p-6">
          <div className="text-center">
            <Award className={`w-16 h-16 ${theme.status.success.text} mx-auto mb-4`} />
            <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>
              Stock Market Mastery Complete! 🏆
            </h3>
            <p className={`${theme.textColors.secondary} mb-6 max-w-2xl mx-auto`}>
              You&apos;ve mastered the fundamentals of stock market investing! You now understand stock ownership, 
              valuation methods, investment strategies, and the psychological aspects of successful investing. 
              Ready to test your knowledge with the quiz?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
              {enhancedLessons.map((lessonItem, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${theme.status.success.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <lessonItem.icon className={`w-6 h-6 ${theme.status.success.text}`} />
                  </div>
                  <p className={`text-xs ${theme.textColors.muted}`}>
                    {lessonItem.title.split(' ')[0]} {lessonItem.title.split(' ')[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GradientCard>
      )}
    </div>
  );
}

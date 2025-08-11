'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Building2,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  Award,
  AlertTriangle,
  Briefcase,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BusinessFinanceLessonProps {
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
    title: "Business Finance Fundamentals",
    icon: Building2,
    content: {
      concept: "Understanding Business Financial Structure and Cash Flow",
      explanation: "Business finance involves managing money flows in and out of a company to maximize profitability and growth. Key concepts include revenue (money coming in), expenses (money going out), profit margins, cash flow timing, and capital requirements. Unlike personal finance, business finance deals with complex tax structures, multiple stakeholders, and the need to reinvest profits for growth while maintaining adequate cash reserves.",
      realWorldExample: "Amazon famously operated at razor-thin margins or losses for years while growing revenue from $15 million (1996) to $232 billion (2018). They reinvested every dollar into expansion, warehouse infrastructure, and technology. Meanwhile, Apple maintains 25%+ profit margins by focusing on premium products. Both strategies can work - Amazon prioritized market share and long-term dominance, while Apple maximized profitability per product sold.",
      practicalAction: "Start tracking three key metrics for any business: 1) Revenue growth rate (month-over-month), 2) Gross profit margin (revenue minus direct costs), and 3) Cash flow (actual money in bank account). Use free tools like Wave Accounting or QuickBooks Simple Start. Set up separate business checking and savings accounts to clearly separate business and personal finances.",
      warning: "Many businesses fail due to cash flow problems, not lack of profitability. You can be profitable on paper but still run out of cash if customers pay slowly while you have immediate expenses. Always maintain 3-6 months of operating expenses in cash reserves, and understand the difference between profit and cash flow."
    }
  },
  {
    title: "Startup Funding & Capital Structure",
    icon: TrendingUp,
    content: {
      concept: "Raising Capital and Understanding Equity vs Debt Financing",
      explanation: "Startups can raise money through various methods: bootstrapping (self-funding), friends and family, angel investors, venture capital, crowdfunding, or traditional bank loans. Each has different costs, control implications, and expectations. Equity financing gives away ownership for cash, while debt financing requires repayment with interest but maintains full ownership. The choice depends on your business model, growth stage, and risk tolerance.",
      realWorldExample: "Facebook raised $500,000 from Peter Thiel (angel investor) for 10.2% equity in 2004, valuing the company at $4.9 million. By IPO in 2012, that stake was worth $1 billion+. Alternatively, Spanx founder Sara Blakely bootstrapped her company with $5,000 savings, maintaining 100% ownership until selling a majority stake to Blackstone for $1.2 billion in 2021. Both paths led to success but with very different risk/reward profiles.",
      practicalAction: "Before seeking funding, validate your business model with real customers and revenue. Create a detailed business plan with 3-year financial projections. Start with the least dilutive funding sources: personal savings, revenue from early customers, then friends/family. Only seek professional investors when you need significant capital for proven growth opportunities and can demonstrate traction.",
      warning: "Venture capital is not lottery tickets - VCs expect 10x returns and will replace founders who don't deliver rapid growth. Giving away too much equity early can leave founders with little ownership. Conversely, debt financing requires regular payments regardless of business performance, which can create cash flow pressure during slow periods."
    }
  },
  {
    title: "Business Valuation Methods",
    icon: BarChart3,
    content: {
      concept: "Determining What a Business is Worth Using Multiple Approaches",
      explanation: "Business valuation uses several methods depending on the business type and purpose. Revenue multiples (common for SaaS: 5-15x annual revenue), earnings multiples (P/E ratios: 10-25x), discounted cash flow (projecting future cash flows), and asset-based valuation (book value of tangible assets). Each method has strengths and weaknesses, so professional valuations typically use multiple approaches and average the results.",
      realWorldExample: "When Microsoft bought LinkedIn for $26.2 billion in 2016, they paid about 9x LinkedIn's annual revenue of $3 billion. This seemed expensive, but LinkedIn was growing 20%+ annually with high profit margins and strong network effects. In contrast, a traditional restaurant might sell for 2-3x annual revenue due to lower margins and growth prospects. Tesla trades at 50x earnings while Toyota trades at 10x earnings, reflecting different growth expectations.",
      practicalAction: "For your own business, track key valuation metrics monthly: revenue run rate, profit margins, customer acquisition cost vs lifetime value, and growth rates. Research comparable company sales in your industry through BizBuySell, industry reports, or business brokers. Build financial models showing realistic growth scenarios to understand how operational improvements impact valuation.",
      warning: "Valuation is often more art than science, especially for early-stage companies with limited financial history. Avoid overvaluing your business based on optimistic projections or cherry-picked comparables. Market conditions heavily influence valuations - tech companies were worth 50%+ less in 2022 than 2021 despite similar fundamentals."
    }
  },
  {
    title: "Cash Flow Management & Working Capital",
    icon: DollarSign,
    content: {
      concept: "Managing the Timing of Money In and Out of Your Business",
      explanation: "Cash flow management involves optimizing the timing of receivables (money owed to you), payables (money you owe), and inventory (money tied up in products). Working capital is current assets minus current liabilities - essentially how much cash you have available for operations. Poor cash flow management is the #1 reason profitable businesses fail, as they run out of cash despite having customers and orders.",
      realWorldExample: "A consulting firm invoices clients $50,000 monthly but clients pay 60 days later, while the firm pays employee salaries every two weeks. This creates a cash flow gap - they're profitable but need $25,000+ in working capital to bridge timing differences. Seasonal businesses face similar challenges: ski resorts earn 80% of revenue in 4 months but have expenses year-round, requiring careful cash flow planning.",
      practicalAction: "Create a 13-week rolling cash flow forecast updating weekly. Negotiate favorable payment terms: offer 2% discounts for early payment, require deposits for large orders, and set up automatic recurring billing where possible. Extend your payment terms with suppliers while shortening customer payment cycles. Build a line of credit before you need it for cash flow smoothing.",
      warning: "Growth can kill cash flow - each new customer requires upfront investment in inventory, labor, or marketing before you collect payment. Rapid growth often requires external financing to fund working capital needs. Never use long-term debt for short-term cash flow problems, and avoid factoring receivables except in emergencies due to high costs (15-30% annually)."
    }
  },
  {
    title: "Business Tax Strategy & Structure",
    icon: Target,
    content: {
      concept: "Optimizing Business Structure and Tax Efficiency",
      explanation: "Business structure affects taxes, liability, and operational flexibility. Sole proprietorships are simple but offer no liability protection. LLCs provide liability protection with flexible tax treatment. S-Corps avoid double taxation but have ownership restrictions. C-Corps face double taxation but can retain earnings at lower corporate rates and offer stock options. Each structure has specific tax advantages and compliance requirements.",
      realWorldExample: "A freelance consultant earning $100,000 as a sole proprietor pays 15.3% self-employment tax ($15,300) plus income taxes. Converting to S-Corp election and paying themselves $60,000 salary plus $40,000 distribution saves approximately $6,000 annually in self-employment taxes. However, they must now run payroll and file additional tax returns, adding complexity and costs.",
      practicalAction: "Consult with a tax professional to choose the optimal structure based on your income level, growth plans, and liability concerns. Track all business expenses meticulously: office supplies, travel, meals, equipment, professional development, and home office deductions. Set aside 25-30% of profits for taxes quarterly, and consider retirement plan contributions to reduce taxable income.",
      warning: "Don't let tax optimization drive poor business decisions - save $1,000 in taxes by spending $3,000 is not smart. Business structure changes can be complex and costly, so choose carefully upfront. The IRS scrutinizes S-Corp salary levels - paying yourself too little salary to avoid payroll taxes can trigger audits and penalties."
    }
  },
  {
    title: "Growing & Scaling Your Business",
    icon: Users,
    content: {
      concept: "Strategic Growth Planning and Financial Management at Scale",
      explanation: "Scaling a business requires different financial strategies than starting one. Focus shifts from survival to optimization: improving profit margins, building systems for efficiency, diversifying revenue streams, and preparing for larger capital needs. Key metrics include unit economics (profit per customer), scalability ratios (how revenue grows relative to expenses), and capital efficiency (how much investment is required for each dollar of additional revenue).",
      realWorldExample: "Netflix evolved from DVD-by-mail (low margin, logistics-heavy) to streaming (high margin, software-based) to content production (high investment, high potential returns). Each phase required different financial strategies: debt financing for DVD inventory, technology investment for streaming infrastructure, and massive content spending ($15+ billion annually) funded by subscriber growth and debt markets.",
      practicalAction: "Develop key performance indicators (KPIs) specific to your business model: customer lifetime value, churn rate, gross margin per product/service, and customer acquisition cost. Build financial models for different growth scenarios. Invest in systems and automation before you're forced to - accounting software, CRM systems, and operational processes that can handle 10x your current volume.",
      warning: "Many businesses hit a 'growth wall' where adding customers actually reduces profitability due to inefficient operations. Don't confuse revenue growth with business success - focus on profitable, sustainable growth. Rapid scaling often requires external capital, which dilutes ownership and increases pressure for returns. Plan growth carefully rather than pursuing growth at any cost."
    }
  }
];

export default function BusinessFinanceLessonEnhanced({ onComplete }: BusinessFinanceLessonProps) {
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
    const lessonId = `business-finance-enhanced-${currentLesson}`;
    
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
    completeLesson('business-finance-chapter-complete', totalTimeSpent);
    toast.success('Chapter 16 completed! Ready for the quiz! 🚀');
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
            Business Finance Mastery Complete! 🎉
          </h2>
          
          <p className={`text-lg ${theme.textColors.secondary} mb-8 max-w-2xl mx-auto`}>
            You've mastered essential business finance concepts including startup funding, valuation methods, 
            cash flow management, tax optimization, and scaling strategies. You now understand how to build, 
            fund, and grow a financially successful business.
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
          Chapter 16: Business & Entrepreneurship Finance
        </h1>
        <p className={`text-xl ${theme.textColors.secondary} mb-6`}>
          Building and Growing Financially Successful Businesses
        </p>
        
        <div className="flex items-center justify-center gap-8 mb-6">
          <ProgressRing 
            progress={progressPercentage}
            size={80}
            strokeWidth={8}
            className="text-blue-400"
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
            <currentLessonData.icon className="w-6 h-6 text-blue-400" />
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

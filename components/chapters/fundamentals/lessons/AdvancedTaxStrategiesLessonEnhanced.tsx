'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Calculator,
  Shield,
  Target,
  TrendingUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  DollarSign,
  Zap,
  Award,
  AlertTriangle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdvancedTaxStrategiesLessonProps {
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
    title: 'Tax-Loss Harvesting: Turning Losses into Tax Savings',
    icon: Target,
    content: 'Tax-loss harvesting involves selling investments at a loss to offset gains elsewhere in your portfolio. You can deduct up to $3,000 in net capital losses against ordinary income annually, with unlimited carryforward for excess losses. This strategy can add 0.5-1% annually to after-tax returns by systematically capturing tax benefits from market volatility.',
    practicalAction: 'Set up automatic tax-loss harvesting through platforms like Betterment or Wealthfront, or manually review taxable accounts quarterly. Sell losing positions before year-end, immediately reinvest in similar (but not substantially identical) assets to avoid wash sale rules. Track your tax-loss carryforward for future years.',
    realMoneyExample: 'Investor with $100,000 in taxable accounts harvests $5,000 in losses annually. In 24% tax bracket: saves $1,200/year in taxes ($5,000 × 24%). Over 20 years with reinvestment, this tax alpha compounds to $65,000+ in additional wealth.',
    warningTip: 'Beware the wash sale rule: you cannot buy the same or substantially identical security within 30 days before or after the sale. Use similar ETFs or wait 31 days to repurchase the same holding.'
  },
  {
    title: 'Asset Location: The Tax-Efficient Portfolio Strategy',
    icon: Shield,
    content: 'Asset location strategically places investments in accounts based on tax efficiency. Tax-inefficient assets (bonds, REITs, actively managed funds) belong in tax-advantaged accounts. Tax-efficient assets (index funds, individual stocks held long-term) work in taxable accounts. Municipal bonds make sense for high earners in high-tax states.',
    practicalAction: 'Audit your current holdings: Move bonds and REITs to 401(k)/traditional IRA, place growth stocks in Roth IRA, keep broad index funds in taxable accounts. For high earners in CA/NY/NJ, consider municipal bond funds yielding 3-4% tax-free (equivalent to 5-6% taxable).',
    realMoneyExample: '$500,000 portfolio: REITs yielding 4% in taxable account = $4,800 annual taxes (24% bracket). Same REITs in tax-advantaged account = $0 current taxes. Over 25 years, optimal asset location saves $200,000+ in taxes through compound growth.',
    warningTip: 'Don&apos;t let tax optimization override proper asset allocation. Maintain your target stock/bond ratio first, then optimize placement for tax efficiency. Perfect location matters less than consistent investing.'
  },
  {
    title: 'Strategic Roth Conversions & Tax Rate Arbitrage',
    icon: Zap,
    content: 'Roth conversions involve paying taxes now on traditional retirement accounts to secure tax-free growth forever. This is most powerful during low-income years, market crashes (converting at depressed values), or when expecting higher future tax rates. The key is converting only up to the top of your current tax bracket to minimize tax rates paid.',
    practicalAction: 'Identify conversion opportunities: job loss, sabbatical, early retirement, or market downturns. Convert traditional IRA/401(k) funds up to the top of your current tax bracket. Use non-retirement funds to pay conversion taxes—never take money from retirement accounts to pay the tax.',
    realMoneyExample: 'Early retiree with $200,000 in traditional 401(k): Converts $40,000 annually for 5 years during 12% tax bracket years instead of future 22%+ bracket. Saves $4,000+ per $40,000 converted. Total lifetime tax savings: $100,000+ on same money.',
    warningTip: 'Roth conversions are permanent and create taxable income in conversion year. Ensure you have adequate cash flow and won&apos;t be pushed into a higher tax bracket. Consider spreading large conversions over multiple years.'
  },
  {
    title: 'Business Tax Strategies & Entity Optimization',
    icon: Calculator,
    content: 'Business ownership provides powerful tax advantages: deductible business expenses, retirement plan contributions, entity selection benefits. S-Corps can save self-employment taxes for high-earning businesses. Solo 401(k)s allow $70,000+ annual retirement contributions for business owners. Proper entity structure and bookkeeping are essential.',
    practicalAction: 'If you have 1099 income or side business: Form LLC for liability protection, track all business expenses, consider S-Corp election if earning $60,000+ annually. Open a Solo 401(k) to maximize retirement contributions. Work with a CPA to optimize entity structure and tax strategy.',
    realMoneyExample: 'Consultant earning $120,000: LLC saves $0, but S-Corp election saves ~$1,800 in self-employment taxes annually. Solo 401(k) allows $69,000 retirement contribution vs $23,000 employee limit. Total annual tax benefits: $15,000+ between entity optimization and retirement contributions.',
    warningTip: 'S-Corp requires reasonable salary for owner-employees and additional tax filings/costs. Only beneficial above ~$60,000 annual profit. Maintain strict separation between business and personal expenses to preserve legal protection and tax benefits.'
  },
  {
    title: 'Estate Tax Planning & Wealth Transfer Strategies',
    icon: FileText,
    content: 'Estate tax affects individuals with $13.6M+ net worth (2024), but planning benefits everyone. Gift tax annual exclusion allows $18,000 per recipient (2024). Roth IRAs are powerful estate planning tools—no required distributions, tax-free inheritance. Life insurance in irrevocable trusts removes death benefits from taxable estate.',
    practicalAction: 'Start annual gifting to children/grandchildren using $18,000 exclusion per person. Fund 529 plans with 5 years of gifts frontloaded ($90,000). Consider Roth conversions to reduce future estate size while paying taxes at current rates. Review beneficiaries on all accounts annually.',
    realMoneyExample: 'Couple with 2 children: Annual gifts of $72,000 ($18k × 2 parents × 2 children) removes $1.44M from estate over 20 years plus growth. If invested at 7% returns, total estate reduction exceeds $3M, potentially saving $1.2M+ in estate taxes for wealthy families.',
    warningTip: 'Estate tax exemption ($13.6M) is scheduled to sunset in 2026, potentially dropping to ~$7M. Gifting and planning strategies should consider potential law changes. Don&apos;t let estate planning override retirement security—take care of yourself first.'
  },
  {
    title: 'State Tax Optimization & Geographic Arbitrage',
    icon: TrendingUp,
    content: 'State tax differences create huge arbitrage opportunities. Seven states have no income tax: FL, NV, TN, TX, WA, WY, AK. High-tax states like CA (13.3%) and NY (10.9%) can cost high earners $50,000+ annually. Retirement location planning can save hundreds of thousands over 30+ year retirements.',
    practicalAction: 'Research state tax implications for your situation: income tax rates, property taxes, sales taxes, estate taxes. For remote workers, consider establishing residency in no-tax states. Plan retirement location considering total tax burden, not just income taxes. Track days spent in each state if maintaining multiple residences.',
    realMoneyExample: 'High earner making $300,000 moving from CA to TX: Saves ~$40,000 annually in state income taxes. Over 20-year career, total savings exceed $1.2M including investment growth. Even accounting for higher property taxes in TX, net savings approach $1M lifetime.',
    warningTip: 'State residency rules are complex and strictly enforced. Simply buying property doesn&apos;t establish residency—you need to prove intent through voter registration, driver&apos;s license, bank accounts, and time spent. High-tax states aggressively audit residency changes.'
  }
];

export default function AdvancedTaxStrategiesLessonEnhanced({ onComplete }: AdvancedTaxStrategiesLessonProps) {
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

    toast.success(`Lesson ${currentLesson + 1} completed! 💰`, {
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
      completeLesson('advanced-tax-strategies-enhanced-lesson', totalTime);
    }
    
    onComplete?.();
    toast.success('Advanced Tax Strategies mastery achieved! Time to optimize your wealth! 🏆', {
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
          Advanced Tax Strategies & Optimization
        </h1>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Master sophisticated tax strategies to legally minimize your tax burden and maximize wealth accumulation through strategic planning.
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
          <Calculator className={`w-8 h-8 ${theme.textColors.primary} mx-auto`} />
          <p className={`text-sm ${theme.textColors.secondary}`}>Tax Optimizer</p>
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
            Advanced Tax Strategies Mastery Achieved!
          </h3>
          <p className={`${theme.textColors.secondary} mb-4`}>
            You&apos;ve completed all lessons on sophisticated tax optimization strategies. Ready to test your knowledge?
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

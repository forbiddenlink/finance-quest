'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  PiggyBank,
  TrendingUp,
  Target,
  Shield,
  CheckCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  DollarSign,
  Zap,
  Award,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RetirementPlanningLessonProps {
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
    title: 'The Power of Tax-Advantaged Retirement Accounts',
    icon: Shield,
    content: 'Tax-advantaged retirement accounts are your wealth-building superpower. Traditional 401(k)s and IRAs provide immediate tax deductions (reducing current taxes) while growing tax-deferred. Roth accounts use after-tax dollars but provide tax-free growth and withdrawals in retirement. The earlier you start, the more dramatic the tax savings become through decades of compound growth.',
    practicalAction: 'Contribute enough to your 401(k) to get the full company match (instant 50-100% return), then max out a Roth IRA ($7,000 for 2024), then return to max your 401(k) ($23,000 for 2024). Use target-date funds if you want automatic management.',
    realMoneyExample: '$500/month starting at age 25: Traditional 401(k) saves $1,500/year in taxes (25% bracket). By age 65, the account grows to $1.3M. Total tax savings over 40 years: $60,000 in current dollars, plus tax-deferred growth on those savings.',
    warningTip: 'Don&apos;t skip the 401(k) match just because fees are high. A 50% match beats high fees every time. You can optimize later with IRA rollovers when changing jobs.'
  },
  {
    title: 'The 4% Rule & Safe Withdrawal Rate Science',
    icon: Calculator,
    content: 'The 4% rule states you can safely withdraw 4% of your retirement portfolio annually without running out of money over 30 years. This rule is based on historical market data and assumes a balanced portfolio. It means you need 25 times your annual expenses saved (100/4 = 25). Modern research suggests 3.5% is safer, requiring 28.5 times annual expenses.',
    practicalAction: 'Calculate your retirement number: Annual expenses × 25 (4% rule) or × 28.5 (3.5% rule). If you need $50,000/year, target $1.25M-$1.43M. Track progress monthly and adjust contributions to reach this target by your desired retirement age.',
    realMoneyExample: 'Couple spending $60,000/year in retirement: 4% rule requires $1.5M saved. At 3.5% rule: $1.71M needed. Starting at age 30 with $10,000 saved, they need to invest $1,100/month to hit $1.5M by age 65 (assuming 7% returns).',
    warningTip: 'The 4% rule assumes you never reduce spending. In reality, you can adjust withdrawals based on market performance and reduce expenses during market downturns to make your money last longer.'
  },
  {
    title: 'Calculating Your Personal Retirement Number',
    icon: Target,
    content: 'Your retirement number isn&apos;t just 25x expenses—it depends on Social Security benefits, pensions, healthcare costs, and lifestyle goals. Social Security replaces about 40% of pre-retirement income. Healthcare costs average $300,000+ per couple in retirement. Use detailed calculators to account for inflation, varying return sequences, and longevity risk.',
    practicalAction: 'Create a retirement spreadsheet: List current expenses, estimate retirement changes (no commuting, potential higher healthcare), subtract expected Social Security, multiply remaining gap by 25-28.5. Update annually as circumstances change.',
    realMoneyExample: 'Engineer earning $100,000 wants to maintain lifestyle: Current expenses $70,000, retirement expenses $60,000 (no commuting/work clothes), Social Security $24,000, gap $36,000. Retirement target: $36,000 × 25 = $900,000 needed beyond Social Security.',
    warningTip: 'Don&apos;t count on Social Security being exactly the same when you retire. Plan for potential 20-25% benefit reduction and consider it a bonus if benefits remain unchanged.'
  },
  {
    title: 'Advanced Strategies: Roth Conversions & Tax Planning',
    icon: Zap,
    content: 'Roth conversions allow you to move money from traditional retirement accounts to Roth accounts, paying taxes now for tax-free growth later. This is powerful during low-income years (between jobs, early retirement) or when you expect higher tax rates in retirement. Mega backdoor Roth allows high earners to contribute $70,000+ annually to Roth accounts.',
    practicalAction: 'If your income drops temporarily, convert traditional IRA/401(k) funds to Roth up to the top of your current tax bracket. If your employer offers after-tax 401(k) contributions, maximize these and immediately convert to Roth (mega backdoor Roth).',
    realMoneyExample: 'High earner taking sabbatical: Normal income $150,000 (24% bracket), sabbatical year income $40,000 (12% bracket). Converts $50,000 from traditional 401(k) to Roth, paying 12% tax instead of future 24%+ tax, saving $6,000+ in lifetime taxes.',
    warningTip: 'Roth conversions are permanent and generate taxable income in the conversion year. Make sure you have cash outside retirement accounts to pay the conversion taxes—never withdraw from retirement accounts to pay conversion taxes.'
  },
  {
    title: 'Asset Location: Optimizing Tax-Advantaged vs Taxable Accounts',
    icon: PiggyBank,
    content: 'Asset location (which investments go in which account types) can add 0.5-1% annually to after-tax returns. Tax-inefficient investments (bonds, REITs, actively managed funds) belong in tax-advantaged accounts. Tax-efficient investments (index funds, individual stocks held long-term) work well in taxable accounts. This optimization becomes more valuable as account balances grow.',
    practicalAction: 'Priority order: Bonds and REITs in 401(k)/traditional IRA, highest-growth assets in Roth IRA, broad index funds in taxable accounts. Rebalance by adjusting new contributions rather than selling, especially in taxable accounts.',
    realMoneyExample: '$500,000 portfolio with REITs: REITs in taxable account (4% yield, 24% tax rate) = $4,800 annual taxes. Same REITs in 401(k) = $0 current taxes. Over 20 years, tax-efficient placement saves $96,000+ in taxes, allowing more money to compound.',
    warningTip: 'Perfect asset location is less important than consistent saving and broad diversification. Don&apos;t let the complexity of optimization prevent you from investing in the first place.'
  },
  {
    title: 'Retirement Withdrawal Strategies & Sequence Risk',
    icon: TrendingUp,
    content: 'Sequence of returns risk—poor market performance early in retirement—can devastate retirement portfolios even if long-term average returns are good. Dynamic withdrawal strategies adjust spending based on market performance and portfolio value. The bucket strategy segregates money by time horizon: cash for immediate needs, bonds for medium-term, stocks for long-term growth.',
    practicalAction: 'Plan flexible retirement spending: identify essential vs discretionary expenses. During market downturns, reduce discretionary spending and delay major purchases. Consider working part-time initially to reduce portfolio withdrawal pressure during sequence risk years.',
    realMoneyExample: 'Two retirees with $1M portfolios: Retiree A retires in 2000 (poor sequence), Retiree B in 2009 (good sequence). Both follow 4% rule rigidly. Retiree A runs out of money in 18 years, Retiree B&apos;s portfolio grows to $1.8M. Same contributions, different timing.',
    warningTip: 'The first 5-10 years of retirement are critical for portfolio longevity. If markets crash early in retirement, reduce spending immediately rather than sticking rigidly to withdrawal percentages. Flexibility extends portfolio life significantly.'
  }
];

export default function RetirementPlanningLessonEnhanced({ onComplete }: RetirementPlanningLessonProps) {
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
      completeLesson('retirement-planning-enhanced-lesson', totalTime);
    }
    
    onComplete?.();
    toast.success('Retirement Planning mastery achieved! Time to secure your future! 🏆', {
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
      <header className="text-center mb-8">
        <div 
          className={`w-16 h-16 ${theme.status.success.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
          aria-label="Retirement planning lesson icon"
        >
          <Icon className={`w-8 h-8 ${theme.status.success.text}`} aria-hidden="true" />
        </div>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Retirement Planning & Wealth Building
        </h1>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Master the strategies to build wealth and retire with financial security through tax-advantaged accounts and smart withdrawal planning.
        </p>
      </header>

      {/* Progress Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" aria-labelledby="progress-overview">
        <h2 id="progress-overview" className="sr-only">Learning Progress Overview</h2>
        
        <GradientCard variant="glass" gradient="blue" className="p-4 text-center">
          <div aria-label={`Overall progress: ${Math.round(progress)}%`}>
            <ProgressRing progress={progress} size={60} strokeWidth={4} />
          </div>
          <p className={`text-sm ${theme.textColors.primary} font-medium mt-2`}>Overall Progress</p>
        </GradientCard>
        
        <GradientCard variant="glass" gradient="green" className="p-4 text-center">
          <div className={`text-2xl font-bold ${theme.textColors.primary}`} aria-label={`${completedCount} of ${enhancedLessons.length} lessons completed`}>
            {completedCount}/{enhancedLessons.length}
          </div>
          <p className={`text-sm ${theme.textColors.secondary}`}>Lessons Complete</p>
        </GradientCard>
        
        <GradientCard variant="glass" gradient="purple" className="p-4 text-center">
          <div className={`text-2xl font-bold ${theme.textColors.primary}`} aria-label={`Currently on lesson ${currentLesson + 1}`}>
            {currentLesson + 1}
          </div>
          <p className={`text-sm ${theme.textColors.secondary}`}>Current Lesson</p>
        </GradientCard>
        
        <GradientCard variant="glass" gradient="yellow" className="p-4 text-center">
          <PiggyBank className={`w-8 h-8 ${theme.textColors.primary} mx-auto`} aria-hidden="true" />
          <p className={`text-sm ${theme.textColors.secondary}`}>Retirement Expert</p>
        </GradientCard>
      </section>

      {/* Main Lesson Content */}
      <main>
        <GradientCard variant="glass" gradient="blue" className="p-8 mb-6">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${theme.status.info.bg} rounded-xl flex items-center justify-center mr-4`} aria-hidden="true">
                <Icon className={`w-6 h-6 ${theme.status.info.text}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                  {currentLessonContent.title}
                </h2>
                <p className={`text-sm ${theme.textColors.muted}`} aria-label={`Lesson ${currentLesson + 1} of ${enhancedLessons.length}`}>
                  Lesson {currentLesson + 1} of {enhancedLessons.length}
                </p>
              </div>
            </div>
            
            {completedLessons[currentLesson] && (
              <div 
                className={`w-8 h-8 ${theme.status.success.bg} rounded-full flex items-center justify-center`}
                aria-label="Lesson completed"
                role="status"
              >
                <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} aria-hidden="true" />
              </div>
            )}
          </header>

          {/* Progress Bar */}
          <div className={`w-full bg-slate-800/50 rounded-full h-2 mb-8`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(((currentLesson + 1) / enhancedLessons.length) * 100)} aria-label={`Lesson progress: ${Math.round(((currentLesson + 1) / enhancedLessons.length) * 100)}%`}>
            <div
              className={`h-2 ${theme.status.success.bg} rounded-full transition-all duration-500`}
              style={{ width: `${((currentLesson + 1) / enhancedLessons.length) * 100}%` }}
            />
          </div>

          {/* Progress Status Announcement */}
          <div 
            role="status" 
            aria-live="polite" 
            className="sr-only"
            aria-atomic="true"
          >
            {`Currently on lesson ${currentLesson + 1} of ${enhancedLessons.length}. ${completedCount} lessons completed.`}
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
                aria-describedby={`lesson-complete-desc-${currentLesson}`}
              >
                <CheckCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                Mark Lesson Complete
              </button>
              <div id={`lesson-complete-desc-${currentLesson}`} className="sr-only">
                Mark lesson {currentLesson + 1} as completed to track your progress
              </div>
            </div>
          )}
        </GradientCard>
      </main>

      {/* Navigation */}
      <nav className="flex items-center justify-between mb-8" aria-label="Lesson navigation">
        <button
          onClick={prevLesson}
          disabled={currentLesson === 0}
          className={`flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          aria-label={currentLesson === 0 ? "No previous lesson available" : `Go to lesson ${currentLesson}`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" aria-hidden="true" />
          Previous Lesson
        </button>

        <div className="flex space-x-2" role="group" aria-label="Lesson indicators">
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
              aria-label={`Lesson ${index + 1} indicator${completedLessons[index] ? ' (completed)' : ''}${index === currentLesson ? ' (current)' : ''}`}
              aria-current={index === currentLesson ? 'step' : undefined}
            />
          ))}
        </div>

        <button
          onClick={nextLesson}
          disabled={currentLesson === enhancedLessons.length - 1}
          className={`flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          aria-label={currentLesson === enhancedLessons.length - 1 ? "No next lesson available" : `Navigate to lesson ${currentLesson + 2}`}
        >
          Next Lesson
          <ChevronRight className="w-5 h-5 ml-2" aria-hidden="true" />
        </button>
      </nav>

      {/* Completion Status */}
      {completedCount === enhancedLessons.length && (
        <GradientCard variant="glass" gradient="green" className="p-6 text-center">
          <Award className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-4`} />
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>
            Retirement Planning Mastery Achieved!
          </h3>
          <p className={`${theme.textColors.secondary} mb-4`}>
            You&apos;ve completed all lessons on building wealth and planning for retirement. Ready to test your knowledge?
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

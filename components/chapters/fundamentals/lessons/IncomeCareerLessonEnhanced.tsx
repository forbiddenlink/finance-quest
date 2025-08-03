'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface IncomeCareerLessonProps {
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
    title: "Total Compensation: Your True Financial Worth",
    content: "Your salary is just 60-80% of your real compensation value. Understanding your complete package can reveal $10,000-30,000+ in hidden benefits that many professionals completely ignore. Smart career moves require evaluating total compensation, not just base pay.",
    keyPoints: [
      "Base salary: Foundation, but benefits often equal 20-40% additional value",
      "Health insurance: Worth $8,000-15,000/year vs individual market premiums",
      "401k matching: Instant 50-100% return on investment - free money if you contribute",
      "Paid time off: 15 days = $3,500+ value for $60k salary",
      "Professional development: $2,000-5,000/year in training, conferences, certifications"
    ],
    practicalAction: "Calculate your total compensation by adding benefits value to base salary this week",
    moneyExample: "$60k salary + $12k health insurance + $3k 401k match + $3.5k PTO + $2k development = $80.5k total compensation (34% more than just salary!)",
    warningTip: "Never accept a job offer based on salary alone - always negotiate the complete package"
  },
  {
    title: "Salary Negotiation: The Million-Dollar Conversation",
    content: "A single successful salary negotiation can increase lifetime earnings by $1M+ due to compound growth. Yet 68% of people never negotiate, and women negotiate 30% less than men. This one conversation has more financial impact than years of budgeting - master it.",
    keyPoints: [
      "Research: Use Glassdoor, PayScale, LinkedIn salary insights for market data",
      "Document wins: '23% sales increase, $500k revenue generated' beats 'good at my job'",
      "Ask high: Request 10-20% above target to leave negotiation room",
      "Total package: If salary is fixed, negotiate PTO, remote work, development budget",
      "Timing: Negotiate during reviews, after major wins, or with competing offers"
    ],
    practicalAction: "Research your market salary this week and practice your negotiation pitch out loud",
    moneyExample: "Sarah negotiated from $65k to $75k (+$10k). Over 30 years with 3% raises, this becomes $400k+ in additional lifetime earnings",
    warningTip: "Never negotiate without research - going in blind can actually hurt your credibility"
  },
  {
    title: "Side Hustles: Your Income Insurance Policy",
    content: "The average millionaire has 7 income streams. Relying on one job for 100% of income is financial Russian roulette. Side hustles provide security, accelerate wealth building, and create options during economic uncertainty. Start small, think big.",
    keyPoints: [
      "Skill monetization: Freelance your existing expertise for $500-2,000+/month",
      "Digital products: Create once, sell forever - courses, templates, software",
      "Service businesses: Scale beyond hourly trading - agencies, consulting, coaching",
      "Passive income streams: Rental properties, dividend stocks, royalties grow while you sleep",
      "Start with 1 stream, systematically add more over 2-3 years"
    ],
    practicalAction: "Identify one skill you could monetize within 30 days and take the first step this week",
    moneyExample: "Tech writer Alex started a weekend freelance writing side hustle, earning $1,200/month. Year 2: $2,500/month. Year 3: Quit day job, now earns $8,000/month",
    warningTip: "Don't quit your day job too early - build side income to 50%+ of main income first"
  },
  {
    title: "Career Progression Strategy: The 10-Year Wealth Plan",
    content: "Strategic career moves compound like investments. A 5% annual salary increase becomes 63% higher pay in 10 years. But job hopping every 2-3 years often beats staying loyal - external moves average 10-20% salary bumps vs 3-5% internal raises.",
    keyPoints: [
      "Strategic job hopping: 2-3 year moves can increase salary 50-100% over 5 years",
      "Skill stacking: Combine complementary skills for unique market positioning",
      "Network building: 80% of jobs never get posted - relationships matter more than applications",
      "Industry timing: Join growing industries (tech, healthcare) vs declining ones",
      "Geographic arbitrage: Remote work from low-cost areas while earning high-market salaries"
    ],
    practicalAction: "Set a specific income target for 3 years from now and reverse-engineer the career moves needed",
    moneyExample: "Developer Maria: Year 1: $70k → Year 3: $95k (job change) → Year 5: $130k (promotion + skills) = 86% increase in 5 years",
    warningTip: "Job hopping too frequently (less than 1 year) can hurt your reputation - balance moves with building expertise"
  },
  {
    title: "Professional Development: Your Career Investment Portfolio",
    content: "Investing in skills has the highest ROI of any investment class. A $2,000 certification can increase salary by $10,000+. Unlike stocks, skills never lose value and compound over your entire career. Treat learning as your most important investment.",
    keyPoints: [
      "High-ROI certifications: Tech, project management, finance certifications pay for themselves quickly",
      "Employer funding: Use company education budgets ($2,000-5,000/year typical)",
      "Conference networking: Events create opportunities worth 10x the ticket price",
      "Online learning: Coursera, LinkedIn Learning, industry-specific platforms scale knowledge fast",
      "Teaching others: Speaking, writing, mentoring establishes expertise and opens doors"
    ],
    practicalAction: "Identify one skill that could increase your salary by $5,000+ and create a learning plan this month",
    moneyExample: "Project manager John earned $3,000 PMP certification, got promoted 6 months later with $15,000 salary increase = 500% ROI in first year",
    warningTip: "Avoid learning for learning's sake - focus on skills that directly impact earning potential"
  }
];

export default function IncomeCareerLessonEnhanced({ onComplete }: IncomeCareerLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`income-career-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `income-career-enhanced-${currentLesson}`;
    completeLesson(lessonId, 18);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`"${lesson.title}" completed! 💼`, {
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
          color="#7C3AED"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="purple" className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.info.bg} p-2 rounded-lg animate-float`}>
                <Briefcase className={`w-6 h-6 ${theme.status.info.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.info.text}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Chapter 3: Income & Career Growth
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 gradient-text-purple`}>
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
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Strategies</h3>
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
              Real Success Story
            </h3>
            <p className={`${theme.textColors.secondary} font-medium italic`}>
              {lesson.moneyExample}
            </p>
          </div>

          {/* Interactive Content */}
          {currentLesson === 1 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Salary Negotiation Impact Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Current Salary</h4>
                  <p className={`text-2xl font-bold ${theme.status.warning.text}`}>$65,000</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Before negotiation</p>
                </div>
                <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-2`}>After Negotiation</h4>
                  <p className={`text-2xl font-bold ${theme.status.info.text}`}>$75,000</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>15% increase</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>30-Year Impact</h4>
                  <p className={`text-2xl font-bold ${theme.status.success.text}`}>$400,000+</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Compound effect</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                💡 One conversation can literally change your financial life!
              </p>
            </div>
          )}

          {currentLesson === 2 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                Side Hustle Progression Timeline
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-2`}>Month 1-3: Foundation</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Identify skills, find first clients, earn $200-500/month</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Month 4-12: Growth</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Raise rates, improve systems, scale to $1,000-2,500/month</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Year 2+: Scale or Transition</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Either scale business or transition to full-time entrepreneurship</p>
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
                Income Strategy Complete! Ready for the salary calculator and quiz.
              </p>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  PieChart,
  DollarSign,
  Calculator,
  Target,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertCircle,
  Award,
  BarChart3,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import CashFlowTimingTool from './CashFlowTimingTool';
import IrregularExpenseTracker from './IrregularExpenseTracker';
import InteractiveBudgetAllocation from './InteractiveBudgetAllocation';
import BudgetPersonalityAssessment from '@/components/chapters/fundamentals/lessons/BudgetPersonalityAssessment';
import ExpenseOptimizationGame from '@/components/chapters/fundamentals/lessons/ExpenseOptimizationGame';
import SavingsGoalVisualizer from '@/components/chapters/fundamentals/lessons/SavingsGoalVisualizer';

interface BudgetingMasteryLessonProps {
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
    title: "The 50/30/20 Rule: Your Financial Foundation",
    content: "The 50/30/20 budgeting rule is the most effective framework for building wealth while maintaining quality of life. This system automatically balances your immediate needs, personal enjoyment, and long-term financial security. Studies show people using this rule save 67% more than those without a system.",
    keyPoints: [
      "50% Needs: Housing, utilities, groceries, minimum debt payments, insurance",
      "30% Wants: Dining out, entertainment, hobbies, non-essential shopping, lifestyle upgrades",
      "20% Savings & Debt: Emergency fund, retirement, extra debt payments, investments",
      "Automate transfers to make budgeting effortless and eliminate decision fatigue",
      "Adjust percentages based on income level: High earners can save 30%+, tight budgets may do 60/30/10"
    ],
    practicalAction: "Calculate your exact 50/30/20 amounts using your after-tax income this week",
    moneyExample: "$4,000 monthly income = $2,000 needs, $1,200 wants, $800 savings. If needs are only $1,800, put extra $200 toward savings = $1,000/month = $12,000/year wealth building!",
    warningTip: "Don't use gross income - use take-home pay after taxes, insurance, and 401k contributions"
  },
  {
    title: "Zero-Based Budgeting: Every Dollar Has a Purpose",
    content: "Zero-based budgeting assigns every dollar a specific job before you spend it. This method eliminates money 'leaks' and increases savings rates by 15-25% on average. When every dollar has a purpose, you gain complete control over your financial destiny and stop wondering 'where did my money go?'",
    keyPoints: [
      "Income minus all planned expenses and savings equals zero (on paper)",
      "Prevents lifestyle inflation by giving structure to extra income and windfalls",
      "Identifies spending patterns and eliminates unconscious money waste ($200-500/month typical)",
      "Build categories: Fixed expenses → Variable needs → Savings goals → Fun money",
      "Review and adjust monthly based on actual spending vs planned"
    ],
    practicalAction: "List every expense category and assign dollar amounts until you reach zero remaining",
    moneyExample: "$5,000 income: $2,000 rent, $600 food, $300 utilities, $400 car, $500 entertainment, $1,200 savings = $0 remaining. Every dollar planned!",
    warningTip: "Don't be too restrictive initially - allow realistic amounts for fun, or you'll abandon the budget"
  },
  {
    title: "Cash Flow Timing: When Money Comes and Goes",
    content: "Cash flow timing can make or break your budget. Even with perfect spending amounts, poor timing creates overdrafts, late fees, and stress. Mastering cash flow timing eliminates financial anxiety and prevents expensive mistakes that can cost $500+ per year in fees.",
    keyPoints: [
      "Map income dates: Payday schedule, bonus timing, side income, irregular payments",
      "Map expense dates: Rent, utilities, credit cards, subscriptions, insurance premiums",
      "Create buffer zones: Keep 1-2 weeks expenses as timing buffer in checking",
      "Align big bills with paydays: Request due date changes to match income timing",
      "Use calendar method: Visual monthly calendar showing all money in/out dates"
    ],
    practicalAction: "Create a monthly cash flow calendar showing every income and expense date",
    moneyExample: "Rent due 1st, paycheck on 15th = problem! Request rent due date change to 20th, or keep $1,500 buffer to cover timing gap",
    warningTip: "Irregular income requires larger buffers - freelancers need 2-4 weeks of expenses in checking"
  },
  {
    title: "Budget Categories: The Complete System",
    content: "Proper budget categories capture 100% of your spending while remaining simple enough to actually use. The key is balancing detail with practicality - too few categories miss important spending, too many become impossible to maintain. The sweet spot is 15-20 categories maximum.",
    keyPoints: [
      "Fixed Needs (40-50%): Rent, insurance, loan minimums, utilities, phone",
      "Variable Needs (10-15%): Groceries, gas, household items, basic clothing",
      "Lifestyle Wants (15-25%): Dining, entertainment, hobbies, subscription services",
      "Financial Goals (20-30%): Emergency fund, retirement, debt payoff, investments",
      "Fun Money (5-10%): No-guilt spending, personal splurges, spontaneous purchases"
    ],
    practicalAction: "Set up your budget categories in your banking app or budgeting tool this week",
    moneyExample: "Sarah's budget: $1,800 fixed, $400 groceries, $600 lifestyle, $800 savings, $200 fun money = $3,800 total monthly plan",
    warningTip: "Start with broader categories, then split them only if you consistently overspend"
  },
  {
    title: "Irregular Expenses: The Budget Killers",
    content: "Irregular expenses destroy more budgets than any other factor. Car repairs, medical bills, annual insurance, holidays, and home maintenance hit unprepared budgets like financial hurricanes. Smart budgeters save monthly for these 'irregular' but totally predictable expenses.",
    keyPoints: [
      "Annual expenses: Insurance premiums, car registration, property taxes, gifts",
      "Maintenance costs: Car repairs ($1,200/year average), home repairs (1-3% of home value)",
      "Seasonal expenses: Holiday gifts, summer vacations, back-to-school, winter heating",
      "Sinking funds: Save monthly for each category ($100/month = $1,200 for car repairs)",
      "Emergency categories: Medical deductibles, pet emergencies, appliance replacement"
    ],
    practicalAction: "List all irregular expenses you'll face this year and calculate monthly savings needed",
    moneyExample: "$2,400 car insurance + $1,500 car repairs + $2,000 gifts + $3,000 vacation = $8,900 ÷ 12 = $742/month needed for irregular expenses",
    warningTip: "Most people underestimate irregular expenses by 50% - use past year's spending or add 25% buffer"
  },
  {
    title: "Budget Automation: Set It and Forget It",
    content: "Manual budgeting fails because humans are terrible at consistent behavior. Automation removes willpower from the equation and makes budgeting effortless. Automated budgets save 2-3 hours per month and increase savings rates by 20% compared to manual systems.",
    keyPoints: [
      "Automatic transfers: Savings, investments, sinking funds move on payday",
      "Bill automation: All fixed expenses on autopay to prevent late fees",
      "Account separation: Different accounts for different budget categories",
      "Spending controls: Debit cards with category limits, separate 'fun money' account",
      "Review automation: Weekly 15-minute check-ins, monthly optimization sessions"
    ],
    practicalAction: "Set up automatic transfers for your top 3 financial goals this week",
    moneyExample: "Automated system: $1,200 to savings, $500 to Roth IRA, $300 to vacation fund, $200 to car repair fund - all happen automatically on payday, no decisions needed",
    warningTip: "Start with small automated amounts and increase gradually - don't shock your cash flow system"
  }
];

export default function BudgetingMasteryLessonEnhanced({ onComplete }: BudgetingMasteryLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(enhancedLessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = enhancedLessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`budgeting-mastery-enhanced-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `budgeting-mastery-enhanced-${currentLesson}`;
    completeLesson(lessonId, 20);

    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    toast.success(`"${lesson.title}" completed! 💰`, {
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
          color="#8B5CF6"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="purple" className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.info.bg} p-2 rounded-lg animate-float`}>
                <PieChart className={`w-6 h-6 ${theme.status.info.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.info.text}`}>
                Lesson {currentLesson + 1} of {enhancedLessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted}`}>
              Chapter 3: Budgeting & Cash Flow Mastery
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
              Real Money Example
            </h3>
            <p className={`${theme.textColors.secondary} font-medium italic`}>
              {lesson.moneyExample}
            </p>
          </div>

          {/* Interactive Content */}
          {currentLesson === 0 && (
            <div className={`mb-8`}>
              <BudgetPersonalityAssessment />
            </div>
          )}

          {currentLesson === 1 && (
            <div className={`mb-8`}>
              <InteractiveBudgetAllocation />
            </div>
          )}

          {currentLesson === 2 && (
            <div className={`mb-8`}>
              <CashFlowTimingTool />
            </div>
          )}

          {currentLesson === 3 && (
            <div className={`mb-8`}>
              <ExpenseOptimizationGame />
            </div>
          )}

          {currentLesson === 4 && (
            <div className={`mb-8`}>
              <IrregularExpenseTracker />
            </div>
          )}

          {currentLesson === 5 && (
            <div className={`mb-8`}>
              <SavingsGoalVisualizer />
            </div>
          )}

          {currentLesson === 0 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                50/30/20 Calculator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.info.text} mb-2`}>50% Needs</h4>
                  <p className={`text-2xl font-bold ${theme.status.info.text}`}>$2,000</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Housing, utilities, groceries</p>
                </div>
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>30% Wants</h4>
                  <p className={`text-2xl font-bold ${theme.status.warning.text}`}>$1,200</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Entertainment, dining out</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>20% Savings</h4>
                  <p className={`text-2xl font-bold ${theme.status.success.text}`}>$800</p>
                  <p className={`${theme.textColors.secondary} text-sm`}>Emergency, retirement, goals</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                💡 Based on $4,000 monthly take-home income
              </p>
            </div>
          )}

          {currentLesson === 2 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5" />
                Cash Flow Timing Example
              </h3>
              <div className="space-y-4">
                <div className={`p-4 ${theme.status.error.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.error.text} mb-2`}>❌ Poor Timing</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Rent due 1st, paycheck 15th = overdraft fees, stress, financial chaos</p>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>✅ Smart Timing</h4>
                  <p className={`${theme.textColors.secondary} text-sm`}>Rent due 20th, paycheck 15th = smooth cash flow, no fees, financial peace</p>
                </div>
              </div>
              <p className={`mt-4 text-center font-bold ${theme.textColors.primary}`}>
                🎯 Simple timing fixes save $500+ per year in fees!
              </p>
            </div>
          )}

          {currentLesson === 5 && (
            <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Zap className="w-5 h-5" />
                Automation Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Manual Budgeting</h4>
                  <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                    <li>• 3+ hours per month managing</li>
                    <li>• Frequent overspending</li>
                    <li>• Missed savings goals</li>
                    <li>• Late fees and stress</li>
                  </ul>
                </div>
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Automated Budgeting</h4>
                  <ul className={`${theme.textColors.secondary} text-sm space-y-1`}>
                    <li>• 15 minutes per month</li>
                    <li>• Consistent spending habits</li>
                    <li>• Automatic wealth building</li>
                    <li>• Financial peace of mind</li>
                  </ul>
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
                Budgeting Mastery Complete! Ready for the budget builder and quiz.
              </p>
            </div>
          )}
        </div>
      </GradientCard>
    </div>
  );
}

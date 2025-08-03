'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  PiggyBank,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star,
  Lightbulb,
  Clock,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RetirementPlanningLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "Understanding Retirement Account Types & Tax Advantages",
    content: "The retirement account you choose can make or break your financial future. Understanding the tax implications and contribution limits of 401(k)s, IRAs, and Roth accounts is crucial for maximizing your wealth accumulation. The difference between pre-tax and post-tax contributions can mean hundreds of thousands in additional retirement income.",
    keyPoints: [
      "401(k): $23,000 limit (2024), employer matching, immediate tax deduction",
      "Traditional IRA: $7,000 limit (2024), tax deductible if income eligible",
      "Roth IRA: $7,000 limit (2024), tax-free growth and withdrawals after 59½",
      "Roth 401(k): Best of both worlds - high limits with tax-free growth",
      "HSA: Triple tax advantage - deductible, grows tax-free, tax-free medical withdrawals"
    ]
  },
  {
    title: "The 4% Rule and Safe Withdrawal Strategies",
    content: "The 4% rule suggests you can safely withdraw 4% of your retirement portfolio annually without depleting your principal. But this 30-year-old rule needs modern adjustments. Understanding withdrawal strategies, sequence of returns risk, and dynamic spending helps ensure your money lasts through retirement.",
    keyPoints: [
      "4% rule: Withdraw 4% of initial portfolio value, adjust annually for inflation",
      "Modern adjustments: 3.5% may be safer with current market conditions",
      "Sequence of returns risk: Early losses can devastate long-term sustainability",
      "Bucket strategy: Divide portfolio into short/medium/long-term buckets",
      "Dynamic spending: Adjust withdrawals based on portfolio performance"
    ]
  },
  {
    title: "Calculating Your Retirement Number",
    content: "How much do you actually need to retire comfortably? The answer depends on your lifestyle, healthcare costs, inflation, and longevity. Most people underestimate their needs by 40-60%. Learn the proven formulas and factors to calculate your personalized retirement target.",
    keyPoints: [
      "25x rule: Need 25 times your annual expenses for retirement (based on 4% rule)",
      "Replacement ratio: Target 70-90% of pre-retirement income for lifestyle maintenance",
      "Healthcare inflation: Medical costs grow 6-8% annually - plan accordingly",
      "Longevity risk: Plan for 30+ year retirement - half of 65-year-olds live past 85",
      "Inflation impact: $1 today = $0.50 purchasing power in 20 years at 3.5% inflation"
    ]
  },
  {
    title: "Advanced Strategies: Mega Backdoor Roth & Tax Planning",
    content: "High earners need advanced strategies to maximize retirement savings beyond standard limits. The mega backdoor Roth, tax-loss harvesting, and geographic arbitrage can dramatically accelerate your path to financial independence. These strategies can add $500K-1M+ to your retirement wealth.",
    keyPoints: [
      "Mega backdoor Roth: Contribute up to $69,000 total to retirement accounts annually",
      "Backdoor Roth: Convert traditional IRA to Roth when income exceeds limits",
      "Tax-loss harvesting: Offset gains with losses to minimize tax drag",
      "Asset location: Put tax-inefficient investments in tax-advantaged accounts",
      "Geographic arbitrage: Earn in high-income area, retire in low-cost location"
    ]
  }
];

export default function RetirementPlanningLesson({ onComplete }: RetirementPlanningLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`retirement-planning-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `retirement-planning-${currentLesson}`;
    completeLesson(lessonId, 22);

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
          color="#8B5CF6"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="purple" className="p-8">
        {/* Header with Icons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.textColors.primary}/20 p-2 rounded-lg animate-float`}>
                <PiggyBank className={`w-6 h-6 ${theme.textColors.primary}`} />
              </div>
              <span className={`text-sm font-medium ${theme.textColors.primary} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 9: Retirement Planning & Long-term Wealth
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 animate-fade-in-up stagger-2 gradient-text-purple`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6 animate-fade-in-up stagger-3`}>
            {lesson.content}
          </p>

          {/* Enhanced Key Points */}
          <GradientCard variant="glass" gradient="pink" className="p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.info.bg} p-2 rounded-lg mr-3 animate-wiggle`}>
                <Star className={`w-5 h-5 ${theme.status.info.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className={`flex items-start animate-slide-in-right stagger-${(index % 4) + 1}`}>
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.info.bg} rounded-full flex items-center justify-center mt-1 mr-3 animate-glow-pulse`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.info.text}`} />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>
        </div>

        {/* Interactive Exercises for Better Retention */}
        {currentLesson === 0 && (
          <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              Retirement Account Optimization Worksheet
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <p className={`font-medium ${theme.textColors.primary}`}>Maximize your retirement contributions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <Award className={`w-4 h-4 ${theme.textColors.primary}`} />
                    Employer Sponsored (2024 Limits)
                  </h4>
                  <ul className={`space-y-2 ${theme.textColors.secondary} text-sm`}>
                    <li>• 401(k) contribution: $______ / $23,000</li>
                    <li>• Employer match: $______ (free money!)</li>
                    <li>• Total employer plan: $______ / $69,000</li>
                    <li>• Catch-up (50+): $______ / $7,500</li>
                  </ul>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <PiggyBank className={`w-4 h-4 ${theme.status.success.text}`} />
                    Individual Accounts (2024 Limits)
                  </h4>
                  <ul className={`space-y-2 ${theme.textColors.secondary} text-sm`}>
                    <li>• Traditional IRA: $______ / $7,000</li>
                    <li>• Roth IRA: $______ / $7,000</li>
                    <li>• HSA contribution: $______ / $4,150</li>
                    <li>• Catch-up (50+): $______ / $1,000</li>
                  </ul>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.textColors.primary}`}>
                💡 <strong>Max Strategy:</strong> Aim to contribute at least 15-20% of income to retirement!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Safe Withdrawal Rate Calculator
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Conservative (3%)</h4>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${theme.status.success.text}`}>$1M</div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>→ $30,000/year</div>
                    <div className={`text-xs ${theme.textColors.muted}`}>Safest for early retirement</div>
                  </div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Moderate (4%)</h4>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${theme.status.info.text}`}>$1M</div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>→ $40,000/year</div>
                    <div className={`text-xs ${theme.textColors.muted}`}>Traditional retirement age</div>
                  </div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Aggressive (5%)</h4>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${theme.status.warning.text}`}>$1M</div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>→ $50,000/year</div>
                    <div className={`text-xs ${theme.textColors.muted}`}>Higher risk of depletion</div>
                  </div>
                </div>
              </div>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  <strong>Your Calculation:</strong> Target annual expenses: $______
                </p>
                <ul className={`text-xs ${theme.textColors.secondary} space-y-1`}>
                  <li>• Conservative (3%): Need $______ (annual expenses ÷ 0.03)</li>
                  <li>• Moderate (4%): Need $______ (annual expenses ÷ 0.04)</li>
                  <li>• 25x Rule: Need $______ (annual expenses × 25)</li>
                </ul>
              </div>
              <p className={`mt-4 font-medium ${theme.status.warning.text}`}>
                💡 <strong>Remember:</strong> Lower withdrawal rates = higher success probability!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <Calendar className="w-5 h-5" />
              Retirement Timeline Planner
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <Clock className={`w-4 h-4 ${theme.status.info.text}`} />
                    Time to Retirement Impact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Starting at 25:</span>
                      <span className={`${theme.status.success.text} font-medium`}>40 years to grow</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Starting at 35:</span>
                      <span className={`${theme.status.warning.text} font-medium`}>30 years to grow</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Starting at 45:</span>
                      <span className={`${theme.status.warning.text} font-medium`}>20 years to grow</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Starting at 55:</span>
                      <span className={`${theme.status.error.text} font-medium`}>10 years to grow</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <TrendingUp className={`w-4 h-4 ${theme.status.success.text}`} />
                    Compound Growth Example
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className={`text-center p-3 ${theme.backgrounds.header} rounded-lg`}>
                      <div className={`text-lg font-bold ${theme.status.success.text}`}>$500/month @ 7% return</div>
                      <div className={`text-xs ${theme.textColors.muted} mt-1`}>Starting at different ages:</div>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 25 → 65:</span>
                      <span className={`${theme.status.success.text} font-medium`}>$1.35M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 35 → 65:</span>
                      <span className={`${theme.status.warning.text} font-medium`}>$611K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 45 → 65:</span>
                      <span className={`${theme.status.warning.text} font-medium`}>$246K</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.info.text}`}>
                💡 <strong>Time is money:</strong> Every year delayed costs exponentially more!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 3 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              Advanced Strategy Implementation
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <span className={`${theme.status.info.bg} ${theme.status.info.text} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold`}>1</span>
                    Mega Backdoor Roth Setup
                  </h4>
                  <ul className={`space-y-1 text-xs ${theme.textColors.secondary}`}>
                    <li>• Max 401(k): $23,000 pre-tax</li>
                    <li>• After-tax contributions: $46,000</li>
                    <li>• Convert to Roth: Tax-free growth</li>
                    <li>• Total possible: $69,000/year</li>
                  </ul>
                  <div className={`mt-2 text-xs ${theme.textColors.primary}`}>Requires employer plan support</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <span className={`${theme.status.success.bg} ${theme.status.success.text} rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold`}>2</span>
                    Tax-Loss Harvesting
                  </h4>
                  <ul className={`space-y-1 text-xs ${theme.textColors.secondary}`}>
                    <li>• Sell losing investments</li>
                    <li>• Offset capital gains</li>
                    <li>• Reduce taxable income</li>
                    <li>• Reinvest in similar assets</li>
                  </ul>
                  <div className={`mt-2 text-xs ${theme.status.success.text}`}>Can save 15-25% in taxes</div>
                </div>
              </div>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Asset Location Optimization:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className={`font-medium ${theme.status.success.text}`}>Tax-Advantaged Accounts:</div>
                    <div>• Bonds & REITs</div>
                    <div>• High-turnover funds</div>
                  </div>
                  <div>
                    <div className={`font-medium ${theme.status.info.text}`}>Roth Accounts:</div>
                    <div>• Growth stocks</div>
                    <div>• High-return investments</div>
                  </div>
                  <div>
                    <div className={`font-medium ${theme.status.warning.text}`}>Taxable Accounts:</div>
                    <div>• Tax-efficient index funds</div>
                    <div>• Tax-exempt bonds</div>
                  </div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.textColors.primary}`}>
                💡 <strong>Advanced strategies:</strong> Can add $500K-1M+ to retirement wealth over 30 years!
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
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === lessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
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

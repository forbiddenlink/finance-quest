'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  CreditCard,
  AlertTriangle,
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
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DebtManagementLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "Understanding Good Debt vs Bad Debt",
    content: "Not all debt is created equal. Understanding the difference between good debt that builds wealth and bad debt that destroys it is fundamental to financial success. Good debt helps you acquire appreciating assets or increases your earning potential, while bad debt finances depreciating items or lifestyle expenses.",
    keyPoints: [
      "Good debt: Mortgages, student loans, business loans - investments in your future",
      "Bad debt: Credit cards, payday loans, auto loans - depreciating assets or consumption",
      "Tax-deductible debt provides additional benefits through reduced tax liability",
      "Interest rates below inflation mean you're essentially borrowing for free",
      "Debt-to-income ratio under 36% is considered healthy by most lenders"
    ]
  },
  {
    title: "The Debt Avalanche vs Snowball Methods",
    content: "Two proven strategies for debt elimination, each with distinct advantages. The avalanche method saves the most money by targeting highest interest rates first, while the snowball method provides psychological wins by eliminating smallest balances first. Choose based on your personality and financial situation.",
    keyPoints: [
      "Debt Avalanche: Pay minimums on all debts, extra payments to highest interest rate",
      "Debt Snowball: Pay minimums on all debts, extra payments to smallest balance",
      "Avalanche saves more money mathematically - typically 15-20% faster payoff",
      "Snowball provides motivation through quick wins - better for behavioral success",
      "Hybrid approach: Start with snowball for momentum, switch to avalanche later"
    ]
  },
  {
    title: "Credit Card Optimization Strategies",
    content: "Credit cards can be powerful financial tools when used strategically, or devastating wealth destroyers when mismanaged. Learn to leverage rewards, manage utilization, and use credit cards to your advantage while avoiding the traps that keep people in debt cycles.",
    keyPoints: [
      "Keep utilization under 30% total, under 10% per card for optimal credit scores",
      "Pay statement balances in full monthly to avoid interest charges completely",
      "Maximize rewards with strategic category cards: 2-5% cash back possible",
      "Balance transfer cards offer 0% APR for 12-21 months - use wisely for payoff",
      "Never close old cards with no annual fee - they boost your credit history length"
    ]
  },
  {
    title: "Advanced Debt Negotiation & Settlement",
    content: "When debt becomes overwhelming, negotiation can provide relief. Learn professional strategies for working with creditors, understanding your rights, and potentially settling debts for less than owed. These techniques can save thousands but must be used carefully to protect your credit.",
    keyPoints: [
      "Hardship programs often provide 0% interest and reduced payments temporarily",
      "Debt settlement typically settles for 40-60% of original balance",
      "Pay-for-delete negotiations can remove negative marks from credit reports",
      "Statute of limitations varies by state: 3-6 years for most unsecured debt",
      "Get all agreements in writing before making any payments to creditors"
    ]
  }
];

export default function DebtManagementLesson({ onComplete }: DebtManagementLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`debt-management-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `debt-management-${currentLesson}`;
    completeLesson(lessonId, 18);

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
          color="#EF4444"
          className="animate-bounce-in"
        />
      </div>

      <GradientCard variant="glass" gradient="red" className="p-8">
        {/* Header with Icons */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${theme.status.error.bg} p-2 rounded-lg animate-float`}>
                <CreditCard className={`w-6 h-6 ${theme.status.error.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.error.text} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 8: Debt Management & Credit Strategy
            </span>
          </div>

          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-4 animate-fade-in-up stagger-2 gradient-text-red`}>
            {lesson.title}
          </h1>
        </div>

        {/* Content with Enhanced Styling */}
        <div className="mb-8">
          <p className={`text-lg ${theme.textColors.secondary} leading-relaxed mb-6 animate-fade-in-up stagger-3`}>
            {lesson.content}
          </p>

          {/* Enhanced Key Points */}
          <GradientCard variant="glass" gradient="yellow" className="p-6 animate-fade-in-up stagger-4">
            <div className="flex items-center mb-4">
              <div className={`${theme.status.warning.bg} p-2 rounded-lg mr-3 animate-wiggle`}>
                <Star className={`w-5 h-5 ${theme.status.warning.text}`} />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Key Points</h3>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className={`flex items-start animate-slide-in-right stagger-${(index % 4) + 1}`}>
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.warning.bg} rounded-full flex items-center justify-center mt-1 mr-3 animate-glow-pulse`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className={`${theme.textColors.secondary} font-medium`}>{point}</span>
                </li>
              ))}
            </ul>
          </GradientCard>
        </div>

        {/* Interactive Exercises for Better Retention */}
        {currentLesson === 0 && (
          <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.accent} mb-3 flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              Debt Assessment Worksheet
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <p className={`font-medium ${theme.textColors.primary}`}>Categorize your current debts:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <Award className="w-4 h-4 text-green-400" />
                    Good Debt (Wealth Building)
                  </h4>
                  <ul className={`space-y-2 ${theme.textColors.secondary} text-sm`}>
                    <li>• Mortgage: $________ at ___% APR</li>
                    <li>• Student loans: $________ at ___% APR</li>
                    <li>• Business loans: $________ at ___% APR</li>
                    <li>• Investment property: $________ at ___% APR</li>
                  </ul>
                  <div className="mt-3 text-xs text-green-400">Often tax-deductible</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Bad Debt (Wealth Destroying)
                  </h4>
                  <ul className={`space-y-2 ${theme.textColors.secondary} text-sm`}>
                    <li>• Credit cards: $________ at ___% APR</li>
                    <li>• Auto loans: $________ at ___% APR</li>
                    <li>• Personal loans: $________ at ___% APR</li>
                    <li>• Payday loans: $________ at ___% APR</li>
                  </ul>
                  <div className="mt-3 text-xs text-red-400">Eliminate ASAP</div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.textColors.accent}`}>
                💡 <strong>Priority:</strong> Focus elimination efforts on bad debt with highest interest rates!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Debt Payoff Strategy Comparison
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <Calculator className="w-4 h-4 text-blue-400" />
                    Debt Avalanche Method
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Approach</span>
                      <span className="text-blue-400 font-medium">Highest Interest First</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Math Result</span>
                      <span className="text-blue-400 font-medium">Saves Most Money</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Psychology</span>
                      <span className="text-blue-400 font-medium">Requires Discipline</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Best For</span>
                      <span className="text-blue-400 font-medium">Logical Decision Makers</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-400">Example: 25% faster payoff</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <Zap className="w-4 h-4 text-green-400" />
                    Debt Snowball Method
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Approach</span>
                      <span className="text-green-400 font-medium">Smallest Balance First</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Math Result</span>
                      <span className="text-green-400 font-medium">Costs More Interest</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Psychology</span>
                      <span className="text-green-400 font-medium">Quick Wins & Motivation</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Best For</span>
                      <span className="text-green-400 font-medium">Emotional Decision Makers</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-green-400">Example: Higher success rate</div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.warning.text}`}>
                💡 <strong>Choose Your Method:</strong> Success is better than perfection - pick the method you&apos;ll stick with!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <CreditCard className="w-5 h-5" />
              Credit Card Optimization Checklist
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <Shield className="w-4 h-4 text-blue-400" />
                    Credit Score Protection
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>Keep total utilization under 30%</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>Keep individual cards under 10%</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>Pay before statement closes</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>Never close old no-fee cards</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Rewards Maximization
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>5% categories: Gas, groceries, dining</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>2% everywhere card for other purchases</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>Travel cards for hotels/flights</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span>Pay statement balance in full</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg mt-4`}>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  <strong>Example Optimization:</strong> $5,000 monthly spending optimized:
                </p>
                <ul className={`text-xs ${theme.textColors.secondary} space-y-1`}>
                  <li>• Groceries ($800): 5% cash back = $40/month</li>
                  <li>• Gas ($300): 5% cash back = $15/month</li>
                  <li>• Everything else ($3,900): 2% cash back = $78/month</li>
                  <li className="font-bold text-green-400">• Total rewards: $133/month = $1,596/year</li>
                </ul>
              </div>
              <p className={`mt-4 font-medium ${theme.status.info.text}`}>
                💡 <strong>Golden Rule:</strong> Only spend what you can pay off in full each month!
              </p>
            </div>
          </div>
        )}

        {currentLesson === 3 && (
          <div className={`mb-8 p-6 ${theme.status.error.bg} rounded-lg border-l-4 ${theme.status.error.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.error.text} mb-3 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              Debt Negotiation Strategies & Rights
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    Hardship Programs
                  </h4>
                  <ul className={`space-y-1 text-xs ${theme.textColors.secondary}`}>
                    <li>• 0% interest temporarily</li>
                    <li>• Reduced minimum payments</li>
                    <li>• Skip payment options</li>
                    <li>• No credit score impact</li>
                  </ul>
                  <div className="mt-2 text-xs text-blue-400">Best first option</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    Settlement
                  </h4>
                  <ul className={`space-y-1 text-xs ${theme.textColors.secondary}`}>
                    <li>• 40-60% of balance</li>
                    <li>• Lump sum payment</li>
                    <li>• Credit score damage</li>
                    <li>• Tax implications possible</li>
                  </ul>
                  <div className="mt-2 text-xs text-orange-400">Last resort option</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                    Pay-for-Delete
                  </h4>
                  <ul className={`space-y-1 text-xs ${theme.textColors.secondary}`}>
                    <li>• Remove from credit report</li>
                    <li>• Get agreement in writing</li>
                    <li>• Pay agreed amount</li>
                    <li>• Monitor for removal</li>
                  </ul>
                  <div className="mt-2 text-xs text-green-400">Credit repair option</div>
                </div>
              </div>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Your Rights Under Fair Debt Collection:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>• No calls before 8 AM or after 9 PM</div>
                  <div>• No harassment or abuse</div>
                  <div>• No false or misleading statements</div>
                  <div>• Right to request validation</div>
                  <div>• Right to dispute debt</div>
                  <div>• Can request cease communication</div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.error.text}`}>
                💡 <strong>Critical:</strong> Get all agreements in writing before making any payments!
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
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.accent} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Previous
            </button>
            <button
              onClick={nextLesson}
              disabled={currentLesson === lessons.length - 1}
              className={`group flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.accent} disabled:opacity-50 disabled:cursor-not-allowed transition-all morph-button`}
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

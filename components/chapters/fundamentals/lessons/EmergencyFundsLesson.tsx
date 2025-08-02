'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import {
  Shield,
  Target,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Home,
  Briefcase,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencyFundsLessonProps {
  onComplete?: () => void;
}

interface LessonContent {
  title: string;
  content: string;
  keyPoints: string[];
}

const lessons: LessonContent[] = [
  {
    title: "Why Emergency Funds Are Your Financial Fortress",
    content: "40% of Americans can't cover a $400 emergency, leading to debt cycles that trap families for decades. Emergency funds aren't just savings—they're peace of mind, freedom from financial stress, and the foundation that allows every other financial goal to succeed. Without this safety net, one crisis can destroy years of progress.",
    keyPoints: [
      "Emergency funds break the debt cycle by preventing credit card reliance during crises",
      "Financial stress reduces productivity, health, and decision-making quality significantly",
      "Safety nets provide negotiating power: you can leave bad jobs, wait for better opportunities",
      "Peace of mind allows risk-taking in career and investments that build long-term wealth",
      "Studies show people with emergency funds earn 20%+ more over their lifetimes"
    ]
  },
  {
    title: "Calculating Your Perfect Emergency Fund Size",
    content: "The standard '3-6 months' advice is oversimplified. Your optimal emergency fund depends on job security, health, dependents, and income stability. A gig worker needs 12 months, while a tenured professor needs 3. Here's how to calculate your personalized target that provides security without over-saving.",
    keyPoints: [
      "High job security (teacher, government) = 3-4 months of expenses minimum",
      "Variable income (sales, freelance, business owner) = 8-12 months for stability",
      "Single parents or sole income earners need 6-9 months for family protection",
      "Health issues or chronic conditions require additional 3-6 month buffer",
      "Calculate essential expenses only: housing, food, utilities, minimum debt payments"
    ]
  },
  {
    title: "Where to Keep Emergency Money for Growth and Access",
    content: "Your emergency fund should earn money while staying accessible. Traditional savings accounts earning 0.01% are wealth destroyers due to inflation. High-yield savings, money market accounts, and short-term CDs can earn 4-5% while keeping funds available within 24-48 hours for true emergencies.",
    keyPoints: [
      "High-yield online savings accounts: 4-5% APY with instant access via transfers",
      "Money market accounts offer higher rates plus limited check-writing privileges",
      "CD ladders provide higher returns while maintaining regular access to portions",
      "Avoid investing emergency funds in stocks or bonds due to volatility risks",
      "Keep 1 month of expenses in checking, rest in high-yield accounts for optimization"
    ]
  },
  {
    title: "Building Your Emergency Fund Systematically",
    content: "Most people fail to build emergency funds because they rely on willpower instead of systems. Automation removes decision fatigue and ensures consistent progress. Start with $1,000 for immediate small emergencies, then build to your full target using the 'pay yourself first' principle and milestone celebrations.",
    keyPoints: [
      "Automate transfers on payday before you can spend the money elsewhere",
      "Start with $1,000 mini-emergency fund, then build to full target systematically",
      "Use windfalls strategically: tax refunds, bonuses, gifts go directly to emergency fund",
      "Celebrate milestones: $1k, $5k, $10k achievements maintain motivation over months",
      "Track progress visually with charts or apps to see steady growth over time"
    ]
  }
];

export default function EmergencyFundsLesson({ onComplete }: EmergencyFundsLessonProps) {
  const { userProgress, completeLesson } = useProgressStore();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>(new Array(lessons.length).fill(false));

  // Load completed lessons from global state
  useEffect(() => {
    const newCompleted = lessons.map((lesson, index) =>
      userProgress.completedLessons.includes(`emergency-funds-${index}`)
    );
    setCompletedLessons(newCompleted);
  }, [userProgress.completedLessons]);

  const markComplete = () => {
    const lessonId = `emergency-funds-${currentLesson}`;
    completeLesson(lessonId, 15);

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
                <Shield className={`w-6 h-6 ${theme.status.error.text}`} />
              </div>
              <span className={`text-sm font-medium ${theme.status.error.text} animate-fade-in-up`}>
                Lesson {currentLesson + 1} of {lessons.length}
              </span>
            </div>
            <span className={`text-sm ${theme.textColors.muted} animate-fade-in-up stagger-1`}>
              Chapter 5: Emergency Funds & Financial Safety
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
              <AlertCircle className="w-5 h-5" />
              Emergency Fund Reality Check
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-400" />
                  <div className="text-2xl font-bold text-red-400">40%</div>
                  <div className="text-sm text-gray-300">Can't cover $400 emergency</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <Clock className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                  <div className="text-2xl font-bold text-orange-400">78%</div>
                  <div className="text-sm text-gray-300">Live paycheck to paycheck</div>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <Shield className="w-8 h-8 mx-auto mb-3 text-green-400" />
                  <div className="text-2xl font-bold text-green-400">$1,000</div>
                  <div className="text-sm text-gray-300">Minimum recommended fund</div>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.textColors.accent}`}>
                💡 <strong>Ask yourself:</strong> If I lost my income tomorrow, how long could I maintain my current lifestyle? This answer determines your emergency fund target.
              </p>
            </div>
          </div>
        )}

        {currentLesson === 1 && (
          <div className={`mb-8 p-6 ${theme.status.info.bg} rounded-lg border-l-4 ${theme.status.info.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              Personal Emergency Fund Calculator
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`font-medium ${theme.textColors.primary} mb-3`}>Calculate your target:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`font-medium ${theme.textColors.primary} mb-2`}>Monthly Essential Expenses:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Rent/Mortgage: $______</li>
                      <li>Food & Groceries: $______</li>
                      <li>Utilities: $______</li>
                      <li>Transportation: $______</li>
                      <li>Insurance: $______</li>
                      <li>Minimum debt payments: $______</li>
                      <li><strong>Total Monthly: $______</strong></li>
                    </ul>
                  </div>
                  <div>
                    <p className={`font-medium ${theme.textColors.primary} mb-2`}>Risk Factors:</p>
                    <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                      <li>Job security: High/Medium/Low</li>
                      <li>Income stability: Steady/Variable</li>
                      <li>Health issues: Yes/No</li>
                      <li>Dependents: Yes/No</li>
                      <li>Single income: Yes/No</li>
                    </ul>
                    <p className={`mt-3 font-medium ${theme.status.info.text}`}>
                      Target: Monthly expenses × _____ months
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentLesson === 2 && (
          <div className={`mb-8 p-6 ${theme.status.success.bg} rounded-lg border-l-4 ${theme.status.success.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5" />
              High-Yield Storage Options
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <DollarSign className="w-4 h-4 text-green-400" />
                    High-Yield Savings
                  </h4>
                  <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <li>• 4-5% APY current rates</li>
                    <li>• Instant access via transfers</li>
                    <li>• FDIC insured up to $250k</li>
                    <li>• Best for: Main emergency fund</li>
                  </ul>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Target className="w-4 h-4 text-blue-400" />
                    Money Market
                  </h4>
                  <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <li>• 4-5.5% APY typical</li>
                    <li>• Check writing privileges</li>
                    <li>• Higher minimum balances</li>
                    <li>• Best for: Large emergency funds</li>
                  </ul>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Clock className="w-4 h-4 text-purple-400" />
                    CD Ladders
                  </h4>
                  <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <li>• 5-6% APY for terms</li>
                    <li>• Staggered maturity dates</li>
                    <li>• Early withdrawal penalties</li>
                    <li>• Best for: Extra emergency funds</li>
                  </ul>
                </div>
              </div>
              <p className={`mt-4 font-medium ${theme.status.success.text}`}>
                💡 <strong>Pro Strategy:</strong> Keep 1 month in checking, 3-5 months in high-yield savings, excess in money market or CDs.
              </p>
            </div>
          </div>
        )}

        {currentLesson === 3 && (
          <div className={`mb-8 p-6 ${theme.status.warning.bg} rounded-lg border-l-4 ${theme.status.warning.border}`}>
            <h3 className={`text-lg font-semibold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              Emergency Fund Building Strategy
            </h3>
            <div className={`${theme.textColors.secondary} space-y-4`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <div className="text-lg font-bold text-red-400 mb-2">Step 1</div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Mini Fund</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Build $1,000 as fast as possible for small emergencies</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <div className="text-lg font-bold text-orange-400 mb-2">Step 2</div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Automate</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Set up automatic transfers on payday before spending</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <div className="text-lg font-bold text-blue-400 mb-2">Step 3</div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Windfalls</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Direct tax refunds, bonuses, gifts to emergency fund</p>
                </div>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
                  <div className="text-lg font-bold text-green-400 mb-2">Step 4</div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Maintain</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>Replenish after use, adjust for life changes</p>
                </div>
              </div>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                <p className={`font-medium ${theme.textColors.primary} mb-2`}>Milestone Celebration Plan:</p>
                <ul className={`list-disc list-inside space-y-1 ml-4 ${theme.textColors.secondary} text-sm`}>
                  <li>$1,000: Treat yourself to something small you've wanted</li>
                  <li>$5,000: Special dinner or experience with loved ones</li>
                  <li>$10,000: Weekend getaway to celebrate your security</li>
                  <li>Full target: You've achieved financial fortress status! 🏰</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success Stories */}
        {currentLesson === 0 && (
          <div className={`mb-8 p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>Emergency Fund Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm rounded-lg p-4">
                <Briefcase className="w-6 h-6 text-blue-400 mb-2" />
                <h4 className="font-semibold text-blue-300 mb-2">Sarah's Job Loss Recovery</h4>
                <p className="text-sm text-gray-300">
                  With 6 months saved, Sarah took time to find the right job instead of accepting the first offer. 
                  Result: 30% salary increase.
                </p>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-sm rounded-lg p-4">
                <Heart className="w-6 h-6 text-red-400 mb-2" />
                <h4 className="font-semibold text-red-300 mb-2">Mike's Medical Emergency</h4>
                <p className="text-sm text-gray-300">
                  Surgery cost $15,000. His emergency fund covered deductible and lost income, 
                  avoiding bankruptcy.
                </p>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 backdrop-blur-sm rounded-lg p-4">
                <Home className="w-6 h-6 text-green-400 mb-2" />
                <h4 className="font-semibold text-green-300 mb-2">Lisa's Home Opportunity</h4>
                <p className="text-sm text-gray-300">
                  Used emergency fund for dream home down payment, then quickly rebuilt it. 
                  Emergency funds provide options.
                </p>
              </div>
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

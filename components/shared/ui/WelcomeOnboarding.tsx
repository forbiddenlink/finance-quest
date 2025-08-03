'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  Rocket,
  Target,
  BookOpen,
  Calculator,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { theme } from '@/lib/theme';

interface WelcomeOnboardingProps {
  onComplete?: () => void;
}

export default function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const userProgress = useProgressStore(state => state.userProgress);
  const completeLesson = useProgressStore(state => state.completeLesson);
  const completeOnboarding = useProgressStore(state => state.completeOnboarding);

  // Only show onboarding if it hasn&apos;t been completed yet
  useEffect(() => {
    if (!userProgress.onboardingCompleted) {
      setIsVisible(true);
    }
  }, [userProgress.onboardingCompleted]);

  const steps = [
    {
      title: "Welcome to Finance Quest! 🎉",
      subtitle: "Your journey to financial mastery starts here",
      content: (
        <div className="text-center space-y-6">
          <div className={`w-24 h-24 mx-auto ${theme.buttons.primary} rounded-full flex items-center justify-center`}>
            <Rocket className={`w-12 h-12 ${theme.textColors.primary}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>Ready to Transform Your Financial Future?</h3>
            <p className={theme.textColors.secondary}>
              Join thousands of learners who&apos;ve gone from financial confusion to confidence.
              Our proven system will teach you everything you need to know about money.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>20+</div>
              <div className={theme.textColors.secondary}>Interactive Lessons</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>6</div>
              <div className={theme.textColors.secondary}>Financial Calculators</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>100%</div>
              <div className={theme.textColors.secondary}>Free Forever</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Learning Path 📚",
      subtitle: "Designed by financial experts for real results",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className={`flex items-center gap-4 p-3 ${theme.status.info.bg} rounded-lg ${theme.status.info.border} border`}>
              <div className={`w-8 h-8 ${theme.buttons.primary} rounded-full flex items-center justify-center ${theme.textColors.primary} font-bold text-sm`}>1</div>
              <div>
                <p className={`font-semibold ${theme.status.info.text}`}>Foundation Chapters</p>
                <p className={`text-sm ${theme.textColors.secondary}`}>Money psychology, banking, budgeting basics</p>
              </div>
            </div>
            <div className={`flex items-center gap-4 p-3 ${theme.status.info.bg} rounded-lg ${theme.status.info.border} border`}>
              <div className={`w-8 h-8 ${theme.buttons.primary} rounded-full flex items-center justify-center ${theme.textColors.primary} font-bold text-sm`}>2</div>
              <div>
                <p className={`font-semibold ${theme.status.info.text}`}>Interactive Tools</p>
                <p className={`text-sm ${theme.textColors.secondary}`}>Hands-on calculators for real scenarios</p>
              </div>
            </div>
            <div className={`flex items-center gap-4 p-3 ${theme.status.info.bg} rounded-lg ${theme.status.info.border} border`}>
              <div className={`w-8 h-8 ${theme.buttons.primary} rounded-full flex items-center justify-center ${theme.textColors.primary} font-bold text-sm`}>3</div>
              <div>
                <p className={`font-semibold ${theme.status.info.text}`}>Advanced Topics</p>
                <p className={`text-sm ${theme.textColors.secondary}`}>Investing, retirement, wealth building</p>
              </div>
            </div>
          </div>
          <div className={`${theme.status.warning.bg} ${theme.status.warning.border} border rounded-lg p-4`}>
            <p className={`text-sm ${theme.status.warning.text}`}>
              <Zap className="w-4 h-4 inline mr-1" />
              <strong>Pro Tip:</strong> Complete lessons in order for the best learning experience.
              Each chapter builds on the previous one!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Set Your Goal 🎯",
      subtitle: "What brings you to Finance Quest?",
      content: (
        <div className="space-y-4">
          <p className={`${theme.textColors.secondary} text-center text-sm`}>
            Choose your primary financial goal to get personalized recommendations:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: Target, title: "Get Out of Debt", subtitle: "Eliminate credit cards, loans, and become debt-free" },
              { icon: BookOpen, title: "Learn the Basics", subtitle: "Understand budgeting, saving, and banking fundamentals" },
              { icon: Calculator, title: "Buy a Home", subtitle: "Save for down payment and understand mortgages" },
              { icon: Star, title: "Invest & Build Wealth", subtitle: "Start investing and plan for financial independence" },
              { icon: Award, title: "Prepare for Retirement", subtitle: "Maximize 401k, IRA, and retirement planning" }
            ].map((goal, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 ${theme.backgrounds.card} ${theme.interactive.hover} rounded-lg ${theme.borderColors.primary} border cursor-pointer transition-all`}
                onClick={() => {
                  // Could track user's goal selection here
                  // Goal tracking could be implemented here for analytics
                }}
              >
                <div className={`w-8 h-8 ${theme.status.info.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <goal.icon className={`w-4 h-4 ${theme.status.info.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold ${theme.textColors.primary} text-sm`}>{goal.title}</p>
                  <p className={`text-xs ${theme.textColors.secondary} leading-tight`}>{goal.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "You&apos;re All Set! 🚀",
      subtitle: "Ready to start your financial transformation",
      content: (
        <div className="text-center space-y-6">
          <div className={`w-24 h-24 mx-auto ${theme.status.success.bg} rounded-full flex items-center justify-center`}>
            <CheckCircle className={`w-12 h-12 ${theme.status.success.text}`} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>Welcome to Your Financial Future!</h3>
            <p className={theme.textColors.secondary}>
              Your progress will be automatically saved as you complete lessons and use calculators.
              Start with Chapter 1 to build a strong foundation.
            </p>
          </div>
          <div className={`${theme.status.info.bg} ${theme.status.info.border} border rounded-lg p-4`}>
            <p className={`text-sm ${theme.status.info.text} mb-2`}>
              <strong>Quick Start Recommendation:</strong>
            </p>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Begin with &quot;Money Fundamentals&quot; to understand your relationship with money,
              then try the Paycheck Calculator to see how taxes affect your income.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/chapter1">
              <button className={`${theme.buttons.primary} px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2`}>
                <BookOpen className="w-4 h-4" />
                Start Chapter 1
              </button>
            </Link>
            <Link href="/calculators">
              <button className={`${theme.buttons.accent} px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2`}>
                <Calculator className="w-4 h-4" />
                Try Calculators
              </button>
            </Link>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      completeOnboarding();
      completeLesson('onboarding-complete', 300); // 5 minutes
      setIsVisible(false);
      onComplete?.();
    }
  };

  const handleSkip = () => {
    // Mark onboarding as complete even when skipped
    completeOnboarding();
    setIsVisible(false);
    onComplete?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`${theme.backgrounds.card} rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className={`${theme.backgrounds.primary} ${theme.textColors.primary} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`text-sm ${theme.textColors.secondary}`}>
                Step {currentStep + 1} of {steps.length}
              </div>
              <button
                onClick={handleSkip}
                className={`text-sm ${theme.textColors.muted} hover:${theme.textColors.secondary} transition-opacity`}
              >
                Skip Tour
              </button>
            </div>
            <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>{steps[currentStep].title}</h2>
            <p className={`${theme.textColors.secondary} text-sm`}>{steps[currentStep].subtitle}</p>
          </div>

          {/* Progress Bar */}
          <div className={theme.progress.background}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className={`${theme.progress.bar} h-1`}
            />
          </div>

          {/* Content */}
          <div className="p-4 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className={`${theme.borderColors.primary} border-t p-4 flex justify-between items-center flex-shrink-0`}>
            <div className={`text-sm ${theme.textColors.muted}`}>
              {currentStep + 1} / {steps.length}
            </div>
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className={`px-4 py-2 ${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className={`${theme.buttons.primary} px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2`}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Get Started
                    <Rocket className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

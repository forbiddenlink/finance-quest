'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { 
  Rocket, 
  Target, 
  BookOpen, 
  Calculator, 
  Brain, 
  CheckCircle, 
  ArrowRight,
  Star,
  Zap,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface WelcomeOnboardingProps {
  onComplete?: () => void;
}

export default function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const userProgress = useProgressStore(state => state.userProgress);
  const completeLesson = useProgressStore(state => state.completeLesson);

  // Check if user is new (no lessons completed)
  const isNewUser = userProgress.completedLessons.length === 0 && userProgress.totalTimeSpent < 300; // Less than 5 minutes

  useEffect(() => {
    if (isNewUser) {
      setIsVisible(true);
    }
  }, [isNewUser]);

  const steps = [
    {
      title: "Welcome to Finance Quest! 🎉",
      subtitle: "Your journey to financial mastery starts here",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Transform Your Financial Future?</h3>
            <p className="text-gray-600">
              Join thousands of learners who've gone from financial confusion to confidence. 
              Our proven system will teach you everything you need to know about money.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">20+</div>
              <div className="text-gray-600">Interactive Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-gray-600">Financial Calculators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600">Free Forever</div>
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
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-blue-900">Foundation Chapters</p>
                <p className="text-sm text-blue-700">Money psychology, banking, budgeting basics</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-green-900">Interactive Tools</p>
                <p className="text-sm text-green-700">Hands-on calculators for real scenarios</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-purple-900">Advanced Topics</p>
                <p className="text-sm text-purple-700">Investing, retirement, wealth building</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
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
        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            Choose your primary financial goal to get personalized recommendations:
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Target, title: "Get Out of Debt", subtitle: "Eliminate credit cards, loans, and become debt-free" },
              { icon: BookOpen, title: "Learn the Basics", subtitle: "Understand budgeting, saving, and banking fundamentals" },
              { icon: Calculator, title: "Buy a Home", subtitle: "Save for down payment and understand mortgages" },
              { icon: Star, title: "Invest & Build Wealth", subtitle: "Start investing and plan for financial independence" },
              { icon: Award, title: "Prepare for Retirement", subtitle: "Maximize 401k, IRA, and retirement planning" }
            ].map((goal, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all"
                onClick={() => {
                  // Could track user's goal selection here
                  console.log('User selected goal:', goal.title);
                }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <goal.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{goal.title}</p>
                  <p className="text-sm text-gray-600">{goal.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "You're All Set! 🚀",
      subtitle: "Ready to start your financial transformation",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Your Financial Future!</h3>
            <p className="text-gray-600">
              Your progress will be automatically saved as you complete lessons and use calculators. 
              Start with Chapter 1 to build a strong foundation.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Quick Start Recommendation:</strong>
            </p>
            <p className="text-sm text-blue-700">
              Begin with "Money Fundamentals" to understand your relationship with money, 
              then try the Paycheck Calculator to see how taxes affect your income.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/chapter1">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Start Chapter 1
              </button>
            </Link>
            <Link href="/calculators">
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
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
      completeLesson('onboarding-complete', 300); // 5 minutes
      setIsVisible(false);
      onComplete?.();
    }
  };

  const handleSkip = () => {
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
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm opacity-90">
                Step {currentStep + 1} of {steps.length}
              </div>
              <button 
                onClick={handleSkip}
                className="text-sm opacity-75 hover:opacity-100 transition-opacity"
              >
                Skip Tour
              </button>
            </div>
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-blue-100">{steps[currentStep].subtitle}</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"
            />
          </div>

          {/* Content */}
          <div className="p-6">
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
          <div className="border-t border-gray-200 p-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </div>
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
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

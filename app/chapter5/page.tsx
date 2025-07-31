'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProgress } from '@/lib/store/progressHooks';
import { Shield, Target, AlertTriangle, CheckCircle, ArrowRight, Clock, DollarSign, TrendingUp, Home, Briefcase, Heart } from 'lucide-react';
import InteractiveCard from '@/components/shared/ui/InteractiveCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import SuccessCelebration from '@/components/shared/ui/SuccessCelebration';
import { theme } from '@/lib/theme';

export default function Chapter5Page() {
  const progress = useProgress();
  const [currentLesson, setCurrentLesson] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save progress when user leaves
  useEffect(() => {
    return () => {
      if (timeSpent > 30) { // Only track if spent meaningful time
        progress.updateTimeSpent(timeSpent);
      }
    };
  }, [timeSpent, progress]);

  const lessons = [
    {
      id: 'chapter5-lesson1',
      title: 'Why Emergency Funds Matter',
      description: 'The psychology and mathematics of financial security',
      icon: Shield,
      color: 'from-red-400 to-red-600'
    },
    {
      id: 'chapter5-lesson2',
      title: 'Sizing Your Emergency Fund',
      description: '3 months vs 6 months vs 12 months - what\'s right for you?',
      icon: Target,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'chapter5-lesson3',
      title: 'Where to Keep Emergency Money',
      description: 'High-yield savings, money markets, and accessibility strategies',
      icon: DollarSign,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'chapter5-lesson4',
      title: 'Building Your Fund Strategically',
      description: 'Automation, milestones, and staying motivated during the journey',
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-600'
    }
  ];

  const isLessonCompleted = (lessonId: string) => {
    return progress.userProgress.completedLessons.includes(lessonId);
  };

  const completeLesson = (lessonId: string) => {
    if (!isLessonCompleted(lessonId)) {
      progress.completeLesson(lessonId, Math.floor(timeSpent / lessons.length));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const chapterProgress = progress.getChapterProgress(5);
  const isChapterUnlocked = progress.isChapterUnlocked(5);

  if (!isChapterUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-8 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h2 className="text-2xl font-bold text-white mb-4">Chapter 5 Locked</h2>
          <p className="text-gray-300 mb-6">
            Complete Chapter 4 with 80%+ quiz score to unlock Emergency Funds & Financial Safety
          </p>
          <Link href="/chapter4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              Continue Chapter 4
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <SuccessCelebration
        show={showCelebration}
        title="Lesson Complete!"
        message="You&apos;re building financial security!"
        onComplete={() => setShowCelebration(false)}
        type="lesson"
      />

      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Chapter 5: Emergency Funds & Financial Safety</h1>
                <p className="text-sm text-gray-300">Building your financial fortress against life&apos;s uncertainties</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressRing progress={chapterProgress} size={50} />
              <span className="text-sm font-medium text-gray-300">{chapterProgress}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Chapter Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Your Financial Safety Net</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Emergency funds aren&apos;t just savings—they&apos;re peace of mind, freedom from debt cycles, and the foundation
              of every successful financial plan. Learn how to build and maintain the safety net that protects your dreams.
            </p>
          </div>

          {/* Crisis Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-600" />
              <div className="text-2xl font-bold text-red-700">40%</div>
              <div className="text-sm text-red-600">of Americans can&apos;t cover a $400 emergency</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <div className="text-2xl font-bold text-orange-700">78%</div>
              <div className="text-sm text-orange-600">live paycheck to paycheck</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 text-center">
              <Shield className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <div className="text-2xl font-bold text-green-700">$1,000</div>
              <div className="text-sm text-green-600">minimum emergency fund recommended</div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">What You&apos;ll Master in This Chapter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 ${theme.textColors.accent} mt-0.5 flex-shrink-0`} />
                <div>
                  <div className="font-medium text-white">Emergency Fund Psychology</div>
                  <div className="text-sm text-gray-300">Why your brain fights saving and how to overcome it</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 ${theme.textColors.accent} mt-0.5 flex-shrink-0`} />
                <div>
                  <div className="font-medium text-white">Optimal Fund Sizing</div>
                  <div className="text-sm text-gray-300">Calculate the perfect amount for your situation</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 ${theme.textColors.accent} mt-0.5 flex-shrink-0`} />
                <div>
                  <div className="font-medium text-white">High-Yield Storage Strategies</div>
                  <div className="text-sm text-gray-300">Where to keep emergency money for growth and access</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className={`w-5 h-5 ${theme.textColors.accent} mt-0.5 flex-shrink-0`} />
                <div>
                  <div className="font-medium text-white">Automated Building Systems</div>
                  <div className="text-sm text-gray-300">Set it and forget it approaches to steady growth</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {lessons.map((lesson, index) => {
            const Icon = lesson.icon;
            const completed = isLessonCompleted(lesson.id);
            const isActive = currentLesson === index + 1;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setCurrentLesson(index + 1);
                  if (!completed) {
                    setTimeout(() => completeLesson(lesson.id), 2000);
                  }
                }}
                className="cursor-pointer"
              >
                <InteractiveCard
                  className={`h-full ${isActive ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${lesson.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{lesson.title}</h3>
                        <p className="text-sm text-gray-300 mt-1">{lesson.description}</p>
                      </div>
                      {completed && <CheckCircle className={`w-6 h-6 ${theme.textColors.accent} flex-shrink-0`} />}
                    </div>

                    {/* Lesson Content Preview */}
                    <div className="space-y-3 text-sm text-gray-300">
                      {index === 0 && (
                        <>
                          <div className="font-medium text-amber-400">🧠 The Scarcity Trap</div>
                          <p>Learn why your brain sees emergency funds as &quot;wasted&quot; money and how to reframe this thinking.</p>
                          <div className="font-medium text-amber-400">💰 Real Cost of No Safety Net</div>
                          <p>Calculate how much debt cycles and financial stress actually cost you annually.</p>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <div className="font-medium text-blue-700">📊 Personal Risk Assessment</div>
                          <p>Evaluate your job security, health, dependents, and income stability.</p>
                          <div className="font-medium text-blue-700">🎯 The Right Amount Formula</div>
                          <p>3-12 months of expenses: here&apos;s how to calculate your optimal target.</p>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <div className="font-medium text-green-700">🏦 High-Yield Options</div>
                          <p>Online banks, money market accounts, and CDs for emergency funds.</p>
                          <div className="font-medium text-green-700">⚡ Accessibility Balance</div>
                          <p>How to earn 4%+ while keeping money available within 24-48 hours.</p>
                        </>
                      )}
                      {index === 3 && (
                        <>
                          <div className="font-medium text-purple-700">🤖 Automation Strategies</div>
                          <p>Set up automatic transfers and use &quot;pay yourself first&quot; principles.</p>
                          <div className="font-medium text-purple-700">🏆 Milestone Motivation</div>
                          <p>Stay motivated with micro-goals and celebration strategies.</p>
                        </>
                      )}
                    </div>

                    {isActive && !completed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg"
                      >
                        <div className={`flex items-center gap-2 ${theme.textColors.accent}`}>
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">Reading... (+2 minutes)</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </InteractiveCard>
              </motion.div>
            );
          })}
        </div>

        {/* Real-World Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-6">Emergency Fund Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm rounded-lg p-6">
              <Briefcase className={`w-8 h-8 ${theme.textColors.accent} mb-4`} />
              <h4 className={`font-semibold ${theme.textColors.accent} mb-2`}>Sarah&apos;s Job Loss Recovery</h4>
              <p className="text-sm text-gray-300">
                With 6 months of expenses saved, Sarah took time to find the right job instead of accepting the first offer.
                Result: 30% salary increase and better benefits.
              </p>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm rounded-lg p-6">
              <Heart className="w-8 h-8 text-amber-400 mb-4" />
              <h4 className="font-semibold text-amber-300 mb-2">Mike&apos;s Medical Emergency</h4>
              <p className="text-sm text-gray-300">
                Unexpected surgery cost $15,000. His emergency fund covered the deductible and lost income during recovery,
                avoiding bankruptcy and debt.
              </p>
            </div>
            <div className="bg-slate-500/20 border border-slate-500/30 backdrop-blur-sm rounded-lg p-6">
              <Home className="w-8 h-8 text-slate-400 mb-4" />
              <h4 className="font-semibold text-slate-300 mb-2">Lisa&apos;s Home Opportunity</h4>
              <p className="text-sm text-gray-300">
                When her dream home appeared, Lisa used part of her emergency fund for a down payment,
                then quickly rebuilt it. No regrets—emergency funds provide options.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Fund Calculator Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">Ready to Calculate Your Emergency Fund?</h3>
            <p className="text-gray-300 mb-6">
              Use our Emergency Fund Calculator to determine your optimal target and create a savings plan.
            </p>
            <Link href="/calculators/emergency-fund">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Target className="w-5 h-5" />
                Calculate My Emergency Fund
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Chapter Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/chapter4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 border border-white/20 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 hover:text-white transition-colors backdrop-blur-sm"
            >
              ← Previous Chapter
            </motion.button>
          </Link>

          <Link href="/assessment">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-blue-600 transition-colors flex items-center gap-2"
            >
              Take Chapter 5 Quiz
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}

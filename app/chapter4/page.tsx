'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  AlertTriangle,
  TrendingDown,
  Calculator,
  CheckCircle,
  Lock,
  Target,
  Brain
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useEnhancedProgress } from '@/lib/store/progressHooks';
import SuccessCelebration from '@/components/shared/ui/SuccessCelebration';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  completed: boolean;
}

export default function Chapter4Page() {
  const router = useRouter();
  const progress = useEnhancedProgress();
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const isUnlocked = progress.isChapterUnlocked(4);
  const chapterProgress = progress.getChapterProgress(4);

  const lessons: Lesson[] = [
    {
      id: 'chapter4-credit-basics',
      title: 'Understanding Credit Scores',
      description: 'Learn how credit scores work and why they matter for your financial future.',
      duration: '8 min',
      icon: <CreditCard className="w-6 h-6" />,
      completed: progress.userProgress.completedLessons.includes('chapter4-credit-basics'),
      content: <CreditBasicsLesson />
    },
    {
      id: 'chapter4-debt-types',
      title: 'Types of Debt: Good vs Bad',
      description: 'Understand the difference between productive debt and dangerous debt.',
      duration: '10 min',
      icon: <AlertTriangle className="w-6 h-6" />,
      completed: progress.userProgress.completedLessons.includes('chapter4-debt-types'),
      content: <DebtTypesLesson />
    },
    {
      id: 'chapter4-debt-strategy',
      title: 'Debt Elimination Strategies',
      description: 'Master the debt snowball and avalanche methods for becoming debt-free.',
      duration: '12 min',
      icon: <TrendingDown className="w-6 h-6" />,
      completed: progress.userProgress.completedLessons.includes('chapter4-debt-strategy'),
      content: <DebtStrategyLesson />
    },
    {
      id: 'chapter4-credit-building',
      title: 'Building and Maintaining Credit',
      description: 'Practical strategies for building excellent credit over time.',
      duration: '15 min',
      icon: <TrendingDown className="w-6 h-6" />,
      completed: progress.userProgress.completedLessons.includes('chapter4-credit-building'),
      content: <CreditBuildingLesson />
    }
  ];

  const completeLesson = (lessonId: string) => {
    const timeSpent = Math.floor(Math.random() * 600) + 300; // 5-15 minutes simulation
    progress.completeLesson(lessonId, timeSpent);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    setCurrentLesson(null);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md text-center"
        >
          <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Chapter 4 Locked</h1>
          <p className="text-gray-300 mb-6">
            Complete Chapter 3 quiz with 80%+ score to unlock Credit & Debt Management.
          </p>
          <button
            onClick={() => router.push('/chapter3')}
            className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors"
          >
            Return to Chapter 3
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Success Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <SuccessCelebration
            show={showCelebration}
            title="Lesson Complete!"
            message="Great job learning about credit and debt! 🎉"
          />
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200 to-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-yellow-200 to-red-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <CreditCard className="w-8 h-8 text-amber-400" />
            <span className="text-lg font-semibold text-white">Chapter 4</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-blue-400 to-slate-400 bg-clip-text text-transparent mb-4">
            Credit & Debt Management
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Master the critical skills of managing credit and eliminating debt to build a strong financial foundation.
          </p>

          {/* Progress Bar */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Chapter Progress</span>
              <span className="text-sm font-bold text-amber-400">{chapterProgress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${chapterProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-amber-500 to-blue-500 h-3 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Lesson Selection or Content */}
        <AnimatePresence mode="wait">
          {currentLesson ? (
            <motion.div
              key="lesson-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentLesson(null)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  ← Back to Lessons
                </button>
                <button
                  onClick={() => completeLesson(currentLesson)}
                  className="bg-amber-500 text-white px-6 py-2 rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete Lesson
                </button>
              </div>

              {lessons.find(l => l.id === currentLesson)?.content}
            </motion.div>
          ) : (
            <motion.div
              key="lesson-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 ${lesson.completed ? 'ring-2 ring-amber-500' : 'hover:shadow-xl'
                    }`}
                  onClick={() => setCurrentLesson(lesson.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${lesson.completed ? 'bg-amber-500/20 text-amber-400' : `bg-amber-500/10 ${theme.textColors.accent}`}`}>
                        {lesson.completed ? <CheckCircle className="w-6 h-6" /> : lesson.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{lesson.title}</h3>
                        <p className="text-sm text-gray-300">{lesson.duration}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{lesson.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${lesson.completed
                      ? 'bg-amber-500/20 text-amber-300'
                      : `bg-amber-500/10 ${theme.textColors.accent}`
                      }`}>
                      {lesson.completed ? 'Completed' : 'Start Lesson'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chapter 4 Quiz (appears when all lessons complete) */}
        {lessons.every(lesson => lesson.completed) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-r from-amber-500 to-blue-500 rounded-3xl p-8 text-white text-center"
          >
            <Target className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready for Chapter 4 Quiz!</h2>
            <p className="text-lg mb-6">
              Test your knowledge of credit management and debt elimination strategies.
            </p>
            <button
              onClick={() => router.push('/chapter4/quiz')}
              className="bg-gradient-to-r from-amber-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-blue-600 transition-colors"
            >
              Take Chapter 4 Quiz
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Lesson Components
function CreditBasicsLesson() {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">Understanding Credit Scores</h2>

      <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg p-4">
        <h3 className="text-xl font-semibold text-blue-300 mb-2">What You&apos;ll Learn</h3>
        <ul className="list-disc list-inside text-blue-400 space-y-1">
          <li>How credit scores are calculated</li>
          <li>The 5 factors that affect your score</li>
          <li>Credit score ranges and their meanings</li>
          <li>How to check your credit for free</li>
        </ul>
      </div>

      <h3 className="text-2xl font-semibold text-white mb-4">What is a Credit Score?</h3>
      <p className="text-gray-300 mb-6">
        A credit score is a three-digit number (typically 300-850) that represents your creditworthiness.
        Think of it as your financial report card that lenders use to decide whether to approve you for
        loans and at what interest rate.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-green-300 mb-3">Excellent Credit (740+)</h4>
          <ul className="text-green-400 space-y-2">
            <li>• Best interest rates available</li>
            <li>• Easy loan approvals</li>
            <li>• Premium credit card offers</li>
            <li>• Lower insurance premiums</li>
          </ul>
        </div>

        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-red-300 mb-3">Poor Credit (580 or below)</h4>
          <ul className="text-red-400 space-y-2">
            <li>• High interest rates</li>
            <li>• Loan rejections common</li>
            <li>• Security deposits required</li>
            <li>• Limited financial options</li>
          </ul>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-white mb-4">The 5 Credit Score Factors</h3>

      <div className="space-y-6">
        <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-blue-300">Payment History</h4>
            <span className="bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">35%</span>
          </div>
          <p className="text-gray-300">Your track record of making payments on time. Late payments hurt your score significantly.</p>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-blue-300">Credit Utilization</h4>
            <span className="bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">30%</span>
          </div>
          <p className="text-gray-300">How much of your available credit you&apos;re using. Keep this below 30%, ideally under 10%.</p>
        </div>

        <div className="bg-amber-500/20 border border-amber-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-amber-300">Length of Credit History</h4>
            <span className="bg-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">15%</span>
          </div>
          <p className="text-gray-300">How long you&apos;ve had credit accounts. Older accounts generally help your score.</p>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-blue-300">Credit Mix</h4>
            <span className="bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">10%</span>
          </div>
          <p className="text-gray-300">The variety of credit types you have (credit cards, car loans, mortgages, etc.).</p>
        </div>

        <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-red-300">New Credit</h4>
            <span className="bg-red-500/30 text-red-300 px-3 py-1 rounded-full text-sm font-medium">10%</span>
          </div>
          <p className="text-gray-300">Recent credit inquiries and newly opened accounts. Too many in a short time can hurt your score.</p>
        </div>
      </div>

      <div className="bg-amber-500/20 border border-amber-500/30 backdrop-blur-xl rounded-xl p-6 mt-8">
        <h3 className="text-xl font-semibold text-amber-300 mb-3">💡 Pro Tip</h3>
        <p className="text-gray-300">
          You can check your credit score for free through services like Credit Karma, your bank&apos;s app,
          or annualcreditreport.com for your full credit reports from all three bureaus.
        </p>
      </div>
    </div>
  );
}

function DebtTypesLesson() {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">Types of Debt: Good vs Bad</h2>

      <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl p-6 mb-8 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-300 mb-2">Key Concepts</h3>
        <ul className="list-disc list-inside text-blue-200 space-y-1">
          <li>Understanding productive vs. destructive debt</li>
          <li>How interest rates affect your financial future</li>
          <li>Smart borrowing strategies</li>
          <li>When to avoid debt entirely</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-green-400" />
            <h3 className="text-2xl font-semibold text-green-300">Good Debt</h3>
          </div>

          <p className="text-blue-700 mb-4">
            Debt that helps you build wealth or increase income over time.
          </p>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">🏠 Mortgages</h4>
              <p className="text-gray-300 text-sm">Real estate typically appreciates over time and provides tax benefits.</p>
              <p className="text-blue-400 text-sm font-medium">Typical Rate: 3-7%</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">🎓 Student Loans</h4>
              <p className="text-gray-300 text-sm">Education increases earning potential over your lifetime.</p>
              <p className="text-blue-400 text-sm font-medium">Typical Rate: 3-8%</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">💼 Business Loans</h4>
              <p className="text-gray-300 text-sm">Investing in income-generating business opportunities.</p>
              <p className="text-blue-400 text-sm font-medium">Typical Rate: 4-10%</p>
            </div>
          </div>
        </div>

        <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-xl rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <h3 className="text-2xl font-semibold text-red-300">Bad Debt</h3>
          </div>

          <p className="text-gray-300 mb-4">
            Debt for purchases that lose value and don&apos;t generate income.
          </p>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">💳 Credit Cards</h4>
              <p className="text-gray-300 text-sm">High interest on consumer purchases that depreciate quickly.</p>
              <p className="text-red-400 text-sm font-medium">Typical Rate: 15-25%</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">🚗 Car Loans</h4>
              <p className="text-gray-300 text-sm">Vehicles depreciate rapidly, especially new cars.</p>
              <p className="text-red-400 text-sm font-medium">Typical Rate: 4-12%</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">💸 Payday Loans</h4>
              <p className="text-gray-300 text-sm">Extremely high-cost short-term loans that trap borrowers.</p>
              <p className="text-red-400 text-sm font-medium">Typical Rate: 300-400%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/20 border border-amber-500/30 backdrop-blur-xl rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-amber-300 mb-4">The Interest Rate Rule</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">0-8%</div>
            <p className="text-sm text-gray-300">Generally acceptable interest rates for productive debt</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400 mb-2">8-15%</div>
            <p className="text-sm text-gray-300">Proceed with caution - pay off quickly</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-2">15%+</div>
            <p className="text-sm text-gray-300">Emergency priority - eliminate immediately</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-xl p-6">
        <h3 className="text-xl font-semibold text-blue-300 mb-3">🎯 Action Steps</h3>
        <ol className="list-decimal list-inside text-gray-300 space-y-2">
          <li>List all your current debts with interest rates</li>
          <li>Categorize each debt as &quot;good&quot; or &quot;bad&quot;</li>
          <li>Prioritize paying off bad debt with highest interest rates first</li>
          <li>Consider if any good debt could be refinanced at lower rates</li>
          <li>Avoid taking on new bad debt unless absolutely necessary</li>
        </ol>
      </div>
    </div>
  );
}

function DebtStrategyLesson() {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">Debt Elimination Strategies</h2>

      <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl p-6 mb-8 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-300 mb-2">Strategic Approaches</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Debt Snowball vs. Debt Avalanche methods</li>
          <li>Calculating which strategy saves more money</li>
          <li>Psychological factors in debt repayment</li>
          <li>Creating a sustainable payment plan</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-semibold text-blue-800">Debt Snowball</h3>
          </div>

          <p className="text-blue-700 mb-4 font-medium">
            Pay minimums on all debts, then attack the SMALLEST balance first.
          </p>

          <div className="space-y-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">✅ Pros</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Quick wins build momentum</li>
                <li>• Psychologically motivating</li>
                <li>• Simplifies your debt list faster</li>
                <li>• Great for behavior change</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">❌ Cons</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• May pay more interest overall</li>
                <li>• Mathematically suboptimal</li>
                <li>• Takes longer to save money</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-500/20 border border-slate-500/30 backdrop-blur-sm rounded-lg p-3 mt-4">
            <p className="text-slate-300 text-sm font-medium">
              Best for: People who need motivation and quick wins to stay on track.
            </p>
          </div>
        </div>

        <div className="bg-slate-500/20 border border-slate-500/30 backdrop-blur-xl rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-slate-600" />
            <h3 className="text-2xl font-semibold text-slate-800">Debt Avalanche</h3>
          </div>

          <p className="text-slate-700 mb-4 font-medium">
            Pay minimums on all debts, then attack the HIGHEST interest rate first.
          </p>

          <div className="space-y-3">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">✅ Pros</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Saves the most money</li>
                <li>• Mathematically optimal</li>
                <li>• Reduces total interest paid</li>
                <li>• Faster debt elimination</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">❌ Cons</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Slower initial progress</li>
                <li>• Requires more discipline</li>
                <li>• Less psychological reward</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm rounded-lg p-3 mt-4">
            <p className="text-blue-300 text-sm font-medium">
              Best for: Disciplined people focused on saving money and math-based approaches.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-500/20 border border-slate-500/30 backdrop-blur-xl rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-300 mb-4">Example Comparison</h3>
        <p className="text-gray-300 mb-4">Let&apos;s say you have these debts and $500 extra per month to pay them off:</p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-red-300">Credit Card A</h4>
            <p className="text-2xl font-bold text-red-400">$2,000</p>
            <p className="text-sm text-gray-300">22% APR, $40 minimum</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-red-300">Credit Card B</h4>
            <p className="text-2xl font-bold text-red-400">$5,000</p>
            <p className="text-sm text-gray-300">18% APR, $100 minimum</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-blue-300">Car Loan</h4>
            <p className="text-2xl font-bold text-blue-400">$8,000</p>
            <p className="text-sm text-gray-300">6% APR, $200 minimum</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-purple-100 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Snowball Order</h4>
            <ol className="text-purple-700 text-sm space-y-1">
              <li>1. Credit Card A ($2,000) ← smallest</li>
              <li>2. Credit Card B ($5,000)</li>
              <li>3. Car Loan ($8,000)</li>
            </ol>
            <p className="text-purple-600 text-sm mt-3 font-medium">
              Total interest paid: ~$2,850
            </p>
          </div>

          <div className="bg-green-100 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Avalanche Order</h4>
            <ol className="text-green-700 text-sm space-y-1">
              <li>1. Credit Card A (22%) ← highest rate</li>
              <li>2. Credit Card B (18%)</li>
              <li>3. Car Loan (6%)</li>
            </ol>
            <p className="text-green-600 text-sm mt-3 font-medium">
              Total interest paid: ~$2,650
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-3">🎯 Your Action Plan</h3>
        <ol className="list-decimal list-inside text-yellow-700 space-y-2">
          <li>List all debts with balances, interest rates, and minimum payments</li>
          <li>Choose your strategy based on your personality (motivation vs. math)</li>
          <li>Calculate how much extra you can pay toward debt each month</li>
          <li>Make minimum payments on all debts except your target debt</li>
          <li>Throw every extra dollar at your target debt until it&apos;s gone</li>
          <li>When one debt is paid off, roll that payment to the next target</li>
          <li>Celebrate each victory to maintain motivation!</li>
        </ol>
      </div>
    </div>
  );
}

function CreditBuildingLesson() {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="text-3xl font-bold text-white mb-6">Building and Maintaining Credit</h2>

      <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl p-6 mb-8 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-300 mb-2">Credit Building Mastery</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>How to establish credit from scratch</li>
          <li>Advanced strategies for improving your score</li>
          <li>Maintaining excellent credit long-term</li>
          <li>Common mistakes that hurt your score</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">No Credit</div>
          <p className="text-red-700 text-sm mb-4">Starting from scratch</p>
          <ul className="text-left text-red-700 text-sm space-y-1">
            <li>• Secured credit card</li>
            <li>• Become authorized user</li>
            <li>• Credit-builder loans</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">Fair Credit</div>
          <p className="text-yellow-700 text-sm mb-4">580-669 score range</p>
          <ul className="text-left text-yellow-700 text-sm space-y-1">
            <li>• Pay down credit cards</li>
            <li>• Request credit limit increases</li>
            <li>• Never miss payments</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">Excellent</div>
          <p className="text-green-700 text-sm mb-4">740+ score range</p>
          <ul className="text-left text-green-700 text-sm space-y-1">
            <li>• Maintain low utilization</li>
            <li>• Monitor credit reports</li>
            <li>• Optimize credit mix</li>
          </ul>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-white mb-4">The Credit Building Timeline</h3>

      <div className="space-y-6 mb-8">
        <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-blue-300">Month 1-3: Foundation</h4>
            <span className="bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm">Setup</span>
          </div>
          <ul className="text-gray-300 space-y-1">
            <li>• Open your first credit account (secured card if needed)</li>
            <li>• Set up automatic payments for the full balance</li>
            <li>• Keep utilization below 30%</li>
          </ul>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-blue-300">Month 6-12: Building</h4>
            <span className="bg-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-sm">Growth</span>
          </div>
          <ul className="text-gray-300 space-y-1">
            <li>• Perfect payment history established</li>
            <li>• Consider a second credit card</li>
            <li>• Request credit limit increases</li>
          </ul>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-blue-300">Year 2+: Optimization</h4>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Mastery</span>
          </div>
          <ul className="text-gray-700 space-y-1">
            <li>• Score typically reaches 700+</li>
            <li>• Qualify for premium credit cards</li>
            <li>• Build diverse credit mix (car loan, mortgage)</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Advanced Credit Strategies</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">🎯 Utilization Optimization</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Keep total utilization under 10%</li>
              <li>• Consider multiple small payments</li>
              <li>• Pay before statement close date</li>
              <li>• Request credit limit increases every 6 months</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">📊 Score Monitoring</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Check credit reports quarterly</li>
              <li>• Dispute any errors immediately</li>
              <li>• Use free monitoring services</li>
              <li>• Track score changes monthly</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-red-800 mb-3">⚠️ Credit Killers to Avoid</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="text-red-700 space-y-2">
            <li>• Late payments (even 1 day late)</li>
            <li>• Maxing out credit cards</li>
            <li>• Closing old credit accounts</li>
            <li>• Applying for too much credit at once</li>
          </ul>
          <ul className="text-red-700 space-y-2">
            <li>• Co-signing for risky borrowers</li>
            <li>• Ignoring credit report errors</li>
            <li>• Using credit for cash advances</li>
            <li>• Making only minimum payments</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-xl p-6">
        <h3 className="text-xl font-semibold text-green-300 mb-3">🏆 Your Credit Action Plan</h3>
        <ol className="list-decimal list-inside text-green-700 space-y-2">
          <li>Check your current credit score and report</li>
          <li>Set up automatic payments for all credit accounts</li>
          <li>Calculate your current utilization ratio</li>
          <li>If over 30%, pay down balances or request limit increases</li>
          <li>Set a calendar reminder to check your credit quarterly</li>
          <li>Consider what additional credit mix would benefit you</li>
          <li>Create a plan to reach your target credit score</li>
        </ol>
      </div>
    </div>
  );
}

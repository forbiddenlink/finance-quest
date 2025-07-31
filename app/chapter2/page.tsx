'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import BankingFundamentalsLesson from '@/components/chapters/fundamentals/lessons/BankingFundamentalsLesson';
import BankingFundamentalsQuiz from '@/components/chapters/fundamentals/assessments/BankingFundamentalsQuiz';
import SavingsCalculator from '@/components/chapters/fundamentals/calculators/SavingsCalculator';

export default function Chapter2Page() {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { userProgress, completeLesson, recordQuizScore } = useProgressStore();

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleLessonComplete = () => {
    setLessonCompleted(true);
    completeLesson('chapter2-lesson', 15);
  };

  const handleQuizComplete = (score: number) => {
    recordQuizScore('chapter2-quiz', score, 10);
    // Quiz completion advances chapter automatically in Zustand store
  };

  return (
    <motion.div
      className={theme.backgrounds.primary}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-2`}>
                Chapter 2: Banking & Account Fundamentals
              </h1>
              <p className={`text-xl ${theme.textColors.secondary}`}>
                Master the foundation of personal banking and account optimization
              </p>
            </div>

            {userProgress.completedLessons.includes('chapter2-lesson') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-amber-400"
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className={`mb-8 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.spacing.sm} shadow-lg`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`${theme.typography.small} font-medium ${theme.textColors.secondary}`}>Chapter Progress</span>
            <span className={`${theme.typography.small} ${theme.textColors.muted}`}>
              {currentSection === 'lesson' ? '1/3' :
                currentSection === 'calculator' ? '2/3' : '3/3'}
            </span>
          </div>
          <div className={`w-full ${theme.progress.background} rounded-full h-2`}>
            <motion.div
              className={theme.progress.bar}
              initial={{ width: '0%' }}
              animate={{
                width: currentSection === 'lesson' ? '33%' :
                  currentSection === 'calculator' ? '66%' : '100%'
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className={`flex space-x-1 ${theme.backgrounds.cardHover} border ${theme.borderColors.muted} p-1 rounded-lg shadow-lg mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { key: 'lesson', label: 'Learn', icon: '📚' },
            { key: 'calculator', label: 'Practice', icon: '🧮' },
            { key: 'quiz', label: 'Test', icon: '✅' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setCurrentSection(tab.key as 'lesson' | 'calculator' | 'quiz')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${currentSection === tab.key
                ? `${theme.buttons.primary}`
                : `${theme.textColors.muted} hover:${theme.textColors.primary} hover:${theme.backgrounds.cardHover}`
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={tab.key === 'calculator' && !lessonCompleted}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          key={currentSection}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentSection === 'lesson' && (
            <BankingFundamentalsLesson onComplete={handleLessonComplete} />
          )}

          {currentSection === 'calculator' && (
            <SavingsCalculator />
          )}

          {currentSection === 'quiz' && (
            <BankingFundamentalsQuiz onComplete={handleQuizComplete} />
          )}
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/chapter1"
            className={`inline-flex items-center px-6 py-3 ${theme.buttons.secondary} rounded-lg transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Chapter
          </Link>

          {userProgress.currentChapter > 2 && (
            <Link
              href="/chapter3"
              className={`inline-flex items-center px-6 py-3 ${theme.buttons.primary} rounded-lg transition-colors`}
            >
              Next Chapter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import EmergencyFundsLesson from '@/components/chapters/fundamentals/lessons/EmergencyFundsLesson';
import EmergencyFundCalculator from '@/components/shared/calculators/EmergencyFundCalculator';

export default function Chapter4Page() {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { userProgress, completeLesson } = useProgressStore();

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
    completeLesson('chapter5-lesson', 20);
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
            className={`inline-flex items-center ${theme.textColors.primary} hover:${theme.textColors.secondary} mb-4 transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-2`}>
                Chapter 4: Emergency Funds & Financial Safety
              </h1>
              <p className={`text-xl ${theme.textColors.secondary}`}>
                Build your financial fortress against life&apos;s uncertainties and unexpected challenges
              </p>
            </div>

            {userProgress.completedLessons.includes('chapter4-lesson') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`${theme.status.success.text}`}
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className={`mb-8 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl ${theme.spacing.sm} shadow-lg`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`${theme.typography.small} font-medium ${theme.textColors.primary}`}>Chapter Progress</span>
            <span className={`${theme.typography.small} ${theme.textColors.secondary}`}>
              {currentSection === 'lesson' ? '1/3' :
                currentSection === 'calculator' ? '2/3' : '3/3'}
            </span>
          </div>
          <div className={`w-full ${theme.progress.background} rounded-full h-2`}>
            <motion.div
              className={`${theme.progress.bar} h-2 rounded-full`}
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
          className={`flex space-x-1 ${theme.backgrounds.card} border ${theme.borderColors.primary} p-1 rounded-xl shadow-lg mb-8`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { key: 'lesson', label: 'Learn', icon: '🛡️' },
            { key: 'calculator', label: 'Practice', icon: '🧮' },
            { key: 'quiz', label: 'Test', icon: '✅' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setCurrentSection(tab.key as 'lesson' | 'calculator' | 'quiz')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${currentSection === tab.key
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
            <EmergencyFundsLesson onComplete={handleLessonComplete} />
          )}

          {currentSection === 'calculator' && (
            <EmergencyFundCalculator />
          )}

          {currentSection === 'quiz' && (
            <div>
              <div className={`mb-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
                <h3 className={`font-semibold ${theme.textColors.secondary} mb-2`}>Knowledge Check</h3>
                <p className={theme.textColors.muted}>
                  Test your understanding of emergency funds and financial safety. You need 80% to unlock Chapter 6.
                </p>
              </div>
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg p-8 text-center`}>
                <p className={`${theme.textColors.muted} mb-4`}>Chapter 5 Quiz coming soon!</p>
                <p className={`text-sm ${theme.textColors.muted}`}>Complete the lesson to prepare for the assessment.</p>
              </div>
            </div>
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
            href="/chapter4"
            className={`inline-flex items-center px-6 py-3 ${theme.buttons.secondary} rounded-lg transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Chapter
          </Link>

          {userProgress.currentChapter > 5 && (
            <Link
              href="/chapter6"
              className={`inline-flex items-center px-6 py-3 ${theme.buttons.primary} rounded-lg transition-colors shadow-lg`}
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

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useProgress, useProgressActions } from '@/lib/context/ProgressContext';
import IncomeCareerLesson from '@/components/chapters/fundamentals/lessons/IncomeCareerLesson';
import IncomeCareerQuiz from '@/components/chapters/fundamentals/assessments/IncomeCareerQuiz';
import SalaryNegotiationCalculator from '@/components/chapters/fundamentals/calculators/SalaryNegotiationCalculator';

export default function Chapter3Page() {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { state } = useProgress();
  const { completeLesson, recordQuizScore, advanceChapter, updateTimeSpent } = useProgressActions();

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
    completeLesson('chapter3-lesson');
    updateTimeSpent(20);
  };

  const handleQuizComplete = (score: number) => {
    recordQuizScore('chapter3', score);
    if (score >= 0.85) {
      advanceChapter();
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
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
            className="inline-flex items-center text-green-600 hover:text-green-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Chapter 3: Income & Career Finance
              </h1>
              <p className="text-xl text-gray-600">
                Maximize your earning potential and career financial strategy
              </p>
            </div>

            {state.userProgress.completedLessons.includes('chapter3-lesson') && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-8 bg-white rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Chapter Progress</span>
            <span className="text-sm text-gray-500">
              {currentSection === 'lesson' ? '1/3' :
                currentSection === 'calculator' ? '2/3' : '3/3'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
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
          className="flex space-x-1 bg-white p-1 rounded-lg shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { key: 'lesson', label: 'Learn', icon: '💼' },
            { key: 'calculator', label: 'Practice', icon: '💰' },
            { key: 'quiz', label: 'Test', icon: '🎯' }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setCurrentSection(tab.key as 'lesson' | 'calculator' | 'quiz')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${currentSection === tab.key
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
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
            <IncomeCareerLesson onComplete={handleLessonComplete} />
          )}

          {currentSection === 'calculator' && (
            <SalaryNegotiationCalculator />
          )}

          {currentSection === 'quiz' && (
            <IncomeCareerQuiz onComplete={handleQuizComplete} />
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
            href="/chapter2"
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Chapter
          </Link>

          {state.userProgress.currentChapter > 3 && (
            <Link
              href="/chapter4"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-colors"
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

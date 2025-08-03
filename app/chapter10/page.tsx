'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import ProgressRing from '@/components/shared/ui/ProgressRing';
import AdvancedTaxStrategiesLessonEnhanced from '@/components/chapters/fundamentals/lessons/AdvancedTaxStrategiesLessonEnhanced';
import AdvancedTaxStrategiesQuizEnhanced from '@/components/chapters/fundamentals/quizzes/AdvancedTaxStrategiesQuizEnhanced';
import TaxOptimizationCalculator from '@/components/shared/calculators/TaxOptimizationCalculator';
import {
  Calculator,
  BookOpen,
  Target,
  Trophy,
  Lock,
  CheckCircle,
  Star,
  DollarSign,
  Percent,
  TrendingUp,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Chapter10() {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [calculatorUsed, setCalculatorUsed] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const { 
    recordQuizScore, 
    recordCalculatorUsage,
    userProgress,
    isChapterUnlocked,
    markChapterComplete
  } = useProgressStore();

  const chapterNumber = 10;
  const isUnlocked = isChapterUnlocked(chapterNumber);

  useEffect(() => {
    // Check if lesson was previously completed
    if (userProgress.completedLessons.includes('advanced-tax-strategies-enhanced-lesson')) {
      setLessonCompleted(true);
    }

    // Check if quiz was previously completed
    const quizScore = userProgress.quizScores['chapter10-advanced-tax-quiz'];
    if (quizScore && quizScore >= 80) { // 80% passing threshold
      setQuizCompleted(true);
      setQuizScore(Math.round(quizScore * 10 / 100)); // Convert percentage back to score out of 10
    }

    // Check if calculator was used
    if (userProgress.calculatorUsage['tax-optimization-calculator']) {
      setCalculatorUsed(true);
    }
  }, [userProgress]);

  const handleLessonComplete = () => {
    setLessonCompleted(true);
    toast.success('Advanced Tax Strategies lesson completed! 🎯', {
      duration: 3000,
      position: 'top-center',
    });
  };

  const handleCalculatorComplete = () => {
    if (!calculatorUsed) {
      recordCalculatorUsage('tax-optimization-calculator');
      setCalculatorUsed(true);
      toast.success('Tax optimization analyzed! Great work! 📊', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const handleQuizComplete = (score: number, maxScore: number) => {
    const percentage = Math.round((score / maxScore) * 100);
    setQuizScore(score);
    
    recordQuizScore('chapter10-advanced-tax-quiz', score, maxScore);
    
    if (score >= 8) { // 80% passing
      setQuizCompleted(true);
      markChapterComplete(10); // Mark chapter as complete
      toast.success(`Chapter 10 completed! Score: ${percentage}% - Chapter 11 unlocked! 🚀`, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.error(`Score: ${percentage}%. Need 80% to pass. Review the material and try again! 📚`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const progressPercentage = () => {
    let completed = 0;
    if (lessonCompleted) completed += 40;
    if (calculatorUsed) completed += 30;
    if (quizCompleted) completed += 30;
    return completed;
  };

  const canAccessQuiz = lessonCompleted && calculatorUsed;
  const canAccessCalculator = lessonCompleted;

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
        <GradientCard variant="glass" gradient="blue" className="max-w-md w-full p-8 text-center">
          <Lock className={`w-16 h-16 ${theme.textColors.muted} mx-auto mb-4`} />
          <h1 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>
            Chapter 10: Advanced Tax Strategies
          </h1>
          <p className={`${theme.textColors.secondary} mb-6`}>
            Complete Chapter 9 with at least 80% on the quiz to unlock this chapter.
          </p>
          <div className={`text-sm ${theme.textColors.muted}`}>
            Master retirement planning strategies first, then advance to sophisticated tax optimization.
          </div>
        </GradientCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mr-4`}>
              <Shield className={`w-8 h-8 ${theme.status.info.text}`} />
            </div>
            <div className="text-left">
              <h1 className={`text-4xl font-bold ${theme.textColors.primary}`}>
                Chapter 10: Advanced Tax Strategies
              </h1>
              <p className={`${theme.textColors.secondary} text-lg`}>
                Master sophisticated tax optimization and wealth preservation strategies
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <ProgressRing progress={progressPercentage()} size={80} strokeWidth={8} />
              <p className={`text-sm ${theme.textColors.muted} mt-2`}>Chapter Progress</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                  lessonCompleted ? theme.status.success.bg : theme.backgrounds.card
                }`}>
                  {lessonCompleted ? (
                    <CheckCircle className={`w-6 h-6 ${theme.status.success.text}`} />
                  ) : (
                    <BookOpen className={`w-6 h-6 ${theme.textColors.muted}`} />
                  )}
                </div>
                <p className={`text-sm ${lessonCompleted ? theme.status.success.text : theme.textColors.muted}`}>
                  Lesson
                </p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                  calculatorUsed ? theme.status.success.bg : theme.backgrounds.card
                }`}>
                  {calculatorUsed ? (
                    <CheckCircle className={`w-6 h-6 ${theme.status.success.text}`} />
                  ) : (
                    <Calculator className={`w-6 h-6 ${theme.textColors.muted}`} />
                  )}
                </div>
                <p className={`text-sm ${calculatorUsed ? theme.status.success.text : theme.textColors.muted}`}>
                  Calculator
                </p>
              </div>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                  quizCompleted ? theme.status.success.bg : theme.backgrounds.card
                }`}>
                  {quizCompleted ? (
                    <Trophy className={`w-6 h-6 ${theme.status.success.text}`} />
                  ) : (
                    <Target className={`w-6 h-6 ${theme.textColors.muted}`} />
                  )}
                </div>
                <p className={`text-sm ${quizCompleted ? theme.status.success.text : theme.textColors.muted}`}>
                  Quiz {quizCompleted && `(${Math.round((quizScore / 10) * 100)}%)`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`flex ${theme.backgrounds.card} rounded-xl p-1 border ${theme.borderColors.primary}`}>
            <button
              onClick={() => setCurrentSection('lesson')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
                currentSection === 'lesson'
                  ? `${theme.buttons.primary} text-white`
                  : `${theme.textColors.secondary} hover:${theme.textColors.primary}`
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Lesson
            </button>
            <button
              onClick={() => setCurrentSection('calculator')}
              disabled={!canAccessCalculator}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
                currentSection === 'calculator'
                  ? `${theme.buttons.primary} text-white`
                  : canAccessCalculator
                  ? `${theme.textColors.secondary} hover:${theme.textColors.primary}`
                  : `${theme.textColors.muted} cursor-not-allowed opacity-50`
              }`}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Tax Calculator
              {!canAccessCalculator && <Lock className="w-3 h-3 ml-1" />}
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              disabled={!canAccessQuiz}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
                currentSection === 'quiz'
                  ? `${theme.buttons.primary} text-white`
                  : canAccessQuiz
                  ? `${theme.textColors.secondary} hover:${theme.textColors.primary}`
                  : `${theme.textColors.muted} cursor-not-allowed opacity-50`
              }`}
            >
              <Target className="w-4 h-4 mr-2" />
              Quiz
              {!canAccessQuiz && <Lock className="w-3 h-3 ml-1" />}
            </button>
          </div>
        </div>

        {/* Content Sections */}
        {currentSection === 'lesson' && (
          <AdvancedTaxStrategiesLessonEnhanced onComplete={handleLessonComplete} />
        )}

        {currentSection === 'calculator' && canAccessCalculator && (
          <TaxOptimizationCalculator onCalculationComplete={handleCalculatorComplete} />
        )}

        {currentSection === 'quiz' && canAccessQuiz && (
          <AdvancedTaxStrategiesQuizEnhanced onComplete={handleQuizComplete} />
        )}

        {/* Chapter Stats */}
        {(lessonCompleted || calculatorUsed || quizCompleted) && (
          <div className="mt-12">
            <GradientCard variant="glass" gradient="green" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 text-center`}>
                🎯 Chapter 10 Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <DollarSign className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2`} />
                  <p className={`text-sm ${theme.textColors.secondary}`}>Tax-Loss Harvesting</p>
                  <p className={`font-bold ${lessonCompleted ? theme.status.success.text : theme.textColors.muted}`}>
                    {lessonCompleted ? 'Mastered' : 'Locked'}
                  </p>
                </div>
                <div className="text-center">
                  <Percent className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2`} />
                  <p className={`text-sm ${theme.textColors.secondary}`}>Asset Location</p>
                  <p className={`font-bold ${lessonCompleted ? theme.status.success.text : theme.textColors.muted}`}>
                    {lessonCompleted ? 'Understood' : 'Locked'}
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className={`w-8 h-8 ${calculatorUsed ? theme.status.success.text : theme.textColors.muted} mx-auto mb-2`} />
                  <p className={`text-sm ${theme.textColors.secondary}`}>Tax Calculator</p>
                  <p className={`font-bold ${calculatorUsed ? theme.status.success.text : theme.textColors.muted}`}>
                    {calculatorUsed ? 'Used' : 'Pending'}
                  </p>
                </div>
                <div className="text-center">
                  <Star className={`w-8 h-8 ${quizCompleted ? theme.status.success.text : theme.textColors.muted} mx-auto mb-2`} />
                  <p className={`text-sm ${theme.textColors.secondary}`}>Quiz Mastery</p>
                  <p className={`font-bold ${quizCompleted ? theme.status.success.text : theme.textColors.muted}`}>
                    {quizCompleted ? `${Math.round((quizScore / 10) * 100)}%` : 'Pending'}
                  </p>
                </div>
              </div>
              
              {quizCompleted && (
                <div className="text-center mt-6 pt-6 border-t border-green-500/20">
                  <Trophy className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-3`} />
                  <h4 className={`text-lg font-bold ${theme.status.success.text} mb-2`}>
                    Advanced Tax Strategist Achieved! 🏆
                  </h4>
                  <p className={`${theme.textColors.secondary} mb-4`}>
                    You&apos;ve mastered sophisticated tax optimization strategies. Chapter 11 is now unlocked!
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className={`font-bold ${theme.textColors.primary}`}>Progress</div>
                      <div className={theme.status.success.text}>{progressPercentage()}%</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${theme.textColors.primary}`}>Tax Knowledge</div>
                      <div className={theme.status.success.text}>Expert Level</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${theme.textColors.primary}`}>Next Chapter</div>
                      <div className={theme.status.success.text}>Unlocked!</div>
                    </div>
                  </div>
                </div>
              )}
            </GradientCard>
          </div>
        )}
      </div>
    </div>
  );
}

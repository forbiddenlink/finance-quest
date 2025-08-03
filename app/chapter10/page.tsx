'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import TaxOptimizationLessonEnhanced from '@/components/chapters/fundamentals/lessons/TaxOptimizationLessonEnhanced';
import TaxOptimizationQuizEnhanced from '@/components/chapters/fundamentals/quizzes/TaxOptimizationQuizEnhanced';
import QASystem from '@/components/shared/QASystem';
import {
  BookOpen,
  Calculator,
  Brain,
  MessageCircle,
  CheckCircle,
  Lock,
  TrendingUp,
  Award,
  Target,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Chapter10Page() {
  const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz' | 'coach'>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const { 
    completeLesson, 
    recordQuizScore, 
    recordCalculatorUsage,
    isChapterUnlocked,
    getChapterProgress,
    userProgress 
  } = useProgressStore();

  // Check if this chapter is unlocked
  const isUnlocked = isChapterUnlocked(10);
  const chapterProgress = getChapterProgress(10);

  useEffect(() => {
    // Check if lesson and quiz are already completed
    const lessonCompleted = userProgress.completedLessons.includes('chapter10-lesson');
    const quizScore = userProgress.quizScores['chapter10-quiz'];
    
    setLessonCompleted(lessonCompleted);
    if (quizScore !== undefined) {
      setQuizCompleted(true);
      setQuizScore(quizScore);
    }
  }, [userProgress]);

  const handleLessonComplete = () => {
    completeLesson('chapter10-lesson', Date.now());
    setLessonCompleted(true);
    toast.success('Tax optimization lesson completed! 🎯', {
      duration: 3000,
      position: 'top-center',
    });
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    recordQuizScore('chapter10-quiz', score, totalQuestions);
    setQuizCompleted(true);
    setQuizScore(score);
    
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) {
      toast.success(`Outstanding! ${percentage}% score unlocks Chapter 11! 🏆`, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.error(`${percentage}% - Need 80% to advance. Review and retake! 📚`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const handleCalculatorUse = () => {
    recordCalculatorUsage('tax-optimizer-calculator');
  };

  if (!isUnlocked) {
    return (
      <div className={`min-h-screen ${theme.backgrounds.primary} flex items-center justify-center p-6`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`max-w-md mx-auto text-center ${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
            <CardContent className="p-8">
              <Lock className={`w-16 h-16 ${theme.textColors.muted} mx-auto mb-4`} />
              <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                Chapter 10 Locked
              </h2>
              <p className={`${theme.textColors.secondary} mb-6`}>
                Complete Chapter 9 with 80%+ quiz score to unlock Tax Optimization & Planning.
              </p>
              <Button 
                onClick={() => window.history.back()}
                className={theme.buttons.secondary}
              >
                Return to Progress
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const sectionData = {
    lesson: {
      icon: BookOpen,
      title: 'Tax Strategy Lesson',
      description: 'Master tax-advantaged accounts, deductions, and optimization strategies',
      completed: lessonCompleted
    },
    calculator: {
      icon: Calculator,
      title: 'Tax Optimizer',
      description: 'Calculate tax savings from retirement contributions and deductions',
      completed: false
    },
    quiz: {
      icon: Brain,
      title: 'Knowledge Assessment',
      description: 'Test your tax optimization understanding',
      completed: quizCompleted
    },
    coach: {
      icon: MessageCircle,
      title: 'AI Tax Coach',
      description: 'Get personalized tax planning advice',
      completed: false
    }
  };

  const progressPercentage = chapterProgress;

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${theme.backgrounds.card} border ${theme.borderColors.primary} mb-6`}>
              <Target className={`w-5 h-5 ${theme.textColors.primary} mr-2`} />
              <span className={`text-sm font-medium ${theme.textColors.primary}`}>Chapter 10</span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold ${theme.textColors.primary} mb-4`}>
              Tax Optimization & Planning
            </h1>
            <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto mb-6`}>
              Maximize your wealth through strategic tax planning, deductions, and tax-advantaged investment accounts
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${theme.textColors.secondary}`}>Chapter Progress</span>
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Achievement Badge */}
            {quizCompleted && quizScore && quizScore >= 8 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`inline-flex items-center px-4 py-2 rounded-full ${theme.status.success.bg} border ${theme.status.success.border}`}
              >
                <Award className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                <span className={`text-sm font-medium ${theme.status.success.text}`}>
                  Tax Planning Expert
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as 'lesson' | 'calculator' | 'quiz' | 'coach')}>
          {/* Navigation Tabs */}
          <TabsList className={`grid w-full grid-cols-4 mb-8 ${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
            {Object.entries(sectionData).map(([key, data]) => {
              const Icon = data.icon;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={`flex items-center gap-2 ${theme.textColors.secondary} data-[state=active]:${theme.textColors.primary}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{data.title}</span>
                  {data.completed && (
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text}`} />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Section Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(sectionData).map(([key, data]) => {
              const Icon = data.icon;
              const isActive = currentSection === key;
              const isAccessible = key === 'lesson' || 
                                 (key === 'calculator') || 
                                 (key === 'quiz' && lessonCompleted) ||
                                 (key === 'coach');
              
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      isActive 
                        ? `${theme.backgrounds.card} border-2 ${theme.borderColors.primary} shadow-lg` 
                        : `${theme.backgrounds.card} border ${theme.borderColors.primary} hover:border-slate-400`
                    } ${!isAccessible ? 'opacity-50' : ''}`}
                    onClick={() => isAccessible && setCurrentSection(key as 'lesson' | 'calculator' | 'quiz' | 'coach')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Icon className={`w-6 h-6 ${isActive ? theme.textColors.primary : theme.textColors.secondary}`} />
                        {data.completed ? (
                          <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                        ) : !isAccessible ? (
                          <Lock className={`w-5 h-5 ${theme.textColors.muted}`} />
                        ) : null}
                      </div>
                      <h3 className={`font-semibold ${theme.textColors.primary} mb-1`}>
                        {data.title}
                      </h3>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        {data.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Tab Content */}
          <TabsContent value="lesson" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                <CardContent className="p-0">
                  <TaxOptimizationLessonEnhanced onComplete={handleLessonComplete} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="calculator" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${theme.textColors.primary}`}>
                    <Calculator className="w-6 h-6" />
                    Tax Optimization Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center">
                    <Calculator className={`w-16 h-16 ${theme.textColors.muted} mx-auto mb-4`} />
                    <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-2`}>
                      Tax Optimizer Calculator
                    </h3>
                    <p className={`${theme.textColors.secondary} mb-6`}>
                      Calculate potential tax savings from retirement contributions, deductions, and strategic tax planning.
                    </p>
                    <Button 
                      onClick={() => {
                        handleCalculatorUse();
                        window.open('/calculators/tax-optimizer', '_blank');
                      }}
                      className={theme.buttons.primary}
                    >
                      Open Tax Calculator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {lessonCompleted ? (
                <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                  <CardContent className="p-0">
                    <TaxOptimizationQuizEnhanced onComplete={handleQuizComplete} />
                  </CardContent>
                </Card>
              ) : (
                <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                  <CardContent className="p-8 text-center">
                    <Lock className={`w-16 h-16 ${theme.textColors.muted} mx-auto mb-4`} />
                    <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-2`}>
                      Complete the Lesson First
                    </h3>
                    <p className={`${theme.textColors.secondary} mb-6`}>
                      Finish the tax optimization lesson to unlock the knowledge assessment.
                    </p>
                    <Button 
                      onClick={() => setCurrentSection('lesson')}
                      className={theme.buttons.primary}
                    >
                      Go to Lesson
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="coach" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${theme.textColors.primary}`}>
                    <MessageCircle className="w-6 h-6" />
                    AI Tax Planning Coach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <QASystem />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Next Chapter Teaser */}
        {quizCompleted && quizScore && quizScore >= 8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
              <CardContent className="p-6 text-center">
                <TrendingUp className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-4`} />
                <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>
                  Ready for Insurance & Risk Management!
                </h3>
                <p className={`${theme.textColors.secondary} mb-4`}>
                  You&apos;ve mastered tax optimization. Continue to Chapter 11 to learn about protecting your wealth.
                </p>
                <Button 
                  onClick={() => window.location.href = '/chapter11'}
                  className={theme.buttons.primary}
                >
                  Continue to Chapter 11
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

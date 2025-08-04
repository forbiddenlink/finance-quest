'use client';

import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import AITeachingAssistant from '@/components/shared/ai-assistant/AITeachingAssistant';
import QASystem from '@/components/shared/QASystem';
import SpacedRepetitionDashboard from '@/components/shared/ui/SpacedRepetitionDashboard';
import VoiceQA from '@/components/shared/ui/VoiceQA';
import LearningAnalyticsDashboard from '@/components/shared/ui/LearningAnalyticsDashboard';
import {
    Calculator,
    BookOpen,
    Trophy,
    ArrowLeft,
    Lock,
    CheckCircle,
    Bot,
    LucideIcon,
    Brain,
    BarChart3,
    Volume2,
    Star
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface CalculatorTab {
    id: string;
    label: string;
    icon: LucideIcon;
    component: React.ComponentType;
    description: string;
}

interface ChapterLayoutProps {
    chapterNumber: number;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    iconColor: string;
    lessonComponent: ReactNode;
    calculatorComponent: ReactNode;
    quizComponent: ReactNode;
    calculatorTitle?: string;
    calculatorDescription?: string;
    calculatorTabs?: CalculatorTab[];
    quizTitle?: string;
    quizDescription?: string;
    onLessonComplete?: () => void;
    onQuizComplete?: () => void;
    requiresPreviousChapters?: boolean;
}

export default function ChapterLayout({
    chapterNumber,
    title,
    subtitle,
    icon: Icon,
    iconColor,
    lessonComponent,
    calculatorComponent,
    quizComponent,
    calculatorTitle = "Calculator",
    calculatorDescription = "Interactive financial calculator",
    calculatorTabs,
    quizTitle = "Knowledge Quiz",
    quizDescription = "Test your understanding",
    onLessonComplete,
    onQuizComplete,
    requiresPreviousChapters = true
}: ChapterLayoutProps) {
    const { isChapterUnlocked, completeLesson, userProgress } = useProgressStore();
    const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz' | 'assistant' | 'analytics' | 'review'>('lesson');
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [activeCalculatorTab, setActiveCalculatorTab] = useState(0);

    // Check if chapter is unlocked (skip for Chapter 1)
    const isUnlocked = chapterNumber === 1 || !requiresPreviousChapters || isChapterUnlocked(chapterNumber);

    // Check if user has completed content to show advanced features
    const hasCompletedContent = userProgress.completedLessons.length > 2;
    const hasQuizScores = Object.keys(userProgress.quizScores).length > 0;

    const handleLessonComplete = () => {
        setLessonCompleted(true);
        completeLesson(`chapter${chapterNumber}-lesson`, 15);
        
        // Enhanced progress notifications with personalized encouragement
        if (chapterNumber === 1) {
            toast.success(`🎯 ${title} completed! Welcome to Finance Quest! You're building real financial skills that will last a lifetime.`, {
                duration: 6000,
                position: 'top-center',
            });
        } else if (chapterNumber === 5) {
            toast.success(`🚀 Halfway through foundational skills! You're developing serious financial confidence.`, {
                duration: 6000,
                position: 'top-center',
            });
        } else if (chapterNumber === 10) {
            toast.success(`💪 Amazing progress! You've mastered more finance than 80% of adults. Keep going!`, {
                duration: 6000,
                position: 'top-center',
            });
        } else if (chapterNumber === 17) {
            toast.success(`🏆 CONGRATULATIONS! You've completed Finance Quest and joined the financially literate minority!`, {
                duration: 8000,
                position: 'top-center',
            });
        } else {
            toast.success(`✅ Chapter ${chapterNumber} completed! Your financial knowledge is growing stronger.`, {
                duration: 4000,
                position: 'top-center',
            });
        }
        
        // Progressive feature unlocks
        if (userProgress.completedLessons.length === 2) {
            toast.success(`🧠 New feature unlocked: Review tab for spaced repetition learning!`, {
                duration: 6000,
                position: 'top-center',
            });
        } else if (hasQuizScores && !userProgress.completedLessons.includes(`chapter${chapterNumber}-lesson`)) {
            toast.success(`📊 Analytics tab unlocked! See your learning insights and patterns.`, {
                duration: 6000,
                position: 'top-center',
            });
        } else {
            toast.success(`${title} completed! 🎯`, {
                duration: 4000,
                position: 'top-center',
            });
        }
        
        onLessonComplete?.();
    };

    const handleQuizComplete = () => {
        toast.success(`Chapter ${chapterNumber} mastered! Ready for Chapter ${chapterNumber + 1}! 🎯`, {
            duration: 4000,
            position: 'top-center',
        });
        onQuizComplete?.();
    };

    // Locked state for chapters that require prerequisites
    if (!isUnlocked) {
        return (
            <div className={`min-h-screen ${theme.backgrounds.primary} flex items-center justify-center`}>
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-2xl ${theme.spacing.lg}`}
                    >
                        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                            <Lock className={`w-8 h-8 ${theme.status.info.text}`} />
                        </div>
                        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-4`}>
                            Chapter {chapterNumber}: {title}
                        </h1>
                        <p className={`${theme.textColors.muted} mb-6`}>
                            Complete the previous chapters to unlock this content.
                        </p>
                        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-xl p-4 mb-6`}>
                            <p className={`${theme.status.info.text} text-sm`}>
                                <strong>Prerequisites:</strong> Complete Chapters 1-{chapterNumber - 1} with 80%+ quiz scores
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/">
                                <Button className={theme.buttons.secondary}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Link href={`/chapter${chapterNumber - 1}`}>
                                <Button className={theme.buttons.primary}>
                                    Continue Previous Chapter
                                    <CheckCircle className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.backgrounds.primary}`}>
            {/* Sticky Header */}
            <div className={`${theme.backgrounds.header} border-b ${theme.borderColors.primary} sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className={`flex items-center ${theme.textColors.primary} hover:${theme.textColors.primary} transition-colors`}>
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                        <div className="flex items-center space-x-4">
                            {/* Progress Indicator */}
                            <div className={`${theme.backgrounds.cardHover} px-3 py-2 rounded-lg border ${theme.borderColors.primary}`}>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${lessonCompleted ? theme.status.success.bg : theme.status.warning.bg}`}></div>
                                    <span className={`${theme.textColors.secondary} text-sm`}>
                                        {lessonCompleted ? 'Ready for Quiz' : 'In Progress'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={`${theme.status.info.bg} px-3 py-1 rounded-full`}>
                                <span className={`${theme.status.info.text} text-sm font-medium`}>
                                    Chapter {chapterNumber}
                                </span>
                            </div>
                            
                            {/* Advanced Features Badge */}
                            {hasCompletedContent && (
                                <div className={`${theme.status.warning.bg} px-3 py-1 rounded-full`}>
                                    <span className={`${theme.status.warning.text} text-xs font-medium flex items-center`}>
                                        <Star className="w-3 h-3 mr-1" />
                                        Pro Features
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Chapter Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-8 h-8 ${iconColor}`} />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className={`${theme.textColors.primary}`}>Chapter {chapterNumber}:</span>
                        <br />
                        <span className={`${theme.textColors.primary} gradient-text-blue`}>
                            {title}
                        </span>
                    </h1>
                    <p className={`${theme.textColors.muted} max-w-2xl mx-auto`}>
                        {subtitle}
                    </p>
                </motion.div>

                {/* Tab Navigation - Dynamic based on user progress */}
                <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as 'lesson' | 'calculator' | 'quiz' | 'assistant' | 'analytics' | 'review')} className="w-full">
                    <TabsList className={`grid w-full ${hasCompletedContent ? 'grid-cols-6' : 'grid-cols-4'} ${theme.backgrounds.header} border ${theme.borderColors.primary}`}>
                        <TabsTrigger 
                            value="lesson" 
                            className={`data-[state=active]:${theme.status.info.bg} data-[state=active]:${theme.status.info.text}`}
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Lesson
                        </TabsTrigger>
                        <TabsTrigger 
                            value="calculator" 
                            className={`data-[state=active]:${theme.status.info.bg} data-[state=active]:${theme.status.info.text}`}
                        >
                            <Calculator className="w-4 h-4 mr-2" />
                            Calculator
                        </TabsTrigger>
                        <TabsTrigger 
                            value="quiz" 
                            className={`data-[state=active]:${theme.status.info.bg} data-[state=active]:${theme.status.info.text}`}
                            disabled={!lessonCompleted && chapterNumber > 1}
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Quiz
                        </TabsTrigger>
                        <TabsTrigger 
                            value="assistant" 
                            className={`data-[state=active]:${theme.status.info.bg} data-[state=active]:${theme.status.info.text}`}
                        >
                            <Bot className="w-4 h-4 mr-2" />
                            AI Coach
                        </TabsTrigger>
                        
                        {/* Advanced Features - Only show after user has some progress */}
                        {hasCompletedContent && (
                            <>
                                <TabsTrigger 
                                    value="review" 
                                    className={`data-[state=active]:${theme.status.info.bg} data-[state=active]:${theme.status.info.text}`}
                                >
                                    <Brain className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Review</span>
                                    <span className="sm:hidden">Review</span>
                                </TabsTrigger>
                                
                                {hasQuizScores && (
                                    <TabsTrigger 
                                        value="analytics" 
                                        className={`data-[state=active]:${theme.status.info.bg} data-[state=active]:${theme.status.info.text}`}
                                    >
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Analytics</span>
                                        <span className="sm:hidden">Stats</span>
                                    </TabsTrigger>
                                )}
                            </>
                        )}
                    </TabsList>

                    <TabsContent value="lesson" className="mt-6">
                        <Card className={`${theme.backgrounds.header} ${theme.borderColors.primary}`}>
                            <CardContent className="p-0">
                                <div onClick={handleLessonComplete}>
                                    {lessonComponent}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calculator" className="mt-6">
                        <Card className={`${theme.backgrounds.header} ${theme.borderColors.primary}`}>
                            <CardHeader>
                                <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                                    <Calculator className={`w-6 h-6 mr-2 ${theme.status.info.text}`} />
                                    {calculatorTitle}
                                </CardTitle>
                                <CardDescription className={`${theme.textColors.muted}`}>
                                    {calculatorDescription}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {calculatorTabs ? (
                                    <div className="space-y-6">
                                        {/* Calculator Sub-tabs */}
                                        <div className="border-b border-white/10">
                                            <nav className="flex space-x-8 px-6" aria-label="Calculator tabs">
                                                {calculatorTabs.map((tab, index) => {
                                                    const IconComponent = tab.icon;
                                                    return (
                                                        <button
                                                            key={tab.id}
                                                            onClick={() => setActiveCalculatorTab(index)}
                                                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                                                                activeCalculatorTab === index
                                                                    ? 'border-blue-500 text-blue-400'
                                                                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <IconComponent className="w-4 h-4 mr-2" />
                                                            {tab.label}
                                                        </button>
                                                    );
                                                })}
                                            </nav>
                                        </div>

                                        {/* Active Calculator */}
                                        <div className="px-6 pb-6">
                                            <div className="mb-4">
                                                <h3 className="text-lg font-semibold text-white mb-2">
                                                    {calculatorTabs[activeCalculatorTab].label}
                                                </h3>
                                                <p className="text-slate-300 text-sm">
                                                    {calculatorTabs[activeCalculatorTab].description}
                                                </p>
                                            </div>
                                            {React.createElement(calculatorTabs[activeCalculatorTab].component)}
                                        </div>
                                    </div>
                                ) : (
                                    calculatorComponent
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="quiz" className="mt-6">
                        <Card className={`${theme.backgrounds.header} ${theme.borderColors.primary}`}>
                            <CardHeader>
                                <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                                    <Trophy className={`w-6 h-6 mr-2 ${theme.status.info.text}`} />
                                    {quizTitle}
                                </CardTitle>
                                <CardDescription className={`${theme.textColors.muted}`}>
                                    {quizDescription}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div onClick={handleQuizComplete}>
                                    {quizComponent}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="assistant" className="mt-6">
                        <Card className={`${theme.backgrounds.header} ${theme.borderColors.primary}`}>
                            <CardHeader>
                                <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                                    <Bot className={`w-6 h-6 mr-2 ${theme.status.info.text}`} />
                                    AI Coach
                                </CardTitle>
                                <CardDescription className={`${theme.textColors.muted}`}>
                                    Get personalized guidance and ask questions about this chapter
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <AITeachingAssistant />
                                
                                {/* Voice QA Integration */}
                                <div className={`${theme.backgrounds.cardHover} rounded-lg p-6 border ${theme.borderColors.primary}`}>
                                    <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
                                        <Volume2 className={`w-5 h-5 mr-2 ${theme.status.info.text}`} />
                                        Voice Assistant
                                    </h3>
                                    <VoiceQA />
                                </div>
                                
                                <QASystem />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Spaced Repetition Review Tab */}
                    {hasCompletedContent && (
                        <TabsContent value="review" className="mt-6">
                            <Card className={`${theme.backgrounds.header} ${theme.borderColors.primary}`}>
                                <CardHeader>
                                    <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                                        <Brain className={`w-6 h-6 mr-2 ${theme.status.info.text}`} />
                                        Learning Review System
                                        <Star className={`w-5 h-5 ml-2 ${theme.status.warning.text}`} />
                                    </CardTitle>
                                    <CardDescription className={`${theme.textColors.muted}`}>
                                        Scientifically-designed spaced repetition to maximize retention. Review concepts at optimal intervals.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SpacedRepetitionDashboard />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    {/* Learning Analytics Tab */}
                    {hasQuizScores && (
                        <TabsContent value="analytics" className="mt-6">
                            <Card className={`${theme.backgrounds.header} ${theme.borderColors.primary}`}>
                                <CardHeader>
                                    <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                                        <BarChart3 className={`w-6 h-6 mr-2 ${theme.status.info.text}`} />
                                        Learning Analytics
                                        <Star className={`w-5 h-5 ml-2 ${theme.status.warning.text}`} />
                                    </CardTitle>
                                    <CardDescription className={`${theme.textColors.muted}`}>
                                        Deep insights into your learning patterns, strengths, and areas for improvement
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <LearningAnalyticsDashboard />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    );
}

'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import AITeachingAssistant from '@/components/shared/ai-assistant/AITeachingAssistant';
import QASystem from '@/components/shared/QASystem';
import {
    Calculator,
    BookOpen,
    Trophy,
    ArrowLeft,
    Lock,
    CheckCircle,
    Bot,
    LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
    quizTitle = "Knowledge Quiz",
    quizDescription = "Test your understanding",
    onLessonComplete,
    onQuizComplete,
    requiresPreviousChapters = true
}: ChapterLayoutProps) {
    const { isChapterUnlocked, completeLesson } = useProgressStore();
    const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz' | 'assistant'>('lesson');
    const [lessonCompleted, setLessonCompleted] = useState(false);

    // Check if chapter is unlocked (skip for Chapter 1)
    const isUnlocked = chapterNumber === 1 || !requiresPreviousChapters || isChapterUnlocked(chapterNumber);

    const handleLessonComplete = () => {
        setLessonCompleted(true);
        completeLesson(`chapter${chapterNumber}-lesson`, 15);
        toast.success(`${title} completed! 🎯`, {
            duration: 4000,
            position: 'top-center',
        });
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
                            <div className={`${theme.status.info.bg} px-3 py-1 rounded-full`}>
                                <span className={`${theme.status.info.text} text-sm font-medium`}>
                                    Chapter {chapterNumber}
                                </span>
                            </div>
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

                {/* Tab Navigation */}
                <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as 'lesson' | 'calculator' | 'quiz' | 'assistant')} className="w-full">
                    <TabsList className={`grid w-full grid-cols-4 ${theme.backgrounds.header} border ${theme.borderColors.primary}`}>
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
                                {calculatorComponent}
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
                                <QASystem />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import InvestmentFundamentalsLesson from '@/components/chapters/fundamentals/lessons/InvestmentFundamentalsLesson';
import {
    TrendingUp,
    Calculator,
    BookOpen,
    Trophy,
    ArrowLeft,
    Lock,
    CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Chapter7Page() {
    const { isChapterUnlocked } = useProgressStore();
    const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
    const [lessonCompleted, setLessonCompleted] = useState(false);

    // Check if chapter is unlocked (requires completing previous chapters)
    const isUnlocked = isChapterUnlocked(7);

    const handleLessonComplete = () => {
        setLessonCompleted(true);
        toast.success('Investment Fundamentals lesson completed! 🎯', {
            duration: 4000,
            position: 'top-center',
        });
    };

    if (!isUnlocked) {
        return (
            <div className={`min-h-screen ${theme.backgrounds.primary} flex items-center justify-center`}>
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-2xl ${theme.spacing.lg}`}
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className={`w-8 h-8 ${theme.textColors.primary}`} />
                        </div>
                        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-4`}>Chapter 7: Investment Fundamentals</h1>
                        <p className={`${theme.textColors.muted} mb-6`}>
                            Complete the previous chapters to unlock this advanced investment education.
                        </p>
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                            <p className="text-blue-200 text-sm">
                                <strong>Prerequisites:</strong> Complete Chapters 1-6 with 80%+ quiz scores
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/">
                                <Button className={theme.buttons.secondary}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Link href="/chapter6">
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
            {/* Header */}
            <div className={`${theme.backgrounds.header} border-b ${theme.borderColors.primary} sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className={`flex items-center ${theme.textColors.primary} hover:${theme.textColors.accent} transition-colors`}>
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500/20 px-3 py-1 rounded-full">
                                <span className="text-blue-400 text-sm font-medium">Chapter 7</span>
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
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-white">Chapter 7:</span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                            Investment Fundamentals
                        </span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Learn the fundamentals of investing, asset allocation, and building long-term wealth through smart investment strategies.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as 'lesson' | 'calculator' | 'quiz')} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
                        <TabsTrigger 
                            value="lesson" 
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Lesson
                        </TabsTrigger>
                        <TabsTrigger 
                            value="calculator" 
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                            disabled={!lessonCompleted}
                        >
                            <Calculator className="w-4 h-4 mr-2" />
                            Calculator
                        </TabsTrigger>
                        <TabsTrigger 
                            value="quiz" 
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                            disabled={!lessonCompleted}
                        >
                            <Trophy className="w-4 h-4 mr-2" />
                            Quiz
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="lesson" className="mt-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-0">
                                <InvestmentFundamentalsLesson onComplete={handleLessonComplete} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calculator" className="mt-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Calculator className="w-6 h-6 mr-2 text-blue-400" />
                                    Investment Calculator
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Coming soon: Portfolio allocation and compound interest calculators
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calculator className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Investment Calculators Coming Soon</h3>
                                    <p className="text-gray-400 mb-6">
                                        We&apos;re building comprehensive investment calculators including compound interest, 
                                        portfolio allocation, and retirement planning tools.
                                    </p>
                                    <Link href="/calculators/compound-interest">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                            Try Compound Interest Calculator
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="quiz" className="mt-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Trophy className="w-6 h-6 mr-2 text-blue-400" />
                                    Investment Fundamentals Quiz
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Test your knowledge of investment basics, asset allocation, and portfolio construction
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Trophy className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Quiz Coming Soon</h3>
                                    <p className="text-gray-400 mb-6">
                                        Complete the lesson first, then return here to test your investment knowledge 
                                        and unlock the next chapter.
                                    </p>
                                    <Button disabled className="bg-gray-600 text-gray-400 cursor-not-allowed">
                                        Quiz Not Available Yet
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

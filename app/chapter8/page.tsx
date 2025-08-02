'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import DebtManagementLesson from '@/components/chapters/fundamentals/lessons/DebtManagementLesson';
import {
    CreditCard,
    Calculator,
    BookOpen,
    Trophy,
    ArrowLeft,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Chapter8Page() {
    const { isChapterUnlocked } = useProgressStore();
    const [currentSection, setCurrentSection] = useState<'lesson' | 'calculator' | 'quiz'>('lesson');
    const [lessonCompleted, setLessonCompleted] = useState(false);

    // Check if chapter is unlocked (requires completing previous chapters)
    const isUnlocked = isChapterUnlocked(8);

    const handleLessonComplete = () => {
        setLessonCompleted(true);
        toast.success('Debt Management lesson completed! 💪', {
            duration: 4000,
            position: 'top-center',
        });
    };

    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800 flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.accent} rounded-2xl ${theme.spacing.lg}`}
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className={`w-8 h-8 ${theme.textColors.primary}`} />
                        </div>
                        
                        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-4`}>
                            Chapter 8: Debt Management
                        </h1>
                        
                        <p className={`${theme.typography.body} ${theme.textColors.secondary} mb-8 leading-relaxed`}>
                            This chapter is locked. Complete the previous chapters to access advanced debt management strategies and credit optimization techniques.
                        </p>
                        
                        <div className={`flex items-center justify-center space-x-3 ${theme.textColors.muted} mb-8`}>
                            <Lock className="w-5 h-5" />
                            <span className={theme.typography.small}>
                                Unlock by mastering Chapter 7: Investment Fundamentals
                            </span>
                        </div>
                        
                        <Link href="/">
                            <Button 
                                variant="outline" 
                                className={`${theme.buttons.secondary} border-2 hover:${theme.borderColors.accent}`}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Return to Dashboard
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
            {/* Header */}
            <div className={`${theme.backgrounds.glass} border-b ${theme.borderColors.primary}`}>
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <Link 
                            href="/" 
                            className={`flex items-center ${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors`}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <CreditCard className={`w-8 h-8 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                            <h1 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-2`}>
                                Chapter 8: Debt Management & Credit Optimization
                            </h1>
                            <p className={`${theme.typography.body} ${theme.textColors.secondary}`}>
                                Master debt elimination strategies and build excellent credit
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as 'lesson' | 'calculator' | 'quiz')}>
                    <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur">
                        <TabsTrigger value="lesson" className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Lesson</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="calculator" 
                            disabled={!lessonCompleted}
                            className="flex items-center space-x-2"
                        >
                            <Calculator className="w-4 h-4" />
                            <span>Calculator</span>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="quiz" 
                            disabled={!lessonCompleted}
                            className="flex items-center space-x-2"
                        >
                            <Trophy className="w-4 h-4" />
                            <span>Quiz</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="lesson" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <DebtManagementLesson onComplete={handleLessonComplete} />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="calculator" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="max-w-4xl mx-auto">
                                <CardHeader className="text-center">
                                    <CardTitle className="flex items-center justify-center space-x-2">
                                        <Calculator className="w-6 h-6 text-red-600" />
                                        <span>Debt Payoff Calculator</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Calculate different debt payoff strategies and see potential savings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <p className={`${theme.textColors.secondary} mb-4`}>
                                            Interactive debt calculator coming soon!
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            This will help you compare avalanche vs snowball methods
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="quiz" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="max-w-4xl mx-auto">
                                <CardHeader className="text-center">
                                    <CardTitle className="flex items-center justify-center space-x-2">
                                        <Trophy className="w-6 h-6 text-red-600" />
                                        <span>Debt Management Quiz</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Test your knowledge of debt strategies and credit optimization
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <p className={`${theme.textColors.secondary} mb-4`}>
                                            Quiz questions coming soon!
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Score 80%+ to unlock Chapter 9: Retirement Planning
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

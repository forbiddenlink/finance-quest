'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calculator, Award, FileText, PiggyBank, Shield, Target, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import RetirementPlannerCalculator from '@/components/shared/calculators/RetirementPlannerCalculator';
import QASystem from '@/components/shared/QASystem';
import RetirementPlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/RetirementPlanningLessonEnhanced';
import RetirementPlanningQuizEnhanced from '@/components/chapters/fundamentals/quizzes/RetirementPlanningQuizEnhanced';
import Link from 'next/link';
import { theme } from '@/lib/theme';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'coach';

export default function Chapter9() {
    const [currentSection, setCurrentSection] = useState<TabType>('lesson');
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const { completeLesson, isChapterUnlocked } = useProgressStore();

    const isUnlocked = isChapterUnlocked(9);

    const handleLessonComplete = () => {
        completeLesson('chapter9-retirement-planning-enhanced', 45);
        setLessonCompleted(true);
    };

    const handleQuizComplete = () => {
        setQuizCompleted(true);
    };

    if (!isUnlocked) {
        return (
            <div className={`min-h-screen ${theme.backgrounds.primary} flex items-center justify-center`}>
                <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <div className={`w-16 h-16 ${theme.backgrounds.disabled} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            <Shield className={`w-8 h-8 ${theme.textColors.muted}`} />
                        </div>
                        <CardTitle>Chapter 9 Locked</CardTitle>
                        <CardDescription>
                            Complete Chapter 8 with 80%+ quiz score to unlock Retirement Planning
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/chapter8">
                            <Button className="w-full">Return to Chapter 8</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.backgrounds.primary}`}>
            {/* Header */}
            <div className={`${theme.backgrounds.glass} border-b ${theme.borderColors.primary}`}>
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className={`${theme.textColors.muted} hover:${theme.textColors.primary} flex items-center`}>
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                        <div className={`w-12 h-12 ${theme.status.success.bg} rounded-lg flex items-center justify-center`}>
                            <PiggyBank className={`w-6 h-6 ${theme.status.success.text}`} />
                        </div>
                        <div>
                            <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>Chapter 9: Retirement Planning & Long-term Wealth</h1>
                            <p className={`${theme.textColors.muted}`}>Build a comprehensive retirement strategy for financial independence</p>
                        </div>
                        <Badge variant="outline" className={`${theme.textColors.primary} ${theme.backgrounds.card} ${theme.borderColors.primary}`}>
                            Wealth Track
                        </Badge>
                    </div>

                    <div className="mt-6">
                        <div className={`flex justify-between ${theme.typography.small} ${theme.textColors.muted} mb-2`}>
                            <span>Chapter Progress</span>
                            <span>{lessonCompleted ? (quizCompleted ? '100' : '75') : '0'}% Complete</span>
                        </div>
                        <Progress value={lessonCompleted ? (quizCompleted ? 100 : 75) : 0} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as TabType)}>
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="lesson" className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <span>Lesson</span>
                        </TabsTrigger>
                        <TabsTrigger value="calculator" className="flex items-center space-x-2">
                            <Calculator className="w-4 h-4" />
                            <span>Retirement Calculator</span>
                        </TabsTrigger>
                        <TabsTrigger value="quiz" disabled={!lessonCompleted} className="flex items-center space-x-2">
                            <Award className="w-4 h-4" />
                            <span>Quiz</span>
                        </TabsTrigger>
                        <TabsTrigger value="coach" className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>AI Coach</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="lesson" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <RetirementPlanningLessonEnhanced onComplete={handleLessonComplete} />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="calculator">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <RetirementPlannerCalculator />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="quiz">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <RetirementPlanningQuizEnhanced onComplete={handleQuizComplete} />
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="coach">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <QASystem />
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

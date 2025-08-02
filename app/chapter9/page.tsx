'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Calculator, Award, FileText, PiggyBank, Shield, Target, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import RetirementPlannerCalculator from '@/components/shared/calculators/RetirementPlannerCalculator';
import QASystem from '@/components/shared/QASystem';
import RetirementPlanningLesson from '@/components/chapters/fundamentals/lessons/RetirementPlanningLesson';
import Link from 'next/link';
import { theme } from '@/lib/theme';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'coach';

export default function Chapter9() {
    const [currentSection, setCurrentSection] = useState<TabType>('lesson');
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

    const { completeLesson, recordQuizScore, isChapterUnlocked } = useProgressStore();

    const isUnlocked = isChapterUnlocked(9);

    const handleLessonComplete = () => {
        completeLesson('chapter9-retirement-planning', 45);
        setLessonCompleted(true);
    };

    const handleQuizAnswer = (questionIndex: number, answer: string) => {
        setQuizAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleQuizComplete = () => {
        const totalQuestions = 10;
        const correctAnswers = Object.values(quizAnswers).filter((answer, index) => {
            return answer === quizQuestions[index]?.correct;
        }).length;

        const score = Math.round((correctAnswers / totalQuestions) * 100);
        recordQuizScore('chapter9-quiz', score, totalQuestions);
        setQuizCompleted(true);

        if (score >= 80) {
            // Quiz passed, user can advance
            console.log('Quiz passed! User can advance to next chapter.');
        }
    };

    const quizQuestions = [
        {
            question: "What is the traditional retirement account contribution limit for 2024 (under age 50)?",
            options: ["$6,500", "$7,000", "$7,500", "$8,000"],
            correct: "$7,000"
        },
        {
            question: "According to the 4% rule, how much can you safely withdraw annually from a $1M portfolio?",
            options: ["$30,000", "$35,000", "$40,000", "$45,000"],
            correct: "$40,000"
        },
        {
            question: "What is the maximum 401(k) contribution limit for 2024 (including catch-up for 50+)?",
            options: ["$23,000", "$30,500", "$69,000", "$76,500"],
            correct: "$30,500"
        },
        {
            question: "What is the main advantage of a Roth IRA over a traditional IRA?",
            options: ["Higher contribution limits", "Tax-free withdrawals in retirement", "Immediate tax deduction", "No income restrictions"],
            correct: "Tax-free withdrawals in retirement"
        },
        {
            question: "What is the 25x rule for retirement planning?",
            options: ["Save 25% of income", "Retire at 25", "Need 25x annual expenses", "Invest for 25 years"],
            correct: "Need 25x annual expenses"
        },
        {
            question: "What is the main risk with early retirement withdrawals from 401(k) accounts?",
            options: ["10% penalty before age 59½", "Loss of employer match", "Reduced Social Security", "Higher tax rates"],
            correct: "10% penalty before age 59½"
        },
        {
            question: "What strategy allows high earners to contribute up to $69,000 annually to retirement accounts?",
            options: ["Roth conversion", "Backdoor Roth", "Mega backdoor Roth", "401(k) loans"],
            correct: "Mega backdoor Roth"
        },
        {
            question: "What percentage of pre-retirement income do most experts recommend for retirement?",
            options: ["50-60%", "70-90%", "100%", "110-120%"],
            correct: "70-90%"
        },
        {
            question: "What is sequence of returns risk?",
            options: ["Risk of low returns", "Risk of poor early retirement returns", "Risk of inflation", "Risk of market volatility"],
            correct: "Risk of poor early retirement returns"
        },
        {
            question: "Which has the 'triple tax advantage' for retirement and healthcare?",
            options: ["401(k)", "Roth IRA", "HSA", "Traditional IRA"],
            correct: "HSA"
        }
    ];

    if (!isUnlocked) {
        return (
            <div className={`min-h-screen ${theme.backgrounds.primary} flex items-center justify-center`}>
                <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
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
                        <Badge variant="outline" className={`${theme.textColors.accent} ${theme.backgrounds.card} ${theme.borderColors.accent}`}>
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
                            <RetirementPlanningLesson onComplete={handleLessonComplete} />
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
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Award className={`w-5 h-5 ${theme.textColors.accent}`} />
                                        <span>Retirement Planning Quiz</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Test your knowledge of retirement strategies. Score 80% or higher to advance to Chapter 10.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!quizCompleted ? (
                                        <div className="space-y-6">
                                            <div className="mb-4">
                                                <div className={`flex justify-between text-sm ${theme.textColors.secondary} mb-2`}>
                                                    <span>Progress</span>
                                                    <span>{Object.keys(quizAnswers).length} / {quizQuestions.length}</span>
                                                </div>
                                                <Progress value={(Object.keys(quizAnswers).length / quizQuestions.length) * 100} />
                                            </div>

                                            {quizQuestions.map((question, index) => (
                                                <div key={index} className="space-y-3">
                                                    <h3 className={`font-medium ${theme.textColors.primary}`}>
                                                        {index + 1}. {question.question}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {question.options.map((option) => (
                                                            <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${index}`}
                                                                    value={option}
                                                                    onChange={() => handleQuizAnswer(index, option)}
                                                                    className={theme.status.error.text}
                                                                />
                                                                <span className={theme.textColors.secondary}>{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-center pt-6">
                                                <Button
                                                    onClick={handleQuizComplete}
                                                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                                    className={theme.buttons.primary}
                                                >
                                                    Submit Quiz
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <CheckCircle className={`w-16 h-16 ${theme.status.success.text} mx-auto`} />
                                            <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Quiz Completed!</h3>
                                            <p className={theme.textColors.secondary}>
                                                You scored {Math.round((Object.values(quizAnswers).filter((answer, index) =>
                                                    answer === quizQuestions[index]?.correct).length / quizQuestions.length) * 100)}%
                                            </p>
                                            {Math.round((Object.values(quizAnswers).filter((answer, index) =>
                                                answer === quizQuestions[index]?.correct).length / quizQuestions.length) * 100) >= 80 ? (
                                                <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4`}>
                                                    <p className={`${theme.status.success.text} font-medium`}>Congratulations! You can now advance to Chapter 10.</p>
                                                    <Link href="/chapter10" className="inline-block mt-3">
                                                        <Button className={theme.buttons.primary}>
                                                            Continue to Chapter 10
                                                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4`}>
                                                    <p className={theme.status.warning.text}>You need 80% or higher to advance. Review the lesson and try again!</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
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

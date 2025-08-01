'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Calculator, Award, FileText, TrendingDown, Shield, Target, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import TaxOptimizerCalculator from '@/components/shared/calculators/TaxOptimizerCalculator';
import QASystem from '@/components/shared/QASystem';
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
        completeLesson('chapter9-tax-optimization', 45);
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
            question: "What is the standard deduction for single filers in 2024?",
            options: ["$12,950", "$13,850", "$14,600", "$15,200"],
            correct: "$14,600"
        },
        {
            question: "Which tax-advantaged account has required minimum distributions (RMDs)?",
            options: ["Roth IRA", "Traditional IRA", "HSA", "529 Plan"],
            correct: "Traditional IRA"
        },
        {
            question: "What is the maximum 401(k) contribution limit for 2024 (under age 50)?",
            options: ["$22,500", "$23,000", "$23,500", "$24,000"],
            correct: "$23,000"
        },
        {
            question: "Which investment type receives preferential long-term capital gains tax treatment?",
            options: ["Assets held > 1 year", "Assets held > 6 months", "Assets held > 2 years", "All investments"],
            correct: "Assets held > 1 year"
        },
        {
            question: "What is tax loss harvesting?",
            options: ["Selling profitable investments", "Claiming business expenses", "Selling losing investments to offset gains", "Contributing to retirement accounts"],
            correct: "Selling losing investments to offset gains"
        },
        {
            question: "Which deduction phase-out begins at higher income levels?",
            options: ["Standard deduction", "Mortgage interest", "State/local taxes", "Student loan interest"],
            correct: "Student loan interest"
        },
        {
            question: "What is the HSA contribution limit for individual coverage in 2024?",
            options: ["$3,650", "$4,150", "$4,300", "$4,650"],
            correct: "$4,300"
        },
        {
            question: "Which strategy helps minimize taxes in retirement?",
            options: ["Only using taxable accounts", "Roth conversion ladder", "Taking maximum Social Security early", "Avoiding retirement accounts"],
            correct: "Roth conversion ladder"
        },
        {
            question: "What is the child tax credit amount for qualifying children in 2024?",
            options: ["$2,000", "$2,500", "$3,000", "$3,600"],
            correct: "$2,000"
        },
        {
            question: "Which tax filing status typically provides the lowest tax rates?",
            options: ["Single", "Married Filing Jointly", "Head of Household", "Married Filing Separately"],
            correct: "Married Filing Jointly"
        }
    ];

    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className={`w-8 h-8 ${theme.textColors.muted}`} />
                        </div>
                        <CardTitle>Chapter 9 Locked</CardTitle>
                        <CardDescription>
                            Complete Chapter 8 with 80%+ quiz score to unlock Tax Optimization
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                            <TrendingDown className={`w-6 h-6 ${theme.textColors.primary}`} />
                        </div>
                        <div>
                            <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>Chapter 9: Tax Optimization</h1>
                            <p className={`${theme.textColors.muted}`}>Master tax strategies to keep more of your hard-earned money</p>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Planning Track
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
                            <span>Tax Calculator</span>
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
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingDown className="w-5 h-5 text-red-600" />
                                        <span>Understanding Tax Optimization</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Learn legal strategies to minimize your tax burden and maximize your wealth
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Tax-Advantaged Accounts</h3>
                                            <div className="space-y-3">
                                                <div className={`${theme.backgrounds.glass} ${theme.spacing.sm} rounded-lg`}>
                                                    <h4 className="font-medium text-slate-900">401(k) & Traditional IRA</h4>
                                                    <p className="text-sm text-slate-800 mt-1">Reduce current taxes, pay taxes in retirement</p>
                                                </div>
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-green-900">Roth IRA & Roth 401(k)</h4>
                                                    <p className="text-sm text-green-800 mt-1">Pay taxes now, tax-free growth and withdrawals</p>
                                                </div>
                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-purple-900">HSA (Health Savings Account)</h4>
                                                    <p className="text-sm text-purple-800 mt-1">Triple tax advantage: deductible, growth, and withdrawals</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Advanced Strategies</h3>
                                            <div className="space-y-3">
                                                <div className="bg-orange-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-orange-900">Tax Loss Harvesting</h4>
                                                    <p className="text-sm text-orange-800 mt-1">Sell losing investments to offset capital gains</p>
                                                </div>
                                                <div className="bg-indigo-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-indigo-900">Asset Location</h4>
                                                    <p className="text-sm text-indigo-800 mt-1">Place investments in optimal account types</p>
                                                </div>
                                                <div className="bg-pink-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-pink-900">Roth Conversions</h4>
                                                    <p className="text-sm text-pink-800 mt-1">Strategic conversion during low-income years</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className={`text-lg font-semibold ${theme.textColors.primary} flex items-center space-x-2`}>
                                            <Clock className="w-5 h-5 text-blue-600" />
                                            <span>Key Tax Concepts & Deadlines</span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                                <div className={`text-2xl font-bold ${theme.textColors.primary}`}>Apr 15</div>
                                                <div className={`text-sm ${theme.textColors.secondary}`}>Tax Filing Deadline</div>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <div className={`text-2xl font-bold ${theme.textColors.primary}`}>$23,000</div>
                                                <div className={`text-sm ${theme.textColors.secondary}`}>401(k) Limit 2024 (Under 50)</div>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <div className={`text-2xl font-bold ${theme.textColors.primary}`}>20%</div>
                                                <div className={`text-sm ${theme.textColors.secondary}`}>Max Long-term Capital Gains Rate</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-medium text-yellow-900 mb-2">💡 Pro Tip</h4>
                                        <p className="text-sm text-yellow-800">
                                            Tax optimization is a marathon, not a sprint. Start with maximizing employer matching,
                                            then utilize tax-advantaged accounts based on your current and expected future tax brackets.
                                        </p>
                                    </div>

                                    {!lessonCompleted && (
                                        <div className="flex justify-center pt-6">
                                            <Button onClick={handleLessonComplete} size="lg" className="bg-red-600 hover:bg-red-700">
                                                Complete Lesson
                                                <CheckCircle className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    )}

                                    {lessonCompleted && (
                                        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                            <p className="text-green-800 font-medium">Lesson completed! Try the tax calculator next.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="calculator">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <TaxOptimizerCalculator />
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
                                        <Award className="w-5 h-5 text-red-600" />
                                        <span>Tax Optimization Quiz</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Test your knowledge of tax strategies. Score 80% or higher to advance to Chapter 10.
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
                                                                    className="text-red-600"
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
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Submit Quiz
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                                            <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Quiz Completed!</h3>
                                            <p className={theme.textColors.secondary}>
                                                You scored {Math.round((Object.values(quizAnswers).filter((answer, index) =>
                                                    answer === quizQuestions[index]?.correct).length / quizQuestions.length) * 100)}%
                                            </p>
                                            {Math.round((Object.values(quizAnswers).filter((answer, index) =>
                                                answer === quizQuestions[index]?.correct).length / quizQuestions.length) * 100) >= 80 ? (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <p className="text-green-800 font-medium">Congratulations! You can now advance to Chapter 10.</p>
                                                    <Link href="/chapter10" className="inline-block mt-3">
                                                        <Button className="bg-green-600 hover:bg-green-700">
                                                            Continue to Chapter 10
                                                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                    <p className="text-yellow-800">You need 80% or higher to advance. Review the lesson and try again!</p>
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

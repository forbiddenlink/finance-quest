'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Calculator, Award, FileText, Building, Shield, Target, ArrowLeft, Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import BusinessCalculator from '@/components/shared/calculators/BusinessCalculator';
import QASystem from '@/components/shared/QASystem';
import Link from 'next/link';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'coach';

export default function Chapter10() {
    const [currentSection, setCurrentSection] = useState<TabType>('lesson');
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

    const { completeLesson, recordQuizScore, isChapterUnlocked } = useProgressStore();

    const isUnlocked = isChapterUnlocked(10);

    const handleLessonComplete = () => {
        completeLesson('chapter10-business-finance', 50);
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
        recordQuizScore('chapter10-quiz', score, totalQuestions);
        setQuizCompleted(true);

        if (score >= 80) {
            // Quiz passed, user can advance
            console.log('Quiz passed! User can advance to next chapter.');
        }
    };

    const quizQuestions = [
        {
            question: "What is the primary difference between an LLC and a Corporation?",
            options: ["Tax treatment", "Personal liability protection", "Number of owners allowed", "Formation requirements"],
            correct: "Tax treatment"
        },
        {
            question: "Which business structure offers the most flexibility in profit distribution?",
            options: ["Sole Proprietorship", "Partnership", "LLC", "S-Corporation"],
            correct: "LLC"
        },
        {
            question: "What does 'working capital' measure?",
            options: ["Total assets", "Current assets minus current liabilities", "Annual revenue", "Net profit margin"],
            correct: "Current assets minus current liabilities"
        },
        {
            question: "Which financial statement shows a company's profitability over time?",
            options: ["Balance Sheet", "Income Statement", "Cash Flow Statement", "Statement of Equity"],
            correct: "Income Statement"
        },
        {
            question: "What is the debt-to-equity ratio used to assess?",
            options: ["Profitability", "Liquidity", "Financial leverage", "Market value"],
            correct: "Financial leverage"
        },
        {
            question: "Which funding source typically has the lowest cost of capital?",
            options: ["Venture capital", "Bank loans", "Retained earnings", "Credit cards"],
            correct: "Retained earnings"
        },
        {
            question: "What is the break-even point?",
            options: ["Maximum profit point", "Where total revenue equals total costs", "Minimum revenue needed", "Average profit margin"],
            correct: "Where total revenue equals total costs"
        },
        {
            question: "Which tax deduction is available to small businesses?",
            options: ["Business equipment purchases", "Personal vehicle use", "Home mortgage interest", "Personal meals"],
            correct: "Business equipment purchases"
        },
        {
            question: "What is the primary purpose of a business budget?",
            options: ["Track past performance", "Plan and control future activities", "Calculate taxes", "Impress investors"],
            correct: "Plan and control future activities"
        },
        {
            question: "Which cash flow management technique helps with seasonal businesses?",
            options: ["Fixed pricing", "Cash reserves", "Single revenue stream", "Annual contracts only"],
            correct: "Cash reserves"
        }
    ];

    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <CardTitle>Chapter 10 Locked</CardTitle>
                        <CardDescription>
                            Complete Chapter 9 with 80%+ quiz score to unlock Business Finance Basics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/chapter9">
                            <Button className="w-full">Return to Chapter 9</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chapter 10: Business Finance Basics</h1>
                            <p className="text-gray-600">Essential financial concepts for entrepreneurs and business owners</p>
                        </div>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                            Business Track
                        </Badge>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
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
                            <span>Business Calculator</span>
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
                                        <Building className="w-5 h-5 text-blue-600" />
                                        <span>Business Finance Fundamentals</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Master essential financial concepts for business success and entrepreneurship
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                                <Briefcase className="w-5 h-5 text-blue-600" />
                                                <span>Business Structure Options</span>
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="bg-slate-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-slate-900">Sole Proprietorship</h4>
                                                    <p className="text-sm text-slate-800 mt-1">Simplest structure, personal liability, pass-through taxation</p>
                                                </div>
                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-green-900">LLC (Limited Liability Company)</h4>
                                                    <p className="text-sm text-green-800 mt-1">Flexible structure, limited liability, tax flexibility</p>
                                                </div>
                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-purple-900">Corporation (C-Corp/S-Corp)</h4>
                                                    <p className="text-sm text-purple-800 mt-1">Separate legal entity, potential double taxation (C-Corp)</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Key Financial Statements</h3>
                                            <div className="space-y-3">
                                                <div className="bg-orange-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-orange-900">Income Statement (P&L)</h4>
                                                    <p className="text-sm text-orange-800 mt-1">Revenue, expenses, and profitability over time</p>
                                                </div>
                                                <div className="bg-indigo-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-indigo-900">Balance Sheet</h4>
                                                    <p className="text-sm text-indigo-800 mt-1">Assets, liabilities, and equity at a point in time</p>
                                                </div>
                                                <div className="bg-pink-50 p-4 rounded-lg">
                                                    <h4 className="font-medium text-pink-900">Cash Flow Statement</h4>
                                                    <p className="text-sm text-pink-800 mt-1">Operating, investing, and financing cash flows</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                            <TrendingUp className="w-5 h-5 text-blue-600" />
                                            <span>Critical Business Metrics</span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                                <div className="text-lg font-bold text-gray-900">Working Capital</div>
                                                <div className="text-sm text-gray-600">Current Assets - Current Liabilities</div>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                                <div className="text-lg font-bold text-gray-900">Gross Margin</div>
                                                <div className="text-sm text-gray-600">(Revenue - COGS) / Revenue</div>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                                <div className="text-lg font-bold text-gray-900">Break-Even Point</div>
                                                <div className="text-sm text-gray-600">Fixed Costs / (Price - Variable Cost)</div>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                                <div className="text-lg font-bold text-gray-900">Debt-to-Equity</div>
                                                <div className="text-sm text-gray-600">Total Debt / Total Equity</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Funding Sources</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                                    <span className="font-medium text-green-900">Retained Earnings</span>
                                                    <span className="text-sm text-green-700">Low Cost</span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                                    <span className="font-medium text-slate-900">Bank Loans</span>
                                                    <span className="text-sm text-slate-700">Medium Cost</span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                                    <span className="font-medium text-purple-900">Venture Capital</span>
                                                    <span className="text-sm text-purple-700">High Cost</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Tax Considerations</h3>
                                            <div className="space-y-3">
                                                <div className="bg-yellow-50 p-3 rounded-lg">
                                                    <h4 className="font-medium text-yellow-900">Business Deductions</h4>
                                                    <p className="text-sm text-yellow-800">Equipment, office supplies, business meals</p>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded-lg">
                                                    <h4 className="font-medium text-red-900">Self-Employment Tax</h4>
                                                    <p className="text-sm text-red-800">15.3% on net earnings from self-employment</p>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded-lg">
                                                    <h4 className="font-medium text-green-900">Quarterly Payments</h4>
                                                    <p className="text-sm text-green-800">Estimated tax payments due quarterly</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
                                        <h4 className="font-medium text-navy-900 mb-2">💡 Business Success Tips</h4>
                                        <ul className="text-sm text-navy-800 space-y-1">
                                            <li>• Maintain positive cash flow - cash is king in business</li>
                                            <li>• Separate personal and business finances completely</li>
                                            <li>• Monitor key performance indicators (KPIs) regularly</li>
                                            <li>• Build relationships with trusted financial advisors</li>
                                            <li>• Plan for taxes throughout the year, not just at year-end</li>
                                        </ul>
                                    </div>

                                    {!lessonCompleted && (
                                        <div className="flex justify-center pt-6">
                                            <Button onClick={handleLessonComplete} size="lg" className="bg-navy-600 hover:bg-navy-700">
                                                Complete Lesson
                                                <CheckCircle className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    )}

                                    {lessonCompleted && (
                                        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                            <p className="text-green-800 font-medium">Lesson completed! Try the business calculator next.</p>
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
                            <BusinessCalculator />
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
                                        <Award className="w-5 h-5 text-navy-600" />
                                        <span>Business Finance Quiz</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Test your knowledge of business finance fundamentals. Score 80% or higher to advance to Chapter 11.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!quizCompleted ? (
                                        <div className="space-y-6">
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                    <span>Progress</span>
                                                    <span>{Object.keys(quizAnswers).length} / {quizQuestions.length}</span>
                                                </div>
                                                <Progress value={(Object.keys(quizAnswers).length / quizQuestions.length) * 100} />
                                            </div>

                                            {quizQuestions.map((question, index) => (
                                                <div key={index} className="space-y-3">
                                                    <h3 className="font-medium text-gray-900">
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
                                                                    className="text-navy-600"
                                                                />
                                                                <span className="text-gray-700">{option}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex justify-center pt-6">
                                                <Button
                                                    onClick={handleQuizComplete}
                                                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                                    className="bg-navy-600 hover:bg-navy-700"
                                                >
                                                    Submit Quiz
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                                            <h3 className="text-xl font-bold text-gray-900">Quiz Completed!</h3>
                                            <p className="text-gray-600">
                                                You scored {Math.round((Object.values(quizAnswers).filter((answer, index) =>
                                                    answer === quizQuestions[index]?.correct).length / quizQuestions.length) * 100)}%
                                            </p>
                                            {Math.round((Object.values(quizAnswers).filter((answer, index) =>
                                                answer === quizQuestions[index]?.correct).length / quizQuestions.length) * 100) >= 80 ? (
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <p className="text-green-800 font-medium">Congratulations! You can now advance to Chapter 11.</p>
                                                    <Link href="/chapter11" className="inline-block mt-3">
                                                        <Button className="bg-green-600 hover:bg-green-700">
                                                            Continue to Chapter 11
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

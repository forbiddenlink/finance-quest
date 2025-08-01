'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEnhancedProgress } from '@/lib/store/progressHooks';
import { theme } from '@/lib/theme';
import {
    Star,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Target,
    BarChart3,
    FileText,
    Eye,
    ArrowLeft,
    Clock,
    CreditCard,
    Lock
} from 'lucide-react';

export default function Chapter7Page() {
    const progress = useEnhancedProgress();
    const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

    // Check if chapter is unlocked (user must complete first 5 chapters)
    const isUnlocked = progress.userProgress.currentChapter >= 6;

    const lessons = [
        {
            id: 1,
            title: 'FICO vs VantageScore: Understanding Credit Scoring Models',
            description: 'Learn the differences between major credit scoring systems and how they impact your financial life',
            icon: <BarChart3 className="w-6 h-6" />,
            duration: '15 minutes',
            concepts: [
                'FICO 8 vs FICO 9 vs VantageScore 3.0 differences',
                'How payment history affects each model differently',
                'Credit utilization optimization strategies',
                'Length of credit history impact variations'
            ]
        },
        {
            id: 2,
            title: 'Credit Report Deep Dive & Analysis',
            description: 'Master reading credit reports and identifying errors that could be costing you money',
            icon: <FileText className="w-6 h-6" />,
            duration: '20 minutes',
            concepts: [
                'Reading Experian, Equifax, and TransUnion reports',
                'Identifying and disputing credit report errors',
                'Understanding credit inquiries and their impact',
                'Monitoring services vs free annual reports'
            ]
        },
        {
            id: 3,
            title: 'Strategic Credit Building from Scratch',
            description: 'Build excellent credit even if you&apos;re starting with no credit history',
            icon: <TrendingUp className="w-6 h-6" />,
            duration: '18 minutes',
            concepts: [
                'Secured credit cards vs student credit cards',
                'Authorized user strategies and risks',
                'Credit builder loans and their effectiveness',
                'Timeline expectations for building credit'
            ]
        },
        {
            id: 4,
            title: 'Advanced Credit Optimization Techniques',
            description: 'Take your credit score from good to excellent with advanced strategies',
            icon: <Star className="w-6 h-6" />,
            duration: '22 minutes',
            concepts: [
                'Credit utilization timing and multiple payment strategies',
                'Credit mix optimization without unnecessary accounts',
                'Negotiating with creditors for goodwill deletions',
                'Credit score plateau breaking techniques'
            ]
        },
        {
            id: 5,
            title: 'Credit Monitoring & Long-term Maintenance',
            description: 'Maintain excellent credit and catch problems before they become expensive',
            icon: <Eye className="w-6 h-6" />,
            duration: '16 minutes',
            concepts: [
                'Free monitoring vs paid services comparison',
                'Identity theft protection and credit freezes',
                'Annual credit maintenance checklist',
                'When to be concerned about score fluctuations'
            ]
        },
        {
            id: 6,
            title: 'Credit Score ROI & Financial Impact',
            description: 'Calculate exactly how much good credit saves you in real dollars',
            icon: <Target className="w-6 h-6" />,
            duration: '14 minutes',
            concepts: [
                'Interest rate differences across credit score ranges',
                'Mortgage, auto loan, and credit card savings calculations',
                'Insurance premiums and credit score correlations',
                'Employment and rental application impacts'
            ]
        }
    ];

    if (!isUnlocked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`${theme.backgrounds.card} border border-amber-500/20 rounded-2xl ${theme.spacing.lg}`}
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className={`w-8 h-8 ${theme.textColors.primary}`} />
                        </div>
                        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary} mb-4`}>Chapter 7: Credit Scores & Reports</h1>
                        <p className={`${theme.textColors.muted} mb-6`}>
                            This advanced chapter is part of our Credit & Lending Track. Complete the Foundation Track first to unlock.
                        </p>
                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-6">
                            <p className="text-amber-200 text-sm">
                                <strong>Prerequisites:</strong> Complete Chapters 1-5 of the Foundation Track
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/">
                                <Button className={theme.buttons.secondary}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Link href="/chapter5">
                                <Button className={theme.buttons.primary}>
                                    Continue Foundation Track
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/curriculum" className="flex items-center text-white hover:text-amber-400 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Curriculum
                        </Link>
                        <div className="flex items-center space-x-4">
                            <div className="bg-amber-500/20 px-3 py-1 rounded-full">
                                <span className="text-amber-400 text-sm font-medium">Credit & Lending Track</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Chapter Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/25">
                        <Star className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-white">Chapter 7:</span>
                        <br />
                        <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                            Credit Scores & Reports Deep Dive
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Master the credit scoring systems that determine your financial opportunities.
                        Learn to optimize, monitor, and leverage your credit profile for maximum benefit.
                    </p>
                </motion.div>

                {/* Learning Objectives */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 mb-12`}
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Target className="w-6 h-6 mr-3 text-amber-400" />
                        What You&apos;ll Master
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Understand FICO vs VantageScore differences and optimization strategies</span>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Read and analyze credit reports from all three major bureaus</span>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Build credit strategically from scratch or improve existing scores</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Implement advanced optimization techniques for excellent credit</span>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Set up monitoring systems and maintenance routines</span>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">Calculate real dollar savings from excellent credit</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {lessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                            className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-amber-400/40 transition-all duration-300 cursor-pointer`}
                            onClick={() => setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-amber-500/25">
                                        {lesson.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Lesson {lesson.id}</h3>
                                        <div className="flex items-center text-amber-400 text-sm">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {lesson.duration}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-amber-400">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                            </div>

                            <h4 className="text-xl font-semibold text-white mb-3">{lesson.title}</h4>
                            <p className="text-gray-400 mb-4">{lesson.description}</p>

                            {selectedLesson === lesson.id && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-t border-white/10 pt-4 mt-4"
                                >
                                    <h5 className="text-amber-400 font-semibold mb-3">Key Concepts:</h5>
                                    <ul className="space-y-2">
                                        {lesson.concepts.map((concept, idx) => (
                                            <li key={idx} className="flex items-start text-gray-300 text-sm">
                                                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                                {concept}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-300">
                                            Start Lesson {lesson.id}
                                            <CheckCircle className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Coming Soon Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-8 mt-12 text-center"
                >
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Interactive Lessons Coming Soon</h3>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Chapter 7 is part of our comprehensive expansion plan. Interactive lessons, quizzes,
                        and the Credit Score Simulator calculator will be available in the next update.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/curriculum">
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                                View Full Curriculum
                            </Button>
                        </Link>
                        <Link href="/chapter1">
                            <Button variant="outline" className={`border-white/20 text-white hover:${theme.backgrounds.glass}/10`}>
                                Continue Foundation Track
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

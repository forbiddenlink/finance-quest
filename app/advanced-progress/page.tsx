'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    TrendingUp,
    Target,
    Clock,
    Award,
    Brain,
    CreditCard,
    Shield,
    Building,
    Globe,
    CheckCircle,
    Lock,
    BookOpen,
    Calculator,
    Trophy,
    Flame,
    ArrowRight
} from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

export default function AdvancedProgressDashboard() {
    const userProgress = useProgressStore((state) => state.userProgress);

    const learningTracks = [
        {
            id: 'foundation',
            name: 'Foundation Track',
            icon: Brain,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-500/20 border-blue-500/30',
            chapters: Array.from({ length: 6 }, (_, i) => ({
                id: i + 1,
                title: [
                    'Money Psychology',
                    'Banking Fundamentals',
                    'Income & Career',
                    'Credit & Debt',
                    'Emergency Funds',
                    'Budgeting Mastery'
                ][i],
                completed: userProgress.completedLessons.filter(l => l.startsWith(`chapter${i + 1}`)).length >= 3
            }))
        },
        {
            id: 'credit',
            name: 'Credit & Lending',
            icon: CreditCard,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-500/20 border-purple-500/30',
            chapters: Array.from({ length: 4 }, (_, i) => ({
                id: i + 7,
                title: [
                    'Credit Scores & Reports',
                    'Credit Cards Mastery',
                    'Personal Loans',
                    'Student Loans'
                ][i],
                completed: false // Not implemented yet
            }))
        },
        {
            id: 'investment',
            name: 'Investment Track',
            icon: TrendingUp,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-500/20 border-green-500/30',
            chapters: Array.from({ length: 6 }, (_, i) => ({
                id: i + 11,
                title: [
                    'Investment Fundamentals',
                    'Stocks & Equity',
                    'Bonds & Fixed Income',
                    'Mutual Funds & ETFs',
                    'Retirement Accounts',
                    'Advanced Strategies'
                ][i],
                completed: false
            }))
        },
        {
            id: 'protection',
            name: 'Protection & Planning',
            icon: Shield,
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-500/20 border-amber-500/30',
            chapters: Array.from({ length: 4 }, (_, i) => ({
                id: i + 17,
                title: [
                    'Insurance Fundamentals',
                    'Health Insurance',
                    'Life & Disability',
                    'Property & Casualty'
                ][i],
                completed: false
            }))
        },
        {
            id: 'advanced',
            name: 'Advanced Planning',
            icon: Building,
            color: 'from-slate-500 to-slate-600',
            bgColor: 'bg-slate-500/20 border-slate-500/30',
            chapters: Array.from({ length: 5 }, (_, i) => ({
                id: i + 21,
                title: [
                    'Tax Strategy',
                    'Real Estate Investment',
                    'Business Finance',
                    'Estate Planning',
                    'Financial Independence'
                ][i],
                completed: false
            }))
        },
        {
            id: 'economic',
            name: 'Economic Literacy',
            icon: Globe,
            color: 'from-teal-500 to-teal-600',
            bgColor: 'bg-teal-500/20 border-teal-500/30',
            chapters: Array.from({ length: 5 }, (_, i) => ({
                id: i + 26,
                title: [
                    'Economic Fundamentals',
                    'Market Psychology',
                    'Global Economics',
                    'Economic Policy',
                    'Crisis Preparation'
                ][i],
                completed: false
            }))
        }
    ];

    const totalChapters = 30;
    const completedChapters = userProgress.completedQuizzes.length;
    const overallProgress = (completedChapters / totalChapters) * 100;

    const streakDays = userProgress.streakDays || 0;
    const totalTimeSpent = userProgress.totalTimeSpent || 0;
    const timeSpentHours = Math.floor(totalTimeSpent / 3600);
    const timeSpentMinutes = Math.floor((totalTimeSpent % 3600) / 60);

    const achievements = [
        {
            id: 'foundation-complete',
            name: 'Foundation Master',
            description: 'Complete all Foundation Track chapters',
            icon: Brain,
            unlocked: completedChapters >= 5,
            progress: Math.min(completedChapters / 5, 1) * 100
        },
        {
            id: 'calculator-expert',
            name: 'Calculator Expert',
            description: 'Use all 7 financial calculators',
            icon: Calculator,
            unlocked: Object.keys(userProgress.calculatorUsage || {}).length >= 6,
            progress: (Object.keys(userProgress.calculatorUsage || {}).length / 7) * 100
        },
        {
            id: 'quiz-master',
            name: 'Quiz Master',
            description: 'Score 90%+ on 5 chapter quizzes',
            icon: Trophy,
            unlocked: Object.values(userProgress.quizScores || {}).filter(score => score >= 90).length >= 5,
            progress: (Object.values(userProgress.quizScores || {}).filter(score => score >= 90).length / 5) * 100
        },
        {
            id: 'streak-warrior',
            name: 'Learning Streak',
            description: 'Maintain a 7-day learning streak',
            icon: Flame,
            unlocked: streakDays >= 7,
            progress: Math.min(streakDays / 7, 1) * 100
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                                ← Back to Home
                            </Link>
                            <h1 className="text-2xl font-bold text-white">Your Financial Journey</h1>
                        </div>
                        <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <span className="text-sm font-medium text-amber-300">
                                Score: {userProgress.financialLiteracyScore}/1000
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center`}
                    >
                        <Target className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                        <p className="text-3xl font-bold text-blue-300">{overallProgress.toFixed(1)}%</p>
                        <p className="text-sm text-gray-300">{completedChapters} of {totalChapters} chapters</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center`}
                    >
                        <Flame className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
                        <p className="text-3xl font-bold text-orange-300">{streakDays}</p>
                        <p className="text-sm text-gray-300">days in a row</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center`}
                    >
                        <Clock className="w-8 h-8 mx-auto mb-3 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Time Invested</h3>
                        <p className="text-3xl font-bold text-green-300">{timeSpentHours}h</p>
                        <p className="text-sm text-gray-300">{timeSpentMinutes}m additional</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center`}
                    >
                        <Award className="w-8 h-8 mx-auto mb-3 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">Literacy Score</h3>
                        <p className="text-3xl font-bold text-amber-300">{userProgress.financialLiteracyScore}</p>
                        <p className="text-sm text-gray-300">out of 1000 points</p>
                    </motion.div>
                </div>

                {/* Learning Tracks */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Learning Tracks Progress</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {learningTracks.map((track, index) => {
                            const completedInTrack = track.chapters.filter(ch => ch.completed).length;
                            const progressPercent = (completedInTrack / track.chapters.length) * 100;

                            return (
                                <motion.div
                                    key={track.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 ${track.bgColor}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <track.icon className="w-6 h-6 text-white" />
                                            <h3 className="text-lg font-semibold text-white">{track.name}</h3>
                                        </div>
                                        <span className="text-sm font-medium text-white">
                                            {completedInTrack}/{track.chapters.length}
                                        </span>
                                    </div>

                                    <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                                        <div
                                            className={`bg-gradient-to-r ${track.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {track.chapters.map((chapter) => (
                                            <div
                                                key={chapter.id}
                                                className={`flex items-center gap-2 p-2 rounded-lg ${chapter.completed
                                                    ? 'bg-green-500/20 border border-green-500/30'
                                                    : 'bg-slate-800/50 border border-slate-600'
                                                    }`}
                                            >
                                                {chapter.completed ? (
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className={`text-xs ${chapter.completed ? 'text-green-300' : 'text-gray-300'}`}>
                                                    Ch {chapter.id}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Achievements */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center ${achievement.unlocked ? 'border-amber-500/30 bg-amber-500/10' : ''
                                    }`}
                            >
                                <achievement.icon className={`w-8 h-8 mx-auto mb-3 ${achievement.unlocked ? 'text-amber-400' : 'text-gray-400'
                                    }`} />
                                <h3 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-amber-300' : 'text-gray-300'
                                    }`}>
                                    {achievement.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>

                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${achievement.unlocked
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                                            : 'bg-gradient-to-r from-gray-600 to-gray-700'
                                            }`}
                                        style={{ width: `${achievement.progress}%` }}
                                    ></div>
                                </div>

                                <p className="text-xs text-gray-400 mt-2">
                                    {achievement.progress.toFixed(0)}% complete
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Next Steps */}
                <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6`}>
                    <h2 className="text-xl font-bold text-white mb-4">🎯 Recommended Next Steps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {completedChapters < 5 && (
                            <Link
                                href={`/chapter${completedChapters + 1}`}
                                className="flex items-center justify-between p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <h4 className="font-medium text-blue-300">Continue Foundation Track</h4>
                                        <p className="text-sm text-gray-300">Complete Chapter {completedChapters + 1}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}

                        <Link
                            href="/calculators"
                            className="flex items-center justify-between p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Calculator className="w-5 h-5 text-purple-400" />
                                <div>
                                    <h4 className="font-medium text-purple-300">Practice with Calculators</h4>
                                    <p className="text-sm text-gray-300">Try the new Credit Score Simulator</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

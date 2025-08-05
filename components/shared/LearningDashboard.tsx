'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    useLearningAnalytics,
    useSpacedRepetition,
    SpacedRepetitionCard,
    LearningPerformance
} from '@/lib/algorithms/learningAnalytics';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { AreaChart, BarChart, DonutChart } from '@/components/shared/charts/ProfessionalCharts';
import {
    Brain,
    Target,
    TrendingUp,
    Clock,
    BookOpen,
    Award,
    Lightbulb,
    BarChart3,
    CheckCircle,
    AlertCircle,
    Calendar
} from 'lucide-react';

export default function LearningDashboard() {
    const { userProgress } = useProgressStore();
    const learningAnalytics = useLearningAnalytics();
    const { cards, dueCards, updateCard } = useSpacedRepetition('dashboard');
    const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

    // Generate mock progress data for charts
    const progressData = React.useMemo(() => {
        const days = selectedTimeframe === 'week' ? 7 : selectedTimeframe === 'month' ? 30 : 90;
        const data = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            // Simulate learning progress with some variance
            const baseScore = 60 + (i / days) * 30; // Growth over time
            const variance = Math.sin(i * 0.2) * 10; // Some natural variation
            const score = Math.min(100, Math.max(0, baseScore + variance));

            data.push({
                x: date,
                y: score
            });
        }

        return data;
    }, [selectedTimeframe]);

    // Generate concept mastery data
    const conceptMasteryData = React.useMemo(() => {
        if (!learningAnalytics) return [];

        const concepts = [
            'Budgeting',
            'Investing',
            'Credit Management',
            'Emergency Funds',
            'Retirement Planning',
            'Tax Planning'
        ];

        return concepts.map((concept, index) => ({
            category: concept,
            value: 60 + Math.random() * 40, // Random mastery level
            color: index % 2 === 0 ? theme.colors.blue[500] : theme.colors.emerald[500]
        }));
    }, [learningAnalytics]);

    // Generate time allocation data
    const timeAllocationData = React.useMemo(() => {
        return [
            { label: 'Lessons', value: 45, color: theme.colors.blue[500] },
            { label: 'Calculators', value: 30, color: theme.colors.emerald[500] },
            { label: 'Quizzes', value: 20, color: theme.colors.amber[500] },
            { label: 'AI Coaching', value: 5, color: theme.colors.purple[500] }
        ];
    }, []);

    const handleSpacedRepetitionResponse = (cardId: string, performance: LearningPerformance) => {
        updateCard(cardId, performance);
    };

    return (
        <div className={`min-h-screen ${theme.backgrounds.primary} py-8`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
                        AI-Powered Learning Dashboard
                    </h1>
                    <p className={`${theme.textColors.secondary} text-lg`}>
                        Advanced analytics and personalized insights for optimal financial literacy learning
                    </p>
                </motion.div>

                {/* Key Metrics */}
                {learningAnalytics && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <Target className="w-8 h-8 text-blue-400" />
                                <span className="text-2xl font-bold text-white">
                                    {(learningAnalytics.predictedMastery * 100).toFixed(1)}%
                                </span>
                            </div>
                            <h3 className="text-blue-400 font-medium">Mastery Level</h3>
                            <p className={`${theme.textColors.secondary} text-sm mt-1`}>
                                Overall financial literacy progress
                            </p>
                        </div>

                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                                <span className="text-2xl font-bold text-white">
                                    {learningAnalytics.learningVelocity.toFixed(1)}
                                </span>
                            </div>
                            <h3 className="text-emerald-400 font-medium">Learning Velocity</h3>
                            <p className={`${theme.textColors.secondary} text-sm mt-1`}>
                                Concepts mastered per hour
                            </p>
                        </div>

                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <Brain className="w-8 h-8 text-amber-400" />
                                <span className="text-2xl font-bold text-white">
                                    {(learningAnalytics.retentionRate * 100).toFixed(1)}%
                                </span>
                            </div>
                            <h3 className="text-amber-400 font-medium">Retention Rate</h3>
                            <p className={`${theme.textColors.secondary} text-sm mt-1`}>
                                Knowledge retention over time
                            </p>
                        </div>

                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}>
                            <div className="flex items-center justify-between mb-4">
                                <Clock className="w-8 h-8 text-purple-400" />
                                <span className="text-2xl font-bold text-white">
                                    {dueCards.length}
                                </span>
                            </div>
                            <h3 className="text-purple-400 font-medium">Due for Review</h3>
                            <p className={`${theme.textColors.secondary} text-sm mt-1`}>
                                Spaced repetition cards ready
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Learning Progress Over Time */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} flex items-center`}>
                                <BarChart3 className="mr-2 w-6 h-6" />
                                Learning Progress
                            </h3>
                            <div className="flex space-x-2">
                                {(['week', 'month', 'quarter'] as const).map((timeframe) => (
                                    <button
                                        key={timeframe}
                                        onClick={() => setSelectedTimeframe(timeframe)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedTimeframe === timeframe
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                    >
                                        {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <AreaChart
                            data={progressData}
                            color={theme.colors.blue[500]}
                            height={300}
                            fillGradient={true}
                        />
                    </motion.div>

                    {/* Time Allocation */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
                    >
                        <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6 flex items-center`}>
                            <Clock className="mr-2 w-6 h-6" />
                            Learning Time Allocation
                        </h3>
                        <DonutChart
                            data={timeAllocationData}
                            height={300}
                            showLegend={true}
                        />
                    </motion.div>
                </div>

                {/* Concept Mastery and Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Concept Mastery */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`lg:col-span-2 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
                    >
                        <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6 flex items-center`}>
                            <Award className="mr-2 w-6 h-6" />
                            Concept Mastery Levels
                        </h3>
                        <BarChart
                            data={conceptMasteryData}
                            title="Mastery by Topic"
                            height={300}
                        />
                    </motion.div>

                    {/* AI Recommendations */}
                    {learningAnalytics && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className={`${theme.backgrounds.glass} border ${theme.borderColors.accent} rounded-xl p-6`}
                        >
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6 flex items-center`}>
                                <Lightbulb className="mr-2 w-6 h-6 text-amber-400" />
                                AI Recommendations
                            </h3>

                            <div className="space-y-4">
                                {/* Struggling Concepts */}
                                {learningAnalytics.strugglingConcepts.length > 0 && (
                                    <div>
                                        <h4 className="text-red-400 font-medium mb-2 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            Review Needed
                                        </h4>
                                        <div className="space-y-2">
                                            {learningAnalytics.strugglingConcepts.slice(0, 3).map((concept, index) => (
                                                <div key={index} className="bg-red-500/15 border border-red-500/30 rounded-lg p-3">
                                                    <span className="text-red-300 text-sm">{concept}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Mastered Concepts */}
                                {learningAnalytics.masteredConcepts.length > 0 && (
                                    <div>
                                        <h4 className="text-emerald-400 font-medium mb-2 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Mastered
                                        </h4>
                                        <div className="space-y-2">
                                            {learningAnalytics.masteredConcepts.slice(0, 3).map((concept, index) => (
                                                <div key={index} className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg p-3">
                                                    <span className="text-emerald-300 text-sm">{concept}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Optimal Study Time */}
                                <div className="bg-blue-500/15 border border-blue-500/30 rounded-lg p-3">
                                    <h4 className="text-blue-400 font-medium mb-1 flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        Optimal Study Time
                                    </h4>
                                    <span className="text-blue-300 text-sm">
                                        {learningAnalytics.optimalStudyTime.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Spaced Repetition Section */}
                {dueCards.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className={`${theme.backgrounds.glass} border ${theme.borderColors.accent} rounded-xl p-6`}
                    >
                        <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6 flex items-center`}>
                            <BookOpen className="mr-2 w-6 h-6 text-amber-400" />
                            Spaced Repetition Review ({dueCards.length} cards due)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dueCards.slice(0, 6).map((card) => (
                                <div key={card.id} className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                                    <h4 className="text-white font-medium mb-2">{card.concept}</h4>
                                    <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                                        <span>Difficulty: {['Easy', 'Medium', 'Hard'][card.difficulty]}</span>
                                        <span>Rep: {card.repetitions}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleSpacedRepetitionResponse(card.id, {
                                                accuracy: 1,
                                                speed: 5,
                                                confidence: 5,
                                                responseTime: 5000
                                            })}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-3 rounded"
                                        >
                                            Easy
                                        </button>
                                        <button
                                            onClick={() => handleSpacedRepetitionResponse(card.id, {
                                                accuracy: 0.8,
                                                speed: 10,
                                                confidence: 3,
                                                responseTime: 10000
                                            })}
                                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 px-3 rounded"
                                        >
                                            Good
                                        </button>
                                        <button
                                            onClick={() => handleSpacedRepetitionResponse(card.id, {
                                                accuracy: 0.3,
                                                speed: 20,
                                                confidence: 1,
                                                responseTime: 20000
                                            })}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded"
                                        >
                                            Hard
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

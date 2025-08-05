'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { useEnhancedProgress } from '@/lib/store/progressHooks';
import AdaptiveLearningEngine from '@/lib/ai/AdaptiveLearningEngine';
import { theme } from '@/lib/theme';
import {
    TrendingUp,
    Target,
    Brain,
    Clock,
    Award,
    BookOpen,
    Calculator,
    Zap,
    Star,
    ChevronRight,
    Calendar,
    BarChart3,
    Lightbulb,
    CheckCircle,
    ArrowUp
} from 'lucide-react';

interface LearningInsight {
    type: 'strength' | 'improvement' | 'recommendation' | 'achievement';
    title: string;
    description: string;
    action?: string;
    actionUrl?: string;
    score?: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

interface PersonalizedGoal {
    id: string;
    type: 'daily' | 'weekly' | 'monthly';
    title: string;
    description: string;
    progress: number;
    target: number;
    unit: string;
    deadline: Date;
    priority: 'low' | 'medium' | 'high';
}

export const PersonalizedLearningDashboard: React.FC = () => {
    const { userProgress } = useProgressStore();
    const { getUserRank, getEngagementScore } = useEnhancedProgress();
    const learningEngine = AdaptiveLearningEngine.getInstance();

    // Generate personalized insights
    const insights = useMemo((): LearningInsight[] => {
        const analysis = learningEngine.analyzeUserPerformance(userProgress);
        const insights: LearningInsight[] = [];

        // Strengths
        if (analysis.strengths.length > 0) {
            insights.push({
                type: 'strength',
                title: 'Your Top Strength',
                description: `You excel in ${analysis.strengths[0]} with high confidence`,
                icon: Star,
                color: 'text-green-400 bg-green-500/20'
            });
        }

        // Areas for improvement
        if (analysis.weaknesses.length > 0) {
            insights.push({
                type: 'improvement',
                title: 'Growth Opportunity',
                description: `Focus on ${analysis.weaknesses[0]} to boost your overall score`,
                action: 'Practice Now',
                actionUrl: '/calculators',
                icon: TrendingUp,
                color: 'text-amber-400 bg-amber-500/20'
            });
        }

        // Learning style insight
        insights.push({
            type: 'recommendation',
            title: 'Personalized Learning Style',
            description: `You learn best through ${analysis.learningStyle} - we've tailored your content accordingly`,
            icon: Brain,
            color: 'text-purple-400 bg-purple-500/20'
        });

        // Recent achievement
        if (userProgress.achievements.length > 0) {
            const latestAchievement = userProgress.achievements[userProgress.achievements.length - 1];
            insights.push({
                type: 'achievement',
                title: 'Recent Achievement',
                description: `Latest achievement unlocked!`,
                score: 50, // Default XP value
                icon: Award,
                color: 'text-blue-400 bg-blue-500/20'
            });
        }

        return insights;
    }, [userProgress, learningEngine]);

    // Generate personalized goals
    const personalizedGoals = useMemo((): PersonalizedGoal[] => {
        const goals: PersonalizedGoal[] = [];
        const now = new Date();

        // Daily goal - based on current streak and engagement
        const dailyTarget = Math.max(1, Math.floor(userProgress.streakDays / 7) + 1);
        const today = now.toDateString();
        const dailyProgress = userProgress.completedLessons.filter(lessonId => {
            // For simplicity, assume recent lessons count toward daily progress
            return true; // This would need actual completion date tracking
        }).length > 0 ? 1 : 0;

        goals.push({
            id: 'daily-lessons',
            type: 'daily',
            title: 'Daily Learning Target',
            description: 'Complete lessons to maintain your streak',
            progress: dailyProgress,
            target: dailyTarget,
            unit: 'lessons',
            deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
            priority: 'high'
        });

        // Weekly goal - adaptive based on performance
        const weeklyTarget = userProgress.weeklyGoal;
        goals.push({
            id: 'weekly-progress',
            type: 'weekly',
            title: 'Weekly Learning Goal',
            description: 'Stay on track with your weekly commitment',
            progress: userProgress.weeklyProgress,
            target: weeklyTarget,
            unit: 'lessons',
            deadline: new Date(now.getTime() + (7 - now.getDay()) * 24 * 60 * 60 * 1000),
            priority: 'medium'
        });

        // Monthly XP goal
        const monthlyXpTarget = 1000 + (userProgress.userLevel * 200);
        const currentMonthXp = userProgress.totalXP || 0;
        goals.push({
            id: 'monthly-xp',
            type: 'monthly',
            title: 'Monthly XP Challenge',
            description: 'Earn XP through consistent learning and achievements',
            progress: currentMonthXp,
            target: monthlyXpTarget,
            unit: 'XP',
            deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0),
            priority: 'low'
        });

        return goals;
    }, [userProgress]);

    const learningStats = useMemo(() => {
        const totalLessons = userProgress.completedLessons.length;
        const totalQuizzes = Object.keys(userProgress.quizScores).length;
        const quizScores = Object.values(userProgress.quizScores);
        const avgQuizScore = totalQuizzes > 0 ?
            quizScores.reduce((sum: number, score: any) => sum + (score.score || score), 0) / totalQuizzes : 0;

        const rankInfo = getUserRank();
        const rank = typeof rankInfo === 'object' ? rankInfo.rank : rankInfo;

        return {
            totalLessons,
            totalQuizzes,
            avgQuizScore: Math.round(avgQuizScore),
            currentStreak: userProgress.streakDays,
            userRank: rank,
            engagementScore: getEngagementScore()
        };
    }, [userProgress, getUserRank, getEngagementScore]);

    const getGoalProgress = (goal: PersonalizedGoal) => {
        return Math.min((goal.progress / goal.target) * 100, 100);
    };

    const getTimeUntilDeadline = (deadline: Date) => {
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        return 'Soon';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                            Your Learning Journey
                        </h2>
                        <p className={`${theme.textColors.secondary}`}>
                            Personalized insights and recommendations powered by AI
                        </p>
                    </div>
                    <div className={`text-right`}>
                        <div className={`text-3xl font-bold ${theme.textColors.accent}`}>
                            Level {userProgress.userLevel}
                        </div>
                        <div className={`text-sm ${theme.textColors.muted}`}>
                            Rank #{learningStats.userRank}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`${theme.backgrounds.glass}/10 rounded-lg p-4 text-center`}>
                        <BookOpen className={`w-6 h-6 ${theme.textColors.accent} mx-auto mb-2`} />
                        <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                            {learningStats.totalLessons}
                        </div>
                        <div className={`text-sm ${theme.textColors.muted}`}>Lessons</div>
                    </div>

                    <div className={`${theme.backgrounds.glass}/10 rounded-lg p-4 text-center`}>
                        <Target className={`w-6 h-6 ${theme.textColors.accent} mx-auto mb-2`} />
                        <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                            {learningStats.avgQuizScore}%
                        </div>
                        <div className={`text-sm ${theme.textColors.muted}`}>Avg Score</div>
                    </div>

                    <div className={`${theme.backgrounds.glass}/10 rounded-lg p-4 text-center`}>
                        <Zap className={`w-6 h-6 ${theme.textColors.accent} mx-auto mb-2`} />
                        <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                            {learningStats.currentStreak}
                        </div>
                        <div className={`text-sm ${theme.textColors.muted}`}>Day Streak</div>
                    </div>

                    <div className={`${theme.backgrounds.glass}/10 rounded-lg p-4 text-center`}>
                        <BarChart3 className={`w-6 h-6 ${theme.textColors.accent} mx-auto mb-2`} />
                        <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                            {learningStats.engagementScore}%
                        </div>
                        <div className={`text-sm ${theme.textColors.muted}`}>Engagement</div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personalized Goals */}
                <motion.div
                    className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center mb-4">
                        <Target className={`w-5 h-5 ${theme.textColors.accent} mr-2`} />
                        <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                            Personal Goals
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {personalizedGoals.map((goal, index) => (
                            <motion.div
                                key={goal.id}
                                className={`${theme.backgrounds.glass}/10 border ${theme.borderColors.primary} rounded-lg p-4`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className={`font-medium ${theme.textColors.primary}`}>
                                        {goal.title}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <Clock className={`w-4 h-4 ${theme.textColors.muted}`} />
                                        <span className={`text-sm ${theme.textColors.muted}`}>
                                            {getTimeUntilDeadline(goal.deadline)}
                                        </span>
                                    </div>
                                </div>

                                <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                                    {goal.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className={`w-full bg-slate-700/30 rounded-full h-2`}>
                                            <motion.div
                                                className={`h-2 rounded-full ${goal.priority === 'high' ? 'bg-green-500' :
                                                        goal.priority === 'medium' ? 'bg-blue-500' : 'bg-purple-500'
                                                    }`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${getGoalProgress(goal)}%` }}
                                                transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                                            />
                                        </div>
                                    </div>
                                    <span className={`ml-3 text-sm font-medium ${theme.textColors.primary}`}>
                                        {goal.progress}/{goal.target} {goal.unit}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* AI Insights */}
                <motion.div
                    className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center mb-4">
                        <Brain className={`w-5 h-5 ${theme.textColors.accent} mr-2`} />
                        <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                            AI Insights
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {insights.map((insight, index) => {
                            const IconComponent = insight.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className={`${theme.backgrounds.glass}/10 border ${theme.borderColors.primary} rounded-lg p-4 hover:${theme.backgrounds.glass}/20 transition-colors group`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 ${insight.color} rounded-lg flex-shrink-0`}>
                                            <IconComponent className="w-4 h-4" />
                                        </div>

                                        <div className="flex-1">
                                            <h4 className={`font-medium ${theme.textColors.primary} mb-1`}>
                                                {insight.title}
                                            </h4>
                                            <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                                                {insight.description}
                                            </p>

                                            {insight.score && (
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Zap className={`w-4 h-4 ${theme.textColors.accent}`} />
                                                    <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                                                        +{insight.score} XP
                                                    </span>
                                                </div>
                                            )}

                                            {insight.action && insight.actionUrl && (
                                                <button
                                                    onClick={() => window.location.href = insight.actionUrl!}
                                                    className={`inline-flex items-center text-sm ${theme.textColors.accent} hover:${theme.textColors.primary} transition-colors group-hover:translate-x-1 transition-transform`}
                                                >
                                                    {insight.action}
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Recommended Next Actions */}
            <motion.div
                className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center mb-4">
                    <Lightbulb className={`w-5 h-5 ${theme.textColors.accent} mr-2`} />
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                        Recommended Next Steps
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                        className={`${theme.backgrounds.glass}/10 border ${theme.borderColors.primary} rounded-lg p-4 text-left hover:${theme.backgrounds.glass}/20 transition-colors group`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/chapter1'}
                    >
                        <BookOpen className={`w-6 h-6 ${theme.textColors.accent} mb-3`} />
                        <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>
                            Continue Learning
                        </h4>
                        <p className={`text-sm ${theme.textColors.secondary}`}>
                            Pick up where you left off in your current chapter
                        </p>
                        <div className="flex items-center mt-3 text-sm text-blue-400 group-hover:text-blue-300">
                            Start Learning <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </motion.button>

                    <motion.button
                        className={`${theme.backgrounds.glass}/10 border ${theme.borderColors.primary} rounded-lg p-4 text-left hover:${theme.backgrounds.glass}/20 transition-colors group`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/calculators'}
                    >
                        <Calculator className={`w-6 h-6 ${theme.textColors.accent} mb-3`} />
                        <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>
                            Practice Calculations
                        </h4>
                        <p className={`text-sm ${theme.textColors.secondary}`}>
                            Use our financial calculators to reinforce concepts
                        </p>
                        <div className="flex items-center mt-3 text-sm text-purple-400 group-hover:text-purple-300">
                            Practice Now <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </motion.button>

                    <motion.button
                        className={`${theme.backgrounds.glass}/10 border ${theme.borderColors.primary} rounded-lg p-4 text-left hover:${theme.backgrounds.glass}/20 transition-colors group`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/assessment'}
                    >
                        <CheckCircle className={`w-6 h-6 ${theme.textColors.accent} mb-3`} />
                        <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>
                            Take Assessment
                        </h4>
                        <p className={`text-sm ${theme.textColors.secondary}`}>
                            Test your knowledge and identify areas to improve
                        </p>
                        <div className="flex items-center mt-3 text-sm text-green-400 group-hover:text-green-300">
                            Start Quiz <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default PersonalizedLearningDashboard;

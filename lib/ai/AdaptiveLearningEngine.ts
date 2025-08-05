'use client';

import { useProgressStore } from '@/lib/store/progressStore';

export interface LearningPath {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number; // in hours
    prerequisites: string[];
    chapters: number[];
    skills: string[];
    outcomes: string[];
}

export interface AdaptiveLearningRecommendation {
    type: 'accelerate' | 'reinforce' | 'remediate' | 'challenge';
    confidence: number; // 0-100
    reason: string;
    action: {
        type: 'skip_ahead' | 'extra_practice' | 'review_fundamentals' | 'advanced_content';
        target: string;
        description: string;
    };
    estimatedBenefit: number; // 0-100
}

class AdaptiveLearningEngine {
    private static instance: AdaptiveLearningEngine;

    static getInstance(): AdaptiveLearningEngine {
        if (!AdaptiveLearningEngine.instance) {
            AdaptiveLearningEngine.instance = new AdaptiveLearningEngine();
        }
        return AdaptiveLearningEngine.instance;
    }

    // Analyze user's learning patterns and performance
    analyzeUserPerformance(userProgress: any): {
        strengths: string[];
        weaknesses: string[];
        learningStyle: 'visual' | 'analytical' | 'practical' | 'mixed';
        pace: 'fast' | 'steady' | 'careful';
        confidence: number;
    } {
        const quizScores = Object.values(userProgress.quizScores) as number[];
        const avgScore = quizScores.length > 0 ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length : 0;

        // Analyze learning velocity
        const lessonsPerWeek = userProgress.learningAnalytics.learningVelocity;
        const retentionRate = userProgress.learningAnalytics.retentionRate;

        // Determine learning style based on behavior
        const calculatorUsage = Object.keys(userProgress.calculatorUsage).length;
        const totalLessons = userProgress.completedLessons.length;
        const practicalRatio = calculatorUsage / Math.max(1, totalLessons);

        let learningStyle: 'visual' | 'analytical' | 'practical' | 'mixed' = 'mixed';
        if (practicalRatio > 0.8) learningStyle = 'practical';
        else if (avgScore > 90 && retentionRate > 85) learningStyle = 'analytical';
        else if (userProgress.totalTimeSpent / Math.max(1, totalLessons) < 10) learningStyle = 'visual';

        // Determine pace
        let pace: 'fast' | 'steady' | 'careful' = 'steady';
        if (lessonsPerWeek > 5) pace = 'fast';
        else if (lessonsPerWeek < 2) pace = 'careful';

        // Calculate confidence based on multiple factors
        const confidence = Math.min(100, Math.max(0,
            (avgScore * 0.4) +
            (retentionRate * 0.3) +
            (userProgress.streakDays * 2) +
            (Math.min(50, userProgress.completedLessons.length * 2))
        ));

        return {
            strengths: this.identifyStrengths(userProgress),
            weaknesses: userProgress.strugglingTopics || [],
            learningStyle,
            pace,
            confidence
        };
    }

    private identifyStrengths(userProgress: any): string[] {
        const strengths: string[] = [];
        const quizScores = userProgress.quizScores;

        // High-performing areas
        Object.entries(quizScores).forEach(([quiz, score]) => {
            if ((score as number) >= 90) {
                const topic = quiz.replace('-quiz', '').replace('chapter', 'Chapter ');
                strengths.push(topic);
            }
        });

        // Consistency
        if (userProgress.streakDays >= 7) {
            strengths.push('Consistent Learning');
        }

        // Calculator usage
        if (Object.keys(userProgress.calculatorUsage).length >= 5) {
            strengths.push('Practical Application');
        }

        // Quick learner
        if (userProgress.learningAnalytics.learningVelocity > 3) {
            strengths.push('Fast Learner');
        }

        return strengths;
    }

    generateRecommendations(userProgress: any): AdaptiveLearningRecommendation[] {
        const analysis = this.analyzeUserPerformance(userProgress);
        const recommendations: AdaptiveLearningRecommendation[] = [];

        // High performer - accelerate
        if (analysis.confidence > 80 && analysis.pace === 'fast') {
            recommendations.push({
                type: 'accelerate',
                confidence: 85,
                reason: `Your ${analysis.confidence}% confidence and fast pace suggest you're ready for advanced content`,
                action: {
                    type: 'skip_ahead',
                    target: `chapter${userProgress.currentChapter + 2}`,
                    description: 'Skip ahead to more challenging material'
                },
                estimatedBenefit: 75
            });
        }

        // Struggling learner - remediate
        if (analysis.weaknesses.length >= 2 || analysis.confidence < 60) {
            recommendations.push({
                type: 'remediate',
                confidence: 90,
                reason: `Multiple struggling areas detected: ${analysis.weaknesses.join(', ')}`,
                action: {
                    type: 'review_fundamentals',
                    target: analysis.weaknesses[0] || 'fundamentals',
                    description: 'Review and strengthen foundational concepts'
                },
                estimatedBenefit: 80
            });
        }

        // Practical learner
        if (analysis.learningStyle === 'practical') {
            recommendations.push({
                type: 'challenge',
                confidence: 75,
                reason: 'Your practical learning style suggests hands-on activities will boost engagement',
                action: {
                    type: 'advanced_content',
                    target: 'calculators',
                    description: 'Explore advanced calculator features and real-world scenarios'
                },
                estimatedBenefit: 70
            });
        }

        // Reinforce for steady learners
        if (analysis.pace === 'steady' && analysis.confidence > 70) {
            recommendations.push({
                type: 'reinforce',
                confidence: 80,
                reason: 'Your steady progress shows you benefit from reinforcement',
                action: {
                    type: 'extra_practice',
                    target: 'current_chapter',
                    description: 'Additional practice problems to solidify understanding'
                },
                estimatedBenefit: 65
            });
        }

        return recommendations.sort((a, b) => b.estimatedBenefit - a.estimatedBenefit);
    }

    // Predict optimal next chapter based on readiness
    predictOptimalPath(userProgress: any): {
        recommendedChapter: number;
        confidence: number;
        reasoning: string;
        alternativePaths: Array<{
            chapter: number;
            reason: string;
            suitability: number;
        }>;
    } {
        const analysis = this.analyzeUserPerformance(userProgress);
        const currentChapter = userProgress.currentChapter;

        // Default next chapter
        let recommendedChapter = currentChapter + 1;
        let confidence = 70;
        let reasoning = "Standard progression based on curriculum sequence";

        // Advanced learner - might skip ahead
        if (analysis.confidence > 85 && analysis.pace === 'fast') {
            recommendedChapter = Math.min(17, currentChapter + 2);
            confidence = 80;
            reasoning = "Fast learner ready for accelerated progression";
        }

        // Struggling learner - might need review
        if (analysis.confidence < 60 || analysis.weaknesses.length > 2) {
            recommendedChapter = currentChapter; // Stay in current chapter
            confidence = 85;
            reasoning = "Recommend reinforcing current material before advancing";
        }

        // Practical learner - suggest calculator-heavy chapters
        if (analysis.learningStyle === 'practical' && currentChapter >= 3) {
            const practicalChapters = [7, 8, 12, 13]; // Investment and calculation-heavy chapters
            const nextPractical = practicalChapters.find(ch => ch > currentChapter);
            if (nextPractical) {
                recommendedChapter = nextPractical;
                confidence = 75;
                reasoning = "Practical learner will benefit from calculation-intensive content";
            }
        }

        return {
            recommendedChapter,
            confidence,
            reasoning,
            alternativePaths: [
                {
                    chapter: currentChapter + 1,
                    reason: "Standard progression",
                    suitability: 70
                },
                {
                    chapter: Math.max(1, currentChapter - 1),
                    reason: "Review and reinforce",
                    suitability: analysis.confidence < 70 ? 80 : 30
                },
                {
                    chapter: Math.min(17, currentChapter + 2),
                    reason: "Accelerated path",
                    suitability: analysis.confidence > 80 ? 75 : 25
                }
            ]
        };
    }

    // Generate personalized learning goals
    generateLearningGoals(userProgress: any): Array<{
        id: string;
        title: string;
        description: string;
        type: 'weekly' | 'monthly' | 'skill' | 'milestone';
        target: number;
        current: number;
        deadline: Date;
        priority: 'high' | 'medium' | 'low';
    }> {
        const analysis = this.analyzeUserPerformance(userProgress);
        const goals = [];

        // Weekly lesson goal
        const currentWeeklyRate = userProgress.learningAnalytics.learningVelocity;
        const recommendedWeeklyRate = analysis.pace === 'fast' ? 6 : analysis.pace === 'careful' ? 2 : 4;

        goals.push({
            id: 'weekly_lessons',
            title: 'Weekly Learning Target',
            description: `Complete ${recommendedWeeklyRate} lessons this week`,
            type: 'weekly' as const,
            target: recommendedWeeklyRate,
            current: userProgress.weeklyProgress,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            priority: 'high' as const
        });

        // Quiz improvement goal
        if (userProgress.learningAnalytics.averageQuizScore < 85) {
            goals.push({
                id: 'quiz_improvement',
                title: 'Quiz Mastery',
                description: 'Achieve 85% average quiz score',
                type: 'skill' as const,
                target: 85,
                current: Math.round(userProgress.learningAnalytics.averageQuizScore),
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                priority: 'medium' as const
            });
        }

        // Streak goal
        if (userProgress.streakDays < 14) {
            goals.push({
                id: 'streak_building',
                title: '14-Day Learning Streak',
                description: 'Build a consistent 14-day learning streak',
                type: 'milestone' as const,
                target: 14,
                current: userProgress.streakDays,
                deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                priority: userProgress.streakDays < 3 ? 'high' as const : 'medium' as const
            });
        }

        // Calculator exploration
        const calculatorGoal = Math.min(10, userProgress.currentChapter * 2);
        if (Object.keys(userProgress.calculatorUsage).length < calculatorGoal) {
            goals.push({
                id: 'calculator_exploration',
                title: 'Practical Application',
                description: `Try ${calculatorGoal} different financial calculators`,
                type: 'skill' as const,
                target: calculatorGoal,
                current: Object.keys(userProgress.calculatorUsage).length,
                deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                priority: 'low' as const
            });
        }

        return goals.sort((a, b) => {
            const priorityScore = { high: 3, medium: 2, low: 1 };
            return priorityScore[b.priority] - priorityScore[a.priority];
        });
    }
}

// Hook for using the adaptive learning engine
export const useAdaptiveLearning = () => {
    const userProgress = useProgressStore(state => state.userProgress);
    const engine = AdaptiveLearningEngine.getInstance();

    return {
        analyzePerformance: () => engine.analyzeUserPerformance(userProgress),
        getRecommendations: () => engine.generateRecommendations(userProgress),
        getOptimalPath: () => engine.predictOptimalPath(userProgress),
        getLearningGoals: () => engine.generateLearningGoals(userProgress),

        // Quick access methods
        getPersonalizedDifficulty: () => {
            const analysis = engine.analyzeUserPerformance(userProgress);
            if (analysis.confidence > 80) return 'challenging';
            if (analysis.confidence < 60) return 'supportive';
            return 'balanced';
        },

        getRecommendedStudyTime: () => {
            const analysis = engine.analyzeUserPerformance(userProgress);
            if (analysis.pace === 'fast') return 15; // minutes per session
            if (analysis.pace === 'careful') return 30;
            return 20;
        },

        shouldShowAdvancedFeatures: () => {
            const analysis = engine.analyzeUserPerformance(userProgress);
            return analysis.confidence > 75 && userProgress.completedLessons.length >= 5;
        }
    };
};

export default AdaptiveLearningEngine;

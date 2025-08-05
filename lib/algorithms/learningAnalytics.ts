'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';

// Spaced Repetition Algorithm (SM2) Implementation
export interface SpacedRepetitionCard {
    id: string;
    concept: string;
    difficulty: number; // 0 = easy, 1 = medium, 2 = hard
    easeFactor: number; // 1.3 - 2.5
    interval: number; // days until next review
    repetitions: number;
    lastReviewed: Date;
    nextReview: Date;
    isNew: boolean;
}

export interface LearningPerformance {
    accuracy: number; // 0-1
    speed: number; // seconds per question
    confidence: number; // self-reported 1-5
    responseTime: number;
}

export interface LearningAnalytics {
    strugglingConcepts: string[];
    masteredConcepts: string[];
    optimalStudyTime: Date;
    predictedMastery: number; // 0-1
    recommendedPath: string[];
    cognitiveLoad: number; // 0-1
    retentionRate: number; // 0-1
    learningVelocity: number; // concepts per hour
}

class SpacedRepetitionEngine {
    private static instance: SpacedRepetitionEngine;

    public static getInstance(): SpacedRepetitionEngine {
        if (!SpacedRepetitionEngine.instance) {
            SpacedRepetitionEngine.instance = new SpacedRepetitionEngine();
        }
        return SpacedRepetitionEngine.instance;
    }

    // SM2 Algorithm Implementation
    calculateNextReview(
        card: SpacedRepetitionCard,
        performance: LearningPerformance
    ): SpacedRepetitionCard {
        const { accuracy, confidence } = performance;
        const quality = this.mapPerformanceToQuality(accuracy, confidence);

        let { easeFactor, interval, repetitions } = card;

        if (quality >= 3) {
            // Correct response
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions += 1;
        } else {
            // Incorrect response - reset
            repetitions = 0;
            interval = 1;
        }

        // Update ease factor
        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        easeFactor = Math.max(1.3, easeFactor); // Minimum ease factor

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        return {
            ...card,
            easeFactor,
            interval,
            repetitions,
            lastReviewed: new Date(),
            nextReview,
            isNew: false
        };
    }

    private mapPerformanceToQuality(accuracy: number, confidence: number): number {
        // Map accuracy (0-1) and confidence (1-5) to SM2 quality (0-5)
        const accuracyWeight = 0.7;
        const confidenceWeight = 0.3;

        const normalizedConfidence = (confidence - 1) / 4; // Normalize to 0-1
        const combined = accuracy * accuracyWeight + normalizedConfidence * confidenceWeight;

        return Math.round(combined * 5);
    }

    // Get cards due for review
    getDueCards(cards: SpacedRepetitionCard[]): SpacedRepetitionCard[] {
        const now = new Date();
        return cards.filter(card => card.nextReview <= now);
    }

    // Adaptive difficulty adjustment
    getOptimalDifficulty(userStats: {
        averageAccuracy: number;
        averageSpeed: number;
        recentPerformance: unknown;
    }): number {
        const { averageAccuracy, averageSpeed } = userStats;

        if (averageAccuracy > 0.9 && averageSpeed < 10) return 2; // Hard
        if (averageAccuracy > 0.7 && averageSpeed < 20) return 1; // Medium
        return 0; // Easy
    }
}

// Advanced Learning Analytics Engine
class LearningAnalyticsEngine {
    private static instance: LearningAnalyticsEngine;

    public static getInstance(): LearningAnalyticsEngine {
        if (!LearningAnalyticsEngine.instance) {
            LearningAnalyticsEngine.instance = new LearningAnalyticsEngine();
        }
        return LearningAnalyticsEngine.instance;
    }

    // Analyze user's learning patterns
    analyzeLearningPatterns(userProgress: {
        completedLessons: string[];
        quizScores: Record<string, number>;
        calculatorUsage: Record<string, number>;
        totalTimeSpent: number;
    }): LearningAnalytics {
        const { completedLessons, quizScores, totalTimeSpent } = userProgress;

        // Calculate struggling concepts
        const strugglingConcepts = this.identifyStrugglingConcepts(quizScores);

        // Calculate mastered concepts
        const masteredConcepts = this.identifyMasteredConcepts(quizScores);

        // Predict optimal study time based on performance patterns
        const optimalStudyTime = this.predictOptimalStudyTime();

        // Calculate cognitive load
        const cognitiveLoad = this.calculateCognitiveLoad(userProgress);

        // Calculate retention rate
        const retentionRate = this.calculateRetentionRate(quizScores);

        // Calculate learning velocity
        const learningVelocity = this.calculateLearningVelocity(completedLessons, totalTimeSpent);

        // Generate recommended learning path
        const recommendedPath = this.generateRecommendedPath(strugglingConcepts, masteredConcepts);

        return {
            strugglingConcepts,
            masteredConcepts,
            optimalStudyTime,
            predictedMastery: this.predictMasteryLevel(userProgress),
            recommendedPath,
            cognitiveLoad,
            retentionRate,
            learningVelocity
        };
    }

    private identifyStrugglingConcepts(quizScores: Record<string, number>): string[] {
        return Object.entries(quizScores)
            .filter(([, score]) => score < 70)
            .map(([concept]) => concept)
            .slice(0, 5); // Top 5 struggling concepts
    }

    private identifyMasteredConcepts(quizScores: Record<string, number>): string[] {
        return Object.entries(quizScores)
            .filter(([, score]) => score >= 90)
            .map(([concept]) => concept);
    }

    private predictOptimalStudyTime(): Date {
        // Simple algorithm - can be enhanced with ML
        const hour = new Date().getHours();
        const bestHour = hour < 12 ? 10 : hour < 18 ? 14 : 20; // Morning, afternoon, or evening

        const optimal = new Date();
        optimal.setHours(bestHour, 0, 0, 0);

        return optimal;
    }

    private calculateCognitiveLoad(userProgress: {
        completedLessons: string[];
        quizScores: Record<string, number>;
        calculatorUsage: Record<string, number>;
        totalTimeSpent: number;
    }): number {
        const { completedLessons, totalTimeSpent } = userProgress;
        const recentLessons = completedLessons.slice(-5); // Last 5 lessons

        if (recentLessons.length === 0) return 0;

        const avgTimePerLesson = totalTimeSpent / completedLessons.length;
        const recentAvgTime = (totalTimeSpent * 0.3) / recentLessons.length; // Estimate recent time

        // Higher cognitive load if recent lessons take much longer than average
        const loadRatio = recentAvgTime / avgTimePerLesson;
        return Math.min(1, Math.max(0, (loadRatio - 1) * 2));
    }

    private calculateRetentionRate(quizScores: Record<string, number>): number {
        const scores = Object.values(quizScores);
        if (scores.length === 0) return 0;

        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return avgScore / 100; // Convert to 0-1 scale
    }

    private calculateLearningVelocity(completedLessons: string[], totalTimeSpent: number): number {
        if (totalTimeSpent === 0) return 0;

        const hoursSpent = totalTimeSpent / 60; // Convert minutes to hours
        return completedLessons.length / hoursSpent;
    }

    private predictMasteryLevel(userProgress: {
        completedLessons: string[];
        quizScores: Record<string, number>;
        calculatorUsage: Record<string, number>;
        totalTimeSpent: number;
    }): number {
        const { quizScores, completedLessons } = userProgress;
        const scores = Object.values(quizScores) as number[];

        if (scores.length === 0) return 0;

        const avgScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
        const completionRate = completedLessons.length / 17; // Assuming 17 total chapters

        return (avgScore / 100) * 0.7 + completionRate * 0.3;
    }

    private generateRecommendedPath(struggling: string[], mastered: string[]): string[] {
        // Prioritize struggling concepts, then new concepts
        const recommendations: string[] = [];

        // First, review struggling concepts
        struggling.forEach(concept => {
            recommendations.push(`Review: ${concept}`);
        });

        // Then suggest new concepts based on prerequisites
        const conceptMap: Record<string, string[]> = {
            'chapter1': ['Money Psychology', 'Financial Mindset'],
            'chapter2': ['Banking Basics', 'Account Types'],
            'chapter3': ['Budgeting', 'Cash Flow Management'],
            'chapter4': ['Emergency Funds', 'Financial Safety'],
            'chapter5': ['Income Optimization', 'Career Development'],
            'chapter6': ['Credit Management', 'Debt Strategies'],
            'chapter7': ['Investment Basics', 'Asset Classes'],
            'chapter8': ['Portfolio Construction', 'Diversification']
        };

        // Add new concept suggestions
        Object.entries(conceptMap).forEach(([chapter, concepts]) => {
            if (!mastered.includes(chapter)) {
                concepts.forEach(concept => {
                    recommendations.push(`Learn: ${concept}`);
                });
            }
        });

        return recommendations.slice(0, 10); // Top 10 recommendations
    }
}

// React Hook for Spaced Repetition
export function useSpacedRepetition(chapterId: string) {
    const [cards, setCards] = useState<SpacedRepetitionCard[]>([]);
    const [dueCards, setDueCards] = useState<SpacedRepetitionCard[]>([]);
    const engine = SpacedRepetitionEngine.getInstance();

    useEffect(() => {
        // Load cards from localStorage only on client side
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const savedCards = localStorage.getItem(`sr_cards_${chapterId}`);
            if (savedCards) {
                const parsedCards = JSON.parse(savedCards).map((card: {
                    id: string;
                    concept: string;
                    difficulty: number;
                    repetitions: number;
                    easeFactor: number;
                    interval: number;
                    lastReviewed: string;
                    nextReview: string;
                }) => ({
                    ...card,
                    lastReviewed: new Date(card.lastReviewed),
                    nextReview: new Date(card.nextReview)
                }));
                setCards(parsedCards);
                setDueCards(engine.getDueCards(parsedCards));
            }
        }
    }, [chapterId, engine]);

    const updateCard = (cardId: string, performance: LearningPerformance) => {
        setCards(prevCards => {
            const updatedCards = prevCards.map(card => {
                if (card.id === cardId) {
                    return engine.calculateNextReview(card, performance);
                }
                return card;
            });

            // Save to localStorage only on client side
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                localStorage.setItem(`sr_cards_${chapterId}`, JSON.stringify(updatedCards));
            }

            return updatedCards;
        });
    };

    const addCard = (concept: string, difficulty: number = 0) => {
        const newCard: SpacedRepetitionCard = {
            id: `${chapterId}_${Date.now()}`,
            concept,
            difficulty,
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            lastReviewed: new Date(),
            nextReview: new Date(),
            isNew: true
        };

        setCards(prev => {
            const updated = [...prev, newCard];
            // Save to localStorage only on client side
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                localStorage.setItem(`sr_cards_${chapterId}`, JSON.stringify(updated));
            }
            return updated;
        });
    };

    return {
        cards,
        dueCards,
        updateCard,
        addCard,
        totalCards: cards.length,
        dueCount: dueCards.length
    };
}

// React Hook for Learning Analytics
export function useLearningAnalytics() {
    const { userProgress } = useProgressStore();
    const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
    const engine = LearningAnalyticsEngine.getInstance();

    useEffect(() => {
        if (userProgress) {
            const analysis = engine.analyzeLearningPatterns(userProgress);
            setAnalytics(analysis);
        }
    }, [userProgress, engine]);

    return analytics;
}

export { SpacedRepetitionEngine, LearningAnalyticsEngine };

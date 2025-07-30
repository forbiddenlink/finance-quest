/**
 * Spaced Repetition Algorithm for Finance Quest
 * Based on the SM-2 algorithm with financial education optimizations
 */

export interface ReviewItem {
  conceptId: string;
  difficulty: number; // 0.0 - 3.0 (higher = more difficult)
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReviewDate: Date;
  lastReviewDate: Date;
  easeFactor: number; // 1.3 - 2.5 (higher = easier to remember)
  category: 'lesson' | 'quiz' | 'calculator' | 'scenario';
  chapterNumber: number;
  importance: 'low' | 'medium' | 'high' | 'critical'; // Financial importance
}

export interface ReviewResponse {
  quality: number; // 0-5 scale (0=complete failure, 5=perfect recall)
  timeSpent: number; // Seconds spent on review
  confidence: number; // 1-5 self-reported confidence
}

export class SpacedRepetitionSystem {
  private readonly MIN_EASE_FACTOR = 1.3;
  private readonly MAX_EASE_FACTOR = 2.5;
  private readonly FINANCIAL_IMPORTANCE_MULTIPLIER = {
    low: 1.0,
    medium: 1.2,
    high: 1.5,
    critical: 2.0 // Critical concepts reviewed more frequently
  };

  /**
   * Calculate next review interval using modified SM-2 algorithm
   * Enhanced for financial education with importance weighting
   */
  calculateNextReview(item: ReviewItem, response: ReviewResponse): ReviewItem {
    const { quality, timeSpent, confidence } = response;
    const now = new Date();
    
    // Update ease factor based on performance
    let newEaseFactor = item.easeFactor;
    if (quality >= 3) {
      // Successful recall
      newEaseFactor = Math.min(
        this.MAX_EASE_FACTOR,
        item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      );
    } else {
      // Failed recall - decrease ease factor
      newEaseFactor = Math.max(
        this.MIN_EASE_FACTOR,
        item.easeFactor - 0.2
      );
    }

    // Calculate base interval
    let newInterval: number;
    let newRepetitions = item.repetitions;

    if (quality < 3) {
      // Failed - reset to beginning
      newInterval = 1;
      newRepetitions = 0;
    } else {
      // Successful - calculate next interval
      newRepetitions += 1;
      
      if (newRepetitions === 1) {
        newInterval = 1;
      } else if (newRepetitions === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(item.interval * newEaseFactor);
      }
    }

    // Apply financial importance multiplier (more important = more frequent)
    const importanceMultiplier = this.FINANCIAL_IMPORTANCE_MULTIPLIER[item.importance];
    newInterval = Math.max(1, Math.round(newInterval / importanceMultiplier));

    // Confidence adjustment - low confidence means more frequent review
    if (confidence <= 2) {
      newInterval = Math.max(1, Math.round(newInterval * 0.7));
    } else if (confidence >= 4) {
      newInterval = Math.round(newInterval * 1.2);
    }

    // Time spent adjustment - struggled = more frequent review
    const averageTimeForConcept = this.getAverageTimeForConcept(item.category);
    if (timeSpent > averageTimeForConcept * 1.5) {
      newInterval = Math.max(1, Math.round(newInterval * 0.8));
    }

    // Calculate next review date
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      ...item,
      difficulty: this.updateDifficulty(item.difficulty, quality),
      interval: newInterval,
      repetitions: newRepetitions,
      nextReviewDate,
      lastReviewDate: now,
      easeFactor: newEaseFactor
    };
  }

  /**
   * Get concepts due for review
   */
  getDueForReview(items: ReviewItem[], maxItems: number = 10): ReviewItem[] {
    const now = new Date();
    const dueItems = items
      .filter(item => item.nextReviewDate <= now)
      .sort((a, b) => {
        // Priority order: 1) Overdue time, 2) Importance, 3) Difficulty
        const aOverdue = now.getTime() - a.nextReviewDate.getTime();
        const bOverdue = now.getTime() - b.nextReviewDate.getTime();
        
        if (aOverdue !== bOverdue) {
          return bOverdue - aOverdue; // Most overdue first
        }
        
        const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aImportance = importanceOrder[a.importance];
        const bImportance = importanceOrder[b.importance];
        
        if (aImportance !== bImportance) {
          return bImportance - aImportance; // Higher importance first
        }
        
        return b.difficulty - a.difficulty; // Higher difficulty first
      });

    return dueItems.slice(0, maxItems);
  }

  /**
   * Create new review item for a financial concept
   */
  createReviewItem(
    conceptId: string,
    category: ReviewItem['category'],
    chapterNumber: number,
    importance: ReviewItem['importance'] = 'medium'
  ): ReviewItem {
    const now = new Date();
    const initialReviewDate = new Date(now);
    initialReviewDate.setDate(initialReviewDate.getDate() + 1); // Review tomorrow

    return {
      conceptId,
      difficulty: 2.0, // Start with medium difficulty
      interval: 1,
      repetitions: 0,
      nextReviewDate: initialReviewDate,
      lastReviewDate: now,
      easeFactor: 2.5, // Start with high ease factor
      category,
      chapterNumber,
      importance
    };
  }

  /**
   * Get retention statistics for analytics
   */
  getRetentionStats(items: ReviewItem[]) {
    const total = items.length;
    const mastered = items.filter(item => item.repetitions >= 5 && item.easeFactor > 2.0).length;
    const struggling = items.filter(item => item.difficulty > 2.5 || item.easeFactor < 1.8).length;
    const dueToday = this.getDueForReview(items).length;

    return {
      total,
      mastered,
      struggling,
      dueToday,
      masteryRate: total > 0 ? (mastered / total) * 100 : 0,
      strugglingRate: total > 0 ? (struggling / total) * 100 : 0
    };
  }

  /**
   * Get personalized review recommendations
   */
  getReviewRecommendations(items: ReviewItem[]): {
    recommendation: string;
    priority: 'low' | 'medium' | 'high';
    concepts: string[];
  } {
    const stats = this.getRetentionStats(items);
    const dueItems = this.getDueForReview(items, 5);
    
    if (dueItems.length === 0) {
      return {
        recommendation: "Great work! No reviews due today. Keep learning new concepts!",
        priority: 'low',
        concepts: []
      };
    }

    if (stats.strugglingRate > 30) {
      return {
        recommendation: `Focus on mastering struggling concepts before learning new material. You have ${dueItems.length} reviews due.`,
        priority: 'high',
        concepts: dueItems.map(item => item.conceptId).slice(0, 3)
      };
    }

    if (dueItems.length > 10) {
      return {
        recommendation: `You have ${dueItems.length} concepts to review. Spending 15 minutes on reviews will boost your retention!`,
        priority: 'medium',
        concepts: dueItems.map(item => item.conceptId).slice(0, 5)
      };
    }

    return {
      recommendation: `Perfect! Quick review of ${dueItems.length} concepts will reinforce your learning.`,
      priority: 'low',
      concepts: dueItems.map(item => item.conceptId)
    };
  }

  private updateDifficulty(currentDifficulty: number, quality: number): number {
    // Adjust difficulty based on performance
    if (quality >= 4) {
      return Math.max(0, currentDifficulty - 0.1); // Easier
    } else if (quality <= 2) {
      return Math.min(3, currentDifficulty + 0.2); // Harder
    }
    return currentDifficulty;
  }

  private getAverageTimeForConcept(category: ReviewItem['category']): number {
    // Average time in seconds based on concept type
    const averageTimes = {
      lesson: 180, // 3 minutes
      quiz: 120,   // 2 minutes
      calculator: 240, // 4 minutes
      scenario: 300    // 5 minutes
    };
    return averageTimes[category];
  }
}

// Export singleton instance
export const spacedRepetitionSystem = new SpacedRepetitionSystem();

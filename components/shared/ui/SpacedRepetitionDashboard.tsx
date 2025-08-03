'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { spacedRepetitionSystem, ReviewItem, ReviewResponse } from '@/lib/algorithms/spacedRepetition';
import GradientCard from '@/components/shared/ui/GradientCard';
import { Brain, Clock, CheckCircle, AlertTriangle, Star, RefreshCw } from 'lucide-react';
import { theme } from '@/lib/theme';

interface SpacedRepetitionDashboardProps {
  className?: string;
}

export default function SpacedRepetitionDashboard({ className = '' }: SpacedRepetitionDashboardProps) {
  const userProgress = useProgressStore(state => state.userProgress);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [dueItems, setDueItems] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    mastered: 0,
    struggling: 0,
    dueToday: 0,
    masteryRate: 0,
    strugglingRate: 0
  });
  const [recommendation, setRecommendation] = useState({
    recommendation: '',
    priority: 'low' as 'low' | 'medium' | 'high',
    concepts: [] as string[]
  });
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Initialize review items from completed lessons and quizzes
  useEffect(() => {
    const items: ReviewItem[] = [];

    // Add completed lessons
    userProgress.completedLessons.forEach((lessonId: string) => {
      const chapterNumber = parseInt(lessonId.split('-')[2]) || 1;
      items.push(spacedRepetitionSystem.createReviewItem(
        lessonId,
        'lesson',
        chapterNumber,
        chapterNumber <= 6 ? 'critical' : chapterNumber <= 16 ? 'high' : 'medium'
      ));
    });

    // Add quiz concepts
    Object.entries(userProgress.quizScores).forEach(([quizId, score]) => {
      if (typeof score === 'number' && score >= 80) { // Only add passed quizzes
        const chapterNumber = parseInt(quizId.split('-')[2]) || 1;
        items.push(spacedRepetitionSystem.createReviewItem(
          `${quizId}-concepts`,
          'quiz',
          chapterNumber,
          'critical' // Quiz concepts are always critical
        ));
      }
    });

    // Add calculator usage
    Object.keys(userProgress.calculatorUsage).forEach(calculatorId => {
      items.push(spacedRepetitionSystem.createReviewItem(
        `${calculatorId}-concepts`,
        'calculator',
        1, // Most calculators are foundational
        'high'
      ));
    });

    setReviewItems(items);

    // Calculate due items and stats
    const due = spacedRepetitionSystem.getDueForReview(items);
    const statistics = spacedRepetitionSystem.getRetentionStats(items);
    const rec = spacedRepetitionSystem.getReviewRecommendations(items);

    setDueItems(due);
    setStats(statistics);
    setRecommendation(rec);
  }, [userProgress]);

  const handleReviewResponse = (quality: number, confidence: number) => {
    if (currentReviewIndex >= dueItems.length) return;

    const currentItem = dueItems[currentReviewIndex];
    const response: ReviewResponse = {
      quality,
      timeSpent: 60, // Default 1 minute
      confidence
    };

    const updatedItem = spacedRepetitionSystem.calculateNextReview(currentItem, response);

    // Update the review items
    const updatedItems = reviewItems.map(item =>
      item.conceptId === updatedItem.conceptId ? updatedItem : item
    );
    setReviewItems(updatedItems);

    // Move to next review or finish
    if (currentReviewIndex < dueItems.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setIsReviewing(false);
      setCurrentReviewIndex(0);
      // Recalculate due items
      const newDue = spacedRepetitionSystem.getDueForReview(updatedItems);
      setDueItems(newDue);
      const newStats = spacedRepetitionSystem.getRetentionStats(updatedItems);
      setStats(newStats);
    }
  };

  const startReviewSession = () => {
    setIsReviewing(true);
    setCurrentReviewIndex(0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return `${theme.status.error.text} ${theme.status.error.bg}`;
      case 'medium': return `${theme.status.warning.text} ${theme.status.warning.bg}`;
      default: return `${theme.status.success.text} ${theme.status.success.bg}`;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (reviewItems.length === 0) {
    return (
      <GradientCard variant="glass" gradient="blue" className={`p-6 ${className}`}>
        <div className="text-center">
          <Brain className={`w-12 h-12 ${theme.textColors.primary} mx-auto mb-4`} />
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>Spaced Repetition Learning</h3>
          <p className={theme.textColors.secondary}>Complete some lessons to start building your review queue!</p>
        </div>
      </GradientCard>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <GradientCard variant="glass" gradient="purple" className="p-6">
        <div className="flex items-center mb-4">
          <Brain className={`w-6 h-6 ${theme.textColors.primary} mr-3`} />
          <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>Learning Retention Dashboard</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.status.info.text}`}>{stats.total}</div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Total Concepts</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.status.success.text}`}>{stats.mastered}</div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Mastered</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.status.error.text}`}>{stats.struggling}</div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Struggling</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.status.warning.text}`}>{stats.dueToday}</div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Due Today</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Mastery Rate</span>
              <span className="font-medium">{stats.masteryRate.toFixed(1)}%</span>
            </div>
            <div className={`w-full ${theme.backgrounds.disabled} rounded-full h-2`}>
              <div
                className={`${theme.status.success.bg} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${stats.masteryRate}%` }}
              ></div>
            </div>
          </div>

          {stats.strugglingRate > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Concepts Needing Attention</span>
                <span className="font-medium">{stats.strugglingRate.toFixed(1)}%</span>
              </div>
              <div className={`w-full ${theme.backgrounds.disabled} rounded-full h-2`}>
                <div
                  className={`${theme.status.error.bg} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${stats.strugglingRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </GradientCard>

      {/* Recommendation */}
      <GradientCard variant="glass" gradient="green" className="p-6">
        <div className={`flex items-start space-x-3 p-4 rounded-lg ${getPriorityColor(recommendation.priority)}`}>
          {getPriorityIcon(recommendation.priority)}
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Today&apos;s Recommendation</h4>
            <p className="text-sm">{recommendation.recommendation}</p>

            {recommendation.concepts.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Focus on these concepts:</p>
                <div className="flex flex-wrap gap-2">
                  {recommendation.concepts.slice(0, 3).map((concept, index) => (
                    <span key={index} className={`text-xs ${theme.backgrounds.cardHover} px-2 py-1 rounded ${theme.textColors.secondary}`}>
                      {concept.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Button */}
        {dueItems.length > 0 && !isReviewing && (
          <div className="mt-4 text-center">
            <button
              onClick={startReviewSession}
              className={`bg-gradient-to-r from-slate-900 to-blue-900 ${theme.textColors.primary} px-6 py-3 rounded-lg font-semibold hover:from-slate-900 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto`}
            >
              <RefreshCw className="w-5 h-5" />
              Start Review Session ({dueItems.length} concepts)
            </button>
          </div>
        )}
      </GradientCard>

      {/* Review Session */}
      {isReviewing && currentReviewIndex < dueItems.length && (
        <GradientCard variant="glass" gradient="blue" className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold">Review Session</h4>
              <span className={`text-sm ${theme.textColors.muted}`}>
                {currentReviewIndex + 1} of {dueItems.length}
              </span>
            </div>
            <div className={`w-full ${theme.backgrounds.disabled} rounded-full h-2`}>
              <div
                className={`${theme.status.info.bg.replace('/20', '')} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${((currentReviewIndex + 1) / dueItems.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h5 className="text-xl font-bold mb-2">
              {dueItems[currentReviewIndex]?.conceptId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h5>
            <p className={`${theme.textColors.secondary}`}>How well do you remember this concept?</p>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((quality) => (
              <button
                key={quality}
                onClick={() => handleReviewResponse(quality, quality)}
                className={`p-3 rounded-lg font-semibold transition-all hover:scale-105 ${quality <= 2
                  ? `${theme.status.error.bg}/20 ${theme.status.error.text} hover:${theme.status.error.bg}/30`
                  : quality <= 3
                    ? `${theme.status.warning.bg}/20 ${theme.status.warning.text} hover:${theme.status.warning.bg}/30`
                    : `${theme.status.success.bg}/20 ${theme.status.success.text} hover:${theme.status.success.bg}/30`
                  }`}
              >
                <Star className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs">
                  {quality === 1 ? 'Forgot' :
                    quality === 2 ? 'Vague' :
                      quality === 3 ? 'OK' :
                        quality === 4 ? 'Good' : 'Perfect'}
                </div>
              </button>
            ))}
          </div>

          <div className={`text-center text-sm ${theme.textColors.muted}`}>
            Rate your recall: 1 = Completely forgot, 5 = Perfect recall
          </div>
        </GradientCard>
      )}
    </div>
  );
}

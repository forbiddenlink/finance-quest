'use client';

import { useProgress } from '@/lib/context/ProgressContext';

export function ProgressDisplay() {
  const { state } = useProgress();

  if (state.isLoading) {
    return (
      <div className="bg-gray-100 px-3 py-1 rounded-full animate-pulse">
        <span className="text-sm font-medium text-gray-500">Loading...</span>
      </div>
    );
  }

  const progress = state.userProgress;
  const lessonProgress = Math.round((progress.completedLessons.length / 3) * 100);
  const hasPassedQuiz = Object.values(progress.quizScores).some(score => score >= 80);
  
  let overallProgress = lessonProgress;
  if (hasPassedQuiz) {
    overallProgress = Math.min(100, lessonProgress + 25); // Bonus for passing quiz
  }

  return (
    <div className="bg-green-100 px-3 py-1 rounded-full">
      <span className="text-sm font-medium text-green-800">
        Progress: {overallProgress}%
      </span>
    </div>
  );
}

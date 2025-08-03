'use client';

import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

export function ProgressDisplay() {
  const userProgress = useProgressStore(state => state.userProgress);

  const lessonProgress = Math.round((userProgress.completedLessons.length / 3) * 100);
  const hasPassedQuiz = Object.values(userProgress.quizScores).some(score => score >= 80);
  
  let overallProgress = lessonProgress;
  if (hasPassedQuiz) {
    overallProgress = Math.min(100, lessonProgress + 25); // Bonus for passing quiz
  }

  return (
    <div className={`${theme.status.success.bg} px-3 py-1 rounded-full`}>
      <span className={`text-sm font-medium ${theme.status.success.text}`}>
        Progress: {overallProgress}%
      </span>
    </div>
  );
}

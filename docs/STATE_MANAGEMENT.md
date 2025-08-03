# Finance Quest - State Management Guide 🏪

## 🎯 **Zustand-Powered Progress Tracking**

Finance Quest uses **Zustand with localStorage persistence** for all state management. This guide covers the complete state architecture, patterns, and best practices.

---

## 🏗️ **Architecture Overview**

### **Why Zustand?**
- **Performance**: No providers, no context re-renders
- **Simplicity**: Minimal boilerplate, intuitive API
- **Persistence**: Automatic localStorage integration
- **TypeScript**: Full type safety with minimal setup
- **DevTools**: Redux DevTools integration for debugging

### **State Structure**
```typescript
interface ProgressState {
  // User progress tracking
  userProgress: UserProgress;
  
  // Chapter management
  completedLessons: string[];
  quizScores: Record<string, QuizScore>;
  unlockedChapters: number[];
  
  // Analytics & engagement
  calculatorUsage: CalculatorUsage[];
  studyStreaks: StudyStreak[];
  timeSpent: Record<string, number>;
  
  // Learning metrics
  financialLiteracyScore: number;
  masteryByTopic: Record<string, MasteryLevel>;
  
  // Actions
  completeLesson: (lessonId: string, timeSpent: number) => void;
  recordQuizScore: (quizId: string, score: number, totalQuestions: number) => void;
  recordCalculatorUsage: (calculatorId: string) => void;
  // ... more actions
}
```

---

## 📊 **Core Progress Store**

### **Store Implementation**
Located in `lib/store/progressStore.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProgress {
  currentChapter: number;
  completedLessons: string[];
  quizScores: Record<string, QuizScore>;
  calculatorUsage: CalculatorUsage[];
  financialLiteracyScore: number;
  totalTimeSpent: number;
  lastActiveDate: string;
  studyStreak: number;
  unlockedChapters: number[];
  masteryByTopic: Record<string, MasteryLevel>;
}

interface QuizScore {
  score: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
  attempts: number;
}

interface CalculatorUsage {
  calculatorId: string;
  usedAt: string;
  timeSpent: number;
  inputValues: Record<string, any>;
}

interface ProgressState {
  userProgress: UserProgress;
  
  // Actions
  completeLesson: (lessonId: string, timeSpent: number) => void;
  recordQuizScore: (quizId: string, score: number, totalQuestions: number) => void;
  recordCalculatorUsage: (calculatorId: string, inputData?: Record<string, any>) => void;
  updateFinancialLiteracyScore: () => void;
  isChapterUnlocked: (chapterId: number) => boolean;
  getChapterProgress: (chapterId: number) => number;
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (data: string) => boolean;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      userProgress: {
        currentChapter: 1,
        completedLessons: [],
        quizScores: {},
        calculatorUsage: [],
        financialLiteracyScore: 0,
        totalTimeSpent: 0,
        lastActiveDate: new Date().toISOString(),
        studyStreak: 1,
        unlockedChapters: [1],
        masteryByTopic: {},
      },

      // Lesson completion logic
      completeLesson: (lessonId: string, timeSpent: number) => {
        set((state) => {
          const newCompletedLessons = state.userProgress.completedLessons.includes(lessonId)
            ? state.userProgress.completedLessons
            : [...state.userProgress.completedLessons, lessonId];

          const newProgress = {
            ...state.userProgress,
            completedLessons: newCompletedLessons,
            totalTimeSpent: state.userProgress.totalTimeSpent + timeSpent,
            lastActiveDate: new Date().toISOString(),
          };

          // Update study streak
          const today = new Date().toDateString();
          const lastActive = new Date(state.userProgress.lastActiveDate).toDateString();
          if (today !== lastActive) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActive === yesterday.toDateString()) {
              newProgress.studyStreak = state.userProgress.studyStreak + 1;
            } else {
              newProgress.studyStreak = 1;
            }
          }

          return { userProgress: newProgress };
        });

        // Trigger financial literacy score update
        get().updateFinancialLiteracyScore();
      },

      // Quiz scoring with chapter unlocking
      recordQuizScore: (quizId: string, score: number, totalQuestions: number) => {
        set((state) => {
          const percentage = (score / totalQuestions) * 100;
          const newQuizScore: QuizScore = {
            score: percentage,
            totalQuestions,
            completedAt: new Date().toISOString(),
            timeSpent: 0, // Could be tracked separately
            attempts: (state.userProgress.quizScores[quizId]?.attempts || 0) + 1,
          };

          const newProgress = {
            ...state.userProgress,
            quizScores: {
              ...state.userProgress.quizScores,
              [quizId]: newQuizScore,
            },
          };

          // Unlock next chapter if score >= 80%
          if (percentage >= 80) {
            const chapterNumber = parseInt(quizId.replace('chapter', '').replace('-quiz', ''));
            const nextChapter = chapterNumber + 1;
            
            if (nextChapter <= 14 && !newProgress.unlockedChapters.includes(nextChapter)) {
              newProgress.unlockedChapters = [...newProgress.unlockedChapters, nextChapter];
              newProgress.currentChapter = Math.max(newProgress.currentChapter, nextChapter);
            }
          }

          return { userProgress: newProgress };
        });

        get().updateFinancialLiteracyScore();
      },

      // Calculator usage tracking
      recordCalculatorUsage: (calculatorId: string, inputData?: Record<string, any>) => {
        set((state) => {
          const usage: CalculatorUsage = {
            calculatorId,
            usedAt: new Date().toISOString(),
            timeSpent: 0, // Could be tracked with timer
            inputValues: inputData || {},
          };

          return {
            userProgress: {
              ...state.userProgress,
              calculatorUsage: [...state.userProgress.calculatorUsage, usage],
            },
          };
        });
      },

      // Financial Literacy Score Algorithm
      updateFinancialLiteracyScore: () => {
        set((state) => {
          const progress = state.userProgress;
          
          // Quiz performance (40% weight)
          const quizScores = Object.values(progress.quizScores);
          const avgQuizScore = quizScores.length > 0
            ? quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / quizScores.length
            : 0;
          
          // Lesson completion rate (30% weight)
          const totalPossibleLessons = 42; // 14 chapters × 3 lessons average
          const completionRate = (progress.completedLessons.length / totalPossibleLessons) * 100;
          
          // Calculator diversity (20% weight)
          const uniqueCalculators = new Set(progress.calculatorUsage.map(usage => usage.calculatorId));
          const calculatorDiversity = (uniqueCalculators.size / 13) * 100; // 13 total calculators
          
          // Study consistency (10% weight)
          const consistencyBonus = Math.min(progress.studyStreak * 2, 100);
          
          // Calculate final score (0-1000 scale)
          const literacyScore = Math.round(
            (avgQuizScore * 0.4) +
            (completionRate * 0.3) +
            (calculatorDiversity * 0.2) +
            (consistencyBonus * 0.1)
          ) * 10;

          return {
            userProgress: {
              ...progress,
              financialLiteracyScore: Math.min(literacyScore, 1000),
            },
          };
        });
      },

      // Chapter unlocking logic
      isChapterUnlocked: (chapterId: number) => {
        const state = get();
        return state.userProgress.unlockedChapters.includes(chapterId);
      },

      // Chapter progress calculation
      getChapterProgress: (chapterId: number) => {
        const state = get();
        const chapterLessons = state.userProgress.completedLessons.filter(
          lesson => lesson.startsWith(`chapter${chapterId}`)
        );
        const expectedLessons = 3; // Average lessons per chapter
        return Math.min((chapterLessons.length / expectedLessons) * 100, 100);
      },

      // Progress management
      resetProgress: () => {
        set({
          userProgress: {
            currentChapter: 1,
            completedLessons: [],
            quizScores: {},
            calculatorUsage: [],
            financialLiteracyScore: 0,
            totalTimeSpent: 0,
            lastActiveDate: new Date().toISOString(),
            studyStreak: 1,
            unlockedChapters: [1],
            masteryByTopic: {},
          },
        });
      },

      // Data export/import
      exportProgress: () => {
        const state = get();
        return JSON.stringify(state.userProgress);
      },

      importProgress: (data: string) => {
        try {
          const importedProgress = JSON.parse(data);
          set({ userProgress: importedProgress });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'finance-quest-progress',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Handle version migrations
        if (version < 2) {
          // Add new fields for version 2
          persistedState.userProgress.masteryByTopic = {};
          persistedState.userProgress.studyStreak = 1;
        }
        return persistedState;
      },
    }
  )
);
```

---

## 🔄 **Usage Patterns**

### **Component Integration**
Standard pattern for using the progress store:

```typescript
import { useProgressStore } from '@/lib/store/progressStore';

const LessonComponent = () => {
  // Destructure only what you need
  const { 
    completeLesson, 
    userProgress,
    isChapterUnlocked 
  } = useProgressStore();

  // Derived state
  const currentChapterProgress = useProgressStore(
    state => state.getChapterProgress(3)
  );

  const handleLessonComplete = () => {
    completeLesson('chapter3-budgeting-basics', timeSpentMinutes);
  };

  return (
    <div>
      <ProgressBar progress={currentChapterProgress} />
      <button onClick={handleLessonComplete}>
        Complete Lesson
      </button>
    </div>
  );
};
```

### **Conditional Rendering**
Use store state for conditional UI:

```typescript
const ChapterNavigation = () => {
  const isChapter4Unlocked = useProgressStore(state => 
    state.isChapterUnlocked(4)
  );

  return (
    <nav>
      <Link href="/chapter1">Chapter 1</Link>
      <Link href="/chapter2">Chapter 2</Link>
      <Link href="/chapter3">Chapter 3</Link>
      
      {isChapter4Unlocked ? (
        <Link href="/chapter4">Chapter 4</Link>
      ) : (
        <div className="opacity-50 cursor-not-allowed">
          Chapter 4 🔒
        </div>
      )}
    </nav>
  );
};
```

### **Performance Optimization**
Use selectors to prevent unnecessary re-renders:

```typescript
// Good: Specific selector
const financialScore = useProgressStore(state => 
  state.userProgress.financialLiteracyScore
);

// Good: Derived state with selector
const completedLessonsCount = useProgressStore(state => 
  state.userProgress.completedLessons.length
);

// Bad: Subscribing to entire progress object
const userProgress = useProgressStore(state => state.userProgress);
```

---

## 📈 **Analytics & Tracking**

### **Learning Analytics**
Track detailed learning patterns:

```typescript
// Enhanced calculator tracking
const recordDetailedCalculatorUsage = (
  calculatorId: string,
  inputData: Record<string, any>,
  resultData: Record<string, any>,
  timeSpent: number
) => {
  const { recordCalculatorUsage } = useProgressStore();
  
  recordCalculatorUsage(calculatorId, {
    inputs: inputData,
    results: resultData,
    timeSpent,
    timestamp: new Date().toISOString(),
    sessionId: generateSessionId(),
  });
};

// Learning pattern analysis
const getLearningPatterns = () => {
  const { userProgress } = useProgressStore();
  
  const patterns = {
    preferredLearningTime: analyzeStudyTimes(userProgress.calculatorUsage),
    strongTopics: identifyStrongTopics(userProgress.quizScores),
    struggleAreas: identifyWeakTopics(userProgress.quizScores),
    engagementLevel: calculateEngagement(userProgress),
  };
  
  return patterns;
};
```

### **Progress Insights**
Generate meaningful insights from stored data:

```typescript
const useProgressInsights = () => {
  const userProgress = useProgressStore(state => state.userProgress);
  
  return useMemo(() => {
    const insights = {
      // Learning velocity
      averageTimePerLesson: userProgress.totalTimeSpent / userProgress.completedLessons.length,
      
      // Streak analysis
      currentStreak: userProgress.studyStreak,
      streakCategory: userProgress.studyStreak >= 7 ? 'excellent' : 
                    userProgress.studyStreak >= 3 ? 'good' : 'getting-started',
      
      // Topic mastery
      strongestTopic: Object.entries(userProgress.masteryByTopic)
        .sort(([,a], [,b]) => b.score - a.score)[0]?.[0],
      
      // Next recommendations
      recommendedActions: generateRecommendations(userProgress),
    };
    
    return insights;
  }, [userProgress]);
};
```

---

## 🔍 **Debugging & DevTools**

### **Redux DevTools Integration**
The store integrates with Redux DevTools for debugging:

```typescript
// Enable in development
export const useProgressStore = create<ProgressState>()(
  devtools(
    persist(
      (set, get) => ({
        // ... store implementation
      }),
      { name: 'finance-quest-progress' }
    ),
    { name: 'FinanceQuest Progress Store' }
  )
);
```

### **Debug Utilities**
Helpful debugging functions:

```typescript
// Debug current state
const debugProgress = () => {
  const state = useProgressStore.getState();
  console.log('Current Progress:', state.userProgress);
  console.log('Unlocked Chapters:', state.userProgress.unlockedChapters);
  console.log('Financial Literacy Score:', state.userProgress.financialLiteracyScore);
};

// Reset for testing
const resetForTesting = () => {
  useProgressStore.getState().resetProgress();
  console.log('Progress reset for testing');
};

// Simulate chapter completion
const simulateProgress = (targetChapter: number) => {
  const { completeLesson, recordQuizScore } = useProgressStore.getState();
  
  for (let i = 1; i < targetChapter; i++) {
    // Complete lessons
    completeLesson(`chapter${i}-lesson1`, 300);
    completeLesson(`chapter${i}-lesson2`, 350);
    
    // Pass quiz
    recordQuizScore(`chapter${i}-quiz`, 9, 10); // 90% score
  }
};
```

---

## 🔒 **Data Security & Privacy**

### **Local Storage Security**
The progress data is stored locally and never sent to external servers:

```typescript
// Data encryption (if needed)
const encryptProgress = (data: string) => {
  // Simple encryption for sensitive local data
  return btoa(data); // Base64 encoding (use proper encryption in production)
};

const decryptProgress = (encryptedData: string) => {
  try {
    return atob(encryptedData);
  } catch {
    return null;
  }
};
```

### **Data Export/Import**
Allow users to manage their data:

```typescript
const DataManagement = () => {
  const { exportProgress, importProgress, resetProgress } = useProgressStore();
  
  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-quest-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      const success = importProgress(data);
      
      if (success) {
        alert('Progress imported successfully!');
      } else {
        alert('Failed to import progress. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button onClick={handleExport}>Export Progress</button>
      <input type="file" onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])} />
      <button onClick={resetProgress}>Reset All Progress</button>
    </div>
  );
};
```

---

## 🧪 **Testing State Management**

### **Store Testing**
Test store actions and state changes:

```typescript
import { useProgressStore } from '@/lib/store/progressStore';

describe('Progress Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useProgressStore.getState().resetProgress();
  });

  it('should complete lessons correctly', () => {
    const { completeLesson, userProgress } = useProgressStore.getState();
    
    completeLesson('chapter1-lesson1', 300);
    
    const updatedProgress = useProgressStore.getState().userProgress;
    expect(updatedProgress.completedLessons).toContain('chapter1-lesson1');
    expect(updatedProgress.totalTimeSpent).toBe(300);
  });

  it('should unlock chapters after quiz success', () => {
    const { recordQuizScore, isChapterUnlocked } = useProgressStore.getState();
    
    recordQuizScore('chapter1-quiz', 9, 10); // 90% score
    
    expect(isChapterUnlocked(2)).toBe(true);
  });

  it('should calculate financial literacy score', () => {
    const { completeLesson, recordQuizScore, userProgress } = useProgressStore.getState();
    
    // Complete some content
    completeLesson('chapter1-lesson1', 300);
    recordQuizScore('chapter1-quiz', 8, 10);
    
    const finalProgress = useProgressStore.getState().userProgress;
    expect(finalProgress.financialLiteracyScore).toBeGreaterThan(0);
  });
});
```

### **Component Testing with Store**
Test components that use the store:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { useProgressStore } from '@/lib/store/progressStore';
import { LessonComponent } from './LessonComponent';

// Mock the store
jest.mock('@/lib/store/progressStore');
const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

describe('LessonComponent', () => {
  const mockCompleteLesson = jest.fn();
  
  beforeEach(() => {
    mockUseProgressStore.mockReturnValue({
      completeLesson: mockCompleteLesson,
      userProgress: {
        completedLessons: [],
        currentChapter: 1,
        // ... other progress fields
      },
      isChapterUnlocked: jest.fn().mockReturnValue(true),
    });
  });

  it('should call completeLesson when completed', () => {
    render(<LessonComponent lessonId="chapter1-lesson1" />);
    
    fireEvent.click(screen.getByText('Complete Lesson'));
    
    expect(mockCompleteLesson).toHaveBeenCalledWith('chapter1-lesson1', expect.any(Number));
  });
});
```

---

## 🚀 **Performance Optimizations**

### **Selective Subscriptions**
Only subscribe to the data you need:

```typescript
// Good: Specific subscription
const completedLessonsCount = useProgressStore(state => 
  state.userProgress.completedLessons.length
);

// Good: Shallow comparison for objects
const quizScores = useProgressStore(
  state => state.userProgress.quizScores,
  shallow
);

// Good: Custom equality function
const currentChapterData = useProgressStore(
  state => ({
    current: state.userProgress.currentChapter,
    unlocked: state.userProgress.unlockedChapters,
  }),
  (a, b) => a.current === b.current && a.unlocked.length === b.unlocked.length
);
```

### **Computed Values**
Use memoized selectors for expensive calculations:

```typescript
// Create memoized selectors
const selectFinancialLiteracyCategory = createSelector(
  (state: ProgressState) => state.userProgress.financialLiteracyScore,
  (score) => {
    if (score >= 800) return 'expert';
    if (score >= 600) return 'advanced';
    if (score >= 400) return 'intermediate';
    if (score >= 200) return 'beginner';
    return 'getting-started';
  }
);

// Use in components
const literacyCategory = useProgressStore(selectFinancialLiteracyCategory);
```

---

## 📚 **Next Steps**

### **Advanced Patterns**
1. **Middleware**: Add custom middleware for logging, analytics
2. **Computed State**: Implement derived state patterns
3. **Optimistic Updates**: Handle offline scenarios
4. **Data Synchronization**: Sync with backend when implemented

### **Related Guides**
- [Component Guide](COMPONENT_GUIDE.md) - Using store in components
- [Architecture Guide](ARCHITECTURE.md) - Overall system design
- [Testing Guide](TESTING.md) - Testing strategies

---

**🏪 The Zustand store is the heart of Finance Quest's user experience - handle it with care!**

*Need help? Check the [Quick Start Guide](QUICK_START.md) or browse [example implementations](../components/chapters/) for practical usage patterns.*

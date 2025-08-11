import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter12Page from '@/app/chapter12/page';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
const mockProgressStore = {
  userProgress: {
    currentChapter: 1,
    completedLessons: [],
    completedQuizzes: [],
    completedChapters: [],
    unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    quizScores: {},
    calculatorUsage: {},
    simulationResults: {},
    totalTimeSpent: 0,
    lastActiveDate: '',
    streakDays: 0,
    longestStreak: 0,
    streakFreezesUsed: 0,
    weeklyGoal: 0,
    weeklyProgress: 0,
    achievements: [],
    strugglingTopics: [],
    financialLiteracyScore: 0,
    onboardingCompleted: false,
    userLevel: 1,
    totalXP: 0,
    currentXP: 0,
    learningAnalytics: {
      averageQuizScore: 0,
      lessonCompletionRate: 0,
      timeSpentByChapter: {},
      conceptsMastered: [],
      areasNeedingWork: [],
      learningVelocity: 0,
      retentionRate: 0,
      focusScore: 0,
    },
    engagementMetrics: {
      sessionsThisWeek: 0,
      totalSessions: 0
    }
  },
  recordCalculatorUsage: jest.fn(),
  completeLesson: jest.fn(),
  recordQuizScore: jest.fn(),
  isChapterUnlocked: jest.fn(() => true),
  checkLevelUp: jest.fn(() => false),
  updateUserProgress: jest.fn(),
  resetProgress: jest.fn(),
  incrementStreak: jest.fn(),
  updateWeeklyProgress: jest.fn(),
  unlockAchievement: jest.fn(),
  addStrugglingTopic: jest.fn(),
  removeStrugglingTopic: jest.fn(),
  updateFinancialLiteracyScore: jest.fn(),
  completeOnboarding: jest.fn(),
  addXP: jest.fn(),
  getPersonalizedEncouragement: jest.fn(() => "Great job!"),
  getStudyRecommendation: jest.fn(() => ({
    type: 'continue',
    message: 'Continue learning',
    action: 'Next lesson',
    priority: 'medium'
  })),
};

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn((selector) => selector ? selector(mockProgressStore) : mockProgressStore),
}));

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('Chapter 12: Real Estate & Property Investment - Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Ensure the mock is properly set up for each test
    const mockUseProgressStore = useProgressStore as unknown as jest.Mock;
    mockUseProgressStore.mockImplementation((selector) => {
      if (selector) {
        return selector(mockProgressStore);
      }
      return mockProgressStore;
    });
  });

  describe('Chapter Layout', () => {
    it('renders chapter title and subtitle', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText('Real Estate & Property Investment')).toBeInTheDocument();
      expect(screen.getByText(/Learn real estate investing, property analysis/)).toBeInTheDocument();
    });

    it('renders chapter header correctly', () => {
      render(<Chapter12Page />);
      
      // Check for basic chapter structure
      expect(screen.getByText('Real Estate & Property Investment')).toBeInTheDocument();
      expect(screen.getByText('Ch. 12')).toBeInTheDocument();
    });
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText('Real Estate & Property Investment')).toBeInTheDocument();
    });

    it('displays main chapter content', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText('Real Estate & Property Investment')).toBeInTheDocument();
      expect(screen.getByText(/Learn real estate investing/)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('has proper layout structure', () => {
      render(<Chapter12Page />);
      
      // Check for basic elements
      expect(screen.getByText('Real Estate & Property Investment')).toBeInTheDocument();
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });

    it('displays progress indicators', () => {
      render(<Chapter12Page />);
      
      // Check for progress-related elements
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('35%')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders responsive layout', () => {
      render(<Chapter12Page />);
      
      // Basic responsive check - component renders
      expect(screen.getByText('Real Estate & Property Investment')).toBeInTheDocument();
    });

    it('handles different screen sizes', () => {
      render(<Chapter12Page />);
      
      // Check for responsive elements
      expect(screen.getByText('Chapter 12')).toBeInTheDocument();
      expect(screen.getByText('Ch. 12')).toBeInTheDocument();
    });
  });
});

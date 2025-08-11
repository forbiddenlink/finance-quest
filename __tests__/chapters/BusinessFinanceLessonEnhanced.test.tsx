import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessFinanceLessonEnhanced from '@/components/chapters/fundamentals/lessons/BusinessFinanceLessonEnhanced';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore');

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock GradientCard
jest.mock('@/components/shared/ui/GradientCard', () => {
  return function MockGradientCard({ children, className }: any) {
    return <div className={className} data-testid="gradient-card">{children}</div>;
  };
});

// Mock ProgressRing
jest.mock('@/components/shared/ui/ProgressRing', () => {
  return function MockProgressRing({ progress, size, strokeWidth, className }: any) {
    return (
      <div 
        className={className} 
        data-testid="progress-ring" 
        data-progress={progress}
        data-size={size}
        data-stroke-width={strokeWidth}
      />
    );
  };
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Building2: () => <div data-testid="building2-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  BarChart3: () => <div data-testid="bar-chart3-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Users: () => <div data-testid="users-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  ChevronLeft: () => <div data-testid="chevron-left-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Award: () => <div data-testid="award-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
}));

const mockProgressStore = {
  userProgress: {
    completedLessons: [],
    quizScores: {},
    calculatorUsage: {},
    achievements: [],
    streakDays: 0,
    totalTimeSpent: 0,
    lastActiveDate: new Date().toISOString(),
  },
  completeLesson: jest.fn(),
  recordQuizScore: jest.fn(),
  recordCalculatorUsage: jest.fn(),
  updateProgress: jest.fn(),
  isChapterUnlocked: jest.fn(() => true),
  getChapterProgress: jest.fn(() => ({ lessonsCompleted: 0, quizCompleted: false, calculatorsUsed: 0 })),
  getLessonProgress: jest.fn(() => ({ completed: false, timeSpent: 0 })),
};

describe('BusinessFinanceLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = mockProgressStore;
      return selector ? selector(state) : state;
    });
  });

  test('renders the lesson component without crashing', () => {
    render(<BusinessFinanceLessonEnhanced />);
    
    expect(screen.getByText('Chapter 16: Business & Entrepreneurship Finance')).toBeInTheDocument();
    expect(screen.getByText('Building and Growing Financially Successful Businesses')).toBeInTheDocument();
  });

  test('displays progress ring with correct lesson count', () => {
    render(<BusinessFinanceLessonEnhanced />);
    
    expect(screen.getByTestId('progress-ring')).toBeInTheDocument();
    expect(screen.getAllByText(/Lesson.*of 6/i)).toHaveLength(2); // Header and lesson progress
  });

  test('displays educational icons appropriately', () => {
    render(<BusinessFinanceLessonEnhanced />);
    
    expect(screen.getAllByTestId('building2-icon')).toHaveLength(2); // Header + progress tracker
    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument();
    expect(screen.getAllByTestId('dollar-sign-icon')).toHaveLength(2); // Content + progress tracker
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
  });

  test('displays all lesson icons correctly', () => {
    render(<BusinessFinanceLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Check icons for each lesson - using getAllByTestId for duplicated icons
    expect(screen.getAllByTestId('building2-icon')).toHaveLength(2); // Fundamentals (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('trending-up-icon')).toHaveLength(2); // Startup Funding (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('bar-chart3-icon')).toHaveLength(2); // Valuation (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('dollar-sign-icon')).toHaveLength(3); // Cash Flow (header + progress + content)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('target-icon')).toHaveLength(2); // Tax Strategy (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('users-icon')).toHaveLength(2); // Scaling (header + progress)
  });
});
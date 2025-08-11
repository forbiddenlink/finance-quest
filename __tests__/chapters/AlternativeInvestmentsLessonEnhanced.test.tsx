import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlternativeInvestmentsLessonEnhanced from '@/components/chapters/fundamentals/lessons/AlternativeInvestmentsLessonEnhanced';
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
  PieChart: () => <div data-testid="pie-chart-icon" />,
  Building: () => <div data-testid="building-icon" />,
  Package: () => <div data-testid="package-icon" />,
  Coins: () => <div data-testid="coins-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
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

describe('AlternativeInvestmentsLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = mockProgressStore;
      return selector ? selector(state) : state;
    });
  });

  test('renders the lesson component without crashing', () => {
    render(<AlternativeInvestmentsLessonEnhanced />);
    
    expect(screen.getByText('Chapter 15: Alternative Investments')).toBeInTheDocument();
    expect(screen.getByText('Diversifying Beyond Traditional Assets')).toBeInTheDocument();
  });

  test('displays progress ring with correct lesson count', () => {
    render(<AlternativeInvestmentsLessonEnhanced />);
    
    expect(screen.getByTestId('progress-ring')).toBeInTheDocument();
    expect(screen.getAllByText(/Lesson.*of 6/i)).toHaveLength(2); // Header and lesson progress
  });

  test('displays educational icons appropriately', () => {
    render(<AlternativeInvestmentsLessonEnhanced />);
    
    expect(screen.getAllByTestId('pie-chart-icon')).toHaveLength(2); // Header + progress tracker
    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dollar-sign-icon')).toBeInTheDocument();
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
  });

  test('displays all lesson icons correctly', () => {
    render(<AlternativeInvestmentsLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Check icons for each lesson - using getAllByTestId for duplicated icons
    expect(screen.getAllByTestId('pie-chart-icon')).toHaveLength(2); // Introduction (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('building-icon')).toHaveLength(2); // REITs (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('package-icon')).toHaveLength(2); // Commodities (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('coins-icon')).toHaveLength(2); // Cryptocurrency (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('trending-up-icon')).toHaveLength(2); // Strategies (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('shield-icon')).toHaveLength(2); // Risk Management (header + progress)
  });
});
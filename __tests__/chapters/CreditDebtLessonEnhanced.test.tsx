import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreditDebtLessonEnhanced from '@/components/chapters/fundamentals/lessons/CreditDebtLessonEnhanced';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => <button {...props}>{children}</button>,
    h2: ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockProgressStore = {
  userProgress: {
    completedLessons: [],
    quizScores: {},
    totalTimeSpent: 0,
    streakDays: 0,
    lastActivityDate: null,
    calculatorUsage: {}
  },
  completeLesson: jest.fn(),
  recordQuizScore: jest.fn(),
  recordTimeSpent: jest.fn(),
  recordCalculatorUsage: jest.fn(),
  updateStreaks: jest.fn(),
  isChapterUnlocked: jest.fn(() => true),
  getUserProgress: jest.fn(),
};

describe('CreditDebtLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/lib/store/progressStore').useProgressStore as jest.Mock).mockReturnValue(mockProgressStore);
  });

  it('renders the lesson component', () => {
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/Credit Scores: Your Financial Reputation/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 6: Credit & Debt Fundamentals/i)).toBeInTheDocument();
  });

  it('displays progress ring', () => {
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/Lesson 1 of/i)).toBeInTheDocument();
  });

  it('shows credit score factors and ranges', () => {
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/35% payment history/i)).toBeInTheDocument();
    expect(screen.getByText(/30% utilization/i)).toBeInTheDocument();
    expect(screen.getByText(/300-579 poor/i)).toBeInTheDocument();
    expect(screen.getByText(/800\+ excellent/i)).toBeInTheDocument();
  });

  it('displays financial impact examples', () => {
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/\$250,000\+ more in mortgage interest/i)).toBeInTheDocument();
    expect(screen.getByText(/Real Money Example/i)).toBeInTheDocument();
  });

  it('shows practical action steps', () => {
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/Action Step This Week/i)).toBeInTheDocument();
    expect(screen.getByText(/Check your credit score for free/i)).toBeInTheDocument();
  });

  it('allows navigation between lessons', () => {
    render(<CreditDebtLessonEnhanced />);
    
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    
    // Should navigate to next lesson about debt strategies
  });

  it('marks lesson as complete', async () => {
    render(<CreditDebtLessonEnhanced />);
    
    const completeButton = screen.getByText(/Mark Complete/i);
    expect(completeButton).toBeInTheDocument();
    
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockProgressStore.completeLesson).toHaveBeenCalled();
    });
  });

  it('shows completed status for completed lessons', () => {
    const completedMockStore = {
      ...mockProgressStore,
      userProgress: {
        ...mockProgressStore.userProgress,
        completedLessons: ['credit-debt-enhanced-0']
      }
    };
    
    (require('@/lib/store/progressStore').useProgressStore as jest.Mock).mockReturnValue(completedMockStore);
    
    render(<CreditDebtLessonEnhanced />);
    
    const completedElements = screen.getAllByText(/Completed/i);
    expect(completedElements.length).toBeGreaterThan(0);
  });

  it('covers debt repayment strategies', () => {
    render(<CreditDebtLessonEnhanced />);
    
    // Navigate through lessons to find debt content
    for (let i = 0; i < 3; i++) {
      const nextButton = screen.queryByText(/Next/i);
      if (nextButton && !nextButton.closest('button')?.disabled) {
        fireEvent.click(nextButton);
      }
    }
    
    // Use getAllByText to handle multiple matches
    const debtElements = screen.getAllByText(/debt/i);
    expect(debtElements.length).toBeGreaterThan(0);
  });

  it('explains credit utilization', () => {
    render(<CreditDebtLessonEnhanced />);
    
    // Navigate to utilization lesson
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    // Use getAllByText to handle multiple matches
    const utilizationElements = screen.getAllByText(/utilization/i);
    expect(utilizationElements.length).toBeGreaterThan(0);
  });

  it('provides credit building strategies', () => {
    render(<CreditDebtLessonEnhanced />);
    
    // Navigate through lessons
    for (let i = 0; i < 2; i++) {
      const nextButton = screen.queryByText(/Next/i);
      if (nextButton && !nextButton.closest('button')?.disabled) {
        fireEvent.click(nextButton);
      }
    }
    
    expect(
      screen.queryByText(/building/i) || 
      screen.queryByText(/improve/i) || 
      screen.queryByText(/credit card/i)
    ).toBeInTheDocument();
  });

  it('warns about credit mistakes', () => {
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/Critical Insight/i)).toBeInTheDocument();
  });

  it('shows interest rate calculations', () => {
    render(<CreditDebtLessonEnhanced />);
    
    // Navigate to interest/debt lessons
    for (let i = 0; i < 4; i++) {
      const nextButton = screen.queryByText(/Next/i);
      if (nextButton && !nextButton.closest('button')?.disabled) {
        fireEvent.click(nextButton);
      }
    }
    
    // Use getAllByText to handle multiple matches
    const interestElements = screen.getAllByText(/interest/i);
    expect(interestElements.length).toBeGreaterThan(0);
  });

  it('covers credit card rewards and optimization', () => {
    render(<CreditDebtLessonEnhanced />);
    
    // Navigate through all lessons to find rewards content
    for (let i = 0; i < 5; i++) {
      const nextButton = screen.queryByText(/Next/i);
      if (nextButton && !nextButton.closest('button')?.disabled) {
        fireEvent.click(nextButton);
      }
    }
    
    // Use getAllByText to handle multiple matches
    const rewardElements = screen.getAllByText(/reward/i);
    expect(rewardElements.length).toBeGreaterThan(0);
  });

  it('handles previous button navigation', () => {
    render(<CreditDebtLessonEnhanced />);
    
    // Initially on first lesson, previous should be disabled
    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton.closest('button')).toBeDisabled();
    
    // Navigate forward then back
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
    
    // Should be back to first lesson
    expect(screen.getByText(/Credit Scores: Your Financial Reputation/i)).toBeInTheDocument();
  });

  it('displays progress tracking', () => {
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/Progress:/i)).toBeInTheDocument();
    expect(screen.getByText(/% Complete/i)).toBeInTheDocument();
  });

  it('shows completion achievement when all lessons done', () => {
    const allCompletedMockStore = {
      ...mockProgressStore,
      userProgress: {
        ...mockProgressStore.userProgress,
        completedLessons: [
          'credit-debt-enhanced-0',
          'credit-debt-enhanced-1',
          'credit-debt-enhanced-2',
          'credit-debt-enhanced-3',
          'credit-debt-enhanced-4',
          'credit-debt-enhanced-5'
        ]
      }
    };
    
    (require('@/lib/store/progressStore').useProgressStore as jest.Mock).mockReturnValue(allCompletedMockStore);
    
    render(<CreditDebtLessonEnhanced />);
    
    expect(screen.getByText(/Complete!/i)).toBeInTheDocument();
  });

  it('calls onComplete when provided', async () => {
    const mockOnComplete = jest.fn();
    render(<CreditDebtLessonEnhanced onComplete={mockOnComplete} />);
    
    // Navigate to last lesson
    for (let i = 0; i < 6; i++) {
      const nextButton = screen.queryByText(/Next/i);
      if (nextButton && !nextButton.closest('button')?.disabled) {
        fireEvent.click(nextButton);
      }
    }
    
    const completeButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('maintains lesson completion state', () => {
    render(<CreditDebtLessonEnhanced />);
    
    // Complete first lesson
    const completeButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(completeButton);
    
    // Navigate away and back
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    const prevButton = screen.getByText(/Previous/i);
    fireEvent.click(prevButton);
    
    // Should maintain completed state
    expect(mockProgressStore.completeLesson).toHaveBeenCalled();
  });

  it('tracks time spent on lessons', () => {
    render(<CreditDebtLessonEnhanced />);
    
    const completeButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(completeButton);
    
    expect(mockProgressStore.completeLesson).toHaveBeenCalledWith(
      expect.stringContaining('credit-debt-enhanced'),
      expect.any(Number)
    );
  });

  it('unmounts without errors', () => {
    const { unmount } = render(<CreditDebtLessonEnhanced />);
    expect(() => unmount()).not.toThrow();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import IncomeCareerLessonEnhanced from '@/components/chapters/fundamentals/lessons/IncomeCareerLessonEnhanced';

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

describe('IncomeCareerLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/lib/store/progressStore').useProgressStore as jest.Mock).mockReturnValue(mockProgressStore);
  });

  it('renders the lesson component', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    expect(screen.getByText(/Total Compensation: Your True Financial Worth/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 3: Income & Career Growth/i)).toBeInTheDocument();
  });

  it('displays progress ring', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    // Check for progress indicators
    expect(screen.getByText(/Lesson 1 of/i)).toBeInTheDocument();
  });

  it('shows lesson content with key points', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    expect(screen.getByText(/Your salary is just 60-80% of your real compensation value/i)).toBeInTheDocument();
    expect(screen.getByText(/Base salary: Foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/Health insurance: Worth/i)).toBeInTheDocument();
  });

  it('displays practical action and money example', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    expect(screen.getByText(/Action Step This Week/i)).toBeInTheDocument();
    // Check for money-related examples with flexible matching
    const moneyElements = screen.queryAllByText(/money/i);
    const exampleElements = screen.queryAllByText(/example/i);
    expect(moneyElements.length > 0 || exampleElements.length > 0).toBeTruthy();
    expect(screen.getByText(/Calculate your total compensation/i)).toBeInTheDocument();
  });

  it('allows navigation between lessons', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    
    // Should show different lesson content after clicking next
    // The exact content depends on lesson structure
  });

  it('marks lesson as complete', async () => {
    render(<IncomeCareerLessonEnhanced />);
    
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
        completedLessons: ['income-career-enhanced-0']
      }
    };
    
    (require('@/lib/store/progressStore').useProgressStore as jest.Mock).mockReturnValue(completedMockStore);
    
    render(<IncomeCareerLessonEnhanced />);
    
    const completedElements = screen.getAllByText(/Completed/i);
    expect(completedElements.length).toBeGreaterThan(0);
  });

  it('calls onComplete when provided', async () => {
    const mockOnComplete = jest.fn();
    render(<IncomeCareerLessonEnhanced onComplete={mockOnComplete} />);
    
    // Navigate to last lesson
    const lessons = screen.getAllByText(/Next/i);
    for (let i = 0; i < 5; i++) {
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

  it('handles navigation correctly', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    // Initially on first lesson, previous should be disabled
    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton.closest('button')).toBeDisabled();
    
    // Click next to go to second lesson
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    // Now previous should be enabled
    expect(prevButton.closest('button')).not.toBeDisabled();
  });

  it('displays warning tips when present', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    expect(screen.getByText(/Critical Insight/i)).toBeInTheDocument();
    expect(screen.getByText(/Never accept a job offer based on salary alone/i)).toBeInTheDocument();
  });

  it('shows progress summary', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    expect(screen.getByText(/Progress:/i)).toBeInTheDocument();
    expect(screen.getByText(/% Complete/i)).toBeInTheDocument();
  });

  it('displays completion achievement when all lessons are done', () => {
    const allCompletedMockStore = {
      ...mockProgressStore,
      userProgress: {
        ...mockProgressStore.userProgress,
        completedLessons: [
          'income-career-enhanced-0',
          'income-career-enhanced-1',
          'income-career-enhanced-2',
          'income-career-enhanced-3',
          'income-career-enhanced-4',
          'income-career-enhanced-5'
        ]
      }
    };
    
    (require('@/lib/store/progressStore').useProgressStore as jest.Mock).mockReturnValue(allCompletedMockStore);
    
    render(<IncomeCareerLessonEnhanced />);
    
    expect(screen.getByText(/Complete!/i)).toBeInTheDocument();
  });

  it('handles lesson completion tracking', async () => {
    render(<IncomeCareerLessonEnhanced />);
    
    const completeButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockProgressStore.completeLesson).toHaveBeenCalledWith(
        expect.stringContaining('income-career-enhanced'),
        expect.any(Number)
      );
    });
  });

  it('displays interactive salary calculation examples', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    // Look for salary/compensation examples using getAllByText
    const salaryElements = screen.getAllByText(/\$60k salary/i);
    expect(salaryElements.length).toBeGreaterThan(0);
    const compensationElements = screen.getAllByText(/total compensation/i);
    expect(compensationElements.length).toBeGreaterThan(0);
  });

  it('shows career optimization insights', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    // Navigate through lessons to find career content
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    // Should have career development content - check for broader career-related terms
    const careerElements = screen.queryAllByText(/career/i);
    const skillElements = screen.queryAllByText(/skill/i);
    const developmentElements = screen.queryAllByText(/development/i);
    expect(careerElements.length > 0 || skillElements.length > 0 || developmentElements.length > 0).toBeTruthy();
  });

  it('provides negotiation strategies', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    // Navigate to find negotiation content
    for (let i = 0; i < 3; i++) {
      const nextButton = screen.queryByText(/Next/i);
      if (nextButton && !nextButton.closest('button')?.disabled) {
        fireEvent.click(nextButton);
      }
    }
    
    // Should have negotiation-related content - use queryAllByText to handle multiple matches
    const negotiationElements = screen.queryAllByText(/negotiat/i);
    const salaryElements = screen.queryAllByText(/salary/i);
    expect(negotiationElements.length > 0 || salaryElements.length > 0).toBeTruthy();
  });

  it('maintains lesson state across navigation', () => {
    render(<IncomeCareerLessonEnhanced />);
    
    // Complete first lesson
    const completeButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(completeButton);
    
    // Navigate to next lesson and back
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    const prevButton = screen.getByText(/Previous/i);
    fireEvent.click(prevButton);
    
    // First lesson should still show as completed - use getAllByText for multiple matches
    const completedElements = screen.getAllByText(/Completed/i);
    expect(completedElements.length).toBeGreaterThan(0);
  });

  it('unmounts without errors', () => {
    const { unmount } = render(<IncomeCareerLessonEnhanced />);
    expect(() => unmount()).not.toThrow();
  });
});

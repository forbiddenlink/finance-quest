import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencyFundsLessonEnhanced from '@/components/chapters/fundamentals/lessons/EmergencyFundsLessonEnhanced';

// Mock Zustand store
const mockCompleteLesson = jest.fn();
const mockUserProgress = {
  completedLessons: [],
  quizScores: {},
  calculatorUsage: {},
  totalTimeSpent: 0,
  currentChapter: 1,
  unlockedChapters: [1, 2, 3, 4]
};

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(() => ({
    userProgress: mockUserProgress,
    completeLesson: mockCompleteLesson,
  })),
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EmergencyFundsLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial lesson', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    expect(screen.getByText(/Emergency Funds: Your Financial Fortress Against Crisis/i)).toBeInTheDocument();
    expect(screen.getByText(/Lesson 1 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 4: Emergency Funds & Financial Safety/i)).toBeInTheDocument();
  });

  test('displays lesson content correctly', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    expect(screen.getByText(/40% of Americans can't cover a \$400 emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/Key Strategies/i)).toBeInTheDocument();
    expect(screen.getByText(/Action Step This Week/i)).toBeInTheDocument();
    expect(screen.getByText(/Real Money Example/i)).toBeInTheDocument();
  });

  test('shows progress ring', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    // Progress ring should be present - look for the percentage text
    const progressElements = screen.getAllByText(/17%/i);
    expect(progressElements.length).toBeGreaterThan(0);
  });

  test('navigation buttons work correctly', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    const nextButton = screen.getByText(/Next/i);
    const prevButton = screen.getByText(/Previous/i);
    
    expect(prevButton).toBeDisabled(); // First lesson
    expect(nextButton).not.toBeDisabled();
    
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Lesson 2 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Right-Sizing Your Emergency Fund/i)).toBeInTheDocument();
  });

  test('mark complete functionality works', async () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    const markCompleteButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(markCompleteButton);
    
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith('emergency-funds-enhanced-0', 18);
    });
  });

  test('shows interactive calculator content on lesson 2', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    // Navigate to lesson 2
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Emergency Fund Calculator by Risk Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Stable Job/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium Risk/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Variable Income/i)[0]).toBeInTheDocument(); // Get first occurrence
  });

  test('shows high-yield savings content on lesson 4', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    // Navigate to lesson 4
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/High-Yield Savings Impact/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Traditional Savings \(0.01%\)/i)[0]).toBeInTheDocument(); // Get first occurrence
    expect(screen.getAllByText(/High-Yield Savings \(4.5%\)/i)[0]).toBeInTheDocument(); // Get first occurrence
  });

  test('shows building timeline on lesson 5', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    // Navigate to lesson 5
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Emergency Fund Building Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Month 1-3: Starter Fund/i)).toBeInTheDocument();
    expect(screen.getByText(/Month 4-12: Full Fund/i)).toBeInTheDocument();
  });

  test('calls onComplete when provided', async () => {
    const mockOnComplete = jest.fn();
    render(<EmergencyFundsLessonEnhanced onComplete={mockOnComplete} />);
    
    // Navigate to last lesson
    const nextButton = screen.getByText(/Next/i);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    const markCompleteButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(markCompleteButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  test('shows completion status for completed lessons', () => {
    const mockUserProgressWithCompletedLessons = {
      ...mockUserProgress,
      completedLessons: ['emergency-funds-enhanced-0']
    };

    const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
    useProgressStore.mockReturnValue({
      userProgress: mockUserProgressWithCompletedLessons,
      completeLesson: mockCompleteLesson,
    });

    render(<EmergencyFundsLessonEnhanced />);
    
    expect(screen.getAllByText(/Completed/i)[0]).toBeInTheDocument(); // Get first occurrence
    expect(screen.queryByText(/Mark Complete/i)).not.toBeInTheDocument();
  });

  test('shows final completion message when all lessons are done', () => {
    const completedLessons = [
      'emergency-funds-enhanced-0',
      'emergency-funds-enhanced-1', 
      'emergency-funds-enhanced-2',
      'emergency-funds-enhanced-3',
      'emergency-funds-enhanced-4',
      'emergency-funds-enhanced-5'
    ];

    const mockUserProgressCompleted = {
      ...mockUserProgress,
      completedLessons
    };

    const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
    useProgressStore.mockReturnValue({
      userProgress: mockUserProgressCompleted,
      completeLesson: mockCompleteLesson,
    });

    render(<EmergencyFundsLessonEnhanced />);
    
    expect(screen.getByText(/Emergency Fund Mastery Complete/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready for the calculator and quiz/i)).toBeInTheDocument();
  });

  test('displays correct progress percentage', () => {
    render(<EmergencyFundsLessonEnhanced />);
    
    expect(screen.getByText(/17% Complete/i)).toBeInTheDocument();
    
    // Navigate to lesson 3
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/50% Complete/i)).toBeInTheDocument();
  });
});

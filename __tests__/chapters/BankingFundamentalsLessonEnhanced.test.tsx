import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BankingFundamentalsLessonEnhanced from '@/components/chapters/fundamentals/lessons/BankingFundamentalsLessonEnhanced';

// Mock the progress store
const mockCompleteLesson = jest.fn();
const mockRecordLessonTime = jest.fn();
const mockIsLessonCompleted = jest.fn();
const mockProgressStore = {
  completeLesson: mockCompleteLesson,
  recordLessonTime: mockRecordLessonTime,
  isLessonCompleted: mockIsLessonCompleted,
  userProgress: {
    lessonsCompleted: [],
    completedLessons: [],
    currentStreak: 0,
    totalLessonsCompleted: 0,
  },
};

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockProgressStore);
    }
    return mockProgressStore;
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
  },
}));

// Mock interactive components
jest.mock('@/components/chapters/fundamentals/lessons/BankComparisonTool', () => {
  return function MockBankComparisonTool() {
    return <div data-testid="bank-comparison-tool">Bank Comparison Tool Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/InteractiveBankingWizard', () => {
  return function MockInteractiveBankingWizard() {
    return <div data-testid="interactive-banking-wizard">Interactive Banking Wizard Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/FeeImpactGame', () => {
  return function MockFeeImpactGame() {
    return <div data-testid="fee-impact-game">Fee Impact Game Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/BankingPersonalityAssessment', () => {
  return function MockBankingPersonalityAssessment() {
    return <div data-testid="banking-personality-assessment">Banking Personality Assessment Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/SavingsImpactVisualizer', () => {
  return function MockSavingsImpactVisualizer() {
    return <div data-testid="savings-impact-visualizer">Savings Impact Visualizer Component</div>;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('BankingFundamentalsLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLessonCompleted.mockReturnValue(false);
  });

  test('renders the lesson component with correct title', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Banking Account Types: Your Financial Foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 2: Banking Optimization & Wealth Foundation/i)).toBeInTheDocument();
  });

  test('displays progress ring with correct lessons count', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    // Should show lesson 1 of 6
    expect(screen.getByText(/Lesson 1 of 6/i)).toBeInTheDocument();
  });

  test('shows lesson navigation with previous/next buttons', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled(); // Should be disabled on first lesson
  });

  test('displays first lesson content by default', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Banking Account Types: Your Financial Foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/Think of banking accounts as the tools/i)).toBeInTheDocument();
  });

  test('navigates to next lesson when next button is clicked', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Should show second lesson
    expect(screen.getByText(/Banking Fees: The \$300\+ Annual Wealth Leak/i)).toBeInTheDocument();
  });

  test('navigates to previous lesson when previous button is clicked', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    // Navigate to second lesson first
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Then go back
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    
    // Should be back to first lesson
    expect(screen.getByText(/Banking Account Types: Your Financial Foundation/i)).toBeInTheDocument();
  });

  test('disables next button on last lesson', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Navigate to last lesson (lesson 6)
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    expect(nextButton).toBeDisabled();
  });

  test('marks lesson as complete when complete button is clicked', async () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    const completeButton = screen.getByRole('button', { name: /mark complete/i });
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith(
        'banking-fundamentals-enhanced-0',
        expect.any(Number)
      );
    });
  });

  test('displays lesson progress correctly', () => {
    // Mock one completed lesson
    mockIsLessonCompleted.mockImplementation((lessonId: string) => 
      lessonId === 'banking-fundamentals-enhanced-0'
    );
    
    render(<BankingFundamentalsLessonEnhanced />);
    
    // Should show progress completed lessons vs total - look for the specific progress text
    expect(screen.getByText(/Progress: \d+ of 6 lessons completed/i)).toBeInTheDocument();
  });

  test('shows interactive components for appropriate lessons', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    // Navigate to lesson 3 which should have BankComparisonTool
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton); // lesson 2
    fireEvent.click(nextButton); // lesson 3
    
    expect(screen.getByText(/bank comparison/i) || screen.getByText(/compare banks/i)).toBeInTheDocument();
  });

  test('displays lesson content with key points', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    // Check for key points in first lesson
    expect(screen.getByText(/Checking accounts: Your financial command center/i)).toBeInTheDocument();
    expect(screen.getByText(/Traditional savings: FDIC-protected/i)).toBeInTheDocument();
    expect(screen.getByText(/High-yield savings: 4-5% APY/i)).toBeInTheDocument();
  });

  test('shows practical action for each lesson', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/This week: Open a high-yield savings account/i)).toBeInTheDocument();
  });

  test('displays money example for lessons', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    // Search for the specific money example content with more specific text
    expect(screen.getByText(/Jamal moved his \$8,000 emergency fund/i)).toBeInTheDocument();
  });

  test('handles lesson completion callback', async () => {
    const onComplete = jest.fn();
    render(<BankingFundamentalsLessonEnhanced onComplete={onComplete} />);
    
    // Navigate to the last lesson (lesson 6, index 5)
    const nextButton = screen.getByRole('button', { name: /next/i });
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    // Complete the last lesson
    const completeButton = screen.getByRole('button', { name: /mark complete/i });
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  test('tracks time spent on lessons', async () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    // Wait a bit then complete lesson
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const completeButton = screen.getByRole('button', { name: /mark complete/i });
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith(
        'banking-fundamentals-enhanced-0',
        expect.any(Number)
      );
    });
    
    const timeSpent = (mockCompleteLesson as jest.Mock).mock.calls[0][1];
    expect(timeSpent).toBeGreaterThan(0);
  });

  test('shows all interactive components across different lessons', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Lesson 1 should have BankingPersonalityAssessment
    expect(screen.getByText(/discover your banking personality/i)).toBeInTheDocument();
    
    // Navigate through lessons
    fireEvent.click(nextButton); // lesson 2
    expect(screen.getByText(/lesson 2 of 6/i)).toBeInTheDocument();
    
    fireEvent.click(nextButton); // lesson 3  
    expect(screen.getByText(/lesson 3 of 6/i)).toBeInTheDocument();
    
    // Navigate to final lesson
    fireEvent.click(nextButton); // lesson 4
    fireEvent.click(nextButton); // lesson 5
    fireEvent.click(nextButton); // lesson 6
    expect(screen.getByText(/lesson 6 of 6/i)).toBeInTheDocument();
  });

  test('handles lesson navigation correctly with boundary conditions', () => {
    render(<BankingFundamentalsLessonEnhanced />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Start at lesson 1 - previous should be disabled
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    
    // Navigate to last lesson
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    // At lesson 6 - next should be disabled
    expect(nextButton).toBeDisabled();
    expect(prevButton).not.toBeDisabled();
  });
});

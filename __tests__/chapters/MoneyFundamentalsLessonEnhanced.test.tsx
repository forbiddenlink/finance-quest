import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoneyFundamentalsLessonEnhanced from '@/components/chapters/fundamentals/lessons/MoneyFundamentalsLessonEnhanced';

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

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

// Mock interactive lesson components
jest.mock('@/components/chapters/fundamentals/lessons/MoneyPersonalityAssessment', () => {
  return function MockedMoneyPersonalityAssessment() {
    return <div data-testid="money-personality-assessment">Money Personality Assessment Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/InteractiveCompoundVisualization', () => {
  return function MockedInteractiveCompoundVisualization({ 
    initialAmount, 
    initialYears, 
    initialRate 
  }: { 
    initialAmount?: number; 
    initialYears?: number; 
    initialRate?: number; 
  }) {
    return (
      <div data-testid="interactive-compound-visualization">
        Interactive Compound Visualization
        <div data-testid="compound-params">
          Amount: {initialAmount}, Years: {initialYears}, Rate: {initialRate}%
        </div>
      </div>
    );
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/InteractiveBudgetAllocation', () => {
  return function MockedInteractiveBudgetAllocation() {
    return <div data-testid="interactive-budget-allocation">Interactive Budget Allocation Game</div>;
  };
});

const mockCompleteLesson = jest.fn();
const mockUserProgress = {
  completedLessons: [],
  quizScores: {},
  calculatorUsage: {},
};

beforeEach(() => {
  jest.clearAllMocks();
  
  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    userProgress: mockUserProgress,
    completeLesson: mockCompleteLesson,
  });
});

describe('MoneyFundamentalsLessonEnhanced', () => {
  test('renders the lesson component with first lesson content', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Your Money Story: From Past to Empowered Future/i)).toBeInTheDocument();
    expect(screen.getByText(/Your relationship with money was shaped before you earned your first dollar/i)).toBeInTheDocument();
  });

  test('displays correct lesson count in progress indicator', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Lesson 1 of 6/i)).toBeInTheDocument();
  });

  test('shows key points section for current lesson', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Key Points/i)).toBeInTheDocument();
    expect(screen.getByText(/Money messages from childhood create limiting beliefs/i)).toBeInTheDocument();
  });

  test('displays practical action section', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Take Action Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Write down 3 money messages you heard growing up/i)).toBeInTheDocument();
  });

  test('shows real money example section', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Real Money Example/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria.*teacher.*45k salary/i)).toBeInTheDocument();
  });

  test('navigation buttons work correctly', async () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    // Previous button should be disabled on first lesson
    const prevButton = screen.getByRole('button', { name: /Previous/i });
    expect(prevButton).toBeDisabled();
    
    // Next button should be enabled
    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(nextButton).not.toBeDisabled();
    
    // Click next to go to lesson 2
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Scarcity vs Abundance: The Wealth Mindset Shift/i)).toBeInTheDocument();
    });
    
    // Now previous should be enabled
    expect(prevButton).not.toBeDisabled();
  });

  test('mark complete button triggers progress tracking', async () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    const markCompleteButton = screen.getByRole('button', { name: /Mark Complete/i });
    fireEvent.click(markCompleteButton);
    
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith('money-fundamentals-enhanced-0', 12);
    });
  });

  test('shows completed status for completed lessons', () => {
    // Mock lesson as completed
    const completedUserProgress = {
      ...mockUserProgress,
      completedLessons: ['money-fundamentals-enhanced-0']
    };
    
    const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
    useProgressStore.mockReturnValue({
      userProgress: completedUserProgress,
      completeLesson: mockCompleteLesson,
    });
    
    render(<MoneyFundamentalsLessonEnhanced />);
    
    // Check for completed status with more specific selector
    const completedElements = screen.getAllByText('Completed');
    expect(completedElements.length).toBeGreaterThan(0);
    expect(screen.queryByText(/Mark Complete/i)).not.toBeInTheDocument();
  });

  test('displays progress summary correctly', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    const progressText = screen.getByText(/Progress:/i).nextSibling;
    expect(progressText).toHaveTextContent('0 of 6 lessons');
    
    const completionText = screen.getByText(/Completion:/i).nextSibling;
    expect(completionText).toHaveTextContent('17%');
  });

  test('shows foundation complete message when all lessons done', () => {
    // Mock all lessons as completed
    const allCompletedProgress = {
      ...mockUserProgress,
      completedLessons: [
        'money-fundamentals-enhanced-0',
        'money-fundamentals-enhanced-1',
        'money-fundamentals-enhanced-2',
        'money-fundamentals-enhanced-3',
        'money-fundamentals-enhanced-4',
        'money-fundamentals-enhanced-5'
      ]
    };
    
    const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
    useProgressStore.mockReturnValue({
      userProgress: allCompletedProgress,
      completeLesson: mockCompleteLesson,
    });
    
    render(<MoneyFundamentalsLessonEnhanced />);
    
    expect(screen.getByText(/Foundation Complete! You're ready for the paycheck calculator and quiz/i)).toBeInTheDocument();
  });

  test('displays money personality assessment on lesson 3', async () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    // Navigate to lesson 3 (index 2)
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Understanding Your Financial Personality Type/i)).toBeInTheDocument();
      expect(screen.getByTestId('money-personality-assessment')).toBeInTheDocument();
    });
  });

  test('displays compound visualization on lesson 4', async () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    // Navigate to lesson 4 (index 3)
    const nextButton = screen.getByRole('button', { name: /Next/i });
    for (let i = 0; i < 3; i++) {
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/The Compound Effect: Small Actions, Massive Results/i)).toBeInTheDocument();
      expect(screen.getByTestId('interactive-compound-visualization')).toBeInTheDocument();
    });
  });

  test('displays budget allocation game on lesson 5', async () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    // Navigate to lesson 5 (index 4)
    const nextButton = screen.getByRole('button', { name: /Next/i });
    for (let i = 0; i < 4; i++) {
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Financial Goal Setting: SMART vs PACT Framework/i)).toBeInTheDocument();
      expect(screen.getByTestId('interactive-budget-allocation')).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    // Check for semantic headings
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Key Points/i })).toBeInTheDocument();
    
    // Check buttons are accessible
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  test('handles edge case of invalid lesson navigation', () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    // Try to go to previous when on first lesson
    const prevButton = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(prevButton);
    
    // Should still be on lesson 1
    expect(screen.getByText(/Your Money Story: From Past to Empowered Future/i)).toBeInTheDocument();
  });

  test('validates lesson content exists for all 6 lessons', async () => {
    render(<MoneyFundamentalsLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    
    // Check each lesson has content
    const expectedTitles = [
      'Your Money Story: From Past to Empowered Future',
      'Scarcity vs Abundance: The Wealth Mindset Shift',
      'Understanding Your Financial Personality Type',
      'The Compound Effect: Small Actions, Massive Results',
      'Financial Goal Setting: SMART vs PACT Framework',
      'Cognitive Biases: The Hidden Wealth Killers'
    ];
    
    for (let i = 0; i < expectedTitles.length; i++) {
      await waitFor(() => {
        expect(screen.getByText(expectedTitles[i])).toBeInTheDocument();
      });
      
      if (i < expectedTitles.length - 1) {
        fireEvent.click(nextButton);
      }
    }
  });
});
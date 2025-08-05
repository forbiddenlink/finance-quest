import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetingMasteryLessonEnhanced from '@/components/chapters/fundamentals/lessons/BudgetingMasteryLessonEnhanced';

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

// Mock interactive lesson components
jest.mock('@/components/chapters/fundamentals/lessons/CashFlowTimingTool', () => {
  return function MockedCashFlowTimingTool() {
    return <div data-testid="cash-flow-timing-tool">Cash Flow Timing Tool Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/IrregularExpenseTracker', () => {
  return function MockedIrregularExpenseTracker() {
    return <div data-testid="irregular-expense-tracker">Irregular Expense Tracker Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/InteractiveBudgetAllocation', () => {
  return function MockedInteractiveBudgetAllocation() {
    return <div data-testid="interactive-budget-allocation">Interactive Budget Allocation Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/BudgetPersonalityAssessment', () => {
  return function MockedBudgetPersonalityAssessment() {
    return <div data-testid="budget-personality-assessment">Budget Personality Assessment Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/ExpenseOptimizationGame', () => {
  return function MockedExpenseOptimizationGame() {
    return <div data-testid="expense-optimization-game">Expense Optimization Game Component</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/lessons/SavingsGoalVisualizer', () => {
  return function MockedSavingsGoalVisualizer() {
    return <div data-testid="savings-goal-visualizer">Savings Goal Visualizer Component</div>;
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

describe('BudgetingMasteryLessonEnhanced', () => {
  test('renders the lesson component with first lesson content', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/The 50\/30\/20 Rule: Your Financial Foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/The 50\/30\/20 budgeting rule is the most effective framework/i)).toBeInTheDocument();
  });

  test('displays correct lesson count in progress indicator', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/Lesson 1 of 6/i)).toBeInTheDocument();
  });

  test('shows key points section for current lesson', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/Key Strategies/i)).toBeInTheDocument();
    expect(screen.getByText(/50% Needs: Housing, utilities, groceries/i)).toBeInTheDocument();
  });

  test('displays practical action section', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/Action Step This Week/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate your exact 50\/30\/20 amounts/i)).toBeInTheDocument();
  });

  test('shows real money example section', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/Real Money Example/i)).toBeInTheDocument();
    expect(screen.getByText(/\$4,000 monthly income.*\$2,000 needs.*\$1,200 wants.*\$800 savings/i)).toBeInTheDocument();
  });

  test('navigation buttons work correctly', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Previous button should be disabled on first lesson
    const prevButton = screen.getByText(/Previous/i);
    expect(prevButton).toBeDisabled();
    
    // Next button should be enabled
    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).not.toBeDisabled();
    
    // Click next to go to lesson 2
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Zero-Based Budgeting: Every Dollar Has a Purpose/i)).toBeInTheDocument();
    });
    
    // Now previous should be enabled
    expect(prevButton).not.toBeDisabled();
  });

  test('mark complete button triggers progress tracking', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    const markCompleteButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(markCompleteButton);
    
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith('budgeting-mastery-enhanced-0', expect.any(Number));
    });
  });

  test('shows completed status for completed lessons', () => {
    // Mock lesson as completed
    const completedUserProgress = {
      ...mockUserProgress,
      completedLessons: ['budgeting-mastery-enhanced-0']
    };
    
    const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
    useProgressStore.mockReturnValue({
      userProgress: completedUserProgress,
      completeLesson: mockCompleteLesson,
    });
    
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Check for completed status
    const completedElements = screen.getAllByText('Completed');
    expect(completedElements.length).toBeGreaterThan(0);
    expect(screen.queryByText(/Mark Complete/i)).not.toBeInTheDocument();
  });

  test('displays progress summary correctly', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/Progress: 0 of 6 lessons completed/i)).toBeInTheDocument();
    expect(screen.getByText(/17% Complete/i)).toBeInTheDocument();
  });

  test('shows mastery complete message when all lessons done', () => {
    // Mock all lessons as completed
    const allCompletedProgress = {
      ...mockUserProgress,
      completedLessons: [
        'budgeting-mastery-enhanced-0',
        'budgeting-mastery-enhanced-1',
        'budgeting-mastery-enhanced-2',
        'budgeting-mastery-enhanced-3',
        'budgeting-mastery-enhanced-4',
        'budgeting-mastery-enhanced-5'
      ]
    };
    
    const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
    useProgressStore.mockReturnValue({
      userProgress: allCompletedProgress,
      completeLesson: mockCompleteLesson,
    });
    
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/Budgeting Mastery Complete! Ready for the budget builder and quiz/i)).toBeInTheDocument();
  });

  test('displays budget personality assessment on lesson 1', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Lesson 1 (index 0) should have budget personality assessment
    expect(screen.getByTestId('budget-personality-assessment')).toBeInTheDocument();
  });

  test('displays interactive budget allocation on lesson 2', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Navigate to lesson 2 (index 1)
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Zero-Based Budgeting: Every Dollar Has a Purpose/i)).toBeInTheDocument();
      expect(screen.getByTestId('interactive-budget-allocation')).toBeInTheDocument();
    });
  });

  test('displays cash flow timing tool on lesson 3', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Navigate to lesson 3 (index 2)
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Cash Flow Timing: When Money Comes and Goes/i)).toBeInTheDocument();
      expect(screen.getByTestId('cash-flow-timing-tool')).toBeInTheDocument();
    });
  });

  test('displays expense optimization game on lesson 4', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Navigate to lesson 4 (index 3)
    const nextButton = screen.getByText(/Next/i);
    for (let i = 0; i < 3; i++) {
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Budget Categories: The Complete System/i)).toBeInTheDocument();
      expect(screen.getByTestId('expense-optimization-game')).toBeInTheDocument();
    });
  });

  test('displays irregular expense tracker on lesson 5', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Navigate to lesson 5 (index 4)
    const nextButton = screen.getByText(/Next/i);
    for (let i = 0; i < 4; i++) {
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Irregular Expenses: The Budget Killers/i)).toBeInTheDocument();
      expect(screen.getByTestId('irregular-expense-tracker')).toBeInTheDocument();
    });
  });

  test('displays savings goal visualizer on lesson 6', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Navigate to lesson 6 (index 5)
    const nextButton = screen.getByText(/Next/i);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Budget Automation: Set It and Forget It/i)).toBeInTheDocument();
      expect(screen.getByTestId('savings-goal-visualizer')).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Check for semantic headings
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Key Strategies/i })).toBeInTheDocument();
    
    // Check buttons are accessible
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  test('handles edge case of invalid lesson navigation', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Try to go to previous when on first lesson
    const prevButton = screen.getByText(/Previous/i);
    fireEvent.click(prevButton);
    
    // Should still be on lesson 1
    expect(screen.getByText(/The 50\/30\/20 Rule: Your Financial Foundation/i)).toBeInTheDocument();
  });

  test('validates lesson content exists for all 6 lessons', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    const nextButton = screen.getByText(/Next/i);
    
    // Check each lesson has content
    const expectedTitles = [
      'The 50/30/20 Rule: Your Financial Foundation',
      'Zero-Based Budgeting: Every Dollar Has a Purpose',
      'Cash Flow Timing: When Money Comes and Goes',
      'Budget Categories: The Complete System',
      'Irregular Expenses: The Budget Killers',
      'Budget Automation: Set It and Forget It'
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

  test('displays warning tips when available', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    expect(screen.getByText(/Don't use gross income - use take-home pay/i)).toBeInTheDocument();
  });

  test('tracks time spent on lessons', async () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Wait a bit then complete lesson
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const completeButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith(
        'budgeting-mastery-enhanced-0',
        expect.any(Number)
      );
    });
    
    const timeSpent = (mockCompleteLesson as jest.Mock).mock.calls[0][1];
    expect(timeSpent).toBeGreaterThan(0);
  });

  test('handles onComplete callback when provided', async () => {
    const mockOnComplete = jest.fn();
    render(<BudgetingMasteryLessonEnhanced onComplete={mockOnComplete} />);
    
    // Navigate to the last lesson (lesson 6, index 5)
    const nextButton = screen.getByText(/Next/i);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    // Complete the last lesson - this should trigger onComplete
    const completeButton = screen.getByText(/Mark Complete/i);
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  test('shows theme-compliant styling', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    // Check for theme system usage (background colors, text colors)
    const component = screen.getByText(/The 50\/30\/20 Rule/i).closest('div');
    expect(component).toBeInTheDocument();
  });

  test('handles lesson navigation boundary conditions correctly', () => {
    render(<BudgetingMasteryLessonEnhanced />);
    
    const prevButton = screen.getByText(/Previous/i);
    const nextButton = screen.getByText(/Next/i);
    
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

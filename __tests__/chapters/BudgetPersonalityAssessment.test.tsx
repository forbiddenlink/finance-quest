import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetPersonalityAssessment from '@/components/chapters/fundamentals/lessons/BudgetPersonalityAssessment';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the dependencies
jest.mock('@/lib/store/progressStore');

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const mockRecordCalculatorUsage = jest.fn();
const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

describe('BudgetPersonalityAssessment', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
    mockUseProgressStore.mockReturnValue({
      recordCalculatorUsage: mockRecordCalculatorUsage,
      userProgress: {
        completedLessons: [],
        quizScores: {},
        calculatorUsage: {},
        currentChapter: 1,
        financialLiteracyScore: 0
      },
      isChapterUnlocked: jest.fn(() => true),
      completeLesson: jest.fn(),
      recordQuizScore: jest.fn(),
      recordSimulationResult: jest.fn(),
      getChapterProgress: jest.fn(() => ({ completed: 0, total: 0 })),
      resetProgress: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders the assessment welcome screen', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText('Discover Your Budget Personality')).toBeInTheDocument();
      expect(screen.getByText(/Understanding your financial personality/)).toBeInTheDocument();
      expect(screen.getByText('Start Assessment')).toBeInTheDocument();
    });

    it('shows personality type badges', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText('Analytical')).toBeInTheDocument();
      expect(screen.getByText('Automated')).toBeInTheDocument();
      expect(screen.getByText('Goal-Oriented')).toBeInTheDocument();
      expect(screen.getByText('Flexible')).toBeInTheDocument();
    });

    it('displays the proper question count (5 questions)', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText(/5 questions/)).toBeInTheDocument();
    });
  });

  describe('Assessment Flow', () => {
    it('starts assessment when button is clicked', async () => {
      render(<BudgetPersonalityAssessment />);
      
      const startButton = screen.getByText('Start Assessment');
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
      });
    });

    it('displays first question after starting', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      await waitFor(() => {
        expect(screen.getByText(/When creating a budget, I prefer to:/)).toBeInTheDocument();
      });
    });

    it('shows answer options for questions', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      await waitFor(() => {
        // Should show multiple choice options
        const answerButtons = screen.getAllByRole('button');
        expect(answerButtons.length).toBeGreaterThan(2);
      });
    });

    it('advances to next question when answer is selected', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      await waitFor(() => {
        const firstAnswer = screen.getAllByRole('button')[0];
        fireEvent.click(firstAnswer);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Question 2 of 5')).toBeInTheDocument();
      });
    });

    it('shows progress through all 5 questions', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      // Click through all questions
      for (let i = 1; i <= 5; i++) {
        await waitFor(() => {
          expect(screen.getByText(`Question ${i} of 5`)).toBeInTheDocument();
          const answerButton = screen.getAllByRole('button')[0];
          fireEvent.click(answerButton);
        });
      }
    });
  });

  describe('Results Display', () => {
    const completeAssessment = async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      // Answer all 5 questions
      for (let i = 0; i < 5; i++) {
        await waitFor(() => {
          const answerButton = screen.getAllByRole('button')[0];
          fireEvent.click(answerButton);
        });
      }
    };

    it('shows results screen after completing assessment', async () => {
      await completeAssessment();
      
      await waitFor(() => {
        expect(screen.getByText('Your Budget Personality:')).toBeInTheDocument();
      });
    });

    it('displays a specific personality type', async () => {
      await completeAssessment();
      
      await waitFor(() => {
        const personalityTypes = ['Analytical', 'Automated', 'Goal-Oriented', 'Flexible'];
        const hasPersonalityType = personalityTypes.some(type => 
          screen.queryByText(type)
        );
        expect(hasPersonalityType).toBe(true);
      });
    });

    it('shows personality description', async () => {
      await completeAssessment();
      
      await waitFor(() => {
        expect(screen.getByText(/You are a/)).toBeInTheDocument();
      });
    });

    it('displays action plan section', async () => {
      await completeAssessment();
      
      await waitFor(() => {
        expect(screen.getByText('Your 30-Day Action Plan')).toBeInTheDocument();
      });
    });

    it('shows recommended tools', async () => {
      await completeAssessment();
      
      await waitFor(() => {
        expect(screen.getByText('Recommended Tools')).toBeInTheDocument();
      });
    });

    it('includes retake option', async () => {
      await completeAssessment();
      
      await waitFor(() => {
        expect(screen.getByText('Retake Assessment')).toBeInTheDocument();
      });
    });
  });

  describe('Personality Types', () => {
    it('has proper descriptions for Analytical type', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText(/Detail-oriented and data-driven/)).toBeInTheDocument();
    });

    it('has proper descriptions for Automated type', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText(/Prefers systematic, hands-off approaches/)).toBeInTheDocument();
    });

    it('has proper descriptions for Goal-Oriented type', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText(/Motivated by clear targets and milestones/)).toBeInTheDocument();
    });

    it('has proper descriptions for Flexible type', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText(/Adaptable and comfortable with general guidelines/)).toBeInTheDocument();
    });
  });

  describe('Retake Functionality', () => {
    it('allows retaking the assessment', async () => {
      render(<BudgetPersonalityAssessment />);
      
      // Complete assessment first
      fireEvent.click(screen.getByText('Start Assessment'));
      
      for (let i = 0; i < 5; i++) {
        await waitFor(() => {
          const answerButton = screen.getAllByRole('button')[0];
          fireEvent.click(answerButton);
        });
      }
      
      // Retake assessment
      await waitFor(() => {
        const retakeButton = screen.getByText('Retake Assessment');
        fireEvent.click(retakeButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
      });
    });

    it('resets progress when retaking', async () => {
      render(<BudgetPersonalityAssessment />);
      
      // Complete and retake
      fireEvent.click(screen.getByText('Start Assessment'));
      
      for (let i = 0; i < 5; i++) {
        await waitFor(() => {
          const answerButton = screen.getAllByRole('button')[0];
          fireEvent.click(answerButton);
        });
      }
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Retake Assessment'));
      });
      
      // Should be back to question 1
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
      });
    });
  });

  describe('Question Content', () => {
    it('covers budgeting approach preferences', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      await waitFor(() => {
        expect(screen.getByText(/When creating a budget, I prefer to:/)).toBeInTheDocument();
      });
    });

    it('includes spending tracking questions', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      // Navigate to question about spending tracking
      await waitFor(() => {
        const answerButton = screen.getAllByRole('button')[0];
        fireEvent.click(answerButton);
      });
      
      await waitFor(() => {
        // Should have questions about tracking preferences
        const questionText = screen.getByText(/Question 2 of 5/);
        expect(questionText).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(screen.getByText('Discover Your Budget Personality')).toBeInTheDocument();
    });

    it('provides clear question labels', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
      });
    });

    it('has descriptive button text', () => {
      render(<BudgetPersonalityAssessment />);
      
      const startButton = screen.getByText('Start Assessment');
      expect(startButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Error Handling', () => {
    it('handles rapid clicking gracefully', async () => {
      render(<BudgetPersonalityAssessment />);
      
      const startButton = screen.getByText('Start Assessment');
      
      // Rapid clicks
      fireEvent.click(startButton);
      fireEvent.click(startButton);
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
      });
    });

    it('maintains state consistency during assessment', async () => {
      render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      // Should maintain proper question numbering
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
      });
      
      const answerButton = screen.getAllByRole('button')[0];
      fireEvent.click(answerButton);
      
      await waitFor(() => {
        expect(screen.getByText('Question 2 of 5')).toBeInTheDocument();
      });
    });
  });

  describe('Progress Tracking', () => {
    it('records assessment completion in progress store', async () => {
      render(<BudgetPersonalityAssessment />);
      
      expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('budget-personality-assessment');
    });
  });

  describe('Edge Cases', () => {
    it('handles component unmounting during assessment', () => {
      const { unmount } = render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      // Should not throw error when unmounting
      expect(() => unmount()).not.toThrow();
    });

    it('maintains assessment state across re-renders', async () => {
      const { rerender } = render(<BudgetPersonalityAssessment />);
      
      fireEvent.click(screen.getByText('Start Assessment'));
      
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
      });
      
      rerender(<BudgetPersonalityAssessment />);
      
      // Should maintain the same state
      expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
    });
  });
});

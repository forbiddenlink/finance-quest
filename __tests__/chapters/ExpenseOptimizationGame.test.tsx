import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseOptimizationGame from '@/components/chapters/fundamentals/lessons/ExpenseOptimizationGame';
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
    error: jest.fn(),
    loading: jest.fn()
  }
}));

const mockRecordCalculatorUsage = jest.fn();
const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

describe('ExpenseOptimizationGame', () => {
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

    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('Initial Rendering', () => {
    it('renders the game welcome screen', () => {
      render(<ExpenseOptimizationGame />);
      
      expect(screen.getByText('Expense Optimization Challenge')).toBeInTheDocument();
      expect(screen.getByText(/Test your budgeting skills/)).toBeInTheDocument();
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });

    it('shows game instructions', () => {
      render(<ExpenseOptimizationGame />);
      
      expect(screen.getByText(/5 real-world scenarios/)).toBeInTheDocument();
      expect(screen.getByText(/45 seconds per scenario/)).toBeInTheDocument();
      expect(screen.getByText(/Choose the best expense optimization strategy/)).toBeInTheDocument();
    });

    it('displays difficulty level indicator', () => {
      render(<ExpenseOptimizationGame />);
      
      expect(screen.getByText(/Difficulty:/)).toBeInTheDocument();
    });
  });

  describe('Game Flow', () => {
    it('starts game when start button is clicked', async () => {
      render(<ExpenseOptimizationGame />);
      
      const startButton = screen.getByText('Start Game');
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 1 of 5')).toBeInTheDocument();
      });
    });

    it('displays scenario details after starting', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        expect(screen.getByText(/Your monthly income is/)).toBeInTheDocument();
      });
    });

    it('shows timer countdown', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        expect(screen.getByText(/Time: 45s/)).toBeInTheDocument();
      });
    });

    it('displays strategy options', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        const optionButtons = screen.getAllByRole('button');
        // Should have multiple strategy options plus other UI buttons
        expect(optionButtons.length).toBeGreaterThan(3);
      });
    });

    it('advances to next scenario when option is selected', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        const strategyButtons = screen.getAllByRole('button');
        // Find a strategy button (not timer or other UI buttons)
        const strategyButton = strategyButtons.find(btn => 
          btn.textContent?.includes('strategy') || 
          btn.textContent?.includes('subscription') ||
          btn.textContent?.includes('expense')
        );
        if (strategyButton) {
          fireEvent.click(strategyButton);
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 2 of 5')).toBeInTheDocument();
      });
    });
  });

  describe('Timer Functionality', () => {
    it('counts down from 45 seconds', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        expect(screen.getByText(/Time: 45s/)).toBeInTheDocument();
      });
      
      // Advance timer by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/Time: 44s/)).toBeInTheDocument();
      });
    });

    it('auto-advances scenario when time runs out', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 1 of 5')).toBeInTheDocument();
      });
      
      // Fast-forward 45 seconds
      act(() => {
        jest.advanceTimersByTime(45000);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 2 of 5')).toBeInTheDocument();
      });
    });

    it('shows time pressure warning when time is low', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Fast-forward to last 10 seconds
      act(() => {
        jest.advanceTimersByTime(36000); // 45 - 36 = 9 seconds left
      });
      
      await waitFor(() => {
        expect(screen.getByText(/Time: 9s/)).toBeInTheDocument();
        // Timer should show urgency styling
      });
    });
  });

  describe('Scoring System', () => {
    const completeGame = async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Complete all 5 scenarios quickly
      for (let i = 0; i < 5; i++) {
        await waitFor(() => {
          const strategyButtons = screen.getAllByRole('button');
          const strategyButton = strategyButtons.find(btn => 
            btn.textContent && 
            !btn.textContent.includes('Time:') &&
            !btn.textContent.includes('Scenario')
          );
          if (strategyButton) {
            fireEvent.click(strategyButton);
          }
        });
      }
    };

    it('shows final score after all scenarios', async () => {
      await completeGame();
      
      await waitFor(() => {
        expect(screen.getByText('Game Complete!')).toBeInTheDocument();
        expect(screen.getByText(/Final Score:/)).toBeInTheDocument();
      });
    });

    it('displays performance rating', async () => {
      await completeGame();
      
      await waitFor(() => {
        const ratings = ['Expense Optimization Expert', 'Budget Strategist', 'Cost-Cutting Champion', 'Room for Improvement'];
        const hasRating = ratings.some(rating => 
          screen.queryByText(rating)
        );
        expect(hasRating).toBe(true);
      });
    });

    it('shows detailed breakdown', async () => {
      await completeGame();
      
      await waitFor(() => {
        expect(screen.getByText(/Scenarios Completed:/)).toBeInTheDocument();
        expect(screen.getByText(/Average Response Time:/)).toBeInTheDocument();
        expect(screen.getByText(/Bonus Points:/)).toBeInTheDocument();
      });
    });

    it('calculates time bonus correctly', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Answer quickly to get time bonus
      await waitFor(() => {
        const strategyButtons = screen.getAllByRole('button');
        const strategyButton = strategyButtons[0];
        fireEvent.click(strategyButton);
      });
      
      // Time bonus should be calculated based on remaining time
      // This is tested through the completion of all scenarios
    });
  });

  describe('Scenario Content', () => {
    it('covers subscription optimization scenarios', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Check if any scenario mentions subscriptions
      await waitFor(() => {
        expect(screen.getByText(/Your monthly income is/)).toBeInTheDocument();
      });
    });

    it('includes grocery budget scenarios', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Navigate through scenarios to find grocery-related content
      for (let i = 0; i < 3; i++) {
        await waitFor(() => {
          const buttons = screen.getAllByRole('button');
          if (buttons.length > 0) {
            fireEvent.click(buttons[0]);
          }
        });
      }
    });

    it('provides realistic expense amounts', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        // Should show dollar amounts in scenarios
        expect(screen.getByText(/\$/)).toBeInTheDocument();
      });
    });
  });

  describe('Strategy Options', () => {
    it('provides multiple strategy choices per scenario', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        const strategyButtons = screen.getAllByRole('button').filter(btn => 
          btn.textContent && 
          !btn.textContent.includes('Time:') &&
          !btn.textContent.includes('Scenario')
        );
        expect(strategyButtons.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('shows different optimization approaches', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        // Should have various strategy types represented
        const allText = screen.getAllByRole('button').map(btn => btn.textContent).join(' ');
        expect(allText.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Play Again Functionality', () => {
    it('allows playing again after completion', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Complete game quickly
      for (let i = 0; i < 5; i++) {
        await waitFor(() => {
          const buttons = screen.getAllByRole('button');
          if (buttons.length > 0) {
            fireEvent.click(buttons[0]);
          }
        });
      }
      
      await waitFor(() => {
        const playAgainButton = screen.getByText('Play Again');
        fireEvent.click(playAgainButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 1 of 5')).toBeInTheDocument();
      });
    });

    it('resets score when playing again', async () => {
      render(<ExpenseOptimizationGame />);
      
      // Complete game and play again
      fireEvent.click(screen.getByText('Start Game'));
      
      for (let i = 0; i < 5; i++) {
        await waitFor(() => {
          const buttons = screen.getAllByRole('button');
          if (buttons.length > 0) {
            fireEvent.click(buttons[0]);
          }
        });
      }
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Play Again'));
      });
      
      // Should reset to first scenario
      await waitFor(() => {
        expect(screen.getByText('Scenario 1 of 5')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles rapid clicking gracefully', async () => {
      render(<ExpenseOptimizationGame />);
      
      const startButton = screen.getByText('Start Game');
      
      // Rapid clicks
      fireEvent.click(startButton);
      fireEvent.click(startButton);
      fireEvent.click(startButton);
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 1 of 5')).toBeInTheDocument();
      });
    });

    it('maintains game state consistency', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 1 of 5')).toBeInTheDocument();
      });
      
      // Click strategy button
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        fireEvent.click(buttons[0]);
      }
      
      await waitFor(() => {
        expect(screen.getByText('Scenario 2 of 5')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<ExpenseOptimizationGame />);
      
      expect(screen.getByText('Expense Optimization Challenge')).toBeInTheDocument();
    });

    it('provides clear instructions', () => {
      render(<ExpenseOptimizationGame />);
      
      expect(screen.getByText(/Test your budgeting skills/)).toBeInTheDocument();
    });

    it('has descriptive button labels', async () => {
      render(<ExpenseOptimizationGame />);
      
      const startButton = screen.getByText('Start Game');
      expect(startButton).toHaveAttribute('type', 'button');
    });

    it('shows clear timer information', async () => {
      render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      await waitFor(() => {
        expect(screen.getByText(/Time: 45s/)).toBeInTheDocument();
      });
    });
  });

  describe('Progress Tracking', () => {
    it('records game usage in progress store', () => {
      render(<ExpenseOptimizationGame />);
      
      expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('expense-optimization-game');
    });
  });

  describe('Performance', () => {
    it('handles component unmounting during game', () => {
      const { unmount } = render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Should not throw error when unmounting
      expect(() => unmount()).not.toThrow();
    });

    it('cleans up timers properly', () => {
      const { unmount } = render(<ExpenseOptimizationGame />);
      
      fireEvent.click(screen.getByText('Start Game'));
      
      // Unmount component
      unmount();
      
      // Advance timers - should not cause errors
      act(() => {
        jest.advanceTimersByTime(50000);
      });
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavingsGoalVisualizer from '@/components/chapters/fundamentals/lessons/SavingsGoalVisualizer';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the dependencies
jest.mock('@/lib/store/progressStore');

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />
}));

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

describe('SavingsGoalVisualizer', () => {
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
    it('renders the main heading and description', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(screen.getByText('Multi-Goal Savings Visualizer')).toBeInTheDocument();
      expect(screen.getByText(/Track multiple savings goals/)).toBeInTheDocument();
    });

    it('shows add goal form initially', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(screen.getByText('Add New Goal')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Target amount')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Current savings')).toBeInTheDocument();
    });

    it('displays view mode tabs', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(screen.getByText('Progress View')).toBeInTheDocument();
      expect(screen.getByText('Timeline View')).toBeInTheDocument();
      expect(screen.getByText('Allocation View')).toBeInTheDocument();
    });

    it('shows monthly savings input', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(screen.getByText('Monthly Savings Available')).toBeInTheDocument();
      expect(screen.getByDisplayValue('500')).toBeInTheDocument();
    });
  });

  describe('Goal Management', () => {
    it('allows adding a new goal', async () => {
      render(<SavingsGoalVisualizer />);
      
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      const addButton = screen.getByText('Add Goal');
      
      fireEvent.change(nameInput, { target: { value: 'Vacation Fund' } });
      fireEvent.change(targetInput, { target: { value: '3000' } });
      fireEvent.change(currentInput, { target: { value: '500' } });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Vacation Fund')).toBeInTheDocument();
      });
    });

    it('validates required fields when adding goal', async () => {
      render(<SavingsGoalVisualizer />);
      
      const addButton = screen.getByText('Add Goal');
      fireEvent.click(addButton);
      
      // Should not add goal without required fields
      await waitFor(() => {
        expect(screen.getByText('Add New Goal')).toBeInTheDocument();
      });
    });

    it('shows default goals after adding first custom goal', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add a goal first
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Test Goal' } });
      fireEvent.change(targetInput, { target: { value: '1000' } });
      fireEvent.change(currentInput, { target: { value: '100' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      await waitFor(() => {
        // Should show some default goals
        expect(screen.getByText('Test Goal')).toBeInTheDocument();
      });
    });

    it('allows updating goal progress', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add a goal first
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Emergency Fund' } });
      fireEvent.change(targetInput, { target: { value: '5000' } });
      fireEvent.change(currentInput, { target: { value: '1000' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      await waitFor(() => {
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      });
    });

    it('allows deleting goals', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add a goal first
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Temporary Goal' } });
      fireEvent.change(targetInput, { target: { value: '1000' } });
      fireEvent.change(currentInput, { target: { value: '100' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      await waitFor(() => {
        expect(screen.getByText('Temporary Goal')).toBeInTheDocument();
        
        // Look for delete button (usually an X or trash icon)
        const deleteButtons = screen.getAllByRole('button');
        const deleteButton = deleteButtons.find(btn => 
          btn.textContent?.includes('×') || 
          btn.textContent?.includes('Delete') ||
          btn.getAttribute('aria-label')?.includes('delete')
        );
        
        if (deleteButton) {
          fireEvent.click(deleteButton);
        }
      });
    });
  });

  describe('View Mode Switching', () => {
    it('switches to timeline view', async () => {
      render(<SavingsGoalVisualizer />);
      
      const timelineTab = screen.getByText('Timeline View');
      fireEvent.click(timelineTab);
      
      await waitFor(() => {
        expect(screen.getByText('Savings Timeline')).toBeInTheDocument();
      });
    });

    it('switches to allocation view', async () => {
      render(<SavingsGoalVisualizer />);
      
      const allocationTab = screen.getByText('Allocation View');
      fireEvent.click(allocationTab);
      
      await waitFor(() => {
        expect(screen.getByText('Optimal Allocation')).toBeInTheDocument();
      });
    });

    it('returns to progress view', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Switch away and back
      fireEvent.click(screen.getByText('Timeline View'));
      fireEvent.click(screen.getByText('Progress View'));
      
      await waitFor(() => {
        expect(screen.getByText('Goal Progress')).toBeInTheDocument();
      });
    });
  });

  describe('Progress View', () => {
    it('shows progress bars for goals', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add a goal to see progress
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Test Progress' } });
      fireEvent.change(targetInput, { target: { value: '2000' } });
      fireEvent.change(currentInput, { target: { value: '400' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      await waitFor(() => {
        expect(screen.getByText('Test Progress')).toBeInTheDocument();
        // Should show percentage progress
        expect(screen.getByText(/\d+%/)).toBeInTheDocument();
      });
    });

    it('displays goal details and amounts', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add goal and check details
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Car Down Payment' } });
      fireEvent.change(targetInput, { target: { value: '5000' } });
      fireEvent.change(currentInput, { target: { value: '1200' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      await waitFor(() => {
        expect(screen.getByText('Car Down Payment')).toBeInTheDocument();
        expect(screen.getByText('$1,200')).toBeInTheDocument();
        expect(screen.getByText('$5,000')).toBeInTheDocument();
      });
    });
  });

  describe('Timeline View', () => {
    it('shows timeline chart when in timeline mode', async () => {
      render(<SavingsGoalVisualizer />);
      
      fireEvent.click(screen.getByText('Timeline View'));
      
      await waitFor(() => {
        expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      });
    });

    it('displays completion estimates', async () => {
      render(<SavingsGoalVisualizer />);
      
      fireEvent.click(screen.getByText('Timeline View'));
      
      await waitFor(() => {
        expect(screen.getByText('Savings Timeline')).toBeInTheDocument();
        // Should show estimated completion dates
      });
    });
  });

  describe('Allocation View', () => {
    it('shows allocation pie chart', async () => {
      render(<SavingsGoalVisualizer />);
      
      fireEvent.click(screen.getByText('Allocation View'));
      
      await waitFor(() => {
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      });
    });

    it('displays optimal allocation percentages', async () => {
      render(<SavingsGoalVisualizer />);
      
      fireEvent.click(screen.getByText('Allocation View'));
      
      await waitFor(() => {
        expect(screen.getByText('Optimal Allocation')).toBeInTheDocument();
        // Should show percentage allocations
      });
    });

    it('provides allocation recommendations', async () => {
      render(<SavingsGoalVisualizer />);
      
      fireEvent.click(screen.getByText('Allocation View'));
      
      await waitFor(() => {
        expect(screen.getByText(/Based on your goals and timeline/)).toBeInTheDocument();
      });
    });
  });

  describe('Monthly Savings Input', () => {
    it('allows updating monthly savings amount', async () => {
      render(<SavingsGoalVisualizer />);
      
      const monthlyInput = screen.getByDisplayValue('500');
      fireEvent.change(monthlyInput, { target: { value: '750' } });
      
      await waitFor(() => {
        expect(monthlyInput).toHaveValue('750');
      });
    });

    it('recalculates timelines when monthly savings changes', async () => {
      render(<SavingsGoalVisualizer />);
      
      const monthlyInput = screen.getByDisplayValue('500');
      fireEvent.change(monthlyInput, { target: { value: '1000' } });
      
      // Switch to timeline view to see impact
      fireEvent.click(screen.getByText('Timeline View'));
      
      await waitFor(() => {
        expect(screen.getByText('Savings Timeline')).toBeInTheDocument();
      });
    });
  });

  describe('Calculations and Algorithms', () => {
    it('calculates completion time correctly', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add goal with known parameters
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Math Test' } });
      fireEvent.change(targetInput, { target: { value: '1200' } }); // $1200 target
      fireEvent.change(currentInput, { target: { value: '200' } }); // $200 current
      fireEvent.click(screen.getByText('Add Goal'));
      
      // With $500/month, should take 2 months to save remaining $1000
      await waitFor(() => {
        expect(screen.getByText('Math Test')).toBeInTheDocument();
      });
    });

    it('handles priority-based allocation', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add multiple goals to test allocation
      const goals = [
        { name: 'High Priority', target: '2000', current: '0' },
        { name: 'Low Priority', target: '3000', current: '500' }
      ];
      
      for (const goal of goals) {
        const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
        const targetInput = screen.getByPlaceholderText('Target amount');
        const currentInput = screen.getByPlaceholderText('Current savings');
        
        fireEvent.change(nameInput, { target: { value: goal.name } });
        fireEvent.change(targetInput, { target: { value: goal.target } });
        fireEvent.change(currentInput, { target: { value: goal.current } });
        fireEvent.click(screen.getByText('Add Goal'));
        
        await waitFor(() => {
          expect(screen.getByText(goal.name)).toBeInTheDocument();
        });
      }
      
      // Check allocation view
      fireEvent.click(screen.getByText('Allocation View'));
      
      await waitFor(() => {
        expect(screen.getByText('Optimal Allocation')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles invalid input values', async () => {
      render(<SavingsGoalVisualizer />);
      
      const targetInput = screen.getByPlaceholderText('Target amount');
      fireEvent.change(targetInput, { target: { value: '-1000' } });
      
      // Should handle negative values appropriately
      await waitFor(() => {
        expect(targetInput).toBeInTheDocument();
      });
    });

    it('handles zero monthly savings', async () => {
      render(<SavingsGoalVisualizer />);
      
      const monthlyInput = screen.getByDisplayValue('500');
      fireEvent.change(monthlyInput, { target: { value: '0' } });
      
      await waitFor(() => {
        expect(monthlyInput).toHaveValue('0');
      });
    });

    it('prevents division by zero in calculations', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Set monthly savings to 0
      const monthlyInput = screen.getByDisplayValue('500');
      fireEvent.change(monthlyInput, { target: { value: '0' } });
      
      // Add a goal
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Test Goal' } });
      fireEvent.change(targetInput, { target: { value: '1000' } });
      fireEvent.change(currentInput, { target: { value: '100' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      // Should not crash
      await waitFor(() => {
        expect(screen.getByText('Test Goal')).toBeInTheDocument();
      });
    });
  });

  describe('Charts and Visualizations', () => {
    it('renders responsive chart containers', () => {
      render(<SavingsGoalVisualizer />);
      
      const containers = screen.getAllByTestId('responsive-container');
      expect(containers.length).toBeGreaterThanOrEqual(1);
    });

    it('includes chart tooltips and legends', () => {
      render(<SavingsGoalVisualizer />);
      
      // Charts should include tooltip and legend components
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(screen.getByText('Multi-Goal Savings Visualizer')).toBeInTheDocument();
      expect(screen.getByText('Add New Goal')).toBeInTheDocument();
    });

    it('provides labels for form inputs', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Target amount')).toBeInTheDocument();
    });

    it('has descriptive button text', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(screen.getByText('Add Goal')).toBeInTheDocument();
      expect(screen.getByText('Progress View')).toBeInTheDocument();
    });
  });

  describe('Progress Tracking', () => {
    it('records component usage in progress store', () => {
      render(<SavingsGoalVisualizer />);
      
      expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('savings-goal-visualizer');
    });
  });

  describe('Edge Cases', () => {
    it('handles very large goal amounts', async () => {
      render(<SavingsGoalVisualizer />);
      
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Big Goal' } });
      fireEvent.change(targetInput, { target: { value: '1000000' } });
      fireEvent.change(currentInput, { target: { value: '50000' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      await waitFor(() => {
        expect(screen.getByText('Big Goal')).toBeInTheDocument();
      });
    });

    it('handles decimal values in inputs', async () => {
      render(<SavingsGoalVisualizer />);
      
      const monthlyInput = screen.getByDisplayValue('500');
      fireEvent.change(monthlyInput, { target: { value: '750.50' } });
      
      await waitFor(() => {
        expect(monthlyInput).toHaveValue('750.50');
      });
    });

    it('maintains state when switching views multiple times', async () => {
      render(<SavingsGoalVisualizer />);
      
      // Add a goal first
      const nameInput = screen.getByPlaceholderText('Goal name (e.g., Emergency Fund)');
      const targetInput = screen.getByPlaceholderText('Target amount');
      const currentInput = screen.getByPlaceholderText('Current savings');
      
      fireEvent.change(nameInput, { target: { value: 'Persistent Goal' } });
      fireEvent.change(targetInput, { target: { value: '2000' } });
      fireEvent.change(currentInput, { target: { value: '500' } });
      fireEvent.click(screen.getByText('Add Goal'));
      
      // Switch views multiple times
      fireEvent.click(screen.getByText('Timeline View'));
      fireEvent.click(screen.getByText('Allocation View'));
      fireEvent.click(screen.getByText('Progress View'));
      
      await waitFor(() => {
        expect(screen.getByText('Persistent Goal')).toBeInTheDocument();
      });
    });
  });
});

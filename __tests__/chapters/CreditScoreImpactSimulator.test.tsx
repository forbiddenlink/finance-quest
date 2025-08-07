import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreditScoreImpactSimulator from '@/components/chapters/fundamentals/lessons/CreditScoreImpactSimulator';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore');
const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock decimal.js
jest.mock('decimal.js', () => {
  return jest.fn().mockImplementation((value) => ({
    mul: jest.fn().mockReturnThis(),
    div: jest.fn().mockReturnThis(),
    minus: jest.fn().mockReturnThis(),
    pow: jest.fn().mockReturnThis(),
    toNumber: jest.fn(() => parseFloat(value) || 0)
  }));
});

describe('CreditScoreImpactSimulator', () => {
  const mockRecordCalculatorUsage = jest.fn();
  const mockRecordSimulationResult = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProgressStore.mockReturnValue({
      recordCalculatorUsage: mockRecordCalculatorUsage,
      recordSimulationResult: mockRecordSimulationResult,
      userProgress: {},
      isChapterUnlocked: jest.fn(() => true),
      completeLesson: jest.fn(),
      recordQuizScore: jest.fn(),
      initializeChapter: jest.fn(),
      addGamificationPoints: jest.fn(),
      updateUserMetrics: jest.fn(),
      unlockAchievement: jest.fn(),
      updateLearningPath: jest.fn(),
      recordStudySession: jest.fn(),
      resetProgress: jest.fn(),
      exportProgress: jest.fn(),
      importProgress: jest.fn()
    } as any);
  });

  it('renders without crashing', () => {
    render(<CreditScoreImpactSimulator />);
    expect(screen.getByText('Credit Score Impact Simulator')).toBeInTheDocument();
  });

  it('records calculator usage on mount', () => {
    render(<CreditScoreImpactSimulator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('credit-score-impact-simulator');
  });

  it('displays the simulator title and description', () => {
    render(<CreditScoreImpactSimulator />);
    expect(screen.getByText('Credit Score Impact Simulator')).toBeInTheDocument();
    expect(screen.getByText('See how credit decisions affect your score and financial future')).toBeInTheDocument();
  });

  it('shows current credit profile section', () => {
    render(<CreditScoreImpactSimulator />);
    expect(screen.getByText('Your Current Credit Profile')).toBeInTheDocument();
    expect(screen.getByText('Current Credit Score')).toBeInTheDocument();
    expect(screen.getByText('Mortgage Amount')).toBeInTheDocument();
  });

  it('allows credit score adjustment via range slider', () => {
    render(<CreditScoreImpactSimulator />);
    const slider = screen.getByLabelText('Current Credit Score');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '300');
    expect(slider).toHaveAttribute('max', '850');
  });

  it('updates credit score when slider is moved', () => {
    render(<CreditScoreImpactSimulator />);
    const slider = screen.getByLabelText('Current Credit Score');
    
    fireEvent.change(slider, { target: { value: '750' } });
    expect(screen.getByText('750 (Very Good)')).toBeInTheDocument();
  });

  it('allows mortgage amount input', () => {
    render(<CreditScoreImpactSimulator />);
    const mortgageInput = screen.getByPlaceholderText('350000');
    expect(mortgageInput).toBeInTheDocument();
    
    fireEvent.change(mortgageInput, { target: { value: '400000' } });
    expect(mortgageInput).toHaveValue(400000);
  });

  it('displays all credit scenarios', () => {
    render(<CreditScoreImpactSimulator />);
    
    expect(screen.getByText('Late Payment (30 days)')).toBeInTheDocument();
    expect(screen.getByText('Max Out Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Open New Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Pay Down Credit Cards')).toBeInTheDocument();
    expect(screen.getByText('Debt Consolidation')).toBeInTheDocument();
    expect(screen.getByText('Close Old Credit Card')).toBeInTheDocument();
  });

  it('allows scenario selection by clicking', () => {
    render(<CreditScoreImpactSimulator />);
    const latePaymentScenario = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    
    expect(latePaymentScenario).not.toHaveClass('border-blue-500');
    fireEvent.click(latePaymentScenario!);
    expect(latePaymentScenario).toHaveClass('border-blue-500');
  });

  it('toggles scenarios on multiple clicks', () => {
    render(<CreditScoreImpactSimulator />);
    const scenario = screen.getByText('Pay Down Credit Cards').closest('[class*="cursor-pointer"]');
    
    // First click - select
    fireEvent.click(scenario!);
    expect(scenario).toHaveClass('border-blue-500');
    
    // Second click - deselect
    fireEvent.click(scenario!);
    expect(scenario).not.toHaveClass('border-blue-500');
  });

  it('shows positive and negative scenario impacts correctly', () => {
    render(<CreditScoreImpactSimulator />);
    
    // Positive scenario
    expect(screen.getByText('+85 points')).toBeInTheDocument();
    
    // Negative scenarios
    expect(screen.getByText('-60 points')).toBeInTheDocument();
    expect(screen.getByText('-45 points')).toBeInTheDocument();
  });

  it('disables simulation button when no scenarios selected', () => {
    render(<CreditScoreImpactSimulator />);
    const runButton = screen.getByText('Run Simulation');
    expect(runButton).toBeDisabled();
  });

  it('enables simulation button when scenarios are selected', () => {
    render(<CreditScoreImpactSimulator />);
    const scenario = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    const runButton = screen.getByText('Run Simulation');
    
    fireEvent.click(scenario!);
    expect(runButton).not.toBeDisabled();
  });

  it('runs simulation and shows results', async () => {
    render(<CreditScoreImpactSimulator />);
    
    // Select a scenario
    const scenario = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    fireEvent.click(scenario!);
    
    // Run simulation
    const runButton = screen.getByText('Run Simulation');
    fireEvent.click(runButton);
    
    // Should show loading state
    expect(screen.getByText('Simulating...')).toBeInTheDocument();
    
    // Wait for simulation to complete
    await waitFor(() => {
      expect(screen.getByText('Credit Score Impact Analysis')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows reset button after simulation', async () => {
    render(<CreditScoreImpactSimulator />);
    
    // Select scenario and run simulation
    const scenario = screen.getByText('Pay Down Credit Cards').closest('[class*="cursor-pointer"]');
    fireEvent.click(scenario!);
    fireEvent.click(screen.getByText('Run Simulation'));
    
    // Wait for simulation to complete
    await waitFor(() => {
      expect(screen.queryByText('Simulating...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Should show reset button after simulation completes
    await waitFor(() => {
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  it('records simulation result after completion', async () => {
    render(<CreditScoreImpactSimulator />);
    
    // Select scenario and run simulation
    const scenario = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    fireEvent.click(scenario!);
    fireEvent.click(screen.getByText('Run Simulation'));
    
    // Wait for simulation to complete and results to appear
    await waitFor(() => {
      expect(screen.getByText('Credit Score Impact Analysis')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Now check that simulation result was recorded
    await waitFor(() => {
      expect(mockRecordSimulationResult).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('displays educational tips section', () => {
    render(<CreditScoreImpactSimulator />);
    
    expect(screen.getByText('Credit Score Optimization Tips')).toBeInTheDocument();
    expect(screen.getByText('Quick Wins (1-3 months):')).toBeInTheDocument();
    expect(screen.getByText('Long-term Strategy:')).toBeInTheDocument();
  });

  it('shows mortgage rate impact information', async () => {
    render(<CreditScoreImpactSimulator />);
    
    // First run a simulation to show the mortgage rate impact section
    const scenario = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    fireEvent.click(scenario!);
    fireEvent.click(screen.getByText('Run Simulation'));
    
    // Wait for simulation results to appear
    await waitFor(() => {
      expect(screen.getByText('Credit Score Impact Analysis')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Now check for mortgage rate information in the results section
    expect(screen.getByText('Mortgage Rate Impact')).toBeInTheDocument();
    expect(screen.getByText('760+:')).toBeInTheDocument();
    expect(screen.getByText('<620:')).toBeInTheDocument();
    expect(screen.getByText('6.8%')).toBeInTheDocument();
    expect(screen.getByText('9.8%')).toBeInTheDocument();
  });

  it('resets simulation when reset button is clicked', async () => {
    render(<CreditScoreImpactSimulator />);
    
    // Run a simulation first
    const scenario = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    fireEvent.click(scenario!);
    fireEvent.click(screen.getByText('Run Simulation'));
    
    // Wait for simulation to complete
    await waitFor(() => {
      expect(screen.queryByText('Simulating...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    await waitFor(() => {
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
    
    // Click reset
    fireEvent.click(screen.getByText('Reset'));
    
    // Should no longer show results or reset button
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('shows appropriate score grades for different credit ranges', () => {
    render(<CreditScoreImpactSimulator />);
    const slider = screen.getByLabelText('Current Credit Score');
    
    // Test excellent credit
    fireEvent.change(slider, { target: { value: '800' } });
    expect(screen.getByText('800 (Excellent)')).toBeInTheDocument();
    
    // Test good credit
    fireEvent.change(slider, { target: { value: '700' } });
    expect(screen.getByText('700 (Good)')).toBeInTheDocument();
    
    // Test fair credit
    fireEvent.change(slider, { target: { value: '600' } });
    expect(screen.getByText('600 (Fair)')).toBeInTheDocument();
    
    // Test poor credit
    fireEvent.change(slider, { target: { value: '500' } });
    expect(screen.getByText('500 (Poor)')).toBeInTheDocument();
  });

  it('displays scenario severity indicators correctly', () => {
    render(<CreditScoreImpactSimulator />);
    
    // Check that scenarios have appropriate severity styling by checking for colors in score impacts
    expect(screen.getByText('+85 points')).toHaveClass('text-emerald-400');
    expect(screen.getByText('-60 points')).toHaveClass('text-red-400');
  });

  it('handles multiple scenario selection correctly', () => {
    render(<CreditScoreImpactSimulator />);
    
    // Select multiple scenarios
    const scenario1 = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    const scenario2 = screen.getByText('Max Out Credit Card').closest('[class*="cursor-pointer"]');
    
    fireEvent.click(scenario1!);
    fireEvent.click(scenario2!);
    
    expect(scenario1).toHaveClass('border-blue-500');
    expect(scenario2).toHaveClass('border-blue-500');
    
    // Run simulation should work with multiple scenarios
    const runButton = screen.getByText('Run Simulation');
    expect(runButton).not.toBeDisabled();
  });

  it('shows loading state during simulation', () => {
    render(<CreditScoreImpactSimulator />);
    
    const scenario = screen.getByText('Late Payment (30 days)').closest('[class*="cursor-pointer"]');
    fireEvent.click(scenario!);
    
    const runButton = screen.getByText('Run Simulation');
    fireEvent.click(runButton);
    
    expect(screen.getByText('Simulating...')).toBeInTheDocument();
    expect(runButton).toBeDisabled();
  });

  it('displays recovery timeline information', () => {
    render(<CreditScoreImpactSimulator />);
    
    expect(screen.getByText('12-24 months')).toBeInTheDocument();
    expect(screen.getAllByText('3-6 months')).toHaveLength(2); // Two scenarios have same timeline
    expect(screen.getByText('1-2 months')).toBeInTheDocument();
  });

  it('handles edge cases for credit scores', () => {
    render(<CreditScoreImpactSimulator />);
    const slider = screen.getByLabelText('Current Credit Score');
    
    // Test minimum score
    fireEvent.change(slider, { target: { value: '300' } });
    expect(screen.getByText('300 (Poor)')).toBeInTheDocument();
    
    // Test maximum score
    fireEvent.change(slider, { target: { value: '850' } });
    expect(screen.getByText('850 (Excellent)')).toBeInTheDocument();
  });

  it('validates mortgage amount input', () => {
    render(<CreditScoreImpactSimulator />);
    const mortgageInput = screen.getByPlaceholderText('350000');
    
    // Test invalid input
    fireEvent.change(mortgageInput, { target: { value: 'invalid' } });
    expect(mortgageInput).toHaveValue(350000); // Should fallback to default
    
    // Test valid input
    fireEvent.change(mortgageInput, { target: { value: '500000' } });
    expect(mortgageInput).toHaveValue(500000);
  });

  it('displays key insights in educational content', () => {
    render(<CreditScoreImpactSimulator />);
    
    expect(screen.getByText('Credit Score Optimization Tips')).toBeInTheDocument();
    expect(screen.getByText('Quick Wins (1-3 months):')).toBeInTheDocument();
    expect(screen.getByText('Long-term Strategy:')).toBeInTheDocument();
    expect(screen.getByText(/Pay down credit card balances below 30%/)).toBeInTheDocument();
    expect(screen.getByText(/Never miss payments \(set up autopay\)/)).toBeInTheDocument();
  });
});

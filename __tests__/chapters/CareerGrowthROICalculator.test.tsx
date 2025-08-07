import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CareerGrowthROICalculator from '@/components/chapters/fundamentals/lessons/CareerGrowthROICalculator';
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

describe('CareerGrowthROICalculator', () => {
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
    render(<CareerGrowthROICalculator />);
    expect(screen.getByText('Career Growth ROI Calculator')).toBeInTheDocument();
  });

  it('records calculator usage on mount', () => {
    render(<CareerGrowthROICalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('career-growth-roi-calculator');
  });

  it('displays the calculator title and description', () => {
    render(<CareerGrowthROICalculator />);
    expect(screen.getByText('Career Growth ROI Calculator')).toBeInTheDocument();
    expect(screen.getByText('Compare career paths and calculate lifetime earning potential')).toBeInTheDocument();
  });

  it('shows current situation section', () => {
    render(<CareerGrowthROICalculator />);
    expect(screen.getByText('Your Current Situation')).toBeInTheDocument();
    expect(screen.getByText('Current Annual Salary')).toBeInTheDocument();
    expect(screen.getByText('Current Annual Raise (%)')).toBeInTheDocument();
  });

  it('allows salary input adjustment', () => {
    render(<CareerGrowthROICalculator />);
    const salaryInput = screen.getByPlaceholderText('75000');
    expect(salaryInput).toBeInTheDocument();
    
    fireEvent.change(salaryInput, { target: { value: '85000' } });
    expect(salaryInput).toHaveValue(85000);
  });

  it('allows annual raise percentage adjustment via slider', () => {
    render(<CareerGrowthROICalculator />);
    const slider = screen.getByLabelText('Current Annual Raise Percentage');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '10');
  });

  it('updates raise percentage when slider is moved', () => {
    render(<CareerGrowthROICalculator />);
    const slider = screen.getByLabelText('Current Annual Raise Percentage');
    
    fireEvent.change(slider, { target: { value: '7' } });
    expect(screen.getByText('7%')).toBeInTheDocument();
  });

  it('displays all career growth options', () => {
    render(<CareerGrowthROICalculator />);
    
    expect(screen.getByText('Strategic Job Change')).toBeInTheDocument();
    expect(screen.getByText('MBA Program')).toBeInTheDocument();
    expect(screen.getByText('Professional Certification')).toBeInTheDocument();
    expect(screen.getByText('Tech Bootcamp')).toBeInTheDocument();
    expect(screen.getByText('Internal Promotion Track')).toBeInTheDocument();
    expect(screen.getByText('Side Business Development')).toBeInTheDocument();
  });

  it('allows career option selection by clicking', () => {
    render(<CareerGrowthROICalculator />);
    const mbaOption = screen.getByText('MBA Program').closest('[class*="cursor-pointer"]');
    
    expect(mbaOption).not.toHaveClass('border-blue-500');
    fireEvent.click(mbaOption!);
    expect(mbaOption).toHaveClass('border-blue-500');
    expect(mbaOption).toHaveClass('bg-blue-500/10');
  });

  it('shows career option details', () => {
    render(<CareerGrowthROICalculator />);
    
    // Check that job change option shows correct details
    expect(screen.getByText('Switch to higher-paying role at different company')).toBeInTheDocument();
    expect(screen.getByText('Full-time MBA for management track')).toBeInTheDocument();
    expect(screen.getByText('Industry-specific certification (PMP, CPA, etc.)')).toBeInTheDocument();
  });

  it('displays risk levels for different options', () => {
    render(<CareerGrowthROICalculator />);
    
    // Should show different risk levels
    expect(screen.getAllByText('low')).toHaveLength(2); // Certification and Internal Promotion
    expect(screen.getAllByText('medium')).toHaveLength(2); // Job Change and Bootcamp
    expect(screen.getAllByText('high')).toHaveLength(2); // MBA and Side Business
  });

  it('shows quick preview with financial metrics', () => {
    render(<CareerGrowthROICalculator />);
    
    expect(screen.getByText('Quick Preview: Strategic Job Change')).toBeInTheDocument();
    expect(screen.getByText('Lifetime Gain')).toBeInTheDocument();
    expect(screen.getByText('ROI')).toBeInTheDocument();
    expect(screen.getByText('Break-even Years')).toBeInTheDocument();
    expect(screen.getByText('Annual Growth')).toBeInTheDocument();
  });

  it('updates quick preview when different option is selected', () => {
    render(<CareerGrowthROICalculator />);
    
    // Initially shows Strategic Job Change
    expect(screen.getByText('Quick Preview: Strategic Job Change')).toBeInTheDocument();
    
    // Select MBA option
    const mbaOption = screen.getByText('MBA Program').closest('[class*="cursor-pointer"]');
    fireEvent.click(mbaOption!);
    
    expect(screen.getByText('Quick Preview: MBA Program')).toBeInTheDocument();
  });

  it('has calculate button initially enabled', () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    expect(calculateButton).not.toBeDisabled();
  });

  it('shows loading state during calculation', () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    expect(screen.getByText('Calculating Career ROI...')).toBeInTheDocument();
    // The loading state shows a disabled button via styling, not HTML disabled attribute
    expect(screen.queryByText('Calculate Career Growth ROI')).not.toBeInTheDocument();
  });

  it('displays results after calculation', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Career Growth Analysis')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByText('Key Financial Outcomes')).toBeInTheDocument();
    expect(screen.getByText('15-Year Earnings Projection')).toBeInTheDocument();
  });

  it('shows key financial metrics in results', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Career Growth Analysis')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByText('Lifetime Earnings Gain')).toBeInTheDocument();
    expect(screen.getByText('Return on Investment')).toBeInTheDocument();
    expect(screen.getByText('Years to Break Even')).toBeInTheDocument();
    expect(screen.getByText('Total Investment')).toBeInTheDocument();
  });

  it('displays earnings projection chart', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('15-Year Earnings Projection')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('shows risk assessment in results', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // The default option is "Strategic Job Change" which has medium risk
    expect(screen.getByText('medium Risk Level')).toBeInTheDocument();
    expect(screen.getByText('Education Time Required:')).toBeInTheDocument();
    expect(screen.getByText('Expected Growth Rate:')).toBeInTheDocument();
  });

  it('provides recommendation based on ROI', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Recommendation')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Should show recommendation text - there are multiple elements with "investment"
    expect(screen.getAllByText(/investment/i)).toHaveLength(3);
  });

  it('displays action steps for selected career path', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Next Steps for Strategic Job Change')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    expect(screen.getByText('Immediate Actions (0-3 months):')).toBeInTheDocument();
    expect(screen.getByText('Medium-term Planning (3-12 months):')).toBeInTheDocument();
  });

  it('records simulation result after calculation', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(mockRecordSimulationResult).toHaveBeenCalled();
    }, { timeout: 2000 });
    
    const callArgs = mockRecordSimulationResult.mock.calls[0][0];
    expect(callArgs.scenarioId).toBe('job_change');
    expect(callArgs.financialOutcome).toBeGreaterThan(0);
    expect(callArgs.strengths).toContain('Career ROI Analysis');
  });

  it('shows reset button after results', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Compare Another Path')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('resets calculator when reset button is clicked', async () => {
    render(<CareerGrowthROICalculator />);
    const calculateButton = screen.getByText('Calculate Career Growth ROI');
    
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Compare Another Path')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    const resetButton = screen.getByText('Compare Another Path');
    fireEvent.click(resetButton);
    
    // Should return to initial state
    expect(screen.getByText('Calculate Career Growth ROI')).toBeInTheDocument();
    expect(screen.queryByText('Career Growth Analysis')).not.toBeInTheDocument();
  });

  it('handles high-risk MBA option correctly', () => {
    render(<CareerGrowthROICalculator />);
    
    // Select MBA option
    const mbaOption = screen.getByText('MBA Program').closest('[class*="cursor-pointer"]');
    fireEvent.click(mbaOption!);
    
    expect(screen.getByText('Quick Preview: MBA Program')).toBeInTheDocument();
    // MBA should show high investment and high ROI potential
    expect(screen.getByText('$150,000')).toBeInTheDocument(); // Investment cost
  });

  it('calculates different metrics for different career paths', () => {
    render(<CareerGrowthROICalculator />);
    
    // Select low-risk certification option
    const certOption = screen.getByText('Professional Certification').closest('[class*="cursor-pointer"]');
    fireEvent.click(certOption!);
    
    expect(screen.getByText('Quick Preview: Professional Certification')).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument(); // Lower investment cost
  });

  it('validates salary input edge cases', () => {
    render(<CareerGrowthROICalculator />);
    const salaryInput = screen.getByPlaceholderText('75000');
    
    // Test invalid input
    fireEvent.change(salaryInput, { target: { value: 'invalid' } });
    expect(salaryInput).toHaveValue(0);
    
    // Test valid input
    fireEvent.change(salaryInput, { target: { value: '100000' } });
    expect(salaryInput).toHaveValue(100000);
  });

  it('shows appropriate currency formatting', () => {
    render(<CareerGrowthROICalculator />);
    
    // Should show currency formatted values - use getAllByText to handle multiple matches
    const currencyElements = screen.getAllByText(/\$\d/);
    expect(currencyElements.length).toBeGreaterThan(0);
  });

  it('displays education time requirements for each option', () => {
    render(<CareerGrowthROICalculator />);
    
    // Check different time requirements - these are shown in the career option cards
    expect(screen.getByText('0.5 years')).toBeInTheDocument(); // Job change timeToPromote
    expect(screen.getAllByText('2 years')).toHaveLength(2); // MBA timeToPromote (appears twice)
    expect(screen.getByText('1 years')).toBeInTheDocument(); // Certification timeToPromote
  });

  it('shows salary increase calculations', () => {
    render(<CareerGrowthROICalculator />);
    
    // Should show salary increases for each option
    expect(screen.getByText('+$20,000')).toBeInTheDocument(); // Job change increase
  });

  it('handles side business option with variable income', () => {
    render(<CareerGrowthROICalculator />);
    
    // Select side business option
    const sideBusinessOption = screen.getByText('Side Business Development').closest('[class*="cursor-pointer"]');
    fireEvent.click(sideBusinessOption!);
    
    expect(screen.getByText('Quick Preview: Side Business Development')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument(); // Higher growth rate but riskier
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BRRRRStrategyCalculator from '@/components/chapters/fundamentals/calculators/BRRRRStrategyCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(),
}));

const mockRecordCalculatorUsage = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  
  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    recordCalculatorUsage: mockRecordCalculatorUsage,
  });
});

describe('BRRRRStrategyCalculator', () => {
  test('renders the BRRRR calculator', () => {
    render(<BRRRRStrategyCalculator />);
    expect(screen.getByText(/BRRRR Strategy Calculator/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<BRRRRStrategyCalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('brrrr-strategy-calculator');
  });

  test('displays BRRRR methodology explanation', () => {
    render(<BRRRRStrategyCalculator />);
    
    expect(screen.getByText(/Buy/i)).toBeInTheDocument();
    expect(screen.getByText(/Rehab/i)).toBeInTheDocument();
    expect(screen.getByText(/Rent/i)).toBeInTheDocument();
    expect(screen.getByText(/Refinance/i)).toBeInTheDocument();
    expect(screen.getByText(/Repeat/i)).toBeInTheDocument();
  });

  test('shows input fields for each BRRRR phase', () => {
    render(<BRRRRStrategyCalculator />);
    
    // Buy phase
    expect(screen.getByLabelText(/Purchase Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Initial Down Payment/i)).toBeInTheDocument();
    
    // Rehab phase
    expect(screen.getByLabelText(/Rehab Costs/i)).toBeInTheDocument();
    
    // Rent phase
    expect(screen.getByLabelText(/Monthly Rent/i)).toBeInTheDocument();
    
    // Refinance phase
    expect(screen.getByLabelText(/After Repair Value/i)).toBeInTheDocument();
  });

  test('calculates BRRRR strategy returns', async () => {
    render(<BRRRRStrategyCalculator />);
    
    // Input BRRRR scenario
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '180000' }
    });
    fireEvent.change(screen.getByLabelText(/Initial Down Payment/i), {
      target: { value: '36000' }
    });
    fireEvent.change(screen.getByLabelText(/Rehab Costs/i), {
      target: { value: '30000' }
    });
    fireEvent.change(screen.getByLabelText(/After Repair Value/i), {
      target: { value: '280000' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2400' }
    });
    
    const calculateButton = screen.getByText(/Calculate BRRRR/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Capital Invested/i)).toBeInTheDocument();
      expect(screen.getByText(/Capital Recovered/i)).toBeInTheDocument();
      expect(screen.getByText(/Net Capital Left/i)).toBeInTheDocument();
    });
  });

  test('shows refinance analysis', async () => {
    render(<BRRRRStrategyCalculator />);
    
    // Input refinance scenario
    fireEvent.change(screen.getByLabelText(/After Repair Value/i), {
      target: { value: '300000' }
    });
    fireEvent.change(screen.getByLabelText(/Refinance LTV/i), {
      target: { value: '75' }
    });
    fireEvent.change(screen.getByLabelText(/Refinance Rate/i), {
      target: { value: '6.25' }
    });
    
    const calculateButton = screen.getByText(/Calculate BRRRR/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/New Loan Amount/i)).toBeInTheDocument();
      expect(screen.getByText(/Cash Out/i)).toBeInTheDocument();
      expect(screen.getByText(/New Monthly Payment/i)).toBeInTheDocument();
    });
  });

  test('calculates infinite return scenario', async () => {
    render(<BRRRRStrategyCalculator />);
    
    // Perfect BRRRR scenario - all money recovered
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '150000' }
    });
    fireEvent.change(screen.getByLabelText(/Initial Down Payment/i), {
      target: { value: '30000' }
    });
    fireEvent.change(screen.getByLabelText(/Rehab Costs/i), {
      target: { value: '25000' }
    });
    fireEvent.change(screen.getByLabelText(/After Repair Value/i), {
      target: { value: '250000' }
    });
    fireEvent.change(screen.getByLabelText(/Refinance LTV/i), {
      target: { value: '80' }
    });
    
    const calculateButton = screen.getByText(/Calculate BRRRR/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Infinite Return/i)).toBeInTheDocument();
      expect(screen.getByText(/All Capital Recovered/i)).toBeInTheDocument();
    });
  });

  test('shows cash flow after refinance', async () => {
    render(<BRRRRStrategyCalculator />);
    
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2200' }
    });
    fireEvent.change(screen.getByLabelText(/Property Tax/i), {
      target: { value: '250' }
    });
    fireEvent.change(screen.getByLabelText(/Insurance/i), {
      target: { value: '125' }
    });
    fireEvent.change(screen.getByLabelText(/Maintenance/i), {
      target: { value: '150' }
    });
    
    const calculateButton = screen.getByText(/Calculate BRRRR/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Net Monthly Cash Flow/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Cash Flow/i)).toBeInTheDocument();
    });
  });

  test('displays strategy benefits', async () => {
    render(<BRRRRStrategyCalculator />);
    
    const calculateButton = screen.getByText(/Calculate BRRRR/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Strategy Benefits/i)).toBeInTheDocument();
      expect(screen.getByText(/Forced Appreciation/i)).toBeInTheDocument();
      expect(screen.getByText(/Capital Recycling/i)).toBeInTheDocument();
    });
  });

  test('validates input values', async () => {
    render(<BRRRRStrategyCalculator />);
    
    // Test invalid after repair value
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '200000' }
    });
    fireEvent.change(screen.getByLabelText(/After Repair Value/i), {
      target: { value: '150000' }
    });
    
    const calculateButton = screen.getByText(/Calculate BRRRR/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/After repair value should be higher/i)).toBeInTheDocument();
    });
  });

  test('shows comparison to traditional investment', async () => {
    render(<BRRRRStrategyCalculator />);
    
    // Complete BRRRR calculation
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '180000' }
    });
    fireEvent.change(screen.getByLabelText(/Initial Down Payment/i), {
      target: { value: '36000' }
    });
    fireEvent.change(screen.getByLabelText(/Rehab Costs/i), {
      target: { value: '20000' }
    });
    fireEvent.change(screen.getByLabelText(/After Repair Value/i), {
      target: { value: '260000' }
    });
    
    const calculateButton = screen.getByText(/Calculate BRRRR/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/vs Traditional Purchase/i)).toBeInTheDocument();
      expect(screen.getByText(/Capital Efficiency/i)).toBeInTheDocument();
    });
  });

  test('displays risk considerations', () => {
    render(<BRRRRStrategyCalculator />);
    
    expect(screen.getByText(/Risk Considerations/i)).toBeInTheDocument();
    expect(screen.getByText(/Rehab overruns/i)).toBeInTheDocument();
    expect(screen.getByText(/Appraisal risk/i)).toBeInTheDocument();
  });

  test('shows step-by-step process', () => {
    render(<BRRRRStrategyCalculator />);
    
    expect(screen.getByText(/Step 1:/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 2:/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 3:/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 4:/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 5:/i)).toBeInTheDocument();
  });

  test('maintains accessibility standards', () => {
    render(<BRRRRStrategyCalculator />);
    
    // Check for proper form labels
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });
    
    // Check for headings
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
});

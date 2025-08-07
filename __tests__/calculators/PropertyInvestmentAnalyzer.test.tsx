import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyInvestmentAnalyzer from '@/components/chapters/fundamentals/calculators/PropertyInvestmentAnalyzer';

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

describe('PropertyInvestmentAnalyzer', () => {
  test('renders the calculator', () => {
    render(<PropertyInvestmentAnalyzer />);
    expect(screen.getByText(/Property Investment Analyzer/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<PropertyInvestmentAnalyzer />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('property-investment-analyzer');
  });

  test('displays input fields for property analysis', () => {
    render(<PropertyInvestmentAnalyzer />);
    
    expect(screen.getByLabelText(/Purchase Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Rent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Property Tax/i)).toBeInTheDocument();
  });

  test('calculates property investment metrics', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Input property values
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '300000' }
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: '60000' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2500' }
    });
    fireEvent.change(screen.getByLabelText(/Annual Property Tax/i), {
      target: { value: '3600' }
    });
    
    // Calculate button click
    const calculateButton = screen.getByText(/Calculate Investment/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      // Check for results
      expect(screen.getByText(/Cash Flow/i)).toBeInTheDocument();
      expect(screen.getByText(/Cap Rate/i)).toBeInTheDocument();
      expect(screen.getByText(/Cash-on-Cash Return/i)).toBeInTheDocument();
    });
  });

  test('validates input ranges', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Test negative values
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '-100000' }
    });
    
    const calculateButton = screen.getByText(/Calculate Investment/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter valid positive values/i)).toBeInTheDocument();
    });
  });

  test('displays educational context', () => {
    render(<PropertyInvestmentAnalyzer />);
    
    expect(screen.getByText(/What This Means/i)).toBeInTheDocument();
    expect(screen.getByText(/1% Rule/i)).toBeInTheDocument();
  });

  test('shows detailed results breakdown', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Input complete property data
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '250000' }
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: '50000' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2200' }
    });
    fireEvent.change(screen.getByLabelText(/Annual Property Tax/i), {
      target: { value: '3000' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Insurance/i), {
      target: { value: '150' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Maintenance/i), {
      target: { value: '200' }
    });
    
    const calculateButton = screen.getByText(/Calculate Investment/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Monthly Cash Flow/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Return/i)).toBeInTheDocument();
      expect(screen.getByText(/Total ROI/i)).toBeInTheDocument();
    });
  });

  test('provides investment recommendations', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Input high-return scenario
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '200000' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2500' }
    });
    
    const calculateButton = screen.getByText(/Calculate Investment/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Excellent Investment/i)).toBeInTheDocument();
    });
  });

  test('handles mortgage calculations correctly', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '300000' }
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: '60000' }
    });
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), {
      target: { value: '6.5' }
    });
    fireEvent.change(screen.getByLabelText(/Loan Term/i), {
      target: { value: '30' }
    });
    
    const calculateButton = screen.getByText(/Calculate Investment/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Monthly Mortgage Payment/i)).toBeInTheDocument();
      expect(screen.getByText(/Principal & Interest/i)).toBeInTheDocument();
    });
  });

  test('displays vacancy and maintenance considerations', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Input data and calculate
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '280000' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2400' }
    });
    fireEvent.change(screen.getByLabelText(/Vacancy Rate/i), {
      target: { value: '8' }
    });
    
    const calculateButton = screen.getByText(/Calculate Investment/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Adjusted for Vacancy/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Vacancy Cost/i)).toBeInTheDocument();
    });
  });

  test('shows appreciation scenarios', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '300000' }
    });
    fireEvent.change(screen.getByLabelText(/Annual Appreciation/i), {
      target: { value: '4' }
    });
    
    const calculateButton = screen.getByText(/Calculate Investment/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/5-Year Appreciation/i)).toBeInTheDocument();
      expect(screen.getByText(/10-Year Value/i)).toBeInTheDocument();
    });
  });

  test('maintains responsive design', () => {
    render(<PropertyInvestmentAnalyzer />);
    
    const container = screen.getByRole('main');
    expect(container).toHaveClass('grid');
  });

  test('provides accessibility features', () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Check for proper labels
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });
    
    // Check for headings
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});

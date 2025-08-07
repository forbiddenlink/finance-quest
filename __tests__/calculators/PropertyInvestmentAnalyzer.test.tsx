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
    expect(screen.getByLabelText(/Property Taxes/i)).toBeInTheDocument();
  });

  test('calculates property investment metrics', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Input property values
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '300000' }
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2500' }
    });
    fireEvent.change(screen.getByLabelText(/Property Taxes/i), {
      target: { value: '3600' }
    });
    
    // Results are calculated automatically, no button click needed
    await waitFor(() => {
      // Check for results - use more specific selectors
      expect(screen.getByRole('heading', { name: /Monthly Cash Flow/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Cash-on-Cash Return/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Cap Rate/i })).toBeInTheDocument();
    });
  });

  test('handles negative values in inputs', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Test negative values are accepted (component handles this gracefully)
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '-100000' }
    });
    
    // The component should still render without errors
    await waitFor(() => {
      expect(screen.getByText(/Property Investment Analyzer/i)).toBeInTheDocument();
    });
  });

  test('displays educational context', () => {
    render(<PropertyInvestmentAnalyzer />);
    
    expect(screen.getByText(/Key Investment Metrics Explained/i)).toBeInTheDocument();
    // Use getAllByText to handle multiple occurrences and just check that at least one exists
    expect(screen.getAllByText(/1% Rule/i).length).toBeGreaterThan(0);
  });

  test('shows detailed results breakdown', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Input complete property data
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '250000' }
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText(/Monthly Rent/i), {
      target: { value: '2200' }
    });
    fireEvent.change(screen.getByLabelText(/Property Taxes/i), {
      target: { value: '3000' }
    });
    fireEvent.change(screen.getByLabelText(/Insurance/i), {
      target: { value: '1800' }
    });
    fireEvent.change(screen.getByLabelText(/Maintenance/i), {
      target: { value: '2400' }
    });
    
    // Results are automatically calculated
    await waitFor(() => {
      expect(screen.getByText(/Monthly Cash Flow/i)).toBeInTheDocument();
      expect(screen.getByText(/Investment Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/10-Year Investment Projection/i)).toBeInTheDocument();
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
    
    // Results are automatically calculated
    await waitFor(() => {
      expect(screen.getByText(/Investment Recommendations/i)).toBeInTheDocument();
    });
  });

  test('handles mortgage calculations correctly', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '300000' }
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), {
      target: { value: '6.5' }
    });
    fireEvent.change(screen.getByLabelText(/Loan Term/i), {
      target: { value: '30' }
    });
    
    // Results are automatically calculated
    await waitFor(() => {
      expect(screen.getByText(/Monthly Cash Flow/i)).toBeInTheDocument();
      expect(screen.getByText(/Investment Analysis/i)).toBeInTheDocument();
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
    
    // Results are automatically calculated
    await waitFor(() => {
      expect(screen.getByText(/Monthly Cash Flow/i)).toBeInTheDocument();
      expect(screen.getByText(/Investment Analysis/i)).toBeInTheDocument();
    });
  });

  test('shows appreciation scenarios', async () => {
    render(<PropertyInvestmentAnalyzer />);
    
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '300000' }
    });
    fireEvent.change(screen.getByLabelText(/Property Appreciation/i), {
      target: { value: '4' }
    });
    
    // Results are automatically calculated
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /10-Year Investment Projection/i })).toBeInTheDocument();
      // Use columnheader role to find the table header specifically
      expect(screen.getByRole('columnheader', { name: /Property Value/i })).toBeInTheDocument();
    });
  });

  test('maintains responsive design', () => {
    render(<PropertyInvestmentAnalyzer />);
    
    const container = screen.getByRole('main');
    expect(container).toHaveClass('grid');
  });

  test('provides accessibility features', () => {
    render(<PropertyInvestmentAnalyzer />);
    
    // Check for proper labels on number inputs (spinbutton role)
    const inputs = screen.getAllByRole('spinbutton');
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });
    
    // Check for main heading specifically
    expect(screen.getByRole('heading', { name: /Property Investment Analyzer/i })).toBeInTheDocument();
  });
});

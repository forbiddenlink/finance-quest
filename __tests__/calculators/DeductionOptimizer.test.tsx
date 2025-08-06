import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeductionOptimizer from '@/components/chapters/fundamentals/calculators/DeductionOptimizer';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

describe('DeductionOptimizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the calculator with correct title and inputs', () => {
    render(<DeductionOptimizer />);
    
    expect(screen.getByText('Deduction Optimizer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('22')).toBeInTheDocument(); // Marginal Tax Rate
  });

  it('shows filing status dropdown', () => {
    render(<DeductionOptimizer />);
    
    const filingStatusSelect = screen.getByDisplayValue('Single');
    expect(filingStatusSelect).toBeInTheDocument();
    
    // Change filing status
    fireEvent.change(filingStatusSelect, { target: { value: 'marriedJoint' } });
    expect(screen.getByDisplayValue('Married Filing Jointly')).toBeInTheDocument();
  });

  it('calculates standard vs itemized deduction comparison', async () => {
    render(<DeductionOptimizer />);
    
    await waitFor(() => {
      expect(screen.getByText('Take Standard Deduction')).toBeInTheDocument();
      expect(screen.getByText('Deduction Comparison')).toBeInTheDocument();
    });
  });

  it('handles deduction input changes', async () => {
    render(<DeductionOptimizer />);
    
    // Find all number inputs with value "0" (there are multiple deduction inputs)
    const numberInputs = screen.getAllByDisplayValue('0').filter(input => 
      input.getAttribute('type') === 'number' && input.getAttribute('placeholder') === '0'
    );
    
    // Get the first deduction input (mortgage interest)
    const mortgageInput = numberInputs[0];
    fireEvent.change(mortgageInput, { target: { value: '15000' } });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('15000')).toBeInTheDocument();
    });
  });

  it('shows SALT limitation warning', async () => {
    render(<DeductionOptimizer />);
    
    // Find the SALT input (second in the list)
    const numberInputs = screen.getAllByDisplayValue('0').filter(input => 
      input.getAttribute('type') === 'number' && input.getAttribute('placeholder') === '0'
    );
    const saltInput = numberInputs[1]; // SALT is second in the deductions array
    
    fireEvent.change(saltInput, { target: { value: '15000' } });
    
    await waitFor(() => {
      expect(screen.getByText('At deduction limit')).toBeInTheDocument();
    });
  });

  it('provides deduction optimization recommendations', async () => {
    render(<DeductionOptimizer />);
    
    await waitFor(() => {
      expect(screen.getByText('Recommendation')).toBeInTheDocument();
      expect(screen.getByText('Take Standard Deduction')).toBeInTheDocument();
    });
  });

  it('shows potential savings information', async () => {
    render(<DeductionOptimizer />);
    
    await waitFor(() => {
      // Should show savings or difference information
      expect(screen.getByText(/higher/i) || screen.getByText(/Save/i)).toBeInTheDocument();
    });
  });

  it('shows deduction categories breakdown', () => {
    render(<DeductionOptimizer />);
    
    expect(screen.getByText('Mortgage Interest')).toBeInTheDocument();
    expect(screen.getByText('State & Local Taxes (SALT)')).toBeInTheDocument();
    expect(screen.getByText('Charitable Contributions')).toBeInTheDocument();
    expect(screen.getByText('Medical Expenses')).toBeInTheDocument();
  });

  it('handles edge cases for very high deductions', async () => {
    render(<DeductionOptimizer />);
    
    // Find charitable contributions input (third in the list)
    const numberInputs = screen.getAllByDisplayValue('0').filter(input => 
      input.getAttribute('type') === 'number' && input.getAttribute('placeholder') === '0'
    );
    const charitableInput = numberInputs[2]; // Charitable is third in deductions array
    
    fireEvent.change(charitableInput, { target: { value: '50000' } });
    
    await waitFor(() => {
      // Should still calculate correctly and show itemized recommendation
      expect(screen.getByText('Itemize Deductions')).toBeInTheDocument();
    });
  });

  it('provides educational insights about deductions', () => {
    render(<DeductionOptimizer />);
    
    // Should have educational content about deductions - use more specific text
    expect(screen.getByText('Optimization Tips')).toBeInTheDocument();
    expect(screen.getByText('Deduction Comparison')).toBeInTheDocument();
  });
});

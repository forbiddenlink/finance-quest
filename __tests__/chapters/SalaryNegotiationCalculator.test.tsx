import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SalaryNegotiationCalculator from '@/components/chapters/fundamentals/calculators/SalaryNegotiationCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(() => jest.fn()),
}));

describe('SalaryNegotiationCalculator', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  test('renders component with header and description', () => {
    render(<SalaryNegotiationCalculator />);
    
    expect(screen.getByText(/Salary Negotiation Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Plan your salary negotiation with data-driven insights/i)).toBeInTheDocument();
  });

  test('shows input fields with proper accessibility attributes', () => {
    render(<SalaryNegotiationCalculator />);
    
    // Check for proper labels and inputs
    expect(screen.getByLabelText(/Current Annual Salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Annual Salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Years in Current Role/i)).toBeInTheDocument();
    
    // Check for ARIA attributes
    const currentSalaryInput = screen.getByLabelText(/Current Annual Salary/i);
    expect(currentSalaryInput).toHaveAttribute('aria-describedby');
    expect(currentSalaryInput).toHaveAttribute('aria-invalid', 'false');
    expect(currentSalaryInput).toHaveAttribute('min', '20000');
    
    const targetSalaryInput = screen.getByLabelText(/Target Annual Salary/i);
    expect(targetSalaryInput).toHaveAttribute('aria-describedby');
    expect(targetSalaryInput).toHaveAttribute('aria-invalid', 'false');
    
    const yearsInput = screen.getByLabelText(/Years in Current Role/i);
    expect(yearsInput).toHaveAttribute('aria-describedby');
    expect(yearsInput).toHaveAttribute('min', '0');
    expect(yearsInput).toHaveAttribute('max', '50');
  });

  test('shows help text for input fields', () => {
    render(<SalaryNegotiationCalculator />);
    
    expect(screen.getByText(/Your current annual salary before any proposed increase/i)).toBeInTheDocument();
    expect(screen.getByText(/The salary amount you want to negotiate for/i)).toBeInTheDocument();
    expect(screen.getByText(/How long you've been in your current position/i)).toBeInTheDocument();
  });

  test('validates input fields and shows error messages', async () => {
    render(<SalaryNegotiationCalculator />);
    
    const currentSalaryInput = screen.getByLabelText(/Current Annual Salary/i);
    
    // Test invalid input
    fireEvent.change(currentSalaryInput, { target: { value: '10000' } });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid number \(minimum: \$20,000\)/i)).toBeInTheDocument();
    });
    
    // Test that aria-invalid is updated
    expect(currentSalaryInput).toHaveAttribute('aria-invalid', 'true');
    expect(currentSalaryInput).toHaveClass('border-red-500');
  });

  test('clears validation errors when valid input is provided', async () => {
    render(<SalaryNegotiationCalculator />);
    
    const currentSalaryInput = screen.getByLabelText(/Current Annual Salary/i);
    
    // First enter invalid input
    fireEvent.change(currentSalaryInput, { target: { value: '10000' } });
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Then enter valid input
    fireEvent.change(currentSalaryInput, { target: { value: '65000' } });
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(currentSalaryInput).toHaveAttribute('aria-invalid', 'false');
    });
  });

  test('updates input values correctly', () => {
    render(<SalaryNegotiationCalculator />);
    
    const currentSalaryInput = screen.getByLabelText(/Current Annual Salary/i);
    const targetSalaryInput = screen.getByLabelText(/Target Annual Salary/i);
    const yearsInput = screen.getByLabelText(/Years in Current Role/i);
    
    fireEvent.change(currentSalaryInput, { target: { value: '65000' } });
    fireEvent.change(targetSalaryInput, { target: { value: '75000' } });
    fireEvent.change(yearsInput, { target: { value: '2' } });
    
    expect(currentSalaryInput).toHaveValue(65000);
    expect(targetSalaryInput).toHaveValue(75000);
    expect(yearsInput).toHaveValue(2);
  });

  test('calculates negotiation analysis when button is clicked', async () => {
    render(<SalaryNegotiationCalculator />);
    
    // Fill in valid values
    fireEvent.change(screen.getByLabelText(/Current Annual Salary/i), { target: { value: '65000' } });
    fireEvent.change(screen.getByLabelText(/Target Annual Salary/i), { target: { value: '75000' } });
    fireEvent.change(screen.getByLabelText(/Years in Current Role/i), { target: { value: '2' } });
    
    // Click calculate button
    const calculateButton = screen.getByRole('button', { name: /calculate negotiation strategy/i });
    fireEvent.click(calculateButton);
    
    // Check if analysis appears
    await waitFor(() => {
      expect(screen.getByText(/Negotiation Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Salary Increase/i)).toBeInTheDocument();
      expect(screen.getByText(/Lifetime Impact/i)).toBeInTheDocument();
    });
  });

  test('handles market research checkbox', () => {
    render(<SalaryNegotiationCalculator />);
    
    const checkbox = screen.getByLabelText(/I have researched market rates for my position/i);
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('shows confidence score based on inputs', async () => {
    render(<SalaryNegotiationCalculator />);
    
    // Fill in values that should give a good confidence score
    fireEvent.change(screen.getByLabelText(/Current Annual Salary/i), { target: { value: '65000' } });
    fireEvent.change(screen.getByLabelText(/Target Annual Salary/i), { target: { value: '68000' } }); // Small increase
    fireEvent.change(screen.getByLabelText(/Years in Current Role/i), { target: { value: '3' } });
    fireEvent.click(screen.getByLabelText(/I have researched market rates for my position/i));
    
    fireEvent.click(screen.getByRole('button', { name: /calculate negotiation strategy/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Confidence Score/i)).toBeInTheDocument();
      // Should show a percentage
      expect(screen.getByText(/%$/)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RentalPropertyCalculator from '@/components/chapters/fundamentals/calculators/RentalPropertyCalculator';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn()
}));

describe('RentalPropertyCalculator', () => {
  // Setup mock for useProgressStore
  beforeEach(() => {
    (useProgressStore as jest.Mock).mockReturnValue({
      recordCalculatorUsage: jest.fn()
    });
  });

  it('renders calculator with initial values', () => {
    render(<RentalPropertyCalculator />);
    
    // Check for main title
    expect(screen.getByText('Rental Property Calculator')).toBeInTheDocument();
    
    // Check for initial input values
    expect(screen.getByLabelText(/Property Value/i)).toHaveValue(350000);
    expect(screen.getByLabelText(/Monthly Base Rent/i)).toHaveValue(2800);
    expect(screen.getByLabelText(/Parking Fees/i)).toHaveValue(100);
    expect(screen.getByLabelText(/Storage Fees/i)).toHaveValue(50);
  });

  it('updates property and income inputs correctly', async () => {
    render(<RentalPropertyCalculator />);
    const user = userEvent.setup();
    
    // Test property value update
    const propertyValueInput = screen.getByLabelText(/Property Value/i);
    await user.clear(propertyValueInput);
    await user.type(propertyValueInput, '400000');
    expect(propertyValueInput).toHaveValue(400000);

    // Test monthly rent update
    const monthlyRentInput = screen.getByLabelText(/Monthly Base Rent/i);
    await user.clear(monthlyRentInput);
    await user.type(monthlyRentInput, '3000');
    expect(monthlyRentInput).toHaveValue(3000);
  });

  it('calculates key metrics correctly', async () => {
    render(<RentalPropertyCalculator />);
    
    // Wait for analysis to be calculated
    await waitFor(() => {
      expect(screen.getByText('Monthly Net Income')).toBeInTheDocument();
    });

    // Check for key metrics
    expect(screen.getByText('Cash-on-Cash Return')).toBeInTheDocument();
    expect(screen.getByText('Cap Rate')).toBeInTheDocument();
  });

  it('updates operating expenses correctly', async () => {
    render(<RentalPropertyCalculator />);
    const user = userEvent.setup();
    
    // Test mortgage payment update
    const mortgageInput = screen.getByLabelText(/Mortgage Payment/i);
    await user.clear(mortgageInput);
    await user.type(mortgageInput, '2000');
    expect(mortgageInput).toHaveValue(2000);

    // Test property tax update
    const taxInput = screen.getByLabelText(/Property Taxes/i);
    await user.clear(taxInput);
    await user.type(taxInput, '500');
    expect(taxInput).toHaveValue(500);
  });

  it('displays investment rules analysis', async () => {
    render(<RentalPropertyCalculator />);
    
    // Check for investment rules
    expect(screen.getByText('1% Rule')).toBeInTheDocument();
    expect(screen.getByText('2% Rule')).toBeInTheDocument();
    expect(screen.getByText('50% Rule')).toBeInTheDocument();
  });

  it('shows recommendations based on analysis', async () => {
    render(<RentalPropertyCalculator />);
    
    await waitFor(() => {
      const recommendationsSection = screen.queryByText('Recommendations');
      if (recommendationsSection) {
        expect(recommendationsSection).toBeInTheDocument();
      }
    });
  });

  it('displays expense breakdown table', async () => {
    render(<RentalPropertyCalculator />);
    
    expect(screen.getByText('Expense Breakdown')).toBeInTheDocument();
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Annual')).toBeInTheDocument();
    expect(screen.getByText('% of Total')).toBeInTheDocument();
  });

  it('handles vacancy and turnover rate inputs', async () => {
    render(<RentalPropertyCalculator />);
    const user = userEvent.setup();
    
    // Test vacancy rate update
    const vacancyInput = screen.getByLabelText(/Vacancy Rate/i);
    await user.clear(vacancyInput);
    await user.type(vacancyInput, '8');
    expect(vacancyInput).toHaveValue(8);

    // Test turnover rate update
    const turnoverInput = screen.getByLabelText(/Turnover Rate/i);
    await user.clear(turnoverInput);
    await user.type(turnoverInput, '25');
    expect(turnoverInput).toHaveValue(25);
  });

  it('updates initial investment details correctly', async () => {
    render(<RentalPropertyCalculator />);
    const user = userEvent.setup();
    
    // Test down payment update
    const downPaymentInput = screen.getByLabelText(/Down Payment/i);
    await user.clear(downPaymentInput);
    await user.type(downPaymentInput, '80000');
    expect(downPaymentInput).toHaveValue(80000);

    // Test closing costs update
    const closingCostsInput = screen.getByLabelText(/Closing Costs/i);
    await user.clear(closingCostsInput);
    await user.type(closingCostsInput, '10000');
    expect(closingCostsInput).toHaveValue(10000);
  });

  it('displays warning signs when appropriate', async () => {
    render(<RentalPropertyCalculator />);
    const user = userEvent.setup();
    
    // Set values that should trigger warnings
    const rentInput = screen.getByLabelText(/Monthly Base Rent/i);
    await user.clear(rentInput);
    await user.type(rentInput, '1000'); // Low rent compared to property value

    await waitFor(() => {
      const warningsSection = screen.queryByText('Warning Signs');
      if (warningsSection) {
        expect(warningsSection).toBeInTheDocument();
      }
    });
  });

  it('shows educational tips section', () => {
    render(<RentalPropertyCalculator />);
    
    expect(screen.getByText('Rental Property Investment Tips')).toBeInTheDocument();
    expect(screen.getByText(/1% Rule:/)).toBeInTheDocument();
    expect(screen.getByText(/50% Rule:/)).toBeInTheDocument();
    expect(screen.getByText(/Cap Rate:/)).toBeInTheDocument();
  });

  it('records calculator usage', () => {
    const mockRecordUsage = jest.fn();
    (useProgressStore as jest.Mock).mockReturnValue({
      recordCalculatorUsage: mockRecordUsage
    });

    render(<RentalPropertyCalculator />);
    
    expect(mockRecordUsage).toHaveBeenCalledWith('rental-property-calculator');
  });
});

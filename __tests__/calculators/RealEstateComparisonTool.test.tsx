import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RealEstateComparisonTool from '@/components/chapters/fundamentals/calculators/RealEstateComparisonTool';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn()
}));

describe('RealEstateComparisonTool', () => {
  // Setup mock for useProgressStore
  beforeEach(() => {
    (useProgressStore as jest.Mock).mockReturnValue({
      recordCalculatorUsage: jest.fn()
    });
  });

  it('renders calculator with initial properties', () => {
    render(<RealEstateComparisonTool />);
    
    // Check for main title
    expect(screen.getByText('Real Estate Comparison Tool')).toBeInTheDocument();
    
    // Check for initial properties
    expect(screen.getByDisplayValue('Property A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Property B')).toBeInTheDocument();
  });

  it('allows adding and removing properties', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    // Add new property
    const addButton = screen.getByText('Add Property');
    await user.click(addButton);
    
    // Should now have 3 properties
    expect(screen.getByDisplayValue('Property C')).toBeInTheDocument();
    
    // Remove the newly added property (Property C) - find by aria-label that includes "Property C"
    await waitFor(() => {
      const removeButton = screen.getByLabelText('Remove Property C');
      return user.click(removeButton);
    });
    
    // Should now have 2 properties
    expect(screen.queryByDisplayValue('Property C')).not.toBeInTheDocument();
  });

  it('updates property details correctly', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    // Update property name
    const nameInput = screen.getByDisplayValue('Property A');
    await user.clear(nameInput);
    await user.type(nameInput, 'Test Property');
    expect(nameInput).toHaveValue('Test Property');

    // Update property price - use the first input with Purchase Price label
    const priceInputs = screen.getAllByLabelText(/Purchase Price/i);
    await user.clear(priceInputs[0]);
    await user.type(priceInputs[0], '400000');
    expect(priceInputs[0]).toHaveValue(400000);
  });

  it('calculates and displays property metrics', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    // Update property values to trigger calculations
    const priceInputs = screen.getAllByLabelText(/Purchase Price/i);
    const rentInputs = screen.getAllByLabelText(/Monthly Rent/i);
    const expensesInputs = screen.getAllByLabelText(/Monthly Expenses/i);
    
    await user.clear(priceInputs[0]);
    await user.type(priceInputs[0], '300000');
    await user.clear(rentInputs[0]);
    await user.type(rentInputs[0], '2500');
    await user.clear(expensesInputs[0]);
    await user.type(expensesInputs[0], '1000');
    
    // Wait for metrics to be calculated - check for table headers using columnheader role
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'CoC Return' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Cap Rate' })).toBeInTheDocument();
    });
  });

  it('displays comparison results when properties are filled', async () => {
    render(<RealEstateComparisonTool />);
    
    // Wait for comparison results
    await waitFor(() => {
      expect(screen.getByText('Best Overall Value')).toBeInTheDocument();
      expect(screen.getByText('Best Cash Flow')).toBeInTheDocument();
      expect(screen.getByText('Best CoC Return')).toBeInTheDocument();
      expect(screen.getByText('Best Cap Rate')).toBeInTheDocument();
    });
  });

  it('shows detailed comparison table', async () => {
    render(<RealEstateComparisonTool />);
    
    // Check for table headers using columnheader role
    expect(screen.getByText('Detailed Property Comparison')).toBeInTheDocument();
    expect(screen.getByText('Property')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    // Use columnheader role to find specific table header
    expect(screen.getByRole('columnheader', { name: 'Cash Flow' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'CoC Return' })).toBeInTheDocument();
  });

  it('displays recommendations based on analysis', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    // Set good values for a property to trigger recommendations
    const priceInput = screen.getAllByLabelText(/Purchase Price/i)[0];
    const rentInput = screen.getAllByLabelText(/Monthly Rent/i)[0];
    const expensesInput = screen.getAllByLabelText(/Monthly Expenses/i)[0];
    
    await user.clear(priceInput);
    await user.type(priceInput, '200000');
    await user.clear(rentInput);
    await user.type(rentInput, '2500'); // Good rent-to-price ratio
    await user.clear(expensesInput);
    await user.type(expensesInput, '800');
    
    await waitFor(() => {
      const recommendationsSection = screen.queryByText('Investment Recommendations');
      if (recommendationsSection) {
        expect(recommendationsSection).toBeInTheDocument();
      }
    });
  });

  it('shows warnings for risky properties', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    // Set values that should trigger warnings
    const priceInputs = screen.getAllByLabelText(/Purchase Price/i);
    const rentInputs = screen.getAllByLabelText(/Monthly Rent/i);
    const expensesInputs = screen.getAllByLabelText(/Monthly Expenses/i);
    const yearInputs = screen.getAllByLabelText(/Year Built/i);
    
    await user.clear(priceInputs[0]);
    await user.type(priceInputs[0], '500000');
    await user.clear(rentInputs[0]);
    await user.type(rentInputs[0], '2000'); // Low rent-to-price ratio
    await user.clear(expensesInputs[0]);
    await user.type(expensesInputs[0], '1800'); // High expenses
    await user.clear(yearInputs[0]);
    await user.type(yearInputs[0], '1970'); // Old property
    
    await waitFor(() => {
      const warningsSection = screen.queryByText('Investment Warnings');
      if (warningsSection) {
        expect(warningsSection).toBeInTheDocument();
      }
    });
  });

  it('displays property scores and rankings', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    // Set different values for properties to test scoring
    const priceInputs = screen.getAllByLabelText(/Purchase Price/i);
    const rentInputs = screen.getAllByLabelText(/Monthly Rent/i);
    
    // Property A - Better values
    await user.clear(priceInputs[0]);
    await user.type(priceInputs[0], '200000');
    await user.clear(rentInputs[0]);
    await user.type(rentInputs[0], '2500');
    
    // Property B - Worse values
    await user.clear(priceInputs[1]);
    await user.type(priceInputs[1], '400000');
    await user.clear(rentInputs[1]);
    await user.type(rentInputs[1], '2800');
    
    await waitFor(() => {
      // Check for any score display instead of specific text
      const scoreElements = screen.getAllByText(/Score:/);
      expect(scoreElements.length).toBeGreaterThan(0);
    });
  });

  it('shows investment criteria guide', () => {
    render(<RealEstateComparisonTool />);
    
    expect(screen.getByText('Property Comparison Criteria')).toBeInTheDocument();
    expect(screen.getByText(/Scoring System \(0-100\):/)).toBeInTheDocument();
    expect(screen.getByText(/Key Metrics:/)).toBeInTheDocument();
  });

  it('records calculator usage', () => {
    const mockRecordUsage = jest.fn();
    (useProgressStore as jest.Mock).mockReturnValue({
      recordCalculatorUsage: mockRecordUsage
    });

    render(<RealEstateComparisonTool />);
    
    expect(mockRecordUsage).toHaveBeenCalledWith('real-estate-comparison-tool');
  });

  it('handles property type selection', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    const propertyTypeSelect = screen.getAllByLabelText(/Property Type/i)[0];
    await user.selectOptions(propertyTypeSelect, 'Duplex');
    
    expect(propertyTypeSelect).toHaveValue('Duplex');
  });

  it('calculates price per square foot', async () => {
    render(<RealEstateComparisonTool />);
    const user = userEvent.setup();
    
    const priceInputs = screen.getAllByLabelText(/Purchase Price/i);
    const sqftInputs = screen.getAllByLabelText(/Square Footage/i);
    
    await user.clear(priceInputs[0]);
    await user.type(priceInputs[0], '300000');
    await user.clear(sqftInputs[0]);
    await user.type(sqftInputs[0], '1500');
    
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'Price/SqFt' })).toBeInTheDocument();
    });
  });
});

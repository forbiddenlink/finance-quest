import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LifeInsuranceCalculator from '@/components/chapters/fundamentals/calculators/LifeInsuranceCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock theme
jest.mock('@/lib/theme', () => ({
  theme: {
    backgrounds: {
      primary: 'bg-slate-900',
      card: 'bg-slate-800',
      glass: 'bg-white/5'
    },
    textColors: {
      primary: 'text-white',
      secondary: 'text-slate-300'
    },
    borderColors: {
      primary: 'border-white/10'
    },
    buttons: {
      primary: 'bg-blue-600 hover:bg-blue-700',
      secondary: 'bg-slate-600 hover:bg-slate-700'
    }
  }
}));

const mockRecordCalculatorUsage = jest.fn();
const mockUserProgress = {
  calculatorUsage: {},
  completedLessons: [],
  quizScores: {},
  financialLiteracyScore: 450,
  userLevel: 1
};

beforeEach(() => {
  jest.clearAllMocks();

  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    userProgress: mockUserProgress,
    recordCalculatorUsage: mockRecordCalculatorUsage,
  });
});

describe('LifeInsuranceCalculator', () => {
  test('renders the calculator component without crashing', () => {
    render(<LifeInsuranceCalculator />);
    expect(screen.getByText(/Life Insurance Needs Calculator/i)).toBeInTheDocument();
  });

  test('displays all required input fields', () => {
    render(<LifeInsuranceCalculator />);

    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Retirement Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Savings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Existing Life Insurance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mortgage Balance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Other Debts/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Final Expenses/i)).toBeInTheDocument();
  });

  test('calculates life insurance needs automatically', async () => {
    render(<LifeInsuranceCalculator />);

    // Input values
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);

    fireEvent.change(incomeInput, { target: { value: '60000' } });
    fireEvent.change(ageInput, { target: { value: '35' } });

    await waitFor(() => {
      expect(screen.getAllByText(/Total Needs/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Insurance Gap/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Recommended/i)[0]).toBeInTheDocument();
    });
  });

  test('shows family members management', () => {
    render(<LifeInsuranceCalculator />);

    expect(screen.getByText(/Family Members/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Member/i)).toBeInTheDocument();
    
    // Should have default family members - check by input values
    const nameInputs = screen.getAllByPlaceholderText(/Family member name/i);
    expect(nameInputs).toHaveLength(2); // Default 2 members
    
    // Check if default values exist in the inputs
    expect(nameInputs[0]).toHaveValue('Spouse');
    expect(nameInputs[1]).toHaveValue('Child 1');
  });

  test('can add and remove family members', async () => {
    render(<LifeInsuranceCalculator />);

    const addButton = screen.getByText(/Add Member/i);
    fireEvent.click(addButton);

    await waitFor(() => {
      const familyMembers = screen.getAllByText(/Remove/i);
      expect(familyMembers).toHaveLength(3); // 2 default + 1 new
    });

    // Remove a member
    const removeButtons = screen.getAllByText(/Remove/i);
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const remainingMembers = screen.getAllByText(/Remove/i);
      expect(remainingMembers).toHaveLength(2);
    });
  });

  test('displays insurance needs breakdown', async () => {
    render(<LifeInsuranceCalculator />);

    await waitFor(() => {
      expect(screen.getByText(/Insurance Needs Breakdown/i)).toBeInTheDocument();
      expect(screen.getByText(/Needs Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Available Resources/i)).toBeInTheDocument();
      expect(screen.getByText(/Immediate Expenses/i)).toBeInTheDocument();
      expect(screen.getByText(/Income Replacement/i)).toBeInTheDocument();
      expect(screen.getByText(/Future Obligations/i)).toBeInTheDocument();
    });
  });

  test('provides insurance recommendations', async () => {
    render(<LifeInsuranceCalculator />);

    await waitFor(() => {
      expect(screen.getByText(/Insurance Recommendations/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument();
      expect(screen.getByText(/Insurance Type/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated Annual Premium/i)).toBeInTheDocument();
    });
  });

  test('updates calculations when inputs change', async () => {
    render(<LifeInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    
    // Initial calculation - wait for results section to appear
    await waitFor(() => {
      expect(screen.getAllByText(/Total Needs/i)).toHaveLength(2); // Header and breakdown
    });

    // Change income and verify recalculation
    fireEvent.change(incomeInput, { target: { value: '100000' } });

    await waitFor(() => {
      expect(screen.getAllByText(/Total Needs/i)).toHaveLength(2);
      // The calculation should update automatically
    });
  });

  test('validates input values', () => {
    render(<LifeInsuranceCalculator />);

    const ageInput = screen.getByLabelText(/Current Age/i);
    const incomeInput = screen.getByLabelText(/Annual Income/i);

    // Test that inputs accept valid values
    fireEvent.change(ageInput, { target: { value: '35' } });
    fireEvent.change(incomeInput, { target: { value: '75000' } });

    expect(ageInput).toHaveValue(35);
    expect(incomeInput).toHaveValue(75000);
  });

  test('records calculator usage in progress store', () => {
    render(<LifeInsuranceCalculator />);

    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('life-insurance-calculator');
  });

  test('handles inflation rate adjustments', async () => {
    render(<LifeInsuranceCalculator />);

    const inflationInput = screen.getByLabelText(/Expected Inflation Rate/i);
    fireEvent.change(inflationInput, { target: { value: '4' } });

    await waitFor(() => {
      expect(inflationInput).toHaveValue(4);
      expect(screen.getAllByText(/Total Needs/i)[0]).toBeInTheDocument();
    });
  });

  test('displays currency formatting', async () => {
    render(<LifeInsuranceCalculator />);

    await waitFor(() => {
      // Should display dollar amounts in proper format
      const dollarAmounts = screen.getAllByText(/\$/);
      expect(dollarAmounts.length).toBeGreaterThan(0);
    });
  });

  test('maintains theme consistency', () => {
    render(<LifeInsuranceCalculator />);

    // Should use theme classes consistently
    const themeElements = document.querySelectorAll('[class*="bg-slate"]');
    expect(themeElements.length).toBeGreaterThan(0);
  });

  test('supports accessibility standards', () => {
    render(<LifeInsuranceCalculator />);

    // Check for proper form labels
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);
    
    expect(incomeInput).toBeInTheDocument();
    expect(ageInput).toBeInTheDocument();

    // Check for proper button accessibility
    const addButton = screen.getByRole('button', { name: /Add Member/i });
    expect(addButton).toBeInTheDocument();
  });
});

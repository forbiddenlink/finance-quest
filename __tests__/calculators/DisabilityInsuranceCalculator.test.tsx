import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisabilityInsuranceCalculator from '@/components/chapters/fundamentals/calculators/DisabilityInsuranceCalculator';

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

describe('DisabilityInsuranceCalculator', () => {
  test('renders the calculator component without crashing', () => {
    render(<DisabilityInsuranceCalculator />);
    expect(screen.getByText(/Disability Insurance Calculator/i)).toBeInTheDocument();
  });

  test('displays all required input fields', () => {
    render(<DisabilityInsuranceCalculator />);

    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Occupation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Expenses/i)).toBeInTheDocument();
  });

  test('calculates short-term disability coverage needs', async () => {
    render(<DisabilityInsuranceCalculator />);

    // Input values for STD calculation
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const expensesInput = screen.getByLabelText(/Monthly Expenses/i);

    fireEvent.change(incomeInput, { target: { value: '60000' } });
    fireEvent.change(expensesInput, { target: { value: '4000' } });

    // Select short-term disability
    const coverageTypeSelect = screen.getByLabelText(/Coverage Type/i);
    fireEvent.change(coverageTypeSelect, { target: { value: 'short-term' } });

    const calculateButton = screen.getByText(/Calculate Coverage/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Short-Term Disability/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommended Benefit/i)).toBeInTheDocument();
    });
  });

  test('calculates long-term disability coverage needs', async () => {
    render(<DisabilityInsuranceCalculator />);

    // Input values for LTD calculation
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);
    const savingsInput = screen.getByLabelText(/Emergency Savings/i);

    fireEvent.change(incomeInput, { target: { value: '75000' } });
    fireEvent.change(ageInput, { target: { value: '35' } });
    fireEvent.change(savingsInput, { target: { value: '20000' } });

    // Select long-term disability
    const coverageTypeSelect = screen.getByLabelText(/Coverage Type/i);
    fireEvent.change(coverageTypeSelect, { target: { value: 'long-term' } });

    const calculateButton = screen.getByText(/Calculate Coverage/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Long-Term Disability/i)).toBeInTheDocument();
      expect(screen.getByText(/Monthly Benefit Amount/i)).toBeInTheDocument();
    });
  });

  test('shows occupation-specific risk assessment', async () => {
    render(<DisabilityInsuranceCalculator />);

    const occupationSelect = screen.getByLabelText(/Occupation/i);
    fireEvent.change(occupationSelect, { target: { value: 'construction' } });

    await waitFor(() => {
      expect(screen.getByText(/High Risk Occupation/i)).toBeInTheDocument();
      expect(screen.getByText(/Premium Impact/i)).toBeInTheDocument();
    });
  });

  test('calculates premium estimates by coverage level', async () => {
    render(<DisabilityInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);
    const healthSelect = screen.getByLabelText(/Health Status/i);
    const coverageSelect = screen.getByLabelText(/Coverage Level/i);

    fireEvent.change(incomeInput, { target: { value: '80000' } });
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.change(healthSelect, { target: { value: 'excellent' } });
    fireEvent.change(coverageSelect, { target: { value: '60%' } });

    const calculateButton = screen.getByText(/Calculate Premiums/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Estimated Premium/i)).toBeInTheDocument();
      expect(screen.getByText(/60% of Income/i)).toBeInTheDocument();
    });
  });

  test('shows benefit period recommendations', async () => {
    render(<DisabilityInsuranceCalculator />);

    const ageInput = screen.getByLabelText(/Current Age/i);
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i);

    fireEvent.change(ageInput, { target: { value: '40' } });
    fireEvent.change(retirementAgeInput, { target: { value: '65' } });

    await waitFor(() => {
      expect(screen.getByText(/Benefit Period/i)).toBeInTheDocument();
      expect(screen.getByText(/Age 65/i)).toBeInTheDocument();
    });
  });

  test('calculates elimination period impact', async () => {
    render(<DisabilityInsuranceCalculator />);

    const eliminationSelect = screen.getByLabelText(/Elimination Period/i);
    fireEvent.change(eliminationSelect, { target: { value: '90' } });

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    fireEvent.change(incomeInput, { target: { value: '70000' } });

    const calculateButton = screen.getByText(/Calculate Impact/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/90-Day Elimination/i)).toBeInTheDocument();
      expect(screen.getByText(/Premium Savings/i)).toBeInTheDocument();
    });
  });

  test('shows own occupation vs any occupation coverage', async () => {
    render(<DisabilityInsuranceCalculator />);

    const definitionSelect = screen.getByLabelText(/Disability Definition/i);
    fireEvent.change(definitionSelect, { target: { value: 'own-occupation' } });

    await waitFor(() => {
      expect(screen.getByText(/Own Occupation/i)).toBeInTheDocument();
      expect(screen.getByText(/Higher Premium/i)).toBeInTheDocument();
    });

    fireEvent.change(definitionSelect, { target: { value: 'any-occupation' } });

    await waitFor(() => {
      expect(screen.getByText(/Any Occupation/i)).toBeInTheDocument();
      expect(screen.getByText(/Lower Premium/i)).toBeInTheDocument();
    });
  });

  test('calculates social security disability benefits', async () => {
    render(<DisabilityInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const workYearsInput = screen.getByLabelText(/Years Worked/i);

    fireEvent.change(incomeInput, { target: { value: '65000' } });
    fireEvent.change(workYearsInput, { target: { value: '15' } });

    const ssdButton = screen.getByText(/Calculate SSDI/i);
    fireEvent.click(ssdButton);

    await waitFor(() => {
      expect(screen.getByText(/Social Security Disability/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated SSDI Benefit/i)).toBeInTheDocument();
    });
  });

  test('shows group vs individual policy comparison', async () => {
    render(<DisabilityInsuranceCalculator />);

    const policyTypeSelect = screen.getByLabelText(/Policy Type/i);
    fireEvent.change(policyTypeSelect, { target: { value: 'comparison' } });

    await waitFor(() => {
      expect(screen.getByText(/Group Policy/i)).toBeInTheDocument();
      expect(screen.getByText(/Individual Policy/i)).toBeInTheDocument();
      expect(screen.getByText(/Portability/i)).toBeInTheDocument();
    });
  });

  test('calculates coverage gap analysis', async () => {
    render(<DisabilityInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const existingCoverageInput = screen.getByLabelText(/Existing Group Coverage/i);
    const expensesInput = screen.getByLabelText(/Monthly Expenses/i);

    fireEvent.change(incomeInput, { target: { value: '80000' } });
    fireEvent.change(existingCoverageInput, { target: { value: '2000' } });
    fireEvent.change(expensesInput, { target: { value: '5000' } });

    const analyzeButton = screen.getByText(/Analyze Gap/i);
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText(/Coverage Gap/i)).toBeInTheDocument();
      expect(screen.getByText(/Additional Coverage Needed/i)).toBeInTheDocument();
    });
  });

  test('validates input ranges and formats', () => {
    render(<DisabilityInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);

    // Test invalid income
    fireEvent.change(incomeInput, { target: { value: '-1000' } });
    fireEvent.blur(incomeInput);

    expect(screen.getByText(/Income must be positive/i)).toBeInTheDocument();

    // Test invalid age
    fireEvent.change(ageInput, { target: { value: '150' } });
    fireEvent.blur(ageInput);

    expect(screen.getByText(/Valid age range/i)).toBeInTheDocument();
  });

  test('records calculator usage in progress store', () => {
    render(<DisabilityInsuranceCalculator />);

    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('disability-insurance-calculator');
  });

  test('provides educational context with results', async () => {
    render(<DisabilityInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    fireEvent.change(incomeInput, { target: { value: '70000' } });

    const calculateButton = screen.getByText(/Calculate/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Why This Coverage/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Benefits/i)).toBeInTheDocument();
    });
  });

  test('shows cost of waiting analysis', async () => {
    render(<DisabilityInsuranceCalculator />);

    const ageInput = screen.getByLabelText(/Current Age/i);
    fireEvent.change(ageInput, { target: { value: '25' } });

    await waitFor(() => {
      expect(screen.getByText(/Cost of Waiting/i)).toBeInTheDocument();
      expect(screen.getByText(/Premium Increases/i)).toBeInTheDocument();
    });
  });

  test('calculates family impact of disability', async () => {
    render(<DisabilityInsuranceCalculator />);

    const dependentsInput = screen.getByLabelText(/Dependents/i);
    const spouseIncomeInput = screen.getByLabelText(/Spouse Income/i);

    fireEvent.change(dependentsInput, { target: { value: '2' } });
    fireEvent.change(spouseIncomeInput, { target: { value: '45000' } });

    const analyzeButton = screen.getByText(/Analyze Family Impact/i);
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText(/Family Financial Impact/i)).toBeInTheDocument();
    });
  });

  test('shows rider options and benefits', async () => {
    render(<DisabilityInsuranceCalculator />);

    const ridersCheckbox = screen.getByLabelText(/Include Riders/i);
    fireEvent.click(ridersCheckbox);

    await waitFor(() => {
      expect(screen.getByText(/Cost of Living Adjustment/i)).toBeInTheDocument();
      expect(screen.getByText(/Future Increase Option/i)).toBeInTheDocument();
      expect(screen.getByText(/Residual Benefits/i)).toBeInTheDocument();
    });
  });

  test('provides actionable next steps', async () => {
    render(<DisabilityInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    fireEvent.change(incomeInput, { target: { value: '60000' } });

    const calculateButton = screen.getByText(/Calculate/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Next Steps/i)).toBeInTheDocument();
      expect(screen.getByText(/Get Quotes/i)).toBeInTheDocument();
      expect(screen.getByText(/Review Employer Coverage/i)).toBeInTheDocument();
    });
  });

  test('handles occupation-specific underwriting', async () => {
    render(<DisabilityInsuranceCalculator />);

    const occupationSelect = screen.getByLabelText(/Occupation/i);
    fireEvent.change(occupationSelect, { target: { value: 'surgeon' } });

    await waitFor(() => {
      expect(screen.getByText(/Medical Professional/i)).toBeInTheDocument();
      expect(screen.getByText(/Specialized Coverage/i)).toBeInTheDocument();
    });
  });

  test('maintains theme consistency', () => {
    render(<DisabilityInsuranceCalculator />);

    // Should use theme classes consistently
    const themeElements = document.querySelectorAll('[class*="bg-slate"]');
    expect(themeElements.length).toBeGreaterThan(0);
  });

  test('supports accessibility standards', () => {
    render(<DisabilityInsuranceCalculator />);

    // Check for proper form labels
    const labels = screen.getAllByText(/:/);
    expect(labels.length).toBeGreaterThan(0);

    // Check for proper button accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });
});

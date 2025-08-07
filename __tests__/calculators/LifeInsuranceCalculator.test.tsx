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
    expect(screen.getByText(/Life Insurance Calculator/i)).toBeInTheDocument();
  });

  test('displays all required input fields', () => {
    render(<LifeInsuranceCalculator />);

    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dependents/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Existing Debts/i)).toBeInTheDocument();
  });

  test('calculates life insurance needs using income replacement method', async () => {
    render(<LifeInsuranceCalculator />);

    // Input values
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);
    const dependentsInput = screen.getByLabelText(/Dependents/i);

    fireEvent.change(incomeInput, { target: { value: '60000' } });
    fireEvent.change(ageInput, { target: { value: '35' } });
    fireEvent.change(dependentsInput, { target: { value: '2' } });

    const calculateButton = screen.getByText(/Calculate Coverage/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument();
    });
  });

  test('shows DIME method calculation breakdown', async () => {
    render(<LifeInsuranceCalculator />);

    // Input DIME method values
    const debtInput = screen.getByLabelText(/Existing Debts/i);
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const mortgageInput = screen.getByLabelText(/Mortgage Balance/i);
    const educationInput = screen.getByLabelText(/Education Costs/i);

    fireEvent.change(debtInput, { target: { value: '25000' } });
    fireEvent.change(incomeInput, { target: { value: '75000' } });
    fireEvent.change(mortgageInput, { target: { value: '200000' } });
    fireEvent.change(educationInput, { target: { value: '100000' } });

    const calculateButton = screen.getByText(/Calculate Coverage/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/DIME Method/i)).toBeInTheDocument();
      expect(screen.getByText(/Debt:/i)).toBeInTheDocument();
      expect(screen.getByText(/Income Replacement:/i)).toBeInTheDocument();
      expect(screen.getByText(/Mortgage:/i)).toBeInTheDocument();
      expect(screen.getByText(/Education:/i)).toBeInTheDocument();
    });
  });

  test('calculates term vs whole life premium comparison', async () => {
    render(<LifeInsuranceCalculator />);

    // Input values for premium calculation
    const ageInput = screen.getByLabelText(/Current Age/i);
    const coverageInput = screen.getByLabelText(/Coverage Amount/i);
    const healthSelect = screen.getByLabelText(/Health Status/i);

    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.change(coverageInput, { target: { value: '500000' } });
    fireEvent.change(healthSelect, { target: { value: 'excellent' } });

    const calculateButton = screen.getByText(/Calculate Premiums/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Term Life Premium/i)).toBeInTheDocument();
      expect(screen.getByText(/Whole Life Premium/i)).toBeInTheDocument();
    });
  });

  test('shows coverage recommendations based on life stage', async () => {
    render(<LifeInsuranceCalculator />);

    const ageInput = screen.getByLabelText(/Current Age/i);
    const maritalSelect = screen.getByLabelText(/Marital Status/i);
    const dependentsInput = screen.getByLabelText(/Dependents/i);

    fireEvent.change(ageInput, { target: { value: '25' } });
    fireEvent.change(maritalSelect, { target: { value: 'single' } });
    fireEvent.change(dependentsInput, { target: { value: '0' } });

    const calculateButton = screen.getByText(/Get Recommendations/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Young Professional/i)).toBeInTheDocument();
    });
  });

  test('displays beneficiary planning suggestions', async () => {
    render(<LifeInsuranceCalculator />);

    const dependentsInput = screen.getByLabelText(/Dependents/i);
    fireEvent.change(dependentsInput, { target: { value: '2' } });

    await waitFor(() => {
      expect(screen.getByText(/Beneficiary Planning/i)).toBeInTheDocument();
    });
  });

  test('calculates human life value approach', async () => {
    render(<LifeInsuranceCalculator />);

    // Select human life value method
    const methodSelect = screen.getByLabelText(/Calculation Method/i);
    fireEvent.change(methodSelect, { target: { value: 'human-life-value' } });

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i);
    const inflationInput = screen.getByLabelText(/Inflation Rate/i);

    fireEvent.change(incomeInput, { target: { value: '80000' } });
    fireEvent.change(ageInput, { target: { value: '35' } });
    fireEvent.change(retirementAgeInput, { target: { value: '65' } });
    fireEvent.change(inflationInput, { target: { value: '3' } });

    const calculateButton = screen.getByText(/Calculate/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Human Life Value/i)).toBeInTheDocument();
      expect(screen.getByText(/Present Value/i)).toBeInTheDocument();
    });
  });

  test('shows policy rider recommendations', async () => {
    render(<LifeInsuranceCalculator />);

    const ageInput = screen.getByLabelText(/Current Age/i);
    const occupationSelect = screen.getByLabelText(/Occupation/i);

    fireEvent.change(ageInput, { target: { value: '40' } });
    fireEvent.change(occupationSelect, { target: { value: 'high-risk' } });

    await waitFor(() => {
      expect(screen.getByText(/Accidental Death Benefit/i)).toBeInTheDocument();
      expect(screen.getByText(/Waiver of Premium/i)).toBeInTheDocument();
    });
  });

  test('validates input ranges and formats', () => {
    render(<LifeInsuranceCalculator />);

    const ageInput = screen.getByLabelText(/Current Age/i);
    const incomeInput = screen.getByLabelText(/Annual Income/i);

    // Test invalid age
    fireEvent.change(ageInput, { target: { value: '150' } });
    fireEvent.blur(ageInput);

    expect(screen.getByText(/Valid age range/i)).toBeInTheDocument();

    // Test negative income
    fireEvent.change(incomeInput, { target: { value: '-1000' } });
    fireEvent.blur(incomeInput);

    expect(screen.getByText(/Income must be positive/i)).toBeInTheDocument();
  });

  test('records calculator usage in progress store', () => {
    render(<LifeInsuranceCalculator />);

    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('life-insurance-calculator');
  });

  test('provides educational context with results', async () => {
    render(<LifeInsuranceCalculator />);

    // Input values and calculate
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    fireEvent.change(incomeInput, { target: { value: '70000' } });

    const calculateButton = screen.getByText(/Calculate/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Why This Amount/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Considerations/i)).toBeInTheDocument();
    });
  });

  test('supports multiple calculation scenarios', () => {
    render(<LifeInsuranceCalculator />);

    const scenarioTabs = screen.getAllByRole('tab');
    expect(scenarioTabs.length).toBeGreaterThan(1);

    // Should have tabs for different scenarios
    expect(screen.getByText(/Basic Needs/i)).toBeInTheDocument();
    expect(screen.getByText(/DIME Method/i)).toBeInTheDocument();
  });

  test('shows term length recommendations', async () => {
    render(<LifeInsuranceCalculator />);

    const ageInput = screen.getByLabelText(/Current Age/i);
    const dependentsAgeInput = screen.getByLabelText(/Youngest Dependent Age/i);

    fireEvent.change(ageInput, { target: { value: '35' } });
    fireEvent.change(dependentsAgeInput, { target: { value: '5' } });

    await waitFor(() => {
      expect(screen.getByText(/20-Year Term/i)).toBeInTheDocument();
    });
  });

  test('calculates premium differences by gender and smoking status', async () => {
    render(<LifeInsuranceCalculator />);

    const genderSelect = screen.getByLabelText(/Gender/i);
    const smokingSelect = screen.getByLabelText(/Smoking Status/i);

    fireEvent.change(genderSelect, { target: { value: 'male' } });
    fireEvent.change(smokingSelect, { target: { value: 'smoker' } });

    const calculateButton = screen.getByText(/Calculate Premiums/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Premium Impact/i)).toBeInTheDocument();
    });
  });

  test('provides actionable next steps', async () => {
    render(<LifeInsuranceCalculator />);

    // Complete calculation
    const incomeInput = screen.getByLabelText(/Annual Income/i);
    fireEvent.change(incomeInput, { target: { value: '60000' } });

    const calculateButton = screen.getByText(/Calculate/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Next Steps/i)).toBeInTheDocument();
      expect(screen.getByText(/Get Quotes/i)).toBeInTheDocument();
      expect(screen.getByText(/Review Beneficiaries/i)).toBeInTheDocument();
    });
  });

  test('handles edge cases and extreme values', () => {
    render(<LifeInsuranceCalculator />);

    const incomeInput = screen.getByLabelText(/Annual Income/i);
    const ageInput = screen.getByLabelText(/Current Age/i);

    // Test high income
    fireEvent.change(incomeInput, { target: { value: '1000000' } });
    fireEvent.change(ageInput, { target: { value: '65' } });

    const calculateButton = screen.getByText(/Calculate/i);
    fireEvent.click(calculateButton);

    // Should handle calculation without errors
    expect(screen.getByText(/Life Insurance Calculator/i)).toBeInTheDocument();
  });

  test('displays coverage gap analysis', async () => {
    render(<LifeInsuranceCalculator />);

    const existingCoverageInput = screen.getByLabelText(/Existing Coverage/i);
    const neededCoverageInput = screen.getByLabelText(/Annual Income/i);

    fireEvent.change(existingCoverageInput, { target: { value: '100000' } });
    fireEvent.change(neededCoverageInput, { target: { value: '80000' } });

    const calculateButton = screen.getByText(/Analyze Gap/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Coverage Gap/i)).toBeInTheDocument();
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
    const labels = screen.getAllByText(/:/);
    expect(labels.length).toBeGreaterThan(0);

    // Check for proper button accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });
});

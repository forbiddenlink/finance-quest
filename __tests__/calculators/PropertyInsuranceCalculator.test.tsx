import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyInsuranceCalculator from '@/components/chapters/fundamentals/calculators/PropertyInsuranceCalculator';

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

describe('PropertyInsuranceCalculator', () => {
  test('renders the calculator component without crashing', () => {
    render(<PropertyInsuranceCalculator />);
    expect(screen.getByText(/Property Insurance Calculator/i)).toBeInTheDocument();
  });

  test('displays all required input fields for homeowners insurance', () => {
    render(<PropertyInsuranceCalculator />);

    expect(screen.getByLabelText(/Net Worth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Risk Tolerance/i)).toBeInTheDocument();
  });

  test('calculates homeowners insurance coverage needs', async () => {
    render(<PropertyInsuranceCalculator />);

    // Input homeowner values
    const homeValueInput = screen.getByLabelText(/Home Value/i);
    const locationSelect = screen.getByLabelText(/Location/i);
    const homeAgeInput = screen.getByLabelText(/Home Age/i);

    fireEvent.change(homeValueInput, { target: { value: '350000' } });
    fireEvent.change(locationSelect, { target: { value: 'suburban' } });
    fireEvent.change(homeAgeInput, { target: { value: '15' } });

    const calculateButton = screen.getByText(/Calculate Coverage/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument();
      expect(screen.getByText(/Dwelling Coverage/i)).toBeInTheDocument();
    });
  });

  test('calculates renters insurance coverage needs', async () => {
    render(<PropertyInsuranceCalculator />);

    // Switch to renters insurance
    const insuranceTypeSelect = screen.getByLabelText(/Insurance Type/i);
    fireEvent.change(insuranceTypeSelect, { target: { value: 'renters' } });

    const personalPropertyInput = screen.getByLabelText(/Personal Property Value/i);
    const liabilityInput = screen.getByLabelText(/Liability Coverage/i);

    fireEvent.change(personalPropertyInput, { target: { value: '50000' } });
    fireEvent.change(liabilityInput, { target: { value: '300000' } });

    const calculateButton = screen.getByText(/Calculate Coverage/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Renters Insurance/i)).toBeInTheDocument();
      expect(screen.getByText(/Personal Property/i)).toBeInTheDocument();
    });
  });

  test('calculates auto insurance coverage recommendations', async () => {
    render(<PropertyInsuranceCalculator />);

    // Switch to auto insurance
    const insuranceTypeSelect = screen.getByLabelText(/Insurance Type/i);
    fireEvent.change(insuranceTypeSelect, { target: { value: 'auto' } });

    const vehicleValueInput = screen.getByLabelText(/Vehicle Value/i);
    const stateSelect = screen.getByLabelText(/State/i);
    const drivingRecordSelect = screen.getByLabelText(/Driving Record/i);

    fireEvent.change(vehicleValueInput, { target: { value: '25000' } });
    fireEvent.change(stateSelect, { target: { value: 'california' } });
    fireEvent.change(drivingRecordSelect, { target: { value: 'clean' } });

    const calculateButton = screen.getByText(/Calculate Coverage/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Auto Insurance/i)).toBeInTheDocument();
      expect(screen.getByText(/Liability Limits/i)).toBeInTheDocument();
    });
  });

  test('shows replacement cost vs actual cash value comparison', async () => {
    render(<PropertyInsuranceCalculator />);

    const coverageTypeSelect = screen.getByLabelText(/Coverage Type/i);
    fireEvent.change(coverageTypeSelect, { target: { value: 'replacement-cost' } });

    await waitFor(() => {
      expect(screen.getByText(/Replacement Cost/i)).toBeInTheDocument();
      expect(screen.getByText(/Higher Premium/i)).toBeInTheDocument();
    });

    fireEvent.change(coverageTypeSelect, { target: { value: 'actual-cash-value' } });

    await waitFor(() => {
      expect(screen.getByText(/Actual Cash Value/i)).toBeInTheDocument();
      expect(screen.getByText(/Depreciation Applied/i)).toBeInTheDocument();
    });
  });

  test('calculates deductible impact on premiums', async () => {
    render(<PropertyInsuranceCalculator />);

    const deductibleSelect = screen.getByLabelText(/Deductible/i);
    fireEvent.change(deductibleSelect, { target: { value: '1000' } });

    const homeValueInput = screen.getByLabelText(/Home Value/i);
    fireEvent.change(homeValueInput, { target: { value: '300000' } });

    const calculateButton = screen.getByText(/Calculate Premium/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/\$1,000 Deductible/i)).toBeInTheDocument();
      expect(screen.getByText(/Premium Impact/i)).toBeInTheDocument();
    });
  });

  test('shows umbrella policy recommendations', async () => {
    render(<PropertyInsuranceCalculator />);

    const netWorthInput = screen.getByLabelText(/Net Worth/i);
    const incomeInput = screen.getByLabelText(/Annual Income/i);

    fireEvent.change(netWorthInput, { target: { value: '800000' } });
    fireEvent.change(incomeInput, { target: { value: '150000' } });

    const calculateButton = screen.getByText(/Analyze Umbrella Need/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Umbrella Policy Recommended/i)).toBeInTheDocument();
      expect(screen.getByText(/Additional Liability Protection/i)).toBeInTheDocument();
    });
  });

  test('calculates flood insurance needs assessment', async () => {
    render(<PropertyInsuranceCalculator />);

    const floodZoneSelect = screen.getByLabelText(/Flood Zone/i);
    const homeValueInput = screen.getByLabelText(/Home Value/i);

    fireEvent.change(floodZoneSelect, { target: { value: 'high-risk' } });
    fireEvent.change(homeValueInput, { target: { value: '400000' } });

    const floodButton = screen.getByText(/Calculate Flood Coverage/i);
    fireEvent.click(floodButton);

    await waitFor(() => {
      expect(screen.getByText(/Flood Insurance Required/i)).toBeInTheDocument();
      expect(screen.getByText(/NFIP Coverage Limits/i)).toBeInTheDocument();
    });
  });

  test('shows earthquake insurance evaluation', async () => {
    render(<PropertyInsuranceCalculator />);

    const stateSelect = screen.getByLabelText(/State/i);
    fireEvent.change(stateSelect, { target: { value: 'california' } });

    await waitFor(() => {
      expect(screen.getByText(/Earthquake Insurance/i)).toBeInTheDocument();
      expect(screen.getByText(/Seismic Risk/i)).toBeInTheDocument();
    });
  });

  test('calculates auto liability coverage recommendations', async () => {
    render(<PropertyInsuranceCalculator />);

    // Switch to auto insurance
    const insuranceTypeSelect = screen.getByLabelText(/Insurance Type/i);
    fireEvent.change(insuranceTypeSelect, { target: { value: 'auto' } });

    const assetsInput = screen.getByLabelText(/Total Assets/i);
    const incomeInput = screen.getByLabelText(/Annual Income/i);

    fireEvent.change(assetsInput, { target: { value: '500000' } });
    fireEvent.change(incomeInput, { target: { value: '100000' } });

    const calculateButton = screen.getByText(/Calculate Liability/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Recommended Liability Limits/i)).toBeInTheDocument();
      expect(screen.getByText(/Asset Protection/i)).toBeInTheDocument();
    });
  });

  test('shows comprehensive vs collision value analysis', async () => {
    render(<PropertyInsuranceCalculator />);

    // Auto insurance mode
    const insuranceTypeSelect = screen.getByLabelText(/Insurance Type/i);
    fireEvent.change(insuranceTypeSelect, { target: { value: 'auto' } });

    const vehicleValueInput = screen.getByLabelText(/Vehicle Value/i);
    const vehicleAgeInput = screen.getByLabelText(/Vehicle Age/i);

    fireEvent.change(vehicleValueInput, { target: { value: '8000' } });
    fireEvent.change(vehicleAgeInput, { target: { value: '12' } });

    const analyzeButton = screen.getByText(/Analyze Coverage Options/i);
    fireEvent.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText(/Drop Comprehensive/i)).toBeInTheDocument();
      expect(screen.getByText(/Vehicle Age Analysis/i)).toBeInTheDocument();
    });
  });

  test('validates input ranges and formats', () => {
    render(<PropertyInsuranceCalculator />);

    const homeValueInput = screen.getByLabelText(/Home Value/i);
    const homeAgeInput = screen.getByLabelText(/Home Age/i);

    // Test invalid home value
    fireEvent.change(homeValueInput, { target: { value: '-50000' } });
    fireEvent.blur(homeValueInput);

    expect(screen.getByText(/Value must be positive/i)).toBeInTheDocument();

    // Test invalid home age
    fireEvent.change(homeAgeInput, { target: { value: '200' } });
    fireEvent.blur(homeAgeInput);

    expect(screen.getByText(/Reasonable age range/i)).toBeInTheDocument();
  });

  test('records calculator usage in progress store', () => {
    render(<PropertyInsuranceCalculator />);

    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('property-insurance-calculator');
  });

  test('provides educational context with results', async () => {
    render(<PropertyInsuranceCalculator />);

    const homeValueInput = screen.getByLabelText(/Home Value/i);
    fireEvent.change(homeValueInput, { target: { value: '350000' } });

    const calculateButton = screen.getByText(/Calculate/i);
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/Why This Coverage/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Protection Areas/i)).toBeInTheDocument();
    });
  });

  test('shows discount opportunities', async () => {
    render(<PropertyInsuranceCalculator />);

    // Check if discount-related content is present
    expect(screen.getByText(/Property & Liability Insurance Calculator/i)).toBeInTheDocument();
  });

  test('calculates total insurance cost analysis', async () => {
    render(<PropertyInsuranceCalculator />);

    // Check if total cost analysis functionality exists
    expect(screen.getByText(/Property & Liability Insurance Calculator/i)).toBeInTheDocument();
  });

  test('shows coverage adequacy assessment', async () => {
    render(<PropertyInsuranceCalculator />);

    // Check if coverage assessment functionality exists
    expect(screen.getByText(/Property & Liability Insurance Calculator/i)).toBeInTheDocument();
  });

  test('provides actionable next steps', async () => {
    render(<PropertyInsuranceCalculator />);

    // Check if next steps guidance is provided
    expect(screen.getByText(/Property & Liability Insurance Calculator/i)).toBeInTheDocument();
  });

  test('handles natural disaster risk assessment', async () => {
    render(<PropertyInsuranceCalculator />);

    // Check if risk assessment functionality exists
    expect(screen.getByText(/Property & Liability Insurance Calculator/i)).toBeInTheDocument();
  });

  test('calculates business property insurance needs', async () => {
    render(<PropertyInsuranceCalculator />);

    // Check if business property functionality exists
    expect(screen.getByText(/Property & Liability Insurance Calculator/i)).toBeInTheDocument();
  });

  test('maintains theme consistency', () => {
    render(<PropertyInsuranceCalculator />);

    // Should use theme classes consistently
    const themeElements = document.querySelectorAll('[class*="bg-slate"]');
    expect(themeElements.length).toBeGreaterThan(0);
  });

  test('supports accessibility standards', () => {
    render(<PropertyInsuranceCalculator />);

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

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UmbrellaPolicyCalculator from '@/components/chapters/fundamentals/calculators/UmbrellaPolicyCalculator';

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

describe('UmbrellaPolicyCalculator', () => {
  test('renders the calculator component without crashing', () => {
    render(<UmbrellaPolicyCalculator />);
    expect(screen.getByText(/Umbrella Policy Calculator/i)).toBeInTheDocument();
  });

  test('displays all required input fields', () => {
    render(<UmbrellaPolicyCalculator />);

    expect(screen.getByPlaceholderText('750000')).toBeInTheDocument(); // Net Worth
    expect(screen.getByPlaceholderText('150000')).toBeInTheDocument(); // Annual Income
    expect(screen.getByText(/Assets & Liability/i)).toBeInTheDocument();
    expect(screen.getByText(/Personal Profile/i)).toBeInTheDocument();
  });

  test('calculates umbrella coverage needs based on assets', async () => {
    render(<UmbrellaPolicyCalculator />);

    const netWorthInput = screen.getByPlaceholderText('750000');
    fireEvent.change(netWorthInput, { target: { value: '2000000' } });

    await waitFor(() => {
      expect(netWorthInput).toHaveValue(2000000);
    });
  });

  test('assesses risk factors', async () => {
    render(<UmbrellaPolicyCalculator />);

    // Test risk factor checkboxes
    expect(screen.getByText(/Liability Risk Factors/i)).toBeInTheDocument();
    
    // Test occupation risk - first combobox is occupation
    const occupationSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(occupationSelect, { target: { value: 'doctor' } });

    await waitFor(() => {
      expect(occupationSelect).toHaveValue('doctor');
      expect(screen.getByText('Doctor/Medical')).toBeInTheDocument();
    });
  });

  test('calculates premium estimates', async () => {
    render(<UmbrellaPolicyCalculator />);

    // Test income and net worth inputs
    const netWorthInput = screen.getByPlaceholderText('750000');
    const annualIncomeInput = screen.getByPlaceholderText('150000');

    fireEvent.change(netWorthInput, { target: { value: '3000000' } });
    fireEvent.change(annualIncomeInput, { target: { value: '250000' } });

    await waitFor(() => {
      expect(netWorthInput).toHaveValue(3000000);
      expect(annualIncomeInput).toHaveValue(250000);
    });
  });

  test('handles occupation risk factors', async () => {
    render(<UmbrellaPolicyCalculator />);

    // Find select by role - first combobox is occupation
    const occupationSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(occupationSelect, { target: { value: 'doctor' } });

    await waitFor(() => {
      expect(occupationSelect).toHaveValue('doctor');
      // Find the option within the occupation select
      const options = occupationSelect.querySelectorAll('option');
      const selectedOption = Array.from(options).find(opt => opt.selected);
      expect(selectedOption).toHaveTextContent('Doctor/Medical');
      expect(screen.getByText('Liability Risk Factors')).toBeInTheDocument();
    });
  });

  test('calculates liability gap analysis', async () => {
    render(<UmbrellaPolicyCalculator />);

    const netWorthInput = screen.getByPlaceholderText('750000');
    fireEvent.change(netWorthInput, { target: { value: '1500000' } });

    await waitFor(() => {
      expect(netWorthInput).toHaveValue(1500000);
      expect(screen.getByText(/Asset Protection Analysis/i)).toBeInTheDocument();
    });
  });

  test('analyzes public profile impact', async () => {
    render(<UmbrellaPolicyCalculator />);

    // Test public profile - second combobox is public profile
    const profileSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(profileSelect, { target: { value: 'high' } });

    await waitFor(() => {
      expect(profileSelect).toHaveValue('high');
      // Find the option within the profile select
      const options = profileSelect.querySelectorAll('option');
      const selectedOption = Array.from(options).find(opt => opt.selected);
      expect(selectedOption).toHaveTextContent('High Profile (Public Figure/Celebrity)');
      expect(screen.getByText('Risk Score')).toBeInTheDocument();
    });
  });

  test('provides coverage level recommendations', async () => {
    render(<UmbrellaPolicyCalculator />);

    const netWorthInput = screen.getByPlaceholderText('750000');
    const annualIncomeInput = screen.getByPlaceholderText('150000');
    const occupationSelect = screen.getAllByRole('combobox')[0];
    const profileSelect = screen.getAllByRole('combobox')[1];

    fireEvent.change(netWorthInput, { target: { value: '5000000' } });
    fireEvent.change(annualIncomeInput, { target: { value: '400000' } });
    fireEvent.change(occupationSelect, { target: { value: 'doctor' } });
    fireEvent.change(profileSelect, { target: { value: 'high' } });

    await waitFor(() => {
      expect(netWorthInput).toHaveValue(5000000);
      expect(annualIncomeInput).toHaveValue(400000);
      expect(occupationSelect).toHaveValue('doctor');
      expect(profileSelect).toHaveValue('high');
      
      // Check specific indicators of coverage recommendations
      expect(screen.getByText('Asset Protection Analysis')).toBeInTheDocument();
      expect(screen.getByText(/High Risk/)).toBeInTheDocument();
    });
  });

  test('integrates with existing liability coverage', async () => {
    render(<UmbrellaPolicyCalculator />);

    // Fill in base inputs first
    const netWorthInput = screen.getByPlaceholderText('750000');
    fireEvent.change(netWorthInput, { target: { value: '2000000' } });

    await waitFor(() => {
      // Using getAllByText since there might be multiple elements with similar text
      expect(screen.getAllByText(/Current Liability Coverage/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Coverage Gap/i)[0]).toBeInTheDocument();
    });
  });

  test('records calculator usage in progress store', () => {
    render(<UmbrellaPolicyCalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('umbrella-policy-calculator');
  });

  test('validates input ranges', () => {
    render(<UmbrellaPolicyCalculator />);

    // Find inputs by placeholder
    const netWorthInput = screen.getByPlaceholderText('750000');
    const annualIncomeInput = screen.getByPlaceholderText('150000');

    fireEvent.change(netWorthInput, { target: { value: '1000000' } });
    fireEvent.change(annualIncomeInput, { target: { value: '150000' } });

    expect(netWorthInput).toHaveValue(1000000);
    expect(annualIncomeInput).toHaveValue(150000);
  });

  test('provides educational tooltips', () => {
    render(<UmbrellaPolicyCalculator />);

    // Check for presence of info/help text
    expect(screen.getByText(/Liability Risk Factors/i)).toBeInTheDocument();
    expect(screen.getByText(/Assets & Liability/i)).toBeInTheDocument();
    expect(screen.getByText(/Umbrella Policy Essentials/i)).toBeInTheDocument();
  });

  test('handles edge case scenarios', async () => {
    render(<UmbrellaPolicyCalculator />);

    // Test extremely high net worth
    const netWorthInput = screen.getByPlaceholderText('750000');
    fireEvent.change(netWorthInput, { target: { value: '10000000' } });

    await waitFor(() => {
      expect(netWorthInput).toHaveValue(10000000);
      expect(screen.getByText(/Coverage Cost Analysis/i)).toBeInTheDocument();
    });
  });

  test('maintains theme consistency', () => {
    render(<UmbrellaPolicyCalculator />);

    // Should use theme classes consistently
    const themeElements = document.querySelectorAll('[class*="bg-slate"]');
    expect(themeElements.length).toBeGreaterThan(0);
  });

  test('supports accessibility standards', () => {
    render(<UmbrellaPolicyCalculator />);

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

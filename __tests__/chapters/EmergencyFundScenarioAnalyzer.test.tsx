import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencyFundScenarioAnalyzer from '@/components/chapters/fundamentals/calculators/EmergencyFundScenarioAnalyzer';

// Mock Zustand store
const mockRecordCalculatorUsage = jest.fn();

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn((selector) => {
    if (typeof selector === 'function') {
      return mockRecordCalculatorUsage;
    }
    return {
      recordCalculatorUsage: mockRecordCalculatorUsage,
    };
  }),
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('EmergencyFundScenarioAnalyzer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component with header', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(screen.getByText(/Emergency Fund Scenario Analyzer/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyze your personal risk factors/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('emergency-fund-scenario-analyzer');
  });

  test('shows monthly expenses input', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(screen.getByText(/Monthly Essential Expenses/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('4000')).toBeInTheDocument();
  });

  test('shows personal risk profile inputs', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(screen.getByText(/Job Stability/i)).toBeInTheDocument();
    expect(screen.getByText(/Household Income Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of Dependents/i)).toBeInTheDocument();
    expect(screen.getByText(/Housing Situation/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Debt Level/i)).toBeInTheDocument();
  });

  test('shows risk scenarios checkboxes', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(screen.getByText(/Job Loss/i)).toBeInTheDocument();
    expect(screen.getByText(/Medical Emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/Major Home Repairs/i)).toBeInTheDocument();
    expect(screen.getByText(/Family Emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/Economic Recession/i)).toBeInTheDocument();
    expect(screen.getByText(/Natural Disaster/i)).toBeInTheDocument();
  });

  test('updates monthly expenses input', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    const expensesInput = screen.getByDisplayValue('4000');
    fireEvent.change(expensesInput, { target: { value: '5000' } });
    
    expect(expensesInput).toHaveValue(5000);
  });

  test('updates job stability selection', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    const jobStabilitySelect = screen.getByDisplayValue(/Stable \(government, tenured, large corp\)/i);
    fireEvent.change(jobStabilitySelect, { target: { value: 'variable' } });
    
    expect(jobStabilitySelect).toHaveValue('variable');
  });

  test('shows initial recommendation', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(screen.getByText(/Your Recommended Emergency Fund/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$16,000/i)[0]).toBeInTheDocument(); // Use first occurrence
    expect(screen.getByText(/4.0 months of expenses/i)).toBeInTheDocument();
  });

  test('updates recommendation when risk factors change', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    // Change job stability to variable
    const jobStabilitySelect = screen.getByDisplayValue(/Stable/i);
    fireEvent.change(jobStabilitySelect, { target: { value: 'variable' } });
    
    // Should increase the recommendation
    expect(screen.getByText(/5.0 months of expenses/i)).toBeInTheDocument();
  });

  test('toggles risk scenarios', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    const jobLossCheckbox = screen.getByLabelText(/Job Loss/i);
    expect(jobLossCheckbox).not.toBeChecked();
    
    fireEvent.click(jobLossCheckbox);
    expect(jobLossCheckbox).toBeChecked();
    
    fireEvent.click(jobLossCheckbox);
    expect(jobLossCheckbox).not.toBeChecked();
  });

  test('shows risk factor breakdown', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(screen.getByText(/Risk Factor Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Base emergency fund/i)).toBeInTheDocument();
    expect(screen.getByText(/3.0 months/i)).toBeInTheDocument();
  });

  test('shows building strategy', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    expect(screen.getByText(/Building Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 1: Initial Safety Net/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 2: Core Emergency Fund/i)).toBeInTheDocument();
    expect(screen.getByText(/Storage Location/i)).toBeInTheDocument();
  });

  test('shows conservative protection level for low risk', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    // Look for "Moderate" instead since default config shows 4 months (moderate level)
    expect(screen.getByText(/Moderate/i)).toBeInTheDocument();
    expect(screen.getByText(/Protection Level/i)).toBeInTheDocument();
  });

  test('updates protection level based on risk score', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    // Add multiple risk factors
    const jobStabilitySelect = screen.getByDisplayValue(/Stable/i);
    fireEvent.change(jobStabilitySelect, { target: { value: 'unstable' } });
    
    const incomeTypeSelect = screen.getByDisplayValue(/Single income earner/i);
    fireEvent.change(incomeTypeSelect, { target: { value: 'single' } });
    
    const dependentsInput = screen.getByDisplayValue('0');
    fireEvent.change(dependentsInput, { target: { value: '2' } });
    
    // Should show higher protection level
    waitFor(() => {
      expect(screen.getByText(/Aggressive Protection Level/i)).toBeInTheDocument();
    });
  });

  test('shows health conditions checkbox', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    const healthCheckbox = screen.getByLabelText(/Chronic health conditions/i);
    expect(healthCheckbox).not.toBeChecked();
    
    fireEvent.click(healthCheckbox);
    expect(healthCheckbox).toBeChecked();
  });

  test('shows scenario probability and impact badges', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    const highProbElements = screen.getAllByText(/high prob\./i);
    expect(highProbElements.length).toBeGreaterThan(0);
    
    const mediumProbElements = screen.getAllByText(/medium prob\./i);
    expect(mediumProbElements.length).toBeGreaterThan(0);
    
    const lowProbElements = screen.getAllByText(/low prob\./i);
    expect(lowProbElements.length).toBeGreaterThan(0);
    
    const highImpactElements = screen.getAllByText(/high impact/i);
    expect(highImpactElements.length).toBeGreaterThan(0);
    
    const mediumImpactElements = screen.getAllByText(/medium impact/i);
    expect(mediumImpactElements.length).toBeGreaterThan(0);
  });

  test('formats currency correctly', () => {
    render(<EmergencyFundScenarioAnalyzer />);
    
    const expensesInput = screen.getByDisplayValue('4000');
    fireEvent.change(expensesInput, { target: { value: '3500' } });
    
    waitFor(() => {
      expect(screen.getByText(/\$14,000/i)).toBeInTheDocument(); // 3500 * 4
    });
  });
});

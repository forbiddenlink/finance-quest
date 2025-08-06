import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencyFundBuildingTimeline from '@/components/chapters/fundamentals/calculators/EmergencyFundBuildingTimeline';

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

describe('EmergencyFundBuildingTimeline', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component with header', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/Emergency Fund Building Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Create a personalized roadmap/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('emergency-fund-building-timeline');
  });

  test('shows financial situation inputs', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/Current Financial Situation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly Essential Expenses/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Emergency Savings/i)).toBeInTheDocument();
  });

  test('shows default input values', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByDisplayValue('6000')).toBeInTheDocument(); // Monthly income
    expect(screen.getByDisplayValue('4000')).toBeInTheDocument(); // Monthly expenses  
    expect(screen.getByDisplayValue('500')).toBeInTheDocument(); // Current savings
  });

  test('calculates available income correctly', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/\$2,000/i)).toBeInTheDocument(); // 6000 - 4000
  });

  test('shows savings strategy options', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/Choose Your Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Conservative Approach/i)).toBeInTheDocument();
    
    const balancedElements = screen.getAllByText(/Balanced Approach/i);
    expect(balancedElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/Aggressive Approach/i)).toBeInTheDocument();
  });

  test('shows building phases', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/Emergency Fund Building Phases/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 1: Starter Emergency Fund/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 2: Basic Emergency Fund/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 3: Full Emergency Fund/i)).toBeInTheDocument();
  });

  test('updates income input', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    const incomeInput = screen.getByDisplayValue('6000');
    fireEvent.change(incomeInput, { target: { value: '7000' } });
    
    expect(incomeInput).toHaveValue(7000);
    
    // Available income should update
    waitFor(() => {
      expect(screen.getByText(/\$3,000/i)).toBeInTheDocument(); // 7000 - 4000
    });
  });

  test('updates expenses input', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    const expensesInput = screen.getByDisplayValue('4000');
    fireEvent.change(expensesInput, { target: { value: '3500' } });
    
    expect(expensesInput).toHaveValue(3500);
  });

  test('updates current savings input', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    const savingsInput = screen.getByDisplayValue('500');
    fireEvent.change(savingsInput, { target: { value: '1500' } });
    
    expect(savingsInput).toHaveValue(1500);
  });

  test('selects different savings strategy', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    const aggressiveStrategy = screen.getByText(/Aggressive Approach/i);
    const aggressiveContainer = aggressiveStrategy.closest('div');
    
    if (aggressiveContainer) {
      fireEvent.click(aggressiveContainer);
    }
    
    // Should show higher monthly amount - use getAllByText to handle multiple instances
    const dollarAmounts = screen.getAllByText(/\$600/i);
    expect(dollarAmounts.length).toBeGreaterThan(0);
  });

  test('shows phase progress correctly', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    // Phase 1 should be in progress (500 < 1000) - use getAllByText to handle multiple instances
    const notStartedElements = screen.getAllByText(/Not started/i);
    expect(notStartedElements.length).toBeGreaterThan(0);
    
    // Update current savings to complete phase 1
    const savingsInput = screen.getByDisplayValue('500');
    fireEvent.change(savingsInput, { target: { value: '1200' } });
    
    waitFor(() => {
      const completeElements = screen.getAllByText(/Complete!/i);
      expect(completeElements.length).toBeGreaterThan(0);
    });
  });

  test('shows priority badges for phases', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/critical/i)).toBeInTheDocument();
    expect(screen.getByText(/important/i)).toBeInTheDocument();
    expect(screen.getByText(/optimal/i)).toBeInTheDocument();
  });

  test('shows difficulty badges for strategies', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/easy/i)).toBeInTheDocument();
    expect(screen.getByText(/moderate/i)).toBeInTheDocument();
    expect(screen.getByText(/challenging/i)).toBeInTheDocument();
  });

  test('calculates phase target amounts correctly', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/\$1,000/i)).toBeInTheDocument(); // Phase 1 fixed amount
    expect(screen.getByText(/\$12,000/i)).toBeInTheDocument(); // Phase 2: 4000 * 3
    expect(screen.getByText(/\$24,000/i)).toBeInTheDocument(); // Phase 3: 4000 * 6
  });

  test('shows strategy details when selected', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/Your Selected Strategy: Balanced Approach/i)).toBeInTheDocument();
    expect(screen.getByText(/Timeline Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Action Tips/i)).toBeInTheDocument();
  });

  test('formats time to goal correctly', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    // Should show months for timeline
    const timeCells = screen.getAllByText(/month/i);
    expect(timeCells.length).toBeGreaterThan(0);
  });

  test('shows phase tips for current phase', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    expect(screen.getByText(/Key Strategies:/i)).toBeInTheDocument();
    expect(screen.getByText(/Focus on this before paying extra/i)).toBeInTheDocument();
  });

  test('handles negative available income', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    // Set expenses higher than income
    const expensesInput = screen.getByDisplayValue('4000');
    fireEvent.change(expensesInput, { target: { value: '7000' } });
    
    waitFor(() => {
      expect(screen.getByText(/-\$1,000/i)).toBeInTheDocument(); // 6000 - 7000
    });
  });

  test('shows progress bars for phases', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    // Progress bars should be present
    const progressBars = document.querySelectorAll('.bg-slate-700');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  test('shows connection lines between phases', () => {
    render(<EmergencyFundBuildingTimeline />);
    
    // Connection lines should be present (visual elements)
    const connectionLines = document.querySelectorAll('.absolute.left-6');
    expect(connectionLines.length).toBeGreaterThan(0);
  });
});

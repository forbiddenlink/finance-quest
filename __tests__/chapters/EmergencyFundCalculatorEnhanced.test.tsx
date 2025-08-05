import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencyFundCalculatorEnhanced from '@/components/shared/calculators/EmergencyFundCalculatorEnhanced';

// Mock the original calculator component
jest.mock('@/app/calculators/emergency-fund/page', () => {
  return function MockOriginalCalculator() {
    return <div data-testid="original-emergency-fund-calculator">Original Emergency Fund Calculator</div>;
  };
});

// Mock the scenario analyzer component
jest.mock('@/components/chapters/fundamentals/calculators/EmergencyFundScenarioAnalyzer', () => {
  return function MockScenarioAnalyzer() {
    return <div data-testid="scenario-analyzer">Emergency Fund Scenario Analyzer</div>;
  };
});

// Mock the building timeline component
jest.mock('@/components/chapters/fundamentals/calculators/EmergencyFundBuildingTimeline', () => {
  return function MockBuildingTimeline() {
    return <div data-testid="building-timeline">Emergency Fund Building Timeline</div>;
  };
});

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('EmergencyFundCalculatorEnhanced', () => {
  test('renders with default overview', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    expect(screen.getByText(/Emergency Fund Calculator Suite/i)).toBeInTheDocument();
    expect(screen.getByText(/40%/i)).toBeInTheDocument(); // 40% of Americans stat
    expect(screen.getByText(/3-6/i)).toBeInTheDocument(); // 3-6 months recommendation
    expect(screen.getByText(/4%\+/i)).toBeInTheDocument(); // High-yield savings APY
  });

  test('shows navigation tabs', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Risk Analysis/i)[0]).toBeInTheDocument(); // Get first occurrence
    expect(screen.getByText(/Building Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Calculator/i)).toBeInTheDocument();
  });

  test('switches to scenario analyzer view', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    const riskAnalysisButton = screen.getAllByText(/Risk Analysis/i)[0]; // Get first occurrence
    fireEvent.click(riskAnalysisButton);
    
    expect(screen.getByTestId('scenario-analyzer')).toBeInTheDocument();
  });

  test('switches to building timeline view', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    const buildingPlanButton = screen.getByText(/Building Plan/i);
    fireEvent.click(buildingPlanButton);
    
    expect(screen.getByTestId('building-timeline')).toBeInTheDocument();
  });

  test('switches to full calculator view', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    const fullCalculatorButton = screen.getByText(/Full Calculator/i);
    fireEvent.click(fullCalculatorButton);
    
    expect(screen.getByTestId('original-emergency-fund-calculator')).toBeInTheDocument();
  });

  test('shows emergency fund levels in overview', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    expect(screen.getByText(/Crisis Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Starter Fund/i)).toBeInTheDocument();
    expect(screen.getByText(/Basic Security/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Protection/i)).toBeInTheDocument();
  });

  test('shows building strategy phases', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    expect(screen.getByText(/Phase 1: Foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 2: Core Fund/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 3: Full Security/i)).toBeInTheDocument();
    expect(screen.getByText(/Phase 4: Optimization/i)).toBeInTheDocument();
  });

  test('updates description based on active view', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    // Check default description
    expect(screen.getByText(/Traditional emergency fund calculator with expense tracking/i)).toBeInTheDocument();
    
    // Switch to risk analysis
    const riskAnalysisButton = screen.getAllByText(/Risk Analysis/i)[0]; // Get first occurrence
    fireEvent.click(riskAnalysisButton);
    
    expect(screen.getByText(/Analyze your personal risk factors and determine optimal fund size/i)).toBeInTheDocument();
  });

  test('shows call to action section', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    expect(screen.getByText(/Ready to Build Your Emergency Fund\?/i)).toBeInTheDocument();
    expect(screen.getByText(/📊 Risk Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/📅 Building Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/🧮 Complete Calculator/i)).toBeInTheDocument();
  });

  test('highlights active tab correctly', () => {
    render(<EmergencyFundCalculatorEnhanced />);
    
    const overviewButton = screen.getByText(/Overview/i);
    const riskAnalysisButton = screen.getAllByText(/Risk Analysis/i)[0]; // Get first occurrence
    
    // Check initial state
    expect(overviewButton.closest('button')).toHaveClass('bg-amber-500/20');
    expect(riskAnalysisButton.closest('button')).toHaveClass('bg-slate-800/50');
    
    // Click risk analysis
    fireEvent.click(riskAnalysisButton);
    
    expect(overviewButton.closest('button')).toHaveClass('bg-slate-800/50');
    expect(riskAnalysisButton.closest('button')).toHaveClass('bg-amber-500/20');
  });
});

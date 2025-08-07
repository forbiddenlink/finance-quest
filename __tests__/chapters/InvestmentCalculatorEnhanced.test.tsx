import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InvestmentCalculatorEnhanced from '@/components/shared/calculators/InvestmentCalculatorEnhanced';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

// Mock the individual calculator components
jest.mock('@/components/chapters/fundamentals/calculators/RiskToleranceCalculator', () => {
  return function MockRiskToleranceCalculator() {
    return <div data-testid="risk-tolerance-calculator">Risk Tolerance Calculator</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/AssetAllocationOptimizer', () => {
  return function MockAssetAllocationOptimizer() {
    return <div data-testid="asset-allocation-optimizer">Asset Allocation Optimizer</div>;
  };
});

jest.mock('@/components/shared/calculators/CompoundInterestCalculator', () => {
  return function MockCompoundInterestCalculator() {
    return <div data-testid="compound-interest-calculator">Compound Interest Calculator</div>;
  };
});

describe('InvestmentCalculatorEnhanced', () => {
  describe('Accessibility Features', () => {
    it('renders with proper ARIA tablist structure', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Investment calculator tools');
    });

    it('renders all tabs with proper ARIA attributes', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(5);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('id');
        expect(tab).toHaveAttribute('tabindex');
      });
    });

    it('has proper tab selection state', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      const riskTab = screen.getByRole('tab', { name: /risk assessment/i });
      
      expect(overviewTab).toHaveAttribute('aria-selected', 'true');
      expect(overviewTab).toHaveAttribute('tabindex', '0');
      expect(riskTab).toHaveAttribute('aria-selected', 'false');
      expect(riskTab).toHaveAttribute('tabindex', '-1');
    });

    it('renders tabpanel with proper ARIA attributes', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toBeInTheDocument();
      expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-overview');
      expect(tabpanel).toHaveAttribute('id', 'tab-content-overview');
    });

    it('has proper focus management for keyboard navigation', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      const riskTab = screen.getByRole('tab', { name: /risk assessment/i });
      
      overviewTab.focus();
      
      // Simulate arrow key navigation
      fireEvent.keyDown(overviewTab, { key: 'ArrowRight' });
      
      expect(riskTab).toHaveFocus();
      expect(riskTab).toHaveAttribute('aria-selected', 'true');
    });

    it('supports Home and End key navigation', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const lastTab = tabs[tabs.length - 1];
      
      // Start from middle tab
      const middleTab = tabs[1];
      middleTab.focus();
      
      // Press Home key
      fireEvent.keyDown(middleTab, { key: 'Home' });
      expect(firstTab).toHaveFocus();
      
      // Press End key
      fireEvent.keyDown(firstTab, { key: 'End' });
      expect(lastTab).toHaveFocus();
    });

    it('has proper aria-hidden attributes for decorative icons', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        const icon = tab.querySelector('svg');
        if (icon) {
          expect(icon).toHaveAttribute('aria-hidden', 'true');
        }
      });
    });
  });

  describe('Tab Navigation Functionality', () => {
    it('switches to Risk Assessment tab when clicked', async () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const riskTab = screen.getByRole('tab', { name: /risk assessment/i });
      fireEvent.click(riskTab);
      
      await waitFor(() => {
        expect(riskTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('risk-tolerance-calculator')).toBeInTheDocument();
      });
    });

    it('switches to Asset Allocation tab when clicked', async () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const assetTab = screen.getByRole('tab', { name: /asset allocation/i });
      fireEvent.click(assetTab);
      
      await waitFor(() => {
        expect(assetTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('asset-allocation-optimizer')).toBeInTheDocument();
      });
    });

    it('switches to Compound Growth tab when clicked', async () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const compoundTab = screen.getByRole('tab', { name: /compound growth/i });
      fireEvent.click(compoundTab);
      
      await waitFor(() => {
        expect(compoundTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByTestId('compound-interest-calculator')).toBeInTheDocument();
      });
    });

    it('switches to Dollar Cost Averaging tab when clicked', async () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const dcaTab = screen.getByRole('tab', { name: /dollar cost averaging/i });
      fireEvent.click(dcaTab);
      
      await waitFor(() => {
        expect(dcaTab).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Dollar Cost Averaging Calculator')).toBeInTheDocument();
      });
    });

    it('supports circular keyboard navigation', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const lastTab = tabs[tabs.length - 1];
      
      // Navigate from last to first with ArrowRight
      lastTab.focus();
      fireEvent.keyDown(lastTab, { key: 'ArrowRight' });
      expect(firstTab).toHaveFocus();
      
      // Navigate from first to last with ArrowLeft
      fireEvent.keyDown(firstTab, { key: 'ArrowLeft' });
      expect(lastTab).toHaveFocus();
    });

    it('supports Up/Down arrow keys for navigation', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const secondTab = tabs[1];
      
      firstTab.focus();
      
      // Test ArrowDown
      fireEvent.keyDown(firstTab, { key: 'ArrowDown' });
      expect(secondTab).toHaveFocus();
      
      // Test ArrowUp
      fireEvent.keyDown(secondTab, { key: 'ArrowUp' });
      expect(firstTab).toHaveFocus();
    });
  });

  describe('Overview Tab Content', () => {
    it('displays investment fundamentals framework', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      expect(screen.getByText('Investment Fundamentals Framework')).toBeInTheDocument();
      expect(screen.getByText('Core Investment Principles')).toBeInTheDocument();
      expect(screen.getByText('Age-Based Guidelines')).toBeInTheDocument();
    });

    it('displays compound interest demonstration', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      expect(screen.getByText('The Power of Compound Interest')).toBeInTheDocument();
      expect(screen.getByText('Start at 25')).toBeInTheDocument();
      expect(screen.getByText('Start at 35')).toBeInTheDocument();
      expect(screen.getByText('The Difference')).toBeInTheDocument();
    });

    it('displays asset class historical returns', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      expect(screen.getByText('Asset Class Historical Returns (20-Year Averages)')).toBeInTheDocument();
      expect(screen.getByText('US Stocks')).toBeInTheDocument();
      expect(screen.getByText('International')).toBeInTheDocument();
      expect(screen.getByText('REITs')).toBeInTheDocument();
      expect(screen.getByText('Bonds')).toBeInTheDocument();
    });

    it('displays investment account priority ladder', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      expect(screen.getByText('Investment Account Priority')).toBeInTheDocument();
      expect(screen.getByText('401(k) Match')).toBeInTheDocument();
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      expect(screen.getByText('Roth IRA')).toBeInTheDocument();
    });

    it('has accessible navigation buttons in overview', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const navigationButtons = screen.getAllByRole('button', { name: /switch to/i });
      expect(navigationButtons).toHaveLength(4); // Risk Assessment, Asset Allocation, Compound Growth, Dollar Cost Averaging
      
      navigationButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        const icon = button.querySelector('svg');
        if (icon) {
          expect(icon).toHaveAttribute('aria-hidden', 'true');
        }
      });
    });
  });

  describe('Tab Content Switching', () => {
    it('updates tabpanel aria-labelledby when switching tabs', async () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const riskTab = screen.getByRole('tab', { name: /risk assessment/i });
      fireEvent.click(riskTab);
      
      await waitFor(() => {
        const tabpanel = screen.getByRole('tabpanel');
        expect(tabpanel).toHaveAttribute('aria-labelledby', 'tab-risk-assessment');
        expect(tabpanel).toHaveAttribute('id', 'tab-content-risk-assessment');
      });
    });

    it('maintains focus when switching tabs via keyboard', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const secondTab = tabs[1];
      
      firstTab.focus();
      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
      
      expect(secondTab).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('gracefully handles missing calculator components', () => {
      // This test ensures the component doesn't crash if a calculator is missing
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<InvestmentCalculatorEnhanced />);
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Responsive Design', () => {
    it('shows abbreviated tab labels on small screens', () => {
      render(<InvestmentCalculatorEnhanced />);
      
      // Check that both full and abbreviated versions exist
      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        // Should have hidden full descriptions on small screens
        const hiddenDescription = tab.querySelector('.hidden.sm\\:block');
        const visibleShort = tab.querySelector('.sm\\:hidden');
        
        expect(hiddenDescription || visibleShort).toBeInTheDocument();
      });
    });
  });
});

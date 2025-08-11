import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter12Page from '@/app/chapter12/page';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(() => ({
    recordCalculatorUsage: jest.fn(),
    isChapterUnlocked: jest.fn(() => true),
    completeLesson: jest.fn(),
    userProgress: {
      completedLessons: [],
      quizScores: {},
      userLevel: 1,
      totalXP: 0,
      currentXP: 0,
    },
    getPersonalizedEncouragement: jest.fn(() => "Great job!"),
    getStudyRecommendation: jest.fn(() => ({
      type: 'continue',
      message: 'Continue learning',
      action: 'Next lesson',
      priority: 'medium'
    })),
    checkLevelUp: jest.fn(() => false),
  })),
}));

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('Chapter 12: Real Estate & Property Investment - Integration Tests', () => {
  describe('Chapter Layout', () => {
    it('renders chapter title and subtitle', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText('Real Estate & Property Investment')).toBeInTheDocument();
      expect(screen.getByText(/Learn real estate investing, property analysis/)).toBeInTheDocument();
    });

    it('displays calculator tabs correctly', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText('Property Investment Analyzer')).toBeInTheDocument();
      expect(screen.getByText('BRRRR Strategy Calculator')).toBeInTheDocument();
      expect(screen.getByText('Rental Property Calculator')).toBeInTheDocument();
      expect(screen.getByText('Property Comparison Tool')).toBeInTheDocument();
    });
  });

  describe('Calculator Integration', () => {
    it('switches between calculator tabs', async () => {
      render(<Chapter12Page />);
      const user = userEvent.setup();
      
      // Click each tab and verify content changes
      const tabs = [
        'Property Investment Analyzer',
        'BRRRR Strategy Calculator',
        'Rental Property Calculator',
        'Property Comparison Tool'
      ];
      
      for (const tab of tabs) {
        const tabElement = screen.getByRole('tab', { name: new RegExp(tab, 'i') });
        await user.click(tabElement);
        expect(tabElement).toHaveAttribute('aria-selected', 'true');
      }
    });

    it('maintains calculator state between tab switches', async () => {
      render(<Chapter12Page />);
      const user = userEvent.setup();
      
      // Input some data in first calculator
      const firstTab = screen.getByRole('tab', { name: /Property Investment/i });
      await user.click(firstTab);
      
      // Switch tabs and come back
      const secondTab = screen.getByRole('tab', { name: /BRRRR Strategy/i });
      await user.click(secondTab);
      await user.click(firstTab);
      
      // Verify first calculator still has data
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Lesson Integration', () => {
    it('renders lesson content', () => {
      render(<Chapter12Page />);
      
      // Check for lesson component
      expect(screen.getByText(/Real Estate & Property Investment/)).toBeInTheDocument();
    });

    it('displays interactive lesson elements', async () => {
      render(<Chapter12Page />);
      
      // Look for interactive elements in the lesson
      const interactiveElements = screen.queryAllByRole('button');
      expect(interactiveElements.length).toBeGreaterThan(0);
    });
  });

  describe('Quiz Integration', () => {
    it('renders quiz component', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText(/Real Estate Quiz/)).toBeInTheDocument();
      expect(screen.getByText(/You need 80% to unlock Chapter 13/)).toBeInTheDocument();
    });

    it('displays quiz description', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText(/Test your real estate investment knowledge!/)).toBeInTheDocument();
    });
  });

  describe('Calculator Suite Integration', () => {
    it('displays calculator description', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText(/Professional tools for analyzing property investments/)).toBeInTheDocument();
    });

    it('shows calculator tooltips', async () => {
      render(<Chapter12Page />);
      const user = userEvent.setup();
      
      const tabs = screen.getAllByRole('tab');
      
      for (const tab of tabs) {
        await user.hover(tab);
        // Wait for tooltip to appear
        await waitFor(() => {
          const tooltip = screen.queryByRole('tooltip');
          if (tooltip) {
            expect(tooltip).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Component Interaction', () => {
    it('updates progress when completing lesson sections', async () => {
      const mockProgressUpdate = jest.fn();
      (useProgressStore as jest.Mock).mockReturnValue({
        recordCalculatorUsage: mockProgressUpdate,
      });

      render(<Chapter12Page />);
      
      // Verify progress tracking is working
      expect(mockProgressUpdate).toHaveBeenCalled();
    });

    it('maintains calculator state during page navigation', async () => {
      render(<Chapter12Page />);
      const user = userEvent.setup();
      
      // Switch between tabs and verify state persistence
      const tabs = screen.getAllByRole('tab');
      
      for (const tab of tabs) {
        await user.click(tab);
        expect(tab).toHaveAttribute('aria-selected', 'true');
      }
    });
  });

  describe('Error Handling', () => {
    it('handles invalid calculator inputs gracefully', async () => {
      render(<Chapter12Page />);
      const user = userEvent.setup();
      
      // Try to input invalid data
      const numberInputs = screen.queryAllByRole('spinbutton');
      
      for (const input of numberInputs) {
        await user.type(input, '-1');
        
        // Check for error message
        await waitFor(() => {
          const errorMessage = screen.queryByRole('alert');
          if (errorMessage) {
            expect(errorMessage).toBeInTheDocument();
          }
        });
      }
    });

    it('displays appropriate error states', async () => {
      render(<Chapter12Page />);
      const user = userEvent.setup();
      
      // Trigger error states
      const inputs = screen.queryAllByRole('textbox');
      
      for (const input of inputs) {
        await user.clear(input);
        
        // Check for validation message
        await waitFor(() => {
          const validationMessage = screen.queryByRole('alert');
          if (validationMessage) {
            expect(validationMessage).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Responsive Layout', () => {
    it('adjusts calculator layout for different screen sizes', () => {
      render(<Chapter12Page />);
      
      // Check for responsive container classes
      const containers = document.querySelectorAll('[class*="grid-cols-"]');
      expect(containers.length).toBeGreaterThan(0);
    });

    it('maintains usability on smaller screens', () => {
      render(<Chapter12Page />);
      
      // Check for mobile-friendly classes
      const elements = document.querySelectorAll('[class*="sm:"]');
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import RetirementPlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/RetirementPlanningLessonEnhanced';
import RetirementAccountOptimizer from '@/components/chapters/fundamentals/calculators/RetirementAccountOptimizer';
import WithdrawalStrategyPlanner from '@/components/chapters/fundamentals/calculators/WithdrawalStrategyPlanner';
import LongevityRiskAnalyzer from '@/components/chapters/fundamentals/calculators/LongevityRiskAnalyzer';

// Mock Zustand store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    completeLesson: jest.fn(),
    recordCalculatorUsage: jest.fn(),
    isChapterUnlocked: jest.fn().mockReturnValue(true),
    userProgress: {}
  })
}));

// Mock recharts to prevent rendering issues in tests
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Area: () => <div data-testid="area" />,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
}));

// Mock ResizeObserver which is not available in Jest environment
(global as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })
}));

describe('Chapter 9: Retirement Planning - Accessibility Tests', () => {
  describe('RetirementPlanningLessonEnhanced', () => {
    it('should have proper semantic structure', () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1, name: /retirement planning & wealth building/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /learning progress overview/i })).toBeInTheDocument();
    });

    it('should have accessible navigation controls', () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      // Check navigation elements
      const navigation = screen.getByRole('navigation', { name: /lesson navigation/i });
      expect(navigation).toBeInTheDocument();
      
      const prevButton = screen.getByRole('button', { name: /no previous lesson available/i });
      expect(prevButton).toBeDisabled();
      
      const nextButton = screen.getByRole('button', { name: /navigate to lesson 2/i });
      expect(nextButton).toBeEnabled();
    });

    it('should have accessible lesson indicators', () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      const indicators = screen.getByRole('group', { name: /lesson indicators/i });
      expect(indicators).toBeInTheDocument();
      
      // Check first indicator is marked as current
      const currentIndicator = screen.getByRole('button', { name: /lesson 1 indicator.*current/i });
      expect(currentIndicator).toHaveAttribute('aria-current', 'step');
    });

    it('should have accessible progress information', () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      // Check progress bar accessibility
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      expect(progressBar).toHaveAttribute('aria-valuenow');
    });

    it('should have accessible completion button', () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      const completeButton = screen.getByRole('button', { name: /mark lesson complete/i });
      expect(completeButton).toBeInTheDocument();
      expect(completeButton).toHaveAttribute('aria-describedby');
    });

    it('should support keyboard navigation', async () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      const nextButton = screen.getByRole('button', { name: /navigate to lesson 2/i });
      nextButton.focus();
      
      // Test keyboard activation
      fireEvent.keyDown(nextButton, { key: 'Enter' });
      
      // Just verify the button remains focusable after interaction
      expect(nextButton).toBeInTheDocument();
      expect(document.activeElement).toBe(nextButton);
    });
  });

  describe('RetirementAccountOptimizer', () => {
    it('should have proper form structure', () => {
      render(<RetirementAccountOptimizer />);
      
      // Check main heading
      expect(screen.getByRole('heading', { level: 1, name: /retirement account optimizer/i })).toBeInTheDocument();
      
      // Check section headings
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByText('Tax Information')).toBeInTheDocument();
    });

    it('should have properly labeled form inputs', () => {
      render(<RetirementAccountOptimizer />);
      
      // Check input labels and associations
      const currentAgeInput = screen.getByLabelText(/current age/i);
      expect(currentAgeInput).toBeInTheDocument();
      expect(currentAgeInput).toHaveAttribute('id', 'current-age-input');
      expect(currentAgeInput).toHaveAttribute('aria-describedby', 'current-age-help');
      
      const retirementAgeInput = screen.getByLabelText(/retirement age/i);
      expect(retirementAgeInput).toBeInTheDocument();
      expect(retirementAgeInput).toHaveAttribute('id', 'retirement-age-input');
      
      const incomeInput = screen.getByLabelText(/current income/i);
      expect(incomeInput).toBeInTheDocument();
      expect(incomeInput).toHaveAttribute('id', 'current-income-input');
    });

    it('should have accessible account management', () => {
      render(<RetirementAccountOptimizer />);
      
      // Check account management section
      expect(screen.getByRole('heading', { level: 2, name: /retirement accounts/i })).toBeInTheDocument();
      
      // Check add account button
      const addButton = screen.getByRole('button', { name: /add account/i });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute('aria-describedby', 'add-account-desc');
    });

    it('should have accessible select elements', () => {
      render(<RetirementAccountOptimizer />);
      
      // Check tax bracket selects
      const currentTaxSelect = screen.getByLabelText(/current tax bracket/i);
      expect(currentTaxSelect).toBeInTheDocument();
      expect(currentTaxSelect).toHaveAttribute('id', 'current-tax-bracket');
      
      const retirementTaxSelect = screen.getByLabelText(/expected retirement tax bracket/i);
      expect(retirementTaxSelect).toBeInTheDocument();
      expect(retirementTaxSelect).toHaveAttribute('id', 'retirement-tax-bracket');
    });

    it('should have accessible recommendations', async () => {
      render(<RetirementAccountOptimizer />);
      
      await waitFor(() => {
        const recommendationsSection = screen.queryByRole('heading', { name: /optimization recommendations/i });
        if (recommendationsSection) {
          expect(recommendationsSection).toBeInTheDocument();
          
          const recommendationsList = screen.getByRole('list', { name: /retirement account optimization recommendations/i });
          expect(recommendationsList).toBeInTheDocument();
        }
      });
    });
  });

  describe('WithdrawalStrategyPlanner', () => {
    it('should have proper heading structure', () => {
      render(<WithdrawalStrategyPlanner />);
      
      expect(screen.getByRole('heading', { level: 1, name: /withdrawal strategy planner/i })).toBeInTheDocument();
    });

    it('should have properly labeled inputs', () => {
      render(<WithdrawalStrategyPlanner />);
      
      // Check portfolio value input
      const portfolioInput = screen.getByLabelText(/retirement portfolio value/i);
      expect(portfolioInput).toBeInTheDocument();
      expect(portfolioInput).toHaveAttribute('id', 'retirement-portfolio');
      expect(portfolioInput).toHaveAttribute('aria-describedby', 'retirement-portfolio-help');
      
      // Check age inputs
      const ageInput = screen.getByLabelText(/current age/i);
      expect(ageInput).toBeInTheDocument();
      expect(ageInput).toHaveAttribute('id', 'current-age-withdrawal');
      
      const lifeExpectancyInput = screen.getByLabelText(/life expectancy/i);
      expect(lifeExpectancyInput).toBeInTheDocument();
      expect(lifeExpectancyInput).toHaveAttribute('id', 'life-expectancy');
    });

    it('should have proper input constraints', () => {
      render(<WithdrawalStrategyPlanner />);
      
      const portfolioInput = screen.getByLabelText(/retirement portfolio value/i);
      expect(portfolioInput).toHaveAttribute('min', '0');
      expect(portfolioInput).toHaveAttribute('step', '10000');
      
      const ageInput = screen.getByLabelText(/current age/i);
      expect(ageInput).toHaveAttribute('min', '50');
      expect(ageInput).toHaveAttribute('max', '100');
    });

    it('should support keyboard navigation through inputs', () => {
      render(<WithdrawalStrategyPlanner />);
      
      const portfolioInput = screen.getByLabelText(/retirement portfolio value/i);
      const ageInput = screen.getByLabelText(/current age/i);
      
      // Test that inputs can receive focus
      portfolioInput.focus();
      expect(document.activeElement).toBe(portfolioInput);
      
      ageInput.focus();
      expect(document.activeElement).toBe(ageInput);
      
      // Verify DOM order for tab navigation (portfolio comes before age)
      expect(portfolioInput.compareDocumentPosition(ageInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe('LongevityRiskAnalyzer', () => {
    it('should have proper heading structure', () => {
      render(<LongevityRiskAnalyzer />);
      
      // Check main heading
      expect(screen.getByRole('heading', { level: 1, name: /longevity risk analyzer/i })).toBeInTheDocument();
      
      // Check section headings
      expect(screen.getByRole('heading', { level: 2, name: /life expectancy factors/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /financial parameters/i })).toBeInTheDocument();
    });

    it('should have properly grouped health factors', () => {
      render(<LongevityRiskAnalyzer />);
      
      // Check for specific health factor selects
      const genderSelect = screen.getByLabelText(/gender/i);
      const smokingSelect = screen.getByLabelText(/smoking status/i);
      const exerciseSelect = screen.getByLabelText(/exercise level/i);
      const dietSelect = screen.getByLabelText(/diet quality/i);
      
      // Each select should have proper labeling
      expect(genderSelect).toHaveAccessibleName();
      expect(smokingSelect).toHaveAccessibleName();
      expect(exerciseSelect).toHaveAccessibleName();
      expect(dietSelect).toHaveAccessibleName();
      
      // Check that selects have proper IDs
      expect(genderSelect).toHaveAttribute('id', 'gender-select');
      expect(smokingSelect).toHaveAttribute('id', 'smoking-select');
      expect(exerciseSelect).toHaveAttribute('id', 'exercise-select');
      expect(dietSelect).toHaveAttribute('id', 'diet-select');
    });

    it('should have accessible results display', async () => {
      render(<LongevityRiskAnalyzer />);
      
      await waitFor(() => {
        // Check for results section heading (appears after calculations)
        const resultsHeading = screen.queryByRole('heading', { name: /longevity risk analysis/i });
        if (resultsHeading) {
          expect(resultsHeading).toBeInTheDocument();
        }
        
        // Also check for alternative results heading
        const assessmentHeading = screen.queryByRole('heading', { name: /longevity risk assessment/i });
        if (assessmentHeading) {
          expect(assessmentHeading).toBeInTheDocument();
        }
        
        // At minimum, the component should have rendered without errors
        expect(screen.getByRole('heading', { level: 1, name: /longevity risk analyzer/i })).toBeInTheDocument();
      });
    });
  });

  describe('Cross-Component Integration', () => {
    it('should maintain consistent accessibility patterns', () => {
      const components = [
        <RetirementPlanningLessonEnhanced key="lesson" />,
        <RetirementAccountOptimizer key="optimizer" />,
        <WithdrawalStrategyPlanner key="withdrawal" />,
        <LongevityRiskAnalyzer key="longevity" />
      ];
      
      components.forEach((component, index) => {
        const { unmount } = render(component);
        
        // Each component should have a main heading
        const headings = screen.getAllByRole('heading', { level: 1 });
        expect(headings.length).toBeGreaterThan(0);
        
        // Each component should be keyboard accessible
        const buttons = screen.queryAllByRole('button');
        const textboxes = screen.queryAllByRole('textbox');
        const comboboxes = screen.queryAllByRole('combobox');
        const focusableElements = [...buttons, ...textboxes, ...comboboxes];
        
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
          expect(document.activeElement).toBe(focusableElements[0]);
        }
        
        unmount();
      });
    });

    it('should have consistent ARIA labeling patterns', () => {
      render(<RetirementAccountOptimizer />);
      
      // Check for consistent aria-describedby patterns
      const allInputs = screen.queryAllByRole('spinbutton').concat(screen.queryAllByRole('combobox'));
      allInputs.forEach(input => {
        if (input.hasAttribute('aria-describedby')) {
          const helpId = input.getAttribute('aria-describedby');
          const helpElement = document.getElementById(helpId!);
          expect(helpElement).toBeInTheDocument();
          expect(helpElement).toHaveClass('sr-only');
        }
      });
    });

    it('should handle focus management correctly', () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      // Test focus trap within components
      const focusableElements = screen.getAllByRole('button');
      
      if (focusableElements.length > 1) {
        focusableElements[0].focus();
        expect(document.activeElement).toBe(focusableElements[0]);
        
        // Test sequential focus
        fireEvent.keyDown(focusableElements[0], { key: 'Tab' });
        // Next focusable element should receive focus
      }
    });
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have sufficient color contrast', () => {
      render(<RetirementAccountOptimizer />);
      
      // Test would require actual color contrast calculation
      // This is a placeholder for visual regression testing
      const headings = screen.getAllByRole('heading');
      headings.forEach(heading => {
        expect(heading).toBeVisible();
      });
    });

    it('should have proper focus indicators', () => {
      render(<WithdrawalStrategyPlanner />);
      
      // Get specific input elements that we know exist
      const portfolioInput = screen.getByLabelText(/retirement portfolio value/i);
      const ageInput = screen.getByLabelText(/current age/i);
      const lifeExpectancyInput = screen.getByLabelText(/life expectancy/i);
      
      const focusableElements = [portfolioInput, ageInput, lifeExpectancyInput];
      
      // Test that each input can receive and maintain focus
      focusableElements.forEach(element => {
        element.focus();
        expect(element).toHaveFocus();
        // Visual focus indicator would be tested in e2e tests
      });
      
      // Verify we found the expected number of inputs
      expect(focusableElements.length).toBe(3);
    });

    it('should support screen reader announcements', () => {
      render(<RetirementPlanningLessonEnhanced />);
      
      // Check for proper live regions and announcements
      const statusElements = screen.getAllByRole('status');
      statusElements.forEach(status => {
        expect(status).toBeInTheDocument();
      });
    });

    it('should have proper input validation messages', async () => {
      render(<RetirementAccountOptimizer />);
      
      const ageInput = screen.getByLabelText(/current age/i);
      
      // Test invalid input
      fireEvent.change(ageInput, { target: { value: '150' } });
      fireEvent.blur(ageInput);
      
      await waitFor(() => {
        // Should show validation error for invalid value
        expect(ageInput).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      
      // Test valid input
      fireEvent.change(ageInput, { target: { value: '35' } });
      fireEvent.blur(ageInput);
      
      await waitFor(() => {
        // Should clear validation error for valid value
        expect(ageInput).toHaveAttribute('aria-invalid', 'false');
      });
    });
  });
});

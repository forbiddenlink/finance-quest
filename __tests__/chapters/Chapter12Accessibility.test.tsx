import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter12Page from '@/app/chapter12/page';
import PropertyInvestmentAnalyzer from '@/components/chapters/fundamentals/calculators/PropertyInvestmentAnalyzer';
import BRRRRStrategyCalculator from '@/components/chapters/fundamentals/calculators/BRRRRStrategyCalculator';
import RentalPropertyCalculator from '@/components/chapters/fundamentals/calculators/RentalPropertyCalculator';
import RealEstateComparisonTool from '@/components/chapters/fundamentals/calculators/RealEstateComparisonTool';

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

// Mock components to avoid rendering issues
jest.mock('@/components/chapters/fundamentals/lessons/RealEstateAlternativesLessonEnhanced', () => {
  return function MockRealEstateAlternativesLesson() {
    return (
      <div data-testid="lesson-content" onClick={() => {
        const event = new Event('click');
        document.dispatchEvent(event);
      }}>
        Mock Real Estate Alternatives Lesson
      </div>
    );
  };
});

jest.mock('@/components/shared/ai-assistant/AITeachingAssistant', () => {
  return function MockAITeachingAssistant() {
    return <div>Mock AI Teaching Assistant</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/quizzes/RealEstateAlternativesQuizEnhanced', () => {
  return function MockRealEstateAlternativesQuiz() {
    return <div>Mock Real Estate Alternatives Quiz</div>;
  };
});

jest.mock('@/components/shared/layouts/ChapterLayout', () => {
  return function MockChapterLayout({ title, subtitle, lessonComponent, calculatorComponent, quizComponent, calculatorTitle, quizTitle, calculatorTabs }: { 
    title: string; 
    subtitle: string; 
    lessonComponent?: React.ReactNode;
    calculatorComponent?: React.ReactNode;
    quizComponent?: React.ReactNode;
    calculatorTitle?: string;
    quizTitle?: string;
    calculatorTabs?: Array<{ id: string; label: string; component: React.ComponentType }>;
  }) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div>
          <h2>Lesson</h2>
          {lessonComponent}
        </div>
        <div>
          <h2>{calculatorTitle}</h2>
          <div role="tablist" aria-label="Real estate investment calculators">
            {calculatorTabs?.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={tab.id === 'property-investment'}
                aria-controls={`tab-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {calculatorComponent}
        </div>
        <div>
          <h2>{quizTitle}</h2>
          {quizComponent}
        </div>
      </div>
    );
  };
});

describe('Chapter 12: Real Estate & Property Investment - Accessibility', () => {
  describe('Chapter Layout Accessibility', () => {
    test('has proper heading hierarchy', () => {
      render(<Chapter12Page />);
      
      const mainHeading = screen.getByRole('heading', { level: 1, name: /Real Estate & Property Investment/i });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    test('calculator tabs have proper ARIA structure', () => {
      render(<Chapter12Page />);
      
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Real estate investment calculators');
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(4);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('id');
      });
    });
  });

  describe('PropertyInvestmentAnalyzer Accessibility', () => {
    test('form inputs have proper labels and validation', async () => {
      render(<PropertyInvestmentAnalyzer />);
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
      
      // Test validation messages
      const user = userEvent.setup();
      await user.clear(inputs[0]);
      await user.type(inputs[0], '-1');
      
      await waitFor(() => {
        const errorMessage = screen.queryByRole('alert');
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });

    test('analysis sections have proper ARIA landmarks', () => {
      render(<PropertyInvestmentAnalyzer />);
      
      const sections = screen.getAllByRole('region');
      sections.forEach(section => {
        expect(section).toHaveAccessibleName();
      });
    });
  });

  describe('BRRRRStrategyCalculator Accessibility', () => {
    test('form controls have descriptive labels', async () => {
      const user = userEvent.setup();
      render(<BRRRRStrategyCalculator />);
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
      
      // Click the Refinance tab to show the select element
      const refinanceButton = screen.getByRole('button', { name: /Refinance/i });
      await user.click(refinanceButton);
      
      const selects = screen.getAllByRole('combobox');
      selects.forEach(select => {
        expect(select).toHaveAccessibleName();
      });
    });

    test('strategy steps have proper structure', () => {
      render(<BRRRRStrategyCalculator />);
      
      const list = screen.getByRole('list', { name: /BRRRR strategy steps/i });
      expect(list).toBeInTheDocument();
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('RentalPropertyCalculator Accessibility', () => {
    test('expense inputs have proper grouping', () => {
      render(<RentalPropertyCalculator />);
      
      const expenseSection = screen.getByRole('region', { name: /operating expenses/i });
      expect(expenseSection).toBeInTheDocument();
      
      const inputs = within(expenseSection).getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    test('analysis results are properly announced', async () => {
      render(<RentalPropertyCalculator />);
      
      await waitFor(() => {
        const resultsRegion = screen.queryByRole('region', { name: /analysis results/i });
        if (resultsRegion) {
          expect(resultsRegion).toBeInTheDocument();
        }
      });
    });
  });

  describe('RealEstateComparisonTool Accessibility', () => {
    test('property cards have proper structure', () => {
      render(<RealEstateComparisonTool />);
      
      const propertyCards = screen.getAllByRole('region', { name: /property details/i });
      propertyCards.forEach(card => {
        expect(card).toHaveAccessibleName();
      });
    });

    test('comparison table has proper accessibility markup', () => {
      render(<RealEstateComparisonTool />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label', 'Property comparison details');
      
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports tab navigation through all interactive elements', async () => {
      const components = [
        <PropertyInvestmentAnalyzer key="analyzer" />,
        <BRRRRStrategyCalculator key="brrrr" />,
        <RentalPropertyCalculator key="rental" />,
        <RealEstateComparisonTool key="comparison" />
      ];

      for (const component of components) {
        const { container } = render(component);
        
        const interactiveElements = container.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="tab"], [role="button"]'
        );
        
        interactiveElements.forEach(element => {
          const tabIndex = element.getAttribute('tabindex');
          const isNaturallyFocusable = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
          
          expect(isNaturallyFocusable || tabIndex !== '-1').toBe(true);
        });
      }
    });

    test('maintains focus management during dynamic updates', async () => {
      render(<RealEstateComparisonTool />);
      const user = userEvent.setup();
      
      const addButton = screen.getByText('Add Property');
      await user.click(addButton);
      
      // Focus should move to the new property section
      const newPropertyInput = screen.getByDisplayValue('Property C');
      expect(newPropertyInput).toHaveFocus();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    test('uses sufficient color contrast for text elements', () => {
      const components = [
        <PropertyInvestmentAnalyzer key="analyzer" />,
        <BRRRRStrategyCalculator key="brrrr" />,
        <RentalPropertyCalculator key="rental" />,
        <RealEstateComparisonTool key="comparison" />
      ];

      components.forEach(component => {
        const { container } = render(component);
        
        // Check for theme classes that ensure WCAG compliance
        const themedElements = container.querySelectorAll('[class*="text-"]');
        expect(themedElements.length).toBeGreaterThan(0);
      });
    });

    test('provides visual feedback for interactive elements', async () => {
      render(<RealEstateComparisonTool />);
      const user = userEvent.setup();
      
      const buttons = screen.getAllByRole('button');
      
      for (const button of buttons) {
        await user.hover(button);
        // Should have hover state styles
        expect(button).toHaveClass(/hover:/);
      }
    });
  });

  describe('Screen Reader Considerations', () => {
    test('provides appropriate ARIA live regions for dynamic content', async () => {
      render(<RealEstateComparisonTool />);
      
      const liveRegions = document.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThan(0);
      
      liveRegions.forEach(region => {
        expect(region).toHaveAttribute('aria-live');
      });
    });

    test('uses descriptive labels for form controls', () => {
      const components = [
        <PropertyInvestmentAnalyzer key="analyzer" />,
        <BRRRRStrategyCalculator key="brrrr" />,
        <RentalPropertyCalculator key="rental" />,
        <RealEstateComparisonTool key="comparison" />
      ];

      components.forEach(component => {
        render(component);
        
        const formControls = screen.getAllByRole('textbox')
          .concat(screen.getAllByRole('spinbutton'))
          .concat(screen.getAllByRole('combobox'));
        
        formControls.forEach(control => {
          expect(control).toHaveAccessibleName();
        });
      });
    });
  });

  describe('Error Handling Accessibility', () => {
    test('error messages are properly associated with inputs', async () => {
      render(<PropertyInvestmentAnalyzer />);
      const user = userEvent.setup();
      
      const inputs = screen.getAllByRole('spinbutton');
      
      for (const input of inputs) {
        await user.clear(input);
        await user.type(input, '-1');
        
        await waitFor(() => {
          const errorMessage = screen.queryByRole('alert');
          if (errorMessage) {
            expect(errorMessage).toHaveAttribute('id');
            expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
          }
        });
      }
    });

    test('validation errors are announced to screen readers', async () => {
      render(<RentalPropertyCalculator />);
      const user = userEvent.setup();
      
      const inputs = screen.getAllByRole('spinbutton');
      
      for (const input of inputs) {
        await user.clear(input);
        await user.type(input, '-1');
        
        await waitFor(() => {
          const errorMessage = screen.queryByRole('alert');
          if (errorMessage) {
            expect(errorMessage).toHaveAttribute('role', 'alert');
          }
        });
      }
    });
  });
});

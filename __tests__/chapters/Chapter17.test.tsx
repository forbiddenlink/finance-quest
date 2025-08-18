import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter17Page from '@/app/chapter17/page';
import EstatePlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/EstatePlanningLessonEnhanced';
import EstatePlanningQuizEnhanced from '@/components/chapters/fundamentals/quizzes/EstatePlanningQuizEnhanced';
import EstatePlanningCalculator from '@/components/shared/calculators/EstatePlanningCalculator';
import TrustAnalysisCalculator from '@/components/shared/calculators/TrustAnalysisCalculator';
import InheritanceTaxCalculator from '@/components/shared/calculators/InheritanceTaxCalculator';
import WealthTransferCalculator from '@/components/shared/calculators/WealthTransferCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
    userProgress: {
      completedLessons: [],
      completedChapters: [],
      unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      calculatorUsage: {},
      quizScores: {},
    },
    isChapterUnlocked: () => true,
    completeLesson: jest.fn(),
    getPersonalizedEncouragement: () => 'Keep going!',
    getStudyRecommendation: () => ({ priority: 'low', message: 'Keep learning!' }),
    checkLevelUp: () => false,
  }),
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('Chapter 17: Estate Planning & Wealth Transfer', () => {
  describe('Accessibility and Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<Chapter17Page />);
      
      const mainHeading = screen.getByRole('heading', {
        level: 1,
        name: /Estate Planning & Wealth Transfer/i
      });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('has accessible navigation', () => {
      render(<Chapter17Page />);
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(4);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('tabindex');
      });
    });

    it('supports keyboard navigation', async () => {
      render(<Chapter17Page />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const secondTab = tabs[1];
      
      firstTab.focus();
      expect(firstTab).toHaveFocus();
      
      await userEvent.keyboard('{arrowright}');
      expect(secondTab).toHaveFocus();
    });
  });

  describe('Estate Planning Calculator', () => {
    it('has accessible form controls', () => {
      render(<EstatePlanningCalculator />);
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
        expect(input).toHaveAttribute('aria-describedby');
      });
    });

    it('calculates estate value and tax liability', async () => {
      render(<EstatePlanningCalculator />);
      
      // Fill required inputs
      const inputs = {
        'Real Estate Value': '1000000',
        'Investment Accounts': '500000',
        'Life Insurance': '250000',
        'Business Interests': '750000',
        'Outstanding Debts': '100000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate estate value
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/Gross Estate Value/i)).toBeInTheDocument();
        expect(screen.getByText(/Estate Tax Liability/i)).toBeInTheDocument();
      });
    });

    it('provides distribution planning', async () => {
      render(<EstatePlanningCalculator />);
      
      // Add beneficiaries
      const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
      await userEvent.click(addBeneficiaryButton);
      await userEvent.click(addBeneficiaryButton);

      // Fill beneficiary details
      const beneficiaries = [
        {
          'Name': 'Child 1',
          'Relationship': 'Child',
          'Share': '50',
        },
        {
          'Name': 'Child 2',
          'Relationship': 'Child',
          'Share': '50',
        },
      ];

      for (const [index, beneficiary] of beneficiaries.entries()) {
        for (const [label, value] of Object.entries(beneficiary)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Generate distribution plan
      const planButton = screen.getByRole('button', { name: /generate plan/i });
      await userEvent.click(planButton);

      // Check plan details
      await waitFor(() => {
        expect(screen.getByText(/Distribution Summary/i)).toBeInTheDocument();
        expect(screen.getByText(/Tax Implications/i)).toBeInTheDocument();
      });
    });
  });

  describe('Trust Analysis Calculator', () => {
    it('has accessible trust configuration', () => {
      render(<TrustAnalysisCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('analyzes trust structures', async () => {
      render(<TrustAnalysisCalculator />);
      
      // Configure trust
      const inputs = {
        'Trust Type': 'Revocable Living Trust',
        'Initial Funding': '1000000',
        'Annual Contribution': '50000',
        'Distribution Rate': '4',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        if (input.tagName === 'SELECT') {
          await userEvent.selectOptions(input, value);
        } else {
          await userEvent.clear(input);
          await userEvent.type(input, value);
        }
      }

      // Analyze trust
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(analyzeButton);

      // Check analysis results
      await waitFor(() => {
        expect(screen.getByText(/Trust Benefits/i)).toBeInTheDocument();
        expect(screen.getByText(/Tax Advantages/i)).toBeInTheDocument();
      });
    });

    it('projects trust performance', async () => {
      render(<TrustAnalysisCalculator />);
      
      // Configure and analyze trust
      const inputs = {
        'Initial Funding': '1000000',
        'Growth Rate': '6',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Generate projections
      const projectButton = screen.getByRole('button', { name: /project/i });
      await userEvent.click(projectButton);

      // Check projections
      await waitFor(() => {
        expect(screen.getByText(/Trust Value Projection/i)).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Inheritance Tax Calculator', () => {
    it('has accessible tax input form', () => {
      render(<InheritanceTaxCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('calculates inheritance tax', async () => {
      render(<InheritanceTaxCalculator />);
      
      // Fill inheritance details
      const inputs = {
        'Inheritance Amount': '2000000',
        'State': 'Pennsylvania',
        'Relationship': 'Child',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        if (input.tagName === 'SELECT') {
          await userEvent.selectOptions(input, value);
        } else {
          await userEvent.clear(input);
          await userEvent.type(input, value);
        }
      }

      // Calculate tax
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check tax calculations
      await waitFor(() => {
        expect(screen.getByText(/Federal Estate Tax/i)).toBeInTheDocument();
        expect(screen.getByText(/State Inheritance Tax/i)).toBeInTheDocument();
      });
    });

    it('analyzes step-up basis', async () => {
      render(<InheritanceTaxCalculator />);
      
      // Add assets
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);

      // Fill asset details
      const inputs = {
        'Asset Type': 'Stock',
        'Original Cost': '100000',
        'Current Value': '250000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze basis
      const analyzeButton = screen.getByRole('button', { name: /analyze basis/i });
      await userEvent.click(analyzeButton);

      // Check analysis
      await waitFor(() => {
        expect(screen.getByText(/Step-up Value/i)).toBeInTheDocument();
        expect(screen.getByText(/Tax Savings/i)).toBeInTheDocument();
      });
    });
  });

  describe('Wealth Transfer Calculator', () => {
    it('has accessible transfer planning form', () => {
      render(<WealthTransferCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('analyzes generation-skipping strategies', async () => {
      render(<WealthTransferCalculator />);
      
      // Configure transfer
      const inputs = {
        'Total Assets': '5000000',
        'Number of Generations': '2',
        'Annual Gift Amount': '16000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Analyze strategy
      const analyzeButton = screen.getByRole('button', { name: /analyze strategy/i });
      await userEvent.click(analyzeButton);

      // Check analysis results
      await waitFor(() => {
        expect(screen.getByText(/GST Tax Impact/i)).toBeInTheDocument();
        expect(screen.getByText(/Transfer Efficiency/i)).toBeInTheDocument();
      });
    });

    it('plans gift tax strategy', async () => {
      render(<WealthTransferCalculator />);
      
      // Configure gifts
      const inputs = {
        'Annual Gift Amount': '16000',
        'Number of Recipients': '3',
        'Planning Period': '5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Generate plan
      const planButton = screen.getByRole('button', { name: /plan strategy/i });
      await userEvent.click(planButton);

      // Check plan details
      await waitFor(() => {
        expect(screen.getByText(/Gift Tax Exclusion/i)).toBeInTheDocument();
        expect(screen.getByText(/Lifetime Exemption/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Component', () => {
    it('has accessible content structure', () => {
      render(<EstatePlanningLessonEnhanced />);
      
      const sections = screen.getAllByRole('region');
      sections.forEach(section => {
        expect(section).toHaveAttribute('aria-label');
      });
    });

    it('tracks progress accessibly', async () => {
      render(<EstatePlanningLessonEnhanced />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin');
      expect(progressBar).toHaveAttribute('aria-valuemax');
    });
  });

  describe('Quiz Component', () => {
    it('has accessible quiz form', () => {
      render(<EstatePlanningQuizEnhanced />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const radioGroups = screen.getAllByRole('radiogroup');
      radioGroups.forEach(group => {
        expect(group).toHaveAttribute('aria-label');
      });
    });

    it('provides accessible feedback', async () => {
      render(<EstatePlanningQuizEnhanced />);
      
      // Answer a question
      const options = screen.getAllByRole('radio');
      await userEvent.click(options[0]);

      // Submit answer
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Check feedback
      await waitFor(() => {
        const feedback = screen.getByRole('alert');
        expect(feedback).toBeInTheDocument();
        expect(feedback).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Integration Tests', () => {
    it('maintains state between calculator switches', async () => {
      render(<Chapter17Page />);
      
      // Start with Estate Planning
      const estatePlanningTab = screen.getByRole('tab', { name: /Estate Planning/i });
      await userEvent.click(estatePlanningTab);
      
      // Enter some data
      const input = screen.getByLabelText(/Real Estate Value/i);
      await userEvent.type(input, '1000000');

      // Switch to Trust Analysis
      const trustTab = screen.getByRole('tab', { name: /Trust Analysis/i });
      await userEvent.click(trustTab);

      // Switch back to Estate Planning
      await userEvent.click(estatePlanningTab);

      // Check if data persists
      expect(input).toHaveValue(1000000);
    });

    it('synchronizes estate value with trust analysis', async () => {
      render(<Chapter17Page />);
      
      // Enter estate value
      const estatePlanningTab = screen.getByRole('tab', { name: /Estate Planning/i });
      await userEvent.click(estatePlanningTab);
      
      const estateInput = screen.getByLabelText(/Real Estate Value/i);
      await userEvent.type(estateInput, '1000000');

      // Switch to Trust Analysis
      const trustTab = screen.getByRole('tab', { name: /Trust Analysis/i });
      await userEvent.click(trustTab);

      // Check if estate value is reflected
      await waitFor(() => {
        expect(screen.getByText(/Available Assets/i)).toBeInTheDocument();
      });
    });

    it('updates tax calculations based on trust structure', async () => {
      render(<Chapter17Page />);
      
      // Configure trust
      const trustTab = screen.getByRole('tab', { name: /Trust Analysis/i });
      await userEvent.click(trustTab);
      
      const trustTypeSelect = screen.getByLabelText(/Trust Type/i);
      await userEvent.selectOptions(trustTypeSelect, 'Irrevocable Trust');

      // Switch to Inheritance Tax
      const taxTab = screen.getByRole('tab', { name: /Inheritance Tax/i });
      await userEvent.click(taxTab);

      // Check if trust type affects tax calculations
      await waitFor(() => {
        expect(screen.getByText(/Trust Tax Benefits/i)).toBeInTheDocument();
      });
    });
  });
});


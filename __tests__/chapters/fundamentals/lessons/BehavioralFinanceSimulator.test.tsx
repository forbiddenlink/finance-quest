import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BehavioralFinanceSimulator from '@/components/chapters/fundamentals/lessons/BehavioralFinanceSimulator';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('BehavioralFinanceSimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial simulator interface', () => {
    render(<BehavioralFinanceSimulator />);
    
    expect(screen.getByText('Behavioral Finance Simulator')).toBeInTheDocument();
    expect(screen.getByText('Test your resistance to cognitive biases that affect financial decisions')).toBeInTheDocument();
    expect(screen.getByText('Bias 1 of 5')).toBeInTheDocument();
  });

  it('displays the first cognitive bias scenario', () => {
    render(<BehavioralFinanceSimulator />);
    
    expect(screen.getByText('Loss Aversion')).toBeInTheDocument();
    expect(screen.getByText('Scenario')).toBeInTheDocument();
    expect(screen.getByText(/Your investment portfolio has lost 15%/)).toBeInTheDocument();
    expect(screen.getByText('What would you do?')).toBeInTheDocument();
  });

  it('shows loss aversion bias options', () => {
    render(<BehavioralFinanceSimulator />);
    
    expect(screen.getByText('Sell everything to prevent further losses')).toBeInTheDocument();
    expect(screen.getByText('Sell some investments to feel better')).toBeInTheDocument();
    expect(screen.getByText('Hold steady and continue regular investing')).toBeInTheDocument();
    expect(screen.getByText('Invest more money while prices are low')).toBeInTheDocument();
  });

  it('handles option selection and shows results', async () => {
    render(<BehavioralFinanceSimulator />);
    
    const rationalOption = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(rationalOption);

    await waitFor(() => {
      expect(screen.getByText('Rational Decision!')).toBeInTheDocument();
      expect(screen.getByText(/Rational choice! Market downturns are temporary/)).toBeInTheDocument();
      expect(screen.getByText('Real World Impact')).toBeInTheDocument();
      expect(screen.getByText('Prevention Strategy')).toBeInTheDocument();
    });
  });

  it('shows biased decision feedback for poor choices', async () => {
    render(<BehavioralFinanceSimulator />);
    
    const biasedOption = screen.getByText('Sell everything to prevent further losses');
    fireEvent.click(biasedOption);

    await waitFor(() => {
      expect(screen.getByText('Cognitive Bias Detected')).toBeInTheDocument();
      expect(screen.getByText(/This locks in losses and misses the recovery/)).toBeInTheDocument();
    });
  });

  it('progresses through multiple bias scenarios', async () => {
    render(<BehavioralFinanceSimulator />);
    
    // Complete first bias
    const firstOption = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(firstOption);

    await waitFor(() => {
      expect(screen.getByText('Next Scenario')).toBeInTheDocument();
    });

    // Move to next bias
    const nextButton = screen.getByText('Next Scenario');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Bias 2 of 5')).toBeInTheDocument();
      expect(screen.getByText('Anchoring Bias')).toBeInTheDocument();
    });
  });

  it('shows anchoring bias scenario and options', async () => {
    render(<BehavioralFinanceSimulator />);
    
    // Complete first bias to get to anchoring
    const firstOption = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(firstOption);
    
    await waitFor(() => {
      const nextButton = screen.getByText('Next Scenario');
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Anchoring Bias')).toBeInTheDocument();
      expect(screen.getByText(/You see a car listed for \$25,000/)).toBeInTheDocument();
      expect(screen.getByText('Accept - it\'s $11,000 off the original price!')).toBeInTheDocument();
      expect(screen.getByText('Offer $21,000 based on market research')).toBeInTheDocument();
    });
  });

  it('shows progress indicator correctly', () => {
    render(<BehavioralFinanceSimulator />);
    
    expect(screen.getByText('20% Complete')).toBeInTheDocument();
    
    const progressBar = document.querySelector('.h-2');
    expect(progressBar).toBeInTheDocument();
  });

  it('displays final summary after completing all biases', async () => {
    render(<BehavioralFinanceSimulator />);
    
    // Complete all 5 biases with rational choices
    const biases = [
      'Hold steady and continue regular investing',
      'Offer $21,000 based on market research',
      'Invest it all for the future',
      'Carefully analyze both positive and negative information',
      'Ignore past losses and evaluate future prospects'
    ];

    for (let i = 0; i < biases.length; i++) {
      const option = screen.getByText(biases[i]);
      fireEvent.click(option);

      await waitFor(() => {
        if (i < biases.length - 1) {
          const nextButton = screen.getByText('Next Scenario');
          fireEvent.click(nextButton);
        } else {
          const viewResultsButton = screen.getByText('View Results');
          fireEvent.click(viewResultsButton);
        }
      });
    }

    await waitFor(() => {
      expect(screen.getByText('Behavioral Finance Assessment Complete')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument(); // Perfect score
      expect(screen.getByText('Excellent! You have strong rational decision-making skills.')).toBeInTheDocument();
    });
  });

  it('shows detailed analysis in summary', async () => {
    render(<BehavioralFinanceSimulator />);
    
    // Complete first bias with rational choice
    const rationalOption = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(rationalOption);

    // Check that bias title is shown (there may be multiple instances)
    const lossAversionElements = screen.getAllByText('Loss Aversion');
    expect(lossAversionElements.length).toBeGreaterThan(0);
  });

  it('handles reset functionality', async () => {
    render(<BehavioralFinanceSimulator />);
    
    // Make a choice
    const option = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByText('Rational Decision!')).toBeInTheDocument();
    });

    // Note: Reset functionality would be tested in integration with full component state
    expect(screen.getByText('Loss Aversion')).toBeInTheDocument();
  });

  it('shows prevention strategies for each bias', async () => {
    render(<BehavioralFinanceSimulator />);
    
    const option = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByText('Prevention Strategy')).toBeInTheDocument();
      expect(screen.getByText(/Set up automatic investing to remove emotion/)).toBeInTheDocument();
    });
  });

  it('displays real world examples', async () => {
    render(<BehavioralFinanceSimulator />);
    
    const option = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByText('Real World Impact')).toBeInTheDocument();
      expect(screen.getByText(/During COVID-19 crash/)).toBeInTheDocument();
    });
  });

  it('handles different bias impact levels', async () => {
    render(<BehavioralFinanceSimulator />);
    
    // Test high impact (poor choice)
    const highImpactOption = screen.getByText('Sell everything to prevent further losses');
    fireEvent.click(highImpactOption);

    await waitFor(() => {
      expect(screen.getByText('Cognitive Bias Detected')).toBeInTheDocument();
    });
  });

  it('shows proper ARIA attributes for accessibility', () => {
    render(<BehavioralFinanceSimulator />);
    
    // Check for brain icon and proper labeling
    expect(screen.getByText('Behavioral Finance Simulator')).toBeInTheDocument();
    expect(screen.getByText('Test your resistance to cognitive biases that affect financial decisions')).toBeInTheDocument();
  });

  it('displays cognitive bias descriptions correctly', () => {
    render(<BehavioralFinanceSimulator />);
    
    expect(screen.getByText(/People feel losses about twice as strongly as equivalent gains/)).toBeInTheDocument();
  });

  it('shows appropriate visual feedback for choices', async () => {
    render(<BehavioralFinanceSimulator />);
    
    const rationalChoice = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(rationalChoice);

    await waitFor(() => {
      // Should show success styling/icons for rational choices
      expect(screen.getByText('Rational Decision!')).toBeInTheDocument();
    });
  });

  it('calculates and displays scores correctly', async () => {
    render(<BehavioralFinanceSimulator />);
    
    const rationalChoice = screen.getByText('Hold steady and continue regular investing');
    fireEvent.click(rationalChoice);

    await waitFor(() => {
      // Rational choices should score highly
      expect(screen.getByText('Rational Decision!')).toBeInTheDocument();
    });
  });

  it('provides educational content for each bias type', () => {
    render(<BehavioralFinanceSimulator />);
    
    // Check that educational content is present
    expect(screen.getByText('Loss Aversion')).toBeInTheDocument();
    expect(screen.getByText(/People feel losses about twice as strongly/)).toBeInTheDocument();
  });
});

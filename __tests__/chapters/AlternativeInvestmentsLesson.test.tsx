import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlternativeInvestmentsLesson from '@/components/chapters/fundamentals/lessons/AlternativeInvestmentsLesson';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore');

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className} data-testid="card-content">{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className} data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className} data-testid="card-title">{children}</h3>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: any) => (
    <button onClick={onClick} disabled={disabled} className={className} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div className={className} data-testid="progress" data-value={value} />
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Building: () => <div data-testid="building-icon" />,
  Package: () => <div data-testid="package-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Target: () => <div data-testid="target-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
}));

const mockProgressStore = {
  userProgress: {
    completedLessons: [],
    quizScores: {},
    calculatorUsage: {},
    achievements: [],
    streakDays: 0,
    totalTimeSpent: 0,
    lastActiveDate: new Date().toISOString(),
  },
  completeLesson: jest.fn(),
  recordQuizScore: jest.fn(),
  recordCalculatorUsage: jest.fn(),
  updateProgress: jest.fn(),
  isChapterUnlocked: jest.fn(() => true),
  getChapterProgress: jest.fn(() => ({ lessonsCompleted: 0, quizCompleted: false, calculatorsUsed: 0 })),
  getLessonProgress: jest.fn(() => ({ completed: false, timeSpent: 0 })),
};

describe('AlternativeInvestmentsLesson', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector ? selector(mockProgressStore) : mockProgressStore
    );
  });

  test('renders lesson component without crashing', () => {
    render(<AlternativeInvestmentsLesson />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  test('displays lesson introduction correctly', () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Check for the main heading (both h1 and h2 contain this text)
    expect(screen.getAllByText(/Introduction to Alternative Investments/i)).toHaveLength(2);
    expect(screen.getByText(/Discover investments beyond traditional stocks and bonds/i)).toBeInTheDocument();
  });

  test('shows progress indicator', () => {
    render(<AlternativeInvestmentsLesson />);
    
    const progressElement = screen.getByTestId('progress');
    expect(progressElement).toBeInTheDocument();
  });

  test('covers alternative investment fundamentals', () => {
    render(<AlternativeInvestmentsLesson />);
    
    expect(screen.getByText(/What Are Alternative Investments\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Assets outside traditional stocks, bonds, and cash/i)).toBeInTheDocument();
    expect(screen.getByText(/low correlation with traditional markets/i)).toBeInTheDocument();
  });

  test('explains benefits and considerations', () => {
    render(<AlternativeInvestmentsLesson />);
    
    expect(screen.getByText(/Benefits & Considerations/i)).toBeInTheDocument();
    expect(screen.getByText(/inflation protection and diversification/i)).toBeInTheDocument();
    expect(screen.getByText(/5-25% of total portfolio allocation/i)).toBeInTheDocument();
  });

  test('allows navigation between lesson sections', async () => {
    render(<AlternativeInvestmentsLesson />);
    
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    expect(nextButton).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    
    // Should advance to REITs section (both h1 and h2 contain this text)
    await waitFor(() => {
      expect(screen.getAllByText(/Real Estate Investment Trusts.*REITs/i)).toHaveLength(2);
    });
  });

  test('covers REITs comprehensively', async () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Navigate to REITs section - get all buttons and select the Next button (second one)
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Real Estate Investment Trusts.*REITs/i)).toHaveLength(2);
    });
  });

  test('includes commodities education', async () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Navigate to commodities section (section 2)
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    fireEvent.click(nextButton); // Section 1: REITs
    fireEvent.click(nextButton); // Section 2: Commodities
    
    await waitFor(() => {
      expect(screen.getByText(/Commodities & Natural Resources/i)).toBeInTheDocument();
    });
  });

  test('covers cryptocurrency section', async () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Navigate to crypto section (section 3)
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    for (let i = 0; i < 3; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Cryptocurrency & Digital Assets/i)).toBeInTheDocument();
    });
  });

  test('includes portfolio integration strategies', async () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Navigate to portfolio integration section (section 4)
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    for (let i = 0; i < 4; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Portfolio Integration Strategies/i)).toBeInTheDocument();
    });
  });

  test('covers risk management best practices', async () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Navigate to risk management section (section 5)
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Risk Management & Best Practices/i)).toBeInTheDocument();
    });
  });

  test('calls onComplete when lesson is finished', async () => {
    const mockOnComplete = jest.fn();
    render(<AlternativeInvestmentsLesson onComplete={mockOnComplete} />);
    
    // Navigate through all sections (6 total)
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    
    for (let i = 0; i < 6; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('records lesson completion when reaching the end', async () => {
    const mockOnComplete = jest.fn();
    render(<AlternativeInvestmentsLesson onComplete={mockOnComplete} />);
    
    // Navigate through all sections to complete the lesson
    const buttons = screen.getAllByTestId('button');
    const nextButton = buttons[1]; // Previous is disabled, Next is second button
    
    // Click through all 6 sections (5 clicks to get to the end)
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    // The last click should trigger completion
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  test('displays proper lesson structure with cards', () => {
    render(<AlternativeInvestmentsLesson />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
    
    const cardTitles = screen.getAllByTestId('card-title');
    expect(cardTitles.length).toBeGreaterThan(0);
  });

  test('shows appropriate educational icons', () => {
    render(<AlternativeInvestmentsLesson />);
    
    expect(screen.getByTestId('pie-chart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('target-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
  });

  test('includes REITs, commodities, and crypto content', () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Check for comprehensive alternative investment coverage
    expect(screen.getByText(/REITs, commodities, crypto, private equity/i)).toBeInTheDocument();
  });

  test('provides educational content on diversification', () => {
    render(<AlternativeInvestmentsLesson />);
    
    expect(screen.getByText(/enhance portfolio diversification/i)).toBeInTheDocument();
    expect(screen.getByText(/risk-adjusted returns/i)).toBeInTheDocument();
  });

  test('explains alternative investment allocation guidelines', () => {
    render(<AlternativeInvestmentsLesson />);
    
    expect(screen.getByText(/5-25% of total portfolio allocation/i)).toBeInTheDocument();
  });

  test('displays lesson navigation and progress', async () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Check that lesson has navigation elements
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    
    // Check that progress is displayed
    const progressElement = screen.getByTestId('progress');
    expect(progressElement).toBeInTheDocument();
  });

  test('covers modern alternative investment landscape', () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Should cover contemporary alternative investments
    expect(screen.getByText(/Assets outside traditional stocks, bonds, and cash/i)).toBeInTheDocument();
  });

  test('includes practical allocation guidance', () => {
    render(<AlternativeInvestmentsLesson />);
    
    // Should provide practical investment guidance
    expect(screen.getByText(/portfolio allocation/i)).toBeInTheDocument();
  });
});

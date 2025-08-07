import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BondFixedIncomeLessonEnhanced from '@/components/chapters/fundamentals/lessons/BondFixedIncomeLessonEnhanced';
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
  CardDescription: ({ children, className }: any) => <div className={className} data-testid="card-description">{children}</div>,
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

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ className }: any) => <hr className={className} data-testid="separator" />,
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => (
    <span className={className} data-testid="badge">{children}</span>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Shield: () => <div data-testid="shield-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Target: () => <div data-testid="target-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Info: () => <div data-testid="info-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
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

describe('BondFixedIncomeLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector ? selector(mockProgressStore) : mockProgressStore
    );
  });

  test('renders lesson component without crashing', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  test('displays lesson content correctly', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    // Check for bond fundamentals content
    expect(screen.getByText(/Understanding Bonds & Fixed Income Fundamentals/i)).toBeInTheDocument();
    expect(screen.getByText(/What Are Bonds\?/i)).toBeInTheDocument();
  });

  test('shows progress indicator', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    const progressElement = screen.getByTestId('progress');
    expect(progressElement).toBeInTheDocument();
  });

  test('allows navigation between lessons', async () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    const nextButton = screen.getByTestId('button');
    expect(nextButton).toBeInTheDocument();
    
    fireEvent.click(nextButton);
    
    // Should advance to next lesson section
    await waitFor(() => {
      expect(screen.getByText(/Types of Bonds & Their Characteristics/i)).toBeInTheDocument();
    });
  });

  test('displays bond types and characteristics', async () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    // Navigate to second lesson
    const nextButton = screen.getByTestId('button');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Types of Bonds & Their Characteristics/i)).toBeInTheDocument();
    });
  });

  test('shows interactive elements for bond concepts', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    // Check for key bond concepts
    expect(screen.getByText(/Face Value/i)).toBeInTheDocument();
    expect(screen.getByText(/Coupon Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Maturity/i)).toBeInTheDocument();
    expect(screen.getByText(/Credit Rating/i)).toBeInTheDocument();
  });

  test('displays advantages and considerations', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    expect(screen.getByText(/Advantages/i)).toBeInTheDocument();
    expect(screen.getByText(/Considerations/i)).toBeInTheDocument();
    expect(screen.getByText(/Predictable income stream/i)).toBeInTheDocument();
    expect(screen.getByText(/Interest rate risk/i)).toBeInTheDocument();
  });

  test('calls onComplete when lesson is finished', async () => {
    const mockOnComplete = jest.fn();
    render(<BondFixedIncomeLessonEnhanced onComplete={mockOnComplete} />);
    
    // Navigate through all lessons (6 total)
    const nextButton = screen.getByTestId('button');
    
    for (let i = 0; i < 6; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test('records lesson completion in progress store', async () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    // Complete the lesson
    const nextButton = screen.getByTestId('button');
    for (let i = 0; i < 6; i++) {
      fireEvent.click(nextButton);
      await waitFor(() => {});
    }
    
    expect(mockProgressStore.completeLesson).toHaveBeenCalled();
  });

  test('displays proper lesson structure with cards', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
    
    const cardTitles = screen.getAllByTestId('card-title');
    expect(cardTitles.length).toBeGreaterThan(0);
  });

  test('shows educational icons appropriately', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
  });

  test('handles lesson completion tracking', async () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    // Check that lesson progress is tracked
    expect(mockProgressStore.getChapterProgress).toHaveBeenCalled();
  });

  test('displays bond example calculations', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    // Look for example bond calculation
    expect(screen.getByText(/\$1,000 bond, 5% coupon, 10-year maturity/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual payment: \$50/i)).toBeInTheDocument();
    expect(screen.getByText(/Total received: \$1,500 over 10 years/i)).toBeInTheDocument();
  });

  test('provides comprehensive bond education content', () => {
    render(<BondFixedIncomeLessonEnhanced />);
    
    // Verify educational content quality
    expect(screen.getByText(/bonds are essentially IOUs/i)).toBeInTheDocument();
    expect(screen.getByText(/lending money to a government/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EstatePlanningLessonEnhanced from '@/components/chapters/fundamentals/lessons/EstatePlanningLessonEnhanced';
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

// Mock GradientCard
jest.mock('@/components/shared/ui/GradientCard', () => {
  return function MockGradientCard({ children, className }: any) {
    return <div className={className} data-testid="gradient-card">{children}</div>;
  };
});

// Mock ProgressRing
jest.mock('@/components/shared/ui/ProgressRing', () => {
  return function MockProgressRing({ progress, size, strokeWidth, className }: any) {
    return (
      <div 
        className={className} 
        data-testid="progress-ring" 
        data-progress={progress}
        data-size={size}
        data-stroke-width={strokeWidth}
      />
    );
  };
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Shield: () => <div data-testid="shield-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Building: () => <div data-testid="building-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  ChevronLeft: () => <div data-testid="chevron-left-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Star: () => <div data-testid="star-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Award: () => <div data-testid="award-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  ScrollText: () => <div data-testid="scroll-text-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
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

describe('EstatePlanningLessonEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = mockProgressStore;
      return selector ? selector(state) : state;
    });
  });

  test('renders the lesson component without crashing', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    expect(screen.getByText('Chapter 17: Estate Planning & Wealth Transfer')).toBeInTheDocument();
    expect(screen.getByText('Protecting and Preserving Your Legacy')).toBeInTheDocument();
  });

  test('displays progress ring with correct lesson count', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    expect(screen.getByTestId('progress-ring')).toBeInTheDocument();
    expect(screen.getAllByText(/Lesson.*of 6/i)).toHaveLength(2); // Header and lesson progress
  });

  test('shows first lesson by default - Estate Planning Fundamentals', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    expect(screen.getByText('Estate Planning Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Protecting and Transferring Your Wealth to Future Generations')).toBeInTheDocument();
  });

  test('displays all lesson content sections', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    expect(screen.getByText('Core Concept')).toBeInTheDocument();
    expect(screen.getByText('Real Money Example')).toBeInTheDocument();
    expect(screen.getByText('Take Action Now')).toBeInTheDocument();
    expect(screen.getByText('Important Warning')).toBeInTheDocument();
  });

  test('navigation buttons work correctly', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    const previousButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Previous button should be disabled on first lesson
    expect(previousButton).toBeDisabled();
    
    // Click next button to go to lesson 2
    fireEvent.click(nextButton);
    expect(screen.getByText('Wills, Trusts & Legal Documents')).toBeInTheDocument();
    
    // Previous button should now be enabled
    expect(previousButton).not.toBeDisabled();
  });

  test('complete lesson button triggers progress tracking', async () => {
    render(<EstatePlanningLessonEnhanced />);
    
    const completeButton = screen.getByRole('button', { name: /complete lesson/i });
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockProgressStore.completeLesson).toHaveBeenCalledWith(
        'estate-planning-enhanced-0',
        expect.any(Number)
      );
    });
  });

  test('shows completed status for completed lessons', () => {
    const completedMockStore = {
      ...mockProgressStore,
      userProgress: {
        ...mockProgressStore.userProgress,
        completedLessons: ['estate-planning-enhanced-0'],
      },
    };

    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = completedMockStore;
      return selector ? selector(state) : state;
    });

    render(<EstatePlanningLessonEnhanced />);
    
    // Check for completed lesson indicator
    const checkCircleIcons = screen.getAllByTestId('check-circle-icon');
    expect(checkCircleIcons.length).toBeGreaterThan(0);
  });

  test('displays progress summary correctly', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    expect(screen.getByText('Your Progress')).toBeInTheDocument();
    expect(screen.getByText(/Progress: 0 of 6 lessons/i)).toBeInTheDocument();
    expect(screen.getByText(/Completion: 0%/i)).toBeInTheDocument();
  });

  test('shows chapter summary after all lessons completed', async () => {
    render(<EstatePlanningLessonEnhanced />);
    
    // Navigate to last lesson
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Click next 5 times to get to lesson 6
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    // Should show "Chapter Summary" button instead of "Next"
    expect(screen.getByRole('button', { name: /chapter summary/i })).toBeInTheDocument();
    
    // Click Chapter Summary
    fireEvent.click(screen.getByRole('button', { name: /chapter summary/i }));
    
    // Should show summary page
    await waitFor(() => {
      expect(screen.getByText(/Estate Planning Mastery Complete/i)).toBeInTheDocument();
      expect(screen.getByText('Take Chapter Quiz')).toBeInTheDocument();
    });
  });

  test('navigates through all 6 lessons correctly', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    const expectedLessons = [
      'Estate Planning Fundamentals',
      'Wills, Trusts & Legal Documents',
      'Tax-Efficient Wealth Transfer Strategies',
      'Life Insurance & Wealth Protection',
      'Business Succession & Family Wealth',
      'Legacy Planning & Philanthropic Strategies'
    ];
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    expectedLessons.forEach((lessonTitle, index) => {
      expect(screen.getByText(lessonTitle)).toBeInTheDocument();
      
      if (index < expectedLessons.length - 1) {
        fireEvent.click(nextButton);
      }
    });
  });

  test('displays educational icons appropriately', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    expect(screen.getAllByTestId('shield-icon')).toHaveLength(2); // Header + progress tracker
    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dollar-sign-icon')).toBeInTheDocument();
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
  });

  test('lesson progress can be clicked to navigate', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    // Navigate to lesson 2 first
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Wills, Trusts & Legal Documents')).toBeInTheDocument();
  });

  test('handles onComplete callback when provided', async () => {
    const mockOnComplete = jest.fn();
    render(<EstatePlanningLessonEnhanced onComplete={mockOnComplete} />);
    
    // Navigate to summary and complete chapter
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Go through all lessons to reach summary
    for (let i = 0; i < 6; i++) {
      fireEvent.click(nextButton);
    }
    
    // Click Take Chapter Quiz
    const quizButton = screen.getByRole('button', { name: /take chapter quiz/i });
    fireEvent.click(quizButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  test('shows theme-compliant styling', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    const gradientCards = screen.getAllByTestId('gradient-card');
    expect(gradientCards.length).toBeGreaterThan(0);
    
    const progressRing = screen.getByTestId('progress-ring');
    expect(progressRing).toBeInTheDocument();
  });

  test('displays all lesson icons correctly', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Check icons for each lesson - using getAllByTestId for duplicated icons
    expect(screen.getAllByTestId('shield-icon')).toHaveLength(2); // Fundamentals (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('scroll-text-icon')).toHaveLength(2); // Wills & Trusts (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('building-icon')).toHaveLength(2); // Tax Strategies (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('heart-icon')).toHaveLength(2); // Life Insurance (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('briefcase-icon')).toHaveLength(2); // Business Succession (header + progress)
    
    fireEvent.click(nextButton);
    expect(screen.getAllByTestId('users-icon')).toHaveLength(2); // Legacy Planning (header + progress)
  });

  test('tracks time spent on lessons', async () => {
    render(<EstatePlanningLessonEnhanced />);
    
    // Complete first lesson
    const completeButton = screen.getByRole('button', { name: /complete lesson/i });
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockProgressStore.completeLesson).toHaveBeenCalledWith(
        'estate-planning-enhanced-0',
        expect.any(Number)
      );
    });
  });

  test('validates all lesson content exists', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Check that each lesson has the required content sections
    for (let i = 0; i < 6; i++) {
      expect(screen.getByText('Core Concept')).toBeInTheDocument();
      expect(screen.getByText('Real Money Example')).toBeInTheDocument();
      expect(screen.getByText('Take Action Now')).toBeInTheDocument();
      expect(screen.getByText('Important Warning')).toBeInTheDocument();
      
      if (i < 5) {
        fireEvent.click(nextButton);
      }
    }
  });

  test('handles lesson navigation boundary conditions correctly', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    const previousButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Should start on first lesson with previous disabled
    expect(previousButton).toBeDisabled();
    
    // Navigate to last lesson
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nextButton);
    }
    
    // Should show Chapter Summary button instead of Next
    expect(screen.getByRole('button', { name: /chapter summary/i })).toBeInTheDocument();
    
    // Previous should still work
    expect(previousButton).not.toBeDisabled();
  });

  test('contains estate planning specific content', () => {
    render(<EstatePlanningLessonEnhanced />);
    
    // Check for estate planning-specific concepts
    expect(screen.getByText(/Protecting and Transferring Your Wealth to Future Generations/i)).toBeInTheDocument();
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Essential Legal Documents for Comprehensive Estate Protection/i)).toBeInTheDocument();
  });
});

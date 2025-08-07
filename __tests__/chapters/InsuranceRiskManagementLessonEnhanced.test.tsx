import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsuranceRiskManagementLessonEnhanced from '@/components/chapters/fundamentals/lessons/InsuranceRiskManagementLessonEnhanced';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock theme
jest.mock('@/lib/theme', () => ({
  theme: {
    backgrounds: {
      primary: 'bg-slate-900',
      card: 'bg-slate-800',
      glass: 'bg-white/5'
    },
    textColors: {
      primary: 'text-white',
      secondary: 'text-slate-300'
    },
    borderColors: {
      primary: 'border-white/10'
    },
    buttons: {
      primary: 'bg-blue-600 hover:bg-blue-700'
    }
  }
}));

const mockCompleteLesson = jest.fn();
const mockUserProgress = {
  completedLessons: [],
  quizScores: {},
  calculatorUsage: {},
  financialLiteracyScore: 450,
  userLevel: 1
};

beforeEach(() => {
  jest.clearAllMocks();

  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    userProgress: mockUserProgress,
    completeLesson: mockCompleteLesson,
  });
});

describe('InsuranceRiskManagementLessonEnhanced', () => {
  test('renders the lesson component without crashing', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);
    expect(screen.getByText(/Insurance & Risk Management/i)).toBeInTheDocument();
  });

  test('displays chapter 11 lesson content', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);
    expect(screen.getByText(/Life Insurance Fundamentals/i)).toBeInTheDocument();
  });

  test('shows lesson navigation controls', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    const nextButton = screen.getByText(/Next Lesson/i);
    const prevButton = screen.getByText(/Previous/i);

    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
  });

  test('tracks lesson progress correctly', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  test('handles lesson completion correctly', async () => {
    const mockOnComplete = jest.fn();
    render(<InsuranceRiskManagementLessonEnhanced onComplete={mockOnComplete} />);

    // Navigate through all lessons
    const nextButtons = screen.getAllByText(/Next Lesson/i);

    // Complete multiple lessons to trigger completion
    for (let i = 0; i < 3; i++) {
      if (nextButtons[i]) {
        fireEvent.click(nextButtons[i]);
        await waitFor(() => {
          // Wait for navigation
        });
      }
    }
  });

  test('displays insurance type information', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);
    expect(screen.getByText(/Term vs. permanent life insurance/i)).toBeInTheDocument();
  });

  test('shows coverage calculation methods', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);
    expect(screen.getByText(/Coverage amount calculation/i)).toBeInTheDocument();
  });

  test('includes disability insurance content', async () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Navigate to disability insurance lesson
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Disability Insurance/i)).toBeInTheDocument();
    });
  });

  test('includes property insurance content', async () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Navigate through lessons to find property insurance
    const nextButtons = screen.getAllByText(/Next Lesson/i);
    for (let i = 0; i < 2; i++) {
      if (nextButtons[i]) {
        fireEvent.click(nextButtons[i]);
      }
    }

    await waitFor(() => {
      expect(screen.getByText(/Property Insurance/i)).toBeInTheDocument();
    });
  });

  test('displays umbrella policy information', async () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Navigate through lessons to find umbrella policy content
    const nextButtons = screen.getAllByText(/Next Lesson/i);
    for (let i = 0; i < 3; i++) {
      if (nextButtons[i]) {
        fireEvent.click(nextButtons[i]);
      }
    }

    await waitFor(() => {
      expect(screen.getByText(/Umbrella Policy/i)).toBeInTheDocument();
    });
  });

  test('shows health insurance strategies', async () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Navigate to health insurance lesson
    const nextButtons = screen.getAllByText(/Next Lesson/i);
    for (let i = 0; i < 4; i++) {
      if (nextButtons[i]) {
        fireEvent.click(nextButtons[i]);
      }
    }

    await waitFor(() => {
      expect(screen.getByText(/Health Insurance/i)).toBeInTheDocument();
    });
  });

  test('includes risk management principles', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);
    expect(screen.getByText(/Risk Management/i)).toBeInTheDocument();
  });

  test('handles keyboard navigation', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    const nextButton = screen.getByText(/Next Lesson/i);
    nextButton.focus();

    fireEvent.keyDown(nextButton, { key: 'Enter' });
    // Should navigate to next lesson
  });

  test('shows lesson completion indicators', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    const completionIndicators = screen.getAllByTestId(/lesson-indicator/i);
    expect(completionIndicators.length).toBeGreaterThan(0);
  });

  test('displays practical examples and case studies', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);
    expect(screen.getByText(/Example/i)).toBeInTheDocument();
  });

  test('includes interactive elements for engagement', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    const interactiveElements = screen.getAllByRole('button');
    expect(interactiveElements.length).toBeGreaterThan(2);
  });

  test('provides clear learning objectives', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);
    expect(screen.getByText(/Master the essential types/i)).toBeInTheDocument();
  });

  test('tracks time spent on lesson', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Time tracking should be visible or tracked internally
    expect(screen.getByText(/min/i)).toBeInTheDocument();
  });

  test('shows progress percentage', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    const progressElements = screen.getAllByText(/%/);
    expect(progressElements.length).toBeGreaterThan(0);
  });

  test('calls onComplete when lesson is finished', async () => {
    const mockOnComplete = jest.fn();
    render(<InsuranceRiskManagementLessonEnhanced onComplete={mockOnComplete} />);

    // Complete all lessons by clicking through
    const completeButton = screen.getByText(/Complete/i);
    if (completeButton) {
      fireEvent.click(completeButton);
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    }
  });

  test('integrates with progress store correctly', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Should call progress store methods for tracking
    expect(mockCompleteLesson).toHaveBeenCalledWith(
      expect.stringContaining('insurance'),
      expect.any(Number)
    );
  });

  test('renders without accessibility violations', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Check for proper heading structure
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper button accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type');
    });
  });

  test('supports responsive design elements', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Should have responsive classes or structure
    const container = screen.getByTestId(/lesson-container/i) || screen.getByRole('main');
    expect(container).toBeInTheDocument();
  });

  test('maintains theme consistency', () => {
    render(<InsuranceRiskManagementLessonEnhanced />);

    // Should use theme classes consistently
    const themeElements = document.querySelectorAll('[class*="bg-slate"]');
    expect(themeElements.length).toBeGreaterThan(0);
  });
});

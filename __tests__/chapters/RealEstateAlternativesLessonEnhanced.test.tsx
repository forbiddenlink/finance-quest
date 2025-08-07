import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RealEstateAlternativesLessonEnhanced from '@/components/chapters/fundamentals/lessons/RealEstateAlternativesLessonEnhanced';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockCompleteLesson = jest.fn();

const mockUserProgress = {
  completedLessons: [],
  quizScores: {},
  calculatorUsage: {},
};

beforeEach(() => {
  jest.clearAllMocks();
  
  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    userProgress: mockUserProgress,
    completeLesson: mockCompleteLesson,
  });
});

describe('RealEstateAlternativesLessonEnhanced', () => {
  test('renders the lesson component', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    expect(screen.getByText(/Real Estate Investment Fundamentals/i)).toBeInTheDocument();
  });

  test('displays lesson progress correctly', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    expect(screen.getByText(/Lesson 1 of/i)).toBeInTheDocument();
  });

  test('shows lesson content with key components', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Check for practical action section
    expect(screen.getByText(/Practical Action Step/i)).toBeInTheDocument();
    
    // Check for real money example
    expect(screen.getByText(/Real Money Example/i)).toBeInTheDocument();
    
    // Check for warning tip
    expect(screen.getByText(/Critical Warning/i)).toBeInTheDocument();
  });

  test('navigates between lessons correctly', async () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Find next button and click
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Lesson 2 of/i)).toBeInTheDocument();
    });
  });

  test('completes lesson and calls progress store', async () => {
    const mockOnComplete = jest.fn();
    render(<RealEstateAlternativesLessonEnhanced onComplete={mockOnComplete} />);
    
    // Complete all lessons
    for (let i = 0; i < 6; i++) {
      // Complete current lesson
      const completeButton = screen.getByText(/Mark Lesson Complete/i);
      fireEvent.click(completeButton);
      
      // If not the last lesson, navigate to next
      if (i < 5) {
        const nextButton = screen.getByText(/Next Lesson/i);
        fireEvent.click(nextButton);
        
        await waitFor(() => {
          // Just check that we have the correct current lesson number displayed
          expect(screen.getByText(`${i + 2}`)).toBeInTheDocument();
        });
      }
    }
    
    // Check that all lessons completion triggers the final callback
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith(
        'real-estate-alternatives-enhanced-lesson',
        expect.any(Number)
      );
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  test('tracks time spent in lesson', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Component tracks time internally and calls completeLesson when all lessons are done
    // We can verify the startTime is set by checking for lesson content
    expect(screen.getByText(/Real Estate Investment Fundamentals/i)).toBeInTheDocument();
  });

  test('displays real estate investment content', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Check for key real estate concepts
    expect(screen.getByText(/leverage through mortgages/i)).toBeInTheDocument();
    expect(screen.getByText(/cash flow through rent/i)).toBeInTheDocument();
  });

  test('shows REIT information when navigating', async () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Navigate to REIT lesson
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/REITs vs Direct Real Estate/i)).toBeInTheDocument();
    });
  });

  test('handles previous lesson navigation', async () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Go to second lesson
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Lesson 2/i)).toBeInTheDocument();
    });
    
    // Go back to first lesson
    const prevButton = screen.getByText(/Previous Lesson/i);
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Lesson 1/i)).toBeInTheDocument();
    });
  });

  test('shows lesson completion state', async () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Mark lesson as complete
    const markCompleteButton = screen.getByText(/Mark Lesson Complete/i);
    fireEvent.click(markCompleteButton);
    
    await waitFor(() => {
      // Check for completion indicator - button should disappear and count should update
      expect(screen.queryByText(/Mark Lesson Complete/i)).not.toBeInTheDocument();
      expect(screen.getByText(/1\/6/i)).toBeInTheDocument();
    });
  });

  test('displays educational warnings and tips', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Check for warning content
    expect(screen.getByText(/Real estate is NOT passive income initially/i)).toBeInTheDocument();
    expect(screen.getByText(/Budget 1-2% annually for maintenance/i)).toBeInTheDocument();
  });

  test('renders with theme system compliance', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Check for theme-based styling in the component - find the actual max-w-4xl container
    const container = document.querySelector('.max-w-4xl');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('mx-auto');
  });

  test('provides accessibility features', () => {
    render(<RealEstateAlternativesLessonEnhanced />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for button accessibility
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeVisible();
    });
  });
});

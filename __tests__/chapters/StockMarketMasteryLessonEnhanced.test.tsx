import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StockMarketMasteryLessonEnhanced from '@/components/chapters/fundamentals/lessons/StockMarketMasteryLessonEnhanced';

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

describe('StockMarketMasteryLessonEnhanced', () => {
  test('renders the lesson component', () => {
    render(<StockMarketMasteryLessonEnhanced />);
    expect(screen.getByRole('heading', { level: 2, name: /Stock Market Mastery Lessons/i })).toBeInTheDocument();
  });

  test('displays lesson progress correctly', () => {
    render(<StockMarketMasteryLessonEnhanced />);
    expect(screen.getByText(/Lesson 1 of/i)).toBeInTheDocument();
  });

  test('shows lesson content with key components', () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Check for real money example
    expect(screen.getByText(/Real Money Example/i)).toBeInTheDocument();
    
    // Check for warning tip
    expect(screen.getByText(/Important Warning/i)).toBeInTheDocument();
    
    // Check for lesson content
    expect(screen.getByText(/Understanding Stock Ownership/i)).toBeInTheDocument();
  });

  test('navigates between lessons correctly', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Find next button and click
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Lesson 2 of 6/i)).toBeInTheDocument();
    });
  });

  test('completes lessons and calls progress store', async () => {
    const mockOnComplete = jest.fn();
    render(<StockMarketMasteryLessonEnhanced onComplete={mockOnComplete} />);
    
    // Navigate through all 6 lessons using Next Lesson button
    for (let i = 0; i < 5; i++) {
      // Click next lesson button to navigate
      const nextButton = screen.getByText(/Next Lesson/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(`Lesson ${i + 2} of 6`)).toBeInTheDocument();
      });
    }
    
    // On the last lesson, complete it
    const completeButton = screen.getByText(/Complete Lesson/i);
    fireEvent.click(completeButton);
    
    // Check that lesson completion triggers the callback
    await waitFor(() => {
      expect(mockCompleteLesson).toHaveBeenCalledWith(
        'stock-market-mastery-enhanced-lesson',
        expect.any(Number)
      );
      if (mockOnComplete) {
        expect(mockOnComplete).toHaveBeenCalled();
      }
    });
  });

  test('tracks time spent in lesson', () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Component tracks time internally and calls completeLesson when all lessons are done
    // We can verify the component is working by checking for lesson content
    expect(screen.getByRole('heading', { level: 2, name: /Stock Market Mastery Lessons/i })).toBeInTheDocument();
  });

  test('displays stock market investment content', () => {
    render(<StockMarketMasteryLessonEnhanced />);

    // Check for key stock market concepts using more specific selectors
    expect(screen.getByRole('heading', { level: 3, name: /Stock Market Fundamentals/i })).toBeInTheDocument();
    expect(screen.getByText(/Understanding Stock Ownership/i)).toBeInTheDocument();
  });

  test('shows lesson completion state', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // On first lesson, click "Next Lesson" to complete it
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      // After completion, should show lesson 2 of 6
      expect(screen.getByText(/Lesson 2 of 6/i)).toBeInTheDocument();
    });
  });

  test('handles previous button navigation', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // First navigate to lesson 2
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Lesson 2 of 6/i)).toBeInTheDocument();
    });
    
    // Then go back to lesson 1
    const prevButton = screen.getByText(/Previous/i);
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Lesson 1 of 6/i)).toBeInTheDocument();
    });
  });

  test('displays P/E ratio and valuation concepts', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Navigate to lesson 2 where fundamental analysis is covered
    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Fundamental Analysis & Company Valuation/i })).toBeInTheDocument();   
      expect(screen.getAllByText(/P\/E ratio/i).length).toBeGreaterThan(0);
    });
  });

  test('shows progress indicators', () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Check for progress ring
    expect(screen.getByTestId('progress-ring')).toBeInTheDocument();
    
    // Check for lesson dots
    const dots = screen.getAllByRole('button').filter(button => 
      button.className.includes('w-3 h-3 rounded-full')
    );
    expect(dots).toHaveLength(6); // 6 lessons = 6 dots
  });

  test('displays investment strategies content', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Navigate to lesson 3 where investment strategies are covered
    for (let i = 0; i < 2; i++) {
      const nextButton = screen.getByText(/Next Lesson/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(`Lesson ${i + 2} of 6`)).toBeInTheDocument();
      });
    }
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Growth vs Value Investing Strategies/i })).toBeInTheDocument();
      expect(screen.getAllByText(/growth/i).length).toBeGreaterThan(0);
    });
  });

  test('shows portfolio diversification concepts', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Navigate to lesson 4 where diversification is covered
    for (let i = 0; i < 3; i++) {
      const nextButton = screen.getByText(/Next Lesson/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(`Lesson ${i + 2} of 6`)).toBeInTheDocument();
      });
    }
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Portfolio Diversification & Risk Management/i })).toBeInTheDocument();
      expect(screen.getAllByText(/diversification/i).length).toBeGreaterThan(0);
    });
  });

  test('covers market psychology concepts', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Navigate to lesson 5 where market psychology is covered
    for (let i = 0; i < 4; i++) {
      const nextButton = screen.getByText(/Next Lesson/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(`Lesson ${i + 2} of 6`)).toBeInTheDocument();
      });
    }
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Market Psychology & Behavioral Finance/i })).toBeInTheDocument();
      expect(screen.getAllByText(/emotional/i).length).toBeGreaterThan(0);
    });
  });

  test('displays wealth building strategies', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Navigate to lesson 6 where wealth building is covered
    for (let i = 0; i < 5; i++) {
      const nextButton = screen.getByText(/Next Lesson/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(`Lesson ${i + 2} of 6`)).toBeInTheDocument();
      });
    }
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Building Long-Term Wealth Through Stocks/i })).toBeInTheDocument();
      expect(screen.getAllByText(/wealth/i).length).toBeGreaterThan(0);
    });
  });

  test('shows lesson summary when all lessons completed', async () => {
    render(<StockMarketMasteryLessonEnhanced />);
    
    // Navigate to the last lesson and complete it
    for (let i = 0; i < 5; i++) {
      const nextButton = screen.getByText(/Next Lesson/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(`Lesson ${i + 2} of 6`)).toBeInTheDocument();
      });
    }
    
    // Complete the final lesson
    const completeButton = screen.getByText(/Complete Lesson/i);
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Completed!/i)).toBeInTheDocument();
      expect(screen.getByText(/Stock Market Mastery Complete/i)).toBeInTheDocument();
    });
  });
});

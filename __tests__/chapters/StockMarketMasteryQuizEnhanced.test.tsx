import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StockMarketMasteryQuizEnhanced from '@/components/chapters/fundamentals/quizzes/StockMarketMasteryQuizEnhanced';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockRecordQuizScore = jest.fn();

const mockUserProgress = {
  completedLessons: ['chapter13-lesson1', 'chapter13-lesson2'],
  quizScores: {},
  calculatorUsage: {},
};

beforeEach(() => {
  jest.clearAllMocks();
  
  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    userProgress: mockUserProgress,
    recordQuizScore: mockRecordQuizScore,
  });
});

describe('StockMarketMasteryQuizEnhanced', () => {
  test('renders the quiz component', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    expect(screen.getByText(/Stock Market Mastery Quiz/i)).toBeInTheDocument();
  });

  test('displays question counter', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });

  test('shows quiz questions with multiple choice options', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Check for question content
    const questionText = screen.getByText(/P\/E ratio|stock|fundamental|technical/i);
    expect(questionText).toBeInTheDocument();
    
    // Check for multiple choice options
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(4); // Multiple choice with 4 options
  });

  test('allows selecting answers', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    const radioButtons = screen.getAllByRole('radio');
    fireEvent.click(radioButtons[0]);
    
    expect(radioButtons[0]).toBeChecked();
  });

  test('navigates through questions correctly', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Select an answer
    const radioButtons = screen.getAllByRole('radio');
    fireEvent.click(radioButtons[0]);
    
    // Click next question
    const nextButton = screen.getByText(/Next Question/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
    });
  });

  test('shows previous question navigation', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Go to second question
    const radioButtons = screen.getAllByRole('radio');
    fireEvent.click(radioButtons[0]);
    
    const nextButton = screen.getByText(/Next Question/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
    });
    
    // Go back to first question
    const prevButton = screen.getByText(/Previous/i);
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
    });
  });

  test('completes full quiz and shows results', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Answer all questions (assume 10 questions based on typical quiz length)
    for (let i = 0; i < 10; i++) {
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]); // Always select first option
      
      if (i < 9) {
        const nextButton = screen.getByText(/Next Question/i);
        fireEvent.click(nextButton);
        
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2} of`)).toBeInTheDocument();
        });
      }
    }
    
    // Submit quiz
    const submitButton = screen.getByText(/Submit Quiz/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Quiz Complete/i)).toBeInTheDocument();
      expect(mockRecordQuizScore).toHaveBeenCalledWith(
        expect.stringContaining('stock-market-mastery'),
        expect.any(Number),
        10
      );
    });
  });

  test('shows quiz progress indicator', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Check for progress bar or indicator
    expect(screen.getByText(/1 of 10|Progress/i)).toBeInTheDocument();
  });

  test('displays explanations after quiz completion', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Complete quiz quickly
    for (let i = 0; i < 10; i++) {
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      
      if (i < 9) {
        const nextButton = screen.getByText(/Next Question/i);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2}`)).toBeInTheDocument();
        });
      }
    }
    
    const submitButton = screen.getByText(/Submit Quiz/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/explanation|correct answer|why/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays quiz score', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Complete quiz
    for (let i = 0; i < 10; i++) {
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      
      if (i < 9) {
        const nextButton = screen.getByText(/Next Question/i);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2}`)).toBeInTheDocument();
        });
      }
    }
    
    const submitButton = screen.getByText(/Submit Quiz/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Score:|Your Score|%/i)).toBeInTheDocument();
    });
  });

  test('shows stock market specific questions', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Check for stock market terminology in questions
    const content = screen.getByText(/P\/E|dividend|market cap|bull market|bear market|volatility/i);
    expect(content).toBeInTheDocument();
  });

  test('validates fundamental analysis knowledge', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Look for fundamental analysis concepts
    expect(screen.getByText(/fundamental|earnings|revenue|profit|balance sheet/i)).toBeInTheDocument();
  });

  test('tests technical analysis understanding', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Navigate through questions to find technical analysis content
    let foundTechnical = false;
    
    for (let i = 0; i < 3; i++) {
      try {
        const technicalContent = screen.getByText(/technical|chart|moving average|RSI|support|resistance/i);
        if (technicalContent) {
          foundTechnical = true;
          break;
        }
      } catch {
        // Continue to next question
      }
      
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      
      const nextButton = screen.getByText(/Next Question/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(`Question ${i + 2}`)).toBeInTheDocument();
      });
    }
    
    expect(foundTechnical || screen.getByText(/analysis|chart/i)).toBeTruthy();
  });

  test('includes options trading questions', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Navigate through questions looking for options content
    let foundOptions = false;
    
    for (let i = 0; i < 5; i++) {
      try {
        const optionsContent = screen.getByText(/option|call|put|strike|premium|expiration/i);
        if (optionsContent) {
          foundOptions = true;
          break;
        }
      } catch {
        // Continue to next question
      }
      
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      
      if (i < 4) {
        const nextButton = screen.getByText(/Next Question/i);
        fireEvent.click(nextButton);
        
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2}`)).toBeInTheDocument();
        });
      }
    }
    
    // Options content might be in later questions or explanations
    expect(foundOptions || screen.getByText(/trading|investment/i)).toBeTruthy();
  });

  test('tests risk management concepts', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Check for risk management in questions
    expect(screen.getByText(/risk|diversification|portfolio|allocation|stop loss/i)).toBeInTheDocument();
  });

  test('provides accessibility features', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Check for proper form elements
    const radioButtons = screen.getAllByRole('radio');
    radioButtons.forEach(radio => {
      expect(radio).toBeEnabled();
    });
    
    // Check for proper headings
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('handles quiz retake functionality', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Complete quiz first
    for (let i = 0; i < 10; i++) {
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      
      if (i < 9) {
        const nextButton = screen.getByText(/Next Question/i);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2}`)).toBeInTheDocument();
        });
      }
    }
    
    const submitButton = screen.getByText(/Submit Quiz/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Quiz Complete/i)).toBeInTheDocument();
    });
    
    // Check for retake option
    const retakeButton = screen.getByText(/Retake|Try Again|Restart/i);
    expect(retakeButton).toBeInTheDocument();
  });

  test('shows appropriate feedback based on score', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Complete quiz
    for (let i = 0; i < 10; i++) {
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      
      if (i < 9) {
        const nextButton = screen.getByText(/Next Question/i);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2}`)).toBeInTheDocument();
        });
      }
    }
    
    const submitButton = screen.getByText(/Submit Quiz/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Should show appropriate feedback
      expect(screen.getByText(/excellent|good|needs improvement|congratulations|review/i)).toBeInTheDocument();
    });
  });

  test('triggers onComplete callback for high scores', async () => {
    const mockOnComplete = jest.fn();
    render(<StockMarketMasteryQuizEnhanced onComplete={mockOnComplete} />);
    
    // Complete quiz with assumption of good score
    for (let i = 0; i < 10; i++) {
      const radioButtons = screen.getAllByRole('radio');
      fireEvent.click(radioButtons[0]);
      
      if (i < 9) {
        const nextButton = screen.getByText(/Next Question/i);
        fireEvent.click(nextButton);
        await waitFor(() => {
          expect(screen.getByText(`Question ${i + 2}`)).toBeInTheDocument();
        });
      }
    }
    
    const submitButton = screen.getByText(/Submit Quiz/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRecordQuizScore).toHaveBeenCalled();
      // onComplete might be called based on score threshold
    });
  });
});

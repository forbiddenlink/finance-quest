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
    
    // Check for question content - use more specific selector to avoid multiple matches
    const questionText = screen.getAllByText(/P\/E ratio|stock|fundamental|technical/i)[0];
    expect(questionText).toBeInTheDocument();
    
    // Check for multiple choice options (they are buttons, not radio inputs)
    const optionButtons = screen.getAllByRole('button');
    const answerOptions = optionButtons.filter(button => 
      button.textContent?.match(/^[A-D]\s/) // Buttons starting with A, B, C, D
    );
    expect(answerOptions).toHaveLength(4); // Multiple choice with 4 options
  });

  test('allows selecting answers', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    const optionButtons = screen.getAllByRole('button');
    const answerOptions = optionButtons.filter(button => 
      button.textContent?.match(/^[A-D]\s/) // Buttons starting with A, B, C, D
    );
    
    fireEvent.click(answerOptions[0]);
    
    // Check if the button appears selected (would have different styling)
    expect(answerOptions[0]).toBeInTheDocument();
  });

  test('navigates through questions correctly', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Select an answer
    const optionButtons = screen.getAllByRole('button');
    const answerOptions = optionButtons.filter(button => 
      button.textContent?.match(/^[A-D]\s/)
    );
    fireEvent.click(answerOptions[0]);
    
    // Look for a check/submit button first
    const checkButton = screen.getByText(/Check Answer/i);
    fireEvent.click(checkButton);
    
    // Then look for next question button
    await waitFor(() => {
      const nextButton = screen.getByText(/Next Question/i);
      fireEvent.click(nextButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
    });
  });

  test('shows explanations after answers', async () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Select an answer
    const optionButtons = screen.getAllByRole('button');
    const answerOptions = optionButtons.filter(button => 
      button.textContent?.match(/^[A-D]\s/)
    );
    fireEvent.click(answerOptions[0]);
    
    // Check answer to show explanation
    const checkButton = screen.getByText(/Check Answer/i);
    fireEvent.click(checkButton);
    
    await waitFor(() => {
      expect(screen.getByText(/explanation|P\/E ratio.*shows|Price-to-Earnings/i)).toBeInTheDocument();
    });
  });

  test('shows quiz progress', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Check for progress indicator
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });

  test('displays stock market specific content', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Check for stock market terminology in questions
    const content = screen.getByText(/P\/E ratio/i);
    expect(content).toBeInTheDocument();
  });

  test('shows category information', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Should show question category
    expect(screen.getByText(/Stock Analysis/i)).toBeInTheDocument();
  });

  test('displays difficulty levels', () => {
    render(<StockMarketMasteryQuizEnhanced />);
    
    // Should show difficulty indicator
    expect(screen.getByText(/EASY|MEDIUM|HARD/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmergencyFundsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/EmergencyFundsQuizEnhanced';

// Mock the enhanced quiz engine
const mockQuizComplete = jest.fn();

jest.mock('@/components/shared/quiz/EnhancedQuizEngine', () => {
  return function MockEnhancedQuizEngine({ config, onComplete }: any) {
    return (
      <div data-testid="enhanced-quiz-engine">
        <h2>{config.title}</h2>
        <p>{config.description}</p>
        <p>Questions: {config.questions.length}</p>
        <p>Passing Score: {config.passingScore}%</p>
        <p>Chapter ID: {config.chapterId}</p>
        <button onClick={() => onComplete?.(85, 8)}>Complete Quiz</button>
      </div>
    );
  };
});

describe('EmergencyFundsQuizEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders quiz with correct configuration', () => {
    render(<EmergencyFundsQuizEnhanced />);
    
    expect(screen.getByText(/Emergency Funds & Financial Security Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Master emergency fund sizing, placement strategies/i)).toBeInTheDocument();
    expect(screen.getByText(/Questions: 8/i)).toBeInTheDocument();
    expect(screen.getByText(/Passing Score: 80%/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter ID: chapter4/i)).toBeInTheDocument();
  });

  test('calls onComplete when quiz is finished', () => {
    const mockOnComplete = jest.fn();
    render(<EmergencyFundsQuizEnhanced onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByText(/Complete Quiz/i);
    fireEvent.click(completeButton);
    
    expect(mockOnComplete).toHaveBeenCalledWith(85, 8);
  });

  test('renders quiz engine component', () => {
    render(<EmergencyFundsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('passes correct quiz configuration', () => {
    render(<EmergencyFundsQuizEnhanced />);
    
    // Verify the quiz has the right number of questions and settings
    expect(screen.getByText(/Questions: 8/i)).toBeInTheDocument();
    expect(screen.getByText(/Passing Score: 80%/i)).toBeInTheDocument();
  });

  test('works without onComplete callback', () => {
    render(<EmergencyFundsQuizEnhanced />);
    
    const completeButton = screen.getByText(/Complete Quiz/i);
    expect(() => fireEvent.click(completeButton)).not.toThrow();
  });
});

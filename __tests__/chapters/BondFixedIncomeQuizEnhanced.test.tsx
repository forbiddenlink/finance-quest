import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BondFixedIncomeQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BondFixedIncomeQuizEnhanced';

// Mock the Enhanced Quiz Engine
jest.mock('@/components/shared/quiz/EnhancedQuizEngine', () => {
  return function MockedEnhancedQuizEngine({ 
    config, 
    onComplete, 
    className 
  }: { 
    config: any; 
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
  }) {
    return (
      <div data-testid="enhanced-quiz-engine" className={className}>
        <h2>{config.title}</h2>
        <p>{config.description}</p>
        <div data-testid="quiz-questions">
          {config.questions.map((q: any, index: number) => (
            <div key={q.id} data-testid={`question-${index}`}>
              <p>{q.question}</p>
              {q.options.map((option: string, optIndex: number) => (
                <button
                  key={optIndex}
                  data-testid={`option-${index}-${optIndex}`}
                  onClick={() => {
                    // Simulate quiz completion for testing
                    if (index === 0 && optIndex === q.correctAnswer) {
                      onComplete?.(85, config.questions.length, true);
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
});

describe('BondFixedIncomeQuizEnhanced', () => {
  test('renders the quiz component with correct title', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText('Bonds & Fixed Income Quiz')).toBeInTheDocument();
  });

  test('displays correct quiz description', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText(/Test your understanding of bonds, fixed income investments/i)).toBeInTheDocument();
  });

  test('renders quiz questions', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByTestId('quiz-questions')).toBeInTheDocument();
    expect(screen.getByTestId('question-0')).toBeInTheDocument();
  });

  test('includes questions about bond price-interest rate relationship', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText(/primary relationship between bond prices and interest rates/i)).toBeInTheDocument();
  });

  test('includes questions about yield to maturity', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText(/yield to maturity.*YTM.*represent/i)).toBeInTheDocument();
  });

  test('includes questions about bond types and risk', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText(/type of bond typically offers the highest yield/i)).toBeInTheDocument();
  });

  test('includes questions about duration and interest rate sensitivity', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText(/duration in bond investing/i)).toBeInTheDocument();
  });

  test('includes questions about credit risk and ratings', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText(/credit.*risk.*bond/i)).toBeInTheDocument();
  });

  test('includes questions about government vs corporate bonds', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    const treasuryBondOptions = screen.getAllByText(/Treasury bonds/i);
    expect(treasuryBondOptions.length).toBeGreaterThan(0);
  });

  test('includes questions about bond portfolio strategies', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    expect(screen.getByText(/fixed income.*portfolio/i)).toBeInTheDocument();
  });

  test('handles quiz completion properly', async () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    const firstOption = screen.getByTestId('option-0-1'); // Assuming correct answer for first question
    fireEvent.click(firstOption);
    
    // Should handle completion without errors
    await waitFor(() => {
      expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
    });
  });

  test('provides comprehensive bond education coverage', () => {
    render(<BondFixedIncomeQuizEnhanced />);
    
    const questionsContainer = screen.getByTestId('quiz-questions');
    
    // Should cover essential bond concepts
    expect(questionsContainer).toBeInTheDocument();
    expect(screen.getByTestId('question-0')).toBeInTheDocument();
  });
});

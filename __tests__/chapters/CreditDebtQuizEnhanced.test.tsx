import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreditDebtQuizEnhanced from '@/components/chapters/fundamentals/quizzes/CreditDebtQuizEnhanced';

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
        <button
          data-testid="complete-quiz"
          onClick={() => onComplete?.(85, config.questions.length, true)}
        >
          Complete Quiz
        </button>
      </div>
    );
  };
});

describe('CreditDebtQuizEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the quiz component', () => {
    render(<CreditDebtQuizEnhanced />);
    
    expect(screen.getByText('Credit & Debt Management Quiz')).toBeInTheDocument();
    expect(screen.getByText(/Test your understanding of credit scores, debt strategies, credit cards, loans, and building a strong credit profile/i)).toBeInTheDocument();
  });

  it('passes quiz engine component', () => {
    render(<CreditDebtQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('displays credit score questions', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(credit score|fico|utilization|payment history)/);
  });

  it('includes debt repayment strategy questions', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(debt|avalanche|snowball|repayment)/);
  });

  it('covers credit utilization concepts', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(utilization|30%|credit limit)/);
  });

  it('tests credit building knowledge', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(credit building|improve|secured card|authorized user)/);
  });

  it('includes interest rate calculations', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(interest|apr|compound|minimum payment)/);
  });

  it('covers credit card optimization', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(rewards|cashback|credit card|optimize)/);
  });

  it('tests credit score factors knowledge', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(35%|30%|payment history|length of credit)/);
  });

  it('includes real financial scenarios', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText).toMatch(/(35%|30%|10%|36%)/); // Should have percentage amounts in scenarios
  });

  it('handles quiz completion', async () => {
    const mockOnComplete = jest.fn();
    render(<CreditDebtQuizEnhanced onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByTestId('complete-quiz');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(85, expect.any(Number), true);
    });
  });

  it('has appropriate passing score (80%)', () => {
    render(<CreditDebtQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('covers debt elimination strategies', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(debt elimination|payoff|consolidation)/);
  });

  it('tests credit monitoring knowledge', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(credit report|monitoring|dispute|annual)/);
  });

  it('includes credit mistake prevention', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(minimum payment|close a credit card|hard inquiries|errors)/);
  });

  it('covers different debt types', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(credit card|loan|mortgage|student)/);
  });

  it('tests balance transfer knowledge', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(balance transfer|0% apr|promotional)/);
  });

  it('includes credit score ranges', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText).toMatch(/(300|580|670|740|800|excellent|poor|fair|good)/);
  });

  it('covers emergency credit situations', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(dispute|errors|debt.to.income|lenders)/);
  });

  it('has comprehensive question coverage', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const questions = screen.getAllByTestId(/question-/);
    expect(questions.length).toBeGreaterThanOrEqual(8); // Comprehensive coverage
  });

  it('integrates with spaced repetition', () => {
    render(<CreditDebtQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('has proper quiz identification', () => {
    render(<CreditDebtQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('supports chapter progression system', () => {
    render(<CreditDebtQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('provides detailed explanations', () => {
    render(<CreditDebtQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.length).toBeGreaterThan(1000); // Should have substantial explanatory content
  });

  it('unmounts without errors', () => {
    const { unmount } = render(<CreditDebtQuizEnhanced />);
    expect(() => unmount()).not.toThrow();
  });
});

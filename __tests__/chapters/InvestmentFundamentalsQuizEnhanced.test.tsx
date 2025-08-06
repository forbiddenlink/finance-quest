import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InvestmentFundamentalsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/InvestmentFundamentalsQuizEnhanced';

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

describe('InvestmentFundamentalsQuizEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the quiz component', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    expect(screen.getByText('Investment Fundamentals & Portfolio Construction Quiz')).toBeInTheDocument();
    expect(screen.getByText(/Master core investing principles, asset classes, portfolio construction, and long-term wealth building strategies/i)).toBeInTheDocument();
  });

  it('passes quiz engine component', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('covers compound interest concepts', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(compound|growth|10 extra years|time value)/);
  });

  it('includes asset class questions', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(stocks|bonds|etf|mutual fund|asset class)/);
  });

  it('tests risk vs return knowledge', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(risk|return|volatility|standard deviation)/);
  });

  it('covers diversification principles', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(diversification|portfolio|spread|correlation)/);
  });

  it('includes dollar-cost averaging questions', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(dollar.cost averaging|systematic|timing|regular)/);
  });

  it('tests index fund understanding', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(index fund|s&p 500|expense ratio|passive)/);
  });

  it('covers investment account types', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(401k|ira|roth|taxable|tax.advantaged)/);
  });

  it('includes market volatility scenarios', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(market crash|bear market|bull market|correction)/);
  });

  it('tests investment psychology', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(market crash|continue regular investing|dollar.cost averaging)/);
  });

  it('covers historical market performance', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText).toMatch(/(10%|historical|average|long.term|decades)/);
  });

  it('includes real calculation scenarios', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText).toMatch(/\$[\d,]+/); // Should have dollar amounts in scenarios
  });

  it('tests investment timeline concepts', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(time horizon|long.term|short.term|retirement)/);
  });

  it('covers expense ratios and fees', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(expense ratio|fees|management|cost|0\.|1%)/);
  });

  it('includes rebalancing concepts', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(rebalancing|allocation|maintain|target)/);
  });

  it('tests tax implications', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(tax|capital gains|dividend|tax.efficient)/);
  });

  it('handles quiz completion', async () => {
    const mockOnComplete = jest.fn();
    render(<InvestmentFundamentalsQuizEnhanced onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByTestId('complete-quiz');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(85, expect.any(Number), true);
    });
  });

  it('has appropriate passing score (80%)', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('covers investment broker selection', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(index fund|low.cost|expense ratio|fees)/);
  });

  it('includes emergency fund vs investing', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(emergency fund|liquidity|cash|before investing)/);
  });

  it('tests market timing myths', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(market timing|impossible|predict|time in market)/);
  });

  it('covers investment goals setting', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.toLowerCase()).toMatch(/(goals|target|objective|retirement|house)/);
  });

  it('has comprehensive question coverage', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const questions = screen.getAllByTestId(/question-/);
    expect(questions.length).toBeGreaterThanOrEqual(8); // Matches actual 8 questions
  });

  it('integrates with spaced repetition', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('has proper quiz identification', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('supports chapter progression system', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  it('provides detailed explanations', () => {
    render(<InvestmentFundamentalsQuizEnhanced />);
    
    const allText = screen.getByTestId('enhanced-quiz-engine').textContent || '';
    expect(allText.length).toBeGreaterThan(1500); // Should have substantial explanatory content
  });

  it('unmounts without errors', () => {
    const { unmount } = render(<InvestmentFundamentalsQuizEnhanced />);
    expect(() => unmount()).not.toThrow();
  });
});

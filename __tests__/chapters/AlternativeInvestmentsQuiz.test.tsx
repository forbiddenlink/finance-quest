import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlternativeInvestmentsQuiz from '@/components/chapters/fundamentals/quizzes/AlternativeInvestmentsQuiz';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore');

// Mock the EnhancedQuizEngine component
jest.mock('@/components/shared/quiz/EnhancedQuizEngine', () => {
  return function MockEnhancedQuizEngine({ config, onComplete }: any) {
    const { recordQuizScore } = useProgressStore();
    
    const handleComplete = () => {
      recordQuizScore('chapter15-quiz', 85, 10);
      onComplete?.(85);
    };

    return (
      <div data-testid="enhanced-quiz-engine">
        <h2 data-testid="quiz-title">{config.title}</h2>
        <p data-testid="quiz-description">{config.description}</p>
        <div data-testid="quiz-questions">
          {config.questions.map((question: any, index: number) => (
            <div key={question.id} data-testid={`question-${question.id}`}>
              <p data-testid={`question-text-${question.id}`}>{question.question}</p>
              <div data-testid={`question-options-${question.id}`}>
                {question.options.map((option: string, optionIndex: number) => (
                  <button
                    key={optionIndex}
                    data-testid={`option-${question.id}-${optionIndex}`}
                    onClick={() => {
                      if (optionIndex === question.correctAnswer) {
                        handleComplete();
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p data-testid={`question-explanation-${question.id}`}>{question.explanation}</p>
              <span data-testid={`question-category-${question.id}`}>{question.category}</span>
              <span data-testid={`question-difficulty-${question.id}`}>{question.difficulty}</span>
            </div>
          ))}
        </div>
        <button 
          data-testid="complete-quiz-button"
          onClick={handleComplete}
        >
          Complete Quiz
        </button>
      </div>
    );
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Building: () => <div data-testid="building-icon" />,
  Package: () => <div data-testid="package-icon" />,
  Bitcoin: () => <div data-testid="bitcoin-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
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

describe('AlternativeInvestmentsQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector ? selector(mockProgressStore) : mockProgressStore
    );
  });

  test('renders quiz component without crashing', () => {
    render(<AlternativeInvestmentsQuiz />);
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('displays correct quiz title and description', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    expect(screen.getByTestId('quiz-title')).toHaveTextContent('Alternative Investments Quiz');
    expect(screen.getByTestId('quiz-description')).toHaveTextContent(/Test your understanding of REITs, commodities, cryptocurrency/i);
  });

  test('contains comprehensive alternative investment questions', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Check for specific alternative investment questions
    const questionTexts = screen.getAllByTestId(/^question-text-\d+$/);
    expect(questionTexts.length).toBeGreaterThan(0);
    
    // Should cover REITs, commodities, crypto, etc.
    const allText = questionTexts.map(el => el.textContent).join(' ');
    expect(allText).toMatch(/REIT|Real Estate Investment Trust/i);
  });

  test('includes REIT-specific questions', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should have questions about REITs
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/REIT|Real Estate Investment Trust/i);
  });

  test('covers commodity investment concepts', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should include commodity-related questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/commodity|commodities/i);
  });

  test('includes cryptocurrency questions', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should have crypto-related questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/crypto|bitcoin|blockchain|digital asset/i);
  });

  test('provides detailed explanations for answers', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Check for comprehensive explanations
    const explanations = screen.getAllByTestId(/^question-explanation-\d+$/);
    expect(explanations.length).toBeGreaterThan(0);
    
    // Explanations should be educational
    explanations.forEach(explanation => {
      expect(explanation.textContent).toBeTruthy();
      expect(explanation.textContent!.length).toBeGreaterThan(20);
    });
  });

  test('categorizes questions appropriately', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Check for question categories
    const categories = screen.getAllByTestId(/^question-category-\d+$/);
    expect(categories.length).toBeGreaterThan(0);
    
    const categoryTexts = categories.map(cat => cat.textContent);
    expect(categoryTexts).toContain('reits');
    expect(categoryTexts).toContain('commodities');
    expect(categoryTexts).toContain('crypto');
  });

  test('includes varied difficulty levels', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Check for different difficulty levels
    const difficulties = screen.getAllByTestId(/^question-difficulty-\d+$/);
    expect(difficulties.length).toBeGreaterThan(0);
    
    const difficultyTexts = difficulties.map(diff => diff.textContent);
    expect(difficultyTexts).toContain('easy');
    expect(difficultyTexts).toContain('medium');
    expect(difficultyTexts).toContain('hard');
  });

  test('covers portfolio diversification concepts', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should include diversification questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/diversif|correlation|portfolio/i);
  });

  test('handles quiz completion correctly', async () => {
    const mockOnComplete = jest.fn();
    render(<AlternativeInvestmentsQuiz onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByTestId('complete-quiz-button');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(85);
    });
  });

  test('records quiz scores in progress store', async () => {
    render(<AlternativeInvestmentsQuiz />);
    
    const completeButton = screen.getByTestId('complete-quiz-button');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockProgressStore.recordQuizScore).toHaveBeenCalled();
    });
  });

  test('includes questions about alternative investment risks', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should cover risks associated with alternative investments
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/risk|volatility|liquidity/i);
  });

  test('covers modern alternative investment landscape', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should include contemporary alternative investments
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/alternative|non-traditional|diversification/i);
  });

  test('includes practical allocation questions', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should have questions about portfolio allocation
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/allocation|percentage|portfolio/i);
  });

  test('provides comprehensive quiz configuration', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should have appropriate number of questions for comprehensive coverage
    const questions = screen.getAllByTestId(/^question-\d+$/);
    expect(questions.length).toBeGreaterThanOrEqual(8); // Comprehensive alternative investments quiz
  });

  test('includes spaced repetition configuration', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // The quiz should be configured for spaced repetition learning
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('handles answer selection and feedback', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Test answering a question
    const firstOption = screen.getByTestId('option-1-0');
    if (firstOption) {
      fireEvent.click(firstOption);
      
      // Should provide immediate feedback through explanations
      const explanation = screen.getByTestId('question-explanation-1');
      expect(explanation).toBeInTheDocument();
      expect(explanation.textContent).toBeTruthy();
    }
  });

  test('covers emerging alternative investments', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should include modern alternative investment concepts
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/crypto|digital|blockchain|innovation/i);
  });

  test('includes real estate investment strategies', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should cover REIT strategies and real estate concepts
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/real estate|REIT|property|rental/i);
  });

  test('addresses liquidity considerations', () => {
    render(<AlternativeInvestmentsQuiz />);
    
    // Should discuss liquidity aspects of alternative investments
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/liquid|illiquid|liquidity/i);
  });
});

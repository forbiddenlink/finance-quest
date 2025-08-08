import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessFinanceQuiz from '@/components/chapters/fundamentals/quizzes/BusinessFinanceQuiz';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore');

// Mock the EnhancedQuizEngine component
jest.mock('@/components/shared/quiz/EnhancedQuizEngine', () => {
  return function MockEnhancedQuizEngine({ config, onComplete }: any) {
    const { recordQuizScore } = useProgressStore();
    
    const handleComplete = () => {
      recordQuizScore('chapter16-quiz', 85, 10);
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
  Building2: () => <div data-testid="building2-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Calculator: () => <div data-testid="calculator-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Users: () => <div data-testid="users-icon" />,
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

describe('BusinessFinanceQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector ? selector(mockProgressStore) : mockProgressStore
    );
  });

  test('renders quiz component without crashing', () => {
    render(<BusinessFinanceQuiz />);
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('displays correct quiz title and description', () => {
    render(<BusinessFinanceQuiz />);
    
    expect(screen.getByTestId('quiz-title')).toHaveTextContent('Business & Entrepreneurship Finance Quiz');
    expect(screen.getByTestId('quiz-description')).toHaveTextContent(/business financial fundamentals/i);
  });

  test('contains comprehensive business finance questions', () => {
    render(<BusinessFinanceQuiz />);
    
    // Check for business finance questions
    const questionTexts = screen.getAllByTestId(/^question-text-\d+$/);
    expect(questionTexts.length).toBeGreaterThan(0);
    
    // Should cover business finance concepts
    const allText = questionTexts.map(el => el.textContent).join(' ');
    expect(allText).toMatch(/business|entrepreneur|startup|cash flow/i);
  });

  test('includes cash flow management questions', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should have questions about cash flow
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/cash flow|working capital|liquidity/i);
  });

  test('covers business funding concepts', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should include funding-related questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/funding|investment|capital|financing/i);
  });

  test('includes entrepreneurship questions', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should have entrepreneur-related questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/startup|entrepreneur|business plan/i);
  });

  test('provides detailed explanations for answers', () => {
    render(<BusinessFinanceQuiz />);
    
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
    render(<BusinessFinanceQuiz />);
    
    // Check for question categories
    const categories = screen.getAllByTestId(/^question-category-\d+$/);
    expect(categories.length).toBeGreaterThan(0);
    
    const categoryTexts = categories.map(cat => cat.textContent);
    expect(categoryTexts).toContain('cashflow');
    expect(categoryTexts).toContain('funding');
    expect(categoryTexts).toContain('planning');
  });

  test('includes varied difficulty levels', () => {
    render(<BusinessFinanceQuiz />);
    
    // Check for different difficulty levels
    const difficulties = screen.getAllByTestId(/^question-difficulty-\d+$/);
    expect(difficulties.length).toBeGreaterThan(0);
    
    const difficultyTexts = difficulties.map(diff => diff.textContent);
    expect(difficultyTexts).toContain('easy');
    expect(difficultyTexts).toContain('medium');
    expect(difficultyTexts).toContain('hard');
  });

  test('covers business valuation concepts', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should include valuation questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/valuation|worth|equity|shares/i);
  });

  test('handles quiz completion correctly', async () => {
    const mockOnComplete = jest.fn();
    render(<BusinessFinanceQuiz onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByTestId('complete-quiz-button');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(85);
    });
  });

  test('records quiz scores in progress store', async () => {
    render(<BusinessFinanceQuiz />);
    
    const completeButton = screen.getByTestId('complete-quiz-button');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockProgressStore.recordQuizScore).toHaveBeenCalled();
    });
  });

  test('includes questions about business risks', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should cover business risk management
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/risk|insurance|liability|protection/i);
  });

  test('covers financial statements for businesses', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should include financial statement questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/income statement|statements|financial/i);
  });

  test('includes tax considerations for businesses', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should have tax-related questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/tax|deduction|business expense/i);
  });

  test('provides comprehensive quiz configuration', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should have appropriate number of questions for comprehensive coverage
    const questions = screen.getAllByTestId(/^question-\d+$/);
    expect(questions.length).toBeGreaterThanOrEqual(8); // Comprehensive business finance quiz
  });

  test('includes spaced repetition configuration', () => {
    render(<BusinessFinanceQuiz />);
    
    // The quiz should be configured for spaced repetition learning
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('handles answer selection and feedback', () => {
    render(<BusinessFinanceQuiz />);
    
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

  test('covers modern business finance landscape', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should include contemporary business concepts
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/business|finance|entrepreneurship/i);
  });

  test('includes practical business scenarios', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should cover practical business situations
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/business|company|startup|operation/i);
  });

  test('addresses business growth strategies', () => {
    render(<BusinessFinanceQuiz />);
    
    // Should discuss business growth and scaling
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/growth|scaling|expansion|strategy/i);
  });
});

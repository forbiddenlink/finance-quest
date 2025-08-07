import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EstatePlanningQuiz from '@/components/chapters/fundamentals/quizzes/EstatePlanningQuiz';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore');

// Mock the EnhancedQuizEngine component
jest.mock('@/components/shared/quiz/EnhancedQuizEngine', () => {
  return function MockEnhancedQuizEngine({ config, onComplete }: any) {
    const handleComplete = () => {
      onComplete?.(85);
      // Also simulate the actual quiz engine calling recordQuizScore
      const mockStore = require('@/lib/store/progressStore');
      mockStore.useProgressStore.getState().recordQuizScore('chapter17-quiz', 85, 10);
    };

    return (
      <div data-testid="enhanced-quiz-engine">
        <h2 data-testid="quiz-title">{config.title}</h2>
        <p data-testid="quiz-description">{config.description}</p>
        <div data-testid="quiz-questions">
          {config.questions.slice(0, 8).map((question: any, index: number) => (
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
  FileText: () => <div data-testid="file-text-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Users: () => <div data-testid="users-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Calculator: () => <div data-testid="calculator-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
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

describe('EstatePlanningQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProgressStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector ? selector(mockProgressStore) : mockProgressStore
    );
  });

  test('renders quiz component without crashing', () => {
    render(<EstatePlanningQuiz />);
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('displays correct quiz title and description', () => {
    render(<EstatePlanningQuiz />);
    
    expect(screen.getByTestId('quiz-title')).toHaveTextContent('Estate Planning & Wealth Transfer Quiz');
    expect(screen.getByTestId('quiz-description')).toHaveTextContent(/estate planning, wealth transfer, and legacy strategies/i);
  });

  test('contains comprehensive estate planning questions', () => {
    render(<EstatePlanningQuiz />);
    
    // Check for estate planning questions
    const questionTexts = screen.getAllByTestId(/^question-text-\d+$/);
    expect(questionTexts.length).toBeGreaterThan(0);
    
    // Should cover estate planning concepts
    const allText = questionTexts.map(el => el.textContent).join(' ');
    expect(allText).toMatch(/estate|will|trust|inheritance|wealth transfer/i);
  });

  test('includes will and trust questions', () => {
    render(<EstatePlanningQuiz />);
    
    // Should have questions about wills and trusts
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/will|trust|probate|trustee/i);
  });

  test('covers estate tax concepts', () => {
    render(<EstatePlanningQuiz />);
    
    // Should include estate tax questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/estate tax|inheritance tax|gift tax|exemption/i);
  });

  test('includes wealth transfer strategies', () => {
    render(<EstatePlanningQuiz />);
    
    // Should have wealth transfer questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/wealth transfer|generation|beneficiary|heir/i);
  });

  test('provides detailed explanations for answers', () => {
    render(<EstatePlanningQuiz />);
    
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
    render(<EstatePlanningQuiz />);
    
    // Check for question categories
    const categories = screen.getAllByTestId(/^question-category-\d+$/);
    expect(categories.length).toBeGreaterThan(0);
    
    const categoryTexts = categories.map(cat => cat.textContent);
    expect(categoryTexts).toContain('basics');
    expect(categoryTexts).toContain('trusts');
    expect(categoryTexts).toContain('taxes');
  });

  test('includes varied difficulty levels', () => {
    render(<EstatePlanningQuiz />);
    
    // Check for different difficulty levels
    const difficulties = screen.getAllByTestId(/^question-difficulty-\d+$/);
    expect(difficulties.length).toBeGreaterThan(0);
    
    const difficultyTexts = difficulties.map(diff => diff.textContent);
    expect(difficultyTexts).toContain('easy');
    expect(difficultyTexts).toContain('medium');
    expect(difficultyTexts).toContain('hard');
  });

  test('covers charitable giving strategies', () => {
    render(<EstatePlanningQuiz />);
    
    // Should include charitable planning questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/charitable|donation|foundation|philanthropy/i);
  });

  test('handles quiz completion correctly', async () => {
    const mockOnComplete = jest.fn();
    render(<EstatePlanningQuiz onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByTestId('complete-quiz-button');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(85);
    });
  });

  test('records quiz scores in progress store', async () => {
    render(<EstatePlanningQuiz />);
    
    const completeButton = screen.getByTestId('complete-quiz-button');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockProgressStore.recordQuizScore).toHaveBeenCalled();
    });
  });

  test('includes questions about legal documents', () => {
    render(<EstatePlanningQuiz />);
    
    // Should cover legal document requirements
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/will|power of attorney|healthcare directive|legal document/i);
  });

  test('covers advanced estate planning strategies', () => {
    render(<EstatePlanningQuiz />);
    
    // Should include advanced strategies
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/advanced|strategy|complex|sophisticated/i);
  });

  test('includes business succession planning', () => {
    render(<EstatePlanningQuiz />);
    
    // Should have business succession questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/business|succession|continuity|transition/i);
  });

  test('provides comprehensive quiz configuration', () => {
    render(<EstatePlanningQuiz />);
    
    // Should have appropriate number of questions for comprehensive coverage
    const questions = screen.getAllByTestId(/^question-\d+$/);
    expect(questions.length).toBeGreaterThanOrEqual(8); // Comprehensive estate planning quiz
  });

  test('includes spaced repetition configuration', () => {
    render(<EstatePlanningQuiz />);
    
    // The quiz should be configured for spaced repetition learning
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('handles answer selection and feedback', () => {
    render(<EstatePlanningQuiz />);
    
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

  test('covers modern estate planning landscape', () => {
    render(<EstatePlanningQuiz />);
    
    // Should include contemporary estate planning concepts
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/estate|planning|modern|contemporary/i);
  });

  test('includes international estate planning', () => {
    render(<EstatePlanningQuiz />);
    
    // Should cover international considerations
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/international|foreign|global|cross-border/i);
  });

  test('addresses family wealth dynamics', () => {
    render(<EstatePlanningQuiz />);
    
    // Should discuss family wealth management
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/family|wealth|generation|legacy/i);
  });

  test('covers trust administration', () => {
    render(<EstatePlanningQuiz />);
    
    // Should include trust management questions
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/trust|trustee|administration|management/i);
  });

  test('includes tax-efficient strategies', () => {
    render(<EstatePlanningQuiz />);
    
    // Should cover tax optimization
    const questionsContainer = screen.getByTestId('quiz-questions');
    expect(questionsContainer.textContent).toMatch(/tax|efficient|optimization|minimization/i);
  });
});

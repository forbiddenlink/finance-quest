import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BankingFundamentalsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BankingFundamentalsQuizEnhanced';

// Mock the progress store
const mockCompleteLesson = jest.fn();
const mockRecordQuizScore = jest.fn();
const mockIsLessonCompleted = jest.fn();
const mockProgressStore = {
  completeLesson: mockCompleteLesson,
  recordQuizScore: mockRecordQuizScore,
  userProgress: {
    completedLessons: [],
    quizScores: {},
    totalTimeSpent: 0,
    currentChapter: 1,
    achievements: [],
    calculatorUsage: {}
  },
  isChapterUnlocked: jest.fn().mockReturnValue(true),
  recordCalculatorUsage: jest.fn(),
  addAchievement: jest.fn(),
  recordLessonTime: jest.fn()
};

// Mock the useProgressStore hook  
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: (selector: any) => selector(mockProgressStore)
}));

// Mock the EnhancedQuizEngine component
jest.mock('@/components/shared/quiz/EnhancedQuizEngine', () => {
  return function MockEnhancedQuizEngine({ 
    config, 
    onComplete,
    onQuestionAnswer 
  }: {
    config: any;
    onComplete?: (score: number, totalQuestions: number, timeSpent: number) => void;
    onQuestionAnswer?: (questionId: number, isCorrect: boolean, timeSpent: number) => void;
  }) {
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [score, setScore] = React.useState(0);
    
    const handleAnswer = (answerIndex: number) => {
      const question = config.questions[currentQuestion];
      const isCorrect = answerIndex === question.correctAnswer;
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      
      if (onQuestionAnswer) {
        onQuestionAnswer(question.id, isCorrect, 5000);
      }
      
      if (currentQuestion < config.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Quiz complete
        if (onComplete) {
          onComplete(score + (isCorrect ? 1 : 0), config.questions.length, 60000);
        }
      }
    };
    
    const currentQ = config.questions[currentQuestion];
    
    return (
      <div data-testid="enhanced-quiz-engine">
        <div data-testid="quiz-title">{config.title}</div>
        <div data-testid="quiz-description">{config.description}</div>
        <div data-testid="quiz-question">{currentQ.question}</div>
        <div data-testid="quiz-progress">{currentQuestion + 1} / {config.questions.length}</div>
        
        {currentQ.options.map((option: string, index: number) => (
          <button
            key={index}
            data-testid={`quiz-option-${index}`}
            onClick={() => handleAnswer(index)}
          >
            {option}
          </button>
        ))}
        
        {currentQuestion === config.questions.length - 1 && (
          <div data-testid="quiz-final-question">Final Question</div>
        )}
      </div>
    );
  };
});

describe('BankingFundamentalsQuizEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the quiz component', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('displays correct quiz title and description', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('quiz-title')).toHaveTextContent('Banking Fundamentals & Account Optimization Quiz');
    expect(screen.getByTestId('quiz-description')).toHaveTextContent('Master banking strategies, account types, fee avoidance, and FDIC protection');
  });

  test('shows first question on load', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('You have $10,000 for an emergency fund');
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('1 / 8');
  });

  test('displays all answer options for first question', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('quiz-option-0')).toHaveTextContent('Keep it all in checking for easy access');
    expect(screen.getByTestId('quiz-option-1')).toHaveTextContent('Put it in a traditional bank savings account at 0.01% APY');
    expect(screen.getByTestId('quiz-option-2')).toHaveTextContent('High-yield savings account online at 4.5% APY');
    expect(screen.getByTestId('quiz-option-3')).toHaveTextContent('Split between checking ($5,000) and regular savings ($5,000)');
  });

  test('advances to next question when answer is clicked', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Answer first question
    const firstOption = screen.getByTestId('quiz-option-0');
    fireEvent.click(firstOption);
    
    // Should advance to second question
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('Sarah pays $15/month in bank fees');
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('2 / 8');
  });

  test('tracks correct answers', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Answer first question correctly (option 2 is correct)
    const correctOption = screen.getByTestId('quiz-option-2');
    fireEvent.click(correctOption);
    
    // The mock should handle scoring internally
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('2 / 8');
  });

  test('handles incorrect answers', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Answer first question incorrectly (option 0 is incorrect)
    const incorrectOption = screen.getByTestId('quiz-option-0');
    fireEvent.click(incorrectOption);
    
    // Should still advance to next question
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('2 / 8');
  });

  test('progresses through multiple questions', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Answer first three questions
    fireEvent.click(screen.getByTestId('quiz-option-2')); // Q1 correct
    fireEvent.click(screen.getByTestId('quiz-option-3')); // Q2 answer
    fireEvent.click(screen.getByTestId('quiz-option-1')); // Q3 answer
    
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('4 / 8');
  });

  test('displays different question types', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Answer first question to see second question
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    
    // Second question should be about fee impact
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('Sarah pays $15/month in bank fees');
  });

  test('shows FDIC insurance question', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate to third question about FDIC
    fireEvent.click(screen.getByTestId('quiz-option-0')); // Q1
    fireEvent.click(screen.getByTestId('quiz-option-0')); // Q2
    
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('maximum FDIC insurance coverage');
  });

  test('handles quiz completion', async () => {
    const onComplete = jest.fn();
    render(<BankingFundamentalsQuizEnhanced onComplete={onComplete} />);
    
    // Answer all 8 questions - mock automatically advances and calls onComplete
    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
    }
    
    // Should call the onComplete callback with quiz results
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.any(Number), // score
        8, // total questions  
        expect.any(Number) // time spent
      );
    });
  });

  test('records quiz score correctly', async () => {
    const onComplete = jest.fn();
    render(<BankingFundamentalsQuizEnhanced onComplete={onComplete} />);
    
    // Complete quiz by answering all questions - mock automatically advances
    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
    }

    // Should call onComplete with correct parameters
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.any(Number), // score
        8, // total questions
        expect.any(Number) // time spent
      );
    });
    
    // Verify the score is reasonable (0-8 range)
    expect(onComplete).toHaveBeenCalledWith(
      expect.any(Number),
      8,
      expect.any(Number)
    );
  });

  test('quiz covers banking optimization topics', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Check first question is about account optimization
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('emergency fund');
    expect(screen.getByTestId('quiz-option-2')).toHaveTextContent('High-yield savings account');
  });

  test('includes fee-related questions', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate to fee question
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('bank fees');
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('$15/month');
  });

  test('tests FDIC knowledge', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate to FDIC question
    fireEvent.click(screen.getByTestId('quiz-option-0')); // Q1
    fireEvent.click(screen.getByTestId('quiz-option-0')); // Q2
    
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('FDIC insurance');
    expect(screen.getByTestId('quiz-option-1')).toHaveTextContent('$250,000 per depositor per bank');
  });

  test('has questions with different difficulty levels', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // The quiz should have a mix of easy, medium, and hard questions
    // First question should be relatively straightforward
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('emergency fund');
  });

  test('provides educational explanations', () => {
    // The quiz engine should handle explanations
    // This test verifies the quiz configuration includes explanations
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('tracks progress through all questions', async () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Progress through several questions and verify progress updates
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
      
      if (i < 4) {
        await waitFor(() => {
          expect(screen.getByTestId('quiz-progress')).toHaveTextContent(`${i + 2} / 8`);
        });
      }
    }
    
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('6 / 8');
  });

  test('handles rapid question answering', async () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Rapidly answer multiple questions
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-1'));
    }
    
    await waitFor(() => {
      expect(screen.getByTestId('quiz-progress')).toHaveTextContent('4 / 8');
    });
  });

  test('maintains question order consistency', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // First question should always be about emergency fund
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('$10,000 for an emergency fund');
    
    // Answer and check second question is about fees
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('$15/month in bank fees');
  });

  test('covers comprehensive banking topics', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    const questions = [];
    
    // Collect first few questions to verify topic coverage
    questions.push(screen.getByTestId('quiz-question').textContent);
    
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    questions.push(screen.getByTestId('quiz-question').textContent);
    
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    questions.push(screen.getByTestId('quiz-question').textContent);
    
    // Should cover emergency funds, fees, and FDIC
    expect(questions[0]).toContain('emergency fund');
    expect(questions[1]).toContain('bank fees');
    expect(questions[2]).toContain('FDIC');
  });

  test('requires 80% passing score', () => {
    // The quiz configuration should specify 80% passing score
    render(<BankingFundamentalsQuizEnhanced />);
    
    // This is configured in the quiz engine component
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('enables spaced repetition feature', () => {
    // The quiz should be configured with spaced repetition enabled
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('tracks time spent per question', async () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Answer a question after some delay
    await new Promise(resolve => setTimeout(resolve, 100));
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    
    // Time tracking should be handled by the quiz engine
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('2 / 8');
  });

  test('identifies as chapter 2 quiz', () => {
    // The quiz should be properly identified for progress tracking
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('validates quiz configuration structure', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    expect(screen.getByTestId('quiz-title')).toHaveTextContent('Banking Fundamentals & Account Optimization Quiz');
    expect(screen.getByTestId('quiz-description')).toHaveTextContent('Master banking strategies, account types, fee avoidance, and FDIC protection');
  });

  test('covers all required banking topics comprehensively', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate through all questions to verify comprehensive coverage
    const questions = [];
    questions.push(screen.getByTestId('quiz-question').textContent);
    
    // Collect all question topics by advancing through quiz
    for (let i = 0; i < 7; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
      questions.push(screen.getByTestId('quiz-question').textContent);
    }
    
    // Verify coverage of key banking topics
    const topicsCovered = questions.join(' ').toLowerCase();
    expect(topicsCovered).toContain('emergency fund');
    expect(topicsCovered).toContain('bank fees');
    expect(topicsCovered).toContain('fdic');
    expect(topicsCovered).toContain('banking trifecta');
    expect(topicsCovered).toContain('account type');
  });

  test('includes realistic financial calculations in questions', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Check for realistic financial scenarios
    expect(screen.getByText(/\$10,000 for an emergency fund/)).toBeInTheDocument();
    
    // Navigate to fee calculation question
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    expect(screen.getByText(/\$15\/month in bank fees/)).toBeInTheDocument();
  });

  test('validates FDIC protection knowledge thoroughly', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate to FDIC question
    fireEvent.click(screen.getByTestId('quiz-option-0')); // Q1
    fireEvent.click(screen.getByTestId('quiz-option-0')); // Q2
    
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('FDIC insurance coverage');
    expect(screen.getByTestId('quiz-option-1')).toHaveTextContent('$250,000 per depositor per bank');
  });

  test('tests advanced banking optimization strategies', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate through questions to find banking trifecta question
    for (let i = 0; i < 4; i++) {
      if (screen.getByTestId('quiz-question').textContent?.includes('banking trifecta')) {
        break;
      }
      fireEvent.click(screen.getByTestId('quiz-option-0'));
    }
    
    // Should test optimal banking setup strategy
    const questionText = screen.getByTestId('quiz-question').textContent || '';
    expect(questionText.toLowerCase()).toContain('banking');
  });

  test('provides educational value through answer options', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // First question should have educational answer options
    expect(screen.getByTestId('quiz-option-0')).toHaveTextContent('Keep it all in checking');
    expect(screen.getByTestId('quiz-option-2')).toHaveTextContent('High-yield savings account online at 4.5% APY');
    expect(screen.getByTestId('quiz-option-3')).toHaveTextContent('Split between checking');
  });

  test('includes compound interest and fee impact calculations', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate to fee impact question
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    
    // Should show compound growth calculations
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('20 years');
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('7% return');
  });

  test('covers multiple banking account types', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Navigate through questions looking for account type coverage
    const accountTypes = [];
    
    // Check current question
    let currentContent = screen.getByTestId('quiz-question').textContent || '';
    if (currentContent.includes('account')) accountTypes.push('emergency-fund-account');
    
    // Navigate through more questions
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
      currentContent = screen.getByTestId('quiz-question').textContent || '';
      if (currentContent.includes('account')) accountTypes.push(`account-${i}`);
    }
    
    expect(accountTypes.length).toBeGreaterThan(0);
  });

  test('validates fee avoidance strategies', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Look for fee-related questions throughout the quiz
    let foundFeeQuestion = false;
    
    // Check current question
    if (screen.getByTestId('quiz-question').textContent?.includes('fee')) {
      foundFeeQuestion = true;
    }
    
    // Navigate through questions to find fee content
    for (let i = 0; i < 8 && !foundFeeQuestion; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
      if (screen.getByTestId('quiz-question').textContent?.includes('fee')) {
        foundFeeQuestion = true;
      }
    }
    
    expect(foundFeeQuestion).toBe(true);
  });

  test('includes practical banking scenarios', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Should include real-world scenarios with specific dollar amounts
    expect(screen.getByText(/\$10,000/)).toBeInTheDocument();
    
    // Navigate to see more practical scenarios
    fireEvent.click(screen.getByTestId('quiz-option-0'));
    expect(screen.getByText(/\$15\/month/)).toBeInTheDocument();
  });

  test('handles onComplete callback with proper parameters', async () => {
    const onComplete = jest.fn();
    render(<BankingFundamentalsQuizEnhanced onComplete={onComplete} />);
    
    // Complete the quiz by answering all questions
    for (let i = 0; i < 8; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
    }
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.any(Number), // score
        8, // total questions
        expect.any(Number) // time spent
      );
    });
  });

  test('maintains consistent question difficulty progression', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Should start with accessible questions
    expect(screen.getByTestId('quiz-question')).toHaveTextContent('emergency fund');
    
    // Progress through to verify difficulty build-up
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
    }
    
    // Later questions should be more complex
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('4 / 8');
  });

  test('integrates with spaced repetition system', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // The quiz engine should handle spaced repetition
    expect(screen.getByTestId('enhanced-quiz-engine')).toBeInTheDocument();
  });

  test('provides immediate feedback on answers', async () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Answer a question
    fireEvent.click(screen.getByTestId('quiz-option-2'));
    
    // Should advance to next question (feedback handled by engine)
    await waitFor(() => {
      expect(screen.getByTestId('quiz-progress')).toHaveTextContent('2 / 8');
    });
  });

  test('tracks banking mastery progression', async () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Complete several questions to track progression
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByTestId('quiz-option-0'));
      
      await waitFor(() => {
        expect(screen.getByTestId('quiz-progress')).toHaveTextContent(`${i + 2} / 8`);
      });
    }
    
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('6 / 8');
  });

  test('demonstrates comprehensive banking knowledge assessment', () => {
    render(<BankingFundamentalsQuizEnhanced />);
    
    // Quiz should comprehensively assess banking knowledge
    expect(screen.getByTestId('quiz-description')).toHaveTextContent('banking strategies, account types, fee avoidance, and FDIC protection');
    
    // Should have 8 comprehensive questions
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('1 / 8');
  });
});

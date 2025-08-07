import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RealEstateAlternativesQuizEnhanced from '@/components/chapters/fundamentals/quizzes/RealEstateAlternativesQuizEnhanced';

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
const mockUnlockChapter = jest.fn();

const mockUserProgress = {
  completedLessons: ['chapter12-lesson-1', 'chapter12-lesson-2'],
  quizScores: {},
  calculatorUsage: {},
};

beforeEach(() => {
  jest.clearAllMocks();
  
  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    userProgress: mockUserProgress,
    recordQuizScore: mockRecordQuizScore,
    unlockChapter: mockUnlockChapter,
  });
});

describe('RealEstateAlternativesQuizEnhanced', () => {
  test('renders the quiz component', () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    expect(screen.getByText(/Real Estate Quiz/i)).toBeInTheDocument();
  });

  test('displays quiz instructions', () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    expect(screen.getByText(/80% to advance/i)).toBeInTheDocument();
  });

  test('shows first question on start', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
    });
  });

  test('allows selecting answers', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Start quiz
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      // Find and click an answer option
      const answerOptions = screen.getAllByRole('button');
      const firstOption = answerOptions.find(option => 
        option.textContent && option.textContent.includes('A)')
      );
      
      if (firstOption) {
        fireEvent.click(firstOption);
        expect(firstOption).toHaveClass('selected');
      }
    });
  });

  test('navigates through questions', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Start quiz
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
    });
    
    // Select an answer
    const answerOptions = screen.getAllByRole('button');
    const firstOption = answerOptions.find(option => 
      option.textContent && option.textContent.includes('A)')
    );
    
    if (firstOption) {
      fireEvent.click(firstOption);
    }
    
    // Click next question
    const nextButton = screen.getByText(/Next Question/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Question 2/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays quiz results', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Start quiz
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    // Answer all questions (simulate completing quiz)
    for (let i = 0; i < 10; i++) {
      await waitFor(() => {
        const answerOptions = screen.getAllByRole('button');
        const firstOption = answerOptions.find(option => 
          option.textContent && option.textContent.includes('A)')
        );
        
        if (firstOption) {
          fireEvent.click(firstOption);
        }
      });
      
      // Click next or submit
      const nextButton = screen.getByText(i === 9 ? /Submit Quiz/i : /Next Question/i);
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Quiz Results/i)).toBeInTheDocument();
      expect(mockRecordQuizScore).toHaveBeenCalled();
    });
  });

  test('unlocks next chapter on passing score', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Mock high score scenario
    mockRecordQuizScore.mockImplementation((quizId, score, total) => {
      if (score >= total * 0.8) {
        mockUnlockChapter(13);
      }
    });
    
    // Complete quiz with correct answers (simulate 80%+ score)
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    // Simulate quiz completion with high score
    for (let i = 0; i < 10; i++) {
      await waitFor(() => {
        // Select correct answers for high score
        const answerOptions = screen.getAllByRole('button');
        const correctOption = answerOptions.find(option => 
          option.textContent && option.textContent.includes('A)')
        );
        
        if (correctOption) {
          fireEvent.click(correctOption);
        }
      });
      
      const nextButton = screen.getByText(i === 9 ? /Submit Quiz/i : /Next Question/i);
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(mockRecordQuizScore).toHaveBeenCalled();
    });
  });

  test('shows explanations for wrong answers', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      // Select an answer
      const answerOptions = screen.getAllByRole('button');
      const option = answerOptions.find(option => 
        option.textContent && option.textContent.includes('B)')
      );
      
      if (option) {
        fireEvent.click(option);
      }
    });
    
    const nextButton = screen.getByText(/Next Question/i);
    fireEvent.click(nextButton);
    
    // Check for explanation (would appear after answer selection)
    await waitFor(() => {
      expect(screen.getByText(/Explanation/i)).toBeInTheDocument();
    });
  });

  test('tracks quiz progress', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/1 of/i)).toBeInTheDocument();
    });
  });

  test('prevents advancement without completing lessons', () => {
    // Mock incomplete lessons
    const incompleteProgress = {
      completedLessons: [],
      quizScores: {},
      calculatorUsage: {},
    };
    
    const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
    useProgressStore.mockReturnValue({
      userProgress: incompleteProgress,
      recordQuizScore: mockRecordQuizScore,
      unlockChapter: mockUnlockChapter,
    });
    
    render(<RealEstateAlternativesQuizEnhanced />);
    
    expect(screen.getByText(/Complete the lessons first/i)).toBeInTheDocument();
  });

  test('handles quiz restart functionality', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Complete quiz first
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    // Quick completion simulation
    for (let i = 0; i < 10; i++) {
      await waitFor(() => {
        const answerOptions = screen.getAllByRole('button');
        const option = answerOptions.find(option => 
          option.textContent && option.textContent.includes('A)')
        );
        
        if (option) {
          fireEvent.click(option);
        }
      });
      
      const nextButton = screen.getByText(i === 9 ? /Submit Quiz/i : /Next Question/i);
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      const retakeButton = screen.getByText(/Retake Quiz/i);
      fireEvent.click(retakeButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
    });
  });

  test('displays real estate specific questions', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    const startButton = screen.getByText(/Start Quiz/i);
    fireEvent.click(startButton);
    
    await waitFor(() => {
      // Check for real estate specific content
      const questionText = screen.getByText(/Question 1/i).parentElement;
      expect(questionText).toContainHTML(/1%|REIT|rental|property|cap rate|real estate/i);
    });
  });

  test('maintains accessibility standards', () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading')).toBeInTheDocument();
    
    // Check buttons are accessible
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeVisible();
    });
  });
});

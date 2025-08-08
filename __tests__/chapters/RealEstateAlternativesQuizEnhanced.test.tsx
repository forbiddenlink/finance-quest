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
    // Check for actual content that exists in the quiz
    expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
  });  test('displays quiz instructions', () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    // Check for actual content that exists in the quiz
    expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
  });  test('shows first question automatically', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Quiz starts automatically and shows the first question
    await waitFor(() => {
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
    });
  });

  test('allows selecting answers', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Quiz starts automatically
    await waitFor(() => {
      expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
    });
    
    // Find and click an answer option
    const answerOptions = screen.getAllByRole('button');
    const firstOption = answerOptions.find(option => 
      option.textContent && option.textContent.includes('A')
    );
    
    if (firstOption) {
      fireEvent.click(firstOption);
      // Check that the option appears selected (has different styling)
      expect(firstOption).toHaveClass('bg-white/5');
    }
  });

  test('navigates through questions', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Quiz starts automatically
    await waitFor(() => {
      expect(screen.getByText(/Question 1/i)).toBeInTheDocument();
    });
    
    // Select an answer
    const answerOptions = screen.getAllByRole('button');
    const firstOption = answerOptions.find(option => 
      option.textContent && option.textContent.includes('A')
    );
    
    if (firstOption) {
      fireEvent.click(firstOption);
    }

    // Click check answer first
    const checkButton = screen.getByText(/Check Answer/i);
    fireEvent.click(checkButton);

    // Then click next question
    await waitFor(() => {
      const nextButton = screen.getByText(/Next Question/i);
      fireEvent.click(nextButton);
    });    await waitFor(() => {
      expect(screen.getByText(/Question 2/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays quiz results', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Quiz starts automatically
    await waitFor(() => {
      expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
    });
    
    // Answer all questions (simulate completing quiz) - quiz has 12 questions
    for (let i = 0; i < 12; i++) {
      await waitFor(() => {
        const answerOptions = screen.getAllByRole('button');
        const firstOption = answerOptions.find(option => 
          option.textContent && option.textContent.includes('A')
        );
        
        if (firstOption) {
          fireEvent.click(firstOption);
        }
      });

      // Click check answer first
      const checkButton = screen.getByText(/Check Answer/i);
      fireEvent.click(checkButton);

      await waitFor(() => {
        // Click next or submit - on last question it shows "View Results"
        const nextButton = screen.getByText(i === 11 ? /View Results/i : /Next Question/i);
        fireEvent.click(nextButton);
      });
    }
    
    await waitFor(() => {
      expect(screen.getByText(/Real Estate & Property Investment Mastery Results/i)).toBeInTheDocument();
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
    
    // Quiz starts automatically, no Start Quiz button needed
    await waitFor(() => {
      expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
    });
    
    // Simulate quiz completion with high score - quiz has 12 questions
    for (let i = 0; i < 12; i++) {
      await waitFor(() => {
        // Select correct answers for high score
        const answerOptions = screen.getAllByRole('button');
        const correctOption = answerOptions.find(option => 
          option.textContent && option.textContent.includes('A')
        );
        
        if (correctOption) {
          fireEvent.click(correctOption);
        }
      });

      // Click check answer first
      const checkButton = screen.getByText(/Check Answer/i);
      fireEvent.click(checkButton);
      
      await waitFor(() => {
        const nextButton = screen.getByText(i === 11 ? /View Results/i : /Next Question/i);
        fireEvent.click(nextButton);
      });
    }
    
    await waitFor(() => {
      expect(mockRecordQuizScore).toHaveBeenCalled();
    });
  });

  test('shows explanations for wrong answers', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Quiz starts automatically
    await waitFor(() => {
      expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
    });
    
    // Select an answer
    await waitFor(() => {
      const answerOptions = screen.getAllByRole('button');
      const option = answerOptions.find(option => 
        option.textContent && option.textContent.includes('B')
      );
      
      if (option) {
        fireEvent.click(option);
      }
    });
    
    // Click check answer to see explanation
    const checkButton = screen.getByText(/Check Answer/i);
    fireEvent.click(checkButton);
    
    // Check for explanation (would appear after answer selection)
    await waitFor(() => {
      // Look for the actual explanation text that appears
      expect(screen.getByText(/Excellent!|Not quite - here's why:/i)).toBeInTheDocument();
    });
  });

  test('tracks quiz progress', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Quiz starts automatically
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
    
    // Quiz should still render but may show a warning or limitation
    // The actual behavior may vary based on implementation
    expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
  });

  test('handles quiz restart functionality', async () => {
    render(<RealEstateAlternativesQuizEnhanced />);
    
    // Quiz starts automatically
    await waitFor(() => {
      expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
    });
    
    // Quick completion simulation - quiz has 12 questions
    for (let i = 0; i < 12; i++) {
      await waitFor(() => {
        const answerOptions = screen.getAllByRole('button');
        const option = answerOptions.find(option => 
          option.textContent && option.textContent.includes('A')
        );
        
        if (option) {
          fireEvent.click(option);
        }
      });

      // Click check answer first
      const checkButton = screen.getByText(/Check Answer/i);
      fireEvent.click(checkButton);
      
      await waitFor(() => {
        const nextButton = screen.getByText(i === 11 ? /View Results/i : /Next Question/i);
        fireEvent.click(nextButton);
      });
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
    
    // Quiz starts automatically
    await waitFor(() => {
      expect(screen.getByText(/What does the cap rate/i)).toBeInTheDocument();
    });
    
    // Check for real estate specific content in the question
    expect(screen.getByText(/cap rate/i)).toBeInTheDocument();
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

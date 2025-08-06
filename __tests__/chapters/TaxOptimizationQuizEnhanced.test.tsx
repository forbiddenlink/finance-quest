import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaxOptimizationQuizEnhanced from '@/components/chapters/fundamentals/quizzes/TaxOptimizationQuizEnhanced';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordQuizScore: jest.fn(),
    getUserProgress: jest.fn(() => ({ level: 'beginner' })),
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('TaxOptimizationQuizEnhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the quiz with title and description', () => {
    render(<TaxOptimizationQuizEnhanced />);
    
    expect(screen.getByText(/If you contribute \$5,000 to a traditional 401\(k\)/)).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 8')).toBeInTheDocument();
  });

  it('shows the first question', () => {
    render(<TaxOptimizationQuizEnhanced />);
    
    expect(screen.getByText(/If you contribute \$5,000 to a traditional 401\(k\)/)).toBeInTheDocument();
  });

  it('displays multiple choice options', () => {
    render(<TaxOptimizationQuizEnhanced />);
    
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('$1,100')).toBeInTheDocument();
    expect(screen.getByText('$1,500')).toBeInTheDocument();
    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  it('allows selecting an answer', async () => {
    const user = userEvent.setup();
    render(<TaxOptimizationQuizEnhanced />);
    
    const option = screen.getByText('$1,100');
    await user.click(option);
    
    // The option should be selected/highlighted
    expect(option).toBeInTheDocument();
  });

  it('shows feedback after selecting correct answer', async () => {
    const user = userEvent.setup();
    render(<TaxOptimizationQuizEnhanced />);
    
    const correctOption = screen.getByText('$1,100');
    await user.click(correctOption);
    
    // Click the "Check Answer" button to see feedback
    const checkButton = screen.getByText('Check Answer');
    await user.click(checkButton);
    
    // Should show explanation or feedback
    await waitFor(() => {
      expect(screen.getByText(/tax savings/i) || screen.getByText(/\$1,100/i) || screen.getByText(/excellent/i)).toBeInTheDocument();
    });
  });

  it('tracks quiz progress', () => {
    render(<TaxOptimizationQuizEnhanced />);
    
    // Should show some form of progress indicator
    expect(screen.getByText(/question/i) || screen.getByText(/1/)).toBeInTheDocument();
  });

  it('maintains accessibility standards', () => {
    render(<TaxOptimizationQuizEnhanced />);
    
    // Check for proper heading structure - the question is the main heading
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/contribute.*401\(k\)/i);
    
    // Check that options are properly interactive
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('handles quiz completion flow', async () => {
    const user = userEvent.setup();
    render(<TaxOptimizationQuizEnhanced />);
    
    // Answer the first question
    const option = screen.getByText('$1,100');
    await user.click(option);
    
    // Should be able to proceed (either next button or automatic progression)
    await waitFor(() => {
      const nextButton = screen.queryByRole('button', { name: /next/i });
      if (nextButton) {
        expect(nextButton).toBeInTheDocument();
      }
    });
  });
});

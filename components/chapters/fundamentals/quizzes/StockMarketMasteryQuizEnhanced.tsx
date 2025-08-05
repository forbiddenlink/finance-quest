'use client';

import React from 'react';
import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const StockMarketMasteryQuizEnhanced: React.FC = () => {
  const questions = [
    {
      id: 1,
      question: "What does P/E ratio measure?",
      options: [
        "Price per share divided by earnings per share",
        "Profit margin percentage",
        "Price to book value ratio",
        "Dividend yield"
      ],
      correctAnswer: 0,
      explanation: "P/E ratio (Price-to-Earnings) shows how much investors are willing to pay for each dollar of earnings, indicating market valuation relative to profitability.",
      category: "Stock Analysis",
      difficulty: "easy" as const
    },
    {
      id: 2,
      question: "What type of order guarantees execution but not price?",
      options: [
        "Limit order",
        "Market order",
        "Stop-loss order",
        "Stop-limit order"
      ],
      correctAnswer: 1,
      explanation: "A market order guarantees execution at the current market price but doesn't guarantee a specific price, especially in volatile markets.",
      category: "Trading Basics",
      difficulty: "easy" as const
    },
    {
      id: 3,
      question: "What is a dividend yield?",
      options: [
        "Annual dividend per share divided by stock price",
        "Total dividends received in a year",
        "Percentage increase in dividend payments",
        "Dividend growth rate"
      ],
      correctAnswer: 0,
      explanation: "Dividend yield = Annual Dividend per Share ÷ Stock Price, showing the annual dividend return as a percentage of the stock price.",
      category: "Dividend Investing",
      difficulty: "easy" as const
    },
    {
      id: 4,
      question: "Which financial statement shows a company's profitability over a period?",
      options: [
        "Balance sheet",
        "Income statement",
        "Cash flow statement",
        "Statement of equity"
      ],
      correctAnswer: 1,
      explanation: "The income statement (P&L) shows revenues, expenses, and net income over a specific period, indicating profitability.",
      category: "Financial Statements",
      difficulty: "easy" as const
    },
    {
      id: 5,
      question: "What is the primary difference between growth and value investing?",
      options: [
        "Growth focuses on dividends, value focuses on appreciation",
        "Growth seeks rapidly expanding companies, value seeks undervalued companies",
        "Growth is short-term, value is long-term",
        "Growth uses technical analysis, value uses fundamental analysis"
      ],
      correctAnswer: 1,
      explanation: "Growth investing targets companies with rapid earnings growth potential, while value investing seeks undervalued companies trading below intrinsic value.",
      category: "Investment Strategies",
      difficulty: "medium" as const
    },
    {
      id: 6,
      question: "What does beta measure in stock analysis?",
      options: [
        "Company's profitability",
        "Stock's volatility relative to the overall market",
        "Dividend payment consistency",
        "Price momentum"
      ],
      correctAnswer: 1,
      explanation: "Beta measures a stock's volatility compared to the overall market. Beta > 1 means more volatile than market, Beta < 1 means less volatile.",
      category: "Risk Analysis",
      difficulty: "medium" as const
    },
    {
      id: 7,
      question: "What is dollar-cost averaging?",
      options: [
        "Buying stocks at their average price",
        "Investing a fixed amount regularly regardless of price",
        "Calculating the average cost of all holdings",
        "Selling stocks at average market prices"
      ],
      correctAnswer: 1,
      explanation: "Dollar-cost averaging involves investing a fixed amount at regular intervals, reducing the impact of market volatility by buying more shares when prices are low.",
      category: "Investment Strategies",
      difficulty: "medium" as const
    },
    {
      id: 8,
      question: "What is the primary purpose of diversification in stock investing?",
      options: [
        "Maximize returns",
        "Reduce risk through spreading investments",
        "Increase dividend income",
        "Minimize transaction costs"
      ],
      correctAnswer: 1,
      explanation: "Diversification reduces portfolio risk by spreading investments across different stocks, sectors, and asset classes, minimizing the impact of any single investment's poor performance.",
      category: "Portfolio Management",
      difficulty: "medium" as const
    },
    {
      id: 9,
      question: "What is the difference between fundamental and technical analysis?",
      options: [
        "Fundamental uses company data, technical uses price/volume patterns",
        "Fundamental is short-term, technical is long-term",
        "Fundamental uses charts, technical uses financial statements",
        "No significant difference"
      ],
      correctAnswer: 0,
      explanation: "Fundamental analysis evaluates company financials, management, and industry factors, while technical analysis studies price charts and trading patterns.",
      category: "Analysis Methods",
      difficulty: "hard" as const
    },
    {
      id: 10,
      question: "What is a stock's intrinsic value?",
      options: [
        "Current market price",
        "Book value per share",
        "Estimated true worth based on fundamentals",
        "52-week average price"
      ],
      correctAnswer: 2,
      explanation: "Intrinsic value is the estimated true worth of a stock based on fundamental analysis of company financials, growth prospects, and industry conditions.",
      category: "Stock Valuation",
      difficulty: "hard" as const
    },
    {
      id: 11,
      question: "What does ROE (Return on Equity) measure?",
      options: [
        "Stock price return",
        "How efficiently a company uses shareholder equity to generate profits",
        "Dividend yield",
        "Market capitalization growth"
      ],
      correctAnswer: 1,
      explanation: "ROE = Net Income ÷ Shareholder Equity, measuring how effectively management uses shareholder investments to generate profits.",
      category: "Financial Ratios",
      difficulty: "hard" as const
    },
    {
      id: 12,
      question: "What is the efficient market hypothesis?",
      options: [
        "Markets always provide fair returns",
        "Stock prices reflect all available information",
        "Technical analysis always works",
        "All investors behave rationally"
      ],
      correctAnswer: 1,
      explanation: "The efficient market hypothesis suggests that stock prices reflect all available information, making it difficult to consistently outperform the market through stock picking.",
      category: "Market Theory",
      difficulty: "hard" as const
    }
  ];

  const config = {
    id: 'stock-market-mastery-quiz',
    title: 'Stock Market Mastery & Trading',
    description: 'Test your knowledge of stock analysis, trading strategies, and market fundamentals',
    passingScore: 80,
    questions: questions,
    categories: {
      'Stock Analysis': { icon: () => null, label: 'Stock Analysis' },
      'Trading Basics': { icon: () => null, label: 'Trading Basics' },
      'Dividend Investing': { icon: () => null, label: 'Dividend Investing' },
      'Financial Statements': { icon: () => null, label: 'Financial Statements' },
      'Investment Strategies': { icon: () => null, label: 'Investment Strategies' },
      'Risk Analysis': { icon: () => null, label: 'Risk Analysis' },
      'Portfolio Management': { icon: () => null, label: 'Portfolio Management' },
      'Analysis Methods': { icon: () => null, label: 'Analysis Methods' },
      'Stock Valuation': { icon: () => null, label: 'Stock Valuation' },
      'Financial Ratios': { icon: () => null, label: 'Financial Ratios' },
      'Market Theory': { icon: () => null, label: 'Market Theory' }
    },
    chapterId: 'chapter13',
    enableSpacedRepetition: true,
    successMessage: 'Excellent! You\'ve mastered stock market analysis and trading fundamentals!'
  };

  return (
    <EnhancedQuizEngine
      config={config}
    />
  );
};

export default StockMarketMasteryQuizEnhanced;

'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const businessFinanceQuizConfig = {
  id: 'business-finance-enhanced-quiz',
  title: 'Business Finance & Entrepreneurship Quiz',
  description: 'Master financial statements, business valuation, startup funding, and cash flow management',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter16',
  
  questions: [
    {
      id: 1,
      question: "Which financial statement shows a company's revenues, expenses, and profit over a specific period?",
      options: [
        "Balance Sheet",
        "Income Statement",
        "Cash Flow Statement",
        "Statement of Equity"
      ],
      correctAnswer: 1,
      explanation: "The Income Statement (also called Profit & Loss Statement) shows revenues, expenses, and net income over a specific time period, providing a snapshot of the company's profitability.",
      category: 'statements',
      concept: 'Financial Statement Types',
      difficulty: 'easy' as const
    },
    {
      id: 2,
      question: "What is the primary advantage of the DCF (Discounted Cash Flow) valuation method?",
      options: [
        "It's the quickest valuation method",
        "It focuses on future cash generating ability",
        "It requires minimal financial data",
        "It works best for startups without revenue"
      ],
      correctAnswer: 1,
      explanation: "DCF values a business based on its projected future cash flows discounted to present value, making it the most comprehensive method for valuing cash-generating businesses.",
      category: 'valuation',
      concept: 'DCF Valuation Method',
      difficulty: 'medium' as const
    },
    {
      id: 3,
      question: "In startup funding, what typically happens to founder equity percentage with each funding round?",
      options: [
        "It stays the same",
        "It increases",
        "It gets diluted (decreases)",
        "It depends on the business model"
      ],
      correctAnswer: 2,
      explanation: "Each funding round dilutes existing shareholders' ownership percentage as new shares are issued to investors, though the absolute value of founder equity may increase if valuation grows sufficiently.",
      category: 'funding',
      concept: 'Equity Dilution',
      difficulty: 'medium' as const
    },
    {
      id: 4,
      question: "What is the break-even point in business finance?",
      options: [
        "When revenue equals expenses",
        "When profit margin is 10%",
        "When cash flow turns positive",
        "When the business is sold"
      ],
      correctAnswer: 0,
      explanation: "The break-even point is when total revenue equals total expenses, resulting in zero profit or loss. This is a critical milestone for new businesses to achieve sustainability.",
      category: 'metrics',
      concept: 'Break-Even Analysis',
      difficulty: 'easy' as const
    },
    {
      id: 5,
      question: "Which funding stage typically involves the largest investment amounts?",
      options: [
        "Seed funding",
        "Series A",
        "Series B and later",
        "Angel investment"
      ],
      correctAnswer: 2,
      explanation: "Series B and later rounds typically involve the largest investment amounts as companies scale operations, expand markets, and pursue growth initiatives requiring significant capital.",
      category: 'funding',
      concept: 'Funding Stage Progression',
      difficulty: 'medium' as const
    },
    {
      id: 6,
      question: "What does a Price-to-Earnings (P/E) ratio measure in business valuation?",
      options: [
        "How much investors pay for each dollar of earnings",
        "The company's debt-to-equity ratio",
        "The percentage of profit margins",
        "The rate of return on investment"
      ],
      correctAnswer: 0,
      explanation: "P/E ratio measures how much investors are willing to pay for each dollar of a company's earnings. A higher P/E suggests higher growth expectations or overvaluation, while a lower P/E may indicate undervaluation or lower growth prospects.",
      category: 'valuation',
      concept: 'P/E Ratio Analysis',
      difficulty: 'medium' as const
    },
    {
      id: 7,
      question: "In cash flow management, what is working capital?",
      options: [
        "Total cash in bank accounts",
        "Current assets minus current liabilities",
        "Annual revenue minus expenses",
        "Long-term debt capacity"
      ],
      correctAnswer: 1,
      explanation: "Working capital is current assets minus current liabilities, representing the short-term liquidity available to fund day-to-day operations. Positive working capital indicates ability to meet short-term obligations.",
      category: 'cash-flow',
      concept: 'Working Capital Management',
      difficulty: 'medium' as const
    },
    {
      id: 8,
      question: "Which business model generates recurring revenue streams?",
      options: [
        "One-time product sales",
        "Subscription-based services",
        "Project-based consulting",
        "Commission-only sales"
      ],
      correctAnswer: 1,
      explanation: "Subscription-based services generate recurring revenue streams, providing predictable cash flow and higher business valuations. This model creates ongoing customer relationships and more stable financial projections.",
      category: 'models',
      concept: 'Recurring Revenue Models',
      difficulty: 'easy' as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'statements': { icon: () => null, label: 'Financial Statements' },
    'valuation': { icon: () => null, label: 'Business Valuation' },
    'funding': { icon: () => null, label: 'Startup Funding' },
    'metrics': { icon: () => null, label: 'Financial Metrics' },
    'cash-flow': { icon: () => null, label: 'Cash Flow Management' },
    'models': { icon: () => null, label: 'Business Models' }
  },

  // Concept mapping for spaced repetition
  concepts: [
    { id: "Financial Statement Types", name: "Financial Statement Types", category: "statements" },
    { id: "DCF Valuation Method", name: "DCF Valuation Method", category: "valuation" },
    { id: "Equity Dilution", name: "Equity Dilution", category: "funding" },
    { id: "Break-Even Analysis", name: "Break-Even Analysis", category: "metrics" },
    { id: "Funding Stage Progression", name: "Funding Stage Progression", category: "funding" },
    { id: "P/E Ratio Analysis", name: "P/E Ratio Analysis", category: "valuation" },
    { id: "Working Capital Management", name: "Working Capital Management", category: "cash-flow" },
    { id: "Recurring Revenue Models", name: "Recurring Revenue Models", category: "models" }
  ],

  successMessage: "Outstanding! You understand business finance fundamentals from financial statements to funding and valuation.",
  failureMessage: "Review business finance concepts. Focus on financial statements, valuation methods, and funding mechanics."
};

export default function BusinessFinanceQuizEnhanced() {
  return <EnhancedQuizEngine config={businessFinanceQuizConfig} />;
}

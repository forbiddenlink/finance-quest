'use client';

import React from 'react';
import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const RealEstateAlternativesQuizEnhanced: React.FC = () => {
  const questions = [
    {
      id: 1,
      question: "What does the cap rate (capitalization rate) measure in real estate investing?",
      options: [
        "The total return on investment",
        "The annual net operating income as a percentage of property value",
        "The mortgage interest rate",
        "The property appreciation rate"
      ],
      correctAnswer: 1,
      explanation: "Cap rate is calculated as Net Operating Income ÷ Property Value, showing the annual return without considering financing.",
      category: "Real Estate Analysis",
      difficulty: "easy" as const
    },
    {
      id: 2,
      question: "Which of the following is NOT typically included in Net Operating Income (NOI)?",
      options: [
        "Rental income",
        "Property taxes",
        "Mortgage payments",
        "Property management fees"
      ],
      correctAnswer: 2,
      explanation: "NOI excludes financing costs like mortgage payments. It only includes operating revenues minus operating expenses.",
      category: "Real Estate Analysis",
      difficulty: "easy" as const
    },
    {
      id: 3,
      question: "What is the primary advantage of investing in REITs over direct real estate ownership?",
      options: [
        "Higher potential returns",
        "More control over properties",
        "Liquidity and diversification",
        "Tax advantages"
      ],
      correctAnswer: 2,
      explanation: "REITs offer liquidity (can be bought/sold like stocks) and instant diversification across multiple properties and markets.",
      category: "REITs",
      difficulty: "easy" as const
    },
    {
      id: 4,
      question: "What does the 1% rule in real estate investing suggest?",
      options: [
        "Property should appreciate 1% annually",
        "Monthly rent should equal 1% of purchase price",
        "Down payment should be 1% of property value",
        "Vacancy rate should not exceed 1%"
      ],
      correctAnswer: 1,
      explanation: "The 1% rule is a quick screening tool suggesting monthly rent should be at least 1% of the total purchase price for positive cash flow.",
      category: "Real Estate Analysis",
      difficulty: "easy" as const
    },
    {
      id: 5,
      question: "Which strategy involves buying, rehabilitating, renting, refinancing, and repeating?",
      options: [
        "Fix and flip",
        "BRRRR strategy",
        "Buy and hold",
        "Wholesale strategy"
      ],
      correctAnswer: 1,
      explanation: "BRRRR stands for Buy, Rehab, Rent, Refinance, Repeat - a strategy to build a rental portfolio using refinancing to recover invested capital.",
      category: "Investment Strategies",
      difficulty: "medium" as const
    },
    {
      id: 6,
      question: "What is the cash-on-cash return in real estate investing?",
      options: [
        "Total return including appreciation",
        "Annual cash flow divided by cash invested",
        "Gross rental yield",
        "Net operating income"
      ],
      correctAnswer: 1,
      explanation: "Cash-on-cash return measures the annual cash flow relative to the actual cash invested, providing insight into the efficiency of cash deployment.",
      category: "Real Estate Analysis",
      difficulty: "medium" as const
    },
    {
      id: 7,
      question: "Which type of REIT directly owns and operates income-producing real estate?",
      options: [
        "Mortgage REITs (mREITs)",
        "Equity REITs",
        "Hybrid REITs",
        "Private REITs"
      ],
      correctAnswer: 1,
      explanation: "Equity REITs own and operate income-producing real estate, while mortgage REITs invest in real estate debt and mortgages.",
      category: "REITs",
      difficulty: "medium" as const
    },
    {
      id: 8,
      question: "What is the debt service coverage ratio (DSCR) used for in real estate?",
      options: [
        "To measure property appreciation",
        "To assess the property's ability to cover debt payments",
        "To calculate tax depreciation",
        "To determine market value"
      ],
      correctAnswer: 1,
      explanation: "DSCR = Net Operating Income ÷ Annual Debt Service, measuring whether the property generates enough income to cover mortgage payments.",
      category: "Real Estate Analysis",
      difficulty: "medium" as const
    },
    {
      id: 9,
      question: "In real estate syndications, what is the typical structure for returns?",
      options: [
        "Fixed interest payments only",
        "Preferred return followed by profit sharing",
        "Equal profit sharing among all investors",
        "Returns based solely on property appreciation"
      ],
      correctAnswer: 1,
      explanation: "Most syndications offer a preferred return (hurdle rate) to limited partners first, then split remaining profits between general and limited partners.",
      category: "Investment Strategies",
      difficulty: "hard" as const
    },
    {
      id: 10,
      question: "What is a Section 1031 exchange in real estate?",
      options: [
        "A tax on real estate transactions",
        "A method to defer capital gains taxes by exchanging properties",
        "A financing technique for leveraged purchases",
        "A depreciation calculation method"
      ],
      correctAnswer: 1,
      explanation: "A 1031 exchange allows investors to defer capital gains taxes by exchanging one investment property for another 'like-kind' property.",
      category: "Tax Strategies",
      difficulty: "hard" as const
    },
    {
      id: 11,
      question: "What is the Internal Rate of Return (IRR) in real estate investing?",
      options: [
        "The simple annual return",
        "The discount rate that makes NPV equal to zero",
        "The cap rate plus appreciation",
        "The cash-on-cash return"
      ],
      correctAnswer: 1,
      explanation: "IRR is the discount rate that makes the net present value of all cash flows equal to zero, considering the time value of money.",
      category: "Real Estate Analysis",
      difficulty: "hard" as const
    },
    {
      id: 12,
      question: "Which factor most significantly affects real estate values in the long term?",
      options: [
        "Interest rates",
        "Population growth and economic fundamentals",
        "Short-term market speculation",
        "Government incentives"
      ],
      correctAnswer: 1,
      explanation: "Long-term real estate values are primarily driven by population growth, job creation, and economic fundamentals that create genuine demand for properties.",
      category: "Market Analysis",
      difficulty: "hard" as const
    }
  ];

  const config = {
    id: 'real-estate-alternatives-quiz',
    title: 'Real Estate & Property Investment Mastery',
    description: 'Test your knowledge of real estate investing, REITs, and alternative property investment strategies',
    passingScore: 80,
    questions: questions,
    categories: {
      'Real Estate Analysis': { icon: () => null, label: 'Real Estate Analysis' },
      'REITs': { icon: () => null, label: 'REITs' },
      'Investment Strategies': { icon: () => null, label: 'Investment Strategies' },
      'Tax Strategies': { icon: () => null, label: 'Tax Strategies' },
      'Market Analysis': { icon: () => null, label: 'Market Analysis' }
    },
    chapterId: 'chapter12',
    enableSpacedRepetition: true,
    successMessage: 'Outstanding! You\'ve mastered real estate and property investment fundamentals!'
  };

  return (
    <EnhancedQuizEngine
      config={config}
    />
  );
};

export default RealEstateAlternativesQuizEnhanced;

'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const investmentFundamentalsQuizConfig = {
  id: 'investment-fundamentals-enhanced-quiz',
  title: 'Investment Fundamentals & Portfolio Construction Quiz',
  description: 'Master core investing principles, asset classes, portfolio construction, and long-term wealth building strategies',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter7',
  
  questions: [
    {
      id: 1,
      question: "What is the historical average annual return of the S&P 500 over the past 100 years?",
      options: [
        "6-7%",
        "8-9%",
        "10-11%",
        "12-13%"
      ],
      correctAnswer: 2,
      explanation: "The S&P 500 has averaged approximately 10% annual returns over the past century, though returns vary significantly year to year. This includes dividends and assumes reinvestment.",
      category: "fundamentals",
      concept: "Historical Market Returns",
      difficulty: "easy" as const
    },
    {
      id: 2,
      question: "Sarah invests $10,000 and it grows to $80,000 in 20 years. What was her approximate annual return rate?",
      options: [
        "8%",
        "10.4%",
        "12%",
        "15%"
      ],
      correctAnswer: 1,
      explanation: "Using the Rule of 72 or compound interest formula: $10k growing to $80k (8x growth) over 20 years equals approximately 10.4% annual return. This demonstrates the power of long-term compounding.",
      category: "fundamentals",
      concept: "Compound Growth Calculation",
      difficulty: "medium" as const
    },
    {
      id: 3,
      question: "Which investment approach has historically produced the best long-term results for average investors?",
      options: [
        "Active stock picking and market timing",
        "Following financial media recommendations",
        "Low-cost index fund investing with regular contributions",
        "Cryptocurrency and meme stock trading"
      ],
      correctAnswer: 2,
      explanation: "Low-cost index fund investing with regular contributions (dollar-cost averaging) has consistently outperformed active strategies for the average investor, reducing fees and emotional decision-making.",
      category: "fundamentals",
      concept: "Investment Strategy Comparison",
      difficulty: "medium" as const
    },
    {
      id: 4,
      question: "What is the primary advantage of a Roth IRA over a traditional IRA?",
      options: [
        "Higher contribution limits",
        "Tax-free withdrawals in retirement",
        "No income restrictions",
        "Immediate tax deductions"
      ],
      correctAnswer: 1,
      explanation: "Roth IRA contributions are made with after-tax dollars, but withdrawals in retirement are completely tax-free. This is especially valuable if you expect to be in a higher tax bracket later.",
      category: "accounts",
      concept: "Tax-Advantaged Accounts",
      difficulty: "medium" as const
    },
    {
      id: 5,
      question: "A balanced portfolio typically includes what asset allocation for a 30-year-old investor?",
      options: [
        "100% stocks (maximum growth)",
        "80% stocks, 20% bonds (age-appropriate)",
        "50% stocks, 50% bonds (conservative)",
        "60% stocks, 40% cash (very safe)"
      ],
      correctAnswer: 1,
      explanation: "The rule of thumb is 100 minus your age in stocks. A 30-year-old could have 70-80% stocks for growth, with 20-30% bonds for stability. Young investors can handle more volatility for higher returns.",
      category: "portfolio-construction",
      concept: "Age-Based Asset Allocation",
      difficulty: "medium" as const
    },
    {
      id: 6,
      question: "What is the biggest advantage of starting investing at age 25 vs. age 35?",
      options: [
        "Lower fees on investments",
        "10 extra years of compound growth",
        "Better investment options available",
        "Higher risk tolerance"
      ],
      correctAnswer: 1,
      explanation: "Those 10 extra years of compound growth are extraordinarily powerful. Money invested at 25 has 10 more years to double and redouble compared to starting at 35, potentially resulting in 2-3x more wealth at retirement.",
      category: "fundamentals",
      concept: "Time Value of Money",
      difficulty: "easy" as const
    },
    {
      id: 7,
      question: "Which factor is most important when choosing an index fund?",
      options: [
        "Past performance compared to competitors",
        "Low expense ratio (fees)",
        "Brand name recognition",
        "Number of holdings in the fund"
      ],
      correctAnswer: 1,
      explanation: "Low expense ratios are crucial because fees compound negatively over time. A 0.05% expense ratio vs. 1% can save tens of thousands over decades. Past performance doesn't predict future results.",
      category: "asset-classes",
      concept: "Fund Selection Criteria",
      difficulty: "medium" as const
    },
    {
      id: 8,
      question: "During a market crash when your portfolio drops 30%, what should a long-term investor do?",
      options: [
        "Sell everything to prevent further losses",
        "Stop contributing until markets recover",
        "Continue regular investing (dollar-cost averaging)",
        "Try to time the market bottom"
      ],
      correctAnswer: 2,
      explanation: "Market crashes are opportunities to buy more shares at lower prices. Historical data shows that continuing to invest during downturns (dollar-cost averaging) produces better long-term results than stopping or selling.",
      category: "psychology",
      concept: "Bear Market Strategy",
      difficulty: "hard" as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'fundamentals': { icon: () => null, label: 'Investment Fundamentals' },
    'asset-classes': { icon: () => null, label: 'Asset Classes' },
    'portfolio-construction': { icon: () => null, label: 'Portfolio Construction' },
    'accounts': { icon: () => null, label: 'Investment Accounts' },
    'psychology': { icon: () => null, label: 'Investment Psychology' }
  },

  successMessage: "Outstanding! You've mastered core investing principles and are ready for advanced portfolio construction.",
  failureMessage: "Review investment fundamentals and try again. Focus on compound growth, asset allocation, and long-term strategy."
};

interface InvestmentFundamentalsQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function InvestmentFundamentalsQuizEnhanced({ onComplete }: InvestmentFundamentalsQuizProps) {
  return (
    <EnhancedQuizEngine 
      config={investmentFundamentalsQuizConfig}
      onComplete={onComplete}
    />
  );
}

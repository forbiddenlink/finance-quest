'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const alternativeInvestmentsQuizConfig = {
  id: 'alternative-investments-enhanced-quiz',
  title: 'Alternative Investments Quiz',
  description: 'Master portfolio allocation, REITs, commodities, and advanced alternative investment strategies',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter15',
  
  questions: [
    {
      id: 1,
      question: "What percentage of a portfolio should typically be allocated to alternative investments?",
      options: [
        "1-3%",
        "5-25%", 
        "30-50%",
        "Over 60%"
      ],
      correctAnswer: 1,
      explanation: "Most portfolios benefit from 5-25% allocation to alternative investments, providing diversification without overwhelming the core stock and bond holdings.",
      category: 'allocation',
      concept: 'Alternative Investment Allocation',
      difficulty: 'easy' as const
    },
    {
      id: 2,
      question: "What is the primary benefit of REITs in a portfolio?",
      options: [
        "Guaranteed returns",
        "Tax-free dividends",
        "Real estate exposure with liquidity",
        "Protection from all market volatility"
      ],
      correctAnswer: 2,
      explanation: "REITs provide exposure to real estate markets with stock-like liquidity, allowing investors to access property investments without direct ownership complexities.",
      category: 'reits',
      concept: 'REIT Liquidity Benefits',
      difficulty: 'easy' as const
    },
    {
      id: 3,
      question: "Which commodity is traditionally viewed as the best store of value during inflation?",
      options: [
        "Oil",
        "Copper",
        "Gold", 
        "Natural gas"
      ],
      correctAnswer: 2,
      explanation: "Gold has historically been viewed as a store of value and inflation hedge, maintaining purchasing power over long periods during inflationary environments.",
      category: 'commodities',
      concept: 'Gold as Inflation Hedge',
      difficulty: 'easy' as const
    },
    {
      id: 4,
      question: "What is a key risk of mortgage REITs compared to equity REITs?",
      options: [
        "Lower dividend yields",
        "Less diversification",
        "Higher interest rate sensitivity",
        "More volatile stock prices"
      ],
      correctAnswer: 2,
      explanation: "Mortgage REITs (mREITs) are highly sensitive to interest rate changes because they profit from the spread between borrowing costs and mortgage yields. Rising rates can squeeze their profit margins significantly.",
      category: 'reits',
      concept: 'Mortgage REIT Interest Rate Risk',
      difficulty: 'medium' as const
    },
    {
      id: 5,
      question: "What is the main advantage of commodity ETFs over direct commodity ownership?",
      options: [
        "Higher returns",
        "Lower fees",
        "Easier storage and liquidity",
        "Tax-free gains"
      ],
      correctAnswer: 2,
      explanation: "Commodity ETFs eliminate storage, insurance, and security concerns of physical commodities while providing easy liquidity. You can buy/sell during market hours without dealing with physical delivery.",
      category: 'commodities',
      concept: 'Commodity ETF Advantages',
      difficulty: 'medium' as const
    },
    {
      id: 6,
      question: "Which characteristic is most important when evaluating cryptocurrency investments?",
      options: [
        "High daily trading volume",
        "Celebrity endorsements",
        "Volatility tolerance and maximum loss capacity",
        "Past price performance"
      ],
      correctAnswer: 2,
      explanation: "Cryptocurrency is extremely volatile and speculative. The most important consideration is your ability to tolerate potential 50-90% losses. Never invest more than you can afford to lose completely.",
      category: 'crypto',
      concept: 'Crypto Risk Assessment',
      difficulty: 'medium' as const
    },
    {
      id: 7,
      question: "What is the typical dividend yield range for REITs?",
      options: [
        "1-2%",
        "4-8%",
        "10-15%",
        "Over 20%"
      ],
      correctAnswer: 1,
      explanation: "REITs typically yield 4-8%, significantly higher than most stocks. They're required to distribute at least 90% of their taxable income as dividends, making them attractive for income-focused investors.",
      category: 'reits',
      concept: 'REIT Dividend Yields',
      difficulty: 'easy' as const
    },
    {
      id: 8,
      question: "Which alternative investment typically has the lowest correlation with traditional stocks?",
      options: [
        "REITs",
        "Commodities",
        "High-yield bonds",
        "International stocks"
      ],
      correctAnswer: 1,
      explanation: "Commodities often have the lowest correlation with traditional stocks, especially during inflationary periods. They can perform well when stocks struggle, providing valuable portfolio diversification benefits.",
      category: 'diversification',
      concept: 'Alternative Investment Correlation',
      difficulty: 'hard' as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'allocation': { icon: () => null, label: 'Portfolio Allocation' },
    'reits': { icon: () => null, label: 'REITs' },
    'commodities': { icon: () => null, label: 'Commodities' },
    'crypto': { icon: () => null, label: 'Cryptocurrency' },
    'diversification': { icon: () => null, label: 'Diversification' }
  },

  // Concept mapping for spaced repetition
  concepts: [
    { id: "Alternative Investment Allocation", name: "Alternative Investment Allocation", category: "allocation" },
    { id: "REIT Liquidity Benefits", name: "REIT Liquidity Benefits", category: "reits" },
    { id: "Gold as Inflation Hedge", name: "Gold as Inflation Hedge", category: "commodities" },
    { id: "Mortgage REIT Interest Rate Risk", name: "Mortgage REIT Interest Rate Risk", category: "reits" },
    { id: "Commodity ETF Advantages", name: "Commodity ETF Advantages", category: "commodities" },
    { id: "Crypto Risk Assessment", name: "Crypto Risk Assessment", category: "crypto" },
    { id: "REIT Dividend Yields", name: "REIT Dividend Yields", category: "reits" },
    { id: "Alternative Investment Correlation", name: "Alternative Investment Correlation", category: "diversification" }
  ],

  successMessage: "Excellent! You understand alternative investment allocation, REIT benefits, and diversification strategies.",
  failureMessage: "Review alternative investment concepts. Focus on allocation percentages, REIT characteristics, and risk assessment."
};

export default function AlternativeInvestmentsQuizEnhanced() {
  return <EnhancedQuizEngine config={alternativeInvestmentsQuizConfig} />;
}

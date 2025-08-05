'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const portfolioConstructionQuizConfig = {
  id: 'portfolio-construction-enhanced-quiz',
  title: 'Portfolio Construction & Asset Allocation Quiz',
  description: 'Master asset allocation, diversification strategies, rebalancing, and advanced portfolio optimization techniques',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter8',
  
  questions: [
    {
      id: 1,
      question: "What is the primary goal of asset allocation in portfolio construction?",
      options: [
        "Maximize returns at any cost",
        "Minimize risk regardless of returns",
        "Optimize risk-adjusted returns for your goals",
        "Follow what other successful investors do"
      ],
      correctAnswer: 2,
      explanation: "Asset allocation aims to optimize risk-adjusted returns based on your specific goals, timeline, and risk tolerance. It's about finding the right balance between growth and protection for your situation.",
      category: "allocation-strategy",
      concept: "Risk-Adjusted Optimization",
      difficulty: "medium" as const
    },
    {
      id: 2,
      question: "Lisa is 35 years old planning for retirement at 65. What asset allocation makes most sense?",
      options: [
        "30% stocks, 70% bonds (conservative)",
        "50% stocks, 50% bonds (balanced)",
        "70-80% stocks, 20-30% bonds (growth-oriented)",
        "100% stocks (maximum growth)"
      ],
      correctAnswer: 2,
      explanation: "With 30 years until retirement, Lisa can handle more volatility for higher long-term returns. 70-80% stocks provides growth while bonds add stability. The '100 minus age' rule suggests 65-70% stocks minimum.",
      category: "age-based-allocation",
      concept: "Age-Appropriate Asset Allocation",
      difficulty: "medium" as const
    },
    {
      id: 3,
      question: "What is the main benefit of international diversification in a portfolio?",
      options: [
        "Higher guaranteed returns",
        "Lower fees and expenses",
        "Reduced correlation risk",
        "Easier tax management"
      ],
      correctAnswer: 2,
      explanation: "International diversification reduces correlation risk - when US markets decline, international markets may perform differently, smoothing overall portfolio volatility while maintaining growth potential.",
      category: "diversification",
      concept: "Geographic Diversification",
      difficulty: "medium" as const
    },
    {
      id: 4,
      question: "When should you rebalance your portfolio?",
      options: [
        "Every month to stay exactly on target",
        "Only when markets crash significantly",
        "When allocations drift 5-10% from targets",
        "Never - let winners run indefinitely"
      ],
      correctAnswer: 2,
      explanation: "Rebalance when allocations drift 5-10% from targets or annually, whichever comes first. This maintains your risk profile while systematically selling high and buying low.",
      category: "rebalancing",
      concept: "Portfolio Rebalancing Strategy",
      difficulty: "medium" as const
    },
    {
      id: 5,
      question: "What's the ideal number of individual stocks for adequate diversification?",
      options: [
        "5-10 stocks maximum",
        "20-30 individual stocks",
        "50-100 individual stocks",
        "Use index funds instead of individual stocks"
      ],
      correctAnswer: 3,
      explanation: "Index funds provide instant diversification across hundreds or thousands of stocks with lower fees and less research burden than building a diversified portfolio of individual stocks.",
      category: "diversification",
      concept: "Diversification Methods",
      difficulty: "easy" as const
    },
    {
      id: 6,
      question: "Maria's portfolio gained 15% while her target allocation was 70% stocks, 30% bonds. Stocks gained 20%, bonds gained 3%. What should she do?",
      options: [
        "Keep the current allocation since it's performing well",
        "Sell some stocks and buy bonds to rebalance",
        "Increase stock allocation since they're winning",
        "Switch entirely to stocks for maximum growth"
      ],
      correctAnswer: 1,
      explanation: "Strong stock performance has increased her stock allocation above 70%. Rebalancing by selling stocks and buying bonds maintains her target risk level while locking in some gains.",
      category: "rebalancing",
      concept: "Rebalancing Execution",
      difficulty: "hard" as const
    },
    {
      id: 7,
      question: "What role do bonds play in a growth-oriented portfolio?",
      options: [
        "Provide high returns to boost performance",
        "Reduce volatility and provide stability",
        "Generate tax-free income",
        "Hedge against inflation completely"
      ],
      correctAnswer: 1,
      explanation: "In a growth portfolio, bonds provide stability and reduce volatility. During stock market downturns, bonds often hold value or gain, smoothing the portfolio's ride while preserving capital for rebalancing opportunities.",
      category: "asset-classes",
      concept: "Bond Portfolio Role",
      difficulty: "easy" as const
    },
    {
      id: 8,
      question: "Which portfolio construction mistake is most costly for long-term investors?",
      options: [
        "Not rebalancing frequently enough",
        "Emotional decision-making during market volatility",
        "Choosing expensive actively-managed funds",
        "Not including enough international exposure"
      ],
      correctAnswer: 1,
      explanation: "Emotional decisions during volatility - selling during crashes, buying during bubbles - destroy long-term returns. A mediocre portfolio held consistently outperforms a perfect portfolio traded emotionally.",
      category: "behavioral-factors",
      concept: "Emotional Investing Mistakes",
      difficulty: "hard" as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'allocation-strategy': { icon: () => null, label: 'Allocation Strategy' },
    'age-based-allocation': { icon: () => null, label: 'Age-Based Allocation' },
    'diversification': { icon: () => null, label: 'Diversification' },
    'rebalancing': { icon: () => null, label: 'Rebalancing' },
    'asset-classes': { icon: () => null, label: 'Asset Classes' },
    'behavioral-factors': { icon: () => null, label: 'Behavioral Factors' }
  },

  successMessage: "Excellent! You've mastered portfolio construction and asset allocation principles for optimal long-term wealth building.",
  failureMessage: "Review portfolio construction concepts and try again. Focus on asset allocation, diversification, and rebalancing strategies."
};

interface PortfolioConstructionQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function PortfolioConstructionQuizEnhanced({ onComplete }: PortfolioConstructionQuizProps) {
  return (
    <EnhancedQuizEngine 
      config={portfolioConstructionQuizConfig}
      onComplete={onComplete}
    />
  );
}

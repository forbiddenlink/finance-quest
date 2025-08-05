'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const emergencyFundsQuizConfig = {
  id: 'emergency-funds-enhanced-quiz',
  title: 'Emergency Funds & Financial Security Quiz',
  description: 'Master emergency fund sizing, placement strategies, and building techniques for financial protection',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter4',
  
  questions: [
    {
      id: 1,
      question: "What is the primary purpose of a $1,000 starter emergency fund?",
      options: [
        "To invest in the stock market for higher returns",
        "To cover 80% of small emergencies while building your full fund",
        "To pay off credit card debt faster",
        "To use for vacation savings"
      ],
      correctAnswer: 1,
      explanation: "A starter emergency fund prevents small crises from becoming debt disasters while you build your full emergency fund. It breaks the debt cycle by handling unexpected expenses without borrowing.",
      category: "building",
      concept: "Starter Fund Strategy",
      difficulty: "easy" as const
    },
    {
      id: 2,
      question: "For someone with variable freelance income, what emergency fund size is recommended?",
      options: [
        "3 months of expenses",
        "6 months of expenses", 
        "10-12 months of expenses",
        "1 month of expenses"
      ],
      correctAnswer: 2,
      explanation: "Variable income requires larger emergency funds (10-12 months) to smooth out income fluctuations and provide stability during low-earning periods. Freelancers face unpredictable cash flow.",
      category: "sizing",
      concept: "Variable Income Planning",
      difficulty: "medium" as const
    },
    {
      id: 3,
      question: "Where should you NOT keep your emergency fund?",
      options: [
        "High-yield savings account earning 4.5%",
        "FDIC-insured money market account",
        "Stock market index funds for growth",
        "Online bank with instant transfer capability"
      ],
      correctAnswer: 2,
      explanation: "Emergency funds should never be invested in stocks due to volatility risk. You need guaranteed access to the full amount when emergencies strike. Stocks can lose 20-50% in market downturns.",
      category: "placement",
      concept: "Fund Placement Safety",
      difficulty: "easy" as const
    },
    {
      id: 4,
      question: "What percentage of Americans cannot cover a $400 emergency without borrowing money?",
      options: [
        "20%",
        "30%",
        "40%",
        "50%"
      ],
      correctAnswer: 2,
      explanation: "40% of Americans can't cover a $400 emergency, highlighting the critical need for emergency funds to avoid debt cycles. This statistic shows how common financial fragility is.",
      category: "psychology",
      concept: "Financial Statistics",
      difficulty: "easy" as const
    },
    {
      id: 5,
      question: "When calculating emergency fund size, which expenses should you include?",
      options: [
        "All current monthly expenses including entertainment and dining out",
        "Only housing, food, utilities, minimum debt payments, and insurance",
        "Just housing and food costs",
        "All expenses plus 20% buffer for inflation"
      ],
      correctAnswer: 1,
      explanation: "Emergency mode spending focuses on essential expenses only - housing, food, utilities, minimum debt payments, and insurance. Non-essentials are cut during crises to extend fund longevity.",
      category: "sizing",
      concept: "Essential Expense Calculation",
      difficulty: "medium" as const
    },
    {
      id: 6,
      question: "Which scenario qualifies as a legitimate emergency fund use?",
      options: [
        "Black Friday sale on electronics you've wanted",
        "Friend's wedding gift and travel expenses",
        "Major car transmission repair needed for work commute",
        "Down payment opportunity on investment property"
      ],
      correctAnswer: 2,
      explanation: "True emergencies are unexpected, necessary, and urgent. Car repairs needed for work qualify - they're unplanned, essential for income, and time-sensitive. Sales and opportunities are not emergencies.",
      category: "protection",
      concept: "Emergency Fund Usage Rules",
      difficulty: "medium" as const
    },
    {
      id: 7,
      question: "How much more income can people with emergency funds expect to earn over their lifetime?",
      options: [
        "5-10% more",
        "15-20% more", 
        "20%+ more",
        "No significant difference"
      ],
      correctAnswer: 2,
      explanation: "Emergency funds provide peace of mind and negotiating power, allowing better career decisions and smart risk-taking that leads to 20%+ higher lifetime earnings. Financial security enables opportunity.",
      category: "psychology",
      concept: "Psychological Benefits",
      difficulty: "hard" as const
    },
    {
      id: 8,
      question: "What's the optimal automation strategy for building an emergency fund?",
      options: [
        "Transfer money only when you remember each month",
        "Save whatever is left over at month-end",
        "Automate transfers on payday before spending temptation hits",
        "Only save windfall money like tax refunds"
      ],
      correctAnswer: 2,
      explanation: "Automation on payday follows the 'pay yourself first' principle, ensuring consistent progress before spending decisions can interfere with saving goals. Consistency beats perfection.",
      category: "building",
      concept: "Building Automation",
      difficulty: "medium" as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'sizing': { icon: () => null, label: 'Fund Sizing' },
    'placement': { icon: () => null, label: 'Fund Placement' },
    'building': { icon: () => null, label: 'Building Strategy' },
    'protection': { icon: () => null, label: 'Fund Protection' },
    'psychology': { icon: () => null, label: 'Financial Psychology' }
  },

  successMessage: "Outstanding! You've mastered emergency fund strategies and built a foundation for financial security.",
  failureMessage: "Review emergency fund concepts and try again. Focus on sizing, placement, and building strategies."
};

interface EmergencyFundsQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function EmergencyFundsQuizEnhanced({ onComplete }: EmergencyFundsQuizProps) {
  return (
    <EnhancedQuizEngine 
      config={emergencyFundsQuizConfig}
      onComplete={onComplete}
    />
  );
}

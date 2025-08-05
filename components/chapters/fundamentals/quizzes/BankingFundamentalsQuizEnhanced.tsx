'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const bankingQuizConfig = {
  id: 'banking-fundamentals-enhanced-quiz',
  title: 'Banking Fundamentals & Account Optimization Quiz',
  description: 'Master banking strategies, account types, fee avoidance, and FDIC protection',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter2',
  
  questions: [
    {
      id: 1,
      question: "You have $10,000 for an emergency fund. What's the best account setup?",
      options: [
        "Keep it all in checking for easy access",
        "Put it in a traditional bank savings account at 0.01% APY", 
        "High-yield savings account online at 4.5% APY",
        "Split between checking ($5,000) and regular savings ($5,000)"
      ],
      correctAnswer: 2,
      explanation: "High-yield savings accounts offer FDIC protection with much higher returns. Your $10,000 earns $450/year vs $1/year at traditional banks - a $449 difference annually.",
      category: "optimization",
      concept: "Account Optimization",
      difficulty: "easy" as const
    },
    {
      id: 2, 
      question: "Sarah pays $15/month in bank fees. How much is this costing her over 20 years if she invested that money at 7% return?",
      options: [
        "$3,600 (just the fees)",
        "$7,200 (double the fees)", 
        "$9,500",
        "$12,000+"
      ],
      correctAnswer: 3,
      explanation: "$15/month = $180/year in fees. Over 20 years with 7% compound growth, this becomes over $12,000 in lost wealth. Banking fees are a major wealth destroyer.",
      category: "fees",
      concept: "Fee Impact Analysis", 
      difficulty: "medium" as const
    },
    {
      id: 3,
      question: "What's the maximum FDIC insurance coverage for one person at one bank?",
      options: [
        "$100,000 per account",
        "$250,000 per depositor per bank",
        "$500,000 total", 
        "$1,000,000 for premium accounts"
      ],
      correctAnswer: 1,
      explanation: "FDIC insures up to $250,000 per depositor, per insured bank, per ownership category. For amounts over $250,000, spread across multiple banks for full protection.",
      category: "security",
      concept: "FDIC Protection",
      difficulty: "easy" as const
    },
    {
      id: 4,
      question: "Which banking setup demonstrates the optimal 'banking trifecta' strategy?", 
      options: [
        "All accounts at one big national bank for convenience",
        "Local checking + online high-yield savings + investment account",
        "Multiple checking accounts at different banks",
        "Cash only, no banks needed"
      ],
      correctAnswer: 1,
      explanation: "The banking trifecta combines local convenience (checking/ATMs) with online rates (savings) and investment growth, maximizing both earnings and accessibility.",
      category: "optimization",
      concept: "Banking Strategy",
      difficulty: "medium" as const
    },
    {
      id: 5,
      question: "You're choosing between Bank A (0.01% APY, no fees) and Bank B (4.5% APY, $5/month fee). For $5,000 savings, which is better annually?",
      options: [
        "Bank A: earn $0.50, pay $0 = $0.50 net",
        "Bank B: earn $225, pay $60 = $165 net", 
        "They're about the same",
        "Need more information to decide"
      ],
      correctAnswer: 1,
      explanation: "Bank B nets $165 vs Bank A's $0.50 - a $164.50 annual difference. Even with fees, high-yield accounts usually beat no-fee low-yield accounts for meaningful balances.",
      category: "calculation",
      concept: "ROI Calculation",
      difficulty: "medium" as const
    },
    {
      id: 6,
      question: "What's the most effective way to avoid overdraft fees?",
      options: [
        "Opt into overdraft protection from the bank",
        "Set up low-balance alerts and account monitoring",
        "Keep a large buffer in checking always", 
        "Use credit cards for everything instead"
      ],
      correctAnswer: 1,
      explanation: "Low-balance alerts (like at $100) give you time to transfer money or modify spending before overdrafts occur. Prevention is better than paying $35 fees.",
      category: "fees",
      concept: "Fee Avoidance",
      difficulty: "easy" as const
    },
    {
      id: 7,
      question: "For someone with $300,000 to protect, what's the best FDIC strategy?",
      options: [
        "Keep it all at one bank - FDIC covers everything",
        "Split: $250,000 at Bank A, $50,000 at Bank B",
        "Use only credit unions instead",
        "Keep $50,000 in cash, rest in banks"
      ],
      correctAnswer: 1,
      explanation: "FDIC covers up to $250,000 per bank. Splitting $250K at Bank A and $50K at Bank B ensures full $300,000 protection across both institutions.",
      category: "security",
      concept: "FDIC Strategy",
      difficulty: "hard" as const
    },
    {
      id: 8,
      question: "Which account type is best for money you need in 6-12 months for a car down payment?",
      options: [
        "High-yield savings account", 
        "Stock market investment",
        "Certificate of deposit (CD)",
        "Checking account"
      ],
      correctAnswer: 0,
      explanation: "High-yield savings provides liquidity with decent returns for short-term goals. CDs lock up money, stocks are risky for short timeframes, checking earns nothing.",
      category: "account-types",
      concept: "Account Type Selection",
      difficulty: "easy" as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'optimization': { icon: () => null, label: 'Account Optimization' },
    'fees': { icon: () => null, label: 'Fee Management' },
    'security': { icon: () => null, label: 'FDIC Security' },
    'calculation': { icon: () => null, label: 'Financial Calculations' },
    'account-types': { icon: () => null, label: 'Account Types' }
  },

  // Concept mapping for spaced repetition
  concepts: [
    { id: "Account Optimization", name: "Account Optimization", category: "optimization" },
    { id: "Fee Impact Analysis", name: "Fee Impact Analysis", category: "fees" },
    { id: "FDIC Protection", name: "FDIC Protection", category: "security" },
    { id: "Banking Strategy", name: "Banking Strategy", category: "optimization" },
    { id: "ROI Calculation", name: "ROI Calculation", category: "calculation" },
    { id: "Fee Avoidance", name: "Fee Avoidance", category: "fees" },
    { id: "FDIC Strategy", name: "FDIC Strategy", category: "security" }, 
    { id: "Account Type Selection", name: "Account Type Selection", category: "account-types" }
  ],

  // Learning objectives and outcomes
  objectives: [
    "Understand different bank account types and their optimal uses",
    "Calculate the true cost of banking fees and opportunity cost",
    "Master FDIC insurance rules and protection strategies",
    "Implement the banking trifecta for maximum optimization",
    "Compare accounts using ROI calculations including fees",
    "Develop fee avoidance strategies and account monitoring",
    "Apply FDIC protection for large account balances",
    "Select appropriate accounts for specific financial goals"
  ],

  successTitle: "Banking Mastery Achieved!",
  successMessage: "Excellent! You've mastered banking fundamentals and unlocked advanced account optimization strategies.",
  nextChapter: "Chapter 3: Budgeting & Cash Flow Mastery"
};

interface BankingFundamentalsQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function BankingFundamentalsQuizEnhanced({ onComplete }: BankingFundamentalsQuizProps) {
  return (
    <EnhancedQuizEngine 
      config={bankingQuizConfig}
      onComplete={onComplete}
    />
  );
}

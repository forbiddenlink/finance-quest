'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const taxOptimizationQuizConfig = {
  id: 'tax-optimization-enhanced-quiz',
  title: 'Tax Optimization & Planning Quiz',
  description: 'Master tax-advantaged accounts, tax-loss harvesting, and advanced tax optimization strategies',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter10',
  
  questions: [
    {
      id: 1,
      question: 'If you contribute $5,000 to a traditional 401(k) and you\'re in the 22% tax bracket, how much will this reduce your current year taxes?',
      options: [
        '$500',
        '$1,100',
        '$1,500',
        '$5,000'
      ],
      correctAnswer: 1,
      explanation: '$5,000 × 22% = $1,100 tax savings! Traditional 401(k) contributions are made with pre-tax dollars, reducing your taxable income dollar-for-dollar. This is why maximizing tax-advantaged accounts is so powerful for building wealth.',
      category: 'pretax',
      concept: 'Pre-Tax Contribution Benefits',
      difficulty: 'easy' as const
    },
    {
      id: 2,
      question: 'What is tax-loss harvesting?',
      options: [
        'Selling winning investments to realize gains',
        'Selling losing investments to offset capital gains',
        'Moving money between different account types',
        'Claiming business expenses on personal taxes'
      ],
      correctAnswer: 1,
      explanation: 'Tax-loss harvesting means selling investments that have lost value to offset capital gains from profitable investments. You can offset up to $3,000 in ordinary income per year with net capital losses, and carry forward additional losses to future years.',
      category: 'harvest',
      concept: 'Tax-Loss Harvesting Strategy',
      difficulty: 'medium' as const
    },
    {
      id: 3,
      question: 'What is a "backdoor Roth IRA" conversion?',
      options: [
        'Illegally hiding money from taxes',
        'Converting traditional IRA to Roth when income is too high for direct Roth contributions',
        'Using an HSA as a retirement account',
        'Borrowing from your 401(k) to fund an IRA'
      ],
      correctAnswer: 1,
      explanation: 'A backdoor Roth allows high earners (over $138,000 for 2024) to contribute to a Roth IRA indirectly. You contribute to a traditional IRA (no income limits), then immediately convert it to a Roth IRA, paying taxes on the conversion.',
      category: 'roth',
      concept: 'Backdoor Roth Strategy',
      difficulty: 'hard' as const
    },
    {
      id: 4,
      question: 'What makes an HSA the "ultimate" tax-advantaged account?',
      options: [
        'Higher contribution limits than 401(k)s',
        'Tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses',
        'No required minimum distributions ever',
        'You can use it for any expense penalty-free'
      ],
      correctAnswer: 1,
      explanation: 'HSAs offer a "triple tax advantage": 1) Tax-deductible contributions, 2) Tax-free investment growth, and 3) Tax-free withdrawals for qualified medical expenses. After age 65, you can withdraw for any purpose (paying only income tax, like a traditional IRA).',
      category: 'hsa',
      concept: 'HSA Triple Tax Advantage',
      difficulty: 'medium' as const
    },
    {
      id: 5,
      question: 'If your income puts you right at the edge of a higher tax bracket, what should you consider?',
      options: [
        'Nothing - tax brackets don\'t really matter',
        'Strategies to lower your taxable income below the bracket threshold',
        'Realizing more capital gains since you\'re already in a high bracket',
        'Converting all your traditional IRAs to Roth IRAs'
      ],
      correctAnswer: 1,
      explanation: 'Tax bracket management is crucial! If you\'re close to the next bracket, consider maximizing 401(k) contributions, HSA contributions, or tax-loss harvesting to stay in the lower bracket. Remember: only income ABOVE the bracket threshold is taxed at the higher rate.',
      category: 'brackets',
      concept: 'Tax Bracket Arbitrage',
      difficulty: 'medium' as const
    },
    {
      id: 6,
      question: 'What\'s the difference between short-term and long-term capital gains tax rates?',
      options: [
        'No difference - all capital gains are taxed the same',
        'Short-term gains are taxed as ordinary income; long-term gains have preferential rates',
        'Long-term gains are always taxed at 15%',
        'Short-term gains are tax-free if under $1,000'
      ],
      correctAnswer: 1,
      explanation: 'Short-term capital gains (investments held < 1 year) are taxed as ordinary income (up to 37%). Long-term capital gains (held ≥ 1 year) have preferential rates: 0%, 15%, or 20% depending on your income. This is why "buy and hold" is tax-efficient!',
      category: 'gains',
      concept: 'Capital Gains Tax Optimization',
      difficulty: 'medium' as const
    },
    {
      id: 7,
      question: 'Which is generally more valuable: a $1,000 tax deduction or a $1,000 tax credit?',
      options: [
        'Tax deduction (reduces taxable income)',
        'Tax credit (reduces taxes owed dollar-for-dollar)',
        'They\'re exactly the same value',
        'It depends on your filing status'
      ],
      correctAnswer: 1,
      explanation: 'Tax credits are more valuable! A $1,000 tax credit reduces your taxes by exactly $1,000. A $1,000 tax deduction only saves you $1,000 × your tax rate. If you\'re in the 22% bracket, a $1,000 deduction only saves $220 in taxes.',
      category: 'deductions',
      concept: 'Tax Credits vs Deductions',
      difficulty: 'easy' as const
    },
    {
      id: 8,
      question: 'What is "asset location" in tax-efficient investing?',
      options: [
        'Buying real estate in low-tax states',
        'Placing tax-inefficient investments in tax-advantaged accounts and tax-efficient investments in taxable accounts',
        'Diversifying across different asset classes',
        'Investing only in index funds'
      ],
      correctAnswer: 1,
      explanation: 'Asset location means strategically placing investments in the right account types. Put tax-inefficient investments (REITs, bonds, actively managed funds) in tax-advantaged accounts, and tax-efficient investments (index funds, individual stocks) in taxable accounts to minimize your overall tax bill.',
      category: 'efficiency',
      concept: 'Asset Location Strategy',
      difficulty: 'hard' as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'pretax': { icon: () => null, label: 'Pre-Tax Accounts' },
    'harvest': { icon: () => null, label: 'Tax-Loss Harvesting' },
    'roth': { icon: () => null, label: 'Roth Strategies' },
    'hsa': { icon: () => null, label: 'HSA Benefits' },
    'brackets': { icon: () => null, label: 'Tax Brackets' },
    'gains': { icon: () => null, label: 'Capital Gains' },
    'deductions': { icon: () => null, label: 'Deductions' },
    'efficiency': { icon: () => null, label: 'Tax Efficiency' }
  },

  // Concept mapping for spaced repetition
  concepts: [
    { id: "Pre-Tax Contribution Benefits", name: "Pre-Tax Contribution Benefits", category: "pretax" },
    { id: "Tax-Loss Harvesting Strategy", name: "Tax-Loss Harvesting Strategy", category: "harvest" },
    { id: "Backdoor Roth Strategy", name: "Backdoor Roth Strategy", category: "roth" },
    { id: "HSA Triple Tax Advantage", name: "HSA Triple Tax Advantage", category: "hsa" },
    { id: "Tax Bracket Arbitrage", name: "Tax Bracket Arbitrage", category: "brackets" },
    { id: "Capital Gains Tax Optimization", name: "Capital Gains Tax Optimization", category: "gains" },
    { id: "Tax Credits vs Deductions", name: "Tax Credits vs Deductions", category: "deductions" },
    { id: "Asset Location Strategy", name: "Asset Location Strategy", category: "efficiency" }
  ],

  successMessage: "Outstanding! You've mastered tax optimization strategies. You understand pre-tax accounts, tax-loss harvesting, and advanced tax planning.",
  failureMessage: "Review tax optimization concepts. Focus on tax-advantaged accounts and capital gains strategies."
};

export default function TaxOptimizationQuizEnhanced() {
  return <EnhancedQuizEngine config={taxOptimizationQuizConfig} />;
}

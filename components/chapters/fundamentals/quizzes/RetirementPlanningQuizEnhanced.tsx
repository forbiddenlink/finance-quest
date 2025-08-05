'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const retirementPlanningQuizConfig = {
  id: 'retirement-planning-enhanced-quiz',
  title: 'Retirement Planning & Long-Term Wealth Quiz',
  description: 'Master retirement planning strategies, 401(k) optimization, and long-term wealth building techniques',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter9',
  
  questions: [
    {
      id: 1,
      question: 'A 25-year-old saves $200/month for retirement. A 35-year-old saves $400/month. Both retire at 65. Assuming 7% annual returns, who will have more money at retirement?',
      options: [
        'The 35-year-old (saved twice as much per month)',
        'The 25-year-old (started 10 years earlier)',
        'They will have roughly the same amount',
        'Not enough information to determine'
      ],
      correctAnswer: 1,
      explanation: 'The 25-year-old will have significantly more! Starting early gives you more time for compound interest. The 25-year-old saves $200/month for 40 years ($96,000 total) and ends up with ~$525,000. The 35-year-old saves $400/month for 30 years ($144,000 total) but only ends up with ~$398,000. Time beats money!',
      category: 'timing',
      concept: 'Early Investing Advantage',
      difficulty: 'medium' as const
    },
    {
      id: 2,
      question: 'What is the maximum you can contribute to a 401(k) in 2024 if you are under 50 years old?',
      options: [
        '$19,500',
        '$22,500',
        '$23,000',
        '$30,000'
      ],
      correctAnswer: 2,
      explanation: 'The 2024 contribution limit for 401(k)s is $23,000 for those under 50. If you\'re 50 or older, you can contribute an additional $7,500 as a "catch-up" contribution, bringing the total to $30,500. These limits increase periodically with inflation.',
      category: 'contributions',
      concept: '401k Contribution Limits',
      difficulty: 'easy' as const
    },
    {
      id: 3,
      question: 'If you withdraw $10,000 from your traditional 401(k) at age 35 for a non-qualifying expense, what will you typically owe?',
      options: [
        'Nothing - it\'s your money',
        'Just a 10% early withdrawal penalty ($1,000)',
        'Income tax on $10,000 plus 10% penalty',
        'A flat $2,500 fee'
      ],
      correctAnswer: 2,
      explanation: 'You\'ll owe both income tax AND a 10% early withdrawal penalty. If you\'re in the 22% tax bracket, you\'d pay $2,200 in taxes plus $1,000 penalty = $3,200 total! This is why 401(k)s are meant for retirement - early withdrawals are expensive.',
      category: 'withdrawals',
      concept: 'Early Withdrawal Penalties',
      difficulty: 'medium' as const
    },
    {
      id: 4,
      question: 'What is the "bucket strategy" for retirement withdrawals?',
      options: [
        'Withdrawing money in equal monthly amounts',
        'Only withdrawing from bonds and cash',
        'Dividing investments into short, medium, and long-term buckets',
        'Maximizing Social Security benefits'
      ],
      correctAnswer: 2,
      explanation: 'The bucket strategy divides your retirement portfolio into 3 buckets: Bucket 1 (1-3 years of expenses in cash/bonds), Bucket 2 (4-10 years in moderate investments), and Bucket 3 (10+ years in growth stocks). This provides stability while maintaining growth potential.',
      category: 'strategies',
      concept: 'Bucket Withdrawal Strategy',
      difficulty: 'hard' as const
    },
    {
      id: 5,
      question: 'What is the main advantage of a Roth 401(k) over a traditional 401(k)?',
      options: [
        'Higher contribution limits',
        'Tax-free withdrawals in retirement',
        'Employer matching is not required',
        'You can withdraw contributions anytime'
      ],
      correctAnswer: 1,
      explanation: 'Roth 401(k) contributions are made with after-tax dollars, so your withdrawals in retirement are completely tax-free! This is especially valuable if you expect to be in a higher tax bracket in retirement or if tax rates increase over time.',
      category: 'accounts',
      concept: 'Roth vs Traditional Benefits',
      difficulty: 'medium' as const
    },
    {
      id: 6,
      question: 'To maximize Social Security benefits, when should you ideally start claiming?',
      options: [
        'As soon as you retire (age 62)',
        'At your full retirement age (66-67)',
        'At age 70 (maximum benefit)',
        'It doesn\'t matter when you start'
      ],
      correctAnswer: 2,
      explanation: 'Waiting until age 70 gives you the maximum Social Security benefit - about 132% of your full benefit amount. For every year you delay past full retirement age (up to 70), your benefit increases by about 8%. That\'s a guaranteed 8% return!',
      category: 'social-security',
      concept: 'Social Security Optimization',
      difficulty: 'medium' as const
    },
    {
      id: 7,
      question: 'What percentage of your pre-retirement income should you aim to replace in retirement?',
      options: [
        '50-60%',
        '70-80%',
        '90-100%',
        '110-120%'
      ],
      correctAnswer: 1,
      explanation: 'Most financial planners recommend replacing 70-80% of your pre-retirement income. You may need less because you\'ll no longer save for retirement, may have paid off your mortgage, and could have lower expenses. However, healthcare costs may increase.',
      category: 'planning',
      concept: 'Income Replacement Targets',
      difficulty: 'easy' as const
    },
    {
      id: 8,
      question: 'In what order should you generally save for retirement to maximize tax benefits?',
      options: [
        '401(k) → Roth IRA → Traditional IRA → Taxable accounts',
        'Roth IRA → 401(k) → Traditional IRA → Taxable accounts',
        '401(k) up to employer match → Roth IRA → Max 401(k) → Taxable accounts',
        'Traditional IRA → 401(k) → Roth IRA → Taxable accounts'
      ],
      correctAnswer: 2,
      explanation: 'The optimal order is: 1) 401(k) up to employer match (free money!), 2) Max out Roth IRA ($6,500 in 2024), 3) Max out 401(k) ($23,000), then 4) Taxable investment accounts. This maximizes tax advantages and employer matching.',
      category: 'optimization',
      concept: 'Retirement Savings Priority',
      difficulty: 'hard' as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'timing': { icon: () => null, label: 'Early Investing' },
    'contributions': { icon: () => null, label: 'Contribution Limits' },
    'withdrawals': { icon: () => null, label: 'Withdrawal Rules' },
    'strategies': { icon: () => null, label: 'Retirement Strategies' },
    'accounts': { icon: () => null, label: 'Account Types' },
    'social-security': { icon: () => null, label: 'Social Security' },
    'planning': { icon: () => null, label: 'Planning Targets' },
    'optimization': { icon: () => null, label: 'Tax Optimization' }
  },

  // Concept mapping for spaced repetition
  concepts: [
    { id: "Early Investing Advantage", name: "Early Investing Advantage", category: "timing" },
    { id: "401k Contribution Limits", name: "401k Contribution Limits", category: "contributions" },
    { id: "Early Withdrawal Penalties", name: "Early Withdrawal Penalties", category: "withdrawals" },
    { id: "Bucket Withdrawal Strategy", name: "Bucket Withdrawal Strategy", category: "strategies" },
    { id: "Roth vs Traditional Benefits", name: "Roth vs Traditional Benefits", category: "accounts" },
    { id: "Social Security Optimization", name: "Social Security Optimization", category: "social-security" },
    { id: "Income Replacement Targets", name: "Income Replacement Targets", category: "planning" },
    { id: "Retirement Savings Priority", name: "Retirement Savings Priority", category: "optimization" }
  ],

  successMessage: "Excellent! You've mastered retirement planning fundamentals. You understand the power of early investing, contribution limits, and withdrawal strategies.",
  failureMessage: "Keep studying retirement planning concepts. Focus on compound interest benefits and contribution strategies."
};

export default function RetirementPlanningQuizEnhanced() {
  return <EnhancedQuizEngine config={retirementPlanningQuizConfig} />;
}

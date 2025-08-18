import { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is a credit score?',
    options: [
      'A random number assigned by banks',
      'A numerical representation of your creditworthiness',
      'The amount of money you owe to creditors',
      'Your bank account balance'
    ],
    correctAnswer: 1,
    explanation: 'A credit score is a numerical representation of your creditworthiness based on your credit history, including factors like payment history, credit utilization, length of credit history, and types of credit used.',
    category: 'credit_basics',
    difficulty: 'basic',
    points: 10
  },
  {
    id: 'q2',
    question: 'Which of these factors has the biggest impact on your credit score?',
    options: [
      'Payment history',
      'Credit utilization',
      'Length of credit history',
      'Types of credit used'
    ],
    correctAnswer: 0,
    explanation: 'Payment history accounts for about 35% of your FICO score, making it the most influential factor. It shows lenders how reliable you are in paying back what you borrow.',
    category: 'credit_basics',
    difficulty: 'basic',
    points: 10
  },
  {
    id: 'q3',
    question: 'What is a good credit utilization ratio?',
    options: [
      'Above 50%',
      'Below 30%',
      'Exactly 0%',
      '100%'
    ],
    correctAnswer: 1,
    explanation: 'Credit experts recommend keeping your credit utilization ratio below 30%. This means using less than 30% of your available credit. Lower utilization rates generally result in better credit scores.',
    category: 'credit_improvement',
    difficulty: 'intermediate',
    points: 15
  },
  {
    id: 'q4',
    question: 'How often can you get a free credit report from each major credit bureau?',
    options: [
      'Once a month',
      'Once every six months',
      'Once a year',
      'Once every two years'
    ],
    correctAnswer: 2,
    explanation: 'Under federal law (FCRA), you\'re entitled to one free credit report from each of the three major credit bureaus (Equifax, Experian, and TransUnion) once every 12 months through AnnualCreditReport.com.',
    category: 'credit_reports',
    difficulty: 'basic',
    points: 10
  },
  {
    id: 'q5',
    question: 'What is a hard inquiry on your credit report?',
    options: [
      'When you check your own credit score',
      'When a lender checks your credit for a loan application',
      'When your credit score drops significantly',
      'When you make a late payment'
    ],
    correctAnswer: 1,
    explanation: 'A hard inquiry occurs when a lender checks your credit report as part of a loan application process. Unlike soft inquiries, hard inquiries can slightly lower your credit score and stay on your report for about 2 years.',
    category: 'credit_reports',
    difficulty: 'intermediate',
    points: 15
  },
  {
    id: 'q6',
    question: 'How long do most negative items stay on your credit report?',
    options: [
      '3 years',
      '5 years',
      '7 years',
      '10 years'
    ],
    correctAnswer: 2,
    explanation: 'Most negative items (like late payments, collections, and charge-offs) stay on your credit report for 7 years. However, some bankruptcies can stay for up to 10 years.',
    category: 'credit_reports',
    difficulty: 'intermediate',
    points: 15
  },
  {
    id: 'q7',
    question: 'What is credit monitoring?',
    options: [
      'Checking your bank balance daily',
      'A service that tracks changes in your credit report',
      'Paying your bills on time',
      'Applying for new credit cards'
    ],
    correctAnswer: 1,
    explanation: 'Credit monitoring is a service that tracks changes in your credit report and alerts you to potential fraud or identity theft. It can help you spot unauthorized accounts, inquiries, or other suspicious activities.',
    category: 'credit_monitoring',
    difficulty: 'basic',
    points: 10
  },
  {
    id: 'q8',
    question: 'What should you do if you find an error on your credit report?',
    options: [
      'Ignore it as it will eventually go away',
      'Call your bank',
      'File a dispute with the credit bureau',
      'Close the affected account'
    ],
    correctAnswer: 2,
    explanation: 'If you find an error on your credit report, you should file a dispute with the credit bureau reporting the error. The bureau must investigate and respond within 30 days (45 in some cases).',
    category: 'credit_reports',
    difficulty: 'intermediate',
    points: 15
  },
  {
    id: 'q9',
    question: 'What is a credit freeze?',
    options: [
      'When your credit card is declined',
      'A tool that prevents new credit accounts from being opened',
      'When you stop using credit cards',
      'A temporary drop in your credit score'
    ],
    correctAnswer: 1,
    explanation: 'A credit freeze (or security freeze) prevents new credit accounts from being opened in your name. It\'s a powerful tool for preventing identity theft, as creditors cannot access your credit report to approve new accounts.',
    category: 'credit_monitoring',
    difficulty: 'advanced',
    points: 20
  },
  {
    id: 'q10',
    question: 'Which action is most likely to improve your credit score quickly?',
    options: [
      'Opening several new credit cards',
      'Paying down credit card balances',
      'Closing old credit accounts',
      'Applying for a new loan'
    ],
    correctAnswer: 1,
    explanation: 'Paying down credit card balances can quickly improve your credit utilization ratio, which is a major factor in your credit score. This can lead to a noticeable improvement in your score within a few billing cycles.',
    category: 'credit_improvement',
    difficulty: 'advanced',
    points: 20
  }
] as const;

export const CATEGORY_INFO = {
  credit_basics: {
    name: 'Credit Basics',
    description: 'Fundamental concepts about credit scores and how they work'
  },
  credit_reports: {
    name: 'Credit Reports',
    description: 'Understanding credit reports, their contents, and how to read them'
  },
  credit_monitoring: {
    name: 'Credit Monitoring',
    description: 'Tools and practices for monitoring and protecting your credit'
  },
  credit_improvement: {
    name: 'Credit Improvement',
    description: 'Strategies and actions to improve your credit score'
  }
} as const;

export const DIFFICULTY_INFO = {
  basic: {
    name: 'Basic',
    description: 'Fundamental concepts everyone should know',
    color: 'bg-green-100 text-green-800'
  },
  intermediate: {
    name: 'Intermediate',
    description: 'More detailed concepts for better understanding',
    color: 'bg-blue-100 text-blue-800'
  },
  advanced: {
    name: 'Advanced',
    description: 'Complex concepts for mastering credit',
    color: 'bg-purple-100 text-purple-800'
  }
} as const;

export const QUIZ_CONFIG = {
  timeLimit: 20 * 60, // 20 minutes in seconds
  passingScore: 70,
  maxAttempts: 3,
  showHints: true,
  showExplanations: true,
  shuffleQuestions: true,
  shuffleOptions: true
} as const;

export const ANALYTICS_CONFIG = {
  weakCategoryThreshold: 0.7, // 70% accuracy
  recommendationThreshold: 3, // minimum number of questions to generate recommendations
  timeWarningThreshold: 60 // seconds remaining for warning
} as const;

'use client';

import React from 'react';
import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const InsuranceRiskManagementQuizEnhanced: React.FC = () => {
  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of life insurance?",
      options: [
        "To provide investment returns",
        "To replace lost income for beneficiaries",
        "To reduce tax liability",
        "To build retirement savings"
      ],
      correctAnswer: 1,
      explanation: "Life insurance primarily serves to replace lost income and provide financial security for beneficiaries after the policyholder's death.",
      category: "Life Insurance",
      difficulty: "easy" as const
    },
    {
      id: 2,
      question: "Which type of life insurance typically offers the lowest premiums for young, healthy individuals?",
      options: [
        "Whole life insurance",
        "Universal life insurance",
        "Term life insurance",
        "Variable life insurance"
      ],
      correctAnswer: 2,
      explanation: "Term life insurance offers the lowest premiums because it provides pure insurance coverage without investment components.",
      category: "Life Insurance",
      difficulty: "easy" as const
    },
    {
      id: 3,
      question: "What does the deductible in health insurance represent?",
      options: [
        "The maximum you'll pay in a year",
        "The amount you pay before insurance coverage begins",
        "The percentage you pay for covered services",
        "The monthly premium cost"
      ],
      correctAnswer: 1,
      explanation: "A deductible is the amount you must pay out-of-pocket before your insurance coverage begins to pay for covered services.",
      category: "Health Insurance",
      difficulty: "easy" as const
    },
    {
      id: 4,
      question: "Which factor does NOT typically affect auto insurance premiums?",
      options: [
        "Driving record",
        "Age and gender",
        "Credit score",
        "Political affiliation"
      ],
      correctAnswer: 3,
      explanation: "Political affiliation is not a factor in determining auto insurance premiums. Insurers focus on risk-related factors like driving history, demographics, and credit score.",
      category: "Auto Insurance",
      difficulty: "easy" as const
    },
    {
      id: 5,
      question: "What is the recommended amount of life insurance coverage using the income replacement method?",
      options: [
        "3-5 times annual income",
        "5-7 times annual income",
        "8-12 times annual income",
        "15-20 times annual income"
      ],
      correctAnswer: 2,
      explanation: "Financial experts typically recommend 8-12 times annual income to adequately replace lost income and maintain beneficiaries' standard of living.",
      category: "Life Insurance",
      difficulty: "medium" as const
    },
    {
      id: 6,
      question: "Which type of disability insurance typically provides benefits for the longest period?",
      options: [
        "Short-term disability",
        "Long-term disability",
        "Social Security Disability",
        "Workers' compensation"
      ],
      correctAnswer: 1,
      explanation: "Long-term disability insurance can provide benefits until retirement age, making it the longest-duration coverage among the options.",
      category: "Disability Insurance",
      difficulty: "medium" as const
    },
    {
      id: 7,
      question: "What is the main difference between HMO and PPO health insurance plans?",
      options: [
        "Cost of premiums only",
        "Network restrictions and referral requirements",
        "Prescription drug coverage",
        "Emergency care coverage"
      ],
      correctAnswer: 1,
      explanation: "HMOs typically require referrals and have stricter network restrictions, while PPOs offer more flexibility in choosing providers but at higher costs.",
      category: "Health Insurance",
      difficulty: "medium" as const
    },
    {
      id: 8,
      question: "Which property insurance coverage protects against loss of rental income?",
      options: [
        "Dwelling coverage",
        "Personal property coverage",
        "Loss of use coverage",
        "Liability coverage"
      ],
      correctAnswer: 2,
      explanation: "Loss of use coverage (also called additional living expenses) covers rental income loss or additional living costs when your property is uninhabitable.",
      category: "Property Insurance",
      difficulty: "medium" as const
    },
    {
      id: 9,
      question: "What is the 'elimination period' in disability insurance?",
      options: [
        "The waiting period before benefits begin",
        "The maximum benefit period",
        "The premium payment period",
        "The coverage exclusion period"
      ],
      correctAnswer: 0,
      explanation: "The elimination period is the waiting period after disability occurs before benefits begin, similar to a deductible but measured in time.",
      category: "Disability Insurance",
      difficulty: "hard" as const
    },
    {
      id: 10,
      question: "Which insurance concept involves retaining small losses while transferring large losses?",
      options: [
        "Self-insurance",
        "Risk pooling",
        "Risk retention with insurance",
        "Captive insurance"
      ],
      correctAnswer: 2,
      explanation: "Risk retention with insurance involves keeping smaller, manageable risks while transferring larger, catastrophic risks through higher deductibles and appropriate coverage limits.",
      category: "Risk Management",
      difficulty: "hard" as const
    },
    {
      id: 11,
      question: "What is the primary advantage of term life insurance over permanent life insurance?",
      options: [
        "Cash value accumulation",
        "Lower cost for pure insurance coverage",
        "Guaranteed premiums for life",
        "Tax-free loans available"
      ],
      correctAnswer: 1,
      explanation: "Term life insurance's main advantage is providing pure insurance coverage at significantly lower cost, especially for younger individuals.",
      category: "Life Insurance",
      difficulty: "hard" as const
    },
    {
      id: 12,
      question: "Which factor is most important when determining umbrella insurance coverage needs?",
      options: [
        "Current income level",
        "Total net worth and assets to protect",
        "Number of dependents",
        "Age and health status"
      ],
      correctAnswer: 1,
      explanation: "Umbrella insurance should protect your total net worth and future earnings potential, as liability claims can target all your assets.",
      category: "Liability Insurance",
      difficulty: "hard" as const
    }
  ];

  const config = {
    id: 'insurance-risk-management-quiz',
    title: 'Insurance & Risk Management Mastery',
    description: 'Test your knowledge of insurance types, coverage options, and risk management strategies',
    passingScore: 80,
    questions: questions,
    categories: {
      'Life Insurance': { icon: () => null, label: 'Life Insurance' },
      'Health Insurance': { icon: () => null, label: 'Health Insurance' },
      'Auto Insurance': { icon: () => null, label: 'Auto Insurance' },
      'Disability Insurance': { icon: () => null, label: 'Disability Insurance' },
      'Property Insurance': { icon: () => null, label: 'Property Insurance' },
      'Risk Management': { icon: () => null, label: 'Risk Management' },
      'Liability Insurance': { icon: () => null, label: 'Liability Insurance' }
    },
    chapterId: 'chapter11',
    enableSpacedRepetition: true,
    successMessage: 'Excellent! You\'ve mastered insurance and risk management fundamentals!'
  };

  return (
    <EnhancedQuizEngine
      config={config}
    />
  );
};

export default InsuranceRiskManagementQuizEnhanced;

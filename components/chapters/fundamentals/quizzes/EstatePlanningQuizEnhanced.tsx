'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const estatePlanningQuizConfig = {
  id: 'estate-planning-enhanced-quiz',
  title: 'Estate Planning & Wealth Transfer Quiz',
  description: 'Master estate taxes, trust structures, gift strategies, and wealth preservation techniques',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter17',
  
  questions: [
    {
      id: 1,
      question: "What is the federal estate tax exemption for 2024?",
      options: [
        "$5.49 million",
        "$11.7 million", 
        "$13.61 million",
        "$18.0 million"
      ],
      correctAnswer: 2,
      explanation: "The 2024 federal estate tax exemption is $13.61 million per person, with portability allowing spouses to combine exemptions for up to $27.22 million.",
      category: 'tax-planning',
      concept: 'Estate Tax Exemption',
      difficulty: 'easy' as const
    },
    {
      id: 2,
      question: "Which type of trust allows the grantor to retain control and make changes?",
      options: [
        "Irrevocable trust",
        "Revocable trust",
        "Charitable remainder trust",
        "Generation-skipping trust"
      ],
      correctAnswer: 1,
      explanation: "A revocable trust (also called a living trust) allows the grantor to maintain control and make changes during their lifetime, but provides no estate tax benefits.",
      category: 'trusts',
      concept: 'Revocable vs Irrevocable Trusts',
      difficulty: 'easy' as const
    },
    {
      id: 3,
      question: "What is the 2024 annual gift tax exclusion per recipient?",
      options: [
        "$15,000",
        "$16,000",
        "$17,000", 
        "$18,000"
      ],
      correctAnswer: 3,
      explanation: "The 2024 annual gift tax exclusion is $18,000 per recipient. This means you can give up to $18,000 to any number of people without using your lifetime exemption.",
      category: 'gifting',
      concept: 'Annual Gift Tax Exclusion',
      difficulty: 'easy' as const
    },
    {
      id: 4,
      question: "What percentage of family businesses survive to the third generation?",
      options: [
        "12%",
        "30%",
        "50%",
        "70%"
      ],
      correctAnswer: 0,
      explanation: "Only about 12% of family businesses survive to the third generation. This statistic highlights the importance of proper estate planning and succession planning for business owners.",
      category: 'succession',
      concept: 'Family Business Succession Statistics',
      difficulty: 'medium' as const
    },
    {
      id: 5,
      question: "Which document is most important for avoiding probate?",
      options: [
        "Will",
        "Power of attorney",
        "Living trust",
        "Life insurance policy"
      ],
      correctAnswer: 2,
      explanation: "A living trust is the most effective tool for avoiding probate. Assets held in trust pass directly to beneficiaries without going through the court-supervised probate process.",
      category: 'probate',
      concept: 'Probate Avoidance Strategies',
      difficulty: 'medium' as const
    },
    {
      id: 6,
      question: "What is the primary benefit of an irrevocable trust?",
      options: [
        "Flexibility to make changes",
        "Removes assets from taxable estate",
        "Easier administration",
        "Lower setup costs"
      ],
      correctAnswer: 1,
      explanation: "The primary benefit of an irrevocable trust is removing assets from your taxable estate, potentially reducing estate taxes. However, you give up control over the assets permanently.",
      category: 'trusts',
      concept: 'Irrevocable Trust Benefits',
      difficulty: 'medium' as const
    },
    {
      id: 7,
      question: "What does 'portability' mean in estate tax planning?",
      options: [
        "Moving assets between states",
        "Surviving spouse can use deceased spouse's unused exemption",
        "Transferring trust assets",
        "Converting trust types"
      ],
      correctAnswer: 1,
      explanation: "Portability allows a surviving spouse to use their deceased spouse's unused federal estate tax exemption, effectively doubling the exemption to over $27 million for married couples in 2024.",
      category: 'tax-planning',
      concept: 'Estate Tax Portability',
      difficulty: 'hard' as const
    },
    {
      id: 8,
      question: "Which strategy is most effective for valuation discounts?",
      options: [
        "Charitable remainder trusts",
        "Family limited partnerships",
        "Revocable trusts",
        "529 education plans"
      ],
      correctAnswer: 1,
      explanation: "Family limited partnerships (FLPs) can provide valuation discounts for lack of marketability and minority interest, potentially reducing the taxable value of transferred assets by 20-40%.",
      category: 'strategies',
      concept: 'Valuation Discount Strategies',
      difficulty: 'hard' as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'tax-planning': { icon: () => null, label: 'Tax Planning' },
    'trusts': { icon: () => null, label: 'Trust Structures' },
    'gifting': { icon: () => null, label: 'Gift Strategies' },
    'succession': { icon: () => null, label: 'Business Succession' },
    'probate': { icon: () => null, label: 'Probate Avoidance' },
    'strategies': { icon: () => null, label: 'Advanced Strategies' }
  },

  // Concept mapping for spaced repetition
  concepts: [
    { id: "Estate Tax Exemption", name: "Estate Tax Exemption", category: "tax-planning" },
    { id: "Revocable vs Irrevocable Trusts", name: "Revocable vs Irrevocable Trusts", category: "trusts" },
    { id: "Annual Gift Tax Exclusion", name: "Annual Gift Tax Exclusion", category: "gifting" },
    { id: "Family Business Succession Statistics", name: "Family Business Succession Statistics", category: "succession" },
    { id: "Probate Avoidance Strategies", name: "Probate Avoidance Strategies", category: "probate" },
    { id: "Irrevocable Trust Benefits", name: "Irrevocable Trust Benefits", category: "trusts" },
    { id: "Estate Tax Portability", name: "Estate Tax Portability", category: "tax-planning" },
    { id: "Valuation Discount Strategies", name: "Valuation Discount Strategies", category: "strategies" }
  ],

  successMessage: "🎉 CONGRATULATIONS! You've mastered estate planning and wealth transfer strategies. You understand tax exemptions, trust structures, and advanced planning techniques!",
  failureMessage: "Review estate planning concepts. Focus on tax exemptions, trust types, and wealth transfer strategies."
};

export default function EstatePlanningQuizEnhanced() {
  return <EnhancedQuizEngine config={estatePlanningQuizConfig} />;
}

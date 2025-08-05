'use client';

import EnhancedQuizEngine from '@/components/shared/quiz/EnhancedQuizEngine';

const incomeCareerQuizConfig = {
  id: 'income-career-enhanced-quiz',
  title: 'Income & Career Optimization Quiz',
  description: 'Master salary negotiation, total compensation analysis, side hustles, and career advancement strategies',
  passingScore: 80,
  enableSpacedRepetition: true,
  chapterId: 'chapter5',
  
  questions: [
    {
      id: 1,
      question: "Sarah's base salary is $70,000. Her benefits include health insurance worth $12,000, 401k matching worth $3,500, and 20 days PTO. What's her total compensation value?",
      options: [
        "$70,000 (salary is what matters)",
        "$82,000 (salary + health insurance only)",
        "$85,500 (salary + health + 401k matching)",
        "$89,000+ (including PTO value)"
      ],
      correctAnswer: 3,
      explanation: "Total compensation includes ALL benefits. 20 days PTO at $70k salary = ~$3,500 additional value. Total: $70k + $12k + $3.5k + $3.5k = $89k (27% more than base salary!)",
      category: "total-compensation",
      concept: "Total Compensation Analysis",
      difficulty: "medium" as const
    },
    {
      id: 2,
      question: "What's the best strategy for salary negotiation timing?",
      options: [
        "During the initial job interview",
        "After receiving an offer but before accepting",
        "Only during annual performance reviews",
        "Wait until you're unhappy with current pay"
      ],
      correctAnswer: 1,
      explanation: "The best time is after receiving an offer but before accepting. You have leverage because they want you, but haven't committed yet. This gives you maximum negotiating power.",
      category: "negotiation",
      concept: "Negotiation Timing",
      difficulty: "medium" as const
    },
    {
      id: 3,
      question: "Alex earns $60,000 and successfully negotiates a $10,000 raise. With 3% annual increases, what's the approximate 30-year impact?",
      options: [
        "$300,000 (just the extra $10k per year)",
        "$400,000+ (compound effect of higher base)",
        "$150,000 (present value discount)",
        "$50,000 (taxes reduce the benefit)"
      ],
      correctAnswer: 1,
      explanation: "The $10k raise becomes your new baseline for all future raises. Over 30 years with compound 3% increases, this single negotiation adds $400,000+ to lifetime earnings.",
      category: "negotiation",
      concept: "Compound Salary Growth",
      difficulty: "hard" as const
    },
    {
      id: 4,
      question: "Which side hustle approach has the highest income potential?",
      options: [
        "Trading time for money (freelance hourly work)",
        "Selling physical products on platforms",
        "Creating scalable digital products or services",
        "Participating in the gig economy"
      ],
      correctAnswer: 2,
      explanation: "Scalable digital products/services have unlimited upside potential. You create once and can sell infinitely without proportional time increases, unlike hourly work which caps at available hours.",
      category: "side-hustles",
      concept: "Scalable Income Streams",
      difficulty: "hard" as const
    },
    {
      id: 5,
      question: "Maria wants to increase her income 50% in 3 years. What's the most effective strategy?",
      options: [
        "Stay at current job and work extra hours",
        "Focus only on internal promotions",
        "Strategic job hopping every 2-3 years",
        "Start a side business immediately"
      ],
      correctAnswer: 2,
      explanation: "External job moves typically offer 10-20% salary increases vs 3-5% internal raises. Strategic job hopping can achieve 50% increases much faster than internal advancement alone.",
      category: "career-strategy",
      concept: "Career Advancement Strategy",
      difficulty: "medium" as const
    },
    {
      id: 6,
      question: "What percentage of total compensation should benefits typically represent?",
      options: [
        "5-10% (benefits are minor)",
        "15-25% (modest benefit value)",
        "20-40% (significant portion)",
        "50%+ (benefits exceed salary)"
      ],
      correctAnswer: 2,
      explanation: "Benefits typically represent 20-40% of total compensation. This includes health insurance, retirement matching, PTO, professional development, and other perks - substantial value beyond salary.",
      category: "total-compensation",
      concept: "Benefits Valuation",
      difficulty: "easy" as const
    },
    {
      id: 7,
      question: "John wants to negotiate but his company says 'salaries are fixed.' What should he do?",
      options: [
        "Accept the fixed salary policy",
        "Look for a new job immediately",
        "Negotiate non-salary benefits and perks",
        "Demand to speak with higher management"
      ],
      correctAnswer: 2,
      explanation: "Even with 'fixed' salaries, companies often have flexibility with title changes, additional PTO, remote work options, professional development budgets, or start date negotiations.",
      category: "negotiation",
      concept: "Creative Negotiation",
      difficulty: "medium" as const
    },
    {
      id: 8,
      question: "Which professional development investment typically has the highest ROI?",
      options: [
        "Any college degree program",
        "Industry-specific certifications",
        "General leadership courses",
        "Expensive MBA programs"
      ],
      correctAnswer: 1,
      explanation: "Industry-specific certifications often provide immediate, measurable value to employers and can increase salary quickly. A $3,000 certification that leads to a $10,000+ raise has 300%+ ROI.",
      category: "professional-development",
      concept: "Professional Development ROI",
      difficulty: "hard" as const
    }
  ],

  // Categories for quiz organization
  categories: {
    'total-compensation': { icon: () => null, label: 'Total Compensation' },
    'negotiation': { icon: () => null, label: 'Salary Negotiation' },
    'side-hustles': { icon: () => null, label: 'Side Hustles' },
    'career-strategy': { icon: () => null, label: 'Career Strategy' },
    'professional-development': { icon: () => null, label: 'Professional Development' }
  },

  successMessage: "Excellent! You've mastered income optimization and career advancement strategies for accelerated wealth building.",
  failureMessage: "Review income optimization strategies and try again. Focus on negotiation timing and total compensation analysis."
};

interface IncomeCareerQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function IncomeCareerQuizEnhanced({ onComplete }: IncomeCareerQuizProps) {
  return (
    <EnhancedQuizEngine 
      config={incomeCareerQuizConfig}
      onComplete={onComplete}
    />
  );
}

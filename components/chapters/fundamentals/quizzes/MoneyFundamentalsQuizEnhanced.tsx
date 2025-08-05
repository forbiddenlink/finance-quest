'use client';

import EnhancedQuizEngine, { QuizConfig } from '@/components/shared/quiz/EnhancedQuizEngine';
import { Brain, TrendingUp, Target, Lightbulb, PiggyBank } from 'lucide-react';

const moneyFundamentalsQuizConfig: QuizConfig = {
    id: 'money-fundamentals-quiz',
    title: 'Money Psychology & Mindset Quiz',
    description: 'Test your understanding of financial psychology, money mindset, and the foundational concepts for building wealth.',
    passingScore: 80,
    chapterId: 'chapter1',
    enableSpacedRepetition: true,
    successMessage: 'Outstanding! You\'ve mastered the psychological foundations of financial success. You\'re ready to build wealth with the right mindset!',
    failureMessage: 'Keep learning! Understanding money psychology is crucial for financial success. Review the lesson and try again.',
    categories: {
        psychology: { icon: Brain, label: 'Money Psychology' },
        mindset: { icon: Lightbulb, label: 'Wealth Mindset' },
        habits: { icon: Target, label: 'Financial Habits' },
        goals: { icon: TrendingUp, label: 'Goal Setting' },
        compound: { icon: PiggyBank, label: 'Compound Effect' }
    },
    questions: [
        {
            id: 1,
            question: 'What is the primary driver of most financial decisions according to behavioral finance?',
            options: [
                'Mathematical calculations and logical analysis',
                'Emotions and psychological factors',
                'Current market conditions',
                'Advice from financial experts'
            ],
            correctAnswer: 1,
            explanation: 'Research shows that emotions and psychological factors drive about 80% of financial decisions. Understanding this is key to making better money choices and avoiding costly emotional mistakes.',
            category: 'psychology',
            difficulty: 'medium',
            concept: 'behavioral-finance-basics'
        },
        {
            id: 2,
            question: 'Which money mindset is most likely to lead to long-term wealth building?',
            options: [
                'Scarcity mindset: "There\'s never enough money"',
                'Abundance mindset: "Money flows through opportunities I create"',
                'Neutral mindset: "Money doesn\'t matter"',
                'Fatalistic mindset: "Money is determined by luck"'
            ],
            correctAnswer: 1,
            explanation: 'An abundance mindset helps you see opportunities, take calculated risks, and make strategic decisions. It focuses on creating value and growing wealth rather than just protecting what you have.',
            category: 'mindset',
            difficulty: 'easy',
            concept: 'abundance-vs-scarcity'
        },
        {
            id: 3,
            question: 'What is the most powerful factor in building wealth according to the compound effect?',
            options: [
                'Making large investments occasionally',
                'Consistent small actions over time',
                'Timing the market perfectly',
                'Having a high income'
            ],
            correctAnswer: 1,
            explanation: 'The compound effect shows that consistent small actions over time create massive results. Saving just $5/day ($150/month) can become over $100,000 in 20 years with compound growth.',
            category: 'compound',
            difficulty: 'easy',
            concept: 'compound-effect-basics'
        },
        {
            id: 4,
            question: 'According to the lesson, what\'s the opportunity cost of a daily $6 coffee habit over 20 years?',
            options: [
                'About $25,000 in total spending',
                'About $43,800 in total spending',
                'About $87,000 in potential investment growth',
                'About $130,800 difference between spending vs. investing'
            ],
            correctAnswer: 3,
            explanation: 'The daily $6 coffee costs $43,800 over 20 years, but if invested at 7% return, it becomes $87,000. The total opportunity cost (difference) is $130,800 - showing how small daily habits compound dramatically!',
            category: 'compound',
            difficulty: 'hard',
            concept: 'opportunity-cost-calculation'
        },
        {
            id: 5,
            question: 'What\'s the key difference between SMART and PACT goal-setting frameworks?',
            options: [
                'SMART is better for financial goals, PACT for personal goals',
                'SMART focuses on outcomes, PACT focuses on process and habits',
                'SMART is for short-term goals, PACT for long-term goals',
                'There\'s no meaningful difference between them'
            ],
            correctAnswer: 1,
            explanation: 'SMART goals focus on specific outcomes which can feel overwhelming. PACT goals focus on Purposeful, Actionable, Continuous, Trackable processes that build sustainable habits leading to lasting behavioral change.',
            category: 'goals',
            difficulty: 'medium',
            concept: 'goal-setting-frameworks'
        },
        {
            id: 6,
            question: 'Which cognitive bias makes people feel losses about twice as strongly as equivalent gains?',
            options: [
                'Confirmation bias',
                'Anchoring bias',
                'Loss aversion',
                'Present bias'
            ],
            correctAnswer: 2,
            explanation: 'Loss aversion means we feel the pain of losing $100 about twice as strongly as the pleasure of gaining $100. This often prevents people from making good investments due to fear of short-term losses.',
            category: 'psychology',
            difficulty: 'medium',
            concept: 'cognitive-biases'
        },
        {
            id: 7,
            question: 'What\'s the most effective strategy for someone with a "Spender" money personality?',
            options: [
                'Strict budgeting with detailed expense tracking',
                'Automatic transfers to savings before seeing the money',
                'Avoiding all purchases for 30 days',
                'Only using cash for all purchases'
            ],
            correctAnswer: 1,
            explanation: 'Spenders enjoy using money for experiences and purchases. The most effective strategy is to "pay yourself first" with automatic savings transfers before you see the money, working WITH your natural tendencies.',
            category: 'psychology',
            difficulty: 'easy',
            concept: 'money-personality-types'
        },
        {
            id: 8,
            question: 'According to the compound effect principle, what happens when you improve by just 1% every day for a year?',
            options: [
                'You become about 4% better',
                'You become about 37% better',
                'You become about 365% better',
                'You become about 37 times better'
            ],
            correctAnswer: 3,
            explanation: '1.01^365 = 37.78. Improving by just 1% daily compounds to make you nearly 38 times better in a year! This mathematical principle applies to both learning and wealth building.',
            category: 'compound',
            difficulty: 'hard',
            concept: 'daily-improvement-compound'
        },
        {
            id: 9,
            question: 'What\'s the primary reason people struggle to build wealth despite good intentions?',
            options: [
                'Lack of financial knowledge and education',
                'Insufficient income to save and invest',
                'Unconscious money beliefs and emotional patterns from childhood',
                'Bad advice from financial advisors'
            ],
            correctAnswer: 2,
            explanation: 'While knowledge and income matter, research shows that unconscious money beliefs formed in childhood are the biggest barrier. These create self-sabotaging behaviors that prevent wealth building even when people know what to do.',
            category: 'psychology',
            difficulty: 'medium',
            concept: 'money-beliefs-childhood'
        },
        {
            id: 10,
            question: 'How should you reframe the thought "I can\'t afford it" to develop an abundance mindset?',
            options: [
                '"I don\'t need it anyway"',
                '"Maybe I can afford it next year"',
                '"How can I afford this if it\'s important to me?"',
                '"Rich people can afford it, but I can\'t"'
            ],
            correctAnswer: 2,
            explanation: 'Reframing "I can\'t afford it" to "How can I afford this if it\'s important?" shifts your brain from scarcity to problem-solving mode. It opens up creative solutions and income-generating opportunities.',
            category: 'mindset',
            difficulty: 'easy',
            concept: 'abundance-mindset-reframing'
        },
        {
            id: 11,
            question: 'What\'s the recommended approach when you catch yourself making a financial decision based on fear?',
            options: [
                'Ignore the fear and proceed anyway',
                'Always avoid the decision when afraid',
                'Pause, identify the fear, then analyze the real risks and opportunities',
                'Ask someone else to make the decision for you'
            ],
            correctAnswer: 2,
            explanation: 'Fear often signals either real danger or growth opportunity. The key is to pause, identify what you\'re actually afraid of, then make a rational analysis of real risks vs. potential benefits rather than deciding purely from emotion.',
            category: 'psychology',
            difficulty: 'medium',
            concept: 'fear-based-decisions'
        },
        {
            id: 12,
            question: 'Why is starting to invest early more powerful than investing larger amounts later?',
            options: [
                'Early investments have better returns',
                'Time allows compound interest to work its magic',
                'Market conditions are usually better when young',
                'Young people make smarter investment choices'
            ],
            correctAnswer: 1,
            explanation: 'Time is the most powerful factor in compound growth. Someone who invests $200/month from age 25-35 (only $24,000 total) will have more at retirement than someone who invests $200/month from age 35-65 ($72,000 total) due to the extra 10 years of compounding.',
            category: 'compound',
            difficulty: 'easy',
            concept: 'time-value-money'
        }
    ]
};

interface MoneyFundamentalsQuizEnhancedProps {
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
}

export default function MoneyFundamentalsQuizEnhanced({
    onComplete,
    className = ''
}: MoneyFundamentalsQuizEnhancedProps) {
    return (
        <EnhancedQuizEngine
            config={moneyFundamentalsQuizConfig}
            onComplete={onComplete}
            className={className}
        />
    );
}

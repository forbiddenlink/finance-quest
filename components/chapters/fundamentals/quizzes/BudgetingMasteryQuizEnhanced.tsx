'use client';

import EnhancedQuizEngine, { QuizConfig } from '@/components/shared/quiz/EnhancedQuizEngine';
import { Target, TrendingUp, DollarSign, Calculator, PieChart } from 'lucide-react';

const budgetingMasteryQuizConfig: QuizConfig = {
    id: 'budgeting-mastery-quiz',
    title: 'Budgeting & Cash Flow Mastery Quiz',
    description: 'Test your understanding of budgeting strategies, cash flow management, expense tracking, and financial planning fundamentals.',
    passingScore: 80,
    chapterId: 'chapter3',
    enableSpacedRepetition: true,
    successMessage: 'Outstanding! You\'ve mastered budgeting and cash flow management. You\'re ready to take control of your financial future!',
    failureMessage: 'Keep practicing! Budgeting is the foundation of financial success. Review the lesson and focus on the 50/30/20 rule and expense tracking.',
    categories: {
        basics: { icon: Target, label: 'Budget Basics' },
        methods: { icon: Calculator, label: 'Budgeting Methods' },
        tracking: { icon: TrendingUp, label: 'Expense Tracking' },
        cashflow: { icon: DollarSign, label: 'Cash Flow' },
        planning: { icon: PieChart, label: 'Financial Planning' }
    },
    questions: [
        {
            id: 1,
            question: 'What is the 50/30/20 budgeting rule?',
            options: [
                '50% savings, 30% needs, 20% wants',
                '50% needs, 30% wants, 20% savings',
                '50% wants, 30% savings, 20% needs',
                '50% debt, 30% expenses, 20% entertainment'
            ],
            correctAnswer: 1,
            explanation: 'The 50/30/20 rule allocates 50% of after-tax income to needs (housing, utilities, groceries), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment.',
            category: 'methods',
            difficulty: 'easy',
            concept: 'budget-allocation-rules'
        },
        {
            id: 2,
            question: 'Which expense category should you prioritize first when creating a budget?',
            options: [
                'Entertainment and hobbies',
                'Fixed essential expenses (housing, utilities, insurance)',
                'Variable expenses (dining out, shopping)',
                'Luxury items and upgrades'
            ],
            correctAnswer: 1,
            explanation: 'Fixed essential expenses like housing, utilities, and insurance should be prioritized first because they are necessary for basic living and typically have the least flexibility.',
            category: 'basics',
            difficulty: 'easy',
            concept: 'expense-prioritization'
        },
        {
            id: 3,
            question: 'What is the primary purpose of tracking your expenses?',
            options: [
                'To make yourself feel guilty about spending',
                'To identify spending patterns and find areas to optimize',
                'To impress others with your organization skills',
                'To qualify for better credit cards'
            ],
            correctAnswer: 1,
            explanation: 'Expense tracking helps you understand where your money goes, identify unnecessary spending, and make informed decisions about budget adjustments and financial goals.',
            category: 'tracking',
            difficulty: 'easy',
            concept: 'expense-awareness'
        },
        {
            id: 4,
            question: 'What is positive cash flow?',
            options: [
                'When your investments are gaining value',
                'When your income exceeds your expenses',
                'When you have a high credit score',
                'When you receive unexpected money'
            ],
            correctAnswer: 1,
            explanation: 'Positive cash flow occurs when your income is greater than your expenses, allowing you to save, invest, or pay down debt. This is essential for building wealth.',
            category: 'cashflow',
            difficulty: 'easy',
            concept: 'cash-flow-basics'
        },
        {
            id: 5,
            question: 'Which budgeting method involves giving every dollar a specific purpose?',
            options: [
                'Percentage-based budgeting',
                'Zero-based budgeting',
                'Envelope budgeting',
                'Pay-yourself-first budgeting'
            ],
            correctAnswer: 1,
            explanation: 'Zero-based budgeting assigns every dollar of income a specific purpose, whether for expenses, savings, or debt payment. Income minus expenses should equal zero.',
            category: 'methods',
            difficulty: 'medium',
            concept: 'zero-based-budgeting'
        },
        {
            id: 6,
            question: 'What should you do if your expenses consistently exceed your income?',
            options: [
                'Use credit cards to cover the difference',
                'Ignore it and hope it gets better',
                'Either increase income or reduce expenses (or both)',
                'Take out a personal loan'
            ],
            correctAnswer: 2,
            explanation: 'When expenses exceed income, you must either find ways to increase your income, reduce your expenses, or ideally do both. Using debt to cover shortfalls creates a dangerous cycle.',
            category: 'cashflow',
            difficulty: 'medium',
            concept: 'budget-balancing'
        },
        {
            id: 7,
            question: 'What is a sinking fund in budgeting?',
            options: [
                'Money set aside for regular monthly expenses',
                'Funds for emergency situations only',
                'Money saved gradually for known future expenses',
                'Investment money that is losing value'
            ],
            correctAnswer: 2,
            explanation: 'A sinking fund is money saved gradually for planned future expenses like car repairs, vacations, or annual insurance premiums. This prevents these costs from disrupting your budget.',
            category: 'planning',
            difficulty: 'medium',
            concept: 'sinking-funds'
        },
        {
            id: 8,
            question: 'How often should you review and adjust your budget?',
            options: [
                'Once per year',
                'Only when major life changes occur',
                'Monthly, with adjustments as needed',
                'Never - budgets should remain fixed'
            ],
            correctAnswer: 2,
            explanation: 'Budgets should be reviewed monthly to track progress, identify variances, and make necessary adjustments. Regular review ensures your budget remains realistic and effective.',
            category: 'basics',
            difficulty: 'easy',
            concept: 'budget-maintenance'
        },
        {
            id: 9,
            question: 'What is the envelope budgeting method?',
            options: [
                'Keeping all receipts in envelopes for tax purposes',
                'Allocating cash to different envelopes for specific spending categories',
                'Mailing budget plans to yourself each month',
                'Using only paper statements instead of digital'
            ],
            correctAnswer: 1,
            explanation: 'Envelope budgeting involves allocating specific amounts of cash to different spending categories (envelopes). When an envelope is empty, no more spending in that category until next month.',
            category: 'methods',
            difficulty: 'medium',
            concept: 'envelope-budgeting'
        },
        {
            id: 10,
            question: 'What percentage of your income should typically go to housing costs?',
            options: [
                'Up to 50% for maximum lifestyle',
                'No more than 28-30% for financial stability',
                'At least 40% to get the best home',
                'Housing percentage doesn\'t matter'
            ],
            correctAnswer: 1,
            explanation: 'The general rule is to spend no more than 28-30% of gross income on housing costs. This ensures you have enough left for other essentials, savings, and unexpected expenses.',
            category: 'basics',
            difficulty: 'medium',
            concept: 'housing-ratio'
        }
    ]
};

interface BudgetingMasteryQuizEnhancedProps {
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
}

export default function BudgetingMasteryQuizEnhanced({
    onComplete,
    className = ''
}: BudgetingMasteryQuizEnhancedProps) {
    return (
        <EnhancedQuizEngine
            config={budgetingMasteryQuizConfig}
            onComplete={onComplete}
            className={className}
        />
    );
}
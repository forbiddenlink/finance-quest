'use client';

import EnhancedQuizEngine, { QuizConfig } from '@/components/shared/quiz/EnhancedQuizEngine';
import { CreditCard, TrendingDown, Shield, AlertTriangle, Target } from 'lucide-react';

const creditDebtQuizConfig: QuizConfig = {
    id: 'credit-debt-quiz',
    title: 'Credit & Debt Management Quiz',
    description: 'Test your understanding of credit scores, debt strategies, credit cards, loans, and building a strong credit profile.',
    passingScore: 80,
    chapterId: 'chapter6',
    enableSpacedRepetition: true,
    successMessage: 'Excellent! You\'ve mastered credit and debt management. You\'re ready to build excellent credit and eliminate debt strategically!',
    failureMessage: 'Keep learning! Credit and debt management are crucial for financial success. Review the strategies and try again.',
    categories: {
        credit: { icon: CreditCard, label: 'Credit Basics' },
        scores: { icon: TrendingDown, label: 'Credit Scores' },
        debt: { icon: AlertTriangle, label: 'Debt Management' },
        strategy: { icon: Target, label: 'Payoff Strategies' },
        protection: { icon: Shield, label: 'Credit Protection' }
    },
    questions: [
        {
            id: 1,
            question: 'What is the most important factor in determining your credit score?',
            options: [
                'Length of credit history',
                'Payment history (35%)',
                'Credit utilization (30%)',
                'Types of credit accounts'
            ],
            correctAnswer: 1,
            explanation: 'Payment history accounts for 35% of your credit score and is the most important factor. Consistently making on-time payments is the best way to build and maintain excellent credit.',
            category: 'scores',
            difficulty: 'easy',
            concept: 'credit-score-factors'
        },
        {
            id: 2,
            question: 'What is the ideal credit utilization ratio to maintain a good credit score?',
            options: [
                'Below 30%',
                'Below 10%',
                'Below 50%',
                'It doesn\'t matter as long as you pay on time'
            ],
            correctAnswer: 1,
            explanation: 'While keeping utilization below 30% is good, the ideal ratio is below 10% for the best credit scores. Credit utilization accounts for 30% of your score, making it the second most important factor.',
            category: 'scores',
            difficulty: 'medium',
            concept: 'credit-utilization'
        },
        {
            id: 3,
            question: 'Which debt payoff strategy focuses on paying off the highest interest rate debts first?',
            options: [
                'Debt snowball method',
                'Debt avalanche method',
                'Minimum payment method',
                'Balance transfer method'
            ],
            correctAnswer: 1,
            explanation: 'The debt avalanche method prioritizes paying off debts with the highest interest rates first, which mathematically saves the most money on interest over time.',
            category: 'strategy',
            difficulty: 'easy',
            concept: 'debt-payoff-strategies'
        },
        {
            id: 4,
            question: 'Which debt payoff strategy focuses on paying off the smallest balances first for psychological motivation?',
            options: [
                'Debt snowball method',
                'Debt avalanche method',
                'Minimum payment method',
                'Consolidation method'
            ],
            correctAnswer: 0,
            explanation: 'The debt snowball method focuses on paying off the smallest balances first to build momentum and motivation. While it may cost more in interest, it can be psychologically effective for staying motivated.',
            category: 'strategy',
            difficulty: 'easy',
            concept: 'debt-snowball'
        },
        {
            id: 5,
            question: 'What is the primary risk of only making minimum payments on credit cards?',
            options: [
                'Your credit score will immediately drop',
                'You\'ll pay mostly interest and very little principal',
                'The credit card company will cancel your card',
                'You\'ll be charged additional fees'
            ],
            correctAnswer: 1,
            explanation: 'Minimum payments are designed to keep you in debt longer. Most of the payment goes toward interest, with very little reducing the principal balance, making it extremely expensive over time.',
            category: 'debt',
            difficulty: 'medium',
            concept: 'minimum-payment-trap'
        },
        {
            id: 6,
            question: 'How long do negative items typically stay on your credit report?',
            options: [
                '3 years',
                '5 years',
                '7 years',
                '10 years'
            ],
            correctAnswer: 2,
            explanation: 'Most negative items (late payments, collections, charge-offs) stay on your credit report for 7 years. Bankruptcies can stay for up to 10 years, while some tax liens can remain indefinitely.',
            category: 'protection',
            difficulty: 'medium',
            concept: 'credit-report-timeline'
        },
        {
            id: 7,
            question: 'What is a good strategy for building credit with no credit history?',
            options: [
                'Apply for multiple credit cards at once',
                'Start with a secured credit card or become an authorized user',
                'Take out a large personal loan',
                'Wait until you have more income'
            ],
            correctAnswer: 1,
            explanation: 'Secured credit cards or becoming an authorized user on someone else\'s account are excellent ways to start building credit. These provide a foundation for establishing payment history.',
            category: 'credit',
            difficulty: 'easy',
            concept: 'building-credit'
        },
        {
            id: 8,
            question: 'What happens to your credit score when you close a credit card account?',
            options: [
                'It always improves your score',
                'It may hurt your score by reducing available credit and credit history length',
                'It has no effect on your score',
                'It only affects your score if you had a balance'
            ],
            correctAnswer: 1,
            explanation: 'Closing a credit card can hurt your score by reducing your available credit (increasing utilization) and potentially reducing your average account age. Keep old cards open if there\'s no annual fee.',
            category: 'scores',
            difficulty: 'medium',
            concept: 'closing-credit-accounts'
        },
        {
            id: 9,
            question: 'What is debt consolidation?',
            options: [
                'Paying off all debts immediately',
                'Combining multiple debts into a single payment, often at a lower interest rate',
                'Declaring bankruptcy',
                'Negotiating with creditors to reduce balances'
            ],
            correctAnswer: 1,
            explanation: 'Debt consolidation combines multiple debts into one payment, ideally at a lower interest rate. This can simplify payments and potentially save money, but doesn\'t reduce the total amount owed.',
            category: 'debt',
            difficulty: 'easy',
            concept: 'debt-consolidation'
        },
        {
            id: 10,
            question: 'Which type of inquiry has a temporary negative impact on your credit score?',
            options: [
                'Soft inquiries (checking your own credit)',
                'Hard inquiries (applying for credit)',
                'Both types equally',
                'Neither type affects your score'
            ],
            correctAnswer: 1,
            explanation: 'Hard inquiries (when you apply for credit) can temporarily lower your score by a few points. Soft inquiries (checking your own credit or pre-qualification checks) don\'t affect your score.',
            category: 'scores',
            difficulty: 'easy',
            concept: 'credit-inquiries'
        },
        {
            id: 11,
            question: 'What is the debt-to-income ratio and why is it important?',
            options: [
                'Total monthly debt payments divided by gross monthly income; used by lenders to assess loan risk',
                'Total debt divided by net worth; used for tax purposes',
                'Monthly credit card payments divided by take-home pay; used for budgeting',
                'Total assets divided by total liabilities; used for financial planning'
            ],
            correctAnswer: 0,
            explanation: 'Debt-to-income ratio (DTI) is your total monthly debt payments divided by gross monthly income. Lenders use this to determine if you can afford additional debt. Generally, keep DTI below 36%.',
            category: 'debt',
            difficulty: 'medium',
            concept: 'debt-to-income-ratio'
        },
        {
            id: 12,
            question: 'What should you do if you find an error on your credit report?',
            options: [
                'Ignore it since it will eventually be removed',
                'Contact the credit bureau and creditor in writing to dispute the error',
                'Pay a credit repair company to fix it',
                'Wait until you apply for a loan to address it'
            ],
            correctAnswer: 1,
            explanation: 'You should immediately dispute errors in writing with both the credit bureau and the creditor. You have the right to accurate credit reporting, and errors can significantly impact your score and loan approvals.',
            category: 'protection',
            difficulty: 'easy',
            concept: 'credit-report-disputes'
        }
    ]
};

interface CreditDebtQuizEnhancedProps {
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
}

export default function CreditDebtQuizEnhanced({
    onComplete,
    className = ''
}: CreditDebtQuizEnhancedProps) {
    return (
        <EnhancedQuizEngine
            config={creditDebtQuizConfig}
            onComplete={onComplete}
            className={className}
        />
    );
}
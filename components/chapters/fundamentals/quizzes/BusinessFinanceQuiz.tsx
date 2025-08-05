'use client';

import EnhancedQuizEngine, { QuizConfig } from '@/components/shared/quiz/EnhancedQuizEngine';
import { Building2, DollarSign, TrendingUp, Target, Calculator, FileText } from 'lucide-react';

const businessFinanceQuizConfig: QuizConfig = {
    id: 'business-finance-quiz',
    title: 'Business & Entrepreneurship Finance Quiz',
    description: 'Test your understanding of business financial fundamentals, cash flow management, and entrepreneurship finance principles.',
    passingScore: 80,
    chapterId: 'chapter16',
    enableSpacedRepetition: true,
    successMessage: 'Excellent! You\'ve mastered business finance fundamentals and are ready to start, run, or invest in businesses with confidence!',
    failureMessage: 'Keep studying! Business finance is complex but essential for entrepreneurial success. Review the concepts and try again.',
    categories: {
        cashflow: { icon: DollarSign, label: 'Cash Flow' },
        funding: { icon: TrendingUp, label: 'Business Funding' },
        planning: { icon: Target, label: 'Financial Planning' },
        valuation: { icon: Calculator, label: 'Business Valuation' },
        structure: { icon: Building2, label: 'Business Structure' },
        statements: { icon: FileText, label: 'Financial Statements' }
    },
    questions: [
        {
            id: 1,
            question: 'What is the most common reason why small businesses fail within their first few years?',
            options: [
                'Poor product quality',
                'Lack of market demand',
                'Cash flow problems and inadequate working capital',
                'Too much competition'
            ],
            correctAnswer: 2,
            explanation: 'Cash flow problems are the leading cause of small business failure. Even profitable businesses can fail if they can\'t manage their cash flow effectively, pay bills on time, or maintain adequate working capital.',
            category: 'cashflow',
            difficulty: 'easy',
            concept: 'cash-flow-importance'
        },
        {
            id: 2,
            question: 'What is the difference between cash flow and profit?',
            options: [
                'There is no difference - they are the same thing',
                'Cash flow is money actually received/paid; profit includes non-cash items',
                'Profit is always higher than cash flow',
                'Cash flow only applies to large corporations'
            ],
            correctAnswer: 1,
            explanation: 'Cash flow represents actual money coming in and going out, while profit (net income) includes non-cash items like depreciation and accounts receivable. A business can be profitable on paper but still have negative cash flow.',
            category: 'cashflow',
            difficulty: 'medium',
            concept: 'cash-flow-vs-profit'
        },
        {
            id: 3,
            question: 'Which funding source typically requires giving up ownership equity in your business?',
            options: [
                'Bank loans',
                'Credit cards',
                'Venture capital',
                'Equipment financing'
            ],
            correctAnswer: 2,
            explanation: 'Venture capital involves investors providing funding in exchange for equity (ownership) in the business. Debt financing like loans and credit cards don\'t require giving up ownership but must be repaid with interest.',
            category: 'funding',
            difficulty: 'easy',
            concept: 'equity-vs-debt-funding'
        },
        {
            id: 4,
            question: 'What is "bootstrap funding" in entrepreneurship?',
            options: [
                'Government grants for startups',
                'Funding from venture capitalists',
                'Self-funding using personal resources and business revenue',
                'Crowdfunding from online platforms'
            ],
            correctAnswer: 2,
            explanation: 'Bootstrap funding means self-funding a business using personal savings, revenue from the business, and minimal external investment. This approach maintains full ownership but may limit growth speed.',
            category: 'funding',
            difficulty: 'medium',
            concept: 'bootstrap-funding'
        },
        {
            id: 5,
            question: 'What is the primary purpose of a business plan\'s financial projections?',
            options: [
                'To guarantee future profits',
                'To estimate funding needs and demonstrate viability to investors',
                'To avoid paying taxes',
                'To compete with other businesses'
            ],
            correctAnswer: 1,
            explanation: 'Financial projections help estimate how much funding the business will need, when it will become profitable, and demonstrate to potential investors or lenders that the business model is viable and worth investing in.',
            category: 'planning',
            difficulty: 'easy',
            concept: 'financial-projections'
        },
        {
            id: 6,
            question: 'What does "burn rate" mean for a startup business?',
            options: [
                'The rate at which competitors enter the market',
                'How quickly the business is spending cash',
                'The interest rate on business loans',
                'Employee turnover rate'
            ],
            correctAnswer: 1,
            explanation: 'Burn rate is how quickly a startup is spending its cash reserves, typically measured monthly. Understanding burn rate is crucial for determining how long the business can operate before needing additional funding.',
            category: 'cashflow',
            difficulty: 'medium',
            concept: 'burn-rate'
        },
        {
            id: 7,
            question: 'Which business structure provides personal liability protection while allowing flexible taxation?',
            options: [
                'Sole Proprietorship',
                'Partnership',
                'Limited Liability Company (LLC)',
                'Corporation'
            ],
            correctAnswer: 2,
            explanation: 'LLCs provide personal liability protection (separating business and personal assets) while offering flexible taxation options. Owners can choose how to be taxed and avoid double taxation that affects corporations.',
            category: 'structure',
            difficulty: 'medium',
            concept: 'business-structures'
        },
        {
            id: 8,
            question: 'What is the "breakeven point" for a business?',
            options: [
                'When revenue equals total costs',
                'When the business is profitable',
                'When cash flow is positive',
                'When the business goes public'
            ],
            correctAnswer: 0,
            explanation: 'The breakeven point is when total revenue equals total costs (both fixed and variable). At this point, the business is neither making a profit nor losing money - it\'s covering all its expenses.',
            category: 'planning',
            difficulty: 'easy',
            concept: 'breakeven-analysis'
        },
        {
            id: 9,
            question: 'What does "working capital" represent in business finance?',
            options: [
                'Money spent on equipment and buildings',
                'Current assets minus current liabilities',
                'Total business debt',
                'Owner\'s initial investment'
            ],
            correctAnswer: 1,
            explanation: 'Working capital is current assets (cash, inventory, accounts receivable) minus current liabilities (bills due within a year). It represents the liquid resources available for day-to-day operations.',
            category: 'cashflow',
            difficulty: 'medium',
            concept: 'working-capital'
        },
        {
            id: 10,
            question: 'Which valuation method is most appropriate for early-stage startups with no revenue?',
            options: [
                'Price-to-earnings ratio',
                'Discounted cash flow',
                'Comparable company analysis or risk factor summation',
                'Asset-based valuation'
            ],
            correctAnswer: 2,
            explanation: 'Early-stage startups without revenue can\'t use traditional valuation methods. Comparable company analysis (looking at similar companies) or risk factor summation methods are more appropriate for pre-revenue businesses.',
            category: 'valuation',
            difficulty: 'hard',
            concept: 'startup-valuation'
        },
        {
            id: 11,
            question: 'What is the main advantage of debt financing over equity financing for businesses?',
            options: [
                'It\'s easier to obtain',
                'No repayment required',
                'Maintains full ownership control',
                'Lower cost of capital'
            ],
            correctAnswer: 2,
            explanation: 'Debt financing allows business owners to maintain full ownership and control while accessing capital. Although debt must be repaid with interest, owners don\'t give up equity or decision-making power to investors.',
            category: 'funding',
            difficulty: 'medium',
            concept: 'debt-vs-equity-advantages'
        },
        {
            id: 12,
            question: 'What information does the income statement (P&L) primarily show?',
            options: [
                'Assets, liabilities, and owner\'s equity at a point in time',
                'Cash inflows and outflows over a period',
                'Revenues, expenses, and profit over a period',
                'Market value of the business'
            ],
            correctAnswer: 2,
            explanation: 'The income statement (profit & loss statement) shows revenues, expenses, and resulting profit or loss over a specific period (month, quarter, year). It helps assess business profitability and operational efficiency.',
            category: 'statements',
            difficulty: 'easy',
            concept: 'financial-statements'
        }
    ]
};

interface BusinessFinanceQuizProps {
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
}

export default function BusinessFinanceQuiz({
    onComplete,
    className = ''
}: BusinessFinanceQuizProps) {
    return (
        <EnhancedQuizEngine
            config={businessFinanceQuizConfig}
            onComplete={onComplete}
            className={className}
        />
    );
}

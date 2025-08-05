'use client';

import EnhancedQuizEngine, { QuizConfig } from '@/components/shared/quiz/EnhancedQuizEngine';
import { FileText, Shield, Users, TrendingUp, Calculator, Building } from 'lucide-react';

const estatePlanningQuizConfig: QuizConfig = {
    id: 'estate-planning-quiz',
    title: 'Estate Planning & Wealth Transfer Quiz',
    description: 'Test your understanding of estate planning strategies, trusts, tax implications, and wealth transfer techniques.',
    passingScore: 80,
    chapterId: 'chapter17',
    enableSpacedRepetition: true,
    successMessage: 'Outstanding! You\'ve mastered estate planning and wealth transfer strategies. You\'re ready to preserve and transfer wealth effectively across generations!',
    failureMessage: 'Keep studying! Estate planning is complex but crucial for wealth preservation. Review the concepts and try again.',
    categories: {
        wills: { icon: FileText, label: 'Wills & Probate' },
        trusts: { icon: Shield, label: 'Trusts' },
        taxes: { icon: Calculator, label: 'Estate Taxes' },
        transfer: { icon: Users, label: 'Wealth Transfer' },
        planning: { icon: TrendingUp, label: 'Planning Strategies' },
        business: { icon: Building, label: 'Business Succession' }
    },
    questions: [
        {
            id: 1,
            question: 'What is the federal estate tax exemption amount for 2024?',
            options: [
                '$5.49 million per person',
                '$12.92 million per person',
                '$13.61 million per person',
                '$25.84 million per married couple only'
            ],
            correctAnswer: 2,
            explanation: 'The federal estate tax exemption for 2024 is $13.61 million per person ($27.22 million for married couples). This means estates below this value are not subject to federal estate tax.',
            category: 'taxes',
            difficulty: 'medium',
            concept: 'estate-tax-exemption'
        },
        {
            id: 2,
            question: 'What happens to assets that go through probate?',
            options: [
                'They are automatically tax-free',
                'They become public record and may face court delays and fees',
                'They can only be inherited by spouses',
                'They are distributed immediately to heirs'
            ],
            correctAnswer: 1,
            explanation: 'Probate is a public court process that can be time-consuming and expensive. Assets that go through probate become public record, may face significant delays, and incur legal fees that reduce the estate\'s value.',
            category: 'wills',
            difficulty: 'easy',
            concept: 'probate-process'
        },
        {
            id: 3,
            question: 'What is the primary benefit of a revocable living trust?',
            options: [
                'Provides immediate tax savings',
                'Avoids probate and maintains privacy',
                'Protects assets from all creditors',
                'Eliminates estate taxes completely'
            ],
            correctAnswer: 1,
            explanation: 'A revocable living trust allows assets to pass to beneficiaries without going through probate, maintaining privacy and often reducing time and costs. However, it doesn\'t provide tax benefits or creditor protection during the grantor\'s lifetime.',
            category: 'trusts',
            difficulty: 'medium',
            concept: 'revocable-trust-benefits'
        },
        {
            id: 4,
            question: 'What is the difference between a revocable and irrevocable trust?',
            options: [
                'Irrevocable trusts are only for businesses',
                'Revocable trusts can be changed; irrevocable trusts generally cannot',
                'Revocable trusts provide better tax benefits',
                'There is no significant difference'
            ],
            correctAnswer: 1,
            explanation: 'Revocable trusts can be modified or terminated by the grantor, while irrevocable trusts generally cannot be changed once established. Irrevocable trusts often provide tax benefits and asset protection that revocable trusts don\'t offer.',
            category: 'trusts',
            difficulty: 'easy',
            concept: 'trust-types'
        },
        {
            id: 5,
            question: 'What is the annual gift tax exclusion for 2024?',
            options: [
                '$15,000 per recipient',
                '$16,000 per recipient',
                '$17,000 per recipient',
                '$18,000 per recipient'
            ],
            correctAnswer: 3,
            explanation: 'The annual gift tax exclusion for 2024 is $18,000 per recipient. This means you can give up to $18,000 to any number of individuals each year without triggering gift tax or using up your lifetime exemption.',
            category: 'transfer',
            difficulty: 'medium',
            concept: 'gift-tax-exclusion'
        },
        {
            id: 6,
            question: 'What does "stepped-up basis" mean for inherited assets?',
            options: [
                'Heirs pay higher taxes on inherited assets',
                'Inherited assets are valued at the original purchase price',
                'Inherited assets receive a new cost basis equal to fair market value at death',
                'Only stocks qualify for this benefit'
            ],
            correctAnswer: 2,
            explanation: 'Stepped-up basis means inherited assets receive a new cost basis equal to their fair market value at the time of the original owner\'s death. This can significantly reduce capital gains taxes when heirs sell the assets.',
            category: 'taxes',
            difficulty: 'medium',
            concept: 'stepped-up-basis'
        },
        {
            id: 7,
            question: 'What is a "generation-skipping trust" designed to accomplish?',
            options: [
                'Skip probate entirely',
                'Transfer wealth to grandchildren while minimizing generation-skipping taxes',
                'Avoid all estate taxes',
                'Provide income only to the grantor'
            ],
            correctAnswer: 1,
            explanation: 'Generation-skipping trusts are designed to transfer wealth to grandchildren (or later generations) while potentially minimizing generation-skipping transfer taxes. They can help preserve wealth across multiple generations.',
            category: 'transfer',
            difficulty: 'hard',
            concept: 'generation-skipping-trust'
        },
        {
            id: 8,
            question: 'Which document allows someone to make financial decisions on your behalf if you become incapacitated?',
            options: [
                'Will',
                'Healthcare directive',
                'Durable power of attorney for finances',
                'Beneficiary designation'
            ],
            correctAnswer: 2,
            explanation: 'A durable power of attorney for finances allows a designated person to make financial decisions on your behalf if you become incapacitated. This is different from a healthcare directive, which covers medical decisions.',
            category: 'planning',
            difficulty: 'easy',
            concept: 'power-of-attorney'
        },
        {
            id: 9,
            question: 'What is the main advantage of life insurance in estate planning?',
            options: [
                'It always provides the highest investment returns',
                'It provides liquidity to pay estate taxes and expenses',
                'It eliminates the need for a will',
                'It automatically creates a trust'
            ],
            correctAnswer: 1,
            explanation: 'Life insurance provides immediate liquidity upon death, which can be crucial for paying estate taxes, final expenses, and providing income replacement for beneficiaries without having to sell other estate assets.',
            category: 'planning',
            difficulty: 'medium',
            concept: 'life-insurance-estate-planning'
        },
        {
            id: 10,
            question: 'What is a "charitable remainder trust"?',
            options: [
                'A trust that gives everything to charity immediately',
                'A trust that provides income to the grantor/beneficiaries, with remainder to charity',
                'A trust only for wealthy individuals',
                'A trust that avoids all taxes'
            ],
            correctAnswer: 1,
            explanation: 'A charitable remainder trust provides income to the grantor and/or other beneficiaries for a specified period, with the remainder going to charity. It can provide tax benefits while generating current income.',
            category: 'trusts',
            difficulty: 'hard',
            concept: 'charitable-remainder-trust'
        },
        {
            id: 11,
            question: 'In business succession planning, what is a "buy-sell agreement"?',
            options: [
                'A contract to buy inventory from suppliers',
                'An agreement that determines how business ownership transfers upon certain events',
                'A marketing agreement with customers',
                'A contract with employees'
            ],
            correctAnswer: 1,
            explanation: 'A buy-sell agreement is a legally binding contract that determines how business ownership will be transferred upon certain triggering events like death, disability, retirement, or desire to sell. It protects business continuity and provides fair valuation.',
            category: 'business',
            difficulty: 'medium',
            concept: 'buy-sell-agreement'
        },
        {
            id: 12,
            question: 'What is the primary purpose of an irrevocable life insurance trust (ILIT)?',
            options: [
                'To avoid paying life insurance premiums',
                'To remove life insurance proceeds from the taxable estate',
                'To increase life insurance death benefits',
                'To make life insurance premiums tax-deductible'
            ],
            correctAnswer: 1,
            explanation: 'An ILIT removes life insurance proceeds from the grantor\'s taxable estate, potentially saving significant estate taxes. The trust owns the policy and receives the death benefit, which can then be distributed to beneficiaries according to the trust terms.',
            category: 'trusts',
            difficulty: 'hard',
            concept: 'irrevocable-life-insurance-trust'
        }
    ]
};

interface EstatePlanningQuizProps {
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
}

export default function EstatePlanningQuiz({
    onComplete,
    className = ''
}: EstatePlanningQuizProps) {
    return (
        <EnhancedQuizEngine
            config={estatePlanningQuizConfig}
            onComplete={onComplete}
            className={className}
        />
    );
}

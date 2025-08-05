'use client';

import EnhancedQuizEngine, { QuizConfig } from '@/components/shared/quiz/EnhancedQuizEngine';
import { TrendingUp, Shield, DollarSign, Calendar, BarChart3 } from 'lucide-react';

const bondFixedIncomeQuizConfig: QuizConfig = {
    id: 'bond-fixed-income-quiz',
    title: 'Bonds & Fixed Income Quiz',
    description: 'Test your understanding of bonds, fixed income investments, yield calculations, and fixed income portfolio strategies.',
    passingScore: 80,
    chapterId: 'chapter14',
    enableSpacedRepetition: true,
    successMessage: 'Excellent! You\'ve mastered bonds and fixed income investing. You\'re ready to build a stable income portfolio!',
    failureMessage: 'Keep studying! Bonds are essential for portfolio stability. Review the lesson and focus on yield calculations and bond characteristics.',
    categories: {
        basics: { icon: Shield, label: 'Bond Basics' },
        yield: { icon: TrendingUp, label: 'Yield & Pricing' },
        types: { icon: BarChart3, label: 'Bond Types' },
        strategy: { icon: DollarSign, label: 'Fixed Income Strategy' },
        risk: { icon: Calendar, label: 'Bond Risks' }
    },
    questions: [
        {
            id: 1,
            question: 'What is the primary relationship between bond prices and interest rates?',
            options: [
                'Bond prices and interest rates move in the same direction',
                'Bond prices and interest rates move in opposite directions',
                'Bond prices are not affected by interest rate changes',
                'The relationship depends on the bond issuer'
            ],
            correctAnswer: 1,
            explanation: 'Bond prices and interest rates have an inverse relationship. When interest rates rise, existing bond prices fall because new bonds offer higher yields. When rates fall, existing bond prices rise.',
            category: 'basics',
            difficulty: 'medium',
            concept: 'interest-rate-risk'
        },
        {
            id: 2,
            question: 'What does the term "yield to maturity" (YTM) represent?',
            options: [
                'The annual coupon payment divided by the bond price',
                'The total return if the bond is held until maturity',
                'The bond\'s face value minus the purchase price',
                'The credit rating of the bond issuer'
            ],
            correctAnswer: 1,
            explanation: 'Yield to maturity (YTM) is the total return an investor will receive if they hold the bond until it matures, assuming all coupon payments are reinvested at the same rate.',
            category: 'yield',
            difficulty: 'medium',
            concept: 'yield-calculations'
        },
        {
            id: 3,
            question: 'Which type of bond typically offers the highest yield but also the highest risk?',
            options: [
                'U.S. Treasury bonds',
                'Investment-grade corporate bonds',
                'High-yield (junk) bonds',
                'Municipal bonds'
            ],
            correctAnswer: 2,
            explanation: 'High-yield bonds (also called junk bonds) offer higher yields to compensate investors for the increased risk of default. They are issued by companies with lower credit ratings.',
            category: 'types',
            difficulty: 'easy',
            concept: 'bond-risk-spectrum'
        },
        {
            id: 4,
            question: 'What is duration in bond investing?',
            options: [
                'The time until the bond matures',
                'The number of coupon payments remaining',
                'A measure of price sensitivity to interest rate changes',
                'The bond\'s credit rating period'
            ],
            correctAnswer: 2,
            explanation: 'Duration measures how sensitive a bond\'s price is to changes in interest rates. Higher duration means greater price volatility when rates change. It\'s different from maturity.',
            category: 'risk',
            difficulty: 'hard',
            concept: 'duration-convexity'
        },
        {
            id: 5,
            question: 'What is the primary advantage of a bond ladder strategy?',
            options: [
                'Maximum yield potential',
                'Minimizing all investment risks',
                'Managing interest rate risk through diversification of maturities',
                'Avoiding taxes on bond income'
            ],
            correctAnswer: 2,
            explanation: 'A bond ladder strategy involves buying bonds with different maturity dates. This helps manage interest rate risk and provides regular income as bonds mature and can be reinvested.',
            category: 'strategy',
            difficulty: 'medium',
            concept: 'bond-laddering'
        },
        {
            id: 6,
            question: 'If a bond is trading at a premium, what does this indicate?',
            options: [
                'The bond\'s coupon rate is lower than current market rates',
                'The bond\'s coupon rate is higher than current market rates',
                'The bond is about to default',
                'The bond has the highest credit rating'
            ],
            correctAnswer: 1,
            explanation: 'A bond trades at a premium (above face value) when its coupon rate is higher than current market interest rates. Investors pay more because the bond offers better income than new issues.',
            category: 'yield',
            difficulty: 'medium',
            concept: 'premium-discount-pricing'
        },
        {
            id: 7,
            question: 'What is credit risk in bond investing?',
            options: [
                'The risk that interest rates will change',
                'The risk that the issuer will not be able to make payments',
                'The risk of inflation eroding returns',
                'The risk of the bond being called early'
            ],
            correctAnswer: 1,
            explanation: 'Credit risk is the risk that the bond issuer will default and be unable to make coupon payments or repay the principal. This risk varies by issuer creditworthiness.',
            category: 'risk',
            difficulty: 'easy',
            concept: 'credit-default-risk'
        },
        {
            id: 8,
            question: 'Which bonds are typically exempt from federal income taxes?',
            options: [
                'Corporate bonds',
                'Treasury bonds',
                'Municipal bonds',
                'International bonds'
            ],
            correctAnswer: 2,
            explanation: 'Municipal bonds (munis) issued by state and local governments are typically exempt from federal income taxes, and often state taxes too if you live in the issuing state.',
            category: 'types',
            difficulty: 'easy',
            concept: 'tax-advantaged-bonds'
        },
        {
            id: 9,
            question: 'What happens to bond prices when inflation expectations increase?',
            options: [
                'Bond prices increase because bonds protect against inflation',
                'Bond prices decrease because fixed payments lose purchasing power',
                'Bond prices are unaffected by inflation expectations',
                'Only junk bond prices are affected by inflation'
            ],
            correctAnswer: 1,
            explanation: 'When inflation expectations rise, bond prices typically fall because the fixed coupon payments lose purchasing power. Investors demand higher yields to compensate for inflation risk.',
            category: 'risk',
            difficulty: 'medium',
            concept: 'inflation-risk'
        },
        {
            id: 10,
            question: 'In a rising interest rate environment, which strategy might be most appropriate?',
            options: [
                'Buy long-term bonds to lock in current rates',
                'Focus on shorter-duration bonds and floating rate notes',
                'Avoid all bond investments',
                'Only invest in zero-coupon bonds'
            ],
            correctAnswer: 1,
            explanation: 'In rising rate environments, shorter-duration bonds and floating rate notes are less sensitive to rate changes. This allows you to reinvest at higher rates as bonds mature.',
            category: 'strategy',
            difficulty: 'hard',
            concept: 'rate-environment-strategy'
        }
    ]
};

interface BondFixedIncomeQuizEnhancedProps {
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
}

export default function BondFixedIncomeQuizEnhanced({
    onComplete,
    className = ''
}: BondFixedIncomeQuizEnhancedProps) {
    return (
        <EnhancedQuizEngine
            config={bondFixedIncomeQuizConfig}
            onComplete={onComplete}
            className={className}
        />
    );
}
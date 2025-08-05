'use client';

import EnhancedQuizEngine, { QuizConfig } from '@/components/shared/quiz/EnhancedQuizEngine';
import { Building, Package, Bitcoin, TrendingUp, PieChart, DollarSign } from 'lucide-react';

const alternativeInvestmentsQuizConfig: QuizConfig = {
    id: 'alternative-investments-quiz',
    title: 'Alternative Investments Quiz',
    description: 'Test your understanding of REITs, commodities, cryptocurrency, and other alternative investment vehicles.',
    passingScore: 80,
    chapterId: 'chapter15',
    enableSpacedRepetition: true,
    successMessage: 'Outstanding! You\'ve mastered alternative investments and portfolio diversification strategies. You\'re ready to build a sophisticated investment portfolio!',
    failureMessage: 'Keep learning! Alternative investments require careful study to understand their risks and benefits. Review the lesson and try again.',
    categories: {
        reits: { icon: Building, label: 'REITs' },
        commodities: { icon: Package, label: 'Commodities' },
        crypto: { icon: Bitcoin, label: 'Cryptocurrency' },
        portfolio: { icon: PieChart, label: 'Portfolio Theory' },
        risk: { icon: TrendingUp, label: 'Risk Management' },
        valuation: { icon: DollarSign, label: 'Valuation' }
    },
    questions: [
        {
            id: 1,
            question: 'What is the primary advantage of REITs (Real Estate Investment Trusts) for individual investors?',
            options: [
                'They provide direct ownership of real estate properties',
                'They offer liquid access to real estate markets with professional management',
                'They guarantee returns higher than stock market averages',
                'They are completely risk-free investments'
            ],
            correctAnswer: 1,
            explanation: 'REITs allow investors to gain exposure to real estate markets without the large capital requirements, illiquidity, and management hassles of direct property ownership. They trade on exchanges like stocks and are managed by professionals.',
            category: 'reits',
            difficulty: 'easy',
            concept: 'reit-advantages'
        },
        {
            id: 2,
            question: 'Which characteristic is required for a company to qualify as a REIT?',
            options: [
                'Must distribute at least 50% of taxable income to shareholders',
                'Must distribute at least 90% of taxable income to shareholders',
                'Must own only residential properties',
                'Must have less than $100 million in assets'
            ],
            correctAnswer: 1,
            explanation: 'REITs must distribute at least 90% of their taxable income to shareholders as dividends. This requirement allows them to avoid corporate income tax but means they retain little cash for growth, often requiring external financing.',
            category: 'reits',
            difficulty: 'medium',
            concept: 'reit-requirements'
        },
        {
            id: 3,
            question: 'What is the primary benefit of adding commodities to an investment portfolio?',
            options: [
                'Commodities always outperform stocks and bonds',
                'They provide inflation protection and portfolio diversification',
                'They have no correlation with other asset classes',
                'They guarantee positive returns during recessions'
            ],
            correctAnswer: 1,
            explanation: 'Commodities often perform well during inflationary periods and can provide diversification benefits due to their different performance drivers compared to stocks and bonds. However, they can be volatile and don\'t always provide positive returns.',
            category: 'commodities',
            difficulty: 'easy',
            concept: 'commodity-benefits'
        },
        {
            id: 4,
            question: 'Which method is most practical for individual investors to gain commodity exposure?',
            options: [
                'Taking physical delivery of commodities',
                'Investing in commodity futures contracts directly',
                'Investing in commodity ETFs or mutual funds',
                'Starting a commodity trading business'
            ],
            correctAnswer: 2,
            explanation: 'Commodity ETFs and mutual funds provide easy, liquid access to commodity markets without the complexities of futures contracts or physical storage. They\'re designed for individual investors and offer diversification across multiple commodities.',
            category: 'commodities',
            difficulty: 'easy',
            concept: 'commodity-access-methods'
        },
        {
            id: 5,
            question: 'What percentage of a portfolio should most financial advisors recommend allocating to cryptocurrency?',
            options: [
                '0-5% for speculative allocation',
                '20-30% as a core holding',
                '50% or more for maximum growth',
                '10-15% as a bond alternative'
            ],
            correctAnswer: 0,
            explanation: 'Most financial advisors recommend limiting cryptocurrency to 0-5% of a portfolio due to its extreme volatility and regulatory uncertainty. This allows for potential upside while limiting downside risk to manageable levels.',
            category: 'crypto',
            difficulty: 'medium',
            concept: 'crypto-allocation'
        },
        {
            id: 6,
            question: 'What is the main risk associated with cryptocurrency investments?',
            options: [
                'Government backing and regulation',
                'Extreme price volatility and regulatory uncertainty',
                'Too much institutional adoption',
                'Guaranteed negative returns'
            ],
            correctAnswer: 1,
            explanation: 'Cryptocurrency markets are highly volatile with prices that can swing dramatically. Regulatory uncertainty adds another layer of risk as government actions can significantly impact crypto values and accessibility.',
            category: 'crypto',
            difficulty: 'easy',
            concept: 'crypto-risks'
        },
        {
            id: 7,
            question: 'How do alternative investments typically behave compared to traditional stocks and bonds?',
            options: [
                'They move in perfect correlation with the stock market',
                'They provide uncorrelated or low-correlated returns',
                'They always move opposite to traditional investments',
                'They have identical risk-return profiles'
            ],
            correctAnswer: 1,
            explanation: 'Alternative investments often provide diversification benefits through uncorrelated or low-correlated returns relative to traditional stocks and bonds. This can help reduce overall portfolio risk and improve risk-adjusted returns.',
            category: 'portfolio',
            difficulty: 'medium',
            concept: 'correlation-benefits'
        },
        {
            id: 8,
            question: 'What is a key disadvantage of many alternative investments?',
            options: [
                'They are too liquid and easy to sell',
                'They often have higher fees and less liquidity',
                'They are too regulated and transparent',
                'They provide too much diversification'
            ],
            correctAnswer: 1,
            explanation: 'Many alternative investments come with higher management fees, less liquidity (harder to sell quickly), and less transparency compared to traditional investments. These factors must be weighed against their diversification benefits.',
            category: 'risk',
            difficulty: 'medium',
            concept: 'alternative-investment-disadvantages'
        },
        {
            id: 9,
            question: 'Which type of REIT invests in mortgages and mortgage-backed securities rather than physical properties?',
            options: [
                'Equity REITs',
                'Mortgage REITs (mREITs)',
                'Hybrid REITs',
                'Development REITs'
            ],
            correctAnswer: 1,
            explanation: 'Mortgage REITs (mREITs) invest in mortgages and mortgage-backed securities rather than physical real estate. They generate income from interest rate spreads and are more sensitive to interest rate changes than equity REITs.',
            category: 'reits',
            difficulty: 'hard',
            concept: 'reit-types'
        },
        {
            id: 10,
            question: 'What does "contango" mean in commodity futures markets?',
            options: [
                'When futures prices are lower than spot prices',
                'When futures prices are higher than spot prices',
                'When commodity prices are falling',
                'When commodity storage costs are zero'
            ],
            correctAnswer: 1,
            explanation: 'Contango occurs when futures prices are higher than current spot prices, often due to storage costs, financing costs, and convenience yield. This can create headwinds for commodity ETF returns as contracts roll forward.',
            category: 'commodities',
            difficulty: 'hard',
            concept: 'contango-backwardation'
        },
        {
            id: 11,
            question: 'What is the "blockchain" technology underlying most cryptocurrencies?',
            options: [
                'A centralized database controlled by banks',
                'A distributed ledger technology with cryptographic security',
                'A government-issued digital currency system',
                'A traditional stock exchange platform'
            ],
            correctAnswer: 1,
            explanation: 'Blockchain is a distributed ledger technology that uses cryptographic security to create an immutable record of transactions across a network of computers. This eliminates the need for central authorities in many transactions.',
            category: 'crypto',
            difficulty: 'medium',
            concept: 'blockchain-technology'
        },
        {
            id: 12,
            question: 'Which alternative investment strategy involves buying distressed companies or assets at discounted prices?',
            options: [
                'Growth investing',
                'Value investing',
                'Distressed investing',
                'Index investing'
            ],
            correctAnswer: 2,
            explanation: 'Distressed investing involves purchasing securities or assets of companies in financial distress at significant discounts, with the goal of profiting from their recovery or restructuring. It requires specialized knowledge and higher risk tolerance.',
            category: 'valuation',
            difficulty: 'hard',
            concept: 'distressed-investing'
        }
    ]
};

interface AlternativeInvestmentsQuizProps {
    onComplete?: (score: number, totalQuestions: number, passed: boolean) => void;
    className?: string;
}

export default function AlternativeInvestmentsQuiz({
    onComplete,
    className = ''
}: AlternativeInvestmentsQuizProps) {
    return (
        <EnhancedQuizEngine
            config={alternativeInvestmentsQuizConfig}
            onComplete={onComplete}
            className={className}
        />
    );
}

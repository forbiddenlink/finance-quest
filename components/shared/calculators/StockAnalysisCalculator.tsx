'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Percent, Target, BarChart3 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { theme } from '@/lib/theme';

interface ValuationResults {
  intrinsicValue: number;
  fairValue: number;
  upside: number;
  riskScore: number;
  investmentGrade: string;
  keyStrengths: string[];
  keyRisks: string[];
  ratios: {
    peRatio: number;
    pbRatio: number;
    pegRatio: number;
    debtToEquity: number;
    roe: number;
    roa: number;
  };
}

export default function StockAnalysisCalculator() {
    // Form inputs
    const [symbol, setSymbol] = useState('AAPL');
    const [currentPrice, setCurrentPrice] = useState('150.00');
    const [earnings, setEarnings] = useState('6.05');
    const [bookValue, setBookValue] = useState('4.15');
    const [revenue, setRevenue] = useState('365.8');
    const [growthRate, setGrowthRate] = useState('8.5');
    const [dividendYield, setDividendYield] = useState('0.52');
    const [debt, setDebt] = useState('110.0');
    const [equity, setEquity] = useState('62.1');
    const [marketCap, setMarketCap] = useState('2400');
    const [freeCashFlow, setFreeCashFlow] = useState('92.9');

    const [results, setResults] = useState<ValuationResults | null>(null);

    const analyzeStock = useCallback(() => {
        const price = parseFloat(currentPrice) || 150;
        const eps = parseFloat(earnings) || 6;
        const bv = parseFloat(bookValue) || 4;
        const growth = parseFloat(growthRate) || 8;
        const divYield = parseFloat(dividendYield) || 0.5;
        const totalDebt = parseFloat(debt) || 110;
        const totalEquity = parseFloat(equity) || 62;
        const rev = parseFloat(revenue) || 365;
        const mcap = parseFloat(marketCap) || 2400;
        const fcf = parseFloat(freeCashFlow) || 92;

        // Calculate key ratios
        const peRatio = price / eps;
        const pbRatio = price / bv;
        const pegRatio = peRatio / growth;
        const debtToEquity = totalDebt / totalEquity;
        const roe = (eps / bv) * 100; // Simplified ROE
        const roa = (eps / (totalDebt + totalEquity)) * 100; // Simplified ROA
        const priceToSales = mcap / rev;
        const fcfYield = (fcf / mcap) * 100;

        // DCF-based intrinsic value calculation (simplified)
        const discountRate = 0.10; // 10% discount rate
        const terminalGrowth = 0.03; // 3% terminal growth
        let dcfValue = 0;
        
        // Project 5 years of cash flows
        for (let year = 1; year <= 5; year++) {
            const projectedFcf = fcf * Math.pow(1 + growth / 100, year);
            dcfValue += projectedFcf / Math.pow(1 + discountRate, year);
        }
        
        // Terminal value
        const finalYearFcf = fcf * Math.pow(1 + growth / 100, 5);
        const terminalValue = (finalYearFcf * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
        dcfValue += terminalValue / Math.pow(1 + discountRate, 5);
        
        const intrinsicValue = dcfValue / (mcap / price); // Per share value
        
        // Comparative valuation (P/E method)
        const industryPE = 25; // Assumed industry average
        const fairValue = eps * industryPE;
        
        // Final intrinsic value (average of methods)
        const finalIntrinsicValue = (intrinsicValue + fairValue) / 2;
        
        const upside = ((finalIntrinsicValue - price) / price) * 100;

        // Risk assessment
        let riskScore = 0;
        const risks: string[] = [];
        const strengths: string[] = [];

        // P/E analysis
        if (peRatio > 30) {
            riskScore += 20;
            risks.push('High P/E ratio suggests overvaluation');
        } else if (peRatio < 15) {
            strengths.push('Attractive P/E ratio');
        }

        // PEG analysis
        if (pegRatio < 1) {
            strengths.push('Favorable PEG ratio indicates growth at reasonable price');
        } else if (pegRatio > 2) {
            riskScore += 15;
            risks.push('High PEG ratio suggests overvaluation relative to growth');
        }

        // Debt analysis
        if (debtToEquity > 2) {
            riskScore += 25;
            risks.push('High debt-to-equity ratio');
        } else if (debtToEquity < 0.5) {
            strengths.push('Conservative debt levels');
        }

        // Growth analysis
        if (growth > 15) {
            strengths.push('Strong growth prospects');
        } else if (growth < 3) {
            riskScore += 10;
            risks.push('Low growth expectations');
        }

        // Dividend analysis
        if (divYield > 3) {
            strengths.push('Attractive dividend yield');
        }

        // ROE analysis
        if (roe > 15) {
            strengths.push('Strong return on equity');
        } else if (roe < 10) {
            riskScore += 10;
            risks.push('Below-average return on equity');
        }

        // FCF Yield analysis
        if (fcfYield > 5) {
            strengths.push('Strong free cash flow yield');
        } else if (fcfYield < 2) {
            riskScore += 15;
            risks.push('Low free cash flow yield');
        }

        // Investment grade
        let grade = 'A';
        if (riskScore > 50) grade = 'D';
        else if (riskScore > 35) grade = 'C';
        else if (riskScore > 20) grade = 'B';

        setResults({
            intrinsicValue: finalIntrinsicValue,
            fairValue,
            upside,
            riskScore,
            investmentGrade: grade,
            keyStrengths: strengths,
            keyRisks: risks,
            ratios: {
                peRatio,
                pbRatio,
                pegRatio,
                debtToEquity,
                roe,
                roa
            }
        });
    }, [currentPrice, earnings, bookValue, revenue, growthRate, dividendYield, debt, equity, marketCap, freeCashFlow]);

    useEffect(() => {
        analyzeStock();
    }, [analyzeStock]);

    const handleReset = () => {
        setSymbol('AAPL');
        setCurrentPrice('150.00');
        setEarnings('6.05');
        setBookValue('4.15');
        setRevenue('365.8');
        setGrowthRate('8.5');
        setDividendYield('0.52');
        setDebt('110.0');
        setEquity('62.1');
        setMarketCap('2400');
        setFreeCashFlow('92.9');
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return theme.status.success.text;
            case 'B': return theme.status.info.text;
            case 'C': return theme.status.warning.text;
            case 'D': return theme.status.error.text;
            default: return theme.textColors.primary;
        }
    };

    const getUpsideColor = (upside: number) => {
        if (upside > 20) return theme.status.success.text;
        if (upside > 0) return theme.status.info.text;
        if (upside > -20) return theme.status.warning.text;
        return theme.status.error.text;
    };

    // Calculator metadata
    const metadata = {
        id: 'stock-analysis-calculator',
        title: 'Stock Analysis Calculator',
        description: 'Comprehensive fundamental analysis with valuation models and risk assessment',
        category: 'advanced' as const,
        icon: BarChart3,
        tags: ['stocks', 'valuation', 'analysis', 'DCF', 'ratios'],
        educationalNotes: [
            {
                title: 'Fundamental Analysis Basics',
                content: 'Fundamental analysis evaluates a stock\'s intrinsic value using financial metrics, ratios, and business fundamentals. Key metrics include P/E ratio, PEG ratio, debt-to-equity, and free cash flow yield.',
                tips: [
                    'P/E ratio shows how much investors pay per dollar of earnings',
                    'PEG ratio below 1.0 may indicate undervaluation relative to growth',
                    'Compare metrics to industry averages for context',
                    'Consider multiple valuation methods for comprehensive analysis'
                ]
            },
            {
                title: 'Valuation Models & Risk Assessment',
                content: 'DCF (Discounted Cash Flow) models estimate intrinsic value by projecting future cash flows. Risk assessment considers debt levels, growth sustainability, and market conditions.',
                tips: [
                    'DCF models are sensitive to growth and discount rate assumptions',
                    'Combine multiple valuation approaches for robust analysis',
                    'High debt-to-equity ratios increase financial risk',
                    'Consistent free cash flow generation indicates quality business'
                ]
            }
        ]
    };

    // Results formatting
    const stockResults = results ? {
        primary: {
            label: 'Intrinsic Value Per Share',
            value: results.intrinsicValue,
            format: 'currency' as const
        },
        secondary: [
            {
                label: 'Current Price',
                value: parseFloat(currentPrice),
                format: 'currency' as const
            },
            {
                label: 'Upside/Downside',
                value: results.upside / 100,
                format: 'percentage' as const
            },
            {
                label: 'P/E Ratio',
                value: results.ratios.peRatio,
                format: 'number' as const
            },
            {
                label: 'Risk Score',
                value: results.riskScore,
                format: 'number' as const
            }
        ]
    } : undefined;

    return (
        <CalculatorWrapper
            metadata={metadata}
            results={stockResults}
            onReset={handleReset}
        >
            <div className="space-y-6">
                {/* Stock Information */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Stock Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="symbol" className={`${theme.textColors.primary}`}>
                                Stock Symbol
                            </Label>
                            <input
                                id="symbol"
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                placeholder="Enter stock symbol"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="currentPrice" className={`${theme.textColors.primary}`}>
                                Current Price
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="currentPrice"
                                    type="number"
                                    value={currentPrice}
                                    onChange={(e) => setCurrentPrice(e.target.value)}
                                    placeholder="Enter current price"
                                    min="0"
                                    step="0.01"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Metrics */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Financial Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="earnings" className={`${theme.textColors.primary}`}>
                                Earnings Per Share (EPS)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="earnings"
                                    type="number"
                                    value={earnings}
                                    onChange={(e) => setEarnings(e.target.value)}
                                    placeholder="Enter EPS"
                                    min="0"
                                    step="0.01"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="bookValue" className={`${theme.textColors.primary}`}>
                                Book Value Per Share
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="bookValue"
                                    type="number"
                                    value={bookValue}
                                    onChange={(e) => setBookValue(e.target.value)}
                                    placeholder="Enter book value"
                                    min="0"
                                    step="0.01"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="revenue" className={`${theme.textColors.primary}`}>
                                Revenue (Billions)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="revenue"
                                    type="number"
                                    value={revenue}
                                    onChange={(e) => setRevenue(e.target.value)}
                                    placeholder="Enter revenue"
                                    min="0"
                                    step="0.1"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="growthRate" className={`${theme.textColors.primary}`}>
                                Expected Growth Rate (%)
                            </Label>
                            <input
                                id="growthRate"
                                type="number"
                                value={growthRate}
                                onChange={(e) => setGrowthRate(e.target.value)}
                                placeholder="Enter growth rate"
                                min="-50"
                                max="100"
                                step="0.1"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="dividendYield" className={`${theme.textColors.primary}`}>
                                Dividend Yield (%)
                            </Label>
                            <input
                                id="dividendYield"
                                type="number"
                                value={dividendYield}
                                onChange={(e) => setDividendYield(e.target.value)}
                                placeholder="Enter dividend yield"
                                min="0"
                                max="20"
                                step="0.01"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="freeCashFlow" className={`${theme.textColors.primary}`}>
                                Free Cash Flow (Billions)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="freeCashFlow"
                                    type="number"
                                    value={freeCashFlow}
                                    onChange={(e) => setFreeCashFlow(e.target.value)}
                                    placeholder="Enter FCF"
                                    min="0"
                                    step="0.1"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Balance Sheet */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Balance Sheet Data</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="debt" className={`${theme.textColors.primary}`}>
                                Total Debt (Billions)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="debt"
                                    type="number"
                                    value={debt}
                                    onChange={(e) => setDebt(e.target.value)}
                                    placeholder="Enter total debt"
                                    min="0"
                                    step="0.1"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="equity" className={`${theme.textColors.primary}`}>
                                Total Equity (Billions)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="equity"
                                    type="number"
                                    value={equity}
                                    onChange={(e) => setEquity(e.target.value)}
                                    placeholder="Enter total equity"
                                    min="0"
                                    step="0.1"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="marketCap" className={`${theme.textColors.primary}`}>
                                Market Cap (Billions)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="marketCap"
                                    type="number"
                                    value={marketCap}
                                    onChange={(e) => setMarketCap(e.target.value)}
                                    placeholder="Enter market cap"
                                    min="0"
                                    step="1"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Results */}
                {results && (
                    <div className="space-y-6">
                        {/* Valuation Summary */}
                        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Valuation Summary</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
                                        ${results.intrinsicValue.toFixed(2)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>Intrinsic Value</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${getUpsideColor(results.upside)} mb-2`}>
                                        {results.upside > 0 ? '+' : ''}{results.upside.toFixed(1)}%
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>Upside/Downside</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${getGradeColor(results.investmentGrade)} mb-2`}>
                                        {results.investmentGrade}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>Investment Grade</div>
                                </div>
                            </div>
                        </div>

                        {/* Key Ratios */}
                        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Key Financial Ratios</h4>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {results.ratios.peRatio.toFixed(1)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>P/E Ratio</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {results.ratios.pegRatio.toFixed(2)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>PEG Ratio</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {results.ratios.pbRatio.toFixed(1)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>P/B Ratio</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {results.ratios.debtToEquity.toFixed(1)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>D/E Ratio</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {results.ratios.roe.toFixed(1)}%
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>ROE</div>
                                </div>
                                
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {results.ratios.roa.toFixed(1)}%
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>ROA</div>
                                </div>
                            </div>
                        </div>

                        {/* Strengths & Risks */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6`}>
                                <h5 className={`${theme.typography.heading6} ${theme.status.success.text} mb-4 flex items-center`}>
                                    <TrendingUp className="w-5 h-5 mr-2" />
                                    Key Strengths
                                </h5>
                                <ul className="space-y-2">
                                    {results.keyStrengths.map((strength, index) => (
                                        <li key={index} className={`text-sm ${theme.textColors.secondary} flex items-start`}>
                                            <span className={`${theme.status.success.text} mr-2`}>•</span>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6`}>
                                <h5 className={`${theme.typography.heading6} ${theme.status.error.text} mb-4 flex items-center`}>
                                    <AlertTriangle className="w-5 h-5 mr-2" />
                                    Key Risks
                                </h5>
                                <ul className="space-y-2">
                                    {results.keyRisks.map((risk, index) => (
                                        <li key={index} className={`text-sm ${theme.textColors.secondary} flex items-start`}>
                                            <span className={`${theme.status.error.text} mr-2`}>•</span>
                                            {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorWrapper>
    );
}

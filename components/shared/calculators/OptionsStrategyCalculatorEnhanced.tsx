'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { useOptionsCalculator } from '@/lib/utils/calculatorHooks';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, PercentageInput, NumberInput, SelectField } from './FormFields';
import { InputGroup } from './FormFields';
import { ResultCard } from './ResultComponents';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
    DollarSign,
    Target,
    Percent,
    Calendar,
    ArrowUp,
    ArrowDown,
    TrendingUp,
    Calculator,
    BarChart3,
    AlertTriangle,
    Info,
    CheckCircle,
    Activity,
    Zap
} from 'lucide-react';

export default function OptionsStrategyCalculatorEnhanced() {
    const { recordCalculatorUsage } = useProgressStore();
    const {
        values,
        result,
        validation,
        isValid,
        updateField,
        reset,
        errors
    } = useOptionsCalculator();

    // Track calculator usage
    useEffect(() => {
        recordCalculatorUsage('options-strategy-calculator');
    }, [recordCalculatorUsage]);

    const metadata: CalculatorMetadata = {
        id: 'options-strategy-calculator',
        title: 'Options Strategy Calculator',
        description: 'Analyze options strategies with Black-Scholes pricing, Greeks, and comprehensive payoff diagrams.',
        category: 'advanced',
        icon: Activity,
        tags: ['Options', 'Derivatives', 'Greeks', 'Risk Management', 'Advanced Trading', 'Black-Scholes'],
        educationalNotes: [
            {
                title: 'Understanding Options Greeks',
                content: 'Greeks measure different risk factors that affect option prices. Master these to understand how your positions react to market changes.',
                tips: [
                    'Delta measures price sensitivity to stock movement',
                    'Theta shows daily time decay impact',
                    'Vega indicates volatility risk exposure',
                    'Gamma shows how delta changes with price moves'
                ]
            },
            {
                title: 'Strategy Selection Guide',
                content: 'Choose strategies based on your market outlook and risk tolerance. Each strategy has distinct risk/reward profiles.',
                tips: [
                    'Long calls for strong bullish outlook',
                    'Put spreads for controlled bearish bets',
                    'Covered calls for income generation',
                    'Iron condors for range-bound markets'
                ]
            },
            {
                title: 'Risk Management',
                content: 'Options can amplify both gains and losses. Always understand your maximum risk before entering positions.',
                tips: [
                    'Never risk more than you can afford to lose',
                    'Set stop-loss levels before entering trades',
                    'Consider liquidity when selecting strikes',
                    'Monitor time decay especially near expiration'
                ]
            }
        ]
    };

    if (!result) {
        return (
            <CalculatorWrapper metadata={metadata}>
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Controls */}
                        <div className="space-y-6">
                            <div>
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                    <Calculator className={`w-5 h-5 ${theme.textColors.primary}`} />
                                    Options Parameters
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CurrencyInput
                                        label="Stock Price"
                                        value={values.stockPrice.toString()}
                                        onChange={(value) => updateField('stockPrice', value)}
                                        error={errors.stockPrice}
                                        placeholder="100.00"
                                    />

                                    <CurrencyInput
                                        label="Strike Price"
                                        value={values.strikePrice.toString()}
                                        onChange={(value) => updateField('strikePrice', value)}
                                        error={errors.strikePrice}
                                        placeholder="100.00"
                                    />

                                    <CurrencyInput
                                        label="Premium Paid"
                                        value={values.premium.toString()}
                                        onChange={(value) => updateField('premium', value)}
                                        error={errors.premium}
                                        placeholder="3.00"
                                    />

                                    <NumberInput
                                        label="Days to Expiration"
                                        value={values.daysToExpiration.toString()}
                                        onChange={(value) => updateField('daysToExpiration', value)}
                                        error={errors.daysToExpiration}
                                        placeholder="30"
                                    />

                                    <PercentageInput
                                        label="Implied Volatility"
                                        value={values.impliedVolatility.toString()}
                                        onChange={(value) => updateField('impliedVolatility', value)}
                                        error={errors.impliedVolatility}
                                        placeholder="25"
                                    />

                                    <PercentageInput
                                        label="Risk-Free Rate"
                                        value={values.riskFreeRate.toString()}
                                        onChange={(value) => updateField('riskFreeRate', value)}
                                        error={errors.riskFreeRate}
                                        placeholder="5"
                                    />

                                    <PercentageInput
                                        label="Dividend Yield"
                                        value={values.dividendYield.toString()}
                                        onChange={(value) => updateField('dividendYield', value)}
                                        error={errors.dividendYield}
                                        placeholder="2"
                                    />

                                    <NumberInput
                                        label="Number of Contracts"
                                        value={values.numberOfContracts.toString()}
                                        onChange={(value) => updateField('numberOfContracts', value)}
                                        error={errors.numberOfContracts}
                                        placeholder="1"
                                    />
                                </div>

                                <div className="mt-4">
                                    <SelectField
                                        label="Strategy Type"
                                        value={values.strategyType}
                                        onChange={(value) => updateField('strategyType', value)}
                                        error={errors.strategyType}
                                        options={[
                                            { value: 'long-call', label: 'Long Call - Bullish' },
                                            { value: 'long-put', label: 'Long Put - Bearish' },
                                            { value: 'covered-call', label: 'Covered Call - Income' },
                                            { value: 'cash-secured-put', label: 'Cash-Secured Put - Income' },
                                            { value: 'bull-call-spread', label: 'Bull Call Spread - Moderate Bullish' },
                                            { value: 'bear-put-spread', label: 'Bear Put Spread - Moderate Bearish' },
                                            { value: 'iron-condor', label: 'Iron Condor - Neutral' }
                                        ]}
                                    />
                                </div>

                                {(values.strategyType.includes('spread') || values.strategyType.includes('condor')) && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CurrencyInput
                                            label="Second Strike Price"
                                            value={values.strikePrice2.toString()}
                                            onChange={(value) => updateField('strikePrice2', value)}
                                            error={errors.strikePrice2}
                                            placeholder="110.00"
                                        />

                                        <CurrencyInput
                                            label="Second Premium"
                                            value={values.premium2.toString()}
                                            onChange={(value) => updateField('premium2', value)}
                                            error={errors.premium2}
                                            placeholder="1.00"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Placeholder for Results */}
                        <div className="space-y-6">
                            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6 backdrop-blur-sm`}>
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                    <BarChart3 className={`w-5 h-5 ${theme.textColors.primary}`} />
                                    Analysis Results
                                </h3>
                                <p className={`${theme.textColors.secondary} text-center py-8`}>
                                    Enter valid options parameters to see detailed strategy analysis
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CalculatorWrapper>
        );
    }

    return (
        <CalculatorWrapper metadata={metadata}>
            <div className="space-y-8">
                {/* Input Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                    <Calculator className={`w-5 h-5 ${theme.textColors.primary}`} />
                                    Options Parameters
                                </h3>

                                <InputGroup>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CurrencyInput
                                            label="Stock Price"
                                            value={values.stockPrice.toString()}
                                            onChange={(value) => updateField('stockPrice', value)}
                                            error={errors.stockPrice}
                                        />

                                        <CurrencyInput
                                            label="Strike Price"
                                            value={values.strikePrice.toString()}
                                            onChange={(value) => updateField('strikePrice', value)}
                                            error={errors.strikePrice}
                                        />

                                        <CurrencyInput
                                            label="Premium Paid"
                                            value={values.premium.toString()}
                                            onChange={(value) => updateField('premium', value)}
                                            error={errors.premium}
                                        />

                                        <NumberInput
                                            label="Days to Expiration"
                                            value={values.daysToExpiration.toString()}
                                            onChange={(value) => updateField('daysToExpiration', value)}
                                            error={errors.daysToExpiration}
                                        />

                                        <PercentageInput
                                            label="Implied Volatility"
                                            value={values.impliedVolatility.toString()}
                                            onChange={(value) => updateField('impliedVolatility', value)}
                                            error={errors.impliedVolatility}
                                        />

                                        <PercentageInput
                                            label="Risk-Free Rate"
                                            value={values.riskFreeRate.toString()}
                                            onChange={(value) => updateField('riskFreeRate', value)}
                                            error={errors.riskFreeRate}
                                        />

                                        <PercentageInput
                                            label="Dividend Yield"
                                            value={values.dividendYield.toString()}
                                            onChange={(value) => updateField('dividendYield', value)}
                                            error={errors.dividendYield}
                                        />

                                        <NumberInput
                                            label="Number of Contracts"
                                            value={values.numberOfContracts.toString()}
                                            onChange={(value) => updateField('numberOfContracts', value)}
                                            error={errors.numberOfContracts}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <SelectField
                                            label="Strategy Type"
                                            value={values.strategyType}
                                            onChange={(value) => updateField('strategyType', value)}
                                            error={errors.strategyType}
                                            options={[
                                                { value: 'long-call', label: 'Long Call - Bullish' },
                                                { value: 'long-put', label: 'Long Put - Bearish' },
                                                { value: 'covered-call', label: 'Covered Call - Income' },
                                                { value: 'cash-secured-put', label: 'Cash-Secured Put - Income' },
                                                { value: 'bull-call-spread', label: 'Bull Call Spread - Moderate Bullish' },
                                                { value: 'bear-put-spread', label: 'Bear Put Spread - Moderate Bearish' },
                                                { value: 'iron-condor', label: 'Iron Condor - Neutral' }
                                            ]}
                                        />
                                    </div>

                                    {(values.strategyType.includes('spread') || values.strategyType.includes('condor')) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            <CurrencyInput
                                                label="Second Strike Price"
                                                value={values.strikePrice2.toString()}
                                                onChange={(value) => updateField('strikePrice2', value)}
                                                error={errors.strikePrice2}
                                            />

                                            <CurrencyInput
                                                label="Second Premium"
                                                value={values.premium2.toString()}
                                                onChange={(value) => updateField('premium2', value)}
                                                error={errors.premium2}
                                            />
                                        </motion.div>
                                    )}
                                </InputGroup>
                            </div>
                        </div>

                        {/* Quick Results Summary */}
                        <div className="space-y-4">
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                <Target className={`w-5 h-5 ${theme.textColors.primary}`} />
                                Position Summary
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <ResultCard
                                    title="Current Value"
                                    value={formatCurrency(result.currentValue)}
                                    subtitle="Position value"
                                    icon={DollarSign}
                                />

                                <ResultCard
                                    title="P&L"
                                    value={formatCurrency(result.profitLoss)}
                                    subtitle={result.profitLoss >= 0 ? "Profit" : "Loss"}
                                    icon={result.profitLoss >= 0 ? TrendingUp : ArrowDown}
                                    variant={result.profitLoss >= 0 ? "success" : "danger"}
                                />

                                <ResultCard
                                    title="Max Profit"
                                    value={result.maxProfit === Infinity ? "Unlimited" : formatCurrency(result.maxProfit)}
                                    subtitle="Best case"
                                    icon={ArrowUp}
                                    variant="success"
                                />

                                <ResultCard
                                    title="Max Loss"
                                    value={formatCurrency(result.maxLoss)}
                                    subtitle="Worst case"
                                    icon={ArrowDown}
                                    variant="danger"
                                />
                            </div>

                            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}>
                                <h4 className={`font-semibold ${theme.textColors.secondary} mb-2`}>Break-Even Points:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.breakEvenPoints.map((point, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${theme.backgrounds.glass} border ${theme.borderColors.primary} ${theme.textColors.secondary}`}
                                        >
                                            {formatCurrency(point)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}>
                                <h4 className={`font-semibold ${theme.textColors.secondary} mb-2`}>Strategy Analysis:</h4>
                                <div className="space-y-2 text-sm">
                                    <div className={`flex justify-between ${theme.textColors.secondary}`}>
                                        <span>Market Outlook:</span>
                                        <span className="font-medium">{result.strategyAnalysis.marketOutlook}</span>
                                    </div>
                                    <div className={`flex justify-between ${theme.textColors.secondary}`}>
                                        <span>Risk Level:</span>
                                        <span className={`font-medium ${result.strategyAnalysis.riskLevel === 'Low' ? 'text-green-400' :
                                                result.strategyAnalysis.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            {result.strategyAnalysis.riskLevel}
                                        </span>
                                    </div>
                                    <div className={`flex justify-between ${theme.textColors.secondary}`}>
                                        <span>Profit Probability:</span>
                                        <span className="font-medium">{result.probabilityOfProfit.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
                >
                    <div className="space-y-8">
                        {/* Greeks Analysis */}
                        <div>
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
                                <Activity className={`w-5 h-5 ${theme.textColors.primary}`} />
                                Options Greeks
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {result.riskMetrics.map((metric, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}
                                    >
                                        <div className={`text-xl font-bold ${metric.color} mb-1`}>
                                            {metric.value}
                                        </div>
                                        <div className={`text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                            {metric.metric}
                                        </div>
                                        <div className={`text-xs ${theme.textColors.secondary}`}>
                                            {metric.interpretation}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Payoff Diagram */}
                        <div>
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
                                <TrendingUp className={`w-5 h-5 ${theme.textColors.primary}`} />
                                Payoff Diagram
                            </h3>

                            <div className="h-80 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={result.payoffDiagram}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis
                                            dataKey="price"
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                                        />
                                        <Tooltip
                                            labelFormatter={(value) => `Stock Price: $${Number(value).toFixed(2)}`}
                                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'P&L']}
                                            contentStyle={{
                                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                color: 'white'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="pnl"
                                            stroke="#60a5fa"
                                            fill="url(#profitGradient)"
                                            strokeWidth={2}
                                        />
                                        <defs>
                                            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                                <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Payoff Insights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm text-center`}>
                                    <CheckCircle className={`w-6 h-6 text-green-400 mx-auto mb-2`} />
                                    <div className={`text-sm font-medium ${theme.textColors.secondary}`}>Profit Zone</div>
                                    <div className={`text-xs ${theme.textColors.secondary}`}>
                                        Above break-even points
                                    </div>
                                </div>

                                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm text-center`}>
                                    <AlertTriangle className={`w-6 h-6 text-yellow-400 mx-auto mb-2`} />
                                    <div className={`text-sm font-medium ${theme.textColors.secondary}`}>Break-Even</div>
                                    <div className={`text-xs ${theme.textColors.secondary}`}>
                                        No profit or loss
                                    </div>
                                </div>

                                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm text-center`}>
                                    <ArrowDown className={`w-6 h-6 text-red-400 mx-auto mb-2`} />
                                    <div className={`text-sm font-medium ${theme.textColors.secondary}`}>Loss Zone</div>
                                    <div className={`text-xs ${theme.textColors.secondary}`}>
                                        Below break-even points
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Details & Risk Assessment */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6 backdrop-blur-sm`}>
                                <h4 className={`font-semibold ${theme.textColors.secondary} mb-4 flex items-center gap-2`}>
                                    <Info className="w-4 h-4" />
                                    Strategy Details
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className={theme.textColors.secondary}>
                                        <span className="font-medium">Complexity:</span> {result.strategyAnalysis.complexity}
                                    </div>
                                    <div className={theme.textColors.secondary}>
                                        <span className="font-medium">Time Horizon:</span> {result.strategyAnalysis.timeHorizon}
                                    </div>
                                    <div className={theme.textColors.secondary}>
                                        <span className="font-medium">Best Scenario:</span> {result.strategyAnalysis.bestScenario}
                                    </div>
                                    <div className={theme.textColors.secondary}>
                                        <span className="font-medium">Worst Scenario:</span> {result.strategyAnalysis.worstScenario}
                                    </div>
                                </div>
                            </div>

                            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6 backdrop-blur-sm`}>
                                <h4 className={`font-semibold ${theme.textColors.secondary} mb-4 flex items-center gap-2`}>
                                    <Zap className="w-4 h-4" />
                                    Risk Assessment
                                </h4>
                                <div className="space-y-4">
                                    <div className={`flex items-center justify-between ${theme.textColors.secondary}`}>
                                        <span>Risk Level:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${result.strategyAnalysis.riskLevel === 'Low' ? 'bg-green-900/50 text-green-400' :
                                                result.strategyAnalysis.riskLevel === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                                                    'bg-red-900/50 text-red-400'
                                            }`}>
                                            {result.strategyAnalysis.riskLevel}
                                        </span>
                                    </div>

                                    <div className={`${theme.textColors.secondary} text-sm`}>
                                        <div className="flex justify-between mb-1">
                                            <span>Probability of Profit:</span>
                                            <span className="font-medium">{result.probabilityOfProfit.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${result.probabilityOfProfit}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className={`${theme.textColors.secondary} text-sm`}>
                                        <div className="flex justify-between">
                                            <span>Capital Required:</span>
                                            <span className="font-medium">{formatCurrency(Math.abs(result.maxLoss))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </CalculatorWrapper>
    );
}

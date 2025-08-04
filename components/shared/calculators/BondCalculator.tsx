'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { TrendingUp, DollarSign, Percent, Target } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { theme } from '@/lib/theme';

interface ValuationResults {
  currentYield: number;
  yieldToMaturity: number;
  totalReturn: number;
  annualIncome: number;
  purchaseYield: number;
  interestRateSensitivity: number;
}

interface RateScenario {
  rateChange: string;
  newPrice: string;
  priceChange: string;
  rate: string;
}

export default function BondCalculator() {
    // Form inputs
    const [faceValue, setFaceValue] = useState('1000');
    const [couponRate, setCouponRate] = useState('5.0');
    const [yearsToMaturity, setYearsToMaturity] = useState('10');
    const [currentPrice, setCurrentPrice] = useState('950');
    const [paymentFrequency, setPaymentFrequency] = useState('2'); // Semi-annual

    const [results, setResults] = useState<ValuationResults | null>(null);
    const [rateScenarios, setRateScenarios] = useState<RateScenario[]>([]);

    const calculateBondMetrics = useCallback(() => {
        const face = parseFloat(faceValue) || 1000;
        const rate = parseFloat(couponRate) || 5.0;
        const years = parseFloat(yearsToMaturity) || 10;
        const price = parseFloat(currentPrice) || 950;
        const frequency = parseInt(paymentFrequency) || 2;

        // Annual coupon payment
        const annualCoupon = (rate / 100) * face;

        // Current Yield = Annual Coupon / Current Price
        const currentYield = (annualCoupon / price) * 100;

        // Approximate Yield to Maturity using simplified formula
        const ytm = ((annualCoupon + (face - price) / years) / ((face + price) / 2)) * 100;

        // Total return if held to maturity
        const totalCoupons = annualCoupon * years;
        const capitalGain = face - price;
        const totalReturn = totalCoupons + capitalGain;

        // Purchase yield (current yield at purchase price)
        const purchaseYield = currentYield;

        // Interest rate sensitivity (duration approximation)
        const modifiedDuration = years / (1 + ytm / 100 / frequency);
        const interestRateSensitivity = modifiedDuration;

        const calculatedResults: ValuationResults = {
            currentYield,
            yieldToMaturity: ytm,
            totalReturn,
            annualIncome: annualCoupon,
            purchaseYield,
            interestRateSensitivity
        };

        setResults(calculatedResults);

        // Calculate rate scenarios
        const scenarios: RateScenario[] = [];
        const rateChanges = [-2, -1, -0.5, 0, 0.5, 1, 2];
        
        rateChanges.forEach(change => {
            const newYtm = ytm + change;
            // Approximate new price using duration
            const priceChangePercent = -modifiedDuration * change;
            const newPrice = price * (1 + priceChangePercent / 100);
            
            scenarios.push({
                rateChange: change > 0 ? `+${change}%` : `${change}%`,
                newPrice: newPrice.toFixed(2),
                priceChange: `${priceChangePercent.toFixed(1)}%`,
                rate: `${newYtm.toFixed(2)}%`
            });
        });

        setRateScenarios(scenarios);
    }, [faceValue, couponRate, yearsToMaturity, currentPrice, paymentFrequency]);

    useEffect(() => {
        calculateBondMetrics();
    }, [calculateBondMetrics]);

    const handleReset = () => {
        setFaceValue('1000');
        setCouponRate('5.0');
        setYearsToMaturity('10');
        setCurrentPrice('950');
        setPaymentFrequency('2');
    };

    const isPremium = parseFloat(currentPrice) > parseFloat(faceValue);
    const isDiscount = parseFloat(currentPrice) < parseFloat(faceValue);

    // Calculator metadata
    const metadata = {
        id: 'bond-calculator',
        title: 'Bond Valuation Calculator',
        description: 'Calculate bond yields, total returns, and interest rate sensitivity',
        category: 'intermediate' as const,
        icon: TrendingUp,
        tags: ['bonds', 'fixed income', 'yield', 'interest rates', 'investment'],
        educationalNotes: [
            {
                title: 'Understanding Bond Basics',
                content: 'Bonds are debt securities that pay fixed interest over time. Key metrics include current yield (annual income ÷ current price) and yield to maturity (total return if held to maturity). Bond prices move inversely to interest rates.',
                tips: [
                    'Premium bonds (price > face value) have lower yields than coupon rates',
                    'Discount bonds (price < face value) have higher yields than coupon rates',
                    'Longer maturity bonds are more sensitive to interest rate changes',
                    'Semi-annual payments are standard for most corporate and government bonds'
                ]
            },
            {
                title: 'Interest Rate Risk & Duration',
                content: 'Duration measures a bond\'s price sensitivity to interest rate changes. Modified duration approximates the percentage price change for a 1% interest rate move. Longer duration = higher interest rate risk.',
                tips: [
                    'Use duration to estimate portfolio interest rate risk',
                    'Ladder bond maturities to reduce reinvestment risk',
                    'Consider bond funds for diversification and professional management',
                    'Monitor credit quality and issuer financial health'
                ]
            }
        ]
    };

    // Results formatting
    const bondResults = results ? {
        primary: {
            label: 'Yield to Maturity',
            value: results.yieldToMaturity / 100,
            format: 'percentage' as const
        },
        secondary: [
            {
                label: 'Current Yield',
                value: results.currentYield / 100,
                format: 'percentage' as const
            },
            {
                label: 'Annual Income',
                value: results.annualIncome,
                format: 'currency' as const
            },
            {
                label: 'Total Return (to maturity)',
                value: results.totalReturn,
                format: 'currency' as const
            },
            {
                label: 'Interest Rate Sensitivity',
                value: results.interestRateSensitivity,
                format: 'number' as const
            }
        ]
    } : undefined;

    return (
        <CalculatorWrapper
            metadata={metadata}
            results={bondResults}
            onReset={handleReset}
        >
            <div className="space-y-6">
                {/* Bond Details */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Bond Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="faceValue" className={`${theme.textColors.primary}`}>
                                Face Value (Par Value)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="faceValue"
                                    type="number"
                                    value={faceValue}
                                    onChange={(e) => setFaceValue(e.target.value)}
                                    placeholder="Enter face value"
                                    min="100"
                                    max="100000"
                                    step="100"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="currentPrice" className={`${theme.textColors.primary}`}>
                                Current Market Price
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="currentPrice"
                                    type="number"
                                    value={currentPrice}
                                    onChange={(e) => setCurrentPrice(e.target.value)}
                                    placeholder="Enter current price"
                                    min="50"
                                    max="200000"
                                    step="0.01"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                            {isPremium && (
                                <p className={`text-xs ${theme.status.warning.text} mt-1`}>
                                    Premium bond (trading above par)
                                </p>
                            )}
                            {isDiscount && (
                                <p className={`text-xs ${theme.status.success.text} mt-1`}>
                                    Discount bond (trading below par)
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="couponRate" className={`${theme.textColors.primary}`}>
                                Annual Coupon Rate (%)
                            </Label>
                            <input
                                id="couponRate"
                                type="number"
                                value={couponRate}
                                onChange={(e) => setCouponRate(e.target.value)}
                                placeholder="Enter coupon rate"
                                min="0"
                                max="20"
                                step="0.1"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="yearsToMaturity" className={`${theme.textColors.primary}`}>
                                Years to Maturity
                            </Label>
                            <input
                                id="yearsToMaturity"
                                type="number"
                                value={yearsToMaturity}
                                onChange={(e) => setYearsToMaturity(e.target.value)}
                                placeholder="Enter years to maturity"
                                min="0.25"
                                max="50"
                                step="0.25"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="paymentFrequency" className={`${theme.textColors.primary}`}>
                                Payment Frequency
                            </Label>
                            <select
                                id="paymentFrequency"
                                value={paymentFrequency}
                                onChange={(e) => setPaymentFrequency(e.target.value)}
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            >
                                <option value="1">Annual</option>
                                <option value="2">Semi-Annual</option>
                                <option value="4">Quarterly</option>
                                <option value="12">Monthly</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Interest Rate Sensitivity Analysis */}
                {rateScenarios.length > 0 && (
                    <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Interest Rate Sensitivity Analysis</h4>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`border-b ${theme.borderColors.primary}`}>
                                        <th className={`text-left py-2 ${theme.textColors.primary}`}>Rate Change</th>
                                        <th className={`text-left py-2 ${theme.textColors.primary}`}>New YTM</th>
                                        <th className={`text-left py-2 ${theme.textColors.primary}`}>Estimated Price</th>
                                        <th className={`text-left py-2 ${theme.textColors.primary}`}>Price Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rateScenarios.map((scenario, index) => (
                                        <tr key={index} className={`border-b ${theme.borderColors.primary}`}>
                                            <td className={`py-2 ${theme.textColors.secondary}`}>{scenario.rateChange}</td>
                                            <td className={`py-2 ${theme.textColors.secondary}`}>{scenario.rate}</td>
                                            <td className={`py-2 ${theme.textColors.secondary}`}>${scenario.newPrice}</td>
                                            <td className={`py-2 ${
                                                scenario.priceChange.startsWith('-') ? theme.status.error.text :
                                                scenario.priceChange.startsWith('+') ? theme.status.success.text :
                                                theme.textColors.secondary
                                            }`}>
                                                {scenario.priceChange}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Key Insights */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
                                <Percent className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
                                <div className={`text-sm ${theme.status.info.text} mb-1`}>Modified Duration</div>
                                <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                                    {results?.interestRateSensitivity.toFixed(2)} years
                                </div>
                            </div>
                            
                            <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 text-center`}>
                                <DollarSign className={`w-6 h-6 ${theme.status.success.text} mx-auto mb-2`} />
                                <div className={`text-sm ${theme.status.success.text} mb-1`}>Annual Income</div>
                                <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                                    ${results?.annualIncome.toFixed(2)}
                                </div>
                            </div>
                            
                            <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 text-center`}>
                                <Target className={`w-6 h-6 ${theme.status.warning.text} mx-auto mb-2`} />
                                <div className={`text-sm ${theme.status.warning.text} mb-1`}>Bond Type</div>
                                <div className={`text-sm font-bold ${theme.textColors.primary}`}>
                                    {isPremium ? 'Premium' : isDiscount ? 'Discount' : 'At Par'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorWrapper>
    );
}

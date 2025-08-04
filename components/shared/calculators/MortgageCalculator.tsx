'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { Home, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { theme } from '@/lib/theme';

interface MortgageResult {
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    affordabilityRatio: number;
}

export default function MortgageCalculator() {
    // Form inputs
    const [homePrice, setHomePrice] = useState('400000');
    const [downPayment, setDownPayment] = useState('80000');
    const [interestRate, setInterestRate] = useState('6.5');
    const [loanTerm, setLoanTerm] = useState('30');
    const [monthlyIncome, setMonthlyIncome] = useState('8000');
    const [propertyTax, setPropertyTax] = useState('500');
    const [insurance, setInsurance] = useState('200');
    const [pmi, setPmi] = useState('150');

    const [result, setResult] = useState<MortgageResult | null>(null);

    const calculateMortgage = useCallback(() => {
        const price = parseFloat(homePrice) || 0;
        const down = parseFloat(downPayment) || 0;
        const rate = parseFloat(interestRate) || 0;
        const years = parseFloat(loanTerm) || 0;
        const income = parseFloat(monthlyIncome) || 0;
        const tax = parseFloat(propertyTax) || 0;
        const ins = parseFloat(insurance) || 0;
        const pmiAmount = parseFloat(pmi) || 0;

        if (price <= 0 || down < 0 || rate <= 0 || years <= 0) {
            setResult(null);
            return;
        }

        const loanAmount = price - down;
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = years * 12;

        // Calculate monthly payment using PMT formula
        const monthlyPayment = loanAmount *
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const totalPayments = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayments - loanAmount;
        const totalCost = price + totalInterest;

        // Total monthly housing payment including taxes, insurance, PMI
        const totalMonthlyPayment = monthlyPayment + tax + ins + (down < price * 0.2 ? pmiAmount : 0);
        const affordabilityRatio = (totalMonthlyPayment / income) * 100;

        setResult({
            monthlyPayment: totalMonthlyPayment,
            totalInterest,
            totalCost,
            affordabilityRatio
        });
    }, [homePrice, downPayment, interestRate, loanTerm, monthlyIncome, propertyTax, insurance, pmi]);

    useEffect(() => {
        calculateMortgage();
    }, [calculateMortgage]);

    const handleReset = () => {
        setHomePrice('400000');
        setDownPayment('80000');
        setInterestRate('6.5');
        setLoanTerm('30');
        setMonthlyIncome('8000');
        setPropertyTax('500');
        setInsurance('200');
        setPmi('150');
    };

    const downPaymentPercent = ((parseFloat(downPayment) || 0) / (parseFloat(homePrice) || 1)) * 100;

    // Calculator metadata
    const metadata = {
        id: 'mortgage-calculator',
        title: 'Mortgage Payment Calculator',
        description: 'Calculate monthly mortgage payments, total interest, and affordability ratios',
        category: 'intermediate' as const,
        icon: Home,
        tags: ['mortgage', 'real estate', 'home buying', 'loans', 'interest'],
        educationalNotes: [
            {
                title: 'Understanding Mortgage Calculations',
                content: 'A mortgage payment consists of principal and interest (P&I), plus property taxes, insurance, and possibly PMI. The 28/36 rule suggests housing costs should not exceed 28% of gross income.',
                tips: [
                    'Aim for 20% down payment to avoid PMI',
                    'Each 1% interest rate increase adds ~10% to monthly payment',
                    'Consider property taxes and insurance in your budget',
                    'Pre-approval helps determine realistic price range'
                ]
            },
            {
                title: 'Affordability Guidelines',
                content: 'Lenders typically prefer a housing payment ratio of 28% or less, and total debt-to-income ratio of 36% or less. These ratios help ensure you can comfortably afford your mortgage.',
                tips: [
                    'Factor in HOA fees, utilities, and maintenance costs',
                    'Keep emergency fund for home repairs',
                    'Consider future income changes',
                    'Account for closing costs (2-5% of home price)'
                ]
            }
        ]
    };

    // Results formatting
    const results = result ? {
        primary: {
            label: 'Monthly Payment (PITI + PMI)',
            value: result.monthlyPayment,
            format: 'currency' as const
        },
        secondary: [
            {
                label: 'Total Interest Over Life of Loan',
                value: result.totalInterest,
                format: 'currency' as const
            },
            {
                label: 'Total Cost of Home',
                value: result.totalCost,
                format: 'currency' as const
            },
            {
                label: 'Housing Payment Ratio',
                value: result.affordabilityRatio / 100,
                format: 'percentage' as const
            },
            {
                label: 'Down Payment Percentage',
                value: downPaymentPercent / 100,
                format: 'percentage' as const
            }
        ]
    } : undefined;

    return (
        <CalculatorWrapper
            metadata={metadata}
            results={results}
            onReset={handleReset}
        >
            <div className="space-y-6">
                {/* Home Purchase Details */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Home Purchase Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="homePrice" className={`${theme.textColors.primary}`}>
                                Home Price
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="homePrice"
                                    type="number"
                                    value={homePrice}
                                    onChange={(e) => setHomePrice(e.target.value)}
                                    placeholder="Enter home price"
                                    min="50000"
                                    max="5000000"
                                    step="1000"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="downPayment" className={`${theme.textColors.primary}`}>
                                Down Payment
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="downPayment"
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value)}
                                    placeholder="Enter down payment"
                                    min="0"
                                    max="1000000"
                                    step="1000"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                                {downPaymentPercent.toFixed(1)}% of home price
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loan Terms */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Loan Terms</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="interestRate" className={`${theme.textColors.primary}`}>
                                Interest Rate (%)
                            </Label>
                            <input
                                id="interestRate"
                                type="number"
                                value={interestRate}
                                onChange={(e) => setInterestRate(e.target.value)}
                                placeholder="Enter interest rate"
                                min="0.1"
                                max="15"
                                step="0.1"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="loanTerm" className={`${theme.textColors.primary}`}>
                                Loan Term (years)
                            </Label>
                            <input
                                id="loanTerm"
                                type="number"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(e.target.value)}
                                placeholder="Enter loan term"
                                min="5"
                                max="50"
                                step="1"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Costs */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Monthly Costs & Income</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="monthlyIncome" className={`${theme.textColors.primary}`}>
                                Monthly Gross Income
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="monthlyIncome"
                                    type="number"
                                    value={monthlyIncome}
                                    onChange={(e) => setMonthlyIncome(e.target.value)}
                                    placeholder="Enter monthly income"
                                    min="1000"
                                    max="100000"
                                    step="100"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="propertyTax" className={`${theme.textColors.primary}`}>
                                Monthly Property Tax
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="propertyTax"
                                    type="number"
                                    value={propertyTax}
                                    onChange={(e) => setPropertyTax(e.target.value)}
                                    placeholder="Enter property tax"
                                    min="0"
                                    max="5000"
                                    step="10"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="insurance" className={`${theme.textColors.primary}`}>
                                Monthly Home Insurance
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="insurance"
                                    type="number"
                                    value={insurance}
                                    onChange={(e) => setInsurance(e.target.value)}
                                    placeholder="Enter insurance"
                                    min="0"
                                    max="2000"
                                    step="10"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="pmi" className={`${theme.textColors.primary}`}>
                                Monthly PMI (if applicable)
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="pmi"
                                    type="number"
                                    value={pmi}
                                    onChange={(e) => setPmi(e.target.value)}
                                    placeholder="Enter PMI"
                                    min="0"
                                    max="1000"
                                    step="10"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                                Required if down payment is less than 20%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Affordability Status */}
                {result && (
                    <div className={`border rounded-lg p-4 ${
                        result.affordabilityRatio <= 28 
                            ? `${theme.status.success.bg} ${theme.status.success.border}` 
                            : result.affordabilityRatio <= 36
                            ? `${theme.status.warning.bg} ${theme.status.warning.border}`
                            : `${theme.status.error.bg} ${theme.status.error.border}`
                    }`}>
                        <div className="flex items-center mb-3">
                            {result.affordabilityRatio <= 28 ? (
                                <CheckCircle className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                            ) : (
                                <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
                            )}
                            <h4 className={`font-semibold ${theme.textColors.primary}`}>Affordability Analysis</h4>
                        </div>
                        
                        <p className={`text-sm ${theme.textColors.secondary}`}>
                            {result.affordabilityRatio <= 28 ? (
                                "✅ Excellent! Your housing payment is well within recommended limits."
                            ) : result.affordabilityRatio <= 36 ? (
                                "⚠️ Acceptable ratio, but consider if you have other debt obligations."
                            ) : (
                                "🚨 High ratio - consider a smaller home, larger down payment, or improving income."
                            )}
                        </p>
                    </div>
                )}
            </div>
        </CalculatorWrapper>
    );
}

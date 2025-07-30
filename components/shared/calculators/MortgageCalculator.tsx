'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { Calculator, Home, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface MortgageResult {
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    affordabilityRatio: number;
}

export default function MortgageCalculator() {
    const { recordCalculatorUsage } = useProgressStore();

    // Form inputs
    const [homePrice, setHomePrice] = useState<string>('400000');
    const [downPayment, setDownPayment] = useState<string>('80000');
    const [interestRate, setInterestRate] = useState<string>('6.5');
    const [loanTerm, setLoanTerm] = useState<string>('30');
    const [monthlyIncome, setMonthlyIncome] = useState<string>('8000');
    const [propertyTax, setPropertyTax] = useState<string>('500');
    const [insurance, setInsurance] = useState<string>('200');
    const [pmi, setPmi] = useState<string>('150');

    const [result, setResult] = useState<MortgageResult | null>(null);

    // Record calculator usage
    useEffect(() => {
        recordCalculatorUsage('mortgage-calculator');
    }, [recordCalculatorUsage]);

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

    const downPaymentPercent = ((parseFloat(downPayment) || 0) / (parseFloat(homePrice) || 1)) * 100;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Calculator className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Mortgage Details</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Home Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={homePrice}
                                        onChange={(e) => setHomePrice(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="400,000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Down Payment
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={downPayment}
                                        onChange={(e) => setDownPayment(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="80,000"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {downPaymentPercent.toFixed(1)}% of home price
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Interest Rate
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(e.target.value)}
                                        className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="6.5"
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loan Term
                                </label>
                                <select
                                    value={loanTerm}
                                    onChange={(e) => setLoanTerm(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="15">15 years</option>
                                    <option value="30">30 years</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Costs */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Monthly Costs</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Tax (monthly)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={propertyTax}
                                        onChange={(e) => setPropertyTax(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Home Insurance (monthly)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={insurance}
                                        onChange={(e) => setInsurance(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="200"
                                    />
                                </div>
                            </div>

                            {downPaymentPercent < 20 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PMI (Private Mortgage Insurance)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={pmi}
                                            onChange={(e) => setPmi(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="150"
                                        />
                                    </div>
                                    <p className="text-sm text-yellow-600 mt-1">
                                        Required when down payment is less than 20%
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monthly Income (for affordability)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={monthlyIncome}
                                        onChange={(e) => setMonthlyIncome(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="8,000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {result && (
                        <>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Home className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Breakdown</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                        <span className="font-medium text-gray-700">Total Monthly Payment</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${result.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Total Interest Over Life of Loan</span>
                                        <span className="font-semibold text-gray-800">
                                            ${result.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">Total Cost of Home</span>
                                        <span className="font-semibold text-gray-800">
                                            ${result.totalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Affordability Analysis */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                    <h3 className="text-lg font-semibold text-gray-800">Affordability Analysis</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg border-2 ${result.affordabilityRatio <= 28
                                            ? 'border-green-200 bg-green-50'
                                            : result.affordabilityRatio <= 36
                                                ? 'border-yellow-200 bg-yellow-50'
                                                : 'border-red-200 bg-red-50'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {result.affordabilityRatio <= 28 ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                            )}
                                            <span className="font-medium">
                                                Housing Payment Ratio: {result.affordabilityRatio.toFixed(1)}%
                                            </span>
                                        </div>
                                        <p className={`text-sm ${result.affordabilityRatio <= 28
                                                ? 'text-green-700'
                                                : result.affordabilityRatio <= 36
                                                    ? 'text-yellow-700'
                                                    : 'text-red-700'
                                            }`}>
                                            {result.affordabilityRatio <= 28
                                                ? 'Excellent! Well within recommended limits.'
                                                : result.affordabilityRatio <= 36
                                                    ? 'Acceptable, but consider reducing other debts.'
                                                    : 'Above recommended limits. Consider a less expensive home.'}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>• Ideal: Housing costs ≤ 28% of gross income</p>
                                        <p>• Maximum: Housing costs ≤ 36% of gross income</p>
                                        <p>• This includes principal, interest, taxes, and insurance</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Smart Home Buying Tips</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>• Aim for 20% down payment to avoid PMI</p>
                                    <p>• Get pre-approved before house hunting</p>
                                    <p>• Factor in maintenance costs (1-3% of home value annually)</p>
                                    <p>• Consider all monthly expenses, not just mortgage payment</p>
                                    <p>• Shop around for the best interest rates</p>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

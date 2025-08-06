'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import type { ProgressStore } from '@/lib/store/progressStore';

interface ValidationError {
    field: string;
    message: string;
}

interface InputValidation {
    isValid: boolean;
    errors: ValidationError[];
}

interface NegotiationAnalysis {
    currentSalary: number;
    requestedSalary: number;
    increaseAmount: number;
    increasePercentage: number;
    lifetimeImpact: number;
    confidenceScore: number;
}

export default function SalaryNegotiationCalculator() {
    const [currentSalary, setCurrentSalary] = useState<string>('');
    const [targetSalary, setTargetSalary] = useState<string>('');
    const [yearsOfService, setYearsOfService] = useState<string>('');
    const [marketResearch, setMarketResearch] = useState<boolean>(false);
    const [analysis, setAnalysis] = useState<NegotiationAnalysis | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    const recordCalculatorUsage = useProgressStore((state: ProgressStore) => state.recordCalculatorUsage);

    useEffect(() => {
        // Track calculator usage when component mounts
        recordCalculatorUsage('salary-negotiation-calculator');
    }, [recordCalculatorUsage]);

    // Safe parsing function with validation
    const safeParseFloat = (value: string, fieldName: string, min: number = 0): number => {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < min) {
            const error: ValidationError = {
                field: fieldName,
                message: `Please enter a valid number${min > 0 ? ` (minimum: $${min.toLocaleString()})` : ''}`
            };
            setValidationErrors(prev => [
                ...prev.filter(e => e.field !== fieldName),
                error
            ]);
            return 0;
        }
        
        // Clear error if validation passes
        setValidationErrors(prev => prev.filter(e => e.field !== fieldName));
        return parsed;
    };

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case 'currentSalary':
                setCurrentSalary(value);
                if (value) safeParseFloat(value, field, 20000);
                break;
            case 'targetSalary':
                setTargetSalary(value);
                if (value) safeParseFloat(value, field, 20000);
                break;
            case 'yearsOfService':
                setYearsOfService(value);
                if (value) safeParseFloat(value, field, 0);
                break;
        }
    };

    const calculateNegotiation = () => {
        const current = safeParseFloat(currentSalary, 'currentSalary', 20000);
        const target = safeParseFloat(targetSalary, 'targetSalary', 20000);
        const years = safeParseFloat(yearsOfService, 'yearsOfService', 0);

        if (current <= 0 || target <= 0) return;

        const increaseAmount = target - current;
        const increasePercentage = (increaseAmount / current) * 100;
        const lifetimeImpact = increaseAmount * 30; // Rough 30-year career estimate

        // Simple confidence scoring based on various factors
        let confidenceScore = 50;
        if (increasePercentage <= 10) confidenceScore += 20;
        if (increasePercentage <= 5) confidenceScore += 10;
        if (years >= 1) confidenceScore += 10;
        if (marketResearch) confidenceScore += 10;

        setAnalysis({
            currentSalary: current,
            requestedSalary: target,
            increaseAmount,
            increasePercentage,
            lifetimeImpact,
            confidenceScore: Math.min(confidenceScore, 100)
        });
    };

    return (
        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6 max-w-2xl mx-auto`}>
            <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <TrendingUp className={`w-6 h-6 ${theme.status.success.text}`} />
                Salary Negotiation Calculator
            </h2>
            <p className={`${theme.textColors.secondary} mb-6`}>
                Plan your salary negotiation with data-driven insights and confidence scoring
            </p>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
                <div>
                    <label htmlFor="currentSalary" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                        Current Annual Salary
                    </label>
                    <div className="relative">
                        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`} aria-hidden="true">$</span>
                        <input
                            type="number"
                            id="currentSalary"
                            value={currentSalary}
                            onChange={(e) => handleInputChange('currentSalary', e.target.value)}
                            placeholder="65000"
                            className={`pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                                validationErrors.some(e => e.field === 'currentSalary') 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : `${theme.borderColors.primary} focus:ring-emerald-500`
                            }`}
                            aria-describedby="currentSalary-help currentSalary-error"
                            {...(validationErrors.some(e => e.field === 'currentSalary') ? { "aria-invalid": "true" } : {})}
                            min="20000"
                            step="1000"
                        />
                    </div>
                    {validationErrors.some(e => e.field === 'currentSalary') && (
                        <p id="currentSalary-error" className="text-red-400 text-sm mt-1" role="alert">
                            {validationErrors.find(e => e.field === 'currentSalary')?.message}
                        </p>
                    )}
                    <p id="currentSalary-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                        Your current annual salary before any proposed increase
                    </p>
                </div>

                <div>
                    <label htmlFor="targetSalary" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                        Target Annual Salary
                    </label>
                    <div className="relative">
                        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`} aria-hidden="true">$</span>
                        <input
                            type="number"
                            id="targetSalary"
                            value={targetSalary}
                            onChange={(e) => handleInputChange('targetSalary', e.target.value)}
                            placeholder="75000"
                            className={`pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                                validationErrors.some(e => e.field === 'targetSalary') 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : `${theme.borderColors.primary} focus:ring-emerald-500`
                            }`}
                            aria-describedby="targetSalary-help targetSalary-error"
                            {...(validationErrors.some(e => e.field === 'targetSalary') ? { "aria-invalid": "true" } : {})}
                            min="20000"
                            step="1000"
                        />
                    </div>
                    {validationErrors.some(e => e.field === 'targetSalary') && (
                        <p id="targetSalary-error" className="text-red-400 text-sm mt-1" role="alert">
                            {validationErrors.find(e => e.field === 'targetSalary')?.message}
                        </p>
                    )}
                    <p id="targetSalary-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                        The salary amount you want to negotiate for
                    </p>
                </div>

                <div>
                    <label htmlFor="yearsOfService" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                        Years in Current Role
                    </label>
                    <input
                        type="number"
                        id="yearsOfService"
                        value={yearsOfService}
                        onChange={(e) => handleInputChange('yearsOfService', e.target.value)}
                        placeholder="2"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-all ${
                            validationErrors.some(e => e.field === 'yearsOfService') 
                                ? 'border-red-500 focus:ring-red-500' 
                                : `${theme.borderColors.primary} focus:ring-emerald-500`
                        }`}
                        aria-describedby="yearsOfService-help yearsOfService-error"
                        {...(validationErrors.some(e => e.field === 'yearsOfService') ? { "aria-invalid": "true" } : {})}
                        min="0"
                        max="50"
                        step="0.5"
                    />
                    {validationErrors.some(e => e.field === 'yearsOfService') && (
                        <p id="yearsOfService-error" className="text-red-400 text-sm mt-1" role="alert">
                            {validationErrors.find(e => e.field === 'yearsOfService')?.message}
                        </p>
                    )}
                    <p id="yearsOfService-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                        How long you&apos;ve been in your current position (strengthens negotiation)
                    </p>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="marketResearch"
                        checked={marketResearch}
                        onChange={(e) => setMarketResearch(e.target.checked)}
                        className={`mr-3 h-4 w-4 ${theme.status.success.text} focus:ring-emerald-500 ${theme.borderColors.primary} rounded`}
                    />
                    <label htmlFor="marketResearch" className={`text-sm ${theme.textColors.primary}`}>
                        I have researched market rates for my position
                    </label>
                </div>

                <button
                    onClick={calculateNegotiation}
                    className={`w-full ${theme.status.success.bg}0 ${theme.textColors.primary} py-3 px-4 rounded-md hover:${theme.status.success.bg.replace("/20", "/80")} transition-colors font-semibold`}
                >
                    Calculate Negotiation Strategy
                </button>
            </div>

            {/* Results Section */}
            {analysis && (
                <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                        <Target className={`w-5 h-5 ${theme.status.success.text}`} />
                        Your Negotiation Analysis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Salary Increase</h4>
                            <p className={`${theme.typography.heading2} ${theme.status.success.text}`}>
                                ${analysis.increaseAmount.toLocaleString()}
                            </p>
                            <p className={`text-sm ${theme.textColors.secondary}`}>
                                {analysis.increasePercentage.toFixed(1)}% increase
                            </p>
                        </div>

                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Lifetime Impact</h4>
                            <p className={`${theme.typography.heading2} ${theme.textColors.primary}`}>
                                ${analysis.lifetimeImpact.toLocaleString()}
                            </p>
                            <p className={`text-sm ${theme.textColors.secondary}`}>
                                Additional career earnings
                            </p>
                        </div>
                    </div>

                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4 mb-4`}>
                        <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Confidence Score</h4>
                        <div className="flex items-center gap-3">
                            <div className={`flex-1 ${theme.backgrounds.cardDisabled} rounded-full h-3`}>
                                <div
                                    className={`h-3 rounded-full ${
                                        analysis.confidenceScore >= 70
                                            ? theme.status.success.bg.replace("/20", "")
                                            : analysis.confidenceScore >= 50
                                                ? theme.status.warning.bg.replace("/20", "")
                                                : theme.status.error.bg.replace("/20", "")
                                    } w-[${analysis.confidenceScore}%]`}
                                ></div>
                            </div>
                            <span className={`font-semibold ${theme.textColors.primary}`}>
                                {analysis.confidenceScore}%
                            </span>
                        </div>
                    </div>

                    <div className={`${theme.status.info.bg} rounded-lg p-4`}>
                        <h4 className={`font-medium ${theme.status.info.text} mb-2`}>💡 Negotiation Tips</h4>
                        <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                            {analysis.increasePercentage > 15 && (
                                <li>• Your request is above 15% - consider a phased approach over 2 years</li>
                            )}
                            {analysis.increasePercentage <= 10 && (
                                <li>• Your request is reasonable - highlight your achievements and market data</li>
                            )}
                            {!marketResearch && (
                                <li>• Research salary data from Glassdoor, PayScale, or industry reports</li>
                            )}
                            <li>• Schedule the conversation at the right time (after successful projects)</li>
                            <li>• Focus on value you bring, not personal financial needs</li>
                            <li>• Be prepared to negotiate other benefits if salary is fixed</li>
                        </ul>
                    </div>
                </div>
            )}

            <div className={`mt-6 p-4 ${theme.status.warning.bg} rounded-lg`}>
                <h4 className={`font-medium ${theme.status.warning.text} mb-2`}>📈 Remember</h4>
                <p className={`text-sm ${theme.status.warning.text}`}>
                    Salary negotiations compound over your entire career. A successful negotiation today impacts every future salary, promotion, and even retirement savings. Don&apos;t leave money on the table!
                </p>
            </div>
        </div>
    );
}

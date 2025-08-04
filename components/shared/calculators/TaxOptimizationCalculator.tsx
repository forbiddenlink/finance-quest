'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { Calculator, TrendingUp, Percent, PieChart, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { theme } from '@/lib/theme';

const stateTaxRates: Record<string, number> = {
  'CA': 0.133, 'NY': 0.109, 'NJ': 0.1075, 'HI': 0.11, 'OR': 0.099,
  'MN': 0.0985, 'DC': 0.095, 'IA': 0.0898, 'VT': 0.0895, 'WI': 0.0765,
  'ME': 0.075, 'MA': 0.05, 'CT': 0.0699, 'RI': 0.0599, 'DE': 0.066,
  'MD': 0.0575, 'VA': 0.0575, 'NC': 0.05, 'SC': 0.07, 'GA': 0.0575,
  'AL': 0.05, 'MS': 0.05, 'LA': 0.06, 'AR': 0.066, 'MO': 0.054,
  'KS': 0.057, 'OK': 0.05, 'NE': 0.0684, 'ND': 0.029, 'SD': 0,
  'MT': 0.0675, 'ID': 0.0625, 'UT': 0.0495, 'CO': 0.0455, 'AZ': 0.025,
  'NM': 0.049, 'OH': 0.0399, 'IN': 0.0323, 'IL': 0.0495, 'MI': 0.0425,
  'KY': 0.05, 'TN': 0.01, 'WV': 0.065, 'PA': 0.0307, 'NH': 0.05,
  'FL': 0, 'TX': 0, 'WA': 0, 'NV': 0, 'WY': 0, 'AK': 0
};

const federalTaxBrackets2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 }
];

interface TaxResults {
  currentTax: {
    federal: number;
    state: number;
    total: number;
    marginalRate: number;
    effectiveRate: number;
  };
  capitalGainsLoss: {
    netGains: number;
    taxSavings: number;
    lossCarryforward: number;
  };
  municipalBonds: {
    taxEquivalentYield: number;
    advantage: number;
  };
  rothConversion: {
    conversionTax: number;
    potentialSavings: number;
    breakEvenYears: number;
  };
  stateOptimization: {
    annualSavings: number;
    bestState: string;
    recommendation: string;
  };
  totalOptimizationPotential: number;
}

export default function TaxOptimizationCalculator() {
    // Form inputs
    const [income, setIncome] = useState('100000');
    const [currentState, setCurrentState] = useState('CA');
    const [capitalGains, setCapitalGains] = useState('10000');
    const [capitalLosses, setCapitalLosses] = useState('5000');
    const [municipalBondYield, setMunicipalBondYield] = useState('3.5');
    const [rothConversion, setRothConversion] = useState('25000');
    const [deductions, setDeductions] = useState('13850'); // 2024 standard deduction
    const [filingStatus, setFilingStatus] = useState('single');

    const [results, setResults] = useState<TaxResults | null>(null);

    const calculateFederalTax = (taxableIncome: number): number => {
        let tax = 0;
        let remainingIncome = Math.max(0, taxableIncome);

        for (const bracket of federalTaxBrackets2024) {
            if (remainingIncome <= 0) break;
            
            const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
            tax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }

        return tax;
    };

    const getMarginalTaxRate = (taxableIncome: number): number => {
        for (const bracket of federalTaxBrackets2024) {
            if (taxableIncome <= bracket.max) {
                return bracket.rate;
            }
        }
        return federalTaxBrackets2024[federalTaxBrackets2024.length - 1].rate;
    };

    const calculateOptimizations = useCallback(() => {
        const grossIncome = parseFloat(income) || 0;
        const deductionAmount = parseFloat(deductions) || 13850;
        const taxableIncome = Math.max(0, grossIncome - deductionAmount);
        const gains = parseFloat(capitalGains) || 0;
        const losses = parseFloat(capitalLosses) || 0;
        const muniBondYield = parseFloat(municipalBondYield) || 0;
        const rothAmount = parseFloat(rothConversion) || 0;

        // Current tax calculation
        const federalTax = calculateFederalTax(taxableIncome);
        const stateTax = taxableIncome * (stateTaxRates[currentState] || 0);
        const totalTax = federalTax + stateTax;
        const marginalRate = getMarginalTaxRate(taxableIncome) + (stateTaxRates[currentState] || 0);
        const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

        // Capital gains/loss optimization
        const netGains = Math.max(0, gains - losses);
        const lossCarryforward = Math.max(0, losses - gains - 3000); // $3k annual limit
        const taxSavings = Math.min(losses, gains + 3000) * marginalRate;

        // Municipal bond analysis
        const taxEquivalentYield = muniBondYield / (1 - marginalRate) * 100;
        const corporateBondYield = 4.5; // Assume comparable corporate bond yield
        const advantage = taxEquivalentYield - corporateBondYield;

        // Roth conversion analysis
        const conversionTax = rothAmount * marginalRate;
        const assumedRetirementRate = 0.22; // Lower tax bracket in retirement
        const potentialSavings = rothAmount * (marginalRate - assumedRetirementRate);
        const breakEvenYears = potentialSavings > 0 ? conversionTax / (rothAmount * 0.07 * (marginalRate - assumedRetirementRate)) : 0;

        // State optimization
        const bestNoTaxState = 'FL'; // Popular choice
        const annualSavings = stateTax;
        
        const recommendation = annualSavings > 10000 ? 
            `Consider relocating to ${bestNoTaxState} for significant savings` :
            'Current state tax burden is manageable';

        // Total optimization potential
        const totalOptimization = taxSavings + Math.max(0, advantage * 10000) + Math.max(0, potentialSavings) + annualSavings * 0.1;

        setResults({
            currentTax: {
                federal: federalTax,
                state: stateTax,
                total: totalTax,
                marginalRate: marginalRate * 100,
                effectiveRate
            },
            capitalGainsLoss: {
                netGains,
                taxSavings,
                lossCarryforward
            },
            municipalBonds: {
                taxEquivalentYield,
                advantage
            },
            rothConversion: {
                conversionTax,
                potentialSavings,
                breakEvenYears
            },
            stateOptimization: {
                annualSavings,
                bestState: bestNoTaxState,
                recommendation
            },
            totalOptimizationPotential: totalOptimization
        });
    }, [income, currentState, capitalGains, capitalLosses, municipalBondYield, rothConversion, deductions]);

    useEffect(() => {
        calculateOptimizations();
    }, [calculateOptimizations]);

    const handleReset = () => {
        setIncome('100000');
        setCurrentState('CA');
        setCapitalGains('10000');
        setCapitalLosses('5000');
        setMunicipalBondYield('3.5');
        setRothConversion('25000');
        setDeductions('13850');
        setFilingStatus('single');
    };

    // Calculator metadata
    const metadata = {
        id: 'tax-optimization-calculator',
        title: 'Tax Optimization Calculator',
        description: 'Analyze your tax situation and discover optimization strategies',
        category: 'advanced' as const,
        icon: Calculator,
        tags: ['taxes', 'optimization', 'planning', 'deductions', 'strategies'],
        educationalNotes: [
            {
                title: 'Tax Optimization Strategies',
                content: 'Tax optimization involves legal strategies to minimize your tax burden. Key areas include capital gains harvesting, tax-loss harvesting, retirement account optimization, and strategic state residency planning.',
                tips: [
                    'Harvest tax losses annually to offset gains',
                    'Consider Roth conversions during low-income years',
                    'Maximize pre-tax retirement contributions in high-income years',
                    'Time capital gains realizations strategically'
                ]
            },
            {
                title: 'Advanced Tax Planning',
                content: 'Advanced strategies include municipal bond investing for high earners, asset location optimization, and charitable giving strategies. Always consult a tax professional for personalized advice.',
                tips: [
                    'Municipal bonds may be tax-free at federal and state levels',
                    'Consider the total tax burden, not just federal rates',
                    'State residency changes require careful planning',
                    'Document all tax optimization strategies for compliance'
                ]
            }
        ]
    };

    // Results formatting
    const taxResults = results ? {
        primary: {
            label: 'Total Annual Tax Savings Potential',
            value: results.totalOptimizationPotential,
            format: 'currency' as const
        },
        secondary: [
            {
                label: 'Current Total Tax',
                value: results.currentTax.total,
                format: 'currency' as const
            },
            {
                label: 'Effective Tax Rate',
                value: results.currentTax.effectiveRate / 100,
                format: 'percentage' as const
            },
            {
                label: 'Marginal Tax Rate',
                value: results.currentTax.marginalRate / 100,
                format: 'percentage' as const
            },
            {
                label: 'State Tax Savings Potential',
                value: results.stateOptimization.annualSavings,
                format: 'currency' as const
            }
        ]
    } : undefined;

    return (
        <CalculatorWrapper
            metadata={metadata}
            results={taxResults}
            onReset={handleReset}
        >
            <div className="space-y-6">
                {/* Income & Filing Details */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Income & Filing Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="income" className={`${theme.textColors.primary}`}>
                                Annual Gross Income
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="income"
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    placeholder="Enter annual income"
                                    min="0"
                                    max="10000000"
                                    step="1000"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="deductions" className={`${theme.textColors.primary}`}>
                                Total Deductions
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="deductions"
                                    type="number"
                                    value={deductions}
                                    onChange={(e) => setDeductions(e.target.value)}
                                    placeholder="Enter total deductions"
                                    min="0"
                                    max="500000"
                                    step="100"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                            <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                                2024 Standard: $13,850 (Single), $27,700 (Married Filing Jointly)
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="currentState" className={`${theme.textColors.primary}`}>
                                Current State
                            </Label>
                            <select
                                id="currentState"
                                value={currentState}
                                onChange={(e) => setCurrentState(e.target.value)}
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            >
                                {Object.entries(stateTaxRates).map(([state, rate]) => (
                                    <option key={state} value={state}>
                                        {state} ({(rate * 100).toFixed(1)}% tax rate)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="filingStatus" className={`${theme.textColors.primary}`}>
                                Filing Status
                            </Label>
                            <select
                                id="filingStatus"
                                value={filingStatus}
                                onChange={(e) => setFilingStatus(e.target.value)}
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            >
                                <option value="single">Single</option>
                                <option value="marriedJoint">Married Filing Jointly</option>
                                <option value="marriedSeparate">Married Filing Separately</option>
                                <option value="headOfHousehold">Head of Household</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Investment & Optimization Inputs */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Investment & Optimization Scenarios</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="capitalGains" className={`${theme.textColors.primary}`}>
                                Capital Gains This Year
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="capitalGains"
                                    type="number"
                                    value={capitalGains}
                                    onChange={(e) => setCapitalGains(e.target.value)}
                                    placeholder="Enter capital gains"
                                    min="0"
                                    max="1000000"
                                    step="1000"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="capitalLosses" className={`${theme.textColors.primary}`}>
                                Capital Losses Available
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="capitalLosses"
                                    type="number"
                                    value={capitalLosses}
                                    onChange={(e) => setCapitalLosses(e.target.value)}
                                    placeholder="Enter capital losses"
                                    min="0"
                                    max="1000000"
                                    step="1000"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="municipalBondYield" className={`${theme.textColors.primary}`}>
                                Municipal Bond Yield (%)
                            </Label>
                            <input
                                id="municipalBondYield"
                                type="number"
                                value={municipalBondYield}
                                onChange={(e) => setMunicipalBondYield(e.target.value)}
                                placeholder="Enter muni bond yield"
                                min="0"
                                max="10"
                                step="0.1"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="rothConversion" className={`${theme.textColors.primary}`}>
                                Potential Roth Conversion
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="rothConversion"
                                    type="number"
                                    value={rothConversion}
                                    onChange={(e) => setRothConversion(e.target.value)}
                                    placeholder="Enter conversion amount"
                                    min="0"
                                    max="500000"
                                    step="5000"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optimization Analysis */}
                {results && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tax Loss Harvesting */}
                        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <div className="flex items-center mb-4">
                                <TrendingUp className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                                <h5 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>Tax Loss Harvesting</h5>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className={`${theme.textColors.secondary}`}>Tax Savings:</span>
                                    <span className={`${theme.textColors.primary} font-semibold`}>
                                        ${results.capitalGainsLoss.taxSavings.toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={`${theme.textColors.secondary}`}>Loss Carryforward:</span>
                                    <span className={`${theme.textColors.primary} font-semibold`}>
                                        ${results.capitalGainsLoss.lossCarryforward.toFixed(0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Municipal Bonds */}
                        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <div className="flex items-center mb-4">
                                <Percent className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                                <h5 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>Municipal Bond Analysis</h5>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className={`${theme.textColors.secondary}`}>Tax-Equivalent Yield:</span>
                                    <span className={`${theme.textColors.primary} font-semibold`}>
                                        {results.municipalBonds.taxEquivalentYield.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={`${theme.textColors.secondary}`}>Advantage:</span>
                                    <span className={`${results.municipalBonds.advantage > 0 ? theme.status.success.text : theme.status.error.text} font-semibold`}>
                                        {results.municipalBonds.advantage.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Roth Conversion */}
                        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <div className="flex items-center mb-4">
                                <PieChart className={`w-5 h-5 ${theme.status.warning.text} mr-2`} />
                                <h5 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>Roth Conversion</h5>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className={`${theme.textColors.secondary}`}>Conversion Tax:</span>
                                    <span className={`${theme.textColors.primary} font-semibold`}>
                                        ${results.rothConversion.conversionTax.toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={`${theme.textColors.secondary}`}>Break-even:</span>
                                    <span className={`${theme.textColors.primary} font-semibold`}>
                                        {results.rothConversion.breakEvenYears.toFixed(1)} years
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* State Optimization */}
                        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <div className="flex items-center mb-4">
                                <MapPin className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                                <h5 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>State Tax Optimization</h5>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className={`${theme.textColors.secondary}`}>Annual Savings:</span>
                                    <span className={`${theme.textColors.primary} font-semibold`}>
                                        ${results.stateOptimization.annualSavings.toFixed(0)}
                                    </span>
                                </div>
                                <p className={`text-sm ${theme.textColors.secondary}`}>
                                    {results.stateOptimization.recommendation}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorWrapper>
    );
}

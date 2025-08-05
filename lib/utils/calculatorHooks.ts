/**
 * Calculator hooks for Finance Quest
 * Provides custom React hooks for financial calculations with state management
 */

import React, { useState, useCallback, useMemo } from 'react';

// Common interfaces
export interface ValidationError {
    [field: string]: string;
}

export interface CalculatorResult {
    isValid: boolean;
    errors: ValidationError;
}

// Emergency Fund Calculator
export interface EmergencyFundResult {
    targetAmount: number;
    currentProgress: number;
    monthsToGoal: number;
    timeToGoal: number;
    savingsRate: number;
    recommendations: string[];
}

export function useEmergencyFundCalculator() {
    const [values, setValues] = useState({
        monthlyExpenses: '',
        monthlyIncome: '',
        targetMonths: '6',
        currentSavings: '',
        monthlySavings: ''
    });

    const [errors, setErrors] = useState<ValidationError>({});

    const updateField = useCallback((field: string, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
        // Clear error when field is updated
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const results = useMemo((): EmergencyFundResult | null => {
        const monthlyExpenses = parseFloat(values.monthlyExpenses) || 0;
        const monthlyIncome = parseFloat(values.monthlyIncome) || 0;
        const targetMonths = parseInt(values.targetMonths) || 6;
        const currentSavings = parseFloat(values.currentSavings) || 0;
        const monthlySavings = parseFloat(values.monthlySavings) || 0;

        if (monthlyExpenses <= 0) return null;

        const targetAmount = monthlyExpenses * targetMonths;
        const currentProgress = (currentSavings / targetAmount) * 100;
        const remaining = Math.max(0, targetAmount - currentSavings);
        const monthsToGoal = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0;
        const timeToGoal = monthsToGoal; // Same as monthsToGoal for backward compatibility
        const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

        const recommendations: string[] = [];
        if (currentProgress < 25) {
            recommendations.push('Start with a $1,000 starter emergency fund');
        }
        if (currentProgress < 50) {
            recommendations.push('Consider increasing your monthly savings rate');
        }
        if (monthsToGoal > 24) {
            recommendations.push('Look for ways to reduce expenses or increase income');
        }

        return {
            targetAmount,
            currentProgress: Math.min(100, currentProgress),
            monthsToGoal,
            timeToGoal,
            savingsRate,
            recommendations
        };
    }, [values]);

    const reset = useCallback(() => {
        setValues({
            monthlyExpenses: '',
            monthlyIncome: '',
            targetMonths: '6',
            currentSavings: '',
            monthlySavings: ''
        });
        setErrors({});
    }, []);

    return {
        values,
        errors,
        results,
        updateField,
        reset
    };
}

// Budget Builder Calculator
export interface BudgetCategory {
    id: string;
    name: string;
    amount?: number;
    type: 'income' | 'need' | 'want' | 'savings';
    icon?: React.ElementType;
    budgeted?: number;
    actual?: number;
    color?: string;
}

export interface UseBudgetBuilderResult {
    categories: BudgetCategory[];
    totals: {
        income: number;
        needs: number;
        wants: number;
        savings: number;
    };
    ratios: {
        needs: number;
        wants: number;
        savings: number;
    };
    isBalanced: boolean;
    surplus: number;
}

export function useBudgetBuilderCalculator() {
    const [categories, setCategories] = useState<BudgetCategory[]>([]);

    const updateCategory = useCallback((id: string, amount: number) => {
        setCategories(prev =>
            prev.map(cat => cat.id === id ? { ...cat, amount } : cat)
        );
    }, []);

    const addCategory = useCallback((category: Omit<BudgetCategory, 'id'>) => {
        const newCategory = {
            ...category,
            id: Date.now().toString()
        };
        setCategories(prev => [...prev, newCategory]);
    }, []);

    const removeCategory = useCallback((id: string) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    }, []);

    const result = useMemo((): UseBudgetBuilderResult => {
        const totals = categories.reduce((acc, cat) => {
            const type = cat.type === 'need' ? 'needs' : cat.type === 'want' ? 'wants' : cat.type;
            if (type in acc) {
                acc[type as keyof typeof acc] += cat.amount || cat.budgeted || 0;
            }
            return acc;
        }, { income: 0, needs: 0, wants: 0, savings: 0 });

        const totalExpenses = totals.needs + totals.wants + totals.savings;
        const ratios = totals.income > 0 ? {
            needs: (totals.needs / totals.income) * 100,
            wants: (totals.wants / totals.income) * 100,
            savings: (totals.savings / totals.income) * 100
        } : { needs: 0, wants: 0, savings: 0 };

        const isBalanced = ratios.needs <= 50 && ratios.wants <= 30 && ratios.savings >= 20;
        const surplus = totals.income - totalExpenses;

        return {
            categories,
            totals,
            ratios,
            isBalanced,
            surplus
        };
    }, [categories]);

    const reset = useCallback(() => {
        setCategories([]);
    }, []);

    return {
        categories,
        result,
        updateCategory,
        addCategory,
        removeCategory,
        reset
    };
}

// Compound Interest Calculator
export interface CompoundInterestResult {
    finalAmount: number;
    totalContributions: number;
    totalInterest: number;
    monthlyData: Array<{
        month: number;
        principal: number;
        interest: number;
        total: number;
    }>;
}

export function useCompoundInterestCalculator() {
    const [values, setValues] = useState({
        principal: '',
        monthlyContribution: '',
        annualRate: '',
        years: '',
        compoundingFrequency: '12'
    });

    const [errors, setErrors] = useState<ValidationError>({});

    const updateValue = useCallback((field: string, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const result = useMemo((): CompoundInterestResult | null => {
        const principal = parseFloat(values.principal) || 0;
        const monthlyContribution = parseFloat(values.monthlyContribution) || 0;
        const annualRate = parseFloat(values.annualRate) || 0;
        const years = parseInt(values.years) || 0;

        if (principal <= 0 || years <= 0 || annualRate <= 0) return null;

        const monthlyRate = annualRate / 100 / 12;
        const totalMonths = years * 12;

        let currentPrincipal = principal;
        const monthlyData = [];

        for (let month = 1; month <= totalMonths; month++) {
            const interestEarned = currentPrincipal * monthlyRate;
            currentPrincipal += interestEarned + monthlyContribution;

            monthlyData.push({
                month,
                principal: principal + (monthlyContribution * month),
                interest: currentPrincipal - principal - (monthlyContribution * month),
                total: currentPrincipal
            });
        }

        const finalAmount = currentPrincipal;
        const totalContributions = principal + (monthlyContribution * totalMonths);
        const totalInterest = finalAmount - totalContributions;

        return {
            finalAmount,
            totalContributions,
            totalInterest,
            monthlyData
        };
    }, [values]);

    const reset = useCallback(() => {
        setValues({
            principal: '',
            monthlyContribution: '',
            annualRate: '',
            years: '',
            compoundingFrequency: '12'
        });
        setErrors({});
    }, []);

    return {
        values,
        errors,
        result,
        updateValue,
        reset
    };
}

// Stock Analysis Calculator (basic implementation)
export function useStockAnalysisCalculator() {
    const [values, setValues] = useState({
        currentPrice: '',
        targetPrice: '',
        pe: '',
        eps: '',
        dividendYield: '',
        marketCap: ''
    });

    const [errors, setErrors] = useState<ValidationError>({});

    const updateValue = useCallback((field: string, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
    }, []);

    const result = useMemo(() => {
        const currentPrice = parseFloat(values.currentPrice) || 0;
        const targetPrice = parseFloat(values.targetPrice) || 0;

        if (currentPrice <= 0) return null;

        const potentialReturn = targetPrice > 0 ? ((targetPrice - currentPrice) / currentPrice) * 100 : 0;

        return {
            potentialReturn,
            recommendation: potentialReturn > 10 ? 'BUY' : potentialReturn < -10 ? 'SELL' : 'HOLD'
        };
    }, [values]);

    const reset = useCallback(() => {
        setValues({
            currentPrice: '',
            targetPrice: '',
            pe: '',
            eps: '',
            dividendYield: '',
            marketCap: ''
        });
        setErrors({});
    }, []);

    return {
        values,
        errors,
        result,
        updateValue,
        reset
    };
}

// Business Calculator Hook
export interface BusinessCalculatorValues {
    fixedCosts: string;
    variableCostPerUnit: string;
    pricePerUnit: string;
    currentAssets: string;
    currentLiabilities: string;
    totalDebt: string;
    totalEquity: string;
    revenue: string;
    netIncome: string;
    monthlyRevenue: string;
    monthlyExpenses: string;
    initialCash: string;
    revenueGrowthRate: string;
    expenseGrowthRate: string;
}

export interface BusinessCalculatorResult {
    breakEvenUnits: number;
    breakEvenRevenue: number;
    contributionMargin: number;
    marginOfSafety: number;
    currentRatio: number;
    workingCapital: number;
    debtToEquityRatio: number;
    netProfitMargin: number;
    roe: number;
    roa: number;
    businessHealthScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    runwayMonths: number;
    burnRate: number;
    recommendations: string[];
    cashFlowProjection: Array<{
        month: number;
        revenue: number;
        expenses: number;
        netCashFlow: number;
        cumulativeCash: number;
    }>;
}

export function useBusinessCalculator() {
    const [values, setValues] = useState<BusinessCalculatorValues>({
        fixedCosts: '',
        variableCostPerUnit: '',
        pricePerUnit: '',
        currentAssets: '',
        currentLiabilities: '',
        totalDebt: '',
        totalEquity: '',
        revenue: '',
        netIncome: '',
        monthlyRevenue: '',
        monthlyExpenses: '',
        initialCash: '',
        revenueGrowthRate: '5',
        expenseGrowthRate: '3'
    });

    const [errors, setErrors] = useState<ValidationError>({});

    const updateField = useCallback((field: string, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const updateValue = useCallback((field: string, value: string) => {
        updateField(field, value);
    }, [updateField]);

    const reset = useCallback(() => {
        setValues({
            fixedCosts: '',
            variableCostPerUnit: '',
            pricePerUnit: '',
            currentAssets: '',
            currentLiabilities: '',
            totalDebt: '',
            totalEquity: '',
            revenue: '',
            netIncome: '',
            monthlyRevenue: '',
            monthlyExpenses: '',
            initialCash: '',
            revenueGrowthRate: '5',
            expenseGrowthRate: '3'
        });
        setErrors({});
    }, []);

    const result = useMemo((): BusinessCalculatorResult | null => {
        const fixedCosts = parseFloat(values.fixedCosts) || 0;
        const variableCostPerUnit = parseFloat(values.variableCostPerUnit) || 0;
        const pricePerUnit = parseFloat(values.pricePerUnit) || 0;
        const currentAssets = parseFloat(values.currentAssets) || 0;
        const currentLiabilities = parseFloat(values.currentLiabilities) || 0;
        const totalDebt = parseFloat(values.totalDebt) || 0;
        const totalEquity = parseFloat(values.totalEquity) || 0;
        const revenue = parseFloat(values.revenue) || 0;
        const netIncome = parseFloat(values.netIncome) || 0;
        const monthlyRevenue = parseFloat(values.monthlyRevenue) || 0;
        const monthlyExpenses = parseFloat(values.monthlyExpenses) || 0;
        const initialCash = parseFloat(values.initialCash) || 0;
        const revenueGrowthRate = parseFloat(values.revenueGrowthRate) || 5;
        const expenseGrowthRate = parseFloat(values.expenseGrowthRate) || 3;

        // Break-even analysis
        const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
        const breakEvenUnits = contributionMarginPerUnit > 0 ? fixedCosts / contributionMarginPerUnit : 0;
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;
        const contributionMargin = revenue > 0 ? ((revenue - (revenue * variableCostPerUnit / pricePerUnit)) / revenue) * 100 : 0;
        const marginOfSafety = revenue > breakEvenRevenue ? ((revenue - breakEvenRevenue) / revenue) * 100 : 0;

        // Financial ratios
        const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
        const workingCapital = currentAssets - currentLiabilities;
        const debtToEquityRatio = totalEquity > 0 ? totalDebt / totalEquity : 0;
        const netProfitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
        const totalAssets = currentAssets + totalEquity; // Simplified
        const roe = totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0;
        const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;

        // Cash flow analysis
        const burnRate = monthlyExpenses - monthlyRevenue;
        const runwayMonths = burnRate > 0 && initialCash > 0 ? initialCash / burnRate : Infinity;

        // Cash flow projection (12 months)
        const cashFlowProjection = [];
        let cumulativeCash = initialCash;

        for (let month = 1; month <= 12; month++) {
            const projectedRevenue = monthlyRevenue * Math.pow(1 + revenueGrowthRate / 100 / 12, month - 1);
            const projectedExpenses = monthlyExpenses * Math.pow(1 + expenseGrowthRate / 100 / 12, month - 1);
            const netCashFlow = projectedRevenue - projectedExpenses;
            cumulativeCash += netCashFlow;

            cashFlowProjection.push({
                month,
                revenue: projectedRevenue,
                expenses: projectedExpenses,
                netCashFlow,
                cumulativeCash
            });
        }

        // Business health score (0-100)
        let healthScore = 50; // Base score

        // Profitability factors
        if (netProfitMargin > 10) healthScore += 20;
        else if (netProfitMargin > 5) healthScore += 10;
        else if (netProfitMargin < 0) healthScore -= 15;

        // Liquidity factors
        if (currentRatio > 2) healthScore += 15;
        else if (currentRatio > 1) healthScore += 5;
        else if (currentRatio < 0.5) healthScore -= 20;

        // Leverage factors
        if (debtToEquityRatio < 0.3) healthScore += 10;
        else if (debtToEquityRatio > 1) healthScore -= 15;

        // Cash flow factors
        if (burnRate < 0) healthScore += 15; // Positive cash flow
        else if (runwayMonths < 6) healthScore -= 20;

        healthScore = Math.max(0, Math.min(100, healthScore));

        // Risk assessment
        let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
        if (healthScore >= 75) riskLevel = 'Low';
        else if (healthScore <= 40) riskLevel = 'High';

        // Recommendations
        const recommendations = [];
        if (currentRatio < 1) {
            recommendations.push('Improve liquidity by increasing current assets or reducing short-term liabilities');
        }
        if (debtToEquityRatio > 1) {
            recommendations.push('Consider reducing debt levels to improve financial stability');
        }
        if (burnRate > 0) {
            recommendations.push('Focus on increasing revenue or reducing expenses to achieve positive cash flow');
        }
        if (netProfitMargin < 5) {
            recommendations.push('Work on improving profit margins through cost optimization or pricing strategies');
        }
        if (runwayMonths < 12 && runwayMonths !== Infinity) {
            recommendations.push('Build cash reserves to ensure business sustainability');
        }

        return {
            breakEvenUnits,
            breakEvenRevenue,
            contributionMargin,
            marginOfSafety,
            currentRatio,
            workingCapital,
            debtToEquityRatio,
            netProfitMargin,
            roe,
            roa,
            businessHealthScore: healthScore,
            riskLevel,
            runwayMonths: runwayMonths === Infinity ? 999 : runwayMonths,
            burnRate,
            recommendations,
            cashFlowProjection
        };
    }, [values]);

    return {
        values,
        errors,
        result,
        updateField,
        updateValue,
        reset
    };
}

// Options Calculator Hook
export interface OptionsCalculatorValues {
    stockPrice: number;
    strikePrice: number;
    strikePrice2: number;
    premium: number;
    daysToExpiration: number;
    impliedVolatility: number;
    riskFreeRate: number;
    dividendYield: number;
    numberOfContracts: number;
    optionType: 'call' | 'put';
    strategy: 'buy' | 'sell';
    strategyType: string;
}

export interface OptionsCalculatorResult {
    breakEvenPrice: number;
    maxProfit: number;
    maxLoss: number;
    probabilityOfProfit: number;
    intrinsicValue: number;
    timeValue: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
}

export function useOptionsCalculator() {
    const [values, setValues] = useState<OptionsCalculatorValues>({
        stockPrice: 100,
        strikePrice: 105,
        strikePrice2: 110,
        premium: 3.50,
        daysToExpiration: 30,
        impliedVolatility: 25,
        riskFreeRate: 5,
        dividendYield: 0,
        numberOfContracts: 1,
        optionType: 'call',
        strategy: 'buy',
        strategyType: 'long_call'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = useCallback((field: keyof OptionsCalculatorValues, value: string | number) => {
        setValues(prev => ({ ...prev, [field]: value }));

        // Clear error when field is updated
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);

    const validateInputs = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (values.stockPrice <= 0) newErrors.stockPrice = 'Stock price must be positive';
        if (values.strikePrice <= 0) newErrors.strikePrice = 'Strike price must be positive';
        if (values.premium < 0) newErrors.premium = 'Premium cannot be negative';
        if (values.daysToExpiration <= 0) newErrors.daysToExpiration = 'Days to expiration must be positive';
        if (values.impliedVolatility < 0) newErrors.impliedVolatility = 'Implied volatility cannot be negative';
        if (values.riskFreeRate < 0) newErrors.riskFreeRate = 'Risk-free rate cannot be negative';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [values]);

    // Black-Scholes option pricing calculations
    const calculateBlackScholes = useCallback(() => {
        const { stockPrice: S, strikePrice: K, daysToExpiration, impliedVolatility: IV, riskFreeRate: r } = values;
        const T = daysToExpiration / 365; // Time to expiration in years
        const sigma = IV / 100; // Convert percentage to decimal
        const rDecimal = r / 100; // Convert percentage to decimal

        if (T <= 0) return null;

        // Black-Scholes calculations
        const d1 = (Math.log(S / K) + (rDecimal + (sigma ** 2) / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);

        // Standard normal CDF approximation
        const normCDF = (x: number) => {
            return 0.5 * (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI)));
        };

        const Nd1 = normCDF(d1);
        const Nd2 = normCDF(d2);
        const Nmd1 = normCDF(-d1);
        const Nmd2 = normCDF(-d2);

        // Call and Put prices
        const callPrice = S * Nd1 - K * Math.exp(-rDecimal * T) * Nd2;
        const putPrice = K * Math.exp(-rDecimal * T) * Nmd2 - S * Nmd1;

        // Greeks calculations
        const delta = values.optionType === 'call' ? Nd1 : -Nmd1;
        const gamma = Math.exp(-d1 * d1 / 2) / (S * sigma * Math.sqrt(2 * Math.PI * T));
        const theta = values.optionType === 'call'
            ? -(S * Math.exp(-d1 * d1 / 2) * sigma) / (2 * Math.sqrt(2 * Math.PI * T)) - rDecimal * K * Math.exp(-rDecimal * T) * Nd2
            : -(S * Math.exp(-d1 * d1 / 2) * sigma) / (2 * Math.sqrt(2 * Math.PI * T)) + rDecimal * K * Math.exp(-rDecimal * T) * Nmd2;
        const vega = S * Math.sqrt(T) * Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI);
        const rho = values.optionType === 'call'
            ? K * T * Math.exp(-rDecimal * T) * Nd2
            : -K * T * Math.exp(-rDecimal * T) * Nmd2;

        const theoreticalPrice = values.optionType === 'call' ? callPrice : putPrice;
        const intrinsicValue = values.optionType === 'call'
            ? Math.max(0, S - K)
            : Math.max(0, K - S);
        const timeValue = theoreticalPrice - intrinsicValue;

        return {
            theoreticalPrice,
            intrinsicValue,
            timeValue,
            delta,
            gamma,
            theta: theta / 365, // Daily theta
            vega: vega / 100, // Vega per 1% volatility change
            rho: rho / 100 // Rho per 1% rate change
        };
    }, [values]);

    const result = useMemo((): OptionsCalculatorResult | null => {
        if (!validateInputs()) return null;

        const blackScholesResult = calculateBlackScholes();
        if (!blackScholesResult) return null;

        const { strikePrice, premium, optionType, strategy } = values;

        // Calculate strategy-specific metrics
        const isLong = strategy === 'buy';

        let breakEvenPrice: number;
        let maxProfit: number;
        let maxLoss: number;

        if (optionType === 'call') {
            if (isLong) {
                breakEvenPrice = strikePrice + premium;
                maxProfit = Infinity; // Unlimited for long calls
                maxLoss = premium;
            } else {
                breakEvenPrice = strikePrice + premium;
                maxProfit = premium;
                maxLoss = Infinity; // Unlimited for short calls
            }
        } else { // put
            if (isLong) {
                breakEvenPrice = strikePrice - premium;
                maxProfit = strikePrice - premium; // Max when stock goes to 0
                maxLoss = premium;
            } else {
                breakEvenPrice = strikePrice - premium;
                maxProfit = premium;
                maxLoss = strikePrice - premium; // Max when stock goes to 0
            }
        }

        // Simple probability of profit estimate based on delta
        const probabilityOfProfit = Math.abs(blackScholesResult.delta) * 100;

        return {
            breakEvenPrice,
            maxProfit: maxProfit === Infinity ? Infinity : maxProfit,
            maxLoss: maxLoss === Infinity ? Infinity : maxLoss,
            probabilityOfProfit,
            intrinsicValue: blackScholesResult.intrinsicValue,
            timeValue: blackScholesResult.timeValue,
            delta: blackScholesResult.delta,
            gamma: blackScholesResult.gamma,
            theta: blackScholesResult.theta,
            vega: blackScholesResult.vega,
            rho: blackScholesResult.rho
        };
    }, [values, validateInputs, calculateBlackScholes]);

    const reset = useCallback(() => {
        setValues({
            stockPrice: 100,
            strikePrice: 105,
            strikePrice2: 110,
            premium: 3.50,
            daysToExpiration: 30,
            impliedVolatility: 25,
            riskFreeRate: 5,
            dividendYield: 0,
            numberOfContracts: 1,
            optionType: 'call',
            strategy: 'buy',
            strategyType: 'long_call'
        });
        setErrors({});
    }, []);

    return {
        values,
        result,
        validation: validateInputs,
        isValid: Object.keys(errors).length === 0,
        updateField,
        reset,
        errors
    };
}

export function useRetirementCalculator() {
    return {
        values: {},
        errors: {},
        result: null,
        updateValue: () => { },
        reset: () => { }
    };
}

export function useMortgageCalculator() {
    // Mock result object that matches component expectations
    const mockResult = {
        loanAmount: 0,
        monthlyPayment: 0,
        monthlyInterestRate: 0,
        totalInterest: 0,
        totalCost: 0
    };

    return {
        values: {
            homePrice: '',
            downPayment: '',
            interestRate: '',
            termYears: ''
        },
        errors: {
            homePrice: '',
            downPayment: '',
            interestRate: '',
            termYears: ''
        },
        result: mockResult,
        updateValue: (field: string, value: string) => { 
            console.log(`Updating ${field} to ${value}`);
        },
        reset: () => { 
            console.log('Resetting calculator');
        }
    };
}

export interface TaxOptimizerResult {
    taxOwed: number;
    currentTaxes: number;
    optimizedTaxes: number;
    taxSavings: number;
    marginalRate: number;
    effectiveRate: number;
    optimizedRate: number;
    standardDeduction: number;
    itemizedDeductions: number;
    takeHomeIncome: number;
    optimizedTakeHome: number;
    recommendations: string[];
    strategies: Array<{
        name: string;
        savings: number;
        potentialSavings: number;
        description: string;
        difficulty: string;
        category: string;
    }>;
    taxBracketAnalysis: Array<{
        bracket: string;
        rate: number;
        min: number;
        max: number;
        taxableAmount: number;
        taxableIncome: number;
        taxOwed: number;
        taxes: number;
    }>;
}

export function useTaxOptimizerCalculator() {
    const [values, setValues] = useState({
        income: '',
        filingStatus: 'single',
        deductions: '',
        retirementContributions: '',
        state: 'none',
        currentDeductions: '',
        retirement401k: '',
        retirementIra: '',
        hsaContribution: '',
        charitableDonations: '',
        mortgageInterest: '',
        stateLocalTaxes: '',
        businessExpenses: '',
        childTaxCredit: '',
        educationCredits: ''
    });

    const [errors, setErrors] = useState<ValidationError>({});

    const updateValue = useCallback((field: string, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const updateFilingStatus = useCallback((status: string) => {
        setValues(prev => ({ ...prev, filingStatus: status }));
    }, []);

    const result = useMemo((): TaxOptimizerResult | null => {
        const income = parseFloat(values.income) || 0;
        const deductions = parseFloat(values.deductions) || 0;
        const retirementContributions = parseFloat(values.retirementContributions) || 0;

        if (income <= 0) return null;

        // 2024 tax brackets for single filers
        const taxBrackets = [
            { rate: 0.10, min: 0, max: 11000 },
            { rate: 0.12, min: 11000, max: 44725 },
            { rate: 0.22, min: 44725, max: 95375 },
            { rate: 0.24, min: 95375, max: 182050 },
            { rate: 0.32, min: 182050, max: 231250 },
            { rate: 0.35, min: 231250, max: 578125 },
            { rate: 0.37, min: 578125, max: Infinity }
        ];

        const standardDeduction = values.filingStatus === 'married' ? 27700 : 13850;
        const itemizedDeductions = deductions;
        const effectiveDeduction = Math.max(standardDeduction, itemizedDeductions);

        const adjustedIncome = Math.max(0, income - retirementContributions);
        const taxableIncome = Math.max(0, adjustedIncome - effectiveDeduction);

        // Calculate tax owed
        let taxOwed = 0;
        let marginalRate = 0;
        const taxBracketAnalysis = [];

        for (const bracket of taxBrackets) {
            if (taxableIncome > bracket.min) {
                const taxableAtThisBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
                const taxAtThisBracket = taxableAtThisBracket * bracket.rate;
                taxOwed += taxAtThisBracket;
                marginalRate = bracket.rate;

                taxBracketAnalysis.push({
                    bracket: `${(bracket.rate * 100).toFixed(0)}%`,
                    rate: bracket.rate,
                    min: bracket.min,
                    max: bracket.max,
                    taxableAmount: taxableAtThisBracket,
                    taxableIncome: taxableAtThisBracket,
                    taxOwed: taxAtThisBracket,
                    taxes: taxAtThisBracket
                });
            }
        }

        const effectiveRate = taxOwed / income;
        const takeHomeIncome = income - taxOwed;
        const currentTaxes = taxOwed;

        // Calculate optimized scenario
        const maxRetirement = Math.min(23000, income * 0.2); // Simplified 401k limit
        const optimizedTaxableIncome = Math.max(0, income - maxRetirement - effectiveDeduction);

        let optimizedTaxOwed = 0;
        for (const bracket of taxBrackets) {
            if (optimizedTaxableIncome > bracket.min) {
                const taxableAtThisBracket = Math.min(optimizedTaxableIncome - bracket.min, bracket.max - bracket.min);
                optimizedTaxOwed += taxableAtThisBracket * bracket.rate;
            }
        }

        const optimizedTakeHome = income - optimizedTaxOwed;
        const optimizedTaxes = optimizedTaxOwed;
        const taxSavings = taxOwed - optimizedTaxOwed;
        const optimizedRate = optimizedTaxOwed / income;

        const recommendations = [];
        const strategies = [];

        if (retirementContributions < maxRetirement) {
            const additionalContribution = maxRetirement - retirementContributions;
            const savingsAmount = additionalContribution * marginalRate;
            recommendations.push(`Consider increasing retirement contributions by $${additionalContribution.toLocaleString()}`);
            strategies.push({
                name: 'Maximize 401(k) Contributions',
                savings: savingsAmount,
                potentialSavings: savingsAmount,
                description: 'Reduce taxable income through pre-tax retirement savings',
                difficulty: 'Easy',
                category: 'Retirement'
            });
        }

        if (itemizedDeductions < standardDeduction) {
            recommendations.push('You\'re better off taking the standard deduction');
        }

        if (marginalRate >= 0.22) {
            const savingsAmount = income * 0.02 * marginalRate;
            recommendations.push('Consider tax-loss harvesting for investment accounts');
            strategies.push({
                name: 'Tax-Loss Harvesting',
                savings: savingsAmount,
                potentialSavings: savingsAmount,
                description: 'Offset capital gains with capital losses',
                difficulty: 'Medium',
                category: 'Investment'
            });
        }

        return {
            taxOwed,
            currentTaxes,
            optimizedTaxes,
            taxSavings,
            marginalRate,
            effectiveRate,
            optimizedRate,
            standardDeduction,
            itemizedDeductions,
            takeHomeIncome,
            optimizedTakeHome,
            recommendations,
            strategies,
            taxBracketAnalysis
        };
    }, [values]);

    const isValid = useMemo(() => {
        return parseFloat(values.income) > 0;
    }, [values]);

    const reset = useCallback(() => {
        setValues({
            income: '',
            filingStatus: 'single',
            deductions: '',
            retirementContributions: '',
            state: 'none',
            currentDeductions: '',
            retirement401k: '',
            retirementIra: '',
            hsaContribution: '',
            charitableDonations: '',
            mortgageInterest: '',
            stateLocalTaxes: '',
            businessExpenses: '',
            childTaxCredit: '',
            educationCredits: ''
        });
        setErrors({});
    }, []);

    return {
        values,
        errors,
        result,
        isValid,
        updateValue,
        updateFilingStatus,
        reset
    };
}

export function useBondCalculator() {
    const [values, setValues] = useState({
        faceValue: '',
        couponRate: '',
        yearsToMaturity: '',
        marketRate: '',
        currentPrice: '',
        paymentFrequency: '2'
    });

    const [errors, setErrors] = useState<ValidationError>({});

    const updateField = useCallback((field: string, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const results = useMemo(() => {
        const faceValue = parseFloat(values.faceValue) || 0;
        const couponRate = parseFloat(values.couponRate) || 0;
        const yearsToMaturity = parseInt(values.yearsToMaturity) || 0;
        const marketRate = parseFloat(values.marketRate) || 0;
        const currentPrice = parseFloat(values.currentPrice) || 0;

        if (faceValue <= 0 || yearsToMaturity <= 0) return null;

        const annualCoupon = (faceValue * couponRate) / 100;
        const presentValue = faceValue / Math.pow(1 + marketRate / 100, yearsToMaturity);
        const couponPresentValue = annualCoupon * ((1 - Math.pow(1 + marketRate / 100, -yearsToMaturity)) / (marketRate / 100));
        const bondPrice = presentValue + couponPresentValue;

        // Calculate additional properties expected by the component
        const currentYield = currentPrice > 0 ? (annualCoupon / currentPrice) * 100 : 0;
        const annualIncome = annualCoupon;
        const totalReturn = (annualCoupon * yearsToMaturity) + (faceValue - (currentPrice || bondPrice));
        const yieldToMaturity = marketRate;
        const interestRateSensitivity = yearsToMaturity; // Duration approximation for interest rate sensitivity

        return {
            bondPrice,
            annualCoupon,
            yieldToMaturity,
            duration: yearsToMaturity,
            currentYield,
            annualIncome,
            totalReturn,
            interestRateSensitivity
        };
    }, [values]);

    const reset = useCallback(() => {
        setValues({
            faceValue: '',
            couponRate: '',
            yearsToMaturity: '',
            marketRate: '',
            currentPrice: '',
            paymentFrequency: '2'
        });
        setErrors({});
    }, []);

    return {
        values,
        errors,
        results,
        updateField,
        reset
    };
}

export function useBusinessValuationCalculator() {
    return {
        values: {},
        errors: {},
        result: null,
        updateValue: () => { },
        reset: () => { }
    };
}

export function useCryptocurrencyAllocationCalculator() {
    // Mock result object that matches component expectations
    const mockResult = {
        totalCryptoValue: 0,
        riskLevel: 'Moderate' as const,
        expectedReturn: 0,
        diversificationScore: 0,
        riskScore: 0,
        correlationScore: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        totalAllocation: 0,
        allocationValid: true,
        cryptoAssets: [] as Array<{
            name: string;
            allocation: number;
            value: number;
            color: string;
            riskLevel: string;
            category: string;
            volatility: number;
            expectedReturn: number;
        }>,
        recommendations: [] as Array<{
            title: string;
            description: string;
            priority: string;
            impact: string;
        }>
    };

    return {
        values: {
            totalPortfolio: '',
            cryptoPercentage: '',
            investmentHorizon: '',
            riskTolerance: 'moderate',
            rebalanceFrequency: 'quarterly',
            bitcoin: '',
            ethereum: '',
            altcoins: '',
            defi: '',
            stablecoins: ''
        },
        errors: {
            totalPortfolio: '',
            cryptoPercentage: '',
            investmentHorizon: '',
            riskTolerance: '',
            rebalanceFrequency: '',
            bitcoin: '',
            ethereum: '',
            altcoins: '',
            defi: '',
            stablecoins: ''
        },
        result: mockResult,
        updateValue: (field: string, value: string) => { 
            console.log(`Updating ${field} to ${value}`);
        },
        updateRiskTolerance: (value: string) => { 
            console.log(`Updating risk tolerance to ${value}`);
        },
        updateRebalanceFrequency: (value: string) => { 
            console.log(`Updating rebalance frequency to ${value}`);
        },
        autoBalance: () => { 
            console.log('Auto-balancing portfolio');
        },
        reset: () => { 
            console.log('Resetting calculator');
        }
    };
}

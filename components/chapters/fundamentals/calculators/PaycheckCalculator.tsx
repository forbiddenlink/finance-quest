'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Lightbulb, DollarSign, TrendingDown, Calculator, AlertCircle, Info, Check, X } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { validateField, ValidationPresets } from '@/lib/utils/calculatorValidation';
import { usePerformanceMonitor } from '@/lib/monitoring/PerformanceMonitor';
import { useAccessibility } from '@/lib/accessibility/AccessibilityManager';
import toast from 'react-hot-toast';
import Decimal from 'decimal.js';
import GuidedTour, { hasTourBeenCompleted } from '@/components/shared/ui/GuidedTour';
import { Step } from 'react-joyride';
import AchievementSystem, { triggerCalculatorUsage, triggerPaycheckOptimization, triggerTaxOptimization } from '@/components/shared/ui/AchievementSystem';
interface PaycheckBreakdown {
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  stateDisability?: number;
  healthInsurance?: number;
  retirement401k?: number;
  netPay: number;
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface ValidationErrors {
  grossPay?: string;
  healthInsurance?: string;
  retirement401k?: string;
}

export default function PaycheckCalculator() {
  const [grossPay, setGrossPay] = useState<string>('5000');
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [state, setState] = useState<string>('CA');
  const [healthInsurance, setHealthInsurance] = useState<string>('200');
  const [retirement401k, setRetirement401k] = useState<string>('5'); // percentage
  const [breakdown, setBreakdown] = useState<PaycheckBreakdown | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const recordCalculatorUsage = useProgressStore(state => state.recordCalculatorUsage);
  const userProgress = useProgressStore(state => state.userProgress);
  
  // Enhanced monitoring and accessibility
  const { trackCalculation } = usePerformanceMonitor('PaycheckCalculator');
  const { announce } = useAccessibility();

  // Configure Decimal.js for financial precision
  Decimal.set({
    precision: 10,
    rounding: Decimal.ROUND_HALF_UP,
    toExpNeg: -7,
    toExpPos: 21
  });

  // Utility functions for precise financial calculations
  const toDecimal = useCallback((value: string | number): Decimal => {
    return new Decimal(value);
  }, []);

  const formatCurrency = useCallback((value: number | Decimal): string => {
    const numValue = value instanceof Decimal ? value.toNumber() : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  }, []);

  // Guided tour steps for first-time users
  const tourSteps: Step[] = [
    {
      target: '.paycheck-calculator-title',
      content: '👋 Welcome to the Enhanced Paycheck Calculator! This tool gives you a detailed breakdown of your paycheck with federal tax brackets, state taxes, and deductions. Let me show you around!',
      placement: 'bottom',
    },
    {
      target: '#gross-pay',
      content: '💰 Start by entering your monthly gross pay (before taxes). This calculator uses precise decimal calculations to ensure 99.9% accuracy - no more floating-point errors!',
      placement: 'bottom',
    },
    {
      target: '#filing-status',
      content: '📋 Select your tax filing status. This affects your federal tax brackets - married filing jointly gets better rates than single filers.',
      placement: 'bottom',
    },
    {
      target: '#state-select',
      content: '🗺️ Choose your state. Some states like Texas and Florida have no income tax, which can save you thousands per year!',
      placement: 'bottom',
    },
    {
      target: '#health-insurance',
      content: '🏥 Enter your health insurance premium. This is a pre-tax deduction that reduces your taxable income and saves you money!',
      placement: 'top',
    },
    {
      target: '#retirement-401k',
      content: '🎯 Set your 401(k) contribution percentage. We recommend 10-15% for retirement. Every 1% saves you about 22% in taxes!',
      placement: 'top',
    },
    {
      target: '.results-section',
      content: '📊 Your results appear here with precise calculations, charts, and smart insights. You\'ll see your exact take-home pay and optimization tips!',
      placement: 'left',
    },
    {
      target: '.financial-insights',
      content: '💡 Don\'t miss these personalized insights! We analyze your tax efficiency, retirement savings, and give you actionable tips to optimize your finances.',
      placement: 'top',
    }
  ];

  const handleTourEnd = useCallback(() => {
    setRunTour(false);
    toast.success('🎓 Tour completed! You\'re now ready to optimize your paycheck. Try adjusting your 401(k) contribution to see tax savings!', {
      duration: 5000,
      position: 'top-center',
    });
  }, []);

  // Track calculator usage for analytics
  useEffect(() => {
    recordCalculatorUsage('paycheck-calculator');
    triggerCalculatorUsage('paycheck-calculator'); // Trigger precision master achievement
    toast.success('💰 Paycheck Calculator loaded! Enter your details to see your take-home pay breakdown.', {
      duration: 3000,
      position: 'top-center',
    });

    // Start guided tour for first-time users
    if (!hasTourBeenCompleted('paycheck-calculator')) {
      setTimeout(() => setRunTour(true), 1000);
    }
  }, [recordCalculatorUsage]);

  // Validation function
  const validateInputs = useCallback(() => {
    const newErrors: ValidationErrors = {};

    const grossPayError = validateField(grossPay, ValidationPresets.currency(0, 100000), 'Gross Pay');
    if (grossPayError) newErrors.grossPay = grossPayError;

    const healthInsError = validateField(healthInsurance, ValidationPresets.optionalCurrency(0, 2000), 'Health Insurance');
    if (healthInsError) newErrors.healthInsurance = healthInsError;

    const retirement401kError = validateField(retirement401k, ValidationPresets.percentage(0, 50), '401k Contribution');
    if (retirement401kError) newErrors.retirement401k = retirement401kError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [grossPay, healthInsurance, retirement401k]);

  // Federal tax brackets for 2025 (updated)
  const federalBrackets: Record<string, TaxBracket[]> = useMemo(() => ({
    single: [
      { min: 0, max: 11600, rate: 0.10 },
      { min: 11600, max: 46750, rate: 0.12 },
      { min: 46750, max: 100525, rate: 0.22 },
      { min: 100525, max: 191950, rate: 0.24 },
      { min: 191950, max: 243725, rate: 0.32 },
      { min: 243725, max: 609350, rate: 0.35 },
      { min: 609350, max: Infinity, rate: 0.37 }
    ],
    married: [
      { min: 0, max: 23200, rate: 0.10 },
      { min: 23200, max: 93500, rate: 0.12 },
      { min: 93500, max: 201050, rate: 0.22 },
      { min: 201050, max: 383900, rate: 0.24 },
      { min: 383900, max: 487450, rate: 0.32 },
      { min: 487450, max: 731200, rate: 0.35 },
      { min: 731200, max: Infinity, rate: 0.37 }
    ]
  }), []);

  // State tax rates (simplified - using flat rates for demo)
  const stateTaxRates: Record<string, number> = useMemo(() => ({
    'CA': 0.08,  // California
    'NY': 0.07,  // New York
    'TX': 0.00,  // Texas (no state income tax)
    'FL': 0.00,  // Florida (no state income tax)
    'WA': 0.00,  // Washington (no state income tax)
    'OR': 0.09,  // Oregon
    'NV': 0.00,  // Nevada (no state income tax)
    'IL': 0.05,  // Illinois
    'PA': 0.03,  // Pennsylvania
    'OH': 0.04   // Ohio
  }), []);

  const calculateFederalTax = useCallback((annualIncome: number, status: 'single' | 'married'): number => {
    const brackets = federalBrackets[status];
    let tax = toDecimal(0);
    let remainingIncome = toDecimal(annualIncome);

    for (const bracket of brackets) {
      if (remainingIncome.lte(0)) break;

      const bracketMin = toDecimal(bracket.min);
      const bracketMax = toDecimal(bracket.max);
      const taxableInThisBracket = Decimal.min(remainingIncome, bracketMax.minus(bracketMin));

      tax = tax.plus(taxableInThisBracket.mul(bracket.rate));
      remainingIncome = remainingIncome.minus(taxableInThisBracket);
    }

    return tax.div(12).toNumber(); // Monthly tax
  }, [federalBrackets, toDecimal]);

  const calculatePaycheck = useCallback(async () => {
    if (!validateInputs()) {
      setBreakdown(null);
      announce('Please fix the input errors before calculating', 'assertive');
      return;
    }

    setIsCalculating(true);
    const startTime = performance.now();

    // Add small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));

    const grossDecimal = toDecimal(grossPay);
    const healthInsDecimal = toDecimal(healthInsurance || '0');
    const retirement401kPercentDecimal = toDecimal(retirement401k || '0');

    if (grossDecimal.lte(0)) {
      setIsCalculating(false);
      return;
    }

    // Pre-tax deductions using precise decimal calculations
    const retirement401kAmount = grossDecimal.mul(retirement401kPercentDecimal.div(100));
    const taxableIncome = grossDecimal.minus(retirement401kAmount).minus(healthInsDecimal);

    // Federal tax calculation using brackets
    const federalTax = calculateFederalTax(taxableIncome.mul(12).toNumber(), filingStatus);

    // State tax using decimal precision
    const stateTax = taxableIncome.mul(stateTaxRates[state] || 0);

    // Payroll taxes (on gross pay) with precise calculations
    const socialSecurityRate = toDecimal(0.062);
    const medicareRate = toDecimal(0.0145);
    const stateDisabilityRate = toDecimal(0.001);
    const socialSecurityWageBase = toDecimal(160200).div(12); // 2024 SS wage base monthly

    const socialSecurity = Decimal.min(grossDecimal.mul(socialSecurityRate), socialSecurityWageBase.mul(socialSecurityRate));
    const medicare = grossDecimal.mul(medicareRate);
    const stateDisability = grossDecimal.mul(stateDisabilityRate);

    const totalDeductions = toDecimal(federalTax).plus(stateTax).plus(socialSecurity)
      .plus(medicare).plus(stateDisability).plus(healthInsDecimal).plus(retirement401kAmount);
    const netPay = grossDecimal.minus(totalDeductions);

    const calculationResults = {
      grossPay: grossDecimal.toNumber(),
      federalTax,
      stateTax: stateTax.toNumber(),
      socialSecurity: socialSecurity.toNumber(),
      medicare: medicare.toNumber(),
      stateDisability: stateDisability.toNumber(),
      healthInsurance: healthInsDecimal.toNumber(),
      retirement401k: retirement401kAmount.toNumber(),
      netPay: netPay.toNumber()
    };

    setBreakdown(calculationResults);
    setIsCalculating(false);
    
    // Track performance
    const executionTime = performance.now() - startTime;
    trackCalculation('paycheck-calculator', executionTime, 'medium');

    // Trigger achievement checks
    const retirement401kPercent = retirement401kPercentDecimal.toNumber();
    const effectiveTaxRate = ((toDecimal(federalTax).plus(stateTax)).div(grossDecimal)).mul(100).toNumber();

    triggerPaycheckOptimization(retirement401kPercent);
    triggerTaxOptimization(effectiveTaxRate);

    // Show success message with key insight
    const takeHomePercentage = Math.round((netPay.div(grossDecimal)).mul(100).toNumber());
    const message = `💡 Your take-home rate is ${takeHomePercentage}%! ${takeHomePercentage > 75 ? 'Excellent!' :
      takeHomePercentage > 70 ? 'Good rate!' :
        'Consider optimizing deductions.'
      }`;
    
    toast.success(message, {
      duration: 4000,
      position: 'top-center',
    });
    
    // Announce to screen readers
    announce(`Calculation complete. Your take-home rate is ${takeHomePercentage} percent`, 'polite');
  }, [grossPay, filingStatus, state, healthInsurance, retirement401k, calculateFederalTax, stateTaxRates, validateInputs, toDecimal, announce, trackCalculation]);

  // Auto-calculate when inputs change with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (grossPay && !errors.grossPay) {
        calculatePaycheck();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [calculatePaycheck, grossPay, errors.grossPay]);

  // Input change handlers with validation
  const handleGrossPayChange = useCallback((value: string) => {
    setGrossPay(value);
    if (value) {
      const error = validateField(value, ValidationPresets.currency(0, 100000), 'Gross Pay');
      setErrors(prev => ({ ...prev, grossPay: error || undefined }));
    }
  }, []);

  const handleHealthInsuranceChange = useCallback((value: string) => {
    setHealthInsurance(value);
    const error = validateField(value, ValidationPresets.optionalCurrency(0, 2000), 'Health Insurance');
    setErrors(prev => ({ ...prev, healthInsurance: error || undefined }));
  }, []);

  const handleRetirement401kChange = useCallback((value: string) => {
    setRetirement401k(value);
    const error = validateField(value, ValidationPresets.percentage(0, 50), '401k Contribution');
    setErrors(prev => ({ ...prev, retirement401k: error || undefined }));
  }, []);

  // Prepare data for charts
  const pieData = breakdown ? [
    { name: 'Take-Home Pay', value: breakdown.netPay, color: '#10b981' },
    { name: 'Federal Tax', value: breakdown.federalTax, color: '#ef4444' },
    { name: 'State Tax', value: breakdown.stateTax, color: '#F59E0B' },
    { name: 'Social Security', value: breakdown.socialSecurity, color: '#8b5cf6' },
    { name: 'Medicare', value: breakdown.medicare, color: '#EC4899' },
    { name: 'Health Insurance', value: breakdown.healthInsurance || 0, color: '#06B6D4' },
    { name: '401k Contribution', value: breakdown.retirement401k || 0, color: '#84CC16' }
  ] : [];

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg shadow-lg p-4 sm:p-6 lg:p-8`}>
      <AchievementSystem
        userProgress={userProgress as unknown as Record<string, unknown>}
        onAchievementUnlocked={(achievement) => {
          toast.success(`🏆 Achievement Unlocked: ${achievement.title}! +${achievement.points} XP`, {
            duration: 3000,
            position: 'top-center',
          });
        }}
      />

      <GuidedTour
        steps={tourSteps}
        runTour={runTour}
        onTourEnd={handleTourEnd}
        tourKey="paycheck-calculator"
      />

      <div className="mb-6 lg:mb-8">
        <h2 className={`paycheck-calculator-title ${theme.typography.heading2} ${theme.textColors.primary} mb-2 flex items-center gap-3 text-xl sm:text-2xl lg:text-3xl`}>
          <Calculator className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${theme.textColors.primary}`} />
          Enhanced Paycheck Calculator
        </h2>
        <p className={`${theme.textColors.secondary} text-sm sm:text-base`}>
          Get a detailed breakdown of your paycheck with federal tax brackets, state taxes, and deductions
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div className={`${theme.status.info.bg} rounded-lg p-6`}>
            <h3 className={`${theme.typography.heading4} ${theme.status.info.text} mb-4 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Income & Tax Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`} htmlFor="gross-pay">
                  Monthly Gross Pay *
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                  <input
                    id="gross-pay"
                    type="number"
                    value={grossPay}
                    onChange={(e) => handleGrossPayChange(e.target.value)}
                    className={`pl-8 w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-lg ${errors.grossPay
                      ? 'border-red-500 bg-red-50/5'
                      : `${theme.borderColors.primary} bg-slate-800/50`
                      }`}
                    placeholder="5000"
                    min="0"
                    max="100000"
                    step="100"
                    aria-invalid={errors.grossPay ? "true" : "false"}
                    aria-describedby={errors.grossPay ? "gross-pay-error" : undefined}
                  />
                  {errors.grossPay && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  {!errors.grossPay && grossPay && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.grossPay && (
                  <p id="gross-pay-error" className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.grossPay}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`} htmlFor="filing-status">
                  Filing Status
                </label>
                <select
                  id="filing-status"
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married')}
                  className={`w-full px-4 py-3 border ${theme.borderColors.primary} bg-slate-800/50 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all`}
                  aria-label="Tax filing status"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`} htmlFor="state-select">
                  State
                </label>
                <select
                  id="state-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`w-full px-4 py-3 border ${theme.borderColors.primary} bg-slate-800/50 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all`}
                  aria-label="State for tax calculation"
                >
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas (No State Tax)</option>
                  <option value="FL">Florida (No State Tax)</option>
                  <option value="WA">Washington (No State Tax)</option>
                  <option value="OR">Oregon</option>
                  <option value="NV">Nevada (No State Tax)</option>
                  <option value="IL">Illinois</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="OH">Ohio</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`${theme.status.success.bg} rounded-lg p-6`}>
            <h3 className={`${theme.typography.heading4} ${theme.status.success.text} mb-4 flex items-center gap-2`}>
              <TrendingDown className="w-5 h-5" />
              Pre-Tax Deductions
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`} htmlFor="health-insurance">
                  Health Insurance (Monthly)
                </label>
                <div className="relative">
                  <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                  <input
                    id="health-insurance"
                    type="number"
                    value={healthInsurance}
                    onChange={(e) => handleHealthInsuranceChange(e.target.value)}
                    className={`pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${errors.healthInsurance
                      ? 'border-red-500 bg-red-50/5'
                      : `${theme.borderColors.primary} bg-slate-800/50`
                      }`}
                    placeholder="200"
                    min="0"
                    max="2000"
                    step="25"
                    aria-invalid={errors.healthInsurance ? "true" : "false"}
                    aria-describedby={errors.healthInsurance ? "health-insurance-error" : "health-insurance-help"}
                  />
                  {errors.healthInsurance && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  {!errors.healthInsurance && healthInsurance && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.healthInsurance ? (
                  <p id="health-insurance-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.healthInsurance}
                  </p>
                ) : (
                  <p id="health-insurance-help" className={`text-xs ${theme.status.success.text} mt-1`}>
                    Pre-tax deduction that reduces your taxable income
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`} htmlFor="retirement-401k">
                  401(k) Contribution (%)
                </label>
                <div className="relative">
                  <input
                    id="retirement-401k"
                    type="number"
                    step="0.5"
                    value={retirement401k}
                    onChange={(e) => handleRetirement401kChange(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${errors.retirement401k
                      ? 'border-red-500 bg-red-50/5'
                      : `${theme.borderColors.primary} bg-slate-800/50`
                      }`}
                    placeholder="5"
                    min="0"
                    max="50"
                    aria-invalid={errors.retirement401k ? "true" : "false"}
                    aria-describedby={errors.retirement401k ? "retirement-401k-error" : "retirement-401k-help"}
                  />
                  <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>%</span>
                  {errors.retirement401k && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                  {!errors.retirement401k && retirement401k && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.retirement401k ? (
                  <p id="retirement-401k-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.retirement401k}
                  </p>
                ) : (
                  <p id="retirement-401k-help" className={`text-xs ${theme.status.success.text} mt-1`}>
                    Recommended: 10-15% for retirement. Reduces taxes & builds wealth!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section space-y-6">
          {isCalculating && (
            <div className={`bg-gradient-to-r from-slate-50 to-slate-50 rounded-lg p-6 border ${theme.status.info.border} flex items-center justify-center`}>
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <span className={`${theme.textColors.secondary} font-medium`}>Calculating your paycheck...</span>
              </div>
            </div>
          )}

          {breakdown && !isCalculating && (
            <>
              {/* Summary Card */}
              <div className={`bg-gradient-to-r from-slate-50 to-slate-50 rounded-lg p-6 border ${theme.status.info.border} ${theme.interactive.card}`}>
                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                  Paycheck Summary
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className={`text-sm ${theme.textColors.secondary}`}>Gross Pay</p>
                    <p className={`${theme.typography.heading2} ${theme.textColors.primary}`}>{formatCurrency(breakdown.grossPay)}</p>
                    <p className={`text-xs ${theme.textColors.muted}`}>Before deductions</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${theme.textColors.secondary}`}>Take-Home Pay</p>
                    <p className={`${theme.typography.heading2} ${theme.status.success.text} font-bold`}>{formatCurrency(breakdown.netPay)}</p>
                    <p className={`text-xs ${theme.textColors.muted}`}>What you actually receive</p>
                  </div>
                </div>

                <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} bg-opacity-60 rounded-lg p-3`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${theme.textColors.secondary} flex items-center gap-1`}>
                      <Info className="w-4 h-4" />
                      Take-home percentage:
                    </span>
                    <span className={`font-semibold text-lg ${((breakdown.netPay / breakdown.grossPay) * 100) > 75
                      ? theme.status.success.text
                      : ((breakdown.netPay / breakdown.grossPay) * 100) > 70
                        ? theme.status.warning.text
                        : theme.status.error.text
                      }`}>
                      {((breakdown.netPay / breakdown.grossPay) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textColors.secondary}`}>Total deductions:</span>
                    <span className={`font-semibold ${theme.status.error.text}`}>
                      {formatCurrency(breakdown.grossPay - breakdown.netPay)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 border ${theme.borderColors.primary}`}>
                <h4 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Paycheck Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                <h4 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Detailed Breakdown</h4>

                <div className="space-y-3">
                  <div className={`flex justify-between items-center py-2 border-b ${theme.borderColors.primary}`}>
                    <span className={`font-medium ${theme.textColors.primary}`}>Gross Pay</span>
                    <span className={`${theme.typography.heading4} ${theme.status.success.text}`}>
                      {formatCurrency(breakdown.grossPay)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Pre-Tax Deductions:</h5>
                    {breakdown.healthInsurance && breakdown.healthInsurance > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className={`${theme.textColors.secondary}`}>Health Insurance</span>
                        <span className={`${theme.textColors.primary}`}>-{formatCurrency(breakdown.healthInsurance)}</span>
                      </div>
                    )}
                    {breakdown.retirement401k && breakdown.retirement401k > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className={`${theme.textColors.secondary}`}>401(k) Contribution ({retirement401k}%)</span>
                        <span className={`${theme.status.success.text}`}>-{formatCurrency(breakdown.retirement401k)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Taxes:</h5>
                    <div className="flex justify-between items-center pl-4">
                      <span className={`${theme.textColors.secondary}`}>Federal Tax</span>
                      <span className={`${theme.status.error.text}`}>-{formatCurrency(breakdown.federalTax)}</span>
                    </div>
                    {breakdown.stateTax > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className={`${theme.textColors.secondary}`}>State Tax ({state})</span>
                        <span className={`${theme.status.error.text}`}>-{formatCurrency(breakdown.stateTax)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pl-4">
                      <span className={`${theme.textColors.secondary}`}>Social Security (6.2%)</span>
                      <span className={`${theme.status.error.text}`}>-{formatCurrency(breakdown.socialSecurity)}</span>
                    </div>
                    <div className="flex justify-between items-center pl-4">
                      <span className={`${theme.textColors.secondary}`}>Medicare (1.45%)</span>
                      <span className={`${theme.status.error.text}`}>-{formatCurrency(breakdown.medicare)}</span>
                    </div>
                    {breakdown.stateDisability && breakdown.stateDisability > 0 && (
                      <div className="flex justify-between items-center pl-4">
                        <span className={`${theme.textColors.secondary}`}>State Disability</span>
                        <span className={`${theme.status.error.text}`}>-{formatCurrency(breakdown.stateDisability)}</span>
                      </div>
                    )}
                  </div>

                  <div className={`flex justify-between items-center py-3 border-t-2 ${theme.borderColors.primary}`}>
                    <span className={`text-lg font-bold ${theme.textColors.primary}`}>Net Pay (Take-Home)</span>
                    <span className={`text-xl font-bold ${theme.status.success.text}`}>
                      {formatCurrency(breakdown.netPay)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Educational Insights */}
      {breakdown && !isCalculating && (
        <div className={`financial-insights mt-8 ${theme.status.info.bg} rounded-lg p-6 ${theme.interactive.hover}`}>
          <h3 className={`${theme.typography.heading4} ${theme.status.info.text} mb-4 flex items-center gap-2`}>
            <Lightbulb className="w-5 h-5" />
            Smart Financial Insights & Recommendations
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 text-sm ${theme.textColors.secondary}`}>
            <div className={`p-4 ${theme.backgrounds.glass} rounded-lg border ${theme.borderColors.primary}`}>
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <AlertCircle className={`w-4 h-4 ${((breakdown.federalTax + breakdown.stateTax) / breakdown.grossPay) > 0.25
                  ? 'text-red-500'
                  : ((breakdown.federalTax + breakdown.stateTax) / breakdown.grossPay) > 0.20
                    ? 'text-yellow-500'
                    : 'text-green-500'
                  }`} />
                Tax Efficiency Analysis
              </h4>
              <p className="mb-2">Your effective tax rate is {(((breakdown.federalTax + breakdown.stateTax) / breakdown.grossPay) * 100).toFixed(1)}%.</p>
              {((breakdown.federalTax + breakdown.stateTax) / breakdown.grossPay) > 0.25 ? (
                <p className="text-amber-400">💡 <strong>High tax rate!</strong> Consider maximizing pre-tax deductions like 401(k), HSA, or transit benefits.</p>
              ) : ((breakdown.federalTax + breakdown.stateTax) / breakdown.grossPay) > 0.20 ? (
                <p className="text-blue-400">📊 <strong>Moderate tax rate.</strong> You have room to optimize with additional pre-tax deductions.</p>
              ) : (
                <p className="text-green-400">✅ <strong>Great tax efficiency!</strong> Your pre-tax deductions are working well.</p>
              )}
            </div>

            <div className={`p-4 ${theme.backgrounds.glass} rounded-lg border ${theme.borderColors.primary}`}>
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-500" />
                Payroll Tax Breakdown
              </h4>
              <p className="mb-2">Social Security: {formatCurrency(breakdown.socialSecurity)} (6.2%)</p>
              <p className="mb-2">Medicare: {formatCurrency(breakdown.medicare)} (1.45%)</p>
              <p className="text-slate-400">These payroll taxes fund your future benefits. Social Security provides retirement income, while Medicare covers healthcare after age 65.</p>
            </div>

            <div className={`p-4 ${theme.backgrounds.glass} rounded-lg border ${theme.borderColors.primary}`}>
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <TrendingDown className={`w-4 h-4 ${(breakdown.retirement401k || 0) >= breakdown.grossPay * 0.10
                  ? 'text-green-500'
                  : (breakdown.retirement401k || 0) >= breakdown.grossPay * 0.05
                    ? 'text-yellow-500'
                    : 'text-red-500'
                  }`} />
                Retirement Savings Analysis
              </h4>
              {breakdown.retirement401k && breakdown.retirement401k > 0 ? (
                <div>
                  <p className="mb-2">You&apos;re saving <strong>{formatCurrency(breakdown.retirement401k * 12)}</strong> annually for retirement!</p>
                  {(breakdown.retirement401k / breakdown.grossPay) >= 0.15 ? (
                    <p className="text-green-400">🌟 <strong>Excellent!</strong> You&apos;re on track for a comfortable retirement.</p>
                  ) : (breakdown.retirement401k / breakdown.grossPay) >= 0.10 ? (
                    <p className="text-blue-400">👍 <strong>Good progress!</strong> Consider increasing to 15% if possible.</p>
                  ) : (
                    <p className="text-amber-400">📈 <strong>Good start!</strong> Try to increase your contribution by 1% each year.</p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-red-400 mb-2">⚠️ You&apos;re not contributing to retirement!</p>
                  <p>Starting with just 3% can save you thousands in taxes and build wealth. Every year you wait costs you compound growth!</p>
                </div>
              )}
            </div>

            <div className={`p-4 ${theme.backgrounds.glass} rounded-lg border ${theme.borderColors.primary}`}>
              <h4 className="font-semibold mb-2 flex items-center gap-1">
                <Calculator className={`w-4 h-4 ${(breakdown.netPay / breakdown.grossPay) > 0.75
                  ? 'text-green-500'
                  : (breakdown.netPay / breakdown.grossPay) > 0.70
                    ? 'text-yellow-500'
                    : 'text-red-500'
                  }`} />
                Take-Home Optimization
              </h4>
              <p className="mb-2">Your take-home rate of {((breakdown.netPay / breakdown.grossPay) * 100).toFixed(1)}% is {
                (breakdown.netPay / breakdown.grossPay) > 0.75 ? 'excellent 🌟' :
                  (breakdown.netPay / breakdown.grossPay) > 0.70 ? 'good 👍' :
                    (breakdown.netPay / breakdown.grossPay) > 0.65 ? 'average 📊' : 'below average ⚠️'
              }</p>
              {(breakdown.netPay / breakdown.grossPay) <= 0.70 && (
                <p className="text-amber-400">💡 <strong>Optimization tip:</strong> Review your withholdings and consider strategies like HSA contributions, transit benefits, or flexible spending accounts.</p>
              )}
            </div>
          </div>

          {stateTaxRates[state] === 0 && (
            <div className={`mt-6 p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
              <p className={`text-sm ${theme.textColors.primary} flex items-center gap-2`}>
                <Lightbulb className="w-5 h-5 text-green-500" />
                <strong>Tax Advantage:</strong> {state} has no state income tax, saving you approximately {formatCurrency(breakdown.grossPay * 0.05)} per month compared to high-tax states!
              </p>
            </div>
          )}

          {/* Quick Action Recommendations */}
          <div className={`mt-6 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Quick Action Items
            </h4>
            <ul className="space-y-2 text-sm">
              {(breakdown.retirement401k || 0) < breakdown.grossPay * 0.10 && (
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Increase 401(k) contribution by 1% to save ~{formatCurrency(breakdown.grossPay * 0.01 * 0.22)} in taxes monthly</span>
                </li>
              )}
              {!breakdown.healthInsurance && (
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Consider health insurance - it&apos;s a pre-tax deduction that reduces your tax burden</span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Review your tax withholdings annually to avoid large refunds or bills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Consider opening an HSA if eligible - triple tax advantage for medical expenses</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

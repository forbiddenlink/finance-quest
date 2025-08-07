'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  Receipt,
  DollarSign,
  Target,
  Home,
  Heart,
  BookOpen,
  Briefcase,
  Gift,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DeductionCategory {
  id: string;
  label: string;
  icon: typeof Home;
  amount: number;
  maxAmount?: number;
  description: string;
  tips: string[];
}

interface DeductionCalculation {
  totalItemized: number;
  standardDeduction: number;
  recommendedApproach: 'itemized' | 'standard';
  taxSavings: number;
  marginalRate: number;
}

const DEDUCTION_CATEGORIES: DeductionCategory[] = [
  {
    id: 'mortgage',
    label: 'Mortgage Interest',
    icon: Home,
    amount: 0,
    maxAmount: 750000, // Mortgage debt limit for deduction
    description: 'Interest paid on qualified home mortgage debt',
    tips: [
      'Includes interest on up to $750,000 in mortgage debt',
      'Points paid at closing may be deductible',
      'Home equity loan interest may qualify if used for home improvements'
    ]
  },
  {
    id: 'salt',
    label: 'State & Local Taxes (SALT)',
    icon: Receipt,
    amount: 0,
    maxAmount: 10000,
    description: 'State income, property, and local taxes',
    tips: [
      'Capped at $10,000 total for all SALT deductions',
      'Choose between state income tax or sales tax',
      'Property taxes on primary and secondary homes included'
    ]
  },
  {
    id: 'charitable',
    label: 'Charitable Donations',
    icon: Gift,
    amount: 0,
    description: 'Donations to qualified charitable organizations',
    tips: [
      'Keep receipts for all donations over $250',
      'Non-cash donations require fair market value documentation',
      'Volunteer mileage: $0.14 per mile for charity work'
    ]
  },
  {
    id: 'medical',
    label: 'Medical Expenses',
    icon: Heart,
    amount: 0,
    description: 'Medical expenses exceeding 7.5% of AGI',
    tips: [
      'Only amounts exceeding 7.5% of AGI are deductible',
      'Includes insurance premiums, dental, vision, and prescriptions',
      'Mileage to medical appointments: $0.22 per mile'
    ]
  },
  {
    id: 'business',
    label: 'Business Expenses',
    icon: Briefcase,
    amount: 0,
    description: 'Unreimbursed employee business expenses',
    tips: [
      'Home office expenses for self-employed',
      'Business travel and meal expenses (50% for meals)',
      'Professional development and education costs'
    ]
  },
  {
    id: 'education',
    label: 'Education Expenses',
    icon: BookOpen,
    amount: 0,
    description: 'Qualified education expenses and student loan interest',
    tips: [
      'Student loan interest up to $2,500',
      'Tuition and fees for higher education',
      'Education credits may be better than deductions'
    ]
  },
  {
    id: 'other',
    label: 'Other Deductions',
    icon: Calculator,
    amount: 0,
    description: 'Miscellaneous itemized deductions',
    tips: [
      'Tax preparation fees',
      'Investment management fees',
      'Safe deposit box fees for investment documents'
    ]
  }
];

const FILING_STATUS_STANDARD = {
  single: 14600,
  marriedJoint: 29200,
  marriedSeparate: 14600,
  headOfHousehold: 21900
};

const TAX_BRACKETS: Record<keyof typeof FILING_STATUS_STANDARD, Array<{ min: number; max: number; rate: number }>> = {
  single: [
    { min: 0, max: 11000, rate: 10 },
    { min: 11000, max: 44725, rate: 12 },
    { min: 44725, max: 95375, rate: 22 },
    { min: 95375, max: 182050, rate: 24 },
    { min: 182050, max: 231250, rate: 32 },
    { min: 231250, max: 578125, rate: 35 },
    { min: 578125, max: Infinity, rate: 37 }
  ],
  marriedJoint: [
    { min: 0, max: 22000, rate: 10 },
    { min: 22000, max: 89450, rate: 12 },
    { min: 89450, max: 190750, rate: 22 },
    { min: 190750, max: 364200, rate: 24 },
    { min: 364200, max: 462500, rate: 32 },
    { min: 462500, max: 693750, rate: 35 },
    { min: 693750, max: Infinity, rate: 37 }
  ],
  marriedSeparate: [
    { min: 0, max: 11000, rate: 10 },
    { min: 11000, max: 44725, rate: 12 },
    { min: 44725, max: 95375, rate: 22 },
    { min: 95375, max: 182100, rate: 24 },
    { min: 182100, max: 231250, rate: 32 },
    { min: 231250, max: 346875, rate: 35 },
    { min: 346875, max: Infinity, rate: 37 }
  ],
  headOfHousehold: [
    { min: 0, max: 15700, rate: 10 },
    { min: 15700, max: 59850, rate: 12 },
    { min: 59850, max: 95350, rate: 22 },
    { min: 95350, max: 182050, rate: 24 },
    { min: 182050, max: 231250, rate: 32 },
    { min: 231250, max: 578100, rate: 35 },
    { min: 578100, max: Infinity, rate: 37 }
  ]
};

export default function DeductionMaximizerPro() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [grossIncome, setGrossIncome] = useState(85000);
  const [filingStatus, setFilingStatus] = useState<keyof typeof FILING_STATUS_STANDARD>('single');
  const [deductions, setDeductions] = useState<DeductionCategory[]>(DEDUCTION_CATEGORIES);
  const [showOptimization, setShowOptimization] = useState(false);

  useEffect(() => {
    recordCalculatorUsage('deduction-maximizer-pro');
  }, [recordCalculatorUsage]);

  const calculation = useMemo((): DeductionCalculation => {
    const standardDeduction = FILING_STATUS_STANDARD[filingStatus];
    const totalItemized = deductions.reduce((sum, cat) => {
      if (cat.maxAmount) {
        return sum + Math.min(cat.amount, cat.maxAmount);
      }
      return sum + cat.amount;
    }, 0);

    // Calculate marginal tax rate
    const brackets = TAX_BRACKETS[filingStatus] || TAX_BRACKETS.single;
    let marginalRate = 10;
    for (const bracket of brackets) {
      if (grossIncome > bracket.min) {
        marginalRate = bracket.rate;
      }
    }

    const recommendedApproach = totalItemized > standardDeduction ? 'itemized' : 'standard';
    const taxSavings = recommendedApproach === 'itemized' 
      ? (totalItemized - standardDeduction) * (marginalRate / 100)
      : 0;

    return {
      totalItemized,
      standardDeduction,
      recommendedApproach,
      taxSavings,
      marginalRate
    };
  }, [deductions, filingStatus, grossIncome]);

  const updateDeduction = (categoryId: string, amount: number) => {
    setDeductions(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, amount } : cat
    ));
  };

  const chartData = deductions
    .filter(cat => cat.amount > 0)
    .map(cat => ({
      category: cat.label,
      amount: cat.maxAmount ? Math.min(cat.amount, cat.maxAmount) : cat.amount,
      exceeded: cat.maxAmount && cat.amount > cat.maxAmount
    }))
    .sort((a, b) => b.amount - a.amount);

  const optimizationSuggestions = useMemo(() => {
    const suggestions = [];
    
    // SALT cap optimization
    const saltDeduction = deductions.find(d => d.id === 'salt');
    if (saltDeduction && saltDeduction.amount > 10000) {
      suggestions.push({
        type: 'warning',
        title: 'SALT Deduction Capped',
        message: `Your SALT deduction is capped at $10,000. Consider timing property tax payments or exploring other states for retirement.`
      });
    }

    // Medical expenses threshold
    const medicalDeduction = deductions.find(d => d.id === 'medical');
    const medicalThreshold = grossIncome * 0.075;
    if (medicalDeduction && medicalDeduction.amount < medicalThreshold && medicalDeduction.amount > medicalThreshold * 0.8) {
      suggestions.push({
        type: 'tip',
        title: 'Medical Expense Opportunity',
        message: `You need $${Math.ceil(medicalThreshold - medicalDeduction.amount).toLocaleString()} more in medical expenses to start deducting. Consider timing elective procedures.`
      });
    }

    // Charitable bunching
    const charitableDeduction = deductions.find(d => d.id === 'charitable');
    if (calculation.recommendedApproach === 'standard' && charitableDeduction && charitableDeduction.amount > 0) {
      const needToExceed = calculation.standardDeduction - calculation.totalItemized + 1000;
      suggestions.push({
        type: 'strategy',
        title: 'Charitable Bunching Strategy',
        message: `Consider bunching ${needToExceed >= charitableDeduction.amount ? 'multiple years of' : 'additional'} charitable donations to exceed the standard deduction.`
      });
    }

    // Mortgage interest
    const mortgageDeduction = deductions.find(d => d.id === 'mortgage');
    if (mortgageDeduction && mortgageDeduction.amount > 0 && mortgageDeduction.amount < 5000) {
      suggestions.push({
        type: 'info',
        title: 'Mortgage Interest Declining',
        message: 'As your mortgage balance decreases, consider if refinancing or using the standard deduction becomes more beneficial.'
      });
    }

    return suggestions;
  }, [deductions, calculation, grossIncome]);

  return (
    <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className={`w-10 h-10 ${theme.status.warning.bg} rounded-lg flex items-center justify-center mr-3`}>
            <Receipt className={`w-5 h-5 ${theme.status.warning.text}`} />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
              Deduction Maximizer Pro
            </h3>
            <p className={`text-sm ${theme.textColors.muted}`}>
              Advanced deduction optimization with itemized vs standard comparison
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Annual Gross Income
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                <input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                  placeholder="85000"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Filing Status
              </label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as keyof typeof FILING_STATUS_STANDARD)}
                className={`w-full p-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary}`}
                aria-label="Filing Status"
              >
                <option value="single">Single</option>
                <option value="marriedJoint">Married Filing Jointly</option>
                <option value="marriedSeparate">Married Filing Separately</option>
                <option value="headOfHousehold">Head of Household</option>
              </select>
            </div>
          </div>

          {/* Deduction Categories */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              Itemized Deductions
            </h4>
            
            {deductions.map((category) => {
              const Icon = category.icon;
              const isExceeded = category.maxAmount && category.amount > category.maxAmount;
              
              return (
                <div key={category.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                  <div className="flex items-center mb-3">
                    <Icon className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                    <div className="flex-1">
                      <h5 className={`font-medium ${theme.textColors.primary}`}>{category.label}</h5>
                      <p className={`text-xs ${theme.textColors.muted}`}>{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="relative">
                      <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                      <input
                        type="number"
                        value={category.amount}
                        onChange={(e) => updateDeduction(category.id, Number(e.target.value))}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isExceeded ? 'border-red-400' : theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                        placeholder="0"
                      />
                    </div>
                    {category.maxAmount && (
                      <p className={`text-xs mt-1 ${isExceeded ? 'text-red-400' : theme.textColors.muted}`}>
                        {isExceeded ? `Exceeds limit by $${(category.amount - category.maxAmount).toLocaleString()}` : `Limit: $${category.maxAmount.toLocaleString()}`}
                      </p>
                    )}
                  </div>

                  {category.tips.length > 0 && (
                    <div className="space-y-1">
                      {category.tips.slice(0, showOptimization ? category.tips.length : 1).map((tip, index) => (
                        <p key={index} className={`text-xs ${theme.textColors.muted} flex items-start`}>
                          <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                          {tip}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => setShowOptimization(!showOptimization)}
              className={`w-full py-2 px-4 rounded-lg border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent} transition-colors`}
            >
              {showOptimization ? 'Hide' : 'Show'} Optimization Tips
            </button>
          </div>
        </div>

        {/* Results and Analysis */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Receipt className={`w-5 h-5 ${theme.status.info.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Standard</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${calculation.standardDeduction.toLocaleString()}
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Calculator className={`w-5 h-5 ${theme.status.warning.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Itemized</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${calculation.totalItemized.toLocaleString()}
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Target className={`w-5 h-5 ${calculation.recommendedApproach === 'itemized' ? theme.status.success.text : theme.status.info.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Recommended</span>
              </div>
              <div className={`text-lg font-bold ${theme.textColors.primary} capitalize`}>
                {calculation.recommendedApproach}
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className={`w-5 h-5 ${calculation.taxSavings > 0 ? theme.status.success.text : theme.textColors.muted}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Tax Savings</span>
              </div>
              <div className={`text-2xl font-bold ${calculation.taxSavings > 0 ? theme.status.success.text : theme.textColors.primary}`}>
                ${calculation.taxSavings.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* Deduction Breakdown Chart */}
          {chartData.length > 0 && (
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                Deduction Breakdown
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    type="number"
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="category"
                    stroke="#9CA3AF"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Deduction Amount']}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#3B82F6"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Optimization Suggestions */}
          {optimizationSuggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Optimization Suggestions
              </h4>
              {optimizationSuggestions.map((suggestion, index) => {
                const bgColor = suggestion.type === 'warning' ? theme.status.warning.bg :
                               suggestion.type === 'strategy' ? theme.status.info.bg :
                               suggestion.type === 'tip' ? theme.status.success.bg :
                               theme.backgrounds.glass;
                const borderColor = suggestion.type === 'warning' ? theme.status.warning.border :
                                   suggestion.type === 'strategy' ? theme.status.info.border :
                                   suggestion.type === 'tip' ? theme.status.success.border :
                                   theme.borderColors.primary;
                const iconColor = suggestion.type === 'warning' ? theme.status.warning.text :
                                 suggestion.type === 'strategy' ? theme.status.info.text :
                                 suggestion.type === 'tip' ? theme.status.success.text :
                                 theme.textColors.muted;

                return (
                  <div key={index} className={`${bgColor}/10 border ${borderColor} rounded-lg p-4`}>
                    <div className="flex items-start">
                      <AlertTriangle className={`w-5 h-5 ${iconColor} mr-3 mt-0.5 flex-shrink-0`} />
                      <div>
                        <h5 className={`font-medium ${theme.textColors.primary} mb-1`}>
                          {suggestion.title}
                        </h5>
                        <p className={`text-sm ${theme.textColors.secondary}`}>
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommendation Summary */}
          <div className={`${calculation.recommendedApproach === 'itemized' ? theme.status.success.bg : theme.status.info.bg}/10 border ${calculation.recommendedApproach === 'itemized' ? theme.status.success.border : theme.status.info.border} rounded-lg p-4`}>
            <div className="flex items-center mb-3">
              <CheckCircle className={`w-5 h-5 ${calculation.recommendedApproach === 'itemized' ? theme.status.success.text : theme.status.info.text} mr-2`} />
              <h4 className={`font-semibold ${theme.textColors.primary}`}>Recommendation</h4>
            </div>
            <div className="space-y-2">
              {calculation.recommendedApproach === 'itemized' ? (
                <>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Itemize your deductions to save ${calculation.taxSavings.toLocaleString()} in taxes compared to the standard deduction.
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Keep detailed records and receipts for all itemized deductions to support your tax return.
                  </p>
                </>
              ) : (
                <>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Take the standard deduction of ${calculation.standardDeduction.toLocaleString()}. Your itemized deductions (${calculation.totalItemized.toLocaleString()}) don&apos;t exceed this amount.
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Consider bunching deductions in alternate years or look for additional deductible expenses.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

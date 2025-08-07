'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  Briefcase,
  Home,
  GraduationCap,
  Baby,
  Calculator,
  CheckCircle,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface LifeEvent {
  id: string;
  label: string;
  icon: typeof Baby;
  year: number;
  incomeChange: number;
  deductionChange: number;
  description: string;
}

interface TaxStrategy {
  id: string;
  name: string;
  description: string;
  applicableYears: number[];
  taxSavings: number;
  complexity: 'low' | 'medium' | 'high';
  requirements: string[];
}

interface YearlyProjection {
  year: number;
  income: number;
  deductions: number;
  taxOwed: number;
  effectiveRate: number;
  strategies: string[];
  netSavings: number;
}

const LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'marriage',
    label: 'Marriage',
    icon: Calendar,
    year: 2025,
    incomeChange: 45000,
    deductionChange: 5000,
    description: 'Combined income, married filing jointly, shared expenses'
  },
  {
    id: 'home',
    label: 'Home Purchase',
    icon: Home,
    year: 2026,
    incomeChange: 0,
    deductionChange: 15000,
    description: 'Mortgage interest and property tax deductions'
  },
  {
    id: 'child',
    label: 'First Child',
    icon: Baby,
    year: 2028,
    incomeChange: -5000,
    deductionChange: 3000,
    description: 'Child tax credit, dependent care FSA, reduced income'
  },
  {
    id: 'promotion',
    label: 'Career Advancement',
    icon: Briefcase,
    year: 2030,
    incomeChange: 25000,
    deductionChange: 2000,
    description: 'Higher income, increased 401k contributions'
  },
  {
    id: 'education',
    label: 'MBA Program',
    icon: GraduationCap,
    year: 2032,
    incomeChange: -15000,
    deductionChange: 8000,
    description: 'Reduced income, education tax credits'
  }
];

const TAX_STRATEGIES: TaxStrategy[] = [
  {
    id: 'rothConversion',
    name: 'Roth IRA Conversion',
    description: 'Convert traditional IRA to Roth during low-income years',
    applicableYears: [2032, 2033],
    taxSavings: 3500,
    complexity: 'medium',
    requirements: ['Traditional IRA balance', 'Cash to pay taxes', 'Lower income year']
  },
  {
    id: 'charitableBunching',
    name: 'Charitable Donation Bunching',
    description: 'Group multiple years of donations to exceed standard deduction',
    applicableYears: [2026, 2028, 2030],
    taxSavings: 2200,
    complexity: 'low',
    requirements: ['Regular charitable giving', 'Ability to time donations']
  },
  {
    id: 'taxLossHarvesting',
    name: 'Tax-Loss Harvesting',
    description: 'Sell losing investments to offset gains',
    applicableYears: [2027, 2029, 2031],
    taxSavings: 1800,
    complexity: 'medium',
    requirements: ['Taxable investment accounts', 'Investment losses available']
  },
  {
    id: 'businessExpenses',
    name: 'Business Expense Optimization',
    description: 'Maximize deductible business and professional expenses',
    applicableYears: [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034],
    taxSavings: 1200,
    complexity: 'low',
    requirements: ['Self-employment income', 'Legitimate business expenses']
  },
  {
    id: 'hsaMaximization',
    name: 'HSA Maximization',
    description: 'Triple tax advantage health savings account strategy',
    applicableYears: [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034],
    taxSavings: 2800,
    complexity: 'low',
    requirements: ['High-deductible health plan', 'Available contribution room']
  }
];

export default function TaxStrategySimulator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [currentIncome, setCurrentIncome] = useState(75000);
  const [currentAge, setCurrentAge] = useState(28);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>(LIFE_EVENTS);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>(['hsaMaximization', 'businessExpenses']);
  const [projectionYears, setProjectionYears] = useState(10);

  useEffect(() => {
    recordCalculatorUsage('tax-strategy-simulator');
  }, [recordCalculatorUsage]);

  const projections = useMemo((): YearlyProjection[] => {
    const baseYear = new Date().getFullYear();
    const results: YearlyProjection[] = [];
    
    for (let i = 0; i < projectionYears; i++) {
      const year = baseYear + i;
      
      // Calculate income changes from life events
      let yearIncome = currentIncome;
      let yearDeductions = 14600; // Standard deduction baseline
      
      // Apply life events
      lifeEvents.forEach(event => {
        if (event.year <= year) {
          yearIncome += event.incomeChange;
          yearDeductions += event.deductionChange;
        }
      });
      
      // Apply income growth (3% annually)
      yearIncome *= Math.pow(1.03, i);
      
      // Calculate tax brackets
      const taxableIncome = Math.max(0, yearIncome - yearDeductions);
      let taxOwed = 0;
      
      // Single tax brackets (simplified)
      const brackets = [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182050, rate: 0.24 },
        { min: 182050, max: 231250, rate: 0.32 },
        { min: 231250, max: 578125, rate: 0.35 },
        { min: 578125, max: Infinity, rate: 0.37 }
      ];
      
      for (const bracket of brackets) {
        if (taxableIncome > bracket.min) {
          const incomeInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
          taxOwed += incomeInBracket * bracket.rate;
        }
      }
      
      // Apply strategy savings
      const applicableStrategies = TAX_STRATEGIES.filter(strategy => 
        selectedStrategies.includes(strategy.id) && strategy.applicableYears.includes(year)
      );
      
      const strategySavings = applicableStrategies.reduce((sum, strategy) => sum + strategy.taxSavings, 0);
      const netTaxOwed = Math.max(0, taxOwed - strategySavings);
      
      const effectiveRate = yearIncome > 0 ? (netTaxOwed / yearIncome) * 100 : 0;
      
      results.push({
        year,
        income: yearIncome,
        deductions: yearDeductions,
        taxOwed: netTaxOwed,
        effectiveRate,
        strategies: applicableStrategies.map(s => s.name),
        netSavings: strategySavings
      });
    }
    
    return results;
  }, [currentIncome, lifeEvents, selectedStrategies, projectionYears]);

  const updateLifeEvent = (eventId: string, field: keyof LifeEvent, value: number) => {
    setLifeEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, [field]: value } : event
    ));
  };

  const toggleStrategy = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const totalTaxSavings = projections.reduce((sum, year) => sum + year.netSavings, 0);
  const averageEffectiveRate = projections.reduce((sum, year) => sum + year.effectiveRate, 0) / projections.length;

  const chartData = projections.map(p => ({
    year: p.year,
    income: Math.round(p.income),
    taxOwed: Math.round(p.taxOwed),
    taxSavings: Math.round(p.netSavings),
    effectiveRate: Number(p.effectiveRate.toFixed(1))
  }));

  return (
    <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className={`w-10 h-10 ${theme.status.success.bg} rounded-lg flex items-center justify-center mr-3`}>
            <BarChart3 className={`w-5 h-5 ${theme.status.success.text}`} />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
              Tax Strategy Simulator
            </h3>
            <p className={`text-sm ${theme.textColors.muted}`}>
              Multi-year tax planning with scenario modeling and life event integration
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Current Situation
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Annual Income
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                  <input
                    type="number"
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                    placeholder="75000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Age
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className={`w-full p-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                  placeholder="28"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Projection Years
                </label>
                <select
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(Number(e.target.value))}
                  className={`w-full p-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary}`}
                  aria-label="Projection Years"
                >
                  <option value={5}>5 Years</option>
                  <option value={10}>10 Years</option>
                  <option value={15}>15 Years</option>
                  <option value={20}>20 Years</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Life Events
            </h4>
            
            <div className="space-y-3">
              {lifeEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-3`}>
                    <div className="flex items-center mb-2">
                      <Icon className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
                      <span className={`font-medium ${theme.textColors.primary}`}>{event.label}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className={`block text-xs ${theme.textColors.muted} mb-1`}>Year</label>
                        <input
                          type="number"
                          value={event.year}
                          onChange={(e) => updateLifeEvent(event.id, 'year', Number(e.target.value))}
                          className={`w-full p-2 text-sm rounded border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary}`}
                          aria-label={`Year for ${event.label}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs ${theme.textColors.muted} mb-1`}>Income Change</label>
                        <input
                          type="number"
                          value={event.incomeChange}
                          onChange={(e) => updateLifeEvent(event.id, 'incomeChange', Number(e.target.value))}
                          className={`w-full p-2 text-sm rounded border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary}`}
                          aria-label={`Income change for ${event.label}`}
                        />
                      </div>
                    </div>
                    
                    <p className={`text-xs ${theme.textColors.muted}`}>{event.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Tax Strategies
            </h4>
            
            <div className="space-y-2">
              {TAX_STRATEGIES.map((strategy) => {
                const isSelected = selectedStrategies.includes(strategy.id);
                const complexityColor = strategy.complexity === 'low' ? theme.status.success.text :
                                      strategy.complexity === 'medium' ? theme.status.warning.text :
                                      theme.status.error.text;
                
                return (
                  <div key={strategy.id} className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected 
                      ? `${theme.status.info.bg}/10 ${theme.status.info.border}` 
                      : `${theme.backgrounds.glass} ${theme.borderColors.primary} hover:${theme.borderColors.accent}`
                  }`} onClick={() => toggleStrategy(strategy.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${isSelected ? theme.status.success.text : theme.textColors.muted}`} />
                        <span className={`font-medium ${theme.textColors.primary}`}>{strategy.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${complexityColor} bg-opacity-20`}>
                          {strategy.complexity}
                        </span>
                        <span className={`text-sm font-medium ${theme.status.success.text}`}>
                          ${strategy.taxSavings}
                        </span>
                      </div>
                    </div>
                    <p className={`text-xs ${theme.textColors.muted} mb-2`}>{strategy.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {strategy.requirements.slice(0, 2).map((req, index) => (
                        <span key={index} className={`text-xs px-2 py-0.5 rounded ${theme.backgrounds.glass} ${theme.textColors.muted}`}>
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Projections and Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className={`w-5 h-5 ${theme.status.success.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Total Savings</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${totalTaxSavings.toLocaleString()}
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Target className={`w-5 h-5 ${theme.status.info.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Avg Rate</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {averageEffectiveRate.toFixed(1)}%
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Calculator className={`w-5 h-5 ${theme.status.warning.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Strategies</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {selectedStrategies.length}
              </div>
            </motion.div>
          </div>

          {/* Income and Tax Projection Chart */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Income & Tax Projection
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`, 
                    name === 'income' ? 'Income' : name === 'taxOwed' ? 'Tax Owed' : 'Tax Savings'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6} 
                />
                <Area 
                  type="monotone" 
                  dataKey="taxOwed" 
                  stackId="2" 
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Effective Tax Rate Chart */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Effective Tax Rate Over Time
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[0, 'dataMax + 2']}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Effective Tax Rate']}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="effectiveRate" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Strategy Impact Summary */}
          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg p-4`}>
            <div className="flex items-center mb-3">
              <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              <h4 className={`font-semibold ${theme.textColors.primary}`}>Strategy Impact Summary</h4>
            </div>
            <div className="space-y-2">
              <p className={`text-sm ${theme.textColors.secondary}`}>
                • Your selected strategies could save ${totalTaxSavings.toLocaleString()} in taxes over {projectionYears} years
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                • Average effective tax rate: {averageEffectiveRate.toFixed(1)}% with optimization
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                • Most impactful years: {chartData.filter(d => d.taxSavings > 2000).map(d => d.year).join(', ') || 'None'}
              </p>
              {selectedStrategies.length === 0 && (
                <p className={`text-sm ${theme.status.warning.text}`}>
                  • Select tax strategies above to see potential savings
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

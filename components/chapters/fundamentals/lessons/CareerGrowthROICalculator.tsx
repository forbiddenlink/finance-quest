'use client';

import { useState, useEffect, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Calculator,
  BookOpen,
  Award,
  Briefcase,
  Target,
  ChevronRight,
  BarChart3,
  PieChart,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  Star,
  Users,
  Clock,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Decimal from 'decimal.js';

interface CareerOption {
  id: string;
  name: string;
  icon: any;
  currentSalary: number;
  projectedSalary: number;
  timeToPromote: number; // years
  educationCost: number;
  educationTime: number; // years
  riskLevel: 'low' | 'medium' | 'high';
  growthRate: number; // annual %
  description: string;
}

interface CareerProjection {
  year: number;
  stayCurrentPath: number;
  newCareerPath: number;
  netGain: number;
  cumulativeROI: number;
}

interface CalculationResult {
  totalInvestment: number;
  lifetimeEarningsGain: number;
  roi: number;
  breakEvenYear: number;
  projections: CareerProjection[];
  riskAssessment: string;
  recommendation: string;
}

const careerOptions: CareerOption[] = [
  {
    id: 'job_change',
    name: 'Strategic Job Change',
    icon: Briefcase,
    currentSalary: 75000,
    projectedSalary: 95000,
    timeToPromote: 0.5,
    educationCost: 2000, // Interview prep, networking
    educationTime: 0.25,
    riskLevel: 'medium',
    growthRate: 5,
    description: 'Switch to higher-paying role at different company'
  },
  {
    id: 'mba',
    name: 'MBA Program',
    icon: BookOpen,
    currentSalary: 75000,
    projectedSalary: 120000,
    timeToPromote: 2,
    educationCost: 150000,
    educationTime: 2,
    riskLevel: 'high',
    growthRate: 7,
    description: 'Full-time MBA for management track'
  },
  {
    id: 'certification',
    name: 'Professional Certification',
    icon: Award,
    currentSalary: 75000,
    projectedSalary: 85000,
    timeToPromote: 1,
    educationCost: 5000,
    educationTime: 0.5,
    riskLevel: 'low',
    growthRate: 4,
    description: 'Industry-specific certification (PMP, CPA, etc.)'
  },
  {
    id: 'bootcamp',
    name: 'Tech Bootcamp',
    icon: Target,
    currentSalary: 75000,
    projectedSalary: 90000,
    timeToPromote: 0.75,
    educationCost: 15000,
    educationTime: 0.75,
    riskLevel: 'medium',
    growthRate: 8,
    description: 'Coding bootcamp for tech transition'
  },
  {
    id: 'internal_promotion',
    name: 'Internal Promotion Track',
    icon: TrendingUp,
    currentSalary: 75000,
    projectedSalary: 85000,
    timeToPromote: 1.5,
    educationCost: 3000,
    educationTime: 0.5,
    riskLevel: 'low',
    growthRate: 3.5,
    description: 'Focus on promotion within current company'
  },
  {
    id: 'side_hustle',
    name: 'Side Business Development',
    icon: Zap,
    currentSalary: 75000,
    projectedSalary: 75000,
    timeToPromote: 2,
    educationCost: 10000,
    educationTime: 1,
    riskLevel: 'high',
    growthRate: 15, // Higher potential but variable
    description: 'Build side business to supplement income'
  }
];

const projectionYears = 15;

export default function CareerGrowthROICalculator() {
  const { recordCalculatorUsage, recordSimulationResult } = useProgressStore();
  
  const [selectedOption, setSelectedOption] = useState<CareerOption>(careerOptions[0]);
  const [currentSalary, setCurrentSalary] = useState(75000);
  const [currentGrowthRate, setCurrentGrowthRate] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    recordCalculatorUsage('career-growth-roi-calculator');
  }, [recordCalculatorUsage]);

  const calculation = useMemo((): CalculationResult => {
    const projections: CareerProjection[] = [];
    
    let currentPathSalary = currentSalary;
    let newPathSalary = currentSalary;
    let totalInvestment = selectedOption.educationCost;
    
    for (let year = 0; year <= projectionYears; year++) {
      // Current path earnings
      if (year > 0) {
        currentPathSalary *= (1 + currentGrowthRate / 100);
      }
      
      // New path earnings
      if (year >= selectedOption.timeToPromote) {
        if (year === Math.ceil(selectedOption.timeToPromote)) {
          newPathSalary = selectedOption.projectedSalary;
        } else if (year > selectedOption.timeToPromote) {
          newPathSalary *= (1 + selectedOption.growthRate / 100);
        }
      }
      
      // During education period, might have reduced income
      let adjustedNewPathSalary = newPathSalary;
      if (year < selectedOption.educationTime) {
        adjustedNewPathSalary = currentSalary * 0.7; // Reduced income during education
      }
      
      const yearlyGain = adjustedNewPathSalary - currentPathSalary;
      const cumulativeGain = projections.length > 0 
        ? projections[projections.length - 1].netGain + yearlyGain 
        : yearlyGain;
      
      const roi = totalInvestment > 0 ? (cumulativeGain / totalInvestment) * 100 : 0;
      
      projections.push({
        year,
        stayCurrentPath: Math.round(currentPathSalary),
        newCareerPath: Math.round(adjustedNewPathSalary),
        netGain: Math.round(cumulativeGain),
        cumulativeROI: Math.round(roi * 100) / 100
      });
    }
    
    const finalProjection = projections[projections.length - 1];
    const lifetimeEarningsGain = finalProjection.netGain;
    const finalROI = finalProjection.cumulativeROI;
    
    // Find break-even year
    const breakEvenYear = projections.findIndex(p => p.netGain > 0);
    
    // Risk assessment
    let riskAssessment = '';
    switch (selectedOption.riskLevel) {
      case 'low':
        riskAssessment = 'Conservative choice with predictable returns';
        break;
      case 'medium':
        riskAssessment = 'Balanced risk with good upside potential';
        break;
      case 'high':
        riskAssessment = 'Higher risk but potential for significant gains';
        break;
    }
    
    // Recommendation logic
    let recommendation = '';
    if (finalROI > 300) {
      recommendation = 'Excellent investment with strong returns';
    } else if (finalROI > 150) {
      recommendation = 'Good investment worth considering';
    } else if (finalROI > 50) {
      recommendation = 'Modest returns, evaluate carefully';
    } else {
      recommendation = 'Low returns, consider alternatives';
    }
    
    return {
      totalInvestment,
      lifetimeEarningsGain,
      roi: finalROI,
      breakEvenYear: breakEvenYear >= 0 ? breakEvenYear : projectionYears,
      projections,
      riskAssessment,
      recommendation
    };
  }, [selectedOption, currentSalary, currentGrowthRate]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowResults(true);
    setIsCalculating(false);
    
    // Record simulation result
    recordSimulationResult({
      scenarioId: selectedOption.id,
      totalScore: Math.min(100, Math.max(0, calculation.roi / 3)), // Convert ROI to 0-100 score
      timeSpent: 5, // Estimated time spent
      correctAnswers: 1,
      totalQuestions: 1,
      financialOutcome: calculation.lifetimeEarningsGain,
      grade: calculation.roi > 200 ? 'A' : calculation.roi > 150 ? 'B' : calculation.roi > 100 ? 'C' : calculation.roi > 50 ? 'D' : 'F',
      strengths: ['Career ROI Analysis', calculation.recommendation],
      improvements: ['Consider multiple career paths for comparison'],
      completedAt: new Date()
    });
  };

  const resetCalculation = () => {
    setShowResults(false);
    setSelectedOption(careerOptions[0]);
    setCurrentSalary(75000);
    setCurrentGrowthRate(3);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-500/20';
      case 'medium': return 'bg-yellow-500/20';
      case 'high': return 'bg-red-500/20';
      default: return 'bg-slate-500/20';
    }
  };

  return (
    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}>
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-4">
          <div className="bg-purple-500/15 p-3 rounded-xl mr-4">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Career Growth ROI Calculator</h3>
            <p className="text-slate-300">Compare career paths and calculate lifetime earning potential</p>
          </div>
        </div>
      </motion.div>

      {!showResults ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Current Situation */}
          <GradientCard className="p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Your Current Situation
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Annual Salary
                </label>
                <input
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-white"
                  placeholder="75000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Annual Raise (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={currentGrowthRate}
                  onChange={(e) => setCurrentGrowthRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Current Annual Raise Percentage"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span className="font-bold text-blue-400">{currentGrowthRate}%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </GradientCard>

          {/* Career Options */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Select Career Growth Path
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {careerOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOption.id === option.id;
                
                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-white/10 bg-white/5 hover:border-blue-500/50'
                    }`}
                    onClick={() => setSelectedOption(option)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getRiskBg(option.riskLevel)}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-white text-sm">{option.name}</h5>
                        <p className="text-xs text-slate-400 mt-1">{option.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Salary Increase:</span>
                        <span className="text-emerald-400 font-semibold">
                          +{formatCurrency(option.projectedSalary - currentSalary)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Investment:</span>
                        <span className="text-white">{formatCurrency(option.educationCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time to Result:</span>
                        <span className="text-white">{option.timeToPromote} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Risk Level:</span>
                        <span className={`${getRiskColor(option.riskLevel)} font-semibold capitalize`}>
                          {option.riskLevel}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Preview */}
          <GradientCard className="p-4">
            <h5 className="font-semibold text-white mb-3">Quick Preview: {selectedOption.name}</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(calculation.lifetimeEarningsGain)}
                </p>
                <p className="text-xs text-slate-400">Lifetime Gain</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {calculation.roi}%
                </p>
                <p className="text-xs text-slate-400">ROI</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">
                  {calculation.breakEvenYear}
                </p>
                <p className="text-xs text-slate-400">Break-even Years</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {selectedOption.growthRate}%
                </p>
                <p className="text-xs text-slate-400">Annual Growth</p>
              </div>
            </div>
          </GradientCard>

          {/* Calculate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCalculate}
            disabled={isCalculating}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
              isCalculating
                ? 'bg-slate-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isCalculating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Calculating Career ROI...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculate Career Growth ROI
              </div>
            )}
          </motion.button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Results Header */}
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white mb-2">Career Growth Analysis</h4>
              <p className="text-slate-300">ROI analysis for {selectedOption.name}</p>
            </div>

            {/* Key Metrics */}
            <GradientCard className="p-6">
              <h5 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Key Financial Outcomes
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-emerald-500/20 p-3 rounded-lg mb-2">
                    <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(calculation.lifetimeEarningsGain)}
                  </p>
                  <p className="text-sm text-slate-400">Lifetime Earnings Gain</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-500/20 p-3 rounded-lg mb-2">
                    <BarChart3 className="w-6 h-6 text-blue-400 mx-auto" />
                  </div>
                  <p className="text-2xl font-bold text-blue-400">
                    {calculation.roi}%
                  </p>
                  <p className="text-sm text-slate-400">Return on Investment</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-500/20 p-3 rounded-lg mb-2">
                    <Clock className="w-6 h-6 text-purple-400 mx-auto" />
                  </div>
                  <p className="text-2xl font-bold text-purple-400">
                    {calculation.breakEvenYear}
                  </p>
                  <p className="text-sm text-slate-400">Years to Break Even</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-yellow-500/20 p-3 rounded-lg mb-2">
                    <DollarSign className="w-6 h-6 text-yellow-400 mx-auto" />
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(calculation.totalInvestment)}
                  </p>
                  <p className="text-sm text-slate-400">Total Investment</p>
                </div>
              </div>
            </GradientCard>

            {/* Earnings Projection Chart */}
            <GradientCard className="p-6">
              <h5 className="font-semibold text-white mb-4">15-Year Earnings Projection</h5>
              <div className="w-full h-96">
                <ResponsiveContainer>
                  <LineChart data={calculation.projections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="year" 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value: any, name: string) => [
                        formatCurrency(value),
                        name === 'stayCurrentPath' ? 'Current Path' : 'New Path'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="stayCurrentPath" 
                      stroke="#64748b" 
                      strokeWidth={2}
                      name="Current Path"
                      strokeDasharray="5 5"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="newCareerPath" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="New Career Path"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GradientCard>

            {/* Insights and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GradientCard className="p-6">
                <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Risk Assessment
                </h5>
                <div className={`p-4 rounded-lg ${getRiskBg(selectedOption.riskLevel)} mb-4`}>
                  <p className={`font-semibold ${getRiskColor(selectedOption.riskLevel)} capitalize mb-2`}>
                    {selectedOption.riskLevel} Risk Level
                  </p>
                  <p className="text-sm text-slate-300">{calculation.riskAssessment}</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Education Time Required:</p>
                    <p className="text-white">{selectedOption.educationTime} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Expected Growth Rate:</p>
                    <p className="text-white">{selectedOption.growthRate}% annually</p>
                  </div>
                </div>
              </GradientCard>
              
              <GradientCard className="p-6">
                <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Recommendation
                </h5>
                <div className={`p-4 rounded-lg ${
                  calculation.roi > 200 ? theme.status.success.bg :
                  calculation.roi > 100 ? 'bg-yellow-500/20' :
                  theme.status.error.bg
                } mb-4`}>
                  <p className="text-white font-semibold mb-2">{calculation.recommendation}</p>
                  <p className="text-sm text-slate-300">
                    Based on {projectionYears}-year projection with {calculation.roi}% ROI
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Consider opportunity costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Factor in industry trends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Plan for market volatility</span>
                  </div>
                </div>
              </GradientCard>
            </div>

            {/* Action Steps */}
            <GradientCard className="p-6">
              <h5 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Next Steps for {selectedOption.name}
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h6 className="font-semibold text-white mb-2">Immediate Actions (0-3 months):</h6>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Research market salary data for target role</li>
                    <li>• Network with professionals in desired field</li>
                    <li>• Update resume and LinkedIn profile</li>
                    <li>• Set aside budget for education/training costs</li>
                  </ul>
                </div>
                
                <div>
                  <h6 className="font-semibold text-white mb-2">Medium-term Planning (3-12 months):</h6>
                  <ul className="space-y-1 text-sm text-slate-300">
                    <li>• Begin education/certification program</li>
                    <li>• Build portfolio of relevant projects</li>
                    <li>• Attend industry events and conferences</li>
                    <li>• Start applying or discussing promotion path</li>
                  </ul>
                </div>
              </div>
            </GradientCard>

            {/* Reset Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetCalculation}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Compare Another Path
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  BarChart3,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RiskScenario {
  months: number;
  fundAmount: number;
  monthlyExpenses: number;
  riskLevel: 'high' | 'medium' | 'low';
  protection: number; // 0-100 percentage
  scenarios: {
    name: string;
    cost: number;
    covered: boolean;
    impact: string;
  }[];
  pros: string[];
  cons: string[];
  recommendation: string;
}

const commonEmergencies = [
  { name: 'Car Repair', cost: 1500 },
  { name: 'Medical Bill', cost: 2500 },
  { name: 'Home Repair', cost: 3000 },
  { name: 'Job Loss (3 months)', cost: 9000 },
  { name: 'Major Medical', cost: 5000 },
  { name: 'Family Emergency', cost: 4000 }
];

interface RiskToleranceVisualizerProps {
  onComplete?: (selectedScenario: RiskScenario) => void;
}

export default function RiskToleranceVisualizer({ onComplete }: RiskToleranceVisualizerProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  const [selectedScenario, setSelectedScenario] = useState<number>(1); // Default to 3-month fund
  const [showComparison, setShowComparison] = useState(false);

  const generateScenarios = (expenses: number): RiskScenario[] => {
    return [
      {
        months: 1,
        fundAmount: expenses * 1,
        monthlyExpenses: expenses,
        riskLevel: 'high',
        protection: 25,
        scenarios: commonEmergencies.map(emergency => ({
          ...emergency,
          covered: emergency.cost <= expenses * 1,
          impact: emergency.cost <= expenses * 1 ? 'Fully covered' : 'Need additional financing'
        })),
        pros: [
          'Quick to build (1-2 months)',
          'Better than no emergency fund',
          'Covers small emergencies'
        ],
        cons: [
          'Insufficient for job loss',
          'Major emergencies require debt',
          'High financial stress during big emergencies'
        ],
        recommendation: 'Starter fund only - build to 3-6 months as soon as possible'
      },
      {
        months: 3,
        fundAmount: expenses * 3,
        monthlyExpenses: expenses,
        riskLevel: 'medium',
        protection: 60,
        scenarios: commonEmergencies.map(emergency => ({
          ...emergency,
          covered: emergency.cost <= expenses * 3,
          impact: emergency.cost <= expenses * 3 ? 'Fully covered' : 'Partially covered'
        })),
        pros: [
          'Covers most common emergencies',
          'Provides 3 months job loss protection',
          'Good balance of security and building time'
        ],
        cons: [
          'May be insufficient for variable income',
          'Large medical bills could exceed fund',
          'Extended job loss creates stress'
        ],
        recommendation: 'Good baseline for stable employment and dual-income households'
      },
      {
        months: 6,
        fundAmount: expenses * 6,
        monthlyExpenses: expenses,
        riskLevel: 'low',
        protection: 85,
        scenarios: commonEmergencies.map(emergency => ({
          ...emergency,
          covered: emergency.cost <= expenses * 6,
          impact: emergency.cost <= expenses * 6 ? 'Fully covered with buffer' : 'Mostly covered'
        })),
        pros: [
          'Covers virtually all emergencies',
          'Provides extensive job loss protection',
          'Low financial stress during crises'
        ],
        cons: [
          'Takes longer to build',
          'Opportunity cost of not investing',
          'May be excessive for very stable situations'
        ],
        recommendation: 'Ideal for single-income families and moderate job security'
      },
      {
        months: 12,
        fundAmount: expenses * 12,
        monthlyExpenses: expenses,
        riskLevel: 'low',
        protection: 95,
        scenarios: commonEmergencies.map(emergency => ({
          ...emergency,
          covered: true,
          impact: 'Fully covered with significant buffer'
        })),
        pros: [
          'Maximum financial security',
          'Handles multiple emergencies',
          'Allows selective job searching',
          'Covers extended medical issues'
        ],
        cons: [
          'Significant opportunity cost',
          'Takes years to build',
          'May be excessive for stable situations'
        ],
        recommendation: 'Best for variable income, health issues, or high-risk industries'
      }
    ];
  };

  const scenarios = generateScenarios(monthlyExpenses);
  const selectedData = scenarios[selectedScenario];

  const handleExpenseChange = (value: number) => {
    setMonthlyExpenses(value);
  };

  const selectScenario = (index: number) => {
    setSelectedScenario(index);
    setShowComparison(true);
  };

  const completeVisualization = () => {
    recordCalculatorUsage('risk-tolerance-visualizer');
    
    toast.success(`${selectedData.months}-month emergency fund selected! Great choice for your risk level.`, {
      duration: 4000,
      position: 'top-center',
    });

    if (onComplete) {
      onComplete(selectedData);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBg = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return theme.status.error.bg;
      case 'medium': return theme.status.warning.bg;
      case 'low': return theme.status.success.bg;
      default: return theme.backgrounds.card;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 ${theme.status.info.bg} rounded-full flex items-center justify-center animate-float`}>
          <BarChart3 className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Emergency Fund Risk Visualizer
        </h2>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Visualize how different emergency fund sizes protect you from financial risk
        </p>
      </div>

      {/* Monthly Expenses Input */}
      <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <DollarSign className="w-6 h-6" />
          Your Monthly Essential Expenses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Essential Monthly Expenses
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-3 w-5 h-5 ${theme.textColors.muted}`} />
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => handleExpenseChange(Number(e.target.value))}
                className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="3000"
                min="1000"
                max="15000"
                step="100"
              />
            </div>
            <p className={`text-sm ${theme.textColors.muted} mt-1`}>
              Include housing, food, utilities, minimum debt payments, insurance
            </p>
          </div>
          
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Quick Estimates</h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleExpenseChange(2000)}
                className={`block w-full text-left px-3 py-2 rounded ${theme.textColors.secondary} hover:${theme.backgrounds.card} transition-colors`}
              >
                $2,000 - Single, minimal expenses
              </button>
              <button 
                onClick={() => handleExpenseChange(3500)}
                className={`block w-full text-left px-3 py-2 rounded ${theme.textColors.secondary} hover:${theme.backgrounds.card} transition-colors`}
              >
                $3,500 - Couple, moderate lifestyle
              </button>
              <button 
                onClick={() => handleExpenseChange(5000)}
                className={`block w-full text-left px-3 py-2 rounded ${theme.textColors.secondary} hover:${theme.backgrounds.card} transition-colors`}
              >
                $5,000 - Family with children
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Fund Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.months}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${theme.backgrounds.glass} border-2 ${
              selectedScenario === index ? theme.borderColors.accent : theme.borderColors.primary
            } rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover-lift`}
            onClick={() => selectScenario(index)}
          >
            <div className="text-center mb-4">
              <div className={`w-12 h-12 mx-auto mb-3 ${getRiskBg(scenario.riskLevel)} rounded-full flex items-center justify-center`}>
                <Shield className={`w-6 h-6 ${getRiskColor(scenario.riskLevel)}`} />
              </div>
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                {scenario.months} Month{scenario.months > 1 ? 's' : ''}
              </h3>
              <p className={`text-2xl font-bold text-blue-400 mb-2`}>
                ${scenario.fundAmount.toLocaleString()}
              </p>
              <span className={`text-sm px-3 py-1 ${getRiskBg(scenario.riskLevel)} ${getRiskColor(scenario.riskLevel)} rounded-full font-medium capitalize`}>
                {scenario.riskLevel} Risk
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${theme.textColors.secondary}`}>Protection Level</span>
                <span className={`text-sm font-bold ${getRiskColor(scenario.riskLevel)}`}>
                  {scenario.protection}%
                </span>
              </div>
              <div className={`w-full bg-slate-700 rounded-full h-2`}>
                <motion.div
                  className={`h-2 rounded-full ${
                    scenario.riskLevel === 'high' ? 'bg-red-400' :
                    scenario.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${scenario.protection}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className={`text-sm font-semibold ${theme.textColors.primary}`}>Coverage:</h4>
              {scenario.scenarios.slice(0, 3).map((emergency, emergencyIndex) => (
                <div key={emergencyIndex} className="flex items-center justify-between text-xs">
                  <span className={`${theme.textColors.secondary}`}>{emergency.name}</span>
                  {emergency.covered ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>

            {selectedScenario === index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 p-2 ${theme.status.info.bg} rounded-lg`}
              >
                <p className={`text-xs ${theme.status.info.text} text-center font-medium`}>
                  Selected for comparison
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Detailed Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-8`}
          >
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                {selectedData.months}-Month Emergency Fund Analysis
              </h3>
              <p className={`text-lg ${theme.textColors.secondary}`}>
                ${selectedData.fundAmount.toLocaleString()} total fund • {selectedData.protection}% protection level
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Emergency Coverage */}
              <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
                <h4 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                  <Target className="w-6 h-6" />
                  Emergency Coverage
                </h4>
                <div className="space-y-3">
                  {selectedData.scenarios.map((emergency, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                      <div>
                        <p className={`font-medium ${theme.textColors.primary}`}>{emergency.name}</p>
                        <p className={`text-sm ${theme.textColors.secondary}`}>${emergency.cost.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {emergency.covered ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`text-xs ${emergency.covered ? 'text-green-400' : 'text-red-400'} font-medium`}>
                          {emergency.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="space-y-6">
                <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6`}>
                  <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                    Advantages
                  </h4>
                  <div className="space-y-2">
                    {selectedData.pros.map((pro, index) => (
                      <div key={index} className="flex items-start">
                        <Star className={`w-4 h-4 ${theme.status.success.text} mt-1 mr-2 flex-shrink-0`} />
                        <span className={`text-sm ${theme.textColors.secondary} font-medium`}>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6`}>
                  <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                    <AlertTriangle className={`w-5 h-5 ${theme.status.error.text}`} />
                    Limitations
                  </h4>
                  <div className="space-y-2">
                    {selectedData.cons.map((con, index) => (
                      <div key={index} className="flex items-start">
                        <AlertTriangle className={`w-4 h-4 ${theme.status.error.text} mt-1 mr-2 flex-shrink-0`} />
                        <span className={`text-sm ${theme.textColors.secondary} font-medium`}>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6 mb-6`}>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                <Zap className={`w-5 h-5 ${theme.status.info.text}`} />
                Recommendation
              </h4>
              <p className={`${theme.textColors.secondary} font-medium`}>
                {selectedData.recommendation}
              </p>
            </div>

            {/* Building Timeline */}
            <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-8`}>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Clock className="w-5 h-5" />
                Building Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className={`text-2xl font-bold text-blue-400 mb-1`}>
                    ${Math.round(selectedData.fundAmount / 12).toLocaleString()}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>per month for 12 months</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold text-green-400 mb-1`}>
                    ${Math.round(selectedData.fundAmount / 24).toLocaleString()}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>per month for 24 months</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold text-amber-400 mb-1`}>
                    ${Math.round(selectedData.fundAmount / 36).toLocaleString()}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>per month for 36 months</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <button
                onClick={completeVisualization}
                className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift`}
              >
                <Target className="w-5 h-5 mr-2 inline" />
                Select This Emergency Fund Size
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  BookOpen,
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Award,
  Target,
  Zap,
  RefreshCw,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SkillInvestment {
  id: string;
  name: string;
  category: 'Technical' | 'Business' | 'Creative' | 'Management';
  cost: number;
  timeHours: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  marketDemand: 'Low' | 'Medium' | 'High' | 'Very High';
  salaryIncrease: {
    min: number;
    max: number;
    typical: number;
  };
  timeToImpact: number; // months
  careerBoost: number; // 1-10 scale
  description: string;
}

const skillInvestments: SkillInvestment[] = [
  {
    id: 'cloud_computing',
    name: 'Cloud Computing (AWS/Azure)',
    category: 'Technical',
    cost: 2500,
    timeHours: 120,
    difficultyLevel: 3,
    marketDemand: 'Very High',
    salaryIncrease: { min: 8000, max: 25000, typical: 15000 },
    timeToImpact: 6,
    careerBoost: 9,
    description: 'Cloud platforms are the backbone of modern business. High demand, excellent ROI.'
  },
  {
    id: 'data_science',
    name: 'Data Science & Analytics',
    category: 'Technical',
    cost: 3000,
    timeHours: 200,
    difficultyLevel: 4,
    marketDemand: 'Very High',
    salaryIncrease: { min: 12000, max: 35000, typical: 20000 },
    timeToImpact: 9,
    careerBoost: 10,
    description: 'Transform data into business insights. One of the highest-paying skill upgrades.'
  },
  {
    id: 'project_management',
    name: 'Project Management (PMP)',
    category: 'Management',
    cost: 1500,
    timeHours: 80,
    difficultyLevel: 2,
    marketDemand: 'High',
    salaryIncrease: { min: 5000, max: 18000, typical: 10000 },
    timeToImpact: 4,
    careerBoost: 7,
    description: 'Universal skill that applies across industries. Relatively quick to acquire.'
  },
  {
    id: 'digital_marketing',
    name: 'Digital Marketing & SEO',
    category: 'Business',
    cost: 1200,
    timeHours: 60,
    difficultyLevel: 2,
    marketDemand: 'High',
    salaryIncrease: { min: 4000, max: 15000, typical: 8000 },
    timeToImpact: 3,
    careerBoost: 6,
    description: 'Every business needs digital presence. Great for career pivots or side hustles.'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity (CISSP)',
    category: 'Technical',
    cost: 2000,
    timeHours: 150,
    difficultyLevel: 4,
    marketDemand: 'Very High',
    salaryIncrease: { min: 10000, max: 30000, typical: 18000 },
    timeToImpact: 8,
    careerBoost: 9,
    description: 'Critical need with major skills shortage. Excellent job security and growth.'
  },
  {
    id: 'sales_training',
    name: 'Professional Sales Training',
    category: 'Business',
    cost: 800,
    timeHours: 40,
    difficultyLevel: 2,
    marketDemand: 'High',
    salaryIncrease: { min: 3000, max: 20000, typical: 9000 },
    timeToImpact: 2,
    careerBoost: 7,
    description: 'Sales skills are valuable in every role. Quick wins and commission potential.'
  },
  {
    id: 'ux_design',
    name: 'UX/UI Design',
    category: 'Creative',
    cost: 1800,
    timeHours: 100,
    difficultyLevel: 3,
    marketDemand: 'High',
    salaryIncrease: { min: 6000, max: 22000, typical: 12000 },
    timeToImpact: 6,
    careerBoost: 8,
    description: 'Design thinking is crucial for digital products. Creative meets analytical.'
  },
  {
    id: 'financial_analysis',
    name: 'Financial Analysis (CFA Level 1)',
    category: 'Business',
    cost: 2200,
    timeHours: 180,
    difficultyLevel: 4,
    marketDemand: 'Medium',
    salaryIncrease: { min: 8000, max: 25000, typical: 14000 },
    timeToImpact: 12,
    careerBoost: 8,
    description: 'Opens doors to finance roles. Longer timeline but significant impact.'
  }
];

interface CalculationResults {
  totalCost: number;
  totalTimeHours: number;
  projectedIncrease: number;
  roi: number;
  paybackMonths: number;
  fiveYearValue: number;
  careerImpactScore: number;
  timeToFullImpact: number;
}

interface SkillInvestmentCalculatorProps {
  onComplete?: (results: CalculationResults) => void;
}

export default function SkillInvestmentCalculator({ onComplete }: SkillInvestmentCalculatorProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [selectedSkills, setSelectedSkills] = useState<SkillInvestment[]>([]);
  const [currentSalary, setCurrentSalary] = useState(70000);
  const [availableHours, setAvailableHours] = useState(10);
  const [timeframe, setTimeframe] = useState(12);
  const [results, setResults] = useState<CalculationResults | null>(null);

  // Record usage for analytics
  useState(() => {
    recordCalculatorUsage('skill-investment-calculator');
  });

  const toggleSkill = (skill: SkillInvestment) => {
    if (selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const calculateResults = () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill to analyze!');
      return;
    }

    const totalCost = selectedSkills.reduce((sum, skill) => sum + skill.cost, 0);
    const totalTimeHours = selectedSkills.reduce((sum, skill) => sum + skill.timeHours, 0);
    const projectedIncrease = selectedSkills.reduce((sum, skill) => sum + skill.salaryIncrease.typical, 0);
    const avgCareerBoost = selectedSkills.reduce((sum, skill) => sum + skill.careerBoost, 0) / selectedSkills.length;
    const maxTimeToImpact = Math.max(...selectedSkills.map(skill => skill.timeToImpact));

    const roi = totalCost > 0 ? (projectedIncrease / totalCost) * 100 : 0;
    const monthlyIncrease = projectedIncrease / 12;
    const paybackMonths = totalCost > 0 ? totalCost / monthlyIncrease : 0;
    const fiveYearValue = projectedIncrease * 5; // Assumes salary increase compounds
    const timeRequiredMonths = totalTimeHours / (availableHours * 4); // 4 weeks per month

    const calculationResults: CalculationResults = {
      totalCost,
      totalTimeHours,
      projectedIncrease,
      roi,
      paybackMonths,
      fiveYearValue,
      careerImpactScore: avgCareerBoost,
      timeToFullImpact: Math.max(maxTimeToImpact, timeRequiredMonths)
    };

    setResults(calculationResults);
    onComplete?.(calculationResults);

    toast.success(`Analysis complete! ROI: ${roi.toFixed(0)}%`, {
      duration: 3000,
      position: 'top-center',
    });
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'text-green-400';
    if (level <= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'text-green-400';
      case 'High': return 'text-blue-400';
      case 'Medium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical': return <Zap className="w-4 h-4" />;
      case 'Business': return <TrendingUp className="w-4 h-4" />;
      case 'Creative': return <Star className="w-4 h-4" />;
      case 'Management': return <Target className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl`}>
      <div className="text-center mb-6">
        <Calculator className={`w-12 h-12 text-purple-400 mx-auto mb-4`} />
        <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
          Skill Investment ROI Calculator
        </h3>
        <p className={`${theme.textColors.secondary}`}>
          Calculate the return on investment for different skill development paths
        </p>
      </div>

      {!results ? (
        <div className="space-y-6">
          {/* Personal Info */}
          <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Your Situation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Current Salary
                </label>
                <input
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  placeholder="70000"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Available Hours/Week
                </label>
                <input
                  type="number"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  placeholder="10"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Timeline (Months)
                </label>
                <input
                  type="number"
                  value={timeframe}
                  onChange={(e) => setTimeframe(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  placeholder="12"
                />
              </div>
            </div>
          </div>

          {/* Skill Selection */}
          <div>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Select Skills to Invest In ({selectedSkills.length} selected)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillInvestments.map((skill) => {
                const isSelected = selectedSkills.find(s => s.id === skill.id);
                return (
                  <motion.div
                    key={skill.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : `border-gray-600 ${theme.backgrounds.card} hover:border-gray-500`
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(skill.category)}
                        <h5 className={`font-semibold ${theme.textColors.primary}`}>
                          {skill.name}
                        </h5>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDemandColor(skill.marketDemand)}`}>
                        {skill.marketDemand}
                      </span>
                    </div>

                    <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                      {skill.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className={`${theme.textColors.tertiary}`}>Cost:</span>
                        <div className={`font-semibold ${theme.textColors.primary}`}>
                          ${skill.cost.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className={`${theme.textColors.tertiary}`}>Time:</span>
                        <div className={`font-semibold ${theme.textColors.primary}`}>
                          {skill.timeHours}h
                        </div>
                      </div>
                      <div>
                        <span className={`${theme.textColors.tertiary}`}>Salary Boost:</span>
                        <div className={`font-semibold text-green-400`}>
                          ${skill.salaryIncrease.typical.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className={`${theme.textColors.tertiary}`}>Difficulty:</span>
                        <div className={`font-semibold ${getDifficultyColor(skill.difficultyLevel)}`}>
                          {'★'.repeat(skill.difficultyLevel)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={calculateResults}
              disabled={selectedSkills.length === 0}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl font-semibold transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Calculate ROI
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Results Header */}
          <div className="text-center">
            <h4 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
              Investment Analysis Results
            </h4>
            <p className={`${theme.textColors.secondary}`}>
              Based on {selectedSkills.length} selected skill{selectedSkills.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
              <DollarSign className={`w-8 h-8 ${theme.status.info.text} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${theme.status.info.text}`}>
                {results.roi.toFixed(0)}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>ROI</div>
            </div>
            <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
              <TrendingUp className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${theme.status.success.text}`}>
                ${results.projectedIncrease.toLocaleString()}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Annual Increase</div>
            </div>
            <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
              <Clock className={`w-8 h-8 ${theme.status.warning.text} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${theme.status.warning.text}`}>
                {results.paybackMonths.toFixed(1)}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Payback (Months)</div>
            </div>
            <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
              <Award className={`w-8 h-8 ${theme.status.error.text} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${theme.status.error.text}`}>
                {results.careerImpactScore.toFixed(1)}/10
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Career Impact</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h5 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Investment Breakdown
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Total Cost:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    ${results.totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Total Time:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {results.totalTimeHours} hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Time to Complete:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {(results.totalTimeHours / (availableHours * 4)).toFixed(1)} months
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>5-Year Value:</span>
                  <span className={`font-semibold text-green-400`}>
                    ${results.fiveYearValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Time to Impact:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {results.timeToFullImpact.toFixed(1)} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Skills Selected:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {selectedSkills.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Skills Summary */}
          <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h5 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Your Selected Skills
            </h5>
            <div className="space-y-3">
              {selectedSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 bg-slate-800/50 rounded-lg`}
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(skill.category)}
                    <span className={`font-medium ${theme.textColors.primary}`}>
                      {skill.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold text-green-400`}>
                      +${skill.salaryIncrease.typical.toLocaleString()}
                    </div>
                    <div className={`text-sm ${theme.textColors.tertiary}`}>
                      {skill.timeToImpact} months
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Recommendations */}
          <div className={`p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg`}>
            <h5 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Lightbulb className="w-5 h-5" />
              Recommendations
            </h5>
            <ul className="space-y-2">
              {results.roi > 500 && (
                <li className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Excellent ROI! This investment plan is highly recommended.
                </li>
              )}
              {results.paybackMonths < 12 && (
                <li className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Quick payback period - you&apos;ll see returns within a year.
                </li>
              )}
              {results.timeToFullImpact > 18 && (
                <li className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  Consider spreading skills over time to manage workload.
                </li>
              )}
              <li className={`flex items-center gap-2 ${theme.textColors.secondary}`}>
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                Start with the highest-demand skills for faster impact.
              </li>
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setResults(null)}
              className={`px-6 py-3 ${theme.buttons.secondary} rounded-xl font-medium transition-all hover-lift`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Adjust Selection
            </button>
          </div>
        </motion.div>
      )}

      <div className={`mt-6 p-4 bg-slate-800/50 rounded-lg`}>
        <p className={`text-sm ${theme.textColors.secondary} text-center`}>
          💡 This calculator uses industry salary data and typical career progression patterns. Actual results may vary based on location, experience, and market conditions.
        </p>
      </div>
    </div>
  );
}

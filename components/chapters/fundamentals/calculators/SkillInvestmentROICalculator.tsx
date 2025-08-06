'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { motion } from 'framer-motion';

interface ValidationError {
  field: string;
  message: string;
}

interface InputValidation {
  isValid: boolean;
  errors: ValidationError[];
}

interface SkillInvestment {
  id: string;
  skillName: string;
  investmentCost: number;
  timeInvested: number; // hours
  salaryIncrease: number; // percentage
  yearsOfBenefit: number;
  promotionProbability: number; // percentage
  category: 'technical' | 'leadership' | 'business' | 'certification' | 'degree';
}

interface ROIAnalysis {
  totalCost: number;
  yearlyBenefit: number;
  lifetimeBenefit: number;
  roi: number;
  paybackPeriod: number;
  hourlyReturn: number;
}

export default function SkillInvestmentROICalculator() {
  const [currentSalary, setCurrentSalary] = useState<string>('75000');
  const [validation, setValidation] = useState<InputValidation>({
    isValid: true,
    errors: []
  });

  // Enhanced input validation function
  const safeParseFloat = (value: string, min?: number, max?: number): number => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return 0;
    if (min !== undefined && parsed < min) return 0;
    if (max !== undefined && parsed > max) return max;
    return parsed;
  };

  const validateCurrentSalary = (value: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue < 20000) {
      errors.push({
        field: 'currentSalary',
        message: 'Please enter a valid salary (minimum: $20,000)'
      });
    }
    
    if (numValue > 1000000) {
      errors.push({
        field: 'currentSalary',
        message: 'Please enter a reasonable salary (maximum: $1,000,000)'
      });
    }
    
    return errors;
  };

  const handleCurrentSalaryChange = (value: string) => {
    setCurrentSalary(value);
    const errors = validateCurrentSalary(value);
    setValidation({
      isValid: errors.length === 0,
      errors
    });
  };
  const [skillInvestments, setSkillInvestments] = useState<SkillInvestment[]>([
    {
      id: '1',
      skillName: 'Cloud Certification (AWS/Azure)',
      investmentCost: 2500,
      timeInvested: 120,
      salaryIncrease: 15,
      yearsOfBenefit: 5,
      promotionProbability: 25,
      category: 'certification'
    },
    {
      id: '2',
      skillName: 'MBA or Master\'s Degree',
      investmentCost: 80000,
      timeInvested: 1200,
      salaryIncrease: 35,
      yearsOfBenefit: 25,
      promotionProbability: 60,
      category: 'degree'
    },
    {
      id: '3',
      skillName: 'Data Science Bootcamp',
      investmentCost: 15000,
      timeInvested: 600,
      salaryIncrease: 25,
      yearsOfBenefit: 8,
      promotionProbability: 40,
      category: 'technical'
    }
  ]);

  const [newSkill, setNewSkill] = useState<Partial<SkillInvestment>>({
    skillName: '',
    investmentCost: 0,
    timeInvested: 0,
    salaryIncrease: 0,
    yearsOfBenefit: 5,
    promotionProbability: 0,
    category: 'technical'
  });

  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  useEffect(() => {
    recordCalculatorUsage('skill-investment-roi-calculator');
  }, [recordCalculatorUsage]);

  const calculateROI = (skill: SkillInvestment): ROIAnalysis => {
    const salary = safeParseFloat(currentSalary, 20000, 1000000);
    const yearlyIncrease = salary * (skill.salaryIncrease / 100);
    const lifetimeBenefit = yearlyIncrease * skill.yearsOfBenefit;
    
    // Factor in opportunity cost of time (assume $25/hour for learning time)
    const opportunityCost = skill.timeInvested * 25;
    const totalCost = skill.investmentCost + opportunityCost;
    
    const roi = totalCost > 0 ? ((lifetimeBenefit - totalCost) / totalCost) * 100 : 0;
    const paybackPeriod = yearlyIncrease > 0 ? totalCost / yearlyIncrease : 0;
    const hourlyReturn = skill.timeInvested > 0 ? lifetimeBenefit / skill.timeInvested : 0;

    return {
      totalCost,
      yearlyBenefit: yearlyIncrease,
      lifetimeBenefit,
      roi,
      paybackPeriod,
      hourlyReturn
    };
  };

  const addSkill = () => {
    if (newSkill.skillName && newSkill.investmentCost !== undefined) {
      const skill: SkillInvestment = {
        id: Date.now().toString(),
        skillName: newSkill.skillName,
        investmentCost: newSkill.investmentCost || 0,
        timeInvested: newSkill.timeInvested || 0,
        salaryIncrease: newSkill.salaryIncrease || 0,
        yearsOfBenefit: newSkill.yearsOfBenefit || 5,
        promotionProbability: newSkill.promotionProbability || 0,
        category: newSkill.category || 'technical'
      };
      
      setSkillInvestments([...skillInvestments, skill]);
      setNewSkill({
        skillName: '',
        investmentCost: 0,
        timeInvested: 0,
        salaryIncrease: 0,
        yearsOfBenefit: 5,
        promotionProbability: 0,
        category: 'technical'
      });
    }
  };

  const removeSkill = (id: string) => {
    setSkillInvestments(skillInvestments.filter(skill => skill.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'text-blue-400 bg-blue-500/20';
      case 'leadership': return 'text-purple-400 bg-purple-500/20';
      case 'business': return 'text-green-400 bg-green-500/20';
      case 'certification': return 'text-orange-400 bg-orange-500/20';
      case 'degree': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 300) return 'text-green-400';
    if (roi >= 100) return 'text-yellow-400';
    if (roi >= 0) return 'text-orange-400';
    return 'text-red-400';
  };

  const sortedSkills = [...skillInvestments].sort((a, b) => {
    const roiA = calculateROI(a).roi;
    const roiB = calculateROI(b).roi;
    return roiB - roiA;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2 flex items-center justify-center gap-3`}>
          <BookOpen className="w-6 h-6 text-yellow-400" />
          Skill Investment ROI Calculator
        </h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Calculate the return on investment for skills, certifications, and education to maximize your career growth
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Salary Input */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Current Financial Situation
            </h3>
            <div>
              <label 
                htmlFor="currentSalary"
                className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
              >
                Current Annual Salary
              </label>
              <div className="relative">
                <span 
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  $
                </span>
                <input
                  id="currentSalary"
                  type="number"
                  min="20000"
                  max="1000000"
                  step="1000"
                  value={currentSalary}
                  onChange={(e) => handleCurrentSalaryChange(e.target.value)}
                  aria-describedby="currentSalary-help currentSalary-error"
                  aria-invalid={!validation.isValid}
                  className={`pl-8 w-full px-4 py-3 bg-slate-800/50 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all ${
                    !validation.isValid 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-yellow-500'
                  }`}
                  placeholder="75000"
                />
              </div>
              <p id="currentSalary-help" className="text-xs text-slate-500 mt-1">
                Your current annual salary used to calculate skill investment returns
              </p>
              {!validation.isValid && validation.errors.some(error => error.field === 'currentSalary') && (
                <div 
                  id="currentSalary-error" 
                  role="alert" 
                  className="text-xs text-red-400 mt-1"
                >
                  {validation.errors.find(error => error.field === 'currentSalary')?.message}
                </div>
              )}
            </div>
          </div>

          {/* Add New Skill */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Add Custom Skill Investment
            </h3>
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="skillName"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Skill/Certification Name
                </label>
                <input
                  id="skillName"
                  type="text"
                  placeholder="e.g., AWS Certification, Project Management"
                  value={newSkill.skillName}
                  onChange={(e) => setNewSkill({...newSkill, skillName: e.target.value})}
                  aria-describedby="skillName-help"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p id="skillName-help" className="text-xs text-slate-500 mt-1">
                  Name of the skill, certification, or education you want to invest in
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label 
                    htmlFor="investmentCost"
                    className={`block text-xs ${theme.textColors.secondary} mb-1`}
                  >
                    Cost ($)
                  </label>
                  <input
                    id="investmentCost"
                    type="number"
                    min="0"
                    max="500000"
                    step="100"
                    value={newSkill.investmentCost}
                    onChange={(e) => setNewSkill({...newSkill, investmentCost: safeParseFloat(e.target.value, 0, 500000)})}
                    aria-describedby="investmentCost-help"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p id="investmentCost-help" className="text-xs text-slate-500 mt-1">
                    Total monetary cost
                  </p>
                </div>
                <div>
                  <label 
                    htmlFor="timeInvested"
                    className={`block text-xs ${theme.textColors.secondary} mb-1`}
                  >
                    Time (hours)
                  </label>
                  <input
                    id="timeInvested"
                    type="number"
                    min="0"
                    max="5000"
                    step="10"
                    value={newSkill.timeInvested}
                    onChange={(e) => setNewSkill({...newSkill, timeInvested: safeParseFloat(e.target.value, 0, 5000)})}
                    aria-describedby="timeInvested-help"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p id="timeInvested-help" className="text-xs text-slate-500 mt-1">
                    Hours to complete
                  </p>
                </div>
                <div>
                  <label 
                    htmlFor="salaryIncrease"
                    className={`block text-xs ${theme.textColors.secondary} mb-1`}
                  >
                    Salary Increase (%)
                  </label>
                  <input
                    id="salaryIncrease"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={newSkill.salaryIncrease}
                    onChange={(e) => setNewSkill({...newSkill, salaryIncrease: safeParseFloat(e.target.value, 0, 100)})}
                    aria-describedby="salaryIncrease-help"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p id="salaryIncrease-help" className="text-xs text-slate-500 mt-1">
                    Expected raise %
                  </p>
                </div>
                <div>
                  <label 
                    htmlFor="yearsOfBenefit"
                    className={`block text-xs ${theme.textColors.secondary} mb-1`}
                  >
                    Years of Benefit
                  </label>
                  <input
                    id="yearsOfBenefit"
                    type="number"
                    min="1"
                    max="40"
                    step="1"
                    value={newSkill.yearsOfBenefit}
                    onChange={(e) => setNewSkill({...newSkill, yearsOfBenefit: safeParseFloat(e.target.value, 1, 40)})}
                    aria-describedby="yearsOfBenefit-help"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p id="yearsOfBenefit-help" className="text-xs text-slate-500 mt-1">
                    Career impact duration
                  </p>
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="skillCategory"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Skill Category
                </label>
                <select
                  id="skillCategory"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({...newSkill, category: e.target.value as SkillInvestment['category']})}
                  aria-describedby="skillCategory-help"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="technical">Technical Skills</option>
                  <option value="leadership">Leadership</option>
                  <option value="business">Business Skills</option>
                  <option value="certification">Certification</option>
                  <option value="degree">Degree/Education</option>
                </select>
                <p id="skillCategory-help" className="text-xs text-slate-500 mt-1">
                  Choose the category that best describes this skill investment
                </p>
              </div>
              
              <button
                onClick={addSkill}
                disabled={!newSkill.skillName || !newSkill.investmentCost}
                aria-describedby="addSkill-help"
                className={`w-full px-4 py-3 rounded-md transition-colors ${
                  !newSkill.skillName || !newSkill.investmentCost
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : `${theme.buttons.accent} hover:bg-yellow-600`
                }`}
              >
                Add Skill Investment
              </button>
              <p id="addSkill-help" className="text-xs text-slate-500 mt-1">
                Add this skill to your investment analysis portfolio
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
              <Award className="w-5 h-5 text-yellow-400" />
              Skill Investment Analysis (Ranked by ROI)
            </h3>
            
            <div className="space-y-4">
              {sortedSkills.map((skill, index) => {
                const analysis = calculateROI(skill);
                
                return (
                  <motion.div 
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-6 rounded-lg border ${
                      index === 0 ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-white/10 bg-slate-800/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`font-semibold ${index === 0 ? 'text-yellow-400' : theme.textColors.primary}`}>
                            {skill.skillName}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(skill.category)}`}>
                            {skill.category}
                          </span>
                          {index === 0 && (
                            <span className="px-2 py-1 text-xs rounded bg-yellow-500/20 text-yellow-400">
                              Best ROI
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className={theme.textColors.secondary}>Total Cost: </span>
                            <span className={theme.textColors.primary}>{formatCurrency(analysis.totalCost)}</span>
                          </div>
                          <div>
                            <span className={theme.textColors.secondary}>Yearly Benefit: </span>
                            <span className="text-green-400">{formatCurrency(analysis.yearlyBenefit)}</span>
                          </div>
                          <div>
                            <span className={theme.textColors.secondary}>Payback: </span>
                            <span className={theme.textColors.primary}>{analysis.paybackPeriod.toFixed(1)} years</span>
                          </div>
                          <div>
                            <span className={theme.textColors.secondary}>$/Hour: </span>
                            <span className="text-green-400">{formatCurrency(analysis.hourlyReturn)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${getROIColor(analysis.roi)}`}>
                          {analysis.roi.toFixed(0)}%
                        </div>
                        <div className={`text-sm ${theme.textColors.secondary}`}>ROI</div>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          aria-label={`Remove ${skill.skillName} from analysis`}
                          className="mt-2 text-xs text-red-400 hover:text-red-300 focus:ring-2 focus:ring-red-500 focus:outline-none rounded px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                      <div>
                        <span className={`text-sm ${theme.textColors.secondary}`}>Lifetime Benefit: </span>
                        <span className={`font-semibold text-green-400`}>{formatCurrency(analysis.lifetimeBenefit)}</span>
                      </div>
                      <div>
                        <span className={`text-sm ${theme.textColors.secondary}`}>Net Gain: </span>
                        <span className={`font-semibold ${analysis.lifetimeBenefit - analysis.totalCost > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(analysis.lifetimeBenefit - analysis.totalCost)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {skillInvestments.length === 0 && (
                <div className="text-center py-8">
                  <p className={theme.textColors.secondary}>No skill investments added yet. Add one to see the analysis!</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Insights */}
          {skillInvestments.length > 0 && (
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Investment Strategy Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
                  <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Best Investment</div>
                  <div className={`font-semibold ${theme.status.info.text}`}>
                    {sortedSkills[0]?.skillName || 'N/A'}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    {sortedSkills[0] ? `${calculateROI(sortedSkills[0]).roi.toFixed(0)}% ROI` : ''}
                  </div>
                </div>
                
                <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
                  <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Total Investment</div>
                  <div className={`font-semibold ${theme.status.warning.text}`}>
                    {formatCurrency(skillInvestments.reduce((sum, skill) => sum + calculateROI(skill).totalCost, 0))}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    Across all skills
                  </div>
                </div>
                
                <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
                  <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Total Lifetime Benefit</div>
                  <div className={`font-semibold ${theme.status.success.text}`}>
                    {formatCurrency(skillInvestments.reduce((sum, skill) => sum + calculateROI(skill).lifetimeBenefit, 0))}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    Expected career gains
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

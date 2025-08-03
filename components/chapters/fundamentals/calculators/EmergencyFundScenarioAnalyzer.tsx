'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Clock, Users, Building2, Heart, Briefcase } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { motion } from 'framer-motion';

interface ScenarioRisk {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  fundMultiplier: number;
  examples: string[];
}

interface PersonalProfile {
  jobStability: 'stable' | 'variable' | 'unstable';
  incomeType: 'single' | 'dual' | 'multiple';
  dependents: number;
  healthConditions: boolean;
  homeOwnership: 'rent' | 'own' | 'mortgage';
  debtLevel: 'low' | 'medium' | 'high';
}

export default function EmergencyFundScenarioAnalyzer() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('4000');
  const [profile, setProfile] = useState<PersonalProfile>({
    jobStability: 'stable',
    incomeType: 'single',
    dependents: 0,
    healthConditions: false,
    homeOwnership: 'rent',
    debtLevel: 'low'
  });
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  
  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  useEffect(() => {
    recordCalculatorUsage('emergency-fund-scenario-analyzer');
  }, [recordCalculatorUsage]);

  const riskScenarios: ScenarioRisk[] = [
    {
      id: 'job_loss',
      name: 'Job Loss',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Unexpected unemployment requiring job search time',
      probability: 'medium',
      impact: 'high',
      fundMultiplier: 1.0,
      examples: ['Company layoffs', 'Business closure', 'Industry downturn', 'Performance issues']
    },
    {
      id: 'medical_emergency',
      name: 'Medical Emergency',
      icon: <Heart className="w-5 h-5" />,
      description: 'Serious health issues with treatment costs and lost income',
      probability: 'medium',
      impact: 'high',
      fundMultiplier: 0.8,
      examples: ['Unexpected surgery', 'Chronic illness', 'Accident recovery', 'Mental health crisis']
    },
    {
      id: 'home_repairs',
      name: 'Major Home Repairs',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Critical home maintenance that cannot be delayed',
      probability: 'high',
      impact: 'medium',
      fundMultiplier: 0.5,
      examples: ['Roof replacement', 'HVAC failure', 'Plumbing emergency', 'Foundation issues']
    },
    {
      id: 'family_emergency',
      name: 'Family Emergency',
      icon: <Users className="w-5 h-5" />,
      description: 'Supporting family members in crisis situations',
      probability: 'medium',
      impact: 'medium',
      fundMultiplier: 0.6,
      examples: ['Elderly parent care', 'Child emergency', 'Funeral expenses', 'Family relocation']
    },
    {
      id: 'economic_recession',
      name: 'Economic Recession',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Extended economic downturn affecting multiple income sources',
      probability: 'low',
      impact: 'high',
      fundMultiplier: 1.5,
      examples: ['Market crash', 'Industry collapse', 'Regional economic crisis', 'Global pandemic']
    },
    {
      id: 'natural_disaster',
      name: 'Natural Disaster',
      icon: <AlertTriangle className="w-5 h-5" />,
      description: 'Weather or natural events requiring evacuation or major expenses',
      probability: 'low',
      impact: 'high',
      fundMultiplier: 0.7,
      examples: ['Hurricane damage', 'Earthquake', 'Wildfire evacuation', 'Flooding']
    }
  ];

  const calculateRiskScore = (): number => {
    let baseScore = 3; // Base 3 months

    // Job stability adjustment
    if (profile.jobStability === 'variable') baseScore += 1;
    if (profile.jobStability === 'unstable') baseScore += 2;

    // Income type adjustment
    if (profile.incomeType === 'single') baseScore += 1;
    
    // Dependents adjustment
    baseScore += profile.dependents * 0.5;

    // Health conditions
    if (profile.healthConditions) baseScore += 1;

    // Home ownership
    if (profile.homeOwnership === 'own' || profile.homeOwnership === 'mortgage') baseScore += 0.5;

    // Debt level
    if (profile.debtLevel === 'medium') baseScore += 0.5;
    if (profile.debtLevel === 'high') baseScore += 1;

    // Selected scenarios
    selectedScenarios.forEach(scenarioId => {
      const scenario = riskScenarios.find(s => s.id === scenarioId);
      if (scenario) {
        baseScore += scenario.fundMultiplier;
      }
    });

    return Math.min(Math.max(baseScore, 1), 12); // Cap between 1-12 months
  };

  const riskScore = calculateRiskScore();
  const recommendedFund = parseFloat(monthlyExpenses) * riskScore;

  const getRiskLevel = (score: number): { level: string; color: string; description: string } => {
    if (score <= 3) return { 
      level: 'Conservative', 
      color: 'text-green-400', 
      description: 'Standard emergency fund for stable situations' 
    };
    if (score <= 6) return { 
      level: 'Moderate', 
      color: 'text-yellow-400', 
      description: 'Enhanced protection for variable income or dependents' 
    };
    if (score <= 9) return { 
      level: 'Aggressive', 
      color: 'text-orange-400', 
      description: 'High protection for unstable income or multiple risks' 
    };
    return { 
      level: 'Maximum', 
      color: 'text-red-400', 
      description: 'Maximum protection for high-risk situations' 
    };
  };

  const riskInfo = getRiskLevel(riskScore);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2 flex items-center justify-center gap-3`}>
          <Shield className="w-6 h-6 text-amber-400" />
          Emergency Fund Scenario Analyzer
        </h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Analyze your personal risk factors and life situations to determine your optimal emergency fund size
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Monthly Expenses */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Monthly Essential Expenses
            </h3>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
                className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="4000"
              />
            </div>
            <p className={`text-sm ${theme.textColors.secondary} mt-2`}>
              Include only essential expenses: housing, utilities, groceries, insurance, minimum debt payments
            </p>
          </div>

          {/* Personal Risk Profile */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Personal Risk Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Job Stability
                </label>
                <select
                  value={profile.jobStability}
                  onChange={(e) => setProfile({...profile, jobStability: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="stable">Stable (government, tenured, large corp)</option>
                  <option value="variable">Variable (sales, seasonal, contract)</option>
                  <option value="unstable">Unstable (startup, commission only)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Household Income Type
                </label>
                <select
                  value={profile.incomeType}
                  onChange={(e) => setProfile({...profile, incomeType: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="single">Single income earner</option>
                  <option value="dual">Dual income household</option>
                  <option value="multiple">Multiple income sources</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Number of Dependents
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={profile.dependents}
                  onChange={(e) => setProfile({...profile, dependents: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Housing Situation
                </label>
                <select
                  value={profile.homeOwnership}
                  onChange={(e) => setProfile({...profile, homeOwnership: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="rent">Renting</option>
                  <option value="own">Own home (no mortgage)</option>
                  <option value="mortgage">Own home (with mortgage)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="healthConditions"
                  checked={profile.healthConditions}
                  onChange={(e) => setProfile({...profile, healthConditions: e.target.checked})}
                  className="w-4 h-4 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="healthConditions" className={`text-sm ${theme.textColors.secondary}`}>
                  Chronic health conditions or high medical risks
                </label>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Current Debt Level
                </label>
                <select
                  value={profile.debtLevel}
                  onChange={(e) => setProfile({...profile, debtLevel: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="low">Low (&lt;20% of income)</option>
                  <option value="medium">Medium (20-40% of income)</option>
                  <option value="high">High (&gt;40% of income)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Risk Scenarios */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Potential Emergency Scenarios
            </h3>
            <p className={`text-sm ${theme.textColors.secondary} mb-4`}>
              Select scenarios that are relevant to your situation:
            </p>
            <div className="space-y-3">
              {riskScenarios.map((scenario) => (
                <div key={scenario.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={scenario.id}
                      checked={selectedScenarios.includes(scenario.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedScenarios([...selectedScenarios, scenario.id]);
                        } else {
                          setSelectedScenarios(selectedScenarios.filter(id => id !== scenario.id));
                        }
                      }}
                      className="w-4 h-4 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      {scenario.icon}
                      <label htmlFor={scenario.id} className={`text-sm font-medium ${theme.textColors.primary} cursor-pointer`}>
                        {scenario.name}
                      </label>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <span className={`px-2 py-1 text-xs rounded ${getProbabilityColor(scenario.probability)}`}>
                        {scenario.probability} prob.
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getImpactColor(scenario.impact)}`}>
                        {scenario.impact} impact
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs ${theme.textColors.secondary} ml-7`}>
                    {scenario.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Recommendation */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Clock className="w-5 h-5 text-amber-400" />
              Your Recommended Emergency Fund
            </h3>
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-amber-400">
                  {formatCurrency(recommendedFund)}
                </div>
                <div className={`text-lg ${theme.textColors.secondary}`}>
                  {riskScore.toFixed(1)} months of expenses
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${riskInfo.color} bg-current bg-opacity-20`}>
                  {riskInfo.level} Protection Level
                </div>
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                {riskInfo.description}
              </p>
            </div>
          </div>

          {/* Risk Breakdown */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Risk Factor Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={theme.textColors.secondary}>Base emergency fund</span>
                <span className={theme.textColors.primary}>3.0 months</span>
              </div>
              
              {profile.jobStability !== 'stable' && (
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Job instability</span>
                  <span className="text-orange-400">+{profile.jobStability === 'variable' ? '1.0' : '2.0'} months</span>
                </div>
              )}
              
              {profile.incomeType === 'single' && (
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Single income household</span>
                  <span className="text-orange-400">+1.0 months</span>
                </div>
              )}
              
              {profile.dependents > 0 && (
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>{profile.dependents} dependents</span>
                  <span className="text-orange-400">+{(profile.dependents * 0.5).toFixed(1)} months</span>
                </div>
              )}
              
              {profile.healthConditions && (
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Health risk factors</span>
                  <span className="text-orange-400">+1.0 months</span>
                </div>
              )}
              
              {(profile.homeOwnership === 'own' || profile.homeOwnership === 'mortgage') && (
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Home ownership</span>
                  <span className="text-orange-400">+0.5 months</span>
                </div>
              )}
              
              {profile.debtLevel !== 'low' && (
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Debt burden</span>
                  <span className="text-orange-400">+{profile.debtLevel === 'medium' ? '0.5' : '1.0'} months</span>
                </div>
              )}
              
              {selectedScenarios.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Selected risk scenarios</span>
                  <span className="text-orange-400">
                    +{selectedScenarios.reduce((acc, scenarioId) => {
                      const scenario = riskScenarios.find(s => s.id === scenarioId);
                      return acc + (scenario?.fundMultiplier || 0);
                    }, 0).toFixed(1)} months
                  </span>
                </div>
              )}
              
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center font-semibold">
                  <span className={theme.textColors.primary}>Total Recommended</span>
                  <span className="text-amber-400">{riskScore.toFixed(1)} months</span>
                </div>
              </div>
            </div>
          </div>

          {/* Building Strategy */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Building Strategy
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-amber-400">Phase 1: Initial Safety Net</h4>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Start with $1,000 for immediate small emergencies while paying down high-interest debt.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-amber-400">Phase 2: Core Emergency Fund</h4>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Build to 3 months of expenses ({formatCurrency(parseFloat(monthlyExpenses) * 3)}) for basic protection.
                </p>
              </div>
              
              {riskScore > 3 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-400">Phase 3: Enhanced Protection</h4>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Extend to {riskScore.toFixed(1)} months ({formatCurrency(recommendedFund)}) based on your risk factors.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium text-amber-400">Storage Location</h4>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Use high-yield savings accounts (4%+ APY) for easy access while earning interest.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

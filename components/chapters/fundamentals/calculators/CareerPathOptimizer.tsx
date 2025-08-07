'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  Briefcase,
  Target,
  BarChart3,
  Star
} from 'lucide-react';

interface CareerPath {
  id: string;
  title: string;
  industry: string;
  startingSalary: number;
  peakSalary: number;
  yearsToReachPeak: number;
  annualGrowthRate: number;
  requiredSkills: string[];
  educationRequired: string;
  jobSecurity: 'Low' | 'Medium' | 'High';
  workLifeBalance: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  marketDemand: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
}

interface CareerMetrics {
  lifetimeEarnings: number;
  avgAnnualSalary: number;
  timeToBreakeven: number;
  roi: number;
  riskScore: number;
  satisfactionScore: number;
}

export default function CareerPathOptimizer() {
  const [currentAge, setCurrentAge] = useState(28);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSalary, setCurrentSalary] = useState(75000);
  const [educationCost, setEducationCost] = useState(0);
  const [priorityWeights, setPriorityWeights] = useState({
    earnings: 40,
    security: 25,
    workLife: 20,
    growth: 15
  });

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('career-path-optimizer');
  }, [recordCalculatorUsage]);

  const careerPaths: CareerPath[] = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      industry: 'Technology',
      startingSalary: 85000,
      peakSalary: 200000,
      yearsToReachPeak: 12,
      annualGrowthRate: 8,
      requiredSkills: ['Programming', 'Problem Solving', 'System Design', 'Algorithms'],
      educationRequired: "Bachelor's in CS or Bootcamp",
      jobSecurity: 'High',
      workLifeBalance: 'Good',
      marketDemand: 'Very High',
      description: 'Design and develop software applications and systems'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      industry: 'Technology/Analytics',
      startingSalary: 95000,
      peakSalary: 180000,
      yearsToReachPeak: 10,
      annualGrowthRate: 7,
      requiredSkills: ['Statistics', 'Python/R', 'Machine Learning', 'Data Visualization'],
      educationRequired: "Master's in Data Science or related field",
      jobSecurity: 'High',
      workLifeBalance: 'Good',
      marketDemand: 'Very High',
      description: 'Extract insights from data to drive business decisions'
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      industry: 'Technology/Business',
      startingSalary: 110000,
      peakSalary: 250000,
      yearsToReachPeak: 8,
      annualGrowthRate: 9,
      requiredSkills: ['Strategy', 'Communication', 'Analytics', 'Leadership'],
      educationRequired: "Bachelor's + MBA preferred",
      jobSecurity: 'Medium',
      workLifeBalance: 'Fair',
      marketDemand: 'High',
      description: 'Lead product development and strategy initiatives'
    },
    {
      id: 'investment-banker',
      title: 'Investment Banker',
      industry: 'Finance',
      startingSalary: 150000,
      peakSalary: 500000,
      yearsToReachPeak: 15,
      annualGrowthRate: 12,
      requiredSkills: ['Financial Modeling', 'Valuation', 'Client Relations', 'Excel'],
      educationRequired: "Bachelor's in Finance/Economics + MBA",
      jobSecurity: 'Medium',
      workLifeBalance: 'Poor',
      marketDemand: 'Medium',
      description: 'Provide financial advisory services and execute transactions'
    },
    {
      id: 'healthcare-admin',
      title: 'Healthcare Administrator',
      industry: 'Healthcare',
      startingSalary: 70000,
      peakSalary: 150000,
      yearsToReachPeak: 12,
      annualGrowthRate: 5,
      requiredSkills: ['Management', 'Healthcare Knowledge', 'Budgeting', 'Compliance'],
      educationRequired: "Master's in Healthcare Administration",
      jobSecurity: 'High',
      workLifeBalance: 'Good',
      marketDemand: 'High',
      description: 'Manage healthcare facilities and coordinate patient care'
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing Manager',
      industry: 'Marketing/Technology',
      startingSalary: 65000,
      peakSalary: 130000,
      yearsToReachPeak: 8,
      annualGrowthRate: 6,
      requiredSkills: ['SEO/SEM', 'Analytics', 'Content Strategy', 'Social Media'],
      educationRequired: "Bachelor's in Marketing or self-taught",
      jobSecurity: 'Medium',
      workLifeBalance: 'Good',
      marketDemand: 'High',
      description: 'Develop and execute digital marketing campaigns'
    }
  ];

  const calculateCareerMetrics = (path: CareerPath): CareerMetrics => {
    const workingYears = retirementAge - currentAge;
    const growthYears = Math.min(path.yearsToReachPeak, workingYears);
    
    // Calculate lifetime earnings with compound growth
    let lifetimeEarnings = 0;
    let currentYearSalary = path.startingSalary;
    
    for (let year = 0; year < workingYears; year++) {
      lifetimeEarnings += currentYearSalary;
      
      if (year < growthYears) {
        currentYearSalary *= (1 + path.annualGrowthRate / 100);
      } else {
        // After peak, assume 3% annual inflation adjustments
        currentYearSalary *= 1.03;
      }
    }
    
    const avgAnnualSalary = lifetimeEarnings / workingYears;
    
    // Calculate time to break even if career change involves education cost
    const timeToBreakeven = educationCost > 0 
      ? educationCost / Math.max(path.startingSalary - currentSalary, 1) 
      : 0;
    
    // Calculate ROI
    const totalInvestment = educationCost + (currentSalary * timeToBreakeven);
    const roi = totalInvestment > 0 
      ? ((lifetimeEarnings - (currentSalary * workingYears)) / totalInvestment) * 100 
      : 0;
    
    // Risk score (lower is better)
    const securityScore = path.jobSecurity === 'High' ? 1 : path.jobSecurity === 'Medium' ? 2 : 3;
    const demandScore = path.marketDemand === 'Very High' ? 1 : path.marketDemand === 'High' ? 2 : path.marketDemand === 'Medium' ? 3 : 4;
    const riskScore = (securityScore + demandScore) / 2;
    
    // Satisfaction score
    const workLifeScore = path.workLifeBalance === 'Excellent' ? 4 : path.workLifeBalance === 'Good' ? 3 : path.workLifeBalance === 'Fair' ? 2 : 1;
    const satisfactionScore = workLifeScore;
    
    return {
      lifetimeEarnings,
      avgAnnualSalary,
      timeToBreakeven,
      roi,
      riskScore,
      satisfactionScore
    };
  };

  const calculateWeightedScore = (path: CareerPath, metrics: CareerMetrics): number => {
    // Normalize metrics to 0-100 scale
    const maxEarnings = Math.max(...careerPaths.map(p => calculateCareerMetrics(p).lifetimeEarnings));
    const earningsScore = (metrics.lifetimeEarnings / maxEarnings) * 100;
    
    const securityScore = path.jobSecurity === 'High' ? 100 : path.jobSecurity === 'Medium' ? 60 : 20;
    const workLifeScore = path.workLifeBalance === 'Excellent' ? 100 : path.workLifeBalance === 'Good' ? 75 : path.workLifeBalance === 'Fair' ? 50 : 25;
    const growthScore = Math.min(path.annualGrowthRate * 10, 100);
    
    return (
      (earningsScore * priorityWeights.earnings / 100) +
      (securityScore * priorityWeights.security / 100) +
      (workLifeScore * priorityWeights.workLife / 100) +
      (growthScore * priorityWeights.growth / 100)
    );
  };

  const pathsWithMetrics = careerPaths.map(path => ({
    path,
    metrics: calculateCareerMetrics(path),
    score: 0
  })).map(item => ({
    ...item,
    score: calculateWeightedScore(item.path, item.metrics)
  })).sort((a, b) => b.score - a.score);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const updatePriorityWeight = (key: keyof typeof priorityWeights, value: number) => {
    const newWeights = { ...priorityWeights, [key]: value };
    const total = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
    
    if (total <= 100) {
      setPriorityWeights(newWeights);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Career Timeline</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(parseInt(e.target.value) || 18)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="28"
                  aria-label="Current age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Retirement Age
                </label>
                <input
                  type="number"
                  min="50"
                  max="80"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(parseInt(e.target.value) || 65)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="65"
                  aria-label="Retirement age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Current Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="20000"
                    step="1000"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 20000)}
                    className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                    placeholder="75000"
                    aria-label="Current annual salary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Education/Training Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={educationCost}
                    onChange={(e) => setEducationCost(parseFloat(e.target.value) || 0)}
                    className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                    placeholder="0"
                    aria-label="Education or training cost"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Cost for degrees, certifications, or bootcamps
                </p>
              </div>
            </div>
          </motion.div>

          {/* Priority Weights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Career Priorities</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Earnings Potential ({priorityWeights.earnings}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorityWeights.earnings}
                  onChange={(e) => updatePriorityWeight('earnings', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Earnings potential priority weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Job Security ({priorityWeights.security}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorityWeights.security}
                  onChange={(e) => updatePriorityWeight('security', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Job security priority weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Work-Life Balance ({priorityWeights.workLife}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorityWeights.workLife}
                  onChange={(e) => updatePriorityWeight('workLife', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Work-life balance priority weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Growth Potential ({priorityWeights.growth}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorityWeights.growth}
                  onChange={(e) => updatePriorityWeight('growth', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  aria-label="Growth potential priority weight"
                />
              </div>

              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-sm text-slate-300">
                  Total: {Object.values(priorityWeights).reduce((sum, val) => sum + val, 0)}%
                </div>
                {Object.values(priorityWeights).reduce((sum, val) => sum + val, 0) !== 100 && (
                  <div className="text-xs text-yellow-400 mt-1">
                    Adjust weights to total 100%
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Career Path Rankings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Optimized Career Paths</h3>
            </div>

            <div className="space-y-4">
              {pathsWithMetrics.map((item, index) => (
                <div
                  key={item.path.id}
                  className={`p-6 border rounded-lg transition-all hover:border-green-400/50 ${
                    index === 0 
                      ? 'border-green-400 bg-green-400/5' 
                      : 'border-slate-600 bg-slate-700/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {index === 0 && <Star className="w-5 h-5 text-yellow-400" />}
                        <h4 className="text-lg font-semibold text-white">{item.path.title}</h4>
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                          {item.path.industry}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{item.path.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score.toFixed(0)}
                      </div>
                      <div className="text-xs text-slate-400">Match Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-green-400 font-semibold">
                        {formatCurrency(item.metrics.lifetimeEarnings)}
                      </div>
                      <div className="text-xs text-slate-400">Lifetime Earnings</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-blue-400 font-semibold">
                        {formatCurrency(item.path.startingSalary)} - {formatCurrency(item.path.peakSalary)}
                      </div>
                      <div className="text-xs text-slate-400">Salary Range</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-purple-400 font-semibold">
                        {item.path.annualGrowthRate}%
                      </div>
                      <div className="text-xs text-slate-400">Annual Growth</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-yellow-400 font-semibold">
                        {item.metrics.timeToBreakeven > 0 ? `${item.metrics.timeToBreakeven.toFixed(1)} yrs` : 'Immediate'}
                      </div>
                      <div className="text-xs text-slate-400">Break-even</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white font-medium mb-2">Key Requirements:</div>
                      <div className="text-slate-300 mb-2">{item.path.educationRequired}</div>
                      <div className="flex flex-wrap gap-1">
                        {item.path.requiredSkills.slice(0, 3).map((skill) => (
                          <span key={skill} className="px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded">
                            {skill}
                          </span>
                        ))}
                        {item.path.requiredSkills.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded">
                            +{item.path.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-medium mb-2">Career Outlook:</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Job Security:</span>
                          <span className={item.path.jobSecurity === 'High' ? 'text-green-400' : item.path.jobSecurity === 'Medium' ? 'text-yellow-400' : 'text-red-400'}>
                            {item.path.jobSecurity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Work-Life Balance:</span>
                          <span className={item.path.workLifeBalance === 'Excellent' || item.path.workLifeBalance === 'Good' ? 'text-green-400' : 'text-yellow-400'}>
                            {item.path.workLifeBalance}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Market Demand:</span>
                          <span className={item.path.marketDemand === 'Very High' || item.path.marketDemand === 'High' ? 'text-green-400' : 'text-yellow-400'}>
                            {item.path.marketDemand}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Career Strategy Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h3 className="text-lg font-bold text-white mb-4">💡 Career Optimization Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Focus on high-growth industries like technology, healthcare, and renewable energy
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Invest in skills that are hard to automate: creativity, emotional intelligence, complex problem-solving
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Build a strong professional network through industry events, LinkedIn, and mentorship
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Consider remote-first roles to access global opportunities and better work-life balance
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Regularly reassess your career path and be open to pivoting based on market changes
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

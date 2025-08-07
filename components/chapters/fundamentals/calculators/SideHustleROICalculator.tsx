'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  Clock,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface SideHustleOption {
  id: string;
  name: string;
  category: string;
  initialInvestment: number;
  monthlyRevenuePotential: number;
  monthlyExpenses: number;
  hoursPerWeek: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToBreakeven: number;
  scalability: 'Low' | 'Medium' | 'High';
  passiveIncomePotential: 'Low' | 'Medium' | 'High';
  description: string;
  pros: string[];
  cons: string[];
}

interface ROIMetrics {
  monthlyProfit: number;
  annualProfit: number;
  hourlyRate: number;
  roi: number;
  paybackPeriod: number;
  netPresentValue: number;
  totalTimeInvestment: number;
}

export default function SideHustleROICalculator() {
  const [availableHours, setAvailableHours] = useState(10);
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState(1000);
  const [initialBudget, setInitialBudget] = useState(500);
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate');
  const [timeHorizon, setTimeHorizon] = useState(12); // months
  const [selectedHustle, setSelectedHustle] = useState<string>('');

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('side-hustle-roi-calculator');
  }, [recordCalculatorUsage]);

  const sideHustleOptions: SideHustleOption[] = [
    {
      id: 'freelance-writing',
      name: 'Freelance Writing',
      category: 'Content Creation',
      initialInvestment: 100,
      monthlyRevenuePotential: 2000,
      monthlyExpenses: 50,
      hoursPerWeek: 15,
      skillLevel: 'Intermediate',
      timeToBreakeven: 1,
      scalability: 'High',
      passiveIncomePotential: 'Low',
      description: 'Write articles, blog posts, and marketing content for businesses',
      pros: ['Flexible schedule', 'High demand', 'Skill development', 'Remote work'],
      cons: ['Income fluctuation', 'Client dependency', 'Deadlines', 'Continuous learning required']
    },
    {
      id: 'dropshipping',
      name: 'Dropshipping Store',
      category: 'E-commerce',
      initialInvestment: 1000,
      monthlyRevenuePotential: 3000,
      monthlyExpenses: 500,
      hoursPerWeek: 20,
      skillLevel: 'Intermediate',
      timeToBreakeven: 3,
      scalability: 'High',
      passiveIncomePotential: 'Medium',
      description: 'Sell products online without holding inventory',
      pros: ['Scalable', 'No inventory', 'Global reach', 'Automation potential'],
      cons: ['High competition', 'Marketing costs', 'Supplier dependency', 'Customer service']
    },
    {
      id: 'online-tutoring',
      name: 'Online Tutoring',
      category: 'Education',
      initialInvestment: 200,
      monthlyRevenuePotential: 1500,
      monthlyExpenses: 100,
      hoursPerWeek: 12,
      skillLevel: 'Beginner',
      timeToBreakeven: 1,
      scalability: 'Medium',
      passiveIncomePotential: 'Low',
      description: 'Teach students online in your area of expertise',
      pros: ['Rewarding work', 'Flexible hours', 'Growing demand', 'Low startup cost'],
      cons: ['Limited scalability', 'Time-intensive', 'Seasonal demand', 'Platform fees']
    },
    {
      id: 'youtube-channel',
      name: 'YouTube Channel',
      category: 'Content Creation',
      initialInvestment: 800,
      monthlyRevenuePotential: 2500,
      monthlyExpenses: 200,
      hoursPerWeek: 25,
      skillLevel: 'Advanced',
      timeToBreakeven: 6,
      scalability: 'High',
      passiveIncomePotential: 'High',
      description: 'Create video content and monetize through ads and sponsorships',
      pros: ['Passive income potential', 'Creative outlet', 'Global audience', 'Multiple revenue streams'],
      cons: ['Slow growth', 'Algorithm dependency', 'Time-intensive', 'Equipment costs']
    },
    {
      id: 'print-on-demand',
      name: 'Print-on-Demand',
      category: 'Design',
      initialInvestment: 300,
      monthlyRevenuePotential: 800,
      monthlyExpenses: 100,
      hoursPerWeek: 8,
      skillLevel: 'Beginner',
      timeToBreakeven: 2,
      scalability: 'Medium',
      passiveIncomePotential: 'High',
      description: 'Design and sell custom products like t-shirts, mugs, and posters',
      pros: ['No inventory', 'Creative work', 'Passive income', 'Low maintenance'],
      cons: ['Low profit margins', 'High competition', 'Design skills needed', 'Marketing required']
    },
    {
      id: 'affiliate-marketing',
      name: 'Affiliate Marketing',
      category: 'Marketing',
      initialInvestment: 500,
      monthlyRevenuePotential: 2000,
      monthlyExpenses: 150,
      hoursPerWeek: 15,
      skillLevel: 'Intermediate',
      timeToBreakeven: 4,
      scalability: 'High',
      passiveIncomePotential: 'High',
      description: 'Promote products and earn commissions on sales',
      pros: ['No product creation', 'Passive income potential', 'Scalable', 'Multiple niches'],
      cons: ['Slow initial growth', 'Commission dependency', 'Trust building', 'Content creation']
    },
    {
      id: 'virtual-assistant',
      name: 'Virtual Assistant',
      category: 'Services',
      initialInvestment: 150,
      monthlyRevenuePotential: 1800,
      monthlyExpenses: 75,
      hoursPerWeek: 18,
      skillLevel: 'Beginner',
      timeToBreakeven: 1,
      scalability: 'Medium',
      passiveIncomePotential: 'Low',
      description: 'Provide administrative support to businesses remotely',
      pros: ['Quick start', 'Stable income', 'Skill development', 'Remote work'],
      cons: ['Time for money', 'Client dependency', 'Limited growth', 'Administrative tasks']
    },
    {
      id: 'online-course',
      name: 'Online Course Creation',
      category: 'Education',
      initialInvestment: 600,
      monthlyRevenuePotential: 3000,
      monthlyExpenses: 100,
      hoursPerWeek: 30,
      skillLevel: 'Advanced',
      timeToBreakeven: 3,
      scalability: 'High',
      passiveIncomePotential: 'High',
      description: 'Create and sell educational courses in your expertise area',
      pros: ['High passive income', 'Scalable', 'Share expertise', 'One-time creation'],
      cons: ['Time-intensive upfront', 'Marketing required', 'Platform competition', 'Content updates']
    }
  ];

  const calculateROI = (hustle: SideHustleOption): ROIMetrics => {
    const weeklyHours = Math.min(hustle.hoursPerWeek, availableHours);
    const monthlyHours = weeklyHours * 4.33; // Average weeks per month
    
    // Adjust revenue based on available time
    const timeEfficiency = weeklyHours / hustle.hoursPerWeek;
    const adjustedMonthlyRevenue = hustle.monthlyRevenuePotential * timeEfficiency;
    
    const monthlyProfit = adjustedMonthlyRevenue - hustle.monthlyExpenses;
    const annualProfit = monthlyProfit * 12;
    const hourlyRate = monthlyProfit / monthlyHours;
    
    const roi = hustle.initialInvestment > 0 
      ? (annualProfit / hustle.initialInvestment) * 100 
      : Infinity;
    
    const paybackPeriod = monthlyProfit > 0 
      ? hustle.initialInvestment / monthlyProfit 
      : Infinity;
    
    // NPV calculation with 5% discount rate
    const discountRate = 0.05 / 12; // Monthly rate
    let npv = -hustle.initialInvestment;
    for (let month = 1; month <= timeHorizon; month++) {
      npv += monthlyProfit / Math.pow(1 + discountRate, month);
    }
    
    const totalTimeInvestment = monthlyHours * timeHorizon;
    
    return {
      monthlyProfit,
      annualProfit,
      hourlyRate,
      roi,
      paybackPeriod,
      netPresentValue: npv,
      totalTimeInvestment
    };
  };

  // Filter and rank hustles based on user criteria
  const filteredHustles = sideHustleOptions
    .filter(hustle => {
      if (hustle.initialInvestment > initialBudget) return false;
      if (hustle.hoursPerWeek > availableHours * 1.5) return false; // Allow some flexibility
      return true;
    })
    .map(hustle => ({
      hustle,
      metrics: calculateROI(hustle)
    }))
    .sort((a, b) => {
      // Sort by ROI, then by monthly profit
      if (b.metrics.roi !== a.metrics.roi) {
        return b.metrics.roi - a.metrics.roi;
      }
      return b.metrics.monthlyProfit - a.metrics.monthlyProfit;
    });

  const selectedHustleData = filteredHustles.find(item => item.hustle.id === selectedHustle);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 100) return 'text-green-400';
    if (roi >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScalabilityColor = (scalability: string) => {
    if (scalability === 'High') return 'text-green-400';
    if (scalability === 'Medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Personal Constraints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Your Constraints</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Available Hours per Week
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="10"
                  aria-label="Available hours per week"
                />
                <p className="text-xs text-slate-400 mt-1">
                  How many hours can you dedicate weekly?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Target Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={targetMonthlyIncome}
                    onChange={(e) => setTargetMonthlyIncome(parseFloat(e.target.value) || 100)}
                    className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                    placeholder="1000"
                    aria-label="Target monthly income"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Initial Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={initialBudget}
                    onChange={(e) => setInitialBudget(parseFloat(e.target.value) || 0)}
                    className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                    placeholder="500"
                    aria-label="Initial budget for startup costs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Risk Tolerance
                </label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value as 'Conservative' | 'Moderate' | 'Aggressive')}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  aria-label="Risk tolerance level"
                >
                  <option value="Conservative">Conservative (Low risk, steady income)</option>
                  <option value="Moderate">Moderate (Balanced risk/reward)</option>
                  <option value="Aggressive">Aggressive (High risk, high reward)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Time Horizon (Months)
                </label>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(parseInt(e.target.value) || 3)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  placeholder="12"
                  aria-label="Time horizon in months"
                />
                <p className="text-xs text-slate-400 mt-1">
                  How long do you plan to run this side hustle?
                </p>
              </div>
            </div>
          </motion.div>

          {/* Selected Hustle Details */}
          {selectedHustleData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Selected Analysis</h3>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {selectedHustleData.hustle.name}
                  </h4>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {formatCurrency(selectedHustleData.metrics.monthlyProfit)}
                  </div>
                  <div className="text-slate-300">Monthly Profit</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-slate-700/30 rounded">
                    <div className="text-blue-400 font-semibold">
                      {formatCurrency(selectedHustleData.metrics.hourlyRate)}
                    </div>
                    <div className="text-xs text-slate-400">Hourly Rate</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded">
                    <div className={`font-semibold ${getROIColor(selectedHustleData.metrics.roi)}`}>
                      {selectedHustleData.metrics.roi === Infinity ? '∞' : `${selectedHustleData.metrics.roi.toFixed(0)}%`}
                    </div>
                    <div className="text-xs text-slate-400">Annual ROI</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-white font-medium mb-2">Key Metrics:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Payback Period:</span>
                      <span className="text-white">
                        {selectedHustleData.metrics.paybackPeriod === Infinity 
                          ? 'Never' 
                          : `${selectedHustleData.metrics.paybackPeriod.toFixed(1)} months`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Net Present Value:</span>
                      <span className={selectedHustleData.metrics.netPresentValue > 0 ? 'text-green-400' : 'text-red-400'}>
                        {formatCurrency(selectedHustleData.metrics.netPresentValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Time Investment:</span>
                      <span className="text-white">
                        {selectedHustleData.metrics.totalTimeInvestment.toFixed(0)} hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Side Hustle Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Side Hustle Options</h3>
              <span className="text-sm text-slate-400">
                ({filteredHustles.length} options match your criteria)
              </span>
            </div>

            <div className="space-y-4">
              {filteredHustles.map((item) => (
                <div
                  key={item.hustle.id}
                  className={`p-6 border rounded-lg cursor-pointer transition-all hover:border-green-400/50 ${
                    selectedHustle === item.hustle.id 
                      ? 'border-green-400 bg-green-400/5' 
                      : 'border-slate-600 bg-slate-700/20'
                  }`}
                  onClick={() => setSelectedHustle(item.hustle.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{item.hustle.name}</h4>
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                          {item.hustle.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.hustle.skillLevel === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                          item.hustle.skillLevel === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {item.hustle.skillLevel}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{item.hustle.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {formatCurrency(item.metrics.monthlyProfit)}
                      </div>
                      <div className="text-xs text-slate-400">Monthly Profit</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-blue-400 font-semibold">
                        {formatCurrency(item.metrics.hourlyRate)}
                      </div>
                      <div className="text-xs text-slate-400">Hourly Rate</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className={`font-semibold ${getROIColor(item.metrics.roi)}`}>
                        {item.metrics.roi === Infinity ? '∞' : `${item.metrics.roi.toFixed(0)}%`}
                      </div>
                      <div className="text-xs text-slate-400">Annual ROI</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className={`font-semibold ${getScalabilityColor(item.hustle.scalability)}`}>
                        {item.hustle.scalability}
                      </div>
                      <div className="text-xs text-slate-400">Scalability</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded">
                      <div className="text-purple-400 font-semibold">
                        {item.hustle.hoursPerWeek}h
                      </div>
                      <div className="text-xs text-slate-400">Weekly Hours</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-green-400 font-medium mb-2">Pros:</div>
                      <ul className="space-y-1">
                        {item.hustle.pros.slice(0, 3).map((pro, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-medium mb-2">Considerations:</div>
                      <ul className="space-y-1">
                        {item.hustle.cons.slice(0, 3).map((con, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-300">
                            <AlertCircle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Side Hustle Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h3 className="text-lg font-bold text-white mb-4">💡 Side Hustle Success Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Start small and test your concept before making large investments
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Track your time and money carefully to understand true profitability
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Focus on building systems and processes to increase efficiency
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Consider tax implications and set aside money for quarterly payments
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Don&apos;t let your side hustle negatively impact your primary job performance
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

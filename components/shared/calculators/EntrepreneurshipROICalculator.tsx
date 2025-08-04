'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target,
  TrendingUp,
  BarChart3,
  Info,
  CheckCircle,
  Zap,
  Briefcase,
  Users,
  Building,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { theme } from '@/lib/theme';
import CalculatorWrapper from './CalculatorWrapper';

interface ROIInputs {
  // Investment Details
  initialInvestment: number;
  additionalInvestments: number;
  timeHorizon: number;
  
  // Marketing Investments
  marketingBudget: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  conversionRate: number;
  
  // Technology Investments
  technologyCosts: number;
  efficiencyGains: number;
  costSavings: number;
  revenueIncrease: number;
  
  // Human Capital
  hiringCosts: number;
  trainingCosts: number;
  salaryIncrease: number;
  productivityGain: number;
  
  // Operations
  operationalExpenses: number;
  revenueGenerated: number;
  marginImprovement: number;
  
  // Risk Factors
  riskAdjustment: number;
  inflationRate: number;
  discountRate: number;
}

interface ROIResults {
  simpleROI: number;
  annualizedROI: number;
  netPresentValue: number;
  paybackPeriod: number;
  profitabilityIndex: number;
  internalRateOfReturn: number;
  totalReturn: number;
  riskAdjustedReturn: number;
  marketingROI: number;
  technologyROI: number;
  humanCapitalROI: number;
  operationsROI: number;
  breakEvenPoint: number;
}

interface InvestmentCategory {
  name: string;
  investment: number;
  returns: number;
  roi: number;
  payback: number;
  icon: React.ReactNode;
  color: string;
}

export default function EntrepreneurshipROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    initialInvestment: 100000,
    additionalInvestments: 50000,
    timeHorizon: 3,
    marketingBudget: 30000,
    customerAcquisitionCost: 150,
    customerLifetimeValue: 1200,
    conversionRate: 3.5,
    technologyCosts: 25000,
    efficiencyGains: 15,
    costSavings: 40000,
    revenueIncrease: 80000,
    hiringCosts: 20000,
    trainingCosts: 10000,
    salaryIncrease: 60000,
    productivityGain: 25,
    operationalExpenses: 200000,
    revenueGenerated: 350000,
    marginImprovement: 5,
    riskAdjustment: 15,
    inflationRate: 3,
    discountRate: 10
  });

  const [results, setResults] = useState<ROIResults>({
    simpleROI: 0,
    annualizedROI: 0,
    netPresentValue: 0,
    paybackPeriod: 0,
    profitabilityIndex: 0,
    internalRateOfReturn: 0,
    totalReturn: 0,
    riskAdjustedReturn: 0,
    marketingROI: 0,
    technologyROI: 0,
    humanCapitalROI: 0,
    operationsROI: 0,
    breakEvenPoint: 0
  });

  const [investmentCategories, setInvestmentCategories] = useState<InvestmentCategory[]>([]);
  const [activeTab, setActiveTab] = useState('marketing');

  const calculateROI = useCallback(() => {
    // Total Investment
    const totalInvestment = inputs.initialInvestment + inputs.additionalInvestments;
    
    // Marketing ROI Calculation
    const customersAcquired = inputs.marketingBudget / inputs.customerAcquisitionCost;
    const marketingRevenue = customersAcquired * inputs.customerLifetimeValue * (inputs.conversionRate / 100);
    const marketingROI = ((marketingRevenue - inputs.marketingBudget) / inputs.marketingBudget) * 100;
    
    // Technology ROI Calculation
    const technologyReturns = inputs.costSavings + inputs.revenueIncrease;
    const technologyROI = ((technologyReturns - inputs.technologyCosts) / inputs.technologyCosts) * 100;
    
    // Human Capital ROI Calculation
    const humanCapitalInvestment = inputs.hiringCosts + inputs.trainingCosts;
    const productivityValue = inputs.salaryIncrease * (inputs.productivityGain / 100) * inputs.timeHorizon;
    const humanCapitalROI = ((productivityValue - humanCapitalInvestment) / humanCapitalInvestment) * 100;
    
    // Operations ROI Calculation
    const operationalProfit = inputs.revenueGenerated - inputs.operationalExpenses;
    const marginBonus = inputs.revenueGenerated * (inputs.marginImprovement / 100);
    const operationsROI = ((operationalProfit + marginBonus) / inputs.operationalExpenses) * 100;
    
    // Overall Financial Metrics
    const totalReturns = marketingRevenue + technologyReturns + productivityValue + operationalProfit + marginBonus;
    const netGain = totalReturns - totalInvestment;
    const simpleROI = (netGain / totalInvestment) * 100;
    const annualizedROI = (Math.pow((totalReturns / totalInvestment), (1 / inputs.timeHorizon)) - 1) * 100;
    
    // Risk-Adjusted Return
    const riskAdjustedReturn = annualizedROI - inputs.riskAdjustment;
    
    // NPV Calculation
    let npv = -totalInvestment;
    for (let year = 1; year <= inputs.timeHorizon; year++) {
      const yearlyReturn = totalReturns / inputs.timeHorizon;
      npv += yearlyReturn / Math.pow(1 + inputs.discountRate / 100, year);
    }
    
    // Payback Period
    const yearlyReturn = totalReturns / inputs.timeHorizon;
    const paybackPeriod = totalInvestment / yearlyReturn;
    
    // Profitability Index
    const profitabilityIndex = (npv + totalInvestment) / totalInvestment;
    
    // IRR Estimation (simplified)
    const internalRateOfReturn = ((totalReturns / totalInvestment) ** (1 / inputs.timeHorizon) - 1) * 100;
    
    // Break-even Point
    const breakEvenPoint = totalInvestment / (totalReturns / inputs.timeHorizon) * 12; // in months
    
    setResults({
      simpleROI,
      annualizedROI,
      netPresentValue: npv,
      paybackPeriod,
      profitabilityIndex,
      internalRateOfReturn,
      totalReturn: totalReturns,
      riskAdjustedReturn,
      marketingROI,
      technologyROI,
      humanCapitalROI,
      operationsROI,
      breakEvenPoint
    });

    // Investment Categories for visualization
    const categories: InvestmentCategory[] = [
      {
        name: 'Marketing',
        investment: inputs.marketingBudget,
        returns: marketingRevenue,
        roi: marketingROI,
        payback: inputs.marketingBudget / (marketingRevenue / inputs.timeHorizon) * 12,
        icon: <Target className="w-5 h-5" />,
        color: 'blue'
      },
      {
        name: 'Technology',
        investment: inputs.technologyCosts,
        returns: technologyReturns,
        roi: technologyROI,
        payback: inputs.technologyCosts / (technologyReturns / inputs.timeHorizon) * 12,
        icon: <Building className="w-5 h-5" />,
        color: 'purple'
      },
      {
        name: 'Human Capital',
        investment: humanCapitalInvestment,
        returns: productivityValue,
        roi: humanCapitalROI,
        payback: humanCapitalInvestment / (productivityValue / inputs.timeHorizon) * 12,
        icon: <Users className="w-5 h-5" />,
        color: 'green'
      },
      {
        name: 'Operations',
        investment: inputs.operationalExpenses,
        returns: operationalProfit + marginBonus,
        roi: operationsROI,
        payback: inputs.operationalExpenses / ((operationalProfit + marginBonus) / inputs.timeHorizon) * 12,
        icon: <Briefcase className="w-5 h-5" />,
        color: 'amber'
      }
    ];
    
    setInvestmentCategories(categories);
  }, [inputs]);

  useEffect(() => {
    calculateROI();
  }, [inputs, calculateROI]);

  const formatCurrency = (amount: number): string => {
    if (Math.abs(amount) >= 1000000) {
      return `${amount < 0 ? '-' : ''}$${Math.abs(amount / 1000000).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `${amount < 0 ? '-' : ''}$${Math.abs(amount / 1000).toFixed(0)}K`;
    }
    return `${amount < 0 ? '-' : ''}$${Math.abs(amount).toLocaleString()}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatMonths = (months: number): string => {
    if (months < 12) {
      return `${months.toFixed(1)} months`;
    } else {
      return `${(months / 12).toFixed(1)} years`;
    }
  };

  const getROIStatus = (roi: number): { color: string; icon: React.ReactNode; message: string } => {
    if (roi < 0) {
      return { 
        color: 'text-red-400', 
        icon: <ArrowDownRight className="w-4 h-4" />,
        message: 'Negative return - reassess strategy'
      };
    } else if (roi < 15) {
      return { 
        color: 'text-amber-400', 
        icon: <Clock className="w-4 h-4" />,
        message: 'Low return - consider alternatives'
      };
    } else if (roi < 30) {
      return { 
        color: 'text-blue-400', 
        icon: <TrendingUp className="w-4 h-4" />,
        message: 'Moderate return - acceptable investment'
      };
    } else {
      return { 
        color: 'text-green-400', 
        icon: <ArrowUpRight className="w-4 h-4" />,
        message: 'High return - excellent investment'
      };
    }
  };

  const getInvestmentAdvice = (): string => {
    const bestCategory = investmentCategories.reduce((best, current) => 
      current.roi > best.roi ? current : best, investmentCategories[0] || { roi: 0, name: '' });
    
    return `${bestCategory.name} shows the highest ROI at ${bestCategory.roi.toFixed(1)}%. Consider reallocating resources to maximize returns.`;
  };

  const roiStatus = getROIStatus(results.annualizedROI);

  const handleReset = () => {
    setInputs({
      initialInvestment: 100000,
      additionalInvestments: 50000,
      timeHorizon: 3,
      marketingBudget: 30000,
      customerAcquisitionCost: 150,
      customerLifetimeValue: 1200,
      conversionRate: 3.5,
      technologyCosts: 25000,
      efficiencyGains: 15,
      costSavings: 40000,
      revenueIncrease: 80000,
      hiringCosts: 20000,
      trainingCosts: 10000,
      salaryIncrease: 60000,
      productivityGain: 25,
      operationalExpenses: 200000,
      revenueGenerated: 350000,
      marginImprovement: 5,
      riskAdjustment: 15,
      inflationRate: 3,
      discountRate: 10
    });
    setActiveTab('marketing');
  };

  const inputsContent = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <Briefcase className="w-5 h-5" />
            Core Investment Details
          </CardTitle>
          <CardDescription className={theme.textColors.secondary}>
            Fundamental investment parameters for ROI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Initial Investment
              </label>
              <input
                type="number"
                value={inputs.initialInvestment}
                onChange={(e) => setInputs({...inputs, initialInvestment: Number(e.target.value)})}
                className={theme.utils.input()}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Additional Investments
              </label>
              <input
                type="number"
                value={inputs.additionalInvestments}
                onChange={(e) => setInputs({...inputs, additionalInvestments: Number(e.target.value)})}
                className={theme.utils.input()}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Time Horizon (years)
              </label>
              <input
                type="number"
                value={inputs.timeHorizon}
                onChange={(e) => setInputs({...inputs, timeHorizon: Number(e.target.value)})}
                className={theme.utils.input()}
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Risk Adjustment (%)
              </label>
              <input
                type="number"
                value={inputs.riskAdjustment}
                onChange={(e) => setInputs({...inputs, riskAdjustment: Number(e.target.value)})}
                className={theme.utils.input()}
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Discount Rate (%)
              </label>
              <input
                type="number"
                value={inputs.discountRate}
                onChange={(e) => setInputs({...inputs, discountRate: Number(e.target.value)})}
                className={theme.utils.input()}
                min="1"
                max="20"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Inflation Rate (%)
              </label>
              <input
                type="number"
                value={inputs.inflationRate}
                onChange={(e) => setInputs({...inputs, inflationRate: Number(e.target.value)})}
                className={theme.utils.input()}
                min="0"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Investment Categories
          </CardTitle>
          <CardDescription className={theme.textColors.secondary}>
            Detailed inputs for each investment category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="tech">Technology</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="human">Human Capital</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="marketing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Marketing Budget
                  </label>
                  <input
                    type="number"
                    value={inputs.marketingBudget}
                    onChange={(e) => setInputs({...inputs, marketingBudget: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Customer Acquisition Cost
                  </label>
                  <input
                    type="number"
                    value={inputs.customerAcquisitionCost}
                    onChange={(e) => setInputs({...inputs, customerAcquisitionCost: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Customer Lifetime Value
                  </label>
                  <input
                    type="number"
                    value={inputs.customerLifetimeValue}
                    onChange={(e) => setInputs({...inputs, customerLifetimeValue: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Conversion Rate (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.conversionRate}
                    onChange={(e) => setInputs({...inputs, conversionRate: Number(e.target.value)})}
                    className={theme.utils.input()}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Technology Costs
                  </label>
                  <input
                    type="number"
                    value={inputs.technologyCosts}
                    onChange={(e) => setInputs({...inputs, technologyCosts: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Efficiency Gains (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.efficiencyGains}
                    onChange={(e) => setInputs({...inputs, efficiencyGains: Number(e.target.value)})}
                    className={theme.utils.input()}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Annual Cost Savings
                  </label>
                  <input
                    type="number"
                    value={inputs.costSavings}
                    onChange={(e) => setInputs({...inputs, costSavings: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Revenue Increase
                  </label>
                  <input
                    type="number"
                    value={inputs.revenueIncrease}
                    onChange={(e) => setInputs({...inputs, revenueIncrease: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="human" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Hiring Costs
                  </label>
                  <input
                    type="number"
                    value={inputs.hiringCosts}
                    onChange={(e) => setInputs({...inputs, hiringCosts: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Training Costs
                  </label>
                  <input
                    type="number"
                    value={inputs.trainingCosts}
                    onChange={(e) => setInputs({...inputs, trainingCosts: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Annual Salary Increase
                  </label>
                  <input
                    type="number"
                    value={inputs.salaryIncrease}
                    onChange={(e) => setInputs({...inputs, salaryIncrease: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Productivity Gain (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.productivityGain}
                    onChange={(e) => setInputs({...inputs, productivityGain: Number(e.target.value)})}
                    className={theme.utils.input()}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Operational Expenses
                  </label>
                  <input
                    type="number"
                    value={inputs.operationalExpenses}
                    onChange={(e) => setInputs({...inputs, operationalExpenses: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Revenue Generated
                  </label>
                  <input
                    type="number"
                    value={inputs.revenueGenerated}
                    onChange={(e) => setInputs({...inputs, revenueGenerated: Number(e.target.value)})}
                    className={theme.utils.input()}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Margin Improvement (%)
                  </label>
                  <input
                    type="number"
                    value={inputs.marginImprovement}
                    onChange={(e) => setInputs({...inputs, marginImprovement: Number(e.target.value)})}
                    className={theme.utils.input()}
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );

  const resultsContent = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* ROI Summary */}
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" />
            ROI Analysis & Financial Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                  Return Metrics
                </h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Simple ROI:</span>
                  <span className={`font-semibold ${results.simpleROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(results.simpleROI)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Annualized ROI:</span>
                  <span className={`font-semibold ${results.annualizedROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(results.annualizedROI)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Risk-Adjusted ROI:</span>
                  <span className={`font-semibold ${results.riskAdjustedReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(results.riskAdjustedReturn)}
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${theme.textColors.primary}`}>Total Return:</span>
                    <span className={`text-xl font-bold text-blue-400`}>
                      {formatCurrency(results.totalReturn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                  Investment Analysis
                </h3>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Net Present Value:</span>
                  <span className={`font-semibold ${results.netPresentValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(results.netPresentValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Payback Period:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {formatMonths(results.paybackPeriod * 12)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Profitability Index:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {results.profitabilityIndex.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Break-even Point:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {formatMonths(results.breakEvenPoint)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Categories Breakdown */}
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Investment Categories Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentCategories.map((category, index) => (
              <div key={index} className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`text-${category.color}-400`}>
                      {category.icon}
                    </div>
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>
                      {category.name}
                    </h4>
                  </div>
                  <Badge className={
                    category.roi >= 30 ? 'bg-green-500/20 text-green-400' :
                    category.roi >= 15 ? 'bg-blue-500/20 text-blue-400' :
                    category.roi >= 0 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }>
                    {formatPercentage(category.roi)}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Investment:</span>
                    <span className={theme.textColors.primary}>
                      {formatCurrency(category.investment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Returns:</span>
                    <span className={theme.textColors.primary}>
                      {formatCurrency(category.returns)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Payback:</span>
                    <span className={theme.textColors.primary}>
                      {formatMonths(category.payback)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Recommendations */}
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <Info className="w-5 h-5" />
            Analysis & Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <div className="flex items-center gap-2">
              {roiStatus.icon}
              <AlertDescription className={roiStatus.color}>
                <strong>ROI Assessment:</strong> {roiStatus.message}
              </AlertDescription>
            </div>
          </Alert>

          <Alert className="mb-4">
            <Info className="w-4 h-4" />
            <AlertDescription className={theme.textColors.secondary}>
              <strong>Investment Priority:</strong> {getInvestmentAdvice()}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className={`font-semibold ${theme.textColors.primary}`}>Key Performance Insights</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className={theme.textColors.secondary}>
                  • Payback period: {formatMonths(results.paybackPeriod * 12)}
                </div>
                <div className={theme.textColors.secondary}>
                  • Net present value: {formatCurrency(results.netPresentValue)}
                </div>
                <div className={theme.textColors.secondary}>
                  • Risk-adjusted return: {formatPercentage(results.riskAdjustedReturn)}
                </div>
                <div className={theme.textColors.secondary}>
                  • Profitability index: {results.profitabilityIndex.toFixed(2)}
                </div>
              </div>
            </div>

            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <h4 className={`font-semibold ${theme.textColors.primary}`}>Strategic Action Items</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className={theme.textColors.secondary}>
                  • Focus on highest ROI investment categories
                </div>
                <div className={theme.textColors.secondary}>
                  • Monitor break-even timeline closely
                </div>
                <div className={theme.textColors.secondary}>
                  • Reassess risk factors quarterly
                </div>
                <div className={theme.textColors.secondary}>
                  • Track actual vs. projected returns
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-amber-50/10 border border-amber-500/20 rounded-lg p-4 mt-4`}>
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                  ROI Optimization Framework
                </h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Diversify investments across categories to balance risk and return. Prioritize 
                  investments with shorter payback periods and higher profitability indices. 
                  Regularly review and adjust strategies based on actual performance data and 
                  market conditions. Consider implementing phased rollouts to minimize risk exposure.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const metadata = {
    id: "entrepreneurship-roi-calculator",
    title: "Entrepreneurship ROI Calculator",
    description: "Analyze return on investment across multiple business initiatives including marketing, technology, human capital, and operations to optimize resource allocation decisions.",
    category: "advanced" as const,
    icon: Briefcase,
    tags: ["business", "roi", "investment", "entrepreneurship", "analysis"],
    educationalNotes: [
      {
        title: "Understanding ROI Metrics",
        content: "Return on Investment (ROI) measures the efficiency of an investment. Annualized ROI accounts for time, while risk-adjusted ROI considers potential uncertainties.",
        tips: [
          "Compare ROI across different investment categories",
          "Consider both financial and strategic benefits",
          "Factor in opportunity costs and market conditions"
        ]
      },
      {
        title: "Investment Category Analysis",
        content: "Different business investments have varying risk profiles and return timelines. Marketing investments often show quicker returns, while technology investments may have longer payback periods but greater long-term benefits.",
        tips: [
          "Diversify across multiple investment categories",
          "Monitor actual vs. projected returns regularly",
          "Adjust strategy based on performance data"
        ]
      }
    ]
  };

  const calculatorResults = {
    primary: { 
      label: "Annualized ROI", 
      value: results.annualizedROI, 
      format: "percentage" as const 
    },
    secondary: [
      { label: "Total Return", value: results.totalReturn, format: "currency" as const },
      { label: "Net Present Value", value: results.netPresentValue, format: "currency" as const },
      { label: "Payback Period", value: results.paybackPeriod, format: "number" as const },
      { label: "Profitability Index", value: results.profitabilityIndex, format: "number" as const }
    ]
  };

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div>{inputsContent}</div>
        
        {/* Results Panel */}
        <div>{resultsContent}</div>
      </div>
    </CalculatorWrapper>
  );
}

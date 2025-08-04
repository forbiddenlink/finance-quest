'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  Users,
  DollarSign,
  Calculator,
  BarChart3,
  Info,
  AlertTriangle,
  CheckCircle,
  PieChart,
  Target,
  Zap,
  Rocket,
  CreditCard
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface StartupInputs {
  // Company Basics
  currentValuation: number;
  founderEquity: number;
  employeePool: number;
  
  // Funding Round
  fundingAmount: number;
  premoney: number;
  postmoney: number;
  liquidationPreference: number;
  
  // Growth Metrics
  monthlyBurnRate: number;
  monthlyRevenue: number;
  revenueGrowthRate: number;
  customersCount: number;
  customerGrowthRate: number;
  
  // Exit Scenario
  exitValuation: number;
  exitTimeframe: number;
}

interface FundingResults {
  dilution: number;
  newFounderEquity: number;
  newEmployeePool: number;
  newInvestorEquity: number;
  runwayMonths: number;
  nextFundingNeeded: number;
  founderExitValue: number;
  investorExitValue: number;
  totalReturn: number;
  irr: number;
}

interface RoundData {
  round: string;
  investment: number;
  valuation: number;
  founderDilution: number;
  ownership: number;
}

export default function StartupFinanceCalculator() {
  const [inputs, setInputs] = useState<StartupInputs>({
    currentValuation: 5000000,
    founderEquity: 80,
    employeePool: 15,
    fundingAmount: 2000000,
    premoney: 8000000,
    postmoney: 10000000,
    liquidationPreference: 1,
    monthlyBurnRate: 150000,
    monthlyRevenue: 50000,
    revenueGrowthRate: 20,
    customersCount: 500,
    customerGrowthRate: 25,
    exitValuation: 100000000,
    exitTimeframe: 5
  });

  const [results, setResults] = useState<FundingResults>({
    dilution: 0,
    newFounderEquity: 0,
    newEmployeePool: 0,
    newInvestorEquity: 0,
    runwayMonths: 0,
    nextFundingNeeded: 0,
    founderExitValue: 0,
    investorExitValue: 0,
    totalReturn: 0,
    irr: 0
  });

  const [fundingRounds, setFundingRounds] = useState<RoundData[]>([]);
  const [activeTab, setActiveTab] = useState('funding');
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('startup-finance-calculator');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    calculateStartupMetrics();
  }, [inputs]);

  const calculateStartupMetrics = useCallback(() => {
    // Calculate funding round impact
    const postmoney = inputs.premoney + inputs.fundingAmount;
    const dilution = (inputs.fundingAmount / postmoney) * 100;
    
    // New equity distribution
    const newFounderEquity = inputs.founderEquity * (1 - dilution / 100);
    const newEmployeePool = inputs.employeePool * (1 - dilution / 100);
    const newInvestorEquity = dilution;
    
    // Runway calculation
    const currentCash = inputs.fundingAmount;
    const runwayMonths = currentCash / inputs.monthlyBurnRate;
    
    // Next funding estimation
    const nextFundingNeeded = inputs.monthlyBurnRate * 18; // 18 months runway target
    
    // Exit scenario calculations
    const founderExitValue = (inputs.exitValuation * newFounderEquity) / 100;
    const investorExitValue = Math.max(
      (inputs.exitValuation * newInvestorEquity) / 100,
      inputs.fundingAmount * inputs.liquidationPreference
    );
    
    // Total return and IRR
    const totalReturn = investorExitValue / inputs.fundingAmount;
    const annualReturn = Math.pow(totalReturn, 1 / inputs.exitTimeframe) - 1;
    const irr = annualReturn * 100;
    
    setResults({
      dilution,
      newFounderEquity,
      newEmployeePool,
      newInvestorEquity,
      runwayMonths,
      nextFundingNeeded,
      founderExitValue,
      investorExitValue,
      totalReturn,
      irr
    });

    // Generate sample funding rounds
    const rounds: RoundData[] = [
      {
        round: 'Pre-Seed',
        investment: 500000,
        valuation: 3000000,
        founderDilution: 16.7,
        ownership: 83.3
      },
      {
        round: 'Seed',
        investment: inputs.fundingAmount,
        valuation: postmoney,
        founderDilution: dilution,
        ownership: newFounderEquity
      },
      {
        round: 'Series A',
        investment: nextFundingNeeded,
        valuation: postmoney * 2.5,
        founderDilution: 15,
        ownership: newFounderEquity * 0.85
      }
    ];
    
    setFundingRounds(rounds);
  }, [inputs]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getRunwayStatus = (): { color: string; message: string } => {
    if (results.runwayMonths < 6) {
      return { color: 'text-red-400', message: 'Critical: Immediate funding needed' };
    } else if (results.runwayMonths < 12) {
      return { color: 'text-amber-400', message: 'Warning: Start fundraising soon' };
    } else if (results.runwayMonths < 18) {
      return { color: 'text-blue-400', message: 'Good: Healthy runway' };
    } else {
      return { color: 'text-green-400', message: 'Excellent: Strong cash position' };
    }
  };

  const getDilutionAdvice = (): string => {
    if (results.dilution < 15) {
      return "Low dilution - great terms for founders";
    } else if (results.dilution < 25) {
      return "Moderate dilution - typical for growth stage";
    } else if (results.dilution < 35) {
      return "High dilution - ensure strong investor value-add";
    } else {
      return "Very high dilution - consider if terms are justified";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
          Startup Finance & Equity Management
        </Badge>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary}`}>
          Startup Finance Calculator
        </h1>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Model funding rounds, equity dilution, and growth scenarios to make informed 
          decisions about startup financing and investor negotiations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Startup Metrics
              </CardTitle>
              <CardDescription className={theme.textColors.secondary}>
                Enter your startup&apos;s financial and growth metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="funding">Funding</TabsTrigger>
                  <TabsTrigger value="growth">Growth</TabsTrigger>
                  <TabsTrigger value="exit">Exit</TabsTrigger>
                </TabsList>

                <TabsContent value="funding" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Current Valuation</Label>
                      <Input
                        type="number"
                        value={inputs.currentValuation}
                        onChange={(e) => setInputs({...inputs, currentValuation: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Founder Equity (%)</Label>
                      <Input
                        type="number"
                        value={inputs.founderEquity}
                        onChange={(e) => setInputs({...inputs, founderEquity: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Employee Pool (%)</Label>
                      <Input
                        type="number"
                        value={inputs.employeePool}
                        onChange={(e) => setInputs({...inputs, employeePool: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Funding Amount</Label>
                      <Input
                        type="number"
                        value={inputs.fundingAmount}
                        onChange={(e) => setInputs({...inputs, fundingAmount: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Pre-money Valuation</Label>
                      <Input
                        type="number"
                        value={inputs.premoney}
                        onChange={(e) => setInputs({...inputs, premoney: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Liquidation Preference (x)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={inputs.liquidationPreference}
                        onChange={(e) => setInputs({...inputs, liquidationPreference: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="growth" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Monthly Burn Rate</Label>
                      <Input
                        type="number"
                        value={inputs.monthlyBurnRate}
                        onChange={(e) => setInputs({...inputs, monthlyBurnRate: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Monthly Revenue</Label>
                      <Input
                        type="number"
                        value={inputs.monthlyRevenue}
                        onChange={(e) => setInputs({...inputs, monthlyRevenue: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Revenue Growth Rate (%/month)</Label>
                      <Input
                        type="number"
                        value={inputs.revenueGrowthRate}
                        onChange={(e) => setInputs({...inputs, revenueGrowthRate: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Current Customers</Label>
                      <Input
                        type="number"
                        value={inputs.customersCount}
                        onChange={(e) => setInputs({...inputs, customersCount: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Customer Growth Rate (%/month)</Label>
                      <Input
                        type="number"
                        value={inputs.customerGrowthRate}
                        onChange={(e) => setInputs({...inputs, customerGrowthRate: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="exit" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Exit Valuation</Label>
                      <Input
                        type="number"
                        value={inputs.exitValuation}
                        onChange={(e) => setInputs({...inputs, exitValuation: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Exit Timeframe (years)</Label>
                      <Input
                        type="number"
                        value={inputs.exitTimeframe}
                        onChange={(e) => setInputs({...inputs, exitTimeframe: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Equity & Dilution Summary */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <PieChart className="w-5 h-5" />
                Equity Distribution & Dilution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      After Funding Round
                    </h3>
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Founder Equity:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercentage(results.newFounderEquity)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Employee Pool:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercentage(results.newEmployeePool)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Investor Equity:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercentage(results.newInvestorEquity)}
                      </span>
                    </div>
                    <div className="border-t border-slate-700 pt-3">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${theme.textColors.primary}`}>Total Dilution:</span>
                        <span className={`text-xl font-bold text-amber-400`}>
                          {formatPercentage(results.dilution)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      Cash & Runway
                    </h3>
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Funding Amount:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(inputs.fundingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Monthly Burn:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(inputs.monthlyBurnRate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Runway:</span>
                      <span className={`font-semibold ${getRunwayStatus().color}`}>
                        {results.runwayMonths.toFixed(1)} months
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Next Funding:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(results.nextFundingNeeded)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Rounds Overview */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Rocket className="w-5 h-5" />
                Funding Rounds Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fundingRounds.map((round, index) => (
                    <div key={index} className={`${theme.backgrounds.card} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-semibold ${theme.textColors.primary}`}>
                          {round.round}
                        </h4>
                        <Badge className={
                          index === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                        }>
                          {index === 1 ? 'Current' : 'Projected'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Investment:</span>
                          <span className={theme.textColors.primary}>
                            {formatCurrency(round.investment)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Valuation:</span>
                          <span className={theme.textColors.primary}>
                            {formatCurrency(round.valuation)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Dilution:</span>
                          <span className={theme.textColors.primary}>
                            {formatPercentage(round.founderDilution)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Founder Ownership:</span>
                          <span className={theme.textColors.primary}>
                            {formatPercentage(round.ownership)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exit Scenario Analysis */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                Exit Scenario Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      Exit Returns
                    </h3>
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Exit Valuation:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(inputs.exitValuation)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Founder Value:</span>
                      <span className={`font-semibold text-green-400`}>
                        {formatCurrency(results.founderExitValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Investor Value:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(results.investorExitValue)}
                      </span>
                    </div>
                    <div className="border-t border-slate-700 pt-3">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${theme.textColors.primary}`}>Investor IRR:</span>
                        <span className={`text-xl font-bold text-blue-400`}>
                          {formatPercentage(results.irr)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      Investment Returns
                    </h3>
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Total Return Multiple:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {results.totalReturn.toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Investment Period:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {inputs.exitTimeframe} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Annual Return:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercentage(results.irr)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis & Recommendations */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Info className="w-5 h-5" />
                Analysis & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className={getRunwayStatus().color}>
                  <strong>Runway Status:</strong> {getRunwayStatus().message}
                </AlertDescription>
              </Alert>

              <Alert className="mb-4">
                <Info className="w-4 h-4" />
                <AlertDescription className={theme.textColors.secondary}>
                  <strong>Dilution Assessment:</strong> {getDilutionAdvice()}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Key Insights</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className={theme.textColors.secondary}>
                      • Post-funding runway of {results.runwayMonths.toFixed(1)} months
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Founder dilution of {formatPercentage(results.dilution)} this round
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Projected IRR of {formatPercentage(results.irr)} for investors
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Next funding needed: {formatCurrency(results.nextFundingNeeded)}
                    </div>
                  </div>
                </div>

                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Action Items</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className={theme.textColors.secondary}>
                      • Focus on extending runway through revenue growth
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Plan next fundraising 6-12 months in advance
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Optimize burn rate while maintaining growth
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Consider milestone-based funding tranches
                    </div>
                  </div>
                </div>
              </div>

              <div className={`bg-purple-50/10 border border-purple-500/20 rounded-lg p-4 mt-4`}>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Startup Finance Best Practices
                    </h5>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Maintain 12-18 months of runway, negotiate fair liquidation preferences, 
                      and focus on achieving milestones that justify higher valuations in future rounds. 
                      Consider the long-term equity implications of each funding decision.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

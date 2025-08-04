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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  BarChart3,
  Info,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface CashFlowInputs {
  // Operating Cash Flow
  monthlyRevenue: number;
  revenueGrowthRate: number;
  grossMargin: number;
  
  // Operating Expenses
  salariesWages: number;
  rentUtilities: number;
  marketingExpenses: number;
  generalExpenses: number;
  
  // Working Capital
  accountsReceivable: number;
  inventory: number;
  accountsPayable: number;
  daysSalesOutstanding: number;
  daysInventoryOutstanding: number;
  daysPayableOutstanding: number;
  
  // Capital Expenditures
  equipmentPurchases: number;
  softwareLicenses: number;
  facilitiesInvestment: number;
  
  // Financing
  loanPayments: number;
  interestExpense: number;
  dividendPayments: number;
}

interface CashFlowResults {
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  freeCashFlow: number;
  workingCapitalChange: number;
  cashConversionCycle: number;
  monthlyProjections: MonthlyProjection[];
  cashFlowRatio: number;
  operatingCashFlowMargin: number;
}

interface MonthlyProjection {
  month: number;
  revenue: number;
  operatingCF: number;
  cumulativeCF: number;
  cashBalance: number;
}

export default function BusinessCashFlowAnalyzer() {
  const [inputs, setInputs] = useState<CashFlowInputs>({
    monthlyRevenue: 100000,
    revenueGrowthRate: 5,
    grossMargin: 65,
    salariesWages: 40000,
    rentUtilities: 8000,
    marketingExpenses: 12000,
    generalExpenses: 5000,
    accountsReceivable: 50000,
    inventory: 30000,
    accountsPayable: 25000,
    daysSalesOutstanding: 45,
    daysInventoryOutstanding: 60,
    daysPayableOutstanding: 30,
    equipmentPurchases: 10000,
    softwareLicenses: 2000,
    facilitiesInvestment: 5000,
    loanPayments: 8000,
    interestExpense: 1500,
    dividendPayments: 0
  });

  const [results, setResults] = useState<CashFlowResults>({
    operatingCashFlow: 0,
    investingCashFlow: 0,
    financingCashFlow: 0,
    netCashFlow: 0,
    freeCashFlow: 0,
    workingCapitalChange: 0,
    cashConversionCycle: 0,
    monthlyProjections: [],
    cashFlowRatio: 0,
    operatingCashFlowMargin: 0
  });

  const [initialCashBalance, setInitialCashBalance] = useState(50000);
  const [projectionMonths] = useState(12);
  const [activeTab, setActiveTab] = useState('operating');
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('business-cash-flow-analyzer');
  }, [recordCalculatorUsage]);

  const calculateCashFlow = useCallback(() => {
    // Operating Cash Flow Calculation
    const grossProfit = inputs.monthlyRevenue * (inputs.grossMargin / 100);
    const totalOperatingExpenses = inputs.salariesWages + inputs.rentUtilities + 
                                 inputs.marketingExpenses + inputs.generalExpenses;
    const operatingIncome = grossProfit - totalOperatingExpenses;
    
    // Working Capital Analysis
    const cashConversionCycle = inputs.daysSalesOutstanding + inputs.daysInventoryOutstanding - 
                               inputs.daysPayableOutstanding;
    
    // Estimate working capital change based on revenue growth
    const workingCapitalChange = (inputs.monthlyRevenue * inputs.revenueGrowthRate / 100) * 
                               (cashConversionCycle / 30);
    
    const operatingCashFlow = operatingIncome - workingCapitalChange;
    
    // Investing Cash Flow
    const investingCashFlow = -(inputs.equipmentPurchases + inputs.softwareLicenses + 
                               inputs.facilitiesInvestment);
    
    // Financing Cash Flow
    const financingCashFlow = -(inputs.loanPayments + inputs.interestExpense + 
                               inputs.dividendPayments);
    
    // Net Cash Flow
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    
    // Free Cash Flow
    const freeCashFlow = operatingCashFlow + investingCashFlow;
    
    // Cash Flow Ratios
    const cashFlowRatio = operatingCashFlow / totalOperatingExpenses;
    const operatingCashFlowMargin = (operatingCashFlow / inputs.monthlyRevenue) * 100;
    
    // Monthly Projections
    const monthlyProjections: MonthlyProjection[] = [];
    let cumulativeCF = 0;
    let currentCashBalance = initialCashBalance;
    let currentRevenue = inputs.monthlyRevenue;
    
    for (let month = 1; month <= projectionMonths; month++) {
      // Apply growth rate
      currentRevenue *= (1 + inputs.revenueGrowthRate / 100);
      
      // Calculate monthly operating cash flow
      const monthlyGrossProfit = currentRevenue * (inputs.grossMargin / 100);
      const monthlyOperatingCF = monthlyGrossProfit - totalOperatingExpenses;
      
      cumulativeCF += monthlyOperatingCF;
      currentCashBalance += monthlyOperatingCF;
      
      monthlyProjections.push({
        month,
        revenue: currentRevenue,
        operatingCF: monthlyOperatingCF,
        cumulativeCF,
        cashBalance: currentCashBalance
      });
    }
    
    setResults({
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      netCashFlow,
      freeCashFlow,
      workingCapitalChange,
      cashConversionCycle,
      monthlyProjections,
      cashFlowRatio,
      operatingCashFlowMargin
    });
  }, [inputs, initialCashBalance, projectionMonths]);

  useEffect(() => {
    calculateCashFlow();
  }, [inputs, initialCashBalance, calculateCashFlow]);

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

  const getCashFlowHealth = (): { color: string; message: string; icon: React.ReactNode } => {
    if (results.operatingCashFlow < 0) {
      return { 
        color: 'text-red-400', 
        message: 'Negative operating cash flow - immediate attention needed',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    } else if (results.cashFlowRatio < 0.2) {
      return { 
        color: 'text-amber-400', 
        message: 'Low cash flow coverage - monitor closely',
        icon: <TrendingDown className="w-4 h-4" />
      };
    } else if (results.cashFlowRatio < 0.5) {
      return { 
        color: 'text-blue-400', 
        message: 'Moderate cash flow - room for improvement',
        icon: <TrendingUp className="w-4 h-4" />
      };
    } else {
      return { 
        color: 'text-green-400', 
        message: 'Strong cash flow position',
        icon: <CheckCircle className="w-4 h-4" />
      };
    }
  };

  const getWorkingCapitalAdvice = (): string => {
    if (results.cashConversionCycle > 90) {
      return "Long cash conversion cycle - consider improving collection and payment terms";
    } else if (results.cashConversionCycle > 45) {
      return "Moderate cash conversion cycle - optimization opportunities exist";
    } else if (results.cashConversionCycle > 0) {
      return "Efficient cash conversion cycle - good working capital management";
    } else {
      return "Negative cash conversion cycle - excellent working capital efficiency";
    }
  };

  const healthStatus = getCashFlowHealth();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2">
          Business Cash Flow Management
        </Badge>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary}`}>
          Business Cash Flow Analyzer
        </h1>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Analyze and project business cash flows across operating, investing, and financing activities 
          to optimize working capital and ensure healthy liquidity management.
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
                Cash Flow Inputs
              </CardTitle>
              <CardDescription className={theme.textColors.secondary}>
                Enter business financial data for comprehensive cash flow analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div>
                  <Label className={theme.textColors.secondary}>Initial Cash Balance</Label>
                  <Input
                    type="number"
                    value={initialCashBalance}
                    onChange={(e) => setInitialCashBalance(Number(e.target.value))}
                    className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                  />
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="operating">Operating</TabsTrigger>
                  <TabsTrigger value="investing">Investing</TabsTrigger>
                  <TabsTrigger value="financing">Financing</TabsTrigger>
                </TabsList>

                <TabsContent value="operating" className="space-y-4">
                  <div className="space-y-3">
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
                      <Label className={theme.textColors.secondary}>Revenue Growth Rate (%)</Label>
                      <Input
                        type="number"
                        value={inputs.revenueGrowthRate}
                        onChange={(e) => setInputs({...inputs, revenueGrowthRate: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Gross Margin (%)</Label>
                      <Input
                        type="number"
                        value={inputs.grossMargin}
                        onChange={(e) => setInputs({...inputs, grossMargin: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Salaries & Wages</Label>
                      <Input
                        type="number"
                        value={inputs.salariesWages}
                        onChange={(e) => setInputs({...inputs, salariesWages: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Rent & Utilities</Label>
                      <Input
                        type="number"
                        value={inputs.rentUtilities}
                        onChange={(e) => setInputs({...inputs, rentUtilities: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Marketing Expenses</Label>
                      <Input
                        type="number"
                        value={inputs.marketingExpenses}
                        onChange={(e) => setInputs({...inputs, marketingExpenses: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>General Expenses</Label>
                      <Input
                        type="number"
                        value={inputs.generalExpenses}
                        onChange={(e) => setInputs({...inputs, generalExpenses: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Days Sales Outstanding</Label>
                      <Input
                        type="number"
                        value={inputs.daysSalesOutstanding}
                        onChange={(e) => setInputs({...inputs, daysSalesOutstanding: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Days Inventory Outstanding</Label>
                      <Input
                        type="number"
                        value={inputs.daysInventoryOutstanding}
                        onChange={(e) => setInputs({...inputs, daysInventoryOutstanding: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Days Payable Outstanding</Label>
                      <Input
                        type="number"
                        value={inputs.daysPayableOutstanding}
                        onChange={(e) => setInputs({...inputs, daysPayableOutstanding: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="investing" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Equipment Purchases</Label>
                      <Input
                        type="number"
                        value={inputs.equipmentPurchases}
                        onChange={(e) => setInputs({...inputs, equipmentPurchases: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Software Licenses</Label>
                      <Input
                        type="number"
                        value={inputs.softwareLicenses}
                        onChange={(e) => setInputs({...inputs, softwareLicenses: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Facilities Investment</Label>
                      <Input
                        type="number"
                        value={inputs.facilitiesInvestment}
                        onChange={(e) => setInputs({...inputs, facilitiesInvestment: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financing" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Loan Payments</Label>
                      <Input
                        type="number"
                        value={inputs.loanPayments}
                        onChange={(e) => setInputs({...inputs, loanPayments: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Interest Expense</Label>
                      <Input
                        type="number"
                        value={inputs.interestExpense}
                        onChange={(e) => setInputs({...inputs, interestExpense: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Dividend Payments</Label>
                      <Input
                        type="number"
                        value={inputs.dividendPayments}
                        onChange={(e) => setInputs({...inputs, dividendPayments: Number(e.target.value)})}
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
          {/* Cash Flow Summary */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <DollarSign className="w-5 h-5" />
                Cash Flow Statement Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      Monthly Cash Flows
                    </h3>
                    <BarChart3 className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Operating CF:</span>
                      <span className={`font-semibold ${results.operatingCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(results.operatingCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Investing CF:</span>
                      <span className={`font-semibold ${results.investingCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(results.investingCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Financing CF:</span>
                      <span className={`font-semibold ${results.financingCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(results.financingCashFlow)}
                      </span>
                    </div>
                    <div className="border-t border-slate-700 pt-3">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${theme.textColors.primary}`}>Net Cash Flow:</span>
                        <span className={`text-xl font-bold ${results.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(results.netCashFlow)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      Key Metrics
                    </h3>
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Free Cash Flow:</span>
                      <span className={`font-semibold ${results.freeCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(results.freeCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Cash Flow Ratio:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {results.cashFlowRatio.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>OCF Margin:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercentage(results.operatingCashFlowMargin)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Cash Conversion:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {results.cashConversionCycle.toFixed(0)} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Projections */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Calendar className="w-5 h-5" />
                12-Month Cash Flow Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 min-w-max">
                  {results.monthlyProjections.slice(0, 6).map((projection, index) => (
                    <div key={index} className={`${theme.backgrounds.card} rounded-lg p-3`}>
                      <div className="text-center">
                        <div className={`text-sm ${theme.textColors.secondary} mb-2`}>
                          Month {projection.month}
                        </div>
                        <div className="space-y-1">
                          <div className={`text-xs ${theme.textColors.secondary}`}>Revenue</div>
                          <div className={`font-semibold ${theme.textColors.primary} text-sm`}>
                            {formatCurrency(projection.revenue)}
                          </div>
                          <div className={`text-xs ${theme.textColors.secondary}`}>Operating CF</div>
                          <div className={`font-semibold ${projection.operatingCF >= 0 ? 'text-green-400' : 'text-red-400'} text-sm`}>
                            {formatCurrency(projection.operatingCF)}
                          </div>
                          <div className={`text-xs ${theme.textColors.secondary}`}>Cash Balance</div>
                          <div className={`font-semibold ${projection.cashBalance >= 0 ? 'text-blue-400' : 'text-red-400'} text-sm`}>
                            {formatCurrency(projection.cashBalance)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Health & Analysis */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                Cash Flow Health Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                {healthStatus.icon}
                <AlertDescription className={healthStatus.color}>
                  <strong>Cash Flow Status:</strong> {healthStatus.message}
                </AlertDescription>
              </Alert>

              <Alert className="mb-4">
                <Info className="w-4 h-4" />
                <AlertDescription className={theme.textColors.secondary}>
                  <strong>Working Capital:</strong> {getWorkingCapitalAdvice()}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Strengths</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {results.operatingCashFlow > 0 && (
                      <div className={theme.textColors.secondary}>
                        • Positive operating cash flow generation
                      </div>
                    )}
                    {results.operatingCashFlowMargin > 10 && (
                      <div className={theme.textColors.secondary}>
                        • Healthy operating cash flow margin
                      </div>
                    )}
                    {results.cashConversionCycle < 60 && (
                      <div className={theme.textColors.secondary}>
                        • Efficient cash conversion cycle
                      </div>
                    )}
                    <div className={theme.textColors.secondary}>
                      • {projectionMonths}-month projection visibility
                    </div>
                  </div>
                </div>

                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Areas for Improvement</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {results.cashConversionCycle > 60 && (
                      <div className={theme.textColors.secondary}>
                        • Optimize working capital management
                      </div>
                    )}
                    {results.operatingCashFlowMargin < 10 && (
                      <div className={theme.textColors.secondary}>
                        • Improve operating cash flow margin
                      </div>
                    )}
                    {results.cashFlowRatio < 0.3 && (
                      <div className={theme.textColors.secondary}>
                        • Increase cash flow coverage ratio
                      </div>
                    )}
                    <div className={theme.textColors.secondary}>
                      • Monitor seasonal cash flow patterns
                    </div>
                  </div>
                </div>
              </div>

              <div className={`bg-green-50/10 border border-green-500/20 rounded-lg p-4 mt-4`}>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Cash Flow Optimization Tips
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className={theme.textColors.secondary}>• Accelerate receivables collection</div>
                      <div className={theme.textColors.secondary}>• Optimize inventory turnover</div>
                      <div className={theme.textColors.secondary}>• Negotiate better payment terms</div>
                      <div className={theme.textColors.secondary}>• Implement cash flow forecasting</div>
                    </div>
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

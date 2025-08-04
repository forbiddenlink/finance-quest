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
  Building2,
  TrendingUp,
  Calculator,
  BarChart3,
  Info,
  AlertTriangle,
  CheckCircle,
  PieChart,
  Target,
  Zap
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface ValuationInputs {
  // DCF Method
  annualRevenue: number;
  growthRate: number;
  netMargin: number;
  discountRate: number;
  terminalGrowthRate: number;
  projectionYears: number;
  
  // Multiple Method
  industryMultiple: number;
  ebitda: number;
  revenueMultiple: number;
  
  // Asset Method
  totalAssets: number;
  totalLiabilities: number;
  intangibleAssets: number;
  marketPremium: number;
}

interface ValuationResults {
  dcfValuation: number;
  multipleValuation: number;
  assetValuation: number;
  averageValuation: number;
  projectedCashFlows: number[];
  terminalValue: number;
  enterpriseValue: number;
  equityValue: number;
}

export default function BusinessValuationCalculator() {
  const [inputs, setInputs] = useState<ValuationInputs>({
    annualRevenue: 1000000,
    growthRate: 15,
    netMargin: 20,
    discountRate: 12,
    terminalGrowthRate: 3,
    projectionYears: 5,
    industryMultiple: 8,
    ebitda: 200000,
    revenueMultiple: 2.5,
    totalAssets: 500000,
    totalLiabilities: 200000,
    intangibleAssets: 100000,
    marketPremium: 20
  });

  const [results, setResults] = useState<ValuationResults>({
    dcfValuation: 0,
    multipleValuation: 0,
    assetValuation: 0,
    averageValuation: 0,
    projectedCashFlows: [],
    terminalValue: 0,
    enterpriseValue: 0,
    equityValue: 0
  });

  const [activeMethod, setActiveMethod] = useState('dcf');
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('business-valuation-calculator');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    calculateValuation();
  }, [inputs]);

  const calculateValuation = useCallback(() => {
    // DCF Calculation
    const projectedCashFlows: number[] = [];
    let currentRevenue = inputs.annualRevenue;
    
    for (let year = 1; year <= inputs.projectionYears; year++) {
      currentRevenue *= (1 + inputs.growthRate / 100);
      const netIncome = currentRevenue * (inputs.netMargin / 100);
      const freeCashFlow = netIncome * 0.85; // Assuming 85% FCF conversion
      projectedCashFlows.push(freeCashFlow);
    }

    // Terminal Value
    const finalYearCashFlow = projectedCashFlows[projectedCashFlows.length - 1];
    const terminalCashFlow = finalYearCashFlow * (1 + inputs.terminalGrowthRate / 100);
    const terminalValue = terminalCashFlow / (inputs.discountRate / 100 - inputs.terminalGrowthRate / 100);

    // Present Value of Cash Flows
    let pvCashFlows = 0;
    projectedCashFlows.forEach((cf, index) => {
      pvCashFlows += cf / Math.pow(1 + inputs.discountRate / 100, index + 1);
    });

    const pvTerminalValue = terminalValue / Math.pow(1 + inputs.discountRate / 100, inputs.projectionYears);
    const enterpriseValue = pvCashFlows + pvTerminalValue;
    const dcfValuation = enterpriseValue; // Assuming no net debt

    // Multiple Valuation
    const ebitdaValuation = inputs.ebitda * inputs.industryMultiple;
    const revenueValuation = inputs.annualRevenue * inputs.revenueMultiple;
    const multipleValuation = (ebitdaValuation + revenueValuation) / 2;

    // Asset Valuation
    const bookValue = inputs.totalAssets - inputs.totalLiabilities;
    const adjustedBookValue = bookValue - inputs.intangibleAssets;
    const assetValuation = adjustedBookValue * (1 + inputs.marketPremium / 100);

    // Average Valuation
    const averageValuation = (dcfValuation + multipleValuation + assetValuation) / 3;

    setResults({
      dcfValuation,
      multipleValuation,
      assetValuation,
      averageValuation,
      projectedCashFlows,
      terminalValue,
      enterpriseValue,
      equityValue: dcfValuation
    });
  }, [inputs]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getValuationInsight = (): string => {
    const valuations = [results.dcfValuation, results.multipleValuation, results.assetValuation];
    const maxVal = Math.max(...valuations);
    const minVal = Math.min(...valuations);
    const spread = ((maxVal - minVal) / results.averageValuation) * 100;

    if (spread < 20) {
      return "Valuations are closely aligned, indicating good consensus on business value.";
    } else if (spread < 50) {
      return "Moderate valuation spread suggests some uncertainty in business value.";
    } else {
      return "High valuation spread indicates significant uncertainty - consider additional analysis.";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
          Professional Business Valuation Suite
        </Badge>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary}`}>
          Business Valuation Calculator
        </h1>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Determine business worth using multiple professional valuation methods including DCF, 
          market multiples, and asset-based approaches for comprehensive analysis.
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
                Valuation Inputs
              </CardTitle>
              <CardDescription className={theme.textColors.secondary}>
                Enter business financial metrics for comprehensive valuation analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeMethod} onValueChange={setActiveMethod}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dcf">DCF</TabsTrigger>
                  <TabsTrigger value="multiple">Multiple</TabsTrigger>
                  <TabsTrigger value="asset">Asset</TabsTrigger>
                </TabsList>

                <TabsContent value="dcf" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Annual Revenue</Label>
                      <Input
                        type="number"
                        value={inputs.annualRevenue}
                        onChange={(e) => setInputs({...inputs, annualRevenue: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Growth Rate (%)</Label>
                      <Input
                        type="number"
                        value={inputs.growthRate}
                        onChange={(e) => setInputs({...inputs, growthRate: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Net Margin (%)</Label>
                      <Input
                        type="number"
                        value={inputs.netMargin}
                        onChange={(e) => setInputs({...inputs, netMargin: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Discount Rate (%)</Label>
                      <Input
                        type="number"
                        value={inputs.discountRate}
                        onChange={(e) => setInputs({...inputs, discountRate: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Terminal Growth Rate (%)</Label>
                      <Input
                        type="number"
                        value={inputs.terminalGrowthRate}
                        onChange={(e) => setInputs({...inputs, terminalGrowthRate: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Projection Years</Label>
                      <Input
                        type="number"
                        value={inputs.projectionYears}
                        onChange={(e) => setInputs({...inputs, projectionYears: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="multiple" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Industry EBITDA Multiple</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={inputs.industryMultiple}
                        onChange={(e) => setInputs({...inputs, industryMultiple: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Annual EBITDA</Label>
                      <Input
                        type="number"
                        value={inputs.ebitda}
                        onChange={(e) => setInputs({...inputs, ebitda: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Revenue Multiple</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={inputs.revenueMultiple}
                        onChange={(e) => setInputs({...inputs, revenueMultiple: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="asset" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className={theme.textColors.secondary}>Total Assets</Label>
                      <Input
                        type="number"
                        value={inputs.totalAssets}
                        onChange={(e) => setInputs({...inputs, totalAssets: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Total Liabilities</Label>
                      <Input
                        type="number"
                        value={inputs.totalLiabilities}
                        onChange={(e) => setInputs({...inputs, totalLiabilities: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Intangible Assets</Label>
                      <Input
                        type="number"
                        value={inputs.intangibleAssets}
                        onChange={(e) => setInputs({...inputs, intangibleAssets: Number(e.target.value)})}
                        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                      />
                    </div>
                    <div>
                      <Label className={theme.textColors.secondary}>Market Premium (%)</Label>
                      <Input
                        type="number"
                        value={inputs.marketPremium}
                        onChange={(e) => setInputs({...inputs, marketPremium: Number(e.target.value)})}
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
          {/* Valuation Summary */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Building2 className="w-5 h-5" />
                Valuation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      Business Valuation Methods
                    </h3>
                    <PieChart className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>DCF Valuation:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(results.dcfValuation)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Multiple Valuation:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(results.multipleValuation)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Asset Valuation:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(results.assetValuation)}
                      </span>
                    </div>
                    <div className="border-t border-slate-700 pt-3">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${theme.textColors.primary}`}>Average Valuation:</span>
                        <span className={`text-xl font-bold text-green-400`}>
                          {formatCurrency(results.averageValuation)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      DCF Components
                    </h3>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Enterprise Value:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(results.enterpriseValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Terminal Value:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(results.terminalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Projection Years:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {inputs.projectionYears} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={theme.textColors.secondary}>Discount Rate:</span>
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercentage(inputs.discountRate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Projections */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5" />
                Projected Cash Flows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {results.projectedCashFlows.map((cf, index) => (
                  <div key={index} className={`${theme.backgrounds.card} rounded-lg p-3 text-center`}>
                    <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                      Year {index + 1}
                    </div>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatCurrency(cf)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis & Insights */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Target className="w-5 h-5" />
                Valuation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <Info className="w-4 h-4" />
                <AlertDescription className={theme.textColors.secondary}>
                  {getValuationInsight()}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Strengths</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className={theme.textColors.secondary}>
                      • Multiple valuation methods provide comprehensive view
                    </div>
                    <div className={theme.textColors.secondary}>
                      • DCF captures long-term growth potential
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Market multiples reflect current conditions
                    </div>
                  </div>
                </div>

                <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Considerations</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className={theme.textColors.secondary}>
                      • Projections are estimates and subject to change
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Market conditions affect multiple valuations
                    </div>
                    <div className={theme.textColors.secondary}>
                      • Consider qualitative factors not captured
                    </div>
                  </div>
                </div>
              </div>

              <div className={`bg-blue-50/10 border border-blue-500/20 rounded-lg p-4 mt-4`}>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Professional Tip
                    </h5>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Use multiple valuation methods to triangulate value. DCF is best for mature businesses 
                      with predictable cash flows, while multiples work well for comparison with similar companies. 
                      Asset-based methods provide a floor value and work well for asset-heavy businesses.
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

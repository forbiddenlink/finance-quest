'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Calendar, 
  Info,
  Plus,
  Minus,
  Target,
  BarChart3
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LadderRung {
  id: number;
  maturity: number;
  principal: number;
  couponRate: number;
  purchasePrice: number;
  yieldToMaturity: number;
  maturityDate: Date;
}

interface LadderAnalysis {
  totalInvestment: number;
  averageYield: number;
  averageMaturity: number;
  annualCashFlow: number;
  totalReturn: number;
  reinvestmentSchedule: Array<{
    year: number;
    maturityAmount: number;
    couponIncome: number;
    totalCashFlow: number;
  }>;
  riskMetrics: {
    durationRisk: 'Low' | 'Moderate' | 'High';
    reinvestmentRisk: 'Low' | 'Moderate' | 'High';
    concentrationRisk: 'Low' | 'Moderate' | 'High';
  };
}

export default function BondLadderBuilder() {
  const [ladderRungs, setLadderRungs] = useState<LadderRung[]>([
    {
      id: 1,
      maturity: 1,
      principal: 10000,
      couponRate: 4.2,
      purchasePrice: 99.5,
      yieldToMaturity: 4.5,
      maturityDate: new Date(new Date().getFullYear() + 1, 11, 31)
    },
    {
      id: 2,
      maturity: 2,
      principal: 10000,
      couponRate: 4.5,
      purchasePrice: 100.0,
      yieldToMaturity: 4.5,
      maturityDate: new Date(new Date().getFullYear() + 2, 11, 31)
    },
    {
      id: 3,
      maturity: 3,
      principal: 10000,
      couponRate: 4.7,
      purchasePrice: 100.5,
      yieldToMaturity: 4.6,
      maturityDate: new Date(new Date().getFullYear() + 3, 11, 31)
    },
    {
      id: 4,
      maturity: 4,
      principal: 10000,
      couponRate: 4.9,
      purchasePrice: 101.0,
      yieldToMaturity: 4.7,
      maturityDate: new Date(new Date().getFullYear() + 4, 11, 31)
    },
    {
      id: 5,
      maturity: 5,
      principal: 10000,
      couponRate: 5.1,
      purchasePrice: 101.5,
      yieldToMaturity: 4.8,
      maturityDate: new Date(new Date().getFullYear() + 5, 11, 31)
    }
  ]);

  const [analysis, setAnalysis] = useState<LadderAnalysis | null>(null);
  const [reinvestmentRate, setReinvestmentRate] = useState<number>(4.5);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('bond-ladder-builder');
  }, [recordCalculatorUsage]);

  const addLadderRung = () => {
    const maxMaturity = Math.max(...ladderRungs.map(r => r.maturity));
    const newRung: LadderRung = {
      id: Math.max(...ladderRungs.map(r => r.id)) + 1,
      maturity: maxMaturity + 1,
      principal: 10000,
      couponRate: 5.0,
      purchasePrice: 100.0,
      yieldToMaturity: 5.0,
      maturityDate: new Date(new Date().getFullYear() + maxMaturity + 1, 11, 31)
    };
    setLadderRungs([...ladderRungs, newRung]);
  };

  const removeLadderRung = (id: number) => {
    if (ladderRungs.length > 1) {
      setLadderRungs(ladderRungs.filter(rung => rung.id !== id));
    }
  };

  const updateLadderRung = (id: number, field: keyof LadderRung, value: number) => {
    setLadderRungs(ladderRungs.map(rung => 
      rung.id === id 
        ? { 
            ...rung, 
            [field]: value,
            maturityDate: field === 'maturity' 
              ? new Date(new Date().getFullYear() + value, 11, 31)
              : rung.maturityDate
          }
        : rung
    ));
  };

  const analyzeLadder = useCallback((): LadderAnalysis => {
    const totalInvestment = ladderRungs.reduce((sum, rung) => 
      sum + (rung.principal * rung.purchasePrice / 100), 0
    );

    const weightedYield = ladderRungs.reduce((sum, rung) => 
      sum + (rung.yieldToMaturity * rung.principal), 0
    ) / ladderRungs.reduce((sum, rung) => sum + rung.principal, 0);

    const weightedMaturity = ladderRungs.reduce((sum, rung) => 
      sum + (rung.maturity * rung.principal), 0
    ) / ladderRungs.reduce((sum, rung) => sum + rung.principal, 0);

    const annualCashFlow = ladderRungs.reduce((sum, rung) => 
      sum + (rung.principal * rung.couponRate / 100), 0
    );

    // Calculate reinvestment schedule
    const reinvestmentSchedule = [];
    const maxMaturity = Math.max(...ladderRungs.map(r => r.maturity));
    
    for (let year = 1; year <= maxMaturity; year++) {
      const maturingBonds = ladderRungs.filter(rung => rung.maturity === year);
      const maturityAmount = maturingBonds.reduce((sum, bond) => sum + bond.principal, 0);
      
      // Calculate coupon income for all bonds still outstanding
      const couponIncome = ladderRungs
        .filter(rung => rung.maturity >= year)
        .reduce((sum, rung) => sum + (rung.principal * rung.couponRate / 100), 0);
      
      const totalCashFlow = maturityAmount + couponIncome;
      
      reinvestmentSchedule.push({
        year,
        maturityAmount,
        couponIncome,
        totalCashFlow
      });
    }

    // Calculate total return over the ladder period
    const totalMaturityValue = ladderRungs.reduce((sum, rung) => sum + rung.principal, 0);
    const totalCouponIncome = annualCashFlow * maxMaturity;
    const totalReturn = ((totalMaturityValue + totalCouponIncome - totalInvestment) / totalInvestment) * 100;

    // Risk assessment
    const durationRisk = weightedMaturity < 3 ? 'Low' : weightedMaturity < 7 ? 'Moderate' : 'High';
    const reinvestmentRisk = maxMaturity < 5 ? 'Low' : maxMaturity < 10 ? 'Moderate' : 'High';
    
    // Check concentration risk
    const largestPosition = Math.max(...ladderRungs.map(r => r.principal));
    const concentrationRatio = largestPosition / ladderRungs.reduce((sum, r) => sum + r.principal, 0);
    const concentrationRisk = concentrationRatio < 0.3 ? 'Low' : concentrationRatio < 0.5 ? 'Moderate' : 'High';

    return {
      totalInvestment,
      averageYield: weightedYield,
      averageMaturity: weightedMaturity,
      annualCashFlow,
      totalReturn,
      reinvestmentSchedule,
      riskMetrics: {
        durationRisk: durationRisk as 'Low' | 'Moderate' | 'High',
        reinvestmentRisk: reinvestmentRisk as 'Low' | 'Moderate' | 'High',
        concentrationRisk: concentrationRisk as 'Low' | 'Moderate' | 'High'
      }
    };
  }, [ladderRungs]);

  const handleAnalyze = () => {
    const ladderAnalysis = analyzeLadder();
    setAnalysis(ladderAnalysis);
  };

  const getRiskColor = (risk: 'Low' | 'Moderate' | 'High') => {
    switch (risk) {
      case 'Low': return theme.status.success.text;
      case 'Moderate': return theme.status.warning.text;
      case 'High': return theme.status.error.text;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-full flex items-center justify-center mx-auto`}>
          <Layers className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          Bond Ladder Builder
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Design and analyze bond ladders for steady income and reduced interest rate risk
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ladder Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center justify-between`}>
                <div className="flex items-center">
                  <Calendar className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                  Ladder Configuration
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addLadderRung}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Configure each bond in your ladder strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ladderRungs.map((rung, index) => (
                  <motion.div
                    key={rung.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 ${theme.backgrounds.card} rounded-lg border space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className={`font-medium ${theme.textColors.primary}`}>
                        Bond {index + 1} - {rung.maturity} Year{rung.maturity > 1 ? 's' : ''}
                      </h5>
                      {ladderRungs.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLadderRung(rung.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Principal ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={rung.principal}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            updateLadderRung(rung.id, 'principal', value);
                            if (value < 0) {
                              e.target.setAttribute('aria-invalid', 'true');
                              e.target.setAttribute('aria-describedby', `principal-${rung.id}-error`);
                            } else {
                              e.target.setAttribute('aria-invalid', 'false');
                              e.target.removeAttribute('aria-describedby');
                            }
                          }}
                          onBlur={(e) => {
                            const value = Number(e.target.value);
                            if (value < 0) {
                              e.target.setAttribute('aria-invalid', 'true');
                              e.target.setAttribute('aria-describedby', `principal-${rung.id}-error`);
                            } else {
                              e.target.setAttribute('aria-invalid', 'false');
                              e.target.removeAttribute('aria-describedby');
                            }
                          }}
                          className="h-8 text-sm"
                        />
                        {rung.principal < 0 && (
                          <div id={`principal-${rung.id}-error`} role="alert" className="text-red-400 text-sm mt-1">
                            Invalid value: must be positive
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Maturity (Years)</Label>
                        <Input
                          type="number"
                          value={rung.maturity}
                          onChange={(e) => updateLadderRung(rung.id, 'maturity', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Coupon Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={rung.couponRate}
                          onChange={(e) => updateLadderRung(rung.id, 'couponRate', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Purchase Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={rung.purchasePrice}
                          onChange={(e) => updateLadderRung(rung.id, 'purchasePrice', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">YTM (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={rung.yieldToMaturity}
                          onChange={(e) => updateLadderRung(rung.id, 'yieldToMaturity', Number(e.target.value))}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Maturity Date</Label>
                        <div className={`h-8 px-2 border rounded flex items-center text-xs ${theme.textColors.secondary}`}>
                          {rung.maturityDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Advanced Settings */}
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full mb-3"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                </Button>

                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="reinvestmentRate">Expected Reinvestment Rate (%)</Label>
                      <Input
                        id="reinvestmentRate"
                        type="number"
                        step="0.1"
                        value={reinvestmentRate}
                        onChange={(e) => setReinvestmentRate(Number(e.target.value))}
                        placeholder="4.5"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              <Button 
                onClick={handleAnalyze}
                className={`w-full ${theme.buttons.primary}`}
                size="lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Bond Ladder
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <Target className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Ladder Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-3 ${theme.backgrounds.card} rounded border text-center`}>
                <div className={`text-xl font-bold ${theme.status.success.text}`}>
                  {ladderRungs.length}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Bond Rungs</div>
              </div>
              
              <div className={`p-3 ${theme.backgrounds.card} rounded border text-center`}>
                <div className={`text-xl font-bold ${theme.status.info.text}`}>
                  {formatCurrency(ladderRungs.reduce((sum, r) => sum + r.principal, 0))}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Total Principal</div>
              </div>

              <div className={`p-3 ${theme.backgrounds.card} rounded border text-center`}>
                <div className={`text-xl font-bold ${theme.status.warning.text}`}>
                  {Math.min(...ladderRungs.map(r => r.maturity))}-{Math.max(...ladderRungs.map(r => r.maturity))} Years
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Maturity Range</div>
              </div>

              <div className={`p-3 ${theme.backgrounds.card} rounded border text-center`}>
                <div className={`text-xl font-bold ${theme.textColors.primary}`}>
                  {formatCurrency(ladderRungs.reduce((sum, r) => sum + (r.principal * r.couponRate / 100), 0))}
                </div>
                <div className={`text-sm ${theme.textColors.secondary}`}>Annual Coupon Income</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <BarChart3 className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Ladder Analysis Results
              </CardTitle>
              <CardDescription>Comprehensive analysis of your bond ladder strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.success.text}`}>
                    {analysis.averageYield.toFixed(2)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Average Yield</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.info.text}`}>
                    {analysis.averageMaturity.toFixed(1)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Avg. Maturity (Years)</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.warning.text}`}>
                    {formatCurrency(analysis.annualCashFlow)}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Annual Cash Flow</div>
                </div>
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.status.error.text}`}>
                    {analysis.totalReturn.toFixed(1)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Total Return</div>
                </div>
              </div>

              <Separator />

              {/* Risk Assessment */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Risk Assessment</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Duration Risk:</span>
                      <Badge 
                        variant="outline"
                        className={`${getRiskColor(analysis.riskMetrics.durationRisk)} border-current`}
                      >
                        {analysis.riskMetrics.durationRisk}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Reinvestment Risk:</span>
                      <Badge 
                        variant="outline"
                        className={`${getRiskColor(analysis.riskMetrics.reinvestmentRisk)} border-current`}
                      >
                        {analysis.riskMetrics.reinvestmentRisk}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Concentration Risk:</span>
                      <Badge 
                        variant="outline"
                        className={`${getRiskColor(analysis.riskMetrics.concentrationRisk)} border-current`}
                      >
                        {analysis.riskMetrics.concentrationRisk}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cash Flow Schedule */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Cash Flow Schedule</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysis.reinvestmentSchedule}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `Year ${value}`}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `$${Number(value).toLocaleString()}`, 
                          name === 'maturityAmount' ? 'Maturity' :
                          name === 'couponIncome' ? 'Coupons' : 'Total'
                        ]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Bar dataKey="maturityAmount" stackId="a" fill="#3b82f6" name="Maturity Amount" />
                      <Bar dataKey="couponIncome" stackId="a" fill="#10b981" name="Coupon Income" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Separator />

              {/* Maturity Timeline */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Maturity Timeline</h4>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th scope="col" className="text-left">Maturity</th>
                      <th scope="col" className="text-left">Principal</th>
                      <th scope="col" className="text-left">Coupon Rate</th>
                      <th scope="col" className="text-left">Maturity Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ladderRungs
                      .sort((a, b) => a.maturity - b.maturity)
                      .map((rung) => (
                        <tr key={rung.id}>
                          <td className="py-2">
                            <Badge variant="outline">
                              Year {rung.maturity}
                            </Badge>
                          </td>
                          <td className={`py-2 text-sm ${theme.textColors.primary}`}>
                            {formatCurrency(rung.principal)}
                          </td>
                          <td className={`py-2 text-sm ${theme.textColors.primary}`}>
                            {rung.couponRate}%
                          </td>
                          <td className={`py-2 text-sm ${theme.textColors.secondary}`}>
                            {rung.maturityDate.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Educational Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className={`${theme.status.info.bg}/10 border ${theme.status.info.border}`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Bond Ladder Strategy Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Ladder Benefits:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Interest Rate Protection:</span> Reduced duration risk</li>
                  <li>• <span className="font-medium">Regular Income:</span> Predictable cash flows</li>
                  <li>• <span className="font-medium">Reinvestment Opportunity:</span> Capture rising rates</li>
                  <li>• <span className="font-medium">Liquidity:</span> Regular principal returns</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Implementation Tips:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Start with equal amounts in each rung</li>
                  <li>• Reinvest maturity proceeds in longest rung</li>
                  <li>• Consider Treasury bonds for simplicity</li>
                  <li>• Monitor for calling risk in corporate bonds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

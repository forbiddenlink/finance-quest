'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { theme } from '@/lib/theme';
import { Calculator, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Percent, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProgressStore } from '@/lib/store/progressStore';

interface ValuationResults {
  intrinsicValue: number;
  fairValue: number;
  upside: number;
  riskScore: number;
  investmentGrade: string;
  keyStrengths: string[];
  keyRisks: string[];
}

export default function StockAnalysisCalculator() {
  const [symbol, setSymbol] = useState('AAPL');
  const [currentPrice, setCurrentPrice] = useState('150.00');
  const [earnings, setEarnings] = useState('6.05');
  const [bookValue, setBookValue] = useState('4.15');
  const [revenue, setRevenue] = useState('365.8');
  const [growthRate, setGrowthRate] = useState('8.5');
  const [dividendYield, setDividendYield] = useState('0.52');
  const [debt, setDebt] = useState('110.0');
  const [equity, setEquity] = useState('62.1');
  const [results, setResults] = useState<ValuationResults | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<{
    month: string;
    price: string;
    pe: string;
  }>>([]);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('stock-analysis-calculator');
  }, [recordCalculatorUsage]);

  const analyzeStock = () => {
    const price = parseFloat(currentPrice) || 150;
    const eps = parseFloat(earnings) || 6;
    const bv = parseFloat(bookValue) || 4;
    const growth = parseFloat(growthRate) || 8;
    const divYield = parseFloat(dividendYield) || 0.5;
    const totalDebt = parseFloat(debt) || 110;
    const totalEquity = parseFloat(equity) || 62;

    // Calculate key ratios
    const peRatio = price / eps;
    const pbRatio = price / bv;
    const pegRatio = peRatio / growth;
    const debtToEquity = totalDebt / totalEquity;

    // DCF-based intrinsic value (simplified)
    const futureEarnings = eps * Math.pow(1 + growth / 100, 5);
    const terminalValue = futureEarnings * 15; // 15x terminal multiple
    const discountRate = 0.10; // 10% discount rate
    const intrinsicValue = terminalValue / Math.pow(1 + discountRate, 5);

    // Fair value based on industry averages
    const industryPE = 18; // Tech industry average
    const fairValue = eps * industryPE;

    // Calculate upside/downside
    const upside = ((intrinsicValue - price) / price) * 100;

    // Risk scoring (0-100, higher = riskier)
    let riskScore = 0;
    if (peRatio > 25) riskScore += 20;
    if (pegRatio > 2) riskScore += 15;
    if (pbRatio > 5) riskScore += 10;
    if (debtToEquity > 0.5) riskScore += 20;
    if (growth < 5) riskScore += 15;
    if (divYield < 1) riskScore += 10;

    // Investment grade
    let grade = 'A';
    if (riskScore > 70) grade = 'C';
    else if (riskScore > 40) grade = 'B';

    // Determine strengths and risks
    const keyStrengths = [];
    const keyRisks = [];

    if (peRatio < 20) keyStrengths.push('Reasonable valuation (P/E < 20)');
    if (pegRatio < 1.5) keyStrengths.push('Strong growth at reasonable price');
    if (growth > 10) keyStrengths.push('High growth rate');
    if (divYield > 2) keyStrengths.push('Attractive dividend yield');
    if (debtToEquity < 0.3) keyStrengths.push('Strong balance sheet');

    if (peRatio > 30) keyRisks.push('High valuation risk (P/E > 30)');
    if (pegRatio > 2) keyRisks.push('Expensive relative to growth');
    if (debtToEquity > 0.8) keyRisks.push('High debt levels');
    if (growth < 3) keyRisks.push('Slow growth prospects');
    if (pbRatio > 10) keyRisks.push('High price-to-book ratio');

    if (keyStrengths.length === 0) keyStrengths.push('Moderate investment characteristics');
    if (keyRisks.length === 0) keyRisks.push('Well-balanced risk profile');

    setResults({
      intrinsicValue,
      fairValue,
      upside,
      riskScore,
      investmentGrade: grade,
      keyStrengths: keyStrengths.slice(0, 3),
      keyRisks: keyRisks.slice(0, 3)
    });

    // Generate historical data simulation
    const historical = [];
    for (let i = 12; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
      const simulatedPrice = price * (1 + variance);
      historical.push({
        month: `${i}M ago`,
        price: simulatedPrice.toFixed(2),
        pe: (simulatedPrice / eps).toFixed(1)
      });
    }
    setHistoricalData(historical);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return `${theme.status.success.text} ${theme.status.success.bg} ${theme.status.success.border}`;
    if (score <= 60) return `${theme.status.warning.text} ${theme.status.warning.bg} ${theme.status.warning.border}`;
    return `${theme.status.error.text} ${theme.status.error.bg} ${theme.status.error.border}`;
  };

  const getUpsideColor = (upside: number) => {
    if (upside > 20) return theme.status.success.text;
    if (upside > 0) return theme.status.info.text;
    return theme.status.error.text;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className={`w-5 h-5 ${theme.textColors.accent}`} />
              <span>Stock Fundamentals</span>
            </CardTitle>
            <CardDescription>Enter the company&apos;s financial metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Symbol
                </label>
                <Input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="AAPL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Current Price ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  placeholder="150.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Earnings Per Share ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={earnings}
                  onChange={(e) => setEarnings(e.target.value)}
                  placeholder="6.05"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Book Value Per Share ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={bookValue}
                  onChange={(e) => setBookValue(e.target.value)}
                  placeholder="4.15"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Annual Revenue (B)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="365.8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Growth Rate (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(e.target.value)}
                  placeholder="8.5"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Dividend Yield (%)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={dividendYield}
                  onChange={(e) => setDividendYield(e.target.value)}
                  placeholder="0.52"
                />
              </div>
              <div>
                <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                  Total Debt (B)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={debt}
                  onChange={(e) => setDebt(e.target.value)}
                  placeholder="110.0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium ${theme.textColors.primary} mb-1">
                Total Equity (B)
              </label>
              <Input
                type="number"
                step="0.1"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                placeholder="62.1"
              />
            </div>
            
            <Button onClick={analyzeStock} className="w-full">
              Analyze Stock
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className={`w-5 h-5 ${theme.status.success.text}`} />
              <span>Valuation Analysis</span>
            </CardTitle>
            <CardDescription>Investment recommendation and risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 ${theme.status.info.bg} rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className={`w-4 h-4 ${theme.status.info.text}`} />
                      <span className="text-sm font-medium ${theme.textColors.secondary}">Intrinsic Value</span>
                    </div>
                    <p className="text-lg font-bold ${theme.status.info.text}">
                      {formatCurrency(results.intrinsicValue)}
                    </p>
                  </div>
                  
                  <div className="p-3 ${theme.status.success.bg} rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Target className={`w-4 h-4 ${theme.status.success.text}`} />
                      <span className="text-sm font-medium ${theme.textColors.primary}">Fair Value</span>
                    </div>
                    <p className="text-lg font-bold ${theme.status.success.text}">
                      {formatCurrency(results.fairValue)}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      {results.upside > 0 ? (
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-sm font-medium ${theme.textColors.primary}">Upside Potential</span>
                    </div>
                    <p className={`text-lg font-bold ${getUpsideColor(results.upside)}`}>
                      {formatPercent(results.upside)}
                    </p>
                  </div>
                  
                  <div className="p-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Percent className="w-4 h-4 ${theme.textColors.secondary}" />
                      <span className="text-sm font-medium ${theme.textColors.primary}">Investment Grade</span>
                    </div>
                    <p className="text-lg font-bold ${theme.textColors.primary}">
                      {results.investmentGrade}
                    </p>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg border ${getRiskColor(results.riskScore)}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Risk Score</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{results.riskScore}/100</span>
                    <Badge variant="outline" className="${theme.backgrounds.glass} border ${theme.borderColors.primary}/50">
                      {results.riskScore <= 30 ? 'Low Risk' : results.riskScore <= 60 ? 'Medium Risk' : 'High Risk'}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium ${theme.textColors.primary} mb-2 flex items-center">
                      <div className="w-2 h-2 ${theme.status.success.bg}0 rounded-full mr-2"></div>
                      Key Strengths
                    </h4>
                    <ul className="space-y-1 text-sm ${theme.textColors.secondary}">
                      {results.keyStrengths.map((strength, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span>•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium ${theme.textColors.primary} mb-2 flex items-center">
                      <div className="w-2 h-2 ${theme.status.error.bg}0 rounded-full mr-2"></div>
                      Key Risks
                    </h4>
                    <ul className="space-y-1 text-sm ${theme.textColors.secondary}">
                      {results.keyRisks.map((risk, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span>•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 ${theme.textColors.muted}">
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter stock details and click analyze to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historical Chart */}
      {historicalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Price Trend Analysis</span>
            </CardTitle>
            <CardDescription>
              Historical price movement and valuation metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="month"  tick={{ fill: "#94a3b8" }} />
                  <YAxis  tick={{ fill: "#94a3b8" }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'price' ? `$${value}` : `${value}x`,
                      name === 'price' ? 'Price' : 'P/E Ratio'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Analysis Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 ${theme.status.info.bg} rounded-lg border ${theme.status.info.border}">
              <h4 className="font-medium ${theme.textColors.secondary} mb-2">Valuation Metrics</h4>
              <div className="space-y-1 text-sm ${theme.textColors.secondary}">
                <p><span className="font-medium">P/E Ratio:</span> Price ÷ Earnings per share</p>
                <p><span className="font-medium">PEG Ratio:</span> P/E ÷ Growth rate</p>
                <p><span className="font-medium">P/B Ratio:</span> Price ÷ Book value per share</p>
              </div>
            </div>
            
            <div className="p-4 ${theme.status.success.bg} rounded-lg border ${theme.status.success.border}">
              <h4 className="font-medium ${theme.textColors.primary} mb-2">Quality Indicators</h4>
              <div className="space-y-1 text-sm ${theme.textColors.secondary}">
                <p><span className="font-medium">ROE:</span> Return on equity</p>
                <p><span className="font-medium">Debt/Equity:</span> Financial leverage</p>
                <p><span className="font-medium">Growth Rate:</span> Revenue/earnings growth</p>
              </div>
            </div>
            
            <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <h4 className="font-medium ${theme.textColors.primary} mb-2">Investment Rules</h4>
              <div className="space-y-1 text-sm text-purple-700">
                <p><span className="font-medium">Diversify:</span> Don&apos;t put all eggs in one basket</p>
                <p><span className="font-medium">Long-term:</span> Hold quality stocks for years</p>
                <p><span className="font-medium">Research:</span> Understand the business model</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 ${theme.status.warning.bg} rounded-lg border ${theme.status.warning.border}">
            <h4 className="font-medium ${theme.status.warning.text} mb-2">⚠️ Important Disclaimer</h4>
            <p className="${theme.textColors.secondary} text-sm">
              This calculator provides educational analysis based on simplified models. It should not be used as the sole basis 
              for investment decisions. Always conduct thorough research, consider multiple valuation methods, and consult with 
              financial professionals before investing. Past performance does not guarantee future results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

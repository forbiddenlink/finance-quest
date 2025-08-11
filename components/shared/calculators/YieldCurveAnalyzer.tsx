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
  TrendingUp,
  BarChart3,
  Info,
  Target,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface YieldPoint {
  maturity: number;
  yield: number;
  label: string;
}

interface YieldCurveAnalysis {
  curveType: 'Normal' | 'Inverted' | 'Flat' | 'Humped';
  slope: number;
  spread_2_10: number;
  spread_3m_10y: number;
  economicSignal: string;
  recommendation: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
}

export default function YieldCurveAnalyzer() {
  // Yield Curve Data Points
  const [yields, setYields] = useState<YieldPoint[]>([
    { maturity: 0.25, yield: 4.2, label: '3M' },
    { maturity: 0.5, yield: 4.3, label: '6M' },
    { maturity: 1, yield: 4.4, label: '1Y' },
    { maturity: 2, yield: 4.6, label: '2Y' },
    { maturity: 3, yield: 4.7, label: '3Y' },
    { maturity: 5, yield: 4.8, label: '5Y' },
    { maturity: 7, yield: 4.9, label: '7Y' },
    { maturity: 10, yield: 5.0, label: '10Y' },
    { maturity: 20, yield: 5.1, label: '20Y' },
    { maturity: 30, yield: 5.2, label: '30Y' }
  ]);

  // Historical scenarios for comparison
  const [selectedScenario, setSelectedScenario] = useState<string>('current');
  const [analysis, setAnalysis] = useState<YieldCurveAnalysis | null>(null);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('yield-curve-analyzer');
  }, [recordCalculatorUsage]);

  // Predefined scenarios
  const scenarios = {
    current: [
      { maturity: 0.25, yield: 4.2, label: '3M' },
      { maturity: 0.5, yield: 4.3, label: '6M' },
      { maturity: 1, yield: 4.4, label: '1Y' },
      { maturity: 2, yield: 4.6, label: '2Y' },
      { maturity: 3, yield: 4.7, label: '3Y' },
      { maturity: 5, yield: 4.8, label: '5Y' },
      { maturity: 7, yield: 4.9, label: '7Y' },
      { maturity: 10, yield: 5.0, label: '10Y' },
      { maturity: 20, yield: 5.1, label: '20Y' },
      { maturity: 30, yield: 5.2, label: '30Y' }
    ],
    inverted_2022: [
      { maturity: 0.25, yield: 3.8, label: '3M' },
      { maturity: 0.5, yield: 3.9, label: '6M' },
      { maturity: 1, yield: 4.2, label: '1Y' },
      { maturity: 2, yield: 4.4, label: '2Y' },
      { maturity: 3, yield: 3.9, label: '3Y' },
      { maturity: 5, yield: 3.5, label: '5Y' },
      { maturity: 7, yield: 3.4, label: '7Y' },
      { maturity: 10, yield: 3.3, label: '10Y' },
      { maturity: 20, yield: 3.6, label: '20Y' },
      { maturity: 30, yield: 3.8, label: '30Y' }
    ],
    steep_2020: [
      { maturity: 0.25, yield: 0.1, label: '3M' },
      { maturity: 0.5, yield: 0.2, label: '6M' },
      { maturity: 1, yield: 0.3, label: '1Y' },
      { maturity: 2, yield: 0.6, label: '2Y' },
      { maturity: 3, yield: 1.0, label: '3Y' },
      { maturity: 5, yield: 1.5, label: '5Y' },
      { maturity: 7, yield: 1.8, label: '7Y' },
      { maturity: 10, yield: 2.1, label: '10Y' },
      { maturity: 20, yield: 2.6, label: '20Y' },
      { maturity: 30, yield: 2.8, label: '30Y' }
    ],
    flat_2015: [
      { maturity: 0.25, yield: 0.1, label: '3M' },
      { maturity: 0.5, yield: 0.2, label: '6M' },
      { maturity: 1, yield: 0.5, label: '1Y' },
      { maturity: 2, yield: 1.2, label: '2Y' },
      { maturity: 3, yield: 1.6, label: '3Y' },
      { maturity: 5, yield: 2.0, label: '5Y' },
      { maturity: 7, yield: 2.2, label: '7Y' },
      { maturity: 10, yield: 2.3, label: '10Y' },
      { maturity: 20, yield: 2.4, label: '20Y' },
      { maturity: 30, yield: 2.5, label: '30Y' }
    ]
  };

  const analyzeYieldCurve = useCallback((yieldData: YieldPoint[]): YieldCurveAnalysis => {
    // Calculate spreads
    const shortRate = yieldData.find(y => y.maturity === 0.25)?.yield || 0;
    const twoYearRate = yieldData.find(y => y.maturity === 2)?.yield || 0;
    const tenYearRate = yieldData.find(y => y.maturity === 10)?.yield || 0;
    const thirtyYearRate = yieldData.find(y => y.maturity === 30)?.yield || 0;

    const spread_2_10 = tenYearRate - twoYearRate;
    const spread_3m_10y = tenYearRate - shortRate;
    const slope = (thirtyYearRate - shortRate) / 29.75; // slope per year

    // Determine curve type
    let curveType: 'Normal' | 'Inverted' | 'Flat' | 'Humped' = 'Normal';
    let economicSignal = '';
    let recommendation = '';
    let riskLevel: 'Low' | 'Moderate' | 'High' = 'Moderate';

    if (spread_2_10 < -0.2) {
      curveType = 'Inverted';
      economicSignal = 'Potential recession signal. Historically, inversions precede economic downturns within 6-24 months.';
      recommendation = 'Consider defensive positioning: shorter duration bonds, high-quality credits, potential shift to equities if inversion normalizes.';
      riskLevel = 'High';
    } else if (spread_2_10 < 0.3) {
      curveType = 'Flat';
      economicSignal = 'Economic uncertainty or transition period. Growth and inflation expectations are muted.';
      recommendation = 'Neutral positioning. Monitor for directional changes. Consider barbell strategy to capture rate movements.';
      riskLevel = 'Moderate';
    } else if (spread_2_10 > 2.0) {
      curveType = 'Normal';
      economicSignal = 'Strong economic growth expected. Inflation concerns may be rising.';
      recommendation = 'Consider longer duration for capital appreciation as rates stabilize. Monitor inflation indicators.';
      riskLevel = 'Low';
    } else {
      // Check for humped curve
      const fiveYearRate = yieldData.find(y => y.maturity === 5)?.yield || 0;
      if (fiveYearRate > shortRate + 0.5 && fiveYearRate > tenYearRate) {
        curveType = 'Humped';
        economicSignal = 'Mixed economic signals. Near-term uncertainty with longer-term stability.';
        recommendation = 'Focus on intermediate maturities (3-7 years) to capture the hump premium.';
        riskLevel = 'Moderate';
      } else {
        curveType = 'Normal';
        economicSignal = 'Healthy economic expectations with normal risk premiums for longer maturities.';
        recommendation = 'Diversified maturity approach. Consider laddering strategy across the curve.';
        riskLevel = 'Low';
      }
    }

    return {
      curveType,
      slope,
      spread_2_10,
      spread_3m_10y,
      economicSignal,
      recommendation,
      riskLevel
    };
  }, []);

  const handleYieldChange = (index: number, newYield: number) => {
    const updatedYields = [...yields];
    updatedYields[index].yield = newYield;
    setYields(updatedYields);
  };

  const handleScenarioChange = (scenarioKey: string) => {
    setSelectedScenario(scenarioKey);
    setYields(scenarios[scenarioKey as keyof typeof scenarios]);
  };

  const handleAnalyze = () => {
    const curveAnalysis = analyzeYieldCurve(yields);
    setAnalysis(curveAnalysis);
  };

  const getCurveColor = (curveType: string) => {
    switch (curveType) {
      case 'Normal': return theme.status.success.text;
      case 'Inverted': return theme.status.error.text;
      case 'Flat': return theme.status.warning.text;
      case 'Humped': return theme.status.info.text;
      default: return theme.textColors.primary;
    }
  };

  const getCurveIcon = (curveType: string) => {
    switch (curveType) {
      case 'Normal': return ArrowUp;
      case 'Inverted': return ArrowDown;
      case 'Flat': return Minus;
      case 'Humped': return Activity;
      default: return TrendingUp;
    }
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
          <BarChart3 className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          Yield Curve Analyzer
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Analyze interest rate environments, yield curve shapes, and economic implications for bond investing
        </p>
      </motion.div>

      {/* Scenario Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} flex items-center`}>
              <Target className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              Yield Curve Scenarios
            </CardTitle>
            <CardDescription>Select a predefined scenario or customize your own yield curve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries({
                current: 'Current Market',
                inverted_2022: '2022 Inversion',
                steep_2020: '2020 Steep',
                flat_2015: '2015 Flat'
              }).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedScenario === key ? 'default' : 'outline'}
                  onClick={() => handleScenarioChange(key)}
                  className="text-sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yield Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <TrendingUp className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                Yield Curve Points
              </CardTitle>
              <CardDescription>Customize individual yield rates by maturity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {yields.map((point, index) => (
                  <div key={point.label} className="space-y-2">
                    <Label htmlFor={`yield-${point.label}`}>
                      {point.label} ({point.maturity < 1 ? `${point.maturity * 12}M` : `${point.maturity}Y`})
                    </Label>
                    <div>
                      <Input
                        id={`yield-${point.label}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={point.yield}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          handleYieldChange(index, value);
                          if (value < 0) {
                            e.target.setAttribute('aria-invalid', 'true');
                            e.target.setAttribute('aria-describedby', `yield-${point.label}-error`);
                          } else {
                            e.target.setAttribute('aria-invalid', 'false');
                            e.target.removeAttribute('aria-describedby');
                          }
                        }}
                        onBlur={(e) => {
                          const value = Number(e.target.value);
                          if (value < 0) {
                            e.target.setAttribute('aria-invalid', 'true');
                            e.target.setAttribute('aria-describedby', `yield-${point.label}-error`);
                          } else {
                            e.target.setAttribute('aria-invalid', 'false');
                            e.target.removeAttribute('aria-describedby');
                          }
                        }}
                        placeholder="4.5"
                      />
                      {point.yield < 0 && (
                        <div id={`yield-${point.label}-error`} role="alert" className="text-red-400 text-sm mt-1">
                          Invalid yield: must be positive
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleAnalyze}
                className={`w-full ${theme.buttons.primary}`}
                size="lg"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Yield Curve
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Yield Curve Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <Activity className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Yield Curve Visualization
              </CardTitle>
              <CardDescription>Visual representation of the current yield curve</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yields}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={['dataMin - 0.2', 'dataMax + 0.2']}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Yield']}
                      labelFormatter={(label) => `Maturity: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="yield"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="#3b82f6"
                      fillOpacity={0.1}
                    />
                    <Line
                      type="monotone"
                      dataKey="yield"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
                Yield Curve Analysis
              </CardTitle>
              <CardDescription>Economic interpretation and investment implications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Curve Classification */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`w-12 h-12 ${getCurveColor(analysis.curveType) === theme.status.success.text ? theme.status.success.bg : 
                    getCurveColor(analysis.curveType) === theme.status.error.text ? theme.status.error.bg :
                    getCurveColor(analysis.curveType) === theme.status.warning.text ? theme.status.warning.bg : theme.status.info.bg} 
                    rounded-full flex items-center justify-center mx-auto mb-3`}>
                    {React.createElement(getCurveIcon(analysis.curveType), { 
                      className: `w-6 h-6 ${getCurveColor(analysis.curveType)}` 
                    })}
                  </div>
                  <div className={`text-xl font-bold ${getCurveColor(analysis.curveType)}`}>
                    {analysis.curveType}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Curve Type</div>
                </div>

                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                    {analysis.spread_2_10.toFixed(2)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>2Y-10Y Spread</div>
                  <Badge 
                    variant="outline"
                    className={`mt-2 ${analysis.spread_2_10 < 0 ? theme.status.error.text : theme.status.success.text} border-current`}
                  >
                    {analysis.spread_2_10 < 0 ? 'Inverted' : 'Normal'}
                  </Badge>
                </div>

                <div className={`p-4 ${theme.backgrounds.card} rounded-lg border text-center`}>
                  <div className={`text-2xl font-bold ${
                    analysis.riskLevel === 'High' ? theme.status.error.text :
                    analysis.riskLevel === 'Moderate' ? theme.status.warning.text :
                    theme.status.success.text
                  }`}>
                    {analysis.riskLevel}
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Risk Level</div>
                </div>
              </div>

              <Separator />

              {/* Key Spreads */}
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Key Interest Rate Spreads</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 ${theme.backgrounds.card} rounded border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>3M-10Y Spread:</span>
                      <span className={`font-bold ${analysis.spread_3m_10y < 0 ? theme.status.error.text : theme.status.success.text}`}>
                        {analysis.spread_3m_10y > 0 ? '+' : ''}{analysis.spread_3m_10y.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${theme.backgrounds.card} rounded border`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme.textColors.secondary}`}>Curve Slope:</span>
                      <span className={`font-bold ${analysis.slope < 0 ? theme.status.error.text : theme.status.success.text}`}>
                        {analysis.slope > 0 ? '+' : ''}{(analysis.slope * 100).toFixed(2)} bps/year
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Economic Signal */}
              <div className={`p-4 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                  <Info className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
                  Economic Signal
                </h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  {analysis.economicSignal}
                </p>
              </div>

              {/* Investment Recommendation */}
              <div className={`p-4 ${analysis.riskLevel === 'High' ? theme.status.error.bg : 
                analysis.riskLevel === 'Moderate' ? theme.status.warning.bg : theme.status.success.bg}/10 
                border ${analysis.riskLevel === 'High' ? theme.status.error.border : 
                analysis.riskLevel === 'Moderate' ? theme.status.warning.border : theme.status.success.border} rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                  <Target className={`w-4 h-4 ${analysis.riskLevel === 'High' ? theme.status.error.text : 
                    analysis.riskLevel === 'Moderate' ? theme.status.warning.text : theme.status.success.text} mr-2`} />
                  Investment Strategy
                </h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  {analysis.recommendation}
                </p>
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
              Understanding Yield Curves
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Curve Shapes & Meanings:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• <span className="font-medium">Normal (Upward):</span> Healthy economy, longer bonds pay more</li>
                  <li>• <span className="font-medium">Inverted:</span> Recession signal, short rates exceed long rates</li>
                  <li>• <span className="font-medium">Flat:</span> Economic uncertainty, similar rates across maturities</li>
                  <li>• <span className="font-medium">Humped:</span> Mixed signals, intermediate rates highest</li>
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Investment Implications:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Monitor 2Y-10Y spread for recession signals</li>
                  <li>• Steepening curves favor longer duration bonds</li>
                  <li>• Flattening curves suggest shorter duration positioning</li>
                  <li>• Consider barbell strategies during uncertainty</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

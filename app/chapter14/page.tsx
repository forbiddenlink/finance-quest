'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Calculator, Award, BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import StockAnalysisCalculator from '@/components/shared/calculators/StockAnalysisCalculator';

type TabType = 'lesson' | 'calculator' | 'quiz';

export default function Chapter14() {
  const [currentSection, setCurrentSection] = useState<TabType>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { completeLesson } = useProgressStore();
  
  const handleLessonComplete = () => {
    completeLesson('chapter14-portfolio-theory', 35);
    setLessonCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">{" "}
      {/* Header */}
      <div className={`${theme.backgrounds.glass} border-b ${theme.borderColors.primary}`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className={`w-6 h-6 ${theme.textColors.primary}`} />
              </div>
              <div>
                <h1 className={`${theme.typography.heading2} ${theme.textColors.primary}`}>Chapter 14: Advanced Portfolio Theory</h1>
                <p className={theme.textColors.secondary}>Master diversification, risk management, and optimal allocation</p>
              </div>
            </div>
            <Badge variant="outline" className={`${theme.textColors.accent} ${theme.backgrounds.card} ${theme.borderColors.accent}`}>
              Investment Track
            </Badge>
          </div>
          
          <div className="mt-6">
            <div className={`flex justify-between text-sm ${theme.textColors.secondary} mb-2`}>
              <span>Chapter Progress</span>
              <span>80% Complete</span>
            </div>
            <Progress value={80} className="w-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as TabType)} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lesson" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Learn</span>
              {lessonCompleted && <CheckCircle className={`w-4 h-4 ${theme.status.success.text}`} />}
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Test Knowledge</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lesson" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className={`w-5 h-5 ${theme.status.info.text}`} />
                  <span>Modern Portfolio Theory</span>
                </CardTitle>
                <CardDescription>
                  Learn the science behind optimal portfolio construction and risk management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Core Principles */}
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Core Principles</h3>
                  <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} p-4 rounded-lg mb-4`}>
                    <p className={theme.textColors.secondary}>
                      Modern Portfolio Theory (MPT), developed by Harry Markowitz, revolutionized investing 
                      by showing how to maximize returns for a given level of risk through optimal diversification. 
                      The key insight: it&apos;s not just what you own, but how those investments work together.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                      <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                        <Target className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                        Risk vs Return
                      </h4>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        Higher returns typically come with higher risk. The goal is to find the optimal 
                        balance for your risk tolerance and time horizon.
                      </p>
                    </div>
                    <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                      <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                        <Zap className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                        Diversification Effect
                      </h4>
                      <p className="text-sm text-gray-600">
                        Combining uncorrelated assets can reduce overall portfolio risk without 
                        sacrificing expected returns - the only &ldquo;free lunch&rdquo; in investing.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Efficient Frontier */}
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>The Efficient Frontier</h3>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-2">Optimal Portfolio Combinations</h4>
                        <p className="text-indigo-800 text-sm mb-3">
                          The efficient frontier represents all portfolio combinations that offer the highest 
                          expected return for each level of risk. Portfolios below this line are sub-optimal.
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-indigo-700">Conservative: 20% stocks, 80% bonds</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-indigo-700">Moderate: 60% stocks, 40% bonds</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-indigo-700">Aggressive: 90% stocks, 10% bonds</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Asset Allocation Strategies */}
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Strategic Asset Allocation</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Conservative Portfolio</h4>
                      <div className="space-y-2 text-sm text-green-700">
                        <div className="flex justify-between">
                          <span>Bonds:</span>
                          <span className="font-medium">70%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stocks:</span>
                          <span className="font-medium">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Alternatives:</span>
                          <span className="font-medium">5%</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-green-300">
                          <p className="text-xs">Target: 5-7% annual return, low volatility</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Balanced Portfolio</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <div className="flex justify-between">
                          <span>Stocks:</span>
                          <span className="font-medium">60%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bonds:</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Alternatives:</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-300">
                          <p className="text-xs">Target: 7-9% annual return, moderate volatility</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Growth Portfolio</h4>
                      <div className="space-y-2 text-sm text-purple-700">
                        <div className="flex justify-between">
                          <span>Stocks:</span>
                          <span className="font-medium">80%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bonds:</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Alternatives:</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-purple-300">
                          <p className="text-xs">Target: 9-11% annual return, high volatility</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Risk Management */}
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Risk Management Techniques</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-medium text-sm">1</span>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.textColors.primary}`}>Correlation Analysis</h4>
                        <p className="text-gray-600 text-sm">
                          Combine assets that move independently. When stocks fall, bonds often rise, 
                          providing portfolio stability during market turbulence.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-medium text-sm">2</span>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.textColors.primary}`}>Geographic Diversification</h4>
                        <p className="text-gray-600 text-sm">
                          Spread investments across domestic and international markets. Include 
                          developed markets (Europe, Japan) and emerging markets for broader exposure.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-medium text-sm">3</span>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.textColors.primary}`}>Sector Diversification</h4>
                        <p className="text-gray-600 text-sm">
                          Don&apos;t put all your money in tech stocks. Spread across sectors: healthcare, 
                          finance, energy, consumer goods, and utilities for balanced exposure.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-medium text-sm">4</span>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme.textColors.primary}`}>Rebalancing Strategy</h4>
                        <p className="text-gray-600 text-sm">
                          Regularly adjust portfolio back to target allocation. This forces you to 
                          &ldquo;sell high and buy low&rdquo; automatically, improving long-term returns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Factor Investing */}
                <div>
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>Factor-Based Investing</h3>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Beyond Market Cap Weighting</h4>
                    <p className="text-yellow-700 text-sm">
                      Academic research has identified specific factors that historically provide 
                      excess returns over time. Smart beta and factor ETFs allow investors to 
                      target these premiums systematically.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className={`font-medium ${theme.textColors.primary}`}>Equity Factors</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className={`${theme.textColors.secondary}`}>Value</span>
                          <span className="text-blue-600 font-medium">Cheap stocks outperform</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className={`${theme.textColors.secondary}`}>Size</span>
                          <span className="text-blue-600 font-medium">Small-cap premium</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className={`${theme.textColors.secondary}`}>Quality</span>
                          <span className="text-blue-600 font-medium">Strong fundamentals</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className={`${theme.textColors.secondary}`}>Momentum</span>
                          <span className="text-blue-600 font-medium">Trending stocks continue</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className={`font-medium ${theme.textColors.primary}`}>Implementation</h5>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• <span className="font-medium">ETF Approach:</span> Use factor ETFs like VTV (value) or VBR (small-cap value)</p>
                        <p>• <span className="font-medium">Allocation:</span> 20-40% in factor strategies, rest in broad market</p>
                        <p>• <span className="font-medium">Patience Required:</span> Factors can underperform for years before outperforming</p>
                        <p>• <span className="font-medium">Diversify Factors:</span> Combine multiple factors to reduce specific factor risk</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    onClick={handleLessonComplete}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  <span>Stock Analysis Calculator</span>
                </CardTitle>
                <CardDescription>
                  Analyze individual stocks using fundamental and technical metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockAnalysisCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Test Your Portfolio Theory Knowledge</span>
                </CardTitle>
                <CardDescription>
                  Complete this quiz to advance your Investment Track mastery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>Quiz Coming Soon</h3>
                  <p className="text-gray-600">
                    Interactive assessment will be available in the next update.
                    Continue practicing with the Stock Analysis Calculator!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

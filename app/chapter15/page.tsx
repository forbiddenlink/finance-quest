'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Package, 
  Coins, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  Target,
  ShieldCheck,
  BarChart3,
  Info,
  Zap
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

// Enhanced Calculator Imports
import REITInvestmentAnalyzer from '@/components/shared/calculators/REITInvestmentAnalyzer';
import CommodityPortfolioBuilder from '@/components/shared/calculators/CommodityPortfolioBuilder';
import CryptocurrencyAllocationCalculator from '@/components/shared/calculators/CryptocurrencyAllocationCalculator';
import AlternativeInvestmentPortfolioOptimizer from '@/components/shared/calculators/AlternativeInvestmentPortfolioOptimizer';

type TabType = 'lesson' | 'reit-analyzer' | 'commodity-builder' | 'crypto-allocation' | 'portfolio-optimizer';

const calculatorTabs = [
  {
    id: 'reit-analyzer' as TabType,
    title: 'REIT Investment Analyzer',
    description: 'Analyze real estate investment trusts for income and diversification',
    icon: Building,
    component: REITInvestmentAnalyzer,
    color: 'blue'
  },
  {
    id: 'commodity-builder' as TabType,
    title: 'Commodity Portfolio Builder',
    description: 'Build diversified commodity exposure for inflation protection',
    icon: Package,
    component: CommodityPortfolioBuilder,
    color: 'amber'
  },
  {
    id: 'crypto-allocation' as TabType,
    title: 'Cryptocurrency Calculator',
    description: 'Optimize digital asset allocation with risk management',
    icon: Coins,
    component: CryptocurrencyAllocationCalculator,
    color: 'purple'
  },
  {
    id: 'portfolio-optimizer' as TabType,
    title: 'Portfolio Optimizer',
    description: 'Comprehensive alternative investment portfolio optimization',
    icon: PieChartIcon,
    component: AlternativeInvestmentPortfolioOptimizer,
    color: 'green'
  }
];

export default function Chapter15() {
  const [currentTab, setCurrentTab] = useState<TabType>('lesson');
  const [lessonProgress, setLessonProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const { completeLesson, isChapterUnlocked } = useProgressStore();

  useEffect(() => {
    const isUnlocked = isChapterUnlocked(15);
    if (!isUnlocked) {
      // Redirect or show unlock requirements
      console.log('Chapter 15 not yet unlocked');
    }
  }, [isChapterUnlocked]);

  const markSectionComplete = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionId);
    setCompletedSections(newCompleted);
    
    // Update progress based on completed sections
    const totalSections = 6; // Number of lesson sections
    const newProgress = (newCompleted.size / totalSections) * 100;
    setLessonProgress(newProgress);
    
    completeLesson(`chapter-15-${sectionId}`, 10); // 10 minutes per section
    
    if (newProgress === 100) {
      // Chapter lesson completed
      console.log('Chapter 15 lesson completed');
    }
  };

  const getTabColorScheme = (color: string) => {
    const schemes = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        button: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800'
      },
      amber: {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-300',
        button: 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
        button: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        button: 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
      }
    };
    return schemes[color as keyof typeof schemes] || schemes.blue;
  };

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className={`p-4 rounded-full ${theme.status.info.bg} mr-4`}>
              <TrendingUp className={`h-8 w-8 ${theme.status.info.text}`} />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${theme.textColors.primary}`}>
                Chapter 15: Alternative Investments
              </h1>
              <p className={`text-lg ${theme.textColors.secondary} mt-2`}>
                Master REITs, commodities, crypto, and diversified alternative strategies
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <Badge variant="outline" className="text-sm">
              Intermediate Level
            </Badge>
            <Badge variant="outline" className="text-sm">
              Portfolio Diversification
            </Badge>
            <Badge variant="outline" className="text-sm">
              4 Professional Tools
            </Badge>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                  Chapter Progress
                </span>
                <span className={`text-sm ${theme.textColors.secondary}`}>
                  {Math.round(lessonProgress)}% Complete
                </span>
              </div>
              <Progress value={lessonProgress} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardContent className="p-2">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {/* Lesson Tab */}
                <Button
                  variant={currentTab === 'lesson' ? 'default' : 'ghost'}
                  className={`h-auto p-4 flex flex-col items-center ${
                    currentTab === 'lesson' ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setCurrentTab('lesson')}
                >
                  <BookOpen className="h-5 w-5 mb-2" />
                  <span className="text-sm font-medium">Lesson</span>
                </Button>

                {/* Calculator Tabs */}
                {calculatorTabs.map((tab) => {
                  const colorScheme = getTabColorScheme(tab.color);
                  const IconComponent = tab.icon;
                  
                  return (
                    <Button
                      key={tab.id}
                      variant={currentTab === tab.id ? 'default' : 'ghost'}
                      className={`h-auto p-4 flex flex-col items-center ${
                        currentTab === tab.id 
                          ? `${colorScheme.bg} ${colorScheme.border} ${colorScheme.text}` 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setCurrentTab(tab.id)}
                    >
                      <IconComponent className="h-5 w-5 mb-2" />
                      <span className="text-xs font-medium text-center leading-tight">
                        {tab.title.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {currentTab === 'lesson' && (
            <div className="space-y-8">
              {/* Introduction */}
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <Target className={`w-6 h-6 ${theme.status.info.text} mr-3`} />
                    Alternative Investments: Beyond Stocks and Bonds
                  </CardTitle>
                  <CardDescription>
                    Learn how alternative investments can enhance portfolio diversification and risk-adjusted returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className={`p-4 ${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg`}>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>What You&apos;ll Master:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li className="flex items-center">
                          <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                          Real Estate Investment Trusts (REITs) analysis
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                          Commodity portfolio construction and inflation hedging
                        </li>
                      </ul>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li className="flex items-center">
                          <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                          Cryptocurrency allocation and risk management
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2`} />
                          Comprehensive alternative portfolio optimization
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    onClick={() => markSectionComplete('introduction')}
                    disabled={completedSections.has('introduction')}
                    className={`w-full ${theme.buttons.primary}`}
                  >
                    {completedSections.has('introduction') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Section Complete
                      </>
                    ) : (
                      'Mark Introduction Complete'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* REITs Deep Dive */}
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <Building className={`w-6 h-6 ${theme.status.success.text} mr-3`} />
                    Real Estate Investment Trusts (REITs)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>REIT Fundamentals:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Structure:</span> Companies that own/operate income-producing real estate</li>
                        <li>• <span className="font-medium">Distribution:</span> Must pay 90% of taxable income as dividends</li>
                        <li>• <span className="font-medium">Liquidity:</span> Trade on stock exchanges like regular stocks</li>
                        <li>• <span className="font-medium">Diversification:</span> Access to commercial real estate without direct ownership</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>REIT Categories:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Residential:</span> Apartments, single-family rentals</li>
                        <li>• <span className="font-medium">Commercial:</span> Office buildings, retail centers</li>
                        <li>• <span className="font-medium">Industrial:</span> Warehouses, distribution centers</li>
                        <li>• <span className="font-medium">Specialized:</span> Healthcare, data centers, self-storage</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg`}>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                      <Info className={`w-4 h-4 ${theme.status.warning.text} mr-2`} />
                      Key REIT Metrics
                    </h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                        <li>• <span className="font-medium">FFO (Funds From Operations):</span> Cash flow measure</li>
                        <li>• <span className="font-medium">NAV (Net Asset Value):</span> Underlying property values</li>
                      </ul>
                      <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                        <li>• <span className="font-medium">Occupancy Rates:</span> Property utilization efficiency</li>
                        <li>• <span className="font-medium">Debt-to-Equity:</span> Financial leverage assessment</li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    onClick={() => markSectionComplete('reits')}
                    disabled={completedSections.has('reits')}
                    className={`w-full ${theme.buttons.primary}`}
                  >
                    {completedSections.has('reits') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Section Complete
                      </>
                    ) : (
                      'Mark REITs Section Complete'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Commodities */}
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <Package className={`w-6 h-6 ${theme.status.warning.text} mr-3`} />
                    Commodity Investments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Commodity Categories:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Energy:</span> Oil, natural gas, gasoline</li>
                        <li>• <span className="font-medium">Metals:</span> Gold, silver, copper, platinum</li>
                        <li>• <span className="font-medium">Agriculture:</span> Wheat, corn, soybeans, coffee</li>
                        <li>• <span className="font-medium">Livestock:</span> Cattle, hogs, dairy</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Investment Benefits:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Inflation Protection:</span> Prices rise with inflation</li>
                        <li>• <span className="font-medium">Diversification:</span> Low correlation with stocks</li>
                        <li>• <span className="font-medium">Crisis Hedge:</span> Perform well during market stress</li>
                        <li>• <span className="font-medium">Supply/Demand:</span> Limited supply, growing demand</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 ${theme.status.error.bg}/10 border ${theme.status.error.border} rounded-lg`}>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                      <AlertTriangle className={`w-4 h-4 ${theme.status.error.text} mr-2`} />
                      Commodity Risks
                    </h5>
                    <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                      <li>• <span className="font-medium">Volatility:</span> Prices can fluctuate dramatically</li>
                      <li>• <span className="font-medium">No Income:</span> Most commodities don&apos;t generate cash flow</li>
                      <li>• <span className="font-medium">Storage Costs:</span> ETFs may have higher expense ratios</li>
                      <li>• <span className="font-medium">Contango Risk:</span> Futures-based ETFs may lose value over time</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={() => markSectionComplete('commodities')}
                    disabled={completedSections.has('commodities')}
                    className={`w-full ${theme.buttons.primary}`}
                  >
                    {completedSections.has('commodities') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Section Complete
                      </>
                    ) : (
                      'Mark Commodities Section Complete'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Cryptocurrency */}
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <Coins className={`w-6 h-6 ${theme.status.warning.text} mr-3`} />
                    Cryptocurrency as an Alternative Asset
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Crypto Categories:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Store of Value:</span> Bitcoin, digital gold</li>
                        <li>• <span className="font-medium">Smart Contracts:</span> Ethereum, programmable money</li>
                        <li>• <span className="font-medium">DeFi:</span> Decentralized finance protocols</li>
                        <li>• <span className="font-medium">Utility Tokens:</span> Platform-specific cryptocurrencies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Portfolio Allocation:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Conservative:</span> 1-5% of total portfolio</li>
                        <li>• <span className="font-medium">Moderate:</span> 5-15% maximum allocation</li>
                        <li>• <span className="font-medium">Aggressive:</span> 15-25% for risk-tolerant</li>
                        <li>• <span className="font-medium">Rule:</span> Never more than you can afford to lose</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 ${theme.status.error.bg}/10 border ${theme.status.error.border} rounded-lg`}>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center`}>
                      <ShieldCheck className={`w-4 h-4 ${theme.status.error.text} mr-2`} />
                      High-Risk Considerations
                    </h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                        <li>• <span className="font-medium">Extreme Volatility:</span> Can lose 50-90% of value</li>
                        <li>• <span className="font-medium">Regulatory Risk:</span> Government actions impact prices</li>
                      </ul>
                      <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                        <li>• <span className="font-medium">Technology Risk:</span> Smart contract bugs, hacks</li>
                        <li>• <span className="font-medium">Limited History:</span> No long-term performance data</li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    onClick={() => markSectionComplete('cryptocurrency')}
                    disabled={completedSections.has('cryptocurrency')}
                    className={`w-full ${theme.buttons.primary}`}
                  >
                    {completedSections.has('cryptocurrency') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Section Complete
                      </>
                    ) : (
                      'Mark Crypto Section Complete'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Portfolio Construction */}
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <BarChart3 className={`w-6 h-6 ${theme.status.success.text} mr-3`} />
                    Alternative Portfolio Construction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Allocation Framework:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Conservative:</span> 5-15% alternative allocation</li>
                        <li>• <span className="font-medium">Moderate:</span> 15-30% allocation range</li>
                        <li>• <span className="font-medium">Aggressive:</span> 30-50% for sophisticated investors</li>
                        <li>• <span className="font-medium">Factors:</span> Liquidity needs, costs, complexity</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Optimization Goals:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• <span className="font-medium">Diversification:</span> Low correlation benefits</li>
                        <li>• <span className="font-medium">Risk-Adjusted Returns:</span> Improve Sharpe ratio</li>
                        <li>• <span className="font-medium">Inflation Protection:</span> Real asset exposure</li>
                        <li>• <span className="font-medium">Return Enhancement:</span> Access to unique returns</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`p-4 ${theme.status.success.bg}/10 border ${theme.status.success.border} rounded-lg`}>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Sample Alternative Allocations:</h5>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`font-semibold ${theme.textColors.primary}`}>Conservative (10%)</div>
                        <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                          • REITs: 7%<br />
                          • Commodities: 2%<br />
                          • Crypto: 1%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${theme.textColors.primary}`}>Moderate (20%)</div>
                        <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                          • REITs: 10%<br />
                          • Commodities: 5%<br />
                          • Crypto: 3%<br />
                          • Other: 2%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${theme.textColors.primary}`}>Aggressive (35%)</div>
                        <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                          • REITs: 15%<br />
                          • Commodities: 8%<br />
                          • Crypto: 7%<br />
                          • Private/Other: 5%
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => markSectionComplete('portfolio-construction')}
                    disabled={completedSections.has('portfolio-construction')}
                    className={`w-full ${theme.buttons.primary}`}
                  >
                    {completedSections.has('portfolio-construction') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Section Complete
                      </>
                    ) : (
                      'Mark Portfolio Construction Complete'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Key Takeaways */}
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                    <Zap className={`w-6 h-6 ${theme.status.info.text} mr-3`} />
                    Chapter 15 Key Takeaways
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Essential Concepts:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• Alternative investments provide diversification beyond traditional assets</li>
                        <li>• REITs offer liquid real estate exposure with high dividend yields</li>
                        <li>• Commodities serve as inflation hedges with supply/demand dynamics</li>
                        <li>• Cryptocurrency adds digital asset exposure with high risk/reward potential</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Practical Applications:</h4>
                      <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                        <li>• Use our calculators to analyze and optimize alternative allocations</li>
                        <li>• Start with liquid, accessible alternatives like REIT and commodity ETFs</li>
                        <li>• Limit high-risk alternatives to amounts you can afford to lose</li>
                        <li>• Regular rebalancing maintains target allocations and risk management</li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    onClick={() => markSectionComplete('key-takeaways')}
                    disabled={completedSections.has('key-takeaways')}
                    className={`w-full ${theme.buttons.primary}`}
                  >
                    {completedSections.has('key-takeaways') ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Chapter Complete!
                      </>
                    ) : (
                      'Complete Chapter 15'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Calculator Components */}
          {calculatorTabs.map((tab) => {
            if (currentTab === tab.id) {
              const CalculatorComponent = tab.component;
              return (
                <Card key={tab.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                  <CardHeader>
                    <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                      <tab.icon className={`w-6 h-6 ${theme.status.info.text} mr-3`} />
                      {tab.title}
                    </CardTitle>
                    <CardDescription>{tab.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CalculatorComponent />
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </motion.div>
      </div>
    </div>
  );
}

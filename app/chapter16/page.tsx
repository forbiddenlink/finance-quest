'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  Target,
  ShieldCheck,
  BarChart3,
  Info,
  Zap,
  Users,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

// Enhanced Calculator Imports
import BusinessValuationCalculator from '@/components/shared/calculators/BusinessValuationCalculator';
import StartupFinanceCalculator from '@/components/shared/calculators/StartupFinanceCalculator';
import BusinessCashFlowAnalyzer from '@/components/shared/calculators/BusinessCashFlowAnalyzer';
import EntrepreneurshipROICalculator from '@/components/shared/calculators/EntrepreneurshipROICalculator';

type TabType = 'lesson' | 'business-valuation' | 'startup-finance' | 'cash-flow-analyzer' | 'roi-calculator';

const calculatorTabs = [
  {
    id: 'business-valuation' as TabType,
    title: 'Business Valuation Calculator',
    description: 'Determine business worth using DCF, multiple, and asset methods',
    icon: Building2,
    component: BusinessValuationCalculator,
    color: 'blue'
  },
  {
    id: 'startup-finance' as TabType,
    title: 'Startup Finance Calculator',
    description: 'Plan funding rounds, equity dilution, and investor returns',
    icon: TrendingUp,
    component: StartupFinanceCalculator,
    color: 'purple'
  },
  {
    id: 'cash-flow-analyzer' as TabType,
    title: 'Business Cash Flow Analyzer',
    description: 'Analyze operational cash flows and working capital needs',
    icon: DollarSign,
    component: BusinessCashFlowAnalyzer,
    color: 'green'
  },
  {
    id: 'roi-calculator' as TabType,
    title: 'Entrepreneurship ROI Calculator',
    description: 'Calculate returns on business investments and initiatives',
    icon: PieChartIcon,
    component: EntrepreneurshipROICalculator,
    color: 'amber'
  }
];

export default function Chapter16() {
  const [currentTab, setCurrentTab] = useState<TabType>('lesson');
  const [lessonProgress, setLessonProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const { completeLesson, isChapterUnlocked } = useProgressStore();

  useEffect(() => {
    const isUnlocked = isChapterUnlocked(16);
    if (!isUnlocked) {
      // Redirect or show unlock requirements
      console.log('Chapter 16 not yet unlocked');
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
    
    completeLesson(`chapter-16-${sectionId}`, 10); // 10 minutes per section
    
    if (newProgress === 100) {
      // Chapter lesson completed
      console.log('Chapter 16 lesson completed');
    }
  };

  const renderLessonContent = () => {
    return (
      <div className="space-y-8">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-4 py-2">
            Chapter 16: Business & Entrepreneurship Finance
          </Badge>
          <h1 className={`text-4xl font-bold ${theme.textColors.primary}`}>
            Building and Valuing Your Business Empire
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Master the financial fundamentals of starting, running, and growing successful businesses. 
            Learn valuation methods, funding strategies, and financial management for entrepreneurs.
          </p>
        </motion.div>

        {/* Progress Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              Learning Progress
            </h3>
            <Badge variant="outline" className={theme.textColors.secondary}>
              {Math.round(lessonProgress)}% Complete
            </Badge>
          </div>
          <Progress value={lessonProgress} className="w-full" />
          <p className={`text-sm ${theme.textColors.secondary} mt-2`}>
            Complete all sections to unlock the business finance calculators
          </p>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-blue-400" />
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
              What You&apos;ll Master
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Business valuation methods and techniques",
              "Startup funding and equity structures",
              "Cash flow management and forecasting",
              "ROI analysis for business decisions",
              "Financial planning for entrepreneurs",
              "Investment evaluation frameworks"
            ].map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className={theme.textColors.secondary}>{objective}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 1: Business Fundamentals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-400" />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                Business Finance Fundamentals
              </h3>
            </div>
            {completedSections.has('fundamentals') && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>
          
          <div className="space-y-4">
            <p className={theme.textColors.secondary}>
              Understanding the financial backbone of business operations is crucial for entrepreneurial success. 
              Business finance encompasses everything from initial funding to ongoing financial management and growth strategies.
            </p>
            
            <div className={`${theme.backgrounds.card} rounded-lg p-4 space-y-3`}>
              <h4 className={`font-semibold ${theme.textColors.primary}`}>Key Business Finance Components:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <strong className={theme.textColors.primary}>Working Capital:</strong>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Short-term assets minus short-term liabilities
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <strong className={theme.textColors.primary}>Cash Flow:</strong>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Money moving in and out of the business
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <strong className={theme.textColors.primary}>Financial Ratios:</strong>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Metrics to assess business health and performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <PieChartIcon className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <strong className={theme.textColors.primary}>Capital Structure:</strong>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Mix of debt and equity financing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-blue-50/10 border border-blue-500/20 rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    Why Business Finance Matters
                  </h5>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Proper financial management can mean the difference between business success and failure. 
                    Understanding these concepts helps entrepreneurs make informed decisions about funding, 
                    growth, and strategic direction.
                  </p>
                </div>
              </div>
            </div>

            {!completedSections.has('fundamentals') && (
              <Button
                onClick={() => markSectionComplete('fundamentals')}
                className={theme.buttons.primary}
              >
                Mark Section Complete
              </Button>
            )}
          </div>
        </motion.div>

        {/* Section 2: Business Valuation Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-purple-400" />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                Business Valuation Methods
              </h3>
            </div>
            {completedSections.has('valuation') && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>
          
          <div className="space-y-4">
            <p className={theme.textColors.secondary}>
              Determining the value of a business is both an art and a science. Different valuation methods 
              provide different perspectives on what a business is worth, depending on the context and purpose.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>DCF Method</h4>
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  <strong>Discounted Cash Flow:</strong> Values business based on projected future cash flows
                </p>
                <div className="text-xs space-y-1">
                  <div className={theme.textColors.secondary}>• Most accurate for mature businesses</div>
                  <div className={theme.textColors.secondary}>• Requires detailed financial projections</div>
                  <div className={theme.textColors.secondary}>• Sensitive to discount rate assumptions</div>
                </div>
              </div>

              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Multiple Method</h4>
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  <strong>Comparable Multiples:</strong> Uses ratios from similar businesses
                </p>
                <div className="text-xs space-y-1">
                  <div className={theme.textColors.secondary}>• Quick and market-based</div>
                  <div className={theme.textColors.secondary}>• P/E, EV/EBITDA ratios</div>
                  <div className={theme.textColors.secondary}>• Relies on comparable companies</div>
                </div>
              </div>

              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Asset Method</h4>
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  <strong>Asset-Based:</strong> Values business based on underlying assets
                </p>
                <div className="text-xs space-y-1">
                  <div className={theme.textColors.secondary}>• Book value or liquidation value</div>
                  <div className={theme.textColors.secondary}>• Good for asset-heavy businesses</div>
                  <div className={theme.textColors.secondary}>• May miss intangible value</div>
                </div>
              </div>
            </div>

            <div className={`bg-purple-50/10 border border-purple-500/20 rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    Pro Tip: Use Multiple Methods
                  </h5>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Professional valuators typically use 2-3 different methods and triangulate to arrive at 
                    a final valuation range. This provides a more robust and defensible valuation.
                  </p>
                </div>
              </div>
            </div>

            {!completedSections.has('valuation') && (
              <Button
                onClick={() => markSectionComplete('valuation')}
                className={theme.buttons.primary}
              >
                Mark Section Complete
              </Button>
            )}
          </div>
        </motion.div>

        {/* Section 3: Startup Funding & Equity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-400" />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                Startup Funding & Equity Structures
              </h3>
            </div>
            {completedSections.has('funding') && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>
          
          <div className="space-y-4">
            <p className={theme.textColors.secondary}>
              Understanding how to raise capital and structure equity is crucial for startup success. 
              Different funding stages require different strategies and have varying impacts on ownership.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Funding Stages</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Pre-Seed:</strong> $10K-$100K for initial development
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Seed:</strong> $100K-$2M for market validation
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Series A:</strong> $2M-$15M for scaling
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Series B+:</strong> $15M+ for expansion
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Equity Considerations</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Each funding round dilutes existing ownership
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Founder equity typically ranges 10-25% at exit
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Employee stock option pools: 10-20%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-green-50/10 border border-green-500/20 rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    Alternative Funding Sources
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className={theme.textColors.secondary}>• Revenue-based financing</div>
                    <div className={theme.textColors.secondary}>• Crowdfunding platforms</div>
                    <div className={theme.textColors.secondary}>• Government grants & programs</div>
                    <div className={theme.textColors.secondary}>• Strategic partnerships</div>
                  </div>
                </div>
              </div>
            </div>

            {!completedSections.has('funding') && (
              <Button
                onClick={() => markSectionComplete('funding')}
                className={theme.buttons.primary}
              >
                Mark Section Complete
              </Button>
            )}
          </div>
        </motion.div>

        {/* Section 4: Cash Flow Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-amber-400" />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                Business Cash Flow Management
              </h3>
            </div>
            {completedSections.has('cashflow') && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>
          
          <div className="space-y-4">
            <p className={theme.textColors.secondary}>
              Cash flow is the lifeblood of any business. Understanding how to manage, forecast, 
              and optimize cash flow is essential for business survival and growth.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Operating Cash Flow</h4>
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  Cash generated from core business operations
                </p>
                <div className="text-xs space-y-1">
                  <div className={theme.textColors.secondary}>• Revenue collections</div>
                  <div className={theme.textColors.secondary}>• Operating expense payments</div>
                  <div className={theme.textColors.secondary}>• Working capital changes</div>
                </div>
              </div>

              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Investing Cash Flow</h4>
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  Cash used for business investments
                </p>
                <div className="text-xs space-y-1">
                  <div className={theme.textColors.secondary}>• Equipment purchases</div>
                  <div className={theme.textColors.secondary}>• Technology investments</div>
                  <div className={theme.textColors.secondary}>• Acquisitions</div>
                </div>
              </div>

              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Financing Cash Flow</h4>
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  Cash from funding activities
                </p>
                <div className="text-xs space-y-1">
                  <div className={theme.textColors.secondary}>• Equity investments</div>
                  <div className={theme.textColors.secondary}>• Loan proceeds</div>
                  <div className={theme.textColors.secondary}>• Dividend payments</div>
                </div>
              </div>
            </div>

            <div className={`bg-amber-50/10 border border-amber-500/20 rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    Cash Flow Management Best Practices
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className={theme.textColors.secondary}>• Maintain 3-6 months of operating expenses</div>
                    <div className={theme.textColors.secondary}>• Create 13-week rolling forecasts</div>
                    <div className={theme.textColors.secondary}>• Optimize payment terms with suppliers</div>
                    <div className={theme.textColors.secondary}>• Implement efficient collection processes</div>
                  </div>
                </div>
              </div>
            </div>

            {!completedSections.has('cashflow') && (
              <Button
                onClick={() => markSectionComplete('cashflow')}
                className={theme.buttons.primary}
              >
                Mark Section Complete
              </Button>
            )}
          </div>
        </motion.div>

        {/* Section 5: ROI & Investment Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <PieChartIcon className="w-6 h-6 text-blue-400" />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                ROI & Business Investment Analysis
              </h3>
            </div>
            {completedSections.has('roi') && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>
          
          <div className="space-y-4">
            <p className={theme.textColors.secondary}>
              Every business decision involves trade-offs and opportunity costs. Learning to analyze 
              return on investment helps entrepreneurs make better strategic decisions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Key ROI Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textColors.secondary}`}>Simple ROI</span>
                    <span className={`text-xs ${theme.textColors.secondary} font-mono`}>
                      (Gain - Cost) / Cost
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textColors.secondary}`}>Annualized ROI</span>
                    <span className={`text-xs ${theme.textColors.secondary} font-mono`}>
                      ((End/Start)^(1/Years)) - 1
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textColors.secondary}`}>IRR</span>
                    <span className={`text-xs ${theme.textColors.secondary}`}>
                      Internal Rate of Return
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textColors.secondary}`}>Payback Period</span>
                    <span className={`text-xs ${theme.textColors.secondary}`}>
                      Time to recover investment
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Investment Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Marketing:</strong> Customer acquisition costs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Technology:</strong> Automation & efficiency
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Human Capital:</strong> Training & hiring
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      <strong>Infrastructure:</strong> Facilities & equipment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-blue-50/10 border border-blue-500/20 rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    ROI Decision Framework
                  </h5>
                  <div className="text-sm space-y-1">
                    <div className={theme.textColors.secondary}>
                      1. <strong>Define Success Metrics:</strong> What specific outcomes are you measuring?
                    </div>
                    <div className={theme.textColors.secondary}>
                      2. <strong>Calculate True Costs:</strong> Include time, opportunity costs, and risks
                    </div>
                    <div className={theme.textColors.secondary}>
                      3. <strong>Set Minimum Thresholds:</strong> What ROI makes this worthwhile?
                    </div>
                    <div className={theme.textColors.secondary}>
                      4. <strong>Monitor & Adjust:</strong> Track actual vs. projected returns
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!completedSections.has('roi') && (
              <Button
                onClick={() => markSectionComplete('roi')}
                className={theme.buttons.primary}
              >
                Mark Section Complete
              </Button>
            )}
          </div>
        </motion.div>

        {/* Section 6: Financial Planning for Entrepreneurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-purple-400" />
              <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                Financial Planning for Entrepreneurs
              </h3>
            </div>
            {completedSections.has('planning') && (
              <CheckCircle className="w-6 h-6 text-green-400" />
            )}
          </div>
          
          <div className="space-y-4">
            <p className={theme.textColors.secondary}>
              Entrepreneurship involves unique financial challenges and opportunities. Effective financial 
              planning balances business growth needs with personal financial security.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Business Financial Plan</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      3-year financial projections
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Monthly cash flow forecasts
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Scenario planning (best/worst case)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Key performance indicators
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Personal Financial Plan</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      6-12 month emergency fund
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Health & disability insurance
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Retirement planning (SEP-IRA/Solo 401k)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${theme.textColors.secondary}`}>
                      Tax optimization strategies
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`bg-purple-50/10 border border-purple-500/20 rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    Entrepreneur-Specific Considerations
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className={theme.textColors.secondary}>• Irregular income management</div>
                    <div className={theme.textColors.secondary}>• Self-employment tax planning</div>
                    <div className={theme.textColors.secondary}>• Business succession planning</div>
                    <div className={theme.textColors.secondary}>• Asset protection strategies</div>
                  </div>
                </div>
              </div>
            </div>

            {!completedSections.has('planning') && (
              <Button
                onClick={() => markSectionComplete('planning')}
                className={theme.buttons.primary}
              >
                Mark Section Complete
              </Button>
            )}
          </div>
        </motion.div>

        {/* Chapter Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
              Chapter Summary & Next Steps
            </h3>
          </div>
          
          <div className="space-y-4">
            <p className={theme.textColors.secondary}>
              You&apos;ve now covered the essential financial concepts for business and entrepreneurship success. 
              These fundamentals will serve as the foundation for making informed business decisions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Key Takeaways</h4>
                <div className="space-y-1 text-sm">
                  <div className={theme.textColors.secondary}>✓ Business valuation methods and applications</div>
                  <div className={theme.textColors.secondary}>✓ Startup funding stages and equity structures</div>
                  <div className={theme.textColors.secondary}>✓ Cash flow management best practices</div>
                  <div className={theme.textColors.secondary}>✓ ROI analysis for business decisions</div>
                  <div className={theme.textColors.secondary}>✓ Financial planning for entrepreneurs</div>
                </div>
              </div>
              
              <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Next Steps</h4>
                <div className="space-y-1 text-sm">
                  <div className={theme.textColors.secondary}>→ Practice with the business calculators</div>
                  <div className={theme.textColors.secondary}>→ Create your own business financial model</div>
                  <div className={theme.textColors.secondary}>→ Explore advanced chapters on estate planning</div>
                  <div className={theme.textColors.secondary}>→ Apply concepts to real business scenarios</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderCalculatorTab = (calculatorId: TabType) => {
    const calculator = calculatorTabs.find(tab => tab.id === calculatorId);
    if (!calculator) return null;

    const CalculatorComponent = calculator.component;
    return <CalculatorComponent />;
  };

  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-2 mb-8`}
        >
          <div className="flex flex-wrap gap-2">
            {/* Lesson Tab */}
            <button
              onClick={() => setCurrentTab('lesson')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentTab === 'lesson'
                  ? `${theme.buttons.primary} text-white shadow-lg`
                  : `${theme.textColors.secondary} hover:${theme.textColors.primary} hover:bg-white/5`
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Lesson
            </button>

            {/* Calculator Tabs */}
            {calculatorTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                disabled={lessonProgress < 100}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentTab === tab.id
                    ? `${theme.buttons.primary} text-white shadow-lg`
                    : lessonProgress < 100
                    ? `${theme.textColors.secondary} opacity-50 cursor-not-allowed`
                    : `${theme.textColors.secondary} hover:${theme.textColors.primary} hover:bg-white/5`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTab === 'lesson' ? renderLessonContent() : renderCalculatorTab(currentTab)}
        </motion.div>
      </div>
    </div>
  );
}

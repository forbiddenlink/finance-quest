'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Building2, DollarSign, TrendingUp, Target, AlertTriangle, Zap, Users } from 'lucide-react';
import { theme } from '@/lib/theme';

interface BusinessFinanceLessonProps {
  onComplete?: () => void;
}

const BusinessFinanceLesson: React.FC<BusinessFinanceLessonProps> = ({ onComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    'Business Finance Fundamentals',
    'Business Valuation Methods',
    'Startup Funding & Capital Raising',
    'Cash Flow Management',
    'Financial Planning & Projections',
    'Exit Strategies & Value Creation'
  ];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onComplete?.();
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Business Finance Fundamentals
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Master the essential financial concepts for starting, running, and growing successful businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Key Financial Statements
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Income Statement:</strong> Revenue, expenses, profit</li>
                    <li>• <strong>Balance Sheet:</strong> Assets, liabilities, equity</li>
                    <li>• <strong>Cash Flow Statement:</strong> Operating, investing, financing</li>
                    <li>• <strong>Break-even Analysis:</strong> Fixed vs. variable costs</li>
                    <li>• <strong>Financial Ratios:</strong> Profitability, liquidity, leverage</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Target className="w-5 h-5 text-purple-400" />
                    Business Models
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Subscription:</strong> Recurring revenue streams</li>
                    <li>• <strong>E-commerce:</strong> Product sales and margins</li>
                    <li>• <strong>Service-based:</strong> Time and expertise monetization</li>
                    <li>• <strong>Platform:</strong> Network effects and commissions</li>
                    <li>• <strong>Freemium:</strong> Free users to paid conversions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-blue-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Financial Literacy for Entrepreneurs</h4>
                    <p className={theme.textColors.secondary}>
                      Understanding financial statements and business metrics is crucial for making informed decisions, 
                      attracting investors, and ensuring long-term business success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Business Valuation Methods
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Learn how to determine the value of businesses using professional valuation techniques.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    DCF Method
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• Discounted Cash Flow analysis</li>
                    <li>• Future cash flow projections</li>
                    <li>• Discount rate calculation</li>
                    <li>• Terminal value estimation</li>
                    <li>• Most accurate for mature businesses</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    Market Multiples
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• Price-to-earnings ratios</li>
                    <li>• Revenue multiples</li>
                    <li>• EBITDA multiples</li>
                    <li>• Industry comparables</li>
                    <li>• Quick market-based valuation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    Asset-Based
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• Book value of assets</li>
                    <li>• Liquidation value</li>
                    <li>• Replacement cost</li>
                    <li>• Tangible asset focus</li>
                    <li>• Conservative approach</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-green-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Valuation Best Practices</h4>
                    <p className={theme.textColors.secondary}>
                      Use multiple valuation methods to triangulate value. DCF is most accurate but requires reliable 
                      projections. Market multiples provide quick benchmarks. Asset-based methods work well for 
                      asset-heavy businesses.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Startup Funding & Capital Raising
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Navigate the funding landscape from bootstrapping to IPO with strategic capital raising approaches.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Funding Stages
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Pre-seed:</strong> Concept validation, $50K-$250K</li>
                    <li>• <strong>Seed:</strong> Product development, $250K-$2M</li>
                    <li>• <strong>Series A:</strong> Market fit, $2M-$15M</li>
                    <li>• <strong>Series B+:</strong> Scaling, $15M+</li>
                    <li>• <strong>IPO/Exit:</strong> Liquidity events</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Funding Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Bootstrapping:</strong> Personal funds, revenue</li>
                    <li>• <strong>Friends & Family:</strong> Initial supporters</li>
                    <li>• <strong>Angel Investors:</strong> Individual high-net-worth</li>
                    <li>• <strong>Venture Capital:</strong> Professional investors</li>
                    <li>• <strong>Crowdfunding:</strong> Public fundraising</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-purple-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Dilution & Equity Management</h4>
                    <p className={theme.textColors.secondary}>
                      Each funding round dilutes founder ownership. Plan your equity structure carefully, 
                      reserve shares for employee stock options, and understand how valuation impacts dilution.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      // Additional sections would continue here...
      default:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-4`}>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Business Finance Mastery
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                You&apos;ve mastered the financial fundamentals for building and scaling successful businesses.
              </p>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-green-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Key Takeaways</h4>
                    <ul className={`${theme.textColors.secondary} space-y-1`}>
                      <li>• Financial statements are the foundation of business analysis</li>
                      <li>• Multiple valuation methods provide comprehensive business worth assessment</li>
                      <li>• Funding strategy should align with business stage and growth goals</li>
                      <li>• Cash flow management is critical for business survival and growth</li>
                      <li>• Plan exit strategies early to maximize value creation</li>
                      <li>• Use our calculators to model business scenarios and make informed decisions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>
            {sections[currentSection]}
          </h1>
          <span className={`text-sm ${theme.textColors.secondary}`}>
            {currentSection + 1} of {sections.length}
          </span>
        </div>
        <Progress value={(currentSection / (sections.length - 1)) * 100} className="mb-2" />
        <p className={`text-sm ${theme.textColors.secondary}`}>
          {Math.round((currentSection / (sections.length - 1)) * 100)}% Complete
        </p>
      </div>

      {/* Section Content */}
      {renderSection()}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
        <Button
          variant="outline"
          onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
          className={`${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.backgrounds.cardHover}`}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          className={currentSection === sections.length - 1 ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {currentSection === sections.length - 1 ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Lesson
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
};

export default BusinessFinanceLesson;

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Building, Package, PieChart, TrendingUp, Target, AlertTriangle, Zap } from 'lucide-react';
import { theme } from '@/lib/theme';

interface AlternativeInvestmentsLessonProps {
  onComplete?: () => void;
}

const AlternativeInvestmentsLesson: React.FC<AlternativeInvestmentsLessonProps> = ({ onComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    'Introduction to Alternative Investments',
    'Real Estate Investment Trusts (REITs)',
    'Commodities & Natural Resources',
    'Cryptocurrency & Digital Assets',
    'Portfolio Integration Strategies',
    'Risk Management & Best Practices'
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
                <PieChart className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Introduction to Alternative Investments
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Discover investments beyond traditional stocks and bonds that can enhance portfolio diversification and risk-adjusted returns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Target className="w-5 h-5 text-blue-400" />
                    What Are Alternative Investments?
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• Assets outside traditional stocks, bonds, and cash</li>
                    <li>• Often have low correlation with traditional markets</li>
                    <li>• Can provide inflation protection and diversification</li>
                    <li>• Include REITs, commodities, crypto, private equity</li>
                    <li>• Typically 5-25% of total portfolio allocation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Benefits & Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Diversification:</strong> Reduce overall portfolio risk</li>
                    <li>• <strong>Inflation hedge:</strong> Protection against rising prices</li>
                    <li>• <strong>Unique returns:</strong> Access to different return drivers</li>
                    <li>• <strong>Higher complexity:</strong> Requires more research</li>
                    <li>• <strong>Liquidity risk:</strong> Some alternatives are illiquid</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-blue-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Portfolio Context</h4>
                    <p className={theme.textColors.secondary}>
                      Alternative investments work best as complements to, not replacements for, traditional assets. 
                      They should enhance your core stock and bond portfolio, not dominate it.
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
                <Building className="w-8 h-8 text-green-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Real Estate Investment Trusts (REITs)
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Access real estate markets through publicly traded companies that own and operate income-producing properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    REIT Types
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Equity REITs:</strong> Own properties</li>
                    <li>• <strong>Mortgage REITs:</strong> Finance real estate</li>
                    <li>• <strong>Retail:</strong> Shopping centers, malls</li>
                    <li>• <strong>Residential:</strong> Apartments, homes</li>
                    <li>• <strong>Industrial:</strong> Warehouses, logistics</li>
                    <li>• <strong>Healthcare:</strong> Hospitals, senior care</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    REIT Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• High dividend yields (4-8% typical)</li>
                    <li>• Inflation protection through rent increases</li>
                    <li>• Liquidity (trade like stocks)</li>
                    <li>• Professional management</li>
                    <li>• Diversification across properties</li>
                    <li>• Low correlation with stocks/bonds</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    Risks & Considerations
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2 text-sm">
                    <li>• Interest rate sensitivity</li>
                    <li>• Economic cycle dependence</li>
                    <li>• Sector-specific risks</li>
                    <li>• Tax implications (ordinary income)</li>
                    <li>• Management quality matters</li>
                    <li>• Market volatility</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-green-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Building className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">REIT Allocation Strategy</h4>
                    <p className={theme.textColors.secondary}>
                      Most portfolios benefit from 5-15% REIT allocation. Consider broad-based REIT ETFs for 
                      diversification or sector-specific REITs if you have strong conviction about particular 
                      real estate markets.
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
                <Package className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
                Commodities & Natural Resources
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                Invest in physical goods and natural resources that serve as inflation hedges and portfolio diversifiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <Package className="w-5 h-5 text-yellow-400" />
                    Commodity Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>Precious Metals:</strong> Gold, silver, platinum</li>
                    <li>• <strong>Energy:</strong> Oil, natural gas, coal</li>
                    <li>• <strong>Industrial Metals:</strong> Copper, aluminum, steel</li>
                    <li>• <strong>Agriculture:</strong> Corn, wheat, soybeans, cattle</li>
                    <li>• <strong>Soft Commodities:</strong> Coffee, sugar, cotton</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Investment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className={theme.textColors.secondary}>
                  <ul className="space-y-2">
                    <li>• <strong>ETFs/ETNs:</strong> Easy, liquid exposure</li>
                    <li>• <strong>Futures:</strong> Direct commodity contracts</li>
                    <li>• <strong>Mining/Energy Stocks:</strong> Company exposure</li>
                    <li>• <strong>Physical:</strong> Actual commodity ownership</li>
                    <li>• <strong>Mutual Funds:</strong> Managed commodity strategies</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-yellow-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-yellow-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-300 mb-2">Inflation Protection</h4>
                    <p className={theme.textColors.secondary}>
                      Commodities often rise during inflationary periods when traditional assets struggle. 
                      Gold has historically been viewed as a store of value, while energy and agricultural 
                      commodities tend to rise with general price levels.
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
                Alternative Investment Mastery
              </h2>
              <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
                You&apos;ve learned the fundamentals of alternative investments and how to integrate them into your portfolio.
              </p>
            </div>

            <Card className={`${theme.backgrounds.glass} border border-green-200/20`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Key Takeaways</h4>
                    <ul className={`${theme.textColors.secondary} space-y-1`}>
                      <li>• Alternative investments enhance diversification beyond stocks and bonds</li>
                      <li>• REITs provide real estate exposure with stock-like liquidity</li>
                      <li>• Commodities offer inflation protection and crisis hedging</li>
                      <li>• Cryptocurrencies represent emerging digital asset opportunities</li>
                      <li>• Limit alternatives to 5-25% of total portfolio</li>
                      <li>• Start with liquid, accessible alternatives before exotic investments</li>
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
          className="border-white/20 text-white hover:bg-white/10"
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

export default AlternativeInvestmentsLesson;

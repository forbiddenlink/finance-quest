'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Info, CheckCircle, Zap, Briefcase } from 'lucide-react';
import { theme } from '@/lib/theme';
import { ROIResults, InvestmentCategory, ROIStatus } from '../types';
import { formatCurrency, formatPercentage, formatMonths } from '../utils';

interface ResultsSectionProps {
  results: ROIResults;
  investmentCategories: InvestmentCategory[];
  roiStatus: ROIStatus;
  investmentAdvice: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  investmentCategories,
  roiStatus,
  investmentAdvice
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* ROI Summary */}
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" />
            ROI Analysis & Financial Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                  Return Metrics
                </h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Simple ROI:</span>
                  <span className={`font-semibold ${results.simpleROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(results.simpleROI)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Annualized ROI:</span>
                  <span className={`font-semibold ${results.annualizedROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(results.annualizedROI)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Risk-Adjusted ROI:</span>
                  <span className={`font-semibold ${results.riskAdjustedReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(results.riskAdjustedReturn)}
                  </span>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${theme.textColors.primary}`}>Total Return:</span>
                    <span className={`text-xl font-bold text-blue-400`}>
                      {formatCurrency(results.totalReturn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                  Investment Analysis
                </h3>
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Net Present Value:</span>
                  <span className={`font-semibold ${results.netPresentValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(results.netPresentValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Payback Period:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {formatMonths(results.paybackPeriod * 12)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Profitability Index:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {results.profitabilityIndex.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme.textColors.secondary}>Break-even Point:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    {formatMonths(results.breakEvenPoint)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Categories Breakdown */}
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" />
            Investment Categories Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentCategories.map((category, index) => (
              <div key={index} className={`${theme.backgrounds.card} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`text-${category.color}-400`}>
                      {category.icon}
                    </div>
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>
                      {category.name}
                    </h4>
                  </div>
                  <Badge className={
                    category.roi >= 30 ? 'bg-green-500/20 text-green-400' :
                    category.roi >= 15 ? 'bg-blue-500/20 text-blue-400' :
                    category.roi >= 0 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }>
                    {formatPercentage(category.roi)}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Investment:</span>
                    <span className={theme.textColors.primary}>
                      {formatCurrency(category.investment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Returns:</span>
                    <span className={theme.textColors.primary}>
                      {formatCurrency(category.returns)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Payback:</span>
                    <span className={theme.textColors.primary}>
                      {formatMonths(category.payback)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Recommendations */}
      <Card className={theme.utils.glass()}>
        <CardHeader>
          <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
            <Info className="w-5 h-5" />
            Analysis & Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <div className="flex items-center gap-2">
              {roiStatus.icon}
              <AlertDescription className={roiStatus.color}>
                <strong>ROI Assessment:</strong> {roiStatus.message}
              </AlertDescription>
            </div>
          </Alert>

          <Alert className="mb-4">
            <Info className="w-4 h-4" />
            <AlertDescription className={theme.textColors.secondary}>
              <strong>Investment Priority:</strong> {investmentAdvice}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className={`font-semibold ${theme.textColors.primary}`}>Key Performance Insights</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className={theme.textColors.secondary}>
                  • Payback period: {formatMonths(results.paybackPeriod * 12)}
                </div>
                <div className={theme.textColors.secondary}>
                  • Net present value: {formatCurrency(results.netPresentValue)}
                </div>
                <div className={theme.textColors.secondary}>
                  • Risk-adjusted return: {formatPercentage(results.riskAdjustedReturn)}
                </div>
                <div className={theme.textColors.secondary}>
                  • Profitability index: {results.profitabilityIndex.toFixed(2)}
                </div>
              </div>
            </div>

            <div className={`${theme.backgrounds.card} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <h4 className={`font-semibold ${theme.textColors.primary}`}>Strategic Action Items</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className={theme.textColors.secondary}>
                  • Focus on highest ROI investment categories
                </div>
                <div className={theme.textColors.secondary}>
                  • Monitor break-even timeline closely
                </div>
                <div className={theme.textColors.secondary}>
                  • Reassess risk factors quarterly
                </div>
                <div className={theme.textColors.secondary}>
                  • Track actual vs. projected returns
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-amber-50/10 border border-amber-500/20 rounded-lg p-4 mt-4`}>
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                  ROI Optimization Framework
                </h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Diversify investments across categories to balance risk and return. Prioritize 
                  investments with shorter payback periods and higher profitability indices. 
                  Regularly review and adjust strategies based on actual performance data and 
                  market conditions. Consider implementing phased rollouts to minimize risk exposure.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


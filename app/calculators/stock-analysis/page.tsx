'use client';

import StockAnalysisCalculator from '@/components/shared/calculators/StockAnalysisCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { theme } from '@/lib/theme';

export default function StockAnalysisCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className={`${theme.backgrounds.glass} border-b ${theme.borderColors.primary}`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/calculators">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Calculators
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>Stock Analysis Calculator</h1>
                <p className="text-gray-600">Analyze stocks using fundamental valuation metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>How to Use This Calculator</span>
            </CardTitle>
            <CardDescription>
              Master stock analysis with these fundamental steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">1</div>
                <h4 className="font-medium text-indigo-800 mb-1">Enter Financials</h4>
                <p className="text-indigo-700 text-sm">Input the company&apos;s key financial metrics and ratios</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">2</div>
                <h4 className="font-medium text-purple-800 mb-1">Review Valuation</h4>
                <p className="text-purple-700 text-sm">Compare intrinsic value vs current market price</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">3</div>
                <h4 className="font-medium text-pink-800 mb-1">Assess Risk</h4>
                <p className="text-pink-700 text-sm">Understand the risk profile and investment grade</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">4</div>
                <h4 className="font-medium text-blue-800 mb-1">Make Decision</h4>
                <p className="text-blue-700 text-sm">Use analysis to inform your investment choice</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculator */}
        <StockAnalysisCalculator />

        {/* Educational Content */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Stock Analysis Fundamentals</CardTitle>
            <CardDescription>Essential metrics for evaluating stock investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Key Valuation Ratios</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">P/E Ratio:</span>
                    <span className="font-medium">Price ÷ Earnings per Share</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PEG Ratio:</span>
                    <span className="font-medium">P/E ÷ Growth Rate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">P/B Ratio:</span>
                    <span className="font-medium">Price ÷ Book Value</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Debt/Equity:</span>
                    <span className="font-medium">Total Debt ÷ Total Equity</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dividend Yield:</span>
                    <span className="font-medium">Annual Dividends ÷ Price</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Analysis Guidelines</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Value Investing</h5>
                    <p className="text-gray-600">Look for low P/E, P/B ratios and strong fundamentals</p>
                  </div>
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Growth Investing</h5>
                    <p className="text-gray-600">Focus on high growth rates and reasonable PEG ratios</p>
                  </div>
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Quality Assessment</h5>
                    <p className="text-gray-600">Examine debt levels, profitability, and management</p>
                  </div>
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Risk Management</h5>
                    <p className="text-gray-600">Diversify across sectors and company sizes</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

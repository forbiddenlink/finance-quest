'use client';

import BondCalculator from '@/components/shared/calculators/BondCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { theme } from '@/lib/theme';

export default function BondCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>Bond Calculator</h1>
                                    <p className="text-gray-600">We&apos;re building a complete suite of financial calculators to help you master every aspect of money management</p>
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
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>How to Use This Calculator</span>
            </CardTitle>
            <CardDescription>
              Master bond analysis with these key steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">1</div>
                <h4 className="font-medium text-blue-800 mb-1">Enter Bond Details</h4>
                <p className="text-blue-700 text-sm">Input face value, coupon rate, maturity, and current price</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">2</div>
                <h4 className="font-medium text-green-800 mb-1">Review Yields</h4>
                <p className="text-green-700 text-sm">Compare current yield vs yield-to-maturity</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">3</div>
                <h4 className="font-medium text-purple-800 mb-1">Analyze Sensitivity</h4>
                <p className="text-purple-700 text-sm">See how price changes with interest rate movements</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">4</div>
                <h4 className="font-medium text-orange-800 mb-1">Make Decision</h4>
                <p className="text-orange-700 text-sm">Use insights to evaluate the investment opportunity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculator */}
        <BondCalculator />

        {/* Educational Content */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Bond Investment Fundamentals</CardTitle>
            <CardDescription>Essential concepts for successful fixed-income investing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Key Bond Terms</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Face Value:</span>
                    <span className="font-medium">Amount paid at maturity</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Rate:</span>
                    <span className="font-medium">Annual interest percentage</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Yield:</span>
                    <span className="font-medium">Annual income ÷ Current price</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">YTM:</span>
                    <span className="font-medium">Total return if held to maturity</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">Price sensitivity to rate changes</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Investment Strategies</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Bond Laddering</h5>
                    <p className="text-gray-600">Spread investments across different maturities</p>
                  </div>
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Duration Matching</h5>
                    <p className="text-gray-600">Match bond duration to investment timeline</p>
                  </div>
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Credit Analysis</h5>
                    <p className="text-gray-600">Evaluate issuer&apos;s ability to repay debt</p>
                  </div>
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary}`}>Rate Environment</h5>
                    <p className="text-gray-600">Consider current and expected interest rate trends</p>
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

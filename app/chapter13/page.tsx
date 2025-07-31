'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Calculator, Award, TrendingUp, Shield, Target } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import BondCalculator from '@/components/shared/calculators/BondCalculator';

type TabType = 'lesson' | 'calculator' | 'quiz';

export default function Chapter13() {
  const [currentSection, setCurrentSection] = useState<TabType>('lesson');
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { completeLesson } = useProgressStore();
  
  const handleLessonComplete = () => {
    completeLesson('chapter13-bonds', 30); // 30 minutes estimated reading time
    setLessonCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chapter 13: Bond & Fixed Income</h1>
                <p className="text-gray-600">Master conservative investing and income generation</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Investment Track
            </Badge>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Chapter Progress</span>
              <span>75% Complete</span>
            </div>
            <Progress value={75} className="w-full" />
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
              {lessonCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
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
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Understanding Bonds and Fixed Income</span>
                </CardTitle>
                <CardDescription>
                  Learn how bonds provide stability and income to your investment portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* What Are Bonds? */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What Are Bonds?</h3>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700">
                      Bonds are essentially IOUs - when you buy a bond, you&apos;re lending money to a government, 
                      municipality, or corporation. In return, they promise to pay you back the principal 
                      (face value) plus regular interest payments.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Government Bonds</h4>
                      <p className="text-sm text-gray-600">
                        Safest option. U.S. Treasury bonds are backed by the full faith and credit of the government.
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Corporate Bonds</h4>
                      <p className="text-sm text-gray-600">
                        Higher yields but more risk. Quality depends on the financial health of the issuing company.
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Municipal Bonds</h4>
                      <p className="text-sm text-gray-600">
                        Issued by local governments. Often tax-free, making them attractive for high earners.
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">TIPS</h4>
                      <p className="text-sm text-gray-600">
                        Treasury Inflation-Protected Securities adjust with inflation to preserve purchasing power.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bond Fundamentals */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Bond Concepts</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Face Value (Par)</h4>
                        <p className="text-gray-600 text-sm">
                          The amount you&apos;ll receive when the bond matures. Most bonds have a $1,000 face value.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Coupon Rate</h4>
                        <p className="text-gray-600 text-sm">
                          The annual interest rate paid on the bond&apos;s face value. A 5% coupon on a $1,000 bond pays $50/year.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Yield to Maturity (YTM)</h4>
                        <p className="text-gray-600 text-sm">
                          Total return if held to maturity, considering current price, coupon payments, and face value.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Duration</h4>
                        <p className="text-gray-600 text-sm">
                          Measures sensitivity to interest rate changes. Higher duration = greater price volatility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Interest Rate Risk */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Understanding Interest Rate Risk</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Inverse Relationship</h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          When interest rates rise, bond prices fall. When rates fall, bond prices rise. 
                          This is because newer bonds will offer higher/lower rates, making existing bonds 
                          less/more attractive.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800">Rising Rates Scenario</h4>
                      <p className="text-red-700 text-sm mt-1">
                        Your 3% bond becomes less valuable when new bonds offer 5%. 
                        You&apos;d need to sell at a discount to attract buyers.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800">Falling Rates Scenario</h4>
                      <p className="text-green-700 text-sm mt-1">
                        Your 5% bond becomes more valuable when new bonds only offer 3%. 
                        You could sell at a premium.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Portfolio Role */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bonds in Your Portfolio</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-blue-800">Stability</h4>
                      <p className="text-blue-700 text-sm">
                        Provide steady income and reduce portfolio volatility
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-green-800">Diversification</h4>
                      <p className="text-green-700 text-sm">
                        Often move opposite to stocks, providing balance
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-purple-800">Income</h4>
                      <p className="text-purple-700 text-sm">
                        Regular interest payments for retirees or income-focused investors
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Rule of Thumb: Age in Bonds</h4>
                    <p className="text-gray-700 text-sm">
                      A common guideline suggests holding your age as a percentage in bonds. 
                      At 30, hold 30% bonds; at 60, hold 60% bonds. This becomes more conservative as you age, 
                      but modern portfolio theory suggests this may be too conservative for young investors.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    onClick={handleLessonComplete}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  <span>Bond Analysis Calculator</span>
                </CardTitle>
                <CardDescription>
                  Calculate bond yields, prices, and analyze investment scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BondCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Test Your Bond Knowledge</span>
                </CardTitle>
                <CardDescription>
                  Complete this quiz to unlock Chapter 14: Advanced Portfolio Theory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Coming Soon</h3>
                  <p className="text-gray-600">
                    Interactive assessment will be available in the next update.
                    Continue practicing with the Bond Calculator!
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

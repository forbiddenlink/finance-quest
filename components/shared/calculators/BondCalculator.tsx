'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { theme } from '@/lib/theme';
import { Calculator, TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProgressStore } from '@/lib/store/progressStore';

interface ValuationResults {
  currentYield: number;
  yieldToMaturity: number;
  totalReturn: number;
  annualIncome: number;
  purchaseYield: number;
  interestRateSensitivity: number;
}

export default function BondCalculator() {
  const [faceValue, setFaceValue] = useState('1000');
  const [couponRate, setCouponRate] = useState('5.0');
  const [yearsToMaturity, setYearsToMaturity] = useState('10');
  const [currentPrice, setCurrentPrice] = useState('950');
  const [paymentFrequency, setPaymentFrequency] = useState('2'); // Semi-annual
  const [results, setResults] = useState<ValuationResults | null>(null);
  const [rateScenarios, setRateScenarios] = useState<Array<{
    rateChange: string;
    newPrice: string;
    priceChange: string;
    rate: string;
  }>>([]);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('bond-calculator');
  }, [recordCalculatorUsage]);

  const calculateBondMetrics = () => {
    const face = parseFloat(faceValue) || 1000;
    const rate = parseFloat(couponRate) || 5.0;
    const years = parseFloat(yearsToMaturity) || 10;
    const price = parseFloat(currentPrice) || 950;
    const frequency = parseInt(paymentFrequency) || 2;

    // Annual coupon payment
    const annualCoupon = (rate / 100) * face;

    // Current Yield = Annual Coupon / Current Price
    const currentYield = (annualCoupon / price) * 100;

    // Approximate Yield to Maturity using simplified formula
    const ytm = ((annualCoupon + (face - price) / years) / ((face + price) / 2)) * 100;

    // Total return if held to maturity
    const totalCoupons = annualCoupon * years;
    const capitalGain = face - price;
    const totalReturn = totalCoupons + capitalGain;

    // Purchase yield (YTM when bought)
    const purchaseYield = ytm;

    // Interest rate sensitivity (modified duration approximation)
    const interestRateSensitivity = years / (1 + (ytm / 100));

    setResults({
      currentYield,
      yieldToMaturity: ytm,
      totalReturn,
      annualIncome: annualCoupon,
      purchaseYield,
      interestRateSensitivity
    });

    // Generate interest rate scenarios
    const scenarios = [];
    for (let rateChange = -3; rateChange <= 3; rateChange += 0.5) {
      const newRate = (ytm / 100) + (rateChange / 100);
      const newPrice = calculateBondPrice(face, rate / 100, years, newRate, frequency);
      const priceChange = ((newPrice - price) / price) * 100;
      
      scenarios.push({
        rateChange: rateChange.toFixed(1),
        newPrice: newPrice.toFixed(2),
        priceChange: priceChange.toFixed(2),
        rate: (newRate * 100).toFixed(2)
      });
    }
    setRateScenarios(scenarios);
  };

  // Calculate bond price given yield
  const calculateBondPrice = (face: number, couponRate: number, years: number, bondYield: number, frequency: number) => {
    const couponPayment = (couponRate * face) / frequency;
    const totalPayments = years * frequency;
    const periodYield = bondYield / frequency;
    
    let pv = 0;
    
    // Present value of coupon payments
    for (let i = 1; i <= totalPayments; i++) {
      pv += couponPayment / Math.pow(1 + periodYield, i);
    }
    
    // Present value of face value
    pv += face / Math.pow(1 + periodYield, totalPayments);
    
    return pv;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className={`w-5 h-5 ${theme.status.info.text}`} />
              <span>Bond Details</span>
            </CardTitle>
            <CardDescription>Enter the bond&apos;s characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                Face Value
              </label>
              <Input
                type="number"
                value={faceValue}
                onChange={(e) => setFaceValue(e.target.value)}
                placeholder="1000"
              />
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>Par value at maturity</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                Coupon Rate (%)
              </label>
              <Input
                type="number"
                step="0.1"
                value={couponRate}
                onChange={(e) => setCouponRate(e.target.value)}
                placeholder="5.0"
              />
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>Annual interest rate</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                Years to Maturity
              </label>
              <Input
                type="number"
                value={yearsToMaturity}
                onChange={(e) => setYearsToMaturity(e.target.value)}
                placeholder="10"
              />
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>Time until bond matures</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                Current Market Price
              </label>
              <Input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="950"
              />
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>What you pay to buy the bond</p>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                Payment Frequency
              </label>
              <select 
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                className={`w-full p-2 border ${theme.borderColors.primary} rounded-md`}
              >
                <option value="1">Annual</option>
                <option value="2">Semi-Annual</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>How often coupons are paid</p>
            </div>
            
            <Button onClick={calculateBondMetrics} className="w-full">
              Calculate Bond Metrics
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className={`w-5 h-5 ${theme.status.success.text}`} />
              <span>Bond Analysis</span>
            </CardTitle>
            <CardDescription>Key metrics and returns</CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 ${theme.status.info.bg} rounded-lg`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Percent className={`w-4 h-4 ${theme.status.info.text}`} />
                      <span className={`text-sm font-medium ${theme.textColors.secondary}`}>Current Yield</span>
                    </div>
                    <p className={`text-lg font-bold ${theme.status.info.text}`}>
                      {formatPercentage(results.currentYield)}
                    </p>
                  </div>
                  
                  <div className={`p-3 ${theme.status.success.bg} rounded-lg`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className={`w-4 h-4 ${theme.status.success.text}`} />
                      <span className={`text-sm font-medium ${theme.textColors.primary}`}>Yield to Maturity</span>
                    </div>
                    <p className={`text-lg font-bold ${theme.status.success.text}`}>
                      {formatPercentage(results.yieldToMaturity)}
                    </p>
                  </div>
                  
                  <div className={`p-3 ${theme.status.info.bg} rounded-lg`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className={`w-4 h-4 ${theme.status.info.text}`} />
                      <span className={`text-sm font-medium ${theme.textColors.primary}`}>Annual Income</span>
                    </div>
                    <p className={`text-lg font-bold ${theme.textColors.primary}`}>
                      {formatCurrency(results.annualIncome)}
                    </p>
                  </div>
                  
                  <div className={`p-3 ${theme.status.warning.bg} rounded-lg`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className={`w-4 h-4 ${theme.status.warning.text}`} />
                      <span className={`text-sm font-medium ${theme.status.warning.text}`}>Total Return</span>
                    </div>
                    <p className={`text-lg font-bold ${theme.status.warning.text}`}>
                      {formatCurrency(results.totalReturn)}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className={`font-medium ${theme.textColors.primary}`}>Key Insights</h4>
                  <div className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                    <p>
                      • <span className="font-medium">Duration Risk:</span> ~{results.interestRateSensitivity.toFixed(1)} years 
                      (1% rate increase = ~{results.interestRateSensitivity.toFixed(1)}% price decrease)
                    </p>
                    <p>
                      • <span className="font-medium">Premium/Discount:</span> {
                        parseFloat(currentPrice) > parseFloat(faceValue) 
                          ? `Trading at ${formatPercentage(((parseFloat(currentPrice) - parseFloat(faceValue)) / parseFloat(faceValue)) * 100)} premium`
                          : parseFloat(currentPrice) < parseFloat(faceValue)
                          ? `Trading at ${formatPercentage(((parseFloat(faceValue) - parseFloat(currentPrice)) / parseFloat(faceValue)) * 100)} discount`
                          : 'Trading at par value'
                      }
                    </p>
                    <p>
                      • <span className="font-medium">Income Stream:</span> {formatCurrency(results.annualIncome / parseInt(paymentFrequency))} 
                      per payment ({paymentFrequency === '1' ? 'annually' : paymentFrequency === '2' ? 'semi-annually' : paymentFrequency === '4' ? 'quarterly' : 'monthly'})
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 ${theme.textColors.muted}`}>
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter bond details and click calculate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interest Rate Sensitivity Analysis */}
      {rateScenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className={`w-5 h-5 ${theme.status.info.text}`} />
              <span>Interest Rate Sensitivity Analysis</span>
            </CardTitle>
            <CardDescription>
              How bond price changes with different interest rate scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rateScenarios}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis 
                    dataKey="rateChange" 
                    label={{ value: 'Rate Change (%)', position: 'insideBottom', offset: -10 }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis 
                    label={{ value: 'Price Change (%)', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: "#94a3b8" }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [
                      `${value}%`,
                      'Price Change'
                    ]}
                    labelFormatter={(label) => `Rate Change: ${label}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="priceChange" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className={`mt-4 p-4 ${theme.status.warning.bg} rounded-lg border ${theme.status.warning.border}`}>
              <h4 className={`font-medium ${theme.status.warning.text} mb-2`}>Understanding the Chart</h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                This chart shows how your bond&apos;s price would change if market interest rates move up or down. 
                Notice the inverse relationship: when rates rise (right side), bond prices fall. When rates fall (left side), 
                bond prices rise. Longer-term bonds are more sensitive to rate changes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Bond Investment Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 ${theme.status.info.bg} rounded-lg border ${theme.status.info.border}`}>
              <h4 className={`font-medium ${theme.textColors.secondary} mb-2`}>For Income Investors</h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Bonds provide predictable income streams. Consider laddering bonds with different maturity dates 
                to manage interest rate risk and ensure steady cash flow.
              </p>
            </div>
            
            <div className={`p-4 ${theme.status.success.bg} rounded-lg border ${theme.status.success.border}`}>
              <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>For Risk Management</h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Bonds typically move opposite to stocks, providing portfolio balance. Government bonds are safest, 
                while corporate bonds offer higher yields with more risk.
              </p>
            </div>
            
            <div className={`p-4 ${theme.status.info.bg} rounded-lg border ${theme.borderColors.primary}`}>
              <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Timing Considerations</h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                In rising rate environments, consider shorter-term bonds or bond funds. In falling rate environments, 
                longer-term bonds can provide capital appreciation.
              </p>
            </div>
          </div>
          
          <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Pro Tip: Bond Laddering Strategy</h4>
            <p className={`${theme.textColors.primary} text-sm`}>
              Instead of buying one large bond, consider spreading your investment across bonds with different maturity dates. 
              For example, buy bonds maturing in 1, 3, 5, 7, and 10 years. As each bond matures, reinvest at current rates. 
              This strategy provides regular access to your principal and reduces interest rate risk.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

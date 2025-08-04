'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  AlertTriangle,
  Info,
  DollarSign,
  Target,
  Shield,
  BarChart3
} from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface BondMetrics {
  currentYield: number;
  yieldToMaturity: number;
  modifiedDuration: number;
  convexity: number;
  priceChange1Percent: number;
  priceChange2Percent: number;
  bondPrice: number;
  accruedInterest: number;
  totalReturn: number;
  taxEquivalentYield: number;
}

export default function AdvancedBondPricingCalculator() {
  // Bond Parameters
  const [faceValue, setFaceValue] = useState<number>(1000);
  const [couponRate, setCouponRate] = useState<number>(5.0);
  const [yearsToMaturity, setYearsToMaturity] = useState<number>(10);
  const [marketYield, setMarketYield] = useState<number>(4.5);
  const [paymentsPerYear, setPaymentsPerYear] = useState<number>(2);
  const [daysSinceLastPayment, setDaysSinceLastPayment] = useState<number>(90);
  const [taxRate, setTaxRate] = useState<number>(32);

  // Advanced Parameters
  const [callPrice, setCallPrice] = useState<number>(1050);
  const [yearsToCall, setYearsToCall] = useState<number>(5);
  const [isCallable, setIsCallable] = useState<boolean>(false);
  const [isTaxFree, setIsTaxFree] = useState<boolean>(false);

  const [results, setResults] = useState<BondMetrics | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('advanced-bond-pricing-calculator');
  }, [recordCalculatorUsage]);

  const calculateBondMetrics = useCallback((): BondMetrics => {
    const periods = yearsToMaturity * paymentsPerYear;
    const periodicYield = marketYield / 100 / paymentsPerYear;
    const periodicCoupon = (couponRate / 100 * faceValue) / paymentsPerYear;
    
    // Bond Price Calculation (Present Value of Cash Flows)
    let presentValueCoupons = 0;
    for (let i = 1; i <= periods; i++) {
      presentValueCoupons += periodicCoupon / Math.pow(1 + periodicYield, i);
    }
    const presentValuePrincipal = faceValue / Math.pow(1 + periodicYield, periods);
    const bondPrice = presentValueCoupons + presentValuePrincipal;

    // Current Yield
    const currentYield = (couponRate / 100 * faceValue) / bondPrice * 100;

    // Yield to Maturity (using Newton-Raphson method approximation)
    const ytmApprox = marketYield; // Using market yield as approximation

    // Modified Duration Calculation
    let durationNumerator = 0;
    for (let i = 1; i <= periods; i++) {
      const cashFlow = i === periods ? periodicCoupon + faceValue : periodicCoupon;
      const presentValue = cashFlow / Math.pow(1 + periodicYield, i);
      durationNumerator += (i * presentValue);
    }
    const modifiedDuration = durationNumerator / (bondPrice * (1 + periodicYield)) / paymentsPerYear;

    // Convexity Calculation
    let convexityNumerator = 0;
    for (let i = 1; i <= periods; i++) {
      const cashFlow = i === periods ? periodicCoupon + faceValue : periodicCoupon;
      const presentValue = cashFlow / Math.pow(1 + periodicYield, i);
      convexityNumerator += (i * (i + 1) * presentValue);
    }
    const convexity = convexityNumerator / (bondPrice * Math.pow(1 + periodicYield, 2)) / Math.pow(paymentsPerYear, 2);

    // Price Sensitivity Analysis
    const priceChange1Percent = -modifiedDuration + (0.5 * convexity * Math.pow(0.01, 2));
    const priceChange2Percent = -modifiedDuration * 2 + (0.5 * convexity * Math.pow(0.02, 2));

    // Accrued Interest
    const daysInPeriod = 365 / paymentsPerYear;
    const accruedInterest = (periodicCoupon * daysSinceLastPayment) / daysInPeriod;

    // Total Return Calculation (1 year holding period)
    const reinvestmentRate = marketYield / 100;
    const reinvestedCoupons = (couponRate / 100 * faceValue) * (1 + reinvestmentRate);
    const endPrice = bondPrice; // Assuming no yield change
    const totalReturn = ((reinvestedCoupons + endPrice - bondPrice) / bondPrice) * 100;

    // Tax Equivalent Yield
    const taxEquivalentYield = isTaxFree ? 
      (currentYield / (1 - taxRate / 100)) : 
      currentYield;

    return {
      currentYield,
      yieldToMaturity: ytmApprox,
      modifiedDuration,
      convexity,
      priceChange1Percent: priceChange1Percent * 100,
      priceChange2Percent: priceChange2Percent * 100,
      bondPrice,
      accruedInterest,
      totalReturn,
      taxEquivalentYield
    };
  }, [faceValue, couponRate, yearsToMaturity, marketYield, paymentsPerYear, daysSinceLastPayment, taxRate, isTaxFree]);

  const handleCalculate = () => {
    const bondMetrics = calculateBondMetrics();
    setResults(bondMetrics);
  };

  const getRiskLevel = (duration: number): { level: string; color: string; icon: React.ComponentType } => {
    if (duration < 3) return { level: 'Low Risk', color: theme.status.success.text, icon: Shield };
    if (duration < 7) return { level: 'Moderate Risk', color: theme.status.warning.text, icon: Target };
    return { level: 'High Risk', color: theme.status.error.text, icon: AlertTriangle };
  };

  const getYieldAttractiveness = (currentYield: number, marketYield: number): { label: string; color: string } => {
    const spread = currentYield - marketYield;
    if (spread > 1) return { label: 'Very Attractive', color: theme.status.success.text };
    if (spread > 0) return { label: 'Attractive', color: theme.status.info.text };
    if (spread > -1) return { label: 'Fair', color: theme.status.warning.text };
    return { label: 'Poor', color: theme.status.error.text };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-full flex items-center justify-center mx-auto`}>
          <Calculator className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
          Advanced Bond Pricing Calculator
        </h1>
        <p className={`${theme.typography.body} ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Calculate bond prices, yields, duration, convexity, and perform comprehensive fixed income analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <DollarSign className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                Bond Parameters
              </CardTitle>
              <CardDescription>Enter the bond characteristics for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faceValue">Face Value ($)</Label>
                  <Input
                    id="faceValue"
                    type="number"
                    value={faceValue}
                    onChange={(e) => setFaceValue(Number(e.target.value))}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="couponRate">Coupon Rate (%)</Label>
                  <Input
                    id="couponRate"
                    type="number"
                    step="0.1"
                    value={couponRate}
                    onChange={(e) => setCouponRate(Number(e.target.value))}
                    placeholder="5.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsToMaturity">Years to Maturity</Label>
                  <Input
                    id="yearsToMaturity"
                    type="number"
                    value={yearsToMaturity}
                    onChange={(e) => setYearsToMaturity(Number(e.target.value))}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketYield">Market Yield (%)</Label>
                  <Input
                    id="marketYield"
                    type="number"
                    step="0.1"
                    value={marketYield}
                    onChange={(e) => setMarketYield(Number(e.target.value))}
                    placeholder="4.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentsPerYear">Payments Per Year</Label>
                  <select
                    id="paymentsPerYear"
                    value={paymentsPerYear}
                    onChange={(e) => setPaymentsPerYear(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Annual</option>
                    <option value={2}>Semi-Annual</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysSinceLastPayment">Days Since Last Payment</Label>
                  <Input
                    id="daysSinceLastPayment"
                    type="number"
                    value={daysSinceLastPayment}
                    onChange={(e) => setDaysSinceLastPayment(Number(e.target.value))}
                    placeholder="90"
                  />
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </Button>

              {/* Advanced Parameters */}
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pt-4 border-t border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isCallable}
                        onChange={(e) => setIsCallable(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Callable Bond</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isTaxFree}
                        onChange={(e) => setIsTaxFree(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Tax-Free</span>
                    </label>
                  </div>

                  {isCallable && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="callPrice">Call Price ($)</Label>
                        <Input
                          id="callPrice"
                          type="number"
                          value={callPrice}
                          onChange={(e) => setCallPrice(Number(e.target.value))}
                          placeholder="1050"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearsToCall">Years to Call</Label>
                        <Input
                          id="yearsToCall"
                          type="number"
                          value={yearsToCall}
                          onChange={(e) => setYearsToCall(Number(e.target.value))}
                          placeholder="5"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      placeholder="32"
                    />
                  </div>
                </motion.div>
              )}

              <Button 
                onClick={handleCalculate}
                className={`w-full ${theme.buttons.primary}`}
                size="lg"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Bond Metrics
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <BarChart3 className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Bond Analysis Results
              </CardTitle>
              <CardDescription>Comprehensive bond pricing and risk metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  {/* Price and Yield Metrics */}
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Price & Yield Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                        <div className={`text-2xl font-bold ${theme.status.success.text}`}>
                          ${results.bondPrice.toFixed(2)}
                        </div>
                        <div className={`text-sm ${theme.textColors.secondary}`}>Bond Price</div>
                        <div className={`text-xs ${theme.textColors.secondary} mt-1`}>
                          {results.bondPrice > faceValue ? 'Premium' : results.bondPrice < faceValue ? 'Discount' : 'Par'}
                        </div>
                      </div>
                      <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                        <div className={`text-2xl font-bold ${theme.status.info.text}`}>
                          {results.currentYield.toFixed(2)}%
                        </div>
                        <div className={`text-sm ${theme.textColors.secondary}`}>Current Yield</div>
                        <div className={`text-xs ${getYieldAttractiveness(results.currentYield, marketYield).color} mt-1`}>
                          {getYieldAttractiveness(results.currentYield, marketYield).label}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Risk Metrics */}
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Risk Metrics</h4>
                    <div className="space-y-3">
                      <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                              {results.modifiedDuration.toFixed(2)} years
                            </div>
                            <div className={`text-sm ${theme.textColors.secondary}`}>Modified Duration</div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant="outline" 
                              className={`${getRiskLevel(results.modifiedDuration).color} border-current`}
                            >
                              {getRiskLevel(results.modifiedDuration).level}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                        <div className={`text-lg font-bold ${theme.textColors.primary} mb-1`}>
                          {results.convexity.toFixed(2)}
                        </div>
                        <div className={`text-sm ${theme.textColors.secondary}`}>Convexity</div>
                        <div className={`text-xs ${theme.textColors.secondary} mt-1`}>
                          Higher convexity = better price appreciation potential
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Sensitivity */}
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Interest Rate Sensitivity</h4>
                    <div className="space-y-3">
                      <div className={`p-3 ${theme.backgrounds.card} rounded border flex items-center justify-between`}>
                        <span className={`text-sm ${theme.textColors.secondary}`}>+1% Rate Change:</span>
                        <span className={`font-bold ${results.priceChange1Percent < 0 ? theme.status.error.text : theme.status.success.text}`}>
                          {results.priceChange1Percent > 0 ? '+' : ''}{results.priceChange1Percent.toFixed(2)}%
                        </span>
                      </div>
                      <div className={`p-3 ${theme.backgrounds.card} rounded border flex items-center justify-between`}>
                        <span className={`text-sm ${theme.textColors.secondary}`}>+2% Rate Change:</span>
                        <span className={`font-bold ${results.priceChange2Percent < 0 ? theme.status.error.text : theme.status.success.text}`}>
                          {results.priceChange2Percent > 0 ? '+' : ''}{results.priceChange2Percent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Metrics */}
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Additional Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                        <div className={`text-lg font-bold ${theme.status.warning.text}`}>
                          ${results.accruedInterest.toFixed(2)}
                        </div>
                        <div className={`text-sm ${theme.textColors.secondary}`}>Accrued Interest</div>
                      </div>
                      <div className={`p-4 ${theme.backgrounds.card} rounded-lg border`}>
                        <div className={`text-lg font-bold ${theme.status.info.text}`}>
                          {results.totalReturn.toFixed(2)}%
                        </div>
                        <div className={`text-sm ${theme.textColors.secondary}`}>Est. Total Return</div>
                      </div>
                    </div>
                    
                    {isTaxFree && (
                      <div className={`p-4 ${theme.backgrounds.card} rounded-lg border mt-4`}>
                        <div className={`text-lg font-bold ${theme.status.success.text}`}>
                          {results.taxEquivalentYield.toFixed(2)}%
                        </div>
                        <div className={`text-sm ${theme.textColors.secondary}`}>Tax-Equivalent Yield</div>
                        <div className={`text-xs ${theme.textColors.secondary} mt-1`}>
                          What a taxable bond would need to yield
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`text-center py-12 ${theme.textColors.secondary}`}>
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter bond parameters and click calculate to see detailed analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Educational Content */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className={`${theme.status.info.bg}/10 border ${theme.status.info.border}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center`}>
                <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Understanding Your Bond Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Duration & Risk:</h5>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Your bond&apos;s modified duration of {results.modifiedDuration.toFixed(1)} years means 
                    the price will change by approximately {Math.abs(results.priceChange1Percent).toFixed(1)}% 
                    for each 1% change in interest rates. {results.modifiedDuration > 7 ? 
                    'This is relatively high interest rate risk.' : 
                    results.modifiedDuration > 3 ? 
                    'This represents moderate interest rate risk.' : 
                    'This is relatively low interest rate risk.'}
                  </p>
                </div>
                <div>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Price Analysis:</h5>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    {results.bondPrice > faceValue ? 
                    `Trading at a premium (${((results.bondPrice/faceValue - 1) * 100).toFixed(1)}% above par) because the coupon rate exceeds current market rates.` :
                    results.bondPrice < faceValue ?
                    `Trading at a discount (${((1 - results.bondPrice/faceValue) * 100).toFixed(1)}% below par) because market rates exceed the coupon rate.` :
                    'Trading at par value, indicating the coupon rate matches current market rates.'}
                  </p>
                </div>
              </div>
              
              <div className={`p-4 ${theme.status.warning.bg}/10 border ${theme.status.warning.border} rounded-lg`}>
                <h5 className={`font-medium ${theme.status.warning.text} mb-2`}>Investment Considerations:</h5>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Hold to maturity to avoid interest rate risk and guarantee principal return</li>
                  <li>• Consider reinvestment risk when coupons are received</li>
                  <li>• Monitor credit quality of the issuer for potential default risk</li>
                  <li>• Factor in inflation impact on real returns over the holding period</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

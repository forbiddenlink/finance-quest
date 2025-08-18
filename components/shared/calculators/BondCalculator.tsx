import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBondCalculator } from '@/lib/hooks/calculators/useBondCalculator';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, BarChart3, Calculator } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export default function BondCalculator() {
  const [state, actions] = useBondCalculator();
  const { values, errors, result, isValid } = state;
  const { setValues, reset } = actions;

  const handleInputChange = (field: string, value: string) => {
    setValues({ [field]: field === 'paymentFrequency' ? value : Number(value) });
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Bond Calculator
          </CardTitle>
          <CardDescription>
            Calculate bond metrics, analyze risks, and get investment recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inputs">
            <TabsList>
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
              <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
              <TabsTrigger value="analysis" disabled={!result}>Analysis</TabsTrigger>
              <TabsTrigger value="cashflows" disabled={!result}>Cash Flows</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Face Value */}
                <div className="space-y-2">
                  <Label htmlFor="faceValue">Face Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="faceValue"
                      type="number"
                      className="pl-8"
                      value={values.faceValue}
                      onChange={(e) => handleInputChange('faceValue', e.target.value)}
                    />
                  </div>
                  {getFieldError('faceValue') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('faceValue')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Coupon Rate */}
                <div className="space-y-2">
                  <Label htmlFor="couponRate">Coupon Rate (%)</Label>
                  <Input
                    id="couponRate"
                    type="number"
                    value={values.couponRate}
                    onChange={(e) => handleInputChange('couponRate', e.target.value)}
                  />
                  {getFieldError('couponRate') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('couponRate')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Market Price */}
                <div className="space-y-2">
                  <Label htmlFor="marketPrice">Market Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="marketPrice"
                      type="number"
                      className="pl-8"
                      value={values.marketPrice}
                      onChange={(e) => handleInputChange('marketPrice', e.target.value)}
                    />
                  </div>
                  {getFieldError('marketPrice') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('marketPrice')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Years to Maturity */}
                <div className="space-y-2">
                  <Label htmlFor="yearsToMaturity">Years to Maturity</Label>
                  <Input
                    id="yearsToMaturity"
                    type="number"
                    value={values.yearsToMaturity}
                    onChange={(e) => handleInputChange('yearsToMaturity', e.target.value)}
                  />
                  {getFieldError('yearsToMaturity') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('yearsToMaturity')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Payment Frequency */}
                <div className="space-y-2">
                  <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                  <Select
                    value={values.paymentFrequency}
                    onValueChange={(value) => handleInputChange('paymentFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError('paymentFrequency') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('paymentFrequency')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Current Yield (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="currentYield">Current Yield (%) - Optional</Label>
                  <Input
                    id="currentYield"
                    type="number"
                    value={values.currentYield ?? ''}
                    onChange={(e) => handleInputChange('currentYield', e.target.value)}
                  />
                  {getFieldError('currentYield') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('currentYield')}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={reset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </TabsContent>

            {result && (
              <>
                <TabsContent value="results" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Yield to Maturity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatPercentage(result.yieldToMaturity)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total yield if held to maturity
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Modified Duration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {result.modifiedDuration.toFixed(2)} years
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Price sensitivity to yield changes
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Current Yield</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatPercentage(result.currentYield)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Annual income relative to price
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Total Return</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatPercentage(result.totalReturn)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expected annual return
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Risk Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Price Change for 1% Yield Change</div>
                        <div className="text-lg">
                          {formatPercentage(result.priceChangeFor1PercentYieldChange)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Interest Rate Risk</div>
                        <div className="text-lg capitalize">{result.interestRateRisk}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Reinvestment Risk</div>
                        <div className="text-lg capitalize">{result.reinvestmentRisk}</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Risk Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Interest Rate Risk</div>
                        <div className="text-muted-foreground">
                          {result.riskAnalysis.interestRateRisk}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Credit Risk</div>
                        <div className="text-muted-foreground">
                          {result.riskAnalysis.creditRisk}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Reinvestment Risk</div>
                        <div className="text-muted-foreground">
                          {result.riskAnalysis.reinvestmentRisk}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cashflows" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cash Flow Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.couponPayments.map((payment, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <div className="text-sm font-medium">{payment.date}</div>
                              <div className="text-sm text-muted-foreground">
                                Present Value: {formatCurrency(payment.presentValue)}
                              </div>
                            </div>
                            <div className="text-lg font-semibold">
                              {formatCurrency(payment.amount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Total Cash Flows</div>
                        <div className="text-lg">{formatCurrency(result.totalCashflows)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Present Value</div>
                        <div className="text-lg">{formatCurrency(result.presentValue)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
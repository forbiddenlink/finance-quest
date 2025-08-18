import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaxLossHarvesting } from '@/lib/hooks/calculators/useTaxLossHarvesting';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, BarChart3, Calculator } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export default function TaxLossHarvestingCalculator() {
  const [state, actions] = useTaxLossHarvesting();
  const { values, errors, result, isValid } = state;
  const { setValues, reset } = actions;

  const handleInputChange = (field: string, value: string) => {
    setValues({ [field]: field === 'reinvestmentStrategy' ? value : Number(value) });
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
            Tax Loss Harvesting Calculator
          </CardTitle>
          <CardDescription>
            Analyze tax-loss harvesting opportunities and optimize your strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inputs">
            <TabsList>
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
              <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
              <TabsTrigger value="opportunities" disabled={!result}>Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="inputs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Portfolio Value */}
                <div className="space-y-2">
                  <Label htmlFor="portfolioValue">Portfolio Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="portfolioValue"
                      type="number"
                      className="pl-8"
                      value={values.portfolioValue}
                      onChange={(e) => handleInputChange('portfolioValue', e.target.value)}
                    />
                  </div>
                  {getFieldError('portfolioValue') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('portfolioValue')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Tax Bracket */}
                <div className="space-y-2">
                  <Label htmlFor="taxBracket">Federal Tax Bracket (%)</Label>
                  <Input
                    id="taxBracket"
                    type="number"
                    value={values.taxBracket}
                    onChange={(e) => handleInputChange('taxBracket', e.target.value)}
                  />
                  {getFieldError('taxBracket') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('taxBracket')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* State Tax Rate */}
                <div className="space-y-2">
                  <Label htmlFor="stateRate">State Tax Rate (%)</Label>
                  <Input
                    id="stateRate"
                    type="number"
                    value={values.stateRate}
                    onChange={(e) => handleInputChange('stateRate', e.target.value)}
                  />
                  {getFieldError('stateRate') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('stateRate')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Unrealized Losses */}
                <div className="space-y-2">
                  <Label htmlFor="unrealizedLosses">Unrealized Losses</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="unrealizedLosses"
                      type="number"
                      className="pl-8"
                      value={values.unrealizedLosses}
                      onChange={(e) => handleInputChange('unrealizedLosses', e.target.value)}
                    />
                  </div>
                  {getFieldError('unrealizedLosses') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('unrealizedLosses')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Holding Period */}
                <div className="space-y-2">
                  <Label htmlFor="holdingPeriod">Holding Period (days)</Label>
                  <Input
                    id="holdingPeriod"
                    type="number"
                    value={values.holdingPeriod}
                    onChange={(e) => handleInputChange('holdingPeriod', e.target.value)}
                  />
                  {getFieldError('holdingPeriod') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('holdingPeriod')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Transaction Costs */}
                <div className="space-y-2">
                  <Label htmlFor="transactionCosts">Transaction Costs</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="transactionCosts"
                      type="number"
                      className="pl-8"
                      value={values.transactionCosts}
                      onChange={(e) => handleInputChange('transactionCosts', e.target.value)}
                    />
                  </div>
                  {getFieldError('transactionCosts') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('transactionCosts')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Wash Sale Window */}
                <div className="space-y-2">
                  <Label htmlFor="washSaleWindow">Wash Sale Window (days)</Label>
                  <Input
                    id="washSaleWindow"
                    type="number"
                    value={values.washSaleWindow}
                    onChange={(e) => handleInputChange('washSaleWindow', e.target.value)}
                  />
                  {getFieldError('washSaleWindow') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('washSaleWindow')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Reinvestment Strategy */}
                <div className="space-y-2">
                  <Label htmlFor="reinvestmentStrategy">Reinvestment Strategy</Label>
                  <Select
                    value={values.reinvestmentStrategy}
                    onValueChange={(value) => handleInputChange('reinvestmentStrategy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="similar">Similar Securities</SelectItem>
                      <SelectItem value="different">Different Securities</SelectItem>
                      <SelectItem value="cash">Hold Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError('reinvestmentStrategy') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('reinvestmentStrategy')}</AlertDescription>
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
                        <CardTitle className="text-lg">Tax Savings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(result.potentialTaxSavings)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Potential tax savings from harvesting
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Net Benefit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(result.netBenefit)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          After transaction costs
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Optimal Amount</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(result.optimalHarvestingAmount)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Recommended harvesting amount
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Wash Sale Risk</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary capitalize">
                          {result.washSaleRisk}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Based on current strategy
                        </p>
                      </CardContent>
                    </Card>
                  </div>

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

                <TabsContent value="opportunities" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {result.harvestingOpportunities.map((opportunity, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {index === 0 ? 'Conservative' : index === 1 ? 'Moderate' : 'Aggressive'} Strategy
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Amount</div>
                              <div className="text-lg font-semibold">
                                {formatCurrency(opportunity.amount)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Benefit</div>
                              <div className="text-lg font-semibold">
                                {formatCurrency(opportunity.benefit)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Risk Level</div>
                              <div className="text-lg font-semibold capitalize">
                                {opportunity.risk}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Timing Recommendation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Best Time to Harvest</div>
                            <div className="text-lg font-semibold capitalize">
                              {result.timing.bestTime}
                            </div>
                          </div>
                          {result.timing.waitPeriod > 0 && (
                            <div>
                              <div className="text-sm text-muted-foreground">Recommended Wait Period</div>
                              <div className="text-lg font-semibold">
                                {result.timing.waitPeriod} days
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
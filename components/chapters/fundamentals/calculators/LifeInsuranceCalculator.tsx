import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLifeInsurance } from '@/lib/hooks/calculators/useLifeInsurance';
import { DollarSign, Heart, AlertTriangle, CheckCircle2, RefreshCw, BarChart3, Calculator, Shield } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';

export default function LifeInsuranceCalculator() {
  const [state, actions] = useLifeInsurance();
  const { values, errors, result, isValid } = state;
  const { setValues, reset } = actions;

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('familyHistory.')) {
      const historyField = field.split('.')[1];
      setValues({
        familyHistory: {
          ...values.familyHistory,
          [historyField]: value
        }
      });
    } else {
      setValues({ [field]: value });
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Life Insurance Calculator
          </CardTitle>
          <CardDescription>
            Calculate recommended life insurance coverage and explore policy options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="financial">Financial Info</TabsTrigger>
              <TabsTrigger value="coverage">Coverage</TabsTrigger>
              <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
              <TabsTrigger value="recommendations" disabled={!result}>Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={values.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                  {getFieldError('age') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('age')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={values.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError('gender') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('gender')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Smoker Status */}
                <div className="space-y-2">
                  <Label htmlFor="smoker">Smoker</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smoker"
                      checked={values.smoker}
                      onCheckedChange={(checked) => handleInputChange('smoker', checked)}
                    />
                    <Label htmlFor="smoker">{values.smoker ? 'Yes' : 'No'}</Label>
                  </div>
                </div>

                {/* Health Status */}
                <div className="space-y-2">
                  <Label htmlFor="healthStatus">Health Status</Label>
                  <Select
                    value={values.healthStatus}
                    onValueChange={(value) => handleInputChange('healthStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError('healthStatus') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('healthStatus')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Family History */}
                <div className="space-y-4 col-span-2">
                  <Label>Family History</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="heartDisease"
                        checked={values.familyHistory.heartDisease}
                        onCheckedChange={(checked) => handleInputChange('familyHistory.heartDisease', checked)}
                      />
                      <Label htmlFor="heartDisease">Heart Disease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cancer"
                        checked={values.familyHistory.cancer}
                        onCheckedChange={(checked) => handleInputChange('familyHistory.cancer', checked)}
                      />
                      <Label htmlFor="cancer">Cancer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="diabetes"
                        checked={values.familyHistory.diabetes}
                        onCheckedChange={(checked) => handleInputChange('familyHistory.diabetes', checked)}
                      />
                      <Label htmlFor="diabetes">Diabetes</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Annual Income */}
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="annualIncome"
                      type="number"
                      className="pl-8"
                      value={values.annualIncome}
                      onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    />
                  </div>
                  {getFieldError('annualIncome') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('annualIncome')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Total Debt */}
                <div className="space-y-2">
                  <Label htmlFor="totalDebt">Total Debt</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="totalDebt"
                      type="number"
                      className="pl-8"
                      value={values.totalDebt}
                      onChange={(e) => handleInputChange('totalDebt', e.target.value)}
                    />
                  </div>
                  {getFieldError('totalDebt') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('totalDebt')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Mortgage Balance */}
                <div className="space-y-2">
                  <Label htmlFor="mortgageBalance">Mortgage Balance</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mortgageBalance"
                      type="number"
                      className="pl-8"
                      value={values.mortgageBalance}
                      onChange={(e) => handleInputChange('mortgageBalance', e.target.value)}
                    />
                  </div>
                  {getFieldError('mortgageBalance') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('mortgageBalance')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Dependents */}
                <div className="space-y-2">
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={values.dependents}
                    onChange={(e) => handleInputChange('dependents', e.target.value)}
                  />
                  {getFieldError('dependents') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('dependents')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Years of Support */}
                <div className="space-y-2">
                  <Label htmlFor="yearsOfSupport">Years of Support Needed</Label>
                  <Input
                    id="yearsOfSupport"
                    type="number"
                    value={values.yearsOfSupport}
                    onChange={(e) => handleInputChange('yearsOfSupport', e.target.value)}
                  />
                  {getFieldError('yearsOfSupport') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('yearsOfSupport')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* College Expenses */}
                <div className="space-y-2">
                  <Label htmlFor="collegeExpenses">Include College Expenses</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="collegeExpenses"
                      checked={values.collegeExpenses}
                      onCheckedChange={(checked) => handleInputChange('collegeExpenses', checked)}
                    />
                    <Label htmlFor="collegeExpenses">{values.collegeExpenses ? 'Yes' : 'No'}</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="coverage" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coverage Type */}
                <div className="space-y-2">
                  <Label htmlFor="coverageType">Coverage Type</Label>
                  <Select
                    value={values.coverageType}
                    onValueChange={(value) => handleInputChange('coverageType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term">Term Life</SelectItem>
                      <SelectItem value="whole">Whole Life</SelectItem>
                      <SelectItem value="universal">Universal Life</SelectItem>
                    </SelectContent>
                  </Select>
                  {getFieldError('coverageType') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('coverageType')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Term Length */}
                {values.coverageType === 'term' && (
                  <div className="space-y-2">
                    <Label htmlFor="termLength">Term Length (Years)</Label>
                    <Input
                      id="termLength"
                      type="number"
                      value={values.termLength}
                      onChange={(e) => handleInputChange('termLength', e.target.value)}
                    />
                    {getFieldError('termLength') && (
                      <Alert variant="destructive">
                        <AlertDescription>{getFieldError('termLength')}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Existing Coverage */}
                <div className="space-y-2">
                  <Label htmlFor="existingCoverage">Existing Coverage</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="existingCoverage"
                      type="number"
                      className="pl-8"
                      value={values.existingCoverage}
                      onChange={(e) => handleInputChange('existingCoverage', e.target.value)}
                    />
                  </div>
                  {getFieldError('existingCoverage') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('existingCoverage')}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Monthly Budget */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyBudget">Monthly Budget (Optional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="monthlyBudget"
                      type="number"
                      className="pl-8"
                      value={values.monthlyBudget ?? ''}
                      onChange={(e) => handleInputChange('monthlyBudget', e.target.value)}
                    />
                  </div>
                  {getFieldError('monthlyBudget') && (
                    <Alert variant="destructive">
                      <AlertDescription>{getFieldError('monthlyBudget')}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </TabsContent>

            {result && (
              <>
                <TabsContent value="results" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recommended Coverage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(result.recommendedCoverage)}
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span>Income Replacement</span>
                            <span>{formatCurrency(result.coverageBreakdown.incomeReplacement)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Debt Payoff</span>
                            <span>{formatCurrency(result.coverageBreakdown.debtPayoff)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Education</span>
                            <span>{formatCurrency(result.coverageBreakdown.education)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Final Expenses</span>
                            <span>{formatCurrency(result.coverageBreakdown.finalExpenses)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Premium Estimate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(result.estimatedPremium.monthly)}/month
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(result.estimatedPremium.annual)}/year
                        </p>
                        <div className="mt-4 space-y-2">
                          {result.premiumFactors.map((factor, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className={`
                                w-2 h-2 rounded-full mt-1.5
                                ${factor.impact === 'high' ? 'bg-red-500' :
                                  factor.impact === 'moderate' ? 'bg-yellow-500' :
                                  'bg-green-500'}
                              `} />
                              <div>
                                <div className="font-medium">{factor.factor}</div>
                                <div className="text-sm text-muted-foreground">{factor.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <div className="text-sm font-medium">Risk Score</div>
                            <div className="text-2xl font-bold">{result.riskScore}</div>
                            <div className="text-sm text-muted-foreground">
                              Health Class: {result.healthClass.replace('_', ' ').toUpperCase()}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="text-sm font-medium">Risk Factors</div>
                            <ul className="mt-2 space-y-2">
                              {result.riskFactors.map((factor, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  <span>{factor}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {result.recommendedPolicies.map((policy, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{policy.type}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm font-medium">Coverage Amount</div>
                              <div className="text-xl font-bold">{formatCurrency(policy.coverage)}</div>
                              {policy.term && (
                                <div className="text-sm text-muted-foreground">
                                  {policy.term} Year Term
                                </div>
                              )}
                              <div className="mt-2 text-sm font-medium">Monthly Premium</div>
                              <div className="text-xl font-bold">
                                {formatCurrency(policy.monthlyPremium)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Key Features</div>
                              <ul className="mt-2 space-y-2">
                                {policy.features.map((feature, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Pros</div>
                              <ul className="mt-2 space-y-2">
                                {policy.pros.map((pro, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>{pro}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Cons</div>
                              <ul className="mt-2 space-y-2">
                                {policy.cons.map((con, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    <span>{con}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Affordability Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm font-medium">Affordability Score</div>
                            <div className="text-2xl font-bold">
                              {result.affordabilityAnalysis.affordabilityScore}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Budget Impact: {formatPercentage(result.affordabilityAnalysis.monthlyBudgetImpact)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Recommendations</div>
                            <ul className="mt-2 space-y-2">
                              {result.affordabilityAnalysis.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Additional Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm font-medium">Key Insights</div>
                            <ul className="mt-2 space-y-2">
                              {result.insights.map((insight, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Warnings</div>
                            <ul className="mt-2 space-y-2">
                              {result.warnings.map((warning, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  <span>{warning}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
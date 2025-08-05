'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaxOptimizerCalculator } from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
import { TrendingUp, TrendingDown, DollarSign, Calculator, Target, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TaxOptimizerCalculator() {
    const { recordCalculatorUsage } = useProgressStore();
    const {
        values,
        errors,
        result,
        isValid,
        updateValue,
        updateFilingStatus,
        reset
    } = useTaxOptimizerCalculator();

    // Record usage when component mounts
    React.useEffect(() => {
        recordCalculatorUsage('tax-optimizer');
    }, [recordCalculatorUsage]);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatPercentage = (value: number): string => {
        return `${value.toFixed(2)}%`;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800 border-green-300';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const filingStatusOptions = [
        { value: 'single', label: 'Single' },
        { value: 'marriedJointly', label: 'Married Filing Jointly' },
        { value: 'marriedSeparately', label: 'Married Filing Separately' },
        { value: 'headOfHousehold', label: 'Head of Household' }
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Tax Optimizer Calculator
                    </CardTitle>
                    <CardDescription>
                        Optimize your tax strategy and maximize your savings with advanced tax planning tools
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Income & Filing Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="income">Annual Income</Label>
                                <Input
                                    id="income"
                                    type="number"
                                    value={values.income}
                                    onChange={(e) => updateValue('income', e.target.value)}
                                    placeholder="75000"
                                />
                                {errors.income && (
                                    <p className="text-sm text-red-600 mt-1">{errors.income}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="filingStatus">Filing Status</Label>
                                <select
                                    id="filingStatus"
                                    value={values.filingStatus}
                                    onChange={(e) => updateFilingStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filingStatusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="currentDeductions">Current Deductions</Label>
                                <Input
                                    id="currentDeductions"
                                    type="number"
                                    value={values.currentDeductions}
                                    onChange={(e) => updateValue('currentDeductions', e.target.value)}
                                    placeholder="13850"
                                />
                                {errors.currentDeductions && (
                                    <p className="text-sm text-red-600 mt-1">{errors.currentDeductions}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Retirement Contributions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="retirement401k">401(k) Contributions</Label>
                                <Input
                                    id="retirement401k"
                                    type="number"
                                    value={values.retirement401k}
                                    onChange={(e) => updateValue('retirement401k', e.target.value)}
                                    placeholder="6000"
                                />
                                {errors.retirement401k && (
                                    <p className="text-sm text-red-600 mt-1">{errors.retirement401k}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="retirementIra">IRA Contributions</Label>
                                <Input
                                    id="retirementIra"
                                    type="number"
                                    value={values.retirementIra}
                                    onChange={(e) => updateValue('retirementIra', e.target.value)}
                                    placeholder="3000"
                                />
                                {errors.retirementIra && (
                                    <p className="text-sm text-red-600 mt-1">{errors.retirementIra}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="hsaContribution">HSA Contributions</Label>
                                <Input
                                    id="hsaContribution"
                                    type="number"
                                    value={values.hsaContribution}
                                    onChange={(e) => updateValue('hsaContribution', e.target.value)}
                                    placeholder="2000"
                                />
                                {errors.hsaContribution && (
                                    <p className="text-sm text-red-600 mt-1">{errors.hsaContribution}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Deductions & Credits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="charitableDonations">Charitable Donations</Label>
                                    <Input
                                        id="charitableDonations"
                                        type="number"
                                        value={values.charitableDonations}
                                        onChange={(e) => updateValue('charitableDonations', e.target.value)}
                                        placeholder="2500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="mortgageInterest">Mortgage Interest</Label>
                                    <Input
                                        id="mortgageInterest"
                                        type="number"
                                        value={values.mortgageInterest}
                                        onChange={(e) => updateValue('mortgageInterest', e.target.value)}
                                        placeholder="8000"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="stateLocalTaxes">State/Local Taxes</Label>
                                    <Input
                                        id="stateLocalTaxes"
                                        type="number"
                                        value={values.stateLocalTaxes}
                                        onChange={(e) => updateValue('stateLocalTaxes', e.target.value)}
                                        placeholder="5000"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="businessExpenses">Business Expenses</Label>
                                    <Input
                                        id="businessExpenses"
                                        type="number"
                                        value={values.businessExpenses}
                                        onChange={(e) => updateValue('businessExpenses', e.target.value)}
                                        placeholder="1000"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="childTaxCredit">Child Tax Credit</Label>
                                    <Input
                                        id="childTaxCredit"
                                        type="number"
                                        value={values.childTaxCredit}
                                        onChange={(e) => updateValue('childTaxCredit', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="educationCredits">Education Credits</Label>
                                    <Input
                                        id="educationCredits"
                                        type="number"
                                        value={values.educationCredits}
                                        onChange={(e) => updateValue('educationCredits', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button onClick={reset} variant="outline" className="flex-1">
                            Reset Calculator
                        </Button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {result && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">Current Taxes</p>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {formatCurrency(result.currentTaxes)}
                                                </p>
                                            </div>
                                            <TrendingUp className="h-8 w-8 text-red-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">Optimized Taxes</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(result.optimizedTaxes)}
                                                </p>
                                            </div>
                                            <TrendingDown className="h-8 w-8 text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">Tax Savings</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {formatCurrency(result.taxSavings)}
                                                </p>
                                            </div>
                                            <DollarSign className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">Marginal Rate</p>
                                                <p className="text-2xl font-bold text-purple-600">
                                                    {formatPercentage(result.marginalRate)}
                                                </p>
                                            </div>
                                            <Target className="h-8 w-8 text-purple-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Detailed Analysis */}
                            <Tabs defaultValue="analysis" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="analysis">Tax Analysis</TabsTrigger>
                                    <TabsTrigger value="strategies">Strategies</TabsTrigger>
                                    <TabsTrigger value="brackets">Tax Brackets</TabsTrigger>
                                </TabsList>

                                <TabsContent value="analysis" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calculator className="h-5 w-5" />
                                                Tax Analysis Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Effective Tax Rate</p>
                                                    <p className="text-lg font-semibold">{formatPercentage(result.effectiveRate)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Optimized Rate</p>
                                                    <p className="text-lg font-semibold text-green-600">
                                                        {formatPercentage(result.optimizedRate)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Standard Deduction</p>
                                                    <p className="text-lg font-semibold">{formatCurrency(result.standardDeduction)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Itemized Deductions</p>
                                                    <p className="text-lg font-semibold">{formatCurrency(result.itemizedDeductions)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Take-Home Income</p>
                                                    <p className="text-lg font-semibold">{formatCurrency(result.takeHomeIncome)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Optimized Take-Home</p>
                                                    <p className="text-lg font-semibold text-green-600">
                                                        {formatCurrency(result.optimizedTakeHome)}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <Lightbulb className="h-4 w-4" />
                                                    Recommendations
                                                </h4>
                                                <div className="space-y-2">
                                                    {result.recommendations.map((rec, index) => (
                                                        <Alert key={index}>
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            <AlertDescription>{rec}</AlertDescription>
                                                        </Alert>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="strategies" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Target className="h-5 w-5" />
                                                Tax Optimization Strategies
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {result.strategies.map((strategy, index) => (
                                                    <div key={index} className="p-4 border rounded-lg">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold">{strategy.name}</h4>
                                                                <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <Badge className={getDifficultyColor(strategy.difficulty)}>
                                                                    {strategy.difficulty}
                                                                </Badge>
                                                                <Badge variant="outline">{strategy.category}</Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">Potential Savings:</span>
                                                            <span className="font-semibold text-green-600">
                                                                {formatCurrency(strategy.potentialSavings)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="brackets" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Tax Bracket Analysis</CardTitle>
                                            <CardDescription>
                                                Your income distribution across federal tax brackets
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {result.taxBracketAnalysis.map((bracket, index) => (
                                                    <div key={index} className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium">{bracket.bracket} Tax Bracket</span>
                                                            <span className="text-sm text-gray-600">
                                                                {formatCurrency(bracket.taxes)} tax
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={bracket.rate}
                                                            className="h-2"
                                                        />
                                                        <p className="text-sm text-gray-600">
                                                            {formatCurrency(bracket.taxableIncome)} taxable income
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            {result.taxSavings > 1000 && (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription className="font-medium">
                                        Great opportunity! You could save {formatCurrency(result.taxSavings)} annually by
                                        optimizing your tax strategy. Consider implementing the recommended strategies above.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}

                    {!isValid && Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Please correct the input errors to see your tax optimization analysis.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}

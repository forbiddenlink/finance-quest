'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, Calculator, DollarSign, TrendingUp, Target, BarChart3, PieChart } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function BusinessCalculator() {
    // Break-even Analysis
    const [fixedCosts, setFixedCosts] = useState<number>(10000);
    const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(15);
    const [pricePerUnit, setPricePerUnit] = useState<number>(25);

    // Financial Ratios
    const [currentAssets, setCurrentAssets] = useState<number>(50000);
    const [currentLiabilities, setCurrentLiabilities] = useState<number>(30000);
    const [totalDebt, setTotalDebt] = useState<number>(40000);
    const [totalEquity, setTotalEquity] = useState<number>(60000);
    const [revenue, setRevenue] = useState<number>(120000);
    const [grossProfit, setGrossProfit] = useState<number>(80000);
    const [netIncome, setNetIncome] = useState<number>(25000);

    // Cash Flow Projection
    const [monthlyRevenue, setMonthlyRevenue] = useState<number>(10000);
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(8000);
    const [initialCash, setInitialCash] = useState<number>(15000);

    const { recordCalculatorUsage } = useProgressStore();

    useEffect(() => {
        recordCalculatorUsage('business-calculator');
    }, [recordCalculatorUsage]);

    // Break-even calculations
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const breakEvenRevenue = breakEvenUnits * pricePerUnit;
    const contributionMarginRatio = pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0;

    // Financial ratios
    const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
    const workingCapital = currentAssets - currentLiabilities;
    const debtToEquityRatio = totalEquity > 0 ? totalDebt / totalEquity : 0;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;
    const returnOnEquity = totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0;

    // Cash flow projection (12 months)
    const generateCashFlowProjection = () => {
        const projection = [];
        let cumulativeCash = initialCash;

        for (let month = 1; month <= 12; month++) {
            const monthlyCashFlow = monthlyRevenue - monthlyExpenses;
            cumulativeCash += monthlyCashFlow;

            projection.push({
                month: `Month ${month}`,
                revenue: monthlyRevenue,
                expenses: monthlyExpenses,
                cashFlow: monthlyCashFlow,
                cumulativeCash
            });
        }

        return projection;
    };

    const cashFlowData = generateCashFlowProjection();

    // Chart data for break-even analysis
    const breakEvenChartData = Array.from({ length: 21 }, (_, i) => {
        const units = i * (breakEvenUnits / 10);
        const totalRevenue = units * pricePerUnit;
        const totalCosts = fixedCosts + (units * variableCostPerUnit);

        return {
            units: Math.round(units),
            revenue: totalRevenue,
            costs: totalCosts,
            profit: totalRevenue - totalCosts
        };
    });

    // Financial health indicators
    const getFinancialHealthIndicators = () => {
        const indicators = [
            {
                name: 'Liquidity',
                value: currentRatio,
                status: currentRatio >= 2 ? 'Excellent' : currentRatio >= 1.5 ? 'Good' : currentRatio >= 1 ? 'Fair' : 'Poor',
                color: currentRatio >= 2 ? '#10b981' : currentRatio >= 1.5 ? '#3b82f6' : currentRatio >= 1 ? '#f59e0b' : '#ef4444'
            },
            {
                name: 'Profitability',
                value: netMargin,
                status: netMargin >= 15 ? 'Excellent' : netMargin >= 10 ? 'Good' : netMargin >= 5 ? 'Fair' : 'Poor',
                color: netMargin >= 15 ? '#10b981' : netMargin >= 10 ? '#3b82f6' : netMargin >= 5 ? '#f59e0b' : '#ef4444'
            },
            {
                name: 'Leverage',
                value: debtToEquityRatio,
                status: debtToEquityRatio <= 0.3 ? 'Excellent' : debtToEquityRatio <= 0.6 ? 'Good' : debtToEquityRatio <= 1 ? 'Fair' : 'Poor',
                color: debtToEquityRatio <= 0.3 ? '#10b981' : debtToEquityRatio <= 0.6 ? '#3b82f6' : debtToEquityRatio <= 1 ? '#f59e0b' : '#ef4444'
            }
        ];

        return indicators;
    };

    const healthIndicators = getFinancialHealthIndicators();

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Asset allocation data for pie chart
    const assetAllocationData = [
        { name: 'Current Assets', value: currentAssets, color: COLORS[0] },
        { name: 'Fixed Assets', value: totalEquity - currentAssets + totalDebt, color: COLORS[1] },
        { name: 'Other Assets', value: Math.max(0, totalEquity * 0.2), color: COLORS[2] }
    ].filter(item => item.value > 0);

    // Reset functions
    const resetBreakeven = () => {
        setFixedCosts(10000);
        setVariableCostPerUnit(15);
        setPricePerUnit(25);
    };

    const resetRatios = () => {
        setCurrentAssets(50000);
        setCurrentLiabilities(30000);
        setTotalDebt(40000);
        setTotalEquity(60000);
        setRevenue(120000);
        setGrossProfit(80000);
        setNetIncome(25000);
    };

    const resetCashflow = () => {
        setMonthlyRevenue(10000);
        setMonthlyExpenses(8000);
        setInitialCash(15000);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-navy-600" />
                        <Building className="w-5 h-5 text-navy-600" />
                        <span>Business Finance Calculator</span>
                    </CardTitle>
                    <CardDescription>
                        Analyze key business metrics including break-even analysis, financial ratios, and cash flow projections
                    </CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="breakeven" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="breakeven">Break-even Analysis</TabsTrigger>
                    <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
                    <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
                </TabsList>

                <TabsContent value="breakeven" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Break-even Inputs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Break-even Analysis</CardTitle>
                                <CardDescription>Calculate how many units you need to sell to break even</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fixedCosts">Monthly Fixed Costs</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="fixedCosts"
                                            type="number"
                                            value={fixedCosts}
                                            onChange={(e) => setFixedCosts(Number(e.target.value))}
                                            className="pl-10"
                                            placeholder="10000"
                                        />
                                    </div>
                                    <p className="text-xs ${theme.textColors.secondary}">Rent, salaries, insurance, etc.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pricePerUnit">Price per Unit</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="pricePerUnit"
                                            type="number"
                                            value={pricePerUnit}
                                            onChange={(e) => setPricePerUnit(Number(e.target.value))}
                                            className="pl-10"
                                            placeholder="25"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="variableCostPerUnit">Variable Cost per Unit</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="variableCostPerUnit"
                                            type="number"
                                            value={variableCostPerUnit}
                                            onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
                                            className="pl-10"
                                            placeholder="15"
                                        />
                                    </div>
                                    <p className="text-xs ${theme.textColors.secondary}">Materials, labor, shipping, etc.</p>
                                </div>

                                <Button 
                                    onClick={resetBreakeven}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    Reset Values
                                </Button>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Contribution Margin per Unit:</span>
                                        <span className="font-bold">${contributionMargin.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Contribution Margin Ratio:</span>
                                        <span className="font-bold">{contributionMarginRatio.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Break-even Results */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <Target className="w-4 h-4" />
                                    <span>Break-even Results</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-navy-50 rounded-lg">
                                        <div className="${theme.typography.heading2} text-navy-900">{Math.round(breakEvenUnits).toLocaleString()}</div>
                                        <div className="text-sm text-navy-700">Units to Break Even</div>
                                    </div>
                                    <div className="text-center p-4 ${theme.status.success.bg} rounded-lg">
                                        <div className="${theme.typography.heading2} ${theme.status.success.text}">${breakEvenRevenue.toLocaleString()}</div>
                                        <div className="text-sm ${theme.textColors.secondary}">Break-even Revenue</div>
                                    </div>
                                </div>

                                <div className="${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-900 mb-2">💡 What This Means</h4>
                                    <p className="text-sm ${theme.status.warning.text}">
                                        You need to sell <strong>{Math.round(breakEvenUnits)} units</strong> per month to cover all your costs.
                                        Every unit sold beyond this point contributes <strong>${contributionMargin.toFixed(2)}</strong> to profit.
                                    </p>
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={breakEvenChartData.slice(0, 11)}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                            <XAxis dataKey="units"  tick={{ fill: "#94a3b8" }} />
                                            <YAxis  tick={{ fill: "#94a3b8" }} />
                                            <Tooltip
                                                formatter={(value: number, name: string) => [
                                                    `$${value.toLocaleString()}`,
                                                    name === 'revenue' ? 'Revenue' : name === 'costs' ? 'Total Costs' : 'Profit'
                                                ]}
                                            />
                                            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                                            <Bar dataKey="costs" fill="#ef4444" name="Total Costs" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="ratios" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Financial Inputs */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Balance Sheet Data</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentAssets">Current Assets</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="currentAssets"
                                                type="number"
                                                value={currentAssets}
                                                onChange={(e) => setCurrentAssets(Number(e.target.value))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="currentLiabilities">Current Liabilities</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="currentLiabilities"
                                                type="number"
                                                value={currentLiabilities}
                                                onChange={(e) => setCurrentLiabilities(Number(e.target.value))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="totalDebt">Total Debt</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="totalDebt"
                                                type="number"
                                                value={totalDebt}
                                                onChange={(e) => setTotalDebt(Number(e.target.value))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="totalEquity">Total Equity</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="totalEquity"
                                                type="number"
                                                value={totalEquity}
                                                onChange={(e) => setTotalEquity(Number(e.target.value))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Income Statement Data</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="revenue">Annual Revenue</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="revenue"
                                                type="number"
                                                value={revenue}
                                                onChange={(e) => setRevenue(Number(e.target.value))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="grossProfit">Gross Profit</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="grossProfit"
                                                type="number"
                                                value={grossProfit}
                                                onChange={(e) => setGrossProfit(Number(e.target.value))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="netIncome">Net Income</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="netIncome"
                                                type="number"
                                                value={netIncome}
                                                onChange={(e) => setNetIncome(Number(e.target.value))}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={resetRatios}
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Reset Values
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Financial Ratios Results */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Key Financial Ratios</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-navy-50 rounded-lg">
                                            <div className="text-xl font-bold text-navy-900">{currentRatio.toFixed(2)}</div>
                                            <div className="text-sm text-navy-700">Current Ratio</div>
                                            <div className="text-xs text-navy-600">Should be &gt; 1.5</div>
                                        </div>
                                        <div className="text-center p-4 ${theme.status.success.bg} rounded-lg">
                                            <div className="text-xl font-bold ${theme.status.success.text}">${workingCapital.toLocaleString()}</div>
                                            <div className="text-sm ${theme.textColors.secondary}">Working Capital</div>
                                            <div className="text-xs text-green-400">Should be positive</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-500/20 rounded-lg">
                                            <div className="text-xl font-bold text-purple-400">{debtToEquityRatio.toFixed(2)}</div>
                                            <div className="text-sm text-purple-700">Debt-to-Equity</div>
                                            <div className="text-xs text-purple-400">Lower is better</div>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                            <div className="text-xl font-bold text-orange-900">{grossMargin.toFixed(1)}%</div>
                                            <div className="text-sm text-orange-700">Gross Margin</div>
                                            <div className="text-xs text-orange-600">Industry varies</div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Net Profit Margin:</span>
                                            <span className="font-bold">{netMargin.toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Return on Equity (ROE):</span>
                                            <span className="font-bold">{returnOnEquity.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center space-x-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>Financial Health Score</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {healthIndicators.map((indicator, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{indicator.name}</span>
                                                <Badge style={{ backgroundColor: indicator.color, color: 'white' }}>
                                                    {indicator.status}
                                                </Badge>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full"
                                                    style={{
                                                        backgroundColor: indicator.color,
                                                        width: `${Math.min((indicator.value / (indicator.name === 'Leverage' ? 2 : 20)) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs ${theme.textColors.secondary}">
                                                Current: {indicator.name === 'Profitability' ? `${indicator.value.toFixed(1)}%` : indicator.value.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Asset Allocation Pie Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Asset Allocation Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPieChart>
                                                <Pie
                                                    data={assetAllocationData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    dataKey="value"
                                                >
                                                    {assetAllocationData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                                                />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        {assetAllocationData.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div 
                                                        className="w-3 h-3 rounded-full" 
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="text-sm">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="cashflow" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Cash Flow Inputs */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>Cash Flow Projection</span>
                                </CardTitle>
                                <CardDescription>Project your cash flow for the next 12 months</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="initialCash">Initial Cash Balance</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="initialCash"
                                            type="number"
                                            value={initialCash}
                                            onChange={(e) => setInitialCash(Number(e.target.value))}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="monthlyRevenue"
                                            type="number"
                                            value={monthlyRevenue}
                                            onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="monthlyExpenses"
                                            type="number"
                                            value={monthlyExpenses}
                                            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    onClick={resetCashflow}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    Reset Values
                                </Button>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Monthly Cash Flow:</span>
                                        <span className={`font-bold ${monthlyRevenue - monthlyExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            ${(monthlyRevenue - monthlyExpenses).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Annual Cash Flow:</span>
                                        <span className={`font-bold ${(monthlyRevenue - monthlyExpenses) * 12 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            ${((monthlyRevenue - monthlyExpenses) * 12).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Cash at Year End:</span>
                                        <span className="font-bold">
                                            ${(initialCash + (monthlyRevenue - monthlyExpenses) * 12).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-navy-50 border border-navy-200 rounded-lg p-4">
                                    <h4 className="font-medium text-navy-900 mb-2">💡 Cash Flow Tips</h4>
                                    <ul className="text-sm text-navy-800 space-y-1">
                                        <li>• Maintain 3-6 months of expenses in cash reserves</li>
                                        <li>• Invoice promptly and follow up on late payments</li>
                                        <li>• Negotiate better payment terms with suppliers</li>
                                        <li>• Consider seasonal fluctuations in your business</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cash Flow Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                    <PieChart className="w-4 h-4" />
                                    <span>12-Month Cash Flow Projection</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={cashFlowData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                            <XAxis dataKey="month"  tick={{ fill: "#94a3b8" }} />
                                            <YAxis  tick={{ fill: "#94a3b8" }} />
                                            <Tooltip
                                                formatter={(value: number, name: string) => [
                                                    `$${value.toLocaleString()}`,
                                                    name === 'revenue' ? 'Revenue' :
                                                        name === 'expenses' ? 'Expenses' :
                                                            name === 'cashFlow' ? 'Net Cash Flow' : 'Cumulative Cash'
                                                ]}
                                            />
                                            <Bar dataKey="cumulativeCash" fill="#3b82f6" name="Cumulative Cash" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 ${theme.status.success.bg} rounded-lg">
                                        <div className="text-lg font-bold ${theme.status.success.text}">
                                            ${Math.max(...cashFlowData.map(d => d.cumulativeCash)).toLocaleString()}
                                        </div>
                                        <div className="text-sm ${theme.textColors.secondary}">Peak Cash Balance</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <div className="text-lg font-bold text-orange-900">
                                            ${Math.min(...cashFlowData.map(d => d.cumulativeCash)).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-orange-700">Lowest Cash Balance</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useProgressStore } from '@/lib/store/progressStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon, BarChart3, Target, DollarSign, Shield, Zap } from 'lucide-react';
import { theme } from '@/lib/theme';

interface Holding {
    symbol: string;
    name: string;
    amount: number;
    currentPrice: number;
    category: string;
}

interface PortfolioMetrics {
    totalValue: number;
    allocation: { [key: string]: number };
    riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
    diversificationScore: number;
    recommendedChanges: string[];
}

type AssetCategory = 'US Stocks' | 'International Stocks' | 'Bonds' | 'Real Estate' | 'Commodities' | 'Cash' | 'Crypto' | 'Other';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

const ASSET_CATEGORIES: AssetCategory[] = [
    'US Stocks',
    'International Stocks',
    'Bonds',
    'Real Estate',
    'Commodities',
    'Cash',
    'Crypto',
    'Other'
];

const SAMPLE_HOLDINGS = [
    { symbol: 'AAPL', name: 'Apple Inc.', amount: 50, currentPrice: 175.50, category: 'US Stocks' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', amount: 100, currentPrice: 220.75, category: 'US Stocks' },
    { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', amount: 75, currentPrice: 58.90, category: 'International Stocks' },
    { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', amount: 200, currentPrice: 76.25, category: 'Bonds' },
    { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', amount: 30, currentPrice: 82.40, category: 'Real Estate' }
];

export default function PortfolioAnalyzerCalculator() {
    const { recordCalculatorUsage } = useProgressStore();
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [newHolding, setNewHolding] = useState({
        symbol: '',
        name: '',
        amount: '',
        currentPrice: '',
        category: 'US Stocks'
    });
    const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
    const [targetAllocation, setTargetAllocation] = useState<Record<AssetCategory, number>>({
        'US Stocks': 60,
        'International Stocks': 20,
        'Bonds': 15,
        'Real Estate': 5,
        'Commodities': 0,
        'Cash': 0,
        'Crypto': 0,
        'Other': 0
    });

    useEffect(() => {
        recordCalculatorUsage('portfolio-analyzer');
    }, [recordCalculatorUsage]);

    const addHolding = () => {
        if (newHolding.symbol && newHolding.amount && newHolding.currentPrice) {
            const holding: Holding = {
                symbol: newHolding.symbol.toUpperCase(),
                name: newHolding.name || newHolding.symbol.toUpperCase(),
                amount: parseFloat(newHolding.amount),
                currentPrice: parseFloat(newHolding.currentPrice),
                category: newHolding.category
            };
            setHoldings([...holdings, holding]);
            setNewHolding({
                symbol: '',
                name: '',
                amount: '',
                currentPrice: '',
                category: 'US Stocks'
            });
        }
    };

    const removeHolding = (index: number) => {
        setHoldings(holdings.filter((_, i) => i !== index));
    };

    const loadSamplePortfolio = () => {
        setHoldings(SAMPLE_HOLDINGS);
    };

    const analyzePortfolio = () => {
        if (holdings.length === 0) return;

        const totalValue = holdings.reduce((sum, holding) => sum + (holding.amount * holding.currentPrice), 0);

        // Calculate allocation by category
        const allocation: { [key: string]: number } = {};
        holdings.forEach(holding => {
            const value = holding.amount * holding.currentPrice;
            const percentage = (value / totalValue) * 100;
            allocation[holding.category] = (allocation[holding.category] || 0) + percentage;
        });

        // Calculate diversification score (0-100)
        const numCategories = Object.keys(allocation).length;
        const maxCategories = ASSET_CATEGORIES.length;
        const categoryDiversification = (numCategories / maxCategories) * 50;

        const numHoldings = holdings.length;
        const holdingDiversification = Math.min((numHoldings / 20) * 50, 50);

        const diversificationScore = Math.round(categoryDiversification + holdingDiversification);

        // Determine risk level
        const stocksPercentage = (allocation['US Stocks'] || 0) + (allocation['International Stocks'] || 0) + (allocation['Crypto'] || 0);
        let riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
        if (stocksPercentage < 40) riskLevel = 'Conservative';
        else if (stocksPercentage < 70) riskLevel = 'Moderate';
        else riskLevel = 'Aggressive';

        // Generate recommendations
        const recommendations: string[] = [];

        if (diversificationScore < 50) {
            recommendations.push('Consider adding more asset categories to improve diversification');
        }

        if ((allocation['International Stocks'] || 0) < 15) {
            recommendations.push('Consider increasing international stock exposure for global diversification');
        }

        if ((allocation['Bonds'] || 0) < 10 && riskLevel === 'Aggressive') {
            recommendations.push('Consider adding bonds to reduce portfolio volatility');
        }

        if ((allocation['US Stocks'] || 0) > 70) {
            recommendations.push('High US stock concentration - consider rebalancing to reduce country risk');
        }

        if (holdings.length < 5) {
            recommendations.push('Consider adding more holdings to improve diversification');
        }

        if ((allocation['Cash'] || 0) > 10) {
            recommendations.push('High cash allocation may reduce long-term returns - consider investing');
        }

        setPortfolioMetrics({
            totalValue,
            allocation,
            riskLevel,
            diversificationScore,
            recommendedChanges: recommendations
        });
    };

    useEffect(() => {
        if (holdings.length > 0) {
            analyzePortfolio();
        } else {
            setPortfolioMetrics(null);
        }
    }, [holdings]); // eslint-disable-line react-hooks/exhaustive-deps

    const allocationData = portfolioMetrics ? Object.entries(portfolioMetrics.allocation).map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100
    })) : [];

    const targetVsActualData = ASSET_CATEGORIES.map(category => ({
        category,
        target: targetAllocation[category],
        actual: portfolioMetrics?.allocation[category] || 0
    })).filter(item => item.target > 0 || item.actual > 0);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Conservative': return theme.status.success.text;
            case 'Moderate': return theme.status.warning.text;
            case 'Aggressive': return theme.status.error.text;
            default: return theme.textColors.secondary;
        }
    };

    const getDiversificationColor = (score: number) => {
        if (score >= 80) return theme.status.success.text;
        if (score >= 60) return theme.status.warning.text;
        return theme.status.error.text;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>Portfolio Analyzer</h2>
                <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
                    Analyze your investment portfolio&apos;s allocation, diversification, and risk profile.
                    Get personalized recommendations to optimize your investment strategy.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className={`w-5 h-5 ${theme.status.info.text}`} />
                            Portfolio Holdings
                        </CardTitle>
                        <CardDescription>
                            Add your investment holdings to analyze your portfolio
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                                    Symbol/Ticker
                                </label>
                                <Input
                                    placeholder="AAPL, VTI, etc."
                                    value={newHolding.symbol}
                                    onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                                    Name (Optional)
                                </label>
                                <Input
                                    placeholder="Apple Inc."
                                    value={newHolding.name}
                                    onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                                    Shares/Units
                                </label>
                                <Input
                                    type="number"
                                    placeholder="100"
                                    value={newHolding.amount}
                                    onChange={(e) => setNewHolding({ ...newHolding, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                                    Current Price ($)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="150.00"
                                    value={newHolding.currentPrice}
                                    onChange={(e) => setNewHolding({ ...newHolding, currentPrice: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                                Asset Category
                            </label>
                            <select
                                className={`w-full p-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500`}
                                value={newHolding.category}
                                onChange={(e) => setNewHolding({ ...newHolding, category: e.target.value })}
                            >
                                {ASSET_CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={addHolding} className="flex-1">
                                Add Holding
                            </Button>
                            <Button variant="outline" onClick={loadSamplePortfolio}>
                                Load Sample
                            </Button>
                        </div>

                        {/* Holdings List */}
                        {holdings.length > 0 && (
                            <div className="space-y-2">
                                <h4 className={`font-medium ${theme.textColors.primary}`}>Current Holdings:</h4>
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                    {holdings.map((holding, index) => (
                                        <div key={index} className={`flex items-center justify-between p-2 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded`}>
                                            <div className="flex-1">
                                                <span className="font-medium">{holding.symbol}</span>
                                                <span className={`text-sm ${theme.textColors.secondary} ml-2`}>
                                                    {holding.amount} × ${holding.currentPrice} = ${(holding.amount * holding.currentPrice).toLocaleString()}
                                                </span>
                                                <div className={`text-xs ${theme.textColors.muted}`}>{holding.category}</div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeHolding(index)}
                                                className={`${theme.status.error.text} hover:${theme.textColors.secondary}`}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className={`w-5 h-5 ${theme.textColors.primary}`} />
                            Portfolio Analysis
                        </CardTitle>
                        <CardDescription>
                            Key metrics and recommendations for your portfolio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {portfolioMetrics ? (
                            <div className="space-y-6">
                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`text-center p-4 ${theme.status.info.bg} rounded-lg`}>
                                        <div className={`${theme.typography.heading2} ${theme.status.info.text}`}>
                                            ${portfolioMetrics.totalValue.toLocaleString()}
                                        </div>
                                        <div className={`text-sm ${theme.textColors.secondary}`}>Total Value</div>
                                    </div>
                                    <div className={`text-center p-4 ${theme.status.info.bg} rounded-lg`}>
                                        <div className={`${theme.typography.heading2} ${getRiskColor(portfolioMetrics.riskLevel)}`}>
                                            {portfolioMetrics.riskLevel}
                                        </div>
                                        <div className={`text-sm ${theme.textColors.secondary}`}>Risk Level</div>
                                    </div>
                                </div>

                                {/* Diversification Score */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Diversification Score</span>
                                        <span className={`text-sm font-medium ${getDiversificationColor(portfolioMetrics.diversificationScore)}`}>
                                            {portfolioMetrics.diversificationScore}/100
                                        </span>
                                    </div>
                                    <Progress value={portfolioMetrics.diversificationScore} className="h-2" />
                                    <div className={`text-xs ${theme.textColors.muted} mt-1`}>
                                        {portfolioMetrics.diversificationScore >= 80 ? 'Excellent' :
                                            portfolioMetrics.diversificationScore >= 60 ? 'Good' : 'Needs Improvement'}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                {portfolioMetrics.recommendedChanges.length > 0 && (
                                    <div>
                                        <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                                            <Zap className={`w-4 h-4 ${theme.status.warning.text}`} />
                                            Recommendations
                                        </h4>
                                        <ul className="space-y-1">
                                            {portfolioMetrics.recommendedChanges.map((rec, index) => (
                                                <li key={index} className={`text-sm ${theme.textColors.secondary} flex items-start gap-2`}>
                                                    <span className={`${theme.status.warning.text} mt-1`}>•</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`text-center py-8 ${theme.textColors.muted}`}>
                                <PieChartIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Add holdings to analyze your portfolio</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            {portfolioMetrics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Allocation Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChartIcon className={`w-5 h-5 ${theme.status.success.text}`} />
                                Asset Allocation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value?.toFixed(1)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Target vs Actual */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className={`w-5 h-5 ${theme.status.info.text}`} />
                                Target vs Actual Allocation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={targetVsActualData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} tick={{ fill: "#94a3b8" }} />
                                    <YAxis tick={{ fill: "#94a3b8" }} />
                                    <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                                    <Legend />
                                    <Bar dataKey="target" fill="#8884d8" name="Target %" />
                                    <Bar dataKey="actual" fill="#82ca9d" name="Actual %" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Target Allocation Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className={`w-5 h-5 ${theme.textColors.primary}`} />
                        Target Allocation Settings
                    </CardTitle>
                    <CardDescription>
                        Adjust your target allocation percentages for comparison
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ASSET_CATEGORIES.map(category => (
                            <div key={category}>
                                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                                    {category}
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={targetAllocation[category]}
                                        onChange={(e) => setTargetAllocation({
                                            ...targetAllocation,
                                            [category]: Number(e.target.value)
                                        })}
                                        className="w-16"
                                    />
                                    <span className={`text-sm ${theme.textColors.muted}`}>%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`mt-4 text-sm ${theme.textColors.secondary}`}>
                        Total: {Object.values(targetAllocation).reduce((sum, val) => sum + val, 0)}%
                    </div>
                </CardContent>
            </Card>

            {/* Educational Content */}
            <Card className="bg-gradient-to-r from-slate-50 to-violet-50">
                <CardContent className="p-6">
                    <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                        <Shield className={`w-5 h-5 ${theme.status.info.text}`} />
                        Portfolio Analysis Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Diversification Benefits</h4>
                            <p className={`${theme.textColors.primary}`}>
                                Spreading investments across different asset classes and sectors reduces risk
                                while maintaining growth potential. Aim for 8+ different holdings across 4+ categories.
                            </p>
                        </div>
                        <div>
                            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Risk Management</h4>
                            <p className={`${theme.textColors.primary}`}>
                                Conservative portfolios (30-50% stocks) offer stability, while aggressive portfolios
                                (70%+ stocks) provide higher growth potential with increased volatility.
                            </p>
                        </div>
                        <div>
                            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Rebalancing Strategy</h4>
                            <p className={`${theme.textColors.primary}`}>
                                Review your allocation quarterly and rebalance when any category drifts more than
                                5% from your target. This maintains your desired risk level and captures gains.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

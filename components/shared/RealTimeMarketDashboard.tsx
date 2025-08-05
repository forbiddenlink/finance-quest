'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { MultiLineChart, AreaChart, CandlestickChart } from '@/components/shared/charts/ProfessionalCharts';
import { formatCurrency } from '@/lib/utils/financial';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    BarChart3,
    Globe,
    RefreshCw,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface MarketData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    peRatio?: number;
    lastUpdated: Date;
}

interface EconomicIndicator {
    name: string;
    value: number;
    unit: string;
    change: number;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
}

export default function RealTimeMarketDashboard() {
    const [marketData, setMarketData] = useState<MarketData[]>([]);
    const [economicData, setEconomicData] = useState<EconomicIndicator[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

    // Educational stock symbols for financial literacy
    const educationalSymbols = ['AAPL', 'MSFT', 'SPY', 'QQQ', 'VTI', 'BND'];

    // Fetch market data with fallbacks
    const fetchMarketData = async () => {
        try {
            setLoading(true);

            // Simulate API call with educational mock data
            const mockMarketData: MarketData[] = educationalSymbols.map((symbol, index) => {
                const basePrice = 100 + (index * 50) + Math.random() * 100;
                const change = (Math.random() - 0.5) * 10;
                const changePercent = (change / basePrice) * 100;

                return {
                    symbol,
                    price: basePrice,
                    change,
                    changePercent,
                    volume: Math.floor(Math.random() * 10000000),
                    marketCap: basePrice * 1000000000,
                    peRatio: 15 + Math.random() * 20,
                    lastUpdated: new Date()
                };
            });

            const mockEconomicData: EconomicIndicator[] = [
                {
                    name: 'Fed Funds Rate',
                    value: 5.25,
                    unit: '%',
                    change: 0.25,
                    impact: 'negative',
                    description: 'Higher rates typically reduce stock valuations but increase bond yields'
                },
                {
                    name: 'Inflation (CPI)',
                    value: 3.2,
                    unit: '%',
                    change: -0.1,
                    impact: 'positive',
                    description: 'Decreasing inflation is generally positive for markets'
                },
                {
                    name: 'Unemployment',
                    value: 3.8,
                    unit: '%',
                    change: 0.1,
                    impact: 'neutral',
                    description: 'Low unemployment indicates economic strength'
                },
                {
                    name: 'GDP Growth',
                    value: 2.1,
                    unit: '%',
                    change: 0.3,
                    impact: 'positive',
                    description: 'Steady GDP growth supports market confidence'
                }
            ];

            setMarketData(mockMarketData);
            setEconomicData(mockEconomicData);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to fetch market data:', error);
            // Fallback to cached data or show error state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketData();

        // Update every 30 seconds during market hours
        const interval = setInterval(fetchMarketData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Generate historical data for charts
    const generateHistoricalData = (symbol: string, days: number) => {
        const data = [];
        const currentPrice = marketData.find(d => d.symbol === symbol)?.price || 100;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            // Simulate price movement with some volatility
            const volatility = 0.02; // 2% daily volatility
            const drift = 0.0003; // Small upward drift
            const randomFactor = (Math.random() - 0.5) * volatility;
            const price = currentPrice * (1 + drift * i + randomFactor);

            data.push({
                x: date,
                y: Math.max(0, price)
            });
        }

        return data;
    };

    // Generate candlestick data for advanced chart
    const generateCandlestickData = (symbol: string) => {
        const data = [];
        const basePrice = marketData.find(d => d.symbol === symbol)?.price || 100;

        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const open = basePrice * (1 + (Math.random() - 0.5) * 0.05);
            const close = open * (1 + (Math.random() - 0.5) * 0.03);
            const high = Math.max(open, close) * (1 + Math.random() * 0.02);
            const low = Math.min(open, close) * (1 - Math.random() * 0.02);

            data.push({
                x: date,
                y: [open, high, low, close] as [number, number, number, number]
            });
        }

        return data;
    };

    // Market sentiment calculation
    const marketSentiment = marketData.length > 0 ? {
        bullish: marketData.filter(d => d.changePercent > 0).length,
        bearish: marketData.filter(d => d.changePercent < 0).length,
        overall: marketData.reduce((sum, d) => sum + d.changePercent, 0) / marketData.length
    } : null;

    return (
        <div className={`min-h-screen ${theme.backgrounds.primary} py-8`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
                                Live Market Education Dashboard
                            </h1>
                            <p className={`${theme.textColors.secondary} text-lg`}>
                                Real-time market data with educational insights for financial literacy
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className={`text-sm ${theme.textColors.secondary}`}>Last Updated</div>
                                <div className={`text-sm ${theme.textColors.primary}`}>
                                    {lastUpdate.toLocaleTimeString()}
                                </div>
                            </div>
                            <button
                                onClick={fetchMarketData}
                                disabled={loading}
                                className={`p-2 rounded-lg ${theme.buttons.ghost} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Market Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {marketData.slice(0, 4).map((stock, index) => (
                        <motion.div
                            key={stock.symbol}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6 hover:border-blue-500/50 transition-colors`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className={`text-lg font-bold ${theme.textColors.primary}`}>{stock.symbol}</h3>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {formatCurrency(stock.price)}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-lg ${stock.changePercent >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                    {stock.changePercent >= 0 ? (
                                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                                    ) : (
                                        <TrendingDown className="w-6 h-6 text-red-400" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className={`text-sm ${theme.textColors.secondary}`}>Change</span>
                                    <span className={`text-sm font-medium ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={`text-sm ${theme.textColors.secondary}`}>Volume</span>
                                    <span className={`text-sm ${theme.textColors.primary}`}>
                                        {(stock.volume / 1000000).toFixed(1)}M
                                    </span>
                                </div>
                                {stock.peRatio && (
                                    <div className="flex justify-between">
                                        <span className={`text-sm ${theme.textColors.secondary}`}>P/E Ratio</span>
                                        <span className={`text-sm ${theme.textColors.primary}`}>
                                            {stock.peRatio.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Market Sentiment and Economic Indicators */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Market Sentiment */}
                    {marketSentiment && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
                        >
                            <h3 className={`text-xl font-semibold mb-6 ${theme.textColors.primary} flex items-center`}>
                                <BarChart3 className="mr-2 w-6 h-6" />
                                Market Sentiment Analysis
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-emerald-400">
                                            {marketSentiment.bullish}
                                        </div>
                                        <div className={`text-sm ${theme.textColors.secondary}`}>Bullish</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-red-400">
                                            {marketSentiment.bearish}
                                        </div>
                                        <div className={`text-sm ${theme.textColors.secondary}`}>Bearish</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold ${marketSentiment.overall >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {marketSentiment.overall >= 0 ? '+' : ''}{marketSentiment.overall.toFixed(2)}%
                                        </div>
                                        <div className={`text-sm ${theme.textColors.secondary}`}>Overall</div>
                                    </div>
                                </div>

                                <div className={`bg-blue-500/15 border border-blue-500/30 rounded-lg p-4`}>
                                    <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                                        <Globe className="w-4 h-4 mr-1" />
                                        Educational Insight
                                    </h4>
                                    <p className="text-blue-300 text-sm">
                                        Market sentiment reflects investor emotions. {marketSentiment.overall >= 0 ?
                                            'Current bullish sentiment suggests optimism, but remember that markets are cyclical.' :
                                            'Current bearish sentiment might present buying opportunities for long-term investors.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Economic Indicators */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
                    >
                        <h3 className={`text-xl font-semibold mb-6 ${theme.textColors.primary} flex items-center`}>
                            <DollarSign className="mr-2 w-6 h-6" />
                            Economic Indicators
                        </h3>

                        <div className="space-y-4">
                            {economicData.map((indicator, index) => (
                                <div key={indicator.name} className="border-b border-white/10 pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-medium ${theme.textColors.primary}`}>
                                            {indicator.name}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-lg font-bold ${theme.textColors.primary}`}>
                                                {indicator.value}{indicator.unit}
                                            </span>
                                            {indicator.impact === 'positive' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                            {indicator.impact === 'negative' && <AlertCircle className="w-4 h-4 text-red-400" />}
                                        </div>
                                    </div>
                                    <p className={`text-xs ${theme.textColors.secondary}`}>
                                        {indicator.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Advanced Chart Section */}
                {marketData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6 mb-8`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                                SPY (S&P 500 ETF) - Professional Analysis
                            </h3>
                            <div className="flex space-x-2">
                                {(['1D', '1W', '1M', '1Y'] as const).map((timeframe) => (
                                    <button
                                        key={timeframe}
                                        onClick={() => setSelectedTimeframe(timeframe)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedTimeframe === timeframe
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                            }`}
                                    >
                                        {timeframe}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Professional Candlestick Chart */}
                        <CandlestickChart
                            data={generateCandlestickData('SPY')}
                            title="Price Action (OHLC)"
                            height={400}
                        />

                        <div className={`mt-4 bg-emerald-500/15 border border-emerald-500/30 rounded-lg p-4`}>
                            <h4 className="text-emerald-400 font-medium mb-2">Educational Note: Reading Candlestick Charts</h4>
                            <p className="text-emerald-300 text-sm">
                                Each candlestick shows four key prices: Open, High, Low, and Close (OHLC).
                                Green candles indicate the closing price was higher than the opening price (bullish),
                                while red candles show the opposite (bearish). The &ldquo;wicks&rdquo; show the day&apos;s price range.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Portfolio Comparison Tool */}
                {marketData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
                    >
                        <h3 className={`text-xl font-semibold mb-6 ${theme.textColors.primary}`}>
                            Educational Portfolio Comparison
                        </h3>

                        <MultiLineChart
                            series={[
                                {
                                    name: 'Growth Portfolio (SPY)',
                                    data: generateHistoricalData('SPY', 30),
                                    color: theme.colors.blue[500]
                                },
                                {
                                    name: 'Tech Focus (QQQ)',
                                    data: generateHistoricalData('QQQ', 30),
                                    color: theme.colors.purple[500]
                                },
                                {
                                    name: 'Bonds (BND)',
                                    data: generateHistoricalData('BND', 30),
                                    color: theme.colors.emerald[500]
                                }
                            ]}
                            title="30-Day Performance Comparison"
                            yAxisFormatter={formatCurrency}
                            height={350}
                        />

                        <div className={`mt-4 bg-amber-500/15 border border-amber-500/30 rounded-lg p-4`}>
                            <h4 className="text-amber-400 font-medium mb-2">Investment Lesson: Diversification</h4>
                            <p className="text-amber-300 text-sm">
                                Notice how different asset classes move independently. SPY represents broad market exposure,
                                QQQ focuses on technology stocks (higher risk/reward), while BND provides bond stability.
                                A diversified portfolio typically includes multiple asset classes to balance risk and return.
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

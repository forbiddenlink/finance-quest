'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, RefreshCw, Globe, BarChart3, Target, Clock } from 'lucide-react';
import { theme } from '@/lib/theme';

interface StockQuote {
  symbol: string;
  companyName: string;
  latestPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
}

interface EconomicIndicator {
  date: string;
  value: number;
}

interface MarketData {
  stocks: StockQuote[];
  indices: {
    sp500: number;
    nasdaq: number;
    dow: number;
  };
  economicData: {
    fedFunds: EconomicIndicator[];
    inflation: EconomicIndicator[];
    unemployment: EconomicIndicator[];
  };
}

interface MarketSummary {
  totalMarketCap: number;
  averageChange: number;
  marketTrend: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
}

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/market-data');

      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.status}`);
      }

      const data: MarketData = await response.json();
      setMarketData(data);
      setLastUpdated(new Date());

      // Calculate market summary
      const summary = calculateMarketSummary(data);
      setMarketSummary(summary);

      if (!selectedStock && data.stocks.length > 0) {
        setSelectedStock(data.stocks[0]);
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [selectedStock]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const calculateMarketSummary = (data: MarketData): MarketSummary => {
    const totalMarketCap = data.stocks.reduce((sum, stock) => sum + stock.marketCap, 0);
    const averageChange = data.stocks.reduce((sum, stock) => sum + stock.changePercent, 0) / data.stocks.length;

    let marketTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (averageChange > 0.01) marketTrend = 'bullish';
    else if (averageChange < -0.01) marketTrend = 'bearish';

    const volatility = Math.sqrt(
      data.stocks.reduce((sum, stock) => sum + Math.pow(stock.changePercent - averageChange, 2), 0) / data.stocks.length
    );

    return {
      totalMarketCap,
      averageChange,
      marketTrend,
      volatility
    };
  };

  const formatCurrency = (value: number, compact = false) => {
    if (compact && value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (compact && value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (compact && value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} rounded-lg shadow-lg p-8`}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-gray-600">Loading real-time market data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} rounded-lg shadow-lg p-8`}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <p className="text-red-600 mb-4">Error loading market data: {error}</p>
            <button
              onClick={fetchMarketData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!marketData || !marketSummary) {
    return null;
  }

  const pieChartData = marketData.stocks.map(stock => ({
    name: stock.symbol,
    value: stock.marketCap,
    color: stock.changePercent >= 0 ? '#10B981' : '#EF4444'
  }));

  const economicChartData = marketData.economicData.fedFunds.map((fed, index) => ({
    date: fed.date,
    fedFunds: fed.value,
    inflation: marketData.economicData.inflation[index]?.value || 0
  }));

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} rounded-lg shadow-lg p-8`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2 flex items-center justify-center gap-3`}>
          <Globe className="w-8 h-8 text-blue-600" />
          Real-Time Market Dashboard
        </h2>
        <p className="text-gray-600">
          Live market data with educational insights • Powered by Alpha Vantage & FRED APIs
        </p>
        {lastUpdated && (
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-3 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Market Trend</h3>
          <p className={`text-2xl font-bold ${marketSummary.marketTrend === 'bullish' ? 'text-green-600' :
              marketSummary.marketTrend === 'bearish' ? 'text-red-600' : 'text-gray-600'
            }`}>
            {marketSummary.marketTrend.charAt(0).toUpperCase() + marketSummary.marketTrend.slice(1)}
          </p>
          <p className="text-sm text-blue-600">Overall Direction</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">Avg Change</h3>
          <p className={`text-2xl font-bold ${getChangeColor(marketSummary.averageChange)}`}>
            {formatPercent(marketSummary.averageChange)}
          </p>
          <p className="text-sm text-green-600">Portfolio Average</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
          <DollarSign className="w-8 h-8 mx-auto mb-3 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">Total Market Cap</h3>
          <p className="text-2xl font-bold text-purple-700">
            {formatCurrency(marketSummary.totalMarketCap, true)}
          </p>
          <p className="text-sm text-purple-600">Portfolio Value</p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 text-center">
          <Activity className="w-8 h-8 mx-auto mb-3 text-orange-600" />
          <h3 className="text-lg font-semibold text-orange-900">Volatility</h3>
          <p className="text-2xl font-bold text-orange-700">
            {formatPercent(marketSummary.volatility)}
          </p>
          <p className="text-sm text-orange-600">Risk Measure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Stock Performance Table */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>Stock Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme.borderColors.primary}`}>
                  <th className={`text-left py-3 px-2 font-semibold ${theme.textColors.secondary}`}>Symbol</th>
                  <th className={`text-right py-3 px-2 font-semibold ${theme.textColors.secondary}`}>Price</th>
                  <th className={`text-right py-3 px-2 font-semibold ${theme.textColors.secondary}`}>Change</th>
                  <th className={`text-right py-3 px-2 font-semibold ${theme.textColors.secondary}`}>%</th>
                </tr>
              </thead>
              <tbody>
                {marketData.stocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className={`border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors ${selectedStock?.symbol === stock.symbol ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <td className="py-3 px-2">
                      <div>
                        <div className={`font-semibold ${theme.textColors.primary}`}>{stock.symbol}</div>
                        <div className="text-xs text-gray-500 truncate max-w-32">
                          {stock.companyName}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2 font-mono">
                      {formatCurrency(stock.latestPrice)}
                    </td>
                    <td className={`text-right py-3 px-2 font-mono ${getChangeColor(stock.change)}`}>
                      {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                    </td>
                    <td className={`text-right py-3 px-2 font-mono ${getChangeColor(stock.changePercent)}`}>
                      <div className="flex items-center justify-end gap-1">
                        {getChangeIcon(stock.changePercent)}
                        {stock.changePercent >= 0 ? '+' : ''}{formatPercent(stock.changePercent)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Cap Distribution */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>Market Cap Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value, true)}
                  labelFormatter={(label) => `${label} Market Cap`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Economic Indicators */}
        <div className="xl:col-span-2 bg-gray-50 rounded-lg p-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>Economic Indicators</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={economicChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })} />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name === 'fedFunds' ? 'Fed Funds Rate' : 'Inflation Rate']}
                />
                <Line type="monotone" dataKey="fedFunds" stroke="#3B82F6" strokeWidth={2} name="Fed Funds Rate" />
                <Line type="monotone" dataKey="inflation" stroke="#EF4444" strokeWidth={2} name="Inflation Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Selected Stock Details */}
      {selectedStock && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
            <Target className="w-5 h-5 inline mr-2" />
            Focus Stock: {selectedStock.companyName} ({selectedStock.symbol})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Current Price</p>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>{formatCurrency(selectedStock.latestPrice)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Daily Change</p>
              <p className={`text-2xl font-bold ${getChangeColor(selectedStock.change)}`}>
                {selectedStock.change >= 0 ? '+' : ''}{formatCurrency(selectedStock.change)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Percentage Change</p>
              <p className={`text-2xl font-bold ${getChangeColor(selectedStock.changePercent)}`}>
                {selectedStock.changePercent >= 0 ? '+' : ''}{formatPercent(selectedStock.changePercent)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Market Cap</p>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {formatCurrency(selectedStock.marketCap, true)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Tips */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">💡 Market Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <h4 className="font-semibold mb-2">Understanding Market Trends</h4>
            <p>Market trends reflect overall investor sentiment. Bullish markets indicate optimism and rising prices, while bearish markets show pessimism and declining prices.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Economic Indicators Impact</h4>
            <p>Fed Funds Rate affects borrowing costs and investment returns. Higher inflation often leads to rate increases, impacting stock valuations and bond prices.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Diversification Strategy</h4>
            <p>The market cap distribution shows concentration risk. A diversified portfolio should include various sectors and company sizes to reduce volatility.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Long-Term Perspective</h4>
            <p>Daily market movements are normal. Focus on long-term trends and fundamentals rather than short-term price fluctuations for investment decisions.</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Market Data
        </button>
      </div>
    </div>
  );
}

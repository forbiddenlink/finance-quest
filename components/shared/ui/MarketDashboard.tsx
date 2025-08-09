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
    if (change > 0) return theme.status.success.text;
    if (change < 0) return theme.status.error.text;
    return theme.textColors.muted;
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
            <RefreshCw className={`w-8 h-8 mx-auto mb-4 ${theme.status.info.text} animate-spin`} />
            <p className={`${theme.textColors.secondary}`}>Loading real-time market data...</p>
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
            <AlertCircle className={`w-8 h-8 mx-auto mb-4 ${theme.status.error.text}`} />
            <p className={`${theme.status.error.text} mb-4`}>Error loading market data: {error}</p>
            <button
              onClick={fetchMarketData}
              className={`px-4 py-2 ${theme.status.info.bg.replace('/20', '')} ${theme.textColors.primary} rounded-lg hover:${theme.status.info.bg.replace('/20', '/80')} transition-colors`}
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
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} rounded-lg shadow-lg p-4 sm:p-6 lg:p-8`}>
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className={`text-2xl sm:text-3xl font-bold ${theme.textColors.primary} mb-2 flex items-center justify-center gap-2 sm:gap-3`}>
          <Globe className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.status.info.text}`} />
          Real-Time Market Dashboard
        </h2>
        <p className={`${theme.textColors.secondary} text-sm sm:text-base`}>
          Live market data with educational insights
          <span className="hidden sm:inline"> • Powered by Alpha Vantage & FRED APIs</span>
        </p>
        {lastUpdated && (
          <div className={`flex items-center justify-center gap-1.5 sm:gap-2 mt-2 text-xs sm:text-sm ${theme.textColors.muted}`}>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Market Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <div className={`bg-gradient-to-r ${theme.status.info.bg} rounded-lg p-3 sm:p-4 lg:p-6 text-center`}>
          <BarChart3 className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mx-auto mb-2 sm:mb-3 ${theme.status.info.text}`} />
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary}`}>Market Trend</h3>
          <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${marketSummary.marketTrend === 'bullish' ? theme.status.success.text :
              marketSummary.marketTrend === 'bearish' ? theme.status.error.text : theme.textColors.muted
            }`}>
            {marketSummary.marketTrend.charAt(0).toUpperCase() + marketSummary.marketTrend.slice(1)}
          </p>
          <p className={`text-xs sm:text-sm ${theme.status.info.text}`}>Overall Direction</p>
        </div>

        <div className={`bg-gradient-to-r ${theme.status.success.bg} rounded-lg p-3 sm:p-4 lg:p-6 text-center`}>
          <TrendingUp className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mx-auto mb-2 sm:mb-3 ${theme.status.success.text}`} />
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary}`}>Avg Change</h3>
          <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${getChangeColor(marketSummary.averageChange)}`}>
            {formatPercent(marketSummary.averageChange)}
          </p>
          <p className={`text-xs sm:text-sm ${theme.status.success.text}`}>Portfolio Average</p>
        </div>

        <div className={`bg-gradient-to-r ${theme.status.info.bg} rounded-lg p-3 sm:p-4 lg:p-6 text-center`}>
          <DollarSign className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mx-auto mb-2 sm:mb-3 ${theme.status.info.text}`} />
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary}`}>Total Market Cap</h3>
          <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme.status.info.text}`}>
            {formatCurrency(marketSummary.totalMarketCap, true)}
          </p>
          <p className={`text-xs sm:text-sm ${theme.status.info.text}`}>Portfolio Value</p>
        </div>

        <div className={`bg-gradient-to-r ${theme.status.warning.bg} rounded-lg p-3 sm:p-4 lg:p-6 text-center`}>
          <Activity className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mx-auto mb-2 sm:mb-3 ${theme.status.warning.text}`} />
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary}`}>Volatility</h3>
          <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme.status.warning.text}`}>
            {formatPercent(marketSummary.volatility)}
          </p>
          <p className={`text-xs sm:text-sm ${theme.status.warning.text}`}>Risk Measure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Stock Performance Table */}
        <div className={`${theme.backgrounds.cardHover} rounded-lg p-3 sm:p-4 lg:p-6`}>
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4`}>Stock Performance</h3>
          <div className="-mx-3 sm:mx-0 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className={`border-b ${theme.borderColors.primary}`}>
                  <th className={`text-left py-2 sm:py-3 px-3 sm:px-2 font-semibold text-xs sm:text-sm ${theme.textColors.secondary}`}>Symbol</th>
                  <th className={`text-right py-2 sm:py-3 px-3 sm:px-2 font-semibold text-xs sm:text-sm ${theme.textColors.secondary}`}>Price</th>
                  <th className={`text-right py-2 sm:py-3 px-3 sm:px-2 font-semibold text-xs sm:text-sm ${theme.textColors.secondary}`}>Change</th>
                  <th className={`text-right py-2 sm:py-3 px-3 sm:px-2 font-semibold text-xs sm:text-sm ${theme.textColors.secondary}`}>%</th>
                </tr>
              </thead>
              <tbody>
                {marketData.stocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className={`border-b ${theme.borderColors.muted} hover:${theme.backgrounds.cardHover} cursor-pointer transition-colors ${selectedStock?.symbol === stock.symbol ? theme.status.info.bg : ''
                      }`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <td className="py-2 sm:py-3 px-3 sm:px-2">
                      <div>
                        <div className={`font-semibold text-sm sm:text-base ${theme.textColors.primary}`}>{stock.symbol}</div>
                        <div className={`text-[10px] sm:text-xs ${theme.textColors.muted} truncate max-w-24 sm:max-w-32`}>
                          {stock.companyName}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-2 sm:py-3 px-3 sm:px-2 font-mono text-xs sm:text-sm">
                      {formatCurrency(stock.latestPrice)}
                    </td>
                    <td className={`text-right py-2 sm:py-3 px-3 sm:px-2 font-mono text-xs sm:text-sm ${getChangeColor(stock.change)}`}>
                      {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                    </td>
                    <td className={`text-right py-2 sm:py-3 px-3 sm:px-2 font-mono text-xs sm:text-sm ${getChangeColor(stock.changePercent)}`}>
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
        <div className={`${theme.backgrounds.cardHover} rounded-lg p-3 sm:p-4 lg:p-6`}>
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4`}>Market Cap Distribution</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={Math.min(80, window.innerWidth / 6)}
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
                  contentStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Economic Indicators */}
        <div className={`xl:col-span-2 ${theme.backgrounds.cardHover} rounded-lg p-3 sm:p-4 lg:p-6`}>
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4`}>Economic Indicators</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={economicChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name === 'fedFunds' ? 'Fed Funds Rate' : 'Inflation Rate']}
                  contentStyle={{ fontSize: '12px' }}
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
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-slate-50 to-slate-50 rounded-lg p-3 sm:p-4 lg:p-6">
          <h3 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2`}>
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">
              Focus Stock: {selectedStock.companyName} ({selectedStock.symbol})
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${theme.textColors.secondary}`}>Current Price</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme.textColors.primary}`}>{formatCurrency(selectedStock.latestPrice)}</p>
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${theme.textColors.secondary}`}>Daily Change</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${getChangeColor(selectedStock.change)}`}>
                {selectedStock.change >= 0 ? '+' : ''}{formatCurrency(selectedStock.change)}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${theme.textColors.secondary}`}>Percentage Change</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${getChangeColor(selectedStock.changePercent)}`}>
                {selectedStock.changePercent >= 0 ? '+' : ''}{formatPercent(selectedStock.changePercent)}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-xs sm:text-sm ${theme.textColors.secondary}`}>Market Cap</p>
              <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme.textColors.primary}`}>
                {formatCurrency(selectedStock.marketCap, true)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Tips */}
      <div className={`mt-6 sm:mt-8 ${theme.status.warning.bg} rounded-lg p-3 sm:p-4 lg:p-6`}>
        <h3 className={`text-base sm:text-lg font-semibold ${theme.status.warning.text} mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2`}>
          <span className="text-base sm:text-lg">💡</span>
          Market Insights
        </h3>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm ${theme.status.warning.text}`}>
          <div>
            <h4 className="font-semibold mb-1.5 sm:mb-2">Understanding Market Trends</h4>
            <p className="leading-relaxed">Market trends reflect overall investor sentiment. Bullish markets indicate optimism and rising prices, while bearish markets show pessimism and declining prices.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1.5 sm:mb-2">Economic Indicators Impact</h4>
            <p className="leading-relaxed">Fed Funds Rate affects borrowing costs and investment returns. Higher inflation often leads to rate increases, impacting stock valuations and bond prices.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1.5 sm:mb-2">Diversification Strategy</h4>
            <p className="leading-relaxed">The market cap distribution shows concentration risk. A diversified portfolio should include various sectors and company sizes to reduce volatility.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1.5 sm:mb-2">Long-Term Perspective</h4>
            <p className="leading-relaxed">Daily market movements are normal. Focus on long-term trends and fundamentals rather than short-term price fluctuations for investment decisions.</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-4 sm:mt-6 text-center">
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className={`px-4 sm:px-6 py-2 sm:py-3 ${theme.status.info.bg.replace('/20', '')} ${theme.textColors.primary} rounded-lg hover:${theme.status.info.bg.replace('/20', '/80')} disabled:opacity-50 transition-colors flex items-center gap-1.5 sm:gap-2 mx-auto text-sm sm:text-base`}
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Market Data
        </button>
      </div>
    </div>
  );
}

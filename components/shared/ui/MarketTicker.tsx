'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';

interface StockTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketDataResponse {
  success: boolean;
  data: Array<{
    symbol: string;
    latestPrice: number;
    change: number;
    changePercent: number;
  }> | {
    stocks?: Array<{
      symbol: string;
      latestPrice: number;
      change: number;
      changePercent: number;
    }>;
  };
  source: 'live' | 'fallback';
}

export default function MarketTicker() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stockData, setStockData] = useState<StockTicker[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch market data
  useEffect(() => {
    if (!mounted) return;

    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data?type=stocks');
        const result: MarketDataResponse = await response.json();

        if (result.success && result.data) {
          let stockArray: Array<{ symbol: string; latestPrice: number; change: number; changePercent: number }> = [];

          // Handle different response formats
          if (Array.isArray(result.data)) {
            stockArray = result.data;
          } else if (result.data.stocks) {
            stockArray = result.data.stocks;
          }

          if (stockArray.length > 0) {
            const formattedData: StockTicker[] = stockArray.map((stock) => ({
              symbol: stock.symbol || 'N/A',
              price: stock.latestPrice || 0,
              change: stock.change || 0,
              changePercent: (stock.changePercent || 0) * 100 // Convert decimal to percentage
            })).filter(stock => stock.symbol !== 'N/A' && stock.price > 0);

            if (formattedData.length > 0) {
              setStockData(formattedData);
              setIsLive(result.source === 'live');
            } else {
              // Use fallback data if no valid stocks
              setStockData([
                { symbol: 'SPY', price: 485.25, change: 4.15, changePercent: 0.86 },
                { symbol: 'AAPL', price: 195.50, change: 2.35, changePercent: 1.22 },
                { symbol: 'MSFT', price: 420.85, change: -1.25, changePercent: -0.30 },
                { symbol: 'GOOGL', price: 142.30, change: 1.85, changePercent: 1.32 },
                { symbol: 'TSLA', price: 248.50, change: -3.20, changePercent: -1.27 },
                { symbol: 'AMZN', price: 186.90, change: 2.10, changePercent: 1.14 }
              ]);
              setIsLive(false);
            }
          } else {
            // Use fallback data
            setStockData([
              { symbol: 'SPY', price: 485.25, change: 4.15, changePercent: 0.86 },
              { symbol: 'AAPL', price: 195.50, change: 2.35, changePercent: 1.22 },
              { symbol: 'MSFT', price: 420.85, change: -1.25, changePercent: -0.30 }
            ]);
            setIsLive(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
        // Use fallback data
        setStockData([
          { symbol: 'SPY', price: 485.25, change: 4.15, changePercent: 0.86 },
          { symbol: 'AAPL', price: 195.50, change: 2.35, changePercent: 1.22 },
          { symbol: 'MSFT', price: 420.85, change: -1.25, changePercent: -0.30 },
          { symbol: 'GOOGL', price: 142.30, change: 1.85, changePercent: 1.32 },
          { symbol: 'TSLA', price: 248.50, change: -3.20, changePercent: -1.27 },
          { symbol: 'AMZN', price: 186.90, change: 2.10, changePercent: 1.14 }
        ]);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();

    // Update every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Rotate through stocks
  useEffect(() => {
    if (!mounted || stockData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stockData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [mounted, stockData.length]);

  if (!mounted || isLoading || stockData.length === 0) {
    return (
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-lg shadow-lg animate-pulse">
        <div className="h-16 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const currentStock = stockData[currentIndex];
  if (!currentStock) {
    return (
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white rounded-xl shadow-lg border border-amber-500/20 min-w-[280px] max-w-[320px] animate-pulse">
        <div className="p-3">
          <div className="h-4 bg-slate-700 rounded mb-2"></div>
          <div className="h-6 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const isPositive = (currentStock.change || 0) >= 0;

  return (
    <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white rounded-xl shadow-lg overflow-hidden relative border border-amber-500/20 min-w-[280px] max-w-[320px]">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-r from-amber-500/30 to-blue-500/30"></div>
      </div>

      <div className="relative z-10 p-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-300 font-semibold">Market Pulse</span>
            {isLive ? (
              <Wifi className="w-3 h-3 text-amber-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-amber-400/60" />
            )}
          </div>
          <div className="text-xs text-slate-400">
            {isLive ? 'Live' : 'Demo'}
          </div>
        </div>

        {/* Main Content Row */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-lg font-bold text-white tracking-wider">
              {currentStock.symbol}
            </div>
            <div className="text-sm font-semibold text-slate-300">
              ${(currentStock.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${isPositive
            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
            : 'bg-red-500/15 text-red-400 border border-red-500/20'
            }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {isPositive ? '+' : ''}{(currentStock.change || 0).toFixed(2)}
            </span>
            <span className="text-xs opacity-80">
              ({isPositive ? '+' : ''}{(currentStock.changePercent || 0).toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex space-x-1 mt-2 justify-center">
          {stockData.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-amber-400 w-4'
                : 'bg-slate-600 w-2'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

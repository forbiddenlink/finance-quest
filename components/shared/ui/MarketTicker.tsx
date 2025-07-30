'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wifi, WifiOff } from 'lucide-react';

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
          let stockArray: Array<{symbol: string; latestPrice: number; change: number; changePercent: number}> = [];
          
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
              changePercent: (stock.changePercent || 0) * 100 // Convert to percentage
            })).filter(stock => stock.symbol !== 'N/A' && stock.price > 0);
            
            if (formattedData.length > 0) {
              setStockData(formattedData);
              setIsLive(result.source === 'live');
            } else {
              // Use fallback data if no valid stocks
              setStockData([
                { symbol: 'SPY', price: 485.25, change: 4.15, changePercent: 0.86 },
                { symbol: 'AAPL', price: 195.50, change: 2.35, changePercent: 1.22 },
                { symbol: 'MSFT', price: 420.85, change: -1.25, changePercent: -0.30 }
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
          { symbol: 'MSFT', price: 420.85, change: -1.25, changePercent: -0.30 }
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
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-lg shadow-lg animate-pulse">
        <div className="h-16 bg-slate-700 rounded"></div>
      </div>
    );
  }
  
  const isPositive = (currentStock.change || 0) >= 0;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-lg shadow-lg overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300 font-medium">Market Pulse</span>
            {isLive ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <div className="text-xs text-gray-400">
            {isLive ? 'Live' : 'Demo'} • {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentStock.symbol}
            </div>
            <div className="text-lg font-semibold">
              ${(currentStock.price || 0).toLocaleString()}
            </div>
          </div>

          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isPositive
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
            }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{(currentStock.change || 0).toFixed(2)}
            </span>
            <span className="text-sm">
              ({isPositive ? '+' : ''}{(currentStock.changePercent || 0).toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-1 mt-3 justify-center">
          {stockData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-blue-400 w-6'
                  : 'bg-gray-600'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 animate-gradient opacity-50"></div>
    </div>
  );
}

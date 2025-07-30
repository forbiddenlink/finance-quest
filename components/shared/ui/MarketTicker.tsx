'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface StockTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// Simulated stock data (in a real app, this would come from an API)
const mockStockData: StockTicker[] = [
  { symbol: 'SPY', price: 445.32, change: 2.47, changePercent: 0.56 },
  { symbol: 'QQQ', price: 378.91, change: -1.23, changePercent: -0.32 },
  { symbol: 'BTC', price: 43250, change: 1250, changePercent: 2.98 },
  { symbol: 'AAPL', price: 189.45, change: 0.87, changePercent: 0.46 },
  { symbol: 'TSLA', price: 248.50, change: -3.21, changePercent: -1.27 },
  { symbol: 'NVDA', price: 875.30, change: 15.40, changePercent: 1.79 },
];

export default function MarketTicker() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockStockData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [mounted]);

  const currentStock = mockStockData[currentIndex];
  const isPositive = currentStock.change >= 0;

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
          </div>
          <div className="text-xs text-gray-400">
            Live • {mounted ? new Date().toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
        
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {currentStock.symbol}
            </div>
            <div className="text-lg font-semibold">
              ${currentStock.price.toLocaleString()}
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isPositive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {isPositive ? '+' : ''}{currentStock.change.toFixed(2)}
            </span>
            <span className="text-sm">
              ({isPositive ? '+' : ''}{currentStock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        {/* Progress Dots */}
        <div className="flex space-x-1 mt-3 justify-center">
          {mockStockData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
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

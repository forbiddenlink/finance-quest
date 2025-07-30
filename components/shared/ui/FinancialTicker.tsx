'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function FinancialTicker() {
  const [tickerData] = useState<TickerItem[]>([
    { symbol: 'S&P 500', price: 4750.23, change: 45.67, changePercent: 0.97 },
    { symbol: 'DOW', price: 37249.50, change: -123.45, changePercent: -0.33 },
    { symbol: 'NASDAQ', price: 14567.89, change: 89.12, changePercent: 0.62 },
    { symbol: 'AAPL', price: 185.42, change: 2.34, changePercent: 1.28 },
    { symbol: 'MSFT', price: 412.78, change: -3.21, changePercent: -0.77 },
    { symbol: 'GOOGL', price: 139.45, change: 1.87, changePercent: 1.36 },
    { symbol: 'BTC', price: 67234.12, change: 1234.56, changePercent: 1.87 },
    { symbol: 'ETH', price: 3456.78, change: -89.34, changePercent: -2.52 }
  ]);

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden relative">
      <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap">
        {tickerData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 min-w-max">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="font-semibold">{item.symbol}</span>
            <span className="text-gray-300">${item.price.toLocaleString()}</span>
            <div className={`flex items-center space-x-1 ${
              item.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {item.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-sm">
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

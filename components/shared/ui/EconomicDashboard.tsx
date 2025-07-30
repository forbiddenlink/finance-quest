'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EconomicData {
  fedFunds: Array<{ date: string; value: number }>;
  inflation: Array<{ date: string; value: number }>;
  indices: {
    sp500: number;
    nasdaq: number;
    dow: number;
  };
}

interface MarketDataResponse {
  success: boolean;
  data: EconomicData;
  source: 'live' | 'fallback';
}

export default function EconomicDashboard() {
  const [economicData, setEconomicData] = useState<EconomicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState<'interest' | 'inflation' | 'markets'>('interest');

  useEffect(() => {
    const fetchEconomicData = async () => {
      try {
        const response = await fetch('/api/market-data?type=full');
        const result: MarketDataResponse = await response.json();
        
        if (result.success) {
          setEconomicData(result.data);
          setIsLive(result.source === 'live');
        }
      } catch (error) {
        console.error('Failed to fetch economic data:', error);
        // Fallback data
        setEconomicData({
          fedFunds: [
            { date: '2025-03', value: 4.75 },
            { date: '2025-04', value: 5.00 },
            { date: '2025-05', value: 5.25 },
            { date: '2025-06', value: 5.25 },
          ],
          inflation: [
            { date: '2025-03', value: 3.0 },
            { date: '2025-04', value: 3.1 },
            { date: '2025-05', value: 3.4 },
            { date: '2025-06', value: 3.2 },
          ],
          indices: {
            sp500: 485.25,
            nasdaq: 375.80,
            dow: 340.15
          }
        });
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEconomicData();
    
    // Update every 5 minutes
    const interval = setInterval(fetchEconomicData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !economicData) {
    return (
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="h-64 bg-gray-200 rounded"></div>
      </motion.div>
    );
  }

  const currentFedRate = economicData?.fedFunds?.length > 0 
    ? economicData.fedFunds[economicData.fedFunds.length - 1]?.value || 0 
    : 0;
  const currentInflation = economicData?.inflation?.length > 0 
    ? economicData.inflation[economicData.inflation.length - 1]?.value || 0 
    : 0;

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Economic Dashboard</h3>
            <p className="text-sm text-gray-500">
              {isLive ? 'Live Federal Reserve Data' : 'Demo Data'} • Updated {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isLive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {isLive ? '🟢 Live Data' : '🟡 Demo Mode'}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Fed Funds Rate</p>
              <p className="text-2xl font-bold text-blue-900">{currentFedRate.toFixed(2)}%</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Inflation Rate</p>
              <p className="text-2xl font-bold text-red-900">{currentInflation.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">S&P 500</p>
              <p className="text-2xl font-bold text-green-900">${(economicData?.indices?.sp500 || 0).toFixed(0)}</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {[
          { key: 'interest', label: 'Interest Rates', icon: DollarSign },
          { key: 'inflation', label: 'Inflation', icon: TrendingUp },
          { key: 'markets', label: 'Market Indices', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-64">
        {activeTab === 'interest' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={economicData?.fedFunds || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs text-gray-600"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs text-gray-600"
                tick={{ fontSize: 12 }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}%`, 'Fed Funds Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'inflation' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={economicData?.inflation || []}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-xs text-gray-600"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs text-gray-600"
                tick={{ fontSize: 12 }}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}%`, 'Inflation Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'markets' && (
          <div className="h-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <motion.div
                className="text-center bg-blue-50 p-6 rounded-lg border border-blue-200"
                whileHover={{ scale: 1.05 }}
              >
                <PieChart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-blue-700 mb-1">S&P 500</p>
                <p className="text-xl font-bold text-blue-900">${(economicData?.indices?.sp500 || 0).toFixed(0)}</p>
              </motion.div>
              <motion.div
                className="text-center bg-purple-50 p-6 rounded-lg border border-purple-200"
                whileHover={{ scale: 1.05 }}
              >
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-sm font-medium text-purple-700 mb-1">NASDAQ</p>
                <p className="text-xl font-bold text-purple-900">${(economicData?.indices?.nasdaq || 0).toFixed(0)}</p>
              </motion.div>
              <motion.div
                className="text-center bg-green-50 p-6 rounded-lg border border-green-200"
                whileHover={{ scale: 1.05 }}
              >
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-green-700 mb-1">Dow Jones</p>
                <p className="text-xl font-bold text-green-900">${(economicData?.indices?.dow || 0).toFixed(0)}</p>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Educational Note */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Educational Context:</strong> These economic indicators directly impact your personal finances. 
          Higher interest rates affect loan costs and savings returns, while inflation erodes purchasing power. 
          Understanding these trends helps make better financial decisions.
        </p>
      </div>
    </motion.div>
  );
}

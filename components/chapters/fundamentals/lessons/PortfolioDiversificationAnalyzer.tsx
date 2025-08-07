'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  PieChart as PieChartIcon,
  Target,
  Globe,
  Building,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  DollarSign,
  Info,
  Plus,
  Minus,
  RotateCcw,
  Star
} from 'lucide-react';
import { PieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Pie } from 'recharts';
import toast from 'react-hot-toast';

interface Holding {
  symbol: string;
  name: string;
  value: number;
  assetClass: 'US_STOCKS' | 'INTL_STOCKS' | 'BONDS' | 'REITS' | 'COMMODITIES' | 'CASH';
  sector: 'TECH' | 'FINANCE' | 'HEALTHCARE' | 'CONSUMER' | 'ENERGY' | 'UTILITIES' | 'GOVERNMENT' | 'REAL_ESTATE' | 'MATERIALS';
  region: 'US' | 'DEVELOPED' | 'EMERGING' | 'GLOBAL';
}

interface DiversificationScore {
  overall: number;
  assetClass: number;
  geographic: number;
  sector: number;
  concentration: number;
}

const assetClassConfig = {
  US_STOCKS: { name: 'US Stocks', color: '#3B82F6', targetMin: 40, targetMax: 70 },
  INTL_STOCKS: { name: 'International Stocks', color: '#10B981', targetMin: 15, targetMax: 30 },
  BONDS: { name: 'Bonds', color: '#F59E0B', targetMin: 20, targetMax: 40 },
  REITS: { name: 'REITs', color: '#8B5CF6', targetMin: 5, targetMax: 15 },
  COMMODITIES: { name: 'Commodities', color: '#EF4444', targetMin: 0, targetMax: 10 },
  CASH: { name: 'Cash', color: '#6B7280', targetMin: 0, targetMax: 10 }
};

const sectorConfig = {
  TECH: { name: 'Technology', color: '#3B82F6' },
  FINANCE: { name: 'Financial', color: '#10B981' },
  HEALTHCARE: { name: 'Healthcare', color: '#F59E0B' },
  CONSUMER: { name: 'Consumer', color: '#8B5CF6' },
  ENERGY: { name: 'Energy', color: '#EF4444' },
  UTILITIES: { name: 'Utilities', color: '#06B6D4' },
  GOVERNMENT: { name: 'Government', color: '#6B7280' },
  REAL_ESTATE: { name: 'Real Estate', color: '#EC4899' },
  MATERIALS: { name: 'Materials', color: '#84CC16' }
};

const defaultHoldings: Holding[] = [
  { symbol: 'VTI', name: 'Vanguard Total Stock Market', value: 35000, assetClass: 'US_STOCKS', sector: 'TECH', region: 'US' },
  { symbol: 'VTIAX', name: 'Vanguard Total International Stock', value: 15000, assetClass: 'INTL_STOCKS', sector: 'FINANCE', region: 'DEVELOPED' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market', value: 20000, assetClass: 'BONDS', sector: 'GOVERNMENT', region: 'US' },
  { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', value: 8000, assetClass: 'REITS', sector: 'REAL_ESTATE', region: 'US' },
  { symbol: 'AAPL', name: 'Apple Inc.', value: 12000, assetClass: 'US_STOCKS', sector: 'TECH', region: 'US' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', value: 8000, assetClass: 'US_STOCKS', sector: 'TECH', region: 'US' },
  { symbol: 'CASH', name: 'High-Yield Savings', value: 2000, assetClass: 'CASH', sector: 'FINANCE', region: 'US' }
];

export default function PortfolioDiversificationAnalyzer() {
  const { recordCalculatorUsage } = useProgressStore();
  const [holdings, setHoldings] = useState<Holding[]>(defaultHoldings);
  const [newHolding, setNewHolding] = useState<Partial<Holding>>({
    symbol: '',
    name: '',
    value: 0,
    assetClass: 'US_STOCKS',
    sector: 'TECH',
    region: 'US'
  });

  useEffect(() => {
    recordCalculatorUsage('portfolio-diversification-analyzer');
  }, [recordCalculatorUsage]);

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  const calculateDiversificationScore = (): DiversificationScore => {
    if (totalValue === 0) return { overall: 0, assetClass: 0, geographic: 0, sector: 0, concentration: 0 };

    // Asset Class Diversification (40% of score)
    const assetClassAllocations = Object.keys(assetClassConfig).map(assetClass => {
      const value = holdings
        .filter(h => h.assetClass === assetClass)
        .reduce((sum, h) => sum + h.value, 0);
      return value / totalValue * 100;
    });
    
    const assetClassHHI = assetClassAllocations.reduce((sum, allocation) => sum + Math.pow(allocation, 2), 0);
    const assetClassScore = Math.max(0, 100 - (assetClassHHI - 1667) / 33.33); // Normalized to 0-100

    // Geographic Diversification (25% of score)
    const regionAllocations = ['US', 'DEVELOPED', 'EMERGING', 'GLOBAL'].map(region => {
      const value = holdings
        .filter(h => h.region === region)
        .reduce((sum, h) => sum + h.value, 0);
      return value / totalValue * 100;
    });
    
    const regionHHI = regionAllocations.reduce((sum, allocation) => sum + Math.pow(allocation, 2), 0);
    const geographicScore = Math.max(0, 100 - (regionHHI - 2500) / 25); // Normalized

    // Sector Diversification (25% of score)
    const sectorAllocations = Object.keys(sectorConfig).map(sector => {
      const value = holdings
        .filter(h => h.sector === sector)
        .reduce((sum, h) => sum + h.value, 0);
      return value / totalValue * 100;
    });
    
    const sectorHHI = sectorAllocations.reduce((sum, allocation) => sum + Math.pow(allocation, 2), 0);
    const sectorScore = Math.max(0, 100 - (sectorHHI - 1111) / 22.22); // Normalized

    // Concentration Risk (10% of score)
    const largestHolding = Math.max(...holdings.map(h => h.value / totalValue * 100));
    const concentrationScore = Math.max(0, 100 - (largestHolding - 5) * 2); // Penalty for >5% positions

    // Overall weighted score
    const overall = (assetClassScore * 0.4 + geographicScore * 0.25 + sectorScore * 0.25 + concentrationScore * 0.1);

    return {
      overall: Math.round(overall),
      assetClass: Math.round(assetClassScore),
      geographic: Math.round(geographicScore),
      sector: Math.round(sectorScore),
      concentration: Math.round(concentrationScore)
    };
  };

  const getAssetClassData = () => {
    const assetClasses = Object.entries(assetClassConfig).map(([key, config]) => {
      const value = holdings
        .filter(h => h.assetClass === key)
        .reduce((sum, h) => sum + h.value, 0);
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
      
      return {
        name: config.name,
        value: percentage,
        amount: value,
        color: config.color,
        targetMin: config.targetMin,
        targetMax: config.targetMax,
        inTarget: percentage >= config.targetMin && percentage <= config.targetMax
      };
    }).filter(item => item.value > 0);

    return assetClasses;
  };

  const getSectorData = () => {
    const sectors = Object.entries(sectorConfig).map(([key, config]) => {
      const value = holdings
        .filter(h => h.sector === key)
        .reduce((sum, h) => sum + h.value, 0);
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
      
      return {
        name: config.name,
        value: percentage,
        amount: value,
        color: config.color
      };
    }).filter(item => item.value > 0);

    return sectors;
  };

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.name || !newHolding.value) {
      toast.error('Please fill in all fields');
      return;
    }

    const holding: Holding = {
      symbol: newHolding.symbol!.toUpperCase(),
      name: newHolding.name!,
      value: newHolding.value!,
      assetClass: newHolding.assetClass!,
      sector: newHolding.sector!,
      region: newHolding.region!
    };

    setHoldings([...holdings, holding]);
    setNewHolding({
      symbol: '',
      name: '',
      value: 0,
      assetClass: 'US_STOCKS',
      sector: 'TECH',
      region: 'US'
    });
    toast.success('Holding added successfully! 📊');
  };

  const removeHolding = (index: number) => {
    const newHoldings = holdings.filter((_, i) => i !== index);
    setHoldings(newHoldings);
    toast.success('Holding removed');
  };

  const resetToDefault = () => {
    setHoldings(defaultHoldings);
    toast.success('Reset to sample portfolio! 🔄');
  };

  const diversificationScore = calculateDiversificationScore();
  const assetClassData = getAssetClassData();
  const sectorData = getSectorData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.status.success.text;
    if (score >= 60) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return theme.status.success.bg;
    if (score >= 60) return theme.status.warning.bg;
    return theme.status.error.bg;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`${theme.status.info.bg} p-3 rounded-lg`}>
              <PieChartIcon className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Portfolio Diversification Analyzer
              </h2>
              <p className={`${theme.textColors.secondary}`}>
                Analyze your portfolio&apos;s diversification across asset classes, sectors, and geographic regions
              </p>
            </div>
          </div>
          
          <button
            onClick={resetToDefault}
            className={`flex items-center gap-2 px-4 py-2 border ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Sample
          </button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
            <DollarSign className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.info.text}`}>
              {formatCurrency(totalValue)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Total Value</div>
          </div>
          
          <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
            <Target className={`w-6 h-6 ${theme.status.success.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.success.text}`}>
              {holdings.length}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Holdings</div>
          </div>
          
          <div className={`p-4 ${getScoreBackground(diversificationScore.overall)} rounded-lg text-center`}>
            <Star className={`w-6 h-6 ${getScoreColor(diversificationScore.overall)} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${getScoreColor(diversificationScore.overall)}`}>
              {diversificationScore.overall}/100
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Diversification Score</div>
          </div>
          
          <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
            <Globe className={`w-6 h-6 ${theme.status.warning.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.warning.text}`}>
              {Math.round((holdings.filter(h => h.region !== 'US').reduce((sum, h) => sum + h.value, 0) / totalValue) * 100)}%
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>International</div>
          </div>
        </div>
      </div>

      {/* Diversification Scores */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5" />
          Diversification Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-4 ${getScoreBackground(diversificationScore.assetClass)} rounded-lg`}>
            <h4 className={`font-semibold ${getScoreColor(diversificationScore.assetClass)} mb-2`}>
              Asset Class Diversification
            </h4>
            <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.assetClass)} mb-2`}>
              {diversificationScore.assetClass}/100
            </div>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Spread across stocks, bonds, REITs, commodities
            </p>
          </div>
          
          <div className={`p-4 ${getScoreBackground(diversificationScore.geographic)} rounded-lg`}>
            <h4 className={`font-semibold ${getScoreColor(diversificationScore.geographic)} mb-2`}>
              Geographic Diversification
            </h4>
            <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.geographic)} mb-2`}>
              {diversificationScore.geographic}/100
            </div>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Exposure to US, developed, emerging markets
            </p>
          </div>
          
          <div className={`p-4 ${getScoreBackground(diversificationScore.sector)} rounded-lg`}>
            <h4 className={`font-semibold ${getScoreColor(diversificationScore.sector)} mb-2`}>
              Sector Diversification
            </h4>
            <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.sector)} mb-2`}>
              {diversificationScore.sector}/100
            </div>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Spread across technology, healthcare, finance
            </p>
          </div>
          
          <div className={`p-4 ${getScoreBackground(diversificationScore.concentration)} rounded-lg`}>
            <h4 className={`font-semibold ${getScoreColor(diversificationScore.concentration)} mb-2`}>
              Concentration Risk
            </h4>
            <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.concentration)} mb-2`}>
              {diversificationScore.concentration}/100
            </div>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              No single holding dominates portfolio
            </p>
          </div>
        </div>
        
        {/* Score Interpretation */}
        <div className={`mt-6 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <Info className={`w-4 h-4 ${theme.status.info.text}`} />
            <span className={`text-sm font-medium ${theme.status.info.text}`}>Score Interpretation</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className={`font-medium ${theme.status.success.text}`}>80-100: Excellent</span>
              <p className={`${theme.textColors.secondary}`}>Well-diversified portfolio</p>
            </div>
            <div>
              <span className={`font-medium ${theme.status.warning.text}`}>60-79: Good</span>
              <p className={`${theme.textColors.secondary}`}>Room for improvement</p>
            </div>
            <div>
              <span className={`font-medium ${theme.status.error.text}`}>Below 60: Poor</span>
              <p className={`${theme.textColors.secondary}`}>Concentration risk present</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Class Allocation */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <PieChartIcon className="w-5 h-5" />
            Asset Class Allocation
          </h3>
          
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetClassData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assetClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']}
                  labelFormatter={(label) => `${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {assetClassData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                    aria-label={`${item.name} color indicator`}
                  />
                  <span className={`text-sm ${theme.textColors.primary}`}>{item.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${theme.textColors.primary}`}>
                    {item.value.toFixed(1)}%
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Allocation */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Building className="w-5 h-5" />
            Sector Allocation
          </h3>
          
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Target className="w-5 h-5" />
          Portfolio Holdings
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme.borderColors.primary}`}>
                <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-medium`}>Symbol</th>
                <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-medium`}>Name</th>
                <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-medium`}>Value</th>
                <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-medium`}>%</th>
                <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-medium`}>Asset Class</th>
                <th className={`text-left py-3 px-4 ${theme.textColors.primary} font-medium`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index} className={`border-b ${theme.borderColors.muted}`}>
                  <td className={`py-3 px-4 font-medium ${theme.textColors.primary}`}>
                    {holding.symbol}
                  </td>
                  <td className={`py-3 px-4 ${theme.textColors.secondary}`}>
                    {holding.name}
                  </td>
                  <td className={`py-3 px-4 ${theme.textColors.primary}`}>
                    {formatCurrency(holding.value)}
                  </td>
                  <td className={`py-3 px-4 ${theme.textColors.primary}`}>
                    {((holding.value / totalValue) * 100).toFixed(1)}%
                  </td>
                  <td className={`py-3 px-4 ${theme.textColors.secondary}`}>
                    {assetClassConfig[holding.assetClass].name}
                  </td>
                  <td className={`py-3 px-4`}>
                    <button
                      onClick={() => removeHolding(index)}
                      className={`p-1 text-red-400 hover:text-red-300 transition-colors`}
                      title={`Remove ${holding.symbol} from portfolio`}
                      aria-label={`Remove ${holding.symbol} holding`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Holding */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Plus className="w-5 h-5" />
          Add New Holding
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Symbol
            </label>
            <input
              type="text"
              value={newHolding.symbol}
              onChange={(e) => setNewHolding({...newHolding, symbol: e.target.value})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              placeholder="VTI"
              title="Enter ticker symbol"
              aria-label="Ticker symbol"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Name
            </label>
            <input
              type="text"
              value={newHolding.name}
              onChange={(e) => setNewHolding({...newHolding, name: e.target.value})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              placeholder="Total Stock Market ETF"
              title="Enter holding name"
              aria-label="Holding name"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Value ($)
            </label>
            <input
              type="number"
              value={newHolding.value}
              onChange={(e) => setNewHolding({...newHolding, value: parseFloat(e.target.value) || 0})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              placeholder="10000"
              title="Enter holding value"
              aria-label="Holding value"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Asset Class
            </label>
            <select
              value={newHolding.assetClass}
              onChange={(e) => setNewHolding({...newHolding, assetClass: e.target.value as Holding['assetClass']})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              title="Select asset class"
              aria-label="Asset class"
            >
              {Object.entries(assetClassConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Sector
            </label>
            <select
              value={newHolding.sector}
              onChange={(e) => setNewHolding({...newHolding, sector: e.target.value as Holding['sector']})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              title="Select sector"
              aria-label="Sector"
            >
              {Object.entries(sectorConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Region
            </label>
            <select
              value={newHolding.region}
              onChange={(e) => setNewHolding({...newHolding, region: e.target.value as Holding['region']})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              title="Select region"
              aria-label="Region"
            >
              <option value="US">United States</option>
              <option value="DEVELOPED">Developed Markets</option>
              <option value="EMERGING">Emerging Markets</option>
              <option value="GLOBAL">Global</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={addHolding}
          className={`${theme.buttons.primary} px-6 py-2 rounded-lg transition-all hover:shadow-lg flex items-center gap-2`}
        >
          <Plus className="w-4 h-4" />
          Add Holding
        </button>
      </div>

      {/* Recommendations */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Zap className="w-5 h-5" />
          Diversification Recommendations
        </h3>
        
        <div className="space-y-4">
          {diversificationScore.overall < 60 && (
            <div className={`p-4 ${theme.status.error.bg} border ${theme.status.error.border} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-5 h-5 ${theme.status.error.text}`} />
                <span className={`font-medium ${theme.status.error.text}`}>High Concentration Risk</span>
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Your portfolio has significant concentration risk. Consider reducing large individual positions and adding more asset classes.
              </p>
            </div>
          )}
          
          {diversificationScore.geographic < 70 && (
            <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <Globe className={`w-5 h-5 ${theme.status.warning.text}`} />
                <span className={`font-medium ${theme.status.warning.text}`}>Limited International Exposure</span>
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Consider increasing international diversification with developed and emerging market funds (VTIAX, VTISX).
              </p>
            </div>
          )}
          
          {diversificationScore.assetClass < 70 && (
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className={`w-5 h-5 ${theme.status.info.text}`} />
                <span className={`font-medium ${theme.status.info.text}`}>Asset Class Balance Needed</span>
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Consider adding bonds (BND) for stability and REITs (VNQ) for inflation protection and additional diversification.
              </p>
            </div>
          )}
          
          {diversificationScore.overall >= 80 && (
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                <span className={`font-medium ${theme.status.success.text}`}>Excellent Diversification</span>
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Your portfolio demonstrates excellent diversification across asset classes, sectors, and regions. Continue with regular rebalancing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          💡 Diversification is the only free lunch in investing. A well-diversified portfolio reduces risk without sacrificing expected returns over the long term.
        </p>
      </div>
    </motion.div>
  );
}

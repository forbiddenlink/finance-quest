'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  BarChart3,
  AlertTriangle,
  Zap,
  Activity,
  Shield,
  Award,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

interface PortfolioPoint {
  name: string;
  risk: number;
  return: number;
  sharpeRatio: number;
  volatility: number;
  allocation: {[key: string]: number};
  color: string;
}

interface AssetClass {
  name: string;
  expectedReturn: number;
  volatility: number;
  color: string;
  allocation: number;
}

const defaultAssets: AssetClass[] = [
  { name: 'US Stocks', expectedReturn: 10.0, volatility: 16.0, color: '#3B82F6', allocation: 60 },
  { name: 'International Stocks', expectedReturn: 8.5, volatility: 18.0, color: '#10B981', allocation: 20 },
  { name: 'Bonds', expectedReturn: 4.0, volatility: 4.0, color: '#F59E0B', allocation: 15 },
  { name: 'REITs', expectedReturn: 7.0, volatility: 20.0, color: '#8B5CF6', allocation: 5 }
];

const riskFreeRate = 2.5; // Treasury rate for Sharpe ratio calculation

export default function ModernPortfolioTheoryVisualizer() {
  const { recordCalculatorUsage } = useProgressStore();
  const [assets, setAssets] = useState<AssetClass[]>(defaultAssets);

  useEffect(() => {
    recordCalculatorUsage('modern-portfolio-theory-visualizer');
  }, [recordCalculatorUsage]);

  // Calculate portfolio metrics based on Modern Portfolio Theory
  const calculatePortfolioMetrics = (allocations: number[]): PortfolioPoint => {
    // Normalize allocations to sum to 100%
    const total = allocations.reduce((sum, alloc) => sum + alloc, 0);
    const normalizedAllocations = allocations.map(alloc => alloc / total);

    // Calculate expected return (weighted average)
    const expectedReturn = assets.reduce((sum, asset, index) => 
      sum + (normalizedAllocations[index] * asset.expectedReturn), 0
    );

    // Calculate portfolio variance (simplified - assuming zero correlation)
    const variance = assets.reduce((sum, asset, index) => 
      sum + Math.pow(normalizedAllocations[index] * asset.volatility, 2), 0
    );
    
    const volatility = Math.sqrt(variance);
    const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

    const allocation: {[key: string]: number} = {};
    assets.forEach((asset, index) => {
      allocation[asset.name] = normalizedAllocations[index] * 100;
    });

    return {
      name: 'Custom Portfolio',
      risk: volatility,
      return: expectedReturn,
      sharpeRatio,
      volatility,
      allocation,
      color: '#3B82F6'
    };
  };

  // Generate efficient frontier points
  const generateEfficientFrontier = (): PortfolioPoint[] => {
    const portfolios: PortfolioPoint[] = [];
    const steps = 20;

    for (let i = 0; i <= steps; i++) {
      // Create different allocation strategies
      const stockWeight = i / steps;
      const bondWeight = 1 - stockWeight;
      
      // Distribute between asset classes based on risk level
      const allocations = [
        stockWeight * 0.7, // US Stocks
        stockWeight * 0.2, // International Stocks
        bondWeight * 0.9,  // Bonds
        stockWeight * 0.1  // REITs
      ];

      const portfolio = calculatePortfolioMetrics(allocations);
      portfolio.name = `Portfolio ${i}`;
      portfolio.color = '#6B7280';
      portfolios.push(portfolio);
    }

    return portfolios;
  };

  // Generate preset portfolios
  const generatePresetPortfolios = (): PortfolioPoint[] => {
    const presets = [
      {
        name: 'Conservative',
        allocations: [30, 10, 55, 5],
        color: '#10B981'
      },
      {
        name: 'Moderate',
        allocations: [50, 20, 25, 5],
        color: '#F59E0B'
      },
      {
        name: 'Aggressive',
        allocations: [70, 25, 0, 5],
        color: '#EF4444'
      },
      {
        name: 'Target Date 2060',
        allocations: [60, 30, 10, 0],
        color: '#8B5CF6'
      }
    ];

    return presets.map(preset => {
      const portfolio = calculatePortfolioMetrics(preset.allocations);
      portfolio.name = preset.name;
      portfolio.color = preset.color;
      return portfolio;
    });
  };

  const efficientFrontier = generateEfficientFrontier();
  const presetPortfolios = generatePresetPortfolios();
  const currentMetrics = calculatePortfolioMetrics(assets.map(asset => asset.allocation));

  const updateAssetAllocation = (index: number, allocation: number) => {
    const updatedAssets = assets.map((asset, i) => 
      i === index ? { ...asset, allocation } : asset
    );
    setAssets(updatedAssets);
  };

  const applyPresetPortfolio = (preset: PortfolioPoint) => {
    const updatedAssets = assets.map((asset) => ({
      ...asset,
      allocation: preset.allocation[asset.name] || 0
    }));
    setAssets(updatedAssets);
    toast.success(`Applied ${preset.name} portfolio! 📊`);
  };

  const resetToDefault = () => {
    setAssets(defaultAssets);
    toast.success('Reset to default allocation! 🔄');
  };

  const getRiskLevel = (volatility: number) => {
    if (volatility < 8) return { level: 'Low', color: theme.status.success.text };
    if (volatility < 15) return { level: 'Moderate', color: theme.status.warning.text };
    return { level: 'High', color: theme.status.error.text };
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  const formatRatio = (value: number) => value.toFixed(2);

  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
  const allocationWarning = Math.abs(totalAllocation - 100) > 1;

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
              <TrendingUp className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Modern Portfolio Theory Visualizer
              </h2>
              <p className={`${theme.textColors.secondary}`}>
                Explore the efficient frontier and optimize your portfolio&apos;s risk-return profile
              </p>
            </div>
          </div>
          
          <button
            onClick={resetToDefault}
            className={`flex items-center gap-2 px-4 py-2 border ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Current Portfolio Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
            <TrendingUp className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.info.text}`}>
              {formatPercent(currentMetrics.return)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Expected Return</div>
          </div>
          
          <div className={`p-4 ${getRiskLevel(currentMetrics.volatility).color === theme.status.success.text ? theme.status.success.bg : getRiskLevel(currentMetrics.volatility).color === theme.status.warning.text ? theme.status.warning.bg : theme.status.error.bg} rounded-lg text-center`}>
            <Shield className={`w-6 h-6 ${getRiskLevel(currentMetrics.volatility).color} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${getRiskLevel(currentMetrics.volatility).color}`}>
              {formatPercent(currentMetrics.volatility)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Risk (Volatility)</div>
          </div>
          
          <div className={`p-4 ${currentMetrics.sharpeRatio > 1 ? theme.status.success.bg : currentMetrics.sharpeRatio > 0.5 ? theme.status.warning.bg : theme.status.error.bg} rounded-lg text-center`}>
            <Award className={`w-6 h-6 ${currentMetrics.sharpeRatio > 1 ? theme.status.success.text : currentMetrics.sharpeRatio > 0.5 ? theme.status.warning.text : theme.status.error.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${currentMetrics.sharpeRatio > 1 ? theme.status.success.text : currentMetrics.sharpeRatio > 0.5 ? theme.status.warning.text : theme.status.error.text}`}>
              {formatRatio(currentMetrics.sharpeRatio)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Sharpe Ratio</div>
          </div>
          
          <div className={`p-4 ${allocationWarning ? theme.status.error.bg : theme.status.success.bg} rounded-lg text-center`}>
            <Target className={`w-6 h-6 ${allocationWarning ? theme.status.error.text : theme.status.success.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${allocationWarning ? theme.status.error.text : theme.status.success.text}`}>
              {formatPercent(totalAllocation)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Total Allocation</div>
          </div>
        </div>
      </div>

      {/* Efficient Frontier Chart */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5" />
          Efficient Frontier & Portfolio Comparison
        </h3>
        
        <div className="h-96 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number" 
                domain={['dataMin - 1', 'dataMax + 1']} 
                dataKey="risk" 
                name="Risk" 
                unit="%" 
                stroke="#9CA3AF"
                label={{ value: 'Risk (Volatility %)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                domain={['dataMin - 1', 'dataMax + 1']} 
                dataKey="return" 
                name="Return" 
                unit="%" 
                stroke="#9CA3AF"
                label={{ value: 'Expected Return %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'risk' ? `${value.toFixed(1)}%` : `${value.toFixed(1)}%`,
                  name === 'risk' ? 'Risk' : 'Return'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload as PortfolioPoint;
                    return `${data.name} (Sharpe: ${data.sharpeRatio.toFixed(2)})`;
                  }
                  return label;
                }}
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
              />
              
              {/* Efficient Frontier Line */}
              <Scatter 
                data={efficientFrontier} 
                fill="#6B7280" 
                fillOpacity={0.3}
                name="Efficient Frontier"
              />
              
              {/* Preset Portfolios */}
              <Scatter 
                data={presetPortfolios} 
                fill="#F59E0B"
                name="Preset Portfolios"
              />
              
              {/* Current Portfolio */}
              <Scatter 
                data={[currentMetrics]} 
                fill="#3B82F6"
                fillOpacity={1}
                name="Your Portfolio"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 opacity-50" />
            <span className={`text-sm ${theme.textColors.secondary}`}>Efficient Frontier</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className={`text-sm ${theme.textColors.secondary}`}>Preset Portfolios</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className={`text-sm ${theme.textColors.secondary}`}>Your Portfolio</span>
          </div>
        </div>
      </div>

      {/* Asset Allocation Controls */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Sliders className="w-5 h-5" />
          Portfolio Allocation
        </h3>
        
        <div className="space-y-6">
          {assets.map((asset, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: asset.color }}
                    aria-label={`${asset.name} color indicator`}
                  />
                  <span className={`font-medium ${theme.textColors.primary}`}>{asset.name}</span>
                  <span className={`text-sm ${theme.textColors.secondary}`}>
                    (Return: {formatPercent(asset.expectedReturn)}, Risk: {formatPercent(asset.volatility)})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium ${theme.textColors.primary} w-12 text-right`}>
                    {formatPercent(asset.allocation)}
                  </span>
                  <input
                    type="number"
                    value={asset.allocation}
                    onChange={(e) => updateAssetAllocation(index, parseFloat(e.target.value) || 0)}
                    className={`w-20 px-2 py-1 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded ${theme.textColors.primary} text-sm`}
                    min="0"
                    max="100"
                    step="1"
                    title={`${asset.name} allocation percentage`}
                    aria-label={`${asset.name} allocation percentage`}
                  />
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={asset.allocation}
                  onChange={(e) => updateAssetAllocation(index, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${asset.allocation}%, #374151 ${asset.allocation}%, #374151 100%)`
                  }}
                  title={`Adjust ${asset.name} allocation`}
                  aria-label={`${asset.name} allocation slider`}
                />
              </div>
            </div>
          ))}
        </div>
        
        {allocationWarning && (
          <div className={`mt-4 p-3 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${theme.status.warning.text}`} />
              <span className={`text-sm font-medium ${theme.status.warning.text}`}>
                Total allocation: {formatPercent(totalAllocation)} - Should equal 100%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Preset Portfolios */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Target className="w-5 h-5" />
          Sample Portfolio Strategies
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetPortfolios.map((portfolio, index) => (
            <div key={index} className={`p-4 border ${theme.borderColors.primary} rounded-lg hover:border-blue-500 transition-all cursor-pointer`} onClick={() => applyPresetPortfolio(portfolio)}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${theme.textColors.primary}`}>{portfolio.name}</h4>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: portfolio.color }}
                  aria-label={`${portfolio.name} color indicator`}
                />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Return:</span>
                  <span className={`font-medium ${theme.textColors.primary}`}>{formatPercent(portfolio.return)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Risk:</span>
                  <span className={`font-medium ${getRiskLevel(portfolio.volatility).color}`}>{formatPercent(portfolio.risk)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Sharpe:</span>
                  <span className={`font-medium ${theme.textColors.primary}`}>{formatRatio(portfolio.sharpeRatio)}</span>
                </div>
              </div>
              
              <div className="mt-3 space-y-1">
                {Object.entries(portfolio.allocation).map(([assetName, allocation]) => (
                  <div key={assetName} className="flex justify-between text-xs">
                    <span className={`${theme.textColors.secondary}`}>{assetName}:</span>
                    <span className={`${theme.textColors.primary}`}>{formatPercent(allocation)}</span>
                  </div>
                ))}
              </div>
              
              <button
                className={`w-full mt-3 px-3 py-1 ${theme.buttons.primary} rounded text-sm hover:shadow-lg transition-all`}
                title={`Apply ${portfolio.name} portfolio allocation`}
                aria-label={`Apply ${portfolio.name} portfolio`}
              >
                Apply Portfolio
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Analysis */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Activity className="w-5 h-5" />
          Portfolio Analysis & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
            <h4 className={`font-semibold ${theme.status.info.text} mb-3`}>Risk Assessment</h4>
            <div className="space-y-2 text-sm">
              <p className={`${theme.textColors.secondary}`}>
                Your portfolio has <strong className={`${getRiskLevel(currentMetrics.volatility).color}`}>
                {getRiskLevel(currentMetrics.volatility).level}</strong> risk with {formatPercent(currentMetrics.volatility)} volatility.
              </p>
              {currentMetrics.volatility > 15 && (
                <p className={`${theme.status.warning.text}`}>
                  ⚠️ High volatility - consider adding bonds to reduce risk.
                </p>
              )}
              {currentMetrics.volatility < 8 && (
                <p className={`${theme.status.success.text}`}>
                  ✅ Conservative allocation - good for capital preservation.
                </p>
              )}
            </div>
          </div>
          
          <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
            <h4 className={`font-semibold ${theme.status.warning.text} mb-3`}>Optimization Suggestions</h4>
            <div className="space-y-2 text-sm">
              {currentMetrics.sharpeRatio < 0.5 && (
                <p className={`${theme.textColors.secondary}`}>
                  📈 Low Sharpe ratio - consider rebalancing for better risk-adjusted returns.
                </p>
              )}
              {currentMetrics.sharpeRatio > 1 && (
                <p className={`${theme.textColors.secondary}`}>
                  🎯 Excellent Sharpe ratio - well-optimized portfolio!
                </p>
              )}
              <p className={`${theme.textColors.secondary}`}>
                💡 Diversification across asset classes reduces overall portfolio risk.
              </p>
            </div>
          </div>
        </div>
        
        <div className={`mt-6 p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-5 h-5 ${theme.status.success.text}`} />
            <span className={`font-medium ${theme.status.success.text}`}>Modern Portfolio Theory Insights</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className={`font-medium ${theme.status.success.text} mb-1`}>Key Principles:</h5>
              <ul className={`${theme.textColors.secondary} space-y-1`}>
                <li>• Diversification reduces risk without sacrificing returns</li>
                <li>• Efficient frontier shows optimal risk-return combinations</li>
                <li>• Sharpe ratio measures risk-adjusted performance</li>
              </ul>
            </div>
            <div>
              <h5 className={`font-medium ${theme.status.success.text} mb-1`}>Best Practices:</h5>
              <ul className={`${theme.textColors.secondary} space-y-1`}>
                <li>• Rebalance periodically to maintain target allocation</li>
                <li>• Consider your time horizon and risk tolerance</li>
                <li>• Lower-cost index funds improve net returns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          📊 Modern Portfolio Theory, developed by Harry Markowitz, demonstrates that a diversified portfolio can achieve higher returns for a given level of risk than any individual investment.
        </p>
      </div>
    </motion.div>
  );
}

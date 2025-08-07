'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Info,
  Settings,
  Zap,
  Clock,
  PieChart,
  ArrowUpDown,
  Calculator
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import toast from 'react-hot-toast';

interface PortfolioHolding {
  name: string;
  currentValue: number;
  currentPercent: number;
  targetPercent: number;
  deviation: number;
  rebalanceAmount: number;
  action: 'BUY' | 'SELL' | 'HOLD';
}

interface RebalanceConfig {
  totalValue: number;
  threshold: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL';
  taxConsideration: boolean;
  minimumAmount: number;
}

const defaultConfig: RebalanceConfig = {
  totalValue: 100000,
  threshold: 5,
  frequency: 'QUARTERLY',
  taxConsideration: true,
  minimumAmount: 500
};

const defaultHoldings = [
  { name: 'US Total Stock Market', currentPercent: 65, targetPercent: 60 },
  { name: 'International Stocks', currentPercent: 15, targetPercent: 20 },
  { name: 'Bonds', currentPercent: 15, targetPercent: 15 },
  { name: 'REITs', currentPercent: 5, targetPercent: 5 }
];

const frequencyConfig = {
  MONTHLY: { name: 'Monthly', days: 30, cost: 'High transaction costs' },
  QUARTERLY: { name: 'Quarterly', days: 90, cost: 'Balanced approach' },
  SEMIANNUAL: { name: 'Semi-Annual', days: 180, cost: 'Lower costs' },
  ANNUAL: { name: 'Annual', days: 365, cost: 'Lowest costs' }
};

const assetColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16'  // Lime
];

export default function RebalancingOptimizer() {
  const { recordCalculatorUsage } = useProgressStore();
  const [config, setConfig] = useState<RebalanceConfig>(defaultConfig);
  const [holdings, setHoldings] = useState(defaultHoldings);
  
  useEffect(() => {
    recordCalculatorUsage('rebalancing-optimizer');
  }, [recordCalculatorUsage]);

  const calculateRebalanceData = (): PortfolioHolding[] => {
    const totalTargetPercent = holdings.reduce((sum, h) => sum + h.targetPercent, 0);
    const totalCurrentPercent = holdings.reduce((sum, h) => sum + h.currentPercent, 0);
    
    // Normalize if percentages don't add to 100
    const normalizedHoldings = holdings.map(h => ({
      ...h,
      currentPercent: (h.currentPercent / totalCurrentPercent) * 100,
      targetPercent: (h.targetPercent / totalTargetPercent) * 100
    }));

    return normalizedHoldings.map((holding) => {
      const currentValue = config.totalValue * (holding.currentPercent / 100);
      const targetValue = config.totalValue * (holding.targetPercent / 100);
      const deviation = holding.currentPercent - holding.targetPercent;
      const rebalanceAmount = targetValue - currentValue;
      
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      if (Math.abs(deviation) > config.threshold) {
        if (Math.abs(rebalanceAmount) >= config.minimumAmount) {
          action = rebalanceAmount > 0 ? 'BUY' : 'SELL';
        }
      }

      return {
        name: holding.name,
        currentValue,
        currentPercent: holding.currentPercent,
        targetPercent: holding.targetPercent,
        deviation,
        rebalanceAmount,
        action
      };
    });
  };

  const rebalanceData = calculateRebalanceData();
  const needsRebalancing = rebalanceData.some(h => h.action !== 'HOLD');
  const totalDeviationScore = rebalanceData.reduce((sum, h) => sum + Math.abs(h.deviation), 0);
  const balanceScore = Math.max(0, 100 - (totalDeviationScore * 2));

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return theme.status.success.text;
      case 'SELL': return theme.status.error.text;
      default: return theme.textColors.secondary;
    }
  };

  const getActionBackground = (action: string) => {
    switch (action) {
      case 'BUY': return theme.status.success.bg;
      case 'SELL': return theme.status.error.bg;
      default: return theme.backgrounds.card;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const getDeviationColor = (deviation: number) => {
    if (Math.abs(deviation) <= config.threshold) return theme.status.success.text;
    if (Math.abs(deviation) <= config.threshold * 2) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const addHolding = () => {
    setHoldings([...holdings, { name: 'New Asset', currentPercent: 0, targetPercent: 0 }]);
    toast.success('New holding added! 📊');
  };

  const removeHolding = (index: number) => {
    if (holdings.length > 1) {
      setHoldings(holdings.filter((_, i) => i !== index));
      toast.success('Holding removed');
    } else {
      toast.error('Cannot remove the last holding');
    }
  };

  const updateHolding = (index: number, field: string, value: string | number) => {
    const updatedHoldings = holdings.map((holding, i) => 
      i === index ? { ...holding, [field]: value } : holding
    );
    setHoldings(updatedHoldings);
  };

  const autoBalance = () => {
    const equalPercent = 100 / holdings.length;
    const balancedHoldings = holdings.map(h => ({
      ...h,
      currentPercent: equalPercent,
      targetPercent: equalPercent
    }));
    setHoldings(balancedHoldings);
    toast.success('Portfolio auto-balanced! ⚖️');
  };

  const pieData = rebalanceData.map((item, index) => ({
    name: item.name,
    value: item.currentPercent,
    target: item.targetPercent,
    color: assetColors[index % assetColors.length]
  }));

  const barData = rebalanceData.map((item, index) => ({
    name: item.name.split(' ').slice(0, 2).join(' '), // Shorter names for chart
    current: item.currentPercent,
    target: item.targetPercent,
    deviation: item.deviation,
    color: assetColors[index % assetColors.length]
  }));

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
              <RotateCcw className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Portfolio Rebalancing Optimizer
              </h2>
              <p className={`${theme.textColors.secondary}`}>
                Optimize your portfolio allocation and rebalancing strategy for maximum efficiency
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={autoBalance}
              className={`px-4 py-2 border ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
            >
              Auto Balance
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
            <DollarSign className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.info.text}`}>
              {formatCurrency(config.totalValue)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Portfolio Value</div>
          </div>
          
          <div className={`p-4 ${balanceScore >= 80 ? theme.status.success.bg : balanceScore >= 60 ? theme.status.warning.bg : theme.status.error.bg} rounded-lg text-center`}>
            <Target className={`w-6 h-6 ${balanceScore >= 80 ? theme.status.success.text : balanceScore >= 60 ? theme.status.warning.text : theme.status.error.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${balanceScore >= 80 ? theme.status.success.text : balanceScore >= 60 ? theme.status.warning.text : theme.status.error.text}`}>
              {balanceScore}/100
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Balance Score</div>
          </div>
          
          <div className={`p-4 ${needsRebalancing ? theme.status.warning.bg : theme.status.success.bg} rounded-lg text-center`}>
            <AlertTriangle className={`w-6 h-6 ${needsRebalancing ? theme.status.warning.text : theme.status.success.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${needsRebalancing ? theme.status.warning.text : theme.status.success.text}`}>
              {needsRebalancing ? 'YES' : 'NO'}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Needs Rebalancing</div>
          </div>
          
          <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
            <Clock className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.info.text}`}>
              {frequencyConfig[config.frequency].name}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Frequency</div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Settings className="w-5 h-5" />
          Rebalancing Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Portfolio Value ($)
            </label>
            <input
              type="number"
              value={config.totalValue}
              onChange={(e) => setConfig({...config, totalValue: parseFloat(e.target.value) || 0})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              title="Enter total portfolio value"
              aria-label="Total portfolio value"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Rebalance Threshold (%)
            </label>
            <input
              type="number"
              value={config.threshold}
              onChange={(e) => setConfig({...config, threshold: parseFloat(e.target.value) || 0})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              min="1"
              max="20"
              title="Deviation threshold for rebalancing"
              aria-label="Rebalance threshold percentage"
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Frequency
            </label>
            <select
              value={config.frequency}
              onChange={(e) => setConfig({...config, frequency: e.target.value as RebalanceConfig['frequency']})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              title="Select rebalancing frequency"
              aria-label="Rebalancing frequency"
            >
              {Object.entries(frequencyConfig).map(([key, freq]) => (
                <option key={key} value={key}>{freq.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Min Amount ($)
            </label>
            <input
              type="number"
              value={config.minimumAmount}
              onChange={(e) => setConfig({...config, minimumAmount: parseFloat(e.target.value) || 0})}
              className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              title="Minimum dollar amount for rebalancing"
              aria-label="Minimum rebalancing amount"
            />
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.taxConsideration}
                onChange={(e) => setConfig({...config, taxConsideration: e.target.checked})}
                className="rounded"
                title="Consider tax implications"
                aria-label="Tax consideration checkbox"
              />
              <span className={`text-sm ${theme.textColors.secondary}`}>Tax Aware</span>
            </label>
          </div>
        </div>
      </div>

      {/* Portfolio Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current vs Target Allocation */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5" />
            Current vs Target Allocation
          </h3>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name === 'current' ? 'Current' : 'Target']}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="current" fill="#3B82F6" name="current" />
                <Bar dataKey="target" fill="#10B981" name="target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Pie Chart */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <PieChart className="w-5 h-5" />
            Current Portfolio Allocation
          </h3>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                    aria-label={`${item.name} color indicator`}
                  />
                  <span className={`text-sm ${theme.textColors.secondary}`}>{item.name}</span>
                </div>
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                  {item.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Configuration */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <Calculator className="w-5 h-5" />
            Portfolio Holdings
          </h3>
          <button
            onClick={addHolding}
            className={`${theme.buttons.primary} px-4 py-2 rounded-lg transition-all hover:shadow-lg`}
          >
            Add Holding
          </button>
        </div>
        
        <div className="space-y-4">
          {holdings.map((holding, index) => (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border ${theme.borderColors.primary} rounded-lg`}>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                  Asset Name
                </label>
                <input
                  type="text"
                  value={holding.name}
                  onChange={(e) => updateHolding(index, 'name', e.target.value)}
                  className={`w-full px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded ${theme.textColors.primary}`}
                  title="Enter asset name"
                  aria-label="Asset name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                  Current %
                </label>
                <input
                  type="number"
                  value={holding.currentPercent}
                  onChange={(e) => updateHolding(index, 'currentPercent', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded ${theme.textColors.primary}`}
                  min="0"
                  max="100"
                  step="0.1"
                  title="Current allocation percentage"
                  aria-label="Current allocation percentage"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                  Target %
                </label>
                <input
                  type="number"
                  value={holding.targetPercent}
                  onChange={(e) => updateHolding(index, 'targetPercent', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded ${theme.textColors.primary}`}
                  min="0"
                  max="100"
                  step="0.1"
                  title="Target allocation percentage"
                  aria-label="Target allocation percentage"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                  Deviation
                </label>
                <div className={`px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded text-center`}>
                  <span className={`font-medium ${getDeviationColor(holding.currentPercent - holding.targetPercent)}`}>
                    {formatPercent(holding.currentPercent - holding.targetPercent)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => removeHolding(index)}
                  className={`px-3 py-2 text-red-400 hover:text-red-300 border ${theme.borderColors.primary} rounded transition-colors`}
                  disabled={holdings.length === 1}
                  title={`Remove ${holding.name} from portfolio`}
                  aria-label={`Remove ${holding.name} holding`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing Actions */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <ArrowUpDown className="w-5 h-5" />
          Recommended Rebalancing Actions
        </h3>
        
        {needsRebalancing ? (
          <div className="space-y-4">
            {rebalanceData.filter(h => h.action !== 'HOLD').map((holding, index) => (
              <div key={index} className={`flex items-center justify-between p-4 ${getActionBackground(holding.action)} border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 ${getActionColor(holding.action) === theme.status.success.text ? theme.status.success.bg : theme.status.error.bg} rounded-full`}>
                    <span className={`text-sm font-medium ${getActionColor(holding.action)}`}>
                      {holding.action}
                    </span>
                  </div>
                  <div>
                    <div className={`font-medium ${theme.textColors.primary}`}>{holding.name}</div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>
                      Current: {holding.currentPercent.toFixed(1)}% → Target: {holding.targetPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-bold ${theme.textColors.primary}`}>
                    {formatCurrency(Math.abs(holding.rebalanceAmount))}
                  </div>
                  <div className={`text-sm ${getDeviationColor(holding.deviation)}`}>
                    {formatPercent(holding.deviation)} off target
                  </div>
                </div>
              </div>
            ))}
            
            {config.taxConsideration && (
              <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className={`w-5 h-5 ${theme.status.warning.text}`} />
                  <span className={`font-medium ${theme.status.warning.text}`}>Tax Considerations</span>
                </div>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Consider tax implications of selling positions. Prioritize tax-advantaged accounts for rebalancing when possible.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={`p-6 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
            <CheckCircle className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-4`} />
            <h4 className={`text-lg font-semibold ${theme.status.success.text} mb-2`}>
              Portfolio is Well Balanced! 🎯
            </h4>
            <p className={`${theme.textColors.secondary}`}>
              All allocations are within your {config.threshold}% threshold. No rebalancing needed at this time.
            </p>
          </div>
        )}
      </div>

      {/* Strategy Insights */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Zap className="w-5 h-5" />
          Rebalancing Strategy Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
            <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
              Frequency Impact
            </h4>
            <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
              {frequencyConfig[config.frequency].cost}
            </p>
            <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
              <li>• Rebalance every {frequencyConfig[config.frequency].days} days</li>
              <li>• {config.frequency === 'QUARTERLY' ? 'Recommended' : config.frequency === 'ANNUAL' ? 'Conservative' : 'Aggressive'} approach</li>
            </ul>
          </div>
          
          <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
            <h4 className={`font-semibold ${theme.status.warning.text} mb-2`}>
              Threshold Analysis
            </h4>
            <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
              {config.threshold}% deviation threshold
            </p>
            <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
              <li>• {config.threshold <= 3 ? 'Tight control' : config.threshold <= 7 ? 'Balanced approach' : 'Relaxed monitoring'}</li>
              <li>• Min trade: {formatCurrency(config.minimumAmount)}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          🎯 Regular rebalancing maintains your target allocation and enforces the discipline of &quot;buy low, sell high&quot; by systematically moving money from outperforming to underperforming assets.
        </p>
      </div>
    </motion.div>
  );
}

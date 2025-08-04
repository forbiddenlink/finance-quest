'use client';

import React, { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Globe,
  PieChart,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface AssetHolding {
  name: string;
  value: number;
  category: string;
  subCategory: string;
  region: string;
}

interface DiversificationScore {
  overall: number;
  assetClass: number;
  geographic: number;
  sector: number;
  recommendations: string[];
}

const DiversificationAnalyzer: React.FC = () => {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [holdings, setHoldings] = useState<AssetHolding[]>([
    { name: 'S&P 500 ETF', value: 50000, category: 'Stocks', subCategory: 'Large Cap', region: 'US' },
    { name: 'Total Bond Market', value: 20000, category: 'Bonds', subCategory: 'Government', region: 'US' },
    { name: 'International Developed', value: 15000, category: 'Stocks', subCategory: 'Large Cap', region: 'International' },
    { name: 'Emerging Markets', value: 10000, category: 'Stocks', subCategory: 'Large Cap', region: 'Emerging' },
    { name: 'Real Estate (REITs)', value: 5000, category: 'Real Estate', subCategory: 'REITs', region: 'US' }
  ]);
  
  const [diversificationScore, setDiversificationScore] = useState<DiversificationScore>({
    overall: 0,
    assetClass: 0,
    geographic: 0,
    sector: 0,
    recommendations: []
  });

  useEffect(() => {
    recordCalculatorUsage('diversification-analyzer');
  }, [recordCalculatorUsage]);

  const calculateDiversificationScore = React.useCallback(() => {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
    
    if (totalValue === 0) {
      setDiversificationScore({
        overall: 0,
        assetClass: 0,
        geographic: 0,
        sector: 0,
        recommendations: []
      });
      return;
    }

    // Asset Class Diversification
    const assetClassDistribution: { [key: string]: number } = {};
    holdings.forEach(holding => {
      assetClassDistribution[holding.category] = (assetClassDistribution[holding.category] || 0) + holding.value;
    });
    
    const assetClassPercentages = Object.values(assetClassDistribution).map(value => value / totalValue * 100);
    const assetClassScore = calculateHerfindahlIndex(assetClassPercentages);

    // Geographic Diversification
    const geographicDistribution: { [key: string]: number } = {};
    holdings.forEach(holding => {
      geographicDistribution[holding.region] = (geographicDistribution[holding.region] || 0) + holding.value;
    });
    
    const geographicPercentages = Object.values(geographicDistribution).map(value => value / totalValue * 100);
    const geographicScore = calculateHerfindahlIndex(geographicPercentages);

    // Sector Diversification (simplified)
    const sectorScore = Math.max(0, 100 - (holdings.length < 3 ? 40 : holdings.length < 5 ? 20 : 0));

    // Overall Score (weighted average)
    const overallScore = (assetClassScore * 0.4 + geographicScore * 0.3 + sectorScore * 0.3);

    // Generate Recommendations inline
    const recommendations: string[] = [];
    const stockPercentage = ((assetClassDistribution['Stocks'] || 0) / totalValue) * 100;
    const bondPercentage = ((assetClassDistribution['Bonds'] || 0) / totalValue) * 100;
    
    if (stockPercentage > 90) {
      recommendations.push('Consider adding bonds (10-40%) to reduce portfolio volatility');
    }
    if (bondPercentage > 60) {
      recommendations.push('Consider increasing stock allocation for better long-term growth');
    }
    if (!assetClassDistribution['Real Estate']) {
      recommendations.push('Add REITs (5-10%) for inflation protection and diversification');
    }

    const usPercentage = ((geographicDistribution['US'] || 0) / totalValue) * 100;
    if (usPercentage > 80) {
      recommendations.push('Add international exposure (20-40%) to reduce country-specific risk');
    }
    if (!geographicDistribution['Emerging']) {
      recommendations.push('Consider emerging markets (5-15%) for additional diversification');
    }

    if (holdings.length < 4) {
      recommendations.push('Increase number of holdings across different asset classes');
    }
    if (overallScore < 50) {
      recommendations.push('Portfolio concentration is high - consider broader diversification');
    }

    setDiversificationScore({
      overall: Math.round(overallScore),
      assetClass: Math.round(assetClassScore),
      geographic: Math.round(geographicScore),
      sector: Math.round(sectorScore),
      recommendations
    });
  }, [holdings]);

  useEffect(() => {
    calculateDiversificationScore();
  }, [calculateDiversificationScore]);

  const addHolding = () => {
    const newHolding: AssetHolding = {
      name: 'New Holding',
      value: 0,
      category: 'Stocks',
      subCategory: 'Large Cap',
      region: 'US'
    };
    setHoldings([...holdings, newHolding]);
  };

  const updateHolding = (index: number, field: keyof AssetHolding, value: string | number) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    setHoldings(newHoldings);
  };

  const removeHolding = (index: number) => {
    if (holdings.length > 1) {
      const newHoldings = holdings.filter((_, i) => i !== index);
      setHoldings(newHoldings);
    }
  };

  const calculateHerfindahlIndex = (percentages: number[]): number => {
    // Convert Herfindahl Index to diversification score (0-100)
    const herfindahl = percentages.reduce((sum, pct) => sum + Math.pow(pct, 2), 0);
    return Math.max(0, 100 - (herfindahl / 100) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.status.success.text;
    if (score >= 60) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-green-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Portfolio Diversification Analyzer
        </h2>
      </div>

      {/* Diversification Scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
          <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.overall)} mb-1`}>
            {diversificationScore.overall}
          </div>
          <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Overall Score</div>
          <div className={`text-xs ${getScoreColor(diversificationScore.overall)}`}>
            {getScoreLabel(diversificationScore.overall)}
          </div>
        </div>
        
        <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
          <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.assetClass)} mb-1`}>
            {diversificationScore.assetClass}
          </div>
          <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Asset Classes</div>
          <div className={`text-xs ${getScoreColor(diversificationScore.assetClass)}`}>
            {getScoreLabel(diversificationScore.assetClass)}
          </div>
        </div>

        <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
          <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.geographic)} mb-1`}>
            {diversificationScore.geographic}
          </div>
          <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Geography</div>
          <div className={`text-xs ${getScoreColor(diversificationScore.geographic)}`}>
            {getScoreLabel(diversificationScore.geographic)}
          </div>
        </div>

        <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
          <div className={`text-2xl font-bold ${getScoreColor(diversificationScore.sector)} mb-1`}>
            {diversificationScore.sector}
          </div>
          <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Holdings Count</div>
          <div className={`text-xs ${getScoreColor(diversificationScore.sector)}`}>
            {getScoreLabel(diversificationScore.sector)}
          </div>
        </div>
      </div>

      {/* Holdings Input */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Portfolio Holdings</h3>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${theme.textColors.secondary}`}>
              Total Value: <span className={`font-bold ${theme.textColors.primary}`}>${totalValue.toLocaleString()}</span>
            </span>
            <button
              onClick={addHolding}
              className={`px-4 py-2 ${theme.buttons.primary} text-white rounded-lg hover:opacity-90 transition-opacity`}
            >
              Add Holding
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b ${theme.borderColors.primary}`}>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Holding Name</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Value</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Category</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Sub-Category</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Region</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>%</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index} className={`border-b ${theme.borderColors.primary}`}>
                  <td className="p-3">
                    <input
                      type="text"
                      value={holding.name}
                      onChange={(e) => updateHolding(index, 'name', e.target.value)}
                      className={`w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={holding.value}
                      onChange={(e) => updateHolding(index, 'value', Number(e.target.value))}
                      className={`w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={holding.category}
                      onChange={(e) => updateHolding(index, 'category', e.target.value)}
                      className={`w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    >
                      <option value="Stocks">Stocks</option>
                      <option value="Bonds">Bonds</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Commodities">Commodities</option>
                      <option value="Cash">Cash</option>
                      <option value="Alternative">Alternative</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={holding.subCategory}
                      onChange={(e) => updateHolding(index, 'subCategory', e.target.value)}
                      className={`w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    >
                      <option value="Large Cap">Large Cap</option>
                      <option value="Mid Cap">Mid Cap</option>
                      <option value="Small Cap">Small Cap</option>
                      <option value="Government">Government</option>
                      <option value="Corporate">Corporate</option>
                      <option value="REITs">REITs</option>
                      <option value="Commodity">Commodity</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={holding.region}
                      onChange={(e) => updateHolding(index, 'region', e.target.value)}
                      className={`w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    >
                      <option value="US">US</option>
                      <option value="International">International</option>
                      <option value="Emerging">Emerging</option>
                      <option value="Global">Global</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${theme.textColors.primary}`}>
                      {totalValue > 0 ? ((holding.value / totalValue) * 100).toFixed(1) : 0}%
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => removeHolding(index)}
                      className={`px-2 py-1 ${theme.status.error.bg} ${theme.status.error.text} rounded hover:opacity-80 transition-opacity`}
                      disabled={holdings.length <= 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {diversificationScore.recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Shield className="w-5 h-5" />
            Diversification Recommendations
          </h3>
          
          <div className="space-y-3">
            {diversificationScore.recommendations.map((recommendation, index) => (
              <div key={index} className={`p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg flex items-start gap-3`}>
                <AlertTriangle className={`w-4 h-4 ${theme.status.info.text} mt-0.5 flex-shrink-0`} />
                <p className={`text-sm ${theme.status.info.text}`}>
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
          <PieChart className="w-4 h-4" />
          Understanding Diversification Scores
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Score Meanings:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• <span className={theme.status.success.text}>80-100:</span> Excellent diversification</li>
              <li>• <span className={theme.status.warning.text}>60-79:</span> Good with room for improvement</li>
              <li>• <span className={theme.status.error.text}>0-59:</span> Concentrated, needs attention</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Key Principles:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Spread across asset classes</li>
              <li>• Include international exposure</li>
              <li>• Avoid concentration in one sector</li>
              <li>• Regular rebalancing maintains targets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiversificationAnalyzer;

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Umbrella,
  Shield,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Home,
  Car,
  Briefcase,
  Users,
  Info,
  Calculator
} from 'lucide-react';

interface AssetCategory {
  name: string;
  value: number;
  liability: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface UmbrellaAnalysis {
  totalAssets: number;
  totalLiability: number;
  liabilityGap: number;
  recommendedCoverage: number;
  estimatedPremium: number;
  costPerMillion: number;
  riskScore: number;
  recommendations: string[];
  breakdownByCategory: {
    category: string;
    premium: number;
    coverage: number;
  }[];
}

export default function UmbrellaPolicyCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [annualIncome, setAnnualIncome] = useState<number>(150000);
  const [netWorth, setNetWorth] = useState<number>(750000);
  const [occupation, setOccupation] = useState<string>('professional');
  const [publicProfile, setPublicProfile] = useState<string>('low');
  const [familySize, setFamilySize] = useState<number>(4);
  const [teenDrivers, setTeenDrivers] = useState<number>(0);
  
  const [assets, setAssets] = useState<AssetCategory[]>([
    { name: 'Primary Home', value: 450000, liability: 500000, icon: Home },
    { name: 'Auto Insurance', value: 40000, liability: 300000, icon: Car },
    { name: 'Investment Property', value: 200000, liability: 300000, icon: Home },
  ]);

  const [selectedRisks, setSelectedRisks] = useState<string[]>(['home', 'auto']);
  const [currentCoverage, setCurrentCoverage] = useState<number>(0);
  const [desiredCoverage, setDesiredCoverage] = useState<number>(1000000);

  const [analysis, setAnalysis] = useState<UmbrellaAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('umbrella-policy-calculator');
  }, [recordCalculatorUsage]);

  const liabilityRisks = useMemo(() => [
    {
      category: 'home',
      description: 'Homeowner liability (pools, gatherings, property hazards)',
      riskLevel: 'Medium' as const,
      baseRisk: 0.3
    },
    {
      category: 'auto',
      description: 'Auto accidents and liability claims',
      riskLevel: 'High' as const,
      baseRisk: 0.5
    },
    {
      category: 'teen-driver',
      description: 'Teenage drivers in household',
      riskLevel: 'High' as const,
      baseRisk: 0.4
    },
    {
      category: 'business',
      description: 'Business ownership or professional liability',
      riskLevel: 'Medium' as const,
      baseRisk: 0.25
    },
    {
      category: 'recreational',
      description: 'Boats, ATVs, recreational vehicles',
      riskLevel: 'Medium' as const,
      baseRisk: 0.2
    },
    {
      category: 'rental-property',
      description: 'Rental property ownership',
      riskLevel: 'Medium' as const,
      baseRisk: 0.3
    },
    {
      category: 'social-media',
      description: 'High social media presence or public profile',
      riskLevel: 'Medium' as const,
      baseRisk: 0.15
    },
    {
      category: 'volunteer',
      description: 'Volunteer work or board positions',
      riskLevel: 'Low' as const,
      baseRisk: 0.1
    }
  ], []);

  const occupationRiskMultipliers = useMemo(() => ({
    'executive': 1.5,
    'doctor': 1.3,
    'lawyer': 1.4,
    'real-estate': 1.2,
    'professional': 1.0,
    'teacher': 0.8,
    'engineer': 0.9,
    'retired': 0.7,
    'other': 1.0
  }), []);

  const publicProfileMultipliers = useMemo(() => ({
    'high': 1.8, // Celebrities, public figures
    'medium': 1.3, // Business owners, local figures  
    'low': 1.0 // Private individuals
  }), []);

  const addAsset = () => {
    const newAsset: AssetCategory = {
      name: 'New Asset',
      value: 100000,
      liability: 300000,
      icon: Shield
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (index: number, field: keyof AssetCategory, value: string | number) => {
    if (field === 'icon') return; // Don't update icon through this method
    
    setAssets(prev => prev.map((asset, i) => 
      i === index ? { ...asset, [field]: value } : asset
    ));
  };

  const removeAsset = (index: number) => {
    if (assets.length > 1) {
      setAssets(prev => prev.filter((_, i) => i !== index));
    }
  };

  const toggleRisk = (riskCategory: string) => {
    setSelectedRisks(prev => 
      prev.includes(riskCategory)
        ? prev.filter(risk => risk !== riskCategory)
        : [...prev, riskCategory]
    );
  };

  const calculateUmbrellaAnalysis = useCallback(() => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiability = assets.reduce((sum, asset) => sum + asset.liability, 0) + currentCoverage;
    
    // Calculate recommended coverage based on various factors
    const assetBasedCoverage = Math.max(totalAssets * 1.5, netWorth); // 1.5x assets or net worth
    const incomeBasedCoverage = annualIncome * 10; // 10x annual income
    const minimumRecommended = 1000000; // $1M minimum
    
    const recommendedCoverage = Math.max(assetBasedCoverage, incomeBasedCoverage, minimumRecommended);
    const liabilityGap = Math.max(0, recommendedCoverage - totalLiability);
    
    // Calculate risk score
    let riskScore = 0;
    
    // Base risk from selected categories
    selectedRisks.forEach(riskCategory => {
      const risk = liabilityRisks.find(r => r.category === riskCategory);
      if (risk) {
        riskScore += risk.baseRisk;
      }
    });
    
    // Teen drivers additional risk
    if (teenDrivers > 0) {
      riskScore += teenDrivers * 0.2;
    }
    
    // Occupation risk
    const occupationMultiplier = occupationRiskMultipliers[occupation as keyof typeof occupationRiskMultipliers] || 1.0;
    riskScore *= occupationMultiplier;
    
    // Public profile risk
    const profileMultiplier = publicProfileMultipliers[publicProfile as keyof typeof publicProfileMultipliers] || 1.0;
    riskScore *= profileMultiplier;
    
    // Family size risk (larger families = more exposure)
    const familyMultiplier = 1 + ((familySize - 1) * 0.05);
    riskScore *= familyMultiplier;
    
    // Calculate premium estimate
    const baseCostPerMillion = 200; // Base cost per million
    const riskAdjustment = Math.max(0.5, Math.min(2.0, riskScore)); // Cap between 0.5x and 2.0x
    const costPerMillion = baseCostPerMillion * riskAdjustment;
    const estimatedPremium = (desiredCoverage / 1000000) * costPerMillion;
    
    // Generate recommendations
    const recommendations: string[] = [];
    
    if (liabilityGap > 500000) {
      recommendations.push(`Consider ${formatCurrency(liabilityGap)} in umbrella coverage to protect your assets`);
    }
    
    if (totalLiability < netWorth) {
      recommendations.push('Your current liability coverage is less than your net worth - significant exposure risk');
    }
    
    if (riskScore > 1.5) {
      recommendations.push('High risk profile - umbrella policy is strongly recommended');
    }
    
    if (teenDrivers > 0) {
      recommendations.push('Teen drivers significantly increase liability risk - consider higher coverage');
    }
    
    if (occupation === 'executive' || occupation === 'doctor' || occupation === 'lawyer') {
      recommendations.push('Professional liability exposure - consider professional liability coverage in addition to umbrella');
    }
    
    if (publicProfile !== 'low') {
      recommendations.push('Higher public profile increases lawsuit risk - consider maximum available coverage');
    }
    
    if (estimatedPremium < annualIncome * 0.001) {
      recommendations.push('Umbrella insurance is very cost-effective relative to your income - consider higher coverage');
    }
    
    // Coverage optimization suggestions
    if (desiredCoverage < 2000000 && netWorth > 1000000) {
      recommendations.push('Consider $2M+ coverage for comprehensive protection');
    }
    
    if (assets.some(asset => asset.liability < 500000)) {
      recommendations.push('Some underlying policies may need liability increases before umbrella coverage applies');
    }
    
    // Breakdown by category
    const breakdownByCategory = [
      { category: 'Personal Liability', premium: estimatedPremium * 0.4, coverage: desiredCoverage * 0.4 },
      { category: 'Auto Liability', premium: estimatedPremium * 0.35, coverage: desiredCoverage * 0.35 },
      { category: 'Property Liability', premium: estimatedPremium * 0.25, coverage: desiredCoverage * 0.25 }
    ];

    const analysisResult: UmbrellaAnalysis = {
      totalAssets,
      totalLiability,
      liabilityGap,
      recommendedCoverage,
      estimatedPremium,
      costPerMillion,
      riskScore,
      recommendations,
      breakdownByCategory
    };
    
    setAnalysis(analysisResult);
  }, [
    assets,
    currentCoverage,
    netWorth,
    annualIncome,
    selectedRisks,
    teenDrivers,
    occupation,
    publicProfile,
    familySize,
    desiredCoverage,
    liabilityRisks,
    occupationRiskMultipliers,
    publicProfileMultipliers
  ]);

  useEffect(() => {
    calculateUmbrellaAnalysis();
  }, [calculateUmbrellaAnalysis]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 1.5) return 'text-red-400';
    if (score >= 1.0) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Umbrella className="w-6 h-6 text-purple-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Umbrella Policy Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Personal Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Annual Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="150000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Net Worth
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={netWorth}
                    onChange={(e) => setNetWorth(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="750000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Occupation
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="professional">Professional/Manager</option>
                    <option value="executive">Executive/C-Suite</option>
                    <option value="doctor">Doctor/Medical</option>
                    <option value="lawyer">Lawyer/Legal</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="teacher">Teacher/Educator</option>
                    <option value="engineer">Engineer/Technical</option>
                    <option value="retired">Retired</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Public Profile
                </label>
                <select
                  value={publicProfile}
                  onChange={(e) => setPublicProfile(e.target.value)}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                >
                  <option value="low">Low Profile (Private Individual)</option>
                  <option value="medium">Medium Profile (Business Owner/Local Figure)</option>
                  <option value="high">High Profile (Public Figure/Celebrity)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Family Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={familySize}
                      onChange={(e) => setFamilySize(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Teen Drivers
                  </label>
                  <input
                    type="number"
                    value={teenDrivers}
                    onChange={(e) => setTeenDrivers(Number(e.target.value))}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Current Coverage
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Umbrella Coverage
                </label>
                <div className="relative">
                  <Umbrella className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={currentCoverage}
                    onChange={(e) => setCurrentCoverage(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value={0}>No Umbrella Policy</option>
                    <option value={1000000}>$1,000,000</option>
                    <option value={2000000}>$2,000,000</option>
                    <option value={5000000}>$5,000,000</option>
                    <option value={10000000}>$10,000,000</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Desired Coverage
                </label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={desiredCoverage}
                    onChange={(e) => setDesiredCoverage(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value={1000000}>$1,000,000</option>
                    <option value={2000000}>$2,000,000</option>
                    <option value={3000000}>$3,000,000</option>
                    <option value={5000000}>$5,000,000</option>
                    <option value={10000000}>$10,000,000</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Assets & Liability
              </h3>
              <button
                onClick={addAsset}
                className={`px-3 py-1 text-sm ${theme.buttons.secondary} rounded`}
              >
                Add Asset
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {assets.map((asset, index) => {
                const AssetIcon = asset.icon;
                return (
                  <div key={index} className={`p-3 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AssetIcon className="w-4 h-4 text-blue-400" />
                        <input
                          type="text"
                          value={asset.name}
                          onChange={(e) => updateAsset(index, 'name', e.target.value)}
                          className={`bg-transparent ${theme.textColors.primary} text-sm font-medium border-none outline-none`}
                        />
                      </div>
                      <button
                        onClick={() => removeAsset(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Value</label>
                        <input
                          type="number"
                          value={asset.value}
                          onChange={(e) => updateAsset(index, 'value', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Liability</label>
                        <input
                          type="number"
                          value={asset.liability}
                          onChange={(e) => updateAsset(index, 'liability', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Liability Risk Factors
            </h3>
            
            <div className="space-y-2">
              {liabilityRisks.map((risk) => (
                <label key={risk.category} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedRisks.includes(risk.category)}
                    onChange={() => toggleRisk(risk.category)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${theme.textColors.primary} font-medium`}>
                        {risk.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getRiskLevelColor(risk.riskLevel)} bg-slate-700`}>
                        {risk.riskLevel}
                      </span>
                    </div>
                    <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
                      {risk.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Recommended</h4>
                  </div>
                  <div className="text-lg font-bold text-blue-400">
                    {formatCurrency(analysis.recommendedCoverage)}
                  </div>
                </div>

                <div className={`p-4 bg-purple-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Est. Premium</h4>
                  </div>
                  <div className="text-lg font-bold text-purple-400">
                    {formatCurrency(analysis.estimatedPremium)}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    {formatCurrency(analysis.costPerMillion)}/million
                  </div>
                </div>

                <div className={`p-4 ${
                  analysis.liabilityGap > 0 ? 'bg-red-900/20' : 'bg-green-900/20'
                } border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-5 h-5 ${
                      analysis.liabilityGap > 0 ? 'text-red-400' : 'text-green-400'
                    }`} />
                    <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Coverage Gap</h4>
                  </div>
                  <div className={`text-lg font-bold ${
                    analysis.liabilityGap > 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {analysis.liabilityGap > 0 ? formatCurrency(analysis.liabilityGap) : 'None'}
                  </div>
                </div>

                <div className={`p-4 bg-yellow-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary} text-sm`}>Risk Score</h4>
                  </div>
                  <div className={`text-lg font-bold ${getRiskScoreColor(analysis.riskScore)}`}>
                    {analysis.riskScore.toFixed(2)}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    {analysis.riskScore >= 1.5 ? 'High Risk' : analysis.riskScore >= 1.0 ? 'Medium Risk' : 'Low Risk'}
                  </div>
                </div>
              </div>

              {/* Asset Protection Analysis */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg`}>
                <h3 className={`font-semibold ${theme.textColors.primary} mb-4`}>
                  Asset Protection Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Total Assets:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatCurrency(analysis.totalAssets)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Current Liability Coverage:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatCurrency(analysis.totalLiability)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Coverage Ratio:</span>
                    <div className={`font-semibold ${
                      analysis.totalLiability >= analysis.totalAssets ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {((analysis.totalLiability / analysis.totalAssets) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-sm">
                    <span className={`${theme.textColors.secondary}`}>Asset Protection Level: </span>
                    <span className={
                      analysis.totalLiability >= analysis.totalAssets * 1.5 ? 'text-green-400' :
                      analysis.totalLiability >= analysis.totalAssets ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {analysis.totalLiability >= analysis.totalAssets * 1.5 ? 'Excellent' :
                       analysis.totalLiability >= analysis.totalAssets ? 'Good' : 'Insufficient'}
                    </span>
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary} mt-1`}>
                    Recommended coverage is 150% of total assets for comprehensive protection
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Coverage Cost Analysis
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Coverage Options</h4>
                      <div className="space-y-2 text-sm">
                        {[1000000, 2000000, 5000000, 10000000].map(coverage => {
                          const premium = (coverage / 1000000) * analysis.costPerMillion;
                          const isSelected = coverage === desiredCoverage;
                          return (
                            <div key={coverage} className={`flex justify-between p-2 rounded ${
                              isSelected ? 'bg-blue-900/20 border border-blue-500/20' : 'bg-slate-800/50'
                            }`}>
                              <span className={theme.textColors.primary}>
                                {formatCurrency(coverage)}
                              </span>
                              <span className={theme.textColors.primary}>
                                {formatCurrency(premium)}/year
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Cost Efficiency</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Cost per $100k assets:</span>
                          <span className={theme.textColors.primary}>
                            {formatCurrency((analysis.estimatedPremium / analysis.totalAssets) * 100000)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Cost as % of income:</span>
                          <span className={theme.textColors.primary}>
                            {((analysis.estimatedPremium / annualIncome) * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Break-even claim:</span>
                          <span className={theme.textColors.primary}>
                            {formatCurrency(analysis.estimatedPremium * 10)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg`}>
                    <div className="text-sm">
                      <span className={`font-medium ${theme.textColors.primary}`}>Value Proposition: </span>
                      <span className={theme.textColors.secondary}>
                        For {formatCurrency(analysis.estimatedPremium)} annually, you protect 
                        {formatCurrency(analysis.totalAssets)} in assets - a cost of just{' '}
                        {(((analysis.estimatedPremium / analysis.totalAssets) * 100)).toFixed(3)}% of your wealth.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Umbrella Policy Recommendations
                    </h4>
                    {analysis.recommendations.length > 0 ? (
                      <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index}>• {recommendation}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        Your current coverage appears adequate based on your risk profile.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Educational Notes */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  Umbrella Policy Essentials
                </h4>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• Umbrella policies require minimum underlying auto/home liability limits (typically $250k-$500k)</li>
                  <li>• Coverage extends beyond property damage to personal injury, legal defense costs, and libel/slander</li>
                  <li>• Most cost-effective insurance per dollar of coverage - typically $200-400 per million</li>
                  <li>• Provides worldwide coverage and pays even if underlying policy doesn&apos;t</li>
                  <li>• Essential for high-net-worth individuals, business owners, and those with elevated liability risk</li>
                  <li>• Legal defense costs are covered in addition to policy limits, not reducing available coverage</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

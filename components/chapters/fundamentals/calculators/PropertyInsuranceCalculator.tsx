'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Home,
  Car,
  DollarSign,
  Shield,
  AlertTriangle,
  Umbrella,
  Info,
  TrendingUp
} from 'lucide-react';

interface PropertyDetails {
  id: string;
  type: 'home' | 'condo' | 'rental' | 'auto' | 'motorcycle' | 'boat';
  name: string;
  value: number;
  liability: number;
  deductible: number;
  location: string;
  age: number;
  riskFactors: string[];
}

interface InsuranceAnalysis {
  totalCoverage: number;
  totalPremiums: number;
  liabilityGap: number;
  umbrellaRecommended: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
}

export default function PropertyInsuranceCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [netWorth, setNetWorth] = useState<number>(500000);
  const [annualIncome, setAnnualIncome] = useState<number>(75000);
  const [hasUmbrellaPolicy, setHasUmbrellaPolicy] = useState<boolean>(false);
  const [umbrellaAmount, setUmbrellaAmount] = useState<number>(1000000);
  const [riskTolerance, setRiskTolerance] = useState<string>('moderate');
  
  const [properties, setProperties] = useState<PropertyDetails[]>([
    {
      id: '1',
      type: 'home',
      name: 'Primary Residence',
      value: 350000,
      liability: 300000,
      deductible: 1000,
      location: 'suburban',
      age: 10,
      riskFactors: ['pool', 'trampoline']
    },
    {
      id: '2',
      type: 'auto',
      name: 'Family Car',
      value: 25000,
      liability: 250000,
      deductible: 500,
      location: 'suburban',
      age: 3,
      riskFactors: ['teen-driver']
    }
  ]);

  const [analysis, setAnalysis] = useState<InsuranceAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('property-insurance-calculator');
  }, [recordCalculatorUsage]);

  const riskFactorOptions = useMemo(() => ({
    home: ['pool', 'trampoline', 'dog', 'home-business', 'valuable-art', 'jewelry', 'firearms'],
    condo: ['valuable-art', 'jewelry', 'home-business', 'high-rise'],
    rental: ['rental-property', 'student-tenants', 'short-term-rental'],
    auto: ['teen-driver', 'sports-car', 'high-mileage', 'poor-credit', 'multiple-violations'],
    motorcycle: ['sports-bike', 'high-cc', 'track-use'],
    boat: ['saltwater', 'racing', 'commercial-use']
  }), []);

  const addProperty = () => {
    const newProperty: PropertyDetails = {
      id: Date.now().toString(),
      type: 'home',
      name: 'New Property',
      value: 200000,
      liability: 300000,
      deductible: 1000,
      location: 'suburban',
      age: 5,
      riskFactors: []
    };
    setProperties([...properties, newProperty]);
  };

  const updateProperty = (id: string, field: keyof PropertyDetails, value: string | number | string[]) => {
    setProperties(prev => prev.map(property => 
      property.id === id ? { ...property, [field]: value } : property
    ));
  };

  const removeProperty = (id: string) => {
    if (properties.length > 1) {
      setProperties(prev => prev.filter(property => property.id !== id));
    }
  };

  const toggleRiskFactor = (propertyId: string, riskFactor: string) => {
    setProperties(prev => prev.map(property => {
      if (property.id === propertyId) {
        const currentFactors = property.riskFactors;
        const newFactors = currentFactors.includes(riskFactor)
          ? currentFactors.filter(factor => factor !== riskFactor)
          : [...currentFactors, riskFactor];
        return { ...property, riskFactors: newFactors };
      }
      return property;
    }));
  };

  const calculatePremium = (property: PropertyDetails): number => {
    let basePremium = 0;
    
    // Base premium calculation by type
    switch (property.type) {
      case 'home':
        basePremium = property.value * 0.003; // 0.3% of home value
        break;
      case 'condo':
        basePremium = property.value * 0.002; // 0.2% of condo value
        break;
      case 'rental':
        basePremium = property.value * 0.005; // 0.5% for rental properties
        break;
      case 'auto':
        basePremium = Math.max(property.value * 0.08, 800); // 8% of car value, min $800
        break;
      case 'motorcycle':
        basePremium = Math.max(property.value * 0.12, 600); // 12% of bike value, min $600
        break;
      case 'boat':
        basePremium = property.value * 0.02; // 2% of boat value
        break;
    }
    
    // Location adjustments
    const locationMultiplier = {
      'urban': 1.3,
      'suburban': 1.0,
      'rural': 0.8,
      'high-risk': 1.8, // flood/hurricane/earthquake zones
      'low-risk': 0.9
    }[property.location] || 1.0;
    
    // Age adjustments
    let ageMultiplier = 1.0;
    if (property.type === 'home' || property.type === 'condo') {
      if (property.age > 30) ageMultiplier = 1.2;
      else if (property.age > 15) ageMultiplier = 1.1;
    } else if (property.type === 'auto') {
      if (property.age > 10) ageMultiplier = 0.8; // Older cars cost less to insure
      else if (property.age < 2) ageMultiplier = 1.2; // New cars cost more
    }
    
    // Risk factor adjustments
    const riskMultiplier = 1 + (property.riskFactors.length * 0.15); // 15% increase per risk factor
    
    // Deductible adjustments
    const deductibleMultiplier = property.deductible >= 2500 ? 0.85 : 
                                property.deductible >= 1000 ? 0.95 : 1.0;
    
    return basePremium * locationMultiplier * ageMultiplier * riskMultiplier * deductibleMultiplier;
  };

  const analyzeInsurance = useCallback(() => {
    let totalCoverage = 0;
    let totalPremiums = 0;
    let totalLiability = 0;
    let highRiskCount = 0;
    const recommendations: string[] = [];
    
    properties.forEach(property => {
      totalCoverage += property.value;
      totalLiability += property.liability;
      totalPremiums += calculatePremium(property);
      
      // Count high-risk properties
      if (property.riskFactors.length >= 2) {
        highRiskCount++;
      }
    });
    
    // Add umbrella policy if exists
    if (hasUmbrellaPolicy) {
      totalLiability += umbrellaAmount;
      totalPremiums += umbrellaAmount / 1000000 * 200; // ~$200 per million
    }
    
    // Calculate liability gap
    const recommendedLiability = Math.max(netWorth * 1.5, 1000000); // 1.5x net worth or $1M minimum
    const liabilityGap = Math.max(0, recommendedLiability - totalLiability);
    
    // Determine umbrella recommendation
    const umbrellaRecommended = netWorth > 500000 || annualIncome > 100000 || highRiskCount > 0;
    
    // Determine overall risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (highRiskCount >= 2 || liabilityGap > 500000) riskLevel = 'High';
    else if (highRiskCount >= 1 || liabilityGap > 100000) riskLevel = 'Medium';
    
    // Generate recommendations
    if (liabilityGap > 0) {
      recommendations.push(`Increase liability coverage by ${formatCurrency(liabilityGap)} to protect your assets`);
    }
    
    if (umbrellaRecommended && !hasUmbrellaPolicy) {
      recommendations.push('Consider an umbrella policy for additional liability protection');
    }
    
    // Property-specific recommendations
    properties.forEach(property => {
      const premium = calculatePremium(property);
      const premiumRatio = premium / property.value;
      
      if (premiumRatio > 0.1) { // Premium is more than 10% of value
        recommendations.push(`Consider higher deductible for ${property.name} to reduce premium`);
      }
      
      if (property.type === 'home' && property.value < property.liability) {
        recommendations.push(`Consider increasing dwelling coverage for ${property.name} - may be underinsured`);
      }
      
      if (property.riskFactors.length >= 3) {
        recommendations.push(`High risk factors for ${property.name} - consider risk mitigation strategies`);
      }
    });
    
    if (totalPremiums > annualIncome * 0.1) {
      recommendations.push('Insurance premiums exceed 10% of income - review coverage levels and deductibles');
    }
    
    const analysisResult: InsuranceAnalysis = {
      totalCoverage,
      totalPremiums,
      liabilityGap,
      umbrellaRecommended,
      riskLevel,
      recommendations
    };
    
    setAnalysis(analysisResult);
  }, [properties, netWorth, annualIncome, hasUmbrellaPolicy, umbrellaAmount]);

  useEffect(() => {
    analyzeInsurance();
  }, [analyzeInsurance]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'home':
      case 'condo':
      case 'rental':
        return Home;
      case 'auto':
      case 'motorcycle':
        return Car;
      case 'boat':
        return Shield;
      default:
        return Shield;
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-purple-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Property & Liability Insurance Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Financial Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Net Worth
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={netWorth}
                    onChange={(e) => setNetWorth(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="500000"
                  />
                </div>
              </div>

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
                    placeholder="75000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Risk Tolerance
                </label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                >
                  <option value="conservative">Conservative - Maximum Protection</option>
                  <option value="moderate">Moderate - Balanced Coverage</option>
                  <option value="aggressive">Aggressive - Cost-Focused</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Umbrella Policy
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasUmbrellaPolicy}
                  onChange={(e) => setHasUmbrellaPolicy(e.target.checked)}
                  className="mr-2"
                />
                <span className={`text-sm ${theme.textColors.primary}`}>Have Umbrella Policy</span>
              </label>
              
              {hasUmbrellaPolicy && (
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Umbrella Coverage Amount
                  </label>
                  <div className="relative">
                    <Umbrella className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={umbrellaAmount}
                      onChange={(e) => setUmbrellaAmount(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    >
                      <option value={1000000}>$1,000,000</option>
                      <option value={2000000}>$2,000,000</option>
                      <option value={5000000}>$5,000,000</option>
                      <option value={10000000}>$10,000,000</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Properties & Assets
              </h3>
              <button
                onClick={addProperty}
                className={`px-3 py-1 text-sm ${theme.buttons.secondary} rounded`}
              >
                Add Property
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {properties.map((property) => {
                const PropertyIcon = getPropertyIcon(property.type);
                return (
                  <div key={property.id} className={`p-4 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <PropertyIcon className="w-5 h-5 text-blue-400" />
                        <input
                          type="text"
                          value={property.name}
                          onChange={(e) => updateProperty(property.id, 'name', e.target.value)}
                          className={`bg-transparent ${theme.textColors.primary} font-medium border-none outline-none`}
                        />
                      </div>
                      <button
                        onClick={() => removeProperty(property.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Type</label>
                        <select
                          value={property.type}
                          onChange={(e) => updateProperty(property.id, 'type', e.target.value)}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        >
                          <option value="home">Home</option>
                          <option value="condo">Condo</option>
                          <option value="rental">Rental Property</option>
                          <option value="auto">Auto</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="boat">Boat</option>
                        </select>
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Value</label>
                        <input
                          type="number"
                          value={property.value}
                          onChange={(e) => updateProperty(property.id, 'value', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Liability Limit</label>
                        <input
                          type="number"
                          value={property.liability}
                          onChange={(e) => updateProperty(property.id, 'liability', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Deductible</label>
                        <input
                          type="number"
                          value={property.deductible}
                          onChange={(e) => updateProperty(property.id, 'deductible', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Location</label>
                        <select
                          value={property.location}
                          onChange={(e) => updateProperty(property.id, 'location', e.target.value)}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        >
                          <option value="urban">Urban</option>
                          <option value="suburban">Suburban</option>
                          <option value="rural">Rural</option>
                          <option value="high-risk">High Risk Zone</option>
                          <option value="low-risk">Low Risk Zone</option>
                        </select>
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Age (years)</label>
                        <input
                          type="number"
                          value={property.age}
                          onChange={(e) => updateProperty(property.id, 'age', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className={`${theme.textColors.secondary} text-xs`}>Risk Factors</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {riskFactorOptions[property.type]?.map(factor => (
                          <button
                            key={factor}
                            onClick={() => toggleRiskFactor(property.id, factor)}
                            className={`px-2 py-1 text-xs rounded ${
                              property.riskFactors.includes(factor)
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                            }`}
                          >
                            {factor.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <div className="flex justify-between text-xs">
                        <span className={`${theme.textColors.secondary}`}>Est. Annual Premium:</span>
                        <span className={`${theme.textColors.primary} font-semibold`}>
                          {formatCurrency(calculatePremium(property))}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Total Coverage</h4>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatCurrency(analysis.totalCoverage)}
                  </div>
                </div>

                <div className={`p-4 bg-green-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Annual Premiums</h4>
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(analysis.totalPremiums)}
                  </div>
                </div>

                <div className={`p-4 ${
                  analysis.liabilityGap > 0 ? 'bg-red-900/20' : 'bg-green-900/20'
                } border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-5 h-5 ${
                      analysis.liabilityGap > 0 ? 'text-red-400' : 'text-green-400'
                    }`} />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Liability Gap</h4>
                  </div>
                  <div className={`text-xl font-bold ${
                    analysis.liabilityGap > 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {analysis.liabilityGap > 0 ? formatCurrency(analysis.liabilityGap) : 'None'}
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg ${
                analysis.riskLevel === 'High' ? 'bg-red-900/20' :
                analysis.riskLevel === 'Medium' ? 'bg-yellow-900/20' : 'bg-green-900/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-5 h-5 ${
                    analysis.riskLevel === 'High' ? 'text-red-400' :
                    analysis.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Overall Risk Assessment</h4>
                </div>
                <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <div>
                    <span className="font-medium">Risk Level: </span>
                    <span className={
                      analysis.riskLevel === 'High' ? 'text-red-400' :
                      analysis.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }>{analysis.riskLevel}</span>
                  </div>
                  <div>
                    <span className="font-medium">Premium as % of Income: </span>
                    <span>{((analysis.totalPremiums / annualIncome) * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="font-medium">Umbrella Policy: </span>
                    <span className={analysis.umbrellaRecommended ? 'text-orange-400' : 'text-green-400'}>
                      {analysis.umbrellaRecommended ? 'Recommended' : 'Optional'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Breakdown */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Property Insurance Breakdown
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Property</th>
                        <th className="px-4 py-3 text-left">Value</th>
                        <th className="px-4 py-3 text-left">Liability</th>
                        <th className="px-4 py-3 text-left">Deductible</th>
                        <th className="px-4 py-3 text-left">Premium</th>
                        <th className="px-4 py-3 text-left">Risk Factors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {property.name}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(property.value)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(property.liability)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(property.deductible)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-semibold`}>
                            {formatCurrency(calculatePremium(property))}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                            {property.riskFactors.length || 'None'}
                          </td>
                        </tr>
                      ))}
                      {hasUmbrellaPolicy && (
                        <tr className={`border-t ${theme.borderColors.primary} bg-blue-900/10`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            Umbrella Policy
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            -
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(umbrellaAmount)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            -
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-semibold`}>
                            {formatCurrency(umbrellaAmount / 1000000 * 200)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                            Additional Liability
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Insurance Recommendations
                    </h4>
                    {analysis.recommendations.length > 0 ? (
                      <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index}>• {recommendation}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        Your insurance coverage appears adequate based on current assessment.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Educational Notes */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  Important Considerations
                </h4>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• This calculator provides estimates - actual premiums vary by insurer and detailed risk assessment</li>
                  <li>• Review coverage annually and after major life changes</li>
                  <li>• Higher deductibles typically lower premiums but increase out-of-pocket costs</li>
                  <li>• Umbrella policies require underlying auto/home liability minimums</li>
                  <li>• Consider replacement cost vs. actual cash value for property coverage</li>
                  <li>• Professional liability may be needed for certain occupations</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Home,
  DollarSign,
  Calculator,
  TrendingUp,
  PlusCircle,
  MinusCircle,
  Target,
  BarChart3,
  Star,
  MapPin,
  Building,
  ArrowRightLeft,
  AlertCircle,
  Trophy
} from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  downPayment: number;
  monthlyRent: number;
  monthlyExpenses: number;
  propertyType: 'Single Family' | 'Duplex' | 'Triplex' | 'Fourplex' | 'Apartment' | 'Condo';
  squareFootage: number;
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
  // Calculated metrics
  monthlyNetCashFlow?: number;
  cashOnCashReturn?: number;
  capRate?: number;
  pricePerSqFt?: number;
  rentToPrice?: number;
  score?: number;
  rank?: number;
}

interface ComparisonResult {
  bestCashFlow: Property | null;
  bestCashOnCash: Property | null;
  bestCapRate: Property | null;
  bestValue: Property | null;
  recommendations: string[];
  warnings: string[];
}

export default function RealEstateComparisonTool() {
  const { recordCalculatorUsage } = useProgressStore();

  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      name: 'Property A',
      address: '123 Main St',
      price: 300000,
      downPayment: 60000,
      monthlyRent: 2400,
      monthlyExpenses: 1200,
      propertyType: 'Single Family',
      squareFootage: 1800,
      yearBuilt: 2005,
      bedrooms: 3,
      bathrooms: 2
    },
    {
      id: '2',
      name: 'Property B',
      address: '456 Oak Ave',
      price: 425000,
      downPayment: 85000,
      monthlyRent: 3200,
      monthlyExpenses: 1600,
      propertyType: 'Duplex',
      squareFootage: 2400,
      yearBuilt: 1995,
      bedrooms: 4,
      bathrooms: 3
    }
  ]);

  const [comparison, setComparison] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    recordCalculatorUsage('real-estate-comparison-tool');
  }, [recordCalculatorUsage]);

  const addProperty = () => {
    const newProperty: Property = {
      id: Date.now().toString(),
      name: `Property ${String.fromCharCode(65 + properties.length)}`,
      address: '',
      price: 0,
      downPayment: 0,
      monthlyRent: 0,
      monthlyExpenses: 0,
      propertyType: 'Single Family',
      squareFootage: 0,
      yearBuilt: new Date().getFullYear(),
      bedrooms: 0,
      bathrooms: 0
    };
    setProperties([...properties, newProperty]);
  };

  const removeProperty = (id: string) => {
    if (properties.length > 1) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const updateProperty = (id: string, field: keyof Property, value: string | number) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculateMetrics = useCallback(() => {
    const calculatedProperties = properties.map(property => {
      const { price, downPayment, monthlyRent, monthlyExpenses, squareFootage } = property;
      
      // Basic calculations
      const monthlyNetCashFlow = monthlyRent - monthlyExpenses;
      const annualNetCashFlow = monthlyNetCashFlow * 12;
      const annualGrossRent = monthlyRent * 12;
      
      // Investment metrics
      const cashOnCashReturn = downPayment > 0 ? (annualNetCashFlow / downPayment) * 100 : 0;
      const capRate = price > 0 ? (annualGrossRent / price) * 100 : 0;
      const pricePerSqFt = squareFootage > 0 ? price / squareFootage : 0;
      const rentToPrice = price > 0 ? (monthlyRent / price) * 100 : 0;
      
      // Scoring system (0-100)
      let score = 0;
      
      // Cash flow score (30 points)
      if (monthlyNetCashFlow >= 500) score += 30;
      else if (monthlyNetCashFlow >= 300) score += 25;
      else if (monthlyNetCashFlow >= 100) score += 20;
      else if (monthlyNetCashFlow >= 0) score += 10;
      
      // Cash-on-cash return score (25 points)
      if (cashOnCashReturn >= 15) score += 25;
      else if (cashOnCashReturn >= 12) score += 20;
      else if (cashOnCashReturn >= 8) score += 15;
      else if (cashOnCashReturn >= 5) score += 10;
      else if (cashOnCashReturn >= 0) score += 5;
      
      // Cap rate score (20 points)
      if (capRate >= 10) score += 20;
      else if (capRate >= 8) score += 16;
      else if (capRate >= 6) score += 12;
      else if (capRate >= 4) score += 8;
      else if (capRate >= 2) score += 4;
      
      // 1% rule score (15 points)
      const onePercentRule = rentToPrice >= 1;
      if (onePercentRule) score += 15;
      else if (rentToPrice >= 0.8) score += 10;
      else if (rentToPrice >= 0.6) score += 5;
      
      // Property condition score (10 points)
      const currentYear = new Date().getFullYear();
      const propertyAge = currentYear - property.yearBuilt;
      if (propertyAge <= 10) score += 10;
      else if (propertyAge <= 20) score += 8;
      else if (propertyAge <= 30) score += 6;
      else if (propertyAge <= 40) score += 4;
      else score += 2;

      return {
        ...property,
        monthlyNetCashFlow,
        cashOnCashReturn,
        capRate,
        pricePerSqFt,
        rentToPrice,
        score
      };
    });

    // Add rankings
    const propertiesWithRanks = calculatedProperties
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .map((property, index) => ({
        ...property,
        rank: index + 1
      }));

    setProperties(propertiesWithRanks);

    // Generate comparison results
    const bestCashFlow = [...propertiesWithRanks].sort((a, b) => 
      (b.monthlyNetCashFlow || 0) - (a.monthlyNetCashFlow || 0)
    )[0];

    const bestCashOnCash = [...propertiesWithRanks].sort((a, b) => 
      (b.cashOnCashReturn || 0) - (a.cashOnCashReturn || 0)
    )[0];

    const bestCapRate = [...propertiesWithRanks].sort((a, b) => 
      (b.capRate || 0) - (a.capRate || 0)
    )[0];

    const bestValue = [...propertiesWithRanks].sort((a, b) => 
      (b.score || 0) - (a.score || 0)
    )[0];

    // Generate recommendations
    const recommendations: string[] = [];
    const warnings: string[] = [];

    if (bestValue && bestValue.score && bestValue.score >= 80) {
      recommendations.push(`${bestValue.name} shows excellent investment potential with high overall score`);
    }

    if (bestCashFlow && bestCashFlow.monthlyNetCashFlow && bestCashFlow.monthlyNetCashFlow >= 300) {
      recommendations.push(`${bestCashFlow.name} provides strong monthly cash flow for passive income`);
    }

    if (bestCashOnCash && bestCashOnCash.cashOnCashReturn && bestCashOnCash.cashOnCashReturn >= 12) {
      recommendations.push(`${bestCashOnCash.name} offers excellent return on your cash investment`);
    }

    // Check for warnings
    const negativeFlowProperties = propertiesWithRanks.filter(p => 
      p.monthlyNetCashFlow && p.monthlyNetCashFlow < 0
    );
    
    if (negativeFlowProperties.length > 0) {
      warnings.push(`${negativeFlowProperties.length} property(ies) have negative cash flow`);
    }

    const lowReturnProperties = propertiesWithRanks.filter(p => 
      p.cashOnCashReturn && p.cashOnCashReturn < 6
    );
    
    if (lowReturnProperties.length > 0) {
      warnings.push(`${lowReturnProperties.length} property(ies) have low cash-on-cash returns`);
    }

    const oldProperties = propertiesWithRanks.filter(p => 
      new Date().getFullYear() - p.yearBuilt > 40
    );
    
    if (oldProperties.length > 0) {
      warnings.push(`${oldProperties.length} property(ies) are over 40 years old - consider renovation costs`);
    }

    const comparisonResult: ComparisonResult = {
      bestCashFlow,
      bestCashOnCash,
      bestCapRate,
      bestValue,
      recommendations,
      warnings
    };

    setComparison(comparisonResult);
  }, [properties]);

  useEffect(() => {
    if (properties.every(p => p.price > 0 && p.monthlyRent > 0)) {
      calculateMetrics();
    }
  }, [properties, calculateMetrics]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent.toFixed(2)}%`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 2: return <Star className="w-4 h-4 text-gray-400" />;
      case 3: return <Target className="w-4 h-4 text-orange-400" />;
      default: return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-400">#{rank}</span>;
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <ArrowRightLeft className="w-6 h-6 text-cyan-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Real Estate Comparison Tool
        </h2>
        <button
          onClick={addProperty}
          className="ml-auto flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="space-y-8">
        {/* Property Input Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div key={property.id} className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {property.rank && getRankIcon(property.rank)}
                  <input
                    type="text"
                    value={property.name}
                    onChange={(e) => updateProperty(property.id, 'name', e.target.value)}
                    className={`text-lg font-semibold ${theme.textColors.primary} bg-transparent border-none outline-none`}
                    placeholder="Property Name"
                  />
                  {property.score && (
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(property.score)} bg-slate-700`}>
                      Score: {property.score.toFixed(0)}/100
                    </div>
                  )}
                </div>
                {properties.length > 1 && (
                  <button
                    onClick={() => removeProperty(property.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={property.address}
                      onChange={(e) => updateProperty(property.id, 'address', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder="Property address"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Property Type
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={property.propertyType}
                      onChange={(e) => updateProperty(property.id, 'propertyType', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                    >
                      <option value="Single Family">Single Family</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Triplex">Triplex</option>
                      <option value="Fourplex">Fourplex</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Condo">Condo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Purchase Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={property.price}
                      onChange={(e) => updateProperty(property.id, 'price', Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Down Payment
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={property.downPayment}
                      onChange={(e) => updateProperty(property.id, 'downPayment', Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Monthly Rent
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={property.monthlyRent}
                      onChange={(e) => updateProperty(property.id, 'monthlyRent', Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Monthly Expenses
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={property.monthlyExpenses}
                      onChange={(e) => updateProperty(property.id, 'monthlyExpenses', Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Square Footage
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={property.squareFootage}
                      onChange={(e) => updateProperty(property.id, 'squareFootage', Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Year Built
                  </label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={property.yearBuilt}
                      onChange={(e) => updateProperty(property.id, 'yearBuilt', Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder={new Date().getFullYear().toString()}
                    />
                  </div>
                </div>
              </div>

              {/* Property Metrics */}
              {property.monthlyNetCashFlow !== undefined && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className={`${theme.textColors.secondary}`}>Cash Flow</div>
                      <div className={`font-semibold ${
                        property.monthlyNetCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(property.monthlyNetCashFlow)}
                      </div>
                    </div>
                    <div>
                      <div className={`${theme.textColors.secondary}`}>CoC Return</div>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercent(property.cashOnCashReturn || 0)}
                      </div>
                    </div>
                    <div>
                      <div className={`${theme.textColors.secondary}`}>Cap Rate</div>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercent(property.capRate || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="space-y-6">
            {/* Winner Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 bg-green-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-green-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Best Overall Value</h4>
                </div>
                <div className="text-lg font-bold text-green-400">
                  {comparison.bestValue?.name || 'N/A'}
                </div>
                <div className={`text-xs ${theme.textColors.secondary}`}>
                  Score: {comparison.bestValue?.score?.toFixed(0) || 0}/100
                </div>
              </div>

              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Best Cash Flow</h4>
                </div>
                <div className="text-lg font-bold text-blue-400">
                  {comparison.bestCashFlow?.name || 'N/A'}
                </div>
                <div className={`text-xs ${theme.textColors.secondary}`}>
                  {formatCurrency(comparison.bestCashFlow?.monthlyNetCashFlow || 0)}/month
                </div>
              </div>

              <div className={`p-4 bg-purple-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Best CoC Return</h4>
                </div>
                <div className="text-lg font-bold text-purple-400">
                  {comparison.bestCashOnCash?.name || 'N/A'}
                </div>
                <div className={`text-xs ${theme.textColors.secondary}`}>
                  {formatPercent(comparison.bestCashOnCash?.cashOnCashReturn || 0)}
                </div>
              </div>

              <div className={`p-4 bg-orange-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Best Cap Rate</h4>
                </div>
                <div className="text-lg font-bold text-orange-400">
                  {comparison.bestCapRate?.name || 'N/A'}
                </div>
                <div className={`text-xs ${theme.textColors.secondary}`}>
                  {formatPercent(comparison.bestCapRate?.capRate || 0)}
                </div>
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
              <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                <h3 className={`font-semibold ${theme.textColors.primary}`}>
                  Detailed Property Comparison
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                    <tr>
                      <th className="px-4 py-3 text-left">Property</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Cash Flow</th>
                      <th className="px-4 py-3 text-left">CoC Return</th>
                      <th className="px-4 py-3 text-left">Cap Rate</th>
                      <th className="px-4 py-3 text-left">Price/SqFt</th>
                      <th className="px-4 py-3 text-left">Rent Ratio</th>
                      <th className="px-4 py-3 text-left">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id} className={`border-t ${theme.borderColors.primary}`}>
                        <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                          <div className="flex items-center gap-2">
                            {property.rank && getRankIcon(property.rank)}
                            {property.name}
                          </div>
                        </td>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                          {formatCurrency(property.price)}
                        </td>
                        <td className={`px-4 py-3 ${
                          property.monthlyNetCashFlow && property.monthlyNetCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {formatCurrency(property.monthlyNetCashFlow || 0)}
                        </td>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                          {formatPercent(property.cashOnCashReturn || 0)}
                        </td>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                          {formatPercent(property.capRate || 0)}
                        </td>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                          {property.pricePerSqFt ? formatCurrency(property.pricePerSqFt) : 'N/A'}
                        </td>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                          {formatPercent(property.rentToPrice || 0)}
                        </td>
                        <td className={`px-4 py-3 font-semibold ${
                          property.score ? getScoreColor(property.score) : theme.textColors.primary
                        }`}>
                          {property.score?.toFixed(0) || 0}/100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            {comparison.recommendations.length > 0 && (
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Investment Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {comparison.recommendations.map((recommendation, index) => (
                        <li key={index}>• {recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Warnings */}
            {comparison.warnings.length > 0 && (
              <div className={`p-4 bg-red-900/20 border border-red-500/20 rounded-lg`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold text-red-400 mb-2`}>
                      Investment Warnings
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {comparison.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Criteria Guide */}
            <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
              <h4 className={`font-semibold text-yellow-400 mb-2`}>
                Property Comparison Criteria
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className={`${theme.textColors.secondary} mb-2`}><strong>Scoring System (0-100):</strong></p>
                  <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                    <li>• Cash Flow (30 pts): Monthly net income potential</li>
                    <li>• Cash-on-Cash Return (25 pts): Annual return on investment</li>
                    <li>• Cap Rate (20 pts): Property yield without financing</li>
                    <li>• 1% Rule (15 pts): Monthly rent vs purchase price</li>
                    <li>• Property Age (10 pts): Construction year and condition</li>
                  </ul>
                </div>
                <div>
                  <p className={`${theme.textColors.secondary} mb-2`}><strong>Key Metrics:</strong></p>
                  <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                    <li>• <strong>Cash Flow:</strong> Rent minus all expenses</li>
                    <li>• <strong>CoC Return:</strong> Annual cash flow ÷ cash invested</li>
                    <li>• <strong>Cap Rate:</strong> Annual rent ÷ property value</li>
                    <li>• <strong>Rent Ratio:</strong> Monthly rent ÷ property value</li>
                    <li>• <strong>Price/SqFt:</strong> Property value ÷ square footage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

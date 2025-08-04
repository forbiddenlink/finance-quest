'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Calculator, DollarSign, AlertTriangle, Info } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface InheritanceData {
  estateValue: number;
  maritalStatus: 'single' | 'married';
  spouseEstateValue: number;
  priorGifts: number;
  spousePriorGifts: number;
  charitableBequest: number;
  state: string;
  relationshipToDeceased: 'spouse' | 'child' | 'grandchild' | 'sibling' | 'other';
  inheritanceAmount: number;
  assetType: 'cash' | 'real-estate' | 'stocks' | 'business' | 'retirement';
  holdingPeriod: number;
}

interface InheritanceResults {
  federalEstateTax: number;
  stateEstateTax: number;
  totalEstateTax: number;
  netInheritance: number;
  stepUpInBasis: number;
  inheritanceTaxLiability: number;
  effectiveTaxRate: number;
  taxStrategies: string[];
  stateSpecificInfo: {
    hasInheritanceTax: boolean;
    exemptionAmount: number;
    taxRate: number;
    description: string;
  };
}

const InheritanceTaxCalculator: React.FC = () => {
  const [inheritanceData, setInheritanceData] = useState<InheritanceData>({
    estateValue: 0,
    maritalStatus: 'single',
    spouseEstateValue: 0,
    priorGifts: 0,
    spousePriorGifts: 0,
    charitableBequest: 0,
    state: 'Pennsylvania',
    relationshipToDeceased: 'child',
    inheritanceAmount: 0,
    assetType: 'cash',
    holdingPeriod: 0
  });

  const [results, setResults] = useState<InheritanceResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('inheritance-tax-calculator');
  }, [recordCalculatorUsage]);

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (inheritanceData.estateValue < 0) {
      newErrors.estateValue = 'Estate value must be non-negative';
    }
    if (inheritanceData.maritalStatus === 'married' && inheritanceData.spouseEstateValue < 0) {
      newErrors.spouseEstateValue = 'Spouse estate value must be non-negative';
    }
    if (inheritanceData.priorGifts < 0) {
      newErrors.priorGifts = 'Prior gifts must be non-negative';
    }
    if (inheritanceData.charitableBequest < 0) {
      newErrors.charitableBequest = 'Charitable bequest must be non-negative';
    }
    if (inheritanceData.inheritanceAmount < 0) {
      newErrors.inheritanceAmount = 'Inheritance amount must be non-negative';
    }
    if (inheritanceData.inheritanceAmount > inheritanceData.estateValue) {
      newErrors.inheritanceAmount = 'Inheritance amount cannot exceed estate value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [inheritanceData]);

  const calculateInheritanceTax = useCallback((): InheritanceResults => {
    const federalExemption2024 = 13610000;
    
    // Calculate federal estate tax
    let taxableEstate = Math.max(0, inheritanceData.estateValue - inheritanceData.charitableBequest);
    let availableExemption = federalExemption2024 - inheritanceData.priorGifts;
    
    if (inheritanceData.maritalStatus === 'married') {
      // Portability allows use of deceased spouse's unused exemption
      availableExemption += Math.max(0, federalExemption2024 - inheritanceData.spousePriorGifts);
      // Unlimited marital deduction for spouse
      if (inheritanceData.relationshipToDeceased === 'spouse') {
        taxableEstate = 0; // No federal tax between spouses
      }
    }
    
    const federalTaxableAmount = Math.max(0, taxableEstate - availableExemption);
    const federalEstateTax = federalTaxableAmount * 0.40; // 40% federal rate

    // State estate tax calculations
    const stateEstateTaxRates: Record<string, { exemption: number; rate: number }> = {
      'Connecticut': { exemption: 9100000, rate: 0.128 },
      'Hawaii': { exemption: 5490000, rate: 0.20 },
      'Illinois': { exemption: 4000000, rate: 0.16 },
      'Maine': { exemption: 6410000, rate: 0.12 },
      'Maryland': { exemption: 5000000, rate: 0.16 },
      'Massachusetts': { exemption: 2000000, rate: 0.16 },
      'Minnesota': { exemption: 3000000, rate: 0.16 },
      'New York': { exemption: 6580000, rate: 0.16 },
      'Oregon': { exemption: 1000000, rate: 0.20 },
      'Rhode Island': { exemption: 1733264, rate: 0.16 },
      'Vermont': { exemption: 5000000, rate: 0.16 },
      'Washington': { exemption: 2193000, rate: 0.20 },
      'District of Columbia': { exemption: 4577800, rate: 0.16 }
    };

    let stateEstateTax = 0;
    if (stateEstateTaxRates[inheritanceData.state]) {
      const stateConfig = stateEstateTaxRates[inheritanceData.state];
      const stateTaxableEstate = Math.max(0, taxableEstate - stateConfig.exemption);
      stateEstateTax = stateTaxableEstate * stateConfig.rate;
    }

    // State inheritance tax calculations (tax on beneficiary)
    const stateInheritanceTaxRates: Record<string, Record<string, { exemption: number; rate: number }>> = {
      'Pennsylvania': {
        'spouse': { exemption: Infinity, rate: 0 },
        'child': { exemption: 0, rate: 0.045 },
        'grandchild': { exemption: 0, rate: 0.045 },
        'sibling': { exemption: 0, rate: 0.12 },
        'other': { exemption: 0, rate: 0.15 }
      },
      'Iowa': {
        'spouse': { exemption: Infinity, rate: 0 },
        'child': { exemption: Infinity, rate: 0 },
        'grandchild': { exemption: Infinity, rate: 0 },
        'sibling': { exemption: 25000, rate: 0.10 },
        'other': { exemption: 500, rate: 0.15 }
      },
      'Kentucky': {
        'spouse': { exemption: Infinity, rate: 0 },
        'child': { exemption: Infinity, rate: 0 },
        'grandchild': { exemption: Infinity, rate: 0 },
        'sibling': { exemption: 1000, rate: 0.10 },
        'other': { exemption: 500, rate: 0.16 }
      },
      'Maryland': {
        'spouse': { exemption: Infinity, rate: 0 },
        'child': { exemption: Infinity, rate: 0 },
        'grandchild': { exemption: Infinity, rate: 0 },
        'sibling': { exemption: 1000, rate: 0.10 },
        'other': { exemption: 1000, rate: 0.10 }
      },
      'Nebraska': {
        'spouse': { exemption: Infinity, rate: 0 },
        'child': { exemption: 40000, rate: 0.01 },
        'grandchild': { exemption: 40000, rate: 0.01 },
        'sibling': { exemption: 15000, rate: 0.13 },
        'other': { exemption: 10000, rate: 0.18 }
      },
      'New Jersey': {
        'spouse': { exemption: Infinity, rate: 0 },
        'child': { exemption: Infinity, rate: 0 },
        'grandchild': { exemption: Infinity, rate: 0 },
        'sibling': { exemption: 25000, rate: 0.11 },
        'other': { exemption: 500, rate: 0.16 }
      }
    };

    let inheritanceTaxLiability = 0;
    let stateSpecificInfo = {
      hasInheritanceTax: false,
      exemptionAmount: 0,
      taxRate: 0,
      description: 'No state inheritance tax'
    };

    if (stateInheritanceTaxRates[inheritanceData.state]) {
      const stateRates = stateInheritanceTaxRates[inheritanceData.state];
      const relationshipRate = stateRates[inheritanceData.relationshipToDeceased];
      
      if (relationshipRate) {
        stateSpecificInfo = {
          hasInheritanceTax: true,
          exemptionAmount: relationshipRate.exemption,
          taxRate: relationshipRate.rate * 100,
          description: `${inheritanceData.state} inheritance tax applies`
        };
        
        const taxableInheritance = Math.max(0, inheritanceData.inheritanceAmount - relationshipRate.exemption);
        inheritanceTaxLiability = taxableInheritance * relationshipRate.rate;
      }
    }

    // Calculate step-up in basis
    let stepUpInBasis = 0;
    if (inheritanceData.assetType === 'stocks' || inheritanceData.assetType === 'real-estate') {
      stepUpInBasis = inheritanceData.inheritanceAmount; // Full step-up for most assets
    } else if (inheritanceData.assetType === 'retirement') {
      stepUpInBasis = 0; // No step-up for retirement accounts
    }

    const totalEstateTax = federalEstateTax + stateEstateTax;
    const netInheritance = inheritanceData.inheritanceAmount - inheritanceTaxLiability;
    const effectiveTaxRate = inheritanceData.inheritanceAmount > 0 ? 
      (inheritanceTaxLiability / inheritanceData.inheritanceAmount) * 100 : 0;

    // Generate tax strategies
    const taxStrategies: string[] = [];
    
    if (federalEstateTax > 0) {
      taxStrategies.push('Consider lifetime gifting to reduce estate size');
      taxStrategies.push('Explore charitable planning for estate tax deductions');
    }
    
    if (inheritanceTaxLiability > 0) {
      taxStrategies.push('Consider relocating to a state without inheritance tax');
      taxStrategies.push('Structure gifts during lifetime to minimize inheritance tax');
    }
    
    if (inheritanceData.assetType === 'retirement') {
      taxStrategies.push('Plan required minimum distributions carefully for inherited IRAs');
      taxStrategies.push('Consider Roth conversion strategies for original account holder');
    }
    
    if (stepUpInBasis > 0) {
      taxStrategies.push('Take advantage of stepped-up basis for capital gains planning');
    }
    
    if (inheritanceData.relationshipToDeceased === 'spouse') {
      taxStrategies.push('Maximize portability election for unused estate tax exemption');
      taxStrategies.push('Consider disclaimer strategies for optimal tax planning');
    }
    
    if (stateEstateTax > 0) {
      taxStrategies.push('Explore state-specific estate planning opportunities');
      taxStrategies.push('Consider trusts for state tax minimization');
    }
    
    if (taxStrategies.length === 0) {
      taxStrategies.push('Current inheritance structure appears tax-efficient');
      taxStrategies.push('Monitor for changes in tax laws that may affect planning');
    }

    return {
      federalEstateTax,
      stateEstateTax,
      totalEstateTax,
      netInheritance,
      stepUpInBasis,
      inheritanceTaxLiability,
      effectiveTaxRate,
      taxStrategies,
      stateSpecificInfo
    };
  }, [inheritanceData]);

  const handleCalculate = useCallback(() => {
    if (validateInputs()) {
      const calculatedResults = calculateInheritanceTax();
      setResults(calculatedResults);
    }
  }, [validateInputs, calculateInheritanceTax]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: keyof InheritanceData, value: string | number) => {
    setInheritanceData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const stateOptions = [
    'Pennsylvania', 'Iowa', 'Kentucky', 'Maryland', 'Nebraska', 'New Jersey',
    'Connecticut', 'Hawaii', 'Illinois', 'Maine', 'Massachusetts', 'Minnesota',
    'New York', 'Oregon', 'Rhode Island', 'Vermont', 'Washington', 'District of Columbia',
    'Other'
  ];

  return (
    <div className={`min-h-screen p-4 ${theme.backgrounds.primary}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-4 flex items-center justify-center gap-3`}>
            <TrendingUp className="w-10 h-10 text-purple-400" />
            Inheritance Tax Calculator
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Calculate federal estate taxes, state inheritance taxes, and develop strategies 
            to minimize tax liability on inherited assets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Inheritance Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Estate Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Estate Information</h3>
                
                <div>
                  <Label htmlFor="estateValue" className={theme.textColors.secondary}>
                    Total Estate Value ($)
                  </Label>
                  <Input
                    id="estateValue"
                    type="number"
                    value={inheritanceData.estateValue || ''}
                    onChange={(e) => handleInputChange('estateValue', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Enter total estate value"
                  />
                  {errors.estateValue && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.estateValue}
                    </p>
                  )}
                </div>

                <div>
                  <Label className={theme.textColors.secondary}>Marital Status of Deceased</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="single"
                        checked={inheritanceData.maritalStatus === 'single'}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value as 'single' | 'married')}
                        className="text-purple-600"
                      />
                      <span className={theme.textColors.secondary}>Single</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="married"
                        checked={inheritanceData.maritalStatus === 'married'}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value as 'single' | 'married')}
                        className="text-purple-600"
                      />
                      <span className={theme.textColors.secondary}>Married</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priorGifts" className={theme.textColors.secondary}>
                    Prior Taxable Gifts by Deceased ($)
                  </Label>
                  <Input
                    id="priorGifts"
                    type="number"
                    value={inheritanceData.priorGifts || ''}
                    onChange={(e) => handleInputChange('priorGifts', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Previous gifts above annual exclusion"
                  />
                  {errors.priorGifts && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.priorGifts}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="charitableBequest" className={theme.textColors.secondary}>
                    Charitable Bequests ($)
                  </Label>
                  <Input
                    id="charitableBequest"
                    type="number"
                    value={inheritanceData.charitableBequest || ''}
                    onChange={(e) => handleInputChange('charitableBequest', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Amount left to charity"
                  />
                  {errors.charitableBequest && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.charitableBequest}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Beneficiary Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Beneficiary Information</h3>
                
                <div>
                  <Label className={theme.textColors.secondary}>Relationship to Deceased</Label>
                  <select
                    value={inheritanceData.relationshipToDeceased}
                    onChange={(e) => handleInputChange('relationshipToDeceased', e.target.value as InheritanceData['relationshipToDeceased'])}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="grandchild">Grandchild</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other Relative/Non-relative</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="inheritanceAmount" className={theme.textColors.secondary}>
                    Your Inheritance Amount ($)
                  </Label>
                  <Input
                    id="inheritanceAmount"
                    type="number"
                    value={inheritanceData.inheritanceAmount || ''}
                    onChange={(e) => handleInputChange('inheritanceAmount', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Amount you are inheriting"
                  />
                  {errors.inheritanceAmount && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.inheritanceAmount}
                    </p>
                  )}
                </div>

                <div>
                  <Label className={theme.textColors.secondary}>Primary Asset Type</Label>
                  <select
                    value={inheritanceData.assetType}
                    onChange={(e) => handleInputChange('assetType', e.target.value as InheritanceData['assetType'])}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    <option value="cash">Cash/Bank Accounts</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="stocks">Stocks/Securities</option>
                    <option value="business">Business Interests</option>
                    <option value="retirement">Retirement Accounts</option>
                  </select>
                </div>

                <div>
                  <Label className={theme.textColors.secondary}>State of Residence</Label>
                  <select
                    value={inheritanceData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    {stateOptions.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className={`w-full ${theme.buttons.primary}`}
                size="lg"
              >
                Calculate Inheritance Tax
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                  <CardHeader>
                    <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                      <DollarSign className="w-5 h-5" />
                      Tax Calculation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>Gross Inheritance</h3>
                        <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                          {formatCurrency(inheritanceData.inheritanceAmount)}
                        </p>
                      </div>
                      
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>Net Inheritance</h3>
                        <p className={`text-2xl font-bold text-green-400`}>
                          {formatCurrency(results.netInheritance)}
                        </p>
                      </div>
                    </div>

                    <Separator className="border-white/20" />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Federal Estate Tax (on estate):</span>
                        <span className={`font-semibold ${results.federalEstateTax > 0 ? 'text-red-400' : theme.textColors.primary}`}>
                          {formatCurrency(results.federalEstateTax)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>State Estate Tax (on estate):</span>
                        <span className={`font-semibold ${results.stateEstateTax > 0 ? 'text-red-400' : theme.textColors.primary}`}>
                          {formatCurrency(results.stateEstateTax)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Inheritance Tax (on beneficiary):</span>
                        <span className={`font-semibold ${results.inheritanceTaxLiability > 0 ? 'text-red-400' : theme.textColors.primary}`}>
                          {formatCurrency(results.inheritanceTaxLiability)}
                        </span>
                      </div>
                      
                      {results.stepUpInBasis > 0 && (
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Step-up in Basis:</span>
                          <span className="font-semibold text-green-400">
                            {formatCurrency(results.stepUpInBasis)}
                          </span>
                        </div>
                      )}
                      
                      <Separator className="border-white/20" />
                      
                      <div className="flex justify-between text-lg">
                        <span className={`font-semibold ${theme.textColors.secondary}`}>Your Tax Liability:</span>
                        <span className={`font-bold ${results.inheritanceTaxLiability > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatCurrency(results.inheritanceTaxLiability)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Effective Tax Rate:</span>
                        <span className={`font-semibold ${results.effectiveTaxRate > 0 ? 'text-red-400' : theme.textColors.primary}`}>
                          {results.effectiveTaxRate.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* State-Specific Information */}
                <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                  <CardHeader>
                    <CardTitle className={`${theme.textColors.primary}`}>
                      {inheritanceData.state} Tax Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Has Inheritance Tax:</span>
                      <span className={`font-semibold ${results.stateSpecificInfo.hasInheritanceTax ? 'text-red-400' : 'text-green-400'}`}>
                        {results.stateSpecificInfo.hasInheritanceTax ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    {results.stateSpecificInfo.hasInheritanceTax && (
                      <>
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Exemption Amount:</span>
                          <span className={`font-semibold ${theme.textColors.primary}`}>
                            {results.stateSpecificInfo.exemptionAmount === Infinity ? 
                              'Unlimited' : formatCurrency(results.stateSpecificInfo.exemptionAmount)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Tax Rate:</span>
                          <span className={`font-semibold ${theme.textColors.primary}`}>
                            {results.stateSpecificInfo.taxRate}%
                          </span>
                        </div>
                      </>
                    )}
                    
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      {results.stateSpecificInfo.description}
                    </p>
                  </CardContent>
                </Card>

                <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                  <CardHeader>
                    <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                      <Info className="w-5 h-5" />
                      Tax Minimization Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.taxStrategies.map((strategy, index) => (
                        <li key={index} className={`${theme.textColors.secondary} flex items-start gap-2`}>
                          <span className="text-purple-400 mt-1">•</span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className={`bg-purple-50/10 border border-purple-200/20`}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Important Considerations</h3>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Federal estate tax applies to the entire estate before distribution</li>
                      <li>• State inheritance tax is paid by the beneficiary on their portion</li>
                      <li>• Step-up in basis eliminates capital gains tax on appreciation</li>
                      <li>• Spouses generally receive unlimited exemptions</li>
                      <li>• State laws vary significantly - consult local tax professional</li>
                      <li>• This calculator provides estimates - actual results may vary</li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InheritanceTaxCalculator;

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FileText, Calculator, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface EstateData {
  totalAssets: number;
  totalDebts: number;
  maritalStatus: 'single' | 'married';
  spouseAssets: number;
  exemptionUsed: number;
  spouseExemptionUsed: number;
  annualGifts: number;
  charitableGifts: number;
  state: string;
}

interface EstateResults {
  netEstate: number;
  combinedEstate: number;
  federalExemption: number;
  availableExemption: number;
  taxableEstate: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  taxRate: number;
  estateAfterTax: number;
  recommendations: string[];
}

const EstatePlanningCalculator: React.FC = () => {
  const [estateData, setEstateData] = useState<EstateData>({
    totalAssets: 0,
    totalDebts: 0,
    maritalStatus: 'single',
    spouseAssets: 0,
    exemptionUsed: 0,
    spouseExemptionUsed: 0,
    annualGifts: 0,
    charitableGifts: 0,
    state: 'None'
  });

  const [results, setResults] = useState<EstateResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('estate-planning-calculator');
  }, [recordCalculatorUsage]);

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (estateData.totalAssets < 0) {
      newErrors.totalAssets = 'Total assets must be non-negative';
    }
    if (estateData.totalDebts < 0) {
      newErrors.totalDebts = 'Total debts must be non-negative';
    }
    if (estateData.totalDebts > estateData.totalAssets) {
      newErrors.totalDebts = 'Total debts cannot exceed total assets';
    }
    if (estateData.maritalStatus === 'married' && estateData.spouseAssets < 0) {
      newErrors.spouseAssets = 'Spouse assets must be non-negative';
    }
    if (estateData.exemptionUsed < 0 || estateData.exemptionUsed > 13610000) {
      newErrors.exemptionUsed = 'Exemption used must be between $0 and $13.61M';
    }
    if (estateData.maritalStatus === 'married' && (estateData.spouseExemptionUsed < 0 || estateData.spouseExemptionUsed > 13610000)) {
      newErrors.spouseExemptionUsed = 'Spouse exemption used must be between $0 and $13.61M';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [estateData]);

  const calculateEstate = useCallback((): EstateResults => {
    const federalExemption = 13610000; // 2024 federal exemption
    const netEstate = Math.max(0, estateData.totalAssets - estateData.totalDebts);
    
    let combinedEstate = netEstate;
    let availableExemption = federalExemption - estateData.exemptionUsed;
    
    if (estateData.maritalStatus === 'married') {
      combinedEstate = netEstate + estateData.spouseAssets;
      // Portability - can use deceased spouse's unused exemption
      availableExemption += (federalExemption - estateData.spouseExemptionUsed);
    }

    // Reduce estate by charitable gifts
    const adjustedEstate = Math.max(0, combinedEstate - estateData.charitableGifts);
    
    const taxableEstate = Math.max(0, adjustedEstate - availableExemption);
    const federalTax = taxableEstate * 0.40; // 40% federal rate
    
    // State estate tax calculations (simplified)
    const stateTaxRates: Record<string, number> = {
      'Connecticut': 0.128,
      'Hawaii': 0.20,
      'Illinois': 0.16,
      'Maine': 0.12,
      'Maryland': 0.16,
      'Massachusetts': 0.16,
      'Minnesota': 0.16,
      'New York': 0.16,
      'Oregon': 0.20,
      'Rhode Island': 0.16,
      'Vermont': 0.16,
      'Washington': 0.20,
      'District of Columbia': 0.16
    };
    
    const stateExemptions: Record<string, number> = {
      'Connecticut': 9100000,
      'Hawaii': 5490000,
      'Illinois': 4000000,
      'Maine': 6410000,
      'Maryland': 5000000,
      'Massachusetts': 2000000,
      'Minnesota': 3000000,
      'New York': 6580000,
      'Oregon': 1000000,
      'Rhode Island': 1733264,
      'Vermont': 5000000,
      'Washington': 2193000,
      'District of Columbia': 4577800
    };

    let stateTax = 0;
    if (stateTaxRates[estateData.state] && stateExemptions[estateData.state]) {
      const stateExemption = stateExemptions[estateData.state];
      const stateTaxableEstate = Math.max(0, adjustedEstate - stateExemption);
      stateTax = stateTaxableEstate * stateTaxRates[estateData.state];
    }

    const totalTax = federalTax + stateTax;
    const taxRate = combinedEstate > 0 ? (totalTax / combinedEstate) * 100 : 0;
    const estateAfterTax = Math.max(0, combinedEstate - totalTax);

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (taxableEstate > 0) {
      recommendations.push('Consider lifetime gifting strategies to reduce estate size');
      recommendations.push('Explore charitable giving for tax deductions and legacy benefits');
    }
    
    if (estateData.maritalStatus === 'married' && availableExemption < federalExemption * 2) {
      recommendations.push('Maximize portability election to preserve spouse\'s unused exemption');
    }
    
    if (stateTax > 0) {
      recommendations.push('Consider relocating to a state without estate tax');
      recommendations.push('Explore state-specific trust strategies');
    }
    
    if (netEstate > 1000000) {
      recommendations.push('Consider establishing irrevocable trusts for wealth transfer');
      recommendations.push('Review business succession planning strategies');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Your estate plan appears tax-efficient under current law');
      recommendations.push('Review plan regularly as laws and circumstances change');
    }

    return {
      netEstate,
      combinedEstate,
      federalExemption,
      availableExemption,
      taxableEstate,
      federalTax,
      stateTax,
      totalTax,
      taxRate,
      estateAfterTax,
      recommendations
    };
  }, [estateData]);

  const handleCalculate = useCallback(() => {
    if (validateInputs()) {
      const calculatedResults = calculateEstate();
      setResults(calculatedResults);
    }
  }, [validateInputs, calculateEstate]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: keyof EstateData, value: string | number) => {
    setEstateData(prev => ({
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
    'None',
    'Connecticut',
    'Hawaii', 
    'Illinois',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Minnesota',
    'New York',
    'Oregon',
    'Rhode Island',
    'Vermont',
    'Washington',
    'District of Columbia'
  ];

  return (
    <div className={`min-h-screen p-4 ${theme.backgrounds.primary}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-4 flex items-center justify-center gap-3`}>
            <FileText className="w-10 h-10 text-blue-400" />
            Estate Planning Calculator
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Calculate estate taxes and develop comprehensive wealth transfer strategies 
            for effective estate planning and tax minimization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Estate Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Asset Information</h3>
                
                <div>
                  <Label htmlFor="totalAssets" className={theme.textColors.secondary}>
                    Total Assets ($)
                  </Label>
                  <Input
                    id="totalAssets"
                    type="number"
                    value={estateData.totalAssets || ''}
                    onChange={(e) => handleInputChange('totalAssets', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Enter total asset value"
                  />
                  {errors.totalAssets && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.totalAssets}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="totalDebts" className={theme.textColors.secondary}>
                    Total Debts ($)
                  </Label>
                  <Input
                    id="totalDebts"
                    type="number"
                    value={estateData.totalDebts || ''}
                    onChange={(e) => handleInputChange('totalDebts', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Enter total debt amount"
                  />
                  {errors.totalDebts && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.totalDebts}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Marital Status */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Marital Status</h3>
                
                <div>
                  <Label className={theme.textColors.secondary}>Marital Status</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="single"
                        checked={estateData.maritalStatus === 'single'}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value as 'single' | 'married')}
                        className="text-blue-600"
                      />
                      <span className={theme.textColors.secondary}>Single</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="married"
                        checked={estateData.maritalStatus === 'married'}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value as 'single' | 'married')}
                        className="text-blue-600"
                      />
                      <span className={theme.textColors.secondary}>Married</span>
                    </label>
                  </div>
                </div>

                {estateData.maritalStatus === 'married' && (
                  <div>
                    <Label htmlFor="spouseAssets" className={theme.textColors.secondary}>
                      Spouse Assets ($)
                    </Label>
                    <Input
                      id="spouseAssets"
                      type="number"
                      value={estateData.spouseAssets || ''}
                      onChange={(e) => handleInputChange('spouseAssets', parseFloat(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Enter spouse's asset value"
                    />
                    {errors.spouseAssets && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.spouseAssets}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Separator className="border-white/20" />

              {/* Tax Planning */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Tax Planning</h3>
                
                <div>
                  <Label htmlFor="exemptionUsed" className={theme.textColors.secondary}>
                    Federal Exemption Already Used ($)
                  </Label>
                  <Input
                    id="exemptionUsed"
                    type="number"
                    value={estateData.exemptionUsed || ''}
                    onChange={(e) => handleInputChange('exemptionUsed', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Amount of exemption previously used"
                  />
                  {errors.exemptionUsed && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.exemptionUsed}
                    </p>
                  )}
                </div>

                {estateData.maritalStatus === 'married' && (
                  <div>
                    <Label htmlFor="spouseExemptionUsed" className={theme.textColors.secondary}>
                      Spouse Exemption Used ($)
                    </Label>
                    <Input
                      id="spouseExemptionUsed"
                      type="number"
                      value={estateData.spouseExemptionUsed || ''}
                      onChange={(e) => handleInputChange('spouseExemptionUsed', parseFloat(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Spouse exemption previously used"
                    />
                    {errors.spouseExemptionUsed && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.spouseExemptionUsed}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="charitableGifts" className={theme.textColors.secondary}>
                    Charitable Gifts ($)
                  </Label>
                  <Input
                    id="charitableGifts"
                    type="number"
                    value={estateData.charitableGifts || ''}
                    onChange={(e) => handleInputChange('charitableGifts', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Planned charitable gifts"
                  />
                </div>

                <div>
                  <Label htmlFor="state" className={theme.textColors.secondary}>
                    State (for state estate tax)
                  </Label>
                  <select
                    id="state"
                    value={estateData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    {stateOptions.map(state => (
                      <option key={state} value={state}>
                        {state === 'None' ? 'No State Estate Tax' : state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Calculate Estate Plan
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
                      <TrendingUp className="w-5 h-5" />
                      Estate Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>Net Estate</h3>
                        <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                          {formatCurrency(results.netEstate)}
                        </p>
                      </div>
                      
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>
                          {estateData.maritalStatus === 'married' ? 'Combined Estate' : 'Total Estate'}
                        </h3>
                        <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                          {formatCurrency(results.combinedEstate)}
                        </p>
                      </div>
                    </div>

                    <Separator className="border-white/20" />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Available Exemption:</span>
                        <span className={`font-semibold ${theme.textColors.primary}`}>
                          {formatCurrency(results.availableExemption)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Taxable Estate:</span>
                        <span className={`font-semibold ${results.taxableEstate > 0 ? 'text-red-400' : theme.textColors.primary}`}>
                          {formatCurrency(results.taxableEstate)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Federal Estate Tax:</span>
                        <span className={`font-semibold ${results.federalTax > 0 ? 'text-red-400' : theme.textColors.primary}`}>
                          {formatCurrency(results.federalTax)}
                        </span>
                      </div>
                      
                      {results.stateTax > 0 && (
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>State Estate Tax:</span>
                          <span className="font-semibold text-red-400">
                            {formatCurrency(results.stateTax)}
                          </span>
                        </div>
                      )}
                      
                      <Separator className="border-white/20" />
                      
                      <div className="flex justify-between text-lg">
                        <span className={`font-semibold ${theme.textColors.secondary}`}>Total Tax:</span>
                        <span className={`font-bold ${results.totalTax > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatCurrency(results.totalTax)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-lg">
                        <span className={`font-semibold ${theme.textColors.secondary}`}>Estate After Tax:</span>
                        <span className={`font-bold text-green-400`}>
                          {formatCurrency(results.estateAfterTax)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Effective Tax Rate:</span>
                        <span className={`font-semibold ${results.taxRate > 0 ? 'text-red-400' : theme.textColors.primary}`}>
                          {results.taxRate.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                  <CardHeader>
                    <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                      <Info className="w-5 h-5" />
                      Planning Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.recommendations.map((recommendation, index) => (
                        <li key={index} className={`${theme.textColors.secondary} flex items-start gap-2`}>
                          <span className="text-blue-400 mt-1">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className={`bg-blue-50/10 border border-blue-200/20`}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Important Notes</h3>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Calculations use 2024 federal exemption of $13.61 million per person</li>
                      <li>• Federal estate tax rate is 40% on amounts above exemption</li>
                      <li>• State tax calculations are simplified estimates</li>
                      <li>• Annual gift exclusion for 2024 is $18,000 per recipient</li>
                      <li>• Consult with estate planning attorney for comprehensive planning</li>
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

export default EstatePlanningCalculator;

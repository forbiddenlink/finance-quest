'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Calculator, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface TrustData {
  trustType: 'revocable' | 'irrevocable' | 'charitable' | 'dynasty';
  initialFunding: number;
  annualContributions: number;
  expectedReturn: number;
  trustTermYears: number;
  grantorage: number;
  beneficiaryAge: number;
  currentTaxRate: number;
  estateTaxRate: number;
  giftTaxExemption: number;
  distributionSchedule: 'immediate' | 'age-based' | 'income-only' | 'discretionary';
  charitablePercentage: number;
}

interface TrustResults {
  trustValue: number;
  taxSavings: number;
  giftTaxLiability: number;
  netBenefit: number;
  distributionValue: number;
  charitableDeduction: number;
  protectedAssets: number;
  recommendations: string[];
  projections: Array<{
    year: number;
    trustValue: number;
    distributions: number;
    taxSavings: number;
  }>;
}

const TrustAnalysisCalculator: React.FC = () => {
  const [trustData, setTrustData] = useState<TrustData>({
    trustType: 'revocable',
    initialFunding: 0,
    annualContributions: 0,
    expectedReturn: 7,
    trustTermYears: 10,
    grantorage: 65,
    beneficiaryAge: 35,
    currentTaxRate: 37,
    estateTaxRate: 40,
    giftTaxExemption: 13610000,
    distributionSchedule: 'discretionary',
    charitablePercentage: 0
  });

  const [results, setResults] = useState<TrustResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('trust-analysis-calculator');
  }, [recordCalculatorUsage]);

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (trustData.initialFunding < 0) {
      newErrors.initialFunding = 'Initial funding must be non-negative';
    }
    if (trustData.annualContributions < 0) {
      newErrors.annualContributions = 'Annual contributions must be non-negative';
    }
    if (trustData.expectedReturn < 0 || trustData.expectedReturn > 50) {
      newErrors.expectedReturn = 'Expected return must be between 0% and 50%';
    }
    if (trustData.trustTermYears < 1 || trustData.trustTermYears > 100) {
      newErrors.trustTermYears = 'Trust term must be between 1 and 100 years';
    }
    if (trustData.grantorage < 18 || trustData.grantorage > 120) {
      newErrors.grantorage = 'Grantor age must be between 18 and 120';
    }
    if (trustData.beneficiaryAge < 0 || trustData.beneficiaryAge > 120) {
      newErrors.beneficiaryAge = 'Beneficiary age must be between 0 and 120';
    }
    if (trustData.currentTaxRate < 0 || trustData.currentTaxRate > 50) {
      newErrors.currentTaxRate = 'Tax rate must be between 0% and 50%';
    }
    if (trustData.charitablePercentage < 0 || trustData.charitablePercentage > 100) {
      newErrors.charitablePercentage = 'Charitable percentage must be between 0% and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [trustData]);

  const calculateTrust = useCallback((): TrustResults => {
    const annualReturn = trustData.expectedReturn / 100;
    const currentTaxDecimal = trustData.currentTaxRate / 100;
    const estateTaxDecimal = trustData.estateTaxRate / 100;
    
    let trustValue = trustData.initialFunding;
    let totalTaxSavings = 0;
    let totalDistributions = 0;
    let giftTaxLiability = 0;
    
    const projections: Array<{
      year: number;
      trustValue: number;
      distributions: number;
      taxSavings: number;
    }> = [];

    // Calculate gift tax on initial funding and contributions
    const totalGifts = trustData.initialFunding + (trustData.annualContributions * trustData.trustTermYears);
    if (totalGifts > trustData.giftTaxExemption) {
      giftTaxLiability = (totalGifts - trustData.giftTaxExemption) * 0.40; // 40% gift tax rate
    }

    // Calculate year-by-year projections
    for (let year = 1; year <= trustData.trustTermYears; year++) {
      // Add annual contribution
      trustValue += trustData.annualContributions;
      
      // Apply investment growth
      trustValue *= (1 + annualReturn);
      
      // Calculate distributions based on schedule
      let yearlyDistribution = 0;
      switch (trustData.distributionSchedule) {
        case 'immediate':
          yearlyDistribution = trustValue * 0.05; // 5% annual distribution
          break;
        case 'age-based':
          if (trustData.beneficiaryAge + year >= 25) {
            yearlyDistribution = trustValue * 0.04; // 4% after age 25
          }
          break;
        case 'income-only':
          yearlyDistribution = trustValue * annualReturn * 0.5; // 50% of income
          break;
        case 'discretionary':
          yearlyDistribution = trustValue * 0.03; // 3% discretionary
          break;
      }
      
      // Apply charitable percentage if applicable
      if (trustData.trustType === 'charitable' && trustData.charitablePercentage > 0) {
        const charitableAmount = yearlyDistribution * (trustData.charitablePercentage / 100);
        yearlyDistribution -= charitableAmount;
      }
      
      trustValue -= yearlyDistribution;
      totalDistributions += yearlyDistribution;
      
      // Calculate tax savings based on trust type
      let yearlyTaxSavings = 0;
      switch (trustData.trustType) {
        case 'revocable':
          // No estate tax savings during grantor's lifetime
          yearlyTaxSavings = 0;
          break;
        case 'irrevocable':
          // Estate tax savings on growth
          yearlyTaxSavings = (trustData.annualContributions * annualReturn) * estateTaxDecimal;
          break;
        case 'charitable':
          // Income tax deduction + estate tax savings
          yearlyTaxSavings = (trustData.annualContributions * currentTaxDecimal) + 
                           (trustData.annualContributions * annualReturn * estateTaxDecimal);
          break;
        case 'dynasty':
          // Generation-skipping tax savings
          yearlyTaxSavings = (trustData.annualContributions * annualReturn) * 0.40; // GST rate
          break;
      }
      
      totalTaxSavings += yearlyTaxSavings;
      
      projections.push({
        year,
        trustValue,
        distributions: yearlyDistribution,
        taxSavings: yearlyTaxSavings
      });
    }

    // Calculate charitable deduction
    let charitableDeduction = 0;
    if (trustData.trustType === 'charitable') {
      charitableDeduction = trustData.initialFunding * (trustData.charitablePercentage / 100) * currentTaxDecimal;
    }

    // Protected assets (amount removed from estate)
    let protectedAssets = 0;
    if (trustData.trustType === 'irrevocable' || trustData.trustType === 'dynasty') {
      protectedAssets = totalGifts + (trustValue - totalGifts); // Principal + growth
    }

    const netBenefit = totalTaxSavings + charitableDeduction - giftTaxLiability;

    // Generate recommendations
    const recommendations: string[] = [];
    
    switch (trustData.trustType) {
      case 'revocable':
        recommendations.push('Consider converting to irrevocable trust for estate tax benefits');
        recommendations.push('Revocable trusts provide probate avoidance and privacy');
        break;
      case 'irrevocable':
        recommendations.push('Maximize annual gift exclusions to reduce transfer costs');
        recommendations.push('Consider income tax implications of trust distributions');
        break;
      case 'charitable':
        recommendations.push('Optimize charitable percentage for maximum tax benefits');
        recommendations.push('Consider charitable lead trust for additional benefits');
        break;
      case 'dynasty':
        recommendations.push('Ensure GST exemption allocation is optimized');
        recommendations.push('Consider perpetual trust provisions where allowed');
        break;
    }
    
    if (giftTaxLiability > 0) {
      recommendations.push('Consider spreading contributions over multiple years to minimize gift tax');
    }
    
    if (netBenefit > 0) {
      recommendations.push('Trust structure provides significant tax benefits');
    } else {
      recommendations.push('Consider alternative trust structures or timing');
    }

    return {
      trustValue,
      taxSavings: totalTaxSavings,
      giftTaxLiability,
      netBenefit,
      distributionValue: totalDistributions,
      charitableDeduction,
      protectedAssets,
      recommendations,
      projections
    };
  }, [trustData]);

  const handleCalculate = useCallback(() => {
    if (validateInputs()) {
      const calculatedResults = calculateTrust();
      setResults(calculatedResults);
    }
  }, [validateInputs, calculateTrust]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: keyof TrustData, value: string | number) => {
    setTrustData(prev => ({
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

  return (
    <div className={`min-h-screen p-4 ${theme.backgrounds.primary}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${theme.textColors.primary} mb-4 flex items-center justify-center gap-3`}>
            <Shield className="w-10 h-10 text-green-400" />
            Trust Analysis Calculator
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Analyze different trust structures to optimize tax benefits, asset protection, 
            and wealth transfer strategies for your specific situation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Trust Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trust Type */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Trust Type</h3>
                
                <div>
                  <Label className={theme.textColors.secondary}>Trust Structure</Label>
                  <select
                    value={trustData.trustType}
                    onChange={(e) => handleInputChange('trustType', e.target.value as TrustData['trustType'])}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    <option value="revocable">Revocable Living Trust</option>
                    <option value="irrevocable">Irrevocable Trust</option>
                    <option value="charitable">Charitable Remainder Trust</option>
                    <option value="dynasty">Dynasty Trust</option>
                  </select>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Funding Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Funding Details</h3>
                
                <div>
                  <Label htmlFor="initialFunding" className={theme.textColors.secondary}>
                    Initial Funding ($)
                  </Label>
                  <Input
                    id="initialFunding"
                    type="number"
                    value={trustData.initialFunding || ''}
                    onChange={(e) => handleInputChange('initialFunding', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Enter initial trust funding"
                  />
                  {errors.initialFunding && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.initialFunding}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="annualContributions" className={theme.textColors.secondary}>
                    Annual Contributions ($)
                  </Label>
                  <Input
                    id="annualContributions"
                    type="number"
                    value={trustData.annualContributions || ''}
                    onChange={(e) => handleInputChange('annualContributions', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Annual funding amount"
                  />
                  {errors.annualContributions && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.annualContributions}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expectedReturn" className={theme.textColors.secondary}>
                    Expected Annual Return (%)
                  </Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    step="0.1"
                    value={trustData.expectedReturn || ''}
                    onChange={(e) => handleInputChange('expectedReturn', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Expected investment return"
                  />
                  {errors.expectedReturn && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.expectedReturn}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="trustTermYears" className={theme.textColors.secondary}>
                    Trust Term (Years)
                  </Label>
                  <Input
                    id="trustTermYears"
                    type="number"
                    value={trustData.trustTermYears || ''}
                    onChange={(e) => handleInputChange('trustTermYears', parseInt(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Trust duration in years"
                  />
                  {errors.trustTermYears && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.trustTermYears}
                    </p>
                  )}
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Beneficiary Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Participants</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grantorage" className={theme.textColors.secondary}>
                      Grantor Age
                    </Label>
                    <Input
                      id="grantorage"
                      type="number"
                      value={trustData.grantorage || ''}
                      onChange={(e) => handleInputChange('grantorage', parseInt(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Grantor's current age"
                    />
                    {errors.grantorage && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.grantorage}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="beneficiaryAge" className={theme.textColors.secondary}>
                      Beneficiary Age
                    </Label>
                    <Input
                      id="beneficiaryAge"
                      type="number"
                      value={trustData.beneficiaryAge || ''}
                      onChange={(e) => handleInputChange('beneficiaryAge', parseInt(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Primary beneficiary age"
                    />
                    {errors.beneficiaryAge && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.beneficiaryAge}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className={theme.textColors.secondary}>Distribution Schedule</Label>
                  <select
                    value={trustData.distributionSchedule}
                    onChange={(e) => handleInputChange('distributionSchedule', e.target.value as TrustData['distributionSchedule'])}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    <option value="immediate">Immediate (5% annually)</option>
                    <option value="age-based">Age-Based (4% after 25)</option>
                    <option value="income-only">Income Only (50% of earnings)</option>
                    <option value="discretionary">Discretionary (3% annually)</option>
                  </select>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Tax Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Tax Rates</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentTaxRate" className={theme.textColors.secondary}>
                      Current Tax Rate (%)
                    </Label>
                    <Input
                      id="currentTaxRate"
                      type="number"
                      step="0.1"
                      value={trustData.currentTaxRate || ''}
                      onChange={(e) => handleInputChange('currentTaxRate', parseFloat(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Current income tax rate"
                    />
                    {errors.currentTaxRate && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.currentTaxRate}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="giftTaxExemption" className={theme.textColors.secondary}>
                      Available Gift Exemption ($)
                    </Label>
                    <Input
                      id="giftTaxExemption"
                      type="number"
                      value={trustData.giftTaxExemption || ''}
                      onChange={(e) => handleInputChange('giftTaxExemption', parseFloat(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Remaining gift tax exemption"
                    />
                  </div>
                </div>

                {trustData.trustType === 'charitable' && (
                  <div>
                    <Label htmlFor="charitablePercentage" className={theme.textColors.secondary}>
                      Charitable Percentage (%)
                    </Label>
                    <Input
                      id="charitablePercentage"
                      type="number"
                      step="1"
                      value={trustData.charitablePercentage || ''}
                      onChange={(e) => handleInputChange('charitablePercentage', parseFloat(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Percentage to charity"
                    />
                    {errors.charitablePercentage && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.charitablePercentage}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Analyze Trust Structure
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
                      Trust Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>Final Trust Value</h3>
                        <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                          {formatCurrency(results.trustValue)}
                        </p>
                      </div>
                      
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>Total Distributions</h3>
                        <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                          {formatCurrency(results.distributionValue)}
                        </p>
                      </div>
                    </div>

                    <Separator className="border-white/20" />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Tax Savings:</span>
                        <span className={`font-semibold text-green-400`}>
                          {formatCurrency(results.taxSavings)}
                        </span>
                      </div>
                      
                      {results.giftTaxLiability > 0 && (
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Gift Tax Liability:</span>
                          <span className="font-semibold text-red-400">
                            ({formatCurrency(results.giftTaxLiability)})
                          </span>
                        </div>
                      )}
                      
                      {results.charitableDeduction > 0 && (
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>Charitable Deduction:</span>
                          <span className="font-semibold text-green-400">
                            {formatCurrency(results.charitableDeduction)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Protected Assets:</span>
                        <span className={`font-semibold ${theme.textColors.primary}`}>
                          {formatCurrency(results.protectedAssets)}
                        </span>
                      </div>
                      
                      <Separator className="border-white/20" />
                      
                      <div className="flex justify-between text-lg">
                        <span className={`font-semibold ${theme.textColors.secondary}`}>Net Benefit:</span>
                        <span className={`font-bold ${results.netBenefit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(results.netBenefit)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Projections Chart */}
                {results.projections.length > 0 && (
                  <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                    <CardHeader>
                      <CardTitle className={`${theme.textColors.primary}`}>Trust Value Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.projections.slice(0, 5).map((projection, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className={`font-medium ${theme.textColors.secondary}`}>Year {projection.year}</span>
                            <div className="text-right">
                              <div className={`font-semibold ${theme.textColors.primary}`}>
                                {formatCurrency(projection.trustValue)}
                              </div>
                              <div className="text-sm text-green-400">
                                +{formatCurrency(projection.taxSavings)} tax savings
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                  <CardHeader>
                    <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                      <Info className="w-5 h-5" />
                      Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.recommendations.map((recommendation, index) => (
                        <li key={index} className={`${theme.textColors.secondary} flex items-start gap-2`}>
                          <span className="text-green-400 mt-1">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className={`bg-green-50/10 border border-green-200/20`}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">Trust Structure Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <h4 className="font-semibold text-green-300 mb-1">Tax Advantages</h4>
                        <ul className="space-y-1">
                          <li>• Estate tax reduction</li>
                          <li>• Income tax benefits</li>
                          <li>• Generation-skipping advantages</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-300 mb-1">Asset Protection</h4>
                        <ul className="space-y-1">
                          <li>• Creditor protection</li>
                          <li>• Probate avoidance</li>
                          <li>• Privacy preservation</li>
                        </ul>
                      </div>
                    </div>
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

export default TrustAnalysisCalculator;

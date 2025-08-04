'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Users, Calculator, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface WealthTransferData {
  currentWealth: number;
  transferGoal: number;
  currentAge: number;
  targetAge: number;
  expectedReturn: number;
  giftStrategy: 'annual-exclusion' | 'lifetime-exemption' | 'grat' | 'sale-to-grantor-trust';
  annualGiftAmount: number;
  numberOfBeneficiaries: number;
  discountRate: number;
  gstExemption: boolean;
  charitableComponent: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  liquidityNeeds: number;
}

interface WealthTransferResults {
  projectedWealth: number;
  transferredWealth: number;
  remainingWealth: number;
  totalGiftTax: number;
  estateTaxSavings: number;
  gstTaxSavings: number;
  netTransferEfficiency: number;
  annualCashFlow: number;
  strategicRecommendations: string[];
  yearByYearProjection: Array<{
    year: number;
    wealthRemaining: number;
    wealthTransferred: number;
    annualGift: number;
    taxCost: number;
  }>;
}

const WealthTransferCalculator: React.FC = () => {
  const [transferData, setTransferData] = useState<WealthTransferData>({
    currentWealth: 0,
    transferGoal: 0,
    currentAge: 65,
    targetAge: 85,
    expectedReturn: 7,
    giftStrategy: 'annual-exclusion',
    annualGiftAmount: 0,
    numberOfBeneficiaries: 2,
    discountRate: 30,
    gstExemption: false,
    charitableComponent: 0,
    riskTolerance: 'moderate',
    liquidityNeeds: 0
  });

  const [results, setResults] = useState<WealthTransferResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('wealth-transfer-calculator');
  }, [recordCalculatorUsage]);

  const validateInputs = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (transferData.currentWealth <= 0) {
      newErrors.currentWealth = 'Current wealth must be positive';
    }
    if (transferData.transferGoal < 0) {
      newErrors.transferGoal = 'Transfer goal must be non-negative';
    }
    if (transferData.transferGoal > transferData.currentWealth) {
      newErrors.transferGoal = 'Transfer goal cannot exceed current wealth';
    }
    if (transferData.currentAge < 18 || transferData.currentAge > 100) {
      newErrors.currentAge = 'Current age must be between 18 and 100';
    }
    if (transferData.targetAge <= transferData.currentAge || transferData.targetAge > 120) {
      newErrors.targetAge = 'Target age must be greater than current age and less than 120';
    }
    if (transferData.expectedReturn < 0 || transferData.expectedReturn > 50) {
      newErrors.expectedReturn = 'Expected return must be between 0% and 50%';
    }
    if (transferData.numberOfBeneficiaries < 1 || transferData.numberOfBeneficiaries > 20) {
      newErrors.numberOfBeneficiaries = 'Number of beneficiaries must be between 1 and 20';
    }
    if (transferData.discountRate < 0 || transferData.discountRate > 50) {
      newErrors.discountRate = 'Discount rate must be between 0% and 50%';
    }
    if (transferData.liquidityNeeds < 0) {
      newErrors.liquidityNeeds = 'Liquidity needs must be non-negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [transferData]);

  const calculateWealthTransfer = useCallback((): WealthTransferResults => {
    const years = transferData.targetAge - transferData.currentAge;
    const annualReturn = transferData.expectedReturn / 100;
    const federalExemption = 13610000; // 2024 exemption
    const gstExemption = 13610000; // 2024 GST exemption
    const annualExclusion2024 = 18000;
    
    let currentWealth = transferData.currentWealth;
    let totalTransferred = 0;
    let totalGiftTax = 0;
    let exemptionUsed = 0;
    let gstExemptionUsed = 0;
    
    const yearByYearProjection: Array<{
      year: number;
      wealthRemaining: number;
      wealthTransferred: number;
      annualGift: number;
      taxCost: number;
    }> = [];

    // Calculate optimal annual gift based on strategy
    let optimalAnnualGift = 0;
    
    switch (transferData.giftStrategy) {
      case 'annual-exclusion':
        optimalAnnualGift = annualExclusion2024 * transferData.numberOfBeneficiaries;
        break;
      case 'lifetime-exemption':
        optimalAnnualGift = Math.min(
          transferData.transferGoal / years,
          federalExemption / years,
          currentWealth * 0.05 // Don't gift more than 5% per year
        );
        break;
      case 'grat':
        // GRAT allows leveraged transfer with minimal gift tax
        optimalAnnualGift = transferData.transferGoal / years;
        break;
      case 'sale-to-grantor-trust':
        // Sale to grantor trust with promissory note
        optimalAnnualGift = Math.min(transferData.transferGoal / years, currentWealth * 0.10);
        break;
    }

    // Override with user-specified amount if provided
    if (transferData.annualGiftAmount > 0) {
      optimalAnnualGift = transferData.annualGiftAmount;
    }

    // Apply valuation discount for family limited partnerships, etc.
    const discountedGiftValue = optimalAnnualGift * (1 - transferData.discountRate / 100);

    // Year-by-year calculation
    for (let year = 1; year <= years; year++) {
      // Grow wealth
      currentWealth *= (1 + annualReturn);
      
      // Subtract liquidity needs
      currentWealth -= transferData.liquidityNeeds;
      
      // Calculate gift for this year
      const annualGift = Math.min(optimalAnnualGift, currentWealth);
      const discountedGift = Math.min(discountedGiftValue, currentWealth);
      let yearlyTaxCost = 0;
      
      // Calculate gift tax based on strategy
      switch (transferData.giftStrategy) {
        case 'annual-exclusion':
          // No gift tax up to annual exclusion per beneficiary
          const annualExclusionTotal = annualExclusion2024 * transferData.numberOfBeneficiaries;
          if (discountedGift > annualExclusionTotal) {
            const taxableGift = discountedGift - annualExclusionTotal;
            if (exemptionUsed + taxableGift <= federalExemption) {
              exemptionUsed += taxableGift;
            } else {
              const excessGift = Math.max(0, exemptionUsed + taxableGift - federalExemption);
              yearlyTaxCost = excessGift * 0.40; // 40% gift tax rate
              exemptionUsed = federalExemption;
            }
          }
          break;
          
        case 'lifetime-exemption':
          if (exemptionUsed + discountedGift <= federalExemption) {
            exemptionUsed += discountedGift;
          } else {
            const excessGift = Math.max(0, exemptionUsed + discountedGift - federalExemption);
            yearlyTaxCost = excessGift * 0.40;
            exemptionUsed = federalExemption;
          }
          break;
          
        case 'grat':
          // GRAT requires interest payments but minimal gift tax
          yearlyTaxCost = annualGift * 0.02; // 2% cost for GRAT administration
          break;
          
        case 'sale-to-grantor-trust':
          // Sale reduces estate but requires note payments
          yearlyTaxCost = annualGift * 0.04; // 4% interest on promissory note
          break;
      }

      // Apply GST exemption if multi-generational
      if (transferData.gstExemption && gstExemptionUsed + discountedGift <= gstExemption) {
        gstExemptionUsed += discountedGift;
      } else if (transferData.gstExemption) {
        yearlyTaxCost += (discountedGift - Math.max(0, gstExemption - gstExemptionUsed)) * 0.40;
        gstExemptionUsed = gstExemption;
      }

      // Subtract gift and tax costs from wealth
      currentWealth -= (annualGift + yearlyTaxCost);
      totalTransferred += annualGift;
      totalGiftTax += yearlyTaxCost;
      
      yearByYearProjection.push({
        year: transferData.currentAge + year,
        wealthRemaining: Math.max(0, currentWealth),
        wealthTransferred: totalTransferred,
        annualGift,
        taxCost: yearlyTaxCost
      });
      
      // Stop if wealth is depleted
      if (currentWealth <= 0) break;
    }

    // Calculate final projections
    const projectedWealth = Math.max(0, currentWealth);
    const remainingWealth = projectedWealth - transferData.charitableComponent;
    
    // Estate tax calculations
    const estateTaxableAmount = Math.max(0, remainingWealth - (federalExemption - exemptionUsed));
    const estateTaxSavings = (totalTransferred + (totalTransferred * annualReturn * years)) * 0.40;
    
    const gstTaxSavings = transferData.gstExemption ? 
      Math.min(totalTransferred, gstExemption) * 0.40 : 0;
    
    const netTransferEfficiency = totalTransferred > 0 ? 
      ((totalTransferred - totalGiftTax) / totalTransferred) * 100 : 0;
    
    const annualCashFlow = transferData.liquidityNeeds + 
      (totalTransferred / years) + (totalGiftTax / years);

    // Generate strategic recommendations
    const strategicRecommendations: string[] = [];
    
    if (netTransferEfficiency < 80) {
      strategicRecommendations.push('Consider alternative transfer strategies to improve efficiency');
    }
    
    if (totalGiftTax > totalTransferred * 0.1) {
      strategicRecommendations.push('High gift tax cost - explore valuation discounts or different timing');
    }
    
    if (transferData.giftStrategy === 'annual-exclusion' && totalTransferred < transferData.transferGoal) {
      strategicRecommendations.push('Consider using lifetime exemption for larger transfers');
    }
    
    if (transferData.discountRate < 20 && transferData.currentWealth > 5000000) {
      strategicRecommendations.push('Explore family limited partnerships for additional valuation discounts');
    }
    
    if (!transferData.gstExemption && transferData.numberOfBeneficiaries > 2) {
      strategicRecommendations.push('Consider generation-skipping strategies for grandchildren');
    }
    
    if (transferData.charitableComponent === 0 && estateTaxableAmount > 0) {
      strategicRecommendations.push('Explore charitable giving for additional estate tax benefits');
    }
    
    if (annualCashFlow > currentWealth * 0.05) {
      strategicRecommendations.push('Consider spreading transfers over longer period to maintain liquidity');
    }
    
    if (transferData.expectedReturn > 8 && transferData.giftStrategy === 'annual-exclusion') {
      strategicRecommendations.push('High growth assets are ideal for GRATs or sales to grantor trusts');
    }
    
    if (remainingWealth > federalExemption) {
      strategicRecommendations.push('Additional estate planning needed - consider more aggressive strategies');
    }
    
    if (strategicRecommendations.length === 0) {
      strategicRecommendations.push('Wealth transfer plan appears well-structured for your goals');
      strategicRecommendations.push('Monitor for changes in tax law and family circumstances');
    }

    return {
      projectedWealth,
      transferredWealth: totalTransferred,
      remainingWealth,
      totalGiftTax,
      estateTaxSavings,
      gstTaxSavings,
      netTransferEfficiency,
      annualCashFlow,
      strategicRecommendations,
      yearByYearProjection
    };
  }, [transferData]);

  const handleCalculate = useCallback(() => {
    if (validateInputs()) {
      const calculatedResults = calculateWealthTransfer();
      setResults(calculatedResults);
    }
  }, [validateInputs, calculateWealthTransfer]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: keyof WealthTransferData, value: string | number | boolean) => {
    setTransferData(prev => ({
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
            <Users className="w-10 h-10 text-yellow-400" />
            Wealth Transfer Calculator
          </h1>
          <p className={`text-xl ${theme.textColors.secondary} max-w-3xl mx-auto`}>
            Plan and optimize generational wealth transfer strategies with advanced 
            gift and estate tax planning techniques for maximum efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                <Calculator className="w-5 h-5" />
                Transfer Planning Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wealth Information */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Current Financial Position</h3>
                
                <div>
                  <Label htmlFor="currentWealth" className={theme.textColors.secondary}>
                    Current Net Worth ($)
                  </Label>
                  <Input
                    id="currentWealth"
                    type="number"
                    value={transferData.currentWealth || ''}
                    onChange={(e) => handleInputChange('currentWealth', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Enter current net worth"
                  />
                  {errors.currentWealth && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.currentWealth}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="transferGoal" className={theme.textColors.secondary}>
                    Wealth Transfer Goal ($)
                  </Label>
                  <Input
                    id="transferGoal"
                    type="number"
                    value={transferData.transferGoal || ''}
                    onChange={(e) => handleInputChange('transferGoal', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Target amount to transfer"
                  />
                  {errors.transferGoal && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.transferGoal}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentAge" className={theme.textColors.secondary}>
                      Current Age
                    </Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={transferData.currentAge || ''}
                      onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Your current age"
                    />
                    {errors.currentAge && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.currentAge}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="targetAge" className={theme.textColors.secondary}>
                      Target Completion Age
                    </Label>
                    <Input
                      id="targetAge"
                      type="number"
                      value={transferData.targetAge || ''}
                      onChange={(e) => handleInputChange('targetAge', parseInt(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Age to complete transfers"
                    />
                    {errors.targetAge && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.targetAge}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="expectedReturn" className={theme.textColors.secondary}>
                    Expected Annual Return (%)
                  </Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    step="0.1"
                    value={transferData.expectedReturn || ''}
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
              </div>

              <Separator className="border-white/20" />

              {/* Transfer Strategy */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Transfer Strategy</h3>
                
                <div>
                  <Label className={theme.textColors.secondary}>Gift Strategy</Label>
                  <select
                    value={transferData.giftStrategy}
                    onChange={(e) => handleInputChange('giftStrategy', e.target.value as WealthTransferData['giftStrategy'])}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    <option value="annual-exclusion">Annual Exclusion Gifts</option>
                    <option value="lifetime-exemption">Lifetime Exemption Usage</option>
                    <option value="grat">Grantor Retained Annuity Trust (GRAT)</option>
                    <option value="sale-to-grantor-trust">Sale to Grantor Trust</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numberOfBeneficiaries" className={theme.textColors.secondary}>
                      Number of Beneficiaries
                    </Label>
                    <Input
                      id="numberOfBeneficiaries"
                      type="number"
                      value={transferData.numberOfBeneficiaries || ''}
                      onChange={(e) => handleInputChange('numberOfBeneficiaries', parseInt(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="Number of recipients"
                    />
                    {errors.numberOfBeneficiaries && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.numberOfBeneficiaries}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="discountRate" className={theme.textColors.secondary}>
                      Valuation Discount (%)
                    </Label>
                    <Input
                      id="discountRate"
                      type="number"
                      step="1"
                      value={transferData.discountRate || ''}
                      onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value) || 0)}
                      className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                      placeholder="FLP or other discounts"
                    />
                    {errors.discountRate && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.discountRate}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="annualGiftAmount" className={theme.textColors.secondary}>
                    Annual Gift Amount ($) - Optional Override
                  </Label>
                  <Input
                    id="annualGiftAmount"
                    type="number"
                    value={transferData.annualGiftAmount || ''}
                    onChange={(e) => handleInputChange('annualGiftAmount', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Leave blank for optimal calculation"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="gstExemption"
                    checked={transferData.gstExemption}
                    onChange={(e) => handleInputChange('gstExemption', e.target.checked)}
                    className="text-yellow-600"
                  />
                  <Label htmlFor="gstExemption" className={theme.textColors.secondary}>
                    Use Generation-Skipping Transfer (GST) Exemption
                  </Label>
                </div>
              </div>

              <Separator className="border-white/20" />

              {/* Additional Considerations */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Additional Planning</h3>
                
                <div>
                  <Label htmlFor="liquidityNeeds" className={theme.textColors.secondary}>
                    Annual Liquidity Needs ($)
                  </Label>
                  <Input
                    id="liquidityNeeds"
                    type="number"
                    value={transferData.liquidityNeeds || ''}
                    onChange={(e) => handleInputChange('liquidityNeeds', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Annual cash flow needs"
                  />
                  {errors.liquidityNeeds && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.liquidityNeeds}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="charitableComponent" className={theme.textColors.secondary}>
                    Charitable Gifts ($)
                  </Label>
                  <Input
                    id="charitableComponent"
                    type="number"
                    value={transferData.charitableComponent || ''}
                    onChange={(e) => handleInputChange('charitableComponent', parseFloat(e.target.value) || 0)}
                    className={`${theme.backgrounds.card} ${theme.textColors.primary} border-white/20`}
                    placeholder="Planned charitable giving"
                  />
                </div>

                <div>
                  <Label className={theme.textColors.secondary}>Risk Tolerance</Label>
                  <select
                    value={transferData.riskTolerance}
                    onChange={(e) => handleInputChange('riskTolerance', e.target.value as WealthTransferData['riskTolerance'])}
                    className={`w-full p-2 rounded-md ${theme.backgrounds.card} ${theme.textColors.primary} border border-white/20`}
                  >
                    <option value="conservative">Conservative (Lower returns, stable strategies)</option>
                    <option value="moderate">Moderate (Balanced approach)</option>
                    <option value="aggressive">Aggressive (Higher returns, advanced strategies)</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                size="lg"
              >
                Calculate Transfer Strategy
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
                      Wealth Transfer Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>Wealth Transferred</h3>
                        <p className={`text-2xl font-bold text-green-400`}>
                          {formatCurrency(results.transferredWealth)}
                        </p>
                      </div>
                      
                      <div className={`${theme.backgrounds.card} p-4 rounded-lg`}>
                        <h3 className={`text-sm font-medium ${theme.textColors.secondary}`}>Remaining Wealth</h3>
                        <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                          {formatCurrency(results.remainingWealth)}
                        </p>
                      </div>
                    </div>

                    <Separator className="border-white/20" />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Total Gift Tax Cost:</span>
                        <span className={`font-semibold ${results.totalGiftTax > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {formatCurrency(results.totalGiftTax)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Estate Tax Savings:</span>
                        <span className="font-semibold text-green-400">
                          {formatCurrency(results.estateTaxSavings)}
                        </span>
                      </div>
                      
                      {results.gstTaxSavings > 0 && (
                        <div className="flex justify-between">
                          <span className={theme.textColors.secondary}>GST Tax Savings:</span>
                          <span className="font-semibold text-green-400">
                            {formatCurrency(results.gstTaxSavings)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Transfer Efficiency:</span>
                        <span className={`font-semibold ${results.netTransferEfficiency > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {results.netTransferEfficiency.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={theme.textColors.secondary}>Annual Cash Flow Need:</span>
                        <span className={`font-semibold ${theme.textColors.primary}`}>
                          {formatCurrency(results.annualCashFlow)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transfer Timeline */}
                {results.yearByYearProjection.length > 0 && (
                  <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                    <CardHeader>
                      <CardTitle className={`${theme.textColors.primary}`}>Transfer Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.yearByYearProjection.slice(0, 5).map((projection, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <div>
                              <span className={`font-medium ${theme.textColors.secondary}`}>Age {projection.year}</span>
                              <div className="text-sm text-green-400">
                                Gift: {formatCurrency(projection.annualGift)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${theme.textColors.primary}`}>
                                {formatCurrency(projection.wealthRemaining)}
                              </div>
                              <div className="text-sm text-yellow-400">
                                Transferred: {formatCurrency(projection.wealthTransferred)}
                              </div>
                            </div>
                          </div>
                        ))}
                        {results.yearByYearProjection.length > 5 && (
                          <p className={`text-sm ${theme.textColors.secondary} text-center`}>
                            ... and {results.yearByYearProjection.length - 5} more years
                          </p>
                        )}
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
                      {results.strategicRecommendations.map((recommendation, index) => (
                        <li key={index} className={`${theme.textColors.secondary} flex items-start gap-2`}>
                          <span className="text-yellow-400 mt-1">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className={`bg-yellow-50/10 border border-yellow-200/20`}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">Transfer Strategy Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <h4 className="font-semibold text-yellow-300 mb-1">Current Strategy</h4>
                        <ul className="space-y-1">
                          <li>• Strategy: {transferData.giftStrategy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                          <li>• Efficiency: {results.netTransferEfficiency.toFixed(1)}%</li>
                          <li>• Tax Cost: {formatCurrency(results.totalGiftTax)}</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-yellow-300 mb-1">Key Benefits</h4>
                        <ul className="space-y-1">
                          <li>• Estate reduction: {formatCurrency(results.transferredWealth)}</li>
                          <li>• Tax savings: {formatCurrency(results.estateTaxSavings + results.gstTaxSavings)}</li>
                          <li>• Generation-skipping benefits included</li>
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

export default WealthTransferCalculator;

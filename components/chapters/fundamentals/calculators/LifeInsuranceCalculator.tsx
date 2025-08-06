'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Heart,
  DollarSign,
  Calendar,
  Home,
  TrendingUp,
  Calculator,
  Shield,
  Info
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: 'spouse' | 'child' | 'dependent';
  monthlyExpenses: number;
  yearsOfSupport: number;
}

interface InsuranceNeeds {
  immediateExpenses: number;
  incomeReplacement: number;
  futureObligations: number;
  totalNeeds: number;
  existingAssets: number;
  insuranceGap: number;
  recommendedCoverage: number;
}

export default function LifeInsuranceCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [annualIncome, setAnnualIncome] = useState<number>(75000);
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [existingLifeInsurance, setExistingLifeInsurance] = useState<number>(100000);
  const [mortgageBalance, setMortgageBalance] = useState<number>(250000);
  const [otherDebts, setOtherDebts] = useState<number>(25000);
  const [finalExpenses, setFinalExpenses] = useState<number>(15000);
  const [inflationRate, setInflationRate] = useState<number>(3);
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Spouse',
      age: 33,
      relationship: 'spouse',
      monthlyExpenses: 3000,
      yearsOfSupport: 30
    },
    {
      id: '2',
      name: 'Child 1',
      age: 8,
      relationship: 'child',
      monthlyExpenses: 1500,
      yearsOfSupport: 15
    }
  ]);

  const [insuranceNeeds, setInsuranceNeeds] = useState<InsuranceNeeds | null>(null);

  useEffect(() => {
    recordCalculatorUsage('life-insurance-calculator');
  }, [recordCalculatorUsage]);

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: `Family Member ${familyMembers.length + 1}`,
      age: 10,
      relationship: 'child',
      monthlyExpenses: 1000,
      yearsOfSupport: 18
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string | number) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const calculateInsuranceNeeds = useCallback(() => {
    // 1. Immediate Expenses
    const immediateExpenses = finalExpenses + mortgageBalance + otherDebts;

    // 2. Income Replacement Calculation
    const yearsToRetirement = retirementAge - currentAge;
    const incomeReplacementMultiplier = Math.min(yearsToRetirement, 30); // Cap at 30 years
    const adjustedIncome = annualIncome * 0.8; // 80% income replacement
    
    // Adjust for inflation
    const inflationAdjustment = Math.pow(1 + inflationRate / 100, yearsToRetirement / 2);
    const incomeReplacement = adjustedIncome * incomeReplacementMultiplier * inflationAdjustment;

    // 3. Future Obligations (Family Support)
    let futureObligations = 0;
    familyMembers.forEach(member => {
      const annualExpenses = member.monthlyExpenses * 12;
      const inflationAdjustedExpenses = annualExpenses * Math.pow(1 + inflationRate / 100, member.yearsOfSupport / 2);
      futureObligations += inflationAdjustedExpenses * member.yearsOfSupport;
    });

    // 4. Total Insurance Needs
    const totalNeeds = immediateExpenses + incomeReplacement + futureObligations;

    // 5. Available Assets
    const futureValueOfSavings = currentSavings * Math.pow(1.07, yearsToRetirement); // Assuming 7% growth
    const existingAssets = futureValueOfSavings + existingLifeInsurance;

    // 6. Insurance Gap
    const insuranceGap = Math.max(0, totalNeeds - existingAssets);

    // 7. Recommended Coverage (add 20% buffer)
    const recommendedCoverage = insuranceGap * 1.2;

    const needs: InsuranceNeeds = {
      immediateExpenses,
      incomeReplacement,
      futureObligations,
      totalNeeds,
      existingAssets,
      insuranceGap,
      recommendedCoverage
    };

    setInsuranceNeeds(needs);
  }, [
    annualIncome,
    currentAge,
    retirementAge,
    currentSavings,
    existingLifeInsurance,
    mortgageBalance,
    otherDebts,
    finalExpenses,
    inflationRate,
    familyMembers
  ]);

  useEffect(() => {
    calculateInsuranceNeeds();
  }, [calculateInsuranceNeeds]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInsuranceTypeRecommendation = (coverage: number): string => {
    if (coverage < 250000) return 'Term Life (10-20 years)';
    if (coverage < 500000) return 'Term Life (20-30 years)';
    if (coverage < 1000000) return 'Term Life (30 years) or Whole Life';
    return 'Term Life + Whole Life combination';
  };

  const getEstimatedPremium = (coverage: number, age: number): number => {
    // Simplified premium calculation (per $1000 of coverage annually)
    let ratePerThousand = 1.50; // Base rate for healthy 30-year-old
    
    // Age adjustments
    if (age > 40) ratePerThousand += 0.5;
    if (age > 50) ratePerThousand += 1.0;
    if (age > 60) ratePerThousand += 2.0;
    
    return (coverage / 1000) * ratePerThousand;
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-red-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Life Insurance Needs Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Personal Information
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
                    placeholder="75000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="35"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Retirement Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="65"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Savings & Investments
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Existing Life Insurance
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={existingLifeInsurance}
                    onChange={(e) => setExistingLifeInsurance(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="100000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Financial Obligations
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Mortgage Balance
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={mortgageBalance}
                    onChange={(e) => setMortgageBalance(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="250000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Other Debts
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={otherDebts}
                    onChange={(e) => setOtherDebts(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="25000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Final Expenses
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={finalExpenses}
                    onChange={(e) => setFinalExpenses(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="15000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Expected Inflation Rate (%)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="3"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Family Members
              </h3>
              <button
                onClick={addFamilyMember}
                className={`px-3 py-1 text-sm ${theme.buttons.secondary} rounded`}
              >
                Add Member
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {familyMembers.map((member) => (
                <div key={member.id} className={`p-3 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={`member-name-${member.id}`} className="sr-only">Family member name</label>
                    <input
                      id={`member-name-${member.id}`}
                      type="text"
                      value={member.name}
                      onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                      className={`bg-transparent ${theme.textColors.primary} font-medium border-none outline-none`}
                      placeholder="Family member name"
                    />
                    <button
                      onClick={() => removeFamilyMember(member.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label htmlFor={`member-age-${member.id}`} className={`${theme.textColors.secondary}`}>Age</label>
                      <input
                        id={`member-age-${member.id}`}
                        type="number"
                        value={member.age}
                        onChange={(e) => updateFamilyMember(member.id, 'age', Number(e.target.value))}
                        className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`member-relationship-${member.id}`} className={`${theme.textColors.secondary}`}>Relationship</label>
                      <select
                        id={`member-relationship-${member.id}`}
                        value={member.relationship}
                        onChange={(e) => updateFamilyMember(member.id, 'relationship', e.target.value)}
                        className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                      >
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="dependent">Dependent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`member-expenses-${member.id}`} className={`${theme.textColors.secondary}`}>Monthly Expenses</label>
                      <input
                        id={`member-expenses-${member.id}`}
                        type="number"
                        value={member.monthlyExpenses}
                        onChange={(e) => updateFamilyMember(member.id, 'monthlyExpenses', Number(e.target.value))}
                        className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`member-support-${member.id}`} className={`${theme.textColors.secondary}`}>Years of Support</label>
                      <input
                        id={`member-support-${member.id}`}
                        type="number"
                        value={member.yearsOfSupport}
                        onChange={(e) => updateFamilyMember(member.id, 'yearsOfSupport', Number(e.target.value))}
                        className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {insuranceNeeds && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 bg-red-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-red-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Total Needs</h4>
                  </div>
                  <div className="text-xl font-bold text-red-400">
                    {formatCurrency(insuranceNeeds.totalNeeds)}
                  </div>
                </div>

                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Insurance Gap</h4>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatCurrency(insuranceNeeds.insuranceGap)}
                  </div>
                </div>

                <div className={`p-4 bg-green-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-green-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Recommended</h4>
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(insuranceNeeds.recommendedCoverage)}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Insurance Needs Breakdown
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Needs Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`${theme.textColors.secondary}`}>Immediate Expenses</span>
                          <span className={`${theme.textColors.primary}`}>
                            {formatCurrency(insuranceNeeds.immediateExpenses)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${theme.textColors.secondary}`}>Income Replacement</span>
                          <span className={`${theme.textColors.primary}`}>
                            {formatCurrency(insuranceNeeds.incomeReplacement)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${theme.textColors.secondary}`}>Future Obligations</span>
                          <span className={`${theme.textColors.primary}`}>
                            {formatCurrency(insuranceNeeds.futureObligations)}
                          </span>
                        </div>
                        <div className={`border-t ${theme.borderColors.primary} pt-2`}>
                          <div className="flex justify-between font-semibold">
                            <span className={`${theme.textColors.primary}`}>Total Needs</span>
                            <span className={`${theme.textColors.primary}`}>
                              {formatCurrency(insuranceNeeds.totalNeeds)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Available Resources</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`${theme.textColors.secondary}`}>Current Savings (Future Value)</span>
                          <span className={`${theme.textColors.primary}`}>
                            {formatCurrency(currentSavings * Math.pow(1.07, retirementAge - currentAge))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${theme.textColors.secondary}`}>Existing Life Insurance</span>
                          <span className={`${theme.textColors.primary}`}>
                            {formatCurrency(existingLifeInsurance)}
                          </span>
                        </div>
                        <div className={`border-t ${theme.borderColors.primary} pt-2`}>
                          <div className="flex justify-between font-semibold">
                            <span className={`${theme.textColors.primary}`}>Total Assets</span>
                            <span className={`${theme.textColors.primary}`}>
                              {formatCurrency(insuranceNeeds.existingAssets)}
                            </span>
                          </div>
                        </div>
                      </div>
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
                      Insurance Recommendations
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className={`font-medium ${theme.textColors.primary}`}>Recommended Coverage: </span>
                        <span className={`${theme.textColors.secondary}`}>
                          {formatCurrency(insuranceNeeds.recommendedCoverage)}
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${theme.textColors.primary}`}>Insurance Type: </span>
                        <span className={`${theme.textColors.secondary}`}>
                          {getInsuranceTypeRecommendation(insuranceNeeds.recommendedCoverage)}
                        </span>
                      </div>
                      <div>
                        <span className={`font-medium ${theme.textColors.primary}`}>Estimated Annual Premium: </span>
                        <span className={`${theme.textColors.secondary}`}>
                          {formatCurrency(getEstimatedPremium(insuranceNeeds.recommendedCoverage, currentAge))}
                        </span>
                      </div>
                      <div className={`mt-3 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded text-xs ${theme.textColors.secondary}`}>
                        <strong>Note:</strong> This is a simplified calculation. Consider consulting with a licensed insurance professional 
                        for personalized advice. Factors like health, lifestyle, and specific insurance products can significantly 
                        affect your actual coverage needs and premiums.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

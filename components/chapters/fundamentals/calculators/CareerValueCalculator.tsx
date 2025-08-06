'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Award, Target, Clock } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { motion } from 'framer-motion';

interface ValidationError {
  field: string;
  message: string;
}

// interface InputValidation {
//   isValid: boolean;
//   errors: ValidationError[];
// }

interface JobOffer {
  id: string;
  title: string;
  baseSalary: number;
  bonus: number;
  healthInsurance: number;
  retirement401k: number;
  paidTimeOff: number;
  professionalDevelopment: number;
  stockOptions: number;
  otherBenefits: number;
}

interface CareerProjection {
  year: number;
  salary: number;
  totalComp: number;
  cumulativeValue: number;
}

export default function CareerValueCalculator() {
  const [offers, setOffers] = useState<JobOffer[]>([
    {
      id: 'offer1',
      title: 'Current Position',
      baseSalary: 65000,
      bonus: 5000,
      healthInsurance: 12000,
      retirement401k: 3250,
      paidTimeOff: 3500,
      professionalDevelopment: 2000,
      stockOptions: 0,
      otherBenefits: 1500
    },
    {
      id: 'offer2',
      title: 'New Opportunity',
      baseSalary: 75000,
      bonus: 7500,
      healthInsurance: 14000,
      retirement401k: 3750,
      paidTimeOff: 4000,
      professionalDevelopment: 3000,
      stockOptions: 5000,
      otherBenefits: 2000
    }
  ]);

  const [selectedOffer, setSelectedOffer] = useState<string>('offer1');
  const [careerGrowthRate, setCareerGrowthRate] = useState<string>('3.5');
  const [yearsToProject, setYearsToProject] = useState<string>('10');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

  useEffect(() => {
    recordCalculatorUsage('career-value-calculator');
  }, [recordCalculatorUsage]);

  // Safe parsing function with validation
  const safeParseFloat = (value: string, fieldName: string, min: number = 0): number => {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < min) {
      const error: ValidationError = {
        field: fieldName,
        message: `Please enter a valid number${min > 0 ? ` (minimum: ${min})` : ''}`
      };
      setValidationErrors(prev => [
        ...prev.filter(e => e.field !== fieldName),
        error
      ]);
      return 0;
    }
    
    // Clear error if validation passes
    setValidationErrors(prev => prev.filter(e => e.field !== fieldName));
    return parsed;
  };

  const updateOffer = (offerId: string, field: keyof JobOffer, value: string | number) => {
    setOffers(prev => prev.map(offer => 
      offer.id === offerId 
        ? { ...offer, [field]: typeof value === 'string' ? safeParseFloat(value, `${offerId}-${field}`) : value }
        : offer
    ));
  };

  const calculateTotalCompensation = (offer: JobOffer): number => {
    return offer.baseSalary + 
           offer.bonus + 
           offer.healthInsurance + 
           offer.retirement401k + 
           offer.paidTimeOff + 
           offer.professionalDevelopment + 
           offer.stockOptions + 
           offer.otherBenefits;
  };

  const calculateCareerProjection = (offer: JobOffer): CareerProjection[] => {
    const growthRate = parseFloat(careerGrowthRate) / 100;
    const years = parseInt(yearsToProject) || 10;
    const projections: CareerProjection[] = [];
    
    let cumulativeValue = 0;
    
    for (let year = 0; year <= years; year++) {
      const salary = offer.baseSalary * Math.pow(1 + growthRate, year);
      const totalComp = calculateTotalCompensation({
        ...offer,
        baseSalary: salary,
        bonus: offer.bonus * Math.pow(1 + growthRate, year)
      });
      
      cumulativeValue += totalComp;
      
      projections.push({
        year,
        salary,
        totalComp,
        cumulativeValue
      });
    }
    
    return projections;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentOffer = offers.find(o => o.id === selectedOffer);
  const currentProjection = currentOffer ? calculateCareerProjection(currentOffer) : [];
  const otherOffer = offers.find(o => o.id !== selectedOffer);
  const otherProjection = otherOffer ? calculateCareerProjection(otherOffer) : [];
  
  const lifetimeDifference = currentProjection[currentProjection.length - 1]?.cumulativeValue - 
                            otherProjection[otherProjection.length - 1]?.cumulativeValue || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2 flex items-center justify-center gap-3`}>
          <Calculator className="w-6 h-6 text-yellow-400" />
          Career Value Calculator
        </h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Compare total compensation packages and see the long-term impact of career decisions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Offers Input */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {offers.map((offer) => (
            <div key={offer.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => updateOffer(offer.id, 'title', e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b border-gray-600 text-white focus:border-yellow-500 outline-none"
                  aria-label={`Job offer title for offer ${offer.id}`}
                  placeholder="Enter job title"
                />
                <button
                  onClick={() => setSelectedOffer(offer.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    selectedOffer === offer.id 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-gray-700 text-gray-300 border border-gray-600'
                  }`}
                >
                  {selectedOffer === offer.id ? 'Selected' : 'Select'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${offer.id}-base-salary`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                    Base Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id={`${offer.id}-base-salary`}
                      value={offer.baseSalary}
                      onChange={(e) => updateOffer(offer.id, 'baseSalary', e.target.value)}
                      className={`pl-8 w-full px-3 py-2 bg-slate-800/50 border rounded text-white text-sm focus:ring-2 focus:border-transparent transition-all ${
                        validationErrors.some(e => e.field === `${offer.id}-baseSalary`) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-yellow-500'
                      }`}
                      aria-describedby={`${offer.id}-base-salary-help ${offer.id}-base-salary-error`}
                      {...(validationErrors.some(e => e.field === `${offer.id}-baseSalary`) ? { 'aria-invalid': 'true' } : {})}
                      min="0"
                      step="1000"
                    />
                  </div>
                  {validationErrors.some(e => e.field === `${offer.id}-baseSalary`) && (
                    <p id={`${offer.id}-base-salary-error`} className="text-red-400 text-xs mt-1" role="alert">
                      {validationErrors.find(e => e.field === `${offer.id}-baseSalary`)?.message}
                    </p>
                  )}
                  <p id={`${offer.id}-base-salary-help`} className={`text-xs ${theme.textColors.muted} mt-1`}>
                    Annual base salary before bonuses and benefits
                  </p>
                </div>
                
                <div>
                  <label htmlFor={`${offer.id}-annual-bonus`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                    Annual Bonus
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id={`${offer.id}-annual-bonus`}
                      value={offer.bonus}
                      onChange={(e) => updateOffer(offer.id, 'bonus', e.target.value)}
                      className={`pl-8 w-full px-3 py-2 bg-slate-800/50 border rounded text-white text-sm focus:ring-2 focus:border-transparent transition-all ${
                        validationErrors.some(e => e.field === `${offer.id}-bonus`) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-yellow-500'
                      }`}
                      aria-describedby={`${offer.id}-annual-bonus-help ${offer.id}-annual-bonus-error`}
                      {...(validationErrors.some(e => e.field === `${offer.id}-bonus`) ? { 'aria-invalid': 'true' } : {})}
                      min="0"
                      step="500"
                    />
                  </div>
                  {validationErrors.some(e => e.field === `${offer.id}-bonus`) && (
                    <p id={`${offer.id}-annual-bonus-error`} className="text-red-400 text-xs mt-1" role="alert">
                      {validationErrors.find(e => e.field === `${offer.id}-bonus`)?.message}
                    </p>
                  )}
                  <p id={`${offer.id}-annual-bonus-help`} className={`text-xs ${theme.textColors.muted} mt-1`}>
                    Expected annual bonus or performance incentives
                  </p>
                </div>
                
                <div>
                  <label htmlFor={`${offer.id}-health-insurance`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                    Health Insurance Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id={`${offer.id}-health-insurance`}
                      value={offer.healthInsurance}
                      onChange={(e) => updateOffer(offer.id, 'healthInsurance', e.target.value)}
                      className={`pl-8 w-full px-3 py-2 bg-slate-800/50 border rounded text-white text-sm focus:ring-2 focus:border-transparent transition-all ${
                        validationErrors.some(e => e.field === `${offer.id}-healthInsurance`) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-yellow-500'
                      }`}
                      aria-describedby={`${offer.id}-health-insurance-help ${offer.id}-health-insurance-error`}
                      {...(validationErrors.some(e => e.field === `${offer.id}-healthInsurance`) ? { 'aria-invalid': 'true' } : {})}
                      min="0"
                      step="500"
                    />
                  </div>
                  {validationErrors.some(e => e.field === `${offer.id}-healthInsurance`) && (
                    <p id={`${offer.id}-health-insurance-error`} className="text-red-400 text-xs mt-1" role="alert">
                      {validationErrors.find(e => e.field === `${offer.id}-healthInsurance`)?.message}
                    </p>
                  )}
                  <p id={`${offer.id}-health-insurance-help`} className={`text-xs ${theme.textColors.muted} mt-1`}>
                    Annual cost if purchased individually ($8,000-$15,000 typical)
                  </p>
                </div>
                
                <div>
                  <label htmlFor={`${offer.id}-401k-match`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                    401k Match
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id={`${offer.id}-401k-match`}
                      value={offer.retirement401k}
                      onChange={(e) => updateOffer(offer.id, 'retirement401k', e.target.value)}
                      className={`pl-8 w-full px-3 py-2 bg-slate-800/50 border rounded text-white text-sm focus:ring-2 focus:border-transparent transition-all ${
                        validationErrors.some(e => e.field === `${offer.id}-retirement401k`) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-yellow-500'
                      }`}
                      aria-describedby={`${offer.id}-401k-match-help ${offer.id}-401k-match-error`}
                      {...(validationErrors.some(e => e.field === `${offer.id}-retirement401k`) ? { 'aria-invalid': 'true' } : {})}
                      min="0"
                      step="250"
                    />
                  </div>
                  {validationErrors.some(e => e.field === `${offer.id}-retirement401k`) && (
                    <p id={`${offer.id}-401k-match-error`} className="text-red-400 text-xs mt-1" role="alert">
                      {validationErrors.find(e => e.field === `${offer.id}-retirement401k`)?.message}
                    </p>
                  )}
                  <p id={`${offer.id}-401k-match-help`} className={`text-xs ${theme.textColors.muted} mt-1`}>
                    Annual employer 401k matching contribution (typically 3-6% of salary)
                  </p>
                </div>
                
                <div>
                  <label htmlFor={`${offer.id}-pto-value`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                    PTO Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id={`${offer.id}-pto-value`}
                      value={offer.paidTimeOff}
                      onChange={(e) => updateOffer(offer.id, 'paidTimeOff', e.target.value)}
                      className={`pl-8 w-full px-3 py-2 bg-slate-800/50 border rounded text-white text-sm focus:ring-2 focus:border-transparent transition-all ${
                        validationErrors.some(e => e.field === `${offer.id}-paidTimeOff`) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-yellow-500'
                      }`}
                      aria-describedby={`${offer.id}-pto-value-help ${offer.id}-pto-value-error`}
                      {...(validationErrors.some(e => e.field === `${offer.id}-paidTimeOff`) ? { 'aria-invalid': 'true' } : {})}
                      min="0"
                      step="100"
                    />
                  </div>
                  {validationErrors.some(e => e.field === `${offer.id}-paidTimeOff`) && (
                    <p id={`${offer.id}-pto-value-error`} className="text-red-400 text-xs mt-1" role="alert">
                      {validationErrors.find(e => e.field === `${offer.id}-paidTimeOff`)?.message}
                    </p>
                  )}
                  <p id={`${offer.id}-pto-value-help`} className={`text-xs ${theme.textColors.muted} mt-1`}>
                    Value of paid time off (days × daily salary rate)
                  </p>
                </div>
                
                <div>
                  <label htmlFor={`${offer.id}-stock-options`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-1`}>
                    Stock Options
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id={`${offer.id}-stock-options`}
                      value={offer.stockOptions}
                      onChange={(e) => updateOffer(offer.id, 'stockOptions', e.target.value)}
                      className={`pl-8 w-full px-3 py-2 bg-slate-800/50 border rounded text-white text-sm focus:ring-2 focus:border-transparent transition-all ${
                        validationErrors.some(e => e.field === `${offer.id}-stockOptions`) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-600 focus:ring-yellow-500'
                      }`}
                      aria-describedby={`${offer.id}-stock-options-help ${offer.id}-stock-options-error`}
                      {...(validationErrors.some(e => e.field === `${offer.id}-stockOptions`) ? { 'aria-invalid': 'true' } : {})}
                      min="0"
                      step="500"
                    />
                  </div>
                  {validationErrors.some(e => e.field === `${offer.id}-stockOptions`) && (
                    <p id={`${offer.id}-stock-options-error`} className="text-red-400 text-xs mt-1" role="alert">
                      {validationErrors.find(e => e.field === `${offer.id}-stockOptions`)?.message}
                    </p>
                  )}
                  <p id={`${offer.id}-stock-options-help`} className={`text-xs ${theme.textColors.muted} mt-1`}>
                    Estimated annual value of stock options or equity compensation
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${theme.textColors.secondary}`}>Total Compensation:</span>
                  <span className="text-xl font-bold text-yellow-400">
                    {formatCurrency(calculateTotalCompensation(offer))}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Projection Settings */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 id="projection-settings-label" className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Career Projection Settings
            </h3>
            <div className="grid grid-cols-2 gap-4" role="group" aria-labelledby="projection-settings-label">
              <div>
                <label htmlFor="annual-growth-rate" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Annual Growth Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="annual-growth-rate"
                    step="0.1"
                    value={careerGrowthRate}
                    onChange={(e) => setCareerGrowthRate(e.target.value)}
                    className={`pr-8 w-full px-3 py-2 bg-slate-800/50 border rounded text-white focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.some(e => e.field === 'careerGrowthRate') 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-yellow-500'
                    }`}
                    aria-describedby="annual-growth-rate-help annual-growth-rate-error"
                    {...(validationErrors.some(e => e.field === 'careerGrowthRate') ? { 'aria-invalid': 'true' } : {})}
                    min="0"
                    max="20"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">%</span>
                </div>
                {validationErrors.some(e => e.field === 'careerGrowthRate') && (
                  <p id="annual-growth-rate-error" className="text-red-400 text-xs mt-1" role="alert">
                    {validationErrors.find(e => e.field === 'careerGrowthRate')?.message}
                  </p>
                )}
                <p id="annual-growth-rate-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                  Expected annual salary increase percentage (typical: 2-5%)
                </p>
              </div>
              
              <div>
                <label htmlFor="years-to-project" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Years to Project
                </label>
                <input
                  type="number"
                  id="years-to-project"
                  value={yearsToProject}
                  onChange={(e) => setYearsToProject(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-800/50 border rounded text-white focus:ring-2 focus:border-transparent transition-all ${
                    validationErrors.some(e => e.field === 'yearsToProject') 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-yellow-500'
                  }`}
                  aria-describedby="years-to-project-help years-to-project-error"
                  {...(validationErrors.some(e => e.field === 'yearsToProject') ? { 'aria-invalid': 'true' } : {})}
                  min="1"
                  max="40"
                />
                {validationErrors.some(e => e.field === 'yearsToProject') && (
                  <p id="years-to-project-error" className="text-red-400 text-xs mt-1" role="alert">
                    {validationErrors.find(e => e.field === 'yearsToProject')?.message}
                  </p>
                )}
                <p id="years-to-project-help" className={`text-xs ${theme.textColors.muted} mt-1`}>
                  Number of years to project career growth (1-40 years)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Current Year Comparison */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Target className="w-5 h-5 text-yellow-400" />
              Current Year Comparison
            </h3>
            <div className="space-y-4">
              {offers.map((offer) => {
                const totalComp = calculateTotalCompensation(offer);
                const isSelected = selectedOffer === offer.id;
                return (
                  <div key={offer.id} className={`p-4 rounded-lg border ${
                    isSelected ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-white/10 bg-slate-800/20'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isSelected ? 'text-yellow-400' : theme.textColors.primary}`}>
                        {offer.title}
                      </span>
                      <span className={`text-lg font-bold ${isSelected ? 'text-yellow-400' : theme.textColors.primary}`}>
                        {formatCurrency(totalComp)}
                      </span>
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                      Salary: {formatCurrency(offer.baseSalary)} + Benefits: {formatCurrency(totalComp - offer.baseSalary)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifetime Value */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Clock className="w-5 h-5 text-yellow-400" />
              {yearsToProject}-Year Career Impact
            </h3>
            
            <div className="space-y-4">
              {offers.map((offer) => {
                const projection = calculateCareerProjection(offer);
                const lifetimeValue = projection[projection.length - 1]?.cumulativeValue || 0;
                const isSelected = selectedOffer === offer.id;
                
                return (
                  <div key={offer.id} className={`p-4 rounded-lg border ${
                    isSelected ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-white/10 bg-slate-800/20'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isSelected ? 'text-yellow-400' : theme.textColors.primary}`}>
                        {offer.title}
                      </span>
                      <span className={`text-xl font-bold ${isSelected ? 'text-yellow-400' : theme.textColors.primary}`}>
                        {formatCurrency(lifetimeValue)}
                      </span>
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                      Total career earnings over {yearsToProject} years
                    </div>
                  </div>
                );
              })}
              
              {Math.abs(lifetimeDifference) > 1000 && (
                <div className={`p-4 rounded-lg border-2 ${
                  lifetimeDifference > 0 ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${lifetimeDifference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      Career Value Difference
                    </span>
                    <span className={`text-xl font-bold ${lifetimeDifference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {lifetimeDifference > 0 ? '+' : ''}{formatCurrency(lifetimeDifference)}
                    </span>
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                    {lifetimeDifference > 0 ? 'Higher' : 'Lower'} lifetime value compared to alternative
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Insights */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
              <Award className="w-5 h-5 text-yellow-400" />
              Key Insights
            </h3>
            <div className="space-y-3">
              {currentOffer && (
                <>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Benefits as % of base salary:</span>
                    <span className={theme.textColors.primary}>
                      {(((calculateTotalCompensation(currentOffer) - currentOffer.baseSalary) / currentOffer.baseSalary) * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Projected {yearsToProject}-year salary growth:</span>
                    <span className={theme.textColors.primary}>
                      {formatCurrency(currentProjection[currentProjection.length - 1]?.salary - currentOffer.baseSalary || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Value of 1% additional growth:</span>
                    <span className="text-green-400">
                      {formatCurrency(
                        (calculateCareerProjection({...currentOffer, baseSalary: currentOffer.baseSalary})[parseInt(yearsToProject)]?.cumulativeValue || 0) -
                        (currentProjection[parseInt(yearsToProject)]?.cumulativeValue || 0)
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

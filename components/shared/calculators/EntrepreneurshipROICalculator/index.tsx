'use client';

import React from 'react';
import CalculatorWrapper from '../CalculatorWrapper';
import { useEntrepreneurshipROI } from './useEntrepreneurshipROI';
import { InputSection, ResultsSection } from './components';

export default function EntrepreneurshipROICalculator() {
  const {
    // State
    inputs,
    results,
    investmentCategories,
    activeTab,

    // Actions
    handleInputChange,
    handleReset,
    setActiveTab,

    // Computed
    roiStatus,
    investmentAdvice,
    metadata,
    calculatorResults
  } = useEntrepreneurshipROI();

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      onReset={handleReset}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div>
          <InputSection
            inputs={inputs}
            activeTab={activeTab}
            onInputChange={handleInputChange}
            onTabChange={setActiveTab}
          />
        </div>
        
        {/* Results Panel */}
        <div>
          <ResultsSection
            results={results}
            investmentCategories={investmentCategories}
            roiStatus={roiStatus}
            investmentAdvice={investmentAdvice}
          />
        </div>
      </div>
    </CalculatorWrapper>
  );
}


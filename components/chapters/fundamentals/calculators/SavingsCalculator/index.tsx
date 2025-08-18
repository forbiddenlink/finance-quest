'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { theme } from '@/lib/theme';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { PiggyBank } from 'lucide-react';
import { SavingsCalculatorProps } from './types';
import { useSavingsCalculator } from './useSavingsCalculator';
import {
  InputSection,
  BankRatesWidget,
  ResultsSection,
  ChartSection,
  PeerComparison,
  ExportSection,
  InsightsSection
} from './components';

const metadata = {
  id: 'savings-calculator',
  title: 'Savings Growth Calculator',
  description: 'See how your money grows with compound interest and regular savings',
  category: 'basic' as const,
  icon: PiggyBank,
  tags: ['savings', 'compound interest', 'banking', 'emergency fund'],
  educationalNotes: [
    {
      title: 'Maximize Your Savings Rate',
      content: 'The difference between a traditional bank (0.01% APY) and a high-yield online bank (4-5% APY) can mean thousands of dollars over time.',
      tips: [
        'Research online banks and credit unions for better rates',
        'Consider money market accounts for higher balances',
        'Look for accounts with no monthly fees or minimum balance requirements',
        'Set up automatic transfers to make saving effortless'
      ]
    },
    {
      title: 'Emergency Fund Strategy',
      content: 'Financial experts recommend saving 3-6 months of expenses in an easily accessible account. This calculator helps you plan how long it will take to reach your goal.',
      tips: [
        'Start with a goal of $1,000 for small emergencies',
        'Gradually build to 3-6 months of living expenses',
        'Keep emergency funds in high-yield, liquid accounts',
        'Separate emergency savings from other financial goals'
      ]
    }
  ]
};

const SavingsCalculator: React.FC<SavingsCalculatorProps> = (props) => {
  const {
    // State
    initialDeposit,
    monthlyDeposit,
    interestRate,
    timeYears,
    showCelebration,
    viewMode,
    liveBankRates,
    inflationRate,
    riskProfile,
    chartData,
    scenarioData,
    monteCarloResults,
    results,

    // Setters
    setInitialDeposit,
    setMonthlyDeposit,
    setInterestRate,
    setTimeYears,
    setViewMode,
    setInflationRate,
    setRiskProfile,

    // Actions
    handleReset,
    shareResults,
    applyPreset,
    exportToPDF,
    exportToCSV,
    shareToSocial,

    // Computed
    insights,
    calculatorResults
  } = useSavingsCalculator(props);

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={insights}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* Input Section */}
        <InputSection
          initialDeposit={initialDeposit}
          monthlyDeposit={monthlyDeposit}
          interestRate={interestRate}
          timeYears={timeYears}
          inflationRate={inflationRate}
          riskProfile={riskProfile}
          viewMode={viewMode}
          setInitialDeposit={setInitialDeposit}
          setMonthlyDeposit={setMonthlyDeposit}
          setInterestRate={setInterestRate}
          setTimeYears={setTimeYears}
          setInflationRate={setInflationRate}
          setRiskProfile={setRiskProfile}
          setViewMode={setViewMode}
          applyPreset={applyPreset}
        />

        {/* Bank Rates Widget */}
        <BankRatesWidget
          rates={liveBankRates}
          onSelectRate={setInterestRate}
        />

        {/* Results Section */}
        <ResultsSection
          results={results}
          viewMode={viewMode}
        />

        {/* Peer Comparison */}
        <PeerComparison
          results={results}
          interestRate={interestRate}
          monthlyDeposit={monthlyDeposit}
        />

        {/* Chart Section */}
        <ChartSection
          viewMode={viewMode}
          chartData={chartData}
          scenarioData={scenarioData}
          monteCarloResults={monteCarloResults}
        />

        {/* Export Section */}
        <ExportSection
          results={results}
          exportToPDF={exportToPDF}
          exportToCSV={exportToCSV}
          shareToSocial={shareToSocial}
          initialDeposit={initialDeposit}
          monthlyDeposit={monthlyDeposit}
          timeYears={timeYears}
          interestRate={interestRate}
        />

        {/* Insights Section */}
        <InsightsSection results={results} />

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`${theme.status.success.bg} rounded-full p-8`}
              >
                <Award className={`w-16 h-16 ${theme.status.success.text}`} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CalculatorWrapper>
  );
};

export default SavingsCalculator;


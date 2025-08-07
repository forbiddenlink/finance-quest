'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Shield, Calculator } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

// Import all 4 Banking calculators
import HighYieldSavingsCalculator from './HighYieldSavingsCalculator';
import BankFeeImpactCalculator from './BankFeeImpactCalculator';
import SavingsAccountOptimizer from './SavingsAccountOptimizer';
import CertificateOfDepositCalculator from './CertificateOfDepositCalculator';

interface CalculatorTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  description: string;
}

const calculatorTabs: CalculatorTab[] = [
  {
    id: 'high-yield-savings',
    label: 'High-Yield Savings',
    icon: TrendingUp,
    component: HighYieldSavingsCalculator,
    description: 'Compare traditional vs high-yield savings and see the dramatic difference over time'
  },
  {
    id: 'bank-fee-impact',
    label: 'Bank Fee Impact',
    icon: Shield,
    component: BankFeeImpactCalculator,
    description: 'Calculate how banking fees eat into your savings and find fee-free alternatives'
  },
  {
    id: 'savings-optimizer',
    label: 'Savings Optimizer',
    icon: Calculator,
    component: SavingsAccountOptimizer,
    description: 'Find the best savings account for your specific financial situation'
  },
  {
    id: 'certificate-deposit',
    label: 'Certificate of Deposit',
    icon: Building2,
    component: CertificateOfDepositCalculator,
    description: 'Compare CDs vs high-yield savings and determine the best strategy'
  }
];

export default function BankingCalculatorSuite() {
  const [activeTab, setActiveTab] = useState('high-yield-savings');
  const { recordCalculatorUsage } = useProgressStore();

  // Record usage when component mounts
  useEffect(() => {
    recordCalculatorUsage('banking-calculator-suite');
  }, [recordCalculatorUsage]);

  // Record individual calculator usage when switching tabs
  useEffect(() => {
    recordCalculatorUsage(`${activeTab}-calculator`);
  }, [activeTab, recordCalculatorUsage]);

  const activeCalculator = calculatorTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeCalculator?.component || HighYieldSavingsCalculator;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className={`inline-flex items-center gap-3 px-6 py-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-full`}>
          <Building2 className="w-6 h-6 text-green-400" />
          <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>
            Smart Banking Calculator Suite
          </h1>
        </div>
        <p className={`text-lg ${theme.textColors.secondary} max-w-3xl mx-auto`}>
          Master banking fundamentals and save $300-500+ annually with strategic account choices. 
          Compare savings rates, minimize fees, and optimize your banking setup for maximum growth.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-2`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {calculatorTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  p-4 rounded-lg transition-all duration-200 text-left group
                  ${isActive 
                    ? `${theme.backgrounds.primary} text-white shadow-lg` 
                    : `hover:bg-white/5 ${theme.textColors.secondary}`
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-green-400'}`} />
                  <span className={`font-semibold ${isActive ? 'text-white' : theme.textColors.primary}`}>
                    {tab.label}
                  </span>
                </div>
                <p className={`text-sm ${isActive ? 'text-green-100' : theme.textColors.secondary} line-clamp-2`}>
                  {tab.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Calculator Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[600px]"
      >
        <ActiveComponent />
      </motion.div>

      {/* Educational Context Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
      >
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
          Smart Banking Strategy Framework
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Account Optimization</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Use high-yield savings accounts for 50x-500x better returns</li>
              <li>• Eliminate monthly maintenance fees and ATM charges</li>
              <li>• Set up automatic transfers to build savings consistently</li>
              <li>• Keep 1-2 months expenses in checking, rest in high-yield savings</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Fee Minimization</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Choose credit unions or online banks for lower fees</li>
              <li>• Use in-network ATMs or get fee reimbursement accounts</li>
              <li>• Maintain minimum balances to avoid monthly charges</li>
              <li>• Review statements monthly to catch unexpected fees</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

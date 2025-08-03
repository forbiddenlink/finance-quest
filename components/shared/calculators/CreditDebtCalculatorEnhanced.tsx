'use client';

import React, { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  CreditCard,
  TrendingUp,
  Percent,
  Target,
  Shield,
  DollarSign,
  BookOpen
} from 'lucide-react';

// Import individual calculators
import CreditScoreImprovementCalculator from '@/components/chapters/fundamentals/calculators/CreditScoreImprovementCalculator';
import CreditUtilizationCalculator from '@/components/chapters/fundamentals/calculators/CreditUtilizationCalculator';
import DebtPayoffCalculator from '@/components/shared/calculators/DebtPayoffCalculator';

type CalculatorTab = 'overview' | 'score-improvement' | 'utilization' | 'debt-payoff';

export default function CreditDebtCalculatorEnhanced() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('overview');
  const { recordCalculatorUsage } = useProgressStore();

  React.useEffect(() => {
    recordCalculatorUsage('credit-debt-calculator-enhanced');
  }, [recordCalculatorUsage]);

  const tabs = [
    {
      id: 'overview' as CalculatorTab,
      label: 'Overview',
      icon: BookOpen,
      description: 'Credit & debt management guide'
    },
    {
      id: 'score-improvement' as CalculatorTab,
      label: 'Score Improvement',
      icon: TrendingUp,
      description: 'Optimize your credit score'
    },
    {
      id: 'utilization' as CalculatorTab,
      label: 'Utilization',
      icon: Percent,
      description: 'Optimize credit utilization'
    },
    {
      id: 'debt-payoff' as CalculatorTab,
      label: 'Debt Payoff',
      icon: Target,
      description: 'Strategic debt elimination'
    }
  ];

  const renderOverview = () => (
    <div className={`max-w-4xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-8`}>
      <div className="text-center mb-8">
        <div className={`${theme.status.info.bg} p-4 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center`}>
          <CreditCard className={`w-10 h-10 ${theme.status.info.text}`} />
        </div>
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-4`}>
          Credit & Debt Management Suite
        </h2>
        <p className={`${theme.textColors.secondary} text-lg max-w-2xl mx-auto`}>
          Master your credit score and eliminate debt with our comprehensive set of calculators and optimization tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6 text-center`}>
          <TrendingUp className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-3`} />
          <h3 className={`font-semibold ${theme.status.success.text} mb-2`}>Score Improvement</h3>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Track credit factors and see exactly how to reach your target score
          </p>
        </div>

        <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-6 text-center`}>
          <Percent className={`w-8 h-8 ${theme.status.warning.text} mx-auto mb-3`} />
          <h3 className={`font-semibold ${theme.status.warning.text} mb-2`}>Utilization Optimizer</h3>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Optimize credit card utilization for maximum score impact
          </p>
        </div>

        <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6 text-center`}>
          <Target className={`w-8 h-8 ${theme.status.error.text} mx-auto mb-3`} />
          <h3 className={`font-semibold ${theme.status.error.text} mb-2`}>Debt Elimination</h3>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Compare payoff strategies and accelerate your debt freedom
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Shield className="w-6 h-6" />
            Credit Score Fundamentals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Score Factors & Weights</h4>
              <ul className="space-y-2">
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Payment History</span>
                  <span className="font-bold text-red-400">35%</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Credit Utilization</span>
                  <span className="font-bold text-orange-400">30%</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Length of History</span>
                  <span className="font-bold text-blue-400">15%</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Credit Mix</span>
                  <span className="font-bold text-green-400">10%</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>New Credit</span>
                  <span className="font-bold text-purple-400">10%</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Score Ranges</h4>
              <ul className="space-y-2">
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Exceptional</span>
                  <span className="font-bold text-green-400">800-850</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Very Good</span>
                  <span className="font-bold text-blue-400">740-799</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Good</span>
                  <span className="font-bold text-yellow-400">670-739</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Fair</span>
                  <span className="font-bold text-orange-400">580-669</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Poor</span>
                  <span className="font-bold text-red-400">300-579</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <DollarSign className="w-6 h-6" />
            Financial Impact of Credit Scores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 ${theme.status.error.bg} border ${theme.status.error.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.error.text} mb-2`}>Poor Credit (580)</h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>$400k Mortgage</p>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>$382k Interest</p>
              <p className={`text-xs ${theme.textColors.muted}`}>7.2% rate, 30 years</p>
            </div>
            <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Good Credit (720)</h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>$400k Mortgage</p>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>$318k Interest</p>
              <p className={`text-xs ${theme.textColors.muted}`}>6.3% rate, 30 years</p>
            </div>
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Excellent Credit (780)</h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>$400k Mortgage</p>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>$286k Interest</p>
              <p className={`text-xs ${theme.textColors.muted}`}>5.8% rate, 30 years</p>
            </div>
          </div>
          <div className={`mt-4 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg text-center`}>
            <p className={`font-bold ${theme.textColors.primary} text-lg`}>
              Excellent credit saves $96k+ vs poor credit on a single mortgage!
            </p>
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4`}>Quick Action Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3 text-green-400`}>✅ Immediate Actions (This Week)</h4>
              <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <li>• Check your credit score for free</li>
                <li>• Review credit reports for errors</li>
                <li>• Set up automatic bill payments</li>
                <li>• Calculate current credit utilization</li>
                <li>• List all debts with rates and balances</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3 text-blue-400`}>🎯 30-Day Goals</h4>
              <ul className={`space-y-2 text-sm ${theme.textColors.secondary}`}>
                <li>• Pay down utilization below 30%</li>
                <li>• Dispute any credit report errors</li>
                <li>• Choose debt elimination strategy</li>
                <li>• Request credit limit increases</li>
                <li>• Start paying before statement dates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className={`${theme.textColors.secondary} mb-4`}>
          Ready to optimize your credit and eliminate debt? Use our specialized calculators above.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.slice(1).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 ${theme.buttons.primary} rounded-lg transition-all hover-lift`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'score-improvement':
        return <CreditScoreImprovementCalculator />;
      case 'utilization':
        return <CreditUtilizationCalculator />;
      case 'debt-payoff':
        return <DebtPayoffCalculator />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Tab Navigation */}
      <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-2`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? `${theme.buttons.primary} shadow-lg`
                  : `${theme.textColors.secondary} hover:${theme.backgrounds.card} hover:${theme.textColors.primary}`
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <div className="text-left hidden sm:block">
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.description}</div>
              </div>
              <div className="sm:hidden">
                <div className="font-medium text-sm">{tab.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import PortfolioAnalyzerCalculator from '@/components/shared/calculators/PortfolioAnalyzerCalculator';
import PortfolioRebalancingCalculator from './PortfolioRebalancingCalculator';
import DiversificationAnalyzer from './DiversificationAnalyzer';
import { motion } from 'framer-motion';
import {
  PieChart,
  BarChart3,
  Scale,
  Globe,
  Target,
  Calculator
} from 'lucide-react';

const PortfolioCalculatorEnhanced: React.FC = () => {
  const { recordCalculatorUsage } = useProgressStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'diversification' | 'rebalancing' | 'analysis'>('overview');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    recordCalculatorUsage('portfolio-calculator-enhanced');
  }, [recordCalculatorUsage]);

  // Enhanced keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    const tabs = ['overview', 'diversification', 'rebalancing', 'analysis'];
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    setActiveTab(tabs[newIndex] as typeof activeTab);
    tabRefs.current[newIndex]?.focus();
  };

  const tabs = [
    {
      id: 'overview' as const,
      label: 'Portfolio Overview',
      icon: PieChart,
      description: 'Analyze your complete portfolio allocation and performance'
    },
    {
      id: 'diversification' as const,
      label: 'Diversification',
      icon: Globe,
      description: 'Measure and improve portfolio diversification across assets and regions'
    },
    {
      id: 'rebalancing' as const,
      label: 'Rebalancing',
      icon: Scale,
      description: 'Calculate optimal rebalancing actions to maintain target allocation'
    },
    {
      id: 'analysis' as const,
      label: 'Risk Analysis',
      icon: BarChart3,
      description: 'Deep dive into portfolio metrics and risk assessment'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PortfolioAnalyzerCalculator />;
      case 'diversification':
        return <DiversificationAnalyzer />;
      case 'rebalancing':
        return <PortfolioRebalancingCalculator />;
      case 'analysis':
        return (
          <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
                Advanced Risk Analysis
              </h2>
            </div>
            
            <div className={`p-8 text-center ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <Target className={`w-16 h-16 ${theme.textColors.secondary} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>
                Advanced Risk Metrics Coming Soon
              </h3>
              <p className={`${theme.textColors.secondary} mb-6 max-w-md mx-auto`}>
                This section will include Sharpe ratio, beta analysis, Value at Risk (VaR), 
                Monte Carlo simulations, and stress testing capabilities.
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 ${theme.status.info.bg} ${theme.status.info.text} rounded-lg`}>
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium">Professional-grade tools in development</span>
              </div>
            </div>
          </div>
        );
      default:
        return <PortfolioAnalyzerCalculator />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation with ARIA */}
      <div className={`p-1 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <nav 
          className="grid grid-cols-2 lg:grid-cols-4 gap-1"
          role="tablist"
          aria-label="Portfolio calculator tools"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[index] = el; }}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`portfolio-panel-${tab.id}`}
                id={`portfolio-tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`relative p-4 rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                  isActive
                    ? `${theme.backgrounds.cardHover} ${theme.textColors.primary}`
                    : `${theme.textColors.secondary} hover:${theme.backgrounds.cardHover} hover:${theme.textColors.primary}`
                }`}
                aria-label={`${tab.label}: ${tab.description}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
                  <span className="text-sm font-medium text-center leading-tight">
                    {tab.label}
                  </span>
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Description */}
      <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          📊 {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        id={`portfolio-panel-${activeTab}`}
        aria-labelledby={`portfolio-tab-${activeTab}`}
        tabIndex={0}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Educational Footer */}
      <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>
          💡 Portfolio Construction Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Asset Allocation:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Determines 90% of returns</li>
              <li>• Age-based guidelines: 120 - age = % stocks</li>
              <li>• Adjust for risk tolerance</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Diversification:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Spread across asset classes</li>
              <li>• Include international exposure</li>
              <li>• Consider correlation patterns</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Maintenance:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Rebalance quarterly/annually</li>
              <li>• Use new contributions first</li>
              <li>• Consider tax implications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCalculatorEnhanced;

'use client';

import React, { useState, useRef } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  TrendingUp,
  Brain,
  PieChart,
  Calculator,
  Target,
  DollarSign,
  BookOpen,
  BarChart3
} from 'lucide-react';

// Import individual calculators
import RiskToleranceCalculator from '@/components/chapters/fundamentals/calculators/RiskToleranceCalculator';
import AssetAllocationOptimizer from '@/components/chapters/fundamentals/calculators/AssetAllocationOptimizer';
import CompoundInterestCalculator from '@/components/shared/calculators/CompoundInterestCalculator';

type CalculatorTab = 'overview' | 'risk-assessment' | 'asset-allocation' | 'compound-growth';

export default function InvestmentCalculatorEnhanced() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('overview');
  const { recordCalculatorUsage } = useProgressStore();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const contentId = `tab-content-${activeTab}`;

  React.useEffect(() => {
    recordCalculatorUsage('investment-calculator-enhanced');
  }, [recordCalculatorUsage]);

  // Enhanced keyboard navigation for tabs
  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, tabId: CalculatorTab, index: number) => {
    const tabIds = tabs.map(tab => tab.id);
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : tabIds.length - 1;
        const prevTab = tabIds[prevIndex];
        tabRefs.current[prevTab]?.focus();
        setActiveTab(prevTab);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = index < tabIds.length - 1 ? index + 1 : 0;
        const nextTab = tabIds[nextIndex];
        tabRefs.current[nextTab]?.focus();
        setActiveTab(nextTab);
        break;
      case 'Home':
        event.preventDefault();
        const firstTab = tabIds[0];
        tabRefs.current[firstTab]?.focus();
        setActiveTab(firstTab);
        break;
      case 'End':
        event.preventDefault();
        const lastTab = tabIds[tabIds.length - 1];
        tabRefs.current[lastTab]?.focus();
        setActiveTab(lastTab);
        break;
    }
  };

  const tabs = [
    {
      id: 'overview' as CalculatorTab,
      label: 'Overview',
      icon: BookOpen,
      description: 'Investment strategy guide'
    },
    {
      id: 'risk-assessment' as CalculatorTab,
      label: 'Risk Assessment',
      icon: Brain,
      description: 'Discover your investor profile'
    },
    {
      id: 'asset-allocation' as CalculatorTab,
      label: 'Asset Allocation',
      icon: PieChart,
      description: 'Optimize portfolio mix'
    },
    {
      id: 'compound-growth' as CalculatorTab,
      label: 'Compound Growth',
      icon: TrendingUp,
      description: 'Calculate investment growth'
    }
  ];

  const renderOverview = () => (
    <div className={`max-w-4xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-8`}>
      <div className="text-center mb-8">
        <div className={`${theme.status.success.bg} p-4 rounded-full mx-auto mb-4 w-20 h-20 flex items-center justify-center`}>
          <TrendingUp className={`w-10 h-10 ${theme.status.success.text}`} />
        </div>
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-4`}>
          Investment Fundamentals Suite
        </h2>
        <p className={`${theme.textColors.secondary} text-lg max-w-2xl mx-auto`}>
          Master investment fundamentals with our comprehensive tools for risk assessment, portfolio optimization, and growth projection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6 text-center`}>
          <Brain className={`w-8 h-8 ${theme.status.info.text} mx-auto mb-3`} />
          <h3 className={`font-semibold ${theme.status.info.text} mb-2`}>Risk Assessment</h3>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Discover your investment personality and optimal risk level
          </p>
        </div>

        <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-6 text-center`}>
          <PieChart className={`w-8 h-8 ${theme.status.warning.text} mx-auto mb-3`} />
          <h3 className={`font-semibold ${theme.status.warning.text} mb-2`}>Asset Allocation</h3>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Build and optimize your portfolio across asset classes
          </p>
        </div>

        <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6 text-center`}>
          <Calculator className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-3`} />
          <h3 className={`font-semibold ${theme.status.success.text} mb-2`}>Growth Projection</h3>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            Calculate compound interest and long-term wealth building
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Target className="w-6 h-6" />
            Investment Fundamentals Framework
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Core Investment Principles</h4>
              <ul className="space-y-2">
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>• Time in market beats timing the market</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>• Diversification reduces risk without sacrificing returns</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>• Low fees compound to massive savings</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>• Asset allocation determines 90% of returns</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>• Consistent investing builds wealth systematically</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Age-Based Guidelines</h4>
              <ul className="space-y-2">
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>20s-30s:</span>
                  <span className="font-bold text-green-400">80-90% Stocks</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>40s:</span>
                  <span className="font-bold text-blue-400">70-80% Stocks</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>50s:</span>
                  <span className="font-bold text-yellow-400">60-70% Stocks</span>
                </li>
                <li className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>60s+:</span>
                  <span className="font-bold text-orange-400">40-60% Stocks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <DollarSign className="w-6 h-6" />
            The Power of Compound Interest
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.success.text} mb-2`}>Start at 25</h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>$500/month for 10 years</p>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>Invested: $60,000</p>
              <p className={`text-2xl font-bold ${theme.status.success.text}`}>At 65: $1.37M</p>
            </div>
            <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>Start at 35</h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>$500/month for 30 years</p>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>Invested: $180,000</p>
              <p className={`text-2xl font-bold ${theme.status.warning.text}`}>At 65: $1.13M</p>
            </div>
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.info.text} mb-2`}>The Difference</h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>Early starter advantage</p>
              <p className={`text-lg font-bold text-red-400`}>Invested $120k LESS</p>
              <p className={`text-2xl font-bold text-green-400`}>Ended with $240k MORE</p>
            </div>
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <BarChart3 className="w-6 h-6" />
            Asset Class Historical Returns (20-Year Averages)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.success.text} mb-2`}>US Stocks</h4>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>10.0%</p>
              <p className={`text-xs ${theme.textColors.secondary}`}>S&P 500 average</p>
            </div>
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.info.text} mb-2`}>International</h4>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>8.5%</p>
              <p className={`text-xs ${theme.textColors.secondary}`}>Developed markets</p>
            </div>
            <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.status.warning.text} mb-2`}>REITs</h4>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>8.0%</p>
              <p className={`text-xs ${theme.textColors.secondary}`}>Real estate</p>
            </div>
            <div className={`p-4 ${theme.backgrounds.card} border rounded-lg text-center`}>
              <h4 className={`font-bold ${theme.textColors.primary} mb-2`}>Bonds</h4>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>4.5%</p>
              <p className={`text-xs ${theme.textColors.secondary}`}>Government/corporate</p>
            </div>
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4`}>Investment Account Priority</h3>
          <div className="space-y-3">
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg flex items-center`}>
              <div className={`w-8 h-8 ${theme.status.success.bg} rounded-full flex items-center justify-center font-bold mr-4 ${theme.status.success.text}`}>1</div>
              <div>
                <h4 className={`font-bold ${theme.status.success.text}`}>401(k) Match</h4>
                <p className={`text-sm ${theme.textColors.secondary}`}>Free money - contribute enough for full employer match</p>
              </div>
            </div>
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg flex items-center`}>
              <div className={`w-8 h-8 ${theme.status.info.bg} rounded-full flex items-center justify-center font-bold mr-4 ${theme.status.info.text}`}>2</div>
              <div>
                <h4 className={`font-bold ${theme.status.info.text}`}>Emergency Fund</h4>
                <p className={`text-sm ${theme.textColors.secondary}`}>3-6 months expenses before investing</p>
              </div>
            </div>
            <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg flex items-center`}>
              <div className={`w-8 h-8 ${theme.status.warning.bg} rounded-full flex items-center justify-center font-bold mr-4 ${theme.status.warning.text}`}>3</div>
              <div>
                <h4 className={`font-bold ${theme.status.warning.text}`}>Roth IRA</h4>
                <p className={`text-sm ${theme.textColors.secondary}`}>$7,000/year tax-free growth (2024 limit)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className={`${theme.textColors.secondary} mb-4`}>
          Ready to build your investment strategy? Use our specialized tools above.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.slice(1).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Switch to ${tab.label}: ${tab.description}`}
              className={`flex items-center gap-2 px-4 py-2 ${theme.buttons.primary} rounded-lg transition-all hover-lift`}
            >
              <tab.icon className="w-4 h-4" aria-hidden="true" />
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
      case 'risk-assessment':
        return <RiskToleranceCalculator />;
      case 'asset-allocation':
        return <AssetAllocationOptimizer />;
      case 'compound-growth':
        return <CompoundInterestCalculator />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Tab Navigation with ARIA support */}
      <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-2`}>
        <div 
          role="tablist" 
          aria-label="Investment calculator tools"
          className="grid grid-cols-2 md:grid-cols-4 gap-1"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) {
                  tabRefs.current[tab.id] = el;
                }
              }}
              role="tab"
              tabIndex={activeTab === tab.id ? 0 : -1}
              aria-selected={activeTab === tab.id}
              aria-controls={contentId}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id, index)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? `${theme.buttons.primary} shadow-lg`
                  : `${theme.textColors.secondary} hover:${theme.backgrounds.card} hover:${theme.textColors.primary}`
              }`}
            >
              <tab.icon className="w-5 h-5" aria-hidden="true" />
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

      {/* Content with ARIA support */}
      <div 
        role="tabpanel"
        id={contentId}
        aria-labelledby={`tab-${activeTab}`}
        className="min-h-[600px]"
      >
        {renderContent()}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  TrendingDown,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Info,
  Target
} from 'lucide-react';

interface WithdrawalStrategy {
  name: string;
  description: string;
  withdrawalRate: number;
  flexibility: 'Low' | 'Medium' | 'High';
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
}

interface WithdrawalProjection {
  strategy: string;
  yearlyWithdrawal: number;
  portfolioLife: number;
  inflationAdjustedWithdrawal: number;
  successProbability: number;
  worstCaseScenario: number;
  bestCaseScenario: number;
}

const WithdrawalStrategyPlanner: React.FC = () => {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [retirementPortfolio, setRetirementPortfolio] = useState<number>(1000000);
  const [currentAge, setCurrentAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  const [inflationRate, setInflationRate] = useState<number>(3);
  const [portfolioReturn, setPortfolioReturn] = useState<number>(7);
  const [portfolioVolatility, setPortfolioVolatility] = useState<number>(15);
  const [desiredAnnualIncome] = useState<number>(60000);
  
  const [selectedStrategy, setSelectedStrategy] = useState<string>('4% Rule');
  const [projections, setProjections] = useState<WithdrawalProjection[]>([]);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateInput = (field: string, value: number, min: number, max: number) => {
    const newErrors = { ...validationErrors };
    
    if (value < min || value > max) {
      newErrors[field] = `Value must be between ${min} and ${max}`;
    } else {
      delete newErrors[field];
    }
    
    setValidationErrors(newErrors);
  };

  const strategies: WithdrawalStrategy[] = [
    {
      name: '4% Rule',
      description: 'Withdraw 4% of initial portfolio value, adjusted for inflation annually',
      withdrawalRate: 4,
      flexibility: 'Low',
      riskLevel: 'Conservative'
    },
    {
      name: 'Dynamic Withdrawal',
      description: 'Adjust withdrawal rate based on portfolio performance (3-5%)',
      withdrawalRate: 4,
      flexibility: 'High',
      riskLevel: 'Moderate'
    },
    {
      name: 'Bond Ladder',
      description: 'Fixed withdrawals from bond ladder, remaining in growth assets',
      withdrawalRate: 3.5,
      flexibility: 'Medium',
      riskLevel: 'Conservative'
    },
    {
      name: 'Bucket Strategy',
      description: 'Three buckets: cash (2yr), bonds (8yr), stocks (remainder)',
      withdrawalRate: 4.5,
      flexibility: 'Medium',
      riskLevel: 'Moderate'
    },
    {
      name: 'Guardrails Strategy',
      description: 'Increase/decrease spending based on portfolio performance bands',
      withdrawalRate: 5,
      flexibility: 'High',
      riskLevel: 'Moderate'
    },
    {
      name: 'Floor-and-Ceiling',
      description: 'Minimum floor (bonds) + variable ceiling (stocks)',
      withdrawalRate: 3.5,
      flexibility: 'Medium',
      riskLevel: 'Conservative'
    }
  ];

  useEffect(() => {
    recordCalculatorUsage('withdrawal-strategy-planner');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    calculateProjections();
  }, [retirementPortfolio, currentAge, lifeExpectancy, inflationRate, portfolioReturn, portfolioVolatility, desiredAnnualIncome]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateProjections = useCallback(() => {
    const yearsInRetirement = lifeExpectancy - currentAge;
    const newProjections: WithdrawalProjection[] = [];

    strategies.forEach(strategy => {
      const projection = simulateWithdrawalStrategy(strategy, yearsInRetirement);
      newProjections.push(projection);
    });

    setProjections(newProjections);
  }, [lifeExpectancy, currentAge, strategies, retirementPortfolio]); // eslint-disable-line react-hooks/exhaustive-deps

  const simulateWithdrawalStrategy = useCallback((strategy: WithdrawalStrategy, yearsInRetirement: number): WithdrawalProjection => {
    const initialWithdrawal = retirementPortfolio * (strategy.withdrawalRate / 100);
    let portfolioLife = yearsInRetirement;
    
    // Monte Carlo simulation (simplified)
    const simulations = 1000;
    let successfulSimulations = 0;
    let worstCase = Infinity;
    let bestCase = 0;

    for (let sim = 0; sim < simulations; sim++) {
      let simPortfolio = retirementPortfolio;
      let simWithdrawal = initialWithdrawal;
      let yearsLasted = 0;

      for (let year = 1; year <= yearsInRetirement; year++) {
        // Generate random return (normal distribution approximation)
        const randomReturn = generateRandomReturn(portfolioReturn, portfolioVolatility);
        
        // Apply strategy-specific logic
        if (strategy.name === 'Dynamic Withdrawal') {
          // Adjust withdrawal based on performance
          if (randomReturn > portfolioReturn + 2) {
            simWithdrawal = Math.min(simWithdrawal * 1.1, simPortfolio * 0.06);
          } else if (randomReturn < portfolioReturn - 2) {
            simWithdrawal = Math.max(simWithdrawal * 0.9, simPortfolio * 0.025);
          }
        } else if (strategy.name === 'Guardrails Strategy') {
          // Adjust based on portfolio value vs initial
          const portfolioRatio = simPortfolio / retirementPortfolio;
          if (portfolioRatio > 1.2) {
            simWithdrawal = initialWithdrawal * 1.1 * Math.pow(1 + inflationRate/100, year - 1);
          } else if (portfolioRatio < 0.8) {
            simWithdrawal = initialWithdrawal * 0.9 * Math.pow(1 + inflationRate/100, year - 1);
          } else {
            simWithdrawal = initialWithdrawal * Math.pow(1 + inflationRate/100, year - 1);
          }
        } else {
          // Standard inflation adjustment
          simWithdrawal = initialWithdrawal * Math.pow(1 + inflationRate/100, year - 1);
        }

        // Apply return and withdrawal
        simPortfolio = simPortfolio * (1 + randomReturn/100) - simWithdrawal;
        
        if (simPortfolio <= 0) {
          portfolioLife = year - 1;
          break;
        }
        yearsLasted = year;
      }

      if (yearsLasted >= yearsInRetirement) {
        successfulSimulations++;
      }
      
      worstCase = Math.min(worstCase, yearsLasted);
      bestCase = Math.max(bestCase, yearsLasted);
    }

    const successProbability = (successfulSimulations / simulations) * 100;
    const inflationAdjustedWithdrawal = initialWithdrawal * Math.pow(1 + inflationRate/100, 10);

    return {
      strategy: strategy.name,
      yearlyWithdrawal: initialWithdrawal,
      portfolioLife: portfolioLife,
      inflationAdjustedWithdrawal,
      successProbability,
      worstCaseScenario: worstCase,
      bestCaseScenario: Math.min(bestCase, yearsInRetirement)
    };
  }, [retirementPortfolio, portfolioReturn, portfolioVolatility, inflationRate]);

  const generateRandomReturn = (meanReturn: number, volatility: number): number => {
    // Box-Muller transformation for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return meanReturn + z * volatility;
  };

  const getStrategyColor = (successProbability: number) => {
    if (successProbability >= 85) return theme.status.success.text;
    if (successProbability >= 70) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getFlexibilityColor = (flexibility: string) => {
    switch (flexibility) {
      case 'High': return theme.status.success.text;
      case 'Medium': return theme.status.warning.text;
      case 'Low': return theme.status.error.text;
      default: return theme.textColors.secondary;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Conservative': return theme.status.success.text;
      case 'Moderate': return theme.status.warning.text;
      case 'Aggressive': return theme.status.error.text;
      default: return theme.textColors.secondary;
    }
  };

  const selectedProjection = projections.find(p => p.strategy === selectedStrategy);
  const yearsInRetirement = lifeExpectancy - currentAge;

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <header className="flex items-center gap-3 mb-6">
        <TrendingDown className="w-6 h-6 text-purple-400" aria-hidden="true" />
        <h1 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Withdrawal Strategy Planner
        </h1>
      </header>

      {/* Input Parameters */}
      <section aria-labelledby="input-parameters-heading">
        <h2 id="input-parameters-heading" className="sr-only">Input Parameters</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label htmlFor="retirement-portfolio" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Retirement Portfolio Value
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="retirement-portfolio"
                type="number"
                min="0"
                step="10000"
                value={retirementPortfolio}
                onChange={(e) => setRetirementPortfolio(Number(e.target.value))}
                className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="retirement-portfolio-help"
              />
            </div>
            <div id="retirement-portfolio-help" className="sr-only">Enter total retirement portfolio value for withdrawal planning</div>
          </div>

          <div>
            <label htmlFor="current-age-withdrawal" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Current Age
            </label>
            <input
              id="current-age-withdrawal"
              type="number"
              min="50"
              max="100"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              aria-describedby="current-age-help"
            />
            <div id="current-age-help" className="sr-only">Enter your current age for withdrawal strategy planning</div>
          </div>

          <div>
            <label htmlFor="life-expectancy" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Life Expectancy
            </label>
            <input
              id="life-expectancy"
              type="number"
              min="65"
              max="110"
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              aria-describedby="life-expectancy-help"
            />
            <div id="life-expectancy-help" className="sr-only">Enter expected life expectancy for portfolio duration planning</div>
          </div>
        </form>
      </section>

      {/* Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Retirement Portfolio Value
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={retirementPortfolio}
              onChange={(e) => setRetirementPortfolio(Number(e.target.value))}
              className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Current Age
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
            min="50"
            max="100"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Life Expectancy
          </label>
          <input
            type="number"
            value={lifeExpectancy}
            onChange={(e) => setLifeExpectancy(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
            min="65"
            max="120"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Expected Portfolio Return (%)
          </label>
          <input
            type="number"
            value={portfolioReturn}
            onChange={(e) => setPortfolioReturn(Number(e.target.value))}
            step="0.1"
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Portfolio Volatility (%)
          </label>
          <input
            type="number"
            value={portfolioVolatility}
            onChange={(e) => setPortfolioVolatility(Number(e.target.value))}
            step="0.1"
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Expected Inflation (%)
          </label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            step="0.1"
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
          />
        </div>
      </div>

      {/* Strategy Comparison */}
      <div className="mb-8">
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5" />
          Withdrawal Strategy Comparison
        </h3>
        
        <div className="overflow-x-auto">
          <table className={`w-full border ${theme.borderColors.primary} rounded-lg`}>
            <thead className={`${theme.backgrounds.card}`}>
              <tr>
                <th className={`px-4 py-3 text-left ${theme.textColors.primary} font-medium`}>Strategy</th>
                <th className={`px-4 py-3 text-center ${theme.textColors.primary} font-medium`}>Initial Withdrawal</th>
                <th className={`px-4 py-3 text-center ${theme.textColors.primary} font-medium`}>Success Rate</th>
                <th className={`px-4 py-3 text-center ${theme.textColors.primary} font-medium`}>Flexibility</th>
                <th className={`px-4 py-3 text-center ${theme.textColors.primary} font-medium`}>Risk Level</th>
                <th className={`px-4 py-3 text-center ${theme.textColors.primary} font-medium`}>Worst Case</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((projection, index) => {
                const strategy = strategies.find(s => s.name === projection.strategy)!;
                return (
                  <tr 
                    key={index} 
                    className={`border-t ${theme.borderColors.primary} hover:${theme.backgrounds.card} cursor-pointer ${selectedStrategy === projection.strategy ? theme.backgrounds.card : ''}`}
                    onClick={() => setSelectedStrategy(projection.strategy)}
                  >
                    <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                      {projection.strategy}
                    </td>
                    <td className={`px-4 py-3 text-center ${theme.textColors.primary}`}>
                      ${projection.yearlyWithdrawal.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-center font-medium ${getStrategyColor(projection.successProbability)}`}>
                      {projection.successProbability.toFixed(1)}%
                    </td>
                    <td className={`px-4 py-3 text-center ${getFlexibilityColor(strategy.flexibility)}`}>
                      {strategy.flexibility}
                    </td>
                    <td className={`px-4 py-3 text-center ${getRiskColor(strategy.riskLevel)}`}>
                      {strategy.riskLevel}
                    </td>
                    <td className={`px-4 py-3 text-center ${theme.textColors.secondary}`}>
                      {projection.worstCaseScenario} years
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Strategy Details */}
      {selectedProjection && (
        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            {selectedStrategy} - Detailed Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
              <div className={`text-xl font-bold ${theme.status.info.text} mb-1`}>
                ${selectedProjection.yearlyWithdrawal.toLocaleString()}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Initial Annual Withdrawal</div>
            </div>
            
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <div className={`text-xl font-bold ${getStrategyColor(selectedProjection.successProbability)} mb-1`}>
                {selectedProjection.successProbability.toFixed(1)}%
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Success Probability</div>
            </div>

            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                ${selectedProjection.inflationAdjustedWithdrawal.toLocaleString()}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Withdrawal in 10 Years</div>
            </div>

            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <div className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                {yearsInRetirement}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Years in Retirement</div>
            </div>
          </div>

          <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
              Strategy Description
            </h4>
            <p className={`${theme.textColors.secondary} text-sm`}>
              {strategies.find(s => s.name === selectedStrategy)?.description}
            </p>
          </div>
        </div>
      )}

      {/* Risk Warnings */}
      <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg mb-6`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text} mt-0.5 flex-shrink-0`} />
          <div>
            <h4 className={`font-semibold ${theme.status.warning.text} mb-2`}>Important Considerations</h4>
            <ul className={`text-sm ${theme.status.warning.text} space-y-1`}>
              <li>• Past performance doesn&apos;t guarantee future results</li>
              <li>• Market volatility can significantly impact withdrawal sustainability</li>
              <li>• Healthcare costs and unexpected expenses should be factored separately</li>
              <li>• Consider Social Security and pension income in your overall plan</li>
              <li>• Regular strategy reviews and adjustments are essential</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
          <Info className="w-4 h-4" />
          Withdrawal Strategy Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Conservative Strategies:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Bond Ladder: Predictable income stream</li>
              <li>• 4% Rule: Time-tested withdrawal rate</li>
              <li>• Floor-and-Ceiling: Guaranteed minimum income</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Flexible Strategies:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Dynamic Withdrawal: Adapts to market conditions</li>
              <li>• Guardrails: Spending adjustments based on performance</li>
              <li>• Bucket Strategy: Time-based asset allocation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Screen Reader Status Updates */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {projections && projections.length > 0 ? 
          `Withdrawal strategy analysis complete. ${projections.length} projection years analyzed.` :
          'Configure your retirement parameters to begin withdrawal strategy analysis.'
        }
      </div>
    </div>
  );
};

export default WithdrawalStrategyPlanner;

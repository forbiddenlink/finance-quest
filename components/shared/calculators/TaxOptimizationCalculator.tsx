'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calculator, FileText, TrendingUp, DollarSign, Percent, PieChart } from 'lucide-react';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';

interface TaxOptimizationCalculatorProps {
  onCalculationComplete?: () => void;
}

const stateTaxRates: Record<string, number> = {
  'CA': 0.133, 'NY': 0.109, 'NJ': 0.1075, 'HI': 0.11, 'OR': 0.099,
  'MN': 0.0985, 'DC': 0.095, 'IA': 0.0898, 'VT': 0.0895, 'WI': 0.0765,
  'FL': 0, 'TX': 0, 'WA': 0, 'NV': 0, 'WY': 0, 'TN': 0, 'AK': 0
};

const federalTaxBrackets = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11000, max: 44725, rate: 0.12 },
  { min: 44725, max: 95375, rate: 0.22 },
  { min: 95375, max: 182050, rate: 0.24 },
  { min: 182050, max: 231250, rate: 0.32 },
  { min: 231250, max: 578125, rate: 0.35 },
  { min: 578125, max: Infinity, rate: 0.37 }
];

const calculateFederalTax = (taxableIncome: number): number => {
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of federalTaxBrackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
};

export default function TaxOptimizationCalculator({ onCalculationComplete }: TaxOptimizationCalculatorProps) {
  const [income, setIncome] = useState<number>(100000);
  const [currentState, setCurrentState] = useState<string>('CA');
  const [capitalGains, setCapitalGains] = useState<number>(10000);
  const [capitalLosses, setCapitalLosses] = useState<number>(5000);
  const [municipalBondYield, setMunicipalBondYield] = useState<number>(3.5);
  const [rothConversion, setRothConversion] = useState<number>(25000);
  const [results, setResults] = useState<{
    currentTax: {
      federal: number;
      state: number;
      total: number;
      marginalRate: number;
    };
    capitalGainsLoss: {
      netGains: number;
      netLosses: number;
      deductibleLoss: number;
      lossCarryforward: number;
      taxSavings: number;
    };
    municipalBonds: {
      yield: number;
      taxEquivalentYield: number;
      advantage: number;
    };
    rothConversion: {
      conversionAmount: number;
      conversionTax: number;
      potentialSavings: number;
      breakEvenYears: number;
    };
    stateOptimization: {
      currentState: string;
      annualSavings: number;
      lifetimeSavings: number;
      recommendation: string;
    };
    totalOptimizationPotential: number;
  } | null>(null);

  const calculateTaxOptimization = useCallback(() => {
    // Federal tax calculations
    const federalTax = calculateFederalTax(income);
    const stateTax = income * (stateTaxRates[currentState] || 0);
    const totalCurrentTax = federalTax + stateTax;
    const currentMarginalRate = 0.24 + (stateTaxRates[currentState] || 0); // Assuming 24% federal bracket

    // Capital gains/loss calculations
    const netGains = Math.max(0, capitalGains - capitalLosses);
    const netLosses = Math.max(0, capitalLosses - capitalGains);
    const deductibleLoss = Math.min(netLosses, 3000);
    const lossCarryforward = Math.max(0, netLosses - 3000);
    const taxSavingsFromLoss = deductibleLoss * currentMarginalRate;

    // Municipal bond equivalent yield
    const taxEquivalentYield = municipalBondYield / (1 - currentMarginalRate);

    // Roth conversion analysis
    const conversionTax = rothConversion * currentMarginalRate;
    const futureValueTaxable = rothConversion * Math.pow(1.07, 20); // 20 years at 7%
    const futureTaxOnTaxable = futureValueTaxable * 0.15; // Assuming 15% capital gains
    const rothPotentialSavings = futureTaxOnTaxable - conversionTax;

    // State tax optimization
    const noTaxStates = ['FL', 'TX', 'WA', 'NV', 'WY', 'TN', 'AK'];
    const annualStateTaxSavings = noTaxStates.includes(currentState) ? 0 : stateTax;
    const lifetimeStateSavings = annualStateTaxSavings * 25; // 25 years

    setResults({
      currentTax: {
        federal: federalTax,
        state: stateTax,
        total: totalCurrentTax,
        marginalRate: currentMarginalRate
      },
      capitalGainsLoss: {
        netGains,
        netLosses,
        deductibleLoss,
        lossCarryforward,
        taxSavings: taxSavingsFromLoss
      },
      municipalBonds: {
        yield: municipalBondYield,
        taxEquivalentYield,
        advantage: taxEquivalentYield - municipalBondYield
      },
      rothConversion: {
        conversionAmount: rothConversion,
        conversionTax,
        potentialSavings: rothPotentialSavings,
        breakEvenYears: rothPotentialSavings > 0 ? 8 : 15
      },
      stateOptimization: {
        currentState,
        annualSavings: annualStateTaxSavings,
        lifetimeSavings: lifetimeStateSavings,
        recommendation: annualStateTaxSavings > 10000 ? 'Consider relocating' : 'State tax burden manageable'
      },
      totalOptimizationPotential: taxSavingsFromLoss + Math.max(0, rothPotentialSavings) + annualStateTaxSavings
    });

    onCalculationComplete?.();
  }, [income, currentState, capitalGains, capitalLosses, municipalBondYield, rothConversion, onCalculationComplete]);

  useEffect(() => {
    calculateTaxOptimization();
  }, [calculateTaxOptimization]);

  return (
    <div className="space-y-6">
      {/* Calculator Header */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Calculator className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
          Tax Optimization Calculator
        </h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Analyze tax-saving strategies including loss harvesting, Roth conversions, and geographic optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <GradientCard variant="glass" gradient="blue" className="p-6">
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-6 flex items-center`}>
            <FileText className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
            Financial Information
          </h3>

          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Annual Income
              </label>
              <div className="relative">
                <DollarSign className={`w-5 h-5 ${theme.textColors.muted} absolute left-3 top-1/2 transform -translate-y-1/2`} />
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-white focus:outline-none focus:border-blue-400`}
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                State of Residence
              </label>
              <select
                value={currentState}
                onChange={(e) => setCurrentState(e.target.value)}
                className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-white focus:outline-none focus:border-blue-400`}
              >
                <option value="CA">California (13.3%)</option>
                <option value="NY">New York (10.9%)</option>
                <option value="NJ">New Jersey (10.75%)</option>
                <option value="OR">Oregon (9.9%)</option>
                <option value="FL">Florida (0%)</option>
                <option value="TX">Texas (0%)</option>
                <option value="WA">Washington (0%)</option>
                <option value="NV">Nevada (0%)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Capital Gains
                </label>
                <div className="relative">
                  <DollarSign className={`w-4 h-4 ${theme.textColors.muted} absolute left-3 top-1/2 transform -translate-y-1/2`} />
                  <input
                    type="number"
                    value={capitalGains}
                    onChange={(e) => setCapitalGains(Number(e.target.value))}
                    className={`w-full pl-9 pr-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-white text-sm focus:outline-none focus:border-blue-400`}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Capital Losses
                </label>
                <div className="relative">
                  <DollarSign className={`w-4 h-4 ${theme.textColors.muted} absolute left-3 top-1/2 transform -translate-y-1/2`} />
                  <input
                    type="number"
                    value={capitalLosses}
                    onChange={(e) => setCapitalLosses(Number(e.target.value))}
                    className={`w-full pl-9 pr-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-white text-sm focus:outline-none focus:border-blue-400`}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Municipal Bond Yield (%)
              </label>
              <div className="relative">
                <Percent className={`w-5 h-5 ${theme.textColors.muted} absolute left-3 top-1/2 transform -translate-y-1/2`} />
                <input
                  type="number"
                  value={municipalBondYield}
                  onChange={(e) => setMunicipalBondYield(Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-white focus:outline-none focus:border-blue-400`}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Potential Roth Conversion
              </label>
              <div className="relative">
                <DollarSign className={`w-5 h-5 ${theme.textColors.muted} absolute left-3 top-1/2 transform -translate-y-1/2`} />
                <input
                  type="number"
                  value={rothConversion}
                  onChange={(e) => setRothConversion(Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-white focus:outline-none focus:border-blue-400`}
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>
        </GradientCard>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Current Tax Situation */}
            <GradientCard variant="glass" gradient="green" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
                <PieChart className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
                Current Tax Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Federal Tax:</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>
                    ${results.currentTax.federal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>State Tax:</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>
                    ${results.currentTax.state.toLocaleString()}
                  </span>
                </div>
                <div className={`border-t ${theme.borderColors.primary} pt-3 flex justify-between`}>
                  <span className={`font-medium ${theme.textColors.primary}`}>Total Tax:</span>
                  <span className={`font-bold text-xl ${theme.textColors.primary}`}>
                    ${results.currentTax.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Marginal Rate:</span>
                  <span className={`font-bold ${theme.status.info.text}`}>
                    {(results.currentTax.marginalRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </GradientCard>

            {/* Tax-Loss Harvesting */}
            <GradientCard variant="glass" gradient="blue" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
                <TrendingUp className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
                Tax-Loss Harvesting
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Net Gains/Losses:</span>
                  <span className={`font-bold ${
                    results.capitalGainsLoss.netGains > 0 ? theme.status.error.text : theme.status.success.text
                  }`}>
                    {results.capitalGainsLoss.netGains > 0 
                      ? `+$${results.capitalGainsLoss.netGains.toLocaleString()}` 
                      : `-$${results.capitalGainsLoss.netLosses.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Deductible Loss:</span>
                  <span className={`font-bold ${theme.status.success.text}`}>
                    ${results.capitalGainsLoss.deductibleLoss.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Tax Savings:</span>
                  <span className={`font-bold ${theme.status.success.text}`}>
                    ${results.capitalGainsLoss.taxSavings.toLocaleString()}
                  </span>
                </div>
                {results.capitalGainsLoss.lossCarryforward > 0 && (
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Loss Carryforward:</span>
                    <span className={`font-bold ${theme.status.warning.text}`}>
                      ${results.capitalGainsLoss.lossCarryforward.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </GradientCard>

            {/* Municipal Bonds */}
            <GradientCard variant="glass" gradient="purple" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
                Municipal Bond Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Municipal Yield:</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>
                    {results.municipalBonds.yield.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Tax-Equivalent Yield:</span>
                  <span className={`font-bold ${theme.status.success.text}`}>
                    {results.municipalBonds.taxEquivalentYield.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Tax Advantage:</span>
                  <span className={`font-bold ${theme.status.info.text}`}>
                    +{results.municipalBonds.advantage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </GradientCard>

            {/* Roth Conversion */}
            <GradientCard variant="glass" gradient="yellow" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
                Roth Conversion Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Conversion Tax:</span>
                  <span className={`font-bold ${theme.status.error.text}`}>
                    ${results.rothConversion.conversionTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Potential 20-yr Savings:</span>
                  <span className={`font-bold ${
                    results.rothConversion.potentialSavings > 0 ? theme.status.success.text : theme.status.error.text
                  }`}>
                    ${results.rothConversion.potentialSavings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Break-even Timeline:</span>
                  <span className={`font-bold ${theme.status.info.text}`}>
                    {results.rothConversion.breakEvenYears} years
                  </span>
                </div>
              </div>
            </GradientCard>

            {/* State Tax Optimization */}
            <GradientCard variant="glass" gradient="green" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
                Geographic Tax Optimization
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Current State:</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>
                    {results.stateOptimization.currentState}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Annual State Tax:</span>
                  <span className={`font-bold ${
                    results.stateOptimization.annualSavings > 0 ? theme.status.error.text : theme.status.success.text
                  }`}>
                    ${results.stateOptimization.annualSavings.toLocaleString()}
                  </span>
                </div>
                {results.stateOptimization.annualSavings > 0 && (
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Lifetime Savings (No-Tax State):</span>
                    <span className={`font-bold ${theme.status.success.text}`}>
                      ${results.stateOptimization.lifetimeSavings.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className={`text-sm ${theme.textColors.muted} italic`}>
                  {results.stateOptimization.recommendation}
                </div>
              </div>
            </GradientCard>

            {/* Total Optimization Summary */}
            <GradientCard variant="glass" gradient="yellow" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
                Total Optimization Potential
              </h3>
              <div className="text-center">
                <div className={`text-4xl font-bold ${theme.status.success.text} mb-2`}>
                  ${results.totalOptimizationPotential.toLocaleString()}
                </div>
                <p className={`${theme.textColors.secondary} text-sm`}>
                  Annual tax savings through strategic optimization
                </p>
              </div>
            </GradientCard>
          </div>
        )}
      </div>

      {/* Educational Context */}
      <GradientCard variant="glass" gradient="blue" className="p-6">
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
          💡 Tax Optimization Strategy Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Priority Strategies:</h4>
            <ul className={`${theme.textColors.secondary} space-y-1 text-sm`}>
              <li>• Maximize tax-loss harvesting annually</li>
              <li>• Optimize asset location for tax efficiency</li>
              <li>• Time Roth conversions during low-income years</li>
              <li>• Consider geographic arbitrage opportunities</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Warning Signs:</h4>
            <ul className={`${theme.textColors.secondary} space-y-1 text-sm`}>
              <li>• Violating wash sale rules</li>
              <li>• Converting too much to Roth in high-tax years</li>
              <li>• Ignoring state residency requirements</li>
              <li>• Letting tax optimization override investment strategy</li>
            </ul>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}

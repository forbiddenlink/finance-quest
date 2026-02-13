'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Calculator,
  BarChart3,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

interface CreditScenario {
  id: string;
  name: string;
  description: string;
  scoreImpact: number;
  timeToRecover: string;
  icon: React.ReactNode;
  severity: 'positive' | 'negative' | 'neutral';
}

interface CreditSimulationResult {
  scenario: string;
  initialScore: number;
  finalScore: number;
  mortgageRateDiff: number;
  lifetimeSavings: number;
  timeline: Array<{
    month: number;
    score: number;
    event?: string;
  }>;
}

const creditScenarios: CreditScenario[] = [
  {
    id: 'late-payment',
    name: 'Late Payment (30 days)',
    description: 'Missing a single payment by 30+ days',
    scoreImpact: -60,
    timeToRecover: '12-24 months',
    icon: <AlertTriangle className="w-5 h-5" />,
    severity: 'negative'
  },
  {
    id: 'maxed-card',
    name: 'Max Out Credit Card',
    description: 'Utilization jumps from 10% to 90%',
    scoreImpact: -45,
    timeToRecover: '3-6 months',
    icon: <CreditCard className="w-5 h-5" />,
    severity: 'negative'
  },
  {
    id: 'new-card',
    name: 'Open New Credit Card',
    description: 'Hard inquiry + new account',
    scoreImpact: -12,
    timeToRecover: '3-6 months',
    icon: <CheckCircle className="w-5 h-5" />,
    severity: 'negative'
  },
  {
    id: 'pay-down-debt',
    name: 'Pay Down Credit Cards',
    description: 'Reduce utilization from 60% to 10%',
    scoreImpact: +85,
    timeToRecover: '1-2 months',
    icon: <TrendingUp className="w-5 h-5" />,
    severity: 'positive'
  },
  {
    id: 'debt-consolidation',
    name: 'Debt Consolidation',
    description: 'Personal loan to pay off cards',
    scoreImpact: +25,
    timeToRecover: '2-3 months',
    icon: <Target className="w-5 h-5" />,
    severity: 'positive'
  },
  {
    id: 'account-closure',
    name: 'Close Old Credit Card',
    description: 'Reduce available credit',
    scoreImpact: -20,
    timeToRecover: '6-12 months',
    icon: <TrendingDown className="w-5 h-5" />,
    severity: 'negative'
  }
];

const mortgageRatesByScore = [
  { range: '760+', rate: 6.8, label: 'Excellent Credit' },
  { range: '740-759', rate: 7.0, label: 'Very Good Credit' },
  { range: '700-739', rate: 7.3, label: 'Good Credit' },
  { range: '660-699', rate: 7.8, label: 'Fair Credit' },
  { range: '620-659', rate: 8.5, label: 'Poor Credit' },
  { range: '<620', rate: 9.8, label: 'Very Poor Credit' }
];

export default function CreditScoreImpactSimulator() {
  const { recordCalculatorUsage, recordSimulationResult } = useProgressStore();
  const [currentScore, setCurrentScore] = useState(720);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<CreditSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loanAmount, setLoanAmount] = useState(350000);

  useEffect(() => {
    recordCalculatorUsage('credit-score-impact-simulator');
  }, [recordCalculatorUsage]);

  const getMortgageRate = (score: number): number => {
    if (score >= 760) return 6.8;
    if (score >= 740) return 7.0;
    if (score >= 700) return 7.3;
    if (score >= 660) return 7.8;
    if (score >= 620) return 8.5;
    return 9.8;
  };

  const calculateLifetimeSavings = (initialScore: number, finalScore: number, loanAmount: number): number => {
    const initialRate = getMortgageRate(initialScore);
    const finalRate = getMortgageRate(finalScore);

    const monthlyRateInitial = initialRate / 100 / 12;
    const monthlyRateFinal = finalRate / 100 / 12;
    const numPayments = 360;

    const monthlyInitial = loanAmount *
      (monthlyRateInitial * Math.pow(1 + monthlyRateInitial, numPayments)) /
      (Math.pow(1 + monthlyRateInitial, numPayments) - 1);

    const monthlyFinal = loanAmount *
      (monthlyRateFinal * Math.pow(1 + monthlyRateFinal, numPayments)) /
      (Math.pow(1 + monthlyRateFinal, numPayments) - 1);

    const totalInitial = monthlyInitial * 360;
    const totalFinal = monthlyFinal * 360;

    return totalInitial - totalFinal;
  };

  const generateScoreTimeline = (baseScore: number, scenarios: CreditScenario[]): Array<{
    month: number;
    score: number;
    event?: string;
  }> => {
    const timeline = [];
    let currentScore = baseScore;

    // Initial state
    timeline.push({ month: 0, score: currentScore });

    // Apply immediate impacts
    scenarios.forEach((scenario, index) => {
      const impactMonth = (index + 1) * 2; // Stagger events
      currentScore += scenario.scoreImpact;
      currentScore = Math.max(300, Math.min(850, currentScore)); // Keep within bounds

      timeline.push({
        month: impactMonth,
        score: currentScore,
        event: scenario.name
      });
    });

    // Recovery over time
    const finalScore = currentScore;
    for (let month = timeline[timeline.length - 1].month + 1; month <= 36; month++) {
      // Gradual recovery toward baseline
      const recoveryProgress = Math.min(1, (month - timeline[timeline.length - 1].month) / 24);
      const targetScore = baseScore + scenarios.reduce((sum, s) => sum + s.scoreImpact * 0.2, 0);
      currentScore = finalScore + (targetScore - finalScore) * recoveryProgress;
      currentScore = Math.max(300, Math.min(850, Math.round(currentScore)));

      timeline.push({ month, score: currentScore });
    }

    return timeline;
  };

  const runSimulation = async () => {
    if (selectedScenarios.length === 0) return;

    setIsSimulating(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const scenarios = creditScenarios.filter(s => selectedScenarios.includes(s.id));
    const totalImpact = scenarios.reduce((sum, scenario) => sum + scenario.scoreImpact, 0);
    const finalScore = Math.max(300, Math.min(850, currentScore + totalImpact));

    const timeline = generateScoreTimeline(currentScore, scenarios);
    const rateDiff = getMortgageRate(currentScore) - getMortgageRate(finalScore);
    const lifetimeSavings = calculateLifetimeSavings(currentScore, finalScore, loanAmount);

    const result: CreditSimulationResult = {
      scenario: scenarios.map(s => s.name).join(', '),
      initialScore: currentScore,
      finalScore,
      mortgageRateDiff: rateDiff,
      lifetimeSavings,
      timeline
    };

    setSimulationResult(result);
    setIsSimulating(false);

    // Record for analytics
    recordSimulationResult({
      scenarioId: selectedScenarios.join(','),
      totalScore: finalScore,
      timeSpent: 5,
      correctAnswers: 1,
      totalQuestions: 1,
      financialOutcome: lifetimeSavings,
      grade: lifetimeSavings > 0 ? 'A' : lifetimeSavings > -10000 ? 'B' : 'C',
      strengths: ['Credit Score Simulation'],
      improvements: [],
      completedAt: new Date()
    });
  };

  const resetSimulation = () => {
    setSimulationResult(null);
    setSelectedScenarios([]);
  };

  const toggleScenario = (scenarioId: string) => {
    setSelectedScenarios(prev =>
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 740) return 'text-emerald-400';
    if (score >= 670) return 'text-blue-400';
    if (score >= 580) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4"
        >
          <div className={`${theme.status.info.bg} p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0`}>
            <BarChart3 className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.status.info.text}`} />
          </div>
          <div>
            <h3 className={`text-lg sm:text-xl font-bold ${theme.textColors.primary} mb-0.5 sm:mb-1 leading-tight`}>
              Credit Score Impact Simulator
            </h3>
            <p className={`${theme.textColors.secondary} text-sm sm:text-base`}>
              See how credit decisions affect your score and financial future
            </p>
          </div>
        </motion.div>
      </div>

      {/* Current Credit Setup */}
      <GradientCard variant="glass" gradient="blue" className="p-4 sm:p-6 mb-6 sm:mb-8">
        <h4 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2`}>
          <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
          Your Current Credit Profile
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={`block text-xs sm:text-sm font-medium ${theme.textColors.secondary} mb-1.5 sm:mb-2`}>
              Current Credit Score
            </label>
            <input
              type="range"
              min="300"
              max="850"
              value={currentScore}
              onChange={(e) => setCurrentScore(parseInt(e.target.value))}
              className="w-full h-1.5 sm:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Current Credit Score"
            />
            <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mt-1">
              <span>300</span>
              <span className={`font-bold ${getScoreColor(currentScore)}`}>
                {currentScore} ({getScoreGrade(currentScore)})
              </span>
              <span>850</span>
            </div>
          </div>

          <div>
            <label className={`block text-xs sm:text-sm font-medium ${theme.textColors.secondary} mb-1.5 sm:mb-2`}>
              Mortgage Amount
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value) || 350000)}
              className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} text-xs sm:text-sm`}
              placeholder="350000"
            />
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">30-year fixed mortgage</p>
          </div>
        </div>
      </GradientCard>

      {/* Scenario Selection */}
      <div className="mb-6 sm:mb-8">
        <h4 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2`}>
          <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          Select Credit Scenarios to Simulate
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {creditScenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleScenario(scenario.id)}
              className={`p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all ${selectedScenarios.includes(scenario.id)
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-600'
                }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${scenario.severity === 'positive' ? theme.status.success.bg :
                    scenario.severity === 'negative' ? theme.status.error.bg :
                      theme.status.warning.bg
                  }`}>
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4">{scenario.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary} mb-0.5 sm:mb-1 truncate`}>
                    {scenario.name}
                  </h5>
                  <p className={`text-xs sm:text-sm ${theme.textColors.secondary} mb-1.5 sm:mb-2 line-clamp-2`}>
                    {scenario.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className={`font-medium ${scenario.scoreImpact > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                      {scenario.scoreImpact > 0 ? '+' : ''}{scenario.scoreImpact} points
                    </span>
                    <span className="text-slate-400">
                      {scenario.timeToRecover}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runSimulation}
          disabled={selectedScenarios.length === 0 || isSimulating}
          aria-label={isSimulating ? 'Simulating credit score impact' : 'Run credit score simulation'}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 ${theme.buttons.primary} rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base`}
        >
          {isSimulating ? (
            <>
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Run Simulation
            </>
          )}
        </motion.button>

        {simulationResult && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSimulation}
            aria-label="Reset simulation"
            className={`flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-lg sm:rounded-xl hover:border-white/20 transition-colors text-sm sm:text-base`}
          >
            Reset
          </motion.button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {simulationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Score Impact Summary */}
            <GradientCard variant="glass" gradient="green" className="p-4 sm:p-6">
              <h4 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4`}>
                Credit Score Impact Analysis
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${getScoreColor(simulationResult.initialScore)} mb-0.5 sm:mb-1`}>
                    {simulationResult.initialScore}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">Initial Score</div>
                </div>

                <div className="text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${getScoreColor(simulationResult.finalScore)} mb-0.5 sm:mb-1`}>
                    {simulationResult.finalScore}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">Final Score</div>
                </div>

                <div className="text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${simulationResult.finalScore > simulationResult.initialScore ? 'text-emerald-400' : 'text-red-400'
                    } mb-0.5 sm:mb-1`}>
                    {simulationResult.finalScore > simulationResult.initialScore ? '+' : ''}
                    {simulationResult.finalScore - simulationResult.initialScore}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">Point Change</div>
                </div>

                <div className="text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${simulationResult.lifetimeSavings > 0 ? 'text-emerald-400' : 'text-red-400'
                    } mb-0.5 sm:mb-1`}>
                    {simulationResult.lifetimeSavings > 0 ? '+' : ''}
                    {formatCurrency(Math.abs(simulationResult.lifetimeSavings))}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    {simulationResult.lifetimeSavings > 0 ? 'Savings' : 'Cost'}
                  </div>
                </div>
              </div>
            </GradientCard>

            {/* Score Timeline */}
            <GradientCard variant="glass" gradient="blue" className="p-4 sm:p-6">
              <h4 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4`}>
                Credit Score Recovery Timeline
              </h4>

              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationResult.timeline} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="month"
                      stroke="#9CA3AF"
                      fontSize={10}
                      tickMargin={8}
                      label={{ value: 'Months', position: 'insideBottom', offset: -5, fontSize: 10 }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      domain={[300, 850]}
                      fontSize={10}
                      width={40}
                      label={{ value: 'Credit Score', angle: -90, position: 'insideLeft', fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB',
                        fontSize: '12px',
                        padding: '8px'
                      }}
                      formatter={(value: number) => [
                        `${value} (${getScoreGrade(value)})`,
                        'Credit Score'
                      ]}
                      labelFormatter={(month) => `Month ${month}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3B82F6"
                      fill="rgba(59, 130, 246, 0.2)"
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GradientCard>

            {/* Financial Impact */}
            <GradientCard variant="glass" gradient="yellow" className="p-4 sm:p-6">
              <h4 className={`text-base sm:text-lg font-semibold ${theme.textColors.primary} mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2`}>
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                Lifetime Financial Impact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h5 className="font-semibold text-sm sm:text-base text-white mb-2 sm:mb-3">Mortgage Rate Impact</h5>
                  <div className="space-y-1.5 sm:space-y-2">
                    {mortgageRatesByScore.map((rate) => (
                      <div key={rate.range} className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-slate-300">{rate.range}:</span>
                        <span className="font-bold text-xs sm:text-sm text-white">{rate.rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className={`p-3 sm:p-4 ${theme.status.info.bg} rounded-lg`}>
                    <h6 className="font-semibold text-sm sm:text-base text-white mb-1.5 sm:mb-2">Key Insights</h6>
                    <ul className="text-xs sm:text-sm text-slate-300 space-y-0.5 sm:space-y-1">
                      <li>• A 100-point credit score increase can save $50,000+ on a mortgage</li>
                      <li>• Late payments stay on your report for 7 years</li>
                      <li>• Utilization has immediate impact on your score</li>
                      <li>• Length of credit history matters - keep old accounts open</li>
                    </ul>
                  </div>

                  {Math.abs(simulationResult.lifetimeSavings) > 10000 && (
                    <div className={`p-3 sm:p-4 ${simulationResult.lifetimeSavings > 0 ? theme.status.success.bg : theme.status.error.bg
                      } rounded-lg`}>
                      <h6 className="font-semibold text-sm sm:text-base text-white mb-1.5 sm:mb-2">
                        {simulationResult.lifetimeSavings > 0 ? '💡 Smart Move!' : '⚠️ Consider the Cost'}
                      </h6>
                      <p className="text-xs sm:text-sm text-white">
                        {simulationResult.lifetimeSavings > 0
                          ? `This credit improvement could save you ${formatCurrency(simulationResult.lifetimeSavings)} over the life of your mortgage!`
                          : `This credit damage could cost you ${formatCurrency(Math.abs(simulationResult.lifetimeSavings))} in extra interest payments.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </GradientCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Tips */}
      <div className={`mt-6 sm:mt-8 p-3 sm:p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
        <h5 className={`font-semibold text-sm sm:text-base ${theme.status.info.text} mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2`}>
          <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Credit Score Optimization Tips
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">
          <div>
            <h6 className="font-semibold text-sm sm:text-base text-white mb-0.5 sm:mb-1">Quick Wins (1-3 months):</h6>
            <ul className="space-y-0.5 sm:space-y-1">
              <li>• Pay down credit card balances below 30%</li>
              <li>• Request credit limit increases</li>
              <li>• Pay bills before statement closing date</li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold text-sm sm:text-base text-white mb-0.5 sm:mb-1">Long-term Strategy:</h6>
            <ul className="space-y-0.5 sm:space-y-1">
              <li>• Never miss payments (set up autopay)</li>
              <li>• Keep old accounts open for history length</li>
              <li>• Diversify credit mix (cards + installment loans)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

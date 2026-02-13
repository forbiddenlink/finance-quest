'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Target,
  Zap,
  Timer,
  Trophy,
  RefreshCw,
  Play
} from 'lucide-react';

interface FeeScenario {
  id: string;
  name: string;
  description: string;
  monthlyIncome: number;
  currentFees: {
    checking: number;
    overdraft: number;
    atm: number;
    other: number;
  };
  optimizedFees: {
    checking: number;
    overdraft: number;
    atm: number;
    other: number;
  };
  userProfile: string;
}

interface GameState {
  score: number;
  round: number;
  timeLeft: number;
  isPlaying: boolean;
  currentScenario: FeeScenario | null;
  selectedStrategy: string | null;
  feedback: string | null;
}

const feeScenarios: FeeScenario[] = [
  {
    id: 'college-student',
    name: 'College Student - Emma',
    description: 'Part-time job, tight budget, occasional overdrafts',
    monthlyIncome: 1200,
    currentFees: {
      checking: 15,    // Monthly maintenance fee
      overdraft: 70,   // 2 overdrafts × $35
      atm: 12,         // 4 out-of-network ATM uses × $3
      other: 8         // Random fees
    },
    optimizedFees: {
      checking: 0,     // Student account or credit union
      overdraft: 0,    // Overdraft protection + alerts
      atm: 0,          // Credit union network
      other: 0         // Fee-conscious banking
    },
    userProfile: 'Student with limited income who needs fee-free banking'
  },
  {
    id: 'young-professional',
    name: 'Young Professional - Marcus',
    description: 'Starting career, building emergency fund, occasional fees',
    monthlyIncome: 4500,
    currentFees: {
      checking: 15,    // Big bank maintenance fee
      overdraft: 35,   // 1 occasional overdraft
      atm: 6,          // 2 out-of-network uses
      other: 12        // Wire transfers, certified checks
    },
    optimizedFees: {
      checking: 0,     // Online bank or minimum balance waiver
      overdraft: 0,    // Account alerts and budgeting
      atm: 0,          // Fee reimbursement bank
      other: 5         // Minimal unavoidable fees
    },
    userProfile: 'Professional who can optimize with better bank choice'
  },
  {
    id: 'family-saver',
    name: 'Family Saver - Sarah & Mike',
    description: 'Dual income family, multiple accounts, various banking needs',
    monthlyIncome: 8500,
    currentFees: {
      checking: 30,    // 2 checking accounts × $15
      overdraft: 0,    // Good at avoiding overdrafts
      atm: 9,          // 3 out-of-network uses
      other: 25        // Wire transfers, cashier checks, etc.
    },
    optimizedFees: {
      checking: 0,     // Joint account with fee waiver
      overdraft: 0,    // Already good
      atm: 0,          // Better bank network
      other: 10        // Reduced but some unavoidable
    },
    userProfile: 'Family that can leverage relationship banking benefits'
  }
];

const feeStrategies = [
  {
    id: 'switch-online',
    name: 'Switch to Online Bank',
    description: 'Move to high-yield online bank with no fees',
    effectiveness: 0.9,
    difficulty: 'Easy'
  },
  {
    id: 'credit-union',
    name: 'Join Credit Union',
    description: 'Lower fees, better rates, personal service',
    effectiveness: 0.8,
    difficulty: 'Easy'
  },
  {
    id: 'optimize-current',
    name: 'Optimize Current Bank',
    description: 'Meet minimums, use automation, avoid fees',
    effectiveness: 0.6,
    difficulty: 'Medium'
  },
  {
    id: 'multiple-banks',
    name: 'Banking Trifecta',
    description: 'Local checking + online savings + investment account',
    effectiveness: 0.95,
    difficulty: 'Advanced'
  }
];

export default function FeeImpactGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    round: 0,
    timeLeft: 30,
    isPlaying: false,
    currentScenario: null,
    selectedStrategy: null,
    feedback: null
  });

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.isPlaying && gameState.timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  const startGame = () => {
    setGameState({
      score: 0,
      round: 1,
      timeLeft: 30,
      isPlaying: true,
      currentScenario: feeScenarios[0],
      selectedStrategy: null,
      feedback: null
    });
    setAnimationKey(prev => prev + 1);
  };

  const nextRound = () => {
    const nextRoundNumber = gameState.round + 1;
    if (nextRoundNumber <= feeScenarios.length) {
      setGameState(prev => ({
        ...prev,
        round: nextRoundNumber,
        timeLeft: 30,
        currentScenario: feeScenarios[nextRoundNumber - 1],
        selectedStrategy: null,
        feedback: null
      }));
      setAnimationKey(prev => prev + 1);
    } else {
      endGame();
    }
  };

  const handleTimeUp = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      feedback: '⏰ Time\'s up! You missed this opportunity to save money.'
    }));
  };

  const handleStrategySelect = (strategyId: string) => {
    if (!gameState.currentScenario) return;

    const strategy = feeStrategies.find(s => s.id === strategyId);
    if (!strategy) return;

    const scenario = gameState.currentScenario;
    const currentMonthlyFees = Object.values(scenario.currentFees).reduce((a, b) => a + b, 0);
    const optimizedMonthlyFees = Object.values(scenario.optimizedFees).reduce((a, b) => a + b, 0);
    const maxPossibleSavings = currentMonthlyFees - optimizedMonthlyFees;
    
    const actualSavings = maxPossibleSavings * strategy.effectiveness;
    const annualSavings = actualSavings * 12;
    const twentyYearSavings = annualSavings * 20;

    const points = Math.round(strategy.effectiveness * 100);
    
    setGameState(prev => ({
      ...prev,
      selectedStrategy: strategyId,
      score: prev.score + points,
      isPlaying: false,
      feedback: `Great choice! You'll save $${actualSavings.toFixed(0)}/month, $${annualSavings.toFixed(0)}/year, or $${twentyYearSavings.toFixed(0)} over 20 years!`
    }));
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      currentScenario: null
    }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      round: 0,
      timeLeft: 30,
      isPlaying: false,
      currentScenario: null,
      selectedStrategy: null,
      feedback: null
    });
  };

  const calculateTotalSavings = () => {
    if (!gameState.currentScenario) return { monthly: 0, annual: 0, twentyYear: 0 };
    
    const currentMonthlyFees = Object.values(gameState.currentScenario.currentFees).reduce((a, b) => a + b, 0);
    const optimizedMonthlyFees = Object.values(gameState.currentScenario.optimizedFees).reduce((a, b) => a + b, 0);
    const monthly = currentMonthlyFees - optimizedMonthlyFees;
    
    return {
      monthly,
      annual: monthly * 12,
      twentyYear: monthly * 12 * 20
    };
  };

  const scenario = gameState.currentScenario;
  const savings = calculateTotalSavings();

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} flex items-center gap-2`}>
            <Zap className="w-6 h-6 text-yellow-400" />
            Fee Fighting Challenge
          </h3>
          <p className={`${theme.textColors.secondary}`}>
            Help people escape banking fees and build wealth!
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {gameState.isPlaying && (
            <div className={`flex items-center gap-2 px-4 py-2 ${theme.status.warning.bg} rounded-lg`}>
              <Timer className={`w-4 h-4 ${theme.status.warning.text}`} />
              <span className={`font-bold ${theme.status.warning.text}`}>
                {gameState.timeLeft}s
              </span>
            </div>
          )}
          
          <div className={`flex items-center gap-2 px-4 py-2 ${theme.status.info.bg} rounded-lg`}>
            <Trophy className={`w-4 h-4 ${theme.status.info.text}`} />
            <span className={`font-bold ${theme.status.info.text}`}>
              Score: {gameState.score}
            </span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <AnimatePresence mode="wait">
        {!gameState.isPlaying && !scenario && (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className={`w-24 h-24 ${theme.status.info.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Play className={`w-12 h-12 ${theme.status.info.text}`} />
            </div>
            
            <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
              Ready to Save Money?
            </h4>
            
            <p className={`${theme.textColors.secondary} mb-8 max-w-2xl mx-auto`}>
              You&apos;ll see real people with real banking problems. Choose the best strategy to help them escape fees 
              and build wealth. You have 30 seconds per scenario!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`p-4 ${theme.backgrounds.cardHover} rounded-lg`}>
                <DollarSign className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2`} />
                <h5 className={`font-bold ${theme.textColors.primary} mb-1`}>Real Scenarios</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>Based on actual banking situations</p>
              </div>
              
              <div className={`p-4 ${theme.backgrounds.cardHover} rounded-lg`}>
                <Target className={`w-8 h-8 ${theme.status.warning.text} mx-auto mb-2`} />
                <h5 className={`font-bold ${theme.textColors.primary} mb-1`}>Quick Decisions</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>30 seconds to choose best strategy</p>
              </div>
              
              <div className={`p-4 ${theme.backgrounds.cardHover} rounded-lg`}>
                <TrendingUp className={`w-8 h-8 ${theme.status.info.text} mx-auto mb-2`} />
                <h5 className={`font-bold ${theme.textColors.primary} mb-1`}>Big Impact</h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>See 20-year wealth building potential</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className={`px-8 py-4 ${theme.buttons.primary} rounded-xl font-bold text-lg transition-all shadow-lg hover-lift`}
            >
              Start Fee Fighting Challenge
            </button>
          </motion.div>
        )}

        {gameState.isPlaying && scenario && (
          <motion.div
            key={`scenario-${animationKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Round Info */}
            <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
              <div className="flex items-center justify-between">
                <h4 className={`text-lg font-bold ${theme.status.info.text}`}>
                  Round {gameState.round} of {feeScenarios.length}: {scenario.name}
                </h4>
                <div className={`px-3 py-1 ${theme.backgrounds.card} rounded-full`}>
                  <span className={`text-sm font-bold ${theme.textColors.primary}`}>
                    Income: ${scenario.monthlyIncome.toLocaleString()}/month
                  </span>
                </div>
              </div>
              <p className={`${theme.status.info.text} mt-2`}>{scenario.description}</p>
              <p className={`${theme.textColors.secondary} mt-1 text-sm italic`}>{scenario.userProfile}</p>
            </div>

            {/* Current Fee Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 ${theme.status.error.bg} border-l-4 ${theme.status.error.border} rounded-lg`}>
                <h5 className={`font-bold ${theme.status.error.text} mb-3 flex items-center gap-2`}>
                  <TrendingDown className="w-5 h-5" />
                  Current Monthly Fees
                </h5>
                <div className="space-y-2">
                  {Object.entries(scenario.currentFees).map(([type, amount]) => (
                    <div key={type} className="flex justify-between">
                      <span className={`${theme.textColors.secondary} capitalize`}>{type}:</span>
                      <span className={`font-bold ${theme.status.error.text}`}>${amount}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className={`font-bold ${theme.textColors.primary}`}>Total:</span>
                      <span className={`font-bold text-lg ${theme.status.error.text}`}>
                        ${Object.values(scenario.currentFees).reduce((a, b) => a + b, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
                <h5 className={`font-bold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
                  <TrendingUp className="w-5 h-5" />
                  Potential Savings
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`${theme.textColors.secondary}`}>Monthly:</span>
                    <span className={`font-bold ${theme.status.success.text}`}>${savings.monthly}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme.textColors.secondary}`}>Annual:</span>
                    <span className={`font-bold ${theme.status.success.text}`}>${savings.annual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className={`font-bold ${theme.textColors.primary}`}>20-Year Impact:</span>
                    <span className={`font-bold text-lg ${theme.status.success.text}`}>
                      ${savings.twentyYear.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Selection */}
            <div>
              <h5 className={`font-bold ${theme.textColors.primary} mb-4`}>
                Choose the BEST strategy to help {scenario.name.split(' - ')[1]} save money:
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feeStrategies.map((strategy) => (
                  <motion.button
                    key={strategy.id}
                    onClick={() => handleStrategySelect(strategy.id)}
                    aria-label={`Select ${strategy.name} strategy`}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${theme.borderColors.muted} hover:${theme.borderColors.primary} hover:${theme.status.info.bg}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h6 className={`font-bold ${theme.textColors.primary}`}>{strategy.name}</h6>
                      <span className={`text-xs px-2 py-1 ${theme.status.info.bg} ${theme.status.info.text} rounded-full`}>
                        {strategy.difficulty}
                      </span>
                    </div>
                    <p className={`text-sm ${theme.textColors.secondary} mb-3`}>{strategy.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${theme.textColors.muted}`}>Effectiveness:</span>
                      <div className={`flex items-center gap-1`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < strategy.effectiveness * 5 ? theme.status.success.bg : theme.borderColors.muted
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!gameState.isPlaying && scenario && gameState.feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Feedback */}
            <div className={`p-6 ${gameState.selectedStrategy ? theme.status.success.bg : theme.status.warning.bg} border-l-4 ${gameState.selectedStrategy ? theme.status.success.border : theme.status.warning.border} rounded-lg text-center`}>
              <h4 className={`text-xl font-bold ${gameState.selectedStrategy ? theme.status.success.text : theme.status.warning.text} mb-2`}>
                {gameState.selectedStrategy ? '🎉 Excellent Choice!' : '⏰ Time\'s Up!'}
              </h4>
              <p className={`${gameState.selectedStrategy ? theme.status.success.text : theme.status.warning.text}`}>
                {gameState.feedback}
              </p>
            </div>

            {/* Continue/End Game */}
            <div className="text-center">
              {gameState.round < feeScenarios.length ? (
                <button
                  onClick={nextRound}
                  className={`px-8 py-3 ${theme.buttons.primary} rounded-xl font-bold transition-all shadow-lg hover-lift mr-4`}
                >
                  Next Challenge
                </button>
              ) : (
                <div className="space-y-4">
                  <div className={`p-6 ${theme.status.info.bg} rounded-lg`}>
                    <h4 className={`text-xl font-bold ${theme.status.info.text} mb-2`}>
                      Challenge Complete!
                    </h4>
                    <p className={`${theme.status.info.text} mb-2`}>
                      Final Score: {gameState.score} / {feeStrategies.length * 100}
                    </p>
                    <p className={`${theme.textColors.secondary}`}>
                      You helped save thousands of dollars in banking fees!
                    </p>
                  </div>
                  
                  <button
                    onClick={resetGame}
                    className={`px-8 py-3 ${theme.buttons.secondary} rounded-xl font-bold transition-all shadow-lg hover-lift`}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

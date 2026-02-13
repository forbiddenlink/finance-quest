'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import { 
  Gamepad2, 
  Timer, 
  Trophy, 
  Target, 
  RefreshCw,
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ExpenseScenario {
  id: string;
  category: string;
  description: string;
  currentAmount: number;
  suggestions: {
    id: string;
    strategy: string;
    savings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    impact: 'low' | 'medium' | 'high';
    explanation: string;
  }[];
  icon: string;
}

interface GameState {
  currentScenario: number;
  timeRemaining: number;
  score: number;
  selectedSavings: number;
  streak: number;
  gameStarted: boolean;
  gameCompleted: boolean;
}

const expenseScenarios: ExpenseScenario[] = [
  {
    id: 'groceries',
    category: 'Groceries',
    description: 'Family of 4 spending $800/month on groceries and dining',
    currentAmount: 800,
    icon: '🛒',
    suggestions: [
      {
        id: 'meal_prep',
        strategy: 'Meal prep and bulk cooking',
        savings: 150,
        difficulty: 'medium',
        impact: 'high',
        explanation: 'Meal prepping reduces food waste by 40% and eliminates impulse dining. Average family saves $150/month.'
      },
      {
        id: 'store_brands',
        strategy: 'Switch to store brands for basics',
        savings: 80,
        difficulty: 'easy',
        impact: 'medium',
        explanation: 'Store brands cost 25-30% less than name brands with identical quality for most basic items.'
      },
      {
        id: 'coupons_apps',
        strategy: 'Use coupon apps and cashback programs',
        savings: 40,
        difficulty: 'easy',
        impact: 'low',
        explanation: 'Apps like Ibotta, Rakuten, and manufacturer coupons can save 5-10% on regular purchases.'
      },
      {
        id: 'grow_herbs',
        strategy: 'Grow your own herbs and vegetables',
        savings: 25,
        difficulty: 'hard',
        impact: 'low',
        explanation: 'Home gardens require time and setup but can save on expensive fresh herbs and organic vegetables.'
      }
    ]
  },
  {
    id: 'utilities',
    category: 'Utilities',
    description: 'High electric bill of $180/month in 2-bedroom apartment',
    currentAmount: 180,
    icon: '⚡',
    suggestions: [
      {
        id: 'smart_thermostat',
        strategy: 'Install smart thermostat',
        savings: 45,
        difficulty: 'medium',
        impact: 'high',
        explanation: 'Smart thermostats automatically optimize heating/cooling, saving 15-23% on energy bills.'
      },
      {
        id: 'led_bulbs',
        strategy: 'Replace all bulbs with LEDs',
        savings: 15,
        difficulty: 'easy',
        impact: 'medium',
        explanation: 'LED bulbs use 75% less energy and last 25x longer than incandescent bulbs.'
      },
      {
        id: 'unplug_devices',
        strategy: 'Unplug devices when not in use',
        savings: 20,
        difficulty: 'easy',
        impact: 'medium',
        explanation: 'Phantom power draw from electronics accounts for 5-10% of home energy use.'
      },
      {
        id: 'energy_audit',
        strategy: 'Professional energy audit and sealing',
        savings: 60,
        difficulty: 'hard',
        impact: 'high',
        explanation: 'Air leaks and poor insulation can waste 20-30% of energy. Professional sealing provides major savings.'
      }
    ]
  },
  {
    id: 'subscriptions',
    category: 'Subscriptions',
    description: 'Multiple streaming and subscription services totaling $85/month',
    currentAmount: 85,
    icon: '📺',
    suggestions: [
      {
        id: 'audit_cancel',
        strategy: 'Audit and cancel unused subscriptions',
        savings: 35,
        difficulty: 'easy',
        impact: 'high',
        explanation: 'Average person has 3-4 forgotten subscriptions. Regular audits eliminate wasteful spending.'
      },
      {
        id: 'family_sharing',
        strategy: 'Share family plans with relatives',
        savings: 25,
        difficulty: 'easy',
        impact: 'medium',
        explanation: 'Netflix, Spotify, and other services offer family plans that cost less per person when shared.'
      },
      {
        id: 'rotate_services',
        strategy: 'Rotate seasonal subscriptions',
        savings: 40,
        difficulty: 'medium',
        impact: 'high',
        explanation: 'Subscribe to one streaming service at a time, cancel when you finish content, rotate seasonally.'
      },
      {
        id: 'free_alternatives',
        strategy: 'Use free alternatives (library, YouTube)',
        savings: 50,
        difficulty: 'medium',
        impact: 'high',
        explanation: 'Libraries offer free streaming, YouTube has endless content, and free alternatives exist for most paid services.'
      }
    ]
  },
  {
    id: 'transportation',
    category: 'Transportation',
    description: 'Car payment, insurance, and gas totaling $650/month',
    currentAmount: 650,
    icon: '🚗',
    suggestions: [
      {
        id: 'refinance_auto',
        strategy: 'Refinance auto loan at lower rate',
        savings: 75,
        difficulty: 'medium',
        impact: 'high',
        explanation: 'Auto refinancing can reduce monthly payments by 10-20% if you qualify for better rates.'
      },
      {
        id: 'carpool_transit',
        strategy: 'Carpool or use public transit 2 days/week',
        savings: 120,
        difficulty: 'medium',
        impact: 'high',
        explanation: 'Reducing driving by 40% saves on gas, maintenance, and wear. Many employers offer transit benefits.'
      },
      {
        id: 'shop_insurance',
        strategy: 'Shop around for car insurance',
        savings: 50,
        difficulty: 'easy',
        impact: 'medium',
        explanation: 'Car insurance rates vary wildly between companies. Shopping annually can save 15-25%.'
      },
      {
        id: 'sell_downsize',
        strategy: 'Sell car and downsize to reliable used car',
        savings: 300,
        difficulty: 'hard',
        impact: 'high',
        explanation: 'Downsizing from luxury/new car to reliable used car can save $200-400/month in payments and insurance.'
      }
    ]
  },
  {
    id: 'phone_internet',
    category: 'Phone & Internet',
    description: 'Cell phones and internet costing $140/month for family',
    currentAmount: 140,
    icon: '📱',
    suggestions: [
      {
        id: 'switch_carrier',
        strategy: 'Switch to budget carrier (Mint, Visible)',
        savings: 60,
        difficulty: 'easy',
        impact: 'high',
        explanation: 'Budget carriers use the same towers as major carriers but cost 50-70% less.'
      },
      {
        id: 'bundle_negotiate',
        strategy: 'Negotiate with current provider or bundle',
        savings: 30,
        difficulty: 'easy',
        impact: 'medium',
        explanation: 'Threatening to cancel often triggers retention offers. Bundling sometimes reduces total cost.'
      },
      {
        id: 'reduce_data',
        strategy: 'Reduce data plans and use WiFi more',
        savings: 25,
        difficulty: 'easy',
        impact: 'medium',
        explanation: 'Most people use far less data than they pay for. Unlimited plans are often unnecessary.'
      },
      {
        id: 'family_mvno',
        strategy: 'Switch entire family to MVNO carrier',
        savings: 80,
        difficulty: 'medium',
        impact: 'high',
        explanation: 'MVNO carriers (Mobile Virtual Network Operators) offer family plans at fraction of major carrier costs.'
      }
    ]
  }
];

const GAME_DURATION = 45; // seconds per scenario

export default function ExpenseOptimizationGame() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [gameState, setGameState] = useState<GameState>({
    currentScenario: 0,
    timeRemaining: GAME_DURATION,
    score: 0,
    selectedSavings: 0,
    streak: 0,
    gameStarted: false,
    gameCompleted: false
  });

  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Record calculator usage on mount
  useEffect(() => {
    recordCalculatorUsage('expense-optimization-game');
  }, [recordCalculatorUsage]);

  // Handle time up function
  const handleTimeUp = useCallback(() => {
    if (selectedStrategies.length > 0) {
      // Handle scenario submission logic here
      if (gameState.currentScenario < expenseScenarios.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentScenario: prev.currentScenario + 1,
          timeRemaining: GAME_DURATION,
          selectedSavings: 0,
          streak: 0
        }));
        setSelectedStrategies([]);
      } else {
        setGameState(prev => ({ ...prev, gameCompleted: true }));
        setShowResults(true);
      }
    } else {
      // Skip scenario if no strategies selected
      if (gameState.currentScenario < expenseScenarios.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentScenario: prev.currentScenario + 1,
          timeRemaining: GAME_DURATION,
          selectedSavings: 0,
          streak: 0
        }));
        setSelectedStrategies([]);
        toast.error('Time up! Moving to next scenario.', {
          duration: 2000,
          position: 'top-center',
        });
      } else {
        setGameState(prev => ({ ...prev, gameCompleted: true }));
        setShowResults(true);
      }
    }
  }, [selectedStrategies, gameState.currentScenario]);

  // Timer effect
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameCompleted && gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeRemaining === 0) {
      handleTimeUp();
    }
  }, [gameState.gameStarted, gameState.gameCompleted, gameState.timeRemaining, handleTimeUp]);

  const startGame = () => {
    setGameState({
      currentScenario: 0,
      timeRemaining: GAME_DURATION,
      score: 0,
      selectedSavings: 0,
      streak: 0,
      gameStarted: true,
      gameCompleted: false
    });
    setSelectedStrategies([]);
    setShowResults(false);
  };

  const handleStrategySelect = (suggestion: ExpenseScenario['suggestions'][0]) => {
    const isSelected = selectedStrategies.includes(suggestion.id);
    
    if (isSelected) {
      setSelectedStrategies(prev => prev.filter(id => id !== suggestion.id));
      setGameState(prev => ({ ...prev, selectedSavings: prev.selectedSavings - suggestion.savings }));
    } else {
      setSelectedStrategies(prev => [...prev, suggestion.id]);
      setGameState(prev => ({ ...prev, selectedSavings: prev.selectedSavings + suggestion.savings }));
    }
  };

  const submitScenario = () => {
    const scenario = expenseScenarios[gameState.currentScenario];
    const maxPossibleSavings = Math.max(...scenario.suggestions.map(s => s.savings));
    const scoreMultiplier = gameState.timeRemaining > 20 ? 2 : gameState.timeRemaining > 10 ? 1.5 : 1;
    const bonusPoints = gameState.selectedSavings >= maxPossibleSavings * 0.8 ? 50 : 0;
    const scenarioScore = Math.round((gameState.selectedSavings + bonusPoints) * scoreMultiplier);

    const newStreak = gameState.selectedSavings >= maxPossibleSavings * 0.6 ? gameState.streak + 1 : 0;

    setGameState(prev => ({
      ...prev,
      score: prev.score + scenarioScore,
      streak: newStreak
    }));

    // Move to next scenario or end game
    if (gameState.currentScenario < expenseScenarios.length - 1) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentScenario: prev.currentScenario + 1,
          timeRemaining: GAME_DURATION,
          selectedSavings: 0
        }));
        setSelectedStrategies([]);
      }, 1000);
      
      toast.success(`Scenario completed! +${scenarioScore} points`, {
        duration: 2000,
        position: 'top-center',
      });
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, gameCompleted: true }));
    setShowResults(true);
    
    toast.success(`Game completed! Final score: ${gameState.score}`, {
      duration: 3000,
      position: 'top-center',
    });
  };

  const getPerformanceRating = () => {
    if (gameState.score >= 1500) return { rating: 'Expert', color: 'text-emerald-400', icon: Trophy };
    if (gameState.score >= 1000) return { rating: 'Advanced', color: 'text-blue-400', icon: Star };
    if (gameState.score >= 600) return { rating: 'Intermediate', color: 'text-yellow-400', icon: Target };
    return { rating: 'Beginner', color: 'text-gray-400', icon: AlertTriangle };
  };

  const currentScenario = expenseScenarios[gameState.currentScenario];
  const progress = ((gameState.currentScenario + 1) / expenseScenarios.length) * 100;

  if (!gameState.gameStarted) {
    return (
      <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4`}>
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>
            Expense Optimization Challenge
          </h3>
          <p className={`${theme.textColors.secondary} mb-6 max-w-2xl mx-auto`}>
            Test your money-saving skills! You&apos;ll see 5 real expense scenarios. Pick the best optimization strategies 
            before time runs out. Speed and smart choices earn bonus points!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
            <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
              <Timer className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className={`font-bold ${theme.textColors.primary}`}>45 Seconds</div>
              <div className={`text-sm ${theme.textColors.muted}`}>Per scenario</div>
            </div>
            <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
              <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className={`font-bold ${theme.textColors.primary}`}>5 Scenarios</div>
              <div className={`text-sm ${theme.textColors.muted}`}>Real situations</div>
            </div>
            <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className={`font-bold ${theme.textColors.primary}`}>Bonus Points</div>
              <div className={`text-sm ${theme.textColors.muted}`}>For speed & accuracy</div>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className={`px-8 py-4 ${theme.buttons.primary} rounded-lg font-bold text-lg transition-all hover:scale-105`}
          >
            Start Challenge
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const performance = getPerformanceRating();
    const PerformanceIcon = performance.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}
      >
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4`}>
            <PerformanceIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            Challenge Complete!
          </h3>
          <div className={`text-3xl font-bold ${performance.color} mb-2`}>
            {gameState.score} Points
          </div>
          <div className={`text-lg ${performance.color} mb-4`}>
            {performance.rating} Level
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg text-center`}>
            <div className={`text-2xl font-bold ${theme.textColors.primary}`}>{gameState.score}</div>
            <div className={`text-sm ${theme.textColors.muted}`}>Total Score</div>
          </div>
          <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg text-center`}>
            <div className={`text-2xl font-bold ${theme.textColors.primary}`}>{gameState.streak}</div>
            <div className={`text-sm ${theme.textColors.muted}`}>Best Streak</div>
          </div>
          <div className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg text-center`}>
            <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
              ${expenseScenarios.reduce((sum, scenario) => sum + Math.max(...scenario.suggestions.map(s => s.savings)), 0)}
            </div>
            <div className={`text-sm ${theme.textColors.muted}`}>Max Monthly Savings</div>
          </div>
        </div>

        {/* Key Insights */}
        <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg mb-6`}>
          <h4 className={`font-bold ${theme.status.info.text} mb-3`}>Key Money-Saving Insights</h4>
          <ul className="space-y-2">
            <li className={`flex items-start gap-2 ${theme.textColors.secondary}`}>
              <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mt-0.5 flex-shrink-0`} />
              <span>Quick wins like switching carriers or canceling subscriptions provide immediate relief</span>
            </li>
            <li className={`flex items-start gap-2 ${theme.textColors.secondary}`}>
              <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mt-0.5 flex-shrink-0`} />
              <span>Medium-effort strategies like meal prep provide the biggest long-term savings</span>
            </li>
            <li className={`flex items-start gap-2 ${theme.textColors.secondary}`}>
              <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mt-0.5 flex-shrink-0`} />
              <span>Annual expense audits and negotiations prevent lifestyle inflation</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={startGame}
            className={`px-6 py-3 ${theme.buttons.ghost} rounded-lg mr-4 transition-all`}
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Play Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      {/* Game Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentScenario.icon}</span>
            <div>
              <h3 className={`text-lg font-bold ${theme.textColors.primary}`}>
                {currentScenario.category}
              </h3>
              <p className={`text-sm ${theme.textColors.muted}`}>
                Scenario {gameState.currentScenario + 1} of {expenseScenarios.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${gameState.timeRemaining <= 10 ? 'text-red-400' : theme.textColors.primary}`}>
                {gameState.timeRemaining}s
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Time Left</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                {gameState.score}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>Score</div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className={`w-full bg-slate-700 rounded-full h-2 mb-4`}>
          <motion.div
            className="h-2 bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Timer bar */}
        <div className={`w-full bg-slate-700 rounded-full h-1`}>
          <motion.div
            className={`h-1 rounded-full ${gameState.timeRemaining <= 10 ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${(gameState.timeRemaining / GAME_DURATION) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Scenario Description */}
      <div className={`mb-6 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
        <p className={`${theme.textColors.primary} mb-2`}>
          <strong>Situation:</strong> {currentScenario.description}
        </p>
        <div className="flex items-center gap-2">
          <span className={`${theme.textColors.secondary}`}>Current monthly cost:</span>
          <span className={`text-xl font-bold text-red-400`}>
            ${currentScenario.currentAmount}
          </span>
        </div>
        {gameState.selectedSavings > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className={`${theme.textColors.secondary}`}>Potential savings:</span>
            <span className={`text-xl font-bold text-emerald-400`}>
              ${gameState.selectedSavings}/month
            </span>
          </div>
        )}
      </div>

      {/* Strategy Options */}
      <div className="mb-6">
        <h4 className={`font-bold ${theme.textColors.primary} mb-3`}>
          Choose your optimization strategies:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentScenario.suggestions.map((suggestion) => {
            const isSelected = selectedStrategies.includes(suggestion.id);
            return (
              <motion.button
                key={suggestion.id}
                onClick={() => handleStrategySelect(suggestion)}
                aria-label={`${isSelected ? 'Deselect' : 'Select'} strategy: ${suggestion.strategy}`}
                aria-pressed={isSelected}
                className={`p-4 text-left border-2 rounded-lg transition-all ${
                  isSelected
                    ? `${theme.borderColors.accent} bg-blue-500/20`
                    : `${theme.borderColors.primary} ${theme.backgrounds.glass} hover:${theme.borderColors.accent}`
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <div className={`w-5 h-5 border-2 ${theme.borderColors.primary} rounded-full flex-shrink-0`} />
                    )}
                    <span className={`font-medium ${theme.textColors.primary}`}>
                      {suggestion.strategy}
                    </span>
                  </div>
                  <div className={`text-right`}>
                    <div className={`font-bold text-emerald-400`}>
                      ${suggestion.savings}/mo
                    </div>
                    <div className={`text-xs ${theme.textColors.muted} capitalize`}>
                      {suggestion.difficulty} • {suggestion.impact} impact
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  {suggestion.explanation}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={submitScenario}
          disabled={selectedStrategies.length === 0}
          className={`px-8 py-3 ${
            selectedStrategies.length > 0 
              ? theme.buttons.primary 
              : `bg-slate-600 text-slate-400 cursor-not-allowed`
          } rounded-lg font-bold transition-all`}
        >
          {gameState.currentScenario < expenseScenarios.length - 1 ? 'Next Scenario' : 'Finish Challenge'}
        </button>
        {selectedStrategies.length === 0 && (
          <p className={`text-sm ${theme.textColors.muted} mt-2`}>
            Select at least one strategy to continue
          </p>
        )}
      </div>
    </div>
  );
}

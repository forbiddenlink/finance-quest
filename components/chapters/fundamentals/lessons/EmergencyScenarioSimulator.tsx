'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  AlertTriangle,
  Car,
  Heart,
  Home,
  Briefcase,
  DollarSign,
  CheckCircle,
  XCircle,
  RotateCcw,
  Zap,
  Target,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EmergencyScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cost: number;
  urgency: 'immediate' | 'moderate' | 'flexible';
  category: 'medical' | 'automotive' | 'home' | 'employment' | 'family';
  consequences: {
    withFund: string[];
    withoutFund: string[];
  };
  learningPoint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const emergencyScenarios: EmergencyScenario[] = [
  {
    id: 'car_repair',
    title: 'Major Car Repair',
    description: 'Your car\'s transmission failed and needs a $1,800 repair. You need your car to get to work.',
    icon: Car,
    cost: 1800,
    urgency: 'immediate',
    category: 'automotive',
    difficulty: 'easy',
    consequences: {
      withFund: [
        'Pay $1,800 from emergency fund immediately',
        'Car is fixed in 2 days, back to normal routine',
        'Start replenishing emergency fund next month',
        'No debt, no stress, no financial impact beyond the repair cost'
      ],
      withoutFund: [
        'Put $1,800 on credit card at 22% APR',
        'If minimum payments only: $200+ in interest, 18+ months to pay off',
        'Total cost becomes $2,000+ instead of $1,800',
        'Financial stress affects work performance and family life'
      ]
    },
    learningPoint: 'A $1,000 starter emergency fund would have prevented $200+ in interest charges and 18 months of debt stress.'
  },
  {
    id: 'medical_emergency',
    title: 'Emergency Room Visit',
    description: 'You have a severe allergic reaction and need emergency medical care. After insurance, you owe $2,500.',
    icon: Heart,
    cost: 2500,
    urgency: 'immediate',
    category: 'medical',
    difficulty: 'medium',
    consequences: {
      withFund: [
        'Pay medical bills immediately from emergency fund',
        'Focus on recovery instead of financial worry',
        'Negotiate cash discount (10-20% off) for immediate payment',
        'No impact on credit score or financial relationships'
      ],
      withoutFund: [
        'Set up payment plan with hospital (often with fees)',
        'Risk collections if unable to maintain payments',
        'Potential damage to credit score affecting future rates',
        'Added stress during recovery period when health should be priority'
      ]
    },
    learningPoint: 'Medical emergencies are both physically and financially stressful. Emergency funds allow you to focus on health, not money.'
  },
  {
    id: 'job_loss',
    title: 'Sudden Job Loss',
    description: 'Your company downsizes and you lose your job unexpectedly. Your monthly expenses are $3,200.',
    icon: Briefcase,
    cost: 9600, // 3 months of expenses
    urgency: 'moderate',
    category: 'employment',
    difficulty: 'hard',
    consequences: {
      withFund: [
        'Cover 3-6 months of expenses while job searching',
        'Take time to find the RIGHT job, not just ANY job',
        'Negotiate better salary/benefits from position of strength',
        'Maintain lifestyle and family stability during transition'
      ],
      withoutFund: [
        'Immediate financial panic and desperate job search',
        'Accept first job offer, likely at lower pay/poor conditions',
        'Risk losing home, car, or other essential assets',
        'Family stress, potential relationship strain, depression'
      ]
    },
    learningPoint: 'Job loss is traumatic enough without financial panic. Emergency funds provide time and options for better outcomes.'
  },
  {
    id: 'home_repair',
    title: 'Major Home Repair',
    description: 'A pipe bursts in your wall causing $4,000 in water damage that insurance won\'t fully cover.',
    icon: Home,
    cost: 4000,
    urgency: 'immediate',
    category: 'home',
    difficulty: 'medium',
    consequences: {
      withFund: [
        'Hire emergency restoration crew immediately',
        'Prevent mold and additional damage with quick action',
        'Choose quality contractors instead of cheapest options',
        'Maintain home value and family safety'
      ],
      withoutFund: [
        'Delay repairs leading to mold, structural damage',
        'Take on high-interest debt or expensive home equity loan',
        'Use cheapest contractors potentially causing more problems',
        'Home value drops, family health at risk from mold'
      ]
    },
    learningPoint: 'Home emergencies compound quickly. Delayed repairs often cost 2-3x more than immediate professional fixes.'
  },
  {
    id: 'family_emergency',
    title: 'Family Crisis Travel',
    description: 'Your parent has a heart attack in another state. You need to fly there immediately and may need to stay for weeks.',
    icon: Heart,
    cost: 3500,
    urgency: 'immediate',
    category: 'family',
    difficulty: 'hard',
    consequences: {
      withFund: [
        'Book immediate flights without worrying about cost',
        'Take unpaid leave to be with family without financial stress',
        'Focus on family support and medical decisions',
        'Return when ready, not when money runs out'
      ],
      withoutFund: [
        'Stress about travel costs while dealing with family crisis',
        'Choose cheaper flights with delays during urgent situation',
        'Return early due to financial pressure, not family needs',
        'Guilt and regret about not being there when needed'
      ]
    },
    learningPoint: 'Family emergencies are unpredictable and emotionally taxing. Money stress during these times creates lasting regret.'
  }
];

interface SimulationResult {
  scenarioId: string;
  hasFund: boolean;
  fundAmount: number;
  outcome: 'success' | 'partial' | 'failure';
  score: number;
}

interface EmergencyScenarioSimulatorProps {
  onComplete?: (results: SimulationResult[]) => void;
}

export default function EmergencyScenarioSimulator({ onComplete }: EmergencyScenarioSimulatorProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [emergencyFund, setEmergencyFund] = useState(5000); // Starting fund amount
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const scenario = emergencyScenarios[currentScenario];

  const handleDecision = (useFund: boolean) => {
    const result: SimulationResult = {
      scenarioId: scenario.id,
      hasFund: emergencyFund >= scenario.cost,
      fundAmount: emergencyFund,
      outcome: useFund && emergencyFund >= scenario.cost ? 'success' : 
               useFund && emergencyFund < scenario.cost ? 'partial' : 'failure',
      score: useFund && emergencyFund >= scenario.cost ? 100 : 
             useFund && emergencyFund < scenario.cost ? 50 : 0
    };

    // Update emergency fund if they used it
    if (useFund && emergencyFund >= scenario.cost) {
      setEmergencyFund(emergencyFund - scenario.cost);
    }

    const newResults = [...results, result];
    setResults(newResults);
    setTotalScore(totalScore + result.score);
    setShowResult(true);

    // Show result feedback
    if (result.outcome === 'success') {
      toast.success(`Great decision! Emergency fund protected you from debt and stress.`, {
        duration: 3000,
        position: 'top-center',
      });
    } else if (result.outcome === 'partial') {
      toast.error(`Fund insufficient! You'd need additional financing for this emergency.`, {
        duration: 3000,
        position: 'top-center',
      });
    } else {
      toast.error(`Without an emergency fund, this situation creates long-term financial damage.`, {
        duration: 3000,
        position: 'top-center',
      });
    }

    // Auto advance after showing result
    setTimeout(() => {
      if (currentScenario < emergencyScenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setShowResult(false);
      } else {
        setGameComplete(true);
        recordCalculatorUsage('emergency-scenario-simulator');
        if (onComplete) {
          onComplete(newResults);
        }
      }
    }, 4000);
  };

  const resetGame = () => {
    setCurrentScenario(0);
    setEmergencyFund(5000);
    setResults([]);
    setShowResult(false);
    setGameComplete(false);
    setTotalScore(0);
  };

  const getFundStatus = () => {
    if (emergencyFund >= 10000) return { status: 'excellent', color: 'text-green-400', message: 'Strong Protection' };
    if (emergencyFund >= 5000) return { status: 'good', color: 'text-blue-400', message: 'Moderate Protection' };
    if (emergencyFund >= 1000) return { status: 'basic', color: 'text-yellow-400', message: 'Basic Protection' };
    return { status: 'low', color: 'text-red-400', message: 'Vulnerable' };
  };

  const fundStatus = getFundStatus();

  // Game complete screen
  if (gameComplete) {
    const averageScore = totalScore / emergencyScenarios.length;
    const successfulScenarios = results.filter(r => r.outcome === 'success').length;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-8 max-w-4xl mx-auto`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-20 h-20 mx-auto mb-4 ${averageScore >= 80 ? theme.status.success.bg : averageScore >= 60 ? theme.status.warning.bg : theme.status.error.bg} rounded-full flex items-center justify-center`}
          >
            {averageScore >= 80 ? 
              <CheckCircle className={`w-10 h-10 ${theme.status.success.text}`} /> :
              <AlertTriangle className={`w-10 h-10 ${averageScore >= 60 ? theme.status.warning.text : theme.status.error.text}`} />
            }
          </motion.div>
          
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
            Simulation Complete!
          </h2>
          <p className={`text-lg ${theme.textColors.secondary}`}>
            You handled {successfulScenarios} out of {emergencyScenarios.length} emergencies successfully
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}>
            <Target className={`w-8 h-8 text-blue-400 mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>{totalScore}</p>
            <p className={`${theme.textColors.secondary} text-sm`}>Total Score</p>
          </div>
          
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}>
            <Star className={`w-8 h-8 text-green-400 mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>{successfulScenarios}/{emergencyScenarios.length}</p>
            <p className={`${theme.textColors.secondary} text-sm`}>Successful Outcomes</p>
          </div>
          
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 text-center`}>
            <DollarSign className={`w-8 h-8 text-amber-400 mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>${emergencyFund.toLocaleString()}</p>
            <p className={`${theme.textColors.secondary} text-sm`}>Remaining Fund</p>
          </div>
        </div>

        {/* Key Insights */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}>
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Zap className="w-6 h-6" />
            Key Insights from Your Simulation
          </h3>
          <div className="space-y-3">
            {averageScore >= 80 && (
              <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                <p className={`${theme.textColors.secondary} font-medium`}>
                  <strong>Excellent emergency preparedness!</strong> Your fund size protected you from all major financial emergencies. 
                  You demonstrated how proper planning prevents debt cycles and financial stress.
                </p>
              </div>
            )}
            {averageScore >= 60 && averageScore < 80 && (
              <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
                <p className={`${theme.textColors.secondary} font-medium`}>
                  <strong>Good foundation, room for improvement.</strong> Your emergency fund helped in most situations, 
                  but larger emergencies exposed gaps. Consider building to 6-8 months of expenses.
                </p>
              </div>
            )}
            {averageScore < 60 && (
              <div className={`p-4 ${theme.status.error.bg} border ${theme.status.error.border} rounded-lg`}>
                <p className={`${theme.textColors.secondary} font-medium`}>
                  <strong>Emergency fund needs attention.</strong> Multiple scenarios would have created debt and long-term financial damage. 
                  Prioritize building at least a $1,000 starter fund immediately.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetGame}
            className={`flex items-center justify-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} transition-all`}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Different Scenarios
          </button>
          
          <button
            onClick={() => {
              toast.success('Great job! Use the Calculator tab to build your personalized emergency fund plan.', {
                duration: 4000,
                position: 'top-center',
              });
            }}
            className={`flex items-center justify-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all shadow-lg hover-lift`}
          >
            <Target className="w-5 h-5 mr-2" />
            Build My Emergency Fund
          </button>
        </div>
      </motion.div>
    );
  }

  // Scenario result display
  if (showResult) {
    const result = results[results.length - 1];
    const consequences = result.outcome === 'success' ? scenario.consequences.withFund : scenario.consequences.withoutFund;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-8 max-w-4xl mx-auto`}
      >
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 ${result.outcome === 'success' ? theme.status.success.bg : theme.status.error.bg} rounded-full flex items-center justify-center`}>
            {result.outcome === 'success' ? 
              <CheckCircle className={`w-8 h-8 ${theme.status.success.text}`} /> :
              <XCircle className={`w-8 h-8 ${theme.status.error.text}`} />
            }
          </div>
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            {result.outcome === 'success' ? 'Emergency Handled Successfully!' : 'Financial Stress Created'}
          </h3>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}>
          <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
            What Happens Next:
          </h4>
          <div className="space-y-3">
            {consequences.map((consequence, index) => (
              <div key={index} className="flex items-start">
                <div className={`flex-shrink-0 w-6 h-6 ${result.outcome === 'success' ? theme.status.success.bg : theme.status.error.bg} rounded-full flex items-center justify-center mt-1 mr-3`}>
                  <span className={`text-xs font-bold ${result.outcome === 'success' ? theme.status.success.text : theme.status.error.text}`}>
                    {index + 1}
                  </span>
                </div>
                <span className={`${theme.textColors.secondary} font-medium`}>{consequence}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg mb-6`}>
          <p className={`${theme.textColors.secondary} font-medium italic`}>
            💡 <strong>Learning Point:</strong> {scenario.learningPoint}
          </p>
        </div>

        <div className="text-center">
          <p className={`${theme.textColors.secondary}`}>
            Next scenario loading automatically...
          </p>
          <div className="mt-4">
            <div className={`w-32 h-2 mx-auto bg-slate-700 rounded-full overflow-hidden`}>
              <motion.div
                className={`h-full bg-blue-400 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Game interface
  const Icon = scenario.icon;
  const progress = ((currentScenario + 1) / emergencyScenarios.length) * 100;

  return (
    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-8 max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto mb-4 ${theme.status.error.bg} rounded-full flex items-center justify-center animate-float`}>
          <AlertTriangle className={`w-8 h-8 ${theme.status.error.text}`} />
        </div>
        <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
          Emergency Scenario Simulator
        </h2>
        <p className={`${theme.textColors.secondary}`}>
          Experience different financial emergencies and see how emergency funds protect you
        </p>
      </div>

      {/* Progress and Fund Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>Progress</h3>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${theme.textColors.secondary}`}>Scenario {currentScenario + 1} of {emergencyScenarios.length}</span>
            <span className={`text-sm text-blue-400 font-medium`}>{Math.round(progress)}%</span>
          </div>
          <div className={`w-full bg-slate-700 rounded-full h-2`}>
            <motion.div
              className={`h-2 bg-blue-400 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>Emergency Fund</h3>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${fundStatus.color}`}>
              ${emergencyFund.toLocaleString()}
            </span>
            <span className={`text-sm ${fundStatus.color} font-medium`}>
              {fundStatus.message}
            </span>
          </div>
        </div>
      </div>

      {/* Scenario */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-8`}>
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 ${theme.status.error.bg} rounded-lg flex items-center justify-center mr-4`}>
                <Icon className={`w-6 h-6 ${theme.status.error.text}`} />
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>{scenario.title}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-sm px-2 py-1 ${theme.status.error.bg} ${theme.status.error.text} rounded-full font-medium`}>
                    ${scenario.cost.toLocaleString()}
                  </span>
                  <span className={`text-sm px-2 py-1 ${scenario.urgency === 'immediate' ? theme.status.error.bg : theme.status.warning.bg} ${scenario.urgency === 'immediate' ? theme.status.error.text : theme.status.warning.text} rounded-full font-medium capitalize`}>
                    {scenario.urgency}
                  </span>
                </div>
              </div>
            </div>
            
            <p className={`text-lg ${theme.textColors.secondary} font-medium`}>
              {scenario.description}
            </p>
          </div>

          {/* Decision Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleDecision(true)}
              disabled={emergencyFund < scenario.cost}
              className={`p-6 rounded-lg border-2 transition-all ${
                emergencyFund >= scenario.cost
                  ? `${theme.status.success.bg} ${theme.status.success.border} hover:shadow-lg`
                  : `${theme.backgrounds.card} border-gray-600 opacity-50 cursor-not-allowed`
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className={`w-8 h-8 ${emergencyFund >= scenario.cost ? theme.status.success.text : 'text-gray-500'}`} />
              </div>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>
                Use Emergency Fund
              </h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                {emergencyFund >= scenario.cost 
                  ? `Pay $${scenario.cost.toLocaleString()} from emergency fund`
                  : `Insufficient funds (need $${(scenario.cost - emergencyFund).toLocaleString()} more)`
                }
              </p>
            </button>

            <button
              onClick={() => handleDecision(false)}
              className={`p-6 rounded-lg border-2 ${theme.status.error.bg} ${theme.status.error.border} hover:shadow-lg transition-all`}
            >
              <div className="flex items-center justify-center mb-3">
                <XCircle className={`w-8 h-8 ${theme.status.error.text}`} />
              </div>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>
                No Emergency Fund
              </h4>
              <p className={`${theme.textColors.secondary} text-sm`}>
                Use credit cards, loans, or borrow money
              </p>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

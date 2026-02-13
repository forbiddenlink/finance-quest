'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  MessageCircle,
  CheckCircle,
  XCircle,
  Star,
  AlertCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NegotiationScenario {
  id: string;
  title: string;
  description: string;
  currentSalary: number;
  targetIncrease: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  context: string;
}

interface DialogueOption {
  id: string;
  text: string;
  type: 'weak' | 'average' | 'strong';
  response: string;
  outcome: 'fail' | 'partial' | 'success';
  points: number;
  explanation: string;
}

interface ScenarioStep {
  situation: string;
  options: DialogueOption[];
}

const scenarios: NegotiationScenario[] = [
  {
    id: 'annual_review',
    title: 'Annual Performance Review',
    description: 'Your manager is conducting your yearly review. You\'ve exceeded all goals.',
    currentSalary: 65000,
    targetIncrease: 15,
    difficulty: 'Easy',
    context: 'You delivered a major project 2 months early and increased team efficiency by 23%.'
  },
  {
    id: 'promotion_opportunity',
    title: 'Promotion Negotiation',
    description: 'You\'re being considered for a team lead position with more responsibilities.',
    currentSalary: 75000,
    targetIncrease: 20,
    difficulty: 'Medium',
    context: 'The role requires managing 5 people and a $2M budget. Market rate is 15-25% higher.'
  },
  {
    id: 'competing_offer',
    title: 'Competing Job Offer',
    description: 'You have an offer from another company for 30% more. You prefer to stay.',
    currentSalary: 80000,
    targetIncrease: 25,
    difficulty: 'Hard',
    context: 'The other offer is legitimate but you love your current team and company culture.'
  }
];

const scenarioSteps: Record<string, ScenarioStep[]> = {
  annual_review: [
    {
      situation: "Your manager says: &apos;You&apos;ve had a great year. We&apos;re looking at a 3% merit increase.&apos;",
      options: [
        {
          id: 'accept_immediately',
          text: 'Thank you, that sounds fair.',
          type: 'weak',
          response: 'Great! We\'ll process the paperwork.',
          outcome: 'fail',
          points: 1,
          explanation: 'You accepted the first offer without negotiating. This leaves money on the table.'
        },
        {
          id: 'ask_for_more',
          text: 'I appreciate that. Based on my performance, I was hoping for something closer to 15%.',
          type: 'average',
          response: 'That&apos;s quite a jump. Let me see what I can do. How about 8%?',
          outcome: 'partial',
          points: 5,
          explanation: 'Good start! You made a counteroffer, but could be stronger with specific justification.'
        },
        {
          id: 'data_driven',
          text: 'I appreciate the feedback. Given that I delivered the Q3 project 2 months early and improved team efficiency by 23%, I\'d like to discuss a 15% increase to reflect my impact.',
          type: 'strong',
          response: 'Those are impressive results. Let me review the budget and get back to you.',
          outcome: 'success',
          points: 10,
          explanation: 'Excellent! You used specific achievements and quantified impact to justify your request.'
        }
      ]
    },
    {
      situation: "Your manager responds positively and asks: 'What specific value have you added this year?'",
      options: [
        {
          id: 'generic_response',
          text: 'I\'ve worked really hard and been a good team player.',
          type: 'weak',
          response: 'I see. Let me think about it.',
          outcome: 'fail',
          points: 2,
          explanation: 'Too vague. Managers need concrete examples of business impact, not just effort.'
        },
        {
          id: 'some_specifics',
          text: 'I completed all my projects on time and helped train new team members.',
          type: 'average',
          response: 'Those are good contributions. I\'ll consider a modest increase.',
          outcome: 'partial',
          points: 6,
          explanation: 'Better, but focus on measurable business impact rather than just job duties.'
        },
        {
          id: 'quantified_impact',
          text: 'I delivered the client portal 2 months ahead of schedule, which generated $200K in early revenue. I also mentored 3 new hires who are now 40% more productive than previous cohorts.',
          type: 'strong',
          response: 'Wow, those numbers are compelling. I think we can work something out.',
          outcome: 'success',
          points: 10,
          explanation: 'Perfect! Specific, quantified achievements tied to business value. This is what gets results.'
        }
      ]
    }
  ],
  promotion_opportunity: [
    {
      situation: "HR says: 'The team lead role comes with a 10% salary bump and management responsibilities.'",
      options: [
        {
          id: 'accept_promotion',
          text: 'That sounds great, I\'ll take it!',
          type: 'weak',
          response: 'Wonderful! We\'ll start the transition next week.',
          outcome: 'fail',
          points: 2,
          explanation: 'You accepted without negotiating. More responsibility usually warrants more than 10%.'
        },
        {
          id: 'research_based',
          text: 'I\'m excited about the role. I researched similar positions and they typically pay 15-25% more. Could we discuss something in that range?',
          type: 'average',
          response: 'Let me check with the budget team. Maybe we can do 15%.',
          outcome: 'partial',
          points: 7,
          explanation: 'Good research reference, but could be stronger by emphasizing your specific value.'
        },
        {
          id: 'value_proposition',
          text: 'I\'m thrilled about leading the team. Given the $2M budget responsibility and 5-person team I\'ll manage, plus my track record of delivering projects 20% under budget, I believe 20% reflects the role\'s value and my qualifications.',
          type: 'strong',
          response: 'You make a strong case. The scope is significant, and your budget management skills are exactly what we need.',
          outcome: 'success',
          points: 10,
          explanation: 'Excellent! You connected the role\'s scope to your proven abilities and market standards.'
        }
      ]
    }
  ],
  competing_offer: [
    {
      situation: "Your manager asks: 'What would it take to keep you here? We value you and don\'t want to lose you.'",
      options: [
        {
          id: 'threatening',
          text: 'Either match their offer exactly or I\'m gone.',
          type: 'weak',
          response: 'I understand you have options. We\'ll need to think about this.',
          outcome: 'fail',
          points: 1,
          explanation: 'Too aggressive. This approach often backfires and damages relationships.'
        },
        {
          id: 'collaborative',
          text: 'I love working here. The other offer is 30% more, but I\'d prefer to stay if we can work something out.',
          type: 'average',
          response: 'We appreciate your loyalty. Let me see what&apos;s possible within our budget.',
          outcome: 'partial',
          points: 6,
          explanation: 'Good approach showing loyalty, but could be more specific about what would work.'
        },
        {
          id: 'win_win',
          text: 'I love the team and culture here. The other offer is significant - 30% more plus equity. I\'d prefer to stay if we can get closer to market rate. Even 25% would show the company values my contributions.',
          type: 'strong',
          response: 'We definitely want to retain you. Let me present this to leadership - your contributions justify that investment.',
          outcome: 'success',
          points: 10,
          explanation: 'Perfect balance of showing value for staying while being specific about what would work.'
        }
      ]
    }
  ]
};

interface SalaryNegotiationSimulatorProps {
  onComplete?: (results: { scenario: string; score: number; outcome: string }) => void;
}

export default function SalaryNegotiationSimulator({ onComplete }: SalaryNegotiationSimulatorProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [selectedScenario, setSelectedScenario] = useState<NegotiationScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState<DialogueOption[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Record usage for analytics
  useState(() => {
    recordCalculatorUsage('salary-negotiation-simulator');
  });

  const startScenario = (scenario: NegotiationScenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setScore(0);
    setResponses([]);
    setIsComplete(false);
    setShowFeedback(false);
  };

  const handleOptionSelect = (option: DialogueOption) => {
    const newResponses = [...responses, option];
    setResponses(newResponses);
    setScore(score + option.points);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      const steps = scenarioSteps[selectedScenario!.id];
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeScenario(newResponses, score + option.points);
      }
    }, 3000);
  };

  const completeScenario = (finalResponses: DialogueOption[], finalScore: number) => {
    setIsComplete(true);
    const maxPossibleScore = scenarioSteps[selectedScenario!.id].length * 10;
    const percentage = (finalScore / maxPossibleScore) * 100;
    
    let outcome = 'Needs Practice';
    if (percentage >= 80) outcome = 'Excellent';
    else if (percentage >= 60) outcome = 'Good';
    else if (percentage >= 40) outcome = 'Fair';

    onComplete?.({
      scenario: selectedScenario!.title,
      score: finalScore,
      outcome
    });

    if (percentage >= 70) {
      toast.success(`Great negotiation! You scored ${finalScore}/${maxPossibleScore} points.`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const resetSimulation = () => {
    setSelectedScenario(null);
    setCurrentStep(0);
    setScore(0);
    setResponses([]);
    setIsComplete(false);
    setShowFeedback(false);
  };

  const getScoreBadge = () => {
    if (!selectedScenario) return null;
    const maxScore = scenarioSteps[selectedScenario.id].length * 10;
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 80) return { color: 'text-green-400', bg: 'bg-green-500/10', text: 'Excellent' };
    if (percentage >= 60) return { color: 'text-blue-400', bg: 'bg-blue-500/10', text: 'Good' };
    if (percentage >= 40) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10', text: 'Fair' };
    return { color: 'text-red-400', bg: 'bg-red-500/10', text: 'Needs Practice' };
  };

  if (!selectedScenario) {
    return (
      <div className={`p-6 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl`}>
        <div className="text-center mb-6">
          <MessageCircle className={`w-12 h-12 text-blue-400 mx-auto mb-4`} />
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            Salary Negotiation Simulator
          </h3>
          <p className={`${theme.textColors.secondary}`}>
            Practice real negotiation scenarios and learn what works (and what doesn&apos;t!)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg cursor-pointer hover:${theme.borderColors.focus} transition-all`}
              onClick={() => startScenario(scenario)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${theme.textColors.primary}`}>
                  {scenario.title}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  scenario.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                  scenario.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {scenario.difficulty}
                </span>
              </div>
              <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                {scenario.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className={`${theme.textColors.tertiary}`}>
                  Current: ${scenario.currentSalary.toLocaleString()}
                </span>
                <span className={`text-green-400 font-medium`}>
                  Target: +{scenario.targetIncrease}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={`mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg`}>
          <p className={`text-sm ${theme.textColors.secondary} text-center`}>
            💡 Each scenario tests different negotiation skills. Start with &quot;Easy&quot; to build confidence!
          </p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const badge = getScoreBadge();
    const maxScore = scenarioSteps[selectedScenario.id].length * 10;
    const percentage = (score / maxScore) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 ${badge?.bg} border-2 border-opacity-20 rounded-xl`}
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`inline-flex items-center justify-center w-16 h-16 ${badge?.bg} rounded-full mb-4`}
          >
            <Award className={`w-8 h-8 ${badge?.color}`} />
          </motion.div>
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
            Simulation Complete!
          </h3>
          <p className={`${theme.textColors.secondary} text-lg mb-4`}>
            {selectedScenario.title}
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${badge?.bg} rounded-full`}>
            <Star className={`w-5 h-5 ${badge?.color}`} />
            <span className={`font-bold ${badge?.color}`}>
              {score}/{maxScore} points ({percentage.toFixed(0)}%)
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>
            Your Performance:
          </h4>
          {responses.map((response, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 border-l-4 rounded-lg ${
                response.type === 'strong' ? 'border-green-400 bg-green-500/10' :
                response.type === 'average' ? 'border-yellow-400 bg-yellow-500/10' :
                'border-red-400 bg-red-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${
                  response.type === 'strong' ? 'text-green-400' :
                  response.type === 'average' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  Step {index + 1}: {response.points}/10 points
                </span>
                {response.type === 'strong' ? 
                  <CheckCircle className="w-5 h-5 text-green-400" /> :
                  response.type === 'average' ?
                  <AlertCircle className="w-5 h-5 text-yellow-400" /> :
                  <XCircle className="w-5 h-5 text-red-400" />
                }
              </div>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                {response.explanation}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={resetSimulation}
            className={`px-6 py-3 ${theme.buttons.secondary} rounded-xl font-medium transition-all hover-lift`}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Another Scenario
          </button>
        </div>
      </motion.div>
    );
  }

  const currentStepData = scenarioSteps[selectedScenario.id][currentStep];

  return (
    <div className={`p-6 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>
              {selectedScenario.title}
            </h3>
            <p className={`text-sm ${theme.textColors.tertiary}`}>
              {selectedScenario.context}
            </p>
          </div>
          <div className="text-right">
            <span className={`text-sm ${theme.textColors.secondary}`}>
              Step {currentStep + 1} of {scenarioSteps[selectedScenario.id].length}
            </span>
            <div className={`text-lg font-bold ${theme.textColors.primary}`}>
              {score} points
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2">
          <motion.div
            className={`h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / scenarioSteps[selectedScenario.id].length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showFeedback ? (
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg mb-6`}>
              <p className={`${theme.textColors.secondary} font-medium`}>
                {currentStepData.situation}
              </p>
            </div>

            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              How do you respond?
            </h4>

            <div className="space-y-3">
              {currentStepData.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOptionSelect(option)}
                  aria-label={`Select response: ${option.text}`}
                  className={`w-full p-4 text-left ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg hover:${theme.borderColors.focus} hover:shadow-lg transition-all group`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      option.type === 'strong' ? 'bg-green-400' :
                      option.type === 'average' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                    <span className={`${theme.textColors.primary} font-medium group-hover:text-blue-400`}>
                      &quot;{option.text}&quot;
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`feedback-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-6 text-center ${
              responses[responses.length - 1]?.type === 'strong' ? theme.status.success.bg :
              responses[responses.length - 1]?.type === 'average' ? theme.status.warning.bg :
              theme.status.error.bg
            } rounded-lg`}>
              <h4 className={`text-lg font-bold mb-3 ${
                responses[responses.length - 1]?.type === 'strong' ? theme.status.success.text :
                responses[responses.length - 1]?.type === 'average' ? theme.status.warning.text :
                theme.status.error.text
              }`}>
                Manager&apos;s Response:
              </h4>
              <p className={`${theme.textColors.secondary} mb-4 italic`}>
                &quot;{responses[responses.length - 1]?.response}&quot;
              </p>
              <div className={`p-3 bg-black/20 rounded-lg`}>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  <strong>Feedback:</strong> {responses[responses.length - 1]?.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`mt-6 p-4 bg-slate-800/50 rounded-lg`}>
        <p className={`text-sm ${theme.textColors.secondary} text-center`}>
          💡 Watch for the colored dots: 🟢 Strong response, 🟡 Average response, 🔴 Weak response
        </p>
      </div>
    </div>
  );
}

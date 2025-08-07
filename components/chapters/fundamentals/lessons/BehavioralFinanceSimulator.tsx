'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, AlertTriangle, CheckCircle, DollarSign, Eye, Lightbulb, RefreshCw } from 'lucide-react';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';

interface BehavioralFinanceSimulatorProps {
  className?: string;
}

interface CognitiveBias {
  id: string;
  name: string;
  description: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    isRational: boolean;
    explanation: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  realWorldExample: string;
  preventionStrategy: string;
}

interface BiasResult {
  biasId: string;
  selectedOption: string;
  isRational: boolean;
  score: number;
}

const cognitiveBiases: CognitiveBias[] = [
  {
    id: 'loss-aversion',
    name: 'Loss Aversion',
    description: 'People feel losses about twice as strongly as equivalent gains, leading to poor investment decisions.',
    scenario: 'Your investment portfolio has lost 15% ($15,000 on $100,000) during a market downturn. The fundamentals of your investments remain strong. What do you do?',
    options: [
      {
        id: 'sell-all',
        text: 'Sell everything to prevent further losses',
        isRational: false,
        explanation: 'This locks in losses and misses the recovery. Loss aversion makes losses feel unbearable, but selling low violates investing principles.',
        impact: 'high'
      },
      {
        id: 'sell-some',
        text: 'Sell some investments to feel better',
        isRational: false,
        explanation: 'Partial selling still locks in some losses. This is loss aversion in action - making decisions based on pain rather than logic.',
        impact: 'medium'
      },
      {
        id: 'hold-steady',
        text: 'Hold steady and continue regular investing',
        isRational: true,
        explanation: 'Rational choice! Market downturns are temporary. Staying invested allows you to benefit from the eventual recovery.',
        impact: 'low'
      },
      {
        id: 'buy-more',
        text: 'Invest more money while prices are low',
        isRational: true,
        explanation: 'Excellent! Buying during downturns (dollar-cost averaging) can improve long-term returns. This overcomes loss aversion.',
        impact: 'low'
      }
    ],
    realWorldExample: 'During COVID-19 crash (March 2020), investors who sold locked in 30-40% losses. Those who held recovered fully within 6 months.',
    preventionStrategy: 'Set up automatic investing to remove emotion from decisions. Remember: temporary losses on paper aren\'t real until you sell.'
  },
  {
    id: 'anchoring',
    name: 'Anchoring Bias',
    description: 'Overrelying on the first piece of information encountered when making decisions.',
    scenario: 'You see a car listed for $25,000, marked down from $35,000. You research and find similar cars selling for $20,000-22,000. The dealer offers $24,000 as their "final price." What do you do?',
    options: [
      {
        id: 'accept-deal',
        text: 'Accept - it\'s $11,000 off the original price!',
        isRational: false,
        explanation: 'You\'re anchored to the artificial $35,000 price. The real value is $20-22k, so $24k is overpriced.',
        impact: 'high'
      },
      {
        id: 'negotiate-middle',
        text: 'Negotiate to $23,000 - meeting in the middle',
        isRational: false,
        explanation: 'Still anchored to their inflated starting price. You\'re paying $1-3k more than market value.',
        impact: 'medium'
      },
      {
        id: 'offer-market',
        text: 'Offer $21,000 based on market research',
        isRational: true,
        explanation: 'Rational! You ignored their anchor and based your offer on actual market value. This could save $2-3k.',
        impact: 'low'
      },
      {
        id: 'walk-away',
        text: 'Walk away and buy elsewhere for $20,000',
        isRational: true,
        explanation: 'Perfect! You completely avoided their anchoring tactic and found the best deal elsewhere.',
        impact: 'low'
      }
    ],
    realWorldExample: 'Real estate: Homes listed at inflated prices still sell for more than they should because buyers anchor to the listing price.',
    preventionStrategy: 'Research market values BEFORE seeing any prices. Set your own anchor based on independent research.'
  },
  {
    id: 'present-bias',
    name: 'Present Bias',
    description: 'Overvaluing immediate rewards while undervaluing future benefits.',
    scenario: 'You have $2,000 extra and two options: A) Invest it for retirement (could grow to $16,000 in 20 years), or B) Take a vacation now. What influences your decision most?',
    options: [
      {
        id: 'vacation-deserve',
        text: 'Take the vacation - I deserve it now',
        isRational: false,
        explanation: 'Classic present bias! The immediate pleasure overrides the logical choice of 8x returns over 20 years.',
        impact: 'high'
      },
      {
        id: 'vacation-life',
        text: 'Take the vacation - "life is short"',
        isRational: false,
        explanation: 'Present bias makes future benefits feel less real. But $14,000 opportunity cost is very real.',
        impact: 'high'
      },
      {
        id: 'invest-all',
        text: 'Invest it all for the future',
        isRational: true,
        explanation: 'Rational choice! You overcame present bias and chose the option with better long-term value.',
        impact: 'low'
      },
      {
        id: 'compromise',
        text: 'Invest $1,500, spend $500 on smaller pleasures',
        isRational: true,
        explanation: 'Good compromise! You satisfied present bias with small rewards while still maximizing future benefits.',
        impact: 'low'
      }
    ],
    realWorldExample: 'Americans save only 5% of income partly due to present bias - preferring immediate consumption over future security.',
    preventionStrategy: 'Automate savings/investing to remove the decision. Make future benefits visual and specific (e.g., "This $100 becomes $800 for my retirement").'
  },
  {
    id: 'confirmation-bias',
    name: 'Confirmation Bias',
    description: 'Seeking information that confirms existing beliefs while ignoring contradicting evidence.',
    scenario: 'You\'re convinced a particular stock is a great investment. You find an article criticizing the company\'s financial health and growth prospects. How do you respond?',
    options: [
      {
        id: 'ignore-article',
        text: 'Ignore it - the author doesn\'t understand the company',
        isRational: false,
        explanation: 'Classic confirmation bias! Dismissing contrary evidence without consideration can lead to poor investment decisions.',
        impact: 'high'
      },
      {
        id: 'find-positive',
        text: 'Search for articles that support your view',
        isRational: false,
        explanation: 'This reinforces confirmation bias. You\'re actively seeking confirming information rather than objective analysis.',
        impact: 'medium'
      },
      {
        id: 'analyze-objectively',
        text: 'Carefully analyze both positive and negative information',
        isRational: true,
        explanation: 'Excellent! Objective analysis of all available information leads to better investment decisions.',
        impact: 'low'
      },
      {
        id: 'seek-opposing',
        text: 'Actively seek out more opposing viewpoints',
        isRational: true,
        explanation: 'Perfect! Deliberately seeking contrary evidence is the best way to overcome confirmation bias.',
        impact: 'low'
      }
    ],
    realWorldExample: 'Many investors held onto dot-com stocks in 2000 by only reading bullish analyses, ignoring warning signs of overvaluation.',
    preventionStrategy: 'Devil\'s advocate approach: For every investment, actively research why you SHOULDN\'T buy it. Seek disconfirming evidence.'
  },
  {
    id: 'sunk-cost',
    name: 'Sunk Cost Fallacy',
    description: 'Continuing a poor decision because you\'ve already invested time, money, or effort.',
    scenario: 'You bought a stock for $50/share. It\'s now $30/share after bad earnings. You\'ve lost $2,000. New analysis suggests it will likely continue declining. What do you do?',
    options: [
      {
        id: 'hold-recover',
        text: 'Hold until it recovers to break even',
        isRational: false,
        explanation: 'Sunk cost fallacy! Your $2,000 loss is gone regardless. The only question is: will this stock outperform alternatives going forward?',
        impact: 'high'
      },
      {
        id: 'average-down',
        text: 'Buy more shares to lower your average cost',
        isRational: false,
        explanation: 'Doubling down on a losing investment due to sunk cost fallacy. This could make losses even worse.',
        impact: 'high'
      },
      {
        id: 'evaluate-future',
        text: 'Ignore past losses and evaluate future prospects',
        isRational: true,
        explanation: 'Rational! Past losses are sunk costs. Make decisions based on future potential, not what you\'ve already lost.',
        impact: 'low'
      },
      {
        id: 'sell-reinvest',
        text: 'Sell and reinvest in better opportunities',
        isRational: true,
        explanation: 'Excellent! You overcame sunk cost fallacy and made the forward-looking decision. Tax loss harvesting is a bonus.',
        impact: 'low'
      }
    ],
    realWorldExample: 'Investors often hold losing stocks too long hoping to "break even" while missing better opportunities.',
    preventionStrategy: 'Ask: "If I had $X cash instead of this investment, would I buy this stock today?" If no, sell it.'
  }
];

export default function BehavioralFinanceSimulator({ className = '' }: BehavioralFinanceSimulatorProps) {
  const [currentBias, setCurrentBias] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [completedBiases, setCompletedBiases] = useState<BiasResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const option = cognitiveBiases[currentBias].options.find(opt => opt.id === optionId);
    setShowResult(true);
    
    if (option) {
      const score = option.isRational ? 100 : (option.impact === 'high' ? 0 : option.impact === 'medium' ? 50 : 75);
      const result: BiasResult = {
        biasId: cognitiveBiases[currentBias].id,
        selectedOption: optionId,
        isRational: option.isRational,
        score
      };
      
      setCompletedBiases(prev => [...prev, result]);
    }
  };

  const nextBias = () => {
    if (currentBias < cognitiveBiases.length - 1) {
      setCurrentBias(currentBias + 1);
      setSelectedOption('');
      setShowResult(false);
    } else {
      // Calculate overall score and show summary
      const totalScore = completedBiases.reduce((sum, result) => sum + result.score, 0);
      const avgScore = totalScore / completedBiases.length;
      setOverallScore(avgScore);
      setShowSummary(true);
    }
  };

  const resetSimulator = () => {
    setCurrentBias(0);
    setSelectedOption('');
    setShowResult(false);
    setCompletedBiases([]);
    setOverallScore(0);
    setShowSummary(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.status.success.text;
    if (score >= 60) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! You have strong rational decision-making skills.';
    if (score >= 80) return 'Good! You recognize most cognitive biases affecting financial decisions.';
    if (score >= 60) return 'Fair. Review bias prevention strategies to improve decision-making.';
    return 'Many decisions showed cognitive bias influence. Study these patterns to improve.';
  };

  const bias = cognitiveBiases[currentBias];
  const selectedOptionData = bias?.options.find(opt => opt.id === selectedOption);

  // Generate chart data for summary
  const chartData = cognitiveBiases.map((bias) => {
    const result = completedBiases.find(r => r.biasId === bias.id);
    return {
      name: bias.name.split(' ').slice(0, 2).join(' '), // Shortened names
      score: result?.score || 0,
      rational: result?.isRational ? 'Rational' : 'Biased'
    };
  });

  const biasDistribution = [
    { name: 'Rational Decisions', value: completedBiases.filter(r => r.isRational).length, color: '#10B981' },
    { name: 'Biased Decisions', value: completedBiases.filter(r => !r.isRational).length, color: '#EF4444' }
  ];

  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-6 ${className}`}
      >
        <GradientCard variant="glass" gradient="green" className="p-6">
          <div className="text-center mb-6">
            <Brain className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-4`} />
            <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
              Behavioral Finance Assessment Complete
            </h3>
            <p className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
              {overallScore.toFixed(0)}%
            </p>
            <p className={`${theme.textColors.secondary} mb-4`}>
              {getScoreMessage(overallScore)}
            </p>
          </div>

          {/* Score Breakdown Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 text-center`}>
                Decision Quality by Bias Type
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 text-center`}>
                Overall Decision Distribution
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={biasDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {biasDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4 mb-6">
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Detailed Analysis
            </h4>
            {completedBiases.map((result) => {
              const bias = cognitiveBiases.find(b => b.id === result.biasId);
              return (
                <div 
                  key={result.biasId}
                  className={`p-4 border rounded-lg ${
                    result.isRational ? 
                    `${theme.status.success.bg} ${theme.status.success.border}` :
                    `${theme.status.error.bg} ${theme.status.error.border}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h5 className={`font-semibold ${theme.textColors.primary}`}>
                      {bias?.name}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        result.isRational ? theme.status.success.text : theme.status.error.text
                      }`}>
                        {result.score}/100
                      </span>
                      {result.isRational ? (
                        <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                      ) : (
                        <AlertTriangle className={`w-5 h-5 ${theme.status.error.text}`} />
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary} mt-2`}>
                    {bias?.preventionStrategy}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetSimulator}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center mx-auto`}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Take Assessment Again
            </motion.button>
          </div>
        </GradientCard>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GradientCard variant="glass" gradient="purple" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`${theme.status.info.bg} p-3 rounded-lg`}>
              <Brain className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Behavioral Finance Simulator
              </h3>
              <p className={`${theme.textColors.secondary}`}>
                Test your resistance to cognitive biases that affect financial decisions
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${theme.textColors.secondary}`}>
                Bias {currentBias + 1} of {cognitiveBiases.length}
              </span>
              <span className={`text-sm ${theme.textColors.secondary}`}>
                {Math.round(((currentBias + 1) / cognitiveBiases.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 relative overflow-hidden">
              <div 
                className={`h-2 ${theme.status.info.bg} rounded-full transition-all duration-300 absolute top-0 left-0`}
                style={((currentBias + 1) / cognitiveBiases.length) * 100 >= 100 ? {width: '100%'} : 
                       ((currentBias + 1) / cognitiveBiases.length) * 100 >= 75 ? {width: '75%'} :
                       ((currentBias + 1) / cognitiveBiases.length) * 100 >= 50 ? {width: '50%'} :
                       ((currentBias + 1) / cognitiveBiases.length) * 100 >= 25 ? {width: '25%'} : {width: '20%'}}
              />
            </div>
          </div>

          {/* Bias Information */}
          <div className="mb-6">
            <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-3`}>
              {bias.name}
            </h4>
            <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg mb-4`}>
              <p className={`${theme.textColors.secondary} text-sm`}>
                {bias.description}
              </p>
            </div>
          </div>

          {/* Scenario */}
          <div className="mb-6">
            <h5 className={`text-lg font-semibold ${theme.textColors.primary} mb-3 flex items-center`}>
              <Eye className="w-5 h-5 mr-2" />
              Scenario
            </h5>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {bias.scenario}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            <h5 className={`text-lg font-semibold ${theme.textColors.primary} mb-3`}>
              What would you do?
            </h5>
            {bias.options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showResult}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  selectedOption === option.id
                    ? `${theme.borderColors.primary} ${theme.status.info.bg}`
                    : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <p className={`${theme.textColors.primary} font-medium`}>
                  {option.text}
                </p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showResult && selectedOptionData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 mb-6"
              >
                {/* Result */}
                <div className={`p-4 border-l-4 rounded-lg ${
                  selectedOptionData.isRational 
                    ? `${theme.status.success.bg} ${theme.status.success.border}`
                    : `${theme.status.error.bg} ${theme.status.error.border}`
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOptionData.isRational ? (
                      <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 ${theme.status.error.text}`} />
                    )}
                    <h6 className={`font-semibold ${
                      selectedOptionData.isRational ? theme.status.success.text : theme.status.error.text
                    }`}>
                      {selectedOptionData.isRational ? 'Rational Decision!' : 'Cognitive Bias Detected'}
                    </h6>
                  </div>
                  <p className={`${theme.textColors.secondary} text-sm`}>
                    {selectedOptionData.explanation}
                  </p>
                </div>

                {/* Real World Example */}
                <div className={`p-4 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
                  <h6 className={`font-semibold ${theme.status.warning.text} mb-2 flex items-center`}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    Real World Impact
                  </h6>
                  <p className={`${theme.textColors.secondary} text-sm`}>
                    {bias.realWorldExample}
                  </p>
                </div>

                {/* Prevention Strategy */}
                <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
                  <h6 className={`font-semibold ${theme.status.info.text} mb-2 flex items-center`}>
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Prevention Strategy
                  </h6>
                  <p className={`${theme.textColors.secondary} text-sm`}>
                    {bias.preventionStrategy}
                  </p>
                </div>

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextBias}
                    className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift`}
                  >
                    {currentBias < cognitiveBiases.length - 1 ? 'Next Scenario' : 'View Results'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GradientCard>
      </motion.div>
    </div>
  );
}

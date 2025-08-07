'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, TrendingUp, Target, Shield, Heart, AlertTriangle } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    type: MoneyPersonalityType;
    weight: number;
  }[];
}

type MoneyPersonalityType = 'spender' | 'saver' | 'investor' | 'avoider' | 'worrier' | 'planner';

interface PersonalityResult {
  type: MoneyPersonalityType;
  score: number;
  description: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

const questions: Question[] = [
  {
    id: 'q1',
    question: 'When you receive unexpected money, your first instinct is to:',
    options: [
      { id: 'a', text: 'Spend it on something fun immediately', type: 'spender', weight: 3 },
      { id: 'b', text: 'Put it straight into savings', type: 'saver', weight: 3 },
      { id: 'c', text: 'Research investment opportunities', type: 'investor', weight: 3 },
      { id: 'd', text: 'Feel anxious about what to do with it', type: 'avoider', weight: 3 }
    ]
  },
  {
    id: 'q2',
    question: 'Your approach to budgeting is:',
    options: [
      { id: 'a', text: 'Detailed spreadsheets and tracking every penny', type: 'planner', weight: 3 },
      { id: 'b', text: 'General awareness but flexible spending', type: 'saver', weight: 2 },
      { id: 'c', text: 'What budget? I spend as I feel like it', type: 'spender', weight: 3 },
      { id: 'd', text: 'I avoid thinking about money entirely', type: 'avoider', weight: 3 }
    ]
  },
  {
    id: 'q3',
    question: 'When making a large purchase, you:',
    options: [
      { id: 'a', text: 'Research extensively and compare options', type: 'planner', weight: 3 },
      { id: 'b', text: 'Go with your gut feeling quickly', type: 'spender', weight: 2 },
      { id: 'c', text: 'Calculate the investment return potential', type: 'investor', weight: 3 },
      { id: 'd', text: 'Worry about making the wrong choice', type: 'worrier', weight: 3 }
    ]
  },
  {
    id: 'q4',
    question: 'Your retirement planning strategy is:',
    options: [
      { id: 'a', text: 'Maxing out all tax-advantaged accounts', type: 'investor', weight: 3 },
      { id: 'b', text: 'Contributing consistently to 401(k)', type: 'planner', weight: 2 },
      { id: 'c', text: 'Hoping Social Security will be enough', type: 'avoider', weight: 2 },
      { id: 'd', text: 'Constantly worried it won\'t be enough', type: 'worrier', weight: 3 }
    ]
  },
  {
    id: 'q5',
    question: 'When the stock market drops significantly, you:',
    options: [
      { id: 'a', text: 'See it as a buying opportunity', type: 'investor', weight: 3 },
      { id: 'b', text: 'Stick to your long-term plan', type: 'planner', weight: 3 },
      { id: 'c', text: 'Panic and consider selling everything', type: 'worrier', weight: 3 },
      { id: 'd', text: 'Avoid checking your accounts', type: 'avoider', weight: 2 }
    ]
  }
];

const personalityTypes: Record<MoneyPersonalityType, PersonalityResult> = {
  spender: {
    type: 'spender',
    score: 0,
    description: 'You enjoy life and believe money should be spent to create experiences and happiness.',
    strengths: ['Lives in the moment', 'Generous with others', 'Enjoys life experiences', 'Not overly stressed about money'],
    challenges: ['Difficulty saving for long-term goals', 'May overspend on impulse', 'Limited emergency funds', 'Retirement planning gaps'],
    recommendations: [
      'Set up automatic savings transfers',
      'Use the 50/30/20 budgeting rule',
      'Create separate "fun money" accounts',
      'Focus on experiences over material purchases'
    ]
  },
  saver: {
    type: 'saver',
    score: 0,
    description: 'You prioritize financial security and are disciplined about saving money regularly.',
    strengths: ['Strong emergency fund', 'Disciplined spending habits', 'Low financial stress', 'Good at reaching savings goals'],
    challenges: ['May be too conservative with investments', 'Could miss growth opportunities', 'Lifestyle inflation resistance', 'Over-saving vs. living'],
    recommendations: [
      'Explore investment opportunities beyond savings',
      'Set aside money for enjoyment',
      'Consider higher-yield investment vehicles',
      'Balance security with growth potential'
    ]
  },
  investor: {
    type: 'investor',
    score: 0,
    description: 'You see money as a tool for building wealth and focus on long-term growth strategies.',
    strengths: ['Long-term wealth building', 'Risk tolerance', 'Market knowledge', 'Growth-focused mindset'],
    challenges: ['May take excessive risks', 'Could neglect emergency funds', 'Overconfidence in market timing', 'Ignoring insurance needs'],
    recommendations: [
      'Maintain 3-6 months emergency fund',
      'Diversify across asset classes',
      'Regular portfolio rebalancing',
      'Consider insurance and protection needs'
    ]
  },
  avoider: {
    type: 'avoider',
    score: 0,
    description: 'You prefer not to think about money and financial planning, often leaving decisions for later.',
    strengths: ['Less financial stress day-to-day', 'Trusting nature', 'Focus on non-financial priorities', 'Adaptable to circumstances'],
    challenges: ['Lack of financial planning', 'Missing investment opportunities', 'Inadequate retirement prep', 'Vulnerable to financial crises'],
    recommendations: [
      'Start with simple automated systems',
      'Use target-date funds for investing',
      'Set up automatic bill payments',
      'Schedule quarterly financial check-ins'
    ]
  },
  worrier: {
    type: 'worrier',
    score: 0,
    description: 'You are highly concerned about financial security and tend to be anxious about money decisions.',
    strengths: ['Risk awareness', 'Thorough research habits', 'Conservative approach', 'Emergency preparedness'],
    challenges: ['Analysis paralysis', 'Over-conservative investing', 'High financial stress', 'Missing growth opportunities'],
    recommendations: [
      'Start with low-risk investments',
      'Use dollar-cost averaging strategies',
      'Focus on education to build confidence',
      'Consider working with a financial advisor'
    ]
  },
  planner: {
    type: 'planner',
    score: 0,
    description: 'You are organized and strategic about money, preferring detailed plans and systematic approaches.',
    strengths: ['Excellent budgeting skills', 'Goal achievement', 'Strategic thinking', 'Financial discipline'],
    challenges: ['May be inflexible with plans', 'Over-analysis of decisions', 'Stress when plans change', 'Perfectionism paralysis'],
    recommendations: [
      'Build flexibility into your plans',
      'Regular plan reviews and adjustments',
      'Allow for some spontaneous spending',
      'Focus on progress over perfection'
    ]
  }
};

export default function MoneyPersonalityAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('money-personality-assessment');
  }, [recordCalculatorUsage]);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    const scores: Record<MoneyPersonalityType, number> = {
      spender: 0,
      saver: 0,
      investor: 0,
      avoider: 0,
      worrier: 0,
      planner: 0
    };

    questions.forEach(question => {
      const answerId = answers[question.id];
      if (answerId) {
        const selectedOption = question.options.find(opt => opt.id === answerId);
        if (selectedOption) {
          scores[selectedOption.type] += selectedOption.weight;
        }
      }
    });

    const dominantType = Object.entries(scores).reduce((max, [type, score]) => 
      score > max.score ? { type: type as MoneyPersonalityType, score } : max
    , { type: 'saver' as MoneyPersonalityType, score: 0 });

    const personalityResult = { ...personalityTypes[dominantType.type] };
    personalityResult.score = dominantType.score;
    
    setResult(personalityResult);
    setIsCompleted(true);
    toast.success('Assessment complete! Discover your money personality.');
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setIsCompleted(false);
  };

  const getPersonalityIcon = (type: MoneyPersonalityType) => {
    const iconProps = { className: "w-8 h-8" };
    switch (type) {
      case 'spender': return <Heart {...iconProps} className="w-8 h-8 text-pink-400" />;
      case 'saver': return <Shield {...iconProps} className="w-8 h-8 text-green-400" />;
      case 'investor': return <TrendingUp {...iconProps} className="w-8 h-8 text-blue-400" />;
      case 'avoider': return <AlertTriangle {...iconProps} className="w-8 h-8 text-yellow-400" />;
      case 'worrier': return <Brain {...iconProps} className="w-8 h-8 text-purple-400" />;
      case 'planner': return <Target {...iconProps} className="w-8 h-8 text-indigo-400" />;
      default: return <Brain {...iconProps} />;
    }
  };

  if (isCompleted && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Result Header */}
        <div className="text-center space-y-4">
          {getPersonalityIcon(result.type)}
          <div>
            <h3 className={`text-2xl font-bold ${theme.textColors.primary} capitalize`}>
              The {result.type}
            </h3>
            <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
              {result.description}
            </p>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strengths */}
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              Your Strengths
            </h4>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className={`${theme.textColors.secondary} flex items-start`}>
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
              Areas to Watch
            </h4>
            <ul className="space-y-2">
              {result.challenges.map((challenge, index) => (
                <li key={index} className={`${theme.textColors.secondary} flex items-start`}>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Target className="w-5 h-5 text-blue-400 mr-2" />
              Action Steps
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className={`${theme.textColors.secondary} flex items-start`}>
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetAssessment}
            className={`${theme.buttons.primary} px-6 py-3 rounded-lg font-medium transition-all duration-200`}
          >
            Take Assessment Again
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQ.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-sm ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className={`text-sm ${theme.textColors.secondary}`}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}
      >
        <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => handleAnswerSelect(currentQ.id, option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                selectedAnswer === option.id
                  ? `border-blue-400 bg-blue-400/10 ${theme.textColors.primary}`
                  : `${theme.borderColors.primary} ${theme.textColors.secondary} hover:border-blue-400/50 hover:bg-blue-400/5`
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedAnswer === option.id
                    ? 'border-blue-400 bg-blue-400'
                    : 'border-slate-400'
                }`}>
                  {selectedAnswer === option.id && (
                    <div className="w-full h-full rounded-full bg-blue-400" />
                  )}
                </div>
                <span>{option.text}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            currentQuestion === 0
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : `${theme.backgrounds.glass} ${theme.textColors.primary} hover:bg-white/10`
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            !selectedAnswer
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : `${theme.buttons.primary}`
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
        </button>
      </div>
    </div>
  );
}

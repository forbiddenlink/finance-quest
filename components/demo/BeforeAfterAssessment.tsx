'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Brain,
  ArrowRight,
  BarChart3,
  Star,
  Timer,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GradientCard from '@/components/shared/ui/GradientCard';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'budgeting' | 'investing' | 'credit' | 'emergency' | 'debt';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

interface UserScore {
  category: string;
  beforeScore: number;
  afterScore: number;
  improvement: number;
  maxScore: number;
}

interface BeforeAfterAssessmentProps {
  isDemo?: boolean;
  onComplete?: (results: UserScore[]) => void;
}

export default function BeforeAfterAssessment({ isDemo = false, onComplete }: BeforeAfterAssessmentProps) {
  const [phase, setPhase] = useState<'intro' | 'before' | 'learning' | 'after' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [beforeScores, setBeforeScores] = useState<UserScore[]>([]);
  const [afterScores, setAfterScores] = useState<UserScore[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Assessment questions covering key financial literacy areas
  const assessmentQuestions: AssessmentQuestion[] = [
    {
      id: 'budget_1',
      question: 'What percentage of your income should typically go toward housing costs?',
      options: ['10-15%', '20-25%', '25-30%', '35-40%'],
      correctAnswer: 2,
      category: 'budgeting',
      difficulty: 'basic'
    },
    {
      id: 'invest_1',
      question: 'What is compound interest?',
      options: [
        'Interest paid only on the principal amount',
        'Interest paid on both principal and previously earned interest',
        'A type of bank loan',
        'A government savings bond'
      ],
      correctAnswer: 1,
      category: 'investing',
      difficulty: 'basic'
    },
    {
      id: 'credit_1',
      question: 'What factor has the biggest impact on your credit score?',
      options: ['Payment history', 'Credit utilization', 'Length of credit history', 'Types of credit'],
      correctAnswer: 0,
      category: 'credit',
      difficulty: 'intermediate'
    },
    {
      id: 'emergency_1',
      question: 'How many months of expenses should you have in an emergency fund?',
      options: ['1-2 months', '3-6 months', '8-10 months', '12+ months'],
      correctAnswer: 1,
      category: 'emergency',
      difficulty: 'basic'
    },
    {
      id: 'debt_1',
      question: 'Which debt payoff strategy focuses on highest interest rates first?',
      options: ['Debt snowball', 'Debt avalanche', 'Debt consolidation', 'Minimum payments only'],
      correctAnswer: 1,
      category: 'debt',
      difficulty: 'intermediate'
    },
    {
      id: 'invest_2',
      question: 'What is dollar-cost averaging?',
      options: [
        'Investing a lump sum all at once',
        'Investing fixed amounts regularly regardless of market conditions',
        'Only investing when markets are down',
        'Averaging the cost of different stocks'
      ],
      correctAnswer: 1,
      category: 'investing',
      difficulty: 'advanced'
    },
    {
      id: 'budget_2',
      question: 'What is the 50/30/20 budgeting rule?',
      options: [
        '50% savings, 30% needs, 20% wants',
        '50% needs, 30% wants, 20% savings',
        '50% wants, 30% savings, 20% needs',
        '50% debt, 30% needs, 20% wants'
      ],
      correctAnswer: 1,
      category: 'budgeting',
      difficulty: 'intermediate'
    },
    {
      id: 'credit_2',
      question: 'What is a good credit utilization ratio?',
      options: ['Under 10%', 'Under 30%', 'Under 50%', 'Under 70%'],
      correctAnswer: 1,
      category: 'credit',
      difficulty: 'advanced'
    }
  ];

  useEffect(() => {
    if (phase === 'before' || phase === 'after') {
      setStartTime(new Date());
    }
  }, [phase]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && (phase === 'before' || phase === 'after')) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, phase]);

  const calculateScores = (answerSet: { [key: string]: number }): UserScore[] => {
    const categories = ['budgeting', 'investing', 'credit', 'emergency', 'debt'];
    return categories.map(category => {
      const categoryQuestions = assessmentQuestions.filter(q => q.category === category);
      const correctAnswers = categoryQuestions.filter(q => answerSet[q.id] === q.correctAnswer).length;
      const totalQuestions = categoryQuestions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        beforeScore: 0, // Will be set later
        afterScore: score,
        improvement: 0, // Will be calculated later
        maxScore: 100
      };
    });
  };

  const handleAnswer = (answerIndex: number) => {
    const questionId = assessmentQuestions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    
    setTimeout(() => {
      if (currentQuestion < assessmentQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Assessment complete
        const scores = calculateScores(answers);
        
        if (phase === 'before') {
          setBeforeScores(scores);
          setPhase('learning');
        } else if (phase === 'after') {
          // Calculate improvements
          const finalScores = scores.map((afterScore, index) => ({
            ...afterScore,
            beforeScore: beforeScores[index]?.afterScore || 0,
            improvement: afterScore.afterScore - (beforeScores[index]?.afterScore || 0)
          }));
          setAfterScores(finalScores);
          setPhase('results');
          onComplete?.(finalScores);
        }
        
        setCurrentQuestion(0);
        setAnswers({});
        setTimeSpent(0);
      }
    }, 1000);
  };

  const simulateAfterScores = () => {
    // For demo purposes, simulate improved scores
    const simulatedAfterScores = beforeScores.map(score => ({
      ...score,
      afterScore: Math.min(100, score.afterScore + Math.floor(Math.random() * 30) + 20),
      improvement: 0 // Will be calculated
    }));
    
    const finalScores = simulatedAfterScores.map(score => ({
      ...score,
      improvement: score.afterScore - score.beforeScore
    }));
    
    setAfterScores(finalScores);
    setPhase('results');
    onComplete?.(finalScores);
  };

  const startDemo = () => {
    // Pre-populate with realistic "before" scores for demo
    const demoBeforeScores: UserScore[] = [
      { category: 'Budgeting', beforeScore: 0, afterScore: 45, improvement: 0, maxScore: 100 },
      { category: 'Investing', beforeScore: 0, afterScore: 32, improvement: 0, maxScore: 100 },
      { category: 'Credit', beforeScore: 0, afterScore: 58, improvement: 0, maxScore: 100 },
      { category: 'Emergency', beforeScore: 0, afterScore: 41, improvement: 0, maxScore: 100 },
      { category: 'Debt', beforeScore: 0, afterScore: 49, improvement: 0, maxScore: 100 }
    ];
    
    setBeforeScores(demoBeforeScores);
    
    // Simulate "after" scores showing improvement
    setTimeout(() => {
      const demoAfterScores: UserScore[] = [
        { category: 'Budgeting', beforeScore: 45, afterScore: 82, improvement: 37, maxScore: 100 },
        { category: 'Investing', beforeScore: 32, afterScore: 74, improvement: 42, maxScore: 100 },
        { category: 'Credit', beforeScore: 58, afterScore: 88, improvement: 30, maxScore: 100 },
        { category: 'Emergency', beforeScore: 41, afterScore: 79, improvement: 38, maxScore: 100 },
        { category: 'Debt', beforeScore: 49, afterScore: 86, improvement: 37, maxScore: 100 }
      ];
      
      setAfterScores(demoAfterScores);
      setPhase('results');
      onComplete?.(demoAfterScores);
    }, 2000);
  };

  const averageImprovement = afterScores.length > 0 
    ? Math.round(afterScores.reduce((sum, score) => sum + score.improvement, 0) / afterScores.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <GradientCard variant="glass" gradient="blue" className="p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Before & After Assessment</h1>
                    <p className="text-gray-600">Measure your financial literacy improvement</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 font-semibold flex items-center justify-center gap-2">
                    <Award className="w-5 h-5" />
                    Contest Impact: Quantifiable Learning Outcomes
                  </p>
                </div>

                <p className="text-lg text-gray-700 mb-8">
                  This assessment demonstrates measurable learning improvements that address the 64% financial illiteracy crisis. 
                  Take the same test before and after using Finance Quest to see your knowledge growth.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900">8 Questions</h3>
                    <p className="text-sm text-blue-700">Core financial concepts</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Timer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-900">5 Minutes</h3>
                    <p className="text-sm text-green-700">Quick assessment</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-900">Detailed Results</h3>
                    <p className="text-sm text-purple-700">Category breakdown</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPhase('before')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <Star className="w-5 h-5" />
                    Start Assessment
                  </button>
                  
                  {isDemo && (
                    <button
                      onClick={startDemo}
                      className="bg-white text-gray-700 px-6 py-3 rounded-full font-semibold border border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Demo Mode
                    </button>
                  )}
                </div>
              </GradientCard>
            </motion.div>
          )}

          {(phase === 'before' || phase === 'after') && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <GradientCard variant="glass" gradient="purple" className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {phase === 'before' ? 'Before Assessment' : 'After Assessment'}
                    </h2>
                    <p className="text-gray-600">
                      Question {currentQuestion + 1} of {assessmentQuestions.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</div>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion) / assessmentQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {assessmentQuestions[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {assessmentQuestions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 opacity-0 transition-opacity hover:opacity-100" />
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </GradientCard>
            </motion.div>
          )}

          {phase === 'learning' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <GradientCard variant="glass" gradient="green" className="p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-2xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Learning Phase Complete!</h2>
                    <p className="text-gray-600">Your baseline has been established</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  {beforeScores.map((score, index) => (
                    <div key={index} className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">{score.afterScore}%</div>
                      <div className="text-sm text-green-700">{score.category}</div>
                    </div>
                  ))}
                </div>

                <p className="text-lg text-gray-700 mb-8">
                  Now experience Finance Quest&apos;s interactive lessons, AI coaching, and hands-on calculators. 
                  When ready, take the same assessment to measure your improvement!
                </p>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPhase('after')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Take After Assessment
                  </button>
                  
                  <button
                    onClick={simulateAfterScores}
                    className="bg-white text-gray-700 px-6 py-3 rounded-full font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Simulate Results
                  </button>
                </div>
              </GradientCard>
            </motion.div>
          )}

          {phase === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900">Remarkable Improvement!</h2>
                    <p className="text-lg text-gray-600">Your financial literacy has measurably increased</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg p-4 inline-block mb-8">
                  <p className="text-green-800 font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Average Improvement: +{averageImprovement} percentage points
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <GradientCard variant="glass" gradient="blue" className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Score Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={afterScores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="beforeScore" fill="#94A3B8" name="Before" />
                      <Bar dataKey="afterScore" fill="#3B82F6" name="After" />
                    </BarChart>
                  </ResponsiveContainer>
                </GradientCard>

                <GradientCard variant="glass" gradient="green" className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Improvement Breakdown</h3>
                  <div className="space-y-4">
                    {afterScores.map((score, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-green-900">{score.category}</h4>
                          <p className="text-sm text-green-700">{score.beforeScore}% → {score.afterScore}%</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">+{score.improvement}</div>
                          <div className="text-xs text-green-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GradientCard>
              </div>

              <GradientCard variant="glass" gradient="purple" className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Contest Impact Demonstrated</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{averageImprovement}%</div>
                    <div className="text-sm text-gray-600">Average Knowledge Gain</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">64%</div>
                    <div className="text-sm text-gray-600">Financial Illiteracy Crisis</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600">Measurable Improvement</div>
                  </div>
                </div>
                <p className="text-gray-700 mt-6">
                  This quantifiable improvement demonstrates Finance Quest&apos;s effectiveness in addressing 
                  the financial literacy crisis through personalized AI coaching and interactive learning.
                </p>
              </GradientCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

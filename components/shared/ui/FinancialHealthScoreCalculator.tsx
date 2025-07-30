'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Shield,
  PiggyBank,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Brain
} from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

interface HealthScoreData {
  emergencyFund: number; // 0-25 points
  debtToIncome: number; // 0-25 points
  savingsRate: number; // 0-25 points
  financialKnowledge: number; // 0-25 points
  totalScore: number; // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  category: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Critical';
}

interface AssessmentQuestion {
  id: string;
  question: string;
  category: 'emergency' | 'debt' | 'savings' | 'knowledge';
  options: Array<{
    text: string;
    value: number;
    points: number;
  }>;
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'emergency-fund',
    question: 'How many months of expenses do you have saved for emergencies?',
    category: 'emergency',
    options: [
      { text: 'None or less than 1 month', value: 0, points: 0 },
      { text: '1-2 months', value: 1.5, points: 8 },
      { text: '3-4 months', value: 3.5, points: 15 },
      { text: '5-6 months', value: 5.5, points: 20 },
      { text: '6+ months', value: 7, points: 25 }
    ]
  },
  {
    id: 'debt-income',
    question: 'What percentage of your monthly income goes to debt payments (excluding mortgage)?',
    category: 'debt',
    options: [
      { text: 'More than 40%', value: 45, points: 0 },
      { text: '30-40%', value: 35, points: 5 },
      { text: '20-30%', value: 25, points: 10 },
      { text: '10-20%', value: 15, points: 18 },
      { text: 'Less than 10%', value: 5, points: 25 }
    ]
  },
  {
    id: 'savings-rate',
    question: 'What percentage of your income do you save/invest each month?',
    category: 'savings',
    options: [
      { text: 'Nothing or I spend more than I earn', value: -5, points: 0 },
      { text: '1-5%', value: 3, points: 8 },
      { text: '6-10%', value: 8, points: 15 },
      { text: '11-20%', value: 15.5, points: 20 },
      { text: '20%+', value: 25, points: 25 }
    ]
  },
  {
    id: 'investment-knowledge',
    question: 'How well do you understand investing and compound interest?',
    category: 'knowledge',
    options: [
      { text: "I don't understand investing at all", value: 0, points: 0 },
      { text: 'I understand the basics but feel uncertain', value: 1, points: 8 },
      { text: 'I understand most concepts and invest regularly', value: 2, points: 15 },
      { text: 'I understand advanced concepts and optimize my portfolio', value: 3, points: 20 },
      { text: 'I could teach others about investing', value: 4, points: 25 }
    ]
  }
];

export default function FinancialHealthScoreCalculator() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [healthScore, setHealthScore] = useState<HealthScoreData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userProgress = useProgressStore(state => state.userProgress);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateHealthScore = (responses: Record<string, number>): HealthScoreData => {
    let emergencyFund = 0;
    let debtToIncome = 0;
    let savingsRate = 0;
    let financialKnowledge = 0;

    assessmentQuestions.forEach(q => {
      const answer = responses[q.id];
      if (answer !== undefined) {
        const option = q.options.find(opt => opt.points === answer);
        if (option) {
          switch (q.category) {
            case 'emergency':
              emergencyFund = option.points;
              break;
            case 'debt':
              debtToIncome = option.points;
              break;
            case 'savings':
              savingsRate = option.points;
              break;
            case 'knowledge':
              financialKnowledge = option.points;
              break;
          }
        }
      }
    });

    // Add bonus points for completed lessons
    const completedChapters = userProgress.currentChapter - 1;
    const knowledgeBonus = Math.min(completedChapters * 3, 15);
    financialKnowledge = Math.min(financialKnowledge + knowledgeBonus, 25);

    const totalScore = emergencyFund + debtToIncome + savingsRate + financialKnowledge;

    let grade: HealthScoreData['grade'];
    let category: HealthScoreData['category'];

    if (totalScore >= 90) {
      grade = 'A+';
      category = 'Excellent';
    } else if (totalScore >= 80) {
      grade = 'A';
      category = 'Excellent';
    } else if (totalScore >= 70) {
      grade = 'B+';
      category = 'Good';
    } else if (totalScore >= 60) {
      grade = 'B';
      category = 'Good';
    } else if (totalScore >= 50) {
      grade = 'C+';
      category = 'Fair';
    } else if (totalScore >= 40) {
      grade = 'C';
      category = 'Fair';
    } else if (totalScore >= 30) {
      grade = 'D';
      category = 'Needs Improvement';
    } else {
      grade = 'F';
      category = 'Critical';
    }

    return {
      emergencyFund,
      debtToIncome,
      savingsRate,
      financialKnowledge,
      totalScore,
      grade,
      category
    };
  };

  const handleAnswer = (points: number) => {
    const newAnswers = {
      ...answers,
      [assessmentQuestions[currentQuestion].id]: points
    };
    setAnswers(newAnswers);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final score
      const score = calculateHealthScore(newAnswers);
      setHealthScore(score);
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setHealthScore(null);
    setShowResults(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return Target;
    if (score >= 40) return AlertTriangle;
    return XCircle;
  };

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-xl border border-purple-100 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI Financial Health Score
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get an instant assessment of your financial health with personalized improvement recommendations
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {assessmentQuestions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {assessmentQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {assessmentQuestions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.points)}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-purple-700">
                        {option.text}
                      </span>
                      <div className="text-sm text-gray-400 group-hover:text-purple-500">
                        {option.points} pts
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* Overall Score */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-block"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className={`text-8xl font-bold ${getScoreColor(healthScore!.totalScore)} mb-2`}>
                  {healthScore!.totalScore}
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">
                  Grade: {healthScore!.grade}
                </div>
                <div className={`text-lg font-medium px-6 py-2 rounded-full inline-block ${healthScore!.category === 'Excellent' ? 'bg-green-100 text-green-800' :
                    healthScore!.category === 'Good' ? 'bg-blue-100 text-blue-800' :
                      healthScore!.category === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                  }`}>
                  {healthScore!.category}
                </div>
              </motion.div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  title: 'Emergency Fund',
                  score: healthScore!.emergencyFund,
                  icon: Shield,
                  color: 'blue'
                },
                {
                  title: 'Debt Management',
                  score: healthScore!.debtToIncome,
                  icon: CreditCard,
                  color: 'purple'
                },
                {
                  title: 'Savings Rate',
                  score: healthScore!.savingsRate,
                  icon: PiggyBank,
                  color: 'green'
                },
                {
                  title: 'Financial Knowledge',
                  score: healthScore!.financialKnowledge,
                  icon: Brain,
                  color: 'orange'
                }
              ].map((category, index) => {
                const Icon = category.icon;
                const ScoreIcon = getScoreIcon(category.score);

                return (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className="bg-white rounded-lg p-4 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-6 h-6 text-${category.color}-600`} />
                      <ScoreIcon className={`w-5 h-5 ${getScoreColor(category.score)}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{category.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}
                      </span>
                      <span className="text-sm text-gray-500">/25</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <motion.div
                        className={`bg-${category.color}-500 h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(category.score / 25) * 100}%` }}
                        transition={{ delay: 0.5 + (index * 0.1), duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Personalized Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                Your Personalized Action Plan
              </h3>

              <div className="space-y-4">
                {healthScore!.emergencyFund < 20 && (
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-blue-200">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Build Your Emergency Fund</h4>
                      <p className="text-sm text-gray-600">
                        Start with $1,000 and work toward 3-6 months of expenses. Try our Budget Builder to find extra money.
                      </p>
                    </div>
                  </div>
                )}

                {healthScore!.debtToIncome < 18 && (
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-purple-200">
                    <CreditCard className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Optimize Debt Payments</h4>
                      <p className="text-sm text-gray-600">
                        Use our Debt Payoff Calculator to compare avalanche vs snowball strategies and save thousands.
                      </p>
                    </div>
                  </div>
                )}

                {healthScore!.savingsRate < 15 && (
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-green-200">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Increase Your Savings Rate</h4>
                      <p className="text-sm text-gray-600">
                        Aim for at least 20% savings rate. Use our Compound Interest Calculator to see the long-term impact.
                      </p>
                    </div>
                  </div>
                )}

                {healthScore!.financialKnowledge < 20 && (
                  <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-orange-200">
                    <Brain className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Continue Learning</h4>
                      <p className="text-sm text-gray-600">
                        Complete more Finance Quest chapters to boost your knowledge score and make better decisions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <motion.button
                onClick={resetAssessment}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retake Assessment
              </motion.button>

              <motion.button
                onClick={() => window.location.href = '/calculators'}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Use Financial Tools
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

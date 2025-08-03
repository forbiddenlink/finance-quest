'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Heart,
  Home,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  RotateCcw,
  ChevronRight,
  Brain,
  Target,
  FileText
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'life' | 'health' | 'property' | 'business' | 'risk' | 'planning';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InsuranceRiskManagementQuizEnhancedProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function InsuranceRiskManagementQuizEnhanced({ onComplete }: InsuranceRiskManagementQuizEnhancedProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the primary advantage of term life insurance over permanent life insurance for most young families?",
      options: [
        "It builds cash value over time",
        "It provides lower cost coverage for income replacement needs",
        "It offers investment options within the policy",
        "It provides lifelong coverage regardless of age"
      ],
      correctAnswer: 1,
      explanation: "Term life insurance provides significantly lower cost coverage during peak earning years when families need maximum protection for income replacement, allowing them to invest the premium difference.",
      category: 'life',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: "Which calculation method for life insurance needs considers debt payoff, income replacement, mortgage, and education costs?",
      options: [
        "10x Annual Income Rule",
        "Human Life Value Approach",
        "DIME Method",
        "Present Value Analysis"
      ],
      correctAnswer: 2,
      explanation: "The DIME Method (Debt, Income, Mortgage, Education) provides a comprehensive approach by adding up all debts, income replacement needs, mortgage balance, and children's education costs.",
      category: 'life',
      difficulty: 'medium'
    },
    {
      id: 3,
      question: "What percentage of workers will experience a disability lasting 90 days or longer before retirement?",
      options: [
        "1 in 10 (10%)",
        "1 in 8 (12.5%)",
        "1 in 4 (25%)",
        "1 in 2 (50%)"
      ],
      correctAnswer: 2,
      explanation: "Statistics show that 1 in 4 workers (25%) will experience a disability lasting 90 days or longer before retirement, making disability insurance crucial for income protection.",
      category: 'health',
      difficulty: 'medium'
    },
    {
      id: 4,
      question: "What is the key difference between 'own occupation' and 'any occupation' disability insurance definitions?",
      options: [
        "Own occupation costs less than any occupation coverage",
        "Own occupation covers inability to perform your specific job, while any occupation covers inability to perform any suitable job",
        "Any occupation provides better benefits than own occupation",
        "They are the same definition with different terminology"
      ],
      correctAnswer: 1,
      explanation: "Own occupation definition covers you if you cannot perform your specific job duties, while any occupation only covers you if you cannot perform any job suitable to your education and experience. Own occupation provides broader protection.",
      category: 'health',
      difficulty: 'hard'
    },
    {
      id: 5,
      question: "Which type of auto insurance coverage is most important for protecting your personal assets from liability claims?",
      options: [
        "Collision coverage",
        "Comprehensive coverage",
        "Liability insurance with adequate limits",
        "Personal injury protection (PIP)"
      ],
      correctAnswer: 2,
      explanation: "Liability insurance with adequate limits (such as $250,000/$500,000/$100,000 or higher) protects your personal assets from lawsuits resulting from accidents you cause.",
      category: 'property',
      difficulty: 'easy'
    },
    {
      id: 6,
      question: "When should homeowners consider purchasing flood insurance?",
      options: [
        "Only if they live in a high-risk flood zone",
        "Only if required by their mortgage lender",
        "Anyone can benefit since floods can occur anywhere and standard homeowners policies exclude flood damage",
        "Only if they live near a large body of water"
      ],
      correctAnswer: 2,
      explanation: "Flood insurance should be considered by all homeowners because floods can occur anywhere due to various factors, and standard homeowners insurance policies exclude flood damage. There's also a 30-day waiting period before coverage begins.",
      category: 'property',
      difficulty: 'medium'
    },
    {
      id: 7,
      question: "What is the primary purpose of umbrella insurance?",
      options: [
        "To replace your auto and homeowners insurance policies",
        "To provide additional liability coverage above your underlying policies",
        "To cover business-related liability claims",
        "To protect against natural disasters"
      ],
      correctAnswer: 1,
      explanation: "Umbrella insurance provides additional liability coverage (typically $1-5 million) that sits above your auto and homeowners liability limits, protecting your assets from catastrophic liability claims.",
      category: 'property',
      difficulty: 'easy'
    },
    {
      id: 8,
      question: "Which type of business insurance covers claims related to professional mistakes, errors, or negligence?",
      options: [
        "General liability insurance",
        "Commercial property insurance",
        "Professional liability (E&O) insurance",
        "Workers compensation insurance"
      ],
      correctAnswer: 2,
      explanation: "Professional liability insurance (also called Errors & Omissions or E&O insurance) covers claims related to professional mistakes, errors, omissions, or negligence in providing professional services.",
      category: 'business',
      difficulty: 'medium'
    },
    {
      id: 9,
      question: "According to the risk management hierarchy, what is the preferred order for managing risks?",
      options: [
        "Transfer, Avoid, Reduce, Retain",
        "Avoid, Reduce, Transfer, Retain",
        "Retain, Transfer, Reduce, Avoid",
        "Reduce, Avoid, Transfer, Retain"
      ],
      correctAnswer: 1,
      explanation: "The risk management hierarchy follows: 1) Avoid (eliminate the risk), 2) Reduce (minimize probability or impact), 3) Transfer (use insurance or contracts), 4) Retain (self-insure or accept the risk).",
      category: 'risk',
      difficulty: 'hard'
    },
    {
      id: 10,
      question: "How should insurance planning be integrated with overall financial planning?",
      options: [
        "Insurance should be purchased separately from other financial decisions",
        "Only buy insurance after maximizing retirement contributions",
        "Coordinate insurance with emergency funds, tax planning, and investment strategies for optimal protection and cost efficiency",
        "Focus on permanent life insurance for investment purposes"
      ],
      correctAnswer: 2,
      explanation: "Insurance planning should be integrated with overall financial strategy, coordinating with emergency funds (affecting deductible choices), tax planning (considering tax treatment of benefits), and investment strategies for comprehensive wealth protection.",
      category: 'planning',
      difficulty: 'hard'
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !showResults) {
      timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeSpent(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishQuiz = () => {
    setShowResults(true);
    const score = selectedAnswers.reduce((total, answer, index) => {
      return answer === questions[index].correctAnswer ? total + 1 : total;
    }, 0);
    
    if (onComplete) {
      onComplete(score, questions.length);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeSpent(0);
    setQuizStarted(true);
  };

  // Calculate results
  const score = selectedAnswers.reduce((total, answer, index) => {
    return answer === questions[index].correctAnswer ? total + 1 : total;
  }, 0);

  const percentage = showResults ? Math.round((score / questions.length) * 100) : 0;
  const progress = showResults ? 100 : ((currentQuestion + 1) / questions.length) * 100;

  // Category analysis
  const categoryStats = showResults ? {
    life: { correct: 0, total: 0 },
    health: { correct: 0, total: 0 },
    property: { correct: 0, total: 0 },
    business: { correct: 0, total: 0 },
    risk: { correct: 0, total: 0 },
    planning: { correct: 0, total: 0 }
  } : null;

  if (showResults && categoryStats) {
    questions.forEach((question, index) => {
      const category = question.category;
      categoryStats[category].total++;
      if (selectedAnswers[index] === question.correctAnswer) {
        categoryStats[category].correct++;
      }
    });
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
              Insurance & Risk Management Assessment
            </CardTitle>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${theme.backgrounds.glass} border ${theme.borderColors.primary} mb-6`}>
              <Shield className={`w-5 h-5 ${theme.textColors.primary} mr-2`} />
              <span className={`${theme.textColors.primary}`}>10 Questions • Expert Level</span>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className={`${theme.backgrounds.glass} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
                Assessment Coverage Areas:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Heart, label: 'Life Insurance', color: 'text-red-400' },
                  { icon: Shield, label: 'Health & Disability', color: 'text-blue-400' },
                  { icon: Home, label: 'Property Insurance', color: 'text-green-400' },
                  { icon: DollarSign, label: 'Business Insurance', color: 'text-yellow-400' },
                  { icon: AlertTriangle, label: 'Risk Management', color: 'text-orange-400' },
                  { icon: TrendingUp, label: 'Financial Planning', color: 'text-purple-400' }
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className={`text-sm ${theme.textColors.secondary}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${theme.textColors.secondary} space-y-2`}>
              <p>• Test your understanding of insurance fundamentals</p>
              <p>• Apply risk management strategies to real scenarios</p>
              <p>• Score 80%+ to unlock the next chapter</p>
              <p>• Take your time - there&apos;s no time limit</p>
            </div>

            <Button
              onClick={handleStartQuiz}
              className={`${theme.buttons.primary} text-lg px-8 py-3`}
            >
              <Brain className="w-5 h-5 mr-2" />
              Begin Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
            <CardHeader className="text-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-full mb-4 ${
                percentage >= 80 ? theme.status.success.bg : percentage >= 60 ? theme.status.warning.bg : theme.status.error.bg
              } border ${
                percentage >= 80 ? theme.status.success.border : percentage >= 60 ? theme.status.warning.border : theme.status.error.border
              }`}>
                <Award className={`w-6 h-6 mr-2 ${
                  percentage >= 80 ? theme.status.success.text : percentage >= 60 ? theme.status.warning.text : theme.status.error.text
                }`} />
                <span className={`text-xl font-bold ${
                  percentage >= 80 ? theme.status.success.text : percentage >= 60 ? theme.status.warning.text : theme.status.error.text
                }`}>
                  {percentage}% Score
                </span>
              </div>
              <CardTitle className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                {percentage >= 80 ? '🎉 Excellent Work!' : percentage >= 60 ? '👍 Good Progress!' : '📚 Keep Learning!'}
              </CardTitle>
              <p className={`${theme.textColors.secondary}`}>
                You answered {score} out of {questions.length} questions correctly
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className={`w-4 h-4 ${theme.textColors.secondary}`} />
                  <span className={theme.textColors.secondary}>
                    {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Breakdown */}
              {categoryStats && (
                <div className={`${theme.backgrounds.glass} rounded-lg p-6`}>
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                    <Target className="w-5 h-5" />
                    Performance by Category
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(categoryStats).map(([category, stats]) => {
                      if (stats.total === 0) return null;
                      const categoryPercentage = (stats.correct / stats.total) * 100;
                      const categoryIcons = {
                        life: Heart,
                        health: Shield,
                        property: Home,
                        business: DollarSign,
                        risk: AlertTriangle,
                        planning: TrendingUp
                      };
                      const Icon = categoryIcons[category as keyof typeof categoryIcons];
                      
                      return (
                        <div key={category} className={`${theme.backgrounds.card} rounded-lg p-4`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4 text-blue-400" />
                            <span className={`text-sm font-medium ${theme.textColors.primary} capitalize`}>
                              {category === 'life' ? 'Life Insurance' :
                               category === 'health' ? 'Health & Disability' :
                               category === 'property' ? 'Property' :
                               category === 'business' ? 'Business' :
                               category === 'risk' ? 'Risk Management' : 'Planning'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${
                              categoryPercentage >= 80 ? theme.status.success.text :
                              categoryPercentage >= 60 ? theme.status.warning.text :
                              theme.status.error.text
                            }`}>
                              {Math.round(categoryPercentage)}%
                            </span>
                            <p className={`text-xs ${theme.textColors.secondary}`}>
                              {stats.correct}/{stats.total} correct
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Detailed Results */}
              <div className={`${theme.backgrounds.glass} rounded-lg p-6`}>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                  <FileText className="w-5 h-5" />
                  Detailed Review
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => {
                    const isCorrect = selectedAnswers[index] === question.correctAnswer;
                    const selectedOption = selectedAnswers[index];
                    
                    return (
                      <div key={question.id} className={`border rounded-lg p-4 ${
                        isCorrect ? theme.status.success.border : theme.status.error.border
                      }`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className={`w-5 h-5 ${theme.status.success.text} mt-0.5 flex-shrink-0`} />
                          ) : (
                            <XCircle className={`w-5 h-5 ${theme.status.error.text} mt-0.5 flex-shrink-0`} />
                          )}
                          <div className="flex-1">
                            <p className={`font-medium ${theme.textColors.primary} mb-2`}>
                              {question.question}
                            </p>
                            <div className="space-y-1 mb-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className={`text-sm p-2 rounded ${
                                  optionIndex === question.correctAnswer 
                                    ? theme.status.success.bg
                                    : optionIndex === selectedOption && !isCorrect
                                    ? theme.status.error.bg
                                    : 'transparent'
                                }`}>
                                  <span className={`${
                                    optionIndex === question.correctAnswer
                                      ? theme.status.success.text
                                      : optionIndex === selectedOption && !isCorrect
                                      ? theme.status.error.text
                                      : theme.textColors.secondary
                                  }`}>
                                    {String.fromCharCode(65 + optionIndex)}. {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <p className={`text-sm ${theme.textColors.secondary} italic`}>
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className={theme.buttons.secondary}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                {percentage >= 80 && (
                  <Button
                    onClick={() => window.location.href = '/chapter12'}
                    className={theme.buttons.primary}
                  >
                    Continue to Chapter 12
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>

              {percentage < 80 && (
                <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4`}>
                  <p className={`${theme.status.warning.text} text-center`}>
                    <strong>Need 80% to advance.</strong> Review the insurance lessons and try again!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme.backgrounds.card}`}>
              <Brain className={`w-6 h-6 ${theme.textColors.primary}`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${theme.textColors.primary}`}>
                Insurance Assessment
              </h1>
              <p className={`${theme.textColors.secondary}`}>
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${theme.textColors.secondary}`} />
            <span className={`text-sm ${theme.textColors.secondary}`}>
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${theme.textColors.secondary}`}>Progress</span>
            <span className={`text-sm font-medium ${theme.textColors.primary}`}>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`${theme.backgrounds.card} border ${theme.borderColors.primary}`}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm px-2 py-1 rounded ${theme.backgrounds.glass} ${theme.textColors.primary}`}>
                  {questions[currentQuestion].category.charAt(0).toUpperCase() + questions[currentQuestion].category.slice(1)}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  questions[currentQuestion].difficulty === 'easy' ? theme.status.success.bg :
                  questions[currentQuestion].difficulty === 'medium' ? theme.status.warning.bg :
                  theme.status.error.bg
                } ${
                  questions[currentQuestion].difficulty === 'easy' ? theme.status.success.text :
                  questions[currentQuestion].difficulty === 'medium' ? theme.status.warning.text :
                  theme.status.error.text
                }`}>
                  {questions[currentQuestion].difficulty}
                </span>
              </div>
              <CardTitle className={`text-xl ${theme.textColors.primary}`}>
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? `${theme.backgrounds.glass} border-blue-500 ${theme.textColors.primary}`
                        : `${theme.backgrounds.card} ${theme.borderColors.primary} ${theme.textColors.secondary} hover:border-slate-400 hover:${theme.textColors.primary}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-slate-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          className={theme.buttons.secondary}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion
                  ? 'bg-blue-500'
                  : selectedAnswers[index] !== undefined
                  ? 'bg-green-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className={theme.buttons.primary}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

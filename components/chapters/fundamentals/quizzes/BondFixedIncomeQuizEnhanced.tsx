'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Award,
  RotateCcw
} from 'lucide-react';
import { theme } from '@/lib/theme';

interface Question {
  id: number;
  category: 'fundamentals' | 'types' | 'risk' | 'strategy';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface BondFixedIncomeQuizEnhancedProps {
  onComplete?: (score: number, maxScore: number) => void;
}

export default function BondFixedIncomeQuizEnhanced({ onComplete }: BondFixedIncomeQuizEnhancedProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      category: 'fundamentals',
      difficulty: 'beginner',
      question: "What is the primary relationship between interest rates and bond prices?",
      options: [
        "They move in the same direction",
        "They move in opposite directions", 
        "They are not related",
        "They only relate during recessions"
      ],
      correctAnswer: 1,
      explanation: "Bond prices and interest rates have an inverse relationship. When interest rates rise, existing bond prices fall because new bonds offer higher yields, making existing bonds less attractive."
    },
    {
      id: 2,
      category: 'types',
      difficulty: 'beginner',
      question: "Which type of bond is generally considered the safest investment?",
      options: [
        "Corporate bonds",
        "Municipal bonds",
        "U.S. Treasury bonds",
        "High-yield bonds"
      ],
      correctAnswer: 2,
      explanation: "U.S. Treasury bonds are backed by the full faith and credit of the U.S. government, making them the safest bond investment with essentially no credit risk."
    },
    {
      id: 3,
      category: 'fundamentals',
      difficulty: 'intermediate',
      question: "A bond has a 5% coupon rate and is trading at 95. What is the current yield?",
      options: [
        "5.00%",
        "5.26%",
        "4.75%",
        "Cannot be determined"
      ],
      correctAnswer: 1,
      explanation: "Current yield = Annual coupon payment ÷ Current price. For a $1,000 bond: $50 ÷ $950 = 5.26%. The current yield is higher than the coupon rate when a bond trades below par."
    },
    {
      id: 4,
      category: 'risk',
      difficulty: 'intermediate',
      question: "What does 'duration' measure in bond investing?",
      options: [
        "The time until maturity",
        "The bond's credit quality",
        "Price sensitivity to interest rate changes",
        "The frequency of coupon payments"
      ],
      correctAnswer: 2,
      explanation: "Duration measures a bond's price sensitivity to interest rate changes. A bond with 5-year duration will lose approximately 5% of its value if interest rates rise by 1%."
    },
    {
      id: 5,
      category: 'types',
      difficulty: 'intermediate',
      question: "For a high-income investor in a 37% tax bracket, which bond offers better after-tax returns?",
      options: [
        "4% municipal bond (tax-free)",
        "5.5% corporate bond (taxable)",
        "Both are equivalent",
        "Cannot determine without more information"
      ],
      correctAnswer: 0,
      explanation: "Tax-equivalent yield of corporate bond = 5.5% × (1 - 0.37) = 3.47%. The 4% municipal bond provides better after-tax returns for this high-income investor."
    },
    {
      id: 6,
      category: 'risk',
      difficulty: 'advanced',
      question: "Which bond strategy helps reduce interest rate risk through diversification across time?",
      options: [
        "Concentration strategy",
        "Bond laddering",
        "All-in approach",
        "Credit spread trading"
      ],
      correctAnswer: 1,
      explanation: "Bond laddering involves purchasing bonds with staggered maturity dates, providing regular reinvestment opportunities and reducing the impact of interest rate changes on the overall portfolio."
    },
    {
      id: 7,
      category: 'types',
      difficulty: 'advanced',
      question: "TIPS (Treasury Inflation-Protected Securities) adjust their principal based on:",
      options: [
        "Federal Reserve interest rate changes",
        "Consumer Price Index (CPI)",
        "GDP growth rates",
        "Stock market performance"
      ],
      correctAnswer: 1,
      explanation: "TIPS adjust their principal value based on changes in the Consumer Price Index (CPI), helping protect investors from inflation risk by maintaining purchasing power."
    },
    {
      id: 8,
      category: 'strategy',
      difficulty: 'advanced',
      question: "In a 'barbell' bond strategy, which maturities are typically avoided?",
      options: [
        "Very short-term (1-2 years)",
        "Intermediate-term (5-7 years)",
        "Long-term (20+ years)",
        "All maturities are used equally"
      ],
      correctAnswer: 1,
      explanation: "A barbell strategy combines short-term and long-term bonds while avoiding intermediate maturities. This provides liquidity from short bonds and higher yields from long bonds."
    },
    {
      id: 9,
      category: 'fundamentals',
      difficulty: 'intermediate',
      question: "What happens to a callable bond when interest rates fall significantly?",
      options: [
        "The bond's value increases indefinitely",
        "The issuer may call (redeem) the bond early",
        "The bond automatically converts to stock",
        "Nothing different from non-callable bonds"
      ],
      correctAnswer: 1,
      explanation: "When rates fall, issuers often call bonds early to refinance at lower rates. This limits upside price appreciation and creates reinvestment risk for bondholders."
    },
    {
      id: 10,
      category: 'strategy',
      difficulty: 'advanced',
      question: "For a retiree seeking steady income with inflation protection, the optimal bond allocation might include:",
      options: [
        "100% long-term Treasury bonds",
        "A mix of TIPS, high-grade corporates, and Treasury ladders",
        "Only high-yield corporate bonds",
        "Exclusively municipal bonds"
      ],
      correctAnswer: 1,
      explanation: "A diversified approach with TIPS for inflation protection, high-grade corporates for yield enhancement, and Treasury ladders for steady income provides optimal risk-adjusted returns for retirement income."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getScorePercentage = () => {
    return Math.round((calculateScore() / questions.length) * 100);
  };

  const getCategoryBreakdown = () => {
    const categories = {
      fundamentals: { correct: 0, total: 0 },
      types: { correct: 0, total: 0 },
      risk: { correct: 0, total: 0 },
      strategy: { correct: 0, total: 0 }
    };

    questions.forEach((question, index) => {
      categories[question.category].total++;
      if (selectedAnswers[index] === question.correctAnswer) {
        categories[question.category].correct++;
      }
    });

    return categories;
  };

  const handleComplete = () => {
    setQuizCompleted(true);
    if (onComplete) {
      onComplete(calculateScore(), questions.length);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const categoryBreakdown = getCategoryBreakdown();
    const passed = percentage >= 80;

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`${passed ? theme.status.success.bg : theme.status.error.bg}/10 border-2 ${passed ? theme.status.success.border : theme.status.error.border}`}>
            <CardHeader className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? theme.status.success.bg : theme.status.error.bg}`}>
                {passed ? (
                  <Award className={`w-10 h-10 ${theme.status.success.text}`} />
                ) : (
                  <AlertTriangle className={`w-10 h-10 ${theme.status.error.text}`} />
                )}
              </div>
              <CardTitle className={`text-2xl ${theme.textColors.primary}`}>
                {passed ? "Congratulations! 🎉" : "Keep Learning! 📚"}
              </CardTitle>
              <CardDescription className="text-lg">
                You scored {score} out of {questions.length} ({percentage}%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${passed ? theme.status.success.text : theme.status.error.text}`}>
                  {percentage}%
                </div>
                <p className={theme.textColors.secondary}>
                  {passed 
                    ? "Excellent work! You've mastered bond and fixed income investing fundamentals."
                    : "You need 80% to pass. Review the material and try again!"
                  }
                </p>
              </div>

              {/* Category Breakdown */}
              <div>
                <h3 className={`font-semibold ${theme.textColors.primary} mb-4`}>Performance by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(categoryBreakdown).map(([category, stats]) => {
                    const categoryPercentage = Math.round((stats.correct / stats.total) * 100);
                    const categoryPassed = categoryPercentage >= 70;
                    
                    return (
                      <div key={category} className={`p-4 rounded-lg border ${categoryPassed ? theme.status.success.border : theme.status.warning.border} ${categoryPassed ? theme.status.success.bg : theme.status.warning.bg}/10`}>
                        <div className="text-center">
                          <div className={`text-xl font-bold ${categoryPassed ? theme.status.success.text : theme.status.warning.text}`}>
                            {categoryPercentage}%
                          </div>
                          <div className={`text-sm ${theme.textColors.secondary} capitalize`}>
                            {category}
                          </div>
                          <div className={`text-xs ${theme.textColors.secondary}`}>
                            {stats.correct}/{stats.total}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Results */}
              <div>
                <h3 className={`font-semibold ${theme.textColors.primary} mb-4`}>Question Review</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div key={question.id} className={`p-4 rounded-lg border ${isCorrect ? theme.status.success.border : theme.status.error.border} ${isCorrect ? theme.status.success.bg : theme.status.error.bg}/10`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? theme.status.success.bg : theme.status.error.bg}`}>
                            {isCorrect ? (
                              <CheckCircle className={`w-4 h-4 ${theme.status.success.text}`} />
                            ) : (
                              <XCircle className={`w-4 h-4 ${theme.status.error.text}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${theme.textColors.primary} mb-1`}>
                              Question {index + 1}: {question.question}
                            </p>
                            <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                              <span className="font-medium">Your answer:</span> {question.options[userAnswer]} 
                              {!isCorrect && (
                                <>
                                  <br />
                                  <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                                </>
                              )}
                            </p>
                            <p className={`text-sm ${theme.textColors.secondary}`}>
                              {question.explanation}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {question.category} • {question.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </Button>
                {passed && !quizCompleted && (
                  <Button
                    onClick={handleComplete}
                    className={theme.buttons.primary}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Complete Chapter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`${theme.typography.heading1} ${theme.textColors.primary}`}>
            Bond & Fixed Income Quiz
          </h1>
          <p className={`${theme.typography.body} ${theme.textColors.secondary}`}>
            Test your understanding of bonds, interest rates, and fixed income strategies
          </p>
        </motion.div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{currentQuestion + 1} of {questions.length}</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentQ.category === 'fundamentals' ? 'bg-blue-100 text-blue-600' :
                  currentQ.category === 'types' ? 'bg-green-100 text-green-600' :
                  currentQ.category === 'risk' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {currentQ.category === 'fundamentals' ? <Shield className="w-5 h-5" /> :
                   currentQ.category === 'types' ? <Target className="w-5 h-5" /> :
                   currentQ.category === 'risk' ? <AlertTriangle className="w-5 h-5" /> :
                   <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <CardTitle className={`${theme.textColors.primary} text-lg`}>
                    Question {currentQuestion + 1}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {currentQ.category}
                    </Badge>
                    <Badge 
                      variant={currentQ.difficulty === 'advanced' ? 'destructive' : currentQ.difficulty === 'intermediate' ? 'default' : 'secondary'} 
                      className="text-xs capitalize"
                    >
                      {currentQ.difficulty}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className={`text-lg font-medium ${theme.textColors.primary} mb-6`}>
                {currentQ.question}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? `${theme.status.info.border} ${theme.status.info.bg}/20 ${theme.status.info.text}`
                        : `${theme.borderColors.primary} hover:${theme.status.info.border} ${theme.textColors.secondary} hover:${theme.status.info.text}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? `${theme.status.info.border} ${theme.status.info.bg}`
                          : theme.borderColors.primary
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <CheckCircle className={`w-4 h-4 ${theme.status.info.text}`} />
                        )}
                      </div>
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <div className={`text-sm ${theme.textColors.secondary}`}>
                Question {currentQuestion + 1} of {questions.length}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className={currentQuestion === questions.length - 1 ? theme.buttons.primary : ''}
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import { CheckCircle, X, RotateCcw, Target, Award, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdvancedTaxStrategiesQuizProps {
  onComplete: (score: number, maxScore: number, categoryScores: Record<string, { correct: number; total: number }>) => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'tax-loss-harvesting' | 'asset-location' | 'roth-conversions' | 'business-strategies' | 'estate-planning' | 'state-optimization';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'tax-loss-1',
    category: 'tax-loss-harvesting',
    difficulty: 'intermediate',
    question: 'You have $10,000 in capital gains and $15,000 in capital losses this year. How much can you deduct against ordinary income?',
    options: [
      '$0 - losses only offset gains',
      '$3,000 - maximum deduction limit',
      '$5,000 - the net loss amount', 
      '$15,000 - total losses available'
    ],
    correctAnswer: 1,
    explanation: 'You can offset the full $10,000 in gains, leaving $5,000 in net losses. The IRS allows up to $3,000 in net capital losses to be deducted against ordinary income annually, with the remaining $2,000 carried forward to future years.'
  },
  {
    id: 'wash-sale-1',
    category: 'tax-loss-harvesting',
    difficulty: 'advanced',
    question: 'To avoid wash sale rules when tax-loss harvesting, you must avoid buying substantially identical securities for how long?',
    options: [
      '30 days after the sale',
      '30 days before or after the sale',
      '31 days before or after the sale',
      '60 days total around the sale'
    ],
    correctAnswer: 2,
    explanation: 'The wash sale rule applies to 31 days before AND 31 days after the sale (61 days total). You cannot buy substantially identical securities during this entire period, or you\'ll lose the tax loss benefit.'
  },
  {
    id: 'asset-location-1',
    category: 'asset-location',
    difficulty: 'intermediate',
    question: 'Which investment is BEST suited for a taxable account based on tax efficiency?',
    options: [
      'Corporate bond fund yielding 5%',
      'REIT fund with 4% dividend yield',
      'Broad market index fund',
      'Actively managed international fund'
    ],
    correctAnswer: 2,
    explanation: 'Broad market index funds are tax-efficient due to low turnover and qualified dividend treatment. Bonds and REITs generate ordinary income taxed at higher rates, while active funds create taxable events through frequent trading.'
  },
  {
    id: 'municipal-bonds-1',
    category: 'asset-location',
    difficulty: 'advanced',
    question: 'A municipal bond yielding 3.5% is equivalent to what taxable yield for someone in the 32% federal tax bracket?',
    options: [
      '4.6%',
      '5.1%',
      '5.9%',
      '6.2%'
    ],
    correctAnswer: 1,
    explanation: 'Tax-equivalent yield = Municipal yield ÷ (1 - Tax rate) = 3.5% ÷ (1 - 0.32) = 3.5% ÷ 0.68 = 5.15%. Municipal bonds become more attractive as tax brackets increase.'
  },
  {
    id: 'roth-conversion-1',
    category: 'roth-conversions',
    difficulty: 'intermediate',
    question: 'When is a Roth conversion most beneficial from a tax perspective?',
    options: [
      'During high-income years to reduce current taxes',
      'During low-income years to pay lower tax rates',
      'Only when markets are at all-time highs',
      'When you expect tax rates to decrease'
    ],
    correctAnswer: 1,
    explanation: 'Roth conversions are most beneficial during low-income years (job loss, sabbatical, early retirement) when you can pay lower tax rates now to secure tax-free growth and withdrawals in the future.'
  },
  {
    id: 'conversion-taxes-1',
    category: 'roth-conversions',
    difficulty: 'advanced',
    question: 'What is the BEST practice for paying taxes on a Roth conversion?',
    options: [
      'Use funds from the converted account',
      'Withhold taxes from the conversion',
      'Pay with separate cash/taxable investments',
      'Finance with a loan to preserve capital'
    ],
    correctAnswer: 2,
    explanation: 'Pay conversion taxes with separate funds (cash or taxable investments) to maximize the amount converted and avoid early withdrawal penalties. Using retirement funds to pay taxes reduces the conversion benefit.'
  },
  {
    id: 'business-entity-1',
    category: 'business-strategies',
    difficulty: 'intermediate',
    question: 'At what annual profit level does S-Corp election typically become beneficial for self-employment tax savings?',
    options: [
      '$30,000',
      '$45,000',
      '$60,000',
      '$100,000'
    ],
    correctAnswer: 2,
    explanation: 'S-Corp election typically becomes beneficial around $60,000+ in annual profit. The self-employment tax savings (15.3% on profit above reasonable salary) must exceed the additional compliance costs and complexity.'
  },
  {
    id: 'solo-401k-1',
    category: 'business-strategies',
    difficulty: 'advanced',
    question: 'What is the maximum Solo 401(k) contribution for 2024 for a business owner earning $150,000 in self-employment income?',
    options: [
      '$23,000',
      '$46,000',
      '$69,000',
      '$92,000'
    ],
    correctAnswer: 2,
    explanation: 'Solo 401(k) allows $23,000 employee deferral + 25% of compensation as employer contribution. For self-employed: $150,000 × 25% = $37,500, but limited by net self-employment income calculations. Maximum for 2024 is typically around $69,000.'
  },
  {
    id: 'estate-gifting-1',
    category: 'estate-planning',
    difficulty: 'intermediate',
    question: 'What is the annual gift tax exclusion amount per recipient for 2024?',
    options: [
      '$15,000',
      '$17,000',
      '$18,000',
      '$20,000'
    ],
    correctAnswer: 2,
    explanation: 'The annual gift tax exclusion for 2024 is $18,000 per recipient. A married couple can gift $36,000 per recipient ($18,000 each) without using lifetime exemption or filing gift tax returns.'
  },
  {
    id: 'state-tax-1',
    category: 'state-optimization',
    difficulty: 'advanced',
    question: 'Which factor is MOST important for establishing state residency for tax purposes?',
    options: [
      'Owning property in the state',
      'Having a state driver\'s license',
      'Spending more than 183 days in the state',
      'Demonstrating intent through multiple factors'
    ],
    correctAnswer: 3,
    explanation: 'State residency requires demonstrating intent through multiple factors: driver\'s license, voter registration, bank accounts, property ownership, time spent, and business ties. No single factor is determinative - it\'s the totality of circumstances.'
  }
];

export default function AdvancedTaxStrategiesQuiz({ onComplete }: AdvancedTaxStrategiesQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = () => {
    setShowResults(true);

    // Calculate scores
    const { totalScore, categoryScores } = calculateScores();
    const maxScore = quizQuestions.length;
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Show completion message
    if (percentage >= 80) {
      toast.success(`Quiz completed! Score: ${percentage}% - Advanced tax strategies mastered! 🏆`, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.error(`Quiz completed! Score: ${percentage}% - Review the material and try again.`, {
        duration: 4000,
        position: 'top-center',
      });
    }

    onComplete(totalScore, maxScore, categoryScores);
  };

  const calculateScores = () => {
    let totalScore = 0;
    const categoryScores: Record<string, { correct: number; total: number }> = {};

    // Initialize category scores
    const categories = [...new Set(quizQuestions.map(q => q.category))];
    categories.forEach(category => {
      categoryScores[category] = { correct: 0, total: 0 };
    });

    // Calculate scores
    quizQuestions.forEach(question => {
      const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
      if (isCorrect) {
        totalScore++;
        categoryScores[question.category].correct++;
      }
      categoryScores[question.category].total++;
    });

    return { totalScore, categoryScores };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const currentQ = quizQuestions[currentQuestion];
  const isAnswered = selectedAnswers[currentQ?.id] !== undefined;
  const { totalScore, categoryScores } = calculateScores();
  const percentage = Math.round((totalScore / quizQuestions.length) * 100);

  const categoryNames: Record<string, string> = {
    'tax-loss-harvesting': 'Tax-Loss Harvesting',
    'asset-location': 'Asset Location',
    'roth-conversions': 'Roth Conversions',
    'business-strategies': 'Business Strategies',
    'estate-planning': 'Estate Planning',
    'state-optimization': 'State Optimization'
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <GradientCard variant="glass" gradient="blue" className="p-8">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 ${percentage >= 80 ? theme.status.success.bg : theme.status.error.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {percentage >= 80 ? (
                <Award className={`w-10 h-10 ${theme.status.success.text}`} />
              ) : (
                <AlertTriangle className={`w-10 h-10 ${theme.status.error.text}`} />
              )}
            </div>
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
              Quiz Results
            </h2>
            <p className={`text-6xl font-bold ${percentage >= 80 ? theme.status.success.text : theme.status.error.text} mb-4`}>
              {percentage}%
            </p>
            <p className={`${theme.textColors.secondary} text-lg`}>
              {totalScore} out of {quizQuestions.length} questions correct
            </p>
            {percentage >= 80 ? (
              <p className={`${theme.status.success.text} font-semibold mt-2`}>
                Outstanding! You&apos;ve mastered advanced tax strategies! 🎉
              </p>
            ) : (
              <p className={`${theme.status.error.text} font-semibold mt-2`}>
                Review the material and try again. 80% required to pass.
              </p>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 text-center`}>
              Performance by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryScores).map(([category, scores]) => {
                const categoryPercentage = Math.round((scores.correct / scores.total) * 100);
                return (
                  <div key={category} className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      {categoryNames[category]}
                    </h4>
                    <div className={`text-2xl font-bold ${categoryPercentage >= 80 ? theme.status.success.text : theme.status.error.text}`}>
                      {categoryPercentage}%
                    </div>
                    <p className={`text-sm ${theme.textColors.muted}`}>
                      {scores.correct}/{scores.total} correct
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Review */}
          <div className="mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
              Question Review
            </h3>
            <div className="space-y-4">
              {quizQuestions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`p-4 border rounded-lg ${
                    isCorrect ? theme.status.success.border : theme.status.error.border
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-semibold ${theme.textColors.primary} flex-1 mr-4`}>
                        {index + 1}. {question.question}
                      </h4>
                      {isCorrect ? (
                        <CheckCircle className={`w-6 h-6 ${theme.status.success.text} flex-shrink-0`} />
                      ) : (
                        <X className={`w-6 h-6 ${theme.status.error.text} flex-shrink-0`} />
                      )}
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={`text-sm p-2 rounded ${
                          optionIndex === question.correctAnswer
                            ? theme.status.success.bg
                            : optionIndex === userAnswer && !isCorrect
                            ? theme.status.error.bg
                            : `${theme.backgrounds.card} opacity-60`
                        }`}>
                          <span className="font-medium">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span> {option}
                          {optionIndex === question.correctAnswer && (
                            <span className={`ml-2 ${theme.status.success.text} font-semibold`}>✓ Correct</span>
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <span className={`ml-2 ${theme.status.error.text} font-semibold`}>✗ Your Answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className={`text-sm ${theme.textColors.secondary} bg-slate-800/50 p-3 rounded`}>
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetQuiz}
              className={`flex items-center px-6 py-3 border-2 ${theme.borderColors.primary} ${theme.textColors.primary} rounded-xl hover:${theme.backgrounds.card} transition-all`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </button>
          </div>
        </GradientCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <GradientCard variant="glass" gradient="blue" className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Target className={`w-8 h-8 ${theme.status.info.text}`} />
          </div>
          <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
            Advanced Tax Strategies Quiz
          </h1>
          <p className={`${theme.textColors.secondary} mb-4`}>
            Test your knowledge of sophisticated tax optimization strategies
          </p>
          <div className={`${theme.textColors.muted} text-sm`}>
            Question {currentQuestion + 1} of {quizQuestions.length} • Need 80% to pass
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full bg-slate-800/50 rounded-full h-3 mb-8`}>
          <div
            className={`h-3 ${theme.status.info.bg} rounded-full transition-all duration-300`}
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 ${theme.status.info.bg} ${theme.status.info.text} rounded-full text-sm font-medium`}>
              {categoryNames[currentQ.category]}
            </span>
            <span className={`px-3 py-1 ${theme.backgrounds.card} ${theme.textColors.muted} rounded-full text-sm`}>
              {currentQ.difficulty}
            </span>
          </div>
          
          <h2 className={`text-xl font-bold ${theme.textColors.primary} mb-6`}>
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full p-4 text-left border-2 rounded-xl transition-all hover-lift ${
                  selectedAnswers[currentQ.id] === index
                    ? `${theme.status.info.border} ${theme.status.info.bg}`
                    : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold ${
                    selectedAnswers[currentQ.id] === index
                      ? `${theme.status.info.border} ${theme.status.info.text}`
                      : theme.borderColors.muted
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={theme.textColors.primary}>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 border-2 ${theme.borderColors.muted} ${theme.textColors.secondary} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:${theme.borderColors.primary} hover:${theme.textColors.primary} transition-all`}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {quizQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? theme.status.info.bg
                    : selectedAnswers[quizQuestions[index].id] !== undefined
                    ? theme.status.success.bg
                    : 'bg-slate-800/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`px-6 py-3 ${theme.buttons.primary} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-lift`}
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>

        {/* Answer Indicator */}
        {isAnswered && (
          <div className={`mt-6 p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
            <div className="flex items-center">
              <CheckCircle className={`w-5 h-5 ${theme.status.success.text} mr-2`} />
              <span className={`${theme.status.success.text} font-medium`}>
                Answer selected: {String.fromCharCode(65 + selectedAnswers[currentQ.id])}. {currentQ.options[selectedAnswers[currentQ.id]]}
              </span>
            </div>
          </div>
        )}
      </GradientCard>
    </div>
  );
}

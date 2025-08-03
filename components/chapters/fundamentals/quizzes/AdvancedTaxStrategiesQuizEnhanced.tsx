'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  AlertCircle,
  Calculator,
  Award,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdvancedTaxStrategiesQuizProps {
  onComplete?: (score: number, totalQuestions: number, categoryScores: CategoryScore[]) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'Tax-Loss Harvesting' | 'Asset Location' | 'Roth Conversions' | 'Business Optimization' | 'Estate Planning' | 'State Tax Strategy';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface CategoryScore {
  category: string;
  score: number;
  total: number;
  percentage: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the maximum amount of net capital losses you can deduct against ordinary income per year?",
    options: [
      "$1,500 annually",
      "$3,000 annually with unlimited carryforward",
      "$5,000 annually with 5-year carryforward",
      "No limit on capital loss deductions"
    ],
    correctAnswer: 1,
    explanation: "You can deduct up to $3,000 in net capital losses against ordinary income annually. Any excess losses carry forward indefinitely to future years, making tax-loss harvesting a powerful long-term strategy.",
    category: "Tax-Loss Harvesting",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which investment type should generally be placed in tax-advantaged accounts for optimal asset location?",
    options: [
      "Broad market index funds with low turnover",
      "Individual stocks held for long-term growth",
      "REITs and bond funds generating regular income",
      "Municipal bonds for high-income earners"
    ],
    correctAnswer: 2,
    explanation: "REITs and bond funds generate regular taxable income and should be placed in tax-advantaged accounts. Tax-efficient investments like index funds work better in taxable accounts where you can harvest losses and benefit from preferential capital gains rates.",
    category: "Asset Location",
    difficulty: "medium"
  },
  {
    id: 3,
    question: "When is a Roth conversion most advantageous?",
    options: [
      "During high-income years to reduce current taxes",
      "During low-income years or market downturns",
      "Only when you're in the highest tax bracket",
      "Never - traditional retirement accounts are always better"
    ],
    correctAnswer: 1,
    explanation: "Roth conversions are most powerful during low-income years (early retirement, job loss, sabbatical) or market downturns when account values are depressed. This allows you to pay taxes at lower rates now to secure tax-free growth forever.",
    category: "Roth Conversions",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "At approximately what annual business profit level does S-Corp election typically become beneficial for self-employment tax savings?",
    options: [
      "$25,000 annual profit",
      "$40,000 annual profit", 
      "$60,000 annual profit",
      "$100,000 annual profit"
    ],
    correctAnswer: 2,
    explanation: "S-Corp election typically becomes beneficial around $60,000+ in annual business profit. Below this level, the additional compliance costs and reasonable salary requirements often outweigh the self-employment tax savings of ~$1,800-2,000 annually.",
    category: "Business Optimization",
    difficulty: "hard"
  },
  {
    id: 5,
    question: "What is the 2024 annual gift tax exclusion amount per recipient?",
    options: [
      "$15,000 per recipient",
      "$17,000 per recipient",
      "$18,000 per recipient", 
      "$20,000 per recipient"
    ],
    correctAnswer: 2,
    explanation: "The 2024 annual gift tax exclusion is $18,000 per recipient. This means a married couple can gift $36,000 per recipient annually without using their lifetime exemption, making it a powerful estate planning tool for wealthy families.",
    category: "Estate Planning",
    difficulty: "easy"
  },
  {
    id: 6,
    question: "Which states have NO state income tax? (Select the complete list)",
    options: [
      "Florida, Texas, Nevada, Wyoming",
      "Florida, Texas, Nevada, Wyoming, Washington, Tennessee, Alaska",
      "Florida, Texas, California, New York",
      "Only Florida and Texas"
    ],
    correctAnswer: 1,
    explanation: "Seven states have no state income tax: Florida, Nevada, Tennessee, Texas, Washington, Wyoming, and Alaska. This creates significant tax arbitrage opportunities, especially for high earners who can save $20,000-50,000+ annually by establishing residency in these states.",
    category: "State Tax Strategy",
    difficulty: "medium"
  },
  {
    id: 7,
    question: "What is the 'wash sale rule' and its time restriction?",
    options: [
      "Cannot sell same stock twice in one year",
      "Cannot buy substantially identical security 15 days before/after sale",
      "Cannot buy substantially identical security 30 days before/after sale",
      "Cannot harvest losses in December"
    ],
    correctAnswer: 2,
    explanation: "The wash sale rule prevents claiming a tax loss if you buy substantially identical security within 30 days before or after the sale (61-day total window). This prevents artificial loss generation while maintaining the same investment position.",
    category: "Tax-Loss Harvesting",
    difficulty: "medium"
  },
  {
    id: 8,
    question: "For high earners in California (13.3% top rate), what is a municipal bond fund yielding 4% tax-free equivalent to in taxable bonds?",
    options: [
      "5.2% taxable equivalent",
      "6.1% taxable equivalent",
      "7.4% taxable equivalent",
      "8.3% taxable equivalent"
    ],
    correctAnswer: 2,
    explanation: "Tax-free yield ÷ (1 - tax rate) = 4% ÷ (1 - 0.463) = 7.4% taxable equivalent. High earners in states like CA face combined federal + state rates of 46%+, making municipal bonds very attractive for the tax-inefficient portion of their portfolio.",
    category: "Asset Location",
    difficulty: "hard"
  },
  {
    id: 9,
    question: "What is the maximum annual contribution to a Solo 401(k) for 2024?",
    options: [
      "$23,000 (same as regular 401k)",
      "$46,000 (double employee contribution)",
      "$69,000 ($23k employee + $46k employer)",
      "$76,500 (with catch-up if over 50)"
    ],
    correctAnswer: 2,
    explanation: "Solo 401(k) allows $23,000 employee contribution plus up to 25% of compensation as employer contribution, totaling $69,000 for 2024 ($76,500 if over 50). This is one of the most powerful retirement savings tools for business owners and self-employed individuals.",
    category: "Business Optimization",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "What is the lifetime estate tax exemption for 2024, and when is it scheduled to change?",
    options: [
      "$5.5M, permanent through 2030",
      "$11.2M, sunsetting in 2025", 
      "$13.6M, sunsetting in 2026",
      "$15M, increasing with inflation indefinitely"
    ],
    correctAnswer: 2,
    explanation: "The 2024 estate tax exemption is $13.61M per individual, but it's scheduled to sunset in 2026, potentially dropping to ~$7M. This creates urgency for estate planning strategies like gifting and trust planning for high-net-worth families before the window closes.",
    category: "Estate Planning",
    difficulty: "hard"
  }
];

export default function AdvancedTaxStrategiesQuizEnhanced({ onComplete }: AdvancedTaxStrategiesQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const { recordQuizScore } = useProgressStore();

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast.success('Correct! Great tax knowledge! 💰', {
        duration: 2000,
        position: 'top-center',
      });
    } else {
      toast.error('Not quite right. Check the explanation! 📚', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    
    // Calculate category scores
    const categoryScores = calculateCategoryScores();
    
    // Record the quiz completion
    recordQuizScore('advanced-tax-strategies-enhanced-quiz', score, quizQuestions.length);
    
    // Call onComplete with results
    onComplete?.(score, quizQuestions.length, categoryScores);
    
    if (score >= 8) {
      toast.success(`Outstanding! ${score}/${quizQuestions.length} - You're a tax optimization master! 🏆`, {
        duration: 4000,
        position: 'top-center',
      });
    } else if (score >= 6) {
      toast.success(`Good work! ${score}/${quizQuestions.length} - Solid tax knowledge! 📈`, {
        duration: 3000,
        position: 'top-center',
      });
    } else {
      toast.error(`${score}/${quizQuestions.length} - Review the material and try again! 📖`, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const calculateCategoryScores = (): CategoryScore[] => {
    const categories = [...new Set(quizQuestions.map(q => q.category))];
    
    return categories.map(category => {
      const categoryQuestions = quizQuestions.filter(q => q.category === category);
      const categoryAnswers = categoryQuestions.map(q => {
        const answerIndex = answers[quizQuestions.indexOf(q)];
        return answerIndex === q.correctAnswer ? 1 : 0;
      });
      
      const categoryScore = categoryAnswers.reduce((sum: number, score: number) => sum + score, 0);
      
      return {
        category,
        score: categoryScore,
        total: categoryQuestions.length,
        percentage: (categoryScore / categoryQuestions.length) * 100
      };
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers(new Array(quizQuestions.length).fill(null));
  };

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    const categoryScores = calculateCategoryScores();
    const percentage = (score / quizQuestions.length) * 100;
    const passed = score >= 8; // 80% passing threshold

    return (
      <div className="max-w-4xl mx-auto">
        <GradientCard variant="glass" gradient={passed ? "green" : "red"} className="p-8 text-center">
          <div className={`w-20 h-20 ${passed ? theme.status.success.bg : theme.status.warning.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {passed ? (
              <Trophy className={`w-10 h-10 ${theme.status.success.text}`} />
            ) : (
              <AlertCircle className={`w-10 h-10 ${theme.status.warning.text}`} />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            {passed ? 'Tax Optimization Mastery Achieved!' : 'Keep Learning Tax Strategies!'}
          </h2>
          
          <div className={`text-6xl font-bold ${passed ? theme.status.success.text : theme.status.warning.text} mb-4`}>
            {score}/{quizQuestions.length}
          </div>
          
          <p className={`text-xl ${theme.textColors.secondary} mb-8`}>
            {percentage.toFixed(0)}% Score - {passed ? 'Advanced tax strategist level!' : 'Review the concepts and try again!'}
          </p>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {categoryScores.map((category, index) => (
              <GradientCard key={index} variant="glass" gradient="blue" className="p-4">
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2 text-sm`}>{category.category}</h4>
                <div className={`text-2xl font-bold ${category.percentage >= 80 ? theme.status.success.text : theme.status.warning.text}`}>
                  {category.score}/{category.total}
                </div>
                <p className={`text-xs ${theme.textColors.muted}`}>{category.percentage.toFixed(0)}%</p>
              </GradientCard>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className={`flex items-center px-6 py-3 ${theme.status.warning.bg} ${theme.status.warning.text} rounded-xl hover:opacity-90 transition-all`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </button>
            
            {passed && (
              <button
                onClick={() => onComplete?.(score, quizQuestions.length, categoryScores)}
                className={`flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift`}
              >
                <Award className="w-5 h-5 mr-2" />
                Continue to Next Chapter
              </button>
            )}
          </div>
        </GradientCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`w-16 h-16 ${theme.status.info.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <Calculator className={`w-8 h-8 ${theme.status.info.text}`} />
        </div>
        <h1 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
          Advanced Tax Strategies Quiz
        </h1>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Test your knowledge of sophisticated tax optimization strategies and wealth preservation techniques.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className={`text-sm font-medium ${theme.textColors.secondary}`}>
            Score: {score}/{quizQuestions.length}
          </span>
        </div>
        <div className={`w-full bg-slate-800/50 rounded-full h-3`}>
          <div
            className={`h-3 ${theme.status.info.bg} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <GradientCard variant="glass" gradient="blue" className="p-8 mb-6">
        <div className="flex items-start mb-6">
          <div className={`w-10 h-10 ${theme.status.info.bg} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
            <span className={`font-bold ${theme.status.info.text}`}>{currentQuestion + 1}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <span className={`text-xs px-2 py-1 ${theme.status.warning.bg} ${theme.status.warning.text} rounded-full mr-2`}>
                {currentQ.category}
              </span>
              <span className={`text-xs px-2 py-1 ${
                currentQ.difficulty === 'easy' ? theme.status.success.bg :
                currentQ.difficulty === 'medium' ? theme.status.warning.bg :
                theme.status.error.bg
              } rounded-full`}>
                {currentQ.difficulty}
              </span>
            </div>
            <h2 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
              {currentQ.question}
            </h2>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQ.correctAnswer;
            const showResult = isAnswered;
            
            let buttonClass = `w-full p-4 text-left rounded-xl border-2 transition-all ${theme.textColors.primary}`;
            
            if (!showResult) {
              buttonClass += ` ${theme.borderColors.muted} hover:${theme.borderColors.primary} hover:${theme.backgrounds.glass}`;
            } else if (isCorrect) {
              buttonClass += ` ${theme.status.success.border} ${theme.status.success.bg}`;
            } else if (isSelected && !isCorrect) {
              buttonClass += ` ${theme.status.error.border} ${theme.status.error.bg}`;
            } else {
              buttonClass += ` ${theme.borderColors.muted} opacity-50`;
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className={`w-5 h-5 ${theme.status.success.text} ml-2`} />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className={`w-5 h-5 ${theme.status.error.text} ml-2`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={`p-6 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg mb-6`}>
            <h3 className={`font-semibold ${theme.status.info.text} mb-2 flex items-center`}>
              <Target className="w-5 h-5 mr-2" />
              Explanation
            </h3>
            <p className={`${theme.textColors.secondary} leading-relaxed`}>
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="text-center">
            <button
              onClick={nextQuestion}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center mx-auto`}
            >
              {currentQuestion === quizQuestions.length - 1 ? (
                <>
                  <Trophy className="w-5 h-5 mr-2" />
                  View Results
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </GradientCard>

      {/* Question Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {quizQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion
                  ? theme.status.info.bg
                  : answers[index] !== null
                  ? answers[index] === quizQuestions[index].correctAnswer
                    ? theme.status.success.bg
                    : theme.status.error.bg
                  : 'bg-slate-800/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

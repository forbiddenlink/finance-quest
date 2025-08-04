'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy, RotateCcw, FileText } from 'lucide-react';
import { theme } from '@/lib/theme';

interface EstatePlanningQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the federal estate tax exemption for 2024?",
    options: [
      "$5.49 million",
      "$11.7 million", 
      "$13.61 million",
      "$18.0 million"
    ],
    correctAnswer: 2,
    explanation: "The 2024 federal estate tax exemption is $13.61 million per person, with portability allowing spouses to combine exemptions for up to $27.22 million.",
    category: "Tax Planning"
  },
  {
    id: 2,
    question: "Which type of trust allows the grantor to retain control and make changes?",
    options: [
      "Irrevocable trust",
      "Revocable trust",
      "Charitable remainder trust",
      "Generation-skipping trust"
    ],
    correctAnswer: 1,
    explanation: "A revocable trust (also called a living trust) allows the grantor to maintain control and make changes during their lifetime, but provides no estate tax benefits.",
    category: "Trust Structures"
  },
  {
    id: 3,
    question: "What is the 2024 annual gift tax exclusion per recipient?",
    options: [
      "$15,000",
      "$16,000",
      "$17,000", 
      "$18,000"
    ],
    correctAnswer: 3,
    explanation: "The 2024 annual gift tax exclusion is $18,000 per recipient. This means you can give up to $18,000 to any number of people without using your lifetime exemption.",
    category: "Tax Planning"
  },
  {
    id: 4,
    question: "What percentage of family businesses survive to the third generation?",
    options: [
      "12%",
      "30%",
      "45%",
      "60%"
    ],
    correctAnswer: 0,
    explanation: "Only 12% of family businesses survive to the third generation, highlighting the critical importance of proper succession planning and estate strategies.",
    category: "Wealth Transfer"
  },
  {
    id: 5,
    question: "Which document is most important for avoiding probate?",
    options: [
      "Will",
      "Power of attorney",
      "Revocable trust",
      "Beneficiary designation"
    ],
    correctAnswer: 2,
    explanation: "A revocable trust is the most comprehensive tool for avoiding probate, as assets held in the trust pass directly to beneficiaries without court involvement.",
    category: "Estate Planning"
  },
  {
    id: 6,
    question: "What is the primary benefit of an irrevocable trust?",
    options: [
      "Maintaining control over assets",
      "Avoiding probate costs",
      "Reducing estate taxes",
      "Simplifying asset management"
    ],
    correctAnswer: 2,
    explanation: "The primary benefit of an irrevocable trust is reducing estate taxes by removing assets from your taxable estate, though you give up control over those assets.",
    category: "Trust Structures"
  },
  {
    id: 7,
    question: "What does 'portability' mean in estate tax planning?",
    options: [
      "Moving assets between states",
      "Transferring trust assets",
      "Spouses can combine exemptions",
      "Converting retirement accounts"
    ],
    correctAnswer: 2,
    explanation: "Portability allows a surviving spouse to use their deceased spouse's unused estate tax exemption, effectively doubling the exemption amount for the family.",
    category: "Tax Planning"
  },
  {
    id: 8,
    question: "Which strategy is most effective for valuation discounts?",
    options: [
      "Charitable remainder trusts",
      "Family limited partnerships",
      "Revocable trusts", 
      "529 education plans"
    ],
    correctAnswer: 1,
    explanation: "Family limited partnerships (FLPs) can provide significant valuation discounts due to lack of marketability and minority interest discounts when transferring interests to family members.",
    category: "Wealth Transfer"
  },
  {
    id: 9,
    question: "What is a QTIP trust primarily used for?",
    options: [
      "Charitable giving",
      "Business succession",
      "Spouse protection with control",
      "Generation-skipping transfers"
    ],
    correctAnswer: 2,
    explanation: "A QTIP (Qualified Terminal Interest Property) trust provides income to a surviving spouse while allowing the first spouse to control ultimate distribution of assets, often used in blended families.",
    category: "Trust Structures"
  },
  {
    id: 10,
    question: "When should estate planning documents be reviewed?",
    options: [
      "Every 10 years",
      "Only when tax laws change",
      "At major life events and annually",
      "Never, once properly executed"
    ],
    correctAnswer: 2,
    explanation: "Estate plans should be reviewed annually and whenever major life events occur (marriage, divorce, births, deaths, significant wealth changes) to ensure they remain current and effective.",
    category: "Estate Planning"
  }
];

const EstatePlanningQuiz: React.FC<EstatePlanningQuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
    onComplete?.(correctCount, questions.length);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Outstanding! You have excellent knowledge of estate planning principles.";
    if (percentage >= 80) return "Great job! You have a solid understanding of estate planning concepts.";
    if (percentage >= 70) return "Good work! Review the areas you missed to strengthen your knowledge.";
    if (percentage >= 60) return "You're on the right track. Consider reviewing the lesson materials.";
    return "Keep studying! Estate planning is complex but essential to master.";
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center justify-center w-20 h-20 ${theme.backgrounds.glass} rounded-full border ${theme.borderColors.primary} mb-6`}>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>
            Quiz Complete!
          </h2>
          <div className={`text-6xl font-bold ${getScoreColor(score, questions.length)} mb-4`}>
            {score}/{questions.length}
          </div>
          <div className={`text-xl ${theme.textColors.secondary} mb-6`}>
            {Math.round((score / questions.length) * 100)}% Correct
          </div>
          <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto mb-8`}>
            {getScoreMessage(score, questions.length)}
          </p>
        </motion.div>

        {/* Detailed Results */}
        <div className="space-y-6 mb-8">
          <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4`}>Review Your Answers</h3>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}`}>
                <CardHeader>
                  <CardTitle className={`${theme.textColors.primary} flex items-center gap-2`}>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    Question {index + 1}
                    <span className="ml-auto text-sm text-gray-400">
                      {question.category}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`${theme.textColors.secondary} mb-4`}>{question.question}</p>
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correctAnswer
                            ? 'border-green-400 bg-green-400/10'
                            : optionIndex === userAnswer && !isCorrect
                            ? 'border-red-400 bg-red-400/10'
                            : 'border-white/10'
                        }`}
                      >
                        <span className={theme.textColors.secondary}>{option}</span>
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-400 text-sm">✓ Correct</span>
                        )}
                        {optionIndex === userAnswer && !isCorrect && (
                          <span className="ml-2 text-red-400 text-sm">✗ Your answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50/10 border border-blue-200/20 rounded-lg p-4">
                    <p className="text-blue-300 text-sm font-medium mb-1">Explanation:</p>
                    <p className={`${theme.textColors.secondary} text-sm`}>{question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${theme.textColors.primary} flex items-center gap-2`}>
            <FileText className="w-6 h-6" />
            Estate Planning Quiz
          </h2>
          <span className={`text-sm ${theme.textColors.secondary}`}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="mb-2" />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{Math.round(progress)}% Complete</span>
          <span>{currentQ.category}</span>
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} mb-8`}>
          <CardHeader>
            <CardTitle className={`${theme.textColors.primary} text-xl`}>
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-400 bg-blue-400/10 text-white'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className={
            currentQuestion === questions.length - 1
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default EstatePlanningQuiz;

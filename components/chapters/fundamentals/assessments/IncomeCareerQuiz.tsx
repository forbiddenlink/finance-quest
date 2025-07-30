'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, useProgressActions } from '@/lib/context/ProgressContext';
import { CheckCircle, XCircle, ArrowRight, TrendingUp, Target, Award } from 'lucide-react';
import CelebrationConfetti from '@/components/shared/ui/CelebrationConfetti';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

interface IncomeCareerQuizProps {
  onComplete?: (score: number) => void;
}

const IncomeCareerQuiz = ({ onComplete }: IncomeCareerQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { state } = useProgress();
  const { recordQuizScore, addStrugglingTopic, removeStrugglingTopic } = useProgressActions();

  const questions: Question[] = [
    {
      id: 'salary-negotiation-timing',
      question: 'When is the best time to negotiate your salary?',
      options: [
        'During the job interview',
        'After receiving a job offer but before accepting',
        'During your first week on the job',
        'Only during annual performance reviews'
      ],
      correctAnswer: 1,
      explanation: 'After receiving a job offer is the optimal time to negotiate. You have leverage because they\'ve already decided they want you, but you haven\'t committed yet. Negotiating during the interview can seem presumptuous, and waiting until after you start reduces your leverage.',
      topic: 'salary-negotiation'
    },
    {
      id: 'benefit-valuation',
      question: 'Which of these employee benefits typically has the highest monetary value?',
      options: [
        'Health insurance premium coverage',
        'Paid vacation days',
        '401(k) company match',
        'Free gym membership'
      ],
      correctAnswer: 0,
      explanation: 'Health insurance premium coverage is typically worth $15,000-20,000+ per year for family coverage. While 401(k) matches are valuable (often 3-6% of salary), and vacation has value, health insurance premiums represent the largest monetary benefit for most employees.',
      topic: 'benefits-valuation'
    },
    {
      id: 'gross-vs-net',
      question: 'If your gross salary is $60,000, approximately what should you expect your take-home pay to be?',
      options: [
        '$60,000 - that\'s what I earned',
        '$54,000 (10% in taxes)',
        '$45,000 (25% in taxes and deductions)',
        '$40,000 (33% in taxes and deductions)'
      ],
      correctAnswer: 2,
      explanation: 'Take-home pay is typically 75-80% of gross salary due to federal taxes (12-22%), state taxes (0-10%), Social Security/Medicare (7.65%), and other deductions like health insurance and retirement contributions. $45,000 from $60,000 gross is realistic.',
      topic: 'income-taxes'
    },
    {
      id: 'side-hustle-taxes',
      question: 'If you earn $800 from freelance work, what are your tax obligations?',
      options: [
        'No taxes owed since it\'s under $1,000',
        'Only federal income tax is owed',
        'Income tax plus self-employment tax (Social Security/Medicare)',
        'Taxes are automatically withheld like a regular job'
      ],
      correctAnswer: 2,
      explanation: 'Freelance income over $400 requires paying both income tax AND self-employment tax (15.3% for Social Security/Medicare). Unlike W-2 employees, freelancers pay both the employee and employer portions of these taxes. You\'re also responsible for making quarterly estimated tax payments.',
      topic: 'freelance-taxes'
    },
    {
      id: 'skill-investment-roi',
      question: 'Which skill investment typically provides the highest return on investment (ROI) for career advancement?',
      options: [
        'Industry-specific technical certifications',
        'General communication and leadership skills',
        'Advanced degrees (MBA, Masters)',
        'Networking events and conferences'
      ],
      correctAnswer: 1,
      explanation: 'Communication and leadership skills provide the highest ROI because they\'re transferable across industries and essential for management roles where salaries increase dramatically. Technical skills become obsolete, advanced degrees are expensive with uncertain returns, and networking has variable results.',
      topic: 'career-development'
    },
    {
      id: 'remote-work-negotiation',
      question: 'When negotiating remote work, what\'s the strongest argument to present to employers?',
      options: [
        'I want better work-life balance',
        'I can save money on commuting costs',
        'Remote workers are more productive and cost companies less',
        'Everyone else is doing remote work now'
      ],
      correctAnswer: 2,
      explanation: 'Focus on business benefits to the employer: studies show remote workers are 13-50% more productive, reduce office space costs ($11,000/employee/year), and have lower turnover. Personal benefits like work-life balance don\'t address the employer\'s concerns about productivity and collaboration.',
      topic: 'remote-work'
    },
    {
      id: 'salary-research',
      question: 'What\'s the most reliable way to research fair salary ranges for your position?',
      options: [
        'Ask coworkers what they make',
        'Use online salary calculators like Glassdoor',
        'Combine multiple sources: Glassdoor, PayScale, industry reports, and networking',
        'Ask the hiring manager during the interview'
      ],
      correctAnswer: 2,
      explanation: 'Using multiple sources gives you the most accurate picture. Glassdoor and PayScale provide baseline data, industry reports show trends, and networking gives you insider information. Single sources can be outdated or biased. Asking coworkers directly can be awkward and unreliable.',
      topic: 'salary-research'
    },
    {
      id: 'career-change-timing',
      question: 'Financially, when is the best time to make a major career change?',
      options: [
        'Immediately when you\'re unhappy with your current job',
        'After building 6+ months of expenses in savings and developing new skills',
        'Only when you have another job offer already',
        'During economic recessions when there\'s less competition'
      ],
      correctAnswer: 1,
      explanation: 'Career changes require financial cushion and preparation. 6+ months of expenses provides security during job search and potential income reduction. Developing skills first increases your marketability. Rushing into career changes without preparation often leads to financial stress and poor decisions.',
      topic: 'career-planning'
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (showExplanation) {
      setShowExplanation(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        finishQuiz();
      }
    } else {
      setShowExplanation(true);
    }
  };

  const finishQuiz = () => {
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    
    const score = (correctAnswers / questions.length) * 100;
    
    // Track struggling topics
    selectedAnswers.forEach((answer, index) => {
      const question = questions[index];
      if (answer !== question.correctAnswer) {
        addStrugglingTopic(question.topic);
      } else {
        removeStrugglingTopic(question.topic);
      }
    });

    recordQuizScore('chapter3-income-career', score);
    setQuizCompleted(true);
    setShowResult(true);
    
    if (onComplete) {
      onComplete(score / 100);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
    setShowExplanation(false);
  };

  const calculateScore = () => {
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    return (correctAnswers / questions.length) * 100;
  };

  const currentQ = questions[currentQuestion];
  const score = calculateScore();

  if (showResult) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {score >= 85 && <CelebrationConfetti isActive={true} />}
        
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {score >= 85 ? (
              <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            ) : score >= 70 ? (
              <Target className="w-20 h-20 text-blue-500 mx-auto mb-4" />
            ) : (
              <TrendingUp className="w-20 h-20 text-orange-500 mx-auto mb-4" />
            )}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h2>
          
          <div className="text-6xl font-bold mb-4">
            <span className={score >= 85 ? 'text-green-500' : score >= 70 ? 'text-blue-500' : 'text-orange-500'}>
              {Math.round(score)}%
            </span>
          </div>
          
          <p className="text-xl text-gray-600 mb-6">
            {score >= 85 ? 'Outstanding! You\'ve mastered income and career finance!' :
             score >= 70 ? 'Good job! You have a solid understanding with room for improvement.' :
             'Keep learning! Review the concepts and try again.'}
          </p>

          {score >= 85 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">🎉 Chapter 3 Mastered!</h3>
              <p className="text-green-700">
                You've unlocked advanced income strategies and can now access Chapter 4: Budgeting Mastery & Cash Flow.
                Your understanding of salary negotiation, benefits valuation, and career planning will serve you well!
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Keep Building Your Skills</h3>
              <p className="text-blue-700">
                Review the lesson materials, especially topics you missed. Strong income and career 
                management skills are the foundation of financial success!
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length}</div>
            <div className="text-blue-800">Correct</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{questions.length - selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length}</div>
            <div className="text-red-800">Incorrect</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-600">{questions.length}</div>
            <div className="text-gray-800">Total</div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Retake Quiz
          </button>
          
          {score >= 85 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center">
                Continue to Chapter 4
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Income & Career Finance Quiz</h2>
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-white h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {!showExplanation ? (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQ.question}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`explanation-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className={`flex items-center mb-4 ${
                  selectedAnswers[currentQuestion] === currentQ.correctAnswer 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {selectedAnswers[currentQuestion] === currentQ.correctAnswer ? (
                    <CheckCircle className="w-6 h-6 mr-2" />
                  ) : (
                    <XCircle className="w-6 h-6 mr-2" />
                  )}
                  <span className="font-semibold">
                    {selectedAnswers[currentQuestion] === currentQ.correctAnswer 
                      ? 'Correct!' 
                      : 'Incorrect'}
                  </span>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700">{currentQ.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-8 py-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {!showExplanation ? 'Select an answer to continue' : 'Review the explanation'}
        </div>
        
        <motion.button
          onClick={handleNext}
          disabled={!showExplanation && selectedAnswers[currentQuestion] === undefined}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {!showExplanation ? 'Submit Answer' : 
           currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default IncomeCareerQuiz;

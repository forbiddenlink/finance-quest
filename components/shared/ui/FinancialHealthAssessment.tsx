'use client';

import { useState } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import GradientCard from '@/components/shared/ui/GradientCard';
import { Heart, TrendingUp, AlertTriangle, CheckCircle, Target, Shield, PiggyBank, CreditCard, Brain } from 'lucide-react';
import { theme } from '@/lib/theme';

interface FinancialHealthMetrics {
  budgetingScore: number;
  emergencyFundScore: number;
  debtScore: number;
  savingsScore: number;
  investmentScore: number;
  knowledgeScore: number;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  improvements: string[];
  strengths: string[];
}

interface HealthAssessmentProps {
  onScoreCalculated?: (score: FinancialHealthMetrics) => void;
}

export default function FinancialHealthAssessment({ onScoreCalculated }: HealthAssessmentProps) {
  const userProgress = useProgressStore(state => state.userProgress);
  const [responses, setResponses] = useState({
    monthlyIncome: '',
    monthlyExpenses: '',
    emergencyFund: '',
    totalDebt: '',
    monthlySavings: '',
    investmentAmount: '',
    hasWrittenBudget: false,
    trackExpenses: false,
    hasEmergencyFund: false,
    paysCreditCardFull: false,
    hasRetirementAccount: false,
    reviewsFinancesRegularly: false
  });

  const [healthScore, setHealthScore] = useState<FinancialHealthMetrics | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);

  const questions = [
    {
      category: 'Income & Budgeting',
      questions: [
        { key: 'monthlyIncome', question: 'What is your approximate monthly income after taxes?', type: 'number', placeholder: '4000' },
        { key: 'monthlyExpenses', question: 'What are your approximate monthly expenses?', type: 'number', placeholder: '3500' },
        { key: 'hasWrittenBudget', question: 'Do you have a written budget that you follow?', type: 'boolean' },
        { key: 'trackExpenses', question: 'Do you track your expenses regularly?', type: 'boolean' }
      ]
    },
    {
      category: 'Emergency Preparedness',
      questions: [
        { key: 'emergencyFund', question: 'How much do you have in your emergency fund?', type: 'number', placeholder: '5000' },
        { key: 'hasEmergencyFund', question: 'Do you have an emergency fund covering at least 3 months of expenses?', type: 'boolean' }
      ]
    },
    {
      category: 'Debt Management',
      questions: [
        { key: 'totalDebt', question: 'What is your total debt (excluding mortgage)?', type: 'number', placeholder: '15000' },
        { key: 'paysCreditCardFull', question: 'Do you pay your credit card balance in full each month?', type: 'boolean' }
      ]
    },
    {
      category: 'Savings & Investment',
      questions: [
        { key: 'monthlySavings', question: 'How much do you save/invest each month?', type: 'number', placeholder: '500' },
        { key: 'investmentAmount', question: 'What is your total investment/retirement account balance?', type: 'number', placeholder: '25000' },
        { key: 'hasRetirementAccount', question: 'Do you contribute to a retirement account (401k, IRA)?', type: 'boolean' },
        { key: 'reviewsFinancesRegularly', question: 'Do you review your finances and investments regularly?', type: 'boolean' }
      ]
    }
  ];

  const calculateHealthScore = (): FinancialHealthMetrics => {
    const income = parseFloat(responses.monthlyIncome) || 0;
    const expenses = parseFloat(responses.monthlyExpenses) || 0;
    const emergencyFund = parseFloat(responses.emergencyFund) || 0;
    const debt = parseFloat(responses.totalDebt) || 0;
    const savings = parseFloat(responses.monthlySavings) || 0;
    const investments = parseFloat(responses.investmentAmount) || 0;

    // Budgeting Score (0-100)
    let budgetingScore = 0;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 100;

    if (responses.hasWrittenBudget) budgetingScore += 25;
    if (responses.trackExpenses) budgetingScore += 25;
    if (savingsRate >= 20) budgetingScore += 30;
    else if (savingsRate >= 10) budgetingScore += 20;
    else if (savingsRate >= 5) budgetingScore += 10;
    if (expenseRatio <= 80) budgetingScore += 20;
    else if (expenseRatio <= 90) budgetingScore += 10;

    // Emergency Fund Score (0-100)
    let emergencyFundScore = 0;
    const emergencyMonths = expenses > 0 ? emergencyFund / expenses : 0;
    if (responses.hasEmergencyFund) emergencyFundScore += 30;
    if (emergencyMonths >= 6) emergencyFundScore += 70;
    else if (emergencyMonths >= 3) emergencyFundScore += 50;
    else if (emergencyMonths >= 1) emergencyFundScore += 30;
    else if (emergencyFund > 0) emergencyFundScore += 10;

    // Debt Score (0-100)
    let debtScore = 100;
    if (debt > 0) {
      const debtToIncomeRatio = income > 0 ? (debt / (income * 12)) * 100 : 0;
      if (debtToIncomeRatio > 50) debtScore = 20;
      else if (debtToIncomeRatio > 30) debtScore = 40;
      else if (debtToIncomeRatio > 20) debtScore = 60;
      else if (debtToIncomeRatio > 10) debtScore = 80;
      else debtScore = 90;
    }
    if (!responses.paysCreditCardFull && debt > 0) debtScore -= 20;

    // Savings Score (0-100)
    let savingsScore = Math.min(100, savingsRate * 4); // 25% savings rate = 100 points
    if (savingsScore < 20 && savings > 0) savingsScore = 20; // Minimum for any savings

    // Investment Score (0-100)
    let investmentScore = 0;
    if (responses.hasRetirementAccount) investmentScore += 30;
    if (responses.reviewsFinancesRegularly) investmentScore += 20;
    const investmentRatio = income > 0 ? (investments / (income * 12)) * 100 : 0;
    if (investmentRatio >= 100) investmentScore += 50; // 1+ years of income invested
    else if (investmentRatio >= 50) investmentScore += 40;
    else if (investmentRatio >= 25) investmentScore += 30;
    else if (investmentRatio >= 10) investmentScore += 20;
    else if (investments > 0) investmentScore += 10;

    // Knowledge Score based on completed lessons/quizzes
    const knowledgeScore = Math.min(100,
      (userProgress.completedLessons.length * 15) +
      (Object.values(userProgress.quizScores).filter(s => Number(s) >= 80).length * 20)
    );

    // Overall Score (weighted average)
    const overallScore = Math.round(
      (budgetingScore * 0.25) +
      (emergencyFundScore * 0.20) +
      (debtScore * 0.20) +
      (savingsScore * 0.15) +
      (investmentScore * 0.15) +
      (knowledgeScore * 0.05)
    );

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (overallScore >= 90) grade = 'A';
    else if (overallScore >= 80) grade = 'B';
    else if (overallScore >= 70) grade = 'C';
    else if (overallScore >= 60) grade = 'D';
    else grade = 'F';

    // Generate improvements and strengths
    const improvements: string[] = [];
    const strengths: string[] = [];

    if (budgetingScore >= 75) strengths.push('Strong budgeting habits');
    else improvements.push('Create and stick to a written budget');

    if (emergencyFundScore >= 75) strengths.push('Well-prepared for emergencies');
    else improvements.push('Build emergency fund to cover 3-6 months of expenses');

    if (debtScore >= 75) strengths.push('Good debt management');
    else improvements.push('Focus on paying down high-interest debt');

    if (savingsScore >= 75) strengths.push('Excellent savings discipline');
    else improvements.push('Increase monthly savings to at least 10% of income');

    if (investmentScore >= 75) strengths.push('Strong investment foundation');
    else improvements.push('Start or increase retirement account contributions');

    if (knowledgeScore >= 75) strengths.push('Good financial literacy');
    else improvements.push('Continue learning through Finance Quest modules');

    return {
      budgetingScore,
      emergencyFundScore,
      debtScore,
      savingsScore,
      investmentScore,
      knowledgeScore,
      overallScore,
      grade,
      improvements,
      strengths
    };
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const handleStartAssessment = () => {
    setIsAssessing(true);
    setCurrentStep(0);
    setHealthScore(null);
  };

  const handleNextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const score = calculateHealthScore();
      setHealthScore(score);
      if (onScoreCalculated) {
        onScoreCalculated(score);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.status.success.text;
    if (score >= 60) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return theme.status.success.bg.replace('/20', '');
      case 'B': return theme.status.info.bg.replace('/20', '');
      case 'C': return theme.status.warning.bg.replace('/20', '');
      case 'D': return theme.status.warning.bg.replace('/20', '');
      case 'F': return theme.status.error.bg.replace('/20', '');
      default: return theme.backgrounds.cardDisabled;
    }
  };

  if (!isAssessing && !healthScore) {
    return (
      <GradientCard variant="glass" gradient="green" className="p-8 text-center">
        <Heart className={`w-16 h-16 ${theme.status.success.text} mx-auto mb-6`} />
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>Financial Health Assessment</h2>
        <p className={`text-lg ${theme.textColors.secondary} mb-6 max-w-2xl mx-auto`}>
          Get your personalized Financial Health Score with actionable recommendations to improve your financial well-being.
        </p>
        <button
          onClick={handleStartAssessment}
          className={`bg-gradient-to-r from-slate-900 to-blue-900 ${theme.textColors.primary} px-8 py-4 rounded-xl font-semibold text-lg hover:from-slate-900 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
        >
          Start Assessment (2 minutes)
        </button>
      </GradientCard>
    );
  }

  if (isAssessing && !healthScore) {
    const currentCategory = questions[currentStep];
    return (
      <GradientCard variant="glass" gradient="blue" className="p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-2xl font-bold ${theme.textColors.primary}`}>{currentCategory.category}</h3>
            <span className={`text-sm ${theme.textColors.secondary}`}>Step {currentStep + 1} of {questions.length}</span>
          </div>
          <div className={`w-full ${theme.backgrounds.cardDisabled} rounded-full h-2`}>
            <div
              className={`${theme.status.info.bg.replace('/20', '')} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {currentCategory.questions.map((q) => (
            <div key={q.key} className="space-y-3">
              <label className={`block text-lg font-medium ${theme.textColors.primary}`}>{q.question}</label>
              {q.type === 'number' ? (
                <input
                  type="number"
                  placeholder={q.placeholder}
                  value={responses[q.key as keyof typeof responses] as string}
                  onChange={(e) => handleInputChange(q.key, e.target.value)}
                  className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg`}
                />
              ) : (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleInputChange(q.key, true)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${responses[q.key as keyof typeof responses] === true
                      ? `${theme.status.success.bg.replace('/20', '')} ${theme.textColors.primary}`
                      : `${theme.backgrounds.cardDisabled} ${theme.textColors.secondary} hover:${theme.backgrounds.card}`
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleInputChange(q.key, false)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${responses[q.key as keyof typeof responses] === false
                      ? `${theme.status.error.bg.replace('/20', '')} ${theme.textColors.primary}`
                      : `${theme.backgrounds.cardDisabled} ${theme.textColors.secondary} hover:${theme.backgrounds.card}`
                      }`}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 ${theme.backgrounds.cardDisabled} ${theme.textColors.secondary} rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-all`}
          >
            Previous
          </button>
          <button
            onClick={handleNextStep}
            className={`px-6 py-3 bg-gradient-to-r from-slate-900 to-blue-900 ${theme.textColors.primary} rounded-lg font-medium hover:from-slate-900 hover:to-blue-900 transition-all`}
          >
            {currentStep === questions.length - 1 ? 'Calculate Score' : 'Next'}
          </button>
        </div>
      </GradientCard>
    );
  }

  if (healthScore) {
    return (
      <div className="space-y-8">
        {/* Overall Score */}
        <GradientCard variant="glass" gradient="purple" className="p-8 text-center">
          <div className={`w-24 h-24 ${getGradeColor(healthScore.grade)} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <span className={`text-4xl font-bold ${theme.textColors.primary}`}>{healthScore.grade}</span>
          </div>
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>Your Financial Health Score</h2>
          <div className={`text-6xl font-bold ${theme.status.info.text} mb-4`}>{healthScore.overallScore}</div>
          <p className={`text-lg ${theme.textColors.secondary}`}>
            {healthScore.overallScore >= 90 ? 'Excellent financial health!' :
              healthScore.overallScore >= 80 ? 'Good financial health with room for improvement' :
                healthScore.overallScore >= 70 ? 'Fair financial health - focus on key areas' :
                  healthScore.overallScore >= 60 ? 'Poor financial health - immediate action needed' :
                    'Critical financial health - urgent improvements required'}
          </p>
        </GradientCard>

        {/* Detailed Breakdown */}
        <GradientCard variant="glass" gradient="blue" className="p-6">
          <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-6`}>Detailed Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Budgeting', score: healthScore.budgetingScore, icon: Target },
              { name: 'Emergency Fund', score: healthScore.emergencyFundScore, icon: Shield },
              { name: 'Debt Management', score: healthScore.debtScore, icon: CreditCard },
              { name: 'Savings Rate', score: healthScore.savingsScore, icon: PiggyBank },
              { name: 'Investments', score: healthScore.investmentScore, icon: TrendingUp },
              { name: 'Knowledge', score: healthScore.knowledgeScore, icon: Brain }
            ].map(({ name, score, icon: Icon }) => (
              <div key={name} className={`${theme.backgrounds.glass} bg-opacity-50 rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${theme.textColors.secondary}`} />
                    <span className={`font-medium ${theme.textColors.primary}`}>{name}</span>
                  </div>
                  <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
                </div>
                <div className={`w-full ${theme.backgrounds.cardDisabled} rounded-full h-2`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${score >= 80 ? theme.status.success.bg.replace('/20', '') : score >= 60 ? theme.status.warning.bg.replace('/20', '') : theme.status.error.bg.replace('/20', '')
                      }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </GradientCard>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Improvements */}
          {healthScore.improvements.length > 0 && (
            <GradientCard variant="glass" gradient="red" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <AlertTriangle className={`w-6 h-6 ${theme.status.error.text}`} />
                Priority Improvements
              </h3>
              <ul className="space-y-3">
                {healthScore.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`w-6 h-6 ${theme.status.error.bg.replace('/20', '')} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <span className={`${theme.textColors.primary} text-sm font-bold`}>{idx + 1}</span>
                    </div>
                    <span className={`${theme.textColors.primary}`}>{improvement}</span>
                  </li>
                ))}
              </ul>
            </GradientCard>
          )}

          {/* Strengths */}
          {healthScore.strengths.length > 0 && (
            <GradientCard variant="glass" gradient="green" className="p-6">
              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <CheckCircle className={`w-6 h-6 ${theme.status.success.text}`} />
                Your Strengths
              </h3>
              <ul className="space-y-3">
                {healthScore.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${theme.status.success.text} flex-shrink-0`} />
                    <span className={`${theme.textColors.primary}`}>{strength}</span>
                  </li>
                ))}
              </ul>
            </GradientCard>
          )}
        </div>

        {/* Retake Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsAssessing(false);
              setHealthScore(null);
              setCurrentStep(0);
              setResponses({
                monthlyIncome: '',
                monthlyExpenses: '',
                emergencyFund: '',
                totalDebt: '',
                monthlySavings: '',
                investmentAmount: '',
                hasWrittenBudget: false,
                trackExpenses: false,
                hasEmergencyFund: false,
                paysCreditCardFull: false,
                hasRetirementAccount: false,
                reviewsFinancesRegularly: false
              });
            }}
            className={`bg-gradient-to-r from-slate-900 to-blue-900 ${theme.textColors.primary} px-6 py-3 rounded-lg font-semibold hover:from-slate-900 hover:to-blue-900 transition-all`}
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return null;
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import { 
  CreditCard, 
  TrendingUp, 
  Target, 
  CheckCircle,
  DollarSign,
  Clock,
  Award,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CreditProfileAnalyzerProps {
  onComplete?: () => void;
}

interface CreditProfile {
  currentScore: number;
  paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  utilization: number;
  accountAge: number;
  accountMix: 'diverse' | 'limited' | 'minimal';
  recentInquiries: number;
  hasNegativeMarks: boolean;
}

interface ScoreAnalysis {
  currentTier: string;
  improvementPotential: number;
  targetScore: number;
  timeToTarget: string;
  savingsOpportunity: number;
  recommendations: string[];
}

export default function CreditProfileAnalyzer({ onComplete }: CreditProfileAnalyzerProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<CreditProfile>({
    currentScore: 650,
    paymentHistory: 'good',
    utilization: 30,
    accountAge: 24,
    accountMix: 'limited',
    recentInquiries: 2,
    hasNegativeMarks: false
  });
  const [analysis, setAnalysis] = useState<ScoreAnalysis | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    recordCalculatorUsage('credit-profile-analyzer');
  }, [recordCalculatorUsage]);

  const questions = [
    {
      id: 'currentScore',
      title: 'What is your current credit score?',
      subtitle: 'Check your bank app, Credit Karma, or credit card statement',
      type: 'slider' as const,
      min: 300,
      max: 850,
      step: 10,
      unit: 'points'
    },
    {
      id: 'paymentHistory',
      title: 'How would you describe your payment history?',
      subtitle: 'Be honest - this determines 35% of your credit score',
      type: 'select' as const,
      options: [
        { value: 'excellent', label: 'Excellent', description: 'Never missed a payment in 2+ years' },
        { value: 'good', label: 'Good', description: '1-2 late payments in the past 2 years' },
        { value: 'fair', label: 'Fair', description: 'Several late payments or recent missed payment' },
        { value: 'poor', label: 'Poor', description: 'Multiple missed payments or defaults' }
      ]
    },
    {
      id: 'utilization',
      title: 'What is your credit utilization ratio?',
      subtitle: 'Total credit card balances ÷ Total credit limits × 100',
      type: 'slider' as const,
      min: 0,
      max: 100,
      step: 5,
      unit: '%'
    },
    {
      id: 'accountAge',
      title: 'How old is your oldest credit account?',
      subtitle: 'Length of credit history is 15% of your score',
      type: 'slider' as const,
      min: 0,
      max: 120,
      step: 6,
      unit: 'months'
    },
    {
      id: 'accountMix',
      title: 'What types of credit accounts do you have?',
      subtitle: 'Credit mix accounts for 10% of your score',
      type: 'select' as const,
      options: [
        { value: 'diverse', label: 'Diverse', description: 'Credit cards, installment loans, mortgage' },
        { value: 'limited', label: 'Limited', description: 'Credit cards and one other type' },
        { value: 'minimal', label: 'Minimal', description: 'Only credit cards or single account type' }
      ]
    },
    {
      id: 'recentInquiries',
      title: 'How many credit inquiries in the past 12 months?',
      subtitle: 'Hard inquiries impact your score for up to 2 years',
      type: 'slider' as const,
      min: 0,
      max: 10,
      step: 1,
      unit: 'inquiries'
    },
    {
      id: 'hasNegativeMarks',
      title: 'Do you have any negative marks on your credit report?',
      subtitle: 'Collections, bankruptcies, foreclosures, or charge-offs',
      type: 'boolean' as const,
      options: [
        { value: 'false', label: 'No negative marks', description: 'Clean credit report' },
        { value: 'true', label: 'Yes, I have negative marks', description: 'Collections, bankruptcies, etc.' }
      ]
    }
  ];

  const analyzeProfile = (): ScoreAnalysis => {
    let targetScore = profile.currentScore;
    let timeToTarget = '3-6 months';
    const improvements: string[] = [];

    // Payment history optimization
    if (profile.paymentHistory !== 'excellent') {
      improvements.push('Set up automatic payments for all accounts to ensure perfect payment history');
      targetScore += profile.paymentHistory === 'poor' ? 100 : profile.paymentHistory === 'fair' ? 60 : 30;
    }

    // Utilization optimization
    if (profile.utilization > 30) {
      improvements.push(`Reduce credit utilization from ${profile.utilization}% to under 10% for maximum score benefit`);
      targetScore += Math.min(80, (profile.utilization - 10) * 2);
    } else if (profile.utilization > 10) {
      improvements.push('Optimize utilization to 1-9% for elite credit scores');
      targetScore += (profile.utilization - 5) * 2;
    }

    // Account age
    if (profile.accountAge < 24) {
      improvements.push('Keep oldest accounts open forever - time builds your credit foundation');
      timeToTarget = '12-18 months';
    }

    // Account mix
    if (profile.accountMix === 'minimal') {
      improvements.push('Consider adding installment loan or different credit types to improve credit mix');
      targetScore += 20;
    } else if (profile.accountMix === 'limited') {
      improvements.push('Diversify credit mix with additional account types when appropriate');
      targetScore += 10;
    }

    // Recent inquiries
    if (profile.recentInquiries > 3) {
      improvements.push('Avoid new credit applications for 6-12 months to let inquiries age');
      targetScore += (profile.recentInquiries - 3) * 5;
    }

    // Negative marks
    if (profile.hasNegativeMarks) {
      improvements.push('Dispute any inaccurate negative marks and focus on rebuilding positive payment history');
      targetScore += 50;
      timeToTarget = '12-24 months';
    }

    // Cap target score at 850
    targetScore = Math.min(850, targetScore);
    
    // Calculate savings opportunity
    const scoreImprovement = targetScore - profile.currentScore;
    const savingsOpportunity = scoreImprovement * 1200; // Rough estimate: $1,200 savings per score point

    const currentTier = getCurrentTier(profile.currentScore);

    return {
      currentTier,
      improvementPotential: scoreImprovement,
      targetScore,
      timeToTarget,
      savingsOpportunity,
      recommendations: improvements
    };
  };

  const getCurrentTier = (score: number): string => {
    if (score >= 740) return 'Excellent';
    if (score >= 670) return 'Very Good';
    if (score >= 580) return 'Good';
    if (score >= 500) return 'Fair';
    return 'Poor';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 740) return 'text-green-400';
    if (score >= 670) return 'text-blue-400';
    if (score >= 580) return 'text-yellow-400';
    if (score >= 500) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleInputChange = (questionId: string, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [questionId]: questionId === 'hasNegativeMarks' ? value === 'true' : value
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const analysisResult = analyzeProfile();
      setAnalysis(analysisResult);
      setShowResults(true);
      toast.success('Credit profile analyzed! 📊', { duration: 3000 });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setShowResults(false);
    setAnalysis(null);
    setProfile({
      currentScore: 650,
      paymentHistory: 'good',
      utilization: 30,
      accountAge: 24,
      accountMix: 'limited',
      recentInquiries: 2,
      hasNegativeMarks: false
    });
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  if (showResults && analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <GradientCard variant="glass" gradient="blue" className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.success.bg} rounded-full mb-4`}>
              <BarChart3 className={`w-8 h-8 ${theme.status.success.text}`} />
            </div>
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
              Your Credit Profile Analysis
            </h2>
            <p className={`${theme.textColors.secondary}`}>
              Personalized roadmap to optimize your credit score and unlock savings
            </p>
          </div>

          {/* Current vs Target Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <GradientCard variant="glass" gradient="purple" className="p-6 text-center">
              <div className="mb-4">
                <CreditCard className={`w-8 h-8 ${getScoreColor(profile.currentScore)} mx-auto mb-2`} />
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-1`}>Current Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(profile.currentScore)} mb-2`}>
                  {profile.currentScore}
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${theme.status.info.bg} ${theme.status.info.text}`}>
                  {analysis.currentTier}
                </span>
              </div>
            </GradientCard>

            <GradientCard variant="glass" gradient="green" className="p-6 text-center">
              <div className="mb-4">
                <Target className={`w-8 h-8 text-green-400 mx-auto mb-2`} />
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-1`}>Target Score</h3>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {analysis.targetScore}
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${theme.status.success.bg} ${theme.status.success.text}`}>
                  +{analysis.improvementPotential} points
                </span>
              </div>
            </GradientCard>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <Clock className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
              <h4 className={`font-semibold ${theme.textColors.primary} mb-1`}>Timeline</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>{analysis.timeToTarget}</p>
            </div>
            
            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <DollarSign className={`w-6 h-6 ${theme.status.success.text} mx-auto mb-2`} />
              <h4 className={`font-semibold ${theme.textColors.primary} mb-1`}>Potential Savings</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                ${analysis.savingsOpportunity.toLocaleString()}+
              </p>
            </div>

            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <TrendingUp className={`w-6 h-6 ${theme.status.warning.text} mx-auto mb-2`} />
              <h4 className={`font-semibold ${theme.textColors.primary} mb-1`}>Improvement</h4>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                {analysis.improvementPotential} point boost
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <GradientCard variant="glass" gradient="yellow" className="p-6 mb-8">
            <div className="flex items-center mb-4">
              <Shield className={`w-6 h-6 ${theme.status.warning.text} mr-3`} />
              <h3 className={`text-xl font-bold ${theme.textColors.primary}`}>
                Your Personalized Action Plan
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 ${theme.status.success.bg} rounded-full flex items-center justify-center mr-3 mt-1`}>
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text}`} />
                  </div>
                  <div>
                    <p className={`${theme.textColors.secondary} font-medium`}>{rec}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GradientCard>

          {/* Score Impact Breakdown */}
          <GradientCard variant="glass" gradient="purple" className="p-6 mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Award className={`w-6 h-6 mr-3`} />
              Credit Score Factors Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`${theme.textColors.secondary}`}>Payment History (35%)</span>
                <div className="flex items-center">
                  <div className={`w-24 h-2 bg-gray-700 rounded-full mr-3`}>
                    <div 
                      className={`h-full rounded-full ${
                        profile.paymentHistory === 'excellent' ? 'bg-green-400 w-full' :
                        profile.paymentHistory === 'good' ? 'bg-blue-400 w-4/5' :
                        profile.paymentHistory === 'fair' ? 'bg-yellow-400 w-3/5' : 'bg-red-400 w-2/5'
                      }`}
                    />
                  </div>
                  <span className={`text-sm ${theme.textColors.muted} capitalize`}>
                    {profile.paymentHistory}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`${theme.textColors.secondary}`}>Credit Utilization (30%)</span>
                <div className="flex items-center">
                  <div className={`w-24 h-2 bg-gray-700 rounded-full mr-3`}>
                    <div 
                      className={`h-full rounded-full ${
                        profile.utilization <= 10 ? 'bg-green-400 w-full' :
                        profile.utilization <= 30 ? 'bg-yellow-400 w-4/5' : 'bg-red-400 w-2/5'
                      }`}
                    />
                  </div>
                  <span className={`text-sm ${theme.textColors.muted}`}>
                    {profile.utilization}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`${theme.textColors.secondary}`}>Credit History Length (15%)</span>
                <div className="flex items-center">
                  <div className={`w-24 h-2 bg-gray-700 rounded-full mr-3`}>
                    <div 
                      className={`h-full rounded-full ${
                        profile.accountAge >= 48 ? 'bg-green-400 w-full' :
                        profile.accountAge >= 24 ? 'bg-blue-400 w-4/5' : 'bg-yellow-400 w-3/5'
                      }`}
                    />
                  </div>
                  <span className={`text-sm ${theme.textColors.muted}`}>
                    {Math.floor(profile.accountAge / 12)}y {profile.accountAge % 12}m
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`${theme.textColors.secondary}`}>Credit Mix (10%)</span>
                <div className="flex items-center">
                  <div className={`w-24 h-2 bg-gray-700 rounded-full mr-3`}>
                    <div 
                      className={`h-full rounded-full ${
                        profile.accountMix === 'diverse' ? 'bg-green-400 w-full' :
                        profile.accountMix === 'limited' ? 'bg-blue-400 w-4/5' : 'bg-yellow-400 w-2/5'
                      }`}
                    />
                  </div>
                  <span className={`text-sm ${theme.textColors.muted} capitalize`}>
                    {profile.accountMix}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`${theme.textColors.secondary}`}>New Credit (10%)</span>
                <div className="flex items-center">
                  <div className={`w-24 h-2 bg-gray-700 rounded-full mr-3`}>
                    <div 
                      className={`h-full rounded-full ${
                        profile.recentInquiries <= 2 ? 'bg-green-400 w-full' :
                        profile.recentInquiries <= 4 ? 'bg-yellow-400 w-3/5' : 'bg-red-400 w-1/3'
                      }`}
                    />
                  </div>
                  <span className={`text-sm ${theme.textColors.muted}`}>
                    {profile.recentInquiries} inquiries
                  </span>
                </div>
              </div>
            </div>
          </GradientCard>

          {/* Next Steps */}
          <div className={`p-6 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg mb-6`}>
            <h3 className={`text-lg font-bold ${theme.status.info.text} mb-3 flex items-center`}>
              <Zap className="w-5 h-5 mr-2" />
              Immediate Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>This Week:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Set up automatic payments for all credit accounts</li>
                  <li>• Check your free credit report at annualcreditreport.com</li>
                  <li>• Calculate exact utilization ratios for each card</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>This Month:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Pay down high utilization cards before statement dates</li>
                  <li>• Dispute any errors found on credit reports</li>
                  <li>• Research credit card limit increase strategies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restart}
              className={`px-8 py-3 border-2 ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-xl hover:${theme.borderColors.accent} hover:${theme.textColors.primary} transition-all`}
            >
              Analyze Another Profile
            </button>
            <button
              onClick={() => {
                onComplete?.();
                toast.success('Credit analysis completed! 🎯');
              }}
              className={`px-8 py-3 ${theme.buttons.primary} rounded-xl hover-lift transition-all`}
            >
              Continue Learning
            </button>
          </div>
        </GradientCard>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <GradientCard variant="glass" gradient="blue" className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.info.bg} rounded-full mb-4`}>
            <CreditCard className={`w-8 h-8 ${theme.status.info.text}`} />
          </div>
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
            Credit Profile Analyzer
          </h2>
          <p className={`${theme.textColors.secondary} mb-4`}>
            Get personalized recommendations to optimize your credit score and unlock savings
          </p>
          
          {/* Progress Bar */}
          <div className={`w-full bg-gray-700 rounded-full h-2 mb-2`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full ${theme.status.info.bg} rounded-full`}
            />
          </div>
          <p className={`text-sm ${theme.textColors.muted}`}>
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Question Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                {currentQuestion.title}
              </h3>
              <p className={`${theme.textColors.secondary}`}>
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Input Controls */}
            <div className="space-y-6">
              {currentQuestion.type === 'slider' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${theme.textColors.primary}`}>
                      {profile[currentQuestion.id as keyof CreditProfile]}
                      <span className={`text-lg ${theme.textColors.muted} ml-2`}>
                        {currentQuestion.unit}
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    step={currentQuestion.step}
                    value={profile[currentQuestion.id as keyof CreditProfile] as number}
                    onChange={(e) => handleInputChange(currentQuestion.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    aria-label={`${currentQuestion.title} slider`}
                    title={currentQuestion.title}
                  />
                  <div className={`flex justify-between text-sm ${theme.textColors.muted}`}>
                    <span>{currentQuestion.min}{currentQuestion.unit}</span>
                    <span>{currentQuestion.max}{currentQuestion.unit}</span>
                  </div>
                </div>
              )}

              {currentQuestion.type === 'select' && (
                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(currentQuestion.id, option.value)}
                      className={`p-4 border-2 rounded-xl transition-all text-left ${
                        profile[currentQuestion.id as keyof CreditProfile] === option.value
                          ? `${theme.borderColors.accent} ${theme.status.info.bg}`
                          : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                      }`}
                    >
                      <div className={`font-semibold ${theme.textColors.primary} mb-1`}>
                        {option.label}
                      </div>
                      <div className={`text-sm ${theme.textColors.secondary}`}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'boolean' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange(currentQuestion.id, option.value)}
                      className={`p-4 border-2 rounded-xl transition-all text-center ${
                        (profile[currentQuestion.id as keyof CreditProfile] ? 'true' : 'false') === option.value
                          ? `${theme.borderColors.accent} ${theme.status.info.bg}`
                          : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                      }`}
                    >
                      <div className={`font-semibold ${theme.textColors.primary} mb-1`}>
                        {option.label}
                      </div>
                      <div className={`text-sm ${theme.textColors.secondary}`}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 border-2 ${theme.borderColors.muted} ${theme.textColors.secondary} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            className={`px-8 py-3 ${theme.buttons.primary} rounded-xl hover-lift transition-all`}
          >
            {currentStep === questions.length - 1 ? 'Analyze Profile' : 'Next Question'}
          </button>
        </div>
      </GradientCard>
    </motion.div>
  );
}

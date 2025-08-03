'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Heart,
  Briefcase,
  TrendingDown,
  DollarSign,
  Shield,
  Target,
  CheckCircle,
  XCircle,
  Brain,
  Timer,
  Award,
  RefreshCw
} from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import GradientCard from '@/components/shared/ui/GradientCard';

import { LucideIcon } from 'lucide-react';
;
import { theme } from '@/lib/theme';

interface CrisisScenario {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  urgency: 'low' | 'medium' | 'high' | 'critical';
  category: 'job-loss' | 'medical' | 'market-crash' | 'family-emergency' | 'debt-crisis';
  requiredChapter: number;
  unlocked: boolean;
}

interface SimulationStep {
  id: string;
  title: string;
  description: string;
  situation: string;
  options: SimulationOption[];
  correctAnswer: number;
  explanation: string;
  consequences: string[];
  financialImpact: number; // positive or negative dollar amount
}

interface SimulationOption {
  text: string;
  reasoning: string;
  impact: 'positive' | 'neutral' | 'negative' | 'critical';
  score: number; // 0-100
}

interface SimulationResult {
  scenarioId: string;
  totalScore: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
  financialOutcome: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  strengths: string[];
  improvements: string[];
  completedAt: Date;
}

interface CrisisSimulationDashboardProps {
  className?: string;
}

export default function CrisisSimulationDashboard({ className = '' }: CrisisSimulationDashboardProps) {
  const userProgress = useProgressStore(state => state.userProgress);
  const recordSimulationResult = useProgressStore(state => state.recordSimulationResult);

  const [scenarios, setScenarios] = useState<CrisisScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<CrisisScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [simulationStartTime, setSimulationStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  // Initialize scenarios based on user progress
  useEffect(() => {
    const availableScenarios: CrisisScenario[] = [
      {
        id: 'job-loss-basic',
        title: 'Sudden Job Loss',
        description: 'Navigate unemployment benefits, emergency fund usage, and job search strategy during unexpected job loss.',
        icon: Briefcase,
        difficulty: 'beginner',
        estimatedTime: 15,
        urgency: 'critical',
        category: 'job-loss',
        requiredChapter: 1,
        unlocked: userProgress.currentChapter >= 1
      },
      {
        id: 'medical-emergency',
        title: 'Medical Emergency',
        description: 'Handle unexpected medical bills, insurance claims, and payment plan negotiations.',
        icon: Heart,
        difficulty: 'intermediate',
        estimatedTime: 20,
        urgency: 'high',
        category: 'medical',
        requiredChapter: 2,
        unlocked: userProgress.currentChapter >= 2
      },
      {
        id: 'market-crash',
        title: 'Market Crash Response',
        description: 'Maintain investment discipline during market volatility and economic uncertainty.',
        icon: TrendingDown,
        difficulty: 'advanced',
        estimatedTime: 25,
        urgency: 'medium',
        category: 'market-crash',
        requiredChapter: 4,
        unlocked: userProgress.currentChapter >= 4
      },
      {
        id: 'debt-crisis',
        title: 'Debt Overwhelm',
        description: 'Prioritize payments, negotiate with creditors, and create a debt recovery plan.',
        icon: AlertTriangle,
        difficulty: 'intermediate',
        estimatedTime: 18,
        urgency: 'high',
        category: 'debt-crisis',
        requiredChapter: 3,
        unlocked: userProgress.currentChapter >= 3
      },
      {
        id: 'family-emergency',
        title: 'Family Financial Crisis',
        description: 'Support family members in crisis while protecting your own financial stability.',
        icon: Shield,
        difficulty: 'advanced',
        estimatedTime: 22,
        urgency: 'high',
        category: 'family-emergency',
        requiredChapter: 5,
        unlocked: userProgress.currentChapter >= 5
      }
    ];

    setScenarios(availableScenarios);

    // Load completed scenarios from progress store
    const completed = Object.keys(userProgress.simulationResults || {});
    setCompletedScenarios(completed);
  }, [userProgress]);

  const startSimulation = (scenario: CrisisScenario) => {
    setActiveScenario(scenario);
    setCurrentStep(0);
    setUserAnswers({});
    setSimulationStartTime(new Date());
    setShowResults(false);
    setSimulationResult(null);

    // Generate simulation steps based on scenario
    const steps = generateSimulationSteps(scenario);
    setSimulationSteps(steps);
  };

  const generateSimulationSteps = (scenario: CrisisScenario): SimulationStep[] => {
    switch (scenario.id) {
      case 'job-loss-basic':
        return [
          {
            id: 'immediate-response',
            title: 'Immediate Response',
            description: 'You just received notice that your position has been eliminated effective immediately.',
            situation: 'Your manager called you into their office this morning and informed you that due to company restructuring, your position is being eliminated. You have 2 hours to clean out your desk. What should be your first priority?',
            options: [
              {
                text: 'Immediately start applying for new jobs online',
                reasoning: 'While job searching is important, there are more urgent immediate steps.',
                impact: 'neutral',
                score: 40
              },
              {
                text: 'File for unemployment benefits and gather all necessary documents',
                reasoning: 'Excellent! Filing for benefits quickly ensures you don\'t lose any entitled payments.',
                impact: 'positive',
                score: 100
              },
              {
                text: 'Panic and worry about how you\'ll pay your bills',
                reasoning: 'Understandable reaction, but taking action is more productive than worrying.',
                impact: 'negative',
                score: 10
              },
              {
                text: 'Ask friends and family for money immediately',
                reasoning: 'This should be a last resort after exploring other options first.',
                impact: 'negative',
                score: 20
              }
            ],
            correctAnswer: 1,
            explanation: 'Filing for unemployment benefits should be your first priority. Most states have a waiting period, so applying immediately ensures you receive benefits as soon as possible. Gather documents like your Social Security card, driver\'s license, and employment history.',
            consequences: [
              'Weekly unemployment benefits: $300-600',
              'Benefit duration: Up to 26 weeks',
              'Continued health insurance through COBRA'
            ],
            financialImpact: 1200
          },
          {
            id: 'budget-adjustment',
            title: 'Emergency Budget',
            description: 'Now you need to adjust your budget for reduced income.',
            situation: 'Your unemployment benefits will be $400/week ($1,600/month), which is about 60% of your previous income. Your monthly expenses are normally $2,800. How should you adjust your spending?',
            options: [
              {
                text: 'Cut all discretionary spending immediately',
                reasoning: 'Good approach! Focus on essential expenses only during this transition.',
                impact: 'positive',
                score: 85
              },
              {
                text: 'Maintain current lifestyle and use credit cards for the difference',
                reasoning: 'This creates dangerous debt during an already vulnerable time.',
                impact: 'critical',
                score: 0
              },
              {
                text: 'Move back in with family to eliminate housing costs',
                reasoning: 'If possible, this dramatically reduces expenses and extends your financial runway.',
                impact: 'positive',
                score: 95
              },
              {
                text: 'Do nothing and hope you find a job quickly',
                reasoning: 'Hope is not a financial strategy. You need a concrete plan.',
                impact: 'negative',
                score: 15
              }
            ],
            correctAnswer: 2,
            explanation: 'Creating an emergency budget focuses on essential expenses: housing, utilities, food, transportation, and minimum debt payments. Cut subscriptions, dining out, entertainment, and non-essential purchases. If moving in with family is an option, it can extend your financial runway significantly.',
            consequences: [
              'Monthly expenses reduced from $2,800 to $1,200',
              'Emergency fund lasts 8 months instead of 3',
              'Reduced financial stress allows better job search focus'
            ],
            financialImpact: 1600
          },
          {
            id: 'job-search-strategy',
            title: 'Job Search Strategy',
            description: 'You need to balance job searching with maintaining your financial stability.',
            situation: 'It\'s been 2 weeks since your job loss. You\'ve applied to 15 jobs online but haven\'t heard back yet. Your savings are adequate for 4-6 months. What\'s your best strategy?',
            options: [
              {
                text: 'Apply to any job that pays anything to get income immediately',
                reasoning: 'While income is important, taking a significantly lower-paying job can hurt long-term prospects.',
                impact: 'neutral',
                score: 50
              },
              {
                text: 'Network actively while being selective about quality opportunities',
                reasoning: 'Excellent strategy! Networking leads to 70% of jobs, and maintaining standards protects career trajectory.',
                impact: 'positive',
                score: 95
              },
              {
                text: 'Take time to learn new skills before job searching',
                reasoning: 'Skill development is valuable, but you need income too. Balance both activities.',
                impact: 'neutral',
                score: 60
              },
              {
                text: 'Wait for employers to contact you from your applications',
                reasoning: 'Passive job searching rarely works. You need to actively network and follow up.',
                impact: 'negative',
                score: 25
              }
            ],
            correctAnswer: 1,
            explanation: 'Active networking combined with selective applications works best. Contact former colleagues, attend industry events, and leverage LinkedIn. Quality networking often leads to opportunities that aren\'t publicly posted. Follow up on applications after 1-2 weeks.',
            consequences: [
              'Networking leads to 3 promising interview opportunities',
              'Average job search time reduced from 6 months to 3 months',
              'Potential for 10-15% salary increase over previous role'
            ],
            financialImpact: 5000
          }
        ];

      case 'medical-emergency':
        return [
          {
            id: 'immediate-medical-response',
            title: 'Emergency Room Decision',
            description: 'You\'re experiencing chest pain and need to decide on medical care.',
            situation: 'You\'re having chest pain at 2 AM. It could be serious, but you\'re worried about the cost. Your health insurance has a $3,000 deductible and you haven\'t met it this year. What should you do?',
            options: [
              {
                text: 'Go to the emergency room immediately',
                reasoning: 'Absolutely correct! Never delay emergency medical care due to cost concerns.',
                impact: 'positive',
                score: 100
              },
              {
                text: 'Wait until morning to see your regular doctor',
                reasoning: 'Chest pain could be life-threatening. Emergency care is necessary.',
                impact: 'critical',
                score: 0
              },
              {
                text: 'Call a telehealth service first to assess the situation',
                reasoning: 'For non-emergency symptoms this is good, but chest pain needs immediate evaluation.',
                impact: 'negative',
                score: 30
              },
              {
                text: 'Take aspirin and see if the pain goes away',
                reasoning: 'Self-treatment for potential cardiac issues is extremely dangerous.',
                impact: 'critical',
                score: 0
              }
            ],
            correctAnswer: 0,
            explanation: 'Never delay emergency medical care due to financial concerns. Hospitals are required to provide emergency care regardless of ability to pay. You can work out payment arrangements later, but your health and life are irreplaceable.',
            consequences: [
              'Emergency room visit: $2,500',
              'Tests and monitoring: $1,800',
              'Total bill: $4,300 (insurance pays $1,300 after deductible)',
              'Your out-of-pocket: $3,000'
            ],
            financialImpact: -3000
          },
          {
            id: 'insurance-navigation',
            title: 'Insurance Claims',
            description: 'You need to navigate insurance coverage and claims process.',
            situation: 'The tests showed you\'re healthy - it was stress-related chest pain. But now you have a $3,000 medical bill. Your insurance company is requesting additional documentation. What\'s your best approach?',
            options: [
              {
                text: 'Ignore the insurance request and just pay the bill',
                reasoning: 'Never ignore insurance requests. This could result in claim denial.',
                impact: 'negative',
                score: 10
              },
              {
                text: 'Provide all requested documentation promptly and follow up',
                reasoning: 'Excellent! Being responsive and organized with insurance claims ensures proper coverage.',
                impact: 'positive',
                score: 95
              },
              {
                text: 'Dispute the bill without providing documentation',
                reasoning: 'You need to work within the system. Provide docs first, then dispute if necessary.',
                impact: 'negative',
                score: 25
              },
              {
                text: 'Switch insurance companies to avoid dealing with this',
                reasoning: 'You can\'t switch retroactively, and this won\'t solve the current claim.',
                impact: 'negative',
                score: 0
              }
            ],
            correctAnswer: 1,
            explanation: 'Always respond promptly to insurance requests. Keep detailed records of all communications, claim numbers, and reference numbers. Follow up if you don\'t hear back within their stated timeframe. Being organized and persistent gets claims processed correctly.',
            consequences: [
              'Insurance processes claim correctly',
              'Final out-of-pocket cost: $3,000 (deductible)',
              'Claim sets precedent for future similar situations',
              'Avoided potential claim denial'
            ],
            financialImpact: 0
          },
          {
            id: 'payment-planning',
            title: 'Payment Strategy',
            description: 'You need to manage the $3,000 medical bill strategically.',
            situation: 'The hospital billing department called offering several payment options: 1) Pay in full for 10% discount, 2) 12-month payment plan at 0% interest, 3) 24-month plan at 5% interest. You have $3,000 in emergency fund. What should you do?',
            options: [
              {
                text: 'Pay in full immediately to get the 10% discount',
                reasoning: 'This saves $300, but completely depletes your emergency fund for another potential crisis.',
                impact: 'neutral',
                score: 60
              },
              {
                text: 'Take the 12-month payment plan to preserve emergency fund',
                reasoning: 'Smart choice! Keeping emergency fund intact protects against future crises.',
                impact: 'positive',
                score: 90
              },
              {
                text: 'Pay half now and take 12-month plan for the rest',
                reasoning: 'Good compromise that partially preserves emergency fund while reducing payments.',
                impact: 'positive',
                score: 80
              },
              {
                text: 'Take the 24-month plan to minimize monthly payments',
                reasoning: 'The interest cost makes this less optimal when 0% option is available.',
                impact: 'neutral',
                score: 50
              }
            ],
            correctAnswer: 1,
            explanation: 'The 0% payment plan preserves your emergency fund for future crises while avoiding interest charges. Emergency funds are for emergencies, but keeping some cushion is wise since crises often come in clusters. Medical bills are usually very flexible with payment arrangements.',
            consequences: [
              'Monthly payment: $250 for 12 months',
              'Emergency fund preserved: $3,000',
              'Total interest paid: $0',
              'Financial flexibility maintained'
            ],
            financialImpact: 3000
          }
        ];

      case 'market-crash':
        return [
          {
            id: 'market-panic',
            title: 'Market Crash Response',
            description: 'The stock market has dropped 25% in two weeks.',
            situation: 'Your investment portfolio has lost $15,000 in value over two weeks. The news is full of recession predictions. Your retirement account that was worth $60,000 is now worth $45,000. What should you do?',
            options: [
              {
                text: 'Sell everything to prevent further losses',
                reasoning: 'This locks in losses and goes against long-term investing principles.',
                impact: 'critical',
                score: 0
              },
              {
                text: 'Do nothing and stay the course with your investment plan',
                reasoning: 'Excellent! Market volatility is normal, and staying disciplined prevents emotional mistakes.',
                impact: 'positive',
                score: 95
              },
              {
                text: 'Stop contributing to retirement accounts until markets recover',
                reasoning: 'This means missing out on buying investments at lower prices.',
                impact: 'negative',
                score: 30
              },
              {
                text: 'Increase contributions to buy at lower prices',
                reasoning: 'Great strategy if you have stable income! Dollar-cost averaging works well during volatility.',
                impact: 'positive',
                score: 100
              }
            ],
            correctAnswer: 3,
            explanation: 'Market downturns create buying opportunities for long-term investors. If you have stable income and won\'t need the money for 5+ years, increasing contributions during market declines can significantly boost long-term returns. This requires emotional discipline but historically pays off.',
            consequences: [
              'Continued investing during downturn',
              'Purchased more shares at lower prices',
              'Potential for accelerated recovery when markets rebound',
              'Maintained long-term investment discipline'
            ],
            financialImpact: 8000
          },
          {
            id: 'recession-preparation',
            title: 'Recession Readiness',
            description: 'Economic indicators suggest a recession may be coming.',
            situation: 'Economists are predicting a potential recession within 6-12 months. Your job feels secure, but you want to be prepared. You have 3 months of expenses saved and steady income. What\'s your priority?',
            options: [
              {
                text: 'Build emergency fund to 6-12 months of expenses',
                reasoning: 'Excellent priority! Recessions often bring job losses, so extra emergency fund protection is wise.',
                impact: 'positive',
                score: 100
              },
              {
                text: 'Pay off all debt to reduce monthly obligations',
                reasoning: 'Good strategy! Lower monthly payments provide more flexibility during economic uncertainty.',
                impact: 'positive',
                score: 85
              },
              {
                text: 'Invest more aggressively to take advantage of lower prices',
                reasoning: 'This increases risk when job security may be threatened. Build stability first.',
                impact: 'neutral',
                score: 50
              },
              {
                text: 'Spend money on things you want before prices increase',
                reasoning: 'This reduces your financial flexibility when you need it most.',
                impact: 'negative',
                score: 15
              }
            ],
            correctAnswer: 0,
            explanation: 'During recession preparation, prioritize financial stability. Expand your emergency fund to 6-12 months of expenses, especially if your industry is recession-sensitive. This provides maximum flexibility for whatever economic conditions develop.',
            consequences: [
              'Emergency fund increased to 8 months of expenses',
              'Reduced financial stress during economic uncertainty',
              'Flexibility to take calculated risks or weather job loss',
              'Stronger position for post-recession opportunities'
            ],
            financialImpact: 12000
          },
          {
            id: 'opportunity-recognition',
            title: 'Crisis Opportunities',
            description: 'Markets have been down for 6 months and some recovery signs are appearing.',
            situation: 'After 6 months of market decline, some indicators suggest we may be near the bottom. Your emergency fund is strong, your job is secure, and you have extra cash flow. How do you capitalize on this potential opportunity?',
            options: [
              {
                text: 'Wait for clear signs of recovery before investing',
                reasoning: 'By the time recovery is clear, the best opportunities may have passed.',
                impact: 'neutral',
                score: 40
              },
              {
                text: 'Gradually increase investment contributions',
                reasoning: 'Smart approach! Dollar-cost averaging during recovery periods can enhance long-term returns.',
                impact: 'positive',
                score: 90
              },
              {
                text: 'Invest a large lump sum immediately',
                reasoning: 'High risk approach. Could work well but timing the exact bottom is nearly impossible.',
                impact: 'neutral',
                score: 60
              },
              {
                text: 'Focus on paying down mortgage instead of investing',
                reasoning: 'While debt reduction is good, you may miss the recovery in investments.',
                impact: 'neutral',
                score: 55
              }
            ],
            correctAnswer: 1,
            explanation: 'Gradual increased investing during potential recovery allows you to benefit from continued volatility while not trying to time the exact bottom. This strategy captures upside while managing downside risk. Maintain emergency fund while taking measured advantage of opportunities.',
            consequences: [
              'Increased monthly investing from $500 to $800',
              'Benefited from early recovery phase',
              'Maintained financial security throughout',
              'Positioned for strong long-term returns'
            ],
            financialImpact: 15000
          }
        ];

      default:
        return [];
    }
  };

  const handleAnswer = (stepId: string, answerIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [stepId]: answerIndex }));

    // Auto-advance after 2 seconds to show explanation
    setTimeout(() => {
      if (currentStep < simulationSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeSimulation();
      }
    }, 2500);
  };

  const completeSimulation = () => {
    if (!activeScenario || !simulationStartTime) return;

    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - simulationStartTime.getTime()) / 1000 / 60); // minutes

    // Calculate results
    let totalScore = 0;
    let correctAnswers = 0;
    let totalFinancialImpact = 0;

    simulationSteps.forEach((step) => {
      const userAnswer = userAnswers[step.id];
      if (userAnswer !== undefined) {
        const option = step.options[userAnswer];
        totalScore += option.score;
        totalFinancialImpact += step.financialImpact;

        if (userAnswer === step.correctAnswer) {
          correctAnswers++;
        }
      }
    });

    const averageScore = totalScore / simulationSteps.length;
    const accuracy = (correctAnswers / simulationSteps.length) * 100;

    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (averageScore >= 90) grade = 'A';
    else if (averageScore >= 80) grade = 'B';
    else if (averageScore >= 70) grade = 'C';
    else if (averageScore >= 60) grade = 'D';
    else grade = 'F';

    // Generate feedback
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (accuracy >= 80) strengths.push('Excellent crisis decision-making');
    else if (accuracy >= 60) strengths.push('Good understanding of crisis management');
    else improvements.push('Review crisis response fundamentals');

    if (totalFinancialImpact > 0) strengths.push('Positive financial outcomes from decisions');
    else improvements.push('Focus on decisions that preserve financial stability');

    if (timeSpent <= activeScenario.estimatedTime) strengths.push('Efficient decision-making under pressure');
    else improvements.push('Work on making quicker crisis decisions');

    const result: SimulationResult = {
      scenarioId: activeScenario.id,
      totalScore: Math.round(averageScore),
      timeSpent,
      correctAnswers,
      totalQuestions: simulationSteps.length,
      financialOutcome: totalFinancialImpact,
      grade,
      strengths,
      improvements,
      completedAt: new Date()
    };

    setSimulationResult(result);
    setShowResults(true);

    // Record in progress store
    recordSimulationResult(result);
    setCompletedScenarios([...completedScenarios, activeScenario.id]);
  };

  const resetSimulation = () => {
    setActiveScenario(null);
    setCurrentStep(0);
    setSimulationSteps([]);
    setUserAnswers({});
    setSimulationStartTime(null);
    setShowResults(false);
    setSimulationResult(null);
  };

  const getScenarioStatusColor = (scenario: CrisisScenario) => {
    if (!scenario.unlocked) return `${theme.backgrounds.disabled} ${theme.borderColors.primary}`;
    if (completedScenarios.includes(scenario.id)) return `${theme.status.success.bg} ${theme.status.success.border}`;

    switch (scenario.urgency) {
      case 'critical': return `${theme.status.error.bg} ${theme.status.error.border}`;
      case 'high': return `${theme.status.warning.bg} ${theme.status.warning.border}`;
      case 'medium': return `${theme.status.warning.bg} ${theme.status.warning.border}`;
      default: return `${theme.status.info.bg} ${theme.status.info.border}`;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return `${theme.status.success.text} ${theme.status.success.bg}`;
      case 'intermediate': return `${theme.status.warning.text} ${theme.status.warning.bg}`;
      case 'advanced': return `${theme.status.error.text} ${theme.status.error.bg}`;
      default: return `${theme.textColors.secondary} ${theme.backgrounds.disabled}`;
    }
  };

  if (showResults && simulationResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-4xl mx-auto ${className}`}
      >
        <GradientCard variant="glass" gradient="purple" className="p-8">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${simulationResult.grade === 'A' ? theme.status.success.bg.replace('/20', '') :
              simulationResult.grade === 'B' ? theme.status.info.bg.replace('/20', '') :
                simulationResult.grade === 'C' ? theme.status.warning.bg.replace('/20', '') :
                  simulationResult.grade === 'D' ? theme.status.warning.bg.replace('/20', '') : theme.status.error.bg.replace('/20', '')
              }`}>
              <span className={`text-3xl font-bold ${theme.textColors.primary}`}>{simulationResult.grade}</span>
            </div>
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>Crisis Simulation Complete!</h2>
            <p className={`text-lg ${theme.textColors.secondary}`}>{activeScenario?.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`text-center p-4 ${theme.backgrounds.glass} bg-opacity-50 rounded-lg`}>
              <Target className={`w-8 h-8 mx-auto mb-2 ${theme.status.info.text}`} />
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>{simulationResult.totalScore}</div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Average Score</div>
            </div>
            <div className={`text-center p-4 ${theme.backgrounds.glass} bg-opacity-50 rounded-lg`}>
              <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${theme.status.success.text}`} />
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {simulationResult.correctAnswers}/{simulationResult.totalQuestions}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Correct Decisions</div>
            </div>
            <div className={`text-center p-4 ${theme.backgrounds.glass} bg-opacity-50 rounded-lg`}>
              <DollarSign className={`w-8 h-8 mx-auto mb-2 ${simulationResult.financialOutcome >= 0 ? theme.status.success.text : theme.status.error.text
                }`} />
              <div className={`text-2xl font-bold ${simulationResult.financialOutcome >= 0 ? theme.status.success.text : theme.status.error.text
                }`}>
                {simulationResult.financialOutcome >= 0 ? '+' : ''}
                ${Math.abs(simulationResult.financialOutcome).toLocaleString()}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Financial Impact</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {simulationResult.strengths.length > 0 && (
              <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6`}>
                <h3 className={`font-bold ${theme.status.success.text} mb-3 flex items-center gap-2`}>
                  <CheckCircle className="w-5 h-5" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {simulationResult.strengths.map((strength, index) => (
                    <li key={index} className={`${theme.status.success.text} text-sm flex items-start gap-2`}>
                      <span className={`${theme.status.success.text} mt-1`}>✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {simulationResult.improvements.length > 0 && (
              <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-6`}>
                <h3 className={`font-bold ${theme.status.warning.text} mb-3 flex items-center gap-2`}>
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {simulationResult.improvements.map((improvement, index) => (
                    <li key={index} className={`${theme.status.warning.text} text-sm flex items-start gap-2`}>
                      <span className={`${theme.status.warning.text} mt-1`}>!</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetSimulation}
              className={`px-6 py-3 ${theme.backgrounds.cardHover} ${theme.textColors.secondary} rounded-lg font-semibold hover:${theme.backgrounds.card} transition-colors flex items-center gap-2`}
            >
              <RefreshCw className="w-4 h-4" />
              Try Another Scenario
            </button>
            <button
              onClick={() => window.location.href = '/chapter' + (userProgress.currentChapter)}
              className={`px-6 py-3 bg-gradient-to-r from-slate-900 to-blue-900 ${theme.textColors.primary} rounded-lg font-semibold hover:from-slate-900 hover:to-blue-900 transition-colors flex items-center gap-2`}
            >
              <Brain className="w-4 h-4" />
              Continue Learning
            </button>
          </div>
        </GradientCard>
      </motion.div>
    );
  }

  if (activeScenario && simulationSteps.length > 0) {
    const currentSimulationStep = simulationSteps[currentStep];
    const userAnswer = userAnswers[currentSimulationStep.id];
    const hasAnswered = userAnswer !== undefined;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-4xl mx-auto ${className}`}
      >
        <GradientCard variant="glass" gradient="red" className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <activeScenario.icon className={`w-8 h-8 ${theme.status.error.text}`} />
              <div>
                <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>{activeScenario.title}</h2>
                <p className={`${theme.textColors.secondary}`}>{currentSimulationStep.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm ${theme.textColors.secondary}`}>Step {currentStep + 1} of {simulationSteps.length}</div>
              <div className={`text-xs ${theme.textColors.muted} flex items-center gap-1`}>
                <Timer className="w-3 h-3" />
                ~{activeScenario.estimatedTime} min
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className={`w-full ${theme.backgrounds.cardHover} rounded-full h-2 mb-8`}>
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / simulationSteps.length) * 100}%` }}
            />
          </div>

          {/* Situation */}
          <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-6 mb-8`}>
            <h3 className={`font-bold ${theme.status.error.text} mb-3`}>Crisis Situation</h3>
            <p className={`${theme.status.error.text} leading-relaxed`}>{currentSimulationStep.situation}</p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            <h3 className={`font-bold ${theme.textColors.primary} mb-4`}>What should you do?</h3>
            {currentSimulationStep.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => !hasAnswered && handleAnswer(currentSimulationStep.id, index)}
                disabled={hasAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${hasAnswered && index === userAnswer
                  ? index === currentSimulationStep.correctAnswer
                    ? `${theme.status.success.border} ${theme.status.success.bg}`
                    : `${theme.status.error.border} ${theme.status.error.bg}`
                  : hasAnswered && index === currentSimulationStep.correctAnswer
                    ? `${theme.status.success.border} ${theme.status.success.bg}`
                    : hasAnswered
                      ? `${theme.borderColors.primary} ${theme.backgrounds.cardHover} opacity-60`
                      : `${theme.borderColors.primary} hover:${theme.status.error.border} hover:${theme.status.error.bg}`
                  } ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                whileTap={!hasAnswered ? { scale: 0.98 } : {}}
              >
                <div className="flex items-start justify-between">
                  <span className={`font-medium ${theme.textColors.primary}`}>{option.text}</span>
                  {hasAnswered && (
                    <div className="ml-4 flex-shrink-0">
                      {index === currentSimulationStep.correctAnswer ? (
                        <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                      ) : index === userAnswer ? (
                        <XCircle className={`w-5 h-5 ${theme.status.error.text}`} />
                      ) : null}
                    </div>
                  )}
                </div>
                {hasAnswered && (
                  <div className={`mt-2 text-sm ${theme.textColors.secondary}`}>
                    {option.reasoning}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Explanation (shown after answer) */}
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6`}
            >
              <h4 className={`font-bold ${theme.status.info.text} mb-3`}>Explanation</h4>
              <p className={`${theme.status.info.text} mb-4`}>{currentSimulationStep.explanation}</p>

              <div className={`${theme.backgrounds.glass} bg-opacity-60 rounded p-4`}>
                <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>Consequences:</h5>
                <ul className={`text-sm ${theme.textColors.primary} space-y-1`}>
                  {currentSimulationStep.consequences.map((consequence, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className={`${theme.textColors.primary} mt-0.5`}>•</span>
                      {consequence}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </GradientCard>
      </motion.div>
    );
  }

  // Main scenario selection screen
  return (
    <div className={`space-y-6 ${className}`}>
      <GradientCard variant="glass" gradient="red" className="p-8 text-center">
        <AlertTriangle className={`w-16 h-16 ${theme.status.error.text} mx-auto mb-4`} />
        <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-4`}>Crisis Simulation Training</h2>
        <p className={`text-lg ${theme.textColors.secondary} max-w-3xl mx-auto`}>
          Practice handling financial emergencies in a safe environment. Learn to make sound decisions under pressure
          and build confidence for real-world crisis situations.
        </p>
      </GradientCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isCompleted = completedScenarios.includes(scenario.id);

          return (
            <motion.div
              key={scenario.id}
              whileHover={{ scale: scenario.unlocked ? 1.02 : 1 }}
              className={`${getScenarioStatusColor(scenario)} border-2 rounded-lg p-6 transition-all ${scenario.unlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              onClick={() => scenario.unlocked && startSimulation(scenario)}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className={`w-8 h-8 ${!scenario.unlocked ? theme.textColors.muted :
                  scenario.urgency === 'critical' ? '${theme.status.error.text}' :
                    scenario.urgency === 'high' ? '${theme.status.warning.text}' :
                      scenario.urgency === 'medium' ? '${theme.status.warning.text}' : '${theme.textColors.primary}'
                  }`} />
                {isCompleted && (
                  <Award className={`w-6 h-6 ${theme.status.success.text}`} />
                )}
              </div>

              <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-2`}>{scenario.title}</h3>
              <p className={`${theme.textColors.secondary} text-sm mb-4 leading-relaxed`}>{scenario.description}</p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                  <span className={`${theme.textColors.secondary} flex items-center gap-1`}>
                    <Timer className="w-3 h-3" />
                    {scenario.estimatedTime} min
                  </span>
                </div>

                {!scenario.unlocked && (
                  <div className={`${theme.textColors.muted} text-center pt-2`}>
                    Complete Chapter {scenario.requiredChapter} to unlock
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

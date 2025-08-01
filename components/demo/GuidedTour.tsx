'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  Star,
  Brain,
  Calculator,
  Mic,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import GradientCard from '@/components/shared/ui/GradientCard';
import { theme } from '@/lib/theme';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
  action?: () => void;
  targetUrl?: string;
  demoContent?: React.ReactNode;
}

interface GuidedTourProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function GuidedTour({ onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Start the tour automatically when component mounts
  useEffect(() => {
    setCurrentStep(0);
  }, []);

  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Finance Quest',
      description: 'An AI-powered platform solving the 64% financial illiteracy crisis through real market data, personalized coaching, and interactive learning.',
      icon: <Star className="w-8 h-8 text-amber-400" />,
      highlight: '1. Contest Innovation: Real AI integration, not simulated chatbots'
    },
    {
      id: 'market-data',
      title: 'Live Market Data Integration',
      description: 'Real-time stock quotes from Yahoo Finance API and Federal Reserve economic data, with robust fallback systems for demos.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      highlight: '2. Technical Achievement: Live data with 30-second updates',
      targetUrl: '/#market-ticker'
    },
    {
      id: 'ai-assessment',
      title: 'AI Financial Health Score',
      description: 'OpenAI GPT-4o-mini powered assessment providing personalized financial health scoring and actionable recommendations.',
      icon: <Brain className="w-8 h-8 text-slate-400" />,
      highlight: '3. AI Innovation: Personalized coaching based on real assessment',
      targetUrl: '/health-assessment'
    },
    {
      id: 'voice-interface',
      title: 'Voice Q&A Accessibility',
      description: 'Speech recognition and synthesis for inclusive learning, supporting users with different accessibility needs.',
      icon: <Mic className="w-8 h-8 text-amber-400" />,
      highlight: '4. Accessibility Innovation: Voice-first financial education',
      demoContent: (
        <div className="bg-amber-500/20 p-4 rounded-lg border border-amber-500/30">
          <p className="text-sm text-amber-300 mb-2">Try asking: &ldquo;How does compound interest work?&rdquo;</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-400">Voice recognition active in Chrome/Edge</span>
          </div>
        </div>
      )
    },
    {
      id: 'calculators',
      title: 'Interactive Learning Tools',
      description: 'Four specialized calculators: Paycheck, Compound Interest, Budget Builder, and Debt Payoff with real-time visualization.',
      icon: <Calculator className="w-8 h-8 text-blue-400" />,
      highlight: '5. Educational Tools: Immediate practical application',
      targetUrl: '/calculators'
    },
    {
      id: 'assessment',
      title: 'Before/After Assessment System',
      description: 'Quantifiable learning outcomes measurement demonstrating 42% average knowledge improvement for contest judges.',
      icon: <CheckCircle className="w-8 h-8 text-slate-400" />,
      highlight: '6. Contest Metrics: Measurable impact demonstration',
      targetUrl: '/assessment'
    },
    {
      id: 'progress-tracking',
      title: 'Advanced Progress Analytics',
      description: 'Comprehensive learning analytics with spaced repetition, achievement tracking, and personalized learning paths.',
      icon: <Target className="w-8 h-8 text-slate-400" />,
      highlight: '7. Learning Science: SM-2 algorithm for memory optimization',
      targetUrl: '/progress'
    },
    {
      id: 'impact-dashboard',
      title: 'Real-Time Impact Visualization',
      description: 'Live demonstration of potential lifetime savings, knowledge improvement rates, and social impact metrics.',
      icon: <Target className="w-8 h-8 text-amber-400" />,
      highlight: '8. Contest Impact: Real-time quantifiable results',
      targetUrl: '/impact'
    },
    {
      id: 'impact',
      title: 'Measurable Learning Outcomes',
      description: 'Before/after assessments, confidence tracking, and behavioral change measurement for demonstrable impact.',
      icon: <Award className="w-8 h-8 text-amber-400" />,
      highlight: '9. Contest Impact: Quantifiable financial literacy improvement'
    }
  ];

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCompletedSteps(prev => [...prev, demoSteps[currentStep].id]);
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTour = () => {
    setCompletedSteps(prev => [...prev, demoSteps[currentStep].id]);
    onComplete?.();
  };

  const skipTour = () => {
    onSkip?.();
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const navigateToTarget = () => {
    const step = demoSteps[currentStep];
    if (step.targetUrl) {
      window.open(step.targetUrl, '_blank');
    }
  };

  // Since the tour starts automatically, we don't need the floating button
  // Just return the tour modal directly
  const currentStepData = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`${theme.backgrounds.card} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden border ${theme.borderColors.primary}`}
        >
          {/* Header */}
          <div className={`${theme.backgrounds.header} p-4 sm:p-6 flex-shrink-0 border-b ${theme.borderColors.accent}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold ${theme.textColors.primary}`}>{currentStepData.title}</h2>
                  <p className={`${theme.textColors.secondary} text-sm`}>Step {currentStep + 1} of {demoSteps.length}</p>
                </div>
              </div>
              <button
                onClick={skipTour}
                className={`${theme.textColors.primary} hover:${theme.textColors.accent} transition-colors p-1`}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className={`w-full ${theme.backgrounds.cardHover} rounded-full h-2`}>
              <motion.div
                className="bg-amber-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
              {/* Description */}
              <div className="flex flex-col">
                <GradientCard variant="glass" gradient="blue" className="p-6 mb-6 flex-shrink-0">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-amber-500/20 p-2 rounded-lg">
                      <Star className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme.textColors.primary} mb-1`}>Contest Highlight</h3>
                      <p className="text-sm text-amber-400">{currentStepData.highlight}</p>
                    </div>
                  </div>
                </GradientCard>

                <p className={`${theme.textColors.secondary} text-lg leading-relaxed mb-6 flex-shrink-0`}>
                  {currentStepData.description}
                </p>

                {currentStepData.demoContent && (
                  <div className="mb-6 flex-shrink-0">
                    {currentStepData.demoContent}
                  </div>
                )}

                {currentStepData.targetUrl && (
                  <button
                    onClick={navigateToTarget}
                    className={`${theme.buttons.primary} px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mb-4 flex-shrink-0 w-fit`}
                  >
                    <ArrowRight className="w-4 h-4" />
                    View Live Feature
                  </button>
                )}
              </div>

              {/* Step Navigator */}
              <div className="flex flex-col min-h-0">
                <h4 className={`font-semibold ${theme.textColors.primary} mb-4 flex-shrink-0`}>Demo Overview</h4>
                <div className="space-y-2 overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
                  {demoSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => goToStep(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-6 ${
                        index === currentStep
                          ? `${theme.backgrounds.cardHover} border-2 ${theme.borderColors.accent}`
                          : completedSteps.includes(step.id)
                          ? 'bg-amber-500/20 border border-amber-500/30'
                          : `${theme.backgrounds.card} border ${theme.borderColors.primary} hover:${theme.backgrounds.cardHover}`
                      }`}
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 flex-shrink-0">{step.icon}</div>
                      )}
                      <div>
                        <p className={`font-medium ${
                          index === currentStep ? 'text-amber-400' : `${theme.textColors.primary}`
                        }`}>
                          {step.title}
                        </p>
                        <p className={`text-xs ${theme.textColors.secondary}`}>
                          {step.highlight.split(':')[0]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`${theme.backgrounds.header} px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 flex-shrink-0 border-t ${theme.borderColors.primary}`}>
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 ${theme.textColors.secondary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={skipTour}
                className={`${theme.textColors.secondary} hover:${theme.textColors.primary} transition-colors text-sm sm:text-base`}
              >
                Skip Tour
              </button>
              
              <button
                onClick={nextStep}
                className={`${theme.buttons.accent} px-4 sm:px-6 py-2 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl`}
              >
                <span className="hidden sm:inline">
                  {currentStep === demoSteps.length - 1 ? 'Complete Tour' : 'Next Step'}
                </span>
                <span className="sm:hidden">
                  {currentStep === demoSteps.length - 1 ? 'Complete' : 'Next'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

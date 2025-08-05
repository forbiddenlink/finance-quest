'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';

interface BankChoice {
  id: string;
  type: 'local' | 'online' | 'credit-union';
  name: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  savingsAPY: number;
  checkingFee: number;
}

interface BankingSetup {
  primaryBank: BankChoice | null;
  savingsBank: BankChoice | null;
  automationLevel: 'basic' | 'intermediate' | 'advanced';
  monthlyTransfer: number;
  emergencyFundGoal: number;
}

const bankOptions: BankChoice[] = [
  {
    id: 'local-bank',
    type: 'local',
    name: 'Local Community Bank',
    pros: ['Personal service', 'Local ATMs', 'Relationship benefits', 'In-person support'],
    cons: ['Higher fees', 'Lower rates', 'Limited locations', 'Basic technology'],
    bestFor: 'People who value personal relationships and in-person banking',
    savingsAPY: 1.5,
    checkingFee: 10
  },
  {
    id: 'credit-union',
    type: 'credit-union',
    name: 'Federal Credit Union',
    pros: ['Lower fees', 'Better rates', 'Member-owned', 'Personal service'],
    cons: ['Membership requirements', 'Fewer locations', 'Limited hours', 'Shared branching needed'],
    bestFor: 'Members seeking better rates and lower fees with decent service',
    savingsAPY: 2.8,
    checkingFee: 0
  },
  {
    id: 'online-bank',
    type: 'online',
    name: 'High-Yield Online Bank',
    pros: ['Highest rates', 'No fees', 'Great mobile app', 'ATM fee reimbursement'],
    cons: ['No physical branches', 'Slower check deposits', 'Limited cash access', 'Digital-only support'],
    bestFor: 'Tech-savvy users who rarely need physical branches',
    savingsAPY: 4.5,
    checkingFee: 0
  }
];

const wizardSteps = [
  { id: 'primary', title: 'Choose Primary Bank', description: 'Select your main checking account bank' },
  { id: 'savings', title: 'High-Yield Savings', description: 'Optimize your savings rate' },
  { id: 'automation', title: 'Set Up Automation', description: 'Configure automatic transfers' },
  { id: 'review', title: 'Review Setup', description: 'See your optimized banking strategy' }
];

interface InteractiveBankingWizardProps {
  onComplete?: (setup: BankingSetup) => void;
}

export default function InteractiveBankingWizard({ onComplete }: InteractiveBankingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [setup, setSetup] = useState<BankingSetup>({
    primaryBank: null,
    savingsBank: null,
    automationLevel: 'basic',
    monthlyTransfer: 200,
    emergencyFundGoal: 6000
  });

  const handleBankSelect = (bank: BankChoice, type: 'primary' | 'savings') => {
    setSetup(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryBank' : 'savingsBank']: bank
    }));
  };

  const calculateAnnualSavings = () => {
    if (!setup.primaryBank || !setup.savingsBank) return 0;
    
    // Compare against typical big bank setup
    const bigBankFees = 180; // $15/month
    const bigBankSavingsRate = 0.0001;
    
    const currentFees = setup.primaryBank.checkingFee * 12;
    const currentSavingsEarning = setup.emergencyFundGoal * (setup.savingsBank.savingsAPY / 100);
    const bigBankSavingsEarning = setup.emergencyFundGoal * bigBankSavingsRate;
    
    const totalSavings = (bigBankFees - currentFees) + (currentSavingsEarning - bigBankSavingsEarning);
    return Math.max(0, totalSavings);
  };

  const nextStep = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(setup);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return setup.primaryBank !== null;
      case 1: return setup.savingsBank !== null;
      case 2: return setup.monthlyTransfer > 0;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      {/* Progress Header */}
      <div className="mb-8">
        <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Building2 className="w-6 h-6" />
          Interactive Banking Setup Wizard
        </h3>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-6">
          {wizardSteps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-all ${
                index <= currentStep 
                  ? `${theme.status.success.bg} ${theme.status.success.text} ${theme.status.success.border}` 
                  : `${theme.borderColors.muted} ${theme.textColors.muted}`
              }`}>
                {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < wizardSteps.length - 1 && (
                <div className={`flex-1 h-1 mx-3 rounded transition-all ${
                  index < currentStep ? theme.status.success.bg : theme.borderColors.muted
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>
            {wizardSteps[currentStep].title}
          </h4>
          <p className={`${theme.textColors.secondary}`}>
            {wizardSteps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {/* Step 1: Primary Bank */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg mb-6`}>
                <p className={`${theme.status.info.text} font-medium`}>
                  💡 Your primary bank handles daily transactions, bill payments, and ATM access. Choose based on convenience and fees.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bankOptions.map((bank) => (
                  <motion.div
                    key={bank.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      setup.primaryBank?.id === bank.id
                        ? `${theme.borderColors.primary} ${theme.status.info.bg}`
                        : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBankSelect(bank, 'primary')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-bold ${theme.textColors.primary}`}>{bank.name}</h4>
                      {setup.primaryBank?.id === bank.id && (
                        <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Monthly Fee:</span>
                        <span className={`font-bold ${bank.checkingFee === 0 ? theme.status.success.text : theme.status.error.text}`}>
                          {bank.checkingFee === 0 ? 'FREE' : `$${bank.checkingFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Savings APY:</span>
                        <span className="font-bold">{bank.savingsAPY}%</span>
                      </div>
                    </div>

                    <p className={`text-xs ${theme.textColors.muted} italic mb-3`}>
                      {bank.bestFor}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h5 className={`text-xs font-bold ${theme.status.success.text} mb-1`}>Pros</h5>
                        <ul className={`text-xs ${theme.textColors.secondary} space-y-1`}>
                          {bank.pros.slice(0, 2).map((pro, index) => (
                            <li key={index}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${theme.status.error.text} mb-1`}>Cons</h5>
                        <ul className={`text-xs ${theme.textColors.secondary} space-y-1`}>
                          {bank.cons.slice(0, 2).map((con, index) => (
                            <li key={index}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Savings Bank */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className={`p-4 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg mb-6`}>
                <p className={`${theme.status.warning.text} font-medium`}>
                  🚀 Your savings bank should maximize interest earnings. Online banks typically offer 50x higher rates than traditional banks!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bankOptions.map((bank) => {
                  const isOptimal = bank.savingsAPY >= 4.0;
                  return (
                    <motion.div
                      key={bank.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        setup.savingsBank?.id === bank.id
                          ? `${theme.borderColors.primary} ${theme.status.info.bg}`
                          : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                      } ${isOptimal ? `ring-2 ring-green-400` : ''}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBankSelect(bank, 'savings')}
                    >
                      {isOptimal && (
                        <div className={`absolute -top-2 -right-2 ${theme.status.success.bg} ${theme.status.success.text} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                          <Star className="w-3 h-3" />
                          OPTIMAL
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-bold ${theme.textColors.primary}`}>{bank.name}</h4>
                        {setup.savingsBank?.id === bank.id && (
                          <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                        )}
                      </div>
                      
                      <div className={`p-3 ${theme.status.success.bg} rounded-lg text-center mb-4`}>
                        <div className={`text-2xl font-bold ${theme.status.success.text}`}>
                          {bank.savingsAPY}%
                        </div>
                        <div className={`text-xs ${theme.status.success.text}`}>
                          Annual APY
                        </div>
                      </div>

                      <div className={`text-center p-2 ${theme.backgrounds.cardHover} rounded`}>
                        <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                          $10,000 earns annually:
                        </div>
                        <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                          ${(10000 * bank.savingsAPY / 100).toFixed(0)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Rate Comparison */}
              <div className={`mt-6 p-4 ${theme.backgrounds.cardHover} rounded-lg`}>
                <h4 className={`font-bold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                  <TrendingUp className="w-5 h-5" />
                  Rate Impact Comparison
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className={`p-3 ${theme.status.error.bg} rounded`}>
                    <div className={`text-sm ${theme.status.error.text} mb-1`}>Big Bank</div>
                    <div className={`text-xl font-bold ${theme.status.error.text}`}>$1</div>
                    <div className={`text-xs ${theme.status.error.text}`}>on $10,000</div>
                  </div>
                  <div className={`p-3 ${theme.status.warning.bg} rounded`}>
                    <div className={`text-sm ${theme.status.warning.text} mb-1`}>Credit Union</div>
                    <div className={`text-xl font-bold ${theme.status.warning.text}`}>$280</div>
                    <div className={`text-xs ${theme.status.warning.text}`}>on $10,000</div>
                  </div>
                  <div className={`p-3 ${theme.status.success.bg} rounded`}>
                    <div className={`text-sm ${theme.status.success.text} mb-1`}>Online Bank</div>
                    <div className={`text-xl font-bold ${theme.status.success.text}`}>$450</div>
                    <div className={`text-xs ${theme.status.success.text}`}>on $10,000</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Automation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
                <p className={`${theme.status.info.text} font-medium`}>
                  🤖 Automation is the secret to effortless saving. Set it up once and watch your wealth grow without willpower!
                </p>
              </div>

              {/* Automation Level */}
              <div>
                <h4 className={`font-bold ${theme.textColors.primary} mb-4`}>Choose Your Automation Level</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      level: 'basic' as const,
                      title: 'Basic Automation',
                      description: 'Simple automatic savings transfer',
                      features: ['Automatic transfer to savings', 'Basic account alerts']
                    },
                    {
                      level: 'intermediate' as const,
                      title: 'Smart Automation',
                      description: 'Percentage-based with goals',
                      features: ['Percentage-based transfers', 'Goal tracking', 'Bill pay automation']
                    },
                    {
                      level: 'advanced' as const,
                      title: 'Pro Automation',
                      description: 'Full financial automation',
                      features: ['Dynamic transfers', 'Investment automation', 'Rebalancing alerts', 'Tax optimization']
                    }
                  ].map((option) => (
                    <motion.div
                      key={option.level}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        setup.automationLevel === option.level
                          ? `${theme.borderColors.primary} ${theme.status.info.bg}`
                          : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSetup(prev => ({ ...prev, automationLevel: option.level }))}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className={`font-bold ${theme.textColors.primary}`}>{option.title}</h5>
                        {setup.automationLevel === option.level && (
                          <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                        )}
                      </div>
                      <p className={`text-sm ${theme.textColors.secondary} mb-3`}>{option.description}</p>
                      <ul className={`text-xs ${theme.textColors.muted} space-y-1`}>
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Monthly Transfer Amount */}
              <div>
                <h4 className={`font-bold ${theme.textColors.primary} mb-4`}>Monthly Savings Transfer</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                      Monthly Transfer Amount
                    </label>
                    <input
                      type="number"
                      value={setup.monthlyTransfer}
                      onChange={(e) => setSetup(prev => ({ ...prev, monthlyTransfer: parseInt(e.target.value) || 0 }))}
                      className={`w-full p-3 ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                      min="0"
                      step="50"
                    />
                    <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                      Recommended: 20% of income
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                      Emergency Fund Goal
                    </label>
                    <input
                      type="number"
                      value={setup.emergencyFundGoal}
                      onChange={(e) => setSetup(prev => ({ ...prev, emergencyFundGoal: parseInt(e.target.value) || 0 }))}
                      className={`w-full p-3 ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                      min="0"
                      step="1000"
                    />
                    <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                      Recommended: 3-6 months expenses
                    </p>
                  </div>
                </div>

                {/* Transfer Timeline */}
                <div className={`mt-4 p-4 ${theme.backgrounds.cardHover} rounded-lg`}>
                  <h5 className={`font-bold ${theme.textColors.primary} mb-2`}>Your Savings Timeline</h5>
                  <div className="flex items-center justify-between">
                    <span className={`${theme.textColors.secondary}`}>Time to reach goal:</span>
                    <span className={`font-bold ${theme.textColors.primary}`}>
                      {setup.monthlyTransfer > 0 ? Math.ceil(setup.emergencyFundGoal / setup.monthlyTransfer) : '∞'} months
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className={`p-6 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg text-center`}>
                <Shield className={`w-12 h-12 ${theme.status.success.text} mx-auto mb-3`} />
                <h4 className={`text-xl font-bold ${theme.status.success.text} mb-2`}>
                  Banking Setup Complete!
                </h4>
                <p className={`${theme.status.success.text}`}>
                  Your optimized banking strategy will save you ${calculateAnnualSavings().toFixed(0)} annually!
                </p>
              </div>

              {/* Setup Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 ${theme.backgrounds.cardHover} rounded-lg`}>
                  <h5 className={`font-bold ${theme.textColors.primary} mb-3`}>Your Banking Setup</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Primary Bank:</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {setup.primaryBank?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Savings Bank:</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {setup.savingsBank?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Automation:</span>
                      <span className={`font-bold ${theme.textColors.primary} capitalize`}>
                        {setup.automationLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Monthly Transfer:</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        ${setup.monthlyTransfer}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 ${theme.backgrounds.cardHover} rounded-lg`}>
                  <h5 className={`font-bold ${theme.textColors.primary} mb-3`}>Annual Benefits</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Fee Savings:</span>
                      <span className={`font-bold ${theme.status.success.text}`}>
                        ${setup.primaryBank ? (180 - setup.primaryBank.checkingFee * 12) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textColors.secondary}`}>Interest Earnings:</span>
                      <span className={`font-bold ${theme.status.success.text}`}>
                        ${setup.savingsBank ? (setup.emergencyFundGoal * setup.savingsBank.savingsAPY / 100).toFixed(0) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className={`font-bold ${theme.textColors.primary}`}>Total Annual Benefit:</span>
                      <span className={`font-bold text-xl ${theme.status.success.text}`}>
                        ${calculateAnnualSavings().toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
                <h5 className={`font-bold ${theme.textColors.primary} mb-3`}>Next Steps - Do This Week:</h5>
                <div className="space-y-2">
                  {[
                    `Open account at ${setup.savingsBank?.name} for high-yield savings`,
                    `Set up automatic transfer of $${setup.monthlyTransfer}/month`,
                    'Configure account alerts for balance monitoring',
                    'Link accounts for overdraft protection',
                    'Update direct deposit allocation if needed'
                  ].map((action, index) => (
                    <label key={index} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className={`text-sm ${theme.textColors.secondary}`}>{action}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center px-6 py-3 ${theme.textColors.secondary} border-2 ${theme.borderColors.muted} rounded-xl hover:${theme.borderColors.primary} hover:${theme.textColors.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {wizardSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index <= currentStep ? theme.status.success.bg : theme.borderColors.muted
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={!canProceed()}
          className={`flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover-lift`}
        >
          {currentStep === wizardSteps.length - 1 ? 'Complete Setup' : 'Next Step'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import { 
  CreditCard, 
  Gift, 
  Star, 
  Target,
  DollarSign,
  Plane,
  ShoppingCart,
  Fuel,
  Coffee,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CreditCardRewardsOptimizerProps {
  onComplete?: () => void;
}

interface SpendingProfile {
  groceries: number;
  gas: number;
  dining: number;
  travel: number;
  streaming: number;
  shopping: number;
  utilities: number;
  other: number;
}

interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  welcomeBonus: number;
  welcomeSpendRequirement: number;
  rewardCategories: {
    [key: string]: number;
  };
  generalCashback: number;
  pros: string[];
  cons: string[];
  bestFor: string;
}

interface CardRecommendation {
  card: CreditCard;
  annualValue: number;
  netValue: number;
  categoryBreakdown: { [key: string]: number };
  reason: string;
}

export default function CreditCardRewardsOptimizer({ onComplete }: CreditCardRewardsOptimizerProps) {
  const { recordCalculatorUsage } = useProgressStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [spendingProfile, setSpendingProfile] = useState<SpendingProfile>({
    groceries: 400,
    gas: 200,
    dining: 300,
    travel: 500,
    streaming: 50,
    shopping: 600,
    utilities: 200,
    other: 400
  });
  const [recommendations, setRecommendations] = useState<CardRecommendation[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    recordCalculatorUsage('credit-card-rewards-optimizer');
  }, [recordCalculatorUsage]);

  const creditCards: CreditCard[] = [
    {
      id: 'chase-sapphire-preferred',
      name: 'Chase Sapphire Preferred',
      issuer: 'Chase',
      annualFee: 95,
      welcomeBonus: 600,
      welcomeSpendRequirement: 4000,
      rewardCategories: {
        travel: 2,
        dining: 2
      },
      generalCashback: 1,
      pros: ['Excellent travel benefits', 'Strong welcome bonus', 'Transfer partners'],
      cons: ['Annual fee', 'Limited high-earning categories'],
      bestFor: 'Travel and dining enthusiasts'
    },
    {
      id: 'citi-double-cash',
      name: 'Citi Double Cash',
      issuer: 'Citi',
      annualFee: 0,
      welcomeBonus: 200,
      welcomeSpendRequirement: 1500,
      rewardCategories: {},
      generalCashback: 2,
      pros: ['No annual fee', '2% on everything', 'Simple rewards'],
      cons: ['No category bonuses', 'Limited welcome bonus'],
      bestFor: 'Simple cashback seekers'
    },
    {
      id: 'discover-it-cash-back',
      name: 'Discover it Cash Back',
      issuer: 'Discover',
      annualFee: 0,
      welcomeBonus: 0,
      welcomeSpendRequirement: 0,
      rewardCategories: {
        rotating: 5 // Represents rotating quarterly categories
      },
      generalCashback: 1,
      pros: ['No annual fee', '5% rotating categories', 'First year cashback match'],
      cons: ['Quarterly activation required', 'Limited acceptance'],
      bestFor: 'Category bonus maximizers'
    },
    {
      id: 'amex-blue-cash-preferred',
      name: 'Blue Cash Preferred',
      issuer: 'American Express',
      annualFee: 95,
      welcomeBonus: 350,
      welcomeSpendRequirement: 3000,
      rewardCategories: {
        groceries: 6,
        streaming: 6,
        gas: 3
      },
      generalCashback: 1,
      pros: ['High grocery rewards', 'Streaming bonus', 'Good welcome bonus'],
      cons: ['Annual fee', 'Category limits'],
      bestFor: 'Grocery and streaming heavy users'
    },
    {
      id: 'capital-one-venture',
      name: 'Venture Rewards',
      issuer: 'Capital One',
      annualFee: 95,
      welcomeBonus: 750,
      welcomeSpendRequirement: 4000,
      rewardCategories: {},
      generalCashback: 2,
      pros: ['2% on everything', 'Strong welcome bonus', 'Travel benefits'],
      cons: ['Annual fee', 'No category bonuses'],
      bestFor: 'Travel-focused simple rewards'
    },
    {
      id: 'chase-freedom-unlimited',
      name: 'Freedom Unlimited',
      issuer: 'Chase',
      annualFee: 0,
      welcomeBonus: 200,
      welcomeSpendRequirement: 500,
      rewardCategories: {
        dining: 3,
        drugstores: 3
      },
      generalCashback: 1.5,
      pros: ['No annual fee', 'Good general rate', 'Dining bonus'],
      cons: ['Limited high-earning categories', 'Lower welcome bonus'],
      bestFor: 'No-fee card seekers'
    }
  ];

  const spendingCategories = [
    { key: 'groceries', label: 'Groceries', icon: ShoppingCart, description: 'Supermarkets, grocery stores' },
    { key: 'gas', label: 'Gas & Auto', icon: Fuel, description: 'Gas stations, auto services' },
    { key: 'dining', label: 'Dining', icon: Coffee, description: 'Restaurants, takeout, delivery' },
    { key: 'travel', label: 'Travel', icon: Plane, description: 'Hotels, flights, car rentals' },
    { key: 'streaming', label: 'Streaming', icon: Star, description: 'Netflix, Spotify, etc.' },
    { key: 'shopping', label: 'Online Shopping', icon: Gift, description: 'Amazon, retail websites' },
    { key: 'utilities', label: 'Utilities', icon: Zap, description: 'Electric, water, internet' },
    { key: 'other', label: 'Other', icon: DollarSign, description: 'Everything else' }
  ];

  const calculateCardValue = (card: CreditCard, spending: SpendingProfile): CardRecommendation => {
    let annualValue = 0;
    const categoryBreakdown: { [key: string]: number } = {};

    // Calculate category rewards
    Object.entries(spending).forEach(([category, amount]) => {
      const monthlyAmount = amount;
      const annualAmount = monthlyAmount * 12;
      
      let rewardRate = card.generalCashback;
      
      // Check for specific category bonuses
      if (card.rewardCategories[category]) {
        rewardRate = card.rewardCategories[category];
      }
      
      // Special handling for rotating categories (simplified)
      if (card.rewardCategories.rotating && ['groceries', 'gas', 'dining', 'shopping'].includes(category)) {
        rewardRate = Math.max(rewardRate, card.rewardCategories.rotating * 0.25); // Assume 25% category overlap
      }
      
      const categoryValue = annualAmount * (rewardRate / 100);
      annualValue += categoryValue;
      categoryBreakdown[category] = categoryValue;
    });

    // Add welcome bonus (amortized over 2 years)
    const totalAnnualSpending = Object.values(spending).reduce((sum, amount) => sum + amount * 12, 0);
    if (totalAnnualSpending >= card.welcomeSpendRequirement) {
      annualValue += card.welcomeBonus / 2;
    }

    const netValue = annualValue - card.annualFee;

    // Generate recommendation reason
    let reason = '';
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([cat]) => cat);

    if (card.annualFee === 0) {
      reason = `No annual fee with solid ${(card.generalCashback)}% general rewards`;
    } else if (netValue > annualValue * 0.8) {
      reason = `High value despite $${card.annualFee} fee, especially for ${topCategories.join(' and ')}`;
    } else {
      reason = `Good welcome bonus and rewards for ${card.bestFor.toLowerCase()}`;
    }

    return {
      card,
      annualValue,
      netValue,
      categoryBreakdown,
      reason
    };
  };

  const generateRecommendations = () => {
    const cardValues = creditCards.map(card => calculateCardValue(card, spendingProfile));
    
    // Sort by net value and take top 3
    const sortedCards = cardValues.sort((a, b) => b.netValue - a.netValue).slice(0, 3);
    
    setRecommendations(sortedCards);
    setShowResults(true);
    
    toast.success('Credit card recommendations generated! 💳', { duration: 3000 });
  };

  const updateSpending = (category: keyof SpendingProfile, value: number) => {
    setSpendingProfile(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < spendingCategories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
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
    setRecommendations([]);
    setSpendingProfile({
      groceries: 400,
      gas: 200,
      dining: 300,
      travel: 500,
      streaming: 50,
      shopping: 600,
      utilities: 200,
      other: 400
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalMonthlySpending = Object.values(spendingProfile).reduce((sum, amount) => sum + amount, 0);
  const totalAnnualSpending = totalMonthlySpending * 12;

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <GradientCard variant="glass" gradient="blue" className="p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.success.bg} rounded-full mb-4`}>
              <Award className={`w-8 h-8 ${theme.status.success.text}`} />
            </div>
            <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
              Your Personalized Credit Card Recommendations
            </h2>
            <p className={`${theme.textColors.secondary} mb-4`}>
              Based on your {formatCurrency(totalMonthlySpending)}/month spending pattern
            </p>
            <div className={`inline-flex items-center px-4 py-2 ${theme.status.info.bg} rounded-full`}>
              <TrendingUp className={`w-4 h-4 ${theme.status.info.text} mr-2`} />
              <span className={`text-sm ${theme.status.info.text} font-medium`}>
                Annual Spending: {formatCurrency(totalAnnualSpending)}
              </span>
            </div>
          </div>

          {/* Top Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GradientCard 
                  variant="glass" 
                  gradient={index === 0 ? "yellow" : index === 1 ? "green" : "purple"} 
                  className={`p-6 relative ${index === 0 ? 'ring-2 ring-yellow-400/50' : ''}`}
                >
                  {index === 0 && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 ${theme.status.warning.bg} rounded-full`}>
                      <span className={`text-xs font-bold ${theme.status.warning.text}`}>BEST MATCH</span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.status.info.bg} rounded-full mb-3`}>
                      <CreditCard className={`w-6 h-6 ${theme.status.info.text}`} />
                    </div>
                    <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-1`}>
                      {rec.card.name}
                    </h3>
                    <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                      {rec.card.issuer}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textColors.secondary}`}>Annual Value:</span>
                        <span className={`font-bold text-green-400`}>
                          {formatCurrency(rec.annualValue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${theme.textColors.secondary}`}>Annual Fee:</span>
                        <span className={`font-bold ${rec.card.annualFee > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {rec.card.annualFee > 0 ? `-${formatCurrency(rec.card.annualFee)}` : 'FREE'}
                        </span>
                      </div>
                      <div className={`border-t ${theme.borderColors.primary} pt-2`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-semibold ${theme.textColors.primary}`}>Net Value:</span>
                          <span className={`font-bold text-xl text-green-400`}>
                            {formatCurrency(rec.netValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Bonus */}
                  {rec.card.welcomeBonus > 0 && (
                    <div className={`p-3 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg mb-4`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${theme.status.success.text}`}>
                          Welcome Bonus:
                        </span>
                        <span className={`font-bold ${theme.status.success.text}`}>
                          {formatCurrency(rec.card.welcomeBonus)}
                        </span>
                      </div>
                      <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
                        Spend {formatCurrency(rec.card.welcomeSpendRequirement)} in first 3 months
                      </p>
                    </div>
                  )}

                  {/* Top Earning Categories */}
                  <div className={`p-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg mb-4`}>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2 text-sm`}>
                      Your Top Earning Categories:
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(rec.categoryBreakdown)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([category, value]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className={`text-xs ${theme.textColors.secondary} capitalize`}>
                              {category}:
                            </span>
                            <span className={`text-xs font-bold ${theme.textColors.primary}`}>
                              {formatCurrency(value)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Pros */}
                  <div className="mb-4">
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2 text-sm`}>Why It&apos;s Great:</h4>
                    <ul className="space-y-1">
                      {rec.card.pros.slice(0, 2).map((pro, idx) => (
                        <li key={idx} className={`text-xs ${theme.textColors.secondary} flex items-start`}>
                          <CheckCircle className={`w-3 h-3 ${theme.status.success.text} mr-1 mt-0.5 flex-shrink-0`} />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best For */}
                  <div className={`p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
                    <p className={`text-xs ${theme.status.info.text} font-medium`}>
                      <strong>Perfect for:</strong> {rec.reason}
                    </p>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>

          {/* Spending Breakdown */}
          <GradientCard variant="glass" gradient="purple" className="p-6 mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Target className={`w-6 h-6 mr-3`} />
              Your Spending Profile Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {spendingCategories.map((category) => {
                const Icon = category.icon;
                const monthlyAmount = spendingProfile[category.key as keyof SpendingProfile];
                const annualAmount = monthlyAmount * 12;
                const percentage = (annualAmount / totalAnnualSpending) * 100;
                
                return (
                  <div key={category.key} className={`p-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
                    <Icon className={`w-5 h-5 ${theme.status.info.text} mx-auto mb-2`} />
                    <h4 className={`font-semibold ${theme.textColors.primary} text-sm mb-1`}>
                      {category.label}
                    </h4>
                    <p className={`text-lg font-bold ${theme.textColors.primary} mb-1`}>
                      {formatCurrency(monthlyAmount)}
                    </p>
                    <p className={`text-xs ${theme.textColors.muted}`}>
                      {percentage.toFixed(1)}% of spending
                    </p>
                  </div>
                );
              })}
            </div>
          </GradientCard>

          {/* Action Plan */}
          <GradientCard variant="glass" gradient="red" className="p-6 mb-8">
            <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center`}>
              <Zap className={`w-6 h-6 mr-3`} />
              Your Credit Card Strategy Action Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Before Applying:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Check your credit score (need 700+ for premium cards)
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Ensure you can meet welcome bonus spending requirements
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Pay off existing credit card debt first
                  </li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>After Approval:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Set up automatic payment for full balance
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Track spending to hit welcome bonus naturally
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mr-2 mt-0.5 flex-shrink-0`} />
                    Never carry a balance - interest negates all rewards
                  </li>
                </ul>
              </div>
            </div>
          </GradientCard>

          {/* Important Warnings */}
          <div className={`p-6 ${theme.status.error.bg} border ${theme.status.error.border} rounded-lg mb-6`}>
            <h3 className={`text-lg font-bold ${theme.status.error.text} mb-3 flex items-center`}>
              <AlertCircle className="w-5 h-5 mr-2" />
              Critical Reminders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Credit Card Golden Rules:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Never spend more than you can pay off monthly</li>
                  <li>• Interest rates (20-30%) destroy all reward value</li>
                  <li>• Only apply if your credit score is 650+</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Annual Fee Strategy:</h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Only pay fees if rewards exceed the cost</li>
                  <li>• Consider downgrading after year one</li>
                  <li>• Factor in welcome bonus value over 2 years</li>
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
              Try Different Spending
            </button>
            <button
              onClick={() => {
                onComplete?.();
                toast.success('Credit card optimization completed! 💳');
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

  const currentCategory = spendingCategories[currentStep];
  const Icon = currentCategory.icon;
  const progress = ((currentStep + 1) / spendingCategories.length) * 100;

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
            <Gift className={`w-8 h-8 ${theme.status.info.text}`} />
          </div>
          <h2 className={`text-3xl font-bold ${theme.textColors.primary} mb-2`}>
            Credit Card Rewards Optimizer
          </h2>
          <p className={`${theme.textColors.secondary} mb-4`}>
            Find the perfect credit cards based on your spending patterns
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
            Category {currentStep + 1} of {spendingCategories.length}
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
              <div className={`inline-flex items-center justify-center w-16 h-16 ${theme.status.warning.bg} rounded-full mb-4`}>
                <Icon className={`w-8 h-8 ${theme.status.warning.text}`} />
              </div>
              <h3 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                {currentCategory.label}
              </h3>
              <p className={`${theme.textColors.secondary} mb-4`}>
                {currentCategory.description}
              </p>
              <p className={`text-sm ${theme.textColors.muted}`}>
                How much do you spend per month in this category?
              </p>
            </div>

            {/* Spending Input */}
            <div className="space-y-6">
              <div className="text-center">
                <span className={`text-4xl font-bold ${theme.textColors.primary}`}>
                  ${spendingProfile[currentCategory.key as keyof SpendingProfile]}
                  <span className={`text-lg ${theme.textColors.muted} ml-2`}>
                    per month
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={spendingProfile[currentCategory.key as keyof SpendingProfile]}
                onChange={(e) => updateSpending(currentCategory.key as keyof SpendingProfile, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                aria-label={`${currentCategory.label} monthly spending`}
                title={`${currentCategory.label} monthly spending amount`}
              />
              <div className={`flex justify-between text-sm ${theme.textColors.muted}`}>
                <span>$0</span>
                <span>$2,000</span>
              </div>
              
              {/* Quick Preset Buttons */}
              <div className="flex justify-center space-x-2 flex-wrap">
                {[0, 100, 300, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => updateSpending(currentCategory.key as keyof SpendingProfile, amount)}
                    className={`px-3 py-1 text-sm border rounded-full transition-all ${
                      spendingProfile[currentCategory.key as keyof SpendingProfile] === amount
                        ? `${theme.borderColors.accent} ${theme.status.info.bg} ${theme.status.info.text}`
                        : `${theme.borderColors.muted} ${theme.textColors.secondary} hover:${theme.borderColors.primary}`
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              {/* Annual Amount */}
              <div className={`text-center p-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Annual spending in this category:
                </p>
                <p className={`text-lg font-bold ${theme.textColors.primary}`}>
                  ${(spendingProfile[currentCategory.key as keyof SpendingProfile] * 12).toLocaleString()}
                </p>
              </div>
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
            {currentStep === spendingCategories.length - 1 ? 'Get Recommendations' : 'Next Category'}
          </button>
        </div>

        {/* Current Total */}
        <div className={`mt-6 pt-6 border-t ${theme.borderColors.primary} text-center`}>
          <p className={`text-sm ${theme.textColors.secondary} mb-1`}>
            Total Monthly Spending So Far:
          </p>
          <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
            {formatCurrency(totalMonthlySpending)}
          </p>
          <p className={`text-sm ${theme.textColors.muted}`}>
            Annual: {formatCurrency(totalAnnualSpending)}
          </p>
        </div>
      </GradientCard>
    </motion.div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  CreditCard,
  Percent,
  Target,
  AlertCircle,
  CheckCircle,
  Calculator,
  Calendar,
  DollarSign,
  Zap,
  Shield,
  Plus,
  Trash2
} from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

interface CreditCard {
  id: string;
  name: string;
  currentBalance: number;
  creditLimit: number;
  minimumPayment: number;
  interestRate: number;
  statementDate: number; // Day of month
}

interface UtilizationStrategy {
  name: string;
  description: string;
  targetUtilization: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  scoreImprovement: number;
}

export default function CreditUtilizationCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [cards, setCards] = useState<CreditCard[]>([
    {
      id: '1',
      name: 'Main Credit Card',
      currentBalance: 2500,
      creditLimit: 5000,
      minimumPayment: 75,
      interestRate: 18.99,
      statementDate: 15
    },
    {
      id: '2', 
      name: 'Rewards Card',
      currentBalance: 800,
      creditLimit: 3000,
      minimumPayment: 25,
      interestRate: 22.99,
      statementDate: 28
    }
  ]);

  const [availableExtraPayment, setAvailableExtraPayment] = useState(300);
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Validation function
  const safeParseFloat = (value: string | number, min: number = 0, max: number = 1000000): number => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(parsed)) return 0;
    return Math.max(min, Math.min(max, parsed));
  };

  // Handle input changes with validation
  const handleExtraPaymentChange = (value: string) => {
    const parsed = safeParseFloat(value, 0, 100000);
    setAvailableExtraPayment(parsed);
  };

  useEffect(() => {
    recordCalculatorUsage('credit-utilization-calculator');
  }, [recordCalculatorUsage]);

  // Validate inputs when cards or extra payment changes
  useEffect(() => {
    const errors: ValidationError[] = [];
    
    // Validate cards
    cards.forEach((card) => {
      // Since safeParseFloat ensures credit limit is at least 1, we only check for invalid stored values
      // This prevents validation errors on auto-corrected inputs
      if (card.creditLimit < 1) {
        errors.push({ field: `card-${card.id}-limit`, message: `Credit limit must be greater than $0` });
      }
      if (card.currentBalance < 0) {
        errors.push({ field: `card-${card.id}-balance`, message: `Balance cannot be negative` });
      }
      if (card.currentBalance > card.creditLimit) {
        errors.push({ field: `card-${card.id}-balance`, message: `Balance cannot exceed credit limit` });
      }
      // Since safeParseFloat ensures statement date is between 1-31, we only check for invalid stored values
      if (card.statementDate < 1 || card.statementDate > 31) {
        errors.push({ field: `card-${card.id}-statement`, message: `Statement date must be between 1-31` });
      }
    });

    // Validate extra payment
    if (availableExtraPayment < 0) {
      errors.push({ field: 'extra-payment', message: 'Extra payment cannot be negative' });
    }

    setValidationErrors(errors);
  }, [cards, availableExtraPayment]);

  const addCard = () => {
    const newCard: CreditCard = {
      id: Date.now().toString(),
      name: 'New Card',
      currentBalance: 0,
      creditLimit: 1000,
      minimumPayment: 25,
      interestRate: 18.99,
      statementDate: 15
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id: string, field: keyof CreditCard, value: string | number) => {
    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const calculateUtilization = (balance: number, limit: number) => {
    return limit > 0 ? (balance / limit) * 100 : 0;
  };

  const calculateTotalUtilization = () => {
    const totalBalance = cards.reduce((sum, card) => sum + card.currentBalance, 0);
    const totalLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
    return calculateUtilization(totalBalance, totalLimit);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization <= 10) return 'text-green-400';
    if (utilization <= 30) return 'text-yellow-400';
    if (utilization <= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getUtilizationStatus = (utilization: number) => {
    if (utilization <= 10) return 'Excellent';
    if (utilization <= 30) return 'Good';
    if (utilization <= 50) return 'Fair';
    return 'Poor';
  };

  const optimizeUtilization = () => {
    const totalPayment = availableExtraPayment;
    
    const optimizedCards = [...cards];
    let remainingPayment = totalPayment;

    if (selectedStrategy === 'highest_utilization') {
      // Pay down highest utilization cards first
      optimizedCards.sort((a, b) => calculateUtilization(b.currentBalance, b.creditLimit) - calculateUtilization(a.currentBalance, a.creditLimit));
    } else if (selectedStrategy === 'highest_balance') {
      // Pay down highest balance cards first
      optimizedCards.sort((a, b) => b.currentBalance - a.currentBalance);
    } else if (selectedStrategy === 'balanced') {
      // Spread payments to balance utilization across cards
      const targetUtilization = 10; // Target 10% on all cards
      
      return optimizedCards.map(card => {
        const targetBalance = (card.creditLimit * targetUtilization) / 100;
        const reduction = Math.max(0, card.currentBalance - targetBalance);
        const payment = Math.min(reduction, card.currentBalance);
        
        return {
          ...card,
          optimizedBalance: Math.max(0, card.currentBalance - payment),
          payment: payment
        };
      });
    }

    // Apply payments for highest_utilization and highest_balance strategies
    return optimizedCards.map(card => {
      const payment = Math.min(remainingPayment, card.currentBalance);
      remainingPayment -= payment;
      
      return {
        ...card,
        optimizedBalance: card.currentBalance - payment,
        payment: payment
      };
    });
  };

  const optimizedCards = optimizeUtilization();
  const currentTotalUtilization = calculateTotalUtilization();
  const optimizedTotalUtilization = optimizedCards.reduce((total, card) => {
    const cardUtil = calculateUtilization(card.optimizedBalance || card.currentBalance, card.creditLimit);
    return total + (cardUtil * (card.creditLimit / cards.reduce((sum, c) => sum + c.creditLimit, 0)));
  }, 0);

  const utilizationStrategies: UtilizationStrategy[] = [
    {
      name: 'Under 10% (Excellent)',
      description: 'Keep all cards under 10% utilization for maximum score benefit',
      targetUtilization: 10,
      impact: 'high',
      timeframe: '1-2 months',
      scoreImprovement: 50
    },
    {
      name: 'Under 30% (Good)',
      description: 'Standard recommendation - avoid score damage',
      targetUtilization: 30,
      impact: 'medium',
      timeframe: '1 month',
      scoreImprovement: 30
    },
    {
      name: 'Zero Balance (Advanced)',
      description: 'Pay before statement date to report 0% (keep 1 card with small balance)',
      targetUtilization: 0,
      impact: 'high',
      timeframe: '1 month',
      scoreImprovement: 30
    }
  ];

  const estimateScoreImprovement = () => {
    const currentUtil = currentTotalUtilization;
    const optimizedUtil = optimizedTotalUtilization;
    
    let improvement = 0;
    if (currentUtil > 50 && optimizedUtil <= 30) improvement = 40;
    else if (currentUtil > 30 && optimizedUtil <= 10) improvement = 30;
    else if (currentUtil > 10 && optimizedUtil <= 10) improvement = 20;
    else improvement = Math.max(0, (currentUtil - optimizedUtil) * 0.5);
    
    return Math.round(improvement);
  };

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6`}>
      <div className="mb-6">
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2 flex items-center gap-3`}>
          <div className={`${theme.status.info.bg} p-2 rounded-lg`}>
            <Percent className={`w-6 h-6 ${theme.status.info.text}`} />
          </div>
          Credit Utilization Optimizer
        </h2>
        <p className={`${theme.textColors.secondary}`}>
          Optimize your credit card utilization to maximize your credit score impact
        </p>
      </div>

      {/* Current vs Optimized Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${getUtilizationColor(currentTotalUtilization).includes('green') ? theme.status.success.bg : theme.status.error.bg} border ${getUtilizationColor(currentTotalUtilization).includes('green') ? theme.status.success.border : theme.status.error.border} rounded-lg p-6 text-center`}>
          <h3 className={`font-semibold ${getUtilizationColor(currentTotalUtilization).includes('green') ? theme.status.success.text : theme.status.error.text} mb-3`}>Current Utilization</h3>
          <div className={`text-4xl font-bold ${getUtilizationColor(currentTotalUtilization)} mb-2`}>
            {currentTotalUtilization.toFixed(1)}%
          </div>
          <p className={`${theme.textColors.secondary} text-sm`}>
            {getUtilizationStatus(currentTotalUtilization)} Status
          </p>
        </div>

        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6 text-center`}>
          <h3 className={`font-semibold ${theme.status.info.text} mb-3`}>After Optimization</h3>
          <div className={`text-4xl font-bold ${getUtilizationColor(optimizedTotalUtilization)} mb-2`}>
            {optimizedTotalUtilization.toFixed(1)}%
          </div>
          <p className={`${theme.textColors.secondary} text-sm`}>
            {getUtilizationStatus(optimizedTotalUtilization)} Status
          </p>
        </div>

        <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-6 text-center`}>
          <h3 className={`font-semibold ${theme.status.success.text} mb-3`}>Score Improvement</h3>
          <div className={`text-4xl font-bold text-green-400 mb-2`}>
            +{estimateScoreImprovement()}
          </div>
          <p className={`${theme.textColors.secondary} text-sm`}>
            Estimated Points
          </p>
        </div>
      </div>

      {/* Payment Strategy Selection */}
      <div className="mb-8">
        <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Target className="w-5 h-5" />
          Optimization Strategy
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <DollarSign className="w-5 h-5" />
              Available Extra Payment
            </h4>
            <div className="relative">
              <label htmlFor="extra-payment-input" className="sr-only">
                Available Extra Payment Amount
              </label>
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
              <input
                id="extra-payment-input"
                type="number"
                value={availableExtraPayment}
                onChange={(e) => handleExtraPaymentChange(e.target.value)}
                className={`w-full pl-8 pr-4 py-3 border ${
                  validationErrors.some(e => e.field === 'extra-payment') 
                    ? 'border-red-500' 
                    : theme.borderColors.primary
                } rounded-lg focus:ring-2 focus:ring-blue-500`}
                min="0"
                max="100000"
                step="50"
                aria-describedby="extra-payment-help extra-payment-error"
                aria-invalid={validationErrors.some(e => e.field === 'extra-payment') ? 'true' : 'false'}
              />
            </div>
            <p id="extra-payment-help" className={`text-sm ${theme.textColors.secondary} mt-2`}>
              Additional payment beyond minimums to optimize utilization
            </p>
            {validationErrors.some(e => e.field === 'extra-payment') && (
              <div id="extra-payment-error" role="alert" className="text-red-500 text-sm mt-1">
                {validationErrors.find(e => e.field === 'extra-payment')?.message}
              </div>
            )}
          </div>

          <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
              <Calculator className="w-5 h-5" />
              Payment Strategy
            </h4>
            <label htmlFor="strategy-select" className="sr-only">
              Payment Strategy Selection
            </label>
            <select
              id="strategy-select"
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500`}
              aria-describedby="strategy-help"
            >
              <option value="balanced">Balanced Utilization</option>
              <option value="highest_utilization">Highest Utilization First</option>
              <option value="highest_balance">Highest Balance First</option>
            </select>
            <p id="strategy-help" className={`text-sm ${theme.textColors.secondary} mt-2`}>
              Choose how to distribute your extra payments
            </p>
          </div>
        </div>
      </div>

      {/* Credit Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} flex items-center gap-2`}>
            <CreditCard className="w-5 h-5" />
            Your Credit Cards
          </h3>
          <button
            onClick={addCard}
            className={`${theme.status.info.bg.replace('/20', '')} ${theme.textColors.primary} px-4 py-2 rounded-lg hover:opacity-80 transition-opacity text-sm flex items-center gap-2`}
            aria-label="Add new credit card to analyze"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>

        <div className="space-y-4">
          {optimizedCards.map((card) => {
            const currentUtil = calculateUtilization(card.currentBalance, card.creditLimit);
            const optimizedUtil = calculateUtilization(card.optimizedBalance || card.currentBalance, card.creditLimit);
            
            return (
              <div key={card.id} className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Card Details */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor={`card-name-${card.id}`} className="sr-only">
                        Credit Card Name
                      </label>
                      <input
                        id={`card-name-${card.id}`}
                        type="text"
                        value={card.name}
                        onChange={(e) => updateCard(card.id, 'name', e.target.value)}
                        className={`font-medium ${theme.textColors.primary} bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1`}
                        aria-describedby={`card-name-help-${card.id}`}
                      />
                      <button
                        onClick={() => removeCard(card.id)}
                        className={`${theme.status.error.text} hover:${theme.status.error.bg} p-1 rounded transition-colors`}
                        aria-label={`Remove ${card.name} credit card`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div id={`card-name-help-${card.id}`} className="sr-only">
                      Enter a name for this credit card to identify it
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label htmlFor={`credit-limit-${card.id}`} className={`text-xs ${theme.textColors.secondary}`}>
                          Credit Limit
                        </label>
                        <div className="relative">
                          <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                          <input
                            id={`credit-limit-${card.id}`}
                            type="number"
                            value={card.creditLimit}
                            onChange={(e) => updateCard(card.id, 'creditLimit', safeParseFloat(e.target.value, 1, 100000))}
                            className={`w-full pl-6 pr-2 py-1 border ${
                              validationErrors.some(e => e.field === `card-${card.id}-limit`) 
                                ? 'border-red-500' 
                                : theme.borderColors.primary
                            } rounded text-sm`}
                            min="1"
                            max="100000"
                            step="100"
                            aria-describedby={`credit-limit-help-${card.id} ${validationErrors.some(e => e.field === `card-${card.id}-limit`) ? `credit-limit-error-${card.id}` : ''}`}
                            aria-invalid={validationErrors.some(e => e.field === `card-${card.id}-limit`) ? 'true' : 'false'}
                          />
                        </div>
                        <div id={`credit-limit-help-${card.id}`} className="sr-only">
                          Enter the total credit limit for this card
                        </div>
                        {validationErrors.some(e => e.field === `card-${card.id}-limit`) && (
                          <div id={`credit-limit-error-${card.id}`} role="alert" className="text-red-500 text-xs mt-1">
                            {validationErrors.find(e => e.field === `card-${card.id}-limit`)?.message}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor={`statement-date-${card.id}`} className={`text-xs ${theme.textColors.secondary}`}>
                          Statement Date
                        </label>
                        <input
                          id={`statement-date-${card.id}`}
                          type="number"
                          value={card.statementDate}
                          onChange={(e) => updateCard(card.id, 'statementDate', safeParseFloat(e.target.value, 1, 31))}
                          className={`w-full px-2 py-1 border ${
                            validationErrors.some(e => e.field === `card-${card.id}-statement`) 
                              ? 'border-red-500' 
                              : theme.borderColors.primary
                          } rounded text-sm`}
                          min="1"
                          max="31"
                          aria-describedby={`statement-date-help-${card.id} ${validationErrors.some(e => e.field === `card-${card.id}-statement`) ? `statement-date-error-${card.id}` : ''}`}
                          aria-invalid={validationErrors.some(e => e.field === `card-${card.id}-statement`) ? 'true' : 'false'}
                        />
                        <div id={`statement-date-help-${card.id}`} className="sr-only">
                          Enter the day of the month when your statement closes (1-31)
                        </div>
                        {validationErrors.some(e => e.field === `card-${card.id}-statement`) && (
                          <div id={`statement-date-error-${card.id}`} role="alert" className="text-red-500 text-xs mt-1">
                            {validationErrors.find(e => e.field === `card-${card.id}-statement`)?.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-3`}>Current Status</h5>
                    <div className="space-y-2">
                      <div>
                        <label htmlFor={`current-balance-${card.id}`} className={`text-xs ${theme.textColors.secondary}`}>
                          Balance
                        </label>
                        <div className="relative">
                          <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                          <input
                            id={`current-balance-${card.id}`}
                            type="number"
                            value={card.currentBalance}
                            onChange={(e) => updateCard(card.id, 'currentBalance', safeParseFloat(e.target.value, 0, card.creditLimit))}
                            className={`w-full pl-6 pr-2 py-1 border ${
                              validationErrors.some(e => e.field === `card-${card.id}-balance`) 
                                ? 'border-red-500' 
                                : theme.borderColors.primary
                            } rounded text-sm`}
                            min="0"
                            max={card.creditLimit}
                            step="10"
                            aria-describedby={`current-balance-help-${card.id} ${validationErrors.some(e => e.field === `card-${card.id}-balance`) ? `current-balance-error-${card.id}` : ''}`}
                            aria-invalid={validationErrors.some(e => e.field === `card-${card.id}-balance`) ? 'true' : 'false'}
                          />
                        </div>
                        <div id={`current-balance-help-${card.id}`} className="sr-only">
                          Enter the current balance on this credit card
                        </div>
                        {validationErrors.some(e => e.field === `card-${card.id}-balance`) && (
                          <div id={`current-balance-error-${card.id}`} role="alert" className="text-red-500 text-xs mt-1">
                            {validationErrors.find(e => e.field === `card-${card.id}-balance`)?.message}
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-2 ${currentUtil <= 10 ? theme.status.success.bg : currentUtil <= 30 ? theme.status.warning.bg : theme.status.error.bg} rounded text-center`}>
                        <div className={`text-lg font-bold ${getUtilizationColor(currentUtil)}`}>
                          {currentUtil.toFixed(1)}%
                        </div>
                        <p className={`text-xs ${theme.textColors.secondary}`}>
                          Utilization
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Optimization */}
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-3`}>After Optimization</h5>
                    <div className="space-y-2">
                      <div className={`p-2 ${theme.status.info.bg} border ${theme.status.info.border} rounded text-center`}>
                        <div className={`text-sm font-bold ${theme.textColors.primary}`}>
                          ${(card.payment || 0).toFixed(0)}
                        </div>
                        <p className={`text-xs ${theme.textColors.secondary}`}>
                          Extra Payment
                        </p>
                      </div>
                      
                      <div className={`p-2 ${theme.status.success.bg} border ${theme.status.success.border} rounded text-center`}>
                        <div className={`text-lg font-bold ${getUtilizationColor(optimizedUtil)}`}>
                          {optimizedUtil.toFixed(1)}%
                        </div>
                        <p className={`text-xs ${theme.textColors.secondary}`}>
                          New Utilization
                        </p>
                      </div>
                      
                      <div className={`text-center text-xs ${theme.textColors.secondary}`}>
                        Balance: ${(card.optimizedBalance || card.currentBalance).toFixed(0)}
                      </div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div>
                    <h5 className={`font-medium ${theme.textColors.primary} mb-3`}>Impact</h5>
                    <div className="space-y-2">
                      {currentUtil !== optimizedUtil && (
                        <div className={`p-2 ${theme.status.success.bg} border ${theme.status.success.border} rounded text-center`}>
                          <CheckCircle className={`w-4 h-4 ${theme.status.success.text} mx-auto mb-1`} />
                          <p className={`text-xs ${theme.status.success.text} font-medium`}>
                            -{(currentUtil - optimizedUtil).toFixed(1)}% utilization
                          </p>
                        </div>
                      )}
                      
                      <div className={`text-center text-xs ${theme.textColors.secondary}`}>
                        {optimizedUtil <= 10 ? '✅ Excellent range' :
                         optimizedUtil <= 30 ? '✅ Good range' :
                         '⚠️ Needs improvement'}
                      </div>
                      
                      <div className={`text-center text-xs ${theme.textColors.muted}`}>
                        Available: ${(card.creditLimit - (card.optimizedBalance || card.currentBalance)).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Utilization Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Shield className="w-5 h-5" />
            Utilization Targets
          </h3>
          
          <div className="space-y-4">
            {utilizationStrategies.map((strategy, index) => (
              <div key={index} className={`p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${theme.textColors.primary}`}>{strategy.name}</h4>
                  <span className={`text-sm ${theme.status.success.text} font-bold`}>
                    +{strategy.scoreImprovement} pts
                  </span>
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  {strategy.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className={`${theme.textColors.muted} flex items-center gap-1`}>
                    <Calendar className="w-3 h-3" />
                    {strategy.timeframe}
                  </span>
                  <span className={`px-2 py-1 ${strategy.impact === 'high' ? theme.status.error.bg : strategy.impact === 'medium' ? theme.status.warning.bg : theme.status.info.bg} rounded text-white text-xs`}>
                    {strategy.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Zap className="w-5 h-5" />
            Pro Tips & Timing
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
              <h4 className={`font-medium ${theme.status.warning.text} mb-2 flex items-center gap-2`}>
                <AlertCircle className="w-4 h-4" />
                Statement Date Strategy
              </h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                Pay balances 2-3 days before statement dates to report lower utilization
              </p>
              <ul className={`text-xs ${theme.textColors.secondary} space-y-1`}>
                <li>• Statement balance = reported utilization</li>
                <li>• Pay early, not just by due date</li>
                <li>• Keep 1 card with small balance ($5-20)</li>
                <li>• Don&apos;t let all cards report zero</li>
              </ul>
            </div>

            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-medium ${theme.status.info.text} mb-2`}>Quick Wins</h4>
              <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                <li>• Request credit limit increases</li>
                <li>• Spread balances across cards</li>
                <li>• Pay twice monthly</li>
                <li>• Use balance transfer cards strategically</li>
              </ul>
            </div>

            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <h4 className={`font-medium ${theme.status.success.text} mb-2`}>Monthly Savings Potential</h4>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${Math.round(estimateScoreImprovement() * 5)}/month
              </div>
              <p className={`text-xs ${theme.textColors.secondary}`}>
                From better credit products and rates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

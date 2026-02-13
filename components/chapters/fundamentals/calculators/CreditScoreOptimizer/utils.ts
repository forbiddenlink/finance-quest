import { Decimal } from 'decimal.js';
import {
  CreditScoreState,
  CreditAccount,
  ScoreGoal,
  FactorAnalysis,
  OptimizationAction,
  UtilizationStrategy,
  DebtPaydownPlan,
  ValidationError,
  CreditFactor,
  TimeFrame,
  ImpactLevel
} from './types';
import {
  FACTOR_WEIGHTS,
  SCORE_RANGES,
  TIME_FRAMES,
  OPTIMIZATION_STRATEGIES,
  PAYDOWN_STRATEGIES,
  VALIDATION_RULES
} from './constants';

export function validateInputs(state: CreditScoreState): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate accounts
  state.accounts.forEach((account, index) => {
    if (account.balance < VALIDATION_RULES.balance.min || 
        account.balance > VALIDATION_RULES.balance.max) {
      errors.push({
        field: `account-${index}-balance`,
        message: `Balance must be between ${formatCurrency(VALIDATION_RULES.balance.min)} and ${formatCurrency(VALIDATION_RULES.balance.max)}`
      });
    }

    if (account.creditLimit < VALIDATION_RULES.creditLimit.min || 
        account.creditLimit > VALIDATION_RULES.creditLimit.max) {
      errors.push({
        field: `account-${index}-creditLimit`,
        message: `Credit limit must be between ${formatCurrency(VALIDATION_RULES.creditLimit.min)} and ${formatCurrency(VALIDATION_RULES.creditLimit.max)}`
      });
    }

    if (account.monthlyPayment < VALIDATION_RULES.monthlyPayment.min || 
        account.monthlyPayment > VALIDATION_RULES.monthlyPayment.max) {
      errors.push({
        field: `account-${index}-monthlyPayment`,
        message: `Monthly payment must be between ${formatCurrency(VALIDATION_RULES.monthlyPayment.min)} and ${formatCurrency(VALIDATION_RULES.monthlyPayment.max)}`
      });
    }

    if (account.interestRate < VALIDATION_RULES.interestRate.min || 
        account.interestRate > VALIDATION_RULES.interestRate.max) {
      errors.push({
        field: `account-${index}-interestRate`,
        message: `Interest rate must be between ${VALIDATION_RULES.interestRate.min}% and ${VALIDATION_RULES.interestRate.max}%`
      });
    }
  });

  // Validate goals
  state.goals.forEach((goal, index) => {
    if (goal.targetScore < VALIDATION_RULES.targetScore.min || 
        goal.targetScore > VALIDATION_RULES.targetScore.max) {
      errors.push({
        field: `goal-${index}-targetScore`,
        message: `Target score must be between ${VALIDATION_RULES.targetScore.min} and ${VALIDATION_RULES.targetScore.max}`
      });
    }
  });

  // Validate debt paydown plan
  if (state.debtPaydownPlan) {
    if (state.debtPaydownPlan.monthlyBudget < VALIDATION_RULES.monthlyBudget.min || 
        state.debtPaydownPlan.monthlyBudget > VALIDATION_RULES.monthlyBudget.max) {
      errors.push({
        field: 'monthlyBudget',
        message: `Monthly budget must be between ${formatCurrency(VALIDATION_RULES.monthlyBudget.min)} and ${formatCurrency(VALIDATION_RULES.monthlyBudget.max)}`
      });
    }
  }

  return errors;
}

export function analyzeFactors(state: CreditScoreState): FactorAnalysis[] {
  const analyses: FactorAnalysis[] = [];

  // Payment History Analysis
  const paymentHistory = analyzePaymentHistory(state.accounts);
  analyses.push(paymentHistory);

  // Credit Utilization Analysis
  const utilization = analyzeCreditUtilization(state.accounts);
  analyses.push(utilization);

  // Credit Age Analysis
  const creditAge = analyzeCreditAge(state.accounts);
  analyses.push(creditAge);

  // Credit Mix Analysis
  const creditMix = analyzeCreditMix(state.accounts);
  analyses.push(creditMix);

  // New Credit Analysis
  const newCredit = analyzeNewCredit(state.accounts);
  analyses.push(newCredit);

  return analyses;
}

function analyzePaymentHistory(accounts: CreditAccount[]): FactorAnalysis {
  const issues: string[] = [];
  const recommendations: OptimizationAction[] = [];
  let impact: ImpactLevel = 'none';

  const delinquentAccounts = accounts.filter(
    account => account.paymentStatus !== 'current'
  );

  if (delinquentAccounts.length > 0) {
    impact = 'high';
    issues.push(`${delinquentAccounts.length} accounts with delinquent status`);
    
    recommendations.push({
      id: 'setup_autopay',
      type: 'payment_history',
      description: 'Set up automatic payments for all accounts',
      impact: {
        factor: 'payment_history',
        points: 20,
        timeFrame: 'immediate'
      },
      requirements: ['Active bank account', 'Sufficient funds'],
      risks: ['Overdraft if insufficient funds'],
      priority: 1,
      completed: false
    });
  }

  return {
    factor: 'payment_history',
    currentScore: calculateFactorScore('payment_history', accounts),
    maxScore: 850 * FACTOR_WEIGHTS.payment_history,
    impact,
    issues,
    recommendations
  };
}

function analyzeCreditUtilization(accounts: CreditAccount[]): FactorAnalysis {
  const issues: string[] = [];
  const recommendations: OptimizationAction[] = [];
  let impact: ImpactLevel = 'none';

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalLimit = accounts.reduce((sum, account) => sum + account.creditLimit, 0);
  const utilization = new Decimal(totalBalance).div(totalLimit).times(100).toNumber();

  if (utilization > 30) {
    impact = utilization > 50 ? 'high' : 'medium';
    issues.push(`Overall utilization of ${formatPercentage(utilization)} exceeds recommended 30%`);

    recommendations.push({
      id: 'reduce_utilization',
      type: 'credit_utilization',
      description: 'Reduce credit utilization below 30%',
      impact: {
        factor: 'credit_utilization',
        points: 40,
        timeFrame: 'short_term'
      },
      requirements: ['Available funds for debt paydown'],
      risks: ['Temporary score dip if closing accounts'],
      priority: 1,
      completed: false
    });
  }

  return {
    factor: 'credit_utilization',
    currentScore: calculateFactorScore('credit_utilization', accounts),
    maxScore: 850 * FACTOR_WEIGHTS.credit_utilization,
    impact,
    issues,
    recommendations
  };
}

function analyzeCreditAge(accounts: CreditAccount[]): FactorAnalysis {
  const issues: string[] = [];
  const recommendations: OptimizationAction[] = [];
  let impact: ImpactLevel = 'none';

  const ages = accounts.map(account => getAccountAgeInMonths(account.openDate));
  const averageAge = ages.length
    ? ages.reduce((sum, age) => sum + age, 0) / ages.length
    : 0;

  if (averageAge < 24) {
    impact = averageAge < 12 ? 'high' : 'medium';
    issues.push(`Average account age of ${Math.round(averageAge)} months is below ideal`);

    recommendations.push({
      id: 'maintain_old_accounts',
      type: 'credit_age',
      description: 'Keep oldest accounts active and in good standing',
      impact: {
        factor: 'credit_age',
        points: 15,
        timeFrame: 'long_term'
      },
      requirements: ['Regular small purchases', 'Prompt payments'],
      risks: ['Annual fees on unused cards'],
      priority: 2,
      completed: false
    });
  }

  return {
    factor: 'credit_age',
    currentScore: calculateFactorScore('credit_age', accounts),
    maxScore: 850 * FACTOR_WEIGHTS.credit_age,
    impact,
    issues,
    recommendations
  };
}

function analyzeCreditMix(accounts: CreditAccount[]): FactorAnalysis {
  const issues: string[] = [];
  const recommendations: OptimizationAction[] = [];
  let impact: ImpactLevel = 'none';

  const accountTypes = new Set(accounts.map(account => account.type));

  if (accountTypes.size < 3) {
    impact = accountTypes.size < 2 ? 'high' : 'medium';
    issues.push(`Limited credit mix with only ${accountTypes.size} types of credit`);

    recommendations.push({
      id: 'diversify_credit',
      type: 'credit_mix',
      description: 'Add a different type of credit account',
      impact: {
        factor: 'credit_mix',
        points: 25,
        timeFrame: 'medium_term'
      },
      requirements: ['Qualifying income', 'Good payment history'],
      risks: ['Hard inquiry impact', 'New account age impact'],
      priority: 3,
      completed: false
    });
  }

  return {
    factor: 'credit_mix',
    currentScore: calculateFactorScore('credit_mix', accounts),
    maxScore: 850 * FACTOR_WEIGHTS.credit_mix,
    impact,
    issues,
    recommendations
  };
}

function analyzeNewCredit(accounts: CreditAccount[]): FactorAnalysis {
  const issues: string[] = [];
  const recommendations: OptimizationAction[] = [];
  let impact: ImpactLevel = 'none';

  const recentAccounts = accounts.filter(
    account => getAccountAgeInMonths(account.openDate) <= 6
  );

  if (recentAccounts.length > 1) {
    impact = recentAccounts.length > 2 ? 'high' : 'medium';
    issues.push(`${recentAccounts.length} new accounts in the past 6 months`);

    recommendations.push({
      id: 'limit_applications',
      type: 'new_credit',
      description: 'Avoid opening new credit accounts',
      impact: {
        factor: 'new_credit',
        points: 10,
        timeFrame: 'short_term'
      },
      requirements: ['Wait 6-12 months between applications'],
      risks: ['Missing good offers'],
      priority: 2,
      completed: false
    });
  }

  return {
    factor: 'new_credit',
    currentScore: calculateFactorScore('new_credit', accounts),
    maxScore: 850 * FACTOR_WEIGHTS.new_credit,
    impact,
    issues,
    recommendations
  };
}

function calculateFactorScore(factor: CreditFactor, accounts: CreditAccount[]): number {
  const maxScore = 850 * FACTOR_WEIGHTS[factor];
  
  switch (factor) {
    case 'payment_history': {
      const delinquencies = accounts.filter(
        account => account.paymentStatus !== 'current'
      ).length;
      return maxScore * (1 - (delinquencies * 0.2));
    }
    case 'credit_utilization': {
      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      const totalLimit = accounts.reduce((sum, account) => sum + account.creditLimit, 0);
      const utilization = new Decimal(totalBalance).div(totalLimit).times(100).toNumber();
      return maxScore * (1 - (utilization / 100));
    }
    case 'credit_age': {
      const ages = accounts.map(account => getAccountAgeInMonths(account.openDate));
      const averageAge = ages.length
        ? ages.reduce((sum, age) => sum + age, 0) / ages.length
        : 0;
      return maxScore * Math.min(1, averageAge / 60); // Max benefit at 5 years
    }
    case 'credit_mix': {
      const uniqueTypes = new Set(accounts.map(account => account.type)).size;
      return maxScore * Math.min(1, uniqueTypes / 4); // Max benefit at 4 types
    }
    case 'new_credit': {
      const recentAccounts = accounts.filter(
        account => getAccountAgeInMonths(account.openDate) <= 6
      ).length;
      return maxScore * (1 - (recentAccounts * 0.2));
    }
    default:
      return 0;
  }
}

export function generateOptimizationPlan(
  state: CreditScoreState,
  goal: ScoreGoal
): OptimizationAction[] {
  const actions: OptimizationAction[] = [];
  const pointsNeeded = goal.targetScore - state.currentScore;

  // Sort factor analyses by potential impact
  const sortedFactors = state.factorAnalysis.sort((a, b) => {
    const aGap = a.maxScore - a.currentScore;
    const bGap = b.maxScore - b.currentScore;
    return bGap - aGap;
  });

  // Generate actions for each factor
  for (const factor of sortedFactors) {
    const strategy = OPTIMIZATION_STRATEGIES[factor.factor as keyof typeof OPTIMIZATION_STRATEGIES];
    if (!strategy) continue;

    // Calculate how many points we can get from this factor
    const potentialPoints = Math.min(
      factor.maxScore - factor.currentScore,
      strategy.maxImpact
    );

    if (potentialPoints > 0) {
      // Add relevant actions from the strategy
      strategy.actions.forEach((actionDesc: string, index: number) => {
        actions.push({
          id: `${factor.factor}_${index}`,
          type: factor.factor,
          description: actionDesc,
          impact: {
            factor: factor.factor,
            points: Math.round(potentialPoints / strategy.actions.length),
            timeFrame: strategy.timeFrame
          },
          requirements: [],
          risks: [],
          priority: index + 1,
          completed: false
        });
      });
    }
  }

  // Sort actions by impact and timeframe
  return actions.sort((a, b) => {
    if (a.impact.timeFrame !== b.impact.timeFrame) {
      const timeFrameOrder = ['immediate', 'short_term', 'medium_term', 'long_term'];
      return timeFrameOrder.indexOf(a.impact.timeFrame) - timeFrameOrder.indexOf(b.impact.timeFrame);
    }
    return b.impact.points - a.impact.points;
  });
}

export function calculateUtilizationStrategies(
  accounts: CreditAccount[]
): UtilizationStrategy[] {
  const strategies: UtilizationStrategy[] = [];

  // Sort accounts by interest rate
  const sortedAccounts = [...accounts].sort((a, b) => b.interestRate - a.interestRate);

  for (const account of sortedAccounts) {
    if (account.balance > 0) {
      const utilization = new Decimal(account.balance)
        .div(account.creditLimit)
        .times(100)
        .toNumber();

      if (utilization > 30) {
        const targetBalance = new Decimal(account.creditLimit)
          .times(0.3)
          .toNumber();

        const paymentAmount = account.balance - targetBalance;
        const monthlyPayment = new Decimal(account.monthlyPayment)
          .plus(100)
          .toNumber();

        const monthsToTarget = Math.ceil(paymentAmount / monthlyPayment);
        const interestSaved = calculateInterestSaved(
          account.balance,
          account.interestRate,
          monthsToTarget,
          monthlyPayment
        );

        strategies.push({
          accountId: account.id,
          currentBalance: account.balance,
          targetBalance,
          paymentAmount,
          monthsToTarget,
          interestSaved,
          scoreImprovement: Math.round((utilization - 30) / 2)
        });
      }
    }
  }

  return strategies;
}

export function generateDebtPaydownPlan(
  accounts: CreditAccount[],
  monthlyBudget: number
): DebtPaydownPlan {
  const totalDebt = accounts.reduce((sum, account) => sum + account.balance, 0);
  const strategies = [];

  // Avalanche Strategy (Highest Interest First)
  const avalancheAccounts = [...accounts].sort((a, b) => b.interestRate - a.interestRate);
  strategies.push(generatePaydownStrategy(
    'avalanche',
    avalancheAccounts,
    monthlyBudget,
    totalDebt
  ));

  // Snowball Strategy (Lowest Balance First)
  const snowballAccounts = [...accounts].sort((a, b) => a.balance - b.balance);
  strategies.push(generatePaydownStrategy(
    'snowball',
    snowballAccounts,
    monthlyBudget,
    totalDebt
  ));

  // Balanced Strategy (Optimize for Both)
  const balancedAccounts = [...accounts].sort((a, b) => {
    const aScore = (a.interestRate * 0.5) + (a.balance / totalDebt * 0.5);
    const bScore = (b.interestRate * 0.5) + (b.balance / totalDebt * 0.5);
    return bScore - aScore;
  });
  strategies.push(generatePaydownStrategy(
    'balance',
    balancedAccounts,
    monthlyBudget,
    totalDebt
  ));

  return {
    totalDebt,
    monthlyBudget,
    strategies
  };
}

function generatePaydownStrategy(
  name: keyof typeof PAYDOWN_STRATEGIES,
  accounts: CreditAccount[],
  monthlyBudget: number,
  totalDebt: number
): DebtPaydownPlan['strategies'][0] {
  const strategy = PAYDOWN_STRATEGIES[name];
  let remainingBudget = monthlyBudget;
  const monthlyPayments = [];

  // Ensure minimum payments
  for (const account of accounts) {
    monthlyPayments.push({
      accountId: account.id,
      amount: account.monthlyPayment
    });
    remainingBudget -= account.monthlyPayment;
  }

  // Allocate extra money to target account
  if (remainingBudget > 0 && accounts.length > 0) {
    monthlyPayments[0] = {
      accountId: accounts[0].id,
      amount: monthlyPayments[0].amount + remainingBudget
    };
  }

  // Calculate metrics
  const timeline = Math.ceil(totalDebt / monthlyBudget);
  const interestSaved = accounts.reduce((sum, account, index) => {
    return sum + calculateInterestSaved(
      account.balance,
      account.interestRate,
      timeline,
      monthlyPayments[index].amount
    );
  }, 0);

  return {
    name: strategy.name,
    description: strategy.description,
    timeline,
    interestSaved,
    scoreImprovement: Math.round(interestSaved / 1000), // Rough estimate
    monthlyPayments
  };
}

function calculateInterestSaved(
  balance: number,
  rate: number,
  months: number,
  payment: number
): number {
  const monthlyRate = rate / 12 / 100;
  let totalInterest = 0;
  let remainingBalance = balance;

  for (let i = 0; i < months && remainingBalance > 0; i++) {
    const interest = remainingBalance * monthlyRate;
    totalInterest += interest;
    remainingBalance = Math.max(0, remainingBalance + interest - payment);
  }

  return totalInterest;
}

export function getAccountAgeInMonths(openDate: Date): number {
  const now = new Date();
  const months = (now.getFullYear() - openDate.getFullYear()) * 12;
  return months + now.getMonth() - openDate.getMonth();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

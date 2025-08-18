import { Decimal } from 'decimal.js';
import {
  CreditCard,
  MonthlySpending,
  RewardValue,
  CardRewards,
  RewardsAnalysis,
  ValidationError
} from './types';
import { POINT_VALUES } from './constants';

export function calculateCardRewards(
  card: CreditCard,
  spending: MonthlySpending[],
  isAnnual: boolean = false
): CardRewards {
  const multiplier = isAnnual ? 12 : 1;
  const baseRewards: RewardValue = { points: 0, cashValue: 0 };
  const categoryRewards: CardRewards['categoryRewards'] = [];

  // Calculate base rewards
  const nonBonusSpending = new Decimal(
    spending.reduce((total, spend) => {
      const hasBonus = card.bonusCategories.some(bonus => bonus.category === spend.category);
      return total + (hasBonus ? 0 : spend.amount);
    }, 0)
  );

  const basePoints = nonBonusSpending.times(card.baseRate).times(multiplier);
  baseRewards.points = basePoints.toNumber();
  baseRewards.cashValue = calculateCashValue(basePoints.toNumber(), card);

  // Calculate category rewards
  spending.forEach(spend => {
    const bonusCategory = card.bonusCategories.find(bonus => bonus.category === spend.category);
    if (bonusCategory) {
      const amount = new Decimal(spend.amount);
      const cappedAmount = bonusCategory.cap
        ? Decimal.min(amount, new Decimal(bonusCategory.cap))
        : amount;
      
      const points = cappedAmount.times(bonusCategory.rate).times(multiplier);
      const cashValue = calculateCashValue(points.toNumber(), card);

      categoryRewards.push({
        category: spend.category,
        rewards: {
          points: points.toNumber(),
          cashValue
        }
      });
    }
  });

  // Calculate total rewards
  const totalPoints = new Decimal(baseRewards.points).plus(
    categoryRewards.reduce((sum, cat) => sum.plus(cat.rewards.points), new Decimal(0))
  );

  const totalCashValue = new Decimal(baseRewards.cashValue).plus(
    categoryRewards.reduce((sum, cat) => sum.plus(cat.rewards.cashValue), new Decimal(0))
  );

  // Calculate signup bonus if applicable
  let signupBonus: RewardValue | undefined;
  if (card.signupBonus) {
    const bonusPoints = card.signupBonus.amount;
    signupBonus = {
      points: bonusPoints,
      cashValue: calculateCashValue(bonusPoints, card)
    };
  }

  // Calculate benefits value
  const benefitsValue = card.benefits.reduce((sum, benefit) => sum + benefit.value, 0);

  // Calculate net value
  const netValue = totalCashValue
    .plus(signupBonus?.cashValue || 0)
    .plus(benefitsValue)
    .minus(card.annualFee)
    .toNumber();

  return {
    cardId: card.id,
    cardName: card.name,
    annualFee: card.annualFee,
    baseRewards,
    categoryRewards,
    totalRewards: {
      points: totalPoints.toNumber(),
      cashValue: totalCashValue.toNumber()
    },
    signupBonus,
    benefitsValue,
    netValue
  };
}

function calculateCashValue(points: number, card: CreditCard): number {
  const pointValue = POINT_VALUES[card.id as keyof typeof POINT_VALUES];
  
  if (card.rewardType === 'cashback') {
    return new Decimal(points).dividedBy(100).toNumber();
  }

  if (pointValue) {
    // Use transfer value if it provides better value
    const cashValue = new Decimal(points).times(pointValue.points).dividedBy(100);
    const transferValue = new Decimal(points).times(pointValue.transfer).dividedBy(100);
    return Decimal.max(cashValue, transferValue).toNumber();
  }

  // Default value of 1 cent per point/mile
  return new Decimal(points).dividedBy(100).toNumber();
}

export function analyzeRewards(
  cards: CreditCard[],
  spending: MonthlySpending[]
): RewardsAnalysis {
  const monthlyRewards = cards.map(card => calculateCardRewards(card, spending));
  const annualRewards = cards.map(card => calculateCardRewards(card, spending, true));

  // Find best overall card
  const bestOverallCard = annualRewards.reduce((best, current) => 
    current.netValue > best.netValue ? current : best
  );

  // Find best no-fee card
  const noFeeCards = annualRewards.filter(reward => reward.annualFee === 0);
  const bestNoFeeCard = noFeeCards.length > 0
    ? noFeeCards.reduce((best, current) => 
        current.netValue > best.netValue ? current : best
      )
    : null;

  // Find optimal card combination
  const recommendedCombination = findOptimalCardCombination(cards, spending);

  return {
    monthlyRewards,
    annualRewards,
    bestOverallCard: bestOverallCard.cardId,
    bestNoFeeCard: bestNoFeeCard?.cardId || '',
    recommendedCombination
  };
}

function findOptimalCardCombination(
  cards: CreditCard[],
  spending: MonthlySpending[]
): {
  cards: string[];
  totalValue: number;
  explanation: string;
} {
  // Start with the best overall card
  const annualRewards = cards.map(card => calculateCardRewards(card, spending, true));
  const bestCard = annualRewards.reduce((best, current) => 
    current.netValue > best.netValue ? current : best
  );

  // Find complementary cards that maximize category rewards
  const remainingCards = annualRewards.filter(reward => reward.cardId !== bestCard.cardId);
  const complementaryCards = remainingCards
    .filter(card => {
      // Check if card adds significant value in categories not well-covered by best card
      const uncoveredCategories = spending.filter(spend => {
        const bestCardRate = bestCard.categoryRewards.find(r => r.category === spend.category)?.rewards.cashValue || 0;
        const thisCardRate = card.categoryRewards.find(r => r.category === spend.category)?.rewards.cashValue || 0;
        return thisCardRate > bestCardRate;
      });

      const additionalValue = uncoveredCategories.reduce((sum, category) => {
        const bestCardRate = bestCard.categoryRewards.find(r => r.category === category.category)?.rewards.cashValue || 0;
        const thisCardRate = card.categoryRewards.find(r => r.category === category.category)?.rewards.cashValue || 0;
        return sum + (thisCardRate - bestCardRate);
      }, 0);

      return additionalValue > card.annualFee;
    })
    .sort((a, b) => b.netValue - a.netValue)
    .slice(0, 2); // Limit to top 2 complementary cards

  const recommendedCards = [bestCard, ...complementaryCards];
  const totalValue = recommendedCards.reduce((sum, card) => sum + card.netValue, 0);

  // Generate explanation
  const explanation = generateCombinationExplanation(recommendedCards, spending);

  return {
    cards: recommendedCards.map(card => card.cardId),
    totalValue,
    explanation
  };
}

function generateCombinationExplanation(
  cards: CardRewards[],
  spending: MonthlySpending[]
): string {
  if (cards.length === 1) {
    return `The ${cards[0].cardName} provides the best overall value for your spending pattern.`;
  }

  const cardDetails = cards.map(card => {
    const bestCategories = card.categoryRewards
      .sort((a, b) => b.rewards.cashValue - a.rewards.cashValue)
      .slice(0, 2)
      .map(cat => cat.category);

    return `${card.cardName} (best for ${bestCategories.join(', ')})`;
  });

  return `Use ${cardDetails.join(' and ')} to maximize rewards across different spending categories.`;
}

export function validateInputs(
  cards: CreditCard[],
  spending: MonthlySpending[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate card selection
  if (cards.length === 0) {
    errors.push({
      field: 'cards',
      message: 'Select at least one credit card'
    });
  }

  // Validate spending amounts
  spending.forEach(spend => {
    if (spend.amount < 0) {
      errors.push({
        field: spend.category,
        message: `${spend.category} spending cannot be negative`
      });
    }
    if (spend.amount > 50000) {
      errors.push({
        field: spend.category,
        message: `${spend.category} spending seems unusually high`
      });
    }
  });

  return errors;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-US').format(points);
}

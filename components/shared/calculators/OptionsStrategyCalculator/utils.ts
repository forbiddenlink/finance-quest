import { Decimal } from 'decimal.js';
import {
  Option,
  Strategy,
  MarketData,
  StrategyAnalysis,
  RiskProfile,
  GreeksExposure,
  ValidationError,
  ProfitLossPoint,
  ChartData,
  ChartOptions
} from './types';
import {
  STRATEGY_CONFIG,
  EXPIRY_CONFIG,
  GREEKS_CONFIG,
  ANALYSIS_CONSTANTS
} from './constants';

export function validateInputs(
  underlyingSymbol: string,
  underlyingPrice: number,
  strategy: Strategy,
  marketData: MarketData
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate symbol
  if (!underlyingSymbol) {
    errors.push({
      field: 'underlyingSymbol',
      message: 'Underlying symbol is required'
    });
  } else if (!/^[A-Z]+$/.test(underlyingSymbol)) {
    errors.push({
      field: 'underlyingSymbol',
      message: 'Symbol must contain only uppercase letters'
    });
  }

  // Validate underlying price
  if (underlyingPrice < ANALYSIS_CONSTANTS.minUnderlyingPrice || 
      underlyingPrice > ANALYSIS_CONSTANTS.maxUnderlyingPrice) {
    errors.push({
      field: 'underlyingPrice',
      message: `Price must be between ${ANALYSIS_CONSTANTS.minUnderlyingPrice} and ${ANALYSIS_CONSTANTS.maxUnderlyingPrice}`
    });
  }

  // Validate strategy
  const strategyConfig = STRATEGY_CONFIG[strategy.type];
  if (strategy.legs.length > strategyConfig.maxLegs) {
    errors.push({
      field: 'strategy',
      message: `${strategyConfig.name} cannot have more than ${strategyConfig.maxLegs} legs`
    });
  }

  // Validate options
  strategy.legs.forEach((option, index) => {
    if (option.strike < ANALYSIS_CONSTANTS.minStrikePrice || 
        option.strike > ANALYSIS_CONSTANTS.maxStrikePrice) {
      errors.push({
        field: `option-${index}-strike`,
        message: `Strike must be between ${ANALYSIS_CONSTANTS.minStrikePrice} and ${ANALYSIS_CONSTANTS.maxStrikePrice}`
      });
    }

    if (option.premium < ANALYSIS_CONSTANTS.minPremium || 
        option.premium > ANALYSIS_CONSTANTS.maxPremium) {
      errors.push({
        field: `option-${index}-premium`,
        message: `Premium must be between ${ANALYSIS_CONSTANTS.minPremium} and ${ANALYSIS_CONSTANTS.maxPremium}`
      });
    }

    if (option.quantity < ANALYSIS_CONSTANTS.minQuantity || 
        option.quantity > ANALYSIS_CONSTANTS.maxQuantity) {
      errors.push({
        field: `option-${index}-quantity`,
        message: `Quantity must be between ${ANALYSIS_CONSTANTS.minQuantity} and ${ANALYSIS_CONSTANTS.maxQuantity}`
      });
    }

    const expiryConfig = EXPIRY_CONFIG[option.term];
    const daysToExpiry = Math.ceil((option.expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < expiryConfig.minDays || daysToExpiry > expiryConfig.maxDays) {
      errors.push({
        field: `option-${index}-expiry`,
        message: `${expiryConfig.label} must expire between ${expiryConfig.minDays} and ${expiryConfig.maxDays} days`
      });
    }
  });

  // Validate market data
  if (marketData.volatility < ANALYSIS_CONSTANTS.minVolatility || 
      marketData.volatility > ANALYSIS_CONSTANTS.maxVolatility) {
    errors.push({
      field: 'volatility',
      message: `Volatility must be between ${ANALYSIS_CONSTANTS.minVolatility}% and ${ANALYSIS_CONSTANTS.maxVolatility}%`
    });
  }

  if (marketData.riskFreeRate < ANALYSIS_CONSTANTS.minRiskFreeRate || 
      marketData.riskFreeRate > ANALYSIS_CONSTANTS.maxRiskFreeRate) {
    errors.push({
      field: 'riskFreeRate',
      message: `Risk-free rate must be between ${ANALYSIS_CONSTANTS.minRiskFreeRate}% and ${ANALYSIS_CONSTANTS.maxRiskFreeRate}%`
    });
  }

  if (marketData.dividendYield < ANALYSIS_CONSTANTS.minDividendYield || 
      marketData.dividendYield > ANALYSIS_CONSTANTS.maxDividendYield) {
    errors.push({
      field: 'dividendYield',
      message: `Dividend yield must be between ${ANALYSIS_CONSTANTS.minDividendYield}% and ${ANALYSIS_CONSTANTS.maxDividendYield}%`
    });
  }

  return errors;
}

export function calculateStrategyAnalysis(
  strategy: Strategy,
  marketData: MarketData
): StrategyAnalysis {
  const probabilityOfProfit = calculateProbabilityOfProfit(strategy, marketData);
  const expectedValue = calculateExpectedValue(strategy, marketData);
  const maxReturnOnCapital = new Decimal(strategy.maxProfit)
    .div(strategy.marginRequirement)
    .times(100)
    .toNumber();

  const exposures = calculateGreeksExposure(strategy.legs);
  
  return {
    probabilityOfProfit,
    expectedValue,
    maxReturnOnCapital,
    timeDecayExposure: exposures.totalTheta,
    volatilityExposure: exposures.totalVega,
    deltaExposure: exposures.totalDelta,
    gammaExposure: exposures.totalGamma,
    thetaExposure: exposures.totalTheta,
    vegaExposure: exposures.totalVega,
    rhoExposure: exposures.totalRho,
    riskRewardRatio: new Decimal(strategy.maxProfit)
      .div(strategy.maxLoss)
      .abs()
      .toNumber()
  };
}

function calculateProbabilityOfProfit(
  strategy: Strategy,
  marketData: MarketData
): number {
  // Simplified calculation based on break-even points and normal distribution
  const standardDeviation = new Decimal(marketData.volatility)
    .div(100)
    .times(Math.sqrt(marketData.daysToExpiration / 365))
    .times(marketData.underlyingPrice)
    .toNumber();

  const breakEvenDistance = Math.min(
    ...strategy.breakEvenPoints.map(point => 
      Math.abs(point - marketData.underlyingPrice)
    )
  );

  return 1 - 2 * normalCDF(-breakEvenDistance / standardDeviation);
}

function calculateExpectedValue(
  strategy: Strategy,
  marketData: MarketData
): number {
  const profitProbability = calculateProbabilityOfProfit(strategy, marketData);
  return new Decimal(strategy.maxProfit)
    .times(profitProbability)
    .plus(new Decimal(strategy.maxLoss).times(1 - profitProbability))
    .toNumber();
}

export function calculateGreeksExposure(options: Option[]): GreeksExposure {
  const totalDelta = options.reduce(
    (sum, option) => sum.plus(
      new Decimal(option.delta)
        .times(option.position === 'long' ? 1 : -1)
        .times(option.quantity)
    ),
    new Decimal(0)
  );

  const totalGamma = options.reduce(
    (sum, option) => sum.plus(
      new Decimal(option.gamma)
        .times(option.position === 'long' ? 1 : -1)
        .times(option.quantity)
    ),
    new Decimal(0)
  );

  const totalTheta = options.reduce(
    (sum, option) => sum.plus(
      new Decimal(option.theta)
        .times(option.position === 'long' ? 1 : -1)
        .times(option.quantity)
    ),
    new Decimal(0)
  );

  const totalVega = options.reduce(
    (sum, option) => sum.plus(
      new Decimal(option.vega)
        .times(option.position === 'long' ? 1 : -1)
        .times(option.quantity)
    ),
    new Decimal(0)
  );

  const totalRho = options.reduce(
    (sum, option) => sum.plus(
      new Decimal(option.rho)
        .times(option.position === 'long' ? 1 : -1)
        .times(option.quantity)
    ),
    new Decimal(0)
  );

  return {
    totalDelta: totalDelta.toNumber(),
    totalGamma: totalGamma.toNumber(),
    totalTheta: totalTheta.toNumber(),
    totalVega: totalVega.toNumber(),
    totalRho: totalRho.toNumber(),
    netDeltaEquivalent: totalDelta.times(100).toNumber()
  };
}

export function calculateRiskProfile(
  strategy: Strategy,
  marketData: MarketData
): RiskProfile {
  const profitLossCurve = generateProfitLossCurve(strategy, marketData);
  const profitProbability = calculateProbabilityOfProfit(strategy, marketData);

  return {
    maxLoss: strategy.maxLoss,
    maxProfit: strategy.maxProfit,
    breakEvenPoints: strategy.breakEvenPoints,
    profitProbability,
    riskLevel: strategy.riskLevel,
    profitPotential: strategy.profitPotential,
    marginRequirement: strategy.marginRequirement,
    returnOnRisk: strategy.returnOnRisk,
    profitLossCurve
  };
}

function generateProfitLossCurve(
  strategy: Strategy,
  marketData: MarketData
): ProfitLossPoint[] {
  const points: ProfitLossPoint[] = [];
  const priceRange = generatePriceRange(marketData.underlyingPrice, marketData.volatility);

  for (const price of priceRange) {
    const profitLoss = calculateProfitLoss(price, strategy.legs);
    const greeks = calculatePositionGreeks(price, strategy.legs);
    
    points.push({
      price,
      profitLoss,
      delta: greeks.totalDelta,
      gamma: greeks.totalGamma,
      theta: greeks.totalTheta
    });
  }

  return points;
}

function generatePriceRange(
  currentPrice: number,
  volatility: number
): number[] {
  const range: number[] = [];
  const standardDeviation = new Decimal(currentPrice)
    .times(volatility)
    .div(100)
    .toNumber();
  
  const minPrice = Math.max(1, currentPrice - 3 * standardDeviation);
  const maxPrice = currentPrice + 3 * standardDeviation;
  const steps = 100;
  const stepSize = (maxPrice - minPrice) / steps;

  for (let i = 0; i <= steps; i++) {
    range.push(minPrice + i * stepSize);
  }

  return range;
}

function calculateProfitLoss(price: number, options: Option[]): number {
  return options.reduce((total, option) => {
    const optionValue = calculateOptionValue(price, option);
    const positionMultiplier = option.position === 'long' ? 1 : -1;
    return new Decimal(total)
      .plus(
        new Decimal(optionValue)
          .minus(option.premium)
          .times(positionMultiplier)
          .times(option.quantity)
          .times(100)
      )
      .toNumber();
  }, 0);
}

function calculateOptionValue(price: number, option: Option): number {
  if (option.type === 'call') {
    return Math.max(0, price - option.strike);
  } else {
    return Math.max(0, option.strike - price);
  }
}

function calculatePositionGreeks(price: number, options: Option[]): GreeksExposure {
  // Simplified calculation - in reality would use Black-Scholes
  return calculateGreeksExposure(options);
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

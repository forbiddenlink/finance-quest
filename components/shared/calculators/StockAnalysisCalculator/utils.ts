import { Decimal } from 'decimal.js';
import {
  StockData,
  FinancialMetrics,
  TechnicalIndicators,
  PriceTarget,
  TrendAnalysis,
  RiskAssessment,
  ValuationMetrics,
  AnalysisResult,
  ValidationError,
  TrendDirection,
  SignalStrength,
  RiskLevel,
  RecommendationType,
  ChartData,
  ChartOptions
} from './types';
import { ANALYSIS_CONSTANTS } from './constants';

export function validateSymbol(symbol: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!symbol) {
    errors.push({
      field: 'symbol',
      message: 'Stock symbol is required'
    });
  } else if (symbol.length < ANALYSIS_CONSTANTS.minSymbolLength || 
             symbol.length > ANALYSIS_CONSTANTS.maxSymbolLength) {
    errors.push({
      field: 'symbol',
      message: `Symbol must be between ${ANALYSIS_CONSTANTS.minSymbolLength} and ${ANALYSIS_CONSTANTS.maxSymbolLength} characters`
    });
  } else if (!/^[A-Z]+$/.test(symbol)) {
    errors.push({
      field: 'symbol',
      message: 'Symbol must contain only uppercase letters'
    });
  }

  return errors;
}

export function calculateTechnicalIndicators(data: StockData): TechnicalIndicators {
  // Calculate RSI
  const rsi = calculateRSI(data);

  // Calculate MACD
  const macd = calculateMACD(data);

  // Calculate Stochastic
  const stochastic = calculateStochastic(data);

  // Calculate Bollinger Bands
  const bollingerBands = calculateBollingerBands(data);

  // Calculate ATR
  const atr = calculateATR(data);

  // Calculate OBV
  const obv = calculateOBV(data);

  return {
    rsi,
    macd,
    stochastic,
    bollingerBands,
    atr,
    obv
  };
}

function calculateRSI(data: StockData): number {
  const { movingAverages: { sma20 } } = data;
  // Simplified RSI calculation for example
  return new Decimal(data.currentPrice)
    .minus(sma20)
    .abs()
    .div(sma20)
    .times(100)
    .toNumber();
}

function calculateMACD(data: StockData): TechnicalIndicators['macd'] {
  const { movingAverages: { ema12, ema26 } } = data;
  const macdValue = new Decimal(ema12).minus(ema26).toNumber();
  const signal = new Decimal(macdValue).times(0.9).toNumber(); // Simplified
  const histogram = new Decimal(macdValue).minus(signal).toNumber();

  return {
    value: macdValue,
    signal,
    histogram
  };
}

function calculateStochastic(data: StockData): TechnicalIndicators['stochastic'] {
  const { currentPrice, highPrice, lowPrice } = data;
  const k = new Decimal(currentPrice)
    .minus(lowPrice)
    .div(highPrice - lowPrice)
    .times(100)
    .toNumber();
  const d = new Decimal(k).times(0.8).toNumber(); // Simplified

  return { k, d };
}

function calculateBollingerBands(data: StockData): TechnicalIndicators['bollingerBands'] {
  const { movingAverages: { sma20 } } = data;
  const stdDev = new Decimal(data.currentPrice)
    .minus(sma20)
    .abs()
    .div(5)
    .toNumber(); // Simplified

  return {
    upper: new Decimal(sma20).plus(stdDev * 2).toNumber(),
    middle: sma20,
    lower: new Decimal(sma20).minus(stdDev * 2).toNumber()
  };
}

function calculateATR(data: StockData): number {
  const { highPrice, lowPrice, currentPrice } = data;
  return new Decimal(highPrice)
    .minus(lowPrice)
    .plus(new Decimal(currentPrice).minus(lowPrice).abs())
    .div(3)
    .toNumber();
}

function calculateOBV(data: StockData): number {
  const { volume, currentPrice, openPrice } = data;
  return currentPrice > openPrice ? volume : -volume;
}

export function analyzeTrend(data: StockData, indicators: TechnicalIndicators): TrendAnalysis {
  const direction = determineTrendDirection(data, indicators);
  const strength = determineTrendStrength(data, indicators);
  const supportLevels = calculateSupportLevels(data);
  const resistanceLevels = calculateResistanceLevels(data);
  const breakoutPoints = findBreakoutPoints(data);

  return {
    direction,
    strength,
    supportLevels,
    resistanceLevels,
    breakoutPoints
  };
}

function determineTrendDirection(data: StockData, indicators: TechnicalIndicators): TrendDirection {
  const { currentPrice } = data;
  const { sma20, sma50 } = data.movingAverages;

  if (currentPrice > sma50 && sma20 > sma50) return 'up';
  if (currentPrice < sma50 && sma20 < sma50) return 'down';
  return 'sideways';
}

function determineTrendStrength(data: StockData, indicators: TechnicalIndicators): SignalStrength {
  const { rsi } = indicators;
  
  if (rsi > 70 || rsi < 30) return 'strong';
  if (rsi > 60 || rsi < 40) return 'moderate';
  return 'weak';
}

function calculateSupportLevels(data: StockData): number[] {
  const { lowPrice, currentPrice } = data;
  return [
    lowPrice,
    new Decimal(lowPrice).plus(currentPrice).div(2).toNumber(),
    new Decimal(currentPrice).minus(currentPrice * 0.05).toNumber()
  ];
}

function calculateResistanceLevels(data: StockData): number[] {
  const { highPrice, currentPrice } = data;
  return [
    highPrice,
    new Decimal(highPrice).plus(currentPrice).div(2).toNumber(),
    new Decimal(currentPrice).plus(currentPrice * 0.05).toNumber()
  ];
}

function findBreakoutPoints(data: StockData): TrendAnalysis['breakoutPoints'] {
  // Simplified breakout detection
  return [{
    price: data.currentPrice,
    volume: data.volume,
    date: new Date()
  }];
}

export function assessRisk(data: StockData, metrics: FinancialMetrics): RiskAssessment {
  const volatility = calculateVolatility(data);
  const sharpeRatio = calculateSharpeRatio(data, metrics);
  const sortinoRatio = calculateSortinoRatio(data, metrics);
  const maxDrawdown = calculateMaxDrawdown(data);
  const level = determineRiskLevel(volatility, sharpeRatio);

  return {
    level,
    volatility,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown,
    factors: {
      marketRisk: calculateMarketRisk(data),
      sectorRisk: calculateSectorRisk(data),
      companySpecificRisk: calculateCompanyRisk(metrics)
    }
  };
}

function calculateVolatility(data: StockData): number {
  return new Decimal(data.beta)
    .times(data.currentPrice)
    .div(100)
    .toNumber();
}

function calculateSharpeRatio(data: StockData, metrics: FinancialMetrics): number {
  const riskFreeRate = 0.02; // 2% risk-free rate
  const excessReturn = new Decimal(metrics.returnOnEquity).div(100).minus(riskFreeRate);
  return excessReturn.div(data.beta).toNumber();
}

function calculateSortinoRatio(data: StockData, metrics: FinancialMetrics): number {
  return new Decimal(calculateSharpeRatio(data, metrics))
    .times(1.5) // Simplified calculation
    .toNumber();
}

function calculateMaxDrawdown(data: StockData): number {
  return new Decimal(data.fiftyTwoWeekHigh)
    .minus(data.fiftyTwoWeekLow)
    .div(data.fiftyTwoWeekHigh)
    .times(100)
    .toNumber();
}

function determineRiskLevel(volatility: number, sharpeRatio: number): RiskLevel {
  const { riskLevels } = ANALYSIS_CONSTANTS;

  if (volatility <= riskLevels.low.maxVolatility && sharpeRatio >= riskLevels.low.minSharpeRatio) {
    return 'low';
  }
  if (volatility <= riskLevels.medium.maxVolatility && sharpeRatio >= riskLevels.medium.minSharpeRatio) {
    return 'medium';
  }
  return 'high';
}

function calculateMarketRisk(data: StockData): number {
  return new Decimal(data.beta).times(100).toNumber();
}

function calculateSectorRisk(data: StockData): number {
  return new Decimal(data.beta)
    .times(data.volume)
    .div(data.marketCap)
    .times(100)
    .toNumber();
}

function calculateCompanyRisk(metrics: FinancialMetrics): number {
  return new Decimal(100)
    .minus(metrics.profitMargin)
    .times(metrics.debtToEquity)
    .div(100)
    .toNumber();
}

export function generateRecommendation(
  data: StockData,
  indicators: TechnicalIndicators,
  trend: TrendAnalysis,
  risk: RiskAssessment,
  valuation: ValuationMetrics
): AnalysisResult['recommendation'] {
  const type = determineRecommendationType(data, indicators, trend, valuation);
  const confidence = determineConfidence(indicators, trend, risk);
  const reasons = generateReasons(type, data, indicators, trend, risk, valuation);
  const priceTargets = calculatePriceTargets(data, trend, valuation);

  return {
    type,
    confidence,
    reasons,
    priceTargets
  };
}

function determineRecommendationType(
  data: StockData,
  indicators: TechnicalIndicators,
  trend: TrendAnalysis,
  valuation: ValuationMetrics
): RecommendationType {
  if (trend.direction === 'up' && data.currentPrice < valuation.fairValue) {
    return 'buy';
  }
  if (trend.direction === 'down' && data.currentPrice > valuation.fairValue) {
    return 'sell';
  }
  return 'hold';
}

function determineConfidence(
  indicators: TechnicalIndicators,
  trend: TrendAnalysis,
  risk: RiskAssessment
): SignalStrength {
  if (trend.strength === 'strong' && risk.level === 'low') {
    return 'strong';
  }
  if (trend.strength === 'weak' || risk.level === 'high') {
    return 'weak';
  }
  return 'moderate';
}

function generateReasons(
  type: RecommendationType,
  data: StockData,
  indicators: TechnicalIndicators,
  trend: TrendAnalysis,
  risk: RiskAssessment,
  valuation: ValuationMetrics
): string[] {
  const reasons: string[] = [];

  if (type === 'buy') {
    if (data.currentPrice < valuation.fairValue) {
      reasons.push(`Trading below fair value of ${formatCurrency(valuation.fairValue)}`);
    }
    if (trend.direction === 'up') {
      reasons.push('Strong upward trend');
    }
    if (indicators.rsi < ANALYSIS_CONSTANTS.rsiOversold) {
      reasons.push('Oversold conditions (RSI)');
    }
  } else if (type === 'sell') {
    if (data.currentPrice > valuation.fairValue) {
      reasons.push(`Trading above fair value of ${formatCurrency(valuation.fairValue)}`);
    }
    if (trend.direction === 'down') {
      reasons.push('Strong downward trend');
    }
    if (indicators.rsi > ANALYSIS_CONSTANTS.rsiOverbought) {
      reasons.push('Overbought conditions (RSI)');
    }
  }

  if (risk.level === 'high') {
    reasons.push('High risk profile');
  }

  return reasons;
}

function calculatePriceTargets(
  data: StockData,
  trend: TrendAnalysis,
  valuation: ValuationMetrics
): AnalysisResult['recommendation']['priceTargets'] {
  const entry = data.currentPrice;
  const stopLoss = Math.min(...trend.supportLevels);
  const takeProfit = Math.max(
    valuation.fairValue,
    Math.max(...trend.resistanceLevels)
  );

  return { entry, stopLoss, takeProfit };
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

export function formatLargeNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
}

import {
  PortfolioHolding,
  PortfolioMetrics,
  RiskMetric,
  RebalancingNeed,
  PortfolioAllocation,
  AnalysisParameters
} from './types';
import {
  DEFAULT_CORRELATIONS,
  RISK_THRESHOLDS,
  RISK_FREE_RATE,
  Z_SCORE_95,
  Z_SCORE_99,
  MAX_DRAWDOWN_FACTOR,
  DOWNSIDE_DEVIATION_FACTOR,
  MARKET_VOLATILITY
} from './constants';

export function calculatePortfolioMetrics(
  holdings: PortfolioHolding[],
  parameters: AnalysisParameters
): PortfolioMetrics {
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
  
  // Normalize allocations
  const normalizedHoldings = holdings.map(holding => ({
    ...holding,
    allocation: (holding.marketValue / totalValue) * 100
  }));

  // Portfolio expected return (weighted average)
  const expectedReturn = normalizedHoldings.reduce(
    (sum, holding) => sum + (holding.allocation / 100) * holding.expectedReturn,
    0
  );

  // Portfolio beta (weighted average)
  const beta = normalizedHoldings.reduce(
    (sum, holding) => sum + (holding.allocation / 100) * holding.beta,
    0
  );

  // Portfolio volatility using correlation matrix
  let portfolioVariance = 0;
  for (let i = 0; i < normalizedHoldings.length; i++) {
    for (let j = 0; j < normalizedHoldings.length; j++) {
      const holding1 = normalizedHoldings[i];
      const holding2 = normalizedHoldings[j];
      const weight1 = holding1.allocation / 100;
      const weight2 = holding2.allocation / 100;
      const correlation = DEFAULT_CORRELATIONS[holding1.symbol]?.[holding2.symbol] || 0;
      
      portfolioVariance += weight1 * weight2 * 
                         (holding1.volatility / 100) * 
                         (holding2.volatility / 100) * 
                         correlation;
    }
  }
  const volatility = Math.sqrt(portfolioVariance) * 100;

  // Risk-adjusted metrics
  const excessReturn = expectedReturn - parameters.riskFreeRate;
  const sharpeRatio = excessReturn / volatility;
  const treynorRatio = excessReturn / beta;
  
  // Diversification ratio
  const weightedAvgVolatility = normalizedHoldings.reduce(
    (sum, holding) => sum + (holding.allocation / 100) * holding.volatility,
    0
  );
  const diversificationRatio = weightedAvgVolatility / volatility;

  // Value at Risk (simplified normal distribution assumption)
  const var95 = totalValue * (expectedReturn / 100 - Z_SCORE_95 * volatility / 100) * (parameters.timeHorizon / 12);
  const var99 = totalValue * (expectedReturn / 100 - Z_SCORE_99 * volatility / 100) * (parameters.timeHorizon / 12);

  // Simplified max drawdown estimate
  const maxDrawdown = volatility * MAX_DRAWDOWN_FACTOR;

  // Sortino ratio (simplified - using volatility as proxy for downside deviation)
  const sortino = excessReturn / (volatility * DOWNSIDE_DEVIATION_FACTOR);

  // Information ratio (vs market)
  const trackingError = Math.abs(volatility - MARKET_VOLATILITY);
  const informationRatio = (expectedReturn - parameters.marketReturn) / (trackingError || 1);

  // Allocations
  const allocations = normalizedHoldings.map(holding => ({
    asset: holding.symbol,
    percentage: holding.allocation,
    value: holding.marketValue
  }));

  // Risk metrics analysis
  const riskMetrics = generateRiskMetrics(sharpeRatio, beta, volatility, diversificationRatio, maxDrawdown, treynorRatio);

  // Rebalancing analysis
  const rebalancingNeeds = analyzeRebalancingNeeds(normalizedHoldings, parameters.rebalancingThreshold);

  // Recommendations and risk factors
  const { recommendations, riskFactors } = generateRecommendations(
    sharpeRatio,
    volatility,
    diversificationRatio,
    beta,
    expectedReturn,
    parameters.riskFreeRate,
    rebalancingNeeds,
    normalizedHoldings
  );

  return {
    totalValue,
    expectedReturn,
    volatility,
    sharpeRatio,
    beta,
    diversificationRatio,
    var95,
    var99,
    maxDrawdown,
    treynorRatio,
    informationRatio,
    sortino,
    allocations,
    riskMetrics,
    rebalancingNeeds,
    recommendations,
    riskFactors
  };
}

function generateRiskMetrics(
  sharpeRatio: number,
  beta: number,
  volatility: number,
  diversificationRatio: number,
  maxDrawdown: number,
  treynorRatio: number
): RiskMetric[] {
  return [
    {
      metric: 'Sharpe Ratio',
      value: sharpeRatio.toFixed(2),
      benchmark: '> 1.0',
      status: sharpeRatio > RISK_THRESHOLDS.sharpeRatio.excellent ? 'Excellent' : 
              sharpeRatio > RISK_THRESHOLDS.sharpeRatio.good ? 'Good' : 
              sharpeRatio > RISK_THRESHOLDS.sharpeRatio.fair ? 'Fair' : 'Poor',
      description: 'Risk-adjusted return per unit of volatility'
    },
    {
      metric: 'Portfolio Beta',
      value: beta.toFixed(2),
      benchmark: '0.8 - 1.2',
      status: (beta >= RISK_THRESHOLDS.beta.min && beta <= RISK_THRESHOLDS.beta.max) ? 'Good' : 
              (beta >= RISK_THRESHOLDS.beta.fairMin && beta <= RISK_THRESHOLDS.beta.fairMax) ? 'Fair' : 'Poor',
      description: 'Sensitivity to market movements'
    },
    {
      metric: 'Volatility',
      value: `${volatility.toFixed(1)}%`,
      benchmark: '< 15%',
      status: volatility < RISK_THRESHOLDS.volatility.excellent ? 'Excellent' : 
              volatility < RISK_THRESHOLDS.volatility.good ? 'Good' : 
              volatility < RISK_THRESHOLDS.volatility.fair ? 'Fair' : 'Poor',
      description: 'Portfolio price fluctuation risk'
    },
    {
      metric: 'Diversification Ratio',
      value: diversificationRatio.toFixed(2),
      benchmark: '> 1.2',
      status: diversificationRatio > RISK_THRESHOLDS.diversificationRatio.excellent ? 'Excellent' : 
              diversificationRatio > RISK_THRESHOLDS.diversificationRatio.good ? 'Good' : 
              diversificationRatio > RISK_THRESHOLDS.diversificationRatio.fair ? 'Fair' : 'Poor',
      description: 'Effectiveness of diversification'
    },
    {
      metric: 'Max Drawdown',
      value: `${maxDrawdown.toFixed(1)}%`,
      benchmark: '< 20%',
      status: maxDrawdown < RISK_THRESHOLDS.maxDrawdown.excellent ? 'Excellent' : 
              maxDrawdown < RISK_THRESHOLDS.maxDrawdown.good ? 'Good' : 
              maxDrawdown < RISK_THRESHOLDS.maxDrawdown.fair ? 'Fair' : 'Poor',
      description: 'Potential peak-to-trough decline'
    },
    {
      metric: 'Treynor Ratio',
      value: treynorRatio.toFixed(2),
      benchmark: '> 0.1',
      status: treynorRatio > RISK_THRESHOLDS.treynorRatio.excellent ? 'Excellent' : 
              treynorRatio > RISK_THRESHOLDS.treynorRatio.good ? 'Good' : 
              treynorRatio > RISK_THRESHOLDS.treynorRatio.fair ? 'Fair' : 'Poor',
      description: 'Risk-adjusted return per unit of systematic risk'
    }
  ];
}

function analyzeRebalancingNeeds(
  holdings: PortfolioHolding[],
  rebalancingThreshold: number
): RebalancingNeed[] {
  const targetAllocations = holdings.reduce((acc, holding) => {
    acc[holding.symbol] = holding.allocation;
    return acc;
  }, {} as { [key: string]: number });

  return holdings.map(holding => {
    const target = targetAllocations[holding.symbol] || holding.allocation;
    const current = holding.allocation;
    const targetValue = (target / 100) * holding.marketValue;
    const action = current > target + rebalancingThreshold ? 'Sell' : 
                  current < target - rebalancingThreshold ? 'Buy' : 'Hold';
    const amount = Math.abs(holding.marketValue - targetValue);

    return {
      asset: holding.symbol,
      current,
      target,
      action,
      amount
    };
  });
}

function generateRecommendations(
  sharpeRatio: number,
  volatility: number,
  diversificationRatio: number,
  beta: number,
  expectedReturn: number,
  riskFreeRate: number,
  rebalancingNeeds: RebalancingNeed[],
  holdings: PortfolioHolding[]
): { recommendations: string[]; riskFactors: string[] } {
  const recommendations: string[] = [];
  const riskFactors: string[] = [];

  // Recommendations
  if (sharpeRatio < 0.8) {
    recommendations.push('Consider improving risk-adjusted returns by optimizing asset allocation');
  }
  if (volatility > 18) {
    recommendations.push('Portfolio volatility is high - consider adding more defensive assets');
  }
  if (diversificationRatio < 1.2) {
    recommendations.push('Increase diversification across uncorrelated asset classes');
  }
  if (beta > 1.3) {
    recommendations.push('Portfolio is highly sensitive to market movements - consider reducing risk');
  }
  if (expectedReturn < riskFreeRate + 3) {
    recommendations.push('Expected return may not adequately compensate for risk taken');
  }
  if (rebalancingNeeds.some(need => need.action !== 'Hold')) {
    recommendations.push('Portfolio allocation has drifted - consider rebalancing');
  }

  // Default recommendations
  if (recommendations.length === 0) {
    recommendations.push('Portfolio appears well-balanced for current risk tolerance');
    recommendations.push('Continue monitoring and rebalancing quarterly');
  }

  // Risk factors
  if (beta > 1.2) {
    riskFactors.push('High market sensitivity increases volatility during downturns');
  }
  if (volatility > 16) {
    riskFactors.push('Above-average volatility may lead to larger short-term losses');
  }
  if (diversificationRatio < 1.3) {
    riskFactors.push('Limited diversification increases concentration risk');
  }
  if (holdings.some(h => h.allocation > 50)) {
    riskFactors.push('High concentration in single asset increases idiosyncratic risk');
  }

  // Default risk factors
  if (riskFactors.length === 0) {
    riskFactors.push('Monitor correlation changes during market stress');
    riskFactors.push('Consider impact of inflation on bond allocation');
  }

  return { recommendations, riskFactors };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(percent: number): string {
  return `${percent.toFixed(2)}%`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Excellent': return 'text-green-400';
    case 'Good': return 'text-blue-400';
    case 'Fair': return 'text-yellow-400';
    case 'Poor': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function getActionColor(action: string): string {
  switch (action) {
    case 'Buy': return 'text-green-400 bg-green-900/20';
    case 'Sell': return 'text-red-400 bg-red-900/20';
    case 'Hold': return 'text-slate-400 bg-slate-900/20';
    default: return 'text-slate-400 bg-slate-900/20';
  }
}


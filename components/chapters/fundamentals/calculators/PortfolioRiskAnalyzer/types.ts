export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  allocation: number;
  expectedReturn: number;
  volatility: number;
  beta: number;
  marketValue: number;
}

export interface CorrelationMatrix {
  [key: string]: { [key: string]: number };
}

export interface PortfolioMetrics {
  totalValue: number;
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  beta: number;
  diversificationRatio: number;
  var95: number;
  var99: number;
  maxDrawdown: number;
  treynorRatio: number;
  informationRatio: number;
  sortino: number;
  allocations: { 
    asset: string; 
    percentage: number; 
    value: number;
  }[];
  riskMetrics: {
    metric: string;
    value: string;
    benchmark: string;
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
  }[];
  rebalancingNeeds: {
    asset: string;
    current: number;
    target: number;
    action: 'Buy' | 'Sell' | 'Hold';
    amount: number;
  }[];
  recommendations: string[];
  riskFactors: string[];
}

export interface RiskMetric {
  metric: string;
  value: string;
  benchmark: string;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  description: string;
}

export interface RebalancingNeed {
  asset: string;
  current: number;
  target: number;
  action: 'Buy' | 'Sell' | 'Hold';
  amount: number;
}

export interface PortfolioAllocation {
  asset: string;
  percentage: number;
  value: number;
}

export interface AnalysisParameters {
  riskFreeRate: number;
  marketReturn: number;
  timeHorizon: number;
  rebalancingThreshold: number;
}

export interface PortfolioState {
  holdings: PortfolioHolding[];
  parameters: AnalysisParameters;
  metrics: PortfolioMetrics | null;
}

export interface PortfolioActions {
  addHolding: () => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, field: keyof PortfolioHolding, value: string | number) => void;
  updateParameter: (field: keyof AnalysisParameters, value: number) => void;
  reset: () => void;
}


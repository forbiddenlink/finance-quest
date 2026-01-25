import { ROIInputs, ROIResults, InvestmentCategory, ROIStatus } from './types';
import { Target, Building, Users, Briefcase, ArrowDownRight, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';

export const calculateROI = (inputs: ROIInputs): {
  results: ROIResults;
  categories: InvestmentCategory[];
} => {
  // Total Investment
  const totalInvestment = inputs.initialInvestment + inputs.additionalInvestments;
  
  // Marketing ROI Calculation
  const customersAcquired = inputs.marketingBudget / inputs.customerAcquisitionCost;
  const marketingRevenue = customersAcquired * inputs.customerLifetimeValue * (inputs.conversionRate / 100);
  const marketingROI = ((marketingRevenue - inputs.marketingBudget) / inputs.marketingBudget) * 100;
  
  // Technology ROI Calculation
  const technologyReturns = inputs.costSavings + inputs.revenueIncrease;
  const technologyROI = ((technologyReturns - inputs.technologyCosts) / inputs.technologyCosts) * 100;
  
  // Human Capital ROI Calculation
  const humanCapitalInvestment = inputs.hiringCosts + inputs.trainingCosts;
  const productivityValue = inputs.salaryIncrease * (inputs.productivityGain / 100) * inputs.timeHorizon;
  const humanCapitalROI = ((productivityValue - humanCapitalInvestment) / humanCapitalInvestment) * 100;
  
  // Operations ROI Calculation
  const operationalProfit = inputs.revenueGenerated - inputs.operationalExpenses;
  const marginBonus = inputs.revenueGenerated * (inputs.marginImprovement / 100);
  const operationsROI = ((operationalProfit + marginBonus) / inputs.operationalExpenses) * 100;
  
  // Overall Financial Metrics
  const totalReturns = marketingRevenue + technologyReturns + productivityValue + operationalProfit + marginBonus;
  const netGain = totalReturns - totalInvestment;
  const simpleROI = (netGain / totalInvestment) * 100;
  const annualizedROI = (Math.pow((totalReturns / totalInvestment), (1 / inputs.timeHorizon)) - 1) * 100;
  
  // Risk-Adjusted Return
  const riskAdjustedReturn = annualizedROI - inputs.riskAdjustment;
  
  // NPV Calculation
  let npv = -totalInvestment;
  for (let year = 1; year <= inputs.timeHorizon; year++) {
    const yearlyReturn = totalReturns / inputs.timeHorizon;
    npv += yearlyReturn / Math.pow(1 + inputs.discountRate / 100, year);
  }
  
  // Payback Period
  const yearlyReturn = totalReturns / inputs.timeHorizon;
  const paybackPeriod = totalInvestment / yearlyReturn;
  
  // Profitability Index
  const profitabilityIndex = (npv + totalInvestment) / totalInvestment;
  
  // IRR Estimation (simplified)
  const internalRateOfReturn = ((totalReturns / totalInvestment) ** (1 / inputs.timeHorizon) - 1) * 100;
  
  // Break-even Point
  const breakEvenPoint = totalInvestment / (totalReturns / inputs.timeHorizon) * 12; // in months

  const results: ROIResults = {
    simpleROI,
    annualizedROI,
    netPresentValue: npv,
    paybackPeriod,
    profitabilityIndex,
    internalRateOfReturn,
    totalReturn: totalReturns,
    riskAdjustedReturn,
    marketingROI,
    technologyROI,
    humanCapitalROI,
    operationsROI,
    breakEvenPoint
  };

  // Investment Categories for visualization
  const categories: InvestmentCategory[] = [
    {
      name: 'Marketing',
      investment: inputs.marketingBudget,
      returns: marketingRevenue,
      roi: marketingROI,
      payback: inputs.marketingBudget / (marketingRevenue / inputs.timeHorizon) * 12,
      icon: <Target className="w-5 h-5" />,
      color: 'blue'
    },
    {
      name: 'Technology',
      investment: inputs.technologyCosts,
      returns: technologyReturns,
      roi: technologyROI,
      payback: inputs.technologyCosts / (technologyReturns / inputs.timeHorizon) * 12,
      icon: <Building className="w-5 h-5" />,
      color: 'purple'
    },
    {
      name: 'Human Capital',
      investment: humanCapitalInvestment,
      returns: productivityValue,
      roi: humanCapitalROI,
      payback: humanCapitalInvestment / (productivityValue / inputs.timeHorizon) * 12,
      icon: <Users className="w-5 h-5" />,
      color: 'green'
    },
    {
      name: 'Operations',
      investment: inputs.operationalExpenses,
      returns: operationalProfit + marginBonus,
      roi: operationsROI,
      payback: inputs.operationalExpenses / ((operationalProfit + marginBonus) / inputs.timeHorizon) * 12,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'amber'
    }
  ];

  return { results, categories };
};

export const getROIStatus = (roi: number): ROIStatus => {
  if (roi < 0) {
    return { 
      color: 'text-red-400', 
      icon: <ArrowDownRight className="w-4 h-4" />,
      message: 'Negative return - reassess strategy'
    };
  } else if (roi < 15) {
    return { 
      color: 'text-amber-400', 
      icon: <Clock className="w-4 h-4" />,
      message: 'Low return - consider alternatives'
    };
  } else if (roi < 30) {
    return { 
      color: 'text-blue-400', 
      icon: <TrendingUp className="w-4 h-4" />,
      message: 'Moderate return - acceptable investment'
    };
  } else {
    return { 
      color: 'text-green-400', 
      icon: <ArrowUpRight className="w-4 h-4" />,
      message: 'High return - excellent investment'
    };
  }
};

export const getInvestmentAdvice = (categories: InvestmentCategory[]): string => {
  if (!categories.length) return '';
  
  const bestCategory = categories.reduce((best, current) => 
    current.roi > best.roi ? current : best, categories[0]);
  
  return `${bestCategory.name} shows the highest ROI at ${bestCategory.roi.toFixed(1)}%. Consider reallocating resources to maximize returns.`;
};

export const formatCurrency = (amount: number): string => {
  if (Math.abs(amount) >= 1000000) {
    return `${amount < 0 ? '-' : ''}$${Math.abs(amount / 1000000).toFixed(1)}M`;
  } else if (Math.abs(amount) >= 1000) {
    return `${amount < 0 ? '-' : ''}$${Math.abs(amount / 1000).toFixed(0)}K`;
  }
  return `${amount < 0 ? '-' : ''}$${Math.abs(amount).toLocaleString()}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatMonths = (months: number): string => {
  if (months < 12) {
    return `${months.toFixed(1)} months`;
  } else {
    return `${(months / 12).toFixed(1)} years`;
  }
};


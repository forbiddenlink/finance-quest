import { LucideIcon } from 'lucide-react';

export interface ROIInputs {
  // Investment Details
  initialInvestment: number;
  additionalInvestments: number;
  timeHorizon: number;
  
  // Marketing Investments
  marketingBudget: number;
  customerAcquisitionCost: number;
  customerLifetimeValue: number;
  conversionRate: number;
  
  // Technology Investments
  technologyCosts: number;
  efficiencyGains: number;
  costSavings: number;
  revenueIncrease: number;
  
  // Human Capital
  hiringCosts: number;
  trainingCosts: number;
  salaryIncrease: number;
  productivityGain: number;
  
  // Operations
  operationalExpenses: number;
  revenueGenerated: number;
  marginImprovement: number;
  
  // Risk Factors
  riskAdjustment: number;
  inflationRate: number;
  discountRate: number;
}

export interface ROIResults {
  simpleROI: number;
  annualizedROI: number;
  netPresentValue: number;
  paybackPeriod: number;
  profitabilityIndex: number;
  internalRateOfReturn: number;
  totalReturn: number;
  riskAdjustedReturn: number;
  marketingROI: number;
  technologyROI: number;
  humanCapitalROI: number;
  operationsROI: number;
  breakEvenPoint: number;
}

export interface InvestmentCategory {
  name: string;
  investment: number;
  returns: number;
  roi: number;
  payback: number;
  icon: React.ReactNode;
  color: string;
}

export interface ROIStatus {
  color: string;
  icon: React.ReactNode;
  message: string;
}

export interface CalculatorMetadata {
  id: string;
  title: string;
  description: string;
  category: 'advanced';
  icon: LucideIcon;
  tags: string[];
  educationalNotes: {
    title: string;
    content: string;
    tips: string[];
  }[];
}

export interface CalculatorResults {
  primary: {
    label: string;
    value: number;
    format: 'percentage';
  };
  secondary: {
    label: string;
    value: number;
    format: 'currency' | 'number';
  }[];
}

export type InvestmentTab = 'marketing' | 'tech' | 'human' | 'operations';


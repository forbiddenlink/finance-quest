import { useState, useCallback, useEffect } from 'react';
import { ROIInputs, ROIResults, InvestmentCategory, InvestmentTab, CalculatorResults } from './types';
import { calculateROI, getROIStatus, getInvestmentAdvice } from './utils';
import { Briefcase } from 'lucide-react';

const defaultInputs: ROIInputs = {
  initialInvestment: 100000,
  additionalInvestments: 50000,
  timeHorizon: 3,
  marketingBudget: 30000,
  customerAcquisitionCost: 150,
  customerLifetimeValue: 1200,
  conversionRate: 3.5,
  technologyCosts: 25000,
  efficiencyGains: 15,
  costSavings: 40000,
  revenueIncrease: 80000,
  hiringCosts: 20000,
  trainingCosts: 10000,
  salaryIncrease: 60000,
  productivityGain: 25,
  operationalExpenses: 200000,
  revenueGenerated: 350000,
  marginImprovement: 5,
  riskAdjustment: 15,
  inflationRate: 3,
  discountRate: 10
};

const defaultResults: ROIResults = {
  simpleROI: 0,
  annualizedROI: 0,
  netPresentValue: 0,
  paybackPeriod: 0,
  profitabilityIndex: 0,
  internalRateOfReturn: 0,
  totalReturn: 0,
  riskAdjustedReturn: 0,
  marketingROI: 0,
  technologyROI: 0,
  humanCapitalROI: 0,
  operationsROI: 0,
  breakEvenPoint: 0
};

export const useEntrepreneurshipROI = () => {
  const [inputs, setInputs] = useState<ROIInputs>(defaultInputs);
  const [results, setResults] = useState<ROIResults>(defaultResults);
  const [investmentCategories, setInvestmentCategories] = useState<InvestmentCategory[]>([]);
  const [activeTab, setActiveTab] = useState<InvestmentTab>('marketing');

  const calculateResults = useCallback(() => {
    const { results: newResults, categories } = calculateROI(inputs);
    setResults(newResults);
    setInvestmentCategories(categories);
  }, [inputs]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const handleReset = () => {
    setInputs(defaultInputs);
    setActiveTab('marketing');
  };

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const metadata = {
    id: "entrepreneurship-roi-calculator",
    title: "Entrepreneurship ROI Calculator",
    description: "Analyze return on investment across multiple business initiatives including marketing, technology, human capital, and operations to optimize resource allocation decisions.",
    category: 'advanced' as const,
    icon: Briefcase,
    tags: ["business", "roi", "investment", "entrepreneurship", "analysis"],
    educationalNotes: [
      {
        title: "Understanding ROI Metrics",
        content: "Return on Investment (ROI) measures the efficiency of an investment. Annualized ROI accounts for time, while risk-adjusted ROI considers potential uncertainties.",
        tips: [
          "Compare ROI across different investment categories",
          "Consider both financial and strategic benefits",
          "Factor in opportunity costs and market conditions"
        ]
      },
      {
        title: "Investment Category Analysis",
        content: "Different business investments have varying risk profiles and return timelines. Marketing investments often show quicker returns, while technology investments may have longer payback periods but greater long-term benefits.",
        tips: [
          "Diversify across multiple investment categories",
          "Monitor actual vs. projected returns regularly",
          "Adjust strategy based on performance data"
        ]
      }
    ]
  };

  const calculatorResults: CalculatorResults = {
    primary: { 
      label: "Annualized ROI", 
      value: results.annualizedROI, 
      format: "percentage"
    },
    secondary: [
      { label: "Total Return", value: results.totalReturn, format: "currency" },
      { label: "Net Present Value", value: results.netPresentValue, format: "currency" },
      { label: "Payback Period", value: results.paybackPeriod, format: "number" },
      { label: "Profitability Index", value: results.profitabilityIndex, format: "number" }
    ]
  };

  return {
    // State
    inputs,
    results,
    investmentCategories,
    activeTab,

    // Actions
    handleInputChange,
    handleReset,
    setActiveTab,

    // Computed
    roiStatus: getROIStatus(results.annualizedROI),
    investmentAdvice: getInvestmentAdvice(investmentCategories),
    metadata,
    calculatorResults
  };
};


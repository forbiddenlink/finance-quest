'use client';

import { useCalculatorBase } from '../useCalculatorBase';
import Decimal from 'decimal.js';

// Types
interface BondValues {
  faceValue: number;
  couponRate: number;
  marketPrice: number;
  yearsToMaturity: number;
  paymentFrequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  currentYield?: number; // Market interest rate
  reinvestmentRate?: number;
}

interface BondResult {
  // Core Metrics
  yieldToMaturity: number;
  modifiedDuration: number;
  macaulayDuration: number;
  convexity: number;

  // Cash Flow Analysis
  presentValue: number;
  totalCashflows: number;
  couponPayments: Array<{
    date: string;
    amount: number;
    presentValue: number;
  }>;

  // Risk Metrics
  priceChangeFor1PercentYieldChange: number;
  interestRateRisk: 'low' | 'moderate' | 'high';
  reinvestmentRisk: 'low' | 'moderate' | 'high';

  // Performance Metrics
  currentYield: number;
  totalReturn: number;
  holdingPeriodReturn: number;

  // Analysis
  recommendations: string[];
  riskAnalysis: {
    interestRateRisk: string;
    creditRisk: string;
    reinvestmentRisk: string;
  };
}

// Validation rules
const validationRules = {
  faceValue: (value: number) => {
    if (value <= 0) return 'Face value must be positive';
    if (value > 10000000) return 'Face value exceeds maximum limit';
    return null;
  },
  couponRate: (value: number) => {
    if (value < 0) return 'Coupon rate cannot be negative';
    if (value > 100) return 'Coupon rate cannot exceed 100%';
    return null;
  },
  marketPrice: (value: number) => {
    if (value <= 0) return 'Market price must be positive';
    if (value > 10000000) return 'Market price exceeds maximum limit';
    return null;
  },
  yearsToMaturity: (value: number) => {
    if (value <= 0) return 'Years to maturity must be positive';
    if (value > 100) return 'Years to maturity cannot exceed 100';
    return null;
  },
  paymentFrequency: (value: string) => {
    if (!['annual', 'semi-annual', 'quarterly', 'monthly'].includes(value)) {
      return 'Invalid payment frequency';
    }
    return null;
  },
  currentYield: (value: number | undefined) => {
    if (value === undefined) return null;
    if (value < 0) return 'Current yield cannot be negative';
    if (value > 100) return 'Current yield cannot exceed 100%';
    return null;
  },
  reinvestmentRate: (value: number | undefined) => {
    if (value === undefined) return null;
    if (value < 0) return 'Reinvestment rate cannot be negative';
    if (value > 100) return 'Reinvestment rate cannot exceed 100%';
    return null;
  }
};

// Initial values
const initialValues: BondValues = {
  faceValue: 1000,
  couponRate: 5,
  marketPrice: 1000,
  yearsToMaturity: 10,
  paymentFrequency: 'semi-annual',
  currentYield: undefined,
  reinvestmentRate: undefined
};

// Calculator hook
export function useBondCalculator() {
  return useCalculatorBase<BondValues, BondResult>({
    id: 'bond',
    initialValues,
    validation: validationRules,
    compute: async (values) => {
      // Calculate payments per year based on frequency
      const paymentsPerYear = getPaymentsPerYear(values.paymentFrequency);
      const totalPayments = values.yearsToMaturity * paymentsPerYear;
      const couponPaymentAmount = (values.faceValue * (values.couponRate / 100)) / paymentsPerYear;

      // Calculate YTM using Newton-Raphson method
      const ytm = calculateYTM(values, paymentsPerYear);

      // Calculate durations and convexity
      const { modifiedDuration, macaulayDuration, convexity } = calculateDurationAndConvexity(
        values,
        ytm,
        paymentsPerYear
      );

      // Generate cash flow analysis
      const cashFlows = generateCashFlows(values, paymentsPerYear);

      // Calculate present value
      const presentValue = calculatePresentValue(cashFlows, ytm / paymentsPerYear);

      // Calculate risk metrics
      const priceChangeFor1PercentYieldChange = calculatePriceChange(modifiedDuration, convexity);
      const interestRateRisk = assessInterestRateRisk(modifiedDuration);
      const reinvestmentRisk = assessReinvestmentRisk(values, ytm);

      // Calculate performance metrics
      const currentYield = (couponPaymentAmount * paymentsPerYear / values.marketPrice) * 100;
      const totalReturn = calculateTotalReturn(values, ytm);
      const holdingPeriodReturn = calculateHoldingPeriodReturn(values, ytm);

      // Generate analysis and recommendations
      const { recommendations, riskAnalysis } = generateAnalysis(values, {
        ytm,
        modifiedDuration,
        currentYield,
        interestRateRisk,
        reinvestmentRisk
      });

      return {
        yieldToMaturity: ytm,
        modifiedDuration,
        macaulayDuration,
        convexity,
        presentValue,
        totalCashflows: cashFlows.reduce((sum, cf) => sum + cf.amount, 0),
        couponPayments: cashFlows,
        priceChangeFor1PercentYieldChange,
        interestRateRisk,
        reinvestmentRisk,
        currentYield,
        totalReturn,
        holdingPeriodReturn,
        recommendations,
        riskAnalysis
      };
    }
  });
}

// Helper functions
function getPaymentsPerYear(frequency: string): number {
  switch (frequency) {
    case 'annual': return 1;
    case 'semi-annual': return 2;
    case 'quarterly': return 4;
    case 'monthly': return 12;
    default: return 2;
  }
}

function calculateYTM(values: BondValues, paymentsPerYear: number): number {
  const couponPayment = (values.faceValue * (values.couponRate / 100)) / paymentsPerYear;
  let ytm = values.couponRate / 100; // Initial guess
  const tolerance = 0.0001;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    let price = 0;
    const r = ytm / paymentsPerYear;

    // Calculate present value of all cash flows
    for (let t = 1; t <= values.yearsToMaturity * paymentsPerYear; t++) {
      price += couponPayment / Math.pow(1 + r, t);
    }
    price += values.faceValue / Math.pow(1 + r, values.yearsToMaturity * paymentsPerYear);

    const diff = price - values.marketPrice;
    if (Math.abs(diff) < tolerance) {
      break;
    }

    // Update YTM using Newton-Raphson method
    let derivative = 0;
    for (let t = 1; t <= values.yearsToMaturity * paymentsPerYear; t++) {
      derivative -= (t * couponPayment) / Math.pow(1 + r, t + 1);
    }
    derivative -= (values.yearsToMaturity * paymentsPerYear * values.faceValue) /
      Math.pow(1 + r, values.yearsToMaturity * paymentsPerYear + 1);

    ytm -= (diff / derivative) * paymentsPerYear;
  }

  return ytm * 100; // Convert to percentage
}

function calculateDurationAndConvexity(
  values: BondValues,
  ytm: number,
  paymentsPerYear: number
): { modifiedDuration: number; macaulayDuration: number; convexity: number } {
  const r = ytm / 100 / paymentsPerYear;
  const couponPayment = (values.faceValue * (values.couponRate / 100)) / paymentsPerYear;
  let weightedTime = 0;
  let presentValue = 0;
  let convexity = 0;

  for (let t = 1; t <= values.yearsToMaturity * paymentsPerYear; t++) {
    const pv = couponPayment / Math.pow(1 + r, t);
    weightedTime += (t * pv) / paymentsPerYear;
    presentValue += pv;
    convexity += (t * (t + 1) * pv) / Math.pow(1 + r, 2);
  }

  // Add face value components
  const finalPV = values.faceValue / Math.pow(1 + r, values.yearsToMaturity * paymentsPerYear);
  const finalT = values.yearsToMaturity * paymentsPerYear;
  weightedTime += (finalT * finalPV) / paymentsPerYear;
  presentValue += finalPV;
  convexity += (finalT * (finalT + 1) * finalPV) / Math.pow(1 + r, 2);

  const macaulayDuration = weightedTime / presentValue;
  const modifiedDuration = macaulayDuration / (1 + r);
  convexity = convexity / (presentValue * Math.pow(1 + r, 2));

  return {
    modifiedDuration,
    macaulayDuration,
    convexity: convexity / (paymentsPerYear * paymentsPerYear)
  };
}

function generateCashFlows(
  values: BondValues,
  paymentsPerYear: number
): Array<{ date: string; amount: number; presentValue: number }> {
  const couponPayment = (values.faceValue * (values.couponRate / 100)) / paymentsPerYear;
  const ytm = values.currentYield ?? values.couponRate;
  const r = ytm / 100 / paymentsPerYear;
  const cashFlows = [];
  const today = new Date();

  for (let t = 1; t <= values.yearsToMaturity * paymentsPerYear; t++) {
    const paymentDate = new Date(today);
    paymentDate.setMonth(today.getMonth() + Math.floor((12 / paymentsPerYear) * t));

    const pv = couponPayment / Math.pow(1 + r, t);
    cashFlows.push({
      date: paymentDate.toISOString().split('T')[0],
      amount: couponPayment,
      presentValue: pv
    });
  }

  // Add face value at maturity
  const maturityDate = new Date(today);
  maturityDate.setFullYear(today.getFullYear() + values.yearsToMaturity);
  const finalPV = values.faceValue / Math.pow(1 + r, values.yearsToMaturity * paymentsPerYear);

  cashFlows.push({
    date: maturityDate.toISOString().split('T')[0],
    amount: values.faceValue,
    presentValue: finalPV
  });

  return cashFlows;
}

function calculatePresentValue(
  cashFlows: Array<{ amount: number; presentValue: number }>,
  r: number
): number {
  return cashFlows.reduce((sum, cf) => sum + cf.presentValue, 0);
}

function calculatePriceChange(modifiedDuration: number, convexity: number): number {
  const yieldChange = 0.01; // 1% change
  return -(modifiedDuration * yieldChange) + (0.5 * convexity * yieldChange * yieldChange);
}

function assessInterestRateRisk(modifiedDuration: number): 'low' | 'moderate' | 'high' {
  if (modifiedDuration < 3) return 'low';
  if (modifiedDuration < 7) return 'moderate';
  return 'high';
}

function assessReinvestmentRisk(
  values: BondValues,
  ytm: number
): 'low' | 'moderate' | 'high' {
  const couponRate = values.couponRate;
  const timePeriod = values.yearsToMaturity;

  if (couponRate < 3 || timePeriod < 2) return 'low';
  if (couponRate > 7 || timePeriod > 10) return 'high';
  return 'moderate';
}

function calculateTotalReturn(values: BondValues, ytm: number): number {
  const income = values.couponRate;
  const priceReturn = ((values.faceValue - values.marketPrice) / values.marketPrice) * 100;
  return income + (priceReturn / values.yearsToMaturity);
}

function calculateHoldingPeriodReturn(values: BondValues, ytm: number): number {
  return (values.couponRate + ((values.faceValue - values.marketPrice) / values.marketPrice)) * 100;
}

function generateAnalysis(
  values: BondValues,
  metrics: {
    ytm: number;
    modifiedDuration: number;
    currentYield: number;
    interestRateRisk: 'low' | 'moderate' | 'high';
    reinvestmentRisk: 'low' | 'moderate' | 'high';
  }
): { recommendations: string[]; riskAnalysis: { [key: string]: string } } {
  const recommendations: string[] = [];
  const riskAnalysis: { [key: string]: string } = {
    interestRateRisk: '',
    creditRisk: '',
    reinvestmentRisk: ''
  };

  // YTM Analysis
  if (metrics.ytm > values.couponRate) {
    recommendations.push('Bond is trading at a discount, suggesting potential capital appreciation.');
  } else if (metrics.ytm < values.couponRate) {
    recommendations.push('Bond is trading at a premium, consider reinvestment risk.');
  }

  // Duration Analysis
  if (metrics.interestRateRisk === 'high') {
    recommendations.push('Consider shorter duration bonds to reduce interest rate risk.');
    riskAnalysis.interestRateRisk = 'High sensitivity to interest rate changes.';
  } else if (metrics.interestRateRisk === 'low') {
    recommendations.push('Bond offers good protection against interest rate changes.');
    riskAnalysis.interestRateRisk = 'Low sensitivity to interest rate changes.';
  }

  // Yield Analysis
  if (metrics.currentYield > values.couponRate + 2) {
    recommendations.push('High current yield suggests attractive income opportunity.');
  }

  // Maturity Analysis
  if (values.yearsToMaturity > 10) {
    recommendations.push('Long maturity increases both risk and potential return.');
    riskAnalysis.creditRisk = 'Extended exposure to credit risk due to long maturity.';
  } else if (values.yearsToMaturity < 3) {
    recommendations.push('Short maturity reduces risk but may limit return potential.');
    riskAnalysis.creditRisk = 'Limited exposure to credit risk due to short maturity.';
  }

  // Reinvestment Risk Analysis
  if (metrics.reinvestmentRisk === 'high') {
    recommendations.push('High coupon rate increases reinvestment risk in falling rate environment.');
    riskAnalysis.reinvestmentRisk = 'Significant exposure to reinvestment risk.';
  } else if (metrics.reinvestmentRisk === 'low') {
    recommendations.push('Low reinvestment risk due to modest coupon rate.');
    riskAnalysis.reinvestmentRisk = 'Limited exposure to reinvestment risk.';
  }

  return { recommendations, riskAnalysis };
}
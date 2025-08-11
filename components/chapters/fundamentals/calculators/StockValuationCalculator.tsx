'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  DollarSign,
  BarChart3,
  Target,
  AlertCircle,
  Percent,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ValuationResult {
  intrinsicValue: number;
  currentPrice: number;
  marginOfSafety: number;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  dcfValue: number;
  peValuation: number;
  pbValuation: number;
  pegValuation: number;
  dividendYield: number;
  roe: number;
  roic: number;
  debtToEquity: number;
  currentRatio: number;
  priceToBook: number;
  priceToEarnings: number;
  pegRatio: number;
  fairValueRange: { low: number; high: number };
  valuationMetrics: {
    metric: string;
    value: number;
    benchmark: string;
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  }[];
  investmentThesis: string[];
  riskFactors: string[];
}

export default function StockValuationCalculator() {
  const { recordCalculatorUsage } = useProgressStore();

  // Stock Information
  const [stockSymbol, setStockSymbol] = useState<string>('AAPL');
  const [currentPrice, setCurrentPrice] = useState<number>(175.50);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [sharesOutstanding, setSharesOutstanding] = useState<number>(15500); // millions
  const [marketCap, setMarketCap] = useState<number>(2720); // billions

  // Financial Metrics
  const [revenue, setRevenue] = useState<number>(394.33); // billions
  const [netIncome, setNetIncome] = useState<number>(99.80); // billions
  const [earnings, setEarnings] = useState<number>(6.43); // EPS
  const [bookValue, setBookValue] = useState<number>(4.26); // book value per share
  const [freeCashFlow, setFreeCashFlow] = useState<number>(84.73); // billions
  const [dividendPerShare, setDividendPerShare] = useState<number>(0.94);
  const [totalAssets, setTotalAssets] = useState<number>(352.76); // billions
  const [totalLiabilities, setTotalLiabilities] = useState<number>(290.44); // billions
  const [currentAssets] = useState<number>(135.41); // billions
  const [currentLiabilities] = useState<number>(133.97); // billions

  // Growth Assumptions
  const [revenueGrowthRate, setRevenueGrowthRate] = useState<number>(5.5);
  const [earningsGrowthRate, setEarningsGrowthRate] = useState<number>(7.2);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState<number>(2.5);
  const [discountRate, setDiscountRate] = useState<number>(10.0);
  const [projectionYears] = useState<number>(5);

  // Valuation Multiples
  const [industryPE, setIndustryPE] = useState<number>(24.5);
  const [industryPB, setIndustryPB] = useState<number>(3.8);
  const [industryPEG, setIndustryPEG] = useState<number>(1.2);

  const [valuation, setValuation] = useState<ValuationResult | null>(null);

  useEffect(() => {
    recordCalculatorUsage('stock-valuation-calculator');
  }, [recordCalculatorUsage]);

  const calculateDCF = useMemo(() => {
    const projectedCashFlows: number[] = [];
    let currentFCF = freeCashFlow;
    
    // Project future cash flows
    for (let year = 1; year <= projectionYears; year++) {
      currentFCF *= (1 + earningsGrowthRate / 100);
      const discountedValue = currentFCF / Math.pow(1 + discountRate / 100, year);
      projectedCashFlows.push(discountedValue);
    }
    
    // Terminal value
    const terminalValue = (currentFCF * (1 + terminalGrowthRate / 100)) / 
                         (discountRate / 100 - terminalGrowthRate / 100);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, projectionYears);
    
    // Enterprise value
    const enterpriseValue = projectedCashFlows.reduce((sum, cf) => sum + cf, 0) + discountedTerminalValue;
    
    // Per share value (assuming no net debt for simplicity)
    return enterpriseValue / (sharesOutstanding / 1000); // Convert millions to billions
  }, [freeCashFlow, earningsGrowthRate, terminalGrowthRate, discountRate, projectionYears, sharesOutstanding]);

  const analyzeStock = useCallback(() => {
    // Calculate key ratios
    const equity = totalAssets - totalLiabilities;
    const roe = (netIncome / equity) * 100;
    const roic = (netIncome / (equity + totalLiabilities)) * 100;
    const debtToEquity = totalLiabilities / equity;
    const currentRatio = currentAssets / currentLiabilities;
    const priceToEarnings = currentPrice / earnings;
    const priceToBook = currentPrice / bookValue;
    const pegRatio = priceToEarnings / earningsGrowthRate;
    const dividendYield = (dividendPerShare / currentPrice) * 100;

    // DCF Valuation
    const dcfValue = calculateDCF;

    // Multiple-based valuations
    const peValuation = earnings * industryPE;
    const pbValuation = bookValue * industryPB;
    const pegValuation = earnings * industryPEG * earningsGrowthRate;

    // Weighted intrinsic value
    const intrinsicValue = (dcfValue * 0.4) + (peValuation * 0.3) + (pbValuation * 0.2) + (pegValuation * 0.1);
    
    // Margin of safety
    const marginOfSafety = ((intrinsicValue - currentPrice) / intrinsicValue) * 100;

    // Fair value range
    const fairValueRange = {
      low: intrinsicValue * 0.8,
      high: intrinsicValue * 1.2
    };

    // Recommendation logic
    let recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
    if (marginOfSafety >= 30) recommendation = 'Strong Buy';
    else if (marginOfSafety >= 15) recommendation = 'Buy';
    else if (marginOfSafety >= -15) recommendation = 'Hold';
    else if (marginOfSafety >= -30) recommendation = 'Sell';
    else recommendation = 'Strong Sell';

    // Valuation metrics analysis
    const valuationMetrics = [
      {
        metric: 'P/E Ratio',
        value: priceToEarnings,
        benchmark: `Industry: ${industryPE}`,
        rating: (priceToEarnings < industryPE * 0.8 ? 'Excellent' : 
                priceToEarnings < industryPE ? 'Good' : 
                priceToEarnings < industryPE * 1.2 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor'
      },
      {
        metric: 'P/B Ratio',
        value: priceToBook,
        benchmark: `Industry: ${industryPB}`,
        rating: (priceToBook < industryPB * 0.8 ? 'Excellent' : 
                priceToBook < industryPB ? 'Good' : 
                priceToBook < industryPB * 1.2 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor'
      },
      {
        metric: 'PEG Ratio',
        value: pegRatio,
        benchmark: 'Target: < 1.0',
        rating: (pegRatio < 0.5 ? 'Excellent' : 
                pegRatio < 1.0 ? 'Good' : 
                pegRatio < 1.5 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor'
      },
      {
        metric: 'ROE (%)',
        value: roe,
        benchmark: 'Target: > 15%',
        rating: (roe > 20 ? 'Excellent' : 
                roe > 15 ? 'Good' : 
                roe > 10 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor'
      },
      {
        metric: 'Current Ratio',
        value: currentRatio,
        benchmark: 'Target: 1.5-3.0',
        rating: (currentRatio >= 1.5 && currentRatio <= 3.0 ? 'Excellent' : 
                currentRatio >= 1.2 && currentRatio < 1.5 ? 'Good' : 
                currentRatio >= 1.0 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor'
      },
      {
        metric: 'Debt/Equity',
        value: debtToEquity,
        benchmark: 'Target: < 0.5',
        rating: (debtToEquity < 0.3 ? 'Excellent' : 
                debtToEquity < 0.5 ? 'Good' : 
                debtToEquity < 1.0 ? 'Fair' : 'Poor') as 'Excellent' | 'Good' | 'Fair' | 'Poor'
      }
    ];

    // Investment thesis
    const investmentThesis: string[] = [];
    const riskFactors: string[] = [];

    // Positive factors
    if (marginOfSafety > 20) {
      investmentThesis.push('Stock trading at significant discount to intrinsic value');
    }
    if (roe > 15) {
      investmentThesis.push('Strong return on equity indicates efficient capital allocation');
    }
    if (earningsGrowthRate > 10) {
      investmentThesis.push('Strong earnings growth rate supports valuation premium');
    }
    if (currentRatio > 1.5) {
      investmentThesis.push('Solid liquidity position reduces financial risk');
    }
    if (dividendYield > 2) {
      investmentThesis.push('Attractive dividend yield provides income component');
    }
    if (pegRatio < 1.0) {
      investmentThesis.push('PEG ratio below 1.0 suggests undervalued growth');
    }
    if (debtToEquity < 0.5) {
      investmentThesis.push('Conservative debt levels reduce financial leverage risk');
    }

    // Risk factors
    if (priceToEarnings > industryPE * 1.5) {
      riskFactors.push('High P/E ratio relative to industry peers');
    }
    if (pegRatio > 2.0) {
      riskFactors.push('High PEG ratio suggests overvalued growth expectations');
    }
    if (currentRatio < 1.2) {
      riskFactors.push('Low current ratio may indicate liquidity concerns');
    }
    if (debtToEquity > 1.0) {
      riskFactors.push('High debt levels increase financial leverage risk');
    }
    if (revenueGrowthRate < 5) {
      riskFactors.push('Low revenue growth may limit future earnings potential');
    }
    if (marginOfSafety < -20) {
      riskFactors.push('Stock trading at significant premium to estimated fair value');
    }
    if (roe < 10) {
      riskFactors.push('Low ROE suggests inefficient capital allocation');
    }

    // Default messages
    if (investmentThesis.length === 0) {
      investmentThesis.push('Mixed fundamental indicators require careful analysis');
    }
    if (riskFactors.length === 0) {
      riskFactors.push('Monitor market conditions and company-specific developments');
    }

    const result: ValuationResult = {
      intrinsicValue,
      currentPrice,
      marginOfSafety,
      recommendation,
      dcfValue,
      peValuation,
      pbValuation,
      pegValuation,
      dividendYield,
      roe,
      roic,
      debtToEquity,
      currentRatio,
      priceToBook,
      priceToEarnings,
      pegRatio,
      fairValueRange,
      valuationMetrics,
      investmentThesis,
      riskFactors
    };

    setValuation(result);
  }, [
    currentPrice, netIncome, earnings,
    bookValue, dividendPerShare, totalAssets, totalLiabilities,
    currentAssets, currentLiabilities, revenueGrowthRate, earningsGrowthRate,
    industryPE, industryPB, industryPEG, calculateDCF
  ]);

  useEffect(() => {
    analyzeStock();
  }, [analyzeStock]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent.toFixed(2)}%`;
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'text-green-400 bg-green-900/20';
      case 'Buy': return 'text-green-300 bg-green-900/15';
      case 'Hold': return 'text-yellow-400 bg-yellow-900/20';
      case 'Sell': return 'text-red-300 bg-red-900/15';
      case 'Strong Sell': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400 bg-slate-900/20';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'Excellent': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Good': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'Fair': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'Poor': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Stock Valuation Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Stock Information */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Stock Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="stock-symbol"
                  className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                >
                  Stock Symbol
                </label>
                <input
                  id="stock-symbol"
                  type="text"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  placeholder="AAPL"
                />
              </div>

              <div>
                <label 
                  htmlFor="current-stock-price"
                  className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                >
                  Current Stock Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <div>
                        <input
                          id="current-stock-price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={currentPrice}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setCurrentPrice(value);
                            if (value < 0) {
                              setPriceError('Invalid price: must be positive');
                            } else {
                              setPriceError(null);
                            }
                          }}
                          onBlur={(e) => {
                            const value = Number(e.target.value);
                            if (value < 0) {
                              setPriceError('Invalid price: must be positive');
                            } else {
                              setPriceError(null);
                            }
                          }}
                          aria-invalid={priceError !== null}
                          aria-describedby={priceError ? 'current-price-error' : undefined}
                          className={`w-full pl-10 pr-4 py-2 bg-slate-800 border ${priceError ? 'border-red-500' : 'border-slate-600'} rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                        />
                        {priceError && (
                          <div id="current-price-error" role="alert" aria-live="polite" className="text-red-400 text-sm mt-1">
                            {priceError}
                          </div>
                        )}
                      </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label 
                    htmlFor="shares-outstanding"
                    className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                  >
                    Shares Outstanding (M)
                  </label>
                  <input
                    id="shares-outstanding"
                    type="number"
                    step="1"
                    min="0"
                    value={sharesOutstanding}
                    onChange={(e) => setSharesOutstanding(Number(e.target.value))}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="market-cap"
                    className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                  >
                    Market Cap (B)
                  </label>
                  <input
                    id="market-cap"
                    type="number"
                    step="0.01"
                    min="0"
                    value={marketCap}
                    onChange={(e) => setMarketCap(Number(e.target.value))}
                    className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Financial Metrics
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Revenue (B)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Net Income (B)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={netIncome}
                    onChange={(e) => setNetIncome(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="eps-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    EPS
                  </label>
                  <input
                    id="eps-input"
                    type="number"
                    step="0.01"
                    value={earnings}
                    onChange={(e) => setEarnings(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>

                <div>
                  <label htmlFor="book-value-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Book Value/Share
                  </label>
                  <input
                    id="book-value-input"
                    type="number"
                    step="0.01"
                    value={bookValue}
                    onChange={(e) => setBookValue(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="free-cash-flow-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Free Cash Flow (B)
                  </label>
                  <input
                    id="free-cash-flow-input"
                    type="number"
                    step="0.01"
                    value={freeCashFlow}
                    onChange={(e) => setFreeCashFlow(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>

                <div>
                  <label htmlFor="dividend-per-share-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Dividend/Share
                  </label>
                  <input
                    id="dividend-per-share-input"
                    type="number"
                    step="0.01"
                    value={dividendPerShare}
                    onChange={(e) => setDividendPerShare(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Total Assets (B)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalAssets}
                    onChange={(e) => setTotalAssets(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Total Liabilities (B)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalLiabilities}
                    onChange={(e) => setTotalLiabilities(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Growth Assumptions */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Growth & Valuation Assumptions
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="revenue-growth-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Revenue Growth %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="revenue-growth-input"
                      type="number"
                      step="0.1"
                      value={revenueGrowthRate}
                      onChange={(e) => setRevenueGrowthRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="earnings-growth-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Earnings Growth %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="earnings-growth-input"
                      type="number"
                      step="0.1"
                      value={earningsGrowthRate}
                      onChange={(e) => setEarningsGrowthRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="discount-rate-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Discount Rate %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="discount-rate-input"
                      type="number"
                      step="0.1"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Terminal Growth %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={terminalGrowthRate}
                      onChange={(e) => setTerminalGrowthRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="industry-pe-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Industry P/E
                  </label>
                  <input
                    id="industry-pe-input"
                    type="number"
                    step="0.1"
                    value={industryPE}
                    onChange={(e) => setIndustryPE(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>

                <div>
                  <label htmlFor="industry-pb-input" className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Industry P/B
                  </label>
                  <input
                    id="industry-pb-input"
                    type="number"
                    step="0.1"
                    value={industryPB}
                    onChange={(e) => setIndustryPB(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Industry PEG
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={industryPEG}
                    onChange={(e) => setIndustryPEG(Number(e.target.value))}
                    className={`w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {valuation && (
            <>
              {/* Valuation Summary */}
              <div 
                className={`p-6 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}
                role="region"
                aria-label="Valuation Summary"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
                    {stockSymbol} Valuation Summary
                  </h3>
                  <div className={`px-4 py-2 rounded-lg font-semibold ${getRecommendationColor(valuation.recommendation)}`}>
                    {valuation.recommendation}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                      {formatCurrency(valuation.intrinsicValue)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Fair Value</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                      {formatCurrency(valuation.currentPrice)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Current Price</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      valuation.marginOfSafety >= 0 ? 'text-green-400' : 'text-red-400'
                    } mb-1`}>
                      {formatPercent(valuation.marginOfSafety)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Margin of Safety</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-600">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Fair Value Range:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(valuation.fairValueRange.low)} - {formatCurrency(valuation.fairValueRange.high)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>DCF Value:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(valuation.dcfValue)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>P/E Valuation:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(valuation.peValuation)}
                      </div>
                    </div>
                    <div>
                      <span className={`${theme.textColors.secondary}`}>Dividend Yield:</span>
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatPercent(valuation.dividendYield)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Valuation Metrics */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Valuation Metrics Analysis
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left">Metric</th>
                        <th scope="col" className="px-4 py-3 text-left">Current</th>
                        <th scope="col" className="px-4 py-3 text-left">Benchmark</th>
                        <th scope="col" className="px-4 py-3 text-left">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valuation.valuationMetrics.map((metric, index) => (
                        <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {metric.metric}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {metric.metric.includes('%') ? formatPercent(metric.value) : formatNumber(metric.value)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.secondary}`}>
                            {metric.benchmark}
                          </td>
                          <td className={`px-4 py-3`}>
                            <div className="flex items-center gap-2">
                              {getRatingIcon(metric.rating)}
                              <span className={getRatingColor(metric.rating)}>
                                {metric.rating}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Investment Thesis */}
              <div 
                className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}
                role="region"
                aria-label="Investment Thesis"
              >
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Investment Thesis
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {valuation.investmentThesis.map((point, index) => (
                        <li key={index}>• {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div 
                className={`p-4 bg-red-900/20 border border-red-500/20 rounded-lg`}
                role="region"
                aria-label="Risk Factors"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold text-red-400 mb-2`}>
                      Risk Factors
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {valuation.riskFactors.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Valuation Education */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  Stock Valuation Methods Explained
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Valuation Methods:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>DCF (40%):</strong> Discounted future cash flows to present value</li>
                      <li>• <strong>P/E Multiple (30%):</strong> Earnings × industry P/E ratio</li>
                      <li>• <strong>P/B Multiple (20%):</strong> Book value × industry P/B ratio</li>
                      <li>• <strong>PEG Multiple (10%):</strong> Growth-adjusted P/E valuation</li>
                    </ul>
                  </div>
                  <div>
                    <p className={`${theme.textColors.secondary} mb-2`}><strong>Key Ratios:</strong></p>
                    <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                      <li>• <strong>P/E Ratio:</strong> Price per share ÷ earnings per share</li>
                      <li>• <strong>PEG Ratio:</strong> P/E ratio ÷ earnings growth rate</li>
                      <li>• <strong>ROE:</strong> Net income ÷ shareholders&apos; equity</li>
                      <li>• <strong>Current Ratio:</strong> Current assets ÷ current liabilities</li>
                      <li>• <strong>Margin of Safety:</strong> (Fair value - price) ÷ fair value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

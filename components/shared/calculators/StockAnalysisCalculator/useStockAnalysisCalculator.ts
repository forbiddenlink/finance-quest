import { useState, useCallback } from 'react';
import {
  StockAnalysisState,
  StockAnalysisActions,
  AnalysisTimeframe,
  AnalysisResult,
  UseStockAnalysisCalculator
} from './types';
import {
  validateSymbol,
  calculateTechnicalIndicators,
  analyzeTrend,
  assessRisk,
  generateRecommendation
} from './utils';
import { TIMEFRAMES } from './constants';

const initialState: StockAnalysisState = {
  symbol: '',
  timeframe: '1D',
  errors: [],
  isLoading: false,
  result: null,
  showAdvancedMetrics: false
};

export const useStockAnalysisCalculator: UseStockAnalysisCalculator = () => {
  const [state, setState] = useState<StockAnalysisState>(initialState);

  const updateSymbol = useCallback((symbol: string): void => {
    setState(prevState => {
      const newSymbol = symbol.toUpperCase();
      const errors = validateSymbol(newSymbol);

      return {
        ...prevState,
        symbol: newSymbol,
        errors,
        result: null
      };
    });
  }, []);

  const updateTimeframe = useCallback((timeframe: AnalysisTimeframe): void => {
    if (!TIMEFRAMES.includes(timeframe)) return;

    setState(prevState => ({
      ...prevState,
      timeframe,
      result: null
    }));
  }, []);

  const setShowAdvancedMetrics = useCallback((show: boolean): void => {
    setState(prevState => ({
      ...prevState,
      showAdvancedMetrics: show
    }));
  }, []);

  const fetchStockData = async (symbol: string): Promise<AnalysisResult> => {
    // This would normally make an API call to fetch real data
    // For now, we'll return mock data
    return {
      stockData: {
        symbol,
        companyName: 'Example Company',
        currentPrice: 150,
        openPrice: 148,
        highPrice: 152,
        lowPrice: 147,
        volume: 1000000,
        marketCap: 1000000000,
        peRatio: 20,
        eps: 7.5,
        dividendYield: 2.5,
        beta: 1.2,
        fiftyTwoWeekHigh: 160,
        fiftyTwoWeekLow: 120,
        movingAverages: {
          sma20: 149,
          sma50: 145,
          sma200: 140,
          ema12: 151,
          ema26: 148
        }
      },
      financialMetrics: {
        revenueGrowth: 15,
        profitMargin: 20,
        debtToEquity: 0.5,
        currentRatio: 2,
        quickRatio: 1.5,
        returnOnEquity: 18,
        returnOnAssets: 12,
        freeCashFlow: 500000000,
        priceToBook: 3,
        priceToSales: 5,
        priceToCashFlow: 15,
        enterpriseValue: 1200000000,
        evToEbitda: 12
      },
      technicalIndicators: {
        rsi: 55,
        macd: {
          value: 2,
          signal: 1.5,
          histogram: 0.5
        },
        stochastic: {
          k: 65,
          d: 60
        },
        bollingerBands: {
          upper: 155,
          middle: 150,
          lower: 145
        },
        atr: 2.5,
        obv: 500000
      },
      priceTarget: {
        low: 140,
        median: 160,
        high: 180,
        meanTarget: 160,
        numberOfAnalysts: 20
      },
      trendAnalysis: {
        direction: 'up',
        strength: 'moderate',
        supportLevels: [145, 140, 135],
        resistanceLevels: [155, 160, 165],
        breakoutPoints: [{
          price: 150,
          volume: 1500000,
          date: new Date()
        }]
      },
      riskAssessment: {
        level: 'medium',
        volatility: 20,
        sharpeRatio: 1.2,
        sortinoRatio: 1.5,
        maxDrawdown: 15,
        factors: {
          marketRisk: 30,
          sectorRisk: 25,
          companySpecificRisk: 20
        }
      },
      valuationMetrics: {
        intrinsicValue: 165,
        discountRate: 10,
        growthRate: 12,
        marginOfSafety: 10,
        fairValue: 155,
        valuationRatios: {
          currentPE: 20,
          forwardPE: 18,
          pegRatio: 1.2,
          evToRevenue: 5
        }
      },
      recommendation: {
        type: 'buy',
        confidence: 'moderate',
        reasons: [
          'Trading below fair value',
          'Strong growth prospects',
          'Positive technical indicators'
        ],
        priceTargets: {
          entry: 150,
          stopLoss: 140,
          takeProfit: 165
        }
      }
    };
  };

  const analyze = useCallback(async (): Promise<void> => {
    const errors = validateSymbol(state.symbol);
    if (errors.length > 0) {
      setState(prevState => ({
        ...prevState,
        errors,
        result: null
      }));
      return;
    }

    setState(prevState => ({
      ...prevState,
      isLoading: true,
      errors: []
    }));

    try {
      const result = await fetchStockData(state.symbol);
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        result
      }));
    } catch (error) {
      console.error('Analysis error:', error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        errors: [{
          field: 'analysis',
          message: 'Error analyzing stock. Please try again.'
        }],
        result: null
      }));
    }
  }, [state.symbol]);

  const reset = useCallback((): void => {
    setState(initialState);
  }, []);

  const actions: StockAnalysisActions = {
    updateSymbol,
    updateTimeframe,
    setShowAdvancedMetrics,
    analyze,
    reset
  };

  return [state, actions];
};

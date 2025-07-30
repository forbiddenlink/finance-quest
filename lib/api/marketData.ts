// lib/api/marketData.ts
// Real market data integration using IEX Cloud API

interface StockQuote {
  symbol: string;
  companyName: string;
  latestPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
}

interface EconomicIndicator {
  date: string;
  value: number;
}

interface MarketData {
  stocks: StockQuote[];
  indices: {
    sp500: number;
    nasdaq: number;
    dow: number;
  };
  economicData: {
    fedFunds: EconomicIndicator[];
    inflation: EconomicIndicator[];
    unemployment: EconomicIndicator[];
  };
}

class MarketDataService {
  private fredApiKey: string | undefined;
  private baseFredUrl = 'https://api.stlouisfed.org/fred';
  private yahooFinanceUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
  private alphaVantageKey: string | undefined;

  constructor() {
    this.fredApiKey = process.env.FRED_API_KEY;
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY; // Free alternative
  }

  // Featured stocks for educational content
  private educationalStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'SPY', 'QQQ', 'VTI'];

  async getStockQuotes(): Promise<StockQuote[]> {
    // Use Yahoo Finance API (free, no key required)
    try {
      const quotes = await Promise.all(
        this.educationalStocks.slice(0, 6).map(async (symbol) => {
          const response = await fetch(
            `${this.yahooFinanceUrl}/${symbol}?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; FinanceQuest/1.0)'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch ${symbol}`);
          }

          const data = await response.json();
          const result = data.chart.result[0];
          const meta = result.meta;
          const quote = result.indicators.quote[0];
          
          const currentPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1];
          const previousClose = meta.previousClose || quote.close[quote.close.length - 2];
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;

          return {
            symbol,
            companyName: meta.longName || symbol,
            latestPrice: currentPrice,
            change: change,
            changePercent: changePercent / 100, // Convert to decimal
            marketCap: meta.marketCap || 0,
            peRatio: 0 // Not available in free API
          };
        })
      );

      return quotes;
    } catch (error) {
      console.error('Error fetching stock data from Yahoo Finance:', error);
      return this.getFallbackStockData();
    }
  }

  async getMarketIndices() {
    try {
      const indices = ['SPY', 'QQQ', 'DIA']; // ETFs that track major indices
      const quotes = await Promise.all(
        indices.map(async (symbol) => {
          const response = await fetch(
            `${this.yahooFinanceUrl}/${symbol}?interval=1d&range=1d`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch ${symbol}`);
          }

          const data = await response.json();
          const result = data.chart.result[0];
          const meta = result.meta;
          
          return {
            symbol,
            price: meta.regularMarketPrice || 0
          };
        })
      );

      return {
        sp500: quotes.find(q => q.symbol === 'SPY')?.price || 0,
        nasdaq: quotes.find(q => q.symbol === 'QQQ')?.price || 0,
        dow: quotes.find(q => q.symbol === 'DIA')?.price || 0
      };
    } catch (error) {
      console.error('Error fetching indices data:', error);
      return this.getFallbackIndicesData();
    }
  }

  async getFedFundsRate(): Promise<EconomicIndicator[]> {
    if (!this.fredApiKey) {
      return this.getFallbackFedFundsData();
    }

    try {
      const response = await fetch(
        `${this.baseFredUrl}/series/observations?series_id=FEDFUNDS&api_key=${this.fredApiKey}&file_type=json&limit=12&sort_order=desc`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Fed Funds data');
      }

      const data = await response.json();
      
      return data.observations.map((obs: any) => ({
        date: obs.date,
        value: parseFloat(obs.value)
      })).reverse();
    } catch (error) {
      console.error('Error fetching Fed Funds data:', error);
      return this.getFallbackFedFundsData();
    }
  }

  async getInflationRate(): Promise<EconomicIndicator[]> {
    if (!this.fredApiKey) {
      return this.getFallbackInflationData();
    }

    try {
      const response = await fetch(
        `${this.baseFredUrl}/series/observations?series_id=CPIAUCSL&api_key=${this.fredApiKey}&file_type=json&limit=12&sort_order=desc&units=pc1`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch inflation data');
      }

      const data = await response.json();
      
      return data.observations.map((obs: any) => ({
        date: obs.date,
        value: parseFloat(obs.value)
      })).reverse();
    } catch (error) {
      console.error('Error fetching inflation data:', error);
      return this.getFallbackInflationData();
    }
  }

  async getFullMarketData(): Promise<MarketData> {
    const [stocks, indices, fedFunds, inflation] = await Promise.all([
      this.getStockQuotes(),
      this.getMarketIndices(),
      this.getFedFundsRate(),
      this.getInflationRate()
    ]);

    return {
      stocks,
      indices,
      economicData: {
        fedFunds,
        inflation,
        unemployment: [] // Could add unemployment data
      }
    };
  }

  // Fallback data for when APIs are unavailable or keys not provided
  private getFallbackStockData(): StockQuote[] {
    return [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        latestPrice: 195.50,
        change: 2.35,
        changePercent: 0.0122,
        marketCap: 3000000000000,
        peRatio: 28.5
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        latestPrice: 420.85,
        change: -1.25,
        changePercent: -0.0030,
        marketCap: 3100000000000,
        peRatio: 32.1
      },
      {
        symbol: 'SPY',
        companyName: 'SPDR S&P 500 ETF Trust',
        latestPrice: 485.25,
        change: 4.15,
        changePercent: 0.0086,
        marketCap: 450000000000,
        peRatio: 24.8
      }
    ];
  }

  private getFallbackIndicesData() {
    return {
      sp500: 485.25,
      nasdaq: 375.80,
      dow: 340.15
    };
  }

  private getFallbackFedFundsData(): EconomicIndicator[] {
    return [
      { date: '2025-06-01', value: 5.25 },
      { date: '2025-05-01', value: 5.25 },
      { date: '2025-04-01', value: 5.00 },
      { date: '2025-03-01', value: 4.75 }
    ];
  }

  private getFallbackInflationData(): EconomicIndicator[] {
    return [
      { date: '2025-06-01', value: 3.2 },
      { date: '2025-05-01', value: 3.4 },
      { date: '2025-04-01', value: 3.1 },
      { date: '2025-03-01', value: 3.0 }
    ];
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();

// Export types
export type { StockQuote, EconomicIndicator, MarketData };

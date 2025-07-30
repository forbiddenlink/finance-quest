// lib/api/marketData.ts
// Real market data integration using Alpha Vantage and fallback APIs

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
  private rateLimitReached = false;
  private lastRateLimitCheck = 0;

  constructor() {
    this.fredApiKey = process.env.FRED_API_KEY;
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
  }

  // Featured stocks for educational content
  private educationalStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'SPY'];

  async getStockQuotes(): Promise<StockQuote[]> {
    // Check if we've hit rate limit recently (reset daily)
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (this.rateLimitReached && (now - this.lastRateLimitCheck) < oneDayMs) {
      console.log('Rate limit previously reached, using fallback data');
      return this.getFallbackStockData();
    }

    // Use Alpha Vantage API with your key for reliable data
    if (this.alphaVantageKey && !this.rateLimitReached) {
      console.log('Using Alpha Vantage API for stock data...');
      try {
        const quotes = await Promise.all(
          this.educationalStocks.slice(0, 6).map(async (symbol) => {
            try {
              const response = await fetch(
                `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
              );

              if (!response.ok) {
                throw new Error(`Failed to fetch ${symbol}: ${response.status}`);
              }

              const data = await response.json();
              console.log(`Alpha Vantage response for ${symbol}:`, data);
              
              if (data['Error Message'] || data['Note']) {
                // Check if it's a rate limit message
                if (data['Note'] && data['Note'].includes('rate limit')) {
                  console.warn(`Rate limit reached for ${symbol}, switching to fallback mode`);
                  this.rateLimitReached = true;
                  this.lastRateLimitCheck = Date.now();
                  return this.getFallbackStockBySymbol(symbol);
                }
                throw new Error(`API Error for ${symbol}: ${data['Error Message'] || data['Note']}`);
              }

              const quote = data['Global Quote'];
              if (!quote) {
                throw new Error(`No quote data for ${symbol}`);
              }

              const currentPrice = parseFloat(quote['05. price']);
              const change = parseFloat(quote['09. change']);
              const changePercent = parseFloat(quote['10. change percent'].replace('%', '')) / 100;

              if (isNaN(currentPrice) || currentPrice <= 0) {
                throw new Error(`Invalid price for ${symbol}: ${currentPrice}`);
              }

              return {
                symbol,
                companyName: this.getCompanyName(symbol),
                latestPrice: currentPrice,
                change: change,
                changePercent: changePercent,
                marketCap: 0, // Not available in this API call
                peRatio: 0
              };
            } catch (symbolError) {
              console.warn(`Failed to fetch Alpha Vantage data for ${symbol}:`, symbolError);
              return this.getFallbackStockBySymbol(symbol);
            }
          })
        );

        const validQuotes = quotes.filter(quote => quote && quote.latestPrice > 0);
        
        if (validQuotes.length > 0) {
          console.log('Successfully fetched Alpha Vantage data:', validQuotes.length, 'stocks');
          return validQuotes;
        }
      } catch (error) {
        console.error('Error with Alpha Vantage API:', error);
      }
    }

    // Use fallback data if Alpha Vantage fails or no key
    console.log('Using fallback data');
    return this.getFallbackStockData();
  }

  async getMarketIndices() {
    // For demo purposes, return static data
    return {
      sp500: 4850.25,
      nasdaq: 15200.80,
      dow: 38500.15
    };
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
      
      return data.observations.map((obs: {date: string; value: string}) => ({
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
      
      return data.observations.map((obs: {date: string; value: string}) => ({
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

  private getCompanyName(symbol: string): string {
    const names: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'SPY': 'SPDR S&P 500 ETF Trust',
      'QQQ': 'Invesco QQQ Trust',
      'VTI': 'Vanguard Total Stock Market ETF'
    };
    return names[symbol] || symbol;
  }

  private getFallbackStockBySymbol(symbol: string): StockQuote {
    const fallbackData: { [key: string]: StockQuote } = {
      'AAPL': {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        latestPrice: 195.50,
        change: 2.35,
        changePercent: 0.0122,
        marketCap: 3000000000000,
        peRatio: 28.5
      },
      'MSFT': {
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        latestPrice: 420.85,
        change: -1.25,
        changePercent: -0.0030,
        marketCap: 3100000000000,
        peRatio: 32.1
      },
      'GOOGL': {
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        latestPrice: 142.30,
        change: 1.85,
        changePercent: 0.0132,
        marketCap: 1800000000000,
        peRatio: 25.4
      },
      'AMZN': {
        symbol: 'AMZN',
        companyName: 'Amazon.com Inc.',
        latestPrice: 148.75,
        change: -0.95,
        changePercent: -0.0063,
        marketCap: 1500000000000,
        peRatio: 45.2
      },
      'TSLA': {
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        latestPrice: 248.50,
        change: 5.20,
        changePercent: 0.0214,
        marketCap: 790000000000,
        peRatio: 58.7
      },
      'SPY': {
        symbol: 'SPY',
        companyName: 'SPDR S&P 500 ETF Trust',
        latestPrice: 485.25,
        change: 4.15,
        changePercent: 0.0086,
        marketCap: 450000000000,
        peRatio: 24.8
      }
    };
    
    return fallbackData[symbol] || {
      symbol: symbol,
      companyName: this.getCompanyName(symbol),
      latestPrice: 100.00,
      change: 1.50,
      changePercent: 0.015,
      marketCap: 0,
      peRatio: 0
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
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        latestPrice: 142.30,
        change: 1.85,
        changePercent: 0.0132,
        marketCap: 1800000000000,
        peRatio: 25.4
      },
      {
        symbol: 'AMZN',
        companyName: 'Amazon.com Inc.',
        latestPrice: 148.75,
        change: -0.95,
        changePercent: -0.0063,
        marketCap: 1500000000000,
        peRatio: 45.2
      },
      {
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        latestPrice: 248.50,
        change: 5.20,
        changePercent: 0.0214,
        marketCap: 790000000000,
        peRatio: 58.7
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

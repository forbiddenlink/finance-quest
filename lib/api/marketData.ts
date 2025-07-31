// lib/api/marketData.ts
// Enhanced market data integration with multiple APIs and intelligent fallbacks

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

// Yahoo Finance API data structure for type safety
interface YahooChartResult {
  meta: {
    symbol: string;
    regularMarketPrice: number;
    previousClose: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
  };
  timestamp: number[];
  indicators: {
    quote: Array<{
      close: number[];
      high: number[];
      low: number[];
      open: number[];
      volume: number[];
    }>;
  };
}

interface YahooFinanceResponse {
  chart: {
    result: YahooChartResult[];
    error?: string;
  };
}class MarketDataService {
  private fredApiKey: string | undefined;
  private baseFredUrl = 'https://api.stlouisfed.org/fred';
  private alphaVantageKey: string | undefined;
  private polygonApiKey: string | undefined;
  private rateLimitReached = false;
  private lastRateLimitCheck = 0;
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  constructor() {
    this.fredApiKey = process.env.FRED_API_KEY;
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    this.polygonApiKey = process.env.POLYGON_API_KEY;
  }

  // Featured stocks for educational content
  private educationalStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'SPY'];

  private isRateLimited(): boolean {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    return this.rateLimitReached && (now - this.lastRateLimitCheck) < oneDayMs;
  }

  private setRateLimit(): void {
    this.rateLimitReached = true;
    this.lastRateLimitCheck = Date.now();
  }

  // Yahoo Finance API - Free, unlimited, no API key required
  private async getYahooFinanceData(): Promise<StockQuote[]> {
    console.log('Attempting Yahoo Finance API...');

    try {
      const symbols = this.educationalStocks;
      const stocks: StockQuote[] = [];

      // Use yfinance-like approach - sometimes Yahoo blocks direct API access
      // Try a different approach with individual stock requests
      for (const symbol of symbols) {
        try {
          // Alternative Yahoo Finance endpoint that might work better
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });

          if (!response.ok) {
            console.log(`Yahoo Finance API error for ${symbol}: ${response.status}`);
            continue;
          }

          const data: YahooFinanceResponse = await response.json();

          if (data.chart?.error) {
            console.log(`Yahoo Finance error for ${symbol}: ${data.chart.error}`);
            continue;
          }

          const results = data.chart?.result || [];

          for (const result of results) {
            if (!result.meta) continue;

            const meta = result.meta;
            const currentPrice = meta.regularMarketPrice || meta.previousClose;
            const previousClose = meta.previousClose;

            if (!currentPrice || !previousClose) continue;

            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose);

            const stock: StockQuote = {
              symbol: meta.symbol,
              companyName: this.getCompanyName(meta.symbol),
              latestPrice: currentPrice,
              change: change,
              changePercent: changePercent,
              marketCap: 0,
              peRatio: 0
            };

            stocks.push(stock);
          }
        } catch (error) {
          console.log(`Error fetching ${symbol}:`, error);
          continue;
        }
      }

      if (stocks.length > 0) {
        console.log(`✅ Yahoo Finance success: ${stocks.length} stocks`);
        return stocks;
      } else {
        throw new Error('No valid stock data from Yahoo Finance');
      }
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      throw error;
    }
  }

  // Polygon.io API - Professional grade, requires API key
  private async getPolygonData(): Promise<StockQuote[]> {
    if (!this.polygonApiKey) {
      throw new Error('Polygon API key not available');
    }

    console.log('Attempting Polygon.io API...');

    try {
      const stocks: StockQuote[] = [];

      for (const symbol of this.educationalStocks) {
        try {
          const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${this.polygonApiKey}`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Polygon API error for ${symbol}: ${response.status}`);
          }

          const data = await response.json();

          if (data.status !== 'OK' || !data.results || data.results.length === 0) {
            console.warn(`No Polygon data for ${symbol}`);
            continue;
          }

          const result = data.results[0];
          const currentPrice = result.c; // Close price
          const previousClose = result.o; // Open price
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;

          stocks.push({
            symbol,
            companyName: this.getCompanyName(symbol),
            latestPrice: currentPrice,
            change: change,
            changePercent: changePercent / 100, // Convert to decimal
            marketCap: 0,
            peRatio: 0
          });

          // Add small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (symbolError) {
          console.warn(`Failed to fetch Polygon data for ${symbol}:`, symbolError);
          continue;
        }
      }

      if (stocks.length > 0) {
        console.log(`Polygon.io: Successfully fetched ${stocks.length} stocks`);
        return stocks;
      }

      throw new Error('No valid stock data from Polygon');
    } catch (error) {
      console.error('Polygon API error:', error);
      throw error;
    }
  }

  // Alpha Vantage API - Backup option with rate limit handling
  private async getAlphaVantageData(): Promise<StockQuote[]> {
    if (!this.alphaVantageKey || this.isRateLimited()) {
      throw new Error('Alpha Vantage API key not available or rate limited');
    }

    console.log('Attempting Alpha Vantage API...');

    try {
      const stocks: StockQuote[] = [];

      // Only try first 3 symbols to preserve API calls
      const limitedSymbols = this.educationalStocks.slice(0, 3);

      for (const symbol of limitedSymbols) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
          );

          if (!response.ok) {
            throw new Error(`Alpha Vantage HTTP error: ${response.status}`);
          }

          const data = await response.json();

          // Check for rate limit or error messages
          if (data['Information'] && data['Information'].includes('rate limit')) {
            console.warn('Alpha Vantage rate limit reached');
            this.setRateLimit();
            break;
          }

          if (data['Error Message']) {
            throw new Error(`Alpha Vantage error: ${data['Error Message']}`);
          }

          const quote = data['Global Quote'];
          if (!quote) {
            console.warn(`No Alpha Vantage quote data for ${symbol}`);
            continue;
          }

          const currentPrice = parseFloat(quote['05. price']);
          const change = parseFloat(quote['09. change']);
          const changePercent = parseFloat(quote['10. change percent'].replace('%', '')) / 100;

          if (isNaN(currentPrice) || currentPrice <= 0) {
            console.warn(`Invalid Alpha Vantage price for ${symbol}: ${currentPrice}`);
            continue;
          }

          stocks.push({
            symbol,
            companyName: this.getCompanyName(symbol),
            latestPrice: currentPrice,
            change: change,
            changePercent: changePercent,
            marketCap: 0,
            peRatio: 0
          });

          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (symbolError) {
          console.warn(`Failed to fetch Alpha Vantage data for ${symbol}:`, symbolError);
          continue;
        }
      }

      if (stocks.length > 0) {
        console.log(`Alpha Vantage: Successfully fetched ${stocks.length} stocks`);
        return stocks;
      }

      throw new Error('No valid stock data from Alpha Vantage');
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      throw error;
    }
  }

  // Finnhub API - Free tier available
  private async getFinnhubData(): Promise<StockQuote[]> {
    console.log('Attempting Finnhub API...');

    try {
      const symbols = this.educationalStocks;
      const stocks: StockQuote[] = [];

      for (const symbol of symbols) {
        try {
          // Using demo token for Finnhub (free but rate limited)
          const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=demo`;

          const response = await fetch(url);

          if (!response.ok) {
            console.log(`Finnhub API error for ${symbol}: ${response.status}`);
            continue;
          }

          const data: { c: number; h: number; l: number; o: number; pc: number; d: number; dp: number; error?: string } = await response.json();

          if (data.error) {
            console.log(`Finnhub error for ${symbol}: ${data.error}`);
            continue;
          }

          // Finnhub returns: {c: current, d: change, dp: changePercent, h: high, l: low, o: open, pc: previousClose}
          const currentPrice = data.c;
          const change = data.d;
          const changePercent = data.dp;

          if (!currentPrice) continue;

          const stock: StockQuote = {
            symbol: symbol,
            companyName: this.getCompanyName(symbol),
            latestPrice: currentPrice,
            change: change || 0,
            changePercent: (changePercent || 0) / 100, // Convert to decimal
            marketCap: 0,
            peRatio: 0
          };

          stocks.push(stock);
        } catch (error) {
          console.log(`Error fetching ${symbol} from Finnhub:`, error);
          continue;
        }
      }

      if (stocks.length > 0) {
        console.log(`✅ Finnhub success: ${stocks.length} stocks`);
        return stocks;
      } else {
        throw new Error('No valid stock data from Finnhub');
      }
    } catch (error) {
      console.error('Finnhub API error:', error);
      throw error;
    }
  }

  async getStockQuotes(): Promise<StockQuote[]> {
    console.log('Getting stock quotes...');

    // Check cache first
    const cacheKey = 'stock-quotes';
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log('Returning cached stock data');
      return cached.data as StockQuote[];
    }

    // Try APIs in order of preference: Yahoo Finance -> Finnhub -> Polygon -> Alpha Vantage -> Fallback
    const apiMethods = [
      { name: 'Yahoo Finance', method: () => this.getYahooFinanceData() },
      { name: 'Finnhub (Free)', method: () => this.getFinnhubData() },
      { name: 'Polygon.io', method: () => this.getPolygonData() },
      { name: 'Alpha Vantage', method: () => this.getAlphaVantageData() }
    ];

    for (const api of apiMethods) {
      try {
        console.log(`Trying ${api.name}...`);
        const data = await api.method();

        if (data && data.length > 0) {
          // Cache successful result for 30 seconds
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl: 30000
          });

          console.log(`✅ ${api.name} successful: ${data.length} stocks`);
          return data;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`❌ ${api.name} failed:`, errorMessage);
        continue;
      }
    }

    // All APIs failed, use fallback data
    console.log('All APIs failed, using fallback data');
    const fallbackData = this.getFallbackStockData();

    // Cache fallback data for a shorter time
    this.cache.set(cacheKey, {
      data: fallbackData,
      timestamp: Date.now(),
      ttl: 30000
    });

    return fallbackData;
  }

  async getMarketIndices() {
    // For demo purposes, return static data with slight variations
    const baseValues = { sp500: 4850.25, nasdaq: 15200.80, dow: 38500.15 };
    const variation = () => (Math.random() - 0.5) * 50; // +/- 25 points

    return {
      sp500: baseValues.sp500 + variation(),
      nasdaq: baseValues.nasdaq + variation(),
      dow: baseValues.dow + variation()
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

      return data.observations.map((obs: { date: string; value: string }) => ({
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

      return data.observations.map((obs: { date: string; value: string }) => ({
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

  // Enhanced fallback data with slight randomization to simulate real movement
  private getFallbackStockData(): StockQuote[] {
    const baseData = [
      { symbol: 'AAPL', price: 195.50, change: 2.35 },
      { symbol: 'MSFT', price: 420.85, change: -1.25 },
      { symbol: 'GOOGL', price: 142.30, change: 1.85 },
      { symbol: 'AMZN', price: 148.75, change: -0.95 },
      { symbol: 'TSLA', price: 248.50, change: 5.20 },
      { symbol: 'SPY', price: 485.25, change: 4.15 }
    ];

    return baseData.map(stock => {
      // Add slight random variation to simulate market movement
      const priceVariation = (Math.random() - 0.5) * 10; // +/- $5
      const changeVariation = (Math.random() - 0.5) * 2; // +/- $1

      const adjustedPrice = stock.price + priceVariation;
      const adjustedChange = stock.change + changeVariation;
      const changePercent = adjustedChange / (adjustedPrice - adjustedChange);

      return {
        symbol: stock.symbol,
        companyName: this.getCompanyName(stock.symbol),
        latestPrice: Math.max(adjustedPrice, 1), // Ensure positive price
        change: adjustedChange,
        changePercent: changePercent,
        marketCap: 0,
        peRatio: 0
      };
    });
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

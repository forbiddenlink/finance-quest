// app/api/market-data/route.ts
// Enhanced API route for real-time market data with caching and performance optimization

import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/api/marketData';

// Simple in-memory cache for demo optimization
const cache: { [key: string]: { data: unknown; timestamp: number; ttl: number } } = {};

const CACHE_DURATION = {
  stocks: 30 * 1000,     // 30 seconds for stock data
  indices: 60 * 1000,    // 1 minute for indices
  economic: 300 * 1000,  // 5 minutes for economic data
  full: 30 * 1000        // 30 seconds for full data
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'full';
  const forceRefresh = searchParams.get('refresh') === 'true';

  console.log(`Market data API called with type: ${type}`);

  try {
    // Check cache first (unless force refresh)
    if (!forceRefresh && cache[type]) {
      const cached = cache[type];
      const now = Date.now();
      if (now - cached.timestamp < cached.ttl) {
        console.log(`Serving cached data for type: ${type}`);
        return NextResponse.json({
          success: true,
          data: cached.data,
          timestamp: new Date(cached.timestamp).toISOString(),
          source: 'cached',
          cached: true
        });
      }
    }

    console.log(`Fetching fresh data for type: ${type}`);
    let data;
    let cacheTtl = CACHE_DURATION.full;

    switch (type) {
      case 'stocks':
        data = await marketDataService.getStockQuotes();
        cacheTtl = CACHE_DURATION.stocks;
        break;
      case 'indices':
        data = await marketDataService.getMarketIndices();
        cacheTtl = CACHE_DURATION.indices;
        break;
      case 'fed-funds':
        data = await marketDataService.getFedFundsRate();
        cacheTtl = CACHE_DURATION.economic;
        break;
      case 'inflation':
        data = await marketDataService.getInflationRate();
        cacheTtl = CACHE_DURATION.economic;
        break;
      case 'full':
      default:
        data = await marketDataService.getFullMarketData();
        cacheTtl = CACHE_DURATION.full;
        break;
    }

    console.log(`Successfully fetched data for type: ${type}`, data ? 'with data' : 'no data');

    // Cache the successful response
    cache[type] = {
      data: type === 'stocks' ? data : { [type]: data },
      timestamp: Date.now(),
      ttl: cacheTtl
    };

    const hasApiKeys = Boolean(process.env.FRED_API_KEY || process.env.ALPHA_VANTAGE_API_KEY);

    return NextResponse.json({
      success: true,
      data: type === 'stocks' ? data : { [type]: data },
      timestamp: new Date().toISOString(),
      source: hasApiKeys ? 'live' : 'fallback',
      cached: false,
      nextUpdate: new Date(Date.now() + cacheTtl).toISOString()
    });

  } catch (error) {
    console.error('Market data API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error details:', errorMessage);

    // Try to return cached data if available
    if (cache[type]) {
      const cached = cache[type];
      console.log(`Serving cached fallback data for type: ${type}`);
      return NextResponse.json({
        success: true,
        data: cached.data,
        timestamp: new Date(cached.timestamp).toISOString(),
        source: 'cached-fallback',
        error: 'Live data unavailable, serving cached data'
      });
    }

    // Return structured error response instead of throwing
    console.log(`No cached data available, returning error response for type: ${type}`);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data',
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Service temporarily unavailable',
      fallbackAvailable: false
    }, {
      status: 200 // Change from 500 to 200 to prevent JSON parsing errors
    });
  }
}

// Enable CORS for development  
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

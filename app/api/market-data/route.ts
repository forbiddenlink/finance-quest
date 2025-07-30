// app/api/market-data/route.ts
// Enhanced API route for real-time market data with caching and performance optimization

import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/api/marketData';

// Simple in-memory cache for demo optimization
let cache: { [key: string]: { data: any; timestamp: number; ttl: number } } = {};

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

  try {
    // Check cache first (unless force refresh)
    if (!forceRefresh && cache[type]) {
      const cached = cache[type];
      const now = Date.now();
      if (now - cached.timestamp < cached.ttl) {
        return NextResponse.json({
          success: true,
          data: cached.data,
          timestamp: new Date(cached.timestamp).toISOString(),
          source: 'cached',
          cached: true
        });
      }
    }

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
    
    // Try to return cached data if available
    if (cache[type]) {
      const cached = cache[type];
      return NextResponse.json({
        success: true,
        data: cached.data,
        timestamp: new Date(cached.timestamp).toISOString(),
        source: 'cached-fallback',
        error: 'Live data unavailable, serving cached data'
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data',
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Service temporarily unavailable'
    }, { 
      status: 500 
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

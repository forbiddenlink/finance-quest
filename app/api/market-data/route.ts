// app/api/market-data/route.ts
// API route for real-time market data

import { NextRequest, NextResponse } from 'next/server';
import { marketDataService } from '@/lib/api/marketData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'full';

    let data;

    switch (type) {
      case 'stocks':
        data = await marketDataService.getStockQuotes();
        break;
      case 'indices':
        data = await marketDataService.getMarketIndices();
        break;
      case 'fed-funds':
        data = await marketDataService.getFedFundsRate();
        break;
      case 'inflation':
        data = await marketDataService.getInflationRate();
        break;
      case 'full':
      default:
        data = await marketDataService.getFullMarketData();
        break;
    }

    return NextResponse.json({
      success: true,
      data: type === 'stocks' ? data : { [type]: data },
      timestamp: new Date().toISOString(),
      source: process.env.FRED_API_KEY || process.env.ALPHA_VANTAGE_API_KEY ? 'live' : 'fallback'
    });

  } catch (error) {
    console.error('Market data API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data',
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
}

// Enable CORS for development
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

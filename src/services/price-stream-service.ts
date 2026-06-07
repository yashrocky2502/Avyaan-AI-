
'use server';

import { ingestData } from './data-ingestion-engine';
import { MASTER_REGISTRY, NormalizedQuote, PriceSource } from './price-stream-registry';

/**
 * @fileOverview Unified Price Stream Manager.
 * Orchestrates live fetching from multiple sources with fallback mock generation.
 */

const BASE_PRICES: Record<string, number> = {
  '^NSEI': 24143.75,
  'RELIANCE.NS': 1285.40,
  'HDFCBANK.NS': 1742.45,
  'BTC-USD': 97245.10
};

function generateMockQuote(symbol: string): NormalizedQuote {
  const registryItem = MASTER_REGISTRY.find(a => a.symbol === symbol);
  const base = BASE_PRICES[symbol] || 100.00;
  const dayChange = base * (Math.random() * 0.02 - 0.01);
  
  return {
    symbol,
    name: registryItem?.name || symbol,
    price: parseFloat((base + dayChange).toFixed(2)),
    change: parseFloat(dayChange.toFixed(2)),
    changePercent: parseFloat(((dayChange / base) * 100).toFixed(2)),
    volume: (Math.random() * 10).toFixed(1) + 'M',
    source: 'Cache',
    timestamp: Date.now(),
    trend: dayChange >= 0 ? 'up' : 'down',
    type: registryItem?.type || 'stock'
  };
}

async function fetchYahooQuote(symbol: string): Promise<NormalizedQuote | null> {
  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`, {
      next: { revalidate: 15 },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    const q = json.quoteResponse?.result?.[0];
    if (!q) return null;

    const registryItem = MASTER_REGISTRY.find(a => a.symbol === symbol);
    return {
      symbol: q.symbol,
      name: q.shortName || registryItem?.name || q.symbol,
      price: q.regularMarketPrice ?? 0,
      change: q.regularMarketChange ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
      volume: q.regularMarketVolume ? ((q.regularMarketVolume / 1000000).toFixed(1) + 'M') : '---',
      source: 'Yahoo',
      timestamp: Date.now(),
      trend: (q.regularMarketChange ?? 0) >= 0 ? 'up' : 'down',
      type: registryItem?.type || 'stock'
    };
  } catch (e) { return null; }
}

export async function getUnifiedQuote(symbol: string): Promise<NormalizedQuote> {
  const result = await ingestData(`quote_${symbol}`, async () => {
    return await fetchYahooQuote(symbol);
  }, 10000);

  return result.data || generateMockQuote(symbol);
}

export async function getUnifiedQuotes(symbols: string[]): Promise<NormalizedQuote[]> {
  return await Promise.all(symbols.map(s => getUnifiedQuote(s)));
}

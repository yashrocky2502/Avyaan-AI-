'use server';

import { ingestData } from './data-ingestion-engine';
import { MASTER_REGISTRY } from './price-stream-registry';
import { getUnifiedQuotes } from './price-stream-service';

/**
 * @fileOverview Market Data Service - V3 (Registry Sync).
 * Orchestrates scanner and institutional flow data with full asset class awareness.
 */

export interface MarketSnapshot {
  symbol: string;
  name: string;
  value: string;
  change: string;
  percent: string;
  trend: 'up' | 'down';
  lastUpdated: string;
  data: number[];
  source?: string;
  type?: string;
}

export interface ScannerStock {
  id: string;
  symbol: string;
  company: string;
  price: string;
  change: string;
  percent: string;
  volume: string;
  marketCap: string;
  trend: 'up' | 'down';
  sector: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
  source?: string;
}

export async function getMarketSnapshot(type?: string): Promise<MarketSnapshot[]> {
  const symbols = MASTER_REGISTRY.map(v => v.symbol);
  const quotes = await getUnifiedQuotes(symbols);

  return quotes
    .map(q => {
      const registryItem = MASTER_REGISTRY.find(v => v.symbol === q.symbol);
      return {
        symbol: q.symbol,
        name: registryItem?.name || q.symbol,
        value: q.price.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        change: (q.change >= 0 ? '+' : '') + q.change.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
        percent: (q.changePercent >= 0 ? '+' : '') + q.changePercent.toFixed(2) + '%',
        trend: q.trend,
        lastUpdated: new Date(q.timestamp).toLocaleTimeString(),
        data: [q.price],
        source: q.source,
        type: registryItem?.type
      };
    })
    .filter(s => !type || s.type === type);
}

export async function getScannerData(category: string): Promise<ScannerStock[]> {
  let screenerId = 'day_gainers';
  if (category === 'losers') screenerId = 'day_losers';
  if (category === 'active') screenerId = 'most_actives';
  if (category === 'high52') screenerId = '52_week_high';
  if (category === 'low52') screenerId = '52_week_low';

  const result = await ingestData<ScannerStock[]>(`scanner_${category}`, async () => {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?screenerIds=${screenerId}&count=25`,
        { 
          next: { revalidate: 300 },
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        }
      );
      if (!response.ok) return [];
      const json = await response.json();
      const results = json.finance?.result?.[0]?.quotes || [];
      
      return results.map((q: any) => ({
        id: q.symbol,
        symbol: q.symbol,
        company: q.shortName || q.longName || q.symbol,
        price: (q.regularMarketPrice || 0).toFixed(2),
        change: ((q.regularMarketChange || 0) >= 0 ? '+' : '') + (q.regularMarketChange || 0).toFixed(2),
        percent: (q.regularMarketChangePercent || 0).toFixed(2),
        volume: ((q.regularMarketVolume || 0) / 1000000).toFixed(1) + 'M',
        marketCap: q.marketCap ? (q.marketCap / 1000000000).toFixed(1) + 'B' : '---',
        trend: (q.regularMarketChange || 0) >= 0 ? 'up' : 'down',
        sector: 'General', 
      }));
    } catch (e) {
      return [];
    }
  }, 60000, 'P1');

  return result.data || [];
}

export async function getStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  const quotes = await getUnifiedQuotes(symbols);
  return quotes.map(q => ({
    symbol: q.symbol,
    price: q.price,
    change: q.change,
    changePercent: q.changePercent,
    name: q.name,
    source: q.source
  }));
}

export async function getInstitutionalFlow() {
  return { fii: "+ ₹1,240 Cr", dii: "- ₹450 Cr", net: "+ ₹790 Cr" };
}

/**
 * @fileOverview Price Stream Registry and Types.
 * This file is shared between client and server and does NOT use the 'use server' directive.
 */

export type PriceSource = 'TradingView' | 'Yahoo' | 'CoinGecko' | 'Cache';
export type AssetType = 'index' | 'stock' | 'crypto' | 'commodity' | 'forex';

export interface NormalizedQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  source: PriceSource;
  timestamp: number;
  trend: 'up' | 'down';
  type: AssetType;
}

export interface RegistryAsset {
  symbol: string;
  name: string;
  type: AssetType;
  primarySource: PriceSource;
}

/**
 * MASTER ASSET REGISTRY
 * Defines the universe of tracked instruments across all terminal modules.
 * Normalized for Yahoo Finance (Indices/Stocks/Commodities) and CoinGecko (Crypto).
 */
export const MASTER_REGISTRY: RegistryAsset[] = [
  // Indices (Yahoo Tickers verified for consistency)
  { symbol: '^NSEI', name: 'NIFTY 50', type: 'index', primarySource: 'Yahoo' },
  { symbol: '^BSESN', name: 'SENSEX', type: 'index', primarySource: 'Yahoo' },
  { symbol: '^NSEBANK', name: 'BANK NIFTY', type: 'index', primarySource: 'Yahoo' },
  { symbol: '^CNXFIN', name: 'FIN NIFTY', type: 'index', primarySource: 'Yahoo' },
  { symbol: '^NSEMDCP100', name: 'MIDCAP 100', type: 'index', primarySource: 'Yahoo' },
  { symbol: '^INDIAVIX', name: 'INDIA VIX', type: 'index', primarySource: 'Yahoo' },
  
  // High-Volume Equities (.NS suffix for NSE)
  { symbol: 'RELIANCE.NS', name: 'RELIANCE', type: 'stock', primarySource: 'Yahoo' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC BANK', type: 'stock', primarySource: 'Yahoo' },
  { symbol: 'TCS.NS', name: 'TCS', type: 'stock', primarySource: 'Yahoo' },
  { symbol: 'INFY.NS', name: 'INFOSYS', type: 'stock', primarySource: 'Yahoo' },
  { symbol: 'ITC.NS', name: 'ITC', type: 'stock', primarySource: 'Yahoo' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI BANK', type: 'stock', primarySource: 'Yahoo' },
  
  // Commodities (Yahoo Futures Tickers)
  { symbol: 'GC=F', name: 'GOLD', type: 'commodity', primarySource: 'Yahoo' },
  { symbol: 'SI=F', name: 'SILVER', type: 'commodity', primarySource: 'Yahoo' },
  { symbol: 'CL=F', name: 'CRUDE OIL', type: 'commodity', primarySource: 'Yahoo' },
  
  // Forex (Yahoo Currency Tickers)
  { symbol: 'USDINR=X', name: 'USD / INR', type: 'forex', primarySource: 'Yahoo' },
  { symbol: 'EURINR=X', name: 'EUR / INR', type: 'forex', primarySource: 'Yahoo' },
  { symbol: 'GBPINR=X', name: 'GBP / INR', type: 'forex', primarySource: 'Yahoo' },
  
  // Crypto (CoinGecko Primary Fallback)
  { symbol: 'BTC-USD', name: 'BTC / USD', type: 'crypto', primarySource: 'CoinGecko' },
  { symbol: 'ETH-USD', name: 'ETH / USD', type: 'crypto', primarySource: 'CoinGecko' },
  { symbol: 'SOL-USD', name: 'SOL / USD', type: 'crypto', primarySource: 'CoinGecko' },
];

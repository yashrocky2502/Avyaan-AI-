
import marketData from '@/data/market-data.json';

export interface MarketIndex {
  name: string;
  value: string;
  change: string;
  percent: string;
  trend: 'up' | 'down';
  data: number[];
}

export interface StockInfo {
  name: string;
  price: string;
  chg: string;
  val: string;
}

export interface SectorInfo {
  name: string;
  performance: string;
  trend: 'up' | 'down';
}

export interface MarketState {
  indices: MarketIndex[];
  gainers: StockInfo[];
  losers: StockInfo[];
  sectors: SectorInfo[];
}

export const MarketService = {
  async getMarketOverview(): Promise<MarketState> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return marketData as MarketState;
  }
};

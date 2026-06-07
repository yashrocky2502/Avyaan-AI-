'use server';

import { getMarketSnapshot } from './market-data-service';
import { getMarketNarrative } from './intelligence-fusion-service';
import { UnifiedIntelligenceReport } from './intelligence-types';

/**
 * @fileOverview Market Story Service.
 * Generates a unified daily narrative explaining market direction and drivers.
 */

export interface MarketStory {
  timestamp: string;
  summary: string;
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  confidence: number;
  regime: string;
  whyMoving: string;
  sectors: {
    strong: string[];
    weak: string[];
    emerging: string[];
  };
  drivers: string[];
  risks: string[];
  opportunities: string[];
  portfolioImpact?: string | null;
}

export async function generateDailyMarketStory(portfolioSymbols: string[] = []): Promise<MarketStory> {
  const [report, sectors] = await Promise.all([
    getMarketNarrative(),
    getMarketSnapshot('sector')
  ]);

  // 1. Sector Rotation Map
  const sortedSectors = [...sectors].sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));
  const strong = sortedSectors.slice(0, 2).map(s => s.name);
  const weak = sortedSectors.slice(-2).map(s => s.name);
  const emerging = sectors.filter(s => parseFloat(s.percent) > 0 && parseFloat(s.percent) < 0.5).map(s => s.name);

  // 2. Build Narrative
  let portfolioImpact = null;
  if (portfolioSymbols.length > 0) {
    portfolioImpact = report.overallSignal.signal.direction === 'bullish' 
      ? `Positive terminal bias is currently supportive of your ${portfolioSymbols.length} active positions.`
      : `Terminal is detecting a ${report.regime}; your portfolio exposure may face volatility.`;
  }

  return {
    timestamp: new Date().toLocaleTimeString(),
    summary: report.overallSignal.reasoning.whatHappened,
    bias: report.overallSignal.signal.direction as any,
    confidence: report.overallSignal.signal.confidence,
    regime: report.regime,
    whyMoving: report.overallSignal.reasoning.whyItHappened,
    sectors: {
      strong,
      weak,
      emerging: emerging.slice(0, 2)
    },
    drivers: report.keyDrivers,
    risks: report.risks,
    opportunities: report.opportunities,
    portfolioImpact
  };
}

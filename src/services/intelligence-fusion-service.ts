
'use server';

import { getScannerData, getStockQuotes, getMarketSnapshot } from './market-data-service';
import { newsService } from './news-service';
import { fuseSignals, determineRegime, getRiskLevel, validateTechnicalAlignment } from './intelligence-engine';
import { IntelligenceSignal, UnifiedIntelligenceReport } from './intelligence-types';

/**
 * @fileOverview Intelligence Fusion Service.
 * Synchronizes technical scanner signals with real-time news narrative.
 */

export async function getStockIntelligence(symbol: string, isHeld: boolean = false): Promise<IntelligenceSignal> {
  const [quotes, news, scannerGainers, scannerLosers] = await Promise.all([
    getStockQuotes([symbol]).catch(() => []),
    newsService.getArticles().catch(() => []),
    getScannerData('gainers').catch(() => []),
    getScannerData('losers').catch(() => [])
  ]);

  const quote = quotes[0];
  if (!quote) throw new Error(`Symbol ${symbol} unreachable.`);

  const stockNews = news.filter(n => n.title.toUpperCase().includes(symbol.toUpperCase()));
  const isGainer = scannerGainers.find(s => s.symbol === symbol);
  const isLoser = scannerLosers.find(s => s.symbol === symbol);
  
  const volumeLabel = isGainer?.volume || isLoser?.volume || "0";
  const volumeConfirmed = await validateTechnicalAlignment(quote.changePercent, volumeLabel);

  const marketScore = (quote.changePercent / 5); 
  const scannerScore = isGainer ? 0.8 : isLoser ? -0.8 : 0;
  const newsScore = stockNews.length > 0 ? (stockNews.filter(n => n.sentiment === 'Positive').length - stockNews.filter(n => n.sentiment === 'Negative').length) / stockNews.length : 0;

  const fusion = await fuseSignals({ market: marketScore, scanner: scannerScore, news: newsScore, volumeConfirmed });

  return {
    id: `sig-${symbol}-${Date.now()}`,
    timestamp: Date.now(),
    entity: { type: "stock", symbol: symbol.toUpperCase(), name: quote.name },
    signal: {
      type: fusion.isConflicted ? "news-driven" : (scannerScore !== 0 ? "breakout" : "momentum"),
      direction: fusion.direction,
      strength: Math.abs(fusion.weight * 100),
      confidence: fusion.confidence
    },
    reasoning: {
      whatHappened: fusion.isConflicted ? `Divergence detected in ${symbol}.` : fusion.direction === 'bullish' ? `Constructive expansion in ${symbol}.` : `Selling pressure detected in ${symbol}.`,
      whyItHappened: fusion.confidence > 70 ? "Synchronized technical and narrative catalysts." : "Fragmented signals with low volume confirmation.",
      whyItMatters: isHeld ? "Position requires strict risk-parity tracking." : "Monitor for primary trend re-alignment."
    },
    context: { relatedNews: stockNews.slice(0, 2).map(n => n.title), relatedSectors: ["General"], relatedSymbols: [] },
    risk: { level: await getRiskLevel(fusion.weight, fusion.isConflicted), factors: isHeld ? ["Portfolio Concentration"] : ["Execution Volatility"] }
  };
}

export async function getMarketNarrative(): Promise<UnifiedIntelligenceReport> {
  const [indices, news] = await Promise.all([
    getMarketSnapshot().catch(() => []),
    newsService.getArticles().catch(() => [])
  ]);

  const nifty = indices.find(i => i.name === 'NIFTY 50');
  const marketScore = nifty ? (parseFloat(nifty.percent) / 2) : 0;
  const newsScore = (news.filter(n => n.sentiment === 'Positive').length - news.filter(n => n.sentiment === 'Negative').length) / Math.max(1, news.length);

  const fusion = await fuseSignals({ market: marketScore, news: newsScore });
  const regime = await determineRegime(marketScore, 0.5, newsScore);

  return {
    regime,
    overallSignal: {
      id: 'market-master',
      timestamp: Date.now(),
      entity: { type: "market", name: "Indian Markets" },
      signal: { type: "trend", direction: fusion.direction, strength: Math.abs(fusion.weight * 100), confidence: fusion.confidence },
      reasoning: { whatHappened: `Market operating in ${regime} state.`, whyItHappened: "Synthesis of institutional flow and news polarity.", whyItMatters: "Regime determines asset selection confidence floor." },
      context: { relatedNews: news.slice(0, 2).map(n => n.title), relatedSectors: ["Banking", "IT"], relatedSymbols: ["NIFTY 50"] },
      risk: { level: "low", factors: ["Global Macro"] }
    },
    topSignals: [], 
    sectorRotation: [],
    keyDrivers: ["Institutional Net Flow", "Earnings Sentiment"],
    risks: ["Structural Resistance"],
    opportunities: ["Sector Rotation"]
  };
}

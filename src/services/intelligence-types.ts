/**
 * @fileOverview Standardized Intelligence Types for MarketPulse.
 * Enforces the unified signal format across all terminal modules.
 */

export type EntityType = "index" | "stock" | "ipo" | "sector" | "market";
export type SignalType = "trend" | "breakout" | "reversal" | "momentum" | "news-driven" | "ipo-demand";
export type SignalDirection = "bullish" | "bearish" | "neutral";
export type RiskLevel = "low" | "medium" | "high";
export type MarketRegime = "Strong Bullish Trend" | "Weak Bullish" | "Sideways" | "Weak Bearish" | "Strong Bearish";

export interface IntelligenceSignal {
  id: string;
  timestamp: number;
  entity: {
    type: EntityType;
    symbol?: string;
    name?: string;
  };
  signal: {
    type: SignalType;
    direction: SignalDirection;
    strength: number; // 0-100
    confidence: number; // 0-100
  };
  reasoning: {
    whatHappened: string;
    whyItHappened: string;
    whyItMatters: string;
  };
  context: {
    relatedNews: string[];
    relatedSectors: string[];
    relatedSymbols: string[];
  };
  risk: {
    level: RiskLevel;
    factors: string[];
  };
}

export interface UnifiedIntelligenceReport {
  regime: MarketRegime;
  overallSignal: IntelligenceSignal;
  topSignals: IntelligenceSignal[];
  sectorRotation: Array<{ sector: string; strength: number; direction: SignalDirection }>;
  keyDrivers: string[];
  risks: string[];
  opportunities: string[];
}

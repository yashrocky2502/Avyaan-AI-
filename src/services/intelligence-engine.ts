'use server';

import { MarketRegime, SignalDirection, RiskLevel } from './intelligence-types';

/**
 * @fileOverview MarketPulse Intelligence Logic Engine - V2 (Reliability Layer).
 * Enforces weighted fusion, conflict detection, and confidence calibration.
 */

/**
 * Normalizes confidence scores into institutional buckets.
 */
export async function calibrateConfidence(rawScore: number): Promise<number> {
  // Clamp between 0 and 100
  const clamped = Math.min(100, Math.max(0, rawScore));
  
  // High-conviction threshold: 85+
  // Moderate threshold: 50-85
  // Low/Unreliable: < 50
  return clamped;
}

/**
 * Performs weighted fusion of multiple signals with Conflict Resolution.
 * Market(40%) + Scanner(30%) + News(20%) + IPO(10%)
 */
export async function fuseSignals(inputs: {
  market?: number; // Normalized -1 to 1
  scanner?: number;
  news?: number;
  ipo?: number;
  volumeConfirmed?: boolean;
}): Promise<{ direction: SignalDirection; confidence: number; weight: number; isConflicted: boolean }> {
  const weights = { market: 0.4, scanner: 0.3, news: 0.2, ipo: 0.1 };
  
  let totalWeight = 0;
  let score = 0;

  if (inputs.market !== undefined) { score += inputs.market * weights.market; totalWeight += weights.market; }
  if (inputs.scanner !== undefined) { score += inputs.scanner * weights.scanner; totalWeight += weights.scanner; }
  if (inputs.news !== undefined) { score += inputs.news * weights.news; totalWeight += weights.news; }
  if (inputs.ipo !== undefined) { score += inputs.ipo * weights.ipo; totalWeight += weights.ipo; }

  const normalizedScore = totalWeight > 0 ? score / totalWeight : 0;
  
  // 1. Conflict Detection
  // Check if technicals (Scanner) and Narrative (News) are pointing in opposite directions
  const isConflicted = inputs.scanner !== undefined && inputs.news !== undefined && 
                       Math.sign(inputs.scanner) !== Math.sign(inputs.news) && 
                       Math.abs(inputs.scanner) > 0.4 && Math.abs(inputs.news) > 0.4;

  // 2. Direction Determination (65% Threshold for conviction)
  let direction: SignalDirection = "neutral";
  if (!isConflicted) {
    if (normalizedScore > 0.30) direction = "bullish";
    if (normalizedScore < -0.30) direction = "bearish";
  }

  // 3. Confidence Calculation
  let confidence = 85;
  if (isConflicted) confidence -= 40; // Severe penalty for conflicts
  if (inputs.volumeConfirmed === false) confidence -= 20; // Penalty for low-volume price action
  if (Math.abs(normalizedScore) < 0.2) confidence -= 15; // Penalty for weak trend intensity

  return { 
    direction, 
    confidence: await calibrateConfidence(confidence), 
    weight: normalizedScore,
    isConflicted 
  };
}

/**
 * Determines the market regime based on technical and sentiment indicators.
 */
export async function determineRegime(marketScore: number, breadth: number, newsSentiment: number): Promise<MarketRegime> {
  const aggregate = (marketScore * 0.5) + (breadth * 0.3) + (newsSentiment * 0.2);
  
  if (aggregate > 0.6) return "Strong Bullish Trend";
  if (aggregate > 0.15) return "Weak Bullish";
  if (aggregate < -0.6) return "Strong Bearish";
  if (aggregate < -0.15) return "Weak Bearish";
  return "Sideways";
}

/**
 * Calculates the risk level based on signal consistency and magnitude.
 */
export async function getRiskLevel(fusionWeight: number, isConflicted: boolean): Promise<RiskLevel> {
  if (isConflicted) return "high";
  if (Math.abs(fusionWeight) > 0.75) return "medium"; // potentially overextended
  return "low";
}

/**
 * Validates the alignment of technical data (Price vs Volume).
 */
export async function validateTechnicalAlignment(priceChange: number, volumeLabel: string): Promise<boolean> {
  const volValue = parseFloat(volumeLabel.replace(/[KM]/g, ''));
  const isHighVolume = volumeLabel.includes('M') ? volValue > 5 : volValue > 500;
  
  // A price move is only "validated" if it's significant AND high volume
  if (Math.abs(priceChange) > 2 && !isHighVolume) return false;
  return true;
}

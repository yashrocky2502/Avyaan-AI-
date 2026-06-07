
/**
 * @fileOverview News article entity model.
 */

export interface NewsArticle {
  id: string | number;
  title: string;
  category: string;
  source: string;
  time: string;
  publishedAt?: string;
  url?: string;
  image: string;
  summary: string;
  content: string;
  whyMatters?: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  impact: 'High' | 'Medium' | 'Low';
  impactScore?: number; // 1-10
  shortTermImpact?: string;
  longTermImpact?: string;
  affectedSectors?: string[];
  investorTakeaway?: string;
}

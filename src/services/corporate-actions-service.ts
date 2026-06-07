'use server';

import Parser from 'rss-parser';

const parser = new Parser();

export interface CorporateAction {
  id: string;
  company: string;
  type: 'Dividend' | 'Split' | 'Bonus' | 'Rights' | 'Buyback' | 'General';
  description: string;
  date: string;
  impact: 'Positive' | 'Neutral' | 'Negative';
}

export async function fetchCorporateActions(): Promise<CorporateAction[]> {
  try {
    // NSE Corporate Announcements RSS (Unofficial or through aggregation services)
    // For MVP, we use the Economic Times Corporate Actions Feed
    const feed = await parser.parseURL('https://economictimes.indiatimes.com/markets/stocks/recs/rssfeeds/2146843.cms');
    
    return feed.items.slice(0, 10).map((item, index) => {
      const title = item.title || '';
      let type: CorporateAction['type'] = 'General';
      let impact: CorporateAction['impact'] = 'Neutral';

      if (title.toLowerCase().includes('dividend')) {
        type = 'Dividend';
        impact = 'Positive';
      } else if (title.toLowerCase().includes('split')) {
        type = 'Split';
        impact = 'Positive';
      } else if (title.toLowerCase().includes('bonus')) {
        type = 'Bonus';
        impact = 'Positive';
      } else if (title.toLowerCase().includes('buyback')) {
        type = 'Buyback';
        impact = 'Positive';
      }

      return {
        id: `ca-${index}`,
        company: title.split(':')[0] || 'Market Entity',
        type,
        description: item.contentSnippet || item.title || '',
        date: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Today',
        impact
      };
    });
  } catch (error) {
    console.error('Failed to fetch corporate actions:', error);
    return [];
  }
}
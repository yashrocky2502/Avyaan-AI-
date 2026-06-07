
'use server';

/**
 * @fileOverview RSS Service for fetching and normalizing financial news.
 * Optimized with parallel fetching and robust error handling.
 */

import Parser from 'rss-parser';
import { NewsArticle } from '@/models/news-article';

const parser = new Parser();

const RSS_FEEDS = [
  { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms', category: 'Equity' },
  { name: 'Moneycontrol', url: 'https://www.moneycontrol.com/rss/marketreports.xml', category: 'Economy' },
  { name: 'Business Standard', url: 'https://www.business-standard.com/rss/markets-106.rss', category: 'Markets' }
];

export async function fetchRssNews(): Promise<NewsArticle[]> {
  // Use parallel fetching to prevent a single slow feed from blocking the system
  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      const feedData = await parser.parseURL(feed.url);
      
      return feedData.items.slice(0, 5).map((item, index) => ({
        id: `rss-${feed.name}-${index}`,
        title: item.title || 'Untitled',
        category: feed.category,
        source: feed.name,
        time: item.pubDate ? new Date(item.pubDate).toLocaleTimeString() : 'Recently',
        publishedAt: item.pubDate,
        url: item.link,
        image: `https://picsum.photos/seed/${feed.name.replace(/\s+/g, '-')}-${index}/800/600`,
        summary: item.contentSnippet?.slice(0, 200) || 'No summary available.',
        content: item.content || item.contentSnippet || '',
        whyMatters: "This headline signals potential shifts in institutional liquidity and sector-specific sentiment.",
        sentiment: 'Neutral' as const,
        impact: 'Medium' as const,
        impactScore: 5,
        shortTermImpact: "Immediate focus on volatility.",
        longTermImpact: "Structural assessment pending more data.",
        affectedSectors: [feed.category],
        investorTakeaway: "Monitor price action at key support levels."
      }));
    } catch (error) {
      // Log as warning rather than error to avoid triggering 'Fatal' alerts during startup
      console.warn(`[TERMINAL SYNC] News feed ${feed.name} temporarily unreachable.`);
      return [];
    }
  });

  const results = await Promise.all(feedPromises);
  return results.flat();
}

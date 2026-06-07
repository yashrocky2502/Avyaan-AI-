/**
 * @fileOverview Repository for fetching news data.
 * This can be easily swapped with a real API repository in the future.
 */

import { NewsArticle } from '@/models/news-article';
import newsData from '@/data/news-data.json';

export interface INewsRepository {
  getAll(): Promise<NewsArticle[]>;
  getById(id: number): Promise<NewsArticle | undefined>;
}

export class NewsMockRepository implements INewsRepository {
  /**
   * Fetches all news articles. 
   * Currently uses local JSON data. 
   * In the future, this can be replaced with:
   * return fetch('https://api.example.com/news').then(res => res.json());
   */
  async getAll(): Promise<NewsArticle[]> {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return newsData as NewsArticle[];
  }

  /**
   * Fetches a single article by its ID.
   */
  async getById(id: number): Promise<NewsArticle | undefined> {
    const articles = await this.getAll();
    return articles.find(a => a.id === id);
  }
}

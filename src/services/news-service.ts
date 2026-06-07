
/**
 * @fileOverview Service for news-related business logic.
 * Orchestrates repositories and provides high-level methods for components.
 */

import { NewsArticle } from '@/models/news-article';
import { NewsMockRepository, INewsRepository } from '@/repositories/news-repository';
import { fetchRssNews } from './rss-service';

export class NewsService {
  private repository: INewsRepository;

  constructor(repository: INewsRepository = new NewsMockRepository()) {
    this.repository = repository;
  }

  /**
   * Retrieves all news articles (RSS + Mock fallback).
   */
  async getArticles(): Promise<NewsArticle[]> {
    try {
      const rssArticles = await fetchRssNews();
      if (rssArticles.length > 0) return rssArticles;
    } catch (e) {
      console.warn("RSS fetch failed, falling back to mock data.");
    }
    return this.repository.getAll();
  }

  /**
   * Retrieves a specific article by ID.
   */
  async getArticleById(id: string | number): Promise<NewsArticle | undefined> {
    const articles = await this.getArticles();
    return articles.find(a => a.id.toString() === id.toString());
  }

  /**
   * Retrieves articles filtered by category.
   */
  async getArticlesByCategory(category: string): Promise<NewsArticle[]> {
    const articles = await this.getArticles();
    if (category === 'All' || !category) return articles;
    return articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
}

// Export a singleton instance for easy use across the app
export const newsService = new NewsService();

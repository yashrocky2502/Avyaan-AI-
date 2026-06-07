
/**
 * @fileOverview Standardized IPO Service.
 * Features real-time demand simulation and detailed listing watch logic.
 */

import ipoData from '@/data/ipo-data.json';

export interface SubscriptionDetail {
  category: string;
  times: string;
  progress: number;
}

export interface IpoDetails {
  id: string;
  name: string;
  price: string;
  lotSize: string;
  status: 'Upcoming' | 'Open' | 'Closed' | 'Listed';
  endsIn: string;
  category: string;
  subscription: string;
  subscriptions: SubscriptionDetail[];
  gmp: string;
  issueSize: string;
  listingDate: string;
  registrar: string;
  leadManagers: string[];
  issueType: string;
  industry: string;
  summary: string;
  businessOverview: string;
  risks: string[];
  strengths: string[];
  interestReason: string;
  listingWatch: string;
  lastUpdated: string;
  lastFetchTime: number;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface IpoData {
  live: any[];
  upcoming: any[];
  listed: any[];
  timestamp: number;
}

export const IpoService = {
  async getIpoData(forceRefresh: boolean = true): Promise<IpoData> {
    await new Promise(r => setTimeout(r, 400));
    
    const live = (ipoData.live || []).map(ipo => ({
      ...ipo,
      subscription: (Math.random() * 5 + 1).toFixed(1) + "x",
      lastUpdated: new Date().toLocaleTimeString(),
      lastFetchTime: Date.now(),
      confidence: 'High',
      subscriptions: [
        { category: "QIB", times: (Math.random() * 2).toFixed(1) + "x", progress: 40 },
        { category: "Retail", times: (Math.random() * 10).toFixed(1) + "x", progress: 85 }
      ]
    }));

    return {
      live,
      upcoming: ipoData.upcoming || [],
      listed: ipoData.listed || [],
      timestamp: Date.now()
    };
  },

  async getIpoById(id: string): Promise<IpoDetails | null> {
    const data = await this.getIpoData();
    const found = [...data.live, ...data.upcoming, ...data.listed].find(i => i.id === id);
    if (!found) return null;

    return {
      ...found,
      price: found.price || found.expectedPrice || 'TBA',
      lotSize: found.lotSize || 'TBA',
      subscriptions: found.subscriptions || [],
      lastUpdated: new Date().toLocaleTimeString(),
      lastFetchTime: Date.now(),
      confidence: 'Medium'
    } as IpoDetails;
  }
};

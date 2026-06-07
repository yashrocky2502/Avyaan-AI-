'use server';

/**
 * @fileOverview Institutional Data Ingestion Engine - V2 (Reliability Layer).
 * Manages batching, data integrity checks, and stale-data protection.
 */

export type Priority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
}

const GLOBAL_CACHE: Record<string, CacheEntry<any>> = {};

/**
 * Simple hashing function to detect data changes
 */
function generateHash(data: any): string {
  try {
    return JSON.stringify(data).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0).toString();
  } catch (e) {
    return Date.now().toString();
  }
}

/**
 * Unified fetcher with integrity checks and stale-data fallback.
 */
export async function ingestData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 30000,
  priority: Priority = 'P2'
): Promise<{ data: T | null; isFresh: boolean; lastSync: number; isStale: boolean; error?: string }> {
  const cached = GLOBAL_CACHE[key];
  const now = Date.now();

  // 1. Data Freshness Check
  const isCacheValid = cached && (now - cached.timestamp < ttl);
  
  if (isCacheValid) {
    return { data: cached.data, isFresh: false, lastSync: cached.timestamp, isStale: false };
  }

  try {
    const freshData = await fetcher();
    
    // 2. Data Integrity Check: Reject empty or malformed payloads
    if (freshData === undefined || freshData === null) {
       if (cached) {
         return { data: cached.data, isFresh: false, lastSync: cached.timestamp, isStale: true };
       }
       return { data: null, isFresh: false, lastSync: 0, isStale: false };
    }

    const newHash = generateHash(freshData);
    
    // 3. Differential Update: Only update cache if data has actually changed
    if (!cached || cached.hash !== newHash) {
      GLOBAL_CACHE[key] = {
        data: freshData,
        timestamp: now,
        hash: newHash
      };
    }

    return { data: freshData, isFresh: true, lastSync: now, isStale: false };
  } catch (error: any) {
    // Graceful handling of network failures
    console.log(`[TERMINAL SYNC INFO] ${key} delayed:`, error.message);
    
    if (cached) {
      return { data: cached.data, isFresh: false, lastSync: cached.timestamp, isStale: true };
    }
    return { data: null, isFresh: false, lastSync: 0, isStale: false, error: error.message };
  }
}

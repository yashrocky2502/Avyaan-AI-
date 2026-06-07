'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * @fileOverview Enhanced Universal Terminal Module Manager.
 * Optimized for institutional-grade SPA performance with SWR caching.
 */

const globalModuleCache: Record<string, { data: any; timestamp: string; hash: string }> = {};

export interface TerminalResponse<T> {
  status: 'loading' | 'success' | 'error';
  timestamp: string;
  data: T | null;
  fallbackData: T | null;
  sourceModule: string;
  error?: string;
}

interface UseTerminalModuleOptions<T> {
  moduleName: string;
  fetcher: () => Promise<T>;
  refreshInterval?: number;
  initialData?: T | null;
}

export function useTerminalModule<T>({
  moduleName,
  fetcher,
  refreshInterval = 0,
  initialData = null
}: UseTerminalModuleOptions<T>) {
  const cached = globalModuleCache[moduleName];

  const [response, setResponse] = useState<TerminalResponse<T>>({
    status: cached ? 'success' : 'loading',
    timestamp: cached ? cached.timestamp : new Date().toISOString(),
    data: cached ? cached.data : initialData,
    fallbackData: cached ? cached.data : initialData,
    sourceModule: moduleName
  });

  const lastSuccessData = useRef<T | null>(cached ? cached.data : initialData);
  const lastHash = useRef<string>(cached ? cached.hash : '');

  const executeSync = useCallback(async (isSilent = false) => {
    if (!isSilent && !lastSuccessData.current) {
      setResponse(prev => ({ ...prev, status: 'loading' }));
    }

    try {
      const data = await fetcher();
      if (data === undefined || data === null) {
        throw new Error(`[CONTRACT VIOLATION] ${moduleName} returned empty payload.`);
      }

      const timestamp = new Date().toISOString();
      const currentHash = JSON.stringify(data);
      
      // Differential Update: Only trigger state update if data actually changed
      if (currentHash !== lastHash.current || response.status !== 'success') {
        lastHash.current = currentHash;
        lastSuccessData.current = data;
        globalModuleCache[moduleName] = { data, timestamp, hash: currentHash };

        setResponse({
          status: 'success',
          timestamp,
          data,
          fallbackData: data,
          sourceModule: moduleName
        });
      }
    } catch (err: any) {
      setResponse(prev => ({
        ...prev,
        status: 'error',
        timestamp: new Date().toISOString(),
        error: err.message || 'Unknown terminal failure',
        data: null,
        fallbackData: lastSuccessData.current
      }));
    }
  }, [fetcher, moduleName, response.status]);

  useEffect(() => {
    executeSync(!!lastSuccessData.current);
    if (refreshInterval > 0) {
      const interval = setInterval(() => executeSync(true), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [executeSync, refreshInterval]);

  return useMemo(() => ({
    ...response,
    refresh: () => executeSync(),
    renderData: response.data || response.fallbackData
  }), [response, executeSync]);
}

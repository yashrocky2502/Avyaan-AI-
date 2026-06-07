'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePriceStream } from './use-price-stream';

export interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number;
  change?: number;
  changePercent?: number;
  name?: string;
  source?: string;
}

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('marketpulse_portfolio');
    if (saved) {
      try {
        setHoldings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load portfolio", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('marketpulse_portfolio', JSON.stringify(holdings.map(h => ({
        id: h.id,
        symbol: h.symbol,
        quantity: h.quantity,
        avgPrice: h.avgPrice
      }))));
    }
  }, [holdings, isInitialized]);

  // Unified Price Stream Subscription
  const symbols = useMemo(() => holdings.map(h => h.symbol), [holdings.length]);
  const { quotes } = usePriceStream(symbols);

  const hydratedHoldings = useMemo(() => {
    return holdings.map(h => {
      const q = quotes[h.symbol];
      if (q) {
        return {
          ...h,
          currentPrice: q.price,
          change: q.change,
          changePercent: q.changePercent,
          name: q.name,
          source: q.source
        };
      }
      return h;
    });
  }, [holdings, quotes]);

  const addHolding = (symbol: string, quantity: number, avgPrice: number) => {
    const newHolding: Holding = {
      id: crypto.randomUUID(),
      symbol: symbol.toUpperCase(),
      quantity,
      avgPrice
    };
    setHoldings(prev => [...prev, newHolding]);
  };

  const removeHolding = (id: string) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const summary = useMemo(() => {
    let totalInvestment = 0;
    let currentValue = 0;
    let dailyChange = 0;

    hydratedHoldings.forEach(h => {
      totalInvestment += h.quantity * h.avgPrice;
      if (h.currentPrice) {
        currentValue += h.quantity * h.currentPrice;
        dailyChange += h.quantity * (h.change || 0);
      }
    });

    const totalPnL = currentValue - totalInvestment;
    const totalPnLPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    return {
      totalInvestment,
      currentValue,
      totalPnL,
      totalPnLPercent,
      dailyChange
    };
  }, [hydratedHoldings]);

  return {
    holdings: hydratedHoldings,
    addHolding,
    removeHolding,
    summary,
    loading: !isInitialized
  };
}

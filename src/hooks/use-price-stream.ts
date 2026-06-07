'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getUnifiedQuotes } from '@/services/price-stream-service';
import { NormalizedQuote } from '@/services/price-stream-registry';

/**
 * @fileOverview Reactive Price Stream Hook.
 * Enables zero-lag real-time updates for any component.
 */

const globalPriceCache: Record<string, NormalizedQuote> = {};
const globalListeners: Set<(quotes: NormalizedQuote[]) => void> = new Set();
let streamInterval: NodeJS.Timeout | null = null;
let activeSymbols: Set<string> = new Set();

/**
 * Centralized Stream Pulse
 */
async function pulse() {
  if (activeSymbols.size === 0) return;
  
  try {
    const symbols = Array.from(activeSymbols);
    const freshQuotes = await getUnifiedQuotes(symbols);
    
    freshQuotes.forEach(q => {
      globalPriceCache[q.symbol] = q;
    });

    globalListeners.forEach(l => l(freshQuotes));
  } catch (e) {
    console.warn('[STREAM PULSE] Interrupted:', e);
  }
}

function startStream() {
  if (streamInterval) return;
  streamInterval = setInterval(pulse, 15000); // 15s pulse for standard usage
}

export function usePriceStream(symbols: string[]) {
  const [quotes, setQuotes] = useState<Record<string, NormalizedQuote>>(() => {
    const initial: Record<string, NormalizedQuote> = {};
    symbols.forEach(s => {
      if (globalPriceCache[s]) initial[s] = globalPriceCache[s];
    });
    return initial;
  });

  const symbolsRef = useRef(symbols);

  useEffect(() => {
    symbolsRef.current = symbols;
    symbols.forEach(s => activeSymbols.add(s));
    
    const listener = (fresh: NormalizedQuote[]) => {
      const relevant = fresh.filter(q => symbolsRef.current.includes(q.symbol));
      if (relevant.length > 0) {
        setQuotes(prev => {
          const next = { ...prev };
          relevant.forEach(q => { next[q.symbol] = q; });
          return next;
        });
      }
    };

    globalListeners.add(listener);
    startStream();

    // Trigger immediate fetch for new symbols
    pulse();

    return () => {
      globalListeners.delete(listener);
      // We don't remove symbols from activeSymbols immediately to prevent flicker on rapid navigation
    };
  }, [symbols.join(',')]);

  return {
    quotes,
    allQuotes: Object.values(quotes),
    isSyncing: activeSymbols.size > 0
  };
}

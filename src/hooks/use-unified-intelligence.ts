"use client";

import { useState, useEffect, useCallback } from "react";
import { getStockIntelligence } from "@/services/intelligence-fusion-service";
import { IntelligenceSignal } from "@/services/intelligence-types";

/**
 * @fileOverview The "Intelligence Brain" Hook.
 * Synchronizes stock intelligence signals across all terminal modules.
 */

const intelligenceStore: Record<string, IntelligenceSignal> = {};
const listeners: Set<() => void> = new Set();

export function useUnifiedIntelligence() {
  const [, setTick] = useState(0);

  const notify = useCallback(() => {
    listeners.forEach(l => l());
  }, []);

  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const getIntelligence = useCallback(async (symbol: string, isHeld: boolean = false) => {
    if (intelligenceStore[symbol]) return intelligenceStore[symbol];
    
    const signal = await getStockIntelligence(symbol, isHeld);
    intelligenceStore[symbol] = signal;
    notify();
    return signal;
  }, [notify]);

  const updateIntelligence = useCallback(async (symbol: string, type: 'positive' | 'negative', message: string) => {
    // Force re-fetch for fresh signal normalization
    const fresh = await getStockIntelligence(symbol);
    intelligenceStore[symbol] = fresh;
    notify();
  }, [notify]);

  const forceRefresh = useCallback(async (symbol: string) => {
    const signal = await getStockIntelligence(symbol);
    intelligenceStore[symbol] = signal;
    notify();
    return signal;
  }, [notify]);

  return {
    intelligenceStore,
    getIntelligence,
    updateIntelligence,
    forceRefresh
  };
}

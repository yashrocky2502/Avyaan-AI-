"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Landmark, Database, BarChart3, Coins, CircleDollarSign, Globe, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePriceStream } from "@/hooks/use-price-stream";
import { MASTER_REGISTRY } from "@/services/price-stream-registry";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, any> = {
  "index": Landmark,
  "stock": BarChart3,
  "crypto": Coins,
  "commodity": CircleDollarSign,
  "forex": Globe
};

/**
 * @fileOverview Market Overview Terminal - V2 (High Density Tile Grid).
 * Optimized for institutional data-heavy layouts.
 */
export function MarketOverview() {
  const symbols = useMemo(() => MASTER_REGISTRY.map(a => a.symbol), []);
  const { quotes } = usePriceStream(symbols);

  const displayQuotes = useMemo(() => {
    return MASTER_REGISTRY.map(asset => {
      const quote = quotes[asset.symbol];
      return {
        asset,
        quote,
        isLoaded: !!quote
      };
    });
  }, [quotes]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {displayQuotes.map(({ asset, quote, isLoaded }) => {
        const Icon = iconMap[asset.type] || Activity;
        
        if (!isLoaded) {
          return (
            <Card key={asset.symbol} className="overflow-hidden border-border bg-card shadow-none border-solid">
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-1.5 opacity-30">
                  <Icon className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase tracking-tight truncate">{asset.name}</span>
                </div>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-2 w-10" />
              </div>
            </Card>
          );
        }

        return (
          <Card key={asset.symbol} className="overflow-hidden border-border bg-card hover:border-primary transition-all group cursor-pointer relative shadow-none border-solid border-l-2 hover:bg-muted/30">
            <CardContent className="p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Icon className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="font-headline text-[9px] font-bold text-muted-foreground uppercase tracking-tight truncate">
                    {asset.name}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Database className="h-2 w-2 text-primary" />
                  <span className="text-[7px] text-muted-foreground font-bold uppercase">{quote!.source}</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold font-headline tracking-tight tabular-nums text-foreground">
                  {quote!.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <div className={cn(
                  "text-[9px] font-bold flex items-center gap-0.5 mt-0.5",
                  quote!.trend === "up" ? "text-primary" : "text-destructive"
                )}>
                  {quote!.trend === "up" ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  <span className="tabular-nums">
                    {quote!.change.toFixed(2)} ({quote!.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* High-Density Sparkline Texture */}
              <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden mt-1">
                 <div 
                   className={cn("h-full transition-all duration-1000", quote!.trend === 'up' ? "bg-primary" : "bg-destructive")} 
                   style={{ width: `${Math.min(100, 40 + Math.abs(quote!.changePercent * 5))}%` }} 
                 />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

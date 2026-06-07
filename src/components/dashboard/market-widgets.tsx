
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Zap, Target, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketService, StockInfo, SectorInfo } from "@/services/market-service";

export function MarketWidgets() {
  const [gainers, setGainers] = useState<StockInfo[]>([]);
  const [losers, setLosers] = useState<StockInfo[]>([]);
  const [sectors, setSectors] = useState<SectorInfo[]>([]);

  useEffect(() => {
    async function load() {
      const data = await MarketService.getMarketOverview();
      setGainers(data.gainers);
      setLosers(data.losers);
      setSectors(data.sectors);
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Top Gainers */}
      <Card className="border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="font-headline text-sm font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Top Gainers
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase">Nifty 50</Badge>
        </CardHeader>
        <CardContent className="space-y-1">
          {gainers.map((stock) => (
            <div key={stock.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs font-bold">{stock.name}</span>
                <span className="text-[10px] text-muted-foreground">{stock.val} vol</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold font-headline">₹{stock.price}</span>
                <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                  {stock.chg}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card className="border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="font-headline text-sm font-bold flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            Top Losers
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-bold border-destructive/20 text-destructive uppercase">Nifty 50</Badge>
        </CardHeader>
        <CardContent className="space-y-1">
          {losers.map((stock) => (
            <div key={stock.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs font-bold">{stock.name}</span>
                <span className="text-[10px] text-muted-foreground">{stock.val} vol</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold font-headline">₹{stock.price}</span>
                <span className="text-[10px] font-bold text-destructive flex items-center gap-0.5">
                  <ArrowDownRight className="h-3 w-3" />
                  {stock.chg}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sectoral Performance */}
      <Card className="border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="font-headline text-sm font-bold flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            Sector Performance
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          {sectors.map((sector) => (
            <div key={sector.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-default">
              <span className="text-xs font-medium">{sector.name}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0 border-none",
                  sector.trend === "up" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                )}
              >
                {sector.performance}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

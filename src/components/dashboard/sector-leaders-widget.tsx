"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketSnapshot, MarketSnapshot } from "@/services/market-data-service";
import { Skeleton } from "@/components/ui/skeleton";

export function SectorLeadersWidget() {
  const [sectors, setSectors] = useState<MarketSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getMarketSnapshot('sector');
      setSectors(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Skeleton className="h-[300px] w-full rounded-2xl" />;

  return (
    <Card className="border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/20 border-b border-border/10">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-accent" />
          <CardTitle className="font-headline text-sm font-bold uppercase tracking-widest">
            Sector Map
          </CardTitle>
        </div>
        <BarChart3 className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/10">
          {sectors.map((sector) => (
            <div key={sector.name} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-default">
              <span className="text-xs font-bold tracking-tight">{sector.name}</span>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-mono text-muted-foreground">{sector.value}</span>
                 <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 border-none w-16 justify-center",
                    sector.trend === "up" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  )}
                >
                  {sector.percent}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
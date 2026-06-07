"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldAlert, 
  Target, 
  History,
  Activity,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateDailyMarketStory, MarketStory } from "@/services/market-story-service";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Skeleton } from "@/components/ui/skeleton";

export function DailyMarketStory() {
  const [story, setStory] = useState<MarketStory | null>(null);
  const [loading, setLoading] = useState(true);
  const { holdings } = usePortfolio();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const symbols = holdings.map(h => h.symbol);
      const data = await generateDailyMarketStory(symbols);
      setStory(data);
      setLoading(false);
    }
    load();
  }, [holdings.length]);

  if (loading) return <Skeleton className="h-[500px] w-full rounded-[2.5rem] bg-muted" />;
  if (!story) return null;

  return (
    <Card className="border border-border bg-card rounded-[2.5rem] overflow-hidden shadow-none relative group">
      <CardHeader className="p-10 pb-6 border-b border-border bg-muted">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary">
              <BrainCircuit className="h-8 w-8" />
              <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Engine Regime: {story.regime}</span>
            </div>
            <h2 className="font-headline text-4xl font-bold tracking-tight">Market Intelligence Briefing</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Engine Confidence</p>
              <p className="text-3xl font-bold font-headline text-primary">{story.confidence}%</p>
            </div>
            <Badge className={cn(
              "h-14 px-8 rounded-2xl text-sm font-bold uppercase tracking-widest border-none",
              story.bias === 'Bullish' ? "bg-primary text-white" : "bg-destructive text-white"
            )}>
              {story.bias} Bias
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-10 space-y-10 bg-card">
        {/* Executive Summary */}
        <div className="space-y-6">
          <p className="text-2xl md:text-3xl leading-relaxed text-foreground font-medium italic tracking-tight">
            "{story.summary}"
          </p>
          <div className="flex gap-4 p-6 rounded-3xl bg-muted border border-border">
             <History className="h-6 w-6 text-primary shrink-0" />
             <p className="text-base text-muted-foreground leading-relaxed font-medium">
               {story.whyMoving}
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sector Rotation Map */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-primary">
                <Layers className="h-5 w-5" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest">Sector Strength</h4>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-primary uppercase">Strong Accumulation</p>
                   <div className="flex flex-wrap gap-2">
                      {story.sectors.strong.map(s => <Badge key={s} variant="secondary" className="bg-primary text-primary-foreground border-none">{s}</Badge>)}
                   </div>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-destructive uppercase">Distribution Bias</p>
                   <div className="flex flex-wrap gap-2">
                      {story.sectors.weak.map(s => <Badge key={s} variant="secondary" className="bg-destructive text-white border-none">{s}</Badge>)}
                   </div>
                </div>
             </div>
          </div>

          {/* Strategic Drivers */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-accent">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest">Intelligence Drivers</h4>
             </div>
             <div className="space-y-3">
                {story.drivers.map((d, i) => (
                   <div key={i} className="flex gap-3 text-sm font-medium text-foreground group">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      {d}
                   </div>
                ))}
             </div>
          </div>

          {/* Risk & Opportunity Matrix */}
          <div className="space-y-6">
             <div className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                <h4 className="text-[11px] font-bold uppercase tracking-widest">Opportunity Zones</h4>
             </div>
             <div className="p-6 rounded-[2rem] bg-muted border border-border space-y-4">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-primary">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase">Alpha Clusters</span>
                   </div>
                   <p className="text-xs text-muted-foreground italic">"{story.opportunities[0]}"</p>
                </div>
                <Separator className="bg-border" />
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-destructive">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase">Risk Exposure</span>
                   </div>
                   <p className="text-xs text-muted-foreground italic">"{story.risks[0]}"</p>
                </div>
             </div>
          </div>
        </div>

        {/* Portfolio Impact Section */}
        {story.portfolioImpact && (
          <div className="pt-8 border-t border-border">
            <div className="p-8 rounded-[2.5rem] bg-primary text-primary-foreground shadow-none flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                     <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                     <h5 className="text-xl font-bold font-headline">Personalized Alpha Briefing</h5>
                     <p className="text-sm font-medium leading-relaxed max-w-2xl opacity-90">
                       {story.portfolioImpact}
                     </p>
                  </div>
               </div>
               <button className="h-12 px-8 rounded-xl bg-white text-primary font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                  View Impact Traces <ArrowRight className="h-4 w-4" />
               </button>
            </div>
          </div>
        )}

        <div className="pt-6 flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Engine Processing Active</span>
           </div>
           <span>System Sync: {story.timestamp}</span>
        </div>
      </CardContent>
    </Card>
  );
}
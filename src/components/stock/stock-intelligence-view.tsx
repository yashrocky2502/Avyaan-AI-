"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  BrainCircuit, 
  ShieldAlert, 
  Loader2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  History,
  ShieldCheck,
  ChevronRight,
  Wallet,
  Activity,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStockIntelligence } from "@/services/intelligence-fusion-service";
import { getStockQuotes, StockQuote } from "@/services/market-data-service";
import { newsService } from "@/services/news-service";
import { NewsArticle } from "@/models/news-article";
import { usePortfolio } from "@/hooks/use-portfolio";
import { IntelligenceSignal } from "@/services/intelligence-types";

export function StockIntelligenceView({ symbol }: { symbol: string }) {
  const { holdings } = usePortfolio();
  const [intel, setIntel] = useState<IntelligenceSignal | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const portfolioHolding = holdings.find(h => h.symbol === symbol.toUpperCase() || h.symbol === symbol);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [intelData, quoteData, allNews] = await Promise.all([
          getStockIntelligence(symbol, !!portfolioHolding),
          getStockQuotes([symbol]).then(q => q[0] || null),
          newsService.getArticles()
        ]);
        
        setIntel(intelData);
        setQuote(quoteData);
        setNews(allNews.filter(n => n.title.toUpperCase().includes(symbol.toUpperCase())));

      } catch (err) {
        console.error("Failed to load stock intelligence:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol, portfolioHolding]);

  if (loading) {
    return (
      <div className="p-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Running Intelligence Engine for {symbol}...</p>
      </div>
    );
  }

  if (!intel || !quote) return <div className="p-20 text-center font-bold text-muted-foreground">Intelligence Sync Failed.</div>;

  return (
    <div className="space-y-10 pb-24 max-w-[1600px] mx-auto">
      {/* 1. Header Snapshot */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border/40 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase px-4 py-1 tracking-widest">
               {intel.entity.type}
             </Badge>
             {portfolioHolding && (
               <Badge className="bg-orange-500/10 text-orange-500 border-none text-[10px] font-bold uppercase px-4 py-1 flex items-center gap-2 tracking-widest shadow-sm">
                 <Wallet className="h-3 w-3" /> Active Position
               </Badge>
             )}
          </div>
          <h1 className="font-headline text-5xl md:text-8xl font-bold tracking-tight text-foreground leading-[0.9]">{quote.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground font-bold uppercase text-[11px] tracking-[0.3em]">
             <span className="text-primary">{quote.symbol}</span>
             <span className="opacity-30">•</span>
             <span>Confidence: {intel.signal.confidence}%</span>
             <span className="opacity-30">•</span>
             <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {mounted ? new Date(intel.timestamp).toLocaleTimeString() : '--:--:--'}</span>
          </div>
        </div>

        <div className="text-right space-y-2">
           <p className="text-6xl md:text-8xl font-headline font-bold tabular-nums leading-none">₹{quote.price.toLocaleString('en-IN')}</p>
           <div className={cn(
             "text-xl font-bold flex items-center justify-end gap-3",
             quote.change >= 0 ? "text-primary" : "text-destructive"
           )}>
             {quote.change >= 0 ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
             <span className="tabular-nums">{quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* 2. Structured Intelligence Reasoning */}
          <Card className="border-none bg-primary/5 rounded-[3rem] overflow-hidden relative group shadow-2xl shadow-primary/5">
            <div className="absolute -right-20 -top-20 h-64 w-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000" />
            <CardContent className="p-12 relative z-10 space-y-8">
              <div className="flex items-center gap-3 text-primary">
                <BrainCircuit className="h-8 w-8" />
                <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Reasoning Framework</span>
              </div>
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-bold uppercase text-primary mb-2">What happened?</p>
                   <p className="text-2xl md:text-3xl leading-snug font-medium italic">"{intel.reasoning.whatHappened}"</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase text-primary mb-2">Why it happened?</p>
                   <p className="text-lg text-muted-foreground">{intel.reasoning.whyItHappened}</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase text-primary mb-2">Why it matters?</p>
                   <p className="text-lg text-muted-foreground font-medium">{intel.reasoning.whyItMatters}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Risk Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/40 bg-card/40 rounded-[2.5rem] shadow-xl overflow-hidden">
               <CardHeader className="p-8 pb-4 border-b border-border/10 bg-primary/5">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 text-primary">
                    <Zap className="h-5 w-5" /> Catalyst Map
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-5">
                 {intel.context.relatedNews.map((news, i) => (
                   <div key={i} className="flex gap-4 text-sm font-medium group">
                     <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                       <ChevronRight className="h-4 w-4" />
                     </span>
                     {news}
                   </div>
                 ))}
               </CardContent>
            </Card>

            <Card className={cn(
              "border-border/40 bg-card/40 rounded-[2.5rem] shadow-xl overflow-hidden",
              intel.risk.level === 'high' && "border-destructive/40"
            )}>
               <CardHeader className="p-8 pb-4 border-b border-border/10 bg-destructive/5">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 text-destructive">
                    <ShieldAlert className="h-5 w-5" /> Risk Factors: {intel.risk.level}
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-5">
                 {intel.risk.factors.map((factor, i) => (
                   <div key={i} className="flex gap-4 text-sm font-medium text-muted-foreground">
                     <span className="h-2 w-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                     {factor}
                   </div>
                 ))}
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Analytical Matrix */}
        <aside className="lg:col-span-4 space-y-8 sticky top-24">
          <Card className="border-border/40 bg-card/40 rounded-[3rem] overflow-hidden shadow-2xl">
             <CardHeader className="bg-primary/10 border-b border-border/10 p-10">
               <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-3 text-primary">
                 <Activity className="h-5 w-5" /> Intelligence Pulse
               </CardTitle>
             </CardHeader>
             <CardContent className="p-10 space-y-10">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Strength Score</span>
                    <span className="text-5xl font-bold font-headline text-primary tabular-nums">{intel.signal.strength.toFixed(0)}%</span>
                  </div>
                  <Progress value={intel.signal.strength} className="h-3 rounded-full bg-primary/10" />
                </div>

                <div className="p-8 rounded-[2.5rem] bg-muted/20 border border-border/10 space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Master Bias</span>
                      <Badge className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.3em] border-none px-5 py-1.5 shadow-xl",
                        intel.signal.direction === 'bullish' ? "bg-primary text-white" : 
                        intel.signal.direction === 'bearish' ? "bg-destructive text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {intel.signal.direction}
                      </Badge>
                   </div>
                </div>
                
                <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 space-y-4">
                   <div className="flex items-center gap-2 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logic Attribution</span>
                   </div>
                   <p className="text-xs text-muted-foreground italic leading-relaxed">
                     Signal derived from weighted fusion of Scanner breakouts ({intel.signal.type}) and news catalysts. Confidence adjusted for regime stability.
                   </p>
                </div>
             </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BrainCircuit, 
  Lightbulb,
  Sparkles,
  Zap,
  ShieldCheck,
  Megaphone,
  Loader2,
  TrendingUp,
  Calendar,
  Target,
  ChevronRight,
  Info,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchCorporateActions, CorporateAction } from "@/services/corporate-actions-service";
import { getInstitutionalFlow, getMarketSnapshot } from "@/services/market-data-service";

interface IntelligenceInsight {
  what: string;
  why: string;
  sector: string;
  confidence: number;
  type: 'positive' | 'negative' | 'neutral';
  icon: any;
}

export function MarketIntelligenceHub() {
  const [actions, setActions] = useState<CorporateAction[]>([]);
  const [flows, setFlows] = useState<{ fii: string; dii: string; net: string } | null>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [ca, flowData, sectorData] = await Promise.all([
        fetchCorporateActions(),
        getInstitutionalFlow(),
        getMarketSnapshot('sector')
      ]);
      setActions(ca);
      setFlows(flowData);
      setSectors(sectorData);
      setLoading(false);
    }
    load();
  }, []);

  const insights = useMemo(() => {
    const list: IntelligenceInsight[] = [];
    
    // 1. Sector Rotation Insight
    const sortedSectors = [...sectors].sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));
    const topSector = sortedSectors[0];
    if (topSector && parseFloat(topSector.percent) > 1.0) {
      list.push({
        what: `Capital rotation into ${topSector.name}.`,
        why: `Relative strength for ${topSector.name} is hitting multi-month highs on high-volume expansion.`,
        sector: topSector.name,
        confidence: 85,
        type: 'positive',
        icon: TrendingUp
      });
    }

    // 2. Institutional Flow Insight
    const isNetPositive = flows?.net.includes('+');
    list.push({
      what: isNetPositive ? "Institutional risk-on posture." : "Net institutional distribution.",
      why: isNetPositive 
        ? "FII net buying is offsetting DII profit-booking in large-cap indices." 
        : "FII selling has intensified near key structural resistance levels.",
      sector: "Large Cap",
      confidence: 90,
      type: isNetPositive ? 'positive' : 'negative',
      icon: Zap
    });

    // 3. Corporate Action Insight
    const recentDivs = actions.filter(a => a.type === 'Dividend');
    if (recentDivs.length > 2) {
      list.push({
        what: "Dividend yield expansion cycle.",
        why: "Corporate earnings are translating into higher payout ratios across defensive sectors.",
        sector: "Defensive",
        confidence: 70,
        type: 'positive',
        icon: Target
      });
    }

    return list;
  }, [sectors, flows, actions]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <BrainCircuit className="h-8 w-8" />
          <h2 className="font-headline text-3xl font-bold tracking-tight">Intelligence Hub</h2>
        </div>
        <p className="text-muted-foreground text-sm font-medium">Explainable market narratives synthesized from live structural data feeds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Insights Matrix */}
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 gap-6">
              {loading ? [1,2].map(i => <div key={i} className="h-44 bg-muted/20 animate-pulse rounded-[2.5rem]" />) : insights.map((insight, i) => (
                <Card key={i} className={cn(
                  "border-none overflow-hidden group rounded-[2.5rem] relative shadow-lg",
                  insight.type === 'positive' ? "bg-primary/5 shadow-primary/5" : "bg-destructive/5 shadow-destructive/5"
                )}>
                  <div className="p-10 flex flex-col md:flex-row gap-8">
                     <div className={cn(
                       "h-20 w-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner",
                       insight.type === 'positive' ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                     )}>
                        <insight.icon className="h-10 w-10" />
                     </div>
                     <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between">
                           <Badge className={cn(
                             "text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 border-none",
                             insight.type === 'positive' ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                           )}>
                             {insight.type} Signal
                           </Badge>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confidence</span>
                              <span className="text-lg font-bold font-headline">{insight.confidence}%</span>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <p className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{insight.what}</p>
                           <div className="flex gap-4 pt-2">
                              <div className="h-full w-1.5 bg-muted/20 rounded-full" />
                              <p className="text-base text-muted-foreground leading-relaxed italic">
                                "{insight.why}"
                              </p>
                           </div>
                        </div>
                        <div className="pt-6 flex items-center gap-3">
                           <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Target Sector:</span>
                           <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-muted/50 px-3 py-1">
                             {insight.sector}
                           </Badge>
                        </div>
                     </div>
                  </div>
                </Card>
              ))}
           </div>

           {/* Corporate Actions Feed */}
           <Card className="border-border/40 bg-card/40 overflow-hidden rounded-[2.5rem] shadow-2xl">
              <CardHeader className="pb-6 border-b border-border/10 bg-muted/5 px-8 pt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-xl font-bold">Announcements Terminal</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 border-primary/20 text-primary">Live Sync</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-40 flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Parsing Exchange Filings...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/10">
                    {actions.map((action) => (
                      <div key={action.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-primary/5 transition-all group">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-lg leading-none">{action.company}</span>
                            <Badge className="bg-muted text-muted-foreground text-[9px] font-bold uppercase border-none px-3 py-0.5 tracking-widest">{action.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-1">{action.description}</p>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right flex flex-col items-end gap-1">
                              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {action.date}</span>
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                action.impact === 'Positive' ? "text-primary" : "text-muted-foreground"
                              )}>{action.impact} Impact</span>
                           </div>
                           <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
           </Card>
        </div>

        {/* Sidebar Analytical Matrix */}
        <aside className="lg:col-span-4 space-y-8 sticky top-24">
           <Card className="border-border/40 bg-card/40 rounded-[2.5rem] shadow-xl overflow-hidden">
              <CardHeader className="pb-4 border-b border-border/10 bg-primary/5 px-8 pt-8">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                  <Activity className="h-4 w-4" /> Institutional Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                 <div className="space-y-4">
                    <p className="text-sm font-medium leading-relaxed italic text-muted-foreground p-6 rounded-2xl bg-muted/20 border border-border/10">
                      "Sentiment is stabilizing as capital rotates from high-growth tech into defensive manufacturing themes following domestic volume confirmation."
                    </p>
                    <Separator className="bg-border/10" />
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">FII Activity</span>
                          <span className="font-bold text-primary font-headline">{flows?.fii}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">DII Activity</span>
                          <span className="font-bold text-primary font-headline">{flows?.dii}</span>
                       </div>
                       <div className="pt-4 border-t border-border/10">
                          <div className="flex justify-between items-center">
                            <span className="font-bold uppercase tracking-[0.2em] text-[10px] text-foreground">Net Structural Flow</span>
                            <span className="font-bold text-primary text-2xl font-headline tabular-nums">{flows?.net}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="p-10 rounded-[2.5rem] bg-accent/5 border border-accent/10 relative overflow-hidden group shadow-lg">
              <div className="absolute -right-12 -top-12 h-32 w-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
              <div className="relative z-10 space-y-5">
                 <div className="flex items-center gap-2 text-accent">
                    <ShieldCheck className="h-6 w-6" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Analyst Synthesis</span>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
                   "Capitalizing on volume confirmation across the MIDCAP index. Risk protocols advised as structural resistance levels are tested near the 52W High."
                 </p>
              </div>
           </div>

           <Card className="border-border/40 bg-card/40 rounded-[2.5rem] shadow-xl">
              <CardHeader className="pb-4 px-8 pt-8">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-accent">
                  <Sparkles className="h-4 w-4" /> Alpha Watchlist
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-3">
                 {['Data Center Infra', 'Clean Energy Grid', 'Circular Economy'].map(theme => (
                    <div key={theme} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10 hover:bg-accent/10 transition-all cursor-pointer group">
                       <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{theme}</span>
                       <Badge variant="outline" className="text-[8px] font-bold uppercase border-accent/20 text-accent px-2 py-0">High Growth</Badge>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}
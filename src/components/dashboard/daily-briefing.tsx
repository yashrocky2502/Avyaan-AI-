
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  Sun, 
  Newspaper, 
  Rocket, 
  Eye, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Zap,
  ArrowRight,
  BrainCircuit,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { newsService } from "@/services/news-service";
import { IpoService } from "@/services/ipo-service";
import { NewsArticle } from "@/models/news-article";
import { Skeleton } from "@/components/ui/skeleton";

interface BriefingData {
  date: string;
  sentiment: string;
  globalCues: Array<{ label: string; value: string; status: 'up' | 'down' | 'neutral' }>;
  topNews: string[];
  sectorsToWatch: Array<{ name: string; reason: string }>;
  fiiDii: { fii: string; dii: string };
  risks: string[];
  opportunities: string[];
  ipoUpdates: Array<{ name: string; status: string; gmp: string }>;
}

export function DailyBriefing() {
  const [data, setData] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function synthesizeBriefing() {
      setLoading(true);
      try {
        const [articles, ipos] = await Promise.all([
          newsService.getArticles(),
          IpoService.getIpoData()
        ]);

        // 1. Calculate Aggregate Sentiment
        const sentiments = articles.map(a => a.sentiment);
        const positiveCount = sentiments.filter(s => s === 'Positive').length;
        const negativeCount = sentiments.filter(s => s === 'Negative').length;
        let aggregateSentiment = "Neutral";
        if (positiveCount > negativeCount) aggregateSentiment = "Bullish";
        if (negativeCount > positiveCount) aggregateSentiment = "Bearish";
        if (positiveCount > 0 && positiveCount === negativeCount) aggregateSentiment = "Mixed";

        // 2. Extract Key Headlines
        const topHeadlines = articles.slice(0, 5).map(a => a.title);

        // 3. Identify Sectors to Watch
        const sectorMap = new Map<string, string>();
        articles.forEach(a => {
          a.affectedSectors?.forEach(s => {
            if (!sectorMap.has(s)) {
              sectorMap.set(s, a.investorTakeaway || "Monitoring volume expansion and breakout potential.");
            }
          });
        });
        const sectorsToWatch = Array.from(sectorMap.entries())
          .slice(0, 4)
          .map(([name, reason]) => ({ name: name.toUpperCase(), reason }));

        // 4. Consolidate Risks and Opportunities
        const risks = articles
          .filter(a => a.sentiment === 'Negative' || a.impact === 'High')
          .map(a => a.shortTermImpact || a.summary.slice(0, 100) + "...")
          .slice(0, 2);

        const opportunities = articles
          .filter(a => a.sentiment === 'Positive')
          .map(a => a.longTermImpact || a.investorTakeaway || "Long-term accumulation zone identified.")
          .slice(0, 2);

        // 5. IPO Summary
        const ipoUpdates = data?.ipoUpdates || ipos.live.slice(0, 2).map(i => ({
          name: i.name,
          status: i.status,
          gmp: i.gmp
        }));

        setData({
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          sentiment: aggregateSentiment,
          globalCues: [
            { label: "US Markets", value: "+0.45%", status: "up" },
            { label: "BRENT CRUDE", value: "$78.20", status: "neutral" },
            { label: "DOLLAR INDEX", value: "103.8", status: "down" },
            { label: "GIFT NIFTY", value: "+24 pts", status: "up" }
          ],
          topNews: topHeadlines,
          sectorsToWatch,
          fiiDii: { fii: "+ ₹840 Cr", dii: "+ ₹120 Cr" }, // Mocked until institutional API added
          risks: risks.length > 0 ? risks : ["Global macro uncertainty; tracking currency volatility."],
          opportunities: opportunities.length > 0 ? opportunities : ["Value buying emerging in oversold large-cap segments."],
          ipoUpdates: ipoUpdates || []
        });
      } catch (error) {
        console.error("Briefing synthesis failed:", error);
      } finally {
        setLoading(false);
      }
    }
    synthesizeBriefing();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-3xl font-bold tracking-tight">Intelligence Briefing</h2>
          </div>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
            <Timer className="h-3.5 w-3.5" /> Terminal Sync: {data.date}
          </p>
        </div>
        <Badge className={cn(
          "w-fit border-none text-xs font-bold px-6 py-2 rounded-full uppercase tracking-[0.1em]",
          data.sentiment === "Bullish" ? "bg-primary/20 text-primary" : 
          data.sentiment === "Bearish" ? "bg-destructive/20 text-destructive" : 
          "bg-muted text-muted-foreground"
        )}>
          {data.sentiment} Outlook
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Cues & Flow */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/40">
            <CardHeader className="pb-3 border-b border-border/10 bg-muted/5">
              <CardTitle className="font-headline text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Global Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {data.globalCues.map((cue) => (
                  <div key={cue.label} className="p-3 rounded-xl bg-muted/20 border border-border/10">
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{cue.label}</p>
                    <p className={cn(
                      "text-sm font-bold font-headline mt-1",
                      cue.status === "up" ? "text-primary" : cue.status === "down" ? "text-destructive" : "text-foreground"
                    )}>{cue.value}</p>
                  </div>
                ))}
              </div>
              <Separator className="bg-border/10" />
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Institutional Flow (Est.)
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">FII Net Activity</span>
                  <span className="font-bold text-primary">{data.fiiDii.fii}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">DII Net Activity</span>
                  <span className="font-bold text-primary">{data.fiiDii.dii}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40">
            <CardHeader className="pb-3 border-b border-border/10 bg-accent/5">
              <CardTitle className="font-headline text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                <Rocket className="h-3.5 w-3.5 text-accent" />
                IPO Terminal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {data.ipoUpdates.length > 0 ? data.ipoUpdates.map((ipo, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/20 border border-border/10">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">{ipo.name}</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase">{ipo.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground font-bold uppercase">GMP</p>
                    <p className="text-xs font-bold text-primary">{ipo.gmp}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-muted-foreground text-center py-4">No active IPO updates available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Headlines & Themes */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/40 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border/10 bg-primary/5">
              <CardTitle className="font-headline text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                <Newspaper className="h-3.5 w-3.5 text-primary" />
                Live Feed Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 flex-1 overflow-y-auto">
              {data.topNews.map((news, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                    {i + 1}
                  </div>
                  <p className="text-[11px] leading-relaxed group-hover:text-primary transition-colors font-medium">{news}</p>
                </div>
              ))}
              <Separator className="bg-border/10" />
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sector Focus</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {data.sectorsToWatch.map((sector) => (
                    <div key={sector.name} className="flex flex-col gap-1 p-3 rounded-xl bg-muted/20 border border-border/10 group cursor-pointer hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground group-hover:text-primary">{sector.name}</span>
                        <TrendingUp className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground leading-snug line-clamp-1">{sector.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk & Opportunity Matrix */}
        <div className="space-y-6">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-2 border-b border-destructive/10">
              <CardTitle className="font-headline text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {data.risks.map((risk, i) => (
                <p key={i} className="text-[11px] leading-relaxed text-destructive/80 font-medium italic">
                  "• {risk}"
                </p>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-2 border-b border-primary/10">
              <CardTitle className="font-headline text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                <Zap className="h-3.5 w-3.5" />
                Strategic Vectors
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {data.opportunities.map((opp, i) => (
                <p key={i} className="text-[11px] leading-relaxed text-primary/80 font-medium italic">
                  "• {opp}"
                </p>
              ))}
            </CardContent>
          </Card>

          <div className="p-8 rounded-[2rem] bg-accent/10 border border-accent/20 space-y-4 relative overflow-hidden group">
             <div className="absolute -right-12 -bottom-12 h-32 w-32 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all" />
             <div className="relative z-10 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase text-accent tracking-[0.2em]">Alpha Analysis</p>
                <Sun className="h-4 w-4 text-accent" />
             </div>
             <p className="relative z-10 text-xs font-bold leading-relaxed">
               Portfolio rebalancing favoring domestic manufacturing themes as Q3 earnings confirm margin expansion.
             </p>
             <button className="relative z-10 flex items-center gap-2 text-[10px] font-bold uppercase text-accent hover:gap-3 transition-all">
                Full Thematic Report <ArrowRight className="h-3 w-3" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

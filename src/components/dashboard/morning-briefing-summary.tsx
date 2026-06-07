"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, BrainCircuit, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { newsService } from "@/services/news-service";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MorningBriefingSummary() {
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState("Neutral");

  useEffect(() => {
    async function load() {
      const articles = await newsService.getArticles();
      const sentiments = articles.map(a => a.sentiment);
      const pos = sentiments.filter(s => s === 'Positive').length;
      const neg = sentiments.filter(s => s === 'Negative').length;
      if (pos > neg) setSentiment("Bullish");
      else if (neg > pos) setSentiment("Bearish");
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Skeleton className="h-[200px] w-full rounded-2xl" />;

  return (
    <Card className="border-border/40 bg-card/40 flex flex-col justify-between overflow-hidden relative group">
      <div className="absolute -right-8 -top-8 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-orange-500" />
            <CardTitle className="font-headline text-lg font-bold">Morning Briefing</CardTitle>
          </div>
          <Link href="/briefing">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10"><ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          "Institutional liquidity remains robust. Focus on dynamic sector rotation as markets absorb global cues and inflation prints."
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">RELIANCE</Badge>
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">HDFC BANK</Badge>
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">AUTO SECTOR</Badge>
        </div>
        <div className="pt-4 border-t border-border/10 flex items-center justify-between">
          <Badge className={cn(
            "text-[9px] font-bold uppercase tracking-wider px-3",
            sentiment === "Bullish" ? "bg-primary/20 text-primary border-none" : "bg-muted text-muted-foreground border-none"
          )}>
            Outlook: {sentiment}
          </Badge>
          <Link href="/briefing" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
            Open Terminal <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

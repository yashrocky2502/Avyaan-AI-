
'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Clock, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  MessageSquare, 
  ExternalLink,
  Target,
  Zap,
  ShieldCheck,
  Lightbulb,
  Layers,
  BarChart3,
  Timer
} from "lucide-react";
import { newsService } from "@/services/news-service";
import { NewsArticle } from "@/models/news-article";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;
      setLoading(true);
      const data = await newsService.getArticleById(Number(id));
      setArticle(data || null);
      setLoading(false);
    }
    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-10 w-24" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <h2 className="text-2xl font-headline font-bold mb-4">Article Not Found</h2>
        <Button onClick={() => router.push('/news')} className="rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-xs">Back to News Feed</Button>
      </div>
    );
  }

  const saved = isBookmarked(article.id as number);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Article Utility Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-4 hidden sm:flex">
            <Timer className="h-3.5 w-3.5" />
            <span>{Math.ceil(article.content.split(' ').length / 200)} Min Read</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className={cn("h-10 w-10 rounded-full", saved && "text-primary border-primary/20 bg-primary/10")}
            onClick={() => toggleBookmark(article as any)}
          >
            <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary bg-primary/5 uppercase tracking-widest px-3 py-1">
                {article.category}
              </Badge>
              <div className="h-4 w-[1px] bg-border/40" />
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                <span className="text-primary">{article.source}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.time}
                </div>
              </div>
            </div>

            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
              {article.title}
            </h1>

            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-border/40 shadow-2xl group">
              <img 
                src={article.image} 
                alt={article.title}
                className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase backdrop-blur-md px-4 py-1 border-none tracking-widest",
                      article.impact === "High" ? "bg-destructive text-white" : "bg-orange-500 text-white"
                    )}>
                      {article.impact} Impact
                    </Badge>
                 </div>
                 <Badge className={cn(
                    "text-[10px] font-bold uppercase backdrop-blur-md px-4 py-1 border-none tracking-widest",
                    article.sentiment === "Positive" ? "bg-primary/80 text-white" : 
                    article.sentiment === "Negative" ? "bg-destructive/80 text-white" : 
                    "bg-muted/80 text-white"
                 )}>
                    {article.sentiment} Sentiment
                 </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="relative p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 overflow-hidden">
              <div className="absolute -right-12 -top-12 h-32 w-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-[11px] font-bold uppercase text-primary tracking-[0.2em]">Executive Synthesis</span>
                </div>
                <p className="text-2xl leading-relaxed text-foreground/90 font-medium italic">
                  "{article.summary}"
                </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-xl leading-relaxed text-muted-foreground whitespace-pre-line font-medium">
                {article.content}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-card/40 border border-border/40 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="h-5 w-5" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Short-Term Catalyst</h4>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {article.shortTermImpact || "Monitoring immediate market volatility and sector-specific liquidity adjustments."}
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-card/40 border border-border/40 space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Target className="h-5 w-5" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Long-Term Narrative</h4>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {article.longTermImpact || "Evaluating structural shifts in sector fundamentals and long-term capital allocation strategies."}
                </p>
              </div>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-muted/20 border border-border/40 space-y-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h3 className="font-headline text-2xl font-bold">Why This Matters</h3>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground font-medium">
                {article.whyMatters}
              </p>
            </div>
          </div>
        </div>

        {/* Analytical Sidebar */}
        <aside className="lg:col-span-4 space-y-8 sticky top-24">
          <Card className="border-border/40 bg-card/40 overflow-hidden rounded-[2.5rem] shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Impact Score</h4>
                  </div>
                  <span className="text-lg font-bold text-primary font-headline">{article.impactScore || 0}/10</span>
                </div>
                <Progress value={(article.impactScore || 0) * 10} className="h-2 rounded-full" />
              </div>

              <Separator className="bg-border/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Affected Sectors</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(article.affectedSectors || []).map(sector => (
                    <Badge key={sector} variant="secondary" className="text-[10px] font-bold bg-primary/10 text-primary border-none px-3 py-1 uppercase tracking-tighter">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Investor Takeaway</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic font-medium p-5 bg-primary/5 rounded-2xl border border-primary/10">
                  "{article.investorTakeaway || "Consult with your institutional financial advisor before making any allocation changes."}"
                </p>
              </div>

              <Button variant="outline" className="w-full text-xs font-bold gap-2 py-6 rounded-2xl border-primary/20 text-primary hover:bg-primary/5">
                Full Research Report <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 h-20 w-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-bold uppercase text-primary tracking-[0.2em]">Verified Insight</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic font-medium">
              This intelligence synthesis is verified from regulatory filings and exchange disclosures.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

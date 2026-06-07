
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ChevronRight, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { newsService } from "@/services/news-service";
import { NewsArticle } from "@/models/news-article";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TopNewsWidget() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await newsService.getArticles();
      setNews(data.slice(0, 4));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <Card className="border-border/40 bg-card/40 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 bg-muted/5 py-4 px-6">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <CardTitle className="font-headline text-base font-bold uppercase tracking-wider">Top News Stream</CardTitle>
        </div>
        <Link href="/news" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
          View All <ChevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex items-center justify-between p-4 hover:bg-primary/5 transition-all group">
                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    <span className="text-primary">{item.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}</span>
                  </div>
                  <h4 className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-bold px-2 py-0.5 border-none",
                    item.impact === 'High' ? "bg-destructive/20 text-destructive" : "bg-orange-500/20 text-orange-500"
                  )}>
                    {item.impact}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

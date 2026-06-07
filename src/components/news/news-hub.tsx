"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bookmark, Share2, Clock, ChevronRight, Inbox, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { newsService } from "@/services/news-service";
import { NewsArticle } from "@/models/news-article";

const categories = ["All", "Equity", "Economy", "Tech", "IPO", "Commodities", "Currencies"];

export function NewsHub() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const { toggleBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true);
      const data = await newsService.getArticlesByCategory(activeCategory);
      setArticles(data);
      setIsLoading(false);
    }
    loadNews();
  }, [activeCategory]);

  const filteredNews = articles.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-8">
        <div className="relative max-w-2xl group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search terminal headlines, stocks, or sectors..." 
            className="pl-11 h-12 bg-card/40 border-border/40 focus:ring-primary/20 rounded-2xl text-base" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={cn(
                "px-6 py-2.5 rounded-full text-[11px] font-bold transition-all border uppercase tracking-widest shadow-sm",
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                  : "bg-card/40 text-muted-foreground border-border/40 hover:bg-muted/50"
              )}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="flex flex-col sm:flex-row h-60 overflow-hidden border-border/40 bg-card/40 rounded-[2.5rem]">
              <Skeleton className="w-full sm:w-56 h-56 sm:h-full rounded-none" />
              <div className="p-8 flex-1 space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between mt-auto">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-12 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredNews.map((news) => {
            const saved = isBookmarked(news.id as number);
            return (
              <Card key={news.id} className="group overflow-hidden border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5 rounded-[2.5rem] shadow-lg">
                <div className="flex flex-col sm:flex-row h-full">
                  <Link href={`/news/${news.id}`} className="relative w-full sm:w-56 h-56 sm:h-auto shrink-0 overflow-hidden cursor-pointer border-r border-border/10">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       <Badge className={cn(
                         "text-[9px] font-bold border-none uppercase tracking-widest px-3 py-1 shadow-xl",
                         news.impact === "High" ? "bg-destructive text-white" : "bg-orange-500 text-white"
                       )}>
                         {news.impact} Impact
                       </Badge>
                       <Badge className="text-[9px] font-bold border-none uppercase tracking-widest px-3 py-1 bg-black/60 backdrop-blur-md shadow-xl">
                         {news.sentiment}
                       </Badge>
                    </div>
                  </Link>
                  <div className="flex flex-col flex-1 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        <span className="text-primary">{news.source}</span>
                        <span className="opacity-30">•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {news.time}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] px-2.5 py-0.5 border-primary/20 text-primary bg-primary/5 uppercase font-bold tracking-widest">
                        {news.category}
                      </Badge>
                    </div>
                    <Link href={`/news/${news.id}`} className="block group mb-4">
                      <h3 className="font-headline text-xl font-bold line-clamp-2 leading-[1.2] group-hover:text-primary transition-colors">
                        {news.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed font-medium">
                      {news.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <Link href={`/news/${news.id}`}>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs font-bold gap-2 group/btn uppercase tracking-widest">
                          Deep Intelligence <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn("h-10 w-10 rounded-full shadow-sm", saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/50")}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleBookmark(news as any);
                          }}
                        >
                          <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center space-y-8">
          <div className="h-28 w-28 rounded-[2.5rem] bg-muted/20 flex items-center justify-center rotate-12 shadow-inner">
            <Inbox className="h-14 w-14 text-muted-foreground -rotate-12" />
          </div>
          <div className="space-y-3">
            <p className="text-3xl font-bold font-headline tracking-tight">Zero matching signals</p>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">Try broadening your filter criteria or checking the "All" category for synthesized global news.</p>
          </div>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="rounded-full px-12 h-14 font-bold text-xs uppercase tracking-widest shadow-xl">
            Reset News Feed
          </Button>
        </div>
      )}
    </div>
  );
}
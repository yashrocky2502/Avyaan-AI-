"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Activity, 
  Sun, 
  Rocket,
  Command
} from "lucide-react";
import { Modal } from "@/components/ui/core-system";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { newsService } from "@/services/news-service";
import { IpoService } from "@/services/ipo-service";
import { NewsArticle } from "@/models/news-article";

export function GlobalSearch({ open, onClose }: { open: boolean, onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    news: NewsArticle[];
    ipos: any[];
    other: any[];
  }>({ news: [], ipos: [], other: [] });

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({ news: [], ipos: [], other: [] });
      return;
    }

    const term = q.toLowerCase();
    
    // Search News
    const news = await newsService.getArticles();
    const filteredNews = news.filter(n => 
      n.title.toLowerCase().includes(term) || 
      n.category.toLowerCase().includes(term)
    ).slice(0, 5);

    // Search IPOs
    const ipoData = await IpoService.getIpoData();
    const allIpos = [...ipoData.live, ...ipoData.upcoming, ...ipoData.listed];
    const filteredIpos = allIpos.filter(i => 
      i.name.toLowerCase().includes(term)
    ).slice(0, 3);

    // Search Briefing & Changes (Mock Search)
    const other = [
      { id: 'b1', title: 'Morning Briefing', href: '/briefing', type: 'Briefing', icon: Sun },
      { id: 'c1', title: 'Market Scanner', href: '/changes', type: 'Scanner', icon: Activity },
    ].filter(i => i.title.toLowerCase().includes(term));

    setResults({ news: filteredNews, ipos: filteredIpos, other });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => performSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
    setQuery("");
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Global Terminal Search" className="max-w-2xl">
      <div className="p-4 border-b border-border/10 flex items-center gap-3 bg-muted/5">
        <Search className="h-5 w-5 text-primary" />
        <Input 
          placeholder="Search stocks, news, IPOs..."
          className="border-none focus-visible:ring-0 text-lg bg-transparent p-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 text-[10px] font-bold text-muted-foreground">
          <Command className="h-3 w-3" /> <span>K</span>
        </div>
      </div>
      
      <ScrollArea className="max-h-[60vh]">
        <div className="p-4 space-y-6">
          {!query && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Search className="h-10 w-10 mb-2" />
              <p className="text-sm font-bold uppercase tracking-widest">Awaiting terminal query...</p>
            </div>
          )}

          {results.other.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Navigation</p>
              {results.other.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-primary/10 transition-colors text-left group"
                >
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/20">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold">{item.title}</span>
                </button>
              ))}
            </div>
          )}

          {results.news.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Market News</p>
              {results.news.map(article => (
                <button
                  key={article.id}
                  onClick={() => handleSelect(`/news/${article.id}`)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-primary/10 transition-colors text-left group"
                >
                  <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0">
                    <img src={article.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold truncate">{article.title}</span>
                    <span className="text-[10px] text-muted-foreground">{article.source} • {article.time}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.ipos.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">IPOs</p>
              {results.ipos.map(ipo => (
                <button
                  key={ipo.id}
                  onClick={() => handleSelect('/ipo')}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-primary/10 transition-colors text-left group"
                >
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Rocket className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{ipo.name}</span>
                    <span className="text-[10px] text-muted-foreground">{ipo.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {query && results.news.length === 0 && results.ipos.length === 0 && results.other.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-[10px] font-bold uppercase tracking-widest">No matching terminal nodes found for "{query}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Modal>
  );
}

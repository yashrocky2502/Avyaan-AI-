
'use client';

import { NewsHub } from "@/components/news/news-hub";
import { Newspaper } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">Intelligence Stream</h2>
            <p className="text-muted-foreground text-sm font-medium">Aggregated global news and sector-specific financial synthesis.</p>
          </div>
        </div>
      </div>
      <NewsHub />
    </div>
  );
}

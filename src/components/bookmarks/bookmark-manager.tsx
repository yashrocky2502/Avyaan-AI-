
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, BookmarkX, Clock, ChevronRight, Inbox, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";

export function BookmarkManager() {
  const { bookmarks, removeBookmark, isInitialized } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = bookmarks.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isInitialized) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your saved articles..." 
            className="pl-9 bg-card/40 border-border/40 h-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookmarks.map((news) => (
            <Card key={news.id} className="group overflow-hidden border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-300">
              <div className="flex flex-col sm:flex-row h-full">
                <Link href={`/news/${news.id}`} className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden cursor-pointer">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                      <span>{news.source}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {news.time}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/20 text-primary bg-primary/5 uppercase font-bold">
                      {news.category}
                    </Badge>
                  </div>
                  <Link href={`/news/${news.id}`}>
                    <h3 className="font-headline text-base font-bold mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {news.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <Link href={`/news/${news.id}`}>
                      <Button variant="link" size="sm" className="p-0 h-auto text-primary text-xs font-bold gap-1">
                        Read Story <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Link>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => removeBookmark(news.id)}
                      title="Remove Bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
            <BookmarkX className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="text-xl font-bold font-headline">No bookmarks found</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {searchQuery 
                ? "We couldn't find anything matching your search query in your bookmarks." 
                : "You haven't saved any articles yet. Bookmark news to read them later."}
            </p>
          </div>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

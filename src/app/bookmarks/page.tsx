
'use client';

import { BookmarkManager } from "@/components/bookmarks/bookmark-manager";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h2 className="font-headline text-2xl font-bold tracking-tight">Your Bookmarks</h2>
        </div>
        <p className="text-muted-foreground text-sm">Access your curated list of saved financial insights.</p>
      </div>
      <BookmarkManager />
    </div>
  );
}

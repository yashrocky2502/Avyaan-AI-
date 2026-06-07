
"use client";

import { useState, useEffect, useCallback } from "react";

export interface BookmarkedArticle {
  id: number;
  title: string;
  category: string;
  source: string;
  time: string;
  image: string;
  summary: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("marketpulse_bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync to localStorage whenever bookmarks change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("marketpulse_bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks, isInitialized]);

  const toggleBookmark = useCallback((article: BookmarkedArticle) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.id === article.id);
      if (exists) {
        return prev.filter((b) => b.id !== article.id);
      }
      return [article, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const isBookmarked = useCallback((id: number) => {
    return bookmarks.some((b) => b.id === id);
  }, [bookmarks]);

  return {
    bookmarks,
    toggleBookmark,
    removeBookmark,
    isBookmarked,
    isInitialized
  };
}

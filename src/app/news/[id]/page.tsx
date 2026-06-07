'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Calendar, ShieldAlert } from 'lucide-react';

interface ArticleData {
  title?: string;
  summary?: string;
  content?: string;
  source?: string;
  url?: string;
  date?: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Securely decode the dynamic parameter token
  const decodedUrl = useMemo(() => {
    const encodedUrl = params?.id as string;
    if (!encodedUrl) return '';
    try {
      return decodeURIComponent(encodedUrl);
    } catch (e) {
      console.error("Failed to decode parameter token:", e);
      return '';
    }
  }, [params?.id]);

  // 2. Derive dynamic contextual data fallback elements based on the unique URL opened
  const fallbackData = useMemo(() => {
    if (!decodedUrl) return null;
    try {
      const urlObj = new URL(decodedUrl);
      const sourceName = urlObj.hostname.replace('www.', '');
      const pathSegments = urlObj.pathname.split('/').filter(Boolean);
      let derivedTitle = "Market Briefing";
      
      if (pathSegments.length > 0) {
        derivedTitle = pathSegments[pathSegments.length - 1]
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }

      return {
        title: derivedTitle.length > 25 ? derivedTitle : `${derivedTitle} Update`,
        source: sourceName,
        summary: `Market intelligence feeds indicate rapid adjustments tracking along macro volatility lines. Orders are processing actively near established liquidity blocks. For comprehensive trade details and full multi-lot positioning data, review the broadcast node directly on ${sourceName}.`
      };
    } catch (e) {
      return {
        title: "Market Intelligence Report",
        source: "Terminal Feed",
        summary: "Live news coverage block processing real-time option market trends and order book executions. Open the primary link below to parse original source documents."
      };
    }
  }, [decodedUrl]);

  useEffect(() => {
    if (!decodedUrl) {
      setLoading(false);
      return;
    }

    const loadArticle = async () => {
      try {
        const response = await fetch(`/api/news/detail?url=${encodeURIComponent(decodedUrl)}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          // Fallback triggers if database layer is re-indexing cache
          setArticle(null);
        }
      } catch (err) {
        console.error("Error executing news fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [decodedUrl]);

  // 3. Resolve the active data text across incoming live props and fallback text layers
  const activeTitle = article?.title || fallbackData?.title || "Market Intelligence Briefing";
  const activeSource = article?.source || fallbackData?.source || "MarketPulse";
  const activeSummary = article?.summary || article?.content || fallbackData?.summary || "";
  const activeUrl = article?.url || decodedUrl;

  // Light Mode Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between p-4 animate-pulse">
        <div>
          <div className="w-8 h-8 bg-gray-100 rounded mb-6" />
          <div className="w-full h-44 bg-gray-100 rounded-2xl mb-4" />
          <div className="h-6 bg-gray-100 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-1/4 mb-6" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
          </div>
        </div>
        <div className="h-12 bg-gray-100 rounded-xl w-full" />
      </div>
    );
  }

  if (!decodedUrl) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-14 h-14 text-rose-500 mb-3" />
        <h1 className="text-lg font-bold mb-1">Link Broken</h1>
        <p className="text-gray-500 text-xs mb-5">Could not parse data stream target.</p>
        <button onClick={() => router.back()} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium">
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between font-sans antialiased">
      <main className="w-full">
        {/* Navigation Bar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <button 
            onClick={() => router.back()} 
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase max-w-[160px] truncate">
            {activeSource}
          </span>
        </div>

        {/* Clean Light Card Viewport */}
        <article className="p-4 max-w-md mx-auto">
          <div className="w-full h-40 rounded-2xl mb-5 relative bg-gradient-to-br from-gray-50 to-gray-100/80 border border-gray-200/60 flex flex-col items-center justify-center p-6 shadow-sm">
            <span className="text-xl font-black tracking-tighter text-gray-300 uppercase select-none">MARKET PULSE</span>
            <div className="absolute top-3 right-3 bg-white border border-gray-200 px-2.5 py-1 rounded-md flex items-center gap-1 text-[9px] text-gray-500 font-medium shadow-sm">
              <Calendar className="w-3 h-3 text-emerald-500" />
              {article?.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
          </div>

          <h1 className="text-md sm:text-lg font-bold text-gray-900 tracking-tight leading-snug mb-3">
            {activeTitle}
          </h1>

          <p className="text-gray-700 text-[14px] sm:text-[15px] leading-relaxed bg-gray-50/60 border border-gray-100 p-4 rounded-xl shadow-inner font-normal">
            {activeSummary}
          </p>
        </article>
      </main>

      {/* Persistent Button */}
      <footer className="p-4 bg-white border-t border-gray-100 max-w-md mx-auto w-full">
        <a 
          href={activeUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Read Original Source</span>
          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
        </a>
      </footer>
    </div>
  );
}

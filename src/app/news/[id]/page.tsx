"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, LayoutGrid } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NewsDetailCard({ params }: PageProps) {
  // Asynchronously unpack dynamic route parameters for Next.js 15
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;
  const decodedTitle = decodeURIComponent(rawId).replace(/-/g, " ");

  // Fallback fallback news summary strictly capped under 60 words for rapid consumption
  const fallbackSummary = "Market Intelligence Report: Trading volume across major digital asset derivatives saw a sharp 14% correction in early hours. Volatility clusters formed near historical psychological support zones, forcing automated trend-following systems into tight consolidation patterns. Key liquidity aggregates remain highly concentrated near the weekly opening range.";

  // Hardcoded fallback source link for the bottom sticky CTA
  const sourceUrl = "https://www.moneycontrol.com"; 

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-between font-sans antialiased selection:bg-blue-100">
      
      {/* 1. Header Navigation */}
      <header className="w-full max-w-md bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <Link 
          href="/news" 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Feed</span>
        </Link>
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>MarketPulse</span>
        </div>
      </header>

      {/* 2. Rapid Consumption Main Viewport Wrapper */}
      <main className="w-full max-w-md flex-1 flex flex-col bg-white overflow-hidden shadow-inner pb-24">
        
        {/* Mobile-First Structured Image Placeholder Layout */}
        <div className="w-full aspect-[16/10] bg-slate-100 relative flex flex-col items-center justify-center border-b border-slate-100 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50" />
          <div className="relative z-10 flex flex-col items-center gap-3 p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Coverage</p>
          </div>
          {/* Decorative ambient subtle lines to elevate placeholder design aesthetics */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
        </div>

        {/* Content Section Padding Configured for Tight Viewport Real Estate */}
        <div className="p-5 flex-1 flex flex-col justify-start">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight mb-3.5 first-letter:capitalize">
            {decodedTitle || "Market Intelligence Report"}
          </h1>
          
          <div className="w-8 h-[3px] bg-blue-600 rounded-full mb-4" />
          
          {/* Rapid consumption summary viewport container */}
          <p className="text-[15px] leading-relaxed text-slate-600 font-normal tracking-normal text-justify">
            {fallbackSummary}
          </p>
        </div>
      </main>

      {/* 3. High-Contrast Bottom Sticky CTA Panel */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-center z-50 shadow-[0_-4px_20px_rgba(15,23,42,0.04)]">
        <div className="w-full max-w-md">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] transform"
          >
            <span>Read full story at source</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </footer>

    </div>
  );
}

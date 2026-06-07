
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  Rocket, 
  Bookmark, 
  Search, 
  Bell, 
  Settings,
  Activity,
  BrainCircuit,
  BarChart4,
  Briefcase,
  Sun,
  ChevronRight,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  Clock,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { GlobalSearch } from "./global-search";
import { Toaster } from "@/components/ui/toaster";
import { usePriceStream } from "@/hooks/use-price-stream";

// Views (Persistent Components)
import { DailyMarketStory } from "@/components/dashboard/daily-market-story";
import { MarketOverview } from "@/components/dashboard/market-overview";
import { SentimentPulse } from "@/components/dashboard/sentiment-pulse";
import { MorningBriefingSummary } from "@/components/dashboard/morning-briefing-summary";
import { TopNewsWidget } from "@/components/dashboard/top-news-widget";
import { ActiveIpoWidget } from "@/components/dashboard/active-ipo-widget";
import { MarketIntelligenceHighlights } from "@/components/dashboard/market-intelligence-highlights";
import { SectorLeadersWidget } from "@/components/dashboard/sector-leaders-widget";

import { NewsHub } from "@/components/news/news-hub";
import { IpoExplorer } from "@/components/ipo/ipo-explorer";
import { MarketChanges } from "@/components/dashboard/market-changes";
import { MarketIntelligenceHub } from "@/components/intelligence/market-intelligence-hub";
import { ResearchHub } from "@/components/research/research-hub";
import { PortfolioManager } from "@/components/portfolio/portfolio-manager";
import { BookmarkManager } from "@/components/bookmarks/bookmark-manager";
import { SettingsManager } from "@/components/settings/settings-manager";
import { DailyBriefing } from "@/components/dashboard/daily-briefing";

const navItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "briefing", name: "Morning Briefing", icon: Sun },
  { id: "news", name: "Market News", icon: Newspaper },
  { id: "ipo", name: "IPO Explorer", icon: Rocket },
  { id: "scanner", name: "Market Scanner", icon: Activity },
  { id: "intelligence", name: "Intelligence Hub", icon: BrainCircuit },
  { id: "research", name: "Research Hub", icon: BarChart4 },
  { id: "portfolio", name: "Portfolio", icon: Briefcase },
  { id: "bookmarks", name: "Bookmarks", icon: Bookmark },
];

const secondaryItems = [
  { id: "settings", name: "Settings", icon: Settings },
];

function MarketContextBar() {
  const { quotes } = usePriceStream(['^NSEI']);
  const nifty = quotes['^NSEI'];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!nifty || !mounted) return <div className="h-10 w-full bg-sidebar border-b border-sidebar-border" />;

  return (
    <div className="h-10 w-full bg-sidebar border-b border-sidebar-border flex items-center px-4 overflow-x-auto scrollbar-hide shrink-0 z-50">
      <div className="flex items-center gap-6 whitespace-nowrap min-w-max mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">NIFTY 50</span>
          <span className="text-xs font-bold font-headline">{nifty.price.toLocaleString('en-IN')}</span>
          <span className={cn(
            "text-[10px] font-bold flex items-center",
            nifty.trend === 'up' ? "text-primary" : "text-destructive"
          )}>
            {nifty.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {nifty.changePercent.toFixed(2)}%
          </span>
        </div>
        <div className="h-3 w-px bg-sidebar-border" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Terminal Feed</span>
          <div className="flex items-center gap-1">
             <Database className="h-2.5 w-2.5 text-primary" />
             <span className="text-[10px] font-bold text-primary uppercase">{nifty.source}</span>
          </div>
        </div>
        <div className="h-3 w-px bg-sidebar-border" />
        <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/60 uppercase">
          <Clock className="h-3 w-3" />
          <span>Sync: {new Date(nifty.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}

const ModuleView = React.memo(({ active, children }: { active: boolean, children: React.ReactNode }) => (
  <div className={cn("w-full h-full", !active && "hidden")}>
    {children}
  </div>
));
ModuleView.displayName = "ModuleView";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Environment detection: Check for valid Telegram initData
    // @ts-ignore
    if (typeof window !== 'undefined' && window.Telegram?.WebApp && window.Telegram.WebApp.initData !== "") {
      setIsTelegram(true);
      // @ts-ignore
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Explicitly disable vertical swipe gestures that freeze standard webview scrolling
      if (tg.isVersionAtLeast && tg.isVersionAtLeast('7.7')) {
        tg.disableVerticalSwipes();
      }
    }
  }, []);

  useEffect(() => {
    const path = pathname.split('/')[1] || "dashboard";
    if (navItems.find(i => i.id === path) || secondaryItems.find(i => i.id === path)) {
      setActiveSection(path);
    }
  }, [pathname]);

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    const newPath = id === "dashboard" ? "/" : `/${id}`;
    window.history.pushState(null, '', newPath);
  };

  const isDetailPage = pathname.split('/').length > 2;
  const activeItem = [...navItems, ...secondaryItems].find(i => i.id === activeSection);
  const pageTitle = activeItem?.name || "Terminal";

  return (
    <div 
      className={cn(
        "flex h-screen w-full bg-background font-body text-foreground overflow-hidden transition-opacity duration-700", 
        isMounted ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      suppressHydrationWarning
    >
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        secondaryItems={secondaryItems}
        activeId={activeSection}
        onNavClick={handleSectionChange}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative md:ml-72">
        <MarketContextBar />
        
        <header className="z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-muted-foreground hover:text-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2 overflow-hidden">
               {isDetailPage ? (
                 <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => router.back()}>
                     <ArrowLeft className="h-4 w-4" />
                   </Button>
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">Deep Intelligence</span>
                 </div>
               ) : (
                 <div className="flex flex-col">
                   <h1 className="font-headline text-sm font-bold tracking-tight text-foreground truncate select-none">
                     MarketPulse Command Center
                   </h1>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest -mt-0.5">
                     {pageTitle}
                   </p>
                 </div>
               )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-xl mx-4 justify-end md:justify-start">
            <button onClick={() => setSearchOpen(true)} className="relative w-full max-w-[400px] group flex items-center h-10 px-4 bg-secondary rounded-md text-muted-foreground border border-border">
              <Search className="h-4 w-4 md:mr-3 shrink-0" />
              <span className="text-xs truncate font-medium hidden md:inline">Search Terminal (⌘K)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-destructive border border-background" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scrollbar-hide bg-background relative">
          <div className="max-w-[1600px] mx-auto w-full h-full">
            {isDetailPage ? children : (
              <div className="relative w-full h-full">
                <ModuleView active={activeSection === "dashboard"}>
                  <div className="space-y-10 animate-in fade-in duration-500">
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-primary tracking-[0.2em]">Decision Narrative</span>
                          <h2 className="font-headline text-2xl font-bold tracking-tight">Today's Market Story</h2>
                        </div>
                      </div>
                      <DailyMarketStory />
                    </section>
                    <MarketOverview />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <SentimentPulse />
                          <MorningBriefingSummary />
                        </div>
                        <TopNewsWidget />
                      </div>
                      <aside className="lg:col-span-4 space-y-8">
                        <MarketIntelligenceHighlights />
                        <ActiveIpoWidget />
                        <SectorLeadersWidget />
                      </aside>
                    </div>
                  </div>
                </ModuleView>
                <ModuleView active={activeSection === "briefing"}><DailyBriefing /></ModuleView>
                <ModuleView active={activeSection === "news"}><NewsHub /></ModuleView>
                <ModuleView active={activeSection === "ipo"}><IpoExplorer /></ModuleView>
                <ModuleView active={activeSection === "scanner"}><MarketChanges /></ModuleView>
                <ModuleView active={activeSection === "intelligence"}><MarketIntelligenceHub /></ModuleView>
                <ModuleView active={activeSection === "research"}><ResearchHub /></ModuleView>
                <ModuleView active={activeSection === "portfolio"}><PortfolioManager /></ModuleView>
                <ModuleView active={activeSection === "bookmarks"}><BookmarkManager /></ModuleView>
                <ModuleView active={activeSection === "settings"}><SettingsManager /></ModuleView>
              </div>
            )}
          </div>
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster />
    </div>
  );
}


"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Rocket, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  ArrowRight,
  Users,
  RefreshCw,
  ShieldCheck,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IpoService, IpoData } from "@/services/ipo-service";

export function IpoExplorer() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<IpoData | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("live");
  const [lastSync, setLastSync] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Initialize mounted state to prevent hydration mismatches for time strings
  useEffect(() => {
    setMounted(true);
    setLastSync(Date.now());
  }, []);

  // Force reactivity by resetting data before fetch
  const loadIpo = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    
    try {
      // Pass forceRefresh flag to bypass any cache
      const res = await IpoService.getIpoData(true);
      
      // Ensure UI re-renders by setting a new object reference
      setData({ ...res });
      setLastSync(Date.now());
    } catch (err) {
      console.error("IPO Refresh Failed:", err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadIpo();
    
    // Auto-refresh heartbeat every 30 seconds for live demand tracking
    const interval = setInterval(() => {
      if (activeTab === 'live') {
        loadIpo(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadIpo, activeTab]);

  const filteredData = useMemo(() => {
    if (!data) return null;
    const term = search.toLowerCase();
    return {
      live: data.live.filter(i => i.name.toLowerCase().includes(term)),
      upcoming: data.upcoming.filter(i => i.name.toLowerCase().includes(term)),
      listed: data.listed.filter(i => i.name.toLowerCase().includes(term))
    };
  }, [data, search]);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Rocket className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-headline text-foreground font-bold tracking-tight">IPO Terminal Pro</h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-muted-foreground text-sm font-medium">Monitoring {data?.live.length || 0} active listings and {data?.upcoming.length || 0} institutional prospects.</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => loadIpo()} className="h-8 gap-2 rounded-full border border-border/40 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary">
                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} /> Force Sync
              </Button>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase">
                <Clock className="h-3 w-3" />
                <span>Last Global Sync: {mounted && lastSync > 0 ? new Date(lastSync).toLocaleTimeString() : '--:--:--'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search company, industry..." 
            className="pl-12 h-14 bg-card/40 border-border/40 rounded-[1.5rem] focus:ring-primary/20 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="live" onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-6 scrollbar-hide">
          <TabsList className="bg-card/40 border border-border/40 p-1.5 rounded-[2rem] w-full lg:w-fit justify-start h-auto gap-2">
            <TabsTrigger value="live" className="gap-3 px-10 py-4 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
              <Rocket className="h-5 w-5" /> Live Listings
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-3 px-10 py-4 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
              <Calendar className="h-5 w-5" /> Upcoming Stream
            </TabsTrigger>
            <TabsTrigger value="listed" className="gap-3 px-10 py-4 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
              <CheckCircle2 className="h-5 w-5" /> Historical Perf
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="live" className="mt-0 outline-none">
          {isLoading || !filteredData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {[1, 2].map((i) => <Skeleton key={i} className="h-96 w-full rounded-[3rem]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
              {filteredData.live.map((ipo) => (
                <Card key={`${ipo.id}-${ipo.lastFetchTime}`} className="border-border/40 bg-card/40 hover:bg-card/60 transition-all duration-1000 relative group overflow-hidden rounded-[3rem] border-l-[6px] border-l-primary shadow-2xl">
                  <div className="absolute -right-20 -top-20 h-48 w-48 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/15 transition-all duration-1000" />
                  <CardHeader className="flex flex-row items-start justify-between p-10 pb-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary bg-primary/5 uppercase px-4 py-1 tracking-widest">
                          {ipo.category}
                        </Badge>
                        <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 shadow-sm">
                           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Live Sync: {mounted ? ipo.lastUpdated : '--:--:--'}</span>
                        </div>
                        {ipo.confidence === 'High' && (
                          <div className="flex items-center gap-1 text-primary">
                             <ShieldCheck className="h-4 w-4" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Verified Source</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="font-headline text-4xl font-bold tracking-tight text-foreground leading-tight">{ipo.name}</CardTitle>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Aggregate Demand</span>
                      <span className="text-4xl font-bold font-headline text-primary tabular-nums leading-none">{ipo.subscription}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2.5 text-primary">
                          <Users className="h-5 w-5" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Institutional Mix</span>
                        </div>
                        <div className="space-y-5">
                           {ipo.subscriptions?.map(sub => (
                             <div key={sub.category} className="space-y-2">
                               <div className="flex justify-between items-center text-[10px] font-bold tracking-widest">
                                 <span className="text-muted-foreground uppercase">{sub.category}</span>
                                 <span className="text-foreground">{sub.times}</span>
                               </div>
                               <Progress value={sub.progress} className="h-1.5 rounded-full bg-primary/10" />
                             </div>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Price Spectrum</span>
                            <p className="text-base font-bold font-headline tabular-nums text-foreground">{ipo.price}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">GMP Premium</span>
                            <p className="text-base font-bold text-primary font-headline tabular-nums">{ipo.gmp}</p>
                          </div>
                        </div>
                        <div className="p-6 rounded-[1.5rem] bg-muted/20 border border-border/10 shadow-inner flex flex-col justify-between">
                           <p className="text-[11px] text-muted-foreground leading-relaxed italic font-medium">
                             "{ipo.listingWatch}"
                           </p>
                           <div className="pt-4 border-t border-border/5 flex items-center justify-between">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">Updated: {mounted ? ipo.lastUpdated : '--:--'}</span>
                              <Badge className="text-[8px] font-bold uppercase bg-muted text-muted-foreground border-none px-2">{ipo.confidence} Data</Badge>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                      <Link href={`/ipo/${ipo.id}`} className="flex-1">
                        <Button variant="outline" className="w-full text-xs font-bold gap-3 py-7 rounded-[1.5rem] border-primary/20 text-primary hover:bg-primary/5 transition-all shadow-sm uppercase tracking-widest">
                          Deep Analysis <BarChart3 className="h-5 w-5" />
                        </Button>
                      </Link>
                      <Button className="flex-1 text-xs font-bold gap-3 py-7 rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all uppercase tracking-widest">
                        Apply for Lot <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-0 outline-none">
          <Card className="border-border/40 bg-card/40 overflow-hidden shadow-2xl rounded-[3rem]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/10 bg-muted/20">
                    <th className="text-left p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Company Entity</th>
                    <th className="text-left p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Industry</th>
                    <th className="text-left p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Valuation Est.</th>
                    <th className="text-left p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue Scale</th>
                    <th className="text-left p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline</th>
                    <th className="text-right p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredData?.upcoming.map((ipo) => (
                    <tr key={ipo.id} className="hover:bg-primary/5 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary">
                      <td className="p-8">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{ipo.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{ipo.category}</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <Badge variant="secondary" className="text-[10px] font-bold bg-muted/40 border-none px-4 py-1 uppercase tracking-widest">{ipo.industry}</Badge>
                      </td>
                      <td className="p-8 font-bold font-headline text-base tabular-nums text-foreground">{ipo.expectedPrice}</td>
                      <td className="p-8 text-primary font-bold text-base tabular-nums">{ipo.issueSize}</td>
                      <td className="p-8 text-muted-foreground font-medium text-xs tracking-widest">{ipo.listingDate}</td>
                      <td className="p-8 text-right">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-[0.2em] border-border/40 group-hover:border-primary/40 transition-all px-4 py-1.5">{ipo.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="listed" className="mt-0 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredData?.listed.map((ipo) => (
              <Card key={ipo.id} className="border-border/40 bg-card/40 overflow-hidden group hover:border-primary/30 transition-all duration-700 rounded-[2.5rem] shadow-lg hover:shadow-2xl">
                <CardHeader className="pb-6 border-b border-border/10 bg-muted/5 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase font-bold tracking-[0.2em]">{ipo.date}</span>
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase border-none px-4 py-1 shadow-lg",
                      ipo.trend === "up" ? "bg-primary text-white" : "bg-destructive text-white"
                    )}>
                      {ipo.trend === "up" ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                      {ipo.gain} Alpha
                    </Badge>
                  </div>
                  <CardTitle className="font-headline text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-none">{ipo.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Base Price</p>
                        <p className="text-xl font-bold font-headline tabular-nums text-foreground">{ipo.issuePrice}</p>
                     </div>
                     <div className="text-right space-y-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Current LTP</p>
                        <p className={cn("text-xl font-bold font-headline tabular-nums", ipo.trend === "up" ? "text-primary" : "text-destructive")}>{ipo.listingPrice}</p>
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

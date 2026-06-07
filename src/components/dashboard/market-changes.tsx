"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  ArrowUpDown,
  Flame,
  Target,
  BarChart3,
  Filter,
  Loader2,
  ChevronRight,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getScannerData, ScannerStock } from "@/services/market-data-service";
import { useUnifiedIntelligence } from "@/hooks/use-unified-intelligence";
import { Skeleton } from "@/components/ui/skeleton";

const scannerCategories = [
  { id: "gainers", label: "Top Gainers", icon: TrendingUp },
  { id: "losers", label: "Top Losers", icon: TrendingDown },
  { id: "active", label: "Most Active", icon: Flame },
  { id: "high52", label: "52W High", icon: ArrowUpRight },
  { id: "low52", label: "52W Low", icon: ArrowDownRight },
];

const sectors = ["All", "Banking", "IT", "Pharma", "FMCG", "Auto", "Energy", "Metals", "Realty", "Defence", "Railways"];

export function MarketChanges() {
  const [activeTab, setActiveTab] = useState("gainers");
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [sortField, setSortField] = useState<keyof ScannerStock>("percent");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ScannerStock[]>([]);
  const { updateIntelligence } = useUnifiedIntelligence();
  
  const itemsPerPage = 15;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const scannerData = await getScannerData(activeTab);
      setData(scannerData);
      setLoading(false);

      // Connect to Brain: Feed significant signals to intelligence layer
      scannerData.slice(0, 5).forEach(stock => {
        const pct = parseFloat(stock.percent);
        if (pct > 4) {
          updateIntelligence(stock.symbol, 'positive', `Scanner Breakout: ${pct}% price expansion`);
        } else if (pct < -4) {
          updateIntelligence(stock.symbol, 'negative', `Scanner Flush: ${pct}% structural drop`);
        }
      });
    }
    load();
  }, [activeTab, updateIntelligence]);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (selectedSector !== "All") {
      result = result.filter(s => s.sector === selectedSector);
    }

    if (search) {
      result = result.filter(s => 
        s.company.toLowerCase().includes(search.toLowerCase()) || 
        s.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result.sort((a, b) => {
      let valA = parseFloat(a[sortField]?.toString().replace(/[^0-9.-]/g, '') || "0");
      let valB = parseFloat(b[sortField]?.toString().replace(/[^0-9.-]/g, '') || "0");
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [data, search, selectedSector, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: keyof ScannerStock) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className="h-6 w-6" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Connected Scanning Engine</span>
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight">Market Scanner Pro</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search ticker..." 
              className="pl-11 h-12 bg-card/40 border-border/40 rounded-2xl focus:ring-primary/20"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <Select value={selectedSector} onValueChange={(val) => { setSelectedSector(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-48 h-12 bg-card/40 border-border/40 rounded-2xl">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Sector" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/40">
              {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="gainers" onValueChange={(val) => { setActiveTab(val); setCurrentPage(1); }} className="w-full">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <TabsList className="bg-card/40 border border-border/40 p-1.5 rounded-2xl w-full justify-start h-auto gap-2">
            {scannerCategories.map(cat => (
              <TabsTrigger 
                key={cat.id}
                value={cat.id} 
                className="gap-2 px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest transition-all"
              >
                <cat.icon className="h-4 w-4" /> {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-6">
          <Card className="border-border/40 bg-card/40 overflow-hidden shadow-2xl rounded-[2.5rem]">
            {loading ? (
              <div className="p-40 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Syncing Exchange Terminal...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/10 bg-muted/20">
                      <th className="text-left p-6 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Symbol</th>
                      <th className="text-left p-6 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Asset Identity</th>
                      <th className="text-right p-6 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <button onClick={() => handleSort('price')} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                          LTP <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="text-right p-6 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <button onClick={() => handleSort('percent')} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                          Change % <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="text-right p-6 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <button onClick={() => handleSort('volume')} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                          Volume <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                      <th className="text-right p-6 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mkt Cap</th>
                      <th className="p-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-primary/5 transition-all group border-l-4 border-l-transparent hover:border-l-primary">
                        <td className="p-6">
                          <Link href={`/stock/${encodeURIComponent(item.symbol)}`}>
                            <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase cursor-pointer hover:bg-primary hover:text-white transition-all px-3 py-1">
                              {item.symbol}
                            </Badge>
                          </Link>
                        </td>
                        <td className="p-6">
                          <Link href={`/stock/${encodeURIComponent(item.symbol)}`}>
                            <div className="flex flex-col cursor-pointer">
                              <span className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">{item.company}</span>
                              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">{item.sector}</span>
                            </div>
                          </Link>
                        </td>
                        <td className="p-6 text-right font-bold font-headline text-base tabular-nums">₹{item.price}</td>
                        <td className={cn(
                          "p-6 text-right font-bold font-headline text-base tabular-nums",
                          parseFloat(item.percent) > 0 ? "text-primary" : "text-destructive"
                        )}>
                          <div className="flex items-center justify-end gap-1">
                            {parseFloat(item.percent) > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            {item.percent}%
                          </div>
                        </td>
                        <td className="p-6 text-right font-medium text-sm text-muted-foreground tabular-nums">{item.volume}</td>
                        <td className="p-6 text-right">
                          <span className="text-xs font-bold text-foreground">{item.marketCap}</span>
                        </td>
                        <td className="p-6 text-right">
                          <Link href={`/stock/${encodeURIComponent(item.symbol)}`}>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all">
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-40 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-30">
                            <BarChart3 className="h-16 w-16 text-primary" />
                            <p className="text-sm font-bold uppercase tracking-[0.2em]">Zero scanning hits found in current cycle.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {!loading && totalPages > 1 && (
              <div className="p-8 border-t border-border/10 flex items-center justify-between bg-muted/5">
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="h-10 px-8 text-[10px] font-bold uppercase tracking-widest rounded-full border-border/40 hover:bg-primary/5 transition-all"
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="h-10 px-8 text-[10px] font-bold uppercase tracking-widest rounded-full border-border/40 hover:bg-primary/5 transition-all"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Tabs>
    </div>
  );
}

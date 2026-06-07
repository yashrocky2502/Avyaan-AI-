
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Zap, 
  ChevronRight,
  BrainCircuit,
  ShieldAlert,
  Loader2,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getScannerData } from "@/services/market-data-service";
import { getStockIntelligence, StockIntelligence } from "@/services/intelligence-fusion-service";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ResearchHub() {
  const [loading, setLoading] = useState(true);
  const [intelItems, setIntelItems] = useState<StockIntelligence[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const scannerData = await getScannerData('active');
        const topSymbols = scannerData.slice(0, 4).map(s => s.symbol);
        
        const fusedData = await Promise.all(
          topSymbols.map(sym => getStockIntelligence(sym))
        );

        setIntelItems(fusedData);
      } catch (error) {
        console.error("Research fusion failed", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className="h-6 w-6" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cross-Module Analysis</span>
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground">Fused Research Terminal</h2>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="font-bold text-xs uppercase tracking-widest h-10 px-6 border-primary/20 text-primary rounded-xl">
             Compare Assets
           </Button>
           <Button className="font-bold text-xs uppercase tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-primary/20">
             Export Analysis
           </Button>
        </div>
      </div>

      <Tabs defaultValue="fused" className="w-full">
        <TabsList className="bg-card/40 border border-border/40 p-1 rounded-xl w-fit mb-8 h-12">
          <TabsTrigger value="fused" className="gap-2 px-8 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest">
            Unified Signal
          </TabsTrigger>
          <TabsTrigger value="sectors" className="gap-2 px-8 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest">
            Sector Rotation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fused" className="mt-0">
          {loading ? (
             <div className="p-40 flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synthesizing Intelligence...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {intelItems.map((item) => (
                <Card key={item.symbol} className={cn(
                  "border-border/40 bg-card/40 overflow-hidden relative group rounded-[2.5rem] transition-all hover:bg-card/60",
                  item.riskAlert && "border-destructive/20 shadow-destructive/5"
                )}>
                  <div className={cn(
                    "absolute top-0 left-0 w-1.5 h-full transition-colors",
                    item.netBias === 'Bullish' ? "bg-primary" : 
                    item.netBias === 'Bearish' ? "bg-destructive" : "bg-muted"
                  )} />
                  <CardHeader className="pb-4 border-b border-border/10 bg-muted/5">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Link href={`/stock/${encodeURIComponent(item.symbol)}`}>
                          <CardTitle className="font-headline text-2xl font-bold cursor-pointer hover:text-primary transition-colors">{item.name}</CardTitle>
                        </Link>
                        <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-border/50">{item.symbol}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Confidence</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs p-3 space-y-2">
                                <p className="text-[10px] font-bold uppercase border-b border-border/10 pb-1">Reasoning Trace</p>
                                {item.reasoningSteps.map((step, idx) => (
                                  <p key={idx} className="text-[10px] leading-relaxed">• {step}</p>
                                ))}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-3xl font-bold font-headline tabular-nums">{item.confidenceScore}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 space-y-8">
                    <div className="p-5 rounded-3xl bg-muted/20 border border-border/10 space-y-3">
                       <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Terminal Summary</span>
                       </div>
                       <p className="text-sm leading-relaxed text-foreground font-medium italic">
                         "{item.finalSummary}"
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Bullish Catalysts</span>
                        </div>
                        <ul className="space-y-2">
                          {item.bullishSignals.length > 0 ? item.bullishSignals.map((sig, i) => (
                            <li key={i} className="text-[11px] font-medium flex gap-2 text-muted-foreground">
                              <span className="text-primary font-bold">•</span> {sig}
                            </li>
                          )) : <li className="text-[11px] text-muted-foreground italic">No strong bullish drivers detected.</li>}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-destructive">
                          <ShieldAlert className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Risk Factors</span>
                        </div>
                        <ul className="space-y-2">
                          {item.bearishSignals.length > 0 ? item.bearishSignals.map((sig, i) => (
                            <li key={i} className="text-[11px] font-medium flex gap-2 text-muted-foreground">
                              <span className="text-destructive font-bold">•</span> {sig}
                            </li>
                          )) : <li className="text-[11px] text-muted-foreground italic">Risk exposure remains low.</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/10 flex items-center justify-between">
                       <div className="flex flex-col gap-1">
                          <Badge className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 border-none w-fit",
                            item.netBias === 'Bullish' ? "bg-primary/20 text-primary" : 
                            item.netBias === 'Bearish' ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
                          )}>
                            Bias: {item.netBias}
                          </Badge>
                          <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">Fused: {new Date(item.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <Link href={`/stock/${encodeURIComponent(item.symbol)}`}>
                        <Button variant="link" className="text-[10px] font-bold text-primary gap-1 group p-0">
                          Detailed Analytics <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                       </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

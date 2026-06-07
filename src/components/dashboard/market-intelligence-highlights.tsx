"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, BrainCircuit, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMarketNarrative } from "@/services/intelligence-fusion-service";
import { UI, ModuleErrorBoundary } from "@/components/ui/core-system";
import { useTerminalModule } from "@/hooks/use-terminal-module";
import { UnifiedIntelligenceReport } from "@/services/intelligence-types";

function IntelligenceHighlightsContent() {
  const module = useTerminalModule<UnifiedIntelligenceReport>({
    moduleName: 'Fusion Core',
    fetcher: getMarketNarrative,
    refreshInterval: 600000 // 10 min
  });

  const report = module.renderData;

  return (
    <UI.Card className="shadow-lg shadow-primary/5">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <h3 className="font-headline text-lg font-bold">Fused Intelligence</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground"
            onClick={() => module.refresh()}
            disabled={module.status === 'loading'}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", module.status === 'loading' && "animate-spin")} />
          </Button>
          <Link href="/intelligence">
            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-primary hover:bg-primary/10">Full View</Button>
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        {module.status === 'loading' && !report ? (
          <UI.Loading />
        ) : module.status === 'error' && !report ? (
          <UI.Error message={module.error} onRetry={() => module.refresh()} />
        ) : report && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Market Narrative</span>
              <UI.Badge type={report.overallSignal.signal.direction === "bullish" ? "bullish" : report.overallSignal.signal.direction === "bearish" ? "bearish" : "neutral"}>
                {report.overallSignal.signal.direction.toUpperCase()} Bias
              </UI.Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-foreground leading-tight">{report.regime}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                "{report.overallSignal.reasoning.whatHappened}"
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" /> Core Catalysts
              </p>
              {report.keyDrivers?.map((driver: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-[11px] font-medium text-foreground/80 group">
                  <div className="h-1 w-1 rounded-full bg-primary shrink-0" />
                  <span className="line-clamp-1">{driver}</span>
                </div>
              )) || <p className="text-[10px] text-muted-foreground italic">No primary catalysts detected.</p>}
            </div>

            <div className="bg-muted/20 rounded-2xl p-4 border border-border/10 group cursor-pointer hover:border-primary/30 transition-all mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Signal Confidence</span>
                </div>
                <span className="text-[8px] text-muted-foreground uppercase">{new Date(module.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${report.overallSignal.signal.confidence || 0}%` }}
                    />
                 </div>
                 <span className="text-xs font-bold font-headline">{report.overallSignal.signal.confidence || 0}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </UI.Card>
  );
}

export function MarketIntelligenceHighlights() {
  return (
    <ModuleErrorBoundary moduleName="Intelligence Fusion">
      <IntelligenceHighlightsContent />
    </ModuleErrorBoundary>
  );
}
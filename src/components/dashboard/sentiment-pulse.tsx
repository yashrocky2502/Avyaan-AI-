"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UI, ModuleErrorBoundary } from "@/components/ui/core-system";
import { useTerminalModule } from "@/hooks/use-terminal-module";

const fetchSentiment = async () => {
  // Simulate network fetch
  await new Promise(r => setTimeout(r, 1200));
  return {
    sentimentScore: 0.65,
    sentimentExplanation: "Market sentiment is currently Bullish, driven by strong tech earnings and positive economic data. Investors are optimistic about potential growth in the mid-cap segments as domestic demand remains resilient."
  };
};

function SentimentPulseContent() {
  const module = useTerminalModule({
    moduleName: 'Sentiment Engine',
    fetcher: fetchSentiment,
    refreshInterval: 300000 // 5 min
  });

  const data = module.renderData;
  const progressValue = data ? ((data.sentimentScore + 1) / 2) * 100 : 50;

  return (
    <UI.Card className="relative overflow-hidden bg-card border-border shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <h3 className="font-headline text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Market Sentiment Pulse
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Synthesized Analysis</p>
        </div>
        <button 
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center"
          onClick={() => module.refresh()}
          disabled={module.status === 'loading'}
        >
          <RefreshCw className={cn("h-4 w-4", module.status === 'loading' && "animate-spin")} />
        </button>
      </div>

      <div className="space-y-6">
        {module.status === 'loading' && !data ? (
          <UI.Loading />
        ) : module.status === 'error' && !data ? (
          <UI.Error message={module.error} onRetry={() => module.refresh()} />
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-destructive">Bearish Zone</span>
                <span className="text-primary">Bullish Zone</span>
              </div>
              <div className="relative pt-1">
                <Progress value={progressValue} className="h-2.5 bg-muted rounded-full" />
                <div 
                  className="absolute top-0 h-4 w-1 bg-foreground transition-all duration-1000" 
                  style={{ left: `${progressValue}%`, transform: 'translateX(-50%)' }}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UI.Badge type={data!.sentimentScore > 0 ? "bullish" : "bearish"}>
                  {data!.sentimentScore > 0 ? "Bullish" : "Bearish"}
                </UI.Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  Score: {data!.sentimentScore.toFixed(2)}
                </span>
                <span className="text-[8px] text-muted-foreground/40 uppercase ml-auto">
                  Sync: {new Date(module.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground font-medium italic">
                "{data!.sentimentExplanation}"
              </p>
            </div>
          </>
        )}

        <div className="bg-muted rounded-2xl p-4 flex gap-3 border border-border">
          <Info className="h-5 w-5 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-snug italic font-medium">
            "Based on global headlines and technical indicators. This pulse represents synthesized terminal tone for decision support."
          </p>
        </div>
      </div>
    </UI.Card>
  );
}

export function SentimentPulse() {
  return (
    <ModuleErrorBoundary moduleName="Sentiment Pulse">
      <SentimentPulseContent />
    </ModuleErrorBoundary>
  );
}
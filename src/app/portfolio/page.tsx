
'use client';

import { PortfolioManager } from "@/components/portfolio/portfolio-manager";
import { Briefcase } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight">Investment Portfolio</h2>
            <p className="text-muted-foreground text-sm font-medium">Real-time performance metrics and cross-module risk detection.</p>
          </div>
        </div>
      </div>
      <PortfolioManager />
    </div>
  );
}

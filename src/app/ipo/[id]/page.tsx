'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Info, 
  Rocket, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Calculator,
  ChevronRight,
  ShieldAlert,
  Zap,
  Building2,
  FileText,
  Clock,
  ShieldCheck
} from "lucide-react";
import { IpoService, IpoDetails } from "@/services/ipo-service";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function IpoDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ipo, setIpo] = useState<IpoDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIpo() {
      if (!id) return;
      setLoading(true);
      const data = await IpoService.getIpoById(id as string);
      setIpo(data);
      setLoading(false);
    }
    loadIpo();
  }, [id]);

  if (loading) return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-12 w-3/4 max-w-xl" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[600px] w-full rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
  
  if (!ipo) return (
    <div className="flex flex-col items-center justify-center py-40 text-center">
      <Rocket className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
      <h2 className="text-2xl font-headline font-bold mb-4">IPO Module Not Found</h2>
      <Button onClick={() => router.push('/ipo')} variant="outline" className="rounded-xl px-8 uppercase font-bold text-xs tracking-widest h-12">Return to Explorer</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
             <Badge className="bg-primary/10 text-primary border-none uppercase text-[10px] font-bold tracking-widest px-3 py-1">
               {ipo.category || "Mainboard"}
             </Badge>
             <Badge variant="outline" className="border-border/40 text-muted-foreground uppercase text-[10px] font-bold tracking-widest px-3 py-1">
               {ipo.industry || "General"}
             </Badge>
             <Badge className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-3 py-1 border-none",
                ipo.status === "Open" ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
             )}>
               Status: {ipo.status}
             </Badge>
             <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2 bg-muted/20 px-3 py-1 rounded-full">
                <Clock className="h-3 w-3" /> Sync: {ipo.lastUpdated}
             </div>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[0.95]">{ipo.name}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed font-medium">
            {ipo.summary}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
           <Button variant="outline" className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest gap-2 h-12 px-6 rounded-xl border-border/40 hover:bg-muted/50">
              <FileText className="h-4 w-4" /> Prospectus (RHP)
           </Button>
           <Button className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest gap-2 h-12 px-8 rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Apply Now <ChevronRight className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Info */}
        <div className="lg:col-span-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 bg-card/40 hover:border-primary/20 transition-all rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4"><CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary"><TrendingUp className="h-4 w-4" /> Issue Metrics</CardTitle></CardHeader>
              <CardContent className="pt-6 space-y-5">
                 {[
                   { label: "Price Band", value: ipo.price },
                   { label: "Issue Size", value: ipo.issueSize },
                   { label: "Lot Size", value: `${ipo.lotSize} Shares` },
                   { label: "Issue Type", value: ipo.issueType }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-border/5 last:border-0">
                     <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{item.label}</span>
                     <span className="text-sm font-bold font-headline text-foreground">{item.value}</span>
                   </div>
                 ))}
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/40 hover:border-accent/20 transition-all rounded-3xl overflow-hidden">
              <CardHeader className="bg-accent/5 pb-4"><CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-accent"><Calendar className="h-4 w-4" /> Listing Timeline</CardTitle></CardHeader>
              <CardContent className="pt-6 space-y-5">
                 {[
                   { label: "Announcement", value: "Oct 20, 2024" },
                   { label: "Offer Start", value: "Oct 25, 2024" },
                   { label: "Offer End", value: "Oct 28, 2024" },
                   { label: "Listing Date", value: ipo.listingDate || "TBA" }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-border/5 last:border-0">
                     <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{item.label}</span>
                     <span className="text-sm font-bold font-headline text-foreground">{item.value}</span>
                   </div>
                 ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <Building2 className="h-6 w-6 text-primary" />
                   <h3 className="font-headline text-2xl font-bold text-foreground">Business Overview</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                   {ipo.businessOverview}
                </p>
             </div>

             <Separator className="bg-border/10" />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <div className="flex items-center gap-2 text-primary">
                      <Zap className="h-5 w-5" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Key Strengths</h4>
                   </div>
                   <ul className="space-y-4">
                      {ipo.strengths?.map((s, i) => (
                         <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed group text-foreground">
                            <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors group-hover:text-primary-foreground">
                              <CheckCircle2 className="h-3 w-3" />
                            </span>
                            {s}
                         </li>
                      ))}
                   </ul>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center gap-2 text-destructive">
                      <ShieldAlert className="h-5 w-5" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Risk Factors</h4>
                   </div>
                   <ul className="space-y-4">
                      {ipo.risks?.map((r, i) => (
                         <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed text-muted-foreground group italic">
                            <AlertCircle className="h-5 w-5 text-destructive/40 group-hover:text-destructive transition-colors shrink-0" />
                            {r}
                         </li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <aside className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 bg-card/40 overflow-hidden group shadow-2xl shadow-primary/5 rounded-[2.5rem]">
             <CardHeader className="bg-primary/10 border-b border-border/10 py-6 px-8">
               <div className="flex justify-between items-center">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary"><BarChart3 className="h-4 w-4" /> Listing Watch</CardTitle>
                <Badge className="bg-muted text-muted-foreground text-[8px] font-bold uppercase border-none px-3">{ipo.confidence} Data</Badge>
               </div>
             </CardHeader>
             <CardContent className="pt-8 px-8 pb-10 space-y-8">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Estimated GMP</span>
                  <div className="flex items-end gap-2">
                     <span className="text-5xl font-bold text-primary font-headline tabular-nums leading-none">{ipo.gmp}</span>
                     <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 mb-1">
                       Track Active
                     </Badge>
                  </div>
                </div>
                
                <Separator className="bg-border/10" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Terminal Verdict</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic font-medium p-5 bg-primary/5 rounded-2xl border border-primary/10">
                    "{ipo.listingWatch}"
                  </p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-2.5 text-primary mb-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Institutional Mix</span>
                   </div>
                   <div className="space-y-5">
                      {ipo.subscriptions?.map(sub => (
                        <div key={sub.category} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest">
                            <span className="text-muted-foreground uppercase">{sub.category} Demand</span>
                            <span className="text-foreground">{sub.times}</span>
                          </div>
                          <Progress value={sub.progress} className="h-1.5 rounded-full bg-primary/10" />
                        </div>
                      ))}
                   </div>
                   <div className="pt-2 border-t border-border/10 flex justify-between items-center">
                     <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Overall Demand</span>
                     <span className="text-base font-bold text-primary font-headline">{ipo.subscription}</span>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 rounded-[2.5rem]">
             <CardHeader className="pb-4 px-8 pt-8"><CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary"><Calculator className="h-4 w-4" /> Potential Returns</CardTitle></CardHeader>
             <CardContent className="px-8 pb-8 space-y-6">
                <div className="p-6 rounded-[2rem] bg-muted/20 border border-border/10 space-y-4">
                   <div className="space-y-1">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">Estimated Listing Price</p>
                      <p className="text-2xl font-bold font-headline text-foreground">₹{parseInt(ipo.price?.split(' - ')[1]?.replace('₹', '') || "0") + parseInt(ipo.gmp?.replace('₹', '') || "0")}</p>
                   </div>
                   <Separator className="bg-border/5" />
                   <div className="space-y-1">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">Profit per Lot (Est.)</p>
                      <p className="text-lg font-bold text-primary font-headline">₹{parseInt(ipo.gmp?.replace('₹', '') || "0") * parseInt(ipo.lotSize || "0")}</p>
                   </div>
                </div>
             </CardContent>
          </Card>

          <div className="p-8 rounded-[2rem] bg-muted/20 border border-border/10 space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                 <Info className="h-4 w-4" />
                 <h5 className="text-[9px] font-bold uppercase tracking-widest">Registrar Terminal</h5>
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-bold text-foreground">{ipo.registrar}</p>
                 <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Registry Sync Active</p>
              </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
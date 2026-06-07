
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IpoService, LiveIpo } from "@/services/ipo-service";

export function ActiveIpoWidget() {
  const [ipos, setIpos] = useState<LiveIpo[]>([]);

  useEffect(() => {
    async function load() {
      const data = await IpoService.getIpoData();
      setIpos(data.live.slice(0, 2));
    }
    load();
  }, []);

  return (
    <Card className="border-border/40 bg-card/40 overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/10 bg-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-accent" />
            <CardTitle className="font-headline text-lg font-bold">Active IPO Terminal</CardTitle>
          </div>
          <Link href="/ipo">
            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-accent hover:bg-accent/10">Full Explorer</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {ipos.map((ipo, i) => (
          <Link key={ipo.id} href={`/ipo/${ipo.id}`} className="block p-4 border-b border-border/10 last:border-0 hover:bg-accent/5 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold">{ipo.name}</span>
              <Badge className="text-[8px] bg-primary/20 text-primary border-none uppercase tracking-widest">{ipo.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase">
              <div>
                <p className="text-muted-foreground tracking-tighter">Subscribed</p>
                <p className="text-foreground">{ipo.subscription}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground tracking-tighter">GMP (Est.)</p>
                <p className="text-primary">{ipo.gmp}</p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

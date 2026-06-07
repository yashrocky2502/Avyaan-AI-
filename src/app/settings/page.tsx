
'use client';

import { SettingsManager } from "@/components/settings/settings-manager";
import { Settings, Sliders, RefreshCw, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground">Terminal Configuration</h2>
        </div>
        <p className="text-muted-foreground text-sm font-medium">Manage terminal behavior, visual theme, and data sync frequency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/40 bg-card/40 rounded-[2.5rem] shadow-xl overflow-hidden">
            <CardHeader className="p-8 pb-4 border-b border-border/10 bg-primary/5">
              <CardTitle className="font-headline text-xl font-bold flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                Visual Identity
              </CardTitle>
              <CardDescription>Customize how the MarketPulse terminal appears on your screen.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <Label className="text-base font-bold">Terminal Theme</Label>
                     <p className="text-xs text-muted-foreground font-medium">Switch between high-contrast dark mode and light mode.</p>
                  </div>
                  <ThemeToggle />
               </div>
               
               <Separator className="bg-border/10" />

               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <Label className="text-base font-bold">Dynamic Animations</Label>
                     <p className="text-xs text-muted-foreground font-medium">Enable transition effects between modules.</p>
                  </div>
                  <Switch defaultChecked />
               </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 rounded-[2.5rem] shadow-xl overflow-hidden">
            <CardHeader className="p-8 pb-4 border-b border-border/10 bg-accent/5">
              <CardTitle className="font-headline text-xl font-bold flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-accent" />
                Data & Performance
              </CardTitle>
              <CardDescription>Optimize institutional data fetch frequency and terminal speed.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <Label className="text-base font-bold">Sync Interval</Label>
                     <p className="text-xs text-muted-foreground font-medium">Set how often the terminal refreshes market indicators.</p>
                  </div>
                  <Select defaultValue="30s">
                    <SelectTrigger className="w-32 bg-muted/20 border-border/40 rounded-xl">
                      <SelectValue placeholder="Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15s">15 Seconds</SelectItem>
                      <SelectItem value="30s">30 Seconds</SelectItem>
                      <SelectItem value="60s">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-8">
           <Card className="border-border/40 bg-card/40 rounded-[2.5rem] shadow-xl overflow-hidden">
             <CardHeader className="p-8 pb-4 border-b border-border/10 bg-muted/10">
               <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Terminal Info</CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                   <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Version</p>
                   <p className="text-sm font-bold font-headline">2.5.0-STABLE</p>
                </div>
                <div className="space-y-2">
                   <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Region</p>
                   <p className="text-sm font-bold font-headline">ASIA-SOUTH-1 (MUMBAI)</p>
                </div>
                <Separator className="bg-border/10" />
                <p className="text-[10px] text-muted-foreground font-medium italic">
                  MarketPulse is currently synchronized with the NSE Exchange Terminal with a structural delay of 15 minutes.
                </p>
             </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  ShieldAlert,
  BrainCircuit,
  AlertTriangle,
  Activity
} from "lucide-react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useUnifiedIntelligence } from "@/hooks/use-unified-intelligence";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/core-system";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PortfolioManager() {
  const { holdings, addHolding, removeHolding, refreshPrices, summary, loading } = usePortfolio();
  const { getIntelligence, intelligenceStore } = useUnifiedIntelligence();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ symbol: '', quantity: '', avgPrice: '' });

  useEffect(() => {
    async function syncIntelligence() {
      if (holdings.length === 0) return;
      await Promise.all(holdings.map(h => getIntelligence(h.symbol, true)));
    }
    syncIntelligence();
  }, [holdings, getIntelligence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.symbol && formData.quantity && formData.avgPrice) {
      addHolding(formData.symbol, parseFloat(formData.quantity), parseFloat(formData.avgPrice));
      setFormData({ symbol: '', quantity: '', avgPrice: '' });
      setIsAddOpen(false);
    }
  };

  const highExposureRisk = useMemo(() => {
    if (holdings.length === 0) return null;
    return holdings.find(h => {
      const value = h.quantity * (h.currentPrice || h.avgPrice);
      const weight = value / summary.currentValue;
      return weight > 0.4; // 40% concentration threshold
    });
  }, [holdings, summary.currentValue]);

  return (
    <div className="space-y-10 pb-20">
      {/* Portfolio Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/40 bg-card shadow-xl rounded-[2rem]">
          <CardContent className="pt-8 p-8 space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Net Capital</p>
            <p className="text-3xl font-bold font-headline tabular-nums">₹{summary.totalInvestment.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card shadow-xl rounded-[2rem]">
          <CardContent className="pt-8 p-8 space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Current Valuation</p>
            <p className="text-3xl font-bold font-headline tabular-nums">₹{summary.currentValue.toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>
        <Card className={cn(
          "border-none shadow-2xl rounded-[2rem]",
          summary.totalPnL >= 0 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
        )}>
          <CardContent className="pt-8 p-8 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Absolute Returns</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold font-headline tabular-nums">₹{summary.totalPnL.toLocaleString('en-IN')}</p>
              <Badge variant="outline" className="text-[10px] font-bold border-current text-current">
                {summary.totalPnLPercent.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(
          "border-none shadow-2xl rounded-[2rem]",
          summary.dailyChange >= 0 ? "bg-primary/20 text-primary" : "bg-orange-500/10 text-orange-500"
        )}>
          <CardContent className="pt-8 p-8 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Session Change</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold font-headline tabular-nums">₹{summary.dailyChange.toLocaleString('en-IN')}</p>
              {summary.dailyChange !== 0 && (
                summary.dailyChange > 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alert Panel */}
      {highExposureRisk && (
        <div className="p-6 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-lg leading-none">High Concentration Risk</h4>
              <p className="text-sm text-muted-foreground font-medium">Your position in <span className="text-foreground font-bold">{highExposureRisk.symbol}</span> exceeds 40% of total portfolio value.</p>
            </div>
          </div>
        </div>
      )}

      {/* Holdings Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h3 className="font-headline text-2xl font-bold">Terminal Holdings</h3>
          <Badge variant="secondary" className="bg-muted text-[10px] uppercase font-bold tracking-widest px-3 py-1">{holdings.length} Positions Active</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={refreshPrices} disabled={loading} className="gap-2 rounded-xl h-11 px-6 border-border hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Sync Terminal
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 rounded-xl h-11 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs font-bold uppercase tracking-widest">
            <Plus className="h-4 w-4" /> Add Asset
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        title="Add Position"
      >
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ticker Symbol (NSE Format)</Label>
            <Input 
              placeholder="RELIANCE.NS" 
              className="rounded-xl h-12 bg-muted/20 border-border"
              value={formData.symbol}
              onChange={e => setFormData({...formData, symbol: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quantity</Label>
              <Input 
                type="number" 
                placeholder="0" 
                className="rounded-xl h-12 bg-muted/20 border-border"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Entry Price</Label>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="rounded-xl h-12 bg-muted/20 border-border"
                value={formData.avgPrice}
                onChange={e => setFormData({...formData, avgPrice: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="pt-6">
            <Button type="submit" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20">Initialize Sync</Button>
          </div>
        </form>
      </Modal>

      {holdings.length > 0 ? (
        <Card className="border-border bg-card overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Asset Identity</th>
                  <th className="text-right p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Qty</th>
                  <th className="text-right p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">LTP / Entry</th>
                  <th className="text-right p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Returns</th>
                  <th className="text-right p-8 font-headline text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bias</th>
                  <th className="p-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {holdings.map((h) => {
                  const intel = intelligenceStore[h.symbol];
                  const pnl = (h.currentPrice || 0) - h.avgPrice;
                  const pnlTotal = pnl * h.quantity;
                  const pnlPercent = (pnl / h.avgPrice) * 100;
                  const isProfit = pnl >= 0;

                  return (
                    <tr key={h.id} className="hover:bg-primary/5 transition-all group">
                      <td className="p-8">
                        <Link href={`/stock/${encodeURIComponent(h.symbol)}`}>
                          <div className="flex flex-col gap-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                               <span className="font-bold text-lg group-hover:text-primary transition-colors">{h.symbol}</span>
                               {intel?.risk.level === 'high' && <ShieldAlert className="h-4 w-4 text-destructive animate-pulse" />}
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{h.name || 'Syncing...'}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="p-8 text-right font-bold text-base tabular-nums">{h.quantity}</td>
                      <td className="p-8 text-right">
                        <div className="flex flex-col items-end gap-1">
                           <span className="text-base font-bold font-headline tabular-nums">₹{h.currentPrice?.toLocaleString('en-IN') || '---'}</span>
                           <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Avg: ₹{h.avgPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </td>
                      <td className={cn(
                        "p-8 text-right font-bold font-headline tabular-nums",
                        isProfit ? "text-primary" : "text-destructive"
                      )}>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-lg">{isProfit ? '+' : ''}{pnlTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                          <span className="text-[10px] font-bold tracking-widest">{pnlPercent.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                         {intel ? (
                            <Badge className={cn(
                              "text-[10px] font-bold uppercase tracking-widest px-3 py-1 border-none",
                              intel.signal.direction === 'bullish' ? "bg-primary text-primary-foreground" : 
                              intel.signal.direction === 'bearish' ? "bg-destructive text-white" : "bg-muted text-muted-foreground"
                            )}>
                              {intel.signal.direction}
                            </Badge>
                         ) : <div className="h-4 w-16 bg-muted animate-pulse ml-auto rounded-full" />}
                      </td>
                      <td className="p-8 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 text-muted-foreground hover:text-destructive rounded-full"
                          onClick={() => removeHolding(h.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center space-y-8">
          <div className="h-28 w-28 rounded-[2.5rem] bg-primary/5 flex items-center justify-center">
            <Activity className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-3">
            <h3 className="font-headline text-3xl font-bold tracking-tight">Empty Portfolio</h3>
            <p className="text-muted-foreground max-w-sm font-medium">Add assets to activate live tracking and institutional risk alerts.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="rounded-2xl px-12 h-14 font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
            Initialize Holdings
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  BrainCircuit, 
  X
} from "lucide-react";

/**
 * @fileOverview Custom MarketPulse Sidebar.
 * SPA-aware navigation with active state management.
 */

interface NavItem {
  id: string;
  name: string;
  icon: any;
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  navItems,
  secondaryItems,
  activeId,
  onNavClick
}: { 
  isOpen: boolean; 
  onClose: () => void;
  navItems: NavItem[];
  secondaryItems: NavItem[];
  activeId: string;
  onNavClick: (id: string) => void;
}) {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-[70] w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl md:shadow-none",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full bg-sidebar">
        {/* Header */}
        <div className="p-8 flex items-center justify-between">
          <button 
            onClick={() => onNavClick("dashboard")} 
            className="flex items-center gap-3 group text-left outline-none"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-lg font-bold tracking-tight text-foreground leading-none">
                Market<span className="text-primary">Pulse</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Terminal OS</span>
            </div>
          </button>
          <button 
            onClick={onClose} 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto scrollbar-hide bg-sidebar">
          <div>
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Modules</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavClick(item.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={cn(
                      "flex items-center w-full gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium outline-none",
                      active 
                        ? "bg-primary text-white font-bold" 
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">System</p>
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavClick(item.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={cn(
                      "flex items-center w-full gap-3 px-4 py-2.5 rounded-md transition-all text-sm font-medium outline-none",
                      active 
                        ? "bg-primary text-white font-bold" 
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Status */}
        <div className="p-6 bg-sidebar border-t border-sidebar-border/50">
          <div className="h-14 w-full flex items-center gap-3 rounded-lg bg-secondary px-4 border border-sidebar-border">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-bold leading-none truncate">System Active</span>
              <span className="text-[9px] text-primary font-bold uppercase tracking-tighter mt-1">Direct Sync</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

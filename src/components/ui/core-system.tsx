'use client';

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertCircle, RotateCcw, ShieldAlert, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* =========================================================
   BASE MODAL SYSTEM (REPLACING RADIX DIALOG)
========================================================= */

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title = "Terminal Overlay",
  className 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode; 
  title?: string;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className={cn(
        "relative bg-background border border-border w-full max-w-lg shadow-none rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
        className
      )}>
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted">
          <h3 className="font-headline text-lg font-bold uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto bg-background">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* =========================================================
   MODULE ERROR BOUNDARY (CRASH ISOLATION)
========================================================= */

interface ErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ModuleErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <UI.Card className="border-destructive bg-destructive/10 flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
          <AlertCircle className="h-8 w-8 text-destructive mb-3" />
          <h4 className="text-sm font-bold uppercase tracking-widest text-destructive mb-1">
            {this.props.moduleName} Interrupted
          </h4>
          <p className="text-[10px] text-muted-foreground italic mb-4 max-w-[200px]">
            Runtime crash detected in terminal node.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] uppercase font-bold tracking-widest border-destructive hover:bg-destructive hover:text-white"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onRetry?.();
            }}
          >
            <RotateCcw className="h-3 w-3 mr-2" /> Re-initialize
          </Button>
        </UI.Card>
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   STANDARDIZED UI COMPONENTS (DESIGN SYSTEM)
========================================================= */

export const UI = {
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("rounded-lg border border-border bg-card p-6 shadow-none transition-none", className)}>
      {children}
    </div>
  ),

  Badge: ({
    type,
    children,
    className
  }: {
    type: "bullish" | "bearish" | "neutral";
    children: React.ReactNode;
    className?: string;
  }) => {
    const styles = {
      bullish: "bg-primary text-primary-foreground border-primary",
      bearish: "bg-destructive text-destructive-foreground border-destructive",
      neutral: "bg-muted text-muted-foreground border-border"
    };

    return (
      <span className={cn(
        "inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border",
        styles[type],
        className
      )}>
        {children}
      </span>
    );
  },

  Loading: ({ className }: { className?: string }) => (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Loader2 className="h-4 w-4 text-primary animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Syncing Node...</span>
      </div>
      <div className="animate-pulse h-10 bg-muted rounded-md w-3/4" />
      <div className="animate-pulse h-24 bg-muted rounded-md w-full" />
    </div>
  ),

  Error: ({ message = "Intelligence sync interrupted.", onRetry }: { message?: string; onRetry?: () => void }) => (
    <div className="p-10 text-center border border-destructive bg-background rounded-lg space-y-4">
      <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
      <div className="space-y-1">
        <p className="text-destructive font-bold uppercase text-[10px] tracking-[0.2em]">{message}</p>
        <p className="text-[10px] text-muted-foreground italic">Consulting terminal cache...</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="text-[10px] font-bold uppercase text-primary border-primary hover:bg-primary hover:text-white">
          <RotateCcw className="h-3 w-3 mr-2" /> Force Sync
        </Button>
      )}
    </div>
  ),
};
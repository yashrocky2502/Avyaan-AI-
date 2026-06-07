
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Terminal runtime error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-in fade-in duration-500">
      <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-headline font-bold tracking-tight">Intelligence Feed Interrupted</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered a synchronization error while processing live market data. The terminal shell remains stable.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          variant="outline"
          className="gap-2 font-bold uppercase text-xs tracking-widest px-8 h-12 rounded-xl"
        >
          <RotateCcw className="h-4 w-4" /> Reset Module
        </Button>
        <Link href="/">
          <Button 
            className="gap-2 font-bold uppercase text-xs tracking-widest px-8 h-12 rounded-xl"
          >
            <Home className="h-4 w-4" /> Command Center
          </Button>
        </Link>
      </div>
    </div>
  );
}

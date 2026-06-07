
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Terminal, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 animate-in fade-in duration-500">
      <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-6 border border-border/40">
        <Terminal className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-headline font-bold tracking-tight">404: Route Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The requested intelligence module or asset identifier does not exist in the terminal directory.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="gap-2 font-bold uppercase text-xs tracking-widest px-8 h-12 rounded-xl shadow-xl shadow-primary/20">
            <Home className="h-4 w-4" /> Return to Terminal
          </Button>
        </Link>
        <Button 
          variant="outline"
          onClick={() => window.history.back()}
          className="gap-2 font-bold uppercase text-xs tracking-widest px-8 h-12 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" /> Previous View
        </Button>
      </div>
    </div>
  );
}

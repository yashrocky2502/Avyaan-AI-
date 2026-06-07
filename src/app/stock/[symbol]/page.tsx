
'use client';

import { useParams } from "next/navigation";
import { StockIntelligenceView } from "@/components/stock/stock-intelligence-view";

export default function StockPage() {
  const params = useParams();
  const symbol = params.symbol as string;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <StockIntelligenceView symbol={decodeURIComponent(symbol)} />
    </div>
  );
}

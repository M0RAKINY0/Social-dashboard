"use client";

import { RotateCcw } from "lucide-react";
import type { Reel } from "../../lib/types";
import { EmptyState } from "./ui";
import { ReelCard } from "./reel-card";

export function ReelGrid({ reels, selectedId, onAnalyze, onReset }: { reels: Reel[]; selectedId: string | null; onAnalyze: (reel: Reel) => void; onReset?: () => void }) {
  return (
    <section className="reel-section">
      <div className="section-heading-row"><div><span className="eyebrow">Ranked feed</span><h2>Top Reels — last 30 days</h2></div><span className="result-count">{reels.length} reels</span></div>
      {reels.length ? <div className="reel-grid">{reels.map((reel) => <ReelCard key={reel.id} reel={reel} selected={reel.id === selectedId} onAnalyze={() => onAnalyze(reel)} />)}</div> : <EmptyState title="No reels match these filters" description="Try clearing a filter or widening the search to see more of this competitor's recent posts." action={onReset ? <button className="ghost-button" onClick={onReset}><RotateCcw size={14} />Reset filters</button> : undefined} />}
    </section>
  );
}

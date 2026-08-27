"use client";

import { BookmarkPlus, ExternalLink, Heart, MessageCircle, Play, Send } from "lucide-react";
import type { Reel } from "../../lib/types";
import { formatCompactMetric } from "../../lib/metrics";
import { Pill, PlaceholderThumbnail, ScoreRing, PerformanceBadge } from "./ui";

function readableDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ReelCard({ reel, selected, onAnalyze }: { reel: Reel; selected: boolean; onAnalyze: () => void }) {
  const videoAvailable = Boolean(reel.mediaUrl);
  return (
    <article
      className={`reel-card${selected ? " reel-card-selected" : ""}`}
      role="button"
      tabIndex={0}
      onClick={onAnalyze}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onAnalyze(); } }}
      aria-label={`Analyze Reel ${reel.rank ?? ""}: ${reel.hook ?? reel.caption ?? "Untitled Reel"}`}
    >
      <div className="reel-media">
        {videoAvailable ? (
          <video className="reel-video" src={reel.mediaUrl} muted loop playsInline onMouseEnter={(event) => void event.currentTarget.play()} onMouseLeave={(event) => { event.currentTarget.pause(); event.currentTarget.currentTime = 0; }} />
        ) : <PlaceholderThumbnail imageUrl={reel.thumbnailUrl} tone={reel.thumbnailTone} label={reel.hook ?? reel.caption ?? "Reel thumbnail unavailable"} />}
        <PerformanceBadge rank={reel.rank} />
        <span className="duration-chip">{reel.durationSec ? `0:${String(reel.durationSec).padStart(2, "0")}` : "—"}</span>
        <span className="media-score"><ScoreRing score={reel.performanceScore} /></span>
        <div className="quick-actions">
          <a href={reel.videoUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="quick-action"><ExternalLink size={13} />Open Reel</a>
          <button onClick={(event) => event.stopPropagation()} className="quick-action"><BookmarkPlus size={13} />Save</button>
        </div>
        {reel.source === "demo" ? <span className="demo-ribbon">DEMO</span> : null}
      </div>
      <div className="reel-body">
        <h3>{reel.hook ? `“${reel.hook}”` : reel.caption ?? "Untitled Reel"}</h3>
        <p className="reel-caption">{reel.caption ?? "Caption not available"}</p>
        <div className="reel-metrics" aria-label="Reel metrics">
          <span><Play size={12} fill="currentColor" />{formatCompactMetric(reel.views)}</span>
          <span><Heart size={12} />{formatCompactMetric(reel.likes)}</span>
          <span><MessageCircle size={12} />{formatCompactMetric(reel.comments)}</span>
          <span><BookmarkPlus size={12} />{formatCompactMetric(reel.saves)}</span>
          <span>ER {reel.engagementRate === null || reel.engagementRate === undefined ? "—" : `${reel.engagementRate.toFixed(1)}%`}</span>
        </div>
        <div className="reel-chips"><Pill tone="stone">{reel.pillar ?? "Not available"}</Pill><Pill tone="blue">{reel.format ?? "Not available"}</Pill><Pill tone="stone">{reel.cta ?? "CTA unavailable"}</Pill></div>
        <div className="reel-footer"><span>{readableDate(reel.publishedAt)}</span><button onClick={(event) => { event.stopPropagation(); onAnalyze(); }}>Analyze Reel <Send size={13} /></button></div>
      </div>
    </article>
  );
}

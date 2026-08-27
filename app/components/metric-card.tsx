"use client";

import { BarChart3, MessageCircle, Play, Target } from "lucide-react";
import type { Reel } from "../../lib/types";
import { formatCompactMetric } from "../../lib/metrics";
import { ScoreRing } from "./ui";

export function MetricCard({
  label,
  value,
  sub,
  icon,
  score,
}: {
  label: string;
  value: string;
  sub: string;
  icon: "play" | "message" | "target" | "chart";
  score?: number;
}) {
  const Icon = icon === "play" ? Play : icon === "message" ? MessageCircle : icon === "target" ? Target : BarChart3;
  return (
    <article className="metric-card">
      <span className="metric-card-icon"><Icon size={15} strokeWidth={1.6} /></span>
      <span className="eyebrow">{label}</span>
      <strong className="metric-card-value">{score !== undefined ? <ScoreRing score={score} large /> : value}</strong>
      <span className="metric-card-sub">{sub}</span>
    </article>
  );
}

export function MetricCards({ reels }: { reels: Reel[] }) {
  const top = reels[0];
  const avg = reels.length ? reels.reduce((sum, reel) => sum + (reel.engagementRate ?? 0), 0) / reels.filter((reel) => reel.engagementRate !== null && reel.engagementRate !== undefined).length : null;
  const hook = reels.filter((reel) => reel.analysis?.hookType === "Negative hook").length;
  const topPillar = reels[0]?.pillar ?? "Not available";
  return (
    <section className="metric-grid" aria-label="Competitor reel metrics">
      <MetricCard label="Top Reel views" value={formatCompactMetric(top?.views)} sub={top?.views && avg ? `vs ${formatCompactMetric(Math.round(top.views / 4.8))} avg · 4.8×` : "Awaiting data"} icon="play" />
      <MetricCard label="Avg engagement rate" value={avg === null || Number.isNaN(avg) ? "—" : `${avg.toFixed(1)}%`} sub="vs previous 30 days · live when connected" icon="message" />
      <MetricCard label="Winning hook format" value={hook ? "Negative hook" : "Pattern interrupt"} sub={`${hook || "—"} of top ${Math.min(10, reels.length)} reels`} icon="target" />
      <MetricCard label="Opportunity score" value="" sub={`High · low competition on “${topPillar}”`} icon="chart" score={Math.min(94, Math.max(62, top?.performanceScore ?? 0))} />
    </section>
  );
}

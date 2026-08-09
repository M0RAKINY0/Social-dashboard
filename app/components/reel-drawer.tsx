"use client";

import { ArrowUp, Bookmark, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, FileText, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Competitor, Reel } from "../../lib/types";
import { formatCompactMetric } from "../../lib/metrics";
import { buildFramework } from "../../lib/templates";
import { MetricBar, MissingValue, PlaceholderThumbnail, ScoreRing } from "./ui";
import { TranscriptBlock } from "./transcript-block";

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function stat(value?: number | null) {
  return value === null || value === undefined ? <MissingValue /> : formatCompactMetric(value);
}

export function ReelDrawer({
  reel,
  competitor,
  averageViews,
  averageEr,
  onClose,
  onMove,
  onGenerate,
  onAddToPlan,
  onToast,
}: {
  reel: Reel;
  competitor: Competitor;
  averageViews?: number | null;
  averageEr?: number | null;
  onClose: () => void;
  onMove: (direction: "prev" | "next") => void;
  onGenerate: () => void;
  onAddToPlan: () => void;
  onToast: (message: string, detail?: string) => void;
}) {
  const drawerRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const framework = reel.framework ?? buildFramework(reel);

  useEffect(() => {
    drawerRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "j" || event.key === "ArrowDown") onMove("next");
      if (event.key === "k" || event.key === "ArrowUp") onMove("prev");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onMove]);

  const copyFramework = async () => {
    await navigator.clipboard?.writeText(framework.map((step, index) => `${index + 1}. ${step.name} — ${step.guidance}`).join("\n"));
    setCopied(true);
    onToast("Template copied", "Structure saved to your clipboard");
    window.setTimeout(() => setCopied(false), 1200);
  };

  const metrics = [
    ["Views", stat(reel.views), reel.views, averageViews],
    ["Likes", stat(reel.likes), reel.likes, null],
    ["Comments", stat(reel.comments), reel.comments, null],
    ["Saves", stat(reel.saves), reel.saves, null],
    ["Shares", stat(reel.shares), reel.shares, null],
    ["ER", reel.engagementRate === null || reel.engagementRate === undefined ? <MissingValue /> : `${reel.engagementRate.toFixed(1)}%`, reel.engagementRate, averageEr],
  ] as const;

  return (
    <div className="drawer-layer">
      <button className="drawer-scrim" onClick={onClose} aria-label="Close reel details" />
      <aside className="reel-drawer" ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`Reel analysis: ${reel.hook ?? reel.caption ?? "Untitled Reel"}`}>
        <div className="drawer-header"><span className="eyebrow">Reel #{reel.rank ?? "—"} of {competitor.trackedReelsCount || "—"}</span><div className="drawer-header-actions"><button className="icon-button" onClick={() => onMove("prev")} aria-label="Previous reel"><ChevronLeft size={16} /></button><button className="icon-button" onClick={() => onMove("next")} aria-label="Next reel"><ChevronRight size={16} /></button><button className="icon-button" onClick={onClose} aria-label="Close details"><X size={17} /></button></div></div>
        <div className="drawer-scroll">
          <section className="drawer-preview">
            <div className="drawer-thumb">{reel.mediaUrl ? <video src={reel.mediaUrl} controls playsInline /> : <PlaceholderThumbnail tone={reel.thumbnailTone} label={reel.hook ?? "Reel preview unavailable"} />}</div>
            <div className="drawer-preview-copy"><h2>{reel.hook ? `“${reel.hook}”` : reel.caption ?? "Untitled Reel"}</h2><span className="drawer-meta">@{competitor.handle} · {dateLabel(reel.publishedAt)} · {reel.durationSec ? `${reel.durationSec}s` : "—"}</span><a className="external-link" href={reel.videoUrl} target="_blank" rel="noopener noreferrer">instagram.com/reel/… <ExternalLink size={13} /></a><div className="drawer-score"><ScoreRing score={reel.performanceScore} large /><span>Performance {reel.performanceScore}</span></div></div>
          </section>

          <section className="drawer-section"><div className="drawer-section-title"><span className="eyebrow">ENGAGEMENT</span><span>vs. competitor average</span></div><div className="drawer-metric-grid">{metrics.map(([label, value, current, average]) => <div className="drawer-metric" key={label}><span>{label}</span><strong>{value}</strong><MetricBar value={current} average={average} /><small>{average && current ? `${(current / average).toFixed(1)}× avg` : "Not available"}</small></div>)}</div><p className="rank-line">Ranks <strong>#{reel.rank ?? "—"}</strong> of {competitor.trackedReelsCount || "—"} this period <span className="rank-signal"><ArrowUp size={12} /> performance-led</span></p></section>

          <section className="drawer-section"><TranscriptBlock transcript={reel.transcript} /></section>

          <section className="drawer-section"><div className="drawer-section-title"><span className="eyebrow">WHY IT WORKED</span><span>Pattern analysis</span></div><dl className="analysis-list"><div><dt>Hook type</dt><dd>{reel.analysis?.hookType ?? <MissingValue />}</dd></div><div><dt>Content angle</dt><dd>{reel.analysis?.angle ?? <MissingValue />}</dd></div><div><dt>Pain point</dt><dd>{reel.analysis?.painPoint ?? <MissingValue />}</dd></div><div><dt>Curiosity gap</dt><dd>{reel.analysis?.curiosityGap ?? <MissingValue />}</dd></div><div><dt>Pacing</dt><dd>{reel.analysis?.pacing ?? <MissingValue />}</dd></div><div><dt>CTA style</dt><dd>{reel.analysis?.ctaStyle ?? <MissingValue />}</dd></div><div><dt>Visual format</dt><dd>{reel.analysis?.visualFormat ?? reel.format ?? <MissingValue />}</dd></div><div className="analysis-formula"><dt>Repeatable structure</dt><dd>{reel.analysis?.structureFormula ?? <MissingValue />}</dd></div></dl></section>

          <section className="drawer-section"><div className="framework-heading"><span className="dark-eyebrow">{"// SCRIPT FRAMEWORK \\"}</span><button className="dark-icon-button" onClick={copyFramework} aria-label="Copy framework">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div><div className="dark-panel framework-panel"><p className="ethics-line">Structure, not wording. Use this skeleton to write an original Reel — never copy the source script.</p>{framework.map((step, index) => <div className="framework-step" key={step.name}><span>{index + 1}.</span><strong>{step.name}</strong><p>{step.guidance}</p></div>)}</div></section>
        </div>
        <footer className="drawer-footer"><button className="primary-button" onClick={onGenerate}><FileText size={15} />Generate my version</button><button className="outline-button" onClick={onAddToPlan}><Plus size={15} />Add to content plan</button><button className="icon-button" onClick={() => onToast("Template saved", "Find it in Scripts") } aria-label="Save template"><Bookmark size={16} /></button></footer>
      </aside>
    </div>
  );
}

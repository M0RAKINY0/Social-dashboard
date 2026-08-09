"use client";

import type { CSSProperties, ReactNode } from "react";
import { Check, CircleAlert, FileX, Info, Play } from "lucide-react";
import { formatCompactMetric } from "../../lib/metrics";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RR";
}

export function Avatar({
  name,
  src,
  size = "md",
  active = false,
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  active?: boolean;
}) {
  return (
    <span className={`avatar avatar-${size}${active ? " avatar-active" : ""}`} aria-label={`${name} avatar`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
}

export function ScoreRing({ score, large = false }: { score: number; large?: boolean }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = large ? 23 : 13;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;
  const stroke = safeScore >= 80 ? "var(--brand-yellow)" : safeScore >= 50 ? "var(--brand-blue)" : "var(--stone-300)";
  return (
    <span className={`score-ring${large ? " score-ring-large" : ""}`} aria-label={`Performance score ${safeScore} of 100`}>
      <svg viewBox="0 0 56 56" aria-hidden="true">
        <circle className="score-ring-track" cx="28" cy="28" r={radius} />
        <circle
          className="score-ring-progress"
          cx="28"
          cy="28"
          r={radius}
          stroke={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span>{safeScore}</span>
    </span>
  );
}

export function PerformanceBadge({ rank }: { rank?: number }) {
  const safeRank = rank ?? 0;
  return <span className={`rank-badge rank-${safeRank <= 3 ? safeRank : "other"}`}>#{safeRank || "—"}</span>;
}

export function MetricBar({ value, average }: { value?: number | null; average?: number | null }) {
  const max = Math.max(value ?? 0, average ?? 0, 1);
  const width = `${Math.min(100, ((value ?? 0) / max) * 100)}%`;
  const marker = `${Math.min(100, ((average ?? 0) / max) * 100)}%`;
  return (
    <span className="metric-bar" aria-hidden="true">
      <span className="metric-bar-fill" style={{ width }} />
      <span className="metric-bar-marker" style={{ left: marker }} />
    </span>
  );
}

export function Pill({ children, tone = "stone", active = false }: { children: ReactNode; tone?: "stone" | "blue" | "yellow" | "green" | "red" | "dark"; active?: boolean }) {
  return <span className={`pill pill-${tone}${active ? " pill-active" : ""}`}>{children}</span>;
}

export function MissingValue({ label = "Not provided by source" }: { label?: string }) {
  return (
    <span className="missing-value" title={label}>
      —
    </span>
  );
}

export function MetricValue({ value, suffix = "" }: { value?: number | null; suffix?: string }) {
  return value === null || value === undefined ? <MissingValue /> : <>{formatCompactMetric(value)}{suffix}</>;
}

export function EmptyState({ icon = "info", title, description, action }: { icon?: "info" | "file" | "alert"; title: string; description: string; action?: ReactNode }) {
  const Icon = icon === "file" ? FileX : icon === "alert" ? CircleAlert : Info;
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon size={20} strokeWidth={1.6} /></span>
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />;
}

export function Toast({ message, detail, action, onAction, onClose }: { message: string; detail?: string; action?: string; onAction?: () => void; onClose?: () => void }) {
  return (
    <div className="toast" role="status">
      <span className="toast-check"><Check size={15} /></span>
      <span className="toast-copy"><strong>{message}</strong>{detail ? <small>{detail}</small> : null}</span>
      {action && onAction ? <button className="toast-action" onClick={onAction}>{action}</button> : null}
      {onClose ? <button className="icon-button toast-close" onClick={onClose} aria-label="Close notification">×</button> : null}
    </div>
  );
}

export function PlaceholderThumbnail({ tone = "stone", label = "Reel thumbnail unavailable" }: { tone?: string; label?: string }) {
  const style = { "--thumbnail-tone": `var(--thumbnail-${tone})` } as CSSProperties;
  return (
    <div className="thumbnail-placeholder" style={style} role="img" aria-label={label}>
      <span className="thumbnail-grid" aria-hidden="true" />
      <span className="play-disc" aria-hidden="true"><Play size={16} fill="currentColor" /></span>
      <span className="thumbnail-label">Preview unavailable</span>
    </div>
  );
}

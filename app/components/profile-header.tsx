"use client";

import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Competitor, Reel } from "../../lib/types";
import { formatCompactMetric } from "../../lib/metrics";
import { Avatar, MissingValue, Pill } from "./ui";

export function ProfileHeader({ competitor, reels, onGenerate }: { competitor: Competitor; reels: Reel[]; onGenerate: () => void }) {
  const avgViews = competitor.avgViews ?? (reels.length ? reels.reduce((sum, reel) => sum + (reel.views ?? 0), 0) / reels.length : null);
  const avgEr = competitor.avgEngagementRate ?? (reels.length ? reels.reduce((sum, reel) => sum + (reel.engagementRate ?? 0), 0) / reels.filter((reel) => reel.engagementRate !== null && reel.engagementRate !== undefined).length : null);
  return (
    <section className="profile-header">
      <div className="profile-banner" aria-hidden="true"><span>@{competitor.handle}</span></div>
      <div className="profile-main-row">
        <Avatar name={competitor.displayName} src={competitor.avatarUrl} size="lg" active />
        <div className="profile-title-block">
          <div className="profile-title-line"><h1>{competitor.displayName}</h1><Pill tone="stone">{competitor.category ?? "Instagram competitor"}</Pill></div>
          <span className="handle-line">@{competitor.handle} · {competitor.bio ?? "Profile details not provided by source"}</span>
        </div>
        <div className="profile-actions">
          <a className="outline-button" href={competitor.profileUrl} target="_blank" rel="noopener noreferrer">Open profile <ExternalLink size={14} /></a>
          <button className="primary-button" onClick={onGenerate}>Generate script <ArrowUpRight size={15} /></button>
        </div>
      </div>
      <div className="profile-stats">
        <div><span>Followers</span><strong>{formatCompactMetric(competitor.followers)}</strong>{competitor.trendVsPrev30d !== null && competitor.trendVsPrev30d !== undefined ? <small className={competitor.trendVsPrev30d >= 0 ? "positive" : "negative"}>{competitor.trendVsPrev30d >= 0 ? "▲" : "▼"} {Math.abs(competitor.trendVsPrev30d)}%</small> : <MissingValue />}</div>
        <div><span>Reels analyzed</span><strong>{reels.length || <MissingValue />}</strong><small>last 30 days</small></div>
        <div><span>Avg views</span><strong>{formatCompactMetric(avgViews)}</strong><small>per Reel</small></div>
        <div><span>Avg ER</span><strong>{avgEr === null || Number.isNaN(avgEr) ? <MissingValue /> : `${avgEr.toFixed(1)}%`}</strong><small>engagement rate</small></div>
        <div><span>Posting freq</span><strong>{competitor.postingFreqPerWeek ? `${competitor.postingFreqPerWeek.toFixed(1)}` : <MissingValue />}</strong><small>Reels / week</small></div>
      </div>
      <div className="profile-meta-line"><span>Best pillar: <strong>{competitor.topPillar ?? <MissingValue />}</strong></span><span>Best format: <strong>{reels[0]?.format ?? <MissingValue />}</strong></span></div>
    </section>
  );
}

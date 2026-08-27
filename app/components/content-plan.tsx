"use client";

import { ArrowUpRight, Check, ChevronDown, ExternalLink, MoreHorizontal, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { PlanIdea, PlanStatus, Reel } from "../../lib/types";
import { ScoreRing, EmptyState, Pill } from "./ui";

const statuses: { value: PlanStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready to script" },
  { value: "saved", label: "Saved" },
  { value: "review", label: "Needs review" },
];

export function ContentPlan({ ideas, reels, onUpdateStatus, onCreateIdea }: { ideas: PlanIdea[]; reels: Reel[]; onUpdateStatus: (id: string, status: PlanStatus) => void; onCreateIdea: () => void }) {
  const [tab, setTab] = useState<"all" | "ready" | "drafts">("all");
  const visible = ideas.filter((idea) => tab === "all" || (tab === "ready" ? idea.status === "ready" : idea.status === "draft"));
  return (
    <div className="page-view plan-view">
      <div className="page-header"><div><span className="eyebrow">Evidence-backed ideas</span><h1>Content plan</h1><p>Turn winning competitor patterns into original Reels worth testing.</p></div><button className="primary-button" onClick={onCreateIdea}><Plus size={15} />New idea</button></div>
      <div className="sub-tabs"><button className={tab === "all" ? "sub-tab-active" : ""} onClick={() => setTab("all")}>All <span>{ideas.length}</span></button><button className={tab === "ready" ? "sub-tab-active" : ""} onClick={() => setTab("ready")}>Ready <span>{ideas.filter((idea) => idea.status === "ready").length}</span></button><button className={tab === "drafts" ? "sub-tab-active" : ""} onClick={() => setTab("drafts")}>Drafts <span>{ideas.filter((idea) => idea.status === "draft").length}</span></button></div>
      <div className="plan-table">
        {visible.length ? visible.map((idea) => {
          const source = reels.find((reel) => reel.id === idea.sourceReelIds[0]);
          return <article key={idea.id} className="plan-row"><ScoreRing score={idea.priorityScore} /><div className="plan-idea-copy"><h3>{idea.title}</h3><p>“{idea.suggestedHook ?? "Original hook not available"}”</p><div className="plan-tags"><Pill tone="stone">{idea.pillar ?? "Not available"}</Pill><Pill tone="blue">{idea.suggestedCta ?? "CTA not available"}</Pill></div><small>Based on: {source?.format ?? "Reel"} from @{source?.competitorHandle ?? "competitor"} averaging {source?.engagementRate ? `${source.engagementRate.toFixed(1)}% ER` : "—"} · <a href={source?.videoUrl} target="_blank" rel="noopener noreferrer">View source <ExternalLink size={11} /></a></small></div><div className="plan-status-field"><span className={`status-select status-${idea.status}`}><select value={idea.status} onChange={(event) => onUpdateStatus(idea.id, event.target.value as PlanStatus)} aria-label={`Status for ${idea.title}`}>{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select><ChevronDown size={13} /></span><button className="icon-button" aria-label={`More actions for ${idea.title}`}><MoreHorizontal size={16} /></button></div></article>;
        }) : <EmptyState title="No ideas yet" description="Analyze a Reel and add it here to start a focused content queue." action={<button className="ghost-button" onClick={onCreateIdea}><RotateCcw size={14} />Create from a winning Reel</button>} />}
      </div>
      <div className="plan-note"><Check size={14} /><span>Ethical remix rule: every idea keeps the structure, never the competitor&apos;s wording.</span><ArrowUpRight size={14} /></div>
    </div>
  );
}

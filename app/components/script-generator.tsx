"use client";

import { Check, Copy, FileText, LayoutTemplate, RefreshCw, Save, Send } from "lucide-react";
import { useState } from "react";
import type { FrameworkStep, Reel, ScriptDraft } from "../../lib/types";
import { generateOriginalScript } from "../../lib/templates";
import { Pill, PlaceholderThumbnail } from "./ui";

export function ScriptGenerator({ sourceReel, onToast }: { sourceReel?: Reel; onToast: (message: string, detail?: string) => void }) {
  const [goal, setGoal] = useState<"Grow followers" | "Drive comments" | "Sell">("Grow followers");
  const [angle, setAngle] = useState("Your angle: make the structure true for your audience");
  const [draft, setDraft] = useState<ScriptDraft | null>(sourceReel ? generateOriginalScript(sourceReel, sourceReel.framework ?? [], goal) : null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!sourceReel) return;
    setGenerating(true);
    window.setTimeout(() => {
      setDraft(generateOriginalScript({ ...sourceReel, topic: angle }, sourceReel.framework ?? [], goal));
      setGenerating(false);
    }, 800);
  };

  const copy = async () => {
    if (!draft) return;
    await navigator.clipboard?.writeText([draft.hook, draft.body, draft.payoff, draft.cta].join("\n\n"));
    setCopied(true);
    onToast("Script copied", "Original draft is ready to edit");
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="page-view scripts-view">
      <div className="page-header"><div><span className="eyebrow">Original draft studio</span><h1>Scripts</h1><p>Reuse the strategic shape. Write the proof in your own voice.</p></div><Pill tone="stone">Structure, not wording</Pill></div>
      <div className="generator-grid">
        <section className="config-card"><span className="eyebrow">Source Reel</span>{sourceReel ? <div className="source-reel-mini"><div className="mini-thumb"><PlaceholderThumbnail imageUrl={sourceReel.thumbnailUrl} tone={sourceReel.thumbnailTone} /></div><div><strong>{sourceReel.hook ? `“${sourceReel.hook}”` : "Untitled Reel"}</strong><small>@{sourceReel.competitorHandle} · score {sourceReel.performanceScore}</small></div></div> : <div className="source-empty"><FileText size={18} /><span>Choose a Reel from the ranked feed to begin.</span></div>}<label className="field-label">Template<select aria-label="Template selection"><option>Ethical remix framework</option><option>Contrarian claim framework</option><option>Case study framework</option></select></label><label className="field-label">Your angle<textarea value={angle} onChange={(event) => setAngle(event.target.value)} rows={4} aria-label="Your angle" /></label><label className="field-label">Goal<select value={goal} onChange={(event) => setGoal(event.target.value as typeof goal)} aria-label="Script goal"><option>Grow followers</option><option>Drive comments</option><option>Sell</option></select></label><button className="primary-button full-width" onClick={generate} disabled={!sourceReel || generating}>{generating ? <><RefreshCw size={15} className="spin" />Building original draft</> : <><LayoutTemplate size={15} />Generate script</>}</button></section>
        <section className={`script-output${generating ? " script-output-generating" : ""}`}>{draft && !generating ? <><div className="script-output-head"><span className="dark-eyebrow">ORIGINAL SCRIPT DRAFT</span><span className="script-output-source">Built from structure analysis</span></div><div className="script-section"><span className="dark-eyebrow">HOOK</span><p>{draft.hook}</p></div><div className="script-section"><span className="dark-eyebrow">BODY</span><p>{draft.body}</p><small>{"// shot: cut to one concrete proof point"}</small></div><div className="script-section"><span className="dark-eyebrow">PAYOFF</span><p>{draft.payoff}</p></div><div className="script-section"><span className="dark-eyebrow">CTA</span><p>{draft.cta}</p></div><div className="script-actions"><button className="dark-outline-button" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy draft"}</button><button className="dark-outline-button" onClick={() => onToast("Saved to scripts", "Your original draft is ready to revisit")}><Save size={14} />Save to scripts</button><button className="dark-icon-button" onClick={generate} aria-label="Regenerate script"><RefreshCw size={14} /></button></div><p className="script-disclaimer">{draft.disclaimer}</p></> : generating ? <><div className="script-output-head"><span className="dark-eyebrow">GENERATING ORIGINAL DRAFT</span><span className="script-output-source">Structure-first pass</span></div><span className="script-skeleton-line wide" /><span className="script-skeleton-line" /><span className="script-skeleton-line medium" /><span className="script-skeleton-gap" /><span className="script-skeleton-line wide" /><span className="script-skeleton-line medium" /></> : <div className="script-placeholder"><span><FileText size={21} /></span><strong>Your script will appear here</strong><p>Select a Reel and give the structure an original angle.</p><Send size={17} /></div>}</section>
      </div>
      <section className="saved-frameworks"><div className="section-heading-row"><div><span className="eyebrow">Reusable structures</span><h2>Saved frameworks</h2></div><span className="result-count">3 templates</span></div><div className="framework-card-grid">{["Negative hook → Contrarian rule", "Constraint → Clear example", "Story → Practical takeaway"].map((name, index) => <article className="saved-framework-card" key={name}><div className="saved-framework-head"><strong>{name}</strong><Pill tone="stone">From @{sourceReel?.competitorHandle ?? "raycfu"} #{index + 1}</Pill></div><div className="saved-framework-steps"><span>1. HOOK</span><span>2. SETUP</span><span>3. TENSION</span><span>4. INSIGHT</span><span>5. EXAMPLE</span><span>6. CTA</span></div><div className="saved-framework-footer"><small>Used {index + 1}×</small><button className="outline-button" onClick={generate}>Generate my version</button></div></article>)}</div></section>
    </div>
  );
}

export type { FrameworkStep };

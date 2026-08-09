"use client";

import { Check, Copy, FileX } from "lucide-react";
import { useState } from "react";
import type { TranscriptLine } from "../../lib/types";

export function TranscriptBlock({ transcript }: { transcript?: TranscriptLine[] }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!transcript?.length) return;
    await navigator.clipboard?.writeText(transcript.map((line) => line.text).join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  if (!transcript?.length) {
    return <div className="dark-panel transcript-empty"><span className="dark-empty-icon"><FileX size={18} /></span><strong>Transcript not available for this Reel</strong><small>SocialCrawl did not provide a transcript for this source.</small><button className="dark-outline-button">Request transcription</button></div>;
  }

  const visible = expanded ? transcript : transcript.slice(0, 5);
  return (
    <div className="dark-panel transcript-panel">
      <div className="dark-panel-heading"><span className="dark-eyebrow">TRANSCRIPT</span><button className="dark-icon-button" onClick={copy} aria-label="Copy transcript">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
      <div className="transcript-lines">
        {visible.map((line, index) => <p key={`${line.t ?? index}-${line.text}`} className={`transcript-line transcript-${line.kind ?? "body"}`}><span className="transcript-time">[{line.t === undefined ? "—" : `00:${String(Math.round(line.t)).padStart(2, "0")}`}]</span><span>{line.text}</span></p>)}
      </div>
      {transcript.length > 5 ? <button className="transcript-expander" onClick={() => setExpanded((value) => !value)}>{expanded ? "Collapse transcript" : "Show full transcript"}</button> : null}
    </div>
  );
}

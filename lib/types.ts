export type DataSource = "live" | "demo" | "unavailable";

export type ReelFormat =
  | "Talking head"
  | "Tutorial"
  | "Story"
  | "Hot take"
  | "Founder POV"
  | "Case study"
  | "Trend remix";

export type TranscriptKind = "hook" | "cta" | "beat" | "body";

export interface TranscriptLine {
  t?: number;
  text: string;
  kind?: TranscriptKind;
}

export interface FrameworkStep {
  name: string;
  guidance: string;
}

export interface ReelAnalysis {
  hookType?: string;
  angle?: string;
  painPoint?: string;
  curiosityGap?: string;
  pacing?: string;
  ctaStyle?: string;
  visualFormat?: string;
  structureFormula?: string;
}

export interface Reel {
  id: string;
  competitorHandle: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  caption?: string;
  transcript?: TranscriptLine[];
  publishedAt: string;
  views?: number | null;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  saves?: number | null;
  durationSec?: number | null;
  audioName?: string | null;
  hook?: string | null;
  cta?: string | null;
  topic?: string | null;
  pillar?: string | null;
  format?: ReelFormat | null;
  performanceScore: number;
  rank?: number;
  engagementRate?: number | null;
  analysis?: ReelAnalysis;
  framework?: FrameworkStep[];
  source?: DataSource;
  thumbnailTone?: "stone" | "sand" | "slate" | "ink";
}

export interface Competitor {
  handle: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  category?: string;
  profileUrl: string;
  followers?: number | null;
  following?: number | null;
  totalPosts?: number | null;
  trackedReelsCount: number;
  avgViews?: number | null;
  avgEngagementRate?: number | null;
  topPillar?: string | null;
  postingFreqPerWeek?: number | null;
  trendVsPrev30d?: number | null;
  source?: DataSource;
}

export type PlanStatus = "draft" | "ready" | "saved" | "review";

export interface PlanIdea {
  id: string;
  title: string;
  suggestedHook?: string;
  pillar?: string;
  suggestedCta?: string;
  priorityScore: number;
  rationale: string;
  sourceReelIds: string[];
  status: PlanStatus;
}

export interface ScriptDraft {
  hook: string;
  body: string;
  payoff: string;
  cta: string;
  shotNotes: string[];
  caption: string;
  disclaimer: string;
}

export interface DatasetResult {
  competitor: Competitor;
  reels: Reel[];
  source: DataSource;
  lastSynced?: string;
  warning?: string;
}

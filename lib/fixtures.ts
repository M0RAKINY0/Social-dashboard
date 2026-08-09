import { averageMetric, scoreAndRankReels } from "./metrics";
import { buildFramework } from "./templates";
import type { Competitor, DatasetResult, Reel, TranscriptLine } from "./types";

const now = new Date();

function daysAgo(days: number): string {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

function transcript(hook: string, cta: string, angle: string): TranscriptLine[] {
  return [
    { t: 0, text: hook, kind: "hook" },
    { t: 3, text: `Here is the part most people miss about ${angle}.`, kind: "body" },
    { t: 9, text: "The useful move is to name the constraint before choosing the tactic.", kind: "beat" },
    { t: 18, text: "Try it once, measure the signal, and keep the proof you can repeat.", kind: "body" },
    { t: 28, text: cta, kind: "cta" },
  ];
}

function makeReel(
  handle: string,
  index: number,
  values: { views: number; likes: number; comments: number; saves?: number | null; shares?: number | null; hook: string; caption: string; cta: string; pillar: string; format: Reel["format"]; topic: string; angle: string; tone: Reel["thumbnailTone"] },
): Reel {
  const missingTranscript = index === 4 || index === 9;
  const reel: Reel = {
    id: `${handle}-demo-${index + 1}`,
    competitorHandle: handle,
    videoUrl: `https://www.instagram.com/${handle}/`,
    publishedAt: daysAgo([1, 3, 5, 7, 9, 12, 15, 18, 21, 24, 27, 29][index] ?? 29),
    views: values.views,
    likes: values.likes,
    comments: values.comments,
    shares: values.shares ?? Math.round(values.likes * 0.08),
    saves: values.saves ?? Math.round(values.likes * 0.14),
    durationSec: 28 + (index % 4) * 7,
    audioName: index % 3 === 0 ? "Original audio" : "Creator voiceover",
    caption: values.caption,
    hook: values.hook,
    cta: values.cta,
    topic: values.topic,
    pillar: values.pillar,
    format: values.format,
    thumbnailTone: values.tone,
    performanceScore: 0,
    source: "demo",
    analysis: {
      hookType: index % 2 ? "Contrarian claim" : "Negative hook",
      angle: values.angle,
      painPoint: "Spending effort on the visible symptom instead of the constraint",
      curiosityGap: "The fix is simpler than the audience expects",
      pacing: `avg shot ${(1.4 + (index % 4) * 0.2).toFixed(1)}s`,
      ctaStyle: index % 2 ? "Comment keyword" : "Save + follow",
      visualFormat: values.format ?? "Talking head",
      structureFormula: "Claim → cost → rule → proof → invitation",
    },
  };
  if (!missingTranscript) reel.transcript = transcript(values.hook, values.cta, values.angle);
  reel.framework = buildFramework(reel);
  return reel;
}

const reelSpecs: Record<string, Parameters<typeof makeReel>[2][]> = {
  raycfu: [
    { views: 412000, likes: 18200, comments: 942, saves: 3100, hook: "Stop building features nobody asked for", caption: "The roadmap signal is usually hiding in the constraint.", cta: 'Comment "GUIDE" for the checklist', pillar: "Product strategy", format: "Talking head", topic: "Product decisions", angle: "Roadmap discipline", tone: "ink" },
    { views: 286000, likes: 12900, comments: 611, hook: "Your SaaS pricing page is not a spreadsheet", caption: "Make the tradeoff obvious before you add another tier.", cta: "Save this for your next pricing review", pillar: "Founder POV", format: "Hot take", topic: "Pricing", angle: "Pricing clarity", tone: "sand" },
    { views: 198000, likes: 8800, comments: 388, hook: "The best growth loop starts with a no", caption: "A smaller audience with a sharper problem beats broad reach.", cta: "Follow for more founder systems", pillar: "Growth", format: "Founder POV", topic: "Growth loops", angle: "Focused distribution", tone: "stone" },
    { views: 164000, likes: 7400, comments: 274, hook: "I would not hire for this job yet", caption: "Before headcount, fix the handoff that keeps breaking.", cta: "Comment TEAM if this is familiar", pillar: "Hiring", format: "Story", topic: "Hiring", angle: "Hiring timing", tone: "slate" },
    { views: 143000, likes: 6700, comments: 220, shares: null, saves: null, hook: "A dashboard can hide the real problem", caption: "One leading signal is better than ten vanity charts.", cta: "Save the signal, not the screenshot", pillar: "Analytics", format: "Tutorial", topic: "Metrics", angle: "Signal design", tone: "sand" },
    { views: 121000, likes: 5100, comments: 190, hook: "Your first user interview question is wrong", caption: "Ask for the last time, not the hypothetical future.", cta: "Comment INTERVIEW for the prompt", pillar: "Research", format: "Talking head", topic: "User research", angle: "Better questions", tone: "stone" },
    { views: 99000, likes: 4600, comments: 180, hook: "The fastest teams delete more than they ship", caption: "A product cut is a strategy decision, not a failure.", cta: "Share this with your product lead", pillar: "Product strategy", format: "Hot take", topic: "Prioritization", angle: "Strategic subtraction", tone: "ink" },
    { views: 81000, likes: 3200, comments: 118, hook: "Do not copy your competitor's content calendar", caption: "Borrow the pattern, then own the proof.", cta: "Follow for original content systems", pillar: "Content", format: "Founder POV", topic: "Competitive research", angle: "Ethical remixing", tone: "slate" },
    { views: 68000, likes: 2900, comments: 101, hook: "The feature request is not the requirement", caption: "Translate the request into the job behind it.", cta: "Save this before your next planning meeting", pillar: "Product strategy", format: "Tutorial", topic: "Feature requests", angle: "Jobs over requests", tone: "stone" },
    { views: 52000, likes: 2300, comments: 86, hook: "A founder update should not read like a press release", caption: "Tell the decision and the cost, not just the win.", cta: "Comment UPDATE for the outline", pillar: "Founder POV", format: "Story", topic: "Founder updates", angle: "Transparent storytelling", tone: "sand" },
    { views: 34000, likes: 1500, comments: 62, hook: "The quiet launch is usually a positioning problem", caption: "Distribution cannot rescue a vague promise.", cta: "Follow for practical positioning", pillar: "Growth", format: "Talking head", topic: "Launches", angle: "Clear positioning", tone: "slate" },
    { views: 18000, likes: 690, comments: 34, hook: "You do not need another productivity system", caption: "Make the next decision smaller.", cta: "Save this for Monday", pillar: "Founder POV", format: "Talking head", topic: "Focus", angle: "Smaller decisions", tone: "stone" },
  ],
  mavgpt: [
    { views: 244000, likes: 11600, comments: 510, hook: "Your AI workflow is too complicated", caption: "The best system is the one your team repeats.", cta: "Comment FLOW for the map", pillar: "AI workflows", format: "Tutorial", topic: "AI workflow", angle: "Simple systems", tone: "ink" },
    { views: 172000, likes: 7400, comments: 281, hook: "Prompt libraries are not a moat", caption: "The context around the prompt is what compounds.", cta: "Save this for your next build", pillar: "AI strategy", format: "Hot take", topic: "Prompting", angle: "Context advantage", tone: "sand" },
    { views: 91000, likes: 4100, comments: 166, hook: "Automate the handoff, not the judgment", caption: "Keep the important decision visible.", cta: "Follow for better AI operations", pillar: "Operations", format: "Founder POV", topic: "Automation", angle: "Human judgment", tone: "slate" },
    { views: 48000, likes: 1800, comments: 72, hook: "The demo is not the product", caption: "The workflow after the wow moment matters more.", cta: "Comment DEMO for the checklist", pillar: "Product", format: "Talking head", topic: "Product demos", angle: "Workflow proof", tone: "stone" },
  ],
  nick_saraev: [
    { views: 188000, likes: 9200, comments: 402, hook: "Nobody needs another morning routine", caption: "Build a system around your actual energy.", cta: "Save this for your next reset", pillar: "Personal systems", format: "Story", topic: "Routines", angle: "Energy-aware habits", tone: "sand" },
    { views: 126000, likes: 5800, comments: 210, hook: "The expensive mistake is usually invisible", caption: "Look for the cost your dashboard does not show.", cta: "Comment COST for the prompt", pillar: "Decision making", format: "Talking head", topic: "Hidden costs", angle: "Invisible tradeoffs", tone: "ink" },
    { views: 74000, likes: 3300, comments: 115, hook: "Consistency is not the same as repetition", caption: "Keep the promise stable and the proof fresh.", cta: "Follow for clearer creative systems", pillar: "Creative practice", format: "Founder POV", topic: "Consistency", angle: "Stable promise", tone: "slate" },
    { views: 39000, likes: 1400, comments: 58, hook: "One useful note beats ten saved posts", caption: "Turn inspiration into one experiment.", cta: "Save this and test it today", pillar: "Learning", format: "Tutorial", topic: "Learning loops", angle: "Action over collection", tone: "stone" },
  ],
};

const rawCompetitors: Record<string, Omit<Competitor, "trackedReelsCount" | "avgViews" | "avgEngagementRate">> = {
  raycfu: { handle: "raycfu", displayName: "Ray Fu", bio: "Product, growth, and founder systems.", category: "Founder content · Product", profileUrl: "https://www.instagram.com/raycfu/", followers: 128400, following: 612, totalPosts: 847, topPillar: "Product strategy", postingFreqPerWeek: 4.2, trendVsPrev30d: 18, source: "demo" },
  mavgpt: { handle: "mavgpt", displayName: "Mav GPT", bio: "Practical AI workflows for teams.", category: "AI · Operations", profileUrl: "https://www.instagram.com/mavgpt/", followers: 84200, following: 380, totalPosts: 504, topPillar: "AI workflows", postingFreqPerWeek: 3.4, trendVsPrev30d: 9, source: "demo" },
  nick_saraev: { handle: "nick_saraev", displayName: "Nick Saraev", bio: "Ideas for clearer work and better decisions.", category: "Creator · Systems", profileUrl: "https://www.instagram.com/nick_saraev/", followers: 56300, following: 219, totalPosts: 392, topPillar: "Personal systems", postingFreqPerWeek: 2.8, trendVsPrev30d: -4, source: "demo" },
};

export const demoCompetitors: Competitor[] = Object.entries(reelSpecs).map(([handle, specs]) => {
  const ranked = scoreAndRankReels(specs.map((spec, index) => makeReel(handle, index, spec)));
  const base = rawCompetitors[handle];
  return {
    ...base,
    trackedReelsCount: ranked.length,
    avgViews: averageMetric(ranked, "views"),
    avgEngagementRate: averageMetric(ranked, "engagementRate"),
  };
});

export const demoReelsByHandle: Record<string, Reel[]> = Object.fromEntries(
  Object.entries(reelSpecs).map(([handle, specs]) => [handle, scoreAndRankReels(specs.map((spec, index) => makeReel(handle, index, spec))) ]),
);

export function getDemoDataset(handle: string): DatasetResult {
  const normalized = handle.replace(/^@/, "").toLowerCase();
  const competitor = demoCompetitors.find((item) => item.handle === normalized) ?? demoCompetitors[0];
  return {
    competitor,
    reels: demoReelsByHandle[competitor.handle] ?? [],
    source: "demo",
    lastSynced: now.toISOString(),
    warning: "Demo fallback data — add SOCIALCRAWL_API_KEY to load live Instagram data.",
  };
}

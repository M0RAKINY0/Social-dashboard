import type { FrameworkStep, PlanIdea, Reel, ScriptDraft } from "./types";

export function buildFramework(reel: Pick<Reel, "analysis" | "hook" | "cta" | "topic">): FrameworkStep[] {
  const analysis = reel.analysis ?? {};
  const angle = analysis.angle ?? reel.topic ?? "a specific audience problem";
  return [
    { name: "HOOK", guidance: `Lead with a crisp ${analysis.hookType ?? "pattern interrupt"} about {common practice}. Keep it under two seconds.` },
    { name: "SETUP", guidance: `Establish why you can speak to ${angle} in one concrete line.` },
    { name: "TENSION", guidance: `Name the hidden cost or audience pain point: ${analysis.painPoint ?? "the result people keep overlooking"}.` },
    { name: "INSIGHT", guidance: `Deliver one original rule that reframes ${angle}; do not reuse the source wording.` },
    { name: "EXAMPLE", guidance: "Prove the rule with one specific number, moment, or before-and-after contrast from your own experience." },
    { name: "TRANSITION", guidance: "Turn the insight into one small action the viewer can try today." },
    { name: "CTA", guidance: `Invite a response using an original ask such as ${reel.cta ?? "a comment-keyword question"}.` },
  ];
}

export function generateOriginalScript(
  reel: Pick<Reel, "analysis" | "hook" | "cta" | "topic">,
  framework: FrameworkStep[],
  goal: "Grow followers" | "Drive comments" | "Sell" = "Grow followers",
): ScriptDraft {
  const analysis = reel.analysis ?? {};
  const angle = analysis.angle ?? reel.topic ?? "your audience's stuck point";
  const pain = analysis.painPoint ?? "the cost of repeating the usual approach";
  const cta = goal === "Drive comments" ? "Comment with the constraint you are working around." : goal === "Sell" ? "Save this and use it when you are ready to choose the next step." : "Follow for more practical breakdowns built from real experiments.";

  return {
    hook: `The fastest way to improve ${angle} is to stop optimizing the part everyone notices first.`,
    body: `Start with the constraint, not the tactic. When ${pain.toLowerCase()}, pick one visible signal and change one variable at a time. Use your own example to show the decision, the tradeoff, and the result.`,
    payoff: `The repeatable structure is ${framework.map((step) => step.name.toLowerCase()).join(" → ")}; the words and proof should come from your experience.`,
    cta,
    shotNotes: ["Open on a direct-to-camera line.", "Cut to one concrete proof point.", "End on the viewer's next action."],
    caption: `A practical way to rethink ${angle} without adding more noise.`,
    disclaimer: "Original draft — structure inspired by the source Reel, wording and proof must be your own.",
  };
}

export function buildPlanIdeas(reels: Reel[], competitorHandle: string): PlanIdea[] {
  return reels.slice(0, 3).map((reel, index) => ({
    id: `idea-${reel.id}`,
    title: `${reel.analysis?.angle ?? reel.pillar ?? "A sharper creator lesson"} from your own point of view`,
    suggestedHook: `What most people get wrong about ${reel.topic ?? "this problem"}`,
    pillar: reel.pillar ?? "Founder POV",
    suggestedCta: reel.cta ?? "Comment your constraint",
    priorityScore: Math.max(58, reel.performanceScore - index * 6),
    rationale: `Based on ${reel.format ?? "short-form"} Reels from @${competitorHandle}; use the structure as a starting point and supply original proof.`,
    sourceReelIds: [reel.id],
    status: index === 0 ? "ready" : "draft",
  }));
}

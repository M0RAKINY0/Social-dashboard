import type { Competitor, Reel, TranscriptLine } from "./types";

// SocialCrawl has several platform-specific optional shapes; normalization is the boundary where unknown JSON is narrowed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function record(value: unknown): AnyRecord {
  return value && typeof value === "object" ? (value as AnyRecord) : {};
}

function textOrNull(...values: unknown[]): string | null {
  const value = values.find((candidate) => typeof candidate === "string" && candidate.trim());
  return typeof value === "string" ? value.trim() : null;
}

function numberOrNull(...values: unknown[]): number | null {
  const value = values.find((candidate) => typeof candidate === "number" && Number.isFinite(candidate));
  return typeof value === "number" ? value : null;
}

function listOfTranscriptLines(value: unknown): TranscriptLine[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const lines = value
    .map((line) => {
      const item = record(line);
      const text = textOrNull(item.text, item.transcript, item.content);
      if (!text) return null;
      const normalized: TranscriptLine = {
        text,
        kind: item.kind === "hook" || item.kind === "cta" || item.kind === "beat" ? item.kind : "body",
      };
      const timestamp = numberOrNull(item.t, item.timestamp, item.start);
      if (timestamp !== null) normalized.t = timestamp;
      return normalized;
    })
    .filter((line): line is TranscriptLine => line !== null);
  return lines.length ? lines : undefined;
}

export function normalizeSocialCrawlProfile(raw: unknown, handle: string): Competitor {
  const root = record(raw);
  const data = record(root.data);
  const source = record(data.author ?? data.profile ?? root.author ?? data);
  const normalizedHandle = textOrNull(source.username, source.handle, handle) ?? handle;

  return {
    handle: normalizedHandle.replace(/^@/, "").toLowerCase(),
    displayName: textOrNull(source.display_name, source.displayName, source.name) ?? handle,
    avatarUrl: textOrNull(source.avatar_url, source.avatarUrl) ?? undefined,
    bio: textOrNull(source.bio) ?? undefined,
    category: textOrNull(source.category, data.category) ?? undefined,
    profileUrl: textOrNull(source.url, source.profile_url) ?? `https://www.instagram.com/${normalizedHandle}/`,
    followers: numberOrNull(source.followers, source.followers_count),
    following: numberOrNull(source.following, source.following_count),
    totalPosts: numberOrNull(source.posts_count, source.total_posts),
    trackedReelsCount: numberOrNull(data.reels_count, data.posts_count, source.reels_count) ?? 0,
    avgViews: numberOrNull(data.computed?.avg_views, data.avg_views),
    avgEngagementRate: numberOrNull(data.computed?.engagement_rate, data.engagement_rate),
    topPillar: textOrNull(data.computed?.top_pillar, data.top_pillar),
    postingFreqPerWeek: numberOrNull(data.computed?.posting_frequency, data.posting_frequency),
    trendVsPrev30d: numberOrNull(data.computed?.trend_vs_prev_30d),
    source: "live",
  };
}

export function normalizeSocialCrawlReel(raw: unknown, handle: string): Reel {
  const root = record(raw);
  const data = record(root.data);
  const post = record(root.post ?? data.post ?? raw);
  const content = record(post.content ?? post.media ?? post);
  const engagement = record(post.engagement ?? post.stats ?? {});
  const normalizedHandle = handle.replace(/^@/, "").toLowerCase();
  const transcript = listOfTranscriptLines(post.transcript ?? data.transcript);
  const mediaUrls = Array.isArray(content.media_urls) ? content.media_urls : [];

  return {
    id: textOrNull(post.id, post.pk, root.id) ?? `${normalizedHandle}-${Date.now()}`,
    competitorHandle: normalizedHandle,
    videoUrl: textOrNull(post.url, root.url) ?? undefined,
    thumbnailUrl: textOrNull(content.thumbnail_url, content.thumbnailUrl) ?? undefined,
    mediaUrl: textOrNull(content.video_url, content.videoUrl, mediaUrls.find((url) => typeof url === "string")) ?? undefined,
    caption: textOrNull(content.text, post.caption, post.content_text) ?? undefined,
    transcript,
    publishedAt: textOrNull(post.published_at, post.publishedAt) ?? new Date(0).toISOString(),
    views: numberOrNull(engagement.views, post.views, post.play_count),
    likes: numberOrNull(engagement.likes, post.likes, post.like_count),
    comments: numberOrNull(engagement.comments, post.comments, post.comment_count),
    shares: numberOrNull(engagement.shares, post.shares, post.share_count),
    saves: numberOrNull(engagement.saves, post.saves, post.save_count),
    durationSec: numberOrNull(content.duration_seconds, content.durationSec, post.duration),
    audioName: textOrNull(post.audio_name, post.audioName),
    hook: textOrNull(post.hook) ?? undefined,
    cta: textOrNull(post.cta) ?? undefined,
    topic: textOrNull(post.topic) ?? undefined,
    pillar: textOrNull(post.pillar, data.computed?.content_category) ?? undefined,
    format: textOrNull(post.format) as Reel["format"],
    performanceScore: 0,
    engagementRate: numberOrNull(post.computed?.engagement_rate, data.computed?.engagement_rate),
    source: "live",
  };
}

export function normalizeSocialCrawlReels(raw: unknown, handle: string): Reel[] {
  const root = record(raw);
  const data = record(root.data);
  const items = data.items ?? data.reels ?? data.posts ?? root.items ?? [];
  return Array.isArray(items)
    ? items.map((item) => normalizeSocialCrawlReel(record(item).post ?? item, handle))
    : [];
}

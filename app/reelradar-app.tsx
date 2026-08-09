"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CircleAlert, Filter, Info, RefreshCw, Settings2 } from "lucide-react";
import { buildPlanIdeas } from "../lib/templates";
import { demoCompetitors, getDemoDataset } from "../lib/fixtures";
import { formatCompactMetric } from "../lib/metrics";
import type { Competitor, DatasetResult, PlanIdea, PlanStatus, Reel } from "../lib/types";
import { ContentPlan } from "./components/content-plan";
import { MetricCards } from "./components/metric-card";
import { ProfileHeader } from "./components/profile-header";
import { ReelDrawer } from "./components/reel-drawer";
import { ReelGrid } from "./components/reel-grid";
import { ScriptGenerator } from "./components/script-generator";
import { Sidebar } from "./components/sidebar";
import { SortKey, TopBar } from "./components/top-bar";
import { Avatar, Pill, Skeleton, Toast } from "./components/ui";

export type View = "overview" | "analysis" | "library" | "plan" | "scripts" | "settings";
type FilterState = { pillar: string[]; format: string[] };

function initialDatasets(): Record<string, DatasetResult> {
  return Object.fromEntries(demoCompetitors.map((competitor) => [competitor.handle, getDemoDataset(competitor.handle)]));
}

function routeFor(view: View, handle: string) {
  if (view === "overview") return "/";
  if (view === "analysis") return `/competitors/${handle}`;
  if (view === "library") return "/reels";
  return `/${view}`;
}

function formatUpdated(value?: string) {
  if (!value) return "Awaiting first sync";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Awaiting first sync" : `Last synced ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="error-banner" role="alert"><CircleAlert size={16} /><span><strong>SocialCrawl connection issue</strong><small>{message}</small></span><button className="outline-button" onClick={onRetry}>Retry</button></div>;
}

function FilterPills({ reels, filters, onChange, onReset }: { reels: Reel[]; filters: FilterState; onChange: (next: FilterState) => void; onReset: () => void }) {
  const pillars = Array.from(new Set(reels.map((reel) => reel.pillar).filter(Boolean))) as string[];
  const formats = Array.from(new Set(reels.map((reel) => reel.format).filter(Boolean))) as string[];
  const toggle = (facet: "pillar" | "format", value: string) => {
    const active = filters[facet].includes(value);
    onChange({ ...filters, [facet]: active ? filters[facet].filter((item) => item !== value) : [...filters[facet], value] });
  };
  const activeCount = filters.pillar.length + filters.format.length;
  return <div className="filters-row"><span className="filter-label"><Filter size={14} />Filter by</span><button className={`filter-pill${!activeCount ? " filter-pill-active" : ""}`} onClick={onReset}>All</button>{pillars.map((pillar) => <button key={pillar} className={`filter-pill${filters.pillar.includes(pillar) ? " filter-pill-active" : ""}`} onClick={() => toggle("pillar", pillar)}>{pillar}</button>)}{formats.map((format) => <button key={format} className={`filter-pill filter-pill-format${filters.format.includes(format) ? " filter-pill-active" : ""}`} onClick={() => toggle("format", format)}>{format}</button>)}{activeCount ? <button className="filter-reset" onClick={onReset}>Reset</button> : null}</div>;
}

function OverviewView({ competitors, datasets, onSelect }: { competitors: Competitor[]; datasets: Record<string, DatasetResult>; onSelect: (handle: string) => void }) {
  const allReels = Object.values(datasets).flatMap((dataset) => dataset.reels).sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 6);
  return <div className="page-view overview-view"><div className="page-header"><div><span className="eyebrow">Cross-competitor signal</span><h1>Dashboard</h1><p>{competitors.length} competitors · last 30 days · find the pattern before you copy the format.</p></div><Pill tone="yellow">Live research surface</Pill></div><div className="summary-cards">{competitors.map((competitor) => { const dataset = datasets[competitor.handle]; return <button key={competitor.handle} className="summary-card" onClick={() => onSelect(competitor.handle)}><Avatar name={competitor.displayName} src={competitor.avatarUrl} size="md" active={competitor.handle === "raycfu"} /><span><strong>{competitor.displayName}</strong><small>@{competitor.handle} · {dataset.reels.length} reels</small></span><span className="summary-stat"><b>{formatCompactMetric(competitor.avgViews)}</b><small>avg views</small></span><span className={`summary-delta ${competitor.trendVsPrev30d && competitor.trendVsPrev30d >= 0 ? "positive" : "negative"}`}>{competitor.trendVsPrev30d && competitor.trendVsPrev30d >= 0 ? "▲" : "▼"} {Math.abs(competitor.trendVsPrev30d ?? 0)}%</span><ArrowRight size={15} /></button>; })}</div><div className="overview-layout"><div><div className="section-heading-row"><div><span className="eyebrow">Across your following list</span><h2>Top Reels across competitors</h2></div><span className="result-count">{allReels.length} standout reels</span></div><ReelGrid reels={allReels} selectedId={null} onAnalyze={() => onSelect(allReels[0]?.competitorHandle ?? competitors[0].handle)} /></div><aside className="patterns-rail"><div className="rail-card"><span className="eyebrow">This week&apos;s patterns</span><h3>What keeps showing up</h3><ul><li><strong>Negative hooks</strong><span>7 of top 10 Reels</span></li><li><strong>Talking head</strong><span>3.2× average ER</span></li><li><strong>Comment asks</strong><span>48% of top posts</span></li></ul></div><div className="rail-card rail-plan"><span className="eyebrow">Next to make</span><h3>Build from evidence</h3><p>Turn the strongest structure into an original version before the pattern gets stale.</p><button className="text-button" onClick={() => onSelect(competitors[0].handle)}>Open content plan <ArrowRight size={14} /></button></div></aside></div></div>;
}

function SettingsView({ onToast }: { onToast: (message: string, detail?: string) => void }) {
  return <div className="page-view settings-view"><div className="page-header"><div><span className="eyebrow">Workspace controls</span><h1>Settings</h1><p>Keep the demo camera-ready while your live data connection stays explicit.</p></div><Settings2 size={21} /></div><div className="settings-grid"><section className="settings-card"><span className="eyebrow">Data source</span><h2>SocialCrawl</h2><p>Live requests stay server-side. The current workspace renders a labeled demo fallback until an API key is configured.</p><div className="settings-status"><span className="status-dot status-dot-yellow" /><div><strong>Demo fallback active</strong><small>Ready for review · no credentials stored in the browser</small></div></div><button className="outline-button" onClick={() => onToast("Connection check queued", "Add SOCIALCRAWL_API_KEY to test live data")}>Check connection <RefreshCw size={14} /></button></section><section className="settings-card"><span className="eyebrow">Accessibility</span><h2>Motion &amp; focus</h2><p>ReelRadar honors your operating system&apos;s reduced-motion setting and keeps keyboard focus visible on every action.</p><label className="setting-toggle"><span><strong>Reduced motion</strong><small>Follow system preference</small></span><span className="toggle-on">AUTO</span></label><label className="setting-toggle"><span><strong>Camera density</strong><small>1440px demo layout</small></span><span className="toggle-on">DESKTOP</span></label></section></div></div>;
}

export function ReelRadarApp({ initialView = "analysis", initialHandle = "raycfu" }: { initialView?: View; initialHandle?: string }) {
  const [view, setView] = useState<View>(initialView);
  const [activeHandle, setActiveHandle] = useState(initialHandle.replace(/^@/, "").toLowerCase());
  const [datasets, setDatasets] = useState<Record<string, DatasetResult>>(initialDatasets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("performance");
  const [filters, setFilters] = useState<FilterState>({ pillar: [], format: [] });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const [scriptSourceId, setScriptSourceId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; detail?: string } | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const activeDataset = datasets[activeHandle] ?? datasets.raycfu;
  const activeCompetitor = activeDataset.competitor;
  const activeReels = activeDataset.reels;

  const navigate = (nextView: View, nextHandle = activeHandle) => {
    if (nextHandle !== activeHandle) {
      setLoading(true);
      setError(null);
      setFilters({ pillar: [], format: [] });
      setSearch("");
    }
    setView(nextView);
    setActiveHandle(nextHandle);
    setSelectedReelId(null);
    window.history.pushState({}, "", routeFor(nextView, nextHandle));
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      const handle = path.startsWith("/competitors/") ? path.split("/")[2] : activeHandle;
      const nextView: View = path === "/" ? "overview" : path.startsWith("/competitors/") ? "analysis" : path === "/reels" ? "library" : path.slice(1) as View;
      setView(["overview", "analysis", "library", "plan", "scripts", "settings"].includes(nextView) ? nextView : "analysis");
      setActiveHandle(handle || "raycfu");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [activeHandle]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/socialcrawl?handle=${encodeURIComponent(activeHandle)}&refresh=${refreshTick}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`Request failed with ${response.status}`); return response.json() as Promise<DatasetResult>; })
      .then((dataset) => setDatasets((current) => ({ ...current, [activeHandle]: dataset })))
      .catch((reason: unknown) => { if (reason instanceof DOMException && reason.name === "AbortError") return; setError("Showing the last available dataset. Retry when the API is reachable."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [activeHandle, refreshTick]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedReelId) params.set("reel", selectedReelId); else params.delete("reel");
    if (search) params.set("q", search); else params.delete("q");
    if (sort !== "performance") params.set("sort", sort); else params.delete("sort");
    window.history.replaceState({}, "", `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }, [selectedReelId, search, sort]);

  const filteredReels = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = activeReels.filter((reel) => {
      const matchesQuery = !query || [reel.hook, reel.caption, reel.pillar, reel.format, reel.cta].filter(Boolean).some((value) => value!.toLowerCase().includes(query));
      const matchesPillar = !filters.pillar.length || (reel.pillar ? filters.pillar.includes(reel.pillar) : false);
      const matchesFormat = !filters.format.length || (reel.format ? filters.format.includes(reel.format) : false);
      return matchesQuery && matchesPillar && matchesFormat;
    });
    return [...result].sort((a, b) => {
      if (sort === "views") return (b.views ?? -1) - (a.views ?? -1);
      if (sort === "engagement") return (b.engagementRate ?? -1) - (a.engagementRate ?? -1);
      if (sort === "comments") return (b.comments ?? -1) - (a.comments ?? -1);
      if (sort === "newest") return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
      return (b.performanceScore ?? 0) - (a.performanceScore ?? 0);
    });
  }, [activeReels, filters, search, sort]);

  const selectedReel = selectedReelId ? activeReels.find((reel) => reel.id === selectedReelId) : undefined;
  const sourceReel = scriptSourceId ? (activeReels.find((reel) => reel.id === scriptSourceId) ?? activeReels[0]) : activeReels[0];
  const [planOverrides, setPlanOverrides] = useState<Record<string, PlanIdea[]>>({});
  const planIdeas = planOverrides[activeHandle] ?? buildPlanIdeas(activeReels, activeHandle);

  const showToast = (message: string, detail?: string) => {
    setToast({ message, detail });
    window.setTimeout(() => setToast(null), 4200);
  };

  const openReel = (reel: Reel) => {
    setSelectedReelId(reel.id);
    lastTrigger.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
  };

  const closeDrawer = () => {
    setSelectedReelId(null);
    window.setTimeout(() => lastTrigger.current?.focus(), 0);
  };

  const moveDrawer = (direction: "prev" | "next") => {
    if (!selectedReel) return;
    const index = activeReels.findIndex((reel) => reel.id === selectedReel.id);
    const nextIndex = direction === "next" ? (index + 1) % activeReels.length : (index - 1 + activeReels.length) % activeReels.length;
    setSelectedReelId(activeReels[nextIndex]?.id ?? null);
  };

  const generateFor = (reel = selectedReel ?? sourceReel) => {
    if (!reel) return;
    setScriptSourceId(reel.id);
    closeDrawer();
    navigate("scripts", activeHandle);
  };

  const addToPlan = (reel = selectedReel) => {
    if (!reel) return;
    setPlanOverrides((currentByHandle) => {
      const current = currentByHandle[activeHandle] ?? buildPlanIdeas(activeReels, activeHandle);
      if (current.some((idea) => idea.sourceReelIds.includes(reel.id))) return currentByHandle;
      return { ...currentByHandle, [activeHandle]: [{ id: `idea-${reel.id}`, title: `${reel.analysis?.angle ?? reel.pillar ?? "New original idea"} from your own point of view`, suggestedHook: `What most people get wrong about ${reel.topic ?? "this problem"}`, pillar: reel.pillar ?? "Founder POV", suggestedCta: reel.cta ?? "Comment your constraint", priorityScore: reel.performanceScore, rationale: `Based on @${reel.competitorHandle} Reel #${reel.rank ?? "—"}; use its structure, not its words.`, sourceReelIds: [reel.id], status: "ready" }, ...current] };
    });
    showToast("Added to content plan", "Evidence link saved from this Reel");
  };

  const updatePlanStatus = (id: string, status: PlanStatus) => setPlanOverrides((currentByHandle) => ({ ...currentByHandle, [activeHandle]: (currentByHandle[activeHandle] ?? planIdeas).map((idea) => idea.id === id ? { ...idea, status } : idea) }));
  const createIdea = () => { if (activeReels[0]) addToPlan(activeReels[0]); navigate("plan", activeHandle); };
  const resetFilters = () => { setFilters({ pillar: [], format: [] }); setSearch(""); };
  const refreshData = () => { setLoading(true); setError(null); setRefreshTick((value) => value + 1); };

  const mainContent = view === "overview" ? <OverviewView competitors={demoCompetitors} datasets={datasets} onSelect={(handle) => navigate("analysis", handle)} /> : view === "plan" ? <ContentPlan ideas={planIdeas} reels={activeReels} onUpdateStatus={updatePlanStatus} onCreateIdea={createIdea} /> : view === "scripts" ? <div className="main-page-wrap"><ScriptGenerator sourceReel={sourceReel} onToast={showToast} /></div> : view === "settings" ? <SettingsView onToast={showToast} /> : <>
    {view === "analysis" ? <><ProfileHeader competitor={activeCompetitor} reels={activeReels} onGenerate={() => generateFor(activeReels[0])} /><MetricCards reels={activeReels} /></> : <div className="library-header"><div><span className="eyebrow">Shared research library</span><h1>Reel library</h1><p>All ranked Reels for @{activeHandle} in the last 30 days.</p></div><Pill tone="blue">{activeReels.length} analyzed</Pill></div>}
    {activeDataset.warning ? <div className={`data-notice data-notice-${activeDataset.source}`}><Info size={15} /><span>{activeDataset.warning}</span><span className="data-notice-meta">{formatUpdated(activeDataset.lastSynced)}</span></div> : null}
    {error ? <ErrorBanner message={error} onRetry={() => setRefreshTick((value) => value + 1)} /> : null}
    {loading && !activeReels.length ? <div className="reel-grid">{Array.from({ length: 6 }).map((_, index) => <div className="reel-card skeleton-card" key={index}><Skeleton className="skeleton-media" /><div className="skeleton-card-body"><Skeleton /><Skeleton /><Skeleton /></div></div>)}</div> : <><div className="feed-controls"><FilterPills reels={activeReels} filters={filters} onChange={setFilters} onReset={resetFilters} />{filtersOpen ? <div className="filter-popover"><strong>Filter facets</strong><span>Use the pills below the feed to combine pillars and formats.</span><button className="ghost-button" onClick={() => setFiltersOpen(false)}>Done</button></div> : null}</div><ReelGrid reels={filteredReels} selectedId={selectedReelId} onAnalyze={openReel} onReset={resetFilters} /></>}
  </>;

  return <main className="outer-frame"><div className={`app-container${collapsed ? " app-container-collapsed" : ""}`}><Sidebar competitors={demoCompetitors} activeHandle={activeHandle} view={view} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onNavigate={(nextView) => navigate(nextView, activeHandle)} onSelect={(handle) => navigate("analysis", handle)} /><div className="app-main"><TopBar search={search} sort={sort} activeFilterCount={filters.pillar.length + filters.format.length} source={activeDataset.source} lastSynced={activeDataset.lastSynced} onSearch={setSearch} onSort={setSort} onRefresh={refreshData} onToggleFilters={() => setFiltersOpen((value) => !value)} /><div className="main-content">{mainContent}</div></div></div>{selectedReel ? <ReelDrawer reel={selectedReel} competitor={activeCompetitor} averageViews={activeCompetitor.avgViews} averageEr={activeCompetitor.avgEngagementRate} onClose={closeDrawer} onMove={moveDrawer} onGenerate={() => generateFor(selectedReel)} onAddToPlan={() => addToPlan(selectedReel)} onToast={showToast} /> : null}{toast ? <Toast message={toast.message} detail={toast.detail} action={view === "plan" ? undefined : "View plan"} onAction={() => navigate("plan", activeHandle)} onClose={() => setToast(null)} /> : null}</main>;
}

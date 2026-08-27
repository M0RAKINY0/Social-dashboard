"use client";

import {
  ArrowDownWideNarrow,
  Calendar,
  ChevronDown,
  Download,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export type SortKey = "performance" | "views" | "engagement" | "comments" | "newest";

export function TopBar({
  search,
  sort,
  activeFilterCount,
  source,
  lastSynced,
  onSearch,
  onSort,
  onRefresh,
  onToggleFilters,
}: {
  search: string;
  sort: SortKey;
  activeFilterCount: number;
  source: "live" | "demo" | "unavailable";
  lastSynced?: string;
  onSearch: (value: string) => void;
  onSort: (value: SortKey) => void;
  onRefresh: () => void;
  onToggleFilters: () => void;
}) {
  return (
    <header className="top-bar">
      <label className="search-field">
        <Search size={15} strokeWidth={1.7} />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search reels, hooks, captions…" aria-label="Search reels, hooks, captions" />
        <kbd>/</kbd>
      </label>
      <button className="control-pill" aria-label="Date range: last 30 days">
        <Calendar size={15} /><span>Last 30 days</span><ChevronDown size={14} />
      </button>
      <button className={`control-pill filter-trigger${activeFilterCount ? " filter-trigger-active" : ""}`} onClick={onToggleFilters}>
        <SlidersHorizontal size={15} /><span>Filters</span>{activeFilterCount ? <b>{activeFilterCount}</b> : null}
      </button>
      <label className="sort-control">
        <ArrowDownWideNarrow size={15} />
        <select value={sort} onChange={(event) => onSort(event.target.value as SortKey)} aria-label="Sort reels">
          <option value="performance">Performance</option>
          <option value="views">Views</option>
          <option value="engagement">Engagement rate</option>
          <option value="comments">Comments</option>
          <option value="newest">Newest</option>
        </select>
        <ChevronDown size={14} />
      </label>
      <span className="top-bar-spacer" />
      <span className={`source-status source-${source}`} title={lastSynced ? `Last synced ${new Date(lastSynced).toLocaleString()}` : undefined}>
        <span className="status-dot" />{source === "live" ? "Live data" : source === "unavailable" ? "Data unavailable" : "Demo data"}
      </span>
      <button className="icon-button" onClick={onRefresh} aria-label="Refresh SocialCrawl data" title="Refresh data"><RefreshCw size={16} /></button>
      <button className="top-export"><Download size={15} />Export</button>
    </header>
  );
}

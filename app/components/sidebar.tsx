"use client";

import {
  CalendarRange,
  Clapperboard,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Settings,
  Users,
} from "lucide-react";
import type { Competitor } from "../../lib/types";
import { Avatar, initials, Pill } from "./ui";

type View = "overview" | "analysis" | "library" | "plan" | "scripts" | "settings";

const navigation: { label: string; view: View; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", view: "overview", icon: LayoutDashboard },
  { label: "Competitors", view: "analysis", icon: Users },
  { label: "Reel Library", view: "library", icon: Clapperboard },
  { label: "Content Plan", view: "plan", icon: CalendarRange },
  { label: "Scripts", view: "scripts", icon: FileText },
  { label: "Settings", view: "settings", icon: Settings },
];

export function Sidebar({
  competitors,
  activeHandle,
  view,
  collapsed,
  onToggle,
  onNavigate,
  onSelect,
}: {
  competitors: Competitor[];
  activeHandle: string;
  view: View;
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: (nextView: View) => void;
  onSelect: (handle: string) => void;
}) {
  return (
    <aside className={`sidebar${collapsed ? " sidebar-collapsed" : ""}`}>
      <div className="sidebar-brand-row">
        <button className="icon-button sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeft size={17} /> : <Menu size={17} />}
        </button>
        <button className="brand" onClick={() => onNavigate("overview")} aria-label="Go to ReelRadar dashboard">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-wordmark">ReelRadar</span>
        </button>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        {navigation.map(({ label, view: targetView, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item${view === targetView ? " nav-item-active" : ""}`}
            onClick={() => onNavigate(targetView)}
            aria-current={view === targetView ? "page" : undefined}
            title={collapsed ? label : undefined}
          >
            <Icon size={16} strokeWidth={1.7} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />
      <div className="following-heading">
        <span>Following competitors</span>
        <Pill tone="stone">{competitors.length}</Pill>
      </div>
      <div className="competitor-list">
        {competitors.map((competitor) => {
          const active = competitor.handle === activeHandle;
          const delta = competitor.trendVsPrev30d;
          return (
            <button
              key={competitor.handle}
              className={`competitor-row${active ? " competitor-row-active" : ""}`}
              onClick={() => onSelect(competitor.handle)}
              aria-current={active ? "page" : undefined}
              title={collapsed ? `@${competitor.handle}` : undefined}
            >
              <Avatar name={competitor.displayName} src={competitor.avatarUrl} size="md" active={active} />
              <span className="competitor-copy">
                <strong>{competitor.displayName}</strong>
                <small>@{competitor.handle} · {competitor.trackedReelsCount} reels</small>
              </span>
              <span className={`delta-chip ${delta === null || delta === undefined ? "delta-neutral" : delta >= 0 ? "delta-positive" : "delta-negative"}`}>
                {delta === null || delta === undefined ? "—" : `${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)}%`}
              </span>
            </button>
          );
        })}
        <button className="track-competitor" onClick={() => onNavigate("settings")}>
          <span className="track-plus">+</span>
          <span>Track competitor</span>
        </button>
      </div>

      <div className="sidebar-spacer" />
      <div className="sidebar-account">
        <Avatar name="Jordan Lee" size="sm" />
        <span className="account-copy"><strong>Jordan Lee</strong><small>Founder workspace</small></span>
        <Pill tone="dark">PRO</Pill>
        <button className="icon-button" aria-label="Open account menu"><MoreHorizontal size={16} /></button>
      </div>
    </aside>
  );
}

export { initials };

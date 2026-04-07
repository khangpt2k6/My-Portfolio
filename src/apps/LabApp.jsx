import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paintbrush, BarChart3, Grid3X3, GitBranch, FlaskConical } from "lucide-react";
import Playground from "../components/Playground";
import {
  SortingVisualizer,
  PathfindingVisualizer,
  TreeVisualizer,
} from "../components/AlgoVisualizer";

const TABS = [
  {
    id: "playground",
    label: "Artpad",
    icon: Paintbrush,
    description: "Sketch UI ideas and concepts",
  },
  {
    id: "sorting",
    label: "Sorting",
    icon: BarChart3,
    description: "Compare sorting behavior",
  },
  {
    id: "pathfinding",
    label: "Pathfinding",
    icon: Grid3X3,
    description: "Explore shortest-path logic",
  },
  {
    id: "tree",
    label: "Tree",
    icon: GitBranch,
    description: "Visualize tree operations",
  },
];

export default function LabApp() {
  const [active, setActive] = useState("playground");
  const tab = TABS.find((t) => t.id === active);

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--window-bg)" }}>
      {/* ── Header ── */}
      <div
        className="px-3 py-2 border-b flex items-center justify-between gap-3"
        style={{ borderColor: "var(--glass-border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[var(--color-surface2)] border border-[var(--glass-border)] flex items-center justify-center">
            <FlaskConical size={14} className="text-[var(--color-text-muted)]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[var(--color-text)] leading-none">Feature Lab</p>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Structured experimentation workspace</p>
          </div>
        </div>
        <span className="text-[10px] text-[var(--color-text-muted)] hidden sm:block">
          {tab?.description}
        </span>
      </div>

      {/* ── Segmented tabs ── */}
      <div
        className="flex items-center gap-1 px-2 py-1.5 border-b overflow-x-auto"
        style={{ borderColor: "var(--glass-border)" }}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap border"
              style={{
                color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                background: isActive ? "var(--color-surface2)" : "transparent",
                borderColor: isActive ? "var(--color-border)" : "transparent",
              }}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Workflow helper bar ── */}
      <div className="px-3 py-1.5 text-[10px] text-[var(--color-text-muted)] border-b border-[var(--glass-border)]">
        Tip: start with preset data, then tweak one parameter at a time for clearer comparisons.
      </div>

      {/* ── Content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full overflow-auto"
          >
            {active === "playground" && (
              <div className="h-full">
                <Playground embedded />
              </div>
            )}
            {active === "sorting" && (
              <div className="p-3 h-full flex flex-col bg-[var(--color-surface)]/60">
                <SortingVisualizer />
              </div>
            )}
            {active === "pathfinding" && (
              <div className="p-3 h-full flex flex-col bg-[var(--color-surface)]/60">
                <PathfindingVisualizer />
              </div>
            )}
            {active === "tree" && (
              <div className="p-3 h-full flex flex-col bg-[var(--color-surface)]/60">
                <TreeVisualizer />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

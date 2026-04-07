import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paintbrush, BarChart3, Grid3X3, GitBranch, FlaskConical } from "lucide-react";
import Playground from "../components/Playground";
import { SortingVisualizer, PathfindingVisualizer, TreeVisualizer } from "../components/AlgoVisualizer";

// ── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "playground",
    label: "Artpad",
    icon: Paintbrush,
    desc: "Draw & create",
  },
  {
    id: "sorting",
    label: "Sorting",
    icon: BarChart3,
    desc: "Algorithm races",
  },
  {
    id: "pathfinding",
    label: "Pathfinding",
    icon: Grid3X3,
    desc: "Shortest path",
  },
  {
    id: "tree",
    label: "Binary Tree",
    icon: GitBranch,
    desc: "Tree structures",
  },
];

// ── Sidebar tab button ──────────────────────────────────────────────────────
function SidebarTab({ tab, isActive, onClick }) {
  const Icon = tab.icon;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
        isActive ? "" : "hover:bg-[var(--color-surface2)]/80"
      }`}
    >
      {/* Active background */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl"
          style={{
            background: "var(--color-surface2)",
            border: "1px solid var(--color-border)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {/* Icon */}
      <div
        className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
          isActive ? "bg-[var(--color-bg)] border border-[var(--color-border)]" : "bg-[var(--color-surface2)]"
        }`}
      >
        <Icon
          size={16}
          className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
        />
      </div>

      {/* Text */}
      <div className="relative z-10 min-w-0">
        <span
          className={`text-sm font-semibold block leading-tight transition-colors duration-200 ${
            isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]"
          }`}
        >
          {tab.label}
        </span>
        <span
          className={`text-[10px] leading-tight transition-colors duration-200 ${
            isActive ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-muted)]/50"
          }`}
        >
          {tab.desc}
        </span>
      </div>
    </motion.button>
  );
}

// ── Main Lab Page ───────────────────────────────────────────────────────────
const Lab = () => {
  const [activeTab, setActiveTab] = useState("playground");

  return (
    <section className="relative min-h-screen pt-20 pb-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
      {/* ── Two-column layout ── */}
      <div className="relative z-10 flex gap-5 h-[calc(100vh-6rem)]">

        {/* ═══ LEFT SIDEBAR ═══ */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col w-56 shrink-0 rounded-2xl border border-[var(--color-border)] overflow-hidden"
          style={{
            background: "var(--glass-bg, var(--color-surface))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                <FlaskConical size={14} className="text-[var(--color-primary)]" />
              </div>
              <span className="text-sm font-bold text-[var(--color-text)]">Lab</span>
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] leading-snug">
              Interactive experiments
            </p>
          </div>

          {/* Tab list */}
          <nav className="flex-1 p-2 space-y-1">
            {TABS.map((tab) => (
              <SidebarTab
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>

          {/* Keyboard hints */}
          <div className="p-3 border-t border-[var(--color-border)]">
            <div className="flex flex-col gap-1.5 text-[9px] text-[var(--color-text-muted)]/50">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1 py-0.5 rounded bg-[var(--color-surface2)] border border-[var(--color-border)] font-mono text-[8px]">
                  Space
                </kbd>
                <span>play / pause</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1 py-0.5 rounded bg-[var(--color-surface2)] border border-[var(--color-border)] font-mono text-[8px]">
                  ← →
                </kbd>
                <span>step through</span>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-0 flex flex-col"
        >
          {/* Mobile tab bar (visible < lg) */}
          <div className="flex lg:hidden items-center gap-1 p-1 mb-4 rounded-xl bg-[var(--color-surface2)] border border-[var(--color-border)] overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200"
                  style={{
                    color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                    backgroundColor: isActive ? "var(--color-bg)" : "transparent",
                    border: isActive ? "1px solid var(--color-border)" : "1px solid transparent",
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content panel */}
          <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-[var(--color-border)]"
            style={{
              background: "var(--glass-bg, var(--color-surface))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Workflow helper */}
            <div className="px-4 sm:px-5 py-2 text-[11px] text-[var(--color-text-muted)] border-b border-[var(--color-border)] bg-[var(--color-surface2)]/55">
              Workflow: choose a module, run a baseline, then change one control at a time to compare behavior.
            </div>

            {/* Scrollable content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-[calc(100%-39px)] overflow-y-auto"
              >
                {activeTab === "playground" ? (
                  <div className="h-full">
                    <Playground embedded />
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 h-full flex flex-col">
                    {activeTab === "sorting" && <SortingVisualizer />}
                    {activeTab === "pathfinding" && <PathfindingVisualizer />}
                    {activeTab === "tree" && <TreeVisualizer />}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </section>
  );
};

export default Lab;

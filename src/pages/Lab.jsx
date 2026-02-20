import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paintbrush, BarChart3, Grid3X3, GitBranch } from "lucide-react";
import Playground from "../components/Playground";
import { SortingVisualizer, PathfindingVisualizer, TreeVisualizer } from "../components/AlgoVisualizer";

// ── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "playground", label: "Artpad", icon: Paintbrush, desc: "Draw, paint & create — like Paint" },
  { id: "sorting", label: "Sorting", icon: BarChart3, desc: "Watch algorithms race to sort" },
  { id: "pathfinding", label: "Pathfinding", icon: Grid3X3, desc: "Find the shortest path" },
  { id: "tree", label: "Binary Tree", icon: GitBranch, desc: "Explore tree structures" },
];

const Lab = () => {
  const [activeTab, setActiveTab] = useState("playground");

  return (
    <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
          Interactive <span style={{ color: "var(--color-primary)" }}>Lab</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm max-w-lg mx-auto">
          Paint, draw & create art, explore sorting algorithms, pathfinding, and data structures — all interactive.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--color-surface2)] border border-[var(--color-border)]">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                style={{
                  color: isActive ? "#fff" : "var(--color-text-muted)",
                  backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                }}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "playground" && (
            <Playground embedded />
          )}
          {activeTab !== "playground" && (
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--color-border)]">
              {activeTab === "sorting" && <SortingVisualizer />}
              {activeTab === "pathfinding" && <PathfindingVisualizer />}
              {activeTab === "tree" && <TreeVisualizer />}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Lab;
